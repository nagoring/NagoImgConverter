import { useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { validateOutputDir } from "../lib/tauri";
import { useConverterStore } from "../store/useConverterStore";

export function useFileDialog() {
  const setOutputDir = useConverterStore((s) => s.setOutputDir);

  const pickOutputFolder = useCallback(async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "出力先フォルダを選択",
    });

    if (typeof selected !== "string" || !selected) return;

    const valid = await validateOutputDir(selected);
    if (valid) {
      setOutputDir(selected);
    } else {
      alert("選択したフォルダへの書き込み権限がありません。別のフォルダを選択してください。");
    }
  }, [setOutputDir]);

  return { pickOutputFolder };
}
