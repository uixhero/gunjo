import { MarkdownResourcePage } from "../_markdown-resource-page";

export default function VersioningPage() {
    return (
        <MarkdownResourcePage
            filePath="docs/versioning.md"
            title="バージョニング"
            description="GunjoUI の semver 方針、破壊的変更の扱い、CHANGELOG に残すべき内容をまとめています。"
        />
    );
}
