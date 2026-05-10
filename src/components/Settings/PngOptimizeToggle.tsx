import { useConverterStore } from "../../store/useConverterStore";

export function PngOptimizeToggle() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const pngOptimize = useConverterStore((s) => s.formatOptions.pngOptimize ?? false);
  const setPngOptimize = useConverterStore((s) => s.setPngOptimize);
  const isConverting = useConverterStore((s) => s.isConverting);

  if (format !== "png") return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700">PNG最適化</p>
        <p className="text-xs text-gray-400">再圧縮 + メタデータ除去（20〜50% 削減）</p>
      </div>
      <button
        role="switch"
        aria-checked={pngOptimize}
        disabled={isConverting}
        onClick={() => setPngOptimize(!pngOptimize)}
        className={`
          relative w-9 h-5 rounded-full transition-colors focus:outline-none
          disabled:cursor-not-allowed disabled:opacity-50
          ${pngOptimize ? "bg-blue-600" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
            ${pngOptimize ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
