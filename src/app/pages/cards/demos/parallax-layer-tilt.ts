import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

@Component({
  selector: 'demo-parallax-layer-tilt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="scene"
      (pointerdown)="press($event)"
      (pointermove)="aim($event)"
      (pointerup)="lift($event)"
      (pointercancel)="lift($event)"
      (pointerleave)="leave($event)"
    >
      <div
        class="card"
        [style.--cx]="x()"
        [style.--cy]="y()"
        tabindex="0"
        role="img"
        aria-label="Illustrated poster: Torres del Paine National Park, Patagonia. Move the pointer, drag a finger across it or use arrow keys to tilt."
        (keydown.arrowleft)="nudge(-0.5, 0, $event)"
        (keydown.arrowright)="nudge(0.5, 0, $event)"
        (keydown.arrowup)="nudge(0, -0.5, $event)"
        (keydown.arrowdown)="nudge(0, 0.5, $event)"
        (blur)="release()"
      >
        <div class="window">
          <svg class="layer sky" style="--d: 4" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="plx-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#1d3557" />
                <stop offset=".55" stop-color="#e76f51" />
                <stop offset="1" stop-color="#f4a261" />
              </linearGradient>
            </defs>
            <rect width="320" height="440" fill="url(#plx-sky)" />
            <circle cx="70" cy="60" r="1.4" fill="#fff" opacity=".7" /><circle cx="250" cy="40" r="1" fill="#fff" opacity=".6" />
            <circle cx="190" cy="90" r="1.2" fill="#fff" opacity=".5" /><circle cx="40" cy="130" r="1" fill="#fff" opacity=".5" />
          </svg>
          <svg class="layer" style="--d: 8" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="210" cy="230" r="46" fill="#ffd6a5" />
          </svg>
          <svg class="layer" style="--d: 14" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-20 300 L40 210 L70 240 L110 140 L130 170 L150 110 L172 165 L196 130 L230 220 L270 180 L340 290 L340 440 L-20 440Z" fill="#6d597a" />
            <path d="M150 110 L162 140 L156 138 L150 150 L144 136 L138 140Z M110 140 L120 160 L112 158 L106 166Z" fill="#f1e3f3" opacity=".85" />
          </svg>
          <svg class="layer" style="--d: 22" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-20 330 Q 60 270 120 300 T 240 290 T 340 300 L340 440 L-20 440Z" fill="#355070" />
          </svg>
          <svg class="layer" style="--d: 32" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-20 360 Q 80 330 160 352 T 340 345 L340 440 L-20 440Z" fill="#1d2d44" />
            <rect x="-20" y="372" width="360" height="8" fill="#f4a261" opacity=".35" />
          </svg>
          <svg class="layer" style="--d: 46" viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="#0d1321">
              <path d="M20 440 L20 360 L8 380 L20 340 L4 362 L22 300 L40 362 L24 340 L36 380 L24 360 L24 440Z" />
              <path d="M290 440 L290 350 L276 372 L290 320 L272 346 L292 270 L312 346 L294 320 L308 372 L294 350 L294 440Z" />
              <rect x="-20" y="410" width="360" height="40" />
            </g>
          </svg>
          <div class="glare" aria-hidden="true"></div>
        </div>
        <div class="title" aria-hidden="true">
          <span class="np">Parque Nacional</span>
          <span class="big">Torres<br />del Paine</span>
        </div>
        <span class="badge" aria-hidden="true">Est.<br />1959</span>
        <span class="foot" aria-hidden="true">Patagonia · Chile</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 40px 16px;
      background: radial-gradient(90% 70% at 50% 30%, #e3eef0, #bcd3d8); font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size;
    }
    .scene {
      perspective: 1000px; padding: clamp(14px, 8cqi, 30px);
      /* sideways finger drags tilt; vertical drags keep scrolling the page */
      touch-action: pan-y; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none;
    }
    .card {
      --cx: 0; --cy: 0;
      position: relative; width: min(300px, calc(100cqi - 2 * clamp(14px, 8cqi, 30px) - 16px)); aspect-ratio: 320 / 440; transform-style: preserve-3d;
      transform: rotateY(calc(var(--cx) * 14deg)) rotateX(calc(var(--cy) * -14deg));
      outline: none; border-radius: 20px;
    }
    .card:focus-visible .window { box-shadow: 0 0 0 3px #1d3557, 0 40px 60px -30px rgba(13,19,33,.6); }
    .window {
      position: absolute; inset: 0; border-radius: 20px; overflow: hidden; background: #1d3557;
      box-shadow: 0 40px 60px -30px rgba(13,19,33,.6), 0 0 0 6px #fdfaf3;
    }
    .layer {
      position: absolute; inset: -6%; width: 112%; height: 112%; max-width: none;
      transform: translate3d(calc(var(--cx) * var(--d) * -1px), calc(var(--cy) * var(--d) * -1px), 0);
      will-change: transform;
    }
    .glare {
      position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
      background: radial-gradient(70% 50% at calc(50% + var(--cx) * 40%) calc(30% + var(--cy) * 40%), rgba(255,255,255,.55), transparent 60%);
    }
    .title { position: absolute; left: 22px; top: 22px; transform: translateZ(70px); color: #fdfaf3; text-shadow: 0 6px 18px rgba(13,19,33,.35); display: flex; flex-direction: column; }
    .np { font-size: 11px; letter-spacing: .14em; font-weight: 500; }
    .big { font-family: 'Abril Fatface', serif; font-size: clamp(34px, 13cqi, 44px); line-height: .9; margin-top: 4px; }
    .badge {
      position: absolute; right: -14px; top: 46%; width: 66px; height: 66px; border-radius: 50%; background: #fdfaf3; color: #1d3557;
      display: grid; place-items: center; text-align: center; font-family: 'Abril Fatface', serif; font-size: 14px; line-height: 1;
      transform: translateZ(110px) rotate(12deg); box-shadow: 0 16px 28px -14px rgba(13,19,33,.6);
    }
    .foot { position: absolute; left: 22px; bottom: 18px; color: #fdfaf3; font-size: 12px; letter-spacing: .1em; transform: translateZ(40px); opacity: .9; }
  `,
})
export class ParallaxLayerTilt {
  protected readonly x = signal(0);
  protected readonly y = signal(0);
  private tx = 0;
  private ty = 0;
  private raf = 0;
  private readonly reduced = prefersReducedMotion();

  constructor() {
    loadGoogleFonts('Abril+Fatface');
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.raf));
  }

  private pressing = false;

  protected press(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.pressing = true;
    this.aim(e);
  }

  protected lift(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.pressing = false;
    this.release();
  }

  protected leave(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.release();
  }

  protected aim(e: PointerEvent): void {
    if (this.reduced || (e.pointerType !== 'mouse' && !this.pressing)) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    this.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    this.loop();
  }

  protected release(): void {
    this.tx = 0;
    this.ty = 0;
    this.loop();
  }

  protected nudge(dx: number, dy: number, e: Event): void {
    e.preventDefault();
    this.tx = Math.max(-1, Math.min(1, this.tx + dx));
    this.ty = Math.max(-1, Math.min(1, this.ty + dy));
    if (this.reduced) {
      this.x.set(this.tx);
      this.y.set(this.ty);
      return;
    }
    this.loop();
  }

  private loop(): void {
    if (this.raf) return;
    const step = () => {
      const nx = this.x() + (this.tx - this.x()) * 0.12;
      const ny = this.y() + (this.ty - this.y()) * 0.12;
      const done = Math.abs(this.tx - nx) < 0.002 && Math.abs(this.ty - ny) < 0.002;
      this.x.set(done ? this.tx : nx);
      this.y.set(done ? this.ty : ny);
      this.raf = done ? 0 : requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
}
