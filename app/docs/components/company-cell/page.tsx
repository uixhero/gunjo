"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { IconCoin, IconSchool } from "@tabler/icons-react";
import displayMetadata from "@design/display-metadata.json";
import { CompanyCell } from "@gunjo/ui";

type Locale = "ja" | "en";

const uixheroLogoUrl = "https://www.uixhero.com/images/512grid_wh.svg";
const uixheroLogo = <img src={uixheroLogoUrl} alt="" className="h-6 w-6 object-contain" />;

function companyCellCopy(locale: Locale) {
  return locale === "ja"
    ? {
        rows: [
          {
            name: "UIXHERO",
            secondary: "デザインシステム・UIコンポーネント",
            logo: uixheroLogo,
            logoClassName: "bg-foreground text-background",
          },
          {
            name: "ものづくり補助金",
            secondary: "設備投資・補助上限 1,250万円",
          },
          {
            name: "さくらIT導入支援",
            secondary: "サービス業・東京都",
            logo: <IconCoin className="h-5 w-5" />,
            logoClassName: "bg-primary-subtle text-primary",
          },
        ],
      }
    : {
        rows: [
          {
            name: "UIXHERO",
            secondary: "Design system / UI components",
            logo: uixheroLogo,
            logoClassName: "bg-foreground text-background",
          },
          {
            name: "Manufacturing subsidy",
            secondary: "Capital investment / up to JPY 12.5M",
          },
          {
            name: "Sakura IT Support",
            secondary: "Services / Tokyo",
            logo: <IconCoin className="h-5 w-5" />,
            logoClassName: "bg-primary-subtle text-primary",
          },
        ],
      };
}

function CompanyCellPreview({ locale, size = "default" }: { locale: Locale; size?: "sm" | "default" | "lg" }) {
  const copy = companyCellCopy(locale);

  return (
    <div className="grid w-full max-w-lg gap-3 rounded-lg border bg-card p-4">
      {copy.rows.map((row) => (
        <CompanyCell key={row.name} size={size} {...row} />
      ))}
    </div>
  );
}

export default function CompanyCellDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/company-cell", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.companyCell.title ?? "CompanyCell";
  const description = content?.description ?? metadata.companyCell.description ?? "";

  const usageCode = locale === "ja"
    ? `import { CompanyCell } from "@gunjo/ui";
import { IconCoin } from "@tabler/icons-react";

const uixheroLogoUrl = "https://www.uixhero.com/images/512grid_wh.svg";

export function CompanyDirectory() {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4">
      <CompanyCell
        name="UIXHERO"
        secondary="デザインシステム・UIコンポーネント"
        logo={<img src={uixheroLogoUrl} alt="" className="h-6 w-6 object-contain" />}
        logoClassName="bg-foreground text-background"
      />
      <CompanyCell
        name="ものづくり補助金"
        secondary="設備投資・補助上限 1,250万円"
      />
      <CompanyCell
        name="さくらIT導入支援"
        secondary="サービス業・東京都"
        logo={<IconCoin className="h-5 w-5" />}
        logoClassName="bg-primary-subtle text-primary"
      />
    </div>
  );
}`
    : `import { CompanyCell } from "@gunjo/ui";
import { IconCoin } from "@tabler/icons-react";

const uixheroLogoUrl = "https://www.uixhero.com/images/512grid_wh.svg";

export function CompanyDirectory() {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4">
      <CompanyCell
        name="UIXHERO"
        secondary="Design system / UI components"
        logo={<img src={uixheroLogoUrl} alt="" className="h-6 w-6 object-contain" />}
        logoClassName="bg-foreground text-background"
      />
      <CompanyCell
        name="Manufacturing subsidy"
        secondary="Capital investment / up to JPY 12.5M"
      />
      <CompanyCell
        name="Sakura IT Support"
        secondary="Services / Tokyo"
        logo={<IconCoin className="h-5 w-5" />}
        logoClassName="bg-primary-subtle text-primary"
      />
    </div>
  );
}`;

  const propsData = [
    {
      name: "name",
      type: "ReactNode",
      description: locale === "ja" ? "主表示の企業名、組織名、制度名です。" : "Primary company, organization, or program name.",
    },
    {
      name: "secondary",
      type: "ReactNode",
      description: locale === "ja" ? "業種、所在地、制度区分などの補足行です。" : "Secondary metadata such as industry, location, or program type.",
    },
    {
      name: "logo",
      type: "ReactNode",
      description: locale === "ja" ? "ロゴまたはアイコンです。省略時は name からイニシャルタイルを生成します。" : "Logo or icon. When omitted, the component generates an initial tile from name.",
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      description: locale === "ja" ? "セルの密度です。" : "Cell density.",
    },
    {
      name: "logoClassName",
      type: "string",
      description: locale === "ja" ? "ロゴタイルの背景色や文字色を調整する追加 class です。" : "Additional classes for the logo tile tone.",
    },
  ];

  return (
    <ComponentLayout
      title={title}
      description={description}
      sectionLabels={sectionLabels}
      usedComponents={[
        { name: "CompanyCell", href: "/docs/components/company-cell" },
      ]}
      relatedComponents={[
        { name: "PersonCell", href: "/docs/components/person-cell" },
        { name: "MatchCard", href: "/docs/components/match-card" },
        { name: "ListCard", href: "/docs/components/list-card" },
      ]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <CompanyCellPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {locale === "ja" ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "fallback",
              title: locale === "ja" ? "イニシャルタイル" : "Initial tile",
              description: locale === "ja"
                ? "logo を省略すると、name の先頭文字で四角い識別タイルを表示します。"
                : "When logo is omitted, the first character of name becomes a square identity tile.",
              preview: (
                <CompanyCell
                  name={locale === "ja" ? "ものづくり補助金" : "Manufacturing subsidy"}
                  secondary={locale === "ja" ? "設備投資・補助上限 1,250万円" : "Capital investment / up to JPY 12.5M"}
                />
              ),
              code: locale === "ja"
                ? `<CompanyCell name="ものづくり補助金" secondary="設備投資・補助上限 1,250万円" />`
                : `<CompanyCell name="Manufacturing subsidy" secondary="Capital investment / up to JPY 12.5M" />`,
            },
            {
              key: "custom-logo",
              title: locale === "ja" ? "ロゴ付き" : "With logo",
              description: locale === "ja"
                ? "logo と logoClassName を渡すと、ブランドの実ロゴを使った識別面にできます。"
                : "Pass logo and logoClassName to use a real brand logo inside the identity tile.",
              preview: (
                <CompanyCell
                  name="UIXHERO"
                  secondary={locale === "ja" ? "デザインシステム・UIコンポーネント" : "Design system / UI components"}
                  logo={uixheroLogo}
                  logoClassName="bg-foreground text-background"
                />
              ),
              code: `<CompanyCell
  name="UIXHERO"
  secondary="${locale === "ja" ? "デザインシステム・UIコンポーネント" : "Design system / UI components"}"
  logo={<img src="${uixheroLogoUrl}" alt="" className="h-6 w-6 object-contain" />}
  logoClassName="bg-foreground text-background"
/>`,
            },
            {
              key: "sizes",
              title: locale === "ja" ? "サイズ" : "Sizes",
              description: locale === "ja"
                ? "一覧密度に合わせて sm / default / lg を選びます。"
                : "Use sm, default, or lg depending on list density.",
              preview: (
                <div className="grid gap-3">
                  <CompanyCell
                    size="sm"
                    name={locale === "ja" ? "小規模事業者持続化補助金" : "Small business growth grant"}
                    secondary={locale === "ja" ? "販路開拓・補助率 2/3" : "Market development / two-thirds rate"}
                    logo={<IconSchool className="h-4 w-4" />}
                  />
                  <CompanyCellPreview locale={locale} size="lg" />
                </div>
              ),
              code: `<CompanyCell size="sm" name="${locale === "ja" ? "小規模事業者持続化補助金" : "Small business growth grant"}" secondary="${locale === "ja" ? "販路開拓・補助率 2/3" : "Market development / two-thirds rate"}" />
<CompanyCell
  size="lg"
  name="UIXHERO"
  secondary="${locale === "ja" ? "デザインシステム・UIコンポーネント" : "Design system / UI components"}"
  logo={<img src="${uixheroLogoUrl}" alt="" className="h-6 w-6 object-contain" />}
  logoClassName="bg-foreground text-background"
/>`,
              previewBodyWidth: "md",
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
          {sectionLabels.props}
        </h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
            {sectionLabels.usage}
          </h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
