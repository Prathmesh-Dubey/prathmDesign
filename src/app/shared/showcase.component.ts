import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { DesignExample } from '../core/example.model';

@Component({
  selector: 'app-showcase',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeFull()' },
  template: `
    <article class="sc" [id]="example().id" [style.--sw]="swatch()">
      <header class="head">
        <span class="code" aria-label="Catalogue number">{{ code() }}</span>
        <div class="titles">
          <h2>{{ example().title }}</h2>
          <p>{{ example().description }}</p>
        </div>
        <div class="actions">
          <span class="family">{{ example().type }}</span>
          <button type="button" class="btn" (click)="copy()" [class.done]="copied()">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              @if (copied()) {
                <path d="M4 10.5l4 4 8-9" />
              } @else {
                <rect x="6.5" y="6.5" width="10" height="10" rx="2" />
                <path d="M13.5 6.5V5a1.5 1.5 0 00-1.5-1.5H5A1.5 1.5 0 003.5 5v7A1.5 1.5 0 005 13.5h1.5" />
              }
            </svg>
            {{ copied() ? 'Copied' : 'Copy prompt' }}
          </button>
          <button type="button" class="btn icon" (click)="openFull()" aria-label="Open preview full screen" title="Full screen">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 8V3.5H8M12 3.5h4.5V8M16.5 12v4.5H12M8 16.5H3.5V12" /></svg>
          </button>
        </div>
      </header>

      <div class="stage" [class]="'stage tone-' + tone()" [style.min-height.px]="height()">
        @defer (on viewport; when eager; prefetch on idle) {
          <ng-container *ngComponentOutlet="example().component" />
        } @placeholder {
          <div class="ph" [style.min-height.px]="height()"><span>Loading preview</span></div>
        }
      </div>

      <section class="prompt" [class.open]="promptOpen()">
        <div class="prompt-head">
          <h3>Prompt</h3>
          <button type="button" class="link" (click)="promptOpen.set(!promptOpen())" [attr.aria-expanded]="promptOpen()">
            {{ promptOpen() ? 'Collapse' : 'Read full prompt' }}
          </button>
        </div>
        <p class="prompt-body" tabindex="0">{{ example().prompt }}</p>
        <ul class="tags">
          @for (t of example().tags; track t) {
            <li>{{ t }}</li>
          }
        </ul>
      </section>
    </article>

    @if (full()) {
      <div class="full" role="dialog" aria-modal="true" [attr.aria-label]="example().title + ' full screen preview'">
        <div class="full-bar">
          <span class="code">{{ code() }}</span>
          <strong>{{ example().title }}</strong>
          <button type="button" class="btn" (click)="copy()">{{ copied() ? 'Copied' : 'Copy prompt' }}</button>
          <button type="button" class="btn" (click)="closeFull()">Close</button>
        </div>
        <div class="full-stage" [class]="'full-stage tone-' + tone()">
          <ng-container *ngComponentOutlet="example().component" />
        </div>
      </div>
    }
  `,
  styles: `
    /* The card lays itself out from its OWN width (container queries), not the viewport. */
    :host { display: block; min-width: 0; container: sc / inline-size; }
    .sc {
      background: var(--surface);
      border: 1px solid var(--line-soft);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lift);
      overflow: hidden;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: 'head' 'stage' 'prompt';
    }
    .head {
      grid-area: head;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 14px 18px;
      align-items: start;
      padding: 22px 24px 18px;
    }
    .code {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--ink);
      background: color-mix(in srgb, var(--sw) 14%, white);
      border: 1px solid color-mix(in srgb, var(--sw) 30%, white);
      padding: 4px 8px;
      border-radius: 6px;
      margin-top: 3px;
      white-space: nowrap;
    }
    h2 {
      font-family: var(--font-display);
      font-size: clamp(19px, 2.2vw, 25px);
      font-weight: 600;
      font-variation-settings: 'wdth' 92;
      letter-spacing: -0.01em;
      text-wrap: balance;
    }
    .titles p { color: var(--muted); margin-top: 6px; max-width: 62ch; font-size: 15px; text-wrap: pretty; }
    .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
    .family {
      font-size: 13px;
      color: var(--ink-2);
      padding: 6px 11px;
      border-radius: 999px;
      background: var(--surface-2);
      border: 1px solid var(--line-soft);
      white-space: nowrap;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      height: 36px; padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--surface);
      font-size: 13.5px; font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
      transition: background .15s, border-color .15s, color .15s, transform .1s;
      white-space: nowrap;
    }
    .btn:hover { border-color: var(--ink); }
    .btn:active { transform: scale(.96); }
    .btn.done { background: var(--ink); color: #fff; border-color: var(--ink); }
    .btn.icon { width: 36px; padding: 0; justify-content: center; }
    .btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

    .stage {
      grid-area: stage;
      position: relative;
      margin: 0 12px;
      border-radius: var(--radius-md);
      overflow: hidden;
      isolation: isolate;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }
    .stage > * { min-width: 0; }
    .tone-light { background: #f3f4f7; }
    .tone-dark { background: #0d1124; color: #fff; }
    .tone-none { background: transparent; }
    .ph { display: grid; place-items: center; color: var(--muted); font-size: 14px;
      background: repeating-linear-gradient(135deg, transparent 0 14px, rgba(18,26,51,.03) 14px 28px); }

    .prompt { grid-area: prompt; padding: 18px 24px 22px; min-width: 0; }
    .prompt-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
    .prompt-head h3 { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--ink); }
    .link { background: none; border: 0; padding: 6px 0; color: var(--accent); font-size: 14px; font-weight: 500; cursor: pointer; touch-action: manipulation; }
    .link:hover { text-decoration: underline; text-underline-offset: 3px; }
    .prompt-body {
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--ink-2);
      white-space: pre-line;
      overflow-wrap: anywhere;
      max-width: 110ch;
      max-height: calc(1.7em * 3);
      overflow: hidden;
      mask-image: linear-gradient(#000 45%, transparent);
    }
    .prompt.open .prompt-body { max-height: none; mask-image: none; }
    .tags { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 14px 0 0; }
    .tags li { font-size: 12.5px; color: var(--muted); border: 1px solid var(--line-soft); padding: 2px 9px; border-radius: 999px; }

    /* Wide: live demo on the left, details and the full, scrolling prompt in a side column. */
    @container sc (min-width: 1080px) {
      .sc {
        grid-template-columns: minmax(0, 1fr) clamp(340px, 28%, 480px);
        grid-template-rows: auto 1fr;
        grid-template-areas: 'stage head' 'stage prompt';
      }
      .stage { margin: 12px 0 12px 12px; }
      .head { grid-template-columns: auto minmax(0, 1fr); padding: 26px 26px 16px; }
      .actions { grid-column: 1 / -1; justify-content: flex-start; }
      /* height:0 + min-height:100% stops this column stretching the row: it fills the stage height and scrolls. */
      .prompt {
        height: 0; min-height: 100%;
        display: flex; flex-direction: column;
        margin: 0 26px; padding: 16px 0 22px;
        border-top: 1px solid var(--line-soft);
      }
      .prompt-head .link { display: none; }
      .prompt-body {
        flex: 1; min-height: 0; max-height: none; max-width: none;
        overflow: auto; mask-image: none;
        padding-right: 6px;
        scrollbar-width: thin;
      }
      .tags { flex: none; }
    }

    /* Tablet-width cards: actions drop below the title so it keeps its measure. */
    @container sc (max-width: 860px) {
      .head { grid-template-columns: auto minmax(0, 1fr); }
      .actions { grid-column: 2 / -1; justify-content: flex-start; }
    }

    /* Phone-width cards. */
    @container sc (max-width: 620px) {
      .head { grid-template-columns: auto minmax(0, 1fr); gap: 10px 12px; padding: 16px 16px 12px; }
      .actions { grid-column: 1 / -1; justify-content: flex-start; gap: 6px; }
      .family { order: 3; }
      .titles p { font-size: 14px; }
      .stage { margin: 0 6px; border-radius: 12px; }
      .prompt { padding: 14px 16px 18px; }
      .prompt-body { font-size: 12.5px; }
    }

    .full {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(10, 14, 30, .72);
      backdrop-filter: blur(6px);
      display: grid; grid-template-rows: auto 1fr;
      padding: 14px;
      gap: 10px;
      animation: fadeIn .18s ease-out;
    }
    .full-bar { display: flex; align-items: center; gap: 10px; color: #fff; padding: 2px 4px; min-width: 0; }
    .full-bar strong { font-family: var(--font-display); font-weight: 600; font-size: 18px; margin-right: auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .full-bar .code { color: var(--ink); }
    .full-bar .btn { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.25); }
    .full-bar .btn:hover { border-color: #fff; }
    .full-stage { border-radius: var(--radius-md); overflow: auto; display: grid; grid-template-columns: minmax(0, 1fr); overscroll-behavior: contain; }
    @keyframes fadeIn { from { opacity: 0; } }

    @media (max-width: 620px) {
      .full { padding: 8px; gap: 8px; }
      .full-bar .code { display: none; }
      .full-bar strong { font-size: 15px; }
      .full-bar .btn { height: 34px; padding: 0 12px; font-size: 13px; }
    }
  `,
})
export class ShowcaseComponent {
  readonly example = input.required<DesignExample>();
  readonly code = input<string>('');
  readonly swatch = input<string>('#3B3FE4');

  /** `?all` in the URL renders every demo immediately (handy for review and screenshots). */
  protected readonly eager = typeof location !== 'undefined' && new URLSearchParams(location.search).has('all');
  protected readonly copied = signal(false);
  protected readonly promptOpen = signal(false);
  protected readonly full = signal(false);
  protected readonly height = computed(() => this.example().stageHeight ?? 440);
  protected readonly tone = computed(() => this.example().stageTone ?? 'light');
  private copyTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      document.documentElement.style.overflow = this.full() ? 'hidden' : '';
    });
  }

  async copy(): Promise<void> {
    const text = this.example().prompt;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    this.copied.set(true);
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copied.set(false), 1800);
  }

  openFull(): void {
    this.full.set(true);
  }

  closeFull(): void {
    if (this.full()) this.full.set(false);
  }
}
