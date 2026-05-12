import { useConverterStore } from "../../store/useConverterStore";

export function BgRemovalPanel() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const enabled = useConverterStore((s) => s.bgRemoval.enabled);
  const setEnabled = useConverterStore((s) => s.setBgRemovalEnabled);
  const modelStatus = useConverterStore((s) => s.bgModelStatus);
  const isConverting = useConverterStore((s) => s.isConverting);

  // Only PNG and WebP support transparency
  if (format !== "png" && format !== "webp") return null;

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          disabled={isConverting}
          onChange={(e) => setEnabled(e.target.checked)}
          className="accent-blue-600 disabled:opacity-50"
        />
        背景を透過（AI）
      </label>

      {enabled && !modelStatus && (
        <p className="text-xs text-gray-400 mt-1.5 pl-5">
          U2-Net で被写体を検出し背景を透明化します。
          初回は約5MBのモデルをダウンロードします。
        </p>
      )}

      {modelStatus && (
        <p className="text-xs text-blue-500 mt-1.5 pl-5 flex items-center gap-1">
          <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          {modelStatus}
        </p>
      )}
    </div>
  );
}
