import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface P { n: string; title: string; date: string; tag: string; }

@Component({
  selector: 'demo-min-schibsted',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="logo">Small Batch<sup>®</sup></span>
          <span class="desc">Product design notes by Ivo Brandt</span>
        </header>

        <section class="lead">
          <p class="meta">Latest · 13 Oct 2026 · 5 min</p>
          <h1 [style.font-weight]="wght()">One typeface, every job</h1>
          <p class="sub">Why our whole product now runs on a single family — and how weight, size and spacing do the work a second font used to.</p>
          <div class="ctl">
            <label [attr.for]="uid + '-wght-range'">Headline weight</label>
            <input [id]="uid + '-wght-range'" type="range" min="400" max="900" step="10" [value]="wght()" (input)="setW($event)" [attr.aria-valuetext]="wght() + ' weight'" />
            <output [attr.for]="uid + '-wght-range'">{{ wght() }}</output>
          </div>
        </section>

        <ol class="posts">
          @for (p of posts; track p.n) {
            <li>
              <span class="n">{{ p.n }}</span>
              <a href="#" (click)="$event.preventDefault()">{{ p.title }}</a>
              <span class="tag">{{ p.tag }}</span>
              <time>{{ p.date }}</time>
            </li>
          }
        </ol>

        <footer class="key" aria-label="Type specimen">
          <p class="fam">Schibsted Grotesk <span>— single family, variable 400–900</span></p>
          <div class="ladder">
            @for (w of ladder; track w) {
              <button type="button" [class.on]="wght() === w" (click)="wght.set(w)" [style.font-weight]="w" [attr.aria-label]="'Set headline weight to ' + w">Aa<small>{{ w }}</small></button>
            }
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 620px; background: #ffffff; color: #0e0e10; container-type: inline-size; font-family: 'Schibsted Grotesk', sans-serif; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 880px; margin: 0 auto; padding: clamp(20px, 5cqi, 48px) clamp(18px, 5cqi, 48px) 32px; }
    .top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; align-items: baseline; padding-bottom: 14px; border-bottom: 2px solid #0e0e10; }
    .logo { font-weight: 900; font-size: 20px; letter-spacing: -0.03em; }
    .logo sup { font-weight: 400; font-size: 10px; color: #ff3b30; }
    .desc { font-weight: 400; font-size: 13.5px; color: #6c6c72; }
    .lead { padding: clamp(28px, 6cqi, 56px) 0 28px; border-bottom: 1px solid #e6e6ea; }
    .meta { font-weight: 500; font-size: 13px; color: #ff3b30; font-variant-numeric: tabular-nums; }
    h1 { font-size: clamp(42px, 9cqi, 96px); line-height: .95; letter-spacing: -0.045em; margin-top: 14px; text-wrap: balance; max-width: 12ch; transition: font-weight .25s ease; }
    .sub { font-weight: 400; font-size: clamp(17px, 2.2cqi, 20px); line-height: 1.5; color: #3d3d44; margin-top: 18px; max-width: 50ch; text-wrap: pretty; }
    .ctl { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; font-size: 13px; font-weight: 500; }
    .ctl input { flex: 1 1 200px; max-width: 320px; accent-color: #ff3b30; }
    output { font-weight: 700; font-variant-numeric: tabular-nums; min-width: 3ch; }
    .posts { list-style: none; padding: 0; margin: 0; }
    .posts li { display: grid; grid-template-columns: 36px 1fr auto auto; gap: 14px; align-items: baseline; padding: 15px 0; border-bottom: 1px solid #e6e6ea; }
    .n { font-weight: 400; font-size: 13px; color: #a0a0a8; font-variant-numeric: tabular-nums; }
    .posts a { font-weight: 600; font-size: clamp(17px, 2.4cqi, 21px); letter-spacing: -0.015em; text-decoration: none; line-height: 1.25; transition: color .15s; }
    .posts a:hover { color: #ff3b30; }
    .tag { font-weight: 500; font-size: 12px; color: #6c6c72; border: 1px solid #e0e0e6; padding: 3px 8px; border-radius: 999px; }
    time { font-weight: 400; font-size: 13px; color: #6c6c72; font-variant-numeric: tabular-nums; }
    @container (max-width: 520px) { .posts li { grid-template-columns: 28px 1fr; } .tag, time { grid-column: 2; justify-self: start; } }
    .key { margin-top: 30px; padding: 18px; background: #f4f4f6; border-radius: 12px; }
    .fam { font-weight: 700; font-size: 15px; }
    .fam span { font-weight: 400; color: #6c6c72; }
    .ladder { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .ladder button { border: 1px solid transparent; background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 26px; line-height: 1; letter-spacing: -0.02em; cursor: pointer; display: grid; gap: 4px; justify-items: center; font-family: inherit; }
    .ladder small { font-size: 10.5px; font-weight: 500; color: #6c6c72; letter-spacing: 0; }
    .ladder button.on { border-color: #ff3b30; }
    .ctl input { touch-action: pan-y; cursor: pointer; }
    .ladder button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform .12s, border-color .15s; }
    .ladder button:active { transform: scale(.94); }
    @media (pointer: coarse) {
      .ladder button { min-width: 48px; }
      /* Finger-sized slider: 28px thumb, 40px-tall hit strip. */
      .ctl input { -webkit-appearance: none; appearance: none; height: 40px; margin: 0; background: transparent; }
      .ctl input::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: #e6e6ea; }
      .ctl input::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; margin-top: -11px; border-radius: 50%; background: #ff3b30; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.3); }
      .ctl input::-moz-range-track { height: 6px; border-radius: 999px; background: #e6e6ea; }
      .ctl input::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #ff3b30; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.3); }
    }
    @container (max-width: 520px) { .ctl label { flex-basis: 100%; } .ctl input { max-width: none; } }
    @media (prefers-reduced-motion: reduce) { h1 { transition: none; } }
  `,
})
export class MinSchibsted {
  protected readonly uid = 'u' + Math.random().toString(36).slice(2, 8);
  protected readonly wght = signal(800);
  protected readonly ladder = [400, 500, 600, 700, 800, 900];
  protected readonly posts: P[] = [
    { n: '01', title: 'Hierarchy without a second font', date: '02 Oct', tag: 'Type' },
    { n: '02', title: 'We deleted 41 colour tokens', date: '18 Sep', tag: 'Systems' },
    { n: '03', title: 'Empty states that actually help', date: '04 Sep', tag: 'UX' },
    { n: '04', title: 'The case for boring buttons', date: '21 Aug', tag: 'UI' },
  ];

  constructor() {
    loadGoogleFonts('Schibsted+Grotesk:ital,wght@0,400..900;1,400..900');
  }

  setW(e: Event): void {
    this.wght.set(+(e.target as HTMLInputElement).value);
  }
}
