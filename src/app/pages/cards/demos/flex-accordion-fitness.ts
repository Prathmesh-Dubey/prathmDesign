import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Session {
  id: string;
  name: string;
  coach: string;
  time: string;
  mins: number;
  level: number;
  spots: number;
  blurb: string;
  img: string;
  tint: string;
}

@Component({
  selector: 'demo-flex-accordion-fitness',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <h3>Tomorrow at Forge</h3>
      <p>Shoreditch · 5 sessions · {{ booked().length }} booked</p>
    </div>
    <div class="panels" role="tablist" aria-label="Classes" (keydown.arrowright)="move(1, $event)" (keydown.arrowleft)="move(-1, $event)" (keydown.arrowdown)="move(1, $event)" (keydown.arrowup)="move(-1, $event)">
      @for (s of sessions; track s.id; let i = $index) {
        <div
          class="panel"
          [class.open]="active() === i"
          [style.--tint]="s.tint"
          (pointerenter)="hoverOpen($event, i)"
        >
          <img [src]="s.img" [appImgFallback]="s.id" [alt]="'Class photo for ' + s.name" loading="lazy" />
          <button
            type="button"
            class="hit"
            role="tab"
            [id]="'fx-tab-' + s.id"
            [attr.aria-selected]="active() === i"
            [attr.aria-controls]="'fx-panel-' + s.id"
            [attr.tabindex]="active() === i ? 0 : -1"
            (click)="active.set(i)"
            (focus)="active.set(i)"
          >
            <span class="label">{{ s.name }}</span>
            <span class="time-s">{{ s.time }}</span>
          </button>
          <div class="body" role="tabpanel" [id]="'fx-panel-' + s.id" [attr.aria-labelledby]="'fx-tab-' + s.id" [attr.aria-hidden]="active() !== i">
            <p class="when">{{ s.time }} · {{ s.mins }} min</p>
            <h4>{{ s.name }}</h4>
            <p class="blurb">{{ s.blurb }}</p>
            <div class="row">
              <span class="lvl" [attr.aria-label]="'Intensity ' + s.level + ' of 5'">
                @for (l of [1, 2, 3, 4, 5]; track l) {
                  <i [class.on]="l <= s.level"></i>
                }
              </span>
              <span class="coach">with {{ s.coach }}</span>
            </div>
            <button
              type="button"
              class="book"
              [class.done]="isBooked(s.id)"
              [attr.tabindex]="active() === i ? 0 : -1"
              (click)="toggleBook(s.id)"
            >
              {{ isBooked(s.id) ? 'Booked ✓' : 'Book · ' + s.spots + ' spots left' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; gap: 16px; min-height: 100%; padding: clamp(18px, 3.6cqi, 36px);
      background: #0f151c; color: #f4f1ea; font-family: 'Geist', system-ui, sans-serif; container-type: inline-size;
    }
    .head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
    h3 { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: clamp(30px, 5cqi, 48px); line-height: .9; text-transform: uppercase; letter-spacing: .01em; }
    .head p { font-size: 13.5px; color: #8e99a6; }
    .panels { flex: 1; display: flex; gap: 10px; min-height: 380px; }
    .panel {
      position: relative; flex: 1; min-width: 56px; border-radius: 20px; overflow: hidden; background: #1b2530;
      transition: flex-grow .7s cubic-bezier(.25,.9,.25,1);
    }
    .panel.open { flex-grow: 5; }
    .panel img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(.6) brightness(.6); transform: scale(1.08); transition: filter .7s, transform 1.2s cubic-bezier(.2,.7,.2,1); }
    .panel.open img { filter: none; transform: scale(1); }
    .panel::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, color-mix(in srgb, var(--tint) 30%, #0b0f14 85%)); pointer-events: none; }
    .hit { position: absolute; inset: 0; z-index: 2; border: 0; background: none; cursor: pointer; color: inherit; border-radius: 20px; padding: 0; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .hit:active { background: rgba(255,255,255,.06); }
    .hit:focus-visible { outline: 3px solid var(--tint); outline-offset: -3px; }
    .open .hit { pointer-events: none; }
    .label {
      position: absolute; left: 50%; bottom: 22px; transform-origin: 0 50%; transform: rotate(-90deg) translateY(-50%);
      font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: 24px; text-transform: uppercase; white-space: nowrap; letter-spacing: .02em;
      transition: opacity .3s;
    }
    .time-s { position: absolute; top: 16px; left: 0; right: 0; text-align: center; font-family: 'Geist Mono', monospace; font-size: 11px; color: #c7ced6; transition: opacity .3s; }
    .open .label, .open .time-s { opacity: 0; }
    .body {
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; padding: clamp(18px, 3cqi, 28px); display: grid; gap: 8px;
      opacity: 0; transform: translateY(16px); transition: opacity .3s, transform .5s cubic-bezier(.2,.8,.2,1); pointer-events: none;
      min-width: 260px;
    }
    .open .body { opacity: 1; transform: none; transition-delay: .25s; pointer-events: auto; }
    .when { font-family: 'Geist Mono', monospace; font-size: 12px; color: var(--tint); }
    h4 { font-family: 'Big Shoulders Display', sans-serif; font-weight: 800; font-size: clamp(34px, 5cqi, 52px); line-height: .9; text-transform: uppercase; }
    .blurb { font-size: 14.5px; color: #d6dbe0; max-width: 40ch; }
    .row { display: flex; align-items: center; gap: 14px; font-size: 13px; color: #b5bec8; }
    .lvl { display: flex; gap: 3px; }
    .lvl i { width: 14px; height: 5px; border-radius: 2px; background: rgba(255,255,255,.2); }
    .lvl i.on { background: var(--tint); }
    .book { justify-self: start; margin-top: 6px; height: 44px; padding: 0 20px; border-radius: 999px; border: 0; background: var(--tint); color: #0f151c; font-weight: 700; font-size: 14px; cursor: pointer; transition: transform .2s, background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @media (hover: hover) { .book:hover { transform: translateY(-1px); } }
    .book:active { transform: scale(.96); }
    .book.done { background: #f4f1ea; }
    @container (max-width: 620px) {
      .panels { flex-direction: column; min-height: 520px; }
      .panel { min-height: 54px; min-width: 0; }
      .label { transform: none; left: 18px; bottom: auto; top: 50%; translate: 0 -50%; font-size: 20px; }
      .time-s { top: 50%; translate: 0 -50%; left: auto; right: 18px; text-align: right; }
      .body { min-width: 0; padding: 16px 18px; gap: 6px; }
      h4 { font-size: 32px; }
      .blurb { font-size: 14px; line-height: 1.4; }
      .panel { border-radius: 16px; }
      .panel.open { min-height: 270px; }
    }
  `,
})
export class FlexAccordionFitness {
  protected readonly sessions: Session[] = [
    { id: 'fx1', name: 'Reformer', coach: 'Isla Grant', time: '07:00', mins: 50, level: 3, spots: 4, tint: '#f2c94c', blurb: 'Slow, controlled strength on the reformer. Core, posture and a lot of shaking legs.', img: unsplash('photo-1518611012118-696072aa579a', 900, 700) },
    { id: 'fx2', name: 'Ride 45', coach: 'Dev Patel', time: '08:15', mins: 45, level: 4, spots: 11, tint: '#ff7a45', blurb: 'Rhythm-led indoor cycling to a house and disco playlist. Lights down, effort up.', img: unsplash('photo-1534438327276-14e5300c3a48', 900, 700) },
    { id: 'fx3', name: 'Box Club', coach: 'Nia Owusu', time: '12:30', mins: 40, level: 5, spots: 2, tint: '#ff4d6d', blurb: 'Pad work, footwork and conditioning rounds. Gloves provided, ego optional.', img: unsplash('photo-1549719386-74dfcbf7dbed', 900, 700) },
    { id: 'fx4', name: 'Flow Yoga', coach: 'Mateo Silva', time: '18:00', mins: 60, level: 2, spots: 7, tint: '#7ee0c3', blurb: 'Vinyasa flow that builds to a long, quiet savasana. Good after a desk day.', img: unsplash('photo-1544367567-0f2fcb009e0b', 900, 700) },
    { id: 'fx5', name: 'Lift Lab', coach: 'Freya Holt', time: '19:30', mins: 55, level: 4, spots: 5, tint: '#8fb3ff', blurb: 'Coached barbell technique: squat, hinge, press. Small group, real feedback.', img: unsplash('photo-1517836357463-d25dfeac3438', 900, 700) },
  ];
  protected readonly active = signal(0);
  protected readonly booked = signal<string[]>([]);

  constructor() {
    loadGoogleFonts('Big+Shoulders+Display:wght@800');
  }

  /** Mouse hover previews a panel; touch relies on the tap (click) so a scroll doesn't open panels. */
  protected hoverOpen(e: PointerEvent, i: number): void {
    if (e.pointerType === 'mouse') this.active.set(i);
  }

  protected isBooked(id: string): boolean {
    return this.booked().includes(id);
  }

  protected toggleBook(id: string): void {
    this.booked.update((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  }

  protected move(dir: number, e: Event): void {
    const t = e.target as HTMLElement;
    if (!t.classList.contains('hit') && !t.classList.contains('book')) return;
    e.preventDefault();
    const n = this.sessions.length;
    const next = (this.active() + dir + n) % n;
    this.active.set(next);
    const host = t.closest('.panels');
    (host?.querySelectorAll<HTMLElement>('.hit')[next])?.focus();
  }
}
