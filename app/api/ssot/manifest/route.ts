import { NextResponse } from "next/server";
import { SSOT_FILES } from "@/lib/ssot-files";
import { statSsotFile } from "@/lib/ssot-files-server";

export async function GET() {
    const repoRoot = process.cwd();
    const files = SSOT_FILES.map((file) => statSsotFile(file, repoRoot));

    return NextResponse.json(
        {
            generatedAt: new Date().toISOString(),
            count: files.length,
            files,
        },
        { headers: { "Cache-Control": "public, max-age=300" } }
    );
}
