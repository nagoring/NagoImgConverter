import { useConverterStore } from "../../store/useConverterStore";
import type { BgModel } from "../../types";

const MODELS: { value: BgModel; label: string; note: string }[] = [
  { value: "general", label: "汎用（実写・人物）",       note: "初回約5MB" },
  { value: "anime",   label: "アニメ・イラスト",          note: "初回約168MB" },
];

export function BgRemovalPanel() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const enabled = useConverterStore((s) => s.bgRemoval.enabled);
  const model = useConverterStore((s) => s.bgRemoval.model);
  const setEnabled = useConverterStore((s) => s.setBgRemovalEnabled);
  const setModel = useConverterStore((s) => s.setBgModel);
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

      {enabled && (
        <div className="mt-2 pl-5 flex flex-col gap-1.5">
          {MODELS.map((m) => (
            <label key={m.value} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="bgModel"
                value={m.value}
                checked={model === m.value}
                disabled={isConverting}
                onChange={() => setModel(m.value)}
                className="accent-blue-600 disabled:opacity-50"
              />
              <span>{m.label}</span>
              <span className="text-gray-400">({m.note})</span>
            </label>
          ))}
          <p className="text-xs text-gray-400 mt-0.5">
            初回のみダウンロード。以降は即時起動。
          </p>
        </div>
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
