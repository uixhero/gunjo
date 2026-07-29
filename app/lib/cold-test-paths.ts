// Client-safe path helpers for the cold-test routes. Kept apart from
// `cold-test-en.ts`, which reads the filesystem and must stay server-only.

export const JA_COLD_TEST_BASE = "/cold-tests";
export const EN_COLD_TEST_BASE = "/en/cold-tests";

/**
 * Which cold-test tree a pathname belongs to. Shared components (the rounds
 * sidebar, the detail view) use this to keep their internal links inside the
 * language the reader is already in.
 */
export function coldTestBaseFor(pathname: string | null | undefined): string {
    return pathname?.startsWith(EN_COLD_TEST_BASE) ? EN_COLD_TEST_BASE : JA_COLD_TEST_BASE;
}

/** True on any route under `/en`. */
export function isEnRoute(pathname: string | null | undefined): boolean {
    return pathname === "/en" || Boolean(pathname?.startsWith("/en/"));
}

/** `/en/cold-tests/178` -> `/cold-tests/178`. */
export function jaEquivalentPath(pathname: string): string {
    return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}
