import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';

interface Seller {
  id: string;
  rank: number;
  name: string;
  price: string;
  img: string;
  sold: string;
}

@Component({
  selector: 'demo-bestseller-marquee',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <p class="live"><i aria-hidden="true"></i> Updated hourly</p>
        <h3>This week’s best-sellers</h3>
      </div>
      @if (!reduced) {
        <button type="button" class="pause" (click)="userPaused.set(!userPaused())" [attr.aria-pressed]="userPaused()">
          {{ userPaused() ? 'Play' : 'Pause' }} motion
        </button>
      }
    </header>

    @for (row of rows; track $index; let r = $index) {
      <div class="lane" [class.rev]="r === 1" [class.static]="reduced" [class.stopped]="stopped() || held() === r"
        (pointerdown)="hold($event, r)" (pointerup)="letGo($event)" (pointercancel)="letGo($event)" (pointerleave)="letGo($event)">
        <ul class="belt" [style.--dur]="row.length * 10 + 's'">
          @for (copy of copies; track copy) {
            @for (s of row; track s.id) {
              <li class="item" [attr.aria-hidden]="copy > 0 ? 'true' : null">
                <a href="#" (click)="$event.preventDefault()" [attr.tabindex]="copy > 0 ? -1 : 0" [attr.aria-label]="'Number ' + s.rank + ', ' + s.name + ', ' + s.price">
                  <span class="rank">{{ s.rank < 10 ? '0' + s.rank : s.rank }}</span>
                  <img [src]="s.img" [appImgFallback]="s.id" alt="" loading="lazy" />
                  <span class="txt">
                    <span class="name">{{ s.name }}</span>
                    <span class="meta"><b>{{ s.price }}</b> · {{ s.sold }} sold</span>
                  </span>
                </a>
              </li>
            }
          }
        </ul>
      </div>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; justify-content: center; gap: 16px; min-height: 100%; padding: 30px 0; background: #0b0f1a; color: #eef1f8; font-family: 'Space Grotesk', sans-serif; overflow: hidden; container-type: inline-size; }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; padding: 0 clamp(16px, 4vw, 40px) 8px; flex-wrap: wrap; }
    .live { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #9aa3b8; }
    .live i { width: 8px; height: 8px; border-radius: 50%; background: #ff7a59; box-shadow: 0 0 0 0 rgba(255,122,89,.6); animation: live 1.8s infinite; }
    @keyframes live { 70% { box-shadow: 0 0 0 8px rgba(255,122,89,0); } }
    h3 { font-size: clamp(28px, 4.6vw, 48px); font-weight: 600; letter-spacing: -.035em; line-height: 1; margin-top: 6px; }
    .pause { height: 38px; padding: 0 16px; border-radius: 999px; border: 1px solid #2a3248; background: #131a2b; color: #eef1f8; cursor: pointer; font: inherit; font-size: 13.5px; }
    @media (hover: hover) { .pause:hover { border-color: #ff7a59; } }
    .pause { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pause:active { border-color: #ff7a59; transform: scale(.97); }
    @media (pointer: coarse) { .pause { height: 42px; } }
    .lane {
      overflow: hidden;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    }
    .belt { list-style: none; margin: 0; padding: 4px 0; display: flex; gap: 12px; width: max-content; animation: run var(--dur) linear infinite; }
    .lane.rev .belt { animation-direction: reverse; }
    .lane:has(a:focus-visible) .belt, .lane.stopped .belt { animation-play-state: paused; }
    @media (hover: hover) { .lane:hover .belt { animation-play-state: paused; } }
    .lane { -webkit-tap-highlight-color: transparent; }
    @keyframes run { to { transform: translateX(calc(-50% - 6px)); } }
    .lane.static { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
    .lane.static .belt { animation: none; padding: 4px clamp(16px, 4vw, 40px); }
    .lane.static .item[aria-hidden='true'] { display: none; }
    .item a { display: flex; align-items: center; gap: 12px; padding: 10px 18px 10px 10px; border-radius: 18px; background: #131a2b; border: 1px solid #1f2740; text-decoration: none; color: inherit; transition: background .25s, border-color .25s, transform .25s; }
    .item a:focus-visible, .item a:active { background: #1a2238; border-color: #ff7a59; transform: translateY(-2px); }
    @media (hover: hover) { .item a:hover { background: #1a2238; border-color: #ff7a59; transform: translateY(-2px); } }
    @container (max-width: 420px) { .item img { width: 52px; height: 52px; } .rank { font-size: 24px; width: 32px; } .item a { gap: 10px; padding: 8px 14px 8px 8px; } }
    .item a:focus-visible { outline: 2px solid #ff7a59; outline-offset: 2px; }
    .rank { font-size: 28px; font-weight: 700; color: #ff7a59; letter-spacing: -.04em; width: 38px; text-align: center; font-variant-numeric: tabular-nums; }
    .item img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
    .txt { display: grid; gap: 2px; }
    .name { font-size: 15px; font-weight: 500; white-space: nowrap; }
    .meta { font-size: 12.5px; color: #9aa3b8; white-space: nowrap; }
    .meta b { color: #eef1f8; font-weight: 600; }
  `,
})
export class BestsellerMarquee {
  protected readonly reduced = prefersReducedMotion();
  protected readonly copies = [0, 1, 2, 3];
  protected readonly userPaused = signal(false);
  private readonly visible = hostVisible();
  protected readonly stopped = computed(() => this.userPaused() || !this.visible());
  protected readonly rows: Seller[][] = [
    [
      { id: 'b1', rank: 1, name: 'Aster ANC Over-Ear', price: '$349', img: unsplash(PRODUCT_PHOTOS.headphones, 160, 160), sold: '2.4k' },
      { id: 'b2', rank: 2, name: 'Kite Runner 2', price: '$160', img: unsplash(PRODUCT_PHOTOS.sneakerRed, 160, 160), sold: '1.9k' },
      { id: 'b3', rank: 3, name: 'Halden Field 38mm', price: '$1,190', img: unsplash(PRODUCT_PHOTOS.watchWhite, 160, 160), sold: '860' },
      { id: 'b4', rank: 4, name: 'Oro Mini Speaker', price: '$149', img: unsplash(PRODUCT_PHOTOS.speaker, 160, 160), sold: '1.2k' },
      { id: 'b5', rank: 5, name: 'Côte 02 Sunglasses', price: '$310', img: unsplash(PRODUCT_PHOTOS.sunglasses, 160, 160), sold: '740' },
    ],
    [
      { id: 'b6', rank: 6, name: 'Lumen Vitamin C Serum', price: '$52', img: unsplash(PRODUCT_PHOTOS.serum, 160, 160), sold: '3.1k' },
      { id: 'b7', rank: 7, name: 'Noir Vetiver EDP 50ml', price: '$165', img: unsplash(PRODUCT_PHOTOS.perfume, 160, 160), sold: '690' },
      { id: 'b8', rank: 8, name: 'Kessler K2 Rangefinder', price: '$2,690', img: unsplash(PRODUCT_PHOTOS.camera, 160, 160), sold: '120' },
      { id: 'b9', rank: 9, name: 'Arden Book 14', price: '$1,449', img: unsplash(PRODUCT_PHOTOS.laptop, 160, 160), sold: '410' },
      { id: 'b10', rank: 10, name: 'Pixelform 9 Pro', price: '$999', img: unsplash(PRODUCT_PHOTOS.phone, 160, 160), sold: '980' },
    ],
  ];

  /** Lane a finger is resting on: touch has no hover, so press-and-hold pauses the belt. */
  protected readonly held = signal<number | null>(null);
  private releaseTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    loadGoogleFonts('Space+Grotesk:wght@400;500;600;700');
    inject(DestroyRef).onDestroy(() => clearTimeout(this.releaseTimer));
  }

  hold(e: PointerEvent, lane: number): void {
    if (e.pointerType === 'mouse') return;
    clearTimeout(this.releaseTimer);
    this.held.set(lane);
  }

  letGo(e: PointerEvent): void {
    if (e.pointerType === 'mouse' || this.held() === null) return;
    clearTimeout(this.releaseTimer);
    // Linger a moment so a tapped item can be read before the belt moves on.
    this.releaseTimer = setTimeout(() => this.held.set(null), 1400);
  }
}
