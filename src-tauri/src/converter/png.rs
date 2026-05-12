use crate::converter::{maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::{DynamicImage, ImageFormat};
use std::io::Cursor;

pub struct PngConverter;

impl ImageConverter for PngConverter {
    fn name(&self) -> &'static str {
        "PNG"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Png { .. })
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let optimize = match &params.options {
            FormatOptions::Png { optimize } => *optimize,
            _ => false,
        };

        let img = super::open_image(&params.input_path)?;
        let img = maybe_resize(img, &params.resize);
        let img = match &params.bg_remover {
            Some(r) => r.remove(&img)?,
            None => img,
        };

        // Strip alpha channel when all pixels are fully opaque.
        let img = if optimize && img.color().has_alpha() {
            let rgba = img.to_rgba8();
            if rgba.pixels().all(|p| p[3] == 255) {
                DynamicImage::ImageRgb8(img.to_rgb8())
            } else {
                img
            }
        } else {
            img
        };

        if optimize {
            let mut buf = Vec::new();
            img.write_to(&mut Cursor::new(&mut buf), ImageFormat::Png)?;

            let mut opts = oxipng::Options::from_preset(1);
            opts.strip = oxipng::StripChunks::All;

            let optimized = oxipng::optimize_from_memory(&buf, &opts)
                .map_err(|e| ConvertError::Encode(e.to_string()))?;

            std::fs::write(&params.output_path, optimized)?;
        } else {
            img.save_with_format(&params.output_path, ImageFormat::Png)?;
        }

        Ok(())
    }
}
