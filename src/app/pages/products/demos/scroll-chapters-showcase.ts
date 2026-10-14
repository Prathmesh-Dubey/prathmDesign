import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Chapter {
  no: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
  tone: string;
  img: string;
  alt: string;
  transform: string;
}

@Component({
  selector: 'demo-scroll-chapters-showcase',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroller" #scroller (scroll)="onScroll()" tabindex="0" aria-label="Solace One chapters, scrollable">
      <div class="layout">
        <div class="sticky" [style.background]="chapters[active()].tone">
          @for (c of chapters; track c.no; let i = $index) {
            <img [src]="c.img" [appImgFallback]="'solace-' + i" [alt]="c.alt" [class.on]="i === active()" [style.transform]="i === active() ? c.transform : 'scale(1.15)'" />
          }
          <div class="hud">
            <span class="brand">Solace One</span>
            <span class="mono">{{ chapters[active()].no }} / 0{{ chapters.length }}</span>
          </div>
          <div class="rail" aria-hidden="true"><b [style.transform]="'scaleY(' + progress() + ')'"></b></div>
          <nav class="dots" aria-label="Chapters">
            @for (c of chapters; track c.no; let i = $index) {
              <button type="button" [class.on]="i === active()" (click)="go(i)" [attr.aria-label]="'Go to chapter ' + c.title" [attr.aria-current]="i === active() ? 'step' : null"></button>
            }
          </nav>
        </div>

        <div class="chapters">
          @for (c of chapters; track c.no; let i = $index) {
            <section class="chapter" [attr.data-i]="i" [class.on]="i === active()">
              <span class="no">{{ c.no }}</span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.body }}</p>
              <div class="stat"><strong>{{ c.stat }}</strong><span>{{ c.statLabel }}</span></div>
            </section>
          }
          <section class="chapter end" [attr.data-i]="chapters.length - 1">
            <h3>£399, in four finishes.</h3>
            <button type="button" class="cta" (click)="ordered.set(true)">{{ ordered() ? 'Pre-order confirmed' : 'Pre-order Solace One' }}</button>
            <p class="small">Ships 12 November. Free returns within 60 days.</p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 640px; container-type: inline-size; font-family: 'Geist', sans-serif; color: #15171b; background: #eef0f3; }
    .scroller { position: relative; height: 100%; overflow-y: auto; scroll-behavior: smooth; outline: none; scrollbar-width: thin; }
    .scroller:focus-visible { box-shadow: inset 0 0 0 2px #3a5bd9; }
    .layout { display: grid; grid-template-columns: 1fr 1fr; }
    .sticky { position: sticky; top: 0; height: 640px; overflow: hidden; transition: background .8s ease; }
    .sticky img { position: absolute; inset: 12% 10%; width: 80%; height: 76%; object-fit: cover; border-radius: 22px; opacity: 0; transition: opacity .7s ease, transform 1.1s cubic-bezier(.2,.7,.1,1); box-shadow: 0 40px 60px -30px rgba(0,0,0,.5); }
    .sticky img.on { opacity: 1; }
    .hud { position: absolute; top: 18px; left: 20px; right: 20px; display: flex; justify-content: space-between; color: #fff; font-size: 13px; z-index: 1; }
    .brand { font-family: 'Instrument Serif', serif; font-size: 20px; }
    .mono { font-family: 'Geist Mono', monospace; font-size: 12px; opacity: .85; }
    .rail { position: absolute; left: 20px; top: 70px; bottom: 70px; width: 2px; background: rgba(255,255,255,.25); border-radius: 2px; }
    .rail b { display: block; height: 100%; background: #fff; transform-origin: top; border-radius: 2px; }
    .dots { position: absolute; bottom: 18px; left: 20px; display: flex; gap: 8px; }
    .dots button { position: relative; width: 9px; height: 9px; border-radius: 50%; border: 0; padding: 0; background: rgba(255,255,255,.4); cursor: pointer; transition: .3s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .dots button::after { content: ''; position: absolute; inset: -16px -4px; }
    .dots button:active { background: rgba(255,255,255,.8); }
    .dots button.on { background: #fff; width: 26px; border-radius: 5px; }
    .chapters { padding: 0 clamp(20px, 5cqw, 60px); }
    .chapter { min-height: 560px; display: flex; flex-direction: column; justify-content: center; gap: 14px; opacity: .25; transform: translateY(16px); transition: opacity .6s ease, transform .8s cubic-bezier(.2,.7,.1,1); }
    .chapter.on { opacity: 1; transform: none; }
    .chapter.end { opacity: 1; transform: none; min-height: 420px; padding-bottom: 60px; }
    .no { font-family: 'Geist Mono', monospace; font-size: 12px; color: #3a5bd9; }
    h3 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: clamp(36px, 5.6cqw, 58px); line-height: 1; letter-spacing: -.015em; }
    .chapter p { font-size: 15px; line-height: 1.6; color: #4a4f5a; max-width: 38ch; }
    .stat { display: flex; align-items: baseline; gap: 10px; border-top: 1px solid #d3d7de; padding-top: 14px; margin-top: 6px; }
    .stat strong { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 44px; line-height: 1; }
    .stat span { font-size: 13px; color: #4a4f5a; }
    .cta { align-self: flex-start; height: 50px; padding: 0 26px; border-radius: 999px; border: 0; background: #15171b; color: #fff; cursor: pointer; font-size: 15px; transition: background .3s; }
    @media (hover: hover) { .cta:hover { background: #3a5bd9; } }
    .cta { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:active { background: #3a5bd9; transform: scale(.98); }
    .small { font-size: 13px !important; }
    @container (max-width: 640px) {
      .layout { grid-template-columns: 1fr; }
      .sticky { height: 260px; z-index: 1; }
      .chapter { min-height: 380px; }
      .rail { display: none; }
      .dots { bottom: 10px; }
    }
    @container (max-width: 400px) {
      .sticky { height: 230px; }
      .sticky img { inset: 16% 8% 12%; width: 84%; height: 72%; }
      .chapter { min-height: 400px; gap: 12px; }
      h3 { font-size: 34px; }
      .stat strong { font-size: 36px; }
      .chapter p { font-size: 14.5px; }
    }
  `,
})
export class ScrollChaptersShowcase {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  protected readonly chapters: Chapter[] = [
    { no: '01', title: 'Sound, unfolded.', body: 'Forty-millimetre beryllium drivers tuned in Copenhagen for a wide, unhurried stage — strings you can place, bass you feel rather than hear.', stat: '4–40k', statLabel: 'Hz frequency response', tone: '#1f2b4d', img: unsplash(PRODUCT_PHOTOS.headphones, 800, 900), alt: 'Solace One headphones resting upright', transform: 'scale(1) rotate(0deg)' },
    { no: '02', title: 'Silence on demand.', body: 'Eight microphones read the room 50,000 times a second, folding away engines and office chatter without the pressure of older ANC.', stat: '−42 dB', statLabel: 'peak noise reduction', tone: '#5d7a92', img: unsplash(PRODUCT_PHOTOS.headphonesAlt, 800, 900), alt: 'Solace One headphones in profile', transform: 'scale(1.06) rotate(-3deg)' },
    { no: '03', title: 'Made to disappear.', body: 'Memory-foam cushions wrapped in protein leather and a sprung aluminium band that spreads 268 grams so evenly you forget them.', stat: '268 g', statLabel: 'total weight', tone: '#8c6f62', img: unsplash(PRODUCT_PHOTOS.headphones, 800, 900), alt: 'Close view of the Solace One ear cushion', transform: 'scale(1.5) translate(8%, 6%)' },
    { no: '04', title: 'A week between charges.', body: 'Sixty hours with noise cancelling on. Five minutes on USB-C buys another four — enough for the flight home.', stat: '60 h', statLabel: 'battery with ANC', tone: '#2f4f46', img: unsplash(PRODUCT_PHOTOS.headphonesAlt, 800, 900), alt: 'Solace One headphones folded', transform: 'scale(1.1) rotate(4deg)' },
  ];
  protected readonly active = signal(0);
  protected readonly scrollTop = signal(0);
  protected readonly maxScroll = signal(1);
  protected readonly progress = computed(() => Math.min(1, this.scrollTop() / this.maxScroll()));
  protected readonly ordered = signal(false);

  constructor() {
    loadGoogleFonts('Instrument+Serif:ital@0;1');
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.scroller().nativeElement;
      this.maxScroll.set(Math.max(1, root.scrollHeight - root.clientHeight));
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) this.active.set(Number((en.target as HTMLElement).dataset['i'] ?? 0));
          }
        },
        { root, rootMargin: '-45% 0px -45% 0px' },
      );
      root.querySelectorAll('.chapter').forEach((el) => io.observe(el));
      const ro = new ResizeObserver(() => this.maxScroll.set(Math.max(1, root.scrollHeight - root.clientHeight)));
      ro.observe(root);
      destroy.onDestroy(() => {
        io.disconnect();
        ro.disconnect();
      });
    });
  }

  onScroll(): void {
    this.scrollTop.set(this.scroller().nativeElement.scrollTop);
  }

  go(i: number): void {
    const root = this.scroller().nativeElement;
    const el = root.querySelectorAll<HTMLElement>('.chapter')[i];
    if (!el) return;
    const sticky = root.querySelector<HTMLElement>('.sticky');
    const stacked = sticky ? sticky.offsetWidth >= root.clientWidth - 2 : false;
    const offset = stacked && sticky ? sticky.offsetHeight : 0;
    root.scrollTo({ top: el.offsetTop - offset - (root.clientHeight - offset - el.offsetHeight) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
