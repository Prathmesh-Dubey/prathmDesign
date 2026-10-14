import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Room {
  id: number;
  title: [string, string];
  note: string;
  src: string;
}

const ROOMS: [string, string, string][] = [
  ['The long', 'kitchen', 'A single slab of Verde Alpi marble runs eleven metres, end to end.'],
  ['Courtyard', 'of figs', 'Two hundred-year-old fig trees kept, the house built around them.'],
  ['Reading', 'room', 'Lime-washed walls, oak shelving, one deep window onto the hills.'],
  ['Stair in', 'raw plaster', 'Hand-floated tadelakt over a cantilevered concrete spine.'],
  ['The quiet', 'bedroom', 'Linen, walnut and nothing else. Shutters cut from old doors.'],
  ['Pool at', 'first light', 'A black-lined basin that mirrors the olive grove at dawn.'],
];

const STEP = 5200;

@Component({
  selector: 'demo-slideshow-fade-captions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointerenter)': 'hover.set(true)', '(pointerleave)': 'hover.set(false)',
    '(keydown.arrowright)': 'go(index() + 1)', '(keydown.arrowleft)': 'go(index() - 1)',
  },
  template: `
    <section class="wrap" role="region" aria-roledescription="slideshow" aria-label="Casa Lumbre interiors">
      <div class="media" (pointerdown)="swipeDown($event)" (pointermove)="swipeMove($event)" (pointerup)="swipeEnd()" (pointercancel)="swipeEnd()">
        @for (r of rooms; track r.id; let i = $index) {
          <img [src]="r.src" [alt]="'Casa Lumbre interior photograph ' + (i + 1) + ': ' + r.title.join(' ')" [class.on]="i === index()" [attr.aria-hidden]="i !== index()" />
        }
      </div>
      <div class="panel">
        <p class="proj">Casa Lumbre — Mallorca<br /><span>Estudio Ferrer Soler · photos by Núria Pons</span></p>
        <div class="counter" aria-hidden="true">
          <span class="num">@for (k of [index()]; track k) {<b>{{ (k + 1).toString().padStart(2, '0') }}</b>}</span>
          <span class="tot">/ {{ rooms.length.toString().padStart(2, '0') }}</span>
        </div>
        <div class="cap" aria-live="polite">
          @for (k of [index()]; track k) {
            <h3>
              <span class="ln"><span>{{ cur().title[0] }}</span></span>
              <span class="ln"><span><em>{{ cur().title[1] }}</em></span></span>
            </h3>
            <p class="note">{{ cur().note }}</p>
          }
        </div>
        <div class="nav">
          <button type="button" (click)="go(index() - 1)" aria-label="Previous room">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" (click)="go(index() + 1)" aria-label="Next room">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <button type="button" class="txt" (click)="userPaused.set(!userPaused())">{{ userPaused() ? 'Play' : 'Pause' }}</button>
          <span class="line" aria-hidden="true"><i [style.transform]="'scaleX(' + progress() + ')'"></i></span>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #191a14; color: #ece6d6; }
    .wrap { display: grid; grid-template-columns: minmax(260px, 34%) 1fr; height: 540px; }
    .media { position: relative; overflow: hidden; order: 2; touch-action: pan-y; -webkit-user-select: none; user-select: none; }
    .media img { -webkit-user-drag: none; pointer-events: none; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.05);
      transition: opacity 1.4s cubic-bezier(.4,0,.2,1), transform 6s cubic-bezier(.2,.7,.2,1); }
    .media img.on { opacity: 1; transform: none; }
    .panel { position: relative; display: flex; flex-direction: column; padding: clamp(20px, 3cqw, 36px); gap: 18px; }
    .proj { font-size: 12.5px; line-height: 1.5; } .proj span { color: #9b9a86; }
    .counter { display: flex; align-items: baseline; gap: 8px; font-family: 'Italiana', serif; margin-top: auto; }
    .num { display: inline-block; overflow: hidden; height: 1em; font-size: clamp(56px, 9cqw, 104px); line-height: 1; }
    .num b { display: block; font-weight: 400; animation: slideNum .8s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes slideNum { from { transform: translateY(100%); } }
    .tot { font-size: 22px; color: #8a9a5b; }
    h3 { font-family: 'Italiana', serif; font-weight: 400; font-size: clamp(34px, 5cqw, 58px); line-height: 1; letter-spacing: -0.01em; }
    .ln { display: block; overflow: hidden; padding-bottom: .06em; }
    .ln > span { display: block; animation: lineUp .9s cubic-bezier(.2,.8,.2,1) both; }
    .ln:nth-child(2) > span { animation-delay: .08s; }
    h3 em { font-style: normal; color: #b9c48a; }
    @keyframes lineUp { from { transform: translateY(105%); } }
    .note { font-size: 14px; line-height: 1.55; color: #c4bfae; max-width: 34ch; margin-top: 12px; animation: fade .8s .25s both; }
    @keyframes fade { from { opacity: 0; } }
    .nav { display: flex; align-items: center; gap: 8px; }
    .nav button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #3b3d31; background: none; color: inherit; display: grid; place-items: center; cursor: pointer; transition: background .25s, border-color .25s; }
    .nav button:hover { background: #8a9a5b; border-color: #8a9a5b; color: #191a14; }
    .nav button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .nav button:active { background: #8a9a5b; border-color: #8a9a5b; color: #191a14; transform: scale(.94); }
    @media (hover: none) { .nav button:hover:not(:active) { background: none; border-color: #3b3d31; color: inherit; } }
    .nav button.txt { width: auto; padding: 0 14px; border-radius: 99px; font-size: 12.5px; }
    .nav svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
    .line { flex: 1; height: 1px; background: #3b3d31; margin-left: 6px; }
    .line i { display: block; height: 100%; background: #b9c48a; transform-origin: left; transition: transform .1s linear; }
    @container (max-width: 680px) {
      .wrap { grid-template-columns: 1fr; grid-template-rows: 260px auto; height: auto; }
      .media { order: 0; }
      .counter { margin-top: 0; }
      .panel { gap: 14px; }
      .num { font-size: 52px; }
    }
  `,
})
export class SlideshowFadeCaptions {
  protected readonly rooms: Room[] = ROOMS.map(([a, b, note], id) => ({ id, title: [a, b], note, src: photo('casa-lumbre-' + id, 1400, 1000) }));
  protected readonly index = signal(0);
  protected readonly progress = signal(0);
  protected readonly hover = signal(false);
  protected readonly userPaused = signal(prefersReducedMotion());
  private readonly visible = hostVisible(0.3);
  protected readonly cur = computed(() => this.rooms[this.index()]);
  private elapsed = 0;

  constructor() {
    loadGoogleFonts('Italiana');
    const t = setInterval(() => {
      if (this.userPaused() || this.hover() || !this.visible()) return;
      this.elapsed += 100;
      if (this.elapsed >= STEP) this.go(this.index() + 1);
      else this.progress.set(this.elapsed / STEP);
    }, 100);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
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

  go(i: number): void {
    const n = this.rooms.length;
    this.index.set((i + n) % n);
    this.elapsed = 0;
    this.progress.set(0);
  }
}
