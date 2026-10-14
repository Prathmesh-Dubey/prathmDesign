import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-fluid-flowing-gradient',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.paused]': '!visible()' },
  template: `
    <header class="nav">
      <a class="logo" href="#"><span aria-hidden="true">t</span>Tally</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Accounts</a><a href="#">Cards</a><a href="#">Invoicing</a><a href="#">Pricing</a>
      </nav>
      <a class="login" href="#">Log in</a>
      <a class="cta-sm" href="#">Open an account</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Accounts</a><a href="#" (click)="menu.set(false)">Cards</a>
          <a href="#" (click)="menu.set(false)">Invoicing</a><a href="#" (click)="menu.set(false)">Log in</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="badge"><b>4.10% AER</b> on savings pots, paid monthly</p>
        <h1>Money that keeps up with your business.</h1>
        <p class="sub">A free UK business account with instant invoicing, receipt matching and tax pots that fill themselves. FSCS protected up to £85,000.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Open an account in 8 minutes</a>
          <a class="btn quiet" href="#">Compare plans</a>
        </div>
        <p class="proof">Used by 61,000 sole traders and limited companies</p>
      </section>

      <div class="visual" aria-hidden="true">
        <div class="card">
          <div class="card-top"><span class="chip"></span><span class="brand">Tally</span></div>
          <p class="num">•••• 4417</p>
          <div class="card-bot"><span>Okafor Studio Ltd</span><span>09/29</span></div>
        </div>
        <div class="balance">
          <p class="lbl">Available</p>
          <p class="amt">£24,860<small>.12</small></p>
          <ul>
            <li><span>Invoice #0142 · Paid</span><b>+£3,200.00</b></li>
            <li><span>VAT pot</span><b>£4,972.02</b></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    @property --tl-a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
    @property --tl-x1 { syntax: '<percentage>'; inherits: false; initial-value: 18%; }
    @property --tl-y1 { syntax: '<percentage>'; inherits: false; initial-value: 22%; }
    @property --tl-x2 { syntax: '<percentage>'; inherits: false; initial-value: 82%; }
    @property --tl-y2 { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
    @property --tl-x3 { syntax: '<percentage>'; inherits: false; initial-value: 60%; }
    @property --tl-y3 { syntax: '<percentage>'; inherits: false; initial-value: 92%; }

    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      color: #0b2b26; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background:
        radial-gradient(42% 55% at var(--tl-x1) var(--tl-y1), rgba(140, 230, 196, .85), transparent 70%),
        radial-gradient(38% 50% at var(--tl-x2) var(--tl-y2), rgba(255, 214, 112, .75), transparent 70%),
        radial-gradient(50% 60% at var(--tl-x3) var(--tl-y3), rgba(255, 160, 128, .6), transparent 70%),
        conic-gradient(from var(--tl-a) at 65% 45%, #f3f8f1, #d6f2e7, #fdf0cf, #ffe0d3, #e7f1fb, #f3f8f1);
      animation: tl-drift 26s ease-in-out infinite alternate, tl-spin 48s linear infinite;
    }
    :host(.paused), :host(.paused) .card { animation-play-state: paused; }
    @keyframes tl-drift {
      0% { --tl-x1: 18%; --tl-y1: 22%; --tl-x2: 82%; --tl-y2: 30%; --tl-x3: 60%; --tl-y3: 92%; }
      33% { --tl-x1: 38%; --tl-y1: 70%; --tl-x2: 66%; --tl-y2: 12%; --tl-x3: 92%; --tl-y3: 70%; }
      66% { --tl-x1: 12%; --tl-y1: 52%; --tl-x2: 90%; --tl-y2: 64%; --tl-x3: 34%; --tl-y3: 18%; }
      100% { --tl-x1: 46%; --tl-y1: 14%; --tl-x2: 72%; --tl-y2: 86%; --tl-x3: 8%; --tl-y3: 80%; }
    }
    @keyframes tl-spin { to { --tl-a: 360deg; } }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 20px clamp(18px, 4.6cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 21px; letter-spacing: -0.03em; text-decoration: none; }
    .logo span { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: #0b2b26; color: #9ff0cf; font-size: 19px; padding-bottom: 3px; }
    .links { display: flex; gap: 6px; margin-left: 18px; font-size: 14.5px; font-weight: 500; }
    .links a, .sheet a, .login { text-decoration: none; }
    .links a { padding: 8px 12px; border-radius: 999px; transition: background .2s; }
    .links a:hover { background: rgba(255,255,255,.6); }
    .login { margin-left: auto; font-size: 14.5px; font-weight: 600; }
    .cta-sm { text-decoration: none; font-size: 14px; font-weight: 700; padding: 11px 18px; border-radius: 12px; background: #0b2b26; color: #fff; }
    .burger { display: none; margin-left: auto; width: 44px; height: 44px; border-radius: 12px; border: 0; background: rgba(255,255,255,.7); cursor: pointer; place-content: center; gap: 4px; }
    .burger span { display: block; width: 18px; height: 2px; border-radius: 2px; background: #0b2b26; }
    .sheet { position: absolute; top: 74px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 18px; background: rgba(255,255,255,.92); box-shadow: 0 24px 50px -28px rgba(11,43,38,.5); }
    .sheet a { padding: 12px 14px; font-weight: 600; border-radius: 12px; }

    .body { flex: 1; display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: clamp(24px, 4cqi, 56px); padding: 12px clamp(18px, 4.6cqi, 56px) 40px; }
    .badge { display: inline-block; font-size: 13px; padding: 7px 13px; border-radius: 999px; background: rgba(255,255,255,.65); }
    .badge b { color: #0f7a63; }
    h1 { font-weight: 800; font-size: clamp(36px, 6.2cqi, 72px); line-height: 1.02; letter-spacing: -0.045em; margin: 18px 0; max-width: 13ch; }
    .sub { font-size: clamp(15px, 1.6cqi, 17.5px); line-height: 1.6; max-width: 46ch; color: #2f4f49; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 15px 22px; border-radius: 14px; transition: transform .2s, box-shadow .2s; }
    .btn.primary { background: #0b2b26; color: #fff; box-shadow: 0 14px 30px -14px rgba(11,43,38,.7); }
    .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 20px 34px -14px rgba(11,43,38,.7); }
    .btn.quiet { background: rgba(255,255,255,.7); }
    .btn.quiet:hover { background: #fff; }
    .proof { margin-top: 20px; font-size: 13px; color: #4f6c66; }

    .visual { position: relative; justify-self: center; width: min(100%, 400px); aspect-ratio: 1 / .95; }
    .card {
      position: absolute; top: 4%; left: 0; width: 82%; aspect-ratio: 1.586; border-radius: 20px; padding: 22px; color: #fff;
      display: flex; flex-direction: column; justify-content: space-between;
      background: conic-gradient(from var(--tl-a) at 30% 40%, #0b2b26, #0f7a63, #2bb391, #0b2b26 60%, #12443c, #0b2b26);
      animation: tl-spin 18s linear infinite;
      transform: rotate(-8deg); box-shadow: 0 34px 60px -30px rgba(11,43,38,.8);
    }
    .card-top { display: flex; justify-content: space-between; align-items: center; }
    .chip { width: 38px; height: 28px; border-radius: 6px; background: linear-gradient(135deg, #f6d77a, #c99a2e); }
    .brand { font-weight: 800; font-size: 20px; letter-spacing: -0.03em; }
    .num { font-size: 18px; letter-spacing: .14em; }
    .card-bot { display: flex; justify-content: space-between; font-size: 12px; opacity: .85; }
    .balance { position: absolute; right: 0; bottom: 0; width: 72%; padding: 18px 20px; border-radius: 20px; background: rgba(255,255,255,.82); backdrop-filter: blur(12px); box-shadow: 0 30px 60px -34px rgba(11,43,38,.6); }
    .lbl { font-size: 12px; color: #4f6c66; }
    .amt { font-size: clamp(26px, 3.4cqi, 34px); font-weight: 800; letter-spacing: -0.04em; }
    .amt small { font-size: .55em; color: #4f6c66; }
    .balance ul { list-style: none; margin: 10px 0 0; padding: 0; display: grid; gap: 6px; font-size: 12.5px; }
    .balance li { display: flex; justify-content: space-between; gap: 10px; padding-top: 6px; border-top: 1px solid rgba(11,43,38,.08); }
    .balance li b { color: #0f7a63; white-space: nowrap; }

    @container (max-width: 760px) {
      .links, .login, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .visual { width: min(100%, 320px); }
    }
  `],
})
export class FluidFlowingGradient {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();

  constructor() {
    loadGoogleFonts('Plus+Jakarta+Sans:wght@400;500;600;700;800');
  }
}
