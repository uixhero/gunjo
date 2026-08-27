"use client";

import { InputCompositionDocPage } from "@/docs/components/_shared/InputCompositionDocPage";
import { PasswordRequirementListDemo } from "@/components/demos/PasswordRequirementListDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import { PasswordRequirementList } from "@gunjo/ui";

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>満たしたかどうかを、記号と色の両方で出す。</strong>チェック・バツ・丸（未入力）の3つのアイコンを使い分け、それぞれに読み上げ用の名前を付けています。緑と赤の色だけで分けると、色を見分けられない人には届きません。
            </li>
            <li>
                <strong>「まだ入力していない」を第3の状態として持つ。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">met</code> を渡さない項目は保留として灰色の丸になります。入力を始める前から全部が赤いバツで並ぶと、まだ何もしていないのに失敗しているように見えるためです。
            </li>
            <li>
                <strong>判定そのものは部品が持たない。</strong>何文字以上か、記号が要るかは呼ぶ側が決めて <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">met</code> に入れます。要件は国やサービスの規定で変わるので、部品には埋め込みませんでした。並びは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ul</code> のままで、順序の意味は持たせていません。
                <br />
                一般のリストの設計は UIXHERO の「リスト」にあります。{" "}
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/list"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: リスト（List）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>Met or unmet is shown by glyph as well as colour.</strong> Three icons (check, cross and an open circle for pending) each carry their own accessible name. Green versus red alone never reaches anyone who cannot separate those colours.
            </li>
            <li>
                <strong>&ldquo;Not typed yet&rdquo; is a real third state.</strong> An item with no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">met</code> renders as a grey pending circle. Starting the form with every rule already marked with a red cross reads as failure before the user has done anything.
            </li>
            <li>
                <strong>The rules themselves are not the component&rsquo;s.</strong> Minimum length, required symbols and the rest are evaluated by the caller and passed in through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">met</code>, because requirements change by country and by service. The markup stays a plain <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ul</code>: the order carries no meaning.
                <br />
                The general design of lists is covered by UIXHERO&rsquo;s list article.{" "}
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/list"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: List (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function PasswordRequirementListPage() {
    const { locale } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const isJa = locale === "ja";
    const code = isJa
        ? `import { PasswordRequirementList } from "@gunjo/ui";

export function SignUpPasswordRequirements() {
  return (
    <PasswordRequirementList
      requirements={[
        { id: "length", label: "12文字以上", met: true },
        { id: "number", label: "数字を含む", met: true },
        { id: "symbol", label: "記号を含む", met: false },
      ]}
    />
  );
}`
        : `import { PasswordRequirementList } from "@gunjo/ui";

export function SignUpPasswordRequirements() {
  return (
    <PasswordRequirementList
      requirements={[
        { id: "length", label: "At least 12 characters", met: true },
        { id: "number", label: "Includes a number", met: true },
        { id: "symbol", label: "Includes a symbol", met: false },
      ]}
    />
  );
}`;
    const usageCode = code;

    return (
        <InputCompositionDocPage designDecisions={designDecisions}
            metadataKey="passwordRequirementList"
            title={metadata.passwordRequirementList.title}
            description={metadata.passwordRequirementList.description}
            embedSrc="/embed/password-requirement-list"
            preview={<PasswordRequirementListDemo />}
            code={code}
            usageCode={usageCode}
            usedComponents={[{ name: "PasswordRequirementList", href: "/docs/components/password-requirement-list" }]}
            relatedComponents={[
                { name: "PasswordGroup", href: "/docs/components/password-group" },
                { name: "PasswordStrengthMeter", href: "/docs/components/password-strength-meter" },
                { name: "PasswordInput", href: "/docs/components/password-input" },
            ]}
            propsData={[
                {
                    name: "requirements",
                    type: "PasswordRequirement[]",
                    description: locale === "ja" ? "表示する要件と達成状態です。" : "Requirements and their current completion state.",
                },
                {
                    name: "metLabel / unmetLabel / pendingLabel",
                    type: "string",
                    description: locale === "ja" ? "各状態の支援技術向けラベルです。" : "Accessible labels for each requirement state.",
                },
            ]}
            states={[
                {
                    key: "mixed",
                    title: locale === "ja" ? "達成と未達成" : "Met and unmet",
                    description: locale === "ja" ? "検証結果をアプリ側で計算し、要件ごとに渡します。" : "Calculate validation in the app and pass it per requirement.",
                    preview: <PasswordRequirementListDemo />,
                    previewHeight: 150,
                    code,
                },
                {
                    key: "pending",
                    title: locale === "ja" ? "未入力" : "Pending",
                    description: locale === "ja" ? "入力前は met を省略して未確認状態にできます。" : "Omit met before input to show a pending state.",
                    preview: (
                        <PasswordRequirementList
                            className="w-full max-w-sm"
                            requirements={[
                                { id: "length", label: locale === "ja" ? "12文字以上" : "At least 12 characters" },
                                { id: "number", label: locale === "ja" ? "数字を含む" : "Includes a number" },
                            ]}
                        />
                    ),
                    previewHeight: 120,
                    code: isJa
                        ? `import { PasswordRequirementList } from "@gunjo/ui";

export function PendingPasswordRequirements() {
  return (
    <PasswordRequirementList
      className="w-full max-w-sm"
      requirements={[
        { id: "length", label: "12文字以上" },
        { id: "number", label: "数字を含む" },
      ]}
    />
  );
}`
                        : `import { PasswordRequirementList } from "@gunjo/ui";

export function PendingPasswordRequirements() {
  return (
    <PasswordRequirementList
      className="w-full max-w-sm"
      requirements={[
        { id: "length", label: "At least 12 characters" },
        { id: "number", label: "Includes a number" },
      ]}
    />
  );
}`,
                },
            ]}
        />
    );
}
