import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Speaker {
  id: string;
  name: string;
  role: string;
  talk: string;
  slot: string;
  img: string;
}

interface Theme {
  id: string;
  name: string;
  pairs: [string, string][];
}

@Component({
  selector: 'demo-duotone-speakers',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <div>
        <p class="kick">Offscreen · Berlin · 12–13 March 2026</p>
        <h3>Speakers</h3>
      </div>
      <div class="themes" role="radiogroup" aria-label="Duotone palette">
        @for (t of themes; track t.id) {
          <button type="button" role="radio" [attr.aria-checked]="theme().id === t.id" [class.on]="theme().id === t.id" (click)="themeId.set(t.id)">
            <span class="chip" aria-hidden="true">
              @for (p of t.pairs; track $index) {
                <i [style.background]="'linear-gradient(135deg,' + p[0] + ' 50%,' + p[1] + ' 50%)'"></i>
              }
            </span>
            {{ t.name }}
          </button>
        }
      </div>
    </div>

    <ul class="grid">
      @for (s of speakers; track s.id; let i = $index) {
        <li
          class="card"
          tabindex="0"
          [class.on]="colour() === s.id"
          [style.--dark]="pair(i)[0]"
          [style.--light]="pair(i)[1]"
          (click)="toggle(s.id)"
          (keydown.enter)="toggle(s.id)"
          (keydown.space)="toggle(s.id); $event.preventDefault()"
        >
          <div class="duo">
            <img [src]="s.img" [appImgFallback]="s.id" [alt]="'Portrait of ' + s.name" loading="lazy" />
          </div>
          <div class="txt">
            <p class="slot">{{ s.slot }}</p>
            <h4>{{ s.name }}</h4>
            <p class="role">{{ s.role }}</p>
            <p class="talk">“{{ s.talk }}”</p>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(20px, 4cqi, 40px);
      background: #f4f4f1; color: #121212; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size;
    }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    .kick { font-size: 13px; color: #5c5c58; }
    h3 { font-family: 'Krona One', sans-serif; font-weight: 400; font-size: clamp(30px, 5.4cqi, 56px); letter-spacing: -0.04em; line-height: .95; margin-top: 6px; }
    .themes { display: flex; gap: 6px; flex-wrap: wrap; }
    .themes button { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px 0 8px; border-radius: 999px; border: 1px solid #d3d3cd; background: #fff; color: #121212; font-size: 13px; font-weight: 500; cursor: pointer; transition: border-color .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .themes button:hover, .themes button:active, .themes button.on { border-color: #121212; }
    .themes button.on { box-shadow: inset 0 0 0 1px #121212; }
    .chip { display: flex; }
    .chip i { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff; }
    .chip i + i { margin-left: -8px; }
    .grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 14px; }
    .card { outline: none; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .card:focus-visible .duo { box-shadow: 0 0 0 3px #121212; }
    .duo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--light); border-radius: 6px; isolation: isolate; transition: background .6s; }
    .duo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15) brightness(1.05); mix-blend-mode: multiply; transition: filter .6s, transform 1s cubic-bezier(.2,.7,.2,1); }
    .duo::after { content: ''; position: absolute; inset: 0; background: var(--dark); mix-blend-mode: lighten; transition: opacity .6s, background .6s; pointer-events: none; }
    @media (hover: hover) {
      .card:hover .duo img { filter: none; mix-blend-mode: normal; transform: scale(1.04); }
      .card:hover .duo::after { opacity: 0; }
    }
    .card:focus-visible .duo img, .card.on .duo img { filter: none; mix-blend-mode: normal; transform: scale(1.04); }
    .card:focus-visible .duo::after, .card.on .duo::after { opacity: 0; }
    .txt { padding: 12px 2px 0; }
    .slot { font-family: 'Geist Mono', monospace; font-size: 11.5px; color: #5c5c58; }
    h4 { font-family: 'Krona One', sans-serif; font-weight: 400; font-size: 16px; letter-spacing: -0.03em; margin-top: 6px; }
    .role { font-size: 13px; color: #5c5c58; margin-top: 2px; }
    .talk { font-size: 14px; margin-top: 8px; line-height: 1.35; }
    @container (max-width: 480px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 10px; }
      h4 { font-size: 13.5px; line-height: 1.2; }
      .role { font-size: 12px; }
      .talk { font-size: 13px; }
    }
  `,
})
export class DuotoneSpeakers {
  protected readonly themes: Theme[] = [
    { id: 'riso', name: 'Riso', pairs: [['#13315c', '#ff7f51'], ['#1d1a4f', '#f7c8d8'], ['#0f3b3a', '#ffd166']] },
    { id: 'mint', name: 'Mint', pairs: [['#073b3a', '#9ff0c8'], ['#0c2d48', '#a6e3ff'], ['#29204a', '#c7f9cc']] },
    { id: 'heat', name: 'Heat', pairs: [['#3d0c3a', '#ffc857'], ['#5b0e14', '#ff9f6b'], ['#1f1235', '#ff6b9a']] },
  ];
  protected readonly themeId = signal('riso');
  protected readonly theme = computed(() => this.themes.find((t) => t.id === this.themeId())!);
  protected readonly speakers: Speaker[] = [
    { id: 'sp1', name: 'Adaeze Obi', role: 'Design Director, Kora Pay', slot: 'Thu 10:00', talk: 'Designing money for a billion new users', img: unsplash('photo-1531123897727-8f129e1688ce', 500, 625) },
    { id: 'sp2', name: 'Lukas Brandt', role: 'Creative Coder, Northfield', slot: 'Thu 11:30', talk: 'Shaders are just very fast drawings', img: unsplash('photo-1507003211169-0a1dd7228f2d', 500, 625) },
    { id: 'sp3', name: 'Valentina Cruz', role: 'Type Designer, Letra Studio', slot: 'Thu 14:00', talk: 'A variable font for 40 languages', img: unsplash('photo-1438761681033-6461ffad8d80', 500, 625) },
    { id: 'sp4', name: 'Arjun Rao', role: 'Head of Product, Tandem', slot: 'Fri 09:30', talk: 'Fewer settings, better software', img: unsplash('photo-1500648767791-00dcc994a43e', 500, 625) },
  ];

  constructor() {
    loadGoogleFonts('Krona+One');
  }

  /** Speaker whose photo is shown in full colour (tap/click toggles; hover previews on desktop). */
  protected readonly colour = signal<string | null>(null);

  protected toggle(id: string): void {
    this.colour.update((c) => (c === id ? null : id));
  }

  protected pair(i: number): [string, string] {
    const p = this.theme().pairs;
    return p[i % p.length];
  }
}
