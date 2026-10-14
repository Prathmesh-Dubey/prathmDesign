import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';

interface Pic {
  id: number;
  title: string;
  ar: number;
  src: string;
}

interface Row {
  h: number;
  items: Pic[];
}

const PICS: [string, number][] = [
  ['Philosopher’s Path', 1.5], ['Gion, Hanami-kōji', 0.67], ['Kiyomizu-dera', 1.78], ['Arashiyama', 1],
  ['Fushimi Inari', 0.75], ['Kamo River', 2.2], ['Nanzen-ji aqueduct', 1.33], ['Pontochō alley', 0.8],
  ['Heian Shrine garden', 1.5], ['Daigo-ji pagoda', 0.66], ['Okazaki canal', 2.4], ['Nishiki Market', 1.25],
  ['Ginkaku-ji sand', 1.5], ['Tō-ji at dusk', 0.7], ['Hirano Shrine', 1.6], ['Maruyama Park', 1],
  ['Kurama station', 1.33], ['Kifune lanterns', 0.75], ['Uji tea fields', 2], ['Shirakawa bridge', 1.4],
];

@Component({
  selector: 'demo-justified-rows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <h3>Kyoto, early April</h3>
        <p>Haruto Mori · 20 frames · {{ rows().length }} justified rows</p>
      </div>
      <label class="ctl">
        <span>Row height <b>{{ target() }}px</b></span>
        <input type="range" min="110" max="260" step="10" [value]="target()" (input)="setTarget($event)" aria-label="Target row height" />
      </label>
    </header>
    <div class="scroller" #scroller tabindex="0" aria-label="Kyoto photographs, scrollable">
      @for (row of rows(); track $index) {
        <div class="row" [style.height.px]="row.h">
          @for (p of row.items; track p.id) {
            <figure [style.width.px]="p.ar * row.h" [class.open]="open() === p.id" (click)="toggle(p.id)">
              <img [src]="p.src" [alt]="'Photograph ' + (p.id + 1) + ' — ' + p.title + ', Kyoto'" loading="lazy" />
              <figcaption>{{ p.title }}</figcaption>
            </figure>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: grid; grid-template-rows: auto 1fr; height: 580px; background: #fbfbfa; color: #1e1e1e; container-type: inline-size; }
    header { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; padding: 22px clamp(14px, 3cqw, 28px) 16px; }
    h3 { font-family: var(--font-display); font-weight: 500; font-size: clamp(22px, 3.2cqw, 30px); letter-spacing: -0.02em; }
    header p { font-size: 13px; color: #77736e; margin-top: 3px; }
    .ctl { display: grid; gap: 6px; font-size: 12px; color: #77736e; min-width: 200px; }
    .ctl b { color: #c2185b; font-family: var(--font-mono); font-weight: 500; }
    input[type=range] { accent-color: #c2185b; width: 100%; touch-action: pan-y; }
    @media (pointer: coarse) { input[type=range] { height: 32px; } }
    @container (max-width: 480px) { .ctl { min-width: 0; width: 100%; } }
    .scroller { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 0 clamp(14px, 3cqw, 28px) 20px; scrollbar-width: thin; }
    .scroller:focus-visible { outline: 2px solid #c2185b; outline-offset: -3px; }
    .row { display: flex; gap: 6px; margin-bottom: 6px; transition: height .35s cubic-bezier(.2,.7,.2,1); }
    figure { position: relative; margin: 0; flex: 0 1 auto; min-width: 0; overflow: hidden; background: #ecebe8; border-radius: 3px;
      transition: width .35s cubic-bezier(.2,.7,.2,1); }
    img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
    figcaption { position: absolute; left: 8px; bottom: 8px; padding: 4px 9px; border-radius: 99px; background: rgba(255,255,255,.92); color: #1e1e1e;
      font-size: 12px; font-weight: 500; white-space: nowrap; opacity: 0; transform: translateY(6px); transition: opacity .25s, transform .25s;
      max-width: calc(100% - 16px); overflow: hidden; text-overflow: ellipsis; }
    figure { -webkit-tap-highlight-color: transparent; }
    figure:hover img, figure.open img { transform: scale(1.05); }
    figure:hover figcaption, figure.open figcaption { opacity: 1; transform: none; }
    /* touch: titles always readable; tap a frame to zoom it */
    @media (hover: none) {
      figure:hover:not(.open) img { transform: none; }
      figcaption { opacity: 1; transform: none; font-size: 11px; padding: 3px 8px; left: 6px; bottom: 6px; max-width: calc(100% - 12px); }
    }
  `,
})
export class JustifiedRows {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly destroyRef = inject(DestroyRef);
  private readonly width = signal(0);
  protected readonly target = signal(170);
  /** frame zoomed by tap */
  protected readonly open = signal<number | null>(null);

  toggle(id: number): void {
    this.open.update((cur) => (cur === id ? null : id));
  }
  private readonly gap = 6;
  private readonly pics: Pic[] = PICS.map(([title, ar], id) => ({
    id, title, ar, src: photo('kyoto-april-' + id, Math.round(ar * 400), 400),
  }));

  /** Greedy Flickr-style justification: fill each row until it overflows, then scale it to fit exactly. */
  protected readonly rows = computed<Row[]>(() => {
    const W = this.width();
    const target = this.target();
    if (W <= 0) return [];
    const rows: Row[] = [];
    let row: Pic[] = [];
    let sum = 0;
    for (const p of this.pics) {
      row.push(p);
      sum += p.ar;
      const natural = sum * target + this.gap * (row.length - 1);
      if (natural >= W) {
        const h = (W - this.gap * (row.length - 1)) / sum;
        rows.push({ h: Math.floor(h * 100) / 100, items: row });
        row = [];
        sum = 0;
      }
    }
    if (row.length) rows.push({ h: Math.min(target, (W - this.gap * (row.length - 1)) / sum), items: row });
    return rows;
  });

  constructor() {
    afterNextRender(() => {
      const el = this.scroller().nativeElement;
      const measure = () => {
        const cs = getComputedStyle(el);
        // clientWidth excludes the scrollbar, so rows never trigger horizontal overflow
        this.width.set(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  setTarget(e: Event): void {
    this.target.set(+(e.target as HTMLInputElement).value);
  }
}
