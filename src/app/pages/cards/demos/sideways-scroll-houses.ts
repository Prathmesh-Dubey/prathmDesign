import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface House {
  id: string;
  name: string;
  place: string;
  year: number;
  area: string;
  img: string;
}

@Component({
  selector: 'demo-sideways-scroll-houses',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(scroll)': 'onScroll()', tabindex: '0', 'aria-label': 'Studio Ondo selected houses. Scroll to move through the projects.' },
  template: `
    <section class="intro">
      <p class="small">Studio Ondo · Selected houses 2016–2025</p>
      <h3>Five houses that sit lightly on the ground.</h3>
      <p class="hint">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="16" rx="5" /><path d="M12 7v3" /></svg>
        Scroll or swipe up inside this panel
      </p>
    </section>

    <section class="pin" #pin [style.height.px]="pinHeight()">
      <div class="sticky">
        <div class="bar">
          <span>{{ pad(current() + 1) }} / {{ pad(houses.length) }}</span>
          <span class="line"><i [style.transform]="'scaleX(' + progress() + ')'"></i></span>
        </div>
        <div class="track" #track [style.transform]="'translate3d(' + -shift() + 'px,0,0)'">
          @for (h of houses; track h.id; let i = $index) {
            <article class="card" [class.near]="i === current()">
              <div class="img"><img [src]="h.img" [appImgFallback]="h.id" [alt]="'Photograph of ' + h.name" loading="lazy" /></div>
              <div class="cap">
                <h4>{{ h.name }}</h4>
                <p>{{ h.place }}</p>
                <dl>
                  <div><dt>Year</dt><dd>{{ h.year }}</dd></div>
                  <div><dt>Area</dt><dd>{{ h.area }}</dd></div>
                </dl>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="outro">
      <h3>Building something quiet?</h3>
      <p>We take on four new residential projects a year. Next intake: March 2026.</p>
      <button type="button">Start a conversation</button>
    </section>
  `,
  styles: `
    :host {
      display: block; height: 560px; overflow-y: auto; overscroll-behavior: contain; position: relative;
      background: #cfd3cc; color: #151715; font-family: 'Archivo', 'Geist', sans-serif; container-type: inline-size;
      scrollbar-width: thin; scrollbar-color: #151715 transparent; outline-offset: -3px;
    }
    .intro { min-height: 100%; height: 560px; display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(22px, 5cqi, 52px); gap: 16px; }
    .small { font-size: 13px; }
    h3 { font-weight: 800; font-variation-settings: 'wdth' 70; font-stretch: 70%; font-size: clamp(36px, 7.6cqi, 84px); line-height: .9; letter-spacing: -0.02em; text-transform: uppercase; max-width: 14ch; }
    .hint { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4a4f48; }
    .hint svg { width: 20px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
    .hint path { animation: wheel 1.6s ease-in-out infinite; }
    .pin { position: relative; }
    .sticky { position: sticky; top: 0; height: 560px; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 20px; }
    .bar { display: flex; align-items: center; gap: 14px; padding: 0 clamp(22px, 5cqi, 52px); font-family: 'Geist Mono', monospace; font-size: 12.5px; }
    .line { flex: 1; height: 2px; background: rgba(21,23,21,.15); }
    .line i { display: block; height: 100%; background: #151715; transform-origin: left; }
    .track { display: flex; gap: clamp(14px, 2.4cqi, 26px); padding: 0 clamp(22px, 5cqi, 52px); width: max-content; will-change: transform; }
    .card { width: clamp(240px, 42cqi, 460px); display: flex; flex-direction: column; gap: 12px; }
    @container (max-width: 400px) {
      .card { width: 74cqi; }
      .cap { grid-template-columns: 1fr; }
      dl { grid-column: 1; grid-row: auto; margin-top: 6px; }
    }
    .img { aspect-ratio: 4 / 3; overflow: hidden; background: #b9beb6; }
    .img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(.5); transform: scale(1.06); transition: filter .8s, transform 1.2s cubic-bezier(.2,.7,.2,1); }
    .near .img img { filter: none; transform: scale(1); }
    .cap { display: grid; grid-template-columns: 1fr auto; gap: 2px 16px; align-items: end; }
    h4 { font-weight: 800; font-variation-settings: 'wdth' 75; font-stretch: 75%; font-size: clamp(22px, 3cqi, 30px); text-transform: uppercase; line-height: 1; }
    .cap p { font-size: 13.5px; color: #4a4f48; grid-column: 1; }
    dl { grid-column: 2; grid-row: 1 / span 2; display: flex; gap: 16px; margin: 0; }
    dt { font-family: 'Geist Mono', monospace; font-size: 10.5px; color: #5c625a; }
    dd { margin: 0; font-size: 14px; font-weight: 600; }
    .outro { height: 560px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 14px; padding: clamp(22px, 5cqi, 52px); background: #151715; color: #cfd3cc; }
    .outro p { max-width: 40ch; color: #9ea59b; }
    .outro button { height: 46px; padding: 0 22px; border: 1.5px solid #cfd3cc; background: transparent; color: #cfd3cc; font-weight: 600; font-size: 15px; cursor: pointer; transition: background .2s, color .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .outro button:hover, .outro button:active { background: #cfd3cc; color: #151715; }
    @keyframes wheel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
    /* Touch: this panel is almost as tall as a phone screen, so let the page take over at either end
       instead of trapping the finger inside it (desktop keeps 'contain' for wheel scrolling). */
    @media (hover: none) { :host { overscroll-behavior-y: auto; } }
  `,
})
export class SidewaysScrollHouses {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  protected readonly progress = signal(0);
  private readonly distance = signal(0);
  protected readonly shift = computed(() => this.progress() * this.distance());
  protected readonly pinHeight = computed(() => 560 + this.distance());
  protected readonly current = computed(() => Math.min(this.houses.length - 1, Math.round(this.progress() * (this.houses.length - 1))));

  protected readonly houses: House[] = [
    { id: 'hs1', name: 'Casa Lume', place: 'Comporta, Portugal', year: 2025, area: '210 m²', img: unsplash('photo-1600585154340-be6161a56a0c', 920, 690) },
    { id: 'hs2', name: 'Hytte 9', place: 'Hardanger, Norway', year: 2023, area: '96 m²', img: unsplash('photo-1564013799919-ab600027ffc6', 920, 690) },
    { id: 'hs3', name: 'Pool House', place: 'Mallorca, Spain', year: 2022, area: '140 m²', img: unsplash('photo-1512917774080-9991f1c4c750', 920, 690) },
    { id: 'hs4', name: 'Casa Seca', place: 'Oaxaca, Mexico', year: 2019, area: '180 m²', img: unsplash('photo-1600596542815-ffad4c1539a9', 920, 690) },
    { id: 'hs5', name: 'White Court', place: 'Aarhus, Denmark', year: 2016, area: '320 m²', img: unsplash('photo-1487958449943-2429e8be8625', 920, 690) },
  ];

  constructor() {
    loadGoogleFonts('Archivo:wdth,wght@62..125,400..800');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(() => this.measure());
      ro.observe(this.hostEl);
      ro.observe(this.track().nativeElement);
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  private measure(): void {
    const t = this.track().nativeElement;
    this.distance.set(Math.max(0, t.scrollWidth - this.hostEl.clientWidth));
    this.onScroll();
  }

  protected onScroll(): void {
    const pin = this.pin().nativeElement;
    const range = pin.offsetHeight - this.hostEl.clientHeight;
    const p = range > 0 ? (this.hostEl.scrollTop - pin.offsetTop) / range : 0;
    this.progress.set(Math.max(0, Math.min(1, p)));
  }
}
