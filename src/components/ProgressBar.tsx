import { useConverterStore } from "../store/useConverterStore";

export function ProgressBar() {
  const files = useConverterStore((s) => s.files);
  const isConverting = useConverterStore((s) => s.isConverting);

  const done = files.filter(
    (f) => f.status === "success" || f.status === "failed"
  ).length;
  const total = files.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (!isConverting && done === 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{done} / {total} 完了</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
