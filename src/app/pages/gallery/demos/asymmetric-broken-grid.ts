import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

@Component({
  selector: 'demo-asymmetric-broken-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(pointermove)': 'move($event)', '(pointerleave)': 'px.set(0); py.set(0)' },
  template: `
    <div class="stage" [style.--px]="px()" [style.--py]="py()">
      <div class="lines" aria-hidden="true">
        @for (l of [1, 2, 3, 4, 5]; track l) { <span></span> }
      </div>
      <p class="giant" aria-hidden="true">Orla</p>
      <div class="block" aria-hidden="true"></div>

      <figure class="p p1" style="--d: 18px"><img [src]="img[0]" alt="Interior photograph 1 — Casa Orla, living room" /></figure>
      <figure class="p p2" style="--d: 34px"><img [src]="img[1]" alt="Interior photograph 2 — Casa Orla, stair detail" /></figure>
      <figure class="p p3" style="--d: 52px"><img [src]="img[2]" alt="Interior photograph 3 — Casa Orla, kitchen" /></figure>
      <figure class="p p4" style="--d: 26px"><img [src]="img[3]" alt="Interior photograph 4 — Casa Orla, bedroom" /></figure>

      <div class="text">
        <h3>Casa Orla</h3>
        <p>A 1962 fisherman’s house in Comporta, re-plastered in lime and pine by Atelier Sousa Lobo.</p>
        <dl>
          <div><dt>Area</dt><dd>148 m²</dd></div>
          <div><dt>Photos</dt><dd>Rui Calado</dd></div>
          <div><dt>Year</dt><dd>2025</dd></div>
        </dl>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 560px; background: #1f3b2f; color: #f6e7df; overflow: hidden; font-family: 'Syne', var(--font-body); }
    .stage { position: relative; height: 560px; --px: 0; --py: 0; }
    .lines { position: absolute; inset: 0 clamp(16px, 4cqw, 40px); display: grid; grid-template-columns: repeat(5, 1fr); pointer-events: none; }
    .lines span { border-left: 1px solid rgba(246,231,223,.12); }
    .lines span:last-child { border-right: 1px solid rgba(246,231,223,.12); }
    .giant { position: absolute; left: -2cqw; bottom: -6cqw; font-size: clamp(120px, 30cqw, 360px); font-weight: 800; line-height: .8; letter-spacing: -0.06em;
      color: transparent; -webkit-text-stroke: 1.5px rgba(242,198,180,.35); margin: 0;
      transform: translate(calc(var(--px) * -14px), calc(var(--py) * -10px)); transition: transform .4s ease-out; }
    .block { position: absolute; left: 40%; top: 9%; width: 26%; height: 54%; background: #f2c6b4;
      transform: translate(calc(var(--px) * 8px), calc(var(--py) * 8px)); transition: transform .4s ease-out; }
    .p { position: absolute; margin: 0; overflow: hidden; box-shadow: 0 30px 50px -24px rgba(0,0,0,.6);
      transform: translate(calc(var(--px) * var(--d)), calc(var(--py) * var(--d))); transition: transform .4s ease-out; }
    .p img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
    .p:hover img, .p:active img { transform: scale(1.06); }
    .p1 { left: 24%; top: 16%; width: 30%; height: 58%; }
    .p2 { left: 52%; top: 4%; width: 18%; height: 30%; }
    .p3 { left: 60%; top: 42%; width: 34%; height: 40%; }
    .p4 { left: 47%; top: 68%; width: 16%; height: 26%; }
    .text { position: absolute; left: clamp(16px, 4cqw, 40px); top: 28px; width: 19%; min-width: 170px; }
    h3 { font-size: clamp(26px, 3.4cqw, 40px); font-weight: 800; line-height: .95; letter-spacing: -0.03em; color: #f2c6b4; }
    .text p { font-size: 13px; line-height: 1.5; margin-top: 12px; color: rgba(246,231,223,.8); }
    dl { margin: 18px 0 0; display: grid; gap: 8px; }
    dl div { display: flex; justify-content: space-between; border-top: 1px solid rgba(246,231,223,.2); padding-top: 6px; font-size: 12px; }
    dt { color: rgba(246,231,223,.55); } dd { margin: 0; font-weight: 500; }
    @container (max-width: 640px) {
      :host { min-height: 620px; }
      .stage { height: 620px; }
      .text { width: auto; right: 16px; }
      dl { display: none; }
      .p1 { left: 6%; top: 36%; width: 52%; height: 38%; }
      .p2 { left: 62%; top: 32%; width: 32%; height: 22%; }
      .p3 { left: 40%; top: 58%; width: 54%; height: 28%; }
      .p4 { left: 10%; top: 78%; width: 30%; height: 18%; }
      .block { left: 30%; top: 46%; width: 40%; height: 40%; }
    }
  `,
})
export class AsymmetricBrokenGrid {
  protected readonly img = [
    photo('casa-orla-1', 700, 900),
    photo('casa-orla-2', 500, 500),
    photo('casa-orla-3', 900, 640),
    photo('casa-orla-4', 500, 600),
  ];
  protected readonly px = signal(0);
  protected readonly py = signal(0);
  private readonly still = prefersReducedMotion();

  constructor() {
    loadGoogleFonts('Syne:wght@500;700;800');
  }

  move(e: PointerEvent): void {
    if (this.still || e.pointerType === 'touch') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    this.py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
}
