import { join } from "node:path";
import { readText } from "./design-sync/shared.mjs";

export function readGeneratedConstObject({ root, filePath, exportName }) {
  const source = readText(join(root, filePath));
  const match = source.match(
    new RegExp(`export const ${exportName} = ([\\s\\S]*?)\\s+as const;`)
  );

  if (!match) {
    throw new Error(
      `design:verify: ${filePath} does not contain \`export const ${exportName} = ... as const;\``
    );
  }

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(
      `design:verify: failed to parse ${filePath} (${exportName}) as JSON: ${error.message}`
    );
  }
}
