use crate::converter::{ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::ImageFormat;

pub struct GifConverter;

impl ImageConverter for GifConverter {
    fn name(&self) -> &'static str {
        "GIF"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Gif)
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        // Single-frame GIF encoding. Multi-frame animated GIF from animated source
        // uses the first frame only (v1 scope limitation).
        let img = image::open(&params.input_path)?;
        img.save_with_format(&params.output_path, ImageFormat::Gif)?;
        Ok(())
    }
}
