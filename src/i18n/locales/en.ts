import type { Messages } from "./ja";

export const en: Messages = {
  "app.language": "Language",

  "dropzone.add": "Drop images here to add more",
  "dropzone.title": "Drop images here",
  "dropzone.supported": "Supports PNG / JPEG / WebP / GIF / BMP",

  "fileList.converting": "Converting…",
  "fileList.count": "{n} files",
  "fileList.clearAll": "Remove all",
  "fileList.colName": "File name",
  "fileList.colFormat": "Format",
  "fileList.colSize": "Size",
  "fileList.colStatus": "Status",
  "fileList.colOutput": "Output / Error",
  "fileList.remove": "Remove",

  "status.pending": "Pending",
  "status.converting": "Converting…",
  "status.success": "Done",
  "status.failed": "Error",

  "progress.converting": "Converting…",
  "progress.done": "{done} / {total} done",

  "convert.running": "Converting…",
  "convert.start": "Convert ({n} files)",
  "convert.noOutputDir": "Please select an output folder.",
  "convert.failed": "Conversion failed:\n{msg}",

  "summary.title": "Conversion complete",
  "summary.close": "Close (keep files)",
  "summary.succeeded": "Succeeded",
  "summary.failed": "Failed",
  "summary.total": "Total",
  "summary.failedFiles": "Failed files",
  "summary.again": "Convert again",
  "summary.clear": "Clear and finish",

  "preview.before": "Before",
  "preview.after": "After",
  "preview.loading": "Loading…",
  "preview.loadError": "Load error: {msg}",

  "format.label": "Output format",

  "quality.label": "Quality",
  "quality.lossless": " (lossless)",
  "quality.webpHint": "100 = lossless / 1-99 = lossy",
  "quality.jpegHint": "Note: JPEG cannot keep transparency (composited onto white)",
  "quality.avifHint": "High quality, high compression. Supports transparency (alpha)",

  "pngOptimize.label": "Optimize PNG",
  "pngOptimize.hint": "Recompress + strip metadata (20–50% smaller)",

  "targetSize.label": "Target file size",
  "targetSize.unit": "KB or less",
  "targetSize.hint": "Quality is adjusted automatically to fit the size",

  "bg.label": "Remove background (AI)",
  "bg.modelGeneral": "General (photos, people)",
  "bg.modelAnime": "Anime / illustration",
  "bg.noteGeneral": "~5MB first time",
  "bg.noteAnime": "~168MB first time",
  "bg.hint": "Downloaded only once. Starts instantly afterwards.",
  "bg.status.downloading_general": "Downloading AI model… (~5MB)",
  "bg.status.downloading_anime": "Downloading AI model… (~168MB, please wait)",
  "bg.status.loading": "Loading AI model…",

  "resize.label": "Resize",
  "resize.modeLongSide": "Long side",
  "resize.modeWidthHeight": "W × H",
  "resize.width": "Width",
  "resize.height": "Height",
  "resize.fitHint": "Fits inside the box while keeping the aspect ratio",
  "resize.filterLanczos": "Lanczos3 (high quality)",
  "resize.filterBilinear": "Bilinear (standard)",
  "resize.filterNearest": "Nearest (fast)",

  "filename.label": "Output file name",

  "output.label": "Output folder",
  "output.pick": "Select folder…",
  "output.dialogTitle": "Select output folder",
  "output.notWritable": "You don't have write permission for the selected folder. Please choose another folder.",

  "metadata.label": "Keep metadata (EXIF)",
  "metadata.hint1": "Carries shooting info and date over to the output file.",
  "metadata.hint2": "Only for JPEG / PNG / WebP output.",
};
