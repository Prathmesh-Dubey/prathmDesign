import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { canvasStage, CanvasState, HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const CELL = 5;

@Component({
  selector: 'demo-liquid-canvas-metaballs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'leave()',
    '(pointerleave)': 'leave()',
  },
  template: `
    <canvas #cv class="lava" aria-hidden="true"></canvas>

    <header class="nav">
      <a class="logo" href="#">Lowtide<sup>26</sup></a>
      <nav class="links" aria-label="Primary">
        <a href="#">Lineup</a><a href="#">Tickets</a><a href="#">Getting there</a><a href="#">FAQ</a>
      </nav>
      <a class="cta-sm" href="#">Buy tickets</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        {{ menu() ? 'Close' : 'Menu' }}
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Lineup</a><a href="#" (click)="menu.set(false)">Tickets</a>
          <a href="#" (click)="menu.set(false)">Getting there</a><a href="#" (click)="menu.set(false)">FAQ</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="when">7—9 August 2026 · Walpole Bay, Margate</p>
      <h1>Three days<br />of sound<br />by the sea.</h1>
      <div class="row">
        <div class="ctas">
          <a class="btn primary" href="#">Weekend pass · £149</a>
          <a class="btn ghost" href="#">See the lineup</a>
        </div>
        <ul class="lineup" aria-label="Headliners">
          <li>Floating Points</li><li>Kokoroko</li><li>Yaeji</li><li>Jockstrap</li><li>+ 46 more</li>
        </ul>
      </div>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #f2421b; color: #2a0a06; font-family: 'Space Mono', ui-monospace, monospace;
      touch-action: pan-y pinch-zoom;
    }
    .lava { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .nav { position: relative; z-index: 2; display: flex; align-items: center; gap: 26px; padding: 20px clamp(18px, 4cqi, 48px); }
    .logo { font-family: 'Bowlby One', sans-serif; font-size: 24px; text-decoration: none; letter-spacing: -0.01em; }
    .logo sup { font-family: 'Space Mono', monospace; font-size: 11px; margin-left: 3px; }
    .links { display: flex; gap: 22px; margin-left: auto; font-size: 13px; text-transform: lowercase; }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { text-decoration: underline; text-underline-offset: 4px; }
    .cta-sm { text-decoration: none; font-size: 13px; font-weight: 700; padding: 9px 15px; background: #2a0a06; color: #ffe9b8; border-radius: 999px; }
    .burger { display: none; margin-left: auto; background: #2a0a06; color: #ffe9b8; border: 0; border-radius: 999px; padding: 9px 18px; font: 700 13px 'Space Mono', monospace; cursor: pointer; }
    .sheet { position: absolute; top: 70px; left: 18px; right: 18px; display: grid; padding: 8px; background: #2a0a06; color: #ffe9b8; border-radius: 18px; }
    .sheet a { padding: 12px 14px; font-family: 'Bowlby One', sans-serif; font-size: 20px; }

    .copy { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 6px clamp(18px, 4cqi, 48px) 34px; pointer-events: none; }
    .copy a { pointer-events: auto; }
    .when { font-size: 13px; font-weight: 700; }
    h1 { font-family: 'Bowlby One', sans-serif; font-weight: 400; font-size: clamp(38px, 10.5cqi, 128px); line-height: .88; letter-spacing: -0.02em; margin: 14px 0 26px; }
    .row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
    .ctas { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn { text-decoration: none; font-weight: 700; font-size: 14px; padding: 15px 22px; border-radius: 999px; transition: transform .2s; }
    .btn:hover { transform: translateY(-2px) rotate(-1deg); }
    .btn.primary { background: #2a0a06; color: #ffe9b8; }
    .btn.ghost { border: 2px solid #2a0a06; }
    .lineup { list-style: none; margin: 0; padding: 0; text-align: right; font-size: 13px; line-height: 1.6; }
    .lineup li:last-child { opacity: .7; }

    @container (max-width: 640px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .lineup { text-align: left; display: flex; flex-wrap: wrap; gap: 4px 12px; }
    }
  `],
})
export class LiquidCanvasMetaballs {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly cv = viewChild<ElementRef<HTMLCanvasElement>>('cv');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  private balls: Ball[] = [];
  private pointer = { x: 0, y: 0, r: 0, on: false };
  private off: HTMLCanvasElement | null = null;
  private img: ImageData | null = null;
  private readonly stage = canvasStage({
    canvas: this.cv,
    visible: hostVisible(),
    resize: (s) => this.setup(s),
    draw: (s, _t, dt) => this.draw(s, dt),
  });

  constructor() {
    loadGoogleFonts('Bowlby+One', 'Space+Mono:wght@400;700');
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer.x = e.clientX - r.left;
    this.pointer.y = e.clientY - r.top;
    this.pointer.on = true;
    this.stage.redraw();
  }

  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.pointer.on = false;
  }

  protected leave(): void {
    this.pointer.on = false;
  }

  private setup({ w, h }: CanvasState): void {
    const gw = Math.ceil(w / CELL);
    const gh = Math.ceil(h / CELL);
    this.off ??= document.createElement('canvas');
    this.off.width = gw;
    this.off.height = gh;
    this.img = new ImageData(gw, gh);
    const unit = Math.min(w, h) / 600;
    if (!this.balls.length) {
      const seeds = [
        [0.72, 0.3, 110], [0.86, 0.62, 90], [0.6, 0.78, 70], [0.95, 0.2, 60], [0.5, 0.5, 46],
        [0.78, 0.88, 80], [0.3, 0.9, 54], [0.66, 0.12, 40], [0.9, 0.95, 64],
      ];
      this.balls = seeds.map(([x, y, r], i) => ({
        x: x * w, y: y * h, r,
        vx: Math.cos(i * 2.1) * 0.035, vy: Math.sin(i * 1.7) * 0.035,
      }));
    }
    this.balls.forEach((b, i) => (b.r = [110, 90, 70, 60, 46, 80, 54, 40, 64][i] * Math.max(0.55, unit)));
  }

  private draw({ ctx, w, h }: CanvasState, dt: number): void {
    const img = this.img;
    const off = this.off;
    if (!img || !off) return;
    for (const b of this.balls) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < w * 0.25 || b.x > w + 20) b.vx *= -1;
      if (b.y < -20 || b.y > h + 20) b.vy *= -1;
      b.x = Math.min(w + 20, Math.max(w * 0.25, b.x));
      b.y = Math.min(h + 20, Math.max(-20, b.y));
    }
    const p = this.pointer;
    p.r += ((p.on ? Math.min(w, h) * 0.15 : 0) - p.r) * 0.12;
    const all = p.r > 2 ? [...this.balls, { x: p.x, y: p.y, r: p.r, vx: 0, vy: 0 }] : this.balls;

    const data = img.data;
    const gw = img.width;
    const gh = img.height;
    let i = 0;
    for (let gy = 0; gy < gh; gy++) {
      const y = gy * CELL + CELL / 2;
      for (let gx = 0; gx < gw; gx++) {
        const x = gx * CELL + CELL / 2;
        let f = 0;
        for (let k = 0; k < all.length; k++) {
          const b = all[k];
          const dx = x - b.x;
          const dy = y - b.y;
          f += (b.r * b.r) / (dx * dx + dy * dy + 1);
        }
        const a = Math.min(1, Math.max(0, (f - 0.92) / 0.16));
        const core = Math.min(1, Math.max(0, (f - 2.3) / 0.3));
        // cream #ffe9b8 -> sun #ffc23a in the cores
        data[i] = 255;
        data[i + 1] = 233 - core * 39;
        data[i + 2] = 184 - core * 126;
        data[i + 3] = a * 255;
        i += 4;
      }
    }
    off.getContext('2d')?.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, gw * CELL, gh * CELL);
  }
}
