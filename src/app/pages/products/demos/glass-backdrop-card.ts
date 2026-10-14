import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

@Component({
  selector: 'demo-glass-backdrop-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointermove)': 'move($event)',
    '(pointerdown)': 'move($event)',
    '(pointerleave)': 'settle()',
    '(pointerup)': 'settleTouch($event)',
    '(pointercancel)': 'settle()',
  },
  template: `
    <div class="blob b1" [style.transform]="'translate(' + px() * -30 + 'px,' + py() * -24 + 'px)'" aria-hidden="true"></div>
    <div class="blob b2" [style.transform]="'translate(' + px() * 26 + 'px,' + py() * 30 + 'px)'" aria-hidden="true"></div>
    <div class="blob b3" [style.transform]="'translate(' + px() * 14 + 'px,' + py() * -18 + 'px)'" aria-hidden="true"></div>

    <article class="glass" [style.transform]="'rotateX(' + py() * -4 + 'deg) rotateY(' + px() * 5 + 'deg)'">
      <div class="shot">
        <img [src]="img" appImgFallback="oro-speaker" alt="Oro portable speaker in a fabric finish" />
      </div>
      <div class="copy">
        <p class="kicker">Oro Audio</p>
        <h3>Oro Mini Portable Speaker</h3>
        <ul class="chips">
          <li>IP67</li><li>18h play</li><li>Stereo pair</li>
        </ul>
        <div class="buy">
          <div>
            <p class="price">&#36;{{ (149 * qty()).toFixed(0) }}</p>
            <p class="note">Ships in 2 days</p>
          </div>
          <div class="stepper" role="group" aria-label="Quantity">
            <button type="button" (click)="qty.set(qty() > 1 ? qty() - 1 : 1)" aria-label="Decrease quantity">−</button>
            <span aria-live="polite">{{ qty() }}</span>
            <button type="button" (click)="qty.set(qty() < 4 ? qty() + 1 : 4)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="cta" [class.done]="added()" (click)="added.set(!added())">
          {{ added() ? 'In your cart · ' + qty() : 'Add to cart' }}
        </button>
      </div>
    </article>
  `,
  styles: `
    :host {
      position: relative; display: grid; place-items: center; min-height: 100%; padding: 40px 16px; overflow: hidden;
      background: #ff5a36; font-family: 'Sora', sans-serif; color: #fff; perspective: 1000px; container-type: inline-size;
    }
    .blob { position: absolute; border-radius: 50%; filter: blur(8px); transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    .b1 { width: 340px; height: 340px; background: #ffb21e; top: -90px; left: -60px; }
    .b2 { width: 420px; height: 420px; background: #d4176b; bottom: -160px; right: -120px; }
    .b3 { width: 180px; height: 180px; background: #7a2cf0; top: 40%; left: 58%; opacity: .85; }
    .glass {
      position: relative; z-index: 1; width: min(560px, 100%); display: grid; grid-template-columns: 1fr 1.1fr; gap: 20px;
      padding: 18px; border-radius: 30px;
      background: linear-gradient(140deg, rgba(255,255,255,.34), rgba(255,255,255,.12));
      backdrop-filter: blur(22px) saturate(1.4); -webkit-backdrop-filter: blur(22px) saturate(1.4);
      border: 1px solid rgba(255,255,255,.45);
      box-shadow: 0 30px 60px -30px rgba(80,0,30,.6), inset 0 1px 0 rgba(255,255,255,.6);
      transition: transform .4s ease-out;
    }
    @container (max-width: 560px) { .glass { grid-template-columns: 1fr; width: min(360px, 100%); } .shot { aspect-ratio: 4 / 3; } }
    .shot { border-radius: 20px; overflow: hidden; aspect-ratio: 1; }
    .shot img { width: 100%; height: 100%; object-fit: cover; }
    .copy { display: flex; flex-direction: column; gap: 12px; padding: 4px 4px 4px 0; }
    .kicker { font-size: 13px; opacity: .85; }
    h3 { font-size: clamp(22px, 3.4vw, 28px); font-weight: 600; letter-spacing: -.03em; line-height: 1.05; }
    .chips { list-style: none; padding: 0; margin: 0; display: flex; gap: 6px; flex-wrap: wrap; }
    .chips li { font-size: 12px; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.35); }
    .buy { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; }
    .price { font-size: 26px; font-weight: 700; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
    .note { font-size: 12px; opacity: .8; }
    .stepper { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,.18); border-radius: 999px; padding: 4px; border: 1px solid rgba(255,255,255,.35); }
    .stepper button { width: 30px; height: 30px; border-radius: 50%; border: 0; background: rgba(255,255,255,.28); cursor: pointer; font-size: 16px; position: relative; color: inherit; }
    .stepper button::after { content: ''; position: absolute; inset: -6px; }
    @media (hover: hover) { .stepper button:hover { background: rgba(255,255,255,.45); } }
    .stepper button:active { background: rgba(255,255,255,.55); transform: scale(.92); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:active { transform: scale(.98); }
    @media (pointer: coarse) { .stepper button { width: 36px; height: 36px; } }
    .stepper span { min-width: 20px; text-align: center; font-weight: 600; }
    .cta { height: 50px; border-radius: 16px; border: 0; cursor: pointer; background: #fff; color: #b0124f; font-weight: 600; font-size: 15px; transition: background .3s, color .3s, transform .15s; }
    @media (hover: hover) { .cta:hover { transform: translateY(-1px); } }
    .cta.done { background: #2a0718; color: #fff; }
    .cta:focus-visible, .stepper button:focus-visible { outline-color: #fff; }
  `,
})
export class GlassBackdropCard {
  protected readonly img = unsplash(PRODUCT_PHOTOS.speaker, 600, 600);
  protected readonly px = signal(0);
  protected readonly py = signal(0);
  protected readonly qty = signal(1);
  protected readonly added = signal(false);

  constructor() {
    loadGoogleFonts('Sora:wght@400;600;700');
  }

  settle(): void {
    this.px.set(0);
    this.py.set(0);
  }

  /** Finger lifted: let the parallax ease back to rest (mouse keeps tracking). */
  settleTouch(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.settle();
  }

  move(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.px.set((e.clientX - r.left) / r.width - 0.5);
    this.py.set((e.clientY - r.top) / r.height - 0.5);
  }
}
