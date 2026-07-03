/**
 * パターン ⇄ コールドテスト実戦例の対応表（KeEem 裁定 2026-07-03・issue #480）。
 * 裏付けリンクの単一の源 — ページ側にラウンド番号をハードコードしない。
 * 対応が薄いパターン（media-library / not-found）は意図的に載せていない
 * （無理に張らない原則）。追加はこのファイルに1行足すだけ。
 */
export interface ColdTestRef {
    round: number;
    ja: string;
    en: string;
}

export const PATTERN_COLD_TESTS: Record<string, ColdTestRef[]> = {
    dashboard: [{ round: 4, ja: "ダッシュボード", en: "Dashboard" }],
    auth: [{ round: 5, ja: "ログイン/サインアップ", en: "Login / signup" }],
    chat: [{ round: 12, ja: "チャット", en: "Chat" }],
    kanban: [{ round: 9, ja: "カンバン (DnD)", en: "Kanban (DnD)" }],
    landing: [{ round: 22, ja: "ランディング", en: "Landing page" }],
    editor: [{ round: 16, ja: "IDE風エディタ", en: "IDE-style editor" }],
    bannalyze: [
        { round: 98, ja: "飲食売上分析", en: "Restaurant sales analytics" },
        { round: 143, ja: "タクシー営収", en: "Taxi revenue" },
    ],
};

export function coldTestHref(round: number): string {
    return `/cold-tests/${round}`;
}
