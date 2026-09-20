// /patterns の面のクロームは pathname と router を読むのでクライアント側
// （PatternsChrome）。この layout はサーバー部品のまま残し、クロームは子として描く。
//
// 構造化データ（JSON-LD）はここからは出さない＝この layout は `/patterns/**` の
// 全ページを囲むので、索引のぶんだけを出す場所にはならない（下の各画面にも
// 「これは /patterns だ」という node が付いてしまう）。索引のぶんは
// `app/patterns/(index)/layout.tsx`、各画面のぶんはルートごとの生成 layout
// （`npm run design:sync:seo-layouts`）が出す。
//
// metadata も同じ理由でここからは出さない。出すと `/patterns/auth` のような
// 子ページが「canonical は /patterns」という頭を持ってしまう（1段目のあと
// 実際にそうなっていた）。子ページは自分の layout で自分の分を出す。
import { PatternsChrome } from "./PatternsChrome";

export default function PatternsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PatternsChrome>{children}</PatternsChrome>;
}
