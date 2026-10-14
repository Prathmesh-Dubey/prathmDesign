import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';

interface Tile {
  id: number;
  name: string;
  architect: string;
  city: string;
  year: number;
  src: string;
}

const DATA: [string, string, string, number][] = [
  ['Barbican Estate', 'Chamberlin, Powell & Bon', 'London', 1982],
  ['Habitat 67', 'Moshe Safdie', 'Montréal', 1967],
  ['Geisel Library', 'William Pereira', 'San Diego', 1970],
  ['Trellick Tower', 'Ernő Goldfinger', 'London', 1972],
  ['Unité d’Habitation', 'Le Corbusier', 'Marseille', 1952],
  ['National Theatre', 'Denys Lasdun', 'London', 1976],
  ['Torres Blancas', 'Francisco Javier Sáenz de Oiza', 'Madrid', 1969],
  ['Boston City Hall', 'Kallmann McKinnell', 'Boston', 1968],
  ['Nakagin Capsule', 'Kisho Kurokawa', 'Tokyo', 1972],
  ['Hallgrímskirkja', 'Guðjón Samúelsson', 'Reykjavík', 1986],
  ['SESC Pompéia', 'Lina Bo Bardi', 'São Paulo', 1986],
  ['Salk Institute', 'Louis Kahn', 'La Jolla', 1965],
];

@Component({
  selector: 'demo-grid-hover-zoom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top">
      <h3>Concrete Kindness</h3>
      <p><span class="mono">12 buildings</span> · photographed 2019–2025 by Tomasz Wierzba</p>
    </header>
    <ul class="grid" role="list">
      @for (t of tiles; track t.id) {
        <li>
          <figure class="tile" tabindex="0" [attr.aria-label]="t.name + ', ' + t.city" [class.open]="open() === t.id"
            [attr.aria-expanded]="open() === t.id" (pointerdown)="pt = $event.pointerType" (click)="tap(t.id)"
            (keydown.enter)="toggle(t.id)" (keydown.space)="$event.preventDefault(); toggle(t.id)">
            <img [src]="t.src" [alt]="'Photograph ' + (t.id + 1) + ' of 12 — ' + t.name + ' series'" loading="lazy" />
            <span class="num mono">{{ (t.id + 1).toString().padStart(2, '0') }}</span>
            <figcaption>
              <strong>{{ t.name }}</strong>
              <span>{{ t.architect }}</span>
              <span class="mono meta">{{ t.city }} · {{ t.year }}</span>
            </figcaption>
          </figure>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block; container-type: inline-size; min-height: 100%;
      background: #e6e7ea; color: #16181d; padding: clamp(16px, 3cqw, 32px);
    }
    .mono { font-family: var(--font-mono); }
    .top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-family: var(--font-display); font-size: clamp(24px, 3.6cqw, 38px); font-weight: 700; letter-spacing: -0.03em; font-variation-settings: 'wdth' 80; }
    .top p { font-size: 13px; color: #5b5f69; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
    @container (max-width: 820px) { .grid { grid-template-columns: repeat(4, 1fr); } }
    @container (max-width: 560px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    .tile { position: relative; margin: 0; aspect-ratio: 1; overflow: hidden; border-radius: 4px; background: #c9cbd0; cursor: zoom-in; outline: none; -webkit-tap-highlight-color: transparent; }
    .tile img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(.85) contrast(1.05); transform: scale(1.001);
      transition: transform .7s cubic-bezier(.2,.7,.2,1), filter .5s ease; }
    .num { position: absolute; top: 8px; left: 9px; font-size: 11px; color: #fff; mix-blend-mode: difference; }
    figcaption {
      position: absolute; inset: auto 0 0; padding: 30px 10px 10px; display: grid; gap: 1px; color: #fff;
      background: linear-gradient(transparent, rgba(10,12,16,.82));
      transform: translateY(101%); transition: transform .45s cubic-bezier(.2,.7,.2,1);
    }
    figcaption strong { font-family: var(--font-display); font-size: 15px; font-weight: 600; line-height: 1.15; }
    figcaption span { font-size: 11.5px; opacity: .82; line-height: 1.3; }
    .meta { font-size: 10.5px !important; color: #ffb199; opacity: 1 !important; margin-top: 3px; }
    .tile:hover img, .tile:focus-visible img, .tile.open img { transform: scale(1.12); filter: grayscale(0) contrast(1.05); }
    .tile:hover figcaption, .tile:focus-visible figcaption, .tile.open figcaption { transform: none; }
    /* touch: the building name is always on; tap a tile for colour, zoom and the full credit */
    @media (hover: none) {
      .tile:hover:not(.open) img { transform: scale(1.001); filter: grayscale(.85) contrast(1.05); }
      figcaption { transform: none; padding-top: 24px; }
      .tile:not(.open):not(:focus-visible) figcaption span { display: none; }
      figcaption strong { font-size: 13.5px; }
    }
    .tile:focus-visible { box-shadow: 0 0 0 3px #e6e7ea, 0 0 0 5px #ff5a36; }
  `,
})
export class GridHoverZoom {
  /** tile opened by tap (touch stand-in for hover) */
  protected readonly open = signal<number | null>(null);
  protected pt = 'mouse';

  tap(id: number): void {
    if (this.pt !== 'mouse') this.toggle(id);
  }

  toggle(id: number): void {
    this.open.update((cur) => (cur === id ? null : id));
  }

  protected readonly tiles: Tile[] = DATA.map(([name, architect, city, year], id) => ({
    id, name, architect, city, year, src: photo('brut-' + id, 480, 480),
  }));
}
