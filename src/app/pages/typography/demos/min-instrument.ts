import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Entry { id: number; date: string; year: number; title: string; em?: string; mins: number; ex: string; }

@Component({
  selector: 'demo-min-instrument',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header>
          <p class="name">Noor Halabi</p>
          <p class="bio">Type designer in Amman. I write here about <em>letters</em>, tools, and the slow work of drawing an alphabet.</p>
        </header>

        <div class="years" role="group" aria-label="Filter by year">
          @for (y of years; track y) {
            <button type="button" [class.on]="year() === y" [attr.aria-pressed]="year() === y" (click)="year.set(y)">{{ y === 0 ? 'All' : y }}</button>
          }
          <span class="count">{{ list().length }} posts</span>
        </div>

        <ul class="list">
          @for (e of list(); track e.id) {
            <li>
              <a href="#" (click)="$event.preventDefault()" (pointerenter)="enter($event, e.id)" (focus)="hover.set(e.id)" (pointerleave)="leave($event)" (blur)="hover.set(0)" [class.dim]="hover() !== 0 && hover() !== e.id">
                <time>{{ e.date }}</time>
                <span class="t">{{ e.title }} @if (e.em) { <em>{{ e.em }}</em> }</span>
                <span class="m">{{ e.mins }} min</span>
                <span class="ex" [class.show]="hover() === e.id">{{ e.ex }}</span>
              </a>
            </li>
          }
        </ul>

        <footer class="key" aria-label="Type specimen">
          <span><i class="s">Instrument Serif</i> 400 &amp; italic — titles 28 px</span>
          <span><i class="n">Instrument Sans</i> 400 / 500 — text 15 px, dates tabular</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 600px; background: #fafafa; color: #111; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 720px; margin: 0 auto; padding: clamp(28px, 7cqi, 72px) clamp(18px, 5cqi, 40px) 36px; }
    .name { font: 400 clamp(36px, 6cqi, 52px)/1 'Instrument Serif', serif; letter-spacing: -0.01em; }
    .bio { font: 400 16px/1.55 'Instrument Sans', sans-serif; color: #555; margin-top: 14px; max-width: 46ch; text-wrap: pretty; }
    .bio em { font-family: 'Instrument Serif', serif; font-size: 1.2em; color: #111; }
    .years { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 36px; font: 500 13px/1 'Instrument Sans', sans-serif; }
    .years button { border: 0; background: none; padding: 6px 10px; border-radius: 6px; color: #888; cursor: pointer; font-variant-numeric: tabular-nums; transition: color .2s, background .2s; }
    .years button:hover { color: #111; }
    .years button.on { background: #111; color: #fafafa; }
    .count { margin-left: auto; color: #999; font-weight: 400; }
    .list { list-style: none; padding: 0; margin: 16px 0 0; border-top: 1px solid #e6e6e6; }
    .list a { display: grid; grid-template-columns: 76px 1fr auto; gap: 4px 18px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid #e6e6e6; text-decoration: none; transition: opacity .25s; }
    .list a.dim { opacity: .35; }
    time { font: 400 13px/1 'Instrument Sans', sans-serif; color: #888; font-variant-numeric: tabular-nums; }
    .t { font: 400 clamp(22px, 3.4cqi, 28px)/1.15 'Instrument Serif', serif; text-wrap: balance; background: linear-gradient(#2f5bea, #2f5bea) 0 100% / 0 1px no-repeat; transition: background-size .35s cubic-bezier(.2,.8,.2,1); }
    .t em { font-style: italic; }
    .list a:hover .t, .list a:focus-visible .t { background-size: 100% 1px; }
    .m { font: 400 13px/1 'Instrument Sans', sans-serif; color: #888; }
    .ex { grid-column: 2 / 4; font: 400 15px/1.55 'Instrument Sans', sans-serif; color: #555; max-width: 56ch; overflow: hidden; max-height: 0; opacity: 0; transition: max-height .35s ease, opacity .3s ease, margin .35s ease; }
    .ex.show { max-height: 160px; opacity: 1; margin-top: 6px; }
    /* Touch screens have no hover: show every excerpt up front. */
    @media (hover: none) { .ex { max-height: 160px; opacity: 1; margin-top: 6px; } .list a.dim { opacity: 1; } }
    .list a { -webkit-tap-highlight-color: transparent; }
    .list a:active .t { background-size: 100% 1px; }
    .years button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .years button:not(.on):active { background: #ececec; }
    @media (pointer: coarse) { .years button { min-height: 40px; padding: 0 14px; } }
    @container (max-width: 480px) { .ex { font-size: 16px; } }
    @container (max-width: 480px) { .list a { grid-template-columns: 1fr auto; } time { grid-column: 1 / -1; } .ex { grid-column: 1 / -1; } }
    .key { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 30px; font: 400 12px/1.4 'Instrument Sans', sans-serif; color: #999; }
    .key i { font-style: normal; color: #111; margin-right: 4px; }
    .key .s { font-family: 'Instrument Serif', serif; font-size: 17px; }
    .key .n { font-weight: 500; font-size: 13px; }
    @media (prefers-reduced-motion: reduce) { .ex, .t, .list a { transition: none; } }
  `,
})
export class MinInstrument {
  protected readonly years = [0, 2026, 2025, 2024];
  protected readonly year = signal(0);
  protected readonly hover = signal(0);
  private readonly entries: Entry[] = [
    { id: 1, date: '06 Oct', year: 2026, title: 'Drawing the Arabic', em: 'kaf', mins: 6, ex: 'Three weeks on one letter, and why its tail decides the rhythm of a whole paragraph.' },
    { id: 2, date: '21 Aug', year: 2026, title: 'Spacing is most of the work', mins: 4, ex: 'Notes from re-spacing a 900-glyph family after a client said it “felt tight”.' },
    { id: 3, date: '02 May', year: 2026, title: 'A brush, a reed, a mouse', mins: 9, ex: 'Comparing the same word written with three tools, and what each one refuses to do.' },
    { id: 4, date: '14 Nov', year: 2025, title: 'On fonts that', em: 'whisper', mins: 5, ex: 'Low-contrast text faces for small screens and why they look boring at specimen sizes.' },
    { id: 5, date: '30 Jul', year: 2025, title: 'Kerning tables I am not proud of', mins: 7, ex: 'A short confession and a long list of exceptions.' },
    { id: 6, date: '11 Jan', year: 2024, title: 'Why I left the agency', mins: 3, ex: 'Not a dramatic story. Mostly about wanting to finish things.' },
  ];
  enter(ev: PointerEvent, id: number): void {
    if (ev.pointerType === 'mouse') this.hover.set(id);
  }

  leave(ev: PointerEvent): void {
    if (ev.pointerType === 'mouse') this.hover.set(0);
  }

  protected readonly list = computed(() => (this.year() === 0 ? this.entries : this.entries.filter((e) => e.year === this.year())));

  constructor() {
    loadGoogleFonts('Instrument+Serif:ital@0;1', 'Instrument+Sans:wght@400;500');
  }
}
