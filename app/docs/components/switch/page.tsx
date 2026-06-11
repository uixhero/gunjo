"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { Label, Switch } from "@gunjo/ui";

function SwitchRow({ checked, disabled }: { checked?: boolean; disabled?: boolean }) {
    const { locale } = useLocale();
    const control = <Switch id={disabled ? "switch-managed" : "switch-autosave"} defaultChecked={checked} checked={disabled ? true : undefined} disabled={disabled} />;

    return (
        <div className="flex items-center gap-2">
            {disabled ? (
                <DisabledReasonTooltip reason={locale === "ja" ? "組織設定で固定されています。" : "This setting is managed by your organization."}>
                    {control}
                </DisabledReasonTooltip>
            ) : (
                control
            )}
            <Label htmlFor={disabled ? "switch-managed" : "switch-autosave"} className={disabled ? "text-muted-foreground" : undefined}>
                {disabled ? (locale === "ja" ? "組織設定で固定" : "Managed by organization") : locale === "ja" ? "自動保存" : "Auto-save"}
            </Label>
        </div>
    );
}

export default function SwitchPage() {
    const { locale, sectionLabels } = useLocale();
    const code = `import { Label, Switch } from "@gunjo/ui";

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">${locale === "ja" ? "メール通知" : "Email notifications"}</Label>
    </div>
  );
}`;

    const usageCode = `import { Label, Switch } from "@gunjo/ui";

<div className="flex items-center gap-2">
  <Switch id="notifications" defaultChecked />
  <Label htmlFor="notifications">${locale === "ja" ? "メール通知" : "Email notifications"}</Label>
</div>`;

    const propsData = [
        { name: "checked", type: "boolean", description: locale === "ja" ? "外部から制御するオン/オフ状態です。" : "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", description: locale === "ja" ? "初期状態です。" : "Initial checked state for uncontrolled usage." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: locale === "ja" ? "状態が変わった時に呼ばれます。" : "Called when the state changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "切り替えできない状態にします。理由はツールチップで補足します。" : "Disables toggling. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={inputsMetadata.switch.title}
            description={inputsMetadata.switch.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Switch", href: "/docs/components/switch" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/switch" code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels}>
                <div className="flex items-center gap-2">
                    <Switch id="notifications-preview" defaultChecked />
                    <Label htmlFor="notifications-preview">
                        {locale === "ja" ? "メール通知" : "Email notifications"}
                    </Label>
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "off",
                            title: locale === "ja" ? "オフ" : "Off",
                            description: locale === "ja" ? "機能が無効な状態です。単一設定のオン/オフに使います。" : "The setting is off. Use switches for a single on/off decision.",
                            preview: <SwitchRow />,
                            previewHeight: 150,
                            code: `<Switch id="autosave" />`,
                        },
                        {
                            key: "on",
                            title: locale === "ja" ? "オン" : "On",
                            description: locale === "ja" ? "初期値として有効にする場合は defaultChecked を使います。" : "Use defaultChecked when the setting should start on.",
                            preview: <SwitchRow checked />,
                            previewHeight: 150,
                            code: `<Switch id="autosave" defaultChecked />`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "切り替えできない理由はツールチップとラベルで示します。" : "Explain why the switch is disabled with a tooltip and label.",
                            preview: <SwitchRow disabled />,
                            previewHeight: 150,
                            code: `import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { Switch } from "@gunjo/ui";

<DisabledReasonTooltip reason="${locale === "ja" ? "組織設定で固定されています。" : "This setting is managed by your organization."}">
  <Switch checked disabled />
</DisabledReasonTooltip>`,
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
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
