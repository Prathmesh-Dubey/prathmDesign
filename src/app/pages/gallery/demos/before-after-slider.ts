import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { photo } from '../../../shared/media';

interface Grade {
  name: string;
  filter: string;
  notes: string;
}

const RAW = 'saturate(.55) contrast(.82) brightness(1.06)';

const GRADES: Grade[] = [
  { name: 'Portra warm', filter: 'contrast(1.08) saturate(1.25) sepia(.18) brightness(1.02) hue-rotate(-6deg)', notes: 'Lifted mids · warm skin · +25 sat' },
  { name: 'Bleach bypass', filter: 'contrast(1.45) saturate(.45) brightness(.96)', notes: 'Crushed blacks · −55 sat · hard contrast' },
  { name: 'Teal & ember', filter: 'contrast(1.2) saturate(1.4) hue-rotate(-14deg) brightness(.98)', notes: 'Cool shadows · ember highlights' },
  { name: 'Silver mono', filter: 'grayscale(1) contrast(1.3) brightness(1.04)', notes: 'Tri-X style · +30 contrast' },
];

@Component({
  selector: 'demo-before-after-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
      <div class="frame" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="cancel()" [class.drag]="dragging()">
        <img class="base" [src]="src" alt="Harbour at Camogli — ungraded raw file by Paolo Ferri" [style.filter]="raw" draggable="false" />
        <div class="after" [style.clip-path]="'inset(0 0 0 ' + pos() + '%)'">
          <img [src]="src" [alt]="'Same photograph with the ' + grade().name + ' grade'" [style.filter]="grade().filter" draggable="false" />
        </div>
        <span class="lab l" [class.hide]="pos() < 14">Raw</span>
        <span class="lab r" [class.hide]="pos() > 86">{{ grade().name }}</span>
        <div class="handle" [style.left.%]="pos()" aria-hidden="true">
          <span class="grip"><svg viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></svg></span>
        </div>
        <input class="range" type="range" min="0" max="100" step="1" [value]="pos()" (input)="onRange($event)"
          aria-label="Comparison position: raw on the left, graded on the right" [attr.aria-valuetext]="pos() + '% raw'" />
      </div>

      <div class="panel">
        <div class="meta">
          <strong>Camogli, Liguria</strong>
          <span>Paolo Ferri · 35mm · f/8 · 1/500</span>
        </div>
        <div class="grades" role="radiogroup" aria-label="Colour grade">
          @for (g of grades; track g.name; let i = $index) {
            <button type="button" role="radio" [attr.aria-checked]="gi() === i" [class.on]="gi() === i" (click)="gi.set(i)">
              <img [src]="thumb" alt="" [style.filter]="g.filter" />
              <span>{{ g.name }}</span>
            </button>
          }
        </div>
        <p class="notes mono">{{ grade().notes }}</p>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #111214; color: #e9eaee; padding: clamp(12px, 2.4cqw, 24px); }
    .mono { font-family: var(--font-mono); }
    .app { display: grid; grid-template-columns: 1fr 230px; gap: 16px; height: 100%; }
    @container (max-width: 700px) { .app { grid-template-columns: 1fr; } }
    .frame { position: relative; border-radius: 12px; overflow: hidden; min-height: 380px; touch-action: pan-y; cursor: ew-resize; user-select: none; background: #1c1d21; }
    .frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .after { position: absolute; inset: 0; }
    .frame:not(.drag) .after { transition: clip-path .35s cubic-bezier(.2,.8,.2,1); }
    .frame:not(.drag) .handle { transition: left .35s cubic-bezier(.2,.8,.2,1); }
    .after img { transition: filter .5s ease; }
    .handle { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: #fff; box-shadow: 0 0 12px rgba(0,0,0,.4); pointer-events: none; }
    .grip { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; background: #fff; color: #111214;
      display: grid; place-items: center; box-shadow: 0 6px 18px rgba(0,0,0,.35); transition: transform .2s; }
    .frame.drag .grip { transform: scale(.9); }
    .grip svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .range { position: absolute; inset: auto 0 0; width: 100%; opacity: 0; height: 1px; pointer-events: none; }
    .frame:has(.range:focus-visible) .grip { box-shadow: 0 0 0 3px #111214, 0 0 0 5px #7aa2ff; }
    .lab { position: absolute; top: 12px; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: rgba(17,18,20,.7); backdrop-filter: blur(6px); transition: opacity .2s; }
    .lab.l { left: 12px; } .lab.r { right: 12px; } .lab.hide { opacity: 0; }
    .panel { display: flex; flex-direction: column; gap: 14px; background: #191a1e; border: 1px solid #26272d; border-radius: 12px; padding: 14px; }
    .meta { display: grid; gap: 2px; } .meta strong { font-size: 15px; font-weight: 600; } .meta span { font-size: 12px; color: #8b8d97; }
    .grades { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .grades button { display: grid; gap: 6px; padding: 6px; border-radius: 10px; border: 1px solid #2a2b31; background: #121316; color: inherit; font-size: 11.5px; text-align: left; cursor: pointer; transition: border-color .2s, background .2s; }
    .grades button img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 6px; transition: filter .3s; }
    .grades button:hover { border-color: #4a4c55; }
    .grades button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .grades button:active { transform: scale(.97); }
    .grades button.on { border-color: #7aa2ff; background: #1a2033; }
    .notes { font-size: 11px; color: #9ea1ab; line-height: 1.5; margin-top: auto; }
    @container (max-width: 700px) { .grades { grid-template-columns: repeat(4, 1fr); } .grades button span { font-size: 10px; } }
  `,
})
export class BeforeAfterSlider {
  protected readonly src = photo('camogli-harbour', 1400, 900);
  protected readonly thumb = photo('camogli-harbour', 240, 180);
  protected readonly raw = RAW;
  protected readonly grades = GRADES;
  protected readonly gi = signal(0);
  protected readonly grade = computed(() => GRADES[this.gi()]);
  protected readonly pos = signal(50);
  protected readonly dragging = signal(false);
  private rect: DOMRect | null = null;
  /** touch/pen: pending gesture that hasn't decided between scroll and drag yet */
  private pending: { id: number; x: number; y: number } | null = null;

  down(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    this.rect = el.getBoundingClientRect();
    if (e.pointerType === 'mouse') {
      el.setPointerCapture(e.pointerId);
      this.dragging.set(true);
      this.update(e.clientX);
      return;
    }
    // finger: wait to see whether this is a horizontal drag or a vertical page scroll
    this.pending = { id: e.pointerId, x: e.clientX, y: e.clientY };
  }

  move(e: PointerEvent): void {
    if (this.dragging()) { this.update(e.clientX); return; }
    const p = this.pending;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      this.pending = null;
      this.dragging.set(true);
      this.update(e.clientX);
    } else if (Math.abs(dy) > 10) {
      this.pending = null;
    }
  }

  up(e: PointerEvent): void {
    // a tap without movement jumps the divider to the tapped spot
    if (this.pending && this.pending.id === e.pointerId) this.update(e.clientX);
    this.pending = null;
    this.dragging.set(false);
  }

  cancel(): void {
    this.pending = null;
    this.dragging.set(false);
  }

  private update(x: number): void {
    if (!this.rect) return;
    this.pos.set(Math.round(Math.max(0, Math.min(100, ((x - this.rect.left) / this.rect.width) * 100)) * 10) / 10);
  }

  onRange(e: Event): void {
    this.pos.set(+(e.target as HTMLInputElement).value);
  }
}
