import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>公開リンクの入り切りだけを持つ。</strong>資料は権限の段階（閲覧者・編集者・コメント可）とメールでの招待を核に挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ShareModal</code> はそこまで持たず、「リンクを知っている人が見られるかどうか」の1つのスイッチと、そのURLのコピーと開くだけを扱います。誰に何を許すかはアプリの権限の設計そのもので、部品の側では決められないためです。
            </li>
            <li>
                <strong>コピーできたことは2秒だけ形で見せる。</strong>資料は「コピー成功を2秒間表示する」を挙げています。GUNJO も2秒で戻す作りで、アイコンをチェックに替えると同時に、吹き出しの文言も <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copied</code> のラベルに差し替えます。クリップボードが使えない環境向けの古い手順への切り替えも部品の中にあります。資料が求める <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-live</code> での読み上げは、まだ入っていません。
            </li>
            <li>
                <strong>フォーカスの囲い込みと Escape は入っていません。</strong>閉じる手段は背景のクリックと右上のボタンの2つで、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">role</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-modal</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> は付けてあります。ただし資料が求める Tab の囲い込みと Escape キーはこの部品には無く、ここは記事に対して足りていない箇所です。囲い込みが要る使い方をするなら、いまは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Sheet</code> や <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Dialog</code> に載せ替えるのが確実です。
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/share-modal"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: 共有モーダル（Share Modal）
                </a>
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>One switch: the public link, on or off.</strong> The article builds its core around permission levels (viewer, editor, commenter) and email invitations. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ShareModal</code> carries none of that. It handles whether anyone with the link can view, plus copying and opening that URL. Who may do what is the permission model of the application itself, and a component cannot decide it.
            </li>
            <li>
                <strong>Copy success is shown for two seconds and nothing longer.</strong> The article asks for a two-second confirmation. GUNJO matches it: the icon becomes a check and the tooltip text swaps to the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">copied</code> label at the same time, with a fallback path for environments where the clipboard API is unavailable. The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-live</code> announcement the article requires is not implemented yet.
            </li>
            <li>
                <strong>Focus trapping and Escape are missing.</strong> The modal closes on a backdrop click or the close button, and it carries the dialog role, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-modal</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code>. The Tab cage and the Escape key that the article treats as required are absent, and this is a real gap against the article. For an interaction that needs the cage, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Sheet</code> or <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Dialog</code> is the safer choice today.
                <br />
                <a
                    className="underline underline-offset-4"
                    href="https://www.uixhero.com/resources/ui-components/share-modal"
                    target="_blank"
                    rel="noreferrer"
                >
                    UIXHERO: Share Modal (in Japanese)
                </a>
            </li>
        </>
    ),
};

export default function ShareModalDocPage() {
    return (
        <OverlayAuditDocPage
            kind="share-modal"
            title={overlayMetadata.shareModal.title}
            description={overlayMetadata.shareModal.description}
            designDecisions={designDecisions}
        />
    );
}
