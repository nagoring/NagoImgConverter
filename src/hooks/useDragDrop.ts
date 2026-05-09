import { useEffect } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { getFileInfo } from "../lib/tauri";
import { IMAGE_EXTENSIONS } from "../lib/format";
import { useConverterStore } from "../store/useConverterStore";

export function useDragDrop() {
  const addFiles = useConverterStore((s) => s.addFiles);
  const setDraggingOver = useConverterStore((s) => s.setDraggingOver);
  const setOutputDir = useConverterStore((s) => s.setOutputDir);
  const outputDir = useConverterStore((s) => s.outputDir);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    getCurrentWebview()
      .onDragDropEvent(async (event) => {
        const { type } = event.payload;

        if (type === "enter" || type === "over") {
          setDraggingOver(true);
          return;
        }

        if (type === "leave") {
          setDraggingOver(false);
          return;
        }

        if (type === "drop") {
          setDraggingOver(false);
          const paths = event.payload.paths.filter((p: string) => {
            const ext = p.split(".").pop()?.toLowerCase() ?? "";
            return IMAGE_EXTENSIONS.has(ext);
          });

          if (paths.length === 0) return;

          // Auto-set output dir to the first file's directory if not already set.
          if (!outputDir) {
            const dir = paths[0].replace(/[/\\][^/\\]+$/, "");
            if (dir) setOutputDir(dir);
          }

          const infos = await getFileInfo(paths);
          addFiles(
            infos.map((info) => ({
              ...info,
              status: "pending" as const,
            }))
          );
        }
      })
      .then((fn) => {
        unlisten = fn;
      });

    return () => {
      unlisten?.();
    };
  }, [addFiles, setDraggingOver, setOutputDir, outputDir]);
}
