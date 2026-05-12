use crate::bg_removal::{BgModel, BgRemover};
use crate::converter::{ConvertParams, ConverterRegistry, FormatOptions, ResizeParams};
use crate::error::ConvertError;
use crate::fs_utils;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

// ── DTOs ─────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FileInfo {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub extension: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConvertRequest {
    pub files: Vec<String>,
    pub output_dir: String,
    pub options: FormatOptions,
    pub preserve_metadata: bool,
    pub resize: Option<ResizeParams>,
    pub target_size_kb: Option<u32>,
    pub bg_removal: bool,
    pub bg_model: String,
}

/// Progress events emitted from Rust to the React frontend.
#[derive(Debug, Serialize, Clone)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ProgressEvent {
    Started { path: String },
    Completed { path: String, output_path: String },
    Failed { path: String, error: String },
    AllDone { total: usize, succeeded: usize, failed: usize },
}

// ── Commands ──────────────────────────────────────────────────────────────────

/// Return file metadata for a list of paths.
/// Called immediately after drag-and-drop to populate the file list.
#[tauri::command]
pub fn get_file_info(paths: Vec<String>) -> Vec<FileInfo> {
    paths
        .into_iter()
        .filter_map(|p| {
            let path = PathBuf::from(&p);
            let (name, size) = fs_utils::get_file_metadata(&path)?;
            let extension = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("")
                .to_lowercase();
            Some(FileInfo { path: p, name, size, extension })
        })
        .collect()
}

/// Confirm that a directory exists and is writable.
#[tauri::command]
pub fn validate_output_dir(dir: String) -> Result<bool, String> {
    let path = PathBuf::from(&dir);
    if !path.is_dir() {
        return Ok(false);
    }
    let probe = path.join(".nago_write_probe");
    match std::fs::write(&probe, b"") {
        Ok(_) => {
            let _ = std::fs::remove_file(&probe);
            Ok(true)
        }
        Err(_) => Ok(false),
    }
}

/// Batch-convert files. Emits a `ProgressEvent` per file and `AllDone` at the end.
///
/// Each file runs on its own OS thread so that converters using rayon internally
/// (e.g. oxipng) can freely use the global rayon thread pool without nesting
/// conflicts.
#[tauri::command]
pub fn convert_images(app: AppHandle, request: ConvertRequest) -> Result<(), ConvertError> {
    let registry = Arc::new(ConverterRegistry::new());
    let output_dir = Arc::new(PathBuf::from(&request.output_dir));
    let options = Arc::new(request.options);
    let resize = Arc::new(request.resize);
    let target_size_bytes = request.target_size_kb.map(|kb| kb as u64 * 1024);

    // Load the AI background removal model once (may trigger a first-time download).
    let bg_remover: Arc<Option<Arc<BgRemover>>> = Arc::new(if request.bg_removal {
        let data_dir = app
            .path()
            .app_data_dir()
            .map_err(|e| ConvertError::Encode(e.to_string()))?;
        Some(Arc::new(BgRemover::load(&app, &data_dir, BgModel::from_str(&request.bg_model))?))
    } else {
        None
    });

    let total = request.files.len();

    let results: Vec<bool> = std::thread::scope(|s| {
        let handles: Vec<_> = request
            .files
            .iter()
            .map(|file_path| {
                let app = app.clone();
                let registry = Arc::clone(&registry);
                let output_dir = Arc::clone(&output_dir);
                let options = Arc::clone(&options);
                let resize = Arc::clone(&resize);
                let bg_remover = Arc::clone(&bg_remover);
                let file_path = file_path.clone();

                s.spawn(move || {
                    let input = PathBuf::from(&file_path);
                    let output = fs_utils::resolve_output_path(
                        &input,
                        &output_dir,
                        options.extension(),
                    );

                    let _ = app.emit("progress", ProgressEvent::Started { path: file_path.clone() });

                    let params = ConvertParams {
                        input_path: input,
                        output_path: output.clone(),
                        options: (*options).clone(),
                        preserve_metadata: request.preserve_metadata,
                        resize: (*resize).clone(),
                        target_size_bytes,
                        bg_remover: (*bg_remover).as_ref().map(Arc::clone),
                    };

                    match registry.find(&params.options) {
                        None => {
                            let _ = app.emit(
                                "progress",
                                ProgressEvent::Failed {
                                    path: file_path.clone(),
                                    error: "No converter found for the selected format".to_string(),
                                },
                            );
                            false
                        }
                        Some(converter) => match converter.convert(&params) {
                            Ok(_) => {
                                let _ = app.emit(
                                    "progress",
                                    ProgressEvent::Completed {
                                        path: file_path.clone(),
                                        output_path: output.to_string_lossy().into_owned(),
                                    },
                                );
                                true
                            }
                            Err(e) => {
                                let _ = app.emit(
                                    "progress",
                                    ProgressEvent::Failed {
                                        path: file_path.clone(),
                                        error: e.to_string(),
                                    },
                                );
                                false
                            }
                        },
                    }
                })
            })
            .collect();

        handles.into_iter().map(|h| h.join().unwrap_or(false)).collect()
    });

    let succeeded = results.iter().filter(|&&b| b).count();
    let failed = total - succeeded;
    let _ = app.emit("progress", ProgressEvent::AllDone { total, succeeded, failed });

    Ok(())
}
