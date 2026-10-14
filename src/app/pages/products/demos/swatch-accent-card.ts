import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Finish {
  id: string;
  name: string;
  hex: string;
  tint: string;
  ink: string;
  hue: number;
}

@Component({
  selector: 'demo-swatch-accent-card',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" [style.--accent]="finish().hex" [style.--tint]="finish().tint" [style.--ink]="finish().ink">
      <article class="card">
        <header class="top">
          <span class="badge">New finish</span>
          <span class="bag" aria-live="polite">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
            <span class="count" [class.bump]="bump()">{{ bagCount() }}</span>
            <span class="visually-hidden">items in bag</span>
          </span>
        </header>

        <div class="media">
          <div class="halo" aria-hidden="true"></div>
          <img
            [src]="img"
            appImgFallback="aster-headphones"
            [style.filter]="'hue-rotate(' + finish().hue + 'deg) saturate(1.05)'"
            alt="Aster over-ear wireless headphones"
          />
        </div>

        <div class="body">
          <div class="row">
            <h3>Aster ANC Over-Ear</h3>
            <p class="price">{{ price }}</p>
          </div>
          <p class="meta">Adaptive noise cancelling · 40h battery · {{ finish().name }}</p>

          <fieldset class="swatches">
            <legend>Finish <strong>{{ finish().name }}</strong></legend>
            <div class="dots">
              @for (f of finishes; track f.id) {
                <button
                  type="button"
                  class="dot"
                  [class.on]="f.id === finish().id"
                  [style.--c]="f.hex"
                  [attr.aria-label]="f.name"
                  [attr.aria-pressed]="f.id === finish().id"
                  (click)="pick(f)"
                ></button>
              }
            </div>
          </fieldset>

          <button type="button" class="add" [class]="'add ' + state()" (click)="add()" [disabled]="state() === 'adding'">
            <span class="lbl idle-l">Add to bag</span>
            <span class="lbl adding-l" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="lbl added-l">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              Added — {{ finish().name }}
            </span>
          </button>
        </div>
      </article>
    </div>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 40px 16px;
      font-family: 'Manrope', 'Geist', sans-serif;
      background: #e9ebef;
    }
    .wrap {
      --accent: #e5b53a; --tint: #fbf3dc; --ink: #2a2006;
      display: grid; place-items: center; width: 100%;
      background: radial-gradient(70% 60% at 50% 40%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%);
      transition: background .5s;
    }
    .card {
      width: min(340px, 100%); border-radius: 28px; overflow: hidden;
      background: #fff; color: #15171c;
      box-shadow: 0 40px 70px -40px color-mix(in srgb, var(--accent) 70%, #000), 0 2px 0 rgba(0,0,0,.03);
      transition: box-shadow .5s;
    }
    .top { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px 0; }
    .badge {
      font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 999px;
      background: var(--tint); color: var(--ink); transition: background .4s, color .4s;
    }
    .bag { position: relative; display: inline-flex; width: 36px; height: 36px; border-radius: 50%; place-items: center; justify-content: center; align-items: center; background: #f3f4f6; }
    .bag svg { width: 18px; height: 18px; fill: none; stroke: #15171c; stroke-width: 1.7; stroke-linejoin: round; }
    .count {
      position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
      background: var(--accent); color: var(--ink); font-size: 11px; font-weight: 800; display: grid; place-items: center;
      transition: background .4s;
    }
    .count.bump { animation: bump .45s cubic-bezier(.3,1.6,.5,1); }
    @keyframes bump { 40% { transform: scale(1.5); } }
    .media { position: relative; aspect-ratio: 1 / .86; display: grid; place-items: center; margin: 10px 20px 0; border-radius: 20px; overflow: hidden; background: var(--tint); transition: background .4s; }
    .media img { width: 100%; height: 100%; object-fit: cover; transition: filter .6s ease, transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) { .card:hover .media img { transform: scale(1.04) rotate(-1.5deg); } }
    .halo { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(transparent 60%, rgba(0,0,0,.12)); }
    .body { padding: 18px 20px 20px; }
    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    h3 { font-size: 19px; font-weight: 800; letter-spacing: -.02em; }
    .price { font-weight: 700; font-size: 17px; }
    .meta { font-size: 13px; color: #6a6f7a; margin-top: 4px; }
    .swatches { border: 0; padding: 0; margin: 16px 0 18px; }
    legend { font-size: 12.5px; color: #6a6f7a; padding: 0; margin-bottom: 8px; }
    legend strong { color: #15171c; font-weight: 700; }
    .dots { display: flex; gap: 10px; }
    .dot {
      width: 28px; height: 28px; border-radius: 50%; border: 0; cursor: pointer; background: var(--c);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); position: relative; transition: transform .2s;
    }
    .dot::after { content: ''; position: absolute; inset: -5px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; transform: scale(.8); transition: .25s; }
    .dot.on::after { opacity: 1; transform: scale(1); }
    .dot::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; }
    @media (hover: hover) { .dot:hover { transform: translateY(-2px); } }
    .dot:active { transform: scale(.9); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .add {
      position: relative; width: 100%; height: 52px; border: 0; border-radius: 16px; cursor: pointer;
      background: #15171c; color: #fff; font-weight: 700; font-size: 15px; overflow: hidden;
      transition: background .35s, transform .15s;
    }
    .add:active { transform: scale(.98); }
    .add.added { background: var(--accent); color: var(--ink); }
    .lbl { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform .35s cubic-bezier(.2,.8,.2,1), opacity .25s; opacity: 0; transform: translateY(100%); }
    .idle .idle-l, .adding .adding-l, .added .added-l { opacity: 1; transform: none; }
    .adding .idle-l, .added .idle-l, .added .adding-l { transform: translateY(-100%); }
    .adding-l i { width: 7px; height: 7px; border-radius: 50%; background: #fff; animation: dot .8s infinite ease-in-out; }
    .adding-l i:nth-child(2) { animation-delay: .12s; } .adding-l i:nth-child(3) { animation-delay: .24s; }
    @keyframes dot { 50% { transform: translateY(-6px); opacity: .5; } }
    .added-l svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  `,
})
export class SwatchAccentCard {
  protected readonly img = unsplash(PRODUCT_PHOTOS.headphones, 700, 600);
  protected readonly price = '$349';
  protected readonly finishes: Finish[] = [
    { id: 'saffron', name: 'Saffron', hex: '#e5b53a', tint: '#fbf1d6', ink: '#2a2006', hue: 0 },
    { id: 'lagoon', name: 'Lagoon', hex: '#2bb3a3', tint: '#d9f3ef', ink: '#05302b', hue: 130 },
    { id: 'iris', name: 'Iris', hex: '#6d6af0', tint: '#e5e4fd', ink: '#13124a', hue: 200 },
    { id: 'rosewood', name: 'Rosewood', hex: '#e2607a', tint: '#fbe1e6', ink: '#3d0a15', hue: 300 },
  ];
  protected readonly finish = signal<Finish>(this.finishes[0]);
  protected readonly state = signal<'idle' | 'adding' | 'added'>('idle');
  protected readonly bagCount = signal(1);
  protected readonly bump = signal(false);
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    loadGoogleFonts('Manrope:wght@400;600;700;800');
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
  }

  pick(f: Finish): void {
    this.finish.set(f);
    if (this.state() === 'added') this.state.set('idle');
  }

  add(): void {
    this.state.set('adding');
    this.timers.push(
      setTimeout(() => {
        this.state.set('added');
        this.bagCount.update((n) => n + 1);
        this.bump.set(true);
      }, 750),
      setTimeout(() => this.bump.set(false), 1250),
      setTimeout(() => this.state.set('idle'), 2600),
    );
  }
}
