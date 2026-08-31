"use client";

import { Input, Label, OnboardingFlow, OnboardingTemplate, type OnboardingStep } from "@gunjo/ui";
import { ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { OnboardingTemplateDemo } from "@/components/demos/OnboardingTemplateDemo";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import patternsMetadata from "@design/patterns-metadata.json";

export default function OnboardingTemplatePage() {
    const { locale } = useLocale();

    const code = `import { OnboardingFlow, OnboardingTemplate } from "@gunjo/ui";

export function Onboarding() {
    return (
        <OnboardingTemplate hero={<Welcome />}>
            <OnboardingFlow steps={STEPS} onComplete={...} />
        </OnboardingTemplate>
    );
}`;

    const usageCode = `import { OnboardingTemplate } from "@gunjo/ui"

<OnboardingTemplate hero={<HeroPanel />}>
    {/* form / OnboardingFlow */}
</OnboardingTemplate>`;

    const propsData = [
        { name: "hero", type: "ReactNode", description: "Hero side panel content (welcome / branding / illustration)." },
        { name: "children", type: "ReactNode", description: "Right pane content (typically OnboardingFlow or a form)." },
    ];

    const brandHero = (
        <div className="space-y-3">
            <p className="text-2xl font-semibold">Gunjo</p>
            <p className="text-sm opacity-80">
                {locale === "ja"
                    ? "はじめの設定は3分で終わります。あとからいつでも変えられます。"
                    : "Setup takes about three minutes, and every choice can be changed later."}
            </p>
        </div>
    );

    const steps: OnboardingStep[] = locale === "ja"
        ? [
            { id: "profile", title: "お名前を教えてください", description: "画面に出る表示名です。", content: <Input placeholder="田中 美咲" /> },
            { id: "team", title: "チーム名を決めます", description: "あとから変えられます。", content: <Input placeholder="設計チーム" /> },
        ]
        : [
            { id: "profile", title: "What should we call you?", description: "This is the name shown on screen.", content: <Input placeholder="Misaki Tanaka" /> },
            { id: "team", title: "Name your team", description: "You can change this later.", content: <Input placeholder="Design team" /> },
        ];

    const flowLabels = locale === "ja"
        ? {
            backLabel: "戻る",
            nextLabel: "次へ",
            completeLabel: "完了",
            progressLabel: "設定の進み具合",
            stepLabel: (current: number, total: number) => `${total} 段のうち ${current} 段目`,
        }
        : {};

    return (
        <ComponentLayout
            title={(patternsMetadata as Record<string, { title: string }>).onboardingTemplate.title}
            description={(patternsMetadata as Record<string, { description: string }>).onboardingTemplate.description}
            usedComponents={[
                { name: "OnboardingTemplate", href: "/docs/components/onboarding" },
                { name: "OnboardingFlow", href: "/docs/components/onboarding-flow" },
                { name: "Input", href: "/docs/components/input" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "AuthTemplate", href: "/docs/components/auth" },
                { name: "ResponsiveAuthCardPattern", href: "/docs/components/responsive-auth-card-pattern" },
                { name: "Stepper", href: "/docs/components/stepper" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/onboarding" code={code} fullPagePreview codeBlock={<CodeBlock code={code} />}>
                <OnboardingTemplateDemo />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "この部品が持つ差し替え口は hero と右側の中身の2つだけです。左右の比と折り返しは固定なので、違いは何を入れるかで出ます。"
                        : "This template exposes only two slots: hero and the right-hand body. The column ratio and the wrapping point are fixed, so the differences come from what you put in them."}
                </p>
                <ComponentDemoStates
                    states={[
                        {
                            key: "guided-flow",
                            title: locale === "ja" ? "段を追う流れ" : "Guided flow",
                            description: locale === "ja"
                                ? "右に OnboardingFlow を置いた既定の組み合わせです。戻る・進むの操作は OnboardingFlow が持ちます。"
                                : "The default pairing, with OnboardingFlow on the right. Back and continue are owned by OnboardingFlow, not by the template.",
                            preview: (
                                <OnboardingTemplate className="min-h-0 [&>aside]:md:min-h-0" hero={brandHero}>
                                    <OnboardingFlow steps={steps} {...flowLabels} />
                                </OnboardingTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Input, OnboardingFlow, OnboardingTemplate, type OnboardingStep } from "@gunjo/ui";

const STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "お名前を教えてください",
    description: "画面に出る表示名です。",
    content: <Input placeholder="田中 美咲" />,
  },
  {
    id: "team",
    title: "チーム名を決めます",
    description: "あとから変えられます。",
    content: <Input placeholder="設計チーム" />,
  },
];

const LABELS = {
  backLabel: "戻る",
  nextLabel: "次へ",
  completeLabel: "完了",
  progressLabel: "設定の進み具合",
  stepLabel: (current, total) => total + " 段のうち " + current + " 段目",
};

export function GuidedOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-3">
          <p className="text-2xl font-semibold">Gunjo</p>
          <p className="text-sm opacity-80">はじめの設定は3分で終わります。</p>
        </div>
      }
    >
      <OnboardingFlow steps={STEPS} {...LABELS} />
    </OnboardingTemplate>
  );
}`
                                : `import { Input, OnboardingFlow, OnboardingTemplate, type OnboardingStep } from "@gunjo/ui";

const STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "What should we call you?",
    description: "This is the name shown on screen.",
    content: <Input placeholder="Misaki Tanaka" />,
  },
  {
    id: "team",
    title: "Name your team",
    description: "You can change this later.",
    content: <Input placeholder="Design team" />,
  },
];

export function GuidedOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-3">
          <p className="text-2xl font-semibold">Gunjo</p>
          <p className="text-sm opacity-80">Setup takes about three minutes.</p>
        </div>
      }
    >
      <OnboardingFlow steps={STEPS} />
    </OnboardingTemplate>
  );
}`,
                        },
                        {
                            key: "single-form",
                            title: locale === "ja" ? "1枚のフォーム" : "A single form",
                            description: locale === "ja"
                                ? "右側は OnboardingFlow でなくてもかまいません。聞くことが少ないときは、段に分けず1枚に収めます。"
                                : "The right pane does not have to be OnboardingFlow. When there is little to ask, keep it to one form instead of a sequence.",
                            preview: (
                                <OnboardingTemplate className="min-h-0 [&>aside]:md:min-h-0" hero={brandHero}>
                                    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                                        <div className="space-y-2">
                                            <Label htmlFor="onboarding-name">{locale === "ja" ? "表示名" : "Display name"}</Label>
                                            <Input id="onboarding-name" placeholder={locale === "ja" ? "田中 美咲" : "Misaki Tanaka"} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="onboarding-team">{locale === "ja" ? "チーム名" : "Team name"}</Label>
                                            <Input id="onboarding-team" placeholder={locale === "ja" ? "設計チーム" : "Design team"} />
                                        </div>
                                    </form>
                                </OnboardingTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Input, Label, OnboardingTemplate } from "@gunjo/ui";

export function SingleFormOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-3">
          <p className="text-2xl font-semibold">Gunjo</p>
          <p className="text-sm opacity-80">はじめの設定は3分で終わります。</p>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">表示名</Label>
          <Input id="name" placeholder="田中 美咲" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">チーム名</Label>
          <Input id="team" placeholder="設計チーム" />
        </div>
      </form>
    </OnboardingTemplate>
  );
}`
                                : `import { Input, Label, OnboardingTemplate } from "@gunjo/ui";

export function SingleFormOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-3">
          <p className="text-2xl font-semibold">Gunjo</p>
          <p className="text-sm opacity-80">Setup takes about three minutes.</p>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" placeholder="Misaki Tanaka" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Team name</Label>
          <Input id="team" placeholder="Design team" />
        </div>
      </form>
    </OnboardingTemplate>
  );
}`,
                        },
                        {
                            key: "value-hero",
                            title: locale === "ja" ? "hero を説明に使う" : "A hero that explains",
                            description: locale === "ja"
                                ? "hero はロゴだけの場所ではありません。これから何をするのかを先に見せておくと、離脱が減ります。"
                                : "The hero slot is not only for a logo. Saying up front what is about to happen keeps people from dropping out.",
                            preview: (
                                <OnboardingTemplate
                                    className="min-h-0 [&>aside]:md:min-h-0"
                                    hero={
                                        <div className="space-y-4">
                                            <p className="text-xl font-semibold">
                                                {locale === "ja" ? "これから3つ聞きます" : "Three things to set up"}
                                            </p>
                                            <ol className="space-y-2 text-sm opacity-80">
                                                {(locale === "ja"
                                                    ? ["表示名を決める", "チームを作る", "通知の受け取り方を選ぶ"]
                                                    : ["Pick a display name", "Create your team", "Choose how you get notified"]
                                                ).map((item, index) => (
                                                    <li key={item}>{index + 1}. {item}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    }
                                >
                                    <OnboardingFlow steps={steps} {...flowLabels} />
                                </OnboardingTemplate>
                            ),
                            code: locale === "ja"
                                ? `import { Input, OnboardingFlow, OnboardingTemplate, type OnboardingStep } from "@gunjo/ui";

const STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "お名前を教えてください",
    description: "画面に出る表示名です。",
    content: <Input placeholder="田中 美咲" />,
  },
  {
    id: "team",
    title: "チーム名を決めます",
    description: "あとから変えられます。",
    content: <Input placeholder="設計チーム" />,
  },
];

const LABELS = {
  backLabel: "戻る",
  nextLabel: "次へ",
  completeLabel: "完了",
  progressLabel: "設定の進み具合",
  stepLabel: (current, total) => total + " 段のうち " + current + " 段目",
};

const AGENDA = ["表示名を決める", "チームを作る", "通知の受け取り方を選ぶ"];

export function ExplainingHeroOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-4">
          <p className="text-xl font-semibold">これから3つ聞きます</p>
          <ol className="space-y-2 text-sm opacity-80">
            {AGENDA.map((item, index) => (
              <li key={item}>{index + 1}. {item}</li>
            ))}
          </ol>
        </div>
      }
    >
      <OnboardingFlow steps={STEPS} {...LABELS} />
    </OnboardingTemplate>
  );
}`
                                : `import { Input, OnboardingFlow, OnboardingTemplate, type OnboardingStep } from "@gunjo/ui";

const STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "What should we call you?",
    description: "This is the name shown on screen.",
    content: <Input placeholder="Misaki Tanaka" />,
  },
  {
    id: "team",
    title: "Name your team",
    description: "You can change this later.",
    content: <Input placeholder="Design team" />,
  },
];

const AGENDA = ["Pick a display name", "Create your team", "Choose how you get notified"];

export function ExplainingHeroOnboarding() {
  return (
    <OnboardingTemplate
      className="min-h-0 [&>aside]:md:min-h-0"
      hero={
        <div className="space-y-4">
          <p className="text-xl font-semibold">Three things to set up</p>
          <ol className="space-y-2 text-sm opacity-80">
            {AGENDA.map((item, index) => (
              <li key={item}>{index + 1}. {item}</li>
            ))}
          </ol>
        </div>
      }
    >
      <OnboardingFlow steps={STEPS} />
    </OnboardingTemplate>
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
