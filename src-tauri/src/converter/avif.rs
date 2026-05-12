use crate::converter::{binary_search_quality, maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::DynamicImage;
use ravif::{Encoder, Img, RGBA8};

pub struct AvifConverter;

fn avif_to_bytes(img: &DynamicImage, quality: f32) -> Result<Vec<u8>, ConvertError> {
    let rgba = img.to_rgba8();
    let (w, h) = (rgba.width() as usize, rgba.height() as usize);
    let pixels: Vec<RGBA8> = rgba
        .pixels()
        .map(|p| RGBA8::new(p[0], p[1], p[2], p[3]))
        .collect();
    let result = Encoder::new()
        .with_quality(quality)
        .with_alpha_quality(quality)
        .with_speed(6)
        .encode_rgba(Img::new(&pixels, w, h))
        .map_err(|e| ConvertError::Encode(e.to_string()))?;
    Ok(result.avif_file)
}

impl ImageConverter for AvifConverter {
    fn name(&self) -> &'static str {
        "AVIF"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Avif { .. })
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let quality = match &params.options {
            FormatOptions::Avif { quality } => *quality,
            _ => 80.0,
        };

        let img = super::open_image(&params.input_path)?;
        let img = maybe_resize(img, &params.resize);

        let data = if let Some(target) = params.target_size_bytes {
            binary_search_quality(target, 1, (quality as u8).min(100), |q| {
                avif_to_bytes(&img, q as f32)
            })?
        } else {
            avif_to_bytes(&img, quality)?
        };

        std::fs::write(&params.output_path, data)?;
        Ok(())
    }
}
