import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Size {
  uk: number;
  stock: number;
}

@Component({
  selector: 'demo-size-rating-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <div class="media">
        <img [src]="img" appImgFallback="kite-trainer" alt="Kite Trainer Low sneaker in chalk white" />
        <span class="num" aria-hidden="true">07</span>
      </div>
      <div class="body">
        <div class="head">
          <div>
            <p class="brand">Kerb Athletics</p>
            <h3>Kite Trainer Low</h3>
            <p class="cw">Chalk / Signal Red</p>
          </div>
          <p class="price">€165</p>
        </div>

        <button type="button" class="rating" (click)="showReviews.set(!showReviews())" [attr.aria-expanded]="showReviews()">
          <span class="stars" [style.--pct.%]="(rating / 5) * 100" aria-hidden="true">★★★★★</span>
          <span><strong>{{ rating }}</strong> · 1,284 reviews</span>
        </button>
        @if (showReviews()) {
          <ul class="bars" aria-label="Rating breakdown">
            @for (b of breakdown; track b.stars) {
              <li><span>{{ b.stars }}★</span><i><b [style.width.%]="b.pct"></b></i><span>{{ b.pct }}%</span></li>
            }
          </ul>
        }

        <div class="size-head">
          <span id="size-label">Size (UK)</span>
          <span class="fit">Runs half a size small</span>
        </div>
        <div class="sizes" role="radiogroup" aria-labelledby="size-label">
          @for (s of sizes; track s.uk) {
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="size() === s.uk"
              [class.on]="size() === s.uk"
              [class.out]="s.stock === 0"
              [disabled]="s.stock === 0"
              [attr.aria-label]="'UK ' + s.uk + (s.stock === 0 ? ', sold out' : s.stock < 3 ? ', only ' + s.stock + ' left' : '')"
              (click)="size.set(s.uk); added.set(false)"
            >
              {{ s.uk }}
              @if (s.stock > 0 && s.stock < 3) { <i class="low" aria-hidden="true"></i> }
            </button>
          }
        </div>
        <p class="hint" aria-live="polite">{{ hint() }}</p>

        <button type="button" class="add" [disabled]="!size()" (click)="added.set(true)" [class.done]="added()">
          {{ added() ? 'Added · UK ' + size() : size() ? 'Add to bag' : 'Select a size' }}
        </button>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 32px 16px;
      background: #dfe3ea; font-family: 'Archivo', sans-serif; color: #101114; container-type: inline-size;
    }
    .card { width: min(680px, 100%); display: grid; grid-template-columns: 1fr 1fr; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 24px 50px -30px rgba(16,17,20,.45); }
    @container (max-width: 600px) { .card { grid-template-columns: 1fr; max-width: 360px; } .media { aspect-ratio: 4 / 3; } }
    .media { position: relative; background: #f1f2f4; overflow: hidden; min-height: 260px; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.05) rotate(-2deg); } }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .num { position: absolute; left: 14px; bottom: 6px; font-size: 88px; font-weight: 900; font-stretch: 75%; font-style: italic; color: #fff; line-height: 1; mix-blend-mode: difference; opacity: .9; }
    .body { padding: 22px 22px 22px; display: flex; flex-direction: column; }
    .head { display: flex; justify-content: space-between; gap: 12px; }
    .brand { font-size: 12px; color: #d63a2f; font-weight: 700; }
    h3 { font-size: 26px; font-weight: 800; font-stretch: 80%; letter-spacing: -.01em; margin-top: 2px; text-transform: uppercase; font-style: italic; }
    .cw { color: #6b7080; font-size: 13.5px; margin-top: 2px; }
    .price { font-size: 20px; font-weight: 700; }
    .rating { display: inline-flex; align-items: center; gap: 8px; margin-top: 4px; padding: 0; border: 0; background: none; cursor: pointer; font-size: 13.5px; color: #3b3f4a; align-self: flex-start; min-height: 40px; }
    .stars { position: relative; color: #d8dbe2; letter-spacing: 2px; font-size: 15px; }
    .stars::before { content: '★★★★★'; position: absolute; inset: 0; width: var(--pct); overflow: hidden; color: #101114; white-space: nowrap; }
    .bars { list-style: none; margin: 10px 0 0; padding: 0; display: grid; gap: 4px; font-size: 12px; color: #6b7080; animation: drop .3s ease-out; }
    @keyframes drop { from { opacity: 0; transform: translateY(-4px); } }
    .bars li { display: grid; grid-template-columns: 26px 1fr 34px; gap: 8px; align-items: center; }
    .bars i { height: 5px; background: #eceef2; border-radius: 3px; overflow: hidden; }
    .bars b { display: block; height: 100%; background: #101114; }
    .size-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin: 18px 0 8px; }
    .fit { color: #6b7080; font-weight: 400; }
    .sizes { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
    .sizes button {
      position: relative; height: 42px; border-radius: 4px; border: 1px solid #d6d9e0; background: #fff; cursor: pointer;
      font-weight: 600; font-size: 14px; transition: border-color .15s, background .15s, color .15s;
    }
    @media (hover: hover) { .sizes button:hover:not(:disabled) { border-color: #101114; } }
    .sizes button:active:not(:disabled) { transform: scale(.95); }
    .add:active:not(:disabled) { transform: scale(.98); }
    .sizes button.on { background: #101114; color: #fff; border-color: #101114; }
    .sizes button.out { color: #b4b8c2; cursor: not-allowed; background: linear-gradient(to top right, transparent calc(50% - .5px), #d6d9e0 50%, transparent calc(50% + .5px)); }
    .low { position: absolute; top: 5px; right: 5px; width: 6px; height: 6px; border-radius: 50%; background: #d63a2f; }
    .hint { font-size: 12.5px; color: #6b7080; min-height: 18px; margin-top: 8px; }
    .add { margin-top: auto; height: 50px; border: 0; border-radius: 4px; cursor: pointer; background: #d63a2f; color: #fff; font-weight: 800; font-size: 15px; text-transform: uppercase; font-stretch: 85%; letter-spacing: .03em; transition: background .2s, opacity .2s; }
    .add:disabled { background: #eceef2; color: #8a8f9b; cursor: not-allowed; }
    .add.done { background: #101114; }
    @container (max-width: 600px) { .add { margin-top: 14px; } }
    @container (max-width: 360px) { .body { padding: 18px 16px; } h3 { font-size: 23px; } .num { font-size: 68px; } .sizes { gap: 5px; } }
  `,
})
export class SizeRatingCard {
  protected readonly img = unsplash(PRODUCT_PHOTOS.sneakerWhite, 700, 820);
  protected readonly rating = 4.6;
  protected readonly breakdown = [
    { stars: 5, pct: 74 },
    { stars: 4, pct: 17 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];
  protected readonly sizes: Size[] = [
    { uk: 6, stock: 4 }, { uk: 6.5, stock: 0 }, { uk: 7, stock: 8 }, { uk: 7.5, stock: 2 }, { uk: 8, stock: 11 },
    { uk: 8.5, stock: 6 }, { uk: 9, stock: 1 }, { uk: 9.5, stock: 0 }, { uk: 10, stock: 5 }, { uk: 11, stock: 3 },
  ];
  protected readonly size = signal<number | null>(null);
  protected readonly added = signal(false);
  protected readonly showReviews = signal(false);
  protected readonly hint = computed(() => {
    const s = this.sizes.find((x) => x.uk === this.size());
    if (!s) return 'Two sizes sold out — join the restock list.';
    return s.stock < 3 ? `Only ${s.stock} left in UK ${s.uk}. Order soon.` : `UK ${s.uk} in stock · free returns for 30 days.`;
  });

  constructor() {
    loadGoogleFonts('Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..900');
  }
}
