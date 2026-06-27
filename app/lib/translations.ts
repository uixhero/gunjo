/**
 * Translation keys for docs UI (header, sidebar) and home page.
 * Component names and token names are kept in English for consistency; section labels are translated.
 */
export type Locale = "en" | "ja";

export type HomeTranslations = {
  hero: {
    kanji: string;
    taglineMain: string;
    taglineSub: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  showcase: {
    label: string;
    description: string;
  };
  story: {
    label: string;
    gunjoTitle: string;
    gunjoBody: string;
    kobichaTitle: string;
    kobichaBody: string;
  };
  designers: {
    heading: string;
    description: string;
    cards: Record<
      "showcase" | "tokens" | "atlas" | "patterns",
      { title: string; description: string; cta: string; href: string }
    >;
  };
  ai: {
    heading: string;
    description: string;
    cards: Record<
      "spec" | "schema" | "mcp" | "cookbook",
      { title: string; description: string; status: string }
    >;
  };
  engineers: {
    heading: string;
    description: string;
    install: string;
    stack: string;
    learnMore: string;
  };
  becoming: {
    heading: string;
    body: string;
    changelogCta: string;
    githubCta: string;
  };
};

export type IntroPathwayKey = "install" | "components" | "examples" | "adoption";

export type IntroTranslations = {
  alphaBadge: string;
  componentCountBadge: string;
  ctaPrimary: string;
  ctaSecondary: string;
  livePreviewLabel: string;
  quickstart: {
    heading: string;
    description: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    step3Description: string;
    showcaseCta: string;
    copyLabel: string;
    copiedLabel: string;
  };
  pathwaysHeading: string;
  pathwaysDescription: string;
  pathways: Record<IntroPathwayKey, { title: string; description: string; cta: string }>;
  resourcesHeading: string;
  resourcesDescription: string;
  resources: { label: string; description: string; href: string }[];
};

export type ShowcasePageStrings = {
  label: string;
  heading: string;
  subtitle: (count: number) => string;
  searchPlaceholder: string;
  allTab: string;
  emptyState: string;
  previewUnavailable: string;
  openDocsLabel: (title: string) => string;
};

export type TokenGroupKey =
  | "colors"
  | "typography"
  | "spacing"
  | "shadows"
  | "radius"
  | "animation";

export type TokensPageStrings = {
  label: string;
  heading: string;
  descriptionLead: string;
  descriptionTail: string;
  designMdLinkText: string;
  exploreCta: string;
  groups: Record<TokenGroupKey, { title: string; description: string }>;
  designMd: {
    title: string;
    description: string;
    cta: string;
  };
};

export type PatternKey =
  | "auth"
  | "dashboard"
  | "editor"
  | "kanban"
  | "chat"
  | "landing"
  | "bannalyze"
  | "media-library"
  | "not-found";
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
export type PlannedIndustryPatternKey =
  | "finance-wallet"
  | "commerce-sales"
  | "health-wellness"
  | "public-safety"
  | "creator-commerce";

export type PatternsPageStrings = {
  label: string;
  heading: string;
  subtitle: string;
  patterns: Record<PatternKey, { title: string; description: string }>;
  families: Record<PatternFamilyKey, { title: string; description: string }>;
  surfaces: Record<PatternSurfaceKey, string>;
  industries: Record<PatternIndustryKey, string>;
  complexity: Record<PatternComplexityKey, string>;
  meta: {
    surface: string;
    industry: string;
    complexity: string;
    includes: string;
    patternDetails: string;
    usedComponents: string;
    planned: string;
    availableCount: (count: number) => string;
    routeCount: (count: number) => string;
    openPattern: (title: string) => string;
    openRoute: (label: string) => string;
    openComponent: (label: string) => string;
  };
  planned: {
    title: string;
    description: string;
    patterns: Record<PlannedIndustryPatternKey, { title: string; description: string }>;
  };
};

export type AiHandoffCapabilityKey =
  | "spec"
  | "endpoints"
  | "designMd"
  | "mcp";

export type AiHandoffToolKey = "v0" | "cursor" | "claude" | "figmaMake";

export type AiHandoffPageStrings = {
  badge: string;
  heading: string;
  subtitle: string;
  capabilities: Record<
    AiHandoffCapabilityKey,
    { title: string; description: string; badge: string }
  >;
  capabilityJumpLabel: (title: string) => string;
  tryIt: {
    heading: string;
    description: string;
  };
  endpoints: {
    heading: string;
    oneComponent: string;
    allComponents: string;
    tryButton: (path: string) => string;
  };
  ssotFiles: {
    heading: string;
    description: string;
    manifestLabel: string;
    manifestHint: string;
    fileLabel: string;
    fileHint: string;
    bulkHeading: string;
    bulkHint: string;
    columns: { category: string; pen: string; metadata: string; core: string };
    usage: {
      heading: string;
      pencilNote: string;
      designer: {
        title: string;
        intro: string;
        steps: string[];
      };
      contributor: {
        title: string;
        intro: string;
        steps: string[];
        readmeCta: string;
        readmeUrl: string;
      };
      tooling: {
        title: string;
        intro: string;
        coreLabel: string;
        coreDescription: string;
        metadataLabel: string;
        metadataDescription: string;
        penLabel: string;
        penDescription: string;
      };
    };
  };
  perTool: {
    heading: string;
    tools: Record<AiHandoffToolKey, { name: string; description: string }>;
  };
  cookbook: {
    heading: string;
    description: string;
    cta: string;
  };
  roadmap: {
    heading: string;
    mcp: { title: string; description: string; cta: string };
    figma: { title: string; description: string; cta: string };
  };
};

export type PagesTranslations = {
  showcase: ShowcasePageStrings;
  tokens: TokensPageStrings;
  patterns: PatternsPageStrings;
  aiHandoff: AiHandoffPageStrings;
};

export type HeaderKey =
  | "siteName"
  | "docs"
  | "components"
  | "showcase"
  | "tokens"
  | "patterns"
  | "aiHandoff"
  | "why";

export type StabilityBadgeStrings = {
  labels: {
    stable: { label: string; tooltip: string };
    beta: { label: string; tooltip: string };
    experimental: { label: string; tooltip: string };
  };
};

export type ThemeSwitcherStrings = {
  heading: string;
  primaryColor: string;
  radius: string;
  fontScale: string;
  reset: string;
  exportLabel: string;
  exportHint: string;
  copy: string;
  copied: string;
};

export type TooltipKey =
  | "openMenu"
  | "github"
  | "switchToJa"
  | "switchToEn"
  | "toggleTheme"
  | "themeSwitcher"
  | "viewAuto"
  | "viewDesktop"
  | "viewTablet"
  | "viewMobile"
  | "search";

export const translations: Record<
  Locale,
  {
    header: Record<HeaderKey, string>;
    tooltips: Record<TooltipKey, string>;
    themeSwitcher: ThemeSwitcherStrings;
    stabilityBadge: StabilityBadgeStrings;
    home: HomeTranslations;
    intro: IntroTranslations;
    pages: PagesTranslations;
    nav: Record<string, string>;
  }
> = {
  en: {
    header: {
      siteName: "Gunjo UI",
      docs: "Docs",
      components: "Components",
      showcase: "Showcase",
      tokens: "Tokens",
      patterns: "Patterns",
      aiHandoff: "AI",
      why: "Why",
    },
    tooltips: {
      openMenu: "Open menu",
      github: "GitHub",
      switchToJa: "Switch to Japanese",
      switchToEn: "Switch to English",
      toggleTheme: "Toggle theme",
      themeSwitcher: "Customize theme",
      viewAuto: "Fit to screen",
      viewDesktop: "Desktop view",
      viewTablet: "Tablet view",
      viewMobile: "Mobile view",
      search: "Search",
    },
    themeSwitcher: {
      heading: "Customize theme",
      primaryColor: "Primary color",
      radius: "Radius",
      fontScale: "Font scale",
      reset: "Reset",
      exportLabel: "Export CSS",
      exportHint:
        "Paste this snippet into your app's :root to use the same theme.",
      copy: "Copy",
      copied: "Copied!",
    },
    stabilityBadge: {
      labels: {
        stable: {
          label: "Stable",
          tooltip:
            "Public API frozen. Safe to depend on in production. Breaking changes require a major version bump.",
        },
        beta: {
          label: "Beta",
          tooltip:
            "Feature-complete and used internally, but the API may still adjust based on feedback. Pin a version if you adopt.",
        },
        experimental: {
          label: "Experimental",
          tooltip:
            "Shape and behavior may change between releases. Try it out, but expect rough edges and migration work.",
        },
      },
    },
    home: {
      hero: {
        kanji: "群青",
        taglineMain: "A design system for you and AI.",
        taglineSub: "Not yet blue. Becoming blue.",
        subtitle: "150+ components, tokens, and AI handoff.",
        ctaPrimary: "View the docs",
        ctaSecondary: "Browse the showcase",
      },
      showcase: {
        label: "Start here",
        description:
          "Tools to give your color form, fast — components, tokens, guidelines, patterns, and AI handoff.",
      },
      story: {
        label: "The color story",
        gunjoTitle: "群青 — Gunjō",
        gunjoBody:
          "Not yet blue. Becoming blue. The color of dawn before light arrives, of ink before it dries, of form before it sets. A design system in alpha — a color in becoming.",
        kobichaTitle: "媚茶 — Kobicha",
        kobichaBody:
          "The warm earth that supports the becoming. Where human intent meets the system — hover, selection, the moment of choice — kobicha lends its temperature.",
      },
      designers: {
        heading: "Primary entry points",
        description: "Open the system by task: inspect components, copy tokens, read guidelines, or review composed patterns.",
        cards: {
          showcase: {
            title: "Component catalog",
            description: "All 150+ audited components with docs pages, preview/code parity, and category overviews.",
            cta: "Open Showcase",
            href: "/showcase",
          },
          tokens: {
            title: "Token system",
            description: "Color, typography, spacing, radius, shadow, motion, layering, and density tokens with copyable values.",
            cta: "Explore tokens",
            href: "/docs/tokens",
          },
          atlas: {
            title: "Guidelines",
            description: "Decision rules for component selection, docs quality, accessibility, and visible copy.",
            cta: "Read guidelines",
            href: "/docs/guidelines",
          },
          patterns: {
            title: "Public patterns",
            description: "Dashboard, auth, and media library are kept visible for the alpha; the rest stay out of production until rebuilt.",
            cta: "See patterns",
            href: "/patterns",
          },
        },
      },
      ai: {
        heading: "SSOT and AI handoff",
        description: "GunjoUI treats .pen and design metadata as the source of truth, then syncs tokens, component specs, docs registration, and export data. Pages are not fully auto-generated from .pen.",
        cards: {
          spec: {
            title: "Component specs",
            description: "Each component exposes a Markdown spec that can be copied into an AI tool without guessing variant names.",
            status: "Ready",
          },
          schema: {
            title: "JSON-Schema endpoints",
            description: "/api/specs/* serves machine-readable specs for components and the full catalog manifest.",
            status: "Ready",
          },
          mcp: {
            title: ".pen-backed SSOT",
            description: ".pen is the design source; sync converts it into tokens, specs, generated keys, docs registry, and exports.",
            status: "Synced",
          },
          cookbook: {
            title: "AI handoff docs",
            description: "Guides explain how to hand the system to v0, Cursor, Claude, Figma Make, and similar tools.",
            status: "Docs",
          },
        },
      },
      engineers: {
        heading: "For engineers",
        description: "Install GunjoUI as a React and Tailwind component library, then use the docs to keep implementation and design decisions aligned.",
        install: "npm install @gunjo/ui",
        stack: "React 19 · Tailwind v3/v4 · Radix UI · TypeScript · MIT",
        learnMore: "Read the docs",
      },
      becoming: {
        heading: "Your color is already there.",
        body: "Gunjo is a blue still becoming — and so are you. Make the color only you can, from here.",
        changelogCta: "View CHANGELOG",
        githubCta: "Star on GitHub",
      },
    },
    intro: {
      alphaBadge: "Alpha · v0.0.1-alpha.2",
      componentCountBadge: "150+ components",
      ctaPrimary: "Get Started",
      ctaSecondary: "Browse Components",
      livePreviewLabel: "Live preview",
      quickstart: {
        heading: "60-second start",
        description:
          "Install the package, import a component, ship. No theme bootstrap, no provider scaffolding.",
        step1Label: "Install",
        step2Label: "Import & render",
        step3Label: "See every component",
        step3Description:
          "Open the Showcase to scan all 150+ components in one place.",
        showcaseCta: "Open Showcase",
        copyLabel: "Copy",
        copiedLabel: "Copied!",
      },
      pathwaysHeading: "Pick your path",
      pathwaysDescription: "Different goals, different starting points.",
      pathways: {
        install: {
          title: "Install it",
          description: "Add @gunjo/ui to your Next.js or Vite app and ship in 5 minutes.",
          cta: "Installation guide",
        },
        components: {
          title: "Browse components",
          description: "150+ components grouped by inputs, display, charts, feedback, navigation, overlay, and layout.",
          cta: "View catalog",
        },
        examples: {
          title: "See examples",
          description: "Full-screen reference apps: dashboard, editor, kanban, chat, and more.",
          cta: "Open examples",
        },
        adoption: {
          title: "Plan adoption",
          description: "Migration playbook, version policy, peer-dep matrix for moving an existing app.",
          cta: "Read adoption guide",
        },
      },
      resourcesHeading: "Internal resources",
      resourcesDescription: "Reference docs maintained alongside the codebase.",
      resources: [
        { label: "Adoption Guide", description: "5-minute install for downstream apps.", href: "/docs/adoption" },
        { label: "Migration Playbook", description: "Phase-by-phase rollout for existing apps.", href: "/docs/migration-playbook" },
        { label: "Dependencies", description: "Peer-dep ranges and tested combinations.", href: "/docs/dependencies" },
        { label: "Versioning Policy", description: "Semver rules and breaking-change cadence.", href: "/docs/versioning" },
        { label: "Component Addition", description: "How to add a new component to the SSOT.", href: "/docs/component-addition" },
        { label: "CHANGELOG", description: "Per-version changes.", href: "/docs/changelog" },
      ],
    },
    pages: {
      showcase: {
        label: "Showcase",
        heading: "Every component, in one canvas.",
        subtitle: (count) =>
          `Live previews of all ${count} components rendered from the system itself. Click any card to dive into props, states, and code.`,
        searchPlaceholder: "Search components...",
        allTab: "All",
        emptyState: "No components match.",
        previewUnavailable: "Preview unavailable",
        openDocsLabel: (title) => `Open ${title} docs`,
      },
      tokens: {
        label: "Tokens",
        heading: "Design tokens, made tangible.",
        descriptionLead:
          "Every variable that shapes the system. Click any swatch to copy its value. The full canonical spec — written for human and AI consumers alike — lives in",
        descriptionTail: ".",
        designMdLinkText: "DESIGN.md",
        exploreCta: "Explore",
        groups: {
          colors: {
            title: "Colors",
            description:
              "Brand (gunjō, kobicha), neutrals, semantic, and full HSL swatches.",
          },
          typography: {
            title: "Typography",
            description: "Font families (Inter, Shippori Mincho), scale, and weights.",
          },
          spacing: {
            title: "Spacing",
            description: "Padding, margin, and gap scale.",
          },
          shadows: {
            title: "Shadows",
            description: "Elevation tokens — shadow-sm through shadow-2xl.",
          },
          radius: {
            title: "Radius",
            description: "Border radius scale.",
          },
          animation: {
            title: "Animation",
            description: "Duration and easing tokens.",
          },
        },
        designMd: {
          title: "DESIGN.md — the canonical spec",
          description:
            "DESIGN.md documents the full design system in machine-readable Markdown so AI tools (v0, Cursor, Claude, Figma Make) can consume it directly. Brand story, color palette with hex/HSL, typography rules, component-level usage. One source of truth.",
          cta: "Read the full spec",
        },
      },
      patterns: {
        label: "Patterns",
        heading: "Reference apps, fully composed.",
        subtitle:
          "Eight production-shaped GunjoUI demonstrations grouped by family, surface, and industry. Use the page chips to open the exact route included in each pattern.",
        patterns: {
          auth: {
            title: "Auth",
            description:
              "Multi-page sign-in, sign-up, reset, and account flow with mock state.",
          },
          dashboard: {
            title: "Dashboard",
            description:
              "Operations dashboard with overview, project list, settings, and shared chart cards.",
          },
          editor: {
            title: "Editor",
            description: "Document editor with sidebar tree and preview pane.",
          },
          kanban: {
            title: "Kanban",
            description: "Responsive kanban layout shell for columns, cards, and dnd-kit wiring.",
          },
          chat: {
            title: "Chat App",
            description: "Conversation list, message stream, and composer.",
          },
          landing: {
            title: "Landing Page",
            description: "Marketing hero, feature grid, pricing, and CTA.",
          },
          bannalyze: {
            title: "Bannalyze",
            description:
              "Banner Review's analyzer surface — data-dense workflow tool.",
          },
          "media-library": {
            title: "Media Library",
            description: "Asset grid with folder sidebar and detail inspector.",
          },
          "not-found": {
            title: "Not Found (404)",
            description: "Error screen for missing or moved pages, with recovery actions.",
          },
        },
        families: {
          core: {
            title: "Core app patterns",
            description:
              "Reusable application flows and work surfaces that fit many products.",
          },
          analytics: {
            title: "Analytics dashboards",
            description:
              "Data-dense dashboards for operational, project, product, and executive views.",
          },
          industry: {
            title: "Industry patterns",
            description:
              "Domain-shaped screens for finance, commerce, media, healthcare, and other verticals.",
          },
          marketing: {
            title: "Marketing patterns",
            description:
              "Public-facing pages for positioning, conversion, and onboarding.",
          },
        },
        surfaces: {
          flow: "Flow",
          dashboard: "Dashboard",
          workspace: "Workspace",
          board: "Board",
          messaging: "Messaging",
          site: "Site",
          analysis: "Analysis",
          "asset-management": "Asset management",
        },
        industries: {
          general: "General",
          operations: "Operations",
          creative: "Creative",
          media: "Media",
          commerce: "Commerce",
          marketing: "Marketing",
        },
        complexity: {
          focused: "Focused",
          "multi-page": "Multi-page",
          "data-dense": "Data-dense",
        },
        meta: {
          surface: "Surface",
          industry: "Industry",
          complexity: "Complexity",
          includes: "Includes",
          patternDetails: "Pattern details",
          usedComponents: "Used Components",
          planned: "Planned",
          availableCount: (count: number) =>
            `${count} ${count === 1 ? "pattern" : "patterns"}`,
          routeCount: (count: number) =>
            `${count} ${count === 1 ? "page" : "pages"}`,
          openPattern: (title: string) => `Open ${title} pattern`,
          openRoute: (label: string) => `Open ${label}`,
          openComponent: (label: string) => `Open ${label} component docs`,
        },
        planned: {
          title: "Planned industry lanes",
          description:
            "Reserved taxonomy for future pattern families. These will reuse shared chart primitives instead of adding local chart markup.",
          patterns: {
            "finance-wallet": {
              title: "Finance / Wallet",
              description: "Balances, cards, savings, expenses, and transaction analytics.",
            },
            "commerce-sales": {
              title: "Commerce / Sales",
              description: "Revenue, channels, conversion, inventory, and order performance.",
            },
            "health-wellness": {
              title: "Health / Wellness",
              description: "Glucose, sleep, heart rate, activity, and readiness cards.",
            },
            "public-safety": {
              title: "Public safety",
              description: "Incident locations, response time, heatmaps, and top locations.",
            },
            "creator-commerce": {
              title: "Creator commerce",
              description: "Live sessions, audience flow, content performance, and sales.",
            },
          },
        },
      },
      aiHandoff: {
        badge: "AI-native by design",
        heading: "Hand off to your AI of choice.",
        subtitle:
          "Every component in GunjoUI exposes a Markdown spec and a JSON-Schema endpoint so AI tools can reference exact variant keys, Tailwind class signatures, and design tokens — the same SSOT humans read.",
        capabilities: {
          spec: {
            title: "Spec as prompt",
            badge: "Live",
            description:
              "\"Copy spec for AI\" button on every component page. Markdown that pastes cleanly into v0, Cursor, or Claude.",
          },
          endpoints: {
            title: "JSON endpoints",
            badge: "Live",
            description:
              "/api/specs/inputs/button returns a structured JSON spec. /api/specs/manifest returns the full catalog.",
          },
          designMd: {
            title: "DESIGN.md",
            badge: "Live",
            description:
              "The canonical spec — color palette, typography, component rules — written for AI consumption.",
          },
          mcp: {
            title: "MCP server",
            badge: "Planned",
            description:
              "Coming: Claude and Cursor query the gunjo-ui namespace directly via MCP.",
          },
        },
        capabilityJumpLabel: (title) => `Jump to ${title}`,
        tryIt: {
          heading: "Try it now",
          description:
            "Here's the live spec for the Button component. Click to copy, then paste into your AI tool.",
        },
        endpoints: {
          heading: "JSON endpoints",
          oneComponent: "One component",
          allComponents: "All components",
          tryButton: (path) => `Try ${path}`,
        },
        ssotFiles: {
          heading: "SSOT files",
          description:
            "Raw design source-of-truth files. .pen files open in Pencil; the JSON files are what design:sync reads to drive specs and codegen. GunjoUI syncs design data into code and docs, but pages are not fully auto-generated from .pen.",
          manifestLabel: "Manifest",
          manifestHint: "JSON catalog with URL + size for every SSOT file.",
          fileLabel: "Per-category files",
          fileHint:
            "<category>.pen is the design source. <category>-core.json is the structured spec downstream tools consume. <category>-metadata.json holds title/description text.",
          bulkHeading: "Mirror everything",
          bulkHint:
            "Run this in a shell to download every SSOT file into ./ssot/.",
          columns: {
            category: "Category",
            pen: ".pen",
            metadata: "metadata.json",
            core: "core.json",
          },
          usage: {
            heading: "How to use these files",
            pencilNote:
              ".pen files are Pencil documents — install Pencil first if you don't have it. The JSON files (core / metadata) are plain JSON anything can read.",
            designer: {
              title: "As a design reference",
              intro:
                "Use the .pen as a working canvas to copy components into your own designs, or as a visual reference next to your code editor.",
              steps: [
                "Download the <category>.pen file you need.",
                "Open it in Pencil — the file shows every component for that category in one infinite canvas.",
                "Pan / zoom to inspect. Drag-copy frames into your own document if you want to remix.",
              ],
            },
            contributor: {
              title: "To contribute SSOT changes back",
              intro:
                "Editing the .pen and re-running design:sync regenerates every downstream artifact (metadata, specs, generated TypeScript, docs).",
              steps: [
                "Clone gunjo and open <category>.pen from design/ in Pencil.",
                "Edit. Save. Pencil writes back to the .pen file in place.",
                "Run `npm run design:sync` — metadata, core spec JSON, generated variant-keys, manifest, public-exports, and docs nav all rebuild from the .pen.",
                "Commit the .pen plus all regenerated artifacts together (design:verify enforces parity).",
              ],
              readmeCta: "Full SSOT runbook (design/README.md)",
              readmeUrl:
                "https://github.com/uixhero/gunjo/blob/main/design/README.md",
            },
            tooling: {
              title: "What each file is for",
              intro: "If you're feeding these into a code generator or AI tool:",
              coreLabel: "<category>-core.json",
              coreDescription:
                "Structured spec — variant keys, geometry per variant, slot IDs. The canonical input for codegen and downstream tools.",
              metadataLabel: "<category>-metadata.json",
              metadataDescription:
                "Per-component title and description text. The localization / docs source.",
              penLabel: "<category>.pen",
              penDescription:
                "The original Pencil document — JSON internally, but only round-trippable when opened in Pencil.",
            },
          },
        },
        perTool: {
          heading: "Per-tool recipes",
          tools: {
            v0: {
              name: "v0",
              description:
                "Paste the spec, then prompt: \"Build a [page] using these GunjoUI components.\"",
            },
            cursor: {
              name: "Cursor",
              description:
                "Drop into chat or @ a component spec. Cursor will reference exact variant keys and Tailwind class signatures.",
            },
            claude: {
              name: "Claude",
              description:
                "Spec as conversation context. MCP will surface specs for direct namespace access (planned).",
            },
            figmaMake: {
              name: "Figma Make",
              description:
                "Token spec helps the model align generated frames with the design system's HSL values.",
            },
          },
        },
        cookbook: {
          heading: "Prompt cookbook",
          description:
            "8 ready-to-paste prompts for common screens — dashboards, login, data tables, onboarding, settings, landings, AI chat, and Kanban — each pre-wired to the GunjoUI spec endpoints.",
          cta: "Open cookbook",
        },
        roadmap: {
          heading: "On the roadmap",
          mcp: {
            title: "gunjo-ui MCP server",
            description:
              "Claude / Cursor query the gunjo-ui namespace directly via Model Context Protocol — no copy-paste.",
            cta: "Read the MCP plan",
          },
          figma: {
            title: "Figma plugin",
            description:
              "Planned distribution surface that mirrors GunjoUI tokens and components into Figma while .pen remains the SSOT.",
            cta: "Read the Figma plan",
          },
        },
      },
    },
    nav: {},
  },
  ja: {
    header: {
      siteName: "Gunjo UI",
      docs: "ドキュメント",
      components: "コンポーネント",
      showcase: "ショーケース",
      tokens: "トークン",
      patterns: "パターン",
      aiHandoff: "AI連携",
      why: "比較",
    },
    tooltips: {
      openMenu: "メニューを開く",
      github: "GitHub",
      switchToJa: "日本語に切り替え",
      switchToEn: "英語に切り替え",
      toggleTheme: "テーマを切り替え",
      themeSwitcher: "テーマをカスタマイズ",
      viewAuto: "画面幅に合わせる",
      viewDesktop: "デスクトップ表示",
      viewTablet: "タブレット表示",
      viewMobile: "モバイル表示",
      search: "検索",
    },
    themeSwitcher: {
      heading: "テーマをカスタマイズ",
      primaryColor: "プライマリカラー",
      radius: "角丸",
      fontScale: "フォントサイズ",
      reset: "リセット",
      exportLabel: "CSS をエクスポート",
      exportHint:
        "このスニペットを自分のアプリの :root に貼り付けると同じテーマが使えます。",
      copy: "コピー",
      copied: "コピー済み",
    },
    stabilityBadge: {
      labels: {
        stable: {
          label: "Stable",
          tooltip:
            "公開 API は固定済み。本番依存しても安全。破壊的変更にはメジャーバージョン昇格を伴います。",
        },
        beta: {
          label: "Beta",
          tooltip:
            "機能としては完成し社内利用も進んでいますが、フィードバック次第で API は調整される可能性があります。採用時はバージョン固定推奨。",
        },
        experimental: {
          label: "Experimental",
          tooltip:
            "リリース間で形と振る舞いが変わる可能性があります。試すのは歓迎ですが、移行コストと荒削りな部分を覚悟してください。",
        },
      },
    },
    home: {
      hero: {
        kanji: "群青",
        taglineMain: "あなたと AI のための、\nデザインシステム。",
        taglineSub: "未だ青ならず、青になりつつあるもの。",
        subtitle: "150+ のコンポーネント・トークン・AI 連携。",
        ctaPrimary: "ドキュメントを見る",
        ctaSecondary: "ショーケースを見る",
      },
      showcase: {
        label: "Start here",
        description:
          "あなたの色を、すぐ形にする道具。コンポーネント、トークン、ガイドライン、パターン、AI 連携。",
      },
      story: {
        label: "色の物語",
        gunjoTitle: "群青 — Gunjō",
        gunjoBody:
          "未だ青ならず、青になりつつあるもの。夜明け前の色、墨のまだ乾かぬ色、形になる前の色。alpha 段階のデザインシステムは、becoming する色そのもの。",
        kobichaTitle: "媚茶 — Kobicha",
        kobichaBody:
          "becoming を支える温かい土。ホバー、選択、人の意思が介在する瞬間に温度を加える色。",
      },
      designers: {
        heading: "主要な入口",
        description: "目的別に開けます。コンポーネントを確認する、トークンをコピーする、判断基準を読む、組み合わせ例を見る。",
        cards: {
          showcase: {
            title: "コンポーネントカタログ",
            description: "150+ コンポーネントを監査済み。docs ページ、プレビューとコード、カテゴリ概要から確認できます。",
            cta: "Showcase を開く",
            href: "/showcase",
          },
          tokens: {
            title: "トークンシステム",
            description: "色、タイポ、余白、角丸、影、モーション、レイヤー、密度をコピー可能な値として確認できます。",
            cta: "トークンを見る",
            href: "/docs/tokens",
          },
          atlas: {
            title: "ガイドライン",
            description: "コンポーネント選定、docs 品質、アクセシビリティ、画面に出る文言の判断基準。",
            cta: "ガイドラインを読む",
            href: "/docs/guidelines",
          },
          patterns: {
            title: "公開パターン",
            description: "alpha では dashboard / auth / media library だけを公開対象にし、他は作り直し後に戻します。",
            cta: "パターンを見る",
            href: "/patterns",
          },
        },
      },
      ai: {
        heading: "SSOT と AI 連携",
        description: "GunjoUI は .pen と design metadata を SSOT とし、トークン、コンポーネント仕様、docs 登録、export 情報へ同期します。ページ全体を .pen から完全自動生成するものではありません。",
        cards: {
          spec: {
            title: "コンポーネント仕様",
            description: "各コンポーネントの Markdown 仕様をコピーでき、variant 名を推測せず AI ツールへ渡せます。",
            status: "Ready",
          },
          schema: {
            title: "JSON-Schema endpoints",
            description: "/api/specs/* でコンポーネント仕様とカタログ manifest を machine-readable に配信します。",
            status: "Ready",
          },
          mcp: {
            title: ".pen ベースの SSOT",
            description: ".pen を設計ソースとし、sync が tokens、spec、generated keys、docs registry、exports へ展開します。",
            status: "Synced",
          },
          cookbook: {
            title: "AI 連携ドキュメント",
            description: "v0 / Cursor / Claude / Figma Make などへ渡すための考え方と入口をまとめています。",
            status: "Docs",
          },
        },
      },
      engineers: {
        heading: "エンジニア向け",
        description: "React と Tailwind のコンポーネントライブラリとして導入し、docs を使って実装と設計判断を揃えます。",
        install: "npm install @gunjo/ui",
        stack: "React 19 · Tailwind v3/v4 · Radix UI · TypeScript · MIT",
        learnMore: "ドキュメントを読む",
      },
      becoming: {
        heading: "あなたの色は、もう、そこにある。",
        body: "群青は、なりゆく途中の青。あなたも、わたしたちも。あなたにしか出せない色を、ここから。",
        changelogCta: "CHANGELOG を見る",
        githubCta: "GitHub でスター",
      },
    },
    intro: {
      alphaBadge: "Alpha · v0.0.1-alpha.2",
      componentCountBadge: "150+ コンポーネント",
      ctaPrimary: "はじめる",
      ctaSecondary: "コンポーネント一覧",
      livePreviewLabel: "ライブプレビュー",
      quickstart: {
        heading: "60 秒で始める",
        description:
          "パッケージを入れて、import して、置く。テーマの初期化も Provider のセットアップも要りません。",
        step1Label: "インストール",
        step2Label: "import して描画",
        step3Label: "全コンポーネントを見る",
        step3Description: "Showcase で 150+ コンポーネントを 1 ページに俯瞰できます。",
        showcaseCta: "Showcase を開く",
        copyLabel: "コピー",
        copiedLabel: "コピー済み",
      },
      pathwaysHeading: "どの道から始める？",
      pathwaysDescription: "目的に合わせて最短ルートを選んでください。",
      pathways: {
        install: {
          title: "インストールする",
          description: "@gunjo/ui を Next.js / Vite アプリに導入して 5 分で動かす。",
          cta: "インストール手順",
        },
        components: {
          title: "コンポーネントを見る",
          description: "150+ のコンポーネントをライブプレビュー付きで。",
          cta: "カタログを開く",
        },
        examples: {
          title: "実装例を見る",
          description: "ダッシュボード、エディタ、カンバン、チャットなどの全画面リファレンス。",
          cta: "例を開く",
        },
        adoption: {
          title: "導入計画",
          description: "既存アプリ向けの移行手順、バージョンポリシー、peer-dep マトリクス。",
          cta: "採用ガイドを読む",
        },
      },
      resourcesHeading: "内部リソース",
      resourcesDescription: "コードベースと一緒にメンテされているリファレンス。",
      resources: [
        { label: "採用ガイド", description: "下流アプリ向けの 5 分インストール。", href: "/docs/adoption" },
        { label: "移行 Playbook", description: "既存アプリの段階移行手順。", href: "/docs/migration-playbook" },
        { label: "依存関係", description: "peer-dep 範囲と検証済みの組み合わせ。", href: "/docs/dependencies" },
        { label: "バージョニング", description: "semver ルールと破壊的変更ポリシー。", href: "/docs/versioning" },
        { label: "コンポーネント追加", description: "SSOT に新規コンポーネントを追加する手順。", href: "/docs/component-addition" },
        { label: "CHANGELOG", description: "バージョンごとの変更履歴。", href: "/docs/changelog" },
      ],
    },
    pages: {
      showcase: {
        label: "ショーケース",
        heading: "全コンポーネントを、1つのキャンバスで。",
        subtitle: (count) =>
          `システム本体から描画した全 ${count} コンポーネントのライブプレビュー。カードをクリックして props・状態・コードを確認できます。`,
        searchPlaceholder: "コンポーネントを検索...",
        allTab: "全て",
        emptyState: "該当するコンポーネントがありません。",
        previewUnavailable: "プレビューを表示できません",
        openDocsLabel: (title) => `${title} のドキュメントを開く`,
      },
      tokens: {
        label: "Tokens",
        heading: "デザイントークンを、触れる形に。",
        descriptionLead:
          "システムの形を決める全変数。スウォッチをクリックすれば値をコピーできます。人と AI の両方に向けた完全な仕様は",
        descriptionTail: "に記載されています。",
        designMdLinkText: "DESIGN.md",
        exploreCta: "見る",
        groups: {
          colors: {
            title: "Colors",
            description:
              "ブランド（群青・媚茶）、ニュートラル、セマンティック、HSL スウォッチ。",
          },
          typography: {
            title: "Typography",
            description:
              "フォントファミリー（Inter、Shippori Mincho）、スケール、ウェイト。",
          },
          spacing: {
            title: "Spacing",
            description: "余白・パディング・ギャップのスケール。",
          },
          shadows: {
            title: "Shadows",
            description: "shadow-sm から shadow-2xl までのエレベーショントークン。",
          },
          radius: {
            title: "Radius",
            description: "角丸のスケール。",
          },
          animation: {
            title: "Animation",
            description: "トランジションの時間・イージングのトークン。",
          },
        },
        designMd: {
          title: "DESIGN.md ── canonical な仕様書",
          description:
            "DESIGN.md はデザインシステム全体を機械可読な Markdown でドキュメント化しており、AI ツール（v0 / Cursor / Claude / Figma Make）がそのまま消費できます。ブランドストーリー、hex/HSL カラーパレット、タイポグラフィ規則、コンポーネント単位の用法 ── 真実の唯一の源泉。",
          cta: "完全な仕様を読む",
        },
      },
      patterns: {
        label: "Patterns",
        heading: "リファレンスアプリ、完成形のまま。",
        subtitle:
          "本番想定の GunjoUI デモを、ファミリー・画面種別・業界で分類しています。チップから各パターンに含まれるページを直接開けます。",
        patterns: {
          auth: {
            title: "Auth",
            description:
              "サインイン・登録・リセット・アカウント画面までつながる複数ページのフロー。",
          },
          dashboard: {
            title: "Dashboard",
            description:
              "概要・プロジェクト一覧・設定を持つ運用ダッシュボード。共通チャートカードも利用します。",
          },
          editor: {
            title: "Editor",
            description: "サイドバーのツリーとプレビューを備えたドキュメントエディタ。",
          },
          kanban: {
            title: "Kanban",
            description: "カラム、カード、dnd-kit 連携のためのレスポンシブな Kanban レイアウト枠。",
          },
          chat: {
            title: "Chat App",
            description: "会話一覧・メッセージストリーム・コンポーザ。",
          },
          landing: {
            title: "Landing Page",
            description: "マーケティングヒーロー・機能グリッド・価格・CTA。",
          },
          bannalyze: {
            title: "Bannalyze",
            description:
              "Banner Review のアナライザー画面 ── データ密度の高いワークフローツール。",
          },
          "media-library": {
            title: "Media Library",
            description:
              "フォルダサイドバーと詳細インスペクタを備えたアセットグリッド。",
          },
          "not-found": {
            title: "Not Found（404）",
            description:
              "存在しない・移動したページ向けのエラー画面。復帰アクションつき。",
          },
        },
        families: {
          core: {
            title: "基本アプリパターン",
            description:
              "多くのプロダクトで使えるアプリケーションフローと作業画面。",
          },
          analytics: {
            title: "分析ダッシュボード",
            description:
              "運用・プロジェクト・プロダクト・経営視点に使えるデータ密度の高いダッシュボード。",
          },
          industry: {
            title: "業界別パターン",
            description:
              "finance、commerce、media、healthcare など業界文脈を持つ画面。",
          },
          marketing: {
            title: "マーケティングパターン",
            description:
              "ポジショニング、コンバージョン、オンボーディング向けの公開画面。",
          },
        },
        surfaces: {
          flow: "フロー",
          dashboard: "ダッシュボード",
          workspace: "ワークスペース",
          board: "ボード",
          messaging: "メッセージング",
          site: "サイト",
          analysis: "分析",
          "asset-management": "アセット管理",
        },
        industries: {
          general: "汎用",
          operations: "運用",
          creative: "クリエイティブ",
          media: "メディア",
          commerce: "コマース",
          marketing: "マーケティング",
        },
        complexity: {
          focused: "単画面",
          "multi-page": "複数ページ",
          "data-dense": "高密度",
        },
        meta: {
          surface: "画面種別",
          industry: "業界",
          complexity: "複雑度",
          includes: "含まれるページ",
          patternDetails: "パターン詳細",
          usedComponents: "Used Components",
          planned: "予定",
          availableCount: (count: number) => `${count} 件`,
          routeCount: (count: number) => `${count} ページ`,
          openPattern: (title: string) => `${title} パターンを開く`,
          openRoute: (label: string) => `${label} を開く`,
          openComponent: (label: string) => `${label} のドキュメントを開く`,
        },
        planned: {
          title: "今後の業界レーン",
          description:
            "今後追加する pattern family の予約枠。ローカルなチャート実装ではなく、共通の chart primitives を再利用します。",
          patterns: {
            "finance-wallet": {
              title: "Finance / Wallet",
              description: "残高、カード、貯蓄、支出、取引分析。",
            },
            "commerce-sales": {
              title: "Commerce / Sales",
              description: "売上、チャネル、コンバージョン、在庫、注文実績。",
            },
            "health-wellness": {
              title: "Health / Wellness",
              description: "血糖、睡眠、心拍、活動量、レディネスカード。",
            },
            "public-safety": {
              title: "Public safety",
              description: "インシデント位置、対応時間、ヒートマップ、上位地点。",
            },
            "creator-commerce": {
              title: "Creator commerce",
              description: "ライブ配信、視聴者推移、コンテンツ実績、売上。",
            },
          },
        },
      },
      aiHandoff: {
        badge: "AI ネイティブ設計",
        heading: "選んだ AI に、そのまま渡す。",
        subtitle:
          "GunjoUI の全コンポーネントは Markdown 仕様と JSON-Schema エンドポイントを公開しており、AI ツールが variant キー・Tailwind クラス・デザイントークンを正確に参照できます ── 人間が読むのと同じ SSOT です。",
        capabilities: {
          spec: {
            title: "Spec を prompt に",
            badge: "公開済",
            description:
              "全コンポーネントページに「Copy spec for AI」ボタン。v0 / Cursor / Claude にそのまま貼れる Markdown。",
          },
          endpoints: {
            title: "JSON エンドポイント",
            badge: "公開済",
            description:
              "/api/specs/inputs/button が構造化 JSON を返却。/api/specs/manifest で全カタログをまとめて取得。",
          },
          designMd: {
            title: "DESIGN.md",
            badge: "公開済",
            description:
              "canonical な仕様書 ── 色・タイポグラフィ・コンポーネント規則を AI 消費前提で記述。",
          },
          mcp: {
            title: "MCP サーバー",
            badge: "予定",
            description:
              "予定: Claude / Cursor が gunjo-ui 名前空間を MCP で直接クエリ。",
          },
        },
        capabilityJumpLabel: (title) => `${title} へ移動`,
        tryIt: {
          heading: "今すぐ試す",
          description:
            "Button コンポーネントのライブ仕様。クリックでコピーして、お使いの AI ツールに貼ってください。",
        },
        endpoints: {
          heading: "JSON エンドポイント",
          oneComponent: "コンポーネント単体",
          allComponents: "全コンポーネント",
          tryButton: (path) => `${path} を試す`,
        },
        ssotFiles: {
          heading: "SSOT ファイル",
          description:
            "デザインの SSOT を生のままダウンロードできます。.pen は Pencil で開けて、JSON は design:sync が spec とコード生成のもとにしているファイルです。GunjoUI は設計データを code / docs へ同期しますが、ページ全体を .pen から完全自動生成するものではありません。",
          manifestLabel: "マニフェスト",
          manifestHint: "全 SSOT ファイルの URL とサイズを返す JSON。",
          fileLabel: "カテゴリー別ファイル",
          fileHint:
            "<category>.pen がデザインソース。<category>-core.json はツール向けの構造化 spec、<category>-metadata.json はタイトル・説明テキスト。",
          bulkHeading: "一括取得",
          bulkHint:
            "シェルで実行すると ./ssot/ に全ファイルをダウンロードします。",
          columns: {
            category: "カテゴリー",
            pen: ".pen",
            metadata: "metadata.json",
            core: "core.json",
          },
          usage: {
            heading: "ファイルの使い方",
            pencilNote:
              ".pen は Pencil のドキュメント — まだ入れていない場合は Pencil をインストールしてください。JSON（core / metadata）は普通の JSON なのでどんなツールでも読めます。",
            designer: {
              title: "デザインの参考として使う",
              intro:
                ".pen を開いて、自分のデザインに取り込む素材として使ったり、コードエディタの横に並べて視覚リファレンスにできます。",
              steps: [
                "必要な <category>.pen をダウンロード。",
                "Pencil で開く — そのカテゴリの全コンポーネントが 1 枚の無限キャンバスに並びます。",
                "パン・ズームで観察。フレームをドラッグコピーして自分のドキュメントに持ち込めます。",
              ],
            },
            contributor: {
              title: "SSOT を編集してコントリビュートする",
              intro:
                ".pen を編集して design:sync を流すと、metadata・spec・生成 TS・docs ナビまで全部の派生物が再生成されます。",
              steps: [
                "gunjo を clone して、design/ の <category>.pen を Pencil で開く。",
                "編集して保存。Pencil が同じ .pen ファイルに書き戻します。",
                "`npm run design:sync` を実行 — metadata、core spec JSON、生成 variant-keys、manifest、public-exports、docs ナビが全部 .pen から再ビルドされます。",
                ".pen と再生成された成果物を一緒にコミット（design:verify が整合性を検証します）。",
              ],
              readmeCta: "詳しい SSOT 運用手順（design/README.md）",
              readmeUrl:
                "https://github.com/uixhero/gunjo/blob/main/design/README.md",
            },
            tooling: {
              title: "各ファイルの役割",
              intro:
                "コード生成ツールや AI に流す場合の使い分け：",
              coreLabel: "<category>-core.json",
              coreDescription:
                "構造化 spec — variant key、各 variant のジオメトリ、slot ID。コード生成や下流ツールのカノニカル入力。",
              metadataLabel: "<category>-metadata.json",
              metadataDescription:
                "コンポーネントごとの title / description。i18n や docs のソース。",
              penLabel: "<category>.pen",
              penDescription:
                "Pencil の元ドキュメント — 内部は JSON ですが、ラウンドトリップは Pencil で開いたときだけ可能です。",
            },
          },
        },
        perTool: {
          heading: "ツール別レシピ",
          tools: {
            v0: {
              name: "v0",
              description:
                "spec を貼り付けて、「これらの GunjoUI コンポーネントで [画面] を作って」とプロンプト。",
            },
            cursor: {
              name: "Cursor",
              description:
                "チャットに投入、または @ で component spec を参照。Cursor は variant キーと Tailwind クラスを正確に拾います。",
            },
            claude: {
              name: "Claude",
              description:
                "spec を会話コンテキストに。将来的に MCP 経由で名前空間に直接アクセス予定。",
            },
            figmaMake: {
              name: "Figma Make",
              description:
                "token spec があると、生成フレームをデザインシステムの HSL 値と整合させやすくなります。",
            },
          },
        },
        cookbook: {
          heading: "プロンプト Cookbook",
          description:
            "ダッシュボード・ログイン・データテーブル・オンボーディング・設定・ランディング・AI チャット・カンバンの 8 種類、すぐに貼り付けて使えるプロンプト。GunjoUI の spec エンドポイントに事前接続済み。",
          cta: "Cookbook を開く",
        },
        roadmap: {
          heading: "ロードマップ",
          mcp: {
            title: "gunjo-ui MCP サーバー",
            description:
              "Claude / Cursor が Model Context Protocol で gunjo-ui 名前空間を直接クエリ ── コピペ不要。",
            cta: "MCP プランを読む",
          },
          figma: {
            title: "Figma プラグイン",
            description:
              ".pen を SSOT にしたまま、GunjoUI のトークンとコンポーネントを Figma 側へ反映する配布面として計画中。",
            cta: "Figma プランを読む",
          },
        },
      },
    },
    // Sidebar/nav translations — JA gloss for every navigation entry.
    // Used both standalone (legacy `t()`) and as the JA half of the
    // bilingual sidebar/H1 labels. Component-name terms get a katakana
    // or short JA gloss so beginners can learn both forms side-by-side;
    // proper nouns of demo apps (Bannalyze) are kept as-is.
    nav: {
      // Section group headers + intro pages
      Introduction: "はじめに",
      Installation: "インストール",
      Theming: "テーマ",
      Comparison: "比較",
      "By use case": "ユースケース別",
      "AI handoff": "AI連携",
      "Adoption Guide": "採用ガイド",
      "Adoption Strategy": "採用戦略",
      "Migration Playbook": "移行 Playbook",
      Dependencies: "依存関係",
      "Versioning Policy": "バージョニング",
      "Component Addition": "コンポーネント追加",
      CHANGELOG: "変更履歴",
      Tokens: "トークン",
      "Tokens Overview": "トークン概要",
      "DESIGN.md": "設計仕様",
      Guidelines: "ガイドライン",
      "Guidelines Overview": "ガイドライン概要",
      "Design Principles": "設計思想",
      "Component Usage": "コンポーネント選定",
      Accessibility: "アクセシビリティ",
      "Docs Standards": "ドキュメント基準",
      "Voice & Tone": "文言設計",
      Typography: "タイポグラフィ",
      Animation: "アニメーション",
      Colors: "色",
      Spacing: "余白",
      Shadows: "影",
      Radius: "角丸",
      // Functional category section headers (current taxonomy)
      Inputs: "入力",
      "Inputs Overview": "入力の概要",
      Display: "表示",
      "Display Overview": "表示の概要",
      Charts: "チャート",
      "Charts Overview": "チャートの概要",
      Feedback: "フィードバック",
      "Feedback Overview": "フィードバックの概要",
      Navigation: "ナビゲーション",
      "Navigation Overview": "ナビゲーションの概要",
      Overlay: "オーバーレイ",
      "Overlay Overview": "オーバーレイの概要",
      Layout: "レイアウト",
      "Layout Overview": "レイアウトの概要",
      Patterns: "パターン",
      "Status Screen": "ステータス画面",
      StatusScreen: "ステータス画面",
      "Reference apps": "リファレンスアプリ",
      Examples: "サンプル",
      Review: "レビュー",
      // Atoms
      Alert: "アラート",
      AspectRatio: "アスペクト比",
      Avatar: "アバター",
      Badge: "バッジ",
      Button: "ボタン",
      CopyButton: "コピーボタン",
      TooltipButton: "ツールチップ付きボタン",
      Checkbox: "チェックボックス",
      Cluster: "クラスター",
      Code: "コード",
      CollapsiblePanelToggle: "開閉パネルトグル",
      ColorSwatch: "カラースウォッチ",
      Container: "コンテナ",
      EmptyState: "空状態",
      Grid: "グリッド",
      HStack: "水平スタック",
      Icon: "アイコン",
      Img: "画像",
      ImagePreview: "画像プレビュー",
      Input: "入力欄",
      InputOTP: "OTP入力",
      Kbd: "キー表示",
      Label: "ラベル",
      NumberInput: "数値入力",
      CurrencyInput: "金額入力",
      ScanInput: "スキャン入力",
      ScanGate: "段階スキャン",
      CoSign: "2人確認",
      PasswordGroup: "パスワードグループ",
      PasswordInput: "パスワード入力",
      PasswordRequirementList: "パスワード要件リスト",
      PasswordStrengthMeter: "パスワード強度メーター",
      PhoneInput: "電話番号入力",
      PostalCodeInput: "郵便番号入力",
      Progress: "進捗バー",
      RadioGroup: "ラジオグループ",
      RangeSlider: "範囲スライダー",
      SearchInput: "検索入力",
      Select: "セレクト",
      Separator: "区切り線",
      Skeleton: "スケルトン",
      Slider: "スライダー",
      Spacer: "スペーサー",
      Spinner: "スピナー",
      Switch: "スイッチ",
      Tag: "タグ",
      Textarea: "テキストエリア",
      Toggle: "トグル",
      ToggleGroup: "トグルグループ",
      ToolPill: "ツールピル",
      VStack: "垂直スタック",
      // Molecules
      Accordion: "アコーディオン",
      AccordionGroup: "アコーディオングループ",
      SearchableAccordion: "検索可能アコーディオン",
      ActionDataTable: "アクション付きデータテーブル",
      AlertDialog: "確認ダイアログ",
      AssetCard: "アセットカード",
      AssetGrid: "アセットグリッド",
      AssetInspectorPanel: "アセットインスペクター",
      AvatarGroup: "アバターグループ",
      Banner: "バナー",
      SafetyBanner: "安全バナー",
      Breadcrumb: "パンくず",
      Calendar: "カレンダー",
      Card: "カード",
      Carousel: "カルーセル",
      ChatComposer: "チャットコンポーザー",
      ChatInput: "チャット入力",
      ChatMessage: "チャットメッセージ",
      ChatPanel: "チャットパネル",
      CodeBlock: "コードブロック",
      Combobox: "コンボボックス",
      Command: "コマンド",
      ContextMenu: "コンテキストメニュー",
      DataTable: "データテーブル",
      DatePicker: "日付ピッカー",
      DateRangePicker: "日付範囲ピッカー",
      DeviceFrame: "デバイスフレーム",
      DocNote: "注釈",
      DocumentPager: "ドキュメントページャー",
      Dialog: "ダイアログ",
      Drawer: "ドロワー",
      DropdownMenu: "ドロップダウン",
      EditableField: "編集可能フィールド",
      FilterButton: "フィルターボタン",
      Form: "フォーム",
      HoverCard: "ホバーカード",
      List: "リスト",
      MarkdownRenderer: "Markdown描画",
      MetadataList: "メタデータリスト",
      Mention: "メンション",
      Menubar: "メニューバー",
      MarqueeFrame: "マーキーフレーム",
      MediaLightbox: "メディアライトボックス",
      MediaPickerDialog: "メディア選択ダイアログ",
      Modal: "モーダル",
      NavigationMenu: "ナビゲーション",
      NotificationCenter: "通知センター",
      PageAside: "ページ補助",
      Pagination: "ページネーション",
      Popover: "ポップオーバー",
      ProgressWidget: "進捗ウィジェット",
      Resizable: "リサイズ可能",
      ScrollArea: "スクロール領域",
      Sheet: "シート",
      Sidebar: "サイドバー",
      SidebarItem: "サイドバー項目",
      SortButton: "並び替え",
      Statistic: "統計",
      EditableDataTable: "編集可能データテーブル",
      ApprovalSteps: "承認ステップ",
      ApprovalWorkflow: "承認ワークフロー",
      CheckList: "チェックリスト",
      EventCalendar: "月間カレンダー",
      KanbanBoard: "カンバンボード",
      WeekView: "週間カレンダー",
      Gantt: "ガントチャート",
      LineageGraph: "系譜グラフ",
      PersonCell: "人物セル",
      RelationshipRow: "関係行",
      StatGroup: "指標グループ",
      AmountBreakdown: "金額内訳",
      RevealSection: "条件付きセクション",
      Delta: "差分",
      Meter: "メーター",
      RouteStops: "配送ルート",
      ScheduleGrid: "スケジュールグリッド",
      ReferenceValue: "基準値判定",
      SignedRecord: "署名記録",
      Rating: "レーティング",
      SwatchGroup: "スウォッチグループ",
      Gallery: "ギャラリー",
      ActivityTimelineCard: "活動タイムラインカード",
      AnalyticsCard: "分析カード",
      BarChart: "棒グラフ",
      ChartLegend: "チャート凡例",
      ChoroplethMap: "塗り分け地図",
      ConcentricProgressCard: "同心円進捗カード",
      DonutChart: "ドーナツチャート",
      DistributionBar: "分布バー",
      GaugeChart: "ゲージチャート",
      HeatmapChart: "ヒートマップ",
      LabeledDonutCard: "ラベル付きドーナツカード",
      LineChart: "折れ線チャート",
      MiniDistributionBarCard: "ミニ分布バーカード",
      ParetoChart: "パレート図",
      PieChart: "円グラフ",
      QuadrantMatrix: "4象限マトリクス",
      RadialBarChart: "ラジアルバーチャート",
      RadarChart: "レーダーチャート",
      RetentionCohortCard: "継続率コホートカード",
      RibbonChart: "リボンチャート",
      SegmentTimelineCard: "セグメントタイムラインカード",
      SegmentedGaugeCard: "セグメントゲージカード",
      SparklineChart: "スパークライン",
      StackedBarChart: "積み上げ棒チャート",
      StatusBar: "ステータスバー",
      Stepper: "ステッパー",
      Table: "テーブル",
      Tabs: "タブ",
      TagEditor: "タグエディタ",
      TagInput: "タグ入力",
      TextLink: "テキストリンク",
      Timeline: "タイムライン",
      TimePicker: "時刻ピッカー",
      Toast: "トースト",
      Tooltip: "ツールチップ",
      TreeView: "ツリービュー",
      FileTree: "ファイルツリー",
      // Organisms
      AppRail: "アプリレール",
      CommandPalette: "コマンドパレット",
      FileUploader: "ファイルアップローダー",
      FloatingPanel: "フローティングパネル",
      Footer: "フッター",
      Header: "ヘッダー",
      InspectorPanel: "インスペクター",
      OnboardingFlow: "オンボーディング",
      RightRail: "右レール",
      ShareModal: "共有モーダル",
      SpatialCanvas: "空間キャンバス",
      ToastProvider: "トーストプロバイダ",
      // Templates
      Authentication: "認証",
      Bannalyze: "Bannalyze",
      Blog: "ブログ",
      Chat: "チャット",
      Dashboard: "ダッシュボード",
      Docs: "ドキュメント",
      Editor: "エディタ",
      Error: "エラー",
      Kanban: "かんばん",
      Landing: "ランディング",
      "Media Library": "メディアライブラリ",
      NotFound: "未検出",
      Onboarding: "オンボーディング",
      Pricing: "料金",
      Settings: "設定",
      // Misc legacy keys still referenced by older copy
      "Chat App": "チャットアプリ",
      "Landing Page": "ランディングページ",
    },
  },
};

export function getNavTitle(locale: Locale, key: string): string {
  return translations[locale].nav[key] ?? key;
}

/**
 * Returns both the JA and EN labels for a navigation entry, plus a
 * primary/secondary split based on the active locale (primary = same
 * as the active locale, secondary = the other one). Falls back to the
 * key when no JA gloss is registered. Used by the bilingual sidebar
 * and component-detail H1 so beginners can learn both forms.
 */
export function getBilingualTitle(
  locale: Locale,
  key: string
): { en: string; ja: string; primary: string; secondary: string } {
  const en = key;
  const ja = translations.ja.nav[key] ?? key;
  return locale === "ja"
    ? { en, ja, primary: ja, secondary: en }
    : { en, ja, primary: en, secondary: ja };
}

export function getHeaderText(locale: Locale, key: keyof (typeof translations.en)["header"]): string {
  return translations[locale].header[key];
}
