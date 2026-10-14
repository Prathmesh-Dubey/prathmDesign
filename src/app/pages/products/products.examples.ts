import { DesignExample } from '../../core/example.model';
import { SwatchAccentCard } from './demos/swatch-accent-card';
import { HoverSwapQuickviewCard } from './demos/hover-swap-quickview-card';
import { GlassBackdropCard } from './demos/glass-backdrop-card';
import { SizeRatingCard } from './demos/size-rating-card';
import { MonoPriceRevealCard } from './demos/mono-price-reveal-card';
import { DragRotateCard } from './demos/drag-rotate-card';
import { EditorialWatchShowcase } from './demos/editorial-watch-showcase';
import { FragranceNotesSplit } from './demos/fragrance-notes-split';
import { VelvetSpotlight } from './demos/velvet-spotlight';
import { ScrollChaptersShowcase } from './demos/scroll-chapters-showcase';
import { HotspotShowcase } from './demos/hotspot-showcase';
import { CartRowsList } from './demos/cart-rows-list';
import { SnapShelf } from './demos/snap-shelf';
import { SpecCompareList } from './demos/spec-compare-list';
import { RecentlyViewedStrip } from './demos/recently-viewed-strip';
import { WishlistMoveToBag } from './demos/wishlist-move-to-bag';
import { HeroColorCarousel } from './demos/hero-color-carousel';
import { PeekCarousel } from './demos/peek-carousel';
import { ThumbnailGalleryCarousel } from './demos/thumbnail-gallery-carousel';
import { BestsellerMarquee } from './demos/bestseller-marquee';
import { CoverflowCarousel } from './demos/coverflow-carousel';
import { FilterSidebarCatalogue } from './demos/filter-sidebar-catalogue';
import { CartDrawerCatalogue } from './demos/cart-drawer-catalogue';
import { TabsSearchCatalogue } from './demos/tabs-search-catalogue';
import { QuickviewModalCatalogue } from './demos/quickview-modal-catalogue';
import { FacetChipsCatalogue } from './demos/facet-chips-catalogue';

export const PRODUCT_EXAMPLES: DesignExample[] = [
  // ── Premium Product Cards ────────────────────────────────────────────
  {
    id: 'swatch-accent-card',
    title: 'Finish swatches that retint the card',
    type: 'Premium Product Cards',
    description: 'A headphone card where each colour swatch re-tints the photo, badge and glow, with a three-stage add-to-bag button.',
    tags: ['swatches', 'micro-interaction', 'add to bag', 'theming'],
    component: SwatchAccentCard,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a single premium product card for "Aster ANC Over-Ear" headphones ($349), centred on a cool grey (#e9ebef) background with a soft radial glow behind the card in the current accent colour (30% opacity, fades to transparent).

Card: 340px wide, 28px radius, white, with a coloured drop shadow (0 40px 70px -40px, accent mixed with black). Top row: a pill badge "New finish" (tinted background, dark ink) on the left and a 36px round bag icon on the right with a small count bubble. Below, a 20px-radius photo panel (aspect 1/0.86) on the tint colour. Font: Manrope 400–800; title 19px/800, price 17px/700, meta line 13px grey (#6a6f7a).

Swatches: four 28px circles — Saffron #e5b53a, Lagoon #2bb3a3, Iris #6d6af0, Rosewood #e2607a. Selecting one sets CSS variables (--accent, --tint, --ink) that drive the badge, photo panel, glow, shadow and count bubble, all transitioning 0.4–0.5s. The photo itself shifts with a hue-rotate filter (0/130/200/300deg) transitioning 0.6s. The active swatch gets an outer 2px ring that scales in.

Add-to-bag button: 52px tall, 16px radius, near-black. Three stacked labels slide vertically (0.35s cubic-bezier(.2,.8,.2,1)): "Add to bag" → three bouncing dots (750ms) → check icon + "Added — Saffron" on the accent colour. The bag count increments and pops (scale 1.5 with a springy ease); after 2.6s the button resets.

Hovering the card scales the photo 1.04 and tilts it −1.5°. Swatches are real buttons with aria-pressed and names; the count is aria-live. Respect prefers-reduced-motion.`,
  },
  {
    id: 'hover-swap-quickview-card',
    title: 'Image swap with in-card quick view',
    type: 'Premium Product Cards',
    description: 'Watch cards that cross-fade to a second shot on hover and slide up a spec panel with strap options.',
    tags: ['hover swap', 'quick view', 'editorial', 'watches'],
    component: HoverSwapQuickviewCard,
    stageHeight: 580,
    stageTone: 'none',
    prompt: `Create a pair of editorial watch product cards on a muted sage gradient (#e3e8e4 to #d3dbd5). Each card is up to 290px wide with a 4:5 photo, 4px radius, and below it a serif title (Fraunces 500, 20px) with the price in Geist Mono 14px on the right, e.g. "Halden Chronograph 41mm — CHF 1,890" and "Marlow Diver 39mm — CHF 2,240", plus a 13px grey (#5c6b61) line showing the chosen strap.

Hover swap: two stacked images. On hover or focus-within, the second image fades from 0 to 1 opacity while scaling from 1.08 to 1 (0.6s opacity, 1.2s cubic-bezier(.2,.7,.1,1) transform), and the first scales to 1.06 underneath. A frosted pill tag sits top-left ("Field collection").

Quick view: a full-width 44px dark forest (#17251d) button slides up from below the image on hover (transform 0.45s). Clicking it slides a pale panel (#f6f8f6) up from the bottom of the image (0.5s cubic-bezier(.2,.8,.2,1)) containing a "At a glance" serif heading, a round close button, a dashed-row spec list (movement, case, water resistance, crystal/bezel) and pill buttons for strap choice; the selected strap fills dark and updates the line under the card.

The panel is inert when closed; the trigger has aria-expanded/aria-controls. On narrow containers (under 560px) show a single card. Use container queries, no libraries.`,
  },
  {
    id: 'glass-backdrop-card',
    title: 'Frosted glass card on colour blobs',
    type: 'Premium Product Cards',
    description: 'A glassmorphism speaker card floating over saturated parallax blobs, with quantity stepper and cart toggle.',
    tags: ['glassmorphism', 'parallax', 'backdrop-filter', 'audio'],
    component: GlassBackdropCard,
    stageHeight: 500,
    stageTone: 'none',
    prompt: `Build a frosted-glass product card for the "Oro Mini Portable Speaker" ($149) over a vivid backdrop: base #ff5a36 with three large blurred circles — amber #ffb21e (340px, top-left), magenta #d4176b (420px, bottom-right) and violet #7a2cf0 (180px, centre-right).

Card: max 560px wide, two columns (square photo with 20px radius on the left, copy on the right), 18px padding, 30px radius, background linear-gradient(140deg, rgba(255,255,255,.34), rgba(255,255,255,.12)), backdrop-filter blur(22px) saturate(1.4), 1px rgba(255,255,255,.45) border and an inset top highlight. Font: Sora — 13px brand kicker, 22–28px/600 title with tight tracking, translucent spec chips ("IP67", "18h play", "Stereo pair").

Bottom row: large 26px price that multiplies with quantity (tabular numbers), "Ships in 2 days" note, and a pill quantity stepper (1–4) with round translucent buttons. Full-width white CTA "Add to cart" (magenta text #b0124f) that toggles to a dark plum state "In your cart · 2".

Parallax: track the pointer over the whole stage; move each blob a different amount and direction (±14–30px) with a 0.6s ease, and tilt the card up to ±5° (rotateY) / ±4° (rotateX) under perspective 1000px. Reset on pointer leave.

Stack to one column under 560px (container query). White focus rings, aria labels on stepper buttons, aria-live on the quantity.`,
  },
  {
    id: 'size-rating-card',
    title: 'Sneaker card with size grid and ratings',
    type: 'Premium Product Cards',
    description: 'A sporty split card with a UK size grid, sold-out and low-stock states, and an expandable star breakdown.',
    tags: ['size selector', 'ratings', 'stock states', 'sneakers'],
    component: SizeRatingCard,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a horizontal sneaker product card (max 680px, two equal columns, 8px radius, white, soft shadow) on a #dfe3ea background for "Kite Trainer Low — Chalk / Signal Red", €165, by "Kerb Athletics".

Left: full-height product photo on #f1f2f4 that scales 1.05 and rotates −2° on hover (0.8s), with a huge italic condensed "07" (Archivo 900, 75% width, 88px) bottom-left in white with mix-blend-mode: difference.

Right: red (#d63a2f) brand line, uppercase italic condensed title (Archivo 800, 26px), colourway in grey (#6b7080), price 20px/700. A rating button shows five stars partially filled to 4.6 (an overlay ★★★★★ clipped by width %) and "4.6 · 1,284 reviews"; clicking it expands a breakdown list of 5→1 star bars with percentages.

Size grid: 5 columns of 42px buttons (UK 6–11 incl. half sizes). Selected = filled black. Sold out = disabled, grey text with a diagonal strike drawn by a linear-gradient. Low stock (<3) = a 6px red dot top-right. A helper line beneath updates live: "Only 2 left in UK 7.5. Order soon." / "UK 8 in stock · free returns for 30 days."

CTA: full-width 50px uppercase condensed button, disabled grey reading "Select a size" until a size is chosen, then red "Add to bag", then black "Added · UK 8". Use role="radiogroup"/"radio" with aria-checked for sizes and descriptive aria-labels. Stack the card vertically under 600px with a container query.`,
  },
  {
    id: 'mono-price-reveal-card',
    title: 'Monochrome cards with price reveal',
    type: 'Premium Product Cards',
    description: 'A gallery-quiet row of greyscale product cards that bloom into colour and roll the name over to the price on hover.',
    tags: ['minimal', 'monochrome', 'price reveal', 'hover'],
    component: MonoPriceRevealCard,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a minimal monochrome product row for a boutique called "MAISON ODE" on a #f2f2f2 background with near-black (#0b0b0b) ink. Header: the wordmark in Tenor Sans with 0.32em letter-spacing on the left, "Objects, Autumn edit" in grey (#6d6d6d) on the right, and a 1px black rule underneath.

Three cards in a grid (gap clamp(14px, 2.4vw, 28px)): 3:4 photo with no radius, grayscale(1) contrast(1.08). Below each photo, a Geist Mono index number ("01") and a 24px-tall clipping window holding two stacked lines: the product name (Tenor Sans 17px) and the price (Geist Mono 15px, e.g. "£285"). A material line in Geist 12.5px grey sits underneath.

Interaction on hover and on keyboard focus of the card: the photo fades to full colour and scales 1.04 (0.7s filter, 1s transform cubic-bezier(.2,.7,.1,1)); the name/price stack translates up by exactly one line (0.5s cubic-bezier(.7,0,.2,1)) so the price replaces the name. A round white heart "save" button fades in top-right; once saved it stays visible and fills black.

Example items: "Côte 02 Acetate" sunglasses £285, "Aster 38 Automatic" watch £1,640, "Côte 04 Titanium" £340. Cards are focusable with a visible outline around the photo; the save button has aria-pressed. Show 3 columns, 2 under 640px, 1 under 380px (container queries).`,
  },
  {
    id: 'drag-rotate-card',
    title: 'Drag-to-rotate turntable card',
    type: 'Premium Product Cards',
    description: 'A dark camera card whose product spins on a turntable as you drag, with momentum, a degree dial and view presets.',
    tags: ['drag', '360 view', 'momentum', 'cameras'],
    component: DragRotateCard,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a dark 360°-style product card for the "Kessler K2" 35mm rangefinder (£2,180). Background: radial gradient #2a2d33 to #121315. Card: 400px max, 26px radius, #1b1d21 with a 1px #2c2f35 border. Header: Geist Mono 11.5px grey caption, Unbounded 600 24px title, amber (#ffb547) mono price.

Turntable: a 250px tall, 18px-radius stage with a soft radial spotlight. The product photo sits in a circular frame with a 6px ring and a blurred elliptical floor shadow below it. Store one "angle" value. On pointer drag (pointer capture, touch-action: pan-y) add 0.9° per pixel. Render the spin by scaling the product horizontally by cos(angle) (minimum magnitude 0.18, sign flips so it mirrors when facing away), tilting it ±4° with sin(angle), darkening brightness toward the side views and shifting hue up to ±14°. A soft-light gradient overlay slides its background-position with the angle to fake a moving highlight; the floor shadow narrows with |cos|. On release, keep spinning with the release velocity and 0.94 friction per frame (requestAnimationFrame; skip if reduced motion).

Below, an 84px circular dial overlapping the stage with 24 ticks; the tick nearest the angle lights amber and the centre shows the degree (tabular figures). Footer: current face label and a segmented control (Front / Side / Back) that eases the angle to 0/90/180 over 600ms along the shortest path.

The turntable is role="slider" with aria-valuenow and arrow keys rotating ±15°. A "Drag to rotate" hint fades out after first interaction.`,
  },
  // ── Luxury Product Showcase ──────────────────────────────────────────
  {
    id: 'editorial-watch-showcase',
    title: 'Editorial watch showcase',
    type: 'Luxury Product Showcase',
    description: 'A full-bleed, magazine-style watch launch with oversized serif type, a spec ledger and dial editions that re-theme the page.',
    tags: ['editorial', 'serif', 'spec list', 'watches'],
    component: EditorialWatchShowcase,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build a full-bleed luxury watch showcase for "Halden Nocturne" (CHF 7,400), a limited edition of 250. Layout: two columns (1.05fr photo, 1fr copy) filling a 640px stage. The photo covers its column with object-fit: cover and fades into the background with a horizontal gradient on its right 45%. The copy column overlaps the photo by about 12% of the container width so the headline sits partly over the image.

Palette: ink background #0f1013, warm white text #ede9e1, champagne accent #c9b48a, muted grey #8f8a80. Typography: Cormorant Garamond 300 for display — "Halden" on one line and an italic champagne "Nocturne" indented 0.5em below, clamp(64px, 12cqw, 150px), line-height 0.82, letter-spacing −0.035em; Geist for body (14.5px lede, max 40ch).

Spec ledger: a two-column definition list (Case 39mm Ti grade 5, Calibre H-21 automatic, Reserve 72 hours, Water 100 metres, Frequency 4 Hz, Edition 250 pieces), each row with a hairline top border in 30% champagne, staggered fade-up 60ms apart.

Footer: pill radio buttons for dial editions ("Nocturne" anthracite / "Glacier" white), the price in serif 26px and an outlined "Reserve a viewing" button that fills champagne on hover. Choosing Glacier cross-fades the photo (1s opacity, 1.6s scale from 1.08), re-animates the headline (clip-path rise, 1s cubic-bezier(.2,.7,.1,1)) and transitions the background to slate #14202a with an ice accent #b9cbd6 over 0.8s.

A small mono "N° 041 / 250" sits bottom-left. Under 720px (container query) stack photo (300px) above the copy with a vertical fade. Radiogroup semantics on editions.`,
  },
  {
    id: 'fragrance-notes-split',
    title: 'Split-screen fragrance with notes pyramid',
    type: 'Luxury Product Showcase',
    description: 'A two-panel perfume page where an interactive top/heart/base pyramid reveals each layer of the scent.',
    tags: ['split screen', 'fragrance', 'tabs', 'pyramid'],
    component: FragranceNotesSplit,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a split-screen luxury fragrance showcase for "Noir Vetiver Eau de Parfum" by Maison Varga. Left half: a full-height bottle photograph (object-fit: cover) with a very slow 18s alternate drift (scale 1 to 1.08), and a small frosted caption pill "Composed by Inès Varga, Grasse". Right half (1.1fr): content on a pale sage background #dde3d6 with deep olive ink #232b1d and muted olive #5d6a51 for secondary text.

Typography: Bodoni Moda 500 for the product name (clamp(40px, 6.4cqw, 68px), line-height .95) and for the pyramid labels in italic; Geist for everything else.

Notes pyramid: three stacked 52px buttons shaped with clip-path trapezoids that widen downward (top 28% wide, heart 56%, base 84% at their tops), 4px apart, filled #c8d0bf. They act as a tablist: clicking or using arrow keys selects a tier, which fills it olive with light text (0.35s) and swaps the panel beside it — a timing line ("Two to four hours"), note chips (Haitian vetiver, Orris, Clary sage) that pop in with 50ms staggers, and a one-sentence description. Default to Heart.

Purchase block pinned to the bottom: two size radio buttons ("50 ml €145", "100 ml €210") with an inset 1px outline when selected, a full-width 52px olive button whose label includes the live price ("Add to bag — €145"), and a sample note in 12px.

Under 700px (container query) stack the image (240px) above the content and put the pyramid above its notes panel. Proper tab/tabpanel and radiogroup roles; roving tabindex on tiers.`,
  },
  {
    id: 'velvet-spotlight',
    title: 'Velvet spotlight reveal',
    type: 'Luxury Product Showcase',
    description: 'A jewellery-counter style reveal: a pointer-following light uncovers a limited camera and its engraved details on oxblood velvet.',
    tags: ['spotlight', 'mask', 'pointer', 'limited edition'],
    component: VelvetSpotlight,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a dark "velvet spotlight" showcase for the "Aurel M Titanium" camera, edition of 75, €9,800. Background: a radial gradient from oxblood #3a0d1b to #14040a, overlaid with a faint 2px vertical pinstripe (repeating-linear-gradient, 1.2% white) for a velvet nap, plus a soft crimson radial glow (rgba(130,24,52,.55)) that follows the light position.

Product: a circular photo (about 52% of the container width, max 420px) centred in the upper area. Stack two identical copies: a dimmed one (brightness .18, saturate .4, sepia .4, hue-rotate −30deg) and a full-colour one masked by mask-image: radial-gradient(circle at var(--x) var(--y), #000 0, rgba(0,0,0,.6) 70px, transparent 170px). Both layers fill the whole section so the mask uses the same coordinates as the pointer. Add a screen-blended warm highlight (rgba(255,226,214,.16)) at the same point. Hide the cursor over the stage.

Three detail callouts (dot + Italiana serif title + 12px rose #d7aab5 text: "Engraved plate", "Summilux 35", "Bordeaux hide") are scattered around the camera; each one's opacity is driven by its distance from the light, so details appear only when lit.

When the pointer is not over the stage, the light drifts on a slow Lissajous path (sin 0.45 and 0.7 rad/s), blending in from its current spot over 1.2s via requestAnimationFrame; pause when off-screen and skip for reduced motion. The stage is focusable and arrow keys move the light in 5% steps.

Bottom plate: "Edition of 75", an Italiana 36–60px title "Aurel M Titanium" (Titanium in rose #e8b7c3), a spec line and an outlined pill "Private enquiry" button that fills rose on hover.`,
  },
  {
    id: 'scroll-chapters-showcase',
    title: 'Scroll-driven product chapters',
    type: 'Luxury Product Showcase',
    description: 'A launch story told in four chapters inside its own scroll container, with a sticky visual that re-frames and re-tints per chapter.',
    tags: ['scrollytelling', 'sticky', 'IntersectionObserver', 'audio'],
    component: ScrollChaptersShowcase,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a scroll-driven product story for "Solace One" headphones (£399) that runs inside its own 640px-tall scroll container (overflow-y: auto, smooth scrolling, focusable) on a #eef0f3 background.

Layout: two columns. The left column is position: sticky; top: 0; height: 640px and holds the visual. The right column holds four chapters, each at least 560px tall and vertically centred, followed by a closing section with a CTA.

Chapters (number, title, body, big stat): "01 Sound, unfolded." (4–40k Hz), "02 Silence on demand." (−42 dB), "03 Made to disappear." (268 g), "04 A week between charges." (60 h). Titles in Instrument Serif 400, clamp(36px, 5.6cqw, 58px); body Geist 15px #4a4f5a, max 38ch; chapter number in Geist Mono 12px blue #3a5bd9; stats in Instrument Serif 44px over a hairline rule. Inactive chapters sit at 25% opacity and 16px lower; the active one fades/rises in (0.6s / 0.8s cubic-bezier(.2,.7,.1,1)).

Use an IntersectionObserver with the scroll container as root and rootMargin "-45% 0px -45% 0px" to pick the active chapter. The sticky panel transitions its background per chapter (navy #1f2b4d, steel #5d7a92, clay #8c6f62, forest #2f4f46, 0.8s) and cross-fades between product photos (22px radius, deep shadow) while each one animates to its own framing (e.g. scale 1.5 + translate for a detail close-up, small rotations for others) over 1.1s.

Overlay on the panel: brand name and a "02 / 04" counter at the top, a thin vertical progress rail whose fill scales with scroll progress, and pill/dot chapter buttons that scroll the container to centre the chosen chapter. Under 640px stack a 260px sticky panel above the text.`,
  },
  {
    id: 'hotspot-showcase',
    title: 'Shoppable hotspot showcase',
    type: 'Luxury Product Showcase',
    description: 'A room-set sofa photo with pulsing numbered hotspots that open feature callouts, synced to a side list and fabric picker.',
    tags: ['hotspots', 'callouts', 'furniture', 'shoppable image'],
    component: HotspotShowcase,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a hotspot product showcase for the "Ostra 3-Seat Sofa" (£2,450 or £204/mo) by Studio Ostra. Layout: a full-height lifestyle photo on the left and a 300px info panel on the right, all on deep navy #15223d with light text #eef1f7. Font: Jost 400/500/600.

Hotspots: four 34px white circles with a number, absolutely positioned by percentage over the photo (cushions, arms, frame, legs). Each has a ring pseudo-element that pings outward (scale .6 to 1.5, fading, 2.2s infinite). Hover scales 1.12; the active one turns amber #f2b85b and stops pinging.

Callout: clicking a hotspot opens a 250px white (#fbfaf7) card with 14px radius anchored just below-right of the dot, flipping left when the dot is past 58% across and above when past 60% down. It shows "2 of 4", an 18px title, a 13.5px sentence (e.g. "Kiln-dried oak frame — Dowelled and glued, never stapled. Guaranteed for 15 years."), round previous/next buttons that cycle through features, and a Close pill. It enters with a 0.35s fade/scale; Escape closes it.

Side panel: studio line, 30px title, price, then a numbered list of the same four features — clicking a row opens the matching callout and both stay in sync (active row gets an amber-tinted background and filled number). At the bottom, an upholstery picker of four round fabric chips (Slate bouclé, Moss velvet, Rust wool, Ink linen) that re-tints the photo with CSS filters over 0.6s and updates the label.

Under 720px (container query) stack the photo (380px) above the panel and hide the duplicate list. Hotspots are buttons with aria-label and aria-expanded.`,
  },
  // ── Horizontal Product List ──────────────────────────────────────────
  {
    id: 'cart-rows-list',
    title: 'Cart rows with steppers and totals',
    type: 'Horizontal Product List',
    description: 'A skincare bag with compact rows — size selector, quantity stepper, line subtotal, undoable remove and a free-delivery meter.',
    tags: ['cart', 'qty stepper', 'undo', 'skincare'],
    component: CartRowsList,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a cart-style horizontal product list for a skincare brand on a dusty rose background #efe6ea. A white 720px panel (20px radius, soft plum shadow) holds a header, the rows and a totals footer. Font: Hanken Grotesk 400–700; ink #2b1d22, muted #8a6f78, accent raspberry #b2416a, success green #2f7a52.

Header: "Your bag" (24px/700) with a muted item count, and on the right a free-delivery meter: text "You're £13.00 from free delivery" over a 5px track whose fill scales from the left (0.5s cubic-bezier(.2,.8,.2,1)) toward a £75 threshold; it turns green with "Free delivery unlocked" when reached.

Each row is a 5-column grid: 64px rounded (14px) thumbnail, name + a small size <select> showing each variant's price (e.g. "30 ml · £46.00"), a pill quantity stepper (− count +, limits 1–9, disabled states), a right-aligned tabular-figure line subtotal, and a round × remove button. Rows fade up on entry. Removing a row shows a dark pill toast "Rose Hydrating Mist removed  [Undo]" for 4 seconds; Undo restores it at its original index.

Footer (two columns): a promo form (input + outlined Apply) where "GLOW10" applies 10% off and adds a green discount line; a totals list (Subtotal, Delivery £4.95 or Free, bold Total over a hairline), and a full-width raspberry "Checkout" button.

All money uses Intl.NumberFormat en-GB GBP and recomputes instantly. Under 600px (container query) each row reflows to thumbnail + name/remove on top and stepper/subtotal beneath. Include an empty state.`,
  },
  {
    id: 'snap-shelf',
    title: 'Snap-scrolling sneaker shelf',
    type: 'Horizontal Product List',
    description: 'A horizontally scrolling product shelf with scroll-snap, edge-aware arrow buttons, a live scroll thumb and quick add.',
    tags: ['scroll-snap', 'shelf', 'arrows', 'sneakers'],
    component: SnapShelf,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Build a horizontally scrolling "shelf" of sneakers for a streetwear drop, on a concrete grey background #d4d5cf with black #111 ink and a safety-orange accent #ff5a1f. Fonts: Syne 700/800 for headings and names, Geist Mono for prices and small labels, Geist for colour names.

Header row: a mono orange eyebrow "Drop 14 · Spring runners", a heavy 26–40px title "Fresh off the shelf" (letter-spacing −0.03em), and on the right two 46px round outlined arrow buttons.

Shelf: a <ul> with display: flex, 14px gap, overflow-x: auto, scroll-snap-type: x mandatory, hidden scrollbar, side padding equal to the page gutter with matching scroll-padding. Each item is clamp(190px, 27cqw, 250px) wide, snaps to start, and has a 4:5 photo (6px radius) that zooms 1.06 on hover, an optional orange tag ("New", "Low stock"), and a 40px white round quick-add button bottom-right that springs on hover and toggles to an orange check when added. Below: name and price on one line, colour underneath. Colourway variants can reuse a photo with a hue-rotate filter.

Arrows scroll by exactly one card width plus gap with smooth behaviour (instant for reduced motion) and disable at each end (computed from scrollLeft vs scrollWidth − clientWidth on every scroll and on resize). Footer: a 3px progress track whose black thumb width equals the visible fraction and whose position follows scroll progress, plus a mono "2 in bag" counter (aria-live).

The shelf itself is focusable so arrow keys scroll it natively; buttons have aria-labels and aria-pressed.`,
  },
  {
    id: 'spec-compare-list',
    title: 'Sortable spec comparison list',
    type: 'Horizontal Product List',
    description: 'A product comparison table with sortable spec columns, best-in-class highlighting and a pinned baseline that shows deltas.',
    tags: ['comparison', 'sortable', 'table', 'watches'],
    component: SpecCompareList,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Create a product comparison list for four automatic watches on a pale steel background #e8ecf3. A white card (max 980px, 12px radius, 1px #d3dae6 border) contains a header and a horizontally scrollable table (min-width 760px; the wrapper is focusable for keyboard scrolling). Fonts: IBM Plex Sans 400/500/600 for text, IBM Plex Mono with tabular figures for every value. Ink #0f1b33, muted #5b6880, accent blue #1d4ed8.

Header: "Compare automatics" (20px/600), a sub-line "4 models · pin one to see the difference", and an iOS-style switch "Highlight best" (38×22 track that turns blue, knob slides 16px with a springy 0.25s ease) built on a real visually-hidden checkbox.

Columns: a sticky-left Model column (46px rounded thumbnail, bold name, mono movement line like "SW510 · 28.8k"), then Case (mm), Power reserve (h), Water res. (m), Weight (g), Price ($), and a pin column. Column headers are buttons that sort ascending, then descending on second click, with a rotating chevron and aria-sort on the <th>.

Highlight best: for each column with a direction (max reserve, max water, min weight, min price) tint the winning cell #eaf1ff with blue bold text.

Pin: a 32px pin button on each row sets that model as the baseline (row tinted #fff8e6, pin turns amber #f2b705). Every other row shows a small delta under each differing value, e.g. "+10 h" or "−$1,060", coloured green when better and red when worse according to that column's direction, grey when neutral.

Rows get a subtle hover tint. Example data: Halden Chronograph 41mm 62h 100m 96g $1,950; Marlow Diver 39mm 38h 300m 82g $2,290; Aster 38 Dress; Halden Nocturne $7,400.`,
  },
  {
    id: 'recently-viewed-strip',
    title: 'Recently viewed strip',
    type: 'Horizontal Product List',
    description: 'A compact, horizontally scrolling history strip with price-drop flags, per-item removal and re-open-to-front behaviour.',
    tags: ['recently viewed', 'history', 'chips', 'tech'],
    component: RecentlyViewedStrip,
    stageHeight: 420,
    stageTone: 'none',
    prompt: `Build a "Recently viewed" product strip for an electronics store, shown at the bottom of a page section on a pale teal-grey background #eef3f2. Above it, a short intro: a teal (#0f766e) store name, a 30–46px Outfit 500 headline "Still thinking it over?" with −0.035em tracking, and a 15px lede in #4f6967.

Strip: a white card with 18px radius and a soft teal-tinted shadow. Header row: "Recently viewed" (16px/600), a pill count badge (#e1efed background, teal text) and a right-aligned text button "Clear history".

Items: a single horizontal row (flex, 10px gap, overflow-x: auto, scroll-snap proximity) with a mask-image gradient fading both edges. Each item is a compact chip button: 52px rounded (10px) thumbnail, then the name (14px/500, ellipsis at 150px), price (13px/600) with an optional orange-red price-drop flag ("−$150", #b4441c), and a grey time-ago line ("12 min ago", "Yesterday"). Chips have a 1px #e2ebea border that turns teal and lifts 1px on hover. A 22px round × button in the corner appears on hover/focus (always visible on touch) and removes that item.

Clicking a chip moves it to the front with the time "Just now" and a springy slide-in (0.5s cubic-bezier(.3,1.5,.5,1)). "Clear history" empties the strip and shows an inline empty state with a "Restore" pill button. New chips scale in from 0.94.

Font: Outfit 400/500/600. Chip buttons have descriptive aria-labels (name and price); the remove buttons say "Remove … from history".`,
  },
  {
    id: 'wishlist-move-to-bag',
    title: 'Wishlist with move-to-bag',
    type: 'Horizontal Product List',
    description: 'An editorial wishlist whose rows slide out and collapse into the bag, with stock states, notify-me and a bag popover.',
    tags: ['wishlist', 'move to bag', 'collapse animation', 'fragrance'],
    component: WishlistMoveToBag,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a wishlist list for a fragrance and accessories boutique on a soft lilac background #efe9f2. Panel: max 700px, #fbf9fc, 1px #e3d8e8 border, 6px radius. Ink is deep plum #2b1a2e, muted text #7a647f. Fonts: Newsreader (italic 34px for the "Wishlist" heading, 19px roman for product names, italic for the empty state), Geist for UI, Geist Mono for prices. Prices in EUR, formatted with Intl (de-DE, no decimals).

Header: heading plus "4 saved · €685", separated from the list by a 1px plum rule; on the right an outlined pill "Bag" button with a filled plum count bubble.

Rows: grid of 72×90 thumbnail, info (name, detail line, stock line — "In stock", "Only 2 left" in rust #a2462e, or "Sold out" — plus "saved 3 days ago"), mono price, and an actions column with a plum pill "Move to bag" (or an outlined "Notify me" for sold-out items that toggles to "We'll email you") above a small underlined "Remove" link.

Move to bag: add a leaving class so the row content slides 60px right and fades (0.45s cubic-bezier(.6,0,.3,1)) while the row collapses its height by transitioning grid-template-rows from 1fr to 0fr (0.4s, 0.15s delay). After ~560ms remove it from the wishlist, append it to the bag, and pulse the count bubble (scale 1.35, flash mauve #9b4f8f, springy). Skip the delay with reduced motion.

Bag popover: clicking Bag toggles a dark plum dropdown (aria-expanded) listing bag items with price and a "Move back" pill that returns them to the top of the wishlist, plus a bag total. Under 560px (container query) the actions wrap beneath the info. Include an empty state.`,
  },
  // ── Product Carousel ─────────────────────────────────────────────────
  {
    id: 'hero-color-carousel',
    title: 'Colour-themed hero carousel',
    type: 'Product Carousel',
    description: 'An auto-advancing product hero where every slide floods the stage with the product’s own colour, with story-style progress bars.',
    tags: ['autoplay', 'hero', 'colour theming', 'swipe'],
    component: HeroColorCarousel,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build an auto-advancing hero carousel of four products where each slide re-themes the entire stage. Each slide defines --bg, --ink and --chip colours: Kite Runner 2 sneaker (#e8412f / #fff4ee / #ff6b55), Aster ANC headphones (#f2c230 / #2a1e00 / #ffd95e), Oro Mini speaker (#1e3a8a / #eaf0ff / #2f54b8), Kessler K2 camera (#0f5e57 / #e6fff8 / #1a7c73). The background and text colours transition over 0.9s cubic-bezier(.6,0,.2,1).

Layout: 560px tall, two columns. Left: a 14px/600 kicker, a giant Bricolage Grotesque 800 title (clamp(44px, 8.6cqw, 104px), line-height .88, letter-spacing −0.045em, narrow width axis), a 16px line of copy (max 34ch) and a pill "Shop now · $160" button in inverted colours. Right: a large circular colour disc in --chip that scales from .6 to 1, with a circular product photo on top that flies in from the right with 18° rotation and scale .85 (1s cubic-bezier(.2,.8,.2,1), 0.1s delay); outgoing slides exit to the opposite side. Copy lines stagger in 80ms apart, rising 26px.

Progress: Instagram-story style bars across the top, one per slide. The active bar fills with a 5.5s linear CSS animation; on animationend advance to the next slide. Pause (animation-play-state: paused) while the pointer is over the carousel, while it has keyboard focus, when it's scrolled off-screen (IntersectionObserver), or when the user hits the pause button. Clicking a bar jumps to that slide.

Bottom-right controls: "2 / 4" counter, round previous/next and pause/play buttons. Arrow keys navigate when focused; horizontal swipes over 50px change slide. Disable autoplay entirely for prefers-reduced-motion. Use aria-roledescription carousel/slide and hide inactive slides from assistive tech. Stack image above text under 640px.`,
  },
  {
    id: 'peek-carousel',
    title: 'Three-up carousel with peeking neighbours',
    type: 'Product Carousel',
    description: 'A furniture carousel showing three arched cards with the next and previous ones peeking in, driven by arrows, keys, dots or swipe.',
    tags: ['multi-item', 'peek', 'keyboard', 'furniture'],
    component: PeekCarousel,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a multi-item product carousel for a Nordic furniture edit on a soft lichen-grey background #e2e4dc with dark olive ink #23271e and muted #5f6655. Fonts: DM Serif Display for the heading (28–44px) and product names (20px), DM Sans 400/500 for the rest. Prices in EUR.

Header: "The living room edit" with a 14px sub-line, and two 48px solid dark round arrow buttons on the right (they scale 1.06 on hover and fade to 20% when disabled at either end).

Track: the viewport has side padding equal to a peek width (clamp(28px, 7cqw, 80px)) and the component clips overflow, so the previous and next cards visibly peek in at the edges. The track is a flex row with an 18px gap; each card's width is (100% − (per − 1) × gap) / per, where per is 3 on wide containers, 2 under 880px and 1 under 560px (measured with a ResizeObserver). Move the track with transform: translateX(calc(index × −(cardWidth + gap))) and a 0.7s cubic-bezier(.2,.8,.2,1) transition. Clamp index to 0…items − per.

Cards: 4:5 image with an arched top (border-radius 160px 160px 8px 8px) that zooms 1.05 on hover, then name, workshop ("Holm Studio, Aarhus") and price ("€1,290"). Cards outside the visible window fade to 45% opacity and scale to .94 and are aria-hidden.

Below, pill dots (8px, the active one stretches to 28px) jump to each position. The viewport is focusable: Left/Right arrows step, Home/End jump to the ends. A horizontal pointer swipe over 40px also steps. Use aria-roledescription="carousel".`,
  },
  {
    id: 'thumbnail-gallery-carousel',
    title: 'Product page gallery with thumbnails',
    type: 'Product Carousel',
    description: 'A product-detail image carousel driven by a vertical thumbnail rail, with swipe, keyboard control and pointer-follow zoom.',
    tags: ['PDP', 'thumbnails', 'zoom', 'sneakers'],
    component: ThumbnailGalleryCarousel,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a product-detail gallery for the "Kite Runner 2 — Cobalt / Ice" running shoe (£145, was £160) on a cool grey background #ebedf1. Layout: gallery (1.5fr) and an info column (1fr). Font: Inter Tight 400/600/700; ink #0c1020, muted #626a80, accent cobalt #2448ff.

Gallery: a vertical rail of 72×88px thumbnails (10px radius) beside a main image area (aspect 4:4.6, 16px radius). Thumbnails sit at 55% opacity, 85% on hover, and the active one is fully opaque with a 2px cobalt ring. They form a vertical tablist with roving tabindex and arrow-key navigation.

Main image: a flex track of full-width frames moved with translateX(−index × 100%) over 0.6s cubic-bezier(.2,.8,.2,1). Five views: side profile, lacing detail, pair, outsole and on the road — detail views can reuse a photo with a different object-position and scale. A frosted pill badge bottom-left reads "2 / 5 · Lacing detail". Round white arrow buttons fade in at the edges on hover. A zoom button top-right (and a click on the image with a mouse) toggles 2× zoom whose transform-origin follows the pointer, so moving the mouse pans the zoomed image; leaving the image exits zoom. Horizontal swipes over 50px change image. When focused, Left/Right change image and Z toggles zoom.

Info column: breadcrumb line, 30–44px/700 title with −0.04em tracking, colourway, price with struck-through original, three round colour swatches (radiogroup), a short bulleted feature list and a full-width cobalt pill "Choose size" button.

Under 700px (container query) stack everything and move the thumbnails into a horizontal scrolling row below the main image, with arrows always visible.`,
  },
  {
    id: 'bestseller-marquee',
    title: 'Best-seller marquee',
    type: 'Product Carousel',
    description: 'Two infinite, counter-scrolling belts of ranked best-sellers that pause on hover or focus and fall back to a scroller for reduced motion.',
    tags: ['marquee', 'infinite', 'best-sellers', 'pause on hover'],
    component: BestsellerMarquee,
    stageHeight: 440,
    stageTone: 'none',
    prompt: `Create an infinite best-seller marquee on a deep ink background #0b0f1a with light text #eef1f8, muted #9aa3b8 and a coral accent #ff7a59. Font: Space Grotesk 400–700.

Header: a small "Updated hourly" label with a pulsing coral live dot (box-shadow ring expanding to 8px, 1.8s), a 28–48px/600 headline "This week's best-sellers" (letter-spacing −0.035em), and an outlined pill "Pause motion" toggle on the right.

Two lanes, each a horizontal belt of product pills that scroll forever; the second lane runs in reverse. Each pill: #131a2b background, 1px #1f2740 border, 18px radius, containing a large coral rank number ("01", 28px/700, tabular), a 64px rounded thumbnail, the product name (15px/500) and a meta line ("$349 · 2.4k sold"). Hover/focus lifts the pill 2px and turns the border coral.

Seamless loop: render the item list four times inside a width: max-content flex belt with a 12px gap and animate transform from 0 to translateX(calc(−50% − 6px)) linearly and infinitely (duration ≈ 10s per item). Only the first copy is exposed to assistive tech and the keyboard; duplicates get aria-hidden and tabindex −1. Fade the lane edges with a mask-image linear gradient (transparent → black 8% … 92% → transparent).

Pausing: animation-play-state: paused on lane hover and focus-within, when the toggle is pressed, and when the component is off-screen (IntersectionObserver). With prefers-reduced-motion, drop the animation entirely, hide the duplicates and make each lane a normal horizontally scrollable row.`,
  },
  {
    id: 'coverflow-carousel',
    title: '3D coverflow fragrance carousel',
    type: 'Product Carousel',
    description: 'A perspective coverflow of fragrance and skincare bottles that follows your drag in real time and snaps to the nearest item.',
    tags: ['coverflow', '3D', 'drag', 'fragrance'],
    component: CoverflowCarousel,
    stageHeight: 580,
    stageTone: 'none',
    prompt: `Build a 3D coverflow carousel for a fragrance and skincare "Atelier Collection" on a deep teal radial background (#16393d at centre to #0a1c1f) with seafoam accents #9fd9cc / #7fb1a6 and pale text #e6f4f0. Fonts: Playfair Display (italic 18px collection title; 26–38px/500 product name) and Geist; Geist Mono for the counter. Prices in EUR with size ("€145 · 50 ml").

Stage: 330px tall with perspective: 1100px. Five covers (230px × 300px, 14px radius, deep drop shadow) are absolutely centred and each gets a transform from its offset o = i − position: translateX(o × 46% + clamp(o, −1, 1) × 22%) translateZ(−min(3, |o|) × 140px) rotateY(−clamp(o, −1, 1) × 48°). Opacity falls 18% per step and hides beyond 2.6. z-index decreases with distance. Side covers carry a dark gradient overlay that fades away when a cover becomes active; the active cover gets a faint seafoam hairline ring. Transitions: transform 0.65s cubic-bezier(.2,.8,.2,1), opacity 0.5s.

Dragging: on pointer drag, convert dx into a fractional position (dx / 220px, with 0.3 of rubber-band past the ends) and render it live with transitions disabled; on release, snap to the nearest index if the drag passed 0.25 of a step. Clicking a side cover (without dragging) brings it to the centre.

Below: caption with family ("Woody · Aromatic"), the name animating up on change (aria-live), price, then round outlined previous/next buttons around a "2 — 5" counter, disabled at the ends. The section is focusable and Left/Right arrows navigate.`,
  },
  // ── Full Product Catalogue ───────────────────────────────────────────
  {
    id: 'filter-sidebar-catalogue',
    title: 'Faceted catalogue with filter sidebar',
    type: 'Full Product Catalogue',
    description: 'A complete shop page with category, price-range, colour and stock filters, sorting, grid/list views, live counts and an empty state.',
    tags: ['filters', 'sorting', 'grid/list', 'signals'],
    component: FilterSidebarCatalogue,
    stageHeight: 720,
    stageTone: 'none',
    prompt: `Build a fully working product catalogue for a design store with 14 products across Audio, Watches, Eyewear, Cameras, Home and Fragrance. It fills a 720px-tall container: a 240px filter sidebar and a main area, each scrolling independently. Palette: #fafaf9 background, #18181b ink, stone greys (#57534e, #a8a29e, #e7e5e4), indigo accent #4338ca. Font: Plus Jakarta Sans 400–700. Prices in USD via Intl, no decimals.

Sidebar: "Filters" heading with a Reset link (disabled when nothing is active). Category checkboxes with custom 18px boxes (indigo when checked) and live counts that reflect the other active filters. A dual-thumb price slider: two overlaid range inputs (0–$3,000, step 50) with pointer-events only on the thumbs, a track painted by a linear-gradient between the two values, a "$0 – $3,000" readout, and min/max kept at least $50 apart. Colour swatches (multi-select, 2px indigo ring when on). An "In stock only" switch.

Main: a toolbar with "6 of 14 products" (aria-live), a sort <select> (Featured, Price low–high, high–low, Top rated, Newest) and a segmented grid/list toggle. Active filters appear as removable indigo chips. Grid: auto-fill minmax(180px, 1fr); cards have a square 14px-radius photo that zooms on hover, a "New" or "Sold out" flag, category, name, price, star rating with review count, and colour dots. List view switches cards to a bordered row with a 120px image and a one-line description. Cards fade up on render.

Empty state: an icon, "Nothing matches those filters", a hint and a "Reset all filters" button. Under 700px (container query) the sidebar becomes an off-canvas panel opened by a "Filters (3)" button. Keep all state in signals and derive results with computed.`,
  },
  {
    id: 'cart-drawer-catalogue',
    title: 'Catalogue with slide-in cart drawer',
    type: 'Full Product Catalogue',
    description: 'A bold, outlined audio store whose add-to-cart opens a slide-in drawer with steppers, a free-delivery meter, live totals and checkout.',
    tags: ['cart drawer', 'totals', 'focus management', 'audio'],
    component: CartDrawerCatalogue,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Create a working mini-store for "HALCYON audio" with a slide-in cart drawer, inside a 700px-tall container that clips overflow. Style: neo-brutalist — #f1f1ee background, white tiles, 1.5px solid #111 borders everywhere, 18px tile radius, sunflower yellow #ffd23f accent. Font: Schibsted Grotesk 400–900. Money in USD via Intl.

Header bar: heavy wordmark with a small superscript "audio", text nav, and a yellow pill "Cart" button with a black count badge that pops (scale 1.4, springy) when something is added. The page body scrolls independently: a 30–52px/800 headline "Sound gear, tuned in Oslo." (second half in italic 400) with a delivery/returns line, then a 3-column grid of product tiles (the first spans two columns with image and copy side by side). Each tile: 4:3 photo that zooms 1.05 on hover, name, spec line, price and an outlined pill "Add to cart" that turns black with yellow text reading "In cart · 2".

Adding opens the drawer: a 390px white panel that slides in from the right (transform 0.45s cubic-bezier(.2,.8,.2,1)) over a 40% black scrim. The drawer is role="dialog" aria-modal, the shop behind becomes inert, focus moves to the close button and returns to the trigger on close; Escape and scrim clicks close it.

Drawer contents: title with count pill; a free-delivery meter (outlined 8px bar filling yellow toward $500, "Add $151.00 for free delivery"); lines with 56px outlined thumbnails, a pill − / + stepper (− at 1 removes), line totals that slide in; a summary (Subtotal, Delivery $12 or Free, Est. tax 8%, bold Total over a 1.5px rule) and a big yellow "Checkout · $1,234.00" button that lifts with a hard 4px black shadow on hover. Checkout clears the cart and shows a confirmation ("Order HX-20418 placed.") with "Keep shopping". Grid drops to 2 then 1 column via container queries.`,
  },
  {
    id: 'tabs-search-catalogue',
    title: 'Category tabs with live search',
    type: 'Full Product Catalogue',
    description: 'A skincare catalogue with a sliding-ink category tab bar, live search with highlighted matches, per-tab counts and smart empty states.',
    tags: ['tabs', 'search', 'highlight', 'skincare'],
    component: TabsSearchCatalogue,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Build a skincare catalogue for "Mira Skin" with category tabs and live search, in a 700px-tall container where only the product panel scrolls. Palette: pale sky #e7eef6 background, navy ink #13294b, slate #5d7290, coral accent #f26b5b, highlight #ffd9d3. Fonts: Young Serif for the headline (28–44px), product names (17px) and empty state; Geist for UI. Prices in EUR.

Header: coral brand line, headline "The routine, simplified." and a 46px white pill search field with a magnifier icon, placeholder "Search niacinamide, SPF, serum…", and a round clear button that appears when there's text. A 2px navy ring shows on focus-within.

Tabs: All, Cleanse, Treat, Hydrate, Protect, Body, each with a count pill that updates as you type (the active tab's pill is navy). A 3px coral ink bar slides under the active tab by measuring the tab's offsetLeft/offsetWidth (transform and width transition 0.4s cubic-bezier(.2,.8,.2,1); re-measure after web fonts load). Use role="tablist"/"tab" with roving tabindex and Left/Right arrow keys; the tab row scrolls horizontally on narrow screens.

Panel: an aria-live status ("3 products for "serum" in Treat"), then a grid (auto-fill minmax(170px, 1fr)) of cards: 4:5 image with an asymmetric radius (22px 22px 22px 4px) and a category pill, the name with the matching substring wrapped in a highlight span, a note ("Ceramides + squalane"), price with size, and an outlined "Add" pill that toggles to coral "Added". Cards fade/scale in on render.

Search matches name, note and category. Empty state: if the current tab has nothing but other tabs do, say "No match in Treat. 2 results in other categories." with a "Search all categories" button; otherwise suggest terms and offer "Clear search". Two columns under 520px.`,
  },
  {
    id: 'quickview-modal-catalogue',
    title: 'Catalogue with quick-view modal',
    type: 'Full Product Catalogue',
    description: 'A quiet eyewear and watch shop where every product opens an accessible quick-view dialog with finishes, options, quantity and next/previous browsing.',
    tags: ['quick view', 'modal', 'focus trap', 'eyewear'],
    component: QuickviewModalCatalogue,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Create a product catalogue with a quick-view modal for "Lune Optical & Time" (eyewear, watches, a camera), in a 700px container that clips overflow and scrolls its grid internally. Palette: warm stone #dedbd3 page, #ece9e2 image wells, #f6f4ef modal, ink #161512, muted #6c685e, hairlines #c6c2b8, bottle-green CTA #234d3a. Fonts: Marcellus for the logo, product names and modal title; Geist for everything else. Prices in GBP, no decimals.

Grid: auto-fill minmax(190px, 1fr), square images (2px radius) that zoom 1.05 on hover; under each, a small kind label, the name (17px) and price. A dark pill "Quick view" button rises 12px into place and fades in on hover or keyboard focus (always visible on touch devices).

Modal: a blurred 50% scrim and a centred two-column dialog (max 820px) that pops in (0.35s cubic-bezier(.2,.8,.2,1), from scale .97 and slightly lower). Left: the product image, re-tinted by the chosen finish via CSS filter (0.5s), with a floating pill "‹ 3 / 6 ›" to browse the previous/next product without closing. Right: kind, 28px title, price that multiplies by quantity ("£570 (2 × £285)"), a short description, finish swatches as a radiogroup (28px circles with an offset ring), option chips for lens/strap/kit (filled black when selected), a quantity stepper and a green "Add to bag" button that turns black with "Added to bag" and increments the header "Bag (2)" count.

Accessibility: role="dialog" aria-modal, the page behind is inert, focus moves to the close button on open, Tab is trapped inside, Escape or a scrim click closes, and focus returns to the Quick view button that opened it. Stack the dialog to one column and the grid to two under 640px.`,
  },
  {
    id: 'facet-chips-catalogue',
    title: 'Chip-faceted catalogue with load more',
    type: 'Full Product Catalogue',
    description: 'A sneaker catalogue filtered entirely with tappable chips — use, size, price — with removable active filters, segmented sort and paginated loading.',
    tags: ['facet chips', 'load more', 'skeletons', 'sneakers'],
    component: FacetChipsCatalogue,
    stageHeight: 720,
    stageTone: 'none',
    prompt: `Build a sneaker catalogue filtered by chips instead of a sidebar, in a 720px container where only the results area scrolls. Palette: #fbfbfa background, #0d0d0d ink, #efefed wells, grey #6b6b66, hot pink accent #ff3d8b. Fonts: Big Shoulders Display 800 uppercase for the headline (40–72px, line-height .85) and empty state, Geist for UI, Geist Mono for sizes, counts and prices. Prices in USD.

Header: "ALL SNEAKERS" with a pink mono superscript result count, and a segmented sort control (Popular / Price ↑ / Price ↓) in a grey pill track where the active option fills black.

Facet bar: one horizontally scrollable row (hidden scrollbar) of 36px pill chips with 1.5px borders, grouped and separated by thin vertical rules: use (Running, Court, Trail, Lifestyle — multi-select OR), UK sizes 6–11 as 40px mono chips (multi-select, a shoe must stock every chosen size), and an "Under $150" toggle. Selected chips fill pink with white text; chips press to scale .96. Below, active filters render as small black tags with a ✕ that removes each one, plus a "Clear all" text link.

Results: grid auto-fill minmax(180px, 1fr); square 12px-radius images that zoom 1.06 and tilt −2° on hover with a white "use" pill; name, mono price, and "Cobalt · 3 sizes left". Cards rise in with 40ms staggers. Show 6 at a time: a "Showing 6 of 11" line, a thin progress meter, and a black "Load more" pill that shows three shimmering skeleton cards for ~650ms before appending the next page (instant with reduced motion). Changing any filter resets to the first page.

Empty state: "NO PAIRS IN THAT COMBO." with a sentence naming the chosen sizes and uses, and a pink "Clear all filters" button. Keep everything in signals; two columns under 480px.`,
  },
];
