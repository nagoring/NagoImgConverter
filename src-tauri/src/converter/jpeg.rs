use crate::converter::{binary_search_quality, maybe_resize, ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use image::DynamicImage;

pub struct JpegConverter;

fn encode_jpeg(img: &DynamicImage, quality: u8) -> Result<Vec<u8>, ConvertError> {
    let rgb = DynamicImage::ImageRgb8(img.to_rgb8());
    let mut buf = Vec::new();
    let mut enc = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, quality);
    enc.encode_image(&rgb)
        .map_err(|e| ConvertError::Encode(e.to_string()))?;
    Ok(buf)
}

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
        let img = maybe_resize(img, &params.resize);

        let data = if let Some(target) = params.target_size_bytes {
            binary_search_quality(target, 1, quality, |q| encode_jpeg(&img, q))?
        } else {
            encode_jpeg(&img, quality)?
        };

        std::fs::write(&params.output_path, data)?;
        Ok(())
    }
}
