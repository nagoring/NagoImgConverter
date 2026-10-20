import type { Messages } from "./ja";

export const de: Messages = {
  "app.language": "Sprache",

  "dropzone.add": "Bilder hierher ziehen, um sie hinzuzufügen",
  "dropzone.title": "Bilder hier ablegen",
  "dropzone.supported": "Unterstützt PNG / JPEG / WebP / GIF / BMP",

  "fileList.converting": "Wird konvertiert…",
  "fileList.count": "{n} Dateien",
  "fileList.clearAll": "Alle entfernen",
  "fileList.colName": "Dateiname",
  "fileList.colFormat": "Format",
  "fileList.colSize": "Größe",
  "fileList.colStatus": "Status",
  "fileList.colOutput": "Ausgabe / Fehler",
  "fileList.remove": "Entfernen",

  "status.pending": "Wartend",
  "status.converting": "Konvertiere…",
  "status.success": "Fertig",
  "status.failed": "Fehler",

  "progress.converting": "Wird konvertiert…",
  "progress.done": "{done} / {total} fertig",

  "convert.running": "Wird konvertiert…",
  "convert.start": "Konvertieren ({n} Dateien)",
  "convert.noOutputDir": "Bitte wählen Sie einen Ausgabeordner.",
  "convert.failed": "Konvertierung fehlgeschlagen:\n{msg}",

  "summary.title": "Konvertierung abgeschlossen",
  "summary.close": "Schließen (Dateien behalten)",
  "summary.succeeded": "Erfolgreich",
  "summary.failed": "Fehlgeschlagen",
  "summary.total": "Gesamt",
  "summary.failedFiles": "Fehlgeschlagene Dateien",
  "summary.again": "Erneut konvertieren",
  "summary.clear": "Leeren und beenden",

  "preview.before": "Vorher",
  "preview.after": "Nachher",
  "preview.loading": "Wird geladen…",
  "preview.loadError": "Ladefehler: {msg}",

  "format.label": "Ausgabeformat",

  "quality.label": "Qualität",
  "quality.lossless": " (verlustfrei)",
  "quality.webpHint": "100 = verlustfrei / 1-99 = verlustbehaftet",
  "quality.jpegHint": "Hinweis: JPEG unterstützt keine Transparenz (wird auf Weiß gelegt)",
  "quality.avifHint": "Hohe Qualität, starke Kompression. Unterstützt Transparenz (Alpha)",

  "pngOptimize.label": "PNG optimieren",
  "pngOptimize.hint": "Neu komprimieren + Metadaten entfernen (20–50 % kleiner)",

  "targetSize.label": "Ziel-Dateigröße",
  "targetSize.unit": "KB oder weniger",
  "targetSize.hint": "Die Qualität wird automatisch an die Größe angepasst",

  "bg.label": "Hintergrund entfernen (KI)",
  "bg.modelGeneral": "Allgemein (Fotos, Personen)",
  "bg.modelAnime": "Anime / Illustration",
  "bg.noteGeneral": "ca. 5 MB beim ersten Mal",
  "bg.noteAnime": "ca. 168 MB beim ersten Mal",
  "bg.hint": "Wird nur einmal heruntergeladen. Danach sofort einsatzbereit.",
  "bg.status.downloading_general": "KI-Modell wird heruntergeladen… (ca. 5 MB)",
  "bg.status.downloading_anime": "KI-Modell wird heruntergeladen… (ca. 168 MB, bitte warten)",
  "bg.status.loading": "KI-Modell wird geladen…",

  "resize.label": "Größe ändern",
  "resize.modeLongSide": "Lange Seite",
  "resize.modeWidthHeight": "B × H",
  "resize.width": "Breite",
  "resize.height": "Höhe",
  "resize.fitHint": "Passt in den Rahmen und behält das Seitenverhältnis bei",
  "resize.filterLanczos": "Lanczos3 (hohe Qualität)",
  "resize.filterBilinear": "Bilinear (Standard)",
  "resize.filterNearest": "Nearest (schnell)",

  "filename.label": "Ausgabe-Dateiname",

  "output.label": "Ausgabeordner",
  "output.pick": "Ordner wählen…",
  "output.dialogTitle": "Ausgabeordner wählen",
  "output.notWritable": "Keine Schreibrechte für den gewählten Ordner. Bitte wählen Sie einen anderen Ordner.",

  "metadata.label": "Metadaten behalten (EXIF)",
  "metadata.hint1": "Übernimmt Aufnahmedaten und Datum in die Ausgabedatei.",
  "metadata.hint2": "Nur bei Ausgabe als JPEG / PNG / WebP.",
};
