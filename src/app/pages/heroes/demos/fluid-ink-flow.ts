import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { canvasStage, CanvasState, HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface P {
  x: number;
  y: number;
  life: number;
  warm: boolean;
}

@Component({
  selector: 'demo-fluid-ink-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'pointer.on = false',
    '(pointerleave)': 'pointer.on = false',
  },
  template: `
    <canvas #cv class="ink" aria-hidden="true"></canvas>
    <div class="vignette" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#">Nightjar<span>Pictures</span></a>
      <nav class="links" aria-label="Primary">
        <a href="#">Films</a><a href="#">Commercials</a><a href="#">Directors</a><a href="#">Contact</a>
      </nav>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        {{ menu() ? 'Close' : 'Menu' }}
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Films</a><a href="#" (click)="menu.set(false)">Commercials</a>
          <a href="#" (click)="menu.set(false)">Directors</a><a href="#" (click)="menu.set(false)">Contact</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="est">Glasgow · Est. 2011</p>
      <h1>Stories shot<br /><em>after dark.</em></h1>
      <p class="sub">An independent production company making feature films, documentaries and the occasional thirty-second miracle.</p>
      <div class="ctas">
        <a class="btn primary" href="#">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.5v11l9-5.5z" /></svg>
          Watch the reel <span>2:14</span>
        </a>
        <a class="btn ghost" href="#">Our films</a>
      </div>
    </section>

    <footer class="credits">
      <span>In post — <i>The Low Road</i>, dir. Ailsa Mackay</span>
      <span class="laurel">Official Selection · Sundance 2026</span>
    </footer>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #0c0b10; color: #ece8df; font-family: 'Geist', system-ui, sans-serif;
      /* a finger drag stirs the ink; vertical swipes still scroll the page */
      touch-action: pan-y pinch-zoom;
    }
    .ink { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
    .vignette { position: absolute; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(80% 80% at 30% 50%, rgba(12,11,16,.75), transparent 70%); }
    .nav { position: relative; z-index: 2; display: flex; align-items: center; gap: 30px; padding: 24px clamp(18px, 5cqi, 64px); }
    .logo { font-family: 'Bodoni Moda', serif; font-size: 24px; font-weight: 600; font-style: italic; text-decoration: none; display: flex; align-items: baseline; gap: 8px; }
    .logo span { font-family: 'Geist', sans-serif; font-style: normal; font-size: 11px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; opacity: .7; }
    .links { display: flex; gap: 30px; margin-left: auto; font-size: 14px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .7; transition: opacity .2s; }
    .links a:hover { opacity: 1; }
    .burger { display: none; margin-left: auto; background: none; color: inherit; border: 0; padding: 0 4px; font-size: 14px; cursor: pointer; }
    .burger { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; }
    .sheet { position: absolute; top: 72px; left: 18px; right: 18px; display: grid; padding: 10px 0; background: #16141c; border: 1px solid #2a2733; }
    .sheet a { padding: 12px 18px; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 24px; }

    .copy { position: relative; z-index: 1; margin: auto 0; padding: 0 clamp(18px, 5cqi, 64px); max-width: 720px; }
    .est { font-size: 13px; color: #e8a33d; }
    h1 { font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: clamp(46px, 9cqi, 112px); line-height: .92; letter-spacing: -0.02em; margin: 14px 0 22px; }
    h1 em { font-style: italic; font-weight: 400; color: #f3d9a8; }
    .sub { max-width: 42ch; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; color: rgba(236,232,223,.72); }
    .ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }
    .btn { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; font-size: 15px; padding: 14px 22px; transition: background .25s, color .25s; }
    .btn svg { width: 16px; height: 16px; fill: currentColor; }
    .btn.primary { background: #ece8df; color: #0c0b10; }
    .btn.primary span { font-size: 12.5px; opacity: .6; }
    .btn.primary:hover { background: #e8a33d; }
    .btn.ghost { border: 1px solid rgba(236,232,223,.35); }
    .btn.ghost:hover { border-color: #ece8df; }

    .credits { position: relative; z-index: 1; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 26px clamp(18px, 5cqi, 64px); font-size: 12.5px; color: rgba(236,232,223,.55); border-top: 1px solid rgba(236,232,223,.1); margin-top: 36px; }
    .credits i { font-family: 'Bodoni Moda', serif; color: #ece8df; }
    .laurel { color: #e8a33d; }

    @container (max-width: 620px) {
      .links { display: none; }
      .burger { display: block; }
    }
  `],
})
export class FluidInkFlow {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly cv = viewChild<ElementRef<HTMLCanvasElement>>('cv');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly pointer = { x: 0, y: 0, on: false };
  private parts: P[] = [];
  private time = 0;

  constructor() {
    loadGoogleFonts('Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,600');
    canvasStage({
      canvas: this.cv,
      visible: hostVisible(),
      maxDpr: 1.5,
      resize: (s) => this.setup(s),
      draw: (s, _t, dt) => {
        if (prefersReducedMotion()) {
          for (let i = 0; i < 140; i++) this.step(s, 16, 0);
        } else this.step(s, dt, 0.055);
      },
    });
  }

  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.pointer.on = false;
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer.x = e.clientX - r.left;
    this.pointer.y = e.clientY - r.top;
    this.pointer.on = true;
  }

  private setup({ ctx, w, h }: CanvasState): void {
    ctx.fillStyle = '#0c0b10';
    ctx.fillRect(0, 0, w, h);
    const n = Math.round(Math.min(1400, (w * h) / 420));
    this.parts = Array.from({ length: n }, () => this.spawn(w, h));
  }

  private spawn(w: number, h: number): P {
    return { x: Math.random() * w, y: Math.random() * h, life: 80 + Math.random() * 220, warm: Math.random() < 0.12 };
  }

  private step({ ctx, w, h }: CanvasState, dt: number, fade: number): void {
    this.time += dt;
    const t = this.time;
    if (fade) {
      ctx.fillStyle = `rgba(12,11,16,${fade})`;
      ctx.fillRect(0, 0, w, h);
    }
    const speed = dt * 0.06;
    const p = this.pointer;
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    for (const warm of [false, true]) {
      ctx.beginPath();
      ctx.strokeStyle = warm ? 'rgba(232,163,61,.55)' : 'rgba(236,228,214,.32)';
      for (let i = 0; i < this.parts.length; i++) {
        const q = this.parts[i];
        if (q.warm !== warm) continue;
        const a =
          (Math.sin(q.x * 0.0042 + t * 0.00021) + Math.cos(q.y * 0.0051 - t * 0.00017) + Math.sin((q.x + q.y) * 0.0017)) * 1.25;
        let vx = Math.cos(a) * 1.4 + 0.35;
        let vy = Math.sin(a) * 1.4;
        if (p.on) {
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const d2 = dx * dx + dy * dy;
          const f = Math.exp(-d2 / 9000) * 4;
          vx += -dy * 0.02 * f;
          vy += dx * 0.02 * f;
        }
        const nx = q.x + vx * speed * 1.6;
        const ny = q.y + vy * speed * 1.6;
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(nx, ny);
        q.x = nx;
        q.y = ny;
        q.life -= dt * 0.06;
        if (q.life <= 0 || q.x < -10 || q.x > w + 10 || q.y < -10 || q.y > h + 10) Object.assign(q, this.spawn(w, h));
      }
      ctx.stroke();
    }
  }
}
