export default function AnimationPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Animation</h1>
                <p className="text-lg text-muted-foreground">
                    Duration and easing tokens for transitions.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Duration</h2>
                    <div className="space-y-4">
                        {[75, 100, 150, 200, 300, 500, 700, 1000].map(duration => (
                            <div key={duration} className="flex items-center gap-4">
                                <div className="w-20 font-mono text-sm text-muted-foreground">{duration}ms</div>
                                <div className="relative h-2 w-full max-w-[300px] bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="absolute h-full w-1/2 bg-primary animate-pulse"
                                        style={{ animationDuration: `${duration}ms` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Easing</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <EasingCard label="linear" ease="ease-linear" />
                        <EasingCard label="in" ease="ease-in" />
                        <EasingCard label="out" ease="ease-out" />
                        <EasingCard label="in-out" ease="ease-in-out" />
                    </div>
                </section>
            </div>
        </div>
    );
}

function EasingCard({ label, ease }: { label: string, ease: string }) {
    return (
        <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer group">
            <div className="mb-2 font-mono text-sm">{label} ({ease})</div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                <div className={`h-full w-4 bg-primary absolute left-0 group-hover:left-[calc(100%-1rem)] transition-all duration-1000 ${ease} infinite alternate`} />
            </div>
        </div>
    )
}
