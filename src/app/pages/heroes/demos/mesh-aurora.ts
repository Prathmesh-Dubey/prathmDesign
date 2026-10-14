import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-mesh-aurora',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.paused]': '!visible()', '[style.--kp]': 'kp()' },
  template: `
    <div class="sky" aria-hidden="true">
      <div class="stars"></div>
      <div class="aurora">
        <span class="band a1"></span><span class="band a2"></span><span class="band a3"></span><span class="band a4"></span>
      </div>
      <svg class="hills" viewBox="0 0 1200 220" preserveAspectRatio="none">
        <path class="far" d="M0 140 L140 90 L260 130 L380 70 L520 120 L640 60 L780 115 L900 80 L1040 125 L1200 85 V220 H0Z" />
        <path class="near" d="M0 190 C120 160 220 175 330 150 S560 170 680 140 S930 175 1040 150 1160 160 1200 150 V220 H0Z" />
      </svg>
      <div class="cabin"><span></span></div>
    </div>

    <header class="nav">
      <a class="logo" href="#">kaamos</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Cabins</a><a href="#">Aurora nights</a><a href="#">Getting here</a><a href="#">Journal</a>
      </nav>
      <a class="cta-sm" href="#">Check dates</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Cabins</a><a href="#" (click)="menu.set(false)">Aurora nights</a>
          <a href="#" (click)="menu.set(false)">Getting here</a><a href="#" (click)="menu.set(false)">Check dates</a>
        </nav>
      }
    </header>

    <section class="copy">
      <p class="loc">Inari, Finnish Lapland · 68.9° N</p>
      <h1>Glass cabins under<br />the northern lights.</h1>
      <p class="sub">Twelve heated cabins on the shore of Lake Inari. Wake-up alerts when the aurora starts, sauna on the ice, and husky trails from the door.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Check winter dates</a>
        <a class="btn ghost" href="#">Watch tonight's sky cam</a>
      </div>

      <div class="kp">
        <label for="kp-range">Aurora forecast <b>Kp {{ kp() }}</b> <span>{{ kpLabel() }}</span></label>
        <input id="kp-range" type="range" min="1" max="9" step="1" [value]="kp()" (input)="kp.set(+$any($event.target).value)" />
      </div>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      --kp: 5; position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: linear-gradient(180deg, #030914 0%, #061a2a 55%, #0b2a3a 100%); color: #e9f4f1; font-family: 'Red Hat Display', system-ui, sans-serif;
    }
    .sky { position: absolute; inset: 0; z-index: -1; }
    .stars { position: absolute; inset: 0 0 30%; opacity: .7;
      background-image: radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 34% 8%, #fff, transparent),
        radial-gradient(1.3px 1.3px at 58% 26%, #fff, transparent), radial-gradient(1px 1px at 76% 12%, #fff, transparent),
        radial-gradient(1px 1px at 88% 34%, #fff, transparent), radial-gradient(1px 1px at 22% 40%, #dff, transparent),
        radial-gradient(1.3px 1.3px at 46% 48%, #fff, transparent), radial-gradient(1px 1px at 66% 4%, #fff, transparent);
      background-size: 260px 200px; }
    .aurora { position: absolute; inset: -10% -20% 25%; filter: blur(calc(26px + var(--kp) * 1px)); opacity: calc(.32 + var(--kp) * .075); mix-blend-mode: screen; transition: opacity .8s, filter .8s; }
    .band { position: absolute; left: 0; right: 0; height: 26%; border-radius: 50%; transform-origin: 50% 50%; animation: sway 16s ease-in-out infinite alternate; }
    .a1 { top: 18%; background: linear-gradient(90deg, transparent 5%, #39f3a8 30%, #1fd3c6 55%, transparent 85%); transform: rotate(-8deg) skewX(-20deg); }
    .a2 { top: 30%; height: 18%; background: linear-gradient(90deg, transparent 15%, #6dffb3 40%, #8a7dff 70%, transparent 95%); animation-duration: 21s; animation-delay: -7s; transform: rotate(-4deg) skewX(25deg); }
    .a3 { top: 8%; height: 14%; background: linear-gradient(90deg, transparent 30%, #ff6fb5 50%, #9b6bff 65%, transparent 90%); opacity: calc((var(--kp) - 4) * .2); animation-duration: 25s; animation-delay: -12s; }
    .a4 { top: 40%; height: 12%; background: linear-gradient(90deg, transparent 0%, #2df0c0 25%, transparent 60%); animation-duration: 13s; animation-delay: -3s; }
    @keyframes sway {
      0% { transform: translateX(-8%) rotate(-8deg) skewX(-20deg) scaleY(1); }
      50% { transform: translateX(6%) rotate(-3deg) skewX(10deg) scaleY(1.5); }
      100% { transform: translateX(12%) rotate(-10deg) skewX(30deg) scaleY(.8); }
    }
    :host(.paused) .band { animation-play-state: paused; }
    .hills { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 34%; }
    .far { fill: #0a2233; }
    .near { fill: #04101b; }
    .cabin { position: absolute; right: 16%; bottom: 13%; width: 44px; height: 26px; background: #04101b; clip-path: polygon(50% 0, 100% 45%, 100% 100%, 0 100%, 0 45%); }
    .cabin span { position: absolute; left: 16px; top: 12px; width: 12px; height: 9px; background: #ffcf7a; box-shadow: 0 0 18px 6px rgba(255,207,122,.45); }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 4.5cqi, 56px); }
    .logo { font-weight: 900; font-size: 25px; letter-spacing: -0.04em; text-decoration: none; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 14.5px; font-weight: 500; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .78; }
    .links a:hover { opacity: 1; color: #6dffb3; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 18px; border-radius: 999px; background: #e9f4f1; color: #04101b; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(233,244,241,.3); background: none; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #e9f4f1; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 20px; background: rgba(6,26,42,.92); border: 1px solid rgba(109,255,179,.2); backdrop-filter: blur(10px); }
    .sheet a { padding: 12px 14px; font-weight: 700; font-size: 19px; }

    .copy { position: relative; z-index: 2; margin: auto 0; padding: 0 clamp(18px, 4.5cqi, 56px) 48px; max-width: 700px; }
    .loc { font-size: 13.5px; font-weight: 500; color: #6dffb3; }
    h1 { font-weight: 800; font-size: clamp(34px, 7cqi, 86px); line-height: .98; letter-spacing: -0.04em; margin: 14px 0 18px; text-shadow: 0 4px 30px rgba(3,9,20,.6); }
    .sub { max-width: 46ch; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; color: rgba(233,244,241,.8); }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 15px 24px; border-radius: 999px; transition: box-shadow .3s, transform .2s; }
    .btn.primary { background: #6dffb3; color: #04101b; }
    .btn.primary:hover { box-shadow: 0 0 40px -6px #6dffb3; transform: translateY(-2px); }
    .btn.ghost { border: 1px solid rgba(233,244,241,.35); }
    .btn.ghost:hover { border-color: #e9f4f1; }
    .kp { margin-top: 30px; max-width: 340px; padding: 14px 16px; border-radius: 16px; background: rgba(4,16,27,.45); border: 1px solid rgba(233,244,241,.12); backdrop-filter: blur(8px); }
    .kp label { display: flex; gap: 8px; align-items: baseline; font-size: 13px; flex-wrap: wrap; }
    .kp b { color: #6dffb3; }
    .kp label span { color: rgba(233,244,241,.6); }
    .kp input { width: 100%; margin-top: 10px; accent-color: #6dffb3; touch-action: pan-y pinch-zoom; }
    @media (pointer: coarse) { .kp input { height: 36px; margin-top: 4px; } }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .cabin { right: 10%; }
      h1 br { display: none; }
    }
  `],
})
export class MeshAurora {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();
  protected readonly kp = signal(5);
  protected readonly kpLabel = computed(() => {
    const k = this.kp();
    return k <= 2 ? 'faint, on the horizon' : k <= 4 ? 'likely overhead after 22:00' : k <= 6 ? 'strong, with colour' : 'storm — pinks and violets';
  });

  constructor() {
    loadGoogleFonts('Red+Hat+Display:wght@400;500;700;800;900');
  }
}
