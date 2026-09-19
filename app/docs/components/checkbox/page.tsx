"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Checkbox, Label } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

export default function CheckboxPage() {
    const { locale, sectionLabels } = useLocale();
    const statesHeading = locale === "ja" ? "状態とバリエーション" : "States and variants";
    const disabledReason = locale === "ja" ? "管理者が通知設定を固定しています。" : "Your administrator has locked notification settings.";

    const isJa = locale === "ja";
    const code = isJa
        ? `import { Checkbox, Label } from "@gunjo/ui";

export function TermsCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">利用規約に同意する</Label>
    </div>
  );
}`
        : `import { Checkbox, Label } from "@gunjo/ui";

export function TermsCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  );
}`;

    const usageCode = isJa
        ? `import * as React from "react";
import { Checkbox, Label } from "@gunjo/ui";

export function TermsCheckboxWithText() {
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms">利用規約に同意する</Label>
        <p className="text-sm text-muted-foreground">
          利用規約とプライバシーポリシーに同意したものとみなします。
        </p>
      </div>
    </div>
  );
}`
        : `import * as React from "react";
import { Checkbox, Label } from "@gunjo/ui";

export function TermsCheckboxWithText() {
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms">Accept terms and conditions</Label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}`;

    const propsData = [
        { name: "checked", type: "boolean", default: "false", description: locale === "ja" ? "チェックボックスの選択状態を制御します。" : "The controlled checked state of the checkbox." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: locale === "ja" ? "選択状態が変わった時に呼ばれる処理です。" : "Event handler called when the checked state changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "true の場合、ユーザー操作を無効にします。" : "When true, prevents the user from interacting with the checkbox." },
    ];

    return (
        <ComponentLayout
            title={inputsMetadata.checkbox.title}
            description={inputsMetadata.checkbox.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Switch", href: "/docs/components/switch" },
                { name: "RadioGroup", href: "/docs/components/radio-group" },
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "Form", href: "/docs/components/form" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: チェックボックス（Checkbox）" : "UIXHERO: Checkbox (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/checkbox`,
                },
            ]}
        >
            <ComponentPreview embedSrc="/embed/checkbox" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <div className="flex items-center gap-2">
                    <Checkbox id="terms-preview" />
                    <Label htmlFor="terms-preview">
                        {locale === "ja" ? "利用規約に同意する" : "Accept terms"}
                    </Label>
                </div>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {statesHeading}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "unchecked",
                            title: locale === "ja" ? "未選択" : "Unchecked",
                            description:
                                locale === "ja"
                                    ? "まだ選択されていない基本状態です。ラベルと組み合わせて意味を明確にします。"
                                    : "The default unselected state. Pair it with a label so the choice is clear.",
                            preview: (
                                <div className="flex items-center gap-2">
                                    <Checkbox id="checkbox-unchecked" />
                                    <Label htmlFor="checkbox-unchecked">
                                        {locale === "ja" ? "メールで通知を受け取る" : "Receive email updates"}
                                    </Label>
                                </div>
                            ),
                            code: isJa
                                ? `import { Checkbox, Label } from "@gunjo/ui";

export function EmailUpdatesCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="updates" />
      <Label htmlFor="updates">メールで通知を受け取る</Label>
    </div>
  );
}`
                                : `import { Checkbox, Label } from "@gunjo/ui";

export function EmailUpdatesCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="updates" />
      <Label htmlFor="updates">Receive email updates</Label>
    </div>
  );
}`,
                        },
                        {
                            key: "checked",
                            title: locale === "ja" ? "選択済み" : "Checked",
                            description:
                                locale === "ja"
                                    ? "同意や選択が完了している状態です。値を外部で管理する場合は、選択済みの値を渡します。"
                                    : "The selected state. Pass checked when the value is controlled by application state.",
                            preview: (
                                <div className="flex items-center gap-2">
                                    <Checkbox id="checkbox-checked" checked onCheckedChange={() => {}} />
                                    <Label htmlFor="checkbox-checked">
                                        {locale === "ja" ? "利用規約に同意済み" : "Terms accepted"}
                                    </Label>
                                </div>
                            ),
                            code: isJa
                                ? `import * as React from "react";
import { Checkbox, Label } from "@gunjo/ui";

export function AcceptedTermsCheckbox() {
  const [accepted, setAccepted] = React.useState(true);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <Label htmlFor="terms">利用規約に同意済み</Label>
    </div>
  );
}`
                                : `import * as React from "react";
import { Checkbox, Label } from "@gunjo/ui";

export function AcceptedTermsCheckbox() {
  const [accepted, setAccepted] = React.useState(true);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={setAccepted}
      />
      <Label htmlFor="terms">Terms accepted</Label>
    </div>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効" : "Disabled",
                            description:
                                locale === "ja"
                                    ? "ユーザーが変更できない状態です。必要に応じて理由を近くに表示します。"
                                    : "Prevents the user from changing the value. Explain why nearby when needed.",
                            preview: (
                                <div className="flex items-center gap-2">
                                    <DisabledReasonTooltip reason={disabledReason}>
                                        <Checkbox id="checkbox-disabled" disabled />
                                    </DisabledReasonTooltip>
                                    <Label htmlFor="checkbox-disabled" className="text-muted-foreground">
                                        {locale === "ja" ? "管理者により固定されています" : "Locked by an administrator"}
                                    </Label>
                                </div>
                            ),
                            code: isJa
                                ? `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Checkbox, Label } from "@gunjo/ui";

export function LockedNotificationCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <DisabledReasonTooltip reason="管理者が通知設定を固定しています。">
        <Checkbox id="locked" disabled />
      </DisabledReasonTooltip>
      <Label htmlFor="locked">管理者により固定されています</Label>
    </div>
  );
}`
                                : `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Checkbox, Label } from "@gunjo/ui";

export function LockedNotificationCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <DisabledReasonTooltip reason="Your administrator has locked notification settings.">
        <Checkbox id="locked" disabled />
      </DisabledReasonTooltip>
      <Label htmlFor="locked">Locked by an administrator</Label>
    </div>
  );
}`,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>土台は入力欄ではなくボタン。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="checkbox"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code> を自分で持つ <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> で作っています。素の入力欄の描画に見た目を縛られないための選択で、その代わり読み上げ用の属性は部品の側で全部埋めています。
                        </li>
                        <li>
                            <strong>名前と補足を部品に渡せる。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> を渡すと、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">useId</code> で作った id を使って <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code> に繋がります。呼ぶ側が毎回 <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> を思い出さなくて済みます。ラベルを押しても切り替わるので、当たり判定は四角の中だけではありません。
                        </li>
                        <li>
                            <strong>見た目の段は生成された定義から引く。</strong>チェック済み・未チェック・使えない、の3つの見た目は設計の元から生成した名前で引いています。ソースの側だけで段を足すことはできません。四角は複数選べる・丸は1つだけ、という使い分けは資料に書いてあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>A button underneath, not an input.</strong> It is a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> that carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="checkbox"'}</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code> itself. That keeps the visual out of the native control renderer, and in exchange every attribute a screen reader needs is filled in by the component.
                        </li>
                        <li>
                            <strong>The name and the hint are props.</strong> Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> and they are wired through ids from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">useId</code> into <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code>, so callers do not have to remember a per-instance <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code>. Clicking the label toggles it too, so the hit area is more than the box.
                        </li>
                        <li>
                            <strong>The states come from generated keys.</strong> Checked, unchecked and disabled are looked up by names generated from the design source, so a state cannot be added from the React side alone. Square means many, round means one is covered in the article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
