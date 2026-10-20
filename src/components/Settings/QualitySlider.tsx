import { useConverterStore } from "../../store/useConverterStore";
import { useT } from "../../i18n";

export function QualitySlider() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const quality = useConverterStore((s) => s.formatOptions.quality);
  const setQuality = useConverterStore((s) => s.setQuality);
  const isConverting = useConverterStore((s) => s.isConverting);
  const t = useT();

  if (format !== "jpeg" && format !== "webp" && format !== "avif") return null;

  const currentQuality = quality ?? (format === "jpeg" ? 85 : format === "avif" ? 80 : 100);
  const isWebP = format === "webp";
  const losslessLabel = isWebP && currentQuality >= 100 ? t("quality.lossless") : "";

  return (
    <div>
      <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>
          {t("quality.label")}{losslessLabel}
        </span>
        <span className="text-blue-600 font-semibold">
          {currentQuality}{isWebP ? "" : "%"}
          {isWebP && <span className="text-gray-400 text-xs ml-1">/ 100</span>}
        </span>
      </label>
      <input
        type="range"
        min={1}
        max={100}
        value={currentQuality}
        disabled={isConverting}
        onChange={(e) => setQuality(Number(e.target.value))}
        className="w-full accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isWebP && (
        <p className="text-xs text-gray-400 mt-1">
          {t("quality.webpHint")}
        </p>
      )}
      {format === "jpeg" && (
        <p className="text-xs text-gray-400 mt-1">
          {t("quality.jpegHint")}
        </p>
      )}
      {format === "avif" && (
        <p className="text-xs text-gray-400 mt-1">
          {t("quality.avifHint")}
        </p>
      )}
    </div>
  );
}
