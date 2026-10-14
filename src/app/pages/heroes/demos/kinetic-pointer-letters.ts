import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChildren } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

interface Glyph {
  ch: string;
  line: number;
}

interface GlyphState {
  w: number;
  wd: number;
  y: number;
  glow: number;
}

const LINES = ['Light the', 'long night.'];

@Component({
  selector: 'demo-kinetic-pointer-letters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'pointer = null',
    '(pointerleave)': 'pointer = null',
    '[style.--gx.px]': 'glowX()',
    '[style.--gy.px]': 'glowY()',
  },
  template: `
    <div class="glow" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#">
        <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 13c-3-6-9-8-11-5s3 8 11 7c8 1 13-4 11-7s-8-1-11 5z" /><path d="M14 15v8" /></svg>
        Moth &amp; Lantern
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#">Games</a><a href="#">Studio</a><a href="#">Jobs</a><a href="#">Press kit</a>
      </nav>
      <a class="cta-sm" href="#">Wishlist on Steam</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Games</a><a href="#" (click)="menu.set(false)">Studio</a>
          <a href="#" (click)="menu.set(false)">Jobs</a><a href="#" (click)="menu.set(false)">Wishlist on Steam</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="game">Lanternfall · PC &amp; Switch · autumn 2026</p>
      <h1 aria-label="Light the long night.">
        @for (line of lines; track line; let li = $index) {
          <span class="line" aria-hidden="true">
            @for (g of glyphs; track $index; let gi = $index) {
              @if (g.line === li) {
                <span
                  #glyph
                  class="g"
                  [class.sp]="g.ch === ' '"
                  [style.font-variation-settings]="fvs(gi)"
                  [style.transform]="'translateY(' + (st()[gi]?.y ?? 0) + 'px)'"
                  [style.--glow]="st()[gi]?.glow ?? 0"
                >{{ g.ch === ' ' ? ' ' : g.ch }}</span>
              }
            }
          </span>
        }
      </h1>
      <p class="sub">A cosy-horror exploration game about a moth keeper on a drowned island. Keep the lanterns lit, and the island remembers you.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Wishlist on Steam</a>
        <a class="btn ghost" href="#">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.5v11l9-5.5z" /></svg>
          Watch the trailer
        </a>
      </div>
    </section>

    <p class="foot">Moth &amp; Lantern is nine people in Tallinn, Estonia.</p>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      --gx: 60%; --gy: 40%;
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #101612; color: #efe9db; font-family: 'Roboto Flex', system-ui, sans-serif;
      /* drag a finger along the headline to light it; vertical swipes still scroll */
      touch-action: pan-y pinch-zoom;
    }
    .glow { position: absolute; inset: 0; z-index: -1; background: radial-gradient(380px circle at var(--gx) var(--gy), rgba(249,215,126,.22), rgba(249,215,126,.05) 45%, transparent 70%); }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 10px; font-size: 17px; font-variation-settings: 'wght' 700, 'wdth' 120; text-decoration: none; }
    .logo svg { width: 28px; height: 28px; fill: #f9d77e; stroke: #f9d77e; stroke-width: 1.6; stroke-linecap: round; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 14.5px; font-variation-settings: 'wght' 450, 'wdth' 100; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .75; transition: opacity .2s, font-variation-settings .3s; }
    .links a:hover { opacity: 1; font-variation-settings: 'wght' 800, 'wdth' 100; }
    .cta-sm { text-decoration: none; font-size: 14px; font-variation-settings: 'wght' 650; padding: 10px 16px; border-radius: 6px; background: #f9d77e; color: #101612; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 6px; border: 1px solid rgba(239,233,219,.3); background: none; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 1.5px; background: #efe9db; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 10px; background: #1a231d; border: 1px solid #2c3a30; }
    .sheet a { padding: 12px 14px; font-size: 22px; font-variation-settings: 'wght' 800, 'wdth' 130; }

    .copy { position: relative; z-index: 2; margin: auto 0; padding: 0 clamp(18px, 4.5cqi, 56px) 20px; }
    .game { font-size: 13.5px; color: #f9d77e; font-variation-settings: 'wght' 500, 'wdth' 110; }
    h1 { margin: 14px 0 20px; font-weight: 400; font-size: clamp(40px, 11cqi, 150px); line-height: .9; letter-spacing: -0.02em; cursor: default; }
    .line { display: block; white-space: nowrap; }
    .g { display: inline-block; will-change: transform; color: color-mix(in srgb, #f9d77e calc(var(--glow) * 100%), #efe9db);
      text-shadow: 0 0 calc(var(--glow) * 40px) rgba(249,215,126, calc(var(--glow) * .6)); }
    .sub { max-width: 46ch; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; color: rgba(239,233,219,.75); font-variation-settings: 'wght' 380, 'opsz' 16; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; font-size: 15px; font-variation-settings: 'wght' 650, 'wdth' 105; padding: 14px 22px; border-radius: 6px; transition: background .2s, transform .2s; }
    .btn svg { width: 15px; height: 15px; fill: currentColor; }
    .btn.primary { background: #f9d77e; color: #101612; }
    .btn.primary:hover { transform: translateY(-2px); background: #ffe4a0; }
    .btn.ghost { border: 1px solid rgba(239,233,219,.35); }
    .btn.ghost:hover { border-color: #efe9db; }
    .foot { position: relative; z-index: 2; padding: 0 clamp(18px, 4.5cqi, 56px) 24px; font-size: 12.5px; color: rgba(239,233,219,.5); }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
    }
  `],
})
export class KineticPointerLetters {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly glyphEls = viewChildren<ElementRef<HTMLElement>>('glyph');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly lines = LINES;
  protected readonly glyphs: Glyph[] = LINES.flatMap((l, line) => [...l].map((ch) => ({ ch, line })));
  protected readonly st = signal<GlyphState[]>(this.glyphs.map(() => ({ w: 300, wd: 100, y: 0, glow: 0 })));
  protected readonly glowX = signal(700);
  protected readonly glowY = signal(260);
  protected pointer: { x: number; y: number } | null = null;
  private centers: { x: number; y: number }[] = [];
  private gx = 700;
  private gy = 260;

  constructor() {
    loadGoogleFonts('Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const measure = () => {
        const hr = this.host.getBoundingClientRect();
        const glyphIdx = this.glyphs.map((_, i) => i);
        const els = this.glyphEls();
        this.centers = glyphIdx.map((i) => {
          const r = els[i]?.nativeElement.getBoundingClientRect();
          return r ? { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2 } : { x: 0, y: 0 };
        });
      };
      const ro = new ResizeObserver(measure);
      ro.observe(this.host);
      document.fonts?.ready.then(measure);
      destroy.onDestroy(() => ro.disconnect());
    });
    rafLoop(hostVisible(), (t) => this.step(t));
  }

  protected fvs(i: number): string {
    const s = this.st()[i];
    return `'wght' ${s ? Math.round(s.w) : 300}, 'wdth' ${s ? Math.round(s.wd) : 100}, 'opsz' 144`;
  }

  /** Touch: once the finger lifts the lantern resumes its slow drift across the headline. */
  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.pointer = null;
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private step(t: number): void {
    if (!this.centers.length) return;
    const w = this.host.clientWidth;
    const target = this.pointer ?? {
      x: w * (0.5 + Math.sin(t * 0.0006) * 0.42),
      y: (this.centers[0]?.y ?? 200) + 40 + Math.sin(t * 0.0011) * 60,
    };
    this.gx += (target.x - this.gx) * 0.12;
    this.gy += (target.y - this.gy) * 0.12;
    this.glowX.set(Math.round(this.gx));
    this.glowY.set(Math.round(this.gy));
    const radius = Math.max(140, w * 0.22);
    const prev = this.st();
    this.st.set(
      this.centers.map((c, i) => {
        const d = Math.hypot(c.x - this.gx, c.y - this.gy);
        const k = Math.max(0, 1 - d / radius);
        const e = k * k * (3 - 2 * k);
        const p = prev[i];
        const nw = 300 + e * 650;
        const nwd = 100 + e * 40 - (1 - e) * 10;
        const ny = -e * 14;
        return {
          w: p.w + (nw - p.w) * 0.25,
          wd: p.wd + (nwd - p.wd) * 0.25,
          y: p.y + (ny - p.y) * 0.25,
          glow: +(p.glow + (e - p.glow) * 0.25).toFixed(3),
        };
      }),
    );
  }
}
