import { useConverterStore } from "../../store/useConverterStore";

export function QualitySlider() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const quality = useConverterStore((s) => s.formatOptions.quality);
  const setQuality = useConverterStore((s) => s.setQuality);
  const isConverting = useConverterStore((s) => s.isConverting);

  if (format !== "jpeg" && format !== "webp") return null;

  const currentQuality = quality ?? (format === "jpeg" ? 85 : 100);
  const isWebP = format === "webp";
  const losslessLabel = isWebP && currentQuality >= 100 ? "（可逆）" : "";

  return (
    <div>
      <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>
          品質{losslessLabel}
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
          100 = 可逆（lossless）/ 1-99 = 非可逆（lossy）
        </p>
      )}
      {format === "jpeg" && (
        <p className="text-xs text-gray-400 mt-1">
          ※ JPEG は透過情報を保持できません（白背景に合成されます）
        </p>
      )}
    </div>
  );
}
