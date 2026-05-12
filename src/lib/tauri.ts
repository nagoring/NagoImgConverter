import { invoke } from "@tauri-apps/api/core";
import type { OutputFormat, ResizeSettings } from "../types";

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
}

// The serde-tagged JSON shape that Rust's FormatOptions expects.
export type RustFormatOptions =
  | { format: "png"; optimize?: boolean }
  | { format: "jpeg"; quality: number }
  | { format: "webp"; quality?: number }
  | { format: "gif" }
  | { format: "bmp" }
  | { format: "tiff" }
  | { format: "avif"; quality: number };

export interface RustResizeParams {
  mode: "widthHeight" | "longSide" | "percent";
  filter: "lanczos3" | "bilinear" | "nearest";
  width?: number;
  height?: number;
  longSide?: number;
  percent?: number;
}

export interface ConvertRequest {
  files: string[];
  outputDir: string;
  options: RustFormatOptions;
  preserveMetadata: boolean;
  resize?: RustResizeParams;
  targetSizeKb?: number;
  bgRemoval: boolean;
}

export function buildResizeParams(s: ResizeSettings): RustResizeParams | undefined {
  if (!s.enabled) return undefined;
  const base = { mode: s.mode, filter: s.filter } as const;
  switch (s.mode) {
    case "widthHeight": return { ...base, width: s.width, height: s.height };
    case "longSide":    return { ...base, longSide: s.longSide };
    case "percent":     return { ...base, percent: s.percent };
  }
}

export const getFileInfo = (paths: string[]): Promise<FileInfo[]> =>
  invoke("get_file_info", { paths });

export const validateOutputDir = (dir: string): Promise<boolean> =>
  invoke("validate_output_dir", { dir });

export const convertImages = (request: ConvertRequest): Promise<void> =>
  invoke("convert_images", { request });

/// Build the serde-tagged RustFormatOptions object expected by Rust.
export function buildRustOptions(
  format: OutputFormat,
  quality?: number,
  pngOptimize?: boolean
): RustFormatOptions {
  switch (format) {
    case "jpeg":
      return { format: "jpeg", quality: quality ?? 85 };
    case "webp": {
      const q = quality ?? 100;
      // quality >= 100 → lossless (omit the field so Rust uses None)
      return q >= 100 ? { format: "webp" } : { format: "webp", quality: q };
    }
    case "png":
      return pngOptimize ? { format: "png", optimize: true } : { format: "png" };
    case "gif":
      return { format: "gif" };
    case "bmp":
      return { format: "bmp" };
    case "tiff":
      return { format: "tiff" };
    case "avif":
      return { format: "avif", quality: quality ?? 80 };
  }
}
