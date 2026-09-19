"use client";

import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { PricingTemplateDemo } from "@/components/demos/PricingTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

export default function PricingTemplatePage() {
    const { locale } = useLocale();

    const code = `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const plans: PricingPlan[] = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "/mo",
        description: "For personal projects.",
        features: ["Up to 5 users", "Community support", "Open-source components"],
        cta: <Button variant="outline" className="w-full">Get started</Button>,
    },
    {
        id: "pro",
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "For growing teams.",
        features: [
            "Unlimited users",
            "Priority support",
            "Advanced templates",
            "SSO & SAML",
        ],
        cta: <Button variant="secondary" className="w-full">Start trial</Button>,
        featured: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        description: "For larger organizations.",
        features: ["SLA + audit logs", "Dedicated success manager", "Custom integrations"],
        cta: <Button variant="outline" className="w-full">Contact sales</Button>,
    },
];

export function PricingPage() {
    return (
        <PricingTemplate
            plans={plans}
            title="Pricing"
            subtitle="Start free, upgrade when your team grows."
        />
    );
}`;

    const usageCode = code;

    const propsData = [
        { name: "title", type: "ReactNode", default: "'Pricing'", description: "Page heading." },
        { name: "subtitle", type: "ReactNode", description: "Subtitle line." },
        { name: "plans", type: "PricingPlan[]", description: "Plan cards: { id, name, price, period?, description?, features, cta, featured? }[]." },
        { name: "headingLevel", type: "1 | 2 | 3", default: "2", description: "Heading level for the title, so it never collides with the page heading." },
        { name: "billingPeriods", type: "PricingBillingPeriod[]", description: "Billing periods. With two or more, a toggle is rendered and prices react to it." },
        { name: "defaultBillingPeriod", type: "string", description: "Uncontrolled initial billing-period id." },
        { name: "billingPeriod", type: "string", description: "Controlled active billing-period id (with onBillingPeriodChange)." },
        { name: "onBillingPeriodChange", type: "(id: string) => void", description: "Called when the active billing period changes." },
        { name: "billingPeriodLabel", type: "string", default: "'Billing period'", description: "Accessible label for the billing-period toggle." },
    ];

    const simplePlans: PricingPlan[] = locale === "ja"
        ? [
            {
                id: "free",
                name: "Free",
                price: "0円",
                period: "/月",
                description: "個人の試作に。",
                features: ["5人まで", "コミュニティ支援"],
                cta: <Button variant="outline" className="w-full">はじめる</Button>,
            },
            {
                id: "pro",
                name: "Pro",
                price: "2,900円",
                period: "/月",
                description: "伸びているチームに。",
                features: ["人数の上限なし", "優先の問い合わせ", "テンプレート一式"],
                cta: <Button variant="secondary" className="w-full">試してみる</Button>,
            },
        ]
        : [
            {
                id: "free",
                name: "Free",
                price: "$0",
                period: "/mo",
                description: "For personal projects.",
                features: ["Up to 5 users", "Community support"],
                cta: <Button variant="outline" className="w-full">Get started</Button>,
            },
            {
                id: "pro",
                name: "Pro",
                price: "$29",
                period: "/mo",
                description: "For growing teams.",
                features: ["Unlimited users", "Priority support", "Advanced templates"],
                cta: <Button variant="secondary" className="w-full">Start trial</Button>,
            },
        ];

    const periodPlans: PricingPlan[] = locale === "ja"
        ? [
            {
                id: "free",
                name: "Free",
                price: { monthly: "0円", yearly: "0円" },
                period: "/月",
                description: "個人の試作に。",
                features: ["5人まで", "コミュニティ支援"],
                cta: <Button variant="outline" className="w-full">はじめる</Button>,
            },
            {
                id: "pro",
                name: "Pro",
                price: { monthly: "2,900円", yearly: "29,000円" },
                period: "/月",
                description: "伸びているチームに。",
                features: ["人数の上限なし", "優先の問い合わせ", "テンプレート一式"],
                cta: <Button variant="secondary" className="w-full">試してみる</Button>,
            },
        ]
        : [
            {
                id: "free",
                name: "Free",
                price: { monthly: "$0", yearly: "$0" },
                period: "/mo",
                description: "For personal projects.",
                features: ["Up to 5 users", "Community support"],
                cta: <Button variant="outline" className="w-full">Get started</Button>,
            },
            {
                id: "pro",
                name: "Pro",
                price: { monthly: "$29", yearly: "$290" },
                period: "/mo",
                description: "For growing teams.",
                features: ["Unlimited users", "Priority support", "Advanced templates"],
                cta: <Button variant="secondary" className="w-full">Start trial</Button>,
            },
        ];

    const featuredPlans: PricingPlan[] = simplePlans.map((plan) =>
        plan.id === "pro"
            ? { ...plan, featured: true, featuredLabel: locale === "ja" ? "いちばん選ばれています" : "Most popular" }
            : plan
    );

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).pricingTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).pricingTemplate.description}
            usedComponents={[
                { name: "PricingTemplate", href: "/docs/components/pricing" },
                { name: "Badge", href: "/docs/components/badge" },
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "Button", href: "/docs/components/button" },
            ]}
            relatedComponents={[
                { name: "LandingTemplate", href: "/docs/components/landing" },
                { name: "AmountBreakdown", href: "/docs/components/amount-breakdown" },
                { name: "SegmentedControl", href: "/docs/components/segmented-control" },
                { name: "CheckList", href: "/docs/components/check-list" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/pricing" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <PricingTemplateDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "plans が中身を決め、billingPeriods を渡すと切り替えが現れて価格が連動します。headingLevel は見出しの階層で、他の見出しとぶつからないようにする口です。"
                        : "plans carries the content, billingPeriods adds a toggle that the prices follow, and headingLevel keeps the title from colliding with the surrounding page."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "billing-periods",
                            title: locale === "ja" ? "月額と年額を切り替える" : "Monthly and yearly",
                            description: locale === "ja"
                                ? "billingPeriods を2つ以上渡すと切り替えが出ます。price を期間ごとの表にしておくと、押した側の金額に入れ替わります。"
                                : "Pass two or more billingPeriods and a toggle appears. Give each price as a map keyed by period id and the amounts follow the toggle.",
                            preview: (
                                <PricingTemplate
                                    plans={periodPlans}
                                    title={locale === "ja" ? "料金" : "Pricing"}
                                    subtitle={locale === "ja"
                                        ? "年払いにすると2か月ぶん安くなります。"
                                        : "Paying yearly saves you two months."}
                                    billingPeriods={[
                                        { id: "monthly", label: locale === "ja" ? "月払い" : "Monthly" },
                                        { id: "yearly", label: locale === "ja" ? "年払い" : "Yearly", note: locale === "ja" ? "2か月ぶん無料" : "Save 2 months" },
                                    ]}
                                    defaultBillingPeriod="monthly"
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "0円", yearly: "0円" },
    period: "/月",
    features: ["5人まで", "コミュニティ支援"],
    cta: <Button variant="outline" className="w-full">はじめる</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "2,900円", yearly: "29,000円" },
    period: "/月",
    features: ["人数の上限なし", "優先の問い合わせ"],
    cta: <Button variant="secondary" className="w-full">試してみる</Button>,
  },
];

const PERIODS = [
  { id: "monthly", label: "月払い" },
  { id: "yearly", label: "年払い", note: "2か月ぶん無料" },
];

export function PricingWithPeriods() {
  return (
    <PricingTemplate
      plans={PLANS}
      title="料金"
      subtitle="年払いにすると2か月ぶん安くなります。"
      billingPeriods={PERIODS}
      defaultBillingPeriod="monthly"
    />
  );
}`
                                : `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: "/mo",
    features: ["Up to 5 users", "Community support"],
    cta: <Button variant="outline" className="w-full">Get started</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "$29", yearly: "$290" },
    period: "/mo",
    features: ["Unlimited users", "Priority support"],
    cta: <Button variant="secondary" className="w-full">Start trial</Button>,
  },
];

const PERIODS = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", note: "Save 2 months" },
];

export function PricingWithPeriods() {
  return (
    <PricingTemplate
      plans={PLANS}
      title="Pricing"
      subtitle="Paying yearly saves you two months."
      billingPeriods={PERIODS}
      defaultBillingPeriod="monthly"
    />
  );
}`,
                        },
                        {
                            key: "featured-plan",
                            title: locale === "ja" ? "推すプランを立てる" : "A recommended plan",
                            description: locale === "ja"
                                ? "plans の1枚に featured を立てると、枠が強まり印が付きます。印の文字は featuredLabel で言い換えます。立てるのは1枚だけにします。"
                                : "Set featured on one plan and it gains a ring and a badge; featuredLabel rewords that badge. Mark only one plan, or the emphasis stops meaning anything.",
                            preview: (
                                <PricingTemplate
                                    plans={featuredPlans}
                                    title={locale === "ja" ? "料金" : "Pricing"}
                                    subtitle={locale === "ja" ? "無料で始めて、必要になったら上げられます。" : "Start free and move up when you need to."}
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0円",
    period: "/月",
    features: ["5人まで", "コミュニティ支援"],
    cta: <Button variant="outline" className="w-full">はじめる</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: "2,900円",
    period: "/月",
    features: ["人数の上限なし", "優先の問い合わせ"],
    cta: <Button variant="secondary" className="w-full">試してみる</Button>,
    featured: true,
    featuredLabel: "いちばん選ばれています",
  },
];

export function PricingWithFeatured() {
  return (
    <PricingTemplate
      plans={PLANS}
      title="料金"
      subtitle="無料で始めて、必要になったら上げられます。"
    />
  );
}`
                                : `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["Up to 5 users", "Community support"],
    cta: <Button variant="outline" className="w-full">Get started</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["Unlimited users", "Priority support"],
    cta: <Button variant="secondary" className="w-full">Start trial</Button>,
    featured: true,
    featuredLabel: "Most popular",
  },
];

export function PricingWithFeatured() {
  return (
    <PricingTemplate
      plans={PLANS}
      title="Pricing"
      subtitle="Start free and move up when you need to."
    />
  );
}`,
                        },
                        {
                            key: "heading-level",
                            title: locale === "ja" ? "節として埋め込む" : "Embedded as a section",
                            description: locale === "ja"
                                ? "既に見出しがある画面の中に置くときは headingLevel を下げます。見た目は変わらず、読み上げの順番だけが正しくなります。"
                                : "Lower headingLevel when the surrounding page already has a heading. Nothing moves visually; only the reading order comes out right.",
                            preview: (
                                <PricingTemplate
                                    plans={simplePlans}
                                    headingLevel={3}
                                    title={locale === "ja" ? "料金" : "Plans and pricing"}
                                    subtitle={locale === "ja" ? "この節はページ見出しの下に入ります。" : "This section sits under the page heading."}
                                />
                            ),
                            code: locale === "ja"
                                ? `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0円",
    period: "/月",
    features: ["5人まで", "コミュニティ支援"],
    cta: <Button variant="outline" className="w-full">はじめる</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: "2,900円",
    period: "/月",
    features: ["人数の上限なし", "優先の問い合わせ"],
    cta: <Button variant="secondary" className="w-full">試してみる</Button>,
  },
];

export function EmbeddedPricingSection() {
  return (
    <PricingTemplate
      plans={PLANS}
      headingLevel={3}
      title="料金"
      subtitle="この節はページ見出しの下に入ります。"
    />
  );
}`
                                : `import { Button, PricingTemplate, type PricingPlan } from "@gunjo/ui";

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["Up to 5 users", "Community support"],
    cta: <Button variant="outline" className="w-full">Get started</Button>,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["Unlimited users", "Priority support"],
    cta: <Button variant="secondary" className="w-full">Start trial</Button>,
  },
];

export function EmbeddedPricingSection() {
  return (
    <PricingTemplate
      plans={PLANS}
      headingLevel={3}
      title="Plans and pricing"
      subtitle="This section sits under the page heading."
    />
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Props</h2>
                <PropsTable data={propsData} />
            </div>
            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Usage</h2>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
