use crate::converter::{maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::ImageFormat;

pub struct BmpConverter;

impl ImageConverter for BmpConverter {
    fn name(&self) -> &'static str {
        "BMP"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Bmp)
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let img = image::open(&params.input_path)?;
        let img = maybe_resize(img, &params.resize);
        img.save_with_format(&params.output_path, ImageFormat::Bmp)?;
        Ok(())
    }
}
