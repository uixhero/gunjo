#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import {
  assertAnyMatch,
  assertMatch,
  assertNoMatch,
  runVerificationCli,
  throwVerificationErrors,
  withRequiredVariants,
} from "./design-verify-assertions.mjs";
import { readNamedSources } from "./design-verify-source-files.mjs";
import { readCategorySpec } from "./design-verify-spec-paths.mjs";

const TEMPLATE_SPEC_PATH = "design/component-specs/patterns-core.json";

export function verifyTemplateDrift({ root = ROOT } = {}) {
  const { spec, sourceDirPath } = readCategorySpec({ root, category: "patterns" });

  const dashboardTemplate = spec.components?.dashboardTemplate;
  const editorTemplate = spec.components?.editorTemplate;
  const landingTemplate = spec.components?.landingTemplate;
  const authTemplate = spec.components?.authTemplate;
  const kanbanTemplate = spec.components?.kanbanTemplate;
  const chatTemplate = spec.components?.chatTemplate;
  const settingsTemplate = spec.components?.settingsTemplate;
  const bannalyzeTemplate = spec.components?.bannalyzeTemplate;
  const mediaLibraryTemplate = spec.components?.mediaLibraryTemplate;

  const {
    dashboard: dashboardSource,
    editor: editorSource,
    landing: landingSource,
    docs: docsSource,
    pricing: pricingSource,
    auth: authSource,
    kanban: kanbanSource,
    chat: chatSource,
    settings: settingsSource,
    bannalyze: bannalyzeSource,
    mediaLibrary: mediaLibrarySource,
  } = readNamedSources(sourceDirPath, {
    dashboard: "DashboardTemplate.tsx",
    editor: "EditorTemplate.tsx",
    landing: "LandingTemplate.tsx",
    docs: "DocsTemplate.tsx",
    pricing: "PricingTemplate.tsx",
    auth: "AuthTemplate.tsx",
    kanban: "KanbanTemplate.tsx",
    chat: "ChatTemplate.tsx",
    settings: "SettingsTemplate.tsx",
    bannalyze: "BannalyzeTemplate.tsx",
    mediaLibrary: "MediaLibraryTemplate.tsx",
  });

  const errors = [];

  withRequiredVariants({
    errors,
    componentSpec: dashboardTemplate,
    componentKey: "dashboardTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = dashboardTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(
        errors,
        dashboardSource,
        /\bmin-h-screen\b/,
        'DashboardTemplate should include "min-h-screen"'
      );
    }

    const header = dashboardTemplate.nodes?.header;
    if (header?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        dashboardSource,
        /\bborder-b\b/,
        'DashboardTemplate should include "border-b"'
      );
    }

    const sidebar = dashboardTemplate.nodes?.sidebar;
    if (sidebar?.width === 256) {
      assertMatch(
        errors,
        dashboardSource,
        /\bw-64\b/,
        'DashboardTemplate sidebar should include "w-64"'
      );
    }

    const main = dashboardTemplate.nodes?.main;
    if (main?.fill) {
      assertMatch(errors, dashboardSource, /\bbg-muted\/50\b/, 'DashboardTemplate main should include "bg-muted/50"');
    }

    const content = dashboardTemplate.nodes?.content;
    if (content?.gap === 32) {
      assertMatch(
        errors,
        dashboardSource,
        /\bspace-y-8\b/,
        'DashboardTemplate content should include "space-y-8"'
      );
    }
    if (Array.isArray(content?.padding) && content.padding[0] === 24) {
      assertMatch(
        errors,
        dashboardSource,
        /\bpy-6\b/,
        'DashboardTemplate content should include "py-6"'
      );
    }
    if (Array.isArray(content?.padding) && content.padding[1] === 16) {
      assertMatch(
        errors,
        dashboardSource,
        /\bpx-4\b/,
        'DashboardTemplate content should include "px-4"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: editorTemplate,
    componentKey: "editorTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = editorTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(
        errors,
        editorSource,
        /\bh-full\b/,
        'EditorTemplate should include "h-full"'
      );
      assertMatch(
        errors,
        editorSource,
        /\bmin-h-0\b/,
        'EditorTemplate should include "min-h-0"'
      );
    }

    const topBar = editorTemplate.nodes?.topBar;
    if (topBar?.height === 56) {
      assertMatch(
        errors,
        editorSource,
        /\bh-14\b/,
        'EditorTemplate top bar should include "h-14"'
      );
    }

    const leftPanel = editorTemplate.nodes?.leftPanel;
    if (leftPanel?.width === 256) {
      assertMatch(
        errors,
        editorSource,
        /\bw-64\b/,
        'EditorTemplate left panel should include "w-64"'
      );
    }

    const rightPanel = editorTemplate.nodes?.rightPanel;
    if (rightPanel?.width === 288) {
      assertMatch(
        errors,
        editorSource,
        /\bw-72\b/,
        'EditorTemplate right panel should include "w-72"'
      );
    }

    const canvas = editorTemplate.nodes?.canvas;
    if (canvas?.fill) {
      assertMatch(errors, editorSource, /\bbg-muted\/50\b/, 'EditorTemplate canvas should include "bg-muted/50"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: landingTemplate,
    componentKey: "landingTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = landingTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(
        errors,
        landingSource,
        /\bmin-h-screen\b/,
        'LandingTemplate should include "min-h-screen"'
      );
      // Sections must compose the Container component (centered + padded),
      // not the bare Tailwind `.container` utility, which left-pins content
      // with no gutters. Guards against the cold-test #22 regression (#111).
      assertMatch(
        errors,
        landingSource,
        /<Container\b/,
        'LandingTemplate should compose the Container component (not bare .container) for centered, padded sections'
      );
      assertNoMatch(
        errors,
        landingSource,
        /className="container\b/,
        'LandingTemplate should not use the bare Tailwind ".container" utility (use the Container component)'
      );
    }

    const header = landingTemplate.nodes?.header;
    if (header?.height === 56) {
      assertMatch(
        errors,
        landingSource,
        /\bh-14\b/,
        'LandingTemplate header should include "h-14"'
      );
    }
    assertMatch(
      errors,
      landingSource,
      /sticky top-0 z-50/,
      "LandingTemplate should keep sticky header positioning"
    );

    const featureSection = landingTemplate.nodes?.featureSection;
    if (Array.isArray(featureSection?.padding) && featureSection.padding[0] === 48) {
      assertMatch(
        errors,
        landingSource,
        /\bpy-12\b/,
        'LandingTemplate feature section should include "py-12"'
      );
    }
    },
  });

  // DocsTemplate must be mobile-responsive: a single column on phones with the
  // sidebar collapsed (the consumer supplies a drawer/Sheet), revealing the
  // multi-column sidebar+content+TOC grid only at lg/xl. Guards against the
  // cold-test #23 regression where a hard 200px sidebar column squished
  // content on phones (#118).
  assertMatch(
    errors,
    docsSource,
    /\bgrid-cols-1\b/,
    'DocsTemplate should stack to a single column on mobile ("grid-cols-1")'
  );
  assertMatch(
    errors,
    docsSource,
    /lg:grid-cols-\[220px_minmax\(0,1fr\)\]/,
    'DocsTemplate should reveal the sidebar+content grid at lg'
  );
  assertMatch(
    errors,
    docsSource,
    /hidden lg:block border-r/,
    'DocsTemplate sidebar should be hidden on mobile and shown at lg ("hidden lg:block")'
  );
  assertNoMatch(
    errors,
    docsSource,
    /grid-cols-\[200px/,
    'DocsTemplate must not pin a fixed sidebar column at the base breakpoint'
  );

  // PricingTemplate is data-driven (cold-test #14/#25, #80): a billing toggle, a
  // featured plan with a Badge (not just color), a configurable heading level
  // (no hardcoded <h1>), and a responsive grid that handles 4 plans. Source-based
  // because the pricingTemplate spec is null until the .pen node ids are mapped
  // (#138). Guards the redesign from regressing to the old fixed stub.
  assertMatch(
    errors,
    pricingSource,
    /<ToggleGroup\b/,
    "PricingTemplate should render a billing-period ToggleGroup"
  );
  assertMatch(
    errors,
    pricingSource,
    /<Badge\b/,
    "PricingTemplate featured plan should render a Badge (not color-only)"
  );
  assertMatch(
    errors,
    pricingSource,
    /\bheadingLevel\b/,
    "PricingTemplate title should use a configurable headingLevel"
  );
  assertNoMatch(
    errors,
    pricingSource,
    /<h1[ >]/,
    "PricingTemplate should not hardcode an <h1> (use headingLevel)"
  );
  assertMatch(
    errors,
    pricingSource,
    /\bgrid-cols-1\b/,
    "PricingTemplate grid should be responsive (grid-cols-1 base)"
  );
  assertNoMatch(
    errors,
    pricingSource,
    /md:grid-cols-3/,
    "PricingTemplate should not pin a fixed md:grid-cols-3 (must handle 4 plans)"
  );

  withRequiredVariants({
    errors,
    componentSpec: authTemplate,
    componentKey: "authTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = authTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(errors, authSource, /\bmin-h-screen\b/, 'AuthTemplate should include "min-h-screen"');
      assertMatch(
        errors,
        authSource,
        /lg:grid-cols-2/,
        "AuthTemplate should include two-column grid on large screens"
      );
    }

    const visualPanel = authTemplate.nodes?.visualPanel;
    if (Array.isArray(visualPanel?.padding) && visualPanel.padding[0] === 40) {
      assertMatch(errors, authSource, /\bp-10\b/, 'AuthTemplate visual panel should include "p-10"');
    }
    if (visualPanel?.fill) {
      assertMatch(errors, authSource, /\bbg-foreground\b/, 'AuthTemplate should include "bg-foreground"');
    }

    const formPanel = authTemplate.nodes?.formPanel;
    if (Array.isArray(formPanel?.padding) && formPanel.padding[0] === 32) {
      assertMatch(errors, authSource, /\blg:p-8\b/, 'AuthTemplate form panel should include "lg:p-8"');
    }

    const formContainer = authTemplate.nodes?.formContainer;
    if (formContainer?.width === 350) {
      assertMatch(
        errors,
        authSource,
        /sm:w-\[350px\]/,
        'AuthTemplate form container should include "sm:w-[350px]"'
      );
    }
    if (formContainer?.gap === 24) {
      assertMatch(
        errors,
        authSource,
        /\bspace-y-6\b/,
        'AuthTemplate form container should include "space-y-6"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: kanbanTemplate,
    componentKey: "kanbanTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = kanbanTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(errors, kanbanSource, /\bh-full\b/, 'KanbanTemplate should include "h-full"');
      assertMatch(errors, kanbanSource, /\bmin-h-0\b/, 'KanbanTemplate should include "min-h-0"');
    }

    const sidebar = kanbanTemplate.nodes?.sidebar;
    if (sidebar?.width === 256) {
      assertMatch(
        errors,
        kanbanSource,
        /\bw-64\b/,
        'KanbanTemplate sidebar should include "w-64"'
      );
    }

    const header = kanbanTemplate.nodes?.header;
    if (header?.height === 56) {
      assertMatch(
        errors,
        kanbanSource,
        /\bh-14\b/,
        'KanbanTemplate header should include "h-14"'
      );
    }
    if (header?.fill) {
      assertMatch(
        errors,
        kanbanSource,
        /bg-muted\/40/,
        'KanbanTemplate header should include "bg-muted/40"'
      );
    }

    const board = kanbanTemplate.nodes?.board;
    if (Array.isArray(board?.padding) && board.padding[0] === 24) {
      assertMatch(errors, kanbanSource, /\bp-6\b/, 'KanbanTemplate board should include "p-6"');
    }

    const columns = kanbanTemplate.nodes?.columns;
    if (columns?.gap === 24) {
      assertMatch(
        errors,
        kanbanSource,
        /\bgap-6\b/,
        'KanbanTemplate columns should include "gap-6"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: chatTemplate,
    componentKey: "chatTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = chatTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(errors, chatSource, /\bh-full\b/, 'ChatTemplate should include "h-full"');
      assertMatch(errors, chatSource, /\bmin-h-0\b/, 'ChatTemplate should include "min-h-0"');
    }

    const sidebarList = chatTemplate.nodes?.sidebarList;
    if (sidebarList?.width === 280) {
      assertMatch(
        errors,
        chatSource,
        /w-\[280px\]/,
        'ChatTemplate sidebar list should include "w-[280px]"'
      );
    }
    if (sidebarList?.fill) {
      assertMatch(
        errors,
        chatSource,
        /bg-muted\/30/,
        'ChatTemplate sidebar list should include "bg-muted/30"'
      );
    }

    const header = chatTemplate.nodes?.header;
    if (header?.height === 56) {
      assertMatch(errors, chatSource, /\bh-14\b/, 'ChatTemplate header should include "h-14"');
    }

    const messages = chatTemplate.nodes?.messages;
    if (Array.isArray(messages?.padding) && messages.padding[0] === 16) {
      assertMatch(
        errors,
        chatSource,
        /overflow-y-auto p-4/,
        'ChatTemplate messages should include "overflow-y-auto p-4"'
      );
    }

    const composer = chatTemplate.nodes?.composer;
    if (Array.isArray(composer?.padding) && composer.padding[0] === 16) {
      assertMatch(
        errors,
        chatSource,
        /p-4 border-t bg-background/,
        'ChatTemplate composer should include "p-4 border-t bg-background"'
      );
    }

    const sidebarDetail = chatTemplate.nodes?.sidebarDetail;
    if (sidebarDetail?.width === 300) {
      assertMatch(
        errors,
        chatSource,
        /w-\[300px\]/,
        'ChatTemplate detail sidebar should include "w-[300px]"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: settingsTemplate,
    componentKey: "settingsTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = settingsTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(errors, settingsSource, /\bmd:hidden\b/, 'SettingsTemplate should include "md:hidden"');
      assertMatch(errors, settingsSource, /\bmd:flex\b/, 'SettingsTemplate should include "md:flex"');
    }

    const mobileView = settingsTemplate.nodes?.mobileView;
    if (Array.isArray(mobileView?.padding) && mobileView.padding[0] === 16) {
      assertMatch(
        errors,
        settingsSource,
        /\bp-4 space-y-4\b/,
        'SettingsTemplate mobile view should include "p-4 space-y-4"'
      );
    }

    const desktopView = settingsTemplate.nodes?.desktopView;
    if (Array.isArray(desktopView?.padding) && desktopView.padding[0] === 40) {
      assertMatch(
        errors,
        settingsSource,
        /p-10 pb-16/,
        'SettingsTemplate desktop view should include "p-10 pb-16"'
      );
    }

    const desktopTitle = settingsTemplate.nodes?.desktopTitle;
    if (desktopTitle?.fontSize === 24) {
      assertMatch(
        errors,
        settingsSource,
        /text-2xl font-bold tracking-tight/,
        "SettingsTemplate desktop title should keep expected typography"
      );
    }

    const separator = settingsTemplate.nodes?.separator;
    if (separator?.height === 1) {
      assertMatch(
        errors,
        settingsSource,
        /bg-border h-\[1px\] w-full my-6/,
        "SettingsTemplate should keep separator styles"
      );
    }

    const desktopBody = settingsTemplate.nodes?.desktopBody;
    if (desktopBody?.gap === 48) {
      assertMatch(
        errors,
        settingsSource,
        /lg:space-x-12/,
        "SettingsTemplate desktop body should include lg:space-x-12"
      );
    }

    const nav = settingsTemplate.nodes?.nav;
    if (nav?.width) {
      assertMatch(
        errors,
        settingsSource,
        /-mx-4 lg:w-1\/5/,
        "SettingsTemplate navigation should include lg:w-1/5"
      );
    }

    const content = settingsTemplate.nodes?.content;
    if (content?.width) {
      assertMatch(
        errors,
        settingsSource,
        /flex-1 lg:max-w-2xl/,
        "SettingsTemplate content should include lg:max-w-2xl"
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: bannalyzeTemplate,
    componentKey: "bannalyzeTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = bannalyzeTemplate.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bh-full\b/,
        'BannalyzeTemplate should include "h-full"'
      );
      assertMatch(
        errors,
        bannalyzeSource,
        /\bmin-h-0\b/,
        'BannalyzeTemplate should include "min-h-0"'
      );
    }
    if (defaultVariant?.fill) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bbg-background\b/,
        'BannalyzeTemplate should include "bg-background"'
      );
    }

    const header = bannalyzeTemplate.nodes?.header;
    if (header?.height === 56) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bh-14\b/,
        'BannalyzeTemplate header should include "h-14"'
      );
    }
    if (header?.fill) {
      assertMatch(
        errors,
        bannalyzeSource,
        /bg-background\/95/,
        'BannalyzeTemplate header should include "bg-background/95"'
      );
    }
    if (Array.isArray(header?.padding) && header.padding[1] === 16) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bpx-4\b/,
        'BannalyzeTemplate header should include "px-4"'
      );
    }

    const sidebar = bannalyzeTemplate.nodes?.sidebar;
    if (sidebar?.width === 256) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bw-64\b/,
        'BannalyzeTemplate sidebar should include "w-64"'
      );
    }
    if (sidebar?.fill) {
      assertMatch(
        errors,
        bannalyzeSource,
        /bg-muted\/10/,
        'BannalyzeTemplate sidebar should include "bg-muted/10"'
      );
    }

    const canvas = bannalyzeTemplate.nodes?.canvas;
    if (canvas?.fill) {
      assertMatch(
        errors,
        bannalyzeSource,
        /bg-muted\/20/,
        'BannalyzeTemplate canvas should include "bg-muted/20"'
      );
    }

    const canvasInner = bannalyzeTemplate.nodes?.canvasInner;
    if (Array.isArray(canvasInner?.padding) && canvasInner.padding[0] === 16) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bw-full h-full p-4 overflow-auto/,
        "BannalyzeTemplate canvas inner should include expected sizing and padding"
      );
    }

    const inspector = bannalyzeTemplate.nodes?.inspector;
    if (inspector?.width === 320) {
      assertMatch(
        errors,
        bannalyzeSource,
        /\bw-80\b/,
        'BannalyzeTemplate inspector should include "w-80"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: mediaLibraryTemplate,
    componentKey: "mediaLibraryTemplate",
    specPath: TEMPLATE_SPEC_PATH,
    run: () => {
    const defaultVariant = mediaLibraryTemplate.variants.find(
      (variant) => variant?.key === "default"
    );
    if (defaultVariant) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bh-full\b/,
        'MediaLibraryTemplate should include "h-full"'
      );
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bmin-h-0\b/,
        'MediaLibraryTemplate should include "min-h-0"'
      );
    }
    if (defaultVariant?.fill) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bbg-background\b/,
        'MediaLibraryTemplate should include "bg-background"'
      );
    }

    const header = mediaLibraryTemplate.nodes?.header;
    if (header?.height === 56) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bh-14\b/,
        'MediaLibraryTemplate header should include "h-14"'
      );
    }
    if (Array.isArray(header?.padding) && header.padding[1] === 16) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bpx-4\b/,
        'MediaLibraryTemplate header should include "px-4"'
      );
    }

    const sidebar = mediaLibraryTemplate.nodes?.sidebar;
    if (sidebar?.width === 256) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bw-64\b/,
        'MediaLibraryTemplate sidebar should include "w-64"'
      );
    }
    if (sidebar?.fill) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /bg-muted\/10/,
        'MediaLibraryTemplate sidebar should include "bg-muted/10"'
      );
    }

    const gridArea = mediaLibraryTemplate.nodes?.gridArea;
    if (gridArea?.fill) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /flex-1 relative overflow-hidden flex flex-col bg-background/,
        "MediaLibraryTemplate grid area should keep expected base classes"
      );
    }

    const gridInner = mediaLibraryTemplate.nodes?.gridInner;
    if (gridInner?.width === "fill_container") {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bw-full h-full overflow-auto\b/,
        "MediaLibraryTemplate grid inner should include expected sizing classes"
      );
    }

    const details = mediaLibraryTemplate.nodes?.details;
    if (details?.width === 320) {
      assertMatch(
        errors,
        mediaLibrarySource,
        /\bw-80\b/,
        'MediaLibraryTemplate details panel should include "w-80"'
      );
    }
    },
  });

  throwVerificationErrors({
    errors,
    heading: "design:verify: template component drift detected",
  });
}

runVerificationCli({
  scriptName: "design-verify-template-drift.mjs",
  verify: verifyTemplateDrift,
  successMessage: "design:verify: template component drift check passed",
});
