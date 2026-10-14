import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Bottle {
  id: string;
  name: string;
  family: string;
  price: string;
  img: string;
  alt: string;
}

@Component({
  selector: 'demo-coverflow-carousel',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="flow"
      [class.dragging]="isDragging()"
      tabindex="0"
      aria-roledescription="carousel"
      aria-label="Atelier collection. Use left and right arrow keys."
      (keydown)="key($event)"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="up()"
      (pointercancel)="cancel()"
    >
      <p class="title">Atelier Collection <span>— autumn 2026</span></p>
      <div class="stage">
        @for (b of items; track b.id; let i = $index) {
          <button
            type="button"
            class="cover"
            [class.on]="i === index()"
            [style.transform]="transformFor(i)"
            [style.opacity]="opacityFor(i)"
            [style.z-index]="100 - abs(i - pos())"
            [attr.tabindex]="-1"
            [attr.aria-hidden]="i !== index()"
            (click)="clickCover(i)"
          >
            <img [src]="b.img" [appImgFallback]="b.id" [alt]="b.alt" draggable="false" />
          </button>
        }
      </div>

      <div class="caption" aria-live="polite">
        <p class="fam">{{ cur().family }}</p>
        <h3>{{ cur().name }}</h3>
        <p class="price">{{ cur().price }}</p>
      </div>

      <div class="controls">
        <button type="button" (click)="go(index() - 1)" [disabled]="index() === 0" aria-label="Previous fragrance">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span class="count">{{ index() + 1 }} — {{ items.length }}</span>
        <button type="button" (click)="go(index() + 1)" [disabled]="index() === items.length - 1" aria-label="Next fragrance">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; }
    .flow {
      position: relative; min-height: 580px; height: 100%; overflow: hidden; outline: none; touch-action: pan-y; user-select: none; -webkit-tap-highlight-color: transparent;
      display: flex; flex-direction: column; align-items: center; padding: 26px 16px 22px;
      background: radial-gradient(80% 60% at 50% 40%, #16393d, #0a1c1f 75%); color: #e6f4f0; font-family: 'Geist', sans-serif;
    }
    .flow:focus-visible { box-shadow: inset 0 0 0 2px #9fd9cc; }
    .title { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; }
    .title span { color: #7fb1a6; font-style: normal; font-family: 'Geist', sans-serif; font-size: 13px; }
    .stage { position: relative; width: 100%; height: 330px; margin-top: 20px; perspective: 1100px; transform-style: preserve-3d; }
    .cover {
      position: absolute; left: 50%; top: 0; width: min(230px, 56cqw); height: 300px; margin-left: calc(min(230px, 56cqw) / -2);
      padding: 0; border: 0; border-radius: 14px; overflow: hidden; cursor: pointer; background: #11292c;
      transition: transform .65s cubic-bezier(.2,.8,.2,1), opacity .5s, box-shadow .5s;
      box-shadow: 0 30px 50px -24px rgba(0,0,0,.8);
    }
    .flow.dragging .cover { transition: none; }
    .cover img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .cover::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,28,31,.0), rgba(10,28,31,.55)); opacity: 1; transition: opacity .5s; }
    .cover.on::after { opacity: 0; }
    .cover.on { box-shadow: 0 40px 70px -30px rgba(0,0,0,.9), 0 0 0 1px rgba(159,217,204,.4); }
    .caption { text-align: center; margin-top: 4px; }
    .fam { font-size: 12.5px; color: #7fb1a6; }
    h3 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: clamp(26px, 4.6cqw, 38px); margin-top: 4px; animation: up .5s cubic-bezier(.2,.8,.2,1); }
    @keyframes up { from { opacity: 0; transform: translateY(8px); } }
    .price { font-size: 14px; margin-top: 4px; color: #c6e6de; }
    .controls { display: flex; align-items: center; gap: 16px; margin-top: auto; padding-top: 14px; }
    .controls button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(159,217,204,.4); background: transparent; color: #e6f4f0; cursor: pointer; display: grid; place-items: center; transition: background .2s, opacity .2s; }
    @media (hover: hover) { .controls button:hover:not(:disabled) { background: rgba(159,217,204,.14); } }
    .controls button:active:not(:disabled) { background: rgba(159,217,204,.22); transform: scale(.94); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @container (max-width: 400px) {
      .flow { min-height: 540px; padding-top: 22px; }
      .stage { height: 290px; margin-top: 16px; }
      .cover { height: 264px; width: min(200px, 58cqw); margin-left: calc(min(200px, 58cqw) / -2); }
    }
    .controls button:disabled { opacity: .25; cursor: default; }
    .controls svg { width: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .count { font-family: 'Geist Mono', monospace; font-size: 12px; color: #9fd9cc; min-width: 60px; text-align: center; }
  `,
})
export class CoverflowCarousel {
  protected readonly items: Bottle[] = [
    { id: 'cf-ambre', name: 'Ambre Sel Extrait', family: 'Amber · Mineral', price: '€168 · 30 ml', img: unsplash(PRODUCT_PHOTOS.perfumeBottle, 460, 600), alt: 'Ambre Sel extrait bottle' },
    { id: 'cf-noir', name: 'Noir Vetiver', family: 'Woody · Aromatic', price: '€145 · 50 ml', img: unsplash(PRODUCT_PHOTOS.perfume, 460, 600), alt: 'Noir Vetiver eau de parfum' },
    { id: 'cf-rose', name: 'Rose Fumée', family: 'Floral · Smoky', price: '€152 · 50 ml', img: unsplash(PRODUCT_PHOTOS.perfumeAlt, 460, 600), alt: 'Rose Fumée eau de parfum' },
    { id: 'cf-serum', name: 'Néroli Face Elixir', family: 'Skin · Treatment', price: '€88 · 30 ml', img: unsplash(PRODUCT_PHOTOS.serum, 460, 600), alt: 'Néroli face elixir dropper bottle' },
    { id: 'cf-cream', name: 'Figue Body Cream', family: 'Skin · Body', price: '€54 · 200 ml', img: unsplash(PRODUCT_PHOTOS.skincare, 460, 600), alt: 'Figue body cream jar' },
  ];
  protected readonly index = signal(1);
  protected readonly drag = signal(0);
  protected readonly pos = computed(() => this.index() - this.drag());
  protected readonly cur = computed(() => this.items[this.index()]);
  private startX = 0;
  protected readonly isDragging = signal(false);
  private moved = false;

  constructor() {
    loadGoogleFonts('Playfair+Display:ital,wght@0,500;1,400');
  }

  abs(n: number): number {
    return Math.round(Math.abs(n) * 10);
  }

  transformFor(i: number): string {
    const o = i - this.pos();
    const a = Math.max(-1, Math.min(1, o));
    const x = o * 46 + a * 22;
    const z = -Math.min(3, Math.abs(o)) * 140;
    const r = -a * 48;
    return `translateX(${x}%) translateZ(${z}px) rotateY(${r}deg)`;
  }

  opacityFor(i: number): number {
    const d = Math.abs(i - this.pos());
    return d > 2.6 ? 0 : 1 - d * 0.18;
  }

  go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.items.length - 1, i)));
  }

  clickCover(i: number): void {
    if (this.moved) return;
    this.go(i);
  }

  key(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.index() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.index() - 1); }
  }

  down(e: PointerEvent): void {
    if (e.button > 0) return;
    this.isDragging.set(true);
    this.moved = false;
    this.startX = e.clientX;
  }

  move(e: PointerEvent): void {
    if (!this.isDragging()) return;
    const dx = e.clientX - this.startX;
    if (!this.moved && Math.abs(dx) > 6) {
      this.moved = true;
      // Keep the drag alive outside the stage; the click that ends it then lands on the stage, not a cover.
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    if (!this.moved) return;
    const max = this.index();
    const min = this.index() - (this.items.length - 1);
    this.drag.set(Math.max(min - 0.3, Math.min(max + 0.3, dx / 220)));
  }

  /** The browser took the gesture (vertical scroll): spring back without changing slide. */
  cancel(): void {
    this.isDragging.set(false);
    this.drag.set(0);
  }

  up(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    const d = this.drag();
    this.drag.set(0);
    if (Math.abs(d) > 0.25) this.go(this.index() - Math.round(d + Math.sign(d) * 0.3));
  }
}
