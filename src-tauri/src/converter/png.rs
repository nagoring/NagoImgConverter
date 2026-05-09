use crate::converter::{ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::ImageFormat;

pub struct PngConverter;

impl ImageConverter for PngConverter {
    fn name(&self) -> &'static str {
        "PNG"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Png)
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let img = image::open(&params.input_path)?;
        // PNG preserves RGBA transparency automatically.
        img.save_with_format(&params.output_path, ImageFormat::Png)?;
        Ok(())
    }
}
