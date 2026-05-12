use std::path::{Path, PathBuf};

/// Apply a filename template, substituting `{name}` with the input stem.
/// Falls back to `{name}` if the template is empty.
pub fn apply_template(template: &str, stem: &str) -> String {
    let t = if template.trim().is_empty() { "{name}" } else { template.trim() };
    t.replace("{name}", stem)
}

/// Resolve a collision-free output path for a converted file.
///
/// The base name comes from `apply_template(template, stem)`.
/// Collisions are resolved by appending `_2`, `_3`, ... to the base name.
pub fn resolve_output_path(
    input_path: &Path,
    output_dir: &Path,
    new_ext: &str,
    template: &str,
) -> PathBuf {
    let stem = input_path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("output");

    let base = apply_template(template, stem);

    let candidate = output_dir.join(format!("{base}.{new_ext}"));
    if !candidate.exists() {
        return candidate;
    }

    for n in 2u32.. {
        let numbered = output_dir.join(format!("{base}_{n}.{new_ext}"));
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
