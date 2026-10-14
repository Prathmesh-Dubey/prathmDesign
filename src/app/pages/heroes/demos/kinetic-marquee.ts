import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChildren } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks, rafLoop } from '../hero-kit';

interface Row {
  text: string;
  dir: 1 | -1;
  speed: number;
  cls: string;
}

@Component({
  selector: 'demo-kinetic-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'hash($event)',
    '(pointerdown)': 'move($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'boost = 1',
    '(pointerleave)': 'boost = 1',
  },
  template: `
    <header class="nav">
      <a class="logo" href="#"><span class="dots" aria-hidden="true"></span>Riso Fair</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Exhibitors</a><a href="#">Workshops</a><a href="#">Visit</a><a href="#">Zine library</a>
      </nav>
      <a class="cta-sm" href="#">Free ticket</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">{{ menu() ? 'Close' : 'Menu' }}</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Exhibitors</a><a href="#" (click)="menu.set(false)">Workshops</a>
          <a href="#" (click)="menu.set(false)">Visit</a><a href="#" (click)="menu.set(false)">Free ticket</a>
        </nav>
      }
    </header>

    <h1 class="visually-hidden">Riso Fair Leeds — print is not dead — 14 and 15 March 2026</h1>
    <div class="rows" aria-hidden="true">
      @for (r of rows; track r.text; let i = $index) {
        <div [class]="'row ' + r.cls">
          <div class="track" [style.transform]="'translate3d(' + -offsets()[i] + 'px,0,0)'">
            @for (k of reps; track k) {
              <span #unit class="unit"><b class="ink a">{{ r.text }}</b><b class="ink b">{{ r.text }}</b><em>✳</em></span>
            }
          </div>
        </div>
      }
    </div>

    <section class="info">
      <p class="sub">120 independent printers, zine-makers and studios. Two days of stalls, live printing and workshops at Leeds Corn Exchange.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Get a free ticket</a>
        <a class="btn ghost" href="#">Apply for a table · £45</a>
      </div>
      <p class="hint"><span class="hint-m">Move across the poster to change the press speed.</span><span class="hint-t">Swipe sideways across the poster to change the press speed.</span></p>
    </section>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: #efeee8; color: #141414; font-family: 'Space Grotesk', system-ui, sans-serif;
      touch-action: pan-y pinch-zoom;
    }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 24px; padding: 18px clamp(16px, 3.5cqi, 44px); border-bottom: 2px solid #141414; }
    .logo { display: flex; align-items: center; gap: 10px; font-family: 'Dela Gothic One', sans-serif; font-size: 20px; text-decoration: none; }
    .dots { width: 26px; height: 18px; background: radial-gradient(circle at 30% 50%, #ff48b0 0 7px, transparent 7.5px), radial-gradient(circle at 70% 50%, #0078bf 0 7px, transparent 7.5px); mix-blend-mode: multiply; }
    .links { display: flex; gap: 20px; margin-left: auto; font-size: 14px; font-weight: 500; }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { background: #ffe800; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 8px 14px; background: #ff48b0; color: #141414; border: 2px solid #141414; box-shadow: 3px 3px 0 #141414; transition: transform .1s, box-shadow .1s; }
    .cta-sm:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #141414; }
    .burger { display: none; margin-left: auto; font: 700 14px 'Space Grotesk', sans-serif; padding: 8px 14px; border: 2px solid #141414; background: #ffe800; cursor: pointer; }
    .sheet { position: absolute; top: 100%; left: 0; right: 0; display: grid; background: #efeee8; border-bottom: 2px solid #141414; }
    .sheet a { padding: 12px clamp(16px, 3.5cqi, 44px); font-family: 'Dela Gothic One', sans-serif; font-size: 26px; border-top: 1px solid rgba(20,20,20,.15); }

    .rows { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0; padding: 10px 0; }
    .row { overflow: hidden; border-bottom: 2px solid #141414; padding: .5cqi 0; }
    .track { display: flex; width: max-content; will-change: transform; }
    .unit { position: relative; display: flex; align-items: center; padding-right: 3cqi; font-family: 'Dela Gothic One', sans-serif; font-size: clamp(54px, 12.5cqi, 170px); line-height: 1.02; white-space: nowrap; }
    .ink { font-weight: 400; mix-blend-mode: multiply; }
    .ink.b { position: absolute; left: 0; top: 0; transform: translate(.035em, .03em); }
    .unit em { font-style: normal; margin-left: 3cqi; font-size: .6em; color: #141414; }
    .r1 .a { color: #ff48b0; }
    .r1 .b { color: #0078bf; opacity: .55; }
    .r2 .a { color: #0078bf; }
    .r2 .b { color: #ffe800; }
    .r3 .a { color: #ffe800; -webkit-text-stroke: 2px #141414; }
    .r3 .b { color: #ff48b0; opacity: .7; }

    .info { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 14px 30px; padding: 18px clamp(16px, 3.5cqi, 44px) 22px; }
    .sub { font-size: clamp(15px, 1.6cqi, 17px); line-height: 1.5; max-width: 52ch; }
    .ctas { display: flex; gap: 10px; flex-wrap: wrap; grid-row: span 2; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 20px; border: 2px solid #141414; transition: transform .1s, box-shadow .1s; }
    .btn.primary { background: #ffe800; box-shadow: 4px 4px 0 #141414; }
    .btn.primary:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #141414; }
    .btn.ghost { background: #fff; }
    .btn.ghost:hover { background: #0078bf; color: #fff; }
    .hint { font-size: 12.5px; color: #6a6a63; }
    .hint-t { display: none; }
    @media (hover: none) { .hint-m { display: none; } .hint-t { display: inline; } }

    @container (max-width: 680px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .info { grid-template-columns: 1fr; }
      .ctas { grid-row: auto; }
    }
  `],
})
export class KineticMarquee {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly units = viewChildren<ElementRef<HTMLElement>>('unit');
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly reps = [0, 1, 2, 3];
  protected readonly rows: Row[] = [
    { text: 'Riso Fair Leeds', dir: 1, speed: 0.07, cls: 'r1' },
    { text: 'Print is not dead', dir: -1, speed: 0.055, cls: 'r2' },
    { text: '14—15 March 2026', dir: 1, speed: 0.09, cls: 'r3' },
  ];
  protected readonly offsets = signal([0, 0, 0]);
  protected boost = 1;
  private widths = [1000, 1000, 1000];
  private smooth = 1;

  constructor() {
    loadGoogleFonts('Dela+Gothic+One', 'Space+Grotesk:wght@400;500;700');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const measure = () => {
        const u = this.units();
        this.widths = this.rows.map((_, i) => u[i * this.reps.length]?.nativeElement.offsetWidth || 1000);
        this.offsets.set(this.offsets().map((o, i) => (i % 2 ? this.widths[i] * 0.4 : o)));
      };
      const ro = new ResizeObserver(measure);
      ro.observe(this.host);
      document.fonts?.ready.then(measure);
      destroy.onDestroy(() => ro.disconnect());
    });
    rafLoop(hostVisible(), (_t, dt) => {
      this.smooth += (this.boost - this.smooth) * 0.06;
      this.offsets.set(
        this.offsets().map((o, i) => {
          const w = this.widths[i];
          const r = this.rows[i];
          const n = (o + r.dir * r.speed * this.smooth * dt) % w;
          return n < 0 ? n + w : n;
        }),
      );
    });
  }

  /** Touch: the press eases back to its normal speed once the finger lifts. */
  protected up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.boost = 1;
  }

  protected move(e: PointerEvent): void {
    const r = this.host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    this.boost = (x - 0.35) * 4;
  }
}
