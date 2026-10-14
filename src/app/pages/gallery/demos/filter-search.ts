import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Series = 'Breakfast' | 'Street food' | 'Bakery' | 'Seafood';

interface Dish {
  id: number;
  title: string;
  where: string;
  series: Series;
  src: string;
}

const SERIES: Series[] = ['Breakfast', 'Street food', 'Bakery', 'Seafood'];

const DISHES: [string, string, Series][] = [
  ['Huevos rancheros', 'Mercado Roma, CDMX', 'Breakfast'],
  ['Tacos al pastor', 'El Vilsito, CDMX', 'Street food'],
  ['Pan de muerto', 'Panadería Rosetta', 'Bakery'],
  ['Aguachile verde', 'Mariscos Ruben, Tijuana', 'Seafood'],
  ['Chilaquiles rojos', 'Fonda Margarita', 'Breakfast'],
  ['Elote with chile', 'Coyoacán market', 'Street food'],
  ['Conchas, vanilla', 'Panadería La Ideal', 'Bakery'],
  ['Tostada de atún', 'Contramar, CDMX', 'Seafood'],
  ['Molletes', 'Café de Tacuba', 'Breakfast'],
  ['Tlayuda', 'Mercado 20 de Noviembre, Oaxaca', 'Street food'],
  ['Orejas, butter', 'Pastelería Ideal', 'Bakery'],
  ['Pescado zarandeado', 'El Farallón, Nayarit', 'Seafood'],
  ['Tamales oaxaqueños', 'Mercado de Medellín', 'Breakfast'],
  ['Quesadillas de flor', 'Mercado Jamaica', 'Street food'],
];

interface Part { t: string; hit: boolean }

@Component({
  selector: 'demo-filter-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
    <aside>
      <h3>Mercado</h3>
      <p class="by">Food photographs by Camila Herrera</p>
      <label class="search">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" /></svg>
        <input type="search" placeholder="Search dishes or places" [value]="q()" (input)="onQuery($event)" aria-label="Search dishes or places" />
        @if (q()) { <button type="button" class="x" (click)="q.set('')" aria-label="Clear search">×</button> }
      </label>
      <div class="series" role="radiogroup" aria-label="Series">
        <button type="button" role="radio" [attr.aria-checked]="series() === null" [class.on]="series() === null" (click)="series.set(null)">
          Everything <span>{{ countFor(null) }}</span>
        </button>
        @for (s of seriesList; track s) {
          <button type="button" role="radio" [attr.aria-checked]="series() === s" [class.on]="series() === s" (click)="series.set(s)">
            {{ s }} <span>{{ countFor(s) }}</span>
          </button>
        }
      </div>
    </aside>

    <section class="results" aria-label="Results">
      <p class="status" aria-live="polite">
        <b>{{ results().length }}</b> {{ results().length === 1 ? 'photograph' : 'photographs' }}
        @if (q()) { for “{{ q() }}” }
        @if (series()) { in {{ series() }} }
      </p>
      @if (results().length) {
        <ul class="grid" role="list">
          @for (r of results(); track r.d.id; let i = $index) {
            <li [style.--i]="i">
              <img [src]="r.d.src" [alt]="r.d.title + ' at ' + r.d.where + ' — Mercado series'" loading="lazy" />
              <div class="meta">
                <strong>@for (p of r.title; track $index) {@if (p.hit) {<mark>{{ p.t }}</mark>} @else {<span>{{ p.t }}</span>}}</strong>
                <span>@for (p of r.where; track $index) {@if (p.hit) {<mark>{{ p.t }}</mark>} @else {<span>{{ p.t }}</span>}}</span>
              </div>
              <em class="tag">{{ r.d.series }}</em>
            </li>
          }
        </ul>
      } @else {
        <div class="empty">
          <p>Nothing on the menu for “{{ q() }}”.</p>
          <button type="button" (click)="reset()">Reset filters</button>
        </div>
      }
    </section>
    </div>
  `,
  styles: `
    :host { display: block; background: #fff0ec; color: #143d2b; container-type: inline-size; font-family: var(--font-body); }
    .layout { display: grid; grid-template-columns: 240px 1fr; gap: clamp(16px, 3cqw, 32px); height: 600px; padding: clamp(16px, 3cqw, 30px); }
    aside { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: 40px; letter-spacing: -0.03em; line-height: .9; font-style: italic; color: #e2432a; }
    .by { font-size: 12.5px; color: #5c6f63; margin-top: -6px; }
    .search { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #143d2b; border-radius: 12px; padding: 0 10px; height: 42px; }
    .search:focus-within { box-shadow: 0 0 0 3px rgba(226,67,42,.25); }
    .search svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; flex: none; }
    .search input { flex: 1; min-width: 0; border: 0; outline: none; background: none; font: inherit; font-size: 14px; color: inherit; }
    .search input::-webkit-search-cancel-button { display: none; }
    .x { position: relative; flex: none; border: 0; background: #143d2b; color: #fff; width: 20px; height: 20px; border-radius: 50%; line-height: 1; cursor: pointer; font-size: 14px; touch-action: manipulation; }
    .x::after { content: ''; position: absolute; inset: -11px; }
    button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    /* 16px stops iOS zooming the page when the field is focused */
    @media (pointer: coarse) { .search input { font-size: 16px; } .series button { min-height: 40px; } }
    .series { display: grid; gap: 4px; }
    .series button { display: flex; justify-content: space-between; align-items: center; text-align: left; border: 0; background: none; padding: 8px 10px; border-radius: 8px; font-size: 14px; cursor: pointer; color: inherit; transition: background .2s; }
    .series button span { font-family: var(--font-mono); font-size: 11.5px; opacity: .6; }
    .series button:hover, .series button:active { background: rgba(20,61,43,.06); }
    .series button.on { background: #143d2b; color: #fff0ec; }
    .series button.on span { opacity: .8; }
    @container (max-width: 700px) {
      .layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr; height: 680px; }
      .series { display: flex; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; flex: none; }
      .series::-webkit-scrollbar { display: none; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(136px, 1fr)); gap: 12px; }
      h3 { font-size: 34px; }
      .series button { flex: none; gap: 6px; border: 1px solid rgba(20,61,43,.2); }
    }
    .results { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; padding-right: 4px; }
    .status { font-size: 13px; color: #5c6f63; margin-bottom: 12px; } .status b { color: #143d2b; font-family: var(--font-mono); }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
    .grid li { position: relative; animation: pop .5s cubic-bezier(.2,.8,.2,1) calc(var(--i) * 35ms) both; }
    @keyframes pop { from { opacity: 0; transform: translateY(12px) scale(.96); } }
    .grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 14px; background: #f6d8d0; }
    .meta { display: grid; margin-top: 8px; }
    .meta strong { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; line-height: 1.15; }
    .meta > span { font-size: 12px; color: #5c6f63; margin-top: 2px; }
    mark { background: #ffd23f; color: inherit; border-radius: 3px; padding: 0 1px; }
    .tag { position: absolute; top: 8px; left: 8px; font-style: normal; font-size: 10.5px; font-weight: 600; background: rgba(255,255,255,.92); padding: 3px 8px; border-radius: 99px; }
    .empty { display: grid; place-items: center; gap: 12px; padding: 60px 10px; text-align: center; border: 1.5px dashed rgba(20,61,43,.3); border-radius: 16px; }
    .empty p { font-family: 'Fraunces', serif; font-size: 20px; }
    .empty button { border: 0; background: #e2432a; color: #fff; padding: 10px 18px; min-height: 42px; border-radius: 99px; font-weight: 600; cursor: pointer; }
    .empty button:active { transform: scale(.96); }
  `,
})
export class FilterSearch {
  protected readonly seriesList = SERIES;
  private readonly dishes: Dish[] = DISHES.map(([title, where, series], id) => ({ id, title, where, series, src: photo('mercado-' + id, 400, 400) }));
  protected readonly q = signal('');
  protected readonly series = signal<Series | null>(null);
  private readonly norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  private readonly matchesQuery = computed(() => {
    const q = this.norm(this.q().trim());
    return this.dishes.filter((d) => !q || this.norm(d.title + ' ' + d.where).includes(q));
  });

  protected readonly results = computed(() => {
    const s = this.series();
    const q = this.q().trim();
    return this.matchesQuery()
      .filter((d) => !s || d.series === s)
      .map((d) => ({ d, title: this.split(d.title, q), where: this.split(d.where, q) }));
  });

  constructor() {
    loadGoogleFonts('Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,700');
  }

  countFor(s: Series | null): number {
    return this.matchesQuery().filter((d) => !s || d.series === s).length;
  }

  private split(text: string, q: string): Part[] {
    if (!q) return [{ t: text, hit: false }];
    const i = this.norm(text).indexOf(this.norm(q));
    if (i < 0) return [{ t: text, hit: false }];
    return [
      { t: text.slice(0, i), hit: false },
      { t: text.slice(i, i + q.length), hit: true },
      { t: text.slice(i + q.length), hit: false },
    ].filter((p) => p.t);
  }

  onQuery(e: Event): void {
    this.q.set((e.target as HTMLInputElement).value);
  }

  reset(): void {
    this.q.set('');
    this.series.set(null);
  }
}
