import { useConverterStore } from "../../store/useConverterStore";
import type { ResizeMode, ResizeFilter } from "../../types";

const MODES: { value: ResizeMode; label: string }[] = [
  { value: "longSide", label: "長辺" },
  { value: "widthHeight", label: "幅×高さ" },
  { value: "percent", label: "%" },
];

const FILTERS: { value: ResizeFilter; label: string }[] = [
  { value: "lanczos3", label: "Lanczos3（高品質）" },
  { value: "bilinear", label: "Bilinear（標準）" },
  { value: "nearest", label: "Nearest（高速）" },
];

export function ResizePanel() {
  const r = useConverterStore((s) => s.resizeSettings);
  const setResizeEnabled = useConverterStore((s) => s.setResizeEnabled);
  const setResizeMode = useConverterStore((s) => s.setResizeMode);
  const setResizeWidth = useConverterStore((s) => s.setResizeWidth);
  const setResizeHeight = useConverterStore((s) => s.setResizeHeight);
  const setResizeLongSide = useConverterStore((s) => s.setResizeLongSide);
  const setResizePercent = useConverterStore((s) => s.setResizePercent);
  const setResizeFilter = useConverterStore((s) => s.setResizeFilter);
  const isConverting = useConverterStore((s) => s.isConverting);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">リサイズ</p>
        <button
          role="switch"
          aria-checked={r.enabled}
          disabled={isConverting}
          onClick={() => setResizeEnabled(!r.enabled)}
          className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${r.enabled ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${r.enabled ? "translate-x-4" : "translate-x-0"}`} />
        </button>
      </div>

      {r.enabled && (
        <div className="space-y-3">
          {/* Mode selector */}
          <div className="flex gap-1">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setResizeMode(m.value)}
                disabled={isConverting}
                className={`flex-1 py-1 text-xs rounded border transition-colors disabled:cursor-not-allowed ${
                  r.mode === m.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-blue-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          {r.mode === "longSide" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={99999}
                value={r.longSide}
                disabled={isConverting}
                onChange={(e) => setResizeLongSide(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
              />
              <span className="text-xs text-gray-500 shrink-0">px</span>
            </div>
          )}

          {r.mode === "widthHeight" && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={99999}
                value={r.width}
                disabled={isConverting}
                onChange={(e) => setResizeWidth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                placeholder="幅"
              />
              <span className="text-gray-400 text-xs">×</span>
              <input
                type="number"
                min={1}
                max={99999}
                value={r.height}
                disabled={isConverting}
                onChange={(e) => setResizeHeight(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                placeholder="高さ"
              />
              <span className="text-xs text-gray-500 shrink-0">px</span>
            </div>
          )}

          {r.mode === "percent" && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={400}
                value={r.percent}
                disabled={isConverting}
                onChange={(e) => setResizePercent(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
              />
              <span className="text-xs text-gray-500 shrink-0">%</span>
            </div>
          )}

          {r.mode === "widthHeight" && (
            <p className="text-xs text-gray-400">アスペクト比を保ちながら枠内に収めます</p>
          )}

          {/* Filter */}
          <select
            value={r.filter}
            disabled={isConverting}
            onChange={(e) => setResizeFilter(e.target.value as ResizeFilter)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
