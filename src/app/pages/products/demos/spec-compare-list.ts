import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Key = 'case' | 'reserve' | 'water' | 'weight' | 'price';

interface Watch {
  id: string;
  name: string;
  movement: string;
  img: string;
  alt: string;
  case: number;
  reserve: number;
  water: number;
  weight: number;
  price: number;
}

interface Col {
  key: Key;
  label: string;
  unit: string;
  best: 'max' | 'min' | 'none';
}

@Component({
  selector: 'demo-spec-compare-list',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <header>
        <div>
          <h3>Compare automatics</h3>
          <p>{{ rows().length }} models · pin one to see the difference</p>
        </div>
        <label class="switch">
          <input type="checkbox" [checked]="highlight()" (change)="highlight.set(!highlight())" />
          <span class="knob" aria-hidden="true"></span>
          Highlight best
        </label>
      </header>

      <div class="scroll" tabindex="0" aria-label="Comparison table, scroll horizontally on small screens">
        <table>
          <thead>
            <tr>
              <th scope="col" class="model">Model</th>
              @for (c of cols; track c.key) {
                <th scope="col" [attr.aria-sort]="sortKey() === c.key ? (asc() ? 'ascending' : 'descending') : 'none'">
                  <button type="button" (click)="sort(c.key)" [class.on]="sortKey() === c.key">
                    {{ c.label }}
                    <svg viewBox="0 0 12 12" aria-hidden="true" [class.desc]="sortKey() === c.key && !asc()"><path d="M3 7.5L6 4.5l3 3" /></svg>
                  </button>
                </th>
              }
              <th scope="col"><span class="visually-hidden">Pin</span></th>
            </tr>
          </thead>
          <tbody>
            @for (w of rows(); track w.id) {
              <tr [class.pinned]="pin() === w.id">
                <th scope="row" class="model">
                  <div class="mcell">
                    <img [src]="w.img" [appImgFallback]="w.id" [alt]="w.alt" />
                    <span><strong>{{ w.name }}</strong><small>{{ w.movement }}</small></span>
                  </div>
                </th>
                @for (c of cols; track c.key) {
                  <td [class.best]="highlight() && best()[c.key] === w[c.key]">
                    <span class="v">{{ show(c, w[c.key]) }}</span>
                    @if (base(); as b) {
                      @if (b.id !== w.id && w[c.key] !== b[c.key]) {
                        <span class="delta" [class.up]="better(c, w[c.key] - b[c.key]) === true" [class.down]="better(c, w[c.key] - b[c.key]) === false">{{ delta(c, w[c.key] - b[c.key]) }}</span>
                      }
                    }
                  </td>
                }
                <td class="pin-cell">
                  <button type="button" class="pin" (click)="pin.set(pin() === w.id ? null : w.id)" [attr.aria-pressed]="pin() === w.id"
                    [attr.aria-label]="(pin() === w.id ? 'Unpin ' : 'Pin ') + w.name + ' as baseline'">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3h6l-1 5 3 3H5l3-3-1-5zM10 11v6" /></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    :host { display: grid; place-items: center; min-height: 100%; padding: 26px 14px; background: #e8ecf3; font-family: 'IBM Plex Sans', sans-serif; color: #0f1b33; container-type: inline-size; }
    .shell { width: min(980px, 100%); min-width: 0; background: #fff; border: 1px solid #d3dae6; border-radius: 12px; overflow: hidden; }
    header { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; border-bottom: 1px solid #e3e8f0; flex-wrap: wrap; }
    h3 { font-size: 20px; font-weight: 600; }
    header p { font-size: 13px; color: #5b6880; margin-top: 2px; }
    .switch { display: inline-flex; align-items: center; gap: 10px; font-size: 13.5px; cursor: pointer; user-select: none; }
    .switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
    .knob { width: 38px; height: 22px; border-radius: 11px; background: #c9d1de; position: relative; transition: background .2s; }
    .knob::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.3,1.4,.5,1); box-shadow: 0 1px 2px rgba(0,0,0,.2); }
    .switch input:checked + .knob { background: #1d4ed8; }
    .switch input:checked + .knob::after { transform: translateX(16px); }
    .switch input:focus-visible + .knob { outline: 2px solid #1d4ed8; outline-offset: 2px; }
    .scroll { overflow-x: auto; outline: none; overscroll-behavior-x: contain; }
    button, .switch { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .switch { min-height: 40px; }
    .scroll:focus-visible { box-shadow: inset 0 0 0 2px #1d4ed8; }
    table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 12px 14px; text-align: right; border-bottom: 1px solid #edf0f5; white-space: nowrap; }
    thead th { font-weight: 500; font-size: 12px; color: #5b6880; background: #f6f8fb; position: sticky; top: 0; }
    thead button { display: inline-flex; align-items: center; gap: 4px; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; padding: 4px 6px; border-radius: 6px; }
    @media (hover: hover) { thead button:hover { background: #e8edf5; } }
    thead button:active { background: #e8edf5; }
    @media (pointer: coarse) { thead button { padding: 10px 8px; } .pin { width: 40px; height: 40px; } }
    thead button.on { color: #1d4ed8; font-weight: 600; }
    thead svg { width: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; opacity: .6; transition: transform .2s; }
    thead svg.desc { transform: rotate(180deg); }
    .model { text-align: left; position: sticky; left: 0; background: #fff; z-index: 1; }
    thead .model { background: #f6f8fb; z-index: 2; }
    th.model { font-weight: 400; }
    .mcell { display: flex; align-items: center; gap: 12px; }
    th.model img { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; }
    th.model strong { display: block; font-weight: 600; font-size: 14px; }
    th.model small { color: #5b6880; font-size: 12px; font-family: 'IBM Plex Mono', monospace; }
    td { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; transition: background .25s; }
    td.best { background: #eaf1ff; color: #1d4ed8; font-weight: 600; }
    .delta { display: block; font-size: 11px; color: #5b6880; }
    .delta.up { color: #157347; }
    .delta.down { color: #b4231f; }
    tr { transition: background .2s; animation: in .35s ease both; }
    @keyframes in { from { opacity: .3; } }
    @media (hover: hover) {
      tbody tr:hover td, tbody tr:hover .model { background: #fafbfd; }
      tbody tr:hover td.best { background: #e1eaff; }
    }
    tr.pinned td, tr.pinned .model { background: #fff8e6 !important; }
    .pin-cell { width: 44px; }
    .pin { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #d3dae6; background: #fff; cursor: pointer; display: grid; place-items: center; color: #5b6880; }
    .pin svg { width: 15px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linejoin: round; }
    .pin[aria-pressed='true'] { background: #f2b705; border-color: #f2b705; color: #0f1b33; }
    .pin:active { transform: scale(.92); }
    /* Phone: slimmer sticky model column so more spec columns are visible; the rest scrolls sideways. */
    @container (max-width: 520px) {
      :host { padding: 18px 10px; }
      header { padding: 14px 14px; }
      table { min-width: 640px; font-size: 13px; }
      th, td { padding: 10px 10px; }
      th.model img { display: none; }
      th.model strong { font-size: 13px; white-space: normal; width: 9.5em; }
      .model { box-shadow: 1px 0 0 #e3e8f0; }
    }
  `,
})
export class SpecCompareList {
  protected readonly cols: Col[] = [
    { key: 'case', label: 'Case', unit: 'mm', best: 'none' },
    { key: 'reserve', label: 'Power reserve', unit: 'h', best: 'max' },
    { key: 'water', label: 'Water res.', unit: 'm', best: 'max' },
    { key: 'weight', label: 'Weight', unit: 'g', best: 'min' },
    { key: 'price', label: 'Price', unit: '$', best: 'min' },
  ];
  private readonly watches: Watch[] = [
    { id: 'halden', name: 'Halden Chronograph', movement: 'SW510 · 28.8k', img: unsplash(PRODUCT_PHOTOS.watchWhite, 120, 120), alt: 'Halden Chronograph', case: 41, reserve: 62, water: 100, weight: 96, price: 1950 },
    { id: 'marlow', name: 'Marlow Diver', movement: 'ETA 2824 · 28.8k', img: unsplash(PRODUCT_PHOTOS.watchDark, 120, 120), alt: 'Marlow Diver', case: 39, reserve: 38, water: 300, weight: 82, price: 2290 },
    { id: 'aster', name: 'Aster 38 Dress', movement: 'Miyota 9039 · 28.8k', img: unsplash(PRODUCT_PHOTOS.watchClassic, 120, 120), alt: 'Aster 38 Dress', case: 38, reserve: 42, water: 50, weight: 64, price: 890 },
    { id: 'nocturne', name: 'Halden Nocturne', movement: 'H-21 · 28.8k', img: unsplash(PRODUCT_PHOTOS.watchDark, 120, 120), alt: 'Halden Nocturne', case: 39, reserve: 72, water: 100, weight: 58, price: 7400 },
  ];
  protected readonly sortKey = signal<Key | null>(null);
  protected readonly asc = signal(true);
  protected readonly highlight = signal(true);
  protected readonly pin = signal<string | null>('halden');

  protected readonly rows = computed(() => {
    const k = this.sortKey();
    if (!k) return this.watches;
    const dir = this.asc() ? 1 : -1;
    return [...this.watches].sort((a, b) => (a[k] - b[k]) * dir);
  });
  protected readonly base = computed(() => this.watches.find((w) => w.id === this.pin()) ?? null);
  protected readonly best = computed(() => {
    const out = {} as Record<Key, number | null>;
    for (const c of this.cols) {
      const vals = this.watches.map((w) => w[c.key]);
      out[c.key] = c.best === 'max' ? Math.max(...vals) : c.best === 'min' ? Math.min(...vals) : null;
    }
    return out;
  });

  constructor() {
    loadGoogleFonts('IBM+Plex+Sans:wght@400;500;600', 'IBM+Plex+Mono:wght@400;600');
  }

  sort(k: Key): void {
    if (this.sortKey() === k) this.asc.set(!this.asc());
    else {
      this.sortKey.set(k);
      this.asc.set(true);
    }
  }

  show(c: Col, v: number): string {
    return c.unit === '$' ? '$' + v.toLocaleString('en-US') : `${v} ${c.unit}`;
  }

  better(c: Col, d: number): boolean | null {
    return c.best === 'max' ? d > 0 : c.best === 'min' ? d < 0 : null;
  }

  delta(c: Col, d: number): string {
    const sign = d > 0 ? '+' : '−';
    const abs = Math.abs(d);
    return c.unit === '$' ? `${sign}$${abs.toLocaleString('en-US')}` : `${sign}${abs} ${c.unit}`;
  }
}
