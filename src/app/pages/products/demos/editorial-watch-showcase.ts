import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Edition {
  id: string;
  word: string;
  dial: string;
  img: string;
  alt: string;
  price: string;
  bg: string;
  gold: string;
}

@Component({
  selector: 'demo-editorial-watch-showcase',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="show" [style.--bg]="ed().bg" [style.--gold]="ed().gold">
      <div class="photo">
        @for (e of editions; track e.id) {
          <img [src]="e.img" [appImgFallback]="'halden-' + e.id" [alt]="e.alt" [class.on]="e.id === ed().id" />
        }
      </div>

      <div class="copy">
        <p class="house">Halden Horlogerie · Le Brassus</p>
        @for (e of editions; track e.id) {
          @if (e.id === ed().id) {
            <h3 class="word" aria-live="polite">
              <span class="l1">Halden</span>
              <em class="l2">{{ e.word }}</em>
            </h3>
          }
        }
        <p class="lede">A forty-hour hand finish on a case milled from a single bar of grade 5 titanium. {{ ed().dial }}.</p>

        <dl class="specs">
          @for (s of specs; track s[0]; let i = $index) {
            <div [style.--d]="i * 60 + 'ms'"><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
          }
        </dl>

        <div class="foot">
          <div class="dials" role="radiogroup" aria-label="Dial edition">
            @for (e of editions; track e.id) {
              <button type="button" role="radio" [attr.aria-checked]="e.id === ed().id" [class.on]="e.id === ed().id" (click)="pick(e.id)">
                <i [style.background]="e.id === 'nocturne' ? '#15161b' : '#e8ecef'"></i>{{ e.word }}
              </button>
            }
          </div>
          <div class="buy">
            <span class="price">{{ ed().price }}</span>
            <button type="button" class="cta" (click)="reserved.set(!reserved())">{{ reserved() ? 'Viewing requested' : 'Reserve a viewing' }}</button>
          </div>
        </div>
      </div>
      <span class="edition" aria-hidden="true">N° 041 / 250</span>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; }
    .show {
      --bg: #0f1013; --gold: #c9b48a;
      position: relative; min-height: 640px; height: 100%; display: grid; grid-template-columns: 1.05fr 1fr; overflow: hidden;
      background: var(--bg); color: #ede9e1; font-family: 'Geist', sans-serif; transition: background .8s ease;
    }
    .photo { position: relative; overflow: hidden; }
    .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.08); transition: opacity 1s ease, transform 1.6s cubic-bezier(.2,.7,.1,1); }
    .photo img.on { opacity: 1; transform: scale(1); }
    .photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 55%, var(--bg)); transition: background .8s; }
    .copy { position: relative; z-index: 1; padding: clamp(28px, 5cqw, 64px) clamp(22px, 4cqw, 56px); display: flex; flex-direction: column; gap: 18px; margin-left: -12cqw; }
    .house { font-size: 12.5px; color: var(--gold); letter-spacing: .06em; }
    .word { font-family: 'Cormorant Garamond', serif; font-weight: 300; line-height: .82; font-size: clamp(64px, 12cqw, 150px); letter-spacing: -.035em; display: flex; flex-direction: column; }
    .l1, .l2 { display: block; animation: rise 1s cubic-bezier(.2,.7,.1,1) both; }
    .l2 { font-style: italic; color: var(--gold); padding-left: .5em; animation-delay: .08s; }
    @keyframes rise { from { opacity: 0; transform: translateY(30px); clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
    .lede { max-width: 40ch; font-size: 14.5px; line-height: 1.6; color: #bdb8ae; }
    .specs { margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0 26px; max-width: 460px; }
    .specs div { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid color-mix(in srgb, var(--gold) 30%, transparent); font-size: 13px; animation: fade .8s ease both; animation-delay: var(--d); }
    @keyframes fade { from { opacity: 0; transform: translateY(8px); } }
    dt { color: #8f8a80; } dd { margin: 0; text-align: right; }
    .foot { margin-top: auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px; }
    .dials { display: flex; gap: 6px; }
    .dials button { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px 8px 8px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--gold) 35%, transparent); background: transparent; color: #ede9e1; cursor: pointer; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; transition: .3s; }
    .dials button.on { background: var(--gold); color: var(--bg); border-color: var(--gold); }
    .dials i { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--gold); }
    .buy { display: flex; align-items: center; gap: 16px; }
    .price { font-family: 'Cormorant Garamond', serif; font-size: 26px; }
    .cta { height: 46px; padding: 0 22px; border: 1px solid var(--gold); background: transparent; color: var(--gold); cursor: pointer; font-size: 13.5px; letter-spacing: .04em; transition: background .3s, color .3s; }
    @media (hover: hover) { .cta:hover { background: var(--gold); color: var(--bg); } }
    .cta:active { background: var(--gold); color: var(--bg); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .dials button:active { transform: scale(.96); }
    @media (pointer: coarse) { .dials button { min-height: 42px; } }
    .edition { position: absolute; left: 22px; bottom: 18px; z-index: 1; font-family: 'Geist Mono', monospace; font-size: 11px; color: #fff; opacity: .7; }
    button:focus-visible { outline-color: var(--gold); }
    @container (max-width: 720px) {
      .show { grid-template-columns: 1fr; grid-template-rows: 300px auto; min-height: 0; }
      .photo::after { background: linear-gradient(180deg, transparent 50%, var(--bg)); }
      .copy { margin: -90px 0 0; }
      .specs { grid-template-columns: 1fr; }
      .edition { top: 16px; bottom: auto; }
    }
    @container (max-width: 420px) {
      .show { grid-template-rows: 260px auto; }
      .copy { margin-top: -70px; padding: 24px 20px 26px; gap: 14px; }
      .word { font-size: 58px; }
      .foot, .buy { width: 100%; }
      .buy { justify-content: space-between; }
      .cta { padding: 0 16px; }
    }
  `,
})
export class EditorialWatchShowcase {
  protected readonly editions: Edition[] = [
    { id: 'nocturne', word: 'Nocturne', dial: 'Sunray anthracite dial with lume-filled batons', img: unsplash(PRODUCT_PHOTOS.watchDark, 1100, 1300), alt: 'Halden Nocturne with a black titanium case', price: 'CHF 7,400', bg: '#0f1013', gold: '#c9b48a' },
    { id: 'glacier', word: 'Glacier', dial: 'Grained glacier-white dial with polished indices', img: unsplash(PRODUCT_PHOTOS.watchWhite, 1100, 1300), alt: 'Halden Glacier with a white dial', price: 'CHF 7,900', bg: '#14202a', gold: '#b9cbd6' },
  ];
  protected readonly id = signal('nocturne');
  protected readonly ed = computed(() => this.editions.find((e) => e.id === this.id()) ?? this.editions[0]);
  protected readonly reserved = signal(false);
  protected readonly specs: [string, string][] = [
    ['Case', '39mm Ti grade 5'],
    ['Calibre', 'H-21 automatic'],
    ['Reserve', '72 hours'],
    ['Water', '100 metres'],
    ['Frequency', '4 Hz'],
    ['Edition', '250 pieces'],
  ];

  constructor() {
    loadGoogleFonts('Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400');
  }

  pick(id: string): void {
    this.id.set(id);
  }
}
