# Figma Library Foundations

Issue: #8

This document records the foundations phase after
`docs/figma-library-discovery.md`.

## Status

A Figma design file was created for the foundations pass:

- File: `GunjoUI Library Foundations (#8)`
- URL: https://www.figma.com/design/1hTzNSFLwOA88R15KCX9iG

The owner approved exporting foundations data from this private pre-public
repository to the Figma file on 2026-06-12. The foundations export was then
completed:

- `Gunjo Tokens`: 54 variables, with `Light` and `Dark` modes.
  - 43 variables from `design/tokens.pen`.
  - 11 runtime semantic color variables from `src/globals.css` for component
    bindings.
- `Gunjo Runtime`: 1 `radius/base` variable.
- Text styles: 7 `Gunjo/*` styles.
- Effect styles: 8 `Gunjo/Shadow/*` styles.
- Pages: Cover, Changelog, Tokens, Inputs, Display, Charts, Feedback,
  Navigation, Overlay, Layout, Patterns.

The Figma file now contains page skeletons, token swatches, and the first
component families:

- `Button` on the `Inputs` page.
  - Section node: `22:2` (`Button / Section`).
  - Component set node: `16:26`.
  - Variants: `default`, `primary`, `info`, `success`, `warning`,
    `destructive`, `outline`, `secondary`, `ghost`, `link`.
  - Component property: `Label`.
  - Layout: `Button / Overview card`, `Button / Variant matrix card`, and
    `Button / Specimen card`.
  - Final section arrangement: 48 px inset, 32 px column gutter, 480 px
    overview card, 672 px variant matrix card, and a full-width specimen card.
    The section title, matrix label, and specimen label are single-source text
    nodes to avoid duplicate or clipped labels in the library page.
  - Size and implementation-state specimens are documented in the specimen
    card; they are not part of the `variant` axis to avoid a 60-variant matrix.
- `TooltipButton` on the `Inputs` page.
  - Section node: `44:2` (`TooltipButton / Section`).
  - Component set node: `44:32`.
  - Variants: `explained`, `icon-only`, `destructive` on the `state` axis.
  - Layout: `TooltipButton / Overview card`, `TooltipButton / Component card`,
    and `TooltipButton / Behavior card`.
  - The component set represents TooltipButton-specific usage states while
    preserving Button as the source for visual variant behavior.
  - Tooltip placement and interaction props are documented in the behavior
    card instead of expanding the Button variant/size matrix.
- `CopyButton` on the `Inputs` page.
  - Section node: `51:5` (`CopyButton / Section`).
  - Component set node: `51:28`.
  - Variants: `default`, `label` on the `variant` axis.
  - Layout: `CopyButton / Overview card`, `CopyButton / Component card`, and
    `CopyButton / Feedback card`.
  - Clipboard feedback states `idle`, `copied`, and `failed` are represented in
    the feedback card instead of becoming a persistent component variant axis.
  - The component set preserves CopyButton's compact icon-only and label
    feedback variants while composing Button, TooltipButton, and Icon behavior.
- `Input` on the `Inputs` page.
  - Section node: `59:13` (`Input / Section`).
  - Component set node: `59:30`.
  - Variants: `default`, `placeholder`, `disabled` on the `variant` axis.
  - Layout: `Input / Overview card`, `Input / Component card`, and
    `Input / Specimen card`.
  - `color/destructive-border` was added to `Gunjo Tokens` for invalid-state
    stroke binding.
  - Docs-derived `with-label`, `invalid`, and `disabled reason` states are
    documented as specimens instead of persistent component variants.
  - The specimen card records the FormGroup width rule while keeping the
    standalone Input component at its intrinsic 280 px width.
- `Checkbox` on the `Inputs` page.
  - Section node: `65:13` (`Checkbox / Section`).
  - Component set node: `65:28`.
  - Variants: `unchecked`, `checked`, `disabled` on the `variant` axis.
  - Layout: `Checkbox / Overview card`, `Checkbox / Component card`, and
    `Checkbox / Specimen card`.
  - The component set records the 20 px control size, 4 px radius, checked
    check mark display, `checked`/`onCheckedChange`/`disabled` prop structure,
    and token bindings for `foreground`, `background`, `input`, `muted`, and
    `ring`.
  - Docs-derived `Unchecked`, `Checked`, and `Disabled` states are documented
    as specimens, including the disabled Label copy and disabled reason tooltip
    text.
- `Switch` on the `Inputs` page.
  - Section node: `70:13` (`Switch / Section`).
  - Component set node: `70:28`.
  - Variants: `unchecked`, `checked` on the `variant` axis.
  - Layout: `Switch / Overview card`, `Switch / Component card`, and
    `Switch / Specimen card`.
  - The component set records the 44 x 24 px track, 2 px padding, full-radius
    track, 20 px thumb, thumb x-position movement from 2 px to 22 px,
    focus-visible ring treatment, disabled opacity behavior, and
    `checked`/`defaultChecked`/`onCheckedChange`/`disabled` prop structure.
  - Docs-derived `Off`, `On`, and `Disabled` states are documented as
    specimens, including the disabled Label copy and disabled reason tooltip
    text.
- `RadioGroup` on the `Inputs` page.
  - Section node: `76:13` (`RadioGroup / Section`).
  - Component set node: `76:27` (`RadioGroupItem`).
  - Variants: `unchecked`, `checked` on the `variant` axis.
  - Layout: `RadioGroup / Overview card`, `RadioGroup / Component card`, and
    `RadioGroup / Specimen card`.
  - The `RadioGroupItem` component set records the 16 px item size, 8 px
    radius, token-bound stroke colors, 10 px checked inner dot, focus-visible
    ring treatment, disabled opacity behavior, and the
    `value`/`defaultValue`/`onValueChange`/`name` group prop structure plus
    item-level `value`/`disabled` props.
  - Docs-derived `rich-options`, `horizontal`, and `disabled-option` states are
    documented as group specimens, including Label copy and disabled reason
    tooltip text.
- `Select` on the `Inputs` page.
  - Section node: `81:13` (`Select / Section`).
  - Component set node: `81:27`.
  - Variants: `default` on the `variant` axis.
  - Component property: `Value`.
  - Layout: `Select / Overview card`, `Select / Component card`, and
    `Select / Specimen card`.
  - The component set records the 200 x 36 px native select surface, 12 px
    horizontal padding, 8 px radius, token-bound stroke, selected value /
    placeholder display, chevron affordance, focus-visible ring treatment,
    full-width wrapper behavior, disabled background/text/opacity behavior, and
    `value`/`defaultValue`/`onChange`/`disabled` prop structure.
  - Docs-derived `with-label`, `grouped-options`, and `disabled` states are
    documented as form specimens, including FormGroup, FormLabel, FormControl,
    FormDescription, and disabled reason tooltip copy.
- `Slider` on the `Inputs` page.
  - Section node: `87:13` (`Slider / Section`).
  - Component set node: `87:26`.
  - Variants: `default` on the `variant` axis.
  - Layout: `Slider / Overview card`, `Slider / Component card`, and
    `Slider / Specimen card`.
  - The component set records the 200 x 20 px range track, 10 px radius,
    token-bound track fill, 20 px thumb, 2 px thumb border, thumb
    foreground/background binding, focus-visible ring treatment, disabled
    opacity behavior, and `value`/`defaultValue`/`onValueChange`/`min`/`max`/
    `step`/`disabled` prop structure.
  - `color/input` scope was extended from stroke-only to include `FRAME_FILL`
    and `SHAPE_FILL`, because Slider uses the token as a track fill.
  - Docs-derived `live-value`, `steps`, and `disabled` states are documented as
    form specimens, including FormGroup, FormLabel, FormControl,
    FormDescription, HStack-style label/value layout, and disabled reason
    tooltip copy.
- `Textarea` on the `Inputs` page.
  - Section node: `90:13` (`Textarea / Section`).
  - Component set node: `90:28`.
  - Variants: `default`, `disabled` on the `variant` axis.
  - Component property: `Content`.
  - Layout: `Textarea / Overview card`, `Textarea / Component card`, and
    `Textarea / Specimen card`.
  - The component set records the 280 x 80 px textarea surface, 12 px
    horizontal padding, 8 px vertical padding, 8 px radius, token-bound stroke,
    shadow-sm effect, placeholder/value display, focus-visible ring treatment,
    disabled background/text/opacity behavior, invalid helper text treatment,
    and `value`/`defaultValue`/`onChange`/`rows`/`placeholder`/`disabled`/
    `aria-invalid`/`maxLength` prop structure.
  - `color/destructive` scope was extended to include `TEXT_FILL`, because
    Textarea invalid helper text uses the token as a text fill.
  - Docs-derived `with-label`, `character-counter`, `invalid`, and `disabled`
    states are documented as form specimens, including FormGroup, FormLabel,
    FormControl, FormDescription, and disabled reason tooltip copy.
- `Badge` on the `Display` page.
  - Section node: `100:2` (`Badge / Section`).
  - Component set node: `100:21`.
  - Variants: `default`, `secondary`, `destructive`, `outline` on the
    `variant` axis.
  - Component property: `Label`.
  - Layout: `Badge / Overview card`, `Badge / Component card`, and
    `Badge / Specimen card`.
  - The component set records the 20 px badge height, 10 px horizontal padding,
    4 px vertical padding, rounded-full radius, border behavior, 12 px
    semibold label, focus-visible ring guidance, and HTMLAttributes-based
    `variant`/`children`/`className` prop structure.
  - Docs-derived `status variants`, `icon badge`, `removable badge`,
    `disabled badge`, `addable badge`, and `selectable badge` states are
    documented as specimens, including Tooltip, Button, Icon, and
    DropdownMenu composition notes.
- `Avatar` on the `Display` page.
  - Section node: `108:2` (`Avatar / Section`).
  - Component set node: `108:21`.
  - Variants: `fallback`, `image` on the `variant` axis.
  - Component property: `Fallback`.
  - Layout: `Avatar / Overview card`, `Avatar / Component card`, and
    `Avatar / Specimen card`.
  - The component set records the 40 x 40 px root, rounded-full clipping,
    fallback typography, image object-cover behavior, Tooltip composition,
    and Avatar Root / Image / Fallback prop structure.
  - `color/muted-foreground` scope was extended to include `FRAME_FILL` and
    `SHAPE_FILL`, because Avatar uses the token for the offline presence dot.
  - Docs-derived `with image`, `fallback`, and `composed with presence` states
    are documented as specimens, including presence values `online`, `away`,
    `busy`, and `offline`, 10 px presence dot geometry, 2 px background border,
    and bottom-right absolute positioning.
- `Separator` on the `Display` page.
  - Section node: `112:2` (`Separator / Section`).
  - Component set node: `112:15`.
  - Variants: `horizontal`, `vertical` on the `orientation` axis.
  - Layout: `Separator / Overview card`, `Separator / Component card`, and
    `Separator / Specimen card`.
  - The component set records horizontal `w-full h-[1px]` behavior as a
    240 px specimen, vertical `w-[1px] h-6`, `shrink-0`, bg-border fill, and
    HTMLAttributes-based `orientation`/`className` prop structure.
  - `color/border` scope was extended to include `FRAME_FILL` and
    `SHAPE_FILL`, because Separator uses the token as `bg-border` fill.
  - Docs-derived `horizontal content divider` and
    `vertical toolbar metadata divider` states are documented as specimens,
    including the parent-width rule for horizontal separators.
- `Card` on the `Display` page.
  - Section node: `117:2` (`Card / Section`).
  - Component set node: `117:25`.
  - Variants: `default` on the `variant` axis.
  - Layout: `Card / Overview card`, `Card / Component card`, and
    `Card / Specimen card`.
  - The component set records the Card root as a 350 px wide default variant
    with vertical flex layout, full-width intent, rounded-lg radius, token-bound
    `bg-card`, token-bound `text-card-foreground`, token-bound border,
    `Gunjo/Shadow/sm`, and `CardHeader` / `CardContent` / `CardFooter` slots.
  - The slot structure records `CardHeader` padding 24 px and 6 px gap,
    `CardContent` padding `0 24 24 24`, `CardFooter` padding `0 24 24 24`,
    12 px gap, and space-between alignment.
  - Docs-derived `metric card`, `media card`, `content card`,
    `article card with avatar`, `social timeline card`, `card with actions`,
    and `loading` states are documented as specimens, including Badge, Button,
    Avatar, ImagePreview, and Skeleton composition notes.
- `Accordion` and `AccordionGroup` on the `Display` page.
  - Section node: `122:2` (`Accordion / Section`).
  - Accordion component set node: `122:26`.
  - Accordion variants: `collapsed`, `expanded` on the `variant` axis, with
    `collapsed` as the default.
  - AccordionGroup component set node: `122:96`.
  - AccordionGroup variants: `default`, `withDescription`, and
    `withoutControls` on the `variant` axis, with `default` as the default.
  - Layout: `Accordion / Overview card`, `Accordion / Component card`, and
    `Accordion / Specimen card`.
  - The Accordion set records the Radix-derived root/item/trigger/content
    structure, `single`/`multiple` behavior model, trigger indicator options,
    16 px trigger padding, 24 px indicator hit area, 16 px icon, token-bound
    border, foreground and muted-foreground text, disabled opacity, and
    open/close rotation and animation guidance.
  - The AccordionGroup set records the grouped heading, description,
    expand/collapse TooltipButton control, `values`-driven open-all behavior,
    and `showControls` composition states.
  - Docs-derived `single collapsible`, `plus indicator`,
    `multiple sections open`, `disabled`, `with description`, `initial open`,
    and `without controls` states are documented as specimens, including
    Tooltip, TooltipButton, and Icon composition notes.
- `List` on the `Display` page.
  - Section node: `128:2` (`List / Section`).
  - Component set node: `128:26`.
  - Variants: `dot`, `check`, and `circle` on the `variant` axis, with `dot`
    as the default.
  - Layout: `List / Overview card`, `List / Component card`, and
    `List / Specimen card`.
  - The component set records `ListItem` marker variants with 8 px marker/text
    gap, 16 px dot and check marker boxes, 12 px circle marker treatment, and
    token-bound muted-foreground text.
  - `color/primary` and `color/success` scopes were extended to include
    `TEXT_FILL`, because List marker glyphs and custom icon specimens use those
    tokens as text/icon fills in the Figma component model.
  - Docs-derived `checklist`, `ordered`, `divided`, `custom icon`, and
    `usage boundary` states are documented as specimens, including semantic
    `unordered` / `ordered` / `none`, marker, spacing, divided, Card, Icon, and
    Checkbox usage-boundary notes.
- `MarkdownRenderer` on the `Display` page.
  - Section node: `131:2` (`MarkdownRenderer / Section`).
  - Component node: `131:20`.
  - Variants: none. Default variant: none.
  - Layout: `MarkdownRenderer / Overview card`,
    `MarkdownRenderer / Component card`, and
    `MarkdownRenderer / Specimen card`.
  - The component records the default GFM-enabled Markdown rendering surface,
    including heading, paragraph, TextLink, unordered list, blockquote, code
    block, Table composition, and read-only task checkbox treatment.
  - `color/primary-border` was added to `Gunjo Tokens` for the blockquote
    border binding, using the runtime semantic values from `src/globals.css`.
  - Docs-derived `release notes`, `GFM extensions`, and `without GFM` states
    are documented as specimens, including DocNote, Table, TextLink, Tooltip,
    and read-only task tooltip composition notes.
- `MetadataList` on the `Display` page.
  - Section node: `136:2` (`MetadataList / Section`).
  - Component set node: `136:52`.
  - Variants: `default` and `compact` on the `variant` axis, with `default`
    as the default.
  - Layout: `MetadataList / Overview card`,
    `MetadataList / Component card`, and
    `MetadataList / Specimen card`.
  - The component set records the `MetadataListItem` label/value row contract,
    optional description and icon slots, vertical layout spacing, compact
    density, muted uppercase labels, foreground values, and truncate/title
    behavior.
  - Docs-derived `default asset metadata`, `compact`, `horizontal`, and
    `empty` states are documented as specimens, including the default
    `emptyMessage` copy and Table / AssetInspectorPanel / Card usage-boundary
    notes.
- `Rating` on the `Display` page.
  - Section node: `144:2` (`Rating / Section`).
  - Component set node: `144:85`.
  - Variants: `sm`, `default`, and `lg` on the `variant` axis, with
    `default` as the default.
  - Layout: `Rating / Overview card`, `Rating / Component card`,
    `Rating / Specimen card`, `Rating / Token and style notes`, and
    `Rating / Source footer`.
  - The component set records the read-only `role="img"` root, default
    `aria-label` pattern, half-star rounding, `max` star count, optional
    numeric value, optional review count, and `sm` / `default` / `lg` icon
    sizes.
  - `color/warning` scope was extended to include `TEXT_FILL`, because Rating
    star glyphs use the warning token as an icon/text fill in the Figma
    component model.
  - Docs-derived `with value + review count`, `small`, `large`, and
    `full rating` states are documented as specimens, including filled, half,
    and empty star treatments and token-bound foreground / muted-foreground
    text.
- `RevealSection` on the `Display` page.
  - Section node: `147:2` (`RevealSection / Section`).
  - Component node: `147:18`.
  - Variants: `default`, with `default` as the default.
  - Layout: `RevealSection / Overview card`,
    `RevealSection / Component card`, `RevealSection / Specimen card`,
    `RevealSection / Token and behavior notes`, and
    `RevealSection / Closed-state contract`.
  - The component records the `open=true` render contract, named-region
    behavior, `role="region"` / `aria-label` / `aria-live="polite"` a11y
    wiring, `data-state="open"` / `data-slot="reveal-section"` attributes,
    and the `animate-in fade-in-0 slide-in-from-top-1 duration-200`
    transition class set.
  - The `open=false` state is documented as a render-none contract rather than
    a hidden visual variant, matching the source implementation.
  - Docs-derived `配偶者あり`, `配偶者控除の申告`, `配偶者氏名`, and
    `配偶者の所得見積額` labels are documented as specimens, including
    Switch and Input composition and token-bound foreground /
    muted-foreground / muted / border / input styling.
- `SearchableAccordion` on the `Display` page.
  - Section node: `152:2` (`SearchableAccordion / Section`).
  - Component set node: `152:70`.
  - Variants: `default`, `withCategories`, and `empty` on the `variant` axis,
    with `default` as the default.
  - Layout: `SearchableAccordion / Overview card`,
    `SearchableAccordion / Component card`,
    `SearchableAccordion / Specimen card`,
    `SearchableAccordion / Token and behavior notes`,
    `SearchableAccordion / Item data card`, and
    `SearchableAccordion / Source footer`.
  - The component set records the search, category, and open controlled /
    uncontrolled APIs, `data-slot="searchable-accordion"`, `all` category
    default, active-filter clearing, and compact `SearchInput`, `Tabs`,
    `Badge`, `AccordionGroup`, and `EmptyState` representations.
  - Docs-derived `With categories`, `Search only`, and `No results` states
    are documented as specimens, including FAQ item data, categories,
    keywords, result count copy, empty-state copy, and clear-filter action.
  - Token-bound styling records foreground / muted-foreground text, muted tab
    rails and empty surfaces, secondary badge fill, secondary-foreground badge
    text, and border / input / ring control boundaries.
- `Skeleton` on the `Display` page.
  - Section node: `157:2` (`Skeleton / Section`).
  - Component node: `157:18`.
  - Variants: none. Default variant: none. Shape is represented as a `shape`
    prop rather than a generated variant axis.
  - Layout: `Skeleton / Overview card`, `Skeleton / Component card`,
    `Skeleton / Demo specimen card`, `Skeleton / Pattern specimens`,
    `Skeleton / Token and usage notes`, and `Skeleton / Source footer`.
  - The component records the default `shape="rectangle"` contract,
    `animate-pulse rounded-md bg-muted` base class, and className-driven
    width, height, radius, and positioning overrides.
  - Shape specimens document `rectangle`, `circle`, and `text`, including the
    default rectangle dimensions, circular avatar treatment, and rounded text
    line treatment.
  - Docs-derived `example avatar + text lines`, `Card`, `List`, `Prose`,
    `Navigation`, `Video`, and `Table rows` loading patterns are documented as
    specimens, including Img / ImagePreview / Table usage-boundary notes.
  - Token-bound styling records muted placeholder fills, card/background and
    border specimen surfaces, and foreground annotation labels.

## Local Payload

Run:

```bash
npm run design:report:figma-foundations
```

Generated outputs:

- `docs/figma-library-foundations.generated.md`
- `docs/figma-library-foundations.generated.json`

These files describe the exact data intended for the Figma foundations write:

- 11 pages matching the discovery taxonomy.
- 54 variables in a `Gunjo Tokens` collection with Light and Dark modes:
  43 from `design/tokens.pen`, plus 11 runtime semantic colors required for
  Button and other component bindings.
- 1 `Gunjo Runtime` radius variable for `var(--radius)`, because component
  corner-radius binding needs it and `design/tokens.pen` does not currently emit
  a radius token.
- 7 text styles under `Gunjo/*`.
- 8 effect styles under `Gunjo/Shadow/*`.

## External Write Approval

The owner explicitly approved the external write with:

> I approve exporting the GunjoUI token names, token values, page taxonomy, text
> style names, and effect style names from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

That approval covered only foundations data. Component creation still needs the
normal per-phase review checkpoints before each component/family.

The owner then approved exporting the additional Button component data with:

> I approve exporting the runtime semantic token names and values from
> `src/globals.css` required to create the GunjoUI Button component
> (`primary-strong`, `info-strong`, `success-strong`, `warning-strong`,
> `destructive-strong`, their foreground variables, and the
> `background`/`foreground` usage scopes), plus Button variant names,
> size/state structure, display labels, and style information from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional TooltipButton component data
with:

> I approve exporting the TooltipButton prop names, default values, behavior,
> Tooltip display structure, side/align/offset information, inherited Button
> variant/size structure, docs-derived state taxonomy, display labels, sample
> copy, and style information from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional CopyButton component data with:

> I approve exporting the CopyButton prop names, default values, behavior,
> variant names (`default`, `label`), clipboard feedback states (`idle`,
> `copied`, `failed`), inherited and composed Button, TooltipButton, and Icon
> display structure, docs-derived state taxonomy, display labels, sample copy,
> and style information from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Input component data with:

> I approve exporting the Input variant names (`default`, `placeholder`,
> `disabled`), state structure (`with-label`, `invalid`, `disabled reason`),
> dimensions, padding, radius, placeholder/value display, FormGroup width rule,
> token names and values (`input`, `ring`, `muted`, `muted-foreground`,
> `background`, `foreground`, `destructive-border`), docs-derived display
> labels, sample copy, and style information from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Checkbox component data with:

> I approve exporting the Checkbox variant names (`unchecked`, `checked`,
> `disabled`), `checked`/`onCheckedChange`/`disabled` prop structure,
> dimensions, radius, check mark display, docs-derived state taxonomy, display
> labels, sample copy, style information including Label and disabled reason
> tooltip, and token names and values (`foreground`, `background`, `input`,
> `muted`, `ring`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Switch component data with:

> I approve exporting the Switch variant names (`unchecked`, `checked`),
> `checked`/`defaultChecked`/`onCheckedChange`/`disabled` prop structure,
> docs-derived state taxonomy (`off`, `on`, `disabled`), dimensions, padding,
> radius, thumb display, thumb movement, focus ring, disabled opacity, display
> labels and sample copy including Label and disabled reason tooltip, style
> information, and token names and values (`foreground`, `background`,
> `secondary`, `ring`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional RadioGroup component data with:

> I approve exporting the RadioGroup / RadioGroupItem variant names
> (`unchecked`, `checked`), `value`/`defaultValue`/`onValueChange`/`name` group
> prop structure, item-level `value`/`disabled` prop structure, docs-derived
> state taxonomy (`rich-options`, `horizontal`, `disabled-option`), dimensions,
> radius, stroke, inner dot display, focus ring, disabled opacity, display
> labels and sample copy including Label and disabled reason tooltip, style
> information, and token names and values (`foreground`, `input`, `ring`,
> `muted-foreground`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Select component data with:

> I approve exporting the Select variant names (`default`),
> `value`/`defaultValue`/`onChange`/`disabled` prop structure, docs-derived
> state taxonomy (`with-label`, `grouped-options`, `disabled`), dimensions,
> padding, radius, stroke, selected value and placeholder display, chevron icon
> display, full-width wrapper behavior, focus ring, disabled background/text/
> opacity, display labels and sample copy including FormGroup, FormLabel,
> FormControl, FormDescription, and disabled reason tooltip, style information,
> and token names and values (`foreground`, `muted-foreground`, `input`,
> `ring`, `muted`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Slider component data with:

> I approve exporting the Slider variant names (`default`),
> `value`/`defaultValue`/`onValueChange`/`min`/`max`/`step`/`disabled` prop
> structure, docs-derived state taxonomy (`live-value`, `steps`, `disabled`),
> dimensions, radius, track display, thumb display, focus ring, disabled
> opacity, display labels and sample copy including FormGroup, FormLabel,
> FormControl, FormDescription, HStack, and disabled reason tooltip, style
> information, and token names and values (`input`, `foreground`,
> `background`, `ring`, `muted-foreground`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Textarea component data with:

> I approve exporting the Textarea variant names (`default`, `disabled`),
> `value`/`defaultValue`/`onChange`/`rows`/`placeholder`/`disabled`/
> `aria-invalid`/`maxLength` prop structure, docs-derived state taxonomy
> (`with-label`, `character-counter`, `invalid`, `disabled`), dimensions,
> padding, radius, stroke, placeholder/value display, shadow, focus ring,
> disabled background/text/opacity, invalid helper text display, display labels
> and sample copy including FormGroup, FormLabel, FormControl,
> FormDescription, and disabled reason tooltip, style information, and token
> names and values (`input`, `ring`, `muted`, `muted-foreground`,
> `foreground`, `destructive`) from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Badge component data with:

> I approve exporting the Badge variant names (`default`, `secondary`,
> `destructive`, `outline`), variant prop default value, HTMLAttributes-based
> prop structure including `children` and `className`, dimensions, padding,
> rounded-full radius, border, font size/weight, focus ring, each variant's
> background/text/border styles, docs-derived state taxonomy and sample copy
> (`status variants`, `icon badge`, `removable badge`, `disabled badge`,
> `addable badge`, `selectable badge`), Tooltip / Button / Icon composition
> information, and token names and values (`foreground`, `background`,
> `secondary`, `secondary-foreground`, `destructive-strong`,
> `destructive-strong-foreground`, `border`, `ring`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Avatar component data with:

> I approve exporting the Avatar / AvatarImage / AvatarFallback variant names
> (`fallback`, `image`), default variant (`fallback`), Avatar Root / Image /
> Fallback prop structure, `tooltip` / `tooltipSide` / `tooltipAlign` /
> `tooltipPortalContainer` / `tooltipContentClassName` / `presence` /
> `presenceLabel` prop structure, presence values (`online`, `away`, `busy`,
> `offline`), dimensions, rounded-full radius, fallback typography, image
> object-cover behavior, presence dot position/size/border, Tooltip
> composition information, docs-derived state taxonomy and sample copy
> (`with image`, `fallback`, `composed with presence`), and token names and
> values (`secondary`, `muted-foreground`, `background`, `success`,
> `warning`, `destructive`, `foreground`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Separator component data with:

> I approve exporting the Separator variant names (`horizontal`, `vertical`),
> default variant (`horizontal`), HTMLAttributes-based prop structure including
> `orientation` and `className`, dimensions (`horizontal`: `w-full h-[1px]`,
> `vertical`: `w-[1px] h-6`), `shrink-0`, `bg-border`, the parent-width rule
> for horizontal separators, docs-derived state taxonomy and sample copy
> (`horizontal content divider`, `vertical toolbar metadata divider`), and the
> token name and value for `border` from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Card component data with:

> I approve exporting the Card / CardHeader / CardContent / CardFooter /
> CardTitle / CardDescription prop structure, default variant (`default`),
> HTMLAttributes-based `className` / `children` structure, CardTitle `as` prop
> and default value (`h3`), dimensions and layout (`flex w-full flex-col`),
> rounded-lg radius, border, `bg-card`, `text-card-foreground`, `shadow-sm`,
> Header / Content / Footer padding, gap, and alignment, Title / Description
> typography, docs-derived state taxonomy and sample copy (`metric card`,
> `media card`, `content card`, `article card with avatar`,
> `social timeline card`, `card with actions`, `loading`), Badge / Button /
> Avatar / ImagePreview / Skeleton composition information, and token names and
> values (`card`, `card-foreground`, `border`, `muted-foreground`, `muted`,
> `foreground`, `background`, `shadow-sm`, `radius/base`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Accordion family component data
with:

> I approve exporting the Accordion / AccordionItem / AccordionTrigger /
> AccordionContent / AccordionGroup prop structure, Accordion variant names
> (`collapsed`, `expanded`) and default variant (`collapsed`), AccordionGroup
> variant names (`default`, `withDescription`, `withoutControls`) and default
> variant (`default`), Radix Accordion-derived `type` (`single`, `multiple`),
> `collapsible`, `disabled`, `defaultValue`, `value`, and `onValueChange`
> structure, AccordionTrigger `indicator` (`chevron`, `plus`, `none`),
> `openLabel` / `closeLabel` default values, AccordionGroup `values`, `label`,
> `description`, `expandLabel`, `collapseLabel`, `controlsLabel`,
> `showControls`, and `accordionClassName` structure, dimensions, layout,
> animation and rotate behavior, disabled opacity, Tooltip / TooltipButton /
> Icon composition information, docs-derived state taxonomy and sample copy
> (`single collapsible`, `plus indicator`, `multiple sections open`,
> `disabled`, `with description`, `initial open`, `without controls`), and
> token names and values (`foreground`, `muted-foreground`, `border`,
> `background`, `muted`, `ring`) from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional List component data with:

> I approve exporting the List / ListItem prop structure, List variant names
> (`check`, `circle`, `dot`) and default variant (`dot`), List semantic variant
> (`unordered`, `ordered`, `none`), marker (`dot`, `circle`, `check`, `number`,
> `none`), spacing (`default`, `tight`, `loose`), and `divided` structure,
> ListItem `marker`, `icon`, and `children` structure, dimensions and layout,
> Icon composition information, docs-derived state taxonomy and sample copy
> (`checklist`, `ordered`, `divided`, `custom icon`, `usage boundary`), Card /
> Icon / Checkbox usage-boundary information, and token names and values
> (`primary`, `success`, `muted-foreground`, `border`, `foreground`,
> `background`, `muted`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional MarkdownRenderer component
data with:

> I approve exporting the MarkdownRenderer prop names, default values, behavior
> (`content`, `className`, `disableGfm=false`, `components`), no-variant and
> no-default-variant structure, ReactMarkdown / remarkGfm GFM enabled/disabled
> behavior, element rendering structure for headings, paragraphs, links, lists,
> blockquote, rule, code, table, and checkbox input, Table / TextLink / Tooltip
> / DocNote composition information, read-only task checkbox tooltip copy,
> docs-derived state taxonomy and sample copy (`release notes`,
> `GFM extensions`, `without GFM`), dimensions, padding, radius, border,
> typography, spacing, code, table, list, and task checkbox style information,
> and token names and values (`foreground`, `background`, `muted`,
> `muted-foreground`, `border`, `primary`, `primary-border`, `card`, `accent`,
> `popover`, `popover-foreground`) from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional MetadataList component data
with:

> I approve exporting the MetadataList / MetadataListItem prop structure
> (`items`, `variant`, `layout`, `emptyMessage`, `className`, `label`, `value`,
> `description`, `icon`), variant names (`default`, `compact`) and default
> variant (`default`), layout values (`vertical`, `horizontal`) and default
> value (`vertical`), empty-state behavior and default emptyMessage
> (`No metadata`), dimensions and layout, label/value/description/icon
> typography, truncate and title-attribute behavior, docs-derived state
> taxonomy and sample copy (`default asset metadata`, `compact`, `horizontal`,
> `empty`), Table / AssetInspectorPanel / Card / Icon usage-boundary
> information, and token names and values (`foreground`, `muted-foreground`,
> `border`, `card`, `background`) from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Rating component data with:

> I approve exporting the Rating prop names, default values, and behavior
> (`value`, `max=5`, `size=default`, `reviewCount`, `showValue`, `label`,
> `className`), variant names (`sm`, `default`, `lg`) and default variant
> (`default`), read-only `role="img"` and `aria-label` structure,
> half-star rounding (`Math.round(value * 2) / 2`), star rendering structure
> (`filled`, `half`, `empty`, `max` count, `IconStarFilled`,
> `IconStarHalfFilled`, `IconStar`), dimensions (`sm` 14 px, `default` 16 px,
> `lg` 20 px), gap, text size, tabular-nums, numeric value and review count
> display, docs-derived state taxonomy and sample copy (`with value + review
> count`, `small`, `large`, `full rating`), and token names and values
> (`warning`, `muted-foreground`, `foreground`, `background`, `border`,
> `card`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional RevealSection component data
with:

> I approve exporting the RevealSection prop names, default values, and
> behavior (`open`, `label`, `announce=true`, `className`, `children`, and
> HTMLAttributes including `aria-labelledby`), variant name (`default`) and
> default variant (`default`), `open=false` conditional render-none behavior,
> `open=true` `role="region"`, `aria-label`, `aria-live="polite"`,
> `data-state="open"`, and `data-slot="reveal-section"` structure, named
> region behavior, animation classes (`animate-in fade-in-0
> slide-in-from-top-1 duration-200`), docs/demo-derived state taxonomy and
> sample copy (`配偶者あり`, `配偶者控除の申告`, `配偶者氏名`,
> `配偶者の所得見積額`), Switch / Input composition information, demo style
> information (`w-full`, `rounded-md`, `border`, `bg-muted/30`, `p-4`, gap),
> and token names and values (`foreground`, `muted-foreground`, `muted`,
> `border`, `background`, `input`, `ring`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional SearchableAccordion component
data with:

> I approve exporting the SearchableAccordion / SearchableAccordionItem /
> SearchableAccordionCategory / SearchableAccordionLabels prop names, default
> values, and behavior (`items`, `variant=default`, `searchValue`,
> `defaultSearchValue=""`, `onSearchValueChange`, `categoryValue`,
> `defaultCategoryValue="all"`, `onCategoryValueChange`, `openValue`,
> `defaultOpenValue=[]`, `onOpenValueChange`, `categories`,
> `showCategoryTabs=true`, `label`, `description`, `labels`, `emptyState`,
> and HTMLAttributes including `className`), variant names (`default`,
> `withCategories`, `empty`) and default variant (`default`), search matching
> behavior across `title`, `body`, `category`, `searchText`, and `keywords`,
> derived categories, `all` category, active-filter and clearFilters behavior,
> `data-slot="searchable-accordion"` structure, SearchInput / Tabs / Badge /
> AccordionGroup / AccordionItem / AccordionTrigger / AccordionContent /
> EmptyState / Button / Icon composition information, dimensions and layout
> (`w-full`, `p-0`, `space-y-4`, `space-y-3`, TabsList overflow-x-auto,
> result row flex-wrap, max-w-2xl docs preview), docs-derived state taxonomy
> and sample copy (`With categories`, `Search only`, `No results`,
> `ヘルプ項目`, `項目を検索...`, `検索語を消去`, `すべて`,
> `条件をクリア`, `一致する項目がありません`,
> `検索語やカテゴリを変更してください`,
> `請求先情報はどこで変更できますか？`,
> `メンバー招待が届かない場合は？`,
> `二要素認証を必須にできますか？`, `アカウント`, `チーム`,
> `セキュリティ`), and token names and values (`foreground`,
> `muted-foreground`, `muted`, `border`, `background`, `input`, `ring`,
> `secondary`, `secondary-foreground`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Skeleton component data with:

> I approve exporting the Skeleton prop names, default values, and behavior
> (`shape` and HTMLAttributes including `className`), generated no-variant and
> no-default-variant structure, CVA shape values (`rectangle`, `circle`,
> `text`) and default shape (`rectangle`), base class (`animate-pulse
> rounded-md bg-muted`), shape dimensions and radius (`rectangle`: `h-4
> w-full`, `circle`: `h-10 w-10 rounded-full`, `text`: `h-3.5 w-full
> rounded-full`), `className` width, height, and radius override structure,
> docs/demo-derived state taxonomy and sample structures (`example avatar +
> text lines`, `Card`, `List`, `Prose`, `Navigation`, `Video`, `Table rows`),
> loading-placeholder usage that reserves the final content area, Img /
> ImagePreview / Table usage-boundary information, and token names and values
> (`muted`, `card`, `border`, `background`, `foreground`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

The owner then approved exporting the additional Spacer component data with:

> I approve exporting the Spacer prop names, default values, and behavior
> (`size`, `axis="both"`, and HTMLAttributes including `className`),
> generated no-variant and no-default-variant structure, `aria-hidden`
> invisible spacing element structure, flex-grow behavior when `size` is
> omitted (`axis="x"` -> `flex-grow`, `axis="y"` -> `flex-grow`,
> `axis="both"` -> `flex-1`), fixed size classes when `size` is provided
> (`1` = 4 px, `2` = 8 px, `3` = 12 px, `4` = 16 px, `6` = 24 px,
> `8` = 32 px, `12` = 48 px, `16` = 64 px, `24` = 96 px) and no-flex-grow
> behavior in fixed mode, docs/demo-derived state taxonomy and sample
> structures (`toolbar push to edge`, `vertical panel push to bottom`,
> `fixed horizontal spacing`, `fixed vertical rhythm`,
> `flex-grow Spacer (push to edges)`), Button / DocNote / Separator / HStack /
> VStack usage-boundary information, repeated equal spacing guidance that
> prefers gap and stack components, the fact that the component itself has no
> visual token usage, and token names and values used only for Figma specimen
> and annotation (`foreground`, `muted-foreground`, `border`, `background`,
> `muted`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Spacer / Section`: `160:2`
- `Spacer` component: `160:18`
- Placement: `Display` page, after `Skeleton / Section`, at `(40, 15240)`,
  `1280 x 990`.
- Validation: Figma bounds check returned `outOfBoundsCount: 0`; screenshot
  review confirmed the invisible component treatment, flex specimens, fixed
  size scale, usage boundaries, and source footer are aligned without visible
  overlap.

The owner then approved exporting the additional Statistic component data with:

> I approve exporting the Statistic prop names, default values, and behavior
> (`label`, `value`, `change`, `trend="flat"`, `tone`, `hint`, and
> HTMLAttributes including `className`), generated no-variant and
> no-default-variant structure, trend values (`up`, `down`, `flat`) and icon
> structure (`IconArrowUp`, `IconArrowDown`, `IconMinus`, `h-3 w-3`), tone
> values (`positive`, `negative`, `neutral`) and omitted-tone resolution
> (`trend="up"` -> `positive`, `trend="down"` -> `negative`,
> `trend="flat"` -> `neutral`), dimensions and layout (`flex flex-col
> gap-1`, `rounded-lg`, `border`, `bg-card`, `p-4`,
> `text-card-foreground`), label / value / change / hint typography, docs and
> demo-derived state taxonomy and sample copy (`Monthly revenue`,
> `No comparison`, `Positive decrease`, `Negative increase`, `Flat`,
> `Metric group`, `月間売上`, `今月の利用量`, `エラー率`,
> `アラート`, `処理待ち`, `+20.1%`, `-0.4pt`, `+6件`,
> `変化なし`), DocNote-derived trend/tone semantics, AnalyticsCard /
> ChartLegend / Card / chart usage-boundary information, and token names and
> values (`card`, `card-foreground`, `border`, `muted-foreground`, `success`,
> `destructive`, with `background` / `foreground` for specimen annotation) from
> this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Statistic / Section`: `163:2`
- `Statistic` component: `163:18`
- Placement: `Display` page, after `Spacer / Section`, at `(40, 16270)`,
  `1280 x 1120`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the component card, trend/tone specimens, docs
  state specimens, usage boundaries, runtime token notes, and source footer are
  aligned without visible overlap.

The owner then approved exporting the additional SwatchGroup component data
with:

> I approve exporting the SwatchGroup / SwatchOption prop names, default
> values, and behavior (`options`, `value`, `onValueChange`, `size="default"`,
> `disallowEmpty`, and HTMLAttributes including `className`; SwatchOption
> fields `value`, `label`, `color`, `disabled`), variant names (`default`,
> `sm`, `lg`) and default variant (`default`), size dimensions (`sm` 24 px,
> `default` 32 px, `lg` 40 px), root `role="radiogroup"` structure, swatch
> button `role="radio"`, `aria-checked`, `aria-label`, `disabled`,
> `tabIndex`, and `id="swatch-${value}"` structure, roving tabindex and arrow
> key navigation behavior, disabled-swatch skip behavior, selected / disabled /
> focus ring styling, the fact that swatch color is product data passed through
> `style.backgroundColor` rather than a component token, docs-derived swatch
> values and labels (`Ink`, `Primary`, `Forest`, `Amber`,
> `Muted (sold out)`), product variant / theme picker usage information, and
> token names and values (`border`, `background`, `ring`, plus demo color
> tokens `foreground`, `primary`, `success`, `warning`, `muted`) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `SwatchGroup / Section`: `166:2`
- `SwatchGroup` component set: `166:51`
- Placement: `Display` page, after `Statistic / Section`, at `(40, 17430)`,
  `1280 x 1120`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  component set validation returned 3 variants (`Size=default`, `Size=sm`,
  `Size=lg`); screenshot review confirmed the component set, interaction
  states, size scale, demo color chips, usage/token notes, and source footer
  are aligned without visible overlap.

The owner then approved exporting the additional Table component data with:

> I approve exporting the Table / TableHeader / TableBody / TableFooter /
> TableRow / TableHead / TableCell / TableCaption prop names, default values,
> and behavior (`Table` has `striped=false` and HTMLTableElement attributes
> including `className`; each slot forwards the matching HTML attributes,
> `className`, and `children`), variant name (`default`) and default variant
> (`default`), wrapper structure (`relative flex w-full flex-col overflow-auto
> rounded-md rounded-lg border bg-card`), table structure (`w-full
> caption-bottom text-sm`, with striped body even rows using `bg-muted/25`),
> Header / Body / Footer / Row / Head / Cell / Caption class structure, docs
> and demo-derived state taxonomy and sample copy (`default amount table`,
> `striped`, `footer`, `caption`, `horizontal scroll`, `項目`, `状態`,
> `金額`, `担当`, `期限`, `最終更新`, `API`, `ドキュメント`,
> `デザイン`, `アクセシビリティ確認`, `公開前レビュー`, `完了`,
> `確認中`, `未着手`, `合計`, and
> `リリース前確認の担当一覧です。`), horizontal-scroll `min-w-[640px]`
> and `max-w-xs` wrapper behavior, TableFooter / TableCaption / striped rows
> usage guidance, DataTable / MetadataList / MarkdownRenderer usage-boundary
> information, and token names and values (`card`, `accent`, `muted`,
> `muted-foreground`, `border`, with `foreground` / `background` for specimen
> annotation) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Table / Section`: `169:2`
- `Table` component: `169:20`
- Placement: `Display` page, after `SwatchGroup / Section`, at `(40, 18590)`,
  `1280 x 1320`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, props/slot
  contract, anatomy notes, docs state specimens, horizontal-scroll treatment,
  runtime token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Kbd component data with:

> I approve exporting the Kbd prop names, default values, and behavior
> (`children`, `className`, and HTMLAttributes structure; non-interactive
> display behavior from `pointer-events-none` and `select-none`), variant name
> (`key`) and default variant (`key`), dimensions and layout (`inline-flex`,
> `h-5`, `w-fit`, `items-center`, `gap-1`, `py-1`, `px-1.5`,
> `rounded-[4px]`, and `border`), typography (`font-mono`, `text-[10px]`,
> `font-medium`), display labels and sample copy (`⌘`, `K`, `Shift`, `P`,
> `Enter`, `検索を開くには`, `文章内のキー`, `ショートカット`, and
> `Inline help`), docs-derived state taxonomy (`shortcut` and `inline-help`),
> Command / Tooltip / Code usage-boundary information, and token names and
> values (`input`, `secondary`, `muted-foreground`, with `foreground` /
> `background` / `border` / `muted` for specimen annotation) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Kbd / Section`: `173:2`
- `Kbd` component: `173:20`
- Placement: `Display` page, after `Table / Section`, at `(40, 19950)`,
  `1280 x 1100`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default key component, props/behavior
  contract, anatomy notes, docs state specimens, usage boundaries, runtime
  token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Img component data with:

> I approve exporting the Img prop names, default values, and behavior (`src`,
> `alt`, `fallback`, `errorLabel="Image not found"`, `aspectRatio="auto"`,
> `objectFit="cover"`, `showSkeleton=true`, `loading`, `className`, `onLoad`,
> `onError`, and ImgHTMLAttributes structure), variant names (`loading`,
> `loaded`, `error`) and default variant (`loading`), status transitions
> (missing `src` -> `error`, complete image with `naturalWidth > 0` ->
> `loaded`, load/error events update state), aspect-ratio values (`square`,
> `video`, `auto`, `portrait`, `wide`) and class mapping, object-fit values
> (`cover`, `contain`, `fill`, `none`, `scale-down`) and class mapping,
> loading skeleton structure, error fallback structure (`IconPhoto`,
> `errorLabel`, and optional `fallback` ReactNode), dimensions and layout
> (`relative w-full overflow-hidden bg-secondary`, `rounded-lg`, `h-fit`,
> `min-h-40`, `absolute inset-0`, `p-4`, `text-center`), typography
> (`text-xs`, `font-normal`, `text-muted-foreground`), docs-derived state
> taxonomy and sample copy (`sample-image`, `contain`, `error`,
> `サンプル画像`, `全体を収める`, `読み込み失敗`, `Image not found`,
> `画像が見つかりません`, `オフィスデスクの写真`,
> `山と湖の風景写真`), ImagePreview / AssetCard usage-boundary information,
> and token names and values (`secondary`, `muted`, `muted-foreground`, with
> `background` / `foreground` / `border` for specimen annotation) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Img / Section`: `176:2`
- `Img` component set: `176:44`
- Placement: `Display` page, after `Kbd / Section`, at `(40, 21090)`,
  `1280 x 1420`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  component set validation returned 3 variants (`State=loading`,
  `State=loaded`, `State=error`); screenshot review confirmed the component
  set, prop/state contract, anatomy notes, docs state specimens, usage
  boundaries, runtime token notes, and source footer are aligned without
  visible overlap.

The owner then approved exporting the additional Tabs component data with:

> I approve exporting the Tabs / TabsList / TabsTrigger / TabsContent prop
> names, default values, and behavior (Radix Tabs Root/List/Trigger/Content
> `ComponentPropsWithoutRef` structure, `defaultValue`, `value`,
> `onValueChange`, `orientation`, `className`, `children`, and value matching),
> variant name (`default`) and default variant (`default`), Root structure
> (`flex flex-col w-full max-w-full rounded-lg border`, with vertical
> orientation using `flex-row`, `gap-4`, and `border-0`), TabsList structure,
> TabsTrigger structure, active / focus-visible / disabled / vertical trigger
> states, TabsContent structure, docs-derived state taxonomy and sample copy
> (`default`, `with-counts`, `controlled`, `underline`, `概要`,
> `アクティビティ`, `設定`, `プレビュー`, `コード`, `履歴`,
> `Project overview`, `現在選択中のタブは「概要」です。`, and
> `サイト内のプレビュー切り替えと同じ下線タイプです。`), Badge
> composition information, NavigationMenu / Command usage-boundary information,
> and token names and values (`background`, `foreground`, `muted`,
> `muted-foreground`, `border`, `ring`, and `primary`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Tabs / Section`: `179:2`
- `Tabs` component: `179:20`
- Placement: `Navigation` page, after the existing page frame, at `(40, 360)`,
  `1280 x 1360`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, prop/orientation
  contract, anatomy notes, docs state specimens, usage boundaries, runtime token
  notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Breadcrumb component data
with:

> I approve exporting the Breadcrumb / BreadcrumbList / BreadcrumbItem /
> BreadcrumbLink / BreadcrumbPage / BreadcrumbSeparator / BreadcrumbEllipsis
> prop names, default values, and behavior (`Breadcrumb` nav HTMLAttributes
> plus `separator`, `items`, `maxItems`, `itemsBeforeCollapse=1`,
> `itemsAfterCollapse=1`, and `children`; `BreadcrumbItemData` label / href /
> onClick; `BreadcrumbLink` href / `asChild=false` / `className`;
> `BreadcrumbPage` `aria-current="page"` / `aria-disabled="true"`;
> `BreadcrumbSeparator` children default chevron; `BreadcrumbEllipsis`
> `label="More"`), variant name (`default`) and default variant (`default`),
> data-driven items vs children composition behavior, `maxItems` middle
> collapse with DropdownMenu, dimensions and layout, docs-derived state taxonomy
> and sample copy (`home-icon`, `collapsed`, `custom-separator`,
> `metadata-preview`, `ホーム`, `ドキュメント`, `コンポーネント`,
> `パンくず`, `省略された階層`, `Collapsed levels`, `Breadcrumb`,
> `Home`, `Docs`, `Components`), IconHome / IconSlash / ChevronRight /
> IconDots, HoverCard / Button / ToastProvider / DropdownMenu composition
> information, DocumentPager / Pagination / NavigationMenu usage-boundary
> information, and token names and values (`foreground`, `muted-foreground`,
> `background`, `muted`, `border`, and `ring`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Breadcrumb / Section`: `183:2`
- `Breadcrumb` component: `183:20`
- Placement: `Navigation` page, after `Tabs / Section`, at `(40, 1760)`,
  `1280 x 1360`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, prop/collapse
  contract, anatomy notes, docs state specimens, usage boundaries, runtime token
  notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Pagination component data
with:

> I approve exporting the Pagination / PaginationContent / PaginationItem /
> PaginationLink / PaginationFirst / PaginationPrevious / PaginationNext /
> PaginationLast / PaginationEllipsis prop names, default values, and behavior,
> variant name (`default`) and default variant (`default`), `PaginationLink`
> `isActive` and `href`-based anchor/button switching, First/Previous/Next/Last
> label defaults, aria structure, ellipsis and boundary control display
> structure, dimensions and layout, docs-derived state taxonomy and sample copy,
> Select / Tooltip / DataTable composition and usage-boundary information, and
> token names and values (`foreground`, `muted-foreground`, `background`,
> `border`, `ring`, `primary`, `secondary`, and `muted`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Pagination / Section`: `189:2`
- `Pagination` component: `189:22`
- Placement: `Navigation` page, after `Breadcrumb / Section`, at `(40, 3160)`,
  `1280 x 1540`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, prop/rendering
  contract, slot anatomy, docs state specimens, compact/mobile/table
  compositions, runtime token notes, and source footer are aligned without
  visible overlap.

The owner then approved exporting the additional Tooltip component data with:

> I approve exporting the Tooltip / TooltipTrigger / TooltipContent /
> TooltipProvider prop names, default values, and behavior, variant name
> (`default`) and default variant (`default`), Radix Tooltip Root / Provider /
> Trigger / Content / Portal structure, controlled and uncontrolled open-state
> behavior, mobile `openOnPress` behavior, TooltipContent side / align /
> `sideOffset=4` / `portalContainer` / `className` structure, portalContainer
> containment, dimensions, layout, animation classes, design spec default
> specimen, docs-derived state taxonomy and sample copy, Button / Kbd /
> TooltipButton / Popover composition and usage-boundary information, and token
> names and values (`popover`, `popover-foreground`, `border`, `foreground`,
> `muted-foreground`, `background`, `ring`, and `primary`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Tooltip / Section`: `193:2`
- `Tooltip` component: `193:24`
- Placement: `Overlay` page, after the existing page frame, at `(40, 360)`,
  `1280 x 1500`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, prop/behavior
  contract, slot anatomy, docs state specimens, portal containment treatment,
  usage boundaries, runtime token notes, and source footer are aligned without
  visible overlap.

The owner then approved exporting the additional Popover component data with:

> I approve exporting the Popover / PopoverTrigger / PopoverAnchor /
> PopoverContent prop names, default values, and behavior, variant name
> (`default`) and default variant (`default`), Radix Popover Root / Trigger /
> Anchor / Content / Portal structure, PopoverContent `align="center"`,
> `sideOffset=4`, `collisionPadding=16`, `portalContainer`, and `className`
> structure, portalContainer containment, dimensions, layout, animation classes,
> design spec default specimen, docs-derived state taxonomy and sample copy,
> Button / Switch / FormGroup / Input / DropdownMenu / Tooltip composition and
> usage-boundary information, and token names and values (`popover`,
> `popover-foreground`, `border`, `background`, `foreground`, `muted`,
> `muted-foreground`, `ring`, `primary`, and `secondary`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Popover / Section`: `195:2`
- `Popover` component: `195:24`
- Placement: `Overlay` page, after `Tooltip / Section`, at `(40, 1900)`,
  `1280 x 1540`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, prop/behavior
  contract, slot anatomy, docs state specimens, portal containment treatment,
  usage boundaries, runtime token notes, and source footer are aligned without
  visible overlap.

The owner then approved exporting the additional DropdownMenu component data
with:

> I approve exporting the DropdownMenu / DropdownMenuTrigger /
> DropdownMenuContent / DropdownMenuItem / DropdownMenuCheckboxItem /
> DropdownMenuRadioItem / DropdownMenuLabel / DropdownMenuSeparator /
> DropdownMenuShortcut / DropdownMenuGroup / DropdownMenuPortal /
> DropdownMenuSub / DropdownMenuSubTrigger / DropdownMenuSubContent /
> DropdownMenuRadioGroup prop names, default values, and behavior, variant name
> (`default`) and default variant (`default`), Radix DropdownMenu Root /
> Trigger / Content / Portal / Sub / RadioGroup / CheckboxItem / RadioItem /
> ItemIndicator structure, DropdownMenuContent `sideOffset=4` and
> `portalContainer`, SubTrigger `inset`, Item `inset`, `disabled`,
> `disabledReason`, `disabledReasonLabel`, and
> `disabledReasonPortalContainer` with Tooltip composition, checkbox/radio
> checked/value state, Label / Separator / Shortcut structure, docs-derived
> state taxonomy and sample copy, Button / Tooltip / ContextMenu / Menubar
> composition and usage-boundary information, and token names and values
> (`popover`, `popover-foreground`, `accent`, `accent-foreground`, `border`,
> `muted-foreground`, `background`, `foreground`, `destructive`, and `ring`)
> from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `DropdownMenu / Section`: `197:2`
- `DropdownMenu` component: `197:24`
- Placement: `Overlay` page, after `Popover / Section`, at `(40, 3480)`,
  `1280 x 1660`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default menu component specimen,
  prop/default contract, slot anatomy, docs state specimens, portal containment
  and disabled-reason treatment, usage boundaries, runtime token notes, and
  source footer are aligned without visible overlap.

The owner then approved exporting the additional Dialog component data with:

> I approve exporting the Dialog / DialogTrigger / DialogPortal / DialogClose /
> DialogOverlay / DialogContent / DialogHeader / DialogFooter / DialogTitle /
> DialogDescription prop names, default values, and behavior, variant name
> (`default`) and default variant (`default`), Radix Dialog Root / Trigger /
> Portal / Close / Overlay / Content / Title / Description structure,
> DialogContent `portalContainer`, `overlayClassName`,
> `showCloseButton=true`, and `closeLabel="Close"`, Overlay fixed inset and
> contained absolute behavior, Content centered placement, dimensions, padding,
> gap, radius, border, shadow, and animation, close button position and focus
> ring with sr-only label, Header / Footer / Title / Description layout and
> typography, docs-derived state taxonomy and sample copy, Button / Input /
> Textarea / AlertDialog / Drawer composition and usage-boundary information,
> and token names and values (`overlay`, `background`, `foreground`, `muted`,
> `muted-foreground`, `border`, `ring`, `accent`, `input`, and `destructive`)
> from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Dialog / Section`: `200:2`
- `Dialog` component: `200:25`
- Placement: `Overlay` page, after `DropdownMenu / Section`, at `(40, 5180)`,
  `1280 x 1720`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default dialog component specimen,
  prop/default contract, overlay/content/close/header/footer anatomy, docs state
  specimens, portal containment treatment, usage boundaries, runtime token
  notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Sheet component data with:

> I approve exporting the Sheet / SheetTrigger / SheetClose / SheetPortal /
> SheetOverlay / SheetContent / SheetHeader / SheetFooter / SheetTitle /
> SheetDescription prop names, default values, and behavior, variant name
> (`right`) and default variant (`right`), runtime `side` values (`top`,
> `right`, `bottom`, `left`) with default `side="right"`, Radix Dialog Root /
> Trigger / Close / Portal / Overlay / Content / Title / Description structure,
> SheetContent `portalContainer`, `overlayClassName`, `closeLabel="Close"`,
> `className`, `tabIndex=-1`, and `onOpenAutoFocus` behavior, contained portal
> absolute positioning and transform suppression, side-specific layout classes,
> Overlay fixed inset and `bg-overlay/80`, close button Tooltip composition,
> aria-label, sr-only label, and focus ring, Header / Footer / Title /
> Description layout and typography, docs-derived state taxonomy and sample
> copy, Button / Input / Label / Switch / Tooltip / Drawer / Dialog composition
> and usage-boundary information, and token names and values (`overlay`,
> `background`, `foreground`, `muted`, `muted-foreground`, `border`, `ring`,
> `secondary`, `accent`, and `input`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Sheet / Section`: `203:2`
- `Sheet` component: `203:25`
- Placement: `Overlay` page, after `Dialog / Section`, at `(40, 6940)`,
  `1280 x 1740`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the right-side sheet component specimen,
  prop/default contract, side-specific anatomy, docs state specimens,
  portal containment and close-tooltip treatment, usage boundaries, runtime
  token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional AlertDialog component data
with:

> I approve exporting the AlertDialog / AlertDialogTrigger /
> AlertDialogPortal / AlertDialogOverlay / AlertDialogContent /
> AlertDialogHeader / AlertDialogFooter / AlertDialogTitle /
> AlertDialogDescription / AlertDialogAction / AlertDialogCancel prop names,
> default values, and behavior, generated variant-less structure, Radix
> AlertDialog Root / Trigger / Portal / Overlay / Content / Title /
> Description / Action / Cancel structure, AlertDialogContent
> `portalContainer`, `overlayClassName`, and `className`, Overlay fixed inset
> and `bg-overlay/80`, contained absolute overlay behavior, Content centered
> placement, dimensions, padding, gap, radius, border, shadow, and animation,
> Header / Footer / Title / Description layout and typography, Action
> `buttonVariants` composition, Cancel outline composition and responsive
> margin, docs-derived state taxonomy and sample copy, Button / Dialog / Toast
> composition and usage-boundary information, and token names and values
> (`overlay`, `background`, `foreground`, `muted`, `muted-foreground`,
> `border`, `ring`, `destructive`, `destructive-foreground`,
> `destructive-strong`, `destructive-strong-foreground`, `primary`, and
> `primary-foreground`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

Figma export:

- `AlertDialog / Section`: `208:2`
- `AlertDialog` component: `208:25`
- Placement: `Overlay` page, after `Sheet / Section`, at `(40, 8720)`,
  `1280 x 1720`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the destructive confirmation component specimen,
  generated empty-variant/manual contract, Radix anatomy, docs state specimens,
  action/cancel treatment, usage boundaries, runtime token notes, and source
  footer are aligned without visible overlap.

The owner then approved exporting the additional ContextMenu component data
with:

> I approve exporting the ContextMenu / ContextMenuTrigger /
> ContextMenuContent / ContextMenuItem / ContextMenuCheckboxItem /
> ContextMenuRadioItem / ContextMenuLabel / ContextMenuSeparator /
> ContextMenuShortcut / ContextMenuGroup / ContextMenuPortal /
> ContextMenuSub / ContextMenuSubTrigger / ContextMenuSubContent /
> ContextMenuRadioGroup prop names, default values, and behavior, variant name
> (`default`) and default variant (`default`), Radix ContextMenu Root /
> Trigger / Content / Portal / Sub / RadioGroup / CheckboxItem / RadioItem /
> ItemIndicator structure, ContextMenuContent and ContextMenuSubContent
> `portalContainer` structure, SubTrigger `inset`, Item `inset`, `disabled`,
> `disabledReason`, and `disabledReasonLabel` with Tooltip composition,
> Checkbox / Radio checked and value state, Label / Separator / Shortcut
> structure, dimensions and layout, animation classes and side-specific
> slide-in treatment, docs-derived state taxonomy and sample copy,
> DropdownMenu / Menubar / Tooltip related-component information, and token
> names and values (`popover`, `popover-foreground`, `accent`,
> `accent-foreground`, `border`, `muted-foreground`, `foreground`,
> `background`, and `ring`) from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ContextMenu / Section`: `211:2`
- `ContextMenu` component: `211:5`
- Placement: `Overlay` page, after `AlertDialog / Section`, at `(40, 10480)`,
  `1280 x 2140`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, generated
  contract, Radix anatomy, disabled reason tooltip treatment, docs state
  specimens including text-only and nested submenu examples, usage boundaries,
  runtime token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Drawer component data with:

> I approve exporting the Drawer / DrawerTrigger / DrawerPortal / DrawerClose /
> DrawerOverlay / DrawerContent / DrawerHeader / DrawerFooter / DrawerTitle /
> DrawerDescription prop names, default values, and behavior, generated
> variant-less structure, Vaul Drawer Root / Trigger / Portal / Close /
> Overlay / Content / Title / Description structure, Drawer Root
> `shouldScaleBackground=true` default and `open` / `onOpenChange` /
> `container` structure, DrawerContent `side` values (`bottom`, `right`,
> `left`, `top`) with default `side="bottom"`, `portalContainer`,
> `overlayClassName`, and `className` structure, contained absolute
> overlay/content behavior, Overlay fixed inset, `z-50`, and `bg-overlay/80`,
> Content fixed `z-50 flex flex-col bg-background`, side-specific layout
> classes, bottom side drag handle, Header / Footer / Title / Description
> layout and typography, docs-derived state taxonomy and sample copy,
> Button / Input / Label / Textarea / Dialog / Sheet related-component
> information, and token names and values (`overlay`, `background`,
> `foreground`, `muted`, `muted-foreground`, `border`, `ring`, `input`,
> `secondary`, and `accent`) from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Drawer / Section`: `215:2`
- `Drawer` component: `215:5`
- Placement: `Overlay` page, after `ContextMenu / Section`, at `(40, 12660)`,
  `1280 x 2360`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the bottom drawer component specimen, generated
  empty-variant/manual contract, Vaul anatomy, contained overlay/content
  behavior, side-specific docs state specimens, drag handle treatment, usage
  boundaries, runtime token notes, and source footer are aligned without
  visible overlap.

The owner then approved exporting the additional HoverCard component data with:

> I approve exporting the HoverCard / HoverCardTrigger / HoverCardContent prop
> names, default values, and behavior, variant name (`default`) and default
> variant (`default`), Radix HoverCard Root / Trigger / Content / Portal
> structure, HoverCard Root `open` / `defaultOpen` / `onOpenChange` /
> `openDelay=700` / `closeDelay=300` structure, HoverCardContent
> `align="center"`, `sideOffset=4`, `portalContainer`, and `className`
> structure, contained docs preview / framed app overlay behavior, dimensions
> and layout, animation classes and side-specific slide-in treatment, design
> spec-derived default specimen, docs-derived state taxonomy and sample copy,
> Avatar / Button / Tabs / Tooltip / Popover related-component information,
> and token names and values (`popover`, `popover-foreground`, `border`,
> `muted`, `muted-foreground`, `foreground`, `background`, `ring`, `primary`,
> `card`, and `accent`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

Figma export:

- `HoverCard / Section`: `218:2`
- `HoverCard` component: `218:5`
- Placement: `Overlay` page, after `Drawer / Section`, at `(40, 15060)`,
  `1280 x 1980`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, generated
  contract, Radix HoverCard anatomy, contained portal behavior, profile,
  notification, action, and tabbed docs state specimens, usage boundaries,
  runtime token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional Modal component data with:

> I approve exporting the Modal prop names, default values, and behavior
> (`isOpen`, `onClose`, `title`, `children`, `footer`, `portalContainer`,
> `closeLabel="Close"`, `overlayClassName`, and `className`), variant name
> (`default`) and default variant (`default`), React `createPortal` structure,
> `isOpen=false` conditional `null` rendering, Escape key close and body
> overflow lock / cleanup behavior, contained `portalContainer` behavior,
> Overlay `data-prevent-deselect`, placement, backdrop, and animation classes,
> Content `role="dialog"`, `aria-modal`, `aria-label`, click propagation stop,
> dimensions, border, background, shadow, and animation, Header / close button /
> body / optional Footer layout and typography, design spec-derived default
> specimen, docs-derived state taxonomy and sample copy, Button / FormGroup /
> FormLabel / FormControl / FormDescription / Input / Tabs / Dialog
> related-component information, and token names and values (`overlay`,
> `background`, `foreground`, `card`, `muted`, `muted-foreground`, `border`,
> `ring`, `input`, `primary`, `secondary`, `accent`, and `destructive`) from
> this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Modal / Section`: `222:2`
- `Modal` component: `222:5`
- Placement: `Overlay` page, after `HoverCard / Section`, at `(40, 17080)`,
  `1280 x 2700`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, generated
  contract, createPortal anatomy, conditional rendering and containment notes,
  docs state specimens for standard, form, destructive, no-footer, and tabbed
  usage, runtime token notes, and source footer are aligned without visible
  overlap.

The owner then approved exporting the additional ShareModal component data with:

> I approve exporting the ShareModal / ShareData / ShareableItem prop names,
> default values, and behavior (`isOpen`, `onClose`, `item`, `onUpdate`,
> `apiEndpoint="/api/share"`, `onToggleShare`, `onCopyShareUrl`,
> `onOpenShareUrl`, `portalContainer`, and `labels`), variant name
> (`default`) and default variant (`default`), conditional `null` rendering
> when `isOpen=false` or the component is not mounted, `item.share` sync,
> public-link toggle behavior through `onToggleShare` or `apiEndpoint` POST
> fallback, `onUpdate` propagation, `shareUrl` generation, clipboard copy,
> 2000ms copied feedback, copy failure handling, open share URL behavior,
> `createPortal` / `portalContainer` overlay containment, Overlay / Content /
> Header / Public URL / stats / private disabled state structure, Tooltip /
> Button / Switch / Icon composition information, docs-derived state taxonomy
> and sample copy, and token names and values (`overlay`, `background`,
> `foreground`, `muted`, `muted-foreground`, `border`, `ring`, `input`,
> `primary`, `secondary`, `accent`, `destructive`, and `success`) from this
> private pre-public repository to the Figma file `GunjoUI Library Foundations
> (#8)`.

Figma export:

- `ShareModal / Section`: `228:2`
- `ShareModal` component: `228:5`
- Placement: `Overlay` page, after `Modal / Section`, at `(40, 19820)`,
  `1280 x 2460`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, generated
  contract, ShareData / ShareableItem API notes, public-link toggle behavior,
  URL copy/open actions, private disabled reason tooltip treatment, docs state
  specimens for public, private, and stats usage, runtime token notes, and
  source footer are aligned without visible overlap.

The owner then approved exporting the additional FloatingPanel component data
with:

> I approve exporting the FloatingPanel prop names, default values, and
> behavior (`children`, `className`, `variant="glass"`, `title`,
> `contentClassName`, `dragEnabled=false`, `resizable=false`, `minWidth=220`,
> `minHeight=140`, `dragHandleClassName`, and HTMLMotionProps-derived `drag`,
> `dragListener`, `dragMomentum`, and `style`), generated variant name
> (`glass`) and default variant (`glass`), runtime variant values (`glass`,
> `solid`, and `ghost`), framer-motion `initial` / `animate` / `exit` /
> `transition` structure, spring stiffness 300 and damping 30, `useDragControls`
> header drag behavior, title-bar drag handle, `dragListener` suppression,
> `dragMomentum=false` default, resizable `minWidth` / `minHeight` style,
> `resize` class, bottom-right resize handle, dimensions and layout, variant
> styles, docs-derived state taxonomy and sample copy, Tooltip / Icon / Dialog /
> Popover related composition information, and token names and values
> (`background`, `foreground`, `border`, `muted`, `muted-foreground`,
> `primary`, `ring`, `secondary`, `accent`, `card`, and `card-foreground`)
> from this private pre-public repository to the Figma file `GunjoUI Library
> Foundations (#8)`.

Figma export:

- `FloatingPanel / Section`: `232:2`
- `FloatingPanel` component: `232:5`
- Placement: `Overlay` page, after `ShareModal / Section`, at `(40, 22320)`,
  `1280 x 2720`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the generated `glass` component specimen,
  runtime `solid` and `ghost` notes, framer-motion and drag/resizable contract,
  title/content anatomy, docs state specimens for canvas, interactive,
  toolbar, status, and solid information panel usage, runtime token notes, and
  source footer are aligned without visible overlap.

The owner then approved exporting the additional MediaLightbox component data
with:

> I approve exporting the MediaLightbox / MediaLightboxLabels prop names,
> default values, and behavior (`open`, `onOpenChange`, `asset`,
> `portalContainer`, `variant`, `labels`, `hasPrevious`, `hasNext`,
> `onPrevious`, `onNext`, `onShare`, `onFavorite`, and `onDetails`), variant
> names (`default` and `compact`) and default variant (`default`), Dialog /
> DialogContent / DialogTitle / DialogDescription full-screen preview
> structure, contained absolute `portalContainer` behavior with animation
> suppression, internal state (`scale=1`, `fitWidth=false`, `rotation=0`,
> `editing=false`) and reset behavior on asset/open changes, zoom range
> `0.5..3.5`, `step=0.1`, zoom percent display, fit width / reset / rotate /
> edit / save behavior, previous / next navigation, share / favorite / details
> actions, `metadataRows` and PopoverContent display, top action toolbar /
> editing toolbar / media viewport / bottom zoom controls structure,
> TooltipButton / Button / Slider / Popover / Icon / AssetCardAsset
> composition information, dimensions and layout, docs-derived state taxonomy
> and sample copy, MediaPickerDialog / AssetCard / Popover / Tooltip related
> information, and token names and values (`overlay`, `foreground`,
> `background`, `border`, `muted`, `muted-foreground`, `primary`,
> `secondary`, `accent`, `ring`, `card`, `card-foreground`, and
> `destructive`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `MediaLightbox / Section`: `235:2`
- `MediaLightbox` component: `235:5`
- Placement: `Overlay` page, after `FloatingPanel / Section`, at
  `(40, 25080)`, `1280 x 2860`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default component specimen, generated
  default/compact variant contract, Dialog containment notes, state reset and
  zoom behavior, metadata popover treatment, top and bottom control anatomy,
  docs state specimens for standard, compact, and portrait asset previews,
  runtime token notes, and source footer are aligned without visible overlap.

The owner then approved exporting the additional MediaPickerDialog component
data with:

> I approve exporting the MediaPickerDialog / MediaPickerDialogLabels prop
> names, default values, and behavior (`open`, `onOpenChange`, `items`,
> `portalContainer`, `variant`, `selectedIds`, `multiSelect`, `labels`, and
> `onConfirm`), variant names (`default` and `compact`) and default variant
> (`default`), Dialog / DialogContent / DialogHeader / DialogTitle /
> DialogDescription / DialogFooter structure, variant width rules, query state
> and search input behavior, lowercase title/type search matching,
> `internalSelectedIds` open-state sync, single-select immediate confirm and
> close behavior, multi-select toggle and footer confirm behavior, confirm
> label count function support, disabled confirm reason Tooltip treatment,
> AssetGrid / AssetCard renderItem structure, `selectionMode` and
> `imageFit="contain"` behavior, empty-state display, dimensions and layout,
> docs-derived state taxonomy and sample copy, AssetGrid / AssetCard / Dialog /
> Input / Tooltip / MediaLightbox related composition information, and token
> names and values (`overlay`, `background`, `foreground`, `card`,
> `card-foreground`, `border`, `input`, `muted`, `muted-foreground`,
> `primary`, `primary-foreground`, `secondary`, `accent`, `ring`, and
> `destructive`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `MediaPickerDialog / Section`: `238:2`
- `MediaPickerDialog` component: `238:5`
- Placement: `Overlay` page, after `MediaLightbox / Section`, at
  `(40, 27980)`, `1280 x 2920`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default multi-select component specimen,
  generated default/compact contract, Dialog header/content/footer anatomy,
  search and selection behavior notes, docs state specimens for multiple
  selection, single selection, compact, and empty usage, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional OnboardingFlow component data
with:

> I approve exporting the OnboardingFlow / OnboardingStep prop names, default
> values, and behavior (`steps`, `currentIndex`, `onCurrentIndexChange`,
> `onComplete`, `canAdvance`, `nextDisabledReason`, `backLabel="Back"`,
> `nextLabel="Continue"`, `completeLabel="Finish"`,
> `progressLabel="Onboarding progress"`, `stepLabel`,
> `backDisabledReason="This is the first step."`, `bodyMinHeight`, and
> `className`; `OnboardingStep` fields `id`, `title`, `description`,
> `content`, and `nextDisabled`), generated variant none and default variant
> none structure, controlled / uncontrolled current index behavior, index
> clamping, missing-step `null` rendering, `nextDisabled` and `canAdvance`
> advance blocking, final-step `onComplete`, step indicator `ol` / `li` /
> `aria-current="step"` / `aria-label` structure, complete / active /
> inactive indicator and connector display, Back / Continue / Finish actions,
> first-step back disabled reason Tooltip, next disabled reason Tooltip,
> dimensions and layout, docs-derived state taxonomy and sample copy,
> FormGroup / FormLabel / FormControl / FormDescription / Input / Switch /
> Button / Tooltip / Stepper related composition information, and token names
> and values (`card`, `card-foreground`, `foreground`, `background`,
> `border`, `muted-foreground`, `muted`, `ring`, `primary`,
> `primary-foreground`, `primary-subtle`, `input`, `secondary`, `popover`,
> and `popover-foreground`) from this private pre-public repository to the
> Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `OnboardingFlow / Section`: `240:2`
- `OnboardingFlow` component: `240:5`
- Placement: `Overlay` page, after `MediaPickerDialog / Section`, at
  `(40, 30940)`, `1280 x 2840`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the no-generated-variants component specimen,
  generated contract, controlled/uncontrolled behavior notes, step indicator
  and disabled-tooltip anatomy, docs state specimens for standard, compact,
  controlled, and complete usage, runtime token notes, and related-component
  usage boundary are aligned without visible overlap.

The owner then approved exporting the additional ChatPanel component data with:

> I approve exporting the ChatPanel / ChatPanelMessage / ChatPanelLabels prop
> names, default values, and behavior (`variant=default`, `title="Assistant"`,
> `description`, `messages`, `onSend`, `onStop`, `isProcessing=false`,
> `placeholder`, `enableAttachments=true`, `emptyState`, `welcome`,
> `onMessageAction`, `onClose`, `labels`, `inputLabels`, and `className`;
> `ChatPanelMessage` as `id` plus `ChatMessageProps`; `labels.close`
> default `"閉じる"` and `labels.empty` default
> `"まだメッセージはありません。"`), variant names (`default` and
> `compact`) and default variant (`default`), variant height rules
> (`default` `h-[560px]`, `compact` `h-[420px]`), `messageScrollRef`
> requestAnimationFrame scroll-to-bottom behavior, prefers-reduced-motion
> auto-scroll behavior, section / header / message area / footer structure,
> optional close TooltipButton, render priority from messages to welcome to
> emptyState to default EmptyState, processing typing ChatMessage treatment,
> ChatMessage / ChatInput / EmptyState / TooltipButton / ToastProvider
> composition information, ChatInput prop forwarding, message action
> forwarding with `defaultPrevented` checks, dimensions and layout,
> docs-derived state taxonomy and sample copy, Drawer / Dialog / FloatingPanel
> / ChatMessage / ChatInput / EmptyState / ToastProvider related composition
> information, and token names and values (`background`, `foreground`,
> `border`, `muted`, `muted-foreground`, `input`, `ring`, `primary`,
> `primary-foreground`, `primary-strong`, `primary-subtle`,
> `primary-border`, `accent`, `destructive`, `popover`,
> `popover-foreground`, and `success`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ChatPanel / Section`: `242:2`
- `ChatPanel` component: `242:5`
- Placement: `Overlay` page, after `OnboardingFlow / Section`, at
  `(40, 33820)`, `1280 x 2920`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default and compact variant contract,
  message-scroll behavior notes, header / message area / footer anatomy,
  ChatInput forwarding, docs state specimens for default, empty, welcome, and
  compact usage, runtime token notes, and related-component usage boundary are
  aligned without visible overlap.

The owner then approved exporting the additional ChatInput component data with:

> I approve exporting the ChatInput / ChatInputLabels / ChatInputModelOption
> prop names, default values, and behavior (`onSend`, `onStop`,
> `isProcessing=false`, `placeholder="メッセージを入力..."`,
> `enableAttachments=true`, `showOptionsButton=true`,
> `showModelSelector=true`, `showVoiceButton=true`, `toolbarAccessory`,
> `modelLabel`, `optionsContent`, `modelOptions`, `modelValue`,
> `defaultModelValue`, `voiceActive`, `defaultVoiceActive`, and `labels`),
> variant names (`default` and `processing`) and default variant (`default`),
> processing state `border-primary-border` / `bg-primary-subtle` treatment,
> internal `message`, `files`, `options`, `model`, and `voice` state,
> textarea auto-resize behavior, Enter-to-send and IME composition guard,
> file attachment preview and remove action, send disabled reason Tooltip,
> stop action, Popover / DropdownMenu / Tooltip / Button / Textarea /
> VoiceInputButton composition structure, docs-derived state taxonomy and
> sample copy, ChatPanel / ChatComposer related usage boundaries, and token
> names and values (`background`, `foreground`, `input`, `ring`, `primary`,
> `primary-foreground`, `primary-strong`, `primary-subtle`,
> `primary-border`, `muted`, `muted-foreground`, `accent`, `border`,
> `popover`, `popover-foreground`, `destructive`,
> `destructive-foreground`, and `secondary`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ChatInput / Section`: `245:13`
- `ChatInput` component: `245:20`
- Placement: `Inputs` page, after `Textarea / Section`, at `(40, 9080)`,
  `1280 x 2520`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default and processing variant contract,
  Textarea / toolbar / attachment preview anatomy, Enter / IME / disabled
  Tooltip behavior notes, docs state specimens for default, processing,
  disabled, attachment, and ChatComposer boundary usage, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional ChatMessage component data
with:

> I approve exporting the ChatMessage / ChatMessageActions /
> ChatMessageAction / ChatMessageLabels prop names, default values, and
> behavior (`variant`, `role`, `content`, `copyValue`, `typingMessages`,
> `avatarSrc`, `userName`, `timestamp`, `isTyping=false`, `actions`,
> `showActions=true`, `onAction`, `labels`, and `className`;
> `ChatMessageActions` fields `actions`, `align="start"`, and `onAction`),
> variant names (`assistant`, `user`, `system`, and `typing`) and default
> variant (`assistant`), role values (`assistant`, `user`, and `system`) and
> variant resolution rules (`typing` when `isTyping` is true, otherwise
> `role`), system message centered helper-label structure, assistant / user
> avatar, name, timestamp, message body, and action footer structure, user
> right-aligned filled bubble treatment, assistant unframed body treatment,
> default actions (assistant: `copy`, `branch`, `raw`; user: `copy`,
> `edit`), `copyValue` / `navigator.clipboard` fallback, disabled action
> `preventDefault`, `typingMessages` type/delete animation, caret display,
> prefers-reduced-motion behavior, docs-derived state taxonomy and sample
> copy, Avatar / TooltipButton / ToastProvider / ChatInput / ChatPanel
> related composition and usage boundaries, and token names and values
> (`background`, `foreground`, `muted`, `muted-foreground`, `border`,
> `accent`, `primary`, `primary-foreground`, `primary-border`, `ring`,
> `popover`, `popover-foreground`, and `success`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ChatMessage / Section`: `247:2`
- `ChatMessage` component: `247:9`
- Placement: `Display` page, after `Img / Section`, at `(40, 22558)`,
  `1280 x 2600`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the assistant, user, system, and typing variant
  contract, Avatar / message body / action footer anatomy, copy / disabled
  action / typing animation behavior notes, docs state specimens for
  assistant, user, card-content, system, and typing usage, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional ChatComposer component data
with:

> I approve exporting the ChatComposer / ChatComposerLabels prop names,
> default values, and behavior (`variant`, `inputProps`, `context`, `prompt`,
> `status`, `footer`, `accessory`, `labels`, and `className`;
> `labels.context`, `labels.prompt`, and `labels.status`), variant names
> (`default`, `context`, and `prompt`) and default variant (`default`), root
> `section` structure (`inline-flex`, `w-full`, `flex-col`, `items-center`,
> `gap-3`, and `[&>*]:w-full`), context / prompt / status `aria-label`
> wrapper structure, accessory relative wrapper / `pt-6` /
> `pointer-events-none absolute right-8 top-0 z-10` placement, ChatInput
> `inputProps` forwarding, footer slot structure, docs-derived state taxonomy
> and sample copy, ChatInput / Popover / Tooltip / Switch / Button /
> ChatPanel / ChatMessage related composition and usage boundaries, and token
> names and values (`background`, `foreground`, `muted`, `muted-foreground`,
> `border`, `input`, `ring`, `primary`, `primary-foreground`,
> `primary-subtle`, `primary-subtle-foreground`, `primary-border`, `popover`,
> `popover-foreground`, `secondary`, `accent`, and `card`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ChatComposer / Section`: `250:13`
- `ChatComposer` component: `250:20`
- Placement: `Inputs` page, after `ChatInput / Section`, at `(40, 11648)`,
  `1280 x 2660`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default, context, and prompt variant
  contract, context / prompt / status / footer / accessory slot anatomy,
  ChatInput forwarding and accessory overlay behavior notes, docs state
  specimens for choices, workspace, and accessory usage, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional Label component data with:

> I approve exporting the Label prop names and behavior (`LabelProps extends
> React.LabelHTMLAttributes<HTMLLabelElement>`, including `htmlFor`,
> `children`, `className`, and label HTML attributes), generated variant none
> and default variant none, dimensions and typography (`text-sm`,
> `font-medium`, `leading-none`, and `text-foreground`), disabled peer
> treatment (`peer-disabled:cursor-not-allowed` and
> `peer-disabled:opacity-70`), docs-derived state taxonomy and sample copy,
> FormLabel / FormGroup / FormControl / Input / Checkbox / RadioGroup related
> composition and usage boundaries, and token names and values (`foreground`,
> plus `background`, `muted`, `muted-foreground`, `border`, `input`, and
> `ring` for specimen annotation) from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Label / Section`: `253:13`
- `Label` component: `253:20`
- Placement: `Inputs` page, after `ChatComposer / Section`, at `(40, 14356)`,
  `1280 x 1760`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the no-generated-variant contract, Label HTML
  attribute prop structure, typography and disabled peer-state treatment, docs
  state specimens for input labels, inline checkbox labels, and radio option
  labels, runtime token notes, and related-component usage boundary are aligned
  without visible overlap.

The owner then approved exporting the additional RangeSlider component data
with:

> I approve exporting the RangeSlider prop names, default values, and behavior
> (`value`, `defaultValue`, `onValueChange`, `min=0`, `max=100`, `step=1`,
> `minLabel="Minimum value"`, `maxLabel="Maximum value"`, `disabled`,
> `trackClassName`, `rangeClassName`, `thumbClassName`, and `className`;
> `Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">`
> structure), variant name (`default`) and default variant (`default`),
> controlled / uncontrolled state, `clamp` / `roundToStep` / min-max
> normalization, two `input type="range"` lower / upper thumb structure,
> dimensions and layout, disabled `pointer-events-none opacity-50` treatment,
> docs-derived state taxonomy and sample copy, FormGroup / FormLabel /
> FormControl / FormDescription / HStack / NumberInput / DisabledReasonTooltip
> / Slider / FilterButton related composition and usage boundaries, and token
> names and values (`primary`, `foreground`, `background`, `input`, `muted`,
> `muted-foreground`, `border`, and `ring`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `RangeSlider / Section`: `256:13`
- `RangeSlider` component: `256:20`
- Placement: `Inputs` page, after `Label / Section`, at `(40, 16164)`,
  `1280 x 2240`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default variant contract, controlled /
  uncontrolled value behavior notes, two-thumb `input type="range"` anatomy,
  track / range / thumb token styling, docs state specimens for bounded range,
  step size, linked inputs, and disabled usage, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional ToggleGroup component data
with:

> I approve exporting the ToggleGroup / ToggleGroupItem prop names, default
> values, and behavior (Radix ToggleGroup Root / Item
> `ComponentPropsWithoutRef` structure, `type="single" | "multiple"`,
> `value`, `defaultValue`, `onValueChange`, `disabled`, `variant`, `size`,
> `disallowEmpty`, `className`, `children`, and ToggleGroupItem `value`,
> `aria-label`, `disabled`, `variant`, and `size`), variant names (`default`
> and `outline`) and default variant (`default`), size values (`default`,
> `sm`, and `lg`) and default size (`default`), root and item layout /
> typography, default / outline variant styles, selected state, disabled
> state, focus ring, `disallowEmpty` empty-selection blocking, root
> variant/size inheritance via ToggleGroupContext, docs-derived state taxonomy
> and sample copy, Tooltip / TooltipTrigger / TooltipContent / Toggle /
> TooltipButton / Button related composition and usage boundaries, and token
> names and values (`secondary`, `foreground`, `muted`, `muted-foreground`,
> `input`, `ring`, `background`, `primary`, `primary-foreground`,
> `primary-subtle`, `primary-subtle-foreground`, and `border`) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `ToggleGroup / Section`: `258:13`
- `ToggleGroup` component: `258:22`
- Placement: `Inputs` page, after `RangeSlider / Section`, at `(40, 18452)`,
  `1280 x 2320`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the default and outline variant contract, size
  and root inheritance notes, selected / disabled / focus state token styling,
  `disallowEmpty` behavior note, docs state specimens for multiple, single,
  outline, and disabled usage, runtime token notes, and related-component usage
  boundary are aligned without visible overlap.

The owner then approved exporting the additional Toggle component data with:

> I approve exporting the Toggle prop names, default values, and behavior
> (Radix Toggle Root `ComponentPropsWithoutRef` structure, `pressed`,
> `defaultPressed`, `onPressedChange`, `disabled`, `aria-label`, `children`,
> and `className`; CVA `VariantProps<typeof toggleVariants>` `variant` and
> `size`), generated no-variant and no-default-variant structure, runtime
> variant values (`default` and `outline`) and default variant (`default`),
> size values (`default`, `sm`, and `lg`) and default size (`default`), base
> layout and typography, size dimensions, default / outline variant styles,
> pressed state, hover / focus-visible ring, disabled state, disabled pressed
> `primary-subtle` treatment, docs-derived state taxonomy and sample copy,
> Tooltip / TooltipTrigger / TooltipContent / ToggleGroup / TooltipButton /
> Button related composition and usage boundaries, and token names and values
> (`muted`, `muted-foreground`, `input`, `ring`, `background`, `foreground`,
> `primary`, `primary-foreground`, `primary-subtle`,
> `primary-subtle-foreground`, `accent`, `accent-foreground`, and `border`)
> from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Toggle / Section`: `261:13`
- `Toggle` component: `261:20`
- Placement: `Inputs` page, after `ToggleGroup / Section`, at `(40, 20820)`,
  `1280 x 2300`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`;
  screenshot review confirmed the no-generated-variant contract, runtime
  default / outline variant and size structure, pressed / disabled /
  focus-visible state token styling, docs state specimens for default,
  pressed, outline, size, and disabled usage, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional NumberInput component data
with:

> I approve exporting the NumberInput prop names, default values, and behavior
> (`value`, `onValueChange`, `min`, `max`, `step=1`,
> `incrementLabel="Increment"`, `decrementLabel="Decrement"`,
> `layout="spinner"`, `disabled`, `onBlur`, and `className`;
> `Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" |
> "type">` structure), generated no-variant and no-default-variant structure,
> runtime layout values (`spinner` and `stepper`) and default layout
> (`spinner`), controlled value and draft string state, `clamp` min/max
> normalization, `step` adjustment, `atMin` / `atMax` button-disabled
> behavior, native `<input type="number">` and `inputMode` behavior, spinner
> and stepper layout anatomy, dimensions, border, focus ring, disabled opacity,
> IconChevronUp / IconChevronDown / IconMinus / IconPlus composition,
> docs-derived state taxonomy and sample copy, FormGroup / FormLabel /
> FormControl / FormDescription / DisabledReasonTooltip / Input / Button /
> RangeSlider / Slider / Form related composition and usage boundaries, and
> token names and values (`input`, `ring`, `muted`, `muted-foreground`,
> `background`, `foreground`, and `border`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `NumberInput / Section`: `265:13`
- `NumberInput` component: `265:20`
- Placement: `Inputs` page, after `Toggle / Section`, at `(40, 23168)`,
  `1280 x 2380`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, runtime spinner / stepper layout structure, draft state / clamp /
  step behavior notes, docs state specimens for min/max, step size, disabled,
  and stepper usage, runtime token notes, and related-component usage boundary
  are aligned without visible overlap.

The owner then approved exporting the additional PasswordInput component data
with:

> I approve exporting the PasswordInput prop names, default values, and
> behavior (`show`, `onShowChange`, `showLabel="Show password"`,
> `hideLabel="Hide password"`, `inputClassName`, `className`, `disabled`, no
> `children`, and `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">`
> structure with standard input attributes), generated no-variant and
> no-default-variant structure, runtime display states (`masked` and
> `visible`) and default state (`masked`), controlled / uncontrolled show
> state, toggle-button `type="password"` / `type="text"` switching,
> `onShowChange` notification, button `tabIndex={-1}` and `aria-label`
> structure, wrapper `data-slot="password-input"` and disabled treatment,
> input dimensions, padding, `pr-10`, border, shadow, placeholder,
> focus-visible ring, `aria-invalid` destructive-border treatment, visibility
> button positioning and hover treatment, IconEye / IconEyeOff composition,
> docs-derived state taxonomy and sample copy, FormGroup / FormLabel /
> FormControl / FormDescription / DisabledReasonTooltip / Input / Button /
> Tooltip / TooltipButton / PasswordGroup / PasswordRequirementList /
> PasswordStrengthMeter related composition and usage boundaries, and token
> names and values (`input`, `ring`, `muted-foreground`, `foreground`,
> `background`, `border`, `destructive-border`, and `muted`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `PasswordInput / Section`: `268:13`
- `PasswordInput` component: `268:20`
- Placement: `Inputs` page, after `NumberInput / Section`, at `(40, 25596)`,
  `1280 x 2300`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, runtime masked / visible state structure, controlled /
  uncontrolled visibility notes, type switching and aria-label behavior,
  invalid / disabled treatment, docs state specimens for masked, visible,
  disabled, and aria-invalid usage, runtime token notes, and related-component
  usage boundary are aligned without visible overlap.

The owner then approved exporting the additional PasswordRequirementList
component data with:

> I approve exporting the PasswordRequirementList / PasswordRequirement prop
> names, default values, and behavior (`requirements`,
> `metLabel="Requirement met"`, `unmetLabel="Requirement not met"`,
> `pendingLabel="Requirement pending"`, `className`, and
> `React.HTMLAttributes<HTMLUListElement>` structure; PasswordRequirement
> `id`, `label`, `met`, and `description`), generated no-variant and
> no-default-variant structure, spec-derived composition
> (`canonicalLayout="vertical-checklist"`, public part
> `PasswordRequirementList`, and state keys `pending`, `met`, `unmet`), state
> resolution, state-specific icon structure and `aria-label`, root `ul`
> `data-slot="password-requirement-list"` structure, item `li` grid structure,
> icon dimensions, label / description rendering, docs-derived state taxonomy
> and sample copy, PasswordInput validation ownership boundary, PasswordGroup /
> PasswordStrengthMeter / PasswordInput related composition and usage
> boundaries, and token names and values (`success-strong`,
> `destructive-strong`, `muted-foreground`, `foreground`, `background`,
> `border`, and `muted`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

Figma export:

- `PasswordRequirementList / Section`: `270:13`
- `PasswordRequirementList` component: `270:20`
- Placement: `Inputs` page, after `PasswordInput / Section`, at `(40, 27944)`,
  `1280 x 2220`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, vertical checklist composition, pending / met / unmet state
  resolver, IconCheck / IconX / IconCircle state mapping, accessible label
  notes, docs state specimens for mixed, pending, and state-label usage,
  runtime token notes, and related-component usage boundary are aligned without
  visible overlap.

The owner then approved exporting the additional PasswordStrengthMeter component
data with:

> I approve exporting the PasswordStrengthMeter prop names, default values, and
> behavior (`score`, `maxScore=4`, `label="Password strength"`,
> `description`, `valueLabel`, `className`, and
> `React.HTMLAttributes<HTMLDivElement>` structure), generated no-variant and
> no-default-variant structure, spec-derived composition
> (`canonicalLayout="segmented-meter"`, public part `PasswordStrengthMeter`,
> and score range `0..maxScore`), normalized max / score behavior, segment
> array structure, `getStrengthClass(score, maxScore)` ratio thresholds,
> root `div` `data-slot="password-strength-meter"` structure, label/value row,
> meter `role="meter"` and aria structure, segmented bar grid structure,
> description rendering, docs-derived state taxonomy and sample copy, password
> entropy calculation ownership boundary, PasswordGroup /
> PasswordRequirementList / PasswordInput / Progress related composition and
> usage boundaries, and token names and values (`success`, `warning`,
> `destructive`, `muted`, `muted-foreground`, `foreground`, `background`, and
> `border`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `PasswordStrengthMeter / Section`: `273:13`
- `PasswordStrengthMeter` component: `273:20`
- Placement: `Inputs` page, after `PasswordRequirementList / Section`, at
  `(40, 30212)`, `1280 x 2220`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, segmented-meter composition, score normalization notes, success /
  warning / destructive / muted threshold specimens, accessible meter notes,
  docs state specimens for strong, weak, and maxScore usage, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional PasswordGroup component data
with:

> I approve exporting the PasswordGroup prop names, default values, and
> behavior (`id`, `label="Password"`, `description`, `value`, `defaultValue`,
> `onValueChange`, `requirements`, `strengthScore`, `strengthLabel`,
> `strengthDescription`, `strengthValueLabel`, `error`, `disabled`,
> `disabledReason`, `passwordInputProps`, `className`;
> `Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">`
> structure; `passwordInputProps`
> `Omit<PasswordInputProps, "id" | "value" | "defaultValue" | "onChange" |
> "disabled">`), generated no-variant and no-default-variant structure,
> spec-derived composition (`canonicalLayout="vertical-field-group"`, public
> parts `PasswordGroup`, `PasswordInput`, `PasswordRequirementList`,
> `PasswordStrengthMeter`, and `FormGroup`, and `defaultGap=6`), controlled /
> uncontrolled value state, generated id and FormLabel `htmlFor` linkage,
> PasswordInput forwarding, error `aria-invalid` / FormMessage behavior,
> disabledReason Tooltip wrapper behavior, conditional description / strength /
> requirements / error rendering, root `data-slot="password-group"` structure,
> FormGroup layout and password slot width rule, docs-derived state taxonomy
> and sample copy, PasswordGroup vs PasswordInput usage boundary, PasswordInput
> / PasswordRequirementList / PasswordStrengthMeter / Form / Tooltip related
> composition and usage boundaries, and token names and values (`input`, `ring`,
> `success`, `warning`, `destructive`, `destructive-border`, `muted`,
> `muted-foreground`, `foreground`, `background`, and `border`) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `PasswordGroup / Section`: `275:13`
- `PasswordGroup` component: `275:20`
- Placement: `Inputs` page, after `PasswordStrengthMeter / Section`, at
  `(40, 32480)`, `1280 x 2500`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, vertical field group composition, controlled / uncontrolled value
  state, PasswordInput forwarding, disabled reason Tooltip wrapper, conditional
  description / strength / requirements / error rendering, docs state specimens
  for grouped feedback, disabled reason, and simple-input boundary, runtime
  token notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional PhoneInput component data with:

> I approve exporting the PhoneInput prop names, default values, and behavior
> (`value`, `defaultValue`, `onValueChange`, `countryCallingCode="+81"`,
> `countryLabel="Japan"`, `formatValue=formatJapanesePhone`, `disabledReason`,
> `disabled`, `className`, and
> `Omit<InputProps, "type" | "value" | "defaultValue" | "onChange">`
> structure), generated no-variant and no-default-variant structure,
> spec-derived composition (`canonicalLayout="prefix-input"`, public parts
> `PhoneInput` and `Input`, and `controlHeight=36`), controlled /
> uncontrolled value state, `formatJapanesePhone` digit extraction, 11-digit
> cap, and 3-4-4 grouping, Input forwarding (`type="tel"`,
> `inputMode="tel"`, `value`, `onChange`, and `disabled`), country calling-code
> prefix and sr-only `countryLabel` structure, disabledReason Tooltip wrapper
> behavior, dimensions and layout, docs-derived state taxonomy and sample copy,
> PhoneInput / Input / PostalCodeInput usage boundary, Input / Form / Tooltip /
> PostalCodeInput related composition and usage boundaries, and token names and
> values (`input`, `ring`, `muted-foreground`, `foreground`, `background`,
> `border`, and `muted`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

Figma export:

- `PhoneInput / Section`: `281:13`
- `PhoneInput` component: `281:20`
- Placement: `Inputs` page, after `PasswordGroup / Section`, at `(40, 35028)`,
  `1280 x 2300`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, prefix-input composition, controlled / uncontrolled value state,
  Japanese phone formatting notes, Input forwarding, country calling-code prefix
  and accessible country label structure, disabled reason Tooltip wrapper, docs
  state specimens for standard, disabled, and formatter hook usage, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional PostalCodeInput component data
with:

> I approve exporting the PostalCodeInput prop names, default values, and
> behavior (`value`, `defaultValue`, `onValueChange`, `prefix="〒"`,
> `formatValue=formatJapanesePostalCode`, `disabledReason`, `disabled`,
> `className`, and
> `Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" |
> "prefix">` structure), generated no-variant and no-default-variant
> structure, spec-derived composition (`canonicalLayout="prefix-input"`, public
> parts `PostalCodeInput` and `Input`, and `controlHeight=36`), controlled /
> uncontrolled value state, `formatJapanesePostalCode` digit extraction,
> 7-digit cap, and 3-4 grouping, Input forwarding (`type="text"`,
> `inputMode="numeric"`, `value`, `onChange`, and `disabled`), prefix display
> structure, disabledReason Tooltip wrapper behavior, dimensions and layout,
> docs-derived state taxonomy and sample copy, PostalCodeInput / PhoneInput /
> Input usage boundary, address lookup / autofill composition boundary, Input /
> Form / Tooltip / PhoneInput related composition and usage boundaries, and token
> names and values (`input`, `ring`, `muted-foreground`, `foreground`,
> `background`, `border`, and `muted`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `PostalCodeInput / Section`: `284:13`
- `PostalCodeInput` component: `284:20`
- Placement: `Inputs` page, after `PhoneInput / Section`, at `(40, 37376)`,
  `1280 x 2300`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, prefix-input composition, controlled / uncontrolled value state,
  Japanese postal-code formatting notes, Input forwarding, prefix display
  structure, disabled reason Tooltip wrapper, docs state specimens for standard,
  without-prefix, and disabled reason usage, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional SearchInput component data with:

> I approve exporting the SearchInput prop names, default values, and behavior
> (`value`, `onValueChange`, `clearable=true`, `clearLabel="Clear search"`,
> `disabled`, `placeholder="Search..."`, `className`, and
> `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">`
> structure), generated no-variant and no-default-variant structure,
> spec-derived description (`Input with leading search icon for search bars`)
> and `variants=[]` structure, `showClear` resolution
> (`clearable && !!value && !disabled`), input forwarding (`type="search"`,
> `value ?? ""`, `onChange -> onValueChange`, `disabled`, and `placeholder`),
> WebKit search cancel button hiding, leading IconSearch and clear IconX display
> structure, clear button `onClick -> onValueChange("")`, `aria-label`, Tooltip
> structure, disabled root treatment and docs-side DisabledReasonTooltip
> composition, dimensions and layout, docs-derived state taxonomy and sample
> copy, SearchInput / Input / Combobox / Command / FilterButton usage boundary,
> Input / Button / FormGroup / Tooltip / DisabledReasonTooltip / Combobox /
> Command / FilterButton related composition and usage boundaries, and token
> names and values (`input`, `ring`, `muted-foreground`, `foreground`,
> `background`, `border`, and `muted`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `SearchInput / Section`: `286:13`
- `SearchInput` component: `286:20`
- Placement: `Inputs` page, after `PostalCodeInput / Section`, at
  `(40, 39724)`, `1280 x 2300`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, `variants=[]` structure, leading search icon, clear IconX Tooltip
  behavior, `showClear` states, disabled reason composition, docs state
  specimens for clearable, without-clear, and disabled usage, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

## Next Figma Step

Before creating the next component:

1. Review the Figma file manually.
2. Confirm the Button, TooltipButton, CopyButton, Input, Checkbox, Switch,
   RadioGroup, Select, Slider, Textarea, Badge, Avatar, Separator, Card,
   Accordion, AccordionGroup, List, MarkdownRenderer, MetadataList, Rating,
   RevealSection, SearchableAccordion, Skeleton, Spacer, Statistic,
   SwatchGroup, Table, Kbd, Img, Tabs, Breadcrumb, Pagination, Tooltip,
   Popover, DropdownMenu, Dialog, Sheet, AlertDialog, ContextMenu, Drawer, and
   HoverCard, Modal, ShareModal, FloatingPanel, MediaLightbox, and
   MediaPickerDialog, OnboardingFlow, ChatPanel, ChatInput, ChatMessage, and
   ChatComposer, Label, RangeSlider, ToggleGroup, Toggle, NumberInput,
   PasswordInput, PasswordRequirementList, PasswordStrengthMeter, and
   PasswordGroup, PhoneInput, PostalCodeInput, and SearchInput components,
   runtime semantic colors, and specimen treatments are acceptable.
3. Continue with the core component sequence from
   `docs/figma-library-discovery.md`, one component/family at a time.

Do not publish the Figma library until the owner has reviewed the file manually.
