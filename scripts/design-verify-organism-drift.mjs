#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import {
  assertMatch,
  runVerificationCli,
  throwVerificationErrors,
  withRequiredVariants,
} from "./design-verify-assertions.mjs";
import { readNamedSources } from "./design-verify-source-files.mjs";
import { readCategorySpec } from "./design-verify-spec-paths.mjs";

const NAVIGATION_SPEC_PATH = "design/component-specs/navigation-core.json";
const FEEDBACK_SPEC_PATH = "design/component-specs/feedback-core.json";
const LAYOUT_SPEC_PATH = "design/component-specs/layout-core.json";
const OVERLAY_SPEC_PATH = "design/component-specs/overlay-core.json";
const INPUTS_SPEC_PATH = "design/component-specs/inputs-core.json";

export function verifyOrganismDrift({ root = ROOT } = {}) {
  const { spec: feedbackSpec, sourceDirPath: feedbackSourceDirPath } =
    readCategorySpec({ root, category: "feedback" });
  const { spec: layoutSpec, sourceDirPath: layoutSourceDirPath } =
    readCategorySpec({ root, category: "layout" });
  const { spec: navigationSpec, sourceDirPath: navigationSourceDirPath } =
    readCategorySpec({ root, category: "navigation" });
  const { spec: overlaySpec, sourceDirPath: overlaySourceDirPath } =
    readCategorySpec({ root, category: "overlay" });
  const { spec: inputsSpec, sourceDirPath: inputsSourceDirPath } =
    readCategorySpec({ root, category: "inputs" });

  const appRail = navigationSpec.components?.appRail;
  const commandPalette = navigationSpec.components?.commandPalette;
  const rightRail = navigationSpec.components?.rightRail;
  const floatingPanel = overlaySpec.components?.floatingPanel;
  const inspectorPanel = layoutSpec.components?.inspectorPanel;
  const spatialCanvas = layoutSpec.components?.spatialCanvas;
  const shareModal = overlaySpec.components?.shareModal;
  const fileUploader = inputsSpec.components?.fileUploader;
  const toastProvider = feedbackSpec.components?.toastProvider;

  const { fileUploader: fileUploaderSource } = readNamedSources(inputsSourceDirPath, {
    fileUploader: "FileUploader.tsx",
  });

  const { floatingPanel: floatingPanelSource, shareModal: shareModalSource } =
    readNamedSources(overlaySourceDirPath, {
      floatingPanel: "FloatingPanel.tsx",
      shareModal: "ShareModal.tsx",
    });

  const {
    appRail: appRailSource,
    commandPalette: commandPaletteSource,
    rightRail: rightRailSource,
  } = readNamedSources(navigationSourceDirPath, {
    appRail: "AppRail.tsx",
    commandPalette: "CommandPalette.tsx",
    rightRail: "RightRail.tsx",
  });

  const { toastProvider: toastProviderSource } = readNamedSources(feedbackSourceDirPath, {
    toastProvider: "ToastProvider.tsx",
  });

  const {
    inspectorPanel: inspectorPanelSource,
    spatialCanvas: spatialCanvasSource,
  } = readNamedSources(layoutSourceDirPath, {
    inspectorPanel: "InspectorPanel.tsx",
    spatialCanvas: "SpatialCanvas.tsx",
  });

  const errors = [];

  withRequiredVariants({
    errors,
    componentSpec: appRail,
    componentKey: "appRail",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = appRail.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 64) {
      assertMatch(errors, appRailSource, /\bw-16\b/, 'AppRail should include "w-16"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 16) {
      assertMatch(errors, appRailSource, /\bpy-4\b/, 'AppRail should include "py-4"');
    }
    if (defaultVariant?.gap === 16) {
      assertMatch(errors, appRailSource, /\bgap-4\b/, 'AppRail should include "gap-4"');
    }
    if (defaultVariant?.fill) {
      assertMatch(errors, appRailSource, /\bbg-foreground\b/, 'AppRail should include "bg-foreground"');
    }

    const iconHome = appRail.nodes?.iconHome;
    if (iconHome?.fill) {
      assertMatch(errors, appRailSource, /\btext-muted\b/, 'AppRail should include "text-muted"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: commandPalette,
    componentKey: "commandPalette",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = commandPalette.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 480) {
      assertMatch(
        errors,
        commandPaletteSource,
        /<CommandDialog/,
        "CommandPalette should compose CommandDialog"
      );
    }

    const inputPlaceholder = commandPalette.nodes?.inputPlaceholder;
    if (inputPlaceholder?.content) {
      assertMatch(
        errors,
        commandPaletteSource,
        /placeholder\s*=\s*"Type a command or search\.\.\."/,
        'CommandPalette default placeholder should include "Type a command or search..."'
      );
    }

    const groupHeading = commandPalette.nodes?.groupHeading;
    if (groupHeading?.content) {
      assertMatch(
        errors,
        commandPaletteSource,
        /<CommandGroup heading=\{group\.heading\}>/,
        "CommandPalette should pass group headings to CommandGroup"
      );
    }

    const itemShortcut = commandPalette.nodes?.itemShortcut;
    if (itemShortcut?.content) {
      assertMatch(
        errors,
        commandPaletteSource,
        /<CommandShortcut>\{item\.shortcut\}<\/CommandShortcut>/,
        "CommandPalette should render CommandShortcut from item.shortcut"
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: rightRail,
    componentKey: "rightRail",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = rightRail.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 256) {
      assertMatch(errors, rightRailSource, /\bw-64\b/, 'RightRail should include "w-64"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, rightRailSource, /\bborder-l\b/, 'RightRail should include "border-l"');
      assertMatch(errors, rightRailSource, /\bborder-border\b/, 'RightRail should include "border-border"');
    }
    if (defaultVariant?.fill) {
      assertMatch(errors, rightRailSource, /\bbg-background\b/, 'RightRail should include "bg-background"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: floatingPanel,
    componentKey: "floatingPanel",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const glassVariant = floatingPanel.variants.find((variant) => variant?.key === "glass");
    if (glassVariant?.cornerRadius === 16) {
      assertMatch(
        errors,
        floatingPanelSource,
        /\brounded-2xl\b/,
        'FloatingPanel should include "rounded-2xl"'
      );
    }
    if (glassVariant?.stroke?.thickness === 1) {
      assertMatch(errors, floatingPanelSource, /\bborder\b/, 'FloatingPanel should include "border"');
    }
    if (glassVariant?.fill) {
      assertMatch(
        errors,
        floatingPanelSource,
        /variant === 'glass' && "bg-background\/80/,
        'FloatingPanel glass variant should include "bg-background/80"'
      );
    }

    const titleText = floatingPanel.nodes?.titleText;
    if (titleText?.fontSize === 14) {
      assertMatch(
        errors,
        floatingPanelSource,
        /\btext-sm\b/,
        'FloatingPanel title should include "text-sm"'
      );
    }
    if (`${titleText?.fontWeight}` === "600") {
      assertMatch(
        errors,
        floatingPanelSource,
        /\bfont-semibold\b/,
        'FloatingPanel title should include "font-semibold"'
      );
    }

    const titleBar = floatingPanel.nodes?.titleBar;
    if (Array.isArray(titleBar?.padding) && titleBar.padding[1] === 16) {
      assertMatch(
        errors,
        floatingPanelSource,
        /\bpx-4\b/,
        'FloatingPanel title bar should include "px-4"'
      );
    }
    if (Array.isArray(titleBar?.padding) && titleBar.padding[0] === 12) {
      assertMatch(
        errors,
        floatingPanelSource,
        /\bpy-3\b/,
        'FloatingPanel title bar should include "py-3"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: inspectorPanel,
    componentKey: "inspectorPanel",
    specPath: LAYOUT_SPEC_PATH,
    run: () => {
    const defaultVariant = inspectorPanel.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bborder-l\b/,
        'InspectorPanel should include "border-l"'
      );
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bborder-border\b/,
        'InspectorPanel should include "border-border"'
      );
    }
    if (defaultVariant?.fill) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bbg-background\b/,
        'InspectorPanel should include "bg-background"'
      );
    }

    const header = inspectorPanel.nodes?.header;
    if (header?.height === 48) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bh-12\b/,
        'InspectorPanel header should include "h-12"'
      );
    }
    if (Array.isArray(header?.padding) && header.padding[1] === 16) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bpx-4\b/,
        'InspectorPanel header should include "px-4"'
      );
    }

    const headerText = inspectorPanel.nodes?.headerText;
    if (headerText?.fontSize === 14) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\btext-sm\b/,
        'InspectorPanel header text should include "text-sm"'
      );
    }
    if (`${headerText?.fontWeight}` === "600") {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\bfont-semibold\b/,
        'InspectorPanel header text should include "font-semibold"'
      );
    }

    const sectionTitle = inspectorPanel.nodes?.sectionTitle;
    if (sectionTitle?.fontSize === 12) {
      assertMatch(
        errors,
        inspectorPanelSource,
        /\btext-xs\b/,
        'InspectorSection title should include "text-xs"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: spatialCanvas,
    componentKey: "spatialCanvas",
    specPath: LAYOUT_SPEC_PATH,
    run: () => {
    const defaultVariant = spatialCanvas.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.fill) {
      assertMatch(errors, spatialCanvasSource, /\bbg-muted\/50\b/, 'SpatialCanvas should include "bg-muted/50"');
    }
    assertMatch(
      errors,
      spatialCanvasSource,
      /radial-gradient\(circle,\s*hsl\(var\(--foreground\)\s*\/\s*0\.08\)\s*1px,\s*transparent 1px\)/,
      "SpatialCanvas should include token-based radial grid pattern"
    );
    assertMatch(
      errors,
      spatialCanvasSource,
      /linear-gradient\(to right,\s*hsl\(var\(--foreground\)\s*\/\s*0\.07\)\s*1px,\s*transparent 1px\)/,
      "SpatialCanvas should include token-based linear grid pattern"
    );

    const hint = spatialCanvas.nodes?.hint;
    if (hint?.fontSize === 14) {
      assertMatch(
        errors,
        spatialCanvasSource,
        /gridSize\s*=\s*20/,
        "SpatialCanvas default gridSize should remain 20"
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: shareModal,
    componentKey: "shareModal",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = shareModal.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 448) {
      assertMatch(errors, shareModalSource, /\bmax-w-md\b/, 'ShareModal should include "max-w-md"');
    }
    if (defaultVariant?.cornerRadius === 12) {
      assertMatch(
        errors,
        shareModalSource,
        /\brounded-xl\b/,
        'ShareModal should include "rounded-xl"'
      );
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, shareModalSource, /border border-border/, 'ShareModal should include "border border-border"');
    }

    const header = shareModal.nodes?.header;
    if (Array.isArray(header?.padding) && header.padding[0] === 12) {
      assertMatch(errors, shareModalSource, /\bpy-3\b/, 'ShareModal header should include "py-3"');
    }
    if (Array.isArray(header?.padding) && header.padding[1] === 16) {
      assertMatch(errors, shareModalSource, /\bpx-4\b/, 'ShareModal header should include "px-4"');
    }

    const titleText = shareModal.nodes?.titleText;
    if (titleText?.fontSize === 14) {
      assertMatch(errors, shareModalSource, /\btext-sm\b/, 'ShareModal title should include "text-sm"');
    }
    if (`${titleText?.fontWeight}` === "600") {
      assertMatch(
        errors,
        shareModalSource,
        /\bfont-semibold\b/,
        'ShareModal title should include "font-semibold"'
      );
    }

    const content = shareModal.nodes?.content;
    if (Array.isArray(content?.padding) && content.padding[0] === 24) {
      assertMatch(errors, shareModalSource, /\bp-6\b/, 'ShareModal content should include "p-6"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: fileUploader,
    componentKey: "fileUploader",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    const defaultVariant = fileUploader.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.gap === 16) {
      assertMatch(errors, fileUploaderSource, /\bgap-4\b/, 'FileUploader should include "gap-4"');
    }

    const dropzone = fileUploader.nodes?.dropzone;
    if (dropzone?.height === 128) {
      assertMatch(errors, fileUploaderSource, /\bh-32\b/, 'FileUploader dropzone should include "h-32"');
    }
    if (dropzone?.cornerRadius === 8) {
      assertMatch(
        errors,
        fileUploaderSource,
        /\brounded-lg\b/,
        'FileUploader dropzone should include "rounded-lg"'
      );
    }
    if (dropzone?.stroke?.thickness === 2) {
      assertMatch(
        errors,
        fileUploaderSource,
        /border-2 border-dashed/,
        'FileUploader dropzone should include "border-2 border-dashed"'
      );
    }

    const icon = fileUploader.nodes?.icon;
    if (icon?.width === 32 && icon?.height === 32) {
      assertMatch(errors, fileUploaderSource, /\bw-8 h-8\b/, 'FileUploader icon should include "w-8 h-8"');
    }

    const prompt = fileUploader.nodes?.prompt;
    if (prompt?.fontSize === 14) {
      assertMatch(
        errors,
        fileUploaderSource,
        /\btext-sm\b/,
        'FileUploader prompt should include "text-sm"'
      );
    }
    if (`${prompt?.fontWeight}` === "600") {
      assertMatch(
        errors,
        fileUploaderSource,
        /\bfont-semibold\b/,
        'FileUploader prompt should include "font-semibold"'
      );
    }

    const item = fileUploader.nodes?.item;
    if (Array.isArray(item?.padding) && item.padding[0] === 8) {
      assertMatch(errors, fileUploaderSource, /\bp-2\b/, 'FileUploader list item should include "p-2"');
    }
    if (item?.gap === 8) {
      assertMatch(errors, fileUploaderSource, /\bgap-2\b/, 'FileUploader list item should include "gap-2"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: toastProvider,
    componentKey: "toastProvider",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    const defaultVariant = toastProvider.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 320) {
      assertMatch(
        errors,
        toastProviderSource,
        /<ToastContext\.Provider/,
        "ToastProvider should expose ToastContext.Provider"
      );
    }
    if (defaultVariant?.gap === 8) {
      assertMatch(
        errors,
        toastProviderSource,
        /\bgap-2\b/,
        'ToastProvider stack should include "gap-2"'
      );
    }

    assertMatch(
      errors,
      toastProviderSource,
      /top-\[72px\]/,
      'ToastProvider should include "top-[72px]"'
    );
    assertMatch(
      errors,
      toastProviderSource,
      /\bright-6\b/,
      'ToastProvider should include "right-6"'
    );
    assertMatch(
      errors,
      toastProviderSource,
      /z-\[100\]/,
      'ToastProvider should include "z-[100]"'
    );
    assertMatch(
      errors,
      toastProviderSource,
      /\bpointer-events-none\b/,
      'ToastProvider should include "pointer-events-none"'
    );

    const itemText = toastProvider.nodes?.itemText;
    if (itemText?.content) {
      assertMatch(
        errors,
        toastProviderSource,
        /message=\{toast\.message\}/,
        "ToastProvider should forward toast.message to Toast"
      );
    }

    const defaultDuration = `${toastProvider.nodes?.defaultDuration?.content ?? ""}`;
    if (defaultDuration === "3000") {
      assertMatch(
        errors,
        toastProviderSource,
        /duration\s*=\s*3000/,
        "ToastProvider default duration should remain 3000"
      );
    }

    const exitDelay = `${toastProvider.nodes?.exitDelay?.content ?? ""}`;
    if (exitDelay === "300") {
      assertMatch(
        errors,
        toastProviderSource,
        /},\s*300\);/,
        "ToastProvider close animation delay should remain 300ms"
      );
    }
    },
  });

  throwVerificationErrors({
    errors,
    heading: "design:verify: organism component drift detected",
  });
}

runVerificationCli({
  scriptName: "design-verify-organism-drift.mjs",
  verify: verifyOrganismDrift,
  successMessage: "design:verify: organism component drift check passed",
});
