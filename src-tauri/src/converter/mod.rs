pub mod bmp;
pub mod gif;
pub mod jpeg;
pub mod png;
pub mod webp;

use crate::error::ConvertError;
use serde::Deserialize;
use std::path::PathBuf;

fn default_jpeg_quality() -> u8 {
    85
}

/// Per-format encoder options (serde-tagged for JSON deserialization from JS).
#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "format", rename_all = "lowercase")]
pub enum FormatOptions {
    Png,
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
    // Extension point: add Heic, Avif, Tiff variants here in future versions
}

impl FormatOptions {
    pub fn extension(&self) -> &'static str {
        match self {
            Self::Png => "png",
            Self::Jpeg { .. } => "jpg",
            Self::Webp { .. } => "webp",
            Self::Gif => "gif",
            Self::Bmp => "bmp",
        }
    }
}

/// Parameters passed to every converter.
#[derive(Debug, Clone)]
pub struct ConvertParams {
    pub input_path: PathBuf,
    pub output_path: PathBuf,
    pub options: FormatOptions,
    pub preserve_metadata: bool, // v1: stored but ignored; ready for EXIF support later
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
