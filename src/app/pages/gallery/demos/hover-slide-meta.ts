import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Look {
  id: number;
  name: string;
  pieces: string;
  price: string;
  src: string;
}

const LOOKS: [string, string, string][] = [
  ['Ferry coat', 'Boiled-wool coat · ribbed rollneck', '€ 1,240'],
  ['Harbour suit', 'Double-pleat trouser · boxy jacket', '€ 980'],
  ['Kiln knit', 'Mohair crewneck · wool skirt', '€ 640'],
  ['North shirt', 'Poplin overshirt · wide denim', '€ 520'],
];

@Component({
  selector: 'demo-hover-slide-meta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h3>Atelier Nørre <span>AW26</span></h3>
      <p>Lookbook · shot in Aarhus by Sofie Lindqvist</p>
    </header>
    <ul class="row" role="list">
      @for (l of looks; track l.id; let i = $index) {
        <li class="look" tabindex="0" [attr.aria-label]="'Look ' + (i + 1) + ': ' + l.name + ', ' + l.price" [class.open]="open() === l.id"
          [attr.aria-expanded]="open() === l.id" (pointerdown)="pt = $event.pointerType" (click)="tap(l.id)" (blur)="blur(l.id)">
          <img [src]="l.src" [alt]="'Look ' + (i + 1) + ' — ' + l.name + ', Atelier Nørre AW26'" loading="lazy" />
          <span class="no" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
          <div class="panel">
            <p class="k">Look {{ (i + 1).toString().padStart(2, '0') }}</p>
            <strong>{{ l.name }}</strong>
            <p class="pieces">{{ l.pieces }}</p>
            <div class="foot">
              <span class="price">{{ l.price }}</span>
              <button type="button" tabindex="-1" aria-hidden="true">Shop the look</button>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #f4f4f2; color: #0d0d0d; padding: clamp(16px, 3cqw, 32px); }
    header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: clamp(30px, 5cqw, 52px); line-height: .9; text-transform: uppercase; letter-spacing: .01em; }
    h3 span { color: #2b3bff; }
    header p { font-size: 13px; color: #5c5c5c; }
    .row { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    @container (max-width: 680px) { .row { grid-template-columns: repeat(2, 1fr); } }
    .look { position: relative; aspect-ratio: 3 / 4.3; overflow: hidden; background: #ddd; cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; }
    .look img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s cubic-bezier(.2,.7,.2,1); }
    .no { position: absolute; left: 12px; top: 8px; font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: 46px; color: #fff; line-height: 1;
      mix-blend-mode: difference; transition: transform .5s cubic-bezier(.2,.7,.2,1), opacity .4s; }
    .panel { position: absolute; left: 8px; right: 8px; bottom: 8px; background: #0d0d0d; color: #fff; padding: 14px 14px 12px;
      transform: translateY(calc(100% + 10px)); transition: transform .55s cubic-bezier(.7,0,.2,1); }
    .panel > * { opacity: 0; transform: translateY(10px); transition: opacity .35s, transform .45s cubic-bezier(.2,.7,.2,1); }
    .k { font-size: 11px; color: #8e96ff; font-family: var(--font-mono); }
    strong { display: block; font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: 26px; text-transform: uppercase; line-height: 1; margin-top: 4px; }
    .pieces { font-size: 12px; color: #bdbdbd; margin-top: 6px; }
    .foot { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; gap: 8px; }
    .price { font-size: 14px; font-weight: 600; }
    .foot button { border: 0; background: #2b3bff; color: #fff; font-size: 11.5px; font-weight: 600; padding: 7px 10px; cursor: pointer; white-space: nowrap; }
    .look:hover img, .look:focus-visible img, .look.open img { transform: scale(1.07) translateY(-3%); }
    .look:hover .no, .look:focus-visible .no, .look.open .no { transform: translateY(-120%); opacity: 0; }
    .look:hover .panel, .look:focus-visible .panel, .look.open .panel { transform: none; }
    .look:hover .panel > *, .look:focus-visible .panel > *, .look.open .panel > * { opacity: 1; transform: none; }
    .look:hover .panel > :nth-child(1), .look:focus-visible .panel > :nth-child(1), .look.open .panel > :nth-child(1) { transition-delay: .18s; }
    .look:hover .panel > :nth-child(2), .look:focus-visible .panel > :nth-child(2), .look.open .panel > :nth-child(2) { transition-delay: .24s; }
    .look:hover .panel > :nth-child(3), .look:focus-visible .panel > :nth-child(3), .look.open .panel > :nth-child(3) { transition-delay: .3s; }
    .look:hover .panel > :nth-child(4), .look:focus-visible .panel > :nth-child(4), .look.open .panel > :nth-child(4) { transition-delay: .36s; }
    /* touch: name + price always visible as a compact panel; tap a look for the full card */
    @media (hover: none) {
      .look:not(.open) img { transform: none; }
      .look:not(.open) .no { transform: none; opacity: 1; }
      .look:not(.open) .panel { transform: none; padding: 10px 10px 9px; }
      .look:not(.open) .panel > * { opacity: 1; transform: none; transition-delay: 0s; }
      .look:not(.open) .k, .look:not(.open) .pieces, .look:not(.open) .foot button { display: none; }
      .look:not(.open) strong { font-size: 19px; }
      .look:not(.open) .foot { margin-top: 4px; }
      .look:not(.open) .price { font-size: 12.5px; }
    }
    @container (max-width: 420px) {
      strong { font-size: 21px; }
      .panel { left: 6px; right: 6px; bottom: 6px; padding: 12px 10px 10px; }
      .foot { flex-wrap: wrap; }
      .no { font-size: 36px; }
    }
    .look:focus-visible::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 0 3px #2b3bff; pointer-events: none; }
  `,
})
export class HoverSlideMeta {
  /** look opened by tap (touch stand-in for hover) */
  protected readonly open = signal<number | null>(null);
  protected pt = 'mouse';

  tap(id: number): void {
    if (this.pt === 'mouse') return;
    this.open.update((cur) => (cur === id ? null : id));
  }

  blur(id: number): void {
    if (this.open() === id) this.open.set(null);
  }

  protected readonly looks: Look[] = LOOKS.map(([name, pieces, price], id) => ({ id, name, pieces, price, src: photo('norre-aw26-' + id, 600, 860) }));

  constructor() {
    loadGoogleFonts('Big+Shoulders+Display:wght@500;800');
  }
}
