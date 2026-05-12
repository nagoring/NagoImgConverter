use crate::error::ConvertError;
use image::{DynamicImage, GrayImage};
use ndarray::Array4;
use ort::session::{builder::GraphOptimizationLevel, Session};
use ort::value::Tensor as OrtTensor;
use std::io::Read;
use std::path::Path;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

const MODEL_URL: &str =
    "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx";
const MODEL_FILE: &str = "u2netp.onnx";
const SIZE: usize = 320;
const MEAN: [f32; 3] = [0.485, 0.456, 0.406];
const STD: [f32; 3] = [0.229, 0.224, 0.225];

pub struct BgRemover {
    session: Mutex<Session>,
}

impl std::fmt::Debug for BgRemover {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("BgRemover").finish_non_exhaustive()
    }
}

impl BgRemover {
    fn build_session(path: &Path) -> Result<Session, ConvertError> {
        Session::builder()
            .map_err(|e| ConvertError::Encode(e.to_string()))?
            .with_optimization_level(GraphOptimizationLevel::Level3)
            .map_err(|e| ConvertError::Encode(e.to_string()))?
            .commit_from_file(path)
            .map_err(|e| ConvertError::Encode(format!("モデルの読み込みに失敗しました: {e}")))
    }

    /// Load directly from a local path (used in tests).
    pub fn load_from_path(path: &Path) -> Result<Self, ConvertError> {
        Ok(Self { session: Mutex::new(Self::build_session(path)?) })
    }

    /// Load (and download if missing) the U2-Net-p ONNX model.
    /// Emits "bg_model_status" events so the UI can show progress.
    pub fn load(app: &AppHandle, app_data_dir: &Path) -> Result<Self, ConvertError> {
        let path = app_data_dir.join("models").join(MODEL_FILE);
        if !path.exists() {
            let _ = app.emit("bg_model_status", "AIモデルをダウンロード中…（約5MB）");
            download_model(&path)?;
        }

        let _ = app.emit("bg_model_status", "AIモデルを読み込み中…");
        let session = Mutex::new(Self::build_session(&path)?);
        let _ = app.emit("bg_model_status", "");

        Ok(Self { session })
    }

    /// Run saliency segmentation and replace the alpha channel of the image.
    pub fn remove(&self, img: &DynamicImage) -> Result<DynamicImage, ConvertError> {
        let (orig_w, orig_h) = (img.width(), img.height());

        // ── Preprocess ───────────────────────────────────────────────────────
        let rgb = img
            .resize_exact(SIZE as u32, SIZE as u32, image::imageops::FilterType::Triangle)
            .to_rgb8();

        let n = SIZE * SIZE;
        let mut data = vec![0f32; 3 * n];
        for (i, p) in rgb.pixels().enumerate() {
            data[i]         = (p[0] as f32 / 255.0 - MEAN[0]) / STD[0];
            data[n + i]     = (p[1] as f32 / 255.0 - MEAN[1]) / STD[1];
            data[2 * n + i] = (p[2] as f32 / 255.0 - MEAN[2]) / STD[2];
        }

        let tensor = Array4::from_shape_vec((1, 3, SIZE, SIZE), data)
            .map_err(|e| ConvertError::Encode(e.to_string()))?;

        // ── Inference ────────────────────────────────────────────────────────
        let tensor_value = OrtTensor::<f32>::from_array(tensor)
            .map_err(|e: ort::Error| ConvertError::Encode(e.to_string()))?;

        // Run inference and extract saliency values before releasing the lock,
        // because SessionOutputs<'_> borrows from Session.
        let vals: Vec<f32> = {
            let mut session = self.session.lock().expect("session mutex poisoned");
            let input_name = session.inputs()[0].name().to_owned();
            let outputs = session
                .run(ort::inputs![&*input_name => tensor_value])
                .map_err(|e| ConvertError::Encode(e.to_string()))?;
            let (_, vals_slice) = outputs[0]
                .try_extract_tensor::<f32>()
                .map_err(|e| ConvertError::Encode(e.to_string()))?;
            vals_slice.to_vec()
        };
        let lo = vals.iter().cloned().fold(f32::INFINITY, f32::min);
        let hi = vals.iter().cloned().fold(f32::NEG_INFINITY, f32::max);
        let span = (hi - lo).max(1e-6);

        let alpha_bytes: Vec<u8> = vals
            .iter()
            .map(|&v| ((v - lo) / span * 255.0).round() as u8)
            .collect();

        let mask_small = GrayImage::from_raw(SIZE as u32, SIZE as u32, alpha_bytes)
            .ok_or_else(|| ConvertError::Encode("マスク画像の生成に失敗しました".into()))?;

        let mask = DynamicImage::ImageLuma8(mask_small)
            .resize_exact(orig_w, orig_h, image::imageops::FilterType::Triangle)
            .into_luma8();

        // Apply saliency map as alpha channel
        let mut rgba = img.to_rgba8();
        for (px, &a) in rgba.pixels_mut().zip(mask.as_raw().iter()) {
            px[3] = a;
        }

        Ok(DynamicImage::ImageRgba8(rgba))
    }
}


fn download_model(path: &Path) -> Result<(), ConvertError> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let resp = ureq::get(MODEL_URL)
        .call()
        .map_err(|e| ConvertError::Encode(format!("モデルのダウンロードに失敗しました: {e}")))?;

    let mut buf = Vec::new();
    resp.into_reader()
        .read_to_end(&mut buf)
        .map_err(|e| ConvertError::Io(e.to_string()))?;

    std::fs::write(path, &buf)?;
    Ok(())
}
