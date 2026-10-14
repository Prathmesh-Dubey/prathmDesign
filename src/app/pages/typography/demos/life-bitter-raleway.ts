import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

const KM = 64;
const PTS = Array.from({ length: KM + 1 }, (_, i) => {
  const e = 180 + 160 * Math.sin(i / 9) + 90 * Math.sin(i / 3.7 + 1) + 40 * Math.sin(i / 1.6) + (i > 30 && i < 44 ? (i - 30) * 22 - Math.max(0, i - 38) * 40 : 0);
  return Math.round(Math.max(60, e));
});

@Component({
  selector: 'demo-life-bitter-raleway',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="site"><span class="logo">Gravel &amp; Grit</span><span>Routes · Kit · Stories</span></header>

        <div class="lead">
          <div>
            <p class="cat">Route guide · Peak District</p>
            <h1>The Long Causeway loop</h1>
            <p class="dek">Sixty-four kilometres of old packhorse tracks, one brutal climb out of Hathersage, and the best café stop in Derbyshire.</p>
            <p class="by">Rhys Calloway · 27 Sep 2026 · 8 min read</p>
          </div>
          <img [src]="hero" alt="Feature image for The Long Causeway loop" width="600" height="440" />
        </div>

        <dl class="stats">
          <div><dt>Distance</dt><dd>{{ km }}<small>km</small></dd></div>
          <div><dt>Climbing</dt><dd>{{ gain }}<small>m</small></dd></div>
          <div><dt>Surface</dt><dd>70<small>% gravel</small></dd></div>
          <div><dt>Moving time</dt><dd>3:40<small>h</small></dd></div>
        </dl>

        <figure class="profile">
          <figcaption>
            <span>Elevation profile</span>
            <output>km <b>{{ idx() }}</b> · <b>{{ pts[idx()] }}</b> m</output>
          </figcaption>
          <div class="plot" [class.scrub]="scrubbing()">
          <svg viewBox="0 0 640 160" preserveAspectRatio="none" tabindex="0" role="slider" aria-label="Elevation along the route" [attr.aria-valuenow]="idx()" aria-valuemin="0" [attr.aria-valuemax]="km" [attr.aria-valuetext]="'Kilometre ' + idx() + ', ' + pts[idx()] + ' metres'"
               (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event, false)" (pointercancel)="up($event, true)"
               (keydown.arrowright)="nudge(1, $event)" (keydown.arrowleft)="nudge(-1, $event)">
            <defs>
              <linearGradient id="grad-{{ uid }}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f28c28" stop-opacity=".55" /><stop offset="1" stop-color="#f28c28" stop-opacity="0" /></linearGradient>
            </defs>
            <path [attr.d]="area" [attr.fill]="'url(#grad-' + uid + ')'" />
            <path [attr.d]="line" fill="none" stroke="#f28c28" stroke-width="2" vector-effect="non-scaling-stroke" />
            <line [attr.x1]="x(idx())" [attr.x2]="x(idx())" y1="0" y2="160" stroke="#f1e9d8" stroke-width="1" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" />
          </svg>
            <span class="dot" aria-hidden="true" [style.left.%]="idx() / km * 100" [style.top.px]="y(pts[idx()]) * 150 / 160"></span>
          </div>
          <div class="axis" aria-hidden="true"><span>0</span><span>16</span><span>32</span><span>48</span><span>64 km</span></div>
        </figure>

        <div class="body">
          <p>Start from the station car park and roll east along the river before the road tips up. The climb to Stanage is two and a half kilometres at an average of eight per cent, and the last bend is steeper than it looks. Sit down, spin, and don’t look at your computer.</p>
          <p>At the top the Long Causeway itself is a joy: wide, firm and gently downhill for the best part of six kilometres, with gritstone edges on your right the whole way.</p>
        </div>

        <footer class="key" aria-label="Type specimen">
          <span class="kb">Bitter</span><span>700 / 800 · headline 34–64 px, numbers 30 px</span>
          <span class="kr">Raleway</span><span>400 / 600 · text 17 / 29 px with lining figures</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 700px; background: #1f3b2d; color: #f1e9d8; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 920px; margin: 0 auto; padding: clamp(16px, 4cqi, 36px) clamp(16px, 4cqi, 36px) 36px; }
    .site { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(241,233,216,.2); font: 400 13px/1 'Raleway', sans-serif; color: #c9c0a9; }
    .logo { font: 800 20px/1 'Bitter', serif; color: #f28c28; }
    .lead { display: grid; gap: 20px; margin-top: 26px; }
    @container (min-width: 700px) { .lead { grid-template-columns: 1.3fr 1fr; align-items: end; gap: 32px; } }
    .lead img { width: 100%; aspect-ratio: 15 / 11; object-fit: cover; border-radius: 4px; filter: saturate(.85); }
    .cat { font: 600 13px/1 'Raleway', sans-serif; color: #f28c28; }
    h1 { font-family: 'Bitter', serif; font-weight: 800; font-size: clamp(34px, 6.4cqi, 64px); line-height: 1; letter-spacing: -0.02em; margin-top: 12px; text-wrap: balance; }
    .dek { font: 400 18px/1.55 'Raleway', sans-serif; color: #ded3bb; margin-top: 14px; max-width: 46ch; font-variant-numeric: lining-nums; }
    .by { font: 400 13px/1 'Raleway', sans-serif; color: #a9a08a; margin-top: 14px; font-variant-numeric: lining-nums; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin: 26px 0 0; background: rgba(241,233,216,.15); border-radius: 6px; overflow: hidden; }
    @container (max-width: 560px) { .stats { grid-template-columns: repeat(2, 1fr); } }
    .stats div { background: #24432f; padding: 14px 16px; }
    .stats dt { font: 600 12px/1 'Raleway', sans-serif; color: #a9a08a; }
    .stats dd { margin: 8px 0 0; font: 700 30px/1 'Bitter', serif; font-variant-numeric: tabular-nums lining-nums; }
    .stats small { font: 400 13px/1 'Raleway', sans-serif; color: #c9c0a9; margin-left: 4px; }
    .profile { margin: 22px 0 0; padding: 16px; background: #183022; border-radius: 6px; }
    figcaption { display: flex; justify-content: space-between; gap: 10px; font: 600 13px/1 'Raleway', sans-serif; color: #c9c0a9; font-variant-numeric: tabular-nums lining-nums; }
    figcaption b { font: 700 15px/1 'Bitter', serif; color: #f1e9d8; }
    .plot { position: relative; margin-top: 12px; }
    .dot { position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #f1e9d8; box-shadow: 0 0 0 3px rgba(242,140,40,.5); pointer-events: none; transition: transform .15s; }
    .scrub .dot { transform: scale(1.6); }
    /* pan-y: a horizontal finger drag scrubs the profile, a vertical one still scrolls the article. */
    svg { display: block; width: 100%; height: 150px; cursor: crosshair; touch-action: pan-y; overflow: visible; -webkit-tap-highlight-color: transparent; }
    svg:focus-visible { outline: 2px solid #f28c28; outline-offset: 4px; border-radius: 4px; }
    .axis { display: flex; justify-content: space-between; font: 400 11.5px/1 'Raleway', sans-serif; color: #a9a08a; margin-top: 6px; font-variant-numeric: lining-nums; }
    .body { margin-top: 24px; max-width: 64ch; font: 400 17px/1.7 'Raleway', sans-serif; color: #ece3cf; font-variant-numeric: lining-nums; }
    .body p + p { margin-top: 1em; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 26px; padding-top: 14px; border-top: 1px solid rgba(241,233,216,.2); font: 400 12.5px/1.4 'Raleway', sans-serif; color: #a9a08a; }
    .kb { font: 800 20px/1 'Bitter', serif; color: #f28c28; }
    .kr { font: 600 17px/1 'Raleway', sans-serif; color: #f1e9d8; }
  `,
})
export class LifeBitterRaleway {
  protected readonly uid = Math.random().toString(36).slice(2, 8);
  protected readonly hero = photo('gravel-causeway', 600, 440);
  protected readonly pts = PTS;
  protected readonly km = KM;
  protected readonly gain = PTS.reduce((g, v, i) => (i && v > PTS[i - 1] ? g + v - PTS[i - 1] : g), 0);
  private readonly max = Math.max(...PTS) * 1.1;
  protected readonly idx = signal(34);
  protected readonly line = PTS.map((v, i) => `${i ? 'L' : 'M'}${this.x(i)},${this.y(v)}`).join(' ');
  protected readonly area = `${this.line} L640,160 L0,160 Z`;

  constructor() {
    loadGoogleFonts('Bitter:wght@700;800', 'Raleway:wght@400;600');
  }

  x(i: number): number {
    return (i / KM) * 640;
  }

  y(v: number): number {
    return 160 - (v / this.max) * 150;
  }

  protected readonly scrubbing = signal(false);
  private start: { id: number; x: number; y: number } | null = null;

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse') { this.set(e); return; }
    this.start = { id: e.pointerId, x: e.clientX, y: e.clientY };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  move(e: PointerEvent): void {
    // Mouse: the crosshair simply follows the pointer.
    if (e.pointerType === 'mouse') { this.set(e); return; }
    const s = this.start;
    if (!s || s.id !== e.pointerId) return;
    if (!this.scrubbing()) {
      const dx = Math.abs(e.clientX - s.x);
      if (dx < 6 || dx < Math.abs(e.clientY - s.y)) return;
      this.scrubbing.set(true);
    }
    this.set(e);
  }

  up(e: PointerEvent, cancelled: boolean): void {
    const s = this.start;
    if (s && s.id === e.pointerId && !cancelled && !this.scrubbing()) this.set(e); // a tap jumps to that kilometre
    this.start = null;
    this.scrubbing.set(false);
  }

  private set(e: PointerEvent): void {
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * KM);
    this.idx.set(Math.min(KM, Math.max(0, i)));
  }

  nudge(d: number, e: Event): void {
    e.preventDefault();
    this.idx.set(Math.min(KM, Math.max(0, this.idx() + d)));
  }
}
