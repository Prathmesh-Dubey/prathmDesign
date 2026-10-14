import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

@Component({
  selector: 'demo-ed-playfair-source',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller (scroll)="onScroll()">
      <div class="bar" aria-hidden="true"><span [style.transform]="'scaleX(' + progress() + ')'"></span></div>
      <header class="mast">
        <a class="logo" href="#" (click)="$event.preventDefault()">The Halyard</a>
        <nav aria-label="Sections">
          <a href="#" (click)="$event.preventDefault()">Essays</a>
          <a href="#" (click)="$event.preventDefault()">Cities</a>
          <a href="#" (click)="$event.preventDefault()">Archive</a>
        </nav>
        <button type="button" class="save" [class.on]="saved()" (click)="saved.set(!saved())" [attr.aria-pressed]="saved()">
          {{ saved() ? 'Saved' : 'Save for later' }}
        </button>
      </header>

      <article>
        <p class="section">Essays <span>/</span> Cities</p>
        <h1>The Lamplighters of the Old Town Still Make Their Rounds</h1>
        <p class="deck">In Kraków, a handful of gas lamps are lit by hand every evening. Following the men who do it is a lesson in how a city chooses what to keep.</p>
        <div class="byline">
          <span class="avatar" aria-hidden="true">MK</span>
          <div>
            <strong>Marta Kowalczyk</strong>
            <span>12 October 2026 · 14 min read</span>
          </div>
        </div>

        <figure class="hero">
          <img [src]="hero" alt="Feature image for The Lamplighters of the Old Town" width="1200" height="640" />
          <figcaption>Photograph by Tomasz Wilk for The Halyard.</figcaption>
        </figure>

        <div class="body">
          <p class="lede">At half past five the lamplighter arrives on Kanonicza Street with a brass pole longer than he is tall. He hooks the little door of the first lantern, turns the valve, and waits a beat for the mantle to bloom from blue to a warm, stubborn white. Then he walks on. Nobody applauds. A tourist lowers her phone, unsure whether she has seen a performance or a chore.</p>
          <p>It is both, and that ambiguity is the point. When the city restored a stretch of its gas lighting in 2002, the engineers could have fitted timers.<button type="button" class="fn" (click)="goNote(1)" aria-label="Footnote 1">1</button> The council chose people instead — a few retired electricians, a former tram driver, and a rotating cast of students who apply each spring.</p>

          <blockquote class="pull">
            <p>“You are not lighting a lamp. You are telling the street that someone is still looking after it.”</p>
            <cite>— Andrzej Nowak, lamplighter since 2009</cite>
          </blockquote>

          <p>Nowak keeps a notebook of every lamp that fails: a cracked pane in March, a valve seized by frost in January, a mantle that crumbled when a delivery van brushed the post. He has walked the route roughly four thousand times. He knows which windows will be lit when he passes, and which old woman on Grodzka will wave.<button type="button" class="fn" (click)="goNote(2)" aria-label="Footnote 2">2</button></p>
          <p>There is a temptation to call all of this nostalgia, but that word flatters the past. What the lamplighters preserve is attention — a habit of noticing small things at a walking pace, which a city of scooters and push notifications has otherwise priced out.</p>
        </div>

        <ol class="notes" aria-label="Footnotes">
          <li [class.hit]="activeNote() === 1" data-note="1">Automatic ignition was trialled on Wawel Hill in 1999 and abandoned after two winters of failed pilot flames.</li>
          <li [class.hit]="activeNote() === 2" data-note="2">Her name is Halina. She has asked not to be photographed, and we have respected that.</li>
        </ol>
      </article>

      <footer class="key" aria-label="Type specimen">
        <div><span class="k-head">Aa</span><p><strong>Playfair Display</strong> 800 · 44–64 px headlines, italic for decks</p></div>
        <div><span class="k-body">Aa</span><p><strong>Source Serif 4</strong> 400 · 19 px on 1.65, small caps for sections</p></div>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #fcfcfa; color: #1b1b1f; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; scroll-behavior: smooth; }
    .bar { position: sticky; top: 0; height: 3px; z-index: 3; background: rgba(31,77,58,.08); }
    .bar span { display: block; height: 100%; background: #1f4d3a; transform-origin: left; transition: transform .1s linear; }
    .mast { position: sticky; top: 3px; z-index: 2; display: flex; align-items: center; gap: 20px; padding: 14px clamp(16px, 4cqi, 40px);
      background: rgba(252,252,250,.92); backdrop-filter: blur(8px); border-bottom: 1px solid #e7e5df; }
    .logo { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700; font-size: 22px; text-decoration: none; }
    nav { display: flex; gap: 18px; font-family: 'Source Serif 4', serif; font-size: 15px; color: #55565c; }
    nav a { text-decoration: none; }
    nav a:hover { color: #1f4d3a; }
    .save { margin-left: auto; font-family: 'Source Serif 4', serif; font-size: 14px; border: 1px solid #1f4d3a; color: #1f4d3a; background: none; padding: 6px 14px; border-radius: 999px; cursor: pointer; transition: background .2s, color .2s; }
    .save.on { background: #1f4d3a; color: #fff; }
    article { max-width: 760px; margin: 0 auto; padding: 40px clamp(16px, 5cqi, 40px) 24px; }
    .section { font-family: 'Source Serif 4', serif; font-variant-caps: all-small-caps; letter-spacing: .06em; color: #1f4d3a; font-size: 17px; }
    .section span { color: #b9b7b0; margin: 0 4px; }
    h1 { font-family: 'Playfair Display', serif; font-weight: 800; font-size: clamp(34px, 6.4cqi, 62px); line-height: 1.04; letter-spacing: -0.015em; margin-top: 10px; text-wrap: balance; }
    .deck { font-family: 'Source Serif 4', serif; font-style: italic; font-size: clamp(18px, 2.4cqi, 22px); line-height: 1.45; color: #45464d; margin-top: 18px; max-width: 58ch; text-wrap: pretty; }
    .byline { display: flex; gap: 12px; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e7e5df; font-family: 'Source Serif 4', serif; }
    .byline strong { display: block; font-weight: 600; font-size: 15px; }
    .byline span { font-size: 14px; color: #6b6c72; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: #1f4d3a; color: #fff; font-size: 13px; letter-spacing: .04em; }
    .hero { margin: 28px 0 0; }
    .hero img { width: 100%; height: auto; aspect-ratio: 15 / 8; object-fit: cover; }
    figcaption { font-family: 'Source Serif 4', serif; font-size: 13.5px; color: #77787e; margin-top: 8px; }
    .body { font-family: 'Source Serif 4', serif; font-size: 19px; line-height: 1.65; max-width: 66ch; margin: 34px auto 0; hanging-punctuation: first; }
    .body p + p { margin-top: 1.05em; }
    .body p { text-wrap: pretty; }
    .lede::first-letter { font-family: 'Playfair Display', serif; font-weight: 800; float: left; font-size: 5.1em; line-height: .8; margin: .06em .08em 0 0; color: #1f4d3a; }
    .fn { font: 600 11px/1 'Source Serif 4', serif; vertical-align: super; border: 0; background: #e3ece6; color: #1f4d3a; border-radius: 4px; padding: 2px 5px; margin-left: 2px; cursor: pointer; }
    .fn:hover { background: #1f4d3a; color: #fff; }
    .pull { margin: 1.6em 0; padding: 0; border: 0; }
    .pull p { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 500; font-size: clamp(24px, 3.6cqi, 32px); line-height: 1.25; color: #1f4d3a; text-indent: -0.42em; text-wrap: balance; }
    .pull cite { display: block; margin-top: 12px; font-style: normal; font-size: 15px; color: #6b6c72; }
    .notes { max-width: 66ch; margin: 34px auto 0; padding: 18px 0 0 1.2em; border-top: 1px solid #e7e5df; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.55; color: #55565c; }
    .notes li { padding: 4px 8px; border-radius: 6px; transition: background .4s; }
    .notes li.hit { background: #e3ece6; color: #1b1b1f; }
    .key { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin: 30px clamp(16px, 4cqi, 40px) 28px; padding: 16px 18px; border: 1px solid #e7e5df; border-radius: 10px; background: #fff; }
    .key div { display: flex; gap: 12px; align-items: center; }
    .key span { font-size: 30px; line-height: 1; color: #1f4d3a; width: 44px; }
    .k-head { font-family: 'Playfair Display', serif; font-weight: 800; }
    .k-body { font-family: 'Source Serif 4', serif; }
    .key p { font-family: 'Source Serif 4', serif; font-size: 13.5px; color: #55565c; line-height: 1.4; }
    .key strong { color: #1b1b1f; font-weight: 600; }
    @container (max-width: 560px) { nav { display: none; } .notes { font-size: 15.5px; } }
    .save, .fn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .save:active { transform: scale(.96); }
    .fn { position: relative; }
    /* Footnote markers stay visually small but get a finger-sized hit area. */
    .fn::after { content: ''; position: absolute; inset: -12px -10px; }
    .fn:active { background: #1f4d3a; color: #fff; }
    @media (pointer: coarse) { .save { min-height: 40px; padding: 0 16px; } }
    @media (prefers-reduced-motion: reduce) { .scroll { scroll-behavior: auto; } }
  `,
})
export class EdPlayfairSource {
  protected readonly hero = photo('halyard-lamplighters', 1200, 640);
  protected readonly progress = signal(0);
  protected readonly saved = signal(false);
  protected readonly activeNote = signal(0);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');

  constructor() {
    loadGoogleFonts('Playfair+Display:ital,wght@0,500;0,700;0,800;1,500;1,700', 'Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400');
  }

  onScroll(): void {
    const el = this.scroller().nativeElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? el.scrollTop / max : 0);
  }

  goNote(n: number): void {
    this.activeNote.set(n);
    const sc = this.scroller().nativeElement;
    const note = sc.querySelector<HTMLElement>('[data-note="' + n + '"]');
    if (!note) return;
    const top = note.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 120;
    sc.scrollTo({ top });
  }
}
