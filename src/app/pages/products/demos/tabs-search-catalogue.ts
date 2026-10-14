import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, afterRenderEffect, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Tab = 'All' | 'Cleanse' | 'Treat' | 'Hydrate' | 'Protect' | 'Body';

interface Product {
  id: string;
  name: string;
  tab: Exclude<Tab, 'All'>;
  note: string;
  size: string;
  price: number;
  img: string;
  hue?: number;
}

const P = PRODUCT_PHOTOS;
const u = (id: string) => unsplash(id, 480, 600);

@Component({
  selector: 'demo-tabs-search-catalogue',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <header>
        <div>
          <p class="brand">Mira Skin</p>
          <h3>The routine, simplified.</h3>
        </div>
        <label class="search">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13.5 13.5L17 17" /></svg>
          <span class="visually-hidden">Search products</span>
          <input #q type="search" [value]="query()" (input)="query.set(q.value)" placeholder="Search niacinamide, SPF, serum…" autocomplete="off" />
          @if (query()) {
            <button type="button" (click)="query.set(''); q.focus()" aria-label="Clear search">×</button>
          }
        </label>
      </header>

      <div class="tabs" role="tablist" aria-label="Categories">
        @for (t of tabs; track t; let i = $index) {
          <button
            type="button"
            role="tab"
            class="tab"
            [attr.data-tab]="t"
            [class.on]="tab() === t"
            [attr.aria-selected]="tab() === t"
            [attr.tabindex]="tab() === t ? 0 : -1"
            aria-controls="mira-panel"
            (click)="pick(t, $event)"
            (keydown)="tabKey($event, i)"
          >
            {{ t }} <span class="n">{{ counts()[t] }}</span>
          </button>
        }
        <i class="ink" aria-hidden="true" [style.transform]="'translateX(' + inkX() + 'px)'" [style.width.px]="inkW()"></i>
      </div>

      <div class="panel" id="mira-panel" role="tabpanel" [attr.aria-label]="tab()">
        <p class="status" aria-live="polite">
          {{ results().length }} {{ results().length === 1 ? 'product' : 'products' }}{{ query() ? ' for “' + query() + '”' : '' }}{{ tab() !== 'All' ? ' in ' + tab() : '' }}
        </p>
        @if (results().length) {
          <ul class="grid">
            @for (p of results(); track p.id) {
              <li class="card">
                <div class="media">
                  <img [src]="p.img" [appImgFallback]="p.id" [alt]="p.name" [style.filter]="p.hue ? 'hue-rotate(' + p.hue + 'deg)' : null" loading="lazy" />
                  <span class="pill">{{ p.tab }}</span>
                </div>
                <p class="name">@for (part of parts(p.name); track $index) {<span [class.hit]="part.hit">{{ part.t }}</span>}</p>
                <p class="note">{{ p.note }}</p>
                <div class="row">
                  <span class="price">{{ fmt(p.price) }} <small>· {{ p.size }}</small></span>
                  <button type="button" class="add" [class.on]="bag().includes(p.id)" (click)="toggle(p.id)" [attr.aria-pressed]="bag().includes(p.id)" [attr.aria-label]="(bag().includes(p.id) ? 'Remove ' : 'Add ') + p.name">
                    {{ bag().includes(p.id) ? 'Added' : 'Add' }}
                  </button>
                </div>
              </li>
            }
          </ul>
        } @else {
          <div class="empty">
            <p class="big">No match in {{ tab() }}.</p>
            @if (tab() !== 'All' && counts()['All'] > 0) {
              <p>{{ counts()['All'] }} {{ counts()['All'] === 1 ? 'result' : 'results' }} in other categories.</p>
              <button type="button" (click)="tab.set('All')">Search all categories</button>
            } @else {
              <p>Try “serum”, “SPF” or “oil”.</p>
              <button type="button" (click)="query.set('')">Clear search</button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 700px; container-type: inline-size; background: #e7eef6; color: #13294b; font-family: 'Geist', sans-serif; }
    .wrap { display: flex; flex-direction: column; height: 100%; }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 18px; padding: 24px clamp(16px, 3.5cqw, 36px) 16px; flex-wrap: wrap; }
    .brand { font-size: 13px; color: #f26b5b; font-weight: 600; }
    h3 { font-family: 'Young Serif', serif; font-weight: 400; font-size: clamp(28px, 4.6cqw, 44px); letter-spacing: -.01em; line-height: 1; margin-top: 4px; }
    .search { position: relative; display: flex; align-items: center; width: min(340px, 100%); height: 46px; border-radius: 999px; background: #fff; box-shadow: 0 0 0 1px #cfdbea; padding: 0 8px 0 14px; gap: 8px; transition: box-shadow .2s; }
    .search:focus-within { box-shadow: 0 0 0 2px #13294b; }
    .search svg { width: 18px; flex: none; fill: none; stroke: #5d7290; stroke-width: 1.8; stroke-linecap: round; }
    .search input { flex: 1; min-width: 0; border: 0; outline: none; font: inherit; font-size: 14.5px; background: transparent; color: inherit; }
    .search input::-webkit-search-cancel-button { display: none; }
    .search button { width: 30px; height: 30px; border-radius: 50%; border: 0; background: #e7eef6; cursor: pointer; font-size: 17px; line-height: 1; color: inherit; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .search button:active { background: #d7e2ef; }
    @media (pointer: coarse) {
      .search button { width: 36px; height: 36px; }
      /* 16px keeps iOS from zooming the page when the field is focused. */
      .search input { font-size: 16px; }
      .add { height: 38px; }
    }
    .tabs { position: relative; display: flex; gap: 4px; padding: 0 clamp(16px, 3.5cqw, 36px); border-bottom: 1px solid #cfdbea; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; scroll-behavior: smooth; }
    .tabs::-webkit-scrollbar { display: none; }
    .tab { flex: none; height: 46px; padding: 0 12px; border: 0; background: none; cursor: pointer; font: inherit; font-size: 14.5px; color: #5d7290; transition: color .2s; border-radius: 8px 8px 0 0; }
    @media (hover: hover) { .tab:hover { color: #13294b; } }
    .tab:active { background: #dbe5f1; }
    .tab.on { color: #13294b; font-weight: 600; }
    .tab .n { font-size: 11.5px; margin-left: 4px; padding: 1px 6px; border-radius: 999px; background: #d7e2ef; color: #5d7290; font-weight: 500; font-variant-numeric: tabular-nums; }
    .tab.on .n { background: #13294b; color: #fff; }
    .ink { position: absolute; left: 0; bottom: -1px; height: 3px; border-radius: 3px 3px 0 0; background: #f26b5b; transition: transform .4s cubic-bezier(.2,.8,.2,1), width .4s cubic-bezier(.2,.8,.2,1); }
    .panel { flex: 1; overflow-y: auto; padding: 16px clamp(16px, 3.5cqw, 36px) 28px; min-height: 0; }
    .status { font-size: 13px; color: #5d7290; margin-bottom: 14px; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 22px 16px; }
    .card { animation: in .35s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes in { from { opacity: 0; transform: translateY(10px) scale(.98); } }
    .media { position: relative; aspect-ratio: 4 / 5; border-radius: 22px 22px 22px 4px; overflow: hidden; background: #d7e2ef; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.05); } }
    .pill { position: absolute; left: 10px; top: 10px; font-size: 11.5px; background: rgba(255,255,255,.88); padding: 3px 9px; border-radius: 999px; }
    .name { font-family: 'Young Serif', serif; font-size: 17px; line-height: 1.2; margin-top: 10px; }
    .hit { background: #ffd9d3; color: inherit; border-radius: 3px; padding: 0 1px; }
    .note { font-size: 12.5px; color: #5d7290; margin-top: 3px; }
    .row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .price { font-weight: 600; font-size: 14.5px; }
    .price small { font-weight: 400; color: #5d7290; }
    .add { height: 32px; padding: 0 14px; border-radius: 999px; border: 1px solid #13294b; background: transparent; cursor: pointer; font: inherit; font-size: 13px; transition: background .2s, color .2s; }
    @media (hover: hover) { .add:hover { background: #13294b; color: #fff; } }
    .add:active { transform: scale(.95); }
    .add.on { background: #f26b5b; border-color: #f26b5b; color: #fff; }
    .empty { display: grid; justify-items: start; gap: 8px; padding: 40px 0; max-width: 420px; }
    .empty .big { font-family: 'Young Serif', serif; font-size: 26px; }
    .empty p { color: #5d7290; }
    .empty button { margin-top: 6px; height: 42px; padding: 0 18px; border-radius: 999px; border: 0; background: #13294b; color: #fff; cursor: pointer; font: inherit; font-weight: 500; }
    @container (max-width: 520px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; }
      header { padding-top: 20px; gap: 14px; }
      .search { width: 100%; }
      .tab { padding: 0 10px; }
      .name { font-size: 15.5px; }
      .row { flex-wrap: wrap; gap: 8px; }
      .price small { display: block; }
    }
  `,
})
export class TabsSearchCatalogue {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly tabs: Tab[] = ['All', 'Cleanse', 'Treat', 'Hydrate', 'Protect', 'Body'];
  private readonly products: Product[] = [
    { id: 'm1', name: 'Oat Milk Gel Cleanser', tab: 'Cleanse', note: 'Low-foam, pH 5.5', size: '150 ml', price: 22, img: u(P.skincare) },
    { id: 'm2', name: 'Camellia Cleansing Oil', tab: 'Cleanse', note: 'Melts SPF and mascara', size: '200 ml', price: 28, img: u(P.perfumeAlt), hue: 20 },
    { id: 'm3', name: 'Vitamin C 15% Serum', tab: 'Treat', note: 'Brightens in four weeks', size: '30 ml', price: 46, img: u(P.serum) },
    { id: 'm4', name: 'Niacinamide 10% Serum', tab: 'Treat', note: 'Refines pores, calms redness', size: '30 ml', price: 34, img: u(P.serum), hue: 160 },
    { id: 'm5', name: 'Retinal Night Serum', tab: 'Treat', note: '0.05% encapsulated retinal', size: '30 ml', price: 58, img: u(P.serum), hue: 260 },
    { id: 'm6', name: 'Barrier Repair Cream', tab: 'Hydrate', note: 'Ceramides + squalane', size: '50 ml', price: 34, img: u(P.skincare), hue: 190 },
    { id: 'm7', name: 'Hyaluronic Water Gel', tab: 'Hydrate', note: 'Five weights of HA', size: '50 ml', price: 30, img: u(P.skincare), hue: 120 },
    { id: 'm8', name: 'Rose Hydrating Mist', tab: 'Hydrate', note: 'Damask rose water', size: '100 ml', price: 19, img: u(P.perfumeAlt) },
    { id: 'm9', name: 'Daily Fluid SPF 50', tab: 'Protect', note: 'Invisible, no white cast', size: '50 ml', price: 32, img: u(P.skincare), hue: 320 },
    { id: 'm10', name: 'Mineral Tint SPF 30', tab: 'Protect', note: 'Zinc oxide, sheer tint', size: '40 ml', price: 36, img: u(P.perfumeBottle) },
    { id: 'm11', name: 'Figue Body Oil', tab: 'Body', note: 'Fig leaf and cedar', size: '100 ml', price: 42, img: u(P.perfumeBottle), hue: 40 },
    { id: 'm12', name: 'Neroli Hand Cream', tab: 'Body', note: 'Shea, fast-absorbing', size: '75 ml', price: 18, img: u(P.perfume), hue: 200 },
  ];
  protected readonly tab = signal<Tab>('All');
  protected readonly query = signal('');
  protected readonly bag = signal<string[]>([]);
  protected readonly inkX = signal(0);
  protected readonly inkW = signal(0);
  private readonly fontTick = signal(0);
  private readonly eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  private readonly matched = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter((p) => `${p.name} ${p.note} ${p.tab}`.toLowerCase().includes(q));
  });
  protected readonly counts = computed(() => {
    const out = { All: this.matched().length } as Record<Tab, number>;
    for (const t of this.tabs.slice(1)) out[t] = this.matched().filter((p) => p.tab === t).length;
    return out;
  });
  protected readonly results = computed(() => (this.tab() === 'All' ? this.matched() : this.matched().filter((p) => p.tab === this.tab())));

  constructor() {
    loadGoogleFonts('Young+Serif');
    afterNextRender(() => {
      document.fonts?.ready.then(() => this.fontTick.set(1));
    });
    afterRenderEffect(() => {
      const t = this.tab();
      this.counts();
      this.fontTick();
      const el = this.host.nativeElement.querySelector<HTMLElement>(`.tab[data-tab="${t}"]`);
      if (!el) return;
      this.inkX.set(el.offsetLeft);
      this.inkW.set(el.offsetWidth);
    });
  }

  fmt(n: number): string {
    return this.eur.format(n);
  }

  parts(name: string): { t: string; hit: boolean }[] {
    const q = this.query().trim();
    if (!q) return [{ t: name, hit: false }];
    const i = name.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return [{ t: name, hit: false }];
    return [
      { t: name.slice(0, i), hit: false },
      { t: name.slice(i, i + q.length), hit: true },
      { t: name.slice(i + q.length), hit: false },
    ].filter((p) => p.t);
  }

  /** Select a tab and slide the scrolling tab rail so the chosen tab is fully in view. */
  pick(t: Tab, e: Event): void {
    this.tab.set(t);
    const el = e.currentTarget as HTMLElement;
    const rail = el.parentElement;
    if (!rail) return;
    const left = el.offsetLeft - 24;
    const right = el.offsetLeft + el.offsetWidth + 24 - rail.clientWidth;
    if (left < rail.scrollLeft) rail.scrollTo({ left });
    else if (right > rail.scrollLeft) rail.scrollTo({ left: right });
  }

  toggle(id: string): void {
    this.bag.update((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  }

  tabKey(e: KeyboardEvent, i: number): void {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + this.tabs.length) % this.tabs.length;
    this.tab.set(this.tabs[n]);
    const btns = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('.tab');
    btns?.[n]?.focus();
  }
}
