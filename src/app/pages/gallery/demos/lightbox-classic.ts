import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal, viewChild, viewChildren,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Shot {
  id: number;
  title: string;
  place: string;
  by: string;
  w: number;
  h: number;
  thumb: string;
  full: string;
}

const SHOTS: [string, string, string, number, number][] = [
  ['First light at Xakanaxa', 'Moremi Game Reserve', 'Thandiwe Mokoena', 1600, 1067],
  ['Crossing the channel', 'Khwai River', 'Tom Ashby', 1067, 1600],
  ['Mokoro morning', 'Jao Concession', 'Thandiwe Mokoena', 1600, 1067],
  ['Sausage tree shade', 'Chief’s Island', 'Kagiso Dube', 1200, 1200],
  ['Flood plain, May', 'Vumbura Plains', 'Tom Ashby', 1600, 900],
  ['Papyrus edge', 'Shinde Lagoon', 'Kagiso Dube', 1067, 1600],
  ['Dust at golden hour', 'Savute Channel', 'Thandiwe Mokoena', 1600, 1067],
  ['After the storm', 'Duba Plains', 'Tom Ashby', 1600, 1067],
  ['Night camp, Kwara', 'Kwara Reserve', 'Kagiso Dube', 1200, 1200],
];

@Component({
  selector: 'demo-lightbox-classic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'key($event)' },
  template: `
    <header>
      <h3>Okavango, <i>flood season</i></h3>
      <p>Nine frames · tap any photograph to view</p>
    </header>
    <ul class="grid" role="list">
      @for (s of shots; track s.id; let i = $index) {
        <li [class]="'cell c' + i">
          <button #tile type="button" class="tile" (click)="open(i)" [attr.aria-label]="'Open ' + s.title + ' in viewer'">
            <img [src]="s.thumb" [alt]="'Photograph ' + (i + 1) + ': ' + s.title + ', ' + s.place" loading="lazy" />
            <span class="expand" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M4 8V4h4M12 4h4v4M16 12v4h-4M8 16H4v-4" /></svg></span>
          </button>
        </li>
      }
    </ul>

    @if (openIndex() !== null) {
      @let s = current()!;
      <div class="lb" role="dialog" aria-modal="true" [attr.aria-label]="'Photo viewer: ' + s.title"
        [class.swiping]="swiping()" [style.--sw]="drag()"
        (pointerdown)="swipeStart($event)" (pointermove)="swipeMove($event)" (pointerup)="swipeEnd($event)" (pointercancel)="swipeCancel()">
        <div class="lb-top">
          <span class="counter" aria-live="polite">{{ openIndex()! + 1 }} <i>/</i> {{ shots.length }}</span>
          <button #closeBtn type="button" class="ic" (click)="close()" aria-label="Close viewer">
            <svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
        <div class="lb-stage" (click)="backdrop($event)">
          @for (k of [openIndex()]; track k) {
            <img class="big" [src]="s.full" [alt]="s.title + ', ' + s.place + ' — photograph by ' + s.by" [class.from-left]="dir() < 0" />
          }
          <button type="button" class="ic nav prev" (click)="step(-1)" aria-label="Previous photograph">
            <svg viewBox="0 0 20 20"><path d="M12.5 4l-6 6 6 6" /></svg>
          </button>
          <button type="button" class="ic nav next" (click)="step(1)" aria-label="Next photograph">
            <svg viewBox="0 0 20 20"><path d="M7.5 4l6 6-6 6" /></svg>
          </button>
        </div>
        <div class="lb-cap">
          <div><strong>{{ s.title }}</strong><span>{{ s.place }} · {{ s.by }}</span></div>
          <div class="thumbs">
            @for (t of shots; track t.id; let i = $index) {
              <button type="button" [class.on]="i === openIndex()" (click)="goTo(i)" [attr.aria-label]="'Show ' + t.title" [attr.aria-current]="i === openIndex()">
                <img [src]="t.thumb" alt="" />
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host { display: block; position: relative; container-type: inline-size; min-height: 100%; background: #f1efe9; color: #23251f; padding: clamp(16px, 3cqw, 30px);
      font-family: var(--font-body); }
    header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(28px, 4cqw, 42px); letter-spacing: -0.01em; }
    h3 i { color: #8a6d3b; }
    header p { font-size: 13px; color: #6f6f66; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 92px; grid-auto-flow: dense; gap: 8px; }
    .c0 { grid-column: span 2; grid-row: span 2; } .c1 { grid-row: span 3; } .c2 { grid-column: span 2; grid-row: span 2; }
    .c3 { grid-row: span 2; } .c4 { grid-column: span 2; } .c5 { grid-row: span 2; } .c6 { grid-column: span 2; grid-row: span 2; }
    .c7 { grid-column: span 2; } .c8 { grid-column: span 1; }
    @container (max-width: 620px) { .grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 80px; } .c1 { grid-row: span 2; } }
    .tile { position: relative; width: 100%; height: 100%; padding: 0; border: 0; border-radius: 6px; overflow: hidden; cursor: zoom-in; background: #dcd8cd; }
    .tile img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1), filter .4s; }
    .tile:hover img { transform: scale(1.05); filter: brightness(.85); }
    .expand { position: absolute; right: 8px; top: 8px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.9); display: grid; place-items: center;
      opacity: 0; transform: scale(.8); transition: opacity .25s, transform .25s; }
    .expand svg { width: 14px; height: 14px; fill: none; stroke: #23251f; stroke-width: 1.8; stroke-linecap: round; }
    .tile:hover .expand, .tile:focus-visible .expand { opacity: 1; transform: none; }
    .tile:focus-visible { outline: 2px solid #8a6d3b; outline-offset: 2px; }

    .lb { position: absolute; inset: 0; z-index: 10; display: grid; grid-template-rows: auto 1fr auto; background: rgba(14,14,12,.94); backdrop-filter: blur(8px);
      color: #f3efe6; animation: lbIn .3s ease-out; touch-action: pan-y; --sw: 0; }
    .lb button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .ic:active { background: rgba(255,255,255,.26); transform: scale(.94); }
    .nav:active { transform: scale(.94); }
    /* the photo follows the finger, then springs back or hands over to the next one */
    .big { translate: calc(var(--sw) * 1px) 0; opacity: calc(1 - min(.5, abs(var(--sw)) / 600)); transition: translate .35s cubic-bezier(.2,.8,.2,1), opacity .35s;
      -webkit-user-drag: none; user-select: none; }
    .lb.swiping .big { transition: none; }
    @keyframes lbIn { from { opacity: 0; } }
    .lb-top { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; }
    .counter { font-family: var(--font-mono); font-size: 13px; } .counter i { opacity: .4; font-style: normal; }
    .ic { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background .2s; }
    .ic:hover { background: rgba(255,255,255,.18); }
    .ic svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .lb-stage { position: relative; min-height: 0; display: grid; place-items: center; padding: 0 64px; }
    .big { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 3px; animation: imgIn .45s cubic-bezier(.2,.8,.2,1); box-shadow: 0 30px 60px -20px #000; }
    .big.from-left { animation-name: imgInL; }
    @keyframes imgIn { from { opacity: 0; transform: translateX(30px) scale(.98); } }
    @keyframes imgInL { from { opacity: 0; transform: translateX(-30px) scale(.98); } }
    .nav { position: absolute; top: 50%; translate: 0 -50%; }
    .prev { left: 12px; } .next { right: 12px; }
    .lb-cap { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 16px 14px; }
    .lb-cap strong { display: block; font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; }
    .lb-cap span { font-size: 12.5px; color: rgba(243,239,230,.6); }
    .thumbs { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
    .thumbs button { flex: none; width: 40px; height: 30px; padding: 0; border: 0; border-radius: 3px; overflow: hidden; opacity: .4; cursor: pointer; transition: opacity .2s, outline-color .2s; outline: 2px solid transparent; outline-offset: 1px; }
    .thumbs button.on { opacity: 1; outline-color: #d8b878; }
    .thumbs img { width: 100%; height: 100%; object-fit: cover; }
    @container (max-width: 620px) {
      .lb-stage { padding: 0 8px; }
      .nav { background: rgba(14,14,12,.55); border-color: rgba(255,255,255,.14); backdrop-filter: blur(4px); }
      .prev { left: 6px; } .next { right: 6px; }
      .thumbs { display: none; }
      .lb-cap strong { font-size: 19px; }
    }
  `,
})
export class LightboxClassic {
  private readonly injector = inject(Injector);
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly tiles = viewChildren<ElementRef<HTMLButtonElement>>('tile');
  protected readonly shots: Shot[] = SHOTS.map(([title, place, by, w, h], id) => ({
    id, title, place, by, w, h,
    thumb: photo('okavango-' + id, Math.round(w / 4), Math.round(h / 4)),
    full: photo('okavango-' + id, w, h),
  }));
  protected readonly openIndex = signal<number | null>(null);
  protected readonly dir = signal(1);
  protected readonly current = computed(() => {
    const i = this.openIndex();
    return i === null ? null : this.shots[i];
  });
  private sx = 0;
  private sy = 0;
  private sid = -1;
  private moved = false;
  protected readonly drag = signal(0);
  protected readonly swiping = signal(false);

  constructor() {
    loadGoogleFonts('Cormorant+Garamond:ital,wght@0,500;1,500');
  }

  open(i: number): void {
    this.openIndex.set(i);
    afterNextRender(() => this.closeBtn()?.nativeElement.focus(), { injector: this.injector });
  }

  close(): void {
    const i = this.openIndex();
    if (i === null) return;
    this.openIndex.set(null);
    afterNextRender(() => this.tiles()[i]?.nativeElement.focus(), { injector: this.injector });
  }

  step(d: number): void {
    const i = this.openIndex();
    if (i === null) return;
    this.dir.set(d);
    this.openIndex.set((i + d + this.shots.length) % this.shots.length);
  }

  goTo(i: number): void {
    const cur = this.openIndex() ?? 0;
    this.dir.set(i >= cur ? 1 : -1);
    this.openIndex.set(i);
  }

  backdrop(e: MouseEvent): void {
    if (this.moved) { this.moved = false; return; } // the click that ends a swipe never closes
    if (e.target === e.currentTarget) this.close();
  }

  key(e: KeyboardEvent): void {
    if (this.openIndex() === null) return;
    if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.step(-1); }
    else if (e.key === 'Tab') this.trap(e);
  }

  private trap(e: KeyboardEvent): void {
    const root = (e.currentTarget as HTMLElement).querySelector('.lb');
    if (!root) return;
    const f = Array.from(root.querySelectorAll<HTMLElement>('button'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  swipeStart(e: PointerEvent): void {
    this.moved = false;
    const t = e.target as HTMLElement;
    if (t.closest('button') || t.closest('.thumbs') || (e.pointerType === 'mouse' && e.button !== 0)) { this.sid = -1; return; }
    this.sid = e.pointerId;
    this.sx = e.clientX;
    this.sy = e.clientY;
  }

  swipeMove(e: PointerEvent): void {
    if (e.pointerId !== this.sid) return;
    const dx = e.clientX - this.sx, dy = e.clientY - this.sy;
    if (!this.swiping()) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      this.swiping.set(true);
      this.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    this.drag.set(dx);
  }

  swipeEnd(e: PointerEvent): void {
    if (e.pointerId !== this.sid) return;
    this.sid = -1;
    const dx = this.drag();
    this.swiping.set(false);
    this.drag.set(0);
    if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1);
  }

  swipeCancel(): void {
    this.sid = -1;
    this.swiping.set(false);
    this.drag.set(0);
  }
}
