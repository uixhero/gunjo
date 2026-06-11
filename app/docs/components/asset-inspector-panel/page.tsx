"use client";

import * as React from "react";
import { AssetInspectorPanel, type AssetCardAsset, useToast } from "@gunjo/ui";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import layoutMetadata from "@design/layout-metadata.json";

const asset: AssetCardAsset = {
    id: "hero",
    title: "Campaign_Hero_2026.jpg",
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
    width: 1920,
    height: 1080,
    type: "JPG",
    size: "1.4MB",
    createdAt: "2026-05-12",
    isFavorite: true,
    rating: 4.5,
};

const altAsset: AssetCardAsset = {
    id: "banner",
    title: "spring_banner_728x90.png",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=80",
    width: 728,
    height: 90,
    type: "PNG",
    size: "418KB",
    createdAt: "2026-05-10",
    isFavorite: false,
    rating: 3,
};

function getLocalizedAsset(locale: "en" | "ja"): AssetCardAsset {
    return {
        ...asset,
        title: locale === "ja" ? "campaign_hero_2026.jpg" : asset.title,
    };
}

function getLocalizedAltAsset(locale: "en" | "ja"): AssetCardAsset {
    return {
        ...altAsset,
        title: locale === "ja" ? "spring_banner_728x90.png" : altAsset.title,
    };
}

function getMetadata(target: AssetCardAsset, locale: "en" | "ja") {
    return locale === "ja"
        ? [
            { label: "ファイル名", value: target.title },
            { label: "画像サイズ", value: `${target.width} x ${target.height}` },
            { label: "形式", value: target.type ?? "-" },
            { label: "容量", value: target.size ?? "-" },
            { label: "作成日", value: target.createdAt ?? "-" },
        ]
        : [
            { label: "File name", value: target.title },
            { label: "Dimensions", value: `${target.width} x ${target.height}` },
            { label: "Type", value: target.type ?? "-" },
            { label: "Size", value: target.size ?? "-" },
            { label: "Created", value: target.createdAt ?? "-" },
        ];
}

function getLabels(locale: "en" | "ja") {
    return locale === "ja" ? {
        emptyTitle: "アセットを選択すると詳細が表示されます。",
        title: "タイトル",
        note: "メモ",
        tags: "タグ",
        rating: "評価",
        metadata: "メタデータ",
        actions: "操作",
        analyze: "画像を解析",
        compress: "圧縮",
        favorite: "お気に入り",
        share: "共有",
        download: "ダウンロード",
        delete: "削除",
        close: "閉じる",
        edit: "編集する",
        save: "保存",
        cancel: "キャンセル",
    } : undefined;
}

const codeByLocale = {
    en: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const asset = {
  id: "hero",
  title: "Campaign_Hero_2026.jpg",
  src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  createdAt: "2026-05-12",
  isFavorite: true,
  rating: 4.5,
};

export function Example() {
  const [tags, setTags] = React.useState(["Hero", "Website"]);
  const [note, setNote] = React.useState("Primary campaign visual.");

  return (
    <AssetInspectorPanel
      asset={asset}
      note={note}
      metadata={[
        { label: "File name", value: asset.title },
        { label: "Dimensions", value: "1920 x 1080" },
        { label: "Type", value: "JPG" },
        { label: "Size", value: "1.4MB" },
      ]}
      onTitleChange={() => {}}
      onNoteChange={setNote}
      tags={tags}
      onTagsChange={setTags}
      onRatingChange={() => {}}
      onFavorite={() => {}}
      onShare={() => {}}
      onDownload={() => {}}
      onDelete={() => {}}
      onClose={() => {}}
      onAnalyze={() => {}}
      onCompress={() => {}}
    />
  );
}`,
    ja: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const asset = {
  id: "hero",
  title: "campaign_hero_2026.jpg",
  src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  createdAt: "2026-05-12",
  isFavorite: true,
  rating: 4.5,
};

export function Example() {
  const [tags, setTags] = React.useState(["ヒーロー", "Web"]);
  const [note, setNote] = React.useState("キャンペーンのメインビジュアルです。");

  return (
    <AssetInspectorPanel
      asset={asset}
      note={note}
      metadata={[
        { label: "ファイル名", value: asset.title },
        { label: "画像サイズ", value: "1920 x 1080" },
        { label: "形式", value: "JPG" },
        { label: "容量", value: "1.4MB" },
      ]}
      onTitleChange={() => {}}
      onNoteChange={setNote}
      tags={tags}
      onTagsChange={setTags}
      onRatingChange={() => {}}
      onFavorite={() => {}}
      onShare={() => {}}
      onDownload={() => {}}
      onDelete={() => {}}
      onClose={() => {}}
      onAnalyze={() => {}}
      onCompress={() => {}}
    />
  );
}`,
} as const;

const propsDataByLocale = {
    en: [
        { name: "asset", type: "AssetCardAsset | null", description: "The selected asset to inspect." },
        { name: "title", type: "string", description: "Optional header title used when no asset is selected." },
        { name: "tags", type: "string[]", description: "Current tags for the selected asset." },
        { name: "tagSuggestions", type: "string[]", description: "Suggested tags shown as quick-add actions." },
        { name: "metadata", type: "MetadataListItem[]", description: "Overrides the default dimensions, type, size, and created rows." },
        { name: "note", type: "string", description: "Editable note value shown in the note field." },
        { name: "labels", type: "AssetInspectorPanelLabels", description: "Localized labels for fields and icon actions." },
        { name: "variant", type: '"default" | "compact"', description: "Controls spacing and preview radius." },
        { name: "onTitleChange", type: "(title) => void", description: "Shows and handles explicit save/cancel editing for the display title." },
        { name: "onNoteChange", type: "(note) => void", description: "Shows and handles explicit save/cancel editing for the note." },
        { name: "onPreview", type: "(asset) => void", description: "Called when the preview image is clicked." },
        { name: "onFavorite", type: "(asset) => void", description: "Shows and handles the header favorite action." },
        { name: "onShare", type: "(asset) => void", description: "Shows and handles the header share action." },
        { name: "onDownload", type: "(asset) => void", description: "Shows and handles the header download action." },
        { name: "onDelete", type: "(asset) => void", description: "Shows and handles the header delete action." },
        { name: "onClose", type: "() => void", description: "Shows and handles the header close action." },
        { name: "onRatingChange", type: "(rating, asset) => void", description: "Shows and handles half-step rating changes for the selected asset on a 0-5 scale." },
        { name: "onAnalyze", type: "(asset) => void", description: "Shows and handles the analysis action." },
        { name: "onCompress", type: "(asset) => void", description: "Shows and handles the compression action." },
    ],
    ja: [
        { name: "asset", type: "AssetCardAsset | null", description: "詳細を表示する選択中アセットです。" },
        { name: "title", type: "string", description: "アセット未選択時に使う任意のヘッダータイトルです。" },
        { name: "tags", type: "string[]", description: "選択中アセットの現在のタグです。" },
        { name: "tagSuggestions", type: "string[]", description: "クイック追加として表示するタグ候補です。" },
        { name: "metadata", type: "MetadataListItem[]", description: "標準のサイズ、形式、容量、作成日の行を差し替えます。" },
        { name: "note", type: "string", description: "メモフィールドに表示する編集可能な値です。" },
        { name: "labels", type: "AssetInspectorPanelLabels", description: "フィールドやアイコン操作に使うローカライズ済みラベルです。" },
        { name: "variant", type: '"default" | "compact"', description: "余白とプレビュー角丸を切り替えます。" },
        { name: "onTitleChange", type: "(title) => void", description: "表示タイトルの保存/キャンセル付き編集を表示して処理します。" },
        { name: "onNoteChange", type: "(note) => void", description: "メモの保存/キャンセル付き編集を表示して処理します。" },
        { name: "onPreview", type: "(asset) => void", description: "プレビュー画像クリック時に呼び出されます。" },
        { name: "onFavorite", type: "(asset) => void", description: "ヘッダーのお気に入り操作を表示して処理します。" },
        { name: "onShare", type: "(asset) => void", description: "ヘッダーの共有操作を表示して処理します。" },
        { name: "onDownload", type: "(asset) => void", description: "ヘッダーのダウンロード操作を表示して処理します。" },
        { name: "onDelete", type: "(asset) => void", description: "ヘッダーの削除操作を表示して処理します。" },
        { name: "onClose", type: "() => void", description: "ヘッダーの閉じる操作を表示して処理します。" },
        { name: "onRatingChange", type: "(rating, asset) => void", description: "選択中アセットの 0-5 点評価を 0.5 刻みで表示して処理します。" },
        { name: "onAnalyze", type: "(asset) => void", description: "解析アクションを表示して処理します。" },
        { name: "onCompress", type: "(asset) => void", description: "圧縮アクションを表示して処理します。" },
    ],
} as const;

const stateCodeByLocale = {
    en: {
        default: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const asset = {
  id: "hero",
  title: "Campaign_Hero_2026.jpg",
  src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  createdAt: "2026-05-12",
  isFavorite: true,
  rating: 4.5,
};

export function DefaultInspector() {
  const [tags, setTags] = React.useState(["Hero", "Website"]);

  return (
    <AssetInspectorPanel
      asset={asset}
      tags={tags}
      onTagsChange={setTags}
      metadata={[
        { label: "File name", value: asset.title },
        { label: "Dimensions", value: "1920 x 1080" },
        { label: "Type", value: "JPG" },
        { label: "Size", value: "1.4MB" },
      ]}
    />
  );
}`,
        empty: `import { AssetInspectorPanel } from "@gunjo/ui";

<AssetInspectorPanel
  title="Details"
  asset={null}
  labels={{ emptyTitle: "Select an asset to view details." }}
/>`,
        compact: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const initialAsset = {
  id: "banner",
  title: "spring_banner_728x90.png",
  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=80",
  width: 728,
  height: 90,
  type: "PNG",
  size: "418KB",
  isFavorite: false,
};

export function CompactInspector() {
  const [asset, setAsset] = React.useState(initialAsset);
  const [tags, setTags] = React.useState(["Banner", "Web"]);

  return (
    <AssetInspectorPanel
      asset={asset}
      variant="compact"
      tags={tags}
      tagSuggestions={["Campaign", "SNS", "Product"]}
      onTagsChange={setTags}
      onFavorite={() =>
        setAsset((current) => ({ ...current, isFavorite: !current.isFavorite }))
      }
      metadata={[
        { label: "File name", value: asset.title },
        { label: "Dimensions", value: "728 x 90" },
        { label: "Type", value: "PNG" },
      ]}
    />
  );
}`,
    },
    ja: {
        default: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const asset = {
  id: "hero",
  title: "campaign_hero_2026.jpg",
  src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=640&q=80",
  width: 1920,
  height: 1080,
  type: "JPG",
  size: "1.4MB",
  createdAt: "2026-05-12",
  isFavorite: true,
  rating: 4.5,
};

export function DefaultInspector() {
  const [tags, setTags] = React.useState(["ヒーロー", "Web"]);

  return (
    <AssetInspectorPanel
      asset={asset}
      tags={tags}
      onTagsChange={setTags}
      metadata={[
        { label: "ファイル名", value: asset.title },
        { label: "画像サイズ", value: "1920 x 1080" },
        { label: "形式", value: "JPG" },
        { label: "容量", value: "1.4MB" },
      ]}
    />
  );
}`,
        empty: `import { AssetInspectorPanel } from "@gunjo/ui";

<AssetInspectorPanel
  title="詳細"
  asset={null}
  labels={{ emptyTitle: "アセットを選択すると詳細が表示されます。" }}
/>`,
        compact: `import { AssetInspectorPanel } from "@gunjo/ui";
import * as React from "react";

const initialAsset = {
  id: "banner",
  title: "spring_banner_728x90.png",
  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&q=80",
  width: 728,
  height: 90,
  type: "PNG",
  size: "418KB",
  isFavorite: false,
};

export function CompactInspector() {
  const [asset, setAsset] = React.useState(initialAsset);
  const [tags, setTags] = React.useState(["バナー", "Web"]);

  return (
    <AssetInspectorPanel
      asset={asset}
      variant="compact"
      tags={tags}
      tagSuggestions={["キャンペーン", "SNS", "商品"]}
      onTagsChange={setTags}
      onFavorite={() =>
        setAsset((current) => ({ ...current, isFavorite: !current.isFavorite }))
      }
      metadata={[
        { label: "ファイル名", value: asset.title },
        { label: "画像サイズ", value: "728 x 90" },
        { label: "形式", value: "PNG" },
      ]}
    />
  );
}`,
    },
} as const;

export default function AssetInspectorPanelDocPage() {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const [previewAsset, setPreviewAsset] = React.useState<AssetCardAsset>(() => getLocalizedAsset(locale));
    const [compactAsset, setCompactAsset] = React.useState<AssetCardAsset>(() => getLocalizedAltAsset(locale));
    const [note, setNote] = React.useState(locale === "ja" ? "キャンペーンのメインビジュアルです。" : "Primary campaign visual.");
    const [tags, setTags] = React.useState(locale === "ja" ? ["ヒーロー", "Web"] : ["Hero", "Website"]);
    const [compactTags, setCompactTags] = React.useState(locale === "ja" ? ["バナー", "Web"] : ["Banner", "Web"]);
    const meta = layoutMetadata as Record<string, { title: string; description: string }>;
    const labels = getLabels(locale);
    const showActionToast = React.useCallback((message: string) => {
        showToast(message, "success", 1800);
    }, [showToast]);

    React.useEffect(() => {
        setPreviewAsset(getLocalizedAsset(locale));
        setCompactAsset(getLocalizedAltAsset(locale));
        setNote(locale === "ja" ? "キャンペーンのメインビジュアルです。" : "Primary campaign visual.");
        setTags(locale === "ja" ? ["ヒーロー", "Web"] : ["Hero", "Website"]);
        setCompactTags(locale === "ja" ? ["バナー", "Web"] : ["Banner", "Web"]);
    }, [locale]);

    return (
        <ComponentLayout
            title={meta.assetInspectorPanel.title}
            description={meta.assetInspectorPanel.description}
            usedComponents={[
                { name: "InspectorPanel", href: "/docs/components/inspector-panel" },
                { name: "EditableField", href: "/docs/components/editable-field" },
                { name: "MetadataList", href: "/docs/components/metadata-list" },
                { name: "TagEditor", href: "/docs/components/tag-editor" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Slider", href: "/docs/components/slider" },
            ]}
            relatedComponents={[
                { name: "AssetCard", href: "/docs/components/asset-card" },
                { name: "AssetGrid", href: "/docs/components/asset-grid" },
                { name: "MediaLightbox", href: "/docs/components/media-lightbox" },
                { name: "MediaPickerDialog", href: "/docs/components/media-picker-dialog" },
                { name: "Media Library", href: "/docs/components/media-library" },
            ]}
        >
            <ComponentPreview code={codeByLocale[locale]} codeBlock={<CodeBlock code={codeByLocale[locale]} />} previewBodyWidth="sm" previewHeight={760}>
                <div className="h-[680px] overflow-hidden rounded-lg border bg-background">
                    <AssetInspectorPanel
                        asset={previewAsset}
                        note={note}
                        metadata={getMetadata(previewAsset, locale)}
                        onTitleChange={(title) => setPreviewAsset((current) => ({ ...current, title }))}
                        onNoteChange={setNote}
                        tags={tags}
                        onTagsChange={setTags}
                        onRatingChange={(rating) => setPreviewAsset((current) => ({ ...current, rating }))}
                        onFavorite={() => setPreviewAsset((current) => ({ ...current, isFavorite: !current.isFavorite }))}
                        onShare={() => showActionToast(locale === "ja" ? "共有設定を開きました" : "Share settings opened")}
                        onDownload={() => showActionToast(locale === "ja" ? "ダウンロードを開始しました" : "Download started")}
                        onDelete={() => showActionToast(locale === "ja" ? "削除確認を表示しました" : "Delete confirmation opened")}
                        onClose={() => showActionToast(locale === "ja" ? "パネルを閉じました" : "Panel closed")}
                        tagSuggestions={locale === "ja" ? ["キャンペーン", "SNS", "商品"] : ["Campaign", "SNS", "Product"]}
                        onAnalyze={() => showActionToast(locale === "ja" ? "画像解析を開始しました" : "Analysis started")}
                        onCompress={() => showActionToast(locale === "ja" ? "圧縮を開始しました" : "Compression started")}
                        labels={labels}
                        className="border-l-0"
                    />
                </div>
            </ComponentPreview>

            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        {locale === "ja" ? "状態とバリエーション" : "States and Variants"}
                    </h2>
                </div>

                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "未選択" : "Empty"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "アセットが未選択の時に、詳細が表示されない理由を示します。" : "Show why details are unavailable when no asset is selected."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].empty}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].empty} />}
                            previewBodyWidth="sm"
                            previewHeight={360}
                        >
                            <div className="h-[280px] overflow-hidden rounded-lg border bg-background">
                                <AssetInspectorPanel
                                    title={locale === "ja" ? "詳細" : "Details"}
                                    asset={null}
                                    labels={labels}
                                    className="border-l-0"
                                />
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "コンパクト" : "Compact"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja" ? "狭い詳細ペイン向けに、余白を抑えながらお気に入りとタグ編集を確認します。" : "Use reduced spacing for narrow detail panes while keeping favorite and tag editing interactive."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].compact}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].compact} />}
                            previewBodyWidth="sm"
                            previewHeight={560}
                        >
                            <div className="h-[480px] overflow-hidden rounded-lg border bg-background">
                                <AssetInspectorPanel
                                    asset={compactAsset}
                                    variant="compact"
                                    tags={compactTags}
                                    onTagsChange={setCompactTags}
                                    tagSuggestions={locale === "ja" ? ["キャンペーン", "SNS", "商品"] : ["Campaign", "SNS", "Product"]}
                                    onFavorite={() => setCompactAsset((current) => ({ ...current, isFavorite: !current.isFavorite }))}
                                    metadata={getMetadata(compactAsset, locale)}
                                    labels={labels}
                                    className="border-l-0"
                                />
                            </div>
                        </ComponentPreview>
                    </section>

                    <section className="space-y-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{locale === "ja" ? "通常表示" : "Default"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {locale === "ja"
                                    ? "プレビュー、メタデータ、タグ、評価、主要アクションをまとめて表示する標準の詳細ペインです。"
                                    : "Show the standard detail pane with preview, metadata, tags, rating, and primary actions."}
                            </p>
                        </div>
                        <ComponentPreview
                            code={stateCodeByLocale[locale].default}
                            codeBlock={<CodeBlock code={stateCodeByLocale[locale].default} />}
                            previewBodyWidth="sm"
                            previewHeight={760}
                        >
                            <div className="h-[680px] overflow-hidden rounded-lg border bg-background">
                                <AssetInspectorPanel
                                    asset={previewAsset}
                                    note={note}
                                    metadata={getMetadata(previewAsset, locale)}
                                    onTitleChange={(title) => setPreviewAsset((current) => ({ ...current, title }))}
                                    onNoteChange={setNote}
                                    tags={tags}
                                    onTagsChange={setTags}
                                    onRatingChange={(rating) => setPreviewAsset((current) => ({ ...current, rating }))}
                                    onFavorite={() => setPreviewAsset((current) => ({ ...current, isFavorite: !current.isFavorite }))}
                                    onShare={() => showActionToast(locale === "ja" ? "共有設定を開きました" : "Share settings opened")}
                                    onDownload={() => showActionToast(locale === "ja" ? "ダウンロードを開始しました" : "Download started")}
                                    onDelete={() => showActionToast(locale === "ja" ? "削除確認を表示しました" : "Delete confirmation opened")}
                                    onClose={() => showActionToast(locale === "ja" ? "パネルを閉じました" : "Panel closed")}
                                    tagSuggestions={locale === "ja" ? ["キャンペーン", "SNS", "商品"] : ["Campaign", "SNS", "Product"]}
                                    onAnalyze={() => showActionToast(locale === "ja" ? "画像解析を開始しました" : "Analysis started")}
                                    onCompress={() => showActionToast(locale === "ja" ? "圧縮を開始しました" : "Compression started")}
                                    labels={labels}
                                    className="border-l-0"
                                />
                            </div>
                        </ComponentPreview>
                    </section>
                </div>
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {locale === "ja" ? "使い方" : "Usage"}
                    </h2>
                    <CodeCopyButton code={codeByLocale[locale]} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={codeByLocale[locale]} />
                </div>
            </div>
        </ComponentLayout>
    );
}
