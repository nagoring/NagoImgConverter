use crate::converter::{maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use ravif::{Encoder, Img, RGBA8};

pub struct AvifConverter;

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

        let img = image::open(&params.input_path)?;
        let img = maybe_resize(img, &params.resize);

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

        std::fs::write(&params.output_path, result.avif_file)?;
        Ok(())
    }
}
