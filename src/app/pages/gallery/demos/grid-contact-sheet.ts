import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Frame {
  n: number;
  label: string;
  src: string;
}

@Component({
  selector: 'demo-grid-contact-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sheet">
      <header>
        <div>
          <h3>Roll 07 — Alfama, Lisbon</h3>
          <p>Shot by Ana Ribeiro · 24 exposures · March 2025</p>
        </div>
        <p class="sel" aria-live="polite">
          <span class="pen">{{ picked().size }}</span> {{ picked().size === 1 ? 'select' : 'selects' }}
          @if (picked().size) { <button type="button" (click)="clear()">Clear</button> }
        </p>
      </header>

      @for (strip of strips; track $index; let s = $index) {
        <div class="strip">
          <div class="edge" aria-hidden="true">
            @for (f of strip; track f.n) { <span>▸ {{ f.n }} &nbsp; {{ f.label }}</span> }
          </div>
          <div class="frames">
            @for (f of strip; track f.n) {
              <button type="button" class="frame" [class.on]="picked().has(f.n)" (click)="toggle(f.n)"
                [attr.aria-pressed]="picked().has(f.n)" [attr.aria-label]="'Frame ' + f.n + ' — Alfama roll'">
                <img [src]="f.src" [alt]="'Frame ' + f.n + ', Alfama roll by Ana Ribeiro'" loading="lazy" />
                <svg class="ring" viewBox="0 0 100 70" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M50 4 C82 3 97 18 96 36 C95 56 74 67 48 66 C20 65 4 52 5 34 C6 16 24 6 56 7" />
                </svg>
              </button>
            }
          </div>
          <div class="edge low" aria-hidden="true">
            <span>SAFETY FILM 400 · 135</span><span>07·{{ s + 1 }}</span><span>SAFETY FILM 400 · 135</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #e9e5df; padding: clamp(12px, 2.4cqw, 26px); }
    .sheet { background: #121110; padding: 16px 12px 10px; border-radius: 3px; box-shadow: 0 18px 40px -18px rgba(0,0,0,.55); }
    header { display: flex; justify-content: space-between; align-items: end; gap: 12px; flex-wrap: wrap; color: #f1ede6; padding: 0 4px 12px; }
    h3 { font-family: var(--font-mono); font-size: 15px; font-weight: 500; letter-spacing: .02em; }
    header p { font-size: 12px; color: #a59f94; font-family: var(--font-mono); }
    .sel { display: flex; align-items: center; gap: 8px; }
    .pen { font-family: 'Permanent Marker', cursive; color: #ff3b30; font-size: 22px; line-height: 1; }
    .sel button { position: relative; background: none; border: 1px solid #4a4640; color: #d9d3c9; font-size: 11px; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-family: var(--font-mono);
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .sel button::after { content: ''; position: absolute; inset: -10px -6px; }
    .sel button:active { background: #2a2724; }
    .strip { margin-bottom: 8px; }
    .edge { display: grid; grid-template-columns: repeat(6, 1fr); font-family: var(--font-mono); font-size: 9.5px; color: #ff9a3c; letter-spacing: .08em; padding: 3px 2px; white-space: nowrap; overflow: hidden; }
    .edge.low { display: flex; justify-content: space-between; color: #8c6a3f; }
    .frames { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; }
    .frame { position: relative; padding: 0; border: 0; background: #000; aspect-ratio: 3 / 2; cursor: pointer; overflow: visible; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .frame:active img { filter: brightness(1.2) contrast(1.1); }
    .frame img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.12) contrast(1.06); transition: filter .25s, transform .25s; }
    /* loupe-style dimming only for real hover; on touch :hover sticks after a tap and would dim the roll */
    @media (hover: hover) {
      .frame:hover img { filter: brightness(1.12) contrast(1.1); }
      .frames:has(.frame:hover) .frame:not(:hover) img { filter: brightness(.55) sepia(.2); }
    }
    .frame:focus-visible { outline: 2px solid #ff9a3c; outline-offset: -2px; z-index: 2; }
    .ring { position: absolute; inset: -6% -5%; width: 110%; height: 112%; pointer-events: none; z-index: 1; overflow: visible; }
    .ring path { fill: none; stroke: #ff3b30; stroke-width: 3.2; stroke-linecap: round; vector-effect: non-scaling-stroke;
      stroke-dasharray: 300; stroke-dashoffset: 300; transition: stroke-dashoffset .5s cubic-bezier(.6,.1,.2,1); filter: drop-shadow(0 0 1px rgba(255,59,48,.5)); }
    .frame.on .ring path { stroke-dashoffset: 0; }
    @container (max-width: 640px) {
      .frames, .edge { grid-template-columns: repeat(3, 1fr); }
      .edge span:nth-child(n+4) { display: none; }
      .sheet { padding: 14px 8px 8px; }
      h3 { font-size: 14px; }
    }
  `,
})
export class GridContactSheet {
  protected readonly strips: Frame[][];
  protected readonly picked = signal<Set<number>>(new Set([5, 14]));

  constructor() {
    loadGoogleFonts('Permanent+Marker');
    const frames: Frame[] = Array.from({ length: 24 }, (_, i) => ({
      n: i + 1, label: `${i + 1}A`, src: photo('alfama-roll-' + i, 360, 240),
    }));
    this.strips = [0, 1, 2, 3].map((s) => frames.slice(s * 6, s * 6 + 6));
  }


  toggle(n: number): void {
    const next = new Set(this.picked());
    if (next.has(n)) next.delete(n); else next.add(n);
    this.picked.set(next);
  }

  clear(): void {
    this.picked.set(new Set());
  }
}
