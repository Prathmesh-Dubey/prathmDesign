# Swatchbook — Design Ideas

A premium catalogue of **live UI patterns**, built with Angular 21. Every pattern runs live on the page, and each one comes with a detailed, paste-ready prompt you can give to any AI site builder to recreate it.

| Category | What's inside |
| --- | --- |
| **Cards** (`/cards`) | Carousel, grid, stacked, swipe, masonry, bento, flip, expandable, horizontal scroll, timeline, hover-reveal, 3D tilt, coverflow, scroll-stack and image overlay cards |
| **Products** (`/products`) | Premium product cards, luxury showcases, horizontal lists, product carousels and full working catalogues (filters, sort, cart) |
| **Gallery** (`/gallery`) | Grid, masonry, carousel, justified, asymmetric, lightbox, thumbnail + main, horizontal scroll, hover overlay, filterable, bento, before/after, collage, full-width slideshow, 3D coverflow and infinite scroll |
| **Type & Blogs** (`/typography`) | Google Font pairings set inside real blog layouts: editorial, magazine, minimal, tech, personal, newsletter, long-read and lifestyle |
| **Heroes** (`/heroes`) | Liquid, fluid, jumbotron, split, gradient mesh, kinetic type, glassmorphism and interactive first screens |

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4200. Production build: `npm run build`. The output goes to `dist/design-ideas`.

Requires Node 20.19+ or 22.12+.

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`. It also creates a `404.html` copy of the app, so direct links like `/cards` still open.

One-time setup in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site is then served at `https://<user>.github.io/<repo>/`.

## Using a pattern

Every pattern card has:
- a **live preview**, which you can interact with
- a **Copy prompt** button, which copies the full build prompt
- a **full screen** button, which opens the preview at large size (press Esc to close)
- **Read full prompt**, which expands the prompt text inline

Each page has search and family filter chips at the top.

## Project layout

```
src/app/
  core/            example.model.ts (DesignExample), categories.ts
  shared/          showcase + category page shells, media/fonts/visibility helpers
  pages/
    home/
    <category>/
      <category>.page.ts       thin page wrapper (lazy-loaded route)
      <category>.examples.ts   the registry: metadata + prompt + component per pattern
      demos/*.ts               one standalone component per live demo
```

### Adding a pattern

1. Create `src/app/pages/<category>/demos/my-pattern.ts`. Make it a standalone component with an inline template and styles, and keep all state in signals (the app is zoneless).
2. Register it in `<category>.examples.ts` with `id`, `title`, `type` (the filter chip it appears under), `description`, `tags`, `prompt`, `component`, and optionally `stageHeight` and `stageTone`.

Demos only start once they scroll into view (`@defer (on viewport)`), and animation loops pause when off screen, so long pages stay fast.

## Images

Every photo is stored in the project under `public/images`, so the site loads no images from the internet. That's 493 WebP files, about 36 MB.

| Folder | Contents |
| --- | --- |
| `public/images/photos/` | 36 scene photos, each cropped to 9 shapes (`p<id>-r3x2.webp`, `p<id>-r4x5.webp` …) |
| `public/images/products/` | every Unsplash product or portrait photo the demos use, in its original shape plus the crops they ask for |
| `public/images/CREDITS.md` | photographer credits |

How the helpers in `src/app/shared/media.ts` resolve them:
- `photo(seed, w, h)` picks one of the scene photos from the seed (the same seed always gives the same photo) and uses the crop closest to `w × h`.
- `unsplash(id, w, h)` and `PRODUCT_PHOTOS` return the local copy of that photo.
- `appImgFallback` swaps any image that fails to load for a local scene photo.

The file list lives in `src/app/shared/image-manifest.ts`, which a script generates. If you add a new Unsplash id to a demo, run the script again. It only downloads files that are missing.

```bash
node scripts/download-images.mjs .
```

To use your own photos, replace the files in `public/images` and keep the same file names.
