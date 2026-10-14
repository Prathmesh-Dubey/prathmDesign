import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, signal, viewChild } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Finish {
  name: string;
  hex: string;
  filter: string;
}

interface Product {
  id: string;
  name: string;
  kind: string;
  price: number;
  img: string;
  alt: string;
  desc: string;
  finishes: Finish[];
  options: string[];
  optionLabel: string;
}

const tort: Finish = { name: 'Tortoise', hex: '#7a4a24', filter: 'none' };
const onyx: Finish = { name: 'Onyx', hex: '#1b1b1b', filter: 'grayscale(1) brightness(.8)' };
const sage: Finish = { name: 'Sage', hex: '#7d8f6f', filter: 'hue-rotate(60deg) saturate(.7)' };
const steel: Finish = { name: 'Steel', hex: '#b9bcc0', filter: 'none' };
const gold: Finish = { name: 'Gold', hex: '#c9a45c', filter: 'sepia(.6) saturate(1.3)' };
const navy: Finish = { name: 'Navy', hex: '#26375c', filter: 'hue-rotate(190deg) saturate(.8)' };

@Component({
  selector: 'demo-quickview-modal-catalogue',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'hostKey($event)' },
  template: `
    <div class="page" [attr.inert]="openId() ? '' : null">
      <header>
        <span class="logo">Lune <em>Optical &amp; Time</em></span>
        <span class="bag" aria-live="polite">Bag ({{ bagCount() }})</span>
      </header>
      <div class="scroll">
        <ul class="grid">
          @for (p of products; track p.id; let i = $index) {
            <li class="card">
              <div class="media">
                <img [src]="p.img" [appImgFallback]="p.id" [alt]="p.alt" loading="lazy" />
                <button type="button" class="qv" (click)="openQuick(p.id, $event)">Quick view<span class="visually-hidden">: {{ p.name }}</span></button>
              </div>
              <p class="kind">{{ p.kind }}</p>
              <p class="name">{{ p.name }}</p>
              <p class="price">{{ fmt(p.price) }}</p>
            </li>
          }
        </ul>
      </div>
    </div>

    @if (current(); as p) {
      <div class="scrim" (click)="close()" aria-hidden="true"></div>
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="p.name + ' quick view'" #modal>
        <div class="m-media" (pointerdown)="sDown($event)" (pointerup)="sUp($event)" (pointercancel)="sTracking = false">
          <img [src]="p.img" [appImgFallback]="p.id + '-qv'" [alt]="p.alt" [style.filter]="finish().filter" />
          <div class="m-nav">
            <button type="button" (click)="cycle(-1)" aria-label="Previous product"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
            <span>{{ pos() + 1 }} / {{ products.length }}</span>
            <button type="button" (click)="cycle(1)" aria-label="Next product"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div class="m-body">
          <button type="button" class="x" (click)="close()" aria-label="Close quick view" #closeBtn>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
          <p class="kind">{{ p.kind }}</p>
          <h4>{{ p.name }}</h4>
          <p class="m-price">{{ fmt(p.price * qty()) }}@if (qty() > 1) { <small>({{ qty() }} × {{ fmt(p.price) }})</small> }</p>
          <p class="desc">{{ p.desc }}</p>

          <p class="lbl">Finish — <strong>{{ finish().name }}</strong></p>
          <div class="finishes" role="radiogroup" aria-label="Finish">
            @for (f of p.finishes; track f.name; let fi = $index) {
              <button type="button" role="radio" [attr.aria-checked]="fi === finishIdx()" [class.on]="fi === finishIdx()" [style.--c]="f.hex" (click)="finishIdx.set(fi)" [attr.aria-label]="f.name"></button>
            }
          </div>

          <p class="lbl">{{ p.optionLabel }}</p>
          <div class="opts" role="radiogroup" [attr.aria-label]="p.optionLabel">
            @for (o of p.options; track o; let oi = $index) {
              <button type="button" role="radio" [attr.aria-checked]="oi === optIdx()" [class.on]="oi === optIdx()" (click)="optIdx.set(oi)">{{ o }}</button>
            }
          </div>

          <div class="buy">
            <div class="qty" role="group" aria-label="Quantity">
              <button type="button" (click)="qty.set(qty() > 1 ? qty() - 1 : 1)" aria-label="Decrease">−</button>
              <span>{{ qty() }}</span>
              <button type="button" (click)="qty.set(qty() < 5 ? qty() + 1 : 5)" aria-label="Increase">+</button>
            </div>
            <button type="button" class="add" [class.done]="justAdded()" (click)="add()">
              {{ justAdded() ? 'Added to bag' : 'Add to bag' }}
            </button>
          </div>
          <p class="fine">Free UK delivery · Prescription lenses fitted in 5 days</p>
        </div>
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; height: 700px; overflow: hidden; container-type: inline-size; background: #dedbd3; color: #161512; font-family: 'Geist', sans-serif; }
    .page { display: flex; flex-direction: column; height: 100%; }
    header { display: flex; justify-content: space-between; align-items: baseline; padding: 18px clamp(16px, 3cqw, 32px); border-bottom: 1px solid #c6c2b8; }
    .logo { font-family: 'Marcellus', serif; font-size: 22px; }
    .logo em { font-style: normal; font-size: 14px; color: #6c685e; margin-left: 4px; }
    .bag { font-size: 14px; }
    .scroll { flex: 1; overflow-y: auto; padding: 22px clamp(16px, 3cqw, 32px) 30px; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 26px 18px; }
    .media { position: relative; aspect-ratio: 1; overflow: hidden; background: #ece9e2; border-radius: 2px; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.05); } }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .qv { position: absolute; left: 50%; bottom: 12px; transform: translate(-50%, 12px); opacity: 0; height: 38px; padding: 0 18px; border: 0; border-radius: 999px; background: #161512; color: #f3f1ec; cursor: pointer; font: inherit; font-size: 13px; white-space: nowrap; transition: opacity .25s, transform .35s cubic-bezier(.2,.8,.2,1); }
    .qv:focus-visible { opacity: 1; transform: translate(-50%, 0); }
    @media (hover: hover) { .card:hover .qv { opacity: 1; transform: translate(-50%, 0); } }
    .qv:active { background: #2e2c27; }
    @media (hover: none) { .qv { opacity: 1; transform: translate(-50%, 0); } }
    .kind { font-size: 12px; color: #6c685e; margin-top: 10px; }
    .name { font-family: 'Marcellus', serif; font-size: 17px; margin-top: 2px; }
    .price { font-size: 14px; margin-top: 2px; }
    .scrim { position: absolute; inset: 0; z-index: 5; background: rgba(22,21,18,.5); backdrop-filter: blur(3px); animation: fade .25s ease-out; }
    @keyframes fade { from { opacity: 0; } }
    .modal {
      position: absolute; z-index: 6; left: 50%; top: 50%; width: min(820px, calc(100% - 24px)); max-height: calc(100% - 24px); overflow: auto;
      transform: translate(-50%, -50%); display: grid; grid-template-columns: 1fr 1fr; background: #f6f4ef; border-radius: 6px; overscroll-behavior: contain;
      box-shadow: 0 40px 80px -30px rgba(0,0,0,.6); animation: pop .35s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%) scale(.97); } }
    .m-media { position: relative; background: #ece9e2; min-height: 320px; touch-action: pan-y; }
    .m-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: filter .5s ease; }
    .m-nav { position: absolute; left: 12px; bottom: 12px; display: flex; align-items: center; gap: 8px; background: rgba(246,244,239,.9); border-radius: 999px; padding: 4px; font-size: 12px; }
    .m-nav button { width: 30px; height: 30px; border-radius: 50%; border: 0; background: #fff; cursor: pointer; display: grid; place-items: center; }
    .m-nav button:active, .x:active { transform: scale(.92); }
    .m-nav svg { width: 15px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .m-body { position: relative; padding: 26px 24px 22px; display: flex; flex-direction: column; gap: 6px; }
    .x { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #c6c2b8; background: transparent; cursor: pointer; display: grid; place-items: center; }
    .x svg { width: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    h4 { font-family: 'Marcellus', serif; font-weight: 400; font-size: 28px; line-height: 1.1; padding-right: 40px; }
    .m-price { font-size: 17px; font-variant-numeric: tabular-nums; }
    .m-price small { color: #6c685e; font-size: 13px; margin-left: 6px; }
    .desc { font-size: 13.5px; line-height: 1.55; color: #4b483f; margin: 4px 0 6px; }
    .lbl { font-size: 12.5px; color: #6c685e; margin-top: 6px; }
    .lbl strong { color: #161512; font-weight: 500; }
    .finishes { display: flex; gap: 10px; }
    .finishes button { width: 28px; height: 28px; border-radius: 50%; border: 0; cursor: pointer; background: var(--c); box-shadow: 0 0 0 2px #f6f4ef, 0 0 0 3px transparent; transition: box-shadow .2s; }
    .finishes button.on { box-shadow: 0 0 0 2px #f6f4ef, 0 0 0 3.5px #161512; }
    .finishes button { position: relative; }
    .finishes button::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; }
    .opts { display: flex; flex-wrap: wrap; gap: 6px; }
    .opts button { height: 34px; padding: 0 12px; border: 1px solid #c6c2b8; border-radius: 3px; background: transparent; cursor: pointer; font: inherit; font-size: 13px; transition: .2s; }
    .opts button.on { background: #161512; color: #f6f4ef; border-color: #161512; }
    .buy { display: flex; gap: 10px; margin-top: 14px; }
    .qty { display: flex; align-items: center; border: 1px solid #c6c2b8; border-radius: 3px; }
    .qty button { width: 36px; height: 46px; border: 0; background: none; cursor: pointer; font-size: 16px; }
    .qty span { min-width: 20px; text-align: center; font-variant-numeric: tabular-nums; }
    .add { flex: 1; height: 48px; border: 0; border-radius: 3px; background: #234d3a; color: #f3f1ec; cursor: pointer; font: inherit; font-size: 14.5px; transition: background .25s; }
    @media (hover: hover) { .add:hover { background: #1a3a2c; } }
    .add:active { background: #1a3a2c; }
    .opts button:active, .qty button:active { background: #e9e5dc; }
    @media (pointer: coarse) {
      .m-nav button { width: 40px; height: 40px; }
      .opts button { height: 40px; padding: 0 14px; }
      .x { width: 42px; height: 42px; }
      .qv { height: 42px; }
    }
    .add.done { background: #161512; }
    .fine { font-size: 12px; color: #6c685e; margin-top: 6px; }
    @container (max-width: 640px) {
      .modal { grid-template-columns: 1fr; }
      .m-media { min-height: 220px; }
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 12px; }
    }
    /* Phone: the quick view becomes a bottom sheet; swipe the photo to flip between products. */
    @container (max-width: 480px) {
      .modal {
        left: 0; right: 0; top: auto; bottom: 0; width: auto; max-height: 92%; transform: none;
        border-radius: 18px 18px 0 0; animation: sheet .38s cubic-bezier(.2,.8,.2,1);
      }
      @keyframes sheet { from { transform: translateY(40%); opacity: 0; } }
      .m-media { min-height: 230px; }
      .m-body { position: static; padding: 18px 18px 20px; }
      .x { top: 12px; right: 12px; background: rgba(246,244,239,.92); border-color: transparent; z-index: 1; }
      h4 { font-size: 24px; padding-right: 0; }
      .buy { position: sticky; bottom: 0; z-index: 1; background: #f6f4ef; padding: 10px 0; box-shadow: 0 -12px 12px -8px #f6f4ef; }
      header { padding: 16px; }
      .logo em { display: none; }
      .name { font-size: 16px; }
    }
  `,
})
export class QuickviewModalCatalogue {
  private readonly modal = viewChild<ElementRef<HTMLElement>>('modal');
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  protected readonly products: Product[] = [
    { id: 'q1', name: 'Côte 02 Acetate', kind: 'Sunglasses', price: 285, img: unsplash(PRODUCT_PHOTOS.sunglasses, 700, 700), alt: 'Côte 02 acetate sunglasses', desc: 'A soft-square frame cut from Mazzucchelli acetate with seven-barrel hinges and Zeiss mineral lenses.', finishes: [tort, onyx, sage], options: ['Grey', 'Green G-15', 'Brown gradient'], optionLabel: 'Lens' },
    { id: 'q2', name: 'Aster 38 Automatic', kind: 'Watch', price: 1640, img: unsplash(PRODUCT_PHOTOS.watchClassic, 700, 700), alt: 'Aster 38 automatic watch', desc: 'Slim 9mm case, domed sapphire and a Miyota 9039 movement on a Barenia calf strap.', finishes: [steel, gold], options: ['Calf 18mm', 'Mesh 18mm', 'Suede 18mm'], optionLabel: 'Strap' },
    { id: 'q3', name: 'Halden Field 41', kind: 'Watch', price: 1190, img: unsplash(PRODUCT_PHOTOS.watchWhite, 700, 700), alt: 'Halden Field watch with white dial', desc: 'A legible field dial with lumed numerals, 100m water resistance and a quick-release strap.', finishes: [steel, navy], options: ['Canvas', 'Steel bracelet'], optionLabel: 'Strap' },
    { id: 'q4', name: 'Côte 04 Titanium', kind: 'Sunglasses', price: 340, img: unsplash(PRODUCT_PHOTOS.sunglasses, 700, 700), alt: 'Côte 04 titanium sunglasses', desc: 'Beta-titanium frame at 14 grams, adjustable nose pads and polarised lenses.', finishes: [onyx, gold, navy], options: ['Polarised grey', 'Rose', 'Clear blue-light'], optionLabel: 'Lens' },
    { id: 'q5', name: 'Marlow Diver 39', kind: 'Watch', price: 2240, img: unsplash(PRODUCT_PHOTOS.watchDark, 700, 700), alt: 'Marlow Diver watch in black', desc: '300m titanium diver with a 120-click ceramic bezel and a screw-down crown.', finishes: [onyx, steel], options: ['Rubber', 'Titanium bracelet'], optionLabel: 'Strap' },
    { id: 'q6', name: 'Kessler K2 Rangefinder', kind: 'Camera', price: 2180, img: unsplash(PRODUCT_PHOTOS.camera, 700, 700), alt: 'Kessler K2 film camera', desc: 'A mechanical 35mm rangefinder with a brass top plate that brasses beautifully with use.', finishes: [steel, onyx], options: ['Body only', 'With 35mm f/2'], optionLabel: 'Kit' },
  ];
  protected readonly openId = signal<string | null>(null);
  protected readonly pos = computed(() => this.products.findIndex((p) => p.id === this.openId()));
  protected readonly current = computed(() => this.products.find((p) => p.id === this.openId()) ?? null);
  protected readonly finishIdx = signal(0);
  protected readonly optIdx = signal(0);
  protected readonly qty = signal(1);
  protected readonly bagCount = signal(0);
  protected readonly justAdded = signal(false);
  protected readonly finish = computed(() => this.current()?.finishes[this.finishIdx()] ?? tort);
  private readonly gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  private opener: HTMLElement | null = null;
  private wasOpen = false;
  private sX = 0;
  private sY = 0;
  protected sTracking = false;

  constructor() {
    loadGoogleFonts('Marcellus');
    afterRenderEffect(() => {
      const open = !!this.openId();
      if (open && !this.wasOpen) this.closeBtn()?.nativeElement.focus({ preventScroll: true });
      if (!open && this.wasOpen) {
        this.opener?.focus({ preventScroll: true });
        this.opener = null;
      }
      this.wasOpen = open;
    });
  }

  fmt(n: number): string {
    return this.gbp.format(n);
  }

  openQuick(id: string, e: Event): void {
    this.opener = e.currentTarget as HTMLElement;
    this.select(id);
  }

  private select(id: string): void {
    this.openId.set(id);
    this.finishIdx.set(0);
    this.optIdx.set(0);
    this.qty.set(1);
    this.justAdded.set(false);
  }

  cycle(d: number): void {
    const n = this.products.length;
    this.select(this.products[(this.pos() + d + n) % n].id);
  }

  sDown(e: PointerEvent): void {
    if (e.button > 0 || (e.target as Element).closest('button')) return;
    this.sX = e.clientX;
    this.sY = e.clientY;
    this.sTracking = true;
  }

  sUp(e: PointerEvent): void {
    if (!this.sTracking) return;
    this.sTracking = false;
    const dx = e.clientX - this.sX;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - this.sY)) this.cycle(dx < 0 ? 1 : -1);
  }

  close(): void {
    this.openId.set(null);
  }

  add(): void {
    this.bagCount.update((c) => c + this.qty());
    this.justAdded.set(true);
  }

  hostKey(e: KeyboardEvent): void {
    if (!this.openId()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key !== 'Tab') return;
    const root = this.modal()?.nativeElement;
    if (!root) return;
    const focusables = Array.from(root.querySelectorAll<HTMLElement>('button'));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
