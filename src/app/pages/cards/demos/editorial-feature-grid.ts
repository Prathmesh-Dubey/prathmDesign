import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Section = 'Residential' | 'Civic' | 'Interiors';

interface Story {
  id: string;
  section: Section;
  title: string;
  dek: string;
  author: string;
  read: number;
  img: string;
  size: 'lead' | 'tall' | 'wide' | 'small';
}

@Component({
  selector: 'demo-editorial-feature-grid',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mast">
      <h3>Plan &amp; Section <em>Issue 41</em></h3>
      <div class="filters" role="group" aria-label="Filter stories by section">
        @for (f of filters; track f) {
          <button type="button" [class.on]="filter() === f" [attr.aria-pressed]="filter() === f" (click)="filter.set(f)">{{ f }}</button>
        }
      </div>
    </header>

    <div class="grid">
      @for (s of shown(); track s.id) {
        <a class="story" [class]="'story ' + s.size" href="#" (click)="$event.preventDefault()">
          <figure>
            <img [src]="s.img" [appImgFallback]="s.id" [alt]="'Photograph accompanying ' + s.title" loading="lazy" />
          </figure>
          <div class="txt">
            <p class="sec">{{ s.section }}</p>
            <h4>{{ s.title }}</h4>
            @if (s.size === 'lead' || s.size === 'wide') {
              <p class="dek">{{ s.dek }}</p>
            }
            <p class="by">{{ s.author }} · {{ s.read }} min</p>
          </div>
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(20px, 4cqi, 40px);
      background: #fafaf7; color: #161616; font-family: 'Geist', system-ui, sans-serif;
      container-type: inline-size;
    }
    .mast { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; flex-wrap: wrap; border-bottom: 2px solid #161616; padding-bottom: 12px; margin-bottom: 22px; }
    h3 { font-family: 'Newsreader', serif; font-weight: 600; font-size: clamp(24px, 3.6cqi, 34px); letter-spacing: -0.02em; }
    h3 em { font-weight: 400; font-size: .5em; color: #c8102e; margin-left: 6px; letter-spacing: 0; vertical-align: middle; }
    .filters { display: flex; gap: 2px; flex-wrap: wrap; }
    .filters button { border: 0; background: none; min-height: 36px; padding: 6px 10px; font-size: 13.5px; cursor: pointer; color: #6b6b66; border-radius: 4px; transition: color .2s, background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .filters button:hover, .filters button:active { color: #161616; }
    @media (pointer: coarse) { .filters button { min-height: 42px; padding: 6px 12px; } }
    .filters button.on { color: #fff; background: #161616; }

    .grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 28px 22px; grid-auto-flow: dense; }
    .story { text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 12px; animation: rise .5s cubic-bezier(.2,.7,.2,1) both; -webkit-tap-highlight-color: transparent; }
    .story:active img { transform: scale(1.02); }
    .story:focus-visible { outline: 2px solid #c8102e; outline-offset: 4px; }
    figure { margin: 0; overflow: hidden; background: #e6e6e1; }
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(.2,.7,.2,1), filter .5s; filter: saturate(.85); }
    @media (hover: hover) {
      .story:hover img { transform: scale(1.04); filter: saturate(1); }
      .story:hover h4 { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
    }
    .lead { grid-column: span 4; grid-row: span 2; }
    .lead figure { aspect-ratio: 16 / 10; }
    .tall { grid-column: span 2; grid-row: span 2; }
    .tall figure { aspect-ratio: 3 / 4; }
    .wide { grid-column: span 3; flex-direction: row; }
    .wide figure { aspect-ratio: 1; flex: 0 0 44%; }
    .small { grid-column: span 2; }
    .small figure { aspect-ratio: 4 / 3; }
    .sec { font-size: 12px; color: #c8102e; font-weight: 500; }
    h4 { font-family: 'Newsreader', serif; font-weight: 500; font-size: 19px; line-height: 1.15; letter-spacing: -0.01em; margin-top: 3px; }
    .lead h4 { font-size: clamp(24px, 3.4cqi, 34px); line-height: 1.05; }
    .dek { font-family: 'Newsreader', serif; font-size: 16px; color: #45453f; margin-top: 8px; line-height: 1.4; max-width: 52ch; }
    .by { font-size: 12.5px; color: #77776f; margin-top: 8px; }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } }

    @container (max-width: 820px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
      .lead { grid-column: span 2; grid-row: auto; }
      .tall, .small { grid-column: span 1; grid-row: auto; }
      .wide { grid-column: span 2; }
    }
    @container (max-width: 480px) {
      .grid { grid-template-columns: 1fr; }
      .lead, .tall, .small, .wide { grid-column: auto; }
      .wide { flex-direction: column; }
      /* phones: small stories become compact rows (thumb + text) so the issue doesn't scroll forever */
      .small, .wide { flex-direction: row; gap: 14px; }
      .small figure, .wide figure { flex: 0 0 38%; aspect-ratio: 1; align-self: flex-start; }
      .small .txt, .wide .txt { min-width: 0; }
      .wide .dek { display: none; }
      h4 { font-size: 17px; }
      .grid { gap: 20px; }
    }
  `,
})
export class EditorialFeatureGrid {
  protected readonly filters: ('All' | Section)[] = ['All', 'Residential', 'Civic', 'Interiors'];
  protected readonly filter = signal<'All' | Section>('All');
  private readonly stories: Story[] = [
    { id: 'ed-1', section: 'Civic', size: 'lead', title: 'The library that learned to breathe', dek: 'In Aarhus, a timber reading hall cools itself with nothing but stack ventilation and a very patient roof.', author: 'Ines Halvorsen', read: 14, img: unsplash('photo-1487958449943-2429e8be8625', 1100, 700) },
    { id: 'ed-2', section: 'Residential', size: 'tall', title: 'Casa Bruma, a house built around one fig tree', dek: '', author: 'Tomás Rey', read: 8, img: unsplash('photo-1600585154340-be6161a56a0c', 600, 800) },
    { id: 'ed-3', section: 'Interiors', size: 'wide', title: 'Lime plaster is back, and it smells like rain', dek: 'Why studios from Lisbon to Leeds are swapping paint for breathable walls.', author: 'Priya Natarajan', read: 6, img: unsplash('photo-1600607687939-ce8a6c25118c', 600, 600) },
    { id: 'ed-4', section: 'Civic', size: 'wide', title: 'Tower blocks, kept: the retrofit playbook', dek: 'Four councils, one question: what does it cost not to demolish?', author: 'Owen Mbeki', read: 11, img: unsplash('photo-1486406146926-c627a92ad1ab', 600, 600) },
    { id: 'ed-5', section: 'Residential', size: 'small', title: 'Six rooms, 48 square metres', dek: '', author: 'Hana Sato', read: 5, img: unsplash('photo-1502672260266-1c1ef2d93688', 600, 450) },
    { id: 'ed-6', section: 'Interiors', size: 'small', title: 'The quiet return of the reading nook', dek: '', author: 'Léa Moreau', read: 4, img: unsplash('photo-1522708323590-d24dbb6b0267', 600, 450) },
    { id: 'ed-7', section: 'Civic', size: 'small', title: 'A bus shelter worth the wait', dek: '', author: 'Sam Achebe', read: 3, img: unsplash('photo-1511818966892-d7d671e672a2', 600, 450) },
  ];
  protected readonly shown = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.stories : this.stories.filter((s) => s.section === f);
  });

  constructor() {
    loadGoogleFonts('Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600');
  }
}
