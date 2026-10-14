import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

/** Horizontal finger/mouse travel that advances one cover while dragging. */
const STEP_PX = 70;
/** Movement below this is still a tap. */
const TAP_SLOP = 8;
import { loadGoogleFonts } from '../../../shared/fonts';

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  tracks: number;
  art: string;
  ink: string;
}

@Component({
  selector: 'demo-album-coverflow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flow"
      tabindex="0"
      [class.dragging]="dragging()"
      role="listbox"
      aria-label="Albums. Use Left and Right arrow keys to browse."
      [attr.aria-activedescendant]="'cf-' + albums[active()].id"
      (keydown.arrowleft)="go(active() - 1); $event.preventDefault()"
      (keydown.arrowright)="go(active() + 1); $event.preventDefault()"
      (keydown.home)="go(0); $event.preventDefault()"
      (keydown.end)="go(albums.length - 1); $event.preventDefault()"
      (wheel)="wheel($event)"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="up($event)"
      (pointercancel)="cancel()"
      (click)="guard($event)"
    >
      @for (a of albums; track a.id; let i = $index) {
        <div
          class="cover"
          role="option"
          [id]="'cf-' + a.id"
          [attr.aria-selected]="i === active()"
          [attr.aria-label]="a.title + ' by ' + a.artist"
          [class.active]="i === active()"
          [style.transform]="transformFor(i)"
          [style.z-index]="100 - abs(i - active())"
          [style.--art]="a.art"
          [style.--ink]="a.ink"
          (click)="pick(i)"
        >
          <div class="face">
            <span class="a-title">{{ a.title }}</span>
            <span class="a-artist">{{ a.artist }}</span>
          </div>
          <div class="refl" aria-hidden="true"></div>
        </div>
      }
    </div>

    <div class="now" aria-live="polite">
      <p class="t">{{ current().title }}</p>
      <p class="s">{{ current().artist }} · {{ current().year }} · {{ current().tracks }} songs</p>
      <div class="scrub" aria-hidden="true">
        @for (a of albums; track a.id; let i = $index) {
          <span [class.on]="i === active()"></span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; justify-content: center; min-height: 100%; padding: 30px 0 26px; overflow: hidden;
      background: linear-gradient(180deg, #000 0%, #0b0b0e 58%, #1a1a20 100%); color: #f2f2f5;
      font-family: 'Figtree', 'Geist', sans-serif; container-type: inline-size;
    }
    .flow {
      --size: clamp(150px, 26cqi, 250px);
      position: relative; height: calc(var(--size) * 1.55); perspective: 900px; outline: none; cursor: grab; touch-action: pan-y;
      user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
    }
    .flow.dragging { cursor: grabbing; }
    .flow:focus-visible .cover.active .face { box-shadow: 0 0 0 2px #fff, 0 20px 50px rgba(0,0,0,.8); }
    .cover {
      position: absolute; left: 50%; top: 8px; width: var(--size); height: var(--size); margin-left: calc(var(--size) / -2);
      transform-style: preserve-3d; transition: transform .55s cubic-bezier(.2,.8,.2,1); cursor: pointer;
    }
    .face {
      position: absolute; inset: 0; background: var(--art); color: var(--ink); padding: 12px;
      display: flex; flex-direction: column; justify-content: flex-end; border-radius: 2px;
      box-shadow: 0 20px 50px rgba(0,0,0,.8);
    }
    .face::after { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, rgba(255,255,255,.18), transparent 40%); pointer-events: none; }
    .a-title { font-weight: 800; font-size: clamp(14px, 2.2cqi, 20px); line-height: 1; letter-spacing: -0.02em; }
    .a-artist { font-size: 11px; opacity: .8; margin-top: 3px; }
    .refl {
      position: absolute; left: 0; right: 0; top: 100%; height: 100%; margin-top: 3px; background: var(--art); transform: scaleY(-1);
      -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,.32), transparent 45%);
      mask-image: linear-gradient(to top, rgba(0,0,0,.32), transparent 45%);
      pointer-events: none;
    }
    .cover:not(.active) .face { filter: brightness(.72); }
    .now { text-align: center; padding: 0 16px; }
    .t { font-weight: 700; font-size: 18px; letter-spacing: -0.01em; }
    .s { font-size: 13.5px; color: #9b9ba6; margin-top: 2px; }
    .scrub { display: flex; justify-content: center; gap: 5px; margin-top: 14px; }
    @container (max-width: 400px) {
      .flow { --size: 46cqi; }
      .a-artist { font-size: 10px; }
    }
    .scrub span { width: 6px; height: 6px; border-radius: 50%; background: #3a3a44; transition: background .3s, width .3s; }
    .scrub span.on { background: #f2f2f5; width: 18px; border-radius: 3px; }
  `,
})
export class AlbumCoverflow {
  protected readonly albums: Album[] = [
    { id: 'a1', title: 'Low Tide', artist: 'Halcyon Drift', year: 2025, tracks: 11, ink: '#2a0d0f', art: 'radial-gradient(circle at 50% 62%, #ffe2b0 0 22%, transparent 22.5%), linear-gradient(180deg, #ff9f5a 0 62%, #d9434b 62%)' },
    { id: 'a2', title: 'Glasshouse', artist: 'Mira Okafor', year: 2024, tracks: 9, ink: '#0b2b2f', art: 'repeating-radial-gradient(circle at 30% 30%, #9ee6d6 0 10px, #6cc4b6 10px 20px)' },
    { id: 'a3', title: 'Night Bus', artist: 'The Velvet Static', year: 2023, tracks: 12, ink: '#f3e37c', art: 'linear-gradient(90deg, #111 0 20%, #f3e37c 20% 24%, #111 24% 46%, #e08a2e 46% 50%, #111 50%)' },
    { id: 'a4', title: 'Saltwater', artist: 'Juno Park', year: 2025, tracks: 10, ink: '#0d1033', art: 'linear-gradient(160deg, #b9c7ff, #5560c9)' },
    { id: 'a5', title: 'Paper Moons', artist: 'Kofi & The Lamps', year: 2022, tracks: 8, ink: '#300a1c', art: 'conic-gradient(from 45deg, #f7b6d0 0 25%, #b8467e 0 50%, #f7b6d0 0 75%, #b8467e 0) 0 0 / 50% 50%' },
    { id: 'a6', title: 'Field Notes', artist: 'Ines Valle', year: 2024, tracks: 13, ink: '#1f2a1a', art: 'linear-gradient(0deg, #c9d7a5 0 30%, #8fae6b 30% 55%, #e9efd4 55%)' },
    { id: 'a7', title: 'Afterglow', artist: 'Sundays Club', year: 2021, tracks: 10, ink: '#fff', art: 'radial-gradient(120% 100% at 0% 100%, #ff4d6d, #7a1fa2 60%, #120a2a)' },
    { id: 'a8', title: 'Concrete Garden', artist: 'Tomás Rey', year: 2025, tracks: 7, ink: '#111', art: 'repeating-linear-gradient(45deg, #d6d3cc 0 12px, #bfbab0 12px 24px)' },
  ];
  protected readonly active = signal(3);
  protected readonly current = computed(() => this.albums[this.active()]);
  private startX: number | null = null;
  private anchorX = 0;
  private dragged = false;
  private stepped = 0;
  protected readonly dragging = signal(false);
  private wheelLock = 0;

  constructor() {
    loadGoogleFonts('Figtree:wght@400;700;800');
  }

  protected abs(n: number): number {
    return Math.abs(n);
  }

  protected transformFor(i: number): string {
    const o = i - this.active();
    if (o === 0) return 'translateX(0) translateZ(80px) rotateY(0deg)';
    const s = Math.sign(o);
    const x = s * (52 + Math.abs(o) * 17);
    return `translateX(${x}%) translateZ(${-60 - Math.abs(o) * 10}px) rotateY(${-s * 62}deg)`;
  }

  protected go(i: number): void {
    this.active.set(Math.max(0, Math.min(this.albums.length - 1, i)));
  }

  protected pick(i: number): void {
    if (this.dragged) return;
    this.go(i);
  }

  protected wheel(e: WheelEvent): void {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (!d) return;
    e.preventDefault();
    const now = performance.now();
    if (now - this.wheelLock < 160) return;
    this.wheelLock = now;
    this.go(this.active() + Math.sign(d));
  }

  protected down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.startX = e.clientX;
    this.anchorX = e.clientX;
    this.dragged = false;
    this.stepped = 0;
  }

  /** Scrub through covers while the pointer moves: one cover per STEP_PX of travel. */
  protected move(e: PointerEvent): void {
    if (this.startX === null) return;
    if (!this.dragged) {
      if (Math.abs(e.clientX - this.startX) < TAP_SLOP) return;
      this.dragged = true;
      this.dragging.set(true);
      // capture only once it is a real drag, so a plain tap still clicks the cover under the finger
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    const d = e.clientX - this.anchorX;
    if (Math.abs(d) >= STEP_PX) {
      const dir = Math.sign(d);
      this.anchorX += dir * STEP_PX;
      this.stepped++;
      this.go(this.active() - dir);
    }
  }

  protected up(e: PointerEvent): void {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    this.dragging.set(false);
    // a short flick that never reached a full step still moves one cover
    if (this.dragged && this.stepped === 0 && Math.abs(dx) > 30) this.go(this.active() - Math.sign(dx));
  }

  protected cancel(): void {
    this.startX = null;
    this.dragging.set(false);
  }

  /** Swallow the click that ends a drag so it does not also pick a cover. */
  protected guard(e: MouseEvent): void {
    if (this.dragged) {
      e.stopPropagation();
      this.dragged = false;
    }
  }
}
