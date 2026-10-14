import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';

@Component({
  selector: 'demo-tilt-holo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scene">
      <div
        class="card"
        [class.touching]="touching()"
        (pointerdown)="down($event)"
        (pointermove)="move($event)"
        (pointerup)="up($event)"
        (pointercancel)="up($event)"
        (pointerleave)="leave($event)"
        [style.--rx.deg]="rx()"
        [style.--ry.deg]="ry()"
        [style.--mx.%]="mx()"
        [style.--my.%]="my()"
      >
        <img [src]="img" alt="Field pass photograph for Aurora Ridge" draggable="false" />
        <div class="shine" aria-hidden="true"></div>
        <div class="body">
          <span class="kicker">Field pass</span>
          <h3>Aurora Ridge</h3>
          <p>Tromsø, Norway — 69.6° N</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: grid; place-items: center; padding: 48px 16px; background: radial-gradient(120% 90% at 50% 0%, #1d2350, #0a0d1f); container-type: inline-size; }
    .scene { perspective: 900px; }
    .card {
      --rx: 0deg; --ry: 0deg; --mx: 50%; --my: 50%;
      position: relative; width: min(300px, 86cqi); aspect-ratio: 3 / 4.2; border-radius: 22px; overflow: hidden;
      transform: rotateX(var(--rx)) rotateY(var(--ry));
      transform-style: preserve-3d;
      transition: transform .2s ease-out;
      box-shadow: 0 30px 60px -20px rgba(0,0,0,.7);
      color: #fff; cursor: grab;
      /* horizontal finger drags tilt the card; vertical ones still scroll the page */
      touch-action: pan-y; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none;
    }
    .card.touching { transition-duration: .08s; }
    img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .shine {
      position: absolute; inset: 0; mix-blend-mode: color-dodge; opacity: .55;
      background:
        radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,.55), transparent 40%),
        linear-gradient(115deg, transparent 20%, rgba(120,200,255,.35) 40%, rgba(255,120,220,.35) 55%, transparent 75%);
      background-size: 100% 100%, 220% 220%;
      background-position: center, var(--mx) var(--my);
    }
    .body { position: absolute; inset: auto 0 0; padding: 22px; background: linear-gradient(transparent, rgba(5,8,20,.85)); transform: translateZ(40px); }
    .kicker { font-size: 12px; opacity: .75; }
    h3 { font-size: 26px; font-weight: 700; margin-top: 4px; }
    p { opacity: .8; font-size: 14px; margin-top: 4px; }
  `,
})
export class TiltHoloCard {
  protected readonly img = photo('aurora-ridge', 600, 840);
  protected readonly rx = signal(0);
  protected readonly ry = signal(0);
  protected readonly mx = signal(50);
  protected readonly my = signal(50);

  protected readonly touching = signal(false);

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.touching.set(true);
    this.move(e);
  }

  up(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.touching.set(false);
    this.reset();
  }

  leave(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.reset();
  }

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' && !this.touching()) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    this.ry.set((x - 0.5) * 24);
    this.rx.set((0.5 - y) * 24);
    this.mx.set(x * 100);
    this.my.set(y * 100);
  }

  reset(): void {
    this.rx.set(0);
    this.ry.set(0);
    this.mx.set(50);
    this.my.set(50);
  }
}
