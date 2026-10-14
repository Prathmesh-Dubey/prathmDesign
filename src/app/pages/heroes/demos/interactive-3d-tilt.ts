import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

interface Layer {
  d: string;
  fill: string;
  z: number;
}

const LAYERS: Layer[] = [
  { d: 'M0 230 L70 150 L120 190 L190 100 L260 170 L330 90 L400 160 L400 400 L0 400Z', fill: '#f2a48b', z: 10 },
  { d: 'M0 270 L60 210 L110 240 L170 150 L210 120 L250 175 L300 140 L360 210 L400 190 L400 400 L0 400Z', fill: '#d0687c', z: 40 },
  { d: 'M0 300 L80 240 L140 280 L220 200 L290 260 L340 230 L400 270 L400 400 L0 400Z', fill: '#8c3f6e', z: 75 },
  { d: 'M0 340 C60 310 120 330 180 300 S300 320 400 296 L400 400 L0 400Z', fill: '#4a2a55', z: 110 },
];

@Component({
  selector: 'demo-interactive-3d-tilt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19l6-10 4 6 2-3 6 7z" /></svg>Switchback</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Maps</a><a href="#">Routes</a><a href="#">Huts</a><a href="#">Pro</a>
      </nav>
      <a class="cta-sm" href="#">Get Switchback</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Maps</a><a href="#" (click)="menu.set(false)">Routes</a>
          <a href="#" (click)="menu.set(false)">Huts</a><a href="#" (click)="menu.set(false)">Get Switchback</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="tag">9,400 routes · offline · Alps &amp; Dolomites</p>
        <h1>Every switchback, before you get there.</h1>
        <p class="sub">Layered 3D trail maps with hut bookings, today's snow line and the time of the last cable car down.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Download free</a>
          <a class="btn ghost" href="#">Explore the Matterhorn</a>
        </div>
      </section>

      <div
        class="scene"
        (pointerdown)="tilt($event)"
        (pointermove)="tilt($event)"
        (pointerup)="release($event)"
        (pointercancel)="target = null"
        (pointerleave)="target = null"
        aria-hidden="true"
      >
        <div class="box" [style.transform]="'rotateX(' + rx() + 'deg) rotateY(' + ry() + 'deg)'">
          <div class="sky"><span class="sun"></span></div>
          @for (l of layers; track l.z; let i = $index) {
            <svg class="layer" viewBox="0 0 400 400" preserveAspectRatio="none" [style.transform]="'translateZ(' + l.z + 'px)'">
              <path [attr.d]="l.d" [attr.fill]="l.fill" />
              @if (i === 1) {
                <path class="trail" d="M30 380 C80 330 60 300 120 280 S170 230 210 150" />
              }
            </svg>
          }
          <div class="cloud c1" style="transform: translateZ(60px)"></div>
          <div class="cloud c2" style="transform: translateZ(95px)"></div>
          <div class="pin" style="transform: translateZ(140px)">
            <span class="dot"></span>
            <span class="label"><b>Hörnli Hut</b> 3,260 m · 4 h 10</span>
          </div>
          <div class="frame" style="transform: translateZ(150px)"></div>
        </div>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: radial-gradient(70% 80% at 72% 55%, #2e2542 0%, #1b1729 70%); color: #fff1e6; font-family: 'Gabarito', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 21px; letter-spacing: -0.02em; text-decoration: none; }
    .logo svg { width: 24px; height: 24px; fill: #f2a48b; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 15px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .75; }
    .links a:hover { opacity: 1; color: #f2a48b; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 18px; border-radius: 12px; background: #fff1e6; color: #1b1729; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 12px; border: 0; background: #fff1e6; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 2px; border-radius: 2px; background: #1b1729; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 18px; background: #fff1e6; color: #1b1729; }
    .sheet a { padding: 12px 14px; font-size: 18px; font-weight: 700; }

    .body { flex: 1; display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(20px, 4cqi, 56px); align-items: center; padding: 0 clamp(18px, 4.5cqi, 56px) 36px; }
    .tag { font-size: 13.5px; color: #f2a48b; }
    h1 { font-weight: 800; font-size: clamp(36px, 6cqi, 72px); line-height: 1; letter-spacing: -0.035em; margin: 14px 0 18px; max-width: 13ch; }
    .sub { max-width: 42ch; font-size: clamp(15px, 1.65cqi, 17.5px); line-height: 1.6; color: rgba(255,241,230,.75); }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 15px 22px; border-radius: 14px; transition: transform .2s, background .2s; }
    .btn.primary { background: #f2a48b; color: #1b1729; }
    .btn.primary:hover { transform: translateY(-2px); background: #ffb9a1; }
    .btn.ghost { box-shadow: inset 0 0 0 1.5px rgba(255,241,230,.35); }
    .btn.ghost:hover { box-shadow: inset 0 0 0 1.5px #fff1e6; }

    .scene { justify-self: center; width: min(100%, 440px); aspect-ratio: 1 / 1.05; perspective: 1100px; cursor: grab; touch-action: pan-y pinch-zoom; -webkit-user-select: none; user-select: none; }
    .box { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; }
    .box > * { position: absolute; inset: 0; border-radius: 26px; }
    .sky { overflow: hidden; background: linear-gradient(180deg, #ffd3b0 0%, #ffb08f 55%, #f89a86 100%); box-shadow: 0 50px 80px -40px rgba(0,0,0,.8); }
    .sun { position: absolute; width: 26%; aspect-ratio: 1; border-radius: 50%; left: 58%; top: 16%; background: #fff4e2; box-shadow: 0 0 60px 10px rgba(255,244,226,.6); }
    .layer { width: 100%; height: 100%; clip-path: inset(0 round 26px); filter: drop-shadow(0 -6px 10px rgba(40,10,40,.25)); }
    .layer path { stroke: none; }
    .trail { fill: none !important; stroke: #fff1e6 !important; stroke-width: 3; stroke-dasharray: 2 7; stroke-linecap: round; }
    .cloud { inset: auto; height: 22px; border-radius: 999px; background: rgba(255,248,240,.9); }
    .c1 { width: 30%; left: 8%; top: 22%; }
    .c2 { width: 22%; left: 62%; top: 38%; }
    .pin { inset: auto; left: 46%; top: 30%; display: flex; align-items: center; gap: 8px; }
    .pin .dot { width: 16px; height: 16px; border-radius: 50%; background: #fff1e6; box-shadow: 0 0 0 6px rgba(255,241,230,.3); }
    .pin .label { font-size: 12.5px; white-space: nowrap; padding: 6px 10px; border-radius: 10px; background: #1b1729; color: #fff1e6; box-shadow: 0 10px 20px -10px #000; }
    .pin b { color: #f2a48b; margin-right: 4px; }
    .frame { pointer-events: none; border: 10px solid #fff1e6; }

    @container (max-width: 720px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .scene { width: min(84%, 340px); order: -1; margin-top: 4px; }
      .pin { left: 30%; }
      .pin .label { font-size: 11.5px; }
    }
  `],
})
export class Interactive3dTilt {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly layers = LAYERS;
  protected readonly rx = signal(8);
  protected readonly ry = signal(-14);
  protected target: { x: number; y: number } | null = null;

  constructor() {
    loadGoogleFonts('Gabarito:wght@400;700;800');
    rafLoop(hostVisible(), (t) => {
      const g = this.target ?? { x: Math.sin(t * 0.0006) * 0.5, y: Math.cos(t * 0.0005) * 0.3 };
      const tx = 6 - g.y * 22;
      const ty = g.x * 30;
      this.rx.set(+(this.rx() + (tx - this.rx()) * 0.08).toFixed(2));
      this.ry.set(+(this.ry() + (ty - this.ry()) * 0.08).toFixed(2));
    });
  }

  /** Touch: the diorama eases back into its idle drift once the finger lifts. */
  protected release(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.target = null;
  }

  protected tilt(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.target = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
  }
}
