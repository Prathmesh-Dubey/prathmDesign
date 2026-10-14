import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { canvasStage, CanvasState, HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hub?: string;
}

const HUBS = ['Rotterdam', 'Singapore', 'Shanghai', 'Los Angeles', 'Santos', 'Durban', 'Jebel Ali'];

@Component({
  selector: 'demo-interactive-constellation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'down($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'pointer = null',
    '(pointerleave)': 'pointer = null',
  },
  template: `
    <canvas #cv class="net" aria-hidden="true"></canvas>
    <div class="fade" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>Meridian</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Platform</a><a href="#">Customers</a><a href="#">Data</a><a href="#">Company</a>
      </nav>
      <a class="cta-sm" href="#">Request access</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Platform</a><a href="#" (click)="menu.set(false)">Customers</a>
          <a href="#" (click)="menu.set(false)">Data</a><a href="#" (click)="menu.set(false)">Request access</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="live"><span></span>Live · 2.3M containers tracked right now</p>
      <h1>See every shipment before it's late.</h1>
      <p class="sub">Meridian links 41,000 carriers, ports and warehouses into one live network, then flags delays up to nine days ahead.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Request access</a>
        <a class="btn ghost" href="#">See a live demo</a>
      </div>
      <p class="hint"><span class="hint-m">Move to connect nearby nodes · click to send a pulse</span><span class="hint-t">Drag to connect nearby nodes · tap to send a pulse</span></p>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #f2f5f4; color: #0d2b3e; font-family: 'Sora', system-ui, sans-serif;
      touch-action: pan-y pinch-zoom;
    }
    .net { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -2; }
    .fade { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: linear-gradient(90deg, rgba(242,245,244,.96) 0%, rgba(242,245,244,.75) 38%, rgba(242,245,244,0) 62%); }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 20px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 9px; font-weight: 600; font-size: 19px; letter-spacing: -0.02em; text-decoration: none; }
    .logo svg { width: 24px; height: 24px; fill: none; stroke: #00857a; stroke-width: 1.8; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 14px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { color: #3c5666; }
    .links a:hover { color: #00857a; }
    .cta-sm { text-decoration: none; font-weight: 600; font-size: 13.5px; padding: 10px 16px; border-radius: 10px; background: #0d2b3e; color: #fff; }
    .cta-sm:hover { background: #00857a; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 10px; border: 1px solid #c9d4d2; background: #fff; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #0d2b3e; }
    .sheet { position: absolute; top: 74px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 14px; background: #fff; box-shadow: 0 24px 50px -24px rgba(13,43,62,.35); }
    .sheet a { padding: 11px 12px; border-radius: 8px; }
    .sheet a:hover { background: #eef3f2; }

    .copy { position: relative; z-index: 2; margin: auto 0; padding: 0 clamp(18px, 4.5cqi, 56px) 44px; max-width: 620px; pointer-events: none; }
    .copy a { pointer-events: auto; }
    .live { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 12px; border-radius: 999px; background: #fff; box-shadow: 0 0 0 1px #dde5e3; }
    .live span { width: 8px; height: 8px; border-radius: 50%; background: #00857a; animation: pulse 1.8s ease-out infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0,133,122,.5); } 100% { box-shadow: 0 0 0 9px rgba(0,133,122,0); } }
    h1 { font-weight: 600; font-size: clamp(36px, 6cqi, 72px); line-height: 1.02; letter-spacing: -0.045em; margin: 20px 0 18px; max-width: 13ch; }
    .sub { font-size: clamp(15px, 1.65cqi, 17.5px); line-height: 1.6; color: #3c5666; max-width: 44ch; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 22px; border-radius: 12px; transition: background .2s, transform .2s; }
    .btn.primary { background: #00857a; color: #fff; }
    .btn.primary:hover { background: #006b62; transform: translateY(-2px); }
    .btn.ghost { background: #fff; box-shadow: inset 0 0 0 1px #c9d4d2; }
    .btn.ghost:hover { box-shadow: inset 0 0 0 1px #0d2b3e; }
    .hint { margin-top: 18px; font-size: 12.5px; color: #6c8290; }
    .hint-t { display: none; }
    @media (hover: none) { .hint-m { display: none; } .hint-t { display: inline; } }

    @container (max-width: 700px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .fade { background: linear-gradient(180deg, rgba(242,245,244,.4) 0%, rgba(242,245,244,.92) 45%, rgba(242,245,244,.92) 100%); }
    }
  `],
})
export class InteractiveConstellation {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly cv = viewChild<ElementRef<HTMLCanvasElement>>('cv');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected pointer: { x: number; y: number } | null = null;
  private nodes: Node[] = [];
  private pulses: { x: number; y: number; r: number }[] = [];
  /** ms since the last pointer activity; drives the ambient hub pulses for touch / idle visitors */
  private idle = 0;
  private readonly stage = canvasStage({
    canvas: this.cv,
    visible: hostVisible(),
    resize: (s) => this.setup(s),
    draw: (s, t, dt) => this.draw(s, t, dt),
  });

  constructor() {
    loadGoogleFonts('Sora:wght@400;600');
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    this.idle = 0;
    this.stage.redraw();
  }

  protected down(e: PointerEvent): void {
    this.move(e);
    if ((e.target as HTMLElement).closest('a, button')) return;
    const r = this.host.getBoundingClientRect();
    this.burst(e.clientX - r.left, e.clientY - r.top);
  }

  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.pointer = null;
  }

  private burst(x: number, y: number, force = 1.6): void {
    this.pulses.push({ x, y, r: 0 });
    for (const n of this.nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 220) {
        n.vx += (dx / d) * (1 - d / 220) * force;
        n.vy += (dy / d) * (1 - d / 220) * force;
      }
    }
  }

  private setup({ w, h }: CanvasState): void {
    const count = Math.round(Math.min(150, Math.max(50, (w * h) / 5200)));
    const old = this.nodes;
    this.nodes = Array.from({ length: count }, (_, i) => {
      const prev = old[i];
      return prev
        ? { ...prev, x: Math.min(prev.x, w), y: Math.min(prev.y, h) }
        : {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            hub: i < HUBS.length ? HUBS[i] : undefined,
          };
    });
    // keep hubs on the right-hand side, away from the copy
    this.nodes.forEach((n, i) => {
      if (n.hub && !old[i]) {
        n.x = w * (0.55 + ((i * 0.37) % 0.4));
        n.y = h * (0.18 + ((i * 0.53) % 0.7));
      }
    });
  }

  private draw({ ctx, w, h }: CanvasState, t: number, dt: number): void {
    const k = dt / 16;
    // with no pointer (touch, or the cursor elsewhere) a random hub sends a soft pulse every few seconds
    this.idle += dt;
    if (!this.pointer && this.idle > 3800) {
      this.idle = 0;
      const hubs = this.nodes.filter((n) => n.hub);
      const hub = hubs[Math.floor(Math.random() * hubs.length)];
      if (hub) this.burst(hub.x, hub.y, 0.6);
    }
    const link = Math.min(150, Math.max(100, w * 0.11));
    for (const n of this.nodes) {
      n.x += n.vx * k;
      n.y += n.vy * k;
      n.vx *= n.hub ? 0.96 : 0.995;
      n.vy *= n.hub ? 0.96 : 0.995;
      if (Math.abs(n.vx) < 0.05 && !n.hub) n.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(n.vy) < 0.05 && !n.hub) n.vy += (Math.random() - 0.5) * 0.02;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));
    }
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    const ns = this.nodes;
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const dx = ns[i].x - ns[j].x;
        const dy = ns[i].y - ns[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < link * link) {
          const a = 1 - Math.sqrt(d2) / link;
          ctx.strokeStyle = `rgba(13,43,62,${(a * 0.22).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(ns[i].x, ns[i].y);
          ctx.lineTo(ns[j].x, ns[j].y);
          ctx.stroke();
        }
      }
    }
    const p = this.pointer;
    if (p) {
      const reach = link * 1.5;
      for (const n of ns) {
        const d = Math.hypot(n.x - p.x, n.y - p.y);
        if (d < reach) {
          ctx.strokeStyle = `rgba(0,133,122,${((1 - d / reach) * 0.8).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
          n.vx += ((p.x - n.x) / d) * 0.004 * k;
          n.vy += ((p.y - n.y) / d) * 0.004 * k;
        }
      }
      ctx.fillStyle = '#00857a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const n of ns) {
      if (n.hub) continue;
      ctx.fillStyle = 'rgba(13,43,62,.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = '600 11px Sora, system-ui, sans-serif';
    for (const n of ns) {
      if (!n.hub) continue;
      const pr = 10 + ((t * 0.02 + n.x) % 18);
      ctx.strokeStyle = `rgba(0,133,122,${(1 - (pr - 10) / 18) * 0.5})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#00857a';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0d2b3e';
      ctx.fillText(n.hub, n.x + 10, n.y - 8);
    }
    this.pulses = this.pulses.filter((q) => q.r < 260);
    for (const q of this.pulses) {
      q.r += 4 * k;
      ctx.strokeStyle = `rgba(0,133,122,${(1 - q.r / 260) * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
