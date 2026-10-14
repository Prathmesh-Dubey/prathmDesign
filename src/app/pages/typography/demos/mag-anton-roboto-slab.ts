import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Row { pos: number; name: string; nat: string; time: string; half: string; }

@Component({
  selector: 'demo-mag-anton-roboto-slab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="ticker" [class.paused]="paused()" aria-label="Latest headlines">
        <button type="button" class="pause" (click)="paused.set(!paused())" [attr.aria-pressed]="paused()" [attr.aria-label]="paused() ? 'Resume headline ticker' : 'Pause headline ticker'">
          @if (paused()) {
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7-4.5z" /></svg>
          } @else {
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" /></svg>
          }
        </button>
        <div class="track">
          @for (rep of [0, 1]; track rep) {
            <span [attr.aria-hidden]="rep === 1">
              @for (h of headlines; track h) { <b>●</b> {{ h }} }
            </span>
          }
        </div>
      </div>

      <header class="hero">
        <img [src]="hero" alt="Feature image for Sub-Two in the Rain" width="1200" height="700" />
        <div class="shade"></div>
        <div class="h-copy">
          <p class="sec">Long Run · Race report</p>
          <h1>Sub-two in the rain</h1>
          <p class="dek">Berlin, 27 September. Wet roads, a headwind on Straße des 17. Juni and a finishing kick nobody saw coming.</p>
        </div>
      </header>

      <section class="stats" aria-label="Race in numbers">
        <div><span class="big">1:59:48</span><span class="lbl">Winning time</span></div>
        <div><span class="big">2:51</span><span class="lbl">Per km, avg</span></div>
        <div><span class="big">11°</span><span class="lbl">At the start</span></div>
        <div><span class="big">46,112</span><span class="lbl">Finishers</span></div>
      </section>

      <div class="cols">
        <article>
          <p class="byl">By <b>Lena Hartmann</b> · 29 Sep 2026 · 7 min read</p>
          <p class="lead">With four kilometres left, the pacing lights on the kerb were twelve metres ahead and the leaders had stopped talking to each other. That is usually when a record attempt dies. Instead, Tesfaye Gebre dropped his shoulders, looked once at the clock above the Brandenburg Gate, and ran the final kilometre in 2:36.</p>
          <p>Conditions were the worst for a fast Berlin in a decade: steady rain from the 15 km mark and a crosswind that pushed the pack into single file. Three of the six pacers stepped off before halfway. The field that remained ran as much on tactics as on lungs.</p>
        </article>

        <aside class="results">
          <div class="tabs" role="tablist" aria-label="Results">
            <button type="button" role="tab" [attr.aria-selected]="div() === 'men'" [class.on]="div() === 'men'" (click)="div.set('men')">Men</button>
            <button type="button" role="tab" [attr.aria-selected]="div() === 'women'" [class.on]="div() === 'women'" (click)="div.set('women')">Women</button>
          </div>
          <table>
            <thead><tr><th scope="col">#</th><th scope="col">Athlete</th><th scope="col" class="half">Half</th><th scope="col">Finish</th></tr></thead>
            <tbody>
              @for (r of rows(); track r.name) {
                <tr><td class="pos">{{ r.pos }}</td><td>{{ r.name }} <small>{{ r.nat }}</small></td><td class="num half">{{ r.half }}</td><td class="num fin">{{ r.time }}</td></tr>
              }
            </tbody>
          </table>
          <div class="key" aria-label="Type specimen">
            <span class="ka">Anton</span><span>400 · uppercase display, stats in tabular figures</span>
            <span class="kb">Roboto Slab</span><span>300 / 400 / 700 · body 17 px on 1.65</span>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #0d1b3e; color: #f2f4f8; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .ticker { position: relative; background: #e63946; color: #fff; overflow: hidden; white-space: nowrap; font: 700 13px/1 'Roboto Slab', serif; padding: 9px 0; }
    .track { display: inline-flex; animation: tick 32s linear infinite; }
    .ticker:hover .track, .ticker.paused .track { animation-play-state: paused; }
    /* Pause control: hover pauses on desktop, this button works on touch and for WCAG 2.2.2. */
    .pause { position: absolute; z-index: 1; top: 0; right: 0; bottom: 0; width: 44px; display: grid; place-items: center; border: 0; padding: 0; cursor: pointer; color: #fff;
      background: linear-gradient(90deg, rgba(230,57,70,0), #e63946 30%); touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pause svg { width: 12px; height: 12px; fill: currentColor; }
    .pause:active svg { transform: scale(.85); }
    .pause:focus-visible { outline: 2px solid #fff; outline-offset: -4px; }
    .track span { padding-right: 20px; }
    .track b { color: #0d1b3e; margin: 0 10px 0 16px; font-size: 9px; vertical-align: 2px; }
    .hero { position: relative; min-height: 330px; display: grid; align-items: end; overflow: hidden; }
    .hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(.4) contrast(1.1); }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13,27,62,.1), rgba(13,27,62,.95)); }
    .h-copy { position: relative; padding: clamp(18px, 4cqi, 40px); }
    .sec { font: 700 13px/1 'Roboto Slab', serif; color: #ff8a93; }
    h1 { font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase; font-size: clamp(54px, 13cqi, 150px); line-height: .86; letter-spacing: -0.005em; margin-top: 10px; text-wrap: balance; }
    .dek { font: 300 clamp(16px, 2.2cqi, 19px)/1.5 'Roboto Slab', serif; max-width: 52ch; margin-top: 12px; color: #dfe4ee; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 4px solid #e63946; }
    @container (max-width: 600px) { .stats { grid-template-columns: repeat(2, 1fr); } }
    .stats div { padding: 16px clamp(14px, 3cqi, 28px); border-right: 1px solid rgba(255,255,255,.12); border-bottom: 1px solid rgba(255,255,255,.12); }
    .big { display: block; font-family: 'Anton', sans-serif; font-size: clamp(30px, 5cqi, 48px); line-height: 1; font-variant-numeric: tabular-nums; }
    .lbl { font: 400 12.5px/1 'Roboto Slab', serif; color: #a9b3c9; }
    .cols { display: grid; gap: 30px; padding: clamp(18px, 4cqi, 40px); }
    @container (min-width: 800px) { .cols { grid-template-columns: minmax(0, 1fr) 340px; gap: 44px; } }
    .byl { font: 400 13px/1 'Roboto Slab', serif; color: #a9b3c9; }
    .byl b { color: #fff; font-weight: 700; }
    article p { font: 400 17px/1.65 'Roboto Slab', serif; max-width: 62ch; text-wrap: pretty; }
    article p + p { margin-top: 1em; }
    .lead { margin-top: 16px; font-weight: 300 !important; font-size: 19px !important; }
    .lead::first-line { font-weight: 700; }
    .tabs { display: flex; border-bottom: 2px solid #e63946; }
    .tabs button { font-family: 'Anton', sans-serif; text-transform: uppercase; font-size: 20px; letter-spacing: .02em; padding: 8px 16px; border: 0; background: transparent; color: #a9b3c9; cursor: pointer; }
    .tabs button.on { background: #e63946; color: #fff; }
    table { width: 100%; border-collapse: collapse; font: 400 14px/1.3 'Roboto Slab', serif; margin-top: 4px; }
    th { text-align: left; font-weight: 700; font-size: 11.5px; color: #a9b3c9; padding: 8px 6px; }
    td { padding: 10px 6px; border-bottom: 1px solid rgba(255,255,255,.12); animation: fade .35s ease-out both; }
    td small { color: #a9b3c9; font-size: 11px; }
    .pos { font-family: 'Anton', sans-serif; font-size: 20px; color: #e63946; width: 28px; }
    .num { font-variant-numeric: tabular-nums; text-align: right; }
    .fin { font-weight: 700; }
    tr:hover td { background: rgba(255,255,255,.04); }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; align-items: baseline; margin-top: 22px; padding: 14px; border: 1px solid rgba(255,255,255,.18); font: 400 12px/1.4 'Roboto Slab', serif; color: #a9b3c9; }
    .ka { font: 400 24px/1 'Anton', sans-serif; color: #fff; text-transform: uppercase; }
    .kb { font: 700 17px/1 'Roboto Slab', serif; color: #fff; }
    .tabs button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tabs button:not(.on):active { background: rgba(230,57,70,.25); }
    @media (hover: none) { tr:hover td { background: none; } }
    @container (max-width: 420px) { .half { display: none; } td { padding: 10px 4px; } .tabs button { flex: 1; } }
    @keyframes tick { to { transform: translateX(-50%); } }
    @keyframes fade { from { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .track { animation: none; } td { animation: none; } }
  `,
})
export class MagAntonRobotoSlab {
  protected readonly hero = photo('longrun-berlin', 1200, 700);
  protected readonly div = signal<'men' | 'women'>('men');
  protected readonly paused = signal(false);
  protected readonly headlines = [
    'Chicago entries reopen for charity places',
    'Track worlds: 1500 m final rescheduled to Saturday',
    'Interview: the coach behind three national records',
    'Shoe review — six super-trainers tested over 400 km',
  ];
  private readonly data: Record<'men' | 'women', Row[]> = {
    men: [
      { pos: 1, name: 'Tesfaye Gebre', nat: 'ETH', half: '59:58', time: '1:59:48' },
      { pos: 2, name: 'Daniel Kiprop', nat: 'KEN', half: '59:58', time: '2:00:31' },
      { pos: 3, name: 'Yusuke Mori', nat: 'JPN', half: '1:00:12', time: '2:02:09' },
      { pos: 4, name: 'Bashir Abdi Noor', nat: 'BEL', half: '1:00:40', time: '2:03:15' },
    ],
    women: [
      { pos: 1, name: 'Mercy Chelangat', nat: 'KEN', half: '1:06:20', time: '2:13:02' },
      { pos: 2, name: 'Almaz Tadesse', nat: 'ETH', half: '1:06:21', time: '2:13:40' },
      { pos: 3, name: 'Sifan Worku', nat: 'NED', half: '1:07:05', time: '2:15:58' },
      { pos: 4, name: 'Hanna Lindqvist', nat: 'SWE', half: '1:08:11', time: '2:18:24' },
    ],
  };
  protected readonly rows = computed(() => this.data[this.div()]);

  constructor() {
    loadGoogleFonts('Anton', 'Roboto+Slab:wght@300;400;700');
  }
}
