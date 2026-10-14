import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Slide {
  id: number;
  peak: string;
  range: string;
  elev: string;
  kb: number;
  src: string;
}

const SLIDES: [string, string, string][] = [
  ['Tre Cime di Lavaredo', 'Sexten Dolomites', '2,999 m'],
  ['Seceda ridgeline', 'Odle group', '2,519 m'],
  ['Lago di Braies', 'Prags Dolomites', '1,496 m'],
  ['Passo Giau', 'Ampezzo Dolomites', '2,236 m'],
  ['Marmolada glacier', 'Marmolada group', '3,343 m'],
];

const DURATION = 6000;

@Component({
  selector: 'demo-slideshow-ken-burns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointerenter)': 'hover.set(true)', '(pointerleave)': 'hover.set(false)',
    '(focusin)': 'focusIn($event)', '(focusout)': 'focusWithin.set(false)',
    '(keydown.arrowright)': 'go(index() + 1)', '(keydown.arrowleft)': 'go(index() - 1)',
  },
  template: `
    <section class="show" role="region" aria-roledescription="slideshow" aria-label="Dolomites" [class.paused]="paused()"
      (pointerdown)="swipeDown($event)" (pointermove)="swipeMove($event)" (pointerup)="swipeEnd()" (pointercancel)="swipeEnd()">
      @for (s of slides; track s.id; let i = $index) {
        <div [class]="'slide kb' + s.kb" [class.on]="i === index()" [attr.aria-hidden]="i !== index()">
          <img [src]="s.src" [alt]="s.peak + ', ' + s.range + ' — photograph by Matteo Kostner'" />
        </div>
      }
      <div class="shade" aria-hidden="true"></div>

      <div class="bars" aria-hidden="true">
        @for (s of slides; track s.id; let i = $index) {
          <span><i [style.transform]="'scaleX(' + fill(i) + ')'"></i></span>
        }
      </div>

      <button type="button" class="zone prev" (click)="tapZone(-1)" aria-label="Previous slide"></button>
      <button type="button" class="zone next" (click)="tapZone(1)" aria-label="Next slide"></button>

      <div class="cap" aria-live="polite">
        @for (k of [index()]; track k) {
          <div class="cap-in">
            <p>{{ cur().range }} · {{ cur().elev }}</p>
            <h3>{{ cur().peak }}</h3>
          </div>
        }
      </div>

      <div class="ctl">
        <span class="mono">{{ (index() + 1).toString().padStart(2, '0') }} / {{ slides.length.toString().padStart(2, '0') }}</span>
        <button type="button" class="pp" (click)="userPaused.set(!userPaused())" [attr.aria-label]="userPaused() ? 'Play slideshow' : 'Pause slideshow'">
          @if (userPaused()) {
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>
          } @else {
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg>
          }
        </button>
      </div>
      @if (paused() && !userPaused()) { <span class="hold mono" aria-hidden="true">Paused</span> }
    </section>
  `,
  styles: `
    :host { display: block; height: 560px; color: #fff; container-type: inline-size; }
    .show { position: relative; height: 100%; overflow: hidden; background: #0c0f12; touch-action: pan-y; -webkit-user-select: none; user-select: none; }
    .slide img { -webkit-user-drag: none; }
    .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease; }
    .slide.on { opacity: 1; z-index: 1; }
    .slide img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.12); }
    .slide.on img { animation: var(--anim) 7.2s linear both; }
    .show.paused .slide img { animation-play-state: paused; }
    .kb0 { --anim: kbA; } .kb1 { --anim: kbB; } .kb2 { --anim: kbC; } .kb3 { --anim: kbD; }
    @keyframes kbA { from { transform: scale(1.02) translate(0, 0); } to { transform: scale(1.16) translate(-3%, -2%); } }
    @keyframes kbB { from { transform: scale(1.16) translate(3%, 1%); } to { transform: scale(1.03) translate(0, 0); } }
    @keyframes kbC { from { transform: scale(1.05) translate(2%, -2%); } to { transform: scale(1.18) translate(-2%, 2%); } }
    @keyframes kbD { from { transform: scale(1.14) translate(-3%, 2%); } to { transform: scale(1.04) translate(2%, -1%); } }
    .shade { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(0,0,0,.45), transparent 22%, transparent 55%, rgba(0,0,0,.65)); pointer-events: none; }
    .bars { position: absolute; z-index: 4; top: 16px; left: 16px; right: 16px; display: flex; gap: 6px; }
    .bars span { flex: 1; height: 3px; border-radius: 3px; background: rgba(255,255,255,.3); overflow: hidden; }
    .bars i { display: block; height: 100%; background: #fff; transform-origin: left; }
    .zone { position: absolute; z-index: 3; top: 0; bottom: 0; width: 34%; border: 0; background: none; cursor: pointer; touch-action: pan-y; -webkit-tap-highlight-color: transparent; }
    .zone.prev:active { background: linear-gradient(90deg, rgba(255,255,255,.1), transparent); }
    .zone.next:active { background: linear-gradient(270deg, rgba(255,255,255,.1), transparent); }
    .zone.prev { left: 0; cursor: w-resize; } .zone.next { right: 0; cursor: e-resize; }
    .zone:focus-visible { outline: none; background: linear-gradient(90deg, rgba(255,255,255,.12), transparent); }
    .zone.next:focus-visible { background: linear-gradient(270deg, rgba(255,255,255,.12), transparent); }
    .cap { position: absolute; z-index: 4; left: clamp(18px, 4cqw, 44px); bottom: clamp(20px, 4cqw, 40px); right: 120px; pointer-events: none; }
    .cap-in p { font-size: 13px; opacity: .85; animation: rise .8s .2s cubic-bezier(.2,.8,.2,1) both; }
    h3 { font-family: var(--font-display); font-weight: 700; font-size: clamp(34px, 7cqw, 80px); line-height: .92; letter-spacing: -0.035em; font-variation-settings: 'wdth' 85;
      margin-top: 6px; animation: rise .9s .3s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes rise { from { opacity: 0; transform: translateY(24px); } }
    .ctl { position: absolute; z-index: 4; right: clamp(16px, 3cqw, 32px); bottom: clamp(20px, 4cqw, 40px); display: flex; align-items: center; gap: 12px; }
    .mono { font-family: var(--font-mono); font-size: 12px; }
    .pp { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.4); background: rgba(255,255,255,.12); backdrop-filter: blur(8px); color: #fff; display: grid; place-items: center; cursor: pointer; }
    .pp:hover { background: rgba(255,255,255,.25); }
    .pp { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pp:active { background: rgba(255,255,255,.3); transform: scale(.94); }
    @container (max-width: 480px) {
      .cap { right: 76px; }
      h3 { font-size: clamp(28px, 9cqw, 40px); }
      .ctl .mono { display: none; }
    }
    .pp svg { width: 16px; height: 16px; fill: currentColor; }
    .hold { position: absolute; z-index: 4; top: 30px; right: 16px; font-size: 11px; opacity: .75; }
  `,
})
export class SlideshowKenBurns {
  protected readonly slides: Slide[] = SLIDES.map(([peak, range, elev], id) => ({ id, peak, range, elev, kb: id % 4, src: photo('dolomites-' + id, 1800, 1100) }));
  protected readonly index = signal(0);
  protected readonly progress = signal(0);
  protected readonly hover = signal(false);
  protected readonly focusWithin = signal(false);
  protected readonly userPaused = signal(prefersReducedMotion());
  private readonly visible = hostVisible(0.3);
  protected readonly paused = computed(() => this.userPaused() || this.hover() || this.focusWithin() || !this.visible());
  protected readonly cur = computed(() => this.slides[this.index()]);
  private elapsed = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(64, now - last);
        last = now;
        if (!this.paused()) {
          this.elapsed += dt;
          if (this.elapsed >= DURATION) this.go(this.index() + 1);
          else this.progress.set(this.elapsed / DURATION);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      destroyRef.onDestroy(() => cancelAnimationFrame(raf));
    });
  }

  /** only keyboard focus pauses; a tap or click on the zones must not freeze the show */
  focusIn(e: FocusEvent): void {
    this.focusWithin.set((e.target as HTMLElement).matches(':focus-visible'));
  }

  tapZone(d: number): void {
    if (this.swiped) { this.swiped = false; return; } // the click that ends a swipe
    this.go(this.index() + d);
  }

  // ---- swipe (touch, pen or mouse drag): > 40px horizontally moves one slide
  private sw: { id: number; x: number; y: number } | null = null;
  private swiped = false;

  swipeDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.sw = { id: e.pointerId, x: e.clientX, y: e.clientY };
    this.swiped = false;
  }

  swipeMove(e: PointerEvent): void {
    const s = this.sw;
    if (!s || s.id !== e.pointerId || this.swiped) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      this.swiped = true;
      this.go(this.index() + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) {
      this.sw = null; // vertical: let the page scroll
    }
  }

  swipeEnd(): void {
    this.sw = null;
  }

  fill(i: number): number {
    const cur = this.index();
    return i < cur ? 1 : i > cur ? 0 : this.progress();
  }

  go(i: number): void {
    const n = this.slides.length;
    this.index.set((i + n) % n);
    this.elapsed = 0;
    this.progress.set(0);
  }
}
