import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

type Kind = 'New' | 'Improved' | 'Fixed';
interface Item { k: Kind; text: string; }
interface Release { v: string; date: string; title: string; intro: string; items: Item[]; }

@Component({
  selector: 'demo-tech-unbounded-onest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.light]': 'light()' },
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="logo"><span class="mark" aria-hidden="true"></span>Ledgerline</span>
          <button type="button" class="theme" (click)="light.set(!light())" [attr.aria-label]="light() ? 'Switch to dark theme' : 'Switch to light theme'">
            @if (light()) {
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.3A7 7 0 017.7 3.5a7 7 0 108.8 8.8z" /></svg>
            } @else {
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" /><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" /></svg>
            }
            {{ light() ? 'Dark' : 'Light' }}
          </button>
        </header>

        <h1>Changelog</h1>
        <p class="intro">Everything we shipped to the Ledgerline API and dashboard, newest first. Subscribe via RSS or the <code>/v2/changes</code> feed.</p>

        <div class="filters" role="group" aria-label="Filter changes">
          @for (f of filters; track f) {
            <button type="button" [class.on]="filter() === f" [attr.aria-pressed]="filter() === f" (click)="filter.set(f)" [attr.data-k]="f">{{ f }}</button>
          }
        </div>

        <ol class="releases">
          @for (r of visible(); track r.v) {
            <li class="rel">
              <div class="side"><span class="ver">v{{ r.v }}</span><time>{{ r.date }}</time></div>
              <div class="main">
                <h2>{{ r.title }}</h2>
                <p class="ri">{{ r.intro }}</p>
                <ul>
                  @for (it of r.items; track it.text) {
                    <li><span class="badge" [attr.data-k]="it.k">{{ it.k }}</span>{{ it.text }}</li>
                  }
                </ul>
              </div>
            </li>
          } @empty {
            <li class="none">No releases with that kind of change.</li>
          }
        </ol>

        <footer class="key" aria-label="Type specimen">
          <span class="u">Unbounded</span><span>Display · 500 / 800 · wide, tight tracking</span>
          <span class="o">Onest</span><span>Text · 400 / 500 · 15–16 px on 1.6</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { --bg: #101014; --panel: #18181f; --ink: #f1f1f5; --mut: #9a9aab; --line: #2a2a35; --acc: #ff6b4a; --new: #7ef0c1; --imp: #9fb6ff; --fix: #ffcf6b;
      display: block; position: relative; min-height: 660px; background: var(--bg); color: var(--ink); container-type: inline-size; transition: background .35s, color .35s; }
    :host(.light) { --bg: #f6f6fa; --panel: #ffffff; --ink: #14141c; --mut: #626274; --line: #e2e2ea; --acc: #e5482a; --new: #0c8a5c; --imp: #3550c8; --fix: #a46a00; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 860px; margin: 0 auto; padding: clamp(18px, 4cqi, 40px) clamp(16px, 4cqi, 36px) 36px; }
    .top { display: flex; justify-content: space-between; align-items: center; }
    .logo { display: inline-flex; gap: 9px; align-items: center; font: 700 15px/1 'Unbounded', sans-serif; letter-spacing: -0.02em; }
    .mark { width: 18px; height: 18px; border-radius: 5px; background: conic-gradient(from 90deg, var(--acc), #ffb36b, var(--acc)); }
    .theme { display: inline-flex; gap: 7px; align-items: center; font: 500 13px/1 'Onest', sans-serif; border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 999px; padding: 7px 12px; cursor: pointer; }
    .theme svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
    h1 { font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: clamp(38px, 8cqi, 80px); line-height: .95; letter-spacing: -0.05em; margin-top: clamp(26px, 5cqi, 48px); }
    .intro { font: 400 16.5px/1.6 'Onest', sans-serif; color: var(--mut); margin-top: 14px; max-width: 54ch; }
    code { font: 500 .9em ui-monospace, monospace; background: var(--panel); border: 1px solid var(--line); padding: 1px 6px; border-radius: 5px; color: var(--ink); }
    .filters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 24px; }
    .filters button { font: 500 13px/1 'Onest', sans-serif; border: 1px solid var(--line); background: transparent; color: var(--mut); padding: 8px 13px; border-radius: 999px; cursor: pointer; transition: all .2s; }
    .filters button.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .releases { list-style: none; padding: 0; margin: 26px 0 0; }
    .rel { display: grid; gap: 10px; padding: 24px 0; border-top: 1px solid var(--line); animation: in .35s ease-out both; }
    @container (min-width: 640px) { .rel { grid-template-columns: 150px 1fr; gap: 28px; } .side { position: sticky; top: 16px; align-self: start; } }
    .side { display: flex; flex-direction: column; gap: 6px; }
    .ver { font: 500 14px/1 'Unbounded', sans-serif; color: var(--acc); letter-spacing: -0.02em; }
    time { font: 400 13px/1 'Onest', sans-serif; color: var(--mut); font-variant-numeric: tabular-nums; }
    h2 { font: 500 clamp(19px, 2.6cqi, 24px)/1.2 'Unbounded', sans-serif; letter-spacing: -0.035em; text-wrap: balance; }
    .ri { font: 400 15.5px/1.6 'Onest', sans-serif; color: var(--mut); margin-top: 8px; max-width: 60ch; }
    .main ul { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 9px; }
    .main li { display: flex; gap: 10px; align-items: baseline; font: 400 15px/1.55 'Onest', sans-serif; }
    .badge { flex: none; font: 600 10.5px/1 'Onest', sans-serif; padding: 4px 7px; border-radius: 5px; border: 1px solid currentColor; min-width: 64px; text-align: center; }
    .badge[data-k='New'] { color: var(--new); } .badge[data-k='Improved'] { color: var(--imp); } .badge[data-k='Fixed'] { color: var(--fix); }
    .none { padding: 24px 0; color: var(--mut); font: 400 15px/1.5 'Onest', sans-serif; border-top: 1px solid var(--line); }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 10px; padding: 16px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; font: 400 12.5px/1.4 'Onest', sans-serif; color: var(--mut); }
    .u { font: 800 20px/1 'Unbounded', sans-serif; letter-spacing: -0.04em; color: var(--ink); }
    .o { font: 500 18px/1 'Onest', sans-serif; color: var(--ink); }
    .filters button, .theme { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .filters button:not(.on):active, .theme:active { background: var(--line); }
    @media (pointer: coarse) { .filters button { min-height: 40px; padding: 0 15px; } .theme { min-height: 40px; padding: 0 14px; } }
    @container (max-width: 520px) { .main li { font-size: 16px; } .ri { font-size: 16px; } .badge { min-width: 58px; } }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
    @media (prefers-reduced-motion: reduce) { .rel { animation: none; } :host { transition: none; } }
  `,
})
export class TechUnboundedOnest {
  protected readonly light = signal(false);
  protected readonly filters: ('All' | Kind)[] = ['All', 'New', 'Improved', 'Fixed'];
  protected readonly filter = signal<'All' | Kind>('All');
  private readonly releases: Release[] = [
    { v: '2.14.0', date: '13 Oct 2026', title: 'Scheduled exports and a faster ledger view', intro: 'Exports can now run on a schedule, and large ledgers load roughly three times faster.', items: [
      { k: 'New', text: 'Schedule CSV or Parquet exports daily, weekly or monthly.' },
      { k: 'Improved', text: 'Ledger view virtualises rows past 5,000 entries.' },
      { k: 'Fixed', text: 'Currency symbols no longer duplicate in PDF statements.' },
    ] },
    { v: '2.13.2', date: '29 Sep 2026', title: 'Webhook retries you can see', intro: 'A patch release focused on reliability.', items: [
      { k: 'Improved', text: 'Webhook deliveries show every retry with its response code.' },
      { k: 'Fixed', text: 'Rate-limit headers were missing on 429 responses.' },
    ] },
    { v: '2.13.0', date: '16 Sep 2026', title: 'Multi-entity workspaces', intro: 'Run several companies from one login, with separate books and shared contacts.', items: [
      { k: 'New', text: 'Create up to 20 entities per workspace.' },
      { k: 'New', text: 'Cross-entity search across invoices and contacts.' },
    ] },
  ];
  protected readonly visible = computed(() => {
    const f = this.filter();
    if (f === 'All') return this.releases;
    return this.releases.map((r) => ({ ...r, items: r.items.filter((i) => i.k === f) })).filter((r) => r.items.length);
  });

  constructor() {
    loadGoogleFonts('Unbounded:wght@500;700;800', 'Onest:wght@400;500;600');
  }
}
