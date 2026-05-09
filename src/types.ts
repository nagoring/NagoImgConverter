export type OutputFormat = "png" | "jpeg" | "webp" | "gif" | "bmp";

export interface FormatOptions {
  format: OutputFormat;
  quality?: number; // jpeg: 1-100, webp: 0-100 (100 = lossless)
}

export interface FileEntry {
  path: string;
  name: string;
  size: number;
  extension: string;
  status: "pending" | "converting" | "success" | "failed";
  outputPath?: string;
  errorMessage?: string;
}

export type ProgressEventPayload =
  | { type: "started"; path: string }
  | { type: "completed"; path: string; outputPath: string }
  | { type: "failed"; path: string; error: string }
  | { type: "allDone"; total: number; succeeded: number; failed: number };

export interface ConversionSummary {
  total: number;
  succeeded: number;
  failed: number;
}
