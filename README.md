# Sferavis · NASA SPHEREx All-Sky Hyperspectral Atlas & Planetarium

[![CI](https://github.com/sferavis/sferavis/actions/workflows/ci.yml/badge.svg)](https://github.com/sferavis/sferavis/actions/workflows/ci.yml)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Aladin Lite](https://img.shields.io/badge/Aladin_Lite-v3_WASM-A30000.svg)](https://aladin.cds.unistra.fr/AladinLite/)

**Sferavis** is an open-source, interactive astrophysical visualization platform and cosmic spectral atlas built for the **NASA SPHEREx** (Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer) mission.

SPHEREx is surveying the entire celestial sphere every six months across 102 distinct near-infrared bands (0.75 – 5.0 µm). Sferavis brings this all-sky hyperspectral data to life through an in-browser WebAssembly planetarium, interactive spectral energy distribution (SED) analyzers, astrophysics data-reduction tutorials, and an intelligent scientific assistant named **Redium**.

---

## Key Capabilities

* **Interactive SPHEREx Planetarium**: Built on official `aladin-lite` (v3 WebAssembly core) rendering the NASA SPHEREx QR2 all-sky composite (`CDS/P/SPHEREx/QR2/D3`) and optical DSS2 reference surveys. Features Aitoff (AIT), Gnomonic (TAN), and Orthographic (SIN) projections, real-time coordinate grid navigation, and FoV control.
* **102-Band Near-IR Hyperspectral Scrubber**: Continuously scrub through 0.75 µm to 5.00 µm across all 6 Linear Variable Filter (LVF) detector assemblies, diagnosing interstellar water ice (3.05 µm), carbon dioxide ice (4.27 µm), polycyclic aromatic hydrocarbons (3.3 µm PAH), and the cosmological H⁻ stellar opacity minimum (1.6 µm).
* **Redium AI Science Assistant**: Integrated scientific assistant powered by Google Gemini (`@google/genai` Gemini 3.8 Flash) available via `/api/chat`. Explains mission science, SPHEREx survey strategies, and navigates visitors through the atlas.
* **Dual Celestial Aesthetics**:
  * **Luminous Atlas (Light Mode)**: Inspired by prestigious National Geographic editorial cartography, featuring clean ivory-slate canvases, charcoal headings, and deep red accents.
  * **Night Sky Observatory (Dark Mode)**: Atmospheric deep-space aesthetic (`#070b14` canvas, `#0e1628` instrument consoles, and starlight borders).
* **Astro Background Engine**: Canvas and SVG layer featuring 140 spectral-class twinkling stars (O/B blue, A white, M infrared red, K amber), celestial coordinate reticles, 23.4° inclined ecliptic line, and mouse parallax tracking.
* **Inclusive Accessibility Controls**: Floating WCAG-aligned accessibility panel with large text, high contrast, underlined links, reduced motion, and keyboard skip-links.
* **Tutorials & Developer APIs**: Step-by-step notebooks for FITS cube reduction, ice column decomposition, galaxy redshift fitting, plus REST endpoints and Python SDK documentation.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS v4, Motion (Framer Motion v12), Lucide Icons |
| **Planetarium & Astro** | Aladin Lite v3 (WebAssembly & WebGL 2.0), HiPS protocol |
| **AI Assistant** | `@google/genai` (Gemini 3.8 Flash), Vercel Serverless Function & Vite dev proxy |
| **Typography** | Lexend, Oswald, Merriweather, JetBrains Mono |
| **CI / CD** | GitHub Actions (`ci.yml`, `deploy-pages.yml`), Vercel (`vercel.json`) |

---

## Getting Started

### Prerequisites

* **Node.js**: `v22.12.0` or higher
* **Package Manager**: `npm`, `bun`, or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sferavis/sferavis.git
   cd sferavis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Configure Redium AI Assistant**:
   Copy the example environment file and add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Vite dev server on port 3000 with local `/api/chat` proxy |
| `npm run build` | Compiles production assets into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript compilation check (`tsc --noEmit`) |
| `npm run typecheck` | Validates type definitions across the codebase |
| `npm run clean` | Removes build artifacts (`dist/`, `server.js`) |

---

## Deployment Options

### 1. GitHub Pages (Automated via GitHub Actions)

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy-pages.yml`):

1. Go to your repository on GitHub: **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push changes to the `main` branch. GitHub Actions will automatically build and deploy Sferavis to `https://<your-username>.github.io/<repo>/`.

*Note: Vite is preconfigured with relative base paths (`GITHUB_PAGES=true`), so all assets resolve correctly regardless of repository subpath.*

### 2. Vercel

Sferavis includes a `vercel.json` and a serverless API function in `api/chat.ts`:

1. Import the repository into [Vercel](https://vercel.com).
2. Set the Environment Variable:
   * `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
3. Deploy. Vercel automatically builds the Vite frontend and serves `/api/chat` as an edge/serverless function.

---

## Project Structure

```
sferavis/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Automated testing and build verification
│   │   └── deploy-pages.yml       # One-click deployment to GitHub Pages
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md          # Bug report issue template
│       └── feature_request.md     # Feature proposal issue template
├── api/
│   └── chat.ts                    # Serverless Gemini endpoint for Redium assistant
├── public/                        # Static assets, SVG icons, and diagrams
├── src/
│   ├── assets/images/             # Telescope hardware and mission imagery
│   ├── components/
│   │   ├── AccessibilityControls.tsx # WCAG accessibility floating panel
│   │   ├── AladinSkyViewer.tsx       # Aladin Lite v3 WASM planetarium component
│   │   ├── AstroBackground.tsx       # 140-star animated astronomical backdrop
│   │   ├── Footer.tsx                # Consortium credits & legal metadata
│   │   ├── LaunchSferavisModal.tsx   # Planetarium modal & SED analyzer
│   │   ├── Logo.tsx                  # Dual-mode responsive text logo
│   │   ├── Navbar.tsx                # Frosted glass responsive navigation
│   │   └── RediumChat.tsx            # Redium AI chat drawer
│   ├── data/
│   │   └── mockData.ts               # SPHEREx 102 bands, targets, tutorials, docs
│   ├── pages/
│   │   ├── DocsPage.tsx              # REST API & Python SDK specification
│   │   ├── HomePage.tsx              # Hero, SED scrubber, scientific pillars
│   │   ├── SpherexPage.tsx           # Mission architecture, LVF filters, optics
│   │   ├── TeamPage.tsx              # Consortium leadership & publications
│   │   └── TutorialsPage.tsx         # Interactive Python notebook playground
│   ├── types.ts                      # Core TypeScript definitions
│   ├── App.tsx                       # Root layout & page router
│   ├── index.css                     # Tailwind CSS v4 & theme variables
│   └── main.tsx                      # Application DOM entry point
├── .env.example                      # Template for environment variables
├── .gitignore                        # Comprehensive Git ignore rules
├── CONTRIBUTING.md                   # Contribution guide for astronomers & devs
├── LICENSE                           # BSD 3-Clause open-source license
├── package.json                      # NPM configuration & dependencies
├── tsconfig.json                     # TypeScript compiler configuration
├── vercel.json                       # Vercel deployment configuration
└── vite.config.ts                    # Vite config with WASM, aliases, & dev API proxy
```

---

## Mission Heritage & Credits

SPHEREx is a NASA Astrophysics Medium-Class Explorer (MIDEX) mission operated by:
* **California Institute of Technology (Caltech)** · Lead Institution & IPAC Data Center
* **NASA Jet Propulsion Laboratory (JPL)** · Project Management & Cryogenic Payload
* **Korea Astronomy and Space Science Institute (KASI)** · Calibration & Testing
* **Harvard-Smithsonian Center for Astrophysics (CfA)** · Cosmology Working Group

Sky imagery provided by the **Centre de Données astronomiques de Strasbourg (CDS)** via [Aladin Lite](https://aladin.cds.unistra.fr/AladinLite/).

---

## License

This project is licensed under the **BSD 3-Clause License**. See [LICENSE](LICENSE) for details.
