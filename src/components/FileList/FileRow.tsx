import { useConverterStore } from "../../store/useConverterStore";
import { formatBytes } from "../../lib/format";
import { StatusBadge } from "./StatusBadge";
import type { FileEntry } from "../../types";

export function FileRow({ file }: { file: FileEntry }) {
  const removeFile = useConverterStore((s) => s.removeFile);
  const setPreviewFile = useConverterStore((s) => s.setPreviewFile);
  const isConverting = useConverterStore((s) => s.isConverting);

  return (
    <tr
      className="border-b border-gray-100 last:border-0 hover:bg-blue-50 cursor-pointer transition-colors"
      onClick={() => setPreviewFile(file)}
    >
      <td className="py-2 px-3 text-sm font-medium text-gray-900 max-w-[200px] truncate" title={file.name}>
        {file.name}
      </td>
      <td className="py-2 px-3 text-sm text-gray-500 uppercase">
        {file.extension || "—"}
      </td>
      <td className="py-2 px-3 text-sm text-gray-500">
        {formatBytes(file.size)}
      </td>
      <td className="py-2 px-3">
        <StatusBadge status={file.status} />
      </td>
      <td className="py-2 px-3 text-xs text-gray-400 max-w-[160px] truncate" title={file.errorMessage}>
        {file.status === "failed" && file.errorMessage ? file.errorMessage : ""}
        {file.status === "success" && file.outputPath
          ? file.outputPath.split("/").pop()
          : ""}
      </td>
      <td className="py-2 px-3">
        <button
          onClick={(e) => { e.stopPropagation(); removeFile(file.path); }}
          disabled={isConverting}
          className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="削除"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
