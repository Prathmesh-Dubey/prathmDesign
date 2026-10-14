import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Comment { id: number; name: string; when: string; text: string; }

@Component({
  selector: 'demo-pers-lora-nunito-sans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="site">
          <span class="logo">The Allotment Diaries</span>
          <span class="plot">Plot 14, Hackney Marshes</span>
        </header>

        <article>
          <p class="cat">Autumn jobs · Week 41</p>
          <h1>Saving seeds from the tomatoes that survived the blight</h1>
          <div class="author">
            <img [src]="avatar" alt="Portrait of Graham Osei" width="80" height="80" />
            <p><strong>Graham Osei</strong><span>8 October 2026 · 5 min read</span></p>
          </div>
          <img class="hero" [src]="hero" alt="Feature image for Saving seeds from the tomatoes that survived the blight" width="1000" height="560" />
          <div class="body">
            <p>Two of the eleven varieties I grew this year came through August’s blight with barely a mark. One was a cherry tomato called <em>Crimson Crush</em>, bred for resistance, so no surprise there. The other was a battered old beefsteak from a packet Mrs Kaur on plot 9 handed me in 2021 with “good one” written on it in biro.</p>
            <p>I’m saving seed from both. Here is the whole method, which takes about ten minutes of work and three days of patience:</p>
            <ol>
              <li>Squeeze the seeds and jelly from your ripest fruit into a jar with a splash of water.</li>
              <li>Leave it somewhere warm for two or three days until a grey skin forms. Yes, it smells.</li>
              <li>Rinse through a sieve, spread on a ceramic plate and dry for a week.</li>
            </ol>
            <p>Label everything. Last year I didn’t, and I am still not sure what I planted in bed three.</p>
          </div>

          <div class="react">
            <button type="button" class="like" [class.on]="liked()" (click)="toggleLike()" [attr.aria-pressed]="liked()">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17s-6.5-3.9-6.5-8.6A3.6 3.6 0 0110 6a3.6 3.6 0 016.5 2.4C16.5 13.1 10 17 10 17z" /></svg>
              {{ likes() }}
            </button>
            <span>people found this useful</span>
          </div>
        </article>

        <section class="comments" aria-label="Comments">
          <h2>{{ comments().length }} comments</h2>
          <ul>
            @for (c of comments(); track c.id) {
              <li><p class="cm-h"><strong>{{ c.name }}</strong> <span>{{ c.when }}</span></p><p>{{ c.text }}</p></li>
            }
          </ul>
          <form (submit)="add($event)">
            <label [attr.for]="uid + '-cm-name'">Name</label>
            <input [id]="uid + '-cm-name'" [value]="name()" (input)="name.set(val($event))" autocomplete="off" placeholder="Your first name" />
            <label [attr.for]="uid + '-cm-text'">Comment</label>
            <textarea [id]="uid + '-cm-text'" rows="3" [value]="text()" (input)="text.set(val($event))" placeholder="Share a tip or a question"></textarea>
            <button type="submit" [disabled]="!name().trim() || !text().trim()">Post comment</button>
          </form>
        </section>

        <footer class="key" aria-label="Type specimen">
          <p><span class="l">Lora</span> 500 / 600 &amp; italic — headlines, names, emphasis</p>
          <p><span class="n">Nunito Sans</span> 400 / 700 — body 17 / 29 px, forms, captions</p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #e9efe6; color: #1f2a1f; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 760px; margin: 0 auto; padding: clamp(18px, 4cqi, 40px) clamp(16px, 4cqi, 36px) 36px; }
    .site { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; align-items: baseline; padding-bottom: 14px; border-bottom: 1px solid #c9d4c4; }
    .logo { font: 600 italic 22px/1 'Lora', serif; color: #7b2d5b; }
    .plot { font: 400 13px/1 'Nunito Sans', sans-serif; color: #5c6b58; }
    .cat { font: 700 13px/1 'Nunito Sans', sans-serif; color: #7b2d5b; margin-top: 30px; }
    h1 { font-family: 'Lora', serif; font-weight: 600; font-size: clamp(30px, 5.2cqi, 46px); line-height: 1.12; letter-spacing: -0.01em; margin-top: 12px; text-wrap: balance; }
    .author { display: flex; gap: 12px; align-items: center; margin-top: 18px; }
    .author img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; }
    .author p { display: grid; font: 400 13px/1.35 'Nunito Sans', sans-serif; color: #5c6b58; }
    .author strong { font: 600 16px/1.2 'Lora', serif; color: #1f2a1f; }
    .hero { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 14px; margin-top: 22px; }
    .body { font: 400 17px/1.72 'Nunito Sans', sans-serif; margin-top: 24px; max-width: 64ch; }
    .body p { text-wrap: pretty; }
    .body > * + * { margin-top: 1em; }
    .body em { font-family: 'Lora', serif; font-style: italic; font-size: 1.04em; }
    .body ol { padding-left: 0; list-style: none; counter-reset: s; display: grid; gap: 10px; }
    .body ol li { counter-increment: s; display: grid; grid-template-columns: 34px 1fr; background: #f6f9f4; padding: 10px 14px; border-radius: 10px; }
    .body ol li::before { content: counter(s); font: 600 italic 22px/1.2 'Lora', serif; color: #7b2d5b; }
    .react { display: flex; align-items: center; gap: 10px; margin-top: 26px; font: 400 14px/1 'Nunito Sans', sans-serif; color: #5c6b58; }
    .like { display: inline-flex; align-items: center; gap: 7px; border: 1px solid #c9d4c4; background: #fff; border-radius: 999px; padding: 8px 14px; font: 700 14px/1 'Nunito Sans', sans-serif; cursor: pointer; font-variant-numeric: tabular-nums; transition: all .2s; }
    .like svg { width: 17px; height: 17px; fill: none; stroke: #7b2d5b; stroke-width: 1.6; transition: transform .3s cubic-bezier(.3,1.6,.5,1); }
    .like.on { background: #7b2d5b; color: #fff; border-color: #7b2d5b; }
    .like.on svg { fill: #fff; stroke: #fff; transform: scale(1.15); }
    .comments { margin-top: 34px; padding-top: 20px; border-top: 1px solid #c9d4c4; }
    h2 { font: 600 22px/1.2 'Lora', serif; }
    .comments ul { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 12px; }
    .comments li { background: #fff; border-radius: 12px; padding: 12px 16px; font: 400 15.5px/1.6 'Nunito Sans', sans-serif; animation: in .3s ease-out; }
    .cm-h strong { font: 600 15px/1 'Lora', serif; }
    .cm-h span { font-size: 12.5px; color: #7b8a77; margin-left: 6px; }
    form { display: grid; gap: 6px; margin-top: 18px; font: 400 14px/1.3 'Nunito Sans', sans-serif; }
    label { font-weight: 700; font-size: 13px; margin-top: 6px; }
    input, textarea { font: 400 15.5px/1.5 'Nunito Sans', sans-serif; border: 1px solid #c9d4c4; border-radius: 10px; padding: 10px 12px; background: #fff; color: inherit; resize: vertical; }
    input:focus, textarea:focus { outline: 2px solid #7b2d5b; outline-offset: 1px; border-color: transparent; }
    form button { justify-self: start; margin-top: 8px; font: 700 14px/1 'Nunito Sans', sans-serif; background: #1f2a1f; color: #fff; border: 0; border-radius: 999px; padding: 11px 18px; cursor: pointer; }
    form button:disabled { opacity: .4; cursor: not-allowed; }
    .key { margin-top: 30px; padding: 14px 16px; border: 1px dashed #9fb09a; border-radius: 12px; display: grid; gap: 6px; font: 400 12.5px/1.4 'Nunito Sans', sans-serif; color: #5c6b58; }
    .key span { color: #1f2a1f; margin-right: 4px; }
    .key .l { font: 600 italic 18px/1 'Lora', serif; }
    .key .n { font: 700 15px/1 'Nunito Sans', sans-serif; }
    .like, form button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .like:active, form button:not(:disabled):active { transform: scale(.96); }
    /* iOS zooms into fields below 16px — keep them at 16 on touch. */
    @media (pointer: coarse) { .like { min-height: 40px; } form button { min-height: 44px; } input, textarea { font-size: 16px; } }
    @container (max-width: 520px) { .comments li { font-size: 16px; } }
    @keyframes in { from { opacity: 0; transform: translateY(6px); } }
    @media (prefers-reduced-motion: reduce) { .comments li { animation: none; } .like svg { transition: none; } }
  `,
})
export class PersLoraNunitoSans {
  protected readonly uid = 'u' + Math.random().toString(36).slice(2, 8);
  protected readonly hero = photo('allotment-tomatoes', 1000, 560);
  protected readonly avatar = photo('allotment-graham', 80, 80);
  protected readonly liked = signal(false);
  protected readonly likes = signal(37);
  protected readonly name = signal('');
  protected readonly text = signal('');
  protected readonly comments = signal<Comment[]>([
    { id: 1, name: 'Ruth', when: '2 days ago', text: 'Does the fermenting step matter for cherry tomatoes too? Mine are tiny this year.' },
    { id: 2, name: 'Mrs Kaur (plot 9)', when: 'yesterday', text: 'Told you it was a good one.' },
  ]);

  constructor() {
    loadGoogleFonts('Lora:ital,wght@0,500;0,600;1,500;1,600', 'Nunito+Sans:opsz,wght@6..12,400;6..12,700');
  }

  toggleLike(): void {
    this.liked.set(!this.liked());
    this.likes.update((n) => n + (this.liked() ? 1 : -1));
  }

  val(e: Event): string {
    return (e.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  add(e: Event): void {
    e.preventDefault();
    const n = this.name().trim();
    const t = this.text().trim();
    if (!n || !t) return;
    this.comments.update((list) => [...list, { id: Date.now(), name: n, when: 'just now', text: t }]);
    this.text.set('');
  }
}
