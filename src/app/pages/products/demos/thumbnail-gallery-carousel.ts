import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface View {
  id: string;
  label: string;
  img: string;
  alt: string;
  pos: string;
  scale: number;
}

@Component({
  selector: 'demo-thumbnail-gallery-carousel',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pdp">
      <div class="gallery">
        <div class="thumbs" role="tablist" aria-label="Product images" aria-orientation="vertical">
          @for (v of views; track v.id; let i = $index) {
            <button
              type="button"
              role="tab"
              class="thumb"
              [class.on]="i === index()"
              [attr.aria-selected]="i === index()"
              [attr.tabindex]="i === index() ? 0 : -1"
              [attr.aria-label]="v.label"
              (click)="index.set(i)"
              (keydown)="thumbKey($event)"
            >
              <img [src]="v.img" [appImgFallback]="v.id + '-t'" alt="" [style.object-position]="v.pos" [style.transform]="'scale(' + v.scale + ')'" />
            </button>
          }
        </div>

        <div
          class="main"
          tabindex="0"
          aria-roledescription="carousel"
          [attr.aria-label]="'Image ' + (index() + 1) + ' of ' + views.length + ': ' + views[index()].label + '. Arrow keys change image, Z toggles zoom.'"
          [class.zoom]="zoom()"
          (keydown)="mainKey($event)"
          (pointermove)="pan($event)"
          (pointerleave)="leave($event)"
          (pointerdown)="down($event)"
          (pointerup)="release($event)"
          (pointercancel)="tracking = false"
          [style.--ox.%]="ox()"
          [style.--oy.%]="oy()"
        >
          <div class="track" [style.transform]="'translateX(' + index() * -100 + '%)'">
            @for (v of views; track v.id; let i = $index) {
              <div class="frame">
                <img [src]="v.img" [appImgFallback]="v.id" [alt]="v.alt" [style.object-position]="v.pos" [style.--s]="v.scale" draggable="false" />
              </div>
            }
          </div>
          <span class="badge">{{ index() + 1 }} / {{ views.length }} · {{ views[index()].label }}</span>
          <button type="button" class="zbtn" (click)="zoom.set(!zoom())" [attr.aria-pressed]="zoom()" [attr.aria-label]="zoom() ? 'Exit zoom' : 'Zoom image'">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" />@if (!zoom()) {<path d="M11 8.5v5M8.5 11h5" />} @else {<path d="M8.5 11h5" />}</svg>
          </button>
          <button type="button" class="arr l" (click)="step(-1)" aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button type="button" class="arr r" (click)="step(1)" aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>

      <aside class="info">
        <p class="crumbs">Men · Running · Road</p>
        <h3>Kite Runner 2</h3>
        <p class="cw">Cobalt / Ice</p>
        <p class="price">£145 <s>£160</s></p>
        <div class="colours" role="radiogroup" aria-label="Colourway">
          @for (c of colours; track c.name) {
            <button type="button" role="radio" [attr.aria-checked]="c.name === 'Cobalt'" [class.on]="c.name === 'Cobalt'" [style.background]="c.hex" [attr.aria-label]="c.name"></button>
          }
        </div>
        <ul class="feat">
          <li>Supercritical foam midsole, 8mm drop</li>
          <li>Recycled engineered mesh upper</li>
          <li>Weight 238 g (UK 8)</li>
        </ul>
        <button type="button" class="buy">Choose size</button>
      </aside>
    </div>
  `,
  styles: `
    :host { display: block; min-height: 100%; padding: clamp(16px, 3cqw, 32px); background: #ebedf1; font-family: 'Inter Tight', 'Geist', sans-serif; color: #0c1020; container-type: inline-size; }
    .pdp { display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(18px, 3cqw, 40px); align-items: start; }
    .gallery { display: grid; grid-template-columns: 72px 1fr; gap: 12px; min-width: 0; }
    .thumbs { display: flex; flex-direction: column; gap: 10px; }
    .thumb { width: 72px; height: 88px; padding: 0; border: 0; border-radius: 10px; overflow: hidden; cursor: pointer; background: #dfe2e8; opacity: .55; outline-offset: 2px; transition: opacity .2s, box-shadow .2s; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; filter: hue-rotate(205deg) saturate(1.1); }
    @media (hover: hover) { .thumb:hover { opacity: .85; } }
    .thumb:active { opacity: .85; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .thumb.on { opacity: 1; box-shadow: 0 0 0 2px #2448ff; }
    .main { position: relative; aspect-ratio: 4 / 4.6; border-radius: 16px; overflow: hidden; background: #dfe2e8; outline: none; touch-action: pan-y; user-select: none; -webkit-tap-highlight-color: transparent; }
    /* While zoomed, a finger drag pans the close-up instead of scrolling the page. */
    .main.zoom { touch-action: none; }
    .main:focus-visible { box-shadow: 0 0 0 3px #2448ff; }
    .track { display: flex; height: 100%; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    .frame { flex: 0 0 100%; height: 100%; overflow: hidden; }
    .frame img { width: 100%; height: 100%; object-fit: cover; filter: hue-rotate(205deg) saturate(1.1); transform: scale(var(--s)); transform-origin: var(--ox, 50%) var(--oy, 50%); transition: transform .45s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
    .main.zoom .frame img { transform: scale(calc(var(--s) * 2)); transition-duration: .3s; }
    .main.zoom { cursor: zoom-out; } .main:not(.zoom) { cursor: zoom-in; }
    .badge { position: absolute; left: 14px; bottom: 14px; font-size: 12.5px; background: rgba(255,255,255,.85); backdrop-filter: blur(6px); padding: 5px 10px; border-radius: 999px; }
    .zbtn, .arr { position: absolute; width: 40px; height: 40px; border-radius: 50%; border: 0; background: #fff; cursor: pointer; display: grid; place-items: center; box-shadow: 0 6px 16px -8px rgba(12,16,32,.4); transition: transform .2s, opacity .2s; }
    .zbtn { top: 14px; right: 14px; }
    .arr { top: 50%; margin-top: -20px; opacity: 0; }
    .arr.l { left: 14px; } .arr.r { right: 14px; }
    .arr:focus-visible { opacity: 1; }
    @media (hover: hover) {
      .main:hover .arr { opacity: 1; }
      .arr:hover, .zbtn:hover { transform: scale(1.08); }
    }
    @media (hover: none) { .arr { opacity: 1; } .main.zoom .arr { opacity: 0; pointer-events: none; } }
    .arr:active, .zbtn:active { transform: scale(.92); }
    .zbtn svg, .arr svg { width: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .info { display: flex; flex-direction: column; gap: 8px; padding-top: 6px; }
    .crumbs { font-size: 12.5px; color: #626a80; }
    h3 { font-size: clamp(30px, 4.4cqw, 44px); font-weight: 700; letter-spacing: -.04em; line-height: 1; }
    .cw { color: #626a80; font-size: 14px; }
    .price { font-size: 22px; font-weight: 600; margin-top: 4px; }
    .price s { font-size: 15px; color: #8a91a5; font-weight: 400; margin-left: 6px; }
    .colours { display: flex; gap: 8px; margin: 6px 0; }
    .colours button { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #ebedf1; cursor: pointer; box-shadow: 0 0 0 1px #c9cdd7; }
    .colours button.on { box-shadow: 0 0 0 2px #0c1020; }
    .colours button { position: relative; }
    .colours button::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; }
    .colours { gap: 12px; }
    .feat { margin: 6px 0 10px; padding-left: 18px; font-size: 14px; color: #3a4156; display: grid; gap: 4px; }
    .buy { height: 52px; border: 0; border-radius: 999px; background: #2448ff; color: #fff; font: inherit; font-weight: 600; font-size: 15px; cursor: pointer; transition: background .2s; }
    @media (hover: hover) { .buy:hover { background: #1533d6; } }
    .buy:active { background: #1533d6; transform: scale(.98); }
    @container (max-width: 700px) {
      .pdp { grid-template-columns: 1fr; }
      .gallery { grid-template-columns: 1fr; }
      .thumbs { flex-direction: row; order: 2; overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none; padding: 2px; }
      .thumbs::-webkit-scrollbar { display: none; }
      .thumb { flex: none; width: 60px; height: 70px; }
      .arr { opacity: 1; }
    }
  `,
})
export class ThumbnailGalleryCarousel {
  protected readonly views: View[] = [
    { id: 'kr-side', label: 'Side profile', img: unsplash(PRODUCT_PHOTOS.sneakerRed, 900, 1040), alt: 'Kite Runner 2 in cobalt, side profile', pos: '50% 50%', scale: 1 },
    { id: 'kr-detail', label: 'Lacing detail', img: unsplash(PRODUCT_PHOTOS.sneakerRed, 900, 1040), alt: 'Close-up of the Kite Runner 2 lacing and mesh', pos: '40% 35%', scale: 1.9 },
    { id: 'kr-pair', label: 'Pair', img: unsplash(PRODUCT_PHOTOS.sneakerPair, 900, 1040), alt: 'A pair of Kite Runner 2 sneakers', pos: '50% 50%', scale: 1 },
    { id: 'kr-sole', label: 'Outsole', img: unsplash(PRODUCT_PHOTOS.sneakerRed, 900, 1040), alt: 'Kite Runner 2 outsole and foam detail', pos: '60% 75%', scale: 1.6 },
    { id: 'kr-life', label: 'On the road', img: unsplash(PRODUCT_PHOTOS.shoes, 900, 1040), alt: 'Kite Runner 2 styled on a city street', pos: '50% 50%', scale: 1 },
  ];
  protected readonly colours = [
    { name: 'Cobalt', hex: '#2448ff' },
    { name: 'Signal Red', hex: '#e8412f' },
    { name: 'Moss', hex: '#5f7a3a' },
  ];
  protected readonly index = signal(0);
  protected readonly zoom = signal(false);
  protected readonly ox = signal(50);
  protected readonly oy = signal(50);
  protected startX = 0;
  private startY = 0;
  private startOx = 50;
  private startOy = 50;
  protected tracking = false;

  constructor() {
    loadGoogleFonts('Inter+Tight:wght@400;600;700');
  }

  step(d: number): void {
    const n = this.views.length;
    this.zoom.set(false);
    this.index.set((this.index() + d + n) % n);
  }

  down(e: PointerEvent): void {
    if (e.button > 0) return;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startOx = this.ox();
    this.startOy = this.oy();
    this.tracking = true;
    if (this.zoom() && e.pointerType !== 'mouse' && !(e.target as Element).closest('button')) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  pan(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.pointerType === 'mouse') {
      this.ox.set(((e.clientX - r.left) / r.width) * 100);
      this.oy.set(((e.clientY - r.top) / r.height) * 100);
      return;
    }
    // Touch: drag the zoomed image around (finger moves the photo, so the origin moves the other way).
    if (!this.tracking || !this.zoom()) return;
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    this.ox.set(clamp(this.startOx - ((e.clientX - this.startX) / r.width) * 150));
    this.oy.set(clamp(this.startOy - ((e.clientY - this.startY) / r.height) * 150));
  }

  leave(e: PointerEvent): void {
    // Touch pointers "leave" on every lift, so only a mouse leaving ends the zoom.
    if (e.pointerType === 'mouse') this.zoom.set(false);
  }

  release(e: PointerEvent): void {
    if (!this.tracking) return;
    this.tracking = false;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    if ((e.target as HTMLElement).closest('button')) return;
    const tap = Math.abs(dx) < 8 && Math.abs(dy) < 8;
    if (!this.zoom() && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      this.step(dx < 0 ? 1 : -1);
    } else if (tap) {
      if (!this.zoom() && e.pointerType !== 'mouse') {
        // Tap-to-zoom on touch: magnify around the tapped point.
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        this.ox.set(((e.clientX - r.left) / r.width) * 100);
        this.oy.set(((e.clientY - r.top) / r.height) * 100);
      }
      this.zoom.set(!this.zoom());
    }
  }

  mainKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.step(-1); }
    else if (e.key.toLowerCase() === 'z') this.zoom.set(!this.zoom());
  }

  thumbKey(e: KeyboardEvent): void {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    this.step(d);
    const list = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('button');
    list?.[this.index()]?.focus();
  }
}
