import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterRenderEffect, computed, inject, signal, viewChild } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Item {
  id: string;
  name: string;
  spec: string;
  price: number;
  img: string;
  span?: boolean;
}

interface Line {
  id: string;
  qty: number;
}

@Component({
  selector: 'demo-cart-drawer-catalogue',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.escape)': 'close()' },
  template: `
    <div class="shop" [attr.inert]="open() ? '' : null">
      <header>
        <span class="logo">HALCYON<sup>audio</sup></span>
        <nav aria-label="Shop sections"><span>Headphones</span><span>Speakers</span><span>Devices</span></nav>
        <button type="button" class="cart-btn" (click)="openDrawer()" [attr.aria-label]="'Open cart, ' + count() + ' items'">
          Cart <span class="badge" [class.bump]="bump()">{{ count() }}</span>
        </button>
      </header>
      <div class="scroll">
        <div class="intro">
          <h3>Sound gear, <em>tuned in Oslo.</em></h3>
          <p>Free delivery over $500 · 2-year warranty · 45-day returns</p>
        </div>
        <ul class="grid">
          @for (p of items; track p.id) {
            <li class="tile" [class.span]="p.span">
              <div class="media"><img [src]="p.img" [appImgFallback]="p.id" [alt]="p.name" loading="lazy" /></div>
              <div class="body">
                <div>
                  <p class="name">{{ p.name }}</p>
                  <p class="spec">{{ p.spec }}</p>
                </div>
                <div class="buy">
                  <span class="price">{{ fmt(p.price) }}</span>
                  <button type="button" class="add" (click)="add(p.id)" [class.in]="qtyOf(p.id) > 0">
                    {{ qtyOf(p.id) > 0 ? 'In cart · ' + qtyOf(p.id) : 'Add to cart' }}
                  </button>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    </div>

    <div class="scrim" [class.on]="open()" (click)="close()" aria-hidden="true"></div>
    <aside class="drawer" [class.on]="open()" role="dialog" aria-modal="true" aria-labelledby="cd-title" [attr.inert]="open() ? null : ''"
      [class.dragging]="dragX() > 0" [style.transform]="dragX() > 0 ? 'translateX(' + dragX() + 'px)' : null"
      (pointerdown)="dDown($event)" (pointermove)="dMove($event)" (pointerup)="dUp()" (pointercancel)="dCancel()">
      <div class="d-head">
        <h4 id="cd-title">Your cart <span>{{ count() }}</span></h4>
        <button type="button" class="x" #closeBtn (click)="close()" aria-label="Close cart">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>

      @if (placed()) {
        <div class="done">
          <p class="big">Order HX-20418 placed.</p>
          <p>A confirmation is on its way. Delivery in 2–3 working days.</p>
          <button type="button" class="checkout" (click)="placed.set(false); close()">Keep shopping</button>
        </div>
      } @else {
        <div class="ship">
          @if (toFree() > 0) { <p>Add <strong>{{ fmt(toFree()) }}</strong> for free delivery</p> } @else { <p><strong>Free delivery</strong> unlocked</p> }
          <i><b [style.transform]="'scaleX(' + freePct() + ')'"></b></i>
        </div>
        <ul class="lines">
          @for (l of rows(); track l.item.id) {
            <li>
              <img [src]="l.item.img" [appImgFallback]="l.item.id + '-c'" alt="" />
              <div class="l-info">
                <p class="name">{{ l.item.name }}</p>
                <div class="qty" role="group" [attr.aria-label]="'Quantity for ' + l.item.name">
                  <button type="button" (click)="setQty(l.item.id, l.qty - 1)" [attr.aria-label]="l.qty === 1 ? 'Remove ' + l.item.name : 'Decrease'">−</button>
                  <span>{{ l.qty }}</span>
                  <button type="button" (click)="setQty(l.item.id, l.qty + 1)" aria-label="Increase">+</button>
                </div>
              </div>
              <p class="l-price">{{ fmt(l.item.price * l.qty) }}</p>
            </li>
          } @empty {
            <li class="empty">Your cart is empty. The Aster ANC is our most-loved pair.</li>
          }
        </ul>
        <dl class="sum">
          <div><dt>Subtotal</dt><dd>{{ fmt(subtotal()) }}</dd></div>
          <div><dt>Delivery</dt><dd>{{ shipping() ? fmt(shipping()) : 'Free' }}</dd></div>
          <div><dt>Est. tax (8%)</dt><dd>{{ fmt(tax()) }}</dd></div>
          <div class="tot"><dt>Total</dt><dd>{{ fmt(total()) }}</dd></div>
        </dl>
        <button type="button" class="checkout" [disabled]="!count()" (click)="checkout()">Checkout · {{ fmt(total()) }}</button>
      }
    </aside>
  `,
  styles: `
    :host { position: relative; display: block; height: 700px; overflow: hidden; container-type: inline-size; background: #f1f1ee; color: #111; font-family: 'Schibsted Grotesk', sans-serif; }
    .shop { display: flex; flex-direction: column; height: 100%; }
    header { display: flex; align-items: center; gap: 20px; padding: 14px clamp(14px, 3cqw, 28px); border-bottom: 1.5px solid #111; background: #f1f1ee; }
    .logo { font-weight: 900; letter-spacing: .04em; font-size: 18px; }
    .logo sup { font-weight: 500; font-size: 10px; letter-spacing: 0; margin-left: 2px; }
    nav { display: flex; gap: 18px; font-size: 14px; margin-right: auto; }
    .cart-btn { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 6px 0 14px; border: 1.5px solid #111; border-radius: 999px; background: #ffd23f; cursor: pointer; font: inherit; font-weight: 700; font-size: 14px; }
    .badge { min-width: 26px; height: 26px; border-radius: 13px; background: #111; color: #ffd23f; display: grid; place-items: center; font-size: 12px; }
    .badge.bump { animation: bump .45s cubic-bezier(.3,1.6,.5,1); }
    @keyframes bump { 45% { transform: scale(1.4); } }
    .scroll { flex: 1; overflow-y: auto; padding: 22px clamp(14px, 3cqw, 28px) 30px; }
    .intro { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    h3 { font-size: clamp(30px, 5cqw, 52px); font-weight: 800; letter-spacing: -.04em; line-height: .95; }
    h3 em { font-weight: 400; font-style: italic; }
    .intro p { font-size: 13px; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .tile { border: 1.5px solid #111; border-radius: 18px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
    .tile.span { grid-column: span 2; flex-direction: row; }
    .tile.span .media { flex: 1.2; aspect-ratio: auto; }
    .tile.span .body { flex: 1; }
    .media { aspect-ratio: 4 / 3; overflow: hidden; background: #e7e7e3; border-bottom: 1.5px solid #111; }
    .tile.span .media { border-bottom: 0; border-right: 1.5px solid #111; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .tile:hover .media img { transform: scale(1.05); } }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .body { padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; flex: 1; }
    .name { font-weight: 700; font-size: 16px; }
    .spec { font-size: 13px; color: #5b5b55; margin-top: 2px; }
    .buy { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .price { font-weight: 700; font-size: 16px; }
    .add { height: 36px; padding: 0 14px; border-radius: 999px; border: 1.5px solid #111; background: #fff; cursor: pointer; font: inherit; font-weight: 600; font-size: 13px; transition: background .2s; white-space: nowrap; }
    @media (hover: hover) { .add:hover { background: #ffd23f; } }
    .add:active { background: #ffd23f; transform: scale(.97); }
    .cart-btn:active { transform: scale(.97); }
    .add.in { background: #111; color: #ffd23f; }
    .scrim { position: absolute; inset: 0; background: rgba(17,17,17,.4); opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 4; }
    .scrim.on { opacity: 1; pointer-events: auto; }
    .drawer {
      position: absolute; top: 0; right: 0; bottom: 0; width: min(390px, 100%); z-index: 5; background: #fff; border-left: 1.5px solid #111;
      display: flex; flex-direction: column; padding: 18px; transform: translateX(100%); transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .drawer.on { transform: none; }
    /* Swipe the drawer to the right to dismiss it. */
    .drawer { touch-action: pan-y; }
    .drawer.dragging { transition: none; }
    .d-head { display: flex; justify-content: space-between; align-items: center; }
    h4 { font-size: 22px; font-weight: 800; letter-spacing: -.02em; }
    h4 span { font-size: 13px; background: #ffd23f; border: 1.5px solid #111; border-radius: 999px; padding: 1px 8px; vertical-align: middle; margin-left: 6px; }
    .x { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #111; background: #fff; cursor: pointer; display: grid; place-items: center; }
    .x svg { width: 14px; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; }
    .ship { margin: 14px 0 6px; font-size: 13px; }
    .ship i { display: block; height: 8px; border: 1.5px solid #111; border-radius: 6px; margin-top: 6px; overflow: hidden; }
    .ship b { display: block; height: 100%; background: #ffd23f; transform-origin: left; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    .lines { list-style: none; margin: 0; padding: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; }
    .lines li { display: grid; grid-template-columns: 56px 1fr auto; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #e3e3df; animation: slide .35s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes slide { from { opacity: 0; transform: translateX(16px); } }
    .lines img { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; border: 1.5px solid #111; }
    .lines .name { font-size: 14px; }
    .qty { display: inline-flex; align-items: center; gap: 2px; margin-top: 6px; border: 1.5px solid #111; border-radius: 999px; padding: 2px; }
    .qty button { width: 24px; height: 24px; border-radius: 50%; border: 0; background: none; cursor: pointer; font-size: 15px; }
    @media (hover: hover) { .qty button:hover { background: #ffd23f; } }
    .qty button:active, .x:active { background: #ffd23f; }
    @media (pointer: coarse) {
      .qty button { width: 36px; height: 36px; font-size: 17px; }
      .x { width: 42px; height: 42px; }
      .cart-btn { height: 42px; }
      .add { height: 40px; }
    }
    .qty span { min-width: 18px; text-align: center; font-weight: 700; font-size: 13px; }
    .l-price { font-weight: 700; font-variant-numeric: tabular-nums; }
    .lines .empty { display: block; color: #5b5b55; font-size: 14px; border: 0; padding: 24px 0; }
    .sum { margin: 12px 0; display: grid; gap: 6px; font-size: 14px; }
    .sum div { display: flex; justify-content: space-between; }
    dt { color: #5b5b55; } dd { margin: 0; font-variant-numeric: tabular-nums; }
    .tot { border-top: 1.5px solid #111; padding-top: 8px; font-weight: 800; font-size: 17px; }
    .tot dt { color: #111; }
    .checkout { height: 54px; border-radius: 999px; border: 1.5px solid #111; background: #ffd23f; font: inherit; font-weight: 800; font-size: 15px; cursor: pointer; transition: transform .15s; }
    @media (hover: hover) { .checkout:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 0 #111; } }
    .checkout:active:not(:disabled) { transform: translateY(1px); }
    .checkout:disabled { background: #eee; color: #999; border-color: #ccc; cursor: default; }
    .done { margin-top: 30px; display: grid; gap: 12px; font-size: 14px; color: #5b5b55; }
    .done .big { font-size: 24px; font-weight: 800; color: #111; letter-spacing: -.02em; }
    @container (max-width: 760px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      nav { display: none; }
      .logo { margin-right: auto; }
    }
    @container (max-width: 480px) {
      .grid { grid-template-columns: 1fr; }
      .drawer { padding: 16px 16px 18px; border-left: 0; }
      h3 { font-size: 32px; }
      .tile.span { grid-column: auto; flex-direction: column; }
      .tile.span .media { aspect-ratio: 4 / 3; border-right: 0; border-bottom: 1.5px solid #111; }
    }
  `,
})
export class CartDrawerCatalogue {
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');
  protected readonly items: Item[] = [
    { id: 'aster', name: 'Aster ANC Over-Ear', spec: 'Adaptive ANC · 40h · USB-C', price: 349, img: unsplash(PRODUCT_PHOTOS.headphones, 900, 600), span: true },
    { id: 'oro', name: 'Oro Mini Speaker', spec: 'IP67 · 18h · stereo pair', price: 149, img: unsplash(PRODUCT_PHOTOS.speaker, 600, 450) },
    { id: 'solace', name: 'Solace One', spec: 'Beryllium drivers · 60h', price: 449, img: unsplash(PRODUCT_PHOTOS.headphonesAlt, 600, 450) },
    { id: 'pixel', name: 'Pixelform 9 Pro', spec: '256 GB · Hi-Res DAC', price: 999, img: unsplash(PRODUCT_PHOTOS.phone, 600, 450) },
    { id: 'arden', name: 'Arden Book 14', spec: 'Studio mic array · 18h', price: 1449, img: unsplash(PRODUCT_PHOTOS.laptop, 600, 450) },
    { id: 'kessler', name: 'Kessler K2 Camera', spec: '35mm rangefinder · brass', price: 2690, img: unsplash(PRODUCT_PHOTOS.camera, 600, 450) },
  ];
  protected readonly lines = signal<Line[]>([]);
  protected readonly open = signal(false);
  protected readonly bump = signal(false);
  protected readonly placed = signal(false);
  private readonly usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  private opener: HTMLElement | null = null;
  protected readonly dragX = signal(0);
  private dStartX = 0;
  private dStartY = 0;
  private dTracking = false;
  private bumpTimer?: ReturnType<typeof setTimeout>;

  protected readonly rows = computed(() =>
    this.lines().map((l) => ({ item: this.items.find((i) => i.id === l.id) as Item, qty: l.qty })),
  );
  protected readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  protected readonly subtotal = computed(() => this.rows().reduce((s, r) => s + r.item.price * r.qty, 0));
  protected readonly toFree = computed(() => Math.max(0, 500 - this.subtotal()));
  protected readonly freePct = computed(() => Math.min(1, this.subtotal() / 500));
  protected readonly shipping = computed(() => (this.subtotal() === 0 || this.toFree() === 0 ? 0 : 12));
  protected readonly tax = computed(() => Math.round(this.subtotal() * 8) / 100);
  protected readonly total = computed(() => this.subtotal() + this.shipping() + this.tax());

  constructor() {
    loadGoogleFonts('Schibsted+Grotesk:ital,wght@0,400..900;1,400..900');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.bumpTimer));
    afterRenderEffect(() => {
      if (this.open()) this.closeBtn().nativeElement.focus({ preventScroll: true });
      else if (this.opener) {
        this.opener.focus({ preventScroll: true });
        this.opener = null;
      }
    });
  }

  fmt(n: number): string {
    return this.usd.format(n);
  }

  qtyOf(id: string): number {
    return this.lines().find((l) => l.id === id)?.qty ?? 0;
  }

  add(id: string): void {
    this.placed.set(false);
    this.lines.update((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { id, qty: 1 }]));
    this.bump.set(true);
    clearTimeout(this.bumpTimer);
    this.bumpTimer = setTimeout(() => this.bump.set(false), 450);
    this.openDrawer();
  }

  setQty(id: string, qty: number): void {
    this.lines.update((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l))));
  }

  openDrawer(): void {
    if (this.open()) return;
    this.opener = document.activeElement as HTMLElement | null;
    this.open.set(true);
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
  }

  dDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' || (e.target as Element).closest('button')) return;
    this.dTracking = true;
    this.dStartX = e.clientX;
    this.dStartY = e.clientY;
  }

  dMove(e: PointerEvent): void {
    if (!this.dTracking) return;
    const dx = e.clientX - this.dStartX;
    const dy = e.clientY - this.dStartY;
    if (this.dragX() === 0 && (dx < 10 || Math.abs(dy) > Math.abs(dx))) return;
    if (this.dragX() === 0) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.dragX.set(Math.max(0.01, dx));
  }

  dUp(): void {
    if (!this.dTracking) return;
    this.dTracking = false;
    const far = this.dragX() > 90;
    this.dragX.set(0);
    if (far) this.close();
  }

  dCancel(): void {
    this.dTracking = false;
    this.dragX.set(0);
  }

  checkout(): void {
    this.placed.set(true);
    this.lines.set([]);
  }
}
