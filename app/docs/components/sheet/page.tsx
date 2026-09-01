import { OverlayAuditDocPage } from "../_overlayAuditDocPage";
import overlayMetadata from "@design/overlay-metadata.json";
import { UIXHERO_BASE_URL, type UixheroLink } from "@/lib/uixhero-links";

const designDecisions = {
    ja: (
        <>
            <li>
                <strong>既定は右から出る。</strong>資料は「PCでは左をグローバルメニュー、右を詳細やヘルプやフィルターに使うのが今の標準」と書いています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SheetContent</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">side</code> の既定を右にしました。幅（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code>）が効くのも左右のときだけで、上下のときは指定を無視します。上下は画面幅いっぱいに出るものなので、指定できるように見えることのほうが間違いのもとだからです。
            </li>
            <li>
                <strong>スクロールは頼まれたときだけ組み替える。</strong>資料は「上から下まで大きく使えるのでスクロールに強い」を挙げています。GUNJO は子に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SheetBody</code> を置いたときだけ、中身を「動かない見出し・伸びる本文・動かない脚」の縦並びに変えます（#293）。置かない従来の書き方は、これまでと1文字も変わらない描画のままです。
            </li>
            <li>
                <strong>閉じる手段と読み上げは土台に任せた。</strong>Escape と外側のクリックとフォーカスの囲い込みは Radix の Dialog が持ちます。右上の閉じるボタンの名前は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">closeLabel</code> で渡せて、渡さなければ表示中の言語の既定語になります。資料が挙げるスマホでの下方向のスワイプで閉じる操作は入っていません。
            </li>
        </>
    ),
    en: (
        <>
            <li>
                <strong>Right is the default side.</strong> The article describes the current convention: on desktop the left drawer is global navigation and the right one is detail, help or filters. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SheetContent</code> defaults <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">side</code> to right. Width (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">size</code>) applies only to left and right; for top and bottom it is ignored, because those span the full width anyway and an option that looks settable but is not causes more mistakes than it prevents.
            </li>
            <li>
                <strong>The scroll layout is rearranged only on request.</strong> The article notes that a sheet tolerates long content well because it can use the full height. GUNJO switches the content into a fixed-header, flexible-body, fixed-footer column only when a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SheetBody</code> is present (#293). Sheets written the older way render byte for byte as before.
            </li>
            <li>
                <strong>Dismissal and announcement come from the primitive.</strong> Escape, outside click and the focus cage are handled by the Radix Dialog. The close button name is <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">closeLabel</code>, falling back to the default word for the current language. Swipe-down-to-close on mobile, which the article mentions, is not implemented.
            </li>
        </>
    ),
};

// 本文からこの節へ移した UIXHERO の記事リンク（gunjo #955 の受け口）。
const uixheroLinks: Record<"ja" | "en", UixheroLink[]> = {
    ja: [
        {
            label: "UIXHERO: シート（Sheet）",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/sheet`,
        },
    ],
    en: [
        {
            label: "UIXHERO: Sheet (in Japanese)",
            href: `${UIXHERO_BASE_URL}/resources/ui-components/sheet`,
        },
    ],
};

export default function SheetDocPage() {
    return (
        <OverlayAuditDocPage
            kind="sheet"
            title={overlayMetadata.sheet.title}
            description={overlayMetadata.sheet.description}
            designDecisions={designDecisions}
            uixheroLinks={uixheroLinks}
        />
    );
}
