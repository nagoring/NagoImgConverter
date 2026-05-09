use std::path::{Path, PathBuf};

/// Resolve a collision-free output path for a converted file.
///
/// Priority:
///   1. `stem.ext`            — use as-is if it doesn't exist
///   2. `stem_converted.ext`  — first collision fallback
///   3. `stem_converted_2.ext`, `_3`, ... — incrementing suffix
pub fn resolve_output_path(input_path: &Path, output_dir: &Path, new_ext: &str) -> PathBuf {
    let stem = input_path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("output");

    let candidate = output_dir.join(format!("{stem}.{new_ext}"));
    if !candidate.exists() {
        return candidate;
    }

    let converted = output_dir.join(format!("{stem}_converted.{new_ext}"));
    if !converted.exists() {
        return converted;
    }

    for n in 2u32.. {
        let numbered = output_dir.join(format!("{stem}_converted_{n}.{new_ext}"));
        if !numbered.exists() {
            return numbered;
        }
    }
    unreachable!("collision loop exhausted u32::MAX")
}

/// Return (filename, size_bytes) for a path, or None if inaccessible.
pub fn get_file_metadata(path: &Path) -> Option<(String, u64)> {
    let name = path.file_name()?.to_string_lossy().into_owned();
    let size = std::fs::metadata(path).ok()?.len();
    Some((name, size))
}
