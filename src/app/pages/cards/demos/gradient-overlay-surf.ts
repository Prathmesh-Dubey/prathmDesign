import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Spot {
  id: string;
  name: string;
  country: string;
  swell: string;
  wind: string;
  rating: string;
  forecast: number[];
  from: string;
  img: string;
}

@Component({
  selector: 'demo-gradient-overlay-surf',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      @for (s of spots; track s.id; let i = $index) {
        <a class="card" [class.feature]="i === 0" href="#" (click)="$event.preventDefault()" [style.--from]="s.from">
          <img [src]="s.img" [appImgFallback]="s.id" [alt]="'Photo for ' + s.name + ', ' + s.country" loading="lazy" />
          <span class="veil" aria-hidden="true"></span>
          <span class="top">
            <span class="pill">{{ s.rating }}</span>
            <span class="country">{{ s.country }}</span>
          </span>
          <span class="bottom">
            <span class="name">{{ s.name }}</span>
            <span class="stats">
              <span><small>Swell</small>{{ s.swell }}</span>
              <span><small>Wind</small>{{ s.wind }}</span>
            </span>
            <span class="bars" role="img" aria-label="Seven-day swell forecast">
              @for (f of s.forecast; track $index) {
                <span [style.height.%]="f * 10" [style.transition-delay.ms]="$index * 40"></span>
              }
            </span>
          </span>
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(12px, 2.4cqi, 24px);
      background: #071a24; color: #fff; font-family: 'Barlow', 'Geist', sans-serif; container-type: inline-size;
    }
    .grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: repeat(2, minmax(220px, 1fr)); gap: 10px; min-height: 476px; }
    .card { position: relative; display: block; overflow: hidden; border-radius: 22px; color: inherit; text-decoration: none; isolation: isolate; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .card:active img { transform: scale(1.04); }
    .card:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
    .feature { grid-row: span 2; }
    .card:nth-child(4) { grid-column: span 2; }
    img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.4s cubic-bezier(.2,.7,.2,1); z-index: -2; }
    .veil {
      position: absolute; inset: 0; z-index: -1;
      background:
        linear-gradient(to top, var(--from) 0%, color-mix(in srgb, var(--from) 55%, transparent) 30%, transparent 62%),
        linear-gradient(to bottom, rgba(4,12,18,.5), transparent 30%);
      transition: opacity .5s;
    }
    .veil::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, var(--from), color-mix(in srgb, var(--from) 40%, transparent) 70%); opacity: 0; transition: opacity .5s; }
    .card:hover img, .card:focus-visible img { transform: scale(1.07); }
    .card:hover .veil::after, .card:focus-visible .veil::after { opacity: .75; }
    .top { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; justify-content: space-between; align-items: center; }
    .pill { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.18); backdrop-filter: blur(8px); }
    .country { font-size: 12px; font-weight: 600; letter-spacing: .08em; opacity: .9; }
    .bottom { position: absolute; left: 18px; right: 18px; bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
    .name {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-style: italic; text-transform: uppercase;
      font-size: clamp(34px, 5.4cqi, 60px); line-height: .82; letter-spacing: -0.01em; transition: letter-spacing .6s cubic-bezier(.2,.8,.2,1);
    }
    .feature .name { font-size: clamp(48px, 9cqi, 104px); }
    .card:hover .name { letter-spacing: .02em; }
    .stats { display: flex; gap: 18px; font-weight: 600; font-size: 15px; }
    .stats small { display: block; font-size: 11px; font-weight: 500; opacity: .75; }
    .bars { display: flex; align-items: flex-end; gap: 4px; height: 0; opacity: 0; transition: height .45s cubic-bezier(.2,.8,.2,1), opacity .3s; }
    .bars span { flex: 1; max-width: 14px; background: rgba(255,255,255,.85); border-radius: 3px 3px 1px 1px; transform: scaleY(0); transform-origin: bottom; transition: transform .45s cubic-bezier(.2,.8,.2,1); }
    .card:hover .bars, .card:focus-visible .bars { height: 36px; opacity: 1; }
    .card:hover .bars span, .card:focus-visible .bars span { transform: none; }
    /* Touch: no hover, so the forecast bars are simply shown. */
    @media (hover: none) {
      .bars { height: 32px; opacity: 1; }
      .bars span { transform: none; }
    }
    @container (max-width: 720px) {
      .grid { grid-template-columns: 1fr 1fr; grid-template-rows: none; grid-auto-rows: 220px; }
      .feature { grid-column: span 2; grid-row: auto; }
      .card:nth-child(4) { grid-column: span 2; }
    }
    @container (max-width: 440px) {
      .grid { grid-template-columns: 1fr; }
      .feature, .card:nth-child(4) { grid-column: auto; }
    }
  `,
})
export class GradientOverlaySurf {
  protected readonly spots: Spot[] = [
    { id: 'sf-naz', name: 'Nazaré', country: 'PORTUGAL', swell: '6.4 m · 18 s', wind: 'E 9 km/h', rating: 'Epic', from: '#0b4f6c', forecast: [5, 7, 9, 10, 8, 6, 5], img: unsplash('photo-1505142468610-359e7d316be0', 900, 1100) },
    { id: 'sf-ulu', name: 'Uluwatu', country: 'BALI', swell: '1.8 m · 14 s', wind: 'SE 12 km/h', rating: 'Good', from: '#c2521b', forecast: [4, 5, 6, 6, 5, 4, 4], img: unsplash('photo-1507525428034-b723cf961d3e', 700, 600) },
    { id: 'sf-hos', name: 'Hossegor', country: 'FRANCE', swell: '2.2 m · 12 s', wind: 'NE 6 km/h', rating: 'Fair', from: '#3a2d6b', forecast: [3, 4, 6, 7, 5, 3, 2], img: unsplash('photo-1455729552865-3658a5d39692', 700, 600) },
    { id: 'sf-pip', name: 'Pipeline', country: 'OʻAHU', swell: '3.1 m · 16 s', wind: 'ESE 14 km/h', rating: 'Firing', from: '#0e6b5c', forecast: [6, 8, 9, 8, 7, 7, 6], img: unsplash('photo-1502680390469-be75c86b636f', 1100, 600) },
  ];

  constructor() {
    loadGoogleFonts('Barlow:wght@500;600;700', 'Barlow+Condensed:ital,wght@1,800');
  }
}
