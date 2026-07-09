/**
 * Shared types + option sets for the AI-instruction-pack pre-registration form
 * (/pack) and its Brevo-backed submit route (/api/pack/subscribe). (#555)
 *
 * The industry list is NOT here — it's derived from the cold-test category SSOT
 * (data/cold-test-categories.json `published[]`) in the server page and passed
 * to the client form, so it can't drift from the 20 published categories and
 * the (large) JSON never enters the client bundle.
 */

export interface IndustryOption {
    /** Cold-test category slug (stable) — stored as the Brevo attribute value. */
    value: string;
    /** Japanese category label shown in the select. */
    label: string;
}

/** 目的（必須）— purpose. `find_vendor` marks a sales lead (see注意 in TASK-7). */
export const PURPOSE_OPTIONS = [
    { value: "build_self", label: "自分（自社）で作りたい" },
    { value: "research", label: "情報収集・興味" },
    { value: "find_vendor", label: "作れる人・発注先を探している" },
] as const;

/** The purpose value that identifies a sales lead — kept as a named constant so
 * the "must be distinguishable in stored data" requirement is explicit. */
export const LEAD_PURPOSE = "find_vendor";

/** 役割（必須）— role. */
export const ROLE_OPTIONS = [
    { value: "engineer", label: "エンジニア" },
    { value: "designer", label: "デザイナー" },
    { value: "pm_business", label: "PM・事業側" },
    { value: "other", label: "その他" },
] as const;

export type PurposeValue = (typeof PURPOSE_OPTIONS)[number]["value"];
export type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

/** Payload the client form POSTs to /api/pack/subscribe. */
export interface PackSubscribePayload {
    email: string;
    /** Cold-test category slug, or "other". */
    industry: string;
    /** Free-text industry when `industry === "other"`. */
    industryOther?: string;
    purpose: PurposeValue;
    role: RoleValue;
    /** 任意 — いま困っていること. */
    trouble?: string;
}

export const PURPOSE_VALUES = PURPOSE_OPTIONS.map((o) => o.value) as string[];
export const ROLE_VALUES = ROLE_OPTIONS.map((o) => o.value) as string[];

/** Minimal, dependency-free email sanity check (real validation is Brevo's). */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
