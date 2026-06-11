export default function TypographyPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Typography</h1>
                <p className="text-lg text-muted-foreground">
                    Font families, weights, and sizes.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold border-b pb-2">Font Family</h2>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Sans (Default)</div>
                        <div className="text-4xl font-sans">Inter, Noto Sans JP</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Display</div>
                        <div className="text-4xl font-display">Poppins, Noto Sans JP</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Mono</div>
                        <div className="text-4xl font-mono">JetBrains Mono</div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold border-b pb-2">Font Weight</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="font-light text-2xl">Light (300)</div>
                    <div className="font-normal text-2xl">Normal (400)</div>
                    <div className="font-medium text-2xl">Medium (500)</div>
                    <div className="font-semibold text-2xl">Semibold (600)</div>
                    <div className="font-bold text-2xl">Bold (700)</div>
                    <div className="font-extrabold text-2xl">Extrabold (800)</div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold border-b pb-2">Scale</h2>
                <div className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">xs</span>
                        <span className="text-xs">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">sm</span>
                        <span className="text-sm">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">base</span>
                        <span className="text-base">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">lg</span>
                        <span className="text-lg">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">xl</span>
                        <span className="text-xl">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="w-16 text-sm text-muted-foreground">2xl</span>
                        <span className="text-2xl">The quick brown fox jumps over the lazy dog.</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
