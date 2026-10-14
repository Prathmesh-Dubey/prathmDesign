import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Stop { time: string; place: string; note: string; }
interface Day { n: number; title: string; lede: string; stops: Stop[]; imgs: string[]; }

@Component({
  selector: 'demo-life-crimson-sora',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <header class="hero">
        <img [src]="cover" alt="Cover image for Three slow days in Matera" width="1400" height="700" />
        <div class="veil"></div>
        <div class="hc">
          <p class="loc">Basilicata, Italy · 40.66° N, 16.61° E</p>
          <h1>Three slow days in <em>Matera</em></h1>
          <p class="by">Words &amp; photographs by Zara Whitfield · September 2026 · 9 min</p>
        </div>
      </header>

      <div class="wrap">
        <p class="intro">I came for the cave hotels everyone photographs. I stayed for the long lunches, the evening passeggiata along Via Ridola, and the moment each night when the old town lights up all at once like someone flipped a single switch.</p>

        <div class="days" role="tablist" aria-label="Itinerary days">
          @for (d of days; track d.n) {
            <button type="button" role="tab" [attr.aria-selected]="day() === d.n" [class.on]="day() === d.n" (click)="day.set(d.n)" (keydown.arrowright)="step(1)" (keydown.arrowleft)="step(-1)">
              <span class="dn">Day {{ d.n }}</span><span class="dt">{{ d.title }}</span>
            </button>
          }
        </div>

        @let d = current();
        <section class="panel" role="tabpanel" [attr.aria-label]="'Day ' + d.n" (pointerdown)="swipeStart($event)" (pointerup)="swipeEnd($event)" (pointercancel)="swipeId = -1">
          @for (x of [d]; track x.n) {
            <div class="grid">
              <div>
                <p class="lede">{{ x.lede }}</p>
                <ol class="stops">
                  @for (s of x.stops; track s.time) {
                    <li><time>{{ s.time }}</time><div><b>{{ s.place }}</b><p>{{ s.note }}</p></div></li>
                  }
                </ol>
              </div>
              <div class="pics">
                @for (src of x.imgs; track src; let i = $index) {
                  <img [src]="src" [alt]="'Day ' + x.n + ' photo ' + (i + 1)" width="500" height="600" loading="lazy" />
                }
              </div>
            </div>
          }
        </section>

        <footer class="key" aria-label="Type specimen">
          <span class="kc">Crimson Pro</span><span>300 italic &amp; 400 · headline 44–88 px, ledes 22 px</span>
          <span class="ks">Sora</span><span>300 / 400 / 600 · itinerary text 15 px, times tabular</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 700px; background: #e9e8e3; color: #1d2a44; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .hero { position: relative; min-height: 340px; display: grid; align-items: end; overflow: hidden; }
    .hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(29,42,68,0) 30%, rgba(29,42,68,.85)); }
    .hc { position: relative; padding: clamp(18px, 5cqi, 44px); color: #f6f1e6; }
    .loc { font: 400 12.5px/1 'Sora', sans-serif; color: #e9cf8f; font-variant-numeric: tabular-nums; }
    h1 { font-family: 'Crimson Pro', serif; font-weight: 400; font-size: clamp(44px, 9cqi, 92px); line-height: .95; letter-spacing: -0.02em; margin-top: 12px; text-wrap: balance; }
    h1 em { font-style: italic; font-weight: 300; color: #e9cf8f; }
    .by { font: 300 13px/1.4 'Sora', sans-serif; margin-top: 12px; opacity: .9; }
    .wrap { max-width: 980px; margin: 0 auto; padding: clamp(20px, 4cqi, 40px) clamp(16px, 4cqi, 36px) 36px; }
    .intro { font: 400 clamp(20px, 2.8cqi, 25px)/1.5 'Crimson Pro', serif; max-width: 58ch; text-wrap: pretty; hanging-punctuation: first; }
    .days { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 26px; }
    .days button { display: grid; gap: 4px; text-align: left; padding: 12px 14px; border-radius: 12px; border: 1px solid #cfccc2; background: #f4f3ef; color: #1d2a44; cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
    .days button.on { background: #1d2a44; color: #f6f1e6; border-color: #1d2a44; }
    .dn { font: 600 11.5px/1 'Sora', sans-serif; color: #c99a2e; }
    .dt { font: 400 italic 19px/1.15 'Crimson Pro', serif; }
    .panel { margin-top: 18px; }
    .grid { display: grid; gap: 22px; animation: in .45s cubic-bezier(.2,.8,.2,1); }
    @container (min-width: 760px) { .grid { grid-template-columns: 1.1fr 1fr; gap: 36px; } }
    .lede { font: 300 italic 22px/1.45 'Crimson Pro', serif; color: #33415e; max-width: 46ch; }
    .stops { list-style: none; padding: 0; margin: 16px 0 0; border-left: 2px solid #c99a2e; }
    .stops li { display: grid; grid-template-columns: 64px 1fr; gap: 12px; padding: 10px 0 10px 16px; position: relative; }
    .stops li::before { content: ''; position: absolute; left: -6px; top: 16px; width: 10px; height: 10px; border-radius: 50%; background: #e9e8e3; border: 2px solid #c99a2e; }
    time { font: 600 13px/1.6 'Sora', sans-serif; font-variant-numeric: tabular-nums; color: #8a6a1d; }
    .stops b { font: 600 15px/1.4 'Sora', sans-serif; }
    .stops p { font: 300 14.5px/1.6 'Sora', sans-serif; color: #44506a; margin-top: 2px; }
    .pics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-content: start; }
    .pics img { width: 100%; aspect-ratio: 5 / 6; object-fit: cover; border-radius: 10px; }
    .pics img:first-child { grid-column: span 2; aspect-ratio: 16 / 10; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 30px; padding-top: 14px; border-top: 1px solid #cfccc2; font: 300 12.5px/1.4 'Sora', sans-serif; color: #5a6680; }
    .kc { font: 400 italic 22px/1 'Crimson Pro', serif; color: #1d2a44; }
    .ks { font: 600 15px/1 'Sora', sans-serif; color: #1d2a44; }
    @container (max-width: 480px) { .dt { font-size: 15px; } .days button { padding: 10px; } }
    @container (max-width: 520px) { .stops p { font-size: 16px; } .stops li { grid-template-columns: 52px 1fr; } }
    .days button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .days button:not(.on):active { background: #e3e1d9; }
    /* Horizontal swipes on the day panel step between days; vertical drags still scroll. */
    .panel { touch-action: pan-y; }
    @keyframes in { from { opacity: 0; transform: translateY(10px); } }
    @media (prefers-reduced-motion: reduce) { .grid { animation: none; } }
  `,
})
export class LifeCrimsonSora {
  protected readonly cover = photo('matera-slow-days', 1400, 700);
  protected readonly day = signal(1);
  protected readonly days: Day[] = [
    { n: 1, title: 'Into the Sassi', lede: 'Arrive by the slow train from Bari and let the old town reveal itself one staircase at a time.', imgs: [photo('matera-d1a', 800, 500), photo('matera-d1b', 500, 600), photo('matera-d1c', 500, 600)], stops: [
      { time: '11:40', place: 'Matera Centrale', note: 'The FAL narrow-gauge line from Bari takes 90 minutes. Sit on the left.' },
      { time: '13:30', place: 'Lunch at Oi Marì', note: 'Peperoni cruschi crumbled over everything. Order the cavatelli.' },
      { time: '17:00', place: 'Sasso Caveoso walk', note: 'Head down, not up — the views come at you as you climb back.' },
    ] },
    { n: 2, title: 'Churches in the rock', lede: 'A morning with frescoes cut into the cliffs, and an afternoon doing almost nothing.', imgs: [photo('matera-d2a', 800, 500), photo('matera-d2b', 500, 600), photo('matera-d2c', 500, 600)], stops: [
      { time: '09:00', place: 'Santa Maria de Idris', note: 'Go at opening; the light inside is softest before ten.' },
      { time: '12:30', place: 'Panificio del Sole', note: 'Pane di Matera, still warm, eaten on the steps outside.' },
      { time: '20:00', place: 'Belvedere Murgia Timone', note: 'Cross the gorge at dusk to watch the town light up.' },
    ] },
    { n: 3, title: 'Out to the Murgia', lede: 'Lace up for the ravine trail, then a long, deserved lunch in the countryside.', imgs: [photo('matera-d3a', 800, 500), photo('matera-d3b', 500, 600), photo('matera-d3c', 500, 600)], stops: [
      { time: '08:30', place: 'Tibetan bridge trail', note: 'Steep but short. Bring water; there’s no shade until the bridge.' },
      { time: '13:00', place: 'Masseria lunch', note: 'Book ahead. Six courses, all of them vegetables, all of them excellent.' },
      { time: '18:30', place: 'Via Ridola passeggiata', note: 'Join the whole town for the evening stroll. Gelato is mandatory.' },
    ] },
  ];
  protected readonly current = computed(() => this.days[this.day() - 1]);

  constructor() {
    loadGoogleFonts('Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400', 'Sora:wght@300;400;600');
  }

  protected swipeId = -1;
  private sx = 0;
  private sy = 0;

  swipeStart(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.swipeId = e.pointerId;
    this.sx = e.clientX;
    this.sy = e.clientY;
  }

  swipeEnd(e: PointerEvent): void {
    if (e.pointerId !== this.swipeId) return;
    this.swipeId = -1;
    const dx = e.clientX - this.sx;
    const dy = e.clientY - this.sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const n = this.day() + (dx < 0 ? 1 : -1);
      if (n >= 1 && n <= this.days.length) this.day.set(n);
    }
  }

  step(dir: number): void {
    const n = ((this.day() - 1 + dir + this.days.length) % this.days.length) + 1;
    this.day.set(n);
  }
}
