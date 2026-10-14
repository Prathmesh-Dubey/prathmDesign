import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Ev { t: string; kind: 'detect' | 'act' | 'fix' | 'ok'; title: string; detail: string; }

@Component({
  selector: 'demo-tech-space-grotesk-plex',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="top">
          <span class="brand">Parcelhub Engineering</span>
          <span class="status"><i aria-hidden="true"></i> Resolved</span>
        </header>

        <p class="kind">Postmortem · SEV-1 · Blameless</p>
        <h1>The 41-minute checkout outage of 3 September</h1>
        <p class="sum">A connection-pool change shipped on a Wednesday afternoon exhausted database connections under peak load. No data was lost; 18,400 checkouts failed and were retried. Here is what happened and what we are changing.</p>

        <dl class="metrics">
          <div><dt>Duration</dt><dd>41<small>min</small></dd></div>
          <div><dt>Failed checkouts</dt><dd>18.4<small>k</small></dd></div>
          <div><dt>Time to detect</dt><dd>3<small>min</small></dd></div>
          <div><dt>Data loss</dt><dd class="good">None</dd></div>
        </dl>

        <h2>Timeline <span>(UTC, click to expand)</span></h2>
        <ol class="tl">
          @for (e of events; track e.t; let i = $index) {
            <li [class]="e.kind" [class.open]="open() === i">
              <button type="button" (click)="open.set(open() === i ? -1 : i)" [attr.aria-expanded]="open() === i">
                <time>{{ e.t }}</time>
                <span class="dot" aria-hidden="true"></span>
                <span class="tt">{{ e.title }}</span>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
              </button>
              <div class="det"><p>{{ e.detail }}</p></div>
            </li>
          }
        </ol>

        <div class="lists">
          <section><h3>What went well</h3><ul><li>Alerting fired within three minutes of the first failed payment.</li><li>The rollback runbook worked exactly as written.</li></ul></section>
          <section><h3>What didn’t</h3><ul><li>The change skipped the load-test stage because it was labelled “config only”.</li><li>Our status page lagged the incident by eleven minutes.</li></ul></section>
        </div>

        <footer class="key" aria-label="Type specimen">
          <span class="a">Space Grotesk</span><span>600 · headings, metrics</span>
          <span class="b">IBM Plex Serif</span><span>400 · narrative 17 / 29</span>
          <span class="c">IBM Plex Mono</span><span>500 · timestamps, labels</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #eef1f4; color: #0b1320; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 800px; margin: 0 auto; padding: clamp(20px, 5cqi, 48px) clamp(16px, 4cqi, 36px) 36px; }
    .top { display: flex; justify-content: space-between; align-items: center; font: 600 14px/1 'Space Grotesk', sans-serif; }
    .status { display: inline-flex; gap: 7px; align-items: center; font: 500 12px/1 'IBM Plex Mono', monospace; color: #12805c; background: #dcf2e8; padding: 6px 10px; border-radius: 999px; }
    .status i { width: 7px; height: 7px; border-radius: 50%; background: #12805c; }
    .kind { font: 500 12.5px/1 'IBM Plex Mono', monospace; color: #d92d20; margin-top: 34px; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(30px, 5.4cqi, 50px); line-height: 1.04; letter-spacing: -0.035em; margin-top: 12px; text-wrap: balance; }
    .sum { font: 400 17.5px/1.65 'IBM Plex Serif', serif; color: #2d3746; margin-top: 18px; max-width: 64ch; text-wrap: pretty; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: #d3d9e1; border: 1px solid #d3d9e1; border-radius: 10px; overflow: hidden; margin: 26px 0 0; }
    .metrics div { background: #fff; padding: 14px 16px; }
    .metrics dt { font: 500 11.5px/1 'IBM Plex Mono', monospace; color: #5f6b7c; }
    .metrics dd { margin: 8px 0 0; font: 600 34px/1 'Space Grotesk', sans-serif; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
    .metrics small { font-size: 15px; font-weight: 500; color: #5f6b7c; margin-left: 3px; letter-spacing: 0; }
    .metrics .good { color: #12805c; }
    h2 { font: 600 22px/1.2 'Space Grotesk', sans-serif; letter-spacing: -0.02em; margin-top: 34px; }
    h2 span { font: 400 12px/1 'IBM Plex Mono', monospace; color: #5f6b7c; letter-spacing: 0; }
    .tl { list-style: none; padding: 0; margin: 12px 0 0; position: relative; }
    .tl::before { content: ''; position: absolute; left: 79px; top: 10px; bottom: 10px; width: 2px; background: #d3d9e1; }
    .tl button { display: grid; grid-template-columns: 56px 16px 1fr 14px; gap: 12px; align-items: center; width: 100%; text-align: left; border: 0; background: none; padding: 10px 6px; border-radius: 8px; cursor: pointer; color: inherit; }
    .tl button:hover, .tl button:active { background: rgba(255,255,255,.7); }
    .tl button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; min-height: 44px; }
    @media (hover: none) { .tl button:hover { background: none; } .tl button:active { background: rgba(255,255,255,.7); } }
    time { font: 500 13px/1 'IBM Plex Mono', monospace; color: #5f6b7c; font-variant-numeric: tabular-nums; }
    .dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #eef1f4; background: #5f6b7c; position: relative; z-index: 1; box-shadow: 0 0 0 1px #5f6b7c; }
    .detect .dot { background: #d92d20; box-shadow: 0 0 0 1px #d92d20; }
    .fix .dot { background: #e79b00; box-shadow: 0 0 0 1px #e79b00; }
    .ok .dot { background: #12805c; box-shadow: 0 0 0 1px #12805c; }
    .tt { font: 500 15.5px/1.35 'Space Grotesk', sans-serif; }
    .tl svg { width: 12px; height: 12px; fill: none; stroke: #5f6b7c; stroke-width: 1.6; transition: transform .25s; }
    .open svg { transform: rotate(180deg); }
    .det { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; padding-left: 102px; }
    .det p { overflow: hidden; font: 400 15.5px/1.6 'IBM Plex Serif', serif; color: #2d3746; max-width: 58ch; }
    .open .det { grid-template-rows: 1fr; }
    .open .det p { padding: 0 0 10px; }
    .lists { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 28px; }
    .lists section { background: #fff; border-radius: 10px; padding: 16px 18px; border-top: 3px solid #12805c; }
    .lists section + section { border-top-color: #d92d20; }
    h3 { font: 600 16px/1.2 'Space Grotesk', sans-serif; }
    .lists ul { margin: 10px 0 0; padding-left: 18px; font: 400 15px/1.55 'IBM Plex Serif', serif; color: #2d3746; display: grid; gap: 6px; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 28px; padding-top: 16px; border-top: 1px dashed #b9c2ce; font: 400 12px/1.3 'IBM Plex Mono', monospace; color: #5f6b7c; }
    .a { font: 600 18px/1 'Space Grotesk', sans-serif; color: #0b1320; }
    .b { font: 400 17px/1 'IBM Plex Serif', serif; color: #0b1320; }
    .c { font: 500 14px/1 'IBM Plex Mono', monospace; color: #0b1320; }
    @container (max-width: 480px) {
      .det { padding-left: 12px; }
      .det p, .lists ul { font-size: 16px; }
      .tl button { grid-template-columns: 46px 16px 1fr 14px; gap: 10px; }
      .tl::before { left: 67px; }
      .metrics dd { font-size: 30px; }
    }
    @media (prefers-reduced-motion: reduce) { .det, .tl svg { transition: none; } }
  `,
})
export class TechSpaceGroteskPlex {
  protected readonly open = signal(1);
  protected readonly events: Ev[] = [
    { t: '14:02', kind: 'act', title: 'Pool size change deployed to checkout-api', detail: 'A pull request reduced max connections per pod from 40 to 12 to cut idle cost. It was tagged as a configuration change and skipped the load-test gate.' },
    { t: '14:19', kind: 'detect', title: 'Payment error rate passes 5% — on-call paged', detail: 'Afternoon traffic in Germany and the Netherlands ramped up. Pods began queueing for connections and requests timed out after 10 seconds.' },
    { t: '14:26', kind: 'act', title: 'Incident declared, checkout banner enabled', detail: 'The incident commander opened a bridge. Support switched on a banner asking customers to retry in a few minutes.' },
    { t: '14:44', kind: 'fix', title: 'Root cause identified, rollback started', detail: 'Connection-wait metrics pointed at the pool. The previous release was redeployed using the standard runbook.' },
    { t: '15:00', kind: 'ok', title: 'Error rate back to baseline', detail: 'All pods healthy by 15:00. Failed checkouts were retried automatically from the payment queue over the next hour.' },
  ];

  constructor() {
    loadGoogleFonts('Space+Grotesk:wght@500;600', 'IBM+Plex+Serif:ital,wght@0,400;1,400', 'IBM+Plex+Mono:wght@400;500');
  }
}
