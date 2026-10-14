import { DesignExample } from '../../core/example.model';
import { LiquidCanvasMetaballs } from './demos/liquid-canvas-metaballs';
import { LiquidDisplaceType } from './demos/liquid-displace-type';
import { LiquidGooeyCursor } from './demos/liquid-gooey-cursor';
import { LiquidMorphBlob } from './demos/liquid-morph-blob';
import { FluidClampType } from './demos/fluid-clamp-type';
import { FluidFlowingGradient } from './demos/fluid-flowing-gradient';
import { FluidInkFlow } from './demos/fluid-ink-flow';
import { FluidReflowLayout } from './demos/fluid-reflow-layout';
import { JumbotronClassic } from './demos/jumbotron-classic';
import { JumbotronPhoto } from './demos/jumbotron-photo';
import { JumbotronOversized } from './demos/jumbotron-oversized';
import { JumbotronStats } from './demos/jumbotron-stats';
import { SplitImage } from './demos/split-image';
import { SplitDiagonal } from './demos/split-diagonal';
import { SplitAppMockup } from './demos/split-app-mockup';
import { MeshBlobs } from './demos/mesh-blobs';
import { MeshAurora } from './demos/mesh-aurora';
import { MeshConicGrain } from './demos/mesh-conic-grain';
import { KineticRotatingWords } from './demos/kinetic-rotating-words';
import { KineticMarquee } from './demos/kinetic-marquee';
import { KineticPointerLetters } from './demos/kinetic-pointer-letters';
import { GlassPanels } from './demos/glass-panels';
import { GlassPointerLight } from './demos/glass-pointer-light';
import { InteractiveSpotlight } from './demos/interactive-spotlight';
import { InteractiveConstellation } from './demos/interactive-constellation';
import { Interactive3dTilt } from './demos/interactive-3d-tilt';
import { InteractiveTileGrid } from './demos/interactive-tile-grid';

export const HERO_EXAMPLES: DesignExample[] = [
  {
    id: 'liquid-gooey-cursor',
    title: 'Gooey trail AI hero',
    type: 'Liquid Hero',
    description: 'A dark product hero where a chain of molten blobs follows the pointer and melts into a resting pool through an SVG goo filter.',
    tags: ['SVG filter', 'metaballs', 'pointer', 'AI startup'],
    component: LiquidGooeyCursor,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a full-screen hero for "Murmur", an AI meeting-notes startup. Background: radial gradient from #12302d at 75% 60% to #071312. Text #fdf3e7. Headline font Syne 800, body Geist.

Layout: top nav (blob logo + "murmur" wordmark, links Product / Integrations / Pricing / Changelog pushed right, outlined pill "Start free"). Below, a left-aligned copy block max 640px: a small glassy pill "New: live notes in Google Meet" with a yellow dot, a three-line headline "Every meeting, boiled down to what matters." at clamp(33px, 7.4cqi, 76px), line-height .98, letter-spacing -0.035em, the last line in #ffb441; a 44ch sub-line at 78% opacity; CTAs "Try it on your next call" (solid #ff6a38 pill) and "Watch the 2-min demo" (translucent pill); a 13px proof line.

Signature visual: an absolutely positioned layer behind the copy filtered by an inline SVG goo filter (feGaussianBlur stdDeviation 16, then feColorMatrix alpha row "0 0 0 24 -10", then feComposite atop SourceGraphic). Inside it, three pink (#ff4f8b family) "pool" circles (radius 108/64/52px) bob slowly around 76% / 58% of the hero, plus a chain of eight circles (radius 74 down to 16px, coloured #ff5a36 through #ffd843). In a requestAnimationFrame loop the head of the chain eases toward the pointer (factor .14) and each follower eases toward the one in front (.26), so the trail stretches, then melts back into the pool. With no pointer the head orbits the pool on a slow Lissajous path.

Behaviour: pause the loop when off-screen; with prefers-reduced-motion render the blobs still. Below 680px container width hide the links behind a burger that opens a cream dropdown, and shrink blobs by 30%.

Touch: listen to pointerdown and pointermove (not mouse events) and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; a finger drag steers the trail, and on pointerup / pointercancel the head returns to its idle orbit so the effect is always visible without a cursor.`,
  },
  {
    id: 'liquid-displace-type',
    title: 'Rippling skincare hero',
    type: 'Liquid Hero',
    description: 'A calm skincare launch hero whose product photo and accent word ripple like water through feTurbulence and feDisplacementMap.',
    tags: ['feTurbulence', 'displacement', 'beauty', 'serif'],
    component: LiquidDisplaceType,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a skincare hero for "Maré" launching Tidal Serum. Background: vertical gradient #e3f0ec to #cfe4df. Ink #0e2a33, accent #1f6f78, secondary text #33545b. Fonts: Cormorant Garamond (500/600, italic for the logo and accent) and Jost 300/400.

Nav: italic "Maré" logo, centred links Shop / Rituals / Ingredients / Journal with an underline that scales in from the left on hover, and "Bag" with a round count badge. A hairline border sits under the nav.

Body: two columns (1.1fr / .9fr). Left: a small "No. 04 — Tidal Serum" line, a headline "Skin that drinks like the tide." at clamp(40px, 8cqi, 96px), line-height .92, where "the tide." is italic teal; a light 40ch sub-line; square-cornered buttons "Shop Tidal Serum · €48" (filled ink) and "Find your ritual" (1px outline); a star rating line. Right: a 4:5 arched frame (border-radius 999px 999px 18px 18px) with the product photo and a caption underneath.

Liquid effect: define two SVG filters. The photo wrapper uses feTurbulence fractalNoise (baseFrequency about 0.011 0.018, 2 octaves) into feDisplacementMap; the accent word uses a finer turbulence with a small scale. In a requestAnimationFrame loop gently oscillate both baseFrequency values with sine waves so the water keeps moving. Keep an "energy" value: pointer movement over the photo adds to it in proportion to speed, a click or Enter sets it to 1, and it decays each frame. Map energy to displacement scale (10–80 for the photo, 2.5–11.5 for the text).

Pause the loop off-screen and freeze it for reduced motion. Below 720px stack the columns with a smaller arch on top, and swap the links for a "Menu" pill opening a dark dropdown.

Touch: pointerdown on the photo triggers the splash and resets the speed reference, a finger drag stirs it, and the photo uses touch-action: pan-y pinch-zoom so the page still scrolls vertically.`,
  },
  {
    id: 'liquid-canvas-metaballs',
    title: 'Lava-lamp festival poster',
    type: 'Liquid Hero',
    description: 'A loud gig-poster hero where canvas metaballs drift like a lava lamp and swell around the pointer.',
    tags: ['canvas', 'metaballs', 'festival', 'poster'],
    component: LiquidCanvasMetaballs,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a music-festival hero for "Lowtide 26" (Walpole Bay, Margate, 7–9 August 2026) styled like a screen-printed poster. Background vermilion #f2421b, ink #2a0a06, blob cream #ffe9b8 with sun-yellow #ffc23a cores. Fonts: Bowlby One for logo and headline, Space Mono 400/700 for everything else.

Nav: "Lowtide" wordmark with a small superscript 26, lowercase links Lineup / Tickets / Getting there / FAQ, and a dark pill "Buy tickets". Copy: a bold mono date line, a huge three-line headline "Three days of sound by the sea." at clamp(38px, 10.5cqi, 128px), line-height .88; underneath, CTAs "Weekend pass · £149" (dark pill) and "See the lineup" (2px outlined pill) that lift and tilt -1° on hover, with a right-aligned headliner list.

Signature: a full-bleed canvas behind the copy renders metaballs. Keep nine balls (radius 40–110px scaled by the stage size) drifting with slow velocities and bouncing inside the right three-quarters of the hero. Each frame, evaluate the field sum(r² / d²) on a 5px grid into a small ImageData, set alpha with a soft threshold (smoothstep between 0.92 and 1.08) and blend towards yellow where the field exceeds 2.3, then draw the small canvas upscaled with smoothing so edges stay soft. While the pointer is over the hero, an extra ball grows to 15% of the shorter side and follows it, so you can pull blobs apart and merge them.

Handle devicePixelRatio, resize via ResizeObserver, pause when off-screen, and draw one still frame for reduced motion. Below 640px collapse the links into a "Menu" pill opening a dark sheet of big Bowlby links.

Touch: use pointer events, set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; pointerdown spawns the pointer ball under the finger, a sideways drag pulls blobs apart, and it shrinks away on pointerup / pointercancel. The drifting balls keep the lava moving with no input.`,
  },
  {
    id: 'liquid-morph-blob',
    title: 'Breathing blob yoga hero',
    type: 'Liquid Hero',
    description: 'A soft wellness hero built around a morphing border-radius blob that also works as a guided breathing timer.',
    tags: ['border-radius morph', 'wellness', 'app', 'breathing'],
    component: LiquidMorphBlob,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a hero for "ebb", a yoga and breathwork app. Background: radial gradient #ffe4d6 → #f6d3c8 → #efc2b9 centred at 78% 55%. Ink #3b1f2b, accent rose #f45b69 and #c43e5a. Fonts: Fraunces (opsz 144, SOFT 100, WONK 1 on italics) for logo and headline, Figtree 400/600 for body.

Nav: a small blob-shaped rose mark plus "ebb", links Practices / Teachers / Pricing, dark pill "Get the app". Body in two columns: left, the headline "Slow down by one breath." at clamp(42px, 7.2cqi, 86px), line-height .98, with "one breath." italic rose; a 40ch sub-line; buttons "Start 14 days free" (rose pill) and "Breathe with the blob" (translucent white pill) that scale to 1.04 on hover with a springy curve; a ratings line.

Right: a 420px square "orb" built from three stacked layers. Layer one is a radial gradient (#ffb38a → #f45b69 → #a33b6b) with a deep rose shadow; layer two is a screen-blended peach highlight; layer three a plum inner shadow. Each runs a 9–14s keyframe animation that morphs an eight-value border-radius (e.g. 62% 38% 55% 45% / 48% 60% 40% 52%) while rotating, at different speeds and directions so the outline never repeats.

Breathing: cycle "Breathe in" (4s, scale 1.14), "Hold" (3s) and "Let it go" (6s, scale .84). Transition the orb transform for the length of each phase with cubic-bezier(.45,.05,.35,1), and show the cue in italic white, announced via aria-live. The secondary button pauses and resumes (aria-pressed). Stop the timer off-screen; start paused for reduced motion. Below 680px stack the orb above the copy and use a round burger menu.`,
  },
  {
    id: 'fluid-clamp-type',
    title: 'Fluid type architecture studio',
    type: 'Fluid Hero',
    description: 'An architecture-studio hero where every size is a clamp() of container units, with a live readout of the headline size.',
    tags: ['clamp()', 'container queries', 'cqi', 'architecture'],
    component: FluidClampType,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a hero for "Halden & Voss", a 14-person architecture practice in Rotterdam. Background pale concrete #e7e8e5 with a faint drafting grid (two 1px linear gradients at rgba(21,23,21,.045), cell size 2.5cqi). Ink #151715, single accent cobalt #1f3fd1. Fonts: Instrument Serif for logo and headline, Inter Tight for UI, JetBrains Mono for annotations.

Make the hero a size container (container-type: inline-size) and size everything with clamp() and cqi units so it scales smoothly from 340px to full screen: nav padding clamp(16px, 4cqi, 56px), links clamp(13px, 1.3cqi, 15px), headline clamp(40px, 10.4cqi, 150px) with line-height .9 and letter-spacing -0.035em, sub-line clamp(15px, 1.6cqi, 19px).

Nav: "Halden & Voss" with a cobalt italic ampersand, links Work / Practice / Writing / Contact, and an underlined "Start a project" link. Above the headline, draw a dimension line in cobalt mono: hairlines with end ticks and a centred readout "84px · clamp(40px, 10.4cqi, 150px) · frame 812px" that updates live from a ResizeObserver reading the headline's computed font size and the hero width. Headline: "We draw buildings that age well." with "age well." in cobalt.

Below, a two-column grid (1fr / 1.25fr): left a 36ch sub-line plus square buttons "See selected work" (ink, turns cobalt on hover) and "Our approach" (1px inset outline that fills on hover); right an inline SVG south elevation of a school drawn in 1.5px ink lines, with dashed cobalt grid lines, tinted windows, a 48.6 m dimension and a caption.

Below 660px of container width, stack the grid and swap the links for a square burger opening a full-width ink sheet with large serif links.`,
  },
  {
    id: 'fluid-flowing-gradient',
    title: 'Flowing gradient fintech hero',
    type: 'Fluid Hero',
    description: 'A fintech hero whose pastel background flows endlessly by animating registered @property angles and positions.',
    tags: ['@property', 'animated gradient', 'fintech', 'CSS only'],
    component: FluidFlowingGradient,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a hero for "Tally", a UK business bank account. Ink #0b2b26, money green #0f7a63, secondary text #2f4f49. Font: Plus Jakarta Sans 400–800, headline 800 with -0.045em tracking.

Background: register seven custom properties with @property (one <angle> --a and six <percentage> positions) so they can be interpolated. Paint the hero with three soft radial gradients (mint rgba(140,230,196,.85), butter rgba(255,214,112,.75), peach rgba(255,160,128,.6)), each positioned at var(--xN) var(--yN) and fading to transparent at 70%, over a conic-gradient(from var(--a) at 65% 45%) cycling #f3f8f1, #d6f2e7, #fdf0cf, #ffe0d3, #e7f1fb. Animate the positions with a 26s ease-in-out alternate keyframe set (four stops that move each blob across the hero) and the angle with a 48s linear spin, so the colour flows slowly without ever looping visibly. Pause both animations when the hero is off-screen.

Nav: square ink "t" logo tile + "Tally", pill-hover links Accounts / Cards / Invoicing / Pricing, "Log in" and a 12px-radius ink button "Open an account".

Body (two columns): a white translucent badge "4.10% AER on savings pots", headline "Money that keeps up with your business." (max 13ch, clamp(36px, 6.2cqi, 72px)), sub-line, buttons "Open an account in 8 minutes" (ink with a deep shadow, lifts 2px) and "Compare plans" (white 70%), and a proof line. Right: a debit card tilted -8° whose background is the same conic gradient in deep greens spinning in 18s, overlapped by a frosted white balance panel showing "£24,860.12 available" and two transactions.

Below 760px stack everything and use a frosted burger menu; reduced motion freezes the flow.`,
  },
  {
    id: 'fluid-ink-flow',
    title: 'Ink flow film studio',
    type: 'Fluid Hero',
    description: 'A cinematic production-company hero where thousands of canvas particles trace a drifting flow field like smoke or ink in water.',
    tags: ['canvas', 'flow field', 'particles', 'film'],
    component: FluidInkFlow,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a hero for "Nightjar Pictures", an independent film production company in Glasgow. Background #0c0b10, text #ece8df, amber accent #e8a33d, pale gold italic #f3d9a8. Fonts: Bodoni Moda (opsz axis, 400–600, italics) for logo and headline, Geist for UI.

Canvas: a full-bleed canvas behind everything, with a radial vignette over the left side so the copy stays readable. Spawn about one particle per 420px² (max 1400). Each frame, first fill the canvas with rgba(12,11,16,.055) so old strokes fade into smoky trails, then move every particle along a flow field whose angle is (sin(x·0.0042 + t·0.00021) + cos(y·0.0051 − t·0.00017) + sin((x+y)·0.0017)) × 1.25, plus a slight rightward drift. Draw each move as a 0.9px round-capped line: 88% of particles in rgba(236,228,214,.32), 12% in amber rgba(232,163,61,.55), batching each colour into one path. Respawn particles randomly when their life runs out or they leave the canvas. Near the pointer, add a tangential force (Gaussian falloff, sigma about 65px) so moving the mouse stirs a vortex into the ink.

Content: nav with italic "Nightjar" plus tracked-out "PICTURES", links Films / Commercials / Directors / Contact. Copy block: "Glasgow · Est. 2011" in amber, headline "Stories shot after dark." at clamp(46px, 9cqi, 112px) with an italic gold second line, a 42ch sub-line, a square cream button with a play icon "Watch the reel 2:14" that turns amber on hover, and an outlined "Our films". A hairline footer row shows "In post — The Low Road, dir. Ailsa Mackay" and a festival selection in amber.

Handle DPR (cap 1.5), ResizeObserver, pause off-screen, and render a pre-computed still for reduced motion. Below 620px the links become an underlined "Menu" toggle.

Touch: drive the vortex from pointerdown / pointermove and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; release it on pointerup / pointercancel. The flow field keeps moving on its own.`,
  },
  {
    id: 'fluid-reflow-layout',
    title: 'Reflowing night-train hero',
    type: 'Fluid Hero',
    description: 'A sleeper-train hero that reflows from stacked to split to three columns with container queries; drag the brass handle to watch it adapt.',
    tags: ['container queries', 'reflow', 'resizable', 'travel'],
    component: FluidReflowLayout,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a travel hero for "Wayfarer", a European night-train booking site, whose layout reflows with its own width rather than the viewport. Palette: midnight teal #0f2433 (radial highlight #1a3a4c top-right), cream #f3ead8, sleeper burgundy #8c1c3a, brass #d9a441, blush #e8b6c2. Fonts: DM Serif Display for logo, headline and major stations; DM Sans 400/500/700 for UI.

Wrap the hero in a frame with container-type: inline-size. Nav: brass moon logo + "Wayfarer", links Routes / Sleeper cabins / Interrail / Help, and a brass button "Book a cabin". Copy: kicker "Night trains · 14 cities · 2026 timetable", headline "Fall asleep in Paris. Wake up in Vienna." (clamp(34px, 6.6cqi, 74px), second line blush), sub-line about €129 private cabins, buttons "Find a night train" (burgundy) and "See the cabins" (inset outline).

Visual: a cream ticket card (14px radius, punched half-circle notches on both sides, dashed dividers) showing NJ 469, car and cabin, a vertical burgundy route line with four stops and times (Paris Est 19:58 → Wien Hbf 09:38, major stops in serif with filled dots) and a price of €258.

Reflow rules: below 640px the copy and ticket stack in one column; from 640px they split 1.2fr / 1fr and the ticket tilts 2° (transition .5s); from 1080px a third narrow "Included" column with a brass rule appears. Below 700px the links collapse to a burger with a cream dropdown.

Demo control: a brass pill handle on the frame's right edge (role="slider" with aria values) that you drag with pointer capture to resize the frame between 320px and full width; arrow keys step 40px (Shift 120px), Home/End jump to the limits. A small mono readout shows the current mode and width.

Touch: the handle uses touch-action: pan-y pinch-zoom with setPointerCapture, handles pointercancel, and has an invisible ::before hit area extending it to about 46×80px.`,
  },
  {
    id: 'jumbotron-classic',
    title: 'Classic jumbotron, done properly',
    type: 'Jumbotron',
    description: 'The familiar rounded jumbotron panel (display heading, lead, rule, buttons) refined for a library charity, with a live appeal bar and a clickable bookshelf.',
    tags: ['jumbotron', 'nonprofit', 'progress bar', 'serif'],
    component: JumbotronClassic,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a classic Bootstrap-style jumbotron hero, but premium, for "Open Shelf", a charity that builds free little libraries. Page background #fbfaf6, white nav bar with a 1px #e4e6df bottom border. Colours: library green #1d4d3a (hover #256148), mustard #e3b23c, ink #142019, muted #5c6d63. Fonts: Source Serif 4 (opsz) for logo and headline, Public Sans 300/400/600 for text.

Nav: three-book logo + "Open Shelf", links Find a shelf / Start one / Stories / About, and an outlined green "Donate" button that fills on hover.

Jumbotron: a rounded 18px panel inset from the page edges, with a vertical gradient #eef3ee → #e6eee7, a 1px #dbe5dc border, an inner white top highlight and generous padding clamp(26px, 5cqi, 64px). Two columns (1.25fr / .75fr). Left: small charity number line, display heading "A library on every corner." (clamp(36px, 6.4cqi, 72px), weight 600, -0.025em), a light 20px lead paragraph with real numbers, an <hr>, then an appeal block: "Winter book drive · £31,420 of £40,000" above a 10px rounded progress bar (role="progressbar") whose green gradient fill animates from 0 to 78.5% over 1.6s the first time the panel scrolls into view, plus a note about £15 buying twelve books. Buttons: "Donate £15" (solid green with a crisp 1px bottom edge and soft shadow) and "Map the shelves" (white with inset border).

Right: a bookshelf of eight spine buttons on a 10px wooden ledge (#8a6a43), each a different colour and height with a subtle cylindrical gradient and the title set vertically in serif. Hover or click lifts a spine 14px with a springy curve and outlines it in mustard; an aria-live caption above names the book, author and borrow count.

Below 760px stack the columns, shorten the spines and collapse the nav links into a "Menu" button with a white dropdown.

Touch: book spines toggle a raised "picked" state on tap; the hover lift only applies under @media (hover: hover) so it never sticks on phones.`,
  },
  {
    id: 'jumbotron-photo',
    title: 'Full-bleed photo jumbotron',
    type: 'Jumbotron',
    description: 'A centred, full-bleed photo jumbotron for an observatory, with a duotone overlay, drifting stars and a live conditions strip.',
    tags: ['full-bleed', 'photo overlay', 'centred', 'tourism'],
    component: JumbotronPhoto,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a full-bleed photo jumbotron for "Mauna Sol Observatory" night tours. Base colour #070b16, text #f2f0ea, warm accent #f5b25c, live-dot green #7be0a0. Fonts: Big Shoulders Display 700/800 uppercase for logo, headline and numbers; Albert Sans 400–600 for everything else.

Background stack (bottom to top): a cover photo converted to a moody plate with filter: grayscale(1) contrast(1.15) brightness(.7), fading in over 1.2s once loaded and slowly zooming from scale 1.12 to 1.02 with a slight pan over 32s (alternate); a tint layer combining a vertical scrim (rgba(7,11,22,.85) at the top, lighter in the middle, solid #070b16 at the bottom) with a 120° wash from rgba(25,38,92,.75) to rgba(176,72,40,.35), which makes any photo read as dusk; and a star layer of tiny radial-gradient dots on a 320px tile drifting downward over 120s. Pause the animations when off-screen.

Nav: a telescope-dome logo with "Mauna Sol" over tracked "OBSERVATORY", links Night tours / Telescopes / Visit / Members, and a frosted pill "Book a tour".

Centred content: a dark pill "Tonight · seeing 0.6″ · moon 12%" with a pinging green dot, the headline "See the sky the way astronomers do." at clamp(36px, 9.6cqi, 124px), line-height .88 with a soft text shadow, a 46ch sub-line, and buttons "Book tonight · $189" (amber pill, lifts on hover) and "Plan your visit" (outlined translucent pill).

Bottom strip: a four-column definition list above a hairline (Sunset 18:41, Departs 17:30, Summit −2 °C, Seats left 6 of 14) with vertical dividers; it becomes 2×2 under 680px, where the links also collapse into a round burger with a blurred dark sheet.`,
  },
  {
    id: 'jumbotron-oversized',
    title: 'Oversized type sneaker drop',
    type: 'Jumbotron',
    description: 'A sneaker-drop jumbotron where width-filling condensed type sandwiches the product, with a live countdown and size picker.',
    tags: ['oversized type', 'variable width', 'countdown', 'e-commerce'],
    component: JumbotronOversized,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build an oversized-type jumbotron for a sneaker drop: "KOTO Runner 02", drop 014, Friday 10:00, 1,200 pairs. Background bone #ecebe6, ink #111, signal red #ff3b1f. Font: Archivo variable (wdth 62–125, wght 500–900) only, using font-stretch to swing between ultra-condensed and extended cuts.

Nav: an extended 900-weight "KOTO" logo, uppercase links Run / Trail / Archive / Stores, and a pill outlined "Cart 0" (2px ink border).

Stage: the word "RUNNER" set at font-size 25cqi, font-stretch 62%, weight 900, line-height .78, centred so it fills the full width. A circular product photo (46cqi wide, max 520px) sits on top of the word, rotated -12° with a deep shadow, bobbing gently over 5s (rotating to -9° and rising 4%). In front of the photo, "02" in the extended cut at 15cqi is drawn as an outline only (transparent fill, -webkit-text-stroke max(2px, .3cqi) red), overlapping the bottom-right of the shoe. A small drop line sits top-left.

Bottom bar above a 2px ink rule, wrapping on small screens: a live countdown to the next Friday 10:00 (days, hours, minutes, seconds in 36px condensed tabular numerals with tiny uppercase labels, updated every second only while on screen, role="timer"); a radiogroup of size buttons (US 7–12, 40×36px, 8px radius, selected = solid ink); and CTAs "Notify me · US 9" (red pill that turns ink on hover; the label follows the chosen size) and "€160 · Specs" (outlined).

Under 700px of container width, enlarge the shoe to 58cqi and the "02" to 20cqi, and swap the nav for a "Menu" pill that opens a black sheet of huge condensed links.

Touch: on coarse pointers make the size buttons 42×42px.`,
  },
  {
    id: 'jumbotron-stats',
    title: 'Security jumbotron with stats',
    type: 'Jumbotron',
    description: 'A centred cybersecurity jumbotron with a radar sweep, count-up proof stats and a scrolling customer wordmark strip.',
    tags: ['stats', 'count-up', 'logo marquee', 'B2B'],
    component: JumbotronStats,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Create a B2B jumbotron for "Bastion", a zero-trust security platform. Background #f6f7f9 with a 22px dot grid (1px rgba(15,23,32,.12) dots). Ink #0f1720, body #3b4654, muted #5b6676, borders #e3e6eb / #cfd5dd, accent safety orange #ff6b1a. Fonts: IBM Plex Sans 300–700 and IBM Plex Mono 500/600 for numbers and badges. Corners stay tight (3–8px).

Nav: a sticky, blurred translucent bar with a shield-and-tick logo, links Platform / Solutions / Research / Pricing, "Sign in", and a dark "Get a demo" button that turns orange on hover.

Backdrop: behind the headline, a radar made of concentric 1px orange rings every 60px (repeating-radial-gradient) masked to fade at the edges, with a conic-gradient wedge (orange 22% to transparent over 18%) rotating once every 6s.

Centre column: three mono certification badges (SOC 2 Type II, ISO 27001, FedRAMP Moderate) as small white boxes; headline "Assume breach. Stop it anyway." at clamp(34px, 7cqi, 84px), weight 600, -0.035em, second line orange; a 54ch sub-line; buttons "Book a 30-min threat review" (orange) and "Read the 2026 breach report" (white with inset border).

Stats: a white four-column bordered panel with vertical dividers. The first time the hero is 25% visible, count each figure up over 1.8s with an ease-out-quart curve, formatted with fixed decimals: 4.2M threats blocked every day, 38 s median time to contain, 99.995% uptime, 1,840 security teams. Reduced motion shows the final values.

Logo strip: customer wordmarks in four different typographic treatments, duplicated and scrolled in a 36s linear marquee with faded edges, paused on hover and when off-screen. Below 760px the stats become 2×2 and the nav collapses to a burger with a full-width dropdown.

Touch: only pause the logo marquee on hover inside @media (hover: hover), so a tap never leaves it frozen.`,
  },
  {
    id: 'split-image',
    title: 'Coffee roaster 50/50 split',
    type: 'Split Hero',
    description: 'A bold 50/50 split for a coffee roaster: saffron copy panel on one side, a full-height photo with a spinning badge and product card on the other.',
    tags: ['50/50', 'photo', 'food & drink', 'badge'],
    component: SplitImage,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a 50/50 split hero for "Okonkwo & Daughters", a coffee roaster in Peckham. Left panel saffron #f5b700, ink #1d130c, warm brown text #3d2a1c, cream cards #fff4d6. Fonts: Gloock (serif display) for logo, headline and product names; Onest 400–700 for UI.

Left half: a nav with "Okonkwo & Daughters" (italic ampersand part) and links Shop coffee / Subscriptions / Wholesale that get a 1.5px underline on hover. Vertically centred copy: headline "Roasted on Tuesday. In your cup by Thursday." (max 12ch, clamp(36px, 5.6cqi, 72px), line-height 1.02), a 40ch sub-line, a pill segmented control (Whole bean / Filter / Espresso, role="radiogroup") whose selected segment is solid ink with saffron text, then a dark pill CTA that updates with the choice ("Subscribe · filter · from £9.50") and an underlined text link "Shop single origins".

Right half: a full-height cover photo with a slight sepia warm grade and a dark gradient wash, zooming to 1.04 over 1.2s on hover. Top-right a cream "Basket 0" pill with a saffron count dot. Bottom-right a cream product card with an 18px radius and a deep shadow: "This month's lot", "Konga, Yirgacheffe" in serif, processing/altitude/tasting notes and "£12.80 / 250 g".

Straddling the seam between the halves, a 120px dark circular badge with "FRESH EVERY TUESDAY · PECKHAM SE15" on an SVG textPath, rotating once every 18s while the bean icon in the middle counter-rotates.

Below 760px stack the halves (photo below, min 300px tall), move the badge to straddle the top edge of the photo, and replace the links with an outlined "Menu" pill opening a dark dropdown.

Touch: give the grind segments a 40px minimum height on coarse pointers.`,
  },
  {
    id: 'split-diagonal',
    title: 'Diagonal split law firm',
    type: 'Split Hero',
    description: 'A law-firm hero split by a clip-path diagonal that leans toward the pointer, with the copy on navy and a ledger of matters on stone.',
    tags: ['clip-path', 'diagonal', 'professional services', 'serif'],
    component: SplitDiagonal,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Create a diagonal split hero for "Achterberg Lund LLP", a law firm in Amsterdam, Oslo and London. Colours: stone #dfe1e3 page, navy panel #0e1a2b with a radial lift #1b2c45 from the bottom-left, brass #b8925a and light brass #d7b98a, light text #eef0f2. Fonts: EB Garamond 400/500 (with italic) for logo, headline and figures; Work Sans 300–600 for UI.

Diagonal: an absolutely positioned navy layer behind everything clipped with clip-path: polygon(0 0, 64% 0, 50% 100%, 0 100%). Expose a --skew variable from -1 to 1 based on the pointer's horizontal position and add ±3% to the top and bottom points in opposite directions, so the cut leans toward the cursor, with a .6s cubic-bezier(.2,.8,.2,1) transition. Reset on pointer leave.

Nav: "Achterberg Lund" in Garamond with a tracked brass "LLP", links Practice areas / People / Insights / Offices and an outlined "Speak to a partner" button. Because the nav crosses the diagonal, set the links and button to #eef0f2 with mix-blend-mode: difference so they stay readable over both navy and stone (the nav itself must not create a stacking context).

Left copy on navy: brass "Amsterdam · Oslo · London", headline "Counsel for the decisions you only make once." (clamp(38px, 6cqi, 74px), "once." in light brass), a light 42ch sub-line, square buttons "Speak to a partner" (brass) and "Our practice areas" (thin outline).

Right on stone: "Selected matters, 2025" over a 2px navy rule, then a numbered list (01, 02, 03 from CSS counters) of big Garamond figures (€1.4bn, Won, 312) with one-line descriptions; rows nudge 6px right on hover. A small Chambers ranking line closes it.

Below 760px the cut turns horizontal (navy top, sloped bottom edge), the columns stack and the links collapse into a burger with a stone dropdown of serif links.

Touch: read the skew from pointerdown / pointermove, set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page, and ease back to 0 on pointerup / pointercancel.`,
  },
  {
    id: 'split-app-mockup',
    title: 'Split hero with a working CSS phone',
    type: 'Split Hero',
    description: 'A banking-app hero with copy on the left and a phone built entirely in CSS on the right whose tabs, savings spaces and card freeze switch genuinely work.',
    tags: ['app mockup', 'CSS phone', 'fintech', 'tabs'],
    component: SplitAppMockup,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Build a split hero for "pebble", a calm, crypto-free bank. Background #e8ecef with a pink radial glow (#f6dbe4) behind the phone. Ink #111827, greys #4b5563 / #6b7280 / #9ca3af, accent pink #ff5c8a, yellow #ffd166, positive green #0f9d58. Font: Outfit 400–700, headline 600 with -0.045em tracking.

Nav: a pebble-shaped ink blob + "pebble", grey links Personal / Joint / Savings / Help, dark pill "Get the app". Left column: headline "A bank account that's just a bank account." (max 12ch, clamp(36px, 6cqi, 70px), last two words pink), a sub-line about no tokens or trading, pills "Open in 6 minutes" (pink with a pink glow shadow) and "How we're regulated" (white), and a small licensing line.

Right column: a 268×520px phone drawn in CSS (44px radius, 9px ink bezel, status bar with a pill notch, rotated -3°, big soft shadow) with a dark segmented tab bar at the bottom (Home / Spaces / Card, aria-pressed). Home shows "€3,482.60" with a pink SVG sparkline whose stroke draws in via stroke-dashoffset, and four transactions with pastel initial tiles; incoming amounts are green. Spaces shows three savings goals with rounded progress bars (Rent 1,200/1,200, Lisbon in May 640/1,500, Rainy day 2,100/5,000). Card shows a yellow-to-pink gradient card, a "Freeze card" row with a role="switch" toggle whose knob springs across and greys out the card with a frosted "Frozen" label, and an ATM limit line.

Whenever a tab is shown, its rows rise in from 12px below with a 70ms stagger. Two small floating chips orbit the phone ("+€3,150.00 Salary" in white, "4.25% AER · paid daily" in ink) bobbing 8px over 6s.

Below 760px stack copy above the phone and collapse the nav into a round white burger with a rounded white dropdown.

Touch: below 400px shrink the handset to 244×486px so it fits a phone-width stage; app tabs get a 38px minimum height on coarse pointers.`,
  },
  {
    id: 'mesh-blobs',
    title: 'Citrus mesh studio hero',
    type: 'Gradient Mesh Hero',
    description: 'A design-studio hero on a living gradient mesh made of heavily blurred, multiply-blended colour blobs, one of which drifts after the pointer.',
    tags: ['gradient mesh', 'blur', 'agency', 'pointer'],
    component: MeshBlobs,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a hero for "Studio Pomelo", an independent design studio in Lisbon. Background #fff8f2, ink #1d1230, secondary #3b2d52 / #6c5a85. Fonts: Unbounded 600/700 for logo, headline and mobile menu; Hanken Grotesk 400–600 for everything else.

Mesh: an absolutely positioned layer behind the content with filter: blur(60px) saturate(1.2). Inside it, five circles sized in container units (46, 38, 34, 30 and 26cqi) in pink #ff8fab, apricot #ffb347, butter #ffe066, sky #7bdff2 and lilac #cdb4ff, each mix-blend-mode: multiply so overlaps deepen into new colours. Each runs the same 4-stop keyframe (translate by up to ±14cqi and scale .9–1.15) with different durations (18–28s), negative delays and alternate direction, so the mesh never repeats. A sixth rose blob (#ff6f91, 80% opacity) follows the pointer: store the target on pointermove and ease toward it at 4% per animation frame through CSS variables. Pause everything when off-screen.

Nav: a four-colour conic dot + "Studio Pomelo", pill-hover links Work / Services / Studio / Journal, and a dark pill "Start a project" that tilts -3° and scales 1.05 on hover with a springy curve.

Copy: a frosted pill with a green dot "Booking projects from March 2026", a two-line headline "Brands with a little zest." at clamp(34px, 8.6cqi, 112px), line-height .95, letter-spacing -0.05em, a 46ch sub-line, and buttons "See the work" (ink, lifts and tilts on hover) and the studio email (frosted white). Footer row: "Recently" followed by four client links with a wavy pink underline on hover.

Below 700px enlarge the blobs, hide the links and use a dark "Menu" pill that opens a rounded ink sheet with big Unbounded links.

Touch: track pointerdown / pointermove and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page. When no pointer is active (touch, or the cursor has left) the rose blob wanders on a slow sine path, so the mesh still feels alive on phones.`,
  },
  {
    id: 'mesh-aurora',
    title: 'Aurora bands Arctic stays',
    type: 'Gradient Mesh Hero',
    description: 'A night-sky hero for Arctic glass cabins where blurred, skewed gradient ribbons sway like the aurora, and a Kp slider makes them stronger.',
    tags: ['aurora', 'gradient bands', 'travel', 'slider'],
    component: MeshAurora,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a hero for "kaamos", glass cabins in Inari, Finnish Lapland. Sky gradient #030914 → #061a2a → #0b2a3a, text #e9f4f1, aurora green #6dffb3. Font: Red Hat Display 400–900 (logo 900, headline 800 at -0.04em).

Sky layers: a tiled star field of tiny radial-gradient dots in the top 70%; an aurora group (inset -10% -20% 25%) with mix-blend-mode: screen and a blur of about 31px; and two layered SVG hill silhouettes (#0a2233 far, #04101b near) across the bottom 34%, with a tiny cabin whose window glows warm #ffcf7a.

Aurora: four long elliptical ribbons, each a horizontal linear gradient that is transparent at both ends and passes through greens and teals (#39f3a8, #1fd3c6, #6dffb3, #2df0c0) with one lilac (#8a7dff) and one pink-violet (#ff6fb5 → #9b6bff) band. Each sways with a keyframe that translates it from -8% to 12%, rotates between -3° and -10°, skews between -20° and 30° and stretches scaleY .8–1.5, over 13–25s with negative delays and alternate direction, so the curtains ripple independently. Pause when off-screen.

Interaction: a frosted "Aurora forecast" card with a range input (Kp 1–9, accent-color green) drives a --kp variable that raises the aurora's opacity (.32 + kp × .075) and blur, and fades in the pink band only above Kp 4. A label describes the forecast in words ("strong, with colour").

Content: nav with "kaamos", links Cabins / Aurora nights / Getting here / Journal and a white pill "Check dates"; a green location line "Inari, Finnish Lapland · 68.9° N", headline "Glass cabins under the northern lights.", a 46ch sub-line, and buttons "Check winter dates" (green pill that glows on hover) and "Watch tonight's sky cam" (outlined). Below 680px collapse the links into a round burger with a blurred dark sheet.

Touch: below 680px drop the forced line break in the headline so it wraps naturally, and give the range input a 36px tall hit area on coarse pointers.`,
  },
  {
    id: 'mesh-conic-grain',
    title: 'Conic glaze ceramics hero',
    type: 'Gradient Mesh Hero',
    description: 'A ceramics-studio hero built from conic gradients under an SVG noise grain, with a bowl that spins on the wheel and swaps glazes.',
    tags: ['conic-gradient', 'grain', 'SVG noise', 'craft'],
    component: MeshConicGrain,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a hero for "Kiln & Tide", a stoneware studio on the Cornish coast. Background: a soft ash conic-gradient(from 210deg at 75% 55%) through #e4ddd0, #d3c3ad, #c9d3c9 and #d9cfbf, lifted by a radial highlight behind the visual. Ink #2a1d17, brown text #4a382c / #6b5442, rust accent #a0643a. Fonts: Young Serif for logo, headline and mobile links; Karla 400/700 for UI.

Grain: an absolutely positioned full-size SVG on top of everything (pointer-events: none) containing a rect filtered by feTurbulence (fractalNoise, baseFrequency .85, 3 octaves, stitchTiles) plus feColorMatrix saturate 0, blended with mix-blend-mode: multiply at 28% opacity, so every gradient reads like glazed clay.

Visual: a 420px "pottery wheel" seen from above. The bowl is a circle clipped with overflow hidden: a rotating inner layer painted with a six-stop conic-gradient of the current glaze, multiply-blended throwing rings (repeating-radial-gradient of 2px dark lines every 9px), a recessed well (radial gradient plus inset shadow) and a fixed blurred white glint that does not rotate. Add an inset rim highlight, a dark inner bottom shadow and a soft floor shadow. Rotate the glaze slowly in a requestAnimationFrame loop (about 1.2° per 60ms), paused off-screen and still for reduced motion.

Copy: kicker "Autumn kiln · 48 pieces · opens 1 November", headline "Thrown by hand on the Cornish coast." (max 13ch, clamp(36px, 6cqi, 74px)), sub-line, then a radiogroup of four 34px glaze swatches (Celadon, Tenmoku, Cobalt, Shino), each a mini conic gradient. Picking one swaps the bowl's palette, kicks the wheel to a fast spin that eases back down, and updates a line describing the glaze. Buttons: "Shop the autumn kiln" (ink pill) and "Wheel class · £65" (1.5px outline).

Below 720px stack the wheel above the copy and use an outlined "Menu" pill with a dark serif dropdown.

Touch: glaze swatches grow to 42px on coarse pointers and press in (scale .92) when tapped.`,
  },
  {
    id: 'kinetic-rotating-words',
    title: 'Typewriter bakery hero',
    type: 'Kinetic Type Hero',
    description: 'A neighbourhood-bakery hero whose headline types, pauses and deletes a rotating set of endings, beside a board of today\'s bakes.',
    tags: ['typewriter', 'rotating words', 'food', 'local business'],
    component: KineticRotatingWords,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a hero for "Brot & Butter", a bakery on Kastanienallee, Berlin, in boulangerie-awning colours: blue #1f3a8a with faint 60px vertical stripes (rgba(255,255,255,.035)), butter yellow #ffd56b, cream #fff3cf. Fonts: Caprasimo for logo, headline and board title; Rethink Sans 400–700 for UI.

Nav: "Brot & Butter" in yellow with a cream ampersand, links Menu / Order ahead / Wholesale / Find us, and a yellow 12px-radius button "Order for tomorrow".

Headline: "Bread that's" on line one, then a typed ending in yellow on line two that cycles through "still warm.", "naturally leavened.", "baked at 4 am." and "worth the queue.". Type each character with a 55–115ms randomised delay, hold the finished word for 2.2s with a blinking block caret (1s steps animation, only while idle), delete at 28ms per character, pause 260ms, then type the next. Reserve the headline height (min-height ~2 lines) so the layout never jumps. Give screen readers a visually hidden full sentence and hide the animated part with aria-hidden. Stop the timers when off-screen; with reduced motion just swap the whole ending every 4s.

Below the headline: an open-now line with a green dot, a 44ch sub-line, and buttons "Order for tomorrow" (yellow with a 5px darker #d9a933 bottom edge that presses down on :active) and "See the full menu" (2px cream outline).

Right column: a cream "Out of the oven today" board tilted 1.5°, 22px radius, with dashed rows of time, bake and price; a sold-out row is struck through and faded, and the next bake shows a small blue "Next" tag.

Below 760px stack the columns, let the typed word wrap, and swap the links for a square yellow burger with a cream dropdown.`,
  },
  {
    id: 'kinetic-marquee',
    title: 'Risograph marquee poster',
    type: 'Kinetic Type Hero',
    description: 'A print-fair hero made of three giant marquee rows in misregistered riso inks, whose speed and direction follow the pointer.',
    tags: ['marquee', 'giant type', 'risograph', 'event'],
    component: KineticMarquee,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a hero for "Riso Fair", a risograph and zine fair at Leeds Corn Exchange, 14–15 March 2026. Paper #efeee8, ink #141414, riso fluorescent pink #ff48b0, riso blue #0078bf, yellow #ffe800. Fonts: Dela Gothic One for the logo, marquees and mobile links; Space Grotesk 400–700 for UI. Use 2px ink rules and hard offset shadows instead of radii.

Nav: two overlapping pink and blue dots (multiply) + "Riso Fair", links Exhibitors / Workshops / Visit / Zine library with a yellow highlighter hover, and a pink "Free ticket" button with a 3px hard shadow; a 2px rule underneath.

Marquees: three full-width rows separated by 2px rules, each with a track (width: max-content) that repeats one unit four times. A unit is the phrase at clamp(54px, 12.5cqi, 170px) printed twice: the second copy absolutely stacked and offset by .035em/.03em with mix-blend-mode: multiply, to fake misregistered two-colour printing, followed by a ✳ separator. Row 1 "Riso Fair Leeds" pink over blue; row 2 "Print is not dead" blue over yellow, running the other way; row 3 "14—15 March 2026" in yellow with a 2px ink stroke over pink.

Motion: measure one unit's width with a ResizeObserver (and again on document.fonts.ready). In a requestAnimationFrame loop move each row by its own speed (0.055–0.09px per ms) and direction, wrapping the offset modulo the unit width, applied with translate3d. The pointer's horizontal position sets a speed multiplier from about -1.4 to 2.6 (so the left edge reverses the press), eased at 6% per frame, back to 1 on leave. Pause off-screen; static for reduced motion. Provide a visually hidden h1 and aria-hide the rows.

Footer area: a sub-line about 120 printers, a small hint, and buttons "Get a free ticket" (yellow, 4px hard shadow that grows on hover) and "Apply for a table · £45" (white, turns blue on hover). Below 680px stack the footer and use a yellow "Menu" button with a full-width sheet.

Touch: use pointer events and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; a sideways swipe sets the press speed and it eases back to 1 on pointerup / pointercancel. Swap the hint to "Swipe sideways…" under @media (hover: none).`,
  },
  {
    id: 'kinetic-pointer-letters',
    title: 'Lantern-lit variable letters',
    type: 'Kinetic Type Hero',
    description: 'A game-studio hero whose headline letters swell in weight and width, lift and glow as a lantern light passes over them.',
    tags: ['variable font', 'pointer', 'game studio', 'Roboto Flex'],
    component: KineticPointerLetters,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a hero for "Moth & Lantern", a nine-person game studio in Tallinn, announcing "Lanternfall" (PC & Switch, autumn 2026). Background dark moss #101612, text #efe9db, lantern gold #f9d77e. Use one variable font for everything: Roboto Flex (opsz 8–144, wdth 25–151, wght 100–1000), changing font-variation-settings per element instead of loading extra families.

Light: a full-size layer with radial-gradient(380px circle at var(--gx) var(--gy), rgba(249,215,126,.22), rgba(249,215,126,.05) 45%, transparent 70%) acting as a lantern. Its position eases toward the pointer at 12% per frame; with no pointer it drifts on a slow sine path across the headline so the effect demos itself.

Headline: "Light the / long night." at clamp(40px, 11cqi, 150px), line-height .9, each character its own inline-block span (spaces become non-breaking). Measure every glyph's centre with a ResizeObserver and again after document.fonts.ready. Each animation frame, compute a smoothstep falloff from the light's distance (radius max(140px, 22% of the width)) and ease each glyph 25% toward: weight 300 → 950, width 90 → 140, a lift of up to -14px, and a glow value that blends its colour toward gold with color-mix() and adds a gold text-shadow. Letters behind the light swell and shine; the rest relax back to a light weight. Give the h1 an aria-label and aria-hide the glyph spans. Pause off-screen; static for reduced motion.

Also: a moth logo + "Moth & Lantern" set at wght 700 / wdth 120, links Games / Studio / Jobs / Press kit that animate to weight 800 on hover, a gold "Wishlist on Steam" button (6px radius), a gold game line above the headline, a 46ch sub-line, buttons "Wishlist on Steam" and "Watch the trailer" (outlined, play icon), and a quiet footer line. Below 680px collapse the nav to a burger with a dark rounded sheet of wide, heavy links.

Touch: use pointerdown / pointermove and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; a finger dragged along the headline lights the letters, and on pointerup the lantern returns to its idle drift.`,
  },
  {
    id: 'glass-panels',
    title: 'Frosted weather app hero',
    type: 'Glassmorphism Hero',
    description: 'A weather-app hero of frosted glass panels floating over bold drifting shapes, with a city switcher that re-tints the whole scene.',
    tags: ['glassmorphism', 'backdrop-filter', 'app', 'tabs'],
    component: GlassPanels,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build a hero for "Aero", a hyperlocal weather app, made of frosted glass over colourful shapes. Ink #14182b, body #343a55. Font: Lexend 200–700 (a 200-weight 78px temperature, 700 headline at -0.045em).

Theme variables: register --c1, --c2, --c3 and --bg as <color> with @property and transition them over .9s, so switching city smoothly re-tints everything. Lisbon uses orange #ff9a3c, pink #ff5e8e, yellow #ffd23f on #fdeee4; Reykjavík teal #3ad1c4, blue #2b5cff, ice #9be7ff on #e4eef6; Kyoto coral #ff7a59, violet #b06bff, blossom #ffc2d1 on #f3e9f4.

Shapes (behind everything, sized in cqi): a big radial-gradient sun circle top-right, a rotated gradient pill bottom-centre, a thick outlined ring off the left edge and a rotated teardrop. Each drifts with its own 10–18s alternate keyframe using translate/rotate; pause when off-screen.

Glass recipe: background rgba(255,255,255,.3), 1px rgba(255,255,255,.6) border, inset 0 1px 0 rgba(255,255,255,.7) highlight, soft drop shadow, backdrop-filter: blur(22px) saturate(1.6).

Layout: a floating glass pill nav (logo dot in the current gradient + "Aero", links Features / Widgets / Pricing / Blog, ink "Download" pill). Left: headline "Weather you can actually plan around." (max 12ch), light sub-line, an ink "Download for iPhone" pill and a glass "Try it on the web" pill. Right, a 380px widget stack: a glass segmented tablist (Lisbon / Reykjavík / Kyoto, arrow-key navigation, roving tabindex), a 28px-radius glass forecast card (city, huge temperature, condition, highs/lows, five hourly columns with icons) and a small glass alert row ("Rain starting at your street in 12 min").

Below 740px stack the columns, enlarge the sun and collapse the nav into a round ink burger with a glass dropdown.

Touch: the forecast card also switches city with a horizontal swipe (pointer events, more than 40px of travel, touch-action: pan-y pinch-zoom), and the tabs get a 40px minimum height on coarse pointers.`,
  },
  {
    id: 'glass-pointer-light',
    title: 'Pointer-lit glass card',
    type: 'Glassmorphism Hero',
    description: 'A dark wearable-tech hero where one large frosted card holds the copy and catches a specular light and rim glint that follow the pointer.',
    tags: ['glass card', 'pointer light', 'border glow', 'wearable'],
    component: GlassPointerLight,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Create a hero for "Solace Ring 2", a titanium sleep-tracking ring. Background #07080d, text #eef0f6 (70% and 55% tints for secondary copy). Fonts: Syncopate 700 uppercase for logo (letter-spacing .28em) and headline; Manrope 300/400/700 for everything else.

Behind the glass: three big soft radial orbs (teal #0fb5a6, rose #ff7aa2, amber #ffb84d) drifting with 13–19s alternate keyframes (translate + scale), and a CSS "ring": a circle painted with a metallic conic-gradient (#6d7180, #f4f5f8, #9095a3, #3b3e48, #d9dbe2) masked into a band (radial mask transparent until 55%, opaque 56–70%), tilted with rotateX(62deg) and spinning on its Z axis every 14s. Pause the animations off-screen.

Card: centred, max 720px, 30px radius, padding clamp(24px, 4.4cqi, 52px), background linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04)), backdrop-filter: blur(28px) saturate(1.4), an inset top highlight and a deep shadow. On pointermove write the pointer position as --lx/--ly percentages and tilt the card up to ±3° (rotateX/rotateY inside a 1200px perspective, .4s ease-out). A ::before layer paints radial-gradient(520px circle at var(--lx) var(--ly), rgba(255,255,255,.16), transparent 45%) as a specular sheen; an ::after layer with 1px padding and a content-box mask-composite exclude draws only the border, filled with a brighter radial gradient at the same point so the rim glints where the light is. Reset tilt on leave.

Card content: "Solace Ring 2 · titanium · 2.4 g", headline "Sleep, measured gently." (max 16ch, clamp(26px, 5cqi, 54px)), a 48ch sub-line, a white pill "Pre-order · €299" and a translucent "Find your size", then a three-column metrics row (86/100 last night, 62 ms HRV, 7 days battery) with light 300-weight numbers and hairline dividers.

Nav above the card: "SOLACE", links Ring / Science / Membership / Support and a white "Pre-order" pill; below 680px a round translucent burger opens a frosted sheet.

Touch and idle: drive the light from pointerdown / pointermove with touch-action: pan-y pinch-zoom on the card. When no pointer is active, a requestAnimationFrame loop drifts the light slowly around the card (sine paths) with a gentle ±1.2° tilt, so phones still see the glint; reduced motion keeps it still.`,
  },
  {
    id: 'interactive-spotlight',
    title: 'X-ray spotlight EV hero',
    type: 'Interactive Hero',
    description: 'An electric-car hero where a cursor spotlight masks in a hidden blueprint layer, revealing the battery, motors and callouts under the paint.',
    tags: ['spotlight', 'CSS mask', 'reveal', 'automotive'],
    component: InteractiveSpotlight,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build a hero for the "Aurel E1", a five-seat electric GT. Showroom background radial-gradient(70% 60% at 60% 70%, #262a33, #0d0f13), text #eceef2, blueprint navy #0b2a4a, blueprint line #9fd3ff, highlight yellow #ffd36b. Font: Oxanium 400/600/700; logo "AUREL" tracked .42em. Buttons and nav CTA use chamfered corners via clip-path polygons rather than radii.

Two stacked full-size layers behind the content, each containing the same inline SVG car side profile (one body path with wheel-arch cut-outs, a glass path, two wheels) at the same position (bottom-right, 78% wide). Base layer: the car painted with a metallic vertical gradient (#e9ebef → #a7adb8 → #5b616c → #2a2e35), dark glass gradient, a white character line, warm headlight and red tail-light strokes, dark wheels with grey rims and a floor shadow ellipse. Hidden layer: a 24px blueprint grid on #0b2a4a with the same car drawn as 1.5px #9fd3ff outlines, dashed wheel crosshairs, yellow motor rings, a row of twelve battery cells along the floor, a wheelbase dimension and four leader-line callouts (82 kWh structural pack, rear motor 250 kW, front motor 140 kW, recycled-glass roof).

Spotlight: mask the hidden layer with radial-gradient(circle var(--sr) at var(--sx) var(--sy), #000 70%, transparent 100%), radius clamp(120px, 16% of width, 200px), and draw a thin blue ring outline at the same spot. In requestAnimationFrame, ease the spot 14% per frame toward the pointer; when the pointer is away it sweeps along the car on a slow Lissajous path (static centre for reduced motion). Pause when off-screen.

Content: nav (links E1 / Charging / Ownership / Configurator, outlined chamfered "Reserve E1"); copy top-left: blue tag line, headline "Nothing to hide. Look closer." with the second line as an outline (-webkit-text-stroke), sub-line ending "Move over the car to see inside.", buttons "Reserve for €500" (blue) and "Book a test drive" (translucent). A specs row at the bottom: 610 km, 3.9 s, 18 min. Below 700px enlarge the car to bleed off the right edge and collapse the nav into a square burger.

Touch: use pointerdown / pointermove and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page; when the finger lifts, keep the spotlight in place for about 1.4s before it resumes the idle sweep. Under @media (hover: none) the hint reads "Drag across the car to see inside."`,
  },
  {
    id: 'interactive-constellation',
    title: 'Logistics network constellation',
    type: 'Interactive Hero',
    description: 'A light supply-chain hero over a canvas particle network that links to the pointer, labels its port hubs and ripples when clicked.',
    tags: ['canvas', 'particles', 'constellation', 'B2B data'],
    component: InteractiveConstellation,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a hero for "Meridian", a supply-chain visibility platform, on a pale #f2f5f4 background. Ink #0d2b3e, secondary #3c5666, teal accent #00857a (hover #006b62), borders #c9d4d2. Font: Sora 400/600, headline 600 at -0.045em.

Canvas: full-bleed behind the content, DPR-aware, sized with a ResizeObserver. Spawn one node per ~5,200px² (between 50 and 150) drifting slowly with velocity damping and a little random wander, bouncing off the edges. Each frame, draw a 1px line between any two nodes closer than clamp(100px, 11% of width, 150px), alpha fading with distance up to rgba(13,43,62,.22), then the nodes as 1.8px dots. Seven nodes are "hubs" placed on the right half and labelled Rotterdam, Singapore, Shanghai, Los Angeles, Santos, Durban, Jebel Ali in 11px Sora: a 5px teal dot with an expanding, fading teal ring.

Pointer: draw teal lines from the cursor to every node within 1.5× the link distance (alpha by distance), nudge those nodes gently toward it, and mark the cursor with a 4px teal dot. On pointerdown (not on links or buttons), push nearby nodes outward with a force that falls off over 220px and emit a 2px teal ring that expands to 260px and fades. Pause the loop off-screen; draw a still frame (redrawn on pointer move) for reduced motion.

Readability: a left-to-right fade overlay (96% → 75% → transparent at 62%) keeps the copy clean; under 700px it becomes a vertical fade.

Content: nav with a globe logo + "Meridian", links Platform / Customers / Data / Company, dark 10px-radius "Request access". Copy: a white pill "Live · 2.3M containers tracked right now" with a pulsing teal dot, headline "See every shipment before it's late." (max 13ch, clamp(36px, 6cqi, 72px)), sub-line, buttons "Request access" (teal) and "See a live demo" (white, inset border), and a small hint about moving and clicking. Collapse the links into a white burger under 700px.

Touch and idle: pointerdown places the cursor dot and sends the pulse, a drag links nodes, and set touch-action: pan-y pinch-zoom on the hero so vertical swipes still scroll the page. When no pointer has moved for about 3.8s, a random hub sends a softer pulse by itself. Under @media (hover: none) the hint reads "Drag to connect nearby nodes · tap to send a pulse".`,
  },
  {
    id: 'interactive-3d-tilt',
    title: 'Paper diorama tilt scene',
    type: 'Interactive Hero',
    description: 'A hiking-app hero whose visual is a layered paper-cut mountain diorama in CSS 3D that tilts with the pointer, revealing real depth.',
    tags: ['3D', 'perspective', 'parallax layers', 'outdoors'],
    component: Interactive3dTilt,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a hero for "Switchback", an offline 3D trail-map app for the Alps. Background radial-gradient(70% 80% at 72% 55%, #2e2542, #1b1729), text #fff1e6, accent peach #f2a48b. Font: Gabarito 400/700/800, headline 800 at -0.035em.

Visual: a 440px square-ish "diorama" inside a container with perspective: 1100px. The inner box uses transform-style: preserve-3d and stacks absolutely positioned layers, each with a 26px radius (SVG layers clipped with clip-path: inset(0 round 26px)): a sky card (vertical gradient #ffd3b0 → #ffb08f → #f89a86, a glowing #fff4e2 sun, deep drop shadow); four paper-cut mountain ridges drawn as SVG polygons in #f2a48b, #d0687c, #8c3f6e and #4a2a55 at translateZ 10, 40, 75 and 110px, each with a small upward drop-shadow so they read as cut card; a dotted cream trail path on the second ridge; two pill clouds at 60 and 95px; a map pin with a dark label "Hörnli Hut 3,260 m · 4 h 10" floating at 140px; and a 10px cream frame at 150px that makes the whole thing look like a shadow box.

Motion: in a requestAnimationFrame loop ease the box's rotateX and rotateY 8% per frame toward a target derived from the pointer position over the scene (about ±11° X and ±15° Y, with a resting 6° X tilt). With no pointer the target drifts on a slow sine path so the parallax is visible on load. Pause off-screen; hold a static angle for reduced motion. Hide the diorama from assistive tech.

Content: nav with a mountain logo, links Maps / Routes / Huts / Pro and a cream 12px-radius "Get Switchback". Copy: peach tag "9,400 routes · offline · Alps & Dolomites", headline "Every switchback, before you get there." (max 13ch, clamp(36px, 6cqi, 72px)), sub-line, buttons "Download free" (peach) and "Explore the Matterhorn" (inset outline). Below 720px put the diorama above the copy and collapse the links into a cream square burger with a cream dropdown.

Touch: the scene listens to pointerdown / pointermove with touch-action: pan-y pinch-zoom, and goes back to its idle drift on pointerup / pointercancel. Below 720px move the hut pin to 30% so its label stays inside the card.`,
  },
  {
    id: 'interactive-tile-grid',
    title: 'Step-sequencer tile grid',
    type: 'Interactive Hero',
    description: 'A music-hardware hero whose visual is a playable 8×16 pad grid: tiles glow and fade under the pointer, toggle on click and light up under a moving playhead.',
    tags: ['tile grid', 'hover trail', 'Web Audio', 'hardware'],
    component: InteractiveTileGrid,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a hero for "Loop 16" by Grain Audio, a pocket step sequencer. Background graphite #18171b, text #f3eee6, single accent hot magenta #ff3d7f with a peach tint #ffd0a6. Fonts: Familjen Grotesk 400–700 for UI and headline; Martian Mono for tags, controls and readouts.

Left column: magenta mono tag "Loop 16 · ships March 2026", headline "Sixteen steps to a song." (clamp(38px, 6.4cqi, 80px), line-height .95, -0.04em), a 40ch sub-line, and buttons "Pre-order · £249" (magenta, 10px radius) and "Hear the demos" (inset 1px outline). Nav: a 2×2 pad logo + "Grain Audio", links Instruments / Sound packs / Learn / Community, magenta "Pre-order Loop 16".

Right: a device panel (22px radius, dark vertical gradient, inset top highlight, deep shadow) with a control row of small mono buttons (Play/Pause and Sound on/off with aria-pressed, Clear) and a "112 BPM · step 7/16" readout, then an 8×16 grid of square <button> pads (role="grid"/"gridcell", aria-pressed, aria-label "Row 3, step 9"). Pads are #2f2e35 with an inset bottom edge; every fourth column is a touch lighter to mark beats.

Hover trail with no JavaScript: pads normally transition background and box-shadow over 1.1s ease-out, but :hover sets the transition duration to 0 and paints a magenta-mixed colour with a pink glow, so sweeping the pointer leaves a fading comet trail. Clicking toggles a pad on; active pads use color-mix from magenta toward peach by row and glow.

Playhead: while visible (and not reduced motion), advance a step every 60000/112/4 ms. Pads in the current column shrink to .9; active ones in that column flash cream, scale 1.08 and glow brighter. With Sound on, create an AudioContext on that click and play a short triangle/square blip per active row (pentatonic notes, 8ms attack, 160ms exponential decay). Start with a preset beat; Clear empties it. Below 760px stack the grid under the copy and collapse the nav into a dark burger.

Touch: pads paint by dragging. On pointerdown the drag mode becomes the opposite of the first pad; moving finds pads with elementFromPoint and sets them to that mode. On touch, hold the first toggle until the gesture is clearly a tap or a horizontal drag (more than 8px, mostly sideways), so a vertical scroll that starts on the grid never flips a pad. The grid uses touch-action: pan-y pinch-zoom. Keyboard clicks (detail 0) still toggle. The hover trail only applies under @media (hover: hover); below 480px pads become 4:5 for taller targets, and control buttons get a 40px minimum height on coarse pointers.`,
  },
];
