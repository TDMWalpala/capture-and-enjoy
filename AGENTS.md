<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All backend calls go through `src/services/*Api.ts`, which switch between mock (`src/lib/mock/`) and the real FastAPI backend via `src/config/env.ts` — so components never know which is active.
- Signed-in pages live under the `_app` pathless layout (client-only, auth gate in the layout) — the session is owned by the external backend, not available during SSR.
