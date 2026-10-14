import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface Stat {
  to: number;
  dec: number;
  pre: string;
  suf: string;
  label: string;
}

const STATS: Stat[] = [
  { to: 4.2, dec: 1, pre: '', suf: 'M', label: 'threats blocked every day' },
  { to: 38, dec: 0, pre: '', suf: ' s', label: 'median time to contain' },
  { to: 99.995, dec: 3, pre: '', suf: '%', label: 'control-plane uptime, 2025' },
  { to: 1840, dec: 0, pre: '', suf: '', label: 'security teams on Bastion' },
];

@Component({
  selector: 'demo-jumbotron-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.paused]': '!visible()' },
  template: `
    <div class="radar" aria-hidden="true"><span></span></div>

    <header class="nav">
      <a class="logo" href="#">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3.5v6c0 5-3.4 8.6-8 10.5-4.6-1.9-8-5.5-8-10.5v-6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
        Bastion
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#">Platform</a><a href="#">Solutions</a><a href="#">Research</a><a href="#">Pricing</a>
      </nav>
      <a class="signin" href="#">Sign in</a>
      <a class="cta-sm" href="#">Get a demo</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Platform</a><a href="#" (click)="menu.set(false)">Solutions</a>
          <a href="#" (click)="menu.set(false)">Research</a><a href="#" (click)="menu.set(false)">Get a demo</a>
        </nav>
      }
    </header>

    <section class="jumbo">
      <p class="certs"><span>SOC 2 Type II</span><span>ISO 27001</span><span>FedRAMP Moderate</span></p>
      <h1>Assume breach.<br /><span>Stop it anyway.</span></h1>
      <p class="sub">Bastion verifies every user, device and workload on every request, then isolates anything odd in seconds — without a VPN or a rip-and-replace.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Book a 30-min threat review</a>
        <a class="btn ghost" href="#">Read the 2026 breach report</a>
      </div>
    </section>

    <dl class="stats">
      @for (s of shown(); track s.label) {
        <div>
          <dt>{{ s.label }}</dt>
          <dd>{{ s.value }}</dd>
        </div>
      }
    </dl>

    <div class="logos" aria-label="Customers">
      <div class="track">
        @for (rep of [0, 1]; track rep) {
          @for (l of logos; track l.n) {
            <span [class]="'lg ' + l.cls" [attr.aria-hidden]="rep === 1">{{ l.n }}</span>
          }
        }
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden; isolation: isolate;
      background: #f6f7f9; color: #0f1720; font-family: 'IBM Plex Sans', system-ui, sans-serif;
      background-image: radial-gradient(rgba(15,23,32,.12) 1px, transparent 1px); background-size: 22px 22px;
    }
    :host(.paused) .radar span, :host(.paused) .track { animation-play-state: paused; }
    .radar { position: absolute; z-index: -1; width: min(90cqi, 820px); aspect-ratio: 1; left: 50%; top: 42%; transform: translate(-50%, -50%); border-radius: 50%;
      background: repeating-radial-gradient(circle, transparent 0 59px, rgba(255,107,26,.16) 59px 60px);
      mask: radial-gradient(circle, #000 40%, transparent 70%); }
    .radar span { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, rgba(255,107,26,.22), transparent 18%); animation: sweep 6s linear infinite; }
    @keyframes sweep { to { transform: rotate(360deg); } }

    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 24px; padding: 16px clamp(16px, 4cqi, 48px); background: rgba(246,247,249,.8); backdrop-filter: blur(8px); border-bottom: 1px solid #e3e6eb; }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 19px; text-decoration: none; }
    .logo svg { width: 24px; height: 24px; fill: #0f1720; stroke: #ff6b1a; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .logo svg path:first-child { stroke: none; }
    .links { display: flex; gap: 22px; margin-left: 18px; font-size: 14px; }
    .links a, .sheet a, .signin { text-decoration: none; color: #3b4654; }
    .links a:hover, .signin:hover { color: #0f1720; }
    .signin { margin-left: auto; font-size: 14px; }
    .cta-sm { text-decoration: none; font-size: 14px; font-weight: 600; padding: 9px 16px; background: #0f1720; color: #fff; border-radius: 4px; }
    .cta-sm:hover { background: #ff6b1a; }
    .burger { display: none; margin-left: auto; width: 40px; height: 40px; border: 1px solid #cfd5dd; border-radius: 4px; background: #fff; cursor: pointer; place-content: center; gap: 4px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #0f1720; }
    .sheet { position: absolute; top: 100%; left: 0; right: 0; display: grid; padding: 8px clamp(16px, 4cqi, 48px) 14px; background: #fff; border-bottom: 1px solid #e3e6eb; }
    .sheet a { padding: 11px 0; border-bottom: 1px solid #eef0f3; }

    .jumbo { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 34px clamp(16px, 4cqi, 48px) 24px; }
    .certs { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
    .certs span { padding: 4px 9px; border: 1px solid #cfd5dd; background: #fff; border-radius: 3px; }
    h1 { font-weight: 600; font-size: clamp(34px, 7cqi, 84px); line-height: 1; letter-spacing: -0.035em; margin: 22px 0 18px; }
    h1 span { color: #ff6b1a; }
    .sub { max-width: 54ch; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; color: #3b4654; }
    .ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 20px; border-radius: 4px; transition: background .2s, color .2s, box-shadow .2s; }
    .btn.primary { background: #ff6b1a; color: #1a0b02; }
    .btn.primary:hover { background: #0f1720; color: #fff; }
    .btn.ghost { background: #fff; box-shadow: inset 0 0 0 1px #cfd5dd; }
    .btn.ghost:hover { box-shadow: inset 0 0 0 1px #0f1720; }

    .stats { display: grid; grid-template-columns: repeat(4, 1fr); margin: 0 clamp(16px, 4cqi, 48px); background: #fff; border: 1px solid #e3e6eb; border-radius: 8px; }
    .stats div { padding: 18px 20px; display: flex; flex-direction: column-reverse; justify-content: flex-end; }
    .stats div + div { border-left: 1px solid #e3e6eb; }
    dd { margin: 0; font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: clamp(24px, 3.4cqi, 36px); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
    dt { font-size: 13px; color: #5b6676; margin-top: 2px; }

    .logos { overflow: hidden; padding: 20px 0 22px; mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
    .track { display: flex; gap: 56px; width: max-content; animation: scroll 36s linear infinite; }
    @media (hover: hover) { .logos:hover .track { animation-play-state: paused; } }
    @keyframes scroll { to { transform: translateX(calc(-50% - 28px)); } }
    .lg { font-size: 20px; color: #6b7685; white-space: nowrap; }
    .lg.a { font-family: 'IBM Plex Mono', monospace; font-weight: 600; letter-spacing: -0.04em; }
    .lg.b { font-family: Georgia, serif; font-style: italic; }
    .lg.c { font-weight: 700; text-transform: uppercase; letter-spacing: .14em; font-size: 15px; }
    .lg.d { font-weight: 300; letter-spacing: -0.02em; font-size: 22px; }

    @container (max-width: 760px) {
      .links, .signin, .cta-sm { display: none; }
      .burger { display: grid; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .stats div:nth-child(3) { border-left: 0; }
      .stats div:nth-child(n + 3) { border-top: 1px solid #e3e6eb; }
    }
  `],
})
export class JumbotronStats {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly visible = hostVisible(0.25);
  private readonly progress = signal(0);
  protected readonly shown = computed(() => {
    const p = this.progress();
    const e = 1 - Math.pow(1 - p, 4);
    return STATS.map((s) => ({
      label: s.label,
      value: s.pre + (s.to * e).toLocaleString('en-GB', { minimumFractionDigits: s.dec, maximumFractionDigits: s.dec }) + s.suf,
    }));
  });
  protected readonly logos = [
    { n: 'northwind', cls: 'a' }, { n: 'Kestrel Bank', cls: 'b' }, { n: 'Halcyon Health', cls: 'c' }, { n: 'arbor freight', cls: 'd' },
    { n: 'VANTAGE/', cls: 'a' }, { n: 'Corvid Labs', cls: 'c' }, { n: 'Meridian Air', cls: 'b' }, { n: 'lumen&co', cls: 'd' },
  ];

  constructor() {
    loadGoogleFonts('IBM+Plex+Sans:wght@300;400;600;700', 'IBM+Plex+Mono:wght@500;600');
    let started = false;
    let raf = 0;
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(raf));
    effect(() => {
      if (!this.visible() || started) return;
      started = true;
      if (prefersReducedMotion()) {
        this.progress.set(1);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1800);
        this.progress.set(p);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
  }
}
