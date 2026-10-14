import { DesignExample } from '../../core/example.model';
import { GridHoverZoom } from './demos/grid-hover-zoom';
import { GridContactSheet } from './demos/grid-contact-sheet';
import { MasonryColumns } from './demos/masonry-columns';
import { MasonryStaggerCredits } from './demos/masonry-stagger-credits';
import { CarouselPeek } from './demos/carousel-peek';
import { CarouselFilmstrip } from './demos/carousel-filmstrip';
import { JustifiedRows } from './demos/justified-rows';
import { AsymmetricEditorial } from './demos/asymmetric-editorial';
import { AsymmetricBrokenGrid } from './demos/asymmetric-broken-grid';
import { LightboxClassic } from './demos/lightbox-classic';
import { LightboxZoom } from './demos/lightbox-zoom';
import { ThumbProduct } from './demos/thumb-product';
import { ThumbVerticalRail } from './demos/thumb-vertical-rail';
import { HscrollDragPanorama } from './demos/hscroll-drag-panorama';
import { HscrollSticky } from './demos/hscroll-sticky';
import { HoverSlideMeta } from './demos/hover-slide-meta';
import { HoverDirectionAware } from './demos/hover-direction-aware';
import { FilterChipsFlip } from './demos/filter-chips-flip';
import { FilterSearch } from './demos/filter-search';
import { BentoMixed } from './demos/bento-mixed';
import { BentoFeaturedSwap } from './demos/bento-featured-swap';
import { BeforeAfterSlider } from './demos/before-after-slider';
import { BeforeAfterLens } from './demos/before-after-lens';
import { CollagePolaroid } from './demos/collage-polaroid';
import { CollageMoodboard } from './demos/collage-moodboard';
import { SlideshowKenBurns } from './demos/slideshow-ken-burns';
import { SlideshowFadeCaptions } from './demos/slideshow-fade-captions';
import { CoverflowClassic } from './demos/coverflow-classic';
import { CoverflowRing } from './demos/coverflow-ring';
import { InfiniteFeed } from './demos/infinite-feed';
import { InfiniteMarqueeWall } from './demos/infinite-marquee-wall';

export const GALLERY_EXAMPLES: DesignExample[] = [
  // ── Grid Gallery ────────────────────────────────────────────
  {
    id: 'grid-hover-zoom',
    title: 'Concrete square grid',
    type: 'Grid Gallery',
    description: 'A uniform square grid where each tile zooms, regains colour and reveals its caption on hover or focus.',
    tags: ['grid', 'hover zoom', 'captions', 'architecture'],
    component: GridHoverZoom,
    stageHeight: 480,
    stageTone: 'none',
    prompt: `Build a uniform square photo grid titled "Concrete Kindness" — 12 brutalist buildings photographed by one photographer.

Layout: cool concrete-grey background (#e6e7ea), ink #16181d, 32px padding. Header row with the title in a condensed grotesk (Bricolage Grotesque 700, 38px, letter-spacing -0.03em) on the left and a 13px meta line on the right ("12 buildings · photographed 2019–2025 by Tomasz Wierzba", the count in a monospace). Below, a CSS grid of 6 equal columns with 8px gaps; each tile is aspect-ratio 1:1 with a 4px radius. Use container queries: 4 columns under 820px, 2 under 560px.

Tiles: images object-fit: cover, rendered at grayscale(.85) by default. A small two-digit index (01–12) sits top-left in 11px monospace using mix-blend-mode: difference. The caption (building name in 15px semibold, architect in 11.5px, "City · Year" in 10.5px monospace tinted #ffb199) sits in a bottom gradient scrim (transparent → rgba(10,12,16,.82)) and starts translated 101% below the tile.

Interaction: on hover and on :focus-visible the image scales to 1.12 over 0.7s with cubic-bezier(.2,.7,.2,1), returns to full colour, and the caption slides up over 0.45s. Tiles are focusable (tabindex 0) with a two-ring focus style (3px grey gap + 2px #ff5a36). Every image has alt text naming its series; use loading="lazy".

Touch: under (hover: none) the building name stays visible on every tile; tapping a tile (tracked via a pointerType check so mouse clicks don't latch) toggles an .open class that mirrors the hover zoom, colour and full caption.`,
  },
  {
    id: 'grid-contact-sheet',
    title: 'Contact sheet with grease-pencil selects',
    type: 'Grid Gallery',
    description: 'A gapless film contact sheet with edge numbers where clicking a frame circles it in red grease pencil.',
    tags: ['contact sheet', 'film', 'selection', 'svg stroke'],
    component: GridContactSheet,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a photographic contact sheet for "Roll 07 — Alfama, Lisbon" by Ana Ribeiro: 24 exposures laid out as four film strips of six frames each.

Page: warm grey paper (#e9e5df) with 26px padding; the sheet itself is near-black film base (#121110), 3px radius, soft drop shadow. Header in monospace (Geist Mono 15px, #f1ede6) with a meta line in #a59f94, and on the right a live count of selects written in a marker font (Permanent Marker, 22px, #ff3b30).

Each strip: a top edge row in 9.5px monospace orange (#ff9a3c, letter-spacing .08em) printing "▸ 13  13A" above each frame; then a gapless 6-column grid of 3:2 frames (no gaps, no radius); then a bottom edge row in dim amber (#8c6a3f) reading "SAFETY FILM 400 · 135" and the roll/strip number.

Frames are buttons with aria-pressed. Hovering a frame brightens it while all its neighbours dim to brightness .55 (use :has()). Clicking toggles a select: an SVG hand-drawn ellipse path in #ff3b30 (3.2px, round caps, non-scaling stroke) overflowing the frame by ~6% draws itself in via stroke-dashoffset over 0.5s. A "Clear" button resets selects; the count is aria-live.

Responsive: under 640px container width switch to 3 frames per row. Use a 2px orange focus outline inset on frames.

Touch: wrap the hover dimming in @media (hover: hover) so a sticky :hover after a tap never greys the roll; give the small Clear button a 40px pseudo-element hit area and touch-action: manipulation.`,
  },

  // ── Masonry Gallery ─────────────────────────────────────────
  {
    id: 'masonry-columns',
    title: 'Highlands & Fjords column masonry',
    type: 'Masonry Gallery',
    description: 'A pure CSS-columns masonry of mixed-ratio landscapes with serif captions and coordinates, scrolling inside its frame.',
    tags: ['masonry', 'css columns', 'landscape', 'serif'],
    component: MasonryColumns,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a masonry gallery called "Highlands & Fjords" using only CSS multi-column layout.

Frame: 600px tall, background #e8ece8, ink #1d2a24. Header with the title in Instrument Serif 46px (the ampersand italic, coloured #4f7a63) and a 13px subtitle "Fourteen frames from a north-sea crossing — Mhairi Lennox, 2024", separated by a 1px #c9d2cb rule.

Body: an internally scrolling area (overflow-y auto, thin scrollbar #9fb0a5) with a bottom fade made with mask-image (solid until 50px from the bottom). Inside, columns: 4 200px with 14px column gap. Each figure uses break-inside: avoid and an 18px bottom margin. Images keep their natural aspect ratio (mix portrait 3:4, 2:3, landscape 3:2, panoramic 1.6:1 and square) — set width/height attributes and aspect-ratio so the layout never jumps while loading; 2px radius; placeholder #cdd6cf.

Captions sit below each image as a flex row: place name in Instrument Serif 16px on the left, latitude/longitude in 10px monospace (#6d7d73) on the right, e.g. "Quiraing, Isle of Skye — 57.62° N, 6.29° W".

Hover: image lifts 3px with a soft shadow (0 16px 30px -18px rgba(29,42,36,.6)) over 0.5s. The scroll area is focusable for keyboard scrolling with a visible green focus ring. Use loading="lazy" and descriptive alt text.

Touch: the scroller uses overscroll-behavior: contain; under 480px switch to two tight columns with the coordinates stacked under each place name.`,
  },
  {
    id: 'masonry-stagger-credits',
    title: 'Street Index masonry with credits',
    type: 'Masonry Gallery',
    description: 'A JS-balanced masonry of street photographs that staggers cards in as they load, each credited to its photographer.',
    tags: ['masonry', 'stagger', 'credits', 'dark', 'resize observer'],
    component: MasonryStaggerCredits,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a dark community photo wall "Street Index" with a JavaScript masonry that keeps left-to-right reading order.

Style: background #0f0f12, text #ececf1, font Space Grotesk. Header with a 32px bold title, a 12.5px grey meta line ("16 frames · 15 photographers · community picks this week") and a pill "Shuffle picks" button (#1b1b21, 1px #34343d border, border turns #ffd23f on hover).

Layout: a 620px-tall frame whose body scrolls internally. Measure the scroller with ResizeObserver and choose 2 / 3 / 4 columns below 460px / 760px / above. Distribute items with a shortest-column-first algorithm using each photo's known height/width ratio so heights stay balanced; render as a grid of flex columns with 12px gaps.

Card: #17171c, 1px #222229 border, 12px radius. The image box reserves its aspect ratio and shows a subtle shimmer gradient until loaded. Below it, a credit row: a 30px circular avatar with the photographer's initials on a hue unique to them (hsl(h 70% 62%)), the photo title (13.5px, ellipsis), and "Name @handle" with the handle in #ffd23f.

Motion: cards start at opacity 0, translateY(26px), scale .97. When each image fires load, it plays a 0.7s cubic-bezier(.2,.8,.2,1) rise with a stagger delay of 55ms × its position. Shuffle randomises order, rebalances columns, scrolls to top and replays the stagger. Images scale 1.04 on hover.

Touch: overscroll-behavior: contain on the scroller, a 40px Shuffle button on coarse pointers with a pressed state.`,
  },

  // ── Carousel Gallery ────────────────────────────────────────
  {
    id: 'carousel-peek',
    title: 'Coastal Routes peeking carousel',
    type: 'Carousel Gallery',
    description: 'A centred slide carousel with neighbouring slides peeking in, arrows, pill dots, swipe and arrow-key control.',
    tags: ['carousel', 'swipe', 'keyboard', 'travel'],
    component: CarouselPeek,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a centred, peeking image carousel called "Coastal Routes" featuring six famous coast roads (Amalfi Coast, Big Sur, Great Ocean Road, Wild Atlantic Way, Cabot Trail, Adriatic Highway).

Style: background #dde7f0, ink #0f2540, title in Fraunces 600 at 40px (soft axis on), counter "01 / 06" in monospace on the right.

Track: a flex row with 16px gaps; each slide is 62% of the container width (80% under 640px), aspect-ratio 16:10, 18px radius. Position the track with container units: translateX(calc((100cqw - slideW)/2 - index × (slideW + 16px) + dragOffset)), transitioning 0.6s cubic-bezier(.22,.8,.2,1). Inactive slides scale to .9 at 55% opacity; the active slide is full size with a deep shadow (0 30px 50px -28px rgba(15,37,64,.55)).

Caption: on the active slide only, a bottom gradient scrim fades and slides up (0.5s, 150ms delay) with region (12.5px), route name (Fraunces 34px) and "distance · photo credit" in 11px monospace.

Controls: white 46px circular arrow buttons that sit on the edges of the active slide and hide at the ends; pill dots below (8px dots, active stretches to 28px and turns navy). Pointer drag/swipe with pointer capture: follow the finger, rubber-band at the ends (30%), and change slide past 40px. Clicking a peeking slide moves to it. Arrow keys work when the region has focus. Use role="region", aria-roledescription="carousel", per-slide labels "2 of 6: Big Sur", and an aria-live counter.

Touch: the viewport uses touch-action: pan-y with pointer capture after 8px of horizontal travel; release past 40px changes slide, pointercancel springs back, and the click that ends a drag is ignored. Dots keep their 8px look but get a 40px invisible hit area.`,
  },
  {
    id: 'carousel-filmstrip',
    title: 'Night Shift film-strip carousel',
    type: 'Carousel Gallery',
    description: 'A darkroom-red film strip with sprocket holes that glides the selected portrait to centre and develops it into colour.',
    tags: ['carousel', 'film strip', 'portraits', 'dark'],
    component: CarouselFilmstrip,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a film-strip carousel of nine night-worker portraits titled "Night Shift — Portraits by Inès Moreau · Paris, 2024".

Mood: darkroom safelight. Background radial gradient from #3a0f0c to #120605. Title in Anton, uppercase, 64px, #ff3b2f; meta in IBM Plex Mono 12px #c48c82. On the right of the header, a huge outlined frame number (Anton 96px, transparent fill, 1px #ff6b5e text stroke) that updates with the selection.

Strip: a full-width black (#0a0a0a) band with 26px vertical padding and sprocket holes along the top and bottom made from a repeating-linear-gradient (10px pale #e9d7c2 rectangles every 28px, 12px tall). Inside, a flex track of 4:5 portrait frames, width clamp(150px, 24cqw, 210px), 10px gaps. Centre the active frame with translateX(calc(50cqw - frameW/2 - index × (frameW + gap))) and a 0.7s cubic-bezier(.65,0,.25,1) glide.

Frames: inactive ones are grayscale, brightness .5 and scaled 1.06; hover lifts them to partial colour; the active frame "develops" to full colour at scale 1 over 0.6s. Each frame shows a tiny "4A" edge number in orange monospace.

Footer: two 44px circular outline buttons (fill #ff3b2f on hover) around a centred aria-live caption with the sitter's name (Plex Mono 15px, white) and role ("Baker, Rue Myrha"). Clicking any frame selects it; arrow keys work when the carousel region is focused.

Touch: the strip follows a horizontal finger drag (touch-action: pan-y, pointer capture after 8px, rubber-band at the ends); release past 40px advances one frame per ~180px dragged, and the click that ends a drag never selects a frame. Under 420px frames are 46% of the width.`,
  },

  // ── Justified Gallery ───────────────────────────────────────
  {
    id: 'justified-rows',
    title: 'Kyoto justified rows',
    type: 'Justified Gallery',
    description: 'Flickr-style justified rows computed from each photo’s aspect ratio, re-flowing on resize and with an adjustable row height.',
    tags: ['justified', 'resize observer', 'layout algorithm', 'slider'],
    component: JustifiedRows,
    stageHeight: 580,
    stageTone: 'none',
    prompt: `Build a justified-rows photo gallery ("Kyoto, early April" — 20 frames by Haruto Mori) where every row is exactly the container width and every photo keeps its aspect ratio.

Style: background #fbfbfa, ink #1e1e1e, accent #c2185b. Header with a 30px grotesk title, a meta line that reports the live row count, and on the right a labelled range input "Row height" (110–260px, step 10, default 170) with accent-color #c2185b and the current value in monospace.

Algorithm (in JS, no library): store each photo's aspect ratio (w/h — mix 0.66, 0.75, 1, 1.33, 1.5, 1.78, 2.2, 2.4). Walk the list, adding photos to the current row and summing ratios; when sumRatios × targetHeight + gaps ≥ containerWidth, close the row with height = (containerWidth − gaps) / sumRatios. The last row keeps the target height (never stretched). Each photo's width = ratio × rowHeight. Gap 6px between photos and rows.

Measure the scroller's clientWidth minus padding with a ResizeObserver so the layout recomputes on resize and never overflows horizontally. The whole frame is 580px tall and the gallery scrolls internally.

Visuals: 3px radius, #ecebe8 placeholder, object-fit cover. Row height and photo width animate over 0.35s cubic-bezier(.2,.7,.2,1) when the slider moves. On hover the photo zooms to 1.05 and a white pill caption (12px, 500) fades up from the bottom-left. Use lazy loading and meaningful alt text; make the scroller keyboard-focusable.

Touch: titles are always visible as small pills under (hover: none); tapping a frame toggles the hover zoom. The range input is 32px tall on coarse pointers and the scroller uses overscroll-behavior: contain.`,
  },

  // ── Asymmetric Gallery ──────────────────────────────────────
  {
    id: 'asymmetric-editorial',
    title: 'The Linen Issue editorial spread',
    type: 'Asymmetric Gallery',
    description: 'A magazine-style asymmetric spread with offset images of different sizes, numbered credits and a pull quote.',
    tags: ['editorial', 'asymmetric', 'fashion', 'serif'],
    component: AsymmetricEditorial,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create an asymmetric fashion-editorial gallery spread for "The Linen Issue" (No. 14 — Summer 2026), shot by Clémence Duval.

Palette: paper #f2f2ef, ink #121212, a single oxblood accent #7a1f2b. Type: Playfair Display — the headline "The Linen Issue" at 86px, weight 400, line-height .88, with "Linen" in italic oxblood; a 15px serif dek ("Six looks cut from Lithuanian flax, shot on the salt flats of Aigues-Mortes"). Issue line in 11px monospace oxblood.

Layout: a 12-column CSS grid with 44px implicit rows and 16px column gaps. Place deliberately uneven figures: a tall portrait spanning columns 5–8 and rows 1–9; a landscape at columns 9–12 starting one row lower (rows 2–6); a small portrait at 10–12 dropped further (rows 7–11, extra 18px top margin); a square at 2–4 under the headline (rows 7–10). A pull quote in italic serif (22px) with a 2px oxblood left rule sits in columns 5–9 at the bottom, with a small sans "— Ieva Kairytė, weaver" credit.

Each figure: image in an overflow-hidden frame (object-fit cover, saturate .85), then an 11.5px caption "01 Atelier Mirelle — oversized shirt, €240" with the number in oxblood monospace. Hover: image slowly scales to 1.035 over 1s cubic-bezier(.2,.7,.2,1), regains full saturation, and the number turns black.

Responsive (container query under 700px): switch to 6 columns with auto rows, let the first image span five of the six columns and the second sit offset one column in, and give each figure an aspect ratio so the asymmetry survives on phones.

Touch: hover zooms are mirrored on :active; under 700px the spread stacks without overlapping captions.`,
  },
  {
    id: 'asymmetric-broken-grid',
    title: 'Casa Orla broken grid',
    type: 'Asymmetric Gallery',
    description: 'An interiors broken-grid layout where photos overlap visible column lines, a colour block and giant outlined type, with pointer parallax.',
    tags: ['broken grid', 'parallax', 'interiors', 'overlap'],
    component: AsymmetricBrokenGrid,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a broken-grid interiors gallery for "Casa Orla", a 1962 fisherman's house in Comporta re-plastered by Atelier Sousa Lobo.

Palette: deep forest #1f3b2f background, blush #f2c6b4 for the title and one solid colour block, text #f6e7df. Font: Syne (500/700/800).

Structure: a 560px-tall, overflow-hidden canvas. Draw five equal columns as faint 1px vertical lines (rgba(246,231,223,.12)) — then deliberately break them. Behind everything, the word "Orla" in Syne 800 at ~30cqw, transparent fill with a 1.5px blush text-stroke at 35% opacity, bleeding off the bottom-left. A blush rectangle (26% × 54%) sits mid-canvas. Four absolutely-positioned photos overlap it and each other at percentage positions and sizes: a tall portrait (30% × 58%), a small square top-right, a wide landscape lower right, and a small portrait bottom-centre — all with a deep shadow (0 30px 50px -24px rgba(0,0,0,.6)).

Left column: title "Casa Orla" (40px, 800, blush), a 13px description, and a definition list (Area 148 m², Photos Rui Calado, Year 2025) with hairline separators.

Interaction: pointer parallax. Map the pointer to −1…1 on both axes and set CSS variables; each photo translates by its own depth (18–52px), the colour block by 8px and the giant word in the opposite direction (−14px), all with a 0.4s ease-out transition. Hovering a photo slowly zooms it to 1.06. Disable parallax for touch and prefers-reduced-motion.

Responsive: under 640px reposition the photos into a taller stacked collage below the text and hide the spec list.

Touch: the pointer parallax is skipped for touch pointers so the composition stays still while scrolling; photo zoom mirrors on :active.`,
  },

  // ── Lightbox Gallery ────────────────────────────────────────
  {
    id: 'lightbox-classic',
    title: 'Okavango lightbox viewer',
    type: 'Lightbox Gallery',
    description: 'A mosaic grid that opens a full viewer with prev/next, keyboard and swipe navigation, a counter, captions and a thumbnail rail.',
    tags: ['lightbox', 'keyboard', 'focus trap', 'swipe'],
    component: LightboxClassic,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Build a photo grid with a real lightbox viewer for "Okavango, flood season" — nine frames by three photographers.

Grid: background #f1efe9, ink #23251f, accent #8a6d3b. Title in Cormorant Garamond 500 (42px) with "flood season" italic in the accent colour. A 6-column CSS grid with 92px rows, 8px gaps and grid-auto-flow: dense; tiles span 1–2 columns and 1–3 rows to make a mosaic. Each tile is a <button> with 6px radius; on hover the image scales to 1.05 and darkens slightly, and a 30px white circular "expand" icon fades in at the top-right.

Lightbox: an overlay covering the gallery (rgba(14,14,12,.94) with an 8px backdrop blur) fading in over 0.3s, laid out as three rows. Top bar: counter "3 / 9" in monospace and a 40px circular close button. Middle: the large image with object-fit: contain, 3px radius, deep shadow, entering with a 0.45s slide+fade from the direction of travel (30px). Circular prev/next buttons on the left/right edges; navigation wraps around. Bottom: caption (title in Cormorant 22px, "place · photographer" in 12.5px at 60% opacity) and a rail of 40×30 thumbnails — the active one full opacity with a gold (#d8b878) outline.

Behaviour: Escape closes (and must not close any parent fullscreen), ArrowLeft/Right step, Tab is trapped inside the dialog, focus moves to the close button on open and returns to the originating tile on close. Clicking the dark backdrop closes; horizontal swipes over 40px step. Use role="dialog", aria-modal, an aria-live counter. On narrow screens hide the thumbnail rail and keep the side arrows as translucent overlays.

Touch: in the viewer the photo follows a horizontal swipe (touch-action: pan-y, capture after 8px), hands over past 40px or springs back, and the click that ends a swipe never closes the viewer. On narrow stages the prev/next buttons stay visible as translucent 40px circles.`,
  },
  {
    id: 'lightbox-zoom',
    title: 'Porto zoom-and-pan lightbox',
    type: 'Lightbox Gallery',
    description: 'A clean white lightbox where clicking zooms into the exact point you clicked, dragging pans, and the wheel or +/− keys zoom smoothly.',
    tags: ['lightbox', 'zoom', 'pan', 'wheel', 'keyboard'],
    component: LightboxZoom,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a zoomable lightbox gallery "Porto, up close" — six façade-detail photographs by Duarte Neves.

Grid: background #f7f8fb, ink #0b1f3a, cobalt accent #2343a8, font Archivo (800 at 85% width for the 40px title). Three columns (two under 560px) of 16:10 image buttons with 12px gaps and 2px radius; each carries a white label tab in the bottom-left ("01 Capela das Almas", number in cobalt monospace). Hover scales the image to 1.04.

Viewer: a white overlay that scales in from .985 over 0.25s, with three rows. Top bar: title + street on the left, a pill zoom control (− / "250%" output / +) and a 36px navy circular close button. Middle: a checkerboard (#f2f4f8/#fff, 20px) viewport containing the image at object-fit: contain. Bottom: Prev / "2 / 6" / Next.

Zoom maths: transform the image with translate(tx, ty) scale(s) about its centre. To zoom at a point q (relative to the viewport centre) keep that point fixed: p = (q − t) / s; t' = q − s' × p. Clamp pan to ±(s − 1) × size / 2 so edges never show. Click (with < 4px movement) at scale 1 zooms to 2.5× at the click point; click when zoomed resets. Drag with pointer capture pans (no transition while dragging; otherwise 0.45s cubic-bezier(.2,.8,.2,1)). Wheel zooms ×1.15 per notch about the cursor, between 1× and 4×. Cursor shows zoom-in / grab / grabbing; a "Click to zoom" pill hint shows at 1×.

Keyboard: + / − zoom, 0 resets, arrows pan when zoomed or change photo when not, Escape closes and returns focus to the opening tile.

Touch: unzoomed, the view is touch-action: pan-y and a horizontal swipe past 40px moves to the next detail while the image follows the finger; a clean tap zooms to 250% at the tapped point, and once zoomed the view switches to touch-action: none so one finger pans (no pinch needed). Zoom and nav buttons are 40px+ on coarse pointers.`,
  },

  // ── Thumbnail + Main Image ──────────────────────────────────
  {
    id: 'thumb-product',
    title: 'Hasami mug product gallery',
    type: 'Thumbnail + Main Image',
    description: 'A product-page gallery: crossfading main image with hover-to-inspect zoom, arrows and a keyboard-navigable thumbnail row.',
    tags: ['product', 'thumbnails', 'zoom on hover', 'tabs'],
    component: ThumbProduct,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a product image gallery for "Block Mug, Set of Two" by Maruhiro (Hasami, Nagasaki), ¥5,280.

Page: soft porcelain blue-grey #e8ecf0 around a white card (20px radius, padding 24px, shadow 0 20px 50px -30px rgba(28,35,43,.35)). Font Manrope (500–800), ink #1c232b, hover accent #3b5b7a. Two columns (a 400px gallery column and a 420px info column, centred); stack below 680px container width.

Main image: square, 14px radius, #f1f3f5 backdrop. Stack all five views (Front, Handle detail, Glaze close-up, Stacked set, In use) absolutely and crossfade the active one over 0.5s. Overlays: a white pill badge top-left ("2 / 5 · Handle detail"), a dark translucent "Hover to inspect" pill top-right, and 38px white circular prev/next arrows. Hover-to-inspect: while the pointer is over the image, scale the active image to 2.1× with transform-origin following the cursor (CSS variables in %, 0.35s ease-out) and fade the badge and hint away (keep the arrows). Ignore touch pointers.

Thumbnails: a 5-column row of square 10px-radius buttons beneath, images at 70% opacity; hovered/active go to 100% and the active one gets an inset 2px ink ring (box-shadow on ::after). Implement as a tablist with roving tabindex: arrow keys, Home and End move selection and focus.

Info column: maker line, 34px 800-weight title, price with "incl. tax", a short description, three round glaze swatches as a radiogroup (Celadon #a9c3b4, Ash white #e6e2da, Indigo #34476b) with a ring on the selected one, and a full-width 50px "Add to bag" button.

Touch: on the main image a horizontal swipe changes the view, a tap opens the 2x loupe at the tapped point, dragging while it is open moves the loupe (touch-action switches to none), and another tap closes it. The hint reads 'Tap to inspect' under (hover: none); swatches get an 8px invisible hit ring.`,
  },
  {
    id: 'thumb-vertical-rail',
    title: 'Osteria Lume tasting-menu rail',
    type: 'Thumbnail + Main Image',
    description: 'A vertical thumbnail rail with a sliding indicator that crossfades a large main photo and staggers in each course’s caption.',
    tags: ['vertical thumbnails', 'crossfade', 'food', 'dark'],
    component: ThumbVerticalRail,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Create a vertical-rail image gallery for a seven-course tasting menu at "Osteria Lume · Bologna".

Mood: candlelit. Background #171310, text #f4ece1, saffron accent #e8a33d. Titles in DM Serif Display.

Layout: a two-column grid — a narrow left rail and a large main image (16px radius) filling the rest, minimum 420px tall. The rail stacks seven 80×64px thumbnail buttons (8px radius, 8px gap). A 3px saffron indicator bar sits to the left of the rail and slides to the active thumb with translateY(index × (thumbHeight + gap)) over 0.5s cubic-bezier(.65,0,.25,1). Inactive thumbs are grayscale(.7) and brightness(.6); hover brightens and scales them to 1.06; the active thumb is full colour.

Main image: all seven photos are stacked; the active one fades in over 0.9s while easing from scale 1.08 to 1 over 1.6s (a quiet push-in). A left-to-right dark gradient scrim holds the caption in the lower-left: "Course 3 of 7" (12.5px, saffron, with the total dimmed), the dish name in DM Serif Display at ~50px ("Risotto, saffron & bone marrow"), a 14px provenance note, and a pill with a wine-glass icon and the pairing ("Timorasso, Vigneti Massa 2021", saffron outline). Each caption line rises 14px and fades in with 60ms stagger when the course changes. An italic restaurant name sits top-right.

Accessibility: the rail is a vertical tablist with roving tabindex; Up/Down (and Left/Right), Home and End move selection and focus. The caption region is aria-live. Under 600px the rail becomes a horizontal scrolling row beneath the image, the indicator is replaced by an outline on the active thumb.

Touch: swipe the photo horizontally to change course; on phones the horizontal rail scroll-snaps, uses overscroll-behavior-x: contain and scrolls itself to keep the active thumb centred.`,
  },

  // ── Horizontal Scroll Gallery ───────────────────────────────
  {
    id: 'hscroll-drag-panorama',
    title: 'Ruta 40 drag-to-scroll panoramas',
    type: 'Horizontal Scroll Gallery',
    description: 'A horizontal strip of mixed-width panoramas you can fling with the mouse, with inertia, a custom drag cursor and a progress line.',
    tags: ['horizontal scroll', 'drag', 'inertia', 'custom cursor'],
    component: HscrollDragPanorama,
    stageHeight: 500,
    stageTone: 'none',
    prompt: `Build a drag-to-scroll panoramic strip "Ruta 40 → Austral" — seven Patagonia panoramas by Valentina Ríos.

Style: deep glacier navy #0e1a24, text #e7f0f5, ice-blue accent #7fc8e8, muted #8aa3b3. Headline in Unbounded 700 (36px) with "→ Austral" in the accent at weight 400.

Strip: a native horizontally-scrolling flex row (overflow-x auto, hidden scrollbar, 14px gap, 340px tall) so trackpads, touch and keyboard all work. Each figure keeps its own aspect ratio (1.4 to 3:1) at full height, 6px radius. A frosted pill caption sits bottom-left: "km 238" in tiny Unbounded accent, the place name, and the latitude in monospace. The strip ends with a dashed "Fin del camino" card.

Mouse dragging: on pointerdown (mouse, left button) capture the pointer, move scrollLeft by the pointer delta, and track velocity (px/ms). On release, continue with inertia in a requestAnimationFrame loop multiplying velocity by 0.94 per frame until it drops below 0.4px. While dragging, images scale to .97 for a tactile squeeze. Skip inertia with prefers-reduced-motion.

Custom cursor: hide the system cursor over the strip (except on coarse pointers) and show a 72px accent-coloured circle labelled "Drag" that follows the pointer; it scales in from 0 on enter and shrinks to .75 while pressed (0.3s cubic-bezier(.2,.8,.2,1)).

Footer: a 2px progress line whose fill scaleX tracks scrollLeft / maxScroll, plus two 40px circular outline buttons that smooth-scroll by 70% of the viewport width. The strip is focusable with a visible focus ring.

Touch: the JS drag and custom cursor are mouse-only; touch uses native overflow scrolling with scroll-snap proximity and overscroll-behavior-x: contain. Under 480px the strip is 270px tall.`,
  },
  {
    id: 'hscroll-sticky',
    title: 'A day in Marrakech scroll-jacked strip',
    type: 'Horizontal Scroll Gallery',
    description: 'Vertical scrolling inside the frame drives a pinned horizontal gallery, with a sun-arc clock and a dawn-to-night colour shift.',
    tags: ['sticky', 'scroll-driven', 'horizontal', 'storytelling'],
    component: HscrollSticky,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a scroll-driven horizontal gallery "A day in Marrakech" (eight photographs by Youssef Amrani, each tagged with a time from 06:10 to 22:30).

Structure: a 560px-tall element that scrolls vertically on its own (overflow-y auto). Inside: a 300px intro (by-line, Young Serif headline at ~76px with "Marrakech" in #d8572a, and an outlined "Scroll inside this frame ↓" pill whose arrow bobs), then a 2600px "runway" section, then a 260px outro line. Within the runway, a position: sticky; top: 0 panel exactly as tall as the frame holds three rows: a clock, the track, and a progress meter.

Scroll maths: progress = clamp((scrollTop − runway.offsetTop) / (runwayHeight − frameHeight), 0, 1). Measure travel = track.scrollWidth − frame.clientWidth with a ResizeObserver, then translate the track with translate3d(−progress × travel px, 0, 0). Keep every value in reactive state; no libraries, no scroll events on the window.

Track: a flex row of figures 220–380px wide (34cqw), alternating 4:5 portraits and 4:3 landscapes offset 70px lower, 4px radius, soft shadow; captions show the time in monospace #d8572a then the place ("13:20 Ben Youssef courtyard").

Clock: a 64×32px semicircle outline with a #d8572a sun dot that travels along the arc (rotate from −90° to +90° with progress) next to the current time in Young Serif 44px, derived from progress × 8.

Atmosphere: the background is color-mix(in oklab, #f2c7a5, #1b1531 progress×100%) — dawn apricot to night indigo — and the text flips from #3b1d17 to #f6e3d6 past 62%. A 2px meter at the bottom fills with progress. Make the scroller focusable for keyboard scrolling.

Touch: the frame scrolls natively; scroll chaining is left on so a phone user who reaches either end continues scrolling the page.`,
  },

  // ── Hover Overlay Gallery ───────────────────────────────────
  {
    id: 'hover-slide-meta',
    title: 'Atelier Nørre lookbook overlay',
    type: 'Hover Overlay Gallery',
    description: 'A fashion lookbook row where a black info panel slides up on hover or focus and its details cascade in line by line.',
    tags: ['hover overlay', 'fashion', 'stagger', 'lookbook'],
    component: HoverSlideMeta,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Build a four-look fashion lookbook row for "Atelier Nørre AW26" (shot in Aarhus by Sofie Lindqvist) with sliding hover overlays.

Style: background #f4f4f2, ink #0d0d0d, cobalt accent #2b3bff. Big Shoulders Display 800, uppercase, for the 52px title (with "AW26" in cobalt) and for look names. No radius anywhere — sharp editorial edges.

Grid: four equal columns (two under 680px container width), 10px gaps; each look is a 3:4.3 portrait with object-fit cover. A large two-digit look number ("03", 46px, white, mix-blend-mode: difference) sits top-left.

Hover/focus (each look is focusable with tabindex 0, and :focus also triggers so taps work on touch):
– the image scales to 1.07 and drifts up 3% over 0.9s cubic-bezier(.2,.7,.2,1);
– the look number slides up and out (translateY(−120%), fade);
– a black panel inset 8px from the left, right and bottom slides up from below the card (translateY(100% + 10px) → 0, 0.55s cubic-bezier(.7,0,.2,1));
– its contents cascade: "Look 03" in 11px monospace lavender (#8e96ff), the look name in 26px Big Shoulders, the pieces line ("Mohair crewneck · wool skirt", 12px grey), and a footer with the price (€ 640) and a cobalt "Shop the look" button. Each line fades up 10px with delays of 180/240/300/360ms.

Unhovering reverses with no delays so the panel drops away briskly. Provide aria-labels with the look name and price, and a 3px inset cobalt ring on keyboard focus.

Touch: under (hover: none) each look shows a compact panel with name and price by default; tapping a look (non-mouse pointers only) toggles an .open class that mirrors the full hover panel, and it closes on blur. Keyboard uses :focus-visible.`,
  },
  {
    id: 'hover-direction-aware',
    title: 'Tokyo night direction-aware hover',
    type: 'Hover Overlay Gallery',
    description: 'A grid whose gradient caption overlay slides in from whichever edge the pointer entered and exits toward the edge it left.',
    tags: ['direction-aware', 'hover', 'web animations', 'neon'],
    component: HoverDirectionAware,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a direction-aware hover gallery "Tokyo, after the last train" — six night photographs (Omoide Yokochō, Golden Gai, Nonbei Yokochō…) by Riku Tanabe.

Style: near-black #08080d, text #f2f2f7, muted #8b8ba3, font Space Grotesk 700 for the 34px title. A 3-column grid (2 under 560px) of 16:10 tiles with 6px gaps and square corners; images are slightly over-scaled (1.08) and saturated (1.15).

Overlay: a full-tile gradient panel (160deg, rgba(255,46,136,.86) → rgba(64,36,255,.86)) parked just outside the tile. Content bottom-aligned: place name (26px, 700), a row with the ward and the time ("Shinjuku · 01:12" with the time in monospace), plus a tiny top-right label like "← from right" that reports the entry side.

Direction detection: on pointerenter, take the pointer position relative to the tile centre, normalise for the tile's aspect ratio, and compute side = round((atan2(y, x) × 180/π + 180) / 90 + 3) mod 4 → 0 top, 1 right, 2 bottom, 3 left. Animate with the Web Animations API (fill: forwards, 420ms, cubic-bezier(.2,.8,.2,1)): the overlay goes from translate(±101%) on that side to none, while the photo drifts 4% away from the entry edge for parallax. On pointerleave, compute the exit side the same way and animate from the overlay's current computed transform to that side — so it leaves where the pointer leaves.

Keyboard: tiles are focusable; focus slides the overlay up from the bottom, blur drops it back. Under prefers-reduced-motion use a 1ms duration. Add aria-labels with name, ward and time.

Touch: ignore pointerenter/leave for non-mouse pointers. A clean tap (under 10px of movement) opens the overlay from the edge nearest the finger, tapping another tile sends the old overlay out toward the new tap, tapping the same tile closes it, and tapping elsewhere closes it on blur. Enter/Space toggle for keyboard. The header hint swaps to tap wording under (hover: none).`,
  },

  // ── Filterable Gallery ──────────────────────────────────────
  {
    id: 'filter-chips-flip',
    title: 'Studio Halden FLIP filter',
    type: 'Filterable Gallery',
    description: 'Sector chips with live counts that filter a project grid — leaving tiles shrink away and the rest glide to their new places with FLIP.',
    tags: ['filter', 'FLIP', 'chips', 'web animations', 'interiors'],
    component: FilterChipsFlip,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build a filterable portfolio grid for "Studio Halden — Selected interiors, 2019–2026" with 15 projects across four sectors: Residential, Hospitality, Retail, Workplace.

Style: background #f6f5f3, ink #1f1d1a, a mustard highlight #c9a227. Font Sora (400/600), title 32px with tight −0.04em tracking.

Chips: a toolbar of pill buttons (34px tall, white, 1px #dcd8d2 border) — "All 15", "Residential 5", "Hospitality 4"… Each count sits in its own small round monospace badge (#efece8). The active chip turns ink-black with white text and a mustard count badge; use aria-pressed, and announce "N projects shown" in a visually hidden aria-live region.

Grid: 5 columns (4 under 860px, 3 under 600px), 10px gaps, 4:3 tiles with 10px radius; a bottom gradient caption with name (13.5px, 600) and "City · Sector".

FLIP animation with the Web Animations API, no libraries:
1. On chip click, record every tile's getBoundingClientRect keyed by project id.
2. Animate tiles that will disappear to opacity 0 / scale .85 over 200ms ease-in and wait for them to finish.
3. Apply the filter, then after the next render read the new rects. For tiles that stayed, play from translate(dx, dy) scale(sx, sy) with transform-origin 0 0 to none over 520ms cubic-bezier(.2,.8,.2,1).
4. Tiles that newly appear rise from translateY(16px) scale(.9) at opacity 0, 460ms, staggered 30ms each after a 120ms delay.
Ignore clicks while an animation is in flight, and skip all motion (instant filter) under prefers-reduced-motion. Hover gently zooms a tile's image to 1.05.

Touch: chips are 40px tall on coarse pointers with touch-action: manipulation; under 600px they become a single horizontally scrolling snap rail that bleeds to the edges, and the grid drops to two columns under 420px.`,
  },
  {
    id: 'filter-search',
    title: 'Mercado search and series filter',
    type: 'Filterable Gallery',
    description: 'A sidebar search with accent-insensitive matching and highlighted results, combined with series filters whose counts react to the query.',
    tags: ['search', 'filter', 'highlight', 'empty state', 'food'],
    component: FilterSearch,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a searchable, filterable food-photography gallery "Mercado" (14 dishes from Mexican markets and fondas, photographed by Camila Herrera).

Palette: blush #fff0ec background, deep market green #143d2b text, chilli red #e2432a accents, highlighter yellow #ffd23f. Fraunces for display (italic 700 title at 40px in red; 16px 600 dish names).

Layout: a 600px-tall two-column grid — a 240px sidebar and a results area that scrolls internally. Under 700px container width, stack the sidebar above the results and turn the series list into a horizontal scrolling row of pills.

Sidebar: a 42px search field with a magnifier icon, 1.5px green border, 12px radius, a soft red focus halo, and a round "×" clear button that appears only when there is text. Below, a radiogroup of series — Everything, Breakfast, Street food, Bakery, Seafood — as full-width rows with a monospace count on the right; the selected row is filled green with blush text.

Logic: normalise strings with NFD and strip diacritics so "atun" matches "atún". The query matches dish name and place. Series counts are computed from the query-filtered set, so they update live as you type. Results show "6 photographs for “taco” in Street food" in an aria-live status line.

Results: an auto-fill grid (minmax(170px, 1fr), 14px gap) of square, 14px-radius photos with a small white series tag pill, then the dish name and place, with the matched substring wrapped in <mark> (yellow, 3px radius). Each result pops in (opacity 0, translateY(12px), scale .96 → none) over 0.5s with a 35ms per-item stagger whenever the result set changes.

Empty state: a dashed rounded box with "Nothing on the menu for “…”" in Fraunces and a red pill "Reset filters" button that clears both query and series.

Touch: the search input is 16px on coarse pointers so iOS doesn't zoom on focus; the clear button gets a 42px invisible hit area; the series rail and results scroller use overscroll-behavior: contain.`,
  },

  // ── Bento Gallery ───────────────────────────────────────────
  {
    id: 'bento-mixed',
    title: 'Ring Road bento journal',
    type: 'Bento Gallery',
    description: 'A travel-journal bento mixing photo tiles of different spans with a stat tile and a mini route map that draws itself on hover.',
    tags: ['bento', 'grid areas', 'travel', 'svg'],
    component: BentoMixed,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Build a bento-grid travel journal for Iceland's Ring Road.

Palette: glacier grey #e9eef0 page, ink #101418, lava orange #ff6a3d, ice blue #cfe3ea. Font Outfit (400–700). Every tile has a 20px radius and 10px gaps.

Grid: four columns (1.3fr 1fr 1fr 1fr), three rows of minmax(140px, 1fr), defined with grid-template-areas "a a b c" / "a a d c" / "e e f g":
– a: a large 2×2 photo "Vestrahorn, Stokksnes" with a 30px bold caption and an orange "Day 4" pill;
– b: a dark stat tile (#101418) — small "Route 1" label, "1,332 km" in 52px bold orange (unit in small white type), and a one-line note "Nine days clockwise from Reykjavík, one tank of patience.";
– c: a tall photo "Skógafoss";
– d: a small photo "Reynisfjara";
– e: a wide panoramic photo "Jökulsárlón at 23:10";
– f: an ice-blue map tile with an inline SVG — a soft island blob (#b6d2dc), a ring-road path in 1.6px ink with a lava-orange start dot, and the caption "Ring Road · Hringvegur · 9 days";
– g: a small photo "Mývatn".
Captions sit bottom-left in white with a soft text-shadow.

Interaction: tiles lift 3px with a soft shadow on hover (0.45s cubic-bezier(.2,.8,.2,1)); photos inside slowly zoom to 1.06 over 1s. Hovering the map replays a stroke-dashoffset draw of the road over 1.6s.

Responsive: under 640px container width switch to two columns with areas "a a" / "b c" / "d c" / "e e" / "f g" and explicit row heights so nothing collapses. Each photo has descriptive alt text.

Touch: hover lifts are disabled under (hover: none) and the route draw replays on :active.`,
  },
  {
    id: 'bento-featured-swap',
    title: 'Faces of Oaxaca featured bento',
    type: 'Bento Gallery',
    description: 'A portrait bento where clicking any small tile swaps it into the large featured slot with a FLIP morph and a fresh caption.',
    tags: ['bento', 'FLIP', 'portraits', 'featured'],
    component: BentoFeaturedSwap,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Create a portrait bento gallery "Faces of Oaxaca" (seven artisans photographed by Ximena Ortiz) where one portrait is always featured large.

Palette: dark mole brown #1c1312, warm text #f7ead9, marigold #f2a516 for the caption tile. Names in Instrument Serif (40px); meta in the body sans; a small monospace eyebrow.

Grid: four columns (1fr 1fr .8fr .8fr) and three rows of minmax(130px, 1fr), 10px gaps, 16px radius tiles. The first tile in DOM order is featured and spans columns 1–2 and rows 1–2; a marigold caption tile occupies columns 1–2 of row 3; the other six portraits auto-place into the remaining 2×3 cells. Small tiles are slightly desaturated (saturate .6, brightness .8) with a frosted surname pill; on hover they return to full colour and zoom to 1.06.

Swap: every tile is a <button>. Clicking a small tile swaps its position in the order array with the featured one, so the old feature lands exactly in the clicked slot. Animate with FLIP via the Web Animations API: record each tile's rect before the change; after render, for tiles whose rect changed, play from translate(dx, dy) scale(w0/w1, h0/h1) (transform-origin 0 0) to none over 620ms cubic-bezier(.65,0,.25,1), raising the new feature's z-index during the morph. Skip motion under prefers-reduced-motion.

Caption tile: "Faces of Oaxaca · No. 3 of 7", the sitter's name, and "Mezcalera — Santiago Matatlán", each line fading up 10px with a 50ms stagger on change (aria-live), plus a small credit line.

Responsive: under 620px, the feature spans the full width (260px tall), the caption sits beneath it, and the six small tiles form a 3×2 grid.

Touch: tiles are real buttons with touch-action: manipulation; under (hover: none) the small tiles are only slightly desaturated so faces stay readable, and :active previews the colour.`,
  },

  // ── Before–After Gallery ────────────────────────────────────
  {
    id: 'before-after-slider',
    title: 'Colour-grade comparison slider',
    type: 'Before–After Gallery',
    description: 'A draggable split that compares a raw file with a chosen colour grade, keyboard-accessible through a real range input.',
    tags: ['before after', 'slider', 'css filters', 'accessibility'],
    component: BeforeAfterSlider,
    stageHeight: 480,
    stageTone: 'none',
    prompt: `Build a before/after comparison tool styled like a photo-editing app, comparing an ungraded raw file of a harbour in Camogli (Paolo Ferri · 35mm · f/8 · 1/500) with a selectable colour grade.

Palette: app chrome #111214, panel #191a1e with 1px #26272d borders, text #e9eaee, muted #8b8d97, selection blue #7aa2ff. 12px radii.

Layout: a two-column grid — the comparison frame (min 380px tall) and a 230px side panel; stack below 700px.

Comparison: the same photo twice, object-fit cover. The base layer gets the "raw" look via CSS filters (saturate(.55) contrast(.82) brightness(1.06)); the top layer gets the selected grade and is revealed with clip-path: inset(0 0 0 X%). A 2px white divider with a 44px white circular grip (double-chevron icon, soft shadow) sits at X%. Frosted pills label "Raw" (left) and the grade name (right); each hides when the divider covers it.

Input: pointerdown anywhere on the frame captures the pointer and jumps the divider there; dragging follows the pointer (no transition while dragging; otherwise clip-path and divider ease over 0.35s cubic-bezier(.2,.8,.2,1)); the grip shrinks to .9 while held. For keyboard and screen readers, include a real <input type="range" 0–100> visually hidden but focusable, with aria-label and aria-valuetext; when it has :focus-visible, show a blue ring around the grip.

Panel: title + EXIF line, then a 2×2 radiogroup of grade thumbnails previewing each filter — Portra warm, Bleach bypass, Teal & ember, Silver mono — the selected one outlined blue. Switching grades crossfades the filter over 0.5s. A monospace note at the bottom describes the grade ("Crushed blacks · −55 sat · hard contrast").

Touch: mouse drags start immediately, but a finger waits to see the gesture — more than 6px horizontally captures the pointer and drags the divider, a vertical move lets the page scroll (touch-action: pan-y), and a clean tap jumps the divider to the tapped spot.`,
  },
  {
    id: 'before-after-lens',
    title: 'Valparaíso colour-reveal lens',
    type: 'Before–After Gallery',
    description: 'A black-and-white print with a resizable circular lens that reveals the colour original, plus a vertical-split mode.',
    tags: ['before after', 'lens', 'clip-path', 'keyboard'],
    component: BeforeAfterLens,
    stageHeight: 480,
    stageTone: 'none',
    prompt: `Create a hover-reveal comparison for a photograph of Cerro Alegre, Valparaíso by Tomás Vidal: a silver-gelatin black-and-white version on top of which a circular lens reveals the original colour.

Style: near-black #0b0c0e, text #eef0f2, cyan accent #46e0d0, JetBrains Mono for all UI. The image area is at least 400px tall and full-bleed; a control bar sits beneath it with a 1px #1d2024 top border.

Layers: two copies of the same photo with object-fit cover. Bottom: filter grayscale(1) contrast(1.25) brightness(.95). Top: saturate(1.25) contrast(1.05), clipped with clip-path: circle(R px at X px Y px). Hide the system cursor; draw the lens edge as a ring (1.5px cyan, a 6px translucent cyan halo and a soft drop shadow) that follows the pointer. When the pointer leaves, the ring dims to 35% opacity and stays where it was; positions ease over 0.5s only while inactive.

Controls: a segmented radiogroup "Lens | Vertical split" (active segment filled cyan with dark text) and, in lens mode, − / + buttons that resize the lens between 80px and 400px diameter (the mouse wheel does the same, but only once the image has focus so page scrolling is never hijacked). In split mode the clip becomes inset(0 0 calc(100% − Y px) 0) and a cyan horizontal line with two tags ("Colour ↓", "↑ Silver") follows the pointer vertically. A small HUD bottom-right reports "Lens 180px" or "Split 46%".

Keyboard: the image is focusable (cyan inset ring); arrows move the lens or split by 20px (60px with Shift), + / − resize. Start the lens at about 62% across and 45% down once the frame has been measured.

Touch: the frame captures the pointer on pointerdown so a finger can sweep the lens (touch-action: none in lens mode, pan-x in split mode); lifting the finger settles it. Lens size buttons are 40px on coarse pointers.`,
  },

  // ── Collage Gallery ─────────────────────────────────────────
  {
    id: 'collage-polaroid',
    title: 'Road-trip polaroid table',
    type: 'Collage Gallery',
    description: 'Scattered, slightly rotated polaroids on a tablecloth that you can drag around, bring to the front and toss again.',
    tags: ['collage', 'drag', 'polaroid', 'pointer events', 'playful'],
    component: CollagePolaroid,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Build an interactive polaroid collage "Summer ’98, the long way west" — eight snapshots from a road trip, scattered on a blue gingham tablecloth.

Background: two repeating-linear-gradients of faint white 2px lines every 22px (horizontal and vertical) over a radial gradient from #4a6b93 to #23364f. Handwriting font Caveat (500/700) for the title (38px, white) and captions. A yellow (#ffe066) sticker-like button "Toss them again", rotated −2deg with a 4px solid #c9a93a bottom shadow.

Polaroids: absolutely positioned with left/top in percentages of the board (so the layout scales), width clamp(110px, 21cqw, 190px), off-white #fbfbf8 frame with 9px sides and a deeper bottom where a handwritten caption sits ("Big Sur, mile 41", "Diner in Cambria ♥", "Route 66, Amboy"). Square photos with a gentle vintage filter (sepia .25, saturate 1.2, contrast .95). Each has its own rotation (−11° to +11°) via a CSS variable and a two-layer shadow.

Dragging: on pointerdown, capture the pointer, remember the grab offset, bring the polaroid to the top (incrementing z-index), and add a "lifted" state — scale 1.07, rotation eased to 30% of its angle, a bigger shadow. On pointermove convert the pointer position to board percentages, clamped so photos can only hang a few percent off the edges. Release drops it back. Hover scales unlifted photos to 1.03.

Toss: randomise every position and rotation; left/top transition over 0.6s cubic-bezier(.2,.8,.2,1) so they slide across the table. Keyboard: polaroids are focusable (focus brings them to the front, yellow focus ring); arrow keys nudge them. Use touch-action: none on the board.

Touch: only the cards are touch-action: none, so the page still scrolls from empty board space. Store x as a percentage of the free width (board minus card) so cards never spill off a narrow board, and grab using the card's layout offset rather than its rotated bounding box so it doesn't jump.`,
  },
  {
    id: 'collage-moodboard',
    title: 'Coastal Utility moodboard',
    type: 'Collage Gallery',
    description: 'A scrapbook-style fashion moodboard with taped photos, sticky notes, colour chips and a pinned fabric swatch that re-arranges itself.',
    tags: ['moodboard', 'scrapbook', 'collage', 'fashion'],
    component: CollageMoodboard,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a scrapbook moodboard collage for a fashion collection "SS26 — Coastal Utility" (moodboard v3 by Ana Lisboa).

Board: grey-green card (#b9c0bd) with a 16px dot grid (radial-gradient dots at 8% black). The board area keeps a 16:9.6 aspect ratio (max 960px wide) and every piece is absolutely positioned with left/top/width in percentages plus a rotation CSS variable, so the whole collage scales with its container.

Pieces (10):
– four photos in white 6px borders with soft shadows, each held by "washi tape": a translucent strip (rgba(240,226,180,.72), or pale blue on corners) with a jagged clip-path, either centred on the top edge or angled 38° across a corner;
– two yellow (#ffe873) square sticky notes in Reenie Beanie handwriting ("less beige!! think salt, rope, rust", "pockets on EVERYTHING");
– two colour chips like paint cards: a colour block, the name in bold sans (Harbour Navy, Buoy Orange) and the hex in monospace;
– an olive waxed-cotton fabric swatch drawn with a 45° repeating stripe and a ragged clip-path edge, a red map pin, and a typed tag "Waxed cotton, 280gsm";
– a typed label card in Special Elite.

Interaction: hovering or focusing a piece straightens it halfway, lifts it 4px, scales to 1.03 and raises it above the rest (0.35s cubic-bezier(.2,.8,.2,1)); pieces are focusable with an orange ring. A navy "Rearrange board" button (Special Elite, offset orange 3px block shadow) toggles between two hand-composed layouts; left/top/width animate over 0.8s cubic-bezier(.65,0,.25,1) so everything slides into its new spot.

Responsive: when the container is under 600px (ResizeObserver), switch to a 3:5 portrait board with its own layout and hide the rearrange button.

Touch: tapping a piece toggles a lifted state (straightened, raised, deeper shadow) that mirrors the hover lift; under (hover: none) sticky hover is neutralised.`,
  },

  // ── Full-Width Slideshow ────────────────────────────────────
  {
    id: 'slideshow-ken-burns',
    title: 'Dolomites Ken Burns slideshow',
    type: 'Full-Width Slideshow',
    description: 'A full-bleed autoplay slideshow with slow Ken Burns pans, story-style progress bars and pausing on hover, focus or when off-screen.',
    tags: ['slideshow', 'ken burns', 'autoplay', 'progress bars'],
    component: SlideshowKenBurns,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a full-width autoplay slideshow of five Dolomites peaks (Tre Cime di Lavaredo, Seceda, Lago di Braies, Passo Giau, Marmolada) photographed by Matteo Kostner.

Frame: 560px tall, edge to edge, background #0c0f12. Slides are stacked and crossfade over 1.2s. A gradient shade darkens the top 22% and bottom 45% for legibility.

Ken Burns: the active slide's image runs one of four keyframe variants over 7.2s linear (e.g. scale 1.02 → 1.16 while translating −3%/−2%, or the reverse zoom-out with an opposite drift) so consecutive slides move differently.

Timing: drive autoplay from a requestAnimationFrame loop that accumulates elapsed time (6s per slide) instead of setInterval, so it can pause mid-slide and resume exactly. Pause when: the user pressed pause, the pointer is over the slideshow, focus is inside it, or it's less than 30% visible (IntersectionObserver). While paused, also set animation-play-state: paused on the Ken Burns image and show a small "Paused" tag. Start paused under prefers-reduced-motion.

Progress bars: across the top (16px inset), one 3px rounded track per slide (white at 30%); completed bars are full, the current bar fills with scaleX(progress), future bars are empty.

Navigation: invisible full-height buttons over the left and right thirds (w-resize / e-resize cursors, soft gradient on focus) step back/forward; ArrowLeft/Right work too; wrapping is circular and resets the timer.

Caption bottom-left: "Sexten Dolomites · 2,999 m" (13px) above the peak name in Bricolage Grotesque 700 at up to 80px, condensed width, −0.035em tracking; both rise 24px and fade in with 200/300ms delays on each change (aria-live). Bottom-right: "02 / 05" in monospace and a 44px frosted circular play/pause button with a proper label.

Touch: a horizontal swipe past 40px changes slide (touch-action: pan-y) and the click that ends a swipe is ignored by the tap zones; holding a finger on the slideshow pauses it. Only keyboard focus (:focus-visible) pauses, so tapping a zone never freezes the show. Under 480px the counter hides and the caption widens.`,
  },
  {
    id: 'slideshow-fade-captions',
    title: 'Casa Lumbre fade slideshow',
    type: 'Full-Width Slideshow',
    description: 'A split-screen interiors slideshow with slow crossfades, masked line-by-line captions, a rolling counter and an autoplay progress line.',
    tags: ['slideshow', 'crossfade', 'captions', 'interiors'],
    component: SlideshowFadeCaptions,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Create a fade slideshow for an architecture project "Casa Lumbre — Mallorca" (Estudio Ferrer Soler, photos by Núria Pons), six rooms with large captions.

Palette: olive-black #191a14, warm paper text #ece6d6, moss #8a9a5b and pale moss #b9c48a accents, muted #9b9a86. Display font Italiana for captions and the counter.

Layout: 540px tall. A left text panel (minmax(260px, 34%)) and the image filling the right. Under 680px stack the image (260px) above the panel.

Images: stacked; the active one fades in over 1.4s cubic-bezier(.4,0,.2,1) while settling from scale 1.05 to 1 over 6s for a gentle drift.

Panel (top to bottom): project line + credit (12.5px); then, pushed to the bottom, a rolling counter — the current number in Italiana ~104px inside a 1em-tall overflow-hidden window that slides up from 100% on change, followed by "/ 06" in moss. The caption is two lines ("Courtyard" / "of figs", second line in pale moss), each in its own overflow-hidden mask with the text sliding up from 105% over 0.9s cubic-bezier(.2,.8,.2,1), the second line 80ms later; a 14px description fades in after 250ms.

Controls: 44px circular outline arrow buttons (fill moss on hover), a pill Play/Pause text button, and a 1px progress line that fills toward the next slide. Autoplay every 5.2s using an elapsed-time counter so pausing resumes where it left off; pause on hover, when the user pauses, and when less than 30% visible; start paused under prefers-reduced-motion. ArrowLeft/Right navigate; the caption region is aria-live.

Touch: swipe the photo horizontally to change room (touch-action: pan-y); a finger resting on the slideshow pauses autoplay.`,
  },

  // ── 3D Coverflow Gallery ────────────────────────────────────
  {
    id: 'coverflow-classic',
    title: 'Shorts programme coverflow',
    type: '3D Coverflow Gallery',
    description: 'A perspective coverflow of film stills that tilts side items away in 3D, with live drag, horizontal swipe, keys and click-to-centre.',
    tags: ['coverflow', '3D', 'perspective', 'drag', 'keyboard'],
    component: CoverflowClassic,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Build a classic 3D coverflow of nine film stills for "Rotterdam Shorts · Competition 2026".

Mood: cinema. Background radial gradient #2a1f3d → #0b0812, text #f1ece4, marquee gold #ffcf5c, muted lilac #b3aac6. Film titles in Bebas Neue (48px).

Stage: a container with perspective: 1100px. Items are 3:4 cards, width clamp(160px, 26cqw, 260px), absolutely centred and stacked with transform-style: preserve-3d. For each item compute offset o = index − active (+ live drag fraction) and set:
– centre (o = 0): translateZ(60px), no rotation, full brightness;
– others: translateX(sign × (58% + (|o| − 1) × 20%)), translateZ(60 − 260px), rotateY(−sign × 58deg), image dimmed to brightness .55 / saturate .8;
– z-index 100 − |o|, hidden beyond 4 away.
Transition transforms over 0.7s cubic-bezier(.2,.8,.2,1). Add a floor reflection with -webkit-box-reflect: below 6px linear-gradient(transparent 62%, rgba(255,255,255,.28)).

Input: pointer drag moves the flow continuously (1 item per 160px, rubber-banded 0.3 past the ends, transitions off while dragging) and snaps to the nearest item on release. Clicking a side card centres it (ignore clicks after a drag). Only horizontal wheel/trackpad swipes step the flow (throttled to 220ms) so vertical page scrolling is never hijacked. ArrowLeft/Right, Home and End work when the carousel region has focus (gold focus outline on the centre card).

Below: the centred film's title and "Director · Country · 14 min", re-animating (fade up 10px, 80ms stagger) on change via aria-live, and a row of tiny dots with the active one gold and scaled 1.4.

Touch: capture starts after 8px of horizontal travel, pointercancel springs back without changing slide, and the header wraps on narrow stages where covers are 46% of the width.`,
  },
  {
    id: 'coverflow-ring',
    title: 'Vertical City 3D ring',
    type: '3D Coverflow Gallery',
    description: 'Ten tower photographs mounted on a slowly rotating 3D cylinder you can spin with inertia, step with keys, or click to bring a panel forward.',
    tags: ['3D carousel', 'cylinder', 'inertia', 'architecture'],
    component: CoverflowRing,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Create a 3D carousel ring "Vertical City" — ten famous towers (Torre Velasca, Marina City, Kanchanjunga, Bosco Verticale, The Interlace, Turning Torso…) photographed by Lea Brandt.

Mood: night skyline. Background radial gradient #0f2747 → #050b18, text #e6f4ff, cyan #4fd1ff, muted #7f9bb8. Michroma (uppercase, 0.08em tracking) for the title, panel numbers and the front tower name.

Geometry: a scene with perspective: 1200px (origin 50% 40%). A 170×250px ring with transform-style: preserve-3d holds ten panels (6px radius, 1px translucent cyan hairline, backface-visibility hidden). Panel i gets rotateY(i × 36deg) translateZ(r) where r = (170 / 2) / tan(π / 10) + 40px. The ring itself is translateZ(−r) rotateY(angle). Shade each panel by how much it faces you: brightness(0.35 + 0.65 × max(0, cos(i × 36° + angle))).

Motion (one requestAnimationFrame loop, paused when off-screen):
– auto-rotate slowly (−0.012°/ms) unless hovered, toggled off, or prefers-reduced-motion;
– pointer drag rotates 0.25° per px; release continues with inertia (velocity × 0.94 per frame) and then snaps to the nearest panel;
– snapping and stepping ease toward a target angle (12% of the remaining distance per frame);
– clicking a panel rotates the shortest way to bring it to the front (pointer capture only starts after 4px of movement, so clicks still work);
– ArrowLeft/Right and round prev/next buttons step one panel; a pill toggles "Auto"/"Still".

Footer: the front tower's name, city and height (e.g. "Turning Torso · Malmö · 190 m"), aria-live, plus the controls.

Touch: drag threshold is 8px so taps still bring a panel to the front; footer controls wrap on phones and grow to 44px on coarse pointers.`,
  },

  // ── Infinite Scroll Gallery ─────────────────────────────────
  {
    id: 'infinite-feed',
    title: 'Daily Light infinite feed',
    type: 'Infinite Scroll Gallery',
    description: 'A self-scrolling photo feed that loads pages through an IntersectionObserver sentinel, with skeleton cards and a 120-photo cap.',
    tags: ['infinite scroll', 'intersection observer', 'skeletons', 'feed'],
    component: InfiniteFeed,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build an infinite-scroll photo feed "Daily Light — community picks, refreshed every morning".

Style: clean neutral UI — page #f7f7f8, white header with a 1px #e7e7ea bottom border, ink #18181b, muted #71717a, orange accent #f97316. Title in a bold grotesk (30px, −0.03em). A live counter on the right in monospace: "36 / 120".

Frame: 620px tall; the header is fixed and the feed scrolls inside its own container (not the page).

Grid: three columns (two under 560px), 14px gaps. Cards are white, 14px radius, 6px padding, soft layered shadow; a 4:5 photo with 10px radius, then a meta row with a coloured 20px avatar dot, the photographer's name (600) and the place right-aligned in grey. Every 11th card is a wide feature spanning two columns.

Loading: start with 12 photos. Put a 1px sentinel after the grid and observe it with an IntersectionObserver whose root is the scroll container and rootMargin extends 240px below. When it intersects and nothing is loading, show 9 skeleton cards (grey blocks with a moving shimmer gradient, a grey avatar circle and a text bar), wait ~750ms (simulated fetch), then append the next 9 photos. After each append, disconnect and re-observe the sentinel so a still-visible sentinel triggers the next page. Stop at 120 photos and replace the sentinel with "You’re all caught up — 120 photographs today."

Polish: each card rises 14px and fades in on insert; each image keeps the shimmer until its load event fires, then fades in while settling from scale 1.04. After scrolling 600px, show a floating dark "Back to top" pill that smooth-scrolls the feed back up. Set aria-busy on the list while loading and announce the count politely.

Touch: overscroll-behavior: contain on the feed, a 40px Back to top pill with a pressed state, and the place name drops out of card meta under 420px.`,
  },
  {
    id: 'infinite-marquee-wall',
    title: 'Open Studio marquee wall',
    type: 'Infinite Scroll Gallery',
    description: 'An endless, tilted wall of photo rows drifting in opposite directions behind an event headline, pausing on hover and off-screen.',
    tags: ['marquee', 'infinite loop', 'css animation', 'event'],
    component: InfiniteMarqueeWall,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create an infinite auto-scrolling marquee wall of photographs behind an event announcement: "Open Studio Weekend — 14–16 November · Kalkbrenner, Berlin. 140 photographers. 3 floors. Every print for sale."

Style: black #0a0a0a, white headline in Anton (uppercase, up to 112px, line-height .9), hot pink #ff6fb5 for the date line (monospace 12px) and the pill CTA "Get a free pass" (46px tall, black text; on hover it scales 1.05 and turns white).

Wall: an absolutely positioned layer larger than the frame (inset −12% −10%) rotated −7deg, holding four rows with 12px gaps. Each row is overflow hidden and contains a flex track (width: max-content) with nine images of varied aspect ratios (0.75–2:1) at clamp(96px, 15cqw, 140px) tall, 8px radius, filter grayscale(.4) brightness(.8) — full colour on hover. Render the nine images twice in the same track so the loop is seamless, and animate the track with @keyframes to translateX(calc(−50% − gap/2)) linear infinite. Give each row its own duration (40–60s) and reverse every other row so neighbouring rows drift in opposite directions.

Behaviour: hovering a row pauses it (animation-play-state: paused); pause all rows when the component is off-screen (IntersectionObserver). Under prefers-reduced-motion the rows stay still.

Legibility: a radial vignette (rgba(10,10,10,.92) centre fading out) plus black edge fades on left and right sit above the wall, with the centred copy on top. The wall is decorative (aria-hidden), with a visually hidden sentence naming the featured artists.

Touch: press and hold a row to stop it (pointerdown on a non-mouse pointer adds a .held class that pauses the animation and restores colour); lifting, leaving or a vertical scroll (pointercancel) resumes it. Image hover brightening only applies under (hover: hover).`,
  },
];
