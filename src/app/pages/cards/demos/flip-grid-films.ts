import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  runtime: string;
  score: number;
  synopsis: string;
  times: string[];
  bg: string;
  fg: string;
  look: 'sun' | 'split' | 'stack' | 'ring' | 'checks' | 'bar';
  accent: string;
}

@Component({
  selector: 'demo-flip-grid-films',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <div>
        <h3>Now showing at the Rio</h3>
        <p>Dalston · repertory season · tap a poster for times</p>
      </div>
      <button type="button" class="all" (click)="toggleAll()">{{ flipped().length === films.length ? 'Show posters' : 'Show all details' }}</button>
    </div>
    <ul class="films">
      @for (f of films; track f.id) {
        <li class="cell">
          <button
            type="button"
            class="flip"
            [class.on]="isFlipped(f.id)"
            [attr.aria-pressed]="isFlipped(f.id)"
            [attr.aria-label]="f.title + ' (' + f.year + '). ' + (isFlipped(f.id) ? 'Showing details.' : 'Show details.')"
            (click)="toggle(f.id)"
          >
            <span class="inner">
              <span class="face poster" [class]="'face poster ' + f.look" [style.--bg]="f.bg" [style.--fg]="f.fg" aria-hidden="true">
                <span class="shape"></span>
                <span class="ttl">{{ f.title }}</span>
                <span class="yr">{{ f.director }} · {{ f.year }}</span>
              </span>
              <span class="face back" [style.--fg]="f.accent">
                <span class="b-top">
                  <span class="b-title">{{ f.title }}</span>
                  <span class="score">{{ f.score.toFixed(1) }}</span>
                </span>
                <span class="b-meta">{{ f.director }} · {{ f.runtime }}</span>
                <span class="syn">{{ f.synopsis }}</span>
                <span class="times">
                  @for (t of f.times; track t) {
                    <span>{{ t }}</span>
                  }
                </span>
              </span>
            </span>
          </button>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(18px, 3.6cqi, 36px);
      background: #eeeeec; color: #111; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size;
    }
    .top { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(28px, 4.4cqi, 44px); line-height: .95; text-transform: uppercase; letter-spacing: .005em; }
    .top p { font-size: 13.5px; color: #66665f; margin-top: 6px; }
    .all { height: 42px; padding: 0 16px; border-radius: 4px; border: 1.5px solid #111; background: transparent; color: #111; font-weight: 600; font-size: 13.5px; cursor: pointer; transition: background .2s, color .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .all:hover, .all:active { background: #111; color: #eeeeec; }
    .films { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr)); gap: 14px; }
    .flip { display: block; width: 100%; aspect-ratio: 2 / 3; border: 0; padding: 0; background: none; cursor: pointer; perspective: 1000px; border-radius: 6px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; color: inherit; }
    .flip:focus-visible { outline: 3px solid #111; outline-offset: 4px; }
    .inner { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .75s cubic-bezier(.4,.2,.2,1); }
    @media (hover: hover) { .flip:hover .inner { transform: rotateY(-8deg); } }
    .flip:active:not(.on) .inner { transform: rotateY(-8deg) scale(.98); }
    .flip.on .inner { transform: rotateY(180deg); }
    .face { position: absolute; inset: 0; border-radius: 6px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; text-align: left; display: flex; flex-direction: column; box-shadow: 0 16px 28px -18px rgba(0,0,0,.55); }
    .poster { background: var(--bg); color: var(--fg); padding: 12px; justify-content: flex-end; }
    .shape { position: absolute; }
    .sun .shape { width: 78%; aspect-ratio: 1; border-radius: 50%; background: var(--fg); left: 11%; top: 12%; }
    .split .shape { inset: 0 50% 0 0; background: var(--fg); }
    .split .ttl, .split .yr { mix-blend-mode: difference; color: #fff; }
    .stack .shape { left: 12px; right: 12px; top: 14px; height: 52%; background: repeating-linear-gradient(0deg, var(--fg) 0 10px, transparent 10px 18px); }
    .ring .shape { width: 64%; aspect-ratio: 1; border-radius: 50%; border: 14px solid var(--fg); left: 18%; top: 14%; }
    .checks .shape { inset: 14px 14px 45%; background: conic-gradient(var(--fg) 25%, transparent 0 50%, var(--fg) 0 75%, transparent 0) 0 0 / 50% 50%; }
    .bar .shape { left: 0; right: 0; top: 30%; height: 18%; background: var(--fg); transform: skewY(-12deg); }
    .ttl { position: relative; font-family: 'Anton', sans-serif; font-size: clamp(22px, 3.2cqi, 30px); line-height: .92; text-transform: uppercase; }
    .yr { position: relative; font-size: 11px; margin-top: 6px; opacity: .85; }
    .back { transform: rotateY(180deg); background: #121212; color: #f1f1ee; padding: 14px; gap: 8px; }
    .b-top { display: flex; justify-content: space-between; align-items: start; gap: 8px; }
    .b-title { font-family: 'Anton', sans-serif; font-size: 20px; line-height: 1; text-transform: uppercase; }
    .score { font-family: 'Geist Mono', monospace; font-size: 12px; background: var(--fg); color: #121212; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; }
    .b-meta { font-size: 11.5px; color: #a7a7a0; }
    .syn { font-size: 12.5px; line-height: 1.45; color: #d7d7d1; }
    .times { margin-top: auto; display: flex; flex-wrap: wrap; gap: 5px; }
    .times span { font-family: 'Geist Mono', monospace; font-size: 11.5px; border: 1px solid #3a3a37; padding: 3px 7px; border-radius: 3px; }
    .flip:hover .times span:first-child, .flip.on .times span:first-child { border-color: var(--fg); color: var(--fg); }
    /* Phones: two posters per row, tighter backs so the synopsis and times still fit. */
    @container (max-width: 480px) {
      .films { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      .poster { padding: 10px; }
      .ttl { font-size: 21px; }
      .back { padding: 10px; gap: 5px; }
      .b-title { font-size: 15px; }
      .score { font-size: 10.5px; padding: 1px 4px; }
      .b-meta { font-size: 10.5px; }
      .syn { font-size: 11.5px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
      .times { gap: 4px; }
      .times span { font-size: 10.5px; padding: 2px 5px; }
    }
  `,
})
export class FlipGridFilms {
  protected readonly films: Film[] = [
    { id: 'f1', accent: '#ffd84d', title: 'Heat Haze', year: 2025, director: 'Ana Ruiz', runtime: '1h 48m', score: 8.1, look: 'sun', bg: '#ff5a1f', fg: '#ffd84d', times: ['14:30', '18:15', '21:00'], synopsis: 'A Seville ice-cream seller loses his van, his patience and the city’s last cold summer.' },
    { id: 'f2', accent: '#8fb0ff', title: 'Two Rooms', year: 2024, director: 'Oskar Holm', runtime: '1h 32m', score: 7.6, look: 'split', bg: '#1d3fbb', fg: '#f4e9d8', times: ['16:00', '20:45'], synopsis: 'Neighbours share one wall and, slowly, the same insomnia.' },
    { id: 'f3', accent: '#b7f0c8', title: 'Low Signal', year: 2025, director: 'Priya Desai', runtime: '2h 04m', score: 8.4, look: 'stack', bg: '#0f5c4a', fg: '#b7f0c8', times: ['13:00', '17:30', '20:10'], synopsis: 'A radio engineer on a Hebridean island hears a voice that should not be there.' },
    { id: 'f4', accent: '#ff6b6f', title: 'Saint Ellis', year: 2023, director: 'Marcus Lowe', runtime: '1h 55m', score: 7.9, look: 'ring', bg: '#f1e4d0', fg: '#c1272d', times: ['15:20', '19:00'], synopsis: 'A boxing gym in Belfast, one last fight, and a coach who has stopped believing in them.' },
    { id: 'f5', accent: '#f6c445', title: 'Paper City', year: 2024, director: 'Yuki Tanaka', runtime: '1h 41m', score: 8.0, look: 'checks', bg: '#111111', fg: '#f6c445', times: ['12:45', '18:40', '22:15'], synopsis: 'An origami artist rebuilds Osaka one fold at a time after a flood.' },
    { id: 'f6', accent: '#e8b4c8', title: 'Northbound', year: 2025, director: 'Leila Haddad', runtime: '2h 11m', score: 7.4, look: 'bar', bg: '#e8b4c8', fg: '#2b1640', times: ['16:30', '20:30'], synopsis: 'Three sisters, one Volvo, and their mother’s ashes on the way to Nordkapp.' },
  ];
  protected readonly flipped = signal<string[]>([]);

  constructor() {
    loadGoogleFonts('Anton');
  }

  protected isFlipped(id: string): boolean {
    return this.flipped().includes(id);
  }

  protected toggle(id: string): void {
    this.flipped.update((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  protected toggleAll(): void {
    this.flipped.set(this.flipped().length === this.films.length ? [] : this.films.map((f) => f.id));
  }
}
