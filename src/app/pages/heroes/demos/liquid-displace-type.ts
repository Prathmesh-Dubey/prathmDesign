import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

let uid = 0;

@Component({
  selector: 'demo-liquid-displace-type',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter [attr.id]="fid + '-img'" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" [attr.baseFrequency]="freq()" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" [attr.scale]="imgScale()" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter [attr.id]="fid + '-txt'" x="-5%" y="-20%" width="110%" height="140%">
        <feTurbulence type="turbulence" [attr.baseFrequency]="freqTxt()" numOctaves="1" seed="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" [attr.scale]="txtScale()" xChannelSelector="R" yChannelSelector="B" />
      </filter>
    </svg>

    <header class="nav">
      <a class="logo" href="#">Maré</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Shop</a><a href="#">Rituals</a><a href="#">Ingredients</a><a href="#">Journal</a>
      </nav>
      <a class="bag" href="#">Bag <span>0</span></a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">Menu</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Shop</a><a href="#" (click)="menu.set(false)">Rituals</a>
          <a href="#" (click)="menu.set(false)">Ingredients</a><a href="#" (click)="menu.set(false)">Bag (0)</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="kicker">No. 04 — Tidal Serum</p>
        <h1>Skin that drinks<br />like <em [style.filter]="'url(#' + fid + '-txt)'">the tide.</em></h1>
        <p class="sub">Breton sea fennel and 2% plant squalane for seventy-two hours of quiet, dewy hydration. Nothing sticky, nothing scented.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Shop Tidal Serum · €48</a>
          <a class="btn line" href="#">Find your ritual</a>
        </div>
        <p class="rating"><span aria-hidden="true">★★★★★</span> 4.8 from 3,912 reviews</p>
      </section>

      <figure
        class="arch"
        (pointermove)="stir($event)"
        (pointerdown)="down($event)"
        (keydown.enter)="splash()"
        tabindex="0"
        aria-label="Product photo. Move the pointer or press Enter to ripple it."
      >
        <div class="water" [style.filter]="'url(#' + fid + '-img)'">
          <img [src]="img" appImgFallback="mare-serum" alt="Maré Tidal Serum product photograph" />
        </div>
        <figcaption>30 ml · glass dropper · refill €38</figcaption>
      </figure>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: linear-gradient(180deg, #e3f0ec 0%, #cfe4df 100%);
      color: #0e2a33; font-family: 'Jost', system-ui, sans-serif;
    }
    .defs { position: absolute; }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 30px; padding: 22px clamp(18px, 5cqi, 60px); border-bottom: 1px solid rgba(14,42,51,.12); }
    .logo { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 600; font-style: italic; text-decoration: none; letter-spacing: .01em; }
    .links { display: flex; gap: 28px; margin: 0 auto; font-size: 14px; letter-spacing: .04em; }
    .links a, .sheet a { text-decoration: none; }
    .links a { position: relative; }
    .links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
    .links a:hover::after { transform: scaleX(1); }
    .bag { font-size: 14px; text-decoration: none; display: inline-flex; gap: 8px; align-items: center; }
    .bag span { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #0e2a33; color: #e3f0ec; font-size: 12px; }
    .burger { display: none; margin-left: auto; background: none; border: 1px solid rgba(14,42,51,.3); border-radius: 999px; padding: 8px 18px; font-size: 13px; cursor: pointer; }
    .sheet { position: absolute; top: 76px; right: 18px; display: grid; min-width: 200px; padding: 8px; background: #0e2a33; color: #e3f0ec; border-radius: 4px; }
    .sheet a { padding: 11px 12px; }

    .body { flex: 1; display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; gap: clamp(20px, 4cqi, 60px); padding: 28px clamp(18px, 5cqi, 60px) 36px; }
    .kicker { font-size: 13px; letter-spacing: .08em; color: #3c6b6f; }
    h1 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(40px, 8cqi, 96px); line-height: .92; letter-spacing: -0.02em; margin: 16px 0 20px; }
    h1 em { display: inline-block; font-style: italic; color: #1f6f78; padding: 0 .06em; }
    .sub { font-size: clamp(15px, 1.7cqi, 17px); line-height: 1.6; max-width: 40ch; color: #33545b; font-weight: 300; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-size: 14.5px; padding: 14px 24px; border-radius: 2px; letter-spacing: .02em; transition: background .25s, color .25s; }
    .btn.primary { background: #0e2a33; color: #e3f0ec; }
    .btn.primary:hover { background: #1f6f78; }
    .btn.line { border: 1px solid #0e2a33; }
    .btn.line:hover { background: rgba(14,42,51,.07); }
    .rating { margin-top: 22px; font-size: 13px; color: #3c6b6f; }
    .rating span { color: #1f6f78; letter-spacing: 2px; margin-right: 6px; }

    .arch { margin: 0; justify-self: center; width: min(100%, 380px); outline-offset: 6px; cursor: crosshair; touch-action: pan-y pinch-zoom; }
    .water { aspect-ratio: 4 / 5; border-radius: 999px 999px 18px 18px; overflow: hidden; background: #9cc4c0; box-shadow: 0 40px 70px -40px rgba(14,42,51,.6); }
    .water img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }
    figcaption { margin-top: 12px; text-align: center; font-size: 12.5px; letter-spacing: .06em; color: #3c6b6f; }

    @container (max-width: 720px) {
      .links, .bag { display: none; }
      .burger { display: block; }
      .body { grid-template-columns: 1fr; }
      .arch { width: min(70%, 260px); order: -1; }
    }
  `],
})
export class LiquidDisplaceType {
  protected readonly img = unsplash(PRODUCT_PHOTOS.serum, 760, 950);
  protected readonly fid = 'mare-' + ++uid;
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly freq = signal('0.012 0.02');
  protected readonly freqTxt = signal('0.02 0.06');
  protected readonly imgScale = signal(16);
  protected readonly txtScale = signal(4);
  private energy = 0.6;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    loadGoogleFonts('Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600', 'Jost:wght@300;400;500');
    rafLoop(hostVisible(), (t, dt) => {
      this.energy = Math.max(0, this.energy - dt * 0.0006);
      const s = t * 0.00035;
      this.freq.set(`${(0.011 + Math.sin(s) * 0.002).toFixed(4)} ${(0.018 + Math.cos(s * 1.3) * 0.004).toFixed(4)}`);
      this.freqTxt.set(`${(0.018 + Math.sin(s * 1.7) * 0.004).toFixed(4)} ${(0.05 + Math.cos(s) * 0.01).toFixed(4)}`);
      this.imgScale.set(Math.round(10 + this.energy * 70));
      this.txtScale.set(+(2.5 + this.energy * 9).toFixed(1));
    });
  }

  protected stir(e: PointerEvent): void {
    const d = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.energy = Math.min(1, this.energy + Math.min(d, 40) * 0.006);
  }

  /** Tap or click: ripple, and reset the speed reference so a following finger drag stirs smoothly. */
  protected down(e: PointerEvent): void {
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.splash();
  }

  protected splash(): void {
    this.energy = 1;
    this.imgScale.set(80);
  }
}
