import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

interface Phase {
  label: string;
  ms: number;
  scale: number;
}

const PHASES: Phase[] = [
  { label: 'Breathe in', ms: 4000, scale: 1.14 },
  { label: 'Hold', ms: 3000, scale: 1.14 },
  { label: 'Let it go', ms: 6000, scale: 0.84 },
];

@Component({
  selector: 'demo-liquid-morph-blob',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#"><span class="mark" aria-hidden="true"></span>ebb</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Practices</a><a href="#">Teachers</a><a href="#">Pricing</a>
      </nav>
      <a class="cta-sm" href="#">Get the app</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Practices</a><a href="#" (click)="menu.set(false)">Teachers</a>
          <a href="#" (click)="menu.set(false)">Pricing</a><a href="#" (click)="menu.set(false)">Get the app</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <h1>Slow down by<br /><em>one breath.</em></h1>
        <p class="sub">Ten-minute yoga and breathwork led by real teachers. New flows every Sunday, and every session works offline.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Start 14 days free</a>
          <button class="btn soft" type="button" (click)="toggle()" [attr.aria-pressed]="guiding()">
            {{ guiding() ? 'Pause the breath' : 'Breathe with the blob' }}
          </button>
        </div>
        <p class="meta">4.9 on the App Store · 38k ratings</p>
      </section>

      <div class="orb" [style.--s]="phase().scale" [style.--d.ms]="phase().ms" [class.still]="!guiding()">
        <div class="layer l1"></div>
        <div class="layer l2"></div>
        <div class="layer l3"></div>
        <p class="cue" aria-live="polite">{{ guiding() ? phase().label : 'Paused' }}</p>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: radial-gradient(70% 90% at 78% 55%, #ffe4d6 0%, #f6d3c8 45%, #efc2b9 100%);
      color: #3b1f2b; font-family: 'Figtree', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 28px; padding: 22px clamp(18px, 5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 10px; font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; font-variation-settings: 'SOFT' 100, 'WONK' 1; text-decoration: none; }
    .mark { width: 22px; height: 22px; background: #f45b69; border-radius: 62% 38% 55% 45% / 48% 60% 40% 52%; }
    .links { display: flex; gap: 26px; margin-left: auto; font-size: 15px; }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { color: #c43e5a; }
    .cta-sm { text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 999px; background: #3b1f2b; color: #ffe4d6; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 50%; border: 0; background: #3b1f2b; color: #ffe4d6; cursor: pointer; place-content: center; gap: 5px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: currentColor; }
    .sheet { position: absolute; top: 76px; right: 18px; display: grid; min-width: 200px; padding: 8px; border-radius: 24px; background: #fff4ee; box-shadow: 0 24px 50px -24px rgba(59,31,43,.5); }
    .sheet a { padding: 11px 14px; border-radius: 16px; }
    .sheet a:hover { background: #ffe4d6; }

    .body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 20px; padding: 10px clamp(18px, 5cqi, 56px) 40px; }
    h1 { font-family: 'Fraunces', serif; font-weight: 500; font-variation-settings: 'SOFT' 100, 'opsz' 144; font-size: clamp(42px, 7.2cqi, 86px); line-height: .98; letter-spacing: -0.03em; }
    h1 em { font-style: italic; color: #c43e5a; font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144; }
    .sub { margin-top: 20px; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; max-width: 40ch; color: #6a4450; }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { font: 600 15px 'Figtree', sans-serif; text-decoration: none; padding: 14px 22px; border-radius: 999px; border: 0; cursor: pointer; transition: transform .25s cubic-bezier(.3,1.6,.5,1), background .2s; }
    .btn:hover { transform: scale(1.04); }
    .btn.primary { background: #f45b69; color: #fff; }
    .btn.soft { background: rgba(255,255,255,.55); color: #3b1f2b; box-shadow: inset 0 0 0 1px rgba(59,31,43,.15); }
    .meta { margin-top: 22px; font-size: 13px; color: #8a5f6b; }

    .orb { --s: 1; --d: 4000ms; position: relative; justify-self: center; width: min(100%, 420px); aspect-ratio: 1; display: grid; place-items: center;
      transform: scale(var(--s)); transition: transform var(--d) cubic-bezier(.45,.05,.35,1); }
    .orb.still { transform: scale(1); }
    .layer { position: absolute; inset: 6%; animation: morph 14s ease-in-out infinite; }
    .l1 { background: radial-gradient(circle at 30% 30%, #ffb38a, #f45b69 55%, #a33b6b); box-shadow: 0 50px 90px -40px #a33b6b; }
    .l2 { inset: 14%; background: radial-gradient(circle at 65% 35%, rgba(255,214,170,.9), rgba(255,140,120,0) 65%); animation-duration: 9s; animation-direction: reverse; mix-blend-mode: screen; }
    .l3 { inset: 24%; background: radial-gradient(circle at 50% 70%, rgba(163,59,107,.55), transparent 70%); animation-duration: 11s; animation-delay: -4s; }
    .cue { position: relative; font-family: 'Fraunces', serif; font-style: italic; font-size: clamp(20px, 3cqi, 28px); color: #fff; text-shadow: 0 2px 20px rgba(120,30,60,.4); transform: scale(calc(1 / var(--s))); transition: transform var(--d) cubic-bezier(.45,.05,.35,1); }
    @keyframes morph {
      0%, 100% { border-radius: 62% 38% 55% 45% / 48% 60% 40% 52%; transform: rotate(0deg); }
      25% { border-radius: 40% 60% 42% 58% / 60% 38% 62% 40%; }
      50% { border-radius: 55% 45% 65% 35% / 38% 55% 45% 62%; transform: rotate(180deg); }
      75% { border-radius: 35% 65% 48% 52% / 55% 45% 58% 42%; }
    }
    .orb.still .layer { animation-play-state: paused; }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .orb { width: min(70%, 260px); order: -1; }
    }
  `],
})
export class LiquidMorphBlob {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly phase = signal<Phase>(PHASES[0]);
  protected readonly guiding = signal(!prefersReducedMotion());
  private readonly visible = hostVisible();

  constructor() {
    loadGoogleFonts('Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,500..600,0..100,0..1;1,9..144,500,0..100,0..1', 'Figtree:wght@400;600');
    effect((onCleanup) => {
      if (!this.visible() || !this.guiding()) return;
      let i = 0;
      let timer: ReturnType<typeof setTimeout>;
      const run = () => {
        this.phase.set(PHASES[i]);
        timer = setTimeout(() => {
          i = (i + 1) % PHASES.length;
          run();
        }, PHASES[i].ms);
      };
      run();
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected toggle(): void {
    this.guiding.set(!this.guiding());
  }
}
