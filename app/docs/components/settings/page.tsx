"use client";

import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { SettingsTemplateDemo } from "@/components/demos/TemplateDemos";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

const usageCode = `import { SettingsTemplate, Button } from "@gunjo/ui";

export function SettingsPage() {
  return (
    <SettingsTemplate
        title="Settings"
        navigation={
            <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start">Profile</Button>
                <Button variant="ghost" className="justify-start">Account</Button>
            </nav>
        }
    >
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Profile</h3>
            {/* Form Content */}
        </div>
    </SettingsTemplate>
  )
}`;

const propsData = [
    {
        name: "title",
        type: "string",
        description: "The main title displayed at the top of the settings page.",
        default: '"Settings"',
    },
    {
        name: "description",
        type: "string",
        description: "A short description displayed below the title.",
        default: '"Manage your account settings and preferences."',
    },
    {
        name: "navigation",
        type: "React.ReactNode",
        description: "Navigation items displayed in the sidebar.",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description: "The main settings form content.",
    },
    {
        name: "className",
        type: "string",
        description: "Additional classes for the root container.",
    }
];

function ProfileFields({ idPrefix, locale }: { idPrefix: string; locale: "en" | "ja" }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">{locale === "ja" ? "プロフィール" : "Profile"}</h3>
            <p className="text-sm text-muted-foreground">
                {locale === "ja"
                    ? "ここで変えた内容は、あなたが参加している全ての場所に反映されます。"
                    : "Changes here show up everywhere you appear across the workspace."}
            </p>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-name`}>{locale === "ja" ? "表示名" : "Display name"}</Label>
                <Input id={`${idPrefix}-name`} defaultValue={locale === "ja" ? "田中 美咲" : "Misaki Tanaka"} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-email`}>{locale === "ja" ? "メールアドレス" : "Email"}</Label>
                <Input id={`${idPrefix}-email`} type="email" defaultValue="misaki@example.com" />
            </div>
            <Button>{locale === "ja" ? "保存する" : "Save changes"}</Button>
        </div>
    );
}

export default function SettingsPage() {
    const { locale } = useLocale();

    return (
        <ComponentLayout
            title={patternsMetadata.settingsTemplate.title}
            description={patternsMetadata.settingsTemplate.description}
            usedComponents={[
                { name: "SettingsTemplate", href: "/docs/components/settings" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "DashboardTemplate", href: "/docs/components/dashboard" },
                { name: "Form", href: "/docs/components/form" },
                { name: "NavRow", href: "/docs/components/nav-row" },
                { name: "Tabs", href: "/docs/components/tabs" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/settings" code={usageCode} fullPagePreview codeBlock={<CodeBlock code={usageCode} />}>
                <div className="w-full overflow-hidden rounded-lg border shadow-sm">
                    <SettingsTemplateDemo />
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "SettingsTemplate の差し替え口は title・description・navigation の3つです。左の項目一覧は省略でき、そのときは本文が全幅に広がります。"
                        : "SettingsTemplate exposes three slots: title, description, and navigation. The left-hand list is optional, and the body spans the full width when it is omitted."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default-heading",
                            title: locale === "ja" ? "見出しは既定のまま" : "Default heading",
                            description: locale === "ja"
                                ? "title と description を渡さないと、組み込みの英語の見出しが出ます。1画面しか無い設定にはこれで足ります。"
                                : "With no title and no description, the built-in heading is used. That is enough for a settings screen with a single page.",
                            preview: (
                                <SettingsTemplate className="min-h-0">
                                    <ProfileFields idPrefix="settings-default" locale={locale} />
                                </SettingsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

export function DefaultSettings() {
  return (
    <SettingsTemplate className="min-h-0">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">プロフィール</h3>
        <div className="space-y-2">
          <Label htmlFor="name">表示名</Label>
          <Input id="name" defaultValue="田中 美咲" />
        </div>
        <Button>保存する</Button>
      </div>
    </SettingsTemplate>
  );
}`
                                : `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

export function DefaultSettings() {
  return (
    <SettingsTemplate className="min-h-0">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" defaultValue="Misaki Tanaka" />
        </div>
        <Button>Save changes</Button>
      </div>
    </SettingsTemplate>
  );
}`,
                        },
                        {
                            key: "custom-heading",
                            title: locale === "ja" ? "見出しを差し替える" : "Custom heading",
                            description: locale === "ja"
                                ? "title と description は文字列で受け取ります。組織の設定など、扱う対象が個人以外のときに言い換えます。"
                                : "title and description take plain strings. Reword them when the screen manages something other than a personal account.",
                            preview: (
                                <SettingsTemplate
                                    className="min-h-0"
                                    title={locale === "ja" ? "組織の設定" : "Organization settings"}
                                    description={locale === "ja"
                                        ? "請求先と権限は、この組織に参加している全員に影響します。"
                                        : "Billing and permissions here apply to everyone in this organization."}
                                >
                                    <ProfileFields idPrefix="settings-custom" locale={locale} />
                                </SettingsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

const TITLE = "組織の設定";
const DESCRIPTION = "請求先と権限は、この組織に参加している全員に影響します。";

export function OrganizationSettings() {
  return (
    <SettingsTemplate className="min-h-0" title={TITLE} description={DESCRIPTION}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">プロフィール</h3>
        <div className="space-y-2">
          <Label htmlFor="name">表示名</Label>
          <Input id="name" defaultValue="田中 美咲" />
        </div>
        <Button>保存する</Button>
      </div>
    </SettingsTemplate>
  );
}`
                                : `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

const TITLE = "Organization settings";
const DESCRIPTION = "Billing and permissions here apply to everyone in this organization.";

export function OrganizationSettings() {
  return (
    <SettingsTemplate className="min-h-0" title={TITLE} description={DESCRIPTION}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" defaultValue="Misaki Tanaka" />
        </div>
        <Button>Save changes</Button>
      </div>
    </SettingsTemplate>
  );
}`,
                        },
                        {
                            key: "with-navigation",
                            title: locale === "ja" ? "項目一覧を添える" : "With navigation",
                            description: locale === "ja"
                                ? "navigation に行を渡すと、広い画面では左に寄せた一覧になり、狭い画面では見出しの下に積まれます。設定が複数ページに分かれたら使います。"
                                : "Rows passed to navigation sit in a left-hand list on wide screens and stack under the heading on narrow ones. Use it once settings span more than one page.",
                            preview: (
                                <SettingsTemplate
                                    className="min-h-0"
                                    navigation={
                                        <nav className="flex flex-col space-y-1">
                                            <Button variant="secondary" className="justify-start">
                                                {locale === "ja" ? "プロフィール" : "Profile"}
                                            </Button>
                                            <Button variant="ghost" className="justify-start">
                                                {locale === "ja" ? "アカウント" : "Account"}
                                            </Button>
                                        </nav>
                                    }
                                >
                                    <ProfileFields idPrefix="settings-nav" locale={locale} />
                                </SettingsTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

const SECTIONS = ["プロフィール", "アカウント"];

export function SettingsWithNavigation() {
  return (
    <SettingsTemplate
      className="min-h-0"
      navigation={
        <nav className="flex flex-col space-y-1">
          {SECTIONS.map((section, index) => (
            <Button
              key={section}
              variant={index === 0 ? "secondary" : "ghost"}
              className="justify-start"
            >
              {section}
            </Button>
          ))}
        </nav>
      }
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium">プロフィール</h3>
        <div className="space-y-2">
          <Label htmlFor="name">表示名</Label>
          <Input id="name" defaultValue="田中 美咲" />
        </div>
        <Button>保存する</Button>
      </div>
    </SettingsTemplate>
  );
}`
                                : `import { Button, Input, Label, SettingsTemplate } from "@gunjo/ui";

const SECTIONS = ["Profile", "Account"];

export function SettingsWithNavigation() {
  return (
    <SettingsTemplate
      className="min-h-0"
      navigation={
        <nav className="flex flex-col space-y-1">
          {SECTIONS.map((section, index) => (
            <Button
              key={section}
              variant={index === 0 ? "secondary" : "ghost"}
              className="justify-start"
            >
              {section}
            </Button>
          ))}
        </nav>
      }
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" defaultValue="Misaki Tanaka" />
        </div>
        <Button>Save changes</Button>
      </div>
    </SettingsTemplate>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <CodeBlock code={usageCode} language="tsx" />
            </div>
        </ComponentLayout>
    );
}
