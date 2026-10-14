import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Pin =
  | { id: string; kind: 'photo'; title: string; by: string; img: string; ratio: string }
  | { id: string; kind: 'tip'; title: string; body: string }
  | { id: string; kind: 'quote'; text: string; by: string }
  | { id: string; kind: 'care'; title: string; items: string[] }
  | { id: string; kind: 'palette'; title: string; colors: string[] };

@Component({
  selector: 'demo-masonry-plant-board',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h3>Rainforest corner</h3>
      <p>24 pins · board by Hana Sato · {{ saved().length }} saved by you</p>
    </header>
    <div class="cols">
      @for (p of pins; track p.id) {
        <article class="pin" [class]="'pin ' + p.kind">
          @switch (p.kind) {
            @case ('photo') {
              <div class="ph" [style.aspect-ratio]="p.ratio">
                <img [src]="p.img" [appImgFallback]="p.id" [alt]="'Pinned photo: ' + p.title" loading="lazy" />
                <button
                  type="button"
                  class="save"
                  [class.on]="isSaved(p.id)"
                  [attr.aria-pressed]="isSaved(p.id)"
                  [attr.aria-label]="(isSaved(p.id) ? 'Unsave ' : 'Save ') + p.title"
                  (click)="toggle(p.id)"
                >{{ isSaved(p.id) ? 'Saved' : 'Save' }}</button>
              </div>
              <p class="cap">{{ p.title }}</p>
              <p class="by">{{ p.by }}</p>
            }
            @case ('tip') {
              <p class="label">Care tip</p>
              <h4>{{ p.title }}</h4>
              <p class="body">{{ p.body }}</p>
            }
            @case ('quote') {
              <p class="q">{{ p.text }}</p>
              <p class="by">— {{ p.by }}</p>
            }
            @case ('care') {
              <h4>{{ p.title }}</h4>
              <ul>
                @for (it of p.items; track it) {
                  <li>
                    <label>
                      <input type="checkbox" [checked]="done().includes(it)" (change)="toggleDone(it)" />
                      <span>{{ it }}</span>
                    </label>
                  </li>
                }
              </ul>
            }
            @case ('palette') {
              <div class="sw">
                @for (c of p.colors; track c) {
                  <span [style.background]="c" [attr.title]="c"></span>
                }
              </div>
              <p class="cap">{{ p.title }}</p>
              <p class="by mono">{{ p.colors.join(' · ') }}</p>
            }
          }
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(18px, 3.4cqi, 34px);
      background: #edf0e8; color: #1e2a20; font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size;
    }
    header { margin-bottom: 18px; text-align: center; }
    h3 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(26px, 4cqi, 38px); letter-spacing: -0.01em; }
    header p { font-size: 13.5px; color: #5d6b5f; margin-top: 4px; }
    .cols { columns: 4 190px; column-gap: 14px; }
    .pin { break-inside: avoid; margin-bottom: 14px; border-radius: 18px; animation: up .6s cubic-bezier(.2,.7,.2,1) both; }
    .pin:nth-child(3n) { animation-delay: .08s; }
    .pin:nth-child(3n+1) { animation-delay: .16s; }
    .photo .ph { position: relative; border-radius: 18px; overflow: hidden; background: #d4dbcc; }
    .photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.2,.7,.2,1); }
    .photo .ph::after { content: ''; position: absolute; inset: 0; background: rgba(15,25,15,.28); opacity: 0; transition: opacity .25s; pointer-events: none; }
    @media (hover: hover) {
      .photo:hover .ph::after, .photo:focus-within .ph::after { opacity: 1; }
      .photo:hover img { transform: scale(1.03); }
    }
    .save {
      position: absolute; top: 10px; right: 10px; z-index: 1; border: 0; border-radius: 999px; padding: 9px 15px;
      background: #1f5135; color: #fff; font-weight: 600; font-size: 13.5px; cursor: pointer;
      opacity: 0; transform: translateY(-4px); transition: opacity .2s, transform .2s, background .2s;
      min-height: 38px; touch-action: manipulation; -webkit-tap-highlight-color: transparent;
    }
    .save::before { content: ''; position: absolute; inset: -6px; border-radius: 999px; }
    .save:active { transform: scale(.95); }
    .photo:hover .save, .save:focus-visible, .save.on { opacity: 1; transform: none; }
    /* Touch: no hover, so Save is always shown on the photo. */
    @media (hover: none) { .save { opacity: 1; transform: none; background: rgba(31,81,53,.9); } .save.on { background: #1e2a20; } }
    .save.on { background: #1e2a20; }
    .cap { font-size: 14px; font-weight: 600; margin: 8px 4px 0; line-height: 1.3; }
    .by { font-size: 12.5px; color: #5d6b5f; margin: 2px 4px 0; }
    .mono { font-family: 'Geist Mono', monospace; font-size: 11px; }
    .tip { background: #1f5135; color: #e8f1e6; padding: 18px; }
    .label { font-size: 12px; color: #a9d3b0; }
    h4 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 22px; line-height: 1.1; margin-top: 4px; }
    .body { font-size: 14px; line-height: 1.5; margin-top: 8px; color: #cfe2cf; }
    .quote { background: #f6d9a8; padding: 20px 18px; }
    .q { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 21px; line-height: 1.2; color: #3d2a0a; }
    .quote .by { color: #6e5326; margin: 10px 0 0; }
    .care { background: #fff; padding: 16px 18px; border: 1px solid #d8dfd3; }
    .care ul { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 7px; }
    .care label { display: flex; gap: 9px; align-items: center; min-height: 32px; font-size: 13.5px; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .care input { appearance: none; width: 18px; height: 18px; border: 1.5px solid #1f5135; border-radius: 6px; display: grid; place-items: center; margin: 0; cursor: pointer; flex-shrink: 0; transition: background .2s; }
    .care input:checked { background: #1f5135; }
    .care input:checked::after { content: ''; width: 9px; height: 5px; border: 2px solid #fff; border-top: 0; border-right: 0; transform: rotate(-45deg) translate(1px, -1px); }
    .care input:checked + span { text-decoration: line-through; color: #8a968c; }
    .palette .sw { display: grid; grid-template-columns: repeat(4, 1fr); height: 92px; border-radius: 18px; overflow: hidden; }
    @container (max-width: 480px) {
      .cols { columns: 2; column-gap: 10px; }
      .pin { margin-bottom: 10px; border-radius: 14px; }
      .photo .ph, .palette .sw { border-radius: 14px; }
      .save { top: 7px; right: 7px; padding: 7px 12px; font-size: 12.5px; min-height: 34px; }
      .cap { font-size: 13px; }
      .tip, .care { padding: 14px; }
      .quote { padding: 16px 14px; }
      h4 { font-size: 19px; }
      .q { font-size: 18px; }
      .body { font-size: 13px; }
      .care label { font-size: 12.5px; align-items: flex-start; }
      .palette .sw { height: 70px; }
    }
    @keyframes up { from { opacity: 0; transform: translateY(18px); } }
  `,
})
export class MasonryPlantBoard {
  protected readonly saved = signal<string[]>(['p3']);
  protected readonly done = signal<string[]>(['Mist the calathea']);
  protected readonly pins: Pin[] = [
    { id: 'p1', kind: 'photo', title: 'Monstera by the north window', by: 'Hana Sato', ratio: '3 / 4', img: unsplash('photo-1485955900006-10f4d324d411', 400, 540) },
    { id: 't1', kind: 'tip', title: 'Water the soil, not the leaves', body: 'Push a finger in to the second knuckle. Dry? Water until it drains. Damp? Wait two days.' },
    { id: 'p2', kind: 'photo', title: 'Shelf of small succulents', by: 'Leafline Studio', ratio: '1 / 1', img: unsplash('photo-1463936575829-25148e1db1b8', 400, 400) },
    { id: 'c1', kind: 'care', title: 'This week', items: ['Mist the calathea', 'Rotate the fiddle leaf', 'Repot the pothos cutting', 'Feed the herbs'] },
    { id: 'p3', kind: 'photo', title: 'Terracotta grouping, living room', by: 'Joaquín M.', ratio: '4 / 5', img: unsplash('photo-1416879595882-3373a0480b5b', 400, 500) },
    { id: 'q1', kind: 'quote', text: 'To plant a garden is to believe in tomorrow.', by: 'Audrey Hepburn' },
    { id: 'pl', kind: 'palette', title: 'Canopy palette', colors: ['#1f5135', '#5f8f62', '#c9d7a5', '#f6d9a8'] },
    { id: 'p4', kind: 'photo', title: 'Trailing pothos from a bookcase', by: 'Hana Sato', ratio: '2 / 3', img: unsplash('photo-1459411552884-841db9b3cc2a', 400, 600) },
    { id: 'p5', kind: 'photo', title: 'Propagation station', by: 'Green Room LDN', ratio: '5 / 4', img: unsplash('photo-1501004318641-b39e6451bec6', 500, 400) },
    { id: 't2', kind: 'tip', title: 'Bright, indirect light', body: 'Within a metre of a window, out of the hot afternoon sun. Sheer curtains are your friend.' },
  ];

  constructor() {
    loadGoogleFonts('DM+Serif+Display:ital@0;1');
  }

  protected isSaved(id: string): boolean {
    return this.saved().includes(id);
  }

  protected toggle(id: string): void {
    this.saved.update((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  protected toggleDone(it: string): void {
    this.done.update((d) => (d.includes(it) ? d.filter((x) => x !== it) : [...d, it]));
  }
}
