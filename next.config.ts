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
  outputFileTracingIncludes: {
    "/api/ssot/files/*": ["./design/**"],
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
  },
};

export default nextConfig;
