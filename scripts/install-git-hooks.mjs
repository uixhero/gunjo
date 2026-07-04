#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Best-effort git command: returns trimmed stdout, or null on any failure.
// Nothing here may throw — this runs from `prepare`, so a throw would break
// `npm install` / `npm pack` / `npm publish`.
function tryRun(command) {
  try {
    return execSync(command, { cwd: ROOT, stdio: "pipe" }).toString().trim();
  } catch {
    return null;
  }
}

function main() {
  if (tryRun("git rev-parse --is-inside-work-tree") !== "true") {
    console.log("hooks: skipped (not a git worktree)");
    return;
  }

  // Only wire hooks for the gunjo repo itself. When @gunjo/ui is installed as a
  // dependency (file:/git+ install), `prepare` runs inside the *host* repo —
  // ROOT is then node_modules/@gunjo/ui and the git toplevel is the host repo,
  // so we must not hijack the host's core.hooksPath.
  const toplevel = tryRun("git rev-parse --show-toplevel");
  if (!toplevel || resolve(toplevel) !== resolve(ROOT)) {
    console.log("hooks: skipped (not the gunjo repo root)");
    return;
  }

  if (!existsSync(join(ROOT, ".githooks"))) {
    console.log("hooks: skipped (.githooks not present)");
    return;
  }

  if (tryRun("git config core.hooksPath .githooks") === null) {
    // Read-only .git (sandbox / CI) — nothing to configure, but never fail.
    console.log("hooks: skipped (could not write git config)");
    return;
  }
  console.log("hooks: configured core.hooksPath=.githooks");
}

main();
