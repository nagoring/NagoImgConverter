import { create } from "zustand";
import type {
  FileEntry,
  FormatOptions,
  ConversionSummary,
  OutputFormat,
} from "../types";

interface ConverterState {
  files: FileEntry[];
  outputDir: string;
  formatOptions: FormatOptions;
  isConverting: boolean;
  isDraggingOver: boolean;
  summary: ConversionSummary | null;

  addFiles: (entries: FileEntry[]) => void;
  removeFile: (path: string) => void;
  clearFiles: () => void;
  setOutputDir: (dir: string) => void;
  setFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
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
