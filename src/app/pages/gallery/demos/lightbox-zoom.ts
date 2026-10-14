import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Detail {
  id: number;
  title: string;
  street: string;
  thumb: string;
  full: string;
}

const DETAILS: [string, string][] = [
  ['Capela das Almas', 'Rua de Santa Catarina'],
  ['Igreja do Carmo', 'Praça de Carlos Alberto'],
  ['São Bento station', 'Praça de Almeida Garrett'],
  ['Casa da Música', 'Avenida da Boavista'],
  ['Livraria Lello stair', 'Rua das Carmelitas'],
  ['Ribeira façades', 'Cais da Ribeira'],
];

const MAX = 4;

@Component({
  selector: 'demo-lightbox-zoom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'key($event)' },
  template: `
    <div class="intro">
      <h3>Porto, up close</h3>
      <p>Façade details by Duarte Neves. Open one, then <span class="m">click</span><span class="tch">tap</span> to zoom and drag to pan.</p>
    </div>
    <ul class="grid" role="list">
      @for (d of details; track d.id; let i = $index) {
        <li>
          <button type="button" (click)="open(i)" [attr.aria-label]="'Open ' + d.title + ' in zoom viewer'">
            <img [src]="d.thumb" [alt]="'Detail photograph ' + (i + 1) + ': ' + d.title" loading="lazy" />
            <span class="lbl"><b>{{ (i + 1).toString().padStart(2, '0') }}</b> {{ d.title }}</span>
          </button>
        </li>
      }
    </ul>

    @if (index() !== null) {
      @let d = current()!;
      <div class="lb" role="dialog" aria-modal="true" [attr.aria-label]="'Zoom viewer: ' + d.title">
        <div class="bar">
          <div class="t"><strong>{{ d.title }}</strong><span>{{ d.street }}, Porto</span></div>
          <div class="zoom" role="group" aria-label="Zoom controls">
            <button type="button" (click)="zoomBy(-1)" [disabled]="scale() <= 1" aria-label="Zoom out">−</button>
            <output aria-live="polite">{{ pct() }}%</output>
            <button type="button" (click)="zoomBy(1)" [disabled]="scale() >= max" aria-label="Zoom in">+</button>
          </div>
          <button #closeBtn type="button" class="close" (click)="close()" aria-label="Close viewer">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
        <div #view class="view" [class.zoomed]="scale() > 1" [class.panning]="panning()"
          (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="cancel()"
          (wheel)="wheel($event)">
          @for (k of [index()]; track k) {
            <img [src]="d.full" [alt]="d.title + ', ' + d.street + ' — photograph by Duarte Neves'" draggable="false"
              [style.transform]="'translate(' + (tx() + sdx()) + 'px,' + ty() + 'px) scale(' + scale() + ')'" [style.opacity]="1 - Math.min(0.5, Math.abs(sdx()) / 600)" />
          }
          @if (scale() === 1) { <span class="hint" aria-hidden="true"><span class="m">Click to zoom</span><span class="tch">Tap to zoom · swipe for next</span></span> }
        </div>
        <div class="foot">
          <button type="button" (click)="step(-1)" aria-label="Previous detail">Prev</button>
          <span class="mono">{{ index()! + 1 }} / {{ details.length }}</span>
          <button type="button" (click)="step(1)" aria-label="Next detail">Next</button>
        </div>
      </div>
    }
  `,
  styles: `
    :host { display: block; position: relative; container-type: inline-size; min-height: 100%; background: #f7f8fb; color: #0b1f3a;
      padding: clamp(16px, 3cqw, 30px); font-family: 'Archivo', var(--font-body); }
    .mono { font-family: var(--font-mono); }
    .intro { display: flex; justify-content: space-between; align-items: end; gap: 10px 20px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-weight: 800; font-size: clamp(26px, 4cqw, 40px); letter-spacing: -0.035em; font-stretch: 85%; }
    .intro p { font-size: 13px; color: #556178; max-width: 42ch; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    @container (max-width: 560px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    .grid button { position: relative; width: 100%; aspect-ratio: 16 / 10; padding: 0; border: 0; overflow: hidden; border-radius: 2px; cursor: zoom-in; background: #dfe4ee; }
    .grid img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.2,.7,.2,1); }
    .grid button:hover img { transform: scale(1.04); }
    .lbl { position: absolute; left: 0; bottom: 0; background: #fff; padding: 6px 10px; font-size: 12px; font-weight: 600; }
    .lbl b { font-family: var(--font-mono); color: #2343a8; font-weight: 500; margin-right: 4px; }
    .grid button:focus-visible { outline: 3px solid #2343a8; outline-offset: 2px; }

    .lb { position: absolute; inset: 0; z-index: 10; background: #fff; display: grid; grid-template-rows: auto 1fr auto; animation: in .25s ease-out; }
    @keyframes in { from { opacity: 0; transform: scale(.985); } }
    .bar { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid #e4e8f0; }
    .t { display: grid; margin-right: auto; min-width: 0; }
    .t strong { font-size: 16px; font-weight: 700; } .t span { font-size: 12px; color: #556178; }
    .zoom { display: flex; align-items: center; border: 1px solid #d5dbe7; border-radius: 99px; overflow: hidden; }
    .zoom button { width: 34px; height: 32px; border: 0; background: none; font-size: 18px; cursor: pointer; color: #0b1f3a; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .zoom button:active:not(:disabled), .foot button:active { background: #e3e8f2; }
    .close:active { transform: scale(.92); }
    .tch { display: none; }
    @media (hover: none) { .m { display: none; } .tch { display: inline; } }
    @media (pointer: coarse) {
      .zoom button { width: 42px; height: 40px; }
      .close { width: 40px !important; height: 40px !important; }
      .foot button { min-height: 40px; padding: 8px 18px !important; }
    }
    .t strong, .t span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @container (max-width: 420px) { .bar { gap: 8px; padding: 10px; } .zoom output { width: 40px; } }
    .zoom button:disabled { opacity: .3; cursor: default; }
    .zoom button:hover:not(:disabled) { background: #eef1f7; }
    .zoom output { font-family: var(--font-mono); font-size: 12px; width: 46px; text-align: center; }
    .close { width: 36px; height: 36px; border-radius: 50%; border: 0; background: #0b1f3a; color: #fff; display: grid; place-items: center; cursor: pointer; }
    .close svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
    /* unzoomed: horizontal swipe changes photo, vertical still scrolls the page; zoomed: one-finger pan */
    .view { position: relative; overflow: hidden; min-height: 0; cursor: zoom-in; touch-action: pan-y; -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; background:
      repeating-conic-gradient(#f2f4f8 0 25%, #fff 0 50%) 0 0 / 20px 20px; }
    .view.zoomed { cursor: grab; touch-action: none; } .view.panning { cursor: grabbing; }
    .view img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; transform-origin: 50% 50%; user-select: none;
      transition: transform .45s cubic-bezier(.2,.8,.2,1); animation: in .35s ease-out; }
    .view.panning img { transition: none; }
    .hint { position: absolute; left: 50%; bottom: 14px; translate: -50% 0; background: rgba(11,31,58,.82); color: #fff; font-size: 12px; padding: 5px 12px; border-radius: 99px; pointer-events: none; }
    .foot { display: flex; justify-content: center; align-items: center; gap: 16px; padding: 10px; border-top: 1px solid #e4e8f0; font-size: 12px; }
    .foot button { border: 1px solid #d5dbe7; background: #fff; padding: 6px 14px; border-radius: 99px; font-size: 13px; cursor: pointer; }
    .foot button:hover { border-color: #2343a8; color: #2343a8; }
  `,
})
export class LightboxZoom {
  private readonly injector = inject(Injector);
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly view = viewChild<ElementRef<HTMLElement>>('view');
  protected readonly max = MAX;
  protected readonly details: Detail[] = DETAILS.map(([title, street], id) => ({
    id, title, street, thumb: photo('porto-detail-' + id, 480, 360), full: photo('porto-detail-' + id, 1800, 1350),
  }));
  protected readonly index = signal<number | null>(null);
  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : this.details[i];
  });
  protected readonly scale = signal(1);
  protected readonly tx = signal(0);
  protected readonly ty = signal(0);
  protected readonly panning = signal(false);
  /** live swipe offset while unzoomed */
  protected readonly sdx = signal(0);
  protected readonly Math = Math;
  private swiping = false;
  protected readonly pct = computed(() => Math.round(this.scale() * 100));
  private start = { x: 0, y: 0, tx: 0, ty: 0, moved: false, id: -1 };
  private opener: HTMLElement | null = null;

  constructor() {
    loadGoogleFonts('Archivo:wdth,wght@62..125,400..800');
  }

  open(i: number): void {
    this.opener = document.activeElement as HTMLElement | null;
    this.index.set(i);
    this.reset();
    afterNextRender(() => this.closeBtn()?.nativeElement.focus(), { injector: this.injector });
  }

  close(): void {
    this.index.set(null);
    const o = this.opener;
    afterNextRender(() => o?.focus(), { injector: this.injector });
  }

  step(d: number): void {
    const i = this.index();
    if (i === null) return;
    this.index.set((i + d + this.details.length) % this.details.length);
    this.reset();
  }

  private reset(): void {
    this.scale.set(1);
    this.tx.set(0);
    this.ty.set(0);
  }

  private box(): DOMRect | null {
    return this.view()?.nativeElement.getBoundingClientRect() ?? null;
  }

  /** Zoom so that the point q (relative to the view centre) stays put. */
  private zoomAt(qx: number, qy: number, next: number): void {
    const s = this.scale();
    const n = Math.max(1, Math.min(MAX, next));
    const px = (qx - this.tx()) / s;
    const py = (qy - this.ty()) / s;
    this.scale.set(n);
    this.setPan(qx - n * px, qy - n * py);
  }

  private setPan(x: number, y: number): void {
    const r = this.box();
    const s = this.scale();
    if (!r || s === 1) { this.tx.set(0); this.ty.set(0); return; }
    const mx = ((s - 1) * r.width) / 2;
    const my = ((s - 1) * r.height) / 2;
    this.tx.set(Math.max(-mx, Math.min(mx, x)));
    this.ty.set(Math.max(-my, Math.min(my, y)));
  }

  zoomBy(dir: number): void {
    this.zoomAt(0, 0, this.scale() + dir * 0.75);
  }

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.start = { x: e.clientX, y: e.clientY, tx: this.tx(), ty: this.ty(), moved: false, id: e.pointerId };
    this.swiping = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (this.scale() > 1) this.panning.set(true);
  }

  move(e: PointerEvent): void {
    if (e.pointerId !== this.start.id || !(e.buttons & 1)) return;
    const dx = e.clientX - this.start.x;
    const dy = e.clientY - this.start.y;
    if (Math.abs(dx) + Math.abs(dy) > 8) this.start.moved = true;
    if (this.scale() > 1) { this.setPan(this.start.tx + dx, this.start.ty + dy); return; }
    // unzoomed: a horizontal drag is a swipe to the neighbouring photo
    if (!this.swiping && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { this.swiping = true; this.panning.set(true); }
    if (this.swiping) this.sdx.set(dx);
  }

  cancel(): void {
    this.panning.set(false);
    this.swiping = false;
    this.sdx.set(0);
    this.start.id = -1;
  }

  up(e: PointerEvent): void {
    if (e.pointerId !== this.start.id) return;
    this.start.id = -1;
    this.panning.set(false);
    if (this.swiping) {
      const d = this.sdx();
      this.swiping = false;
      this.sdx.set(0);
      if (Math.abs(d) > 40) this.step(d < 0 ? 1 : -1);
      return;
    }
    if (this.start.moved) return;
    const r = this.box();
    if (!r) return;
    if (this.scale() > 1) { this.reset(); return; }
    this.zoomAt(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2, 2.5);
  }

  wheel(e: WheelEvent): void {
    const r = this.box();
    if (!r) return;
    e.preventDefault();
    this.zoomAt(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2, this.scale() * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  }

  key(e: KeyboardEvent): void {
    if (this.index() === null) return;
    const zoomed = this.scale() > 1;
    switch (e.key) {
      case 'Escape': e.stopPropagation(); this.close(); break;
      case '+': case '=': this.zoomBy(1); break;
      case '-': this.zoomBy(-1); break;
      case '0': this.reset(); break;
      case 'ArrowLeft': e.preventDefault(); zoomed ? this.setPan(this.tx() + 60, this.ty()) : this.step(-1); break;
      case 'ArrowRight': e.preventDefault(); zoomed ? this.setPan(this.tx() - 60, this.ty()) : this.step(1); break;
      case 'ArrowUp': if (zoomed) { e.preventDefault(); this.setPan(this.tx(), this.ty() + 60); } break;
      case 'ArrowDown': if (zoomed) { e.preventDefault(); this.setPan(this.tx(), this.ty() - 60); } break;
    }
  }
}
