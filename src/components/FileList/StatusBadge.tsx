import type { FileEntry } from "../../types";

const config: Record<
  FileEntry["status"],
  { label: string; className: string }
> = {
  pending:    { label: "待機中",  className: "bg-gray-100 text-gray-600" },
  converting: { label: "変換中…", className: "bg-blue-100 text-blue-700 animate-pulse" },
  success:    { label: "完了",    className: "bg-green-100 text-green-700" },
  failed:     { label: "エラー",  className: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: FileEntry["status"] }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
