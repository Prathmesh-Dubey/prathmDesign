import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Viewed {
  id: string;
  name: string;
  price: string;
  img: string;
  ago: string;
  drop?: string;
}

@Component({
  selector: 'demo-recently-viewed-strip',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="intro">
      <p class="store">Fieldnote Electronics</p>
      <h2>Still thinking it over?</h2>
      <p class="lede">Everything you looked at this week, with price drops flagged. Tap one to jump back in.</p>
    </div>

    <section class="strip" aria-labelledby="rv-title">
      <div class="head">
        <h3 id="rv-title">Recently viewed</h3>
        <span class="count">{{ items().length }}</span>
        @if (items().length) {
          <button type="button" class="clear" (click)="clear()">Clear history</button>
        }
      </div>

      @if (items().length) {
        <ul class="row">
          @for (it of items(); track it.id) {
            <li class="chip" [class.fresh]="fresh() === it.id">
              <button type="button" class="open" (click)="reopen(it.id)" [attr.aria-label]="'Open ' + it.name + ', ' + it.price">
                <img [src]="it.img" [appImgFallback]="it.id" alt="" />
                <span class="txt">
                  <span class="name">{{ it.name }}</span>
                  <span class="line">
                    <span class="price">{{ it.price }}</span>
                    @if (it.drop) { <span class="drop">{{ it.drop }}</span> }
                  </span>
                  <span class="ago">{{ it.ago }}</span>
                </span>
              </button>
              <button type="button" class="x" (click)="remove(it.id)" [attr.aria-label]="'Remove ' + it.name + ' from history'">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </li>
          }
        </ul>
      } @else {
        <div class="empty">
          <p>History cleared. Items you view will show up here.</p>
          <button type="button" (click)="restore()">Restore</button>
        </div>
      }
    </section>
  `,
  styles: `
    :host { display: flex; flex-direction: column; justify-content: flex-end; gap: 20px; min-height: 100%; padding: 24px clamp(14px, 4vw, 32px) 26px; background: #eef3f2; font-family: 'Outfit', sans-serif; color: #0e2a2a; }
    .intro { max-width: 520px; }
    .store { font-size: 13px; color: #0f766e; font-weight: 500; }
    h2 { font-size: clamp(30px, 5vw, 46px); font-weight: 500; letter-spacing: -.035em; line-height: 1; margin-top: 6px; }
    .lede { font-size: 15px; color: #4f6967; margin-top: 10px; }
    .strip { background: #fff; border-radius: 18px; padding: 16px 0 14px; box-shadow: 0 18px 40px -30px rgba(14,42,42,.5); min-width: 0; }
    .head { display: flex; align-items: center; gap: 8px; padding: 0 18px 12px; }
    h3 { font-size: 16px; font-weight: 600; }
    .count { font-size: 12px; background: #e1efed; color: #0f766e; font-weight: 600; padding: 1px 8px; border-radius: 999px; }
    .clear { margin-left: auto; border: 0; background: none; color: #0f766e; font: inherit; font-size: 13.5px; cursor: pointer; padding: 4px 6px; border-radius: 6px; }
    @media (hover: hover) { .clear:hover { background: #e9f4f2; } }
    .clear:active { background: #e9f4f2; }
    .clear { min-height: 40px; padding: 4px 10px; margin-right: -6px; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .row {
      list-style: none; margin: 0; padding: 2px 18px 6px; display: flex; gap: 10px; overflow-x: auto; scrollbar-width: thin; scroll-snap-type: x proximity; overscroll-behavior-x: contain;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 18px, #000 calc(100% - 28px), transparent);
      mask-image: linear-gradient(90deg, transparent, #000 18px, #000 calc(100% - 28px), transparent);
    }
    .chip { position: relative; flex: 0 0 auto; scroll-snap-align: start; animation: in .35s cubic-bezier(.2,.8,.2,1) both; }
    .chip.fresh { animation: bounce .5s cubic-bezier(.3,1.5,.5,1); }
    @keyframes in { from { opacity: 0; transform: scale(.94); } }
    @keyframes bounce { from { transform: translateX(-24px); opacity: .2; } }
    .open { display: flex; align-items: center; gap: 10px; padding: 8px 30px 8px 8px; border-radius: 14px; border: 1px solid #e2ebea; background: #fff; cursor: pointer; text-align: left; transition: border-color .2s, transform .2s; }
    @media (hover: hover) { .open:hover { border-color: #0f766e; transform: translateY(-1px); } }
    .open:active { border-color: #0f766e; transform: scale(.98); }
    .open img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; flex: none; }
    .txt { display: grid; gap: 1px; }
    .name { font-size: 14px; font-weight: 500; white-space: nowrap; max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
    .line { display: flex; gap: 6px; align-items: baseline; }
    .price { font-size: 13px; font-weight: 600; }
    .drop { font-size: 11px; color: #b4441c; font-weight: 600; }
    .ago { font-size: 11.5px; color: #6b8482; }
    .x { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; border: 0; background: #f0f5f4; cursor: pointer; display: grid; place-items: center; color: #4f6967; opacity: 0; transition: opacity .2s; }
    .chip:hover .x, .chip:focus-within .x, .x:focus-visible { opacity: 1; }
    @media (hover: none) { .x { opacity: 1; } }
    .x::after { content: ''; position: absolute; inset: -9px; border-radius: 50%; }
    .x:active { background: #dbe7e5; }
    .x svg { width: 10px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
    .empty { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; color: #4f6967; font-size: 14px; flex-wrap: wrap; }
    .empty button { min-height: 40px; border: 1px solid #0f766e; color: #0f766e; background: transparent; border-radius: 999px; padding: 6px 14px; cursor: pointer; font: inherit; font-size: 13px; }
  `,
})
export class RecentlyViewedStrip {
  private readonly seed: Viewed[] = [
    { id: 'rv-phone', name: 'Pixelform 9 Pro 256GB', price: '$999', img: unsplash(PRODUCT_PHOTOS.phone, 160, 160), ago: '4 min ago' },
    { id: 'rv-laptop', name: 'Arden Book 14 M-series', price: '$1,449', img: unsplash(PRODUCT_PHOTOS.laptop, 160, 160), ago: '12 min ago', drop: '−$150' },
    { id: 'rv-speaker', name: 'Oro Mini Speaker', price: '$149', img: unsplash(PRODUCT_PHOTOS.speaker, 160, 160), ago: '1 h ago' },
    { id: 'rv-cam', name: 'Kessler K2 Rangefinder', price: '$2,690', img: unsplash(PRODUCT_PHOTOS.camera, 160, 160), ago: 'Yesterday' },
    { id: 'rv-head', name: 'Solace One Headphones', price: '$449', img: unsplash(PRODUCT_PHOTOS.headphonesAlt, 160, 160), ago: 'Yesterday', drop: '−$50' },
    { id: 'rv-watch', name: 'Halden Field 38mm', price: '$1,190', img: unsplash(PRODUCT_PHOTOS.watchWhite, 160, 160), ago: '3 days ago' },
  ];
  protected readonly items = signal<Viewed[]>(this.seed);
  protected readonly fresh = signal<string | null>(null);

  constructor() {
    loadGoogleFonts('Outfit:wght@400;500;600');
  }

  reopen(id: string): void {
    const it = this.items().find((x) => x.id === id);
    if (!it) return;
    this.items.update((ls) => [{ ...it, ago: 'Just now' }, ...ls.filter((x) => x.id !== id)]);
    this.fresh.set(id);
  }

  remove(id: string): void {
    this.items.update((ls) => ls.filter((x) => x.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }

  restore(): void {
    this.items.set(this.seed);
  }
}
