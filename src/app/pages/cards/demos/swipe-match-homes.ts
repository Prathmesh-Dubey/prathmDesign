import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Home {
  id: string;
  area: string;
  city: string;
  rent: number;
  beds: number;
  sqm: number;
  perk: string;
  img: string;
}

const THRESHOLD = 110;

@Component({
  selector: 'demo-swipe-match-homes',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
      <header>
        <span class="logo">nestle<b>.</b></span>
        <span class="saved">Saved <strong>{{ liked().length }}</strong></span>
      </header>

      <div
        class="deck"
        tabindex="0"
        role="group"
        aria-label="Apartment listings. Press Left to pass, Right to save."
        (keydown.arrowleft)="decide(-1); $event.preventDefault()"
        (keydown.arrowright)="decide(1); $event.preventDefault()"
      >
        @for (h of visible(); track h.id; let i = $index) {
          <article
            class="card"
            [class.top]="i === 0"
            [class.drag]="i === 0 && dragging()"
            [class.leave]="i === 0 && leaving() !== 0"
            [style.z-index]="10 - i"
            [style.transform]="transformFor(i)"
            (pointerdown)="i === 0 && down($event)"
            (pointermove)="i === 0 && move($event)"
            (pointerup)="i === 0 && up()"
            (pointercancel)="i === 0 && cancel()"
            [attr.aria-hidden]="i === 0 ? null : 'true'"
          >
            <img [src]="h.img" [appImgFallback]="h.id" [alt]="'Listing photo for ' + h.area + ', ' + h.city" draggable="false" />
            @if (i === 0) {
              <span class="stamp like" [style.opacity]="likeOpacity()">Save</span>
              <span class="stamp nope" [style.opacity]="nopeOpacity()">Pass</span>
            }
            <div class="info">
              <p class="perk">{{ h.perk }}</p>
              <h4>{{ h.area }}<span>, {{ h.city }}</span></h4>
              <div class="facts">
                <span class="rent">€{{ h.rent.toLocaleString('en-GB') }}<small>/mo</small></span>
                <span>{{ h.beds }} bed</span>
                <span>{{ h.sqm }} m²</span>
              </div>
            </div>
          </article>
        } @empty {
          <div class="empty">
            <p>That's every listing in your area.</p>
            <button type="button" class="reset" (click)="reset()">Start over</button>
          </div>
        }
      </div>

      <div class="actions">
        <button type="button" class="act nope" (click)="decide(-1)" [disabled]="!visible().length" aria-label="Pass on this listing">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <button type="button" class="act undo" (click)="undo()" [disabled]="!history().length" aria-label="Undo last swipe">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 010 12h-3" /></svg>
        </button>
        <button type="button" class="act like" (click)="decide(1)" [disabled]="!visible().length" aria-label="Save this listing">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>
        </button>
      </div>
      <p class="sr" aria-live="polite">{{ announce() }}</p>
    </div>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 22px 16px;
      background: radial-gradient(90% 70% at 50% 0%, #262a35, #121419 70%); color: #f4f5f7;
      font-family: 'Outfit', 'Geist', sans-serif;
    }
    .app { width: min(340px, 100%); display: flex; flex-direction: column; gap: 16px; }
    header { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 700; font-size: 22px; letter-spacing: -0.03em; }
    .logo b { color: #ff4d6d; }
    .saved { font-size: 13px; color: #a3a8b5; background: #1d2028; padding: 5px 11px; border-radius: 999px; }
    .saved strong { color: #3ddc97; }
    .deck { position: relative; aspect-ratio: 3 / 3.9; border-radius: 24px; outline-offset: 6px; }
    .card {
      position: absolute; inset: 0; border-radius: 24px; overflow: hidden; background: #2a2e39;
      box-shadow: 0 30px 50px -30px rgba(0,0,0,.9);
      transition: transform .45s cubic-bezier(.2,.9,.3,1.15);
      user-select: none; -webkit-user-select: none; touch-action: pan-y; -webkit-tap-highlight-color: transparent;
    }
    .card.top { cursor: grab; }
    .card.drag { transition: none; cursor: grabbing; }
    .card.leave { transition: transform .32s cubic-bezier(.4,0,1,1); }
    .card img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(10,11,15,.88)); pointer-events: none; }
    .info { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px; z-index: 1; }
    .perk { display: inline-block; font-size: 12px; font-weight: 600; background: rgba(255,255,255,.16); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 999px; }
    h4 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-top: 10px; }
    h4 span { font-weight: 400; opacity: .7; font-size: 18px; }
    .facts { display: flex; gap: 14px; align-items: baseline; margin-top: 6px; font-size: 14px; color: #d4d7de; }
    .rent { font-size: 18px; font-weight: 700; color: #fff; }
    .rent small { font-weight: 400; font-size: 12px; opacity: .7; }
    .stamp {
      position: absolute; top: 26px; z-index: 2; font-weight: 800; font-size: 30px; letter-spacing: .04em;
      padding: 2px 14px; border: 4px solid; border-radius: 10px; opacity: 0; pointer-events: none;
    }
    .stamp.like { left: 22px; color: #3ddc97; transform: rotate(-14deg); }
    .stamp.nope { right: 22px; color: #ff4d6d; transform: rotate(14deg); }
    .empty { position: absolute; inset: 0; display: grid; place-content: center; gap: 14px; text-align: center; border: 2px dashed #353a47; border-radius: 24px; color: #a3a8b5; padding: 20px; }
    .reset { justify-self: center; height: 44px; padding: 0 20px; border: 0; border-radius: 999px; background: #f4f5f7; color: #121419; font-weight: 600; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .reset:active { transform: scale(.96); }
    .actions { display: flex; justify-content: center; align-items: center; gap: 18px; }
    .act { border-radius: 50%; border: 1px solid #2f3340; background: #1b1e26; display: grid; place-items: center; cursor: pointer; transition: transform .2s cubic-bezier(.3,1.6,.5,1), background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @media (hover: hover) { .act:hover:not(:disabled) { transform: scale(1.1); } }
    .act:active:not(:disabled) { transform: scale(.92); }
    .act:disabled { opacity: .35; cursor: default; }
    .act svg { fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
    .act.nope, .act.like { width: 60px; height: 60px; }
    .act.nope { color: #ff4d6d; }
    .act.like { color: #3ddc97; }
    .act.nope svg, .act.like svg { width: 26px; height: 26px; }
    .act.undo { width: 44px; height: 44px; color: #f2c14e; }
    .act.undo svg { width: 20px; height: 20px; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  `,
})
export class SwipeMatchHomes {
  private readonly homes: Home[] = [
    { id: 'h1', area: 'Jordaan', city: 'Amsterdam', rent: 2150, beds: 2, sqm: 68, perk: 'Canal view', img: unsplash('photo-1502672260266-1c1ef2d93688', 680, 880) },
    { id: 'h2', area: 'Kreuzberg', city: 'Berlin', rent: 1480, beds: 1, sqm: 54, perk: 'Pets allowed', img: unsplash('photo-1522708323590-d24dbb6b0267', 680, 880) },
    { id: 'h3', area: 'Gràcia', city: 'Barcelona', rent: 1320, beds: 2, sqm: 61, perk: 'Roof terrace', img: unsplash('photo-1560448204-e02f11c3d0e2', 680, 880) },
    { id: 'h4', area: 'Príncipe Real', city: 'Lisbon', rent: 1890, beds: 3, sqm: 92, perk: 'Furnished', img: unsplash('photo-1600607687939-ce8a6c25118c', 680, 880) },
    { id: 'h5', area: 'Södermalm', city: 'Stockholm', rent: 1760, beds: 1, sqm: 47, perk: 'Sauna in building', img: unsplash('photo-1600585154340-be6161a56a0c', 680, 880) },
  ];
  private readonly deck = signal<string[]>(this.homes.map((h) => h.id));
  protected readonly history = signal<{ id: string; dir: number }[]>([]);
  protected readonly liked = computed(() => this.history().filter((h) => h.dir > 0));
  protected readonly visible = computed(() =>
    this.deck()
      .slice(0, 3)
      .map((id) => this.homes.find((h) => h.id === id)!),
  );
  protected readonly dx = signal(0);
  protected readonly dy = signal(0);
  protected readonly dragging = signal(false);
  protected readonly leaving = signal(0);
  protected readonly announce = signal('');
  protected readonly likeOpacity = computed(() => Math.max(0, Math.min(1, this.dx() / THRESHOLD)));
  protected readonly nopeOpacity = computed(() => Math.max(0, Math.min(1, -this.dx() / THRESHOLD)));
  private start = { x: 0, y: 0 };
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    loadGoogleFonts('Outfit:wght@400;600;700;800');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected transformFor(i: number): string {
    if (i === 0) {
      const dir = this.leaving();
      if (dir !== 0) return `translate(${dir * 150}%, ${this.dy()}px) rotate(${dir * 28}deg)`;
      return `translate(${this.dx()}px, ${this.dy()}px) rotate(${this.dx() * 0.07}deg)`;
    }
    const p = Math.min(1, Math.abs(this.dx()) / THRESHOLD) || (this.leaving() !== 0 ? 1 : 0);
    const depth = i - p;
    return `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`;
  }

  protected down(e: PointerEvent): void {
    if (this.leaving() !== 0 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.start = { x: e.clientX, y: e.clientY };
    this.dragging.set(true);
  }

  protected move(e: PointerEvent): void {
    if (!this.dragging()) return;
    this.dx.set(e.clientX - this.start.x);
    this.dy.set((e.clientY - this.start.y) * 0.4);
  }

  /** The browser took over the gesture (e.g. a vertical page scroll): snap the card back. */
  protected cancel(): void {
    if (!this.dragging()) return;
    this.dragging.set(false);
    this.dx.set(0);
    this.dy.set(0);
  }

  protected up(): void {
    if (!this.dragging()) return;
    this.dragging.set(false);
    if (Math.abs(this.dx()) > THRESHOLD) {
      this.decide(this.dx() > 0 ? 1 : -1);
    } else {
      this.dx.set(0);
      this.dy.set(0);
    }
  }

  protected decide(dir: number): void {
    const top = this.visible()[0];
    if (!top || this.leaving() !== 0) return;
    this.leaving.set(dir);
    this.announce.set(`${dir > 0 ? 'Saved' : 'Passed on'} ${top.area}`);
    this.timer = setTimeout(() => {
      this.deck.update((d) => d.slice(1));
      this.history.update((h) => [...h, { id: top.id, dir }]);
      this.leaving.set(0);
      this.dx.set(0);
      this.dy.set(0);
    }, 320);
  }

  protected undo(): void {
    const last = this.history().at(-1);
    if (!last || this.leaving() !== 0) return;
    this.history.update((h) => h.slice(0, -1));
    this.deck.update((d) => [last.id, ...d]);
    this.announce.set('Undid last swipe');
  }

  protected reset(): void {
    this.history.set([]);
    this.deck.set(this.homes.map((h) => h.id));
  }
}
