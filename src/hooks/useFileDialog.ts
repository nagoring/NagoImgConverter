import { useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { validateOutputDir } from "../lib/tauri";
import { useConverterStore } from "../store/useConverterStore";
import { translate } from "../i18n";

export function useFileDialog() {
  const setOutputDir = useConverterStore((s) => s.setOutputDir);

  const pickOutputFolder = useCallback(async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: translate("output.dialogTitle"),
    });

    if (typeof selected !== "string" || !selected) return;

    const valid = await validateOutputDir(selected);
    if (valid) {
      setOutputDir(selected);
    } else {
      alert(translate("output.notWritable"));
    }
  }, [setOutputDir]);

  return { pickOutputFolder };
}
