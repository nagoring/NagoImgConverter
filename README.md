# NagoImgConverter

ドラッグ&ドロップで画像を一括変換できるデスクトップアプリ。

**Tauri v2 + React + TypeScript + Rust** で構築。Windows / macOS / Linux に対応。

## 対応形式

| 入力 | 出力 |
|---|---|
| PNG / JPEG / WebP / GIF / BMP / TIFF | PNG / JPEG / WebP / GIF / BMP / TIFF / AVIF |

## 機能

- ドラッグ&ドロップで複数ファイルを追加
- 出力先は自動でファイルと同じフォルダに設定
- JPEG / WebP / AVIF の品質設定
- WebP: 100 = 可逆（lossless）/ 1-99 = 非可逆（lossy）
- JPEG / AVIF: 透過を白背景に合成してエンコード
- PNG 可逆最適化（oxipng 再圧縮・メタデータ除去・不透明 RGBA→RGB 変換）
- リサイズ（長辺指定 / 幅×高さ / パーセント、アルゴリズム選択）
- 目標ファイルサイズ指定（JPEG / WebP / AVIF: 指定 KB 以下になるまで品質を自動調整）
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
- [x] 実動作テスト（PNG→JPEG / PNG→WebP / 透過PNG→JPEG など）
- [x] アプリアイコン作成
- [x] リリースビルド確認（`.app` 31MB / `.dmg` 3.1MB 生成済み）

### 優先度：中
- [x] **容量削減機能**
  - [x] PNG 可逆最適化（oxipng 再圧縮・メタデータ除去・不透明 RGBA→RGB 変換）
  - [x] リサイズ（長辺指定 / 幅×高さ / パーセント、アルゴリズム選択）
  - [x] 目標ファイルサイズ指定（JPEG / WebP / AVIF: 品質を二分探索で自動調整）
- [x] TIFF 対応
- [x] AVIF 対応

- [x] **背景透過（AI）**

  U2-Net-p ONNX モデルによるセグメンテーションで被写体を残して背景を透明化。

  - 出力形式は PNG / WebP（透過対応フォーマット）に限定
  - `tract-onnx`（純 Rust ONNX 推論）でモデルを実行
  - 初回実行時に約 5MB のモデル（u2netp.onnx）をアプリデータフォルダへ自動ダウンロード
  - 複数ファイルでも 1 回のモデルロードで済む（Arc 共有）

### 優先度：低
- [ ] HEIC 対応（macOS 限定。ImageIO FFI または `libheif-rs`）
- [ ] メタデータ（EXIF / PNG metadata）保持（UI は実装済み、Rust 側が未実装）
- [ ] 設定プリセット保存（よく使う形式・品質をワンクリックで呼び出し）
- [ ] アニメーション GIF の変換対応（現在は最初のフレームのみ）

