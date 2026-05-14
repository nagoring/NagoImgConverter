import { useConverterStore } from "../store/useConverterStore";

export function SummaryReport() {
  const summary = useConverterStore((s) => s.summary);
  const files = useConverterStore((s) => s.files);
  const clearFiles = useConverterStore((s) => s.clearFiles);
  const resetForNewConversion = useConverterStore((s) => s.resetForNewConversion);
  const setSummary = useConverterStore((s) => s.setSummary);

  if (!summary) return null;

  const failedFiles = files.filter((f) => f.status === "failed");

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={() => setSummary(null)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">変換完了</h2>
          <button
            onClick={() => setSummary(null)}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none"
            title="閉じる（ファイルはそのまま）"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{summary.succeeded}</div>
            <div className="text-xs text-green-700 mt-0.5">成功</div>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
            <div className="text-xs text-red-700 mt-0.5">失敗</div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{summary.total}</div>
            <div className="text-xs text-gray-500 mt-0.5">合計</div>
          </div>
        </div>

        {failedFiles.length > 0 && (
          <div className="bg-red-50 rounded-xl p-3 space-y-1 max-h-40 overflow-auto">
            <p className="text-xs font-medium text-red-700 mb-2">失敗したファイル</p>
            {failedFiles.map((f) => (
              <div key={f.path} className="text-xs text-red-600">
                <span className="font-medium">{f.name}</span>
                {f.errorMessage && (
                  <span className="text-red-400 ml-1">— {f.errorMessage}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={resetForNewConversion}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            もう一度変換
          </button>
          <button
            onClick={clearFiles}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            クリアして終了
          </button>
        </div>
      </div>
    </div>
  );
}
