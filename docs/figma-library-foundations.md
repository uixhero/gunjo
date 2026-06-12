# Figma Library Foundations

Issue: #8

This document records the foundations phase after
`docs/figma-library-discovery.md`.

## Status

A blank Figma design file was created for the foundations pass:

- File: `GunjoUI Library Foundations (#8)`
- URL: https://www.figma.com/design/1hTzNSFLwOA88R15KCX9iG

No GunjoUI SSOT token or component data has been written to that Figma file from
this repository yet. The first write attempt was blocked because this repository
is private and pre-public; exporting token/spec data into an external Figma file
requires explicit owner approval after acknowledging that private design-system
data is leaving the repo environment.

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
- 43 `design/tokens.pen` variables in a `Gunjo Tokens` collection with Light and
  Dark modes.
- 1 `Gunjo Runtime` radius variable for `var(--radius)`, because component
  corner-radius binding needs it and `design/tokens.pen` does not currently emit
  a radius token.
- 7 text styles under `Gunjo/*`.
- 8 effect styles under `Gunjo/Shadow/*`.

## Required Approval Before External Write

Before running a Figma write against the file above, the owner should explicitly
confirm:

> I approve exporting the GunjoUI token names, token values, page taxonomy, text
> style names, and effect style names from this private pre-public repository to
> the Figma file `GunjoUI Library Foundations (#8)`.

After approval, the Figma write should:

1. Inspect the target file again for existing variables/styles/pages.
2. Create or update `Gunjo Tokens` and `Gunjo Runtime` collections.
3. Set explicit variable scopes and WEB code syntax for every variable.
4. Create or update text and effect styles.
5. Create page skeletons only; do not create components in the same step.
6. Return the created/mutated IDs and a screenshot of the Cover or Tokens page.

Do not publish the Figma library until the owner has reviewed the file manually.
