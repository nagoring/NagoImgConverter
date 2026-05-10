import { useCallback, useEffect, useRef } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { convertImages, buildRustOptions, buildResizeParams } from "../lib/tauri";
import { useConverterStore } from "../store/useConverterStore";
import type { ProgressEventPayload, OutputFormat } from "../types";

export function useConversion() {
  const store = useConverterStore();
  const unlistenRef = useRef<UnlistenFn | null>(null);

  useEffect(() => {
    listen<ProgressEventPayload>("progress", (event) => {
      const payload = event.payload;
      switch (payload.type) {
        case "started":
          store.setFileStatus(payload.path, "converting");
          break;
        case "completed":
          store.setFileStatus(payload.path, "success", {
            outputPath: payload.outputPath,
          });
          break;
        case "failed":
          store.setFileStatus(payload.path, "failed", {
            errorMessage: payload.error,
          });
          break;
        case "allDone":
          store.setConverting(false);
          store.setSummary({
            total: payload.total,
            succeeded: payload.succeeded,
            failed: payload.failed,
          });
          break;
      }
    }).then((fn) => {
      unlistenRef.current = fn;
    });

    return () => {
      unlistenRef.current?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startConversion = useCallback(async () => {
    if (store.isConverting || store.files.length === 0) return;
    if (!store.outputDir) {
      alert("出力先フォルダを選択してください。");
      return;
    }

    store.resetForNewConversion();
    store.setConverting(true);

    const options = buildRustOptions(
      store.formatOptions.format as OutputFormat,
      store.formatOptions.quality,
      store.formatOptions.pngOptimize
    );

    await convertImages({
      files: store.files.map((f) => f.path),
      outputDir: store.outputDir,
      options,
      preserveMetadata: false,
      resize: buildResizeParams(store.resizeSettings),
    }).catch((e: unknown) => {
      console.error("convert_images failed:", e);
      store.setConverting(false);
    });
  }, [store]);

  return { startConversion };
}
