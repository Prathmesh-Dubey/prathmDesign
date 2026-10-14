import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-split-diagonal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'skew.set(0)',
    '(pointerleave)': 'skew.set(0)',
    '[style.--skew]': 'skew()',
  },
  template: `
    <div class="panel" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#">Achterberg Lund<span>LLP</span></a>
      <nav class="links" aria-label="Primary">
        <a href="#">Practice areas</a><a href="#">People</a><a href="#">Insights</a><a href="#">Offices</a>
      </nav>
      <a class="cta-sm" href="#">Speak to a partner</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Practice areas</a><a href="#" (click)="menu.set(false)">People</a>
          <a href="#" (click)="menu.set(false)">Insights</a><a href="#" (click)="menu.set(false)">Speak to a partner</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="offices">Amsterdam · Oslo · London</p>
        <h1>Counsel for the decisions you only make <em>once.</em></h1>
        <p class="sub">We advise founders, families and boards on mergers, disputes and succession, with a partner on every matter from the first call.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Speak to a partner</a>
          <a class="btn line" href="#">Our practice areas</a>
        </div>
      </section>

      <aside class="ledger" aria-labelledby="al-ledger">
        <h2 id="al-ledger">Selected matters, 2025</h2>
        <ol>
          @for (m of matters; track m.k) {
            <li>
              <b>{{ m.k }}</b>
              <span>{{ m.v }}</span>
            </li>
          }
        </ol>
        <p class="rank">Chambers Europe 2026 — Band 1, Corporate/M&amp;A</p>
      </aside>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      --skew: 0; position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #dfe1e3; color: #0e1a2b; font-family: 'Work Sans', system-ui, sans-serif;
      touch-action: pan-y pinch-zoom;
    }
    .panel { position: absolute; inset: 0; z-index: -1; background: radial-gradient(90% 120% at 0% 100%, #1b2c45, #0e1a2b 60%);
      clip-path: polygon(0 0, calc(64% + var(--skew) * 3%) 0, calc(50% - var(--skew) * 3%) 100%, 0 100%);
      transition: clip-path .6s cubic-bezier(.2,.8,.2,1); }

    .nav { position: relative; display: flex; align-items: center; gap: 26px; padding: 22px clamp(18px, 4.5cqi, 56px); color: #eef0f2; }
    .logo { font-family: 'EB Garamond', serif; font-size: 23px; font-weight: 500; text-decoration: none; display: flex; align-items: baseline; gap: 8px; letter-spacing: .01em; }
    .logo span { font-family: 'Work Sans', sans-serif; font-size: 10.5px; letter-spacing: .2em; color: #b8925a; }
    /* difference blending keeps the links legible over both the navy panel and the stone side */
    .links, .cta-sm { mix-blend-mode: difference; color: #eef0f2; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 14px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { text-underline-offset: 6px; }
    .links a:hover { text-decoration: underline; }
    .cta-sm { text-decoration: none; font-size: 13.5px; font-weight: 500; padding: 10px 16px; border: 1px solid currentColor; transition: background .2s, color .2s; }
    .cta-sm:hover { background: #eef0f2; color: #000; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border: 1px solid rgba(238,240,242,.4); background: none; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 1px; background: #eef0f2; }
    .sheet { position: absolute; z-index: 10; top: 78px; left: 16px; right: 16px; display: grid; padding: 6px 0; background: #eef0f2; color: #0e1a2b; box-shadow: 0 24px 50px -20px rgba(0,0,0,.5); }
    .sheet a { padding: 12px 18px; font-family: 'EB Garamond', serif; font-size: 21px; border-bottom: 1px solid #dfe1e3; }

    .body { flex: 1; display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(24px, 6cqi, 90px); align-items: center; padding: 10px clamp(18px, 4.5cqi, 56px) 44px; }
    .copy { color: #eef0f2; max-width: 560px; }
    .offices { font-size: 13px; color: #b8925a; letter-spacing: .04em; }
    h1 { font-family: 'EB Garamond', serif; font-weight: 400; font-size: clamp(38px, 6cqi, 74px); line-height: 1.02; letter-spacing: -0.015em; margin: 16px 0 20px; }
    h1 em { color: #d7b98a; }
    .sub { font-size: clamp(15px, 1.6cqi, 17px); line-height: 1.65; max-width: 42ch; color: rgba(238,240,242,.74); font-weight: 300; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
    .btn { text-decoration: none; font-size: 14.5px; font-weight: 500; padding: 14px 22px; transition: background .2s, color .2s; }
    .btn.primary { background: #b8925a; color: #0e1a2b; }
    .btn.primary:hover { background: #d7b98a; }
    .btn.line { border: 1px solid rgba(238,240,242,.4); }
    .btn.line:hover { border-color: #eef0f2; }

    .ledger { justify-self: end; width: min(100%, 360px); }
    .ledger h2 { font-family: 'Work Sans', sans-serif; font-size: 12.5px; font-weight: 600; letter-spacing: .06em; padding-bottom: 12px; border-bottom: 2px solid #0e1a2b; }
    .ledger ol { list-style: none; margin: 0; padding: 0; counter-reset: m; }
    .ledger li { counter-increment: m; display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; padding: 14px 0; border-bottom: 1px solid rgba(14,26,43,.18); transition: padding .3s; }
    .ledger li::before { content: counter(m, decimal-leading-zero); grid-row: span 2; font-size: 11px; color: #8a6a3c; padding-top: 6px; }
    .ledger li:hover { padding-left: 6px; }
    .ledger b { font-family: 'EB Garamond', serif; font-weight: 500; font-size: 26px; line-height: 1; }
    .ledger span { font-size: 13.5px; line-height: 1.45; color: #34425a; }
    .rank { margin-top: 14px; font-size: 12px; color: #5a6578; }

    @container (max-width: 760px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .panel { clip-path: none; }
      .body { padding-bottom: 0; }
      .ledger { justify-self: stretch; width: auto; margin: 0 calc(-1 * clamp(18px, 4.5cqi, 56px)); padding: 44px clamp(18px, 4.5cqi, 56px) 28px;
        background: #dfe1e3; clip-path: polygon(0 calc(26px + var(--skew) * 10px), 100% calc(26px - var(--skew) * 10px), 100% 100%, 0 100%); }
    }
  `],
})
export class SplitDiagonal {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly skew = signal(0);
  protected readonly matters = [
    { k: '€1.4bn', v: 'Advised Nordhavn Group on its sale to Vestas Capital Partners.' },
    { k: 'Won', v: 'Fjell Holding v. Statkraft before the Supreme Court of Norway.' },
    { k: '312', v: 'Family enterprises guided through succession since 2004.' },
  ];

  constructor() {
    loadGoogleFonts('EB+Garamond:ital,wght@0,400;0,500;1,400', 'Work+Sans:wght@300;400;500;600');
  }

  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.skew.set(0);
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    this.skew.set(+(((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
  }
}
