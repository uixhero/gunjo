import { NextResponse } from "next/server";
import {
    buildComponentSpec,
    type Category,
} from "@/lib/component-spec-builder";

const VALID_CATEGORIES: Category[] = [
    "inputs",
    "display",
    "feedback",
    "navigation",
    "overlay",
    "layout",
    "patterns",
];

function kebabToCamel(slug: string): string {
    return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ category: string; name: string }> }
) {
    const { category, name } = await params;
    if (!VALID_CATEGORIES.includes(category as Category)) {
        return NextResponse.json(
            { error: "Unknown category" },
            { status: 404 }
        );
    }
    const spec = buildComponentSpec(category as Category, kebabToCamel(name));
    if (!spec) {
        return NextResponse.json(
            { error: "Component not found" },
            { status: 404 }
        );
    }
    return NextResponse.json(spec, {
        headers: { "Cache-Control": "public, max-age=3600" },
    });
}
