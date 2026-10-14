import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Hotel {
  id: string;
  name: string;
  place: string;
  price: number;
  rating: number;
  rooms: number;
  perks: string[];
  img: string;
}

@Component({
  selector: 'demo-slide-up-hotels',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <h3>Small hotels, <em>worth the detour</em></h3>
      <p>Hover, tap or tab through for rates</p>
    </div>
    <div class="row">
      @for (h of hotels; track h.id) {
        <article
          class="card"
          tabindex="0"
          [class.open]="openId() === h.id"
          [attr.aria-label]="h.name + ', ' + h.place"
          [attr.aria-expanded]="openId() === h.id"
          (click)="toggle(h.id)"
          (keydown.enter)="toggle(h.id)"
          (keydown.space)="toggle(h.id); $event.preventDefault()"
        >
          <img [src]="h.img" [appImgFallback]="h.id" [alt]="'Photograph of ' + h.name" loading="lazy" />
          <div class="shade" aria-hidden="true"></div>
          <div class="txt">
            <p class="place">{{ h.place }}</p>
            <h4>{{ h.name }}</h4>
            <p class="peek">€{{ h.price }} / night · ★ {{ h.rating.toFixed(1) }}</p>
            <div class="more">
              <div class="inner">
                <ul class="perks">
                  @for (p of h.perks; track p) {
                    <li>{{ p }}</li>
                  }
                </ul>
                <div class="foot">
                  <p class="price"><strong>€{{ h.price }}</strong> / night</p>
                  <p class="rate">★ {{ h.rating.toFixed(1) }} · {{ h.rooms }} rooms</p>
                </div>
                <a href="#" class="cta" (click)="$event.preventDefault(); $event.stopPropagation()" (keydown.enter)="$event.stopPropagation()">View rooms</a>
              </div>
            </div>
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(20px, 4cqi, 40px);
      background: #d9d6cf; color: #1c1a17; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size;
    }
    .head { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(28px, 4.6cqi, 46px); line-height: 1; letter-spacing: -0.01em; }
    h3 em { font-style: italic; color: #5b4a33; }
    .head p { font-size: 13px; color: #5e5a52; }
    .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .card { position: relative; aspect-ratio: 3 / 4.4; border-radius: 4px; overflow: hidden; color: #f8f4ec; cursor: pointer; outline: none; isolation: isolate; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .card:focus-visible { box-shadow: 0 0 0 3px #1c1a17; }
    .card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,16,10,0) 40%, rgba(20,16,10,.78)); transition: background .5s; }
    .card:hover img, .card:focus-within img, .card.open img { transform: scale(1.08); }
    .card:hover .shade, .card:focus-within .shade, .card.open .shade { background: linear-gradient(180deg, rgba(20,16,10,.15) 0%, rgba(20,16,10,.88) 70%); }
    .txt { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px; }
    .place { font-size: 11.5px; letter-spacing: .06em; opacity: .85; }
    h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: clamp(22px, 2.6cqi, 28px); line-height: 1; margin-top: 4px; }
    .more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .55s cubic-bezier(.2,.8,.2,1); }
    .card:hover .more, .card:focus-within .more, .card.open .more { grid-template-rows: 1fr; }
    .inner { min-height: 0; overflow: hidden; opacity: 0; transform: translateY(12px); transition: opacity .35s, transform .55s cubic-bezier(.2,.8,.2,1); }
    .card:hover .inner, .card:focus-within .inner, .card.open .inner { opacity: 1; transform: none; transition-delay: .08s; }
    .peek { display: none; font-size: 13px; margin-top: 6px; opacity: .9; }
    .perks { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-wrap: wrap; gap: 5px; }
    .perks li { font-size: 11.5px; padding: 3px 8px; border: 1px solid rgba(248,244,236,.4); border-radius: 999px; }
    .foot { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(248,244,236,.25); flex-wrap: wrap; }
    .price { font-size: 13px; }
    .price strong { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; }
    .rate { font-size: 12px; opacity: .85; }
    .cta { display: inline-flex; align-items: center; min-height: 40px; margin-top: 12px; padding: 8px 16px; touch-action: manipulation; background: #f8f4ec; color: #1c1a17; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 2px; transition: background .2s; }
    .cta:hover { background: #fff; }
    .cta:focus-visible { outline: 2px solid #f8f4ec; outline-offset: 2px; }
    /* Touch: hover-reveal becomes tap-reveal. Rate stays visible on the closed card; the open
       card is driven only by .open so a sticky :hover/:focus can't keep it stuck open. */
    @media (hover: none) {
      .card:not(.open):hover .more, .card:not(.open):focus-within .more { grid-template-rows: 0fr; }
      .card:not(.open):hover .inner, .card:not(.open):focus-within .inner { opacity: 0; transform: translateY(12px); }
      .card:not(.open):hover img, .card:not(.open):focus-within img { transform: none; }
      .card:not(.open) .peek { display: block; }
    }
    @container (max-width: 820px) { .row { grid-template-columns: repeat(2, 1fr); } }
    @container (max-width: 420px) { .row { grid-template-columns: 1fr; } .card { aspect-ratio: 4 / 4.6; } }
  `,
})
export class SlideUpHotels {
  protected readonly hotels: Hotel[] = [
    { id: 'ht1', name: 'Casa Mirto', place: 'Puglia, Italy', price: 240, rating: 4.9, rooms: 9, perks: ['Olive grove', 'Pool', 'Breakfast'], img: unsplash('photo-1566073771259-6a8506099945', 600, 880) },
    { id: 'ht2', name: 'Hôtel Rivage', place: 'Biarritz, France', price: 310, rating: 4.8, rooms: 14, perks: ['Sea view', 'Surf storage', 'Bar'], img: unsplash('photo-1582719478250-c89cae4dc85b', 600, 880) },
    { id: 'ht3', name: 'Ryokan Shizuka', place: 'Hakone, Japan', price: 420, rating: 5.0, rooms: 6, perks: ['Onsen', 'Kaiseki dinner', 'Garden'], img: unsplash('photo-1542314831-068cd1dbfeeb', 600, 880) },
    { id: 'ht4', name: 'Finca Alta', place: 'Mallorca, Spain', price: 285, rating: 4.7, rooms: 11, perks: ['Mountain hikes', 'Spa', 'Vineyard'], img: unsplash('photo-1520250497591-112f2f40a3f4', 600, 880) },
  ];

  protected readonly openId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.openId.update((cur) => (cur === id ? null : id));
  }

  constructor() {
    loadGoogleFonts('Cormorant+Garamond:ital,wght@0,500;0,600;1,500');
  }
}
