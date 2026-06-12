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

- `Gunjo Tokens`: 53 variables, with `Light` and `Dark` modes.
  - 43 variables from `design/tokens.pen`.
  - 10 runtime semantic color variables from `src/globals.css` for component
    bindings.
- `Gunjo Runtime`: 1 `radius/base` variable.
- Text styles: 7 `Gunjo/*` styles.
- Effect styles: 8 `Gunjo/Shadow/*` styles.
- Pages: Cover, Changelog, Tokens, Inputs, Display, Charts, Feedback,
  Navigation, Overlay, Layout, Patterns.

The Figma file now contains page skeletons, token swatches, and the first
component family:

- `Button` on the `Inputs` page.
  - Component set node: `16:26`.
  - Variants: `default`, `primary`, `info`, `success`, `warning`,
    `destructive`, `outline`, `secondary`, `ghost`, `link`.
  - Component property: `Label`.
  - Size and implementation-state specimens are documented next to the
    component set; they are not part of the `variant` axis to avoid a 60-variant
    matrix.

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
- 53 variables in a `Gunjo Tokens` collection with Light and Dark modes:
  43 from `design/tokens.pen`, plus 10 runtime semantic colors required for
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

## Next Figma Step

Before creating the next component:

1. Review the Figma file manually.
2. Confirm the Button component set, runtime semantic colors, and specimen
   treatment are acceptable.
3. Continue with the core component sequence from
   `docs/figma-library-discovery.md`, one component/family at a time.

Do not publish the Figma library until the owner has reviewed the file manually.
