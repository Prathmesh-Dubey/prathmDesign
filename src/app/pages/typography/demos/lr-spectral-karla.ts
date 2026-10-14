import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Seg { t: string; fn?: number; }
interface Chapter { n: string; title: string; paras: Seg[][]; }

const NOTES: Record<number, string> = {
  1: 'Gottscheerish was spoken by a German-speaking community in what is now southern Slovenia from the fourteenth century until 1941.',
  2: 'The tapes are held by the Gottscheer Heritage society; most were made on a Uher reel-to-reel between 1972 and 1979.',
  3: 'Linguists estimate fewer than a hundred fluent speakers remain, almost all of them over eighty.',
  4: 'Speakers disagree on how to spell it. The dialect never had a standard written form.',
};

@Component({
  selector: 'demo-lr-spectral-karla',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.escape)': 'note.set(0)', '(document:click)': 'outside($event)' },
  template: `
    <div class="scroll" #scroller>
      <header class="head">
        <p class="kick">A long read in three chapters</p>
        <h1>A Language Kept in the Kitchen</h1>
        <p class="by">Words by Mira Kranjc · Photographs by Luka Zorn · 19 Oct 2026</p>
      </header>

      <nav class="chapters" #bar role="tablist" aria-label="Chapters">
        @for (c of chapters; track c.n; let i = $index) {
          <button type="button" role="tab" [attr.aria-selected]="ch() === i" [class.on]="ch() === i" (click)="pick(i)">
            <span class="cn">{{ c.n }}</span><span class="ct">{{ c.title }}</span>
          </button>
        }
      </nav>

      @let c = chapter();
      <article #art role="tabpanel" [attr.aria-label]="'Chapter ' + c.n">
        @for (cc of [c]; track cc.n) {
          <div class="inner">
            <h2><span>Chapter {{ cc.n }}</span>{{ cc.title }}</h2>
            @for (p of cc.paras; track $index) {
              <p>@for (s of p; track $index) {<span>{{ s.t }}@if (s.fn; as f) {<span class="fnw"><button type="button" class="fn" (click)="toggle(f, $event)" [attr.aria-expanded]="note() === f" [attr.aria-label]="'Footnote ' + f">{{ f }}</button>@if (note() === f) {<span class="pop" role="note" [style.left.px]="pos().x" [style.width.px]="pos().w" [style.--ax.px]="pos().a"><b>{{ f }}.</b> {{ notes[f] }}</span>}</span>}</span>}</p>
            }
          </div>
        }
        <div class="pager">
          <button type="button" (click)="pick(ch() - 1)" [disabled]="ch() === 0">Previous chapter</button>
          <span>{{ ch() + 1 }} / {{ chapters.length }}</span>
          <button type="button" (click)="pick(ch() + 1)" [disabled]="ch() === chapters.length - 1">Next chapter</button>
        </div>
      </article>

      <footer class="key" aria-label="Type specimen">
        <div><span class="ks">Spectral</span><small>ExtraLight 200 italic display · Regular 400 text, 18 / 31 px</small></div>
        <div><span class="kk">Karla</span><small>400 / 600 / 700 · navigation, captions, notes 13.5 px</small></div>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #fcfcfd; color: #1e2433; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .head { padding: clamp(26px, 6cqi, 60px) clamp(18px, 5cqi, 48px) 20px; max-width: 900px; margin: 0 auto; }
    .kick { font: 600 13px/1 'Karla', sans-serif; color: #a8741a; }
    h1 { font-family: 'Spectral', serif; font-weight: 200; font-style: italic; font-size: clamp(40px, 8cqi, 86px); line-height: .98; letter-spacing: -0.025em; margin-top: 14px; text-wrap: balance; max-width: 14ch; }
    .by { font: 400 13.5px/1.4 'Karla', sans-serif; color: #6a7183; margin-top: 16px; }
    .chapters { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: repeat(3, 1fr); background: #fcfcfd; border-top: 1px solid #1e2433; border-bottom: 1px solid #dfe2ea; max-width: 900px; margin: 0 auto; }
    .chapters button { display: grid; gap: 3px; text-align: left; border: 0; background: none; padding: 12px clamp(10px, 2.4cqi, 20px); cursor: pointer; color: #6a7183; position: relative; }
    .chapters button::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 3px; background: #a8741a; transform: scaleX(0); transform-origin: left; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
    .chapters button.on { color: #1e2433; }
    .chapters button.on::after { transform: scaleX(1); }
    .cn { font: 400 italic 20px/1 'Spectral', serif; color: #a8741a; }
    .ct { font: 600 13px/1.25 'Karla', sans-serif; }
    article { max-width: 900px; margin: 0 auto; padding: 8px clamp(18px, 5cqi, 48px) 10px; }
    .inner { max-width: 64ch; animation: in .4s ease-out; }
    h2 { font-family: 'Spectral', serif; font-weight: 300; font-size: clamp(26px, 4cqi, 36px); line-height: 1.15; margin-top: 26px; display: grid; gap: 4px; }
    h2 span { font: 700 12px/1 'Karla', sans-serif; color: #a8741a; letter-spacing: .03em; }
    .inner p { font: 400 18px/1.72 'Spectral', serif; margin-top: 1em; text-wrap: pretty; hanging-punctuation: first; }
    .fnw { position: relative; }
    .fn { font: 700 11px/1 'Karla', sans-serif; vertical-align: super; color: #fff; background: #a8741a; border: 0; border-radius: 999px; min-width: 17px; height: 17px; padding: 0 4px; margin-left: 2px; cursor: pointer; }
    .fn[aria-expanded='true'] { background: #1e2433; }
    .pop { position: absolute; left: 0; top: calc(100% + 10px); width: 280px; z-index: 3; background: #1e2433; color: #eef0f5; font: 400 13.5px/1.5 'Karla', sans-serif; padding: 10px 12px; border-radius: 8px; box-shadow: 0 14px 30px -12px rgba(30,36,51,.5); animation: pop .2s ease-out; text-indent: 0; }
    .pop::before { content: ''; position: absolute; top: -6px; left: var(--ax, 50%); margin-left: -6px; border: 6px solid transparent; border-top: 0; border-bottom-color: #1e2433; }
    .pop b { color: #f2c46d; }
    .pager { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 30px; padding-top: 16px; border-top: 1px solid #dfe2ea; max-width: 64ch; font: 400 13px/1 'Karla', sans-serif; color: #6a7183; }
    .pager button { font: 600 13.5px/1 'Karla', sans-serif; border: 1px solid #1e2433; background: none; color: #1e2433; padding: 9px 14px; border-radius: 999px; cursor: pointer; }
    .pager button:disabled { opacity: .3; cursor: default; }
    .key { display: flex; flex-wrap: wrap; gap: 14px 34px; max-width: 900px; margin: 28px auto 0; padding: 16px clamp(18px, 5cqi, 48px) 30px; background: #f1f2f6; }
    .key div { display: grid; gap: 3px; }
    .key small { font: 400 12px/1.35 'Karla', sans-serif; color: #6a7183; }
    .ks { font: 200 italic 26px/1 'Spectral', serif; }
    .kk { font: 700 18px/1 'Karla', sans-serif; }
    @container (max-width: 520px) { .ct { display: none; } .chapters button { justify-items: center; } }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
    @keyframes pop { from { opacity: 0; transform: translateY(-4px); } }
    .fn, .pager button, .chapters button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .fn { position: relative; }
    /* 17px badge, ~40px hit area. */
    .fn::after { content: ''; position: absolute; inset: -12px -11px; }
    .fn:active { background: #1e2433; }
    .pager button:not(:disabled):active { background: #1e2433; color: #fff; }
    .chapters button:active { background: #f1f2f6; }
    @media (pointer: coarse) { .pager button { min-height: 42px; padding: 0 16px; } }
    @container (max-width: 520px) { .pop { font-size: 14.5px; } .pager { font-size: 12.5px; } .pager button { padding-inline: 12px; } }
    @media (prefers-reduced-motion: reduce) { .inner, .pop { animation: none; } .chapters button::after { transition: none; } }
  `,
})
export class LrSpectralKarla {
  protected readonly notes = NOTES;
  protected readonly ch = signal(0);
  protected readonly note = signal(0);
  protected readonly chapters: Chapter[] = [
    { n: 'I', title: 'The recording', paras: [
      [{ t: 'The voice on the tape belongs to a woman born in 1911 in a village that no longer exists, speaking a language almost nobody understands.', fn: 1 }, { t: ' She is describing how to make a walnut roll. It takes her eleven minutes.' }],
      [{ t: 'Her granddaughter, Ana, found the reels in a shoebox in Cleveland in 2019 and drove them to a studio in Ljubljana to be digitised.', fn: 2 }, { t: ' “I didn’t understand a word,” she told me, “but I knew the recipe by the end.”' }],
    ] },
    { n: 'II', title: 'Words for weather', paras: [
      [{ t: 'The dialect has a dozen words for the kind of rain that falls on a hillside forest, and none at all for an aeroplane. It is a language shaped entirely by the places its speakers lived and the work they did there.' }],
      [{ t: 'Today the fluent speakers can be counted in the dozens.', fn: 3 }, { t: ' When they meet, they talk mostly about food and about the weather — including, more than once, a word that means roughly “the weather that cannot decide.”', fn: 4 }],
    ] },
    { n: 'III', title: 'Who keeps a language', paras: [
      [{ t: 'Ana is learning now, slowly, from the tapes and from a retired teacher in Kočevje who runs an online class for nine students on three continents.' }],
      [{ t: 'It is unlikely she will ever be fluent. That is not really the point, she says. The point is that the recipe still works, and that when she reads it aloud the words sound like someone she loved.' }],
    ] },
  ];
  protected readonly chapter = computed(() => this.chapters[this.ch()]);

  constructor() {
    loadGoogleFonts('Spectral:ital,wght@0,200;0,300;0,400;1,200;1,400', 'Karla:wght@400;600;700');
  }

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private readonly art = viewChild.required<ElementRef<HTMLElement>>('art');
  /** Popover geometry: x relative to the marker wrapper, width, and arrow offset — clamped to the text column. */
  protected readonly pos = signal({ x: 0, w: 280, a: 140 });

  pick(i: number): void {
    if (i < 0 || i >= this.chapters.length) return;
    this.ch.set(i);
    this.note.set(0);
    // If the reader is below the chapter start (e.g. tapped "Next chapter" at the bottom), bring the new chapter's top into view under the sticky bar.
    const sc = this.scroller().nativeElement;
    const target = this.art().nativeElement.offsetTop - this.bar().nativeElement.offsetHeight;
    if (sc.scrollTop > target + 4) {
      const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      sc.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  toggle(n: number, ev: Event): void {
    if (this.note() === n) { this.note.set(0); return; }
    const btn = ev.currentTarget as HTMLElement;
    const wrap = btn.parentElement as HTMLElement;
    const col = (btn.closest('.inner') as HTMLElement | null) ?? wrap;
    const b = btn.getBoundingClientRect();
    const c = col.getBoundingClientRect();
    const w0 = wrap.getBoundingClientRect();
    const w = Math.min(280, c.width);
    const mid = b.left + b.width / 2;
    const left = Math.min(Math.max(mid - w / 2, c.left), c.right - w);
    this.pos.set({ x: left - w0.left, w, a: Math.min(w - 12, Math.max(12, mid - left)) });
    this.note.set(n);
  }

  /** Tap anywhere outside an open footnote closes it. */
  outside(e: Event): void {
    if (!this.note()) return;
    const t = e.target as Element | null;
    if (t && this.host.contains(t) && t.closest('.fnw')) return;
    this.note.set(0);
  }
}
