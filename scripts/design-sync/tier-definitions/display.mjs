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
  { key: "separator", frameId: "separatorFrame", titleId: "separatorTitle", descId: "separatorDesc", variantsId: "separatorVariants" },
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
      collapsed: "accordionCollapsed",
      expanded: "accordionExpanded",
      triggerCollapsed: "accordionTriggerCollapsed",
      triggerExpanded: "accordionTriggerExpanded",
      triggerTextCollapsed: "accordionTriggerTextCollapsed",
      triggerTextExpanded: "accordionTriggerTextExpanded",
      chevronCollapsed: "accordionChevronCollapsed",
      chevronExpanded: "accordionChevronExpanded",
      content: "accordionContent",
      contentText: "accordionContentText",
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
];
