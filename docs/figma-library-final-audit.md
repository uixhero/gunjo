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
generated discovery scope increased to 173 components / templates. The eight
latest-SSOT gaps found during this audit were exported to Figma on 2026-06-29,
so the Figma file is now complete against the latest regenerated SSOT.

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

Figma page section counts after the additional export:

- Inputs: 39 sections
- Display: 42 sections
- Charts: 23 sections
- Feedback: 11 sections
- Navigation: 16 sections
- Overlay: 16 sections
- Layout: 14 sections
- Patterns: 11 sections

Total top-level component sections: 172

`AccordionGroup` is represented as a component set inside
`Accordion / Section`, not as a separate top-level section:

- `AccordionGroup`: `122:96`

Counting that nested component family, the file currently represents 173
components / templates from the latest regenerated scope.

## Latest SSOT Gaps

Resolved on 2026-06-29:

- `CurrencyInput` (`Inputs`, synthetic default): section `631:13`, component `631:15`
- `ScanInput` (`Inputs`, synthetic default): section `631:34`, component `631:36`
- `Gallery` (`Display`, variants `bottom` / `start`): section `633:2`, component set `633:30`
- `EditableDataTable` (`Display`, variants `default` / `compact`): section `633:37`, component set `633:93`
- `ApprovalSteps` (`Display`, variants `default` / `compact`): section `633:100`, component set `633:160`
- `Delta` (`Display`, synthetic default): section `633:166`, component `633:168`
- `ResponsiveAuthCardPattern` (`Patterns`, default): section `634:195`, component `634:197`
- `PricingTemplate` (`Patterns`, default): section `634:229`, component `634:231`

## Notes

- The Figma file contains `Gunjo Tokens` with 55 variables and `Gunjo Runtime`
  with 1 `radius/base` variable.
- `destructive-border` and `primary-border` were added after the initial
  foundations count, so older 54-variable references were stale.
- The current worktree intentionally records the regenerated discovery files and
  the final audit update so the latest 173-component scope is reproducible.

## Recommendation

Treat issue #8 as complete against both its original locked scope and the latest
regenerated SSOT scope. Before publishing the Figma library, the owner should
still perform the required manual visual review.
