import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Sitter {
  id: number;
  name: string;
  craft: string;
  village: string;
  src: string;
}

const SITTERS: [string, string, string][] = [
  ['Doña Rufina Sánchez', 'Barro negro potter', 'San Bartolo Coyotepec'],
  ['Isaías Mendoza', 'Rug weaver', 'Teotitlán del Valle'],
  ['Abigail Cruz', 'Mezcalera', 'Santiago Matatlán'],
  ['Mateo Hernández', 'Alebrije carver', 'San Martín Tilcajete'],
  ['Lucía Jiménez', 'Embroiderer', 'San Antonino Castillo Velasco'],
  ['Teodoro Ruiz', 'Tortillero', 'Tlacolula market'],
  ['Elena Vásquez', 'Cochineal dyer', 'Teotitlán del Valle'],
];

@Component({
  selector: 'demo-bento-featured-swap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bento">
      @for (id of order(); track id; let i = $index) {
        @let s = sitters[id];
        <button type="button" class="tile" [class.feat]="i === 0" [attr.data-id]="id" (click)="feature(id)"
          [attr.aria-label]="i === 0 ? s.name + ', featured' : 'Feature ' + s.name" [attr.aria-pressed]="i === 0">
          <img [src]="s.src" [alt]="'Portrait of ' + s.name + ', ' + s.craft" />
          @if (i !== 0) { <span class="nm">{{ s.name.split(' ').slice(-1)[0] }}</span> }
        </button>
      }
      <div class="cap" aria-live="polite">
        @for (k of [featured().id]; track k) {
          <div class="cap-in">
            <p class="eyebrow">Faces of Oaxaca · No. {{ k + 1 }} of {{ sitters.length }}</p>
            <h3>{{ featured().name }}</h3>
            <p class="meta">{{ featured().craft }} — {{ featured().village }}</p>
          </div>
        }
        <p class="credit">Portraits by Ximena Ortiz, 2025</p>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #1c1312; color: #f7ead9; padding: clamp(12px, 2.4cqw, 26px); }
    .bento { display: grid; gap: 10px; grid-template-columns: 1fr 1fr .8fr .8fr; grid-template-rows: repeat(3, minmax(130px, 1fr)); min-height: 480px; }
    .tile { position: relative; padding: 0; border: 0; border-radius: 16px; overflow: hidden; cursor: pointer; background: #2c201e; transform-origin: 0 0; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tile.feat { grid-column: 1 / 3; grid-row: 1 / 3; cursor: default; }
    .tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.7,.2,1), filter .4s; }
    .tile:not(.feat) img { filter: saturate(.6) brightness(.8); }
    .tile:not(.feat):hover img, .tile:not(.feat):active img { filter: none; transform: scale(1.06); }
    @media (hover: none) { .tile:not(.feat) img { filter: saturate(.8) brightness(.9); } }
    .tile:focus-visible { outline: 2px solid #f2a516; outline-offset: 2px; }
    .nm { position: absolute; left: 8px; bottom: 8px; font-size: 11.5px; font-weight: 500; background: rgba(28,19,18,.7); padding: 3px 8px; border-radius: 99px; backdrop-filter: blur(4px); }
    .cap { grid-column: 1 / 3; grid-row: 3; border-radius: 16px; background: #f2a516; color: #1c1312; padding: 16px 18px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
    .cap-in > * { animation: in .55s cubic-bezier(.2,.8,.2,1) both; }
    .cap-in > :nth-child(2) { animation-delay: .05s; } .cap-in > :nth-child(3) { animation-delay: .1s; }
    @keyframes in { from { opacity: 0; transform: translateY(10px); } }
    .eyebrow { font-size: 12px; font-weight: 500; font-family: var(--font-mono); }
    h3 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(26px, 3.6cqw, 40px); line-height: 1; margin-top: 6px; }
    .meta { font-size: 13px; margin-top: 4px; }
    .credit { font-size: 11px; opacity: .7; }
    @container (max-width: 620px) {
      .bento { grid-template-columns: repeat(3, 1fr); grid-template-rows: 260px auto repeat(2, 100px); }
      .tile.feat { grid-column: 1 / -1; grid-row: 1; }
      .cap { grid-column: 1 / -1; grid-row: 2; }
    }
  `,
})
export class BentoFeaturedSwap {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  protected readonly sitters: Sitter[] = SITTERS.map(([name, craft, village], id) => ({ id, name, craft, village, src: photo('oaxaca-face-' + id, 700, 760) }));
  protected readonly order = signal<number[]>(this.sitters.map((s) => s.id));
  protected readonly featured = computed(() => this.sitters[this.order()[0]]);

  constructor() {
    loadGoogleFonts('Instrument+Serif');
  }

  feature(id: number): void {
    const order = this.order();
    const at = order.indexOf(id);
    if (at <= 0) return;
    const els = () => Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.tile'));
    const before = new Map(els().map((el) => [el.dataset['id'], el.getBoundingClientRect()]));
    const next = [...order];
    [next[0], next[at]] = [next[at], next[0]];
    this.order.set(next);
    if (prefersReducedMotion()) return;
    afterNextRender(() => {
      for (const el of els()) {
        const a = before.get(el.dataset['id']);
        if (!a) continue;
        const b = el.getBoundingClientRect();
        if (Math.abs(a.left - b.left) < 1 && Math.abs(a.top - b.top) < 1 && Math.abs(a.width - b.width) < 1) continue;
        el.style.zIndex = el.classList.contains('feat') ? '2' : '1';
        const anim = el.animate(
          [{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` }, { transform: 'none' }],
          { duration: 620, easing: 'cubic-bezier(.65,0,.25,1)' },
        );
        anim.onfinish = () => (el.style.zIndex = '');
      }
    }, { injector: this.injector });
  }
}
