import { ChangeDetectionStrategy, Component } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

@Component({
  selector: 'demo-bento-mixed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bento">
      <figure class="t a ph">
        <img [src]="img.a" alt="Ring Road journal photograph 1 — Vestrahorn, Stokksnes" />
        <figcaption><span class="day">Day 4</span><strong>Vestrahorn, Stokksnes</strong></figcaption>
      </figure>

      <div class="t b stat">
        <span class="k">Route 1</span>
        <strong>1,332<small>km</small></strong>
        <p>Nine days clockwise from Reykjavík, one tank of patience.</p>
      </div>

      <figure class="t c ph">
        <img [src]="img.c" alt="Ring Road journal photograph 2 — Skógafoss" />
        <figcaption><span class="day">Day 2</span><strong>Skógafoss</strong></figcaption>
      </figure>

      <figure class="t d ph">
        <img [src]="img.d" alt="Ring Road journal photograph 3 — Reynisfjara" />
        <figcaption><strong>Reynisfjara</strong></figcaption>
      </figure>

      <figure class="t e ph">
        <img [src]="img.e" alt="Ring Road journal photograph 4 — Jökulsárlón lagoon" />
        <figcaption><span class="day">Day 5</span><strong>Jökulsárlón at 23:10</strong></figcaption>
      </figure>

      <div class="t f map">
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path class="land" d="M14 40c2-14 16-26 34-28 10-1 16 4 26 2 14-3 30 2 34 14 4 10-4 18-2 26 2 10-10 16-22 14-10-2-14 6-26 6-14 0-18-8-30-8C16 66 12 54 14 40z" />
          <path class="road" d="M30 52c-6-8-4-20 8-26 10-5 18 0 28-2 12-2 24 2 28 10 3 8-2 14 0 20 1 6-8 8-16 7-8-1-12 5-22 5-10 0-14-6-22-6-4 0-4-4-4-8z" />
          <circle cx="30" cy="52" r="2.4" />
        </svg>
        <div><strong>Ring Road</strong><span>Hringvegur · 9 days</span></div>
      </div>

      <figure class="t g ph">
        <img [src]="img.g" alt="Ring Road journal photograph 5 — Mývatn" />
        <figcaption><strong>Mývatn</strong></figcaption>
      </figure>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #e9eef0; color: #101418; padding: clamp(12px, 2.4cqw, 26px); font-family: 'Outfit', var(--font-body); }
    .bento { display: grid; gap: 10px; grid-template-columns: 1.3fr 1fr 1fr 1fr; grid-template-rows: repeat(3, minmax(140px, 1fr));
      grid-template-areas: 'a a b c' 'a a d c' 'e e f g'; min-height: 460px; }
    @container (max-width: 640px) {
      .bento { grid-template-columns: 1fr 1fr; grid-template-rows: 200px 120px 160px 120px 150px 140px;
        grid-template-areas: 'a a' 'b c' 'd c' 'e e' 'f g' 'f g'; }
    }
    .t { position: relative; margin: 0; border-radius: 20px; overflow: hidden; transition: transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s; }
    .t:hover { transform: translateY(-3px); box-shadow: 0 18px 34px -20px rgba(16,20,24,.5); }
    .a { grid-area: a; } .b { grid-area: b; } .c { grid-area: c; } .d { grid-area: d; } .e { grid-area: e; } .f { grid-area: f; } .g { grid-area: g; }
    .ph { background: #cfd8dc; }
    .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(.2,.7,.2,1); }
    .ph:hover img { transform: scale(1.06); }
    figcaption { position: absolute; left: 12px; bottom: 12px; right: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: #fff; }
    figcaption strong { font-weight: 600; font-size: 14px; text-shadow: 0 1px 12px rgba(0,0,0,.5); }
    .a figcaption strong { font-size: clamp(20px, 3cqw, 30px); font-weight: 700; letter-spacing: -0.02em; }
    .day { font-size: 11px; font-weight: 600; background: #ff6a3d; color: #101418; padding: 3px 8px; border-radius: 99px; }
    .stat { background: #101418; color: #f2f5f6; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; }
    .k { font-size: 12px; color: #9aa7ad; }
    .stat strong { font-size: clamp(34px, 5cqw, 52px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; color: #ff6a3d; }
    .stat small { font-size: 15px; font-weight: 500; color: #f2f5f6; margin-left: 4px; letter-spacing: 0; }
    .stat p { font-size: 12.5px; color: #c4cdd1; line-height: 1.4; }
    .map { background: #cfe3ea; padding: 12px 14px; display: grid; grid-template-rows: 1fr auto; }
    .map svg { width: 100%; height: 100%; min-height: 0; }
    .land { fill: #b6d2dc; }
    .road { fill: none; stroke: #101418; stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 260; stroke-dashoffset: 0; }
    .map:hover .road, .map:active .road { animation: draw 1.6s cubic-bezier(.6,0,.2,1); }
    @media (hover: none) { .t:hover { transform: none; box-shadow: none; } .ph:hover img { transform: none; } }
    @keyframes draw { from { stroke-dashoffset: 260; } }
    .map circle { fill: #ff6a3d; }
    .map strong { display: block; font-size: 14px; font-weight: 600; } .map span { font-size: 11.5px; color: #4b5d64; }
  `,
})
export class BentoMixed {
  protected readonly img = {
    a: photo('ringroad-vestrahorn', 900, 700),
    c: photo('ringroad-skogafoss', 400, 640),
    d: photo('ringroad-reynisfjara', 400, 300),
    e: photo('ringroad-jokulsarlon', 800, 340),
    g: photo('ringroad-myvatn', 400, 320),
  };

  constructor() {
    loadGoogleFonts('Outfit:wght@400;500;600;700');
  }
}
