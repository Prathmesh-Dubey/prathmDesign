import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

@Component({
  selector: 'demo-min-garamond-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll" [class.fine]="fine()">
      <div class="bar">
        <a class="home" href="#" (click)="$event.preventDefault()">Commonplace</a>
        <label class="switch">
          <input type="checkbox" [checked]="fine()" (change)="fine.set(!fine())" />
          <span class="track" aria-hidden="true"><span class="dot"></span></span>
          Fine typography
        </label>
      </div>

      <article>
        <aside class="margin" aria-label="Post details">
          <time datetime="2026-09-28">28 Sept 2026</time>
          <span>Essay · 6 min</span>
        </aside>
        <div class="col">
          <h1>{{ t('On Keeping a Commonplace Book') }}</h1>
          <p>{{ t('For about 1,400 years, readers kept notebooks of the lines they didn’t want to lose — proverbs, recipes, a striking sentence from Seneca. The ') }}<span class="sc">{{ t('BBC') }}</span>{{ t(' once called them “the original search engine,” which is clever but wrong: a commonplace book is not for finding things. It’s for keeping them.') }}</p>
          <p>{{ t('I started mine in 2011, in a red notebook from a stationer’s off Fleet Street. The first entry, copied from a library book I’d have to return, reads: “What we have once enjoyed we can never lose.” Helen Keller — though I didn’t check that for another ten years.') }}</p>
          <p>{{ t('The rules are few. Copy by hand; the slowness is the point. Write the source, the page, the date. Leave space after each entry — sometimes the second reading, a year later, deserves a note of its own…') }}</p>
          <p class="sig">— A.&#8202;R.</p>
        </div>
      </article>

      <footer class="key" aria-label="Type specimen and features">
        <div class="spec">
          <span class="g">EB Garamond</span>
          <span>Text 400 · 20 / 34 px · 60ch measure</span>
        </div>
        <div class="spec">
          <span class="w">Work Sans</span>
          <span>UI 400 / 500 · 12–13 px</span>
        </div>
        <ul class="feats" [attr.aria-label]="'Typographic details currently ' + (fine() ? 'on' : 'off')">
          <li>{{ fine() ? '“ ” curly quotes' : '" " straight quotes' }}</li>
          <li>{{ fine() ? '— em dash' : '-- double hyphen' }}</li>
          <li>{{ fine() ? '1400 old-style figures' : '1400 lining figures' }}</li>
          <li>{{ fine() ? 'fi fl ligatures' : 'f i  f l  no ligatures' }}</li>
          <li>{{ fine() ? 'small caps for BBC' : 'full caps for BBC' }}</li>
        </ul>
      </footer>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 620px; background: #fbfbf8; color: #222; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px clamp(18px, 5cqi, 48px); font: 400 13px/1 'Work Sans', sans-serif; }
    .home { font: 500 13px/1 'Work Sans', sans-serif; letter-spacing: .02em; text-decoration: none; color: #8b1e3f; }
    .switch { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; color: #555; user-select: none; }
    .switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
    .track { width: 34px; height: 20px; border-radius: 999px; background: #d8d6cf; position: relative; transition: background .2s; }
    .dot { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .25s cubic-bezier(.3,.7,.2,1), width .15s; }
    .switch input:checked + .track { background: #8b1e3f; }
    .switch input:checked + .track .dot { transform: translateX(14px); }
    .switch input:focus-visible + .track { outline: 2px solid #8b1e3f; outline-offset: 2px; }
    article { display: grid; gap: 14px; max-width: 900px; margin: 0 auto; padding: clamp(18px, 5cqi, 56px) clamp(18px, 5cqi, 48px) 10px; }
    @container (min-width: 760px) { article { grid-template-columns: 150px minmax(0, 60ch); gap: 40px; justify-content: center; } .margin { text-align: right; padding-top: 14px; } }
    .margin { display: grid; gap: 4px; align-content: start; font: 400 12.5px/1.4 'Work Sans', sans-serif; color: #8a8780; }
    .margin time { color: #222; font-weight: 500; }
    .col { font-family: 'EB Garamond', serif; font-size: 20px; line-height: 1.7; max-width: 60ch; font-variant-numeric: lining-nums; font-feature-settings: 'liga' 0, 'clig' 0; }
    .fine .col { font-variant-numeric: oldstyle-nums proportional-nums; font-feature-settings: 'liga' 1, 'clig' 1; hanging-punctuation: first last; }
    h1 { font-family: 'EB Garamond', serif; font-weight: 500; font-size: clamp(32px, 5.4cqi, 48px); line-height: 1.1; letter-spacing: -0.005em; margin-bottom: 26px; text-wrap: balance; }
    .fine h1 { font-style: italic; font-weight: 400; }
    .col p { text-wrap: pretty; }
    .col p + p { text-indent: 1.5em; }
    .sc { letter-spacing: 0; }
    .fine .sc { font-variant-caps: all-small-caps; letter-spacing: .05em; }
    .sig { text-align: right; margin-top: 18px; font-style: italic; text-indent: 0 !important; }
    .key { display: grid; gap: 14px; max-width: 900px; margin: 26px auto 0; padding: 18px clamp(18px, 5cqi, 48px) 30px; border-top: 1px solid #e7e5de; font: 400 12px/1.4 'Work Sans', sans-serif; color: #8a8780; }
    @container (min-width: 760px) { .key { grid-template-columns: 1fr 1fr 2fr; } }
    .spec { display: grid; gap: 2px; }
    .g { font-family: 'EB Garamond', serif; font-size: 22px; color: #222; }
    .w { font-family: 'Work Sans', sans-serif; font-weight: 500; font-size: 16px; color: #222; }
    .feats { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
    .feats li { font-family: 'EB Garamond', serif; font-size: 14px; color: #222; border: 1px solid #e0ddd4; border-radius: 999px; padding: 3px 10px; background: #fff; font-variant-numeric: lining-nums; }
    .fine .feats li { font-variant-numeric: oldstyle-nums; border-color: rgba(139,30,63,.35); }
    .switch { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .switch:active .dot { width: 17px; }
    .switch:active input:checked + .track .dot { transform: translateX(11px); }
    @media (pointer: coarse) { .switch { padding: 10px 0; margin: -10px 0; } .home { padding: 12px 0; margin: -12px 0; } }
    @media (prefers-reduced-motion: reduce) { .dot, .track { transition: none; } }
  `,
})
export class MinGaramondWork {
  protected readonly fine = signal(true);

  constructor() {
    loadGoogleFonts('EB+Garamond:ital,wght@0,400;0,500;1,400', 'Work+Sans:wght@400;500');
  }

  /** Returns the text as written (fine) or "typewriter-ised" (rough). */
  t(s: string): string {
    if (this.fine()) return s;
    return s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/—/g, '--').replace(/…/g, '...');
  }
}
