use crate::converter::{ConvertParams, FormatOptions, ImageConverter};
use crate::error::ConvertError;
use ico::{IconDir, IconDirEntry, IconImage, ResourceType};

pub struct IcoConverter;

// Standard Windows icon sizes embedded in a single .ico file
const ICO_SIZES: &[u32] = &[16, 32, 48, 64, 128, 256];

impl ImageConverter for IcoConverter {
    fn name(&self) -> &'static str {
        "ICO"
    }

    fn accepts(&self, options: &FormatOptions) -> bool {
        matches!(options, FormatOptions::Ico)
    }

    fn convert(&self, params: &ConvertParams) -> Result<(), ConvertError> {
        let img = super::open_image(&params.input_path)?;
        // resize is intentionally skipped: ICO always embeds all standard sizes

        let mut icon_dir = IconDir::new(ResourceType::Icon);
        for &size in ICO_SIZES {
            let resized = img.resize_exact(size, size, image::imageops::FilterType::Lanczos3);
            let rgba = resized.to_rgba8();
            let icon_image = IconImage::from_rgba_data(size, size, rgba.into_raw());
            let entry = IconDirEntry::encode(&icon_image)
                .map_err(|e| ConvertError::Encode(e.to_string()))?;
            icon_dir.add_entry(entry);
        }

        let file = std::fs::File::create(&params.output_path)?;
        icon_dir.write(file)?;
        Ok(())
    }
}
