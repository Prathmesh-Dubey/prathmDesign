import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

interface Note {
  id: number;
  app: string;
  icon: string;
  tint: string;
  title: string;
  body: string;
  time: string;
}

const SEED: Note[] = [
  { id: 1, app: 'Monzo', icon: 'M', tint: '#ff5f4a', title: 'You spent £4.20 at Origin Coffee', body: 'Daily coffee budget: £2.80 left today.', time: 'now' },
  { id: 2, app: 'Strava', icon: 'S', tint: '#fc6a1c', title: 'Maya gave you kudos', body: 'Morning Run · 8.4 km along the Regent’s Canal.', time: '6m' },
  { id: 3, app: 'Citymapper', icon: 'C', tint: '#2bb673', title: 'Leave in 5 min for your 15:00', body: 'Overground from Hackney Central, platform 2.', time: '12m' },
  { id: 4, app: 'Calendar', icon: '14', tint: '#e5484d', title: 'Design crit — Atlas onboarding', body: 'Room 3B · Priya, Tom and 4 others.', time: '25m' },
  { id: 5, app: 'Spotify', icon: '♪', tint: '#1db954', title: 'New from Halcyon Drift', body: 'Low Tide (Deluxe) is out now.', time: '1h' },
];

@Component({
  selector: 'demo-swipe-dismiss-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="phone">
      <div class="clock">
        <p class="date">Tuesday 14 October</p>
        <p class="time">14:08</p>
      </div>

      <div class="bar">
        <span>Notifications</span>
        @if (notes().length) {
          <div class="bar-actions">
            @if (expanded()) {
              <button type="button" (click)="expanded.set(false)">Show less</button>
            }
            <button type="button" (click)="clearAll()">Clear all</button>
          </div>
        }
      </div>

      <ul class="list" [class.collapsed]="!expanded()" aria-label="Notifications">
        @for (n of notes(); track n.id; let i = $index) {
          <li
            class="wrap"
            [class.gone]="gone().includes(n.id)"
            [class.hidden]="!expanded() && i > 2"
            [style.--i]="i"
            [style.z-index]="20 - i"
          >
            <div class="clip">
              <div
                class="note"
                [class.drag]="dragId() === n.id"
                [style.transform]="noteTransform(n.id, i)"
                [style.opacity]="noteOpacity(n.id, i)"
                (pointerdown)="down($event, n.id)"
                (pointermove)="move($event, n.id)"
                (pointerup)="up(n.id)"
                (pointercancel)="cancel(n.id)"
                tabindex="0"
                [attr.aria-label]="n.app + ': ' + n.title + '. Press Delete to dismiss.'"
                (keydown.delete)="dismiss(n.id)"
                (keydown.backspace)="dismiss(n.id)"
              >
                <span class="icon" [style.background]="n.tint" aria-hidden="true">{{ n.icon }}</span>
                <div class="txt">
                  <p class="row"><strong>{{ n.app }}</strong><span>{{ n.time }}</span></p>
                  <p class="title">{{ n.title }}</p>
                  <p class="body">{{ n.body }}</p>
                </div>
                <button type="button" class="x" (click)="dismiss(n.id); $event.stopPropagation()" (pointerdown)="$event.stopPropagation()" [attr.aria-label]="'Dismiss ' + n.app + ' notification'">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                </button>
              </div>
            </div>
          </li>
        } @empty {
          <li class="none">
            <p>All caught up</p>
            <button type="button" (click)="restore()">Bring them back</button>
          </li>
        }
      </ul>
      @if (!expanded() && notes().length > 1) {
        <p class="more">{{ notes().length - 1 }} more · tap to expand · swipe sideways to dismiss</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: grid; place-items: center; min-height: 100%; padding: 24px 16px;
      background:
        radial-gradient(60% 50% at 20% 15%, #ffb35c 0%, transparent 60%),
        radial-gradient(70% 60% at 85% 30%, #e0524a 0%, transparent 60%),
        radial-gradient(90% 70% at 40% 100%, #0d5c63 0%, transparent 70%),
        #2a3d45;
      font-family: -apple-system, 'Geist', system-ui, sans-serif; color: #fff;
    }
    .phone { width: min(360px, 100%); }
    .clock { text-align: center; margin-bottom: 22px; text-shadow: 0 2px 20px rgba(0,0,0,.2); }
    .date { font-size: 16px; font-weight: 500; opacity: .9; }
    .time { font-size: clamp(60px, 18vw, 78px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; font-family: 'Geist', sans-serif; }
    .bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 4px; font-size: 15px; font-weight: 600; min-height: 30px; }
    .bar-actions { display: flex; gap: 6px; }
    .bar button { position: relative; border: 0; background: rgba(255,255,255,.22); backdrop-filter: blur(10px); padding: 5px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .bar button::before { content: ''; position: absolute; inset: -8px -2px; }
    .bar button:hover, .bar button:active { background: rgba(255,255,255,.34); }
    .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .wrap { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .3s cubic-bezier(.3,.8,.3,1), margin .4s cubic-bezier(.3,.8,.3,1); margin-bottom: 8px; position: relative; }
    .wrap.gone { grid-template-rows: 0fr; margin-bottom: 0; }
    .clip { min-height: 0; }
    .wrap.gone .clip { overflow: hidden; }
    .collapsed .wrap:not(:first-child) { margin-top: -80px; }
    .collapsed .wrap.hidden { margin-top: -92px; }
    .note {
      position: relative; display: flex; gap: 12px; align-items: flex-start; height: 84px; overflow: hidden;
      padding: 12px 14px; border-radius: 22px;
      background: rgba(250, 247, 245, .62); color: #1b1b1f;
      backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6);
      box-shadow: 0 10px 30px -12px rgba(0,0,0,.35);
      transition: transform .4s cubic-bezier(.25,.9,.3,1.1), opacity .3s;
      touch-action: pan-y; user-select: none; -webkit-user-select: none; cursor: grab; transform-origin: 50% 0;
      -webkit-tap-highlight-color: transparent;
    }
    .note.drag { transition: none; cursor: grabbing; }
    .note:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    .icon { flex-shrink: 0; width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 15px; }
    .txt { min-width: 0; flex: 1; }
    .row { display: flex; justify-content: space-between; font-size: 12.5px; color: #4b4b55; }
    .row strong { font-weight: 600; }
    .title { font-size: 14.5px; font-weight: 600; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .body { font-size: 13.5px; color: #3a3a44; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .x { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; border: 0; background: rgba(60,60,70,.18); display: grid; place-items: center; cursor: pointer; opacity: 0; transition: opacity .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .x::before { content: ''; position: absolute; inset: -9px; border-radius: 50%; }
    .x:active { background: rgba(60,60,70,.32); }
    .note:hover .x, .note:focus-within .x { opacity: 1; }
    .x svg { width: 11px; height: 11px; stroke: #1b1b1f; stroke-width: 2; stroke-linecap: round; }
    .note:hover .row span, .note:focus-within .row span { visibility: hidden; }
    .none { text-align: center; padding: 26px; border-radius: 22px; background: rgba(255,255,255,.14); backdrop-filter: blur(16px); display: grid; gap: 10px; justify-items: center; font-weight: 600; }
    .none button { border: 0; background: #fff; color: #1b1b1f; min-height: 40px; padding: 0 16px; border-radius: 999px; font-weight: 600; cursor: pointer; touch-action: manipulation; }
    /* Touch: no hover, so the dismiss button is always visible (time moves left of it). */
    @media (hover: none) {
      .x { opacity: 1; }
      .row { padding-right: 28px; }
      .note:focus-within .row span { visibility: visible; }
    }
    .more { text-align: center; font-size: 12.5px; opacity: .85; margin-top: 14px; }
  `,
})
export class SwipeDismissNotifications {
  protected readonly notes = signal<Note[]>([...SEED]);
  protected readonly expanded = signal(false);
  protected readonly gone = signal<number[]>([]);
  protected readonly dragId = signal<number | null>(null);
  protected readonly dx = signal(0);
  private startX = 0;
  private moved = false;
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
  }

  protected noteTransform(id: number, i: number): string {
    if (this.gone().includes(id)) return 'translateX(115%)';
    if (this.dragId() === id) return `translateX(${this.dx()}px)`;
    if (!this.expanded() && i > 0) return `scale(${1 - Math.min(i, 3) * 0.05})`;
    return 'none';
  }

  protected noteOpacity(id: number, i: number): number {
    if (this.gone().includes(id)) return 0;
    if (this.dragId() === id) return 1 - Math.min(0.7, Math.abs(this.dx()) / 300);
    if (!this.expanded() && i > 2) return 0;
    if (!this.expanded() && i > 0) return 1 - i * 0.18;
    return 1;
  }

  protected down(e: PointerEvent, id: number): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.startX = e.clientX;
    this.moved = false;
    this.dragId.set(id);
    this.dx.set(0);
  }

  protected move(e: PointerEvent, id: number): void {
    if (this.dragId() !== id) return;
    const d = e.clientX - this.startX;
    if (Math.abs(d) > 8) this.moved = true;
    // resist dragging to the left, follow freely to the right
    this.dx.set(d < 0 ? d * 0.5 : d);
  }

  /** Browser took the gesture over (vertical scroll): just snap back. */
  protected cancel(id: number): void {
    if (this.dragId() !== id) return;
    this.dragId.set(null);
    this.dx.set(0);
  }

  protected up(id: number): void {
    if (this.dragId() !== id) return;
    const d = this.dx();
    this.dragId.set(null);
    this.dx.set(0);
    if (d > 90 || d < -70) {
      this.dismiss(id);
    } else if (!this.moved && !this.expanded() && this.notes().length > 1) {
      this.expanded.set(true);
    }
  }

  protected dismiss(id: number): void {
    if (this.gone().includes(id)) return;
    this.gone.update((g) => [...g, id]);
    this.timers.push(
      setTimeout(() => {
        this.notes.update((n) => n.filter((x) => x.id !== id));
        this.gone.update((g) => g.filter((x) => x !== id));
        if (this.notes().length <= 1) this.expanded.set(false);
      }, 320),
    );
  }

  protected clearAll(): void {
    this.notes().forEach((n, i) => this.timers.push(setTimeout(() => this.dismiss(n.id), i * 60)));
  }

  protected restore(): void {
    this.notes.set([...SEED]);
  }
}
