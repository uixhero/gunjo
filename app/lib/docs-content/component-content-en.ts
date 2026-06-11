import type { DocContent } from "./types";

/**
 * English content for component pages.
 * Mirrors componentContentJa keys 1:1.
 */
export const componentContentEn: Record<string, DocContent> = {
  "components/button": {
    title: "Button",
    description: "Displays a button or a component that looks like a button.",
  },
  "components/tooltip-button": {
    title: "TooltipButton",
    description: "Combines a button action with tooltip copy so icon-only or explanatory controls remain understandable.",
  },
  "components/copy-button": {
    title: "CopyButton",
    description: "Clipboard copy action with tooltip feedback and copied-state icon or label.",
  },
  "components/input": {
    title: "Input",
    description: "Displays a form input field or a component that looks like an input field.",
  },
  "components/form": {
    title: "Form",
    description: "Compound form primitives for consistent labels, controls, descriptions, and validation messages.",
  },
  "components/input-otp": {
    title: "InputOTP",
    description: "One-time-password input with per-digit slots and optional separators.",
  },
  "components/label": {
    title: "Label",
    description: "Renders an accessible label associated with a control.",
  },
  "components/badge": {
    title: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
  },
  "components/icon": {
    title: "Icon",
    description: "Normalizes icon size, stroke, and accessibility behavior across GunjoUI.",
  },
  "components/empty-state": {
    title: "EmptyState",
    description: "Shows no-data, no-results, and failed-load states with explanation and a next action.",
  },
  "components/separator": {
    title: "Separator",
    description: "Visually or semantically separates content.",
  },
  "components/skeleton": {
    title: "Skeleton",
    description: "A placeholder that mirrors the shape of content while it loads.",
  },
  "components/spacer": {
    title: "Spacer",
    description: "Flexible or fixed spacing for flex layouts.",
  },
  "components/switch": {
    title: "Switch",
    description: "A control that toggles between on and off states.",
  },
  "components/textarea": {
    title: "Textarea",
    description: "Displays a textarea or a component that looks like a textarea.",
  },
  "components/time-picker": {
    title: "TimePicker",
    description: "Selects hour and minute values and stores them as 24-hour time.",
  },
  "components/checkbox": {
    title: "Checkbox",
    description: "A control that toggles between checked and unchecked states.",
  },
  "components/radio-group": {
    title: "Radio Group",
    description: "A set of checkable buttons where only one can be selected at a time.",
  },
  "components/number-input": {
    title: "NumberInput",
    description: "Numeric input with stepper buttons, minimum / maximum bounds, and configurable step size.",
  },
  "components/password-input": {
    title: "PasswordInput",
    description: "Password field with a visibility toggle.",
  },
  "components/password-requirement-list": {
    title: "PasswordRequirementList",
    description: "Displays password requirement completion states as a checklist.",
  },
  "components/password-strength-meter": {
    title: "PasswordStrengthMeter",
    description: "Displays an application-provided password strength score.",
  },
  "components/password-group": {
    title: "PasswordGroup",
    description: "Composes password input, requirements, strength, errors, and disabled feedback into one field group.",
  },
  "components/phone-input": {
    title: "PhoneInput",
    description: "Phone-number field with country calling-code affordance and input formatting.",
  },
  "components/postal-code-input": {
    title: "PostalCodeInput",
    description: "Postal-code field with formatting for Japanese 3-4 postal-code values.",
  },
  "components/range-slider": {
    title: "RangeSlider",
    description: "Selects a minimum and maximum value within a bounded range.",
  },
  "components/mention": {
    title: "Mention",
    description: "Textarea with trigger-based suggestions for inserting mentions.",
  },
  "components/spinner": {
    title: "Spinner",
    description: "Indicates that an action is in progress.",
  },
  "components/slider": {
    title: "Slider",
    description: "An input for selecting a value from a given range.",
  },
  "components/progress": {
    title: "Progress",
    description: "Displays the completion progress of a task.",
  },
  "components/select": {
    title: "Select",
    description: "Displays a list of options for the user to pick from, triggered by a button.",
  },
  "components/search-input": {
    title: "SearchInput",
    description: "A search field with a leading search icon and optional clear action.",
  },
  "components/avatar": {
    title: "Avatar",
    description: "An image element with a fallback for representing a user.",
  },
  "components/avatar-group": {
    title: "AvatarGroup",
    description: "Displays overlapping avatars and summarizes overflow as +N with a member list.",
  },
  "components/img": {
    title: "Img",
    description: "An image component with a loading skeleton and an error fallback.",
  },
  "components/image-preview": {
    title: "ImagePreview",
    description: "A framed image preview surface for asset cards, pickers, and media inspection.",
  },
  "components/kbd": {
    title: "Kbd",
    description: "Displays a keyboard shortcut key.",
  },
  "components/alert": {
    title: "Alert",
    description: "Displays a callout for user attention.",
  },
  "components/status-screen": {
    title: "StatusScreen",
    description: "Full-page status feedback for not-found, error, offline, forbidden, maintenance, and coming-soon states.",
  },
  "components/doc-note": {
    title: "DocNote",
    description: "Displays supplemental explanatory copy, reference links, and non-urgent documentation notes.",
  },
  "components/text-link": {
    title: "TextLink",
    description: "Displays inline links and automatically marks links that open a new tab.",
  },
  "components/toggle-group": {
    title: "Toggle Group",
    description: "A set of two-state buttons that can be toggled on or off.",
  },
  "components/toggle": {
    title: "Toggle",
    description: "A single pressable button with an on/off pressed state.",
  },
  "components/tag": {
    title: "Tag",
    description: "Displays short labels for categories, states, and keywords, optionally with a remove action.",
  },
  "components/tool-pill": {
    title: "ToolPill",
    description: "Displays editing tools and mode switches as tooltip-backed icon pills.",
  },
  "components/timeline": {
    title: "Timeline",
    description: "Displays history, progress, and planned steps as vertical chronological items.",
  },
  "components/tree-view": {
    title: "TreeView",
    description: "Displays parent-child structures such as files, settings, and nested categories as an expandable tree.",
  },
  "components/file-tree": {
    title: "FileTree",
    description: "Displays file and folder hierarchies with size or count metadata, row actions, and single or multiple selection.",
  },
  "components/card": {
    title: "Card",
    description: "Displays a card with header, content, and footer.",
  },
  "components/list": {
    title: "List",
    description: "A semantic list with customizable markers and spacing.",
  },
  "components/markdown-renderer": {
    title: "MarkdownRenderer",
    description: "Renders markdown source text with GunjoUI body styles.",
  },
  "components/accordion": {
    title: "Accordion",
    description: "A vertically stacked set of interactive headings that each reveal a section of content.",
  },
  "components/accordion-group": {
    title: "AccordionGroup",
    description: "A labeled accordion composition with one control that toggles between opening all and closing all sections.",
  },
  "components/searchable-accordion": {
    title: "SearchableAccordion",
    description: "A searchable and category-filterable accordion composition with result counts and no-result feedback.",
  },
  "components/breadcrumb": {
    title: "Breadcrumb",
    description: "Displays the path to the current resource using a hierarchy of links.",
  },
  "components/dropdown-menu": {
    title: "Dropdown Menu",
    description: "Displays a menu of actions or functions, triggered by a button.",
  },
  "components/alert-dialog": {
    title: "AlertDialog",
    description: "A modal confirmation dialog for important or destructive actions such as deleting or discarding data.",
  },
  "components/popover": {
    title: "Popover",
    description: "Shows a small contextual panel for forms, status, or explanatory content near a trigger.",
  },
  "components/command": {
    title: "Command",
    description: "Fast, composable, unstyled command menu for React.",
  },
  "components/calendar": {
    title: "Calendar",
    description: "A date field component that allows users to enter and edit date.",
  },
  "components/combobox": {
    title: "Combobox",
    description: "A searchable select control for choosing one option from a list.",
  },
  "components/date-picker": {
    title: "DatePicker",
    description: "A date input with a calendar popover for choosing a single date.",
  },
  "components/date-range-picker": {
    title: "DateRangePicker",
    description: "Pick a start and end date together with a two-month calendar popover.",
  },
  "components/editable-field": {
    title: "EditableField",
    description: "A labelled field that switches between read-only display and explicit save/cancel editing.",
  },
  "components/table": {
    title: "Table",
    description: "Displays row-and-column data with headers, body rows, and optional summary rows for comparison.",
  },
  "components/statistic": {
    title: "Statistic",
    description: "Displays a metric label, value, change indicator, and supporting hint.",
  },
  "components/tabs": {
    title: "Tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  "components/toast": {
    title: "Toast",
    description: "A succinct message that is displayed temporarily.",
  },
  "components/tooltip": {
    title: "Tooltip",
    description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
  "components/dialog": {
    title: "Dialog",
    description: "A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.",
  },
  "components/drawer": {
    title: "Drawer",
    description: "A panel that slides in from an edge so users can review supporting details or settings in context.",
  },
  "components/modal": {
    title: "Modal",
    description: "A modal dialog that interrupts the user with important content.",
  },
  "components/onboarding-flow": {
    title: "OnboardingFlow",
    description: "Guided multi-step flow for setup or product onboarding.",
  },
  "components/carousel": {
    title: "Carousel",
    description: "A component for displaying slides or carousel content.",
  },
  "components/code": {
    title: "Code",
    description: "Displays short inline code, commands, or values within body text.",
  },
  "components/code-block": {
    title: "CodeBlock",
    description: "Displays a code block with optional filename, language label, and copy action.",
  },
  "components/color-swatch": {
    title: "ColorSwatch",
    description: "Displays a color value with a token label and optional copy action.",
  },
  "components/data-table": {
    title: "DataTable",
    description: "Displays row data with column definitions, optional filtering, and pagination.",
  },
  "components/action-data-table": {
    title: "ActionDataTable",
    description: "Displays row data with selection, bulk actions, and row actions.",
  },
  "components/pagination": {
    title: "Pagination",
    description: "Navigation for moving through paged lists or search results. Use it with page numbers, ellipses, previous/next controls, and optional row summaries or page-size controls.",
  },
  "components/document-pager": {
    title: "DocumentPager",
    description: "Adjacent-document navigation for moving to the previous or next page.",
  },
  "components/sort-button": {
    title: "Sort Button",
    description: "A button for toggling the sort order.",
  },
  "components/tag-input": {
    title: "TagInput",
    description: "A tag field for adding and removing multiple short labels.",
  },
  "components/filter-button": {
    title: "Filter Button",
    description: "A filter trigger that combines selected-state badges with a popover for list or custom filter controls.",
  },
  "components/progress-widget": {
    title: "Progress Widget",
    description: "A widget that displays progress.",
  },
  "components/notification-center": {
    title: "Notification Center",
    description: "A UI for listing and managing notifications.",
  },
  "components/status-bar": {
    title: "Status Bar",
    description: "A bar that displays status or contextual information.",
  },
  "components/sidebar-item": {
    title: "SidebarItem",
    description: "A selectable sidebar row with icon, label, count, nested expansion, and optional trailing actions.",
  },
  "components/h-stack": {
    title: "HStack",
    description: "Horizontal stack for arranging actions, labels, and compact content with controlled spacing, alignment, and wrapping.",
  },
  "components/v-stack": {
    title: "VStack",
    description: "Vertical stack for forms, cards, and content groups with controlled spacing, alignment, and distribution.",
  },
  "components/scroll-area": {
    title: "Scroll Area",
    description: "Constrains visible content and provides consistent styling for vertical and horizontal scroll regions.",
  },
  "components/context-menu": {
    title: "Context Menu",
    description: "Displays a menu to the user—such as a set of actions or functions—triggered by a right click.",
  },
  "components/menubar": {
    title: "Menubar",
    description: "A persistent menu bar commonly found in desktop applications.",
  },
  "components/hover-card": {
    title: "Hover Card",
    description: "For sighted users to preview content available behind a link.",
  },
  "components/sheet": {
    title: "Sheet",
    description: "Dialog-based edge panel for supporting settings, forms, and navigation without leaving the current screen.",
  },
  "components/resizable": {
    title: "Resizable",
    description: "Accessible resizable panel groups and layouts with keyboard support.",
  },
  "components/collapsible-panel-toggle": {
    title: "CollapsiblePanelToggle",
    description: "A boundary control for opening and closing collapsible panels from any edge.",
  },
  "components/chat-input": {
    title: "ChatInput",
    description: "Chat composer with multiline input, attachment action, send and stop controls, and disabled-state feedback.",
  },
  "components/chat-composer": {
    title: "ChatComposer",
    description: "Container that composes ChatInput with choices, workspace context, usage status, and accessory UI.",
  },
  "components/chat-message": {
    title: "ChatMessage",
    description: "Message row for assistant, user, system, and typing states in a chat transcript.",
  },
  "components/chat-panel": {
    title: "ChatPanel",
    description: "Contained chat surface that composes ChatMessage and ChatInput for support, assistant, or team conversation panels.",
  },
  "components/app-rail": {
    title: "App Rail",
    description: "A slim primary navigation rail anchored to the left side.",
  },
  "components/right-rail": {
    title: "Right Rail",
    description: "A desktop right-side rail for supporting information beside the main content.",
  },
  "components/page-aside": {
    title: "PageAside",
    description: "Responsive page support layout that places supporting information in a right rail on wide screens and a collapsible content block on narrow screens.",
  },
  "components/share-modal": {
    title: "Share Modal",
    description: "A modal for sharing content.",
  },
  "components/floating-panel": {
    title: "Floating Panel",
    description: "A panel for layering tools, status, and supporting information over a workspace or canvas. Dragging and resizing can be enabled when needed.",
  },
  "components/marquee-frame": {
    title: "Marquee Frame",
    description: "Fake-browser frame for reviewing patterns or screens across desktop, tablet, and mobile viewports.",
  },
  "components/spatial-canvas": {
    title: "Spatial Canvas",
    description: "A dotted canvas surface for placing panels or nodes with a configurable grid size.",
  },
  "components/toast-provider": {
    title: "Toast Provider",
    description: "Manages and renders toast notifications.",
  },
  "components/file-uploader": {
    title: "File Uploader",
    description: "A file uploader with drag-and-drop support.",
  },
  "components/inspector-panel": {
    title: "Inspector Panel",
    description: "A sectioned panel for inspecting and editing properties of the selected target.",
  },
  "components/command-palette": {
    title: "Command Palette",
    description: "A global command palette for navigation and actions.",
  },
  "components/charts": {
    title: "Charts Overview",
    description: "A category overview for composable chart primitives and chart cards used in dashboard patterns.",
  },
  "components/analytics-card": {
    title: "Analytics Card",
    description: "A metric card shell for chart previews, deltas, and supporting context.",
  },
  "components/sparkline-chart": {
    title: "Sparkline Chart",
    description: "A compact line, area, or step trend chart for dense dashboard cards.",
  },
  "components/line-chart": {
    title: "Line Chart",
    description: "A multi-series line or area chart for time-series comparison.",
  },
  "components/ribbon-chart": {
    title: "Ribbon Chart",
    description: "A ribbon chart for changing flow, volume, or segment width over time.",
  },
  "components/radial-bar-chart": {
    title: "Radial Bar Chart",
    description: "A concentric radial bar chart for progress, share, or capacity comparison.",
  },
  "components/bar-chart": {
    title: "Bar Chart",
    description: "A vertical or horizontal bar chart with an optional average marker.",
  },
  "components/stacked-bar-chart": {
    title: "Stacked Bar Chart",
    description: "A vertical or horizontal stacked bar chart for grouped segment comparison.",
  },
  "components/distribution-bar": {
    title: "Distribution Bar",
    description: "A stacked percentage bar for segments, channels, and allocation data.",
  },
  "components/mini-distribution-bar-card": {
    title: "Mini Distribution Bar Card",
    description: "A compact tick distribution card for category share, capacity, and utilization widgets.",
  },
  "components/segment-timeline-card": {
    title: "Segment Timeline Card",
    description: "A horizontal segment timeline card for sleep stages, uptime states, and categorical duration ranges.",
  },
  "components/donut-chart": {
    title: "Donut Chart",
    description: "A donut chart for proportional segments with an optional center value.",
  },
  "components/pie-chart": {
    title: "Pie Chart",
    description: "A pie chart for comparing proportional segment values.",
  },
  "components/gauge-chart": {
    title: "Gauge Chart",
    description: "A semi-circle gauge for scores, progress, and capacity values.",
  },
  "components/segmented-gauge-card": {
    title: "Segmented Gauge Card",
    description: "A segmented semicircle gauge card for spend, progress, risk, and status dashboards.",
  },
  "components/radar-chart": {
    title: "Radar Chart",
    description: "A multi-axis radar chart for comparing normalized scores.",
  },
  "components/heatmap-chart": {
    title: "Heatmap Chart",
    description: "A density grid for day, time, and cohort intensity patterns.",
  },
  "components/activity-timeline-card": {
    title: "Activity Timeline Card",
    description: "A card that combines summary values, a time-slot timeline, and segment bars for activity, sleep, or operations data.",
  },
  "components/labeled-donut-card": {
    title: "Labeled Donut Card",
    description: "A donut card that pairs a center summary with external labels for readable segment comparison.",
  },
  "components/retention-cohort-card": {
    title: "Retention Cohort Card",
    description: "A cohort card for comparing retention by acquisition or start period.",
  },
  "components/quadrant-matrix": {
    title: "Quadrant Matrix",
    description: "A four-quadrant matrix for plotting and ranking items by x/y position.",
  },
  "components/chart-legend": {
    title: "Chart Legend",
    description: "Legend rows for chart series, segment labels, and values.",
  },
  "components/choropleth-map": {
    title: "Choropleth Map",
    description: "A GeoJSON-style region density map with markers and ranked locations.",
  },
  "components/concentric-progress-card": {
    title: "Concentric Progress Card",
    description: "A multi-ring progress card for storage, quota, and utilization widgets.",
  },
  "components/asset-card": {
    title: "Asset Card",
    description: "A selectable asset card for media libraries and creative result grids.",
  },
  "components/asset-grid": {
    title: "Asset Grid",
    description: "A responsive grid for rendering asset cards with optional grouping.",
  },
  "components/metadata-list": {
    title: "MetadataList",
    description: "A label/value metadata list for inspectors and detail panels.",
  },
  "components/tag-editor": {
    title: "TagEditor",
    description: "A tag editing control for adding, removing, and choosing tags from suggestions.",
  },
  "components/asset-inspector-panel": {
    title: "Asset Inspector Panel",
    description: "An inspector panel for asset preview, tags, metadata, and asset actions.",
  },
  "components/media-lightbox": {
    title: "Media Lightbox",
    description: "A large media preview overlay with zoom, navigation, and asset actions.",
  },
  "components/media-picker-dialog": {
    title: "Media Picker Dialog",
    description: "A dialog for searching and selecting one or more assets from a media library.",
  },
  "components/aspect-ratio": {
    title: "AspectRatio",
    description: "A layout primitive that preserves a fixed ratio for image, video, iframe, and other media surfaces.",
  },
  "components/cluster": {
    title: "Cluster",
    description: "A wrapping horizontal layout primitive for tags, buttons, and compact action groups.",
  },
  "components/container": {
    title: "Container",
    description: "A layout primitive for consistent page width, horizontal padding, and centered sections.",
  },
  "components/device-frame": {
    title: "DeviceFrame",
    description: "A fake browser frame with switchable desktop, tablet, and mobile viewports.",
  },
  "components/grid": {
    title: "Grid",
    description: "A CSS grid wrapper for cards and media with configurable columns, gap, and minimum item width.",
  },
  "components/dashboard": {
    title: "Dashboard",
    description: "A standard dashboard layout with a sidebar and header.",
  },
  "components/editor": {
    title: "Editor",
    description: "A Figma-style editor layout with sidebars and a canvas.",
  },
  "components/settings": {
    title: "Settings",
    description: "A settings page layout with navigation and a form area.",
  },
  "components/auth": {
    title: "Auth",
    description: "A split-screen layout for sign-in and sign-up.",
  },
  "components/kanban": {
    title: "Kanban",
    description: "A horizontally scrolling board layout.",
  },
  "components/landing": {
    title: "Landing",
    description: "A landing page with hero and feature sections.",
  },
  "components/chat": {
    title: "Chat",
    description: "A layout for messaging applications.",
  },
  "components/bannalyze": {
    title: "Bannalyze",
    description: "Template for the Bannalyze application.",
  },
  "components/media-library": {
    title: "Media Library",
    description: "A layout for media library applications.",
  },
};
