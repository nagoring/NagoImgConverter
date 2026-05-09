import { useConverterStore } from "../store/useConverterStore";

export function DropZone() {
  const isDraggingOver = useConverterStore((s) => s.isDraggingOver);
  const fileCount = useConverterStore((s) => s.files.length);

  if (fileCount > 0) {
    return (
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm transition-colors
          ${isDraggingOver
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-300 text-gray-500"
          }
        `}
      >
        <span>ここに画像をドロップして追加</span>
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
        min-h-[220px] transition-all duration-150
        ${isDraggingOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }
      `}
    >
      <div className="text-5xl select-none">🖼️</div>
      <div className="text-center">
        <p className="font-semibold text-gray-700">画像をここにドロップ</p>
        <p className="text-sm text-gray-500 mt-1">
          PNG / JPEG / WebP / GIF / BMP に対応
        </p>
      </div>
    </div>
  );
}
