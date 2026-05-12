#[cfg(test)]
mod tests {
    use std::path::PathBuf;
    use image::{DynamicImage, ImageBuffer, Rgba};
    use tempfile::tempdir;
    use crate::converter::{ConvertParams, ConverterRegistry, FormatOptions};

    /// 100x100 の RGBA テスト画像を生成する（赤→青のグラデーション、透過あり）
    fn make_test_image() -> DynamicImage {
        let img = ImageBuffer::from_fn(100, 100, |x, y| {
            let r = (x * 2) as u8;
            let b = (y * 2) as u8;
            let a = if x + y < 100 { 128u8 } else { 255u8 }; // 左上は半透明
            Rgba([r, 0, b, a])
        });
        DynamicImage::ImageRgba8(img)
    }

    /// 全ピクセルが不透明な RGBA 画像を生成する
    fn make_opaque_image() -> DynamicImage {
        let img = ImageBuffer::from_fn(100, 100, |x, y| {
            let r = (x * 2) as u8;
            let b = (y * 2) as u8;
            Rgba([r, 0, b, 255u8])
        });
        DynamicImage::ImageRgba8(img)
    }

    fn run_conversion(input: &PathBuf, options: FormatOptions, output_dir: &PathBuf) -> PathBuf {
        let ext = options.extension();
        let output = output_dir.join(format!("output.{ext}"));
        let registry = ConverterRegistry::new();
        let params = ConvertParams {
            input_path: input.clone(),
            output_path: output.clone(),
            options,
            preserve_metadata: false,
            resize: None,
            target_size_bytes: None,
            bg_remover: None,
        };
        let converter = registry.find(&params.options).expect("converter not found");
        converter.convert(&params).expect("conversion failed");
        output
    }

    fn save_test_png(dir: &PathBuf) -> PathBuf {
        let path = dir.join("test_input.png");
        make_test_image().save(&path).unwrap();
        path
    }

    #[test]
    fn png_to_png() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Png { optimize: false }, &dir.path().to_path_buf());
        assert!(output.exists(), "PNG output does not exist");
        let img = image::open(&output).expect("failed to open PNG output");
        assert_eq!(img.width(), 100);
        assert_eq!(img.height(), 100);
    }

    #[test]
    fn png_to_jpeg() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Jpeg { quality: 85 }, &dir.path().to_path_buf());
        assert!(output.exists(), "JPEG output does not exist");
        let img = image::open(&output).expect("failed to open JPEG output");
        assert_eq!(img.width(), 100);
        assert_eq!(img.height(), 100);
    }

    #[test]
    fn png_to_jpeg_quality_low() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let hi = run_conversion(&input, FormatOptions::Jpeg { quality: 95 }, &dir.path().to_path_buf());
        let lo_dir = tempdir().unwrap();
        let lo = run_conversion(&input, FormatOptions::Jpeg { quality: 10 }, &lo_dir.path().to_path_buf());
        // 品質が低い方がファイルサイズが小さい
        assert!(
            std::fs::metadata(&lo).unwrap().len() < std::fs::metadata(&hi).unwrap().len(),
            "low quality should produce smaller file"
        );
    }

    #[test]
    fn png_to_webp_lossless() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Webp { quality: None }, &dir.path().to_path_buf());
        assert!(output.exists(), "WebP (lossless) output does not exist");
        assert!(std::fs::metadata(&output).unwrap().len() > 0);
    }

    #[test]
    fn png_to_webp_lossy() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Webp { quality: Some(80.0) }, &dir.path().to_path_buf());
        assert!(output.exists(), "WebP (lossy) output does not exist");
        assert!(std::fs::metadata(&output).unwrap().len() > 0);
    }

    #[test]
    fn png_to_gif() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Gif, &dir.path().to_path_buf());
        assert!(output.exists(), "GIF output does not exist");
        let img = image::open(&output).expect("failed to open GIF output");
        assert_eq!(img.width(), 100);
        assert_eq!(img.height(), 100);
    }

    #[test]
    fn png_to_bmp() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Bmp, &dir.path().to_path_buf());
        assert!(output.exists(), "BMP output does not exist");
        let img = image::open(&output).expect("failed to open BMP output");
        assert_eq!(img.width(), 100);
        assert_eq!(img.height(), 100);
    }

    #[test]
    fn collision_avoidance() {
        use crate::fs_utils::resolve_output_path;
        let dir = tempdir().unwrap();
        let input = dir.path().join("photo.png");
        std::fs::write(&input, b"").unwrap();

        let p1 = resolve_output_path(&input, dir.path(), "jpg", "{name}");
        assert_eq!(p1.file_name().unwrap(), "photo.jpg");

        std::fs::write(&p1, b"").unwrap();
        let p2 = resolve_output_path(&input, dir.path(), "jpg", "{name}");
        assert_eq!(p2.file_name().unwrap(), "photo_2.jpg");

        std::fs::write(&p2, b"").unwrap();
        let p3 = resolve_output_path(&input, dir.path(), "jpg", "{name}");
        assert_eq!(p3.file_name().unwrap(), "photo_3.jpg");
    }

    #[test]
    fn filename_template_applied() {
        use crate::fs_utils::resolve_output_path;
        let dir = tempdir().unwrap();
        let input = dir.path().join("photo.png");
        std::fs::write(&input, b"").unwrap();

        let p = resolve_output_path(&input, dir.path(), "ico", "{name}_icon");
        assert_eq!(p.file_name().unwrap(), "photo_icon.ico");
    }

    #[test]
    fn png_optimize_reduces_size() {
        let dir = tempdir().unwrap();
        let dir2 = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());

        let plain = run_conversion(&input, FormatOptions::Png { optimize: false }, &dir.path().to_path_buf());
        let optimized = run_conversion(&input, FormatOptions::Png { optimize: true }, &dir2.path().to_path_buf());

        let plain_size = std::fs::metadata(&plain).unwrap().len();
        let opt_size = std::fs::metadata(&optimized).unwrap().len();
        assert!(opt_size <= plain_size, "optimized PNG ({opt_size}) should be <= plain ({plain_size})");
    }

    #[test]
    fn png_optimize_strips_alpha_when_all_opaque() {
        let dir = tempdir().unwrap();
        let input = dir.path().join("opaque.png");
        make_opaque_image().save(&input).unwrap();

        let output = run_conversion(&input, FormatOptions::Png { optimize: true }, &dir.path().to_path_buf());
        let img = image::open(&output).expect("failed to open optimized PNG");
        // 出力は RGB（アルファなし）になっているはず
        assert!(
            !img.color().has_alpha(),
            "fully opaque RGBA should be converted to RGB, got {:?}",
            img.color()
        );
    }

    #[test]
    fn bg_remover_loads_and_runs() {
        let model_path = std::path::Path::new("/tmp/u2netp_test.onnx");
        if !model_path.exists() {
            eprintln!("Skipping: model not at /tmp/u2netp_test.onnx");
            return;
        }
        use crate::bg_removal::{BgModel, BgRemover};
        let remover = BgRemover::load_from_path(model_path, BgModel::General)
            .expect("BgRemover::load_from_path should succeed");

        let img = make_test_image();
        let result = remover.remove(&img).expect("remove() should succeed");
        assert_eq!(result.width(), 100);
        assert_eq!(result.height(), 100);
        // Result must be RGBA
        assert!(result.color().has_alpha(), "output should have alpha channel");
    }

    #[test]
    fn png_to_ico() {
        let dir = tempdir().unwrap();
        let input = save_test_png(&dir.path().to_path_buf());
        let output = run_conversion(&input, FormatOptions::Ico, &dir.path().to_path_buf());
        assert!(output.exists(), "ICO output does not exist");
        // ICO file has a 6-byte header starting with 0x00 0x00 0x01 0x00
        let bytes = std::fs::read(&output).unwrap();
        assert!(bytes.len() > 6, "ICO file too small");
        assert_eq!(&bytes[0..4], &[0x00, 0x00, 0x01, 0x00], "invalid ICO header");
    }

    #[test]
    fn invalid_file_returns_error() {
        let dir = tempdir().unwrap();
        let bad = dir.path().join("bad.png");
        std::fs::write(&bad, b"this is not an image").unwrap();
        let registry = ConverterRegistry::new();
        let params = ConvertParams {
            input_path: bad,
            output_path: dir.path().join("out.jpg"),
            options: FormatOptions::Jpeg { quality: 85 },
            preserve_metadata: false,
            resize: None,
            target_size_bytes: None,
            bg_remover: None,
        };
        let converter = registry.find(&params.options).unwrap();
        assert!(converter.convert(&params).is_err(), "should fail on invalid file");
    }
}
