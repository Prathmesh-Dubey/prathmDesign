import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Pano {
  id: number;
  name: string;
  alt: string;
  km: string;
  ratio: number;
  src: string;
}

const PANOS: [string, string, string, number][] = [
  ['Fitz Roy at dawn', '49.27° S', 'km 0', 2.4],
  ['Laguna de los Tres', '49.27° S', 'km 12', 1.6],
  ['Perito Moreno', '50.47° S', 'km 238', 3],
  ['Torres del Paine', '50.94° S', 'km 410', 2.2],
  ['Cuernos at noon', '51.01° S', 'km 428', 1.4],
  ['Carretera Austral', '46.57° S', 'km 912', 2.8],
  ['Marble Caves', '46.65° S', 'km 960', 1.8],
];

@Component({
  selector: 'demo-hscroll-drag-panorama',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h3>Ruta 40 <span>→ Austral</span></h3>
      <p>Seven panoramas · 960 km · Valentina Ríos</p>
    </header>
    <div #strip class="strip" tabindex="0" aria-label="Patagonia panoramas, scroll or drag horizontally"
      [class.dragging]="dragging()" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)"
      (pointercancel)="up($event)" (pointerenter)="cursorOn.set($event.pointerType === 'mouse')" (pointerleave)="cursorOn.set(false)" (scroll)="onScroll()">
      @for (p of panos; track p.id) {
        <figure [style.aspect-ratio]="p.ratio">
          <img [src]="p.src" [alt]="'Panorama ' + (p.id + 1) + ': ' + p.name" draggable="false" />
          <figcaption><b>{{ p.km }}</b> {{ p.name }} <i>{{ p.alt }}</i></figcaption>
        </figure>
      }
      <div class="end" aria-hidden="true">Fin del camino</div>
    </div>
    <span class="cursor" aria-hidden="true" [class.on]="cursorOn() && !coarse" [class.press]="dragging()"
      [style.transform]="'translate(' + cx() + 'px,' + cy() + 'px)'">Drag</span>
    <footer>
      <div class="bar"><span [style.transform]="'scaleX(' + progress() + ')'"></span></div>
      <div class="btns">
        <button type="button" (click)="nudge(-1)" aria-label="Scroll left"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" /></svg></button>
        <button type="button" (click)="nudge(1)" aria-label="Scroll right"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg></button>
      </div>
    </footer>
  `,
  styles: `
    :host { display: grid; grid-template-rows: auto 1fr auto; position: relative; min-height: 100%; background: #0e1a24; color: #e7f0f5; overflow: hidden;
      font-family: var(--font-body); container-type: inline-size; }
    header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; padding: 24px clamp(16px, 4cqw, 40px) 18px; }
    h3 { font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: clamp(22px, 3.6cqw, 36px); letter-spacing: -0.02em; }
    h3 span { color: #7fc8e8; font-weight: 400; }
    header p { font-size: 13px; color: #8aa3b3; }
    /* touch scrolls natively (JS drag is mouse-only); contain stops edge swipes turning into browser back/forward */
    .strip { display: flex; gap: 14px; overflow-x: auto; overscroll-behavior-x: contain; padding: 0 clamp(16px, 4cqw, 40px); scrollbar-width: none; cursor: none; user-select: none; align-items: stretch; height: 340px;
      scroll-padding: 0 clamp(16px, 4cqw, 40px); }
    @media (hover: none) { .strip { scroll-snap-type: x proximity; } figure { scroll-snap-align: start; } }
    @container (max-width: 480px) { .strip { height: 270px; gap: 10px; } figcaption { left: 8px; bottom: 8px; font-size: 12px; padding: 5px 10px; } }
    .strip::-webkit-scrollbar { display: none; }
    .strip:focus-visible { outline: 2px solid #7fc8e8; outline-offset: -2px; }
    @media (pointer: coarse) { .strip { cursor: auto; } }
    figure { position: relative; margin: 0; height: 100%; flex: none; border-radius: 6px; overflow: hidden; background: #1a2b38; }
    figure img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
    .strip.dragging figure img { transform: scale(.97); }
    figcaption { position: absolute; left: 12px; bottom: 12px; display: flex; gap: 8px; align-items: baseline; font-size: 13px; background: rgba(14,26,36,.72);
      backdrop-filter: blur(6px); padding: 6px 12px; border-radius: 99px; white-space: nowrap; }
    figcaption b { font-family: 'Unbounded', sans-serif; font-weight: 400; font-size: 10.5px; color: #7fc8e8; }
    figcaption i { font-style: normal; font-family: var(--font-mono); font-size: 10.5px; color: #8aa3b3; }
    .end { flex: none; display: grid; place-items: center; width: 180px; font-family: 'Unbounded', sans-serif; font-size: 14px; color: #8aa3b3; border: 1px dashed #2c4253; border-radius: 6px; }
    .cursor { position: absolute; left: -36px; top: -36px; width: 72px; height: 72px; border-radius: 50%; background: #7fc8e8; color: #0e1a24;
      display: grid; place-items: center; font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 700; pointer-events: none; z-index: 5;
      scale: 0; transition: scale .3s cubic-bezier(.2,.8,.2,1); }
    .cursor.on { scale: 1; } .cursor.on.press { scale: .75; }
    footer { display: flex; align-items: center; gap: 18px; padding: 18px clamp(16px, 4cqw, 40px) 22px; }
    .bar { flex: 1; height: 2px; background: #22384a; border-radius: 2px; overflow: hidden; }
    .bar span { display: block; height: 100%; background: #7fc8e8; transform-origin: left; }
    .btns { display: flex; gap: 8px; }
    .btns button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #2c4253; background: transparent; color: #e7f0f5; display: grid; place-items: center; cursor: pointer; transition: background .2s; }
    .btns button:hover { background: #1c3141; }
    .btns button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .btns button:active { background: #1c3141; transform: scale(.92); }
    .btns svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  `,
})
export class HscrollDragPanorama {
  private readonly strip = viewChild.required<ElementRef<HTMLElement>>('strip');
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly panos: Pano[] = PANOS.map(([name, alt, km, ratio], id) => ({
    id, name, alt, km, ratio, src: photo('patagonia-pano-' + id, Math.round(ratio * 420), 420),
  }));
  protected readonly progress = signal(0);
  protected readonly dragging = signal(false);
  protected readonly cursorOn = signal(false);
  protected readonly cx = signal(0);
  protected readonly cy = signal(0);
  protected readonly coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  private lastX = 0;
  private lastT = 0;
  private v = 0;
  private raf = 0;
  private id = -1;

  constructor() {
    loadGoogleFonts('Unbounded:wght@400;700');
    afterNextRender(() => this.onScroll());
    this.destroyRef.onDestroy(() => cancelAnimationFrame(this.raf));
  }

  onScroll(): void {
    const el = this.strip().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.progress.set(max > 0 ? el.scrollLeft / max : 0);
  }

  down(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cancelAnimationFrame(this.raf);
    this.id = e.pointerId;
    this.lastX = e.clientX;
    this.lastT = performance.now();
    this.v = 0;
    this.dragging.set(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const r = this.host.nativeElement.getBoundingClientRect();
    this.cx.set(e.clientX - r.left);
    this.cy.set(e.clientY - r.top);
    if (!this.dragging() || e.pointerId !== this.id) return;
    const now = performance.now();
    const dx = e.clientX - this.lastX;
    this.strip().nativeElement.scrollLeft -= dx;
    this.v = dx / Math.max(1, now - this.lastT);
    this.lastX = e.clientX;
    this.lastT = now;
  }

  up(e: PointerEvent): void {
    if (!this.dragging() || e.pointerId !== this.id) return;
    this.dragging.set(false);
    if (prefersReducedMotion()) return;
    let v = this.v * 16; // px per frame
    const el = this.strip().nativeElement;
    const tick = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft -= v;
      v *= 0.94;
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  nudge(dir: number): void {
    const el = this.strip().nativeElement;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
