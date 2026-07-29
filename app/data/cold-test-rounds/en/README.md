# cold-test-rounds/en — English translations

One file per translated round, named after the round number, sitting alongside
the Japanese originals in the parent directory.

```
app/data/cold-test-rounds/178.json      Japanese, machine-generated
app/data/cold-test-rounds/en/178.json   English, this directory
```

**Never put English text in the Japanese files.** `scripts/build-coldtest-rounds.mjs`
rewrites every `<n>.json` in the parent directory from scratch out of
`promotion/` and the `gunjo-test` app, so anything added there is destroyed on
the next regeneration. The generator never writes into `en/`.

## Shape

```jsonc
{
  "round": 178,                       // must match the filename
  "status": "draft",                  // "draft" | "reviewed"
  "title": "...",                     // translation of the Japanese title
  "summary": "...",                   // translation of the Japanese summary
  "article": { "markdown": "..." },   // translation of article.markdown
  "sourceHash": "sha256:...",         // of the Japanese round, at translation time
  "translatedAt": "2026-07-29",       // YYYY-MM-DD
  "translator": "codex batch-01",     // who produced it
  "glossary": "COLDTEST-GLOSSARY-EN.md 2026-07-29"
}
```

Nothing else is translated. Route, score, category, component names, source
code and screenshot flags are language independent and are read from the
Japanese file at render time. Screenshots stay Japanese on purpose: each round
is a real screen for a real Japanese industry, and a re-rendered English
capture would no longer be the screen the agent actually built.

## status

`draft` renders locally and on Vercel previews so it can be read in place, and
is withheld from production, the sitemap and hreflang. Production serves only
`reviewed`. Flipping a translation to `reviewed` is a human decision.

## sourceHash

sha256 of the Japanese `title`, `summary` and `article.markdown` joined with
`"\n \n"`. It is how `npm run coldtest-en:check` notices that a Japanese round
was rewritten after it was translated. Compute it with:

```sh
node -e "const fs=require('fs'),c=require('crypto');const j=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log('sha256:'+c.createHash('sha256').update([j.title,j.summary,j.article?j.article.markdown:''].join('\n \n'),'utf8').digest('hex'))" app/data/cold-test-rounds/178.json
```

## Before opening a PR

```sh
npm run coldtest-en:check
```

It validates the shape, catches stale translations, and rejects the characters
banned for published prose (em-dash, text arrows, ellipsis). Wording rules and
the fixed translations of recurring terms live in
`promotion/handoff/COLDTEST-GLOSSARY-EN.md`; the whole design is written up in
`promotion/handoff/HANDOFF-coldtest-en.md`.
