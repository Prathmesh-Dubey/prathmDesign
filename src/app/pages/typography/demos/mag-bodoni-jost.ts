import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Story { id: string; section: string; title: string; em: string; dek: string; by: string; mins: number; img: string; }

@Component({
  selector: 'demo-mag-bodoni-jost',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mag">
      <header class="top">
        <span class="issue">Autumn 2026 · No. 31</span>
        <p class="logo">Vellum</p>
        <span class="links"><a href="#" (click)="$event.preventDefault()">Style</a><a href="#" (click)="$event.preventDefault()">Culture</a><a href="#" (click)="$event.preventDefault()">Subscribe</a></span>
      </header>

      @let f = feature();
      <section class="feature" aria-live="polite">
        @for (s of [f]; track s.id) {
          <div class="f-img">
            <img [src]="s.img" [alt]="'Feature image for ' + s.title + ' ' + s.em" width="900" height="1100" />
          </div>
          <div class="f-copy">
            <p class="sec">{{ s.section }}</p>
            <h1>{{ s.title }} <em>{{ s.em }}</em></h1>
            <p class="dek">{{ s.dek }}</p>
            <p class="by">By {{ s.by }} — {{ s.mins }} min read</p>
          </div>
        }
      </section>

      <section class="more" aria-label="More stories">
        @for (s of others(); track s.id) {
          <button type="button" class="card" (click)="pick(s.id)" [attr.aria-label]="'Read ' + s.title + ' ' + s.em">
            <img [src]="s.img" alt="" width="300" height="360" />
            <span class="c-sec">{{ s.section }}</span>
            <span class="c-title">{{ s.title }} <em>{{ s.em }}</em></span>
            <span class="c-by">{{ s.by }}</span>
          </button>
        }
      </section>

      <footer class="key" aria-label="Type specimen">
        <span class="k-big">Bb</span>
        <p><b>Bodoni Moda</b> 400–700 + italic, optical size 96 for headlines, 11 for small text</p>
        <span class="k-big k-j">Jj</span>
        <p><b>Jost</b> 400 / 500, tracked +8% for section labels</p>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; background: #ffffff; color: #0b0b0b; min-height: 700px; container-type: inline-size; }
    .mag { padding: 0 clamp(16px, 4cqi, 40px) 24px; }
    .top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 16px 0; border-bottom: 1px solid #0b0b0b; font: 400 12.5px/1 'Jost', sans-serif; }
    .logo { font-family: 'Bodoni Moda', serif; font-optical-sizing: auto; font-size: clamp(30px, 6cqi, 52px); font-weight: 500; font-style: italic; line-height: 1; letter-spacing: -0.02em; }
    .links { display: flex; gap: 16px; justify-content: flex-end; }
    .links a { text-decoration: none; }
    .links a:last-child { color: #1f3fff; }
    .feature { display: grid; gap: 24px; padding: 26px 0; border-bottom: 1px solid #0b0b0b; }
    @container (min-width: 720px) { .feature { grid-template-columns: 1.05fr 1fr; gap: 40px; align-items: end; } }
    .f-img { overflow: hidden; }
    .f-img img { width: 100%; aspect-ratio: 4 / 4.6; object-fit: cover; max-height: 420px; animation: reveal .7s cubic-bezier(.2,.7,.1,1); }
    .f-copy { animation: rise .6s cubic-bezier(.2,.7,.1,1); }
    .sec, .c-sec { font: 500 11.5px/1 'Jost', sans-serif; letter-spacing: .08em; color: #1f3fff; }
    h1 { font-family: 'Bodoni Moda', serif; font-optical-sizing: auto; font-weight: 400; font-size: clamp(38px, 7.2cqi, 76px); line-height: .98; letter-spacing: -0.025em; margin-top: 14px; text-wrap: balance; }
    h1 em { font-style: italic; font-weight: 400; }
    .dek { font: 400 17px/1.55 'Jost', sans-serif; color: #2e2e2e; margin-top: 18px; max-width: 46ch; text-wrap: pretty; }
    .by { font: 400 13px/1 'Jost', sans-serif; color: #6b6b6b; margin-top: 18px; }
    .more { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 2.4cqi, 28px); padding-top: 22px; }
    @container (max-width: 520px) { .more { grid-template-columns: 1fr; } .card { grid-template-columns: 90px 1fr; } .card img { grid-row: span 3; } }
    .card { display: grid; gap: 8px; align-content: start; text-align: left; border: 0; background: none; padding: 0; cursor: pointer; color: inherit; }
    .card img { width: 100%; aspect-ratio: 5 / 6; object-fit: cover; transition: transform .5s cubic-bezier(.2,.7,.1,1), filter .4s; filter: grayscale(.25); }
    .card:hover img, .card:focus-visible img { transform: scale(1.03); filter: none; }
    .c-title { font-family: 'Bodoni Moda', serif; font-size: clamp(18px, 2.2cqi, 23px); line-height: 1.12; text-wrap: balance; }
    .c-title em { font-style: italic; }
    .card:hover .c-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
    .c-by { font: 400 12.5px/1 'Jost', sans-serif; color: #6b6b6b; }
    .key { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 10px 14px; align-items: center; margin-top: 26px; padding-top: 14px; border-top: 1px solid #e3e3e3; font: 400 12px/1.4 'Jost', sans-serif; color: #555; }
    @container (max-width: 600px) { .key { grid-template-columns: auto 1fr; } }
    .k-big { font-family: 'Bodoni Moda', serif; font-size: 34px; line-height: 1; color: #0b0b0b; }
    .k-j { font-family: 'Jost', sans-serif; font-weight: 500; }
    .key b { color: #0b0b0b; font-weight: 500; }
    .card { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .card:active img { transform: scale(.98); filter: none; }
    @media (hover: none) { .card img { filter: none; } }
    /* Phones: logo on its own row, issue + links share the row below. */
    @container (max-width: 520px) {
      .top { grid-template-columns: 1fr auto; row-gap: 10px; padding: 14px 0 10px; }
      .logo { grid-column: 1 / -1; grid-row: 1; justify-self: center; }
      .links { gap: 14px; }
    }
    @media (pointer: coarse) { .links a { padding: 10px 0; margin: -10px 0; } }
    @keyframes reveal { from { clip-path: inset(0 0 100% 0); transform: scale(1.06); } to { clip-path: inset(0); } }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
    @media (prefers-reduced-motion: reduce) { .f-img img, .f-copy { animation: none; } }
  `,
})
export class MagBodoniJost {
  protected readonly stories: Story[] = [
    { id: 'coat', section: 'Style', title: 'The Return of the', em: 'Tailored Coat', dek: 'After a decade of puffers, Milan’s ateliers are cutting wool again — narrow shoulders, long lines, and a waiting list into spring.', by: 'Céline Marchetti', mins: 12, img: photo('vellum-coat', 900, 1100) },
    { id: 'glass', section: 'Design', title: 'Murano, Without', em: 'the Souvenirs', dek: 'Three young glassblowers on keeping a furnace lit when the tour boats stop coming.', by: 'Paolo Ferrante', mins: 9, img: photo('vellum-glass', 900, 1100) },
    { id: 'scent', section: 'Beauty', title: 'A Perfume That', em: 'Smells of Rain', dek: 'The chemistry of petrichor, and the Grasse nose who spent four years bottling it.', by: 'Inès Laurent', mins: 7, img: photo('vellum-scent', 900, 1100) },
    { id: 'denim', section: 'Culture', title: 'Who Owns', em: 'Selvedge?', dek: 'Okayama’s mills supply half the world’s premium denim. Their weavers are getting older and the looms are not being replaced.', by: 'Kenji Arakawa', mins: 15, img: photo('vellum-denim', 900, 1100) },
  ];
  private readonly featureId = signal('coat');
  protected readonly feature = computed(() => this.stories.find((s) => s.id === this.featureId()) ?? this.stories[0]);
  protected readonly others = computed(() => this.stories.filter((s) => s.id !== this.featureId()));

  constructor() {
    loadGoogleFonts('Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700', 'Jost:wght@400;500');
  }

  pick(id: string): void {
    this.featureId.set(id);
  }
}
