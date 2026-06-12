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

## Next Figma Step

Before creating the next component:

1. Review the Figma file manually.
2. Confirm the Button, TooltipButton, CopyButton, Input, Checkbox, Switch, and
   RadioGroup component sets, runtime semantic colors, and specimen treatments
   are acceptable.
3. Continue with the core component sequence from
   `docs/figma-library-discovery.md`, one component/family at a time.

Do not publish the Figma library until the owner has reviewed the file manually.
