import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

interface GooBlob {
  x: number;
  y: number;
  r: number;
  c: string;
}

let uid = 0;
const CHAIN = [74, 58, 46, 38, 31, 25, 20, 16];
const CHAIN_COLORS = ['#ff5a36', '#ff6a38', '#ff7b3b', '#ff8d3e', '#ffa040', '#ffb441', '#ffc642', '#ffd843'];

@Component({
  selector: 'demo-liquid-gooey-cursor',
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
    <svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter [attr.id]="fid" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>

    <div class="goo" [style.filter]="'url(#' + fid + ')'" aria-hidden="true">
      @for (b of blobs(); track $index) {
        <span
          class="blob"
          [style.width.px]="b.r * 2"
          [style.height.px]="b.r * 2"
          [style.background]="b.c"
          [style.transform]="'translate(' + (b.x - b.r) + 'px,' + (b.y - b.r) + 'px)'"
        ></span>
      }
    </div>

    <header class="nav">
      <a class="logo" href="#" aria-label="Murmur home">
        <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="10" cy="14" r="7" /><circle cx="19" cy="12" r="5" /><circle cx="22" cy="20" r="3" /></svg>
        murmur
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#">Product</a><a href="#">Integrations</a><a href="#">Pricing</a><a href="#">Changelog</a>
      </nav>
      <a class="cta-sm" href="#">Start free</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Product</a><a href="#" (click)="menu.set(false)">Integrations</a>
          <a href="#" (click)="menu.set(false)">Pricing</a><a href="#" (click)="menu.set(false)">Start free</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="pill"><span class="dot"></span> New: live notes in Google Meet</p>
      <h1>Every meeting,<br />boiled down to<br /><em>what matters.</em></h1>
      <p class="sub">Murmur listens to your calls, writes the notes and files the follow-ups in Linear before you have closed the tab.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Try it on your next call</a>
        <a class="btn ghost" href="#">Watch the 2-min demo</a>
      </div>
      <p class="proof">Free for 20 meetings a month · SOC 2 Type II</p>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: radial-gradient(90% 80% at 75% 60%, #12302d 0%, #0a1b1a 60%, #071312 100%);
      color: #fdf3e7; font-family: 'Geist', system-ui, sans-serif; cursor: default;
      /* a finger drag steers the trail; vertical swipes still scroll the page */
      touch-action: pan-y pinch-zoom;
    }
    .defs { position: absolute; }
    .goo { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .blob { position: absolute; left: 0; top: 0; border-radius: 50%; will-change: transform; }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 9px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; text-decoration: none; letter-spacing: -0.02em; }
    .logo svg { width: 28px; height: 28px; fill: #ff7b3b; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; opacity: .78; transition: opacity .2s; }
    .links a:hover { opacity: 1; }
    .cta-sm { text-decoration: none; font-size: 14px; font-weight: 600; padding: 9px 16px; border-radius: 999px; border: 1px solid rgba(253,243,231,.3); transition: background .2s, color .2s; }
    .cta-sm:hover { background: #fdf3e7; color: #0a1b1a; }
    .burger { display: none; margin-left: auto; width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(253,243,231,.25); background: transparent; cursor: pointer; place-content: center; gap: 5px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: currentColor; }
    .sheet { position: absolute; top: 72px; right: 18px; display: grid; gap: 4px; padding: 10px; min-width: 190px; border-radius: 16px; background: #fdf3e7; color: #0a1b1a; box-shadow: 0 20px 40px -20px #000; }
    .sheet a { padding: 10px 12px; border-radius: 10px; opacity: 1; }
    .sheet a:hover { background: #f4e2cc; }

    .copy { position: relative; z-index: 2; margin: auto 0; padding: 8px clamp(18px, 5cqi, 56px) 52px; max-width: 640px; pointer-events: none; }
    .copy a { pointer-events: auto; }
    .pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 12px; border-radius: 999px; background: rgba(253,243,231,.08); border: 1px solid rgba(253,243,231,.16); backdrop-filter: blur(6px); }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: #ffd843; box-shadow: 0 0 0 4px rgba(255,216,67,.2); }
    h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(33px, 7.4cqi, 76px); line-height: .98; letter-spacing: -0.035em; margin: 22px 0 18px; text-shadow: 0 2px 30px rgba(7,19,18,.4); }
    h1 em { font-style: normal; color: #ffb441; }
    .sub { font-size: clamp(15px, 1.8cqi, 18px); line-height: 1.55; max-width: 44ch; color: rgba(253,243,231,.78); }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 22px; border-radius: 999px; transition: transform .2s, background .2s; }
    .btn.primary { background: #ff6a38; color: #1b0b05; }
    .btn.primary:hover { transform: translateY(-2px); background: #ff8d3e; }
    .btn.ghost { color: #fdf3e7; background: rgba(253,243,231,.08); border: 1px solid rgba(253,243,231,.2); }
    .btn.ghost:hover { background: rgba(253,243,231,.16); }
    .proof { margin-top: 22px; font-size: 13px; color: rgba(253,243,231,.55); }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .copy { margin: 0; padding-top: 20px; }
    }
  `],
})
export class LiquidGooeyCursor {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly destroy = inject(DestroyRef);
  protected readonly fid = 'murmur-goo-' + ++uid;
  protected readonly menu = signal(false);
  protected readonly blobs = signal<GooBlob[]>([]);
  protected readonly hash = preventHashLinks;
  private pointer: { x: number; y: number } | null = null;
  private w = 900;
  private h = 600;
  private chain: { x: number; y: number }[] = [];

  constructor() {
    loadGoogleFonts('Syne:wght@600;800');
    const visible = hostVisible();
    afterNextRender(() => {
      const ro = new ResizeObserver(() => {
        this.w = this.host.clientWidth;
        this.h = this.host.clientHeight;
        if (!this.chain.length) {
          const c = this.home(0);
          this.chain = CHAIN.map((_, i) => ({ x: c.x - i * 18, y: c.y + i * 10 }));
        }
        this.render(0);
      });
      ro.observe(this.host);
      this.destroy.onDestroy(() => ro.disconnect());
    });
    rafLoop(visible, (t) => this.step(t));
  }


  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  protected up(e: PointerEvent): void {
    // touch has no hover: once the finger lifts the trail melts back into the pool
    if (e.pointerType !== 'mouse') this.pointer = null;
  }

  protected leave(): void {
    this.pointer = null;
  }

  private home(t: number): { x: number; y: number } {
    const narrow = this.w < 680;
    const cx = narrow ? this.w * 0.62 : this.w * 0.74;
    const cy = narrow ? this.h * 0.84 : this.h * 0.56;
    return {
      x: cx + Math.cos(t * 0.0007) * Math.min(160, this.w * 0.14),
      y: cy + Math.sin(t * 0.0013) * Math.min(110, this.h * 0.14),
    };
  }

  private step(t: number): void {
    if (!this.chain.length) return;
    const target = this.pointer ?? this.home(t);
    this.chain.forEach((p, i) => {
      const goal = i === 0 ? target : this.chain[i - 1];
      const k = i === 0 ? 0.14 : 0.26;
      p.x += (goal.x - p.x) * k;
      p.y += (goal.y - p.y) * k;
    });
    this.render(t);
  }

  private render(t: number): void {
    const narrow = this.w < 680;
    const ax = narrow ? this.w * 0.62 : this.w * 0.76;
    const ay = narrow ? this.h * 0.86 : this.h * 0.58;
    const s = narrow ? 0.7 : 1;
    const pool: GooBlob[] = [
      { x: ax + Math.sin(t * 0.0009) * 26, y: ay + Math.cos(t * 0.0011) * 22, r: 108 * s, c: '#ff4f8b' },
      { x: ax + 90 * s + Math.sin(t * 0.0012 + 2) * 30, y: ay - 70 * s + Math.cos(t * 0.0008) * 24, r: 64 * s, c: '#ff5f7a' },
      { x: ax - 70 * s + Math.cos(t * 0.001 + 1) * 24, y: ay + 90 * s + Math.sin(t * 0.0014) * 20, r: 52 * s, c: '#ff6a6a' },
    ];
    const trail = this.chain.map((p, i) => ({ x: p.x, y: p.y, r: CHAIN[i] * s, c: CHAIN_COLORS[i] }));
    this.blobs.set([...pool, ...trail]);
  }
}
