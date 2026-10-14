import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Item {
  id: number;
  title: string;
  by: string;
  handle: string;
  hue: number;
  ratio: number; // h / w
  src: string;
}

const RAW: [string, string, string, number, number][] = [
  ['Shinjuku, 2:14am', 'Kenji Arai', '@kenji.a', 210, 1.4],
  ['Canal Street rain', 'Dee Okafor', '@deeok', 12, 0.7],
  ['Kowloon stairwell', 'Mei Lam', '@meilam', 330, 1.25],
  ['Belleville corner', 'Lucien Varga', '@lvarga', 40, 0.62],
  ['Mexico City, Roma Nte', 'Itzel Cruz', '@itzelcruz', 160, 1.0],
  ['Bus stop, Govan', 'Fraser Nimmo', '@nimmo', 260, 1.5],
  ['Istanbul ferry deck', 'Selin Aydın', '@selin.a', 190, 0.75],
  ['Hanoi Old Quarter', 'Linh Phạm', '@linhpham', 95, 1.33],
  ['Chinatown, SF', 'Rosa Delgado', '@rosad', 0, 0.66],
  ['Naples, Quartieri', 'Marco Esposito', '@mesposito', 50, 1.2],
  ['Seoul, Euljiro', 'Ji-woo Han', '@jiwoo', 280, 0.8],
  ['Havana, Malecón', 'Yanelis Pérez', '@yanelis', 175, 1.45],
  ['Marrakech medina', 'Omar Benali', '@obenali', 25, 0.9],
  ['Brooklyn, J train', 'Dee Okafor', '@deeok', 12, 1.3],
  ['Kolkata, College St', 'Arnab Sen', '@arnabsen', 120, 0.68],
  ['Berlin, Kottbusser Tor', 'Lena Vogt', '@lenavogt', 230, 1.1],
];

@Component({
  selector: 'demo-masonry-stagger-credits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <h3>Street Index</h3>
        <p>16 frames · 15 photographers · community picks this week</p>
      </div>
      <button type="button" (click)="shuffle()">Shuffle picks</button>
    </header>
    <div class="scroller" #scroller tabindex="0" aria-label="Street photography picks, scrollable">
      <div class="cols" [style.--cols]="cols()">
        @for (col of columns(); track $index) {
          <div class="col">
            @for (it of col; track it.id) {
              <figure class="card" [class.in]="loaded().has(it.id)" [style.--d]="order().indexOf(it.id) * 55 + 'ms'">
                <div class="ph" [style.aspect-ratio]="'1 / ' + it.ratio">
                  <img [src]="it.src" [alt]="it.title + ' — photograph by ' + it.by" (load)="markLoaded(it.id)" (error)="markLoaded(it.id)" />
                </div>
                <figcaption>
                  <span class="av" [style.--h]="it.hue" aria-hidden="true">{{ initials(it.by) }}</span>
                  <span class="txt"><strong>{{ it.title }}</strong><span>{{ it.by }} <em>{{ it.handle }}</em></span></span>
                </figcaption>
              </figure>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: grid; grid-template-rows: auto 1fr; height: 620px; background: #0f0f12; color: #ececf1; container-type: inline-size;
      font-family: 'Space Grotesk', var(--font-body); }
    header { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 20px clamp(14px, 3cqw, 28px) 14px; }
    h3 { font-size: clamp(22px, 3.2cqw, 32px); font-weight: 700; letter-spacing: -0.03em; }
    header p { font-size: 12.5px; color: #8b8b98; margin-top: 3px; }
    header button { flex: none; height: 36px; padding: 0 16px; border-radius: 999px; border: 1px solid #34343d; background: #1b1b21; color: #fff; font-size: 13px; cursor: pointer; transition: background .2s, border-color .2s; }
    header button:hover { background: #26262e; border-color: #ffd23f; }
    header button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    header button:active { background: #26262e; border-color: #ffd23f; transform: scale(.96); }
    @media (pointer: coarse) { header button { height: 40px; } }
    @container (max-width: 420px) { header { align-items: flex-start; } figcaption { gap: 8px; padding: 8px 9px 10px; } .av { width: 26px; height: 26px; font-size: 10px; } }
    .scroller { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 0 clamp(14px, 3cqw, 28px) 24px; scrollbar-width: thin; scrollbar-color: #33333b transparent; }
    .scroller:focus-visible { outline: 2px solid #ffd23f; outline-offset: -3px; }
    .cols { display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 12px; align-items: start; }
    .col { display: grid; gap: 12px; }
    .card { margin: 0; background: #17171c; border-radius: 12px; overflow: hidden; border: 1px solid #222229;
      opacity: 0; transform: translateY(26px) scale(.97); }
    .card.in { animation: rise .7s cubic-bezier(.2,.8,.2,1) var(--d) both; }
    @keyframes rise { from { opacity: 0; transform: translateY(26px) scale(.97); } to { opacity: 1; transform: none; } }
    .ph { background: linear-gradient(110deg, #1c1c22 30%, #26262e 50%, #1c1c22 70%); background-size: 200% 100%; }
    .ph img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
    .card:hover img { transform: scale(1.04); }
    figcaption { display: flex; gap: 10px; align-items: center; padding: 10px 12px 12px; }
    .av { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700;
      background: hsl(var(--h) 70% 62%); color: #111; }
    .txt { display: grid; min-width: 0; font-size: 12px; }
    .txt strong { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .txt span { color: #9a9aa6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .txt em { font-style: normal; color: #ffd23f; }
  `,
})
export class MasonryStaggerCredits {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly width = signal(900);
  private readonly items: Item[] = RAW.map(([title, by, handle, hue, ratio], id) => ({
    id, title, by, handle, hue, ratio, src: photo('street-index-' + id, 500, Math.round(500 * ratio)),
  }));
  protected readonly order = signal<number[]>(this.items.map((i) => i.id));
  protected readonly loaded = signal<Set<number>>(new Set());
  protected readonly cols = computed(() => {
    const w = this.width();
    return w < 460 ? 2 : w < 760 ? 3 : 4;
  });
  /** Shortest-column-first distribution so reading order stays left-to-right. */
  protected readonly columns = computed(() => {
    const n = this.cols();
    const cols: Item[][] = Array.from({ length: n }, () => []);
    const heights = new Array<number>(n).fill(0);
    for (const id of this.order()) {
      const it = this.items[id];
      const c = heights.indexOf(Math.min(...heights));
      cols[c].push(it);
      heights[c] += it.ratio + 0.22;
    }
    return cols;
  });

  constructor() {
    loadGoogleFonts('Space+Grotesk:wght@400;500;700');
    afterNextRender(() => {
      const el = this.scroller().nativeElement;
      const ro = new ResizeObserver(([e]) => this.width.set(e.contentRect.width));
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  private readonly destroyRef = inject(DestroyRef);

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2);
  }

  markLoaded(id: number): void {
    if (this.loaded().has(id)) return;
    this.loaded.update((s) => new Set(s).add(id));
  }

  shuffle(): void {
    const ids = [...this.order()];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    // replay the entrance: hide, reorder, then reveal on the next frame
    const all = new Set(this.loaded());
    this.loaded.set(new Set());
    this.order.set(ids);
    requestAnimationFrame(() => requestAnimationFrame(() => this.loaded.set(all)));
    this.scroller().nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
