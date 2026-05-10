import { useConverterStore } from "../store/useConverterStore";
import { useConversion } from "../hooks/useConversion";

export function ConvertButton() {
  const files = useConverterStore((s) => s.files);
  const outputDir = useConverterStore((s) => s.outputDir);
  const isConverting = useConverterStore((s) => s.isConverting);
  const { startConversion } = useConversion();

  const canConvert = files.length > 0 && !!outputDir && !isConverting;

  return (
    <button
      onClick={startConversion}
      disabled={!canConvert}
      className={`
        w-full py-3 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2
        ${canConvert
          ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }
      `}
    >
      {isConverting ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          変換中…
        </>
      ) : (
        `変換開始（${files.length} ファイル）`
      )}
    </button>
  );
}
