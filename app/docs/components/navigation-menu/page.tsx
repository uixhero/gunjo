"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@gunjo/ui";

function NavigationMenuExample({ directOnly = false }: { directOnly?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const products = [
        { title: isJa ? "コンポーネント" : "Components", href: "/docs/components", desc: isJa ? "再利用できる UI 部品" : "Reusable UI parts" },
        { title: isJa ? "トークン" : "Tokens", href: "/docs/tokens", desc: isJa ? "色、余白、角丸の設計値" : "Color, spacing, and radius values" },
        { title: isJa ? "テンプレート" : "Templates", href: "/patterns", desc: isJa ? "画面単位の組み合わせ例" : "Page-level compositions" },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {!directOnly ? (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>{isJa ? "プロダクト" : "Product"}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[min(400px,calc(100vw-3rem))] gap-2 p-3">
                                {products.map((item) => (
                                    <li key={item.title}>
                                        <NavigationMenuLink href={item.href} onClick={(event) => event.preventDefault()} className="block rounded-md p-2 hover:bg-muted">
                                            <div className="text-sm font-medium">{item.title}</div>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ) : null}
                <NavigationMenuItem>
                    <NavigationMenuLink href="/pricing" onClick={(event) => event.preventDefault()} className={navigationMenuTriggerStyle()}>
                        {isJa ? "料金" : "Pricing"}
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/docs" onClick={(event) => event.preventDefault()} className={navigationMenuTriggerStyle()}>
                        {isJa ? "ドキュメント" : "Docs"}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default function NavigationMenuPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const code = `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@gunjo/ui"

const products = [
  { title: "${isJa ? "コンポーネント" : "Components"}", href: "/docs/components", desc: "${isJa ? "再利用できる UI 部品" : "Reusable UI parts"}" },
  { title: "${isJa ? "トークン" : "Tokens"}", href: "/docs/tokens", desc: "${isJa ? "色、余白、角丸の設計値" : "Color, spacing, and radius values"}" },
  { title: "${isJa ? "テンプレート" : "Templates"}", href: "/patterns", desc: "${isJa ? "画面単位の組み合わせ例" : "Page-level compositions"}" },
]

export function ProductNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>${isJa ? "プロダクト" : "Product"}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(400px,calc(100vw-3rem))] gap-2 p-3">
              {products.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink href={item.href} className="block rounded-md p-2 hover:bg-muted">
                    <div className="text-sm font-medium">{item.title}</div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            ${isJa ? "料金" : "Pricing"}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            ${isJa ? "ドキュメント" : "Docs"}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;
    const directCode = `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@gunjo/ui"

export function DirectNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            ${isJa ? "料金" : "Pricing"}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            ${isJa ? "ドキュメント" : "Docs"}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

    return (
        <ComponentLayout
            title={navigationMetadata.navigationMenu.title}
            description={isJa ? "サイト内の主要ページやカテゴリを、直接リンクとメガメニューでまとめる上位ナビゲーションです。" : navigationMetadata.navigationMenu.description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "NavigationMenu", href: "/docs/components/navigation-menu" }]}
            relatedComponents={[
                { name: "Header", href: "/docs/components/header" },
                { name: "Menubar", href: "/docs/components/menubar" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewBodyWidth="lg" previewHeight="auto">
                <NavigationMenuExample />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {isJa ? "状態とバリエーション" : "States and variations"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "direct-links",
                            title: isJa ? "直接リンクだけ" : "Direct links",
                            description: isJa ? "ドロップダウンを持たない上位ナビゲーションにも使えます。" : "Use direct top-level links when no dropdown is needed.",
                            preview: <NavigationMenuExample directOnly />,
                            previewBodyWidth: "md",
                            previewHeight: "auto",
                            code: directCode,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable
                    data={[
                        { name: "NavigationMenu", type: "Root", description: isJa ? "横並びのサイトナビゲーションを構成するルート。" : "Root for horizontal site navigation." },
                        { name: "NavigationMenuTrigger", type: "button", description: isJa ? "ドロップダウン付き項目を開くトリガー。" : "Trigger for a dropdown navigation item." },
                        { name: "NavigationMenuContent", type: "div", description: isJa ? "リンクや説明をまとめるドロップダウン内容。" : "Dropdown content for links and supporting copy." },
                        { name: "navigationMenuTriggerStyle()", type: "function", description: isJa ? "上位の直接リンクをトリガーと同じ見た目にします。" : "Applies trigger styling to direct top-level links." },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
