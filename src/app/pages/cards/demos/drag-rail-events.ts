import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface CityEvent {
  id: string;
  day: string;
  dow: string;
  month: string;
  title: string;
  venue: string;
  kind: string;
  price: string;
  tone: string;
}

@Component({
  selector: 'demo-drag-rail-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <h3>Lisbon<br />in November</h3>
      <p>{{ events.length }} picks · swipe, drag or use your arrow keys</p>
    </div>
    <div
      #rail
      class="rail"
      [class.dragging]="dragging()"
      tabindex="0"
      role="region"
      aria-label="Events, scrollable"
      (scroll)="sync()"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="up($event)"
      (pointercancel)="up($event)"
      (click)="guard($event)"
      (keydown.arrowright)="nudge(1, $event)"
      (keydown.arrowleft)="nudge(-1, $event)"
    >
      @for (e of events; track e.id) {
        <article class="card" [style.--tone]="e.tone">
          <div class="date">
            <span class="d">{{ e.day }}</span>
            <span class="m">{{ e.dow }}<br />{{ e.month }}</span>
          </div>
          <span class="kind">{{ e.kind }}</span>
          <h4>{{ e.title }}</h4>
          <p class="venue">{{ e.venue }}</p>
          <div class="foot">
            <span class="price">{{ e.price }}</span>
            <a href="#" class="go" (click)="$event.preventDefault()" [attr.aria-label]="'Get tickets for ' + e.title">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </div>
        </article>
      }
      <span class="end" aria-hidden="true"></span>
    </div>
    <div class="progress" aria-hidden="true"><span [style.transform]="'scaleX(' + (0.08 + progress() * 0.92) + ')'"></span></div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 20px; min-height: 100%; padding: clamp(22px, 4cqi, 40px) 0;
      background: #ff5b2e; color: #140c08; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size; --pad: clamp(18px, 4cqi, 40px);
    }
    .top { display: flex; justify-content: space-between; align-items: end; gap: 16px; padding: 0 var(--pad); flex-wrap: wrap; }
    h3 { font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: clamp(28px, 5.4cqi, 58px); line-height: .92; letter-spacing: -0.04em; }
    .top p { font-size: 13.5px; font-weight: 500; max-width: 24ch; text-align: right; }
    .rail {
      display: flex; gap: 14px; overflow-x: auto; padding: 6px var(--pad) 10px; scroll-padding-inline: var(--pad);
      scroll-snap-type: x mandatory; scrollbar-width: none; cursor: grab; user-select: none; outline-offset: -3px;
      overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch;
    }
    .rail::-webkit-scrollbar { display: none; }
    .rail.dragging { cursor: grabbing; scroll-snap-type: none; }
    .rail.dragging .card { pointer-events: none; }
    .card {
      flex: 0 0 clamp(220px, 28cqi, 280px); scroll-snap-align: start; background: #fff3e6; border-radius: 22px; padding: 18px;
      display: flex; flex-direction: column; min-height: 300px; position: relative; overflow: hidden;
      transition: transform .3s cubic-bezier(.3,.8,.3,1);
    }
    .card::before { content: ''; position: absolute; right: -40px; top: -40px; width: 140px; height: 140px; border-radius: 50%; background: var(--tone); opacity: .9; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
    @media (hover: hover) {
      .card:hover { transform: rotate(-1.5deg) translateY(-4px); }
      .card:hover::before { transform: scale(1.5); }
    }
    .date { position: relative; display: flex; align-items: center; gap: 8px; }
    .d { font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: 46px; line-height: 1; letter-spacing: -0.05em; }
    .m { font-size: 12px; font-weight: 600; line-height: 1.2; }
    .kind { position: relative; align-self: flex-start; margin-top: auto; font-size: 12px; font-weight: 600; border: 1.5px solid #140c08; border-radius: 999px; padding: 3px 10px; }
    h4 { font-family: 'Unbounded', sans-serif; font-weight: 600; font-size: 19px; line-height: 1.12; letter-spacing: -0.02em; margin-top: 12px; }
    .venue { font-size: 13.5px; color: #5a4a40; margin-top: 4px; }
    .foot { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1.5px dashed #e3cdb8; }
    .price { font-weight: 700; font-size: 15px; }
    .go { width: 42px; height: 42px; border-radius: 50%; background: #140c08; color: #fff3e6; display: grid; place-items: center; transition: transform .25s cubic-bezier(.3,1.6,.5,1); touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .go:hover { transform: rotate(45deg) scale(1.08); }
    .go:active { transform: rotate(45deg) scale(.94); }
    .go svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .end { flex: 0 0 1px; }
    .progress { margin: 0 var(--pad); height: 4px; border-radius: 99px; background: rgba(20,12,8,.18); overflow: hidden; }
    .progress span { display: block; height: 100%; background: #140c08; transform-origin: left; transition: transform .15s linear; }
    @container (max-width: 480px) {
      .top { flex-direction: column; align-items: flex-start; gap: 8px; }
      .top p { text-align: left; max-width: none; }
      .card { min-height: 280px; }
    }
  `,
})
export class DragRailEvents {
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  protected readonly dragging = signal(false);
  protected readonly progress = signal(0);
  private startX = 0;
  private startScroll = 0;
  private moved = 0;
  private pointerId: number | null = null;

  protected readonly events: CityEvent[] = [
    { id: 'ev1', day: '06', dow: 'Thu', month: 'Nov', kind: 'Fado', title: 'Noite de Fado at Mesa de Frades', venue: 'Alfama', price: '€25', tone: '#ffd23f' },
    { id: 'ev2', day: '09', dow: 'Sun', month: 'Nov', kind: 'Market', title: 'LX Factory Sunday market', venue: 'Alcântara', price: 'Free', tone: '#7bdff2' },
    { id: 'ev3', day: '13', dow: 'Thu', month: 'Nov', kind: 'Talk', title: 'Type & Tiles: azulejo lettering', venue: 'MUDE', price: '€8', tone: '#b4f8c8' },
    { id: 'ev4', day: '15', dow: 'Sat', month: 'Nov', kind: 'Club', title: 'Lux Frágil all-nighter', venue: 'Santa Apolónia', price: '€18', tone: '#ffaec0' },
    { id: 'ev5', day: '20', dow: 'Thu', month: 'Nov', kind: 'Film', title: 'Lisbon & Estoril Film Festival', venue: 'Cinema São Jorge', price: '€7', tone: '#c3b1ff' },
    { id: 'ev6', day: '22', dow: 'Sat', month: 'Nov', kind: 'Food', title: 'Pastel de nata masterclass', venue: 'Belém', price: '€35', tone: '#ffd23f' },
    { id: 'ev7', day: '28', dow: 'Fri', month: 'Nov', kind: 'Gig', title: 'Branko live at Musicbox', venue: 'Cais do Sodré', price: '€20', tone: '#7bdff2' },
  ];

  constructor() {
    loadGoogleFonts('Unbounded:wght@600;800');
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(() => this.sync());
      ro.observe(this.rail().nativeElement);
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected sync(): void {
    const el = this.rail().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.progress.set(max > 0 ? el.scrollLeft / max : 0);
  }

  protected down(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = this.rail().nativeElement;
    this.pointerId = e.pointerId;
    this.startX = e.clientX;
    this.startScroll = el.scrollLeft;
    this.moved = 0;
  }

  protected move(e: PointerEvent): void {
    if (this.pointerId !== e.pointerId) return;
    const el = this.rail().nativeElement;
    const dx = e.clientX - this.startX;
    this.moved = Math.max(this.moved, Math.abs(dx));
    if (!this.dragging() && this.moved > 5) {
      this.dragging.set(true);
      el.setPointerCapture(e.pointerId);
    }
    if (this.dragging()) el.scrollLeft = this.startScroll - dx;
  }

  protected up(e: PointerEvent): void {
    if (this.pointerId !== e.pointerId) return;
    this.pointerId = null;
    if (this.dragging()) {
      const el = this.rail().nativeElement;
      const keep = el.scrollLeft;
      this.dragging.set(false);
      // re-enable snapping from the release point so it settles on the nearest card
      el.scrollLeft = keep;
    }
  }

  protected guard(e: MouseEvent): void {
    if (this.moved > 5) {
      e.preventDefault();
      e.stopPropagation();
      this.moved = 0;
    }
  }

  protected nudge(dir: number, e: Event): void {
    e.preventDefault();
    const el = this.rail().nativeElement;
    const card = el.querySelector<HTMLElement>('.card');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 260) + 14), behavior: 'smooth' });
  }
}
