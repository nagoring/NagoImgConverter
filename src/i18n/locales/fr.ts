import type { Messages } from "./ja";

export const fr: Messages = {
  "app.language": "Langue",

  "dropzone.add": "Déposez des images ici pour en ajouter",
  "dropzone.title": "Déposez les images ici",
  "dropzone.supported": "Formats pris en charge : PNG / JPEG / WebP / GIF / BMP",

  "fileList.converting": "Conversion…",
  "fileList.count": "{n} fichiers",
  "fileList.clearAll": "Tout supprimer",
  "fileList.colName": "Nom du fichier",
  "fileList.colFormat": "Format",
  "fileList.colSize": "Taille",
  "fileList.colStatus": "Statut",
  "fileList.colOutput": "Sortie / Erreur",
  "fileList.remove": "Supprimer",

  "status.pending": "En attente",
  "status.converting": "Conversion…",
  "status.success": "Terminé",
  "status.failed": "Erreur",

  "progress.converting": "Conversion…",
  "progress.done": "{done} / {total} terminés",

  "convert.running": "Conversion…",
  "convert.start": "Convertir ({n} fichiers)",
  "convert.noOutputDir": "Veuillez choisir un dossier de sortie.",
  "convert.failed": "La conversion a échoué :\n{msg}",

  "summary.title": "Conversion terminée",
  "summary.close": "Fermer (garder les fichiers)",
  "summary.succeeded": "Réussis",
  "summary.failed": "Échoués",
  "summary.total": "Total",
  "summary.failedFiles": "Fichiers en échec",
  "summary.again": "Convertir à nouveau",
  "summary.clear": "Vider et terminer",

  "preview.before": "Avant",
  "preview.after": "Après",
  "preview.loading": "Chargement…",
  "preview.loadError": "Erreur de chargement : {msg}",

  "format.label": "Format de sortie",

  "quality.label": "Qualité",
  "quality.lossless": " (sans perte)",
  "quality.webpHint": "100 = sans perte / 1-99 = avec perte",
  "quality.jpegHint": "Remarque : le JPEG ne conserve pas la transparence (fond blanc)",
  "quality.avifHint": "Haute qualité, forte compression. Prend en charge la transparence (alpha)",

  "pngOptimize.label": "Optimiser le PNG",
  "pngOptimize.hint": "Recompression + suppression des métadonnées (20–50 % plus léger)",

  "targetSize.label": "Taille de fichier cible",
  "targetSize.unit": "Ko maximum",
  "targetSize.hint": "La qualité est ajustée automatiquement pour respecter la taille",

  "bg.label": "Supprimer l'arrière-plan (IA)",
  "bg.modelGeneral": "Général (photos, personnes)",
  "bg.modelAnime": "Anime / illustration",
  "bg.noteGeneral": "~5 Mo la première fois",
  "bg.noteAnime": "~168 Mo la première fois",
  "bg.hint": "Téléchargé une seule fois. Démarrage instantané ensuite.",
  "bg.status.downloading_general": "Téléchargement du modèle IA… (~5 Mo)",
  "bg.status.downloading_anime": "Téléchargement du modèle IA… (~168 Mo, veuillez patienter)",
  "bg.status.loading": "Chargement du modèle IA…",

  "resize.label": "Redimensionner",
  "resize.modeLongSide": "Grand côté",
  "resize.modeWidthHeight": "L × H",
  "resize.width": "Largeur",
  "resize.height": "Hauteur",
  "resize.fitHint": "S'adapte au cadre en conservant les proportions",
  "resize.filterLanczos": "Lanczos3 (haute qualité)",
  "resize.filterBilinear": "Bilinear (standard)",
  "resize.filterNearest": "Nearest (rapide)",

  "filename.label": "Nom du fichier de sortie",

  "output.label": "Dossier de sortie",
  "output.pick": "Choisir un dossier…",
  "output.dialogTitle": "Choisir le dossier de sortie",
  "output.notWritable": "Vous n'avez pas les droits d'écriture sur ce dossier. Veuillez en choisir un autre.",

  "metadata.label": "Conserver les métadonnées (EXIF)",
  "metadata.hint1": "Transfère les informations de prise de vue et la date au fichier de sortie.",
  "metadata.hint2": "Uniquement pour une sortie JPEG / PNG / WebP.",
};
