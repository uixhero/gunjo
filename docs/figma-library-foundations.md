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

## Next Figma Step

Before creating the next component:

1. Review the Figma file manually.
2. Confirm the Button, TooltipButton, CopyButton, Input, Checkbox, Switch,
   RadioGroup, Select, Slider, Textarea, Badge, Avatar, Separator, Card,
   Accordion, AccordionGroup, List, MarkdownRenderer, MetadataList, Rating,
   RevealSection, and SearchableAccordion components, runtime semantic colors,
   and specimen treatments are acceptable.
3. Continue with the core component sequence from
   `docs/figma-library-discovery.md`, one component/family at a time.

Do not publish the Figma library until the owner has reviewed the file manually.
