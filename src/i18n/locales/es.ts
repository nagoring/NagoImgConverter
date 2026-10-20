import type { Messages } from "./ja";

export const es: Messages = {
  "app.language": "Idioma",

  "dropzone.add": "Suelta imágenes aquí para añadir más",
  "dropzone.title": "Suelta las imágenes aquí",
  "dropzone.supported": "Compatible con PNG / JPEG / WebP / GIF / BMP",

  "fileList.converting": "Convirtiendo…",
  "fileList.count": "{n} archivos",
  "fileList.clearAll": "Quitar todo",
  "fileList.colName": "Nombre",
  "fileList.colFormat": "Formato",
  "fileList.colSize": "Tamaño",
  "fileList.colStatus": "Estado",
  "fileList.colOutput": "Salida / Error",
  "fileList.remove": "Quitar",

  "status.pending": "En espera",
  "status.converting": "Convirtiendo…",
  "status.success": "Listo",
  "status.failed": "Error",

  "progress.converting": "Convirtiendo…",
  "progress.done": "{done} / {total} completados",

  "convert.running": "Convirtiendo…",
  "convert.start": "Convertir ({n} archivos)",
  "convert.noOutputDir": "Selecciona una carpeta de salida.",
  "convert.failed": "La conversión ha fallado:\n{msg}",

  "summary.title": "Conversión completada",
  "summary.close": "Cerrar (conservar archivos)",
  "summary.succeeded": "Correctos",
  "summary.failed": "Fallidos",
  "summary.total": "Total",
  "summary.failedFiles": "Archivos fallidos",
  "summary.again": "Convertir de nuevo",
  "summary.clear": "Limpiar y terminar",

  "preview.before": "Antes",
  "preview.after": "Después",
  "preview.loading": "Cargando…",
  "preview.loadError": "Error de carga: {msg}",

  "format.label": "Formato de salida",

  "quality.label": "Calidad",
  "quality.lossless": " (sin pérdida)",
  "quality.webpHint": "100 = sin pérdida / 1-99 = con pérdida",
  "quality.jpegHint": "Nota: JPEG no conserva la transparencia (se compone sobre fondo blanco)",
  "quality.avifHint": "Alta calidad y alta compresión. Admite transparencia (alfa)",

  "pngOptimize.label": "Optimizar PNG",
  "pngOptimize.hint": "Recomprime y elimina metadatos (20–50 % menos)",

  "targetSize.label": "Tamaño de archivo objetivo",
  "targetSize.unit": "KB como máximo",
  "targetSize.hint": "Ajusta la calidad automáticamente para no superar el tamaño",

  "bg.label": "Quitar fondo (IA)",
  "bg.modelGeneral": "General (fotos, personas)",
  "bg.modelAnime": "Anime / ilustración",
  "bg.noteGeneral": "~5 MB la primera vez",
  "bg.noteAnime": "~168 MB la primera vez",
  "bg.hint": "Se descarga solo una vez. Después arranca al instante.",
  "bg.status.downloading_general": "Descargando modelo de IA… (~5 MB)",
  "bg.status.downloading_anime": "Descargando modelo de IA… (~168 MB, espera un momento)",
  "bg.status.loading": "Cargando modelo de IA…",

  "resize.label": "Redimensionar",
  "resize.modeLongSide": "Lado largo",
  "resize.modeWidthHeight": "An. × Al.",
  "resize.width": "Ancho",
  "resize.height": "Alto",
  "resize.fitHint": "Se ajusta al recuadro manteniendo la proporción",
  "resize.filterLanczos": "Lanczos3 (alta calidad)",
  "resize.filterBilinear": "Bilinear (estándar)",
  "resize.filterNearest": "Nearest (rápido)",

  "filename.label": "Nombre del archivo de salida",

  "output.label": "Carpeta de salida",
  "output.pick": "Seleccionar carpeta…",
  "output.dialogTitle": "Seleccionar carpeta de salida",
  "output.notWritable": "No tienes permiso de escritura en la carpeta seleccionada. Elige otra carpeta.",

  "metadata.label": "Conservar metadatos (EXIF)",
  "metadata.hint1": "Conserva la información de la toma y la fecha en el archivo de salida.",
  "metadata.hint2": "Solo para salida JPEG / PNG / WebP.",
};
