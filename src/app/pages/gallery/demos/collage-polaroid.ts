import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Pol {
  id: number;
  note: string;
  src: string;
  x: number; // % of board
  y: number;
  rot: number;
  z: number;
}

const NOTES = ['Big Sur, mile 41', 'Diner in Cambria ♥', 'Joshua Tree 6am', 'Mom + the Buick', 'Route 66, Amboy', 'Salton Sea, weird', 'Marfa lights?', 'Last night in Taos'];
// [x % of free width, y % of board, rotation]
const START: [number, number, number][] = [[5, 8, -7], [31, 4, 4], [60, 10, -3], [86, 6, 8], [12, 46, 5], [41, 42, -9], [67, 48, 6], [93, 44, -4]];

@Component({
  selector: 'demo-collage-polaroid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <h3>Summer ’98, the long way west</h3>
      <button type="button" (click)="shuffle()">Toss them again</button>
    </div>
    <div #board class="board" aria-label="Polaroid collage. Drag photos to rearrange; focus one and use arrow keys to move it.">
      @for (p of items(); track p.id) {
        <figure class="pol" tabindex="0" [class.drag]="dragId() === p.id"
          [style.--x]="p.x" [style.top.%]="p.y" [style.z-index]="p.z" [style.--r.deg]="p.rot"
          (pointerdown)="down($event, p.id)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="up($event)"
          (keydown)="key($event, p.id)" (focus)="front(p.id)" [attr.aria-label]="'Polaroid: ' + p.note">
          <img [src]="p.src" [alt]="'Polaroid photograph — ' + p.note" draggable="false" />
          <figcaption>{{ p.note }}</figcaption>
        </figure>
      }
    </div>
  `,
  styles: `
    :host { display: grid; grid-template-rows: auto 1fr; min-height: 100%; container-type: inline-size;
      background:
        repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 22px),
        repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 22px),
        radial-gradient(120% 100% at 50% 0%, #4a6b93, #23364f);
      color: #fff; }
    .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px clamp(14px, 3cqw, 26px) 0; position: relative; z-index: 100; }
    h3 { font-family: 'Caveat', cursive; font-weight: 700; font-size: clamp(26px, 4cqw, 38px); line-height: 1; }
    .top button { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; background: #ffe066; color: #23364f; border: 0; padding: 4px 14px 6px; border-radius: 4px;
      transform: rotate(-2deg); box-shadow: 0 4px 0 #c9a93a; cursor: pointer; transition: transform .2s; min-height: 40px; flex-shrink: 0;
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .top button:active { transform: rotate(-2deg) translateY(3px); box-shadow: 0 1px 0 #c9a93a; }
    .top button:hover { transform: rotate(1deg) scale(1.04); }
    .board { position: relative; min-height: 470px; margin: 8px; }
    /* x is a % of the free width (board minus card), so cards never spill off a narrow board */
    .pol { --pw: clamp(104px, 21cqw, 190px); position: absolute; margin: 0; width: var(--pw); left: calc((100% - var(--pw)) * var(--x) / 100);
      touch-action: none; -webkit-tap-highlight-color: transparent; padding: 9px 9px 0; background: #fbfbf8; color: #2b2b2b; cursor: grab;
      transform: rotate(var(--r)); box-shadow: 0 2px 2px rgba(0,0,0,.12), 0 14px 24px -10px rgba(0,0,0,.45);
      transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s, left .6s cubic-bezier(.2,.8,.2,1), top .6s cubic-bezier(.2,.8,.2,1); outline: none; user-select: none; }
    .pol.drag { cursor: grabbing; transform: rotate(calc(var(--r) * .3)) scale(1.07); box-shadow: 0 30px 40px -12px rgba(0,0,0,.55); transition: transform .3s, box-shadow .3s; }
    .pol:hover:not(.drag) { transform: rotate(var(--r)) scale(1.03); }
    @media (hover: none) { .pol:hover:not(.drag) { transform: rotate(var(--r)); } }
    @container (max-width: 480px) { .board { min-height: 440px; } h3 { font-size: 24px; } .top { align-items: flex-start; } }
    .pol:focus-visible { box-shadow: 0 0 0 3px #ffe066, 0 14px 24px -10px rgba(0,0,0,.45); }
    .pol img { width: 100%; aspect-ratio: 1; object-fit: cover; pointer-events: none; filter: sepia(.25) saturate(1.2) contrast(.95); }
    figcaption { font-family: 'Caveat', cursive; font-size: clamp(15px, 2cqw, 20px); font-weight: 500; text-align: center; padding: 6px 2px 9px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `,
})
export class CollagePolaroid {
  private readonly board = viewChild.required<ElementRef<HTMLElement>>('board');
  protected readonly items = signal<Pol[]>(NOTES.map((note, id) => ({
    id, note, src: photo('roadtrip-98-' + id, 400, 400), x: START[id][0], y: START[id][1], rot: START[id][2], z: id + 1,
  })));
  protected readonly dragId = signal<number | null>(null);
  private topZ = NOTES.length;
  private grab = { dx: 0, dy: 0, pid: -1 };

  constructor() {
    loadGoogleFonts('Caveat:wght@500;700');
  }

  private patch(id: number, fn: (p: Pol) => Partial<Pol>): void {
    this.items.update((list) => list.map((p) => (p.id === id ? { ...p, ...fn(p) } : p)));
  }

  front(id: number): void {
    const p = this.items().find((i) => i.id === id);
    if (p && p.z !== this.topZ) this.patch(id, () => ({ z: ++this.topZ }));
  }

  down(e: PointerEvent, id: number): void {
    const el = e.currentTarget as HTMLElement;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // offsets from the layout box (not the rotated bounding box) so the card doesn't jump on grab
    const b = this.board().nativeElement.getBoundingClientRect();
    this.grab = { dx: e.clientX - b.left - el.offsetLeft, dy: e.clientY - b.top - el.offsetTop, pid: e.pointerId };
    el.setPointerCapture(e.pointerId);
    this.front(id);
    this.dragId.set(id);
  }

  move(e: PointerEvent): void {
    const id = this.dragId();
    if (id === null || e.pointerId !== this.grab.pid) return;
    const b = this.board().nativeElement.getBoundingClientRect();
    const el = e.currentTarget as HTMLElement;
    const free = Math.max(1, b.width - el.offsetWidth);
    const maxY = 100 - (el.offsetHeight / b.height) * 100;
    const x = ((e.clientX - this.grab.dx - b.left) / free) * 100;
    const y = ((e.clientY - this.grab.dy - b.top) / b.height) * 100;
    this.patch(id, () => ({ x: Math.max(-2, Math.min(102, x)), y: Math.max(-4, Math.min(maxY + 4, y)) }));
  }

  up(e: PointerEvent): void {
    if (e.pointerId !== this.grab.pid) return;
    this.dragId.set(null);
  }

  key(e: KeyboardEvent, id: number): void {
    const d: Record<string, [number, number]> = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    this.patch(id, (p) => ({ x: Math.max(0, Math.min(100, p.x + v[0] * 1.5)), y: Math.max(-4, Math.min(80, p.y + v[1])) }));
  }

  shuffle(): void {
    this.items.update((list) => list.map((p) => ({ ...p, x: Math.random() * 100, y: 2 + Math.random() * 50, rot: Math.round(Math.random() * 22 - 11) })));
  }
}
