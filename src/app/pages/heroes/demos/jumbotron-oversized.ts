import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

function nextDrop(now: Date): number {
  const d = new Date(now);
  d.setHours(10, 0, 0, 0);
  const add = (5 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + add);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
  return d.getTime();
}

@Component({
  selector: 'demo-jumbotron-oversized',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#">KOTO</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Run</a><a href="#">Trail</a><a href="#">Archive</a><a href="#">Stores</a>
      </nav>
      <a class="cart" href="#" aria-label="Cart, 0 items">Cart 0</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">{{ menu() ? 'Close' : 'Menu' }}</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Run</a><a href="#" (click)="menu.set(false)">Trail</a>
          <a href="#" (click)="menu.set(false)">Archive</a><a href="#" (click)="menu.set(false)">Cart 0</a>
        </nav>
      }
    </header>

    <section class="stage">
      <p class="drop">Drop 014 · Friday 10:00 · 1,200 pairs</p>
      <h1 aria-label="Runner 02">
        <span class="back" aria-hidden="true">RUNNER</span>
        <span class="front" aria-hidden="true">02</span>
      </h1>
      <figure class="shoe">
        <img [src]="img" appImgFallback="koto-runner" alt="KOTO Runner 02 sneaker" />
      </figure>
    </section>

    <section class="bar">
      <div class="count" role="timer" aria-label="Time until the drop">
        @for (u of countdown(); track u.l) {
          <div><b>{{ u.v }}</b><span>{{ u.l }}</span></div>
        }
      </div>
      <div class="sizes" role="radiogroup" aria-label="Choose your size">
        @for (s of sizes; track s) {
          <button type="button" role="radio" [attr.aria-checked]="size() === s" [class.on]="size() === s" (click)="size.set(s)">{{ s }}</button>
        }
      </div>
      <div class="ctas">
        <a class="btn primary" href="#">Notify me · US {{ size() }}</a>
        <a class="btn ghost" href="#">€160 · Specs</a>
      </div>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: #ecebe6; color: #111; font-family: 'Archivo', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 4; display: flex; align-items: center; gap: 24px; padding: 18px clamp(16px, 3cqi, 40px); }
    .logo { font-weight: 900; font-stretch: 125%; font-size: 24px; letter-spacing: -0.04em; text-decoration: none; }
    .links { display: flex; gap: 22px; margin-left: auto; font-size: 13.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em; }
    .links a, .sheet a, .cart { text-decoration: none; }
    .links a:hover { color: #ff3b1f; }
    .cart { font-size: 13.5px; font-weight: 700; text-transform: uppercase; padding: 8px 14px; border: 2px solid #111; border-radius: 999px; }
    .burger { display: none; margin-left: auto; font: 700 13px 'Archivo', sans-serif; text-transform: uppercase; padding: 8px 14px; border: 2px solid #111; border-radius: 999px; background: none; cursor: pointer; }
    .sheet { position: absolute; top: 68px; left: 12px; right: 12px; display: grid; background: #111; color: #ecebe6; padding: 10px; }
    .sheet a { padding: 8px 10px; font-weight: 900; font-stretch: 62%; font-size: 40px; line-height: 1; text-transform: uppercase; }

    .stage { position: relative; flex: 1; display: grid; place-items: center; min-height: 260px; padding: 0 clamp(8px, 1.5cqi, 20px); }
    .drop { position: absolute; top: 4px; left: clamp(16px, 3cqi, 40px); font-size: 12.5px; font-weight: 600; z-index: 3; }
    h1 { position: relative; width: 100%; margin: 0; line-height: .78; text-align: center; font-weight: 900; text-transform: uppercase; }
    .back { display: block; font-stretch: 62%; font-size: 25cqi; letter-spacing: -0.03em; color: #111; }
    .front { position: absolute; right: 2cqi; bottom: -3cqi; z-index: 3; font-stretch: 125%; font-size: 15cqi; letter-spacing: -0.06em; color: transparent; -webkit-text-stroke: max(2px, .3cqi) #ff3b1f; }
    .shoe { position: absolute; z-index: 2; margin: 0; width: min(46cqi, 520px); aspect-ratio: 1; border-radius: 50%; overflow: hidden; top: 50%; left: 50%;
      transform: translate(-50%, -46%) rotate(-12deg); box-shadow: 0 40px 60px -30px rgba(0,0,0,.6); animation: bob 5s ease-in-out infinite; }
    .shoe img { width: 100%; height: 100%; object-fit: cover; }
    @keyframes bob { 50% { transform: translate(-50%, -50%) rotate(-9deg); } }

    .bar { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 16px 22px; flex-wrap: wrap; padding: 16px clamp(16px, 3cqi, 40px) 20px; border-top: 2px solid #111; }
    .count { display: flex; gap: 14px; }
    .count div { display: grid; text-align: center; min-width: 40px; }
    .count b { font-weight: 900; font-stretch: 62%; font-size: 36px; line-height: 1; font-variant-numeric: tabular-nums; }
    .count span { font-size: 10.5px; font-weight: 600; text-transform: uppercase; opacity: .6; }
    .sizes { display: flex; gap: 6px; flex-wrap: wrap; }
    .sizes button { width: 40px; height: 36px; border-radius: 8px; border: 1.5px solid rgba(17,17,17,.25); background: transparent; font: 700 13px 'Archivo', sans-serif; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
    .sizes button:hover { border-color: #111; }
    .sizes button.on { background: #111; color: #ecebe6; border-color: #111; }
    @media (pointer: coarse) { .sizes button { width: 42px; height: 42px; } }
    .ctas { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; padding: 14px 20px; border-radius: 999px; transition: transform .15s; }
    .btn:active { transform: scale(.97); }
    .btn.primary { background: #ff3b1f; color: #fff; }
    .btn.primary:hover { background: #111; }
    .btn.ghost { border: 2px solid #111; }

    @container (max-width: 700px) {
      .links, .cart { display: none; }
      .burger { display: block; }
      .shoe { width: 58cqi; }
      .back { font-size: 26cqi; }
      .front { font-size: 20cqi; bottom: -6cqi; }
    }
  `],
})
export class JumbotronOversized {
  protected readonly img = unsplash(PRODUCT_PHOTOS.sneakerRed, 900, 900);
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly sizes = [7, 8, 8.5, 9, 9.5, 10, 11, 12];
  protected readonly size = signal(9);
  private readonly now = signal(Date.now());
  private readonly target = nextDrop(new Date());
  private readonly visible = hostVisible();
  protected readonly countdown = computed(() => {
    let s = Math.max(0, Math.floor((this.target - this.now()) / 1000));
    const d = Math.floor(s / 86400);
    s -= d * 86400;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    return [
      { v: pad(d), l: 'Days' },
      { v: pad(h), l: 'Hrs' },
      { v: pad(m), l: 'Min' },
      { v: pad(s - m * 60), l: 'Sec' },
    ];
  });

  constructor() {
    loadGoogleFonts('Archivo:wdth,wght@62..125,500..900');
    effect((onCleanup) => {
      if (!this.visible()) return;
      this.now.set(Date.now());
      const id = setInterval(() => this.now.set(Date.now()), 1000);
      onCleanup(() => clearInterval(id));
    });
  }
}
