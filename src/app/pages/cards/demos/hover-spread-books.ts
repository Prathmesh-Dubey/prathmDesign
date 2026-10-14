import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  pages: number;
  pick: string;
  bg: string;
  ink: string;
  motif: 'circle' | 'stripes' | 'arch' | 'dots' | 'line';
}

@Component({
  selector: 'demo-hover-spread-books',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <div>
        <p class="kick">Book club · winter shortlist</p>
        <h3>Five novels. <span class="mouse">Hover</span><span class="touch">Tap</span> the pile to fan them out.</h3>
      </div>
      <button type="button" class="pin" (click)="pinned.set(!pinned())" [attr.aria-pressed]="pinned()">
        {{ pinned() ? 'Stack them' : 'Fan out' }}
      </button>
    </div>

    <div class="stage">
      <ul class="pile" [class.open]="pinned()" [style.--n]="books.length" aria-label="Shortlisted books" (pointerdown)="touchOpen($event)">
        @for (b of books; track b.id; let i = $index) {
          <li [style.--i]="i" [style.--c]="i - (books.length - 1) / 2">
            <button
              type="button"
              class="book"
              [class.sel]="selected() === i"
              [style.--bg]="b.bg"
              [style.--ink]="b.ink"
              [attr.aria-pressed]="selected() === i"
              [attr.aria-label]="b.title + ' by ' + b.author"
              (click)="selected.set(i)"
            >
              <span class="art" [class]="'art ' + b.motif" aria-hidden="true"></span>
              <span class="t">{{ b.title }}</span>
              <span class="a">{{ b.author }}</span>
            </button>
          </li>
        }
      </ul>
    </div>

    <div class="detail" aria-live="polite">
      <div>
        <p class="dt">{{ book().title }}</p>
        <p class="meta">{{ book().author }} · {{ book().year }} · {{ book().pages }} pages</p>
      </div>
      <p class="pick">“{{ book().pick }}”</p>
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; min-height: 100%; padding: clamp(20px, 4cqi, 40px);
      background: #dfe4ee; color: #1b2340; font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size; overflow: hidden;
    }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 16px; }
    .kick { font-size: 13px; color: #59627e; }
    h3 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(24px, 3.6cqi, 36px); line-height: 1.05; margin-top: 6px; max-width: 22ch; }
    .pin { flex-shrink: 0; height: 42px; padding: 0 18px; border-radius: 999px; border: 1px solid #1b2340; background: transparent; color: #1b2340; font-weight: 500; font-size: 14px; cursor: pointer; transition: background .2s, color .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pin:hover, .pin:active, .pin[aria-pressed='true'] { background: #1b2340; color: #dfe4ee; }
    .touch { display: none; }
    @media (hover: none) { .mouse { display: none; } .touch { display: inline; } }

    .stage { flex: 1; display: grid; place-items: center; min-height: 290px; }
    .pile { --w: clamp(120px, 18cqi, 168px); --gap: clamp(40px, 14cqi, 180px); list-style: none; margin: 0; padding: 0; position: relative; width: var(--w); height: calc(var(--w) * 1.5); }
    .pile li {
      position: absolute; inset: 0;
      transform: translate(calc(var(--i) * 3px), calc(var(--i) * -4px)) rotate(calc((var(--i) - 2) * 3deg));
      transition: transform .6s cubic-bezier(.25,.9,.25,1);
      transition-delay: calc(var(--i) * 25ms);
    }
    .pile:focus-within li, .pile.open li {
      transform: translateX(calc(var(--c) * var(--gap))) rotate(calc(var(--c) * 4deg)) translateY(calc(var(--c) * var(--c) * 6px));
    }
    @media (hover: hover) {
      .pile:hover li { transform: translateX(calc(var(--c) * var(--gap))) rotate(calc(var(--c) * 4deg)) translateY(calc(var(--c) * var(--c) * 6px)); }
      .book:hover { transform: translateY(-16px); box-shadow: inset 6px 0 0 rgba(0,0,0,.12), 0 30px 40px -18px rgba(27,35,64,.6); }
    }
    .book {
      touch-action: manipulation; -webkit-tap-highlight-color: transparent;
      width: 100%; height: 100%; border: 0; padding: 14px 12px; margin: 0; cursor: pointer; text-align: left;
      background: var(--bg); color: var(--ink); border-radius: 3px 8px 8px 3px;
      display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden;
      box-shadow: inset 6px 0 0 rgba(0,0,0,.12), inset 7px 0 0 rgba(255,255,255,.2), 0 18px 30px -16px rgba(27,35,64,.55);
      transition: transform .35s cubic-bezier(.3,.8,.3,1), box-shadow .35s;
    }
    .book.sel { transform: translateY(-16px); box-shadow: inset 6px 0 0 rgba(0,0,0,.12), 0 30px 40px -18px rgba(27,35,64,.6); }
    .book.sel { outline: 2px solid #1b2340; outline-offset: 4px; }
    .book:focus-visible { outline: 2px solid #1b2340; outline-offset: 4px; }
    .art { flex: 1; position: relative; }
    .art::before { content: ''; position: absolute; }
    .circle::before { width: 62%; aspect-ratio: 1; border-radius: 50%; background: var(--ink); left: 18%; top: 18%; opacity: .85; }
    .stripes::before { inset: 14% 8%; background: repeating-linear-gradient(0deg, var(--ink) 0 4px, transparent 4px 11px); opacity: .7; }
    .arch::before { width: 64%; height: 76%; left: 18%; bottom: 0; border-radius: 999px 999px 0 0; background: var(--ink); opacity: .85; }
    .dots::before { inset: 10%; background: radial-gradient(circle, var(--ink) 2.5px, transparent 3px) 0 0 / 14px 14px; opacity: .7; }
    .line::before { left: 10%; right: 10%; top: 50%; height: 2px; background: var(--ink); box-shadow: 0 -18px 0 var(--ink), 0 18px 0 var(--ink); }
    .t { font-family: 'Instrument Serif', serif; font-size: clamp(17px, 2.2cqi, 21px); line-height: 1; }
    .a { font-size: 11px; opacity: .75; }

    .detail { display: flex; justify-content: space-between; gap: 18px; align-items: end; border-top: 1px solid #b9c1d4; padding-top: 14px; flex-wrap: wrap; }
    .dt { font-family: 'Instrument Serif', serif; font-size: 24px; line-height: 1; }
    .meta { font-size: 13px; color: #59627e; margin-top: 4px; }
    .pick { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 17px; max-width: 40ch; color: #343d5c; }
    @container (max-width: 480px) {
      .head { flex-wrap: wrap; align-items: flex-start; }
      .pile { --w: 100px; --gap: 12.5cqi; }
      .t { font-size: 15px; }
      .book { padding: 11px 9px; }
      .stage { min-height: 250px; }
    }
  `,
})
export class HoverSpreadBooks {
  protected readonly books: Book[] = [
    { id: 'k1', title: 'The Salt Road', author: 'Nadia Kasem', year: 2024, pages: 312, motif: 'arch', bg: '#e9573f', ink: '#2b0b05', pick: 'A caravan novel that reads like a heist and ends like a hymn.' },
    { id: 'k2', title: 'Small Weathers', author: 'Ivo Lindqvist', year: 2023, pages: 228, motif: 'dots', bg: '#f1d6a1', ink: '#3a2a0c', pick: 'Twelve linked stories set in one Baltic ferry terminal.' },
    { id: 'k3', title: 'Orchard Hours', author: 'June Adeyemi', year: 2025, pages: 404, motif: 'circle', bg: '#2f5d50', ink: '#d6efe2', pick: 'Three generations and one stubborn apple farm in Kent.' },
    { id: 'k4', title: 'Low Noon', author: 'Carla Benedetti', year: 2022, pages: 276, motif: 'stripes', bg: '#a7c4e8', ink: '#0f2340', pick: 'A heatwave thriller that never once raises its voice.' },
    { id: 'k5', title: 'Paper Lanterns', author: 'Kenji Morita', year: 2024, pages: 350, motif: 'line', bg: '#1f2340', ink: '#f2c6a0', pick: 'Grief, ramen and a missing cat — funnier than it has any right to be.' },
  ];
  protected readonly selected = signal(2);
  protected readonly pinned = signal(false);
  protected readonly book = computed(() => this.books[this.selected()]);

  /** Touch has no hover: the first tap on a stacked pile fans it out (and selects that book). */
  protected touchOpen(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' && !this.pinned()) this.pinned.set(true);
  }

  constructor() {
    loadGoogleFonts('Instrument+Serif:ital@0;1');
  }
}
