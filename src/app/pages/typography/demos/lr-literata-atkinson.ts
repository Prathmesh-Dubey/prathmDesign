import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

type Theme = 'paper' | 'sepia' | 'night';
type Face = 'serif' | 'sans';

@Component({
  selector: 'demo-lr-literata-atkinson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-theme]': 'theme()', '(document:click)': 'outside($event)', '(keydown.escape)': 'panel.set(false)' },
  template: `
    <div class="scroll">
      <div class="toolbar">
        <span class="pub">Slow Water Review</span>
        <button type="button" class="aa" (click)="panel.set(!panel())" [attr.aria-expanded]="panel()" aria-label="Reading settings">
          <span class="s">A</span><span class="l">A</span>
        </button>
        @if (panel()) {
          <div class="panel" role="group" aria-label="Reading settings">
            <label><span>Size <output>{{ size() }}px</output></span>
              <input type="range" min="15" max="24" step="1" [value]="size()" (input)="size.set(num($event))" /></label>
            <label><span>Line height <output>{{ lead().toFixed(2) }}</output></span>
              <input type="range" min="1.3" max="2.0" step="0.05" [value]="lead()" (input)="lead.set(num($event))" /></label>
            <div class="seg" role="group" aria-label="Line length">
              @for (m of measures; track m) {
                <button type="button" [class.on]="measure() === m" [attr.aria-pressed]="measure() === m" (click)="measure.set(m)">{{ m }}ch</button>
              }
            </div>
            <div class="seg" role="group" aria-label="Typeface">
              <button type="button" class="f-serif" [class.on]="face() === 'serif'" [attr.aria-pressed]="face() === 'serif'" (click)="face.set('serif')">Literata</button>
              <button type="button" class="f-sans" [class.on]="face() === 'sans'" [attr.aria-pressed]="face() === 'sans'" (click)="face.set('sans')">Atkinson</button>
            </div>
            <div class="themes" role="group" aria-label="Theme">
              @for (t of themes; track t) {
                <button type="button" [class]="'th th-' + t" [class.on]="theme() === t" [attr.aria-pressed]="theme() === t" (click)="theme.set(t)" [attr.aria-label]="t + ' theme'"></button>
              }
            </div>
          </div>
        }

      </div>

      <article [style.max-width]="maxW()" [class.sans]="face() === 'sans'">
        <p class="sec">Essay · Rivers</p>
        <h1>What the River Remembers</h1>
        <p class="by">Tomasz Ołdak · 25 min read</p>
        <div class="body" [style.font-size.px]="size()" [style.line-height]="lead()">
          <p>The Vistula floods in the spring, the way it always has, and every spring the town of Kazimierz Dolny puts its sandbags out along the embankment as if this were a surprise. The river does not mind. It has been taking the same path to the Baltic for ten thousand years, and the town is only seven hundred years old.</p>
          <p>A river, a hydrologist once told me, is not a thing but a habit. It is water doing what water did yesterday, in the place where it did it. Straighten it with concrete and it will spend a century trying to bend back. Dam it and it will quietly fill the reservoir with silt, patiently, a millimetre a year.</p>
          <p>We like to talk about rivers forgetting — losing their wetlands, their fish, their old meanders. But walk the floodplain after the water drops and you will see that the river remembers everything. The old channels show up as lines of darker grass. The willows stand where the bank used to be.</p>
        </div>
      </article>

      <footer class="key" aria-label="Current type settings">
        <span class="kf">{{ face() === 'serif' ? 'Literata' : 'Atkinson Hyperlegible' }}</span>
        <span>{{ size() }} / {{ px() }} px · {{ measure() }}ch measure · {{ theme() }}</span>
        <span class="alt">Headline: Literata 600, opsz 72 · UI: Atkinson Hyperlegible 400 / 700</span>
      </footer>
    </div>
  `,
  styles: `
    :host { --bg: #fdfdfc; --ink: #1d2126; --mut: #66707a; --line: #e4e6e8; --acc: #2b6cb0; --panel: #ffffff;
      display: block; position: relative; min-height: 680px; background: var(--bg); color: var(--ink); container-type: inline-size; transition: background .3s, color .3s; }
    :host([data-theme='sepia']) { --bg: #f4ecd8; --ink: #3b2f1e; --mut: #7c6a50; --line: #e2d5b8; --acc: #9a5b13; --panel: #fbf5e6; }
    :host([data-theme='night']) { --bg: #14171c; --ink: #d7dce2; --mut: #8b95a1; --line: #2a3038; --acc: #8ab4f8; --panel: #1c2027; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .toolbar { position: sticky; top: 0; z-index: 3; display: flex; justify-content: space-between; align-items: center; padding: 10px clamp(16px, 4cqi, 32px); background: var(--bg); border-bottom: 1px solid var(--line); transition: background .3s; }
    .pub { font: 700 14px/1 'Atkinson Hyperlegible', sans-serif; letter-spacing: .01em; }
    .aa { display: inline-flex; align-items: baseline; gap: 1px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-family: 'Literata', serif; }
    .aa .s { font-size: 13px; } .aa .l { font-size: 19px; }
    .panel { position: absolute; top: calc(100% + 8px); right: clamp(12px, 3cqi, 24px); width: min(320px, calc(100% - 24px)); display: grid; gap: 14px; padding: 16px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 18px 40px -20px rgba(0,0,0,.35); font: 400 13px/1 'Atkinson Hyperlegible', sans-serif; animation: drop .2s ease-out; }
    .panel label { display: grid; gap: 8px; }
    .panel label span { display: flex; justify-content: space-between; }
    output { font-weight: 700; font-variant-numeric: tabular-nums; }
    input[type='range'] { width: 100%; accent-color: var(--acc); }
    .seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; border: 1px solid var(--line); border-radius: 9px; overflow: hidden; }
    .seg button { border: 0; background: transparent; color: var(--ink); padding: 8px 6px; cursor: pointer; font: 400 13px/1 'Atkinson Hyperlegible', sans-serif; }
    .seg button + button { border-left: 1px solid var(--line); }
    .seg button.on { background: var(--ink); color: var(--bg); }
    .seg .f-serif { font-family: 'Literata', serif; }
    .themes { display: flex; gap: 10px; }
    .th { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--line); cursor: pointer; }
    .th.on { border-color: var(--acc); box-shadow: 0 0 0 2px var(--panel), 0 0 0 4px var(--acc); }
    .th-paper { background: #fdfdfc; } .th-sepia { background: #f4ecd8; } .th-night { background: #14171c; }
    article { font-family: 'Literata', serif; font-size: 16px; margin: 0 auto; padding: clamp(24px, 6cqi, 56px) clamp(18px, 5cqi, 32px) 10px; box-sizing: content-box; }
    .sec { font: 700 12.5px/1 'Atkinson Hyperlegible', sans-serif; color: var(--acc); }
    h1 { font-family: 'Literata', serif; font-optical-sizing: auto; font-weight: 600; font-size: clamp(32px, 6cqi, 54px); line-height: 1.08; letter-spacing: -0.015em; margin-top: 12px; text-wrap: balance; }
    .by { font: 400 14px/1 'Atkinson Hyperlegible', sans-serif; color: var(--mut); margin-top: 14px; }
    .body { font-family: 'Literata', serif; font-optical-sizing: auto; margin-top: 26px; transition: font-size .2s, line-height .2s; }
    .sans .body { font-family: 'Atkinson Hyperlegible', sans-serif; }
    .body p { text-wrap: pretty; hanging-punctuation: first; }
    .body p + p { margin-top: .9em; }
    .key { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: baseline; margin: 30px auto 0; max-width: 760px; padding: 16px clamp(18px, 5cqi, 32px) 30px; border-top: 1px solid var(--line); font: 400 12.5px/1.4 'Atkinson Hyperlegible', sans-serif; color: var(--mut); font-variant-numeric: tabular-nums; }
    .kf { font: 600 18px/1 'Literata', serif; color: var(--ink); }
    .alt { flex-basis: 100%; }
    .panel { overscroll-behavior: contain; }
    input[type='range'] { touch-action: pan-y; cursor: pointer; }
    .aa, .seg button, .th { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .aa:active, .th:active { transform: scale(.94); }
    .seg button:not(.on):active { background: var(--line); }
    @media (pointer: coarse) {
      .aa { min-width: 44px; min-height: 40px; justify-content: center; }
      .seg button { min-height: 42px; font-size: 14px; }
      .th { width: 42px; height: 42px; }
      .themes { gap: 14px; }
      /* Bigger, finger-friendly slider: 28px thumb on a 40px-tall hit strip. */
      input[type='range'] { -webkit-appearance: none; appearance: none; height: 40px; margin: 0; background: transparent; }
      input[type='range']::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: var(--line); }
      input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; margin-top: -11px; border-radius: 50%; background: var(--acc); border: 3px solid var(--panel); box-shadow: 0 1px 4px rgba(0,0,0,.3); }
      input[type='range']::-moz-range-track { height: 6px; border-radius: 999px; background: var(--line); }
      input[type='range']::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--acc); border: 3px solid var(--panel); box-shadow: 0 1px 4px rgba(0,0,0,.3); }
      .panel { gap: 12px; font-size: 14px; }
    }
    /* Phones: the settings panel becomes a full-width sheet under the toolbar. */
    @container (max-width: 520px) {
      .panel { left: 10px; right: 10px; width: auto; max-height: min(70vh, 460px); overflow: auto; }
    }
    @keyframes drop { from { opacity: 0; transform: translateY(-6px); } }
    @media (prefers-reduced-motion: reduce) { :host, .body, .toolbar { transition: none; } .panel { animation: none; } }
  `,
})
export class LrLiterataAtkinson {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly panel = signal(true);
  protected readonly size = signal(19);
  protected readonly lead = signal(1.65);
  protected readonly measures = [55, 65, 75];
  protected readonly measure = signal(65);
  protected readonly themes: Theme[] = ['paper', 'sepia', 'night'];
  protected readonly theme = signal<Theme>('paper');
  protected readonly face = signal<Face>('serif');
  protected readonly px = computed(() => Math.round(this.size() * this.lead()));
  protected readonly maxW = computed(() => `calc(${this.measure()}ch * ${this.size() / 16})`);

  constructor() {
    loadGoogleFonts('Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700', 'Atkinson+Hyperlegible:wght@400;700');
  }

  /** Tap outside the panel (and outside the Aa toggle) closes it. */
  outside(e: Event): void {
    if (!this.panel()) return;
    const t = e.target as Element | null;
    if (t && this.host.contains(t) && t.closest('.panel, .aa')) return;
    this.panel.set(false);
  }

  num(e: Event): number {
    return +(e.target as HTMLInputElement).value;
  }
}
