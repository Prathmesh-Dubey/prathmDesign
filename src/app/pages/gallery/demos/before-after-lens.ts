import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Mode = 'lens' | 'split';

@Component({
  selector: 'demo-before-after-lens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame" tabindex="0" [class.split]="mode() === 'split'" [class.active]="active()"
      aria-label="Colour reveal. Move the pointer or use arrow keys to move the reveal; plus and minus resize the lens."
      (pointermove)="move($event)" (pointerenter)="active.set(true)" (pointerleave)="leave($event)" (pointerdown)="down($event)"
      (pointerup)="up($event)" (pointercancel)="up($event)"
      (keydown)="key($event)" (wheel)="wheel($event)" (focus)="active.set(true)" (blur)="active.set(false)">
      <img class="mono" [src]="src" alt="Cerro Alegre, Valparaíso — black-and-white silver print by Tomás Vidal" draggable="false" />
      <img class="col" [src]="src" alt="" aria-hidden="true" [style.clip-path]="clip()" draggable="false" />
      @if (mode() === 'lens') {
        <span class="ring" aria-hidden="true" [style.width.px]="r() * 2" [style.height.px]="r() * 2"
          [style.transform]="'translate(' + (x() - r()) + 'px,' + (y() - r()) + 'px)'"></span>
      } @else {
        <span class="line" aria-hidden="true" [style.transform]="'translateY(' + y() + 'px)'"><b>Colour ↓</b><b>↑ Silver</b></span>
      }
      <div class="hud">
        <span>{{ mode() === 'lens' ? 'Lens ' + r() * 2 + 'px' : 'Split ' + splitPct() + '%' }}</span>
      </div>
    </div>
    <div class="bar">
      <div class="t"><strong>Cerro Alegre, Valparaíso</strong><span>Tomás Vidal · silver gelatin vs. original colour</span></div>
      <div class="seg" role="radiogroup" aria-label="Reveal mode">
        <button type="button" role="radio" [attr.aria-checked]="mode() === 'lens'" [class.on]="mode() === 'lens'" (click)="mode.set('lens')">Lens</button>
        <button type="button" role="radio" [attr.aria-checked]="mode() === 'split'" [class.on]="mode() === 'split'" (click)="mode.set('split')">Vertical split</button>
      </div>
      @if (mode() === 'lens') {
        <div class="size">
          <button type="button" (click)="resize(-20)" aria-label="Smaller lens">−</button>
          <button type="button" (click)="resize(20)" aria-label="Larger lens">+</button>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: grid; grid-template-rows: 1fr auto; min-height: 100%; background: #0b0c0e; color: #eef0f2; font-family: 'JetBrains Mono', var(--font-mono); container-type: inline-size; }
    .frame { position: relative; overflow: hidden; min-height: 400px; cursor: none; outline: none; touch-action: none; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; }
    .frame.split { cursor: row-resize; touch-action: pan-x; }
    .frame:focus-visible { box-shadow: inset 0 0 0 2px #46e0d0; }
    .frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; user-select: none; pointer-events: none; }
    .mono { filter: grayscale(1) contrast(1.25) brightness(.95); }
    .col { filter: saturate(1.25) contrast(1.05); transition: clip-path .5s cubic-bezier(.2,.8,.2,1); }
    .frame.active .col { transition: none; }
    .ring { position: absolute; left: 0; top: 0; border-radius: 50%; pointer-events: none; box-shadow: 0 0 0 1.5px #46e0d0, 0 0 0 6px rgba(70,224,208,.15), 0 20px 40px rgba(0,0,0,.4);
      transition: width .25s, height .25s, opacity .3s; opacity: .35; }
    .frame.active .ring { opacity: 1; }
    .frame:not(.active) .ring { transition: transform .5s cubic-bezier(.2,.8,.2,1), width .25s, height .25s, opacity .3s; }
    .line { position: absolute; left: 0; right: 0; top: 0; height: 0; border-top: 1.5px solid #46e0d0; display: flex; justify-content: space-between; padding: 0 12px; pointer-events: none; }
    .frame:not(.active) .line { transition: transform .5s cubic-bezier(.2,.8,.2,1); }
    .line b { font-weight: 500; font-size: 10.5px; background: #46e0d0; color: #0b0c0e; padding: 2px 7px; transform: translateY(-50%); border-radius: 3px; }
    .hud { position: absolute; right: 12px; bottom: 12px; font-size: 11px; background: rgba(11,12,14,.72); padding: 5px 10px; border-radius: 4px; }
    .bar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 14px clamp(14px, 3cqw, 24px); border-top: 1px solid #1d2024; }
    .t { display: grid; margin-right: auto; } .t strong { font-size: 13.5px; font-weight: 500; } .t span { font-size: 11px; color: #858b94; }
    .seg { display: flex; padding: 3px; background: #16181b; border-radius: 8px; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .seg button { border: 0; background: none; color: #a8aeb6; font: inherit; font-size: 12px; padding: 7px 12px; min-height: 34px; border-radius: 6px; cursor: pointer; transition: background .2s, color .2s; }
    .seg button:active { background: #23272c; }
    .seg button.on { background: #46e0d0; color: #0b0c0e; }
    .size { display: flex; gap: 6px; }
    .size button { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #2a2e33; background: #16181b; color: #eef0f2; font-size: 16px; cursor: pointer; }
    .size button:hover { border-color: #46e0d0; }
    .size button:active { background: #23272c; transform: scale(.94); }
    @media (pointer: coarse) {
      .seg button { min-height: 40px; padding: 8px 14px; }
      .size button { width: 40px; height: 40px; }
    }
    @container (max-width: 420px) {
      .frame { min-height: 340px; }
      .bar { gap: 10px; }
      .t { flex: 1 0 100%; }
      .seg { flex: 1; } .seg button { flex: 1; }
    }
  `,
})
export class BeforeAfterLens {
  protected readonly src = photo('valparaiso-cerro', 1400, 900);
  protected readonly mode = signal<Mode>('lens');
  protected readonly active = signal(false);
  protected readonly x = signal(320);
  protected readonly y = signal(200);
  protected readonly r = signal(90);
  private w = 640;
  private h = 400;
  protected readonly splitPct = computed(() => Math.round((this.y() / Math.max(1, this.h)) * 100));
  protected readonly clip = computed(() =>
    this.mode() === 'lens' ? `circle(${this.r()}px at ${this.x()}px ${this.y()}px)` : `inset(0 0 calc(100% - ${this.y()}px) 0)`,
  );

  constructor() {
    loadGoogleFonts('JetBrains+Mono:wght@400;500');
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => {
      const f = host.nativeElement.querySelector<HTMLElement>('.frame');
      if (!f) return;
      const r = this.measure(f);
      this.x.set(r.width * 0.62);
      this.y.set(r.height * 0.45);
    });
  }

  private measure(el: HTMLElement): DOMRect {
    const r = el.getBoundingClientRect();
    this.w = r.width;
    this.h = r.height;
    return r;
  }

  down(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    // capture so a finger can sweep the lens past the frame edge without losing it
    try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    this.move(e);
  }

  up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') this.active.set(false);
  }

  leave(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.active.set(false);
  }

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' && e.type === 'pointermove' && e.buttons === 0) return;
    const r = this.measure(e.currentTarget as HTMLElement);
    this.active.set(true);
    this.x.set(Math.max(0, Math.min(r.width, e.clientX - r.left)));
    this.y.set(Math.max(0, Math.min(r.height, e.clientY - r.top)));
  }

  resize(d: number): void {
    this.r.set(Math.max(40, Math.min(200, this.r() + d)));
  }

  wheel(e: WheelEvent): void {
    // only resize once the frame has focus, so page scrolling is never hijacked
    if (this.mode() !== 'lens' || e.currentTarget !== document.activeElement) return;
    e.preventDefault();
    this.resize(e.deltaY < 0 ? 10 : -10);
  }

  key(e: KeyboardEvent): void {
    this.measure(e.currentTarget as HTMLElement);
    const step = e.shiftKey ? 60 : 20;
    const k = e.key;
    if (k === 'ArrowLeft') this.x.set(Math.max(0, this.x() - step));
    else if (k === 'ArrowRight') this.x.set(Math.min(this.w, this.x() + step));
    else if (k === 'ArrowUp') this.y.set(Math.max(0, this.y() - step));
    else if (k === 'ArrowDown') this.y.set(Math.min(this.h, this.y() + step));
    else if (k === '+' || k === '=') this.resize(20);
    else if (k === '-') this.resize(-20);
    else return;
    e.preventDefault();
  }
}
