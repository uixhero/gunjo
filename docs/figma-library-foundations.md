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

The owner then approved exporting the additional InputOTP component family data
with:

> I approve exporting the InputOTP / InputOTPGroup / InputOTPSlot /
> InputOTPSeparator prop names, default values, and behavior (InputOTP
> `input-otp` OTPInput `ComponentPropsWithoutRef` structure, `maxLength`,
> `value`, `onChange`, `disabled`, `className`, `containerClassName`, and
> `children`; InputOTPGroup `div` props; InputOTPSlot `div` props plus required
> `index`; InputOTPSeparator `div` props), generated no-variant and
> no-default-variant structure, spec-derived description
> (`One-time-password input with per-digit slots and optional separator`) and
> `variants=[]` structure, OTPInputContext slot state resolution (`char`,
> `hasFakeCaret`, `isActive`), InputOTP root `containerClassName` and
> `data-slot="input-otp"` structure, InputOTPSlot dimensions and active state,
> fake caret rendering, InputOTPSeparator `role="separator"` and IconMinus
> structure, docs-derived state taxonomy and sample copy, disabled Tooltip /
> DisabledReasonTooltip composition, InputOTP / Input / PasswordInput /
> NumberInput usage boundary, Input / PasswordInput / Form / NumberInput /
> Tooltip related composition and usage boundaries, and token names and values
> (`input`, `ring`, `foreground`, `muted-foreground`, `background`, `border`,
> and `muted`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `InputOTP / Section`: `289:13`
- `InputOTP` component: `289:20`
- Placement: `Inputs` page, after `SearchInput / Section`, at `(40, 42072)`,
  `1280 x 2380`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, `variants=[]` structure, InputOTP / Group / Slot / Separator
  composition, OTPInputContext slot-state notes, grouped and continuous slot
  layouts, active ring and fake caret treatment, disabled reason composition,
  docs state specimens for grouped, continuous, and disabled usage, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional Calendar component data with:

> I approve exporting the Calendar prop names, default values, and behavior
> (React DayPicker `ComponentProps` plus `holidays=japaneseHolidays`,
> `showHolidays=false`, `showWeekendStyle=true`, `disabledReason`,
> `getDisabledReason`, `disabledReasonLabel`, `disabledReasonPortalContainer`,
> `locale=ja`, `showOutsideDays=true`, `captionLayout="dropdown"`,
> `fixedWeeks=true`, default start and end month range, `className`,
> `classNames`, `components`, `modifiers`, `modifiersClassNames`, `formatters`,
> `labels`, and DayPicker props including `mode`, `selected`, `onSelect`,
> `disabled`, and `numberOfMonths`), default variant structure, spec-derived
> `Calendar/Default` frame structure, docs-derived selection modes,
> `holidayMatcher`, `calendarDateKey`, `japaneseHolidays`, Japanese locale
> labels and year dropdown formatter, DayButton disabled reason Tooltip wrapper,
> weekend / holiday modifiers and class names, dimensions and layout,
> docs-derived state taxonomy and sample copy, Calendar / DatePicker /
> DateRangePicker / Popover / Form usage boundaries, DatePicker /
> DateRangePicker / Popover / Form / Tooltip related composition and usage
> boundaries, and token names and values (`card`, `foreground`,
> `muted-foreground`, `input`, `border`, `ring`, `primary`,
> `primary-foreground`, `primary-border`, `accent`, `accent-foreground`, `info`,
> `info-foreground`, `destructive`, `background`, and `muted`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Calendar / Section`: `291:13`
- `Calendar` component: `291:20`
- Placement: `Inputs` page, after `InputOTP / Section`, at `(40, 44500)`,
  `1280 x 3140`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the default variant
  contract, `Calendar/Default` frame structure, DayPicker prop/default notes,
  Japanese locale labels, weekend / holiday / disabled reason behavior, single /
  multiple / range / disabled-past specimens, runtime token notes, and related
  component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional FilterButton component data
with:

> I approve exporting the FilterButton / FilterOption prop names, default values,
> and behavior (`title="Filter"`, `icon`, `options=[]`,
> `selectedValues=new Set()`, `onFilterChange`, `clearLabel="Clear filters"`,
> `selectedLabel`, `contentClassName`, `contentAlign="start"`,
> `portalContainer`, `children`, inherited `ButtonProps`, `variant="outline"`,
> and `size="sm"`), variant names (`default`, `selected`, `popover`) and default
> variant (`default`), `selectedValues` and `isOpen` triggerVariant resolution,
> selection toggle and clear filters behavior, Popover / PopoverTrigger /
> PopoverContent / Command / CommandGroup / CommandItem / CommandList / Badge /
> Button / IconFilter / IconCheck composition structure, spec-derived
> `FilterButton/Default`, `FilterButton/Selected`, and
> `FilterButton/Popover` frame structures, dimensions and layout, docs-derived
> state taxonomy and sample copy, custom content and selected count badge
> display structure, FilterButton / Button / Badge / Popover / Command related
> composition and usage boundaries, and token names and values (`foreground`,
> `background`, `border`, `input`, `primary`, `primary-foreground`,
> `primary-border`, `primary-subtle`, `primary-subtle-foreground`, `secondary`,
> `secondary-foreground`, `muted`, `muted-foreground`, `popover`,
> `popover-foreground`, and `ring`) from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `FilterButton / Section`: `295:13`
- `FilterButton` component: `295:20`
- Placement: `Inputs` page, after `Calendar / Section`, at `(40, 47688)`,
  `1280 x 2540`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the default / selected /
  popover state contract, runtime triggerVariant resolution, spec-derived
  trigger and popover frame structures, Command list and checked item treatment,
  selected count badge, custom content specimen, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional SortButton component data with:

> I approve exporting the SortButton prop names, default values, and behavior
> (`value=sortButtonDefaultVariantKey`, `onSortChange`, `label="Sort"`,
> `variant="ghost"`, `size="sm"`, and inherited
> `Omit<ButtonProps, "onChange">`), variant names (`none`, `asc`, `desc`) and
> default variant (`none`), click cycling in `sortButtonVariantKeys` order
> (`none -> asc -> desc -> none`), icon resolution by value
> (IconArrowsSort / IconSortAscendingLetters / IconSortDescendingLetters),
> Button props forwarding and className composition, dimensions and layout,
> spec-derived `SortButton/None`, `SortButton/Asc`, and `SortButton/Desc` frame
> structures, docs-derived state taxonomy and sample copy, DisabledReasonTooltip
> composition, FilterButton / Table / Command / Button usage boundaries, and
> token names and values (`foreground`, `background`, `muted`,
> `muted-foreground`, `accent`, `accent-foreground`, `border`, `input`, `ring`,
> `primary`, `primary-foreground`, `secondary`, and `secondary-foreground`) from
> this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `SortButton / Section`: `298:13`
- `SortButton` component: `298:20`
- Placement: `Inputs` page, after `FilterButton / Section`, at `(40, 50276)`,
  `1280 x 2280`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the none / asc / desc
  state contract, click cycle behavior, icon resolution mapping, spec-derived
  frame structures, disabled reason tooltip composition, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional EditableField component data
with:

> I approve exporting the EditableField / EditableFieldLabels prop names, default
> values, and behavior (`label`, `value`, `onSave`, `labels`,
> `placeholder="-"`, `minRows=1`, `maxRows=3`, `fieldClassName`,
> `inputClassName`, `disabled`, `error`, `className`, and
> `Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">`
> structure), variant name (`default`) and default variant (`default`),
> spec-derived synthetic default structure, read mode / edit mode / saving /
> error / empty value state structure, editing and draft state behavior, value
> change draft synchronization, commit behavior (`draft.trim()`, async
> `onSave`, rejected saves keeping edit mode open, and saving-disabled actions),
> textarea auto-height calculation, read surface and edit Textarea same-footprint
> behavior, IconPencil edit action, Tooltip / Button / Textarea / Toast
> composition structure, dimensions and layout, docs-derived state taxonomy and
> sample copy, Input / Textarea / FormField / AssetInspectorPanel / Button /
> Tooltip / Toast usage boundaries, and token names and values (`foreground`,
> `background`, `muted`, `muted-foreground`, `border`, `input`, `ring`,
> `destructive`, `destructive-border`, `primary`, `primary-foreground`,
> `secondary`, and `secondary-foreground`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `EditableField / Section`: `300:13`
- `EditableField` component: `300:20`
- Placement: `Inputs` page, after `SortButton / Section`, at `(40, 52604)`,
  `1280 x 2960`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the synthetic default
  contract, read / edit / saving / error / empty state specimens, same-footprint
  read and edit surfaces, textarea auto-height notes, Tooltip edit action,
  Button / Textarea / Toast composition, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The owner then approved exporting the additional Form component family data with:

> I approve exporting the Form / FormField / FormGroup / FormLabel /
> FormControl / FormDescription / FormMessage / useFormField prop names, default
> values, and behavior, generated no-variant and no-default-variant structure,
> spec-derived composition (`canonicalLayout="vertical-field-group"`, public
> parts, `controlHeight=36`, `defaultGap=6`, `fieldGap=16`, and
> `fullWidthControlSlots`), FormFieldContext `id`, `descriptionId`,
> `messageId`, `error`, and `required` structure, `React.useId` control id
> generation, `containsElementType` behavior for reserving `descriptionId` only
> when `FormDescription` is present, FormControl child clone forwarding for
> `id`, `aria-describedby`, `aria-invalid`, and `aria-required`, FormLabel
> `htmlFor` linkage, required star, and destructive error text, FormMessage
> error-first rendering, `role="alert"`, and null rendering without body, Form /
> FormField / FormGroup layout classes, FormGroup full-width `data-slot` control
> rules, docs-derived state taxonomy and sample copy, Button / Input / Textarea /
> Spinner / Tooltip composition, Input / Textarea / Select / Button usage
> boundaries, and token names and values (`foreground`, `muted-foreground`,
> `destructive`, `background`, `muted`, `border`, `input`, `ring`, `primary`,
> `primary-foreground`, `secondary`, and `secondary-foreground`) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Form / Section`: `303:13`
- `Form` component: `303:20`
- Placement: `Inputs` page, after `EditableField / Section`, at `(40, 55612)`,
  `1280 x 2940`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, vertical field group composition, FormFieldContext and ARIA wiring
  notes, full-width slot rules, client-validation and pending-submit specimens,
  runtime token notes, and related-component usage boundary are aligned without
  visible overlap.

The owner then approved exporting the additional Combobox component data with:

> I approve exporting the Combobox / ComboboxOption prop names, default values,
> and behavior (`options`, `value`, `onValueChange`,
> `placeholder="Select option..."`, `searchPlaceholder="Search..."`,
> `searchClearLabel="Clear search"`, `emptyMessage="No option found."`,
> `clearable=true`, `clearLabel="Clear selection"`, `disabled`,
> `triggerClassName`, `className`, `aria-*`, and `required`), generated
> no-variant and no-default-variant structure, Popover + Command + Button +
> Tooltip composition, trigger `role="combobox"`, `aria-expanded`,
> `aria-invalid`, `aria-describedby`, `aria-labelledby`, `aria-label`, and
> `aria-required` structure, selection, clear, search, empty state, grouped
> options, and disabled option / `disabledReason` tooltip behavior, dimensions
> and layout, docs-derived state taxonomy and sample copy, Select /
> CommandPalette / DropdownMenu / Form usage boundaries, and token names and
> values (`background`, `foreground`, `popover`, `popover-foreground`, `muted`,
> `muted-foreground`, `accent`, `accent-foreground`, `border`, `input`, `ring`,
> `primary`, `primary-foreground`, and `destructive-border`) from this private
> pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Combobox / Section`: `305:13`
- `Combobox` component: `305:14`
- Placement: `Inputs` page, after `Form / Section`, at `(40, 58600)`,
  `1280 x 3060`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, trigger and popover anatomy, clearable selected-value affordance,
  grouped options, disabled-option tooltip reason, empty state, ARIA forwarding,
  runtime token notes, and related-component usage boundary are aligned without
  visible overlap.

The owner then approved exporting the additional DatePicker component data with:

> I approve exporting the DatePicker prop names, default values, and behavior
> (`id`, `value`, `onValueChange`, `placeholder="yyyy-mm-dd"`,
> `dateFormat="yyyy-MM-dd"`, `editable=true`, `disabled`, `locale`,
> `calendarLabel="Open calendar"`, `todayLabel`, `previousLabel`,
> `showTodayButton=true`, `closeOnSelect=true`, `disabledDates`, `modifiers`,
> `modifiersClassNames`, `startMonth`, `endMonth`, `getDisabledReason`,
> `disabledReason`, `disabledReasonLabel`, `disabledReasonPortalContainer`,
> `className`, and `triggerClassName`), generated no-variant and
> no-default-variant structure, Popover + Input + Button + Calendar + Tooltip
> composition, `data-slot="date-picker"`, PopoverAnchor, PopoverTrigger, and
> PopoverContent `align="end"` / `sideOffset=8` structure, direct
> `yyyy-MM-dd` input formatting, `parseIsoDate`, invalid reset, segment
> stepping and navigation keyboard behavior, Enter commit, Calendar single
> selection, `closeOnSelect`, today and previous shortcuts, `disabledDates`, and
> disabled reason tooltip behavior, dimensions and layout, docs-derived state
> taxonomy and sample copy, Button / Calendar / Popover / Tooltip / Form
> composition, DateRangePicker / Calendar / Form / TimePicker usage boundaries,
> and token names and values (`background`, `foreground`, `card`,
> `card-foreground`, `popover`, `popover-foreground`, `muted`,
> `muted-foreground`, `accent`, `accent-foreground`, `border`, `input`, `ring`,
> `primary`, `primary-foreground`, `destructive`, and `destructive-border`) from
> this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `DatePicker / Section`: `307:13`
- `DatePicker` component: `307:27`
- Placement: `Inputs` page, after `Combobox / Section`, at `(40, 61708)`,
  `1280 x 3560`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, input + calendar button anatomy, Calendar popover, today and
  previous shortcuts, selected / empty / persistent / disabled-date / disabled /
  invalid-input state specimens, keyboard and parsing behavior notes, runtime
  token notes, and related-component usage boundary are aligned without visible
  overlap.

The owner then approved exporting the additional DateRangePicker component data
with:

> I approve exporting the DateRangePicker prop names, default values, and
> behavior (`id`, `value`, `onValueChange`,
> `placeholder="yyyy-mm-dd - yyyy-mm-dd"`, `dateFormat="yyyy-MM-dd"`,
> `numberOfMonths=2`, `editable=true`, `disabled=false`, `locale`,
> `calendarLabel="Open calendar"`, `todayLabel`, `previousLabel`,
> `showTodayButton=true`, `closeOnSelect=true`, `maxRangeDays`,
> `responsiveMonths=true`, `className`, and `triggerClassName`), generated
> no-variant and no-default-variant structure, Popover + Input + Button +
> Calendar + Tooltip composition, `data-slot="date-range-picker"`,
> PopoverAnchor, PopoverTrigger, PopoverContent `align="center"` /
> `sideOffset=8`, `onInteractOutside`, and `onOpenAutoFocus` structure, direct
> `yyyy-MM-dd - yyyy-MM-dd` input formatting, `parseRangeInput`,
> `normalizeRange`, validation reasons (`format`, `order`, and `length`),
> validation messages, invalid `aria-invalid`, range segment navigation
> (`fromYear`, `fromMonth`, `fromDay`, `toYear`, `toMonth`, and `toDay`),
> ArrowUp / ArrowDown segment stepping, ArrowLeft / ArrowRight / Tab movement,
> Backspace / Delete digit deletion, Enter commit, Calendar range selection,
> `activeEndpoint`, `activeRangeStart` / `activeRangeEnd` ring, `closeOnSelect`,
> today shortcut, previous shortcut, `responsiveMonths` small-viewport
> one-month behavior, `maxRangeDays` constraints, dimensions and layout,
> docs-derived state taxonomy and sample copy, Button / Calendar / Popover /
> Tooltip / Form composition, DatePicker / Calendar / Form / Combobox usage
> boundaries, and token names and values (`background`, `foreground`, `card`,
> `card-foreground`, `popover`, `popover-foreground`, `muted`,
> `muted-foreground`, `accent`, `accent-foreground`, `border`, `input`, `ring`,
> `primary`, `primary-foreground`, `primary-border`, `info`, `info-border`,
> `destructive`, and `destructive-border`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `DateRangePicker / Section`: `309:13`
- `DateRangePicker` component: `309:27`
- Placement: `Inputs` page, after `DatePicker / Section`, at `(40, 65316)`,
  `1280 x 4382`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, range input anatomy, two-month Calendar popover, active endpoint and
  shortcut footer, selected / empty / persistent / disabled / validation /
  responsive-month state specimens, range parsing and keyboard behavior notes,
  runtime token notes, and related-component usage boundary are aligned without
  visible overlap. The two-month Calendar specimens are stacked vertically where
  needed so they stay inside the 1280 px section without clipping.

The owner then approved exporting the additional TimePicker component data with:

> I approve exporting the TimePicker prop names, default values, and behavior
> (`value`, `onValueChange`, `hour12=false`, `minuteStep=1`, `className`,
> `disabled`, `hourLabel="Hour"`, `minuteLabel="Minute"`,
> `periodLabel="AM/PM"`, and `label="Time"`), generated no-variant and
> no-default-variant structure, 24-hour `HH:mm` value format, empty-string
> unset state, `parse` / `format2` behavior, 12-hour display with AM/PM select,
> `minuteStep` values (`1`, `5`, `10`, `15`, and `30`) and minute options,
> `setHour`, `setMinute`, and `setAmPm` value updates, root `role="group"`,
> `aria-label`, and `data-slot="time-picker"` structure, Clock icon / hour
> select / separator / minute select / optional AM/PM select display structure,
> dimensions and layout, docs-derived state taxonomy and sample copy, FormGroup
> / FormLabel / FormControl / FormDescription / DisabledReasonTooltip
> composition, DatePicker / DateRangePicker / Select / Form usage boundaries,
> and token names and values (`input`, `ring`, `muted-foreground`,
> `foreground`, `background`, `border`, and `muted`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `TimePicker / Section`: `314:13`
- `TimePicker` component: `314:14`
- Placement: `Inputs` page, after `DateRangePicker / Section`, at
  `(40, 69746)`, `1280 x 1895`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, 24-hour default specimen, prop/default contract cards, 24-hour /
  12-hour / 15-minute / disabled / unset state specimens, parse and format
  behavior notes, runtime token notes, and related-component usage boundary are
  aligned without visible overlap.

The owner then confirmed that this internal Figma file is the company's design
system source and that reflecting component specs from this private repository
into that file is the approved SSOT workflow. The next discovery target was then
exported with the additional TagInput component data:

> I approve exporting the TagInput prop names, default values, and behavior
> (`id`, `value`, `onValueChange`, `placeholder="Add tag..."`,
> `commitKeys=["Enter", ","]`, `dedupe=true`, `maxTags`,
> `removeLabel="Remove tag"`, `className`, and `disabled`), generated
> no-variant and no-default-variant structure, controlled `value` array model,
> draft string state, Enter / comma / blur commit behavior, IME composition
> guard, duplicate rejection, max tag limit behavior, Backspace last-tag
> removal, Tag chip removal with `removeLabel`, FormGroup / FormLabel /
> FormControl / FormDescription / DisabledReasonTooltip / Tag composition,
> docs-derived state taxonomy and sample copy, Input / SearchInput / Mention /
> Form / Tag / TagEditor usage boundaries, and token names and values (`input`,
> `ring`, `muted-foreground`, `foreground`, `background`, `border`, `muted`,
> `primary`, and `primary-foreground`) from this private pre-public repository
> to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `TagInput / Section`: `320:13`
- `TagInput` component: `320:14`
- Placement: `Inputs` page, after `TimePicker / Section`, at `(40, 71689)`,
  `1280 x 1606`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, default tagged field specimen, prop/default and behavior contract,
  editable / max-tags / disabled / empty / typing state specimens, keyboard and
  IME behavior notes, runtime token notes, and related-component usage boundary
  are aligned without visible overlap.

The next discovery target was then exported with the additional Mention
component data:

> I approve exporting the Mention prop names, default values, and behavior
> (`value`, `onValueChange`, `trigger="@"`, `options`, `maxSuggestions=6`,
> `disabled`, `placeholder`, `rows=3`, and TextareaHTMLAttributes except
> `value` / `onChange`), generated no-variant and no-default-variant structure,
> MentionOption `id` / `label` / `hint` structure, controlled and uncontrolled
> value handling, trigger query detection at the current cursor, whitespace
> boundary behavior, label filtering and `maxSuggestions` slicing,
> `activeIndex`, `suggestionsDismissed`, `suggestionSide`, and
> `suggestionMaxHeight` state, ArrowUp / ArrowDown / Enter / Tab / Escape
> keyboard behavior, insertMention cursor restore behavior, aria-hidden
> highlight layer, textarea / listbox / option ARIA structure, clipping ancestor
> and content-fit embed suggestion placement logic, FormGroup / FormLabel /
> FormControl / FormDescription / DisabledReasonTooltip composition,
> docs-derived state taxonomy and sample copy, Command / Combobox / TagInput /
> Tooltip usage boundaries, and token names and values (`foreground`, `input`,
> `ring`, `popover`, `popover-foreground`, `muted`, `muted-foreground`,
> `primary`, `primary-subtle`, `background`, and `border`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Mention / Section`: `322:13`
- `Mention` component: `322:14`
- Placement: `Inputs` page, after `TagInput / Section`, at `(40, 73343)`,
  `1280 x 1940`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the no-generated-variant
  contract, default textarea with suggestion list specimen, prop/default and
  behavior contract, mention suggestions / custom trigger / disabled /
  inserted-highlight / top-placement state specimens, keyboard and placement
  behavior notes, runtime token notes, and related-component usage boundary are
  aligned without visible overlap.

The next discovery target was then exported with the additional FileUploader
component data:

> I approve exporting the FileUploader prop names, default values, and behavior
> (`value`, `onValueChange`, `maxFiles=1`, `maxSize=5242880`, `accept`,
> `disabled`, `showFileList=true`, `fileProgress`, `labels`, and
> `HTMLAttributes<HTMLDivElement>`), generated `default` variant and default
> variant structure, FileUploaderFileStatus values (`pending`, `uploading`,
> `complete`, and `error`), FileUploaderFileProgress and progress resolver
> structure, controlled and uncontrolled file state handling, drag active
> behavior, hidden file input behavior, drop / change / remove file flow,
> `getFileUploaderFileKey`, accept flattening and MIME / wildcard / extension
> matching, max file slicing, file size and file type validation, status and
> progress resolution, internal file list row anatomy, TooltipButton remove
> action, Progress / Spinner / Alert / DisabledReasonTooltip / Form composition,
> docs-derived state taxonomy and sample copy, Input / MediaPickerDialog /
> AssetCard / Form usage boundaries, and token names and values (`foreground`,
> `background`, `muted`, `muted-foreground`, `border`, `primary`,
> `primary-border`, `primary-subtle`, `success-strong`, and `destructive`) from
> this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `FileUploader / Section`: `324:13`
- `FileUploader` component: `324:14`
- Placement: `Inputs` page, after `Mention / Section`, at `(40, 75331)`,
  `1280 x 2390`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; screenshot review confirmed the generated `default`
  variant contract, default dropzone and file-list specimen, prop/default and
  behavior contract, standard / image-only / drag-active / uploading / success /
  failure / disabled / internal-list state specimens, accept and validation
  behavior notes, runtime token notes, and related-component usage boundary are
  aligned without visible overlap.

The next discovery target was then exported with the additional ImagePreview
component data:

> I approve exporting the ImagePreview prop names, default values, and behavior
> (`src`, `alt`, `variant`, `aspectRatio="square"`, `objectFit`,
> `loading="lazy"`, `fallback`, `noImageLabel="Image not found"`,
> `showSkeleton=true`, `previewLabel="Open preview"`, `portalContainer`,
> `onPreview`, `children`, `imgProps`, and div `HTMLAttributes`), generated
> variant names (`default`, `contain`, and `empty`) and default variant
> (`default`), effective variant resolution (`src ? variant : "empty"`),
> effective `objectFit` rule (`contain` variant uses `contain`; otherwise
> `cover`), aspect-ratio class mapping (`square`, `video`, `portrait`, `wide`,
> and `auto`), Img composition and forwarded props, default no-image fallback
> anatomy, optional preview Tooltip button behavior with `stopPropagation` and
> `portalContainer`, overlay `children` slot behavior, docs-derived state
> taxonomy and sample copy, Img / Icon / Tooltip / AssetCard / AssetGrid /
> MediaLightbox composition and usage boundaries, and token names and values
> (`muted`, `muted-foreground`, `background`, `foreground`, `border`,
> `primary`, `ring`, `popover`, and `popover-foreground`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ImagePreview / Section`: `326:2`
- `ImagePreview / Library card`: `326:3`
- Placement: `Display` page, after `ChatMessage / Section`, at `(40, 25206)`,
  `1280 x 1706`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the generated
  `default` / `contain` / `empty` variant contract, component-set specimens,
  prop/default and behavior contract, cover / contain / empty docs state
  specimens, aspect-ratio and overlay-slot behavior notes, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional ToolPill
component data:

> I approve exporting the ToolPill prop names, default values, and behavior
> (`icon` required, `label`, `isActive=false`, `variant="primary"`, `size="md"`,
> `tooltipSide="top"`, `className`, `onClick`, and button HTML attributes),
> generated variant names (`primary`, `secondary`, and `danger`) and default
> variant (`primary`), runtime size values (`sm`, `md`, and `lg`) with control
> and icon dimensions, active / inactive state style resolution for each
> variant, Tooltip wrapping behavior when `label` is provided, disabled trigger
> span behavior, `aria-label` fallback and `sr-only` label structure, transition
> and hover motion affordances, docs-derived state taxonomy and sample copy
> (`横並びツールバー`, `縦並びツールバー`, `操作の種類`, `選択中`, `サイズ`,
> `選択`, `移動`, `編集`, `削除`, `複製`, `追加`, and `消去`), Tooltip /
> TooltipButton / Button / Icon / Tag composition and usage boundaries, and
> token names and values (`primary-subtle`, `primary-subtle-foreground`,
> `primary`, `primary-foreground`, `primary-border`, `secondary`,
> `secondary-foreground`, `destructive-subtle`,
> `destructive-subtle-foreground`, `destructive-strong`,
> `destructive-strong-foreground`, `destructive-border`, `background`,
> `foreground`, `muted`, `muted-foreground`, `border`, `ring`, `popover`, and
> `popover-foreground`) from this private pre-public repository to the Figma
> file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ToolPill / Section`: `327:2`
- `ToolPill / Library card`: `327:3`
- Placement: `Display` page, after `ImagePreview / Section`, at `(40, 26960)`,
  `1280 x 1760`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the generated
  `primary` / `secondary` / `danger` variant contract, active and inactive
  specimens, prop/default and tooltip behavior contract, horizontal toolbar /
  vertical toolbar / action variants / active / sizes state specimens, runtime
  token notes, and related-component usage boundary are aligned without visible
  overlap.

The next discovery target was then exported with the additional Code component
data:

> I approve exporting the Code prop names, default values, and behavior
> (`children`, `className`, `variant`, `size`, and
> `React.HTMLAttributes<HTMLElement>`), generated no-variant and
> no-default-variant structure, runtime CVA option values (`variant="default" |
> "muted"` and `size="sm" | "default" | "lg"`), CVA default options
> (`variant="default"` and `size="default"`), `forwardRef` `<code>` element
> structure, base typography and layout classes (`relative`, `rounded`,
> `font-mono`, `text-sm`, and `font-medium`), default and muted variant style
> resolution, size option typography, docs-derived state taxonomy and sample
> copy (`表示の強さ`, `サイズ`, `npm install @gunjo/ui`, `--access public`,
> `npm run dev`, `--watch`, `size="sm"`, `size="default"`, and `size="lg"`),
> CodeBlock / Tooltip composition and usage boundaries, and token names and
> values (`muted`, `foreground`, `secondary`, `muted-foreground`, `border`,
> `background`, `popover`, `popover-foreground`, and `ring`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Code / Section`: `328:2`
- `Code / Library card`: `328:3`
- Placement: `Display` page, after `ToolPill / Section`, at `(40, 28768)`,
  `1280 x 1440`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the no-generated
  variant contract, inline prose specimen, prop/default and CVA option
  contract, visual-emphasis and size state specimens, semantic / typography /
  usage-boundary notes, and runtime token notes are aligned without visible
  overlap. Additional token-row overlap validation returned
  `suspiciousOverlapCount: 0`.

The next discovery target was then exported with the additional EmptyState
component data:

> I approve exporting the EmptyState prop names, default values, and behavior
> (`icon`, required `title`, `description`, `action`, `children`,
> `headingLevel=2`, `className`, and div HTML attributes with native `title`
> omitted), generated no-variant and no-default-variant structure, root layout
> and styling (`flex flex-col items-center justify-center gap-3 rounded-lg
> border border-dashed border-border bg-muted/40 px-6 py-10 text-center`),
> optional icon wrapper anatomy (`h-12 w-12 rounded-full bg-muted
> text-muted-foreground`), title heading semantics (`h${headingLevel}` with
> valid levels 1 through 6), title / description / action / children rendering
> order, action `mt-2` placement, docs-derived state taxonomy and sample copy
> (`検索結果なし`, `初回状態`, `読み込み失敗`, `プロジェクトがありません`,
> `プロジェクトを作成`, `一致する結果がありません`, `フィルターを解除`,
> `まだ素材がありません`, `アップロード`,
> `データを読み込めませんでした`, and `再試行`), Button / Icon / AssetGrid /
> DataTable / SearchInput composition and usage boundaries, and token names and
> values (`muted`, `muted-foreground`, `border`, `foreground`, `background`,
> `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `ring`,
> `card`, `card-foreground`, and `accent`) from this private pre-public
> repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `EmptyState / Section`: `331:2`
- `EmptyState / Library card`: `331:3`
- Placement: `Display` page, after `Code / Section`, at `(40, 30256)`,
  `1280 x 1760`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the no-generated
  variant contract, default empty-state specimen, prop/default and heading
  semantics contract, no-results / first-run / failed-load state specimens,
  behavior notes, runtime token notes, and related-component usage boundary are
  aligned without visible overlap. Additional token-row overlap validation
  returned `suspiciousOverlapCount: 0`.

The next discovery target was then exported with the additional Tag component
data:

> I approve exporting the Tag prop names, default values, and behavior
> (`children`, `className`, `variant`, `size`, `onRemove`,
> `removeLabel="Remove"`, and span HTML attributes with `onRemove` omitted),
> generated no-variant and no-default-variant structure, runtime CVA option
> values (`variant="default" | "secondary" | "outline" | "destructive"` and
> `size="sm" | "default" | "lg"`), CVA default options
> (`variant="default"` and `size="default"`), base layout and typography
> classes (`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs
> font-medium transition-colors`), variant and size style resolution, optional
> trailing remove button anatomy (`IconX`, `h-3 w-3`, focus ring, and
> `aria-label={removeLabel}`), Tooltip / TooltipTrigger / TooltipContent
> composition for remove actions, docs-derived state taxonomy and sample copy
> (`用途別の見た目`, `サイズ`, `削除できるタグ`, `React`, `TypeScript`, `UI`,
> `設計`, `標準`, `選択中`, `下書き`, `要確認`, `小`, `大`, and
> `TypeScript を削除`), TagEditor / TagInput / Badge / ToolPill composition and
> usage boundaries, and token names and values (`secondary`,
> `secondary-foreground`, `foreground`, `background`, `border`,
> `destructive-strong`, `destructive-strong-foreground`, `ring`, `muted`, and
> `muted-foreground`) from this private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Tag / Section`: `332:2`
- `Tag / Library card`: `332:3`
- Placement: `Display` page, after `EmptyState / Section`, at `(40, 32064)`,
  `1280 x 1710`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the no-generated
  variant contract, removable tag group specimen, prop/default and remove
  action contract, purpose variants / sizes / removable state specimens,
  behavior notes, runtime token notes, and related-component usage boundary are
  aligned without visible overlap. Additional token-row and child-overflow
  validation returned `suspiciousOverlapCount: 0` and `childOverflowCount: 0`.

The next discovery target was then exported with the additional Icon component
data:

> I approve exporting the Icon prop names, default values, and behavior
> (`icon` required, `size`, `label`, `decorative=true`, `strokeWidth=2`,
> SVG props with `children`, `size`, and `strokeWidth` omitted), generated
> variant names (`xs`, `sm`, `md`, `lg`, and `xl`) and default variant (`sm`),
> `IconGlyph` structure, size class mapping (`xs` 12 px, `sm` 16 px, `md`
> 20 px, `lg` 24 px, and `xl` 32 px), decorative / meaningful accessibility
> resolution, `<Glyph>` forwarding, `focusable="false"`, `stroke`
> forwarding, `text-current` color inheritance, docs-derived state taxonomy
> and sample labels (`Sizes`, `Meaningful icon`, `Indicator`, `Complete`,
> `Warning`, `Information`, and `Notifications`), TooltipButton / Button /
> Accordion composition and usage boundaries, and token names and values
> (`foreground`, `background`, `muted`, `muted-foreground`, `border`, `ring`,
> `success`, `destructive`, `info`, and `warning`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `Icon / Section`: `336:2`
- `Icon / Library card`: `336:3`
- Placement: `Display` page, after `Tag / Section`, at `(40, 33822)`,
  `1280 x 1580`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0` and
  `fixedSizeTextCount: 0`; layout metadata review confirmed the generated
  `xs` / `sm` / `md` / `lg` / `xl` variant contract, size specimens,
  prop/default and accessibility contract, meaningful / decorative / indicator
  state specimens, runtime token notes, and related-component usage boundary
  are aligned without visible overlap.

The next discovery target was then exported with the additional ColorSwatch
component data:

> I approve exporting the ColorSwatch prop names, default values, and behavior
> (`color` required, `label`, `copyable=true`, `copyLabel`, `copiedLabel`
> defaulting to `"Copied"`, `copiedDuration=5000`, `size`, `className`, and div
> HTML attributes with native `color` omitted), generated no-variant and
> no-default-variant structure, runtime size values (`sm`, `default`, and
> `lg`) with chip dimensions (`16`, `24`, and `32` px), `label ?? color`
> display fallback, `style.backgroundColor = color` rendering, root layout and
> styling (`inline-flex`, `gap-2`, `rounded-md`, `border-input`, `bg-transparent`,
> `p-1.5`, `pr-2`, and `text-sm`), CopyButton composition and forwarded
> clipboard labels / duration, docs-derived state taxonomy and sample copy
> (`Token values`, `Sizes`, `Without copy action`, `background`, `foreground`,
> `primary`, `muted`, `destructive`, `success`, `Copy color value`, and
> `Copied`), CopyButton / TooltipButton / Icon / Badge / Code / Tooltip /
> SwatchGroup composition and usage boundaries, and token names and values
> (`background`, `foreground`, `primary`, `muted`, `destructive`, `success`,
> `input`, `border`, `muted-foreground`, and `ring`) from this private
> pre-public repository to the Figma file `GunjoUI Library Foundations (#8)`.

Figma export:

- `ColorSwatch / Section`: `339:2`
- `ColorSwatch / Library card`: `339:3`
- Placement: `Display` page, after `Icon / Section`, at `(40, 35450)`,
  `1280 x 1624`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, token swatch specimen, prop/default and
  CopyButton composition contract, token values / sizes / without-copy-action
  state specimens, runtime token notes, and related-component usage boundary
  are aligned without visible overlap.

The next discovery target was then exported with the additional Carousel
component family data:

> I approve exporting the Carousel / CarouselContent / CarouselItem /
> CarouselPrevious / CarouselNext / CarouselDots / CarouselThumbnails /
> CarouselThumbnail / CarouselAutoplayToggle prop names, default values, and
> behavior (`opts`, `plugins`, `orientation="horizontal"`, `setApi`,
> `autoPlay=false`, `autoPlayInterval=4000`, `pauseOnHover=true`, `controls`,
> `viewportClassName`, `label`, `hideWhenDisabled=false`, `index`, `playLabel`,
> and `pauseLabel`), generated variant name (`default`) and default variant
> (`default`), Embla axis resolution, keyboard ArrowLeft / ArrowRight behavior,
> scroll state tracking (`canScrollPrev`, `canScrollNext`, `selectedIndex`, and
> `scrollSnapCount`), default-controls resolution, previous / next TooltipButton
> composition, dots and thumbnails tablist / tab structures, autoplay interval
> and temporary pause behavior, docs-derived state taxonomy and sample copy
> (`Single item`, `Peek next item`, `Visible items`, `Position-aware controls`,
> `Image carousel`, `Image thumbnail controller`, `Autoplay with controls`, and
> `Vertical`), Card / Img / ImagePreview / TooltipButton / Icon composition and
> usage boundaries, and token names and values (`background`, `foreground`,
> `muted`, `muted-foreground`, `border`, `primary`, `primary-border`, `card`,
> `card-foreground`, `popover`, `popover-foreground`, and `ring`) from this
> private pre-public repository to the Figma file
> `GunjoUI Library Foundations (#8)`.

Figma export:

- `Carousel / Section`: `342:2`
- `Carousel / Library card`: `342:3`
- Placement: `Display` page, after `ColorSwatch / Section`, at `(40, 37122)`,
  `1280 x 2100`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the generated
  `default` variant contract, 640 px default carousel specimen, prop/default
  and Embla context contract, peek / visible-items / position-aware-controls /
  image / thumbnail / autoplay state specimens, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional DataTable
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `DataTable / Section`: `344:2`
- `DataTable / Library card`: `344:3`
- Placement: `Display` page, after `Carousel / Section`, at `(40, 39270)`,
  `1280 x 2468`.
- Source contract: `DataTable` has no generated variants and no default
  variant. The recorded prop surface covers `columns`, `data`, optional
  `filter`, `pageSize=10`, `pageSizeOptions=[10, 25, 50, 100, 200]`,
  `labels`, `headerActions`, `getRowState`, `onRowClick`, `renderCard`, and
  `className`.
- Behavior notes: the Figma specimen records the TanStack-backed sorting,
  column filtering, pagination, normalized page-size options, empty row
  fallback, sortable header `aria-sort` states, disabled pagination tooltips,
  row click keyboard handling, and `renderCard` mobile-card path.
- Docs-derived states: rich cells, empty state, without filter, sort and
  pagination, mobile card rendering, and row click behavior.
- Composition and usage boundaries: uses `Table`, `Input`, `Button`, `Badge`,
  `Tooltip`, `Select`, and pagination controls internally; use `Table` for
  static markup, `Pagination` for standalone navigation, `SortButton` for a
  single external sort trigger, and `ActionDataTable` when row-level bulk or
  contextual actions are the primary behavior.
- Runtime token notes: `destructive-border`, `background`, `foreground`,
  `popover`, `popover-foreground`, `muted`, `muted-foreground`, `border`,
  `input`, and `ring` were annotated from `src/globals.css`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, default filtered-table specimen,
  prop/default and label contract, rich-cells / empty / no-filter / sorting /
  responsive-card / row-action state specimens, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional
ActionDataTable component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `ActionDataTable / Section`: `350:2`
- `ActionDataTable / Library card`: `350:3`
- Placement: `Display` page, after `DataTable / Section`, at `(40, 41786)`,
  `1280 x 1406`.
- Variant contract: generated variants `default`, `selection`, and
  `rowActions`; default variant `default`; all variants resolve to the same
  root class contract (`w-full p-0`) and are differentiated by composition
  state rather than visual CVA styling.
- Source contract: `ActionDataTable` extends `DataTable` with generated
  selection and row-action columns, `getRowId`, `getRowLabel`,
  `enableSelection=true`, `rowActions`, `rowActionsVariant="inline" | "menu"`,
  `bulkActions`, controlled `selectedIds`, and `onSelectionChange`.
- Behavior notes: the Figma specimen records uncontrolled / controlled
  selection, stale selected-id pruning, select-all mixed state, row checkbox
  labels, bulk toolbar enablement, disabled action tooltip reasons, inline
  and menu row actions, destructive action styling, and selected row state
  forwarding through `DataTable`'s `getRowState`.
- Docs-derived states and samples: selection and bulk actions, row actions,
  campaign rows, statuses (`Active`, `Draft`, `Archived`), actions (`Edit`,
  `Archive`, and `Delete`), edit dialog follow-up, and destructive delete
  confirmation copy.
- Composition and usage boundaries: composes `DataTable`, `Checkbox`, `Button`,
  `Badge`, `Select`, `Tooltip`, `DropdownMenu`, `Dialog`, and `AlertDialog`;
  use `DataTable` for sort / filter / pagination only, `Table` for static
  markup, and `FilterButton` for external filter chips.
- Runtime token notes: `background`, `foreground`, `popover`,
  `popover-foreground`, `muted`, `muted-foreground`, `border`, `input`,
  `ring`, `secondary`, `secondary-foreground`, `destructive`,
  `destructive-foreground`, `destructive-strong`, and
  `destructive-strong-foreground` were annotated from `src/globals.css`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the generated
  `default` / `selection` / `rowActions` variant contract, selectable table
  specimen, prop/default and labels contract, selection / bulk-action /
  row-action state notes, runtime token notes, and related-component usage
  boundary are aligned without visible overlap.

The next discovery target was then exported with the additional AvatarGroup
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `AvatarGroup / Section`: `356:2`
- `AvatarGroup / Library card`: `356:3`
- Placement: `Display` page, after `ActionDataTable / Section`, at
  `(40, 43240)`, `1280 x 1530`.
- Variant contract: no generated variants and no default variant; the
  component is a composition around child `Avatar` elements, overflow logic,
  and optional popover content.
- Source contract: the recorded prop surface covers `max`, `overlap=8`,
  `avatarClassName`, `overflowTooltip`, `overflowContent`,
  `overflowAriaLabel`, `overflowContentClassName`,
  `overflowPortalContainer`, `overflowContentSide="bottom"`,
  `overflowContentAlign="end"`, `overflowContentSideOffset=8`, and
  `overflowContentAvoidCollisions`.
- Behavior notes: the Figma specimen records valid React child filtering,
  `visible = items.slice(0, max)`, overflow count calculation, negative
  margin overlap, non-clickable `+N` fallback, clickable `+N` popover trigger
  when `overflowContent` exists, and portal-contained popover behavior.
- Docs-derived states and samples: all visible, `max=3` / `max=5` with `+N`
  overflow, hidden member tooltip summary, member list popover, name tooltips,
  presence dots with status labels, and tighter `overlap={14}`.
- Composition and usage boundaries: composes `Avatar`, `AvatarFallback`,
  `Tooltip`, and `Popover`; use `Avatar` for one person, `AvatarGroup` for
  compact participant sets, `HoverCard` for rich one-person previews, and
  `MetadataList` for structured member details.
- Runtime token notes: `background`, `foreground`, `popover`,
  `popover-foreground`, `muted`, `muted-foreground`, `border`, `ring`,
  `secondary`, `success`, `warning`, and `destructive` were annotated from
  `src/globals.css`, with Avatar-derived `ring-background`, `bg-muted`,
  `bg-secondary`, and presence color behavior represented in the specimen.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, overlapping avatar specimen, overflow
  popover specimen, props/default contract, overflow / tooltip / presence /
  tight-overlap state notes, runtime token notes, and related-component usage
  boundary are aligned without visible overlap.

The next discovery target was then exported with the additional CodeBlock
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `CodeBlock / Section`: `359:2`
- `CodeBlock / Library card`: `359:3`
- Placement: `Display` page, after `AvatarGroup / Section`, at
  `(40, 44818)`, `1280 x 1838`.
- Variant contract: no generated variants and no default variant; runtime
  presentation is controlled by props such as `theme`, `copyable`,
  `showLineNumbers`, `highlight`, and `editable`.
- Source contract: the recorded prop surface covers required `code`, optional
  `filename`, `language`, `copyable=true`, `copyLabel="Copy code"`,
  `copiedLabel="Copied"`, `copiedDuration=5000`,
  `showLineNumbers=false`, `highlight=false`, `editable=false`,
  `onCodeChange`, `selectOnDoubleClick=true`, `theme="dark"`, `className`,
  and div HTML attributes.
- Behavior notes: the Figma specimen records `currentCode` resolution,
  internal code-state sync, header rendering when filename, language, or copy
  action is present, `CopyButton` feedback, editable textarea behavior,
  optional line numbers, lightweight syntax highlighting, double-click
  selection, and dark / light / muted theme surfaces.
- Docs-derived states and samples: header with filename/language/copy action,
  highlight with line numbers, editable code, color themes, copy-disabled
  specimen, and copied feedback; sample snippets include TypeScript, HTML, and
  JSON examples from the docs page.
- Composition and usage boundaries: composes `CopyButton`; docs examples also
  reference `TooltipButton` and `Icon`; use `CodeBlock` for multiline source
  snippets, `Code` for inline tokens, and `Tooltip` / `CopyButton` for
  adjacent copy affordances outside the code surface.
- Runtime token notes: `background`, `foreground`, `popover`,
  `popover-foreground`, `muted`, `muted-foreground`, `border`, `ring`,
  `info`, `success`, `warning`, `pure-white`, and `pure-black` were annotated
  from `src/globals.css`, with custom syntax-token surfaces represented in the
  specimen.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, default code specimen, docs state cards,
  props/default and behavior contracts, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional Timeline
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `Timeline / Section`: `369:2`
- `Timeline / Library card`: `369:3`
- Placement: `Display` page, after `CodeBlock / Section`, at `(40, 46704)`,
  `1280 x 1887`.
- Variant contract: no generated variants and no default variant in the
  component spec; runtime marker states are provided by `TimelineItem.variant`.
- Source contract: the recorded compound API covers `Timeline` as ordered-list
  HTML attributes, `TimelineItem` as list-item HTML attributes with
  `connector=true`, `variant="default"`, optional `marker`, and slot
  components `TimelineTime`, `TimelineTitle`, and `TimelineDescription`.
- Runtime marker states: `default`, `muted`, `active`, `outline`, `success`,
  `warning`, `destructive`, and `info`; custom marker nodes replace the
  default dot, and `connector={false}` removes the next-step line.
- Behavior notes: the Figma specimen records `hasTimelineTime` marker padding,
  connector line rendering, active marker pulse animation with
  `prefers-reduced-motion` fallback, final-item connector removal, custom
  marker composition, and compact timelines without time/description slots.
- Docs-derived states and samples: release progress, custom markers, compact
  process steps, semantic status tones, and demo examples such as Kickoff,
  Spec approved, Implementation / Current, Review complete, Received,
  Processing, Approved, and Sent back.
- Composition and usage boundaries: docs compose `Tag` for the current-step
  badge; use `Timeline` for vertical chronological/process lists, `List` for
  unordered content groups, `ActivityTimelineCard` and `SegmentTimelineCard`
  for chart-like timelines, and `Separator` for static dividers.
- Runtime token notes: `foreground`, `background`, `muted-foreground`,
  `border`, `primary`, `primary-border`, `success-strong`, `warning-strong`,
  `destructive-strong`, `info-strong`, and `ring` were annotated from
  `src/globals.css`; the active marker animation uses `primary` alpha
  shadows from `.gunjo-timeline-marker-active`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, release timeline specimen, progress/custom
  marker/compact/semantic state cards, compound API notes, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional TreeView
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `TreeView / Section`: `373:2`
- `TreeView / Library card`: `373:3`
- Placement: `Display` page, after `Timeline / Section`, at `(40, 48639)`,
  `1280 x 1707`.
- Variant contract: no generated variants and no default variant in the
  component spec; row appearance is driven by data, expansion, selection, and
  optional render slots.
- Source contract: the recorded prop surface covers required `nodes`,
  controlled `expanded`, `onExpandedChange`, `defaultExpanded`, `selectedId`,
  `selectedIds`, `selectionMode="single"`, `onSelectedIdChange`,
  `renderNodeMeta`, `renderNodeActions`, `getNodeRowProps`, `className`, and
  `ul` HTML attributes.
- Node contract: `TreeNode` records `id`, `label`, optional `icon`, and
  optional `children`; visible rows are flattened from expanded nodes while
  preserving `parentId`, `hasChildren`, and `expanded` state.
- Behavior notes: the Figma specimen records `role="tree"`,
  `role="treeitem"`, nested `role="group"`, `aria-expanded`,
  `aria-selected`, `aria-multiselectable` for multiple mode, roving tabindex,
  ArrowUp / ArrowDown / ArrowLeft / ArrowRight / Home / End navigation,
  disclosure-only chevron hit target with `tabIndex={-1}`, row click
  toggle/select behavior, and `--tree-view-indent` depth indentation.
- Docs-derived states and samples: default expanded, controlled selection,
  without icons, with icons, metadata and actions; sample labels include
  guides, assets, guide.md, release.md, hero.png, settings, profile, security,
  counts, file sizes, and overflow row actions.
- Composition and usage boundaries: docs compose `DropdownMenu` and
  `TooltipButton` for row actions; use `TreeView` for hierarchical navigation,
  `FileTree` when file-browser selection/actions own the interaction model,
  `List` for flat content, `Accordion` for disclosure sections,
  `MetadataList` for property rows, and `ToolPill` for compact tools.
- Runtime token notes: `background`, `foreground`, `muted`,
  `muted-foreground`, `border`, `input`, `ring`, `primary`, `secondary`, and
  `accent` were annotated from `src/globals.css`, with row hover/selected
  treatment using `bg-muted` and disclosure/meta/icon text using
  `text-muted-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  no-generated-variant contract, controlled tree specimen, docs state cards,
  props/default and behavior contracts, runtime token notes, and
  related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional FileTree
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `FileTree / Section`: `378:2`
- `FileTree / Library card`: `378:3`
- Placement: `Display` page, after `TreeView / Section`, at `(40, 50394)`,
  `1280 x 1502`.
- Variant contract: generated variants are `single`, `multiple`, and
  `actions`; the default variant is `single`.
- Source contract: the recorded prop surface covers required `nodes`,
  `variant`, `selectionMode`, `selectedIds`, `defaultSelectedIds`,
  `onSelectedIdsChange`, `onNodeSelect`, `renderNodeMeta`,
  `renderNodeActions`, `getNodeRowProps`, `className`, and inherited TreeView
  expansion props such as `expanded`, `defaultExpanded`, and
  `onExpandedChange`.
- Node contract: `FileTreeNode` records `id`, `label`, optional `type`,
  optional `icon`, optional `children`, `meta`, `size`, and `count`; FileTree
  maps the node data to TreeView nodes and supplies default folder/file icons.
- Behavior notes: `selectionMode` resolves from the variant unless explicitly
  provided (`single` -> `single`, `multiple` -> `multiple`, `actions` ->
  `single`); multiple mode toggles selected ids, single mode replaces the
  selected id array, and `selectionMode="none"` calls `onNodeSelect` without
  mutating selection. Metadata resolution uses `meta`, then `size`, then
  `count`; folder detection uses `type="folder"` or the presence of children.
- Docs-derived states and samples: single selection, multiple selection, and
  row actions; sample labels include Campaign / キャンペーン, Docs / 資料,
  hero.png / ヒーロー画像.png, banner.jpg / バナー.jpg, brief.md /
  要件メモ.md, checklist.md / 確認リスト.md, `2件`, `2.4 MB`, `860 KB`,
  View details / 詳細を表示, Rename / 名前を変更, and Copy path /
  パスをコピー.
- Composition and usage boundaries: FileTree composes `TreeView` and, for row
  actions, `DropdownMenu` with `TooltipButton`; use `FileTree` when
  file-browser selection/actions own the interaction model, `TreeView` for
  generic hierarchical navigation, `AssetGrid` for visual asset galleries,
  `MediaLibraryTemplate` for full media library workflows, and `SidebarItem`
  for non-file navigation lists.
- Runtime token notes: `background`, `foreground`, `muted`,
  `muted-foreground`, `border`, `input`, `ring`, `primary`, `secondary`, and
  `accent` were annotated from `src/globals.css`; row selected state uses
  `muted` and `primary` alpha stroke, default metadata/icon text uses
  `muted-foreground`, and row control borders use `input`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `single` / `multiple` / `actions` variant contract, file-browser specimen,
  docs state cards, props/default and behavior contracts, runtime token notes,
  and related-component usage boundary are aligned without visible overlap.

The next discovery target was then exported with the additional DocNote
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `DocNote / Section`: `380:2`
- `DocNote / Library card`: `380:3`
- Placement: `Display` page, after `FileTree / Section`, at `(40, 51944)`,
  `1280 x 1350`.
- Variant contract: generated variants are `default`, `reference`, `note`,
  `warning`, and `tip`; the default variant is `default`.
- Source contract: the recorded prop surface covers optional `heading`,
  optional `variant`, required `children`, `className`, and forwarded
  `HTMLElement` attributes on the root `aside`.
- Behavior notes: `default` and `reference` stay generic with no note role;
  `note`, `warning`, and `tip` render a leading Tabler icon and
  `role="note"` so the callout type is conveyed by more than color. Heading
  is rendered in a full-width row when `heading` or a callout icon exists, and
  links inside the note are made medium-weight, underlined, foreground text
  with primary hover.
- Docs-derived states and samples: default explanatory note and reference link
  note; sample labels include 通常, 参考リンク, GitHub Flavored Markdown の拡張,
  GFM, 参考文献, W3C WAI: Decorative Images, TextLink, and
  新しいタブで開きます.
- Composition and usage boundaries: docs compose `TextLink` inside reference
  notes; use `DocNote` for explanatory copy, references, and non-urgent
  documentation callouts, `MarkdownRenderer` when markdown owns the full prose
  rendering surface, `Alert` for urgent or status-bearing feedback, and `Card`
  for structured content containers.
- Runtime token notes: default uses `bg-muted/45` and
  `text-muted-foreground`; reference uses `bg-secondary/55` and
  `text-muted-foreground`; note uses `info-border`, `info-subtle`, and
  `info-subtle-foreground`; warning uses `warning-border`,
  `warning-subtle`, and `warning-subtle-foreground`; tip uses
  `success-border`, `success-subtle`, and `success-subtle-foreground`.
  Foreground, primary, background, border, card, and accent were included for
  specimen annotation and link treatment.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `reference` / `note` / `warning` / `tip` variant contract,
  docs-derived note specimens, props/default and callout behavior contracts,
  runtime token notes, and related-component usage boundary are aligned
  without visible overlap.

The next discovery target was then exported with the additional AssetCard
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `AssetCard / Section`: `383:2`
- `AssetCard / Library card`: `383:3`
- Placement: `Display` page, after `DocNote / Section`, at `(40, 53342)`,
  `1280 x 1459`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `asset`,
  optional `selected`, `variant`, `selectionMode`, `imageFit`, preview /
  favorite / unfavorite / rating / no-image labels, `portalContainer`,
  `onSelect`, `onPreview`, `onFavorite`, `renderMeta`, `className`, and
  forwarded `div` HTML attributes except `onSelect`.
- Asset contract: `AssetCardAsset` records `id`, `title`, optional `src`,
  `alt`, `type`, `size`, `width`, `height`, `createdAt`, `isFavorite`,
  `rating`, `score`, and `meta`. Default metadata is dimensions, then type
  and size, then created date; numeric positive `rating` is displayed before
  the legacy `score` fallback.
- Behavior notes: the root becomes `role="button"` and `tabIndex={0}` only
  when `onSelect` is provided; Enter and Space call `onSelect` unless the
  original keydown was prevented. `ImagePreview` receives `objectFit`,
  preview labels, `portalContainer`, no-image label, and optional preview
  handler. Favorite is an icon-only button wrapped in `Tooltip`; it stops click
  propagation and exposes `aria-label` / `aria-pressed`. Selection indicators
  appear for multiple mode, or when selected in a non-`none` mode.
- Docs-derived states and samples: selected, compact, contain fit, and without
  image; sample labels include Instagram_Story_v2.png, thumbnail_square.png,
  full_asset_preview.jpg, brief_document.pdf, 1920 x 1080, 1920 x 600, JPG,
  PDF, 1.4MB, 2026-05-12, Rating / 評価, Open preview / 拡大表示, Favorite /
  お気に入りに追加, Remove from favorites / お気に入りを解除, and Preview image
  not found / プレビュー画像がありません.
- Composition and usage boundaries: AssetCard composes `ImagePreview`, `Badge`,
  `Icon`, and `Tooltip`; use `AssetCard` for individual selectable media
  items, `AssetGrid` for grouped layouts and selection management,
  `MediaLightbox` for fullscreen preview workflows, and
  `AssetInspectorPanel` for metadata/detail editing after selection.
- Runtime token notes: `background`, `foreground`, `border`, `muted`,
  `muted-foreground`, and `secondary` cover root text, metadata, empty preview,
  and overlay surfaces; `primary`, `primary-foreground`, `primary-border`, and
  `primary-subtle` cover selected border/ring/check treatment; `warning` marks
  the rating star; `input`, `ring`, `card`, and `accent` were included for
  specimen annotation and preview surfaces.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, selected/compact/contain/no-image
  specimens, props/default and interaction behavior contracts, runtime token
  notes, and related-component usage boundary are aligned without visible
  overlap.

The next discovery target was then exported with the additional AssetGrid
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `AssetGrid / Section`: `385:2`
- `AssetGrid / Library card`: `385:3`
- Placement: `Display` page, after `AssetCard / Section`, at `(40, 54849)`,
  `1280 x 1532`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers optional `items`, optional
  `groups`, `selectedIds`, `variant`, `layout`, `minColumnWidth`, `gap`,
  `selectionMode`, `portalContainer`, empty-state title and description,
  `onSelect`, `onPreview`, `onFavorite`, `renderMeta`, `renderItem`,
  `className`, `style`, and forwarded `div` HTML attributes except
  `children` and `onSelect`.
- Layout contract: `groups` take precedence over `items`; ungrouped items are
  normalized into a single `all` group. `default` resolves to 180px columns,
  24px gap, and default AssetCard density; `compact` resolves to 140px
  columns, 16px gap, and compact AssetCard density. `layout="fill"` stretches
  auto-fit columns to the container, while `layout="content"` centers a
  calculated max-width from item count, column width, and gap.
- Behavior notes: the component renders an `EmptyState` when no resolved group
  contains assets. `selectedIds` is memoized as a Set and passed to each
  AssetCard as `selected`. `selectionMode`, `portalContainer`, preview,
  favorite, selection, and metadata render hooks are forwarded to AssetCard.
  `renderItem` can replace the default AssetCard renderer with
  `(asset, { selected }) => ReactNode`.
- Docs-derived states and samples: default grid, compact grid, and grouped
  sections; sample labels include Campaign_Hero.jpg, Instagram_Story.png,
  Product_Square.png, キャンペーン素材, 公開前の候補, No assets, Assets added to
  this library will appear here, JPG, PNG, 1.4MB, 2.1MB, 2026-05-12, and
  2026-05-10.
- Composition and usage boundaries: AssetGrid composes `AssetCard` and
  `EmptyState`; use `AssetGrid` for browsable or grouped media collections,
  `AssetCard` for an individual selectable media item, `MediaPickerDialog`
  for modal selection and confirmation flows, and `AssetInspectorPanel` for
  metadata/detail editing after selection.
- Runtime token notes: the grid root is structural and uses `w-full`, `p-0`,
  and `space-y-8`; group labels use `foreground` and `muted-foreground`.
  Figma specimens include `background`, `foreground`, `muted`,
  `muted-foreground`, `border`, `card`, `secondary`, `accent`,
  `primary`, `primary-border`, `primary-subtle`, and `warning` to show
  selection, cards, metadata, empty state, and rating treatment.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default/compact/grouped/empty
  specimens, props/default and responsive layout behavior contracts, runtime
  token notes, and related-component usage boundary are aligned without visible
  overflow or overlap.

The next discovery target was then exported with the additional TagEditor
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `TagEditor / Section`: `388:2`
- `TagEditor / Library card`: `388:3`
- Placement: `Display` page, after `AssetGrid / Section`, at `(40, 56429)`,
  `1280 x 1185`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `value`, optional
  `onValueChange`, `suggestions`, `label`, `placeholder`, `removeLabel`,
  `maxTagsReachedLabel`, `disabledLabel`, `maxTags`, `variant`,
  `disabled`, `className`, and forwarded `div` HTML attributes except
  `onChange`.
- Layout contract: the root is `w-full p-0`; `default` uses `space-y-3` and
  a `min-h-10` TagInput, while `compact` uses `space-y-2` and a
  `min-h-9 text-xs` TagInput. The label row shows the optional label and a
  `value.length/maxTags` counter when `maxTags` is provided.
- Behavior notes: suggestions default to an empty array and are filtered
  case-insensitively against current values. `addTag` trims suggestions,
  ignores empty strings, blocks duplicates, and prevents additions when
  `maxTags` is reached. Up to six available suggestions render as outline
  small buttons with a leading plus icon. Disabled suggestion buttons are
  wrapped in an enabled tooltip trigger and show either `maxTagsReachedLabel`
  or `disabledLabel`.
- Docs-derived states and samples: with suggestions, compact, and maximum tags;
  sample labels include タグ, 配信タグ, 最大3件, ヒーロー, Web, SNS, 短尺, 広告,
  公開前, キャンペーン, 商品, セール, タグを追加..., タグを削除, and
  タグは3件まで追加できます。不要なタグを削除してから追加してください。
- Composition and usage boundaries: TagEditor composes `TagInput`, `Button`,
  and `Tooltip`; use `TagEditor` when editable tags need suggestions or a
  max-count affordance, `TagInput` for direct freeform tag entry, `Tag` for
  static tag display, `MetadataList` for label/value metadata, and `ToolPill`
  for compact tool metadata.
- Runtime token notes: root styling is structural; label/counter text uses
  `muted-foreground`; TagInput and suggestion controls use `background`,
  `foreground`, `input`, `border`, `muted`, `muted-foreground`,
  `primary`, `secondary`, `popover`, and `ring` for field, tag,
  tooltip, and focus annotation.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, suggestions/compact/max-tags
  specimens, props/default and disabled tooltip behavior contracts, runtime
  token notes, and related-component usage boundary are aligned without visible
  overflow or overlap.

The next discovery target was then exported with the additional ChartLegend
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `ChartLegend / Section`: `394:2`
- `ChartLegend / Library card`: `394:3`
- Placement: `Charts` page, after the page intro frame, at `(40, 368)`,
  `1280 x 1482`.
- Variant contract: generated variants are `horizontal` and `vertical`; the
  default variant is `horizontal`.
- Source contract: the recorded prop surface covers required `items`, optional
  `variant`, optional `activeIndex`, `className`, forwarded `div` HTML
  attributes, and optional root `role` override. `ChartLegendItem` contains
  `label`, optional `value`, optional `color`, and optional
  `description`.
- Layout contract: `horizontal` is `inline-flex w-full flex-wrap items-center
  gap-2 p-0`; `vertical` is `flex w-full flex-col items-stretch gap-2 p-0`.
  Each item is an inline-flex, focusable `listitem` with marker, label, and
  optional value. Vertical rows justify values to the edge while label text
  truncates first to prevent horizontal scroll.
- Behavior notes: the root defaults to `role="list"`; each item uses
  `tabIndex={0}`, `aria-label` built from label/value/description, and
  `aria-current="true"` when `activeIndex` matches. Active items receive
  border, `bg-muted/60`, foreground text, and shadow treatment. Every item is
  wrapped in `ChartTooltip`; empty tooltip content returns the child directly.
- Color contract: `ChartTone` values are `primary`, `success`, `warning`,
  `info`, `accent`, `destructive`, and `muted`; `getChartColor`
  resolves missing colors through `chartToneOrder` and maps tones to
  `hsl(var(--...))` values.
- Docs-derived states and samples: horizontal, vertical, without values, and
  constrained width; sample labels include 自然流入, 紹介, 直接, 完了, 進行中,
  確認待ち, 差し戻し, 検索, SNS, 広告, メール, その他, 合計: 12,400,
  合計: 7,560, 公開済みの項目です。, 作業中の項目です。, レビュー待ちの項目です。,
  and 修正が必要な項目です。
- Composition and usage boundaries: ChartLegend composes `ChartTooltip` and
  chart-utils color resolution; use it for chart series or distribution segment
  legends, and compose it with `DonutChart`, `DistributionBar`,
  `StackedBarChart`, `PieChart`, `LineChart`, and related chart cards when
  the chart needs an external legend.
- Runtime token notes: root styling is structural; item labels use
  `muted-foreground`, values use `foreground`, active items use `border`,
  `muted`, and shadow treatment, tooltips use `popover`,
  `popover-foreground`, `border`, and `muted-foreground`, and focus/open
  rings use `ring` plus `background`. Marker specimens include `primary`,
  `success`, `warning`, `info`, `accent`, `destructive`, and `muted`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `horizontal` / `vertical` variant contract, horizontal/vertical/value-less/
  constrained specimens, props/default and tooltip/accessibility contracts,
  runtime token notes, and related-chart usage boundary are aligned without
  visible overflow or overlap.

The next discovery target was then exported with the additional SparklineChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `SparklineChart / Section`: `398:2`
- `SparklineChart / Library card`: `398:3`
- Placement: `Charts` page, after `ChartLegend / Section`, at `(40, 1898)`,
  `1280 x 1388`.
- Variant contract: generated variants are `line`, `area`, and `step`; the
  default variant is `line`.
- Source contract: the recorded prop surface covers required `data`, optional
  `variant`, `color`, `referenceValue`, `referenceLabel`, `showGrid`,
  `showDots`, `strokeWidth`, `formatValue`, `className`, and forwarded
  `div` HTML attributes except `children`. Defaults are `variant="line"`,
  `referenceLabel="Reference"`, `showGrid=true`, `showDots=false`, and
  `strokeWidth=2`.
- Geometry and behavior: the root is `relative h-24 w-full p-0` with
  `role="img"`; `ResizeObserver` drives measured SVG dimensions with a
  `240 x 96` fallback and `6px` padding. Point building filters non-finite
  values, includes `referenceValue` in the domain when present, renders
  `step` through midpoint and vertical transition points, uses
  `preserveAspectRatio="none"`, draws `area` as a low-opacity polygon,
  and optionally renders 4px point dots.
- Interaction notes: grid lines render at the 25/50/75% bands when
  `showGrid` is enabled; reference lines use dashed foreground treatment;
  point hit areas drive `ChartFloatingTooltip` and reference labels use
  `ChartTooltip` focus/hover behavior.
- Docs-derived states and samples: line, area, step, and reference; sample
  month labels run from 1月 through 12月 with values `24` through `64`.
  Specimen copy includes 売上トレンド, 月次経常収益, `$128,430`, `+12.4%`,
  平均, and 目標.
- Composition and usage boundaries: SparklineChart composes chart-utils,
  `ChartFloatingTooltip`, and `ChartTooltip`; it is intended for compact
  trend context inside cards such as `AnalyticsCard`, while larger analytic
  comparisons should move to `LineChart` or related full chart components.
- Runtime token notes: chart colors resolve through the chart tone map using
  `primary`, `success`, `warning`, `info`, `accent`, `destructive`,
  and `muted`; specimen and annotations use `background`, `foreground`,
  `border`, `ring`, `popover`, `popover-foreground`, and
  `muted-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `line` / `area` / `step` variant contract, reference/dot state,
  AnalyticsCard composition specimen, props/defaults, runtime token notes, and
  related-chart usage boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional LineChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `LineChart / Section`: `402:2`
- `LineChart / Library card`: `402:3`
- Placement: `Charts` page, after `SparklineChart / Section`, at
  `(40, 3334)`, `1280 x 1718`.
- Variant contract: generated variants are `line` and `area`; the default
  variant is `line`.
- Source contract: the recorded prop surface covers required `series`,
  optional `variant`, `min`, `max`, `referenceValue`,
  `referenceLabel`, `showGrid`, `showDots`, `showLegend`,
  `showLabels`, `strokeWidth`, `formatValue`, `className`, and
  forwarded `div` HTML attributes except `children`. Defaults are
  `variant="line"`, `referenceLabel="Reference"`, `showGrid=true`,
  `showDots=true`, `showLegend=false`, `showLabels=true`,
  `strokeWidth=2`, and `formatValue=defaultChartValueFormatter`.
- Geometry and behavior: the root is `flex min-w-0 flex-col gap-3` plus
  `h-[260px] w-full p-0`; `ResizeObserver` drives measured plot dimensions
  with a `480 x 212` fallback and plot padding `14 / 12 / 10 / 28`.
  Domains include all finite series values plus `referenceValue` when present,
  and explicit `min` / `max` values are normalized if provided in reverse.
- Rendering notes: grid rows render at 0/25/50/75/100% and vertical grid lines
  follow the longest series labels. The `area` variant renders low-opacity
  polygons per series before the polyline; point markers are 4px circles with
  `background` fill and 2px chart-tone stroke. Optional labels use a CSS grid
  with one column per label.
- Interaction notes: reference and point hit targets are focusable `span`
  elements wrapped in `ChartTooltip`; reference lines use dashed foreground
  treatment, and point labels include series, point label, value, and optional
  reference description.
- Docs-derived states and samples: line, area with legend, without point
  markers, and explicit range; sample series include 売上 / Revenue and
  目標 / Target across 1月-6月 / Jan-Jun with values 42, 58, 36, 68, 51, 74
  and target values 46, 52, 48, 64, 56, 78. Sample copy includes 平均,
  Average, Goal, and 目標.
- Composition and usage boundaries: LineChart composes chart-utils,
  `ChartTooltip`, and `ChartLegend`; use it for multi-series time-series
  comparison and comparable chart scales, while compact card trends should use
  `SparklineChart`, flow/volume continuity should use `RibbonChart`, and
  categorical comparison should use `BarChart`.
- Runtime token notes: chart tones resolve through `primary`, `success`,
  `warning`, `info`, `accent`, `destructive`, and `muted`; specimen
  and annotations use `background`, `foreground`, `border`, `ring`,
  `popover`, `popover-foreground`, and `muted-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `line` / `area` variant contract, reference/legend/no-dots/bounded
  states, props/defaults, runtime token notes, and related-chart usage boundary
  are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional RibbonChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `RibbonChart / Section`: `406:2`
- `RibbonChart / Library card`: `406:3`
- Placement: `Charts` page, after `LineChart / Section`, at
  `(40, 5100)`, `1280 x 1718`.
- Variant contract: generated variants are `flow` and `stacked`; the
  default variant is `flow`.
- Source contract: the recorded prop surface covers required `layers`,
  optional `variant`, `max`, `totalLabel`, `showGrid`,
  `showLegend`, `showLabels`, `formatValue`, `className`, and
  forwarded `div` HTML attributes except `children`. Defaults are
  `variant="flow"`, `totalLabel="Total"`, `showGrid=true`,
  `showLegend=false`, `showLabels=true`, and
  `formatValue=defaultChartValueFormatter`.
- Geometry and behavior: the root is `flex min-w-0 flex-col gap-3` plus
  `h-[260px] w-full p-0`; `ResizeObserver` drives measured plot
  dimensions with a `480 x 212` fallback and plot padding
  `14 / 12 / 10 / 28`. Layer point values are normalized to finite
  positive numbers, stacked per label, and scaled against either the largest
  column total or explicit `max`.
- Rendering notes: `flow` centers each column vertically so changing volume
  reads as a continuous ribbon, while `stacked` anchors totals to the
  baseline. Grid rows render at 0/25/50/75/100% and vertical grid lines follow
  the longest layer labels. Optional labels use a CSS grid with one column per
  label.
- Interaction notes: each layer point creates focusable hit areas with
  `aria-label`; pointer, mouse, touch, and keyboard focus open
  `ChartFloatingTooltip`. Touch pointer down makes the tooltip sticky until
  close, and the active layer drives opacity changes plus a highlighted overlay.
- Docs-derived states and samples: flow, stacked, no labels, and explicit max;
  sample layers include 新規 / 継続 / 拡張 and New / Returning / Expansion
  across 1月-6月 / Jan-Jun with values 22-60, 16-52, and 8-48. Sample copy
  includes 合計, Total, 流量分布, and Flow distribution.
- Composition and usage boundaries: RibbonChart composes chart-utils,
  `ChartFloatingTooltip`, and `ChartLegend`; use it when segment width or
  flow continuity matters across periods. Use `LineChart` for point trends,
  `StackedBarChart` for discrete totals, and `DonutChart` / `PieChart`
  for a single composition snapshot.
- Runtime token notes: layer colors resolve through chart color tones such as
  `primary`, `success`, and `warning`; specimen and annotations use
  `background`, `foreground`, `border`, `ring`, `popover`,
  `popover-foreground`, and `muted-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `flow` / `stacked` variant contract, no-labels/bounded states,
  props/defaults, runtime token notes, and related-chart usage boundary are
  aligned without visible overflow or overlap.

The next discovery target was then exported with the additional RadialBarChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `RadialBarChart / Section`: `408:2`
- `RadialBarChart / Library card`: `408:3`
- Placement: `Charts` page, after `RibbonChart / Section`, at
  `(40, 6866)`, `1280 x 1718`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `data`,
  optional `variant`, `max`, `centerLabel`, `centerValue`,
  `thickness`, `gap`, `showLegend`, `formatValue`, `maxLabel`,
  `className`, and forwarded `div` HTML attributes. Defaults are
  `variant="default"`, `max=100`, `showLegend=false`,
  `formatValue=defaultChartValueFormatter`, `maxLabel="Max"`, and
  thickness/gap values of `18 / 8` for default or `14 / 6` for compact.
- Geometry and behavior: the root is centered flex column layout with
  `gap-4`; the chart target is an aspect-square focusable region with
  `max-w-56` for default and `max-w-44` for compact. Each data item maps
  to a concentric conic-gradient ring, masked by ring thickness and offset by
  the configured gap.
- Interaction notes: pointer angle and distance select the active ring, touch
  pointer down makes the tooltip sticky, keyboard focus opens the first item,
  and the chart region exposes an `aria-label` with label, formatted value,
  percent, max label, and max value.
- Docs-derived states and samples: default, with legend, compact, and thicker
  bars; sample data includes サイト / 市場 / 購入 and Website / Market /
  Shopping with values 78, 64, and 49. Sample copy includes 平均, Average,
  最大, Max, and 64%.
- Composition and usage boundaries: RadialBarChart composes chart-utils,
  `ChartFloatingTooltip`, and `ChartLegend`; use it for multiple progress,
  share, or capacity values where concentric comparison is useful. Use
  `GaugeChart` for one scalar and `ConcentricProgressCard` for card-level
  metric composition.
- Runtime token notes: chart tones resolve through `primary`, `success`,
  `warning`, and fallback chart colors; specimen and annotations use
  `background`, `foreground`, `muted`, `muted-foreground`,
  `border`, `ring`, `popover`, and `popover-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, legend/compact/thick states,
  props/defaults, runtime token notes, and related-chart usage boundary are
  aligned without visible overflow or overlap.

The next discovery target was then exported with the additional BarChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `BarChart / Section`: `411:2`
- `BarChart / Library card`: `411:3`
- Placement: `Charts` page, after `RadialBarChart / Section`, at
  `(40, 8632)`, `1280 x 1718`.
- Variant contract: generated variants are `vertical` and `horizontal`;
  the default variant is `vertical`.
- Source contract: the recorded prop surface covers required `data`,
  optional `variant`, `max`, `averageValue`, `averageLabel`,
  `formatValue`, `showGrid`, `showLabels`, `showValues`,
  `className`, and forwarded `div` HTML attributes. Defaults are
  `variant="vertical"`, `averageLabel="Average"`,
  `formatValue=defaultChartValueFormatter`, `showGrid=true`,
  `showLabels=true`, and `showValues=false`.
- Geometry and behavior: both variants use `h-[192px] w-full p-0`.
  The vertical variant renders a bottom-aligned plot with optional 25/50/75%
  grid rows, optional average marker, optional values above bars, and category
  labels below the plot. The horizontal variant renders label / track / value
  rows with bar width normalized against the resolved max value.
- Interaction notes: every bar is wrapped in `ChartTooltip` and exposes a
  focusable target with label, formatted value, and optional average context.
  The average marker also receives a `ChartTooltip` and focus-visible ring.
- Docs-derived states and samples: vertical bars, reference marker with values,
  horizontal bars, and without grid or labels; sample data includes 月 / 火 /
  水 / 木 / 金 values 42, 58, 36, 68, 54 and channel labels 検索 / SNS /
  広告 / 紹介 with values 74, 48, 62, 31. Sample copy includes 平均,
  Average, WeeklyActivity, and channel/ranking contexts.
- Composition and usage boundaries: BarChart composes chart-utils and
  `ChartTooltip`; use it for categorical comparison or rankings. Use
  `StackedBarChart` for stacked totals, `DistributionBar` for distribution
  ratios, `AnalyticsCard` for metric cards, and `ChartLegend` when a
  visible legend is required.
- Runtime token notes: chart tones resolve through `primary`, `success`,
  `warning`, `info`, and fallback chart colors; specimen and annotations
  use `background`, `foreground`, `muted`, `muted-foreground`,
  `border`, `ring`, `popover`, and `popover-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `vertical` / `horizontal` variant contract, reference/horizontal/quiet
  states, props/defaults, runtime token notes, and related-chart usage boundary
  are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
ConcentricProgressCard component data. The owner reaffirmed that the
destination Figma file is the company design-system source of truth and that
reflecting private repository component specs into that file is the approved
first-party workflow.

Figma export:

- `ConcentricProgressCard / Section`: `418:2`
- `ConcentricProgressCard / Library card`: `418:3`
- Placement: `Charts` page, after `BarChart / Section`, at `(40, 10398)`,
  `1280 x 2024`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `rings`, optional
  `title`, `description`, `value`, `centerLabel`, `delta`,
  `deltaDescription`, `metrics`, `selectedIndex`, `max`, `caption`,
  `variant`, `thickness`, `gap`, `showLegend`, `formatValue`, `maxLabel`,
  `onRingSelect`, `className`, and forwarded Card props. Defaults are
  `title="Concentric progress"`, `metrics=[]`, `variant="default"`,
  `thickness=14`, `gap=5`, `showLegend=true`,
  `formatValue=defaultChartValueFormatter`, and `maxLabel="Max"`; compact
  changes the default thickness/gap to `12 / 4`.
- Geometry and behavior: the card composes `Card`, `CardHeader`,
  `CardContent`, `CardTitle`, `CardDescription`, `ChartFloatingTooltip`, and
  `ChartTooltip`. The chart surface is an aspect-square focusable element with
  `role="img"` and an aria-label derived from the active ring. Ring hit
  testing resolves the target by radius and angle, then normalizes values
  against `max` or the fallback maximum.
- Docs-derived states and samples: default, compact, selected ring, with
  metrics, and without legend. Sample copy includes ストレージ概要,
  リソース負荷, 選択中リング, 容量サマリー, チャートのみ, 使用済み容量,
  メディア, 総容量, and values 42, 68, 27, 18 against `max=256`.
- Composition and usage boundaries: use ConcentricProgressCard for card-level
  storage, quota, utilization, and multi-ring progress widgets with optional
  metrics and legend rows. Use `RadialBarChart` for chart-only multi-series
  progress, `GaugeChart` for a single scalar, `AnalyticsCard` for broader
  analytical summaries, and `Statistic` for a single current value.
- Runtime token notes: card and labels use `card`, `card-foreground`,
  `foreground`, `muted-foreground`, `border`, and `success-strong`; ring tones
  resolve through `primary`, `destructive`, `info`, `success`, and `warning`;
  focus and tooltip affordances use `ring`, `background`, `popover`,
  `popover-foreground`, and `accent`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; SVG ring internals were excluded from overlap
  scoring because converted chart paths intentionally share bounds. Layout
  metadata review confirmed the `default` / `compact` variant contract,
  selected-ring/chart-only states, props/defaults, runtime token notes, and
  related-chart usage boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
StackedBarChart component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `StackedBarChart / Section`: `422:2`
- `StackedBarChart / Library card`: `422:3`
- Placement: `Charts` page, after `ConcentricProgressCard / Section`, at
  `(40, 12470)`, `1280 x 1980`.
- Variant contract: generated variants are `vertical` and `horizontal`; the
  default variant is `vertical`.
- Source contract: the recorded prop surface covers required `data`, optional
  `variant`, `max`, `normalize`, `showGrid`, `showLabels`, `showValues`,
  `showLegend`, `formatValue`, `totalLabel`, `className`, and forwarded `div`
  HTML attributes. Defaults are `variant="vertical"`, `normalize=false`,
  `showGrid=true`, `showLabels=true`, `showValues=false`,
  `showLegend=false`, `formatValue=defaultChartValueFormatter`, and
  `totalLabel="Total"`.
- Geometry and behavior: both variants use `h-[224px] w-full p-0`. The
  vertical variant bottom-aligns stacked bars inside a bordered baseline with
  optional 25/50/75% grid rows, optional total values above the plot, and group
  labels below. The horizontal variant renders label / stack / value rows and
  can normalize each group to a 100% width composition.
- Interaction notes: every segment is wrapped in `ChartTooltip`, is focusable,
  and receives an aria-label containing group label, segment label, formatted
  value, total label/value, and within-group percent. Segment separators use
  background-colored inset dividers.
- Docs-derived states and samples: vertical, five bars, legend and values,
  horizontal, and normalized. Sample data includes 1月 / 2月 / 3月 / 4月 /
  5月 groups with 自然流入, 紹介, and 広告 segments, plus total labels
  `合計` / `Total`.
- Composition and usage boundaries: StackedBarChart composes `ChartTooltip`,
  `ChartLegend`, and chart-utils. Use it for grouped totals where segment
  contribution matters. Use `BarChart` for single-series rankings and
  `DistributionBar` for one compact proportional strip.
- Runtime token notes: segment tones resolve through `primary`, `success`,
  `warning`, `info`, `destructive`, and fallback chart colors; chart tracks,
  grid lines, labels, and tooltip/focus affordances use `muted`,
  `muted-foreground`, `border`, `background`, `foreground`, `ring`,
  `popover`, and `popover-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `vertical` / `horizontal` variant contract, five-bars/legend/normalized
  states, props/defaults, runtime token notes, and related-chart usage boundary
  are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
DistributionBar component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `DistributionBar / Section`: `427:2`
- `DistributionBar / Library card`: `427:3`
- Placement: `Charts` page, after `StackedBarChart / Section`, at
  `(40, 14498)`, `1280 x 1720`.
- Variant contract: generated variants contain only `default`; the default
  variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `showLegend`, `formatValue`, `totalLabel`, `className`, and
  forwarded `div` HTML attributes. Defaults are `showLegend=false`,
  `formatValue=defaultChartValueFormatter`, and `totalLabel="Total"`.
- Geometry and behavior: the root uses `w-full space-y-3 p-0`; the bar is
  `h-9 w-full overflow-hidden rounded-full border border-border/70 bg-muted`
  with one focusable segment per positive value. Segment widths are normalized
  against the positive total and use background-colored inset dividers.
- Interaction notes: each segment is wrapped in `ChartTooltip`, receives
  `tabIndex=0`, and exposes an aria-label containing segment label,
  normalized percent, `totalLabel`, and formatted raw value.
- Docs-derived states and samples: default, with legend, formatted values,
  dense segments, and small segments. Sample copy includes 自然流入, 紹介,
  直接, 広告, プロダクト, 運用, サポート, 予備, 完了, 確認中, 停止中,
  未割当, 合計, 予算, and 項目数.
- Composition and usage boundaries: DistributionBar composes `ChartTooltip`,
  `ChartLegend`, and chart-utils. Use it for one compact proportional strip;
  use `StackedBarChart` for grouped totals, `DonutChart` for part-to-whole
  radial comparison, and `MiniDistributionBarCard` for card-level summaries.
- Runtime token notes: track, dividers, labels, focus, and tooltip affordances
  use `muted`, `border`, `background`, `foreground`, `muted-foreground`,
  `ring`, `popover`, and `popover-foreground`; segment tones resolve through
  chart color data or `primary`, `success`, `warning`, `info`, `accent`, and
  `destructive` fallbacks.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the default
  variant contract, legend/formatted/dense/small states, props/defaults,
  runtime token notes, and related-chart usage boundary are aligned without
  visible overflow or overlap.

The next discovery target was then exported with the additional
MiniDistributionBarCard component data. The owner reaffirmed that the
destination Figma file is the company design-system source of truth and that
reflecting private repository component specs into that file is the approved
first-party workflow.

Figma export:

- `MiniDistributionBarCard / Section`: `430:2`
- `MiniDistributionBarCard / Library card`: `430:3`
- Placement: `Charts` page, after `DistributionBar / Section`, at
  `(40, 16266)`, `1280 x 1860`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `title`, `description`, `value`, `delta`, `deltaDescription`,
  `selectedIndex`, `tickCount`, `max`, `caption`, `variant`, `formatValue`,
  `totalLabel`, `onSegmentSelect`, `className`, and forwarded Card props.
  Defaults are `title="Product categories"`, `tickCount=32`,
  `variant="default"`, `formatValue=defaultChartValueFormatter`, and
  `totalLabel="Total"`.
- Geometry and behavior: the root composes `Card`, `CardHeader`,
  `CardContent`, `CardTitle`, `CardDescription`, and `ChartTooltip`. The
  default density uses rounded-lg card chrome, `p-5 pb-3` header,
  `px-5 pb-5` content, `h-9` rounded ticks, and text-base title. The compact
  density uses rounded-md card chrome, `p-4 pb-3` header, `px-4 pb-4`
  content, `h-7` rounded-sm ticks, and text-sm title.
- Tick model: `buildTicks` normalizes positive segment values against `max` or
  the segment total, floors raw tick counts, then allocates remaining ticks by
  largest fractional remainder. `tickCount` is rounded and clamped to at least
  one tick.
- Interaction notes: every tick and summary row is wrapped in `ChartTooltip`,
  is button-based, and exposes focus-visible ring behavior. `selectedIndex`
  highlights the selected row and reduces non-selected tick/row opacity;
  `onSegmentSelect` receives the segment and index.
- Docs-derived states and samples: default, selected segment, compact, and more
  ticks. Sample copy includes 商品カテゴリ, ミニ分布, アクセサリ, デバイス,
  サービス, 45 件, 53 件, 61 件, +3.2%, 58%, 26%, and `tickCount=48`.
- Composition and usage boundaries: use MiniDistributionBarCard for compact
  card-level category, capacity, and utilization summaries where dense ticks
  and segment rows are useful. Use `DistributionBar` for a standalone
  proportional strip and `Statistic` for a single scalar value without segment
  distribution.
- Runtime token notes: card shell and text use `card`, `card-foreground`,
  `foreground`, `border`, `muted`, and `muted-foreground`; deltas use
  `success-strong`; focus and tooltip affordances use `ring`, `background`,
  `popover`, and `popover-foreground`; segment tones resolve through chart data
  or `primary`, `warning`, `success`, `info`, and `destructive` fallbacks.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, selected/ticks states,
  props/defaults, runtime token notes, and related-chart usage boundary are
  aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
SegmentTimelineCard component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `SegmentTimelineCard / Section`: `432:2`
- `SegmentTimelineCard / Library card`: `432:3`
- Placement: `Charts` page, after `MiniDistributionBarCard / Section`, at
  `(40, 18174)`, `1280 x 2000`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `metrics`, `title`, `description`, `delta`, `deltaDescription`,
  `caption`, `variant`, `selectedIndex`, `min`, `max`, `startLabel`,
  `endLabel`, `markers`, `showLegend`, `formatValue`, `rangeLabel`,
  `onSegmentSelect`, `className`, and forwarded Card props. Defaults are
  `metrics=[]`, `title="Segment timeline"`, `variant="default"`,
  `markers=[]`, `showLegend=true`, `formatValue=defaultChartValueFormatter`,
  and `rangeLabel="Range"`.
- Geometry and behavior: the root composes `Card`, `CardHeader`,
  `CardContent`, `CardTitle`, `CardDescription`, and `ChartTooltip`. The
  default density uses rounded-lg card chrome, `p-5 pb-3` header,
  `px-5 pb-5` content, `px-3 py-2.5` metric cells, `h-24` timeline surface,
  and text-base title. The compact density uses rounded-md card chrome,
  `p-4 pb-3` header, `px-4 pb-4` content, `px-3 py-2` metric cells, `h-20`
  timeline surface, and text-sm title.
- Timeline model: bounds resolve from `min` / `max` or segment starts/ends,
  `getSegmentPosition` normalizes each start/end to percent left and width,
  and segment width uses `max(calc(width% - 1.5rem), 0.625rem)` to preserve
  small ranges. Markers normalize with the same bounds and render dashed
  focusable reference lines.
- Interaction notes: metric cards, timeline segments, markers, and legend rows
  are wrapped in `ChartTooltip`. Timeline segments and legend rows call
  `onSegmentSelect` with segment and index when provided. `selectedIndex`
  highlights matching labels and dims non-selected segments. Legend rows are
  aggregated by label with accumulated duration.
- Docs-derived states and samples: default, selected segment, with markers, and
  compact. Sample copy includes 睡眠ステージ, 睡眠品質, 睡眠時間, 覚醒時間,
  浅い睡眠, 深い睡眠, レム, 覚醒, アラーム, 23:42, 07:18, +7%,
  ステージ時間, and values across `min=0` / `max=474`.
- Composition and usage boundaries: use SegmentTimelineCard for card-level
  categorical duration ranges such as sleep stages, uptime states, and delivery
  statuses with metrics or markers. Use `Timeline` for generic chronological
  item lists and `ActivityTimelineCard` for activity/event summaries.
- Runtime token notes: card shell, metrics, timeline surface, legend rows,
  marker, focus, and tooltip affordances use `card`, `card-foreground`,
  `background`, `foreground`, `muted`, `muted-foreground`, `border`, `accent`,
  `ring`, `success-strong`, `popover`, and `popover-foreground`; segment tones
  resolve through chart data or `primary`, `info`, `success`, `warning`, and
  `destructive` fallbacks.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, selected/markers states,
  props/defaults, runtime token notes, and related-chart usage boundary are
  aligned without visible overflow or overlap.

The next discovery target was then exported with the additional DonutChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `DonutChart / Section`: `434:2`
- `DonutChart / Library card`: `434:3`
- Placement: `Charts` page, after `SegmentTimelineCard / Section`, at
  `(40, 20222)`, `1280 x 1960`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `variant`, `centerLabel`, `centerValue`, `thickness`, `showLegend`,
  `formatValue`, `totalLabel`, `className`, and forwarded div attributes.
  Defaults are `variant="default"`, `thickness=variant==="compact"?18:24`,
  `showLegend=false`, `formatValue=defaultChartValueFormatter`, and
  `totalLabel="Total"`.
- Geometry and behavior: the default density uses `min-h-[192px] w-full p-0`
  and chart `max-w-48`; compact uses `min-h-[144px] w-full p-0` and
  `max-w-36`. The chart surface is an aspect-square rounded-full region with
  `role="img"`, `tabIndex=0`, and focus ring. The inner cutout uses
  `bg-card` inset by `thickness`; optional center value and label use
  foreground and muted text.
- Circular model: `normalizeCircularSegments` clamps negative values to zero,
  resolves total as `max(sum positives, 1)`, and maps segments to start/end
  percentages. `buildConicGradient` renders the segment gradient or muted
  fallback, while pointer hit testing ignores the inner cutout and outside
  radius before resolving the active segment and tooltip position.
- Interaction notes: focus opens the first segment tooltip, pointer and touch
  movement update the active segment, and the active overlay uses foreground /
  ring emphasis. `showLegend` renders `ChartLegend` with `activeIndex`.
- Docs-derived states and samples: default, with legend, compact, thick ring,
  formatted values, and dense. Sample copy includes コア, 成長, 継続, 拡張,
  プロダクト, 運用, サポート, 予備, 検索, SNS, メール, 広告, 提携,
  その他, 合計, 構成比, 予算, チャネル, 100, 100%, and 27.5万円.
- Composition and usage boundaries: use DonutChart for proportional
  part-to-whole circular segment comparison with optional center copy. Use
  PieChart for filled radial part-to-whole comparison without an inner cutout,
  DistributionBar for compact linear strips, and LabeledDonutCard /
  AnalyticsCard for card-level summaries.
- Runtime token notes: inner cutout and center text use `card`, `foreground`,
  and `muted-foreground`; focus and active affordances use `ring`,
  `background`, and `foreground`; tooltip chrome uses `popover` and
  `popover-foreground`; fallback and labels use `muted`; segment tones resolve
  through chart data or `primary`, `success`, `warning`, `info`, `accent`, and
  `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, legend / thick ring / formatted /
  dense states, props/defaults, runtime token notes, and related-chart usage
  boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional PieChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `PieChart / Section`: `439:2`
- `PieChart / Library card`: `439:3`
- Placement: `Charts` page, after `DonutChart / Section`, at `(40, 22230)`,
  `1280 x 1860`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `variant`, `showLegend`, `formatValue`, `totalLabel`, `className`,
  and forwarded div attributes. Defaults are `variant="default"`,
  `showLegend=false`, `formatValue=defaultChartValueFormatter`, and
  `totalLabel="Total"`.
- Geometry and behavior: the default density uses `min-h-[192px] w-full p-0`
  and chart `max-w-48`; compact uses `min-h-[144px] w-full p-0` and
  `max-w-36`. The chart surface is an aspect-square rounded-full region with
  `role="img"`, `tabIndex=0`, `shadow-sm`, and focus ring.
- Circular model: `normalizeCircularSegments` clamps negative values to zero,
  resolves total as `max(sum positives, 1)`, and maps segments to start/end
  percentages. `buildConicGradient` renders the full pie segment gradient or
  muted fallback; unlike DonutChart, PieChart hit testing only ignores outside
  radius because there is no inner cutout.
- Interaction notes: focus opens the first segment tooltip, pointer and touch
  movement update the active segment, touch / pen `pointerDown` opens sticky
  tooltip behavior, and the active overlay uses foreground / ring
  drop-shadow emphasis. `showLegend` renders `ChartLegend` with `activeIndex`.
- Docs-derived states and samples: default, with legend, compact, dense
  segments, zero-safe normalization, and AnalyticsCard composition. Sample copy
  includes 基盤, 成長, 継続, 拡張, 検索, SNS, メール, 広告, その他, 合計,
  流入元, オーディエンス比率, 329, 46, 28, 18, 8, 34, 22, 16, 12,
  100, 104, 51, and 74.
- Composition and usage boundaries: use PieChart for filled radial
  part-to-whole comparison where the whole circle carries the value. Use
  DonutChart when center copy or an inner cutout is needed, DistributionBar for
  compact linear strips, and AnalyticsCard / LabeledDonutCard for card-level
  summary compositions.
- Runtime token notes: segment tones resolve through chart data or `primary`,
  `success`, `warning`, `info`, `accent`, `destructive`, and `muted`; focus,
  active overlay, marker, and active legend affordances use `foreground`,
  `ring`, and `background`; tooltip chrome uses `popover` and
  `popover-foreground`; fallback and legend copy use `muted` and
  `muted-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, legend / dense / zero-safe /
  analytics-composition states, props/defaults, runtime token notes, and
  related-chart usage boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional GaugeChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `GaugeChart / Section`: `443:2`
- `GaugeChart / Library card`: `443:3`
- Placement: `Charts` page, after `PieChart / Section`, at `(40, 24138)`,
  `1280 x 1840`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `value`, optional
  `min`, `max`, `variant`, `color`, `label`, `valueLabel`, `thickness`,
  `formatValue`, `rangeLabel`, `className`, and forwarded div attributes.
  Defaults are `min=0`, `max=100`, `variant="default"`,
  `color=primary fallback`, `thickness=variant==="compact"?16:22`,
  `formatValue=defaultChartValueFormatter`, and `rangeLabel="Range"`.
- Geometry and behavior: the default density uses `h-[144px] w-full p-0` and
  chart `max-w-56`; compact uses `h-[112px] w-full p-0` and `max-w-44`.
  The chart surface is an aspect-[2/1] region with focus ring. The arc is a
  semi-circle conic-gradient from 270deg with muted track, active color, and a
  `bg-card` inner cutout sized from `thickness`.
- Gauge model: `range = max(max - min, 1)`, value clamps to min/max before
  display, `percent = normalizeChartValue(normalizedValue - min, range)`, and
  `degrees = percent / 100 * 180`. Custom `min` / `max` supports capacity and
  offset ranges such as `420GB / 500GB` and `-50pt - 50pt`.
- Interaction notes: pointer hit testing requires the pointer to be between
  inner radius and outer radius, within the active arc sweep, and within the
  180deg semi-circle. Focus opens the tooltip at `x=percent`, `y=24`; touch
  opens sticky tooltip behavior and focuses without scroll. The computed
  aria-label combines label, display value, rangeLabel, min, and max.
- Docs-derived states and samples: default, compact, capacity range, offset
  range, warning color, and critical. Sample copy includes スコア, 進捗, 容量,
  差分, 負荷, リスク, 範囲, 82%, 64%, 420GB, +12pt, 73%, and 91%.
- Composition and usage boundaries: use GaugeChart for one scalar score,
  progress, capacity, or bounded range reading. Use SegmentedGaugeCard when the
  semi-circle needs multiple labeled segments or a target value,
  ConcentricProgressCard for card-level multi-ring summaries, RadialBarChart
  for multiple radial series, and Statistic for a text-only current value.
- Runtime token notes: active arc tones resolve through `primary`, `success`,
  `warning`, `info`, `destructive`, or caller-provided chart color; track uses
  `muted`; inner cutout uses `card`; value and label use `foreground` and
  `muted-foreground`; focus and marker affordances use `ring` and
  `background`; tooltip chrome uses `popover` and `popover-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, capacity / offset / warning /
  critical states, props/defaults, runtime token notes, and related-chart usage
  boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
SegmentedGaugeCard component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `SegmentedGaugeCard / Section`: `446:2`
- `SegmentedGaugeCard / Library card`: `446:3`
- Placement: `Charts` page, after `GaugeChart / Section`, at `(40, 26026)`,
  `1280 x 2040`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`, plus
  optional `title`, `description`, `value`, `valueLabel`, `centerLabel`,
  `delta`, `deltaDescription`, `targetValue`, `targetLabel`, `caption`,
  `variant`, `selectedIndex`, `min`, `max`, `thickness`, `showLegend`,
  `formatValue`, `totalLabel`, `onSegmentSelect`, `className`, and forwarded
  Card props. Defaults are `title="Segmented gauge"`,
  `targetLabel="Target"`, `variant="default"`, `min=0`,
  `max=max(segmentTotal, 1)`, `thickness=variant==="compact"?18:24`,
  `showLegend=true`, `formatValue=defaultChartValueFormatter`, and
  `totalLabel="Total"`.
- Geometry and behavior: the default density uses `rounded-lg`, header
  `p-5 pb-3`, content `px-5 pb-5`, chart `max-w-72`, and 24px gauge
  thickness; compact uses `rounded-md`, header `p-4 pb-3`, content
  `px-4 pb-4`, chart `max-w-56`, and 18px gauge thickness. The chart surface
  is an aspect-[2/1] region with focus ring and a semi-circle conic-gradient
  from 270deg, muted track, segment fills, selected foreground outline, and a
  `bg-card` inner cutout sized from `thickness`.
- Gauge model: segments are normalized by `resolvedMax`, positive values only,
  and rendered across the 180deg semicircle. `value` clamps to `min` /
  `resolvedMax` before display. `targetValue` normalizes against the same
  range and renders a dashed guide with `ChartTooltip`.
- Interaction notes: pointer and touch hit testing require the pointer to be
  within the gauge ring, within the 180deg sweep, and inside a segment range.
  Focus opens the first or selected segment tooltip; touch uses sticky tooltip
  behavior; Enter / Space and legend clicks call `onSegmentSelect` when
  provided. `ChartFloatingTooltip` follows the active segment position.
- Docs-derived states and samples: default, selected segment, no legend, and
  compact. Sample copy includes 支出内訳, セグメントゲージ, 現在の支出,
  目標支出, 合計, 基礎費, 成長投資, 運用費, 固定費, 追加投資, 運用余力,
  Spend breakdown, Current spend, Target spend, Essentials, Growth, and
  Operations.
- Composition and usage boundaries: SegmentedGaugeCard composes Card,
  CardHeader, CardContent, CardTitle, CardDescription, ChartTooltip,
  ChartFloatingTooltip, and chart-utils. Use SegmentedGaugeCard when a
  semi-circle gauge needs multiple labeled ranges and an optional target value;
  use GaugeChart for one scalar score, RadialBarChart for multiple radial
  series, and Statistic for a text-only current value.
- Runtime token notes: card shell and inner cutout use `card` /
  `card-foreground`; copy uses `foreground` and `muted-foreground`; track and
  caption use `muted`; border and focus affordances use `border`, `ring`, and
  `background`; tooltip chrome uses `popover` and `popover-foreground`;
  segment tones resolve through chart data or `primary`, `success`, `warning`,
  `info`, `accent`, and `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, selected / no-legend / compact
  states, props/defaults, runtime token notes, and related-chart usage boundary
  are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional RadarChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `RadarChart / Section`: `451:2`
- `RadarChart / Library card`: `451:3`
- Placement: `Charts` page, after `SegmentedGaugeCard / Section`, at
  `(40, 28114)`, `1280 x 1940`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `data`, optional
  `series`, `variant`, `max`, `color`, `showGrid`, `showLabels`, `showDots`,
  `fillOpacity`, `formatValue`, `maxLabel`, `className`, and forwarded div
  attributes. Defaults are `variant="default"`, `showGrid=true`,
  `showLabels=true`, `showDots=true`, `fillOpacity=0.16`,
  `formatValue=defaultChartValueFormatter`, and `maxLabel="Max"`.
- Geometry and behavior: the default density uses `h-[256px] w-full p-0`;
  compact uses `h-[208px] w-full p-0`. The inner chart is an aspect-square
  surface with `max-h-full` and `max-w-full`, a `viewBox="0 0 100 100"`, and
  `preserveAspectRatio="none"`.
- Radar model: `minimumAxisCount=3`, `chartCenter=50`, `chartRadius=34`, and
  `labelRadius=45`. `maxValue` resolves to the max of the optional `max`, all
  series values, and `1`. Values normalize through `normalizeChartValue`.
  Grid rings render at 25%, 50%, 75%, and 100%, with axis lines from center to
  each axis endpoint.
- Interaction notes: each rendered point has a 28px focus target wrapped in
  `ChartTooltip`. The tooltip aria-label combines optional series label, point
  label, formatted value, `maxLabel`, and formatted max value. Dots use
  background fill and series stroke; labels are derived from the first series.
- Docs-derived states and samples: default, as-is / to-be, compact, success
  color, and minimal. Sample copy includes 到達, 品質, 売上, 継続, 速度,
  リスク, STR, DEX, INT, VIT, AGI, LUK, 現在, 成長後, 最大, Reach, Quality,
  Revenue, Retention, Speed, Risk, As-is, To-be, and Max.
- Composition and usage boundaries: RadarChart composes an internal SVG,
  optional axis labels, optional dot targets, `ChartTooltip`, and chart-utils.
  Use RadarChart for multi-axis score shape comparison, ChartLegend for
  multi-series explanation, RadialBarChart for radial series values, and
  QuadrantMatrix for x/y item positioning.
- Runtime token notes: grid rings and axes use `border` with alpha; dot fill
  uses `background`; point focus affordances use `ring` and `background`; axis
  labels use `muted-foreground`; tooltip chrome uses `popover` and
  `popover-foreground`; series colors resolve through chart data or `primary`,
  `success`, `warning`, `info`, `accent`, `destructive`, and `muted`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, multi-series / compact / success /
  minimal states, props/defaults, runtime token notes, and related-chart usage
  boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional HeatmapChart
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `HeatmapChart / Section`: `454:2`
- `HeatmapChart / Library card`: `454:3`
- Placement: `Charts` page, after `RadarChart / Section`, at `(40, 30102)`,
  `1280 x 2040`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `data`, `xLabels`,
  and `yLabels`, optional `summary`, `variant`, `max`, `summaryMax`, `color`,
  `selectedCell`, `showValues`, `showSummaryValues`, `formatValue`,
  `summaryLabel`, `onCellSelect`, `className`, and forwarded div attributes.
  Defaults are `variant="default"`, `showValues=false`,
  `showSummaryValues=true`, and
  `formatValue=defaultChartValueFormatter`.
- Geometry and behavior: the default density uses `w-full p-0`, 32px minimum
  cells, and `rounded-md` cells; compact uses `w-full p-0`, 24px minimum
  cells, and `rounded` cells. The y-axis label column is `2.75rem`, x labels
  align above the grid, and optional summary bars reserve a minimum 56px row.
- Heatmap model: cells are keyed by `${x}::${y}` and normalized against
  `maxValue`, which resolves from optional `max`, all cell values, and `1`.
  Summary bars normalize against `summaryMax` or summary values and map
  opacity from `0.35` to `1`.
- Interaction notes: cells render as buttons when `onCellSelect` is provided
  and the cell exists; otherwise they render as focusable spans. Selected cells
  use a foreground ring with background ring offset. `ChartTooltip` wraps cells
  and summary bars, and value chips appear when `showValues` or
  `showSummaryValues` is enabled.
- Docs-derived states and samples: default, summary, values, selected cell,
  compact, and alternate color. Sample copy includes 月, 火, 水, 木, 金, 土,
  日, 00, 04, 08, 12, 16, 20, ピーク, 混雑度, Mon, Tue, Wed, Thu, Fri, Sat,
  Sun, and Peak.
- Composition and usage boundaries: HeatmapChart composes grid labels,
  optional summary bars, optional cell values, `ChartTooltip`, and chart-utils.
  Use HeatmapChart for two-dimensional intensity matrices, ActivityTimelineCard
  for chronological activity summaries, DistributionBar for one-dimensional
  distributions, and RadarChart for multi-axis score comparisons.
- Runtime token notes: default cell color resolves through chart data or
  `primary`; selected focus affordances use `foreground`, `background`, and
  `ring`; labels use `muted-foreground`; grid surfaces and annotations use
  `background`, `border`, and `muted`; tooltip chrome uses `popover` and
  `popover-foreground`; alternate chart colors use `success`, `warning`,
  `info`, `accent`, and `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, summary / value / selected /
  compact / alternate-color states, props/defaults, runtime token notes, and
  related-chart usage boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
ActivityTimelineCard component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `ActivityTimelineCard / Section`: `458:2`
- `ActivityTimelineCard / Library card`: `458:3`
- Placement: `Charts` page, after `HeatmapChart / Section`, at `(40, 32190)`,
  `1280 x 2140`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `metrics`,
  `slots`, and `segments`, optional `title`, `description`, `delta`,
  `deltaDescription`, `caption`, `variant`, `max`, `selectedSlot`,
  `showSlotValues`, `formatValue`, `totalLabel`, `onSlotSelect`, `className`,
  and inherited Card props. Defaults are `title="Activity timeline"`,
  `variant="default"`, `showSlotValues=false`,
  `formatValue=defaultChartValueFormatter`, and `totalLabel="Total"`.
- Geometry and behavior: the default density uses `rounded-lg`, header
  `p-5 pb-3`, content `px-5 pb-5`, title `text-base`, timeline `h-36`, and
  rounded timeline bars; compact uses `rounded-md`, header `p-4 pb-3`,
  content `px-4 pb-4`, title `text-sm`, timeline `h-28`, and tighter bar
  rounding. Metrics render as a 3-column summary row, timeline bars align to a
  dashed baseline, segment totals render as a stacked horizontal progress bar,
  and optional caption renders as muted supporting copy.
- Timeline model: slot values are clamped to positive numbers and normalized
  against optional `max`, the largest slot value, and `1`. Per-slot segment
  stacks normalize against each slot segment total. Bottom segment controls
  normalize against the total of `segments`.
- Interaction notes: metrics, slots, segment bars, and segment statistic rows
  are tooltip targets. Slots render as buttons when `onSlotSelect` is provided
  and expose `aria-current` / `aria-pressed`; otherwise they render as
  focusable spans. Segment hover/focus/selection is shared between the stacked
  progress bar and stat rows and dims inactive segments.
- Docs-derived states and samples: default, selected time slot with slot
  values, compact, and caption examples. Sample copy includes 活動量タイムライン,
  選択中の時間帯, コンパクト表示, 時間帯別の活動量, 昨日比, 消費, 日平均,
  ウォーク, ラン, ワークアウト, 6時, 8時, 10時, 12時, 14時, 16時, Energy
  timeline, Than yesterday, Burned, Daily avg, Walking, Running, Workout,
  Total, and Inspect the selected time slot load and segment contribution.
- Composition and usage boundaries: ActivityTimelineCard composes Card,
  CardHeader, CardContent, CardTitle, CardDescription, ChartTooltip, and
  chart-utils. Use ActivityTimelineCard when a metric card needs chronological
  activity slots plus segment contribution controls; use SegmentTimelineCard
  for horizontal state-duration timelines, Timeline for event lists,
  DistributionBar for one-dimensional distribution, and BarChart for generic
  categorical bars.
- Runtime token notes: card shell uses `card` and `card-foreground`; metric,
  title, and segment copy use `foreground` and `muted-foreground`; timeline
  track, caption, and selected stat backgrounds use `muted`, `border`, and
  `background`; positive delta uses `success-strong`; focus and selected slot
  affordances use `ring`, `foreground`, and `background`; tooltip chrome uses
  `popover` and `popover-foreground`; chart colors resolve through `primary`,
  `success`, `warning`, `info`, `accent`, and `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default / selected / compact /
  caption states, props/defaults, runtime token notes, and related-chart usage
  boundary are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional
LabeledDonutCard component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `LabeledDonutCard / Section`: `461:2`
- `LabeledDonutCard / Library card`: `461:3`
- Placement: `Charts` page, after `ActivityTimelineCard / Section`, at
  `(40, 34378)`, `1280 x 2160`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `segments`,
  optional `title`, `description`, `centerValue`, `centerLabel`, `delta`,
  `deltaDescription`, `caption`, `variant`, `selectedIndex`, `thickness`,
  `showCallouts`, `formatValue`, `totalLabel`, `onSegmentSelect`,
  `className`, and inherited Card props. Defaults are
  `title="Sales by platform"`, `variant="default"`,
  `thickness=24` or `18` in compact, `showCallouts=true`,
  `formatValue=defaultChartValueFormatter`, and `totalLabel="Total"`.
- Geometry and behavior: the default density uses `rounded-lg`, header
  `p-5 pb-3`, content `px-5 pb-5`, title `text-base`, chart `max-w-52`, and
  24px default ring thickness; compact uses `rounded-md`, header `p-4 pb-3`,
  content `px-4 pb-4`, title `text-sm`, chart `max-w-40`, and 18px default
  ring thickness. With callouts, the chart/callout area uses a responsive grid;
  without callouts, the chart centers in a `max-w-xs` region.
- Donut model: `normalizeCircularSegments` resolves the conic-gradient segment
  ranges, `buildConicGradient` paints the ring, and the center cutout uses
  `bg-card` inset by `thickness`. The selected or hovered segment can produce
  an active overlay via `buildActiveCircularSegmentGradient`.
- Interaction notes: the ring exposes `role="button"` when `onSegmentSelect`
  exists and `role="img"` otherwise. Pointer/touch hit testing requires the
  pointer to be inside the donut ring and uses the polar angle to resolve the
  active segment. Focus opens the selected or first segment tooltip; Enter /
  Space triggers `onSegmentSelect`. Callout rows mirror active state and also
  call `onSegmentSelect` when clicked.
- Docs-derived states and samples: default, selected segment, without
  callouts, compact, formatted values, and caption. Sample copy includes
  プラットフォーム別売上, ラベル付きドーナツ, 合計, 予算配分, 予算, Amazon,
  Alibaba, Tokopedia, プロダクト, 運用, サポート, 予備, 販売チャネル,
  Sales by platform, Labeled donut, Total, Budget allocation, Product,
  Operations, Support, Reserve, and Compare segment share with external callout
  labels.
- Composition and usage boundaries: LabeledDonutCard composes Card,
  CardHeader, CardContent, CardTitle, CardDescription, ChartTooltip,
  ChartFloatingTooltip, circular-chart-utils, and chart-utils. Use
  LabeledDonutCard when a card-level donut needs center summary and external
  callout rows; use DonutChart for standalone donut charts, PieChart for
  full-disk composition charts, ChartLegend for separate legend explanation,
  and AnalyticsCard for generic chart card shells.
- Runtime token notes: card shell and center cutout use `card` and
  `card-foreground`; copy uses `foreground` and `muted-foreground`; callout
  rows, selected row backgrounds, and caption use `card`, `muted`, `border`,
  and `background`; positive delta uses `success-strong`; focus and active
  affordances use `ring` and `foreground`; tooltip chrome uses `popover` and
  `popover-foreground`; segment colors resolve through `primary`, `success`,
  `warning`, `info`, `accent`, and `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default / selected /
  no-callouts / compact / formatted / caption states, props/defaults, runtime
  token notes, and related-chart usage boundary are aligned without visible
  overflow or overlap.

The next discovery target was then exported with the additional
RetentionCohortCard component data. The owner reaffirmed that the destination
Figma file is the company design-system source of truth and that reflecting
private repository component specs into that file is the approved first-party
workflow.

Figma export:

- `RetentionCohortCard / Section`: `466:2`
- `RetentionCohortCard / Library card`: `466:3`
- Placement: `Charts` page, after `LabeledDonutCard / Section`, at
  `(40, 36586)`, `1280 x 2220`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `cohorts` and
  `periods`, optional `title`, `description`, `value`, `delta`,
  `deltaDescription`, `caption`, `variant`, `max`, `color`, `selectedCell`,
  `showValues`, `formatValue`, `formatSize`, `onCellSelect`, `className`, and
  inherited Card props. Defaults are `title="User retention"`,
  `variant="default"`, `color="warning"`, `showValues=true`,
  `formatValue=defaultPercentFormatter`, and
  `formatSize=defaultChartValueFormatter`.
- Geometry and behavior: default density uses `rounded-lg`, header `p-5 pb-3`,
  content `px-5 pb-5`, cell `min-h-8 rounded-md`, and title `text-base`;
  compact uses `rounded-md`, header `p-4 pb-3`, content `px-4 pb-4`, cell
  `min-h-6 rounded`, and title `text-sm`. The grid uses a row-label column
  plus `repeat(var(--retention-period-count), ...)`, with horizontal overflow
  protection for narrow containers.
- Cohort model: each value is normalized against `max` or the observed maximum
  and converted to cell opacity with `0.08 + normalized * 0.92`. Missing cells
  render transparent placeholders, `showValues=false` hides the value chip
  while preserving intensity, and `formatValue` / `formatSize` customize the
  tooltip and displayed values.
- Interaction notes: cells render as `button` when `onCellSelect` exists and
  otherwise as focusable `span` inside `ChartTooltip`. `selectedCell` adds
  `aria-current`, selected ring treatment, and matches docs selected-cell
  samples. The tooltip label combines cohort and period labels.
- Docs-derived states and samples: default, selected cell, no values, and
  compact. Sample copy includes コホート継続率, 初月, 1か月, 2月コホート,
  期間別の継続率をコホートごとに比較します。, Cohort retention, Jan cohort,
  Feb cohort, M0-M7, and Compare period retention across cohorts.
- Composition and usage boundaries: RetentionCohortCard composes Card,
  CardHeader, CardContent, CardTitle, CardDescription, ChartTooltip, and
  chart-utils. Use RetentionCohortCard for card-level retention cohort analysis
  with metric header and hover/focus cell tooltips; use HeatmapChart for
  generic heatmaps and Table for non-intensity-encoded tabular data.
- Runtime token notes: card shell uses `card`, `card-foreground`, `border`,
  `shadow-sm`, and radius semantics; copy uses `foreground`,
  `muted-foreground`, and `success`; cells use `muted`, `background/75`,
  `ring`, `foreground`, and `background`; tooltip chrome uses `popover` and
  `popover-foreground`; chart colors resolve through `primary`, `success`,
  `warning`, `info`, and `destructive`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default / selected-cell /
  no-values / compact states, props/defaults, runtime token notes, and
  HeatmapChart / Table usage boundary are aligned without visible overflow or
  overlap.

The next discovery target was then exported with the additional ChoroplethMap
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `ChoroplethMap / Section`: `469:2`
- `ChoroplethMap / Library card`: `469:3`
- Placement: `Charts` page, after `RetentionCohortCard / Section`, at
  `(40, 38854)`, `1280 x 2340`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `regions`,
  optional `markers`, `variant`, `max`, `color`, `selectedId`, `showRanking`,
  `rankingLimit`, `showSelectedRegion`, `preserveAspectRatio`, `formatValue`,
  `selectedLabel`, `rankLabel`, `onRegionSelect`, `onMarkerSelect`,
  `className`, and inherited HTML attributes. Defaults are `markers=[]`,
  `variant="default"`, `color="destructive"`, `showRanking=true`,
  `rankingLimit=6`, `showSelectedRegion=true`, `preserveAspectRatio=true`,
  `formatValue=defaultChartValueFormatter`, `selectedLabel="Selected"`,
  and `rankLabel="Rank"`.
- Geometry and behavior: regions accept GeoJSON-style `Polygon` and
  `MultiPolygon` coordinates, while markers use projected coordinates or
  normalized `x` / `y` percentages. `computeBounds` includes region exterior
  rings plus marker coordinates, falls back to `0..100` bounds, and
  `projectCoordinate` clamps values into percent positions.
  `preserveAspectRatio` keeps geography from stretching inside the panel.
- Layout notes: the root is `w-full p-0`; the map panel is `rounded-md`,
  `border`, and `bg-muted/20`. The default panel uses `min-h-72`, compact uses
  `min-h-56`, and the ranking layout splits at `640px` with
  `minmax(0,1.35fr)` and `minmax(min(42%,18rem),0.85fr)`.
- Interaction notes: regions and ranking rows render as `button` when
  `onRegionSelect` exists and otherwise as focusable spans inside
  `ChartTooltip`. Markers render as `button` when `onMarkerSelect` exists and
  otherwise as focusable spans. `selectedId` adds `aria-current`, stronger
  foreground outline treatment, and selected ranking emphasis.
- Docs-derived states and samples: default, markers and selection, compact,
  alternate color, and map-only. Sample copy includes 塗り分け地図, 新宿, 渋谷,
  千代田, 港, 新宿駅, 渋谷交差点, 東京駅, 選択中, 順位, Tokyo incident density
  by ward, Shinjuku, Shibuya, Shinjuku station, Shibuya crossing, Selected,
  and Rank.
- Composition and usage boundaries: ChoroplethMap composes ChartTooltip and
  chart-utils. Use it for regional density and location ranking; use
  HeatmapChart for matrix heatmaps, RetentionCohortCard for cohort retention
  tables, Table for raw tabular data, and AnalyticsCard for generic chart card
  shells.
- Runtime token notes: map panel uses `muted/20` and `border`; map outlines
  use `foreground` at low opacity or selected emphasis; selected cards and
  ranking rows use `card`, `muted-foreground`, and `border`; top rank badges
  use `primary-subtle` and `primary-subtle-foreground`; markers use
  `background` and `foreground`; tooltip chrome uses `popover` and
  `popover-foreground`; chart colors resolve through `destructive`, `info`,
  `success`, `warning`, `muted`, and related chart color helpers.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default / markers / compact /
  alternate-color / map-only states, props/defaults, runtime token notes, and
  HeatmapChart / RetentionCohortCard / Table / AnalyticsCard usage boundaries
  are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional QuadrantMatrix
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `QuadrantMatrix / Section`: `472:2`
- `QuadrantMatrix / Library card`: `472:3`
- Placement: `Charts` page, after `ChoroplethMap / Section`, at
  `(40, 41242)`, `1280 x 2280`.
- Variant contract: generated variants are `default` and `compact`; the
  default variant is `default`.
- Source contract: the recorded prop surface covers required `items`, optional
  `variant`, `max`, `color`, `selectedId`, `showRanking`, `rankingLimit`,
  `xAxisLabel`, `yAxisLabel`, `quadrantLabels`, `formatValue`,
  `onItemSelect`, `rankingPlacement`, `className`, and inherited HTML
  attributes. Defaults are `variant="default"`, `showRanking=true`,
  `rankingLimit=5`, `formatValue=defaultChartValueFormatter`, and
  `rankingPlacement="side"`.
- Data model: each item has `id?`, `label`, `value`, `x`, `y`, `color?`, and
  `description?`. `x` and `y` are clamped percentage coordinates and rendered
  with absolute positioning plus `translate(-50%, -50%)`. `value` is normalized
  against `max` or the observed maximum to determine point size and ranking
  progress.
- Layout notes: the root is `w-full p-0`; the matrix panel is `relative`,
  `rounded-md`, `border`, and `bg-muted/20`. The default panel uses
  `min-h-56`, compact uses `min-h-44`, and side ranking uses
  `md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)]`. Bottom ranking stacks
  the ordered list below the matrix for narrower containers.
- Interaction notes: points and ranking rows render as `button` when
  `onItemSelect` exists and otherwise as focusable spans inside `ChartTooltip`.
  `selectedId` adds `aria-current`, `ring-2 ring-foreground` on the point, and
  `ring-1 ring-foreground` on the matching ranking row. Focus-visible rings
  use `ring` with `ring-offset-background`.
- Docs-derived states and samples: default, selected item, bottom ranking, and
  compact. Sample copy includes 4象限マトリクス, 活性化, 拡張, 継続, リスク,
  戦略, 拡大, 見直し, 効率, 到達範囲, 影響度, QuadrantMatrix, Activation,
  Expansion, Retention, Risk, Strategic, Scale, Review, Efficient, Reach, and
  Impact.
- Composition and usage boundaries: QuadrantMatrix composes ChartTooltip and
  chart-utils. Use it for two-axis item positioning and ranked values; use
  ChoroplethMap for geographic region density, HeatmapChart for matrix
  intensity grids, RadarChart for multi-axis normalized score shapes, and
  AnalyticsCard for reusable card chrome around chart content.
- Runtime token notes: quadrant backgrounds use `muted/20` and `muted/10`;
  axes and panel borders use `border`; point strokes and selected rings use
  `background`, `foreground`, and `ring`; ranking rows use `card`, `border`,
  `muted`, `muted-foreground`, and `primary-border`; chart colors resolve
  through `primary`, `success`, `warning`, `info`, `destructive`, and `accent`;
  tooltip chrome uses `popover` and `popover-foreground`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the
  `default` / `compact` variant contract, default / selected / bottom /
  compact states, props/defaults, coordinate and ranking model, runtime token
  notes, and ChoroplethMap / HeatmapChart / RadarChart / AnalyticsCard usage
  boundaries are aligned without visible overflow or overlap.

The next discovery target was then exported with the additional AnalyticsCard
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `AnalyticsCard / Section`: `475:2`
- `AnalyticsCard / Library card`: `475:14`
- Placement: `Charts` page, after `QuadrantMatrix / Section`, at
  `(40, 43570)`, `1280 x 2360`.
- Variant contract: generated variants are `default`, `positive`,
  `riskIncrease`, and `flatWithFooter`; the default variant is `default`.
- Source contract: the recorded prop surface covers required `title`, optional
  `titleAs`, `description`, `value`, `delta`, `deltaDescription`, `trend`,
  `variant`, `action`, `footer`, `children`, `className`, and inherited Card
  props. Defaults are `variant=analyticsCardDefaultVariantKey` (`default`) and
  `trend="flat"`.
- Layout notes: the root composes `Card` with `w-full min-w-0 p-0`. Header
  uses `flex-row items-start justify-between gap-4 space-y-0`; content uses
  `space-y-4`; the metric row uses `flex min-w-0 flex-wrap items-start
  justify-between gap-x-3 gap-y-1`; value uses `text-2xl font-bold
  leading-tight tracking-tight`; delta icons use `h-3 w-3`; `flatWithFooter`
  adds a footer with `border-t pt-4 text-xs text-muted-foreground`.
- Delta interaction notes: `deltaDescription` switches delta from static text to
  a tooltip trigger button. The trigger keeps semantic trend tone and
  focus-visible `ring-ring` with `ring-offset-background`; TooltipContent uses
  `max-w-56 text-left text-xs`.
- Docs-derived states and samples: up trend / positive, risk increase /
  destructive, and flat trend with footer. Sample copy includes 売上,
  直近12か月, 128,430円, +12.4%, 解約リスク, 現在のコホート, 8.6%,
  +2.1pt, アクティブユーザー, 日次平均, 24,180, 0.2%, and 5分前に更新.
- Composition and usage boundaries: AnalyticsCard composes Card, CardHeader,
  CardContent, CardFooter, CardTitle, CardDescription, Tooltip, TooltipTrigger,
  TooltipContent, and trend icons. Use it as chart card chrome for
  SparklineChart, DistributionBar, and other compact chart children; use
  Statistic for a single current value without chart context. Icon-only action
  slots should use TooltipButton or equivalent GunjoUI tooltip coverage.
- Runtime token notes: base Card uses `card`, `card-foreground`, `border`, and
  `muted-foreground`; positive variant uses `success-subtle`,
  `success-border`, and `success-strong`; risk increase uses
  `destructive-subtle`, `destructive-border`, and `destructive`; flat footer
  uses `muted/20`, `border`, and `muted-foreground`; tooltip/focus behavior
  uses `popover`, `popover-foreground`, `ring`, and `background`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the four
  variant states, trend model, props/defaults, tooltip behavior, token notes,
  and Statistic / chart-child usage boundaries are aligned without visible
  overflow or overlap.

The next discovery target was then exported with the additional Alert component
data. The owner reaffirmed that the destination Figma file is the company
design-system source of truth and that reflecting private repository component
specs into that file is the approved first-party workflow.

Figma export:

- `Alert / Section`: `478:2`
- `Alert / Library card`: `478:14`
- Placement: `Feedback` page, after the category header, at `(40, 368)`,
  `1280 x 2260`.
- Variant contract: generated variants are `default`, `destructive`, `info`,
  `success`, and `warning`; the default variant is `default`.
- Source contract: the recorded family covers `Alert`, `AlertTitle`, and
  `AlertDescription`. `Alert` extends div HTML attributes plus `variant` and
  always renders `role="alert"`. `AlertTitle` extends heading HTML attributes
  with `as`, defaulting to `"h5"`. `AlertDescription` extends div HTML
  attributes and marks the node with `data-alert-description`.
- Layout notes: the root uses `relative inline-flex h-fit w-full flex-col
  items-center gap-1 rounded-lg border px-4 py-3 text-sm`; direct children
  self-start; icon children are absolutely positioned at `left-4 top-3`;
  content after an icon gets `w-full pl-7`. Title uses `min-h-4`,
  `font-medium font-semibold`, `leading-none`, and `tracking-tight`;
  description uses `text-xs leading-relaxed`.
- Docs-derived states and samples: standard display, info, success, warning,
  destructive/error, and title-only. Sample copy includes CLIで追加できます,
  必要なコンポーネントを選んで、プロジェクトへ追加できます。仕様を確認できます,
  保存しました, 公開前に確認してください, セッションが切れました,
  続行するには、もう一度ログインしてください。, and 下書きを保存しました.
- Composition and usage boundaries: Alert composes icon content, AlertTitle,
  and AlertDescription. Use Alert for urgent or status-bearing inline feedback;
  use Banner for page-wide announcements, Toast for transient feedback, DocNote
  for documentation prose, and AlertDialog for blocking decisions.
- Runtime token notes: default uses `background`, `foreground`, `border`, and
  `muted-foreground`; semantic variants use the matching `info`, `success`,
  `warning`, or `destructive` token families with `*-subtle`,
  `*-subtle-foreground`, and `*-border`. Descriptions use the subtle foreground
  at 85% opacity for semantic variants.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the five
  variant states, title-only state, role/compound structure, token notes, and
  Banner / Toast / DocNote / AlertDialog usage boundaries are aligned without
  visible overflow or overlap.

The next discovery target was then exported with the additional Progress
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `Progress / Section`: `480:2`
- `Progress / Library card`: `480:14`
- Placement: `Feedback` page, after `Alert / Section`, at `(40, 2676)`,
  `1280 x 2140`.
- Variant contract: generated variant is `bar`; the default variant is `bar`.
- Source contract: the recorded prop surface covers `value`, `max`, `label`,
  `valueText`, `className`, `aria-label`, and inherited div HTML attributes.
  Defaults are `value=0`, `max=100`, and `safeMax=100` when `max <= 0`.
- Accessibility notes: root renders `role="progressbar"`; `aria-label` uses
  explicit `aria-label` first and falls back to `label`; `valueText` maps to
  `aria-valuetext`; `aria-valuemin=0`, `aria-valuemax=safeMax`, and
  `aria-valuenow=value`. Progress needs an accessible name via `label` or
  `aria-label`.
- Layout notes: root uses `relative h-4 w-full overflow-hidden rounded-full
  bg-secondary`; the indicator uses `h-full w-full flex-1 bg-foreground
  transition-all`; displayed percentage is clamped with
  `Math.min(100, Math.max(0, ((value || 0) / safeMax) * 100))`; the indicator
  position is expressed through `transform: translateX(-(100 - percentage)%)`.
- Docs-derived states and samples: in progress, dynamic progress, early
  progress, complete, and custom max. Sample copy includes アップロード, 66%,
  残り 4 ファイルを処理しています。, キューを準備しています。,
  すべてのファイルを処理しました。, ストレージ, 42 / 64 GB,
  ファイルアップロード進捗, 一時停止, 再開, 失敗を再現, and やり直す.
- Composition and usage boundaries: Progress renders the current determinate
  value only; the parent owns running, paused, failed, retry, and complete
  status text/actions. Use Spinner for indeterminate waiting, Skeleton for
  loading placeholders, and ProgressWidget when the progress bar belongs inside
  a metric card.
- Runtime token notes: root track uses `secondary`; indicator uses
  `foreground`; surrounding labels and helper copy use `foreground` and
  `muted-foreground`; specimen annotations use `background`, `border`, and
  `ring`.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed the `bar`
  variant, value/max clamp model, ARIA contract, docs states, token notes, and
  Spinner / Skeleton / ProgressWidget usage boundaries are aligned without
  visible overflow or overlap.

The next discovery target was then exported with the additional StatusScreen
component data. The owner reaffirmed that the destination Figma file is the
company design-system source of truth and that reflecting private repository
component specs into that file is the approved first-party workflow.

Figma export:

- `StatusScreen / Section`: `484:2`
- `StatusScreen / Library card`: `484:16`
- Placement: `Feedback` page, after `Progress / Section`, at `(40, 4864)`,
  `1280 x 2360`.
- Variant contract: generated variants are `not-found`, `error`,
  `offline`, `forbidden`, `maintenance`, and `coming-soon`; the default
  variant is `not-found`.
- Source contract: the recorded prop surface covers `variant`, `code`,
  `icon`, `title`, `description`, `action`, `details`,
  `headingLevel`, `className`, `children`, and inherited div HTML
  attributes. `headingLevel` defaults to `1`; unknown variants fall back to
  the `not-found` preset.
- Preset behavior: `not-found` and `error` are code-led defaults with `404`
  and `500`; `forbidden` uses destructive status semantics; `offline`,
  `maintenance`, and `coming-soon` are icon-led in docs examples.
- Layout notes: root uses `flex min-h-[60vh] w-full flex-col items-center
  justify-center gap-4 p-8 text-center`; status code uses `text-7xl
  font-extrabold tracking-tight`; icon slot is `h-16 w-16` and
  `aria-hidden=true`; description is constrained with `max-w-md`; details use
  `pre` with muted background, monospace text, and horizontal overflow.
- Accessibility notes: title renders through `h${headingLevel}`, defaulting to
  full-page `h1`; callers can lower heading level for nested surfaces while
  preserving screen-reader heading navigation.
- Docs-derived states and samples: not found, error, offline, forbidden,
  maintenance, coming soon, and migration note. Sample copy includes ページが見つかりません,
  URLが変更されたか、ページが削除された可能性があります。, トップへ戻る, 問題が発生しました,
  再読み込みしても解消しない場合は、サポートへ連絡してください。, req-id 7f3c9a,
  オフラインです, 再接続する, アクセスできません, メンテナンス中です, 準備中です,
  and 旧テンプレート API は StatusScreen に統合しました.
- Composition and usage boundaries: StatusScreen is for full-page terminal or
  fallback states; EmptyState is for contained empty regions; Alert is for inline
  feedback; Toast is for transient feedback. Button supplies recovery actions,
  and Icon supplies state illustration.
- Runtime token notes: default code and title use `foreground`; destructive
  status code and icon tone use `destructive`; icon-led non-destructive states
  use `muted-foreground`; details use `muted` and `muted-foreground`;
  specimen annotations also record `background`, `border`, `ring`,
  `primary`, `primary-foreground`, and `secondary` for composed Button and
  frame treatments.
- Validation: Figma absolute bounds check returned `outOfBoundsCount: 0`,
  `fixedSizeTextCount: 0`, `childOverflowCount: 0`, and
  `suspiciousOverlapCount: 0`; layout metadata review confirmed all six
  variants, prop/defaults, heading semantics, docs states, token notes, and
  StatusScreen / EmptyState / Alert / Toast usage boundaries are aligned without
  visible overflow or overlap.

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
   PasswordGroup, PhoneInput, PostalCodeInput, SearchInput, InputOTP, Calendar,
   FilterButton, SortButton, EditableField, Form, Combobox, DatePicker,
   DateRangePicker, TimePicker, TagInput, Mention, FileUploader, ImagePreview,
   ToolPill, Code, EmptyState, Tag, Icon, ColorSwatch, and Carousel
   and DataTable, ActionDataTable, AvatarGroup, CodeBlock, Timeline,
   TreeView, FileTree, DocNote, AssetCard, AssetGrid, TagEditor, ChartLegend,
   SparklineChart, LineChart, RibbonChart, RadialBarChart, BarChart, and
   ConcentricProgressCard, StackedBarChart, DistributionBar,
   MiniDistributionBarCard, SegmentTimelineCard, DonutChart, PieChart, and
   GaugeChart, SegmentedGaugeCard, RadarChart, HeatmapChart, and
   ActivityTimelineCard, LabeledDonutCard, RetentionCohortCard, ChoroplethMap, QuadrantMatrix, AnalyticsCard, Alert, Progress, and StatusScreen components,
   runtime semantic colors, and specimen treatments are acceptable.
3. Continue with the core component sequence from
   `docs/figma-library-discovery.md`, one component/family at a time.

Do not publish the Figma library until the owner has reviewed the file manually.
