import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Plan {
  id: string;
  name: string;
  blurb: string;
  monthly: number;
  features: string[];
  cta: string;
  featured?: boolean;
}

@Component({
  selector: 'demo-pricing-tier-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <h3>Pricing that scales with your studio</h3>
      <div class="toggle" role="radiogroup" aria-label="Billing period">
        <span class="pill" [class.right]="annual()" aria-hidden="true"></span>
        <button type="button" role="radio" [attr.aria-checked]="!annual()" [class.on]="!annual()" (click)="annual.set(false)">Monthly</button>
        <button type="button" role="radio" [attr.aria-checked]="annual()" [class.on]="annual()" (click)="annual.set(true)">Yearly <span class="save">−20%</span></button>
      </div>
    </div>

    <div class="grid">
      @for (p of plans; track p.id) {
        <article class="plan" [class.featured]="p.featured">
          @if (p.featured) {
            <span class="badge">Most teams pick this</span>
          }
          <h4>{{ p.name }}</h4>
          <p class="blurb">{{ p.blurb }}</p>
          <p class="price">
            @if (p.monthly === 0) {
              <span class="num">Free</span>
            } @else {
              <span class="cur">$</span>
              @if (annual()) {
                <span class="num" [attr.data-k]="'y'">{{ yearly(p.monthly) }}</span>
              } @else {
                <span class="num">{{ p.monthly }}</span>
              }
              <span class="per">/ seat / mo</span>
            }
          </p>
          <p class="bill">{{ p.monthly === 0 ? 'Up to 2 editors, forever' : annual() ? 'Billed $' + yearly(p.monthly) * 12 + ' per seat yearly' : 'Billed monthly, cancel anytime' }}</p>
          <button type="button" class="cta">{{ p.cta }}</button>
          <ul>
            @for (f of p.features; track f) {
              <li>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3.2L15 7" /></svg>
                {{ f }}
              </li>
            }
          </ul>
        </article>
      }
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; padding: clamp(22px, 4cqi, 44px);
      background: #eef0f4; color: #1d1a22; font-family: 'Manrope', 'Geist', sans-serif;
      container-type: inline-size;
    }
    .head { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 26px; }
    h3 { font-size: clamp(22px, 3.2cqi, 30px); font-weight: 800; letter-spacing: -0.03em; max-width: 22ch; }
    .toggle { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; background: #dfe2ea; border-radius: 999px; padding: 4px; }
    .pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc(50% - 4px); background: #fff; border-radius: 999px; box-shadow: 0 2px 8px rgba(29,26,34,.12); transition: transform .35s cubic-bezier(.3,.8,.3,1); }
    .pill.right { transform: translateX(100%); }
    .toggle button { position: relative; z-index: 1; border: 0; background: none; min-height: 36px; padding: 8px 16px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; font-size: 13.5px; font-weight: 700; cursor: pointer; color: #6c6876; border-radius: 999px; white-space: nowrap; transition: color .2s; }
    .toggle button.on { color: #1d1a22; }
    .save { color: #c2410c; font-weight: 800; margin-left: 2px; }
    @media (pointer: coarse) { .toggle button { min-height: 42px; } }

    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
    .plan { position: relative; background: #fff; border-radius: 20px; padding: 26px 24px; display: flex; flex-direction: column; border: 1px solid #e0e2ea; transition: transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s; }
    @media (hover: hover) { .plan:hover { transform: translateY(-4px); box-shadow: 0 24px 40px -28px rgba(29,26,34,.4); } }
    .plan.featured { background: #2a1530; color: #fbeee9; border-color: #2a1530; box-shadow: 0 30px 60px -30px rgba(42,21,48,.8); }
    .badge { position: absolute; top: -12px; left: 24px; background: #ffb59a; color: #2a1530; font-size: 12px; font-weight: 800; padding: 5px 11px; border-radius: 999px; }
    h4 { font-size: 18px; font-weight: 800; }
    .blurb { font-size: 14px; opacity: .7; margin-top: 4px; min-height: 2.8em; }
    .price { display: flex; align-items: baseline; gap: 3px; margin-top: 20px; height: 54px; }
    .cur { font-size: 22px; font-weight: 700; align-self: flex-start; margin-top: 6px; }
    .num { font-size: 48px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; display: inline-block; animation: flipIn .4s cubic-bezier(.2,.8,.2,1); }
    .per { font-size: 13px; opacity: .6; margin-left: 4px; }
    .bill { font-size: 12.5px; opacity: .6; margin-top: 6px; }
    .cta { margin: 20px 0; min-height: 46px; padding: 8px 14px; border-radius: 12px; border: 1.5px solid #1d1a22; background: transparent; color: inherit; font-weight: 800; font-size: 14.5px; cursor: pointer; transition: background .2s, color .2s, transform .15s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .cta:hover { background: #1d1a22; color: #fff; }
    .cta:active { transform: scale(.98); }
    .featured .cta { background: #ffb59a; border-color: #ffb59a; color: #2a1530; }
    .featured .cta:hover { background: #ffc9b5; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; font-size: 14px; }
    li { display: flex; gap: 8px; align-items: flex-start; }
    li svg { width: 18px; height: 18px; flex-shrink: 0; fill: none; stroke: #c2410c; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; margin-top: 1px; }
    .featured li svg { stroke: #ffb59a; }
    @keyframes flipIn { from { opacity: 0; transform: translateY(10px); } }
    @container (max-width: 760px) {
      .grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; gap: 22px; }
      .blurb { min-height: 0; }
    }
    @container (max-width: 400px) {
      .plan { padding: 24px 20px; }
      .num { font-size: 42px; }
      .toggle button { padding: 8px 13px; }
    }
  `,
})
export class PricingTierGrid {
  protected readonly annual = signal(true);
  protected readonly plans: Plan[] = [
    { id: 'sketch', name: 'Sketch', blurb: 'For freelancers testing the waters.', monthly: 0, cta: 'Start for free', features: ['3 active projects', 'Client review links', 'Version history, 7 days'] },
    { id: 'studio', name: 'Studio', blurb: 'For small teams shipping client work every week.', monthly: 18, cta: 'Try Studio free for 14 days', featured: true, features: ['Unlimited projects', 'Branded client portal', 'Version history, 1 year', 'Figma & Slack sync'] },
    { id: 'atelier', name: 'Atelier', blurb: 'For agencies that need control and audit trails.', monthly: 34, cta: 'Talk to sales', features: ['Everything in Studio', 'SSO and SCIM', 'Granular permissions', 'Dedicated success lead'] },
  ];

  constructor() {
    loadGoogleFonts('Manrope:wght@400;600;700;800');
  }

  protected yearly(m: number): number {
    return Math.round(m * 0.8);
  }
}
