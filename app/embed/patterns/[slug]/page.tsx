import { notFound } from "next/navigation";
import AuthPattern from "@/patterns/auth/login/page";
import DashboardPattern from "@/patterns/dashboard/overview/page";
import EditorPattern from "@/patterns/editor/page";
import KanbanPattern from "@/patterns/kanban/page";
import ChatPattern from "@/patterns/chat/page";
import LandingPattern from "@/patterns/landing/page";
import BannalyzePattern from "@/patterns/bannalyze/page";
import MediaLibraryPattern from "@/patterns/media-library/page";
import NotFoundPattern from "@/patterns/not-found/page";
import { isPublicPatternSlug, SHOW_ALL_PATTERNS } from "@/lib/patterns";

const PATTERNS_BY_SLUG: Record<string, React.ComponentType> = {
    auth: AuthPattern,
    dashboard: DashboardPattern,
    editor: EditorPattern,
    kanban: KanbanPattern,
    chat: ChatPattern,
    landing: LandingPattern,
    bannalyze: BannalyzePattern,
    "media-library": MediaLibraryPattern,
    "not-found": NotFoundPattern,
};

export function generateStaticParams() {
    return Object.keys(PATTERNS_BY_SLUG)
        .filter((slug) => SHOW_ALL_PATTERNS || isPublicPatternSlug(slug))
        .map((slug) => ({ slug }));
}

export default async function PatternEmbedPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    if (!SHOW_ALL_PATTERNS && !isPublicPatternSlug(slug)) notFound();
    const Pattern = PATTERNS_BY_SLUG[slug];
    if (!Pattern) notFound();
    return <Pattern />;
}
