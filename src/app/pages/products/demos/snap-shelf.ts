import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Shoe {
  id: string;
  name: string;
  colour: string;
  price: number;
  img: string;
  tag?: string;
  hue: number;
}

@Component({
  selector: 'demo-snap-shelf',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <p class="eyebrow">Drop 14 · Spring runners</p>
        <h3>Fresh off the shelf</h3>
      </div>
      <div class="arrows">
        <button type="button" (click)="scrollBy(-1)" [disabled]="!canPrev()" aria-label="Scroll shelf left">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" (click)="scrollBy(1)" [disabled]="!canNext()" aria-label="Scroll shelf right">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </header>

    <ul class="shelf" #shelf (scroll)="sync()" tabindex="0" aria-label="Spring runners, scroll horizontally">
      @for (s of shoes; track s.id) {
        <li class="item">
          <div class="media">
            <img [src]="s.img" [appImgFallback]="s.id" [alt]="s.name + ' in ' + s.colour" [style.filter]="'hue-rotate(' + s.hue + 'deg)'" loading="lazy" />
            @if (s.tag) { <span class="tag">{{ s.tag }}</span> }
            <button type="button" class="add" [class.on]="bag().includes(s.id)" (click)="toggle(s.id)"
              [attr.aria-label]="(bag().includes(s.id) ? 'Remove ' : 'Add ') + s.name + ' to bag'" [attr.aria-pressed]="bag().includes(s.id)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                @if (bag().includes(s.id)) { <path d="M5 12.5l4.5 4.5L19 7.5" /> } @else { <path d="M12 5v14M5 12h14" /> }
              </svg>
            </button>
          </div>
          <div class="meta">
            <p class="name">{{ s.name }}</p>
            <p class="price">\${{ s.price }}</p>
          </div>
          <p class="colour">{{ s.colour }}</p>
        </li>
      }
    </ul>

    <footer>
      <div class="track" aria-hidden="true"><b [style.left.%]="progress() * (100 - thumb())" [style.width.%]="thumb()"></b></div>
      <p class="bag" aria-live="polite">{{ bag().length }} in bag</p>
    </footer>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 20px; min-height: 100%; padding: 28px 0 26px;
      background: #d4d5cf; color: #111; font-family: 'Syne', sans-serif; overflow: hidden; container-type: inline-size;
    }
    header, footer { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; padding: 0 clamp(16px, 4vw, 36px); }
    .eyebrow { font-family: 'Geist Mono', monospace; font-size: 12px; color: #ff5a1f; }
    h3 { font-size: clamp(26px, 4vw, 40px); font-weight: 800; letter-spacing: -.03em; line-height: 1; margin-top: 4px; }
    .arrows { display: flex; gap: 8px; }
    .arrows button { width: 46px; height: 46px; border-radius: 50%; border: 1.5px solid #111; background: transparent; cursor: pointer; display: grid; place-items: center; transition: background .2s, color .2s, opacity .2s; }
    @media (hover: hover) { .arrows button:hover:not(:disabled) { background: #111; color: #d4d5cf; } }
    .arrows button:active:not(:disabled) { background: #111; color: #d4d5cf; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .arrows button:disabled { opacity: .25; cursor: default; }
    .arrows svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .shelf {
      list-style: none; margin: 0; display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory;
      padding: 4px clamp(16px, 4vw, 36px) 8px; scroll-padding: 0 clamp(16px, 4vw, 36px); scrollbar-width: none; scroll-behavior: smooth; outline: none;
      overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch;
    }
    .shelf::-webkit-scrollbar { display: none; }
    .shelf:focus-visible { box-shadow: inset 0 0 0 2px #ff5a1f; }
    .item { flex: 0 0 clamp(190px, 27cqw, 250px); scroll-snap-align: start; }
    .media { position: relative; aspect-ratio: 4 / 5; border-radius: 6px; overflow: hidden; background: #e7e8e3; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .item:hover img { transform: scale(1.06); } }
    .tag { position: absolute; top: 10px; left: 10px; background: #ff5a1f; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 3px; }
    .add { position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px; border-radius: 50%; border: 0; background: #fff; cursor: pointer; display: grid; place-items: center; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s; }
    @media (hover: hover) { .add:hover { transform: scale(1.1); } }
    .add:active { transform: scale(.9); }
    .add.on { background: #ff5a1f; color: #fff; }
    .add svg { width: 18px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 10px; }
    .name { font-weight: 700; font-size: 15px; }
    .price { font-family: 'Geist Mono', monospace; font-size: 14px; }
    .colour { font-size: 13px; color: #555; font-family: 'Geist', sans-serif; }
    footer { align-items: center; }
    .track { position: relative; flex: 1; max-width: 320px; height: 3px; background: rgba(0,0,0,.15); border-radius: 2px; }
    .track b { position: absolute; top: 0; height: 100%; background: #111; border-radius: 2px; transition: left .15s linear; }
    .bag { font-family: 'Geist Mono', monospace; font-size: 12px; white-space: nowrap; }
    @container (max-width: 420px) {
      .item { flex-basis: 72cqw; }
      .arrows button { width: 42px; height: 42px; }
      h3 { font-size: 26px; }
    }
  `,
})
export class SnapShelf {
  private readonly shelf = viewChild.required<ElementRef<HTMLElement>>('shelf');
  protected readonly shoes: Shoe[] = [
    { id: 'kite-red', name: 'Kite Runner 2', colour: 'Signal Red', price: 160, img: unsplash(PRODUCT_PHOTOS.sneakerRed, 500, 625), tag: 'New', hue: 0 },
    { id: 'arc-white', name: 'Arc Trainer Low', colour: 'Chalk', price: 140, img: unsplash(PRODUCT_PHOTOS.sneakerWhite, 500, 625), hue: 0 },
    { id: 'tempo-pair', name: 'Tempo 9', colour: 'Bone / Gum', price: 175, img: unsplash(PRODUCT_PHOTOS.sneakerPair, 500, 625), hue: 0 },
    { id: 'drift', name: 'Drift Knit', colour: 'Dusk', price: 130, img: unsplash(PRODUCT_PHOTOS.shoes, 500, 625), tag: 'Low stock', hue: 0 },
    { id: 'kite-blue', name: 'Kite Runner 2', colour: 'Cobalt', price: 160, img: unsplash(PRODUCT_PHOTOS.sneakerRed, 500, 625), hue: 200 },
    { id: 'arc-sage', name: 'Arc Trainer Low', colour: 'Sage', price: 140, img: unsplash(PRODUCT_PHOTOS.sneakerWhite, 500, 625), hue: 70 },
    { id: 'tempo-plum', name: 'Tempo 9', colour: 'Plum', price: 175, img: unsplash(PRODUCT_PHOTOS.sneakerPair, 500, 625), hue: 260 },
    { id: 'drift-olive', name: 'Drift Knit', colour: 'Olive', price: 130, img: unsplash(PRODUCT_PHOTOS.shoes, 500, 625), hue: 60 },
  ];
  protected readonly canPrev = signal(false);
  protected readonly canNext = signal(true);
  protected readonly progress = signal(0);
  protected readonly thumb = signal(30);
  protected readonly bag = signal<string[]>([]);

  constructor() {
    loadGoogleFonts('Syne:wght@600;700;800');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      this.sync();
      const ro = new ResizeObserver(() => this.sync());
      ro.observe(this.shelf().nativeElement);
      destroy.onDestroy(() => ro.disconnect());
    });
  }

  sync(): void {
    const el = this.shelf().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.canPrev.set(el.scrollLeft > 4);
    this.canNext.set(el.scrollLeft < max - 4);
    this.progress.set(max > 0 ? el.scrollLeft / max : 0);
    this.thumb.set(Math.max(12, Math.min(100, (el.clientWidth / el.scrollWidth) * 100)));
  }

  scrollBy(dir: number): void {
    const el = this.shelf().nativeElement;
    const item = el.querySelector<HTMLElement>('.item');
    const step = item ? item.offsetWidth + 14 : 260;
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  toggle(id: string): void {
    this.bag.update((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  }
}
