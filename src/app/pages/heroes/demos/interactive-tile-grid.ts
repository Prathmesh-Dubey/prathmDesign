import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

const ROWS = 8;
const COLS = 16;
const NOTES = [880, 784, 659.3, 587.3, 523.3, 440, 392, 329.6];
const PRESET: Record<number, number[]> = {
  0: [2, 10],
  1: [6, 14],
  2: [4, 7, 12],
  3: [0, 3, 8, 11],
  4: [],
  5: [1, 9, 13],
  6: [4, 12],
  7: [0, 6, 8, 10],
};

@Component({
  selector: 'demo-interactive-tile-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#"><span class="mk" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Grain Audio</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Instruments</a><a href="#">Sound packs</a><a href="#">Learn</a><a href="#">Community</a>
      </nav>
      <a class="cta-sm" href="#">Pre-order Loop 16</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Instruments</a><a href="#" (click)="menu.set(false)">Sound packs</a>
          <a href="#" (click)="menu.set(false)">Learn</a><a href="#" (click)="menu.set(false)">Pre-order</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="tag">Loop 16 · ships March 2026</p>
        <h1>Sixteen steps<br />to a song.</h1>
        <p class="sub">A pocket step sequencer with 128 velocity-sensitive pads, a live sampler and twenty hours of battery. Draw a beat on the grid.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Pre-order · £249</a>
          <a class="btn ghost" href="#">Hear the demos</a>
        </div>
      </section>

      <div class="device">
        <div class="controls">
          <button type="button" class="ctl" (click)="playing.set(!playing())" [attr.aria-pressed]="playing()">{{ playing() ? 'Pause' : 'Play' }}</button>
          <button type="button" class="ctl" (click)="toggleSound()" [attr.aria-pressed]="sound()">Sound {{ sound() ? 'on' : 'off' }}</button>
          <button type="button" class="ctl" (click)="clear()">Clear</button>
          <span class="bpm">112 BPM · step {{ step() + 1 }}/16</span>
        </div>
        <div
          class="grid"
          role="grid"
          aria-label="Step sequencer, 8 rows by 16 steps"
          (pointerdown)="paintStart($event)"
          (pointermove)="paintMove($event)"
          (pointerup)="paintEnd(true)"
          (pointercancel)="paintEnd(false)"
        >
          @for (r of rows; track r) {
            <div class="row" role="row">
              @for (c of cols; track c) {
                <button
                  type="button"
                  role="gridcell"
                  class="tile"
                  [class.on]="cells()[r * 16 + c]"
                  [class.head]="playing() && step() === c"
                  [class.beat]="c % 4 === 0"
                  [style.--row]="r"
                  [attr.aria-pressed]="cells()[r * 16 + c]"
                  [attr.aria-label]="'Row ' + (r + 1) + ', step ' + (c + 1)"
                  [attr.data-i]="r * 16 + c"
                  (click)="keyToggle($event, r, c)"
                ></button>
              }
            </div>
          }
        </div>
        <p class="count">{{ activeCount() }} pads lit · <span class="hint-m">click or drag to draw</span><span class="hint-t">tap or swipe along a row to draw</span></p>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: #18171b; color: #f3eee6; font-family: 'Familjen Grotesk', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 20px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 19px; text-decoration: none; }
    .mk { display: grid; grid-template-columns: repeat(2, 8px); gap: 3px; }
    .mk i { width: 8px; height: 8px; border-radius: 2px; background: #3a383f; }
    .mk i:nth-child(2), .mk i:nth-child(3) { background: #ff3d7f; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { color: rgba(243,238,230,.7); }
    .links a:hover { color: #ff3d7f; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 16px; border-radius: 8px; background: #ff3d7f; color: #18171b; }
    .burger { display: none; margin-left: auto; width: 42px; height: 42px; border-radius: 8px; border: 1px solid #3a383f; background: #232227; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 16px; height: 1.5px; background: #f3eee6; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; border-radius: 12px; background: #232227; border: 1px solid #3a383f; }
    .sheet a { padding: 11px 12px; font-size: 17px; }

    .body { flex: 1; display: grid; grid-template-columns: .85fr 1.15fr; gap: clamp(24px, 4cqi, 56px); align-items: center; padding: 0 clamp(18px, 4.5cqi, 56px) 36px; }
    .tag { font-family: 'Martian Mono', monospace; font-size: 12px; color: #ff3d7f; }
    h1 { font-weight: 700; font-size: clamp(38px, 6.4cqi, 80px); line-height: .95; letter-spacing: -0.04em; margin: 16px 0 18px; }
    .sub { font-size: clamp(15px, 1.6cqi, 17.5px); line-height: 1.6; color: rgba(243,238,230,.72); max-width: 40ch; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 22px; border-radius: 10px; transition: transform .15s, background .2s; }
    .btn.primary { background: #ff3d7f; color: #18171b; }
    .btn.primary:hover { transform: translateY(-2px); background: #ff6b9c; }
    .btn.ghost { box-shadow: inset 0 0 0 1px #45434b; }
    .btn.ghost:hover { box-shadow: inset 0 0 0 1px #f3eee6; }

    .device { padding: clamp(12px, 2cqi, 20px); border-radius: 22px; background: linear-gradient(180deg, #2a292f, #1f1e23); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 40px 70px -40px #000; }
    .controls { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 12px; }
    .ctl { font: 500 12px 'Martian Mono', monospace; color: #f3eee6; padding: 7px 11px; border-radius: 7px; border: 1px solid #3a383f; background: #18171b; cursor: pointer; }
    .ctl[aria-pressed='true'] { border-color: #ff3d7f; color: #ff3d7f; }
    .bpm { margin-left: auto; font: 11px 'Martian Mono', monospace; color: rgba(243,238,230,.55); }
    /* pan-y: a sideways swipe paints a row, a vertical swipe still scrolls the page */
    .grid { display: grid; gap: clamp(3px, .5cqi, 6px); touch-action: pan-y pinch-zoom; -webkit-user-select: none; user-select: none; }
    .row { display: grid; grid-template-columns: repeat(16, 1fr); gap: clamp(3px, .5cqi, 6px); }
    .tile { aspect-ratio: 1; min-width: 0; padding: 0; border: 0; border-radius: clamp(3px, .5cqi, 6px); cursor: pointer;
      background: #2f2e35; box-shadow: inset 0 -2px 0 rgba(0,0,0,.35);
      transition: background 1.1s ease-out, box-shadow 1.1s ease-out, transform .15s; }
    .tile.beat { background: #37353d; }
    @media (hover: hover) {
      .tile:hover { transition-duration: 0s, 0s, .15s; background: color-mix(in srgb, #ff3d7f 55%, #2f2e35); box-shadow: 0 0 18px -2px rgba(255,61,127,.7); }
    }
    .tile.on { background: color-mix(in srgb, #ff3d7f calc(100% - var(--row) * 7%), #ffd0a6); box-shadow: 0 0 14px -4px rgba(255,61,127,.9), inset 0 -2px 0 rgba(0,0,0,.2); }
    .tile.head { transform: scale(.9); }
    .tile.head.on { transform: scale(1.08); background: #fff4ec; box-shadow: 0 0 26px 2px rgba(255,61,127,.95); transition-duration: 0s; }
    .tile:focus-visible { outline: 2px solid #f3eee6; outline-offset: 1px; }
    .count { margin-top: 10px; font: 11px 'Martian Mono', monospace; color: rgba(243,238,230,.5); }
    .hint-t { display: none; }
    @media (hover: none) { .hint-m { display: none; } .hint-t { display: inline; } }
    .ctl { touch-action: manipulation; }
    .ctl:active { scale: .96; }
    @media (pointer: coarse) { .ctl { min-height: 40px; padding: 0 13px; } }

    @container (max-width: 760px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
    }
    @container (max-width: 480px) {
      /* taller pads give fingers a bigger target without widening the 16-step grid */
      .tile { aspect-ratio: 4 / 5; }
      .device { padding: 10px; }
      .bpm { margin-left: 0; flex-basis: 100%; }
    }
  `],
})
export class InteractiveTileGrid {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly rows = Array.from({ length: ROWS }, (_, i) => i);
  protected readonly cols = Array.from({ length: COLS }, (_, i) => i);
  protected readonly cells = signal<boolean[]>(
    Array.from({ length: ROWS * COLS }, (_, i) => (PRESET[Math.floor(i / COLS)] ?? []).includes(i % COLS)),
  );
  protected readonly activeCount = computed(() => this.cells().filter(Boolean).length);
  protected readonly step = signal(0);
  protected readonly playing = signal(!prefersReducedMotion());
  protected readonly sound = signal(false);
  private readonly visible = hostVisible();
  private audio: AudioContext | null = null;
  /** drag-to-draw state: the value being painted, and a touch tap that is not committed until we know it isn't a scroll */
  private paint: { mode: boolean; id: number; pending: number | null; x: number; y: number } | null = null;

  constructor() {
    loadGoogleFonts('Familjen+Grotesk:wght@400;500;700', 'Martian+Mono:wght@400;500');
    effect((onCleanup) => {
      if (!this.visible() || !this.playing()) return;
      const id = setInterval(() => {
        const s = (this.step() + 1) % COLS;
        this.step.set(s);
        if (this.sound()) this.blip(s);
      }, 60000 / 112 / 4);
      onCleanup(() => clearInterval(id));
    });
    inject(DestroyRef).onDestroy(() => void this.audio?.close());
  }

  protected toggle(r: number, c: number): void {
    this.setCell(r * COLS + c, !this.cells()[r * COLS + c]);
  }

  /** Keyboard / assistive activation (pointer presses are handled by the paint handlers). */
  protected keyToggle(e: MouseEvent, r: number, c: number): void {
    if (e.detail === 0) this.toggle(r, c);
  }

  private setCell(i: number, on: boolean): void {
    if (this.cells()[i] === on) return;
    const next = [...this.cells()];
    next[i] = on;
    this.cells.set(next);
    if (this.sound() && on) this.tone(Math.floor(i / COLS), 0);
  }

  private tileAt(x: number, y: number): number | null {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('.tile');
    const i = el?.dataset['i'];
    return i === undefined ? null : +i;
  }

  protected paintStart(e: PointerEvent): void {
    if (e.button !== 0) return;
    const i = this.tileAt(e.clientX, e.clientY);
    if (i === null) return;
    const mode = !this.cells()[i];
    // mouse paints straight away; touch waits so that a scroll starting on the grid doesn't flip a pad
    const touch = e.pointerType !== 'mouse';
    this.paint = { mode, id: e.pointerId, pending: touch ? i : null, x: e.clientX, y: e.clientY };
    if (!touch) this.setCell(i, mode);
  }

  protected paintMove(e: PointerEvent): void {
    const p = this.paint;
    if (!p || p.id !== e.pointerId) return;
    if (e.buttons === 0) {
      // the button was released outside the grid
      this.paint = null;
      return;
    }
    if (p.pending !== null) {
      const dx = Math.abs(e.clientX - p.x);
      const dy = Math.abs(e.clientY - p.y);
      if (dx < 8 || dx < dy) return;
      this.setCell(p.pending, p.mode);
      p.pending = null;
    }
    const i = this.tileAt(e.clientX, e.clientY);
    if (i !== null) this.setCell(i, p.mode);
  }

  protected paintEnd(commit: boolean): void {
    const p = this.paint;
    if (p && commit && p.pending !== null) this.setCell(p.pending, p.mode);
    this.paint = null;
  }

  protected clear(): void {
    this.cells.set(this.cells().map(() => false));
  }

  protected toggleSound(): void {
    if (!this.sound()) {
      this.audio ??= new AudioContext();
      void this.audio.resume();
    }
    this.sound.set(!this.sound());
  }

  private blip(col: number): void {
    const cells = this.cells();
    for (let r = 0; r < ROWS; r++) if (cells[r * COLS + col]) this.tone(r, 0);
  }

  private tone(row: number, delay: number): void {
    const ac = this.audio;
    if (!ac) return;
    const t = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = row > 5 ? 'square' : 'triangle';
    osc.frequency.value = NOTES[row];
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }
}
