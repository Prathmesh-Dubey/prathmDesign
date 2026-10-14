import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

@Component({
  selector: 'demo-pers-fraunces-inter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="hi">hi, I’m <b>Tomás</b></span>
          <nav aria-label="Site"><a href="#" (click)="$event.preventDefault()">Writing</a><a href="#" (click)="$event.preventDefault()">Bread log</a><a href="#" (click)="$event.preventDefault()">About</a></nav>
        </header>

        <p class="meta">Post no. 58 · 4 October 2026 · 7 min</p>
        <h1 [style.font-variation-settings]="fvs()" [style.font-weight]="wght()">One hundred loaves later</h1>
        <p class="sub">What a year of weekend sourdough taught me about patience, notebooks, and lowering my standards in exactly the right places.</p>

        <div class="axes" aria-label="Headline font axes">
          <label>
            <span>Weight <output>{{ wght() }}</output></span>
            <input type="range" min="100" max="900" step="10" [value]="wght()" (input)="wght.set(num($event))" />
          </label>
          <label>
            <span>Softness <output>{{ soft() }}</output></span>
            <input type="range" min="0" max="100" step="1" [value]="soft()" (input)="soft.set(num($event))" />
          </label>
          <label class="chk">
            <input type="checkbox" [checked]="wonk()" (change)="wonk.set(!wonk())" />
            <span>Wonky letters</span>
          </label>
        </div>

        <div class="body">
          <p>Loaf number one was a frisbee. Loaf number nine was a brick with a beautiful crust. Somewhere around loaf thirty I stopped photographing them for friends and started writing them down instead: flour, water, room temperature, how long the dough sat in the fridge, and one honest sentence about how it tasted.</p>
          <p>That notebook turned out to be the most useful thing in my kitchen. Not because it made me precise — I’m still not — but because it made my mistakes <em>legible</em>. Loaves that failed on cold Saturdays failed for the same reason. Once I could see the pattern, I could stop blaming the starter.</p>
          <blockquote>Bake the same bread fifty times before you try a new one. You learn more from repetition than from recipes.</blockquote>
        </div>

        <footer class="key" aria-label="Type specimen">
          <div><span class="kf">Fraunces</span><small>opsz 9–144 · wght 100–900 · SOFT 0–100 · WONK 0/1</small></div>
          <div><span class="ki">Inter Tight</span><small>400 / 500 · 17 px on 1.7 · UI 13 px</small></div>
          <code>{{ fvs() }}</code>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #1b2a6b; color: #ffd7c2; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 820px; margin: 0 auto; padding: clamp(18px, 4cqi, 40px) clamp(16px, 4cqi, 40px) 36px; }
    .top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px 12px; font: 400 14px/1 'Inter Tight', sans-serif; }
    .hi b { font-family: 'Fraunces', serif; font-weight: 600; font-style: italic; font-size: 18px; font-variation-settings: 'SOFT' 100, 'WONK' 1; }
    nav { display: flex; gap: 16px; }
    nav a { text-decoration: none; color: #c9b8d9; }
    nav a:hover { color: #ffd7c2; }
    .meta { font: 500 13px/1 'Inter Tight', sans-serif; color: #ff9f7a; margin-top: clamp(30px, 6cqi, 60px); }
    h1 { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-size: clamp(44px, 9.4cqi, 104px); line-height: .94; letter-spacing: -0.03em; margin-top: 14px; text-wrap: balance; max-width: 12ch; color: #ffe9dc; transition: font-weight .2s, font-variation-settings .2s; }
    .sub { font: 400 clamp(17px, 2.2cqi, 20px)/1.55 'Inter Tight', sans-serif; color: #e8c8b8; margin-top: 18px; max-width: 52ch; text-wrap: pretty; }
    .axes { display: flex; flex-wrap: wrap; gap: 16px 26px; align-items: end; margin-top: 24px; padding: 14px 16px; border-radius: 14px; background: rgba(255,215,194,.08); border: 1px solid rgba(255,215,194,.18); font: 500 12.5px/1 'Inter Tight', sans-serif; }
    .axes label { display: grid; gap: 8px; flex: 1 1 160px; }
    .axes label span { display: flex; justify-content: space-between; }
    output { font-variant-numeric: tabular-nums; color: #ff9f7a; }
    input[type='range'] { accent-color: #ff9f7a; width: 100%; }
    .axes .chk { display: flex; gap: 8px; align-items: center; flex: 0 0 auto; cursor: pointer; }
    .chk input { accent-color: #ff9f7a; width: 16px; height: 16px; }
    .body { margin-top: 30px; max-width: 62ch; font: 400 17px/1.7 'Inter Tight', sans-serif; color: #f3dccf; }
    .body p + p { margin-top: 1em; }
    .body p { text-wrap: pretty; }
    .body em { font-family: 'Fraunces', serif; font-style: italic; font-size: 1.08em; font-variation-settings: 'SOFT' 100, 'WONK' 1; color: #ffe9dc; }
    blockquote { margin: 26px 0 0; padding-left: 20px; border-left: 3px solid #ff9f7a; font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: clamp(22px, 3.2cqi, 28px); line-height: 1.3; color: #ffe9dc; font-variation-settings: 'SOFT' 50, 'WONK' 1; text-wrap: balance; }
    .key { display: flex; flex-wrap: wrap; gap: 14px 30px; align-items: end; margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,215,194,.2); }
    .key div { display: grid; gap: 4px; }
    .key small { font: 400 12px/1.3 'Inter Tight', sans-serif; color: #c9b8d9; }
    .kf { font: 600 26px/1 'Fraunces', serif; font-variation-settings: 'SOFT' 100, 'WONK' 1; color: #ffe9dc; }
    .ki { font: 500 20px/1 'Inter Tight', sans-serif; color: #ffe9dc; }
    .key code { margin-left: auto; font: 400 11.5px/1.3 ui-monospace, monospace; color: #ff9f7a; background: rgba(0,0,0,.2); padding: 6px 8px; border-radius: 6px; }
    input[type='range'] { touch-action: pan-y; cursor: pointer; }
    .axes .chk { -webkit-tap-highlight-color: transparent; }
    @media (pointer: coarse) {
      nav a { padding: 10px 0; margin: -10px 0; }
      .axes .chk { min-height: 40px; }
      .chk input { width: 22px; height: 22px; }
      /* Finger-sized axis sliders: 28px thumb on a 40px-tall hit strip. */
      input[type='range'] { -webkit-appearance: none; appearance: none; height: 40px; margin: 0; background: transparent; }
      input[type='range']::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: rgba(255,215,194,.28); }
      input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; margin-top: -11px; border-radius: 50%; background: #ff9f7a; border: 3px solid #1b2a6b; box-shadow: 0 1px 4px rgba(0,0,0,.35); }
      input[type='range']::-moz-range-track { height: 6px; border-radius: 999px; background: rgba(255,215,194,.28); }
      input[type='range']::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #ff9f7a; border: 3px solid #1b2a6b; box-shadow: 0 1px 4px rgba(0,0,0,.35); }
      .axes label { gap: 4px; }
    }
    @container (max-width: 520px) { .key code { margin-left: 0; } .axes { padding: 12px 14px; } }
    @media (prefers-reduced-motion: reduce) { h1 { transition: none; } }
  `,
})
export class PersFrauncesInter {
  protected readonly wght = signal(640);
  protected readonly soft = signal(100);
  protected readonly wonk = signal(true);
  protected readonly fvs = computed(() => `'SOFT' ${this.soft()}, 'WONK' ${this.wonk() ? 1 : 0}`);

  constructor() {
    loadGoogleFonts('Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1', 'Inter+Tight:wght@400;500');
  }

  num(e: Event): number {
    return +(e.target as HTMLInputElement).value;
  }
}
