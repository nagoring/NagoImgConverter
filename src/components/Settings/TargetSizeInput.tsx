import { useConverterStore } from "../../store/useConverterStore";

export function TargetSizeInput() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const { enabled, kb } = useConverterStore((s) => s.targetSize);
  const setEnabled = useConverterStore((s) => s.setTargetSizeEnabled);
  const setKb = useConverterStore((s) => s.setTargetSizeKb);
  const isConverting = useConverterStore((s) => s.isConverting);

  // PNG (lossless) and GIF/BMP/TIFF don't support quality binary search
  if (format === "png" || format === "gif" || format === "bmp" || format === "tiff" || format === "ico") return null;

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          disabled={isConverting}
          onChange={(e) => setEnabled(e.target.checked)}
          className="accent-blue-600 disabled:opacity-50"
        />
        目標ファイルサイズ
      </label>
      {enabled && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={999999}
            value={kb}
            disabled={isConverting}
            onChange={(e) => setKb(Math.max(1, Number(e.target.value)))}
            className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <span className="text-sm text-gray-500">KB 以下</span>
        </div>
      )}
      {enabled && (
        <p className="text-xs text-gray-400 mt-1">
          品質を自動調整して指定サイズに収めます
        </p>
      )}
    </div>
  );
}
