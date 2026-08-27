import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>既定の幅を288pxに決め打ちした。</strong>資料は「3から5項目の設定やフィルターなら Popover、それ以上なら Modal に上げる」と書いています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PopoverContent</code> は幅を288pxに固定し、高さも画面に収まる分で頭打ちにしました（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">--radix-popper-available-height</code> と画面の高さから2rem引いた値の、小さいほう）。中身を増やすと先に窮屈になるので、Modal へ上げる判断が画面を見た時点で付きます。
            </li>
            <li>
                <strong>フォーカスの囲い込みはしない。</strong>資料は「Popover にフォーカストラップを付けると Modal と同じ重さになる」を禁止として挙げています。GUNJO は土台の Radix の Popover をそのまま使っており、開いたときのフォーカス移動と Escape と外側のクリックは受け持ちますが、Tab の囲い込みはしません。囲い込みが要るほど重い操作なら、最初から Modal を使う側の判断です。
            </li>
            <li>
                <strong>画面端の逃げ方だけ既定を変えた。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">collisionPadding</code> の既定を16にしてあります。0のままだと画面の端にぴったり貼り付いて読みにくいためです。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">portalContainer</code> を渡すと、画面全体ではなくその要素の中に描きます。docs の埋め込みプレビューのように、画面いっぱいに出しては困る枠の中で使うために要ります。
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/popover"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: ポップオーバー（Popover）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>The default width is pinned at 288px.</strong> The article says three to five settings or filters belong in a Popover and anything beyond that should be promoted to a Modal. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PopoverContent</code> fixes the width at 288px and caps the height at whatever fits (the smaller of <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">--radix-popper-available-height</code> and the viewport minus 2rem). Adding content makes the panel feel cramped early, so the promotion decision becomes visible as soon as you look at the screen.
            </li>
            <li>
                <strong>No focus trap.</strong> The article forbids trapping focus in a Popover, because that makes it as heavy as a Modal. GUNJO uses the Radix Popover as-is: initial focus, Escape and outside click are handled, Tab is not caged. If an interaction is important enough to need the cage, the caller should reach for a Modal instead.
            </li>
            <li>
                <strong>Only the edge behaviour was changed from the default.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">collisionPadding</code> defaults to 16, because at 0 the panel sticks flush to the viewport edge and becomes hard to read. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">portalContainer</code> to render inside a given element rather than the whole page, which is what the embedded previews in these docs need.
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/popover"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Popover (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function PopoverDocPage() {
    return (
        <OverlayAuditDocPage
            kind="popover"
            title={overlayMetadata.popover.title}
            description={overlayMetadata.popover.description}
            designDecisions={designDecisions}
        />
    );
}
