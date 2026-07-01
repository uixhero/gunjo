function createSyntheticLayoutSpec({ frameId, title, description, variants }) {
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

export const LAYOUT_SPEC_DEFINITIONS = [
  // From atoms — atom-style (showcase frame is both frame + variants)
  {
    key: "aspectRatio",
    frameId: "K5AUnC",
    titleId: "dQ5IZ",
    descId: "JJAGB",
    variantsId: "K5AUnC",
  },
  {
    key: "container",
    frameId: "y82psN",
    titleId: "OcePG",
    descId: "UrkXM",
    variantsId: "y82psN",
  },
  {
    key: "hStack",
    frameId: "Vwsvk",
    titleId: "h4pDNM",
    descId: "pWM7m",
    variantsId: "Vwsvk",
  },
  {
    key: "vStack",
    frameId: "sUUzz",
    titleId: "pLgDT",
    descId: "qQPbw",
    variantsId: "sUUzz",
  },
  {
    key: "cluster",
    frameId: "yQE7M",
    titleId: "OZBhd",
    descId: "mLVBi",
    variantsId: "yQE7M",
  },
  {
    key: "grid",
    frameId: "BHOl8",
    titleId: "E2N2xN",
    descId: "b1z4RF",
    variantsId: "BHOl8",
  },
  // From molecules — structured
  {
    key: "scrollArea",
    frameId: "scrollAreaFrame",
    titleId: "scrollAreaTitle",
    descId: "scrollAreaDesc",
    variantsId: "scrollAreaVariants",
    nodeIds: {
      default: "scrollAreaDefault",
      viewport: "scrollAreaViewport",
      scrollbar: "scrollAreaScrollbar",
      thumb: "scrollAreaThumb",
    },
    variantOverrides: {
      default: {
        // ScrollArea fills its consumer-provided container; .pen demo dimensions should not become runtime hints.
        width: null,
        height: null,
      },
    },
  },
  {
    key: "resizable",
    frameId: "resizableFrame",
    titleId: "resizableTitle",
    descId: "resizableDesc",
    variantsId: "resizableVariants",
    nodeIds: {
      default: "resizableDefault",
      panelGroup: "resizablePanelGroup",
      handle: "resizableHandle",
      handleGrip: "resizableHandleGrip",
    },
    variantOverrides: {
      horizontal: {
        // ResizablePanelGroup is parent-sized in runtime.
        width: null,
        height: null,
      },
    },
  },
  {
    key: "collapsiblePanelToggle",
    syntheticSpec: createSyntheticLayoutSpec({
      frameId: "synthetic:collapsiblePanelToggle",
      title: "CollapsiblePanelToggle",
      description: "Boundary control for opening and closing a collapsible panel from the left, right, top, or bottom edge.",
      variants: [
        createSyntheticVariant("left", {
          width: 40,
          height: 40,
          padding: null,
          cornerRadius: null,
        }),
        createSyntheticVariant("right", {
          width: 40,
          height: 40,
          padding: null,
          cornerRadius: null,
        }),
        createSyntheticVariant("top", {
          width: 40,
          height: 40,
          padding: null,
          cornerRadius: null,
        }),
        createSyntheticVariant("bottom", {
          width: 40,
          height: 40,
          padding: null,
          cornerRadius: null,
        }),
      ],
    }),
  },
  // From organisms — structured
  {
    key: "inspectorPanel",
    frameId: "inspectorPanelFrame",
    titleId: "inspectorPanelTitle",
    descId: "inspectorPanelDesc",
    variantsId: "inspectorPanelVariants",
    nodeIds: {
      default: "inspectorPanelDefault",
      header: "inspectorPanelHeader",
      headerText: "inspectorPanelHeaderText",
      body: "inspectorPanelBody",
      sectionTitle: "inspectorPanelSectionTitle",
      fieldLabel: "inspectorPanelFieldLabel",
    },
  },
  {
    key: "spatialCanvas",
    frameId: "spatialCanvasFrame",
    titleId: "spatialCanvasTitle",
    descId: "spatialCanvasDesc",
    variantsId: "spatialCanvasVariants",
    nodeIds: {
      default: "spatialCanvasDefault",
      hint: "spatialCanvasHint",
    },
    variantOverrides: {
      default: {
        // SpatialCanvas fills the workspace supplied by docs/apps.
        width: null,
        height: null,
      },
    },
  },
  {
    key: "assetInspectorPanel",
    syntheticSpec: createSyntheticLayoutSpec({
      frameId: "synthetic:assetInspectorPanel",
      title: "AssetInspectorPanel",
      description: "Media library inspector panel for asset preview, title and note fields, tag editing, metadata rows, and asset actions.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "deviceFrame",
    syntheticSpec: createSyntheticLayoutSpec({
      frameId: "synthetic:deviceFrame",
      title: "DeviceFrame",
      description: "Browser chrome frame with URL entry, visual chrome variants, and desktop, tablet, and mobile viewport controls for interactive pattern previews.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("windows11"),
      ],
    }),
  },
  {
    key: "marqueeFrame",
    syntheticSpec: createSyntheticLayoutSpec({
      frameId: "synthetic:marqueeFrame",
      title: "MarqueeFrame",
      description: "Scaled fake-browser viewport wrapper for marquee pattern pages. It keeps pattern content and overlays scoped to the active preview viewport.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("desktop"),
        createSyntheticVariant("tablet"),
        createSyntheticVariant("mobile"),
      ],
    }),
  },
];
