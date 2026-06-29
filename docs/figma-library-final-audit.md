# Figma Library Final Audit

Date: 2026-06-29

Scope:

- Repository: `/Users/hikaby/dev/gunjo-figma`
- Branch: `figma/foundations-8`
- Figma file: `GunjoUI Library Foundations (#8)`
- Original issue #8 export target: 162 components / templates
- Latest regenerated SSOT discovery target: 173 components / templates

## Summary

The original issue #8 export scope is complete: all 162 components / templates
from the earlier locked discovery pass are represented in the Figma file and
recorded in `docs/figma-library-foundations.md`.

After re-running `npm run design:report:figma-library` on the current SSOT, the
generated discovery scope increased to 173 components / templates. This means
the Figma file is complete for the original scope, but not complete against the
latest regenerated SSOT.

## Source Inventory

Current regenerated discovery output:

- Components / templates: 173
- Variants: 250
- Empty variant components: 46
- Synthetic variants: 139
- Unresolved spec entries: 3

Current regenerated category counts:

- Inputs: 39
- Display: 43
- Charts: 23
- Feedback: 11
- Navigation: 16
- Overlay: 16
- Layout: 14
- Patterns: 11

Unresolved spec entries:

- `blogTemplate`: null spec entry
- `docsTemplate`: null spec entry
- `onboardingTemplate`: null spec entry

## Figma Inventory

Figma page section counts:

- Inputs: 37 sections
- Display: 38 sections
- Charts: 23 sections
- Feedback: 11 sections
- Navigation: 16 sections
- Overlay: 16 sections
- Layout: 14 sections
- Patterns: 9 sections

Total top-level component sections: 164

`AccordionGroup` is represented as a component set inside
`Accordion / Section`, not as a separate top-level section:

- `AccordionGroup`: `122:96`

Counting that nested component family, the file currently represents 165
components / templates from the latest regenerated scope.

## Latest SSOT Gaps

The following latest-SSOT entries are not represented as Figma component
sections yet:

- `CurrencyInput` (`Inputs`, synthetic default)
- `ScanInput` (`Inputs`, synthetic default)
- `Gallery` (`Display`, variants `bottom` / `start`)
- `EditableDataTable` (`Display`, variants `default` / `compact`)
- `ApprovalSteps` (`Display`, variants `default` / `compact`)
- `Delta` (`Display`, synthetic default)
- `ResponsiveAuthCardPattern` (`Patterns`, default)
- `PricingTemplate` (`Patterns`, default)

## Notes

- The Figma file contains `Gunjo Tokens` with 55 variables and `Gunjo Runtime`
  with 1 `radius/base` variable.
- `destructive-border` and `primary-border` were added after the initial
  foundations count, so older 54-variable references were stale.
- The current worktree is clean after the last pushed commit before this audit,
  but this audit intentionally regenerates the discovery files to expose current
  SSOT drift.

## Recommendation

Treat issue #8 as complete for its original locked scope, but do not publish the
library as fully current against today's SSOT until the eight latest-SSOT gaps
above are either exported to Figma or explicitly deferred in a follow-up issue.
