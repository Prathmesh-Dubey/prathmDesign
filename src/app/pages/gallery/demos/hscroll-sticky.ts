import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Hour {
  id: number;
  time: string;
  place: string;
  src: string;
}

const HOURS: [string, string][] = [
  ['06:10', 'Jemaa el-Fnaa, before the stalls'],
  ['08:30', 'Mouassine fountain'],
  ['10:45', 'Souk Semmarine'],
  ['13:20', 'Ben Youssef courtyard'],
  ['15:05', 'Le Jardin Secret'],
  ['17:40', 'Rooftops of the Kasbah'],
  ['19:15', 'Koutoubia at dusk'],
  ['22:30', 'Square of the dead, night food'],
];

@Component({
  selector: 'demo-hscroll-sticky',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #scroller class="scroller" tabindex="0" aria-label="A day in Marrakech, scroll down to travel through the day" (scroll)="onScroll()"
      [style.--p]="progress()" [class.night]="progress() > 0.62">
      <section class="intro">
        <p class="by">Photographs by Youssef Amrani</p>
        <h3>A day in <em>Marrakech</em></h3>
        <p class="hint">Scroll inside this frame <span aria-hidden="true">↓</span></p>
      </section>

      <section #runway class="runway">
        <div class="sticky">
          <div class="clock" aria-hidden="true">
            <span class="sun" [style.--a]="progress()"></span>
            <b>{{ hour().time }}</b>
          </div>
          <div #track class="track" [style.transform]="'translate3d(' + -shift() + 'px,0,0)'">
            @for (h of hours; track h.id; let i = $index) {
              <figure [class.tall]="i % 2 === 0">
                <img [src]="h.src" [alt]="'Photograph ' + (i + 1) + ' — ' + h.place + ', ' + h.time" loading="lazy" />
                <figcaption><b>{{ h.time }}</b>{{ h.place }}</figcaption>
              </figure>
            }
          </div>
          <div class="meter" aria-hidden="true"><span [style.transform]="'scaleX(' + progress() + ')'"></span></div>
        </div>
      </section>

      <section class="outro">
        <p>Eight hours of light, one medina.</p>
      </section>
    </div>
  `,
  styles: `
    :host { display: block; height: 560px; font-family: var(--font-body); container-type: inline-size; }
    .scroller { --p: 0; position: relative; height: 100%; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
      background: color-mix(in oklab, #f2c7a5, #1b1531 calc(var(--p) * 100%)); color: #3b1d17; transition: color .6s; }
    .scroller.night { color: #f6e3d6; }
    .scroller:focus-visible { outline: 2px solid #d8572a; outline-offset: -3px; }
    .intro { height: 300px; display: grid; align-content: center; justify-items: start; padding: 0 clamp(18px, 5cqw, 56px); }
    .by { font-size: 13px; opacity: .7; }
    h3 { font-family: 'Young Serif', serif; font-weight: 400; font-size: clamp(36px, 7cqw, 76px); line-height: .95; letter-spacing: -0.02em; margin-top: 10px; }
    h3 em { color: #d8572a; font-style: normal; }
    .hint { margin-top: 18px; font-size: 13px; display: inline-flex; gap: 6px; padding: 6px 12px; border: 1px solid currentColor; border-radius: 99px; opacity: .7; }
    .hint span { animation: bob 1.4s ease-in-out infinite; }
    @keyframes bob { 50% { transform: translateY(3px); } }
    .runway { height: 2600px; }
    .sticky { position: sticky; top: 0; height: 560px; overflow: hidden; display: grid; grid-template-rows: auto 1fr auto; padding: 22px 0 22px; }
    .clock { display: flex; align-items: center; gap: 14px; padding: 0 clamp(18px, 5cqw, 56px); font-family: 'Young Serif', serif; }
    .clock b { font-weight: 400; font-size: clamp(28px, 4.4cqw, 44px); font-variant-numeric: tabular-nums; }
    .sun { position: relative; width: 64px; height: 32px; border-top-left-radius: 64px 64px; border-top-right-radius: 64px 64px; border: 1.5px solid currentColor; border-bottom: 0; opacity: .8; }
    .sun::after { content: ''; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: #d8572a;
      transform: rotate(calc(-90deg + var(--a) * 180deg)) translateY(-31px); transform-origin: 50% 50%; }
    .track { display: flex; align-items: center; gap: clamp(16px, 3cqw, 36px); padding: 0 clamp(18px, 5cqw, 56px); width: max-content; will-change: transform; min-height: 0; }
    figure { margin: 0; width: clamp(210px, 34cqw, 380px); flex: none; }
    @container (max-width: 480px) {
      .intro { height: 260px; }
      figure:not(.tall) { margin-top: 40px; }
      figcaption { font-size: 12px; flex-wrap: wrap; gap: 4px 8px; }
    }
    figure img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 4px; box-shadow: 0 24px 40px -24px rgba(27,21,49,.6); }
    figure.tall img { aspect-ratio: 4 / 5; width: 82%; }
    figure:not(.tall) { margin-top: 70px; }
    figcaption { font-size: 13px; margin-top: 10px; display: flex; gap: 10px; }
    figcaption b { font-family: var(--font-mono); font-weight: 500; color: #d8572a; }
    .meter { margin: 0 clamp(18px, 5cqw, 56px); height: 2px; background: color-mix(in srgb, currentColor 20%, transparent); }
    .meter span { display: block; height: 100%; background: #d8572a; transform-origin: left; }
    .outro { height: 260px; display: grid; place-items: center; font-family: 'Young Serif', serif; font-size: clamp(20px, 3cqw, 30px); }
  `,
})
export class HscrollSticky {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly runway = viewChild.required<ElementRef<HTMLElement>>('runway');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hours: Hour[] = HOURS.map(([time, place], id) => ({ id, time, place, src: photo('marrakech-day-' + id, 760, 760) }));
  protected readonly progress = signal(0);
  private readonly travel = signal(0);
  protected readonly shift = computed(() => this.progress() * this.travel());
  protected readonly hour = computed(() => this.hours[Math.min(this.hours.length - 1, Math.floor(this.progress() * this.hours.length))]);

  constructor() {
    loadGoogleFonts('Young+Serif');
    afterNextRender(() => {
      const measure = () => {
        const t = this.track().nativeElement;
        this.travel.set(Math.max(0, t.scrollWidth - this.scroller().nativeElement.clientWidth));
        this.onScroll();
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(this.scroller().nativeElement);
      ro.observe(this.track().nativeElement);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  onScroll(): void {
    const s = this.scroller().nativeElement;
    const r = this.runway().nativeElement;
    const range = r.offsetHeight - s.clientHeight;
    const p = (s.scrollTop - r.offsetTop) / Math.max(1, range);
    this.progress.set(Math.max(0, Math.min(1, p)));
  }
}
