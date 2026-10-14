import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Cat = 'Audio' | 'Watches' | 'Eyewear' | 'Cameras' | 'Home' | 'Fragrance';
type Sort = 'featured' | 'low' | 'high' | 'rating' | 'new';

interface Product {
  id: string;
  name: string;
  cat: Cat;
  price: number;
  colours: string[];
  rating: number;
  reviews: number;
  stock: boolean;
  added: number;
  img: string;
  blurb: string;
}

const P = PRODUCT_PHOTOS;
const u = (id: string) => unsplash(id, 520, 520);

@Component({
  selector: 'demo-filter-sidebar-catalogue',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.escape)': 'filtersOpen.set(false)' },
  template: `
    <div class="shop" [class.show-filters]="filtersOpen()">
      <button type="button" class="scrim" tabindex="-1" aria-hidden="true" (click)="filtersOpen.set(false)"></button>
      <aside class="side" aria-label="Filters">
        <div class="side-head">
          <h4>Filters</h4>
          <button type="button" class="link" (click)="reset()" [disabled]="!activeCount()">Reset</button>
          <button type="button" class="close" (click)="filtersOpen.set(false)" aria-label="Close filters">×</button>
        </div>

        <fieldset>
          <legend>Category</legend>
          @for (c of cats; track c) {
            <label class="check">
              <input type="checkbox" [checked]="catSel().includes(c)" (change)="toggleCat(c)" />
              <span class="box" aria-hidden="true"></span>
              {{ c }}
              <span class="n">{{ catCounts()[c] }}</span>
            </label>
          }
        </fieldset>

        <fieldset>
          <legend>Price <span class="range-val">{{ fmt(min()) }} – {{ fmt(max()) }}</span></legend>
          <div class="dual" [style.--a.%]="(min() / ceiling) * 100" [style.--b.%]="(max() / ceiling) * 100">
            <i class="rail" aria-hidden="true"></i>
            <input #minR type="range" min="0" [max]="ceiling" step="50" [value]="min()" (input)="setMin(minR)" aria-label="Minimum price" />
            <input #maxR type="range" min="0" [max]="ceiling" step="50" [value]="max()" (input)="setMax(maxR)" aria-label="Maximum price" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Colour</legend>
          <div class="swatches">
            @for (c of colours; track c.id) {
              <button type="button" [style.--c]="c.hex" [class.on]="colSel().includes(c.id)" [attr.aria-pressed]="colSel().includes(c.id)" (click)="toggleCol(c.id)" [attr.aria-label]="c.id" [title]="c.id"></button>
            }
          </div>
        </fieldset>

        <label class="toggle">
          <input type="checkbox" [checked]="inStock()" (change)="inStock.set(!inStock())" />
          <span class="sw" aria-hidden="true"></span>
          In stock only
        </label>

        <button type="button" class="apply" (click)="filtersOpen.set(false)">Show {{ results().length }} {{ results().length === 1 ? 'product' : 'products' }}</button>
      </aside>

      <main class="main">
        <div class="bar">
          <button type="button" class="filters-btn" (click)="filtersOpen.set(true)">
            Filters @if (activeCount()) { <b>{{ activeCount() }}</b> }
          </button>
          <p class="count" aria-live="polite"><strong>{{ results().length }}</strong> of {{ products.length }} products</p>
          <label class="sort">
            <span class="visually-hidden">Sort by</span>
            <select #sortSel (change)="setSort(sortSel.value)">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="new">Newest</option>
            </select>
          </label>
          <div class="view" role="group" aria-label="Layout">
            <button type="button" [class.on]="view() === 'grid'" [attr.aria-pressed]="view() === 'grid'" (click)="view.set('grid')" aria-label="Grid view">
              <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="6" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="11" width="6" height="6" rx="1" /></svg>
            </button>
            <button type="button" [class.on]="view() === 'list'" [attr.aria-pressed]="view() === 'list'" (click)="view.set('list')" aria-label="List view">
              <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="4" height="4" rx="1" /><path d="M9.5 6h7.5" /><rect x="3" y="12" width="4" height="4" rx="1" /><path d="M9.5 14h7.5" /></svg>
            </button>
          </div>
        </div>

        @if (chips().length) {
          <div class="chips">
            @for (c of chips(); track c.label) {
              <button type="button" (click)="c.clear()">{{ c.label }} <span aria-hidden="true">×</span><span class="visually-hidden">remove filter</span></button>
            }
          </div>
        }

        <div class="results">
          @if (results().length) {
            <ul class="grid" [class.list]="view() === 'list'">
              @for (p of results(); track p.id) {
                <li class="card">
                  <div class="media">
                    <img [src]="p.img" [appImgFallback]="p.id" [alt]="p.name" loading="lazy" />
                    @if (!p.stock) { <span class="flag">Sold out</span> }
                    @else if (p.added > 9) { <span class="flag new">New</span> }
                  </div>
                  <div class="body">
                    <p class="cat">{{ p.cat }}</p>
                    <p class="name">{{ p.name }}</p>
                    <p class="blurb">{{ p.blurb }}</p>
                    <div class="row">
                      <span class="price">{{ fmt(p.price) }}</span>
                      <span class="rate">★ {{ p.rating }} <small>({{ p.reviews }})</small></span>
                    </div>
                    <div class="dots" aria-label="Available colours">
                      @for (c of p.colours; track c) { <i [style.background]="hex(c)" [title]="c"></i> }
                    </div>
                  </div>
                </li>
              }
            </ul>
          } @else {
            <div class="empty">
              <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="12" /><path d="M30 30l9 9M16 21h10" /></svg>
              <h4>Nothing matches those filters</h4>
              <p>Try widening the price range or removing a colour.</p>
              <button type="button" (click)="reset()">Reset all filters</button>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: `
    :host { display: block; height: 720px; container-type: inline-size; font-family: 'Plus Jakarta Sans', sans-serif; color: #18181b; background: #fafaf9; }
    .shop { position: relative; display: grid; grid-template-columns: 240px 1fr; height: 100%; }
    .side { border-right: 1px solid #e7e5e4; padding: 20px 18px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; background: #fafaf9; }
    .side-head { display: flex; align-items: center; gap: 8px; }
    .side-head h4 { font-size: 16px; font-weight: 700; margin-right: auto; }
    .link { border: 0; background: none; color: #4338ca; font: inherit; font-size: 13px; cursor: pointer; min-height: 40px; padding: 0 8px; border-radius: 8px; }
    .link:active:not(:disabled) { background: #eef0ff; }
    button, label { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .scrim, .apply { display: none; }
    .link:disabled { color: #a8a29e; cursor: default; }
    .close { display: none; width: 40px; height: 40px; margin-right: -6px; border-radius: 50%; border: 1px solid #e7e5e4; background: #fff; cursor: pointer; font-size: 18px; }
    fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 4px; }
    legend { font-size: 12.5px; font-weight: 600; color: #57534e; margin-bottom: 8px; display: flex; justify-content: space-between; width: 100%; }
    .range-val { font-weight: 500; color: #18181b; font-variant-numeric: tabular-nums; }
    .check { position: relative; display: flex; align-items: center; gap: 10px; font-size: 14px; padding: 5px 0; cursor: pointer; }
    .check input, .toggle input { position: absolute; opacity: 0; width: 1px; height: 1px; }
    .box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #a8a29e; display: grid; place-items: center; transition: background .15s, border-color .15s; }
    .check input:checked + .box { background: #4338ca; border-color: #4338ca; }
    .check input:checked + .box::after { content: ''; width: 9px; height: 5px; border: 2px solid #fff; border-top: 0; border-right: 0; transform: rotate(-45deg) translate(1px, -1px); }
    .check input:focus-visible + .box, .toggle input:focus-visible + .sw { outline: 2px solid #4338ca; outline-offset: 2px; }
    .n { margin-left: auto; font-size: 12px; color: #a8a29e; font-variant-numeric: tabular-nums; }
    .dual { position: relative; height: 28px; }
    .rail { position: absolute; left: 0; right: 0; top: 12px; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #e7e5e4 var(--a), #4338ca var(--a), #4338ca var(--b), #e7e5e4 var(--b)); }
    .dual input { position: absolute; inset: 0; width: 100%; margin: 0; background: none; pointer-events: none; -webkit-appearance: none; appearance: none; }
    .dual input::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid #4338ca; cursor: grab; box-shadow: 0 2px 6px rgba(0,0,0,.15); }
    .dual input::-moz-range-thumb { pointer-events: auto; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 2px solid #4338ca; cursor: grab; }
    .dual input::-moz-range-track { background: none; }
    .dual input:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(67,56,202,.25); }
    .swatches { display: flex; flex-wrap: wrap; gap: 8px; }
    .swatches button { width: 26px; height: 26px; border-radius: 50%; border: 0; background: var(--c); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); position: relative; }
    .swatches button.on::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #4338ca; }
    .swatches button::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; }
    .swatches button:active { transform: scale(.9); }
    .toggle { position: relative; display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; }
    .sw { width: 36px; height: 20px; border-radius: 10px; background: #d6d3d1; position: relative; transition: background .2s; }
    .sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; }
    .toggle input:checked + .sw { background: #4338ca; }
    .toggle input:checked + .sw::after { transform: translateX(16px); }
    .main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
    .bar { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-bottom: 1px solid #e7e5e4; flex-wrap: wrap; }
    .filters-btn { display: none; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 999px; border: 1px solid #d6d3d1; background: #fff; cursor: pointer; font: inherit; font-size: 13.5px; font-weight: 600; }
    .filters-btn b { background: #4338ca; color: #fff; border-radius: 999px; font-size: 11px; padding: 1px 7px; }
    .count { font-size: 13.5px; color: #57534e; margin-right: auto; }
    .count strong { color: #18181b; }
    select { height: 36px; border-radius: 999px; border: 1px solid #d6d3d1; background: #fff; font: inherit; font-size: 13.5px; padding: 0 12px; cursor: pointer; }
    .view { display: flex; border: 1px solid #d6d3d1; border-radius: 999px; padding: 2px; background: #fff; }
    .view button { width: 32px; height: 30px; border: 0; border-radius: 999px; background: transparent; cursor: pointer; display: grid; place-items: center; color: #78716c; }
    .view button.on { background: #18181b; color: #fff; }
    .view svg { width: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; padding: 10px 20px 0; }
    .chips button { font: inherit; font-size: 12.5px; border: 0; background: #eef0ff; color: #3730a3; border-radius: 999px; padding: 5px 10px; cursor: pointer; }
    @media (hover: hover) { .chips button:hover { background: #e0e3ff; } }
    .chips button:active { background: #e0e3ff; }
    .filters-btn:active, .view button:active { transform: scale(.96); }
    @media (pointer: coarse) {
      .check { padding: 9px 0; }
      .toggle { min-height: 40px; }
      .swatches { gap: 12px; }
      .dual { height: 36px; }
      .rail { top: 16px; }
      .dual input::-webkit-slider-thumb { width: 28px; height: 28px; }
      .dual input::-moz-range-thumb { width: 24px; height: 24px; }
      .view button { width: 40px; height: 36px; }
      .filters-btn, select { height: 40px; }
      select { font-size: 16px; }
      .chips button { min-height: 34px; padding: 6px 12px; }
    }
    .results { flex: 1; overflow-y: auto; padding: 16px 20px 24px; min-height: 0; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px 14px; }
    .card { animation: in .35s ease both; }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
    .media { position: relative; aspect-ratio: 1; border-radius: 14px; overflow: hidden; background: #f0efed; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.05); } }
    .flag { position: absolute; top: 8px; left: 8px; font-size: 11px; font-weight: 700; background: #18181b; color: #fff; padding: 3px 8px; border-radius: 999px; }
    .flag.new { background: #4338ca; }
    .body { padding-top: 10px; }
    .cat { font-size: 11.5px; color: #78716c; }
    .name { font-size: 14.5px; font-weight: 600; line-height: 1.25; margin-top: 2px; }
    .blurb { display: none; font-size: 13px; color: #57534e; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px; }
    .price { font-weight: 700; font-size: 14.5px; }
    .rate { font-size: 12.5px; color: #57534e; }
    .rate small { color: #a8a29e; }
    .dots { display: flex; gap: 4px; margin-top: 8px; }
    .dots i { width: 10px; height: 10px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
    .grid.list { grid-template-columns: 1fr; gap: 10px; }
    .grid.list .card { display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center; padding: 10px; border: 1px solid #e7e5e4; border-radius: 16px; background: #fff; }
    .grid.list .body { padding: 0; }
    .grid.list .blurb { display: block; }
    .grid.list .row { justify-content: flex-start; gap: 16px; }
    .empty { display: grid; justify-items: center; text-align: center; gap: 8px; padding: 60px 20px; color: #57534e; }
    .empty svg { width: 56px; fill: none; stroke: #a8a29e; stroke-width: 2; stroke-linecap: round; }
    .empty h4 { color: #18181b; font-size: 18px; }
    .empty button { margin-top: 8px; height: 40px; padding: 0 18px; border-radius: 999px; border: 0; background: #4338ca; color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
    @container (max-width: 700px) {
      .shop { grid-template-columns: 1fr; }
      .side {
        position: absolute; inset: 0 auto 0 0; width: min(300px, 88%); z-index: 5; transform: translateX(-105%);
        transition: transform .35s cubic-bezier(.2,.8,.2,1), visibility 0s .35s; visibility: hidden;
        box-shadow: 20px 0 40px -20px rgba(0,0,0,.3); overscroll-behavior: contain; padding-bottom: 0;
      }
      .show-filters .side { transform: none; visibility: visible; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
      .scrim {
        display: block; position: absolute; inset: 0; z-index: 4; border: 0; padding: 0; background: rgba(24,24,27,.38);
        opacity: 0; pointer-events: none; transition: opacity .3s; cursor: pointer;
      }
      .show-filters .scrim { opacity: 1; pointer-events: auto; }
      .apply {
        display: block; position: sticky; bottom: 0; margin: auto -18px 0; height: 56px; border: 0; cursor: pointer;
        background: #4338ca; color: #fff; font: inherit; font-weight: 700; font-size: 14.5px;
        box-shadow: 0 -10px 20px -10px rgba(0,0,0,.2);
      }
      .apply:active { background: #3730a3; }
      .close { display: grid; place-items: center; }
      .filters-btn { display: inline-flex; }
      .bar { padding: 12px 14px; gap: 8px; }
      .sort { flex: 1; min-width: 0; display: flex; }
      select { flex: 1; min-width: 0; }
      .count { order: 5; width: 100%; }
      .chips { padding: 10px 14px 0; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; }
      .chips::-webkit-scrollbar { display: none; }
      .chips button { flex: none; }
      .results { padding: 14px 14px 22px; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 12px; }
      .grid.list .card { grid-template-columns: 90px 1fr; gap: 12px; }
      .name { font-size: 14px; }
      .row { flex-wrap: wrap; gap: 2px 8px; }
    }
  `,
})
export class FilterSidebarCatalogue {
  protected readonly ceiling = 3000;
  protected readonly cats: Cat[] = ['Audio', 'Watches', 'Eyewear', 'Cameras', 'Home', 'Fragrance'];
  protected readonly colours = [
    { id: 'Black', hex: '#1c1917' },
    { id: 'White', hex: '#f5f5f4' },
    { id: 'Silver', hex: '#c7c9cc' },
    { id: 'Tan', hex: '#b88a5a' },
    { id: 'Red', hex: '#d1382b' },
    { id: 'Green', hex: '#55704b' },
    { id: 'Blue', hex: '#2f4f8f' },
  ];
  protected readonly products: Product[] = [
    { id: 'p1', name: 'Aster ANC Over-Ear', cat: 'Audio', price: 349, colours: ['Black', 'Tan'], rating: 4.7, reviews: 1284, stock: true, added: 4, img: u(P.headphones), blurb: '40h battery, adaptive noise cancelling.' },
    { id: 'p2', name: 'Solace One Headphones', cat: 'Audio', price: 449, colours: ['Black', 'Silver'], rating: 4.8, reviews: 312, stock: true, added: 12, img: u(P.headphonesAlt), blurb: 'Beryllium drivers, 60h with ANC.' },
    { id: 'p3', name: 'Oro Mini Speaker', cat: 'Audio', price: 149, colours: ['Red', 'Black', 'Green'], rating: 4.5, reviews: 860, stock: true, added: 7, img: u(P.speaker), blurb: 'IP67 waterproof, stereo pairing.' },
    { id: 'p4', name: 'Halden Chronograph 41mm', cat: 'Watches', price: 1950, colours: ['Silver', 'White'], rating: 4.9, reviews: 98, stock: true, added: 3, img: u(P.watchWhite), blurb: 'Sellita automatic, sapphire crystal.' },
    { id: 'p5', name: 'Marlow Diver 39mm', cat: 'Watches', price: 2290, colours: ['Black'], rating: 4.6, reviews: 64, stock: false, added: 10, img: u(P.watchDark), blurb: '300m titanium diver, ceramic bezel.' },
    { id: 'p6', name: 'Aster 38 Dress', cat: 'Watches', price: 890, colours: ['Tan', 'Silver'], rating: 4.4, reviews: 140, stock: true, added: 6, img: u(P.watchClassic), blurb: 'Slim 9mm case on Barenia leather.' },
    { id: 'p7', name: 'Côte 02 Acetate', cat: 'Eyewear', price: 310, colours: ['Tan', 'Black'], rating: 4.6, reviews: 412, stock: true, added: 11, img: u(P.sunglasses), blurb: 'Hand-polished acetate, Zeiss lenses.' },
    { id: 'p8', name: 'Kessler K2 Rangefinder', cat: 'Cameras', price: 2690, colours: ['Silver', 'Black'], rating: 4.9, reviews: 51, stock: true, added: 2, img: u(P.camera), blurb: 'Mechanical 35mm film rangefinder.' },
    { id: 'p9', name: 'Linnea Lounge Chair', cat: 'Home', price: 1290, colours: ['Green', 'Tan'], rating: 4.7, reviews: 77, stock: true, added: 8, img: u(P.chair), blurb: 'Solid oak frame, wool upholstery.' },
    { id: 'p10', name: 'Ostra 3-Seat Sofa', cat: 'Home', price: 2850, colours: ['Silver', 'Blue'], rating: 4.8, reviews: 39, stock: false, added: 5, img: u(P.sofa), blurb: 'Feather-wrapped cushions, 15-year frame.' },
    { id: 'p11', name: 'Tove Oak Stool', cat: 'Home', price: 340, colours: ['Tan'], rating: 4.3, reviews: 120, stock: true, added: 1, img: u(P.stool), blurb: 'Turned oak, oiled by hand.' },
    { id: 'p12', name: 'Noir Vetiver EDP 50ml', cat: 'Fragrance', price: 165, colours: ['Black'], rating: 4.6, reviews: 530, stock: true, added: 13, img: u(P.perfume), blurb: 'Vetiver, orris, ambergris.' },
    { id: 'p13', name: 'Ambre Sel Extrait 30ml', cat: 'Fragrance', price: 190, colours: ['Tan'], rating: 4.7, reviews: 210, stock: true, added: 9, img: u(P.perfumeBottle), blurb: 'Amber, sea salt, labdanum.' },
    { id: 'p14', name: 'Rose Fumée EDP 50ml', cat: 'Fragrance', price: 172, colours: ['Red'], rating: 4.2, reviews: 96, stock: true, added: 14, img: u(P.perfumeAlt), blurb: 'Smoked rose, black tea, birch.' },
  ];

  protected readonly catSel = signal<Cat[]>([]);
  protected readonly colSel = signal<string[]>([]);
  protected readonly min = signal(0);
  protected readonly max = signal(3000);
  protected readonly inStock = signal(false);
  protected readonly sort = signal<Sort>('featured');
  protected readonly view = signal<'grid' | 'list'>('grid');
  protected readonly filtersOpen = signal(false);
  private readonly usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  private readonly base = computed(() =>
    this.products.filter(
      (p) =>
        p.price >= this.min() &&
        p.price <= this.max() &&
        (!this.inStock() || p.stock) &&
        (!this.colSel().length || p.colours.some((c) => this.colSel().includes(c))),
    ),
  );
  protected readonly catCounts = computed(() => {
    const out = {} as Record<Cat, number>;
    for (const c of this.cats) out[c] = this.base().filter((p) => p.cat === c).length;
    return out;
  });
  protected readonly results = computed(() => {
    const list = this.base().filter((p) => !this.catSel().length || this.catSel().includes(p.cat));
    const s = this.sort();
    if (s === 'low') return [...list].sort((a, b) => a.price - b.price);
    if (s === 'high') return [...list].sort((a, b) => b.price - a.price);
    if (s === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    if (s === 'new') return [...list].sort((a, b) => b.added - a.added);
    return list;
  });
  protected readonly chips = computed(() => {
    const out: { label: string; clear: () => void }[] = [];
    for (const c of this.catSel()) out.push({ label: c, clear: () => this.toggleCat(c) });
    for (const c of this.colSel()) out.push({ label: c, clear: () => this.toggleCol(c) });
    if (this.min() > 0 || this.max() < this.ceiling) out.push({ label: `${this.fmt(this.min())}–${this.fmt(this.max())}`, clear: () => { this.min.set(0); this.max.set(this.ceiling); } });
    if (this.inStock()) out.push({ label: 'In stock', clear: () => this.inStock.set(false) });
    return out;
  });
  protected readonly activeCount = computed(() => this.chips().length);

  constructor() {
    loadGoogleFonts('Plus+Jakarta+Sans:wght@400;500;600;700');
  }

  fmt(n: number): string {
    return this.usd.format(n);
  }

  hex(name: string): string {
    return this.colours.find((c) => c.id === name)?.hex ?? '#ccc';
  }

  toggleCat(c: Cat): void {
    this.catSel.update((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  }

  toggleCol(c: string): void {
    this.colSel.update((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  }

  setMin(el: HTMLInputElement): void {
    this.min.set(Math.min(el.valueAsNumber, this.max() - 50));
    el.value = String(this.min());
  }

  setMax(el: HTMLInputElement): void {
    this.max.set(Math.max(el.valueAsNumber, this.min() + 50));
    el.value = String(this.max());
  }

  setSort(v: string): void {
    this.sort.set(v as Sort);
  }

  reset(): void {
    this.catSel.set([]);
    this.colSel.set([]);
    this.min.set(0);
    this.max.set(this.ceiling);
    this.inStock.set(false);
  }
}
