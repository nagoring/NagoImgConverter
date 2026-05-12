use crate::converter::{binary_search_quality, maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::ImageFormat;

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
        let img = maybe_resize(img, &params.resize);
        let img = match &params.bg_remover {
            Some(r) => r.remove(&img)?,
            None => img,
        };

        match quality {
            None => {
                // Lossless — no binary search possible.
                img.save_with_format(&params.output_path, ImageFormat::WebP)?;
            }
            Some(q) => {
                let rgba = img.to_rgba8();
                let (w, h) = rgba.dimensions();

                let encode = |qq: u8| {
                    let enc = ::webp::Encoder::from_rgba(rgba.as_raw(), w, h);
                    Ok((*enc.encode(qq as f32)).to_vec())
                };

                let data = if let Some(target) = params.target_size_bytes {
                    binary_search_quality(target, 1, (q as u8).min(99), encode)?
                } else {
                    let enc = ::webp::Encoder::from_rgba(rgba.as_raw(), w, h);
                    (*enc.encode(q)).to_vec()
                };

                std::fs::write(&params.output_path, data)?;
            }
        }
        Ok(())
    }
}
