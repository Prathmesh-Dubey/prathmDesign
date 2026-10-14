import { DesignExample } from '../../core/example.model';
import { EdPlayfairSource } from './demos/ed-playfair-source';
import { EdCaslonFranklin } from './demos/ed-caslon-franklin';
import { EdNewsreaderPublic } from './demos/ed-newsreader-public';
import { EdGloockHanken } from './demos/ed-gloock-hanken';
import { MagBodoniJost } from './demos/mag-bodoni-jost';
import { MagDmSerifSans } from './demos/mag-dm-serif-sans';
import { MagAntonRobotoSlab } from './demos/mag-anton-roboto-slab';
import { MagAbrilPoppins } from './demos/mag-abril-poppins';
import { MinInstrument } from './demos/min-instrument';
import { MinGaramondWork } from './demos/min-garamond-work';
import { MinSchibsted } from './demos/min-schibsted';
import { TechJetbrainsInter } from './demos/tech-jetbrains-inter';
import { TechSpaceGroteskPlex } from './demos/tech-space-grotesk-plex';
import { TechUnboundedOnest } from './demos/tech-unbounded-onest';
import { TechArchivo } from './demos/tech-archivo';
import { PersCaveatNunito } from './demos/pers-caveat-nunito';
import { PersLoraNunitoSans } from './demos/pers-lora-nunito-sans';
import { PersFrauncesInter } from './demos/pers-fraunces-inter';
import { NlSyneManrope } from './demos/nl-syne-manrope';
import { NlMontserratMerriweather } from './demos/nl-montserrat-merriweather';
import { NlRozhaMukta } from './demos/nl-rozha-mukta';
import { LrCormorantProza } from './demos/lr-cormorant-proza';
import { LrLiterataAtkinson } from './demos/lr-literata-atkinson';
import { LrSpectralKarla } from './demos/lr-spectral-karla';
import { LifeYoungSerifFigtree } from './demos/life-young-serif-figtree';
import { LifeCrimsonSora } from './demos/life-crimson-sora';
import { LifeRighteousLato } from './demos/life-righteous-lato';
import { LifeBitterRaleway } from './demos/life-bitter-raleway';

export const TYPOGRAPHY_EXAMPLES: DesignExample[] = [
  // ── Editorial Blog ──────────────────────────────────────────────
  {
    id: 'ed-playfair-source',
    title: 'Playfair Display × Source Serif 4 — essay page',
    type: 'Editorial Blog',
    description: 'A classic single-post essay with a drop cap, hanging pull quote, clickable footnotes and a reading progress bar.',
    tags: ['serif pairing', 'drop cap', 'pull quote', 'footnotes', 'progress bar'],
    component: EdPlayfairSource,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a single-post editorial essay page for a publication called "The Halyard". Background #FCFCFA, ink #1B1B1F, one accent: bottle green #1F4D3A.

Fonts: Playfair Display (800 for the headline, 500/700 italic for the logo and pull quote) and Source Serif 4 (400 body, 600 for names, italic for the deck). Load from Google Fonts.

Structure inside a scrollable container: a 3px sticky reading-progress bar (green, scaleX from 0 to 1 as you scroll), then a sticky blurred masthead with an italic logo, three nav links and a pill "Save for later" toggle (outline → filled green when pressed, aria-pressed). The article column is max 760px: section label in all-small-caps ("Essays / Cities"), headline clamp(34px, 6.4cqi, 62px) at line-height 1.04 with text-wrap: balance, an italic 22px deck, byline row with a 40px initials avatar, name, date and "14 min read", a 15:8 hero image with a small caption.

Body: Source Serif 4 at 19px / 1.65, max 66ch, text-wrap: pretty, hanging-punctuation: first. The first paragraph gets a five-line Playfair drop cap in green. Include a pull quote in Playfair italic 32px with the opening quote hung outside the text block (text-indent: -0.42em) and a cite line.

Footnote markers are small green-tinted buttons; clicking one scrolls the container to the note list and highlights that note with a soft green background fade (0.4s).

End with a "type key" card: two rows, each a large "Aa" sample in the face plus its name, weight and size. Hide nav links below 560px container width. Respect prefers-reduced-motion (no smooth scrolling).`,
  },
  {
    id: 'ed-caslon-franklin',
    title: 'Libre Caslon × Libre Franklin — opinion column',
    type: 'Editorial Blog',
    description: 'A newspaper-style opinion page with a double-ruled masthead, justified two-column text and a numbered most-read rail.',
    tags: ['newspaper', 'columns', 'Caslon', 'small caps', 'masthead'],
    component: EdCaslonFranklin,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Create a newspaper opinion-column page called "The Morning Ledger". Paper #F6F6F3, ink #161616, rules #D6D6D0, one red accent #C8102E.

Fonts: Libre Caslon Display (headline and masthead), Libre Caslon Text (body, italic dek), Libre Franklin 500–700 (date line, nav, labels).

Masthead: a thin top line with the date and "Vol. CXIV · No. 288" at 11.5px, the paper's name centered at clamp(34px, 7cqi, 64px), and a nav bar framed by a 3px double rule above and a 1px rule below; the active "Opinion" link is red.

Main grid (two columns over 820px container width: article + 250px rail with a left rule). Article: red kicker "Opinion · Guest essay", a 50px Caslon Display headline capped at 20ch with balanced wrapping, an italic 19px dek, then a byline strip between hairlines with a 48px greyscale round portrait, author name and short bio, plus a segmented "Single / Two-column" toggle.

Body text: Libre Caslon Text 17px / 1.6, paragraphs indented 1.4em except the first, whose first line is set in small caps. In two-column mode (over 620px) use CSS columns with a 32px gap, a column rule, hyphens: auto and justified text; single mode caps the measure at 64ch.

Rail: "Most read in Opinion" with a 3px red underline, then four headlines numbered with large red Caslon Display numerals via CSS counters. Below it a grey "type key" definition list naming Headline, Text and Furniture faces with their sizes, each sample set in its own face. Toggle buttons use aria-pressed.`,
  },
  {
    id: 'ed-newsreader-public',
    title: 'Newsreader × Public Sans — explainer',
    type: 'Editorial Blog',
    description: 'A data-led explainer with a key-points box, a Brief/Full length switch and an inline bar chart, using Newsreader’s optical sizes.',
    tags: ['optical size', 'explainer', 'chart', 'toggle', 'news'],
    component: EdNewsreaderPublic,
    stageHeight: 640,
    stageTone: 'none',
    prompt: `Build an explainer article page for an energy newsroom called "Grid Notes". Outer background #EAF0F2, a white article sheet (max 820px, 4px radius), ink #0F2233, secondary text #3A4B59, accent teal #0B7A75.

Fonts: Newsreader with its optical-size axis (opsz 6–72) so the headline uses display cuts and body uses text cuts automatically (font-optical-sizing: auto); Public Sans 400–800 for all interface and data text.

Top row: brand wordmark, a solid teal "Explainer" tag, and a right-aligned "Updated" timestamp with tabular numbers. Headline in Newsreader Light 300 at clamp(34px, 6.2cqi, 60px), letter-spacing -0.02em, max 18ch, one italic emphasised word in teal. A 21px standfirst below.

Meta bar between hairlines: byline left, and a pill segmented control "Brief · 2 min / Full story · 9 min" (role tablist, selected tab dark navy with white text, 0.2s transition).

Key points box: pale teal background with a 3px teal left border, a bold label and three bullets with bolded figures.

Full mode shows the body (Newsreader 18.5px / 1.62, max 64ch, text-wrap: pretty) with a subhead in Public Sans 700 and a five-bar chart of efficiency by temperature: bars grow from scaleY(0) over 0.6s, values above bars and labels below, plus a source line. Brief mode replaces the body with a short italic summary that fades and rises in over 0.35s.

Footer type key: three lines naming the display cut, text cut and Public Sans, each sample word set in its own style. Disable animations for reduced motion.`,
  },
  {
    id: 'ed-gloock-hanken',
    title: 'Gloock × Hanken Grotesk — numbered criticism essay',
    type: 'Editorial Blog',
    description: 'A dark-mode film essay in Roman-numeral sections with a sticky index that tracks your scroll position.',
    tags: ['dark mode', 'scroll spy', 'numbered sections', 'display serif'],
    component: EdGloockHanken,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Build a dark-mode criticism essay, "Five Ways of Looking at a Long Take", inside a scrollable container. Background #17121A (deep plum-black), body text #D9CCD2, headings #EFE6EA, muted #A8919C, accent dusty pink #E7A6C0, hairlines #3A2D3F.

Fonts: Gloock (a high-contrast display serif, weight 400 only) for the headline, section titles and numerals; Hanken Grotesk 400/500/600 for body, labels and the index.

Layout: over 820px container width, a two-column grid — a 230px sticky left index and the article. Below that, the index list hides and only the type key remains.

Article: small pink kicker "Criticism · Film · 11 Oct 2026", headline in Gloock clamp(40px, 8cqi, 96px) at line-height 0.98, max 13ch, balanced. A 20px Hanken dek in #CDBEC5, a byline with read time, then a hairline. Five sections, each with an h2 that sets a large pink Roman numeral (1.9em) baseline-aligned beside the title, followed by a 17px / 1.72 paragraph capped at 64ch with text-wrap: pretty. End with a small pink square end-mark.

Index: "In this essay" label and buttons "I The promise", "II The show-off"… Clicking smooth-scrolls the container to that section. On scroll, highlight the section whose top has passed 40% of the viewport (active item gets a #2A1F2E background and white text; transitions 0.2s); force the last item active at the bottom.

Type key under the index: "Gloock" set at 22px in itself with "Display · 400 only · 40–120 px", and "Hanken Grotesk" with "Text · 400 / 600 · 17 px on 1.7". Respect reduced motion.`,
  },
  // ── Magazine Blog ───────────────────────────────────────────────
  {
    id: 'mag-bodoni-jost',
    title: 'Bodoni Moda × Jost — fashion cover index',
    type: 'Magazine Blog',
    description: 'A fashion-magazine homepage with a towering Bodoni feature and three secondary stories you can promote to the cover.',
    tags: ['didone', 'fashion', 'magazine index', 'swap feature', 'optical size'],
    component: MagBodoniJost,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Create a fashion-magazine blog homepage called "Vellum". Pure white #FFFFFF, ink #0B0B0B, greys #2E2E2E / #6B6B6B, and one cobalt accent #1F3FFF for section labels and the Subscribe link.

Fonts: Bodoni Moda with its optical-size axis (opsz 6–96, weights 400–700, italics) for the logo and headlines; Jost 400/500 for everything else. Section labels in Jost 500 at 11.5px with +8% tracking.

Header: a three-column row — issue line left ("Autumn 2026 · No. 31"), the italic Bodoni logo centred at clamp(30px, 6cqi, 52px), links right — over a 1px black rule.

Feature: on containers over 720px, a two-column grid (1.05fr image / 1fr copy, bottom-aligned). The portrait image (4:4.6, max 420px tall) reveals with a clip-path wipe from the top plus a slight scale-down over 0.7s; the copy rises 14px and fades in. Headline in Bodoni Moda 400 at clamp(38px, 7.2cqi, 76px), line-height 0.98, tracking -0.025em, with the second half in italic ("The Return of the *Tailored Coat*"). 17px Jost dek, then byline and read time.

Below a rule: a three-column row of secondary stories (single column under 520px with a 90px thumbnail beside the text). Each is a button with a 5:6 image (slightly desaturated, full colour and scale 1.03 on hover/focus), a cobalt section label, a 23px Bodoni title with italic half, and author. Clicking one promotes it to the feature slot and returns the previous feature to the row, replaying the reveal.

Footer type key: large "Bb" in Bodoni and "Jj" in Jost with one-line specs.`,
  },
  {
    id: 'mag-dm-serif-sans',
    title: 'DM Serif Display × DM Sans — culture magazine grid',
    type: 'Magazine Blog',
    description: 'A culture-magazine index with section tabs that filter a card grid led by an oversized feature story.',
    tags: ['filter tabs', 'card grid', 'magazine', 'superfamily'],
    component: MagDmSerifSans,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a culture-magazine blog index called "The Overlook" with a marigold full stop after the logo. Background pale lilac #EFEAF6, ink #1D1530, secondary text #4A4062 / #7C7294, accent marigold #F2B400 (use darker #8A6400 for small category labels so they pass contrast).

Fonts: DM Serif Display (regular and italic) for the logo and every headline; DM Sans (optical sizes, 400/500/700) for tabs, deks and metadata.

Header: logo at clamp(32px, 6cqi, 54px) with a short tagline on the right. Below it a horizontally scrollable row of pill tabs — All, Film, Books, Music, Food — each showing a small post count. The selected tab is filled ink with white text and a marigold count (role="tablist", aria-selected).

Grid: CSS grid with repeat(auto-fill, minmax(220px, 1fr)) and 18px gaps. Cards are white, 4px radius: 4:3 image (zooms to 1.04 over 0.6s on hover), a bold 12px category, a 24px DM Serif Display headline with balanced wrapping, and "Author · date". The first card in the current filter becomes the lead: on containers over 700px it spans two columns and two rows, uses a 16:11 image, a clamp(30px, 4.4cqi, 44px) headline and shows a 15.5px dek.

Filtering re-renders the cards with a staggered fade-up (0.4s, 40ms per card).

Footer type key: an ink bar with "Ag" samples of both faces in marigold, their weights and size ranges, and a decreasing row of "A" glyphs showing the size scale 54 / 34 / 22 / 15 / 12px. Turn animations off for reduced motion.`,
  },
  {
    id: 'mag-abril-poppins',
    title: 'Abril Fatface × Poppins — music interview issue',
    type: 'Magazine Blog',
    description: 'A loud music-magazine interview with a fat-face cover line, Q&A typography and a playable “On repeat” track list.',
    tags: ['fat face', 'interview', 'Q&A', 'colour blocking', 'music'],
    component: MagAbrilPoppins,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create a music-magazine interview post with colour blocking. Page background sunflower #FFD23F with ink #111; a black #111 cover band with yellow text; hot pink #FF3E7F as the single accent.

Fonts: Abril Fatface 400 for the cover line, pull quote, "Q" markers and section titles; Poppins 400/600/700/800 for everything else.

Cover band (two columns over 720px, 1.4fr / 1fr): a pill "Issue 42" in pink plus "The Interview" in white 800 12.5px; a quoted headline in Abril Fatface clamp(36px, 7.4cqi, 84px), line-height 0.98, -2% tracking, with the opening quote hung outside the block (text-indent: -0.4em; padding-left: 0.4em); an 18px dek with the artist's name bolded in pink; small grey credits. Right: a portrait with an arch-top radius (50% 50% 8px 8px) and a pink circular sticker "Loud & local" rotated -12° that gently wobbles over 6s.

Body (two columns over 760px: article + 280px rail). Q&A pairs: questions in Poppins 700 16px with a pink, black-outlined Abril "Q" before them; answers in Poppins 400 16px / 1.7 at max 62ch. Finish with a big Abril pull quote with hanging punctuation.

Rail "On repeat": a numbered track list with a 2px top rule; each row has a 32px round black play button (aria-pressed), two-digit number, title/artist and duration in tabular figures. Pressing play turns the row pink-tinted and swaps the icon for a three-bar equaliser animating scaleY (0.8s, staggered); pressing again stops it. Only one track plays at a time.

Type key: a black card naming Abril Fatface in yellow and Poppins in pink with their sizes. Stop wobble and equaliser for reduced motion.`,
  },
  {
    id: 'mag-anton-roboto-slab',
    title: 'Anton × Roboto Slab — sports race report',
    type: 'Magazine Blog',
    description: 'A sports-magazine race report with a scrolling ticker, giant condensed headline, stat strip and switchable results table.',
    tags: ['condensed', 'sports', 'ticker', 'stats', 'table'],
    component: MagAntonRobotoSlab,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a sports-magazine race report for a running publication. Navy #0D1B3E background, white #F2F4F8 text, muted #A9B3C9, signal red #E63946 accent.

Fonts: Anton 400 (uppercase condensed display) for the headline, stats, tabs and positions; Roboto Slab 300/400/700 for body, labels and table text.

Top: a red headline ticker — a duplicated row of headlines separated by small navy dots that scrolls with translateX(0 → -50%) over 32s linear infinite and pauses on hover.

Hero: 330px minimum, full-bleed slightly desaturated photo under a navy gradient scrim; copy sits at the bottom — pink-red section label, the headline "Sub-two in the rain" in Anton uppercase at clamp(54px, 13cqi, 150px), line-height 0.86, and a light 19px dek.

Stat strip: four cells (two per row under 600px) under a 4px red rule — "1:59:48 Winning time", "2:51 Per km", "11° At the start", "46,112 Finishers" — numbers in Anton 48px with tabular figures, labels 12.5px.

Body grid (article + 340px rail over 800px): byline, a 19px light lead paragraph whose first line is bold, then 17px / 1.65 body at max 62ch.

Rail: Anton tabs "Men / Women" over a 2px red line (selected tab filled red). A results table with red Anton positions, athlete name + small country code, half split and finish time right-aligned in tabular figures; switching tabs swaps the rows with a 0.35s fade and rows highlight on hover.

Type key box with a thin border naming both faces with weights. Disable the ticker animation for reduced motion.`,
  },
  // ── Minimal Blog ────────────────────────────────────────────────
  {
    id: 'min-instrument',
    title: 'Instrument Serif × Instrument Sans — post index',
    type: 'Minimal Blog',
    description: 'A quiet list-of-posts homepage with year filters, underline-on-hover titles and excerpts that unfold as you point at them.',
    tags: ['post list', 'minimal', 'hover reveal', 'filter'],
    component: MinInstrument,
    stageHeight: 600,
    stageTone: 'none',
    prompt: `Build a minimalist personal-blog index for a type designer, "Noor Halabi". Background #FAFAFA, ink #111, greys #555 / #888, rules #E6E6E6 and a single blue #2F5BEA used only for the hover underline.

Fonts: Instrument Serif (regular and italic) for the name and post titles; Instrument Sans 400/500 for the bio, dates, filters and metadata.

Column: max 720px, generous top padding. Name in Instrument Serif at clamp(36px, 6cqi, 52px); a 16px bio capped at 46ch with one word set in the serif italic.

Year filter: small text buttons "All / 2026 / 2025 / 2024" with tabular figures; the active one is a solid black pill with light text; a right-aligned "6 posts" count updates with the filter.

List: each row is a link laid out as a three-column grid — date (76px, 13px grey, tabular), title (Instrument Serif clamp(22px, 3.4cqi, 28px) with an optional italic word), and read time. Hovering or focusing a row (1) draws a 1px blue underline across the title by animating background-size from 0 to 100% over 0.35s, (2) fades every other row to 35% opacity, and (3) unfolds a 15px grey excerpt beneath the title (max-height and opacity transition, 0.35s). Under 480px, the date moves above the title.

Footer type key: two inline specs, each family name set in itself ("Instrument Serif 400 & italic — titles 28px", "Instrument Sans 400 / 500 — text 15px, dates tabular"). Remove transitions for reduced motion.`,
  },
  {
    id: 'min-garamond-work',
    title: 'EB Garamond × Work Sans — fine-typography toggle',
    type: 'Minimal Blog',
    description: 'A minimal essay page with a switch that turns fine typography on and off — curly quotes, em dashes, old-style figures, ligatures and small caps.',
    tags: ['OpenType', 'old-style figures', 'small caps', 'toggle', 'garalde'],
    component: MinGaramondWork,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Create a minimal single-post page for a blog called "Commonplace" that teaches fine typography with a live switch. Background #FBFBF8, ink #222, muted #8A8780, rule #E7E5DE, accent maroon #8B1E3F.

Fonts: EB Garamond (400, 500, italic) for the headline and body; Work Sans 400/500 for the top bar, margin metadata and type key.

Top bar: maroon wordmark left; right, an accessible toggle (visually hidden checkbox + 34×20px track and 14px dot that slides 14px with a 0.25s ease) labelled "Fine typography".

Article: over 760px container width, a 150px right-aligned margin column (date in 500 weight, "Essay · 6 min") beside a 60ch text column. Headline 48px. Body EB Garamond 20px / 1.7, paragraphs after the first indented 1.5em, signature right-aligned in italic.

When the switch is ON: curly quotes and apostrophes, em dashes and a true ellipsis; font-variant-numeric: oldstyle-nums proportional-nums; standard ligatures enabled; acronyms like "BBC" in all-small-caps with +5% tracking; hanging-punctuation; the headline turns italic 400. When OFF, transform the same strings in code to straight quotes, "--" and "...", use lining figures, disable ligatures (font-feature-settings 'liga' 0) and show full caps.

Footer type key under a hairline: two spec blocks (family name set in itself plus size/leading) and a row of pill chips describing each current detail ("“ ” curly quotes" vs '" " straight quotes', "— em dash" vs "-- double hyphen", figures, ligatures, small caps) that update with the switch.`,
  },
  {
    id: 'min-schibsted',
    title: 'Schibsted Grotesk — single-family weight system',
    type: 'Minimal Blog',
    description: 'A one-typeface design blog where hierarchy comes only from weight and size, with a live variable-weight slider on the headline.',
    tags: ['variable font', 'single family', 'weight slider', 'grotesk'],
    component: MinSchibsted,
    stageHeight: 620,
    stageTone: 'none',
    prompt: `Build a minimal product-design blog called "Small Batch" set entirely in one variable family, Schibsted Grotesk (wght 400–900, with italics). White #FFFFFF, ink #0E0E10, greys #3D3D44 / #6C6C72, hairlines #E6E6EA, one red accent #FF3B30.

Header: logo in weight 900 at 20px with tight -3% tracking and a small red ®, author line in 400 grey, then a 2px black rule.

Lead post: red 500 meta line in tabular figures; headline "One typeface, every job" at clamp(42px, 9cqi, 96px), line-height 0.95, tracking -0.045em, max 12ch, balanced. A 20px 400 subtitle in #3D3D44 at max 50ch. Under it a labelled range slider (400–900, step 10, accent-color red) bound to the headline's font-weight with a 0.25s transition and an <output> showing the value in bold tabular figures; set aria-valuetext.

Post list: rows in a grid — two-digit number in grey 400, 21px title in 600 with -1.5% tracking (turns red on hover), an outlined pill tag in 500 and a tabular date. Under 520px the tag and date wrap beneath the title.

Type key: a light grey rounded panel naming the family, followed by a "weight ladder" of six buttons showing "Aa" at 400, 500, 600, 700, 800, 900 with the value in small text; clicking one sets the headline weight and outlines the button in red. Every bit of hierarchy must come from weight, size, tracking and colour only — no second font. Disable the weight transition for reduced motion.`,
  },
  // ── Tech Blog ───────────────────────────────────────────────────
  {
    id: 'tech-jetbrains-inter',
    title: 'JetBrains Mono × Inter — dev tutorial post',
    type: 'Tech Blog',
    description: 'A developer tutorial with monospaced headings, a scroll-tracking table of contents and a syntax-highlighted, copyable code block.',
    tags: ['code block', 'syntax highlight', 'table of contents', 'monospace'],
    component: TechJetbrainsInter,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a developer-blog tutorial page, "Debouncing a signal without losing the last value", inside a scroll container. Page #FBFCFD, ink #1A1F2B, body text #2C3342, muted #5B6475, hairlines #E5E9EF, accent teal #0E7C86.

Fonts: JetBrains Mono (400/500/700/800) for the site logo, breadcrumbs, headings, labels and code; Inter 400/600 for prose.

Sticky blurred top bar: teal "~/rafa.dev" logo and a grey breadcrumb path that truncates with an ellipsis.

Layout over 860px container width: a 210px sticky table of contents (left border list; the active item gets a 2px teal left border, teal text and 600 weight) and the article. Below that width the TOC list hides but the type key stays.

Article: a teal mono pill "TypeScript" + date and read time; H1 in JetBrains Mono 700 at clamp(26px, 4.4cqi, 40px), tracking -0.03em, max 26ch; an 18px Inter lede. Section headings are mono 19px with a teal "#" prefix. Prose 16.5px / 1.7, max 68ch; inline code on a #EEF1F5 chip.

Code block: dark #0F1720 card, 10px radius, with a #17212D title bar (three dots, filename, "Copy" button that turns mint #5FD3C7 with "Copied ✓" for 1.6s and writes to the clipboard). Lines are numbered in a muted gutter (not selectable) and highlighted by a tiny tokenizer: keywords pink #FF9AC1, strings green #A5E3A0, numbers amber #FFCF7D, functions blue #7CC7FF, types teal #5FD3C7, comments italic grey. Rows tint on hover; the block scrolls horizontally on narrow screens.

Add a pale amber note callout. Scroll-spy: highlight the section whose top has passed 45% of the viewport; TOC clicks smooth-scroll the container.

Type key under the TOC naming both faces with weights and sizes.`,
  },
  {
    id: 'tech-space-grotesk-plex',
    title: 'Space Grotesk × IBM Plex Serif — incident postmortem',
    type: 'Tech Blog',
    description: 'An engineering postmortem with a metrics strip, an expandable UTC timeline and went-well / didn’t lists.',
    tags: ['postmortem', 'timeline', 'metrics', 'grotesk + serif'],
    component: TechSpaceGroteskPlex,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create an engineering-blog incident postmortem page. Background #EEF1F4, white cards, ink #0B1320, body #2D3746, muted #5F6B7C, borders #D3D9E1, status red #D92D20, amber #E79B00 and green #12805C.

Fonts: Space Grotesk 500/600 for headings, metrics and timeline titles; IBM Plex Serif 400 for narrative text; IBM Plex Mono 400/500 for timestamps, labels and status.

Top row: team name and a green "Resolved" pill with a dot. Then a red mono label "Postmortem · SEV-1 · Blameless", an H1 at clamp(30px, 5.4cqi, 50px), line-height 1.04, tracking -0.035em, and a 17.5px Plex Serif summary (max 64ch).

Metrics: a grid of four white cells separated by 1px gaps inside a rounded border — "Duration 41 min", "Failed checkouts 18.4k", "Time to detect 3 min", "Data loss None" (green). Values in Space Grotesk 600 34px with tabular figures and small grey units.

Timeline: a vertical 2px line with colour-coded 12px dots (red detect, grey action, amber fix, green resolved). Each row is a button: mono UTC time, dot, title, chevron. Clicking expands a Plex Serif detail paragraph using a grid-template-rows 0fr → 1fr transition (0.3s); the chevron rotates 180°. Only one row is open at a time; set aria-expanded.

Two cards "What went well" (green top border) and "What didn't" (red top border) with bullet lists.

Footer type key under a dashed rule: each family name set in itself with its role. Remove transitions for reduced motion.`,
  },
  {
    id: 'tech-unbounded-onest',
    title: 'Unbounded × Onest — product changelog',
    type: 'Tech Blog',
    description: 'A product changelog with sticky version labels, New / Improved / Fixed filters and a dark–light theme switch.',
    tags: ['changelog', 'dark mode', 'theme toggle', 'filters', 'wide display'],
    component: TechUnboundedOnest,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Build a product changelog blog page for an API company called "Ledgerline", with a dark/light theme switch driven by CSS custom properties on the host.

Dark tokens: background #101014, panel #18181F, ink #F1F1F5, muted #9A9AAB, lines #2A2A35, accent coral #FF6B4A, badge colours mint #7EF0C1 (New), periwinkle #9FB6FF (Improved), amber #FFCF6B (Fixed). Light tokens: #F6F6FA / #FFFFFF / #14141C / #626274 / #E2E2EA, accent #E5482A, badges #0C8A5C / #3550C8 / #A46A00. Animate background and colour over 0.35s.

Fonts: Unbounded (500/700/800 — a wide, geometric display face) for the logo, the giant "Changelog" title, version numbers and release titles; Onest 400/500/600 for text, filters and badges.

Header: logo with an 18px conic-gradient square mark, and a pill theme button with a sun/moon icon and label (aria-label describes the target theme).

Title "Changelog" at clamp(38px, 8cqi, 80px), weight 800, letter-spacing -0.05em, line-height 0.95. Intro paragraph with an inline code chip.

Filter pills: All / New / Improved / Fixed (aria-pressed; active is inverted ink). Filtering hides non-matching items and drops releases that end up empty, with an "@empty" message.

Releases: separated by hairlines; over 640px a 150px sticky side column with the coral version ("v2.14.0") and date in tabular figures, and a main column with a 24px Unbounded 500 title (tracking -0.035em), muted intro and a list of changes — each prefixed by a 64px outlined badge coloured by kind. Releases fade up 8px on render (0.35s).

Type key panel at the bottom naming both faces, each set in itself. Disable animations for reduced motion.`,
  },
  {
    id: 'tech-archivo',
    title: 'Archivo Black × Archivo widths — benchmark post',
    type: 'Tech Blog',
    description: 'A hardware benchmark write-up whose bar chart re-sorts between throughput and memory, using Archivo’s width axis for dense labels.',
    tags: ['variable width', 'bar chart', 'data post', 'superfamily'],
    component: TechArchivo,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create a tech-blog benchmark post, "We benchmarked nine JSON parsers on a Raspberry Pi 5". White page, ink #111, greys #2B2B2B / #666, chart panel #F5F5F2 with a 2px black border, bar tracks #E4E4DF, and a construction-yellow accent #FFCC00.

Fonts: Archivo Black for the headline; Archivo variable with its width axis (wdth 62–125, wght 100–900) for everything else — body at 100% width, compact labels and metadata at font-stretch 75%, figure captions at 87.5%, and the "BENCH/PRESS" logo at 125% width, weight 900, on a yellow block.

Header row over a 6px black rule. Headline clamp(32px, 6.6cqi, 66px), line-height 0.98, tracking -0.03em, max 18ch. Dek at 20px with one bolded phrase highlighted by a yellow lower-40% gradient, then a condensed byline.

Chart: caption and a square-cornered segmented control "Throughput / Memory" (selected = black with yellow text). Nine rows in a grid — condensed library name + language, an 18px bar track, and a right-aligned value in tabular figures. Bars use width: calc(var(--w) * 1%) with a 0.6s cubic-bezier(.2,.8,.2,1) transition. Switching metric re-sorts the rows (descending throughput, ascending memory) and recomputes widths relative to the max; keep elements keyed by name so bars animate. The top-ranked bar turns yellow with a black inset outline. Footnote on test conditions.

Body: two 16.5px / 1.65 paragraphs at max 64ch.

Type key under a 2px rule: Archivo Black spec, Archivo width-range spec, and the letters "Rr" shown at 62%, 87.5%, 100% and 125% width. Remove the bar transition for reduced motion.`,
  },
  // ── Personal Blog ───────────────────────────────────────────────
  {
    id: 'pers-caveat-nunito',
    title: 'Caveat × Nunito — handwritten journal',
    type: 'Personal Blog',
    description: 'A personal diary on ruled notebook paper with handwritten headlines, a taped polaroid, highlighter marks and tabbed entries.',
    tags: ['handwritten', 'journal', 'ruled paper', 'tabs', 'playful'],
    component: PersCaveatNunito,
    stageHeight: 660,
    stageTone: 'none',
    prompt: `Build a personal journal blog that looks like a ruled notebook on a blue-grey desk (#DDE6EE). Ink navy #233A6B, body text #2A3550, secondary #6B7FA8, red pen #C0392B, highlighter #FFF27A.

Fonts: Caveat 500/700 (handwriting) for headlines, captions, margin notes and signature; Nunito 400/700 for diary text and tab dates.

Entry tabs: folder tabs above the page (light blue #B7C9DA, 10px top radius) showing the weekday in Caveat 20px and date in 11.5px Nunito; the active tab turns paper-white and sits 4px higher; aria-current on the active one.

Page: paper #FDFDFB with CSS-only ruling — a repeating-linear-gradient of 1px #DBE6F3 lines every 32px and a 2px pink #F2A3A3 vertical margin line at 54px; 76px left padding. Body text is Nunito 17px with line-height exactly 32px so it sits on the rules; meta line and headline also snap to the 32px rhythm (headline Caveat 700 at clamp(38px, 6.4cqi, 58px) with 64px line-height, rotated -1°).

Content: a polaroid floated right (white frame, 2.5° rotation, a translucent pink washi-tape strip on top, Caveat caption), a highlighted sentence using a ragged-edged yellow gradient behind <mark>, a red handwritten margin note led by a small hand-drawn SVG arrow (rotated -1.5°), and a "— Mae" signature.

Switching entries slides the new page in from 14px right with a fade (0.45s). Under 520px the polaroid stops floating and centres.

Type key: a yellow sticky note rotated -1.5° with a soft shadow naming Caveat and Nunito and their roles. Respect reduced motion.`,
  },
  {
    id: 'pers-lora-nunito-sans',
    title: 'Lora × Nunito Sans — garden blog with comments',
    type: 'Personal Blog',
    description: 'A warm personal how-to post with an author row, numbered steps, a like button and a working comment form.',
    tags: ['comments', 'how-to', 'like button', 'serif + humanist'],
    component: PersLoraNunitoSans,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create a personal allotment-gardening blog post, "Saving seeds from the tomatoes that survived the blight". Sage background #E9EFE6, ink #1F2A1F, muted #5C6B58, borders #C9D4C4, white cards, accent beetroot #7B2D5B.

Fonts: Lora 500/600 + italics for the italic logo, headline, author name, comment names, step numbers and emphasised variety names; Nunito Sans 400/700 for body, captions and forms.

Column max 760px. Site header with italic beetroot logo and plot location over a hairline. Bold beetroot category label; headline Lora 600 at clamp(30px, 5.2cqi, 46px), balanced. Author row with a 44px round photo (2px white ring), name in Lora and date/read time. A 16:9 hero with 14px radius.

Body: Nunito Sans 17px / 1.72 at max 64ch. A numbered method list built with CSS counters: each step is a pale #F6F9F4 rounded row with a large italic Lora numeral in beetroot.

Like button: pill with a heart outline and count (tabular figures); pressing toggles aria-pressed, fills the pill beetroot, fills the heart and pops it to scale(1.15) with a springy cubic-bezier(.3,1.6,.5,1).

Comments: heading with live count, white rounded comment cards (name in Lora, timestamp), then a form with labelled name input and textarea (10px radius, beetroot focus ring). "Post comment" stays disabled until both are filled; submitting prevents navigation, appends the comment with a fade-up and clears the textarea.

Type key in a dashed rounded box naming both faces with their roles.`,
  },
  {
    id: 'pers-fraunces-inter',
    title: 'Fraunces × Inter Tight — variable-axis headline',
    type: 'Personal Blog',
    description: 'A personal essay whose “wonky” soft-serif headline can be tuned live with weight, softness and wonk controls.',
    tags: ['variable font', 'SOFT axis', 'WONK', 'sliders', 'personal'],
    component: PersFrauncesInter,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a personal blog post with a playful variable-font headline. Deep blue background #1B2A6B, peach text #FFD7C2, headline #FFE9DC, body #F3DCCF, lilac secondary #C9B8D9, accent coral #FF9F7A.

Fonts: Fraunces loaded with all its axes (ital, opsz 9–144, wght 100–900, SOFT 0–100, WONK 0–1) and font-optical-sizing: auto; Inter Tight 400/500 for body and UI.

Header: "hi, I'm Tomás" with the name in soft, wonky Fraunces italic, and three nav links. Coral meta line, then the headline "One hundred loaves later" at clamp(44px, 9.4cqi, 104px), line-height 0.94, tracking -0.03em, max 12ch, balanced.

Axis panel: a translucent rounded box with two labelled range sliders — Weight (100–900) and Softness (0–100) — each with a live <output> in tabular figures, plus a "Wonky letters" checkbox. Bind weight to font-weight and the others to font-variation-settings: 'SOFT' n, 'WONK' 0|1, with a 0.2s transition. accent-color coral.

Body: Inter Tight 17px / 1.7 at max 62ch with one italic Fraunces emphasis, then a blockquote in Fraunces italic 28px with a 3px coral left rule.

Type key under a hairline: "Fraunces" with its axis ranges, "Inter Tight" with sizes, and a small code chip showing the current font-variation-settings string so readers can copy it. Disable the transition for reduced motion.`,
  },
  // ── Newsletter ──────────────────────────────────────────────────
  {
    id: 'nl-syne-manrope',
    title: 'Syne × Manrope — design newsletter issue',
    type: 'Newsletter',
    description: 'A weekly design newsletter issue with tinted numbered sections, a mini bar chart and a validating subscribe box.',
    tags: ['newsletter', 'subscribe form', 'sections', 'wide display'],
    component: NlSyneManrope,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a web version of a weekly design newsletter, "Signal & Noise — Issue 87". Outer background #E9E7F0; a centred white issue card (max 640px, 18px radius, soft shadow). Ink #141414, greys #3D3D3D / #666, accents bubblegum #FF5FA2 and mint #C9F5E9, section tints #FFE1EE and #C9F5E9 and #F4F3F7.

Fonts: Syne 400/700/800 (wide, quirky display) for the masthead, greeting, section headings and success message; Manrope 400/600/800 for reading text, links and UI.

Masthead: "Signal&Noise" in Syne 800 at clamp(36px, 8.4cqi, 64px), line-height 0.9, tracking -0.04em, with the ampersand in Syne 400 pink; below it the issue number in 800 and a grey meta line (date · read time · readers), then a 2px black rule.

Sections are 14px-radius tinted blocks, each headed by Syne 800 at 28px with a small outlined pill number "01", "02", "03": (1) Three links — Manrope 800 links with a 2px pink underline offset 3px, a source label and a one-line "why"; (2) Tool of the week; (3) One chart — six bars in a CSS grid (black, the latest year pink) with values above and years below, plus a caption. Give the chart role="img" and a full-data aria-label.

Subscribe box: black block with Syne heading, a visually-hidden label, email input (#1F1F1F, mint focus border) and a mint "Subscribe" button. On submit, validate with a simple regex; invalid shows a pink border, aria-invalid and a polite error message; valid swaps the form for a mint "You're in" message that pops in with a springy scale (0.4s).

Footer type key naming both faces with weights and sizes.`,
  },
  {
    id: 'nl-montserrat-merriweather',
    title: 'Montserrat × Merriweather — email digest',
    type: 'Newsletter',
    description: 'A classic email-style weekly digest with a masthead band, jump-link contents, a sponsor slot and a one-tap feedback poll.',
    tags: ['email layout', 'digest', 'classic pairing', 'table of contents'],
    component: NlMontserratMerriweather,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create the browser view of an email newsletter, "Ground Truth" — a Sunday climate briefing. Outer background #DFE7E2; a 600px white email column with a 1px #CCD8D0 border. Ink #18241E, muted #5D6D64, forest green #14532D, leaf green #3FA36A, mint #B8E0C6, sponsor gold #D4A017 on #FBF6E8.

Fonts: Montserrat 500–800 for the masthead, kickers, headlines, contents and buttons; Merriweather 400 (and italic) for all reading text — the classic sans-headline / serif-body email pairing.

Above the email: a tiny centred pre-header with a "View in browser" link. Masthead band in forest green: "GROUND TRUTH" in Montserrat 800 with +8% tracking and a mint sub-line with issue number and date. Then a 5:2 header image.

Body (padding ~32px): a 16px / 1.75 Merriweather greeting; an "In this issue" box (#F4F8F5, 6px radius) with numbered buttons that smooth-scroll the container to each story. Each story: a hairline, a green kicker "1 · Energy", a Montserrat 800 24px headline and a Merriweather paragraph. After the first story, a sponsor block with a 4px gold left border and a tracked "Supported by" label.

Poll: a green rounded panel "How was this issue?" with three outlined pill buttons; choosing one replaces it with an italic thank-you.

Footer (#F4F8F5): a type key naming Montserrat 800 and Merriweather 400 with their roles, then the unsubscribe and preferences links in small Montserrat. Use smooth scrolling only without reduced motion.`,
  },
  {
    id: 'nl-rozha-mukta',
    title: 'Rozha One × Mukta — bilingual food newsletter',
    type: 'Newsletter',
    description: 'A Hindi–English recipe newsletter that switches language in place, using faces that cover both Latin and Devanagari.',
    tags: ['Devanagari', 'bilingual', 'language toggle', 'recipe'],
    component: NlRozhaMukta,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a bilingual (English / Hindi) food newsletter called "Tiffin Notes / टिफ़िन नोट्स". Deep teal page #0F4C5C, a white issue card (max 660px, 6px radius), turmeric #F2A900 masthead, recipe panel #FFF3D1, burnt orange labels #B35C00, body text #1B2A2F / #3D4D52.

Fonts: Rozha One (a high-contrast display face with both Latin and Devanagari) for the logo, headline, section titles and success message; Mukta 400/600/800 (also Latin + Devanagari) for text and UI. Both load from Google Fonts with automatic script subsets.

Masthead: turmeric band with the logo in Rozha One plus the Hindi name smaller in brown, an "EN / हिं" pill toggle (aria-pressed; selected = teal with white text) and the issue line. Finish the band with a scalloped bottom edge made from a repeating radial-gradient.

Content: H1 in Rozha One clamp(36px, 7cqi, 60px); intro paragraph; a rounded recipe panel with a label, Rozha title, a two-column ingredient list with turmeric dot bullets, and method text; then two columns ("Market of the week", "Ajji's brass jar") under 3px teal rules; then a teal subscribe strip with a turmeric pill button that swaps to a thank-you line.

Language switch: keep all copy in an { en, hi } dictionary and swap every string in place; set the lang attribute on the card. Devanagari needs taller line-height — 1.3 for the headline and 1.85 for paragraphs when lang="hi" (1.1 / 1.65–1.7 for English).

Type key at the bottom: each family name shown in Latin and Devanagari with its role.`,
  },
  // ── Long-read ───────────────────────────────────────────────────
  {
    id: 'lr-cormorant-proza',
    title: 'Cormorant Garamond × Proza Libre — sidenote long-read',
    type: 'Long-read',
    description: 'A long-form feature with margin sidenotes, a drop cap and a sticky progress bar that counts down the minutes left.',
    tags: ['sidenotes', 'progress bar', 'long-form', 'drop cap'],
    component: LrCormorantProza,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Build a long-read feature page, "The Cartographers of the Seafloor", inside a scroll container. Background #F3F5F4, ink #12232E, secondary #33495A / #5B6E78, hairlines #D9E1E0, sea-blue accent #1E6F8C, sidenote panel #E6EEEE.

Fonts: Cormorant Garamond (Light 300, 400, 500 and italics) for the headline, italic dek, section heads and drop cap; Proza Libre 400/500 for body text, notes and metadata.

Sticky top strip (30px, translucent, blurred) containing a 2px blue progress line along its bottom edge (transform: scaleX(progress)) and a right-aligned "N min left" counter in tabular figures, computed from a 22-minute total. Give it role="progressbar" with aria-valuenow.

Centred title block: blue series label, headline in Cormorant Light 300 at clamp(44px, 9cqi, 96px), line-height 0.92, with "Seafloor" in blue italic 400; an italic 24px dek capped at 46ch; byline.

Body: Proza Libre 17px / 1.78 at max 62ch, text-wrap: pretty, hanging punctuation. The first paragraph gets a 4.6em Cormorant drop cap in blue. Section heads in Cormorant italic 34px blue.

Sidenotes: each paragraph is a grid row. Over 820px container width, rows become minmax(0, 62ch) + 220px columns and each note sits in the margin beside its paragraph, topped by a hairline and prefixed with its blue number. Narrower than that, notes hide and the superscript number becomes a button that expands the note inline as a tinted rounded box (fade down 0.25s), with aria-expanded.

Footer type key under a hairline naming both faces with weights and sizes.`,
  },
  {
    id: 'lr-literata-atkinson',
    title: 'Literata × Atkinson Hyperlegible — reader settings',
    type: 'Long-read',
    description: 'A long-read reading view with an “Aa” panel to adjust size, line height, measure, typeface and paper / sepia / night themes.',
    tags: ['reading view', 'font size', 'line height', 'themes', 'accessibility'],
    component: LrLiterataAtkinson,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Create an e-reader style long-read view, "What the River Remembers", with a reader-settings panel. Use host-level CSS variables for three themes: paper (#FDFDFC bg, #1D2126 ink, #66707A muted, #2B6CB0 accent), sepia (#F4ECD8, #3B2F1E, #7C6A50, #9A5B13) and night (#14171C, #D7DCE2, #8B95A1, #8AB4F8), each with matching line and panel colours; transition background/colour over 0.3s.

Fonts: Literata (opsz 7–72, wght 400–700, italics) for the headline and default body; Atkinson Hyperlegible 400/700 for UI and as the alternative body face.

Sticky toolbar: publication name and an "Aa" button (small A + large A in Literata) that toggles the settings panel (aria-expanded).

Settings panel (an absolutely positioned dropdown under the sticky toolbar, right-aligned, max 320px, 14px radius, soft shadow, drops in 6px over 0.2s): range slider for text size 15–24px with a live output; line height 1.3–2.0 (step 0.05); a segmented control for line length 55ch / 65ch / 75ch; a segmented typeface switch "Literata / Atkinson" (each label set in its own face); and three circular theme swatches with a double focus-ring on the active one. All controls use aria-pressed or labels; sliders use accent-color.

Article: section label, Literata 600 headline at clamp(32px, 6cqi, 54px), byline, then three paragraphs whose font-size and line-height follow the sliders with a 0.2s transition. Size the column so the measure stays correct in ch at the chosen size (e.g. calc(65ch * size / 16)).

Footer type key that reads live: the current face, "19 / 31 px · 65ch measure · paper", plus the headline and UI specs.`,
  },
  {
    id: 'lr-spectral-karla',
    title: 'Spectral × Karla — chaptered long-read with footnote popovers',
    type: 'Long-read',
    description: 'A three-chapter feature with a sticky chapter bar, pager buttons and footnotes that open as small popovers in the text.',
    tags: ['chapters', 'footnotes', 'popover', 'screen serif'],
    component: LrSpectralKarla,
    stageHeight: 680,
    stageTone: 'none',
    prompt: `Build a chaptered long-read, "A Language Kept in the Kitchen". White #FCFCFD background, ink navy #1E2433, muted #6A7183, hairlines #DFE2EA, ochre accent #A8741A, key panel #F1F2F6.

Fonts: Spectral (ExtraLight 200 italic for the headline and chapter numerals, Light 300 for chapter titles, Regular 400 for body); Karla 400/600/700 for kicker, navigation, footnote popovers and buttons.

Header: ochre kicker "A long read in three chapters", headline in Spectral 200 italic at clamp(40px, 8cqi, 86px), line-height 0.98, max 14ch; byline with credits.

Sticky chapter bar: three equal tabs (role tablist) between a 1px ink top rule and a hairline bottom; each shows an italic ochre numeral (I, II, III) and a short title in Karla 600 (titles hide under 520px). The selected tab grows a 3px ochre underline via scaleX(0 → 1) over 0.35s.

Chapter panel: "Chapter I" label in Karla 700 ochre above a Spectral 300 36px title; paragraphs Spectral 18px / 1.72 at max 64ch. Switching chapters fades the text up 8px (0.4s) and closes any open note.

Footnotes: small round ochre number buttons in superscript. Clicking one opens a dark navy popover (max 280px, 8px radius, arrow on top, 0.2s fade) beneath the marker with the note in Karla 13.5px; the active marker turns navy; Escape or a second click closes it. Use aria-expanded and role="note".

Pager row with "Previous chapter / Next chapter" pill buttons (disabled at the ends) and "1 / 3". A grey type key band at the bottom naming both faces. Respect reduced motion.`,
  },
  // ── Lifestyle Blog ──────────────────────────────────────────────
  {
    id: 'life-young-serif-figtree',
    title: 'Young Serif × Figtree — recipe post',
    type: 'Lifestyle Blog',
    description: 'A food-blog recipe with a jump-to-recipe button, a servings scaler that rewrites quantities and a tick-off ingredient list.',
    tags: ['recipe', 'servings scaler', 'checklist', 'food blog'],
    component: LifeYoungSerifFigtree,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Build a food-blog recipe post, "Charred leek & white bean toast", for a site called "Second Helping". Background #F7F9F2, ink #1F2A1A, muted #44503C / #66705E, borders #DDE3D3, leek green #3B6E3B, tag tint #E3ECD5, egg-yolk yellow #F7C548 for the main button.

Fonts: Young Serif 400 (a soft, chunky old-style display face) for the logo, headline, recipe facts, section titles and step numbers; Figtree 400/600/700 for everything else, with tabular figures for quantities.

Intro: over 720px a two-column grid — left: green pill tags (Vegetarian · 30 minutes · Autumn), headline clamp(34px, 6cqi, 54px) line-height 1.04, a 17.5px dek, byline and a yellow pill "Jump to recipe" button with a 2px darker bottom shadow; right: a portrait image with an arched top (border-radius 200px 200px 16px 16px). Then a short personal story paragraph (max 64ch).

Recipe card (white, 18px radius): a facts row (Prep, Cook, Serves) with values in Young Serif 22px; "Serves" has round −/+ buttons (1–12, disabled at limits) and a polite live output. Two columns over 700px: Ingredients — each a label with a green checkbox; ticking greys and strikes it through. Quantities are stored per two servings and re-render as you scale, rounded to friendly fractions (¼, ½, ¾) and to the nearest 10 above 50. Method — numbered with CSS counters as large yellow Young Serif numerals with a thin dark outline.

"Jump to recipe" smooth-scrolls the internal scroll container to the card. Finish with a type key naming both faces and their roles.`,
  },
  {
    id: 'life-crimson-sora',
    title: 'Crimson Pro × Sora — travel itinerary',
    type: 'Lifestyle Blog',
    description: 'A travel story with a full-bleed cover, day tabs that swap the itinerary timeline and a three-photo mosaic.',
    tags: ['travel', 'itinerary', 'tabs', 'photo mosaic', 'serif italic'],
    component: LifeCrimsonSora,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Create a travel-blog post, "Three slow days in Matera". Limestone background #E9E8E3, ink navy #1D2A44, secondary #33415E / #44506A, borders #CFCCC2, warm gold accent #C99A2E (darker #8A6A1D for small text), pale gold #E9CF8F on dark.

Fonts: Crimson Pro 300/400 + italics for the headline, intro, day titles and ledes; Sora 300/400/600 for location, bylines, itinerary text and times.

Cover: 340px minimum, full-bleed photo with a navy bottom gradient; coordinates line in pale gold, headline in Crimson Pro 400 at clamp(44px, 9cqi, 92px), line-height 0.95, with "Matera" in light italic gold; credits line.

Intro paragraph in Crimson Pro 25px / 1.5 at max 58ch with hanging punctuation.

Day tabs: three equal rounded buttons (role tablist) each with a gold "Day 1" label and an italic Crimson title; the selected one fills navy with light text (0.25s). Left/right arrow keys cycle days.

Panel (two columns over 760px): an italic 22px lede, then a timeline list with a 2px gold left border and hollow gold dots — each stop shows a tabular time, a 600-weight place name and a light 14.5px note. Right column: a mosaic with one wide 16:10 photo above two 5:6 photos, 10px radius. Switching days replays a 10px fade-up (0.45s).

Type key under a hairline naming Crimson Pro and Sora with sizes. Disable the animation for reduced motion.`,
  },
  {
    id: 'life-righteous-lato',
    title: 'Righteous × Lato — before/after restoration',
    type: 'Lifestyle Blog',
    description: 'A retro home-and-thrift blog post with a draggable, keyboard-friendly before/after comparison and a shop-the-look strip.',
    tags: ['before after slider', 'retro', 'home decor', 'shop the look'],
    component: LifeRighteousLato,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Build a retro home-decor blog post for "Thrift&Tell": "A £35 sideboard, two weekends and a lot of sandpaper". Blush background #FBE7E1, chocolate ink #3B2416, muted #8A6450, teal #00808A, mustard #E8B923.

Fonts: Righteous 400 (a rounded 70s display face) for the logo, headline, labels, section title and prices; Lato 300/400/700/900 for text.

Header: a teal pill bar with the logo (mustard ampersand) and nav links (hidden under 520px). Teal 900-weight category label, headline clamp(30px, 5.8cqi, 58px) at max 20ch, light 20px dek, byline.

Before/after comparison: an 11:6.4 frame with an 18px radius, 4px chocolate border and a hard 8px 8px mustard offset shadow. Stack the same photo twice — the "before" layer filtered (grayscale .85, sepia .35, contrast .8, brightness .92), the "after" layer clipped with clip-path: inset(0 0 0 calc(var(--x) * 1%)). A 3px light divider line and a 40px mustard circular handle with two CSS-triangle arrows sit at --x. Cover the frame with a transparent native range input (0–100) so dragging, clicking and arrow keys all work; give it an aria-label and aria-valuetext, and show a teal focus ring on the frame via :has(input:focus-visible). Pill labels "Before" (chocolate) and "After" (mustard) in the top corners.

Body: Lato 17px / 1.66, max 64ch. "Get the look": a white card with a 3px chocolate border and a responsive grid of four products (square image, bold name, source, Righteous price).

Type key naming both faces and their weights.`,
  },
  {
    id: 'life-bitter-raleway',
    title: 'Bitter × Raleway — cycling route guide',
    type: 'Lifestyle Blog',
    description: 'An outdoors route guide with a stat strip and an interactive elevation profile you can scrub with the pointer or arrow keys.',
    tags: ['elevation chart', 'outdoors', 'slab serif', 'interactive SVG'],
    component: LifeBitterRaleway,
    stageHeight: 700,
    stageTone: 'none',
    prompt: `Create an outdoors/cycling blog route guide, "The Long Causeway loop", for "Gravel & Grit". Forest green background #1F3B2D, panels #24432F and #183022, sand text #F1E9D8, secondary #DED3BB / #C9C0A9 / #A9A08A, accent orange #F28C28.

Fonts: Bitter 700/800 (slab serif) for the logo, headline, stat numbers and readouts; Raleway 400/600 for text. Raleway defaults to old-style figures, so set font-variant-numeric: lining-nums everywhere numbers appear (tabular-nums for stats).

Lead: over 700px a two-column grid — category, Bitter 800 headline at clamp(34px, 6.4cqi, 64px), an 18px dek and byline — beside a 15:11 photo.

Stat strip: four cells separated by 1px gaps (two per row under 560px): Distance, Climbing (computed from the profile data), Surface, Moving time, with 30px Bitter values and small Raleway units.

Elevation profile panel: a caption row "Elevation profile" with a live readout "km 34 · 412 m". An SVG (viewBox 640×160, preserveAspectRatio none) draws the route as an orange 2px line (non-scaling stroke) over an orange-to-transparent gradient area. A dashed vertical cursor follows the pointer; an HTML dot (so it stays round) sits on the line at the current km. The SVG is focusable with role="slider", aria-valuenow / valuetext, and left/right arrows step one km. Below it, an axis row 0–64 km.

Two body paragraphs at 17px / 1.7, max 64ch, then a type key naming both faces.`,
  },
];
