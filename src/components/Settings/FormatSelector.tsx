import { useConverterStore } from "../../store/useConverterStore";
import type { OutputFormat } from "../../types";

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "png",  label: "PNG"  },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "gif",  label: "GIF"  },
  { value: "bmp",  label: "BMP"  },
  { value: "tiff", label: "TIFF" },
  { value: "avif", label: "AVIF" },
  { value: "ico",  label: "ICO"  },
];

export function FormatSelector() {
  const format = useConverterStore((s) => s.formatOptions.format);
  const setFormat = useConverterStore((s) => s.setFormat);
  const isConverting = useConverterStore((s) => s.isConverting);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        出力形式
      </label>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            disabled={isConverting}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium border transition-colors disabled:cursor-not-allowed
              ${format === f.value
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
