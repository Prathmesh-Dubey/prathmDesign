import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

type Use = 'Running' | 'Court' | 'Trail' | 'Lifestyle';
type Sort = 'popular' | 'asc' | 'desc';

interface Shoe {
  id: string;
  name: string;
  colour: string;
  use: Use;
  price: number;
  sizes: number[];
  pop: number;
  img: string;
  hue: number;
}

const P = PRODUCT_PHOTOS;
const all = [6, 7, 8, 9, 10, 11];

@Component({
  selector: 'demo-facet-chips-catalogue',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <header>
        <h3>All sneakers <sup>{{ filtered().length }}</sup></h3>
        <div class="sort" role="radiogroup" aria-label="Sort">
          @for (s of sorts; track s.id) {
            <button type="button" role="radio" [attr.aria-checked]="sort() === s.id" [class.on]="sort() === s.id" (click)="sort.set(s.id)">{{ s.label }}</button>
          }
        </div>
      </header>

      <div class="facets">
        <div class="group" role="group" aria-label="Use">
          @for (u of uses; track u) {
            <button type="button" class="chip" [class.on]="useSel().includes(u)" [attr.aria-pressed]="useSel().includes(u)" (click)="toggleUse(u)">{{ u }}</button>
          }
        </div>
        <span class="sep" aria-hidden="true"></span>
        <div class="group" role="group" aria-label="UK size">
          @for (s of sizes; track s) {
            <button type="button" class="chip size" [class.on]="sizeSel().includes(s)" [attr.aria-pressed]="sizeSel().includes(s)" (click)="toggleSize(s)" [attr.aria-label]="'UK ' + s">{{ s }}</button>
          }
        </div>
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="chip" [class.on]="under()" [attr.aria-pressed]="under()" (click)="under.set(!under())">Under $150</button>
      </div>

      @if (active().length) {
        <div class="active">
          @for (a of active(); track a.label) {
            <button type="button" (click)="a.clear()">{{ a.label }}<span aria-hidden="true">✕</span><span class="visually-hidden"> remove</span></button>
          }
          <button type="button" class="clear" (click)="clearAll()">Clear all</button>
        </div>
      }

      <div class="results">
        @if (filtered().length) {
          <ul class="grid">
            @for (s of visible(); track s.id; let i = $index) {
              <li class="card" [style.animation-delay.ms]="(i % pageSize) * 40">
                <div class="media">
                  <img [src]="s.img" [appImgFallback]="s.id" [alt]="s.name + ' in ' + s.colour" [style.filter]="'hue-rotate(' + s.hue + 'deg)'" loading="lazy" />
                  <span class="use">{{ s.use }}</span>
                </div>
                <div class="meta">
                  <p class="name">{{ s.name }}</p>
                  <p class="price">\${{ s.price }}</p>
                </div>
                <p class="sub">{{ s.colour }} · {{ s.sizes.length === 6 ? 'All sizes' : s.sizes.length + ' sizes left' }}</p>
              </li>
            }
            @if (loading()) {
              @for (k of skeletons; track k) {
                <li class="card skel" aria-hidden="true"><div class="media"></div><i></i><i class="short"></i></li>
              }
            }
          </ul>
          <div class="more">
            <p aria-live="polite">Showing {{ visible().length }} of {{ filtered().length }}</p>
            <i class="meter" aria-hidden="true"><b [style.transform]="'scaleX(' + visible().length / filtered().length + ')'"></b></i>
            @if (visible().length < filtered().length) {
              <button type="button" (click)="loadMore()" [disabled]="loading()">{{ loading() ? 'Loading…' : 'Load more' }}</button>
            }
          </div>
        } @else {
          <div class="empty">
            <p class="big">No pairs in that combo.</p>
            <p>UK {{ sizeSel().join(', ') }} sells out fast in {{ useSel().join(' and ') || 'this range' }}. Try removing a size.</p>
            <button type="button" (click)="clearAll()">Clear all filters</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 720px; container-type: inline-size; background: #fbfbfa; color: #0d0d0d; font-family: 'Geist', sans-serif; }
    .wrap { display: flex; flex-direction: column; height: 100%; }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 14px; padding: 22px clamp(14px, 3cqw, 30px) 12px; flex-wrap: wrap; }
    h3 { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: clamp(40px, 7cqw, 72px); line-height: .85; text-transform: uppercase; letter-spacing: -.01em; }
    h3 sup { font-family: 'Geist Mono', monospace; font-size: 14px; font-weight: 500; vertical-align: top; color: #ff3d8b; margin-left: 4px; }
    .sort { display: flex; background: #efefed; border-radius: 999px; padding: 3px; }
    .sort button { height: 32px; padding: 0 12px; border-radius: 999px; border: 0; background: transparent; cursor: pointer; font: inherit; font-size: 13px; color: #555; transition: background .2s, color .2s; }
    .sort button.on { background: #0d0d0d; color: #fff; }
    .facets { display: flex; align-items: center; gap: 8px; padding: 6px clamp(14px, 3cqw, 30px) 12px; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .sort button:active, .active button:active { transform: scale(.96); }
    .facets::-webkit-scrollbar { display: none; }
    .group { display: flex; gap: 6px; flex: none; }
    .sep { width: 1px; height: 24px; background: #ddd; flex: none; margin: 0 4px; }
    .chip { flex: none; height: 36px; padding: 0 14px; border-radius: 999px; border: 1.5px solid #d8d8d4; background: #fff; cursor: pointer; font: inherit; font-size: 13.5px; transition: border-color .15s, background .15s, color .15s, transform .15s; }
    @media (hover: hover) { .chip:hover { border-color: #0d0d0d; } }
    .chip:active { transform: scale(.96); }
    .chip.on { background: #ff3d8b; border-color: #ff3d8b; color: #fff; }
    .chip.size { width: 40px; padding: 0; font-family: 'Geist Mono', monospace; font-size: 13px; }
    .active { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 clamp(14px, 3cqw, 30px) 10px; }
    .active button { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 6px; border: 0; background: #0d0d0d; color: #fff; cursor: pointer; font: inherit; font-size: 12.5px; }
    .active button span[aria-hidden] { font-size: 10px; opacity: .7; }
    .active .clear { background: none; color: #0d0d0d; text-decoration: underline; text-underline-offset: 3px; }
    @media (pointer: coarse) {
      .sort button { height: 38px; }
      .chip { height: 40px; }
      .chip.size { width: 44px; }
      .active button { height: 34px; padding: 0 12px; }
    }
    .results { flex: 1; overflow-y: auto; padding: 6px clamp(14px, 3cqw, 30px) 28px; min-height: 0; border-top: 1px solid #eee; }
    .grid { list-style: none; margin: 10px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 22px 14px; }
    .card { animation: rise .45s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
    .media { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #efefed; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.06) rotate(-2deg); } }
    .use { position: absolute; top: 8px; left: 8px; font-size: 11px; font-weight: 600; background: #fff; padding: 3px 8px; border-radius: 999px; }
    .meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 10px; }
    .name { font-weight: 600; font-size: 14.5px; }
    .price { font-family: 'Geist Mono', monospace; font-size: 14px; }
    .sub { font-size: 12.5px; color: #6b6b66; margin-top: 2px; }
    .skel .media, .skel i { background: linear-gradient(90deg, #efefed 30%, #f8f8f6 50%, #efefed 70%); background-size: 300% 100%; animation: shimmer 1.1s linear infinite; }
    .skel i { display: block; height: 12px; border-radius: 6px; margin-top: 12px; width: 80%; }
    .skel i.short { width: 45%; margin-top: 8px; }
    @keyframes shimmer { from { background-position: 100% 0; } to { background-position: 0 0; } }
    .more { display: grid; justify-items: center; gap: 10px; margin-top: 28px; font-size: 13px; color: #6b6b66; }
    .meter { width: 180px; height: 3px; background: #e6e6e3; border-radius: 2px; overflow: hidden; }
    .meter b { display: block; height: 100%; background: #0d0d0d; transform-origin: left; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    .more button { height: 46px; padding: 0 28px; border-radius: 999px; border: 1.5px solid #0d0d0d; background: #0d0d0d; color: #fff; cursor: pointer; font: inherit; font-weight: 600; font-size: 14px; transition: background .2s, color .2s; }
    @media (hover: hover) { .more button:hover:not(:disabled) { background: #fff; color: #0d0d0d; } }
    .more button:active:not(:disabled) { background: #fff; color: #0d0d0d; }
    .more button:disabled { opacity: .6; cursor: progress; }
    .empty { padding: 50px 0; max-width: 440px; display: grid; gap: 8px; }
    .empty .big { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: 40px; text-transform: uppercase; line-height: .9; }
    .empty p { color: #6b6b66; }
    .empty button { justify-self: start; margin-top: 6px; height: 42px; padding: 0 18px; border-radius: 999px; border: 0; background: #ff3d8b; color: #fff; cursor: pointer; font: inherit; font-weight: 600; }
    @container (max-width: 480px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 10px; }
      header { padding-top: 18px; }
      .sort { width: 100%; }
      .sort button { flex: 1; }
      /* The chip rail scrolls sideways; fade its edges so it reads as scrollable. */
      .facets {
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 14px, #000 calc(100% - 26px), transparent);
        mask-image: linear-gradient(90deg, transparent, #000 14px, #000 calc(100% - 26px), transparent);
      }
      .name { font-size: 14px; }
      .meta { flex-wrap: wrap; gap: 0 8px; }
    }
  `,
})
export class FacetChipsCatalogue {
  protected readonly pageSize = 6;
  protected readonly uses: Use[] = ['Running', 'Court', 'Trail', 'Lifestyle'];
  protected readonly sizes = all;
  protected readonly sorts: { id: Sort; label: string }[] = [
    { id: 'popular', label: 'Popular' },
    { id: 'asc', label: 'Price ↑' },
    { id: 'desc', label: 'Price ↓' },
  ];
  protected readonly skeletons = [0, 1, 2];
  private readonly shoes: Shoe[] = [
    { id: 's1', name: 'Kite Runner 2', colour: 'Signal Red', use: 'Running', price: 160, sizes: all, pop: 98, img: unsplash(P.sneakerRed, 480, 480), hue: 0 },
    { id: 's2', name: 'Arc Court Low', colour: 'Chalk', use: 'Court', price: 140, sizes: [7, 8, 9, 10], pop: 92, img: unsplash(P.sneakerWhite, 480, 480), hue: 0 },
    { id: 's3', name: 'Tempo 9', colour: 'Bone / Gum', use: 'Lifestyle', price: 175, sizes: all, pop: 90, img: unsplash(P.sneakerPair, 480, 480), hue: 0 },
    { id: 's4', name: 'Drift Knit', colour: 'Dusk', use: 'Lifestyle', price: 130, sizes: [6, 7, 8], pop: 71, img: unsplash(P.shoes, 480, 480), hue: 0 },
    { id: 's5', name: 'Ridge Trail GTX', colour: 'Moss', use: 'Trail', price: 190, sizes: [8, 9, 10, 11], pop: 84, img: unsplash(P.sneakerRed, 480, 480), hue: 90 },
    { id: 's6', name: 'Kite Runner 2', colour: 'Cobalt', use: 'Running', price: 160, sizes: [6, 9, 10], pop: 88, img: unsplash(P.sneakerRed, 480, 480), hue: 205 },
    { id: 's7', name: 'Arc Court Low', colour: 'Sage', use: 'Court', price: 140, sizes: all, pop: 66, img: unsplash(P.sneakerWhite, 480, 480), hue: 70 },
    { id: 's8', name: 'Tempo 9', colour: 'Plum', use: 'Lifestyle', price: 165, sizes: [7, 8, 11], pop: 59, img: unsplash(P.sneakerPair, 480, 480), hue: 260 },
    { id: 's9', name: 'Ridge Trail GTX', colour: 'Rust', use: 'Trail', price: 190, sizes: [6, 7], pop: 62, img: unsplash(P.sneakerRed, 480, 480), hue: 25 },
    { id: 's10', name: 'Pace Lite', colour: 'Ice', use: 'Running', price: 120, sizes: all, pop: 80, img: unsplash(P.sneakerWhite, 480, 480), hue: 180 },
    { id: 's11', name: 'Drift Knit', colour: 'Olive', use: 'Lifestyle', price: 125, sizes: [9, 10, 11], pop: 55, img: unsplash(P.shoes, 480, 480), hue: 60 },
    { id: 's12', name: 'Baseline 84', colour: 'Navy / Cream', use: 'Court', price: 110, sizes: [6, 8, 10], pop: 77, img: unsplash(P.sneakerPair, 480, 480), hue: 190 },
    { id: 's13', name: 'Pace Lite', colour: 'Coral', use: 'Running', price: 120, sizes: [7, 8, 9], pop: 69, img: unsplash(P.sneakerRed, 480, 480), hue: 340 },
    { id: 's14', name: 'Scree Mid', colour: 'Charcoal', use: 'Trail', price: 210, sizes: all, pop: 73, img: unsplash(P.shoes, 480, 480), hue: 200 },
  ];
  protected readonly useSel = signal<Use[]>([]);
  protected readonly sizeSel = signal<number[]>([]);
  protected readonly under = signal(false);
  protected readonly sort = signal<Sort>('popular');
  protected readonly shown = signal(6);
  protected readonly loading = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  protected readonly filtered = computed(() => {
    const list = this.shoes.filter(
      (s) =>
        (!this.useSel().length || this.useSel().includes(s.use)) &&
        (!this.sizeSel().length || this.sizeSel().every((z) => s.sizes.includes(z))) &&
        (!this.under() || s.price < 150),
    );
    const k = this.sort();
    return [...list].sort((a, b) => (k === 'asc' ? a.price - b.price : k === 'desc' ? b.price - a.price : b.pop - a.pop));
  });
  protected readonly visible = computed(() => this.filtered().slice(0, this.shown()));
  protected readonly active = computed(() => {
    const out: { label: string; clear: () => void }[] = [];
    this.useSel().forEach((u) => out.push({ label: u, clear: () => this.toggleUse(u) }));
    this.sizeSel().forEach((s) => out.push({ label: 'UK ' + s, clear: () => this.toggleSize(s) }));
    if (this.under()) out.push({ label: 'Under $150', clear: () => this.under.set(false) });
    return out;
  });

  constructor() {
    loadGoogleFonts('Big+Shoulders+Display:wght@700;800');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    effect(() => {
      this.useSel();
      this.sizeSel();
      this.under();
      untracked(() => {
        clearTimeout(this.timer);
        this.loading.set(false);
        this.shown.set(this.pageSize);
      });
    });
  }

  toggleUse(u: Use): void {
    this.useSel.update((s) => (s.includes(u) ? s.filter((x) => x !== u) : [...s, u]));
  }

  toggleSize(z: number): void {
    this.sizeSel.update((s) => (s.includes(z) ? s.filter((x) => x !== z) : [...s, z].sort((a, b) => a - b)));
  }

  clearAll(): void {
    this.useSel.set([]);
    this.sizeSel.set([]);
    this.under.set(false);
  }

  loadMore(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.timer = setTimeout(() => {
      this.shown.update((n) => n + this.pageSize);
      this.loading.set(false);
    }, prefersReducedMotion() ? 0 : 650);
  }
}
