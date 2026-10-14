import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Mark {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
}

@Component({
  selector: 'demo-velvet-spotlight',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="velvet"
      tabindex="0"
      aria-label="Spotlight. Move the pointer or use arrow keys to light the camera."
      [style.--x.%]="x() * 100"
      [style.--y.%]="y() * 100"
      (pointermove)="move($event)"
      (pointerdown)="move($event)"
      (pointerenter)="enter()"
      (pointerleave)="leave($event)"
      (pointercancel)="leave($event)"
      (keydown)="key($event)"
    >
      <div class="layer dim" aria-hidden="true"><img [src]="img" appImgFallback="aurel-camera" alt="" /></div>
      <div class="layer lit"><img [src]="img" appImgFallback="aurel-camera" alt="Aurel M Titanium Edition camera on dark velvet" /></div>
      <div class="glow" aria-hidden="true"></div>
        @for (m of marks; track m.id) {
          <div class="mark" [style.left.%]="m.x * 100" [style.top.%]="m.y * 100" [style.opacity]="reveal()[m.id]">
            <i></i>
            <strong>{{ m.title }}</strong>
            <span>{{ m.text }}</span>
          </div>
        }
      <div class="plate">
        <p class="ed">Edition of 75</p>
        <h3>Aurel M <em>Titanium</em></h3>
        <p class="line">Hand-engraved top plate · Summilux 35 f/1.4 · €9,800</p>
        <button type="button" class="cta" (click)="enquired.set(true)">{{ enquired() ? 'A specialist will call you' : 'Private enquiry' }}</button>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; }
    .velvet {
      --x: 50%; --y: 45%;
      position: relative; min-height: 620px; height: 100%; overflow: hidden; outline: none; cursor: none;
      touch-action: pan-y; -webkit-tap-highlight-color: transparent; user-select: none;
      color: #f3e3e7; font-family: 'Geist', sans-serif;
      background:
        radial-gradient(40% 36% at var(--x) var(--y), rgba(130,24,52,.55), transparent 70%),
        repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 2px, transparent 2px 4px),
        radial-gradient(120% 90% at 50% 40%, #3a0d1b, #14040a 75%);
    }
    .velvet:focus-visible { box-shadow: inset 0 0 0 2px #e8b7c3; }
    .layer { position: absolute; inset: 0; display: grid; place-items: center; padding-bottom: 150px; pointer-events: none; }
    .layer img { width: min(52cqw, 420px); aspect-ratio: 1; object-fit: cover; border-radius: 50%; }
    .dim img { filter: brightness(.18) saturate(.4) sepia(.4) hue-rotate(-30deg); }
    .lit img { filter: contrast(1.05) saturate(1.1); }
    .lit {
      -webkit-mask-image: radial-gradient(circle at var(--x) var(--y), #000 0, rgba(0,0,0,.6) 70px, transparent 170px);
      mask-image: radial-gradient(circle at var(--x) var(--y), #000 0, rgba(0,0,0,.6) 70px, transparent 170px);
    }
    .glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at var(--x) var(--y), rgba(255,226,214,.16), transparent 140px); mix-blend-mode: screen; }
    .mark { position: absolute; width: 170px; transform: translate(-50%, -50%); transition: opacity .25s; pointer-events: none; font-size: 12px; line-height: 1.4; }
    .mark i { display: block; width: 7px; height: 7px; border-radius: 50%; background: #f3c7d1; box-shadow: 0 0 0 4px rgba(243,199,209,.18); margin-bottom: 6px; }
    .mark strong { display: block; font-family: 'Italiana', serif; font-weight: 400; font-size: 18px; color: #fff; }
    .mark span { color: #d7aab5; }
    .plate { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px clamp(20px, 4cqw, 44px) 26px; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 6px 20px; border-top: 1px solid rgba(232,183,195,.18); background: linear-gradient(transparent, rgba(10,2,5,.6)); cursor: auto; }
    .ed { grid-column: 1 / -1; font-size: 12px; color: #d7aab5; letter-spacing: .08em; }
    h3 { font-family: 'Italiana', serif; font-weight: 400; font-size: clamp(36px, 6cqw, 60px); line-height: 1; letter-spacing: .01em; }
    h3 em { font-style: normal; color: #e8b7c3; }
    .line { font-size: 13.5px; color: #cfa5af; grid-column: 1; }
    .cta { grid-column: 2; grid-row: 2 / 4; height: 46px; padding: 0 22px; border-radius: 999px; border: 1px solid #e8b7c3; background: transparent; color: #f3e3e7; cursor: pointer; font-size: 14px; transition: background .3s, color .3s; }
    @media (hover: hover) { .cta:hover { background: #e8b7c3; color: #2a0812; } }
    .cta { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:active { background: #e8b7c3; color: #2a0812; }
    @container (max-width: 560px) {
      .plate { grid-template-columns: 1fr; }
      .cta { grid-column: 1; grid-row: auto; justify-self: start; margin-top: 8px; }
      .layer { padding-bottom: 210px; }
      .layer img { width: 74cqw; }
      .mark { width: 120px; }
      .mark span { display: none; }
      .velvet { min-height: 560px; }
    }
  `,
})
export class VelvetSpotlight {
  protected readonly img = unsplash(PRODUCT_PHOTOS.camera, 900, 900);
  protected readonly x = signal(0.5);
  protected readonly y = signal(0.4);
  protected readonly manual = signal(false);
  protected readonly enquired = signal(false);
  private readonly visible = hostVisible();
  protected readonly marks: Mark[] = [
    { id: 'plate', x: 0.24, y: 0.2, title: 'Engraved plate', text: 'Arabesque hand-cut by Atelier Rossi, 40 hours.' },
    { id: 'lens', x: 0.78, y: 0.36, title: 'Summilux 35', text: 'Eleven elements, titanium barrel.' },
    { id: 'leather', x: 0.22, y: 0.66, title: 'Bordeaux hide', text: 'Vegetable-tanned leatherette in oxblood.' },
  ];
  protected readonly reveal = computed(() => {
    const out: Record<string, number> = {};
    for (const m of this.marks) {
      const d = Math.hypot(m.x - this.x(), (m.y - this.y()) * 0.8);
      out[m.id] = Math.max(0, Math.min(1, 1.6 - d * 6));
    }
    return out;
  });
  private raf = 0;

  constructor() {
    loadGoogleFonts('Italiana');
    const destroy = inject(DestroyRef);
    destroy.onDestroy(() => {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.resume);
    });
    effect(() => {
      cancelAnimationFrame(this.raf);
      if (!this.visible() || this.manual() || prefersReducedMotion()) return;
      const t0 = performance.now();
      const sx = untracked(() => this.x());
      const sy = untracked(() => this.y());
      const loop = (t: number) => {
        const s = (t - t0) / 1000;
        const blend = Math.min(1, s / 1.2);
        const tx = 0.5 + Math.sin(s * 0.45) * 0.3;
        const ty = 0.38 + Math.sin(s * 0.7 + 1) * 0.22;
        this.x.set(sx + (tx - sx) * blend);
        this.y.set(sy + (ty - sy) * blend);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  private resume: ReturnType<typeof setTimeout> | undefined;

  enter(): void {
    clearTimeout(this.resume);
    this.manual.set(true);
  }

  /** Mouse: resume the roaming light at once. Touch: hold the tapped spot for a moment first. */
  leave(e: PointerEvent): void {
    clearTimeout(this.resume);
    if (e.pointerType === 'mouse') this.manual.set(false);
    else this.resume = setTimeout(() => this.manual.set(false), 2600);
  }

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' && (e.target as Element).closest('.plate')) return;
    clearTimeout(this.resume);
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.manual.set(true);
    this.x.set((e.clientX - r.left) / r.width);
    this.y.set((e.clientY - r.top) / r.height);
  }

  key(e: KeyboardEvent): void {
    const step = 0.05;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    this.manual.set(true);
    this.x.update((v) => Math.max(0, Math.min(1, v + d[0])));
    this.y.update((v) => Math.max(0, Math.min(1, v + d[1])));
  }
}
