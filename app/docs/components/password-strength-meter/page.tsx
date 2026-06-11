"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PasswordStrengthMeterDemo } from "@/components/demos/PasswordStrengthMeterDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PasswordStrengthMeter } from "@gunjo/ui";

export default function PasswordStrengthMeterPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const code = `import { PasswordStrengthMeter } from "@gunjo/ui";

export function PasswordStrengthMeterDemo() {
  return (
    <PasswordStrengthMeter
      score={3}
      label="${locale === "ja" ? "パスワード強度" : "Password strength"}"
      valueLabel="${locale === "ja" ? "強い" : "Strong"}"
      description="${locale === "ja" ? "評価ロジックはアプリ側で計算します。" : "Calculate strength in your app."}"
    />
  );
}`;

    return (
        <InputCompositionDocPage
            metadataKey="passwordStrengthMeter"
            title={metadata.passwordStrengthMeter.title}
            description={metadata.passwordStrengthMeter.description}
            embedSrc="/embed/password-strength-meter"
            preview={<PasswordStrengthMeterDemo />}
            code={code}
            usageCode={code}
            usedComponents={[{ name: "PasswordStrengthMeter", href: "/docs/components/password-strength-meter" }]}
            relatedComponents={[
                { name: "PasswordGroup", href: "/docs/components/password-group" },
                { name: "Progress", href: "/docs/components/progress" },
            ]}
            propsData={[
                {
                    name: "score",
                    type: "number",
                    description: locale === "ja" ? "アプリ側で計算した強度スコアです。" : "Strength score calculated by the application.",
                },
                {
                    name: "maxScore",
                    type: "number",
                    default: "4",
                    description: locale === "ja" ? "最大スコアです。セグメント数にも使われます。" : "Maximum score, also used as the segment count.",
                },
                {
                    name: "label / valueLabel / description",
                    type: "ReactNode",
                    description: locale === "ja" ? "メーターの名前、現在の評価、補足文です。" : "Meter name, current rating, and helper copy.",
                },
            ]}
            states={[
                {
                    key: "strong",
                    title: locale === "ja" ? "強い" : "Strong",
                    description: locale === "ja" ? "スコアが高い場合は success 色で表示します。" : "High scores use the success color.",
                    preview: <PasswordStrengthMeterDemo />,
                    previewHeight: 130,
                    code,
                },
                {
                    key: "weak",
                    title: locale === "ja" ? "弱い" : "Weak",
                    description: locale === "ja" ? "スコアが低い場合は destructive 色で注意を示します。" : "Low scores use the destructive color.",
                    preview: <PasswordStrengthMeter className="w-full max-w-sm" score={1} label={locale === "ja" ? "パスワード強度" : "Password strength"} valueLabel={locale === "ja" ? "弱い" : "Weak"} />,
                    previewHeight: 110,
                    code: `<PasswordStrengthMeter score={1} label="${locale === "ja" ? "パスワード強度" : "Password strength"}" valueLabel="${locale === "ja" ? "弱い" : "Weak"}" />`,
                },
            ]}
        />
    );
}
