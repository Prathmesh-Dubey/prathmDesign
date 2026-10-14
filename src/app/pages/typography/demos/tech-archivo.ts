import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Lib { name: string; lang: string; mbs: number; mem: number; }
type Metric = 'mbs' | 'mem';

@Component({
  selector: 'demo-tech-archivo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="logo">BENCH/PRESS</span>
          <span>Hardware notes · No. 64</span>
        </header>

        <h1>We benchmarked nine JSON parsers on a Raspberry Pi 5</h1>
        <p class="dek">Same 180 MB file, same SD card, 30 runs each. The fastest was <b>14× quicker</b> than the slowest — and the memory story flips the ranking.</p>
        <p class="by">Signe Aalto &amp; Bram Visser · 8 Oct 2026 · 10 min</p>

        <figure class="chart">
          <div class="chart-head">
            <figcaption>{{ metric() === 'mbs' ? 'Parse throughput, MB/s (higher is better)' : 'Peak memory, MB (lower is better)' }}</figcaption>
            <div class="seg" role="tablist" aria-label="Metric">
              <button type="button" role="tab" [attr.aria-selected]="metric() === 'mbs'" [class.on]="metric() === 'mbs'" (click)="metric.set('mbs')">Throughput</button>
              <button type="button" role="tab" [attr.aria-selected]="metric() === 'mem'" [class.on]="metric() === 'mem'" (click)="metric.set('mem')">Memory</button>
            </div>
          </div>
          <ol class="bars">
            @for (l of sorted(); track l.name; let i = $index) {
              <li [style.--w]="pct(l)" [class.top]="i === 0">
                <span class="nm">{{ l.name }} <small>{{ l.lang }}</small></span>
                <span class="track"><span class="fill"></span></span>
                <span class="val">{{ metric() === 'mbs' ? l.mbs : l.mem }}</span>
              </li>
            }
          </ol>
          <p class="note">Median of 30 runs. Pi 5, 8 GB, 64-bit OS, performance governor, 22 °C ambient with active cooler.</p>
        </figure>

        <div class="body">
          <p>Throughput is the number everyone quotes, and SIMD-accelerated parsers win it easily. But on an 8 GB board running other services, the parser that builds a full DOM can be the one that pushes you into swap.</p>
          <p>Toggle the chart to memory and the order nearly reverses: the streaming parsers peak below 20 MB while the fastest DOM builders need several times the file size.</p>
        </div>

        <footer class="key" aria-label="Type specimen">
          <div><span class="kb">Archivo Black</span><small>Headline · 400 · 34–68 px</small></div>
          <div><span class="kw">Archivo <em>wdth 62–125</em></span><small>Body at 100, labels at 75, logo at 125</small></div>
          <div class="widths" aria-hidden="true"><span style="font-stretch:62%">Rr</span><span style="font-stretch:87.5%">Rr</span><span style="font-stretch:100%">Rr</span><span style="font-stretch:125%">Rr</span></div>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #ffffff; color: #111; container-type: inline-size; font-family: 'Archivo', sans-serif; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 860px; margin: 0 auto; padding: clamp(18px, 4cqi, 40px) clamp(16px, 4cqi, 36px) 36px; }
    .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 6px solid #111; font-size: 12.5px; font-stretch: 75%; font-weight: 600; }
    .logo { font-stretch: 125%; font-weight: 900; font-size: 15px; letter-spacing: .02em; background: #ffcc00; padding: 4px 8px; }
    h1 { font-family: 'Archivo Black', sans-serif; font-weight: 400; font-size: clamp(32px, 6.6cqi, 66px); line-height: .98; letter-spacing: -0.03em; margin-top: 24px; text-wrap: balance; max-width: 18ch; }
    .dek { font-size: clamp(17px, 2.2cqi, 20px); line-height: 1.5; margin-top: 16px; max-width: 58ch; color: #2b2b2b; }
    .dek b { font-weight: 800; background: linear-gradient(transparent 60%, #ffcc00 60%); }
    .by { font-size: 13px; font-stretch: 75%; font-weight: 500; color: #666; margin-top: 12px; }
    .chart { margin: 28px 0 0; padding: 18px; background: #f5f5f2; border: 2px solid #111; }
    .chart-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; }
    figcaption { font-weight: 700; font-size: 14px; font-stretch: 87.5%; }
    .seg { display: inline-flex; border: 2px solid #111; }
    .seg button { font: inherit; font-weight: 700; font-size: 12.5px; font-stretch: 75%; border: 0; background: #fff; padding: 7px 12px; cursor: pointer; }
    .seg button.on { background: #111; color: #ffcc00; }
    .bars { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 7px; }
    .bars li { display: grid; grid-template-columns: minmax(110px, 160px) 1fr 52px; gap: 10px; align-items: center; }
    .nm { font-size: 13.5px; font-weight: 600; font-stretch: 75%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nm small { font-weight: 400; color: #777; }
    .track { height: 18px; background: #e4e4df; }
    .fill { display: block; height: 100%; width: calc(var(--w) * 1%); background: #111; transition: width .6s cubic-bezier(.2,.8,.2,1); }
    .top .fill { background: #ffcc00; box-shadow: inset 0 0 0 2px #111; }
    .val { font-weight: 800; font-size: 14px; font-stretch: 75%; text-align: right; font-variant-numeric: tabular-nums; }
    .note { font-size: 12px; font-stretch: 87.5%; color: #666; margin-top: 14px; }
    .body { margin-top: 24px; max-width: 64ch; font-size: 16.5px; line-height: 1.65; }
    .body p + p { margin-top: 1em; }
    .key { display: flex; flex-wrap: wrap; gap: 14px 28px; align-items: end; margin-top: 30px; padding-top: 14px; border-top: 2px solid #111; }
    .key div { display: grid; gap: 4px; }
    .key small { font-size: 12px; font-stretch: 75%; color: #666; }
    .kb { font: 400 22px/1 'Archivo Black', sans-serif; }
    .kw { font-size: 20px; font-weight: 500; }
    .kw em { font-style: normal; font-size: 12px; font-stretch: 75%; color: #666; }
    .widths { display: flex !important; gap: 10px; font-size: 28px; font-weight: 700; margin-left: auto; }
    .seg button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .seg button:not(.on):active { background: #e4e4df; }
    @media (pointer: coarse) { .seg button { min-height: 40px; padding: 0 14px; } }
    /* Phones: library name sits above its bar so neither gets squeezed. */
    @container (max-width: 480px) {
      .chart { padding: 14px; }
      .bars { gap: 10px; }
      .bars li { grid-template-columns: 1fr 48px; gap: 3px 10px; }
      .nm { grid-column: 1 / -1; }
      .widths { margin-left: 0; }
    }
    @media (prefers-reduced-motion: reduce) { .fill { transition: none; } }
  `,
})
export class TechArchivo {
  protected readonly metric = signal<Metric>('mbs');
  private readonly libs: Lib[] = [
    { name: 'simdjson', lang: 'C++', mbs: 1120, mem: 410 },
    { name: 'sonic-rs', lang: 'Rust', mbs: 980, mem: 380 },
    { name: 'yyjson', lang: 'C', mbs: 940, mem: 352 },
    { name: 'serde_json', lang: 'Rust', mbs: 410, mem: 290 },
    { name: 'orjson', lang: 'Python', mbs: 360, mem: 330 },
    { name: 'RapidJSON SAX', lang: 'C++', mbs: 300, mem: 12 },
    { name: 'jsoniter', lang: 'Go', mbs: 240, mem: 260 },
    { name: 'ijson', lang: 'Python', mbs: 95, mem: 18 },
    { name: 'JSON.parse', lang: 'Node', mbs: 80, mem: 540 },
  ];
  protected readonly sorted = computed(() => {
    const m = this.metric();
    return [...this.libs].sort((a, b) => (m === 'mbs' ? b.mbs - a.mbs : a.mem - b.mem));
  });
  private readonly max = computed(() => Math.max(...this.libs.map((l) => l[this.metric()])));

  constructor() {
    loadGoogleFonts('Archivo+Black', 'Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900');
  }

  pct(l: Lib): number {
    return Math.max(2, (l[this.metric()] / this.max()) * 100);
  }
}
