import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Piece {
  id: string;
  name: string;
  maker: string;
  price: string;
  img: string;
  alt: string;
  filter?: string;
  flip?: boolean;
}

@Component({
  selector: 'demo-peek-carousel',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <h3>The living room edit</h3>
        <p>Seven pieces from small Nordic workshops</p>
      </div>
      <div class="nav">
        <button type="button" (click)="go(index() - 1)" [disabled]="index() === 0" aria-label="Previous products">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" (click)="go(index() + 1)" [disabled]="index() >= max()" aria-label="Next products">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </header>

    <div
      class="viewport"
      tabindex="0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Living room products. Use left and right arrow keys."
      (keydown)="key($event)"
      (pointerdown)="down($event)"
      (pointermove)="drag($event)"
      (pointerup)="up($event)"
      (pointercancel)="dragging = false"
    >
      <ul class="track" [style.--per]="per()" [style.--i]="index()">
        @for (p of pieces; track p.id; let i = $index) {
          <li class="card" [class.in]="i >= index() && i < index() + per()" [attr.aria-hidden]="!(i >= index() && i < index() + per())">
            <div class="media">
              <img [src]="p.img" [appImgFallback]="p.id" [alt]="p.alt" [style.filter]="p.filter || null" [class.flip]="p.flip" draggable="false" />
            </div>
            <div class="meta">
              <div>
                <p class="name">{{ p.name }}</p>
                <p class="maker">{{ p.maker }}</p>
              </div>
              <p class="price">{{ p.price }}</p>
            </div>
          </li>
        }
      </ul>
    </div>

    <div class="dots" role="tablist" aria-label="Choose slide">
      @for (d of dots(); track d) {
        <button type="button" role="tab" [attr.aria-selected]="d === index()" [class.on]="d === index()" (click)="go(d)" [attr.aria-label]="'Show from item ' + (d + 1)"></button>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 22px; min-height: 100%; padding: 30px 0 26px; overflow: hidden;
      background: #e2e4dc; color: #23271e; font-family: 'DM Sans', sans-serif; container-type: inline-size;
      --peek: clamp(28px, 7cqw, 80px); --gap: 18px;
    }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; padding: 0 var(--peek); }
    h3 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(28px, 4.4cqw, 44px); line-height: 1; }
    header p { font-size: 14px; color: #5f6655; margin-top: 6px; }
    .nav { display: flex; gap: 8px; }
    .nav button { width: 48px; height: 48px; border-radius: 50%; border: 0; background: #23271e; color: #e2e4dc; cursor: pointer; display: grid; place-items: center; transition: opacity .2s, transform .2s; }
    @media (hover: hover) { .nav button:hover:not(:disabled) { transform: scale(1.06); } }
    .nav button:active:not(:disabled) { transform: scale(.93); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .nav button:disabled { opacity: .2; cursor: default; }
    .nav svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .viewport { padding: 0 var(--peek); outline: none; touch-action: pan-y; cursor: grab; user-select: none; -webkit-tap-highlight-color: transparent; }
    .viewport:focus-visible .card.in .media { outline: 2px solid #23271e; outline-offset: 3px; }
    .track {
      list-style: none; margin: 0; padding: 0; display: flex; gap: var(--gap);
      transform: translateX(calc(var(--i) * -1 * ((100% - (var(--per) - 1) * var(--gap)) / var(--per) + var(--gap))));
      transition: transform .7s cubic-bezier(.2,.8,.2,1);
    }
    .card { flex: 0 0 calc((100% - (var(--per) - 1) * var(--gap)) / var(--per)); min-width: 0; transition: opacity .5s, transform .7s cubic-bezier(.2,.8,.2,1); opacity: .45; transform: scale(.94); }
    .card.in { opacity: 1; transform: none; }
    .media { aspect-ratio: 4 / 5; border-radius: 160px 160px 8px 8px; overflow: hidden; background: #cfd3c6; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
    .media img.flip { transform: scaleX(-1); }
    @media (hover: hover) {
      .card.in:hover .media img { transform: scale(1.05); }
      .card.in:hover .media img.flip { transform: scaleX(-1) scale(1.05); }
    }
    .meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 14px; }
    .name { font-family: 'DM Serif Display', serif; font-size: 20px; line-height: 1.1; }
    .maker { font-size: 13px; color: #5f6655; margin-top: 3px; }
    .price { font-size: 15px; font-weight: 500; white-space: nowrap; }
    .dots { display: flex; gap: 8px; justify-content: center; }
    .dots button { position: relative; width: 8px; height: 8px; border-radius: 4px; border: 0; padding: 0; background: #b7bcab; cursor: pointer; transition: width .35s cubic-bezier(.2,.8,.2,1), background .3s; }
    .dots button.on { width: 28px; background: #23271e; }
    .dots button::after { content: ''; position: absolute; inset: -16px -4px; }
    @container (max-width: 420px) {
      header { padding: 0 20px; }
      .nav button { width: 42px; height: 42px; }
      h3 { font-size: 27px; }
      header p { font-size: 13px; }
      .dots { gap: 10px; }
    }
  `,
})
export class PeekCarousel {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly pieces: Piece[] = [
    { id: 'linnea', name: 'Linnea Lounge Chair', maker: 'Holm Studio, Aarhus', price: '€1,290', img: unsplash(PRODUCT_PHOTOS.chair, 600, 750), alt: 'Linnea lounge chair' },
    { id: 'ostra', name: 'Ostra 3-Seat Sofa', maker: 'Studio Ostra, Copenhagen', price: '€2,850', img: unsplash(PRODUCT_PHOTOS.sofa, 600, 750), alt: 'Ostra three-seat sofa' },
    { id: 'tove', name: 'Tove Oak Stool', maker: 'Brask Joinery, Oslo', price: '€340', img: unsplash(PRODUCT_PHOTOS.stool, 600, 750), alt: 'Tove oak stool' },
    { id: 'linnea-moss', name: 'Linnea Chair, Moss', maker: 'Holm Studio, Aarhus', price: '€1,290', img: unsplash(PRODUCT_PHOTOS.chair, 600, 750), alt: 'Linnea lounge chair in moss', filter: 'hue-rotate(70deg) saturate(.8)', flip: true },
    { id: 'ostra-2', name: 'Ostra 2-Seat Sofa', maker: 'Studio Ostra, Copenhagen', price: '€2,290', img: unsplash(PRODUCT_PHOTOS.sofa, 600, 750), alt: 'Ostra two-seat sofa', flip: true },
    { id: 'bram', name: 'Bram Side Stool', maker: 'Brask Joinery, Oslo', price: '€290', img: unsplash(PRODUCT_PHOTOS.stool, 600, 750), alt: 'Bram side stool in smoked oak', filter: 'brightness(.8) sepia(.3)', flip: true },
    { id: 'linnea-ink', name: 'Linnea Chair, Ink', maker: 'Holm Studio, Aarhus', price: '€1,340', img: unsplash(PRODUCT_PHOTOS.chair, 600, 750), alt: 'Linnea lounge chair in ink blue', filter: 'hue-rotate(190deg) saturate(.9)' },
  ];
  protected readonly per = signal(3);
  protected readonly index = signal(0);
  protected readonly max = computed(() => Math.max(0, this.pieces.length - this.per()));
  protected readonly dots = computed(() => Array.from({ length: this.max() + 1 }, (_, i) => i));
  private startX = 0;
  private startY = 0;
  protected dragging = false;

  constructor() {
    loadGoogleFonts('DM+Serif+Display', 'DM+Sans:wght@400;500');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(([e]) => {
        const w = e.contentRect.width;
        this.per.set(w < 560 ? 1 : w < 880 ? 2 : 3);
        this.index.update((i) => Math.min(i, this.max()));
      });
      ro.observe(this.host.nativeElement);
      destroy.onDestroy(() => ro.disconnect());
    });
  }

  go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.max(), i)));
  }

  key(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.index() + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.index() - 1); }
    else if (e.key === 'Home') { e.preventDefault(); this.go(0); }
    else if (e.key === 'End') { e.preventDefault(); this.go(this.max()); }
  }

  down(e: PointerEvent): void {
    if (e.button > 0) return;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.dragging = true;
  }

  drag(e: PointerEvent): void {
    // Once the finger is clearly moving sideways, keep its events even if it leaves the viewport.
    const el = e.currentTarget as HTMLElement;
    if (this.dragging && !el.hasPointerCapture(e.pointerId) && Math.abs(e.clientX - this.startX) > 8) el.setPointerCapture(e.pointerId);
  }

  up(e: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) this.go(this.index() + (dx < 0 ? 1 : -1));
  }
}
