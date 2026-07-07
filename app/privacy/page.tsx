import type { Metadata } from "next";
import Link from "next/link";

// Privacy policy. Written primarily to cover the /pack pre-registration form
// (email + minimal survey, stored/sent via Brevo). Intentionally short and
// plain. Operator: 4px合同会社 (4px LLC). (#555, TASK-7)
//
// NOTE(KeEem): if you want a dedicated contact email on this page, add it in
// the「お問い合わせ」section; it currently routes to the uixhero.com contact
// window rather than inventing an address.

export const metadata: Metadata = {
    title: "プライバシーポリシー — GunjoUI",
    description:
        "GunjoUI（gunjo.jp）における個人情報の取り扱いについて。運営者は4px合同会社。",
};

export default function PrivacyPage() {
    return (
        <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
            <article className="space-y-8">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        プライバシーポリシー
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        最終更新：2026年7月
                    </p>
                </header>

                <p className="leading-relaxed text-muted-foreground">
                    4px合同会社（以下「当社」）は、GunjoUI（gunjo.jp、以下「本サイト」）における個人情報の取り扱いについて、以下のとおり定めます。本ポリシーは主に、本サイトの先行登録フォーム（
                    <Link
                        href="/pack"
                        className="underline underline-offset-4 hover:text-foreground"
                    >
                        /pack
                    </Link>
                    ）でお預かりする情報を対象とします。
                </p>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">1. 取得する情報</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        先行登録フォームでは、メールアドレスと、任意でお答えいただくアンケート（業界・目的・役割・いま困っていること）を取得します。それ以外に、本サイトの利用状況を把握するためのアクセス解析情報を取得することがあります（下記5.）。
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">2. 利用目的</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        取得した情報は、次の目的にのみ利用します。
                    </p>
                    <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                        <li>「AI指示書パック」のお届け</li>
                        <li>新しいパック・新機能・関連サービスに関するお知らせの配信</li>
                        <li>いただいたご回答をもとにした、提供内容の改善</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">3. 外部サービスの利用</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        メールアドレスの管理とメールの配信には、メール配信サービス「Brevo」（Sendinblue SAS、フランス）を利用します。この目的の範囲で、お預かりした情報を同サービスに保管・処理します。当社は、上記の利用目的以外で個人情報を第三者に提供・販売することはありません。
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">4. 配信停止・削除</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        メールの配信は、配信メール内の配信停止リンクからいつでも解除できます。登録情報の削除をご希望の場合は、下記のお問い合わせ窓口までご連絡ください。
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">5. アクセス解析</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        本サイトでは、利用状況の把握のためにアクセス解析ツール（Vercel Analytics、Google Analytics 等）を利用することがあります。これらは個人を特定しない形で統計的に利用されます。
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">6. お問い合わせ</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        本ポリシーおよび個人情報の取り扱いに関するお問い合わせは、運営者ウェブサイト{" "}
                        <a
                            href="https://www.uixhero.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            uixhero.com
                        </a>{" "}
                        のお問い合わせ窓口までご連絡ください。
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">7. 改定</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        当社は、必要に応じて本ポリシーを改定することがあります。重要な変更がある場合は、本サイト上でお知らせします。
                    </p>
                </section>

                <footer className="border-t border-border/60 pt-4 text-sm text-muted-foreground">
                    運営者：4px合同会社（4px LLC）
                </footer>
            </article>
        </div>
    );
}
