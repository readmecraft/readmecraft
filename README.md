# ReadmeCraft

A free, browser-only tool for developers to craft a professional GitHub profile `README.md` with live preview and publishing to their personal repository.

## Features

- **Pre-fill from GitHub:** Fetches public profile and top repositories via unauthenticated GitHub API (cached in `localStorage` for 10 minutes with rate-limit messaging).
- **Curated Templates:** Five clean starting configurations:
  - Minimal (Text-first, concise)
  - Developer (Full-stack showcase)
  - Open Source (Maintainer & contributions focus)
  - Freelancer (Services & portfolio)
  - Creator (Content & community links)
- **Modular Sections:** Header, Bio, About extras, Tech stack, Pinned repositories, GitHub stats, Social links, Contact, Quote, Custom Markdown, ASCII Banner & Art, and ASCII Video (Beta).
- **Drag-and-Drop & Accessibility:** Native HTML5 drag-and-drop reordering with full keyboard move up/down controls.
- **Instant Preview:** Debounced updates (<200ms) with GitHub Light, GitHub Dark, and 375px mobile width views.
- **Zero-Cost & Private:** Runs 100% in the browser. Drafts persist in `localStorage`. Access tokens are held in-memory only during publishing and never logged or persisted.

## Architecture

The codebase strictly decouples UI from business logic:
- `/src/core/`: Framework-agnostic pure JavaScript modules (state store, undo/redo history, markdown generator, GitHub API client, ASCII conversion, quality scoring). No DOM access, designed for clean reuse in a future Next.js application.
- `/src/ui/`: DOM controllers, drag-and-drop handlers, responsive layouts, and preview rendering.
- `/vendor/`: Exact pinned versions of Markdown parser and sanitizer (`marked` and `DOMPurify`).

## Local Development

Run any static HTTP server in the repository root:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve .
```

Then open `http://localhost:8000` in your web browser.

## Deployment

Deploy directly to GitHub Pages:
1. Commit all files to your git repository.
2. In GitHub repository settings, navigate to **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and choose the `main` branch with folder `/ (root)`.

