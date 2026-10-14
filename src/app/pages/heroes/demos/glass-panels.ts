import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface City {
  id: string;
  name: string;
  temp: number;
  cond: string;
  hi: number;
  lo: number;
  rain: string;
  hours: { h: string; t: number; i: string }[];
  c1: string;
  c2: string;
  c3: string;
  bg: string;
}

const CITIES: City[] = [
  {
    id: 'lis', name: 'Lisbon', temp: 24, cond: 'Sunny, light breeze', hi: 26, lo: 17, rain: 'No rain expected today',
    hours: [{ h: 'Now', t: 24, i: '☀' }, { h: '15', t: 25, i: '☀' }, { h: '16', t: 25, i: '☀' }, { h: '17', t: 23, i: '⛅' }, { h: '18', t: 21, i: '⛅' }],
    c1: '#ff9a3c', c2: '#ff5e8e', c3: '#ffd23f', bg: '#fdeee4',
  },
  {
    id: 'rey', name: 'Reykjavík', temp: 6, cond: 'Showers passing', hi: 8, lo: 3, rain: 'Rain starting at your street in 12 min',
    hours: [{ h: 'Now', t: 6, i: '🌧' }, { h: '15', t: 6, i: '🌧' }, { h: '16', t: 7, i: '☁' }, { h: '17', t: 5, i: '🌧' }, { h: '18', t: 4, i: '☁' }],
    c1: '#3ad1c4', c2: '#2b5cff', c3: '#9be7ff', bg: '#e4eef6',
  },
  {
    id: 'kyo', name: 'Kyoto', temp: 18, cond: 'Clear, crisp evening', hi: 21, lo: 11, rain: 'Dry until Thursday',
    hours: [{ h: 'Now', t: 18, i: '⛅' }, { h: '15', t: 19, i: '☀' }, { h: '16', t: 18, i: '☀' }, { h: '17', t: 16, i: '🌙' }, { h: '18', t: 14, i: '🌙' }],
    c1: '#ff7a59', c2: '#b06bff', c3: '#ffc2d1', bg: '#f3e9f4',
  },
];

@Component({
  selector: 'demo-glass-panels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '[class.paused]': '!visible()',
    '[style.--c1]': 'city().c1',
    '[style.--c2]': 'city().c2',
    '[style.--c3]': 'city().c3',
    '[style.--bg]': 'city().bg',
  },
  template: `
    <div class="shapes" aria-hidden="true">
      <span class="sun"></span><span class="pill"></span><span class="ring"></span><span class="drop"></span>
    </div>

    <header class="nav glass">
      <a class="logo" href="#"><span aria-hidden="true"></span>Aero</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Features</a><a href="#">Widgets</a><a href="#">Pricing</a><a href="#">Blog</a>
      </nav>
      <a class="cta-sm" href="#">Download</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet glass" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Features</a><a href="#" (click)="menu.set(false)">Widgets</a>
          <a href="#" (click)="menu.set(false)">Pricing</a><a href="#" (click)="menu.set(false)">Download</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <h1>Weather you can actually plan around.</h1>
        <p class="sub">Forecasts refreshed every five minutes, rain alerts down to your street, and a ten-day outlook that tells you when it isn't sure.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Download for iPhone</a>
          <a class="btn glass" href="#">Try it on the web</a>
        </div>
      </section>

      <div class="widget">
        <div class="tabs glass" role="tablist" aria-label="City" (keydown.arrowRight)="step(1)" (keydown.arrowLeft)="step(-1)">
          @for (c of cities; track c.id) {
            <button type="button" role="tab" [attr.aria-selected]="city().id === c.id" [class.on]="city().id === c.id" [attr.tabindex]="city().id === c.id ? 0 : -1" (click)="sel.set(c.id)">{{ c.name }}</button>
          }
        </div>
        <article
          class="card glass"
          role="tabpanel"
          [attr.aria-label]="city().name + ' forecast'"
          (pointerdown)="swipeStart($event)"
          (pointerup)="swipeEnd($event)"
          (pointercancel)="sx = null"
        >
          <div class="now">
            <div>
              <p class="place">{{ city().name }}</p>
              <p class="temp">{{ city().temp }}°</p>
            </div>
            <div class="cond">
              <p>{{ city().cond }}</p>
              <p class="hl">H {{ city().hi }}° · L {{ city().lo }}°</p>
            </div>
          </div>
          <ol class="hours">
            @for (h of city().hours; track h.h) {
              <li><span>{{ h.h }}</span><i aria-hidden="true">{{ h.i }}</i><b>{{ h.t }}°</b></li>
            }
          </ol>
        </article>
        <p class="alert glass"><span class="pulse" aria-hidden="true"></span>{{ city().rain }}</p>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    @property --c1 { syntax: '<color>'; inherits: true; initial-value: #ff9a3c; }
    @property --c2 { syntax: '<color>'; inherits: true; initial-value: #ff5e8e; }
    @property --c3 { syntax: '<color>'; inherits: true; initial-value: #ffd23f; }
    @property --bg { syntax: '<color>'; inherits: true; initial-value: #fdeee4; }
    :host {
      --c1: #ff9a3c; --c2: #ff5e8e; --c3: #ffd23f; --bg: #fdeee4;
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: var(--bg); color: #14182b; font-family: 'Lexend', system-ui, sans-serif; transition: --c1 .9s, --c2 .9s, --c3 .9s, --bg .9s;
    }
    .shapes { position: absolute; inset: 0; z-index: -1; }
    .shapes span { position: absolute; transition: background .8s; }
    .sun { width: 44cqi; aspect-ratio: 1; border-radius: 50%; right: 4%; top: 6%; background: radial-gradient(circle at 35% 30%, var(--c3), var(--c1) 55%, var(--c2)); animation: bob 12s ease-in-out infinite alternate; }
    .pill { width: 34cqi; height: 11cqi; border-radius: 999px; left: 40%; bottom: 10%; background: linear-gradient(90deg, var(--c2), var(--c1)); transform: rotate(-24deg); animation: bob 15s ease-in-out infinite alternate-reverse; }
    .ring { width: 18cqi; aspect-ratio: 1; border-radius: 50%; left: -4%; top: 18%; border: 3cqi solid var(--c2); opacity: .8; animation: bob 18s ease-in-out infinite alternate; }
    .drop { width: 12cqi; aspect-ratio: 1; border-radius: 0 50% 50% 50%; right: 46%; top: 12%; background: var(--c3); transform: rotate(45deg); animation: bob 10s ease-in-out infinite alternate-reverse; }
    @keyframes bob { to { translate: 2cqi 3cqi; rotate: 12deg; } }
    :host(.paused) .shapes span { animation-play-state: paused; }

    .glass { background: rgba(255,255,255,.3); border: 1px solid rgba(255,255,255,.6); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 20px 50px -24px rgba(20,24,43,.35);
      backdrop-filter: blur(22px) saturate(1.6); -webkit-backdrop-filter: blur(22px) saturate(1.6); }

    .nav { position: relative; z-index: 4; display: flex; align-items: center; gap: 24px; margin: 16px clamp(12px, 3cqi, 40px) 0; padding: 10px 10px 10px 20px; border-radius: 999px; }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 20px; text-decoration: none; letter-spacing: -0.02em; }
    .logo span { width: 22px; height: 22px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, var(--c3), var(--c1) 60%, var(--c2)); }
    .links { display: flex; gap: 22px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .8; }
    .links a:hover { opacity: 1; }
    .cta-sm { text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 999px; background: #14182b; color: #fff; }
    .burger { display: none; margin-left: auto; width: 40px; height: 40px; border-radius: 50%; border: 0; background: #14182b; cursor: pointer; place-content: center; gap: 5px; }
    .burger span { display: block; width: 15px; height: 1.5px; background: #fff; }
    .sheet { position: absolute; top: calc(100% + 8px); left: 0; right: 0; display: grid; padding: 8px; border-radius: 24px; background: rgba(255,255,255,.6); }
    .sheet a { padding: 12px 14px; font-weight: 500; border-radius: 16px; }

    .body { flex: 1; display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(22px, 4cqi, 56px); align-items: center; padding: 20px clamp(18px, 4.5cqi, 56px) 36px; }
    h1 { font-weight: 700; font-size: clamp(36px, 6cqi, 72px); line-height: 1.02; letter-spacing: -0.045em; max-width: 12ch; }
    .sub { margin-top: 20px; max-width: 42ch; font-size: clamp(15px, 1.65cqi, 17.5px); line-height: 1.6; font-weight: 300; color: #343a55; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 15px 22px; border-radius: 999px; transition: transform .2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn.primary { background: #14182b; color: #fff; }

    .widget { display: grid; gap: 12px; justify-self: center; width: min(100%, 380px); }
    .tabs { display: flex; padding: 5px; border-radius: 999px; }
    .tabs button { flex: 1; border: 0; background: transparent; font: 500 13.5px 'Lexend', sans-serif; color: #14182b; padding: 9px 0; border-radius: 999px; cursor: pointer; transition: background .25s; }
    .tabs button.on { background: rgba(255,255,255,.85); box-shadow: 0 4px 12px -6px rgba(20,24,43,.3); }
    .tabs button:active { scale: .96; }
    @media (pointer: coarse) { .tabs button { min-height: 40px; } }
    /* swipe the forecast card sideways to change city; vertical swipes still scroll */
    .card { border-radius: 28px; padding: 22px; touch-action: pan-y pinch-zoom; -webkit-user-select: none; user-select: none; }
    .now { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; }
    .place { font-size: 14px; font-weight: 500; }
    .temp { font-size: 78px; font-weight: 200; line-height: .9; letter-spacing: -0.06em; }
    .cond { text-align: right; font-size: 14px; }
    .hl { color: #4a5070; margin-top: 4px; font-size: 13px; }
    .hours { list-style: none; margin: 18px 0 0; padding: 14px 0 0; border-top: 1px solid rgba(255,255,255,.6); display: grid; grid-template-columns: repeat(5, 1fr); text-align: center; }
    .hours li { display: grid; gap: 4px; font-size: 12.5px; }
    .hours i { font-style: normal; font-size: 18px; }
    .alert { display: flex; align-items: center; gap: 10px; font-size: 13.5px; padding: 12px 16px; border-radius: 18px; }
    .pulse { width: 9px; height: 9px; border-radius: 50%; background: #14182b; flex: none; }

    @container (max-width: 740px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .sun { width: 70cqi; }
    }
  `],
})
export class GlassPanels {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible();
  protected readonly cities = CITIES;
  protected readonly sel = signal('lis');
  protected readonly city = computed(() => CITIES.find((c) => c.id === this.sel()) ?? CITIES[0]);

  /** start x of a swipe on the forecast card */
  protected sx: number | null = null;

  protected swipeStart(e: PointerEvent): void {
    this.sx = e.clientX;
  }

  protected swipeEnd(e: PointerEvent): void {
    if (this.sx === null) return;
    const dx = e.clientX - this.sx;
    this.sx = null;
    if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1);
  }

  protected step(d: number): void {
    const i = CITIES.findIndex((c) => c.id === this.sel());
    this.sel.set(CITIES[(i + d + CITIES.length) % CITIES.length].id);
  }

  constructor() {
    loadGoogleFonts('Lexend:wght@200;300;400;500;600;700');
  }
}
