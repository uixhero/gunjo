import "server-only";
import { statSync } from "node:fs";
import { join } from "node:path";
import type { SsotFile } from "./ssot-files";

export interface SsotFileWithStat extends SsotFile {
  byteSize: number;
  lastModifiedIso: string;
}

export function statSsotFile(file: SsotFile, repoRoot: string): SsotFileWithStat {
  const stat = statSync(join(repoRoot, file.relativePath));
  return {
    ...file,
    byteSize: stat.size,
    lastModifiedIso: stat.mtime.toISOString(),
  };
}
