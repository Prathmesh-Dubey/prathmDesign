import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Track { n: number; title: string; artist: string; len: string; }
interface QA { q: string; a: string; }

@Component({
  selector: 'demo-mag-abril-poppins',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <section class="cover">
        <div class="cv-text">
          <p class="issue"><span>Issue 42</span> The Interview</p>
          <h1>“I write every song for a room of forty people”</h1>
          <p class="dek">Lagos producer <b>Adaeze Okon</b> on basement shows, borrowed synths and why her biggest hit was recorded on a phone.</p>
          <p class="by">Interview by Kofi Mensah · Photographs by Bisi Ade · 8 min</p>
        </div>
        <div class="cv-img">
          <img [src]="portrait" alt="Feature image for the Adaeze Okon interview" width="640" height="760" />
          <span class="sticker" aria-hidden="true">Loud<br />&amp; local</span>
        </div>
      </section>

      <div class="cols">
        <article class="qa">
          @for (item of qas; track item.q) {
            <div class="pair">
              <p class="q">{{ item.q }}</p>
              <p class="a">{{ item.a }}</p>
            </div>
          }
          <blockquote>“If forty strangers dance, a million will.”</blockquote>
        </article>

        <aside class="repeat" aria-label="On repeat this month">
          <h2>On repeat</h2>
          <ol>
            @for (t of tracks; track t.n) {
              <li [class.playing]="playing() === t.n">
                <button type="button" (click)="toggle(t.n)" [attr.aria-label]="(playing() === t.n ? 'Pause ' : 'Play ') + t.title" [attr.aria-pressed]="playing() === t.n">
                  @if (playing() === t.n) {
                    <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
                  } @else {
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
                  }
                </button>
                <span class="tn">{{ t.n.toString().padStart(2, '0') }}</span>
                <span class="tt"><b>{{ t.title }}</b>{{ t.artist }}</span>
                <span class="tl">{{ t.len }}</span>
              </li>
            }
          </ol>
          <div class="key" aria-label="Type specimen">
            <p class="k1">Abril Fatface</p>
            <p>Display · 400 · 40–88 px, tight −2% tracking</p>
            <p class="k2">Poppins</p>
            <p>Text 400 · Labels 600 / 800 · 14–17 px</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #ffd23f; color: #111; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .cover { display: grid; gap: 22px; padding: clamp(20px, 4cqi, 40px); background: #111; color: #ffd23f; }
    @container (min-width: 720px) { .cover { grid-template-columns: 1.4fr 1fr; align-items: center; } }
    .issue { font: 800 12.5px/1 'Poppins', sans-serif; color: #fff; display: flex; gap: 10px; align-items: center; }
    .issue span { background: #ff3e7f; color: #111; padding: 6px 10px; border-radius: 999px; }
    h1 { font-family: 'Abril Fatface', serif; font-weight: 400; font-size: clamp(36px, 7.4cqi, 84px); line-height: .98; letter-spacing: -0.02em; margin-top: 18px; text-wrap: balance; text-indent: -0.4em; padding-left: 0.4em; }
    .dek { font: 400 clamp(16px, 2cqi, 18px)/1.55 'Poppins', sans-serif; color: #f4f1e8; margin-top: 18px; max-width: 46ch; }
    .dek b { color: #ff3e7f; font-weight: 600; }
    .by { font: 400 12.5px/1.4 'Poppins', sans-serif; color: #9a9a9a; margin-top: 16px; }
    .cv-img { position: relative; max-width: 360px; justify-self: center; width: 100%; }
    .cv-img img { width: 100%; aspect-ratio: 32 / 38; object-fit: cover; border-radius: 50% 50% 8px 8px; filter: saturate(1.2) contrast(1.05); }
    .sticker { position: absolute; left: -10px; bottom: 18px; width: 92px; height: 92px; border-radius: 50%; background: #ff3e7f; color: #111; display: grid; place-items: center; text-align: center; font: 800 13px/1.05 'Poppins', sans-serif; transform: rotate(-12deg); animation: wob 6s ease-in-out infinite; }
    .cols { display: grid; gap: 30px; padding: clamp(20px, 4cqi, 40px); }
    @container (min-width: 760px) { .cols { grid-template-columns: minmax(0, 1fr) 280px; gap: 44px; } }
    .pair + .pair { margin-top: 22px; }
    .q { font: 700 16px/1.45 'Poppins', sans-serif; max-width: 60ch; }
    .q::before { content: 'Q'; font-family: 'Abril Fatface', serif; font-weight: 400; font-size: 22px; color: #ff3e7f; -webkit-text-stroke: 1px #111; margin-right: 10px; }
    .a { font: 400 16px/1.7 'Poppins', sans-serif; margin-top: 8px; max-width: 62ch; text-wrap: pretty; }
    blockquote { margin: 30px 0 0; font-family: 'Abril Fatface', serif; font-size: clamp(28px, 4.6cqi, 46px); line-height: 1.04; text-wrap: balance; text-indent: -0.42em; padding-left: 0.42em; }
    .repeat h2 { font-family: 'Abril Fatface', serif; font-weight: 400; font-size: 32px; }
    ol { list-style: none; padding: 0; margin: 10px 0 0; border-top: 2px solid #111; }
    li { display: grid; grid-template-columns: 34px 24px 1fr auto; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(17,17,17,.25); transition: background .2s; }
    li.playing { background: rgba(255,62,127,.18); }
    li button { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #111; background: #111; color: #ffd23f; display: grid; place-items: center; cursor: pointer; padding: 0; }
    li button svg { width: 12px; height: 12px; fill: currentColor; }
    .eq { display: flex; gap: 2px; align-items: flex-end; height: 12px; }
    .eq i { width: 3px; background: #ff3e7f; animation: eq .8s ease-in-out infinite; height: 100%; transform-origin: bottom; }
    .eq i:nth-child(2) { animation-delay: -.3s; } .eq i:nth-child(3) { animation-delay: -.55s; }
    .tn { font: 800 12px/1 'Poppins', sans-serif; font-variant-numeric: tabular-nums; }
    .tt { font: 400 12.5px/1.3 'Poppins', sans-serif; display: grid; }
    .tt b { font-weight: 600; font-size: 14px; }
    .tl { font: 400 12px/1 'Poppins', sans-serif; font-variant-numeric: tabular-nums; }
    .key { margin-top: 22px; padding: 14px 16px; background: #111; color: #c9c9c9; border-radius: 8px; font: 400 12px/1.45 'Poppins', sans-serif; }
    .k1 { font: 400 26px/1.1 'Abril Fatface', serif; color: #ffd23f; }
    .k2 { font: 800 20px/1.1 'Poppins', sans-serif; color: #ff3e7f; margin-top: 10px; }
    li button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform .12s; }
    li button:active { transform: scale(.9); }
    @media (pointer: coarse) { li { grid-template-columns: 40px 22px 1fr auto; } li button { width: 40px; height: 40px; } }
    @container (max-width: 400px) { .sticker { width: 78px; height: 78px; font-size: 12px; left: -4px; } }
    @keyframes eq { 0%, 100% { transform: scaleY(.3); } 50% { transform: scaleY(1); } }
    @keyframes wob { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(-4deg) scale(1.04); } }
    @media (prefers-reduced-motion: reduce) { .sticker, .eq i { animation: none; } }
  `,
})
export class MagAbrilPoppins {
  protected readonly portrait = photo('issue42-adaeze', 640, 760);
  protected readonly playing = signal(0);
  protected readonly qas: QA[] = [
    { q: 'You still play basement shows, even after the festival run. Why?', a: 'Because the basement tells me the truth. At a festival everyone is already happy — they paid, the sun is out. In a room of forty people in Yaba, if the drop doesn’t land you see it on every face. That’s my studio, really.' },
    { q: '“Danfo Lights” was recorded on a phone. Is that a legend or a fact?', a: 'Fact. The bus was stuck in traffic on Third Mainland Bridge, the horns were in the same key, and I had a voice memo open. I spent six months trying to beat that recording in a proper studio. I never did.' },
    { q: 'What do you tell producers who are waiting for better equipment?', a: 'Borrow. My first synth belonged to a church. I returned it every Sunday morning before the service and took it back on Sunday night.' },
  ];
  protected readonly tracks: Track[] = [
    { n: 1, title: 'Danfo Lights', artist: 'Adaeze Okon', len: '3:41' },
    { n: 2, title: 'Harmattan Tape', artist: 'Sefi & The Lines', len: '4:12' },
    { n: 3, title: 'Third Mainland', artist: 'Kayode Bello', len: '5:03' },
    { n: 4, title: 'Sunday Synth', artist: 'Adaeze Okon', len: '2:58' },
  ];

  constructor() {
    loadGoogleFonts('Abril+Fatface', 'Poppins:wght@400;600;700;800');
  }

  toggle(n: number): void {
    this.playing.set(this.playing() === n ? 0 : n);
  }
}
