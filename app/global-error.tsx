"use client";

// global-error replaces the entire document (root layout, providers, and the
// layout's globals.css import). Pull globals.css in directly so design tokens
// resolve, then style with token utility classes instead of inline literals.
import "./globals.css";

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="ja">
            <body className="antialiased">
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
                    <p className="text-3xl font-extrabold tracking-tight text-primary">
                        Gunjo UI
                    </p>
                    <h1 className="text-2xl font-semibold text-foreground">
                        問題が発生しました / Something went wrong
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                        一時的な問題の可能性があります。もう一度お試しください。
                        <br />
                        This may be a temporary problem. Please try again.
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            もう一度試す / Try again
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                            トップへ戻る / Back to home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
