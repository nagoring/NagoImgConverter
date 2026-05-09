import { useConverterStore } from "../../store/useConverterStore";
import { useFileDialog } from "../../hooks/useFileDialog";

export function OutputFolderPicker() {
  const outputDir = useConverterStore((s) => s.outputDir);
  const isConverting = useConverterStore((s) => s.isConverting);
  const { pickOutputFolder } = useFileDialog();

  const displayPath = outputDir
    ? outputDir.split("/").slice(-2).join("/")
    : "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        出力先フォルダ
      </label>
      <button
        onClick={pickOutputFolder}
        disabled={isConverting}
        className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-left hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
      >
        <span className="text-lg">📁</span>
        <span className={`flex-1 truncate ${outputDir ? "text-gray-900" : "text-gray-400"}`}>
          {displayPath || "フォルダを選択…"}
        </span>
      </button>
      {outputDir && (
        <p className="text-xs text-gray-400 mt-1 truncate" title={outputDir}>
          {outputDir}
        </p>
      )}
    </div>
  );
}
