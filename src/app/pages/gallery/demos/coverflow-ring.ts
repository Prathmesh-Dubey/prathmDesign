import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Tower {
  id: number;
  name: string;
  city: string;
  height: string;
  src: string;
}

const TOWERS: [string, string, string][] = [
  ['Torre Velasca', 'Milan', '106 m'],
  ['Marina City', 'Chicago', '179 m'],
  ['Kanchanjunga', 'Mumbai', '84 m'],
  ['Bosco Verticale', 'Milan', '111 m'],
  ['The Interlace', 'Singapore', '83 m'],
  ['Turning Torso', 'Malmö', '190 m'],
  ['Elbphilharmonie', 'Hamburg', '110 m'],
  ['Nakagin Tower', 'Tokyo', '54 m'],
  ['Torre Agbar', 'Barcelona', '144 m'],
  ['Absolute World', 'Mississauga', '176 m'],
];

const N = TOWERS.length;
const STEP = 360 / N;

@Component({
  selector: 'demo-coverflow-ring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.arrowright)': 'step(1)', '(keydown.arrowleft)': 'step(-1)' },
  template: `
    <section class="wrap" role="region" aria-roledescription="carousel" aria-label="Vertical City towers" tabindex="0">
      <header>
        <h3>Vertical City</h3>
        <p>Ten towers · photographed by Lea Brandt</p>
      </header>
      <div class="scene" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up()" (pointercancel)="up()"
        (pointerenter)="hover.set(true)" (pointerleave)="hover.set(false)">
        <div class="ring" [style.transform]="'translateZ(' + -radius + 'px) rotateY(' + rot() + 'deg)'">
          @for (t of towers; track t.id; let i = $index) {
            <button type="button" class="panel" tabindex="-1" (click)="clickPanel(i)" [attr.aria-label]="t.name + ', ' + t.city"
              [style.transform]="'rotateY(' + i * stepDeg + 'deg) translateZ(' + radius + 'px)'" [style.filter]="'brightness(' + light(i) + ')'">
              <img [src]="t.src" [alt]="'Photograph of ' + t.name + ', ' + t.city" draggable="false" />
              <span>{{ (i + 1).toString().padStart(2, '0') }}</span>
            </button>
          }
        </div>
      </div>
      <footer aria-live="polite">
        <div><strong>{{ front().name }}</strong><span>{{ front().city }} · {{ front().height }}</span></div>
        <div class="btns">
          <button type="button" (click)="step(-1)" aria-label="Rotate to previous tower"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" /></svg></button>
          <button type="button" (click)="auto.set(!auto())" [attr.aria-label]="auto() ? 'Stop auto-rotation' : 'Start auto-rotation'" class="txt">{{ auto() ? 'Auto' : 'Still' }}</button>
          <button type="button" (click)="step(1)" aria-label="Rotate to next tower"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg></button>
        </div>
      </footer>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; color: #e6f4ff; overflow: hidden; container-type: inline-size;
      background: radial-gradient(70% 55% at 50% 55%, #0f2747, #050b18 75%); }
    .wrap { display: grid; grid-template-rows: auto 1fr auto; height: 100%; min-height: 540px; padding: 22px clamp(16px, 4cqw, 36px); outline: none; }
    .wrap:focus-visible { box-shadow: inset 0 0 0 2px #4fd1ff; }
    header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; }
    h3 { font-family: 'Michroma', sans-serif; font-weight: 400; font-size: clamp(18px, 3cqw, 28px); letter-spacing: .08em; text-transform: uppercase; }
    header p { font-size: 12.5px; color: #7f9bb8; }
    .scene { position: relative; perspective: 1200px; perspective-origin: 50% 40%; cursor: grab; touch-action: pan-y; user-select: none; display: grid; place-items: center; min-height: 360px; }
    .scene:active { cursor: grabbing; }
    .ring { position: relative; width: 170px; height: 250px; transform-style: preserve-3d; }
    .panel { position: absolute; inset: 0; padding: 0; border: 0; border-radius: 6px; overflow: hidden; background: #0d1a2e; cursor: pointer; touch-action: pan-y; -webkit-tap-highlight-color: transparent;
      backface-visibility: hidden; box-shadow: 0 0 0 1px rgba(79,209,255,.18); }
    .panel img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .panel span { position: absolute; left: 8px; top: 6px; font-family: 'Michroma', sans-serif; font-size: 10px; color: #4fd1ff; }
    footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
    footer strong { display: block; font-family: 'Michroma', sans-serif; font-weight: 400; font-size: 16px; letter-spacing: .04em; }
    footer span { font-size: 12.5px; color: #7f9bb8; }
    .btns { display: flex; gap: 6px; }
    .btns button { height: 38px; min-width: 38px; border-radius: 99px; border: 1px solid #1f3b5e; background: rgba(79,209,255,.06); color: #e6f4ff; display: grid; place-items: center; cursor: pointer; }
    .btns button:hover { border-color: #4fd1ff; }
    .btns button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .btns button:active { background: rgba(79,209,255,.2); transform: scale(.94); }
    @media (pointer: coarse) { .btns button { height: 44px; min-width: 44px; } }
    @container (max-width: 420px) { .wrap { min-height: 500px; } .scene { min-height: 320px; } .btns { margin-left: auto; } }
    .btns .txt { padding: 0 12px; font-family: 'Michroma', sans-serif; font-size: 10px; letter-spacing: .08em; }
    .btns svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  `,
})
export class CoverflowRing {
  protected readonly towers: Tower[] = TOWERS.map(([name, city, height], id) => ({ id, name, city, height, src: photo('vertical-city-' + id, 340, 500) }));
  protected readonly stepDeg = STEP;
  protected readonly radius = Math.round(170 / 2 / Math.tan(Math.PI / N)) + 40;
  protected readonly rot = signal(0);
  protected readonly hover = signal(false);
  protected readonly auto = signal(!prefersReducedMotion());
  private readonly visible = hostVisible();
  /** Index of the panel currently facing the viewer. */
  protected readonly front = computed(() => {
    const i = Math.round(-this.rot() / STEP);
    return this.towers[((i % N) + N) % N];
  });
  private dragging = false;
  private sx = 0;
  private startRot = 0;
  private moved = false;
  private v = 0;
  private lastX = 0;
  private target: number | null = null;

  constructor() {
    loadGoogleFonts('Michroma');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(48, now - last);
        last = now;
        if (this.visible() && !this.dragging) {
          const r = this.rot();
          if (this.target !== null) {
            const next = r + (this.target - r) * 0.12;
            if (Math.abs(this.target - next) < 0.05) { this.rot.set(this.target); this.target = null; } else this.rot.set(next);
          } else if (Math.abs(this.v) > 0.02) {
            this.rot.set(r + this.v);
            this.v *= 0.94;
            if (Math.abs(this.v) <= 0.02) this.snap();
          } else if (this.auto() && !this.hover()) {
            this.rot.set(r - 0.012 * dt);
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      destroyRef.onDestroy(() => cancelAnimationFrame(raf));
    });
  }

  light(i: number): number {
    const a = ((i * STEP + this.rot()) * Math.PI) / 180;
    return Math.round((0.35 + 0.65 * Math.max(0, Math.cos(a))) * 100) / 100;
  }

  private snap(): void {
    this.target = Math.round(this.rot() / STEP) * STEP;
  }

  step(d: number): void {
    const base = this.target ?? Math.round(this.rot() / STEP) * STEP;
    this.v = 0;
    this.target = base - d * STEP;
  }

  clickPanel(i: number): void {
    if (this.moved) return;
    const r = this.rot();
    // nearest equivalent angle that puts panel i in front
    const want = -i * STEP;
    const k = Math.round((r - want) / 360);
    this.v = 0;
    this.target = want + k * 360;
  }

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.dragging = true;
    this.moved = false;
    this.target = null;
    this.v = 0;
    this.sx = this.lastX = e.clientX;
    this.startRot = this.rot();
  }

  move(e: PointerEvent): void {
    if (!this.dragging) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) { this.up(); return; }
    const dx = e.clientX - this.sx;
    if (!this.moved && Math.abs(dx) > 8) {
      this.moved = true;
      // capture only once it is a real drag, so plain clicks still reach the panels
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    this.v = (e.clientX - this.lastX) * 0.25;
    this.lastX = e.clientX;
    this.rot.set(this.startRot + dx * 0.25);
  }

  up(): void {
    if (!this.dragging) return;
    this.dragging = false;
    if (Math.abs(this.v) <= 0.02) this.snap();
  }
}
