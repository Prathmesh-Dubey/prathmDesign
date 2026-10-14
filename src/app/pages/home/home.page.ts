import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/categories';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="copy">
        <h1>See the pattern working. Copy the prompt that builds it.</h1>
        <p class="lede">
          141 live interface designs across cards, products, galleries, type and heroes.
          Each one runs right on the page, with a detailed prompt you can paste into any AI builder.
        </p>
        <div class="cta">
          <a routerLink="/cards" class="primary">Start with cards</a>
          <a routerLink="/heroes" class="secondary">Browse heroes</a>
        </div>
      </div>

      <div class="deck" role="list" aria-label="Categories">
        @for (c of categories; track c.key; let i = $index) {
          <a role="listitem" class="swatch" [routerLink]="['/', c.path]" [style.--sw]="c.swatch" [style.--i]="i" [style.--n]="categories.length">
            <span class="sw-color"><span class="sw-spine" aria-hidden="true">{{ c.title }}</span><span class="sw-code">{{ c.code }}</span></span>
            <span class="sw-meta">
              <strong>{{ c.title }}</strong>
              <small>{{ c.families.length }} families</small>
            </span>
          </a>
        }
      </div>
    </section>

    <section class="index" aria-labelledby="index-title">
      <h2 id="index-title">What's inside</h2>
      <ul>
        @for (c of categories; track c.key) {
          <li [style.--sw]="c.swatch">
            <a [routerLink]="['/', c.path]">
              <span class="row-head">
                <span class="dot" aria-hidden="true"></span>
                <span class="row-title">{{ c.title }}</span>
              </span>
              <span class="row-blurb">{{ c.blurb }}</span>
              <span class="row-families">
                @for (f of c.families; track f) {
                  <span>{{ f }}</span>
                }
              </span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host { display: block; }
    .hero {
      max-width: var(--page-max); margin: 0 auto;
      padding: clamp(48px, 8vw, 110px) var(--gutter) clamp(48px, 7vw, 96px);
      display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: center;
    }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(42px, 6.4vw, 88px);
      font-weight: 700;
      font-variation-settings: 'wdth' 78, 'opsz' 96;
      letter-spacing: -0.035em;
      line-height: .95;
      text-wrap: balance;
    }
    .lede { margin-top: 24px; font-size: clamp(17px, 1.5vw, 20px); color: var(--ink-2); max-width: 50ch; }
    .cta { display: flex; gap: 10px; margin-top: 32px; flex-wrap: wrap; }
    .cta a { height: 48px; padding: 0 22px; display: inline-flex; align-items: center; border-radius: 999px; text-decoration: none; font-weight: 500; }
    .primary { background: var(--ink); color: #fff; }
    .primary:hover { background: var(--accent); }
    .secondary { border: 1px solid var(--line); background: var(--surface); }
    .secondary:hover { border-color: var(--ink); }

    /* The fanned swatch deck */
    .deck { --sw-w: clamp(140px, 15vw, 210px); --spread: 1; position: relative; height: clamp(360px, 42vw, 560px); }
    .swatch {
      --angle: calc((var(--i) - (var(--n) - 1) / 2) * 11deg * var(--spread));
      position: absolute; left: 50%; bottom: 0;
      width: var(--sw-w); aspect-ratio: 1 / 2.35;
      margin-left: calc(var(--sw-w) / -2);
      transform-origin: 50% 92%;
      transform: rotate(var(--angle));
      background: var(--surface);
      border-radius: 16px;
      padding: 9px 9px 0;
      display: grid; grid-template-rows: 1fr auto;
      text-decoration: none;
      box-shadow: 0 1px 0 rgba(18,26,51,.05), 0 24px 40px -22px rgba(18,26,51,.45);
      transition: transform .5s cubic-bezier(.2,.8,.2,1);
      animation: fan .9s cubic-bezier(.2,.8,.2,1) both;
      animation-delay: calc(var(--i) * 70ms + 120ms);
    }
    .deck:hover .swatch { transform: rotate(calc(var(--angle) * 1.45)); }
    .deck .swatch:hover, .deck .swatch:focus-visible { transform: rotate(calc(var(--angle) * 1.45)) translateY(-22px); z-index: 5; }
    /* Touch screens can't hover: keep the fan open so every spine is readable, and lift on press. */
    @media (hover: none) {
      .deck { --spread: 1.45; }
      .deck:hover .swatch { transform: rotate(var(--angle)); }
      .deck .swatch:active { transform: rotate(var(--angle)) translateY(-16px); z-index: 5; transition-duration: .15s; }
    }
    .sw-color { background: var(--sw); border-radius: 10px; position: relative; }
    .sw-spine { position: absolute; left: 9px; top: 12px; writing-mode: vertical-rl; transform: rotate(180deg); color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 17px; font-variation-settings: 'wdth' 85; letter-spacing: -0.01em; }
    .sw-code { position: absolute; left: 10px; bottom: 9px; font-family: var(--font-mono); font-size: 12px; color: rgba(255,255,255,.85); }
    .sw-meta { padding: 11px 4px 13px; display: grid; gap: 1px; }
    .sw-meta strong { font-family: var(--font-display); font-weight: 600; font-size: 17px; font-variation-settings: 'wdth' 88; }
    .sw-meta small { color: var(--muted); font-size: 13px; }
    @keyframes fan { from { transform: rotate(0deg) translateY(30px); opacity: 0; } }

    .index { max-width: var(--page-max); margin: 0 auto; padding: 0 var(--gutter) 96px; }
    .index h2 { font-family: var(--font-display); font-size: 28px; font-weight: 600; font-variation-settings: 'wdth' 88; margin-bottom: 18px; }
    .index ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
    .index li { border-bottom: 1px solid var(--line); }
    .index a {
      display: grid; grid-template-columns: 220px minmax(0, 1fr) minmax(0, 1.2fr); gap: 24px; align-items: baseline;
      padding: 24px 0; text-decoration: none; transition: background .2s, padding .2s;
    }
    .index a:hover { background: var(--surface); padding-inline: 16px; }
    .row-head { display: flex; align-items: center; gap: 12px; }
    .dot { width: 14px; height: 14px; border-radius: 4px; background: var(--sw); }
    .row-title { font-family: var(--font-display); font-size: 26px; font-weight: 600; font-variation-settings: 'wdth' 85; }
    .row-blurb { color: var(--ink-2); }
    .row-families { display: flex; flex-wrap: wrap; gap: 6px; }
    .row-families span { font-size: 13px; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 2px 9px; }

    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; }
      .deck { height: 380px; }
      .index a { grid-template-columns: 1fr; gap: 8px; }
    }
    @media (max-width: 560px) {
      .hero { padding-top: 36px; gap: 8px; }
      .deck { --sw-w: 108px; height: 300px; margin-top: 8px; }
      .swatch { border-radius: 12px; padding: 6px 6px 0; }
      .sw-color { border-radius: 8px; }
      .sw-spine { font-size: 14px; left: 6px; top: 9px; }
      .sw-code { display: none; }
      .sw-meta { padding: 8px 2px 10px; }
      .sw-meta strong { font-size: 14px; }
      .sw-meta small { font-size: 11.5px; }
      .cta a { flex: 1; justify-content: center; }
      .index h2 { font-size: 24px; }
      .index a { padding: 20px 0; }
      .index a:hover { padding-inline: 0; background: none; }
      .row-title { font-size: 23px; }
    }
  `,
})
export default class HomePage {
  protected readonly categories = CATEGORIES;
}
