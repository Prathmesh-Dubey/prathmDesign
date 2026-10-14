import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Variant {
  label: string;
  price: number;
}

interface Line {
  id: string;
  name: string;
  img: string;
  alt: string;
  variants: Variant[];
  v: number;
  qty: number;
}

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

@Component({
  selector: 'demo-cart-rows-list',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cart">
      <header>
        <h3>Your bag <span>{{ count() }} {{ count() === 1 ? 'item' : 'items' }}</span></h3>
        <div class="ship" [class.done]="remaining() <= 0">
          <p>
            @if (remaining() > 0) { You're {{ fmt(remaining()) }} from free delivery }
            @else { Free delivery unlocked }
          </p>
          <i><b [style.transform]="'scaleX(' + shipPct() + ')'"></b></i>
        </div>
      </header>

      <ul class="rows">
        @for (l of lines(); track l.id) {
          <li class="row">
            <img [src]="l.img" [appImgFallback]="l.id" [alt]="l.alt" />
            <div class="info">
              <p class="name">{{ l.name }}</p>
              <label class="variant">
                <span class="visually-hidden">Size for {{ l.name }}</span>
                <select (change)="setVariant(l.id, sel.selectedIndex)" #sel>
                  @for (v of l.variants; track v.label; let i = $index) {
                    <option [value]="i" [selected]="i === l.v">{{ v.label }} · {{ fmt(v.price) }}</option>
                  }
                </select>
              </label>
            </div>
            <div class="qty" role="group" [attr.aria-label]="'Quantity for ' + l.name">
              <button type="button" (click)="setQty(l.id, l.qty - 1)" [disabled]="l.qty <= 1" aria-label="Decrease">−</button>
              <output aria-live="polite">{{ l.qty }}</output>
              <button type="button" (click)="setQty(l.id, l.qty + 1)" [disabled]="l.qty >= 9" aria-label="Increase">+</button>
            </div>
            <p class="sub">{{ fmt(l.variants[l.v].price * l.qty) }}</p>
            <button type="button" class="rm" (click)="remove(l.id)" [attr.aria-label]="'Remove ' + l.name">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
            </button>
          </li>
        } @empty {
          <li class="empty">Your bag is empty. The Lumen Ritual set is back in stock.</li>
        }
      </ul>

      @if (undo(); as u) {
        <div class="toast" role="status">
          {{ u.name }} removed
          <button type="button" (click)="restore()">Undo</button>
        </div>
      }

      <footer>
        <form class="promo" (submit)="apply($event, code.value)">
          <label class="visually-hidden" for="promo">Promo code</label>
          <input id="promo" #code placeholder="Promo code (try GLOW10)" autocomplete="off" />
          <button type="submit">Apply</button>
        </form>
        <dl class="totals">
          <div><dt>Subtotal</dt><dd>{{ fmt(subtotal()) }}</dd></div>
          @if (discount() > 0) { <div class="disc"><dt>GLOW10</dt><dd>−{{ fmt(discount()) }}</dd></div> }
          <div><dt>Delivery</dt><dd>{{ shipping() === 0 ? 'Free' : fmt(shipping()) }}</dd></div>
          <div class="total"><dt>Total</dt><dd>{{ fmt(total()) }}</dd></div>
        </dl>
        <button type="button" class="checkout" [disabled]="!count()">Checkout</button>
      </footer>
    </div>
  `,
  styles: `
    :host { display: grid; place-items: center; min-height: 100%; padding: 28px 14px; background: #efe6ea; font-family: 'Hanken Grotesk', sans-serif; color: #2b1d22; container-type: inline-size; }
    .cart { position: relative; width: min(720px, 100%); background: #fff; border-radius: 20px; padding: 22px clamp(14px, 3cqw, 28px); box-shadow: 0 30px 60px -40px rgba(80,20,40,.45); }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 18px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid #f0e4e8; }
    h3 { font-size: 24px; font-weight: 700; letter-spacing: -.02em; }
    h3 span { font-size: 14px; font-weight: 500; color: #8a6f78; margin-left: 6px; }
    .ship { width: min(260px, 100%); font-size: 12.5px; color: #8a6f78; }
    .ship i { display: block; height: 5px; border-radius: 3px; background: #f3e7eb; margin-top: 6px; overflow: hidden; }
    .ship b { display: block; height: 100%; background: #b2416a; transform-origin: left; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    .ship.done p { color: #2f7a52; font-weight: 600; }
    .ship.done b { background: #2f7a52; }
    .rows { list-style: none; margin: 0; padding: 0; }
    .row { display: grid; grid-template-columns: 64px 1fr auto 76px 32px; gap: 14px; align-items: center; padding: 14px 0; border-bottom: 1px solid #f6edf0; animation: in .35s ease-out both; }
    @keyframes in { from { opacity: 0; transform: translateY(6px); } }
    .row img { width: 64px; height: 64px; border-radius: 14px; object-fit: cover; background: #f6eef1; }
    .name { font-weight: 600; font-size: 15px; }
    select { margin-top: 4px; font: inherit; font-size: 13px; color: #6d5560; border: 1px solid #ecdde2; border-radius: 8px; padding: 4px 8px; background: #fbf7f8; cursor: pointer; max-width: 100%; }
    .qty { display: flex; align-items: center; border: 1px solid #ecdde2; border-radius: 999px; padding: 3px; }
    .qty button { width: 28px; height: 28px; border-radius: 50%; border: 0; background: transparent; cursor: pointer; font-size: 16px; }
    @media (hover: hover) { .qty button:hover:not(:disabled) { background: #f6eef1; } }
    .qty button:active:not(:disabled) { background: #f0e1e6; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .qty button:disabled { opacity: .3; cursor: default; }
    output { min-width: 22px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
    .sub { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
    .rm { width: 32px; height: 32px; border-radius: 50%; border: 0; background: transparent; cursor: pointer; color: #a78d96; display: grid; place-items: center; }
    @media (hover: hover) { .rm:hover { background: #fbeff3; color: #b2416a; } }
    .rm:active { background: #fbeff3; color: #b2416a; }
    @media (pointer: coarse) {
      .qty button { width: 36px; height: 36px; }
      .rm { width: 40px; height: 40px; margin-right: -4px; }
      /* 16px stops iOS zooming the page when the field is focused. */
      select, .promo input { font-size: 16px; }
      select { padding: 6px 8px; }
      .promo input, .promo button { height: 44px; }
    }
    .rm svg { width: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    .empty { padding: 30px 0; text-align: center; color: #8a6f78; }
    .toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); background: #2b1d22; color: #fff; padding: 10px 10px 10px 16px; border-radius: 999px; font-size: 13.5px; display: flex; align-items: center; gap: 12px; white-space: nowrap; animation: in .3s ease-out; z-index: 2; }
    .toast button { border: 0; background: #fff; color: #2b1d22; border-radius: 999px; padding: 5px 12px; cursor: pointer; font-weight: 600; font-size: 13px; }
    footer { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 28px; margin-top: 16px; align-items: start; }
    .promo { display: flex; gap: 6px; }
    .promo input { flex: 1; min-width: 0; font: inherit; font-size: 13.5px; border: 1px solid #ecdde2; border-radius: 10px; padding: 0 12px; height: 40px; }
    .promo button { height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #2b1d22; background: transparent; cursor: pointer; font-weight: 600; }
    .totals { margin: 0; display: grid; gap: 6px; font-size: 14px; }
    .totals div { display: flex; justify-content: space-between; }
    dt { color: #8a6f78; } dd { margin: 0; font-variant-numeric: tabular-nums; }
    .disc dd, .disc dt { color: #2f7a52; }
    .total { border-top: 1px solid #f0e4e8; padding-top: 8px; font-size: 17px; font-weight: 700; }
    .total dt { color: #2b1d22; }
    .checkout { grid-column: 2; height: 50px; border-radius: 14px; border: 0; background: #b2416a; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .2s; }
    @media (hover: hover) { .checkout:hover { background: #962f56; } }
    .checkout:active:not(:disabled) { background: #962f56; transform: scale(.99); }
    .checkout:disabled { background: #e3ccd5; cursor: default; }
    @container (max-width: 600px) {
      .row { grid-template-columns: 56px 1fr 32px; grid-template-areas: 'img info rm' 'img qty sub'; row-gap: 8px; }
      .row img { grid-area: img; width: 56px; height: 56px; align-self: start; }
      .info { grid-area: info; } .qty { grid-area: qty; justify-self: start; } .sub { grid-area: sub; grid-column: 2 / 4; } .rm { grid-area: rm; }
      footer { grid-template-columns: 1fr; }
      .checkout { grid-column: 1; }
      .toast { white-space: normal; max-width: calc(100% - 24px); width: max-content; border-radius: 16px; }
      header { gap: 12px; }
      .ship { width: 100%; }
    }
  `,
})
export class CartRowsList {
  protected readonly lines = signal<Line[]>([
    { id: 'serum', name: 'Lumen Vitamin C Serum', img: unsplash(PRODUCT_PHOTOS.serum, 200, 200), alt: 'Lumen Vitamin C serum dropper bottle', variants: [{ label: '15 ml', price: 28 }, { label: '30 ml', price: 46 }], v: 1, qty: 1 },
    { id: 'cream', name: 'Barrier Repair Cream', img: unsplash(PRODUCT_PHOTOS.skincare, 200, 200), alt: 'Barrier Repair Cream jar', variants: [{ label: '50 ml', price: 34 }, { label: '100 ml refill', price: 52 }], v: 0, qty: 1 },
    { id: 'mist', name: 'Rose Hydrating Mist', img: unsplash(PRODUCT_PHOTOS.perfumeAlt, 200, 200), alt: 'Rose hydrating mist bottle', variants: [{ label: '100 ml', price: 19 }, { label: '200 ml', price: 29 }], v: 0, qty: 2 },
  ]);
  protected readonly undo = signal<{ line: Line; index: number; name: string } | null>(null);
  protected readonly promo = signal(false);
  protected readonly threshold = 75;

  protected readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  protected readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.variants[l.v].price * l.qty, 0));
  protected readonly discount = computed(() => (this.promo() ? Math.round(this.subtotal() * 10) / 100 : 0));
  protected readonly remaining = computed(() => this.threshold - this.subtotal());
  protected readonly shipPct = computed(() => Math.min(1, this.subtotal() / this.threshold));
  protected readonly shipping = computed(() => (this.remaining() <= 0 || !this.count() ? 0 : 4.95));
  protected readonly total = computed(() => this.subtotal() - this.discount() + this.shipping());

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    loadGoogleFonts('Hanken+Grotesk:wght@400;500;600;700');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  fmt(n: number): string {
    return gbp.format(n);
  }

  setQty(id: string, qty: number): void {
    this.lines.update((ls) => ls.map((l) => (l.id === id ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l)));
  }

  setVariant(id: string, v: number): void {
    this.lines.update((ls) => ls.map((l) => (l.id === id ? { ...l, v } : l)));
  }

  remove(id: string): void {
    const ls = this.lines();
    const index = ls.findIndex((l) => l.id === id);
    if (index < 0) return;
    this.undo.set({ line: ls[index], index, name: ls[index].name });
    this.lines.set(ls.filter((l) => l.id !== id));
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.undo.set(null), 4000);
  }

  restore(): void {
    const u = this.undo();
    if (!u) return;
    this.lines.update((ls) => [...ls.slice(0, u.index), u.line, ...ls.slice(u.index)]);
    this.undo.set(null);
  }

  apply(e: Event, code: string): void {
    e.preventDefault();
    this.promo.set(code.trim().toUpperCase() === 'GLOW10');
  }
}
