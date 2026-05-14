import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
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

function extOf(path: string): string {
  return path.split(".").pop()?.toLowerCase() ?? "";
}

function useBlobUrl(path: string | null | undefined, ext: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [size, setSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!path) {
      if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
      setUrl(null); setSize(0); setError(null);
      return;
    }
    setError(null);
    let cancelled = false;
    invoke<number[]>("read_file_for_preview", { path }).then((arr) => {
      if (cancelled) return;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const bytes = new Uint8Array(arr);
      setSize(bytes.length);
      const blob = new Blob([bytes], { type: mimeType(ext) });
      const newUrl = URL.createObjectURL(blob);
      urlRef.current = newUrl;
      setUrl(newUrl);
    }).catch((e) => {
      if (!cancelled) setError(String(e));
    });
    return () => { cancelled = true; };
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, []);

  return { url, size, error };
}

export function PreviewModal() {
  // Always use live data from files[] so outputPath is visible after conversion completes.
  const file = useConverterStore((s) => {
    const pf = s.previewFile;
    if (!pf) return null;
    return s.files.find((f) => f.path === pf.path) ?? pf;
  });
  const close = useConverterStore((s) => s.setPreviewFile);

  const { url: beforeUrl } = useBlobUrl(file?.path, file?.extension ?? "");
  const outputPath = file?.status === "success" ? file.outputPath : undefined;
  const { url: afterUrl, size: afterSize, error: afterError } = useBlobUrl(outputPath, extOf(outputPath ?? ""));

  const showAfter = file?.status === "success";
  const isComparison = !!(showAfter && beforeUrl);
  const sizeDiff = afterSize && file?.size
    ? Math.round((afterSize / file.size - 1) * 100)
    : null;

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
        className={`bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] ${isComparison ? "max-w-[94vw]" : "max-w-[88vw]"}`}
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
          <button onClick={() => close(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none shrink-0">
            ✕
          </button>
        </div>

        {/* Image area */}
        <div className="flex-1 flex items-start justify-center bg-gray-50 p-4 min-h-0 gap-4 overflow-auto">

          {/* Before */}
          <div className={`flex flex-col items-center gap-2 ${isComparison ? "flex-1 min-w-0" : ""}`}>
            {isComparison && (
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                変換前 · {formatBytes(file.size)}
              </span>
            )}
            {beforeUrl
              ? <img src={beforeUrl} alt="変換前" className="max-w-full max-h-[75vh] object-contain rounded border border-gray-200" />
              : <p className="text-sm text-gray-400">読み込み中…</p>
            }
          </div>

          {/* After */}
          {showAfter && (
            <>
              <div className="w-px bg-gray-200 self-stretch shrink-0" />
              <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  変換後{afterSize > 0 ? ` · ${formatBytes(afterSize)}` : ""}
                  {sizeDiff !== null && (
                    <span className={`${sizeDiff < 0 ? "text-green-600" : "text-orange-500"}`}>
                      ({sizeDiff > 0 ? "+" : ""}{sizeDiff}%)
                    </span>
                  )}
                </span>
                {afterUrl
                  ? <img src={afterUrl} alt="変換後" className="max-w-full max-h-[75vh] object-contain rounded border border-gray-200" />
                  : afterError
                    ? <p className="text-sm text-red-500 max-w-xs break-all">読み込みエラー: {afterError}</p>
                    : <p className="text-sm text-gray-400">読み込み中…</p>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
