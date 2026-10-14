import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

type Range = '1D' | '1W' | '1M';

interface Txn {
  id: number;
  who: string;
  what: string;
  amount: number;
}

const W = 300;
const H = 90;

function series(seed: number, n: number, base: number, vol: number): number[] {
  let x = seed;
  let v = base;
  return Array.from({ length: n }, () => {
    x = (x * 9301 + 49297) % 233280;
    v += ((x / 233280) - 0.45) * vol;
    return v;
  });
}

const POOL: Omit<Txn, 'id'>[] = [
  { who: 'Pret A Manger', what: 'Food & drink', amount: -6.4 },
  { who: 'Acme Studio Ltd', what: 'Invoice #1042 paid', amount: 2400 },
  { who: 'TfL', what: 'Transport', amount: -3.1 },
  { who: 'Figma', what: 'Software', amount: -15 },
  { who: 'Waitrose', what: 'Groceries', amount: -42.75 },
  { who: 'Northwind Co', what: 'Invoice #1043 paid', amount: 880 },
];

@Component({
  selector: 'demo-dashboard-bento-fintech',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bento">
      <section class="tile balance">
        <div class="row">
          <div>
            <p class="lbl">Business account</p>
            <p class="amt">€{{ balanceText() }}</p>
            <p class="chg" [class.neg]="change() < 0">{{ change() >= 0 ? '+' : '' }}{{ change().toFixed(2) }}% {{ range() === '1D' ? 'today' : range() === '1W' ? 'this week' : 'this month' }}</p>
          </div>
          <div class="seg" role="tablist" aria-label="Chart range">
            @for (r of ranges; track r) {
              <button type="button" role="tab" [attr.aria-selected]="range() === r" [class.on]="range() === r" (click)="setRange(r)">{{ r }}</button>
            }
          </div>
        </div>
        <div class="chart">
        <svg class="spark" [attr.viewBox]="'0 0 ' + w + ' ' + h" preserveAspectRatio="none" role="img" [attr.aria-label]="'Balance trend, ' + range()">
          <defs>
            <linearGradient id="fill-fin" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#7cc4ff" stop-opacity=".35" />
              <stop offset="1" stop-color="#7cc4ff" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path [attr.d]="area()" fill="url(#fill-fin)" />
          <path [attr.d]="line()" class="ln" />
        </svg>
        <span class="dot" [style.top.%]="(lastY() / h) * 100" aria-hidden="true"></span>
        </div>
      </section>

      <section class="tile fx">
        <p class="lbl">EUR / USD</p>
        <p class="rate" [class.up]="fxDir() > 0" [class.down]="fxDir() < 0">{{ fx().toFixed(4) }}</p>
        <p class="tiny">{{ fxDir() >= 0 ? '▲' : '▼' }} live mid-market</p>
      </section>

      <section class="tile ring">
        <p class="lbl">October spend</p>
        <div class="donut-wrap">
          <svg viewBox="0 0 42 42" class="donut" aria-hidden="true">
            @for (s of slices; track s.name) {
              <circle cx="21" cy="21" r="15.9155" [attr.stroke]="s.color" [attr.stroke-dasharray]="s.pct + ' ' + (100 - s.pct)" [attr.stroke-dashoffset]="25 - s.offset" />
            }
          </svg>
          <p class="center">€3.2k</p>
        </div>
        <ul class="legend">
          @for (s of slices; track s.name) {
            <li><span [style.background]="s.color"></span>{{ s.name }} {{ s.pct }}%</li>
          }
        </ul>
      </section>

      <section class="tile txns">
        <p class="lbl">Latest activity</p>
        <ul>
          @for (t of txns(); track t.id) {
            <li>
              <span class="ico" [class.in]="t.amount > 0" aria-hidden="true">{{ t.who[0] }}</span>
              <span class="who"><strong>{{ t.who }}</strong><small>{{ t.what }}</small></span>
              <span class="val" [class.in]="t.amount > 0">{{ t.amount > 0 ? '+' : '−' }}€{{ abs(t.amount).toFixed(2) }}</span>
            </li>
          }
        </ul>
      </section>

      <section class="tile goal">
        <p class="lbl">Tax pot · Jan 31</p>
        <p class="amt sm">€6,120 <span>of €9,000</span></p>
        <div class="bar"><span [style.width.%]="68"></span></div>
      </section>

      <section class="tile week">
        <p class="lbl">Spend by day</p>
        <div class="cols">
          @for (d of week; track d.day) {
            <div
              class="col"
              tabindex="0"
              [class.on]="pickedDay() === d.day"
              [attr.aria-label]="d.day + ': €' + d.v"
              (click)="pickDay(d.day)"
            >
              <span class="tip">€{{ d.v }}</span>
              <span class="b" [style.height.%]="(d.v / 220) * 100"></span>
              <span class="d">{{ d.day[0] }}</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(14px, 3cqi, 28px);
      background: #0d1015; color: #e7ebf2; font-family: 'IBM Plex Sans', 'Geist', sans-serif;
      container-type: inline-size;
    }
    .bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .tile { background: #151a22; border: 1px solid #1f2632; border-radius: 18px; padding: 16px; min-width: 0; transition: border-color .3s; }
    @media (hover: hover) { .tile:hover { border-color: #2f3a4c; } }
    .lbl { font-size: 12.5px; color: #8590a3; }
    .amt { font-family: 'IBM Plex Mono', monospace; font-size: clamp(24px, 3.6cqi, 34px); font-weight: 500; letter-spacing: -0.03em; margin-top: 4px; }
    .amt.sm { font-size: 22px; }
    .amt span { font-size: 13px; color: #8590a3; letter-spacing: 0; }
    .chg { font-size: 13px; color: #6fe3b0; margin-top: 2px; }
    .chg.neg { color: #ff8a70; }
    .balance { grid-column: span 3; grid-row: span 2; display: flex; flex-direction: column; gap: 10px; }
    .row { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
    .seg { display: flex; background: #0d1015; border-radius: 10px; padding: 3px; }
    .seg button { border: 0; background: none; color: #8590a3; font: 500 12.5px 'IBM Plex Mono', monospace; padding: 5px 9px; border-radius: 7px; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .seg button:active { color: #e7ebf2; }
    @media (pointer: coarse) { .seg button { min-height: 38px; min-width: 40px; padding: 5px 10px; } }
    .seg button.on { background: #232b38; color: #e7ebf2; }
    .chart { position: relative; flex: 1; min-height: 120px; display: flex; }
    .spark { width: 100%; flex: 1; overflow: visible; }
    .ln { fill: none; stroke: #7cc4ff; stroke-width: 1.8; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .dot { position: absolute; right: -5px; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: #7cc4ff; border: 2px solid #151a22; box-shadow: 0 0 0 6px rgba(124,196,255,.15); transition: top .4s; }
    .fx { display: flex; flex-direction: column; }
    .rate { font-family: 'IBM Plex Mono', monospace; font-size: 24px; margin-top: auto; transition: color .3s; }
    .rate.up { color: #6fe3b0; }
    .rate.down { color: #ff8a70; }
    .tiny { font-size: 11.5px; color: #8590a3; }
    .ring { grid-row: span 2; display: flex; flex-direction: column; gap: 10px; }
    .donut-wrap { position: relative; width: min(130px, 100%); margin: 4px auto 0; }
    .donut circle { fill: none; stroke-width: 5; transition: stroke-dasharray .8s; }
    .center { position: absolute; inset: 0; display: grid; place-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 15px; }
    .legend { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; font-size: 12.5px; color: #b6bfce; }
    .legend span { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 7px; }
    .txns { grid-column: span 2; grid-row: span 2; }
    .txns ul { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 4px; }
    .txns li { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #1f2632; animation: slideIn .5s cubic-bezier(.2,.8,.2,1); }
    .txns li:last-child { border-bottom: 0; }
    .ico { width: 30px; height: 30px; border-radius: 9px; background: #232b38; display: grid; place-items: center; font-weight: 600; font-size: 13px; flex-shrink: 0; }
    .ico.in { background: #17392f; color: #6fe3b0; }
    .who { flex: 1; min-width: 0; }
    .who strong { display: block; font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .who small { display: block; font-size: 12px; color: #8590a3; }
    .val { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
    .val.in { color: #6fe3b0; }
    .bar { height: 8px; background: #0d1015; border-radius: 99px; overflow: hidden; margin-top: 12px; }
    .bar span { display: block; height: 100%; background: linear-gradient(90deg, #ff7a59, #ffb38a); border-radius: 99px; }
    .week { grid-column: span 2; }
    .cols { display: flex; gap: 6px; height: 92px; align-items: stretch; margin-top: 8px; }
    .col { flex: 1; position: relative; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; outline: none; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .b { width: 100%; max-width: 26px; border-radius: 6px 6px 3px 3px; background: #2a3445; transition: background .2s; }
    .col:focus-visible .b, .col.on .b { background: #7cc4ff; }
    @media (hover: hover) { .col:hover .b { background: #7cc4ff; } .col:hover .tip { opacity: 1; transform: none; } }
    .d { font-size: 11px; color: #8590a3; }
    .tip { position: absolute; top: -6px; font: 500 11px 'IBM Plex Mono', monospace; background: #e7ebf2; color: #0d1015; padding: 2px 6px; border-radius: 6px; opacity: 0; transform: translateY(4px); transition: opacity .2s, transform .2s; pointer-events: none; }
    .col:focus-visible .tip, .col.on .tip { opacity: 1; transform: none; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } }
    @container (max-width: 780px) {
      .bento { grid-template-columns: repeat(2, 1fr); }
      .balance, .txns, .week { grid-column: span 2; }
      .balance, .txns { grid-row: auto; }
    }
    @container (max-width: 420px) {
      .bento { grid-template-columns: 1fr; }
      .balance, .txns, .week, .ring { grid-column: auto; grid-row: auto; }
    }
  `,
})
export class DashboardBentoFintech {
  protected readonly w = W;
  protected readonly h = H;
  protected readonly ranges: Range[] = ['1D', '1W', '1M'];
  protected readonly range = signal<Range>('1D');
  private readonly data = signal<number[]>(series(7, 40, 48000, 120));
  protected readonly balance = computed(() => this.data().at(-1) ?? 0);
  protected readonly balanceText = computed(() =>
    this.balance().toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );
  protected readonly change = computed(() => {
    const d = this.data();
    return ((d[d.length - 1] - d[0]) / d[0]) * 100;
  });
  private readonly bounds = computed(() => {
    const d = this.data();
    const min = Math.min(...d);
    const max = Math.max(...d);
    return { min, span: max - min || 1 };
  });
  private readonly pts = computed(() => {
    const d = this.data();
    const { min, span } = this.bounds();
    return d.map((v, i) => [(i / (d.length - 1)) * W, H - 6 - ((v - min) / span) * (H - 14)] as const);
  });
  protected readonly line = computed(() => this.pts().map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' '));
  protected readonly area = computed(() => `${this.line()} L${W} ${H} L0 ${H} Z`);
  protected readonly lastY = computed(() => this.pts().at(-1)?.[1] ?? 0);

  protected readonly fx = signal(1.0842);
  protected readonly fxDir = signal(0);
  protected readonly txns = signal<Txn[]>(POOL.slice(0, 4).map((t, i) => ({ ...t, id: i })));
  protected readonly slices = [
    { name: 'Software', pct: 38, color: '#7cc4ff', offset: 0 },
    { name: 'Travel', pct: 27, color: '#ff7a59', offset: 38 },
    { name: 'Food', pct: 21, color: '#c9a7ff', offset: 65 },
    { name: 'Other', pct: 14, color: '#3b4658', offset: 86 },
  ];
  protected readonly week = [
    { day: 'Mon', v: 84 }, { day: 'Tue', v: 142 }, { day: 'Wed', v: 66 }, { day: 'Thu', v: 198 },
    { day: 'Fri', v: 175 }, { day: 'Sat', v: 120 }, { day: 'Sun', v: 38 },
  ];
  private readonly visible = hostVisible(0.2);
  private tick = 0;
  private nextId = 10;

  constructor() {
    loadGoogleFonts('IBM+Plex+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;500');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const id = setInterval(() => this.step(), 1300);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  /** Day whose amount is pinned open (tap/click toggles; hover previews with a mouse). */
  protected readonly pickedDay = signal<string | null>(null);

  protected pickDay(day: string): void {
    this.pickedDay.update((d) => (d === day ? null : day));
  }

  protected abs(n: number): number {
    return Math.abs(n);
  }

  protected setRange(r: Range): void {
    this.range.set(r);
    const cfg = { '1D': [7, 120], '1W': [19, 380], '1M': [31, 900] } as const;
    const [seed, vol] = cfg[r];
    this.data.set(series(seed, 40, 46500, vol));
  }

  private step(): void {
    if (!this.visible()) return;
    this.tick++;
    const vol = this.range() === '1D' ? 120 : this.range() === '1W' ? 380 : 900;
    this.data.update((d) => [...d.slice(1), d[d.length - 1] + (Math.random() - 0.42) * vol]);
    const delta = (Math.random() - 0.5) * 0.0012;
    this.fx.update((f) => f + delta);
    this.fxDir.set(Math.sign(delta));
    if (this.tick % 4 === 0) {
      const t = POOL[(this.nextId + 4) % POOL.length];
      this.txns.update((list) => [{ ...t, id: this.nextId++ }, ...list.slice(0, 3)]);
    }
  }
}
