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

function CurrentPageExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const links = [
        { href: "/pricing", label: isJa ? "料金" : "Pricing", current: false },
        { href: "/docs", label: isJa ? "ドキュメント" : "Docs", current: true },
        { href: "/support", label: isJa ? "サポート" : "Support", current: false },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link) => (
                    <NavigationMenuItem key={link.href}>
                        <NavigationMenuLink
                            href={link.href}
                            active={link.current}
                            aria-current={link.current ? "page" : undefined}
                            onClick={(event) => event.preventDefault()}
                            className={navigationMenuTriggerStyle()}
                        >
                            {link.label}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function WideMenuExample() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const groups = isJa
        ? [
              {
                  heading: "作る",
                  items: [
                      { title: "コンポーネント", href: "/docs/components", desc: "再利用できる UI 部品" },
                      { title: "トークン", href: "/docs/tokens", desc: "色、余白、角丸の設計値" },
                      { title: "テンプレート", href: "/patterns", desc: "画面単位の組み合わせ例" },
                  ],
              },
              {
                  heading: "調べる",
                  items: [
                      { title: "はじめかた", href: "/docs", desc: "導入の手順" },
                      { title: "更新の記録", href: "/docs/changelog", desc: "版ごとの変更点" },
                      { title: "よくある質問", href: "/docs/faq", desc: "導入前の確認事項" },
                  ],
              },
          ]
        : [
              {
                  heading: "Build",
                  items: [
                      { title: "Components", href: "/docs/components", desc: "Reusable UI parts" },
                      { title: "Tokens", href: "/docs/tokens", desc: "Color, spacing, radius" },
                      { title: "Templates", href: "/patterns", desc: "Page-level compositions" },
                  ],
              },
              {
                  heading: "Learn",
                  items: [
                      { title: "Getting started", href: "/docs", desc: "Install and set up" },
                      { title: "Changelog", href: "/docs/changelog", desc: "What changed per release" },
                      { title: "FAQ", href: "/docs/faq", desc: "Before you adopt" },
                  ],
              },
          ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{isJa ? "プロダクト" : "Product"}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid w-[min(560px,calc(100vw-3rem))] grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                            {groups.map((group) => (
                                <div key={group.heading}>
                                    <p className="mb-1 px-2 text-xs font-semibold text-muted-foreground">{group.heading}</p>
                                    <ul className="grid gap-1">
                                        {group.items.map((item) => (
                                            <li key={item.title}>
                                                <NavigationMenuLink
                                                    href={item.href}
                                                    onClick={(event) => event.preventDefault()}
                                                    className="block rounded-md p-2 hover:bg-muted"
                                                >
                                                    <div className="text-sm font-medium">{item.title}</div>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/pricing" onClick={(event) => event.preventDefault()} className={navigationMenuTriggerStyle()}>
                        {isJa ? "料金" : "Pricing"}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const codeByLocale = {
    ja: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@gunjo/ui"

const products = [
  { title: "コンポーネント", href: "/docs/components", desc: "再利用できる UI 部品" },
  { title: "トークン", href: "/docs/tokens", desc: "色、余白、角丸の設計値" },
  { title: "テンプレート", href: "/patterns", desc: "画面単位の組み合わせ例" },
]

export function ProductNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>プロダクト</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(400px,calc(100vw-3rem))] gap-2 p-3">
              {products.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="block rounded-md p-2 hover:bg-muted"
                  >
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
            料金
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            ドキュメント
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    en: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@gunjo/ui"

const products = [
  { title: "Components", href: "/docs/components", desc: "Reusable UI parts" },
  { title: "Tokens", href: "/docs/tokens", desc: "Color, spacing, and radius values" },
  { title: "Templates", href: "/patterns", desc: "Page-level compositions" },
]

export function ProductNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(400px,calc(100vw-3rem))] gap-2 p-3">
              {products.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="block rounded-md p-2 hover:bg-muted"
                  >
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
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
};

const directCodeByLocale = {
    ja: `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@gunjo/ui"

export function DirectNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            料金
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            ドキュメント
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    en: `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@gunjo/ui"

export function DirectNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
};

const currentCodeByLocale = {
    ja: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@gunjo/ui"

const LINKS = [
  { href: "/pricing", label: "料金" },
  { href: "/docs", label: "ドキュメント" },
  { href: "/support", label: "サポート" },
]

const CURRENT = "/docs"

export function SiteNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {LINKS.map((link) => {
          const current = link.href === CURRENT
          return (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                href={link.href}
                active={current}
                aria-current={current ? "page" : undefined}
                className={navigationMenuTriggerStyle()}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    en: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@gunjo/ui"

const LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/support", label: "Support" },
]

const CURRENT = "/docs"

export function SiteNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {LINKS.map((link) => {
          const current = link.href === CURRENT
          return (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                href={link.href}
                active={current}
                aria-current={current ? "page" : undefined}
                className={navigationMenuTriggerStyle()}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
};

const wideCodeByLocale = {
    ja: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@gunjo/ui"

const GROUPS = [
  {
    heading: "作る",
    items: [
      { title: "コンポーネント", href: "/docs/components", desc: "再利用できる UI 部品" },
      { title: "トークン", href: "/docs/tokens", desc: "色、余白、角丸の設計値" },
      { title: "テンプレート", href: "/patterns", desc: "画面単位の組み合わせ例" },
    ],
  },
  {
    heading: "調べる",
    items: [
      { title: "はじめかた", href: "/docs", desc: "導入の手順" },
      { title: "更新の記録", href: "/docs/changelog", desc: "版ごとの変更点" },
      { title: "よくある質問", href: "/docs/faq", desc: "導入前の確認事項" },
    ],
  },
]

export function WideProductMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>プロダクト</NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* 幅は中身が決める。囲いは中身の寸法に合わせて開きます。 */}
            <div className="grid w-[min(560px,calc(100vw-3rem))] grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              {GROUPS.map((group) => (
                <div key={group.heading}>
                  <p className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    {group.heading}
                  </p>
                  <ul className="grid gap-1">
                    {group.items.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          href={item.href}
                          className="block rounded-md p-2 hover:bg-muted"
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
    en: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@gunjo/ui"

const GROUPS = [
  {
    heading: "Build",
    items: [
      { title: "Components", href: "/docs/components", desc: "Reusable UI parts" },
      { title: "Tokens", href: "/docs/tokens", desc: "Color, spacing, radius" },
      { title: "Templates", href: "/patterns", desc: "Page-level compositions" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { title: "Getting started", href: "/docs", desc: "Install and set up" },
      { title: "Changelog", href: "/docs/changelog", desc: "What changed per release" },
      { title: "FAQ", href: "/docs/faq", desc: "Before you adopt" },
    ],
  },
]

export function WideProductMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* The content sets the width; the panel opens to fit it. */}
            <div className="grid w-[min(560px,calc(100vw-3rem))] grid-cols-1 gap-4 p-4 sm:grid-cols-2">
              {GROUPS.map((group) => (
                <div key={group.heading}>
                  <p className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                    {group.heading}
                  </p>
                  <ul className="grid gap-1">
                    {group.items.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          href={item.href}
                          className="block rounded-md p-2 hover:bg-muted"
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
};

export default function NavigationMenuPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const usageCode = codeByLocale[locale];
    const directCode = directCodeByLocale[locale];

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
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewBodyWidth="lg" previewHeight="auto">
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
                        {
                            key: "current-page",
                            title: isJa ? "いま居るページを示す" : "Marking the current page",
                            description: isJa
                                ? "active を渡した項目だけ面が薄く残ります。読み上げにも伝えるため aria-current=\"page\" を同時に付けます。色だけでは、色が見えない人に現在地が伝わりません。"
                                : "The link given active keeps a faint surface. Pair it with aria-current=\"page\" so the position is announced too — colour alone does not carry it.",
                            preview: <CurrentPageExample />,
                            previewBodyWidth: "md",
                            previewHeight: "auto",
                            code: currentCodeByLocale[locale],
                        },
                        {
                            key: "wide-menu",
                            title: isJa ? "中身が増えたとき" : "When the panel grows",
                            description: isJa
                                ? "ドロップダウンの寸法は中身が決めます。項目が6つに増えたら中で2列に組み、囲いはその幅と高さに合わせて開きます。狭い画面では1列に戻ります。"
                                : "The panel is sized by its content. At six links, lay them out in two columns and the panel opens to that width and height — falling back to one column on a narrow screen.",
                            preview: <WideMenuExample />,
                            previewBodyWidth: "lg",
                            previewHeight: "auto",
                            code: wideCodeByLocale[locale],
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
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
