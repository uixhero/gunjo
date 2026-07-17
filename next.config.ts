import type { NextConfig } from "next";

// ── セキュリティヘッダ（gunjo.jp）──────────────────────────────────────────
// design-qa / uixhero と同じ型。CSP は Next のハイドレーション inline を許可しつつ
// 外部由来をブロック。dev(next dev) は fast-refresh が eval を使うため dev のみ
// 'unsafe-eval' を許可（本番は eval 不使用）。
//
// allowlist（実測 2026-07-12・handoff-gunjo-security-headers.md）:
// - GTM: @next/third-parties の GoogleTagManager（noscript iframe あり）
// - Vercel Analytics: <Analytics/> + track()。script は va.vercel-scripts.com、
//   ビーコンは同一オリジン /_vercel/insights/*
// - フォント: next/font/google の self-host（外部 font 不要）
// - 画像: cold-test デモが任意ホスト（unsplash/pravatar/gunjo.dev）→ https: 広め
// - youtube はリンクのみ（iframe 埋め込み無し）→ frame-src 不要
//
// ⚠️ CSP は Content-Security-Policy-**Report-Only** で投入（本番監視で違反ゼロを
// 確認してから enforce 化する。uixhero PR #120→#123 と同じ段階手順）。
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com"
  : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://www.googletagmanager.com",
].join("; ");

const embedCsp = csp.replace("frame-ancestors 'none'", "frame-ancestors 'self'");

const createSecurityHeaders = (policy: string, frameOptions: "DENY" | "SAMEORIGIN") => [
  // CSP は Report-Only（enforce は本番監視後の別PRで Content-Security-Policy に改名）。
  { key: "Content-Security-Policy-Report-Only", value: policy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: frameOptions },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const securityHeaders = createSecurityHeaders(csp, "DENY");
// ComponentPreview は同一オリジンの /embed/* を iframe で表示する。外部オリジンは
// 引き続き拒否しつつ、docs からの実プレビューだけを許可する。
const embedSecurityHeaders = createSecurityHeaders(embedCsp, "SAMEORIGIN");

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@gunjo/ui"],
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/embed/:path*", headers: embedSecurityHeaders },
    ];
  },
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
