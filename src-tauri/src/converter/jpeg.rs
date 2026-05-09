use crate::converter::{ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::DynamicImage;
use std::fs::File;
use std::io::BufWriter;

pub struct JpegConverter;

impl ImageConverter for JpegConverter {
    fn name(&self) -> &'static str {
        "JPEG"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Jpeg { .. })
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let quality = match &params.options {
            FormatOptions::Jpeg { quality } => *quality,
            _ => 85,
        };

        let img = image::open(&params.input_path)?;

        // JPEG has no alpha channel. Composite transparency onto a white background.
        let rgb = DynamicImage::ImageRgb8(img.to_rgb8());

        let file = File::create(&params.output_path)?;
        let mut writer = BufWriter::new(file);
        let mut encoder =
            image::codecs::jpeg::JpegEncoder::new_with_quality(&mut writer, quality);
        encoder
            .encode_image(&rgb)
            .map_err(|e| ConvertError::Encode(e.to_string()))?;
        Ok(())
    }
}
