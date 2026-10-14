import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { HERO_TOUCH_CSS, preventHashLinks } from '../hero-kit';

type Tab = 'home' | 'spaces' | 'card';

@Component({
  selector: 'demo-split-app-mockup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'hash($event)' },
  template: `
    <header class="nav">
      <a class="logo" href="#"><span class="pebble" aria-hidden="true"></span>pebble</a>
      <nav class="links" aria-label="Primary">
        <a href="#">Personal</a><a href="#">Joint</a><a href="#">Savings</a><a href="#">Help</a>
      </nav>
      <a class="cta-sm" href="#">Get the app</a>
      <button class="burger" type="button" [attr.aria-expanded]="menu()" aria-label="Toggle menu" (click)="menu.set(!menu())">
        <span></span><span></span>
      </button>
      @if (menu()) {
        <nav class="sheet" aria-label="Mobile">
          <a href="#" (click)="menu.set(false)">Personal</a><a href="#" (click)="menu.set(false)">Joint</a>
          <a href="#" (click)="menu.set(false)">Savings</a><a href="#" (click)="menu.set(false)">Get the app</a>
        </nav>
      }
    </header>

    <div class="body">
      <section class="copy">
        <h1>A bank account that's just a <span>bank account.</span></h1>
        <p class="sub">No tokens, no trading, no hype. A free current account, 4.25% easy-access savings and a card that works in 150 countries without fees.</p>
        <div class="ctas">
          <a class="btn primary" href="#">Open in 6 minutes</a>
          <a class="btn soft" href="#">How we're regulated</a>
        </div>
        <p class="trust">Licensed by the Bank of Lithuania · deposits protected to €100,000</p>
      </section>

      <div class="phone-wrap">
        <div class="phone" role="group" aria-label="Pebble app preview">
          <div class="status" aria-hidden="true"><span>9:41</span><span class="notch"></span><span>5G ▮▮▮</span></div>
          <div class="screen">
            @switch (tab()) {
              @case ('home') {
                <p class="s-lbl">Main account</p>
                <p class="bal">€3,482<small>.60</small></p>
                <svg class="spark" viewBox="0 0 200 50" aria-hidden="true">
                  <path class="area" d="M0 40 C20 38 30 30 50 32 S80 18 100 22 140 8 160 14 190 6 200 4 V50 H0Z" />
                  <path class="line" d="M0 40 C20 38 30 30 50 32 S80 18 100 22 140 8 160 14 190 6 200 4" />
                </svg>
                <ul class="tx">
                  @for (t of txs; track t.n; let i = $index) {
                    <li [style.--i]="i"><span class="ic" [style.background]="t.c">{{ t.n[0] }}</span><span class="n">{{ t.n }}<small>{{ t.d }}</small></span><b [class.in]="t.a.startsWith('+')">{{ t.a }}</b></li>
                  }
                </ul>
              }
              @case ('spaces') {
                <p class="s-lbl">Spaces</p>
                <p class="bal sm">€3,940 saved</p>
                <ul class="spaces">
                  @for (s of spaces; track s.n; let i = $index) {
                    <li [style.--i]="i">
                      <div class="sp-top"><span>{{ s.e }} {{ s.n }}</span><b>€{{ s.have }}</b></div>
                      <div class="sp-bar"><span [style.width.%]="(s.have / s.goal) * 100" [style.background]="s.c"></span></div>
                      <small>of €{{ s.goal }}</small>
                    </li>
                  }
                </ul>
              }
              @case ('card') {
                <p class="s-lbl">Your card</p>
                <div class="card" [class.frozen]="frozen()">
                  <span class="c-brand">pebble</span><span class="c-num">•••• 2291</span>
                  @if (frozen()) { <span class="c-frozen">Frozen</span> }
                </div>
                <button type="button" class="freeze" role="switch" [attr.aria-checked]="frozen()" (click)="frozen.set(!frozen())">
                  <span>Freeze card</span><i [class.on]="frozen()"></i>
                </button>
                <div class="limits"><span>Monthly ATM limit</span><b>€400 of €1,000</b></div>
              }
            }
          </div>
          <nav class="tabs" aria-label="App sections">
            @for (t of tabs; track t.id) {
              <button type="button" [class.on]="tab() === t.id" [attr.aria-pressed]="tab() === t.id" (click)="tab.set(t.id)">{{ t.label }}</button>
            }
          </nav>
        </div>
        <div class="float f1" aria-hidden="true"><b>+€3,150.00</b> Salary from Studio Kade</div>
        <div class="float f2" aria-hidden="true">4.25% AER · paid daily</div>
      </div>
    </div>
  `,
  styles: [HERO_TOUCH_CSS, `
    :host {
      position: relative; display: flex; flex-direction: column; min-height: 100%;
      container-type: inline-size; overflow: hidden;
      background: radial-gradient(60% 80% at 80% 60%, #f6dbe4 0%, transparent 60%), #e8ecef; color: #111827; font-family: 'Outfit', system-ui, sans-serif;
    }
    .nav { position: relative; z-index: 4; display: flex; align-items: center; gap: 26px; padding: 20px clamp(18px, 4.5cqi, 56px); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 22px; letter-spacing: -0.03em; text-decoration: none; }
    .pebble { width: 24px; height: 18px; border-radius: 50% 50% 46% 54% / 60% 60% 40% 40%; background: #111827; }
    .links { display: flex; gap: 24px; margin-left: auto; font-size: 15px; }
    .links a, .sheet a { text-decoration: none; }
    .links a { color: #4b5563; }
    .links a:hover { color: #111827; }
    .cta-sm { text-decoration: none; font-weight: 600; font-size: 14.5px; padding: 10px 18px; border-radius: 999px; background: #111827; color: #fff; }
    .burger { display: none; margin-left: auto; width: 44px; height: 44px; border: 0; border-radius: 50%; background: #fff; cursor: pointer; place-content: center; gap: 5px; }
    .burger span { display: block; width: 16px; height: 2px; border-radius: 2px; background: #111827; }
    .sheet { position: absolute; top: 76px; left: 16px; right: 16px; display: grid; padding: 8px; background: #fff; border-radius: 22px; box-shadow: 0 30px 60px -30px rgba(17,24,39,.4); }
    .sheet a { padding: 12px 14px; font-size: 17px; font-weight: 500; border-radius: 14px; }
    .sheet a:hover { background: #f1f3f5; }

    .body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(24px, 4cqi, 56px); padding: 6px clamp(18px, 4.5cqi, 56px) 30px; }
    h1 { font-weight: 600; font-size: clamp(36px, 6cqi, 70px); line-height: 1; letter-spacing: -0.045em; max-width: 12ch; }
    h1 span { color: #ff5c8a; }
    .sub { margin-top: 20px; font-size: clamp(15px, 1.7cqi, 18px); line-height: 1.55; color: #4b5563; max-width: 42ch; }
    .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .btn { text-decoration: none; font-weight: 600; font-size: 15.5px; padding: 15px 24px; border-radius: 999px; transition: transform .2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn.primary { background: #ff5c8a; color: #fff; box-shadow: 0 14px 28px -14px #ff5c8a; }
    .btn.soft { background: #fff; color: #111827; }
    .trust { margin-top: 22px; font-size: 13px; color: #6b7280; }

    .phone-wrap { position: relative; justify-self: center; padding: 10px 40px; }
    .phone { position: relative; width: 268px; height: 520px; border-radius: 44px; background: #fbfbfc; border: 9px solid #111827; box-shadow: 0 50px 80px -40px rgba(17,24,39,.55), inset 0 0 0 1px #e5e7eb;
      display: flex; flex-direction: column; overflow: hidden; transform: rotate(-3deg); }
    .status { display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 4px; font-size: 11px; font-weight: 600; }
    .notch { width: 74px; height: 20px; border-radius: 12px; background: #111827; }
    .screen { flex: 1; padding: 12px 16px; overflow: hidden; }
    .s-lbl { font-size: 12px; color: #6b7280; }
    .bal { font-weight: 700; font-size: 32px; letter-spacing: -0.04em; animation: rise .5s cubic-bezier(.2,.8,.2,1) both; }
    .bal small { font-size: 18px; color: #9ca3af; }
    .bal.sm { font-size: 24px; }
    .spark { width: 100%; height: 50px; margin: 6px 0 8px; }
    .spark .area { fill: rgba(255,92,138,.14); }
    .spark .line { fill: none; stroke: #ff5c8a; stroke-width: 2; stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw 1.2s ease forwards .2s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    .tx, .spaces { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
    .tx li, .spaces li { animation: rise .45s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 70ms + 150ms); }
    @keyframes rise { from { opacity: 0; transform: translateY(12px); } }
    .tx li { display: grid; grid-template-columns: 30px 1fr auto; gap: 10px; align-items: center; padding: 7px 0; font-size: 13px; }
    .ic { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; font-weight: 700; font-size: 12px; color: #111827; }
    .n { display: grid; line-height: 1.2; font-weight: 500; }
    .n small { color: #9ca3af; font-size: 11px; font-weight: 400; }
    .tx b { font-weight: 600; }
    .tx b.in { color: #0f9d58; }
    .spaces { gap: 12px; margin-top: 12px; }
    .spaces li { padding: 12px; border-radius: 16px; background: #f1f3f5; font-size: 13px; }
    .sp-top { display: flex; justify-content: space-between; font-weight: 500; }
    .sp-bar { height: 6px; border-radius: 6px; background: #e5e7eb; margin: 8px 0 4px; overflow: hidden; }
    .sp-bar span { display: block; height: 100%; border-radius: inherit; }
    .spaces small { color: #9ca3af; font-size: 11px; }
    .card { position: relative; margin-top: 10px; aspect-ratio: 1.586; border-radius: 16px; padding: 14px; color: #111827; display: flex; flex-direction: column; justify-content: space-between;
      background: linear-gradient(135deg, #ffd166, #ff5c8a); transition: filter .4s; animation: rise .5s both; }
    .card.frozen { filter: grayscale(1) brightness(1.15); }
    .c-brand { font-weight: 700; font-size: 18px; letter-spacing: -0.03em; }
    .c-num { font-size: 13px; letter-spacing: .12em; }
    .c-frozen { position: absolute; inset: 0; display: grid; place-items: center; font-weight: 600; font-size: 14px; color: #111827; backdrop-filter: blur(2px); border-radius: inherit; background: rgba(255,255,255,.35); }
    .freeze { width: 100%; margin-top: 14px; display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: 14px; border: 0; background: #f1f3f5; font: 500 13.5px 'Outfit', sans-serif; cursor: pointer; }
    .freeze i { width: 38px; height: 22px; border-radius: 22px; background: #d1d5db; position: relative; transition: background .25s; }
    .freeze i::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.3,1.4,.5,1); }
    .freeze i.on { background: #111827; }
    .freeze i.on::after { transform: translateX(16px); }
    .limits { display: flex; justify-content: space-between; margin-top: 12px; font-size: 12.5px; color: #6b7280; }
    .limits b { color: #111827; font-weight: 600; }
    .tabs { display: flex; gap: 4px; margin: 0 12px 12px; padding: 4px; border-radius: 18px; background: #111827; }
    .tabs button { flex: 1; border: 0; background: transparent; color: #9ca3af; font: 500 12.5px 'Outfit', sans-serif; padding: 9px 0; border-radius: 14px; cursor: pointer; transition: background .2s, color .2s; }
    .tabs button.on { background: #fff; color: #111827; }
    @media (pointer: coarse) { .tabs button { min-height: 38px; } }
    .tabs button:active, .freeze:active { scale: .97; }
    .float { position: absolute; z-index: 2; padding: 10px 14px; border-radius: 16px; background: #fff; font-size: 12.5px; box-shadow: 0 20px 40px -20px rgba(17,24,39,.35); white-space: nowrap; animation: hover 6s ease-in-out infinite; }
    .float b { color: #0f9d58; margin-right: 4px; }
    .f1 { top: 22%; left: -10px; }
    .f2 { bottom: 16%; right: -6px; animation-delay: -3s; background: #111827; color: #fff; }
    @keyframes hover { 50% { transform: translateY(-8px); } }

    @container (max-width: 760px) {
      .links, .cta-sm { display: none; }
      .burger { display: grid; }
      .body { grid-template-columns: 1fr; }
      .phone-wrap { padding: 10px 20px; }
      .f1 { left: -14px; }
    }
    @container (max-width: 400px) {
      /* keep the 268px handset inside a ~340px stage */
      .phone-wrap { padding: 10px 8px; }
      .phone { width: 244px; height: 486px; border-radius: 40px; }
      .f1 { left: -10px; top: 16%; }
      .f2 { right: -8px; }
    }
  `],
})
export class SplitAppMockup {
  protected readonly menu = signal(false);
  protected readonly hash = preventHashLinks;
  protected readonly tab = signal<Tab>('home');
  protected readonly frozen = signal(false);
  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'spaces', label: 'Spaces' },
    { id: 'card', label: 'Card' },
  ];
  protected readonly txs = [
    { n: 'Albert Heijn', d: 'Groceries · today', a: '−€23.40', c: '#d9f2ff' },
    { n: 'Salary', d: 'Studio Kade · yesterday', a: '+€3,150.00', c: '#d7f5e3' },
    { n: 'NS Trains', d: 'Transport · Mon', a: '−€12.80', c: '#fff1c9' },
    { n: 'Spotify', d: 'Subscriptions · Mon', a: '−€10.99', c: '#ffe0ea' },
  ];
  protected readonly spaces = [
    { n: 'Rent', e: '🏠', have: 1200, goal: 1200, c: '#111827' },
    { n: 'Lisbon in May', e: '✈️', have: 640, goal: 1500, c: '#ff5c8a' },
    { n: 'Rainy day', e: '☂️', have: 2100, goal: 5000, c: '#ffb703' },
  ];

  constructor() {
    loadGoogleFonts('Outfit:wght@400;500;600;700');
  }
}
