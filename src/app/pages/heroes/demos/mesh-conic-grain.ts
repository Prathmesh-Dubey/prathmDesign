import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

interface Glaze {
  id: string;
  name: string;
  stops: string[];
  note: string;
}

const GLAZES: Glaze[] = [
  { id: 'celadon', name: 'Celadon', stops: ['#9cc5b4', '#d8e6d9', '#6f9f8c', '#b7d3c3', '#4f7d6d', '#9cc5b4'], note: 'Pale jade, pools darker in the throwing rings' },
  { id: 'tenmoku', name: 'Tenmoku', stops: ['#2a1d17', '#7a4a2e', '#c08a5b', '#3b2519', '#a0643a', '#2a1d17'], note: 'Iron-rich black breaking to rust on the rims' },
  { id: 'cobalt', name: 'Cobalt', stops: ['#2d4f8f', '#7d9bd1', '#1c3361', '#c9d6ef', '#3e66b0', '#2d4f8f'], note: 'Deep sea blue with a white crawl at the lip' },
  { id: 'shino', name: 'Shino', stops: ['#e9dfcf', '#d39b6e', '#f4ece0', '#b8714a', '#efe3d3', '#e9dfcf'], note: 'Milky white with orange flashes from the kiln' },
];

let uid = 0;

@Component({
  selector: 'demo-mesh-conic-grain',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <svg class="grain" aria-hidden="true">
      <filter [attr.id]="nid"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" [attr.filter]="'url(#' + nid + ')'" />
    </svg>

    <header class="nav">
      <a class="logo" href="#">Kiln <i>&amp;</i> Tide</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Shop</a><a href="#">Workshops</a><a href="#">Studio</a><a href="#">Stockists</a>
      </nav>
      <a class="cta-sm" href="#">Cart (2)</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">Menu</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Shop</a><a href="#" (click)="menu.set(false)">Workshops</a>
          <a href="#" (click)="menu.set(false)">Studio</a><a href="#" (click)="menu.set(false)">Cart (2)</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="kicker">Autumn kiln · 48 pieces · opens 1 November</p>
        <h1>Thrown by hand on the Cornish coast.</h1>
        <p class="sub">Stoneware glazed with ash from our own driftwood fires, fired to 1,280 °C. Every piece is one of a kind, and every piece goes in the dishwasher.</p>
        <div class="glazes" role="radiogroup" aria-label="Preview a glaze">
          @for (g of glazes; track g.id) {
            <button type="button" role="radio" [attr.aria-checked]="glaze().id === g.id" [class.on]="glaze().id === g.id" (click)="pick(g)"
              [style.background]="'conic-gradient(' + g.stops.join(',') + ')'" [attr.aria-label]="g.name"></button>
          }
          <span class="gname">{{ glaze().name }} — {{ glaze().note }}</span>
        </div>
        <div class="ctas">
          <a class="btn primary" href="#">Shop the autumn kiln</a>
          <a class="btn line" href="#">Wheel class · £65</a>
        </div>
      </section>

      <div class="wheel" aria-hidden="true">
        <div class="bowl">
          <span class="glaze" [style.background]="bowlBg()" [style.transform]="'rotate(' + angle() + 'deg)'"></span>
          <span class="rings"></span><span class="well"></span><span class="spark"></span>
        </div>
        <span class="shadow"></span>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: radial-gradient(60% 70% at 75% 55%, rgba(228,221,208,.9), transparent 70%), conic-gradient(from 210deg at 75% 55%, #e4ddd0, #d3c3ad, #c9d3c9, #d9cfbf, #e4ddd0); color: #2a1d17; font-family: 'Karla', system-ui, sans-serif;
    }
    .grain { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none; mix-blend-mode: multiply; opacity: .28; }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { font-family: 'Young Serif', serif; font-size: 23px; text-decoration: none; }
    .logo i { font-style: normal; color: #a0643a; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 15px; }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { color: #a0643a; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 9px 16px; border-radius: 999px; border: 1.5px solid #2a1d17; }
    .cta-sm:hover { background: #2a1d17; color: #e4ddd0; }
    .burger { display: none; margin-left: auto; font: 700 14px 'Karla', sans-serif; padding: 9px 16px; border-radius: 999px; border: 1.5px solid #2a1d17; background: none; cursor: pointer; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 18px; background: #2a1d17; color: #e4ddd0; }
    .sheet a { padding: 11px 14px; font-family: 'Young Serif', serif; font-size: 22px; }

    .body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4cqi, 60px); align-items: center; padding: 6px clamp(18px, 4.5cqi, 56px) 40px; }
    .kicker { font-size: 13.5px; color: #6b5442; }
    h1 { font-family: 'Young Serif', serif; font-weight: 400; font-size: clamp(36px, 6cqi, 74px); line-height: 1.02; letter-spacing: -0.02em; margin: 14px 0 18px; max-width: 13ch; }
    .sub { font-size: clamp(15px, 1.65cqi, 17.5px); line-height: 1.6; color: #4a382c; max-width: 44ch; }
    .glazes { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 24px; }
    .glazes button { width: 34px; height: 34px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; box-shadow: inset 0 0 0 3px #d6cdbd; transition: transform .25s cubic-bezier(.3,1.6,.5,1), border-color .2s; }
    .glazes button:hover { transform: scale(1.1); }
    .glazes button.on { border-color: #2a1d17; }
    .glazes button:active { scale: .92; }
    @media (pointer: coarse) { .glazes button { width: 42px; height: 42px; } }
    .gname { font-size: 13px; color: #6b5442; flex-basis: 100%; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 22px; border-radius: 999px; transition: background .2s, color .2s; }
    .btn.primary { background: #2a1d17; color: #efe8dc; }
    .btn.primary:hover { background: #7a4a2e; }
    .btn.line { border: 1.5px solid #2a1d17; }
    .btn.line:hover { background: rgba(42,29,23,.08); }

    .wheel { position: relative; justify-self: center; width: min(100%, 420px); aspect-ratio: 1; display: grid; place-items: center; }
    .bowl { position: relative; isolation: isolate; width: 88%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; box-shadow: inset 0 0 0 10px rgba(255,255,255,.12), inset 0 -20px 60px rgba(0,0,0,.35), 0 40px 60px -30px rgba(42,29,23,.7); }
    .glaze { position: absolute; inset: 0; border-radius: 50%; }
    .rings { position: absolute; inset: 0; border-radius: 50%; background: repeating-radial-gradient(circle, rgba(0,0,0,.08) 0 2px, transparent 2px 9px); mix-blend-mode: multiply; }
    .well { position: absolute; inset: 26%; border-radius: 50%; background: radial-gradient(circle at 45% 40%, rgba(255,255,255,.2), rgba(0,0,0,.35)); box-shadow: inset 0 8px 20px rgba(0,0,0,.35); }
    .spark { position: absolute; top: 9%; left: 30%; width: 18%; height: 6%; border-radius: 50%; background: rgba(255,255,255,.55); filter: blur(4px); }
    .shadow { position: absolute; inset: auto 12% 2%; height: 8%; border-radius: 50%; background: rgba(42,29,23,.25); filter: blur(10px); z-index: -1; }

    @container (max-width: 720px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .body { grid-template-columns: 1fr; }
      .wheel { width: min(76%, 300px); order: -1; }
    }
  `],
})
export class MeshConicGrain {
  protected readonly nid = 'kt-noise-' + ++uid;
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly glazes = GLAZES;
  protected readonly glaze = signal<Glaze>(GLAZES[0]);
  protected readonly angle = signal(0);
  protected readonly bowlBg = computed(() => `conic-gradient(from 0deg, ${this.glaze().stops.join(', ')})`);
  private speed = 0.02;

  constructor() {
    loadGoogleFonts('Young+Serif', 'Karla:wght@400;700');
    rafLoop(hostVisible(), (_t, dt) => {
      this.speed += (0.02 - this.speed) * 0.02;
      this.angle.set((this.angle() + this.speed * dt) % 360);
    });
  }

  protected pick(g: Glaze): void {
    this.glaze.set(g);
    this.speed = 0.5;
  }
}
