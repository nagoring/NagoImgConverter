import { useDragDrop } from "./hooks/useDragDrop";
import { DropZone } from "./components/DropZone";
import { FileList } from "./components/FileList/FileList";
import { FormatSelector } from "./components/Settings/FormatSelector";
import { QualitySlider } from "./components/Settings/QualitySlider";
import { OutputFolderPicker } from "./components/Settings/OutputFolderPicker";
import { MetadataToggle } from "./components/Settings/MetadataToggle";
import { PngOptimizeToggle } from "./components/Settings/PngOptimizeToggle";
import { ResizePanel } from "./components/Settings/ResizePanel";
import { ConvertButton } from "./components/ConvertButton";
import { ProgressBar } from "./components/ProgressBar";
import { SummaryReport } from "./components/SummaryReport";
import { useConverterStore } from "./store/useConverterStore";

export function App() {
  useDragDrop();

  const fileCount = useConverterStore((s) => s.files.length);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        <span className="text-xl">🖼️</span>
        <h1 className="text-base font-semibold text-gray-900">
          Nago Image Converter
        </h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex gap-0 min-h-0 overflow-hidden">
        {/* Left: File area */}
        <div className="flex-1 flex flex-col gap-4 p-6 min-w-0 overflow-hidden">
          <DropZone />
          {fileCount > 0 && (
            <>
              <FileList />
              <ProgressBar />
            </>
          )}
        </div>

        {/* Right: Settings panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col gap-5 p-5 overflow-y-auto">
          <FormatSelector />
          <QualitySlider />
          <PngOptimizeToggle />
          <hr className="border-gray-100" />
          <ResizePanel />
          <hr className="border-gray-100" />
          <OutputFolderPicker />
          <hr className="border-gray-100" />
          <MetadataToggle />
          <div className="mt-auto pt-4">
            <ConvertButton />
          </div>
        </aside>
      </main>

      {/* Conversion result overlay */}
      <SummaryReport />
    </div>
  );
}
