import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-fluid-reflow-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <div class="frame" #frame [style.width]="frameW() ? frameW() + 'px' : '100%'">
      <header class="nav">
        <a class="logo" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 100 14 5.5 5.5 0 010-14z" /><path d="M4 21h16" /></svg>Wayfarer</a>
        <nav class="links" aria-label="Primary">
          <a href="#">Routes</a><a href="#">Sleeper cabins</a><a href="#">Interrail</a><a href="#">Help</a>
        </nav>
        <a class="cta-sm" href="#">Book a cabin</a>
        <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
          <span></span><span></span>
        </button>
        @if (menu()) {
          <nav class="sheet" aria-label="Mobile">
            <a href="#" (click)="menu.set(false)">Routes</a><a href="#" (click)="menu.set(false)">Sleeper cabins</a>
            <a href="#" (click)="menu.set(false)">Interrail</a><a href="#" (click)="menu.set(false)">Book a cabin</a>
          </nav>
        }
      </header>

      <div class="layout">
        <section class="copy">
          <p class="kicker">Night trains · 14 cities · 2026 timetable</p>
          <h1>Fall asleep in Paris.<br /><em>Wake up in Vienna.</em></h1>
          <p class="sub">Private sleeper cabins from €129 with breakfast in bed, real pillows and no airport queues at either end.</p>
          <div class="ctas">
            <a class="btn primary" href="#">Find a night train</a>
            <a class="btn line" href="#">See the cabins</a>
          </div>
        </section>

        <article class="ticket" aria-label="Example journey: Paris to Vienna">
          <div class="t-head">
            <span>NJ 469 · Nightjet</span><span class="seat">Car 32 · Cabin 4</span>
          </div>
          <ol class="route">
            @for (s of stops; track s.city) {
              <li [class.major]="s.major">
                <span class="dot"></span><span class="city">{{ s.city }}</span><time>{{ s.time }}</time>
              </li>
            }
          </ol>
          <div class="t-foot"><span>Deluxe for two · shower</span><b>€258</b></div>
        </article>

        <aside class="perks" aria-label="Included">
          <p><b>Included</b></p>
          <p>Breakfast tray at 08:15</p>
          <p>Lockable cabin &amp; towels</p>
          <p>Free changes until 24 h before</p>
        </aside>
      </div>

      <button
        class="handle"
        type="button"
        role="slider"
        aria-label="Resize preview width"
        [attr.aria-valuenow]="currentW()"
        aria-valuemin="320"
        [attr.aria-valuemax]="maxW()"
        (pointerdown)="grab($event)"
        (pointermove)="drag($event)"
        (pointerup)="drop($event)"
        (pointercancel)="drop($event)"
        (keydown)="key($event)"
      >
        <span></span>
      </button>
      <p class="readout" aria-hidden="true">{{ mode() }} · {{ currentW() }}px</p>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      display: flex; justify-content: flex-start; min-height: 100%; overflow: hidden;
      background: repeating-linear-gradient(135deg, #0a1924 0 10px, #0c1d29 10px 20px);
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    .frame {
      position: relative; container-type: inline-size; min-width: 320px; max-width: 100%; display: flex; flex-direction: column;
      background: radial-gradient(120% 90% at 100% 0%, #1a3a4c 0%, #0f2433 55%); color: #f3ead8;
      box-shadow: 1px 0 0 rgba(217,164,65,.4);
    }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 24px; padding: 20px clamp(18px, 4cqi, 52px); }
    .logo { display: flex; align-items: center; gap: 8px; font-family: 'DM Serif Display', serif; font-size: 23px; text-decoration: none; }
    .logo svg { width: 24px; height: 24px; fill: none; stroke: #d9a441; stroke-width: 1.6; }
    .logo svg path:first-child { fill: #d9a441; stroke: none; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { opacity: .8; }
    .links a:hover { opacity: 1; color: #d9a441; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 16px; border-radius: 8px; background: #d9a441; color: #0f2433; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 8px; border: 1px solid rgba(243,234,216,.3); background: none; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 1.5px; background: #f3ead8; }
    .sheet { position: absolute; top: 74px; left: 14px; right: 14px; display: grid; padding: 8px; background: #f3ead8; color: #0f2433; border-radius: 12px; }
    .sheet a { padding: 11px 14px; border-radius: 8px; font-weight: 500; }

    .layout { flex: 1; display: grid; grid-template-columns: 1fr; gap: 22px; align-content: center; padding: 8px clamp(18px, 4cqi, 52px) 56px; }
    .kicker { font-size: 13px; color: #d9a441; }
    h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(34px, 6.6cqi, 74px); line-height: 1; letter-spacing: -0.015em; margin: 14px 0 16px; }
    h1 em { color: #e8b6c2; }
    .sub { font-size: clamp(15px, 1.6cqi, 17.5px); line-height: 1.6; max-width: 44ch; color: rgba(243,234,216,.75); }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 20px; border-radius: 8px; transition: background .2s, transform .2s; }
    .btn.primary { background: #8c1c3a; color: #fff; }
    .btn.primary:hover { background: #a5244a; transform: translateY(-1px); }
    .btn.line { box-shadow: inset 0 0 0 1px rgba(243,234,216,.4); }
    .btn.line:hover { box-shadow: inset 0 0 0 1px #f3ead8; }

    .ticket { background: #f3ead8; color: #0f2433; border-radius: 14px; padding: 18px 20px; max-width: 380px; width: 100%; position: relative;
      box-shadow: 0 30px 60px -30px #000; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    .ticket::before, .ticket::after { content: ''; position: absolute; top: 52px; width: 18px; height: 18px; border-radius: 50%; background: #0f2433; }
    .ticket::before { left: -9px; }
    .ticket::after { right: -9px; }
    .t-head { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; font-weight: 700; padding-bottom: 14px; border-bottom: 1.5px dashed rgba(15,36,51,.25); }
    .seat { color: #8c1c3a; }
    .route { list-style: none; margin: 14px 0; padding: 0; display: grid; gap: 9px; position: relative; }
    .route::before { content: ''; position: absolute; left: 5px; top: 8px; bottom: 8px; width: 2px; background: #8c1c3a; opacity: .35; }
    .route li { display: grid; grid-template-columns: 12px 1fr auto; gap: 12px; align-items: center; font-size: 14px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #8c1c3a; background: #f3ead8; position: relative; }
    .major .dot { background: #8c1c3a; }
    .major .city { font-family: 'DM Serif Display', serif; font-size: 18px; }
    time { font-variant-numeric: tabular-nums; font-weight: 700; font-size: 13px; }
    .t-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1.5px dashed rgba(15,36,51,.25); font-size: 13px; }
    .t-foot b { font-size: 20px; color: #8c1c3a; }
    .perks { display: none; font-size: 14px; color: rgba(243,234,216,.75); border-left: 1px solid rgba(217,164,65,.4); padding-left: 18px; align-self: center; }
    .perks p + p { margin-top: 8px; }
    .perks b { color: #d9a441; }

    /* reflow: stacked -> split -> split + rail */
    @container (min-width: 640px) {
      .layout { grid-template-columns: 1.2fr 1fr; align-items: center; gap: clamp(22px, 4cqi, 48px); }
      .ticket { justify-self: end; transform: rotate(2deg); }
    }
    @container (min-width: 1080px) {
      .layout { grid-template-columns: 1.2fr 1fr .55fr; }
      .perks { display: block; }
    }
    @container (max-width: 700px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
    }

    .handle { position: absolute; top: 50%; right: 8px; width: 22px; height: 64px; transform: translateY(-50%); z-index: 5;
      border-radius: 11px; border: 0; background: #d9a441; cursor: ew-resize; display: grid; place-items: center;
      /* horizontal drag: let vertical swipes keep scrolling the page */
      touch-action: pan-y pinch-zoom; -webkit-tap-highlight-color: transparent; }
    /* invisible 44px+ hit area around the slim visual handle */
    .handle::before { content: ''; position: absolute; inset: -8px -12px; }
    .handle:active { background: #f0c063; scale: 1.06; }
    .handle span { width: 2px; height: 26px; border-left: 2px solid #0f2433; border-right: 2px solid #0f2433; box-sizing: content-box; padding: 0 2px; }
    .handle:hover, .handle:focus-visible { background: #f0c063; }
    .readout { position: absolute; right: 40px; bottom: 14px; font-size: 12px; font-family: 'JetBrains Mono', ui-monospace, monospace; color: #d9a441; opacity: .85; }
  `],
})
export class FluidReflowLayout {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly frame = viewChild<ElementRef<HTMLElement>>('frame');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly frameW = signal<number | null>(null);
  protected readonly maxW = signal(1200);
  protected readonly currentW = computed(() => Math.round(this.frameW() ?? this.maxW()));
  protected readonly mode = computed(() => {
    const w = this.currentW();
    return w >= 1080 ? 'Split + rail' : w >= 640 ? 'Split' : 'Stacked';
  });
  protected readonly stops = [
    { city: 'Paris Est', time: '19:58', major: true },
    { city: 'Strasbourg', time: '22:41', major: false },
    { city: 'München Hbf', time: '04:12', major: false },
    { city: 'Wien Hbf', time: '09:38', major: true },
  ];
  private dragging = false;

  constructor() {
    loadGoogleFonts('DM+Serif+Display:ital@0;1', 'DM+Sans:wght@400;500;700');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(() => {
        const max = this.host.clientWidth;
        this.maxW.set(max);
        const w = this.frameW();
        if (w !== null && w > max) this.frameW.set(null);
      });
      ro.observe(this.host);
      destroy.onDestroy(() => ro.disconnect());
    });
  }

  private setW(w: number): void {
    const max = this.maxW();
    const v = Math.max(320, Math.min(max, w));
    this.frameW.set(v >= max - 2 ? null : v);
  }

  protected grab(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  protected drag(e: PointerEvent): void {
    if (!this.dragging) return;
    const left = this.frame()?.nativeElement.getBoundingClientRect().left ?? 0;
    this.setW(e.clientX - left);
  }

  protected drop(e: PointerEvent): void {
    this.dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  protected key(e: KeyboardEvent): void {
    const step = e.shiftKey ? 120 : 40;
    if (e.key === 'ArrowLeft') this.setW(this.currentW() - step);
    else if (e.key === 'ArrowRight') this.setW(this.currentW() + step);
    else if (e.key === 'Home') this.setW(320);
    else if (e.key === 'End') this.setW(this.maxW());
    else return;
    e.preventDefault();
  }
}
