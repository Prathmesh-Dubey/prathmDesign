import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Still {
  id: number;
  sitter: string;
  role: string;
  src: string;
}

const STILLS: [string, string][] = [
  ['Odile Marchand', 'Night nurse, Hôpital Lariboisière'],
  ['Samir Haddad', 'Baker, Rue Myrha'],
  ['Jeanne Toussaint', 'Metro driver, Ligne 2'],
  ['Kofi Mensah', 'Security, Gare du Nord'],
  ['Hélène Brun', 'Taxi driver, 18e'],
  ['Thiago Alves', 'Sous-chef, Pigalle'],
  ['Marguerite Lo', 'Florist, Rungis market'],
  ['Bastien Roy', 'Street sweeper, Barbès'],
  ['Amina Diallo', 'Radio host, 3am slot'],
];

@Component({
  selector: 'demo-carousel-filmstrip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.arrowleft)': 'go(index() - 1)', '(keydown.arrowright)': 'go(index() + 1)' },
  template: `
    <section role="region" aria-roledescription="carousel" aria-label="Night Shift portraits" tabindex="0" class="wrap">
      <header>
        <div class="title">
          <h3>Night Shift</h3>
          <p>Portraits by Inès Moreau · Paris, 2024</p>
        </div>
        <div class="big" aria-hidden="true">{{ frameNo() }}</div>
      </header>

      <div class="strip" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="cancel()">
        <ul class="track" [class.dragging]="dragging()" [style.--i]="index()" [style.--dx.px]="dx()">
          @for (s of stills; track s.id; let i = $index) {
            <li>
              <button type="button" class="frame" [class.active]="i === index()" (click)="tap(i)"
                [attr.aria-label]="'Frame ' + (i + 1) + ': ' + s.sitter" [attr.aria-current]="i === index()">
                <img [src]="s.src" [alt]="'Portrait of ' + s.sitter + ', Night Shift series'" draggable="false" />
                <span class="fn">{{ i + 1 }}A</span>
              </button>
            </li>
          }
        </ul>
      </div>

      <footer>
        <button type="button" class="nav" (click)="go(index() - 1)" [disabled]="index() === 0" aria-label="Previous frame">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6l-6 6 6 6" /></svg>
        </button>
        <p class="cap" aria-live="polite">
          @let s = current();
          <strong>{{ s.sitter }}</strong><span>{{ s.role }}</span>
        </p>
        <button type="button" class="nav" (click)="go(index() + 1)" [disabled]="index() === stills.length - 1" aria-label="Next frame">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6l6 6-6 6" /></svg>
        </button>
      </footer>
    </section>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: radial-gradient(90% 70% at 50% 40%, #3a0f0c, #120605 70%);
      color: #ffd9d2; --fw: clamp(150px, 24cqw, 210px); --gap: 10px; }
    .wrap { padding: 24px 0; outline: none; display: grid; gap: 18px; }
    .wrap:focus-visible .strip { box-shadow: 0 0 0 2px #ff3b2f; }
    header { display: flex; justify-content: space-between; align-items: end; padding: 0 clamp(16px, 4cqw, 40px); }
    h3 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(34px, 6cqw, 64px); line-height: .9; letter-spacing: .01em; color: #ff3b2f; text-transform: uppercase; }
    .title p { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #c48c82; margin-top: 8px; }
    .big { font-family: 'Anton', sans-serif; font-size: clamp(44px, 9cqw, 96px); line-height: .8; color: transparent; -webkit-text-stroke: 1px #ff6b5e; }
    .strip { position: relative; background: #0a0a0a; padding: 26px 0; overflow: hidden; touch-action: pan-y; -webkit-user-select: none; user-select: none; }
    .strip::before, .strip::after { content: ''; position: absolute; left: 0; right: 0; height: 12px;
      background: repeating-linear-gradient(90deg, transparent 0 9px, #e9d7c2 9px 19px, transparent 19px 28px);
      -webkit-mask: linear-gradient(#000, #000); opacity: .85; border-radius: 2px; }
    .strip::before { top: 7px; } .strip::after { bottom: 7px; }
    .track { list-style: none; margin: 0; padding: 0; display: flex; gap: var(--gap);
      transform: translateX(calc(50cqw - var(--fw) / 2 - var(--i) * (var(--fw) + var(--gap)) + var(--dx, 0px)));
      transition: transform .7s cubic-bezier(.65,0,.25,1); }
    .track.dragging { transition: none; }
    .frame { position: relative; display: block; width: var(--fw); aspect-ratio: 4 / 5; padding: 0; border: 0; background: #1a1a1a; cursor: pointer; overflow: hidden; touch-action: pan-y; -webkit-tap-highlight-color: transparent; }
    .frame img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(.5) contrast(1.1); transform: scale(1.06);
      transition: filter .6s, transform .8s cubic-bezier(.2,.7,.2,1); }
    .frame:hover img { filter: grayscale(.6) brightness(.75); }
    .frame.active img { filter: none; transform: none; }
    .frame:focus-visible { outline: 2px solid #ff3b2f; outline-offset: 2px; }
    .fn { position: absolute; bottom: 4px; right: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #ff9a3c; }
    footer { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; padding: 0 clamp(16px, 4cqw, 40px); }
    .cap { text-align: center; display: grid; gap: 2px; }
    .cap strong { font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 15px; color: #fff; }
    .cap span { font-size: 13px; color: #c48c82; }
    .nav { touch-action: manipulation; -webkit-tap-highlight-color: transparent; width: 44px; height: 44px; border-radius: 50%; border: 1px solid #5a2520; background: transparent; color: #ffb3a8; display: grid; place-items: center; cursor: pointer; transition: background .2s, border-color .2s; }
    .nav:hover:not(:disabled) { background: #ff3b2f; border-color: #ff3b2f; color: #120605; }
    .nav:active:not(:disabled) { transform: scale(.92); }
    .nav:disabled { opacity: .3; cursor: default; }
    @container (max-width: 420px) {
      :host { --fw: 46cqw; }
      footer { gap: 10px; }
      .cap strong { font-size: 14px; } .cap span { font-size: 12px; }
    }
    .nav svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  `,
})
export class CarouselFilmstrip {
  protected readonly stills: Still[] = STILLS.map(([sitter, role], id) => ({ id, sitter, role, src: photo('nightshift-' + id, 420, 525) }));
  protected readonly index = signal(3);
  protected readonly current = computed(() => this.stills[this.index()]);
  protected readonly frameNo = computed(() => (this.index() + 1).toString().padStart(2, '0'));

  constructor() {
    loadGoogleFonts('Anton', 'IBM+Plex+Mono:wght@400;500');
  }

  protected readonly dx = signal(0);
  protected readonly dragging = signal(false);
  private start: { id: number; x: number } | null = null;
  private moved = false;

  go(i: number): void {
    this.index.set(Math.max(0, Math.min(this.stills.length - 1, i)));
  }

  /** frame click — ignored when it ends a swipe */
  tap(i: number): void {
    if (this.moved) { this.moved = false; return; }
    this.go(i);
  }

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.start = { id: e.pointerId, x: e.clientX };
    this.moved = false;
  }

  move(e: PointerEvent): void {
    const s = this.start;
    if (!s || s.id !== e.pointerId) return;
    let d = e.clientX - s.x;
    if (!this.dragging()) {
      if (Math.abs(d) < 8) return;
      this.dragging.set(true);
      this.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const i = this.index();
    if ((d > 0 && i === 0) || (d < 0 && i === this.stills.length - 1)) d *= 0.3;
    this.dx.set(d);
  }

  up(e: PointerEvent): void {
    if (!this.start || this.start.id !== e.pointerId) return;
    const d = this.dx();
    this.start = null;
    if (!this.dragging()) return;
    this.dragging.set(false);
    this.dx.set(0);
    if (Math.abs(d) > 40) this.go(this.index() + (d < 0 ? 1 : -1) * Math.max(1, Math.round(Math.abs(d) / 180)));
  }

  cancel(): void {
    this.start = null;
    this.dragging.set(false);
    this.dx.set(0);
  }
}
