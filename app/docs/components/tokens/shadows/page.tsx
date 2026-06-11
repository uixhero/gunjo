export default function ShadowsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Shadows</h1>
                <p className="text-lg text-muted-foreground">
                    Elevation and depth tokens.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-secondary/20 rounded-xl">
                <ShadowCard shadow="shadow-sm" label="sm" />
                <ShadowCard shadow="shadow" label="base" />
                <ShadowCard shadow="shadow-md" label="md" />
                <ShadowCard shadow="shadow-lg" label="lg" />
                <ShadowCard shadow="shadow-xl" label="xl" />
                <ShadowCard shadow="shadow-2xl" label="2xl" />
                <ShadowCard shadow="shadow-inner" label="inner" />
                <ShadowCard shadow="shadow-none" label="none" />
            </div>
        </div>
    );
}

function ShadowCard({ shadow, label }: { shadow: string, label: string }) {
    return (
        <div className={`aspect-square rounded-lg bg-card flex items-center justify-center ${shadow}`}>
            <span className="font-mono text-sm">{label}</span>
        </div>
    )
}
