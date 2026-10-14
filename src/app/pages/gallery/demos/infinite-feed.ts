import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { photo } from '../../../shared/media';

interface Post {
  id: number;
  by: string;
  place: string;
  wide: boolean;
  src: string;
}

const PEOPLE = ['Amara Osei', 'Jun Watanabe', 'Clara Mendes', 'Viktor Hale', 'Sana Qureshi', 'Leo Marchetti', 'Ingrid Dahl', 'Tomás Rey', 'Nia Brooks', 'Yusuf Kaya', 'Elodie Blanc', 'Ravi Menon'];
const PLACES = ['Lisbon', 'Hokkaido', 'Cape Town', 'Oaxaca', 'Reykjavík', 'Tbilisi', 'Hội An', 'Valparaíso', 'Fès', 'Bergen', 'Kyoto', 'Havana', 'Matera', 'Tasmania', 'Chefchaouen', 'Patagonia'];
const MAX = 120;
const PAGE = 9;

@Component({
  selector: 'demo-infinite-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div>
        <h3>Daily Light</h3>
        <p>Community picks, refreshed every morning</p>
      </div>
      <p class="count mono" aria-live="polite">{{ posts().length }} <span>/ {{ max }}</span></p>
    </header>
    <div #scroller class="scroller" tabindex="0" aria-label="Photo feed, scroll to load more" (scroll)="onScroll()">
      <ul class="grid" role="list" [attr.aria-busy]="loading()">
        @for (p of posts(); track p.id) {
          <li class="card" [class.wide]="p.wide" [class.ready]="loaded().has(p.id)">
            <div class="ph"><img [src]="p.src" [alt]="'Photograph ' + (p.id + 1) + ' by ' + p.by + ', ' + p.place" loading="lazy" (load)="mark(p.id)" (error)="mark(p.id)" /></div>
            <div class="meta"><span class="av" [style.--h]="(p.id * 47) % 360" aria-hidden="true"></span><strong>{{ p.by }}</strong><span>{{ p.place }}</span></div>
          </li>
        }
        @if (loading()) {
          @for (s of skeletons; track s) {
            <li class="card skel" aria-hidden="true"><div class="ph"></div><div class="meta"><span class="av"></span><i></i></div></li>
          }
        }
      </ul>
      @if (done()) {
        <p class="end">You’re all caught up — {{ max }} photographs today.</p>
      } @else {
        <div #sentinel class="sentinel" aria-hidden="true"></div>
      }
    </div>
    @if (scrolled()) {
      <button type="button" class="top" (click)="toTop()">Back to top</button>
    }
  `,
  styles: `
    :host { display: grid; grid-template-rows: auto 1fr; height: 620px; position: relative; background: #f7f7f8; color: #18181b; container-type: inline-size; }
    .mono { font-family: var(--font-mono); }
    header { display: flex; justify-content: space-between; align-items: end; padding: 20px clamp(14px, 3cqw, 28px) 14px; border-bottom: 1px solid #e7e7ea; background: #fff; }
    h3 { font-family: var(--font-display); font-size: clamp(22px, 3cqw, 30px); font-weight: 700; letter-spacing: -0.03em; }
    header p { font-size: 12.5px; color: #71717a; }
    .count { font-size: 18px; color: #18181b; } .count span { color: #a1a1aa; font-size: 13px; }
    .scroller { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 16px clamp(14px, 3cqw, 28px) 28px; scrollbar-width: thin; }
    .scroller:focus-visible { outline: 2px solid #f97316; outline-offset: -3px; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    @container (max-width: 560px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    .card { background: #fff; border-radius: 14px; padding: 6px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px -12px rgba(0,0,0,.2); animation: enter .5s cubic-bezier(.2,.8,.2,1) both; }
    .card.wide { grid-column: span 2; }
    @keyframes enter { from { opacity: 0; transform: translateY(14px); } }
    .ph { position: relative; aspect-ratio: 4 / 5; border-radius: 10px; overflow: hidden;
      background: linear-gradient(100deg, #ececef 30%, #f6f6f8 50%, #ececef 70%) 0 0 / 220% 100%; animation: shimmer 1.3s linear infinite; }
    .card.wide .ph { aspect-ratio: auto; height: calc(100% - 38px); min-height: 160px; }
    @keyframes shimmer { to { background-position: -220% 0; } }
    .ph img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity .6s ease, transform .9s cubic-bezier(.2,.7,.2,1); }
    .card.ready .ph { animation: none; }
    .card.ready img { opacity: 1; transform: none; }
    .meta { display: flex; align-items: center; gap: 8px; padding: 8px 4px 4px; font-size: 12.5px; min-width: 0; }
    .meta strong { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta span:last-child { color: #71717a; margin-left: auto; white-space: nowrap; }
    .av { flex: none; width: 20px; height: 20px; border-radius: 50%; background: hsl(var(--h, 0) 80% 70%); }
    .skel .av { background: #ececef; }
    .skel i { display: block; height: 10px; width: 50%; border-radius: 5px; background: #ececef; }
    .sentinel { height: 1px; }
    .end { text-align: center; font-size: 13px; color: #71717a; padding: 26px 0 6px; }
    .top { position: absolute; left: 50%; bottom: 16px; translate: -50% 0; border: 0; background: #18181b; color: #fff; font-size: 13px; padding: 9px 16px; border-radius: 99px;
      cursor: pointer; box-shadow: 0 10px 24px -10px rgba(0,0,0,.5); animation: enter .3s ease-out; }
    .top:hover { background: #f97316; }
    .top { min-height: 40px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .top:active { background: #f97316; scale: .96; }
    @container (max-width: 420px) {
      header { gap: 10px; }
      .grid { gap: 10px; }
      .meta { font-size: 11.5px; gap: 6px; }
      .meta span:last-child { display: none; }
    }
  `,
})
export class InfiniteFeed {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly max = MAX;
  protected readonly skeletons = Array.from({ length: PAGE }, (_, i) => i);
  protected readonly posts = signal<Post[]>(this.make(0, 12));
  protected readonly loading = signal(false);
  protected readonly loaded = signal<Set<number>>(new Set());
  protected readonly scrolled = signal(false);
  protected readonly done = computed(() => this.posts().length >= MAX);
  private io?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) this.loadMore();
      }, { root: this.scroller().nativeElement, rootMargin: '0px 0px 240px 0px' });
      this.watch();
    });
    this.destroyRef.onDestroy(() => { this.io?.disconnect(); clearTimeout(this.timer); });
  }

  private make(from: number, n: number): Post[] {
    return Array.from({ length: n }, (_, k) => {
      const id = from + k;
      return {
        id, by: PEOPLE[(id * 5) % PEOPLE.length], place: PLACES[(id * 7) % PLACES.length], wide: id % 11 === 4,
        src: photo('daily-light-' + id, id % 11 === 4 ? 900 : 480, 600),
      };
    });
  }

  /** (Re)observe the sentinel so a still-visible sentinel triggers another page. */
  private watch(): void {
    const s = this.sentinel()?.nativeElement;
    if (!this.io) return;
    this.io.disconnect();
    if (s) this.io.observe(s);
  }

  private loadMore(): void {
    if (this.loading() || this.done()) return;
    this.loading.set(true);
    this.timer = setTimeout(() => {
      const have = this.posts().length;
      this.posts.update((p) => [...p, ...this.make(have, Math.min(PAGE, MAX - have))]);
      this.loading.set(false);
      afterNextRender(() => this.watch(), { injector: this.injector });
    }, 750);
  }

  mark(id: number): void {
    if (!this.loaded().has(id)) this.loaded.update((s) => new Set(s).add(id));
  }

  onScroll(): void {
    const v = this.scroller().nativeElement.scrollTop > 600;
    if (v !== this.scrolled()) this.scrolled.set(v);
  }

  toTop(): void {
    this.scroller().nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
