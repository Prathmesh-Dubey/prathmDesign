import { ChangeDetectionStrategy, Component } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Shot {
  id: number;
  place: string;
  coords: string;
  w: number;
  h: number;
  src: string;
}

const SHOTS: [string, string, number, number][] = [
  ['Quiraing, Isle of Skye', '57.62° N, 6.29° W', 600, 800],
  ['Reinebringen, Lofoten', '67.93° N, 13.07° E', 600, 400],
  ['Glen Etive', '56.59° N, 4.99° W', 600, 600],
  ['Geirangerfjord', '62.10° N, 7.09° E', 600, 900],
  ['Loch Torridon', '57.55° N, 5.62° W', 600, 380],
  ['Trolltunga', '60.12° N, 6.74° E', 600, 760],
  ['Rannoch Moor', '56.65° N, 4.75° W', 600, 450],
  ['Senja, Segla ridge', '69.38° N, 17.17° E', 600, 820],
  ['Assynt, Suilven', '58.12° N, 5.12° W', 600, 600],
  ['Aurlandsfjord', '60.90° N, 7.20° E', 600, 400],
  ['Old Man of Storr', '57.51° N, 6.18° W', 600, 860],
  ['Hamnøy', '67.95° N, 13.13° E', 600, 480],
  ['Buachaille Etive Mòr', '56.65° N, 4.90° W', 600, 700],
  ['Preikestolen', '58.99° N, 6.19° E', 600, 420],
];

@Component({
  selector: 'demo-masonry-columns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <header>
        <h3>Highlands <em>&amp;</em> Fjords</h3>
        <p>Fourteen frames from a north-sea crossing — Mhairi Lennox, 2024</p>
      </header>
      <div class="scroller" tabindex="0" aria-label="Highlands and Fjords photographs, scrollable">
        <div class="cols">
          @for (s of shots; track s.id) {
            <figure>
              <img [src]="s.src" [width]="s.w" [height]="s.h" [style.aspect-ratio]="s.w + ' / ' + s.h"
                [alt]="'Photograph ' + (s.id + 1) + ' — ' + s.place" loading="lazy" />
              <figcaption>
                <span class="place">{{ s.place }}</span>
                <span class="coords">{{ s.coords }}</span>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; height: 600px; background: #e8ece8; color: #1d2a24; }
    .wrap { height: 100%; display: grid; grid-template-rows: auto 1fr; }
    header { padding: 22px clamp(16px, 3cqw, 32px) 14px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 18px; border-bottom: 1px solid #c9d2cb; }
    h3 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(30px, 4.4cqw, 46px); line-height: 1; letter-spacing: -0.01em; }
    h3 em { color: #4f7a63; }
    header p { font-size: 13px; color: #5e6d64; }
    .scroller { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 16px clamp(16px, 3cqw, 32px) 30px; scrollbar-width: thin; scrollbar-color: #9fb0a5 transparent;
      mask-image: linear-gradient(#000 calc(100% - 50px), transparent); }
    .scroller:focus-visible { outline: 2px solid #4f7a63; outline-offset: -4px; }
    .cols { columns: 4 200px; column-gap: 14px; }
    figure { break-inside: avoid; margin: 0 0 18px; }
    img { width: 100%; height: auto; border-radius: 2px; background: #cdd6cf; transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s; }
    figure:hover img { transform: translateY(-3px); box-shadow: 0 16px 30px -18px rgba(29,42,36,.6); }
    figcaption { display: flex; justify-content: space-between; gap: 8px; padding-top: 7px; font-size: 12px; }
    .place { font-family: 'Instrument Serif', serif; font-size: 16px; line-height: 1.15; }
    .coords { font-family: var(--font-mono); font-size: 10px; color: #6d7d73; white-space: nowrap; padding-top: 3px; }
    @media (hover: none) { figure:hover img { transform: none; box-shadow: none; } }
    /* phones: two tight columns instead of one long strip */
    @container (max-width: 480px) {
      .cols { columns: 2; column-gap: 10px; }
      figure { margin-bottom: 14px; }
      figcaption { flex-direction: column; gap: 1px; padding-top: 5px; }
      .place { font-size: 14.5px; }
      .coords { padding-top: 0; font-size: 9.5px; }
    }
  `,
})
export class MasonryColumns {
  protected readonly shots: Shot[] = SHOTS.map(([place, coords, w, h], id) => ({
    id, place, coords, w, h, src: photo('northsea-' + id, w, h),
  }));

  constructor() {
    loadGoogleFonts('Instrument+Serif:ital@0;1');
  }
}
