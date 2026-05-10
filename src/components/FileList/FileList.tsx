import { useConverterStore } from "../../store/useConverterStore";
import { FileRow } from "./FileRow";

export function FileList() {
  const files = useConverterStore((s) => s.files);
  const clearFiles = useConverterStore((s) => s.clearFiles);
  const isConverting = useConverterStore((s) => s.isConverting);

  if (files.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {isConverting && (
            <span className="inline-block w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          {isConverting ? "変換中…" : `${files.length} ファイル`}
        </span>
        <button
          onClick={clearFiles}
          disabled={isConverting}
          className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          すべて削除
        </button>
      </div>
      <div className="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-2 px-3 text-xs font-medium text-gray-500">ファイル名</th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500">形式</th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500">サイズ</th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500">ステータス</th>
              <th className="py-2 px-3 text-xs font-medium text-gray-500">出力 / エラー</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRow key={file.path} file={file} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
