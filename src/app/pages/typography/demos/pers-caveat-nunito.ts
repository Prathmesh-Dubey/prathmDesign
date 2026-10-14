import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Entry { id: number; day: string; date: string; title: string; mood: string; paras: string[]; note: string; hi: string; img: string; cap: string; }

@Component({
  selector: 'demo-pers-caveat-nunito',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="desk">
        <nav class="tabs" aria-label="Journal entries">
          @for (e of entries; track e.id) {
            <button type="button" [class.on]="sel() === e.id" [attr.aria-current]="sel() === e.id ? 'page' : null" (click)="sel.set(e.id)">
              <span class="d">{{ e.day }}</span><span class="m">{{ e.date }}</span>
            </button>
          }
        </nav>

        @let e = entry();
        <article class="page" (pointerdown)="swipeStart($event)" (pointerup)="swipeEnd($event)" (pointercancel)="swipeId = -1">
          @for (x of [e]; track x.id) {
            <div class="inner">
              <header>
                <p class="when">{{ x.day }}, {{ x.date }} · mood: {{ x.mood }}</p>
                <h1>{{ x.title }}</h1>
              </header>
              <figure class="polaroid">
                <span class="tape" aria-hidden="true"></span>
                <img [src]="x.img" [alt]="'Photo for the entry ' + x.title" width="400" height="360" />
                <figcaption>{{ x.cap }}</figcaption>
              </figure>
              <p>{{ x.paras[0] }} <mark>{{ x.hi }}</mark></p>
              @for (p of x.paras.slice(1); track $index) { <p>{{ p }}</p> }
              <p class="scribble"><svg viewBox="0 0 60 30" aria-hidden="true"><path d="M2 22c14-2 26-10 40-14m0 0l-8-4m8 4l-5 7" /></svg>{{ x.note }}</p>
              <p class="sign">— Mae</p>
            </div>
          }
        </article>

        <aside class="key" aria-label="Type specimen">
          <p class="kc">Caveat 500–700</p>
          <p>headlines, notes, signature</p>
          <p class="kn">Nunito 400 / 700</p>
          <p>diary text · 17 px on 32 px ruled lines</p>
        </aside>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 660px; background: #dde6ee; color: #233a6b; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .desk { padding: clamp(14px, 3cqi, 30px); max-width: 880px; margin: 0 auto; position: relative; }
    .tabs { display: flex; gap: 6px; padding-left: 18px; }
    .tabs button { border: 0; background: #b7c9da; color: #233a6b; padding: 8px 14px 10px; border-radius: 10px 10px 0 0; cursor: pointer; display: grid; text-align: left; transform: translateY(4px); transition: transform .2s, background .2s; }
    .tabs button.on { background: #fdfdfb; transform: none; }
    .tabs .d { font: 700 20px/1 'Caveat', cursive; }
    .tabs .m { font: 400 11.5px/1.2 'Nunito', sans-serif; opacity: .75; }
    .page { background-color: #fdfdfb; background-image: linear-gradient(90deg, transparent 54px, #f2a3a3 54px, #f2a3a3 56px, transparent 56px), repeating-linear-gradient(180deg, transparent 0 31px, #dbe6f3 31px 32px); background-position: 0 0, 0 14px; border-radius: 4px; box-shadow: 0 18px 40px -26px rgba(35,58,107,.6); padding: 20px clamp(16px, 4cqi, 40px) 32px 76px; min-height: 520px; }
    .inner { animation: turn .45s cubic-bezier(.2,.8,.2,1); }
    .when { font: 400 13px/32px 'Nunito', sans-serif; color: #6b7fa8; }
    h1 { font-family: 'Caveat', cursive; font-weight: 700; font-size: clamp(38px, 6.4cqi, 58px); line-height: 64px; color: #233a6b; text-wrap: balance; transform: rotate(-1deg); transform-origin: left; }
    .inner > p { font: 400 17px/32px 'Nunito', sans-serif; max-width: 58ch; color: #2a3550; text-wrap: pretty; }
    mark { background: linear-gradient(100deg, transparent 2%, #fff27a 4%, #fff27a 96%, transparent 98%); color: inherit; padding: 0 2px; }
    .polaroid { float: right; width: min(220px, 42%); margin: 6px 0 12px 20px; background: #fff; padding: 10px 10px 4px; box-shadow: 0 8px 20px -10px rgba(0,0,0,.35); transform: rotate(2.5deg); position: relative; }
    .polaroid img { width: 100%; aspect-ratio: 10 / 9; object-fit: cover; }
    .polaroid figcaption { font: 500 18px/30px 'Caveat', cursive; text-align: center; color: #3b4a6b; }
    .tape { position: absolute; top: -10px; left: 50%; width: 76px; height: 22px; transform: translateX(-50%) rotate(-4deg); background: rgba(255,170,190,.7); }
    .scribble { font-family: 'Caveat', cursive !important; font-size: 22px !important; color: #c0392b !important; display: flex; gap: 8px; align-items: center; transform: rotate(-1.5deg); }
    .scribble svg { width: 48px; height: 24px; flex: none; fill: none; stroke: #c0392b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transform: scaleX(-1); }
    .sign { font-family: 'Caveat', cursive !important; font-size: 30px !important; text-align: right; color: #233a6b !important; }
    .key { margin: 16px 0 0 auto; width: max-content; max-width: 100%; background: #fff27a; padding: 10px 14px; transform: rotate(-1.5deg); box-shadow: 0 6px 14px -8px rgba(0,0,0,.35); font: 400 12px/1.35 'Nunito', sans-serif; color: #5a4f12; }
    .kc { font: 700 22px/1 'Caveat', cursive; color: #233a6b; }
    .kn { font: 700 14px/1.2 'Nunito', sans-serif; color: #233a6b; margin-top: 6px; }
    @container (max-width: 520px) {
      /* Narrower margin rule on phones so the ruled text column keeps a comfortable measure. */
      .page { padding: 16px 14px 28px 46px; background-image: linear-gradient(90deg, transparent 32px, #f2a3a3 32px, #f2a3a3 34px, transparent 34px), repeating-linear-gradient(180deg, transparent 0 31px, #dbe6f3 31px 32px); }
      .polaroid { float: none; width: 70%; margin: 10px auto 16px; }
      .tabs { padding-left: 6px; gap: 4px; }
      .tabs button { flex: 1 1 0; min-width: 0; padding: 8px 10px 10px; }
      .tabs .d { font-size: 19px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
    .tabs button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tabs button:not(.on):active { background: #c9d7e4; transform: translateY(2px); }
    @media (pointer: coarse) { .tabs button { min-height: 48px; } }
    /* Horizontal swipe on the page flips entries; vertical drags still scroll. */
    .page { touch-action: pan-y; }
    @keyframes turn { from { opacity: 0; transform: translateX(14px); } }
    @media (prefers-reduced-motion: reduce) { .inner { animation: none; } }
  `,
})
export class PersCaveatNunito {
  protected readonly entries: Entry[] = [
    { id: 1, day: 'Sunday', date: '11 Oct', title: 'The plum tree finally gave up its plums', mood: 'sticky, happy', hi: 'Forty-two jars. I counted twice.', paras: ['Spent the whole morning on a stepladder while Dad shouted directions from the deckchair. Every plum this year arrived at once, like they’d agreed on it.', 'Grandma’s recipe says “a good handful of sugar”, which is not a measurement. Her handful was smaller than mine, so this batch is sweeter than hers. She would say it’s wrong. She would also eat three spoonfuls straight from the pan.'], note: 'next year: label the lids BEFORE they cool', img: photo('journal-plums', 400, 360), cap: 'sun · 11/10' },
    { id: 2, day: 'Wednesday', date: '7 Oct', title: 'First swim since the summer', mood: 'cold, smug', hi: 'Fourteen degrees and I stayed in for ten whole minutes.', paras: ['The lido opened its winter session and about nine of us turned up, all pretending it was fine.', 'Afterwards we stood by the hut drinking tea out of a thermos lid, steaming like horses. Nobody talked much. It was the best part of the week.'], note: 'bring the wool hat. ALWAYS bring the wool hat', img: photo('journal-lido', 400, 360), cap: 'wed · 7/10' },
    { id: 3, day: 'Friday', date: '2 Oct', title: 'Fixed the bike, broke the shed door', mood: 'mixed', hi: 'One step forward, one hinge sideways.', paras: ['The gears have been slipping since August, so I watched four videos and took the whole derailleur apart on the kitchen floor.', 'It works now — beautifully, actually. Getting it back into the shed was another story, and the door is now leaning against the fence waiting for a better version of me.'], note: 'buy hinges + ask Tom about the drill', img: photo('journal-bike', 400, 360), cap: 'fri · 2/10' },
  ];
  protected readonly sel = signal(1);
  protected readonly entry = computed(() => this.entries.find((e) => e.id === this.sel()) ?? this.entries[0]);

  constructor() {
    loadGoogleFonts('Caveat:wght@500;700', 'Nunito:wght@400;700');
  }

  protected swipeId = -1;
  private sx = 0;
  private sy = 0;

  swipeStart(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.swipeId = e.pointerId;
    this.sx = e.clientX;
    this.sy = e.clientY;
  }

  swipeEnd(e: PointerEvent): void {
    if (e.pointerId !== this.swipeId) return;
    this.swipeId = -1;
    const dx = e.clientX - this.sx;
    const dy = e.clientY - this.sy;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const i = this.entries.findIndex((x) => x.id === this.sel()) + (dx < 0 ? 1 : -1);
    if (i >= 0 && i < this.entries.length) this.sel.set(this.entries[i].id);
  }
}
