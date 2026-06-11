import { MarkdownResourcePage } from "../_markdown-resource-page";

export default function MigrationPlaybookPage() {
    return (
        <MarkdownResourcePage
            filePath="docs/migration-playbook.md"
            title="移行 Playbook"
            description="既存アプリへ GunjoUI を段階導入するときの移行順序、確認観点、失敗しやすい点をまとめた手順です。"
        />
    );
}
