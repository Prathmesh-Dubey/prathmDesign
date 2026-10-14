import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

@Component({
  selector: 'demo-drag-rotate-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <header>
        <div>
          <p class="mono">K2 / 35mm rangefinder</p>
          <h3>Kessler K2</h3>
        </div>
        <p class="price">£2,180</p>
      </header>

      <div
        class="turntable"
        tabindex="0"
        role="slider"
        aria-label="Rotate product view"
        aria-valuemin="0"
        aria-valuemax="359"
        [attr.aria-valuenow]="deg()"
        [attr.aria-valuetext]="deg() + ' degrees, ' + face()"
        [class.grabbing]="dragging()"
        (pointerdown)="down($event)"
        (pointermove)="drag($event)"
        (pointerup)="up($event)"
        (pointercancel)="up($event)"
        (keydown)="key($event)"
      >
        <div class="floor" [style.transform]="'scaleX(' + (0.7 + 0.3 * abscos()) + ')'" aria-hidden="true"></div>
        <div class="obj" [style.transform]="'scaleX(' + sx() + ') rotateZ(' + tilt() + 'deg)'" [style.filter]="filter()">
          <img [src]="img" appImgFallback="kessler-k2" alt="Kessler K2 film camera" draggable="false" />
          <div class="light" [style.background-position]="(deg() / 3.6) + '% 50%'" aria-hidden="true"></div>
        </div>
        <p class="hint" [class.gone]="touched()">Drag to rotate</p>
      </div>

      <div class="dial" aria-hidden="true">
        @for (t of ticks; track t) {
          <i [class.on]="t === tick()" [style.transform]="'rotate(' + t * 15 + 'deg) translateY(-34px)'"></i>
        }
        <span class="deg">{{ deg() }}°</span>
      </div>

      <div class="foot">
        <p class="mono face">{{ face() }}</p>
        <div class="views">
          @for (v of views; track v.label) {
            <button type="button" (click)="snap(v.deg)" [class.on]="face() === v.label">{{ v.label }}</button>
          }
        </div>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 30px 16px;
      background: radial-gradient(100% 80% at 50% 10%, #2a2d33, #121315); font-family: 'Geist', sans-serif; color: #eceae6;
    }
    .card { width: min(400px, 100%); border-radius: 26px; padding: 20px; background: #1b1d21; border: 1px solid #2c2f35; box-shadow: 0 40px 80px -40px #000; }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .mono { font-family: 'Geist Mono', monospace; font-size: 11.5px; color: #8c8f96; }
    h3 { font-family: 'Unbounded', sans-serif; font-weight: 600; font-size: 24px; letter-spacing: -.02em; margin-top: 4px; }
    .price { font-family: 'Geist Mono', monospace; font-size: 15px; color: #ffb547; }
    .turntable {
      position: relative; margin-top: 14px; height: 250px; border-radius: 18px; display: grid; place-items: center;
      background: radial-gradient(60% 55% at 50% 45%, #3a3e46, #1f2126 70%); cursor: grab; touch-action: pan-y; user-select: none; overflow: hidden;
    }
    .turntable.grabbing { cursor: grabbing; }
    .turntable:focus-visible { outline: 2px solid #ffb547; outline-offset: 3px; }
    .floor { position: absolute; bottom: 34px; width: 62%; height: 22px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,0,0,.65), transparent); }
    .obj { position: relative; width: 66%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; will-change: transform; box-shadow: 0 0 0 6px #2a2d33, 0 20px 40px -14px rgba(0,0,0,.8); }
    .obj img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .light { position: absolute; inset: 0; mix-blend-mode: soft-light; background: linear-gradient(100deg, rgba(0,0,0,.6), rgba(255,255,255,.55) 45%, rgba(0,0,0,.5) 70%, rgba(255,255,255,.3)); background-size: 300% 100%; }
    .hint { position: absolute; bottom: 10px; font-size: 12px; color: #b7b9be; background: rgba(0,0,0,.35); padding: 4px 10px; border-radius: 999px; transition: opacity .4s; }
    .hint.gone { opacity: 0; }
    .dial { position: relative; width: 84px; height: 84px; margin: -42px auto 0; border-radius: 50%; background: #1b1d21; border: 1px solid #2c2f35; display: grid; place-items: center; z-index: 1; }
    .dial i { position: absolute; top: 50%; left: 50%; width: 2px; height: 6px; margin: -3px 0 0 -1px; background: #474b53; border-radius: 1px; transition: background .2s; }
    .dial i.on { background: #ffb547; height: 9px; }
    .deg { font-family: 'Geist Mono', monospace; font-size: 13px; font-variant-numeric: tabular-nums; }
    .foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
    .face { color: #eceae6; }
    .views { display: flex; gap: 4px; background: #24262b; padding: 4px; border-radius: 999px; }
    .views button { border: 0; background: none; font-size: 12px; padding: 6px 10px; border-radius: 999px; cursor: pointer; color: #a7a9ae; transition: .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .views button:active { transform: scale(.95); }
    @media (pointer: coarse) { .views button { min-height: 38px; padding: 6px 14px; font-size: 13px; } }
    .turntable { -webkit-tap-highlight-color: transparent; }
    .views button.on { background: #ffb547; color: #1b1d21; }
  `,
})
export class DragRotateCard {
  protected readonly img = unsplash(PRODUCT_PHOTOS.camera, 600, 600);
  protected readonly ticks = Array.from({ length: 24 }, (_, i) => i);
  protected readonly views = [
    { label: 'Front', deg: 0 },
    { label: 'Side', deg: 90 },
    { label: 'Back', deg: 180 },
  ];
  protected readonly angle = signal(18);
  protected readonly dragging = signal(false);
  protected readonly touched = signal(false);

  protected readonly deg = computed(() => Math.round(((this.angle() % 360) + 360) % 360));
  private readonly rad = computed(() => (this.angle() * Math.PI) / 180);
  protected readonly abscos = computed(() => Math.abs(Math.cos(this.rad())));
  protected readonly sx = computed(() => {
    const c = Math.cos(this.rad());
    return Math.sign(c || 1) * Math.max(0.18, Math.abs(c));
  });
  protected readonly tilt = computed(() => Math.sin(this.rad()) * 4);
  protected readonly filter = computed(() => {
    const s = Math.sin(this.rad());
    return `brightness(${(0.82 + 0.18 * this.abscos()).toFixed(3)}) hue-rotate(${(s * 14).toFixed(1)}deg)`;
  });
  protected readonly tick = computed(() => Math.round(this.deg() / 15) % 24);
  protected readonly face = computed(() => {
    const d = this.deg();
    if (d < 45 || d >= 315) return 'Front';
    if (d < 135) return 'Side';
    if (d < 225) return 'Back';
    return 'Side';
  });

  private lastX = 0;
  private lastT = 0;
  private vel = 0;
  private raf = 0;

  constructor() {
    loadGoogleFonts('Unbounded:wght@500;600');
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.raf));
  }

  down(e: PointerEvent): void {
    cancelAnimationFrame(this.raf);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.dragging.set(true);
    this.touched.set(true);
    this.lastX = e.clientX;
    this.lastT = performance.now();
    this.vel = 0;
  }

  drag(e: PointerEvent): void {
    if (!this.dragging()) return;
    const now = performance.now();
    const dx = e.clientX - this.lastX;
    this.angle.update((a) => a + dx * 0.9);
    this.vel = (dx * 0.9) / Math.max(1, now - this.lastT);
    this.lastX = e.clientX;
    this.lastT = now;
  }

  up(e: PointerEvent): void {
    if (!this.dragging()) return;
    this.dragging.set(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (prefersReducedMotion()) return;
    let v = this.vel * 16;
    const step = () => {
      v *= 0.94;
      if (Math.abs(v) < 0.05) return;
      this.angle.update((a) => a + v);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  key(e: KeyboardEvent): void {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 15 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -15 : 0;
    if (!d) return;
    e.preventDefault();
    this.touched.set(true);
    this.angle.update((a) => a + d);
  }

  snap(target: number): void {
    cancelAnimationFrame(this.raf);
    this.touched.set(true);
    const start = this.angle();
    const cur = ((start % 360) + 360) % 360;
    let delta = target - cur;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    if (prefersReducedMotion()) {
      this.angle.set(start + delta);
      return;
    }
    const t0 = performance.now();
    const run = (t: number) => {
      const p = Math.min(1, (t - t0) / 600);
      const ease = 1 - Math.pow(1 - p, 3);
      this.angle.set(start + delta * ease);
      if (p < 1) this.raf = requestAnimationFrame(run);
    };
    this.raf = requestAnimationFrame(run);
  }
}
