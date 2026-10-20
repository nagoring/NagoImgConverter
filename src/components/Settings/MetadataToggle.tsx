import { useConverterStore } from "../../store/useConverterStore";
import { useT } from "../../i18n";

export function MetadataToggle() {
  const enabled = useConverterStore((s) => s.preserveMetadata);
  const setEnabled = useConverterStore((s) => s.setPreserveMetadata);
  const isConverting = useConverterStore((s) => s.isConverting);
  const t = useT();

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
        {t("metadata.label")}
      </label>
      <p className="text-xs text-gray-400 mt-1 pl-5">
        {t("metadata.hint1")}<br />
        {t("metadata.hint2")}
      </p>
    </div>
  );
}
