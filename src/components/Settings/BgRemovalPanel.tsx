import { useConverterStore } from "../../store/useConverterStore";
import type { BgModel } from "../../types";
import { useT, type MessageKey } from "../../i18n";

const MODELS: { value: BgModel; label: MessageKey; note: MessageKey }[] = [
  { value: "general", label: "bg.modelGeneral", note: "bg.noteGeneral" },
  { value: "anime",   label: "bg.modelAnime",   note: "bg.noteAnime" },
];

// Rust emits status codes on "bg_model_status"; map them to message keys.
const STATUS_KEYS: Record<string, MessageKey> = {
  downloading_general: "bg.status.downloading_general",
  downloading_anime: "bg.status.downloading_anime",
  loading: "bg.status.loading",
};

export function BgRemovalPanel() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const enabled = useConverterStore((s) => s.bgRemoval.enabled);
  const model = useConverterStore((s) => s.bgRemoval.model);
  const setEnabled = useConverterStore((s) => s.setBgRemovalEnabled);
  const setModel = useConverterStore((s) => s.setBgModel);
  const modelStatus = useConverterStore((s) => s.bgModelStatus);
  const isConverting = useConverterStore((s) => s.isConverting);
  const t = useT();

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
        {t("bg.label")}
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
              <span>{t(m.label)}</span>
              <span className="text-gray-400">({t(m.note)})</span>
            </label>
          ))}
          <p className="text-xs text-gray-400 mt-0.5">
            {t("bg.hint")}
          </p>
        </div>
      )}

      {modelStatus && (
        <p className="text-xs text-blue-500 mt-1.5 pl-5 flex items-center gap-1">
          <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          {STATUS_KEYS[modelStatus] ? t(STATUS_KEYS[modelStatus]) : modelStatus}
        </p>
      )}
    </div>
  );
}
