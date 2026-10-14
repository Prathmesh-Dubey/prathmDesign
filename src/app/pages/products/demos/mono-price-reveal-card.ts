import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Item {
  id: string;
  no: string;
  name: string;
  material: string;
  price: string;
  img: string;
  alt: string;
  flip?: boolean;
}

@Component({
  selector: 'demo-mono-price-reveal-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bar">
      <span class="logo">MAISON ODE</span>
      <span class="sub">Objects, Autumn edit</span>
    </header>
    <div class="row">
      @for (it of items; track it.id) {
        <article class="card" tabindex="0" [attr.aria-label]="it.name + ', ' + it.price" [class.on]="active() === it.id"
          (click)="tap($event, it.id)" (keydown.enter)="tap($event, it.id)">
          <div class="media">
            <img [src]="it.img" [appImgFallback]="it.id" [alt]="it.alt" [class.flip]="it.flip" />
          </div>
          <div class="meta">
            <span class="no">{{ it.no }}</span>
            <div class="reveal">
              <div class="track">
                <h3>{{ it.name }}</h3>
                <p class="price">{{ it.price }}</p>
              </div>
            </div>
            <p class="mat">{{ it.material }}</p>
          </div>
          <button type="button" class="save" [class.on]="saved().includes(it.id)" (click)="toggle(it.id)"
            [attr.aria-label]="(saved().includes(it.id) ? 'Remove ' : 'Save ') + it.name"
            [attr.aria-pressed]="saved().includes(it.id)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>
          </button>
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 26px; min-height: 100%; padding: 30px clamp(16px, 4vw, 40px) 36px;
      background: #f2f2f2; color: #0b0b0b; font-family: 'Tenor Sans', 'Geist', sans-serif; container-type: inline-size;
    }
    .bar { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #0b0b0b; padding-bottom: 12px; }
    .logo { letter-spacing: .32em; font-size: 14px; }
    .sub { font-size: 13px; color: #6d6d6d; }
    .row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(14px, 2.4vw, 28px); }
    @container (max-width: 640px) { .row { grid-template-columns: repeat(2, minmax(0, 1fr)); } .card:nth-child(3) { display: none; } }
    @container (max-width: 380px) { .row { grid-template-columns: 1fr; } .card:nth-child(2) { display: none; } }
    .card { position: relative; outline: none; cursor: pointer; }
    .card:focus-visible .media { outline: 2px solid #0b0b0b; outline-offset: 4px; }
    .media { aspect-ratio: 3 / 4; overflow: hidden; background: #dcdcdc; }
    .media img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.08); transition: filter .7s ease, transform 1s cubic-bezier(.2,.7,.1,1); }
    .media img.flip { transform: scaleX(-1); }
    .card.on img, .card:focus-visible img { filter: grayscale(0) contrast(1); transform: scale(1.04); }
    .card.on img.flip, .card:focus-visible img.flip { transform: scaleX(-1) scale(1.04); }
    @media (hover: hover) {
      .card:hover img { filter: grayscale(0) contrast(1); transform: scale(1.04); }
      .card:hover img.flip { transform: scaleX(-1) scale(1.04); }
      .card:hover .track { transform: translateY(-24px); }
      .card:hover .save { opacity: 1; transform: none; }
    }
    .card { -webkit-tap-highlight-color: transparent; }
    .meta { display: grid; grid-template-columns: auto 1fr; column-gap: 12px; margin-top: 14px; }
    .no { font-family: 'Geist Mono', monospace; font-size: 12px; color: #6d6d6d; padding-top: 3px; }
    .reveal { height: 24px; overflow: hidden; }
    .track { transition: transform .5s cubic-bezier(.7,0,.2,1); }
    .card.on .track, .card:focus-visible .track { transform: translateY(-24px); }
    h3, .price { height: 24px; line-height: 24px; font-size: 17px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .price { font-family: 'Geist Mono', monospace; font-size: 15px; }
    .mat { grid-column: 2; font-size: 12.5px; color: #6d6d6d; margin-top: 2px; font-family: 'Geist', sans-serif; }
    .save {
      position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 50%; border: 0; cursor: pointer;
      background: #fff; display: grid; place-items: center; opacity: 0; transform: scale(.8); transition: .3s;
    }
    .card.on .save, .card:focus-within .save, .save.on { opacity: 1; transform: none; }
    .save { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .save:active { transform: scale(.9); }
    /* Touch: no hover to reveal, so name, price and save are always shown; a tap brings the colour back. */
    @media (hover: none) {
      .reveal { height: auto; }
      .card .track, .card.on .track { transform: none; display: flex; flex-direction: column; }
      .save { opacity: 1; transform: none; width: 40px; height: 40px; }
    }
    .save svg { width: 18px; fill: none; stroke: #0b0b0b; stroke-width: 1.5; transition: fill .2s; }
    .save.on svg { fill: #0b0b0b; }
  `,
})
export class MonoPriceRevealCard {
  protected readonly items: Item[] = [
    { id: 'cote-02', no: '01', name: 'Côte 02 Acetate', material: 'Hand-polished acetate, Zeiss lenses', price: '£285', img: unsplash(PRODUCT_PHOTOS.sunglasses, 600, 800), alt: 'Côte 02 sunglasses in tortoiseshell acetate' },
    { id: 'aster-38', no: '02', name: 'Aster 38 Automatic', material: 'Steel case, Barenia leather strap', price: '£1,640', img: unsplash(PRODUCT_PHOTOS.watchClassic, 600, 800), alt: 'Aster 38 automatic watch on a leather strap' },
    { id: 'cote-04', no: '03', name: 'Côte 04 Titanium', material: 'Beta titanium, mineral glass', price: '£340', img: unsplash(PRODUCT_PHOTOS.sunglasses, 600, 800), alt: 'Côte 04 titanium sunglasses', flip: true },
  ];
  protected readonly saved = signal<string[]>([]);

  constructor() {
    loadGoogleFonts('Tenor+Sans');
  }

  protected readonly active = signal<string | null>(null);

  tap(e: Event, id: string): void {
    if ((e.target as Element).closest('button')) return;
    this.active.update((cur) => (cur === id ? null : id));
  }

  toggle(id: string): void {
    this.saved.update((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
}
