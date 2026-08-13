# Society Maintenance

SvelteKit static app for calculating society maintenance charges. The UI matches the original Materialize-based site; internals use reactive Svelte components, pure TypeScript services, and JSON-driven configuration.

---

## Table of contents

- [Run locally](#run-locally)
- [Build & preview](#build--preview)
- [Architecture](#architecture)
- [GitHub Pages deployment](#github-pages-deployment)
- [Configuration](#configuration)
- [Stack](#stack)

---

## Run locally

**Prerequisites:** Node.js 18+ (Node 22 matches CI)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

4. Optional — type-check without running the app:

   ```bash
   npm run check
   ```

The dev server loads config from `static/config/maintenance.json` at runtime. Change carpet area, balcony area, or billing month in the UI to see maintenance totals update immediately.

---

## Build & preview

Production build (output in `build/`):

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

For a GitHub Pages project site, the base path must match the repository name:

```bash
BASE_PATH=/ap2-maintenance npm run build
npm run preview
```

`BASE_PATH` is read by `svelte.config.js` and sets asset URLs correctly under `https://<user>.github.io/ap2-maintenance/`.

---

## Architecture

### Goals

- **Same look and feel** — Materialize CSS, Material Icons, scoped component styles
- **Reactive UI** — user inputs drive derived maintenance results
- **Modular logic** — config loading and calculation in framework-free services
- **Composable UI** — reusable building blocks composed into cards
- **Static hosting** — `@sveltejs/adapter-static`, no server required

### UI component tree

```
+layout.svelte
│   Header (static title)
│   <main>
│       └── +page.svelte → App.svelte
│               ├── MaintenanceCard          (hero total)
│               ├── FlatAreaCard             (inputs + area)
│               ├── FixedExpenseCard         (shared fixed costs)
│               ├── VariableExpenseCard      (per sq.ft. funds)
│               ├── TemporaryChargesCard     (time-bound levies)
│               └── TotalMaintenanceCard     (summary breakdown)
│   Footer (static strip)
```

Each card under `cards/` composes primitives from `reusable/` (`SectionCard`, `Table`, `BigHighlightBox`, `MiniHighlightBox`, etc.).

### Data flow

```
 static/config/maintenance.json
         │
         ▼ fetch (config.ts)
    MaintenanceConfig
         │
         ▼ calculateMaintenance() (maintenance.ts)
    MaintenanceResult  ◄── carpet, balcony, billingMonth (App state)
         │
         ▼ createFormatter(config) (format.ts)
    CurrencyFormatter
         │
         ▼ props: { config, result, fmt }
    Card components  ──►  rendered UI
```

Calculation logic lives entirely in `src/lib/services/maintenance.ts`. Components only format and display results.

### Directory layout

```
src/
├── app.html                    # Shell, Materialize CDN links
├── app.css                     # Global resets + design tokens
├── routes/
│   ├── +layout.svelte          # Header, main slot, Footer
│   ├── +layout.ts              # prerender: true, ssr: false
│   └── +page.svelte            # Renders <App />
└── lib/
    ├── components/
    │   ├── App.svelte          # State, config load, card composition
    │   ├── reusable/           # Generic UI building blocks
    │   │   ├── Header.svelte
    │   │   ├── Footer.svelte
    │   │   ├── MaintenanceCard.svelte
    │   │   ├── SectionCard.svelte
    │   │   ├── BigHighlightBox.svelte
    │   │   ├── MiniHighlightBox.svelte
    │   │   ├── Table.svelte
    │   │   └── ErrorCard.svelte
    │   └── cards/              # Section-specific assembly
    │       ├── FlatAreaCard.svelte
    │       ├── FixedExpenseCard.svelte
    │       ├── VariableExpenseCard.svelte
    │       ├── TemporaryChargesCard.svelte
    │       └── TotalMaintenanceCard.svelte
    ├── services/
    │   ├── config.ts           # Fetch maintenance.json
    │   └── maintenance.ts      # Pure calculation functions
    ├── utils/format.ts         # Currency, month labels, createFormatter
    ├── types/                  # MaintenanceConfig, MaintenanceResult, …
    ├── actions/materialize.ts  # Materialize select/text-field init
    └── styles/tokens.css       # Shared CSS variables

static/
└── config/maintenance.json     # Editable maintenance data (copied to build/)
```

### State model (`App.svelte`)

| State | Role |
|-------|------|
| `config` | Loaded from `maintenance.json`; `null` while fetching |
| `carpet`, `balcony` | User-entered flat areas (sq.ft.) |
| `billingMonth` | Selected month (`YYYY-MM`) for temporary charges |
| `result` | `$derived` from `calculateMaintenance(config, …)` |
| `fmt` | `createFormatter(config)` — locale-aware currency helper |

While config loads, App shows a loading message. On fetch failure, `ErrorCard` displays the error.

Cards receive `{ config, result, fmt }`. `FlatAreaCard` also binds `carpet`, `balcony`, and `billingMonth`. Display text such as `formulaNote` stays in config; `VariableExpenseCard` joins fund rows to config by `id`.

### Reusable components

| Component | Purpose |
|-----------|---------|
| `Header` | Static page title bar |
| `Footer` | Static page footer strip |
| `MaintenanceCard` | Top hero — monthly maintenance total |
| `SectionCard` | Bordered card shell — icon, title, subtitle, body slot |
| `BigHighlightBox` | Large stat callouts (area, flat count, construction cost) |
| `MiniHighlightBox` | Sub-headers (`mode="details"`) or totals (`mode="total"`) |
| `Table` | Striped cost table with themed header and footer rows |
| `ErrorCard` | Config load failure message |

### Card components

| Card | What it shows |
|------|----------------|
| `FlatAreaCard` | Carpet/balcony inputs, total usable area, billing month |
| `FixedExpenseCard` | Building fixed costs, unit bifurcation, per-flat share + buffer |
| `VariableExpenseCard` | Sinking & repair funds from usable area |
| `TemporaryChargesCard` | Active temporary levies for selected month |
| `TotalMaintenanceCard` | Fixed + variable + temporary summary |

### Styling & Materialize

- Each component owns scoped `<style>`; shared variables in `lib/styles/tokens.css`
- Materialize CSS/JS loaded from CDN in `app.html`
- `FlatAreaCard` uses `use:materializeSelect` and `use:materializeTextFields` actions

---

## GitHub Pages deployment

Deployment is fully automated via GitHub Actions.

### How it works

```
 push to main/master
         │
         ▼
 .github/workflows/pages.yml
         │
         ├── checkout
         ├── npm install
         ├── npm run build          (BASE_PATH=/<repo-name>)
         ├── upload build/ artifact
         └── deploy-pages action
         │
         ▼
 https://<user>.github.io/<repo-name>/
```

### Workflow details

File: `.github/workflows/pages.yml`

| Step | What it does |
|------|----------------|
| **Trigger** | Push to `main` or `master`, or manual *workflow_dispatch* |
| **Build** | `npm install` then `npm run build` with `BASE_PATH=/${{ github.event.repository.name }}` |
| **Deploy** | Uploads `build/` and publishes via `actions/deploy-pages@v4` |

The `BASE_PATH` env var sets `kit.paths.base` in `svelte.config.js`. That ensures scripts, styles, and the config fetch URL (`import.meta.env.BASE_URL + config/maintenance.json`) resolve correctly on a project site (not at the domain root).

### One-time GitHub setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. Push to `main`/`master` — the workflow runs automatically.

After a successful run, the site is live at:

```
https://<github-username>.github.io/ap2-maintenance/
```

(Replace `ap2-maintenance` with your repository name.)

### Manual deploy trigger

In the GitHub repo: **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Configuration

Edit `static/config/maintenance.json` to change costs, fund rates, temporary charges, rounding steps, and display locale. No code change is required for data updates.

| Section | Contents |
|---------|----------|
| `defaults` | Default carpet and balcony area (sq.ft.) |
| `expenses.fixed` | `bufferPercent`, `unitTypes`, building `costs` |
| `expenses.variable` | Construction cost per sq.ft. and fund percentages |
| `expenses.temporary` | Time-bound levies with start/end months |
| `rounding` | Round-off steps for fixed per-flat and final monthly total |
| `display` | Currency code and locale for formatting |

Page title and header text are static in layout components, not in JSON.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [SvelteKit 2](https://kit.svelte.dev/) (Svelte 5) |
| Adapter | `@sveltejs/adapter-static` — fully prerendered SPA |
| UI | [Materialize CSS 1.0](https://materializecss.com/) + Material Icons (CDN) |
| Language | TypeScript |
| Hosting | GitHub Pages via GitHub Actions |
