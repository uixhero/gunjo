"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PasswordStrengthMeterDemo } from "@/components/demos/PasswordStrengthMeterDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PasswordStrengthMeter } from "@gunjo/ui";

export default function PasswordStrengthMeterPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const isJa = locale === "ja";
    const code = isJa
        ? `import { PasswordStrengthMeter } from "@gunjo/ui";

export function StrongPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      score={3}
      label="パスワード強度"
      valueLabel="強い"
      description="評価ロジックはアプリ側で計算します。"
    />
  );
}`
        : `import { PasswordStrengthMeter } from "@gunjo/ui";

export function StrongPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      score={3}
      label="Password strength"
      valueLabel="Strong"
      description="Calculate strength in your app."
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
                    code: isJa
                        ? `import { PasswordStrengthMeter } from "@gunjo/ui";

export function WeakPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      className="w-full max-w-sm"
      score={1}
      label="パスワード強度"
      valueLabel="弱い"
    />
  );
}`
                        : `import { PasswordStrengthMeter } from "@gunjo/ui";

export function WeakPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      className="w-full max-w-sm"
      score={1}
      label="Password strength"
      valueLabel="Weak"
    />
  );
}`,
                },
                {
                    key: "max-score",
                    title: locale === "ja" ? "段の数を評価器に合わせる" : "Match the segment count to your scorer",
                    description: locale === "ja"
                        ? "maxScore が段の数になります。0〜3 の3段で返す評価器なら maxScore={3} にして、満点が満タンで揃うようにします。"
                        : "maxScore is the segment count. A scorer that returns 0–3 sets maxScore={3} so a top score fills the bar exactly.",
                    preview: (
                        <PasswordStrengthMeter
                            className="w-full max-w-sm"
                            score={2}
                            maxScore={3}
                            label={locale === "ja" ? "パスワード強度" : "Password strength"}
                            valueLabel={locale === "ja" ? "ふつう" : "Fair"}
                            description={locale === "ja" ? "3段で返す評価器に合わせています。" : "Matched to a three-step scorer."}
                        />
                    ),
                    previewHeight: 130,
                    code: isJa
                        ? `import { PasswordStrengthMeter } from "@gunjo/ui";

// 0〜3 の3段で返す評価器の例。
const SCORE = 2;
const MAX_SCORE = 3;
const RATINGS = ["使えません", "弱い", "ふつう", "強い"];

export function ThreeStepPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      className="w-full max-w-sm"
      score={SCORE}
      maxScore={MAX_SCORE}
      label="パスワード強度"
      valueLabel={RATINGS[SCORE]}
      description="3段で返す評価器に合わせています。"
    />
  );
}`
                        : `import { PasswordStrengthMeter } from "@gunjo/ui";

// A scorer that returns 0–3.
const SCORE = 2;
const MAX_SCORE = 3;
const RATINGS = ["Unusable", "Weak", "Fair", "Strong"];

export function ThreeStepPasswordStrengthMeter() {
  return (
    <PasswordStrengthMeter
      className="w-full max-w-sm"
      score={SCORE}
      maxScore={MAX_SCORE}
      label="Password strength"
      valueLabel={RATINGS[SCORE]}
      description="Matched to a three-step scorer."
    />
  );
}`,
                },
            ]}
        />
    );
}
