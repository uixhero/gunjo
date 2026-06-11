import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getSsotFileByName } from "@/lib/ssot-files";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ file: string }> }
) {
    const { file } = await params;
    const entry = getSsotFileByName(file);
    if (!entry) {
        return NextResponse.json(
            { error: "Unknown SSOT file" },
            { status: 404 }
        );
    }

    const absolutePath = join(process.cwd(), entry.relativePath);
    let buffer: Buffer;
    try {
        buffer = await readFile(absolutePath);
    } catch {
        return NextResponse.json(
            { error: "SSOT file missing on disk" },
            { status: 500 }
        );
    }

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            "Content-Type": entry.contentType,
            "Content-Disposition": `attachment; filename="${entry.fileName}"`,
            "Cache-Control": "public, max-age=300",
        },
    });
}
