import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Tok { c: string; t: string; }

const CODE = `import { signal, effect } from '@angular/core';

export function debounced<T>(source: () => T, ms = 250) {
  const out = signal(source());
  let timer: ReturnType<typeof setTimeout> | undefined;

  effect(() => {
    const next = source(); // read inside: tracked
    clearTimeout(timer);
    timer = setTimeout(() => out.set(next), ms);
  });

  return out.asReadonly();
}`;

const KW = new Set(['import', 'from', 'export', 'function', 'const', 'let', 'return', 'typeof', 'undefined', 'new', 'if']);

function tokenize(line: string): Tok[] {
  const re = /(\/\/.*$)|('[^']*'|"[^"]*")|(\b\d+\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d]+)/g;
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ c: 'cm', t: m[1] });
    else if (m[2]) out.push({ c: 'st', t: m[2] });
    else if (m[3]) out.push({ c: 'nu', t: m[3] });
    else if (m[4]) {
      const w = m[4];
      const after = line.slice(re.lastIndex).trimStart();
      out.push({ c: KW.has(w) ? 'kw' : /^[A-Z]/.test(w) ? 'ty' : after.startsWith('(') || after.startsWith('<') ? 'fn' : 'id', t: w });
    } else if (m[5]) out.push({ c: 'ws', t: m[5] });
    else out.push({ c: 'pu', t: m[6] });
  }
  return out;
}

@Component({
  selector: 'demo-tech-jetbrains-inter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller (scroll)="spy()">
      <header class="nav">
        <span class="logo">~/rafa.dev</span>
        <span class="crumbs">posts / signals / debounced.md</span>
      </header>
      <div class="layout">
        <div class="side">
          <nav class="toc" #tocEl aria-label="On this page">
            <p>On this page</p>
            <ol #rail>
              @for (s of toc; track s; let i = $index) {
                <li><button type="button" [class.on]="active() === i" [attr.aria-current]="active() === i ? 'true' : null" (click)="go(i)">{{ s }}</button></li>
              }
            </ol>
          </nav>
          <div class="key" aria-label="Type specimen">
            <p class="km">JetBrains Mono</p><p>700 headings · 400 code 14 / 22</p>
            <p class="ki">Inter</p><p>400 / 600 prose · 16.5 / 28</p>
          </div>
        </div>

        <article>
          <p class="meta"><span class="pill">TypeScript</span> 11 Oct 2026 · 6 min read</p>
          <h1>Debouncing a signal without losing the last value</h1>
          <p class="lede">Search boxes, resize handlers, autosave: you want the <em>final</em> value, not every keystroke. Here is a 12-line helper and the one mistake that makes most versions drop the last update.</p>

          <section class="sec"><h2><span>#</span> The problem</h2>
            <p>A naive debounce reads the source inside the timeout callback. By then the effect has finished, so the read is <code>untracked</code> — and if the value changes during the wait, you can emit a stale result.</p>
          </section>

          <section class="sec"><h2><span>#</span> A safer helper</h2>
            <p>Read the source synchronously inside the effect, then hand the captured value to the timer:</p>
            <figure class="code">
              <div class="code-bar">
                <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="file">debounced.ts</span>
                <button type="button" (click)="copy()" [class.done]="copied()">{{ copied() ? 'Copied ✓' : 'Copy' }}</button>
              </div>
              <pre><code>@for (line of lines; track $index) {<span class="ln"><span class="no">{{ $index + 1 }}</span>@for (tk of line; track $index) {<span [class]="tk.c">{{ tk.t }}</span>}</span>}</code></pre>
            </figure>
          </section>

          <section class="sec"><h2><span>#</span> Trade-offs</h2>
            <div class="note"><b>Note</b> The effect still runs on every change; only the write is delayed. For very hot sources, pair it with <code>computed()</code> to filter first.</div>
            <p>Cleanup matters too: clear the timer when the owning component is destroyed, or a late write can land on a signal nobody reads.</p>
          </section>
        </article>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #fbfcfd; color: #1a1f2b; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; scroll-behavior: smooth; }
    .nav { position: sticky; top: 0; z-index: 2; display: flex; gap: 16px; align-items: center; box-sizing: border-box; height: 44px; padding: 0 clamp(16px, 4cqi, 36px); background: rgba(251,252,253,.9); backdrop-filter: blur(8px); border-bottom: 1px solid #e5e9ef; font: 500 13px/1 'JetBrains Mono', monospace; }
    .logo { font-weight: 800; color: #0e7c86; }
    .crumbs { color: #8a93a3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layout { display: grid; gap: 28px; max-width: 1080px; margin: 0 auto; padding: clamp(22px, 4cqi, 44px) clamp(16px, 4cqi, 36px) 48px; }
    @container (min-width: 860px) { .layout { grid-template-columns: 210px minmax(0, 1fr); gap: 48px; } .side { position: sticky; top: 64px; align-self: start; } }
    /* Narrow: "On this page" becomes a sticky chip rail under the top bar; the type key moves below the post. */
    @container (max-width: 859px) {
      .side { display: contents; }
      .toc > p { display: none; }
      .toc { position: sticky; top: 44px; z-index: 1; order: 0; margin: 0 calc(-1 * clamp(16px, 4cqi, 36px)); padding: 0 clamp(16px, 4cqi, 36px); background: rgba(251,252,253,.95); backdrop-filter: blur(8px); border-bottom: 1px solid #e5e9ef; }
      .toc ol { display: flex; gap: 6px; margin: 0; padding: 8px 0; border-left: 0; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x proximity; scrollbar-width: none; }
      .toc ol::-webkit-scrollbar { display: none; }
      .toc li { flex: none; scroll-snap-align: start; }
      .toc button { width: auto; min-height: 38px; margin: 0; white-space: nowrap; border: 1px solid #e5e9ef; border-radius: 999px; padding: 8px 14px; background: #fff; }
      .toc button.on { border-color: #0e7c86; background: #e3f3f4; }
      article { order: 1; }
      .key { order: 2; margin-top: 0; }
    }
    .toc button, .code-bar button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .toc button:active { color: #0e7c86; }
    .code-bar button:active { transform: scale(.95); }
    .code-bar button { position: relative; }
    .code-bar button::after { content: ''; position: absolute; inset: -8px -4px; }
    .toc > p { font: 600 12px/1 'Inter', sans-serif; color: #8a93a3; }
    .toc ol { list-style: none; margin: 10px 0 0; padding: 0; border-left: 1px solid #e5e9ef; }
    .toc button { display: block; width: 100%; text-align: left; border: 0; background: none; padding: 6px 12px; margin-left: -1px; border-left: 2px solid transparent; font: 400 14px/1.3 'Inter', sans-serif; color: #5b6475; cursor: pointer; transition: color .2s, border-color .2s; }
    .toc button.on { color: #0e7c86; border-left-color: #0e7c86; font-weight: 600; }
    .key { margin-top: 22px; padding: 12px; background: #f1f4f8; border-radius: 8px; font: 400 12px/1.4 'Inter', sans-serif; color: #5b6475; }
    .km { font: 700 14px/1.2 'JetBrains Mono', monospace; color: #1a1f2b; }
    .ki { font: 600 15px/1.2 'Inter', sans-serif; color: #1a1f2b; margin-top: 8px; }
    .meta { display: flex; gap: 10px; align-items: center; font: 400 13px/1 'Inter', sans-serif; color: #5b6475; }
    .pill { font: 600 11.5px/1 'JetBrains Mono', monospace; color: #0e7c86; background: #e3f3f4; padding: 5px 8px; border-radius: 5px; }
    h1 { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 4.4cqi, 40px); line-height: 1.15; letter-spacing: -0.03em; margin-top: 16px; text-wrap: balance; max-width: 26ch; }
    .lede { font: 400 18px/1.6 'Inter', sans-serif; color: #3a4252; margin-top: 16px; max-width: 64ch; text-wrap: pretty; }
    .lede em { font-style: italic; }
    .sec { margin-top: 32px; max-width: 68ch; }
    h2 { font: 700 19px/1.3 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
    h2 span { color: #0e7c86; margin-right: 4px; }
    .sec p { font: 400 16.5px/1.7 'Inter', sans-serif; margin-top: 12px; color: #2c3342; text-wrap: pretty; }
    p code, .note code { font: 500 .88em 'JetBrains Mono', monospace; background: #eef1f5; padding: 2px 5px; border-radius: 4px; }
    .code { margin: 16px 0 0; border-radius: 10px; overflow: hidden; background: #0f1720; box-shadow: 0 12px 30px -18px rgba(15,23,32,.6); }
    .code-bar { display: flex; align-items: center; gap: 12px; padding: 9px 12px; background: #17212d; font: 500 12px/1 'JetBrains Mono', monospace; color: #8fa1b5; }
    .dots { display: flex; gap: 5px; } .dots i { width: 9px; height: 9px; border-radius: 50%; background: #2d3b4c; }
    .file { flex: 1; }
    .code-bar button { font: 600 11.5px/1 'JetBrains Mono', monospace; border: 1px solid #2d3b4c; background: transparent; color: #cfe3ef; padding: 6px 10px; border-radius: 6px; cursor: pointer; transition: background .2s, color .2s; }
    .code-bar button.done { background: #5fd3c7; color: #0f1720; border-color: #5fd3c7; }
    pre { margin: 0; padding: 14px 0; overflow-x: auto; overscroll-behavior-x: contain; font: 400 13.5px/1.65 'JetBrains Mono', monospace; color: #d6e2ee; font-variant-ligatures: contextual; }
    .ln { display: block; padding: 0 16px 0 0; white-space: pre; }
    @media (hover: hover) { .ln:hover { background: rgba(255,255,255,.04); } }
    .no { display: inline-block; width: 3.2ch; margin-right: 14px; text-align: right; color: #4a5a6d; user-select: none; }
    .kw { color: #ff9ac1; } .st { color: #a5e3a0; } .nu { color: #ffcf7d; } .fn { color: #7cc7ff; } .ty { color: #5fd3c7; } .cm { color: #6d7f94; font-style: italic; } .pu { color: #9fb1c4; }
    .note { margin-top: 14px; padding: 12px 14px; border-radius: 8px; background: #fff8e6; border: 1px solid #f3dfa6; font: 400 15px/1.6 'Inter', sans-serif; color: #5a4a14; }
    .note b { font-family: 'JetBrains Mono', monospace; font-size: 12px; margin-right: 6px; color: #9a6b00; }
    @media (prefers-reduced-motion: reduce) { .scroll { scroll-behavior: auto; } }
  `,
})
export class TechJetbrainsInter {
  protected readonly lines: Tok[][] = CODE.split('\n').map(tokenize);
  protected readonly toc = ['The problem', 'A safer helper', 'Trade-offs'];
  protected readonly active = signal(0);
  protected readonly copied = signal(false);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly tocEl = viewChild.required<ElementRef<HTMLElement>>('tocEl');
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    loadGoogleFonts('JetBrains+Mono:ital,wght@0,400;0,500;0,700;0,800;1,400', 'Inter:wght@400;600');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  async copy(): Promise<void> {
    try { await navigator.clipboard.writeText(CODE); } catch { /* clipboard unavailable */ }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 1600);
  }

  spy(): void {
    const sc = this.scroller().nativeElement;
    const top = sc.getBoundingClientRect().top;
    let idx = 0;
    sc.querySelectorAll<HTMLElement>('.sec').forEach((s, i) => { if (s.getBoundingClientRect().top - top < sc.clientHeight * 0.45) idx = i; });
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) idx = this.toc.length - 1;
    if (idx !== this.active()) {
      this.active.set(idx);
      this.reveal(idx);
    }
  }

  go(i: number): void {
    const sc = this.scroller().nativeElement;
    const s = sc.querySelectorAll<HTMLElement>('.sec')[i];
    // Narrow stages stack a sticky chip rail under the 44px top bar.
    const offset = sc.clientWidth < 860 ? 44 + this.tocEl().nativeElement.offsetHeight + 12 : 60;
    if (s) sc.scrollTo({ top: s.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - offset });
    this.reveal(i);
  }

  /** Keep the active chip visible in the horizontal rail (moves the rail only, never the page). */
  private reveal(i: number): void {
    const rail = this.rail().nativeElement;
    if (rail.scrollWidth <= rail.clientWidth) return;
    const li = rail.children[i] as HTMLElement | undefined;
    if (!li) return;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollTo({ left: li.offsetLeft - rail.offsetLeft - 8, behavior: smooth ? 'smooth' : 'auto' });
  }
}
