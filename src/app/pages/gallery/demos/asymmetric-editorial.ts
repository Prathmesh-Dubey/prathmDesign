import { ChangeDetectionStrategy, Component } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

@Component({
  selector: 'demo-asymmetric-editorial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="spread">
      <div class="head">
        <p class="issue">No. 14 — Summer 2026</p>
        <h3>The <em>Linen</em><br />Issue</h3>
        <p class="dek">Six looks cut from Lithuanian flax, shot on the salt flats of Aigues-Mortes by Clémence Duval.</p>
      </div>

      <figure class="f a">
        <div class="frame"><img [src]="img[0]" alt="Editorial photograph 1 — The Linen Issue, Aigues-Mortes" /></div>
        <figcaption><b>01</b> Atelier Mirelle — oversized shirt, €240</figcaption>
      </figure>
      <figure class="f b">
        <div class="frame"><img [src]="img[1]" alt="Editorial photograph 2 — The Linen Issue" /></div>
        <figcaption><b>02</b> Studio Narva — wide trouser, €310</figcaption>
      </figure>
      <figure class="f c">
        <div class="frame"><img [src]="img[2]" alt="Editorial photograph 3 — The Linen Issue" /></div>
        <figcaption><b>03</b> Halden &amp; Roe — wrap dress, €420</figcaption>
      </figure>
      <figure class="f d">
        <div class="frame"><img [src]="img[3]" alt="Editorial photograph 4 — The Linen Issue" /></div>
        <figcaption><b>04</b> Ocre — sandal, €180</figcaption>
      </figure>

      <blockquote>“Linen remembers every movement. That is the point of it.”<cite>— Ieva Kairytė, weaver</cite></blockquote>
    </article>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #f2f2ef; color: #121212; overflow: hidden; }
    .spread { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: 44px; gap: 0 16px; padding: 28px clamp(16px, 3.5cqw, 40px); }
    .head { grid-column: 1 / 5; grid-row: 1 / 6; align-self: start; }
    .issue { font-family: var(--font-mono); font-size: 11px; color: #7a1f2b; }
    h3 { font-family: 'Playfair Display', serif; font-weight: 400; font-size: clamp(44px, 7cqw, 86px); line-height: .88; letter-spacing: -0.03em; margin-top: 12px; }
    h3 em { font-style: italic; color: #7a1f2b; }
    .dek { font-family: 'Playfair Display', serif; font-size: 15px; line-height: 1.45; max-width: 30ch; margin-top: 16px; color: #3a3a3a; }
    .f { margin: 0; position: relative; }
    .f img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(.2,.7,.2,1), filter .6s; filter: saturate(.85); }
    .f .frame { overflow: hidden; min-height: 0; }
    .f:hover img, .f:active img { transform: scale(1.035); filter: saturate(1); }
    figcaption { font-size: 11.5px; color: #4a4a4a; margin-top: 7px; letter-spacing: .01em; }
    figcaption b { font-family: var(--font-mono); font-weight: 500; color: #7a1f2b; margin-right: 6px; transition: color .3s; }
    .f:hover figcaption b { color: #121212; }
    .a { grid-column: 5 / 9; grid-row: 1 / 10; display: grid; grid-template-rows: 1fr auto; }
    .b { grid-column: 9 / 13; grid-row: 2 / 7; display: grid; grid-template-rows: 1fr auto; }
    .c { grid-column: 10 / 13; grid-row: 7 / 12; display: grid; grid-template-rows: 1fr auto; margin-top: 18px; }
    .d { grid-column: 2 / 5; grid-row: 7 / 11; display: grid; grid-template-rows: 1fr auto; }
    blockquote { grid-column: 5 / 10; grid-row: 10 / 12; margin: 14px 0 0; font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(17px, 2.1cqw, 22px); line-height: 1.25; padding-left: 16px; border-left: 2px solid #7a1f2b; }
    cite { display: block; font-style: normal; font-family: var(--font-body); font-size: 11.5px; color: #6a6a6a; margin-top: 6px; }
    @container (max-width: 700px) {
      .spread { grid-template-columns: repeat(6, 1fr); grid-auto-rows: auto; gap: 18px 12px; }
      .head { grid-column: 1 / -1; grid-row: auto; }
      .a { grid-column: 1 / 6; grid-row: auto; aspect-ratio: 3 / 4; }
      .b { grid-column: 2 / 7; grid-row: auto; aspect-ratio: 4 / 3; }
      .c { grid-column: 1 / 4; grid-row: auto; aspect-ratio: 3 / 4; margin-top: 0; }
      .d { grid-column: 4 / 7; grid-row: auto; aspect-ratio: 1; align-self: end; }
      blockquote { grid-column: 1 / -1; grid-row: auto; }
    }
  `,
})
export class AsymmetricEditorial {
  protected readonly img = [
    photo('linen-issue-a', 700, 940),
    photo('linen-issue-b', 800, 560),
    photo('linen-issue-c', 560, 720),
    photo('linen-issue-d', 600, 640),
  ];

  constructor() {
    loadGoogleFonts('Playfair+Display:ital,wght@0,400;0,600;1,400');
  }
}
