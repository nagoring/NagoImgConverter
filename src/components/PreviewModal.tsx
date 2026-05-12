import { useEffect, useState } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { useConverterStore } from "../store/useConverterStore";
import { formatBytes } from "../lib/format";

function mimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case "jpg": case "jpeg": return "image/jpeg";
    case "png":  return "image/png";
    case "webp": return "image/webp";
    case "gif":  return "image/gif";
    case "bmp":  return "image/bmp";
    case "tiff": case "tif": return "image/tiff";
    case "avif": return "image/avif";
    case "heic": case "heif": return "image/heic";
    default:     return "image/png";
  }
}

export function PreviewModal() {
  const file = useConverterStore((s) => s.previewFile);
  const close = useConverterStore((s) => s.setPreviewFile);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setUrl(null); return; }

    let revoke: (() => void) | undefined;
    setLoading(true);

    readFile(file.path).then((bytes) => {
      const blob = new Blob([bytes], { type: mimeType(file.extension) });
      const newUrl = URL.createObjectURL(blob);
      setUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return newUrl; });
      revoke = () => URL.revokeObjectURL(newUrl);
    }).finally(() => setLoading(false));

    return () => revoke?.();
  }, [file?.path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!file) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={() => close(null)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden max-w-[88vw] max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="min-w-0 mr-4">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {file.extension.toUpperCase()} · {formatBytes(file.size)}
            </p>
          </div>
          <button
            onClick={() => close(null)}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 p-4 min-h-0">
          {loading && <p className="text-sm text-gray-400">読み込み中…</p>}
          {!loading && url && (
            <img
              src={url}
              alt={file.name}
              className="max-w-full max-h-[75vh] object-contain rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}
