import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

@Component({
  selector: 'demo-mesh-blobs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'pointer = false',
    '(pointerleave)': 'pointer = false',
    '[class.paused]': '!visible()',
    '[style.--px.px]': 'fx()',
    '[style.--py.px]': 'fy()',
  },
  template: `
    <div class="mesh" aria-hidden="true">
      <span class="b b1"></span><span class="b b2"></span><span class="b b3"></span><span class="b b4"></span><span class="b b5"></span>
      <span class="b follow"></span>
    </div>

    <header class="nav">
      <a class="logo" href="#"><span class="dot" aria-hidden="true"></span>Studio Pomelo</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Work</a><a href="#">Services</a><a href="#">Studio</a><a href="#">Journal</a>
      </nav>
      <a class="cta-sm" href="#">Start a project</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">{{ menu() ? 'Close' : 'Menu' }}</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Work</a><a href="#" (click)="menu.set(false)">Services</a>
          <a href="#" (click)="menu.set(false)">Studio</a><a href="#" (click)="menu.set(false)">Start a project</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="status"><span></span>Booking projects from March 2026</p>
      <h1>Brands with<br />a little zest.</h1>
      <p class="sub">An independent design studio in Lisbon making identities, websites and packaging for companies that would rather be remembered than liked.</p>
      <div class="ctas">
        <a class="btn primary" href="#">See the work</a>
        <a class="btn ghost" href="#">ola&#64;pomelo.studio</a>
      </div>
    </section>

    <footer class="recent">
      <span>Recently</span>
      <a href="#">Sumo Kombucha</a><a href="#">Vela Bikes</a><a href="#">Casa Azulejo</a><a href="#">Mareta Swim</a>
    </footer>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      --px: 0px; --py: 0px;
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #fff8f2; color: #1d1230; font-family: 'Hanken Grotesk', system-ui, sans-serif;
      touch-action: pan-y pinch-zoom;
    }
    .mesh { position: absolute; inset: 0; z-index: -1; filter: blur(60px) saturate(1.2); }
    .b { position: absolute; border-radius: 50%; mix-blend-mode: multiply; animation: float 22s ease-in-out infinite alternate; }
    .b1 { width: 46cqi; height: 46cqi; left: 46%; top: -6%; background: #ff8fab; }
    .b2 { width: 38cqi; height: 38cqi; left: 66%; top: 34%; background: #ffb347; animation-duration: 26s; animation-delay: -6s; }
    .b3 { width: 34cqi; height: 34cqi; left: 30%; top: 52%; background: #ffe066; animation-duration: 18s; animation-delay: -10s; }
    .b4 { width: 30cqi; height: 30cqi; left: 82%; top: -4%; background: #7bdff2; animation-duration: 24s; animation-delay: -3s; }
    .b5 { width: 26cqi; height: 26cqi; left: 10%; top: -12%; background: #cdb4ff; animation-duration: 28s; animation-delay: -14s; }
    .follow { width: 24cqi; height: 24cqi; left: 0; top: 0; background: #ff6f91; animation: none; opacity: .8;
      transform: translate(calc(var(--px) - 12cqi), calc(var(--py) - 12cqi)); }
    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-12cqi, 8cqi) scale(1.15); }
      66% { transform: translate(6cqi, 14cqi) scale(.9); }
      100% { transform: translate(-6cqi, -4cqi) scale(1.05); }
    }
    :host(.paused) .b { animation-play-state: paused; }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 10px; font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 18px; text-decoration: none; letter-spacing: -0.02em; }
    .dot { width: 22px; height: 22px; border-radius: 50%; background: conic-gradient(#ff6f91 0 25%, #ffb347 0 50%, #ffe066 0 75%, #7bdff2 0); }
    .links { display: flex; gap: 6px; margin-left: auto; font-size: 15px; font-weight: 500; }
    .links a, .sheet a { text-decoration: none; }
    .links a { padding: 8px 14px; border-radius: 999px; transition: background .2s; }
    .links a:hover { background: rgba(29,18,48,.07); }
    .cta-sm { text-decoration: none; font-weight: 600; font-size: 14.5px; padding: 11px 18px; border-radius: 999px; background: #1d1230; color: #fff8f2; transition: transform .25s cubic-bezier(.3,1.6,.5,1); }
    .cta-sm:hover { transform: rotate(-3deg) scale(1.05); }
    .burger { display: none; margin-left: auto; font: 600 14px 'Hanken Grotesk', sans-serif; padding: 10px 18px; border-radius: 999px; border: 0; background: #1d1230; color: #fff8f2; cursor: pointer; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 10px; border-radius: 28px; background: #1d1230; color: #fff8f2; }
    .sheet a { padding: 10px 14px; font-family: 'Unbounded', sans-serif; font-size: 26px; font-weight: 600; }

    .copy { position: relative; z-index: 2; margin: auto 0; padding: 0 clamp(18px, 4.5cqi, 56px); }
    .status { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 500; padding: 7px 14px; border-radius: 999px; background: rgba(255,255,255,.6); backdrop-filter: blur(6px); }
    .status span { width: 8px; height: 8px; border-radius: 50%; background: #2bb673; }
    h1 { font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: clamp(34px, 8.6cqi, 112px); line-height: .95; letter-spacing: -0.05em; margin: 22px 0 22px; }
    .sub { max-width: 46ch; font-size: clamp(15px, 1.7cqi, 18.5px); line-height: 1.55; color: #3b2d52; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15.5px; padding: 15px 24px; border-radius: 999px; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s; }
    .btn.primary { background: #1d1230; color: #fff8f2; }
    .btn.primary:hover { transform: translateY(-3px) rotate(-1.5deg); }
    .btn.ghost { background: rgba(255,255,255,.65); backdrop-filter: blur(6px); }
    .btn.ghost:hover { background: #fff; }

    .recent { position: relative; z-index: 2; display: flex; flex-wrap: wrap; gap: 8px 22px; align-items: baseline; padding: 22px clamp(18px, 4.5cqi, 56px) 26px; font-size: 14px; }
    .recent span { color: #6c5a85; }
    .recent a { text-decoration: none; font-weight: 600; }
    .recent a:hover { text-decoration: underline wavy #ff6f91; text-underline-offset: 5px; }
    @media (pointer: coarse) { .recent { row-gap: 0; } .recent a { padding: 10px 0; } }

    @container (max-width: 700px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .b1 { width: 80cqi; height: 80cqi; left: 30%; }
      .b3 { width: 60cqi; height: 60cqi; }
    }
  `],
})
export class MeshBlobs {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();
  protected readonly fx = signal(700);
  protected readonly fy = signal(260);
  private tx = 700;
  private ty = 260;
  /** true while a mouse hovers or a finger is down; otherwise the rose blob wanders on its own */
  protected pointer = false;

  constructor() {
    loadGoogleFonts('Unbounded:wght@600;700', 'Hanken+Grotesk:wght@400;500;600');
    rafLoop(this.visible, (t) => {
      if (!this.pointer) {
        const w = this.host.clientWidth;
        const h = this.host.clientHeight;
        this.tx = w * (0.62 + Math.sin(t * 0.00031) * 0.3);
        this.ty = h * (0.42 + Math.cos(t * 0.00043) * 0.3);
      }
      const x = this.fx() + (this.tx - this.fx()) * 0.04;
      const y = this.fy() + (this.ty - this.fy()) * 0.04;
      if (Math.abs(x - this.fx()) + Math.abs(y - this.fy()) > 0.2) {
        this.fx.set(Math.round(x * 10) / 10);
        this.fy.set(Math.round(y * 10) / 10);
      }
    });
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.tx = e.clientX - r.left;
    this.ty = e.clientY - r.top;
    this.pointer = true;
  }

  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.pointer = false;
  }
}
