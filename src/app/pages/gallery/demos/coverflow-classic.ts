import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Still {
  id: number;
  film: string;
  director: string;
  country: string;
  min: number;
  src: string;
}

const STILLS: [string, string, string, number][] = [
  ['Salt Hours', 'Lidia Orlova', 'Georgia', 14],
  ['The Lamplighters', 'Kwame Asante', 'Ghana', 22],
  ['Low Tide, High Noon', 'Mirela Popescu', 'Romania', 18],
  ['Paper Moons', 'Hiro Takeda', 'Japan', 11],
  ['Night Ferry', 'Sanne de Vries', 'Netherlands', 24],
  ['All the Quiet Dogs', 'Pablo Ibarra', 'Chile', 16],
  ['Glasshouse', 'Aino Virtanen', 'Finland', 19],
  ['Monsoon Letters', 'Ritu Deshpande', 'India', 21],
  ['Second Snow', 'Jonas Berg', 'Norway', 13],
];

@Component({
  selector: 'demo-coverflow-classic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'key($event)' },
  template: `
    <section role="region" aria-roledescription="carousel" aria-label="Shorts programme stills" tabindex="0" class="wrap">
      <header>
        <p class="fest">Rotterdam Shorts · Competition 2026</p>
        <p class="hint">Drag, swipe or use ← →</p>
      </header>
      <div class="stage" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up()" (pointercancel)="cancel()" (wheel)="wheel($event)">
        <ul class="flow" [class.dragging]="dragging()">
          @for (s of stills; track s.id; let i = $index) {
            <li class="item" [style.transform]="transformFor(i)" [style.z-index]="100 - abs(i - index())" [class.center]="i === index()"
              [style.opacity]="abs(i - index()) > 4 ? 0 : 1">
              <button type="button" (click)="clickItem(i)" [attr.aria-label]="s.film + ' by ' + s.director" [attr.aria-current]="i === index()" tabindex="-1">
                <img [src]="s.src" [alt]="'Film still from ' + s.film + ', directed by ' + s.director" draggable="false" />
              </button>
            </li>
          }
        </ul>
      </div>
      <div class="cap" aria-live="polite">
        @for (k of [index()]; track k) {
          <h3>{{ cur().film }}</h3>
          <p>{{ cur().director }} · {{ cur().country }} · {{ cur().min }} min</p>
        }
      </div>
      <div class="dots" aria-hidden="true">
        @for (s of stills; track s.id; let i = $index) { <span [class.on]="i === index()"></span> }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; color: #f1ece4; overflow: hidden;
      background: radial-gradient(80% 60% at 50% 45%, #2a1f3d, #0b0812 75%); --w: clamp(160px, 26cqw, 260px); }
    .wrap { display: grid; grid-template-rows: auto 1fr auto auto; gap: 8px; height: 100%; min-height: 520px; padding: 20px 0 22px; outline: none; }
    .wrap:focus-visible .center button { outline: 2px solid #ffcf5c; outline-offset: 4px; }
    header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 12px; padding: 0 clamp(16px, 4cqw, 36px); font-size: 12.5px; }
    .fest { color: #ffcf5c; font-family: var(--font-mono); }
    .hint { color: #8d84a3; }
    .stage { position: relative; perspective: 1100px; touch-action: pan-y; cursor: grab; user-select: none; min-height: calc(var(--w) * 1.4); }
    .stage:active { cursor: grabbing; }
    .flow { list-style: none; margin: 0; padding: 0; position: absolute; inset: 0; transform-style: preserve-3d; }
    .item { position: absolute; left: 50%; top: 46%; width: var(--w); aspect-ratio: 3 / 4; margin-left: calc(var(--w) / -2); translate: 0 -50%;
      transition: transform .7s cubic-bezier(.2,.8,.2,1), opacity .5s; transform-style: preserve-3d; }
    .item button { touch-action: pan-y; -webkit-tap-highlight-color: transparent; display: block; width: 100%; height: 100%; padding: 0; border: 0; background: #1b1427; cursor: pointer; border-radius: 4px;
      -webkit-box-reflect: below 6px linear-gradient(transparent 62%, rgba(255,255,255,.28)); }
    .item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; filter: brightness(.55) saturate(.8); transition: filter .6s; pointer-events: none; }
    .item.center img { filter: none; }
    @container (max-width: 420px) { :host { --w: 46cqw; } .wrap { min-height: 480px; } }
    .flow.dragging .item { transition: opacity .5s; }
    .cap { text-align: center; padding: 0 16px; min-height: 64px; }
    h3 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; font-size: clamp(30px, 5cqw, 48px); letter-spacing: .02em; line-height: 1; animation: in .6s cubic-bezier(.2,.8,.2,1) both; }
    .cap p { font-size: 13px; color: #b3aac6; margin-top: 4px; animation: in .6s .08s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes in { from { opacity: 0; transform: translateY(10px); } }
    .dots { display: flex; justify-content: center; gap: 6px; }
    .dots span { width: 5px; height: 5px; border-radius: 50%; background: #4a3f60; transition: background .3s, transform .3s; }
    .dots span.on { background: #ffcf5c; transform: scale(1.4); }
  `,
})
export class CoverflowClassic {
  protected readonly stills: Still[] = STILLS.map(([film, director, country, min], id) => ({ id, film, director, country, min, src: photo('shorts-still-' + id, 520, 700) }));
  protected readonly index = signal(4);
  protected readonly drag = signal(0);
  protected readonly dragging = signal(false);
  protected readonly cur = computed(() => this.stills[this.index()]);
  private sx = 0;
  private down0 = false;
  private moved = false;
  private wheelLock = 0;

  constructor() {
    loadGoogleFonts('Bebas+Neue');
  }

  abs(n: number): number {
    return Math.abs(n);
  }

  transformFor(i: number): string {
    const o = i - this.index() + this.drag();
    const a = Math.abs(o);
    const s = Math.sign(o);
    if (a < 0.001) return 'translateX(0) translateZ(60px) rotateY(0deg)';
    const t = Math.min(a, 1);
    const x = s * (t * 58 + Math.max(0, a - 1) * 20); // % of item width
    return `translateX(${x}%) translateZ(${60 - t * 260}px) rotateY(${-s * t * 58}deg)`;
  }

  go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.stills.length - 1, i)));
  }

  clickItem(i: number): void {
    if (!this.moved) this.go(i);
  }

  key(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.index() + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.index() - 1); }
    else if (e.key === 'Home') { e.preventDefault(); this.go(0); }
    else if (e.key === 'End') { e.preventDefault(); this.go(this.stills.length - 1); }
  }

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.down0 = true;
    this.moved = false;
    this.sx = e.clientX;
  }

  move(e: PointerEvent): void {
    if (!this.down0) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) { this.up(); return; }
    const dx = e.clientX - this.sx;
    if (!this.moved && Math.abs(dx) > 8) {
      this.moved = true;
      this.dragging.set(true);
      // capture only once it is a real drag, so plain clicks still reach the cards
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!this.moved) return;
    // live drag: shift by fractional items, clamped at ends
    const d = -dx / 160;
    const min = -this.index(), max = this.stills.length - 1 - this.index();
    this.drag.set(-Math.max(min - 0.3, Math.min(max + 0.3, d)));
  }

  up(): void {
    if (!this.down0) return;
    this.down0 = false;
    this.dragging.set(false);
    const d = -this.drag();
    this.drag.set(0);
    this.go(this.index() + Math.round(d));
  }

  /** browser took over (vertical page scroll) — spring back without changing slide */
  cancel(): void {
    this.down0 = false;
    this.dragging.set(false);
    this.drag.set(0);
  }

  wheel(e: WheelEvent): void {
    // horizontal wheel / trackpad swipes only, so vertical page scrolling is never hijacked
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const d = e.deltaX;
    if (Math.abs(d) < 4) return;
    e.preventDefault();
    const now = performance.now();
    if (now - this.wheelLock < 220) return;
    this.wheelLock = now;
    this.go(this.index() + (d > 0 ? 1 : -1));
  }
}
