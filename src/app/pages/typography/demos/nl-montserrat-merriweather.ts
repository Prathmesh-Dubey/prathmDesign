import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Story { id: string; kicker: string; title: string; text: string; }

@Component({
  selector: 'demo-nl-montserrat-merriweather',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller>
      <p class="pre">Your Sunday climate briefing · <a href="#" (click)="$event.preventDefault()">View in browser</a></p>
      <div class="mail">
        <header class="band">
          <p class="brand">GROUND TRUTH</p>
          <p class="sub">The week in climate, read in ten minutes · No. 212 · 11 October 2026</p>
        </header>
        <img class="hero" [src]="hero" alt="Header image for Ground Truth issue 212" width="1200" height="480" />

        <div class="inner">
          <p class="greet">Good morning. Three stories this week: a heat-pump milestone in Poland, a lagoon’s first day in court, and a modest but real win for the North Sea’s seagrass.</p>

          <nav class="toc" aria-label="In this issue">
            <p>In this issue</p>
            <ol>
              @for (s of stories; track s.id; let i = $index) {
                <li><button type="button" (click)="go(s.id)"><span>{{ i + 1 }}</span>{{ s.title }}</button></li>
              }
            </ol>
          </nav>

          @for (s of stories; track s.id; let i = $index) {
            <section class="story" [attr.data-id]="s.id">
              <p class="kick">{{ i + 1 }} · {{ s.kicker }}</p>
              <h2>{{ s.title }}</h2>
              <p>{{ s.text }}</p>
            </section>
            @if (i === 0) {
              <aside class="sponsor" aria-label="Sponsor">
                <span>Supported by</span>
                <p><b>Openfield Maps</b> — free satellite land-cover layers for researchers and newsrooms. Apply for access by 1 November.</p>
              </aside>
            }
          }

          <div class="poll">
            @if (vote()) {
              <p class="thx">Thanks — noted. We read every reply.</p>
            } @else {
              <p>How was this issue?</p>
              <div class="opts">
                <button type="button" (click)="vote.set('great')">Great</button>
                <button type="button" (click)="vote.set('ok')">Fine</button>
                <button type="button" (click)="vote.set('meh')">Not for me</button>
              </div>
            }
          </div>
        </div>

        <footer class="foot">
          <div class="key" aria-label="Type specimen">
            <span class="km">Montserrat 800</span><span>masthead, headlines 24 px, kickers</span>
            <span class="kw">Merriweather 400</span><span>reading text 16 / 28 px, generous x-height</span>
          </div>
          <p>You’re receiving this because you signed up at groundtruth.news. <a href="#" (click)="$event.preventDefault()">Unsubscribe</a> · <a href="#" (click)="$event.preventDefault()">Update preferences</a></p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #dfe7e2; color: #18241e; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; padding: 14px 12px 30px; scroll-behavior: smooth; }
    .pre { text-align: center; font: 500 11.5px/1.4 'Montserrat', sans-serif; color: #5d6d64; margin-bottom: 12px; }
    .mail { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ccd8d0; }
    .band { background: #14532d; color: #fff; padding: 22px 28px 18px; }
    .brand { font: 800 clamp(24px, 5cqi, 34px)/1 'Montserrat', sans-serif; letter-spacing: .08em; }
    .sub { font: 500 12px/1.4 'Montserrat', sans-serif; color: #b8e0c6; margin-top: 8px; }
    .hero { width: 100%; aspect-ratio: 5 / 2; object-fit: cover; }
    .inner { padding: 24px clamp(18px, 5cqi, 32px); }
    .greet { font: 400 16px/1.75 'Merriweather', serif; }
    .toc { margin-top: 22px; border: 1px solid #ccd8d0; border-radius: 6px; padding: 14px 16px; background: #f4f8f5; }
    .toc > p { font: 800 11.5px/1 'Montserrat', sans-serif; letter-spacing: .06em; color: #14532d; }
    .toc ol { list-style: none; margin: 8px 0 0; padding: 0; }
    .toc button { display: flex; gap: 10px; width: 100%; text-align: left; border: 0; background: none; padding: 6px 0; font: 600 14px/1.35 'Montserrat', sans-serif; color: #18241e; cursor: pointer; }
    .toc button:hover { color: #14532d; text-decoration: underline; text-underline-offset: 3px; }
    .toc span { color: #3fa36a; font-weight: 800; width: 14px; flex: none; }
    .story { margin-top: 28px; padding-top: 22px; border-top: 1px solid #e3ebe6; }
    .kick { font: 700 11.5px/1 'Montserrat', sans-serif; color: #3fa36a; letter-spacing: .04em; }
    h2 { font: 800 clamp(20px, 3.4cqi, 24px)/1.25 'Montserrat', sans-serif; letter-spacing: -0.015em; margin-top: 8px; text-wrap: balance; }
    .story p:last-child { font: 400 16px/1.75 'Merriweather', serif; margin-top: 10px; text-wrap: pretty; }
    .sponsor { margin-top: 24px; padding: 14px 16px; background: #fbf6e8; border-left: 4px solid #d4a017; font: 400 14px/1.6 'Merriweather', serif; }
    .sponsor span { font: 700 10.5px/1 'Montserrat', sans-serif; letter-spacing: .08em; color: #8a6a0b; }
    .sponsor p { margin-top: 6px; }
    .poll { margin-top: 30px; padding: 18px; text-align: center; background: #14532d; color: #fff; border-radius: 6px; font: 700 15px/1.3 'Montserrat', sans-serif; }
    .opts { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .opts button { font: 700 13px/1 'Montserrat', sans-serif; padding: 10px 14px; border-radius: 999px; border: 1.5px solid #b8e0c6; background: transparent; color: #fff; cursor: pointer; transition: background .2s, color .2s; }
    .opts button:hover { background: #b8e0c6; color: #14532d; }
    .thx { font: 400 italic 15px/1.5 'Merriweather', serif; }
    .foot { padding: 20px clamp(18px, 5cqi, 32px) 24px; border-top: 1px solid #e3ebe6; background: #f4f8f5; font: 500 11.5px/1.55 'Montserrat', sans-serif; color: #5d6d64; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items: baseline; padding-bottom: 14px; margin-bottom: 12px; border-bottom: 1px dashed #ccd8d0; }
    .km { font: 800 14px/1 'Montserrat', sans-serif; color: #18241e; }
    .kw { font: 400 14px/1 'Merriweather', serif; color: #18241e; }
    .toc button, .opts button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .toc button:active { color: #14532d; }
    .opts button:active { background: #b8e0c6; color: #14532d; }
    @media (hover: none) { .opts button:hover { background: transparent; color: #fff; } .toc button:hover { text-decoration: none; } }
    @media (pointer: coarse) { .toc button { padding: 10px 0; } .opts button { min-height: 42px; padding: 0 18px; } }
    @container (max-width: 420px) { .band { padding: 18px 18px 14px; } }
    @media (prefers-reduced-motion: reduce) { .scroll { scroll-behavior: auto; } }
  `,
})
export class NlMontserratMerriweather {
  protected readonly hero = photo('groundtruth-212', 1200, 480);
  protected readonly vote = signal<string | null>(null);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  protected readonly stories: Story[] = [
    { id: 'pl', kicker: 'Energy', title: 'Poland passes one million heat pumps', text: 'Installations doubled in two years, helped by a grant scheme that pays out within thirty days and a training push that added 9,000 certified fitters. Coal still heats a third of homes, but the trend line has turned.' },
    { id: 'river', kicker: 'Law', title: 'The lagoon that went to court', text: 'Four years after Spain gave the Mar Menor lagoon legal personhood, the first case brought in its own name has reached a judge in Murcia. Its guardians are asking for restoration orders against farm run-off, not just fines.' },
    { id: 'sea', kicker: 'Nature', title: 'Seagrass is quietly coming back', text: 'Volunteer-planted meadows off the Dorset coast have survived their third winter. Each hectare stores carbon up to thirty-five times faster than tropical rainforest — and shelters young cod and seahorses.' },
  ];

  constructor() {
    loadGoogleFonts('Montserrat:wght@500;600;700;800', 'Merriweather:ital,wght@0,400;1,400');
  }

  go(id: string): void {
    const sc = this.scroller().nativeElement;
    const el = sc.querySelector<HTMLElement>('[data-id="' + id + '"]');
    if (el) sc.scrollTo({ top: el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 12 });
  }
}
