#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, readJson } from "./design-sync/shared.mjs";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

// UIXHERO 相互リンクの対応表（app/lib/data/uixhero-mapping.json）が
// 生成済み navigation と乖離していないかを検査する。
// - entries[].gunjo の各 slug が /docs/components/<slug> として実在すること
// - laws[].gunjo の各 href が navigation に実在すること（/patterns 等も含む）
// - laws[].kind === "page" は表示ラベル（title）を持つこと
// uixhero.com 側 slug の実在は simple-blog-sec リポジトリの
// scripts/verify-gunjo-mapping.mjs が対で検査する（両サイトで双方向に守る）。
export function verifyUixheroMapping({ root = ROOT } = {}) {
  const navigationSource = readFileSync(join(root, "app/lib/navigation.ts"), "utf8");
  const knownHrefs = new Set(
    [...navigationSource.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1])
  );

  const mapping = readJson(join(root, "app/lib/data/uixhero-mapping.json"));
  const problems = [];

  for (const entry of mapping.entries ?? []) {
    for (const slug of entry.gunjo ?? []) {
      if (!knownHrefs.has(`/docs/components/${slug}`)) {
        problems.push(`entries: gunjo slug "${slug}" not found in navigation (uixhero: ${entry.uixhero})`);
      }
    }
  }

  for (const law of mapping.laws ?? []) {
    for (const href of law.gunjo ?? []) {
      if (!knownHrefs.has(href)) {
        problems.push(`laws: gunjo href "${href}" not found in navigation (uixhero: ${law.uixhero})`);
      }
    }
    if (law.kind === "page" && !law.title) {
      problems.push(`laws: page entry "${law.uixhero}" is missing a display title`);
    }
  }

  if (problems.length > 0) {
    throwLinesError([
      "verify-uixhero-mapping: uixhero-mapping.json is out of sync with navigation.",
      "Update app/lib/data/uixhero-mapping.json (SSOT: KeEem-ruled cross-link table):",
      ...problems.map((problem) => `- ${problem}`),
    ]);
  }
}

runVerificationCli({
  scriptName: "verify-uixhero-mapping.mjs",
  verify: verifyUixheroMapping,
  successMessage: "verify:uixhero-mapping: passed",
});
