import { create } from "zustand";
import type {
  FileEntry,
  FormatOptions,
  ConversionSummary,
  OutputFormat,
  ResizeSettings,
  ResizeMode,
  ResizeFilter,
  TargetSizeSettings,
  BgRemovalSettings,
  BgModel,
} from "../types";

interface ConverterState {
  files: FileEntry[];
  outputDir: string;
  formatOptions: FormatOptions;
  resizeSettings: ResizeSettings;
  targetSize: TargetSizeSettings;
  bgRemoval: BgRemovalSettings;
  bgModelStatus: string;
  isConverting: boolean;
  isDraggingOver: boolean;
  summary: ConversionSummary | null;

  addFiles: (entries: FileEntry[]) => void;
  removeFile: (path: string) => void;
  clearFiles: () => void;
  setOutputDir: (dir: string) => void;
  setFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setPngOptimize: (v: boolean) => void;
  setResizeEnabled: (v: boolean) => void;
  setResizeMode: (mode: ResizeMode) => void;
  setResizeWidth: (w: number) => void;
  setResizeHeight: (h: number) => void;
  setResizeLongSide: (s: number) => void;
  setResizePercent: (p: number) => void;
  setResizeFilter: (f: ResizeFilter) => void;
  setTargetSizeEnabled: (v: boolean) => void;
  setTargetSizeKb: (kb: number) => void;
  filenamePrefix: string;
  filenameSuffix: string;
  setFilenamePrefix: (v: string) => void;
  setFilenameSuffix: (v: string) => void;
  preserveMetadata: boolean;
  setPreserveMetadata: (v: boolean) => void;
  previewFile: FileEntry | null;
  setPreviewFile: (file: FileEntry | null) => void;
  setBgRemovalEnabled: (v: boolean) => void;
  setBgModel: (model: BgModel) => void;
  setBgModelStatus: (s: string) => void;
  setFileStatus: (
    path: string,
    status: FileEntry["status"],
    extra?: Partial<Pick<FileEntry, "outputPath" | "errorMessage">>
  ) => void;
  setConverting: (v: boolean) => void;
  setDraggingOver: (v: boolean) => void;
  setSummary: (s: ConversionSummary | null) => void;
  resetForNewConversion: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  files: [],
  outputDir: "",
  formatOptions: { format: "png" },
  targetSize: { enabled: false, kb: 500 },
  filenamePrefix: "",
  filenameSuffix: "",
  preserveMetadata: false,
  previewFile: null,
  bgRemoval: { enabled: false, model: "general" as BgModel },
  bgModelStatus: "",
  resizeSettings: {
    enabled: false,
    mode: "longSide",
    width: 1920,
    height: 1080,
    longSide: 1920,
    percent: 50,
    filter: "lanczos3",
  },
  isConverting: false,
  isDraggingOver: false,
  summary: null,

  addFiles: (entries) =>
    set((s) => ({
      files: [
        ...s.files,
        ...entries.filter((e) => !s.files.some((f) => f.path === e.path)),
      ],
    })),

  removeFile: (path) =>
    set((s) => ({ files: s.files.filter((f) => f.path !== path) })),

  clearFiles: () => set({ files: [], summary: null }),

  setOutputDir: (dir) => set({ outputDir: dir }),

  setFormat: (format) =>
    set((s) => ({ formatOptions: { ...s.formatOptions, format } })),

  setQuality: (quality) =>
    set((s) => ({ formatOptions: { ...s.formatOptions, quality } })),

  setPngOptimize: (v) =>
    set((s) => ({ formatOptions: { ...s.formatOptions, pngOptimize: v } })),

  setResizeEnabled: (v) => set((s) => ({ resizeSettings: { ...s.resizeSettings, enabled: v } })),
  setResizeMode: (mode) => set((s) => ({ resizeSettings: { ...s.resizeSettings, mode } })),
  setResizeWidth: (width) => set((s) => ({ resizeSettings: { ...s.resizeSettings, width } })),
  setResizeHeight: (height) => set((s) => ({ resizeSettings: { ...s.resizeSettings, height } })),
  setResizeLongSide: (longSide) => set((s) => ({ resizeSettings: { ...s.resizeSettings, longSide } })),
  setResizePercent: (percent) => set((s) => ({ resizeSettings: { ...s.resizeSettings, percent } })),
  setResizeFilter: (filter) => set((s) => ({ resizeSettings: { ...s.resizeSettings, filter } })),

  setTargetSizeEnabled: (v) => set((s) => ({ targetSize: { ...s.targetSize, enabled: v } })),
  setTargetSizeKb: (kb) => set((s) => ({ targetSize: { ...s.targetSize, kb } })),
  setFilenamePrefix: (filenamePrefix) => set({ filenamePrefix }),
  setFilenameSuffix: (filenameSuffix) => set({ filenameSuffix }),

  setPreserveMetadata: (preserveMetadata) => set({ preserveMetadata }),
  setPreviewFile: (previewFile) => set({ previewFile }),
  setBgRemovalEnabled: (v) => set((s) => ({ bgRemoval: { ...s.bgRemoval, enabled: v } })),
  setBgModel: (model) => set((s) => ({ bgRemoval: { ...s.bgRemoval, model } })),
  setBgModelStatus: (bgModelStatus) => set({ bgModelStatus }),

  setFileStatus: (path, status, extra = {}) =>
    set((s) => ({
      files: s.files.map((f) =>
        f.path === path ? { ...f, status, ...extra } : f
      ),
    })),

  setConverting: (v) => set({ isConverting: v }),

  setDraggingOver: (v) => set({ isDraggingOver: v }),

  setSummary: (summary) => set({ summary }),

  resetForNewConversion: () =>
    set((s) => ({
      summary: null,
      files: s.files.map((f) => ({ ...f, status: "pending", outputPath: undefined, errorMessage: undefined })),
    })),
}));
