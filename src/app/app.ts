import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATEGORIES } from './core/categories';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'menu.set(false)' },
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <header class="bar">
      <div class="bar-inner">
        <a routerLink="/" class="brand" (click)="menu.set(false)">
          <img class="mark" src="android-chrome-192x192.png" width="36" height="36" alt="">
          Swatchbook
        </a>
        <button type="button" class="menu-btn" (click)="menu.set(!menu())" [attr.aria-expanded]="menu()" aria-controls="primary-nav">
          {{ menu() ? 'Close' : 'Menu' }}
        </button>
        <nav id="primary-nav" class="nav" [class.open]="menu()" aria-label="Categories">
          @for (c of categories; track c.key) {
            <a [routerLink]="['/', c.path]" routerLinkActive="on" [style.--sw]="c.swatch" (click)="menu.set(false)">
              <span class="dot" aria-hidden="true"></span>{{ c.title }}
            </a>
          }
        </nav>
      </div>
    </header>

    <main id="main">
      <router-outlet />
    </main>

    <footer class="foot">
      <div class="foot-inner">
        <p class="foot-brand"><img src="android-chrome-192x192.png" width="28" height="28" alt="">Swatchbook</p>
        <p>Every pattern here is a live Angular component with a prompt you can paste into any AI builder. Photos by Unsplash photographers, stored with the project (credits in images/CREDITS.md).</p>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; min-height: 100vh; }
    .skip { position: absolute; left: 12px; top: -60px; z-index: 200; background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 8px; }
    .skip:focus { top: 10px; }
    .bar {
      position: sticky; top: 0; z-index: 50; height: var(--header-h);
      background: color-mix(in srgb, var(--paper) 88%, transparent);
      backdrop-filter: saturate(1.4) blur(14px);
    }
    .bar-inner { max-width: var(--page-max); height: 100%; margin: 0 auto; padding: 0 var(--gutter); display: flex; align-items: center; gap: 24px; }
    .brand {
      display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
      font-family: var(--font-display); font-weight: 700; font-size: 21px; letter-spacing: -0.02em;
      font-variation-settings: 'wdth' 85;
    }
    .mark { width: 36px; height: 36px; display: block; border-radius: 9px; }
    .nav { margin-left: auto; display: flex; gap: 4px; }
    .nav a {
      display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 13px; border-radius: 999px;
      text-decoration: none; font-size: 15px; color: var(--ink-2); transition: background .15s;
    }
    .nav a:hover { background: var(--surface); }
    .nav a.on { background: var(--ink); color: #fff; }
    .dot { width: 9px; height: 9px; border-radius: 3px; background: var(--sw); }
    .menu-btn { display: none; margin-left: auto; border: 1px solid var(--line); background: var(--surface); border-radius: 999px; height: 36px; padding: 0 16px; cursor: pointer; }

    .foot { border-top: 1px solid var(--line-soft); }
    .foot-inner { max-width: var(--page-max); margin: 0 auto; padding: 36px var(--gutter) 48px; display: grid; grid-template-columns: auto 1fr; gap: 24px; color: var(--muted); font-size: 14px; }
    .foot-brand { font-family: var(--font-display); font-weight: 700; color: var(--ink); font-size: 17px; display: inline-flex; align-items: center; gap: 10px; }
    .foot-brand img { border-radius: 7px; }
    .foot p:last-child { max-width: 70ch; }

    @media (max-width: 860px) {
      .menu-btn { display: inline-flex; align-items: center; }
      .nav {
        position: absolute; top: var(--header-h); left: 0; right: 0; flex-direction: column; gap: 2px;
        padding: 10px var(--gutter) 18px; background: var(--paper); border-bottom: 1px solid var(--line);
        display: none;
      }
      .nav.open { display: flex; }
      .nav a { height: 46px; font-size: 17px; }
      .foot-inner { grid-template-columns: 1fr; }
    }
  `,
})
export class App {
  protected readonly categories = CATEGORIES;
  protected readonly menu = signal(false);

  constructor() {
    // iOS Safari only applies :active (pressed) styles when a touch listener exists on the page.
    document.addEventListener('touchstart', () => {}, { passive: true });
  }
}
