"use client";

import { CodeBlock } from "@gunjo/ui";

const SAMPLE = `import { Button } from "@gunjo/ui";

export function App() {
    return <Button>Hello</Button>;
}`;

export function CodeBlockDemo() {
    return (
        <div className="w-full max-w-lg">
            <CodeBlock code={SAMPLE} filename="App.tsx" language="tsx" />
        </div>
    );
}
