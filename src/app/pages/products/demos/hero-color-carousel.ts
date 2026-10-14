import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Slide {
  id: string;
  kicker: string;
  name: string;
  line: string;
  price: string;
  img: string;
  alt: string;
  bg: string;
  ink: string;
  chip: string;
}

@Component({
  selector: 'demo-hero-color-carousel',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointerenter)': 'enter($event)',
    '(pointerleave)': 'hover.set(false)',
    '(focusin)': 'focus.set(true)',
    '(focusout)': 'focus.set(false)',
  },
  template: `
    <section
      class="hero"
      [style.--bg]="cur().bg"
      [style.--ink]="cur().ink"
      [style.--chip]="cur().chip"
      aria-roledescription="carousel"
      aria-label="Featured products"
      tabindex="0"
      (keydown)="key($event)"
      (pointerdown)="down($event)"
      (pointermove)="drag($event)"
      (pointerup)="swipe($event)"
      (pointercancel)="tracking = false"
    >
      <div class="bars">
        @for (s of slides; track s.id; let i = $index) {
          <button type="button" class="bar" (click)="go(i)" [attr.aria-label]="'Show ' + s.name" [attr.aria-current]="i === index() ? 'true' : null">
            <i [class.done]="i < index()" [class.run]="i === index()" [class.paused]="paused()" (animationend)="auto && i === index() && next()"></i>
          </button>
        }
      </div>

      @for (s of slides; track s.id; let i = $index) {
        <div class="slide" [class.on]="i === index()" [class.before]="i < index()" role="group" aria-roledescription="slide"
          [attr.aria-label]="(i + 1) + ' of ' + slides.length + ': ' + s.name" [attr.aria-hidden]="i !== index()">
          <div class="copy">
            <p class="kicker">{{ s.kicker }}</p>
            <h3>{{ s.name }}</h3>
            <p class="line">{{ s.line }}</p>
            <div class="cta-row">
              <button type="button" class="cta" [attr.tabindex]="i === index() ? 0 : -1">Shop now · {{ s.price }}</button>
            </div>
          </div>
          <div class="media">
            <div class="disc" aria-hidden="true"></div>
            <img [src]="s.img" [appImgFallback]="s.id" [alt]="s.alt" draggable="false" />
          </div>
        </div>
      }

      <div class="controls">
        <span class="count">{{ index() + 1 }}<span> / {{ slides.length }}</span></span>
        <button type="button" (click)="prev()" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" (click)="next()" aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        @if (auto) {
          <button type="button" (click)="userPaused.set(!userPaused())" [attr.aria-label]="userPaused() ? 'Play slideshow' : 'Pause slideshow'">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              @if (userPaused()) { <path d="M8 5l11 7-11 7z" class="fill" /> } @else { <path d="M9 5v14M15 5v14" /> }
            </svg>
          </button>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; }
    .hero {
      position: relative; min-height: 560px; height: 100%; overflow: hidden; outline: none; touch-action: pan-y; user-select: none; -webkit-tap-highlight-color: transparent;
      background: var(--bg); color: var(--ink); font-family: 'Bricolage Grotesque', sans-serif; transition: background .9s cubic-bezier(.6,0,.2,1), color .6s;
    }
    .hero:focus-visible { box-shadow: inset 0 0 0 3px var(--ink); }
    .bars { position: absolute; top: 20px; left: clamp(20px, 5cqw, 56px); right: clamp(20px, 5cqw, 56px); display: flex; gap: 6px; z-index: 3; }
    .bar { flex: 1; height: 18px; border: 0; padding: 7px 0; background: none; cursor: pointer; }
    .bar i { display: block; height: 4px; border-radius: 2px; background: color-mix(in srgb, var(--ink) 22%, transparent); position: relative; overflow: hidden; }
    .bar i::after { content: ''; position: absolute; inset: 0; background: var(--ink); transform: scaleX(0); transform-origin: left; }
    .bar i.done::after { transform: scaleX(1); }
    .bar i.run::after { animation: fill 5.5s linear forwards; }
    .bar i.run.paused::after { animation-play-state: paused; }
    @keyframes fill { to { transform: scaleX(1); } }
    .slide { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 60px clamp(20px, 5cqw, 56px) 70px; gap: 24px; pointer-events: none; }
    .slide.on { pointer-events: auto; }
    .copy > * { opacity: 0; transform: translateY(26px); transition: opacity .5s, transform .7s cubic-bezier(.2,.8,.2,1); }
    .slide.before .copy > * { transform: translateY(-26px); }
    .slide.on .copy > * { opacity: 1; transform: none; }
    .slide.on .copy > :nth-child(2) { transition-delay: .08s; } .slide.on .copy > :nth-child(3) { transition-delay: .16s; } .slide.on .copy > :nth-child(4) { transition-delay: .24s; }
    .kicker { font-size: 14px; font-weight: 600; }
    h3 { font-size: clamp(44px, 8.6cqw, 104px); font-weight: 800; line-height: .88; letter-spacing: -.045em; margin-top: 10px; font-variation-settings: 'wdth' 80; }
    .line { font-size: 16px; max-width: 34ch; margin-top: 16px; opacity: .85; }
    .slide.on .line { opacity: .85; }
    .cta-row { margin-top: 26px; }
    .cta { height: 52px; padding: 0 24px; border-radius: 999px; border: 0; cursor: pointer; background: var(--ink); color: var(--bg); font: inherit; font-weight: 600; font-size: 15px; transition: transform .2s, background .9s, color .9s; }
    @media (hover: hover) { .cta:hover { transform: translateY(-2px); } }
    .cta:active { transform: scale(.97); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .media { position: relative; display: grid; place-items: center; height: 100%; max-height: 440px; }
    .disc { position: absolute; width: min(92%, 420px); aspect-ratio: 1; border-radius: 50%; background: var(--chip); transform: scale(.6); opacity: 0; transition: transform .9s cubic-bezier(.2,.8,.2,1), opacity .6s, background .9s; }
    .media img { position: relative; width: min(78%, 360px); aspect-ratio: 1; object-fit: cover; border-radius: 50%; box-shadow: 0 40px 60px -30px rgba(0,0,0,.45); opacity: 0; transform: translateX(30%) rotate(18deg) scale(.85); transition: opacity .6s, transform 1s cubic-bezier(.2,.8,.2,1); }
    .slide.before .media img { transform: translateX(-30%) rotate(-18deg) scale(.85); }
    .slide.on .disc { transform: none; opacity: 1; }
    .slide.on .media img { opacity: 1; transform: none; transition-delay: .1s; }
    .controls { position: absolute; right: clamp(20px, 5cqw, 56px); bottom: 20px; display: flex; align-items: center; gap: 8px; z-index: 3; }
    .count { font-size: 18px; font-weight: 700; margin-right: 8px; font-variant-numeric: tabular-nums; }
    .count span { opacity: .55; font-weight: 500; }
    .controls button { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--ink); background: transparent; color: var(--ink); cursor: pointer; display: grid; place-items: center; transition: background .2s, color .2s; }
    @media (hover: hover) { .controls button:hover { background: var(--ink); color: var(--bg); } }
    .controls button:active { background: var(--ink); color: var(--bg); transform: scale(.94); }
    @media (pointer: coarse) { .bars { top: 10px; } .bar { height: 36px; padding: 16px 0; } }
    .controls svg { width: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .controls svg .fill { fill: currentColor; }
    @container (max-width: 640px) {
      .slide { grid-template-columns: 1fr; grid-template-rows: auto 1fr; padding-top: 56px; align-items: start; gap: 0; }
      .media { order: -1; height: 200px; }
      .disc { width: 200px; } .media img { width: 164px; }
      .line { font-size: 14px; margin-top: 12px; }
      .cta-row { margin-top: 18px; }
      .slide { padding-bottom: 84px; }
    }
    @container (max-width: 400px) {
      .media { height: 180px; }
      .disc { width: 180px; } .media img { width: 148px; }
      h3 { font-size: 42px; }
      .cta { height: 48px; padding: 0 20px; }
      .count { font-size: 16px; margin-right: 2px; }
      .controls { gap: 6px; }
    }
  `,
})
export class HeroColorCarousel {
  protected readonly slides: Slide[] = [
    { id: 'kite', kicker: 'Kerb Athletics — New season', name: 'Kite Runner 2', line: 'A lighter foam, a grippier outsole and the red that sold out in March.', price: '$160', img: unsplash(PRODUCT_PHOTOS.sneakerRed, 720, 720), alt: 'Kite Runner 2 sneaker in signal red', bg: '#e8412f', ink: '#fff4ee', chip: '#ff6b55' },
    { id: 'aster', kicker: 'Aster Audio', name: 'Aster ANC', line: 'Forty hours of quiet in a saffron finish, folded flat for the commute.', price: '$349', img: unsplash(PRODUCT_PHOTOS.headphones, 720, 720), alt: 'Aster ANC headphones in saffron', bg: '#f2c230', ink: '#2a1e00', chip: '#ffd95e' },
    { id: 'oro', kicker: 'Oro — Waterproof', name: 'Oro Mini', line: 'Pocket-sized, IP67 and loud enough for the whole beach.', price: '$149', img: unsplash(PRODUCT_PHOTOS.speaker, 720, 720), alt: 'Oro Mini portable speaker', bg: '#1e3a8a', ink: '#eaf0ff', chip: '#2f54b8' },
    { id: 'kessler', kicker: 'Kessler Optics', name: 'Kessler K2', line: 'A mechanical 35mm rangefinder for people who like to slow down.', price: '$2,690', img: unsplash(PRODUCT_PHOTOS.camera, 720, 720), alt: 'Kessler K2 film camera', bg: '#0f5e57', ink: '#e6fff8', chip: '#1a7c73' },
  ];
  protected readonly index = signal(0);
  protected readonly cur = computed(() => this.slides[this.index()]);
  protected readonly hover = signal(false);
  protected readonly focus = signal(false);
  protected readonly userPaused = signal(false);
  private readonly visible = hostVisible(0.4);
  protected readonly auto = !prefersReducedMotion();
  protected readonly paused = computed(() => !this.auto || this.hover() || this.focus() || this.userPaused() || !this.visible());
  protected startX = 0;
  private startY = 0;
  protected tracking = false;
  private moved = false;

  constructor() {
    // A swipe that ends over a button must not also click it.
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const swallow = (e: Event) => {
      if (!this.moved) return;
      this.moved = false;
      e.stopPropagation();
      e.preventDefault();
    };
    el.addEventListener('click', swallow, true);
    inject(DestroyRef).onDestroy(() => el.removeEventListener('click', swallow, true));
  }

  /** Only a real mouse pauses on hover; touch "hover" would stick after a tap. */
  enter(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.hover.set(true);
  }

  down(e: PointerEvent): void {
    if (e.button > 0) return;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.tracking = true;
    this.moved = false;
  }

  drag(e: PointerEvent): void {
    if (!this.tracking || this.moved) return;
    if (Math.abs(e.clientX - this.startX) > 8) {
      this.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  }

  next(): void {
    this.index.set((this.index() + 1) % this.slides.length);
  }

  prev(): void {
    this.index.set((this.index() - 1 + this.slides.length) % this.slides.length);
  }

  go(i: number): void {
    this.index.set(i);
  }

  key(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
  }

  swipe(e: PointerEvent): void {
    if (!this.tracking) return;
    this.tracking = false;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) this.next();
    else this.prev();
  }
}
