import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

@Component({
  selector: 'demo-jumbotron-classic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)', '[class.seen]': 'seen()' },
  template: `
    <header class="nav">
      <a class="logo" href="#">
        <svg viewBox="0 0 26 26" aria-hidden="true"><rect x="3" y="4" width="5" height="18" rx="1" /><rect x="10" y="7" width="5" height="15" rx="1" /><rect x="17.5" y="5" width="5" height="17" rx="1" transform="rotate(8 20 13)" /></svg>
        Open Shelf
      </a>
      <nav class="links" aria-label="Primary">
        <a href="#">Find a shelf</a><a href="#">Start one</a><a href="#">Stories</a><a href="#">About</a>
      </nav>
      <a class="cta-sm" href="#">Donate</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">Menu</button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Find a shelf</a><a href="#" (click)="menu.set(false)">Start one</a>
          <a href="#" (click)="menu.set(false)">Stories</a><a href="#" (click)="menu.set(false)">Donate</a>
        </nav>
      }
    </header>

    <div class="wrap">
      <section class="jumbo">
        <div class="text">
          <p class="eyebrow">Registered charity no. 1187420</p>
          <h1>A library on every corner.</h1>
          <p class="lead">Open Shelf helps neighbours build and stock free little libraries. 2,140 shelves in 38 cities have lent more than 410,000 books.</p>
          <hr />
          <div class="drive">
            <div class="drive-row"><span>Winter book drive</span><b>£{{ raisedLabel }} of £40,000</b></div>
            <div class="bar" role="progressbar" aria-label="Winter book drive progress" aria-valuemin="0" aria-valuemax="40000" [attr.aria-valuenow]="raised">
              <span [style.width.%]="seen() ? pct : 0"></span>
            </div>
            <p class="note">Every £15 puts twelve new children's books on a shelf.</p>
          </div>
          <div class="ctas">
            <a class="btn primary" href="#">Donate £15</a>
            <a class="btn secondary" href="#">Map the shelves</a>
          </div>
        </div>

        <div class="shelf" role="list" aria-label="Recently borrowed books">
          @for (b of books; track b.t) {
            <button
              type="button"
              role="listitem"
              class="book"
              [style.--h.%]="b.h"
              [style.--c]="b.c"
              [class.on]="pick() === b.t"
              (click)="pick.set(pick() === b.t ? null : b.t)"
              [attr.aria-label]="b.t + ' by ' + b.a"
            >
              <span class="spine">{{ b.t }}</span>
            </button>
          }
          <p class="picked" aria-live="polite">
            @if (picked(); as p) {
              <b>{{ p.t }}</b> · {{ p.a }} — borrowed {{ p.n }} times
            } @else {
              Tap a spine to see what's being borrowed
            }
          </p>
        </div>
      </section>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; background: #fbfaf6; color: #142019; font-family: 'Public Sans', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 26px; padding: 16px clamp(16px, 4cqi, 48px); border-bottom: 1px solid #e4e6df; background: #fff; }
    .logo { display: flex; align-items: center; gap: 9px; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 20px; text-decoration: none; }
    .logo svg { width: 26px; height: 26px; fill: #1d4d3a; }
    .logo svg rect:nth-child(2) { fill: #e3b23c; }
    .links { display: flex; gap: 22px; margin-left: auto; font-size: 14.5px; }
    .links a, .sheet a { text-decoration: none; color: #3a4a41; }
    .links a:hover { color: #1d4d3a; text-decoration: underline; text-underline-offset: 4px; }
    .cta-sm { text-decoration: none; font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 6px; border: 1.5px solid #1d4d3a; color: #1d4d3a; }
    .cta-sm:hover { background: #1d4d3a; color: #fff; }
    .burger { display: none; margin-left: auto; padding: 8px 14px; border-radius: 6px; border: 1.5px solid #1d4d3a; background: none; color: #1d4d3a; font-weight: 600; cursor: pointer; }
    .sheet { position: absolute; top: 64px; left: 12px; right: 12px; display: grid; padding: 6px; background: #fff; border: 1px solid #e4e6df; border-radius: 10px; box-shadow: 0 20px 40px -24px rgba(20,32,25,.35); }
    .sheet a { padding: 11px 12px; border-radius: 6px; }
    .sheet a:hover { background: #eef3ee; }

    .wrap { flex: 1; display: flex; padding: clamp(14px, 3cqi, 36px) clamp(12px, 4cqi, 48px); }
    .jumbo {
      flex: 1; display: grid; grid-template-columns: 1.25fr .75fr; gap: clamp(20px, 4cqi, 56px); align-items: center;
      padding: clamp(26px, 5cqi, 64px); border-radius: 18px;
      background: linear-gradient(180deg, #eef3ee, #e6eee7); border: 1px solid #dbe5dc;
      box-shadow: inset 0 1px 0 #fff, 0 1px 2px rgba(20,32,25,.05);
    }
    .eyebrow { font-size: 13px; color: #5c6d63; }
    h1 { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(36px, 6.4cqi, 72px); line-height: 1.02; letter-spacing: -0.025em; margin: 10px 0 16px; font-variation-settings: 'opsz' 60; }
    .lead { font-size: clamp(16px, 1.9cqi, 20px); line-height: 1.55; font-weight: 300; max-width: 46ch; color: #2c3a32; }
    hr { border: 0; height: 1px; background: #cfdbd1; margin: 22px 0 18px; }
    .drive-row { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; flex-wrap: wrap; }
    .drive-row b { font-variant-numeric: tabular-nums; }
    .bar { height: 10px; border-radius: 99px; background: #d5e1d7; overflow: hidden; margin: 10px 0; }
    .bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #1d4d3a, #2f7a5b); transition: width 1.6s cubic-bezier(.2,.8,.2,1) .2s; }
    .note { font-size: 13px; color: #5c6d63; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 16px; padding: 13px 22px; border-radius: 8px; transition: background .2s, box-shadow .2s; }
    .btn.primary { background: #1d4d3a; color: #fff; box-shadow: 0 1px 0 #0e2a1f, 0 10px 20px -12px rgba(29,77,58,.8); }
    .btn.primary:hover { background: #256148; }
    .btn.secondary { background: #fff; color: #1d4d3a; box-shadow: inset 0 0 0 1px #cfdbd1; }
    .btn.secondary:hover { box-shadow: inset 0 0 0 1.5px #1d4d3a; }

    .shelf { align-self: stretch; display: flex; align-items: flex-end; gap: 4px; flex-wrap: wrap; align-content: flex-end; padding: 0 6px; min-height: 280px; padding-top: 40px; position: relative;
      border-bottom: 10px solid #8a6a43; border-radius: 0 0 4px 4px; }
    .book { --h: 80%; --c: #1d4d3a; flex: 1 1 26px; max-width: 46px; height: calc(var(--h) * 2.6px); min-height: 150px; border: 0; padding: 0; border-radius: 3px 3px 0 0; cursor: pointer;
      background: linear-gradient(90deg, rgba(255,255,255,.12), transparent 30%, rgba(0,0,0,.12)), var(--c);
      transition: transform .35s cubic-bezier(.3,1.5,.5,1); display: grid; place-items: center; overflow: hidden; }
    .book.on { transform: translateY(-14px); }
    @media (hover: hover) { .book:hover { transform: translateY(-14px); } }
    .book:active { filter: brightness(1.1); }
    .book.on { box-shadow: 0 0 0 2px #e3b23c; }
    .spine { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Source Serif 4', serif; font-size: 12px; color: rgba(255,255,255,.88); white-space: nowrap; }
    .picked { position: absolute; left: 0; right: 0; top: 0; font-size: 13px; color: #3a4a41; text-align: center; }

    @container (max-width: 760px) {
      .links, .cta-sm { display: none; }
      .burger { display: block; }
      .jumbo { grid-template-columns: 1fr; }
      .shelf { min-height: 220px; }
      .book { min-height: 120px; height: calc(var(--h) * 1.8px); }
    }
  `],
})
export class JumbotronClassic {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly raised = 31420;
  protected readonly pct = (31420 / 40000) * 100;
  protected readonly raisedLabel = '31,420';
  protected readonly seen = hostVisible(0.3);
  protected readonly pick = signal<string | null>(null);
  protected readonly books = [
    { t: 'The Gruffalo', a: 'Julia Donaldson', n: 412, h: 72, c: '#2f7a5b' },
    { t: 'Small Island', a: 'Andrea Levy', n: 188, h: 92, c: '#a3442f' },
    { t: 'Matilda', a: 'Roald Dahl', n: 365, h: 80, c: '#e3b23c' },
    { t: 'Persuasion', a: 'Jane Austen', n: 121, h: 98, c: '#24405c' },
    { t: 'Wonder', a: 'R. J. Palacio', n: 274, h: 86, c: '#6b4e8a' },
    { t: 'Kindred', a: 'Octavia E. Butler', n: 96, h: 100, c: '#1d4d3a' },
    { t: 'Holes', a: 'Louis Sachar', n: 233, h: 76, c: '#c9783a' },
    { t: 'Stig of the Dump', a: 'Clive King', n: 140, h: 84, c: '#4f6f7f' },
  ];
  protected readonly picked = computed(() => this.books.find((b) => b.t === this.pick()) ?? null);

  constructor() {
    loadGoogleFonts('Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700', 'Public+Sans:wght@300;400;600');
  }
}
