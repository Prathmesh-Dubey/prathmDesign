import { DesignExample } from '../../core/example.model';
import { EditorialFeatureGrid } from './demos/editorial-feature-grid';
import { FocusCarouselMusic } from './demos/focus-carousel-music';
import { PricingTierGrid } from './demos/pricing-tier-grid';
import { SnapCarouselTravel } from './demos/snap-carousel-travel';
import { TeamProfileGrid } from './demos/team-profile-grid';
import { TiltHoloCard } from './demos/tilt-holo-card';
import { FannedDeckCoffee } from './demos/fanned-deck-coffee';
import { HoverSpreadBooks } from './demos/hover-spread-books';
import { SwipeMatchHomes } from './demos/swipe-match-homes';
import { SwipeDismissNotifications } from './demos/swipe-dismiss-notifications';
import { MasonryPlantBoard } from './demos/masonry-plant-board';
import { TestimonialMasonryWall } from './demos/testimonial-masonry-wall';
import { ProductBentoAudio } from './demos/product-bento-audio';
import { DashboardBentoFintech } from './demos/dashboard-bento-fintech';
import { CreditCardFlip } from './demos/credit-card-flip';
import { FlipGridFilms } from './demos/flip-grid-films';
import { FlexAccordionFitness } from './demos/flex-accordion-fitness';
import { ExpandDetailRecipes } from './demos/expand-detail-recipes';
import { DragRailEvents } from './demos/drag-rail-events';
import { SidewaysScrollHouses } from './demos/sideways-scroll-houses';
import { AlternatingTimelineBikes } from './demos/alternating-timeline-bikes';
import { HorizontalTimelineMission } from './demos/horizontal-timeline-mission';
import { SlideUpHotels } from './demos/slide-up-hotels';
import { SpotlightBorderFeatures } from './demos/spotlight-border-features';
import { ParallaxLayerTilt } from './demos/parallax-layer-tilt';
import { AlbumCoverflow } from './demos/album-coverflow';
import { ScrollStackCases } from './demos/scroll-stack-cases';
import { GradientOverlaySurf } from './demos/gradient-overlay-surf';
import { DuotoneSpeakers } from './demos/duotone-speakers';

export const CARD_EXAMPLES: DesignExample[] = [
  // ── Carousel Cards ──
  {
    id: 'snap-carousel-travel',
    title: 'Snap carousel with autoplay dots',
    type: 'Carousel Cards',
    description: 'A scroll-snap trip carousel with arrows, progress dots and autoplay that pauses while you hover or focus it.',
    tags: ['scroll-snap', 'autoplay', 'travel', 'keyboard'],
    component: SnapCarouselTravel,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a travel "featured trips" carousel on a cool mist background (#e8eef0) with deep teal-ink text (#10242b) and a pine accent (#0f5e50).

Header row: a small grey-teal kicker (13px, #4a6a70) above a Fraunces 500 headline (clamp 22–34px, tight -0.02em tracking, max 20ch). Right-aligned: two 44px circular arrow buttons (1px #b8c9cc border, #f6f9f9 fill) that turn pine with white icons on hover and scale to .94 on press.

Track: a horizontal CSS grid (grid-auto-flow: column; columns clamp(232px, 31% of width, 340px); 16px gap) with overflow-x auto, scroll-snap-type x mandatory, hidden scrollbar and matching scroll-padding. Each card: a 4:4.6 photo with 18px radius and a frosted pill tag top-left ("Northern lights"), then a row with a Fraunces 20px place name, a 13.5px "Region · 7 nights" line and a right-aligned bold "from €2,140". Photos zoom to 1.05 over .8s on hover.

Footer: pill dots, one per snap position (computed from scrollWidth / card stride). The active dot widens from 22px to 48px and fills left-to-right as an autoplay progress bar; every 5.2s it advances one card and loops at the end. Autoplay pauses while the pointer is over the carousel, while anything inside has focus, when it is off-screen (IntersectionObserver) and under prefers-reduced-motion; a small mono label says "Autoplay" or "Paused" (aria-live polite).

Accessibility: the track is a focusable region with aria-roledescription="carousel"; Left/Right arrow keys step; dots are buttons with "Go to slide n" labels and aria-current. Update the active dot from the scroll position so swiping keeps it in sync.`,
  },
  {
    id: 'focus-carousel-music',
    title: 'Centre-focus gig carousel',
    type: 'Carousel Cards',
    description: 'A coverflow-lite carousel where the centred card grows and brightens while neighbours shrink, fade and tilt away.',
    tags: ['focus', 'music', 'swipe', 'generative art'],
    component: FocusCarouselMusic,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a "live this winter" gig carousel on a warm near-black radial background (#24201c centre to #0e0d0c) with off-white text (#f3ede4) and muted taupe secondary text (#a69d90).

Cards are poster-like tiles (width clamp(176px, 30% of width, 270px), aspect 1:1.22, 6px radius), each with its own two-stop 160° gradient (e.g. #ff9f5a→#d9434b, #9ee6d6→#3a8f9a) and a simple flat SVG motif (sun, rings, bars, waves, 2×2 grid) in a dark ink colour. Bottom caption: artist in Syne 800 (17–22px, -0.02em) and tour name at 12.5px, 75% opacity.

Layout: all cards are absolutely centred; each gets an offset o = index − active. Transform: translateX(o × step) scale(1 − |o| × .16) rotate(o × 2deg), with step ≈ 21% of width. Opacity and brightness drop with distance (brightness 1 − |o|×.22), z-index = 20 − |o|. Transition transform .6s cubic-bezier(.22,.8,.24,1). The active card gets a long coloured glow shadow mixed from its own gradient colour.

Interaction: click a side card to centre it; swipe/drag horizontally more than 40px to step (ignore the click that ends a drag); Left/Right arrow keys on the focused carousel region.

Below, a detail bar separated by a 1px #2c2823 rule: date in Syne 700 18px, venue line, round prev/next buttons (disabled at the ends), a mono "2/5" counter and a pill "Tickets £28" button whose background tweens to the active card's colour. Use aria-live on the detail bar and aria-labels on every card.`,
  },

  // ── Grid Cards ──
  {
    id: 'editorial-feature-grid',
    title: 'Editorial feature grid',
    type: 'Grid Cards',
    description: 'A magazine-style story grid mixing lead, tall, wide and small cards with section filters.',
    tags: ['editorial', 'architecture', 'filter', 'dense grid'],
    component: EditorialFeatureGrid,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build an architecture magazine "feature grid" on warm white (#fafaf7) with ink #161616 and a single editorial red (#c8102e).

Masthead: "Plan & Section" in Newsreader 600 (24–34px) with a small red italic "Issue 41", a 2px solid ink rule below, and on the right a row of text filter buttons (All, Residential, Civic, Interiors) — the active one becomes an ink pill with white text.

Grid: 6 columns, 28px row gap, 22px column gap, grid-auto-flow: dense. Card sizes: a lead story (4 cols × 2 rows, 16:10 image, 24–34px headline plus a Newsreader 16px dek), a tall story (2 × 2, 3:4 image), wide stories (3 cols, image and text side by side with a square image at 44%), and small stories (2 cols, 4:3 image). Every card: image with no radius on a #e6e6e1 placeholder, red 12px section label, Newsreader 500 headline (19px, line-height 1.15), and a grey "Author · 8 min" byline.

Motion: images sit at saturate(.85) and on hover zoom to 1.04 over 1s with full saturation; headlines get a 1px underline offset 4px. When the filter changes, cards re-enter with a .5s fade-and-rise (14px).

Responsive with container queries: under 820px switch to 2 columns (lead and wide span both), under 480px a single column with the wide cards stacking. Cards are links with a red focus outline; filter buttons use aria-pressed.`,
  },
  {
    id: 'pricing-tier-grid',
    title: 'Pricing tiers with billing toggle',
    type: 'Grid Cards',
    description: 'Three SaaS plans with a sliding monthly/yearly switch and a dark highlighted middle tier.',
    tags: ['pricing', 'SaaS', 'toggle', 'conversion'],
    component: PricingTierGrid,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a three-tier pricing grid for a design-studio SaaS on a cool grey background (#eef0f4) using Manrope (400–800) and ink #1d1a22.

Header: a Manrope 800 headline "Pricing that scales with your studio" (22–30px, -0.03em) and a segmented billing toggle: a #dfe2ea track with 4px padding, two buttons ("Monthly", "Yearly −20%" with the discount in burnt orange #c2410c), and a white pill with a soft shadow that slides between them with transform over .35s cubic-bezier(.3,.8,.3,1). Use role="radiogroup" and aria-checked.

Cards (3 equal columns, 16px gap): white, 20px radius, 1px #e0e2ea border, 26px × 24px padding. Content: plan name 18px/800, a 14px blurb at 70% opacity, a large price (48px/800, -0.04em, small superscript $ and "/ seat / mo"), a billing note ("Billed $172 per seat yearly"), a 44px outlined CTA (fills ink on hover) and a checklist with orange tick icons. When the toggle changes, the price number re-renders with a .4s rise-and-fade.

The featured middle plan uses deep plum #2a1530 with blush text #fbeee9, a peach (#ffb59a) CTA and ticks, a "Most teams pick this" peach badge overlapping the top edge, and a deep plum shadow. All cards lift 4px on hover.

Under 760px (container query) stack the cards in one 420px column. Free tier shows "Free" instead of a price.`,
  },
  {
    id: 'team-profile-grid',
    title: 'Team profiles, neo-brutal',
    type: 'Grid Cards',
    description: 'A filterable team grid with chunky outlined cards whose bios slide up on hover or focus.',
    tags: ['team', 'about page', 'filter', 'brutalist'],
    component: TeamProfileGrid,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a playful "meet the team" grid on a butter-yellow background (#ffe066) in Space Grotesk with pure ink (#111) outlines.

Top bar: headline "The people behind Fieldnote" (22–30px, 700, -0.03em) followed by a small black count pill with yellow numerals; on the right, outlined pill filter buttons (Everyone, Design, Engineering, Ops) — 2px ink border, the active one filled ink with yellow text, each nudging up 1px on hover.

Grid: repeat(auto-fill, minmax(190px, 1fr)), 16px gap. Each card: #fffdf5 fill, 2px ink border, 16px radius and a hard 5px 5px 0 ink offset shadow. On hover/focus the card moves −3px/−3px and the shadow grows to 8px. The portrait area (≈1:1) has a per-person pastel background (#ff8fab, #7bdff2, #b2f7ef, #cdb4db…) and the photo starts greyscale with mix-blend-mode: multiply, turning full colour and scaling 1.04 on hover. Below: name 17px/700, role 13.5px, city 12px muted.

Reveal: a panel in the person's pastel colour with a 2px top border slides up from translateY(101%) over .35s, showing a one-line bio and two 32px round outlined icon links (LinkedIn, email) that invert on hover.

Filtering re-renders cards with a springy .4s pop-in. Cards are focusable (tabindex 0) and use :focus-within so keyboard users see the bio; links have aria-labels like "Email Amara Nwosu".`,
  },

  // ── Stacked Cards ──

  {
    id: 'fanned-deck-coffee',
    title: 'Fanned deck you cycle',
    type: 'Stacked Cards',
    description: 'A fanned stack of coffee origin cards — tap it and the top card flicks away and tucks in at the back.',
    tags: ['deck', 'cycle', 'coffee', 'click'],
    component: FannedDeckCoffee,
    stageHeight: 500,
    stageTone: 'none',
    prompt: `Build a "single origin" coffee deck on a deep forest background (#1d2a23) with pale sage text (#e9efe6). Two columns: an intro on the left (13px muted #9fb3a6 kicker, a Young Serif headline at 26–40px, a 15px lead, a solid pale "Next bean" pill button and a mono "1 / 4" counter), and the deck on the right. Stack to one column under 640px.

Deck: one big <button> containing four absolutely centred cards (260 × 340px, 18px radius, 20px padding). Each card has its own pastel fill and matching dark ink: mustard #f2d48b/#3b2a06, sky #c6d8f2/#14274a, blush #f4c3b8/#4a1a10, mint #bfe0c8/#123522. Card content: origin + "No. 1" row (12px, mono number), a Young Serif 30px coffee name, outlined tasting-note chips, a two-column Process / Altitude spec block with tiny mono labels, and a dashed divider above a 5-step roast meter of 18 × 6px bars.

Fan: each card reads its position p in the deck order and uses transform: translate(p×14px, p×−10px) rotate(p×5deg) scale(1 − p×.04), brightness(1 − p×.08), z-index 10 − p, transition .5s cubic-bezier(.3,.75,.25,1). Hovering the deck widens the fan (20px / −14px / 7deg).

Cycle: on click (or Enter/Space), give the top card a class that flings it to translate(−70%, 30px) rotate(−18deg) in .34s with an ease-in, then move it to the end of the order array; because its z-index drops first, it visibly glides back into the rear slot. Ignore clicks mid-animation; under prefers-reduced-motion just reorder. The button's aria-label names the current coffee.`,
  },

  {
    id: 'hover-spread-books',
    title: 'Book pile that fans on hover',
    type: 'Stacked Cards',
    description: 'A tidy pile of typographic book covers that spreads into an arc on hover, focus or tap, with a detail line for the picked title.',
    tags: ['stack', 'hover', 'books', 'CSS-only fan'],
    component: HoverSpreadBooks,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Create a "book club shortlist" pile on a cool periwinkle-grey background (#dfe4ee) with navy ink (#1b2340). Fonts: Instrument Serif for titles, Geist for UI.

Header: a 13px muted kicker (#59627e), an Instrument Serif headline (24–36px) and an outlined pill "Fan out" toggle on the right (fills navy when pressed, aria-pressed) so touch users can spread the pile.

Covers: five CSS-only book covers (width clamp(120px, 18% of width, 168px), 2:3 ratio, radius 3px 8px 8px 3px) with a spine shade made from two inset box-shadows (6px dark, 7px light) and a soft drop shadow. Each cover has a bold fill and contrasting ink (vermilion #e9573f, sand #f1d6a1, bottle green #2f5d50, sky #a7c4e8, midnight #1f2340) and a geometric motif drawn with a pseudo-element: big circle, horizontal stripes, an arch, a dot grid or three rules. Title in Instrument Serif 17–21px, author at 11px.

Stacked state: every cover sits at the same spot, offset by i×3px / i×−4px and rotated (i − 2)×3deg. Spread state (on :hover, :focus-within, or when pinned): translateX(c × gap) rotate(c × 4deg) translateY(c² × 6px), where c is the index minus the centre, giving a gentle arc. Transition .6s cubic-bezier(.25,.9,.25,1) with a 25ms stagger per card.

Each cover is a button: hover lifts it 16px; clicking selects it (navy outline, aria-pressed) and updates a detail row under a 1px rule — title, "author · year · pages" and an italic one-line pick quote, announced with aria-live.`,
  },

  // ── Swipe Cards ──

  {
    id: 'swipe-match-homes',
    title: 'Swipe-to-match flat hunt',
    type: 'Swipe Cards',
    description: 'Tinder-style draggable listing cards with rotation, Save/Pass stamps, buttons, undo and keyboard arrows.',
    tags: ['drag', 'pointer events', 'real estate', 'undo'],
    component: SwipeMatchHomes,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a mobile-style "swipe to match" rental finder centred on a dark radial background (#262a35 top to #121419), max 340px wide, in Outfit (400–800) with white text.

Header: wordmark "nestle." (22px/700, the dot in rose #ff4d6d) and a dark pill "Saved 2" with the count in mint #3ddc97.

Deck: a 3:3.9 area holding the top three listing cards, each absolutely stacked with 24px radius, a full-bleed apartment photo, a bottom gradient scrim and info: a frosted perk pill ("Canal view"), a 26px/700 neighbourhood name with a lighter city, and a facts row (bold "€2,150/mo", "2 bed", "68 m²"). Back cards sit at translateY(depth×14px) scale(1 − depth×.05) and smoothly rise into place as you drag the top card (depth reduces by drag progress).

Dragging: use pointer events with setPointerCapture and touch-action: none. While dragging, the card follows the pointer (vertical movement damped to 40%) and rotates dx×0.07deg with no transition. Two outlined rotated stamps fade in with drag distance — "Save" in mint on the left and "Pass" in rose on the right (opacity = |dx|/110). Release past 110px to fling the card off-screen (translate ±150%, rotate ±28deg, .32s ease-in) and then remove it; otherwise spring back with cubic-bezier(.2,.9,.3,1.15).

Controls: a 60px round rose ✕ button, a 44px amber undo button that restores the last card, and a 60px mint heart button; they scale 1.1 on hover and .92 on press. Left/Right arrow keys on the focused deck pass/save. When empty, show a dashed panel with "Start over". Announce each decision through an aria-live region.`,
  },

  {
    id: 'swipe-dismiss-notifications',
    title: 'Swipe-to-dismiss notification stack',
    type: 'Swipe Cards',
    description: 'A lock-screen notification stack that collapses into a pile, expands on tap and lets you flick cards away.',
    tags: ['swipe', 'glassmorphism', 'notifications', 'mobile'],
    component: SwipeDismissNotifications,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a phone lock-screen notification stack (max 360px wide) over a warm mesh wallpaper: radial blobs of amber #ffb35c (top-left), coral #e0524a (top-right) and deep teal #0d5c63 (bottom) on #2a3d45. Above the stack show a centred date ("Tuesday 14 October", 16px/500) and a huge 60–78px bold time with tight -0.04em tracking.

Notification cards: 84px tall, 22px radius, frosted glass (rgba(250,247,245,.62) + backdrop-filter blur(24px) saturate(1.6)), dark text, a 38px rounded-square app icon in the brand colour (Monzo #ff5f4a, Strava #fc6a1c, Citymapper #2bb673…), a row with app name and relative time, a bold one-line title and a one-line body, both ellipsised. A small round ✕ appears on hover/focus in the top-right (replacing the time).

Collapsed state: only the first card is fully visible; the next two tuck behind it (negative top margin, transform-origin top, scale .95 and .90, opacity .82/.64) so their bottoms peek out, the rest are hidden. A caption reads "4 more · tap to expand". Tapping (no drag) expands into a full list with 8px gaps; a glass "Show less" pill collapses it again.

Swiping: pointer events with touch-action: pan-y. The card follows the finger horizontally (left movement resisted at 50%) and fades with distance. Release past +90px or −70px to dismiss: slide to translateX(115%) and fade, while its row collapses smoothly via grid-template-rows 1fr → 0fr (.3s), then remove it. Otherwise spring back with cubic-bezier(.25,.9,.3,1.1).

"Clear all" dismisses cards one after another with a 60ms stagger; an empty state offers "Bring them back". Cards are focusable and Delete/Backspace dismisses them.`,
  },

  // ── Masonry Cards ──

  {
    id: 'masonry-plant-board',
    title: 'Pin board masonry',
    type: 'Masonry Cards',
    description: 'A Pinterest-like CSS-columns board mixing photo pins, tips, a quote, a working checklist and a palette card.',
    tags: ['masonry', 'CSS columns', 'plants', 'mixed content'],
    component: MasonryPlantBoard,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a houseplant "pin board" masonry on soft sage (#edf0e8) with forest ink (#1e2a20). Headings in DM Serif Display, UI in Geist.

Header: centred board title "Rainforest corner" (26–38px) and a muted 13.5px meta line ("24 pins · board by Hana Sato · 1 saved by you" — the saved count is live).

Layout: pure CSS multi-column masonry — columns: 4 190px; column-gap 14px; every card has break-inside: avoid and 14px bottom margin, so the column count adapts to the container. Cards fade-and-rise 18px on load with a small stagger.

Card types (all 18px radius):
• Photo pins with different aspect ratios (3:4, 1:1, 4:5, 2:3, 5:4), a 14px/600 caption and 12.5px author. On hover a 28% dark veil fades in and a forest-green (#1f5135) "Save" pill drops in top-right; saved pins keep a dark "Saved" pill (aria-pressed).
• Tip cards in forest green with pale text: a mint "Care tip" label, a 22px serif title and a 14px body.
• A quote card in apricot (#f6d9a8) with a 21px italic serif quote.
• A white checklist card ("This week") with custom 18px rounded checkboxes that fill green with a CSS tick; checked items strike through.
• A palette card: four colour blocks in a 92px strip plus hex codes in mono.

Keep the Save buttons reachable by keyboard (visible on focus) and give photos descriptive alt text.`,
  },

  {
    id: 'testimonial-masonry-wall',
    title: 'Drifting testimonial wall',
    type: 'Masonry Cards',
    description: 'A three-column masonry of review cards whose columns drift at different speeds and pause on hover.',
    tags: ['testimonials', 'marquee', 'social proof', 'fintech'],
    component: TestimonialMasonryWall,
    stageHeight: 580,
    stageTone: 'none',
    prompt: `Create a "wall of love" testimonial section for a freelancer finance app on warm charcoal (#181613) with parchment text (#efe9df), set in Hanken Grotesk (400–800).

Header: a 22–32px/700 headline ("Freelancers stopped dreading tax week", -0.03em), a 14px muted line (#a39b8d) with the rating summary, and a small outlined "Pause motion" toggle (aria-pressed) on the right.

Wall: a 3-column grid (2 under 760px, 1 under 480px via container queries) with 14px gaps, clipped, with a vertical mask-image fade at the top 12% and bottom 15%. Each column holds a vertical "belt": its cards rendered twice in a row so it can loop seamlessly; animate translateY(0 → calc(−50% − half the gap)) linearly forever. Give columns different durations (34s, 43s, 52s) and run the middle one in reverse. Pause all belts on hover, on focus-within and when the toggle is pressed; respect prefers-reduced-motion. Mark the duplicate pass aria-hidden.

Cards: 16px radius, 18px padding, a subtle per-card tinted gradient built from a hue variable (hsl(h 22% 16%) → hsl(h 14% 12%)) with a matching 1px border that lights up to hsl(h 55% 55%) on hover while the card lifts 2px. Content: optional big metric (30px/800 in a light tint of the hue, e.g. "−6 hrs", "£1,240"), gold #f2b84b star row with dimmed empty stars and an aria-label, a 15px quote, and a footer with a 34px initials avatar in the card's hue plus name and role.`,
  },

  // ── Bento Grid Cards ──

  {
    id: 'product-bento-audio',
    title: 'Product bento, Apple-style',
    type: 'Bento Grid Cards',
    description: 'A product launch bento with a recolourable hero tile, a counting battery ring, a live ANC switch and pulsing spatial-audio tile.',
    tags: ['bento', 'product page', 'micro-interactions', 'audio'],
    component: ProductBentoAudio,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build an Apple-style product bento for "Aria Max" headphones on #f5f5f7 using Inter Tight (400/600/700), ink #1d1d1f, secondary #6e6e73 and a single system blue #0071e3.

Grid: 4 columns, grid-auto-rows minmax(150px, auto), 12px gaps; tiles have 24px radius, 20px padding, white fill and scale to 1.012 on hover. Collapse to 2 columns under 760px and 1 under 420px (container queries).

Tiles:
1. Hero (2 × 2): finish-coloured background (sandstone #ece3d6, sage #d6e2d3, sky #d5e3f3, rosé #f1d8d8, each with a matching dark ink), "Aria Max" eyebrow, a 28–44px/600 headline "Silence, tuned to you." with -0.035em tracking, and the headphone photo bleeding off the bottom-right with mix-blend-mode: multiply; it rotates −6° and scales 1.04 on hover. Background and text colour cross-fade over .6s.
2. Battery: an SVG ring (r 50, stroke 8, green #34c759 arc via stroke-dashoffset) and a big "40h" counter that counts up from 0 when the tile scrolls into view.
3. ANC (2 columns, #1d1d1f): title, an iOS-style switch (role="switch", green when on) and 22 equaliser bars with an orange→pink gradient animating scaleY .15→1 at staggered phases; switching ANC on flattens them to grey slivers and swaps the caption.
4. Finishes: four 34px swatch radio buttons that recolour the hero tile; the active one gets a blue outline ring.
5. Spatial audio: a pale blue-lilac gradient tile with three concentric rings pulsing outward (scale .4→1.3, fading, 2.4s, staggered .8s) around a blue dot.
6. Buy: "From $349" at 36px/700 and a blue pill "Buy" button.

Respect prefers-reduced-motion (show the final count, stop the loops).`,
  },

  {
    id: 'dashboard-bento-fintech',
    title: 'Live finance dashboard bento',
    type: 'Bento Grid Cards',
    description: 'A dark banking dashboard bento with a ticking balance chart, live FX rate, spend donut, activity feed and hoverable day bars.',
    tags: ['dashboard', 'fintech', 'sparkline', 'live data'],
    component: DashboardBentoFintech,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a fintech dashboard bento on graphite (#0d1015) with tiles in #151a22, 1px #1f2632 borders (#2f3a4c on hover) and 18px radius. Fonts: IBM Plex Sans for labels, IBM Plex Mono for every number. Accents: ice blue #7cc4ff, coral #ff7a59, mint #6fe3b0 for gains, salmon #ff8a70 for losses.

Grid: 4 columns, 10px gap. Balance tile spans 3 × 2: label, a mono balance (24–34px, -0.03em) with "+0.42% today" underneath, a segmented 1D / 1W / 1M control (role="tablist") and an SVG area chart (viewBox 300 × 90, preserveAspectRatio none, 1.8px blue line with non-scaling stroke, blue gradient fill fading to 0). A glowing dot marks the last value. Every 1.3s push a new random-walk point and drop the oldest so the chart scrolls; switching range regenerates the series.

Other tiles: an EUR/USD mono rate that flashes mint or salmon on each tick; a spend donut (four stroke-dasharray segments on r=15.9155 so values are percentages) with a "€3.2k" centre and legend; a 2 × 2 "Latest activity" list where a new transaction slides in from the top every few ticks (initial letter avatars, incoming amounts in mint); a "Tax pot" goal with a coral gradient progress bar; and a 2-column "Spend by day" bar chart whose bars turn blue on hover/focus and show a small pill tooltip.

Pause the ticker when off-screen and under prefers-reduced-motion. Collapse to 2 columns under 780px and 1 column under 420px.`,
  },

  // ── Flip Cards ──

  {
    id: 'credit-card-flip',
    title: 'Bank card flip with controls',
    type: 'Flip Cards',
    description: 'A realistic payment card that flips in 3D to its back, with finish swatches, a code reveal and a frozen state.',
    tags: ['3D flip', 'fintech', 'backface', 'toggles'],
    component: CreditCardFlip,
    stageHeight: 480,
    stageTone: 'none',
    prompt: `Build a banking "your card" panel on a cool grey gradient (#e9ecf1 → #dfe3ea) in Sora (400–700), ink #161b26. Two columns: the card (perspective 1200px) and a control panel; one column under 640px.

Card: a <button> at 380px max width with the ISO ratio 1.586 and 18px radius, transform-style: preserve-3d. Two absolutely-stacked faces with backface-visibility: hidden; the back is pre-rotated 180°. Clicking (or Enter/Space) toggles rotateY(180deg) over .7s cubic-bezier(.3,.7,.2,1). With a mouse the card also tilts toward the pointer (±6° Y, ±5° X).

Front: lowercase bold "kestrel" wordmark, a gold gradient EMV chip with two hairlines, a contactless icon, a mono masked number "•••• •••• •••• 4821", a footer with tiny labels ("Card holder", "Valid thru") above bold values, and two overlapping network circles (#eb5a3c and #f7a531 with multiply). Back: black magnetic stripe, a hatched signature panel with a handwritten Caveat signature and a white CVV box, and 9.5px fine print.

Finishes (radio group of swatch buttons): Obsidian metal (dark gradient + diagonal white sheen), Glacier (icy blue + top-left glow, navy ink), Ember (orange-red + warm glow, cream ink). Each face paints var(--sheen) over var(--bg).

Toggles (custom switches built on visually hidden checkboxes): "Reveal security code" swaps ••• for 318 and flips the card to the back; "Freeze card" lays a frosted blurred overlay saying "Frozen" over the front. Provide aria-pressed and a descriptive aria-label on the card that changes with the face shown.`,
  },

  {
    id: 'flip-grid-films',
    title: 'Cinema poster flip grid',
    type: 'Flip Cards',
    description: 'A grid of bold CSS-drawn film posters that flip over to reveal director, score, synopsis and showtimes.',
    tags: ['flip', 'grid', 'film', 'Swiss poster'],
    component: FlipGridFilms,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a repertory cinema "now showing" grid on light concrete grey (#eeeeec) with ink #111. Display type is Anton (uppercase, tight .92 line-height); body is Geist.

Header: "Now showing at the Rio" in Anton (28–44px), a 13.5px grey sub-line, and a square-cornered outlined button "Show all details" that flips every card (label switches to "Show posters").

Grid: repeat(auto-fill, minmax(160px, 1fr)), 14px gap. Each cell is a <button> with a 2:3 ratio, 6px radius and perspective: 1000px; inside, an inner wrapper with transform-style: preserve-3d and two faces with backface-visibility: hidden.

Front (poster): a flat two-colour composition drawn in CSS only — a big sun disc, a half-and-half split with mix-blend-mode: difference title, horizontal stripes, a thick ring, a conic checkerboard, or a skewed band — in pairs like #ff5a1f/#ffd84d, #1d3fbb/#f4e9d8, #0f5c4a/#b7f0c8, #111/#f6c445. Title sits bottom-left in Anton 22–30px with a tiny "Director · Year" line.

Back (pre-rotated 180°): near-black #121212 with the title in Anton 20px, a mono score badge in the film's accent colour, "Director · runtime", a 12.5px synopsis and a row of mono showtime chips (the first one lights up in the accent on hover).

Motion: hovering a poster pre-tilts it rotateY(−8deg) as a hint; clicking or Enter/Space flips to 180° over .75s cubic-bezier(.4,.2,.2,1). Track flipped cards in state; each button has aria-pressed and an aria-label with the title and year.`,
  },

  // ── Expandable Cards ──

  {
    id: 'flex-accordion-fitness',
    title: 'Flex-grow class panels',
    type: 'Expandable Cards',
    description: 'A horizontal accordion of photo panels that expand with flex-grow on hover, focus or tap to show class details and booking.',
    tags: ['accordion', 'flex-grow', 'fitness', 'tabs'],
    component: FlexAccordionFitness,
    stageHeight: 540,
    stageTone: 'none',
    prompt: `Create a "Tomorrow at Forge" fitness timetable as horizontally expanding photo panels on deep blue-black (#0f151c), with Big Shoulders Display 800 (uppercase, line-height .9) for titles and Geist for body copy.

Header: the title at 30–48px and a 13.5px muted line (#8e99a6) with a live "2 booked" count.

Panels: a flex row with 10px gaps, min-height 380px. Each panel is flex: 1 (min 56px), 20px radius, a full-bleed class photo (greyscale .6, brightness .6, scale 1.08 while closed) and a bottom gradient tinted with that class's accent colour (amber #f2c94c, orange #ff7a45, rose #ff4d6d, mint #7ee0c3, periwinkle #8fb3ff). The active panel grows to flex-grow: 5 over .7s cubic-bezier(.25,.9,.25,1) while its photo returns to full colour and scale 1 over 1.2s.

Closed panels show the class name rotated −90° along the bottom edge (24px) and a tiny mono start time at the top. Open panels fade those out and, after a .25s delay, slide up a details block: mono "07:00 · 50 min" in the accent, a 34–52px class name, a one-line description, a 5-segment intensity meter, "with Isla Grant", and an accent pill button "Book · 4 spots left" that toggles to "Booked ✓".

Activation: mouseenter, focus, or click. Implement as an ARIA tablist: each panel has a full-size transparent tab button (roving tabindex) and Left/Right/Up/Down arrows move focus between panels. Under 620px wide (container query) switch to a vertical stack where panels grow in height and labels sit horizontally.`,
  },

  {
    id: 'expand-detail-recipes',
    title: 'Card-to-detail shared transition',
    type: 'Expandable Cards',
    description: 'Recipe cards whose photo glides and grows into a full recipe view using a FLIP shared-element transition, and back again.',
    tags: ['FLIP', 'shared element', 'recipes', 'Web Animations'],
    component: ExpandDetailRecipes,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a recipe card grid that expands into a detail view with a shared-element (FLIP) photo transition. Palette: aubergine background #24172a, warm white cards #fffaf2, aubergine text, burnt-amber labels #a35a1c and a saffron accent #f0b54a. Headings in Gloock, body in Geist.

Grid: headline "Weeknight, but make it nice" (26–40px), then repeat(auto-fill, minmax(210px, 1fr)) with 16px gaps. Each card is a button: 18px radius, a 4:3 photo, then cuisine label (12px/600 amber), Gloock 19px name and "25 min · serves 2". Hover lifts 4px with a deep shadow.

Detail: an absolutely positioned panel covering the whole component with two columns — a sticky 4:3 hero photo (18px radius) on the left and content on the right: round close button, cuisine, Gloock 28–42px title, a facts row (Time / Serves / Per plate) between hairlines, then "You'll need" (saffron-dot list) and a numbered "Method" list. One column under 640px.

Transition: on click, measure the card photo rect, render the detail, measure the hero rect, then animate the hero with the Web Animations API from translate(dx, dy) scale(cardWidth / heroWidth) to none over 560ms cubic-bezier(.2,.8,.2,1) (counter-scale the border radius). Hide the source card (visibility: hidden) while open. Simultaneously fade the panel background in and slide the content up 24px with a 140ms delay. Closing runs the inverse (content fades in 160ms, photo flies back to the card) and then removes the panel.

Accessibility: the panel is role="dialog" aria-modal, the list behind becomes inert, Escape closes, focus moves to the close button and back to the card. Skip the animation under prefers-reduced-motion.`,
  },

  // ── Horizontal Scroll Cards ──

  {
    id: 'drag-rail-events',
    title: 'Drag-to-scroll event rail',
    type: 'Horizontal Scroll Cards',
    description: 'A poster-bright rail of event cards you can grab and drag with a mouse, swipe on touch, or step with arrow keys, with a live progress bar.',
    tags: ['drag scroll', 'scroll-snap', 'events', 'progress'],
    component: DragRailEvents,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Create a city "what's on" rail for Lisbon on a vermilion background (#ff5b2e) with near-black ink (#140c08). Display font Unbounded (600/800, tight -0.04em), body Geist.

Header: a two-line Unbounded 800 title "Lisbon in November" (28–58px, line-height .92) and a right-aligned 13.5px hint "7 picks · drag, swipe or use your arrow keys".

Rail: a flex row with 14px gaps, overflow-x auto, hidden scrollbar, scroll-snap-type x mandatory, side padding and matching scroll-padding so the first card aligns with the title. Cards: clamp(220px, 28% of width, 280px) wide, min-height 300px, warm white (#fff3e6), 22px radius, 18px padding. A 140px colour disc (yellow #ffd23f, aqua #7bdff2, mint #b4f8c8, pink #ffaec0, lilac #c3b1ff) bleeds off the top-right corner and scales 1.5× on hover while the card tilts −1.5° and lifts 4px. Content: a huge Unbounded day number (46px) beside "Thu / Nov", an outlined pill category, a 19px Unbounded title, the neighbourhood, and a dashed-rule footer with the price and a round black arrow link that rotates 45° on hover.

Dragging: on mouse pointerdown remember the position; once moved 5px, capture the pointer, add a dragging class (grabbing cursor, scroll-snap-type: none, cards ignore pointer events) and set scrollLeft directly. On release remove the class so snap settles on the nearest card, and swallow the click that ends a drag. Touch uses native scrolling.

Below, a 4px progress track (18% ink) whose ink fill scales from 8% to 100% with scroll position. The rail is a focusable region; Left/Right smooth-scroll by one card.`,
  },

  {
    id: 'sideways-scroll-houses',
    title: 'Scroll-jacked sideways gallery',
    type: 'Horizontal Scroll Cards',
    description: 'A pinned section where scrolling down slides a row of architecture project cards sideways, with a counter and progress line.',
    tags: ['sticky', 'scroll-driven', 'architecture', 'portfolio'],
    component: SidewaysScrollHouses,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build an architecture studio portfolio section where vertical scrolling moves cards horizontally. Palette: concrete grey-green #cfd3cc, ink #151715, muted #4a4f48. Typeface: Archivo with the width axis — condensed (wdth 70) 800 uppercase for headlines; Geist Mono for counters.

Structure (inside its own 560px-tall scroll container for the demo; on a real page use the window): 1) an intro screen with a small "Studio Ondo · Selected houses 2016–2025" line, a huge condensed headline "Five houses that sit lightly on the ground." (36–84px, line-height .9, max 14ch) and a "Scroll inside this panel" hint with a little mouse icon whose wheel bobs; 2) the pinned section; 3) a dark outro (#151715) with "Building something quiet?" and an outlined square button that fills on hover.

Pinned section: its height = viewport height + (track width − viewport width). Inside, a position: sticky; top: 0 full-height frame holds a mono "02 / 05" counter beside a 2px progress line (scaleX = progress) and a flex track of cards (clamp(240px, 42% of width, 460px) wide, 14–26px gaps). On scroll compute progress = (scrollTop − section.offsetTop) / (section.height − viewport height), clamp 0–1, and translate the track by −progress × overflow with translate3d. Recalculate on resize with a ResizeObserver.

Cards: square-cornered 4:3 photos that start greyscale(.5) and scale(1.06), easing to full colour and scale 1 when that card is the current one (round(progress × (n − 1))). Caption grid: condensed uppercase name (22–30px), location, and a right-aligned Year / Area mini spec list with mono labels. The scroller is focusable so keyboard users can scroll it.`,
  },

  // ── Timeline Cards ──

  {
    id: 'alternating-timeline-bikes',
    title: 'Alternating milestone timeline',
    type: 'Timeline Cards',
    description: 'A brand-history timeline with cards alternating either side of a spine that fills red as you scroll and nodes that light up on reveal.',
    tags: ['timeline', 'scroll reveal', 'brand story', 'IntersectionObserver'],
    component: AlternatingTimelineBikes,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a vertical "our story" timeline for a Porto bicycle maker on off-white (#fbfaf8) with ink #18181a, muted #55545a and racing red #d6332a. Fonts: Chivo (400/700/800) and Chivo Mono for years.

Header (centred): a red mono kicker "Vélo Norte · since 1987" and an 800-weight headline (26–42px, -0.03em, max 20ch).

Timeline: max-width 900px, centred. A 2px light spine (#e4e1dc) runs down the middle with a red fill layer that scales on the Y axis (transform-origin top) to match scroll progress. Each milestone is a 2-column grid row; cards alternate left and right of the spine with a 34px gap and a short 14px connector line. A 14px round node sits on the spine for each item (off-white with a grey ring), turning solid red and scaling 1.15 with a springy curve when its card is revealed.

Cards: white, 1px #ebe8e3 border, 14px radius, 18 × 20px padding, a faint long shadow. Content: red mono year, a 19px/700 title, a 14.5px body and an optional stat row under a dashed rule ("41 frames replaced" with the number at 22px). Cards start transparent and offset 28px toward their side, then fade and slide in (opacity .6s, transform .7s cubic-bezier(.2,.8,.2,1)) when 35% visible, via IntersectionObserver.

Responsive: under 640px move the spine to the left edge, stack every card to its right and reveal them with an upward slide instead. Respect prefers-reduced-motion by showing everything immediately. End with a centred "To be continued" line and a red link.`,
  },

  {
    id: 'horizontal-timeline-mission',
    title: 'Horizontal mission timeline',
    type: 'Timeline Cards',
    description: 'A horizontal phase timeline with a glowing progress line, a pulsing "now" node and cards that expand when selected.',
    tags: ['timeline', 'roadmap', 'stepper', 'space'],
    component: HorizontalTimelineMission,
    stageHeight: 460,
    stageTone: 'none',
    prompt: `Build a horizontal "mission log" timeline on a deep-space background: a radial gradient (#1b2246 top-right to #070a14) sprinkled with tiny 1–1.5px white radial-gradient stars. Text #eef0f8, secondary #aab1d1, amber accent #ffb648 with a coral #ff7b54 end. Fonts: Red Hat Display (400/700/800) and Red Hat Mono for dates and metrics.

Header: an amber mono kicker "Mission log · Halcyon-2 to Europa", the selected phase name as a big 24–40px/800 heading, and round prev/next buttons (1px #2c3459 border, amber on hover, disabled at the ends).

Track: a horizontally scrollable row (hidden scrollbar) of equal 210px columns. A 2px base line (#252c4d) runs from the first node's centre to the last. Two fill layers sit on it: a muted periwinkle (#6c7ab8) layer up to the current real-world phase, and an amber→coral gradient layer with a soft glow that scales to the selected phase (scaleX, .6s cubic-bezier(.3,.8,.2,1)).

Each phase is a button: a mono date, an 18px node (completed = periwinkle fill, current = amber with an expanding pulse ring, upcoming = hollow), and a frosted card (rgba(20,25,52,.72), 1px border, 14px radius) with the name, an amber mono metric, and a detail paragraph that expands from max-height 0 only on the selected card. The selected node scales 1.35, its card lifts 6px with an amber border; hover lifts other cards 3px.

Selecting a phase smooth-scrolls the row so it is centred (scrollTo, not scrollIntoView). Left/Right arrows on a focused phase move selection and focus. Use aria-current="step" and status in each aria-label.`,
  },

  // ── Hover-Reveal Cards ──

  {
    id: 'slide-up-hotels',
    title: 'Slide-up hotel details',
    type: 'Hover-Reveal Cards',
    description: 'Tall photo cards for boutique hotels whose perks, rate and booking link slide up from the caption on hover or keyboard focus.',
    tags: ['hover', 'focus-within', 'hotels', 'grid-rows trick'],
    component: SlideUpHotels,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Create a "small hotels, worth the detour" row of four tall photo cards on warm greige (#d9d6cf) with ink #1c1a17. Headings in Cormorant Garamond (500/600, italic accent words in #5b4a33); body in Geist.

Header: a 28–46px serif title with an italic second half and a small hint on the right ("Hover or tab through for rates").

Cards: 4 columns (2 under 820px, 1 under 420px via container queries), 12px gap, aspect ratio 3:4.4, 4px radius, a full-bleed hotel photo and a bottom scrim (transparent 40% → rgba(20,16,10,.78)). Resting caption: a small letter-spaced location line and the hotel name in Cormorant 22–28px, ivory text (#f8f4ec).

Reveal (on :hover and :focus-within so it also works by keyboard): the photo slowly zooms to 1.08 over 1.2s, the scrim deepens to cover more of the card, and a hidden details block opens using the grid-template-rows 0fr → 1fr trick (.55s cubic-bezier(.2,.8,.2,1)) while its inner content fades in and rises 12px with an 80ms delay. Details: outlined pill perks ("Onsen", "Kaiseki dinner"), a hairline-separated footer with "€420 / night" (price in 24px serif) and "★ 5.0 · 6 rooms", and a small square ivory "View rooms" button.

Make each card focusable (tabindex 0) with a visible ring, give images alt text, and keep the reveal purely CSS so it is instant and 60fps.`,
  },

  {
    id: 'spotlight-border-features',
    title: 'Spotlight border feature cards',
    type: 'Hover-Reveal Cards',
    description: 'Dark feature cards whose borders and surfaces light up with a soft glow that follows the cursor across the whole grid.',
    tags: ['spotlight', 'cursor glow', 'SaaS', 'dark UI'],
    component: SpotlightBorderFeatures,
    stageHeight: 520,
    stageTone: 'none',
    prompt: `Build a developer-tool feature grid with a cursor-following spotlight border. Background #0b0b0d, card surface #111114, resting border #232328, text #ededf0, body copy #9d9da8. The glow runs from apricot #ff9a62 to rose #ff4f7b. Font: Schibsted Grotesk (400–700); code in Geist Mono.

Header: an apricot 13px kicker ("Relay · background jobs for TypeScript") and a 22–34px/700 headline with -0.03em tracking.

Grid: 3 columns (2 under 760px, 1 under 480px, container queries), 10px gap, five cards with the fourth spanning two columns. Each card is a 1px "border shell" (16px radius, padding 1px) whose background is radial-gradient(260px circle at var(--x) var(--y), rgba(255,154,98,.9), rgba(255,79,123,.5) 35%, transparent 70%) layered over #232328; an inner panel (15px radius, #111114, 20px padding) covers everything except that 1px ring, so only the border lights up. The inner panel also has a ::before with a very faint 380px glow at the same point (opacity .09) so the surface warms slightly.

Pointer tracking: listen for pointermove once on the grid, store the pointer position relative to the grid, and give each card --x/--y = pointer − that card's offsetLeft/offsetTop (measure offsets with a ResizeObserver). This makes neighbouring cards glow at their nearest edges as the light passes between them. Turn the glow off on pointerleave.

Content: a 38px rounded icon tile with an apricot stroke icon, a 16.5px/600 title and a 14px description; the wide card adds a syntax-tinted code sample. Cards are focusable and show a full gradient ring on keyboard focus.`,
  },

  // ── 3D Tilt Cards ──
  {
    id: 'tilt-holo-card',
    title: 'Holographic tilt pass',
    type: '3D Tilt Cards',
    description: 'A collectible-style card that tilts toward the pointer with a moving holographic sheen.',
    tags: ['3D', 'pointer', 'perspective', 'blend modes'],
    component: TiltHoloCard,
    stageHeight: 480,
    stageTone: 'dark',
    prompt: `Build a single "holographic tilt" card centred on a deep navy radial-gradient background (#1d2350 at top fading to #0a0d1f).

Card: 300px wide, 3:4.2 aspect ratio, 22px corner radius, full-bleed landscape photo with object-fit: cover and a heavy soft shadow (0 30px 60px -20px rgba(0,0,0,.7)).

Interaction: wrap the card in a container with perspective: 900px. On pointermove, compute the pointer position as 0–1 across the card and rotate the card up to ±12° on both axes (rotateY follows X, rotateX follows inverted Y) with a 0.2s ease-out transition. On pointerleave, ease back to flat.

Holographic sheen: an overlay layer using mix-blend-mode: color-dodge at 55% opacity, combining a white radial highlight that follows the pointer and a 115° rainbow linear gradient (cyan to pink) whose background-position also follows the pointer.

Content: bottom text block lifted with translateZ(40px) over a dark gradient scrim — small "Field pass" kicker, 26px bold title "Aurora Ridge", and a 14px location line.

Use CSS custom properties (--rx, --ry, --mx, --my) driven from JavaScript; no libraries. Respect prefers-reduced-motion.`,
  },

  {
    id: 'parallax-layer-tilt',
    title: 'Layered parallax poster tilt',
    type: '3D Tilt Cards',
    description: 'A national-park poster card built from six SVG depth layers that shift at different rates while the card tilts, with pop-out type and badge.',
    tags: ['parallax', '3D tilt', 'SVG layers', 'lerp'],
    component: ParallaxLayerTilt,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Create a tilting national-park poster card with real depth. Stage: a pale glacier radial gradient (#e3eef0 → #bcd3d8). Card: 300px wide at a 320:440 ratio, 20px radius, a 6px off-white (#fdfaf3) mat border and a long navy shadow, inside a perspective: 1000px scene.

Art: six stacked full-bleed SVG layers (each oversized to 112% with inset −6% so edges never show) inside a clipped "window": a dusk sky gradient (#1d3557 → #e76f51 → #f4a261) with a few stars, a pale sun (#ffd6a5), jagged granite peaks (#6d597a) with snow caps, a rolling navy ridge (#355070), a darker foreground hill (#1d2d44) with a lake glint, and black pine silhouettes (#0d1321). Each layer has a depth value d (4, 8, 14, 22, 32, 46) and is translated by −pointer × d px, so near layers move most.

Tilt: map the pointer to −1…1 on both axes and rotate the card rotateY(x × 14deg) rotateX(−y × 14deg) with transform-style: preserve-3d. Smooth it with a requestAnimationFrame lerp (12% per frame toward the target, stopping when settled) instead of CSS transitions, and ease back to 0 on pointerleave. A soft-light white radial glare drifts with the pointer.

Pop-out elements outside the clip: the title block ("Parque Nacional" in 11px tracked caps and "Torres del Paine" in Abril Fatface 44px) at translateZ(70px), a round "Est. 1959" badge overhanging the right edge at translateZ(110px) rotated 12°, and a small "Patagonia · Chile" footer at translateZ(40px).

The card is focusable (role="img" with a descriptive label); arrow keys nudge the tilt. Disable motion under prefers-reduced-motion.`,
  },

  // ── Coverflow Cards ──

  {
    id: 'album-coverflow',
    title: 'Classic album coverflow',
    type: 'Coverflow Cards',
    description: 'An iTunes-style coverflow of album sleeves with angled side covers, floor reflections, keyboard, wheel, drag and click-to-focus.',
    tags: ['coverflow', '3D', 'music', 'keyboard'],
    component: AlbumCoverflow,
    stageHeight: 500,
    stageTone: 'none',
    prompt: `Build a classic iTunes-style coverflow on a glossy black floor (linear-gradient #000 → #0b0b0e at 58% → #1a1a20). Text #f2f2f5 with #9b9ba6 secondary, in Figtree (400/700/800).

Covers: square sleeves sized clamp(150px, 26% of width, 250px), absolutely centred inside a container with perspective: 900px. Each sleeve is flat CSS artwork (a sunset disc over two bands, concentric aqua rings, black-and-amber stripes, a periwinkle gradient, a pink conic checkerboard, sage bands, a magenta-violet glow, a grey diagonal hatch) with a 120° white sheen overlay, the album title in 800 weight and the artist at 11px in the bottom-left, and a deep 0 20px 50px shadow.

Placement from offset o = index − active: the active cover is translateZ(80px) and faces the viewer; others sit at translateX(sign(o) × (52 + |o| × 17)%) translateZ(−60 − |o| × 10 px) rotateY(−sign(o) × 62deg), dimmed to brightness .72, with z-index 100 − |o|. Transition transform .55s cubic-bezier(.2,.8,.2,1).

Reflection: under each cover, a vertically flipped copy of its artwork (scaleY(−1), 3px gap) masked with linear-gradient(to top, rgba(0,0,0,.32), transparent 45%).

Interaction: click a side cover to bring it to the centre; Left/Right, Home/End on the focused listbox; horizontal trackpad wheel steps (throttled to one per 160ms); drag/swipe more than 30px moves by round(dx / 80) covers, ignoring the click that ends a drag. Use role="listbox"/"option", aria-selected and aria-activedescendant.

Below: the current album title (18px/700) and "Artist · 2025 · 11 songs", announced politely, and a row of dots where the active one stretches into an 18px pill.`,
  },

  // ── Scroll-Stack Cards ──

  {
    id: 'scroll-stack-cases',
    title: 'Sticky stacking case studies',
    type: 'Scroll-Stack Cards',
    description: 'Large case-study cards that pin one after another as you scroll, with covered cards shrinking and dimming beneath the new one.',
    tags: ['position: sticky', 'scroll-driven', 'agency', 'case studies'],
    component: ScrollStackCases,
    stageHeight: 580,
    stageTone: 'none',
    prompt: `Build a "selected work" section where case-study cards stick and stack while scrolling. Page colour #ebebef, ink #141414, muted #61616b, font Epilogue (400–800). In the demo it lives inside its own 580px scroll container (overflow-y: auto, overscroll-behavior: contain); on a real site use the page scroll.

Header: small "Selected work · 2023–2025" kicker, a huge 800-weight headline "Four launches, stacked." (34–72px, −0.05em, line-height .92) and a hint line.

Stack: an ordered list of slots, each position: sticky with top = 22px + index × 14px (so earlier cards peek out above later ones), 360px tall with a 40px bottom margin. Each card fills its slot: 28px radius, generous padding, a two-column grid (text 1.3fr, figure 1fr; one column under 600px), transform-origin top centre and a soft upward shadow. Colour pairs per card: forest #0f3d2e with mint #7ef0b4 accent, saffron #f2b33d with rust #7a2e00, aubergine #2a1b4a with pink #ff9ec7, and black #141414 with gold #ffd25e.

Card content: client name + sector, a 22–34px/700 headline, a 14.5px body, a "Read the case study" link underlined with a 2px accent border, a giant accent metric on the right ("+38%", "3.1×", "61%", "£2.4B" at 52–110px/800, −0.06em) with a caption, and a faint "01" index top-right.

Depth effect: measure each slot's natural offset; on scroll compute how far later cards have moved over card i: t = clamp((scrollTop − (naturalTop − stickyTop)) / slotSpacing, 0, cardsAfter). Apply scale(1 − t × .05) and brightness(1 − t × .14) so covered cards recede. Recalculate on resize; the scroller is keyboard focusable.`,
  },

  // ── Image Overlay Cards ──

  {
    id: 'gradient-overlay-surf',
    title: 'Gradient-overlay surf report',
    type: 'Image Overlay Cards',
    description: 'Photo cards with per-spot colour gradients and huge italic condensed type over the image, revealing a swell forecast on hover.',
    tags: ['image overlay', 'gradient scrim', 'bento', 'sports'],
    component: GradientOverlaySurf,
    stageHeight: 500,
    stageTone: 'none',
    prompt: `Create a surf-report card mosaic on deep ocean navy (#071a24) with white type. Fonts: Barlow Condensed 800 italic uppercase for spot names, Barlow 500–700 for everything else.

Layout: a 3-column grid (1.4fr 1fr 1fr) with two rows of at least 220px and 10px gaps. The first card (Nazaré) spans both rows; the fourth spans two columns. Under 720px use 2 columns with the feature and fourth card full-width; under 440px one column (container queries). Cards: 22px radius, full-bleed photo, each card is a link.

Overlay: every card has its own brand colour (--from: petrol #0b4f6c, burnt orange #c2521b, indigo #3a2d6b, teal #0e6b5c). Paint a bottom-up gradient from that colour through a 55% mix at 30% to transparent at 62%, plus a light top darkening for the header. A second overlay (::after) of the same colour fades in to .75 on hover/focus while the photo slowly zooms to 1.07 over 1.4s.

Typography over the image: top row with a frosted pill rating ("Epic", "Firing") and a tracked country label; bottom block with the spot name at 34–60px (48–104px on the feature card), line-height .82, whose letter-spacing opens from −0.01em to .02em on hover; a stats row (Swell "6.4 m · 18 s", Wind "E 9 km/h") with tiny labels; and a seven-bar forecast chart that grows from height 0 on hover, each bar scaling up from the bottom with a 40ms stagger.

Keep text readable at every size, add alt text per photo, a visible white focus ring, and a role="img" label on the forecast chart.`,
  },

  {
    id: 'duotone-speakers',
    title: 'Duotone speaker cards',
    type: 'Image Overlay Cards',
    description: 'Conference speaker portraits rendered as two-colour duotones with blend modes, switchable palettes and a full-colour reveal on hover.',
    tags: ['duotone', 'blend modes', 'conference', 'palette switch'],
    component: DuotoneSpeakers,
    stageHeight: 560,
    stageTone: 'none',
    prompt: `Build a design-conference speaker grid with CSS duotone portraits. Page #f4f4f1, ink #121212, muted #5c5c58. Headings in Krona One (tight −0.04em), body in Geist, slots in Geist Mono.

Header: kicker "Offscreen · Berlin · 12–13 March 2026", a 30–56px "Speakers" title, and a radio group of palette pills on the right — each pill shows three overlapping split-colour dots previewing its pairs plus a name (Riso, Mint, Heat); the selected pill gets a 2px ink ring.

Duotone technique (no canvas, no SVG filters): the photo wrapper (4:5, 6px radius, isolation: isolate) has background = the light colour; the <img> uses filter: grayscale(1) contrast(1.15) brightness(1.05) and mix-blend-mode: multiply; a ::after layer filled with the dark colour uses mix-blend-mode: lighten. Blacks become the dark colour and whites the light colour. Palettes, cycling across cards: Riso (#13315c/#ff7f51, #1d1a4f/#f7c8d8, #0f3b3a/#ffd166), Mint (#073b3a/#9ff0c8, #0c2d48/#a6e3ff, #29204a/#c7f9cc), Heat (#3d0c3a/#ffc857, #5b0e14/#ff9f6b, #1f1235/#ff6b9a). Switching palettes cross-fades the background and overlay colours over .6s.

Hover/focus: remove the filter and blend, fade the overlay out and scale the photo 1.04 so the real full-colour portrait appears.

Grid: repeat(auto-fill, minmax(200px, 1fr)), 14px gap. Under each portrait: mono slot ("Thu 10:00"), the name in Krona One 16px, role/company and the talk title in quotes. Cards are focusable with a visible ring around the photo.`,
  },
];
