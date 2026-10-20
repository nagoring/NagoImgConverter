export const ja = {
  "app.language": "言語",

  "dropzone.add": "ここに画像をドロップして追加",
  "dropzone.title": "画像をここにドロップ",
  "dropzone.supported": "PNG / JPEG / WebP / GIF / BMP に対応",

  "fileList.converting": "変換中…",
  "fileList.count": "{n} ファイル",
  "fileList.clearAll": "すべて削除",
  "fileList.colName": "ファイル名",
  "fileList.colFormat": "形式",
  "fileList.colSize": "サイズ",
  "fileList.colStatus": "ステータス",
  "fileList.colOutput": "出力 / エラー",
  "fileList.remove": "削除",

  "status.pending": "待機中",
  "status.converting": "変換中…",
  "status.success": "完了",
  "status.failed": "エラー",

  "progress.converting": "変換中…",
  "progress.done": "{done} / {total} 完了",

  "convert.running": "変換中…",
  "convert.start": "変換開始（{n} ファイル）",
  "convert.noOutputDir": "出力先フォルダを選択してください。",
  "convert.failed": "変換に失敗しました:\n{msg}",

  "summary.title": "変換完了",
  "summary.close": "閉じる（ファイルはそのまま）",
  "summary.succeeded": "成功",
  "summary.failed": "失敗",
  "summary.total": "合計",
  "summary.failedFiles": "失敗したファイル",
  "summary.again": "もう一度変換",
  "summary.clear": "クリアして終了",

  "preview.before": "変換前",
  "preview.after": "変換後",
  "preview.loading": "読み込み中…",
  "preview.loadError": "読み込みエラー: {msg}",

  "format.label": "出力形式",

  "quality.label": "品質",
  "quality.lossless": "（可逆）",
  "quality.webpHint": "100 = 可逆（lossless）/ 1-99 = 非可逆（lossy）",
  "quality.jpegHint": "※ JPEG は透過情報を保持できません（白背景に合成されます）",
  "quality.avifHint": "高品質・高圧縮。透過（アルファ）に対応",

  "pngOptimize.label": "PNG最適化",
  "pngOptimize.hint": "再圧縮 + メタデータ除去（20〜50% 削減）",

  "targetSize.label": "目標ファイルサイズ",
  "targetSize.unit": "KB 以下",
  "targetSize.hint": "品質を自動調整して指定サイズに収めます",

  "bg.label": "背景を透過（AI）",
  "bg.modelGeneral": "汎用（実写・人物）",
  "bg.modelAnime": "アニメ・イラスト",
  "bg.noteGeneral": "初回約5MB",
  "bg.noteAnime": "初回約168MB",
  "bg.hint": "初回のみダウンロード。以降は即時起動。",
  "bg.status.downloading_general": "AIモデルをダウンロード中…（約5MB）",
  "bg.status.downloading_anime": "AIモデルをダウンロード中…（約168MB、しばらくお待ちください）",
  "bg.status.loading": "AIモデルを読み込み中…",

  "resize.label": "リサイズ",
  "resize.modeLongSide": "長辺",
  "resize.modeWidthHeight": "幅×高さ",
  "resize.width": "幅",
  "resize.height": "高さ",
  "resize.fitHint": "アスペクト比を保ちながら枠内に収めます",
  "resize.filterLanczos": "Lanczos3（高品質）",
  "resize.filterBilinear": "Bilinear（標準）",
  "resize.filterNearest": "Nearest（高速）",

  "filename.label": "出力ファイル名",

  "output.label": "出力先フォルダ",
  "output.pick": "フォルダを選択…",
  "output.dialogTitle": "出力先フォルダを選択",
  "output.notWritable": "選択したフォルダへの書き込み権限がありません。別のフォルダを選択してください。",

  "metadata.label": "メタデータを保持（EXIF）",
  "metadata.hint1": "撮影情報・日時を出力ファイルに引き継ぎます。",
  "metadata.hint2": "JPEG / PNG / WebP 出力時のみ有効。",
};

export type MessageKey = keyof typeof ja;
export type Messages = Record<MessageKey, string>;
