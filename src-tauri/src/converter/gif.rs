use crate::converter::{maybe_resize, ConvertParams, FormatOptions, ImageConverter};
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
        let img = super::open_image(&params.input_path)?;
        let img = maybe_resize(img, &params.resize);
        img.save_with_format(&params.output_path, ImageFormat::Gif)?;
        Ok(())
    }
}
