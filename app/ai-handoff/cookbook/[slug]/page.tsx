import { redirect } from "next/navigation";

export default async function AiHandoffCookbookRecipeRedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    redirect(`/docs/ai-handoff/cookbook/${slug}`);
}
