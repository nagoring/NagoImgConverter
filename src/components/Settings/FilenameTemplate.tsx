import { useConverterStore } from "../../store/useConverterStore";

function applyTemplate(template: string, stem: string): string {
  const t = template.trim() || "{name}";
  return t.replace("{name}", stem);
}

export function FilenameTemplate() {
  const template = useConverterStore((s) => s.filenameTemplate);
  const setTemplate = useConverterStore((s) => s.setFilenameTemplate);
  const isConverting = useConverterStore((s) => s.isConverting);
  const files = useConverterStore((s) => s.files);
  const format = useConverterStore((s) => s.formatOptions.format);

  const exampleStem = files[0]
    ? files[0].name.replace(/\.[^.]+$/, "")
    : "example";
  const preview = `${applyTemplate(template, exampleStem)}.${format}`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        出力ファイル名
      </label>
      <input
        type="text"
        value={template}
        disabled={isConverting}
        onChange={(e) => setTemplate(e.target.value)}
        placeholder="{name}"
        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
      />
      <p className="text-xs text-gray-400 mt-1">
        <span className="font-mono">{"{name}"}</span> = 元のファイル名（拡張子なし）
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        → <span className="font-mono">{preview}</span>
      </p>
    </div>
  );
}
