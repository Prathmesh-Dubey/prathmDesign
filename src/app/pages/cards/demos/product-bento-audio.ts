import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Finish {
  id: string;
  name: string;
  bg: string;
  ink: string;
}

@Component({
  selector: 'demo-product-bento-audio',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bento">
      <section class="tile hero" [style.background]="finish().bg" [style.color]="finish().ink">
        <div class="hero-copy">
          <p class="eyebrow">Aria Max</p>
          <h3>Silence, tuned<br />to you.</h3>
        </div>
        <img [src]="img" appImgFallback="aria-max" alt="Over-ear wireless headphones" />
        <p class="finish-name">{{ finish().name }}</p>
      </section>

      <section class="tile battery">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="50" class="track" />
          <circle cx="60" cy="60" r="50" class="arc" [style.stroke-dashoffset]="314 - (314 * hours()) / 40" />
        </svg>
        <p class="big">{{ hours() }}<span>h</span></p>
        <p class="sub">Battery with ANC on. 5 min charge, 4 hours of play.</p>
      </section>

      <section class="tile anc" [class.on]="anc()">
        <div class="anc-top">
          <p class="t">Adaptive noise cancelling</p>
          <button type="button" class="switch" role="switch" [attr.aria-checked]="anc()" (click)="anc.set(!anc())" aria-label="Noise cancelling">
            <span></span>
          </button>
        </div>
        <div class="bars" aria-hidden="true">
          @for (b of bars; track $index) {
            <span [style.--d]="b"></span>
          }
        </div>
        <p class="sub">{{ anc() ? 'Up to 48 dB of city noise, gone.' : 'Transparency mode. Hear the world.' }}</p>
      </section>

      <section class="tile colors">
        <p class="t">Four finishes</p>
        <div class="sw" role="radiogroup" aria-label="Finish">
          @for (f of finishes; track f.id) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="finish().id === f.id"
              [attr.aria-label]="f.name"
              [style.background]="f.bg"
              [class.on]="finish().id === f.id"
              (click)="finishId.set(f.id)"
            ></button>
          }
        </div>
      </section>

      <section class="tile spatial">
        <div class="rings" aria-hidden="true"><span></span><span></span><span></span><b></b></div>
        <p class="t">Spatial audio with head tracking</p>
      </section>

      <section class="tile buy">
        <p class="sub">From</p>
        <p class="price">$349</p>
        <button type="button" class="cta">Buy</button>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(14px, 3cqi, 30px);
      background: #f5f5f7; color: #1d1d1f; font-family: 'Inter Tight', 'Geist', sans-serif;
      container-type: inline-size;
    }
    .bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(150px, auto); gap: 12px; }
    .tile { border-radius: 24px; background: #fff; padding: 20px; position: relative; overflow: hidden; display: flex; flex-direction: column; transition: transform .4s cubic-bezier(.2,.7,.2,1); }
    @media (hover: hover) { .tile:hover { transform: scale(1.012); } }
    .t { font-weight: 600; font-size: 16px; letter-spacing: -0.01em; }
    .sub { font-size: 13.5px; color: #6e6e73; line-height: 1.4; }

    .hero { grid-column: span 2; grid-row: span 2; transition: background .6s ease, color .6s ease, transform .4s; min-height: 320px; }
    .eyebrow { font-size: 14px; font-weight: 600; opacity: .7; }
    h3 { font-size: clamp(28px, 4.4cqi, 44px); font-weight: 600; letter-spacing: -0.035em; line-height: 1.02; margin-top: 4px; }
    .hero img { position: absolute; right: -6%; bottom: -4%; width: 70%; aspect-ratio: 1; object-fit: cover; border-radius: 50%; mix-blend-mode: multiply; filter: contrast(1.05); transition: transform .8s cubic-bezier(.2,.7,.2,1); }
    @media (hover: hover) { .hero:hover img { transform: rotate(-6deg) scale(1.04); } }
    .finish-name { margin-top: auto; font-size: 13px; font-weight: 600; position: relative; }

    .battery { align-items: center; justify-content: center; text-align: center; gap: 6px; }
    .battery svg { width: 110px; position: absolute; top: 18px; opacity: .9; }
    .track { fill: none; stroke: #ececf0; stroke-width: 8; }
    .arc { fill: none; stroke: #34c759; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 314; transform: rotate(-90deg); transform-origin: center; transition: stroke-dashoffset .1s linear; }
    .big { font-size: 40px; font-weight: 700; letter-spacing: -0.04em; margin-top: 52px; line-height: 1; }
    .big span { font-size: 20px; }

    .anc { grid-column: span 2; background: #1d1d1f; color: #f5f5f7; gap: 12px; }
    .anc-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .switch { position: relative; width: 50px; height: 30px; border-radius: 999px; border: 0; padding: 3px; background: #48484a; cursor: pointer; transition: background .25s; flex-shrink: 0; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .switch::before { content: ''; position: absolute; inset: -7px -4px; border-radius: 999px; }
    .switch span { display: block; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.3,.8,.3,1); }
    .anc.on .switch { background: #34c759; }
    .anc.on .switch span { transform: translateX(20px); }
    .bars { flex: 1; display: flex; align-items: center; gap: 4px; min-height: 52px; }
    .bars span { flex: 1; height: 100%; max-height: 54px; border-radius: 3px; background: linear-gradient(#ff9f0a, #ff375f); transform-origin: center; animation: eq 1.1s ease-in-out infinite alternate; animation-delay: calc(var(--d) * -1s); }
    .anc.on .bars span { animation: none; transform: scaleY(.06); background: #48484a; transition: transform .6s cubic-bezier(.3,.8,.3,1); }
    .anc .sub { color: #a1a1a6; }

    .colors { gap: 14px; justify-content: space-between; }
    .sw { display: flex; gap: 10px; flex-wrap: wrap; }
    .sw button { position: relative; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(0,0,0,.12); cursor: pointer; box-shadow: inset 0 -6px 10px rgba(0,0,0,.08); transition: transform .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .sw button::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; }
    @media (hover: hover) { .sw button:hover { transform: scale(1.1); } }
    .sw button:active { transform: scale(.92); }
    .sw button.on { outline: 2px solid #0071e3; outline-offset: 3px; }

    .spatial { background: linear-gradient(160deg, #e8f0ff, #f6efff); justify-content: flex-end; }
    .rings { position: absolute; top: 18px; left: 50%; width: 90px; height: 90px; translate: -50% 0; }
    .rings span { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid #0071e3; animation: ring 2.4s ease-out infinite; opacity: 0; }
    .rings span:nth-child(2) { animation-delay: .8s; }
    .rings span:nth-child(3) { animation-delay: 1.6s; }
    .rings b { position: absolute; inset: 36px; border-radius: 50%; background: #0071e3; }

    .buy { align-items: flex-start; justify-content: flex-end; background: #fff; }
    .price { font-size: 36px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
    .cta { margin-top: 12px; height: 40px; padding: 0 22px; border-radius: 999px; border: 0; background: #0071e3; color: #fff; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .2s, transform .15s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:hover { background: #0077ed; }
    .cta:active { transform: scale(.96); }

    @keyframes eq { from { transform: scaleY(.15); } to { transform: scaleY(1); } }
    @keyframes ring { 0% { transform: scale(.4); opacity: .9; } 100% { transform: scale(1.3); opacity: 0; } }
    @container (max-width: 760px) {
      .bento { grid-template-columns: repeat(2, 1fr); }
      .hero, .anc { grid-column: span 2; }
      .hero { grid-row: auto; }
    }
    @container (max-width: 420px) {
      .bento { grid-template-columns: 1fr 1fr; gap: 10px; grid-auto-rows: minmax(140px, auto); }
      .hero, .anc { grid-column: span 2; }
      .hero { min-height: 280px; }
      .tile { padding: 16px; border-radius: 20px; }
      .battery .sub { font-size: 12px; }
      .t { font-size: 15px; }
      .price { font-size: 30px; }
      .sw { gap: 8px; }
      .sw button { width: 30px; height: 30px; }
      .sw button::before { inset: -5px; }
    }
  `,
})
export class ProductBentoAudio {
  protected readonly img = unsplash(PRODUCT_PHOTOS.headphones, 700, 700);
  protected readonly finishes: Finish[] = [
    { id: 'sand', name: 'Sandstone', bg: '#ece3d6', ink: '#3a2f22' },
    { id: 'sage', name: 'Sage', bg: '#d6e2d3', ink: '#1f3324' },
    { id: 'sky', name: 'Sky', bg: '#d5e3f3', ink: '#14294a' },
    { id: 'rose', name: 'Rosé', bg: '#f1d8d8', ink: '#4a1d22' },
  ];
  protected readonly finishId = signal('sand');
  protected readonly finish = computed(() => this.finishes.find((f) => f.id === this.finishId())!);
  protected readonly anc = signal(false);
  protected readonly hours = signal(0);
  protected readonly bars = Array.from({ length: 22 }, (_, i) => ((i * 37) % 11) / 10);
  private readonly visible = hostVisible(0.3);

  constructor() {
    loadGoogleFonts('Inter+Tight:wght@400;600;700');
    let timer: ReturnType<typeof setInterval> | undefined;
    effect(() => {
      if (!this.visible() || timer || this.hours() >= 40) return;
      if (prefersReducedMotion()) {
        this.hours.set(40);
        return;
      }
      timer = setInterval(() => {
        this.hours.update((h) => Math.min(40, h + 1));
        if (this.hours() >= 40) {
          clearInterval(timer);
        }
      }, 30);
    });
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
