import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Bean {
  id: string;
  name: string;
  origin: string;
  process: string;
  altitude: string;
  notes: string[];
  roast: number;
  bg: string;
  ink: string;
}

@Component({
  selector: 'demo-fanned-deck-coffee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <div class="intro">
        <p class="small">Roastery subscription · November box</p>
        <h3>Four single origins, one at a time.</h3>
        <p class="lead">Tap the deck to send the top bag to the back and meet the next one.</p>
        <div class="row">
          <button type="button" class="next" (click)="cycle()">Next bean</button>
          <span class="count">{{ topIndex() + 1 }} / {{ beans.length }}</span>
        </div>
      </div>

      <button
        type="button"
        class="deck"
        (click)="tap()"
        (pointerdown)="down($event)"
        (pointerup)="up($event)"
        (pointercancel)="startX = null"
        [attr.aria-label]="'Showing ' + top().name + ' from ' + top().origin + '. Activate to see the next coffee.'"
      >
        @for (b of beans; track b.id; let i = $index) {
          <span
            class="card"
            [class.out]="flying() === i"
            [style.--pos]="pos(i)"
            [style.z-index]="flying() === i ? 50 : 10 - pos(i)"
            [style.--bg]="b.bg"
            [style.--ink]="b.ink"
            aria-hidden="true"
          >
            <span class="top">
              <span class="origin">{{ b.origin }}</span>
              <span class="no">No. {{ i + 1 }}</span>
            </span>
            <span class="name">{{ b.name }}</span>
            <span class="notes">
              @for (n of b.notes; track n) {
                <span>{{ n }}</span>
              }
            </span>
            <span class="specs">
              <span><em>Process</em>{{ b.process }}</span>
              <span><em>Altitude</em>{{ b.altitude }}</span>
            </span>
            <span class="roast">
              <em>Roast</em>
              <span class="scale">
                @for (r of [1, 2, 3, 4, 5]; track r) {
                  <span [class.on]="r <= b.roast"></span>
                }
              </span>
            </span>
          </span>
        }
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; background: #1d2a23; color: #e9efe6;
      font-family: 'Geist', system-ui, sans-serif; container-type: inline-size; overflow: hidden;
    }
    .layout { display: grid; grid-template-columns: 1fr 1.1fr; align-items: center; gap: 24px; min-height: 100%; padding: clamp(24px, 5cqi, 56px); }
    .small { font-size: 13px; color: #9fb3a6; }
    h3 { font-family: 'Young Serif', serif; font-weight: 400; font-size: clamp(26px, 4cqi, 40px); line-height: 1.05; margin-top: 10px; letter-spacing: -0.01em; }
    .lead { color: #b9c8bd; margin-top: 12px; max-width: 34ch; font-size: 15px; }
    .row { display: flex; align-items: center; gap: 14px; margin-top: 22px; }
    .next { height: 44px; padding: 0 20px; border-radius: 999px; border: 1px solid #e9efe6; background: #e9efe6; color: #1d2a23; font-weight: 600; cursor: pointer; transition: background .2s, transform .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .next:hover { background: #fff; }
    .next:active { transform: scale(.96); }
    .count { font-family: 'Geist Mono', monospace; font-size: 13px; color: #9fb3a6; }

    .deck { position: relative; height: 380px; border: 0; background: none; padding: 0; cursor: pointer; border-radius: 22px; display: block; width: 100%; touch-action: pan-y; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none; }
    .deck:focus-visible { outline: 2px solid #e9efe6; outline-offset: 8px; }
    .card {
      position: absolute; left: 50%; top: 50%; width: min(260px, 100%); height: 340px; margin: -170px 0 0 calc(min(260px, 100%) / -2);
      background: var(--bg); color: var(--ink); border-radius: 18px; padding: 20px; text-align: left;
      display: flex; flex-direction: column; gap: 12px;
      box-shadow: 0 1px 0 rgba(255,255,255,.4) inset, 0 24px 40px -22px rgba(0,0,0,.7);
      transform: translate(calc(var(--pos) * 14px), calc(var(--pos) * -10px)) rotate(calc(var(--pos) * 5deg)) scale(calc(1 - var(--pos) * .04));
      transition: transform .5s cubic-bezier(.3,.75,.25,1), filter .5s;
      filter: brightness(calc(1 - var(--pos) * .08));
    }
    .card.out { transform: translate(-70%, 30px) rotate(-18deg) scale(.96); transition: transform .34s cubic-bezier(.5,0,.75,0); }
    @media (hover: hover) { .deck:hover .card:not(.out) { transform: translate(calc(var(--pos) * 20px), calc(var(--pos) * -14px)) rotate(calc(var(--pos) * 7deg)) scale(calc(1 - var(--pos) * .04)); } }
    .deck:active .card:not(.out) { scale: .985; }
    .top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 500; }
    .no { font-family: 'Geist Mono', monospace; opacity: .7; }
    .name { font-family: 'Young Serif', serif; font-size: 30px; line-height: 1; letter-spacing: -0.01em; }
    .notes { display: flex; flex-wrap: wrap; gap: 5px; }
    .notes span { font-size: 12px; border: 1px solid color-mix(in srgb, var(--ink) 35%, transparent); border-radius: 999px; padding: 3px 9px; }
    .specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: auto; font-size: 13.5px; font-weight: 500; }
    em { display: block; font-style: normal; font-family: 'Geist Mono', monospace; font-size: 10.5px; opacity: .65; margin-bottom: 2px; }
    .roast { border-top: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent); padding-top: 10px; display: flex; justify-content: space-between; align-items: center; }
    .roast em { margin: 0; }
    .scale { display: flex; gap: 4px; }
    .scale span { width: 18px; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--ink) 18%, transparent); }
    .scale span.on { background: var(--ink); }
    @container (max-width: 640px) {
      .layout { grid-template-columns: 1fr; }
      .deck { height: 380px; }
    }
    @container (max-width: 400px) {
      .layout { gap: 12px; padding: 22px 18px; }
      .lead { font-size: 14px; }
      .row { margin-top: 16px; }
      .deck { height: 350px; }
      .card { width: 232px; height: 316px; margin: -158px 0 0 -128px; padding: 18px; }
      .name { font-size: 27px; }
    }
  `,
})
export class FannedDeckCoffee {
  protected readonly beans: Bean[] = [
    { id: 'b1', name: 'La Esperanza', origin: 'Huila, Colombia', process: 'Washed', altitude: '1,750 m', notes: ['Red apple', 'Panela', 'Cocoa nib'], roast: 2, bg: '#f2d48b', ink: '#3b2a06' },
    { id: 'b2', name: 'Gedeb Halo', origin: 'Yirgacheffe, Ethiopia', process: 'Natural', altitude: '2,100 m', notes: ['Blueberry', 'Jasmine', 'Bergamot'], roast: 1, bg: '#c6d8f2', ink: '#14274a' },
    { id: 'b3', name: 'Finca Lerida', origin: 'Chiriquí, Panama', process: 'Honey', altitude: '1,650 m', notes: ['Peach', 'Honeycomb', 'Black tea'], roast: 3, bg: '#f4c3b8', ink: '#4a1a10' },
    { id: 'b4', name: 'Kiambu AA', origin: 'Central Kenya', process: 'Washed', altitude: '1,800 m', notes: ['Blackcurrant', 'Grapefruit', 'Molasses'], roast: 4, bg: '#bfe0c8', ink: '#123522' },
  ];
  private readonly order = signal<number[]>([0, 1, 2, 3]);
  protected readonly flying = signal<number | null>(null);
  protected readonly topIndex = computed(() => this.order()[0]);
  protected readonly top = computed(() => this.beans[this.topIndex()]);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    loadGoogleFonts('Young+Serif');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected startX: number | null = null;
  private swiped = false;

  protected down(e: PointerEvent): void {
    this.startX = e.clientX;
    this.swiped = false;
  }

  protected up(e: PointerEvent): void {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 40) {
      this.swiped = true;
      this.cycle();
    }
  }

  /** Click (tap, Enter, Space) cycles — unless it ended a swipe that already did. */
  protected tap(): void {
    if (this.swiped) {
      this.swiped = false;
      return;
    }
    this.cycle();
  }

  protected pos(i: number): number {
    return this.order().indexOf(i);
  }

  protected cycle(): void {
    if (this.flying() !== null) return;
    const rotate = () => {
      const [first, ...rest] = this.order();
      this.order.set([...rest, first]);
      this.flying.set(null);
    };
    if (prefersReducedMotion()) {
      rotate();
      return;
    }
    this.flying.set(this.topIndex());
    this.timer = setTimeout(rotate, 340);
  }
}
