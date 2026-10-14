import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Slide {
  id: number;
  route: string;
  region: string;
  km: string;
  by: string;
  src: string;
}

const SLIDES: [string, string, string, string][] = [
  ['Amalfi Coast', 'Campania, Italy', '50 km', 'Giulia Russo'],
  ['Big Sur', 'California, USA', '145 km', 'Noah Whitaker'],
  ['Great Ocean Road', 'Victoria, Australia', '243 km', 'Priya Natarajan'],
  ['Wild Atlantic Way', 'Donegal, Ireland', '2,500 km', 'Cian Doherty'],
  ['Cabot Trail', 'Nova Scotia, Canada', '298 km', 'Élise Gagnon'],
  ['Adriatic Highway', 'Dalmatia, Croatia', '643 km', 'Luka Perić'],
];

@Component({
  selector: 'demo-carousel-peek',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.arrowleft)': 'go(index() - 1)', '(keydown.arrowright)': 'go(index() + 1)' },
  template: `
    <section class="car" role="region" aria-roledescription="carousel" aria-label="Coastal routes" tabindex="0">
      <header>
        <h3>Coastal Routes</h3>
        <p class="count" aria-live="polite"><b>{{ (index() + 1).toString().padStart(2, '0') }}</b> / {{ slides.length.toString().padStart(2, '0') }}</p>
      </header>

      <div class="viewport" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up()" (pointercancel)="cancel()">
        <ul class="track" [class.dragging]="dragging()" [style.--i]="index()" [style.--dx.px]="dx()">
          @for (s of slides; track s.id; let i = $index) {
            <li class="slide" [class.active]="i === index()" [attr.aria-hidden]="i !== index()"
              aria-roledescription="slide" [attr.aria-label]="(i + 1) + ' of ' + slides.length + ': ' + s.route">
              <img [src]="s.src" [alt]="'Photograph of the ' + s.route + ' series by ' + s.by" draggable="false" (click)="tap(i)" />
              <div class="cap">
                <span class="region">{{ s.region }}</span>
                <strong>{{ s.route }}</strong>
                <span class="meta">{{ s.km }} · photo {{ s.by }}</span>
              </div>
            </li>
          }
        </ul>
        <button type="button" class="arrow prev" (click)="go(index() - 1)" [disabled]="index() === 0" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" class="arrow next" (click)="go(index() + 1)" [disabled]="index() === slides.length - 1" aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="dots">
        @for (s of slides; track s.id; let i = $index) {
          <button type="button" [class.on]="i === index()" (click)="go(i)" [attr.aria-label]="'Go to ' + s.route" [attr.aria-current]="i === index()"></button>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #dde7f0; color: #0f2540; font-family: var(--font-body); --sw: 62cqw; }
    @container (max-width: 640px) { .car { --sw: 80cqw; } }
    .car { padding: 24px 0 22px; outline: none; }
    .car:focus-visible header h3 { text-decoration: underline 2px; text-underline-offset: 6px; }
    header { display: flex; justify-content: space-between; align-items: baseline; padding: 0 clamp(16px, 4cqw, 40px) 18px; }
    h3 { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 4cqw, 40px); letter-spacing: -0.02em; font-variation-settings: 'SOFT' 100; }
    .count { font-family: var(--font-mono); font-size: 13px; color: #4f6680; }
    .count b { color: #0f2540; font-weight: 500; }
    .viewport { position: relative; overflow: hidden; touch-action: pan-y; cursor: grab; -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .viewport:active { cursor: grabbing; }
    .track { list-style: none; margin: 0; padding: 0; display: flex; gap: 16px;
      transform: translateX(calc((100cqw - var(--sw)) / 2 - var(--i) * (var(--sw) + 16px) + var(--dx)));
      transition: transform .6s cubic-bezier(.22,.8,.2,1); }
    .track.dragging { transition: none; }
    .slide { flex: 0 0 var(--sw); position: relative; aspect-ratio: 16 / 10; border-radius: 18px; overflow: hidden;
      transform: scale(.9); opacity: .55; transition: transform .6s cubic-bezier(.22,.8,.2,1), opacity .6s; }
    .slide.active { transform: none; opacity: 1; box-shadow: 0 30px 50px -28px rgba(15,37,64,.55); }
    .slide img { width: 100%; height: 100%; object-fit: cover; user-select: none; }
    .cap { position: absolute; inset: auto 0 0; padding: 50px 22px 18px; color: #fff; display: grid; gap: 2px;
      background: linear-gradient(transparent, rgba(8,20,36,.75)); opacity: 0; transform: translateY(12px); transition: opacity .5s .15s, transform .5s .15s; }
    .slide.active .cap { opacity: 1; transform: none; }
    .region { font-size: 12.5px; opacity: .85; }
    .cap strong { font-family: 'Fraunces', serif; font-size: clamp(22px, 3.4cqw, 34px); font-weight: 600; line-height: 1.05; }
    .meta { font-family: var(--font-mono); font-size: 11px; opacity: .75; margin-top: 4px; }
    .arrow { position: absolute; top: 50%; translate: 0 -50%; width: 46px; height: 46px; border-radius: 50%; border: 0; background: #fff; color: #0f2540;
      display: grid; place-items: center; cursor: pointer; box-shadow: 0 8px 20px -8px rgba(15,37,64,.4); transition: transform .2s, opacity .2s; }
    .arrow:hover:not(:disabled) { transform: scale(1.08); }
    .arrow:active:not(:disabled) { transform: scale(.94); }
    .arrow:disabled { opacity: 0; pointer-events: none; }
    .arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .prev { left: calc((100cqw - var(--sw)) / 2 - 23px); }
    .next { right: calc((100cqw - var(--sw)) / 2 - 23px); }
    .dots { display: flex; justify-content: center; gap: 8px; margin-top: 18px; }
    .dots button { position: relative; width: 8px; height: 8px; padding: 0; border-radius: 99px; border: 0; background: #9fb3c7; cursor: pointer; transition: width .35s cubic-bezier(.2,.8,.2,1), background .3s; }
    .dots button::after { content: ''; position: absolute; inset: -16px -6px; }
    .dots { gap: 12px; }
    @container (max-width: 480px) {
      .arrow { width: 40px; height: 40px; }
      .prev { left: 8px; } .next { right: 8px; }
      .cap { padding: 40px 14px 12px; }
    }
    .dots button.on { width: 28px; background: #0f2540; }
  `,
})
export class CarouselPeek {
  protected readonly slides: Slide[] = SLIDES.map(([route, region, km, by], id) => ({
    id, route, region, km, by, src: photo('coastal-' + id, 1200, 750),
  }));
  protected readonly index = signal(0);
  protected readonly dx = signal(0);
  protected readonly dragging = signal(false);
  private startX = 0;
  private pointerId = -1;
  private moved = false;

  constructor() {
    loadGoogleFonts('Fraunces:opsz,wght,SOFT@9..144,400..700,0..100');
  }

  go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.slides.length - 1, i)));
  }

  /** slide click — ignored when it ends a swipe */
  tap(i: number): void {
    if (this.moved) { this.moved = false; return; }
    this.go(i);
  }

  down(e: PointerEvent): void {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.pointerId = e.pointerId;
    this.startX = e.clientX;
    this.moved = false;
    this.dragging.set(true);
  }

  cancel(): void {
    this.dragging.set(false);
    this.dx.set(0);
  }

  move(e: PointerEvent): void {
    if (!this.dragging() || e.pointerId !== this.pointerId) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) { this.up(); return; }
    let d = e.clientX - this.startX;
    const el = e.currentTarget as HTMLElement;
    if (Math.abs(d) > 8 && !el.hasPointerCapture(e.pointerId)) { el.setPointerCapture(e.pointerId); this.moved = true; }
    if (!this.moved) return;
    const atEdge = (d > 0 && this.index() === 0) || (d < 0 && this.index() === this.slides.length - 1);
    if (atEdge) d *= 0.3;
    this.dx.set(d);
  }

  up(): void {
    if (!this.dragging()) return;
    const d = this.dx();
    this.dragging.set(false);
    this.dx.set(0);
    if (d < -40) this.go(this.index() + 1);
    else if (d > 40) this.go(this.index() - 1);
  }
}
