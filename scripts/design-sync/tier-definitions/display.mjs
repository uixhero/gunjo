function createSyntheticDisplaySpec({ frameId, title, description, variants }) {
  return {
    frameId,
    title,
    description,
    variants,
  };
}

function createSyntheticVariant(key, overrides = {}) {
  return {
    id: `synthetic:${key}`,
    name: key,
    key,
    type: "frame",
    width: "fill_container",
    height: null,
    padding: [0, 0, 0, 0],
    gap: null,
    cornerRadius: null,
    fill: null,
    stroke: null,
    text: null,
    texts: [],
    children: [],
    reusable: true,
    ...overrides,
  };
}

export const DISPLAY_SPEC_DEFINITIONS = [
  // From atoms — atom-style (no nodeIds)
  { key: "badge", frameId: "badgeFrame", titleId: "badgeTitle", descId: "badgeDesc", variantsId: "badgeVariants" },
  {
    key: "icon",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "iconFrame",
      title: "Icon",
      description: "Normalizes icon size, stroke, and accessibility behavior across GunjoUI.",
      variants: [
        createSyntheticVariant("sm", {
          id: "iconSm",
          name: "Icon/Sm",
          type: "icon_font",
          width: 16,
          height: 16,
          fill: "#64748b",
          iconFontFamily: "tabler",
          iconFontName: "sparkles",
        }),
        createSyntheticVariant("xs", {
          id: "iconXs",
          name: "Icon/Xs",
          type: "icon_font",
          width: 12,
          height: 12,
          fill: "#64748b",
          iconFontFamily: "tabler",
          iconFontName: "sparkles",
        }),
        createSyntheticVariant("md", {
          id: "iconMd",
          name: "Icon/Md",
          type: "icon_font",
          width: 20,
          height: 20,
          fill: "#64748b",
          iconFontFamily: "tabler",
          iconFontName: "sparkles",
        }),
        createSyntheticVariant("lg", {
          id: "iconLg",
          name: "Icon/Lg",
          type: "icon_font",
          width: 24,
          height: 24,
          fill: "#64748b",
          iconFontFamily: "tabler",
          iconFontName: "sparkles",
        }),
        createSyntheticVariant("xl", {
          id: "iconXl",
          name: "Icon/Xl",
          type: "icon_font",
          width: 32,
          height: 32,
          fill: "#64748b",
          iconFontFamily: "tabler",
          iconFontName: "sparkles",
        }),
      ],
    }),
  },
  {
    key: "separator",
    frameId: "separatorFrame",
    titleId: "separatorTitle",
    descId: "separatorDesc",
    variantsId: "separatorVariants",
    variantOverrides: {
      horizontal: { width: "fill_container" },
    },
  },
  { key: "avatar", frameId: "avatarFrame", titleId: "avatarTitle", descId: "avatarDesc", variantsId: "avatarVariants" },
  {
    key: "chatMessage",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:chatMessage",
      title: "ChatMessage",
      description: "Single chat transcript row for assistant, user, system, and typing states.",
      variants: [
        createSyntheticVariant("assistant", {
          width: "fill_container",
          padding: [16, 16, 16, 16],
          gap: 16,
        }),
        createSyntheticVariant("user", {
          width: "fill_container",
          padding: [16, 16, 16, 16],
          gap: 16,
        }),
        createSyntheticVariant("system", {
          width: "fill_container",
          padding: [16, 16, 16, 16],
        }),
        createSyntheticVariant("typing", {
          width: "fill_container",
          padding: [16, 16, 16, 16],
          gap: 16,
        }),
      ],
    }),
  },
  { key: "kbd", frameId: "kbdFrame", titleId: "kbdTitle", descId: "kbdDesc", variantsId: "kbdVariants" },
  { key: "img", frameId: "imgFrame", titleId: "imgTitle", descId: "imgDesc", variantsId: "imgVariants" },
  {
    key: "imagePreview",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:imagePreview",
      title: "ImagePreview",
      description: "Framed image preview surface for asset cards, pickers, and media inspection.",
      variants: [
        createSyntheticVariant("default", { fill: "#f8fafc", stroke: "#e2e8f0", cornerRadius: 8 }),
        createSyntheticVariant("contain", { fill: "#f8fafc", stroke: "#e2e8f0", cornerRadius: 8 }),
        createSyntheticVariant("empty", { fill: "#f8fafc", stroke: "#e2e8f0", cornerRadius: 8 }),
      ],
    }),
  },
  { key: "toolPill", frameId: "toolPillFrame", titleId: "toolPillTitle", descId: "toolPillDesc", variantsId: "toolPillVariants" },
  { key: "skeleton", frameId: "Brd0E", titleId: "HTYtc", descId: "X1lPgJ", variantsId: "Brd0E" },
  { key: "code", frameId: "WFElW", titleId: "FllBc", descId: "KZinf", variantsId: "WFElW" },
  { key: "spacer", frameId: "j0v7kp", titleId: "TvrGL", descId: "y6aJJ", variantsId: "j0v7kp" },
  { key: "emptyState", frameId: "d1J0n", titleId: "fXdEL", descId: "rcBAj", variantsId: "d1J0n" },
  { key: "tag", frameId: "QU8JC", titleId: "W28Sdh", descId: "od6PU", variantsId: "QU8JC" },
  { key: "colorSwatch", frameId: "OmjeW", titleId: "mGFvf", descId: "KQYhq", variantsId: "OmjeW" },
  // From molecules — structured (with nodeIds)
  {
    key: "card",
    frameId: "cardFrame",
    titleId: "cardTitle",
    descId: "cardDesc",
    variantsId: "cardVariants",
    nodeIds: {
      default: "cardDefault",
      header: "cardHeader",
      headerTitle: "cardHeaderTitle",
      headerDescription: "cardHeaderDesc",
      content: "cardContent",
      contentPlaceholder: "cardContentPlaceholder",
      footer: "cardFooter",
      footerCancel: "cardFooterCancel",
      footerCancelText: "cardFooterCancelText",
      footerDeploy: "cardFooterDeploy",
      footerDeployText: "cardFooterDeployText",
    },
  },
  {
    key: "accordion",
    frameId: "accordionFrame",
    titleId: "accordionTitle",
    descId: "accordionDesc",
    variantsId: "accordionVariants",
    nodeIds: {
      collapsed: "pl9Eu",
      expanded: "y8E7V",
      triggerCollapsed: "LQCc9",
      triggerExpanded: "RSuXb",
      triggerTextCollapsed: "ULK0n",
      triggerTextExpanded: "UPOUx",
      chevronCollapsed: "MqjWB",
      chevronExpanded: "fYPmD",
      content: "Yeqos",
      contentText: "i8vEM",
    },
  },
  {
    key: "accordionGroup",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:accordionGroup",
      title: "AccordionGroup",
      description: "Labeled accordion composition with a single expand-all/collapse-all toggle control for FAQ, settings, and grouped disclosure lists.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("withDescription"),
        createSyntheticVariant("withoutControls"),
      ],
    }),
  },
  {
    key: "searchableAccordion",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:searchableAccordion",
      title: "SearchableAccordion",
      description: "Searchable and category-filterable accordion composition for FAQ, help, and docs lists.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("withCategories"),
        createSyntheticVariant("empty"),
      ],
    }),
  },
  {
    key: "list",
    frameId: "listFrame",
    titleId: "listTitle",
    descId: "listDesc",
    variantsId: "listVariants",
    nodeIds: {
      dot: "listItemDot",
      dotIcon: "listDotIcon",
      dotText: "listDotText",
      check: "listItemCheck",
      checkIcon: "listCheckIcon",
      checkText: "listCheckText",
      circle: "listItemCircle",
      circleIcon: "listCircleIcon",
      circleText: "listCircleText",
    },
  },
  {
    key: "table",
    frameId: "tableFrame",
    titleId: "tableTitle",
    descId: "tableDesc",
    variantsId: "tableVariants",
    nodeIds: {
      default: "tableDefault",
      header: "tableHeader",
      head1: "tableHead1",
      head2: "tableHead2",
      head3: "tableHead3",
      row: "tableRow",
      cell1: "tableCell1",
      cell2: "tableCell2",
      cell3: "tableCell3",
    },
  },
  {
    key: "carousel",
    frameId: "carouselFrame",
    titleId: "carouselTitle",
    descId: "carouselDesc",
    variantsId: "carouselVariants",
    nodeIds: {
      default: "carouselDefault",
      content: "carouselContent",
      item: "carouselItem",
      prevButton: "carouselPrevButton",
      nextButton: "carouselNextButton",
    },
  },
  { key: "dataTable", frameId: "Cqduj", titleId: "ftwOf", descId: "fIfRZ", variantsId: "Cqduj", nodeIds: {} },
  {
    key: "actionDataTable",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:actionDataTable",
      title: "ActionDataTable",
      description: "Selectable data table composition with bulk actions, row actions, and disabled-action feedback.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("selection"),
        createSyntheticVariant("rowActions"),
      ],
    }),
  },
  { key: "avatarGroup", frameId: "YwLZD", titleId: "O27yz", descId: "Z993z", variantsId: "YwLZD", nodeIds: {} },
  { key: "codeBlock", frameId: "iJ9W7", titleId: "L4tTqc", descId: "OFLSz", variantsId: "iJ9W7", nodeIds: {} },
  { key: "timeline", frameId: "Y8NVeW", titleId: "Z30c6G", descId: "j9Igb", variantsId: "Y8NVeW", nodeIds: {} },
  { key: "treeView", frameId: "ixfpr", titleId: "no2lI", descId: "oXT9J", variantsId: "ixfpr", nodeIds: {} },
  {
    key: "fileTree",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:fileTree",
      title: "FileTree",
      description: "File and folder tree composition with metadata, row actions, and single or multiple selection.",
      variants: [
        createSyntheticVariant("single"),
        createSyntheticVariant("multiple"),
        createSyntheticVariant("actions"),
      ],
    }),
  },
  {
    key: "docNote",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:docNote",
      title: "DocNote",
      description: "Supplemental note block for explanatory copy, references, and non-urgent documentation callouts.",
      variants: [
        createSyntheticVariant("default", {
          id: "synthetic:docNoteDefault",
          name: "DocNote/Default",
          padding: [12, 16, 12, 16],
          gap: 4,
          cornerRadius: 6,
          fill: "#f1f5f9",
        }),
        createSyntheticVariant("reference", {
          id: "synthetic:docNoteReference",
          name: "DocNote/Reference",
          padding: [12, 16, 12, 16],
          gap: 4,
          cornerRadius: 6,
          fill: "#f8fafc",
        }),
        createSyntheticVariant("note", {
          id: "synthetic:docNoteNote",
          name: "DocNote/Note",
          padding: [12, 16, 12, 16],
          gap: 4,
          cornerRadius: 6,
          fill: "#eff6ff",
          stroke: { align: "inside", fill: "#bfdbfe", thickness: 1 },
        }),
        createSyntheticVariant("warning", {
          id: "synthetic:docNoteWarning",
          name: "DocNote/Warning",
          padding: [12, 16, 12, 16],
          gap: 4,
          cornerRadius: 6,
          fill: "#fef3c7",
          stroke: { align: "inside", fill: "#fcd34d", thickness: 1 },
        }),
        createSyntheticVariant("tip", {
          id: "synthetic:docNoteTip",
          name: "DocNote/Tip",
          padding: [12, 16, 12, 16],
          gap: 4,
          cornerRadius: 6,
          fill: "#f0fdf4",
          stroke: { align: "inside", fill: "#bbf7d0", thickness: 1 },
        }),
      ],
    }),
  },
  { key: "markdownRenderer", frameId: "H0mVj", titleId: "cddqd", descId: "M9lOYV", variantsId: "H0mVj", nodeIds: {} },
  { key: "statistic", frameId: "b3kNf", titleId: "u4g2nY", descId: "BODnd", variantsId: "b3kNf", nodeIds: {} },
  {
    key: "assetCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:assetCard",
      title: "AssetCard",
      description: "Selectable media asset card for image libraries, files, and generated creative results with favorite, score, and preview affordances.",
      variants: [
        createSyntheticVariant("default", { cornerRadius: 8 }),
        createSyntheticVariant("compact", { cornerRadius: 6 }),
      ],
    }),
  },
  {
    key: "assetGrid",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:assetGrid",
      title: "AssetGrid",
      description: "Responsive grouped media grid that renders AssetCard items with empty state, selection state, and preview hooks.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "metadataList",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:metadataList",
      title: "MetadataList",
      description: "Definition-list style metadata rows for inspectors, file details, and compact property summaries.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "tagEditor",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:tagEditor",
      title: "TagEditor",
      description: "Tag editing control composed from TagInput and suggestion actions for asset inspectors and filter panels.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "chartLegend",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:chartLegend",
      title: "ChartLegend",
      description: "Legend rows for chart series, values, and token-driven markers.",
      variants: [
        createSyntheticVariant("horizontal", { gap: 8 }),
        createSyntheticVariant("vertical", { gap: 8 }),
      ],
    }),
  },
  {
    key: "sparklineChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:sparklineChart",
      title: "SparklineChart",
      description: "Compact HTML/CSS line, area, or stepped trend chart for dense dashboard cards with hover/focus point tooltips.",
      variants: [
        createSyntheticVariant("line", { height: 96 }),
        createSyntheticVariant("area", { height: 96 }),
        createSyntheticVariant("step", { height: 96 }),
      ],
    }),
  },
  {
    key: "lineChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:lineChart",
      title: "LineChart",
      description: "HTML/CSS multi-series line or area chart for time-series comparison with reference lines, legends, and hover/focus point tooltips.",
      variants: [
        createSyntheticVariant("line", { height: 260 }),
        createSyntheticVariant("area", { height: 260 }),
      ],
    }),
  },
  {
    key: "ribbonChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:ribbonChart",
      title: "RibbonChart",
      description: "HTML/CSS ribbon chart for comparing changing flow, volume, or segment width across periods with hover/focus point tooltips.",
      variants: [
        createSyntheticVariant("flow", { height: 260 }),
        createSyntheticVariant("stacked", { height: 260 }),
      ],
    }),
  },
  {
    key: "radialBarChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:radialBarChart",
      title: "RadialBarChart",
      description: "HTML/CSS concentric radial bar chart for comparing progress, share, or capacity across multiple series with hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default", { height: 224, cornerRadius: 9999 }),
        createSyntheticVariant("compact", { height: 176, cornerRadius: 9999 }),
      ],
    }),
  },
  {
    key: "barChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:barChart",
      title: "BarChart",
      description: "Token-driven vertical or horizontal bar chart with optional average marker and hover/focus value tooltips.",
      variants: [
        createSyntheticVariant("vertical", { height: 192 }),
        createSyntheticVariant("horizontal", { height: 192 }),
      ],
    }),
  },
  {
    key: "paretoChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:paretoChart",
      title: "ParetoChart",
      description: "Pareto chart: descending value bars (HTML/CSS, left value axis) overlaid with a cumulative-% line (SVG) on a right 0–100% axis and a 'vital few' threshold line (80% by default), with focusable points and an accessible per-category summary. For defect / downtime / cause analysis and any 'which few drive most of the total' breakdown.",
      variants: [
        createSyntheticVariant("default", { height: 220 }),
      ],
    }),
  },
  {
    key: "concentricProgressCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:concentricProgressCard",
      title: "Concentric Progress Card",
      description: "HTML/CSS card for storage, quota, and multi-ring progress widgets with selectable concentric rings, metrics, and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "stackedBarChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:stackedBarChart",
      title: "StackedBarChart",
      description: "HTML/CSS stacked vertical or horizontal bar chart for grouped segment comparisons with hover/focus segment tooltips.",
      variants: [
        createSyntheticVariant("vertical", { height: 224 }),
        createSyntheticVariant("horizontal", { height: 224 }),
      ],
    }),
  },
  {
    key: "distributionBar",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:distributionBar",
      title: "DistributionBar",
      description: "Stacked percentage distribution bar for segments, channels, and allocation data with hover/focus segment tooltips.",
      variants: [
        createSyntheticVariant("default", { height: 36, cornerRadius: 9999 }),
      ],
    }),
  },
  {
    key: "miniDistributionBarCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:miniDistributionBarCard",
      title: "Mini Distribution Bar Card",
      description: "HTML/CSS compact distribution card for product categories, capacity, and utilization widgets with dense ticks, selected segment details, and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "segmentTimelineCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:segmentTimelineCard",
      title: "Segment Timeline Card",
      description: "HTML/CSS horizontal segment timeline card for sleep stages, uptime states, and categorical duration ranges with metrics, markers, and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "donutChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:donutChart",
      title: "DonutChart",
      description: "HTML/CSS donut chart for proportional segments with optional center labels and pointer-aware segment tooltips.",
      variants: [
        createSyntheticVariant("default", { cornerRadius: 9999 }),
        createSyntheticVariant("compact", { cornerRadius: 9999 }),
      ],
    }),
  },
  {
    key: "pieChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:pieChart",
      title: "PieChart",
      description: "HTML/CSS pie chart for proportional segment comparisons with pointer-aware segment tooltips.",
      variants: [
        createSyntheticVariant("default", { cornerRadius: 9999 }),
        createSyntheticVariant("compact", { cornerRadius: 9999 }),
      ],
    }),
  },
  {
    key: "gaugeChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:gaugeChart",
      title: "GaugeChart",
      description: "HTML/CSS semi-circle gauge for scores, progress, and capacity readings with hover/focus value tooltip.",
      variants: [
        createSyntheticVariant("default", { height: 144 }),
        createSyntheticVariant("compact", { height: 112 }),
      ],
    }),
  },
  {
    key: "segmentedGaugeCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:segmentedGaugeCard",
      title: "Segmented Gauge Card",
      description: "HTML/CSS segmented semicircle gauge card for status, spend, risk, and progress dashboards with editable segments, target value, and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "radarChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:radarChart",
      title: "RadarChart",
      description: "HTML/CSS radar chart for comparing single or multi-series multi-axis scores with hover/focus point tooltips.",
      variants: [
        createSyntheticVariant("default", { height: 256 }),
        createSyntheticVariant("compact", { height: 208 }),
      ],
    }),
  },
  {
    key: "heatmapChart",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:heatmapChart",
      title: "HeatmapChart",
      description: "HTML/CSS density heatmap for day, time, and cohort intensity patterns with hover/focus cell tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "activityTimelineCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:activityTimelineCard",
      title: "Activity Timeline Card",
      description: "HTML/CSS timeline card for activity, sleep, and operations dashboards with editable slots, segments, metrics, and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "labeledDonutCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:labeledDonutCard",
      title: "Labeled Donut Card",
      description: "HTML/CSS donut chart card for segment comparison with central summary, external callout rows, and hover/focus segment tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "retentionCohortCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:retentionCohortCard",
      title: "Retention Cohort Card",
      description: "HTML/CSS cohort retention card for dashboard grids with editable cohorts, periods, values, and hover/focus cell tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "choroplethMap",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:choroplethMap",
      title: "ChoroplethMap",
      description: "HTML/CSS region density map for GeoJSON-style boundaries, markers, and ranked locations with hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "quadrantMatrix",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:quadrantMatrix",
      title: "QuadrantMatrix",
      description: "HTML/CSS four-quadrant matrix for plotting selectable items by x/y position with ranked values and hover/focus tooltips.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "analyticsCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:analyticsCard",
      title: "AnalyticsCard",
      description: "Composable metric card shell for chart previews, deltas, and supporting context.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("positive"),
        createSyntheticVariant("riskIncrease"),
        createSyntheticVariant("flatWithFooter"),
      ],
    }),
  },
  // Codex authored real .pen frames for these on feat/{rating-component,
  // swatch-group,gallery-component} (commits 13252f1/5f2d7b6/95b006f), but the
  // three branches each edited display.pen independently from the same base and
  // mutually conflict, so they can't be git-combined into one .pen. Shipped as
  // synthetic specs (the established pattern for most display components — see
  // the charts/DocNote/AnalyticsCard above); the .pen frames can be merged in
  // later via Pencil as a non-blocking SSOT upgrade. (#168/#172/#173)
  {
    key: "rating",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:rating",
      title: "Rating",
      description: "Read-only star rating display with half-star support, optional numeric value and review count, for product, review, and feedback summaries.",
      variants: [
        // Inline (hug) component — no fill/padding hints.
        createSyntheticVariant("default", { width: null, padding: null }),
        createSyntheticVariant("sm", { width: null, padding: null }),
        createSyntheticVariant("lg", { width: null, padding: null }),
      ],
    }),
  },
  {
    key: "swatchGroup",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:swatchGroup",
      title: "SwatchGroup",
      description: "Selectable color swatch group (single-select) with roving keyboard focus and disabled out-of-stock swatches, for product variant and theme pickers.",
      variants: [
        // Inline (hug) group — the rounding lives on the individual swatches.
        createSyntheticVariant("default", { width: null, padding: null }),
        createSyntheticVariant("sm", { width: null, padding: null }),
        createSyntheticVariant("lg", { width: null, padding: null }),
      ],
    }),
  },
  {
    key: "gallery",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:gallery",
      title: "Gallery",
      description: "Main image plus a selectable thumbnail strip with click and keyboard swap, for product detail and media galleries.",
      variants: [
        // Block (fill) layout, no padding.
        createSyntheticVariant("bottom", { padding: null }),
        createSyntheticVariant("start", { padding: null }),
      ],
    }),
  },
  {
    key: "editableDataTable",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:editableDataTable",
      title: "EditableDataTable",
      description: "Editable line-item grid: rows of consumer-rendered editor cells with add/remove row, a totals/footer row, per-cell accessible labels, and a desktop table that stacks into mobile cards. For invoices, journals, estimates, and timesheets.",
      variants: [
        // Block (fill) container, no root padding (cells carry their own).
        createSyntheticVariant("default", { padding: null }),
        createSyntheticVariant("compact", { padding: null }),
      ],
    }),
  },
  {
    key: "approvalSteps",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:approvalSteps",
      title: "ApprovalSteps",
      description: "Approval-route timeline: each step's state (pending / current / approved / rejected / skipped) maps to a tone, icon, and accessible label, with actor, timestamp, and comment. For expense, ringi, and review approval workflows. Built on Timeline.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
        createSyntheticVariant("compact", { padding: null }),
      ],
    }),
  },
  {
    key: "revealSection",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:revealSection",
      title: "RevealSection",
      description: "State-driven conditional section: show or hide a fieldset on `open` and reveal it as a properly-labelled, screen-reader-announced region. For declaration forms where sections appear based on prior answers (配偶者控除, conditional panels).",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "delta",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:delta",
      title: "Delta",
      description: "Inline signed-change atom: a value with a directional arrow, a sign-driven tone, and a screen-reader (or visible) label — for gain/loss, variance (差異), and cash over/short (過不足). Fits inside a table cell, unlike the card-shaped Statistic.",
      variants: [
        createSyntheticVariant("default", { width: null, padding: null }),
      ],
    }),
  },
  {
    key: "meter",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:meter",
      title: "Meter",
      description: "Capacity / utilisation meter (role=meter): a value-against-max bar whose tone is derived from thresholds (near-full → warning, over → destructive), with an optional incoming overlay to preview 'after this change' and a compact inline size for table cells. For warehouse fill, truck load, storage usage and quota — or set direction='higher-is-better' with a target marker for occupancy / utilisation / SLA / yield goals, or direction='fill-is-good' (no target) for coverage / fulfillment. Pass formatValue to format the visible readout (e.g. grouped JPY).",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "lineageGraph",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:lineageGraph",
      title: "LineageGraph",
      description: "Lineage / dependency graph: a layered, directed-acyclic node-link graph that handles multi-parent and multi-child edges (the fan-in / fan-out a tree can't draw). Nodes are auto-assigned to layers by longest-path depth and laid out along a flow axis (horizontal or vertical); edges are drawn as SVG connectors with arrowheads. Nodes are focusable buttons whose accessible name names their upstream/downstream neighbours. For lot genealogy / traceability (recall blast-radius), data lineage, build/dependency graphs, ETL pipelines and approval routing with joins.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "gantt",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:gantt",
      title: "Gantt",
      description: "Gantt / resource timeline: resource rows × a horizontal time axis with bars positioned by start/end and lane-packed within a row so overlapping bars stack instead of covering each other. A bar can carry internal segments[] (sub-spans tinted per segment — an aircraft rotation 便→折返し→便→整備, a crew duty 出区→乗務→入区, a shop visit 入場→検修→出場), with gaps showing as the bar's track. Day-column gridlines + date headers, a sticky row-label gutter, an optional today line, and a contained horizontal scroll. Owns the time math (pass startDate/endDate + rows + items); today is injectable (SSR-safe). Bars are focusable buttons with a composed accessible name. For project schedules, production lines, room/equipment timelines, crew/aircraft rotations, delivery/route plans and any rows-over-time view.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "weekView",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:weekView",
      title: "WeekView",
      description: "Week-view time-grid calendar: day columns × an hour axis with events positioned by start/end time and overlap-packed into side-by-side columns, plus a time gutter, weekday/date headers and an optional today highlight. Owns the week math (pass weekOf + events); today is injectable (SSR-safe). Events are focusable buttons with a composed accessible name. For appointments, bookings, shift schedules, week schedulers and any time-of-day calendar.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "personCell",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:personCell",
      title: "PersonCell",
      description: "The atomic identity cell: an avatar paired with a name plus secondary/tertiary lines (role / department / email), an optional presence dot and a trailing slot (status badge, chevron, count, actions). Fallback initials are derived from the name (Japanese family-name aware) when no image is given; sm/md/lg sizes; everything truncates so it fits a table cell. The 'who is this person' unit repeated across directories, table rows, assignee pickers, comment attributions, approver/reviewer rows and detail panels. Presentational by default — let an interactive row (DataTable onRowClick, a wrapping link) own activation rather than nesting a button.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "statGroup",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:statGroup",
      title: "StatGroup",
      description: "The summary metric strip: a responsive grid of Statistics (Card-wrapped by default) — the KPI row almost every back-office screen opens with (件数 / 金額 / 期限 / アラート …). Fixed or responsive column counts ({ base: 2, md: 4 }). Presentational and RSC-safe (no function props) — pass plain data. For one metric use Statistic; for the row, use this.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "amountBreakdown",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:amountBreakdown",
      title: "AmountBreakdown",
      description: "The read-only money-derivation ledger: labeled line items, signed deductions, optional per-section subtotals, and an emphasized derived total, with an optional formula caption. The 'labeled lines → ± adjustments → total' block every 請求 / 見積 / 査定 / 支払 / 精算 / 控除 / 給与明細 screen needs (認定損害額 − 過失相殺 − 免責 − 既払金 = 今回支払額 / 基本保険料 ＋ 特約 − 各割引 = 年間保険料). Deductions render as a −|amount| glyph (sign never colour-only) with an sr-only 控除 label. Read-only by design — for an editable line-item grid with column totals use EditableDataTable; for a single signed delta use Statistic/Delta; for the back-office KPI strip use StatGroup. RSC-safe by default (formatValue defaults to formatCurrency); pass a custom formatValue only from a client boundary.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "actionQueue",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:actionQueue",
      title: "ActionQueue",
      description: "The severity-sorted 'action-needed' worklist: the triage surface every back-office / dispatch / ops / CRM home screen opens with (失効防止 / 更新 / 満期 / 誕生日, ダイヤ乱れ・遅延・運休, アラート対応). Each row carries a severity (critical/warning/info/neutral → icon + tone, never colour alone, with an sr-only severity label), a category chip (kind), a headline + detail, trailing meta (due / time / count) and optional action buttons; rows sort critical → neutral. The other half of the morning dashboard alongside StatGroup (the KPI strip). For a single notice use Alert; for an ambient bell tray use NotificationCenter; this is the inline, act-now list. Presentational by default — onSelect makes a row's body activatable.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "seatMap",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:seatMap",
      title: "SeatMap",
      description: "The 2-D selectable seat grid: rows × columns with aisle gaps (columns array with nulls for the aisle — 3-3 / 2-4-2 / 2-2 cabins), per-seat state (空席 / 予約済 / 確保中 / 選択中) and type (非常口 / 足元ゆったり / プレミアム / 窓側 / 通路側), controlled multi-select with a capacity cap (maxSelectable), and grid a11y: role=grid, arrow-key roving focus, aria-selected / aria-disabled, composed seat names (『12番A席、窓側、非常口座席、空席、¥1,500』). The seat/spot picker every booking flow needs — airline / 新幹線 seats, cinema, stadium, event hall, restaurant tables. State never rides on colour alone (selected shows a check, occupied an ×, plus an sr-only label). Owns its horizontal scroll so a wide cabin doesn't push the page on a phone. Controlled — pass selectedIds + onToggle. For a read-only intensity grid use HeatmapChart; this is the interactive picker.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "expiryBadge",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:expiryBadge",
      title: "ExpiryBadge",
      description: "The date-vs-deadline currency indicator: classifies an expiry date against today into 有効 / 期限間近 / 失効 / 未登録 and shows a colour-safe state chip (icon + label, never colour alone), the date, and a 残N日 / N日超過 readout. The date-domain sibling of Meter (value vs a capacity) and ReferenceValue (value vs a numeric range) — this is value vs a DEADLINE. For licence / 資格 / 適性診断 / 健診 / 車検 / 保険 / 認証 / 点検 currency across crew, asset and compliance consoles. Pairs with the pure classifyExpiry() helper (value → {state, days}), mirroring how ReferenceValue pairs with flagValue(). RSC-safe; pass today in for SSR determinism (defaults to new Date()).",
      variants: [
        createSyntheticVariant("default", { width: null, padding: null }),
      ],
    }),
  },
  {
    key: "statusBoard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:statusBoard",
      title: "StatusBoard",
      description: "The live entity status board at the center of every dispatch / monitoring floor: many labeled entities (vehicles / machines / spots), each carrying a status (空車 / 故障 / 稼働中), a location, and a note, laid out as a responsive tile grid. Problems and availability stand out via a tone-accent rail + a colour-safe status pill (icon + text, never colour alone); tiles sort fault-first by default; tiles group by zone/area with a per-group problem count. items[] (flat) or groups[] of {id,label,status,tone,location?,note?,icon?,trailing?,rank?,onSelect?}. The board a Gantt / DataTable / HeatmapChart can't be — taxi 配車盤, 駅務の機器状態盤, ramp GSE board, factory line OEE. (Gantt = rows × time, DataTable = sortable grid of rows, HeatmapChart = read-only value-by-colour matrix; this is a spatial/grouped board of selectable status entities where problems pop.) RSC-safe except the opt-in onSelect.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "stringline",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:stringline",
      title: "Stringline",
      description: "The time × distance run diagram (運行図表 / ダイヤグラム / Marey / string-line chart): the route's stops on the distance (y) axis, time on the x axis, each run a DIAGONAL polyline across the stops over time. Slope = speed, a horizontal kink = a dwell, two lines converging = a meet / overtake / bunching (続行・だんご). Bidirectional runs (up/down), an optional now-line, planned-vs-actual pairs (planned dashed + actual solid), and focusable runs (onSelect). The transport-ops view a Gantt structurally cannot draw — Gantt is resource rows × horizontal bars (y = identity); this transposes the same time engine onto a continuous distance axis (y = distance) so runs can cross. For rail/bus/tram/ferry dispatch & timetable diagrams. SSR-safe: pass now in rather than reading the clock. SVG line geometry like LineChart.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "ticketStub",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:ticketStub",
      title: "TicketStub",
      description: "The scannable pass / ticket / coupon / member-card stub: a card with a barcode or QR (real value in the SR name via role=img), a human-readable code label, an optional perforation notch (the cut-out look that reads as a ticket), and a content slot above for the domain detail (flight OD-pair + seat/gate, coupon discount + 期限, member tier + points). The thing the traveller holds up at the gate / register — the consumer mirror of ScanInput/ScanGate (which capture a code; this displays one). value + format (code128 / qr). RSC-safe; the built-in code render is a deterministic (SSR-safe) visual placeholder — pass the code prop for a production-scannable barcode from a lib.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "itinerary",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:itinerary",
      title: "Itinerary",
      description: "The day-grouped, mixed-kind trip/journey timeline: a vertical sequence of items (flight / hotel / activity / transit leg …), each with a per-kind icon+tone marker, a time, a title + secondary, an optional rich content slot, and an opt-in tappable row (≥44px + chevron). Group by day (days[] with day headers + place sublabels) or pass flat items[]. The traveller-facing trip-plan / 乗換経路 / journey view — richer than Timeline (per-item kind + content + tap) and the right call over RouteStops, whose status/予実 (未配/配送中/遅れ) vocabulary is delivery-locked and wrong for a forward plan. RSC-safe except the opt-in onSelect.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "pageHeader",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:pageHeader",
      title: "PageHeader",
      description: "The mobile app bar / page header every consumer phone screen opens with: a leading back button, a title (+ optional subtitle), and a trailing action slot, sticky to the top with a header landmark, a bottom border and safe-area-inset padding (notch). Touch targets are ≥44px; title align left (default) or center (iOS-style). The kit's Header / AppRail are desktop app/docs chrome — this is the lightweight per-page bar for a phone (booking flows, finders, trackers, detail pages). Pass onBack for the ≥44px back button, or override the leading slot; actions holds close/refresh/menu buttons.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "filterChips",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:filterChips",
      title: "FilterChips",
      description: "The horizontally-scrollable, single-select category chip bar: the navigation every consumer place / list finder opens with (空港・駅の施設, 食べログ, retail, transit, food delivery). A scroll-snapping row of pill chips (icon + label + optional count) that does NOT center-wrap on a phone, with a fully-filled active chip, roving tabindex + arrow keys, and a hidden scrollbar. value + onValueChange single-select. For 2–3 equal-width segments use ToggleGroup; for a faceted popover filter use FilterButton; this is the many-category scannable rail.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "radioCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:radioCard",
      title: "RadioCard",
      description: "The priced selectable choice card: RadioGroup's single-select role=radio + keyboard semantics (radiogroup, roving tabindex, arrow keys) wearing a card body — tags, title, secondary (area・period), a dominant price slot, an おトク/highlight hook, leading accessory — with a built-in selected check + ring. The B2C purchase / plan-picker / shipping-option / payment-method atom. Use this for pick-one-of-many (NOT ListCard, whose onSelect is an aria-pressed toggle, not radio single-select; NOT RadioGroup, which is a bare 16px dot + label). ≥44px tap target; selection marked by a check, not colour alone. RadioCardGroup (value/onValueChange/name) wraps the RadioCards.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "loyaltySummaryCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:loyaltySummaryCard",
      title: "LoyaltySummaryCard",
      description: "The points/balance/tier hero every consumer loyalty screen opens with: a prominent balance, a tier/rank badge, optional secondary values (IC残高/当年実績), a higher-is-better progress-to-next-tier with a remaining label (『プラチナまであと ¥13,800』 — never auto-reds like a capacity Meter), an expiry-warning slot and a primary action. The brand tone is a filled gradient surface so the hero has shine without reaching for arbitrary brand-token classes. For airline マイル, 鉄道 IC/ポイント, retail/EC rewards, membership tiers. For the back-office KPI strip use StatGroup; for a money breakdown use AmountBreakdown; for the points/coupon/history list under the hero use ListCard. Presentational (the action slot owns interactivity) — RSC-safe.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "listCard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:listCard",
      title: "ListCard",
      description: "The tappable list entry: one item in a scannable, mobile-dense list — a leading accessory (icon / avatar / colour dot / rank / line chip), a title + secondary, optional tag chips, a right-aligned status pill and meta (price / time / count / timestamp), and a trailing chevron. The result-card / status-row primitive every consumer 'list of things' screen opens with — search results, route / product / listing comparisons, status lists (運行状況・在庫・端末), order/incident queues. Tappable rows (onSelect) are a real ≥44px button with hover/focus/selected states; status never rides on colour alone (Badge with icon + an optional severity accent rail). For the KPI strip use StatGroup; for a severity-triaged alert worklist use ActionQueue; for a money breakdown use AmountBreakdown. RSC-safe by default — onSelect is the only function prop and is opt-in.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "relationshipRow",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:relationshipRow",
      title: "RelationshipRow",
      description: "Two PersonCells side by side with a connector (⟷ by default) and an optional relationship label: the 'person ⟷ person' unit. Models the pairings that define people-heavy domains — manager↔report (1on1), helper↔client (訪問介護), 利用者↔担当ケアマネ (ケアプラン), approver chains, mentor↔mentee. Each side is a full PersonCell (avatar + name + secondary/tertiary + status); a trailing slot holds a badge/chevron/actions. Presentational by default — let an interactive row (a wrapping link, DataTable onRowClick) own activation rather than nesting a button.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "kanbanBoard",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:kanbanBoard",
      title: "KanbanBoard",
      description: "A kanban / status board: ordered columns (lanes) of cards, grouped from a flat items list by getColumnId, with per-column count badges, a card render-prop, optional activatable cards, empty-column placeholders, header accent dots, and a contained horizontal scroll that doesn't push the page on mobile. Each column is a labelled region and cards are real buttons when selectable (keyboard-operable). Drag-and-drop is bring-your-own. For editorial boards, CRM pipelines, support queues, task boards and any column-of-cards workflow.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "eventCalendar",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:eventCalendar",
      title: "EventCalendar",
      description: "Month calendar with events: a 週×曜日 day-cell grid for a month with events placed as chips on their date (capped per day with a '＋N' overflow), today marked, out-of-month days de-emphasised, role=grid semantics (weekday columnheaders, day gridcells with a composed accessible name) and roving-tabindex keyboard nav (arrows ±1 day / ±1 week, Home/End, Enter to select). Owns the month math (pass month + events); today is injectable (SSR-safe). For editorial / content calendars, schedules, bookings and any events-on-dates view.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "checkList",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:checkList",
      title: "CheckList",
      description: "A checklist / confirmable list: rows of a leading checkbox + label + description with a trailing slot (status badge, action, amount), bordered and divider-separated, each checkbox carrying the row label as its accessible name. Rows with no checked render as plain display rows. For document checklists, required-step / associated-procedure lists, recall/return scope confirmation, batch-approval pick lists and any 'tick these, see their status' surface. (For single/multi selection with roving keyboard nav — inbox / master-detail — that's a separate ListBox primitive.)",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "approvalWorkflow",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:approvalWorkflow",
      title: "ApprovalWorkflow",
      description: "Interactive approval / review workflow: drives an ordered pipeline of stages through advance→next, send-back (to a prior stage with a reason, rolling back later records) and reject (terminal), recording an actor + timestamp on each transition, and renders the result with ApprovalSteps (state never colour-only). Controlled via value + onChange; advancing is gated by canAdvance. For case management, benefit/application screening, ringi/expense approval, onboarding and any staged back-office review.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "scheduleGrid",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:scheduleGrid",
      title: "ScheduleGrid",
      description: "A 2-D matrix grid: a row axis × a column axis of rich content cells with a frozen first column + sticky header row, role=grid semantics (rowheaders / columnheaders / gridcells with composed accessible names), roving-tabindex arrow-key navigation, per-cell tone (a destructive flag ring), an unavailable slot treatment, and a contained horizontal scroll that does not push the page on mobile. For any rows×columns matrix of rich navigable/editable cells — timetables (periods×days), gradebooks (students×subjects), shift rosters, comparison/cohort matrices, availability and room/resource booking grids. (Not for sortable list data — that is DataTable; not for value-by-color heatmaps — that is HeatmapChart.)",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "routeStops",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:routeStops",
      title: "RouteStops",
      description: "Ordered route / itinerary list: numbered stops with a per-stop status (pending / current / completed / failed / delayed) driving the marker and a status label, a planned-vs-actual time pair with a signed delay, the current stop wired with aria-current, and a trailing actions slot. For delivery tracking, picking walk-paths and any sequenced-stop flow.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
  {
    key: "referenceValue",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:referenceValue",
      title: "ReferenceValue",
      description: "A measured value judged against a reference range: classifies it as normal / high (H) / low (L) / critical (HH/LL) and renders the value with a flag code, tone and screen-reader text — the value-vs-range judgement that vitals, lab results, dose safety, SLA/quota and tolerance bands all need. Exports a pure `flagValue()` helper for tables and charts.",
      variants: [
        createSyntheticVariant("default", { width: null, padding: null }),
      ],
    }),
  },
  {
    key: "signedRecord",
    syntheticSpec: createSyntheticDisplaySpec({
      frameId: "synthetic:signedRecord",
      title: "SignedRecord",
      description: "Append-only signed legal record: a draft body that, once signed, locks read-only (recording signer + timestamp) and can only be amended by a timestamped, authored addendum — never edited. Renders the draft/signed badge, the locked affordance, the signer audit line, an addendum composer and chain, and an optional CoSign gate. For clinical notes, discharge summaries, operative records and any signed/audited document.",
      variants: [
        createSyntheticVariant("default", { padding: null }),
      ],
    }),
  },
];
