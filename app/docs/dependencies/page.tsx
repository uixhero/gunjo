import { MarkdownResourcePage } from "../_markdown-resource-page";

export default function DependenciesPage() {
    return (
        <MarkdownResourcePage
            filePath="docs/dependencies.md"
            title="依存関係"
            description="GunjoUI の peer dependency、対応済みの組み合わせ、採用先で注意する依存関係の契約です。"
        />
    );
}
