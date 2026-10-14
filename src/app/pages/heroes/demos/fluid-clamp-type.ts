import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-fluid-clamp-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#">Halden <i>&amp;</i> Voss</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Work</a><a href="#">Practice</a><a href="#">Writing</a><a href="#">Contact</a>
      </nav>
      <a class="cta-sm" href="#">Start a project</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        {{ menu() ? '×' : '≡' }}
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Work</a><a href="#" (click)="menu.set(false)">Practice</a>
          <a href="#" (click)="menu.set(false)">Writing</a><a href="#" (click)="menu.set(false)">Start a project</a>
        </nav>
      }
    </header>

    <section class="hero">
      <div class="measure" aria-hidden="true">
        <span class="tick"></span>
        <span class="read">{{ fontPx() }}px &nbsp;·&nbsp; clamp(40px, 10.4cqi, 150px) &nbsp;·&nbsp; frame {{ framePx() }}px</span>
        <span class="tick"></span>
      </div>
      <h1 #head>We draw buildings<br />that <em>age well.</em></h1>

      <div class="foot">
        <div class="copy">
          <p class="sub">A fourteen-person practice in Rotterdam working on housing, schools and quiet civic buildings since 2009.</p>
          <div class="ctas">
            <a class="btn primary" href="#">See selected work</a>
            <a class="btn plain" href="#">Our approach</a>
          </div>
        </div>
        <figure class="drawing">
          <svg viewBox="0 0 520 220" role="img" aria-labelledby="hv-cap">
            <g class="grid">
              @for (x of cols; track x) {
                <line [attr.x1]="x" y1="10" [attr.x2]="x" y2="200" />
              }
            </g>
            <path class="build" d="M20 200V92h120v108M140 200V56l90-36 90 36v144M320 200V110h180v90" />
            @for (w of windows; track $index) {
              <rect class="win" [attr.x]="w[0]" [attr.y]="w[1]" width="22" height="30" />
            }
            <path class="dim" d="M20 212h480M20 207v10M500 207v10" />
            <text x="260" y="218" text-anchor="middle">48.6 m</text>
            <path class="ground" d="M0 200h520" />
          </svg>
          <figcaption id="hv-cap">Kralingen School, south elevation · completed 2024</figcaption>
        </figure>
      </div>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: #e7e8e5; color: #151715; font-family: 'Inter Tight', system-ui, sans-serif;
      background-image: linear-gradient(rgba(21,23,21,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(21,23,21,.045) 1px, transparent 1px);
      background-size: 2.5cqi 2.5cqi;
    }
    .nav { position: relative; z-index: 2; display: flex; align-items: baseline; gap: clamp(16px, 3cqi, 36px); padding: clamp(16px, 2.6cqi, 28px) clamp(16px, 4cqi, 56px); }
    .logo { font-family: 'Instrument Serif', serif; font-size: clamp(22px, 2.6cqi, 30px); text-decoration: none; letter-spacing: -0.01em; }
    .logo i { color: #1f3fd1; }
    .links { display: flex; gap: clamp(14px, 2.4cqi, 30px); margin-left: auto; font-size: clamp(13px, 1.3cqi, 15px); }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { color: #1f3fd1; }
    .cta-sm { font-size: clamp(13px, 1.3cqi, 15px); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: #1f3fd1; text-decoration-thickness: 2px; }
    .burger { display: none; margin-left: auto; width: 40px; height: 40px; font-size: 22px; line-height: 1; background: none; border: 1px solid #151715; cursor: pointer; }
    .sheet { position: absolute; top: 64px; right: 16px; left: 16px; display: grid; background: #151715; color: #e7e8e5; padding: 8px 0; }
    .sheet a { padding: 12px 18px; font-family: 'Instrument Serif', serif; font-size: 24px; }

    .hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 clamp(16px, 4cqi, 56px) clamp(22px, 3.6cqi, 44px); }
    .measure { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: clamp(10px, 1.05cqi, 12px); color: #1f3fd1; margin-bottom: 1.2cqi; }
    .measure::before, .measure::after { content: ''; flex: 1; height: 1px; background: #1f3fd1; opacity: .5; }
    .measure .read { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tick { width: 1px; height: 10px; background: #1f3fd1; }
    .measure .tick:first-child { order: -1; }
    .measure .tick:last-child { order: 9; }
    h1 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(40px, 10.4cqi, 150px); line-height: .9; letter-spacing: -0.035em; }
    h1 em { color: #1f3fd1; }
    .foot { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: clamp(18px, 4cqi, 60px); align-items: end; margin-top: clamp(20px, 3.2cqi, 40px); }
    .sub { font-size: clamp(15px, 1.6cqi, 19px); line-height: 1.5; max-width: 36ch; color: #3d413d; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(16px, 2.2cqi, 26px); }
    .btn { text-decoration: none; font-size: clamp(14px, 1.3cqi, 15px); font-weight: 500; padding: .9em 1.4em; transition: background .2s, color .2s; }
    .btn.primary { background: #151715; color: #e7e8e5; }
    .btn.primary:hover { background: #1f3fd1; }
    .btn.plain { box-shadow: inset 0 0 0 1px #151715; }
    .btn.plain:hover { background: #151715; color: #e7e8e5; }
    .drawing { margin: 0; }
    .drawing svg { width: 100%; height: auto; }
    .grid line { stroke: #1f3fd1; stroke-width: .5; stroke-dasharray: 2 4; opacity: .4; }
    .build { fill: none; stroke: #151715; stroke-width: 1.5; }
    .win { fill: rgba(31,63,209,.08); stroke: #151715; stroke-width: 1; }
    .dim { stroke: #1f3fd1; stroke-width: 1; fill: none; }
    .ground { stroke: #151715; stroke-width: 2.5; }
    text { font: 10px 'JetBrains Mono', monospace; fill: #1f3fd1; paint-order: stroke; stroke: #e7e8e5; stroke-width: 6px; }
    figcaption { margin-top: 8px; font-size: 12px; color: #5d625d; }

    @container (max-width: 660px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .foot { grid-template-columns: 1fr; }
    }
  `],
})
export class FluidClampType {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly head = viewChild<ElementRef<HTMLElement>>('head');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly fontPx = signal(0);
  protected readonly framePx = signal(0);
  protected readonly cols = Array.from({ length: 11 }, (_, i) => 20 + i * 48);
  protected readonly windows = [
    [40, 110], [90, 110], [40, 156], [90, 156],
    [164, 80], [204, 80], [244, 80], [284, 80], [164, 140], [204, 140], [244, 140], [284, 140],
    [344, 126], [384, 126], [424, 126], [464, 126],
  ];

  constructor() {
    loadGoogleFonts('Instrument+Serif:ital@0;1', 'Inter+Tight:wght@400;500;600', 'JetBrains+Mono:wght@400');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const h1 = this.head()?.nativeElement;
      if (!h1) return;
      const ro = new ResizeObserver(() => {
        this.fontPx.set(Math.round(parseFloat(getComputedStyle(h1).fontSize)));
        this.framePx.set(Math.round(this.host.clientWidth));
      });
      ro.observe(this.host);
      destroy.onDestroy(() => ro.disconnect());
    });
  }
}
