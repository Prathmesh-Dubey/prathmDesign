import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Trip {
  id: string;
  place: string;
  region: string;
  nights: number;
  price: number;
  img: string;
  tag: string;
}

const AUTOPLAY_MS = 5200;

@Component({
  selector: 'demo-snap-carousel-travel',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'hovering.set(true)',
    '(mouseleave)': 'hovering.set(false)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'focused.set(false)',
    '(pointerdown)': 'touchStart($event)',
    '(pointerup)': 'touchEnd($event)',
    '(pointercancel)': 'touchEnd($event)',
  },
  template: `
    <header class="top">
      <div>
        <p class="kicker">Small-group departures · Oct–Mar</p>
        <h3>Slow trips, planned by people who have walked them</h3>
      </div>
      <div class="arrows">
        <button type="button" class="arrow" (click)="step(-1)" aria-label="Previous trips">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="arrow" (click)="step(1)" aria-label="Next trips">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </header>

    <div
      class="track"
      #track
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured trips"
      tabindex="0"
      (scroll)="onScroll()"
      (keydown.arrowright)="step(1); $event.preventDefault()"
      (keydown.arrowleft)="step(-1); $event.preventDefault()"
    >
      @for (t of trips; track t.id; let i = $index) {
        <article class="card" [attr.aria-label]="i + 1 + ' of ' + trips.length + ': ' + t.place">
          <div class="media">
            <img [src]="t.img" [appImgFallback]="t.id" [alt]="'Photo: ' + t.place + ', ' + t.region" loading="lazy" />
            <span class="tag">{{ t.tag }}</span>
          </div>
          <div class="meta">
            <div>
              <h4>{{ t.place }}</h4>
              <p>{{ t.region }} · {{ t.nights }} nights</p>
            </div>
            <p class="price"><small>from</small> €{{ t.price.toLocaleString('en-GB') }}</p>
          </div>
        </article>
      }
    </div>

    <footer class="foot">
      <div class="dots" role="group" aria-label="Choose slide">
        @for (p of pageList(); track p) {
          <button
            type="button"
            class="dot"
            [class.on]="p === page()"
            [attr.aria-current]="p === page() ? 'true' : null"
            [attr.aria-label]="'Go to slide ' + (p + 1)"
            (click)="goPage(p)"
          >
            <span class="pip"><span class="fill" [style.transform]="p === page() ? 'scaleX(' + progress() + ')' : 'scaleX(0)'"></span></span>
          </button>
        }
      </div>
      <span class="state" aria-live="polite">{{ paused() ? 'Paused' : 'Autoplay' }}</span>
    </footer>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 22px;
      min-height: 100%; padding: clamp(22px, 4cqi, 40px) 0;
      background: #e8eef0; color: #10242b;
      font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size;
      --pad: clamp(18px, 4cqi, 40px);
    }
    .top { display: flex; justify-content: space-between; align-items: end; gap: 16px; padding: 0 var(--pad); }
    .kicker { font-size: 13px; color: #4a6a70; margin-bottom: 6px; }
    h3 { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(22px, 3.4cqi, 34px); line-height: 1.08; letter-spacing: -0.02em; max-width: 20ch; font-variation-settings: 'SOFT' 100; }
    .arrows { display: flex; gap: 8px; flex-shrink: 0; }
    .arrow {
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; color: #10242b;
      width: 44px; height: 44px; border-radius: 50%; border: 1px solid #b8c9cc; background: #f6f9f9;
      display: grid; place-items: center; cursor: pointer; transition: background .2s, color .2s, border-color .2s, transform .2s;
    }
    .arrow:hover { background: #0f5e50; color: #fff; border-color: #0f5e50; }
    .arrow:active { transform: scale(.94); }
    .arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

    .track {
      display: grid; grid-auto-flow: column; grid-auto-columns: clamp(232px, 31cqi, 340px);
      gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
      padding: 4px var(--pad) 8px; scroll-padding-inline: var(--pad); scrollbar-width: none; outline-offset: -2px;
      overscroll-behavior-x: contain;
    }
    .track::-webkit-scrollbar { display: none; }
    .card { scroll-snap-align: start; display: flex; flex-direction: column; gap: 12px; }
    .media { position: relative; aspect-ratio: 4 / 4.6; border-radius: 18px; overflow: hidden; background: #c9d6d8; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
    @media (hover: hover) { .card:hover img { transform: scale(1.05); } }
    .tag { position: absolute; left: 12px; top: 12px; background: rgba(246,249,249,.92); backdrop-filter: blur(6px); padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .meta { display: flex; justify-content: space-between; align-items: start; gap: 10px; padding: 0 2px; }
    h4 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; }
    .meta p { font-size: 13.5px; color: #4a6a70; margin-top: 3px; }
    .meta .price { color: #10242b; font-weight: 600; font-size: 15px; white-space: nowrap; margin-top: 2px; }
    .price small { font-weight: 400; color: #4a6a70; font-size: 12px; }

    .foot { display: flex; align-items: center; justify-content: space-between; padding: 0 var(--pad); gap: 12px; margin-top: auto; }
    .dots { display: flex; gap: 0; margin-left: -3px; }
    /* The button is the (40px tall) hit area; the visible pill is .pip inside it. */
    .dot { display: grid; place-items: center; height: 40px; border: 0; padding: 0 3px; background: none; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pip { display: block; width: 22px; height: 6px; border-radius: 99px; background: #c3d1d3; overflow: hidden; position: relative; transition: width .35s cubic-bezier(.2,.7,.2,1), background .2s; }
    .dot.on .pip { width: 48px; background: #b3c6c8; }
    .dot:hover .pip, .dot:active .pip { background: #a9bfc1; }
    .dot:focus-visible { outline: none; }
    .dot:focus-visible .pip { outline: 2px solid #0f5e50; outline-offset: 3px; }
    .fill { position: absolute; inset: 0; background: #0f5e50; transform-origin: left; transition: transform .12s linear; }
    @media (pointer: coarse) { .dots { margin-left: -9px; } .dot { padding: 0 9px; } }
    @container (max-width: 420px) {
      .top { align-items: flex-start; }
      .arrows { display: none; }
    }
    .state { font-family: 'Geist Mono', monospace; font-size: 12px; color: #4a6a70; }
  `,
})
export class SnapCarouselTravel {
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly visible = hostVisible(0.3);
  protected readonly hovering = signal(false);
  protected readonly focused = signal(false);
  protected readonly page = signal(0);
  protected readonly pages = signal(1);
  protected readonly progress = signal(0);
  protected readonly pageList = computed(() => Array.from({ length: this.pages() }, (_, i) => i));
  /** True while a finger is on the carousel and for a few seconds after, so autoplay never fights a swipe. */
  protected readonly touchHold = signal(false);
  protected readonly paused = computed(
    () => this.hovering() || this.focused() || this.touchHold() || !this.visible() || this.reduced,
  );
  private touchTimer?: ReturnType<typeof setTimeout>;

  protected touchStart(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    clearTimeout(this.touchTimer);
    this.touchHold.set(true);
  }

  protected touchEnd(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    clearTimeout(this.touchTimer);
    this.touchTimer = setTimeout(() => this.touchHold.set(false), 6000);
  }
  private readonly reduced = prefersReducedMotion();

  protected readonly trips: Trip[] = [
    { id: 'lofoten', place: 'Lofoten', region: 'Norway', nights: 7, price: 2140, tag: 'Northern lights', img: unsplash('photo-1506905925346-21bda4d32df4', 700, 800) },
    { id: 'kyoto', place: 'Kyoto', region: 'Japan', nights: 9, price: 3380, tag: 'Maple season', img: unsplash('photo-1493976040374-85c8e12f0c0e', 700, 800) },
    { id: 'cinque', place: 'Cinque Terre', region: 'Liguria, Italy', nights: 6, price: 1690, tag: 'Coastal walk', img: unsplash('photo-1516483638261-f4dbaf036963', 700, 800) },
    { id: 'dolomites', place: 'Val di Funes', region: 'Dolomites', nights: 5, price: 1420, tag: 'Hut to hut', img: unsplash('photo-1470071459604-3b5ec3a7fe05', 700, 800) },
    { id: 'santorini', place: 'Santorini', region: 'Cyclades, Greece', nights: 6, price: 1980, tag: 'Off season', img: unsplash('photo-1570077188670-e3a8d69ac5ff', 700, 800) },
    { id: 'banff', place: 'Moraine Lake', region: 'Alberta, Canada', nights: 8, price: 2760, tag: 'Lakes & ridges', img: unsplash('photo-1501785888041-af3ef285b470', 700, 800) },
  ];

  constructor() {
    loadGoogleFonts('Fraunces:opsz,wght,SOFT@9..144,400..600,100');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.track().nativeElement;
      const ro = new ResizeObserver(() => this.measure());
      ro.observe(el);
      const timer = setInterval(() => {
        if (this.paused()) return;
        const next = this.progress() + 100 / AUTOPLAY_MS;
        if (next >= 1) {
          this.progress.set(0);
          this.goPage(this.page() + 1 >= this.pages() ? 0 : this.page() + 1, false);
        } else {
          this.progress.set(next);
        }
      }, 100);
      destroyRef.onDestroy(() => {
        ro.disconnect();
        clearInterval(timer);
        clearTimeout(this.touchTimer);
      });
    });
  }

  private stride(): number {
    const el = this.track().nativeElement;
    const first = el.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    return first ? first.offsetWidth + gap : 1;
  }

  private measure(): void {
    const el = this.track().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.pages.set(Math.max(1, Math.round(max / this.stride()) + 1));
    this.onScroll();
  }

  protected onScroll(): void {
    const el = this.track().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    const p = el.scrollLeft >= max - 4 ? this.pages() - 1 : Math.round(el.scrollLeft / this.stride());
    if (p !== this.page()) {
      this.page.set(p);
      this.progress.set(0);
    }
  }

  protected goPage(p: number, resetProgress = true): void {
    const el = this.track().nativeElement;
    const target = Math.max(0, Math.min(p, this.pages() - 1));
    el.scrollTo({ left: target * this.stride(), behavior: this.reduced ? 'auto' : 'smooth' });
    this.page.set(target);
    if (resetProgress) this.progress.set(0);
  }

  protected step(dir: number): void {
    const n = this.pages();
    this.goPage((this.page() + dir + n) % n);
  }
}
