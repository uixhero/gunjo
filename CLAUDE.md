# CLAUDE.md — Working agreement for Claude in this repo

This file defines how Claude Code (and Claude Agent SDK runs) should collaborate on this project. It overrides defaults — read it first.

## Task tracking is GitHub-issue driven

All non-trivial work must be tied to a GitHub issue. The flow:

1. **Before starting work** — open a GitHub issue describing the task. Use `gh issue create`. Title is concise; body lists scope, acceptance, and files likely to change.
2. **Sub-issues are optional** — split only when a single task naturally branches into independent deliverables. One-shot fixes do not need sub-issues.
3. **While working** — reference the issue number in branch names and PR titles (e.g. `fix/showcase-tabs-overflow` → `Closes #N`).
4. **When the user asks "残タスクは？"** — run `gh issue list --state open` and report the open issues with a short status line for each (in-progress / blocked / not-started). Do not invent tasks not on the board.
5. **When work completes** — verify the fix, then **ask the user before closing**: "「#N をクローズしていい？」". Do not auto-close issues without confirmation. PRs that say `Closes #N` are fine since merging is the user's action.

Trivial polish, typos, and inline doc fixes don't need an issue — but if you find yourself in a multi-step refactor without one, stop and open one first.

## Prefer design-system fixes over local workarounds

When UI work exposes a reusable component problem, first decide whether the root cause belongs in `@gunjo/ui` instead of the current page or pattern. If the component fix is scoped and safe, implement the core API and update the caller to use it. If the fix is too broad for the current task, requires design-source/spec changes, or risks unrelated surfaces, open a GitHub issue with the repro, expected behavior, and any temporary workaround before moving on.

The Gunjo UI docs/patterns site must dogfood Gunjo UI. When a UI element can be represented by an existing `@gunjo/ui` component, use that component instead of app-local markup or one-off styling. If the needed component or composition rule does not exist, add it to `@gunjo/ui` when scoped and safe; otherwise open an issue before relying on a local workaround.

Before creating a new component, pattern-local helper, or custom styled primitive, check the existing Gunjo UI surface first: `src/components/**`, `src/index.ts`, the component docs/navigation entries, and nearby demos/patterns. If an existing component covers the behavior, compose it. If no component exists, make the missing piece explicit as a new `@gunjo/ui` component or a follow-up issue; do not leave lookalike one-off UI in the docs site.

If a pattern needs UI that is not registered in `@gunjo/ui` yet, decide before implementing whether it is page-specific glue or a reusable design-system primitive/composition. Page-specific glue should stay small and documented. Reusable UI may be prototyped in a pattern only when it is explicitly tracked as a candidate for `@gunjo/ui` registration, with its responsibility, reuse scope, and follow-up issue or registration plan captured. "Built locally because the user asked" is not an acceptable final state.

Any change to a shipped component under `src/components/**` is also an SSOT change. In the same PR, update the relevant design source or sync-layer definition, generated specs/artifacts, and drift checks so `npm run design:verify` protects the new contract. Do not stop at editing the React source alone. If the SSOT update is too broad for the current task, open a follow-up issue and explicitly state the temporary gap.

Chart components that render variable data should be built with HTML/CSS layout primitives by default. Do not use SVG for data-driven chart rendering unless the shape is fixed and known not to change with arbitrary user data; fixed decorative assets are the exception. Chart demos should include controls that let reviewers edit representative data and verify the component responds correctly, rather than showing only static sample data.

## Verification before declaring done

Use the `mcp__Claude_Preview__*` tools to verify UI changes in the running dev server before reporting work as complete. Server name in `.claude/launch.json`: `gunjo-docs (Next.js dev)` on port 13030. Do not ask the user to verify visually — verify and share proof.

## Commit / PR style

Follow the existing repo convention seen in `git log`:
- `fix(scope): summary` for bugs
- `feat(scope): summary` for new features
- Keep PR titles under ~70 chars; details go in the body

Do not push to `main` directly. Always go via PR.

## Merging

- Open a PR and wait for CI (`design-verify`) to finish. Merge only when it's green (`gh pr merge <N> --squash --delete-branch`), then `git checkout main && git pull`.
- Never merge with a red CI, unresolved review comments, or when a hold is requested. Force-push and force-merge to `main` are off-limits without explicit sign-off.
- Issues still need confirmation before closing (issues are durable; PR merges are reversible).
