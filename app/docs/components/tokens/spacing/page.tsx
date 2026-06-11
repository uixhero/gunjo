export default function SpacingPage() {
    const spacers = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Spacing</h1>
                <p className="text-lg text-muted-foreground">
                    Spacing scale for padding, margin, and sizing.
                </p>
            </div>

            <div className="space-y-4">
                {spacers.map((space) => (
                    <div key={space} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-mono text-muted-foreground">
                            {space} ({space * 0.25}rem)
                        </div>
                        <div
                            className="h-4 bg-primary rounded-sm"
                            style={{ width: `${space * 0.25}rem` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
