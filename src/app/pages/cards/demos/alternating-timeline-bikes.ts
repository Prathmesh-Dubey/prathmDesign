import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Milestone {
  id: string;
  year: string;
  title: string;
  body: string;
  stat?: string;
  statLabel?: string;
}

@Component({
  selector: 'demo-alternating-timeline-bikes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(scroll)': 'onScroll()', tabindex: '0', 'aria-label': 'Brand history timeline, scrollable' },
  template: `
    <header>
      <p class="kick">Vélo Norte · since 1987</p>
      <h3>Thirty-eight years of building bikes in Porto</h3>
    </header>
    <div class="tlwrap">
    <span class="rail" aria-hidden="true"><span class="fill" [style.transform]="'scaleY(' + progress() + ')'"></span></span>
    <ol class="tl">
      @for (m of items; track m.id; let i = $index) {
        <li class="item" [class.right]="i % 2 === 1" [class.in]="seen().includes(m.id)" [attr.data-id]="m.id">
          <span class="node" aria-hidden="true"></span>
          <article class="card">
            <p class="year">{{ m.year }}</p>
            <h4>{{ m.title }}</h4>
            <p class="body">{{ m.body }}</p>
            @if (m.stat) {
              <p class="stat"><strong>{{ m.stat }}</strong> {{ m.statLabel }}</p>
            }
          </article>
        </li>
      }
    </ol>
    </div>
    <p class="end">To be continued — <a href="#" (click)="$event.preventDefault()">see what we're building next</a></p>
  `,
  styles: `
    :host {
      display: block; height: 560px; overflow-y: auto; overscroll-behavior: contain;
      background: #fbfaf8; color: #18181a; font-family: 'Chivo', 'Geist', sans-serif; container-type: inline-size;
      padding: clamp(24px, 5cqi, 48px) clamp(16px, 4cqi, 40px); scrollbar-width: thin; outline-offset: -3px;
    }
    header { text-align: center; margin-bottom: 36px; }
    .kick { font-family: 'Chivo Mono', monospace; font-size: 12.5px; color: #d6332a; }
    h3 { font-weight: 800; font-size: clamp(26px, 4.2cqi, 42px); letter-spacing: -0.03em; line-height: 1.02; max-width: 20ch; margin: 8px auto 0; }
    .tlwrap { position: relative; max-width: 900px; margin: 0 auto; }
    .tl { list-style: none; padding: 0; margin: 0; display: grid; gap: 22px; }
    .rail { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: #e4e1dc; }
    .fill { position: absolute; inset: 0; background: #d6332a; transform-origin: top; }
    .item { position: relative; display: grid; grid-template-columns: 1fr 1fr; }
    .card {
      grid-column: 1; margin-right: 34px; background: #fff; border: 1px solid #ebe8e3; border-radius: 14px; padding: 18px 20px;
      box-shadow: 0 12px 30px -24px rgba(24,24,26,.5);
      opacity: 0; transform: translateX(-28px); transition: opacity .6s ease, transform .7s cubic-bezier(.2,.8,.2,1);
    }
    .right .card { grid-column: 2; margin: 0 0 0 34px; transform: translateX(28px); }
    .in .card { opacity: 1; transform: none; }
    .card::after { content: ''; position: absolute; top: 24px; width: 14px; height: 2px; background: #e4e1dc; }
    .item:not(.right) .card::after { right: calc(50% + 6px); }
    .right .card::after { left: calc(50% + 6px); }
    .node { position: absolute; left: 50%; top: 18px; width: 14px; height: 14px; margin-left: -7px; border-radius: 50%; background: #fbfaf8; border: 2px solid #c9c5be; z-index: 1; transition: border-color .4s, background .4s, transform .4s cubic-bezier(.3,1.6,.5,1); }
    .in .node { border-color: #d6332a; background: #d6332a; transform: scale(1.15); }
    .year { font-family: 'Chivo Mono', monospace; font-size: 13px; color: #d6332a; font-weight: 500; }
    h4 { font-size: 19px; font-weight: 700; letter-spacing: -0.01em; margin-top: 4px; }
    .body { font-size: 14.5px; color: #55545a; margin-top: 6px; line-height: 1.5; }
    .stat { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e4e1dc; font-size: 13px; color: #55545a; }
    .stat strong { font-size: 22px; color: #18181a; letter-spacing: -0.03em; margin-right: 4px; }
    .end { text-align: center; margin: 36px 0 8px; font-size: 14px; color: #55545a; }
    .end a { color: #d6332a; display: inline-block; padding: 10px 0; }
    @container (max-width: 640px) {
      .rail { left: 8px; }
      .node { left: 8px; }
      .item { grid-template-columns: 1fr; }
      .card, .right .card { grid-column: 1; margin: 0 0 0 30px; transform: translateY(18px); }
      .card::after { display: none; }
    }
    /* Touch: this panel is almost as tall as a phone screen, so let the page take over at either end
       instead of trapping the finger inside it (desktop keeps 'contain' for wheel scrolling). */
    @media (hover: none) { :host { overscroll-behavior-y: auto; } }
  `,
})
export class AlternatingTimelineBikes {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly progress = signal(0);
  protected readonly seen = signal<string[]>([]);
  protected readonly items: Milestone[] = [
    { id: 'm87', year: '1987', title: 'A garage in Bonfim', body: 'Rui Matos welds his first steel frame for a neighbour who races on weekends. It still rides.' },
    { id: 'm94', year: '1994', title: 'The Douro tourer', body: 'Our first production model: lugged steel, rack mounts, and gearing for the valley climbs.', stat: '1,200', statLabel: 'built by hand' },
    { id: 'm03', year: '2003', title: 'Racing team, briefly', body: 'Two seasons on the Volta a Portugal taught us how to build light — and that we prefer touring.' },
    { id: 'm12', year: '2012', title: 'Lifetime frame warranty', body: 'If one of our frames cracks, we replace it. We have honoured that promise 41 times.', stat: '41', statLabel: 'frames replaced' },
    { id: 'm19', year: '2019', title: 'Electric, without the bulk', body: 'The Ribeira E hides a 250W hub motor and a battery in the down tube. 19 kg all in.' },
    { id: 'm25', year: '2025', title: 'Repair-first workshops', body: 'Free monthly classes in Porto and Lisbon. Bring any bike, leave knowing how to fix it.', stat: '3,800', statLabel: 'riders taught' },
  ];

  constructor() {
    loadGoogleFonts('Chivo:wght@400;700;800', 'Chivo+Mono:wght@400;500');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) {
        this.seen.set(this.items.map((m) => m.id));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          const add = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset['id'] ?? '');
          if (add.length) this.seen.update((s) => [...new Set([...s, ...add])]);
        },
        { root: this.host, threshold: 0.35 },
      );
      this.host.querySelectorAll('.item').forEach((el) => io.observe(el));
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  protected onScroll(): void {
    const el = this.host;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? el.scrollTop / max : 1);
  }
}
