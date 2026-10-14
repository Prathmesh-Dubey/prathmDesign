import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { prefersReducedMotion } from '../../../shared/visibility';

interface Phase {
  id: string;
  date: string;
  name: string;
  detail: string;
  metric: string;
  status: 'done' | 'now' | 'next';
}

@Component({
  selector: 'demo-horizontal-timeline-mission',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <div>
        <p class="kick">Mission log · Halcyon-2 to Europa</p>
        <h3>{{ sel().name }}</h3>
      </div>
      <div class="nav">
        <button type="button" (click)="go(index() - 1)" [disabled]="index() === 0" aria-label="Previous phase">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" (click)="go(index() + 1)" [disabled]="index() === phases.length - 1" aria-label="Next phase">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>

    <div class="scroller" #scroller>
      <div class="track" [style.--n]="phases.length">
        <span class="line" aria-hidden="true">
          <span class="done" [style.transform]="'scaleX(' + doneRatio() + ')'"></span>
          <span class="sel" [style.transform]="'scaleX(' + index() / (phases.length - 1) + ')'"></span>
        </span>
        @for (p of phases; track p.id; let i = $index) {
          <button
            type="button"
            class="phase"
            [class]="'phase ' + p.status + (i === index() ? ' active' : '')"
            [attr.aria-current]="i === index() ? 'step' : null"
            [attr.aria-label]="p.date + ', ' + p.name + ', ' + (p.status === 'done' ? 'complete' : p.status === 'now' ? 'in progress' : 'upcoming')"
            (click)="go(i)"
            (keydown.arrowright)="go(i + 1, true); $event.preventDefault()"
            (keydown.arrowleft)="go(i - 1, true); $event.preventDefault()"
          >
            <span class="date">{{ p.date }}</span>
            <span class="node" aria-hidden="true">
              @if (p.status === 'now') {
                <span class="pulse"></span>
              }
            </span>
            <span class="card">
              <span class="nm">{{ p.name }}</span>
              <span class="metric">{{ p.metric }}</span>
              <span class="det">{{ p.detail }}</span>
            </span>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 18px; min-height: 100%; padding: clamp(22px, 4cqi, 40px) 0;
      background:
        radial-gradient(1px 1px at 12% 22%, #fff8, transparent), radial-gradient(1px 1px at 72% 14%, #fff9, transparent),
        radial-gradient(1.5px 1.5px at 38% 68%, #fff6, transparent), radial-gradient(1px 1px at 88% 58%, #fff8, transparent),
        radial-gradient(1px 1px at 55% 35%, #fff5, transparent), radial-gradient(1.5px 1.5px at 22% 86%, #fff7, transparent),
        radial-gradient(120% 80% at 80% 0%, #1b2246 0%, #070a14 60%);
      color: #eef0f8; font-family: 'Red Hat Display', 'Geist', sans-serif; container-type: inline-size;
      --pad: clamp(18px, 4cqi, 40px);
    }
    .top { display: flex; justify-content: space-between; align-items: end; gap: 16px; padding: 0 var(--pad); }
    .kick { font-family: 'Red Hat Mono', monospace; font-size: 12.5px; color: #ffb648; }
    h3 { font-size: clamp(24px, 4cqi, 40px); font-weight: 800; letter-spacing: -0.03em; margin-top: 6px; line-height: 1; animation: in .45s cubic-bezier(.2,.8,.2,1); }
    .nav { display: flex; gap: 8px; }
    .nav button { width: 42px; height: 42px; border-radius: 50%; border: 1px solid #2c3459; background: rgba(14,18,38,.7); color: inherit; display: grid; place-items: center; cursor: pointer; transition: border-color .2s, background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .nav button:hover:not(:disabled), .nav button:active:not(:disabled) { border-color: #ffb648; }
    .nav button:disabled { opacity: .3; cursor: default; }
    .nav svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    .scroller { overflow-x: auto; scrollbar-width: none; padding: 8px 0 4px; overscroll-behavior-x: contain; scroll-snap-type: x proximity; }
    .scroller::-webkit-scrollbar { display: none; }
    .track { --col: 210px; position: relative; display: grid; grid-template-columns: repeat(var(--n), var(--col)); width: max-content; padding: 0 var(--pad); }
    .line { position: absolute; left: calc(var(--pad) + var(--col) / 2); right: calc(var(--pad) + var(--col) / 2); top: 44px; height: 2px; background: #252c4d; }
    .line span { position: absolute; inset: 0; transform-origin: left; }
    .line .done { background: #6c7ab8; }
    .line .sel { background: linear-gradient(90deg, #ffb648, #ff7b54); transition: transform .6s cubic-bezier(.3,.8,.2,1); height: 2px; box-shadow: 0 0 12px #ff9b4f; }
    .phase { display: flex; flex-direction: column; align-items: center; gap: 10px; border: 0; background: none; color: inherit; padding: 0 8px; cursor: pointer; text-align: left; border-radius: 16px; scroll-snap-align: center; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .phase:focus-visible { outline: 2px solid #ffb648; outline-offset: 2px; }
    .date { font-family: 'Red Hat Mono', monospace; font-size: 12px; color: #8b93b8; height: 16px; }
    .node { position: relative; width: 18px; height: 18px; border-radius: 50%; background: #070a14; border: 2px solid #3a4370; margin-top: 1px; transition: transform .3s cubic-bezier(.3,1.6,.5,1), border-color .3s, background .3s; z-index: 1; }
    .done .node { background: #6c7ab8; border-color: #6c7ab8; }
    .now .node { border-color: #ffb648; background: #ffb648; }
    .pulse { position: absolute; inset: -6px; border-radius: 50%; border: 2px solid #ffb648; animation: pulse 1.8s ease-out infinite; }
    .active .node { transform: scale(1.35); }
    .card {
      width: 100%; display: flex; flex-direction: column; gap: 4px; padding: 14px; margin-top: 6px; border-radius: 14px;
      background: rgba(20,25,52,.72); border: 1px solid #252c4d; backdrop-filter: blur(6px);
      transition: transform .4s cubic-bezier(.2,.8,.2,1), border-color .3s, background .3s;
    }
    @media (hover: hover) { .phase:hover .card { transform: translateY(-3px); border-color: #3a4370; } }
    .phase:not(.active):active .card { border-color: #3a4370; }
    .active .card { border-color: #ffb648; background: rgba(40,33,40,.8); transform: translateY(-6px); }
    .nm { font-weight: 700; font-size: 15.5px; }
    .metric { font-family: 'Red Hat Mono', monospace; font-size: 12px; color: #ffb648; }
    .det { font-size: 13px; color: #aab1d1; line-height: 1.45; max-height: 0; overflow: hidden; opacity: 0; transition: max-height .5s cubic-bezier(.2,.8,.2,1), opacity .3s; }
    .active .det { max-height: 120px; opacity: 1; }
    .next .nm { color: #c4c9e2; }
    @container (max-width: 420px) {
      .track { --col: 190px; }
      .top { align-items: flex-start; }
    }
    @keyframes pulse { from { transform: scale(.6); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
  `,
})
export class HorizontalTimelineMission {
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  protected readonly phases: Phase[] = [
    { id: 'p1', date: '14 Mar 2024', name: 'Launch', status: 'done', metric: 'Falcon Heavy · LC-39A', detail: 'Lift-off at 06:12 local. Fairing separation and orbit insertion nominal.' },
    { id: 'p2', date: '02 Feb 2025', name: 'Mars gravity assist', status: 'done', metric: 'Δv +2.1 km/s', detail: 'Closest approach 860 km above Arsia Mons; thermal cameras calibrated.' },
    { id: 'p3', date: '09 Dec 2025', name: 'Earth flyby', status: 'done', metric: 'Altitude 3,600 km', detail: 'Final slingshot sends the probe on its 3-year cruise to Jupiter.' },
    { id: 'p4', date: 'Oct 2026 — now', name: 'Deep-space cruise', status: 'now', metric: '612 M km from Earth', detail: 'Instruments in hibernation. Weekly heartbeat via the 70 m Madrid dish.' },
    { id: 'p5', date: 'Apr 2030', name: 'Jupiter orbit insertion', status: 'next', metric: '52-min engine burn', detail: 'The longest burn of the mission, fired behind Jupiter, out of contact.' },
    { id: 'p6', date: 'Nov 2030', name: 'First Europa flyby', status: 'next', metric: '25 km above the ice', detail: 'Ice-penetrating radar maps the shell, looking for liquid water pockets.' },
  ];
  protected readonly index = signal(3);
  protected readonly sel = computed(() => this.phases[this.index()]);
  protected readonly doneRatio = computed(() => {
    const now = this.phases.findIndex((p) => p.status === 'now');
    return now / (this.phases.length - 1);
  });

  constructor() {
    loadGoogleFonts('Red+Hat+Display:wght@400;700;800', 'Red+Hat+Mono:wght@400;500');
  }

  protected go(i: number, focus = false): void {
    const next = Math.max(0, Math.min(this.phases.length - 1, i));
    this.index.set(next);
    const sc = this.scroller().nativeElement;
    const el = sc.querySelectorAll<HTMLElement>('.phase')[next];
    if (!el) return;
    if (focus) el.focus({ preventScroll: true });
    const left = el.offsetLeft - (sc.clientWidth - el.offsetWidth) / 2;
    sc.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
