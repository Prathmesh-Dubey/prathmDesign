import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, categoryByKey } from '../core/categories';
import { CategoryKey, DesignExample } from '../core/example.model';
import { ShowcaseComponent } from './showcase.component';

@Component({
  selector: 'app-category-page',
  imports: [ShowcaseComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="intro" [style.--sw]="meta().swatch">
      <div class="intro-inner">
        <div class="chip-swatch" aria-hidden="true">
          <span class="chip-color"></span>
          <span class="chip-label">{{ meta().code }}</span>
        </div>
        <div class="intro-copy">
          <h1>{{ meta().title }}</h1>
          <p class="blurb">{{ meta().blurb }}</p>
        </div>
        <dl class="stats">
          <div><dt>Patterns</dt><dd>{{ examples().length }}</dd></div>
          <div><dt>Families</dt><dd>{{ types().length }}</dd></div>
        </dl>
      </div>
    </section>

    <nav class="filters" aria-label="Filter patterns" [style.--sw]="meta().swatch" [class.searching]="searchOpen()">
      <div class="filters-inner">
        <button type="button" class="search-toggle" (click)="openSearch()" aria-label="Search patterns" [attr.aria-expanded]="searchOpen()">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13.2 13.2L17 17" /></svg>
          @if (query()) { <span class="search-dot" aria-hidden="true"></span> }
        </button>
        <label class="search">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13.2 13.2L17 17" /></svg>
          <span class="visually-hidden">Search patterns</span>
          <input #searchInput type="search" enterkeyhint="search" placeholder="Search {{ meta().title.toLowerCase() }}" [value]="query()" (input)="query.set($any($event.target).value)" (keydown.enter)="searchInput.blur()" />
        </label>
        <button type="button" class="search-close" (click)="closeSearch()">Done</button>
        <div class="chips" role="list">
          <button type="button" role="listitem" [class.on]="active() === null" (click)="choose(null)">
            All <span>{{ examples().length }}</span>
          </button>
          @for (t of types(); track t.name) {
            <button type="button" role="listitem" [class.on]="active() === t.name" (click)="choose(t.name)">
              {{ t.name }} <span>{{ t.count }}</span>
            </button>
          }
        </div>
      </div>
    </nav>

    <div class="list" #list>
      @for (ex of visible(); track ex.id) {
        <app-showcase [example]="ex" [code]="codeFor(ex)" [swatch]="meta().swatch" />
      } @empty {
        <div class="empty">
          <p>No patterns match “{{ query() }}”.</p>
          <button type="button" (click)="reset()">Clear search and filters</button>
        </div>
      }
    </div>

    <nav class="next" aria-label="Other categories">
      @for (c of others(); track c.key) {
        <a [routerLink]="['/', c.path]" [style.--sw]="c.swatch">
          <span class="dot" aria-hidden="true"></span>
          <span class="next-title">{{ c.title }}</span>
          <span class="next-blurb">{{ c.blurb }}</span>
        </a>
      }
    </nav>
  `,
  styles: `
    :host { display: block; }
    .intro { padding: clamp(28px, 6vw, 80px) var(--gutter) clamp(24px, 3.5vw, 44px); }
    .intro-inner {
      max-width: var(--page-max); margin: 0 auto;
      display: grid; grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'swatch copy stats';
      gap: clamp(16px, 3.5vw, 48px); align-items: end;
    }
    .chip-swatch {
      grid-area: swatch; align-self: start;
      width: clamp(64px, 9vw, 128px);
      aspect-ratio: 3 / 4.2;
      border-radius: 12px;
      background: var(--surface);
      padding: 7px 7px 0;
      box-shadow: var(--shadow-lift);
      display: grid; grid-template-rows: 1fr auto;
      transform: rotate(-4deg);
    }
    .chip-color { background: var(--sw); border-radius: 7px; }
    .chip-label { font-family: var(--font-mono); font-size: 12px; padding: 7px 2px; color: var(--ink); }
    .intro-copy { grid-area: copy; min-width: 0; }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(46px, 9vw, 132px);
      font-weight: 700;
      font-variation-settings: 'wdth' 80, 'opsz' 96;
      letter-spacing: -0.035em;
      line-height: .92;
      overflow-wrap: anywhere;
    }
    .blurb { margin-top: 16px; font-size: clamp(16px, 1.5vw, 20px); color: var(--ink-2); max-width: 52ch; text-wrap: pretty; }
    .stats { grid-area: stats; display: flex; gap: clamp(20px, 3vw, 48px); margin: 0; }
    .stats div { display: flex; flex-direction: column-reverse; }
    .stats dt { color: var(--muted); font-size: 14px; }
    .stats dd { margin: 0; font-family: var(--font-display); font-size: clamp(28px, 3.4vw, 48px); font-weight: 600; font-variation-settings: 'wdth' 85; line-height: 1; }

    .filters {
      position: sticky; top: var(--header-h); z-index: 20;
      background: color-mix(in srgb, var(--paper) 86%, transparent);
      backdrop-filter: saturate(1.4) blur(12px);
      -webkit-backdrop-filter: saturate(1.4) blur(12px);
      border-block: 1px solid var(--line-soft);
    }
    .filters-inner { max-width: var(--page-max); margin: 0 auto; padding: 10px var(--gutter); display: flex; gap: 14px; align-items: center; }
    .search { position: relative; flex: 0 0 240px; }
    .search svg, .search-toggle svg { width: 16px; height: 16px; fill: none; stroke: var(--muted); stroke-width: 1.7; stroke-linecap: round; }
    .search svg { position: absolute; left: 12px; top: 50%; translate: 0 -50%; }
    .search input {
      width: 100%; height: 38px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface);
      padding: 0 14px 0 36px; font: inherit; font-size: 16px; color: var(--ink);
    }
    .search input:focus { outline: 2px solid var(--sw); outline-offset: 1px; }
    .search-toggle, .search-close { display: none; }
    .chips {
      display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 2px; min-width: 0;
      overscroll-behavior-x: contain; scroll-snap-type: x proximity;
      mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent);
    }
    .chips::-webkit-scrollbar { display: none; }
    .chips button {
      flex: none; height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid transparent; scroll-snap-align: start;
      background: transparent; font-size: 14px; color: var(--ink-2); cursor: pointer; white-space: nowrap;
      transition: background .15s, transform .1s;
    }
    .chips button span { color: var(--muted); font-size: 12px; margin-left: 3px; font-variant-numeric: tabular-nums; }
    .chips button:hover { border-color: var(--line); background: var(--surface); }
    .chips button:active { transform: scale(.96); }
    .chips button.on { background: var(--ink); color: #fff; }
    .chips button.on span { color: rgba(255,255,255,.65); }

    .list { max-width: var(--page-max); margin: 0 auto; padding: 28px var(--gutter) 40px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; }
    .list > * { min-width: 0; }
    .empty { text-align: center; padding: 60px 0; color: var(--muted); }
    .empty button { margin-top: 12px; border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 10px 18px; cursor: pointer; }

    .next { max-width: var(--page-max); margin: 0 auto; padding: 20px var(--gutter) 80px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
    .next a {
      display: grid; grid-template-columns: auto 1fr; column-gap: 12px; row-gap: 4px;
      padding: 18px; border-radius: var(--radius-md); background: var(--surface); border: 1px solid var(--line-soft);
      text-decoration: none; transition: border-color .15s, transform .1s;
    }
    .next a:hover { border-color: var(--sw); }
    .next a:active { transform: scale(.98); }
    .dot { width: 14px; height: 14px; border-radius: 4px; background: var(--sw); margin-top: 5px; grid-row: span 2; }
    .next-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; }
    .next-blurb { color: var(--muted); font-size: 14px; }

    @media (max-width: 900px) {
      .intro-inner { grid-template-columns: auto minmax(0, 1fr); grid-template-areas: 'swatch copy' 'stats stats'; align-items: start; }
    }

    @media (max-width: 760px) {
      .intro-inner { grid-template-areas: 'swatch copy' 'stats stats'; column-gap: 14px; row-gap: 18px; }
      .chip-swatch { width: 52px; padding: 5px 5px 0; border-radius: 9px; margin-top: 4px; }
      .chip-label { font-size: 10px; padding: 4px 1px; }
      .blurb { margin-top: 12px; }
      .stats { padding-top: 14px; border-top: 1px solid var(--line-soft); }

      /* Compact sticky bar: search tucks behind an icon so only one row stays pinned. */
      .filters-inner { gap: 8px; padding-block: 8px; }
      .search-toggle {
        display: grid; place-items: center; position: relative; flex: none;
        width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); cursor: pointer;
      }
      .search-toggle svg { stroke: var(--ink); }
      .search-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: var(--sw); }
      .search { display: none; flex: 1; }
      .search-close { flex: none; height: 40px; padding: 0 14px; border-radius: 999px; border: 0; background: var(--ink); color: #fff; font-size: 14px; cursor: pointer; }
      .searching .search { display: block; }
      .searching .search-close { display: inline-flex; align-items: center; }
      .searching .search-toggle, .searching .chips { display: none; }

      .list { gap: 18px; padding: 18px 8px 32px; }
      .next { padding-inline: 12px; }
    }
  `,
})
export class CategoryPageComponent {
  readonly category = input.required<CategoryKey>();
  readonly examples = input.required<DesignExample[]>();

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly query = signal('');
  protected readonly active = signal<string | null>(null);
  protected readonly searchOpen = signal(false);
  protected readonly meta = computed(() => categoryByKey(this.category()));
  protected readonly others = computed(() => CATEGORIES.filter((c) => c.key !== this.category()));

  protected readonly types = computed(() => {
    const counts = new Map<string, number>();
    for (const e of this.examples()) counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
    return [...counts].map(([name, count]) => ({ name, count }));
  });

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const a = this.active();
    return this.examples().filter(
      (e) =>
        (!a || e.type === a) &&
        (!q || [e.title, e.type, e.description, ...e.tags].some((s) => s.toLowerCase().includes(q))),
    );
  });

  protected codeFor(ex: DesignExample): string {
    const n = this.examples().indexOf(ex) + 1;
    return `${this.meta().code}-${String(n).padStart(2, '0')}`;
  }

  /** Pick a family; if the reader is deep in the list, bring the top of the results back into view. */
  protected choose(type: string | null): void {
    this.active.set(type);
    const el = this.list().nativeElement;
    const offset = el.getBoundingClientRect().top;
    if (offset < 0) {
      const pinned = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 64;
      window.scrollTo({ top: window.scrollY + offset - pinned + 12, behavior: 'smooth' });
    }
  }

  protected openSearch(): void {
    this.searchOpen.set(true);
    setTimeout(() => this.searchInput().nativeElement.focus());
  }

  protected closeSearch(): void {
    this.searchOpen.set(false);
  }

  protected reset(): void {
    this.query.set('');
    this.active.set(null);
    this.searchOpen.set(false);
  }
}
