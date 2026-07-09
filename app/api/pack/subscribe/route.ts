import { NextResponse } from "next/server";
import {
    isValidEmail,
    PURPOSE_VALUES,
    ROLE_VALUES,
    type PackSubscribePayload,
} from "@/lib/pack";

// Pre-registration submit for the AI-instruction-pack (/pack). Backend is Brevo
// (TASK-7 案A): we create/update the contact via Brevo's Contacts API and add it
// to a list. List management, unsubscribe, and CSV export live in Brevo. (#555)
//
// Required env (KeEem sets in Vercel — secrets, server-only):
//   BREVO_API_KEY   Brevo API v3 key
//   BREVO_LIST_ID   numeric id of the target contact list
//
// Custom contact attributes must exist in Brevo first (KeEem creates them):
//   INDUSTRY (text), PURPOSE (text), ROLE (text), TROUBLE (text)
// PURPOSE = "find_vendor" marks a sales lead — filter on it for the 9/30 KPI.

export const runtime = "nodejs";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/contacts";

interface BrevoErrorBody {
    code?: string;
    message?: string;
}

export async function POST(request: Request) {
    const apiKey = process.env.BREVO_API_KEY;
    const listIdRaw = process.env.BREVO_LIST_ID;

    if (!apiKey || !listIdRaw) {
        // Not yet configured (e.g. before KeEem adds the env). Fail clearly
        // rather than pretending success, so a broken deploy is obvious.
        return NextResponse.json(
            { error: "not_configured" },
            { status: 503 }
        );
    }
    const listId = Number(listIdRaw);
    if (!Number.isInteger(listId)) {
        return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    let body: Partial<PackSubscribePayload>;
    try {
        body = (await request.json()) as Partial<PackSubscribePayload>;
    } catch {
        return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const industry = typeof body.industry === "string" ? body.industry : "";
    const industryOther =
        typeof body.industryOther === "string" ? body.industryOther.trim() : "";
    const purpose = typeof body.purpose === "string" ? body.purpose : "";
    const role = typeof body.role === "string" ? body.role : "";
    const trouble =
        typeof body.trouble === "string" ? body.trouble.trim() : "";

    // Validate the three required questions + email. Keep messages generic;
    // the client already guards these, this is the server backstop.
    if (!isValidEmail(email)) {
        return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (!industry || (industry === "other" && !industryOther)) {
        return NextResponse.json({ error: "invalid_industry" }, { status: 400 });
    }
    if (!PURPOSE_VALUES.includes(purpose)) {
        return NextResponse.json({ error: "invalid_purpose" }, { status: 400 });
    }
    if (!ROLE_VALUES.includes(role)) {
        return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    const industryValue = industry === "other" ? `other:${industryOther}` : industry;

    const res = await fetch(BREVO_ENDPOINT, {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            email,
            attributes: {
                INDUSTRY: industryValue,
                PURPOSE: purpose,
                ROLE: role,
                TROUBLE: trouble || undefined,
            },
            listIds: [listId],
            // Re-submitting the same email updates the contact instead of 400ing.
            updateEnabled: true,
        }),
    });

    if (res.ok) {
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Brevo returns 400 "duplicate_parameter" when the contact already exists
    // and updateEnabled somehow didn't apply — treat an existing contact as a
    // success from the visitor's point of view (they're on the list either way).
    let errBody: BrevoErrorBody = {};
    try {
        errBody = (await res.json()) as BrevoErrorBody;
    } catch {
        /* non-JSON error body */
    }
    if (errBody.code === "duplicate_parameter") {
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    console.error("[pack/subscribe] Brevo error", res.status, errBody);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
}
