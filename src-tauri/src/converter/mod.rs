pub mod avif;
pub mod bmp;
pub mod gif;
pub mod ico;
pub mod jpeg;
pub mod png;
pub mod tiff;
pub mod webp;
mod tests;

use crate::bg_removal::BgRemover;
use crate::error::ConvertError;
use image::{imageops::FilterType, DynamicImage};
use serde::Deserialize;
use std::path::PathBuf;
use std::sync::Arc;

fn default_jpeg_quality() -> u8 {
    85
}

fn default_avif_quality() -> f32 {
    80.0
}

/// Per-format encoder options (serde-tagged for JSON deserialization from JS).
#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "format", rename_all = "lowercase")]
pub enum FormatOptions {
    Png {
        #[serde(default)]
        optimize: bool,
    },
    Jpeg {
        #[serde(default = "default_jpeg_quality")]
        quality: u8, // 1-100
    },
    Webp {
        #[serde(default)]
        quality: Option<f32>, // None=lossless, Some(0..=100)=lossy
    },
    Gif,
    Bmp,
    Tiff,
    Avif {
        #[serde(default = "default_avif_quality")]
        quality: f32, // 1-100
    },
    Ico,
}

impl FormatOptions {
    pub fn extension(&self) -> &'static str {
        match self {
            Self::Png { .. } => "png",
            Self::Jpeg { .. } => "jpg",
            Self::Webp { .. } => "webp",
            Self::Gif => "gif",
            Self::Bmp => "bmp",
            Self::Tiff => "tiff",
            Self::Avif { .. } => "avif",
            Self::Ico => "ico",
        }
    }
}

// ── Resize ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ResizeMode {
    WidthHeight,
    LongSide,
    Percent,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ResizeFilter {
    Lanczos3,
    Bilinear,
    Nearest,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResizeParams {
    pub mode: ResizeMode,
    pub filter: ResizeFilter,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub long_side: Option<u32>,
    pub percent: Option<f32>,
}

pub fn apply_resize(img: DynamicImage, r: &ResizeParams) -> DynamicImage {
    let filter = match r.filter {
        ResizeFilter::Lanczos3 => FilterType::Lanczos3,
        ResizeFilter::Bilinear => FilterType::Triangle,
        ResizeFilter::Nearest => FilterType::Nearest,
    };
    let (w, h) = (img.width(), img.height());
    match r.mode {
        ResizeMode::WidthHeight => {
            let nw = r.width.unwrap_or(w);
            let nh = r.height.unwrap_or(h);
            img.resize(nw, nh, filter)
        }
        ResizeMode::LongSide => {
            let size = r.long_side.unwrap_or(w.max(h));
            if w >= h {
                img.resize(size, u32::MAX, filter)
            } else {
                img.resize(u32::MAX, size, filter)
            }
        }
        ResizeMode::Percent => {
            let pct = r.percent.unwrap_or(100.0);
            let nw = ((w as f32 * pct / 100.0).round() as u32).max(1);
            let nh = ((h as f32 * pct / 100.0).round() as u32).max(1);
            img.resize_exact(nw, nh, filter)
        }
    }
}

pub fn maybe_resize(img: DynamicImage, resize: &Option<ResizeParams>) -> DynamicImage {
    match resize {
        Some(r) => apply_resize(img, r),
        None => img,
    }
}

// ── Converter trait ───────────────────────────────────────────────────────────

/// Parameters passed to every converter.
#[derive(Debug, Clone)]
pub struct ConvertParams {
    pub input_path: PathBuf,
    pub output_path: PathBuf,
    pub options: FormatOptions,
    pub preserve_metadata: bool,
    pub resize: Option<ResizeParams>,
    pub target_size_bytes: Option<u64>,
    pub bg_remover: Option<Arc<BgRemover>>,
}

/// Binary-search the highest quality (lo..=hi) whose encoded output fits
/// within `target_bytes`. Returns the best result found; falls back to `lo`
/// if nothing fits.
pub fn binary_search_quality<F>(
    target_bytes: u64,
    lo: u8,
    hi: u8,
    mut encode: F,
) -> Result<Vec<u8>, ConvertError>
where
    F: FnMut(u8) -> Result<Vec<u8>, ConvertError>,
{
    let (mut lo, mut hi) = (lo as i32, hi as i32);
    let mut best = encode(lo as u8)?; // lowest quality as fallback
    while lo <= hi {
        let mid = (lo + hi) / 2;
        let data = encode(mid as u8)?;
        if data.len() as u64 <= target_bytes {
            best = data;
            lo = mid + 1; // try higher quality
        } else {
            hi = mid - 1; // try lower quality
        }
    }
    Ok(best)
}

/// Core converter trait. Each output format implements this.
pub trait ImageConverter: Send + Sync {
    fn name(&self) -> &'static str;
    fn accepts(&self, options: &FormatOptions) -> bool;
    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError>;
}

/// Registry of all available converters.
pub struct ConverterRegistry {
    converters: Vec<Box<dyn ImageConverter>>,
}

impl ConverterRegistry {
    pub fn new() -> Self {
        Self {
            converters: vec![
                Box::new(png::PngConverter),
                Box::new(jpeg::JpegConverter),
                Box::new(webp::WebPConverter),
                Box::new(gif::GifConverter),
                Box::new(bmp::BmpConverter),
                Box::new(tiff::TiffConverter),
                Box::new(avif::AvifConverter),
                Box::new(ico::IcoConverter),
            ],
        }
    }

    pub fn find(&self, options: &FormatOptions) -> Option<&dyn ImageConverter> {
        self.converters
            .iter()
            .find(|c| c.accepts(options))
            .map(|c| c.as_ref())
    }
}
