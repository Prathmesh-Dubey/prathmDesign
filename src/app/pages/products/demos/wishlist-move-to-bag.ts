import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Wish {
  id: string;
  name: string;
  detail: string;
  price: number;
  img: string;
  alt: string;
  stock: 'in' | 'low' | 'out';
  saved: string;
}

@Component({
  selector: 'demo-wishlist-move-to-bag',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <header>
        <div>
          <h3>Wishlist</h3>
          <p>{{ wishes().length }} saved · {{ fmt(wishTotal()) }}</p>
        </div>
        <button type="button" class="bag-btn" (click)="bagOpen.set(!bagOpen())" [attr.aria-expanded]="bagOpen()" aria-controls="wl-bag">
          Bag
          <span class="n" [class.pulse]="pulse()">{{ bag().length }}</span>
        </button>
      </header>

      @if (bagOpen()) {
        <div class="bag" id="wl-bag" role="region" aria-label="Bag contents">
          @for (b of bag(); track b.id) {
            <div class="bag-row">
              <span>{{ b.name }}</span>
              <span class="bp">{{ fmt(b.price) }}</span>
              <button type="button" (click)="moveBack(b.id)">Move back</button>
            </div>
          } @empty {
            <p class="bag-empty">Nothing in your bag yet.</p>
          }
          @if (bag().length) { <p class="bag-total">Bag total <strong>{{ fmt(bagTotal()) }}</strong></p> }
        </div>
      }

      <ul class="list">
        @for (w of wishes(); track w.id) {
          <li class="row" [class.leaving]="leaving().includes(w.id)">
            <div class="inner">
              <img [src]="w.img" [appImgFallback]="w.id" [alt]="w.alt" />
              <div class="info">
                <p class="name">{{ w.name }}</p>
                <p class="detail">{{ w.detail }}</p>
                <p class="stock" [class]="'stock ' + w.stock">
                  {{ w.stock === 'in' ? 'In stock' : w.stock === 'low' ? 'Only 2 left' : 'Sold out' }} · saved {{ w.saved }}
                </p>
              </div>
              <p class="price">{{ fmt(w.price) }}</p>
              <div class="acts">
                @if (w.stock === 'out') {
                  <button type="button" class="ghost" [class.on]="notify().includes(w.id)" (click)="toggleNotify(w.id)" [attr.aria-pressed]="notify().includes(w.id)">
                    {{ notify().includes(w.id) ? 'We’ll email you' : 'Notify me' }}
                  </button>
                } @else {
                  <button type="button" class="move" (click)="move(w.id)">Move to bag</button>
                }
                <button type="button" class="rm" (click)="remove(w.id)" [attr.aria-label]="'Remove ' + w.name + ' from wishlist'">Remove</button>
              </div>
            </div>
          </li>
        } @empty {
          <li class="empty">Your wishlist is empty — everything made it to the bag.</li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host { display: grid; place-items: center; min-height: 100%; padding: 28px 14px; background: #efe9f2; font-family: 'Geist', sans-serif; color: #2b1a2e; container-type: inline-size; }
    .panel { position: relative; width: min(700px, 100%); background: #fbf9fc; border: 1px solid #e3d8e8; border-radius: 6px; padding: 22px clamp(14px, 3cqw, 26px); }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid #2b1a2e; }
    h3 { font-family: 'Newsreader', serif; font-weight: 400; font-style: italic; font-size: 34px; line-height: 1; }
    header p { font-size: 13px; color: #7a647f; margin-top: 4px; }
    .bag-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 8px 0 16px; border-radius: 999px; border: 1px solid #2b1a2e; background: transparent; cursor: pointer; font-size: 14px; }
    .n { min-width: 26px; height: 26px; border-radius: 13px; background: #2b1a2e; color: #fbf9fc; display: grid; place-items: center; font-size: 12.5px; font-weight: 600; }
    .n.pulse { animation: pulse .5s cubic-bezier(.3,1.6,.5,1); }
    @keyframes pulse { 40% { transform: scale(1.35); background: #9b4f8f; } }
    .bag { position: absolute; z-index: 3; right: clamp(14px, 3cqw, 26px); top: 76px; width: min(320px, calc(100% - 28px)); background: #2b1a2e; color: #f3e9f5; border-radius: 12px; padding: 12px; box-shadow: 0 24px 40px -20px rgba(43,26,46,.6); animation: drop .25s ease-out; }
    @keyframes drop { from { opacity: 0; transform: translateY(-6px); } }
    .bag-row { display: grid; grid-template-columns: 1fr auto auto; gap: 10px; align-items: center; font-size: 13px; padding: 7px 4px; border-bottom: 1px solid rgba(255,255,255,.1); }
    .bp { font-family: 'Geist Mono', monospace; font-size: 12px; }
    .bag-row button { border: 0; background: rgba(255,255,255,.12); color: inherit; border-radius: 999px; font-size: 12px; padding: 4px 10px; cursor: pointer; }
    .bag-empty { font-size: 13px; padding: 6px 4px; color: #cdb9d2; }
    .bag-total { display: flex; justify-content: space-between; font-size: 13px; padding: 10px 4px 2px; }
    .list { list-style: none; margin: 0; padding: 0; }
    .row { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .4s cubic-bezier(.2,.8,.2,1) .15s, opacity .3s; }
    .row .inner { overflow: hidden; min-height: 0; display: grid; grid-template-columns: 72px 1fr auto auto; gap: 16px; align-items: center; padding: 14px 0; border-bottom: 1px solid #e8dfeb; transition: transform .45s cubic-bezier(.6,0,.3,1), opacity .35s; }
    .row.leaving { grid-template-rows: 0fr; }
    .row.leaving .inner { transform: translateX(60px); opacity: 0; padding-block: 0; border-color: transparent; }
    .inner img { width: 72px; height: 90px; object-fit: cover; border-radius: 3px; background: #e9e0ec; }
    .name { font-family: 'Newsreader', serif; font-size: 19px; line-height: 1.15; }
    .detail { font-size: 13px; color: #7a647f; margin-top: 2px; }
    .stock { font-size: 12px; margin-top: 6px; color: #7a647f; }
    .stock.low { color: #a2462e; }
    .stock.out { color: #9a8aa0; }
    .price { font-family: 'Geist Mono', monospace; font-size: 14px; }
    .acts { display: grid; gap: 4px; justify-items: end; }
    .move { height: 38px; padding: 0 16px; border: 0; border-radius: 999px; background: #2b1a2e; color: #fbf9fc; cursor: pointer; font-size: 13.5px; white-space: nowrap; transition: background .2s; }
    @media (hover: hover) { .move:hover { background: #4a2f50; } }
    .move:active { background: #4a2f50; transform: scale(.97); }
    .ghost:active, .bag-btn:active { transform: scale(.97); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @media (pointer: coarse) {
      .move, .ghost { height: 42px; }
      .rm { padding: 10px 6px; }
      .bag-row button { padding: 9px 12px; }
      .bag-btn { height: 44px; }
    }
    .ghost { height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid #c9b8cf; background: transparent; cursor: pointer; font-size: 13.5px; white-space: nowrap; color: #2b1a2e; }
    .ghost.on { background: #ece2f0; border-color: #ece2f0; }
    .rm { border: 0; background: none; font-size: 12px; color: #7a647f; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; padding: 2px; }
    .empty { padding: 36px 0; text-align: center; font-family: 'Newsreader', serif; font-style: italic; font-size: 18px; color: #7a647f; }
    @container (max-width: 560px) {
      .row .inner { grid-template-columns: 60px 1fr auto; }
      .inner img { width: 60px; height: 76px; }
      .acts { grid-column: 2 / 4; justify-items: start; grid-auto-flow: column; justify-content: start; align-items: center; gap: 12px; }
      .row .inner { gap: 6px 14px; }
      .name { font-size: 17px; }
      h3 { font-size: 30px; }
      .bag { top: 70px; }
    }
  `,
})
export class WishlistMoveToBag {
  protected readonly wishes = signal<Wish[]>([
    { id: 'noir', name: 'Noir Vetiver Eau de Parfum 50ml', detail: 'Woody aromatic · Maison Varga', price: 145, img: unsplash(PRODUCT_PHOTOS.perfume, 200, 250), alt: 'Noir Vetiver perfume bottle', stock: 'in', saved: '3 days ago' },
    { id: 'ambre', name: 'Ambre Sel Extrait 30ml', detail: 'Amber, sea salt, labdanum', price: 168, img: unsplash(PRODUCT_PHOTOS.perfumeBottle, 200, 250), alt: 'Ambre Sel extrait bottle', stock: 'low', saved: 'last week' },
    { id: 'cote', name: 'Côte 02 Acetate Sunglasses', detail: 'Tortoise · Zeiss grey lenses', price: 310, img: unsplash(PRODUCT_PHOTOS.sunglasses, 200, 250), alt: 'Côte 02 tortoiseshell sunglasses', stock: 'in', saved: '2 weeks ago' },
    { id: 'figue', name: 'Figue Noire Body Oil 100ml', detail: 'Fig leaf, cedar, cold-pressed oils', price: 62, img: unsplash(PRODUCT_PHOTOS.perfumeAlt, 200, 250), alt: 'Figue Noire body oil bottle', stock: 'out', saved: 'in March' },
  ]);
  protected readonly bag = signal<Wish[]>([]);
  protected readonly leaving = signal<string[]>([]);
  protected readonly notify = signal<string[]>([]);
  protected readonly bagOpen = signal(false);
  protected readonly pulse = signal(false);
  protected readonly wishTotal = computed(() => this.wishes().reduce((s, w) => s + w.price, 0));
  protected readonly bagTotal = computed(() => this.bag().reduce((s, w) => s + w.price, 0));
  private readonly eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    loadGoogleFonts('Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400');
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
  }

  fmt(n: number): string {
    return this.eur.format(n);
  }

  move(id: string): void {
    const w = this.wishes().find((x) => x.id === id);
    if (!w || this.leaving().includes(id)) return;
    this.leaving.update((l) => [...l, id]);
    const delay = prefersReducedMotion() ? 0 : 560;
    this.timers.push(
      setTimeout(() => {
        this.wishes.update((ls) => ls.filter((x) => x.id !== id));
        this.leaving.update((l) => l.filter((x) => x !== id));
        this.bag.update((b) => [...b, w]);
        this.pulse.set(true);
        this.timers.push(setTimeout(() => this.pulse.set(false), 500));
      }, delay),
    );
  }

  moveBack(id: string): void {
    const w = this.bag().find((x) => x.id === id);
    if (!w) return;
    this.bag.update((b) => b.filter((x) => x.id !== id));
    this.wishes.update((ls) => [w, ...ls]);
  }

  remove(id: string): void {
    this.wishes.update((ls) => ls.filter((x) => x.id !== id));
  }

  toggleNotify(id: string): void {
    this.notify.update((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));
  }
}
