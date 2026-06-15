# Inputs form composition SSOT notes

Last updated: 2026-06-15

Related issues: #161, #168

## Decision

GunjoUI keeps `h-9` / 36px as the default form-control height for standard controls.

This applies to:

- `Button` default and icon sizes
- `Input`
- `Select`
- `SearchInput`
- `PasswordInput`
- `NumberInput`
- `Combobox` trigger
- `TimePicker`
- `FilterButton`
- `SortButton`

Controls that intentionally use a larger touch or calendar target, such as `Calendar` day cells, `InputOTP` slots, or date-picker header controls, can keep their component-specific size.

## Form composition rule

Standard text-like controls are fluid by default and fill their parent:

- `Input`: `w-full`
- `Select`: `w-full`
- `FormGroup`: owns the field column width

Docs and app screens should constrain these controls on the parent, for example `FormGroup className="w-full max-w-sm"` or a surrounding `max-w-*` wrapper. Consumers should not need to discover component-specific width props or source-only overrides for ordinary form layouts.

Some controls still keep an intrinsic preview/control width where the component itself is a bounded interaction surface:

- `Textarea`: 280px
- `Slider`: 200px
- `RangeSlider`: 240px
- `FileUploader`: up to 640px

When form controls are placed inside `FormGroup`, the field composition owns the width. `FormGroup` expands supported controls to the field width by targeting their `data-slot` values instead of relying on page-local wrappers.

The canonical `FormGroup` layout is:

- vertical label, control, description, and message
- 6px internal gap
- full-width control within the field
- no default padding

The canonical `Form` layout is:

- vertical field stack
- 16px gap between fields

## SSOT source

The machine-readable contract lives in `scripts/design-sync/tier-definitions/inputs.mjs` under the synthetic `form` component spec. Running `npm run design:sync:components` writes the same contract to `design/component-specs/inputs-core.json`.

Runtime behavior lives in `src/components/inputs/Form.tsx`.

## Public API note

This cleanup does not add new width props. The public path is parent-side sizing with standard `className` composition: fluid controls fill their parent, and bounded examples constrain the parent.

If GunjoUI later changes the standard form-control height to 40px, it should be done as a coordinated token/component migration rather than page-level overrides.
