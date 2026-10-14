import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Course {
  id: number;
  dish: string;
  note: string;
  wine: string;
  src: string;
  thumb: string;
}

const COURSES: [string, string, string][] = [
  ['Smoked eel, burnt apple', 'Eel from Comacchio, cold-smoked over vine cuttings.', 'Franciacorta Brut, Ca’ del Bosco'],
  ['Raw scallop, citron, dill oil', 'Hand-dived in Brittany, sliced to order.', 'Vermentino, Lunae 2023'],
  ['Risotto, saffron & bone marrow', 'Carnaroli aged two years, Navelli saffron.', 'Timorasso, Vigneti Massa 2021'],
  ['Turbot, brown butter, capers', 'Line-caught, roasted on the bone.', 'Etna Bianco, Pietradolce 2022'],
  ['Lamb neck, sour cherries', 'Twelve-hour braise, glazed over embers.', 'Barbaresco, Produttori 2019'],
  ['Pecorino, chestnut honey', 'Pienza pecorino, twelve months in ash.', 'Vin Santo, Avignonesi'],
  ['Olive oil cake, fig leaf', 'Fig-leaf ice cream, Ligurian Taggiasca oil.', 'Moscato d’Asti, Vietti'],
];

@Component({
  selector: 'demo-thumb-vertical-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <div class="rail" role="tablist" aria-label="Tasting menu courses" aria-orientation="vertical">
        <span class="ind" aria-hidden="true" [style.--i]="active()"></span>
        @for (c of courses; track c.id; let i = $index) {
          <button #thumb type="button" role="tab" [attr.aria-selected]="i === active()" [tabindex]="i === active() ? 0 : -1"
            (click)="pick(i)" (keydown)="key($event)" [class.on]="i === active()" [attr.aria-label]="'Course ' + (i + 1) + ': ' + c.dish">
            <img [src]="c.thumb" alt="" />
          </button>
        }
      </div>

      <div class="main" role="tabpanel" [attr.aria-label]="cur().dish"
        (pointerdown)="swipeDown($event)" (pointermove)="swipeMove($event)" (pointerup)="sw = null" (pointercancel)="sw = null">
        @for (c of courses; track c.id; let i = $index) {
          <img [src]="c.src" [alt]="'Course ' + (i + 1) + ' of the Osteria Lume tasting menu: ' + c.dish" [class.on]="i === active()" />
        }
        <div class="scrim" aria-hidden="true"></div>
        <div class="cap" aria-live="polite">
          @for (k of [active()]; track k) {
            <div class="cap-in">
              <p class="no">Course {{ k + 1 }} <span>of {{ courses.length }}</span></p>
              <h3>{{ cur().dish }}</h3>
              <p class="note">{{ cur().note }}</p>
              <p class="wine"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 2h8c0 5-1 8-4 8s-4-3-4-8zM10 10v7M6.5 17.5h7" /></svg>{{ cur().wine }}</p>
            </div>
          }
        </div>
        <p class="brand">Osteria Lume · Bologna</p>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #171310; color: #f4ece1; padding: clamp(12px, 2.4cqw, 24px); --th: 64px; --g: 8px; }
    .wrap { display: grid; grid-template-columns: auto 1fr; gap: 14px; height: 100%; min-height: 492px; }
    .rail { position: relative; display: grid; grid-auto-rows: var(--th); gap: var(--g); align-content: start; padding-left: 10px; }
    .ind { position: absolute; left: 0; top: 0; width: 3px; height: var(--th); border-radius: 3px; background: #e8a33d;
      transform: translateY(calc(var(--i) * (var(--th) + var(--g)))); transition: transform .5s cubic-bezier(.65,0,.25,1); }
    .rail button { width: calc(var(--th) * 1.25); height: var(--th); padding: 0; border: 0; border-radius: 8px; overflow: hidden; cursor: pointer; background: #2a231d;
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .rail button:active img { filter: grayscale(.2) brightness(.85); }
    .rail img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(.7) brightness(.6); transition: filter .35s, transform .5s; }
    .rail button:hover img { filter: grayscale(.2) brightness(.85); transform: scale(1.06); }
    .rail button.on img { filter: none; }
    .rail button:focus-visible { outline: 2px solid #e8a33d; outline-offset: 2px; }
    .main { position: relative; border-radius: 16px; overflow: hidden; background: #2a231d; min-height: 420px; touch-action: pan-y; -webkit-user-select: none; user-select: none; }
    .main > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.08);
      transition: opacity .9s ease, transform 1.6s cubic-bezier(.2,.7,.2,1); }
    .main > img.on { opacity: 1; transform: scale(1); }
    .scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(18,14,11,.88) 0%, rgba(18,14,11,.4) 45%, transparent 70%); }
    .cap { position: absolute; left: clamp(18px, 4cqw, 40px); bottom: clamp(18px, 4cqw, 36px); max-width: min(420px, 70%); }
    .cap-in > * { animation: up .7s cubic-bezier(.2,.8,.2,1) both; }
    .cap-in > :nth-child(2) { animation-delay: .06s; } .cap-in > :nth-child(3) { animation-delay: .12s; } .cap-in > :nth-child(4) { animation-delay: .18s; }
    @keyframes up { from { opacity: 0; transform: translateY(14px); } }
    .no { font-size: 12.5px; color: #e8a33d; font-weight: 500; } .no span { color: rgba(244,236,225,.5); }
    h3 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(28px, 4.6cqw, 50px); line-height: 1; margin-top: 8px; }
    .note { font-size: 14px; color: rgba(244,236,225,.78); margin-top: 12px; line-height: 1.5; }
    .wine { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; font-size: 12.5px; padding: 6px 12px 6px 9px; border-radius: 99px; border: 1px solid rgba(232,163,61,.4); color: #f2c98a; }
    .wine svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
    .brand { position: absolute; right: 16px; top: 14px; font-family: 'DM Serif Display', serif; font-style: italic; font-size: 15px; color: rgba(244,236,225,.7); }
    @container (max-width: 600px) {
      .wrap { --th: 52px; grid-template-columns: 1fr; grid-template-rows: 1fr auto; }
      .rail { order: 2; grid-auto-flow: column; grid-auto-columns: calc(var(--th) * 1.25); grid-auto-rows: auto; overflow-x: auto; padding: 0 0 4px; scrollbar-width: none;
        overscroll-behavior-x: contain; scroll-snap-type: x proximity; }
      .rail::-webkit-scrollbar { display: none; }
      .rail button { scroll-snap-align: start; }
      .main { min-height: 380px; }
      .note { font-size: 13px; }
      .ind { display: none; }
      .rail button.on { outline: 2px solid #e8a33d; outline-offset: -2px; }
      .cap { max-width: none; right: 18px; }
    }
  `,
})
export class ThumbVerticalRail {
  private readonly thumbs = viewChildren<ElementRef<HTMLButtonElement>>('thumb');
  protected readonly courses: Course[] = COURSES.map(([dish, note, wine], id) => ({
    id, dish, note, wine, src: photo('osteria-lume-' + id, 1300, 900), thumb: photo('osteria-lume-' + id, 160, 128),
  }));
  protected readonly active = signal(0);
  protected readonly cur = computed(() => this.courses[this.active()]);

  constructor() {
    loadGoogleFonts('DM+Serif+Display:ital@0;1');
  }

  pick(i: number): void {
    this.active.set(i);
    // keep the active thumb visible in the horizontal rail on phones (no page scroll)
    const b = this.thumbs()[i]?.nativeElement;
    const rail = b?.parentElement;
    if (b && rail && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: b.offsetLeft - rail.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' });
    }
  }

  // ---- swipe on the photo: > 40px horizontally = next / previous course
  protected sw: { id: number; x: number; y: number; done: boolean } | null = null;

  swipeDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.sw = { id: e.pointerId, x: e.clientX, y: e.clientY, done: false };
  }

  swipeMove(e: PointerEvent): void {
    const s = this.sw;
    if (!s || s.id !== e.pointerId || s.done) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      s.done = true;
      const n = this.courses.length;
      this.pick((this.active() + (dx < 0 ? 1 : -1) + n) % n);
    }
  }

  key(e: KeyboardEvent): void {
    const n = this.courses.length;
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (this.active() + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (this.active() - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    this.pick(next);
    this.thumbs()[next]?.nativeElement.focus();
  }
}
