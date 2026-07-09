import type { Metadata } from "next";
import coldTestCategories from "@/data/cold-test-categories.json";
import coldTestGallery from "@/data/cold-test-gallery.json";
import type { IndustryOption } from "@/lib/pack";
import { PackForm } from "./PackForm";

// AI-instruction-pack pre-registration landing (/pack). The pack itself ships
// in August; this page collects email + a minimal survey so early registrants
// get it first. Backend is Brevo via /api/pack/subscribe. (#555, TASK-7)

export const metadata: Metadata = {
    title: "AI指示書パック 先行登録 — GunjoUI",
    description:
        "業界別「AI指示書パック」を準備中です。あなたのAIに渡せば @gunjo/ui でその業界の画面が組める指示書。欲しい業界を教えてください。できあがったら最初にお送りします。",
};

interface PublishedCategory {
    slug: string;
    jaCategory: string;
}

export default function PackPage() {
    // Industry options come straight from the cold-test category SSOT (the 20
    // published categories) so they can't drift; the large JSON stays on the
    // server and only this small array crosses to the client.
    const industries: IndustryOption[] = (
        coldTestCategories as { published: PublishedCategory[] }
    ).published.map((c) => ({ value: c.slug, label: c.jaCategory }));

    const coldTestCount = (coldTestGallery as { count: number }).count;

    return <PackForm industries={industries} coldTestCount={coldTestCount} />;
}
