import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Dept = 'Design' | 'Engineering' | 'Ops';

interface Person {
  id: string;
  name: string;
  role: string;
  dept: Dept;
  city: string;
  bio: string;
  img: string;
  color: string;
}

@Component({
  selector: 'demo-team-profile-grid',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <h3>The people behind Fieldnote <span>{{ shown().length }}</span></h3>
      <div class="tabs" role="group" aria-label="Filter by team">
        @for (d of depts; track d) {
          <button type="button" [class.on]="dept() === d" [attr.aria-pressed]="dept() === d" (click)="dept.set(d)">{{ d }}</button>
        }
      </div>
    </div>
    <ul class="grid">
      @for (p of shown(); track p.id) {
        <li
          class="card"
          [class.open]="openId() === p.id"
          [style.--c]="p.color"
          tabindex="0"
          (click)="toggle(p.id)"
          (keydown.enter)="toggle(p.id)"
        >
          <div class="photo">
            <img [src]="p.img" [appImgFallback]="p.id" [alt]="'Portrait of ' + p.name" loading="lazy" />
          </div>
          <div class="info">
            <h4>{{ p.name }}</h4>
            <p class="role">{{ p.role }}</p>
            <p class="city">{{ p.city }}</p>
          </div>
          <div class="reveal">
            <p>{{ p.bio }}</p>
            <div class="links">
              <a href="#" (click)="$event.preventDefault(); $event.stopPropagation()" [attr.aria-label]="p.name + ' on LinkedIn'">in</a>
              <a href="#" (click)="$event.preventDefault(); $event.stopPropagation()" [attr.aria-label]="'Email ' + p.name">
                <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="5" width="14" height="10" rx="1.5" /><path d="M3.5 6l6.5 5 6.5-5" /></svg>
              </a>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(20px, 4cqi, 40px);
      background: #ffe066; color: #111; font-family: 'Space Grotesk', 'Geist', sans-serif;
      container-type: inline-size;
    }
    .bar { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 22px; }
    h3 { font-size: clamp(22px, 3.2cqi, 30px); font-weight: 700; letter-spacing: -0.03em; display: flex; align-items: center; gap: 10px; }
    h3 span { font-size: 14px; background: #111; color: #ffe066; border-radius: 999px; padding: 2px 9px; letter-spacing: 0; }
    .tabs { display: flex; gap: 6px; flex-wrap: wrap; }
    .tabs button { border: 2px solid #111; background: transparent; color: #111; border-radius: 999px; padding: 6px 13px; min-height: 36px; font-weight: 600; font-size: 13.5px; cursor: pointer; transition: background .15s, color .15s, transform .15s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    @media (hover: hover) { .tabs button:hover { transform: translateY(-1px); } }
    .tabs button:active { transform: translateY(1px); }
    @media (pointer: coarse) { .tabs button { min-height: 42px; padding: 6px 15px; } }
    .tabs button.on { background: #111; color: #ffe066; }
    .grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 190px), 1fr)); gap: 16px; }
    .card {
      position: relative; background: #fffdf5; border: 2px solid #111; border-radius: 16px; overflow: hidden;
      box-shadow: 5px 5px 0 #111; transition: transform .25s cubic-bezier(.3,.7,.3,1), box-shadow .25s;
      animation: pop .4s cubic-bezier(.3,1.4,.5,1) both; outline: none; cursor: pointer;
      -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    }
    .card:focus-visible, .card.open { transform: translate(-3px, -3px); box-shadow: 8px 8px 0 #111; }
    @media (hover: hover) { .card:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0 #111; } }
    .card:focus-visible { outline: 3px solid #111; outline-offset: 3px; }
    .photo { aspect-ratio: 1 / 1.02; background: var(--c); border-bottom: 2px solid #111; overflow: hidden; }
    .photo img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; filter: grayscale(1) contrast(1.1); transition: filter .4s, transform .6s; }
    .card:focus-visible .photo img, .card.open .photo img { filter: grayscale(0) contrast(1); mix-blend-mode: normal; transform: scale(1.04); }
    @media (hover: hover) { .card:hover .photo img { filter: grayscale(0) contrast(1); mix-blend-mode: normal; transform: scale(1.04); } }
    .info { padding: 12px 14px 14px; }
    h4 { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
    .role { font-size: 13.5px; margin-top: 2px; }
    .city { font-size: 12px; color: #5d5a4e; margin-top: 4px; }
    .reveal {
      position: absolute; inset: auto 0 0 0; background: var(--c); border-top: 2px solid #111;
      padding: 14px; transform: translateY(101%); transition: transform .35s cubic-bezier(.3,.8,.3,1);
      display: grid; gap: 10px;
    }
    @media (hover: hover) { .card:hover .reveal, .card:focus-within .reveal { transform: none; } }
    .card.open .reveal, .card:focus-visible .reveal, .card:has(a:focus-visible) .reveal { transform: none; }
    .reveal p { font-size: 13.5px; line-height: 1.4; }
    .links { display: flex; gap: 6px; }
    .links a { position: relative; width: 34px; height: 34px; border: 2px solid #111; border-radius: 50%; display: grid; place-items: center; text-decoration: none; font-weight: 700; font-size: 13px; background: #fffdf5; color: #111; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .links a::before { content: ''; position: absolute; inset: -5px; border-radius: 50%; }
    .links a:hover, .links a:active { background: #111; color: #fffdf5; }
    .links { gap: 10px; }
    .links svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; }
    @container (max-width: 480px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .card { border-radius: 14px; box-shadow: 4px 4px 0 #111; }
      .card.open, .card:focus-visible { box-shadow: 6px 6px 0 #111; }
      .info { padding: 10px 11px 12px; }
      h4 { font-size: 15px; }
      .role { font-size: 12.5px; }
      .reveal { padding: 11px; gap: 8px; }
      .reveal p { font-size: 12.5px; line-height: 1.35; }
    }
    @keyframes pop { from { opacity: 0; transform: scale(.92); } }
  `,
})
export class TeamProfileGrid {
  protected readonly depts: ('Everyone' | Dept)[] = ['Everyone', 'Design', 'Engineering', 'Ops'];
  protected readonly dept = signal<'Everyone' | Dept>('Everyone');
  private readonly people: Person[] = [
    { id: 'tp-1', name: 'Amara Nwosu', role: 'Head of Design', dept: 'Design', city: 'Lagos', color: '#ff8fab', bio: 'Ran the redesign of our mobile editor. Sketches in fountain pen, always.', img: unsplash('photo-1531123897727-8f129e1688ce', 400, 420) },
    { id: 'tp-2', name: 'Jonas Weber', role: 'Staff Engineer', dept: 'Engineering', city: 'Berlin', color: '#7bdff2', bio: 'Owns sync and offline. Has opinions about CRDTs and coffee grind size.', img: unsplash('photo-1507003211169-0a1dd7228f2d', 400, 420) },
    { id: 'tp-3', name: 'Sofia Marquez', role: 'Product Designer', dept: 'Design', city: 'Mexico City', color: '#b2f7ef', bio: 'Designs our onboarding. Previously illustrated children’s books.', img: unsplash('photo-1438761681033-6461ffad8d80', 400, 420) },
    { id: 'tp-4', name: 'Ravi Menon', role: 'Platform Lead', dept: 'Engineering', city: 'Bengaluru', color: '#f7d6e0', bio: 'Keeps p99 under 80ms. Weekend marathoner, weekday debugger.', img: unsplash('photo-1500648767791-00dcc994a43e', 400, 420) },
    { id: 'tp-5', name: 'Elin Lund', role: 'People & Ops', dept: 'Ops', city: 'Stockholm', color: '#cdb4db', bio: 'Built our remote hiring loop. Hosts the Friday show-and-tell.', img: unsplash('photo-1544005313-94ddf0286df2', 400, 420) },
    { id: 'tp-6', name: 'Marcus Hill', role: 'Finance Lead', dept: 'Ops', city: 'Toronto', color: '#a0c4ff', bio: 'Makes the spreadsheets that make the roadmap possible.', img: unsplash('photo-1506794778202-cad84cf45f1d', 400, 420) },
  ];
  /** Profile whose bio is open (tap/click toggles; hover still previews with a mouse). */
  protected readonly openId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.openId.update((cur) => (cur === id ? null : id));
  }

  protected readonly shown = computed(() => {
    const d = this.dept();
    return d === 'Everyone' ? this.people : this.people.filter((p) => p.dept === d);
  });

  constructor() {
    loadGoogleFonts('Space+Grotesk:wght@400;500;600;700');
  }
}
