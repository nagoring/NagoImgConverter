import { useConverterStore } from "../../store/useConverterStore";

export function MetadataToggle() {
  const enabled = useConverterStore((s) => s.preserveMetadata);
  const setEnabled = useConverterStore((s) => s.setPreserveMetadata);
  const isConverting = useConverterStore((s) => s.isConverting);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          disabled={isConverting}
          onChange={(e) => setEnabled(e.target.checked)}
          className="accent-blue-600 disabled:opacity-50"
        />
        メタデータを保持（EXIF）
      </label>
      <p className="text-xs text-gray-400 mt-1 pl-5">
        撮影情報・日時を出力ファイルに引き継ぎます。<br />
        JPEG / PNG / WebP 出力時のみ有効。
      </p>
    </div>
  );
}
