import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

@Component({
  selector: 'demo-ed-caslon-franklin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <header class="mast">
        <div class="meta"><span>Thursday, 15 October 2026</span><span>Vol. CXIV · No. 288</span></div>
        <p class="name">The Morning Ledger</p>
        <nav aria-label="Sections">
          <a href="#" (click)="$event.preventDefault()">News</a>
          <a href="#" (click)="$event.preventDefault()" aria-current="page">Opinion</a>
          <a href="#" (click)="$event.preventDefault()">Arts</a>
          <a href="#" (click)="$event.preventDefault()">Letters</a>
        </nav>
      </header>

      <div class="page">
        <article>
          <p class="kicker">Opinion · Guest essay</p>
          <h1>Our Libraries Are the Last Free Rooms in Town</h1>
          <p class="dek">No ticket, no purchase, no reason required. That is exactly why the county’s plan to cut opening hours deserves a fight.</p>
          <div class="by">
            <img [src]="portrait" alt="Portrait of the author" width="96" height="96" />
            <p>By <strong>Ruth Adebayo-Lind</strong><br /><span>Ms. Adebayo-Lind chairs the Friends of Eastfield Library.</span></p>
            <div class="cols" role="group" aria-label="Column layout">
              <button type="button" [class.on]="cols() === 1" (click)="cols.set(1)" [attr.aria-pressed]="cols() === 1">Single</button>
              <button type="button" [class.on]="cols() === 2" (click)="cols.set(2)" [attr.aria-pressed]="cols() === 2">Two-column</button>
            </div>
          </div>

          <div class="text" [class.two]="cols() === 2">
            <p>Walk into the Eastfield branch on a weekday afternoon and count the reasons people are there. A retired welder reads the racing pages. Two teenagers share a charger. A woman fills in a housing form with the help of a librarian who has done it, she tells me, “about nine hundred times.”</p>
            <p>None of them has bought anything. None of them has been asked to. In a town where every bench now seems to come with a coffee order attached, that makes the library something rare: a warm, lit, public room that expects nothing of you.</p>
            <p>The county’s draft budget would close Eastfield and four other branches on Mondays and Tuesdays from January. The saving — £214,000 a year — is real, and I do not pretend the finance committee has an easy job. But the cost will be paid by the people least able to pay it elsewhere.</p>
            <p>Opening hours are not a luxury setting to be dialled down. They are the service. A library that is shut on the day a job application is due is not a slightly worse library; for that reader, it is no library at all.</p>
            <p>There are better options on the table. Shared staffing with the adult-education service, which already rents the upstairs room, would cover most of the gap. So would the modest parking levy the council rejected last spring. The consultation closes on 30 October. I hope you will write in, and I hope you will say what you use the room for.</p>
          </div>
        </article>

        <aside aria-label="Most read in Opinion">
          <h2>Most read in Opinion</h2>
          <ol>
            <li><a href="#" (click)="$event.preventDefault()">The bus timetable is a love letter nobody reads</a></li>
            <li><a href="#" (click)="$event.preventDefault()">In defence of the very small allotment</a></li>
            <li><a href="#" (click)="$event.preventDefault()">What our high street lost when the cobbler retired</a></li>
            <li><a href="#" (click)="$event.preventDefault()">Letters: on parking, puddings and the parish clock</a></li>
          </ol>
          <dl class="key" aria-label="Typefaces used">
            <dt>Headline</dt><dd class="f1">Libre Caslon Display 400, 46 px</dd>
            <dt>Text</dt><dd class="f2">Libre Caslon Text 400, 17 / 27 px</dd>
            <dt>Furniture</dt><dd class="f3">Libre Franklin 500–700, 11–14 px</dd>
          </dl>
        </aside>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 660px; background: #f6f6f3; color: #161616; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .mast { padding: 16px clamp(16px, 4cqi, 44px) 0; text-align: center; }
    .meta { display: flex; justify-content: space-between; font: 500 11.5px/1 'Libre Franklin', sans-serif; color: #5c5c5c; border-bottom: 1px solid #161616; padding-bottom: 8px; }
    .name { font-family: 'Libre Caslon Display', serif; font-size: clamp(34px, 7cqi, 64px); line-height: 1; padding: 12px 0 10px; letter-spacing: -0.01em; }
    nav { display: flex; justify-content: center; gap: clamp(14px, 3cqi, 34px); border-top: 3px double #161616; border-bottom: 1px solid #161616; padding: 9px 0; font: 600 13px/1 'Libre Franklin', sans-serif; }
    nav a { text-decoration: none; color: #3a3a3a; }
    nav a[aria-current] { color: #c8102e; }
    .page { display: grid; gap: 36px; padding: 28px clamp(16px, 4cqi, 44px) 36px; max-width: 1120px; margin: 0 auto; }
    @container (min-width: 820px) { .page { grid-template-columns: minmax(0, 1fr) 250px; } aside { border-left: 1px solid #d6d6d0; padding-left: 26px; } }
    .kicker { font: 700 12.5px/1 'Libre Franklin', sans-serif; color: #c8102e; }
    h1 { font-family: 'Libre Caslon Display', serif; font-weight: 400; font-size: clamp(32px, 5.6cqi, 50px); line-height: 1.06; margin-top: 12px; text-wrap: balance; max-width: 20ch; }
    .dek { font-family: 'Libre Caslon Text', serif; font-style: italic; font-size: 19px; line-height: 1.45; color: #3b3b3b; margin-top: 14px; max-width: 54ch; text-wrap: pretty; }
    .by { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 20px; padding: 14px 0; border-top: 1px solid #d6d6d0; border-bottom: 1px solid #d6d6d0; }
    .by img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
    .by p { font: 400 13.5px/1.4 'Libre Franklin', sans-serif; flex: 1 1 220px; }
    .by span { color: #6a6a6a; font-size: 12.5px; }
    .cols { display: inline-flex; border: 1px solid #161616; border-radius: 3px; overflow: hidden; }
    .cols button { font: 600 12px/1 'Libre Franklin', sans-serif; padding: 7px 10px; border: 0; background: transparent; cursor: pointer; }
    .cols button.on { background: #161616; color: #f6f6f3; }
    .text { font-family: 'Libre Caslon Text', serif; font-size: 17px; line-height: 1.6; margin-top: 22px; max-width: 64ch; hanging-punctuation: first; }
    .text p { text-wrap: pretty; text-indent: 1.4em; }
    .text p:first-child { text-indent: 0; }
    .text p:first-child::first-line { font-variant-caps: small-caps; letter-spacing: .03em; }
    .text.two { max-width: none; }
    @container (min-width: 620px) { .text.two { columns: 2; column-gap: 32px; column-rule: 1px solid #d6d6d0; hyphens: auto; text-align: justify; } }
    aside h2 { font: 700 13px/1.2 'Libre Franklin', sans-serif; padding-bottom: 8px; border-bottom: 3px solid #c8102e; }
    ol { list-style: none; counter-reset: mr; padding: 0; margin: 6px 0 0; }
    ol li { counter-increment: mr; display: grid; grid-template-columns: 30px 1fr; padding: 12px 0; border-bottom: 1px solid #d6d6d0; }
    ol li::before { content: counter(mr); font-family: 'Libre Caslon Display', serif; font-size: 28px; line-height: .9; color: #c8102e; }
    ol a { font-family: 'Libre Caslon Text', serif; font-size: 15.5px; line-height: 1.35; text-decoration: none; }
    ol a:hover { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
    .key { margin: 24px 0 0; padding: 14px; background: #ecece7; display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; font: 400 12px/1.35 'Libre Franklin', sans-serif; }
    .key dt { font-weight: 700; color: #c8102e; }
    .key dd { margin: 0; }
    .f1 { font-family: 'Libre Caslon Display', serif; font-size: 15px; }
    .f2 { font-family: 'Libre Caslon Text', serif; font-size: 13px; }
    .cols button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: background .15s, color .15s; }
    .cols button:not(.on):active { background: #e2e2dc; }
    @media (pointer: coarse) {
      .cols button { min-height: 40px; padding: 0 14px; }
      nav { padding: 0; }
      nav a { display: inline-block; padding: 13px 2px; }
      ol a { display: block; padding: 2px 0; }
    }
    @container (max-width: 420px) { .meta { flex-wrap: wrap; gap: 4px 12px; } }
  `,
})
export class EdCaslonFranklin {
  protected readonly portrait = photo('ledger-author-ruth', 96, 96);
  protected readonly cols = signal<1 | 2>(2);

  constructor() {
    loadGoogleFonts('Libre+Caslon+Display', 'Libre+Caslon+Text:ital,wght@0,400;0,700;1,400', 'Libre+Franklin:wght@400;500;600;700');
  }
}
