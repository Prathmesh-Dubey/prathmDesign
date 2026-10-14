import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-jumbotron-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.paused]': '!visible()' },
  template: `
    <div class="bg" aria-hidden="true">
      <img [src]="img" alt="" (load)="loaded.set(true)" [class.in]="loaded()" />
    </div>
    <div class="tint" aria-hidden="true"></div>
    <div class="stars" aria-hidden="true"></div>

    <header class="nav">
      <a class="logo" href="#">
        <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M4 22a11 11 0 0122 0z" /><path d="M15 11V5M10 7l2 4M20 7l-2 4" /></svg>
        <span>Mauna Sol<small>Observatory</small></span>
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#">Night tours</a><a href="#">Telescopes</a><a href="#">Visit</a><a href="#">Members</a>
      </nav>
      <a class="cta-sm" href="#">Book a tour</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Night tours</a><a href="#" (click)="menu.set(false)">Telescopes</a>
          <a href="#" (click)="menu.set(false)">Visit</a><a href="#" (click)="menu.set(false)">Book a tour</a>
        </nav>
      }
    </header>

    <section class="center">
      <p class="tonight"><span class="live"></span>Tonight · seeing 0.6″ · moon 12%</p>
      <h1>See the sky the way<br />astronomers do.</h1>
      <p class="sub">Guided night tours at 4,205 metres with a one-metre telescope, hot cocoa and a parka that actually fits.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Book tonight · $189</a>
        <a class="btn ghost" href="#">Plan your visit</a>
      </div>
    </section>

    <dl class="sky">
      <div><dt>Sunset</dt><dd>18:41</dd></div>
      <div><dt>Departs</dt><dd>17:30</dd></div>
      <div><dt>Summit</dt><dd>−2 °C</dd></div>
      <div><dt>Seats left</dt><dd>6 of 14</dd></div>
    </dl>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #070b16; color: #f2f0ea; font-family: 'Albert Sans', system-ui, sans-serif;
    }
    .bg { position: absolute; inset: 0; z-index: -3; overflow: hidden; }
    .bg img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15) brightness(.7); opacity: 0; transform: scale(1.12);
      transition: opacity 1.2s ease; animation: kenburns 32s ease-in-out infinite alternate; }
    .bg img.in { opacity: 1; }
    @keyframes kenburns { to { transform: scale(1.02) translate(-1.5%, 1%); } }
    :host(.paused) .bg img, :host(.paused) .stars { animation-play-state: paused; }
    .tint { position: absolute; inset: 0; z-index: -2;
      background:
        linear-gradient(180deg, rgba(7,11,22,.85) 0%, rgba(7,11,22,.35) 35%, rgba(7,11,22,.55) 70%, #070b16 100%),
        linear-gradient(120deg, rgba(25,38,92,.75), rgba(176,72,40,.35));
      mix-blend-mode: normal; }
    .stars { position: absolute; inset: -50% 0 0; z-index: -1; opacity: .8;
      background-image:
        radial-gradient(1px 1px at 10% 20%, #fff, transparent), radial-gradient(1px 1px at 30% 60%, #fff, transparent),
        radial-gradient(1.5px 1.5px at 50% 12%, #fff, transparent), radial-gradient(1px 1px at 70% 40%, #fff, transparent),
        radial-gradient(1px 1px at 85% 75%, #fff, transparent), radial-gradient(1.5px 1.5px at 92% 18%, #ffe9c4, transparent),
        radial-gradient(1px 1px at 20% 85%, #fff, transparent), radial-gradient(1px 1px at 62% 82%, #cfe0ff, transparent);
      background-size: 320px 320px; animation: drift 120s linear infinite; }
    @keyframes drift { to { transform: translateY(33%); } }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 20px clamp(18px, 4cqi, 52px); }
    .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo svg { width: 30px; height: 30px; fill: none; stroke: #f5b25c; stroke-width: 1.8; stroke-linecap: round; }
    .logo svg path:first-child { fill: #f5b25c; stroke: none; }
    .logo span { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: .02em; text-transform: uppercase; line-height: .9; }
    .logo small { display: block; font-family: 'Albert Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: .32em; opacity: .7; }
    .links { display: flex; gap: 28px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .82; }
    .links a:hover { opacity: 1; color: #f5b25c; }
    .cta-sm { text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 999px; background: rgba(242,240,234,.12); border: 1px solid rgba(242,240,234,.3); backdrop-filter: blur(8px); }
    .cta-sm:hover { background: #f2f0ea; color: #070b16; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(242,240,234,.35); background: rgba(7,11,22,.4); cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #f2f0ea; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 18px; background: rgba(7,11,22,.92); border: 1px solid rgba(242,240,234,.15); backdrop-filter: blur(10px); }
    .sheet a { padding: 12px 14px; font-family: 'Big Shoulders Display', sans-serif; font-weight: 700; font-size: 22px; text-transform: uppercase; }

    .center { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10px clamp(18px, 4cqi, 52px) 20px; }
    .tonight { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 7px 14px; border-radius: 999px; background: rgba(7,11,22,.5); border: 1px solid rgba(242,240,234,.15); }
    .live { width: 8px; height: 8px; border-radius: 50%; background: #7be0a0; box-shadow: 0 0 0 0 rgba(123,224,160,.6); animation: ping 2s ease-out infinite; }
    @keyframes ping { to { box-shadow: 0 0 0 10px rgba(123,224,160,0); } }
    h1 { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; text-transform: uppercase; font-size: clamp(36px, 9.6cqi, 124px); line-height: .88; letter-spacing: .005em; margin: 20px 0 18px; text-shadow: 0 6px 40px rgba(0,0,0,.5); }
    .sub { max-width: 46ch; font-size: clamp(15px, 1.8cqi, 18.5px); line-height: 1.55; color: rgba(242,240,234,.82); }
    .ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 15px 26px; border-radius: 999px; transition: transform .2s, background .2s; }
    .btn.primary { background: #f5b25c; color: #1a1205; }
    .btn.primary:hover { background: #ffc77d; transform: translateY(-2px); }
    .btn.ghost { border: 1px solid rgba(242,240,234,.4); background: rgba(7,11,22,.35); }
    .btn.ghost:hover { border-color: #f2f0ea; }

    .sky { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(4, 1fr); margin: 0 clamp(18px, 4cqi, 52px) 22px; border-top: 1px solid rgba(242,240,234,.18); }
    .sky div { padding: 14px 4px 0; text-align: center; }
    .sky div + div { border-left: 1px solid rgba(242,240,234,.12); }
    dt { font-size: 11.5px; color: rgba(242,240,234,.6); }
    dd { margin: 2px 0 0; font-family: 'Big Shoulders Display', sans-serif; font-weight: 700; font-size: 22px; }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .sky { grid-template-columns: repeat(2, 1fr); }
      .sky div:nth-child(3) { border-left: 0; }
    }
  `],
})
export class JumbotronPhoto {
  protected readonly img = photo('mauna-sol-summit', 1800, 1100);
  protected readonly menu = signal(false);
  protected readonly loaded = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();

  constructor() {
    loadGoogleFonts('Big+Shoulders+Display:wght@700;800', 'Albert+Sans:wght@400;500;600');
  }
}
