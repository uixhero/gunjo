import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";
import { UIXHERO_BASE_URL, type UixheroLink } from "@/lib/uixhero-links";

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>中身を触れないようにして、リンクやボタンを入れられなくした。</strong>資料は「Tooltip にリンクやボタンやフォームを含める」を禁止に挙げています。ホバーで開くものにカーソルを移そうとすると閉じてしまい、たどり着けないからです。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TooltipContent</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code> を持つので、中に置いたものはそもそも押せません。押せるものが要る場面は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Popover</code> の仕事だ、という切り分けを部品の側で固定しました。
            </li>
            <li>
                <strong>指で押したときも開く。</strong>資料は「必須の情報を Tooltip に入れると、モバイルとキーボードの一部の利用者が届かなくなる」を核に挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">openOnPress</code> を既定で入りにし、指かペンで押したときは押した瞬間に開いて2.2秒後に閉じます（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressOpenDuration</code>）。押せない理由やアイコンだけのボタンの名前を、スマホでも読めるようにするためです。それでも読み上げには届かないので、アイコンだけのボタンには <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> を別に付けます。
            </li>
            <li>
                <strong>幅を <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max-w-xs</code> で頭打ちにした。</strong>資料は「テキストは短く、最大2行」と書いています。行数では止められないので、GUNJO は幅を20remで止めて中央寄せにしました。長い文を入れると縦に伸びて目に見えて不格好になるので、書いた時点で気づけます。出るまでの間は土台の Radix の既定のままで、必要なら <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">delayDuration</code> を渡して変えられます。
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The content cannot be touched, so links and buttons cannot live there.</strong> The article forbids putting links, buttons or forms inside a tooltip, because moving the cursor toward them closes it and they are never reached. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">TooltipContent</code> carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pointer-events-none</code>, so anything placed inside is unclickable by construction. The rule that interactive content belongs to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Popover</code> is enforced by the component rather than by convention.
            </li>
            <li>
                <strong>A touch press opens it too.</strong> The article names the core risk as required information becoming unreachable for mobile and some keyboard users. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">openOnPress</code> defaults to on: a touch or pen press opens the tooltip immediately and closes it after 2.2 seconds (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pressOpenDuration</code>), so a disabled reason or the name of an icon-only button is readable on a phone. That still does not reach a screen reader, so an icon-only button needs its own <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code>.
            </li>
            <li>
                <strong>The width is capped at <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max-w-xs</code>.</strong> The article asks for short text, at most two lines. Lines cannot be capped directly, so GUNJO caps the width at 20rem and centres the text. Long copy then grows visibly tall and awkward, which shows up while it is being written. The open delay is left at the Radix default and can be changed with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">delayDuration</code>.
            </li>
        </>
    ),
};

// 本文からこの節へ移した UIXHERO の記事リンク（gunjo #955 の受け口）。
const uixheroLinks: Record<"ja" | "en", UixheroLink[]> = {
    ja: [
        {
            label: "UIXHERO: ツールチップ（Tooltip）",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/tooltip`,
        },
    ],
    en: [
        {
            label: "UIXHERO: Tooltip (in Japanese)",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/tooltip`,
        },
    ],
};

export default function TooltipDocPage() {
    return (
        <OverlayAuditDocPage
            kind="tooltip"
            title={overlayMetadata.tooltip.title}
            description={overlayMetadata.tooltip.description}
            designDecisions={designDecisions}
            uixheroLinks={uixheroLinks}
        />
    );
}
