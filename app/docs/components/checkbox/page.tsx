"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import inputsMetadata from "@design/inputs-metadata.json";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Checkbox, Label } from "@gunjo/ui";

export default function CheckboxPage() {
    const { locale, sectionLabels } = useLocale();
    const statesHeading = locale === "ja" ? "状態とバリエーション" : "States and variants";
    const disabledReason = locale === "ja" ? "管理者が通知設定を固定しています。" : "Your administrator has locked notification settings.";

    const code = `import { Checkbox, Label } from "@gunjo/ui"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">${locale === "ja" ? "利用規約に同意する" : "Accept terms"}</Label>
    </div>
  )
}`;

    const usageCode = `import { Checkbox, Label } from "@gunjo/ui"

export function CheckboxWithText() {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id="terms" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms">Accept terms and conditions</Label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
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
                            code: `import { Checkbox, Label } from "@gunjo/ui";

export default function EmailUpdates() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="updates" />
      <Label htmlFor="updates">${locale === "ja" ? "メールで通知を受け取る" : "Receive email updates"}</Label>
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
                            code: `import { Checkbox, Label } from "@gunjo/ui";

export default function AcceptedTerms() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" checked onCheckedChange={() => {}} />
      <Label htmlFor="terms">${locale === "ja" ? "利用規約に同意済み" : "Terms accepted"}</Label>
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
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Checkbox, Label } from "@gunjo/ui";

export default function LockedCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <DisabledReasonTooltip reason="${locale === "ja" ? "管理者が通知設定を固定しています。" : "Your administrator has locked notification settings."}">
        <Checkbox id="locked" disabled />
      </DisabledReasonTooltip>
      <Label htmlFor="locked">${locale === "ja" ? "管理者により固定されています" : "Locked by an administrator"}</Label>
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
        </ComponentLayout>
    );
}
