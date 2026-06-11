// Pure data + types describing the SSOT files we expose. Safe to import
// from client components — no node:fs use here. The server-only stat
// helper lives in ssot-files-server.ts.

export type SsotFileKind = "pen" | "core" | "metadata";

export interface SsotFile {
  category: string;
  kind: SsotFileKind;
  fileName: string;
  // Path relative to repo root, used by the download route to read from disk.
  relativePath: string;
  // Public URL the docs site serves the file from.
  downloadUrl: string;
  // MIME we send back. .pen files are JSON internally so application/json is
  // safest for piping into tools.
  contentType: string;
}

const CATEGORIES = [
  "patterns",
  "feedback",
  "layout",
  "navigation",
  "overlay",
  "display",
  "inputs",
] as const;

function buildCategoryFiles(category: string): SsotFile[] {
  return [
    {
      category,
      kind: "pen",
      fileName: `${category}.pen`,
      relativePath: `design/${category}.pen`,
      downloadUrl: `/api/ssot/files/${category}.pen`,
      contentType: "application/json; charset=utf-8",
    },
    {
      category,
      kind: "metadata",
      fileName: `${category}-metadata.json`,
      relativePath: `design/${category}-metadata.json`,
      downloadUrl: `/api/ssot/files/${category}-metadata.json`,
      contentType: "application/json; charset=utf-8",
    },
    {
      category,
      kind: "core",
      fileName: `${category}-core.json`,
      relativePath: `design/component-specs/${category}-core.json`,
      downloadUrl: `/api/ssot/files/${category}-core.json`,
      contentType: "application/json; charset=utf-8",
    },
  ];
}

// Catalog of every SSOT file we expose. Used as both the manifest source
// and the whitelist for the download route — any file not here is rejected.
export const SSOT_FILES: SsotFile[] = CATEGORIES.flatMap(buildCategoryFiles);

const SSOT_FILE_BY_NAME = new Map(SSOT_FILES.map((file) => [file.fileName, file]));

export function getSsotFileByName(fileName: string): SsotFile | undefined {
  return SSOT_FILE_BY_NAME.get(fileName);
}

export const SSOT_CATEGORIES: readonly string[] = CATEGORIES;
