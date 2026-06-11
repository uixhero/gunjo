"use client";

import {
    AssetGrid,
    type AssetGridGroup,
    AssetInspectorPanel,
    type AssetCardAsset,
    FileTree,
    type FileTreeNode,
    MediaLibraryTemplate,
    MediaLightbox,
    MediaPickerDialog,
    SidebarItem,
    ScrollArea,
    Button,
    TooltipButton,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    NumberInput,
    SearchInput,
    Select,
    RangeSlider,
    Slider,
    Switch,
    FilterButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import {
    IconArchive as Archive,
    IconArrowsSort as ArrowUpDown,
    IconCheck as Check,
    IconChevronRight as ChevronRight,
    IconCopy as Copy,
    IconDatabase as HardDrive,
    IconFileTypeDoc as FileType,
    IconFilter as Funnel,
    IconFolder as Folder,
    IconGridDots as Grid,
    IconInfoCircle as Info,
    IconLayoutGrid as Layout,
    IconLock as Lock,
    IconMaximize as Maximize2,
    IconMenu2 as Menu,
    IconPalette as Palette,
    IconPlus as Plus,
    IconSearch as Search,
    IconSettings as Settings,
    IconShape as Shapes,
    IconStar as Star,
    IconTag as Tag,
    IconTrash as Trash2,
    IconWand as WandSparkles,
    IconWorld as Globe2,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { cn } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

// --- Mock Data ---
type FolderId = string;
type LibraryView = "all" | "uncat" | "trash" | "favorite" | "spec-check" | "compressed" | FolderId;
type GroupMode = "none" | "folder" | "type" | "rating";
type SortKey = "date-desc" | "name-asc" | "size-desc" | "rating-desc";
type MediaLibraryViewport = "desktop" | "tablet" | "mobile";
type FolderDragAction = "nest" | "reorder-above" | "reorder-below";
type FolderReorderAction = Exclude<FolderDragAction, "nest">;
type SmartFolderId = "spec-check" | "compressed";
type OptionalFilterKind = "folder" | "shape" | "size";

type MediaAsset = AssetCardAsset & {
    folderId?: FolderId;
    tags: string[];
    createdAt: string;
    trashed?: boolean;
    compressed?: boolean;
    rating?: number;
    analysis?: {
        tags?: string[];
        scores?: {
            total?: number;
            composition?: number;
            color?: number;
            impact?: number;
        };
        target?: {
            generation?: string;
            ageRange?: string;
            gender?: string;
        };
    };
};

interface FolderNode {
    id: FolderId;
    name: string;
    nameJa: string;
    children?: FolderNode[];
}

interface FlatFolderNode extends FolderNode {
    level: number;
}

const INITIAL_FOLDERS: FolderNode[] = [
    { id: "campaign", name: "Campaign 2025", nameJa: "キャンペーン 2025" },
    {
        id: "social",
        name: "Social Media",
        nameJa: "SNS 素材",
        children: [
            {
                id: "line",
                name: "LINE Distribution",
                nameJa: "LINE配信",
                children: [
                    {
                        id: "line-test",
                        name: "test",
                        nameJa: "test",
                        children: [
                            { id: "line-test-02", name: "test02", nameJa: "test02" },
                            { id: "line-test-test", name: "testtest", nameJa: "testtest" },
                        ],
                    },
                ],
            },
            { id: "instagram", name: "Instagram", nameJa: "Instagram" },
        ],
    },
    { id: "website", name: "Website Assets", nameJa: "Web サイト素材" },
    { id: "email", name: "Email Banners", nameJa: "メールバナー" },
];

const INITIAL_SMART_FOLDERS: SmartFolderId[] = ["spec-check", "compressed"];

const demoAssetImage = (
    label: string,
    options: {
        width?: number;
        height?: number;
        bg: string;
        accent: string;
        secondary?: string;
        shape?: "story" | "banner" | "product" | "ad" | "cover" | "moodboard" | "keyvisual" | "newsletter";
    }
) => {
    const width = options.width ?? 1200;
    const height = options.height ?? 900;
    const secondary = options.secondary ?? "rgba(255,255,255,0.28)";
    const shape = options.shape ?? "product";
    const safeLabel = label.replace(/[<>&"]/g, "");
    const minSide = Math.min(width, height);
    const labelSize = Math.max(22, Math.round(minSide * 0.07));
    const motif = {
        story: `
  <path d="M ${width * 0.08} ${height * 0.18} C ${width * 0.34} ${height * 0.02}, ${width * 0.54} ${height * 0.18}, ${width * 0.92} ${height * 0.08} L ${width * 0.92} ${height * 0.42} C ${width * 0.68} ${height * 0.54}, ${width * 0.38} ${height * 0.36}, ${width * 0.08} ${height * 0.52} Z" fill="${secondary}" opacity="0.64" />
  <circle cx="${width * 0.68}" cy="${height * 0.62}" r="${minSide * 0.17}" fill="${options.accent}" opacity="0.38" />
  <path d="M ${width * 0.18} ${height * 0.82} C ${width * 0.42} ${height * 0.66}, ${width * 0.58} ${height * 0.95}, ${width * 0.82} ${height * 0.76}" fill="none" stroke="rgba(255,255,255,0.58)" stroke-width="${minSide * 0.035}" stroke-linecap="round" />`,
        banner: `
  <path d="M 0 ${height * 0.68} C ${width * 0.22} ${height * 0.48}, ${width * 0.44} ${height * 0.84}, ${width * 0.66} ${height * 0.58} S ${width * 0.92} ${height * 0.42}, ${width} ${height * 0.52} L ${width} ${height} L 0 ${height} Z" fill="${secondary}" opacity="0.68" />
  <circle cx="${width * 0.78}" cy="${height * 0.28}" r="${minSide * 0.18}" fill="rgba(255,255,255,0.42)" />
  <path d="M ${width * 0.1} ${height * 0.36} L ${width * 0.52} ${height * 0.22}" stroke="rgba(255,255,255,0.54)" stroke-width="${minSide * 0.035}" stroke-linecap="round" />`,
        product: `
  <circle cx="${width * 0.5}" cy="${height * 0.48}" r="${minSide * 0.28}" fill="rgba(255,255,255,0.42)" />
  <circle cx="${width * 0.5}" cy="${height * 0.48}" r="${minSide * 0.18}" fill="${options.accent}" opacity="0.5" />
  <path d="M ${width * 0.2} ${height * 0.72} C ${width * 0.42} ${height * 0.58}, ${width * 0.62} ${height * 0.88}, ${width * 0.84} ${height * 0.66}" fill="none" stroke="${secondary}" stroke-width="${minSide * 0.055}" stroke-linecap="round" />`,
        ad: `
  <path d="M ${width * 0.12} ${height * 0.24} L ${width * 0.88} ${height * 0.12} L ${width * 0.78} ${height * 0.78} L ${width * 0.22} ${height * 0.88} Z" fill="rgba(255,255,255,0.48)" />
  <circle cx="${width * 0.3}" cy="${height * 0.38}" r="${minSide * 0.13}" fill="${options.accent}" opacity="0.48" />
  <circle cx="${width * 0.68}" cy="${height * 0.62}" r="${minSide * 0.18}" fill="${secondary}" opacity="0.72" />`,
        cover: `
  <path d="M ${width * 0.18} ${height * 0.86} C ${width * 0.3} ${height * 0.26}, ${width * 0.64} ${height * 0.06}, ${width * 0.86} ${height * 0.22} C ${width * 0.7} ${height * 0.44}, ${width * 0.72} ${height * 0.72}, ${width * 0.54} ${height * 0.92} Z" fill="rgba(255,255,255,0.5)" />
  <path d="M ${width * 0.28} ${height * 0.7} C ${width * 0.44} ${height * 0.48}, ${width * 0.56} ${height * 0.82}, ${width * 0.76} ${height * 0.52}" fill="none" stroke="${options.accent}" stroke-width="${minSide * 0.05}" stroke-linecap="round" />`,
        moodboard: `
  <circle cx="${width * 0.28}" cy="${height * 0.28}" r="${minSide * 0.18}" fill="rgba(255,255,255,0.48)" />
  <circle cx="${width * 0.68}" cy="${height * 0.34}" r="${minSide * 0.22}" fill="${secondary}" opacity="0.68" />
  <path d="M ${width * 0.16} ${height * 0.72} C ${width * 0.34} ${height * 0.54}, ${width * 0.54} ${height * 0.9}, ${width * 0.86} ${height * 0.62}" fill="none" stroke="rgba(255,255,255,0.56)" stroke-width="${minSide * 0.052}" stroke-linecap="round" />`,
        keyvisual: `
  <path d="M ${width * 0.04} ${height * 0.76} L ${width * 0.34} ${height * 0.34} L ${width * 0.52} ${height * 0.58} L ${width * 0.72} ${height * 0.28} L ${width * 0.98} ${height * 0.76} Z" fill="rgba(255,255,255,0.52)" />
  <circle cx="${width * 0.76}" cy="${height * 0.26}" r="${minSide * 0.11}" fill="${secondary}" opacity="0.78" />
  <path d="M ${width * 0.18} ${height * 0.22} C ${width * 0.42} ${height * 0.08}, ${width * 0.58} ${height * 0.28}, ${width * 0.86} ${height * 0.16}" fill="none" stroke="rgba(255,255,255,0.46)" stroke-width="${minSide * 0.034}" stroke-linecap="round" />`,
        newsletter: `
  <path d="M ${width * 0.08} ${height * 0.24} C ${width * 0.28} ${height * 0.02}, ${width * 0.72} ${height * 0.04}, ${width * 0.92} ${height * 0.24} L ${width * 0.8} ${height * 0.78} C ${width * 0.58} ${height * 0.92}, ${width * 0.34} ${height * 0.9}, ${width * 0.14} ${height * 0.76} Z" fill="rgba(255,255,255,0.52)" />
  <path d="M ${width * 0.18} ${height * 0.5} C ${width * 0.34} ${height * 0.38}, ${width * 0.52} ${height * 0.68}, ${width * 0.78} ${height * 0.48}" fill="none" stroke="${options.accent}" stroke-width="${minSide * 0.05}" stroke-linecap="round" />`,
    }[shape];
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${options.bg}" />
      <stop offset="1" stop-color="${options.accent}" />
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="rgba(15,23,42,0.22)" />
    </filter>
  </defs>
  <rect width="100%" height="100%" rx="${Math.round(width * 0.035)}" fill="url(#bg)" />
  <circle cx="${width * 0.12}" cy="${height * 0.16}" r="${minSide * 0.18}" fill="${secondary}" opacity="0.52" />
  <circle cx="${width * 0.86}" cy="${height * 0.16}" r="${minSide * 0.22}" fill="rgba(255,255,255,0.28)" />
  ${motif}
  <text x="${width * 0.08}" y="${height * 0.9}" font-family="Inter, Arial, sans-serif" font-size="${labelSize}" font-weight="700" fill="rgba(255,255,255,0.9)">${safeLabel}</text>
</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const DEMO_IMAGES = {
    story: demoAssetImage("Story", { width: 1080, height: 1920, bg: "#4f46e5", accent: "#f97316", secondary: "#fef3c7", shape: "story" }),
    hero: demoAssetImage("Hero", { width: 1920, height: 600, bg: "#0f766e", accent: "#38bdf8", secondary: "#ccfbf1", shape: "banner" }),
    product: demoAssetImage("Product", { width: 1000, height: 1000, bg: "#7c3aed", accent: "#f9a8d4", secondary: "#ede9fe", shape: "product" }),
    ad: demoAssetImage("Ad", { width: 900, height: 750, bg: "#dc2626", accent: "#facc15", secondary: "#fee2e2", shape: "ad" }),
    cover: demoAssetImage("Lookbook", { width: 1440, height: 1800, bg: "#334155", accent: "#14b8a6", secondary: "#f8fafc", shape: "cover" }),
    moodboard: demoAssetImage("Moodboard", { width: 1600, height: 1200, bg: "#a16207", accent: "#fb7185", secondary: "#fef3c7", shape: "moodboard" }),
    keyvisual: demoAssetImage("Keyvisual", { width: 1920, height: 1080, bg: "#2563eb", accent: "#22c55e", secondary: "#dbeafe", shape: "keyvisual" }),
    newsletter: demoAssetImage("Newsletter", { width: 1200, height: 420, bg: "#9333ea", accent: "#06b6d4", secondary: "#f3e8ff", shape: "newsletter" }),
};

const MOCK_ITEMS: MediaAsset[] = [
    {
        id: '1',
        title: 'Instagram_Story_v2.png',
        src: DEMO_IMAGES.story,
        width: 1080,
        height: 1920,
        type: 'PNG',
        size: '2.4MB',
        createdAt: '2025-12-14',
        rating: 4.5,
        isFavorite: true,
        folderId: "line",
        tags: ['Summer', 'Sale'],
        compressed: true,
        analysis: {
            tags: ['clothing', 'fashion', 'person'],
            scores: {
                total: 8.5,
                composition: 90,
                color: 85,
                impact: 80
            },
            target: {
                generation: 'Gen Z',
                ageRange: '18-24',
                gender: 'Female'
            }
        }
    },
    {
        id: '2',
        title: 'Hero_Banner.jpg',
        src: DEMO_IMAGES.hero,
        width: 1920,
        height: 600,
        type: 'JPG',
        size: '1.1MB',
        createdAt: '2025-12-13',
        rating: 3.5,
        isFavorite: false,
        folderId: "website",
        tags: ['Hero', 'Website'],
        analysis: {
            scores: { total: 7.2 }
        }
    },
    {
        id: '3',
        title: 'Product_Showcase.png',
        src: DEMO_IMAGES.product,
        width: 800,
        height: 800,
        type: 'PNG',
        size: '1.8MB',
        createdAt: '2025-12-12',
        rating: 0,
        isFavorite: false,
        folderId: "campaign",
        tags: ['Product'],
    },
    {
        id: '4',
        title: 'Banner_Ad_300x250.jpg',
        src: DEMO_IMAGES.ad,
        width: 300,
        height: 250,
        type: 'JPG',
        size: '450KB',
        createdAt: '2025-12-10',
        rating: 3,
        isFavorite: false,
        folderId: "email",
        tags: ['Ad'],
    },
    {
        id: "5",
        title: "Lookbook_Cover.jpg",
        src: DEMO_IMAGES.cover,
        width: 1440,
        height: 1800,
        type: "JPG",
        size: "3.2MB",
        createdAt: "2025-12-09",
        rating: 4.5,
        isFavorite: true,
        folderId: "campaign",
        tags: ["Lookbook", "Fashion"],
        analysis: { scores: { total: 8.9 } },
    },
    {
        id: "6",
        title: "Unsorted_Moodboard.png",
        src: DEMO_IMAGES.moodboard,
        width: 1600,
        height: 1200,
        type: "PNG",
        size: "2.9MB",
        createdAt: "2025-12-08",
        rating: 0,
        isFavorite: false,
        tags: ["Moodboard"],
    },
];

const PICKER_ITEMS: MediaAsset[] = [
    {
        id: "import-1",
        title: "Campaign_Keyvisual.jpg",
        src: DEMO_IMAGES.keyvisual,
        width: 1920,
        height: 1080,
        type: "JPG",
        size: "2.7MB",
        createdAt: "2025-12-15",
        folderId: "campaign",
        tags: ["Campaign", "Keyvisual"],
        analysis: { scores: { total: 8.1 } },
    },
    {
        id: "import-2",
        title: "Story_Template.psd",
        width: 1080,
        height: 1920,
        type: "PSD",
        size: "12.8MB",
        createdAt: "2025-12-15",
        folderId: "social",
        tags: ["Template", "SNS"],
        analysis: { scores: { total: 6.8 } },
    },
    {
        id: "import-3",
        title: "Newsletter_Header.png",
        src: DEMO_IMAGES.newsletter,
        width: 1200,
        height: 420,
        type: "PNG",
        size: "980KB",
        createdAt: "2025-12-15",
        folderId: "email",
        tags: ["Newsletter", "Header"],
        compressed: true,
        analysis: { scores: { total: 7.7 } },
    },
];

const TYPE_FILTERS = ["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG"];
const SIZE_RANGE_MIN_MB = 0;
const SIZE_RANGE_STEP_MB = 0.1;
const COLOR_FILTERS = [
    { id: "red", label: "Red", value: "hsl(var(--palette-red))" },
    { id: "green", label: "Green", value: "hsl(var(--palette-green))" },
    { id: "blue", label: "Blue", value: "hsl(var(--palette-blue))" },
    { id: "yellow", label: "Yellow", value: "hsl(var(--palette-yellow))" },
    { id: "cyan", label: "Cyan", value: "hsl(var(--palette-cyan))" },
    { id: "magenta", label: "Magenta", value: "hsl(var(--palette-magenta))" },
    { id: "white", label: "White", value: "hsl(var(--palette-white))" },
    { id: "black", label: "Black", value: "hsl(var(--palette-black))" },
    { id: "gray", label: "Gray", value: "hsl(var(--palette-gray))" },
];
const SAMPLE_TAGS = [
    "Aesthetic",
    "Approachable",
    "Assistive Technology",
    "B2B",
    "B2B announcement",
    "B2B communication",
    "Bannalyze",
    "BannalyzeLog",
    "Best Choice",
    "Brand Collaboration",
    "CI/CD",
    "Calm",
    "Center-focused",
];

function assetColorKeys(asset: MediaAsset) {
    const map = [
        ["blue", "cyan"],
        ["yellow", "red"],
        ["green", "gray"],
        ["magenta", "white"],
        ["black", "gray"],
        ["cyan", "blue"],
    ];
    const index = Number(asset.id.replace(/\D/g, "")) || asset.title.length;
    return map[index % map.length];
}

function flattenFolders(folders: FolderNode[], level = 0): FlatFolderNode[] {
    return folders.flatMap((folder) => [
        { ...folder, level },
        ...flattenFolders(folder.children ?? [], level + 1),
    ]);
}

function collectFolderIds(folder: FolderNode | null): FolderId[] {
    if (!folder) return [];
    return [folder.id, ...(folder.children ?? []).flatMap(collectFolderIds)];
}

function buildFolderDescendantMap(folders: FolderNode[]) {
    const map = new Map<FolderId, Set<FolderId>>();

    const visit = (folder: FolderNode): Set<FolderId> => {
        const ids = new Set<FolderId>([folder.id]);
        for (const child of folder.children ?? []) {
            for (const childId of visit(child)) ids.add(childId);
        }
        map.set(folder.id, ids);
        return ids;
    };

    folders.forEach(visit);
    return map;
}

function addFolderToTree(
    folders: FolderNode[],
    folder: FolderNode,
    parentId: FolderId | "root"
): FolderNode[] {
    if (parentId === "root") return [...folders, folder];
    return folders.map((current) => {
        if (current.id === parentId) {
            return { ...current, children: [...(current.children ?? []), folder] };
        }
        return {
            ...current,
            children: current.children ? addFolderToTree(current.children, folder, parentId) : undefined,
        };
    });
}

function removeFolderFromTree(folders: FolderNode[], id: FolderId): FolderNode[] {
    return folders
        .filter((folder) => folder.id !== id)
        .map((folder) => ({
            ...folder,
            children: folder.children ? removeFolderFromTree(folder.children, id) : undefined,
        }));
}

function extractFolderFromTree(
    folders: FolderNode[],
    id: FolderId
): { folders: FolderNode[]; folder: FolderNode | null } {
    let extracted: FolderNode | null = null;
    const nextFolders = folders.reduce<FolderNode[]>((acc, folder) => {
        if (folder.id === id) {
            extracted = folder;
            return acc;
        }
        if (!folder.children) {
            acc.push(folder);
            return acc;
        }
        const result = extractFolderFromTree(folder.children, id);
        if (result.folder) {
            extracted = result.folder;
            acc.push({ ...folder, children: result.folders });
            return acc;
        }
        acc.push(folder);
        return acc;
    }, []);

    return { folders: nextFolders, folder: extracted };
}

function insertFolderIntoTree(
    folders: FolderNode[],
    folder: FolderNode,
    targetId: FolderId,
    action: FolderDragAction
): FolderNode[] {
    if (action === "nest") {
        return folders.map((current) => {
            if (current.id === targetId) {
                return { ...current, children: [...(current.children ?? []), folder] };
            }
            return {
                ...current,
                children: current.children ? insertFolderIntoTree(current.children, folder, targetId, action) : undefined,
            };
        });
    }

    const insertAdjacent = (nodes: FolderNode[]): { nodes: FolderNode[]; inserted: boolean } => {
        const targetIndex = nodes.findIndex((node) => node.id === targetId);
        if (targetIndex >= 0) {
            const nextNodes = [...nodes];
            nextNodes.splice(action === "reorder-above" ? targetIndex : targetIndex + 1, 0, folder);
            return { nodes: nextNodes, inserted: true };
        }

        let inserted = false;
        const nextNodes = nodes.map((node) => {
            if (!node.children || inserted) return node;
            const result = insertAdjacent(node.children);
            if (result.inserted) {
                inserted = true;
                return { ...node, children: result.nodes };
            }
            return node;
        });

        return { nodes: nextNodes, inserted };
    };

    return insertAdjacent(folders).nodes;
}

const copy = {
    en: {
        title: "All items",
        libraryTitle: "Media library",
        libraries: "Libraries",
        folders: "Folders",
        smartFolders: "Smart folders",
        settings: "Library settings",
        settingsUnavailable: "Library settings are not configurable in this preview",
        allItems: "All items",
        uncategorized: "Uncategorized",
        trash: "Trash",
        favorites: "Favorites",
        specCheck: "Spec check",
        compressed: "Compressed",
        search: "Search assets...",
        group: "Group",
        groupNone: "None",
        groupFolder: "Folder",
        groupType: "Type",
        groupRating: "Rating",
        filter: "Filter",
        filterColor: "Color",
        filterTag: "Tag",
        filterRating: "Rating",
        filterType: "Type",
        filterFolder: "Folder",
        filterShape: "Shape",
        filterSize: "Size",
        filterSizeCustom: "Custom",
        minSize: "Min",
        maxSize: "Max",
        addFilter: "Add Filter",
        noMoreFilters: "All filters added",
        removeFilter: "Remove this filter",
        clearAll: "Clear All",
        searchAll: "All",
        searchAi: "AI",
        add: "Add",
        details: "Details",
        showDetails: "Show details",
        hideDetails: "Hide details",
        itemsUnit: "items",
        sortDate: "Date",
        sortName: "Name",
        sortSize: "Size",
        sortRating: "Rating",
        emptyTitle: "No assets found",
        emptyDescription: "Try changing the search query or folder.",
        chooseTitle: "Choose assets",
        chooseDescription: "Select media to add to the current workspace.",
        chooseSearch: "Search importable assets...",
        chooseConfirm: "Add selected",
        chooseConfirmDisabledReason: "Select at least one asset before adding.",
        chooseEmptyTitle: "No importable assets",
        chooseEmptyDescription: "Everything in this source is already in the library.",
        createFolder: "Create folder",
        folderName: "Folder name",
        folderNamePlaceholder: "Enter folder name",
        folderNameRequired: "Enter a folder name before creating it.",
        parentFolder: "Parent folder",
        noParent: "No parent (root)",
        create: "Create",
        cancel: "Cancel",
        deleteFolder: "Delete folder",
        deleteFolderDescription: "Items inside this folder will be moved to Uncategorized. This action cannot be undone.",
        confirmDelete: "Delete",
        favorite: "Favorite",
        share: "Share URL",
        preview: "Preview",
        download: "Download",
        close: "Close",
        deleteAsset: "Delete permanently",
        deleteAssetDescription: "Are you sure you want to permanently delete this item?",
        shareImage: "Share image",
        publicLink: "Public link",
        publicLinkTooltip: "Toggle whether people with the link can view this image.",
        rating: "Rating",
        sharingPrivate: "Only you can view this image.",
        sharingDisabled: "Sharing is disabled",
        shareUrl: "Share URL",
        copyUrl: "Copy URL",
        copied: "Copied",
        edit: "Edit",
        fitWidth: "Fit width",
        reset: "Reset",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        rotate: "Rotate",
        save: "Save",
        previous: "Previous",
        next: "Next",
        metadata: "Metadata",
        dimensions: "Dimensions",
        type: "Type",
        size: "Size",
        created: "Created",
    },
    ja: {
        title: "すべての素材",
        libraryTitle: "メディアライブラリ",
        libraries: "ライブラリ",
        folders: "フォルダ",
        smartFolders: "スマートフォルダ",
        settings: "ライブラリ設定",
        settingsUnavailable: "このプレビューではライブラリ設定を変更できません",
        allItems: "すべての素材",
        uncategorized: "未分類",
        trash: "ゴミ箱",
        favorites: "お気に入り",
        specCheck: "品質チェック",
        compressed: "圧縮済み",
        search: "素材を検索...",
        group: "グループ",
        groupNone: "なし",
        groupFolder: "フォルダ",
        groupType: "種類",
        groupRating: "評価",
        filter: "フィルター",
        filterColor: "色",
        filterTag: "タグ",
        filterRating: "評価",
        filterType: "種類",
        filterFolder: "フォルダ",
        filterShape: "形状",
        filterSize: "容量",
        filterSizeCustom: "カスタム",
        minSize: "最小",
        maxSize: "最大",
        addFilter: "フィルター追加",
        noMoreFilters: "追加できるフィルターはありません",
        removeFilter: "このフィルターを外す",
        clearAll: "すべて解除",
        searchAll: "すべて",
        searchAi: "AI",
        add: "追加",
        details: "詳細",
        showDetails: "詳細を表示",
        hideDetails: "詳細を閉じる",
        itemsUnit: "件",
        sortDate: "日付",
        sortName: "名前順",
        sortSize: "サイズ",
        sortRating: "評価",
        emptyTitle: "素材が見つかりません",
        emptyDescription: "検索条件かフォルダを変更してください。",
        chooseTitle: "素材を選択",
        chooseDescription: "現在のワークスペースに追加するメディアを選択します。",
        chooseSearch: "追加できる素材を検索...",
        chooseConfirm: "選択した素材を追加",
        chooseConfirmDisabledReason: "追加する素材を1件以上選択してください。",
        chooseEmptyTitle: "追加できる素材はありません",
        chooseEmptyDescription: "このソースの素材はすべてライブラリに追加済みです。",
        createFolder: "フォルダを作成",
        folderName: "フォルダ名",
        folderNamePlaceholder: "フォルダ名を入力",
        folderNameRequired: "フォルダ名を入力すると作成できます。",
        parentFolder: "親フォルダ",
        noParent: "親なし（ルート）",
        create: "作成",
        cancel: "キャンセル",
        deleteFolder: "フォルダを削除",
        deleteFolderDescription: "このフォルダ内の素材は未分類へ移動します。この操作は取り消せません。",
        confirmDelete: "削除",
        favorite: "お気に入り",
        share: "共有URL",
        preview: "プレビュー",
        download: "ダウンロード",
        close: "閉じる",
        deleteAsset: "完全に削除",
        deleteAssetDescription: "この項目を完全に削除してもよろしいですか？",
        shareImage: "画像を共有",
        publicLink: "公開リンク",
        publicLinkTooltip: "リンクを知っている人がこの画像を表示できるか切り替えます。",
        rating: "評価",
        sharingPrivate: "この画像を表示できるのは自分だけです。",
        sharingDisabled: "共有は無効です",
        shareUrl: "共有URL",
        copyUrl: "URLをコピー",
        copied: "コピーしました",
        edit: "編集",
        fitWidth: "横幅いっぱい",
        reset: "元に戻す",
        zoomIn: "拡大",
        zoomOut: "縮小",
        rotate: "回転",
        save: "保存",
        previous: "前へ",
        next: "次へ",
        metadata: "メタデータ",
        dimensions: "サイズ",
        type: "形式",
        size: "容量",
        created: "作成日",
    },
};

function parseAssetSize(size?: string) {
    if (!size) return 0;
    const match = size.match(/([\d.]+)\s*(KB|MB|GB)?/i);
    if (!match) return 0;
    const value = Number(match[1]);
    const unit = match[2]?.toUpperCase();
    if (unit === "GB") return value * 1024 * 1024;
    if (unit === "MB") return value * 1024;
    return value;
}

function mediaRating(item: MediaAsset) {
    return item.rating ?? 0;
}

function qualityScore(item: MediaAsset) {
    return item.analysis?.scores?.total ?? 0;
}

function assetShape(item: MediaAsset) {
    if (!item.width || !item.height) return "unknown";
    const ratio = item.width / item.height;
    if (ratio > 2.5) return "banner";
    if (ratio > 1.15) return "landscape";
    if (ratio < 0.85) return "portrait";
    return "square";
}

function assetSizeBucket(item: MediaAsset) {
    const size = parseAssetSize(item.size);
    if (size >= 3072) return "large";
    if (size >= 1024) return "medium";
    return "small";
}

function clampSizeRange(value: number, max: number) {
    return Math.min(max, Math.max(SIZE_RANGE_MIN_MB, Number(value.toFixed(1))));
}

export function MediaLibraryTemplateDemo({
    className,
    viewport = "desktop",
}: {
    className?: string;
    viewport?: MediaLibraryViewport;
}) {
    const { locale } = useLocale();
    const labels = copy[locale];
    const isDesktop = viewport === "desktop";
    const isMobile = viewport === "mobile";
    const isCompact = !isDesktop;
    const showInlineSidebar = isDesktop;
    const [items, setItems] = useState<MediaAsset[]>(MOCK_ITEMS);
    const [folders, setFolders] = useState<FolderNode[]>(INITIAL_FOLDERS);
    const [smartFolders, setSmartFolders] = useState<SmartFolderId[]>(INITIAL_SMART_FOLDERS);
    const [foldersExpanded, setFoldersExpanded] = useState(true);
    const [smartFoldersExpanded, setSmartFoldersExpanded] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Record<FolderId, boolean>>({
        social: true,
        line: true,
        "line-test": true,
    });
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderParentId, setNewFolderParentId] = useState<FolderId | "root">("root");
    const [folderToDelete, setFolderToDelete] = useState<FolderNode | null>(null);
    const [draggedFolderId, setDraggedFolderId] = useState<FolderId | null>(null);
    const [folderDragTarget, setFolderDragTarget] = useState<{
        id: FolderId;
        action: FolderDragAction;
    } | null>(null);
    const [draggedSmartFolderId, setDraggedSmartFolderId] = useState<SmartFolderId | null>(null);
    const [smartFolderDragTarget, setSmartFolderDragTarget] = useState<{
        id: SmartFolderId;
        action: FolderReorderAction;
    } | null>(null);
    const [activeFolder, setActiveFolder] = useState<LibraryView>('all');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(MOCK_ITEMS[0].id);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortKey>("date-desc");
    const [groupMode, setGroupMode] = useState<GroupMode>("none");
    const [searchOpen, setSearchOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [cardWidth, setCardWidth] = useState(180);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [visibleOptionalFilters, setVisibleOptionalFilters] = useState<OptionalFilterKind[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [customSizeRange, setCustomSizeRange] = useState<[number, number] | null>(null);
    const [shareAssetId, setShareAssetId] = useState<string | null>(null);
    const [publicShareIds, setPublicShareIds] = useState<string[]>([]);
    const [copiedShareUrl, setCopiedShareUrl] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const [assetTags, setAssetTags] = useState<Record<string, string[]>>(
        () => Object.fromEntries(MOCK_ITEMS.map((item) => [item.id, item.tags]))
    );
    const [assetNotes, setAssetNotes] = useState<Record<string, string>>({});
    const draggedFolderIdRef = React.useRef<FolderId | null>(null);
    const draggedSmartFolderIdRef = React.useRef<SmartFolderId | null>(null);

    const flatFolders = React.useMemo(() => flattenFolders(folders), [folders]);
    const folderById = React.useMemo(
        () => new Map(flatFolders.map((folder) => [folder.id, folder])),
        [flatFolders]
    );
    const folderDescendantMap = React.useMemo(() => buildFolderDescendantMap(folders), [folders]);
    const folderFilterOptions = React.useMemo(
        () => [
            { label: labels.uncategorized, value: "uncat" },
            ...flatFolders.map((folder) => ({
                label: `${"— ".repeat(folder.level)}${locale === "ja" ? folder.nameJa : folder.name}`,
                value: folder.id,
            })),
        ],
        [flatFolders, labels.uncategorized, locale]
    );
    const shapeFilterOptions = React.useMemo(
        () => [
            { label: locale === "ja" ? "正方形" : "Square", value: "square" },
            { label: locale === "ja" ? "横長" : "Landscape", value: "landscape" },
            { label: locale === "ja" ? "縦長" : "Portrait", value: "portrait" },
            { label: locale === "ja" ? "バナー" : "Banner", value: "banner" },
            { label: locale === "ja" ? "不明" : "Unknown", value: "unknown" },
        ],
        [locale]
    );
    const sizeFilterOptions = React.useMemo(
        () => [
            { label: locale === "ja" ? "小（1MB 未満）" : "Small (< 1MB)", value: "small" },
            { label: locale === "ja" ? "中（1MB 以上）" : "Medium (1MB+)", value: "medium" },
            { label: locale === "ja" ? "大（3MB 以上）" : "Large (3MB+)", value: "large" },
            { label: labels.filterSizeCustom, value: "custom" },
        ],
        [labels.filterSizeCustom, locale]
    );
    const selectedItem = items.find(i => i.id === selectedItemId);
    const shareAsset = shareAssetId ? items.find((item) => item.id === shareAssetId) ?? null : null;
    const isSharePublic = shareAsset ? publicShareIds.includes(shareAsset.id) : false;
    const selectedTags = selectedItem ? assetTags[selectedItem.id] ?? selectedItem.tags : [];
    const selectedNote = selectedItem ? assetNotes[selectedItem.id] ?? "" : "";
    const lightboxAsset = lightboxIndex !== null ? items[lightboxIndex] : null;
    const assetItems = React.useMemo(
        () => items.map((item) => ({
            ...item,
        })),
        [items]
    );
    const sizeRangeMaxMb = React.useMemo(
        () => Math.max(1, Math.ceil(Math.max(...assetItems.map((item) => parseAssetSize(item.size))) / 1024)),
        [assetItems]
    );
    const resolvedCustomSizeRange = customSizeRange ?? [SIZE_RANGE_MIN_MB, sizeRangeMaxMb] as [number, number];
    const normalizedQuery = query.trim().toLowerCase();
    const visibleItems = React.useMemo(
        () => assetItems
            .filter((item) => {
                if (activeFolder === "trash") return item.trashed;
                if (item.trashed) return false;
                if (activeFolder === "all") return true;
                if (activeFolder === "uncat") return !item.folderId;
                if (activeFolder === "favorite") return item.isFavorite;
                if (activeFolder === "spec-check") return qualityScore(item) >= 8;
                if (activeFolder === "compressed") return item.compressed;
                const folderIds = folderDescendantMap.get(activeFolder);
                return folderIds ? Boolean(item.folderId && folderIds.has(item.folderId)) : item.folderId === activeFolder;
            })
            .filter((item) => {
                if (!normalizedQuery) return true;
                return [item.title, item.type, item.size, ...item.tags].some((value) =>
                    String(value).toLowerCase().includes(normalizedQuery)
                );
            })
            .filter((item) => {
                if (selectedTypes.length > 0 && (!item.type || !selectedTypes.includes(item.type.toUpperCase()))) {
                    return false;
                }
                if (selectedRating !== null && mediaRating(item) < selectedRating) {
                    return false;
                }
                if (selectedFilterTags.length > 0 && !selectedFilterTags.some((tag) => item.tags.includes(tag))) {
                    return false;
                }
                if (selectedColors.length > 0 && !selectedColors.some((color) => assetColorKeys(item).includes(color))) {
                    return false;
                }
                if (selectedFolders.length > 0) {
                    const isSelectedFolder = selectedFolders.some((folderId) => {
                        if (folderId === "uncat") return !item.folderId;
                        const folderIds = folderDescendantMap.get(folderId);
                        return folderIds ? Boolean(item.folderId && folderIds.has(item.folderId)) : item.folderId === folderId;
                    });
                    if (!isSelectedFolder) return false;
                }
                if (selectedShapes.length > 0 && !selectedShapes.includes(assetShape(item))) {
                    return false;
                }
                if (selectedSizes.length > 0) {
                    const itemSizeKb = parseAssetSize(item.size);
                    const sizeMatches = selectedSizes.some((size) => {
                        if (size === "custom") {
                            return itemSizeKb >= resolvedCustomSizeRange[0] * 1024 && itemSizeKb <= resolvedCustomSizeRange[1] * 1024;
                        }
                        return assetSizeBucket(item) === size;
                    });
                    if (!sizeMatches) return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === "name-asc") return a.title.localeCompare(b.title);
                if (sortBy === "size-desc") return parseAssetSize(b.size) - parseAssetSize(a.size);
                if (sortBy === "rating-desc") return mediaRating(b) - mediaRating(a);
                return b.createdAt.localeCompare(a.createdAt);
            }),
        [activeFolder, assetItems, folderDescendantMap, normalizedQuery, resolvedCustomSizeRange, selectedColors, selectedFilterTags, selectedFolders, selectedRating, selectedShapes, selectedSizes, selectedTypes, sortBy]
    );
    const visibleGroups: AssetGridGroup<MediaAsset>[] | undefined = React.useMemo(
        () => {
            if (groupMode === "none") return undefined;
            if (groupMode === "folder") {
                return ([
                    ...flatFolders.map((folder) => ({
                        id: folder.id,
                        label: locale === "ja" ? folder.nameJa : folder.name,
                        description: labels.folders,
                        items: visibleItems.filter((item) => {
                            const folderIds = folderDescendantMap.get(folder.id);
                            return folderIds ? Boolean(item.folderId && folderIds.has(item.folderId)) : item.folderId === folder.id;
                        }),
                    })),
                    {
                        id: "uncat",
                        label: labels.uncategorized,
                        description: labels.libraries,
                        items: visibleItems.filter((item) => !item.folderId),
                    },
                ] satisfies AssetGridGroup<MediaAsset>[]).filter((group) => group.items.length > 0);
            }
            if (groupMode === "type") {
                return Array.from(new Set(visibleItems.map((item) => item.type ?? "Asset"))).map((type) => ({
                    id: type,
                    label: type,
                    items: visibleItems.filter((item) => (item.type ?? "Asset") === type),
                }));
            }
            return [
                { id: "rated", label: locale === "ja" ? "評価あり" : "Rated", items: visibleItems.filter((item) => mediaRating(item) > 0) },
                { id: "unrated", label: locale === "ja" ? "未評価" : "Unrated", items: visibleItems.filter((item) => mediaRating(item) === 0) },
            ].filter((group) => group.items.length > 0);
        },
        [flatFolders, folderDescendantMap, groupMode, labels.folders, labels.libraries, labels.uncategorized, locale, visibleItems]
    );
    const groupLabel =
        groupMode === "folder" ? labels.groupFolder :
        groupMode === "type" ? labels.groupType :
        groupMode === "rating" ? labels.groupRating :
        labels.group;
    const sortLabel =
        sortBy === "name-asc" ? labels.sortName :
        sortBy === "size-desc" ? labels.sortSize :
        sortBy === "rating-desc" ? labels.sortRating :
        labels.sortDate;
    const pickerItems = React.useMemo(
        () => PICKER_ITEMS.filter((candidate) => !items.some((item) => item.id === candidate.id)),
        [items]
    );
    const tagOptions = React.useMemo(
        () => Array.from(new Set([...items.flatMap((item) => item.tags), ...SAMPLE_TAGS])).sort((a, b) => a.localeCompare(b)),
        [items]
    );
    const activeFilterCount = selectedTypes.length + selectedColors.length + selectedFilterTags.length + selectedFolders.length + selectedShapes.length + selectedSizes.length + (selectedRating ? 1 : 0);
    const smartFolderMeta: Record<SmartFolderId, { icon: React.ReactNode; label: string }> = {
        "spec-check": { icon: <WandSparkles size={18} />, label: labels.specCheck },
        compressed: { icon: <Archive size={18} />, label: labels.compressed },
    };

    React.useEffect(() => {
        if (visibleItems.length === 0) {
            setSelectedItemId(null);
            return;
        }
        if (!selectedItemId || !visibleItems.some((item) => item.id === selectedItemId)) {
            setSelectedItemId(visibleItems[0].id);
        }
    }, [selectedItemId, visibleItems]);

    React.useEffect(() => {
        setCardWidth(isMobile ? 150 : viewport === "tablet" ? 170 : 180);
    }, [isMobile, viewport]);

    const countFor = (view: LibraryView) => {
        if (view === "trash") return items.filter((item) => item.trashed).length;
        const active = items.filter((item) => !item.trashed);
        if (view === "all") return active.length;
        if (view === "uncat") return active.filter((item) => !item.folderId).length;
        if (view === "favorite") return active.filter((item) => item.isFavorite).length;
        if (view === "spec-check") return active.filter((item) => qualityScore(item) >= 8).length;
        if (view === "compressed") return active.filter((item) => item.compressed).length;
        const folderIds = folderDescendantMap.get(view);
        return active.filter((item) => folderIds ? Boolean(item.folderId && folderIds.has(item.folderId)) : item.folderId === view).length;
    };
    const selectPreview = (asset: AssetCardAsset) => {
        const index = items.findIndex((item) => item.id === asset.id);
        setSelectedItemId(asset.id);
        setLightboxIndex(index >= 0 ? index : null);
    };
    const selectAssetForDetails = (asset: AssetCardAsset) => {
        setSelectedItemId(asset.id);
        if (isDesktop) {
            setDetailsOpen(true);
        } else {
            setDetailsSheetOpen(true);
        }
    };
    const closeDetails = () => {
        if (isDesktop) {
            setDetailsOpen(false);
        } else {
            setDetailsSheetOpen(false);
        }
    };
    const toggleFavorite = (asset: AssetCardAsset) => {
        setItems((current) =>
            current.map((item) =>
                item.id === asset.id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    };
    const updateAssetTitle = (title: string, asset: AssetCardAsset) => {
        setItems((current) =>
            current.map((item) =>
                item.id === asset.id ? { ...item, title } : item
            )
        );
    };
    const updateAssetNote = (note: string, asset: AssetCardAsset) => {
        setAssetNotes((current) => ({ ...current, [asset.id]: note }));
    };
    const updateRating = (rating: number, asset: AssetCardAsset) => {
        setItems((current) =>
            current.map((item) =>
                item.id === asset.id ? { ...item, rating } : item
            )
        );
    };
    const openShareDialog = (asset: AssetCardAsset) => {
        setShareAssetId(asset.id);
        setCopiedShareUrl(false);
    };
    const downloadAsset = (asset: AssetCardAsset) => {
        if (!asset.src) return;
        const link = document.createElement("a");
        link.href = asset.src;
        link.download = asset.title || "asset";
        link.rel = "noopener";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    const deleteAsset = () => {
        if (!assetToDelete) return;
        const deletedId = assetToDelete.id;
        setItems((current) => current.filter((item) => item.id !== deletedId));
        setAssetTags((current) => {
            const next = { ...current };
            delete next[deletedId];
            return next;
        });
        setAssetNotes((current) => {
            const next = { ...current };
            delete next[deletedId];
            return next;
        });
        setPublicShareIds((current) => current.filter((id) => id !== deletedId));
        setAssetToDelete(null);
        if (!isDesktop) {
            setDetailsSheetOpen(false);
        }
    };
    const toggleSharePublic = (checked: boolean) => {
        if (!shareAsset) return;
        setPublicShareIds((current) =>
            checked
                ? Array.from(new Set([...current, shareAsset.id]))
                : current.filter((id) => id !== shareAsset.id)
        );
        setCopiedShareUrl(false);
    };
    const copyShareUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedShareUrl(true);
            window.setTimeout(() => setCopiedShareUrl(false), 1400);
        } catch {
            setCopiedShareUrl(false);
        }
    };
    const activeViewTitle =
        activeFolder === "all" ? labels.allItems :
        activeFolder === "uncat" ? labels.uncategorized :
        activeFolder === "trash" ? labels.trash :
        activeFolder === "favorite" ? labels.favorites :
        activeFolder === "spec-check" ? labels.specCheck :
        activeFolder === "compressed" ? labels.compressed :
        folderById.get(activeFolder)
            ? locale === "ja"
                ? folderById.get(activeFolder)?.nameJa
                : folderById.get(activeFolder)?.name
            : labels.allItems;
    const selectFolder = (view: LibraryView) => {
        setActiveFolder(view);
        setSidebarOpen(false);
    };
    const openDetails = () => {
        if (isDesktop) {
            setDetailsOpen((open) => !open);
        } else {
            setDetailsSheetOpen(true);
        }
    };
    const toggleSelectedValue = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };
    const removeOptionalFilter = (kind: OptionalFilterKind) => {
        setVisibleOptionalFilters((current) => current.filter((filterKind) => filterKind !== kind));
        if (kind === "folder") setSelectedFolders([]);
        if (kind === "shape") setSelectedShapes([]);
        if (kind === "size") {
            setSelectedSizes([]);
            setCustomSizeRange(null);
        }
    };
    const resetCreateFolderForm = () => {
        setNewFolderName("");
        setNewFolderParentId("root");
    };
    const createFolder = () => {
        const name = newFolderName.trim();
        if (!name) return;
        const id = `folder-${Date.now()}`;
        const folder: FolderNode = { id, name, nameJa: name };
        setFolders((current) => addFolderToTree(current, folder, newFolderParentId));
        if (newFolderParentId !== "root") {
            setExpandedFolders((current) => ({ ...current, [newFolderParentId]: true }));
        }
        setActiveFolder(id);
        setCreateFolderOpen(false);
        resetCreateFolderForm();
    };
    const deleteFolder = () => {
        if (!folderToDelete) return;
        const folderIds = new Set(collectFolderIds(folderToDelete));
        setFolders((current) => removeFolderFromTree(current, folderToDelete.id));
        setItems((current) =>
            current.map((item) =>
                item.folderId && folderIds.has(item.folderId) ? { ...item, folderId: undefined } : item
            )
        );
        setExpandedFolders((current) => {
            const next = { ...current };
            for (const id of folderIds) delete next[id];
            return next;
        });
        if (folderIds.has(activeFolder)) {
            setActiveFolder("uncat");
        }
        setFolderToDelete(null);
    };
    const canDropFolder = (targetId: FolderId) => {
        const sourceId = draggedFolderIdRef.current ?? draggedFolderId;
        if (!sourceId || sourceId === targetId) return false;
        return !folderDescendantMap.get(sourceId)?.has(targetId);
    };
    const resolveFolderDragAction = (event: React.DragEvent, targetId: FolderId): FolderDragAction | null => {
        if (!canDropFolder(targetId)) return null;
        const rect = event.currentTarget.getBoundingClientRect();
        const yRatio = (event.clientY - rect.top) / rect.height;
        if (yRatio < 0.25) return "reorder-above";
        if (yRatio > 0.75) return "reorder-below";
        return "nest";
    };
    const dropFolder = (targetId: FolderId, action: FolderDragAction | null) => {
        const sourceId = draggedFolderIdRef.current ?? draggedFolderId;
        if (!sourceId || !action || !canDropFolder(targetId)) {
            setFolderDragTarget(null);
            return;
        }

        setFolders((current) => {
            const extracted = extractFolderFromTree(current, sourceId);
            if (!extracted.folder) return current;
            return insertFolderIntoTree(extracted.folders, extracted.folder, targetId, action);
        });

        if (action === "nest") {
            setExpandedFolders((current) => ({ ...current, [targetId]: true }));
        }
        draggedFolderIdRef.current = null;
        setFolderDragTarget(null);
        setDraggedFolderId(null);
    };
    const canDropSmartFolder = (targetId: SmartFolderId) => {
        const sourceId = draggedSmartFolderIdRef.current ?? draggedSmartFolderId;
        return Boolean(sourceId && sourceId !== targetId);
    };
    const resolveSmartFolderDragAction = (
        event: React.DragEvent,
        targetId: SmartFolderId
    ): FolderReorderAction | null => {
        if (!canDropSmartFolder(targetId)) return null;
        const rect = event.currentTarget.getBoundingClientRect();
        const yRatio = (event.clientY - rect.top) / rect.height;
        return yRatio < 0.5 ? "reorder-above" : "reorder-below";
    };
    const dropSmartFolder = (targetId: SmartFolderId, action: FolderReorderAction | null) => {
        const sourceId = draggedSmartFolderIdRef.current ?? draggedSmartFolderId;
        if (!sourceId || !action || !canDropSmartFolder(targetId)) {
            setSmartFolderDragTarget(null);
            return;
        }

        setSmartFolders((current) => {
            if (!current.includes(sourceId) || !current.includes(targetId)) return current;
            const next = current.filter((id) => id !== sourceId);
            const targetIndex = next.indexOf(targetId);
            next.splice(action === "reorder-above" ? targetIndex : targetIndex + 1, 0, sourceId);
            return next;
        });
        draggedSmartFolderIdRef.current = null;
        setSmartFolderDragTarget(null);
        setDraggedSmartFolderId(null);
    };
    const buildFolderTreeNodes = (nodes: FolderNode[]): FileTreeNode[] =>
        nodes.map((folder) => ({
            id: folder.id,
            label: locale === "ja" ? folder.nameJa : folder.name,
            type: "folder",
            count: countFor(folder.id),
            children: folder.children ? buildFolderTreeNodes(folder.children) : undefined,
        }));
    const folderTreeNodes = buildFolderTreeNodes(folders);
    const expandedFolderSet = new Set(
        Object.entries(expandedFolders)
            .filter(([, open]) => open)
            .map(([id]) => id)
    );
    const updateExpandedFolders = (expanded: Set<string>) => {
        setExpandedFolders((current) => {
            const next = { ...current };
            flatFolders.forEach((folder) => {
                next[folder.id] = expanded.has(folder.id);
            });
            return next;
        });
    };
    const renderSmartFolderItems = () =>
        smartFolders.map((id) => {
            const meta = smartFolderMeta[id];
            return (
                <SidebarItem
                    key={id}
                    id={id}
                    icon={meta.icon}
                    label={meta.label}
                    isActive={activeFolder === id}
                    onClick={() => selectFolder(id)}
                    count={countFor(id)}
                    reserveChevronSpace={false}
                    draggable
                    onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", id);
                        draggedSmartFolderIdRef.current = id;
                        setDraggedSmartFolderId(id);
                        setSmartFolderDragTarget(null);
                    }}
                    onDragEnd={() => {
                        draggedSmartFolderIdRef.current = null;
                        setDraggedSmartFolderId(null);
                        setSmartFolderDragTarget(null);
                    }}
                    onDragOver={(event) => {
                        const action = resolveSmartFolderDragAction(event, id);
                        if (!action) return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setSmartFolderDragTarget({ id, action });
                    }}
                    onDrop={(event) => {
                        event.preventDefault();
                        dropSmartFolder(
                            id,
                            smartFolderDragTarget?.id === id
                                ? smartFolderDragTarget.action
                                : resolveSmartFolderDragAction(event, id)
                        );
                    }}
                    dragOverId={smartFolderDragTarget?.id ?? null}
                    dragAction={smartFolderDragTarget?.action ?? null}
                />
            );
        });
    const sidebarContent = (
        <div className="flex h-full w-full flex-col bg-muted/30">
            <div className="h-12 shrink-0 px-4 border-b border-border flex items-center justify-between bg-background">
                <span className="font-semibold text-foreground">{labels.libraryTitle}</span>
                <TooltipButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-not-allowed text-muted-foreground opacity-60"
                    aria-label={labels.settings}
                    aria-disabled="true"
                    tooltip={labels.settingsUnavailable}
                    tooltipSide="right"
                    tooltipPortalContainer={portalContainer}
                    onClick={(event) => event.preventDefault()}
                >
                    <Settings size={18} />
                </TooltipButton>
            </div>
            <ScrollArea className="h-full min-h-0 w-full flex-1">
                <div className="box-border w-full p-4">
                    <div className="text-xs font-bold text-muted-foreground mb-2 px-2">{labels.libraries.toUpperCase()}</div>
                    <div className="space-y-1">
                        <SidebarItem id="all" icon={<Grid size={18} />} label={labels.allItems} isActive={activeFolder === "all"} onClick={() => selectFolder("all")} count={countFor("all")} reserveChevronSpace={false} />
                        <SidebarItem id="favorite" icon={<Star size={18} />} label={labels.favorites} isActive={activeFolder === "favorite"} onClick={() => selectFolder("favorite")} count={countFor("favorite")} reserveChevronSpace={false} />
                        <SidebarItem id="uncat" icon={<Folder size={18} />} label={labels.uncategorized} isActive={activeFolder === "uncat"} onClick={() => selectFolder("uncat")} count={countFor("uncat")} reserveChevronSpace={false} />
                        <SidebarItem id="trash" icon={<Trash2 size={18} />} label={labels.trash} isActive={activeFolder === "trash"} onClick={() => selectFolder("trash")} count={countFor("trash")} reserveChevronSpace={false} />
                    </div>
                </div>
                <div className="box-border w-full p-4 pt-0">
                    <div className="mb-2 flex items-center justify-between pl-2">
                        <div className="text-xs font-bold text-muted-foreground">{labels.folders.toUpperCase()}</div>
                        <div className="grid w-14 grid-cols-[1.5rem_1.5rem] items-center justify-end">
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground"
                                aria-label={labels.createFolder}
                                tooltip={labels.createFolder}
                                tooltipSide="top"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                onClick={() => setCreateFolderOpen(true)}
                            >
                                <Plus size={14} />
                            </TooltipButton>
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground"
                                aria-label={labels.folders}
                                tooltip={labels.folders}
                                tooltipSide="top"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                onClick={() => setFoldersExpanded((open) => !open)}
                            >
                                <ChevronRight size={14} className={cn("transition-transform", foldersExpanded && "rotate-90")} />
                            </TooltipButton>
                        </div>
                    </div>
                    {foldersExpanded ? (
                        <FileTree
                            nodes={folderTreeNodes}
                            expanded={expandedFolderSet}
                            onExpandedChange={updateExpandedFolders}
                            selectedIds={[activeFolder]}
                            onSelectedIdsChange={(_, node) => selectFolder(node.id)}
                            renderNodeActions={(node) => {
                                const folder = folderById.get(node.id);
                                if (!folder) return null;
                                const label = locale === "ja" ? folder.nameJa : folder.name;

                                return (
                                    <TooltipButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                        aria-label={`${label} ${labels.deleteFolder}`}
                                        tooltip={`${label} ${labels.deleteFolder}`}
                                        tooltipSide="right"
                                        tooltipPortalContainer={portalContainer}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setFolderToDelete(folder);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </TooltipButton>
                                );
                            }}
                            getNodeRowProps={(node) => ({
                                draggable: true,
                                className: cn(
                                    draggedFolderId === node.id && "opacity-50",
                                    folderDragTarget?.id === node.id && folderDragTarget.action === "nest" && "bg-primary-subtle ring-1 ring-primary-border",
                                    folderDragTarget?.id === node.id && folderDragTarget.action !== "nest" && "ring-1 ring-primary-border"
                                ),
                                onDragStart: (event) => {
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setData("text/plain", node.id);
                                    draggedFolderIdRef.current = node.id;
                                    setDraggedFolderId(node.id);
                                    setFolderDragTarget(null);
                                },
                                onDragEnd: () => {
                                    draggedFolderIdRef.current = null;
                                    setDraggedFolderId(null);
                                    setFolderDragTarget(null);
                                },
                                onDragOver: (event) => {
                                    const action = resolveFolderDragAction(event, node.id);
                                    if (!action) return;
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = "move";
                                    setFolderDragTarget({ id: node.id, action });
                                },
                                onDrop: (event) => {
                                    event.preventDefault();
                                    dropFolder(
                                        node.id,
                                        folderDragTarget?.id === node.id
                                            ? folderDragTarget.action
                                            : resolveFolderDragAction(event, node.id)
                                    );
                                },
                            })}
                        />
                    ) : null}
                </div>
                <div className="box-border w-full p-4 pt-0">
                    <div className="mb-2 flex items-center justify-between pl-2">
                        <div className="text-xs font-bold text-muted-foreground">{labels.smartFolders.toUpperCase()}</div>
                        <div className="grid w-14 grid-cols-[1.5rem_1.5rem] items-center justify-end">
                            <TooltipButton
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="col-start-2 h-6 w-6 text-muted-foreground"
                                aria-label={labels.smartFolders}
                                tooltip={labels.smartFolders}
                                tooltipSide="top"
                                tooltipPortalContainer={portalContainer}
                                tooltipCloseOnPress
                                onClick={() => setSmartFoldersExpanded((open) => !open)}
                            >
                                <ChevronRight size={14} className={cn("transition-transform", smartFoldersExpanded && "rotate-90")} />
                            </TooltipButton>
                        </div>
                    </div>
                    {smartFoldersExpanded ? (
                        <div className="space-y-1">
                            {renderSmartFolderItems()}
                        </div>
                    ) : null}
                </div>
            </ScrollArea>
        </div>
    );
    const detailsContent = (
        <div className="relative h-full">
            <AssetInspectorPanel
                className="border-l-0"
                asset={selectedItem ?? null}
                title={labels.details}
                note={selectedNote}
                tags={selectedTags}
                onTitleChange={(title) => selectedItem && updateAssetTitle(title, selectedItem)}
                onNoteChange={(note) => selectedItem && updateAssetNote(note, selectedItem)}
                onTagsChange={(tags) => selectedItem && setAssetTags((current) => ({ ...current, [selectedItem.id]: tags }))}
                tagSuggestions={locale === "ja" ? ["キャンペーン", "Web", "SNS", "商品"] : ["Campaign", "Website", "SNS", "Product"]}
                onPreview={selectPreview}
                onFavorite={toggleFavorite}
                onShare={openShareDialog}
                onDownload={downloadAsset}
                onDelete={(asset) => setAssetToDelete(asset as MediaAsset)}
                onClose={closeDetails}
                onRatingChange={updateRating}
                onAnalyze={() => {}}
                onCompress={() => {}}
                tooltipPortalContainer={portalContainer}
                labels={{
                    title: locale === "ja" ? "タイトル" : "Title",
                    note: locale === "ja" ? "メモ" : "Note",
                    tags: locale === "ja" ? "タグ" : "Tags",
                    rating: labels.rating,
                    metadata: locale === "ja" ? "メタデータ" : "Metadata",
                    actions: locale === "ja" ? "操作" : "Actions",
                    analyze: locale === "ja" ? "解析" : "Analyze",
                    compress: locale === "ja" ? "圧縮" : "Compress",
                    favorite: labels.favorite,
                    preview: labels.preview,
                    share: labels.share,
                    download: labels.download,
                    delete: labels.deleteAsset,
                    close: labels.close,
                    edit: labels.edit,
                    save: labels.save,
                    cancel: labels.cancel,
                }}
            />
        </div>
    );
    const clearLabel = locale === "ja" ? "クリア" : "Clear";
    const shareUrl = shareAsset
        ? `${typeof window === "undefined" ? "" : window.location.origin}/share/media/${shareAsset.id}`
        : "";

    return (
        <div ref={setPortalContainer} className={cn("relative h-full w-full border rounded-lg overflow-hidden bg-background text-foreground flex", className)}>
            <div className="flex-1 flex overflow-hidden">
                <MediaLibraryTemplate
                    className="h-full min-h-0 w-full"
                    sidebar={showInlineSidebar ? sidebarContent : null}
                    details={isDesktop && detailsOpen ? detailsContent : null}
                >
                    <div className="flex h-full min-h-0 flex-col bg-muted/30">
                        <div className="shrink-0 border-b bg-background">
                            <div className={cn("flex h-12 items-center justify-between gap-2 border-b", isCompact ? "px-2" : "px-6")}>
                                <div className="flex min-w-0 flex-1 items-center">
                                    {isCompact ? (
                                        <TooltipButton
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-muted-foreground"
                                            aria-label={labels.libraryTitle}
                                            tooltip={labels.libraryTitle}
                                            tooltipSide="bottom"
                                            tooltipPortalContainer={portalContainer}
                                            tooltipCloseOnPress
                                            onClick={() => setSidebarOpen(true)}
                                        >
                                            <Menu className="h-5 w-5" aria-hidden="true" />
                                        </TooltipButton>
                                    ) : null}
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-1.5">
                                    <TooltipButton
                                        type="button"
                                        variant={searchOpen ? "secondary" : "ghost"}
                                        size="icon"
                                        className="text-muted-foreground"
                                        aria-label={labels.search}
                                        tooltip={labels.search}
                                        tooltipSide="bottom"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => setSearchOpen((open) => !open)}
                                    >
                                        <Search className="h-5 w-5" aria-hidden="true" />
                                    </TooltipButton>
                                    <TooltipButton
                                        type="button"
                                        variant={filtersOpen ? "secondary" : "ghost"}
                                        size="icon"
                                        className="relative text-muted-foreground"
                                        aria-label={labels.filter}
                                        tooltip={labels.filter}
                                        tooltipSide="bottom"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={() => setFiltersOpen((open) => !open)}
                                    >
                                        <Funnel className="h-5 w-5" aria-hidden="true" />
                                        {filtersOpen || activeFilterCount > 0 ? (
                                            <span className="absolute right-1.5 top-1.5 flex h-2.5 min-w-2.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                                                {activeFilterCount > 0 ? activeFilterCount : ""}
                                            </span>
                                        ) : null}
                                    </TooltipButton>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <TooltipButton
                                                type="button"
                                                variant={groupMode !== "none" ? "secondary" : "ghost"}
                                                size={isCompact ? "icon" : "sm"}
                                                className="gap-2 text-muted-foreground"
                                                aria-label={labels.group}
                                                tooltip={labels.group}
                                                tooltipSide="bottom"
                                                tooltipPortalContainer={portalContainer}
                                                tooltipCloseOnPress
                                            >
                                                <Layout className="h-5 w-5" aria-hidden="true" />
                                                {isDesktop ? <span>{groupLabel}</span> : null}
                                            </TooltipButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-44" portalContainer={portalContainer}>
                                            {[
                                                ["none", labels.groupNone],
                                                ["folder", labels.groupFolder],
                                                ["type", labels.groupType],
                                                ["rating", labels.groupRating],
                                            ].map(([value, label]) => (
                                                <DropdownMenuItem
                                                    key={value}
                                                    onSelect={() => setGroupMode(value as GroupMode)}
                                                    className="justify-between"
                                                >
                                                    <span>{label}</span>
                                                    {groupMode === value ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <TooltipButton
                                                type="button"
                                                variant="ghost"
                                                size={isCompact ? "icon" : "sm"}
                                                className="gap-2 text-muted-foreground"
                                                aria-label={sortLabel}
                                                tooltip={sortLabel}
                                                tooltipSide="bottom"
                                                tooltipPortalContainer={portalContainer}
                                                tooltipCloseOnPress
                                            >
                                                <ArrowUpDown className="h-5 w-5" aria-hidden="true" />
                                                {isDesktop ? <span>{sortLabel}</span> : null}
                                            </TooltipButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-44" portalContainer={portalContainer}>
                                            {[
                                                ["date-desc", labels.sortDate],
                                                ["name-asc", labels.sortName],
                                                ["size-desc", labels.sortSize],
                                                ["rating-desc", labels.sortRating],
                                            ].map(([value, label]) => (
                                                <DropdownMenuItem
                                                    key={value}
                                                    onSelect={() => setSortBy(value as SortKey)}
                                                    className="justify-between"
                                                >
                                                    <span>{label}</span>
                                                    {sortBy === value ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {isDesktop ? (
                                        <Slider
                                            min={140}
                                            max={260}
                                            value={cardWidth}
                                            onChange={(event) => setCardWidth(Number(event.target.value))}
                                            className="mx-2 w-28"
                                            aria-label="Asset card size"
                                        />
                                    ) : null}
                                    {isCompact ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <TooltipButton
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground"
                                                    aria-label={locale === "ja" ? "表示サイズ" : "Display size"}
                                                    tooltip={locale === "ja" ? "表示サイズ" : "Display size"}
                                                    tooltipSide="bottom"
                                                    tooltipPortalContainer={portalContainer}
                                                    tooltipCloseOnPress
                                                >
                                                    <Maximize2 className="h-5 w-5" aria-hidden="true" />
                                                </TooltipButton>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align="end"
                                                className="w-72 p-4"
                                                portalContainer={portalContainer}
                                            >
                                                <Slider
                                                    min={140}
                                                    max={260}
                                                    value={cardWidth}
                                                    onChange={(event) => setCardWidth(Number(event.target.value))}
                                                    className="w-full"
                                                    aria-label="Asset card size"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : null}
                                    <TooltipButton
                                        type="button"
                                        variant={(isDesktop ? detailsOpen : detailsSheetOpen) ? "secondary" : "ghost"}
                                        size="icon"
                                        className="text-primary"
                                        aria-label={(isDesktop ? detailsOpen : detailsSheetOpen) ? labels.hideDetails : labels.showDetails}
                                        tooltip={(isDesktop ? detailsOpen : detailsSheetOpen) ? labels.hideDetails : labels.showDetails}
                                        tooltipSide="bottom"
                                        tooltipPortalContainer={portalContainer}
                                        tooltipCloseOnPress
                                        onClick={openDetails}
                                    >
                                        <Info size={18} />
                                    </TooltipButton>
                                </div>
                            </div>
                            <div className={cn("flex h-12 items-center justify-between gap-3 bg-muted/20", isMobile ? "px-3" : "px-6")}>
                                <h2 className="min-w-0 truncate text-base font-semibold text-foreground">{activeViewTitle}</h2>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {visibleItems.length} {labels.itemsUnit}
                                </span>
                            </div>
                            {searchOpen ? (
                                <div className={cn("border-t py-3", isMobile ? "px-3" : "px-6")}>
                                    <SearchInput
                                        value={query}
                                        onValueChange={setQuery}
                                        placeholder={labels.search}
                                        className="w-full"
                                    />
                                </div>
                            ) : null}
                            {filtersOpen ? (
                                <div className={cn("space-y-2 border-t py-3", isMobile ? "px-3" : "px-6")}>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        <FilterButton
                                            title={labels.filterColor}
                                            icon={<Palette className="h-4 w-4" aria-hidden="true" />}
                                            selectedValues={new Set(selectedColors)}
                                            clearLabel={clearLabel}
                                            portalContainer={portalContainer}
                                            contentClassName="w-80 p-4"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="text-sm font-medium text-muted-foreground">
                                                        {locale === "ja" ? "色を選択" : "Select Colors"}
                                                    </div>
                                                    {selectedColors.length > 0 ? (
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedColors([])}>
                                                            {clearLabel}
                                                        </Button>
                                                    ) : null}
                                                </div>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {COLOR_FILTERS.map((color) => (
                                                        <Tooltip key={color.id}>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    type="button"
                                                                    aria-label={color.label}
                                                                    className={cn(
                                                                        "h-9 w-9 rounded-full border-2 border-muted-foreground/70 ring-offset-background transition",
                                                                        selectedColors.includes(color.id) && "border-primary ring-2 ring-primary"
                                                                    )}
                                                                    style={{ backgroundColor: color.value }}
                                                                    onClick={() => toggleSelectedValue(color.id, setSelectedColors)}
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent portalContainer={portalContainer}>
                                                                {color.label}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                        </FilterButton>
                                        <FilterButton
                                            title={labels.filterTag}
                                            icon={<Tag className="h-4 w-4" aria-hidden="true" />}
                                            selectedValues={new Set(selectedFilterTags)}
                                            clearLabel={clearLabel}
                                            portalContainer={portalContainer}
                                            contentClassName="max-h-72 w-96 overflow-y-auto p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div className="text-sm font-medium text-muted-foreground">{labels.filterTag}</div>
                                                {selectedFilterTags.length > 0 ? (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFilterTags([])}>
                                                        {clearLabel}
                                                    </Button>
                                                ) : null}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {tagOptions.map((tag) => (
                                                    <Button
                                                        key={tag}
                                                        type="button"
                                                        variant={selectedFilterTags.includes(tag) ? "secondary" : "outline"}
                                                        size="sm"
                                                        className="h-8"
                                                        onClick={() => toggleSelectedValue(tag, setSelectedFilterTags)}
                                                    >
                                                        {tag}
                                                    </Button>
                                                ))}
                                            </div>
                                        </FilterButton>
                                        <FilterButton
                                            title={labels.filterRating}
                                            icon={<Star className="h-4 w-4" aria-hidden="true" />}
                                            selectedValues={selectedRating !== null ? new Set([String(selectedRating)]) : new Set()}
                                            clearLabel={clearLabel}
                                            portalContainer={portalContainer}
                                            contentClassName="w-72 p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    {locale === "ja" ? "最低評価" : "Minimum rating"}
                                                </div>
                                                {selectedRating !== null ? (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedRating(null)}>
                                                        {clearLabel}
                                                    </Button>
                                                ) : null}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">0</span>
                                                    <span className="font-medium tabular-nums text-foreground">
                                                        {(selectedRating ?? 0).toFixed(1)} / 5
                                                    </span>
                                                    <span className="text-muted-foreground">5</span>
                                                </div>
                                                <Slider
                                                    value={String(selectedRating ?? 0)}
                                                    min={0}
                                                    max={5}
                                                    step={0.5}
                                                    onChange={(event) => setSelectedRating(Number(Number(event.currentTarget.value).toFixed(1)))}
                                                    aria-label={labels.filterRating}
                                                />
                                            </div>
                                        </FilterButton>
                                        <FilterButton
                                            title={labels.filterType}
                                            icon={<FileType className="h-4 w-4" aria-hidden="true" />}
                                            options={TYPE_FILTERS.map((type) => ({ label: type, value: type }))}
                                            selectedValues={new Set(selectedTypes)}
                                            onFilterChange={(values) => setSelectedTypes(Array.from(values))}
                                            clearLabel={clearLabel}
                                            portalContainer={portalContainer}
                                        />
                                        {visibleOptionalFilters.includes("folder") ? (
                                            <FilterButton
                                                title={labels.filterFolder}
                                                icon={<Folder className="h-4 w-4" aria-hidden="true" />}
                                                selectedValues={new Set(selectedFolders)}
                                                clearLabel={clearLabel}
                                                portalContainer={portalContainer}
                                                contentClassName="w-72 p-3"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-sm font-medium text-muted-foreground">{labels.filterFolder}</div>
                                                        {selectedFolders.length > 0 ? (
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFolders([])}>
                                                                {clearLabel}
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                    <ScrollArea className="max-h-60 pr-2" viewportClassName="[&>div]:!space-y-1">
                                                        {folderFilterOptions.map((option) => (
                                                            <Button
                                                                key={option.value}
                                                                type="button"
                                                                variant={selectedFolders.includes(option.value) ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className="h-9 w-full justify-start gap-2 px-2"
                                                                onClick={() => toggleSelectedValue(option.value, setSelectedFolders)}
                                                            >
                                                                <span className="min-w-0 truncate">{option.label}</span>
                                                                {selectedFolders.includes(option.value) ? (
                                                                    <Check className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
                                                                ) : null}
                                                            </Button>
                                                        ))}
                                                    </ScrollArea>
                                                    <div className="border-t pt-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start text-muted-foreground"
                                                            onClick={() => removeOptionalFilter("folder")}
                                                        >
                                                            {labels.removeFilter}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FilterButton>
                                        ) : null}
                                        {visibleOptionalFilters.includes("shape") ? (
                                            <FilterButton
                                                title={labels.filterShape}
                                                icon={<Shapes className="h-4 w-4" aria-hidden="true" />}
                                                selectedValues={new Set(selectedShapes)}
                                                clearLabel={clearLabel}
                                                portalContainer={portalContainer}
                                                contentClassName="w-56 p-3"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-sm font-medium text-muted-foreground">{labels.filterShape}</div>
                                                        {selectedShapes.length > 0 ? (
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedShapes([])}>
                                                                {clearLabel}
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {shapeFilterOptions.map((option) => (
                                                            <Button
                                                                key={option.value}
                                                                type="button"
                                                                variant={selectedShapes.includes(option.value) ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className="h-9 w-full justify-start gap-2 px-2"
                                                                onClick={() => toggleSelectedValue(option.value, setSelectedShapes)}
                                                            >
                                                                <span className="min-w-0 truncate">{option.label}</span>
                                                                {selectedShapes.includes(option.value) ? (
                                                                    <Check className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
                                                                ) : null}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    <div className="border-t pt-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start text-muted-foreground"
                                                            onClick={() => removeOptionalFilter("shape")}
                                                        >
                                                            {labels.removeFilter}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FilterButton>
                                        ) : null}
                                        {visibleOptionalFilters.includes("size") ? (
                                            <FilterButton
                                                title={labels.filterSize}
                                                icon={<HardDrive className="h-4 w-4" aria-hidden="true" />}
                                                selectedValues={new Set(selectedSizes)}
                                                clearLabel={clearLabel}
                                                portalContainer={portalContainer}
                                                contentClassName="w-80 p-3"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-sm font-medium text-muted-foreground">{labels.filterSize}</div>
                                                        {selectedSizes.length > 0 ? (
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedSizes([])}>
                                                                {clearLabel}
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {sizeFilterOptions.map((option) => (
                                                            <Button
                                                                key={option.value}
                                                                type="button"
                                                                variant={selectedSizes.includes(option.value) ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className="h-9 w-full justify-start gap-2 px-2"
                                                                onClick={() => toggleSelectedValue(option.value, setSelectedSizes)}
                                                            >
                                                                <span className="min-w-0 truncate">{option.label}</span>
                                                                {selectedSizes.includes(option.value) ? (
                                                                    <Check className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
                                                                ) : null}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    {selectedSizes.includes("custom") ? (
                                                        <div className="space-y-3 rounded-md border bg-muted/20 p-3">
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <span>{labels.minSize}: {resolvedCustomSizeRange[0].toFixed(1)}MB</span>
                                                                <span>{labels.maxSize}: {resolvedCustomSizeRange[1].toFixed(1)}MB</span>
                                                            </div>
                                                            <RangeSlider
                                                                className="w-full"
                                                                min={SIZE_RANGE_MIN_MB}
                                                                max={sizeRangeMaxMb}
                                                                step={SIZE_RANGE_STEP_MB}
                                                                value={resolvedCustomSizeRange}
                                                                onValueChange={(nextRange) => {
                                                                    setCustomSizeRange([
                                                                        clampSizeRange(nextRange[0], sizeRangeMaxMb),
                                                                        clampSizeRange(nextRange[1], sizeRangeMaxMb),
                                                                    ]);
                                                                }}
                                                                minLabel={labels.minSize}
                                                                maxLabel={labels.maxSize}
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <label className="space-y-1">
                                                                    <span className="text-xs font-medium text-muted-foreground">{labels.minSize}</span>
                                                                    <NumberInput
                                                                        value={resolvedCustomSizeRange[0]}
                                                                        min={SIZE_RANGE_MIN_MB}
                                                                        max={resolvedCustomSizeRange[1]}
                                                                        step={SIZE_RANGE_STEP_MB}
                                                                        onValueChange={(nextValue) => {
                                                                            const nextMin = Math.min(clampSizeRange(nextValue, sizeRangeMaxMb), resolvedCustomSizeRange[1]);
                                                                            setCustomSizeRange([nextMin, resolvedCustomSizeRange[1]]);
                                                                        }}
                                                                        aria-label={labels.minSize}
                                                                    />
                                                                </label>
                                                                <label className="space-y-1">
                                                                    <span className="text-xs font-medium text-muted-foreground">{labels.maxSize}</span>
                                                                    <NumberInput
                                                                        value={resolvedCustomSizeRange[1]}
                                                                        min={resolvedCustomSizeRange[0]}
                                                                        max={sizeRangeMaxMb}
                                                                        step={SIZE_RANGE_STEP_MB}
                                                                        onValueChange={(nextValue) => {
                                                                            const nextMax = Math.max(clampSizeRange(nextValue, sizeRangeMaxMb), resolvedCustomSizeRange[0]);
                                                                            setCustomSizeRange([resolvedCustomSizeRange[0], nextMax]);
                                                                        }}
                                                                        aria-label={labels.maxSize}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    <div className="border-t pt-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start text-muted-foreground"
                                                            onClick={() => removeOptionalFilter("size")}
                                                        >
                                                            {labels.removeFilter}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FilterButton>
                                        ) : null}
                                    </div>
                                    <div className={cn("flex items-center gap-3", isMobile ? "overflow-x-auto pb-1" : "flex-wrap")}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                                                    <Plus className="h-4 w-4" aria-hidden="true" />
                                                    {labels.addFilter}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-44" portalContainer={portalContainer}>
                                                {(["folder", "shape", "size"] as OptionalFilterKind[])
                                                    .filter((kind) => !visibleOptionalFilters.includes(kind))
                                                    .map((kind) => (
                                                        <DropdownMenuItem
                                                            key={kind}
                                                            onSelect={() => setVisibleOptionalFilters((current) => [...current, kind])}
                                                        >
                                                            {kind === "folder" ? <Folder className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
                                                            {kind === "shape" ? <Shapes className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
                                                            {kind === "size" ? <HardDrive className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
                                                            {kind === "folder" ? labels.filterFolder : null}
                                                            {kind === "shape" ? labels.filterShape : null}
                                                            {kind === "size" ? labels.filterSize : null}
                                                        </DropdownMenuItem>
                                                    ))}
                                                {visibleOptionalFilters.length === 3 ? (
                                                    <DropdownMenuItem
                                                        disabled
                                                        disabledReason={labels.noMoreFilters}
                                                        disabledReasonPortalContainer={portalContainer}
                                                    >
                                                        {labels.noMoreFilters}
                                                    </DropdownMenuItem>
                                                ) : null}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <span className="h-5 border-l" />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                            onClick={() => {
                                                setSelectedTypes([]);
                                                setSelectedColors([]);
                                                setSelectedFilterTags([]);
                                                setSelectedRating(null);
                                                setSelectedFolders([]);
                                                setSelectedShapes([]);
                                                setSelectedSizes([]);
                                                setCustomSizeRange(null);
                                            }}
                                        >
                                            {labels.clearAll}
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <ScrollArea className={cn("min-h-0 w-full flex-1", isMobile ? "p-3" : "p-6")}>
                            <AssetGrid
                                items={visibleGroups ? undefined : visibleItems}
                                groups={visibleGroups}
                                selectedIds={selectedItemId ? [selectedItemId] : []}
                                onSelect={selectAssetForDetails}
                                onPreview={selectPreview}
                                onFavorite={toggleFavorite}
                                portalContainer={portalContainer}
                                minColumnWidth={cardWidth}
                                emptyTitle={labels.emptyTitle}
                                emptyDescription={labels.emptyDescription}
                                renderMeta={(item) => `${item.type} ${item.size} / ${item.createdAt}`}
                            />
                        </ScrollArea>
                    </div>
                </MediaLibraryTemplate>
            </div>
            {isCompact ? (
                <>
                    {(sidebarOpen || detailsSheetOpen) ? (
                        <button
                            type="button"
                            aria-label={labels.hideDetails}
                            className="absolute inset-0 z-40 bg-overlay/60"
                            onClick={() => {
                                setSidebarOpen(false);
                                setDetailsSheetOpen(false);
                            }}
                        />
                    ) : null}
                    <div
                        className={cn(
                            "absolute inset-y-0 left-0 z-50 w-72 max-w-[86%] overflow-hidden border-r bg-background shadow-xl transition-transform duration-200 ease-out",
                            sidebarOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"
                        )}
                        aria-hidden={!sidebarOpen}
                    >
                        {sidebarContent}
                    </div>
                    <div
                        className={cn(
                            "absolute inset-y-0 right-0 z-50 w-80 max-w-[88%] border-l bg-background shadow-xl transition-transform duration-200 ease-out",
                            detailsSheetOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
                        )}
                        aria-hidden={!detailsSheetOpen}
                    >
                        {detailsContent}
                    </div>
                </>
            ) : null}
            <MediaLightbox
                open={lightboxIndex !== null}
                onOpenChange={(open) => !open && setLightboxIndex(null)}
                asset={lightboxAsset}
                portalContainer={portalContainer}
                hasPrevious={lightboxIndex !== null && lightboxIndex > 0}
                hasNext={lightboxIndex !== null && lightboxIndex < items.length - 1}
                onPrevious={() => setLightboxIndex((index) => index === null ? index : Math.max(0, index - 1))}
                onNext={() => setLightboxIndex((index) => index === null ? index : Math.min(items.length - 1, index + 1))}
                onShare={openShareDialog}
                onFavorite={toggleFavorite}
                labels={{
                    close: labels.close,
                    share: labels.share,
                    favorite: labels.favorite,
                    edit: labels.edit,
                    details: labels.details,
                    fitWidth: labels.fitWidth,
                    reset: labels.reset,
                    zoomIn: labels.zoomIn,
                    zoomOut: labels.zoomOut,
                    rotate: labels.rotate,
                    save: labels.save,
                    previous: labels.previous,
                    next: labels.next,
                    metadata: labels.metadata,
                    dimensions: labels.dimensions,
                    type: labels.type,
                    size: labels.size,
                    created: labels.created,
                    rating: labels.rating,
                }}
            />
            <MediaPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                items={pickerItems}
                portalContainer={portalContainer}
                multiSelect
                selectedIds={[]}
                onConfirm={(selectedAssets) => {
                    const selected = selectedAssets
                        .map((asset) => PICKER_ITEMS.find((candidate) => candidate.id === asset.id))
                        .filter((asset): asset is MediaAsset => Boolean(asset));
                    if (selected.length === 0) return;
                    setItems((current) => [...selected, ...current]);
                    setAssetTags((current) => ({
                        ...current,
                        ...Object.fromEntries(selected.map((asset) => [asset.id, asset.tags])),
                    }));
                    setActiveFolder("all");
                    setSelectedItemId(selected[0].id);
                }}
                labels={{
                    title: labels.chooseTitle,
                    description: labels.chooseDescription,
                    searchPlaceholder: labels.chooseSearch,
                    confirm: labels.chooseConfirm,
                    confirmDisabledReason: labels.chooseConfirmDisabledReason,
                    emptyTitle: labels.chooseEmptyTitle,
                    emptyDescription: labels.chooseEmptyDescription,
                }}
            />
            <Dialog open={Boolean(shareAsset)} onOpenChange={(open) => !open && setShareAssetId(null)}>
                <DialogContent portalContainer={portalContainer} className="w-[calc(100%-2rem)] max-w-[560px] p-0">
                    <DialogHeader className="border-b px-5 py-4">
                        <DialogTitle className="flex items-center gap-2">
                            <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />
                            {labels.shareImage}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {labels.share}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 px-5 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">{labels.publicLink}</p>
                                <p className="text-sm text-muted-foreground">{labels.sharingPrivate}</p>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex">
                                        <Switch
                                            checked={isSharePublic}
                                            onCheckedChange={toggleSharePublic}
                                            aria-label={labels.publicLink}
                                        />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent portalContainer={portalContainer}>
                                    {labels.publicLinkTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {isSharePublic ? (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground" htmlFor="media-share-url">
                                    {labels.shareUrl}
                                </label>
                                <div className="flex gap-2">
                                    <Input id="media-share-url" value={shareUrl} readOnly className="min-w-0 flex-1" />
                                    <Button type="button" variant="secondary" className="shrink-0 gap-2" onClick={() => copyShareUrl(shareUrl)}>
                                        <Copy className="h-4 w-4" aria-hidden="true" />
                                        {copiedShareUrl ? labels.copied : labels.copyUrl}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 text-muted-foreground">
                                <Lock className="h-8 w-8" aria-hidden="true" />
                                <p className="text-sm">{labels.sharingDisabled}</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={Boolean(assetToDelete)} onOpenChange={(open) => !open && setAssetToDelete(null)}>
                <DialogContent portalContainer={portalContainer} className="w-[calc(100%-2rem)] max-w-[560px] p-0">
                    <DialogHeader className="border-b px-5 py-4">
                        <DialogTitle>{labels.deleteAsset}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {labels.deleteAssetDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 px-5 py-5">
                        <p className="text-sm leading-6 text-muted-foreground">
                            {labels.deleteAssetDescription}
                        </p>
                        {assetToDelete ? (
                            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground">
                                {assetToDelete.title}
                            </div>
                        ) : null}
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setAssetToDelete(null)}>
                                {labels.cancel}
                            </Button>
                            <Button type="button" variant="destructive" onClick={deleteAsset}>
                                {labels.confirmDelete}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={createFolderOpen}
                onOpenChange={(open) => {
                    setCreateFolderOpen(open);
                    if (!open) resetCreateFolderForm();
                }}
            >
                <DialogContent portalContainer={portalContainer} className="w-[calc(100%-2rem)] max-w-[520px] p-0">
                    <DialogHeader className="border-b px-5 py-4">
                        <DialogTitle>{labels.createFolder}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {labels.createFolder}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="space-y-4 px-5 py-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            createFolder();
                        }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="media-folder-name">
                                {labels.folderName}
                            </label>
                            <Input
                                id="media-folder-name"
                                value={newFolderName}
                                onChange={(event) => setNewFolderName(event.target.value)}
                                placeholder={labels.folderNamePlaceholder}
                                className="w-full"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="media-parent-folder">
                                {labels.parentFolder}
                            </label>
                            <Select
                                id="media-parent-folder"
                                value={newFolderParentId}
                                onChange={(event) => setNewFolderParentId(event.target.value)}
                                className="w-full"
                            >
                                <option value="root">{labels.noParent}</option>
                                {flatFolders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {"- ".repeat(folder.level)}
                                        {locale === "ja" ? folder.nameJa : folder.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setCreateFolderOpen(false)}
                            >
                                {labels.cancel}
                            </Button>
                            {newFolderName.trim() ? (
                                <Button type="submit">
                                    {labels.create}
                                </Button>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-flex">
                                            <Button type="submit" disabled>
                                                {labels.create}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent portalContainer={portalContainer}>
                                        {labels.folderNameRequired}
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={Boolean(folderToDelete)} onOpenChange={(open) => !open && setFolderToDelete(null)}>
                <DialogContent portalContainer={portalContainer} className="w-[calc(100%-2rem)] max-w-[520px] p-0">
                    <DialogHeader className="border-b px-5 py-4">
                        <DialogTitle>{labels.deleteFolder}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {labels.deleteFolderDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 px-5 py-5">
                        <p className="text-sm leading-6 text-muted-foreground">
                            {labels.deleteFolderDescription}
                        </p>
                        {folderToDelete ? (
                            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground">
                                {locale === "ja" ? folderToDelete.nameJa : folderToDelete.name}
                            </div>
                        ) : null}
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setFolderToDelete(null)}>
                                {labels.cancel}
                            </Button>
                            <Button type="button" variant="destructive" onClick={deleteFolder}>
                                {labels.confirmDelete}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
