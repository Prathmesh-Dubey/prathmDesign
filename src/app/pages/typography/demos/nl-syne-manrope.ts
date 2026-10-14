import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Link { src: string; title: string; why: string; }

@Component({
  selector: 'demo-nl-syne-manrope',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="issue">
        <header class="mast">
          <p class="name">Signal<span>&amp;</span>Noise</p>
          <p class="no"><b>Issue 87</b><span>Thursday 15 Oct 2026 · 6 min read · 12,480 readers</span></p>
        </header>

        <section class="open">
          <p class="hello">Hello again,</p>
          <p>This week I tried to use only keyboard shortcuts for a whole day of design work. I lasted until 11:40. The links below are the things that kept me busy after I gave up — plus one chart I can’t stop thinking about.</p>
        </section>

        <section class="block pink">
          <h2><span>01</span> Three links</h2>
          <ol class="links">
            @for (l of links; track l.title) {
              <li><a href="#" (click)="$event.preventDefault()">{{ l.title }}</a><span class="src">{{ l.src }}</span><p>{{ l.why }}</p></li>
            }
          </ol>
        </section>

        <section class="block mint">
          <h2><span>02</span> Tool of the week</h2>
          <p><b>Hatchmark</b> turns any SVG into a pen-plotter-ready hatched drawing, right in the browser. Free, open source, and dangerously fun.</p>
        </section>

        <section class="block">
          <h2><span>03</span> One chart</h2>
          <div class="chart" role="img" aria-label="Share of new websites using a variable font: 2021 9%, 2022 15%, 2023 24%, 2024 33%, 2025 41%, 2026 48%">
            @for (b of chart; track b.y) {
              <div class="col"><span class="bar" [style.height.%]="b.v * 1.8"></span><span class="v">{{ b.v }}%</span><span class="y">{{ b.y }}</span></div>
            }
          </div>
          <p class="cap">Share of new websites shipping at least one variable font. Almost half, up from one in eleven.</p>
        </section>

        <section class="sub" aria-label="Subscribe">
          @if (done()) {
            <p class="thanks">You’re in. Issue 88 lands next Thursday.</p>
          } @else {
            <h2>Get the next issue</h2>
            <p>One email a week. Design, type and tools. No tracking pixels.</p>
            <form (submit)="submit($event)" novalidate>
              <label class="vh" [attr.for]="uid + '-nl-sn-email'">Email address</label>
              <input [id]="uid + '-nl-sn-email'" type="email" placeholder="you&#64;studio.com" [value]="email()" (input)="onInput($event)" [attr.aria-invalid]="touched() && !valid()" [attr.aria-describedby]="uid + '-nl-sn-err'" />
              <button type="submit">Subscribe</button>
            </form>
            <p [id]="uid + '-nl-sn-err'" class="err" aria-live="polite">{{ touched() && !valid() ? 'That doesn’t look like an email address yet.' : '' }}</p>
          }
        </section>

        <footer class="key" aria-label="Type specimen">
          <span class="ks">Syne</span><span>700–800 · wide display, 26–64 px</span>
          <span class="km">Manrope</span><span>400 / 600 / 800 · reading 16 / 27 px</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #e9e7f0; color: #141414; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; padding: clamp(12px, 3cqi, 30px) 12px; }
    .issue { max-width: 640px; margin: 0 auto; background: #fff; border-radius: 18px; padding: clamp(20px, 5cqi, 40px); box-shadow: 0 20px 40px -30px rgba(20,20,20,.5); }
    .mast { border-bottom: 2px solid #141414; padding-bottom: 16px; }
    .name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(36px, 8.4cqi, 64px); line-height: .9; letter-spacing: -0.04em; }
    .name span { font-weight: 400; color: #ff5fa2; margin: 0 .04em; }
    .no { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 12px; font: 400 13px/1.3 'Manrope', sans-serif; color: #666; }
    .no b { font-weight: 800; color: #141414; }
    .open { margin-top: 22px; font: 400 16px/1.7 'Manrope', sans-serif; max-width: 60ch; }
    .hello { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 6px; }
    .block { margin-top: 18px; padding: 18px 20px; border-radius: 14px; background: #f4f3f7; font: 400 15.5px/1.65 'Manrope', sans-serif; }
    .pink { background: #ffe1ee; }
    .mint { background: #c9f5e9; }
    h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(22px, 3.6cqi, 28px); line-height: 1; letter-spacing: -0.03em; display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
    h2 span { font: 600 12px/1 'Manrope', sans-serif; letter-spacing: 0; padding: 4px 7px; border: 1.5px solid #141414; border-radius: 999px; }
    .links { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
    .links a { font: 800 16px/1.35 'Manrope', sans-serif; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; text-decoration-color: #ff5fa2; }
    .links a:hover { text-decoration-color: #141414; }
    .src { font-size: 12px; color: #7a5566; margin-left: 8px; }
    .links p { color: #3d3d3d; margin-top: 2px; }
    .block b { font-weight: 800; }
    .chart { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; height: 180px; align-items: end; padding-top: 10px; }
    .col { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px; }
    .bar { width: 100%; max-width: 46px; background: #141414; border-radius: 6px 6px 2px 2px; order: 2; }
    .col:last-child .bar { background: #ff5fa2; }
    .v { font: 800 12px/1 'Manrope', sans-serif; order: 1; font-variant-numeric: tabular-nums; }
    .y { font: 400 11.5px/1 'Manrope', sans-serif; color: #666; order: 3; }
    .cap { font-size: 13.5px; color: #555; margin-top: 10px; }
    .sub { margin-top: 18px; padding: 22px 20px; border-radius: 14px; background: #141414; color: #fff; font: 400 15px/1.55 'Manrope', sans-serif; }
    .sub h2 { color: #fff; }
    .sub > p { color: #c8c8c8; }
    form { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    input { flex: 1 1 200px; font: 400 15px/1 'Manrope', sans-serif; padding: 12px 14px; border-radius: 10px; border: 1.5px solid #3a3a3a; background: #1f1f1f; color: #fff; }
    input:focus { outline: none; border-color: #c9f5e9; }
    input[aria-invalid='true'] { border-color: #ff5fa2; }
    form button { font: 800 15px/1 'Manrope', sans-serif; padding: 12px 18px; border-radius: 10px; border: 0; background: #c9f5e9; color: #141414; cursor: pointer; }
    form button:hover { background: #fff; }
    .err { color: #ff8fbf; font-size: 13px; min-height: 1.4em; margin-top: 6px; }
    .thanks { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: #c9f5e9; animation: pop .4s cubic-bezier(.3,1.5,.5,1); }
    .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 22px; font: 400 12px/1.3 'Manrope', sans-serif; color: #666; }
    .ks { font: 800 22px/1 'Syne', sans-serif; color: #141414; letter-spacing: -0.03em; }
    .km { font: 800 17px/1 'Manrope', sans-serif; color: #141414; }
    form button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    form button:active { transform: scale(.96); background: #fff; }
    /* iOS zooms into inputs below 16px — keep it at 16 on touch. */
    @media (pointer: coarse) { input { font-size: 16px; } form button { min-height: 44px; } .links a { padding: 2px 0; } }
    @container (max-width: 520px) { .block { font-size: 16px; } .chart { gap: 5px; } .src { display: block; margin: 2px 0 0; } }
    @keyframes pop { from { opacity: 0; transform: scale(.9); } }
    @media (prefers-reduced-motion: reduce) { .thanks { animation: none; } }
  `,
})
export class NlSyneManrope {
  protected readonly uid = 'u' + Math.random().toString(36).slice(2, 8);
  protected readonly links: Link[] = [
    { src: 'type.today', title: 'How Cyrillic italics actually work', why: 'A patient, illustrated tour of why the italic “т” looks like an “m”.' },
    { src: 'Ishikawa Studio', title: 'Designing a train timetable for colour-blind riders', why: 'Five iterations, real commuter testing, and a lovely final poster.' },
    { src: 'Craig Ferrier', title: 'The case against hover menus on touch screens', why: 'Short and convincing. I sent it to two clients.' },
  ];
  protected readonly chart = [{ y: '21', v: 9 }, { y: '22', v: 15 }, { y: '23', v: 24 }, { y: '24', v: 33 }, { y: '25', v: 41 }, { y: '26', v: 48 }];
  protected readonly email = signal('');
  protected readonly touched = signal(false);
  protected readonly done = signal(false);
  protected readonly valid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email().trim()));

  constructor() {
    loadGoogleFonts('Syne:wght@400;700;800', 'Manrope:wght@400;600;800');
  }

  onInput(e: Event): void {
    this.email.set((e.target as HTMLInputElement).value);
  }

  submit(e: Event): void {
    e.preventDefault();
    this.touched.set(true);
    if (this.valid()) this.done.set(true);
  }
}
