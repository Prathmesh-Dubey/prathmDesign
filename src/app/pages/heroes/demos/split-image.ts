import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

let uid = 0;

@Component({
  selector: 'demo-split-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <section class="text">
      <header class="nav">
        <a class="logo" href="#">Okonkwo <span>&amp; Daughters</span></a>
        <nav class="links" aria-label="Primary">
          <a href="#">Shop coffee</a><a href="#">Subscriptions</a><a href="#">Wholesale</a>
        </nav>
        <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">Menu</button>
        @if (menu()) {
          <nav class="sheet" aria-label="Mobile">
            <a href="#" (click)="menu.set(false)">Shop coffee</a><a href="#" (click)="menu.set(false)">Subscriptions</a>
            <a href="#" (click)="menu.set(false)">Wholesale</a><a href="#" (click)="menu.set(false)">Visit the roastery</a>
          </nav>
        }
      </header>

      <div class="copy">
        <h1>Roasted on Tuesday. In your cup by Thursday.</h1>
        <p class="sub">Small-lot beans from farms we know by name in Ethiopia, Rwanda and Colombia, roasted in Peckham and posted free over £25.</p>
        <div class="grind" role="radiogroup" aria-label="Grind">
          @for (g of grinds; track g) {
            <button type="button" role="radio" [attr.aria-checked]="grind() === g" [class.on]="grind() === g" (click)="grind.set(g)">{{ g }}</button>
          }
        </div>
        <div class="ctas">
          <a class="btn primary" href="#">Subscribe · {{ grind().toLowerCase() }} · from £9.50</a>
          <a class="btn link" href="#">Shop single origins</a>
        </div>
      </div>
    </section>

    <section class="media">
      <div class="clip">
        <img [src]="img" alt="Okonkwo & Daughters roastery photograph" />
        <div class="wash" aria-hidden="true"></div>
      </div>
      <a class="basket" href="#">Basket <b>0</b></a>
      <svg class="badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs><path [attr.id]="pid" d="M60 60m-44 0a44 44 0 1 0 88 0a44 44 0 1 0-88 0" /></defs>
        <circle cx="60" cy="60" r="58" />
        <text><textPath [attr.href]="'#' + pid">FRESH EVERY TUESDAY · PECKHAM SE15 · </textPath></text>
        <path class="bean" d="M60 44c9 0 14 7 14 16s-5 16-14 16-14-7-14-16 5-16 14-16zm0 4c-2 6 2 10 0 24" />
      </svg>
      <article class="lot">
        <p class="lot-k">This month's lot</p>
        <h2>Konga, Yirgacheffe</h2>
        <p>Washed · 1,950 m · bergamot, white peach, jasmine</p>
        <span class="price">£12.80 / 250 g</span>
      </article>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: grid; grid-template-columns: 1fr 1fr; min-height: 100%;
      container-type: inline-size; overflow: hidden; background: #f5b700; color: #1d130c; font-family: 'Onest', system-ui, sans-serif;
    }
    .text { display: flex; flex-direction: column; padding: 22px clamp(18px, 4cqi, 52px) 40px; position: relative; z-index: 2; }
    .nav { position: relative; display: flex; align-items: center; gap: 24px; }
    .logo { font-family: 'Gloock', serif; font-size: 21px; text-decoration: none; white-space: nowrap; }
    .logo span { font-style: italic; }
    .links { display: flex; gap: 20px; margin-left: auto; font-size: 14px; font-weight: 500; }
    .links a, .sheet a { text-decoration: none; }
    .links a { border-bottom: 1.5px solid transparent; transition: border-color .2s; }
    .links a:hover { border-color: #1d130c; }
    .burger { display: none; margin-left: auto; font: 600 13px 'Onest', sans-serif; padding: 8px 14px; border: 1.5px solid #1d130c; border-radius: 999px; background: none; cursor: pointer; }
    .sheet { position: absolute; top: 52px; left: 0; right: 0; display: grid; padding: 8px; background: #1d130c; color: #f5b700; border-radius: 16px; z-index: 5; }
    .sheet a { padding: 11px 12px; font-family: 'Gloock', serif; font-size: 20px; }

    .copy { margin: auto 0; padding-top: 30px; }
    h1 { font-family: 'Gloock', serif; font-weight: 400; font-size: clamp(36px, 5.6cqi, 72px); line-height: 1.02; letter-spacing: -0.02em; max-width: 12ch; }
    .sub { margin-top: 20px; max-width: 40ch; font-size: clamp(15px, 1.6cqi, 17px); line-height: 1.6; color: #3d2a1c; }
    .grind { display: inline-flex; gap: 4px; margin-top: 26px; padding: 4px; border-radius: 999px; background: rgba(29,19,12,.1); }
    .grind button { border: 0; background: transparent; font: 500 13.5px 'Onest', sans-serif; padding: 8px 14px; border-radius: 999px; cursor: pointer; transition: background .2s, color .2s; }
    .grind button.on { background: #1d130c; color: #f5b700; }
    @media (pointer: coarse) { .grind button { min-height: 40px; } .btn.link { padding: 12px 0; } }
    .ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 16px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; }
    .btn.primary { padding: 15px 22px; border-radius: 999px; background: #1d130c; color: #fff4d6; transition: transform .2s; }
    .btn.primary:hover { transform: translateY(-2px); }
    .btn.link { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1.5px; }

    .media { position: relative; min-height: 320px; }
    .clip { position: absolute; inset: 0; overflow: hidden; background: #6b3f1f; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: sepia(.35) saturate(1.1) contrast(1.05); transition: transform 1.2s cubic-bezier(.2,.8,.2,1); }
    .clip:hover img { transform: scale(1.04); }
    .wash { position: absolute; inset: 0; background: linear-gradient(200deg, rgba(29,19,12,.15), rgba(29,19,12,.55)); }
    .basket { position: absolute; top: 20px; right: 20px; z-index: 2; display: inline-flex; gap: 8px; align-items: center; text-decoration: none; font-size: 14px; font-weight: 600; color: #1d130c; padding: 8px 8px 8px 14px; border-radius: 999px; background: #fff4d6; }
    .basket b { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #f5b700; font-size: 12px; }
    .badge { position: absolute; left: -60px; top: 34%; width: 120px; height: 120px; z-index: 3; animation: spin 18s linear infinite; }
    .badge circle { fill: #1d130c; }
    .badge text { font: 600 10.5px 'Onest', sans-serif; letter-spacing: .14em; fill: #f5b700; }
    .badge .bean { fill: #f5b700; stroke: #1d130c; stroke-width: 2; animation: spin 18s linear infinite reverse; transform-origin: 60px 60px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .lot { position: absolute; left: 24px; right: 24px; bottom: 24px; z-index: 2; max-width: 340px; margin-left: auto; padding: 18px 20px; border-radius: 18px; background: #fff4d6; box-shadow: 0 24px 50px -24px rgba(0,0,0,.6); }
    .lot-k { font-size: 12px; color: #8a5a2b; }
    .lot h2 { font-family: 'Gloock', serif; font-weight: 400; font-size: 24px; margin: 4px 0; }
    .lot p:not(.lot-k) { font-size: 13.5px; color: #3d2a1c; }
    .price { display: inline-block; margin-top: 10px; font-weight: 700; font-size: 14px; }

    @container (max-width: 760px) {
      :host { grid-template-columns: 1fr; }
      .links { display: none; }
      .burger { display: block; }
      .media { min-height: 300px; }
      .badge { left: auto; right: 20px; top: -40px; width: 96px; height: 96px; }
      .copy { padding-bottom: 30px; }
    }
    @container (max-width: 400px) {
      .btn.primary { font-size: 14px; padding: 14px 18px; }
    }
  `],
})
export class SplitImage {
  protected readonly img = photo('okonkwo-roastery', 1000, 1200);
  protected readonly pid = 'od-ring-' + ++uid;
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly grinds = ['Whole bean', 'Filter', 'Espresso'];
  protected readonly grind = signal('Whole bean');

  constructor() {
    loadGoogleFonts('Gloock', 'Onest:wght@400;500;600;700');
  }
}
