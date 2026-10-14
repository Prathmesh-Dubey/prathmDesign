import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

type Dir = 0 | 1 | 2 | 3; // top, right, bottom, left

interface Spot {
  id: number;
  name: string;
  ward: string;
  time: string;
  src: string;
}

const SPOTS: [string, string, string][] = [
  ['Omoide Yokochō', 'Shinjuku', '23:48'],
  ['Golden Gai', 'Shinjuku', '01:12'],
  ['Nonbei Yokochō', 'Shibuya', '22:05'],
  ['Yūrakuchō arches', 'Chiyoda', '20:40'],
  ['Ameyoko after close', 'Taitō', '21:55'],
  ['Kabukichō 1-chōme', 'Shinjuku', '02:30'],
];

const OFF = ['translate(0,-101%)', 'translate(101%,0)', 'translate(0,101%)', 'translate(-101%,0)'];
const NUDGE = ['translate(0,4%)', 'translate(-4%,0)', 'translate(0,-4%)', 'translate(4%,0)'];
const ARROWS = ['↓', '←', '↑', '→'];
const SIDES = ['top', 'right', 'bottom', 'left'];

@Component({
  selector: 'demo-hover-direction-aware',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h3>Tokyo, after the last train</h3>
      <p class="hint-hover">Hover from any side — the caption follows your pointer in.</p>
      <p class="hint-touch">Tap near any edge — the caption slides in from that side.</p>
    </header>
    <ul class="grid" role="list">
      @for (s of spots; track s.id; let i = $index) {
        <li class="tile" tabindex="0" [attr.aria-label]="s.name + ', ' + s.ward + ', ' + s.time"
          [attr.aria-expanded]="open() === i"
          (pointerenter)="enter($event, i)" (pointerleave)="leave($event, i)" (pointerdown)="pdown($event)" (pointerup)="pup($event, i)"
          (focus)="focusIn($event, i)" (blur)="focusOut($event, i)" (keydown.enter)="keyToggle($event, i)" (keydown.space)="keyToggle($event, i)">
          <img [src]="s.src" [alt]="'Night photograph ' + (i + 1) + ': ' + s.name + ', ' + s.ward" loading="lazy" />
          <div class="ov">
            <span class="dir mono">{{ arrows[dirs()[i]] }} from {{ sides[dirs()[i]] }}</span>
            <strong>{{ s.name }}</strong>
            <span class="meta"><span>{{ s.ward }}</span><span class="mono">{{ s.time }}</span></span>
          </div>
        </li>
      }
    </ul>
    <p class="credit">Photographs by Riku Tanabe · Fujifilm X100V</p>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #08080d; color: #f2f2f7; padding: clamp(16px, 3cqw, 30px);
      font-family: 'Space Grotesk', var(--font-body); }
    .mono { font-family: var(--font-mono); }
    header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; }
    h3 { font-size: clamp(22px, 3.4cqw, 34px); font-weight: 700; letter-spacing: -0.03em; }
    header p { font-size: 13px; color: #8b8ba3; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    @container (max-width: 560px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    .tile { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #16161f; outline: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .hint-touch { display: none; }
    @media (hover: none) { .hint-hover { display: none; } .hint-touch { display: block; } }
    @container (max-width: 560px) {
      .tile { aspect-ratio: 4 / 5; }
      .ov { padding: 12px; }
      .dir { top: 10px; right: 10px; font-size: 10px; }
      .meta { flex-direction: column; gap: 2px; font-size: 11.5px; }
    }
    .tile img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.15); transform: scale(1.08); }
    .ov { position: absolute; inset: 0; display: grid; align-content: end; gap: 4px; padding: 16px;
      background: linear-gradient(160deg, rgba(255,46,136,.86), rgba(64,36,255,.86)); transform: translate(0,101%); }
    .dir { position: absolute; top: 12px; right: 14px; font-size: 11px; opacity: .8; }
    strong { font-size: clamp(18px, 2.6cqw, 26px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }
    .meta { display: flex; justify-content: space-between; font-size: 12.5px; opacity: .88; }
    .tile:focus-visible { box-shadow: inset 0 0 0 2px #ff2e88; }
    .credit { font-size: 12px; color: #6d6d85; margin-top: 14px; }
  `,
})
export class HoverDirectionAware {
  protected readonly spots: Spot[] = SPOTS.map(([name, ward, time], id) => ({ id, name, ward, time, src: photo('tokyo-night-' + id, 800, 600) }));
  protected readonly arrows = ARROWS;
  protected readonly sides = SIDES;
  protected readonly dirs = signal<Dir[]>(SPOTS.map(() => 2 as Dir));
  private readonly still = prefersReducedMotion();

  constructor() {
    loadGoogleFonts('Space+Grotesk:wght@400;500;700');
  }

  /** tile opened by tap or keyboard (index) */
  protected readonly open = signal<number | null>(null);
  private down: { id: number; x: number; y: number } | null = null;

  private side(e: { clientX: number; clientY: number }, el: HTMLElement): Dir {
    const r = el.getBoundingClientRect();
    const w = r.width, h = r.height;
    const x = (e.clientX - r.left - w / 2) * (w > h ? h / w : 1);
    const y = (e.clientY - r.top - h / 2) * (h > w ? w / h : 1);
    return (Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4) as Dir;
  }

  private play(tile: HTMLElement, d: Dir, entering: boolean): void {
    const ov = tile.querySelector<HTMLElement>('.ov');
    const img = tile.querySelector<HTMLElement>('img');
    if (!ov || !img) return;
    const opts: KeyframeAnimationOptions = { duration: this.still ? 1 : 420, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' };
    ov.animate(entering ? [{ transform: OFF[d] }, { transform: 'none' }] : [{ transform: getComputedStyle(ov).transform }, { transform: OFF[d] }], opts);
    img.animate(entering ? [{ transform: 'scale(1.08)' }, { transform: `scale(1.08) ${NUDGE[d]}` }] : [{ transform: getComputedStyle(img).transform }, { transform: 'scale(1.08)' }], opts);
  }

  private setDir(i: number, d: Dir): void {
    this.dirs.update((a) => a.map((v, j) => (j === i ? d : v)));
  }

  private tileAt(i: number, from: HTMLElement): HTMLElement | null {
    return from.parentElement?.children[i] as HTMLElement | null;
  }

  // ---- mouse: true hover, direction from the entry / exit edge
  enter(e: PointerEvent, i: number): void {
    if (e.pointerType !== 'mouse') return;
    const tile = e.currentTarget as HTMLElement;
    if (this.open() === i) { this.open.set(null); return; } // already showing (keyboard)
    const d = this.side(e, tile);
    this.setDir(i, d);
    this.play(tile, d, true);
  }

  leave(e: PointerEvent, i: number): void {
    if (e.pointerType !== 'mouse') return;
    const tile = e.currentTarget as HTMLElement;
    if (tile === document.activeElement) tile.blur();
    this.play(tile, this.side(e, tile), false);
  }

  // ---- touch / pen: tap toggles, direction from the edge nearest the finger
  pdown(e: PointerEvent): void {
    this.down = e.pointerType === 'mouse' ? null : { id: e.pointerId, x: e.clientX, y: e.clientY };
  }

  pup(e: PointerEvent, i: number): void {
    const d0 = this.down;
    this.down = null;
    if (!d0 || d0.id !== e.pointerId || Math.hypot(e.clientX - d0.x, e.clientY - d0.y) > 10) return;
    const tile = e.currentTarget as HTMLElement;
    const prev = this.open();
    if (prev !== null && prev !== i) {
      // the old caption leaves toward the new tap — direction-aware on the way out too
      const old = this.tileAt(prev, tile);
      if (old) this.play(old, this.side(e, old), false);
    }
    const d = this.side(e, tile);
    if (prev === i) {
      this.open.set(null);
      this.play(tile, d, false);
    } else {
      this.open.set(i);
      this.setDir(i, d);
      this.play(tile, d, true);
    }
  }

  // ---- keyboard
  keyToggle(e: Event, i: number): void {
    e.preventDefault();
    const tile = e.currentTarget as HTMLElement;
    if (this.open() === i) { this.open.set(null); this.play(tile, 2, false); }
    else { this.open.set(i); this.setDir(i, 2); this.play(tile, 2, true); }
  }

  focusIn(e: FocusEvent, i: number): void {
    const tile = e.currentTarget as HTMLElement;
    // pointer focus (tap/click) is handled by the pointer handlers; only keyboard focus opens here
    if (!tile.matches(':focus-visible') || tile.matches(':hover') || this.open() === i) return;
    this.open.set(i);
    this.setDir(i, 2);
    this.play(tile, 2, true);
  }

  focusOut(e: FocusEvent, i: number): void {
    const tile = e.currentTarget as HTMLElement;
    // focus moved elsewhere (Tab, or a tap outside the grid) while this caption was open
    if (this.open() === i) {
      this.open.set(null);
      this.play(tile, 2, false);
    }
  }
}
