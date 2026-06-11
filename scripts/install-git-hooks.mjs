#!/usr/bin/env node

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function run(command) {
  return execSync(command, { cwd: ROOT, stdio: "pipe" }).toString().trim();
}

function main() {
  try {
    run("git rev-parse --is-inside-work-tree");
  } catch {
    console.log("hooks: skipped (not a git worktree)");
    return;
  }

  run("git config core.hooksPath .githooks");
  console.log("hooks: configured core.hooksPath=.githooks");
}

main();
