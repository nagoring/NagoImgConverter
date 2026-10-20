import type { FileEntry } from "../../types";
import { useT, type MessageKey } from "../../i18n";

const config: Record<
  FileEntry["status"],
  { label: MessageKey; className: string }
> = {
  pending:    { label: "status.pending",    className: "bg-gray-100 text-gray-600" },
  converting: { label: "status.converting", className: "bg-blue-100 text-blue-700 animate-pulse" },
  success:    { label: "status.success",    className: "bg-green-100 text-green-700" },
  failed:     { label: "status.failed",     className: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: FileEntry["status"] }) {
  const t = useT();
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {t(label)}
    </span>
  );
}
