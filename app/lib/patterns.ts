export type PatternFamilyKey = "core" | "analytics" | "industry" | "marketing";
export type PatternSurfaceKey =
    | "flow"
    | "dashboard"
    | "workspace"
    | "board"
    | "messaging"
    | "site"
    | "analysis"
    | "asset-management";
export type PatternIndustryKey =
    | "general"
    | "operations"
    | "creative"
    | "media"
    | "commerce"
    | "marketing";
export type PatternComplexityKey = "focused" | "multi-page" | "data-dense";

export interface PatternEntry {
    slug: string;
    title: string;
    description: string;
    family: PatternFamilyKey;
    surface: PatternSurfaceKey;
    industry: PatternIndustryKey;
    complexity: PatternComplexityKey;
    routes: PatternRouteEntry[];
}

export interface PatternRouteEntry {
    label: string;
    labelJa: string;
    href: string;
}

export type PlannedIndustryPatternKey =
    | "finance-wallet"
    | "commerce-sales"
    | "health-wellness"
    | "public-safety"
    | "creator-commerce";

export interface PlannedIndustryPattern {
    key: PlannedIndustryPatternKey;
    family: "industry";
    surface: PatternSurfaceKey;
    industry: PatternIndustryKey;
}

export const PUBLIC_PATTERN_SLUGS = ["auth", "dashboard", "kanban", "media-library", "not-found"] as const;
export type PublicPatternSlug = (typeof PUBLIC_PATTERN_SLUGS)[number];
export const SHOW_ALL_PATTERNS = process.env.NODE_ENV !== "production";

export function isPublicPatternSlug(slug: string): slug is PublicPatternSlug {
    return PUBLIC_PATTERN_SLUGS.includes(slug as PublicPatternSlug);
}

export const PATTERN_FAMILY_ORDER: PatternFamilyKey[] = [
    "core",
    "analytics",
    "industry",
    "marketing",
];

export const PATTERNS: PatternEntry[] = [
    {
        slug: "auth",
        title: "Auth",
        description: "Multi-page sign-in, sign-up, reset, and account flow.",
        family: "core",
        surface: "flow",
        industry: "general",
        complexity: "multi-page",
        routes: [
            { label: "Login", labelJa: "ログイン", href: "/patterns/auth/login" },
            { label: "Sign up", labelJa: "登録", href: "/patterns/auth/signup" },
            { label: "Reset", labelJa: "リセット", href: "/patterns/auth/forgot-password" },
            { label: "Account", labelJa: "アカウント", href: "/patterns/auth/account" },
        ],
    },
    {
        slug: "dashboard",
        title: "Dashboard",
        description: "Operations dashboard example with overview, projects, and settings routes.",
        family: "analytics",
        surface: "dashboard",
        industry: "operations",
        complexity: "data-dense",
        routes: [
            { label: "Overview", labelJa: "概要", href: "/patterns/dashboard/overview" },
            { label: "Projects", labelJa: "プロジェクト", href: "/patterns/dashboard/projects" },
            { label: "Settings", labelJa: "設定", href: "/patterns/dashboard/settings" },
        ],
    },
    {
        slug: "editor",
        title: "Editor",
        description: "Document editor with sidebar tree and preview pane.",
        family: "core",
        surface: "workspace",
        industry: "creative",
        complexity: "focused",
        routes: [
            { label: "Workspace", labelJa: "作業画面", href: "/patterns/editor" },
        ],
    },
    {
        slug: "kanban",
        title: "Kanban",
        description: "Responsive kanban layout shell for columns, cards, and dnd-kit wiring.",
        family: "core",
        surface: "board",
        industry: "operations",
        complexity: "focused",
        routes: [
            { label: "Board", labelJa: "ボード", href: "/patterns/kanban" },
        ],
    },
    {
        slug: "chat",
        title: "Chat App",
        description: "Conversation list, message stream, and composer.",
        family: "core",
        surface: "messaging",
        industry: "general",
        complexity: "focused",
        routes: [
            { label: "Channels", labelJa: "チャンネル", href: "/patterns/chat" },
        ],
    },
    {
        slug: "landing",
        title: "Landing Page",
        description: "Marketing hero, feature grid, pricing, and CTA.",
        family: "marketing",
        surface: "site",
        industry: "marketing",
        complexity: "focused",
        routes: [
            { label: "Landing", labelJa: "ランディング", href: "/patterns/landing" },
        ],
    },
    {
        slug: "bannalyze",
        title: "Bannalyze",
        description: "Banner Review's analyzer surface — data-dense workflow tool.",
        family: "industry",
        surface: "analysis",
        industry: "creative",
        complexity: "data-dense",
        routes: [
            { label: "Analyzer", labelJa: "分析画面", href: "/patterns/bannalyze" },
        ],
    },
    {
        slug: "media-library",
        title: "Media Library",
        description: "Asset grid with folder sidebar and detail inspector.",
        family: "industry",
        surface: "asset-management",
        industry: "media",
        complexity: "data-dense",
        routes: [
            { label: "Library", labelJa: "ライブラリ", href: "/patterns/media-library" },
        ],
    },
    {
        slug: "not-found",
        title: "Not Found",
        description: "404 error screen with recovery actions, built on StatusScreen.",
        family: "core",
        surface: "site",
        industry: "general",
        complexity: "focused",
        routes: [
            { label: "404", labelJa: "404", href: "/patterns/not-found" },
        ],
    },
];

export const VISIBLE_PATTERNS: PatternEntry[] = SHOW_ALL_PATTERNS
    ? PATTERNS
    : PATTERNS.filter((pattern) => isPublicPatternSlug(pattern.slug));

export const PLANNED_INDUSTRY_PATTERNS: PlannedIndustryPattern[] = [
    {
        key: "finance-wallet",
        family: "industry",
        surface: "dashboard",
        industry: "commerce",
    },
    {
        key: "commerce-sales",
        family: "industry",
        surface: "dashboard",
        industry: "commerce",
    },
    {
        key: "health-wellness",
        family: "industry",
        surface: "dashboard",
        industry: "operations",
    },
    {
        key: "public-safety",
        family: "industry",
        surface: "dashboard",
        industry: "operations",
    },
    {
        key: "creator-commerce",
        family: "industry",
        surface: "analysis",
        industry: "creative",
    },
];
