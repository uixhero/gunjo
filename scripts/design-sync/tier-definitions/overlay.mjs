function createSyntheticOverlaySpec({ frameId, title, description, variants }) {
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

export const OVERLAY_SPEC_DEFINITIONS = [
  // From molecules
  {
    key: "dialog",
    frameId: "dialogFrame",
    titleId: "dialogTitle",
    descId: "dialogDesc",
    variantsId: "dialogVariants",
    nodeIds: {
      default: "dialogDefault",
      overlay: "dialogOverlay",
      content: "dialogContent",
      header: "dialogHeader",
      headerTitle: "dialogHeaderTitle",
      headerDesc: "dialogHeaderDesc",
      footer: "dialogFooter",
    },
  },
  {
    key: "alertDialog",
    frameId: "S6DGmk",
    titleId: "ndqQf",
    descId: "vE2Aj",
    variantsId: "S6DGmk",
    nodeIds: {},
  },
  {
    key: "modal",
    frameId: "modalFrame",
    titleId: "modalTitle",
    descId: "modalDesc",
    variantsId: "modalVariants",
    nodeIds: {
      default: "modalDefault",
      header: "modalHeader",
      headerTitle: "modalHeaderTitle",
      content: "modalContent",
      contentText: "modalContentText",
      footer: "modalFooter",
    },
  },
  {
    key: "sheet",
    frameId: "sheetFrame",
    titleId: "sheetTitle",
    descId: "sheetDesc",
    variantsId: "sheetVariants",
    nodeIds: {
      default: "sheetDefault",
      overlay: "sheetOverlay",
      content: "sheetContent",
      header: "sheetHeader",
      headerTitle: "sheetHeaderTitle",
      headerDesc: "sheetHeaderDesc",
      footer: "sheetFooter",
    },
  },
  {
    key: "drawer",
    frameId: "Dv13Y",
    titleId: "nT9xK",
    descId: "X10Ngo",
    variantsId: "Dv13Y",
    nodeIds: {},
  },
  {
    key: "popover",
    frameId: "popoverFrame",
    titleId: "popoverTitle",
    descId: "popoverDesc",
    variantsId: "popoverVariants",
    nodeIds: {
      default: "popoverDefault",
      contentText: "popoverContentText",
    },
  },
  {
    key: "tooltip",
    frameId: "tooltipFrame",
    titleId: "tooltipTitle",
    descId: "tooltipDesc",
    variantsId: "tooltipVariants",
    nodeIds: {
      default: "tooltipDefault",
      text: "tooltipText",
    },
  },
  {
    key: "hoverCard",
    frameId: "hoverCardFrame",
    titleId: "hoverCardTitle",
    descId: "hoverCardDesc",
    variantsId: "hoverCardVariants",
    nodeIds: {
      default: "hoverCardDefault",
      header: "hoverCardHeader",
      headerTitle: "hoverCardHeaderTitle",
      headerDesc: "hoverCardHeaderDesc",
    },
  },
  {
    key: "dropdownMenu",
    frameId: "dropdownMenuFrame",
    titleId: "dropdownMenuTitle",
    descId: "dropdownMenuDesc",
    variantsId: "dropdownMenuVariants",
    nodeIds: {
      default: "dropdownMenuDefault",
      label: "dropdownMenuLabel",
      labelText: "dropdownMenuLabelText",
      separator: "dropdownMenuSeparator",
      item: "dropdownMenuItem",
      itemText: "dropdownMenuItemText",
    },
  },
  {
    key: "contextMenu",
    frameId: "contextMenuFrame",
    titleId: "contextMenuTitle",
    descId: "contextMenuDesc",
    variantsId: "contextMenuVariants",
    nodeIds: {
      default: "contextMenuDefault",
      labelText: "contextMenuLabelText",
      item: "contextMenuItem",
      itemText: "contextMenuItemText",
      separator: "contextMenuSeparator",
      subTrigger: "contextMenuSubTrigger",
    },
  },
  {
    key: "chatPanel",
    syntheticSpec: createSyntheticOverlaySpec({
      frameId: "synthetic:chatPanel",
      title: "ChatPanel",
      description: "Contained chat overlay surface that composes ChatMessage and ChatInput for support, assistant, or team conversation panels.",
      variants: [
        createSyntheticVariant("default", {
          width: "fill_container",
          height: 560,
          fill: "#ffffff",
          stroke: "#e2e8f0",
          cornerRadius: 8,
        }),
        createSyntheticVariant("compact", {
          width: "fill_container",
          height: 420,
          fill: "#ffffff",
          stroke: "#e2e8f0",
          cornerRadius: 8,
        }),
      ],
    }),
  },
  // From organisms
  {
    key: "floatingPanel",
    frameId: "floatingPanelFrame",
    titleId: "floatingPanelTitle",
    descId: "floatingPanelDesc",
    variantsId: "floatingPanelVariants",
    nodeIds: {
      glass: "floatingPanelGlass",
      titleBar: "floatingPanelTitleBar",
      titleText: "floatingPanelTitleText",
      content: "floatingPanelContent",
      contentText: "floatingPanelContentText",
    },
  },
  {
    key: "shareModal",
    frameId: "shareModalFrame",
    titleId: "shareModalTitle",
    descId: "shareModalDesc",
    variantsId: "shareModalVariants",
    nodeIds: {
      default: "shareModalDefault",
      header: "shareModalHeader",
      titleText: "shareModalTitleText",
      content: "shareModalContent",
      sectionLabel: "shareModalSectionLabel",
      hintText: "shareModalHintText",
    },
  },
  {
    key: "onboardingFlow",
    frameId: "s22VHM",
    titleId: "vpkRx",
    descId: "xoWX4",
    variantsId: "s22VHM",
    nodeIds: {},
  },
  {
    key: "mediaLightbox",
    syntheticSpec: createSyntheticOverlaySpec({
      frameId: "synthetic:mediaLightbox",
      title: "MediaLightbox",
      description: "Full-screen media preview dialog with navigation, wheel/button zoom, click-and-drag pan, double-click toggle between fit-frame and fit-width, and asset actions.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "mediaPickerDialog",
    syntheticSpec: createSyntheticOverlaySpec({
      frameId: "synthetic:mediaPickerDialog",
      title: "MediaPickerDialog",
      description: "Media selection dialog with search, AssetGrid rendering, single-select and multi-select confirmation flows.",
      variants: [
        createSyntheticVariant("default"),
        createSyntheticVariant("compact"),
      ],
    }),
  },
  {
    key: "placePanel",
    syntheticSpec: createSyntheticOverlaySpec({
      frameId: "synthetic:placePanel",
      title: "PlacePanel",
      description: "The details of one place picked on a map, in a panel that comes up from the bottom edge: the place's name, one large value with a caption (the temperature and the sky), and a grid of labelled values. Every row is drawn from the first frame and only the VALUES wait, as fixed-width skeletons, because swapping rows in as each service answers changes the row count and shakes the panel; the panel's height does not change between loading and loaded, so the map above stays still. Each value has three states told apart by the value alone — `undefined` loading (skeleton), `null` could not be fetched (settles to '—' and stops pulsing: a skeleton left pulsing after the request gave up says 'still coming' when nothing is), anything else the value. `aria-busy` while anything is loading. NOT a Sheet: a Sheet is modal (overlay, focus trap, locked page), and a map reader must keep panning while the panel is up — this is a plain landmark the caller places (absolute at the bottom of the map container on a phone, beside the map on a wide screen). The field grid switches to two columns by the panel's own width (container query), not the viewport's. Composes Skeleton, which now stops pulsing under prefers-reduced-motion. Distinct from Sheet / Drawer (modal), DescriptionList / MetadataList (no loading states, not a panel) and Card.",
      variants: [
        createSyntheticVariant("default", { width: null, padding: null }),
      ],
    }),
  },
];
