# Inputs form composition SSOT notes

Last updated: 2026-06-10

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

Standalone inputs keep their intrinsic preview width so docs can show their natural size:

- `Input`: 280px
- `Textarea`: 280px
- `Select`: 200px
- `Slider`: 200px
- `RangeSlider`: 240px
- `FileUploader`: up to 640px

When those controls are placed inside `FormGroup`, the field composition owns the width. `FormGroup` expands supported controls to the field width by targeting their `data-slot` values instead of relying on page-local wrappers.

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

This is a compatibility-preserving cleanup. It does not add new props and does not change standalone control sizing. It only formalizes the existing FormGroup behavior and fills missing full-width coverage for `InputOTP`, `RangeSlider`, and `EditableField`.

If GunjoUI later changes the standard form-control height to 40px, it should be done as a coordinated token/component migration rather than page-level overrides.
