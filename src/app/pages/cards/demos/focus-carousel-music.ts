import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Show {
  id: string;
  artist: string;
  title: string;
  venue: string;
  date: string;
  price: number;
  a: string;
  b: string;
  ink: string;
  shape: 'sun' | 'rings' | 'bars' | 'wave' | 'grid';
}

@Component({
  selector: 'demo-focus-carousel-music',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <p class="label">Live this winter · <strong>Brixton &amp; Hackney</strong></p>

      <div
        class="ring"
        role="region"
        aria-roledescription="carousel"
        aria-label="Upcoming shows"
        tabindex="0"
        (keydown.arrowright)="go(active() + 1); $event.preventDefault()"
        (keydown.arrowleft)="go(active() - 1); $event.preventDefault()"
        (pointerdown)="down($event)"
        (pointerup)="up($event)"
        (pointercancel)="startX = null"
      >
        @for (s of shows; track s.id; let i = $index) {
          <button
            type="button"
            class="card"
            [class.active]="i === active()"
            [style.--o]="i - active()"
            [style.--abs]="abs(i - active())"
            [style.--a]="s.a"
            [style.--b]="s.b"
            [style.--ink]="s.ink"
            [style.z-index]="20 - abs(i - active())"
            [attr.aria-label]="s.artist + ', ' + s.title + (i === active() ? ' (selected)' : '')"
            [attr.tabindex]="i === active() ? 0 : -1"
            (click)="pick(i)"
          >
            <span class="art" aria-hidden="true">
              @switch (s.shape) {
                @case ('sun') { <svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="26" /><rect x="0" y="62" width="100" height="40" /></svg> }
                @case ('rings') { <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="22" /><circle cx="50" cy="50" r="10" /></svg> }
                @case ('bars') { <svg viewBox="0 0 100 100"><rect x="14" y="30" width="10" height="50" /><rect x="32" y="16" width="10" height="64" /><rect x="50" y="40" width="10" height="40" /><rect x="68" y="24" width="10" height="56" /></svg> }
                @case ('wave') { <svg viewBox="0 0 100 100"><path d="M0 60 Q 25 30 50 60 T 100 60 V100 H0Z" /><path d="M0 74 Q 25 50 50 74 T 100 74 V100 H0Z" /></svg> }
                @case ('grid') { <svg viewBox="0 0 100 100"><rect x="18" y="18" width="28" height="28" rx="14" /><rect x="54" y="18" width="28" height="28" /><rect x="18" y="54" width="28" height="28" /><rect x="54" y="54" width="28" height="28" rx="14" /></svg> }
              }
            </span>
            <span class="cap">
              <span class="artist">{{ s.artist }}</span>
              <span class="title">{{ s.title }}</span>
            </span>
          </button>
        }
      </div>

      <div class="detail" aria-live="polite">
        <div>
          <p class="when">{{ current().date }}</p>
          <p class="where">{{ current().venue }}</p>
        </div>
        <div class="controls">
          <button type="button" class="nav" (click)="go(active() - 1)" [disabled]="active() === 0" aria-label="Previous show">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <span class="count">{{ active() + 1 }}/{{ shows.length }}</span>
          <button type="button" class="nav" (click)="go(active() + 1)" [disabled]="active() === shows.length - 1" aria-label="Next show">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <button type="button" class="buy" [style.--a]="current().a">Tickets £{{ current().price }}</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%;
      background: radial-gradient(80% 60% at 50% 40%, #24201c 0%, #0e0d0c 70%);
      color: #f3ede4; font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size; overflow: hidden;
    }
    .wrap { display: flex; flex-direction: column; min-height: 100%; padding: 26px clamp(16px, 4cqi, 40px); gap: 18px; }
    .label { font-size: 13px; color: #a69d90; text-align: center; }
    .label strong { color: #f3ede4; font-weight: 500; }
    .ring {
      --step: clamp(110px, 21cqi, 210px);
      --w: clamp(176px, 30cqi, 270px);
      position: relative; height: calc(var(--w) * 1.32); flex: 1; min-height: 260px;
      touch-action: pan-y; cursor: grab; outline-offset: 6px; border-radius: 12px;
      user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
    }
    .card {
      position: absolute; left: 50%; top: 50%; width: var(--w); aspect-ratio: 1 / 1.22;
      margin: 0; padding: 0; border: 0; border-radius: 6px; cursor: pointer; text-align: left;
      background: linear-gradient(160deg, var(--a), var(--b)); color: var(--ink);
      display: flex; flex-direction: column; overflow: hidden;
      transform: translate(-50%, -50%) translateX(calc(var(--o) * var(--step))) scale(calc(1 - var(--abs) * 0.16)) rotate(calc(var(--o) * 2deg));
      opacity: clamp(0, calc(1.6 - var(--abs) * 0.45), 1);
      filter: brightness(calc(1 - var(--abs) * 0.22)) saturate(calc(1 - var(--abs) * 0.2));
      transition: transform .6s cubic-bezier(.22,.8,.24,1), opacity .5s, filter .5s, box-shadow .5s;
      box-shadow: 0 20px 40px -24px rgba(0,0,0,.8);
    }
    .card.active { box-shadow: 0 40px 70px -30px color-mix(in srgb, var(--a) 70%, black), 0 0 0 1px rgba(255,255,255,.08); }
    .card:focus-visible { outline: 2px solid #f3ede4; outline-offset: 4px; }
    .art { flex: 1; display: grid; place-items: center; padding: 16px; }
    .art svg { width: 78%; fill: var(--ink); opacity: .9; }
    .cap { display: flex; flex-direction: column; padding: 0 16px 16px; gap: 2px; }
    .artist { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(17px, 2.4cqi, 22px); letter-spacing: -0.02em; line-height: 1; }
    .title { font-size: 12.5px; opacity: .75; }

    .detail { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; border-top: 1px solid #2c2823; padding-top: 16px; }
    .when { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
    .where { font-size: 13.5px; color: #a69d90; }
    .controls { display: flex; align-items: center; gap: 8px; }
    .nav { width: 42px; height: 42px; border-radius: 50%; border: 1px solid #3a352f; background: transparent; color: inherit; display: grid; place-items: center; cursor: pointer; transition: background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .nav:hover:not(:disabled), .nav:active:not(:disabled) { background: #2a2622; }
    .nav:disabled { opacity: .35; cursor: default; }
    .nav svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    .count { font-family: 'Geist Mono', monospace; font-size: 12px; color: #a69d90; min-width: 30px; text-align: center; }
    .buy { height: 42px; padding: 0 18px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; border-radius: 999px; border: 0; background: var(--a); color: #120f0c; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .4s, transform .2s; }
    .buy:active { transform: scale(.96); }
    .card { -webkit-tap-highlight-color: transparent; touch-action: pan-y; }
    @container (max-width: 400px) {
      .detail { gap: 12px; }
      .controls { width: 100%; }
      .buy { margin-left: auto; }
    }
  `,
})
export class FocusCarouselMusic {
  protected readonly shows: Show[] = [
    { id: 'm1', artist: 'Halcyon Drift', title: 'Low Tide Tour', venue: 'O2 Academy Brixton', date: 'Fri 14 Nov · 19:30', price: 32, a: '#ff9f5a', b: '#d9434b', ink: '#2a0d0f', shape: 'sun' },
    { id: 'm2', artist: 'Mira Okafor', title: 'Glasshouse', venue: 'EartH, Hackney', date: 'Sat 22 Nov · 20:00', price: 28, a: '#9ee6d6', b: '#3a8f9a', ink: '#0b2b2f', shape: 'rings' },
    { id: 'm3', artist: 'The Velvet Static', title: 'Night Bus', venue: 'Electric Brixton', date: 'Thu 4 Dec · 19:00', price: 25, a: '#f3e37c', b: '#e08a2e', ink: '#2c1a04', shape: 'bars' },
    { id: 'm4', artist: 'Juno Park', title: 'Saltwater', venue: 'Hackney Church', date: 'Sun 7 Dec · 18:30', price: 35, a: '#b9c7ff', b: '#5560c9', ink: '#0d1033', shape: 'wave' },
    { id: 'm5', artist: 'Kofi & The Lamps', title: 'Paper Moons', venue: 'Jazz Café, Camden', date: 'Wed 17 Dec · 20:30', price: 22, a: '#f7b6d0', b: '#b8467e', ink: '#300a1c', shape: 'grid' },
  ];
  protected readonly active = signal(1);
  protected readonly current = computed(() => this.shows[this.active()]);
  protected startX: number | null = null;
  private dragged = false;

  constructor() {
    loadGoogleFonts('Syne:wght@700;800');
  }

  protected abs(n: number): number {
    return Math.abs(n);
  }

  protected go(i: number): void {
    this.active.set(Math.max(0, Math.min(this.shows.length - 1, i)));
  }

  protected down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.startX = e.clientX;
    this.dragged = false;
  }

  protected up(e: PointerEvent): void {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 40) {
      this.dragged = true;
      this.go(this.active() + (dx < 0 ? 1 : -1));
    }
  }

  protected pick(i: number): void {
    if (this.dragged) {
      this.dragged = false;
      return;
    }
    this.go(i);
  }
}
