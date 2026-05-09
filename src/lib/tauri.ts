import { invoke } from "@tauri-apps/api/core";
import type { OutputFormat } from "../types";

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
}

// The serde-tagged JSON shape that Rust's FormatOptions expects.
export type RustFormatOptions =
  | { format: "png" }
  | { format: "jpeg"; quality: number }
  | { format: "webp"; quality?: number }
  | { format: "gif" }
  | { format: "bmp" };

export interface ConvertRequest {
  files: string[];
  outputDir: string;
  options: RustFormatOptions;
  preserveMetadata: boolean;
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
  quality?: number
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
      return { format: "png" };
    case "gif":
      return { format: "gif" };
    case "bmp":
      return { format: "bmp" };
  }
}
