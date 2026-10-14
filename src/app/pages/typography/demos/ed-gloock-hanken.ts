import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Part { n: string; title: string; text: string; }

@Component({
  selector: 'demo-ed-gloock-hanken',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller (scroll)="spy()">
      <div class="layout">
        <div class="side">
          <nav class="index" #nav aria-label="Essay sections">
            <p class="ix-title">In this essay</p>
            <ol #rail>
              @for (p of parts; track p.n; let i = $index) {
                <li><button type="button" [class.on]="active() === i" [attr.aria-current]="active() === i ? 'true' : null" (click)="go(i)"><span>{{ p.n }}</span>{{ p.title }}</button></li>
              }
            </ol>
          </nav>
          <dl class="key" aria-label="Type specimen">
            <dt>Gloock</dt><dd>Display · 400 only · 40–120 px</dd>
            <dt class="hk">Hanken Grotesk</dt><dd>Text · 400 / 600 · 17 px on 1.7</dd>
          </dl>
        </div>

        <article>
          <p class="over">Criticism · Film · 11 Oct 2026</p>
          <h1>Five Ways of Looking at a Long Take</h1>
          <p class="dek">An unbroken shot is a promise: nothing will be hidden from you by the edit. What directors do with that promise says a great deal about what they think an audience can bear.</p>
          <p class="by">Words by <strong>Jonah Feld-Ikeda</strong> <span aria-hidden="true">·</span> 18 min</p>

          @for (p of parts; track p.n) {
            <section class="part" [attr.data-i]="p.n">
              <h2><span class="num">{{ p.n }}</span> {{ p.title }}</h2>
              <p>{{ p.text }}</p>
            </section>
          }
          <p class="end" aria-hidden="true">■</p>
        </article>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 660px; background: #17121a; color: #efe6ea; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; scroll-behavior: smooth; }
    .layout { display: grid; gap: 28px; max-width: 1100px; margin: 0 auto; padding: clamp(22px, 5cqi, 56px) clamp(16px, 4cqi, 44px) 60px; }
    @container (min-width: 820px) {
      .layout { grid-template-columns: 230px minmax(0, 1fr); gap: 56px; }
      .side { position: sticky; top: 32px; align-self: start; }
    }
    /* Narrow: the index becomes a sticky, swipeable chapter rail; the type key drops below the essay. */
    @container (max-width: 819px) {
      .side { display: contents; }
      .ix-title { display: none; }
      .index { position: sticky; top: 0; z-index: 2; order: 0; margin: 0 calc(-1 * clamp(16px, 4cqi, 44px)); padding: 0 clamp(16px, 4cqi, 44px); background: rgba(23,18,26,.96); border-bottom: 1px solid #3a2d3f; }
      .index ol { display: flex; gap: 6px; margin: 0; padding: 8px 0; overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x proximity; scrollbar-width: none; }
      .index ol::-webkit-scrollbar { display: none; }
      .index li { flex: none; scroll-snap-align: start; }
      .index button { width: auto; min-height: 40px; align-items: center; white-space: nowrap; border: 1px solid #3a2d3f; border-radius: 999px; padding: 8px 14px; }
      .index button span { width: auto; }
      article { order: 1; }
      .key { order: 2; margin-top: 0; }
    }
    .index button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .index button:active { background: #33263a; }
    .ix-title { font: 600 12px/1 'Hanken Grotesk', sans-serif; color: #a8919c; letter-spacing: .02em; }
    .index ol { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 2px; }
    .index button { display: flex; gap: 10px; width: 100%; text-align: left; border: 0; background: none; color: #a8919c; padding: 8px 10px; border-radius: 6px; font: 400 14px/1.3 'Hanken Grotesk', sans-serif; cursor: pointer; transition: color .2s, background .2s; }
    .index button span { font-family: 'Gloock', serif; color: #e7a6c0; width: 22px; flex: none; }
    .index button:hover { color: #efe6ea; }
    .index button.on { background: #2a1f2e; color: #fff; }
    .key { margin: 26px 0 0; padding: 14px 0 0; border-top: 1px solid #3a2d3f; display: grid; gap: 2px; font: 400 12px/1.4 'Hanken Grotesk', sans-serif; color: #a8919c; }
    .key dt { font-family: 'Gloock', serif; font-size: 22px; color: #efe6ea; }
    .key dt.hk { font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 16px; margin-top: 10px; }
    .key dd { margin: 0; }
    .over { font: 500 13px/1 'Hanken Grotesk', sans-serif; color: #e7a6c0; }
    h1 { font-family: 'Gloock', serif; font-weight: 400; font-size: clamp(40px, 8cqi, 96px); line-height: .98; letter-spacing: -0.02em; margin-top: 18px; text-wrap: balance; max-width: 13ch; }
    .dek { font: 400 clamp(17px, 2.2cqi, 20px)/1.55 'Hanken Grotesk', sans-serif; color: #cdbec5; margin-top: 22px; max-width: 56ch; text-wrap: pretty; }
    .by { font: 400 14px/1 'Hanken Grotesk', sans-serif; color: #a8919c; margin-top: 22px; padding-bottom: 28px; border-bottom: 1px solid #3a2d3f; }
    .by strong { color: #efe6ea; font-weight: 600; }
    .part { padding-top: 40px; max-width: 64ch; }
    .part h2 { font-family: 'Gloock', serif; font-weight: 400; font-size: clamp(26px, 3.6cqi, 36px); line-height: 1.1; display: flex; gap: 14px; align-items: baseline; text-wrap: balance; }
    .num { font-size: 1.9em; line-height: .8; color: #e7a6c0; min-width: 1.1em; }
    .part p { font: 400 17px/1.72 'Hanken Grotesk', sans-serif; color: #d9ccd2; margin-top: 16px; text-wrap: pretty; hanging-punctuation: first; }
    .end { color: #e7a6c0; margin-top: 30px; font-size: 12px; }
    @media (prefers-reduced-motion: reduce) { .scroll { scroll-behavior: auto; } }
  `,
})
export class EdGloockHanken {
  protected readonly active = signal(0);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly nav = viewChild.required<ElementRef<HTMLElement>>('nav');
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  protected readonly parts: Part[] = [
    { n: 'I', title: 'The promise', text: 'When a camera refuses to cut, it signs a contract with the viewer: the time you spend here is the time the characters spend too. A ninety-second take of a woman waiting for a bus is not slow. It is honest about how long ninety seconds is, which is a different and much rarer thing.' },
    { n: 'II', title: 'The show-off', text: 'Some long takes are fireworks — the camera threading through a kitchen, up a staircase, out onto a roof as a helicopter lifts. We gasp at the choreography, and we are right to. But a stunt that announces itself is the opposite of the contract above; it asks us to watch the filmmaker, not the film.' },
    { n: 'III', title: 'The trap', text: 'In the best thrillers, refusing to cut is a way of refusing to rescue us. There is no reaction shot to hide behind, no edit to promise the danger has passed. We stay in the room because the camera does, and the room gets smaller with every second.' },
    { n: 'IV', title: 'The listener', text: 'Sometimes the camera simply holds on a face while another character talks off-screen. These are the takes I remember longest. Nothing moves except the small weather of someone listening, deciding whether to believe what they are being told.' },
    { n: 'V', title: 'The release', text: 'And then, eventually, the cut. After a long take, an edit lands like an exhale. Directors who understand this save their longest shots for the moments just before a decision, so that the cut itself becomes the decision. The audience feels it in the body before they can name it.' },
  ];

  constructor() {
    loadGoogleFonts('Gloock', 'Hanken+Grotesk:wght@400;500;600');
  }

  spy(): void {
    const sc = this.scroller().nativeElement;
    const top = sc.getBoundingClientRect().top;
    const secs = Array.from(sc.querySelectorAll<HTMLElement>('.part'));
    let idx = 0;
    secs.forEach((s, i) => {
      if (s.getBoundingClientRect().top - top < sc.clientHeight * 0.4) idx = i;
    });
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) idx = secs.length - 1;
    if (idx !== this.active()) {
      this.active.set(idx);
      this.reveal(idx);
    }
  }

  go(i: number): void {
    const sc = this.scroller().nativeElement;
    const sec = sc.querySelectorAll<HTMLElement>('.part')[i];
    if (!sec) return;
    // On narrow stages the sticky chapter rail covers the top of the scroller.
    const offset = sc.clientWidth < 820 ? this.nav().nativeElement.offsetHeight + 12 : 16;
    sc.scrollTo({ top: sec.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - offset });
    this.reveal(i);
  }

  /** Keep the active chip visible inside the horizontal rail (horizontal only, never scrolls the page). */
  private reveal(i: number): void {
    const rail = this.rail().nativeElement;
    if (rail.scrollWidth <= rail.clientWidth) return;
    const li = rail.children[i] as HTMLElement | undefined;
    if (!li) return;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollTo({ left: li.offsetLeft - rail.offsetLeft - 8, behavior: smooth ? 'smooth' : 'auto' });
  }
}
