export default function RadiusPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Radius</h1>
                <p className="text-lg text-muted-foreground">
                    Default border radius tokens.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-bold">SM</div>
                    <span>rounded-sm</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">MD</div>
                    <span>rounded-md (Default)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">LG</div>
                    <span>rounded-lg</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">Full</div>
                    <span>rounded-full</span>
                </div>
            </div>
        </div>
    );
}
