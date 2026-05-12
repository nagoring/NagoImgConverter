#[cfg(target_os = "macos")]
use crate::error::ConvertError;
#[cfg(target_os = "macos")]
use image::DynamicImage;
#[cfg(target_os = "macos")]
use libheif_rs::{ColorSpace, HeifContext, LibHeif, RgbChroma};
#[cfg(target_os = "macos")]
use std::path::Path;

#[cfg(target_os = "macos")]
pub fn decode(path: &Path) -> Result<DynamicImage, ConvertError> {
    let path_str = path
        .to_str()
        .ok_or_else(|| ConvertError::Decode("invalid path".into()))?;

    let lib = LibHeif::new();
    let ctx = HeifContext::read_from_file(path_str)
        .map_err(|e| ConvertError::Decode(e.to_string()))?;
    let handle = ctx
        .primary_image_handle()
        .map_err(|e| ConvertError::Decode(e.to_string()))?;

    let has_alpha = handle.has_alpha_channel();
    let chroma = if has_alpha { RgbChroma::Rgba } else { RgbChroma::Rgb };

    let img = lib
        .decode(&handle, ColorSpace::Rgb(chroma), None)
        .map_err(|e| ConvertError::Decode(e.to_string()))?;

    let width = img.width();
    let height = img.height();
    let planes = img.planes();
    let interleaved = planes
        .interleaved
        .ok_or_else(|| ConvertError::Decode("no interleaved plane in HEIC".into()))?;

    let stride = interleaved.stride;
    let data = interleaved.data;
    let bytes_per_px: usize = if has_alpha { 4 } else { 3 };

    let mut pixels = Vec::with_capacity(width as usize * height as usize * bytes_per_px);
    for row in 0..height as usize {
        let start = row * stride;
        pixels.extend_from_slice(&data[start..start + width as usize * bytes_per_px]);
    }

    if has_alpha {
        image::RgbaImage::from_raw(width, height, pixels)
            .map(DynamicImage::ImageRgba8)
            .ok_or_else(|| ConvertError::Decode("RgbaImage::from_raw failed".into()))
    } else {
        image::RgbImage::from_raw(width, height, pixels)
            .map(DynamicImage::ImageRgb8)
            .ok_or_else(|| ConvertError::Decode("RgbImage::from_raw failed".into()))
    }
}
