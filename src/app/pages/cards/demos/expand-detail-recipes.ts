import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  mins: number;
  serves: number;
  kcal: number;
  img: string;
  ingredients: string[];
  steps: string[];
}

const EASE = 'cubic-bezier(.2,.8,.2,1)';

@Component({
  selector: 'demo-expand-detail-recipes',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.escape)': 'close()' },
  template: `
    <div class="list" [attr.inert]="open() ? '' : null">
      <h3>Weeknight, but make it nice</h3>
      <ul class="cards">
        @for (r of recipes; track r.id) {
          <li>
            <button type="button" class="card" [class.hidden]="open()?.id === r.id" (click)="show(r, $event)" [attr.aria-label]="'Open recipe: ' + r.name">
              <span class="ph"><img [src]="r.img" [appImgFallback]="r.id" [alt]="'Photo of ' + r.name" loading="lazy" /></span>
              <span class="meta">
                <span class="cu">{{ r.cuisine }}</span>
                <span class="nm">{{ r.name }}</span>
                <span class="mins">{{ r.mins }} min · serves {{ r.serves }}</span>
              </span>
            </button>
          </li>
        }
      </ul>
    </div>

    @if (open(); as r) {
      <section class="detail" role="dialog" aria-modal="true" [attr.aria-label]="r.name">
        <div class="hero" #hero><img [src]="r.img" [appImgFallback]="r.id" [alt]="'Photo of ' + r.name" /></div>
        <div class="content">
          <button type="button" class="close" (click)="close()" aria-label="Close recipe">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
          <p class="cu">{{ r.cuisine }}</p>
          <h4>{{ r.name }}</h4>
          <dl class="facts">
            <div><dt>Time</dt><dd>{{ r.mins }} min</dd></div>
            <div><dt>Serves</dt><dd>{{ r.serves }}</dd></div>
            <div><dt>Per plate</dt><dd>{{ r.kcal }} kcal</dd></div>
          </dl>
          <div class="cols">
            <div>
              <p class="h">You'll need</p>
              <ul class="ing">
                @for (i of r.ingredients; track i) {
                  <li>{{ i }}</li>
                }
              </ul>
            </div>
            <div>
              <p class="h">Method</p>
              <ol class="steps">
                @for (s of r.steps; track s) {
                  <li>{{ s }}</li>
                }
              </ol>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    :host {
      display: block; position: relative; min-height: 100%; overflow: hidden;
      background: #24172a; color: #fbf3e8; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size;
    }
    .list { padding: clamp(18px, 4cqi, 40px); }
    h3 { font-family: 'Gloock', serif; font-weight: 400; font-size: clamp(26px, 4cqi, 40px); line-height: 1.05; margin-bottom: 20px; max-width: 18ch; }
    .cards { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr)); gap: 16px; }
    .card { width: 100%; border: 0; padding: 0; background: #fffaf2; color: #24172a; border-radius: 18px; overflow: hidden; cursor: pointer; text-align: left; display: block; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @media (hover: hover) { .card:hover { transform: translateY(-4px); box-shadow: 0 24px 40px -24px rgba(0,0,0,.7); } }
    .card:active { transform: scale(.98); }
    .card:focus-visible { outline: 3px solid #f0b54a; outline-offset: 3px; }
    .card.hidden { visibility: hidden; }
    .ph { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #e8dccb; }
    .ph img, .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .meta { display: grid; gap: 3px; padding: 12px 14px 14px; }
    .cu { font-size: 12px; color: #a35a1c; font-weight: 600; }
    .nm { font-family: 'Gloock', serif; font-size: 19px; line-height: 1.1; }
    .mins { font-size: 12.5px; color: #6f5f73; }

    .detail {
      position: absolute; inset: 0; z-index: 5; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(18px, 3cqi, 34px);
      align-items: start; padding: clamp(18px, 3.4cqi, 36px); background: #fffaf2; color: #24172a; overflow: auto;
      overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
    }
    .hero { aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; transform-origin: 0 0; background: #e8dccb; position: sticky; top: 0; }
    .content { position: relative; padding-right: 50px; }
    .close { position: absolute; top: 0; right: 0; width: 42px; height: 42px; border-radius: 50%; border: 1px solid #d8cbbb; background: #fffaf2; color: #24172a; display: grid; place-items: center; cursor: pointer; transition: background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .close:hover, .close:active { background: #24172a; color: #fffaf2; }
    .close svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    h4 { font-family: 'Gloock', serif; font-weight: 400; font-size: clamp(28px, 4cqi, 42px); line-height: 1; margin-top: 4px; }
    .facts { display: flex; gap: 22px; margin: 16px 0; padding: 12px 0; border-top: 1px solid #e6d9c8; border-bottom: 1px solid #e6d9c8; }
    dt { font-size: 11.5px; color: #6f5f73; }
    dd { margin: 0; font-weight: 600; font-size: 15px; }
    .cols { display: grid; grid-template-columns: 1fr 1.4fr; gap: 20px; }
    .h { font-weight: 600; font-size: 13.5px; margin-bottom: 8px; color: #a35a1c; }
    .ing { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; font-size: 14px; }
    .ing li::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #f0b54a; margin-right: 8px; vertical-align: middle; }
    .steps { margin: 0; padding-left: 18px; display: grid; gap: 8px; font-size: 14px; line-height: 1.5; }
    .steps li::marker { font-family: 'Gloock', serif; color: #a35a1c; }
    @container (max-width: 640px) {
      .detail { grid-template-columns: 1fr; }
      .hero { position: relative; }
      .cols { grid-template-columns: 1fr; }
    }
    @container (max-width: 480px) {
      .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      .meta { padding: 10px 11px 12px; }
      .nm { font-size: 16px; }
      .mins { font-size: 11.5px; }
      .facts { gap: 16px; }
      /* on phones the close button floats over the hero so the title gets the full width */
      .content { padding-right: 0; position: static; }
      .close { position: sticky; float: right; top: 0; margin: 0 0 8px 12px; z-index: 2; box-shadow: 0 6px 16px -8px rgba(36,23,42,.5); }
    }
  `,
})
export class ExpandDetailRecipes {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  protected readonly openId = signal<string | null>(null);
  protected readonly open = computed(() => this.recipes.find((r) => r.id === this.openId()) ?? null);
  private origin: HTMLElement | null = null;
  private busy = false;

  protected readonly recipes: Recipe[] = [
    { id: 'rc1', name: 'Charred greens & tahini bowl', cuisine: 'Levantine', mins: 25, serves: 2, kcal: 540, img: unsplash('photo-1512621776951-a57141f2eefd', 800, 600),
      ingredients: ['1 head broccoli', '200g cooked freekeh', '3 tbsp tahini', '1 lemon', 'Pomegranate seeds', 'Toasted almonds'],
      steps: ['Char the broccoli in a dry pan until blistered, 6–8 minutes.', 'Whisk tahini with lemon, salt and cold water until pourable.', 'Pile freekeh into bowls, top with greens, drizzle and scatter.'] },
    { id: 'rc2', name: 'Brown-butter ricotta pancakes', cuisine: 'Brunch', mins: 30, serves: 3, kcal: 610, img: unsplash('photo-1567620905732-2d1ec7ab7445', 800, 600),
      ingredients: ['250g ricotta', '2 eggs, separated', '120g flour', '40g butter', 'Maple syrup', 'Blueberries'],
      steps: ['Brown the butter until nutty; cool slightly.', 'Mix ricotta, yolks, flour and butter; fold in whipped whites.', 'Cook ladlefuls on a medium pan, 2 minutes a side.'] },
    { id: 'rc3', name: 'Blistered tomato flatbread', cuisine: 'Italian-ish', mins: 40, serves: 4, kcal: 480, img: unsplash('photo-1565299624946-b28f40a0ae38', 800, 600),
      ingredients: ['300g pizza dough', 'Cherry tomatoes', 'Fior di latte', 'Basil', 'Chilli oil'],
      steps: ['Heat the oven and a tray to 250°C.', 'Stretch the dough thin, scatter tomatoes and torn cheese.', 'Bake 8–10 minutes; finish with basil and chilli oil.'] },
    { id: 'rc4', name: 'Miso salmon & greens', cuisine: 'Japanese', mins: 20, serves: 2, kcal: 520, img: unsplash('photo-1546069901-ba9599a7e63c', 800, 600),
      ingredients: ['2 salmon fillets', '1 tbsp white miso', '1 tsp honey', 'Pak choi', 'Sesame seeds', 'Rice'],
      steps: ['Brush salmon with miso and honey.', 'Grill 7–9 minutes until caramelised at the edges.', 'Wilt the pak choi and serve over rice with sesame.'] },
  ];

  constructor() {
    loadGoogleFonts('Gloock');
  }

  private rel(el: Element): DOMRect {
    const h = this.host.nativeElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return new DOMRect(r.left - h.left, r.top - h.top, r.width, r.height);
  }

  protected show(r: Recipe, e: MouseEvent): void {
    if (this.busy) return;
    const card = e.currentTarget as HTMLElement;
    this.origin = card;
    const from = this.rel(card.querySelector('.ph')!);
    this.openId.set(r.id);
    afterNextRender(
      () => {
        const host = this.host.nativeElement;
        const detail = host.querySelector<HTMLElement>('.detail');
        const hero = host.querySelector<HTMLElement>('.hero');
        if (!detail || !hero) return;
        detail.querySelector<HTMLElement>('.close')?.focus({ preventScroll: true });
        if (prefersReducedMotion()) return;
        this.busy = true;
        const to = this.rel(hero);
        const s = from.width / to.width;
        hero.animate(
          [
            { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${s})`, borderRadius: `${18 / s}px ${18 / s}px 0 0` },
            { transform: 'none', borderRadius: '18px' },
          ],
          { duration: 560, easing: EASE },
        );
        detail.animate([{ backgroundColor: 'rgba(255,250,242,0)' }, { backgroundColor: 'rgba(255,250,242,1)' }], { duration: 380, easing: 'ease-out' });
        const content = detail.querySelector<HTMLElement>('.content');
        content
          ?.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 140, easing: EASE, fill: 'backwards' })
          .finished.then(
            () => (this.busy = false),
            () => (this.busy = false),
          );
      },
      { injector: this.injector },
    );
  }

  protected close(): void {
    if (!this.openId() || this.busy) return;
    const host = this.host.nativeElement;
    const hero = host.querySelector<HTMLElement>('.hero');
    const detail = host.querySelector<HTMLElement>('.detail');
    const target = this.origin?.querySelector('.ph');
    const finish = () => {
      this.openId.set(null);
      this.busy = false;
      this.origin?.focus({ preventScroll: true });
    };
    if (!hero || !detail || !target || prefersReducedMotion()) {
      finish();
      return;
    }
    this.busy = true;
    const from = this.rel(hero);
    const to = this.rel(target);
    const s = to.width / from.width;
    detail.querySelector<HTMLElement>('.content')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    detail.animate([{ backgroundColor: 'rgba(255,250,242,1)' }, { backgroundColor: 'rgba(255,250,242,0)' }], { duration: 420, fill: 'forwards' });
    hero
      .animate(
        [
          { transform: 'none', borderRadius: '18px' },
          { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(${s})`, borderRadius: `${18 / s}px ${18 / s}px 0 0` },
        ],
        { duration: 480, easing: EASE, fill: 'forwards' },
      )
      .finished.then(finish, finish);
  }
}
