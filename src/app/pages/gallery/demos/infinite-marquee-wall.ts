import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';

interface Tile {
  key: string;
  src: string;
  w: number;
  alt: string;
}

interface Row {
  id: number;
  speed: number;
  reverse: boolean;
  tiles: Tile[];
}

const ARTISTS = ['Noor Haddad', 'Felix Brandt', 'Akosua Mensah', 'Ilya Petrov', 'Marta Salas', 'Kenta Mori', 'Grace Liu', 'Oskar Lind', 'Bea Romero', 'Dario Conti', 'Hana Kim', 'Sipho Ndlovu'];

@Component({
  selector: 'demo-infinite-marquee-wall',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wall" [class.off]="!visible()" aria-hidden="true">
      @for (r of rows; track r.id) {
        <div class="row" [class.rev]="r.reverse" [class.held]="held() === r.id" [style.--dur.s]="r.speed"
          (pointerdown)="hold($event, r.id)" (pointerup)="held.set(null)" (pointercancel)="held.set(null)" (pointerleave)="held.set(null)">
          <div class="track">
            @for (t of r.tiles; track t.key) {
              <img [src]="t.src" alt="" [style.width.px]="t.w" draggable="false" />
            }
            @for (t of r.tiles; track t.key) {
              <img [src]="t.src" alt="" [style.width.px]="t.w" draggable="false" />
            }
          </div>
        </div>
      }
    </div>
    <div class="fade" aria-hidden="true"></div>
    <div class="center">
      <p class="date">14—16 November · Kalkbrenner, Berlin</p>
      <h3>Open Studio<br />Weekend</h3>
      <p class="sub">140 photographers. 3 floors. Every print for sale.</p>
      <a class="cta" href="#" (click)="$event.preventDefault()">Get a free pass</a>
    </div>
    <p class="sr">A moving wall of photographs by participating artists, including {{ artists }}.</p>
  `,
  styles: `
    :host { display: block; position: relative; height: 560px; overflow: hidden; background: #0a0a0a; color: #fff; container-type: inline-size; }
    .wall { position: absolute; inset: -12% -10%; display: grid; align-content: center; gap: 12px; transform: rotate(-7deg); }
    /* touch: press and hold a row to stop it (a vertical swipe cancels the hold and scrolls the page) */
    .row { overflow: hidden; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .track { display: flex; gap: 12px; width: max-content; animation: slide var(--dur) linear infinite; }
    .row.rev .track { animation-direction: reverse; }
    .row:hover .track, .row.held .track, .wall.off .track { animation-play-state: paused; }
    @media (hover: none) { .row:hover:not(.held) .track { animation-play-state: running; } .wall.off .track { animation-play-state: paused; } }
    @keyframes slide { to { transform: translateX(calc(-50% - 6px)); } }
    .track img { height: clamp(96px, 15cqw, 140px); object-fit: cover; border-radius: 8px; filter: grayscale(.4) brightness(.8); transition: filter .4s; flex: none; }
    @media (hover: hover) { .track img:hover { filter: none; } }
    .row.held img { filter: grayscale(0) brightness(.95); }
    .fade { position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(52% 46% at 50% 50%, rgba(10,10,10,.92), rgba(10,10,10,.55) 60%, transparent 100%),
        linear-gradient(90deg, #0a0a0a, transparent 12%, transparent 88%, #0a0a0a); }
    .center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; padding: 20px; pointer-events: none; }
    .date { font-family: var(--font-mono); font-size: 12px; color: #ff6fb5; }
    h3 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(48px, 10cqw, 112px); line-height: .9; text-transform: uppercase; letter-spacing: .005em; margin-top: 12px; }
    .sub { font-size: 14px; color: #c9c9c9; margin-top: 14px; }
    .cta { pointer-events: auto; margin-top: 20px; display: inline-flex; align-items: center; height: 46px; padding: 0 22px; border-radius: 99px; background: #ff6fb5; color: #0a0a0a;
      font-weight: 700; font-size: 14px; text-decoration: none; transition: transform .2s, background .2s; }
    .cta:hover { transform: scale(1.05); background: #fff; }
    .cta { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:active { transform: scale(.96); background: #fff; }
    @container (max-width: 420px) { .sub { font-size: 13px; max-width: 26ch; } .date { font-size: 11px; } }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  `,
})
export class InfiniteMarqueeWall {
  protected readonly visible = hostVisible();
  /** row paused by a press-and-hold on touch */
  protected readonly held = signal<number | null>(null);
  protected readonly artists = ARTISTS.join(', ');
  protected readonly rows: Row[] = [0, 1, 2, 3].map((r) => ({
    id: r,
    speed: [46, 60, 40, 54][r],
    reverse: r % 2 === 1,
    tiles: Array.from({ length: 9 }, (_, i) => {
      const ratio = [1.5, 0.8, 1.2, 1, 1.78, 0.75, 1.33, 2, 1.1][(i + r * 3) % 9];
      const h = 140;
      return { key: `${r}-${i}`, src: photo(`open-studio-${r}-${i}`, Math.round(h * ratio * 2), h * 2), w: Math.round(h * ratio), alt: ARTISTS[(i + r) % ARTISTS.length] };
    }),
  }));

  constructor() {
    loadGoogleFonts('Anton');
  }

  hold(e: PointerEvent, id: number): void {
    if (e.pointerType !== 'mouse') this.held.set(id);
  }
}
