
# Plot Map — Critical Rules (never break these)

## Background image
- USE: `site-plan.png` — this is the correct top-down technical site plan
- NEVER USE: `render-layout.jpg` — this is a 3D artistic park render, wrong image
- Never switch the background image without explicit user permission

## PLOT_POSITIONS
- User manually calibrated every single coordinate — never change them
- Container: **800 × 450 px** — coords were calibrated against THIS size (bottom plots sit at y≈451).
  Do NOT "fix" it to 566 for aspect ratio — that pushes the image down and misaligns every marker. (Learned the hard way.)
- objectFit: fill — image fills the 800×450 box exactly

## General rules
- Do NOT change any file without being explicitly asked
- Do NOT make "improvement" changes (resize, reformat, reorganise) without permission
- If instructions are unclear, ASK before doing anything

# Deploy & Git Workflow — Critical Rules (never break these)

## Memory #2 — Preview & approval gate
- ALWAYS show a preview of changes (diff and/or running preview) BEFORE deploying
- ALWAYS ask for explicit approval BEFORE running `vercel --prod` / any deploy
- ALWAYS ask for explicit approval BEFORE `git commit` or `git push`
- Every NEW feature must be previewed PRIVATELY first (local/preview URL), never straight to public
- Public = gujralhills.in. Nothing reaches public view until the user has seen it privately and said yes

## Deployment architecture (gujralhills.in) — do NOT break the homepage again
- TWO apps in one repo: static marketing site in `website/` AND the React app (CRA) at root.
- Homepage `/` MUST serve the marketing site (`website/index.html`). `/map` + `/dashboard` serve the React app.
- React routing (src/App.jsx): `/` or `/map` → PublicMap; anything else → Login/Dashboard.
- THE BUG that hijacked the homepage: a catch-all rewrite `"/(.*)" → "/index.html"` + `framework: create-react-app`
  in vercel.json sent EVERY url (incl. `/`) to the React app, so the homepage showed the plot map.
- CORRECT vercel.json: `framework: null`; buildCommand builds React then `mv build/index.html build/app.html`
  and copies `website/*` into `build/`; rewrites ONLY `/map` and `/dashboard` → `/app.html`. Everything else static.
- Deploy: `vercel --prod --yes` (CLI, builds remotely from local files incl. uncommitted). Project: gujralhills.
