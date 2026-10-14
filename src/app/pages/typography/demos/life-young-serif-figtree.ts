import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Ing { id: number; qty: number; unit: string; name: string; }

@Component({
  selector: 'demo-life-young-serif-figtree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" #scroller>
      <div class="wrap">
        <header class="site"><span class="logo">Second Helping</span><span>Recipes for weeknights</span></header>

        <div class="intro">
          <div>
            <p class="tags"><span>Vegetarian</span><span>30 minutes</span><span>Autumn</span></p>
            <h1>Charred leek &amp; white bean toast</h1>
            <p class="dek">Soft, sweet leeks, a lemony bean mash and a fried egg if you want one. The kind of dinner that feels like you tried.</p>
            <p class="by">By Hana Morita · 9 October 2026</p>
            <button type="button" class="jump" (click)="jump()">Jump to recipe</button>
          </div>
          <img [src]="hero" alt="Feature image for Charred leek and white bean toast" width="700" height="760" />
        </div>

        <p class="story">I make this most Tuesdays from October to March. The trick is to cook the leeks low and slow until they collapse, then turn the heat right up at the end so the edges catch. Don’t skip the lemon zest in the beans — it’s what makes the whole thing taste bright.</p>

        <section class="card" #recipe aria-label="Recipe">
          <dl class="facts">
            <div><dt>Prep</dt><dd>10 min</dd></div>
            <div><dt>Cook</dt><dd>20 min</dd></div>
            <div><dt>Serves</dt>
              <dd class="serves">
                <button type="button" (click)="serves.set(serves() - 1)" [disabled]="serves() <= 1" aria-label="Fewer servings">−</button>
                <output aria-live="polite">{{ serves() }}</output>
                <button type="button" (click)="serves.set(serves() + 1)" [disabled]="serves() >= 12" aria-label="More servings">+</button>
              </dd>
            </div>
          </dl>

          <div class="cols">
            <div>
              <h2>Ingredients</h2>
              <ul class="ings">
                @for (i of ings; track i.id) {
                  <li>
                    <label [class.done]="checked().has(i.id)">
                      <input type="checkbox" [checked]="checked().has(i.id)" (change)="toggle(i.id)" />
                      <span class="q">{{ fmt(i.qty) }} {{ i.unit }}</span> {{ i.name }}
                    </label>
                  </li>
                }
              </ul>
            </div>
            <div>
              <h2>Method</h2>
              <ol class="steps">
                <li>Slice the leeks into 1 cm rounds and wash well. Cook in the butter and oil over a low heat for 12 minutes, until silky.</li>
                <li>Mash the beans with the lemon zest and juice, garlic and a big pinch of salt. Loosen with a splash of bean liquid.</li>
                <li>Turn the heat to high for the last 3 minutes so the leeks catch at the edges. Toast the bread.</li>
                <li>Spread the beans thickly, pile on the leeks, finish with chilli flakes and a little more oil.</li>
              </ol>
            </div>
          </div>
        </section>

        <footer class="key" aria-label="Type specimen">
          <span class="ky">Young Serif</span><span>400 · headlines, step numbers, 24–52 px</span>
          <span class="kf">Figtree</span><span>400 / 600 / 700 · text 16.5 px, quantities in tabular figures</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 700px; background: #f7f9f2; color: #1f2a1a; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; scroll-behavior: smooth; }
    .wrap { max-width: 940px; margin: 0 auto; padding: clamp(16px, 4cqi, 36px) clamp(16px, 4cqi, 36px) 36px; }
    .site { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font: 400 13px/1 'Figtree', sans-serif; color: #66705e; padding-bottom: 14px; border-bottom: 1px solid #dde3d3; }
    .logo { font: 400 22px/1 'Young Serif', serif; color: #3b6e3b; }
    .intro { display: grid; gap: 22px; margin-top: 24px; }
    @container (min-width: 720px) { .intro { grid-template-columns: 1.15fr 1fr; align-items: center; gap: 36px; } }
    .intro img { width: 100%; aspect-ratio: 7 / 7.6; max-height: 380px; object-fit: cover; border-radius: 200px 200px 16px 16px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tags span { font: 600 12px/1 'Figtree', sans-serif; background: #e3ecd5; color: #2f5a2f; padding: 6px 10px; border-radius: 999px; }
    h1 { font-family: 'Young Serif', serif; font-weight: 400; font-size: clamp(34px, 6cqi, 54px); line-height: 1.04; letter-spacing: -0.015em; margin-top: 14px; text-wrap: balance; }
    .dek { font: 400 17.5px/1.55 'Figtree', sans-serif; color: #44503c; margin-top: 14px; max-width: 44ch; text-wrap: pretty; }
    .by { font: 400 13px/1 'Figtree', sans-serif; color: #66705e; margin-top: 14px; }
    .jump { margin-top: 18px; font: 700 14px/1 'Figtree', sans-serif; background: #f7c548; color: #1f2a1a; border: 0; border-radius: 999px; padding: 12px 18px; cursor: pointer; box-shadow: 0 2px 0 #c99a1d; transition: transform .15s; }
    .jump:hover { transform: translateY(-1px); }
    .story { font: 400 16.5px/1.7 'Figtree', sans-serif; max-width: 64ch; margin-top: 26px; text-wrap: pretty; }
    .card { margin-top: 26px; background: #fff; border-radius: 18px; padding: clamp(18px, 4cqi, 30px); border: 1px solid #dde3d3; scroll-margin-top: 12px; }
    .facts { display: flex; flex-wrap: wrap; gap: 10px 34px; margin: 0; padding-bottom: 16px; border-bottom: 1px dashed #cbd5bd; }
    .facts dt { font: 600 12px/1 'Figtree', sans-serif; color: #66705e; }
    .facts dd { margin: 6px 0 0; font: 400 22px/1 'Young Serif', serif; }
    .serves { display: flex; align-items: center; gap: 10px; }
    .serves button { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #3b6e3b; background: #fff; color: #3b6e3b; font: 700 16px/1 'Figtree', sans-serif; cursor: pointer; }
    .serves button:disabled { opacity: .35; cursor: default; }
    .serves output { min-width: 2ch; text-align: center; font-variant-numeric: tabular-nums; }
    .cols { display: grid; gap: 24px; margin-top: 18px; }
    @container (min-width: 700px) { .cols { grid-template-columns: 1fr 1.4fr; gap: 36px; } }
    h2 { font: 400 24px/1.2 'Young Serif', serif; color: #3b6e3b; }
    .ings { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 2px; }
    .ings label { display: flex; gap: 10px; align-items: baseline; padding: 7px 0; font: 400 15.5px/1.4 'Figtree', sans-serif; cursor: pointer; border-bottom: 1px solid #eef1e8; transition: color .2s; }
    .ings input { accent-color: #3b6e3b; width: 16px; height: 16px; flex: none; transform: translateY(2px); }
    .q { font-weight: 700; font-variant-numeric: tabular-nums; min-width: 5.5ch; }
    .ings label.done { color: #9aa58f; text-decoration: line-through; text-decoration-color: #b8c3ad; }
    .steps { list-style: none; counter-reset: st; padding: 0; margin: 12px 0 0; display: grid; gap: 14px; }
    .steps li { counter-increment: st; display: grid; grid-template-columns: 40px 1fr; font: 400 16px/1.6 'Figtree', sans-serif; }
    .steps li::before { content: counter(st); font: 400 26px/1 'Young Serif', serif; color: #f2a900; -webkit-text-stroke: .5px #1f2a1a; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 24px; font: 400 12.5px/1.4 'Figtree', sans-serif; color: #66705e; }
    .ky { font: 400 20px/1 'Young Serif', serif; color: #1f2a1a; }
    .kf { font: 700 16px/1 'Figtree', sans-serif; color: #1f2a1a; }
    .jump, .serves button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .jump:active { transform: translateY(1px); box-shadow: 0 1px 0 #c99a1d; }
    .serves button { position: relative; }
    .serves button::after { content: ''; position: absolute; inset: -7px; border-radius: 50%; }
    .serves button:not(:disabled):active { background: #3b6e3b; color: #fff; }
    .ings label { -webkit-tap-highlight-color: transparent; }
    @media (pointer: coarse) {
      .serves button { width: 34px; height: 34px; }
      .ings label { padding: 10px 0; }
      .ings input { width: 20px; height: 20px; transform: translateY(4px); }
      .jump { min-height: 44px; }
    }
    @container (max-width: 520px) { .ings label { font-size: 16px; } }
    @media (prefers-reduced-motion: reduce) { .scroll { scroll-behavior: auto; } }
  `,
})
export class LifeYoungSerifFigtree {
  protected readonly hero = photo('second-helping-leeks', 700, 760);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly recipe = viewChild.required<ElementRef<HTMLElement>>('recipe');
  protected readonly serves = signal(2);
  protected readonly checked = signal<Set<number>>(new Set());
  /** Quantities are per 2 servings. */
  protected readonly ings: Ing[] = [
    { id: 1, qty: 2, unit: '', name: 'large leeks' },
    { id: 2, qty: 1, unit: 'tbsp', name: 'butter, plus 1 tbsp olive oil' },
    { id: 3, qty: 400, unit: 'g', name: 'tin butter beans, drained (keep the liquid)' },
    { id: 4, qty: 0.5, unit: '', name: 'lemon, zest and juice' },
    { id: 5, qty: 1, unit: '', name: 'small garlic clove, grated' },
    { id: 6, qty: 2, unit: 'slices', name: 'thick sourdough' },
    { id: 7, qty: 0.5, unit: 'tsp', name: 'chilli flakes' },
  ];

  constructor() {
    loadGoogleFonts('Young+Serif', 'Figtree:wght@400;600;700');
  }

  fmt(per2: number): string {
    const v = (per2 * this.serves()) / 2;
    if (v >= 50) return String(Math.round(v / 10) * 10);
    const whole = Math.floor(v);
    const frac = v - whole;
    const f = frac >= 0.875 ? '' : frac >= 0.625 ? '¾' : frac >= 0.375 ? '½' : frac >= 0.125 ? '¼' : '';
    const w = frac >= 0.875 ? whole + 1 : whole;
    return (w ? String(w) : '') + f || '0';
  }

  toggle(id: number): void {
    const s = new Set(this.checked());
    if (s.has(id)) s.delete(id); else s.add(id);
    this.checked.set(s);
  }

  jump(): void {
    const sc = this.scroller().nativeElement;
    const el = this.recipe().nativeElement;
    sc.scrollTo({ top: el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 12 });
  }
}
