use serde::Serialize;

#[derive(Debug, thiserror::Error, Serialize)]
pub enum ConvertError {
    #[error("IO error: {0}")]
    Io(String),

    #[error("Image decode error: {0}")]
    Decode(String),

    #[error("Image encode error: {0}")]
    Encode(String),

    #[error("Unsupported format: {0}")]
    UnsupportedFormat(String),

    #[error("No converter found for the selected format")]
    NoConverterFound,
}

impl From<image::ImageError> for ConvertError {
    fn from(e: image::ImageError) -> Self {
        match e {
            image::ImageError::IoError(io) => Self::Io(io.to_string()),
            image::ImageError::Decoding(_) => Self::Decode(e.to_string()),
            image::ImageError::Encoding(_) => Self::Encode(e.to_string()),
            _ => Self::Encode(e.to_string()),
        }
    }
}

impl From<std::io::Error> for ConvertError {
    fn from(e: std::io::Error) -> Self {
        Self::Io(e.to_string())
    }
}
