"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    IconAdjustmentsHorizontal as SlidersHorizontal,
    IconBell as Bell,
    IconBriefcase2 as BriefcaseBusiness,
    IconCircleCheck as CheckCircle2,
    IconCreditCard as CreditCard,
    IconDots as MoreHorizontal,
    IconFilter as Filter,
    IconLayoutDashboard as LayoutDashboard,
    IconMenu2 as Menu,
    IconPlus as Plus,
    IconSettings as Settings,
    IconShieldCheck as ShieldCheck,
    IconSparkles as Sparkles,
    IconTrendingUp as TrendingUp,
    IconUsers as Users,
} from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    AnalyticsCard,
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    DashboardTemplate,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    HeatmapChart,
    Input,
    LabeledDonutCard,
    MiniDistributionBarCard,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Progress,
    SearchInput,
    Select,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SidebarItem,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipButton,
    TooltipContent,
    TooltipTrigger,
    Toast,
    cn,
} from "@gunjo/ui";
import {
    MARQUEE_VIEWPORT_SIZES,
    MarqueeChrome,
    type MarqueeViewport,
} from "../../_lib/MarqueeChrome";

export type DashboardPage = "overview" | "projects" | "settings";
type DashboardNavigate = (route: string) => void;

type ProjectStatus = "on-track" | "review" | "blocked" | "at-risk";

interface DashboardProject {
    id: string;
    name: string;
    nameJa: string;
    owner: string;
    status: ProjectStatus;
    progress: number;
    updated: string;
    updatedJa: string;
    due: string;
    dueJa: string;
    budget: string;
    tasks: number;
}

interface DashboardSettingsState {
    workspaceName: string;
    region: string;
    plan: string;
    seats: string;
    auditEnabled: boolean;
    inviteEnabled: boolean;
}

interface DashboardNotice {
    id: string;
    title: string;
    titleJa: string;
    body: string;
    bodyJa: string;
    time: string;
    timeJa: string;
    unread: boolean;
    route?: string;
}

interface DashboardToastState {
    message: string;
    type: "success" | "info";
}

const DASHBOARD_PATHS = ["/overview", "/projects", "/settings"];

const STORAGE_KEY = "gunjo:patterns:dashboard:v2";

const ROUTES: {
    id: DashboardPage;
    href: string;
    Icon: typeof LayoutDashboard;
}[] = [
    { id: "overview", href: "/patterns/dashboard/overview", Icon: LayoutDashboard },
    { id: "projects", href: "/patterns/dashboard/projects", Icon: BriefcaseBusiness },
    { id: "settings", href: "/patterns/dashboard/settings", Icon: Settings },
];

const INITIAL_PROJECTS: DashboardProject[] = [
    {
        id: "website-launch",
        name: "Website launch",
        nameJa: "Webサイト公開",
        owner: "Mika",
        status: "on-track",
        progress: 72,
        updated: "Today",
        updatedJa: "今日",
        due: "May 14",
        dueJa: "5月14日",
        budget: "$48K",
        tasks: 18,
    },
    {
        id: "billing-migration",
        name: "Billing migration",
        nameJa: "請求移行",
        owner: "Ken",
        status: "review",
        progress: 54,
        updated: "Yesterday",
        updatedJa: "昨日",
        due: "May 20",
        dueJa: "5月20日",
        budget: "$32K",
        tasks: 11,
    },
    {
        id: "csv-import",
        name: "CSV import",
        nameJa: "CSVインポート",
        owner: "Sara",
        status: "blocked",
        progress: 31,
        updated: "Fri",
        updatedJa: "金曜",
        due: "May 23",
        dueJa: "5月23日",
        budget: "$18K",
        tasks: 7,
    },
    {
        id: "mobile-checklist",
        name: "Mobile checklist",
        nameJa: "モバイル確認",
        owner: "Aoi",
        status: "on-track",
        progress: 86,
        updated: "Thu",
        updatedJa: "木曜",
        due: "May 12",
        dueJa: "5月12日",
        budget: "$21K",
        tasks: 5,
    },
    {
        id: "enterprise-import",
        name: "Enterprise import",
        nameJa: "エンタープライズ取込",
        owner: "Riku",
        status: "at-risk",
        progress: 45,
        updated: "Wed",
        updatedJa: "水曜",
        due: "May 28",
        dueJa: "5月28日",
        budget: "$56K",
        tasks: 14,
    },
];

const DEFAULT_SETTINGS: DashboardSettingsState = {
    workspaceName: "GunjoUI",
    region: "tokyo",
    plan: "Pro",
    seats: "18 / 24",
    auditEnabled: true,
    inviteEnabled: false,
};

const INITIAL_NOTICES: DashboardNotice[] = [
    {
        id: "plan-approved",
        title: "Enterprise plan approved",
        titleJa: "エンタープライズプランを承認",
        body: "Mika moved the opportunity to committed.",
        bodyJa: "Mika が商談を確定に移動しました。",
        time: "2 min ago",
        timeJa: "2分前",
        unread: true,
        route: "/patterns/dashboard/projects?project=website-launch",
    },
    {
        id: "qa-ready",
        title: "Release checklist is ready",
        titleJa: "リリースチェックリストが準備完了",
        body: "QA can start on the next build.",
        bodyJa: "次のビルドで QA を開始できます。",
        time: "18 min ago",
        timeJa: "18分前",
        unread: true,
        route: "/patterns/dashboard/overview",
    },
    {
        id: "import-finished",
        title: "Import job finished",
        titleJa: "インポートジョブが完了",
        body: "24,800 rows were normalized successfully.",
        bodyJa: "24,800 行の正規化が完了しました。",
        time: "42 min ago",
        timeJa: "42分前",
        unread: false,
        route: "/patterns/dashboard/projects?project=csv-import",
    },
];

const COPY = {
    en: {
        workspace: "Operations",
        menu: "Open navigation",
        notifications: "Notifications",
        more: "More actions",
        search: "Search workspace",
        searchResults: "Search results",
        noResults: "No matching projects",
        nav: {
            label: "Dashboard navigation",
            overview: "Overview",
            projects: "Projects",
            settings: "Settings",
        },
        sidebar: {
            section: "Workspace",
            team: "Growth team",
            plan: "Pro workspace",
            reset: "Reset demo data",
        },
        status: {
            "on-track": "On track",
            review: "Review",
            blocked: "Blocked",
            "at-risk": "At risk",
        },
        overview: {
            eyebrow: "Today",
            title: "Overview",
            description:
                "Pipeline health, launch work, revenue targets, and operational risk in one workspace.",
            primary: "Primary metric",
            chart: "Activation trend",
            chartDescription: "Signup funnel movement",
            activity: "Recent activity",
            pipeline: "Pipeline forecast",
            pipelineDescription: "Current funnel mix",
            funnelLabels: ["Visitors", "Trials", "Qualified", "Won"],
            activationLabels: ["Visit", "Signup", "Invite", "Launch"],
            heatmap: "Team capacity",
            heatmapDescription: "Incidents by day and time band",
            peak: "Peak",
            total: "Total",
            projectHealth: "Project health",
            checklist: "Launch checklist",
            capacity: "Team capacity",
            stats: {
                revenue: "Revenue",
                trials: "Trial accounts",
                conversion: "Conversion",
                risk: "Open risks",
            },
            checklistItems: [
                "Review blocked import fields",
                "Confirm billing migration owners",
                "Ship mobile checklist update",
            ],
        },
        projects: {
            title: "Projects",
            description:
                "Create work, filter launch activity, open a row, and keep the detail panel in context.",
            filter: "Filter projects",
            filterButton: "Filter",
            newProject: "New project",
            addTitle: "Create project",
            addDescription: "Add a sample project to this dashboard session.",
            placeholder: "Partner rollout",
            create: "Create project",
            createDisabledReason: "Enter a project name before creating it.",
            cancel: "Cancel",
            clearFilters: "Clear filters",
            name: "Project name",
            owner: "Owner",
            status: "Status",
            columns: {
                project: "Project",
                owner: "Owner",
                status: "Status",
                progress: "Progress",
                due: "Due",
                budget: "Budget",
            },
            detail: "Project detail",
            nextStep: "Next step",
            nextStepBody: "Review the rollout checklist before the next release window.",
            created: (name: string) => `${name} was added.`,
            statusUpdated: (name: string, status: string) =>
                `${name} moved to ${status}.`,
            actions: {
                title: "Project actions",
                track: "Mark on track",
                review: "Send to review",
                block: "Block project",
            },
        },
        settings: {
            title: "Settings",
            description: "Account, billing, and team controls use the same dashboard shell.",
            tabs: {
                account: "Account",
                billing: "Billing",
                team: "Team",
            },
            accountTitle: "Account profile",
            billingTitle: "Billing plan",
            teamTitle: "Team access",
            name: "Workspace name",
            region: "Region",
            plan: "Plan",
            seats: "Seats",
            audit: "Audit log",
            invite: "Invite members",
            save: "Save changes",
            saved: "Settings saved.",
            updated: "Last saved just now",
        },
        account: {
            menu: "Account menu",
            profile: "Profile settings",
            projects: "Project list",
            reset: "Reset demo data",
            resetDone: "Demo data reset.",
        },
        notification: {
            markRead: "Mark all read",
            none: "No new notifications",
        },
    },
    ja: {
        workspace: "運用",
        menu: "ナビゲーションを開く",
        notifications: "通知",
        more: "その他の操作",
        search: "ワークスペースを検索",
        searchResults: "検索結果",
        noResults: "一致するプロジェクトはありません",
        nav: {
            label: "ダッシュボードナビゲーション",
            overview: "概要",
            projects: "プロジェクト",
            settings: "設定",
        },
        sidebar: {
            section: "ワークスペース",
            team: "グロースチーム",
            plan: "Pro ワークスペース",
            reset: "デモデータをリセット",
        },
        status: {
            "on-track": "順調",
            review: "レビュー",
            blocked: "ブロック",
            "at-risk": "注意",
        },
        overview: {
            eyebrow: "今日",
            title: "概要",
            description:
                "パイプライン、ローンチ作業、売上目標、運用リスクをひとつのワークスペースで確認します。",
            primary: "主要指標",
            chart: "アクティベーション推移",
            chartDescription: "登録ファネルの動き",
            activity: "最近のアクティビティ",
            pipeline: "パイプライン予測",
            pipelineDescription: "現在のファネル構成",
            funnelLabels: ["訪問", "トライアル", "有望", "成約"],
            activationLabels: ["訪問", "登録", "招待", "開始"],
            heatmap: "チーム稼働",
            heatmapDescription: "曜日・時間帯別のインシデント",
            peak: "ピーク",
            total: "合計",
            projectHealth: "プロジェクト状況",
            checklist: "ローンチチェックリスト",
            capacity: "チーム稼働",
            stats: {
                revenue: "売上",
                trials: "トライアル",
                conversion: "転換率",
                risk: "未解決リスク",
            },
            checklistItems: [
                "ブロック中の取込フィールドを確認",
                "請求移行の担当者を確定",
                "モバイル確認の更新を出す",
            ],
        },
        projects: {
            title: "プロジェクト",
            description:
                "作業を追加し、ローンチ活動を絞り込み、行を開いて詳細を同じ文脈で確認します。",
            filter: "プロジェクトを絞り込み",
            filterButton: "絞り込み",
            newProject: "新規プロジェクト",
            addTitle: "プロジェクトを作成",
            addDescription: "このダッシュボードセッションにサンプルプロジェクトを追加します。",
            placeholder: "パートナー展開",
            create: "作成",
            createDisabledReason: "プロジェクト名を入力すると作成できます。",
            cancel: "キャンセル",
            clearFilters: "絞り込みを解除",
            name: "プロジェクト名",
            owner: "担当",
            status: "状態",
            columns: {
                project: "プロジェクト",
                owner: "担当",
                status: "状態",
                progress: "進捗",
                due: "期限",
                budget: "予算",
            },
            detail: "プロジェクト詳細",
            nextStep: "次の対応",
            nextStepBody: "次のリリース枠までにロールアウトチェックリストを確認します。",
            created: (name: string) => `${name} を追加しました。`,
            statusUpdated: (name: string, status: string) =>
                `${name} を「${status}」に更新しました。`,
            actions: {
                title: "プロジェクト操作",
                track: "順調にする",
                review: "レビューへ送る",
                block: "ブロックする",
            },
        },
        settings: {
            title: "設定",
            description: "アカウント、請求、チーム設定も同じダッシュボードシェルで扱います。",
            tabs: {
                account: "アカウント",
                billing: "請求",
                team: "チーム",
            },
            accountTitle: "アカウントプロフィール",
            billingTitle: "請求プラン",
            teamTitle: "チームアクセス",
            name: "ワークスペース名",
            region: "リージョン",
            plan: "プラン",
            seats: "シート数",
            audit: "監査ログ",
            invite: "メンバーを招待",
            save: "変更を保存",
            saved: "設定を保存しました。",
            updated: "たった今保存しました",
        },
        account: {
            menu: "アカウントメニュー",
            profile: "プロフィール設定",
            projects: "プロジェクト一覧",
            reset: "デモデータをリセット",
            resetDone: "デモデータをリセットしました。",
        },
        notification: {
            markRead: "すべて既読にする",
            none: "新しい通知はありません",
        },
    },
} as const;

const FUNNEL_VALUES = [1240, 842, 428, 160];
const ACTIVATION_VALUES = [72, 58, 46, 32];
const CAPACITY_MATRIX = [
    [18, 24, 22, 28, 34, 16, 14],
    [26, 32, 38, 45, 42, 24, 18],
    [42, 56, 68, 74, 63, 38, 22],
    [38, 52, 61, 86, 72, 42, 24],
    [30, 44, 54, 66, 58, 36, 20],
    [16, 22, 28, 34, 30, 18, 12],
];

function createDemoId(prefix: string) {
    const randomId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}-${randomId}`;
}

function normalizeNotices(notices: DashboardNotice[]) {
    const seen = new Set<string>();

    return notices.map((notice) => {
        const baseId = notice.id || createDemoId("notice");
        let id = baseId;
        let suffix = 1;

        while (seen.has(id)) {
            id = `${baseId}-${suffix}`;
            suffix += 1;
        }

        seen.add(id);
        return id === notice.id ? notice : { ...notice, id };
    });
}

// When the dashboard is embedded as a decorative preview (e.g. the homepage
// pattern carousel), its page title must not register as an <h1> in the host
// document outline. PageHeading reads this to render a plain element instead.
const PageHeadingLevelContext = React.createContext<React.ElementType>("h1");

export function DashboardShell({
    page,
    embeddedNavigation = false,
}: {
    page: DashboardPage;
    embeddedNavigation?: boolean;
}) {
    return (
        <MarqueeChrome
            slug="dashboard"
            routeBase="/patterns/dashboard"
            defaultPath="/overview"
            navigablePaths={DASHBOARD_PATHS}
        >
            {(viewport) => (
                <DashboardApp
                    page={page}
                    viewport={viewport}
                    embeddedNavigation={embeddedNavigation}
                />
            )}
        </MarqueeChrome>
    );
}

function DashboardApp({
    page,
    viewport,
    embeddedNavigation,
}: {
    page: DashboardPage;
    viewport: MarqueeViewport;
    embeddedNavigation: boolean;
}) {
    const { locale } = useLocale();
    const t = locale === "ja" ? COPY.ja : COPY.en;
    const { width, height } = MARQUEE_VIEWPORT_SIZES[viewport];
    const router = useRouter();
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(
        null
    );
    const [projects, setProjects] = React.useState(INITIAL_PROJECTS);
    const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
    const [notices, setNotices] = React.useState(INITIAL_NOTICES);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [toast, setToast] = React.useState<DashboardToastState | null>(null);
    const [hydrated, setHydrated] = React.useState(false);
    const [embeddedPage, setEmbeddedPage] = React.useState(page);
    const [embeddedProjectId, setEmbeddedProjectId] = React.useState<string | null>(null);
    const toastTimerRef = React.useRef<number | null>(null);
    const showSidebar = viewport !== "mobile";
    const activePage = embeddedNavigation ? embeddedPage : page;

    React.useEffect(() => {
        if (!embeddedNavigation) {
            setEmbeddedPage(page);
        }
    }, [embeddedNavigation, page]);

    React.useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as {
                    projects?: DashboardProject[];
                    settings?: DashboardSettingsState;
                    notices?: DashboardNotice[];
                };
                if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
                if (parsed.settings) setSettings(parsed.settings);
                if (Array.isArray(parsed.notices)) {
                    setNotices(normalizeNotices(parsed.notices));
                }
            }
        } catch {
            // Ignore malformed local demo state and keep the seeded mock data.
        } finally {
            setHydrated(true);
        }
    }, []);

    React.useEffect(() => {
        if (!hydrated) return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ projects, settings, notices })
        );
    }, [hydrated, projects, settings, notices]);

    React.useEffect(() => {
        return () => {
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        };
    }, []);

    const showToast = React.useCallback((message: string, type: "success" | "info") => {
        setToast({ message, type });
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
    }, []);

    const navigateDashboard = React.useCallback<DashboardNavigate>(
        (route) => {
            if (!embeddedNavigation) {
                router.push(route);
                return;
            }

            const nextPage = route.includes("/projects")
                ? "projects"
                : route.includes("/settings")
                  ? "settings"
                  : "overview";
            const projectId = route.match(/[?&]project=([^&]+)/)?.[1] ?? null;
            setEmbeddedPage(nextPage);
            setEmbeddedProjectId(projectId ? decodeURIComponent(projectId) : null);
        },
        [embeddedNavigation, router]
    );

    const addNotice = React.useCallback((notice: Omit<DashboardNotice, "id" | "unread">) => {
        setNotices((current) => [
            {
                ...notice,
                id: createDemoId("notice"),
                unread: true,
            },
            ...current,
        ]);
    }, []);

    const addProject = React.useCallback(
        (project: DashboardProject) => {
            setProjects((current) => [project, ...current]);
            addNotice({
                title: "Project created",
                titleJa: "プロジェクトを作成",
                body: project.name,
                bodyJa: project.nameJa,
                time: "Now",
                timeJa: "今",
                route: `/patterns/dashboard/projects?project=${project.id}`,
            });
            showToast(t.projects.created(locale === "ja" ? project.nameJa : project.name), "success");
            navigateDashboard(`/patterns/dashboard/projects?project=${project.id}`);
        },
        [addNotice, locale, navigateDashboard, showToast, t.projects]
    );

    const updateProjectStatus = React.useCallback(
        (projectId: string, status: ProjectStatus) => {
            setProjects((current) => {
                const project = current.find((item) => item.id === projectId);
                if (!project) return current;

                const projectName = locale === "ja" ? project.nameJa : project.name;
                const statusLabel = t.status[status];

                addNotice({
                    title: "Project status updated",
                    titleJa: "プロジェクト状態を更新",
                    body: `${project.name} moved to ${COPY.en.status[status]}`,
                    bodyJa: `${project.nameJa} を「${COPY.ja.status[status]}」に更新しました。`,
                    time: "Now",
                    timeJa: "今",
                    route: `/patterns/dashboard/projects?project=${project.id}`,
                });
                showToast(t.projects.statusUpdated(projectName, statusLabel), "success");

                return current.map((item) =>
                    item.id === projectId
                        ? {
                              ...item,
                              status,
                              updated: "Now",
                              updatedJa: "今",
                          }
                        : item
                );
            });
        },
        [addNotice, locale, showToast, t.projects, t.status]
    );

    const saveSettings = React.useCallback(
        (next: DashboardSettingsState) => {
            setSettings(next);
            addNotice({
                title: "Settings updated",
                titleJa: "設定を更新",
                body: next.workspaceName,
                bodyJa: next.workspaceName,
                time: "Now",
                timeJa: "今",
                route: "/patterns/dashboard/settings",
            });
            showToast(t.settings.saved, "success");
        },
        [addNotice, showToast, t.settings.saved]
    );

    const resetDemoData = React.useCallback(() => {
        setProjects(INITIAL_PROJECTS);
        setSettings(DEFAULT_SETTINGS);
        setNotices(INITIAL_NOTICES);
        showToast(t.account.resetDone, "info");
        navigateDashboard("/patterns/dashboard/overview");
    }, [navigateDashboard, showToast, t.account.resetDone]);

    return (
        <PageHeadingLevelContext.Provider
            value={embeddedNavigation ? "div" : "h1"}
        >
        <div
            ref={setPortalContainer}
            className="relative overflow-hidden bg-background"
            style={{ width, height }}
        >
            <DashboardTemplate
                className="h-full min-h-0 w-full"
                header={
                    <DashboardHeader
                        activePage={activePage}
                        viewport={viewport}
                        portalContainer={portalContainer}
                        projects={projects}
                        notices={notices}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setNotices={setNotices}
                        resetDemoData={resetDemoData}
                        navigateDashboard={navigateDashboard}
                        t={t}
                    />
                }
                sidebar={
                    showSidebar ? (
                        <DashboardSidebar
                            page={activePage}
                            projects={projects}
                            t={t}
                            navigateDashboard={navigateDashboard}
                        />
                    ) : null
                }
            >
                {activePage === "overview" ? (
                    <OverviewPage projects={projects} notices={notices} viewport={viewport} t={t} />
                ) : null}
                {activePage === "projects" ? (
                    <React.Suspense fallback={null}>
                        <ProjectsPage
                            projects={projects}
                            addProject={addProject}
                            updateProjectStatus={updateProjectStatus}
                            globalSearchQuery={searchQuery}
                            portalContainer={portalContainer}
                            viewport={viewport}
                            selectedProjectId={embeddedNavigation ? embeddedProjectId : undefined}
                            onSelectProject={
                                embeddedNavigation
                                    ? (projectId) => {
                                          setEmbeddedProjectId(projectId);
                                      }
                                    : undefined
                            }
                            t={t}
                        />
                    </React.Suspense>
                ) : null}
                {activePage === "settings" ? (
                    <SettingsPage
                        settings={settings}
                        saveSettings={saveSettings}
                        viewport={viewport}
                        t={t}
                    />
                ) : null}
            </DashboardTemplate>
            <div className="pointer-events-none absolute right-4 top-16 z-50 w-[min(360px,calc(100%-2rem))]">
                <Toast
                    message={toast?.message ?? ""}
                    type={toast?.type ?? "info"}
                    isVisible={Boolean(toast)}
                    onClose={() => setToast(null)}
                    duration={2600}
                    placement="inline"
                    closeLabel={locale === "ja" ? "閉じる" : "Close"}
                    tooltipPortalContainer={portalContainer}
                />
            </div>
        </div>
        </PageHeadingLevelContext.Provider>
    );
}

function DashboardHeader({
    activePage,
    viewport,
    portalContainer,
    projects,
    notices,
    searchQuery,
    setSearchQuery,
    setNotices,
    resetDemoData,
    navigateDashboard,
    t,
}: {
    activePage: DashboardPage;
    viewport: MarqueeViewport;
    portalContainer: HTMLElement | null;
    projects: DashboardProject[];
    notices: DashboardNotice[];
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    setNotices: React.Dispatch<React.SetStateAction<DashboardNotice[]>>;
    resetDemoData: () => void;
    navigateDashboard: DashboardNavigate;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const { locale } = useLocale();
    const [open, setOpen] = React.useState(false);
    const isMobile = viewport === "mobile";
    const unreadCount = notices.filter((notice) => notice.unread).length;
    const searchResults = projects
        .filter((project) =>
            getProjectName(project, locale)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
        .slice(0, 4);

    return (
        <div className="relative flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
                {isMobile ? (
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <TooltipButton
                                type="button"
                                size="icon"
                                variant="ghost"
                                aria-label={t.menu}
                                tooltip={t.menu}
                                tooltipSide="bottom"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                className="shrink-0"
                            >
                                <Menu className="h-4 w-4" />
                            </TooltipButton>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            portalContainer={portalContainer}
                            className="absolute flex max-w-[85%] w-72 flex-col overflow-hidden p-0"
                        >
                            <SheetHeader className="border-b px-4 py-4 text-left">
                                <SheetTitle className="text-base">GunjoUI</SheetTitle>
                            </SheetHeader>
                            <div className="min-h-0 flex-1">
                                <DashboardSidebar
                                    page={activePage}
                                    projects={projects}
                                    t={t}
                                    navigateDashboard={navigateDashboard}
                                    onNavigate={() => setOpen(false)}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                ) : null}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                    <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold leading-tight">GunjoUI</div>
                    <div className="truncate text-xs text-muted-foreground">{t.workspace}</div>
                </div>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-2">
                {!isMobile ? (
                    <div className="relative">
                        <SearchInput
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            placeholder={t.search}
                            className="w-56"
                        />
                        {searchQuery ? (
                            <Card className="absolute right-0 top-11 z-40 w-80 shadow-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">{t.searchResults}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 p-2 pt-0">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((project) => (
                                            <Button
                                                key={project.id}
                                                type="button"
                                                variant="ghost"
                                                className="h-auto w-full justify-between px-3 py-2 text-left"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    navigateDashboard(
                                                        `/patterns/dashboard/projects?project=${project.id}`
                                                    );
                                                }}
                                            >
                                                <span className="truncate font-medium">
                                                    {getProjectName(project, locale)}
                                                </span>
                                                <Badge variant="secondary">
                                                    {t.status[project.status]}
                                                </Badge>
                                            </Button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            {t.noResults}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                ) : null}
                <NotificationsPopover
                    notices={notices}
                    unreadCount={unreadCount}
                    setNotices={setNotices}
                    portalContainer={portalContainer}
                    navigateDashboard={navigateDashboard}
                    t={t}
                />
                <AccountMenu
                    portalContainer={portalContainer}
                    resetDemoData={resetDemoData}
                    navigateDashboard={navigateDashboard}
                    t={t}
                />
            </div>
        </div>
    );
}

function NotificationsPopover({
    notices,
    unreadCount,
    setNotices,
    portalContainer,
    navigateDashboard,
    t,
}: {
    notices: DashboardNotice[];
    unreadCount: number;
    setNotices: React.Dispatch<React.SetStateAction<DashboardNotice[]>>;
    portalContainer: HTMLElement | null;
    navigateDashboard: DashboardNavigate;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const { locale } = useLocale();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <TooltipButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t.notifications}
                    tooltip={t.notifications}
                    tooltipSide="bottom"
                    tooltipPortalContainer={portalContainer}
                    tooltipCloseOnPress
                    className="relative"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 ? (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                    ) : null}
                </TooltipButton>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                portalContainer={portalContainer}
                className="w-80 p-0"
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="text-sm font-semibold">{t.notifications}</div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setNotices((current) =>
                                current.map((notice) => ({ ...notice, unread: false }))
                            )
                        }
                    >
                        {t.notification.markRead}
                    </Button>
                </div>
                <div className="max-h-72 overflow-y-auto p-2">
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <Button
                                key={notice.id}
                                type="button"
                                variant="ghost"
                                className="h-auto w-full justify-start gap-3 px-3 py-2 text-left"
                                onClick={() => {
                                    setNotices((current) =>
                                        current.map((item) =>
                                            item.id === notice.id
                                                ? { ...item, unread: false }
                                                : item
                                        )
                                    );
                                    if (notice.route) navigateDashboard(notice.route);
                                }}
                            >
                                <span
                                    className={cn(
                                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                        notice.unread ? "bg-primary" : "bg-muted"
                                    )}
                                />
                                <span className="min-w-0 space-y-1">
                                    <span className="block text-sm font-medium">
                                        {locale === "ja" ? notice.titleJa : notice.title}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {locale === "ja" ? notice.bodyJa : notice.body}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {locale === "ja" ? notice.timeJa : notice.time}
                                    </span>
                                </span>
                            </Button>
                        ))
                    ) : (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                            {t.notification.none}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function AccountMenu({
    portalContainer,
    resetDemoData,
    navigateDashboard,
    t,
}: {
    portalContainer: HTMLElement | null;
    resetDemoData: () => void;
    navigateDashboard: DashboardNavigate;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <TooltipButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t.account.menu}
                    tooltip={t.account.menu}
                    tooltipSide="bottom"
                    tooltipPortalContainer={portalContainer}
                    tooltipCloseOnPress
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>GU</AvatarFallback>
                    </Avatar>
                </TooltipButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                portalContainer={portalContainer}
                className="w-52"
            >
                <DropdownMenuLabel>GunjoUI</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigateDashboard("/patterns/dashboard/settings")}>
                    {t.account.profile}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigateDashboard("/patterns/dashboard/projects")}>
                    {t.account.projects}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={resetDemoData}>
                    {t.account.reset}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DashboardSidebar({
    page,
    projects,
    t,
    navigateDashboard,
    onNavigate,
}: {
    page: DashboardPage;
    projects: DashboardProject[];
    t: typeof COPY.en | typeof COPY.ja;
    navigateDashboard: DashboardNavigate;
    onNavigate?: () => void;
}) {
    const riskCount = projects.filter(
        (project) => project.status === "blocked" || project.status === "at-risk"
    ).length;

    return (
        <div className="flex h-full flex-col bg-background px-3 py-4">
            <div className="px-2 pb-4">
                <div className="text-xs font-semibold uppercase text-muted-foreground">
                    {t.sidebar.section}
                </div>
            </div>
            <nav aria-label={t.nav.label} className="space-y-1">
                {ROUTES.map(({ id, href, Icon }) => (
                    <SidebarItem
                        key={id}
                        id={id}
                        icon={<Icon size={18} />}
                        label={t.nav[id]}
                        count={id === "projects" ? projects.length : id === "overview" ? riskCount : undefined}
                        isActive={page === id}
                        onClick={() => {
                            navigateDashboard(href);
                            onNavigate?.();
                        }}
                    />
                ))}
            </nav>
            <Card className="mt-auto w-full">
                <CardContent className="space-y-3 p-4">
                    <div className="flex flex-col items-start gap-2">
                        <div className="text-sm font-medium leading-tight">{t.sidebar.team}</div>
                        <Badge variant="secondary">{t.sidebar.plan}</Badge>
                    </div>
                    <Progress
                        value={68}
                        className="h-2 w-full"
                        aria-label={t.sidebar.team}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function PageHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description: string;
}) {
    const HeadingTag = React.useContext(PageHeadingLevelContext);
    return (
        <div className="space-y-1">
            {eyebrow ? (
                <div className="text-xs font-semibold uppercase text-muted-foreground">
                    {eyebrow}
                </div>
            ) : null}
            <HeadingTag className="text-2xl font-semibold tracking-normal">
                {title}
            </HeadingTag>
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

function OverviewPage({
    projects,
    notices,
    viewport,
    t,
}: {
    projects: DashboardProject[];
    notices: DashboardNotice[];
    viewport: MarqueeViewport;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const { locale } = useLocale();
    const riskCount = projects.filter(
        (project) => project.status === "blocked" || project.status === "at-risk"
    ).length;
    const avgProgress = Math.round(
        projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
    );
    const statGrid =
        viewport === "desktop"
            ? "grid-cols-4"
            : viewport === "tablet"
              ? "grid-cols-2"
              : "grid-cols-1";
    const lowerGrid = viewport === "desktop" ? "grid-cols-[1.5fr_1fr]" : "grid-cols-1";
    const dayLabels =
        locale === "ja"
            ? ["月", "火", "水", "木", "金", "土", "日"]
            : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timeLabels = ["00", "04", "08", "12", "16", "20"];
    const [selectedActivationIndex, setSelectedActivationIndex] = React.useState(1);
    const [selectedPipelineIndex, setSelectedPipelineIndex] = React.useState(2);
    const [selectedCapacityCell, setSelectedCapacityCell] = React.useState({
        x: dayLabels[3] ?? dayLabels[0] ?? "",
        y: timeLabels[3] ?? timeLabels[0] ?? "",
    });
    React.useEffect(() => {
        setSelectedCapacityCell({
            x: dayLabels[3] ?? dayLabels[0] ?? "",
            y: timeLabels[3] ?? timeLabels[0] ?? "",
        });
    }, [locale]);
    const activationSegments = t.overview.activationLabels.map((label, index) => ({
        label,
        value: ACTIVATION_VALUES[index] ?? 0,
        detail: `${ACTIVATION_VALUES[index] ?? 0}%`,
    }));
    const funnelTotal = FUNNEL_VALUES.reduce((sum, value) => sum + value, 0);
    const pipelineSegments = t.overview.funnelLabels.map((label, index) => ({
        label,
        value: FUNNEL_VALUES[index] ?? 0,
        calloutLabel: label,
        comparison: `${Math.round(((FUNNEL_VALUES[index] ?? 0) / funnelTotal) * 100)}%`,
    }));
    const heatmapData = timeLabels.flatMap((time, rowIndex) =>
        dayLabels.map((day, columnIndex) => ({
            x: day,
            y: time,
            value: CAPACITY_MATRIX[rowIndex]?.[columnIndex] ?? 0,
            description:
                locale === "ja"
                    ? `${day}曜 ${time}:00 の稼働`
                    : `${day} ${time}:00 workload`,
        }))
    );
    const heatmapSummary = dayLabels.map((day, columnIndex) => ({
        x: day,
        value: Math.max(...CAPACITY_MATRIX.map((row) => row[columnIndex] ?? 0)),
    }));
    const selectedCapacity =
        heatmapData.find(
            (cell) => cell.x === selectedCapacityCell.x && cell.y === selectedCapacityCell.y
        ) ?? heatmapData[0];
    const selectedPipelineValue = FUNNEL_VALUES[selectedPipelineIndex] ?? FUNNEL_VALUES[0];

    return (
        <div className="space-y-6">
            <PageHeading
                eyebrow={t.overview.eyebrow}
                title={t.overview.title}
                description={t.overview.description}
            />
            <div className={cn("grid gap-3", statGrid)}>
                <MetricCard title={t.overview.stats.revenue} value="$128.4K" delta="+12.5%" />
                <MetricCard title={t.overview.stats.trials} value="842" delta="+8.2%" />
                <MetricCard title={t.overview.stats.conversion} value="18.7%" delta="+3.1%" />
                <MetricCard title={t.overview.stats.risk} value={`${riskCount}`} delta="-2" />
            </div>
            <div className={cn("grid gap-4", lowerGrid)}>
                <MiniDistributionBarCard
                    title={t.overview.chart}
                    description={t.overview.chartDescription}
                    value={`${ACTIVATION_VALUES[selectedActivationIndex] ?? ACTIVATION_VALUES[0]}%`}
                    delta="+8.2%"
                    deltaDescription={
                        locale === "ja"
                            ? "前週同期間と比較したアクティベーション率の変化です。"
                            : "Activation rate change compared with the previous week."
                    }
                    segments={activationSegments}
                    selectedIndex={selectedActivationIndex}
                    tickCount={32}
                    totalLabel={t.overview.total}
                    onSegmentSelect={(_, index) => setSelectedActivationIndex(index)}
                />
                <LabeledDonutCard
                    title={t.overview.pipeline}
                    description={t.overview.pipelineDescription}
                    centerValue={selectedPipelineValue.toLocaleString(locale === "ja" ? "ja-JP" : "en-US")}
                    centerLabel={t.overview.funnelLabels[selectedPipelineIndex]}
                    delta="+12.9%"
                    deltaDescription={
                        locale === "ja"
                            ? "現在選択中のファネル段階が全体に占める割合です。"
                            : "Share of the currently selected funnel stage."
                    }
                    segments={pipelineSegments}
                    selectedIndex={selectedPipelineIndex}
                    totalLabel={t.overview.total}
                    showCallouts
                    onSegmentSelect={(_, index) => setSelectedPipelineIndex(index)}
                />
            </div>
            <div className={cn("grid gap-4", lowerGrid)}>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{t.overview.projectHealth}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t.projects.columns.project}</TableHead>
                                    <TableHead>{t.projects.columns.status}</TableHead>
                                    <TableHead>{t.projects.columns.progress}</TableHead>
                                    <TableHead>{t.projects.columns.due}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.slice(0, 5).map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            {getProjectName(project, locale)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {t.status[project.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={project.progress} className="h-2 w-20" aria-label={getProjectName(project, locale)} />
                                                <span className="text-xs text-muted-foreground">
                                                    {project.progress}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{locale === "ja" ? project.dueJa : project.due}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <AnalyticsCard
                        title={t.overview.heatmap}
                        description={t.overview.heatmapDescription}
                        value={`${selectedCapacity?.value ?? 0}%`}
                        delta="+12pt"
                        deltaDescription={
                            locale === "ja"
                                ? "選択中の曜日・時間帯と平均稼働率の差分です。"
                                : "Difference between the selected day/time band and average workload."
                        }
                        trend="up"
                    >
                        <HeatmapChart
                            data={heatmapData}
                            xLabels={dayLabels}
                            yLabels={timeLabels}
                            summary={heatmapSummary}
                            summaryLabel={t.overview.peak}
                            selectedCell={selectedCapacityCell}
                            showValues={viewport !== "mobile"}
                            onCellSelect={(_, selection) => setSelectedCapacityCell(selection)}
                        />
                    </AnalyticsCard>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.overview.activity}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notices.slice(0, 3).map((notice, index) => (
                                <div key={notice.id} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{["MI", "QA", "IM"][index] ?? "GU"}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium leading-tight">
                                            {locale === "ja" ? notice.titleJa : notice.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {locale === "ja" ? notice.timeJa : notice.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{t.overview.checklist}</CardTitle>
                                <Badge>{avgProgress}%</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {t.overview.checklistItems.map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    title,
    value,
    delta,
}: {
    title: string;
    value: string;
    delta: string;
}) {
    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{delta}</div>
            </CardContent>
        </Card>
    );
}

function ProjectsPage({
    projects,
    addProject,
    updateProjectStatus,
    globalSearchQuery,
    portalContainer,
    viewport,
    selectedProjectId,
    onSelectProject,
    t,
}: {
    projects: DashboardProject[];
    addProject: (project: DashboardProject) => void;
    updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
    globalSearchQuery: string;
    portalContainer: HTMLElement | null;
    viewport: MarqueeViewport;
    selectedProjectId?: string | null;
    onSelectProject?: (projectId: string) => void;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { locale } = useLocale();
    const [query, setQuery] = React.useState("");
    const [selectedStatuses, setSelectedStatuses] = React.useState<Set<ProjectStatus>>(
        () => new Set()
    );
    const selectedFromUrl = selectedProjectId ?? searchParams.get("project");
    const mergedQuery = [query, globalSearchQuery].filter(Boolean).join(" ");
    const filteredProjects = projects.filter((project) => {
        const haystack = `${getProjectName(project, locale)} ${project.owner} ${t.status[project.status]} ${project.budget}`;
        const matchesQuery = haystack.toLowerCase().includes(mergedQuery.toLowerCase());
        const matchesStatus =
            selectedStatuses.size === 0 || selectedStatuses.has(project.status);
        return matchesQuery && matchesStatus;
    });
    const selectedProject = projects.find((project) => project.id === selectedFromUrl);
    const selected =
        selectedProject &&
        filteredProjects.some((project) => project.id === selectedProject.id)
            ? selectedProject
            : filteredProjects[0];
    const showDenseTable = viewport !== "mobile";

    const selectProject = (projectId: string) => {
        if (onSelectProject) {
            onSelectProject(projectId);
            return;
        }
        router.push(`${pathname}?project=${projectId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <PageHeading title={t.projects.title} description={t.projects.description} />
                <NewProjectDialog
                    addProject={addProject}
                    portalContainer={portalContainer}
                    t={t}
                />
            </div>
            <div
                className={cn(
                    "grid gap-4",
                    viewport === "desktop" ? "grid-cols-[1fr_18rem]" : "grid-cols-1"
                )}
            >
                <Card className="w-full">
                    <CardHeader className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <SearchInput
                                value={query}
                                onValueChange={setQuery}
                                placeholder={t.projects.filter}
                                className="max-w-sm"
                            />
                            <ProjectFilterPopover
                                selectedStatuses={selectedStatuses}
                                setSelectedStatuses={setSelectedStatuses}
                                portalContainer={portalContainer}
                                t={t}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t.projects.columns.project}</TableHead>
                                    {showDenseTable ? (
                                        <>
                                            <TableHead>{t.projects.columns.owner}</TableHead>
                                            <TableHead>{t.projects.columns.status}</TableHead>
                                        </>
                                    ) : null}
                                    <TableHead>{t.projects.columns.progress}</TableHead>
                                    {showDenseTable ? (
                                        <>
                                            <TableHead>{t.projects.columns.due}</TableHead>
                                            <TableHead>{t.projects.columns.budget}</TableHead>
                                        </>
                                    ) : null}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => {
                                        const isSelected = selected?.id === project.id;
                                        return (
                                            <TableRow
                                                key={project.id}
                                                data-state={isSelected ? "selected" : undefined}
                                                role="button"
                                                tabIndex={0}
                                                className="cursor-pointer"
                                                onClick={() => selectProject(project.id)}
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === "Enter" ||
                                                        event.key === " "
                                                    ) {
                                                        event.preventDefault();
                                                        selectProject(project.id);
                                                    }
                                                }}
                                            >
                                                <TableCell className="font-medium">
                                                    {getProjectName(project, locale)}
                                                </TableCell>
                                                {showDenseTable ? (
                                                    <>
                                                        <TableCell>{project.owner}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">
                                                                {t.status[project.status]}
                                                            </Badge>
                                                        </TableCell>
                                                    </>
                                                ) : null}
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={project.progress}
                                                            className="h-2 w-20"
                                                            aria-label={getProjectName(project, locale)}
                                                        />
                                                        <span className="text-xs text-muted-foreground">
                                                            {project.progress}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                {showDenseTable ? (
                                                    <>
                                                        <TableCell>
                                                            {locale === "ja"
                                                                ? project.dueJa
                                                                : project.due}
                                                        </TableCell>
                                                        <TableCell>{project.budget}</TableCell>
                                                    </>
                                                ) : null}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={showDenseTable ? 6 : 2}
                                            className="py-8 text-center text-sm text-muted-foreground"
                                        >
                                            {t.noResults}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {selected ? (
                    <Card className="w-full">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <CardTitle>{t.projects.detail}</CardTitle>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        {getProjectName(selected, locale)}
                                    </div>
                                </div>
                                <ProjectActionsMenu
                                    project={selected}
                                    updateProjectStatus={updateProjectStatus}
                                    portalContainer={portalContainer}
                                    t={t}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DetailRow label={t.projects.columns.owner} value={selected.owner} />
                            <DetailRow label={t.projects.columns.status} value={t.status[selected.status]} />
                            <DetailRow label={t.projects.columns.due} value={locale === "ja" ? selected.dueJa : selected.due} />
                            <DetailRow label={t.projects.columns.budget} value={selected.budget} />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {t.projects.columns.progress}
                                    </span>
                                    <span className="font-medium">{selected.progress}%</span>
                                </div>
                                <Progress value={selected.progress} className="h-2 w-full" aria-label={getProjectName(selected, locale)} />
                            </div>
                            <div className="rounded-md border bg-muted/40 p-3">
                                <div className="text-sm font-medium">{t.projects.nextStep}</div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t.projects.nextStepBody}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </div>
    );
}

function ProjectFilterPopover({
    selectedStatuses,
    setSelectedStatuses,
    portalContainer,
    t,
}: {
    selectedStatuses: Set<ProjectStatus>;
    setSelectedStatuses: React.Dispatch<React.SetStateAction<Set<ProjectStatus>>>;
    portalContainer: HTMLElement | null;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const statuses: ProjectStatus[] = ["on-track", "review", "blocked", "at-risk"];

    const toggleStatus = (status: ProjectStatus) => {
        setSelectedStatuses((current) => {
            const next = new Set(current);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    {t.projects.filterButton}
                    {selectedStatuses.size > 0 ? (
                        <Badge variant="secondary">{selectedStatuses.size}</Badge>
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                portalContainer={portalContainer}
                className="w-56 p-2"
            >
                <div className="space-y-1">
                    {statuses.map((status) => {
                        const selected = selectedStatuses.has(status);
                        return (
                            <Button
                                key={status}
                                type="button"
                                variant="ghost"
                                className={cn(
                                    "h-auto w-full justify-between px-3 py-2 text-left",
                                    selected && "bg-muted"
                                )}
                                onClick={() => toggleStatus(status)}
                            >
                                <span>{t.status[status]}</span>
                                {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                            </Button>
                        );
                    })}
                </div>
                {selectedStatuses.size > 0 ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => setSelectedStatuses(new Set())}
                    >
                        {t.projects.clearFilters}
                    </Button>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}

function ProjectActionsMenu({
    project,
    updateProjectStatus,
    portalContainer,
    t,
}: {
    project: DashboardProject;
    updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
    portalContainer: HTMLElement | null;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <TooltipButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t.more}
                    tooltip={t.more}
                    tooltipSide="left"
                    tooltipPortalContainer={portalContainer}
                    tooltipCloseOnPress
                >
                    <MoreHorizontal className="h-4 w-4" />
                </TooltipButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                portalContainer={portalContainer}
                className="w-48"
            >
                <DropdownMenuLabel>{t.projects.actions.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => updateProjectStatus(project.id, "on-track")}>
                    {t.projects.actions.track}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => updateProjectStatus(project.id, "review")}>
                    {t.projects.actions.review}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => updateProjectStatus(project.id, "blocked")}>
                    {t.projects.actions.block}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function NewProjectDialog({
    addProject,
    portalContainer,
    t,
}: {
    addProject: (project: DashboardProject) => void;
    portalContainer: HTMLElement | null;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [owner, setOwner] = React.useState("Mika");
    const [status, setStatus] = React.useState<ProjectStatus>("on-track");
    const canCreate = name.trim().length > 0;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        const slug = trimmed
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        addProject({
            id: createDemoId(slug || "project"),
            name: trimmed,
            nameJa: trimmed,
            owner,
            status,
            progress: 12,
            updated: "Now",
            updatedJa: "今",
            due: "Jun 10",
            dueJa: "6月10日",
            budget: "$12K",
            tasks: 4,
        });
        setName("");
        setOwner("Mika");
        setStatus("on-track");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" size="sm" className="shrink-0">
                    <Plus className="h-4 w-4" />
                    {t.projects.newProject}
                </Button>
            </DialogTrigger>
            <DialogContent
                portalContainer={portalContainer}
                className="absolute data-[state=closed]:animate-none data-[state=open]:animate-none"
            >
                <DialogHeader>
                    <DialogTitle>{t.projects.addTitle}</DialogTitle>
                    <DialogDescription>{t.projects.addDescription}</DialogDescription>
                </DialogHeader>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel htmlFor="new-project-name">{t.projects.name}</FormLabel>
                        <FormControl>
                            <Input
                                id="new-project-name"
                                value={name}
                                onChange={(event) => setName(event.currentTarget.value)}
                                placeholder={t.projects.placeholder}
                            />
                        </FormControl>
                    </FormGroup>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormGroup>
                            <FormLabel htmlFor="new-project-owner">{t.projects.owner}</FormLabel>
                            <FormControl>
                                <Select
                                    id="new-project-owner"
                                    value={owner}
                                    onChange={(event) => setOwner(event.currentTarget.value)}
                                >
                                    <option value="Mika">Mika</option>
                                    <option value="Ken">Ken</option>
                                    <option value="Sara">Sara</option>
                                    <option value="Aoi">Aoi</option>
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="new-project-status">{t.projects.status}</FormLabel>
                            <FormControl>
                                <Select
                                    id="new-project-status"
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.currentTarget.value as ProjectStatus)
                                    }
                                >
                                    <option value="on-track">{t.status["on-track"]}</option>
                                    <option value="review">{t.status.review}</option>
                                    <option value="blocked">{t.status.blocked}</option>
                                    <option value="at-risk">{t.status["at-risk"]}</option>
                                </Select>
                            </FormControl>
                        </FormGroup>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            {t.projects.cancel}
                        </Button>
                        {canCreate ? (
                            <Button type="submit">{t.projects.create}</Button>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex">
                                        <Button type="submit" disabled>
                                            {t.projects.create}
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent portalContainer={portalContainer}>
                                    {t.projects.createDisabledReason}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

function SettingsPage({
    settings,
    saveSettings,
    viewport,
    t,
}: {
    settings: DashboardSettingsState;
    saveSettings: (settings: DashboardSettingsState) => void;
    viewport: MarqueeViewport;
    t: typeof COPY.en | typeof COPY.ja;
}) {
    const [draft, setDraft] = React.useState(settings);
    const [savedLabel, setSavedLabel] = React.useState("");
    const isMobile = viewport === "mobile";

    React.useEffect(() => {
        setDraft(settings);
    }, [settings]);

    const updateDraft = <K extends keyof DashboardSettingsState>(
        key: K,
        value: DashboardSettingsState[K]
    ) => {
        setDraft((current) => ({ ...current, [key]: value }));
    };

    const handleSave = () => {
        saveSettings(draft);
        setSavedLabel(t.settings.updated);
    };

    return (
        <div className="space-y-6">
            <PageHeading title={t.settings.title} description={t.settings.description} />
            <Tabs defaultValue="account" className="w-full border-0">
                <TabsList className={cn("justify-start", isMobile ? "w-full overflow-x-auto" : "")}>
                    <TabsTrigger value="account">{t.settings.tabs.account}</TabsTrigger>
                    <TabsTrigger value="billing">{t.settings.tabs.billing}</TabsTrigger>
                    <TabsTrigger value="team">{t.settings.tabs.team}</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="px-0">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.settings.accountTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form>
                                <div
                                    className={cn(
                                        "grid gap-4",
                                        isMobile ? "grid-cols-1" : "grid-cols-2"
                                    )}
                                >
                                    <FormGroup>
                                        <FormLabel htmlFor="workspace-name">
                                            {t.settings.name}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="workspace-name"
                                                value={draft.workspaceName}
                                                onChange={(event) =>
                                                    updateDraft("workspaceName", event.currentTarget.value)
                                                }
                                            />
                                        </FormControl>
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel htmlFor="workspace-region">
                                            {t.settings.region}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                id="workspace-region"
                                                value={draft.region}
                                                onChange={(event) =>
                                                    updateDraft("region", event.currentTarget.value)
                                                }
                                            >
                                                <option value="tokyo">Tokyo</option>
                                                <option value="oregon">Oregon</option>
                                                <option value="frankfurt">Frankfurt</option>
                                            </Select>
                                        </FormControl>
                                    </FormGroup>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button type="button" className="w-fit" onClick={handleSave}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {t.settings.save}
                                    </Button>
                                    {savedLabel ? (
                                        <span className="text-sm text-muted-foreground">{savedLabel}</span>
                                    ) : null}
                                </div>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="billing" className="px-0">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.settings.billingTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingRow
                                icon={<CreditCard className="h-4 w-4" />}
                                label={t.settings.plan}
                                value={draft.plan}
                            />
                            <SettingRow
                                icon={<Users className="h-4 w-4" />}
                                label={t.settings.seats}
                                value={draft.seats}
                            />
                            <Progress
                                value={75}
                                className="h-2 w-full"
                                aria-label={t.settings.seats}
                            />
                            <Button type="button" onClick={handleSave}>
                                {t.settings.save}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="team" className="px-0">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.settings.teamTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleRow
                                icon={<ShieldCheck className="h-4 w-4" />}
                                label={t.settings.audit}
                                checked={draft.auditEnabled}
                                onCheckedChange={(checked) => updateDraft("auditEnabled", checked)}
                            />
                            <ToggleRow
                                icon={<SlidersHorizontal className="h-4 w-4" />}
                                label={t.settings.invite}
                                checked={draft.inviteEnabled}
                                onCheckedChange={(checked) => updateDraft("inviteEnabled", checked)}
                            />
                            <Button type="button" onClick={handleSave}>
                                {t.settings.save}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function SettingRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

function ToggleRow({
    icon,
    label,
    checked,
    onCheckedChange,
}: {
    icon: React.ReactNode;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}


function getProjectName(project: DashboardProject, locale: string) {
    return locale === "ja" ? project.nameJa : project.name;
}
