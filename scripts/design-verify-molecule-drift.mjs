#!/usr/bin/env node

import { ROOT } from "./design-sync/shared.mjs";
import {
  assertAnyMatch,
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
const DISPLAY_SPEC_PATH = "design/component-specs/display-core.json";
const INPUTS_SPEC_PATH = "design/component-specs/inputs-core.json";

export function verifyMoleculeDrift({ root = ROOT } = {}) {
  const { spec: feedbackSpec, sourceDirPath: feedbackSourceDirPath } =
    readCategorySpec({ root, category: "feedback" });
  const { spec: layoutSpec, sourceDirPath: layoutSourceDirPath } =
    readCategorySpec({ root, category: "layout" });
  const { spec: navigationSpec, sourceDirPath: navigationSourceDirPath } =
    readCategorySpec({ root, category: "navigation" });
  const { spec: overlaySpec, sourceDirPath: overlaySourceDirPath } =
    readCategorySpec({ root, category: "overlay" });
  const { spec: displaySpec, sourceDirPath: displaySourceDirPath } =
    readCategorySpec({ root, category: "display" });
  const { spec: inputsSpec, sourceDirPath: inputsSourceDirPath } =
    readCategorySpec({ root, category: "inputs" });

  const card = displaySpec.components?.card;
  const accordion = displaySpec.components?.accordion;
  const tabs = navigationSpec.components?.tabs;
  const list = displaySpec.components?.list;
  const breadcrumb = navigationSpec.components?.breadcrumb;
  const dropdownMenu = overlaySpec.components?.dropdownMenu;
  const popover = overlaySpec.components?.popover;
  const command = navigationSpec.components?.command;
  const calendar = inputsSpec.components?.calendar;
  const table = displaySpec.components?.table;
  const toast = feedbackSpec.components?.toast;
  const modal = overlaySpec.components?.modal;
  const carousel = displaySpec.components?.carousel;
  const pagination = navigationSpec.components?.pagination;
  const notificationCenter = feedbackSpec.components?.notificationCenter;
  const dialog = overlaySpec.components?.dialog;
  const sheet = overlaySpec.components?.sheet;
  const tooltip = overlaySpec.components?.tooltip;
  const hoverCard = overlaySpec.components?.hoverCard;
  const contextMenu = overlaySpec.components?.contextMenu;
  const menubar = navigationSpec.components?.menubar;
  const scrollArea = layoutSpec.components?.scrollArea;
  const resizable = layoutSpec.components?.resizable;
  const statusBar = feedbackSpec.components?.statusBar;
  const sidebarItem = navigationSpec.components?.sidebarItem;
  const chatInput = inputsSpec.components?.chatInput;
  const chatMessage = displaySpec.components?.chatMessage;
  const chatPanel = overlaySpec.components?.chatPanel;
  const filterButton = inputsSpec.components?.filterButton;
  const sortButton = inputsSpec.components?.sortButton;
  const progressWidget = feedbackSpec.components?.progressWidget;

  const {
    calendar: calendarSource,
    chatInput: chatInputSource,
    filterButton: filterButtonSource,
    sortButton: sortButtonSource,
  } = readNamedSources(inputsSourceDirPath, {
    calendar: "Calendar.tsx",
    chatInput: "ChatInput.tsx",
    filterButton: "FilterButton.tsx",
    sortButton: "SortButton.tsx",
  });

  const {
    card: cardSource,
    accordion: accordionSource,
    list: listSource,
    table: tableSource,
    carousel: carouselSource,
    chatMessage: chatMessageSource,
  } = readNamedSources(displaySourceDirPath, {
    card: "Card.tsx",
    accordion: "Accordion.tsx",
    list: "List.tsx",
    table: "Table.tsx",
    carousel: "Carousel.tsx",
    chatMessage: "ChatMessage.tsx",
  });

  const {
    dropdownMenu: dropdownMenuSource,
    popover: popoverSource,
    modal: modalSource,
    dialog: dialogSource,
    sheet: sheetSource,
    tooltip: tooltipSource,
    hoverCard: hoverCardSource,
    contextMenu: contextMenuSource,
    chatPanel: chatPanelSource,
  } = readNamedSources(overlaySourceDirPath, {
    dropdownMenu: "DropdownMenu.tsx",
    popover: "Popover.tsx",
    modal: "Modal.tsx",
    dialog: "Dialog.tsx",
    sheet: "Sheet.tsx",
    tooltip: "Tooltip.tsx",
    hoverCard: "HoverCard.tsx",
    contextMenu: "ContextMenu.tsx",
    chatPanel: "ChatPanel.tsx",
  });

  const {
    tabs: tabsSource,
    breadcrumb: breadcrumbSource,
    command: commandSource,
    pagination: paginationSource,
    menubar: menubarSource,
    sidebarItem: sidebarItemSource,
  } = readNamedSources(navigationSourceDirPath, {
    tabs: "Tabs.tsx",
    breadcrumb: "Breadcrumb.tsx",
    command: "Command.tsx",
    pagination: "Pagination.tsx",
    menubar: "Menubar.tsx",
    sidebarItem: "SidebarItem.tsx",
  });

  const {
    toast: toastSource,
    notificationCenter: notificationCenterSource,
    statusBar: statusBarSource,
    progressWidget: progressWidgetSource,
  } = readNamedSources(feedbackSourceDirPath, {
    toast: "Toast.tsx",
    notificationCenter: "NotificationCenter.tsx",
    statusBar: "StatusBar.tsx",
    progressWidget: "ProgressWidget.tsx",
  });

  const { scrollArea: scrollAreaSource, resizable: resizableSource } =
    readNamedSources(layoutSourceDirPath, {
      scrollArea: "ScrollArea.tsx",
      resizable: "Resizable.tsx",
    });

  const errors = [];

  withRequiredVariants({
    errors,
    componentSpec: card,
    componentKey: "card",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = card.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, cardSource, /\brounded-lg\b/, 'Card should include "rounded-lg"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, cardSource, /\bborder\b/, 'Card should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, cardSource, /\bbg-card\b/, 'Card should include "bg-card"');
    }

    const header = card.nodes?.header;
    if (
      Array.isArray(header?.padding) &&
      header.padding[0] === 24 &&
      header.padding[1] === 24
    ) {
      assertMatch(errors, cardSource, /\bp-6\b/, 'CardHeader should include "p-6"');
    }
    if (header?.gap === 6) {
      assertMatch(
        errors,
        cardSource,
        /\bspace-y-1\.5\b/,
        'CardHeader should include "space-y-1.5"'
      );
    }

    const headerTitle = card.nodes?.headerTitle;
    if (headerTitle?.fontSize === 20) {
      assertMatch(errors, cardSource, /\btext-xl\b/, 'CardTitle should include "text-xl"');
    }
    if (`${headerTitle?.fontWeight}` === "600") {
      assertMatch(
        errors,
        cardSource,
        /\bfont-semibold\b/,
        'CardTitle should include "font-semibold"'
      );
    }

    const headerDescription = card.nodes?.headerDescription;
    if (headerDescription?.fontSize === 14) {
      assertMatch(
        errors,
        cardSource,
        /\btext-sm\b/,
        'CardDescription should include "text-sm"'
      );
    }

    const content = card.nodes?.content;
    if (
      Array.isArray(content?.padding) &&
      content.padding[0] === 0 &&
      content.padding[1] === 24 &&
      content.padding[2] === 24
    ) {
      assertMatch(
        errors,
        cardSource,
        /\bp-6 pt-0\b/,
        'CardContent should include "p-6 pt-0"'
      );
    }

    const footer = card.nodes?.footer;
    if (
      Array.isArray(footer?.padding) &&
      footer.padding[0] === 0 &&
      footer.padding[1] === 24 &&
      footer.padding[2] === 24
    ) {
      assertMatch(
        errors,
        cardSource,
        /\bp-6 pt-0\b/,
        'CardFooter should include "p-6 pt-0"'
      );
    }
    if (footer?.gap === 12) {
      assertMatch(errors, cardSource, /\bgap-3\b/, 'CardFooter should include "gap-3"');
    }
    if (footer?.justifyContent === "space_between") {
      assertMatch(
        errors,
        cardSource,
        /\bjustify-between\b/,
        'CardFooter should include "justify-between"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: accordion,
    componentKey: "accordion",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      accordionSource,
      /\bAccordionVariantKey\b/,
      "Accordion should use generated AccordionVariantKey type"
    );
    assertMatch(
      errors,
      accordionSource,
      /\bRecord<AccordionVariantKey,\s*string>/,
      "Accordion state maps should be keyed by AccordionVariantKey"
    );

    const hasCollapsed = accordion.variants.some((variant) => variant?.key === "collapsed");
    const hasExpanded = accordion.variants.some((variant) => variant?.key === "expanded");

    if (hasCollapsed || hasExpanded) {
      assertMatch(
        errors,
        accordionSource,
        /\bborder-b\b/,
        'AccordionItem should include "border-b"'
      );
    }

    const triggerCollapsed = accordion.nodes?.triggerCollapsed;
    if (
      Array.isArray(triggerCollapsed?.padding) &&
      triggerCollapsed.padding[0] === 16 &&
      triggerCollapsed.padding[1] === 16
    ) {
      assertMatch(
        errors,
        accordionSource,
        /\bpx-4 py-4\b/,
        'AccordionTrigger should include "px-4 py-4"'
      );
    }

    const triggerTextCollapsed = accordion.nodes?.triggerTextCollapsed;
    if (`${triggerTextCollapsed?.fontWeight}` === "500") {
      assertMatch(
        errors,
        accordionSource,
        /\bfont-medium\b/,
        'AccordionTrigger text should include "font-medium"'
      );
    }
    if (triggerTextCollapsed?.fontSize === 14) {
      assertMatch(
        errors,
        accordionSource,
        /\btext-sm\b/,
        'AccordionTrigger text should include "text-sm"'
      );
    }

    const chevronCollapsed = accordion.nodes?.chevronCollapsed;
    if (chevronCollapsed?.width === 16 && chevronCollapsed?.height === 16) {
      assertMatch(
        errors,
        accordionSource,
        /\bh-4 w-4\b/,
        'Accordion chevron should include "h-4 w-4"'
      );
    }

    const content = accordion.nodes?.content;
    if (
      Array.isArray(content?.padding) &&
      content.padding[0] === 0 &&
      content.padding[1] === 16 &&
      content.padding[2] === 16
    ) {
      assertMatch(
        errors,
        accordionSource,
        /\bpx-4 pb-4 pt-0\b/,
        'AccordionContent should include "px-4 pb-4 pt-0"'
      );
    }

    const contentText = accordion.nodes?.contentText;
    if (contentText?.fontSize === 14) {
      assertMatch(
        errors,
        accordionSource,
        /\btext-sm\b/,
        'AccordionContent should include "text-sm"'
      );
    }
    if (contentText?.fill) {
      assertMatch(
        errors,
        accordionSource,
        /\btext-muted-foreground\b/,
        'AccordionContent should include "text-muted-foreground"'
      );
    }

    if (hasExpanded) {
      assertMatch(
        errors,
        accordionSource,
        /\[\&\[data-state=open\]>svg\]:rotate-180/,
        'Accordion open state should include "[&[data-state=open]>svg]:rotate-180"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: tabs,
    componentKey: "tabs",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = tabs.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, tabsSource, /\brounded-md\b/, 'Tabs should include "rounded-md"');
    }

    const list = tabs.nodes?.list;
    if (Array.isArray(list?.padding) && list.padding[0] === 4 && list.padding[1] === 4) {
      assertMatch(errors, tabsSource, /\bp-1\b/, 'TabsList should include "p-1"');
    }
    if (list?.fill && list.fill !== "transparent") {
      assertMatch(errors, tabsSource, /\bbg-muted\b/, 'TabsList should include "bg-muted"');
    }

    const triggerActive = tabs.nodes?.triggerActive;
    if (triggerActive?.height === 36) {
      assertMatch(errors, tabsSource, /\bh-9\b/, 'TabsTrigger should include "h-9"');
    }
    if (Array.isArray(triggerActive?.padding) && triggerActive.padding[1] === 16) {
      assertMatch(errors, tabsSource, /\bpx-4\b/, 'TabsTrigger should include "px-4"');
    }
    if (Array.isArray(triggerActive?.padding) && triggerActive.padding[0] === 8) {
      assertMatch(errors, tabsSource, /\bpy-2\b/, 'TabsTrigger should include "py-2"');
    }
    if (triggerActive?.cornerRadius === 6) {
      assertMatch(errors, tabsSource, /\brounded-md\b/, 'TabsTrigger should include "rounded-md"');
    }

    const triggerActiveText = tabs.nodes?.triggerActiveText;
    if (triggerActiveText?.fontSize === 14) {
      assertMatch(errors, tabsSource, /\btext-sm\b/, 'TabsTrigger should include "text-sm"');
    }
    if (`${triggerActiveText?.fontWeight}` === "500") {
      assertMatch(
        errors,
        tabsSource,
        /\bfont-medium\b/,
        'TabsTrigger should include "font-medium"'
      );
    }

    const content = tabs.nodes?.content;
    if (
      Array.isArray(content?.padding) &&
      content.padding[0] === 16 &&
      content.padding[1] === 16
    ) {
      assertMatch(errors, tabsSource, /\bp-4\b/, 'TabsContent should include "p-4"');
    }

    assertMatch(
      errors,
      tabsSource,
      /\bdata-\[state=active\]:bg-background\b/,
      'TabsTrigger active state should include "data-[state=active]:bg-background"'
    );
    assertMatch(
      errors,
      tabsSource,
      /\bdata-\[state=active\]:text-foreground\b/,
      'TabsTrigger active state should include "data-[state=active]:text-foreground"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: list,
    componentKey: "list",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      listSource,
      /\bListVariantKey\b/,
      "List should use generated ListVariantKey type"
    );
    assertMatch(
      errors,
      listSource,
      /\blistDefaultVariantKey\b/,
      "List should use generated listDefaultVariantKey"
    );
    assertMatch(
      errors,
      listSource,
      /\blistVariantKeys\b/,
      "List should use generated listVariantKeys"
    );
    assertMatch(
      errors,
      listSource,
      /\bRecord<ListVariantKey,\s*React\.ReactNode>/,
      "List marker icon map should be keyed by ListVariantKey"
    );

    const dotVariant = list.variants.find((variant) => variant?.key === "dot");
    const checkVariant = list.variants.find((variant) => variant?.key === "check");
    const circleVariant = list.variants.find((variant) => variant?.key === "circle");

    if (dotVariant?.gap === 8 || checkVariant?.gap === 8 || circleVariant?.gap === 8) {
      assertMatch(errors, listSource, /\bgap-2\b/, 'ListItem should include "gap-2"');
    }

    const dotIcon = list.nodes?.dotIcon;
    if (dotIcon?.width === 16 && dotIcon?.height === 16) {
      assertMatch(errors, listSource, /\bh-4 w-4\b/, 'List dot icon should include "h-4 w-4"');
    }

    const checkIcon = list.nodes?.checkIcon;
    if (checkIcon?.width === 16 && checkIcon?.height === 16) {
      assertMatch(
        errors,
        listSource,
        /\btext-primary\b/,
        'List check icon should include "text-primary"'
      );
    }

    const circleIcon = list.nodes?.circleIcon;
    if (circleIcon?.width === 12 && circleIcon?.height === 12) {
      assertMatch(
        errors,
        listSource,
        /\bh-3 w-3\b/,
        'List circle icon should include "h-3 w-3"'
      );
    }

    const dotText = list.nodes?.dotText;
    const checkText = list.nodes?.checkText;
    const circleText = list.nodes?.circleText;
    if (dotText?.fill || checkText?.fill || circleText?.fill) {
      assertMatch(
        errors,
        listSource,
        /\btext-muted-foreground\b/,
        'List item text should include "text-muted-foreground"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: breadcrumb,
    componentKey: "breadcrumb",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = breadcrumb.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.gap === 8) {
      assertMatch(
        errors,
        breadcrumbSource,
        /\bgap-2\b/,
        'BreadcrumbList should include "gap-2"'
      );
    }

    const link1 = breadcrumb.nodes?.link1;
    if (link1?.underline) {
      assertMatch(
        errors,
        breadcrumbSource,
        /\bunderline\b/,
        'Breadcrumb links should include "underline"'
      );
    }

    const sep1 = breadcrumb.nodes?.sep1;
    if (sep1?.width === 14 && sep1?.height === 14) {
      assertMatch(
        errors,
        breadcrumbSource,
        /\[\&>svg\]:size-3\.5/,
        'Breadcrumb separator should include "[&>svg]:size-3.5"'
      );
    }

    const page = breadcrumb.nodes?.page;
    if (`${page?.fontWeight}` === "500") {
      assertMatch(
        errors,
        breadcrumbSource,
        /\bfont-medium\b/,
        'Breadcrumb current page should include "font-medium"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: dropdownMenu,
    componentKey: "dropdownMenu",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = dropdownMenu.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\brounded-md\b/,
        'DropdownMenu content should include "rounded-md"'
      );
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\bborder\b/,
        'DropdownMenu content should include "border"'
      );
    }

    const labelText = dropdownMenu.nodes?.labelText;
    if (labelText?.fontSize === 12) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\btext-xs\b/,
        'DropdownMenu label should include "text-xs"'
      );
    }
    if (`${labelText?.fontWeight}` === "600") {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\bfont-semibold\b/,
        'DropdownMenu label should include "font-semibold"'
      );
    }

    const separator = dropdownMenu.nodes?.separator;
    if (separator?.height === 1) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\bh-px\b/,
        'DropdownMenu separator should include "h-px"'
      );
    }
    if (separator?.fill) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\bbg-border\b/,
        'DropdownMenu separator should include "bg-border"'
      );
    }

    const itemText = dropdownMenu.nodes?.itemText;
    if (itemText?.fontSize === 14) {
      assertMatch(
        errors,
        dropdownMenuSource,
        /\btext-sm\b/,
        'DropdownMenu item should include "text-sm"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: popover,
    componentKey: "popover",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = popover.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 288) {
      // Match the .pen style-hint (w-[288px]); w-72 is the same 288px but the
      // component carries the arbitrary form to satisfy style-hints coverage. (#140)
      assertMatch(errors, popoverSource, /(?<![\w-])w-\[288px\]/, 'Popover should include "w-[288px]"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 16) {
      assertMatch(errors, popoverSource, /\bp-4\b/, 'Popover should include "p-4"');
    }
    if (defaultVariant?.cornerRadius === 8) {
      // cornerRadius 8 → rounded-lg (8px). rounded-md is 6px — the old expectation
      // was wrong and forced a redundant `rounded-md rounded-lg` pair. (#140)
      assertMatch(errors, popoverSource, /\brounded-lg\b/, 'Popover should include "rounded-lg"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, popoverSource, /\bborder\b/, 'Popover should include "border"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: command,
    componentKey: "command",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = command.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, commandSource, /\brounded-md\b/, 'Command should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, commandSource, /\bborder\b/, 'Command should include "border"');
    }

    const input = command.nodes?.input;
    if (input?.height === 40) {
      assertMatch(errors, commandSource, /\bh-10\b/, 'CommandInput should include "h-10"');
    }
    if (Array.isArray(input?.padding) && input.padding[1] === 12) {
      assertMatch(errors, commandSource, /\bpx-3\b/, 'CommandInput should include "px-3"');
    }
    if (Array.isArray(input?.padding) && input.padding[0] === 8) {
      assertMatch(errors, commandSource, /\bpy-2\b/, 'CommandInput should include "py-2"');
    }
    if (input?.stroke?.thickness === 1) {
      assertMatch(errors, commandSource, /\bborder-b\b/, 'CommandInput should include "border-b"');
    }

    const groupHeading = command.nodes?.groupHeading;
    if (groupHeading?.fontSize === 12) {
      assertMatch(
        errors,
        commandSource,
        /\[&_\[cmdk-group-heading\]\]:text-xs/,
        'Command group heading should include "text-xs"'
      );
    }
    if (`${groupHeading?.fontWeight}` === "600") {
      assertMatch(
        errors,
        commandSource,
        /\[&_\[cmdk-group-heading\]\]:font-semibold/,
        'Command group heading should include "font-semibold"'
      );
    }

    const item = command.nodes?.item;
    if (item?.fontSize === 14) {
      assertMatch(errors, commandSource, /\btext-sm\b/, 'Command item should include "text-sm"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: calendar,
    componentKey: "calendar",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    const defaultVariant = calendar.variants.find((variant) => variant?.key === "default");
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 16) {
      assertMatch(errors, calendarSource, /\bp-4\b/, 'Calendar should include "p-4"');
    }
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(
        errors,
        calendarSource,
        /\brounded-md\b/,
        'Calendar should include "rounded-md"'
      );
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, calendarSource, /\bborder\b/, 'Calendar should include "border"');
    }

    const month = calendar.nodes?.month;
    if (month?.fontSize === 14) {
      assertMatch(
        errors,
        calendarSource,
        /\bcaption_label:\s*"text-sm/,
        'Calendar caption_label should include "text-sm"'
      );
    }
    if (`${month?.fontWeight}` === "600") {
      assertMatch(
        errors,
        calendarSource,
        /\bcaption_label:\s*"[^"]*font-semibold/,
        'Calendar caption_label should include "font-semibold"'
      );
    }

    assertMatch(
      errors,
      calendarSource,
      /\bhead_cell:\s*"[^"]*text-xs/,
      'Calendar head_cell should include "text-xs"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: table,
    componentKey: "table",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = table.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, tableSource, /\brounded-md\b/, 'Table wrapper should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, tableSource, /\bborder\b/, 'Table wrapper should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, tableSource, /\bbg-card\b/, 'Table wrapper should include "bg-card"');
    }

    const head1 = table.nodes?.head1;
    if (head1?.fontSize === 12) {
      assertMatch(errors, tableSource, /\btext-xs\b/, 'TableHead should include "text-xs"');
    }
    if (`${head1?.fontWeight}` === "600") {
      assertMatch(errors, tableSource, /\bfont-semibold\b/, 'TableHead should include "font-semibold"');
    }

    const header = table.nodes?.header;
    const row = table.nodes?.row;
    if (
      (Array.isArray(header?.padding) && header.padding[1] === 12) ||
      (Array.isArray(row?.padding) && row.padding[1] === 12)
    ) {
      assertMatch(errors, tableSource, /\bpx-3\b/, 'TableHead/TableCell should include "px-3"');
      assertMatch(errors, tableSource, /\bpy-3\b/, 'TableHead/TableCell should include "py-3"');
    }

    const cell1 = table.nodes?.cell1;
    if (cell1?.fontSize === 14) {
      assertMatch(errors, tableSource, /\btext-sm\b/, 'Table should include "text-sm"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: toast,
    componentKey: "toast",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      toastSource,
      /\bToastVariantKey\b/,
      "Toast should use generated ToastVariantKey type"
    );
    assertMatch(
      errors,
      toastSource,
      /\bRecord<ToastVariantKey,\s*React\.ReactNode>/,
      "Toast icons map should be keyed by ToastVariantKey"
    );
    assertMatch(
      errors,
      toastSource,
      /\bRecord<ToastVariantKey,\s*string>/,
      "Toast background map should be keyed by ToastVariantKey"
    );

    const successVariant = toast.variants.find((variant) => variant?.key === "success");
    const errorVariant = toast.variants.find((variant) => variant?.key === "error");
    const infoVariant = toast.variants.find((variant) => variant?.key === "info");

    if (
      successVariant?.cornerRadius === 12 ||
      errorVariant?.cornerRadius === 12 ||
      infoVariant?.cornerRadius === 12
    ) {
      assertMatch(errors, toastSource, /\brounded-xl\b/, 'Toast should include "rounded-xl"');
    }
    if (successVariant?.stroke?.thickness === 1) {
      assertMatch(errors, toastSource, /\bborder\b/, 'Toast should include "border"');
      assertMatch(
        errors,
        toastSource,
        /\bborder-success-border\b/,
        'Toast success should include "border-success-border"'
      );
    }
    if (errorVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        toastSource,
        /\bborder-destructive-border\b/,
        'Toast error should include "border-destructive-border"'
      );
    }
    if (infoVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        toastSource,
        /\bborder-info-border\b/,
        'Toast info should include "border-info-border"'
      );
    }

    const successText = toast.nodes?.successText;
    if (successText?.fontSize === 14) {
      assertMatch(errors, toastSource, /\btext-sm\b/, 'Toast text should include "text-sm"');
    }
    if (`${successText?.fontWeight}` === "500") {
      assertMatch(
        errors,
        toastSource,
        /\bfont-medium\b/,
        'Toast text should include "font-medium"'
      );
    }

    const successIcon = toast.nodes?.successIcon;
    if (successIcon?.width === 20 && successIcon?.height === 20) {
      assertMatch(
        errors,
        toastSource,
        /size=\{20\}/,
        "Toast icons should use size={20}"
      );
    }

    const successClose = toast.nodes?.successClose;
    if (successClose?.width === 14 && successClose?.height === 14) {
      assertMatch(
        errors,
        toastSource,
        /X size=\{14\}/,
        "Toast close icon should use size={14}"
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: modal,
    componentKey: "modal",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = modal.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, modalSource, /\brounded-lg\b/, 'Modal should include "rounded-lg"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, modalSource, /\bborder\b/, 'Modal should include "border"');
      assertMatch(
        errors,
        modalSource,
        /\bborder-border\b/,
        'Modal should include "border-border"'
      );
    }
    if (defaultVariant?.width === 448) {
      assertMatch(errors, modalSource, /\bmax-w-md\b/, 'Modal should include "max-w-md"');
    }

    const header = modal.nodes?.header;
    if (Array.isArray(header?.padding) && header.padding[0] === 12 && header.padding[1] === 16) {
      assertMatch(errors, modalSource, /\bpx-4 py-3\b/, 'Modal header should include "px-4 py-3"');
    }
    if (header?.justifyContent === "space_between") {
      assertMatch(
        errors,
        modalSource,
        /\bjustify-between\b/,
        'Modal header should include "justify-between"'
      );
    }
    if (header?.stroke?.thickness === 1) {
      assertMatch(errors, modalSource, /\bborder-b\b/, 'Modal header should include "border-b"');
    }

    const headerTitle = modal.nodes?.headerTitle;
    if (`${headerTitle?.fontWeight}` === "600") {
      assertMatch(
        errors,
        modalSource,
        /\bfont-semibold\b/,
        'Modal title should include "font-semibold"'
      );
    }

    const content = modal.nodes?.content;
    if (Array.isArray(content?.padding) && content.padding[0] === 16) {
      assertMatch(errors, modalSource, /\bp-4\b/, 'Modal content should include "p-4"');
    }

    const footer = modal.nodes?.footer;
    if (Array.isArray(footer?.padding) && footer.padding[0] === 12 && footer.padding[1] === 16) {
      assertMatch(errors, modalSource, /\bpx-4 py-3\b/, 'Modal footer should include "px-4 py-3"');
    }
    if (footer?.gap === 8) {
      assertMatch(errors, modalSource, /\bgap-2\b/, 'Modal footer should include "gap-2"');
    }
    if (footer?.justifyContent === "flex_end") {
      assertMatch(errors, modalSource, /\bjustify-end\b/, 'Modal footer should include "justify-end"');
    }
    if (footer?.fill) {
      assertMatch(errors, modalSource, /\bbg-muted\/50\b/, 'Modal footer should include "bg-muted/50"');
    }
    if (footer?.stroke?.thickness === 1) {
      assertMatch(errors, modalSource, /\bborder-t\b/, 'Modal footer should include "border-t"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: carousel,
    componentKey: "carousel",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = carousel.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertAnyMatch(
        errors,
        carouselSource,
        [
          /\bclassName=\{cn\("relative", className\)\}/,
          /\bclassName=\{cn\("relative w-\[640px\]", className\)\}/,
        ],
        "Carousel root should include `relative` container classes compatible with style hints"
      );
    }

    const content = carousel.nodes?.content;
    if (content?.gap === 16) {
      assertMatch(
        errors,
        carouselSource,
        /orientation === "horizontal" \? "-ml-4" : "-mt-4 flex-col"/,
        'CarouselContent should include "-ml-4" / "-mt-4 flex-col" offsets'
      );
      assertMatch(
        errors,
        carouselSource,
        /orientation === "horizontal" \? "pl-4" : "pt-4"/,
        'CarouselItem should include "pl-4" / "pt-4" offsets'
      );
    }

    const prevButton = carousel.nodes?.prevButton;
    const nextButton = carousel.nodes?.nextButton;
    if (
      (prevButton?.width === 32 && prevButton?.height === 32) ||
      (nextButton?.width === 32 && nextButton?.height === 32)
    ) {
      assertMatch(
        errors,
        carouselSource,
        /\babsolute h-8 w-8 rounded-full\b/,
        'Carousel nav buttons should include "absolute h-8 w-8 rounded-full"'
      );
      assertMatch(
        errors,
        carouselSource,
        /variant\s*=\s*"outline"/,
        'Carousel nav buttons should default to variant "outline"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: pagination,
    componentKey: "pagination",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = pagination.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.gap === 4) {
      assertMatch(
        errors,
        paginationSource,
        /\bclassName=\{cn\("flex items-center gap-1", className\)\}/,
        'PaginationContent should include "flex items-center gap-1"'
      );
    }

    const previous = pagination.nodes?.previous;
    if (previous?.height === 36) {
      assertMatch(
        errors,
        paginationSource,
        /\bclassName=\{cn\("gap-1 pl-2\.5", className\)\}/,
        'PaginationPrevious should include "gap-1 pl-2.5"'
      );
    }

    const next = pagination.nodes?.next;
    if (next?.height === 36) {
      assertMatch(
        errors,
        paginationSource,
        /\bclassName=\{cn\("gap-1 pr-2\.5", className\)\}/,
        'PaginationNext should include "gap-1 pr-2.5"'
      );
    }

    const ellipsis = pagination.nodes?.ellipsis;
    if (ellipsis?.width === 36 && ellipsis?.height === 36) {
      assertMatch(
        errors,
        paginationSource,
        /\bclassName=\{cn\("flex h-9 w-9 items-center justify-center", className\)\}/,
        'PaginationEllipsis should include "flex h-9 w-9 items-center justify-center"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: notificationCenter,
    componentKey: "notificationCenter",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    const defaultVariant = notificationCenter.variants.find(
      (variant) => variant?.key === "default"
    );
    if (defaultVariant?.width === 320) {
      assertAnyMatch(
        errors,
        notificationCenterSource,
        [/className="w-80 p-0"/, /className="w-\[320px\] w-80 p-0"/, /className="w-\[320px\] p-0"/],
        "NotificationCenter panel should include width classes compatible with style hints"
      );
    }

    const bellIcon = notificationCenter.nodes?.bellIcon;
    if (bellIcon?.width === 20 && bellIcon?.height === 20) {
      assertMatch(
        errors,
        notificationCenterSource,
        /className="h-5 w-5"/,
        'NotificationCenter bell icon should include "h-5 w-5"'
      );
    }

    const unreadDot = notificationCenter.nodes?.unreadDot;
    if (unreadDot?.width === 8 && unreadDot?.height === 8) {
      assertMatch(
        errors,
        notificationCenterSource,
        /\bh-2 w-2 rounded-full bg-destructive\b/,
        'NotificationCenter unread dot should include "h-2 w-2 rounded-full bg-destructive"'
      );
    }

    const header = notificationCenter.nodes?.header;
    if (Array.isArray(header?.padding) && header.padding[0] === 12 && header.padding[1] === 16) {
      assertMatch(
        errors,
        notificationCenterSource,
        /\bclassName="flex items-center justify-between border-b px-4 py-3/,
        'NotificationCenter header should include "border-b px-4 py-3"'
      );
    }

    const listItem = notificationCenter.nodes?.listItem;
    if (Array.isArray(listItem?.padding) && listItem.padding[0] === 16) {
      assertMatch(
        errors,
        notificationCenterSource,
        /\bclassName=\{cn\(\s*"flex flex-col gap-1 border-b p-4 text-sm/,
        'NotificationCenter list item should include "gap-1 border-b p-4 text-sm"'
      );
    }

    const footerButton = notificationCenter.nodes?.footerButton;
    if (footerButton?.height === 32) {
      assertMatch(
        errors,
        notificationCenterSource,
        /className="h-8 w-full text-xs text-muted-foreground hover:text-foreground"/,
        'NotificationCenter footer button should include tokenized class set'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: dialog,
    componentKey: "dialog",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = dialog.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 512) {
      assertMatch(errors, dialogSource, /\bmax-w-lg\b/, 'Dialog should include "max-w-lg"');
    }
    if (defaultVariant?.cornerRadius === 8) {
      assertMatch(errors, dialogSource, /\bsm:rounded-lg\b/, 'Dialog should include "sm:rounded-lg"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 24) {
      assertMatch(errors, dialogSource, /\bp-6\b/, 'Dialog should include "p-6"');
    }
    if (defaultVariant?.gap === 16) {
      assertMatch(errors, dialogSource, /\bgap-4\b/, 'Dialog should include "gap-4"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, dialogSource, /\bborder\b/, 'Dialog should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, dialogSource, /\bbg-background\b/, 'Dialog should include "bg-background"');
    }

    const overlay = dialog.nodes?.overlay;
    if (overlay?.fill) {
      assertMatch(errors, dialogSource, /\bbg-overlay\/80\b/, 'Dialog overlay should include "bg-overlay/80"');
    }

    const header = dialog.nodes?.header;
    if (header?.gap === 6) {
      assertMatch(errors, dialogSource, /\bspace-y-1\.5\b/, 'DialogHeader should include "space-y-1.5"');
    }

    const headerTitle = dialog.nodes?.headerTitle;
    if (headerTitle?.fontSize === 18) {
      assertMatch(errors, dialogSource, /\btext-lg\b/, 'DialogTitle should include "text-lg"');
    }
    if (`${headerTitle?.fontWeight}` === "600") {
      assertMatch(errors, dialogSource, /\bfont-semibold\b/, 'DialogTitle should include "font-semibold"');
    }

    const headerDesc = dialog.nodes?.headerDesc;
    if (headerDesc?.fontSize === 14) {
      assertMatch(errors, dialogSource, /\btext-sm\b/, 'DialogDescription should include "text-sm"');
    }

    const footer = dialog.nodes?.footer;
    if (footer?.justifyContent === "flex_end") {
      assertMatch(errors, dialogSource, /\bsm:justify-end\b/, 'DialogFooter should include "sm:justify-end"');
    }
    if (footer?.gap === 8) {
      assertMatch(errors, dialogSource, /\bsm:space-x-2\b/, 'DialogFooter should include "sm:space-x-2"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: sheet,
    componentKey: "sheet",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const rightVariant = sheet.variants.find((variant) => variant?.key === "right");
    const defaultVariant = rightVariant ?? sheet.variants[0];
    if (defaultVariant?.width === 384) {
      assertMatch(errors, sheetSource, /\bsm:max-w-sm\b/, 'Sheet should include "sm:max-w-sm"');
      assertMatch(errors, sheetSource, /\bw-3\/4\b/, 'Sheet should include "w-3/4"');
    }
    if (`${defaultVariant?.key}` === "right") {
      assertMatch(
        errors,
        sheetSource,
        /defaultVariants:\s*\{\s*side:\s*"right"/,
        'Sheet default side should be "right"'
      );
      assertMatch(
        errors,
        sheetSource,
        /side = "right"/,
        'SheetContent should default to `side = "right"`'
      );
    }

    const overlay = sheet.nodes?.overlay;
    if (overlay?.fill) {
      assertMatch(errors, sheetSource, /\bbg-overlay\/80\b/, 'Sheet overlay should include "bg-overlay/80"');
    }

    const content = sheet.nodes?.content;
    if (Array.isArray(content?.padding) && content.padding[0] === 24) {
      assertMatch(errors, sheetSource, /\bp-6\b/, 'Sheet content should include "p-6"');
    }
    if (content?.gap === 16) {
      assertMatch(errors, sheetSource, /\bgap-4\b/, 'Sheet content should include "gap-4"');
    }
    if (content?.fill && content.fill !== "transparent") {
      assertMatch(errors, sheetSource, /\bbg-background\b/, 'Sheet content should include "bg-background"');
    }
    if (content?.stroke?.thickness === 1) {
      assertMatch(errors, sheetSource, /\bborder-l\b/, 'Sheet right variant should include "border-l"');
    }

    const header = sheet.nodes?.header;
    if (header?.gap === 8) {
      assertMatch(errors, sheetSource, /\bspace-y-2\b/, 'SheetHeader should include "space-y-2"');
    }

    const headerTitle = sheet.nodes?.headerTitle;
    if (headerTitle?.fontSize === 18) {
      assertMatch(errors, sheetSource, /\btext-lg\b/, 'SheetTitle should include "text-lg"');
    }
    if (`${headerTitle?.fontWeight}` === "600") {
      assertMatch(errors, sheetSource, /\bfont-semibold\b/, 'SheetTitle should include "font-semibold"');
    }

    const headerDesc = sheet.nodes?.headerDesc;
    if (headerDesc?.fontSize === 14) {
      assertMatch(errors, sheetSource, /\btext-sm\b/, 'SheetDescription should include "text-sm"');
    }

    const footer = sheet.nodes?.footer;
    if (footer?.justifyContent === "flex_end") {
      assertMatch(errors, sheetSource, /\bsm:justify-end\b/, 'SheetFooter should include "sm:justify-end"');
    }
    if (footer?.gap === 8) {
      assertMatch(errors, sheetSource, /\bsm:space-x-2\b/, 'SheetFooter should include "sm:space-x-2"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: tooltip,
    componentKey: "tooltip",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = tooltip.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 6) {
      assertMatch(errors, tooltipSource, /\brounded-md\b/, 'Tooltip should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, tooltipSource, /\bborder\b/, 'Tooltip should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, tooltipSource, /\bbg-popover\b/, 'Tooltip should include "bg-popover"');
    }
    if (
      Array.isArray(defaultVariant?.padding) &&
      defaultVariant.padding[0] === 6 &&
      defaultVariant.padding[1] === 12
    ) {
      assertMatch(errors, tooltipSource, /\bpx-3 py-1\.5\b/, 'Tooltip should include "px-3 py-1.5"');
    }

    const text = tooltip.nodes?.text;
    if (text?.fontSize === 14) {
      assertMatch(errors, tooltipSource, /\btext-sm\b/, 'Tooltip should include "text-sm"');
    }

    assertMatch(errors, tooltipSource, /\bshadow-md\b/, 'Tooltip should include "shadow-md"');
    assertMatch(errors, tooltipSource, /sideOffset = 4/, "Tooltip should default sideOffset to 4");
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: hoverCard,
    componentKey: "hoverCard",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = hoverCard.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.width === 256) {
      assertMatch(errors, hoverCardSource, /\bw-64\b/, 'HoverCard should include "w-64"');
    }
    if (defaultVariant?.cornerRadius === 6) {
      assertMatch(errors, hoverCardSource, /\brounded-md\b/, 'HoverCard should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, hoverCardSource, /\bborder\b/, 'HoverCard should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, hoverCardSource, /\bbg-popover\b/, 'HoverCard should include "bg-popover"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 16) {
      assertMatch(errors, hoverCardSource, /\bp-4\b/, 'HoverCard should include "p-4"');
    }

    assertMatch(errors, hoverCardSource, /\bshadow-md\b/, 'HoverCard should include "shadow-md"');
    assertMatch(errors, hoverCardSource, /align = "center"/, 'HoverCard should default align to "center"');
    assertMatch(errors, hoverCardSource, /sideOffset = 4/, "HoverCard should default sideOffset to 4");
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: contextMenu,
    componentKey: "contextMenu",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    const defaultVariant = contextMenu.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.cornerRadius === 6) {
      assertMatch(errors, contextMenuSource, /\brounded-md\b/, 'ContextMenu should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, contextMenuSource, /\bborder\b/, 'ContextMenu should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, contextMenuSource, /\bbg-popover\b/, 'ContextMenu should include "bg-popover"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 4) {
      assertMatch(errors, contextMenuSource, /\bp-1\b/, 'ContextMenu should include "p-1"');
    }
    if (defaultVariant?.width === 192) {
      assertMatch(errors, contextMenuSource, /min-w-\[8rem\]/, 'ContextMenu should include "min-w-[8rem]"');
    }

    const labelText = contextMenu.nodes?.labelText;
    if (labelText?.fontSize === 14) {
      assertMatch(errors, contextMenuSource, /\btext-sm\b/, 'ContextMenu label should include "text-sm"');
    }
    if (`${labelText?.fontWeight}` === "600") {
      assertMatch(
        errors,
        contextMenuSource,
        /\bfont-semibold\b/,
        'ContextMenu label should include "font-semibold"'
      );
    }

    const itemText = contextMenu.nodes?.itemText;
    if (itemText?.fontSize === 14) {
      assertMatch(errors, contextMenuSource, /\btext-sm\b/, 'ContextMenu item should include "text-sm"');
    }

    const separator = contextMenu.nodes?.separator;
    if (separator?.height === 1) {
      assertMatch(errors, contextMenuSource, /\bh-px\b/, 'ContextMenu separator should include "h-px"');
    }
    if (separator?.fill) {
      assertMatch(errors, contextMenuSource, /\bbg-border\b/, 'ContextMenu separator should include "bg-border"');
    }

    const subTrigger = contextMenu.nodes?.subTrigger;
    if (subTrigger?.justifyContent === "space_between") {
      assertMatch(
        errors,
        contextMenuSource,
        /\bml-auto h-4 w-4\b/,
        'ContextMenu sub trigger chevron should include "ml-auto h-4 w-4"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: menubar,
    componentKey: "menubar",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    const defaultVariant = menubar.variants.find((variant) => variant?.key === "default");
    if (defaultVariant?.height === 40) {
      assertMatch(errors, menubarSource, /\bh-10\b/, 'Menubar should include "h-10"');
    }
    if (defaultVariant?.gap === 4) {
      assertMatch(errors, menubarSource, /\bspace-x-1\b/, 'Menubar should include "space-x-1"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 4) {
      assertMatch(errors, menubarSource, /\bp-1\b/, 'Menubar should include "p-1"');
    }
    if (defaultVariant?.cornerRadius === 6) {
      assertMatch(errors, menubarSource, /\brounded-md\b/, 'Menubar should include "rounded-md"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(errors, menubarSource, /\bborder\b/, 'Menubar should include "border"');
    }
    if (defaultVariant?.fill && defaultVariant.fill !== "transparent") {
      assertMatch(errors, menubarSource, /\bbg-background\b/, 'Menubar should include "bg-background"');
    }

    const trigger = menubar.nodes?.trigger;
    if (Array.isArray(trigger?.padding) && trigger.padding[1] === 12) {
      assertMatch(errors, menubarSource, /\bpx-3\b/, 'MenubarTrigger should include "px-3"');
    }
    if (Array.isArray(trigger?.padding) && trigger.padding[0] === 6) {
      assertMatch(errors, menubarSource, /\bpy-1\.5\b/, 'MenubarTrigger should include "py-1.5"');
    }
    if (trigger?.cornerRadius === 4) {
      assertMatch(errors, menubarSource, /\brounded-sm\b/, 'MenubarTrigger should include "rounded-sm"');
    }

    const content = menubar.nodes?.content;
    if (content?.width === 192) {
      assertMatch(errors, menubarSource, /min-w-\[12rem\]/, 'MenubarContent should include "min-w-[12rem]"');
    }
    if (Array.isArray(content?.padding) && content.padding[0] === 4) {
      assertMatch(errors, menubarSource, /\bp-1\b/, 'MenubarContent should include "p-1"');
    }
    if (content?.cornerRadius === 6) {
      assertMatch(errors, menubarSource, /\brounded-md\b/, 'MenubarContent should include "rounded-md"');
    }

    const item = menubar.nodes?.item;
    if (item?.fontSize === 14 || item) {
      assertMatch(errors, menubarSource, /\btext-sm\b/, 'MenubarItem should include "text-sm"');
    }

    const separator = menubar.nodes?.separator;
    if (separator?.height === 1) {
      assertMatch(errors, menubarSource, /\bh-px\b/, 'MenubarSeparator should include "h-px"');
    }
    if (separator?.fill) {
      assertMatch(errors, menubarSource, /\bbg-muted\b/, 'MenubarSeparator should include "bg-muted"');
    }

    const subTrigger = menubar.nodes?.subTrigger;
    if (subTrigger?.justifyContent === "space_between") {
      assertMatch(
        errors,
        menubarSource,
        /\bml-auto h-4 w-4\b/,
        'MenubarSubTrigger chevron should include "ml-auto h-4 w-4"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: scrollArea,
    componentKey: "scrollArea",
    specPath: LAYOUT_SPEC_PATH,
    run: () => {
    const defaultVariant = scrollArea.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertMatch(
        errors,
        scrollAreaSource,
        /\brelative overflow-hidden\b/,
        'ScrollArea root should include "relative overflow-hidden"'
      );
    }

    const viewport = scrollArea.nodes?.viewport;
    if (viewport?.cornerRadius === 6) {
      assertMatch(
        errors,
        scrollAreaSource,
        /rounded-\[inherit\]/,
        'ScrollArea viewport should include "rounded-[inherit]"'
      );
    }

    const scrollbar = scrollArea.nodes?.scrollbar;
    if (scrollbar?.width === 10) {
      assertMatch(
        errors,
        scrollAreaSource,
        /\bw-2\.5\b/,
        'Vertical ScrollBar should include "w-2.5"'
      );
      assertMatch(
        errors,
        scrollAreaSource,
        /\bh-full\b/,
        'Vertical ScrollBar should include "h-full"'
      );
    }
    if (Array.isArray(scrollbar?.padding) && scrollbar.padding[0] === 1) {
      assertMatch(
        errors,
        scrollAreaSource,
        /p-\[1px\]/,
        'ScrollBar should include "p-[1px]"'
      );
    }

    const thumb = scrollArea.nodes?.thumb;
    if (thumb?.cornerRadius === 999) {
      assertMatch(
        errors,
        scrollAreaSource,
        /\brounded-full\b/,
        'ScrollBar thumb should include "rounded-full"'
      );
    }
    if (thumb?.fill) {
      assertMatch(errors, scrollAreaSource, /\bbg-border\b/, 'ScrollBar thumb should include "bg-border"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: resizable,
    componentKey: "resizable",
    specPath: LAYOUT_SPEC_PATH,
    run: () => {
    const defaultVariant = resizable.variants.find((variant) => variant?.key === "horizontal");
    if (defaultVariant || resizable.variants.length > 0) {
      assertMatch(
        errors,
        resizableSource,
        /\bflex h-full w-full data-\[panel-group-direction=vertical\]:flex-col\b/,
        'ResizablePanelGroup should include expected layout classes'
      );
    }

    const handle = resizable.nodes?.handle;
    if (handle?.width === 1) {
      assertMatch(errors, resizableSource, /\bw-px\b/, 'ResizableHandle should include "w-px"');
    }
    if (handle?.fill) {
      assertMatch(errors, resizableSource, /\bbg-border\b/, 'ResizableHandle should include "bg-border"');
    }

    const handleGrip = resizable.nodes?.handleGrip;
    if (handleGrip?.width === 12 && handleGrip?.height === 16) {
      assertMatch(
        errors,
        resizableSource,
        /\bh-4 w-3\b/,
        'Resizable handle grip should include "h-4 w-3"'
      );
    }
    if (handleGrip?.cornerRadius === 2) {
      assertMatch(
        errors,
        resizableSource,
        /\brounded-sm\b/,
        'Resizable handle grip should include "rounded-sm"'
      );
    }
    if (handleGrip?.stroke?.thickness === 1) {
      assertMatch(errors, resizableSource, /\bborder\b/, 'Resizable handle grip should include "border"');
    }
    assertMatch(
      errors,
      resizableSource,
      /\bGripVertical className="h-2\.5 w-2\.5"/,
      'Resizable handle icon should include "h-2.5 w-2.5"'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: statusBar,
    componentKey: "statusBar",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    const fixedVariant = statusBar.variants.find((variant) => variant?.key === "fixed");
    const defaultVariant = fixedVariant ?? statusBar.variants[0];
    if (defaultVariant?.justifyContent === "space_between") {
      assertMatch(errors, statusBarSource, /\bjustify-between\b/, 'StatusBar should include "justify-between"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[1] === 16) {
      assertMatch(errors, statusBarSource, /\bpx-4\b/, 'StatusBar should include "px-4"');
    }
    if (Array.isArray(defaultVariant?.padding) && defaultVariant.padding[0] === 4) {
      assertMatch(errors, statusBarSource, /\bpy-1\b/, 'StatusBar should include "py-1"');
    }
    if (defaultVariant?.fill) {
      assertMatch(errors, statusBarSource, /\bbg-primary\b/, 'StatusBar should include "bg-primary"');
    }
    assertMatch(errors, statusBarSource, /\btext-primary-foreground\b/, 'StatusBar should include "text-primary-foreground"');
    assertMatch(errors, statusBarSource, /\btext-xs\b/, 'StatusBar should include "text-xs"');
    assertMatch(errors, statusBarSource, /\bshadow-md\b/, 'StatusBar should include "shadow-md"');
    assertMatch(
      errors,
      statusBarSource,
      /fixed && "fixed bottom-0 left-0 right-0"/,
      'StatusBar should conditionally include fixed positioning classes'
    );

    const left = statusBar.nodes?.left;
    const center = statusBar.nodes?.center;
    const right = statusBar.nodes?.right;
    if (left?.gap === 16 || right?.gap === 16) {
      assertMatch(errors, statusBarSource, /\bgap-4\b/, 'StatusBar side slots should include "gap-4"');
    }
    if (center?.gap === 8) {
      assertMatch(errors, statusBarSource, /\bgap-2\b/, 'StatusBar center slot should include "gap-2"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: sidebarItem,
    componentKey: "sidebarItem",
    specPath: NAVIGATION_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      sidebarItemSource,
      /\bSidebarItemVariantKey\b/,
      "SidebarItem should use generated SidebarItemVariantKey type"
    );
    assertMatch(
      errors,
      sidebarItemSource,
      /\bsidebarItemDefaultVariantKey\b/,
      "SidebarItem should use generated sidebarItemDefaultVariantKey"
    );
    assertMatch(
      errors,
      sidebarItemSource,
      /\bRecord<SidebarItemVariantKey,\s*string>/,
      "SidebarItem variant class map should be keyed by SidebarItemVariantKey"
    );

    const defaultVariant = sidebarItem.variants.find((variant) => variant?.key === "default");
    const activeVariant = sidebarItem.variants.find((variant) => variant?.key === "active");
    if (defaultVariant?.justifyContent === "space_between") {
      assertMatch(errors, sidebarItemSource, /\bjustify-between\b/, 'SidebarItem should include "justify-between"');
    }
    if (defaultVariant?.cornerRadius === 6) {
      assertMatch(errors, sidebarItemSource, /\brounded-md\b/, 'SidebarItem should include "rounded-md"');
    }
    if (defaultVariant?.height === 36) {
      assertMatch(errors, sidebarItemSource, /\bpy-1\.5\b/, 'SidebarItem should include "py-1.5"');
    }
    if (activeVariant?.fill) {
      assertMatch(
        errors,
        sidebarItemSource,
        /\bbg-secondary text-foreground\b/,
        'Active SidebarItem should include "bg-secondary text-foreground"'
      );
    }
    if (sidebarItem.interaction?.cursor === "pointer") {
      assertMatch(errors, sidebarItemSource, /\bcursor-pointer\b/, 'SidebarItem should include "cursor-pointer"');
    }

    const content = sidebarItem.nodes?.content;
    if (content?.gap === 8) {
      assertMatch(errors, sidebarItemSource, /\bgap-2\b/, 'SidebarItem content should include "gap-2"');
    }

    const chevronSlot = sidebarItem.nodes?.chevronSlot;
    if (chevronSlot?.width === 20 && chevronSlot?.height === 20) {
      assertMatch(errors, sidebarItemSource, /\bw-5 h-5\b/, 'SidebarItem chevron slot should include "w-5 h-5"');
    }

    const label = sidebarItem.nodes?.label;
    if (label?.fontSize === 14) {
      assertMatch(errors, sidebarItemSource, /\btext-sm\b/, 'SidebarItem should include "text-sm"');
    }

    const del = sidebarItem.nodes?.delete;
    if (del?.width === 24 && del?.height === 24) {
      assertMatch(errors, sidebarItemSource, /\bw-6 h-6\b/, 'SidebarItem delete affordance should include "w-6 h-6"');
    }

    const count = sidebarItem.nodes?.count;
    if (count?.fontSize === 12) {
      assertMatch(errors, sidebarItemSource, /\btext-xs\b/, 'SidebarItem count should include "text-xs"');
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: chatInput,
    componentKey: "chatInput",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(errors, chatInputSource, /\bgap-2\b/, 'ChatInput toolbar should include "gap-2"');
    assertMatch(errors, chatInputSource, /\bp-3\b/, 'ChatInput root should include "p-3"');
    assertMatch(errors, chatInputSource, /min-h-\[3\.5rem\]/, 'ChatInput textarea should start at two lines with "min-h-[3.5rem]"');
    assertMatch(errors, chatInputSource, /\bbuttonDefaultVariantKey\b/, "ChatInput send button should use generated buttonDefaultVariantKey");
    assertMatch(errors, chatInputSource, /\bTooltipButton\b/, "ChatInput icon actions should use TooltipButton");
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: chatMessage,
    componentKey: "chatMessage",
    specPath: DISPLAY_SPEC_PATH,
    run: () => {
    assertMatch(errors, chatMessageSource, /\bgap-4\b/, 'ChatMessage row should include "gap-4"');
    assertMatch(errors, chatMessageSource, /\bp-4\b/, 'ChatMessage row should include "p-4"');
    assertMatch(errors, chatMessageSource, /\bh-8 w-8\b/, 'ChatMessage avatar should include "h-8 w-8"');
    assertMatch(errors, chatMessageSource, /\brounded-2xl\b/, 'ChatMessage bubble should include "rounded-2xl"');
    assertMatch(errors, chatMessageSource, /\bTooltipButton\b/, "ChatMessage icon actions should use TooltipButton");
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: chatPanel,
    componentKey: "chatPanel",
    specPath: OVERLAY_SPEC_PATH,
    run: () => {
    assertMatch(errors, chatPanelSource, /\bh-\[560px\]/, 'ChatPanel default height should include "h-[560px]"');
    assertMatch(errors, chatPanelSource, /\bmax-w-2xl\b/, 'ChatPanel should include "max-w-2xl"');
    assertMatch(errors, chatPanelSource, /\bChatMessage\b/, "ChatPanel should compose ChatMessage");
    assertMatch(errors, chatPanelSource, /\bChatInput\b/, "ChatPanel should compose ChatInput");
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: filterButton,
    componentKey: "filterButton",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    assertMatch(
      errors,
      filterButtonSource,
      /\bFilterButtonVariantKey\b/,
      "FilterButton should use generated FilterButtonVariantKey type"
    );
    assertMatch(
      errors,
      filterButtonSource,
      /\bfilterButtonDefaultVariantKey\b/,
      "FilterButton should use generated filterButtonDefaultVariantKey"
    );
    assertMatch(
      errors,
      filterButtonSource,
      /\bRecord<FilterButtonVariantKey,\s*string>/,
      "FilterButton trigger class map should be keyed by FilterButtonVariantKey"
    );

    const defaultVariant = filterButton.variants.find((variant) => variant?.key === "default");
    const selectedVariant = filterButton.variants.find((variant) => variant?.key === "selected");
    const popoverVariant = filterButton.variants.find((variant) => variant?.key === "popover");
    if (defaultVariant?.gap === 8) {
      assertMatch(errors, filterButtonSource, /\bgap-2\b/, 'FilterButton trigger should include "gap-2"');
    }
    if (defaultVariant?.stroke?.thickness === 1) {
      assertMatch(
        errors,
        filterButtonSource,
        /\bborder-dashed\b/,
        'FilterButton trigger should include "border-dashed"'
      );
    }

    const icon = filterButton.nodes?.icon;
    if (icon?.width === 16 && icon?.height === 16) {
      assertMatch(errors, filterButtonSource, /\bh-4 w-4\b/, 'FilterButton icon should include "h-4 w-4"');
    }

    if (selectedVariant) {
      assertMatch(
        errors,
        filterButtonSource,
        /selectedValues\.size > 0/,
        "FilterButton should render selected state when selectedValues.size > 0"
      );
      assertMatch(
        errors,
        filterButtonSource,
        /Badge variant="secondary"/,
        'FilterButton selected state should use `Badge variant="secondary"`'
      );
    }

    if (popoverVariant?.width === 200) {
      assertMatch(
        errors,
        filterButtonSource,
        /className="w-\[200px\] p-0"/,
        'FilterButton popover should include `className="w-[200px] p-0"`'
      );
    }

    const checkBox = filterButton.nodes?.checkBox;
    if (checkBox?.width === 16 && checkBox?.height === 16) {
      assertMatch(
        errors,
        filterButtonSource,
        /\bmr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary\b/,
        'FilterButton option check box should include "h-4 w-4 ... border border-primary"'
      );
    }

    const divider = filterButton.nodes?.divider;
    if (divider?.height === 1) {
      assertMatch(
        errors,
        filterButtonSource,
        /\bh-px bg-border mx-1 my-1\b/,
        'FilterButton divider should include "h-px bg-border mx-1 my-1"'
      );
    }
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: sortButton,
    componentKey: "sortButton",
    specPath: INPUTS_SPEC_PATH,
    run: () => {
    const noneVariant = sortButton.variants.find((variant) => variant?.key === "none");
    const ascVariant = sortButton.variants.find((variant) => variant?.key === "asc");
    const descVariant = sortButton.variants.find((variant) => variant?.key === "desc");
    if (noneVariant?.gap === 8 || ascVariant?.gap === 8 || descVariant?.gap === 8) {
      assertMatch(errors, sortButtonSource, /\bgap-2\b/, 'SortButton should include "gap-2"');
    }
    if (
      (noneVariant?.height === 36 && Array.isArray(noneVariant?.padding)) ||
      (ascVariant?.height === 36 && Array.isArray(ascVariant?.padding))
    ) {
      assertMatch(
        errors,
        sortButtonSource,
        /variant = "ghost"/,
        'SortButton should default to variant "ghost"'
      );
      assertMatch(errors, sortButtonSource, /size = "sm"/, 'SortButton should default to size "sm"');
    }

    const icon = sortButton.nodes?.icon;
    if (icon?.width === 16 && icon?.height === 16) {
      assertMatch(errors, sortButtonSource, /\bh-4 w-4\b/, 'SortButton icon should include "h-4 w-4"');
    }
    assertMatch(
      errors,
      sortButtonSource,
      /\bSortButtonVariantKey\b/,
      "SortButton should use generated SortButtonVariantKey type"
    );
    assertMatch(
      errors,
      sortButtonSource,
      /\bsortButtonDefaultVariantKey\b/,
      "SortButton should use generated sortButtonDefaultVariantKey"
    );
    assertMatch(
      errors,
      sortButtonSource,
      /\bsortButtonVariantKeys\b/,
      "SortButton should use generated sortButtonVariantKeys"
    );

    assertAnyMatch(
      errors,
      sortButtonSource,
      [
        /if \(value === "none"\) onSortChange\?\.\("asc"\)/,
        /sortButtonVariantKeys\.indexOf\(value\)/,
      ],
      'SortButton should transition none -> asc'
    );
    assertAnyMatch(
      errors,
      sortButtonSource,
      [
        /else if \(value === "asc"\) onSortChange\?\.\("desc"\)/,
        /onSortChange\?\.\(sortButtonVariantKeys\[nextIndex\]\)/,
      ],
      'SortButton should transition asc -> desc'
    );
    assertAnyMatch(
      errors,
      sortButtonSource,
      [
        /else onSortChange\?\.\("none"\)/,
        /% sortButtonVariantKeys\.length/,
      ],
      'SortButton should transition desc -> none'
    );
    },
  });

  withRequiredVariants({
    errors,
    componentSpec: progressWidget,
    componentKey: "progressWidget",
    specPath: FEEDBACK_SPEC_PATH,
    run: () => {
    const defaultVariant = progressWidget.variants.find((variant) => variant?.key === "default");
    if (defaultVariant) {
      assertAnyMatch(
        errors,
        progressWidgetSource,
        [
          /className=\{cn\("overflow-hidden", className\)\}/,
          /className=\{cn\("[^"]*\boverflow-hidden\b[^"]*", className\)\}/,
        ],
        'ProgressWidget Card should include overflow-hidden class composition'
      );
    }

    const header = progressWidget.nodes?.header;
    if (header?.justifyContent === "space_between") {
      assertMatch(
        errors,
        progressWidgetSource,
        /\bjustify-between\b/,
        'ProgressWidget header should include "justify-between"'
      );
    }

    const headerTitle = progressWidget.nodes?.headerTitle;
    if (headerTitle?.fontSize === 14) {
      assertMatch(
        errors,
        progressWidgetSource,
        /\btext-sm\b/,
        'ProgressWidget title should include "text-sm"'
      );
    }
    if (`${headerTitle?.fontWeight}` === "500") {
      assertMatch(
        errors,
        progressWidgetSource,
        /\bfont-medium\b/,
        'ProgressWidget title should include "font-medium"'
      );
    }

    const value = progressWidget.nodes?.value;
    if (value?.fontSize === 24) {
      assertMatch(errors, progressWidgetSource, /\btext-2xl\b/, 'ProgressWidget value should include "text-2xl"');
    }
    if (`${value?.fontWeight}` === "700") {
      assertMatch(errors, progressWidgetSource, /\bfont-bold\b/, 'ProgressWidget value should include "font-bold"');
    }

    const progress = progressWidget.nodes?.progress;
    if (progress?.height === 8) {
      assertMatch(errors, progressWidgetSource, /\bmt-2 h-2\b/, 'ProgressWidget progress should include "mt-2 h-2"');
    }

    const subtext = progressWidget.nodes?.subtext;
    if (subtext?.fontSize === 12) {
      assertMatch(errors, progressWidgetSource, /\btext-xs\b/, 'ProgressWidget subtext should include "text-xs"');
    }
    if (subtext?.fill) {
      assertMatch(
        errors,
        progressWidgetSource,
        /\btext-muted-foreground\b/,
        'ProgressWidget subtext should include "text-muted-foreground"'
      );
    }
    },
  });

  throwVerificationErrors({
    errors,
    heading: "design:verify: molecule component drift detected",
  });
}

runVerificationCli({
  scriptName: "design-verify-molecule-drift.mjs",
  verify: verifyMoleculeDrift,
  successMessage: "design:verify: molecule component drift check passed",
});
