# Pre-alpha copy and SSOT audit

Date: 2026-06-11

Scope:

- Issue #235: expand the message catalog so component docs and patterns can reuse operational copy.
- Issue #236: audit visible copy against the writing guideline before alpha.
- Issue #109: make the public `.pen` / Figma / SSOT wording accurate for alpha.

## #235 message catalog expansion

Updated `/docs/guidelines/writing`.

Added or confirmed catalog coverage for:

| Area | Status | Notes |
| --- | --- | --- |
| Action labels | covered | Save, cancel, copy, add, edit, delete, permanent delete, selection. |
| Success feedback | covered | Save, copy, update, create, delete, send. |
| Errors | covered | Save/load/upload failure, invalid format, missing permission, unstable connection. |
| Empty states | covered | Files, search results, notifications, members, drafts, history. |
| Disabled controls | covered | Missing permission, no selection, processing, limit reached, required fields, offline. |
| Input validation | covered | Required, format, length, range, duplicate, mismatch. |
| File operations | covered | Upload, download, supported type, size limit, share link creation. |
| Lists and tables | covered | Filters, no results, sort, pagination, bulk selection. |
| Auth and access | covered | Sign-in, session, permission request, sign out, expired invite, reset email. |
| Sharing and visibility | added | Public link on/off, copy share link, external sharing, view/edit access. |
| Progress and async work | added | Starting, processing, queued, paused, complete, retry after failure. |
| Tooltips and helper copy | added | Icon actions, toggles, new-tab labels, disabled reasons, danger actions, current values. |
| Confirmations | covered | Delete, permanent delete, unsaved changes, publish, bulk action, permission change. |
| Documentation copy | covered | Purpose, state, disabled behavior, accessibility, implementation notes, caution. |

The catalog now keeps the required shape for each entry:

- purpose
- label / heading
- displayed message
- review point
- Japanese and English copy at the same granularity

## #236 visible copy audit

Public-alpha audit scope:

| Surface | Result | Follow-up |
| --- | --- | --- |
| `/docs/guidelines/writing` | Updated. Message catalog now covers the frequent UI states that were missing. | Keep adding entries when a component introduces new copy not covered by the catalog. |
| `/docs/introduction` | Copy already states that `.pen` is a sync/verification source, not full page generation. | No alpha blocker. |
| `/docs/ai-handoff` | Copy already distinguishes `.pen`, metadata, and core JSON, and says pages are not fully auto-generated. | Tighten wording if Figma plan changes. |
| `/docs/ai-handoff/figma` | Needs alpha wording adjustment because it reads like a shipped plugin and full Figma sync. | Fixed in this batch. |
| Top page SSOT section | Copy already avoids full-auto-generation language. | No alpha blocker. |
| Public patterns | Dashboard / Auth / Media Library remain the only alpha-visible pattern families. | Pattern rebuild is tracked separately for post-alpha. |
| Component docs | Component-level copy was audited during the component pass. Current pre-alpha priority is ensuring new copy follows the catalog. | Full copy drift crawl can continue after alpha if needed. |

Priority checks used:

- Japanese pages do not expose English-only body copy unless the term is a product/tool name.
- User-facing errors include a recovery path.
- Disabled controls and ambiguous icon buttons have a reason or tooltip.
- Destructive actions ask for confirmation before the action.
- Code examples and previews should not imply a component behavior that is only docs scaffolding.

Known non-blocking follow-ups:

- Continue adding message catalog entries as patterns are rebuilt.
- Re-run a full page crawl if alpha scope changes to include hidden pattern families.
- Use this catalog as the baseline when revisiting old component text after public feedback.

## #109 `.pen` / Figma / SSOT wording

Current alpha truth:

- `.pen` remains the canonical design source for tokens and component variants.
- `design:sync` turns `.pen` plus metadata into generated specs, variant keys, docs registration, manifests, and exports.
- GunjoUI does not claim that every page or screen is fully auto-generated from `.pen`.
- Figma is a planned distribution / consumption surface for designers, not the canonical SSOT.
- A future Figma library or plugin should mirror the same taxonomy and token names, but it is not shipped as the source of truth in alpha.

Acceptance for alpha:

- Public docs can say `.pen` is the design source and SSOT input.
- Public docs must not imply the Figma plugin/library is already shipped.
- Public docs must not imply all pages are generated directly from `.pen`.

