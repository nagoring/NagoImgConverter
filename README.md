# NagoImgConverter

ドラッグ&ドロップで画像を一括変換できるデスクトップアプリ。

**Tauri v2 + React + TypeScript + Rust** で構築。Windows / macOS / Linux に対応。

## 対応形式（v1）

| 入力 | 出力 |
|---|---|
| PNG / JPEG / WebP / GIF / BMP | PNG / JPEG / WebP / GIF / BMP |

## 機能

- ドラッグ&ドロップで複数ファイルを追加
- 出力先は自動でファイルと同じフォルダに設定
- JPEG / WebP の品質設定
- WebP: 100 = 可逆（lossless）/ 1-99 = 非可逆（lossy）
- JPEG: 透過を白背景に合成してエンコード
- 同名ファイルがある場合は `_converted` サフィックスで保存
- 並列変換で大量ファイルも高速処理

## 起動方法

```bash
# 開発モード
./run-dev.sh        # macOS / Linux
run-dev.bat         # Windows

# リリースビルド
./run-build.sh      # macOS / Linux
run-build.bat       # Windows
```

## 必要環境

- [Node.js](https://nodejs.org/) 18 以上
- [Rust](https://rustup.rs/) (stable)
- **Windows のみ**: [LLVM](https://llvm.org/) (`winget install LLVM.LLVM`) — WebP 変換に必要

### Linux の追加パッケージ

```bash
sudo apt-get install libwebkit2gtk-4.1-dev libclang-dev clang
```

## 初回セットアップ

```bash
npm install
./run-dev.sh
```

## TODO

### 優先度：高
- [ ] 実動作テスト（PNG→JPEG / PNG→WebP / 透過PNG→JPEG など）
- [ ] アプリアイコン作成（現在はプレースホルダーの青い正方形）
- [ ] リリースビルド確認（`./run-build.sh` で `.dmg` / `.app` が生成されるか）

### 優先度：中
- [ ] TIFF 対応（`image` クレートの `tiff` feature を有効化するだけ）
- [ ] AVIF 対応（`ravif` クレートを追加、純 Rust で依存少）
- [ ] 出力解像度・リサイズ設定

### 優先度：低
- [ ] HEIC 対応（macOS 限定。ImageIO FFI または `libheif-rs`）
- [ ] メタデータ（EXIF / PNG metadata）保持（UI は実装済み、Rust 側が未実装）
- [ ] 設定プリセット保存（よく使う形式・品質をワンクリックで呼び出し）
- [ ] アニメーション GIF の変換対応（現在は最初のフレームのみ）
