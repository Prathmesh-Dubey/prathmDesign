import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChildren } from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface View {
  id: number;
  label: string;
  src: string;
  thumb: string;
}

const VIEWS = ['Front', 'Handle detail', 'Glaze close-up', 'Stacked set', 'In use'];

@Component({
  selector: 'demo-thumb-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <div class="gallery">
        <div class="main" (pointerenter)="enter($event)" (pointerleave)="leave($event)" (pointermove)="track($event)"
          (pointerdown)="down($event)" (pointerup)="up($event)" (pointercancel)="t0 = null"
          [class.inspect]="inspect()" [style.--ox.%]="ox()" [style.--oy.%]="oy()">
          @for (v of views; track v.id; let i = $index) {
            <img [src]="v.src" [alt]="'Hasami stoneware mug — ' + v.label + ' view'" [class.on]="i === active()" [attr.aria-hidden]="i !== active()" draggable="false" />
          }
          <span class="badge">{{ active() + 1 }} / {{ views.length }} · {{ views[active()].label }}</span>
          <span class="hint" aria-hidden="true"><span class="m">Hover to inspect</span><span class="tch">Tap to inspect · swipe for more</span></span>
          <button type="button" class="arr l" (click)="select(active() - 1)" aria-label="Previous image">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4l-6 6 6 6" /></svg>
          </button>
          <button type="button" class="arr r" (click)="select(active() + 1)" aria-label="Next image">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
          </button>
        </div>
        <div class="thumbs" role="tablist" aria-label="Product images">
          @for (v of views; track v.id; let i = $index) {
            <button #thumb type="button" role="tab" [attr.aria-selected]="i === active()" [tabindex]="i === active() ? 0 : -1"
              [attr.aria-label]="v.label" (click)="select(i)" (keydown)="thumbKey($event)" [class.on]="i === active()">
              <img [src]="v.thumb" alt="" />
            </button>
          }
        </div>
      </div>

      <div class="info">
        <p class="maker">Maruhiro · Hasami, Nagasaki</p>
        <h3>Block Mug, Set of Two</h3>
        <p class="price">¥ 5,280 <span>incl. tax</span></p>
        <p class="desc">Thrown in semi-porcelain and dipped in a matte celadon glaze. Stacks flat, holds 330 ml, safe in the dishwasher.</p>
        <div class="swatches" role="radiogroup" aria-label="Glaze">
          @for (g of glazes; track g.name; let i = $index) {
            <button type="button" role="radio" [attr.aria-checked]="glaze() === i" [attr.aria-label]="g.name" (click)="glaze.set(i)"
              [style.--c]="g.hex" [class.on]="glaze() === i"></button>
          }
          <span>{{ glazes[glaze()].name }}</span>
        </div>
        <button type="button" class="buy">Add to bag</button>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #e8ecf0; color: #1c232b; font-family: 'Manrope', var(--font-body);
      padding: clamp(14px, 3cqw, 32px); }
    .layout { display: grid; grid-template-columns: minmax(0, 400px) minmax(0, 420px); justify-content: center; gap: clamp(18px, 4cqw, 48px); align-items: center;
      background: #fff; border-radius: 20px; padding: clamp(12px, 2.4cqw, 24px); box-shadow: 0 20px 50px -30px rgba(28,35,43,.35); }
    @container (max-width: 680px) { .layout { grid-template-columns: 1fr; } }
    /* touch: swipe = next/previous view, tap = 2x loupe that follows the finger, tap again to close */
    .main { position: relative; aspect-ratio: 1; border-radius: 14px; overflow: hidden; background: #f1f3f5; cursor: crosshair; touch-action: pan-y;
      -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }
    .main.inspect { touch-action: none; }
    .tch { display: none; }
    @media (hover: none) { .m { display: none; } .tch { display: inline; } }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .arr:active { transform: scale(.92); }
    .thumbs button:active img { opacity: 1; }
    .buy:active { background: #3b5b7a; transform: scale(.99); }
    @media (pointer: coarse) { .arr { width: 42px !important; height: 42px !important; } }
    .main img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .5s ease, transform .35s ease-out;
      transform-origin: var(--ox) var(--oy); }
    .main img.on { opacity: 1; }
    .main.inspect img.on { transform: scale(2.1); }
    .badge { position: absolute; left: 12px; top: 12px; background: rgba(255,255,255,.92); border-radius: 99px; padding: 5px 11px; font-size: 12px; font-weight: 600; }
    .hint { position: absolute; right: 12px; top: 12px; font-size: 11.5px; color: #fff; background: rgba(28,35,43,.6); padding: 5px 10px; border-radius: 99px; transition: opacity .3s; }
    .main.inspect .hint, .main.inspect .badge { opacity: 0; }
    .arr { position: absolute; top: 50%; translate: 0 -50%; width: 38px; height: 38px; border-radius: 50%; border: 0; background: #fff; display: grid; place-items: center; cursor: pointer;
      box-shadow: 0 6px 16px -6px rgba(0,0,0,.3); transition: opacity .3s, transform .2s; }
    .arr:hover { transform: scale(1.08); }
    .arr svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .l { left: 12px; } .r { right: 12px; }
    .thumbs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 10px; }
    .thumbs button { position: relative; aspect-ratio: 1; padding: 0; border: 0; border-radius: 10px; overflow: hidden; cursor: pointer; background: #f1f3f5; }
    .thumbs button::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 2px transparent; transition: box-shadow .25s; }
    .thumbs button.on::after { box-shadow: inset 0 0 0 2px #1c232b; }
    .thumbs img { width: 100%; height: 100%; object-fit: cover; opacity: .7; transition: opacity .25s, transform .4s; }
    .thumbs button:hover img, .thumbs button.on img { opacity: 1; }
    .thumbs button:hover img { transform: scale(1.06); }
    .maker { font-size: 12.5px; color: #5d6b78; font-weight: 600; }
    h3 { font-size: clamp(24px, 3.4cqw, 34px); font-weight: 800; letter-spacing: -0.03em; margin-top: 6px; line-height: 1.05; }
    .price { font-size: 20px; font-weight: 700; margin-top: 12px; } .price span { font-size: 12px; font-weight: 500; color: #5d6b78; }
    .desc { font-size: 14px; line-height: 1.6; color: #45515d; margin-top: 12px; max-width: 38ch; }
    .swatches { display: flex; align-items: center; gap: 10px; margin-top: 18px; font-size: 13px; color: #45515d; }
    .swatches button { position: relative; width: 26px; height: 26px; border-radius: 50%; border: 0; background: var(--c); cursor: pointer; box-shadow: 0 0 0 2px #fff, 0 0 0 3px #d4dae0; transition: box-shadow .2s; }
    .swatches button::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; }
    .swatches { gap: 14px; }
    .swatches button.on { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1c232b; }
    .buy { margin-top: 22px; width: 100%; height: 50px; border: 0; border-radius: 12px; background: #1c232b; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; transition: background .2s; }
    .buy:hover { background: #3b5b7a; }
  `,
})
export class ThumbProduct {
  private readonly thumbEls = viewChildren<ElementRef<HTMLButtonElement>>('thumb');
  protected readonly views: View[] = VIEWS.map((label, id) => ({
    id, label, src: photo('hasami-mug-' + id, 1000, 1000), thumb: photo('hasami-mug-' + id, 200, 200),
  }));
  protected readonly glazes = [
    { name: 'Celadon', hex: '#a9c3b4' }, { name: 'Ash white', hex: '#e6e2da' }, { name: 'Indigo', hex: '#34476b' },
  ];
  protected readonly glaze = signal(0);
  protected readonly active = signal(0);
  protected readonly inspect = signal(false);
  protected readonly ox = signal(50);
  protected readonly oy = signal(50);

  constructor() {
    loadGoogleFonts('Manrope:wght@400;500;600;700;800');
  }

  select(i: number): void {
    const n = this.views.length;
    this.active.set((i + n) % n);
    this.inspect.set(false);
  }

  protected t0: { id: number; x: number; y: number; swiped: boolean; moved: boolean } | null = null;

  enter(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.inspect.set(true);
  }

  leave(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.inspect.set(false);
  }

  private origin(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.ox.set(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    this.oy.set(Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)));
  }

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' || (e.target as HTMLElement).closest('button')) return;
    this.t0 = { id: e.pointerId, x: e.clientX, y: e.clientY, swiped: false, moved: false };
    if (this.inspect()) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      this.origin(e);
    }
  }

  track(e: PointerEvent): void {
    if (e.pointerType === 'mouse') { this.origin(e); return; }
    const t = this.t0;
    if (!t || t.id !== e.pointerId) return;
    const dx = e.clientX - t.x, dy = e.clientY - t.y;
    if (Math.abs(dx) + Math.abs(dy) > 8) t.moved = true;
    if (this.inspect()) { this.origin(e); return; }   // loupe follows the finger
    if (!t.swiped && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      t.swiped = true;
      this.select(this.active() + (dx < 0 ? 1 : -1));
    }
  }

  up(e: PointerEvent): void {
    const t = this.t0;
    this.t0 = null;
    if (!t || t.id !== e.pointerId || t.moved) return;
    // a clean tap toggles the loupe at the tapped point
    if (!this.inspect()) this.origin(e);
    this.inspect.set(!this.inspect());
  }

  thumbKey(e: KeyboardEvent): void {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in map) next = this.active() + map[e.key];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = this.views.length - 1;
    if (next === null) return;
    e.preventDefault();
    this.select(next);
    this.thumbEls()[this.active()]?.nativeElement.focus();
  }
}
