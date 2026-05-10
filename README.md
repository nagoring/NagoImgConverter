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
- [x] 実動作テスト（PNG→JPEG / PNG→WebP / 透過PNG→JPEG など）
- [x] アプリアイコン作成
- [x] リリースビルド確認（`.app` 31MB / `.dmg` 3.1MB 生成済み）

### 優先度：中
- [ ] **容量削減機能**

  **① 品質・解像度を変えずに削減（可逆最適化）**
  - PNG 再圧縮 — `oxipng` クレートで再エンコード。同じ見た目のまま 20〜50% 削減できる場合がある
  - メタデータ除去 — EXIF・ICC プロファイル・コメントを削除（UI 設計済み、Rust 側未実装）
  - 不透明 PNG のアルファ除去 — 全ピクセルが不透明な場合は RGBA→RGB に変換してサイズ削減
  - PNG → 可逆 WebP 変換 — 同じ画質のまま WebP lossless は PNG より平均 26% 小さい

  **② 品質を下げずに知覚的に削減（非可逆最適化）**
  - JPEG クロマサブサンプリング選択（4:4:4 / 4:2:0）— 色差成分を間引く。人間の目には差が出にくい
  - 目標ファイルサイズ指定（例：500KB 以下になるまで品質を二分探索で自動調整）

  **③ 解像度変更による削減**
  - リサイズ（幅・高さ指定 / 長辺指定 / パーセント指定）
  - リサイズアルゴリズム選択（Lanczos3 / Bilinear / Nearest）

  **実装メモ**
  - `oxipng` クレートで PNG 最適化（`optimize_from_memory` API）
  - JPEG クロマサブサンプリングは `image` クレートの `JpegEncoder` に設定可能
  - 目標サイズ自動調整は品質を二分探索してエンコードを繰り返す（Rust 側のみで完結）

- [ ] TIFF 対応（`image` クレートの `tiff` feature を有効化するだけ）
- [ ] AVIF 対応（`ravif` クレートを追加、純 Rust で依存少）

### 優先度：低
- [ ] HEIC 対応（macOS 限定。ImageIO FFI または `libheif-rs`）
- [ ] メタデータ（EXIF / PNG metadata）保持（UI は実装済み、Rust 側が未実装）
- [ ] 設定プリセット保存（よく使う形式・品質をワンクリックで呼び出し）
- [ ] アニメーション GIF の変換対応（現在は最初のフレームのみ）
