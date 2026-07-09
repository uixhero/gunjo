import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@gunjo/ui"],
  // /api/ssot/files/[file] は design/ 配下の SSOT ファイルを実行時パスで
  // readFile するため、trace が cwd を広範に巻き込み function が 250MB 超で
  // デプロイ不能になっていた（ギャラリー画像 public/cold-test-shots ~100MB 等）。
  // この route が本当に必要とするのは design/**（~1.5MB）だけ。
  // NOTE: キーは picomatch の glob として解釈されるため、"[file]" と書くと
  // 文字クラス（f/i/l/e の1文字）になり route に一致しない。"*" で受ける。
  // 同じ理由で docs 配下の Markdown ページ群（MarkdownResourcePage が
  // join(process.cwd(), filePath) で docs/*.md / CHANGELOG.md を読む）も
  // 各 150MB 超をトレースしていた。動的 /docs ルートは docs/** と
  // CHANGELOG.md だけ同梱する（静的化済みページには適用されない）。
  outputFileTracingIncludes: {
    "/api/ssot/files/*": ["./design/**"],
    "/docs/**": ["./docs/**", "./CHANGELOG.md"],
  },
  outputFileTracingExcludes: {
    "/api/ssot/files/*": [
      "./public/**",
      "./docs/**",
      "./scripts/**",
      "./src/**",
      "./app/**",
      "./*.tgz",
      "./package-lock.json",
    ],
    "/docs/**": [
      "./public/**",
      "./scripts/**",
      "./src/**",
      "./app/**",
      "./design/**",
      "./*.tgz",
      "./package-lock.json",
    ],
  },
};

export default nextConfig;
