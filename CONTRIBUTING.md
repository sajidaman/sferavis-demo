# Contributing to Sferavis

Thank you for your interest in contributing to Sferavis! Sferavis is an open-source astrophysical visualization platform and cosmic spectral atlas for the NASA SPHEREx mission.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all participants. Please be respectful and constructive in all discussions.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/sferavis.git
   cd sferavis
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Making Changes

- Create a feature branch from `main`:
  ```bash
  git checkout -b feature/my-feature-name
  ```
- Keep code consistent with the project's styling and standards:
  - Framework: React 19 + TypeScript + Vite.
  - Styling: Tailwind CSS v4.
  - Typography: Lexend, Oswald, Merriweather, JetBrains Mono.
  - No italicized text anywhere.
- Run typechecking and lint verification before submitting:
  ```bash
  npm run lint
  npm run build
  ```

## Submitting Pull Requests

1. Commit your changes with clear, descriptive commit messages.
2. Push your branch to GitHub:
   ```bash
   git push origin feature/my-feature-name
   ```
3. Open a Pull Request against the `main` branch of `sferavis/sferavis`.
4. Fill in the Pull Request template describing the purpose and scientific/UI context of your changes.

## Reporting Issues

If you find a bug or have a suggestion, please open an issue in the [GitHub Issue Tracker](https://github.com/sferavis/sferavis/issues) using the provided issue templates.
