// Metadata preservation UI (v1: display only, not yet implemented in the converter).
// Structure is in place for future EXIF / PNG metadata support.
export function MetadataToggle() {
  return (
    <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
      <div>
        <p className="text-sm font-medium text-gray-700">メタデータを保持</p>
        <p className="text-xs text-gray-400">EXIF / PNG metadata（v2 対応予定）</p>
      </div>
      <div className="w-9 h-5 bg-gray-200 rounded-full" />
    </div>
  );
}
