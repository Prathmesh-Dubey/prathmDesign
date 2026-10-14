import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Feature {
  id: string;
  title: string;
  body: string;
  icon: string;
  wide?: boolean;
}

@Component({
  selector: 'demo-spotlight-border-features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <p class="kick">Relay · background jobs for TypeScript</p>
      <h3>Everything a queue should do, nothing you have to babysit.</h3>
    </div>
    <div
      class="grid"
      #grid
      [class.active]="inside()"
      (pointerdown)="press($event)"
      (pointermove)="track($event)"
      (pointerenter)="enter($event)"
      (pointerleave)="leave($event)"
      (pointerup)="release($event)"
      (pointercancel)="release($event)"
    >
      @for (f of features; track f.id; let i = $index) {
        <article
          class="card"
          [class.wide]="f.wide"
          tabindex="0"
          [style.--x.px]="px() - (offsets()[i]?.x ?? 0)"
          [style.--y.px]="py() - (offsets()[i]?.y ?? 0)"
        >
          <div class="inner">
            <span class="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path [attr.d]="f.icon" /></svg>
            </span>
            <h4>{{ f.title }}</h4>
            <p>{{ f.body }}</p>
            @if (f.wide) {
              <pre class="code" aria-label="Code sample"><span class="k">await</span> relay.<span class="f">enqueue</span>(<span class="s">'send-receipt'</span>, {{ '{' }} orderId {{ '}' }}, {{ '{' }}
  retries: <span class="n">5</span>, backoff: <span class="s">'exponential'</span>
{{ '}' }});</pre>
            }
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(22px, 4cqi, 44px);
      background: #0b0b0d; color: #ededf0; font-family: 'Schibsted Grotesk', 'Geist', sans-serif; container-type: inline-size;
    }
    .head { max-width: 640px; margin-bottom: 22px; }
    .kick { font-size: 13px; color: #ff9a62; font-weight: 500; }
    h3 { font-size: clamp(22px, 3.4cqi, 34px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin-top: 8px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; position: relative; touch-action: pan-y; -webkit-tap-highlight-color: transparent; }
    .card {
      --x: -999px; --y: -999px;
      position: relative; border-radius: 16px; padding: 1px; outline: none;
      background:
        radial-gradient(260px circle at var(--x) var(--y), rgba(255,154,98,.9), rgba(255,79,123,.5) 35%, transparent 70%),
        #232328;
      transition: transform .3s cubic-bezier(.2,.8,.2,1);
    }
    .grid:not(.active) .card { background: #232328; }
    .card.wide { grid-column: span 2; }
    .grid .card:focus-visible { background: linear-gradient(135deg, #ff9a62, #ff4f7b); }
    .inner {
      position: relative; height: 100%; border-radius: 15px; padding: 20px; overflow: hidden;
      background: #111114;
    }
    .inner::before {
      content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s;
      background: radial-gradient(380px circle at var(--x) var(--y), rgba(255,140,100,.09), transparent 60%);
    }
    .grid.active .inner::before { opacity: 1; }
    .ico { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; background: #1c1c21; border: 1px solid #2c2c33; }
    .ico svg { width: 20px; height: 20px; fill: none; stroke: #ff9a62; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
    h4 { font-size: 16.5px; font-weight: 600; margin-top: 14px; letter-spacing: -0.01em; }
    .inner p { font-size: 14px; color: #9d9da8; margin-top: 6px; line-height: 1.5; }
    .code { margin: 14px 0 0; padding: 12px 14px; background: #0b0b0d; border: 1px solid #232328; border-radius: 10px; font: 12.5px/1.6 'Geist Mono', monospace; color: #c9c9d1; overflow-x: auto; overscroll-behavior-x: contain; touch-action: pan-x pan-y; }
    .k { color: #ff7aa2; } .f { color: #8fd1ff; } .s { color: #ffc58f; } .n { color: #b7f5c4; }
    @container (max-width: 760px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @container (max-width: 480px) {
      .grid { grid-template-columns: 1fr; gap: 8px; }
      .card.wide { grid-column: auto; }
      .inner { padding: 16px; display: grid; grid-template-columns: auto 1fr; column-gap: 14px; align-items: start; }
      .ico { grid-row: span 2; }
      h4 { margin-top: 0; }
      .inner p { margin-top: 4px; }
      .code { grid-column: 1 / -1; font-size: 11.5px; }
    }
  `,
})
export class SpotlightBorderFeatures {
  private readonly grid = viewChild.required<ElementRef<HTMLElement>>('grid');
  protected readonly px = signal(-999);
  protected readonly py = signal(-999);
  protected readonly inside = signal(false);
  protected readonly offsets = signal<{ x: number; y: number }[]>([]);
  protected readonly features: Feature[] = [
    { id: 'sf1', title: 'Retries that back off', body: 'Exponential, linear or custom. Poison jobs land in a dead-letter queue, not your pager.', icon: 'M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 3v4h-4M6 21v-4h4' },
    { id: 'sf2', title: 'Cron in plain English', body: '"Every weekday at 9am Europe/London" just works, DST included.', icon: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z' },
    { id: 'sf3', title: 'Typed end to end', body: 'Payloads are inferred from your handler, so a typo fails the build, not production.', icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16' },
    { id: 'sf4', title: 'One line to enqueue', body: 'Bring any Postgres or Redis. Relay handles locking, leases, concurrency and fairness.', icon: 'M4 6h16M4 12h10M4 18h6', wide: true },
    { id: 'sf5', title: 'Live run inspector', body: 'Replay any job with its exact payload and logs, straight from the dashboard.', icon: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z' },
  ];

  constructor() {
    loadGoogleFonts('Schibsted+Grotesk:wght@400;500;600;700');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(() => this.measure());
      ro.observe(this.grid().nativeElement);
      destroyRef.onDestroy(() => {
        ro.disconnect();
        clearTimeout(this.fade);
      });
    });
  }

  private measure(): void {
    const cards = this.grid().nativeElement.querySelectorAll<HTMLElement>('.card');
    this.offsets.set(Array.from(cards, (c) => ({ x: c.offsetLeft, y: c.offsetTop })));
  }

  private fade?: ReturnType<typeof setTimeout>;

  protected enter(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.inside.set(true);
  }

  protected leave(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.inside.set(false);
  }

  /** Touch/pen: light up where the finger lands; a sideways drag then drags the light. */
  protected press(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    clearTimeout(this.fade);
    this.track(e);
    this.inside.set(true);
  }

  /** Touch/pen: let the glow linger briefly, then settle. */
  protected release(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    clearTimeout(this.fade);
    this.fade = setTimeout(() => this.inside.set(false), 700);
  }

  protected track(e: PointerEvent): void {
    const r = this.grid().nativeElement.getBoundingClientRect();
    this.px.set(e.clientX - r.left);
    this.py.set(e.clientY - r.top);
  }
}
