use crate::converter::{ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::ImageFormat;
use std::fs;

pub struct WebPConverter;

impl ImageConverter for WebPConverter {
    fn name(&self) -> &'static str {
        "WebP"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Webp { .. })
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let quality = match &params.options {
            FormatOptions::Webp { quality } => *quality,
            _ => None,
        };

        let img = image::open(&params.input_path)?;

        match quality {
            None => {
                // Lossless encoding via the image crate's built-in webp encoder.
                img.save_with_format(&params.output_path, ImageFormat::WebP)?;
            }
            Some(q) => {
                // Lossy encoding via the `webp` crate (libwebp FFI).
                // quality=100 means near-lossless; use None branch for true lossless.
                let rgba = img.to_rgba8();
                let (width, height) = rgba.dimensions();
                let encoder = ::webp::Encoder::from_rgba(rgba.as_raw(), width, height);
                let encoded = encoder.encode(q);
                fs::write(&params.output_path, &*encoded)?;
            }
        }
        Ok(())
    }
}
