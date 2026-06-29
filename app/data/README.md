# app/data — committed data snapshots

Static data files that gunjo.jp consumes at build/runtime but whose source of
truth lives outside the published repo (typically in the gitignored
`promotion/` workspace).

## `cold-test-gallery.json`

Snapshot of the 170-round cold-test gallery (`/cold-tests` page on gunjo.jp,
see [#431](https://github.com/uixhero/gunjo/issues/431)). One entry per round
with route, score, category, title, summary excerpt, article filename, and
screenshot-presence flags.

**Regenerate** after appending new cold-test rounds (or refreshing screenshot
inventory):

```sh
# From the main checkout (promotion/ is a sibling):
npm run coldtest-gallery:snapshot

# From a worktree (point at the real promotion/ folder):
GUNJO_PROMOTION_DIR=~/dev/gunjo/promotion npm run coldtest-gallery:snapshot
```

The generator (`scripts/build-coldtest-gallery.mjs`) reads:

- `promotion/cold-test-screens/README.md` — route table (round → route → score → title)
- `promotion/zenn-yattemita-NN-*.md` — per-round article H1 + summary paragraph
- `promotion/cold-test-screens/shots/*.png` — screenshot presence (desktop / mobile / `.en` variants)

When the cold-test series adds new industry categories, also update
`categoryOf()` inside the generator so the new rounds land in the right
sidebar bucket.
