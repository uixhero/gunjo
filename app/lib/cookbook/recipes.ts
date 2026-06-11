/**
 * Prompt cookbook — pre-written prompts that pair with the GunjoUI
 * spec endpoints. Each recipe gives users (designer or engineer) a
 * starting point to feed into v0, Cursor, Claude, or Figma Make.
 */

export type Tool = "v0" | "cursor" | "claude" | "figma-make";

export interface Recipe {
    slug: string;
    title: string;
    scenario: string;
    recommendedTools: Tool[];
    prompt: string;
    expectedOutput: string;
    referencedComponents: string[];
}

export const TOOL_LABELS: Record<Tool, string> = {
    v0: "v0",
    cursor: "Cursor",
    claude: "Claude",
    "figma-make": "Figma Make",
};

const SPEC_ENDPOINT = "https://gunjo.dev/api/specs";

export const recipes: Recipe[] = [
    {
        slug: "dashboard-from-template",
        title: "Build a dashboard with GunjoUI",
        scenario: "You need a metrics dashboard with stat cards, a chart area, and a recent-activity panel.",
        recommendedTools: ["v0", "cursor"],
        prompt: `Use the GunjoUI design system from @gunjo/ui. Reference the component manifest at ${SPEC_ENDPOINT}/manifest.

Build a dashboard page with:
- A header with brand name on the left and a user avatar on the right
- A 4-column grid of Card components (CardHeader/CardTitle/CardDescription/CardContent) for KPIs: Revenue, Subscriptions, Sales, Active Now. Use \`text-2xl font-bold\` for the metric value.
- Below: a 7-column grid where a "Sales Analytics" Card spans 4 cols (chart placeholder inside) and a "Recent Sales" Card spans 3 cols (list of 5 user rows with Avatar + name + email + amount).

All colors must use semantic tokens (bg-primary, text-foreground, bg-muted etc.) — never hardcoded hex.`,
        expectedOutput: "A working dashboard page using @gunjo/ui Card, Avatar, and layout primitives, fully token-driven.",
        referencedComponents: ["Card", "Avatar", "DashboardTemplate"],
    },
    {
        slug: "auth-login",
        title: "Build a login screen",
        scenario: "You need a centered login form with email + password + 'Continue with Google'.",
        recommendedTools: ["cursor", "claude"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/inputs/form for Form composition.

Build a centered login screen:
- Outer: full-height centered Card (max-width 380px, p-8)
- Title: "Welcome back" (text-2xl font-bold)
- Subtitle: muted text "Sign in to continue"
- Form with Input (type=email) + Input (type=password) + Button (full width, bg-primary)
- Below: a Separator with "or" label, then a secondary outline Button with Google logo "Continue with Google"
- Footer link: "Don't have an account? Sign up"

Use semantic tokens. Make Tab order correct (email → password → submit).`,
        expectedOutput: "A clean login screen using Form, Input, Button, Separator, Card.",
        referencedComponents: ["Form", "Input", "Button", "Separator", "Card"],
    },
    {
        slug: "data-table-with-filters",
        title: "Data table with filter bar",
        scenario: "You need a sortable table of users with a filter bar, status Badges, and row actions.",
        recommendedTools: ["v0"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/display/data-table.

Build a user-management table:
- Top bar: Input (search) + FilterButton + Button "Add user" (bg-primary, with Plus icon)
- DataTable columns: Avatar+Name, Email, Status (Badge: success/warning/destructive variants), Last seen, Actions (DropdownMenu: Edit / Delete)
- Toggle the active/inactive status with a Switch in a separate column
- Pagination at bottom

Mock 8 rows of user data. Map status to Badge variants: Suspended → destructive, Pending → outline, Active → default, Inactive → secondary. Do not introduce custom color classes — Badge ships only default/destructive/outline/secondary, and the design system rule is semantic tokens only.`,
        expectedOutput: "A complete user table page using DataTable, Badge, Switch, DropdownMenu, FilterButton, Pagination.",
        referencedComponents: ["DataTable", "Badge", "Switch", "DropdownMenu", "FilterButton", "Pagination"],
    },
    {
        slug: "onboarding-flow",
        title: "Onboarding flow with 3 steps",
        scenario: "You need a multi-step onboarding modal: pick role → invite team → connect tools.",
        recommendedTools: ["claude", "cursor"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/overlay/onboarding-flow and ${SPEC_ENDPOINT}/feedback/stepper.

Build a 3-step onboarding wizard centered on screen:
- Stepper at top showing current step (Pick role → Invite team → Connect tools)
- Step 1: RadioGroup with 3 options (Designer / Engineer / PM). Each option has an Icon, label, and 1-line description.
- Step 2: TagInput for inviting team members (paste comma-separated emails)
- Step 3: 4 Cards for tools (Slack / GitHub / Linear / Notion) — each with Switch to toggle.
- Bottom right: "Back" (variant=outline) + "Continue" (bg-primary). Final step: "Finish".

Persist state across steps. Disable Continue if required field empty.`,
        expectedOutput: "An onboarding wizard using Stepper, RadioGroup, TagInput, Card, Switch, Button.",
        referencedComponents: ["OnboardingFlow", "Stepper", "RadioGroup", "TagInput", "Card", "Switch"],
    },
    {
        slug: "settings-tabs",
        title: "Settings page with tabs",
        scenario: "You need an account settings page with three tabs: Profile, Notifications, Billing.",
        recommendedTools: ["cursor", "v0"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/navigation/tabs and ${SPEC_ENDPOINT}/patterns/settings-template.

Build /account/settings:
- Title "Settings" + description
- Tabs (defaultValue=profile) with: Profile, Notifications, Billing
- Profile tab: Form with Avatar+upload, Input(name), Input(email, disabled), Textarea(bio). Save button bottom-right.
- Notifications tab: list of toggle rows with Label + Switch (Email digest, Push, Mentions, Weekly summary).
- Billing tab: 3 PricingTemplate cards (Free/Pro/Team) with current plan highlighted by border-primary.

Use semantic tokens throughout.`,
        expectedOutput: "A settings page using Tabs, Form, Avatar, Textarea, Switch, PricingTemplate.",
        referencedComponents: ["Tabs", "Form", "Avatar", "Textarea", "Switch", "PricingTemplate"],
    },
    {
        slug: "landing-hero",
        title: "Marketing landing hero + features",
        scenario: "You need a landing page with hero, 3-feature grid, and a CTA section.",
        recommendedTools: ["v0", "figma-make"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/patterns/landing-template.

Build a landing page:
- Hero: full-bleed dark gradient. Centered: small Badge ("Now in beta"), large h1 (text-5xl font-bold), one-line subtitle in text-muted, two Buttons (primary "Get started" / outline "View docs").
- Features section: 3-column Card grid. Each Card has an Icon (lucide-react: Zap, Shield, Layers), title, 2-line description.
- Stats row: 4 inline Statistic components with metric + label.
- CTA: full-width Card with title "Ready to ship?" + Button "Sign up free".
- Footer: minimal, with Separator above and small text + nav links.

Match the design system's gunjō (#4D5AAF) primary color. Don't hardcode — use bg-primary etc.`,
        expectedOutput: "A polished landing page using LandingTemplate, Card, Badge, Button, Statistic, Separator.",
        referencedComponents: ["LandingTemplate", "Card", "Badge", "Button", "Statistic", "Separator"],
    },
    {
        slug: "chat-panel-window",
        title: "Build a chat panel with GunjoUI",
        scenario: "Build a support, assistant, or team chat interface using the system chat components.",
        recommendedTools: ["claude"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/overlay/chat-panel, ${SPEC_ENDPOINT}/display/chat-message, and ${SPEC_ENDPOINT}/inputs/chat-input.

Build a full-height chat panel:
- Header: title "Assistant" + Avatar + a settings button (variant=ghost, Settings icon)
- ScrollArea with ChatMessage entries (alternating roles user/assistant). Each message has role badge, text, timestamp.
- Input area at bottom: ChatInput with attachment button, multi-line textarea, send button (bg-primary).
- Empty state: when no messages, show a centered EmptyState with icon "Sparkles" + "Ask anything" + a few suggested prompts as Tag components (there is no Chip component in @gunjo/ui).

Stream responses by appending to the last assistant message.`,
        expectedOutput: "A working chat panel using ChatPanel, ChatInput, ChatMessage, ScrollArea, EmptyState, Avatar.",
        referencedComponents: ["ChatPanel", "ChatInput", "ChatMessage", "ScrollArea", "EmptyState", "Avatar"],
    },
    {
        slug: "kanban-board",
        title: "Kanban with drag and drop",
        scenario: "You need a Kanban board with 4 columns and draggable Card items.",
        recommendedTools: ["cursor"],
        prompt: `Use @gunjo/ui. Reference ${SPEC_ENDPOINT}/patterns/kanban-template.

Build a Kanban board:
- 4 columns: Backlog / In Progress / Review / Done
- Each column header: Badge with count + title + Plus button (variant=ghost) to add a card
- Cards: title, AvatarGroup of assignees, Tag list, due-date small text
- Drag-and-drop between columns using @dnd-kit. These are not peer deps of @gunjo/ui — install separately:
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  Use DndContext + SortableContext per column.

Keep visual rhythm with rounded-md, p-3, gap-2 between cards. Use bg-card for cards, bg-muted/40 for column backgrounds.`,
        expectedOutput: "A draggable Kanban board using KanbanTemplate, Card, AvatarGroup, Badge, Tag.",
        referencedComponents: ["KanbanTemplate", "Card", "AvatarGroup", "Badge", "Tag"],
    },
];

export function getRecipe(slug: string): Recipe | undefined {
    return recipes.find((r) => r.slug === slug);
}
