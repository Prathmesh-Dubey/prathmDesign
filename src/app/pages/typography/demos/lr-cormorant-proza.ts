import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Block { p: string; note?: string; n?: number; h?: string; }

@Component({
  selector: 'demo-lr-cormorant-proza',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller (scroll)="onScroll()">
      <div class="progress" role="progressbar" aria-label="Reading progress" [attr.aria-valuenow]="pct()" aria-valuemin="0" aria-valuemax="100">
        <span class="fill" [style.transform]="'scaleX(' + progress() + ')'"></span>
        <span class="left">{{ minsLeft() }} min left</span>
      </div>

      <header class="title">
        <p class="series">The Long Read · Oceans</p>
        <h1>The Cartographers of the <em>Seafloor</em></h1>
        <p class="dek">Less than a third of the ocean floor has been mapped in detail. A small fleet of survey ships — and a great many volunteers — are trying to finish the job by 2030.</p>
        <p class="by">By Ilse Vandermeer · 16 October 2026 · 22 minutes</p>
      </header>

      <article>
        @for (b of blocks; track $index) {
          @if (b.h) {
            <h2>{{ b.h }}</h2>
          }
          <div class="row">
            <p class="txt">{{ b.p }}@if (b.n) {<button type="button" class="mk" (click)="toggle(b.n)" [attr.aria-expanded]="open().has(b.n)" [attr.aria-label]="'Note ' + b.n">{{ b.n }}</button>}</p>
            @if (b.note) {
              <aside class="side" [class.open]="open().has(b.n!)"><span class="sn">{{ b.n }}</span>{{ b.note }}</aside>
            }
          </div>
        }
      </article>

      <footer class="key" aria-label="Type specimen">
        <p><span class="kc">Cormorant Garamond</span> Light 300 &amp; italic · display 48–96 px, tight leading</p>
        <p><span class="kp">Proza Libre</span> 400 / 500 · text 17 px on 1.75, sidenotes 13.5 px</p>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 700px; background: #f3f5f4; color: #12232e; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .progress { position: sticky; top: 0; z-index: 2; height: 30px; background: rgba(243,245,244,.94); backdrop-filter: blur(6px); border-bottom: 1px solid #d9e1e0; }
    .fill { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: #1e6f8c; transform-origin: left; }
    .left { position: absolute; right: 16px; top: 8px; font: 500 12px/1 'Proza Libre', sans-serif; color: #5b6e78; font-variant-numeric: tabular-nums; }
    .title { max-width: 900px; margin: 0 auto; padding: clamp(28px, 6cqi, 64px) clamp(18px, 5cqi, 48px) 10px; text-align: center; }
    .series { font: 500 13px/1 'Proza Libre', sans-serif; color: #1e6f8c; }
    h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(44px, 9cqi, 96px); line-height: .92; letter-spacing: -0.02em; margin-top: 16px; text-wrap: balance; }
    h1 em { font-style: italic; font-weight: 400; color: #1e6f8c; }
    .dek { font: 400 italic clamp(19px, 2.6cqi, 24px)/1.4 'Cormorant Garamond', serif; color: #33495a; margin: 20px auto 0; max-width: 46ch; text-wrap: balance; }
    .by { font: 400 13px/1 'Proza Libre', sans-serif; color: #5b6e78; margin-top: 18px; }
    article { max-width: 960px; margin: 24px auto 0; padding: 0 clamp(18px, 5cqi, 48px); }
    h2 { font: 400 italic clamp(26px, 3.6cqi, 34px)/1.2 'Cormorant Garamond', serif; margin: 34px 0 6px; color: #1e6f8c; max-width: 62ch; }
    .row { display: grid; gap: 0 36px; }
    @container (min-width: 820px) {
      .row { grid-template-columns: minmax(0, 62ch) 220px; }
      .side { display: block !important; grid-column: 2; border-top: 1px solid #c9d5d6; padding-top: 8px; margin-top: 6px; }
      .mk { pointer-events: none; }
    }
    .txt { font: 400 17px/1.78 'Proza Libre', sans-serif; margin-top: 1em; text-wrap: pretty; hanging-punctuation: first; }
    .row:first-of-type .txt::first-letter { font-family: 'Cormorant Garamond', serif; font-weight: 500; float: left; font-size: 4.6em; line-height: .78; margin: .08em .1em 0 0; color: #1e6f8c; }
    .mk { font: 500 10.5px/1 'Proza Libre', sans-serif; vertical-align: super; border: 0; background: none; color: #1e6f8c; padding: 0 2px; cursor: pointer; }
    .side { display: none; font: 400 13.5px/1.55 'Proza Libre', sans-serif; color: #4a5e69; align-self: start; margin-top: 1.2em; }
    .side.open { display: block; background: #e6eeee; padding: 10px 12px; border-radius: 6px; animation: in .25s ease-out; }
    .sn { font-weight: 500; color: #1e6f8c; margin-right: 6px; }
    .key { max-width: 960px; margin: 40px auto 0; padding: 18px clamp(18px, 5cqi, 48px) 34px; border-top: 1px solid #d9e1e0; display: grid; gap: 6px; font: 400 12.5px/1.4 'Proza Libre', sans-serif; color: #5b6e78; }
    .kc { font: 300 21px/1 'Cormorant Garamond', serif; color: #12232e; margin-right: 6px; }
    .kp { font: 500 15px/1 'Proza Libre', sans-serif; color: #12232e; margin-right: 6px; }
    .mk { position: relative; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    /* Tiny superscript marker, finger-sized hit area. */
    .mk::after { content: ''; position: absolute; inset: -12px -10px; }
    @container (max-width: 819px) {
      .mk { font-size: 11px; min-width: 18px; height: 18px; padding: 0 5px; margin-left: 3px; border-radius: 999px; background: #dfe9ea; }
      .mk[aria-expanded='true'] { background: #1e6f8c; color: #fff; }
      .side { font-size: 15px; }
    }
    @keyframes in { from { opacity: 0; transform: translateY(-4px); } }
    @media (prefers-reduced-motion: reduce) { .side.open { animation: none; } }
  `,
})
export class LrCormorantProza {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  protected readonly progress = signal(0);
  protected readonly pct = computed(() => Math.round(this.progress() * 100));
  protected readonly minsLeft = computed(() => Math.max(1, Math.ceil(22 * (1 - this.progress()))));
  protected readonly open = signal<Set<number>>(new Set());
  protected readonly blocks: Block[] = [
    { p: 'The ship’s echo sounder pings every two seconds, and every two seconds a thin line on the monitor stutters forward across a blank screen. On the bridge of the RV Halcyon, a hundred and forty miles west of Cape Verde, nobody looks at it much. It has been drawing the same flat plain for nine hours.', n: 1, note: 'Modern multibeam sonar sends a fan of up to 512 beams, covering a swathe several times wider than the water is deep.' },
    { p: 'Then, a little after midnight, the line lifts. A slope appears, then a shoulder, then the unmistakable cone of a seamount no chart has ever recorded — 2,300 metres tall, its summit still a kilometre and a half below the keel.' },
    { h: 'A map of the Moon, but not of home', p: 'We have better maps of Mars than of our own seabed. The comparison is a cliché among hydrographers, and they repeat it with a mixture of embarrassment and pride, because it is true and because they are the ones fixing it.', n: 2, note: 'As of mid-2026, roughly 27% of the ocean floor had been mapped at modern resolution, according to the Seabed 2030 project.' },
    { p: 'The project they belong to, Seabed 2030, has no fleet of its own. It stitches together data from navies, research institutes, cable-laying companies and — increasingly — fishing boats and yachts that carry inexpensive loggers and upload what they find.', n: 3, note: 'Crowdsourced depth data must be corrected for tide, vessel draft and sound speed before it can be used.' },
    { p: 'It is slow, unglamorous work. It is also, the people doing it insist, the most exciting job in science: every survey line has a chance, however small, of finding a mountain.' },
  ];

  constructor() {
    loadGoogleFonts('Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400', 'Proza+Libre:wght@400;500');
  }

  onScroll(): void {
    const el = this.scroller().nativeElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
  }

  toggle(n: number): void {
    const s = new Set(this.open());
    if (s.has(n)) s.delete(n); else s.add(n);
    this.open.set(s);
  }
}
