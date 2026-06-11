import { NextResponse } from "next/server";
import { buildAllSpecs } from "@/lib/component-spec-builder";

export async function GET() {
    const specs = buildAllSpecs();
    return NextResponse.json(
        {
            count: specs.length,
            generatedAt: new Date().toISOString(),
            specs,
        },
        { headers: { "Cache-Control": "public, max-age=3600" } }
    );
}
