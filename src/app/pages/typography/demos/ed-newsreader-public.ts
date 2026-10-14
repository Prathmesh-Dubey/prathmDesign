import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Bar { t: string; cop: number; }

@Component({
  selector: 'demo-ed-newsreader-public',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="brand">Grid Notes</span>
          <span class="tag">Explainer</span>
          <span class="updated">Updated 9 Oct 2026, 08:40</span>
        </header>

        <h1>Why your heat pump hates the cold <em>less</em> than you’ve been told</h1>
        <p class="stand">The efficiency drop at −10 °C is real, but it is smaller, and easier to plan around, than the forum threads suggest.</p>

        <div class="meta">
          <span>By <strong>Elif Şahin</strong>, energy correspondent</span>
          <div class="mode" role="tablist" aria-label="Reading length">
            <button type="button" role="tab" [attr.aria-selected]="mode() === 'brief'" [class.on]="mode() === 'brief'" (click)="mode.set('brief')">Brief · 2 min</button>
            <button type="button" role="tab" [attr.aria-selected]="mode() === 'full'" [class.on]="mode() === 'full'" (click)="mode.set('full')">Full story · 9 min</button>
          </div>
        </div>

        <section class="points" aria-label="Key points">
          <h2>The short version</h2>
          <ul>
            <li>Modern air-source units still deliver about <b>2.3 kWh of heat per kWh</b> of electricity at −10 °C.</li>
            <li>Most UK homes see fewer than <b>ten days a year</b> that cold.</li>
            <li>Sizing and radiator flow temperature matter more than the outdoor reading.</li>
          </ul>
        </section>

        @if (mode() === 'full') {
          <div class="body">
            <p>Every winter the same chart does the rounds: a line that slopes downward as the thermometer falls, labelled with something ominous like “efficiency collapse.” The line is accurate. The caption is not.</p>
            <figure class="chart">
              <figcaption>Coefficient of performance by outdoor temperature, 7 kW air-source unit, 45 °C flow</figcaption>
              <div class="bars">
                @for (b of bars; track b.t) {
                  <div class="b">
                    <span class="v">{{ b.cop.toFixed(1) }}</span>
                    <span class="fill" [style.height.%]="b.cop / 5 * 100"></span>
                    <span class="t">{{ b.t }}</span>
                  </div>
                }
              </div>
              <p class="src">Source: manufacturer test data, EN 14511. Values rounded.</p>
            </figure>
            <p>A coefficient of performance, or COP, is simply heat out divided by electricity in. A gas boiler, by this measure, peaks a little under 1. So when a heat pump slides from 4.1 on a mild day to 2.3 in a hard frost, it is moving from extraordinary to merely very good.</p>
            <h3>What actually goes wrong</h3>
            <p>Where installations disappoint, the culprit is usually upstream of the weather: a unit sized for an average day rather than a design day, or radiators too small to work at a low flow temperature. Fix those, and the cold snap becomes a line on the bill rather than a crisis.</p>
          </div>
        } @else {
          <p class="brief">That’s the gist. Switch to the full story for the test data, a chart of how efficiency changes from 7 °C to −15 °C, and what installers say causes most cold-weather complaints.</p>
        }

        <footer class="key" aria-label="Type specimen">
          <p class="k1"><span>Newsreader</span> Display opsz 72 · Light 300 with italic emphasis</p>
          <p class="k2"><span>Newsreader</span> Text opsz 16 · Regular 400, 18 / 30</p>
          <p class="k3"><span>Public Sans</span> 400–700 · labels, data, navigation</p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 640px; background: #eaf0f2; color: #0f2233; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; padding: clamp(12px, 3cqi, 28px); }
    .wrap { background: #fff; max-width: 820px; margin: 0 auto; padding: clamp(20px, 5cqi, 48px); border-radius: 4px; box-shadow: 0 1px 0 rgba(15,34,51,.06); }
    .top { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; font: 500 13px/1 'Public Sans', sans-serif; }
    .brand { font-weight: 800; letter-spacing: -0.01em; font-size: 15px; }
    .tag { background: #0b7a75; color: #fff; padding: 4px 8px; border-radius: 3px; font-weight: 600; font-size: 12px; }
    .updated { color: #5b6b78; margin-left: auto; font-variant-numeric: tabular-nums; }
    h1 { font-family: 'Newsreader', serif; font-optical-sizing: auto; font-weight: 300; font-size: clamp(34px, 6.2cqi, 60px); line-height: 1.04; letter-spacing: -0.02em; margin-top: 26px; text-wrap: balance; max-width: 18ch; }
    h1 em { font-style: italic; font-weight: 400; color: #0b7a75; }
    .stand { font: 400 clamp(18px, 2.3cqi, 21px)/1.45 'Newsreader', serif; color: #3a4b59; margin-top: 16px; max-width: 54ch; text-wrap: pretty; }
    .meta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-top: 24px; padding: 14px 0; border-top: 1px solid #dfe6ea; border-bottom: 1px solid #dfe6ea; font: 400 14px/1.3 'Public Sans', sans-serif; color: #3a4b59; }
    .mode { display: inline-flex; background: #eaf0f2; border-radius: 999px; padding: 3px; }
    .mode button { font: 600 13px/1 'Public Sans', sans-serif; border: 0; background: transparent; padding: 8px 13px; border-radius: 999px; cursor: pointer; color: #3a4b59; transition: background .2s, color .2s; }
    .mode button.on { background: #0f2233; color: #fff; }
    .points { margin-top: 24px; background: #f2f8f7; border-left: 3px solid #0b7a75; padding: 18px 20px; }
    .points h2 { font: 700 14px/1 'Public Sans', sans-serif; color: #0b7a75; }
    .points ul { margin: 12px 0 0; padding-left: 18px; font: 400 15.5px/1.5 'Public Sans', sans-serif; display: grid; gap: 8px; }
    .points b { font-weight: 700; }
    .body, .brief { font-family: 'Newsreader', serif; font-optical-sizing: auto; font-size: 18.5px; line-height: 1.62; max-width: 64ch; margin-top: 26px; animation: in .35s ease-out; }
    .body p { text-wrap: pretty; }
    .body p + p, .body h3 + p { margin-top: 1em; }
    .brief { color: #3a4b59; font-style: italic; }
    .body h3 { font: 700 19px/1.3 'Public Sans', sans-serif; margin-top: 1.6em; letter-spacing: -0.01em; }
    .chart { margin: 26px 0; font-family: 'Public Sans', sans-serif; }
    .chart figcaption { font-size: 13.5px; font-weight: 600; }
    .bars { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; height: 170px; margin-top: 14px; align-items: end; border-bottom: 1px solid #0f2233; }
    .b { display: flex; flex-direction: column; justify-content: flex-end; height: 100%; text-align: center; position: relative; }
    .fill { display: block; background: linear-gradient(#0b7a75, #3fb2a7); border-radius: 3px 3px 0 0; transform-origin: bottom; animation: grow .6s cubic-bezier(.2,.8,.2,1) both; }
    .v { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; padding-bottom: 4px; }
    .t { position: absolute; bottom: -22px; left: 0; right: 0; font-size: 12.5px; color: #5b6b78; font-variant-numeric: tabular-nums; }
    .src { margin-top: 30px; font-size: 12px; color: #5b6b78; }
    .key { margin-top: 32px; padding-top: 16px; border-top: 1px solid #dfe6ea; display: grid; gap: 6px; font: 400 12.5px/1.4 'Public Sans', sans-serif; color: #5b6b78; }
    .key span { color: #0f2233; margin-right: 6px; }
    .k1 span { font: 300 italic 18px/1 'Newsreader', serif; }
    .k2 span { font: 400 16px/1 'Newsreader', serif; }
    .k3 span { font-weight: 700; }
    .mode button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .mode button:not(.on):active { background: #d6e1e5; }
    @media (pointer: coarse) { .mode button { min-height: 40px; padding: 0 15px; } }
    @container (max-width: 520px) { .points ul { font-size: 16px; } .updated { margin-left: 0; } }
    @keyframes grow { from { transform: scaleY(0); } }
    @keyframes in { from { opacity: 0; transform: translateY(6px); } }
    @media (prefers-reduced-motion: reduce) { .fill, .body, .brief { animation: none; } }
  `,
})
export class EdNewsreaderPublic {
  protected readonly mode = signal<'brief' | 'full'>('full');
  protected readonly bars: Bar[] = [
    { t: '7 °C', cop: 4.1 },
    { t: '2 °C', cop: 3.4 },
    { t: '−5 °C', cop: 2.8 },
    { t: '−10 °C', cop: 2.3 },
    { t: '−15 °C', cop: 1.9 },
  ];

  constructor() {
    loadGoogleFonts('Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700', 'Public+Sans:wght@400;500;600;700;800');
  }
}
