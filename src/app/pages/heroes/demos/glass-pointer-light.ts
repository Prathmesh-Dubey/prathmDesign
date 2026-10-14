import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

@Component({
  selector: 'demo-glass-pointer-light',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.paused]': '!visible()' },
  template: `
    <div class="orbs" aria-hidden="true">
      <span class="o1"></span><span class="o2"></span><span class="o3"></span>
      <span class="ring"><i></i></span>
    </div>

    <header class="nav">
      <a class="logo" href="#">Solace</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Ring</a><a href="#">Science</a><a href="#">Membership</a><a href="#">Support</a>
      </nav>
      <a class="cta-sm" href="#">Pre-order</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Ring</a><a href="#" (click)="menu.set(false)">Science</a>
          <a href="#" (click)="menu.set(false)">Membership</a><a href="#" (click)="menu.set(false)">Pre-order</a>
        </nav>
      }
    </header>

    <div class="scene">
      <section
        class="card"
        [class.lit]="lit()"
        (pointerdown)="light($event)"
        (pointermove)="light($event)"
        (pointerup)="up($event)"
        (pointercancel)="off()"
        (pointerleave)="off()"
        [style.--lx.%]="lx()"
        [style.--ly.%]="ly()"
        [style.--rx.deg]="rx()"
        [style.--ry.deg]="ry()"
      >
        <p class="kicker">Solace Ring 2 · titanium · 2.4 g</p>
        <h1>Sleep, measured gently.</h1>
        <p class="sub">Tracks sleep stages, HRV and skin temperature with no screen and no buzzing. Your morning score arrives as one sentence, not twelve charts.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Pre-order · €299</a>
          <a class="btn ghost" href="#">Find your size</a>
        </div>
        <dl class="metrics">
          <div><dt>Last night</dt><dd>86<small>/100</small></dd></div>
          <div><dt>HRV</dt><dd>62<small> ms</small></dd></div>
          <div><dt>Battery</dt><dd>7<small> days</small></dd></div>
        </dl>
      </section>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #07080d; color: #eef0f6; font-family: 'Manrope', system-ui, sans-serif;
    }
    .orbs { position: absolute; inset: 0; z-index: -1; }
    .orbs span { position: absolute; border-radius: 50%; }
    .o1 { width: 42cqi; aspect-ratio: 1; left: 8%; top: 20%; background: radial-gradient(circle, #0fb5a6, transparent 68%); animation: orbit 16s ease-in-out infinite alternate; }
    .o2 { width: 38cqi; aspect-ratio: 1; right: 6%; top: 30%; background: radial-gradient(circle, #ff7aa2, transparent 68%); animation: orbit 19s ease-in-out infinite alternate-reverse; }
    .o3 { width: 26cqi; aspect-ratio: 1; left: 44%; bottom: -8%; background: radial-gradient(circle, #ffb84d, transparent 68%); opacity: .8; animation: orbit 13s ease-in-out infinite alternate; }
    .ring { width: clamp(150px, 24cqi, 300px); aspect-ratio: 1; right: 9%; top: 9%; border-radius: 50%;
      background: conic-gradient(from 200deg, #6d7180, #f4f5f8, #9095a3, #3b3e48, #d9dbe2, #6d7180);
      -webkit-mask: radial-gradient(circle, transparent 55%, #000 56% 70%, transparent 71%); mask: radial-gradient(circle, transparent 55%, #000 56% 70%, transparent 71%);
      transform: rotateX(62deg) rotateZ(-20deg); animation: spin 14s linear infinite; filter: drop-shadow(0 20px 30px rgba(0,0,0,.6)); }
    @keyframes orbit { to { translate: 6cqi -4cqi; scale: 1.15; } }
    @keyframes spin { to { transform: rotateX(62deg) rotateZ(340deg); } }
    :host(.paused) .orbs span { animation-play-state: paused; }

    .nav { position: relative; z-index: 4; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 17px; letter-spacing: .28em; text-transform: uppercase; text-decoration: none; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 14px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { color: rgba(238,240,246,.7); }
    .links a:hover { color: #fff; }
    .cta-sm { text-decoration: none; font-size: 13.5px; font-weight: 700; padding: 10px 18px; border-radius: 999px; background: #eef0f6; color: #07080d; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(238,240,246,.25); background: rgba(255,255,255,.06); cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #eef0f6; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 22px; background: rgba(20,22,32,.7); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(20px); }
    .sheet a { padding: 12px 14px; font-size: 17px; }

    .scene { flex: 1; display: grid; place-items: center; padding: 0 clamp(14px, 4cqi, 56px) 34px; perspective: 1200px; }
    .card {
      --lx: 50%; --ly: 0%; --rx: 0deg; --ry: 0deg;
      position: relative; width: min(100%, 720px); padding: clamp(24px, 4.4cqi, 52px); border-radius: 30px; text-align: center;
      background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04));
      backdrop-filter: blur(28px) saturate(1.4); -webkit-backdrop-filter: blur(28px) saturate(1.4);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 40px 80px -40px rgba(0,0,0,.8);
      transform: rotateX(var(--rx)) rotateY(var(--ry)); transition: transform .4s cubic-bezier(.2,.8,.2,1);
      touch-action: pan-y pinch-zoom;
    }
    .card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: .6; transition: opacity .4s;
      background: radial-gradient(520px circle at var(--lx) var(--ly), rgba(255,255,255,.16), transparent 45%); }
    .card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
      background: radial-gradient(360px circle at var(--lx) var(--ly), rgba(255,255,255,.85), rgba(255,255,255,.12) 40%, rgba(255,255,255,.08));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
    .card.lit::before { opacity: 1; }
    .kicker { font-size: 13px; color: rgba(238,240,246,.7); }
    h1 { font-family: 'Syncopate', sans-serif; font-weight: 700; text-transform: uppercase; font-size: clamp(26px, 5cqi, 54px); line-height: 1.08; letter-spacing: .02em; margin: 16px auto 18px; max-width: 16ch; }
    .sub { max-width: 48ch; margin: 0 auto; font-size: clamp(15px, 1.6cqi, 17px); line-height: 1.6; color: rgba(238,240,246,.75); }
    .ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }
    .btn { position: relative; z-index: 1; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 999px; transition: transform .2s, background .2s; }
    .btn.primary { background: #eef0f6; color: #07080d; }
    .btn.primary:hover { transform: translateY(-2px); }
    .btn.ghost { background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
    .btn.ghost:hover { background: rgba(255,255,255,.14); }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); margin: 30px 0 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.1); }
    .metrics div { display: flex; flex-direction: column; gap: 2px; }
    .metrics div + div { border-left: 1px solid rgba(255,255,255,.1); }
    dt { font-size: 12px; color: rgba(238,240,246,.55); }
    dd { margin: 0; font-size: clamp(22px, 3cqi, 30px); font-weight: 300; letter-spacing: -0.03em; }
    dd small { font-size: 13px; color: rgba(238,240,246,.55); }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .ring { right: -6%; top: 4%; }
    }
  `],
})
export class GlassPointerLight {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();
  protected readonly lit = signal(false);
  protected readonly lx = signal(50);
  protected readonly ly = signal(0);
  protected readonly rx = signal(0);
  protected readonly ry = signal(0);
  private active = false;

  constructor() {
    loadGoogleFonts('Syncopate:wght@700', 'Manrope:wght@300;400;700');
    // idle light: with no pointer (touch, or the cursor elsewhere) the glint drifts slowly around the card
    rafLoop(this.visible, (t) => {
      if (this.active) return;
      const x = 0.5 + Math.sin(t * 0.00045) * 0.42;
      const y = 0.32 + Math.cos(t * 0.0006) * 0.34;
      this.lx.set(Math.round(x * 1000) / 10);
      this.ly.set(Math.round(y * 1000) / 10);
      this.ry.set(+((x - 0.5) * 2.4).toFixed(2));
      this.rx.set(+((0.5 - y) * 2.4).toFixed(2));
    });
  }

  protected light(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    this.active = true;
    this.lit.set(true);
    this.lx.set(Math.round(x * 1000) / 10);
    this.ly.set(Math.round(y * 1000) / 10);
    this.ry.set(+((x - 0.5) * 6).toFixed(2));
    this.rx.set(+((0.5 - y) * 6).toFixed(2));
  }

  /** Touch: lifting the finger hands the light back to the idle drift. */
  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.off();
  }

  protected off(): void {
    this.active = false;
    this.lit.set(false);
    this.rx.set(0);
    this.ry.set(0);
  }
}
