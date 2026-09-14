# Generation splash SVG samples

Issue: [#762](https://github.com/uixhero/gunjo/issues/762)

## Purpose

These assets are standalone, animated 16:9 reference scenes for teams prototyping a generation-waiting experience. They demonstrate how product storytelling can sit inside a reusable waiting shell without becoming part of the shell API.

They are samples, not `@gunjo/ui` exports and not a prescribed Gunjo illustration style.

## Assets

| Scene | Public path | Intended moment |
| --- | --- | --- |
| Meeting minutes | `/samples/generation-splash/meeting-minutes.svg` | Conversations are organized into minutes |
| Trip plan | `/samples/generation-splash/trip-plan.svg` | A route and itinerary are assembled |
| Trip report | `/samples/generation-splash/trip-report.svg` | Field evidence is organized into a report |
| Trip evaluation | `/samples/generation-splash/trip-evaluation.svg` | Review criteria resolve into an evaluation |

The Animation documentation page renders the files through Gunjo's `AspectRatio`, `Card`, and `Badge` components.

## Integration boundary

The host UI owns:

- title, description, status, and `aria-live` announcements;
- cancel or recovery actions;
- progress semantics, including whether progress is determinate;
- sponsor or advertising content;
- completion and error transitions.

The SVG owns only decorative storytelling. Do not embed an ad SDK, user data, product actions, status text, or timing assumptions into the asset.

This boundary lets a future `GenerationSplash` component accept any scene as media without coupling `@gunjo/ui` to one product's world or business model.

## Accessibility and motion

- Provide a concise `alt` on the host `<img>` when the scene carries useful context. Use an empty `alt` when it is purely decorative and the host already explains the state.
- Do not use the animation as the only way to communicate progress.
- Every sample includes a `prefers-reduced-motion: reduce` rule that removes motion and leaves a complete static composition.
- The 1600 × 900 `viewBox` is intentionally scalable; preserve the 16:9 container to avoid clipping important elements.

## Product-specific source

The scenes were generalized from an application prototype. Product-specific copy, generation stages, advertising policy, and orchestration remain in the application. Only the portable SVG examples are included here.
