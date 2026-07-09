import type { Metadata } from "next";
import { PrivacyPolicyBody } from "./PrivacyContent";

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
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        プライバシーポリシー
                    </h1>
                </header>
                <PrivacyPolicyBody />
            </article>
        </div>
    );
}
