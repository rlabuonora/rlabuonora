# Playwright Design Workflow

This repo uses two complementary tools for design review:

- `playwright` for repeatable screenshot capture
- `@playwright/mcp` for live browser inspection inside Codex

## 1. Install local dependencies

```bash
npm install
npx playwright install chromium
```

## 2. Add Playwright MCP to Codex

Use the official Playwright MCP server from Microsoft:

```bash
codex mcp add playwright -- \
  npx @playwright/mcp@latest \
  --headless \
  --browser chromium \
  --output-dir /Users/rafa/Desktop/code/rlabuonora/artifacts/playwright-mcp
```

This follows the Playwright MCP setup published in the official repository:
https://github.com/microsoft/playwright-mcp

After adding it, start a Codex session in this repo and ask it to:

- open `http://127.0.0.1:4210/`
- inspect spacing, hierarchy, and responsive issues
- compare desktop and mobile behavior

## 3. Capture repeatable screenshots

Start from a clean local render loop:

```bash
npm run design:capture
```

This script will:

- start `quarto preview --no-browser --port 4210`
- automatically reuse that server if port `4210` is already occupied by an existing Quarto preview
- capture screenshots for:
  - home
  - posts index
  - projects index
  - courses index
  - project page
  - article page
- capture both:
  - desktop (`1440x1200`)
  - mobile (`393x852`)
- save outputs to:

```text
artifacts/design-review/<timestamp>/
artifacts/design-review/latest/
```

Each run includes:

- `manifest.json`
- organized screenshots by viewport
- `review-prompt.md`

If you want to be explicit and force reuse of an already-running preview, use:

```bash
npm run design:capture:live
```

## 4. Review loop with Codex

After each capture:

1. Open `artifacts/design-review/latest/review-prompt.md`
2. Attach the generated screenshots to Codex
3. Ask for concrete layout and styling improvements
4. Apply changes
5. Run `npm run design:capture` again

Suggested prompt:

```text
Review these Quarto screenshots for layout, spacing, typography, hierarchy, and responsive issues. Prioritize concrete CSS and markup improvements for this repo. Reference the screenshots by page and viewport.
```

## 5. Suggested iterative loop

```bash
npm run design:capture
codex
```

Inside Codex:

- attach the screenshots from `artifacts/design-review/latest`
- ask for design critique
- use Playwright MCP to inspect the live page for follow-up tweaks

That gives you a tight cycle:

1. implement
2. capture
3. review
4. refine
5. repeat
