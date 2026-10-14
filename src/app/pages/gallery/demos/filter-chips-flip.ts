import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

type Cat = 'Residential' | 'Hospitality' | 'Retail' | 'Workplace';

interface Project {
  id: number;
  name: string;
  city: string;
  cat: Cat;
  src: string;
}

const CATS: Cat[] = ['Residential', 'Hospitality', 'Retail', 'Workplace'];

const PROJECTS: [string, string, Cat][] = [
  ['Villa Skog', 'Bergen', 'Residential'],
  ['Hotel Fjære', 'Ålesund', 'Hospitality'],
  ['Norrøn Store', 'Oslo', 'Retail'],
  ['Kontor 9', 'Trondheim', 'Workplace'],
  ['Hytte Lyng', 'Hemsedal', 'Residential'],
  ['Bakeriet', 'Stavanger', 'Retail'],
  ['Spa Saltvann', 'Lofoten', 'Hospitality'],
  ['Brygge House', 'Bergen', 'Residential'],
  ['Studio Torv', 'Oslo', 'Workplace'],
  ['Café Mose', 'Tromsø', 'Hospitality'],
  ['Atelier Kvist', 'Drammen', 'Retail'],
  ['Loft Sentrum', 'Oslo', 'Residential'],
  ['Havn Offices', 'Kristiansand', 'Workplace'],
  ['Lodge Isbre', 'Jostedal', 'Hospitality'],
  ['Granhus', 'Lillehammer', 'Residential'],
];

@Component({
  selector: 'demo-filter-chips-flip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <h3>Studio Halden</h3>
        <p>Selected interiors, 2019–2026</p>
      </div>
      <div class="chips" role="toolbar" aria-label="Filter projects by sector">
        <button type="button" [class.on]="filter() === 'All'" [attr.aria-pressed]="filter() === 'All'" (click)="setFilter('All')">
          All <span>{{ projects.length }}</span>
        </button>
        @for (c of cats; track c) {
          <button type="button" [class.on]="filter() === c" [attr.aria-pressed]="filter() === c" (click)="setFilter(c)">
            {{ c }} <span>{{ counts()[c] }}</span>
          </button>
        }
      </div>
    </header>
    <p class="sr" aria-live="polite">{{ visible().length }} projects shown</p>
    <ul class="grid" role="list">
      @for (p of visible(); track p.id) {
        <li class="item" [attr.data-id]="p.id">
          <img [src]="p.src" [alt]="p.name + ', ' + p.city + ' — Studio Halden project photograph'" loading="lazy" />
          <div class="cap">
            <strong>{{ p.name }}</strong>
            <span>{{ p.city }} · {{ p.cat }}</span>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; container-type: inline-size; min-height: 100%; background: #f6f5f3; color: #1f1d1a; padding: clamp(16px, 3cqw, 30px); font-family: 'Sora', var(--font-body); }
    header { display: flex; justify-content: space-between; align-items: end; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
    h3 { font-size: clamp(22px, 3.2cqw, 32px); font-weight: 600; letter-spacing: -0.04em; }
    header p { font-size: 12.5px; color: #77716a; margin-top: 2px; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chips button { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 6px 0 14px; border-radius: 99px; border: 1px solid #dcd8d2; background: #fff;
      font-size: 13px; cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
    .chips button span { min-width: 22px; height: 22px; border-radius: 99px; display: grid; place-items: center; font-size: 11px; background: #efece8; color: #5f5a54; font-family: var(--font-mono); transition: inherit; }
    .chips button:hover { border-color: #1f1d1a; }
    .chips button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; flex: none; }
    .chips button:active { transform: scale(.96); }
    @media (pointer: coarse) { .chips button { height: 40px; } }
    @container (max-width: 600px) {
      header { display: grid; gap: 12px; }
      .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; overscroll-behavior-x: contain; scroll-snap-type: x proximity;
        margin: 0 calc(-1 * clamp(16px, 3cqw, 30px)); padding: 2px clamp(16px, 3cqw, 30px); }
      .chips::-webkit-scrollbar { display: none; }
      .chips button { scroll-snap-align: start; }
    }
    .chips button.on { background: #1f1d1a; color: #fff; border-color: #1f1d1a; }
    .chips button.on span { background: #c9a227; color: #1f1d1a; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
    @container (max-width: 860px) { .grid { grid-template-columns: repeat(4, 1fr); } }
    @container (max-width: 600px) { .grid { grid-template-columns: repeat(3, 1fr); } .cap span { display: none; } }
    @container (max-width: 420px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
    .item { position: relative; aspect-ratio: 4 / 3; border-radius: 10px; overflow: hidden; background: #e5e1db; will-change: transform; }
    .item img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
    .item:hover img { transform: scale(1.05); }
    .cap { position: absolute; inset: auto 0 0; padding: 26px 10px 10px; background: linear-gradient(transparent, rgba(20,18,16,.78)); color: #fff; display: grid; }
    .cap strong { font-size: 13.5px; font-weight: 600; }
    .cap span { font-size: 11px; opacity: .8; }
  `,
})
export class FilterChipsFlip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  protected readonly cats = CATS;
  protected readonly projects: Project[] = PROJECTS.map(([name, city, cat], id) => ({ id, name, city, cat, src: photo('halden-' + id, 480, 600) }));
  protected readonly filter = signal<Cat | 'All'>('All');
  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.projects : this.projects.filter((p) => p.cat === f);
  });
  protected readonly counts = computed(() => {
    const c = { Residential: 0, Hospitality: 0, Retail: 0, Workplace: 0 } as Record<Cat, number>;
    for (const p of this.projects) c[p.cat]++;
    return c;
  });
  private busy = false;

  constructor() {
    loadGoogleFonts('Sora:wght@400;600');
  }

  private items(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.item'));
  }

  async setFilter(f: Cat | 'All'): Promise<void> {
    if (f === this.filter() || this.busy) return;
    if (prefersReducedMotion()) { this.filter.set(f); return; }
    this.busy = true;
    const keep = new Set(this.projects.filter((p) => f === 'All' || p.cat === f).map((p) => p.id));
    const before = new Map<number, DOMRect>();
    const leaving: Animation[] = [];
    for (const el of this.items()) {
      const id = +(el.dataset['id'] ?? -1);
      before.set(id, el.getBoundingClientRect());
      if (!keep.has(id)) leaving.push(el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.85)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }));
    }
    await Promise.all(leaving.map((a) => a.finished.catch(() => undefined)));
    this.filter.set(f);
    afterNextRender(() => {
      this.items().forEach((el, i) => {
        const id = +(el.dataset['id'] ?? -1);
        const first = before.get(id);
        const last = el.getBoundingClientRect();
        if (first) {
          const dx = first.left - last.left, dy = first.top - last.top;
          const sx = first.width / last.width, sy = first.height / last.height;
          el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: '0 0' }, { transform: 'none', transformOrigin: '0 0' }],
            { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
        } else {
          el.animate([{ opacity: 0, transform: 'translateY(16px) scale(.9)' }, { opacity: 1, transform: 'none' }],
            { duration: 460, delay: 120 + i * 30, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
        }
      });
      this.busy = false;
    }, { injector: this.injector });
  }
}
