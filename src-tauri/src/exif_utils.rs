use crate::error::ConvertError;
use bytes::Bytes;
use img_parts::{jpeg::Jpeg, png::Png, webp::WebP, ImageEXIF};
use std::path::Path;

/// Copy EXIF from `src` to `dst`. Silently skips if the source has no EXIF
/// or the output format doesn't support it (GIF, BMP, ICO, etc.).
pub fn copy_exif(src: &Path, dst: &Path) -> Result<(), ConvertError> {
    let Some(exif) = read_exif(src)? else {
        return Ok(());
    };
    write_exif(dst, exif)
}

fn read_exif(src: &Path) -> Result<Option<Bytes>, ConvertError> {
    let ext = ext_of(src);
    let data: Bytes = std::fs::read(src)
        .map_err(|e| ConvertError::Io(e.to_string()))?
        .into();

    match ext.as_str() {
        "jpg" | "jpeg" => {
            let img = Jpeg::from_bytes(data).map_err(|e| ConvertError::Decode(e.to_string()))?;
            Ok(img.exif())
        }
        "png" => {
            let img = Png::from_bytes(data).map_err(|e| ConvertError::Decode(e.to_string()))?;
            Ok(img.exif())
        }
        "webp" => {
            let img = WebP::from_bytes(data).map_err(|e| ConvertError::Decode(e.to_string()))?;
            Ok(img.exif())
        }
        _ => Ok(None),
    }
}

fn write_exif(dst: &Path, exif: Bytes) -> Result<(), ConvertError> {
    let ext = ext_of(dst);
    let data: Bytes = std::fs::read(dst)
        .map_err(|e| ConvertError::Io(e.to_string()))?
        .into();

    match ext.as_str() {
        "jpg" | "jpeg" => {
            let mut img = Jpeg::from_bytes(data).map_err(|e| ConvertError::Encode(e.to_string()))?;
            img.set_exif(Some(exif));
            std::fs::write(dst, img.encoder().bytes())?;
        }
        "png" => {
            let mut img = Png::from_bytes(data).map_err(|e| ConvertError::Encode(e.to_string()))?;
            img.set_exif(Some(exif));
            std::fs::write(dst, img.encoder().bytes())?;
        }
        "webp" => {
            let mut img = WebP::from_bytes(data).map_err(|e| ConvertError::Encode(e.to_string()))?;
            img.set_exif(Some(exif));
            std::fs::write(dst, img.encoder().bytes())?;
        }
        _ => {} // GIF, BMP, ICO, TIFF, AVIF: skip silently
    }

    Ok(())
}

fn ext_of(path: &Path) -> String {
    path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_ascii_lowercase()
}
