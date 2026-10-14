import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Case {
  id: string;
  client: string;
  sector: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  bg: string;
  ink: string;
  accent: string;
}

const STICK = 22;
const STEP = 14;

@Component({
  selector: 'demo-scroll-stack-cases',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(scroll)': 'scrollTop.set(host.scrollTop)', tabindex: '0', 'aria-label': 'Case studies, scroll to stack' },
  template: `
    <header>
      <p class="kick">Selected work · 2023–2025</p>
      <h3>Four launches, stacked.</h3>
      <p class="hint">Keep scrolling (or swiping) inside this panel — each case study pins and the next slides over it.</p>
    </header>
    <ol class="stack">
      @for (c of cases; track c.id; let i = $index) {
        <li class="slot" [style.top.px]="stick + i * step">
          <article
            class="card"
            [style.--bg]="c.bg"
            [style.--ink]="c.ink"
            [style.--accent]="c.accent"
            [style.transform]="'scale(' + (1 - covered(i) * 0.05) + ')'"
            [style.filter]="'brightness(' + (1 - covered(i) * 0.14) + ')'"
          >
            <div class="txt">
              <p class="client">{{ c.client }} <span>· {{ c.sector }}</span></p>
              <h4>{{ c.title }}</h4>
              <p class="body">{{ c.body }}</p>
              <a href="#" class="link" (click)="$event.preventDefault()">Read the case study</a>
            </div>
            <div class="fig">
              <p class="metric">{{ c.metric }}</p>
              <p class="ml">{{ c.metricLabel }}</p>
            </div>
            <span class="idx" aria-hidden="true">{{ '0' + (i + 1) }}</span>
          </article>
        </li>
      }
    </ol>
    <footer>
      <p>That's the shortlist. The full archive has 31 more.</p>
    </footer>
  `,
  styles: `
    :host {
      display: block; height: 580px; overflow-y: auto; overscroll-behavior: contain; position: relative;
      background: #ebebef; color: #141414; font-family: 'Epilogue', 'Geist', sans-serif; container-type: inline-size;
      padding: 0 clamp(14px, 4cqi, 40px); scrollbar-width: thin; outline-offset: -3px;
    }
    header { padding: clamp(28px, 6cqi, 60px) 0 30px; }
    .kick { font-size: 13px; color: #61616b; }
    h3 { font-size: clamp(34px, 7cqi, 72px); font-weight: 800; letter-spacing: -0.05em; line-height: .92; margin-top: 8px; }
    .hint { font-size: 14px; color: #61616b; margin-top: 12px; max-width: 40ch; }
    .stack { list-style: none; padding: 0; margin: 0; }
    .slot { position: sticky; height: 360px; margin-bottom: 40px; }
    .card {
      height: 100%; border-radius: 28px; background: var(--bg); color: var(--ink); padding: clamp(20px, 4cqi, 36px);
      display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; position: relative; overflow: hidden;
      transform-origin: 50% 0; will-change: transform; box-shadow: 0 -10px 30px -20px rgba(20,20,20,.45);
    }
    .txt { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .client { font-size: 13.5px; font-weight: 600; }
    .client span { font-weight: 400; opacity: .7; }
    h4 { font-size: clamp(22px, 3.4cqi, 34px); font-weight: 700; letter-spacing: -0.035em; line-height: 1.02; }
    .body { font-size: 14.5px; line-height: 1.5; opacity: .85; max-width: 42ch; }
    .link { margin-top: auto; align-self: flex-start; color: inherit; font-weight: 600; font-size: 14px; text-decoration: none; border-bottom: 2px solid var(--accent); padding: 10px 0 2px; transition: color .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .link:hover, .link:active { color: var(--accent); }
    .fig { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; text-align: right; }
    .metric { font-size: clamp(52px, 10cqi, 110px); font-weight: 800; letter-spacing: -0.06em; line-height: .85; color: var(--accent); }
    .ml { font-size: 13.5px; opacity: .8; margin-top: 8px; max-width: 20ch; }
    .idx { position: absolute; top: 18px; right: 24px; font-size: 13px; font-weight: 600; opacity: .55; }
    footer { padding: 30px 0 60px; text-align: center; color: #61616b; font-size: 14px; }
    @container (max-width: 600px) {
      .card { grid-template-columns: 1fr; }
      .fig { align-items: flex-start; text-align: left; justify-content: flex-start; }
      .slot { height: 400px; }
    }
    @container (max-width: 400px) {
      .card { padding: 20px 18px; gap: 12px; border-radius: 22px; }
      .body { font-size: 14px; line-height: 1.45; }
      .metric { font-size: 48px; }
      .idx { top: 16px; right: 18px; }
      .client { padding-right: 26px; }
    }
    /* Touch: this panel is almost as tall as a phone screen, so let the page take over at either end
       instead of trapping the finger inside it (desktop keeps 'contain' for wheel scrolling). */
    @media (hover: none) { :host { overscroll-behavior-y: auto; } }
  `,
})
export class ScrollStackCases {
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly stick = STICK;
  protected readonly step = STEP;
  protected readonly scrollTop = signal(0);
  private readonly tops = signal<number[]>([]);
  private readonly spacing = signal(400);

  protected readonly cases: Case[] = [
    { id: 'cs1', client: 'Northwind Rail', sector: 'Transport', title: 'Tickets in two taps, even underground', body: 'Offline-first mobile ticketing for 1.2M daily commuters, with QR passes that validate without signal.', metric: '+38%', metricLabel: 'mobile ticket sales in the first quarter', bg: '#0f3d2e', ink: '#e7f3ec', accent: '#7ef0b4' },
    { id: 'cs2', client: 'Hearth', sector: 'Home energy', title: 'Making a heat pump quote feel human', body: 'A guided survey that replaced a 40-field form. Installers now get photos, not guesses.', metric: '3.1×', metricLabel: 'more completed quotes per visitor', bg: '#f2b33d', ink: '#2b1c02', accent: '#7a2e00' },
    { id: 'cs3', client: 'Lumen Health', sector: 'Healthcare', title: 'A clinic app people actually open', body: 'Appointment reminders, test results and repeat prescriptions in one calm, accessible place.', metric: '61%', metricLabel: 'fewer missed appointments', bg: '#2a1b4a', ink: '#efe9fb', accent: '#ff9ec7' },
    { id: 'cs4', client: 'Atlas Pay', sector: 'Fintech', title: 'Payouts for 40,000 creators', body: 'A rebuilt dashboard and payout engine with same-day transfers in 28 currencies.', metric: '£2.4B', metricLabel: 'paid out since launch', bg: '#141414', ink: '#f2f2f2', accent: '#ffd25e' },
  ];

  constructor() {
    loadGoogleFonts('Epilogue:wght@400;600;700;800');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const measure = () => {
        const slots = Array.from(this.host.querySelectorAll<HTMLElement>('.slot'));
        // natural (un-stuck) positions: use the list offset plus cumulative heights
        const list = this.host.querySelector<HTMLElement>('.stack');
        if (!list || !slots.length) return;
        const gap = parseFloat(getComputedStyle(slots[0]).marginBottom) || 0;
        const h = slots[0].offsetHeight + gap;
        this.spacing.set(h);
        this.tops.set(slots.map((_, i) => list.offsetTop + i * h));
      };
      const ro = new ResizeObserver(measure);
      ro.observe(this.host);
      measure();
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  /** How many later cards currently overlap card i (fractional). */
  protected covered(i: number): number {
    const top = this.tops()[i];
    if (top === undefined) return 0;
    const stuckAt = top - (STICK + i * STEP);
    const t = (this.scrollTop() - stuckAt) / this.spacing();
    return Math.max(0, Math.min(this.cases.length - 1 - i, t));
  }
}
