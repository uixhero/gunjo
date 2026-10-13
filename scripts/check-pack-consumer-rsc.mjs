#!/usr/bin/env node
// Build a throwaway Next.js App Router app against the packed tarball and
// fail if `next build` breaks when a Server Component imports from the root
// barrel (#684).
//
// #684 reported `TypeError: createContext is not a function` at "Collecting
// page data" when `app/layout.tsx` (a Server Component) did
// `import { TooltipProvider } from "@gunjo/ui"` (0.1.0-beta.1, Next 16.2.10,
// Turbopack). It could not be reproduced later (2026-09-22, 7 variants), so
// "fixed" can only be claimed by building that exact shape on every change.
// This script is that build:
//
// - `npm pack` of this checkout (its `prepare` script rebuilds dist/), installed
//   into an empty app the way an adopter would — no source aliases, no
//   transpilePackages, and none of the optional peers (#492), so it also
//   proves the root barrel builds without them.
// - app/layout.tsx is the #684 repro verbatim; app/page.tsx is a second
//   Server Component rendering root-barrel components into static HTML.
// - `next build` with Turbopack (the reported bundler) and with webpack.
//   Pass = exit 0, no `createContext is not a function`, and the prerendered
//   page contains the marker text.
// - Then the page skeleton the installation docs teach (#774) is added and
//   built with the same bundlers: `app/orders/page.tsx` (a Server Component
//   that exports `metadata`) and `app/orders/OrdersClient.tsx` ("use client",
//   imports from the root and from `@gunjo/ui/table`). The code is read from
//   the docs themselves (ja.ts, en.ts, docs/adoption.md), so the published
//   example is the code that builds. `@tanstack/react-table` is installed for
//   this step only, after the no-peer builds. Pass = the prerendered page has
//   the `metadata` title in <title> and the header title in <h1>.
//
//   node scripts/check-pack-consumer-rsc.mjs                 # both bundlers
//   node scripts/check-pack-consumer-rsc.mjs --bundler=turbopack
//   node scripts/check-pack-consumer-rsc.mjs --tarball=path/to/gunjo-ui.tgz
//   node scripts/check-pack-consumer-rsc.mjs --self-test     # must catch a broken RSC import
//                                                            # and a skeleton without metadata
//
// Next.js version: GUNJO_PACK_NEXT_VERSION (default 16.2.10, the version #684
// was reported on). Needs network access for `npm install`.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);
const NEXT_VERSION = process.env.GUNJO_PACK_NEXT_VERSION ?? "16.2.10";
const MARKER = "GUNJO_PACK_CONSUMER_OK";
const selfTest = args.has("self-test");
const bundlers = selfTest
  ? ["turbopack"]
  : args.get("bundler") && args.get("bundler") !== "both"
    ? [args.get("bundler")]
    : ["turbopack", "webpack"];

// #684's reproduction, unchanged.
const LAYOUT = `import { TooltipProvider } from "@gunjo/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
`;

// A second Server Component that renders root-barrel components (client and
// server-safe ones) into the prerendered HTML.
const PAGE = `import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>${MARKER}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>beta</Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Button</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip</TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
`;

// Self-test only: a Server Component that calls a client hook through the
// barrel. Next must refuse this at build time, so the check has to fail.
const BROKEN_PAGE = `import { useTheme } from "@gunjo/ui";

export default function Page() {
  const theme = useTheme();
  return <p>${MARKER} {String(theme)}</p>;
}
`;

// The page skeleton from the installation docs (#774). Each source must hold
// exactly one `app/orders/page.tsx` block and one `app/orders/OrdersClient.tsx`
// block; the Japanese docs page and docs/adoption.md must carry the same code.
const SKELETON_SOURCES = [
  { lang: "ja", file: "app/lib/docs-content/ja.ts", templateLiteral: true },
  { lang: "ja", file: "docs/adoption.md", templateLiteral: false },
  { lang: "en", file: "app/lib/docs-content/en.ts", templateLiteral: true },
];
const SKELETON_FILES = ["app/orders/page.tsx", "app/orders/OrdersClient.tsx"];
const PEER_FOR_SKELETON = "@tanstack/react-table";

function extractSkeleton({ file, templateLiteral }) {
  let text = readFileSync(join(root, file), "utf8");
  // ja.ts / en.ts hold the docs as template literals: undo their escapes.
  if (templateLiteral) text = text.replace(/\\([`$\\])/g, "$1");
  const blocks = {};
  for (const match of text.matchAll(/```tsx\n(\/\/ (app\/orders\/[\w.]+)[^\n]*\n[\s\S]*?)```/g)) {
    const [, code, path] = match;
    if (blocks[path]) throw new Error(`${file}: more than one code block for ${path}`);
    blocks[path] = code;
  }
  for (const path of SKELETON_FILES) {
    if (!blocks[path]) throw new Error(`${file}: no code block starting with "// ${path}"`);
  }
  return blocks;
}

function loadSkeletons() {
  const byLang = new Map();
  for (const source of SKELETON_SOURCES) {
    const blocks = extractSkeleton(source);
    const seen = byLang.get(source.lang);
    if (!seen) {
      byLang.set(source.lang, { ...blocks, from: source.file });
      continue;
    }
    for (const path of SKELETON_FILES) {
      if (seen[path] !== blocks[path]) {
        throw new Error(`${source.file}: ${path} differs from the same block in ${seen.from}`);
      }
    }
  }
  return [...byLang].map(([lang, blocks]) => ({ lang, blocks }));
}

// Self-test only: the skeleton with `metadata` taken out — the #774 mistake.
function stripMetadata(code) {
  const stripped = code
    .replace(/^import type \{ Metadata \} from "next";\n/m, "")
    .replace(/^export const metadata[\s\S]*?\n\};\n\n?/m, "");
  if (stripped === code || /metadata/i.test(stripped)) throw new Error("could not strip metadata from the skeleton");
  return stripped;
}

function writeSkeletons(dir, skeletons, { withoutMetadata = false } = {}) {
  return skeletons.map(({ lang, blocks }) => {
    for (const path of SKELETON_FILES) {
      const target = join(dir, path.replace(/^app\//, `app/${lang}/`));
      mkdirSync(dirname(target), { recursive: true });
      const code = withoutMetadata && path.endsWith("page.tsx") ? stripMetadata(blocks[path]) : blocks[path];
      writeFileSync(target, code);
    }
    const title = blocks["app/orders/page.tsx"].match(/title: "([^"]+)"/)?.[1];
    const heading = blocks["app/orders/OrdersClient.tsx"].match(/PageHeader[^>]*\btitle="([^"]+)"/)?.[1];
    if (!title || !heading) throw new Error(`${lang}: could not read the metadata title or the header title from the skeleton`);
    return { lang, route: `/${lang}/orders`, html: join(dir, ".next", "server", "app", lang, "orders.html"), title, heading };
  });
}

function checkSkeletonHtml(page) {
  const html = existsSync(page.html) ? readFileSync(page.html, "utf8") : "";
  const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    title: html.includes(`<title>${escape(page.title)}</title>`),
    heading: new RegExp(`<h1[^>]*>${escape(page.heading).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h1>`).test(html),
    table: html.includes("<table"),
  };
}

function run(command, commandArgs, options) {
  const result = spawnSync(command, commandArgs, { encoding: "utf8", maxBuffer: 1 << 28, ...options });
  return { status: result.status, output: `${result.stdout ?? ""}${result.stderr ?? ""}` };
}

function packTarball(dest) {
  if (args.get("tarball")) return resolve(args.get("tarball"));
  // `npm pack` runs the `prepare` script, which rebuilds dist/ (build:lib), so
  // the tarball is always this checkout. Its stdout carries that build log, so
  // find the tarball on disk instead of parsing `--json`.
  const packDir = join(dest, "pack");
  mkdirSync(packDir, { recursive: true });
  execFileSync("npm", ["pack", "--pack-destination", packDir], { cwd: root, stdio: ["ignore", "ignore", "inherit"] });
  const tarball = readdirSync(packDir).find((name) => name.endsWith(".tgz"));
  if (!tarball) {
    console.error("check-pack-consumer-rsc: npm pack produced no tarball");
    process.exit(1);
  }
  return join(packDir, tarball);
}

function createApp(dir, tarball, page) {
  mkdirSync(join(dir, "app"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    `${JSON.stringify(
      {
        name: "gunjo-pack-consumer-rsc",
        private: true,
        dependencies: {
          "@gunjo/ui": `file:${tarball}`,
          next: NEXT_VERSION,
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
        devDependencies: { "@types/node": "^20", "@types/react": "^19", typescript: "^5" },
      },
      null,
      2
    )}\n`
  );
  writeFileSync(join(dir, "next.config.mjs"), "export default {};\n");
  writeFileSync(
    join(dir, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          module: "esnext",
          moduleResolution: "bundler",
          jsx: "preserve",
          esModuleInterop: true,
          isolatedModules: true,
          plugins: [{ name: "next" }],
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    )}\n`
  );
  writeFileSync(join(dir, "app", "layout.tsx"), LAYOUT);
  writeFileSync(join(dir, "app", "page.tsx"), page);
}

function buildWith(dir, bundler) {
  rmSync(join(dir, ".next"), { recursive: true, force: true });
  const buildArgs = ["next", "build", bundler === "webpack" ? "--webpack" : "--turbopack"];
  const { status, output } = run("npx", buildArgs, {
    cwd: dir,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", CI: "1" },
  });
  const htmlPath = join(dir, ".next", "server", "app", "index.html");
  const html = existsSync(htmlPath) ? readFileSync(htmlPath, "utf8") : "";
  const createContextError = /createContext is not a function/.test(output);
  const ok = status === 0 && !createContextError && html.includes(MARKER);
  return { ok, status, createContextError, rendered: html.includes(MARKER), output };
}

const work = mkdtempSync(join(tmpdir(), "gunjo-pack-consumer-"));
let failed = false;
try {
  const skeletons = loadSkeletons();
  const tarball = packTarball(work);
  const app = join(work, "app");
  createApp(app, tarball, selfTest ? BROKEN_PAGE : PAGE);
  console.log(`check-pack-consumer-rsc: ${tarball.split("/").pop()} + next@${NEXT_VERSION} in ${app}`);
  const install = run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], { cwd: app });
  if (install.status !== 0) {
    console.error(install.output);
    console.error("check-pack-consumer-rsc: npm install failed");
    process.exit(1);
  }
  const peers = ["@tanstack/react-table", "react-day-picker", "vaul", "embla-carousel-react", "react-markdown", "framer-motion"]
    .filter((dep) => existsSync(join(app, "node_modules", dep)));
  console.log(`  optional peers installed: ${peers.length === 0 ? "none" : peers.join(", ")}`);

  for (const bundler of bundlers) {
    const result = buildWith(app, bundler);
    if (selfTest) {
      if (result.ok) {
        console.error("check-pack-consumer-rsc --self-test: FAILED — a Server Component calling a client hook built cleanly");
        failed = true;
      } else {
        console.log(`check-pack-consumer-rsc --self-test: ok (${bundler}: the broken RSC import fails the check, exit ${result.status})`);
      }
      continue;
    }
    if (result.ok) {
      console.log(`  ok   next build (${bundler}) — exit 0, page prerendered with the marker`);
    } else {
      failed = true;
      console.log(result.output.split("\n").slice(-40).join("\n"));
      console.log(
        `  FAIL next build (${bundler}) — exit ${result.status}, createContext error: ${result.createContextError}, marker rendered: ${result.rendered}`
      );
    }
  }

  // The installation docs' page skeleton (#774). In the self-test it is built
  // without `metadata`, and the check has to notice the missing tab title.
  if (selfTest) writeFileSync(join(app, "app", "page.tsx"), PAGE);
  const pages = writeSkeletons(app, skeletons, { withoutMetadata: selfTest });
  const peer = run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error", PEER_FOR_SKELETON], { cwd: app });
  if (peer.status !== 0) {
    console.error(peer.output);
    console.error(`check-pack-consumer-rsc: npm install ${PEER_FOR_SKELETON} failed`);
    process.exit(1);
  }
  for (const bundler of bundlers) {
    const result = buildWith(app, bundler);
    const checks = pages.map((page) => ({ page, ...checkSkeletonHtml(page) }));
    if (selfTest) {
      const caught = result.status === 0 && checks.every((c) => !c.title && c.heading && c.table);
      if (caught) {
        console.log(`check-pack-consumer-rsc --self-test: ok (${bundler}: the skeleton without metadata fails the tab-title check)`);
      } else {
        failed = true;
        console.log(result.output.split("\n").slice(-40).join("\n"));
        console.error(
          `check-pack-consumer-rsc --self-test: FAILED — the skeleton without metadata was not caught as a missing tab title (${bundler}, exit ${result.status}, ${JSON.stringify(checks.map(({ page, ...c }) => ({ route: page.route, ...c })))})`
        );
      }
      continue;
    }
    if (result.status === 0 && checks.every((c) => c.title && c.heading && c.table)) {
      console.log(`  ok   docs page skeleton (${bundler}) — ${pages.map((p) => `${p.route}: <title>${p.title}</title>`).join(", ")}`);
    } else {
      failed = true;
      if (result.status !== 0) console.log(result.output.split("\n").slice(-40).join("\n"));
      for (const { page, title, heading, table } of checks) {
        console.log(`  FAIL docs page skeleton (${bundler}) ${page.route} — exit ${result.status}, <title> ${title}, <h1> ${heading}, <table> ${table}`);
      }
    }
  }
} finally {
  if (args.has("keep")) console.log(`  kept: ${work}`);
  else rmSync(work, { recursive: true, force: true });
}

if (failed) process.exit(1);
if (!selfTest) {
  console.log(
    `check-pack-consumer-rsc: passed (${bundlers.join(" + ")}, Server Component imports from the root barrel, docs page skeleton with metadata)`
  );
}
