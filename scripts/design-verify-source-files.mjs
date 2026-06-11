import { join } from "node:path";
import { readText } from "./design-sync/shared.mjs";

export function readNamedSources(sourceDirPath, fileNamesByKey) {
  return Object.fromEntries(
    Object.entries(fileNamesByKey).map(([key, fileName]) => [
      key,
      readText(join(sourceDirPath, fileName)),
    ])
  );
}
