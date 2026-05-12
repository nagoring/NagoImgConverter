import { useConverterStore } from "../../store/useConverterStore";

export function FilenameTemplate() {
  const prefix = useConverterStore((s) => s.filenamePrefix);
  const suffix = useConverterStore((s) => s.filenameSuffix);
  const setPrefix = useConverterStore((s) => s.setFilenamePrefix);
  const setSuffix = useConverterStore((s) => s.setFilenameSuffix);
  const isConverting = useConverterStore((s) => s.isConverting);
  const files = useConverterStore((s) => s.files);
  const format = useConverterStore((s) => s.formatOptions.format);

  const exampleStem = files[0]
    ? files[0].name.replace(/\.[^.]+$/, "")
    : "example";
  const preview = `${prefix}${exampleStem}${suffix}.${format}`;

  const inputClass =
    "border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 min-w-0";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        出力ファイル名
      </label>
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={prefix}
          disabled={isConverting}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="prefix"
          className={`${inputClass} w-20`}
        />
        <span className="text-sm text-gray-400 shrink-0">{"{name}"}</span>
        <input
          type="text"
          value={suffix}
          disabled={isConverting}
          onChange={(e) => setSuffix(e.target.value)}
          placeholder="suffix"
          className={`${inputClass} w-20`}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">
        → <span className="font-mono">{preview}</span>
      </p>
    </div>
  );
}
