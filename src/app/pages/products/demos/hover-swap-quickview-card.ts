import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Watch {
  id: string;
  name: string;
  line: string;
  price: string;
  front: string;
  alt: string;
  frontAlt: string;
  altAlt: string;
  specs: [string, string][];
  straps: string[];
}

@Component({
  selector: 'demo-hover-swap-quickview-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      @for (w of watches; track w.id) {
        <article class="card" [class.qv]="open() === w.id" [class.alt]="swapped() === w.id">
          <div class="media" (click)="tapMedia($event, w.id)">
            <img class="a" [src]="w.front" [appImgFallback]="w.id + '-a'" [alt]="w.frontAlt" />
            <img class="b" [src]="w.alt" [appImgFallback]="w.id + '-b'" [alt]="w.altAlt" />
            <span class="tag">{{ w.line }}</span>
            <button type="button" class="quick" (click)="open.set(w.id)" [attr.aria-expanded]="open() === w.id" [attr.aria-controls]="w.id + '-panel'">
              Quick view
            </button>

            <div class="panel" [id]="w.id + '-panel'" role="region" [attr.aria-label]="w.name + ' quick view'" [attr.inert]="open() === w.id ? null : ''">
              <div class="panel-head">
                <strong>At a glance</strong>
                <button type="button" class="close" (click)="open.set(null)" aria-label="Close quick view">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </div>
              <dl>
                @for (s of w.specs; track s[0]) {
                  <div><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
                }
              </dl>
              <p class="strap-l">Strap</p>
              <div class="straps">
                @for (s of w.straps; track s) {
                  <button type="button" [class.on]="strap()[w.id] === s" [attr.aria-pressed]="strap()[w.id] === s" (click)="setStrap(w.id, s)">{{ s }}</button>
                }
              </div>
            </div>
          </div>
          <div class="info">
            <h3>{{ w.name }}</h3>
            <p class="price">{{ w.price }}</p>
          </div>
          <p class="sub">{{ strap()[w.id] || w.straps[0] }} strap · Free engraving</p>
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 36px 18px;
      background: linear-gradient(180deg, #e3e8e4, #d3dbd5);
      font-family: 'Geist', sans-serif; color: #17251d;
      container-type: inline-size;
    }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 290px)); gap: 22px; width: 100%; justify-content: center; }
    @container (max-width: 560px) { .grid { grid-template-columns: minmax(0, 320px); } .card:nth-child(2) { display: none; } }
    .card { min-width: 0; }
    .media { position: relative; aspect-ratio: 4 / 5; border-radius: 4px; overflow: hidden; background: #c6cfc8; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity .6s ease, transform 1.2s cubic-bezier(.2,.7,.1,1); }
    .media .b { opacity: 0; transform: scale(1.08); }
    .card.alt .b, .card:focus-within .b { opacity: 1; transform: scale(1); }
    .card.alt .a, .card:focus-within .a { transform: scale(1.06); }
    @media (hover: hover) {
      .card:hover .b { opacity: 1; transform: scale(1); }
      .card:hover .a { transform: scale(1.06); }
      .card:hover .quick { transform: none; }
    }
    .media { cursor: pointer; -webkit-tap-highlight-color: transparent; }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tag {
      position: absolute; top: 14px; left: 14px; font-size: 12px; padding: 4px 10px; border-radius: 999px;
      background: rgba(255,255,255,.82); backdrop-filter: blur(6px); color: #17251d;
    }
    .quick {
      position: absolute; left: 14px; right: 14px; bottom: 14px; height: 44px; border-radius: 2px; border: 0; cursor: pointer;
      background: #17251d; color: #f2f5f2; font-size: 14px; letter-spacing: .02em;
      transform: translateY(calc(100% + 16px)); transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .quick:focus-visible, .card.alt .quick { transform: none; }
    .quick:active { background: #2c3d32; }
    @media (hover: none) { .quick { transform: none; } }
    .panel {
      position: absolute; inset: auto 0 0 0; padding: 18px 18px 20px; background: #f6f8f6; color: #17251d;
      transform: translateY(101%); transition: transform .5s cubic-bezier(.2,.8,.2,1); border-top: 1px solid #c6cfc8;
    }
    .qv .panel { transform: none; }
    .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .panel-head strong { font-family: 'Fraunces', serif; font-weight: 500; font-size: 17px; }
    .close { width: 40px; height: 40px; margin: -4px -6px -4px 0; border-radius: 50%; border: 1px solid #c6cfc8; background: transparent; cursor: pointer; display: grid; place-items: center; }
    .close svg { width: 14px; stroke: currentColor; stroke-width: 1.8; fill: none; stroke-linecap: round; }
    dl { margin: 0; display: grid; gap: 6px; }
    dl div { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; border-bottom: 1px dashed #cdd6cf; padding-bottom: 6px; }
    dt { color: #5c6b61; } dd { margin: 0; font-weight: 500; text-align: right; }
    .strap-l { font-size: 12px; color: #5c6b61; margin: 12px 0 6px; }
    .straps { display: flex; gap: 6px; flex-wrap: wrap; }
    .straps button { font-size: 12.5px; padding: 6px 11px; min-height: 36px; border-radius: 999px; border: 1px solid #b7c3ba; background: transparent; cursor: pointer; transition: .2s; }
    @media (pointer: coarse) { .straps button { min-height: 40px; padding: 8px 13px; } }
    .straps button:active { transform: scale(.96); }
    .straps button.on { background: #17251d; color: #fff; border-color: #17251d; }
    .info { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-top: 14px; }
    h3 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 20px; letter-spacing: -.01em; }
    .price { font-family: 'Geist Mono', monospace; font-size: 14px; white-space: nowrap; }
    .sub { color: #5c6b61; font-size: 13px; margin-top: 3px; }
  `,
})
export class HoverSwapQuickviewCard {
  protected readonly watches: Watch[] = [
    {
      id: 'halden',
      name: 'Halden Chronograph 41mm',
      line: 'Field collection',
      price: 'CHF 1,890',
      front: unsplash(PRODUCT_PHOTOS.watchWhite, 640, 800),
      alt: unsplash(PRODUCT_PHOTOS.watchClassic, 640, 800),
      frontAlt: 'Halden Chronograph with a white dial',
      altAlt: 'Halden Chronograph worn on the wrist',
      specs: [['Movement', 'Sellita SW510 auto'], ['Case', '41mm brushed steel'], ['Water resistance', '100m'], ['Crystal', 'Domed sapphire']],
      straps: ['Sand suede', 'Oyster steel', 'Black calf'],
    },
    {
      id: 'marlow',
      name: 'Marlow Diver 39mm',
      line: 'Coastline',
      price: 'CHF 2,240',
      front: unsplash(PRODUCT_PHOTOS.watchDark, 640, 800),
      alt: unsplash(PRODUCT_PHOTOS.watchWhite, 640, 800),
      frontAlt: 'Marlow Diver with a black case',
      altAlt: 'Marlow Diver side profile',
      specs: [['Movement', 'ETA 2824-2 auto'], ['Case', '39mm titanium'], ['Water resistance', '300m'], ['Bezel', 'Ceramic, 120 clicks']],
      straps: ['Rubber', 'Mesh', 'NATO olive'],
    },
  ];
  protected readonly open = signal<string | null>(null);
  protected readonly strap = signal<Record<string, string>>({});

  constructor() {
    loadGoogleFonts('Fraunces:opsz,wght@9..144,400;9..144,500');
  }

  protected readonly swapped = signal<string | null>(null);

  /** Tap on the photo flips to the alternate shot (the touch equivalent of hover). */
  tapMedia(e: Event, id: string): void {
    if ((e.target as Element).closest('button, .panel')) return;
    this.swapped.update((cur) => (cur === id ? null : id));
  }

  setStrap(id: string, s: string): void {
    this.strap.update((m) => ({ ...m, [id]: s }));
  }
}
