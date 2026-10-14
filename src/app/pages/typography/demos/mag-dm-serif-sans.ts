import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

type Cat = 'All' | 'Film' | 'Books' | 'Music' | 'Food';
interface Post { id: number; cat: Exclude<Cat, 'All'>; title: string; dek: string; by: string; date: string; img: string; }

@Component({
  selector: 'demo-mag-dm-serif-sans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <header class="head">
        <p class="logo">The Overlook<span>.</span></p>
        <p class="tagline">Culture, read slowly. A new issue every Friday.</p>
      </header>

      <div class="tabs" role="tablist" aria-label="Filter by section">
        @for (c of cats; track c) {
          <button type="button" role="tab" [attr.aria-selected]="cat() === c" [class.on]="cat() === c" (click)="cat.set(c)">
            {{ c }} <small>{{ count(c) }}</small>
          </button>
        }
      </div>

      <div class="grid">
        @for (p of shown(); track p.id; let first = $first) {
          <article class="post" [class.lead]="first">
            <div class="ph"><img [src]="p.img" [alt]="'Image for ' + p.title" width="800" height="560" loading="lazy" /></div>
            <div class="txt">
              <p class="cat">{{ p.cat }}</p>
              <h2>{{ p.title }}</h2>
              @if (first) { <p class="dek">{{ p.dek }}</p> }
              <p class="by">{{ p.by }} · <time>{{ p.date }}</time></p>
            </div>
          </article>
        }
      </div>

      <footer class="key" aria-label="Type specimen">
        <div class="sw"><span class="a">Ag</span><span>DM Serif Display<br /><small>Regular & Italic · 26–54 px</small></span></div>
        <div class="sw"><span class="b">Ag</span><span>DM Sans<br /><small>400 / 500 / 700 · 13–16 px</small></span></div>
        <p class="scale" aria-hidden="true"><span style="font-size:54px">A</span><span style="font-size:34px">A</span><span style="font-size:22px">A</span><span style="font-size:15px">A</span><span style="font-size:12px">A</span></p>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #efeaf6; color: #1d1530; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; padding: clamp(18px, 4cqi, 40px); }
    .head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 20px; }
    .logo { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 6cqi, 54px); line-height: 1; letter-spacing: -0.01em; }
    .logo span { color: #f2b400; }
    .tagline { font: 400 14px/1.4 'DM Sans', sans-serif; color: #5d5374; }
    .tabs { display: flex; gap: 6px; margin: 22px 0 20px; overflow-x: auto; padding-bottom: 4px; overscroll-behavior-x: contain; scrollbar-width: none; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs button { font: 500 14px/1 'DM Sans', sans-serif; border: 1px solid #cfc5e0; background: #fff; color: #1d1530; padding: 9px 14px; border-radius: 999px; cursor: pointer; white-space: nowrap; transition: background .2s, color .2s, border-color .2s; }
    .tabs button small { font-size: 11px; color: #8b81a3; margin-left: 3px; font-variant-numeric: tabular-nums; }
    .tabs button.on { background: #1d1530; color: #fff; border-color: #1d1530; }
    .tabs button.on small { color: #f2b400; }
    .grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .post { background: #fff; border-radius: 4px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; animation: pop .4s cubic-bezier(.2,.8,.2,1) both; }
    .post:nth-child(2) { animation-delay: .04s; } .post:nth-child(3) { animation-delay: .08s; } .post:nth-child(4) { animation-delay: .12s; } .post:nth-child(5) { animation-delay: .16s; }
    .ph { overflow: hidden; }
    .ph img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    .post:hover .ph img { transform: scale(1.04); }
    .txt { padding: 16px 18px 18px; }
    .cat { font: 700 12px/1 'DM Sans', sans-serif; color: #8a6400; }
    h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 24px; line-height: 1.1; margin-top: 8px; text-wrap: balance; }
    .dek { font: 400 15.5px/1.55 'DM Sans', sans-serif; color: #4a4062; margin-top: 10px; max-width: 52ch; text-wrap: pretty; }
    .by { font: 400 13px/1.3 'DM Sans', sans-serif; color: #7c7294; margin-top: 12px; }
    @container (min-width: 700px) {
      .post.lead { grid-column: span 2; grid-row: span 2; }
      .post.lead .ph img { aspect-ratio: 16 / 11; }
      .post.lead h2 { font-size: clamp(30px, 4.4cqi, 44px); line-height: 1.02; }
      .post.lead .txt { padding: 22px 26px 26px; }
    }
    .key { display: flex; flex-wrap: wrap; gap: 18px 30px; align-items: center; margin-top: 26px; padding: 16px 20px; background: #1d1530; color: #efeaf6; border-radius: 4px; font: 500 14px/1.25 'DM Sans', sans-serif; }
    .key small { font-weight: 400; color: #b3a9cc; font-size: 12px; }
    .sw { display: flex; gap: 12px; align-items: center; }
    .sw .a { font: 400 38px/1 'DM Serif Display', serif; color: #f2b400; }
    .sw .b { font: 700 34px/1 'DM Sans', sans-serif; color: #f2b400; }
    .scale { margin-left: auto; display: flex; align-items: baseline; gap: 8px; font-family: 'DM Serif Display', serif; line-height: 1; color: #b3a9cc; }
    .tabs button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tabs button:not(.on):active { background: #e2daf0; }
    @media (pointer: coarse) { .tabs button { min-height: 40px; padding: 0 15px; } }
    @container (max-width: 520px) { .dek { font-size: 16px; } .scale { margin-left: 0; } }
    @keyframes pop { from { opacity: 0; transform: translateY(10px); } }
    @media (prefers-reduced-motion: reduce) { .post { animation: none; } }
  `,
})
export class MagDmSerifSans {
  protected readonly cats: Cat[] = ['All', 'Film', 'Books', 'Music', 'Food'];
  protected readonly cat = signal<Cat>('All');
  protected readonly posts: Post[] = [
    { id: 1, cat: 'Film', title: 'The quiet revolution of the ninety-minute film', dek: 'Streaming taught studios that longer meant prestige. A new wave of directors is proving that leaving the audience wanting more is still the hardest trick in cinema.', by: 'Priya Raman', date: '10 Oct', img: photo('overlook-film', 800, 560) },
    { id: 2, cat: 'Books', title: 'Why everyone is reading Norwegian crime again', dek: 'Short winter days, long sentences.', by: 'Henrik Dahl', date: '9 Oct', img: photo('overlook-books', 800, 560) },
    { id: 3, cat: 'Music', title: 'A week with the last cassette plant in Ohio', dek: 'Tape is back, and the machines are older than the people buying it.', by: 'Dani Okafor', date: '8 Oct', img: photo('overlook-music', 800, 560) },
    { id: 4, cat: 'Food', title: 'Pickling, according to a Lithuanian grandmother', dek: 'Salt, dill, patience.', by: 'Agnė Petraitė', date: '7 Oct', img: photo('overlook-food', 800, 560) },
    { id: 5, cat: 'Film', title: 'Projectionists on the films that broke their hearts', dek: 'Five people who still thread 35mm by hand.', by: 'Sam Whitlock', date: '5 Oct', img: photo('overlook-film2', 800, 560) },
    { id: 6, cat: 'Books', title: 'The translator who gave us Elena Ferrante’s voice', dek: 'On rhythm, rage and the Neapolitan comma.', by: 'Lucia Bassi', date: '3 Oct', img: photo('overlook-books2', 800, 560) },
    { id: 7, cat: 'Music', title: 'Brass bands are the best live music in Britain', dek: 'And they rehearse above the pub.', by: 'Owen Price', date: '1 Oct', img: photo('overlook-music2', 800, 560) },
  ];
  protected readonly shown = computed(() => (this.cat() === 'All' ? this.posts : this.posts.filter((p) => p.cat === this.cat())));

  constructor() {
    loadGoogleFonts('DM+Serif+Display:ital@0;1', 'DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700');
  }

  count(c: Cat): number {
    return c === 'All' ? this.posts.length : this.posts.filter((p) => p.cat === c).length;
  }
}
