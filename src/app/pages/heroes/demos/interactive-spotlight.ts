import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

let uid = 0;

const BODY = 'M58 196 C56 176 74 164 118 158 L232 148 C292 106 364 84 452 82 C548 82 606 108 664 142 L724 152 C752 157 764 172 764 190 L764 200 C764 204 760 206 756 206 L672 206 A52 52 0 0 0 568 206 L246 206 A52 52 0 0 0 142 206 L66 206 C61 206 58 202 58 196 Z';
const GLASS = 'M290 144 C336 108 386 96 452 96 C520 96 568 114 612 144 Z';

@Component({
  selector: 'demo-interactive-spotlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'up($event)',
    '(pointerleave)': 'leave()',
    '[style.--sx.px]': 'sx()',
    '[style.--sy.px]': 'sy()',
    '[style.--sr.px]': 'sr()',
  },
  template: `
    <!-- base layer: showroom -->
    <div class="layer base" aria-hidden="true">
      <div class="floor"></div>
      <svg class="car" viewBox="0 0 820 270">
        <defs>
          <linearGradient [attr.id]="id + '-paint'" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#e9ebef" /><stop offset=".45" stop-color="#a7adb8" /><stop offset=".55" stop-color="#5b616c" /><stop offset="1" stop-color="#2a2e35" />
          </linearGradient>
          <linearGradient [attr.id]="id + '-glass'" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#1a1f28" /><stop offset=".6" stop-color="#3a4250" /><stop offset="1" stop-color="#0d1015" />
          </linearGradient>
        </defs>
        <ellipse cx="410" cy="232" rx="380" ry="16" fill="rgba(0,0,0,.55)" />
        <path [attr.d]="body" [attr.fill]="'url(#' + id + '-paint)'" />
        <path [attr.d]="glass" [attr.fill]="'url(#' + id + '-glass)'" />
        <path d="M150 170 C320 158 520 156 742 166" stroke="rgba(255,255,255,.55)" stroke-width="2" fill="none" />
        <path d="M724 160 h30" stroke="#ffe6b0" stroke-width="5" stroke-linecap="round" />
        <path d="M64 176 h18" stroke="#ff4d4d" stroke-width="5" stroke-linecap="round" />
        @for (x of wheels; track x) {
          <circle [attr.cx]="x" cy="206" r="44" fill="#121418" />
          <circle [attr.cx]="x" cy="206" r="30" fill="#2b2f36" stroke="#8b919c" stroke-width="2" />
          <circle [attr.cx]="x" cy="206" r="8" fill="#8b919c" />
        }
      </svg>
    </div>

    <!-- hidden layer: blueprint, revealed by the spotlight mask -->
    <div class="layer reveal" aria-hidden="true">
      <svg class="car bp" viewBox="0 0 820 270">
        <path [attr.d]="body" class="ln" />
        <path [attr.d]="glass" class="ln thin" />
        <g class="cells">
          @for (c of cells; track $index) {
            <rect [attr.x]="c" y="178" width="26" height="18" rx="2" />
          }
        </g>
        @for (x of wheels; track x) {
          <circle [attr.cx]="x" cy="206" r="44" class="ln" />
          <circle [attr.cx]="x" cy="206" r="20" class="ln motor" />
          <path [attr.d]="'M' + (x - 44) + ' 206h88M' + x + ' 162v88'" class="ln thin" />
        }
        <path d="M194 252 H620 M194 246 v12 M620 246 v12" class="dim" />
        <text x="407" y="266" text-anchor="middle">wheelbase 2,940 mm</text>
        <path d="M300 186 L250 120 H150" class="lead" /><text x="148" y="114">82 kWh structural pack</text>
        <path d="M620 206 L680 110 H760" class="lead" /><text x="684" y="104">rear motor · 250 kW</text>
        <path d="M194 206 L120 250 H40" class="lead" /><text x="40" y="244">front motor · 140 kW</text>
        <path d="M452 96 L470 40 H560" class="lead" /><text x="474" y="34">recycled-glass roof</text>
      </svg>
    </div>

    <div class="ring" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#">AUREL</a>
      <nav class="links" aria-label="Primary">
        <a href="#">E1</a><a href="#">Charging</a><a href="#">Ownership</a><a href="#">Configurator</a>
      </nav>
      <a class="cta-sm" href="#">Reserve E1</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">E1</a><a href="#" (click)="menu.set(false)">Charging</a>
          <a href="#" (click)="menu.set(false)">Ownership</a><a href="#" (click)="menu.set(false)">Reserve E1</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="tag">Aurel E1 · five-seat electric GT</p>
      <h1>Nothing to hide.<br /><span>Look closer.</span></h1>
      <p class="sub">610 km of range, a body you can repair with six bolts, and an 82 kWh pack built into the floor. <span class="hint-m">Move over the car to see inside.</span><span class="hint-t">Drag across the car to see inside.</span></p>
      <div class="ctas">
        <a class="btn primary" href="#">Reserve for €500</a>
        <a class="btn ghost" href="#">Book a test drive</a>
      </div>
    </section>

    <dl class="specs">
      <div><dt>Range, WLTP</dt><dd>610 km</dd></div>
      <div><dt>0–100 km/h</dt><dd>3.9 s</dd></div>
      <div><dt>10–80% charge</dt><dd>18 min</dd></div>
    </dl>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      --sx: -999px; --sy: -999px; --sr: 170px;
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #0d0f13; color: #eceef2; font-family: 'Oxanium', system-ui, sans-serif; cursor: crosshair;
      touch-action: pan-y pinch-zoom;
    }
    .layer { position: absolute; inset: 0; z-index: -2; }
    .base { background: radial-gradient(70% 60% at 60% 70%, #262a33 0%, #0d0f13 70%); }
    .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; background: linear-gradient(180deg, transparent, rgba(255,255,255,.03)); border-top: 1px solid rgba(255,255,255,.05); }
    .reveal { z-index: -1; background-color: #0b2a4a;
      background-image: linear-gradient(rgba(159,211,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(159,211,255,.14) 1px, transparent 1px);
      background-size: 24px 24px;
      -webkit-mask: radial-gradient(circle var(--sr) at var(--sx) var(--sy), #000 70%, transparent 100%);
      mask: radial-gradient(circle var(--sr) at var(--sx) var(--sy), #000 70%, transparent 100%); }
    .ring { position: absolute; z-index: -1; left: 0; top: 0; width: calc(var(--sr) * 2); height: calc(var(--sr) * 2); border-radius: 50%; pointer-events: none;
      transform: translate(calc(var(--sx) - var(--sr)), calc(var(--sy) - var(--sr))); box-shadow: inset 0 0 0 1px rgba(159,211,255,.35); }
    .car { position: absolute; right: -2%; bottom: 4%; width: min(78%, 900px); height: auto; }
    .bp .ln { fill: none; stroke: #9fd3ff; stroke-width: 1.5; }
    .bp .thin { stroke-width: .8; stroke-dasharray: 4 4; }
    .bp .motor { stroke: #ffd36b; stroke-width: 2; }
    .cells rect { fill: rgba(255,211,107,.18); stroke: #ffd36b; stroke-width: 1; }
    .dim { stroke: #9fd3ff; fill: none; }
    .lead { fill: none; stroke: #ffd36b; stroke-width: 1; }
    .bp text { font: 600 12px 'Oxanium', sans-serif; fill: #e6f3ff; }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 4.5cqi, 56px); cursor: default; }
    .logo { font-weight: 700; font-size: 21px; letter-spacing: .42em; text-decoration: none; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 14px; letter-spacing: .03em; }
    .links a, .sheet a { text-decoration: none; }
    .links a { color: rgba(236,238,242,.7); }
    .links a:hover { color: #9fd3ff; }
    .cta-sm { text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 10px 18px; border: 1px solid rgba(236,238,242,.35); clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
    .cta-sm:hover { background: #eceef2; color: #0d0f13; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border: 1px solid rgba(236,238,242,.3); background: none; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 1.5px; background: #eceef2; }
    .sheet { position: absolute; top: 78px; left: 16px; right: 16px; display: grid; padding: 6px; background: #161a21; border: 1px solid #2a303b; }
    .sheet a { padding: 12px 14px; font-size: 18px; letter-spacing: .06em; }

    .copy { position: relative; z-index: 2; padding: 10px clamp(18px, 4.5cqi, 56px) 0; max-width: 560px; pointer-events: none; }
    .copy a { pointer-events: auto; cursor: pointer; }
    .tag { font-size: 13px; color: #9fd3ff; letter-spacing: .04em; }
    h1 { font-weight: 700; font-size: clamp(32px, 6.2cqi, 76px); line-height: .98; letter-spacing: -0.02em; margin: 14px 0 16px; }
    h1 span { color: transparent; -webkit-text-stroke: 1.5px #eceef2; }
    .sub { font-size: clamp(14.5px, 1.6cqi, 17px); line-height: 1.6; max-width: 40ch; color: rgba(236,238,242,.72); }
    .hint-t { display: none; }
    @media (hover: none) { .hint-m { display: none; } .hint-t { display: inline; } }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 22px; letter-spacing: .02em; transition: background .2s, color .2s;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
    .btn.primary { background: #9fd3ff; color: #06223f; }
    .btn.primary:hover { background: #eceef2; }
    .btn.ghost { background: rgba(236,238,242,.1); }
    .btn.ghost:hover { background: rgba(236,238,242,.2); }

    .specs { position: relative; z-index: 2; display: flex; gap: clamp(18px, 4cqi, 48px); margin: auto 0 0; padding: 20px clamp(18px, 4.5cqi, 56px) 24px; pointer-events: none; }
    dt { font-size: 11.5px; color: rgba(236,238,242,.55); letter-spacing: .04em; }
    dd { margin: 2px 0 0; font-size: clamp(20px, 2.6cqi, 28px); font-weight: 600; }

    @container (max-width: 700px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .car { width: 120%; right: -30%; bottom: 16%; }
      .specs { flex-wrap: wrap; }
    }
  `],
})
export class InteractiveSpotlight {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  protected readonly id = 'aurel-' + ++uid;
  protected readonly body = BODY;
  protected readonly glass = GLASS;
  protected readonly wheels = [194, 620];
  protected readonly cells = Array.from({ length: 12 }, (_, i) => 236 + i * 28);
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly sx = signal(-999);
  protected readonly sy = signal(-999);
  protected readonly sr = signal(170);
  protected pointer: { x: number; y: number } | null = null;
  private x = 0;
  private y = 0;
  private lingerUntil = 0;

  constructor() {
    loadGoogleFonts('Oxanium:wght@400;600;700');
    const reduced = prefersReducedMotion();
    rafLoop(
      hostVisible(),
      (t) => {
        const w = this.host.clientWidth;
        const h = this.host.clientHeight;
        if (!this.x) {
          this.x = w * 0.7;
          this.y = h * 0.62;
        }
        const idle = reduced ? { x: w * 0.62, y: h * 0.66 } : { x: w * (0.62 + Math.sin(t * 0.0005) * 0.26), y: h * (0.64 + Math.cos(t * 0.0007) * 0.1) };
        if (this.lingerUntil && t > this.lingerUntil) {
          this.pointer = null;
          this.lingerUntil = 0;
        }
        const target = this.pointer ?? idle;
        this.x += (target.x - this.x) * 0.14;
        this.y += (target.y - this.y) * 0.14;
        this.sx.set(Math.round(this.x));
        this.sy.set(Math.round(this.y));
        this.sr.set(Math.round(Math.max(120, Math.min(200, w * 0.16))));
      },
      true,
    );
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    this.lingerUntil = 0;
  }

  /** Touch: keep the spot where the finger lifted for a moment, then resume the idle sweep. */
  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' && this.pointer) this.lingerUntil = performance.now() + 1400;
  }

  protected leave(): void {
    if (!this.lingerUntil) this.pointer = null;
  }
}
