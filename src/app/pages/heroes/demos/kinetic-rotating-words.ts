import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { hostVisible, prefersReducedMotion } from '../../../shared/visibility';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

const WORDS = ['still warm.', 'naturally leavened.', 'baked at 4 am.', 'worth the queue.'];

@Component({
  selector: 'demo-kinetic-rotating-words',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#">Brot <span>&amp;</span> Butter</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Menu</a><a href="#">Order ahead</a><a href="#">Wholesale</a><a href="#">Find us</a>
      </nav>
      <a class="cta-sm" href="#">Order for tomorrow</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Menu</a><a href="#" (click)="menu.set(false)">Order ahead</a>
          <a href="#" (click)="menu.set(false)">Find us</a><a href="#" (click)="menu.set(false)">Order for tomorrow</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <p class="open"><span></span>Open today 07:00–15:00 · Kastanienallee 21, Berlin</p>
        <h1>
          <span class="visually-hidden">Bread that's still warm, naturally leavened, baked at 4 am and worth the queue.</span>
          <span aria-hidden="true">Bread that's<br /><span class="typed">{{ typed() }}<i class="caret" [class.idle]="idle()"></i></span></span>
        </h1>
        <p class="sub">Sourdough, 70% rye and cardamom buns from a wood-lined deck oven, Tuesday to Sunday, until we sell out.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Order for tomorrow</a>
          <a class="btn ghost" href="#">See the full menu</a>
        </div>
      </section>

      <aside class="board" aria-labelledby="bb-board">
        <h2 id="bb-board">Out of the oven today</h2>
        <ul>
          @for (b of bakes; track b.name) {
            <li [class.gone]="b.state === 'gone'" [class.next]="b.state === 'next'">
              <time>{{ b.time }}</time>
              <span class="name">{{ b.name }}</span>
              <span class="st">{{ b.state === 'gone' ? 'Sold out' : b.state === 'next' ? 'Next' : b.price }}</span>
            </li>
          }
        </ul>
        <p class="foot">Reserve before 20:00 for tomorrow's first bake.</p>
      </aside>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: #1f3a8a; color: #fff3cf; font-family: 'Rethink Sans', system-ui, sans-serif;
      background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 60px, transparent 60px 120px);
    }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    .nav { position: relative; z-index: 3; display: flex; align-items: center; gap: 24px; padding: 20px clamp(18px, 4.5cqi, 56px); }
    .logo { font-family: 'Caprasimo', serif; font-size: 25px; text-decoration: none; color: #ffd56b; }
    .logo span { color: #fff3cf; }
    .links { display: flex; gap: 22px; margin-left: auto; font-size: 15px; font-weight: 500; }
    .links a, .sheet a { text-decoration: none; }
    .links a:hover { color: #ffd56b; }
    .cta-sm { text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 18px; border-radius: 12px; background: #ffd56b; color: #1f3a8a; }
    .burger { display: none; margin-left: auto; width: 44px; height: 44px; border-radius: 12px; border: 0; background: #ffd56b; cursor: pointer; place-content: center; gap: 6px; }
    .burger span { display: block; width: 18px; height: 2px; border-radius: 2px; background: #1f3a8a; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; background: #fff3cf; color: #1f3a8a; border-radius: 18px; }
    .sheet a { padding: 11px 14px; font-family: 'Caprasimo', serif; font-size: 22px; }

    .body { flex: 1; display: grid; grid-template-columns: 1.4fr .8fr; gap: clamp(24px, 4cqi, 56px); align-items: center; padding: 8px clamp(18px, 4.5cqi, 56px) 40px; }
    .open { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: rgba(255,243,207,.8); }
    .open span { width: 8px; height: 8px; border-radius: 50%; background: #7ee2a8; }
    h1 { font-family: 'Caprasimo', serif; font-weight: 400; font-size: clamp(40px, 7.4cqi, 92px); line-height: 1; letter-spacing: -0.01em; margin: 16px 0 20px; min-height: 2.05em; }
    .typed { color: #ffd56b; white-space: nowrap; }
    .caret { display: inline-block; width: .07em; height: .82em; margin-left: .06em; background: #ffd56b; vertical-align: -0.06em; border-radius: 2px; }
    .caret.idle { animation: blink 1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    .sub { max-width: 44ch; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.6; color: rgba(255,243,207,.82); }
    .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 700; font-size: 15.5px; padding: 15px 24px; border-radius: 14px; transition: transform .2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn.primary { background: #ffd56b; color: #1f3a8a; box-shadow: 0 5px 0 #d9a933; }
    .btn.primary:active { transform: translateY(3px); box-shadow: 0 2px 0 #d9a933; }
    .btn.ghost { border: 2px solid rgba(255,243,207,.4); }

    .board { background: #fff3cf; color: #1f3a8a; border-radius: 22px; padding: 20px 20px 16px; transform: rotate(1.5deg); box-shadow: 0 30px 50px -30px rgba(0,0,0,.6); }
    .board h2 { font-family: 'Caprasimo', serif; font-weight: 400; font-size: 22px; margin-bottom: 10px; }
    .board ul { list-style: none; margin: 0; padding: 0; }
    .board li { display: grid; grid-template-columns: 50px 1fr auto; gap: 10px; align-items: baseline; padding: 10px 0; border-top: 1.5px dashed rgba(31,58,138,.25); font-size: 15px; }
    time { font-weight: 700; font-variant-numeric: tabular-nums; font-size: 13.5px; }
    .st { font-size: 13px; font-weight: 700; }
    .gone .name { text-decoration: line-through; opacity: .5; }
    .gone .st { opacity: .5; }
    .next .st { background: #1f3a8a; color: #ffd56b; padding: 2px 8px; border-radius: 6px; }
    .foot { font-size: 12.5px; margin-top: 8px; opacity: .75; }

    @container (max-width: 760px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .typed { white-space: normal; }
      h1 { min-height: 3.05em; }
    }
  `],
})
export class KineticRotatingWords {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly typed = signal(WORDS[0]);
  protected readonly idle = signal(true);
  private readonly visible = hostVisible();
  protected readonly bakes = [
    { time: '07:00', name: 'Roggen 70%', state: 'gone', price: '' },
    { time: '08:30', name: 'Country sourdough', state: 'ok', price: '€6.40' },
    { time: '10:00', name: 'Cardamom buns', state: 'next', price: '€3.20' },
    { time: '11:30', name: 'Seeded spelt', state: 'ok', price: '€5.90' },
    { time: '13:00', name: 'Focaccia, rosemary', state: 'ok', price: '€4.50' },
  ];

  constructor() {
    loadGoogleFonts('Caprasimo', 'Rethink+Sans:wght@400;500;700');
    let word = 0;
    effect((onCleanup) => {
      if (!this.visible()) return;
      let timer: ReturnType<typeof setTimeout>;
      const reduced = prefersReducedMotion();
      const later = (fn: () => void, ms: number) => (timer = setTimeout(fn, ms));
      const type = (n: number) => {
        const w = WORDS[word];
        this.typed.set(w.slice(0, n));
        if (n < w.length) later(() => type(n + 1), 55 + Math.random() * 60);
        else {
          this.idle.set(true);
          later(() => erase(w.length), 2200);
        }
      };
      const erase = (n: number) => {
        this.idle.set(false);
        this.typed.set(WORDS[word].slice(0, n));
        if (n > 0) later(() => erase(n - 1), 28);
        else {
          word = (word + 1) % WORDS.length;
          later(() => type(1), 260);
        }
      };
      const swap = () => {
        word = (word + 1) % WORDS.length;
        this.typed.set(WORDS[word]);
        later(swap, 4000);
      };
      if (reduced) later(swap, 4000);
      else later(() => erase(this.typed().length), 1800);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
