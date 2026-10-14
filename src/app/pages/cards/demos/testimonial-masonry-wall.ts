import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Quote {
  id: string;
  name: string;
  role: string;
  text: string;
  hue: number;
  stars: number;
  metric?: string;
}

@Component({
  selector: 'demo-testimonial-masonry-wall',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <div>
        <h3>Freelancers stopped dreading tax week</h3>
        <p>4.9 average from 2,380 reviews on the App Store and Trustpilot</p>
      </div>
      <button type="button" class="pause" (click)="paused.set(!paused())" [attr.aria-pressed]="paused()">
        {{ paused() ? 'Play' : 'Pause' }} motion
      </button>
    </div>

    <div class="wall" [class.paused]="paused()">
      @for (col of columns(); track $index; let c = $index) {
        <div class="col" [class]="'col c' + c" [style.--dur.s]="34 + c * 9">
          <div class="belt">
            @for (pass of [0, 1]; track pass) {
              @for (q of col; track q.id) {
                <figure class="card" [style.--h]="q.hue" [attr.aria-hidden]="pass === 1 ? 'true' : null">
                  @if (q.metric) {
                    <p class="metric">{{ q.metric }}</p>
                  }
                  <p class="stars" [attr.aria-label]="q.stars + ' out of 5 stars'">
                    @for (s of [1, 2, 3, 4, 5]; track s) {
                      <span [class.off]="s > q.stars">★</span>
                    }
                  </p>
                  <blockquote>{{ q.text }}</blockquote>
                  <figcaption>
                    <span class="av" aria-hidden="true">{{ initials(q.name) }}</span>
                    <span><strong>{{ q.name }}</strong><small>{{ q.role }}</small></span>
                  </figcaption>
                </figure>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; min-height: 100%; height: 100%; padding: clamp(20px, 4cqi, 40px) clamp(16px, 4cqi, 40px) 0;
      background: #181613; color: #efe9df; font-family: 'Hanken Grotesk', 'Geist', sans-serif;
      container-type: inline-size; overflow: hidden;
    }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
    h3 { font-size: clamp(22px, 3.4cqi, 32px); font-weight: 700; letter-spacing: -0.03em; max-width: 22ch; line-height: 1.08; }
    .head p { color: #a39b8d; font-size: 14px; margin-top: 6px; }
    .pause { height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid #3b362f; background: #221f1b; color: #efe9df; font-size: 13px; font-weight: 600; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .pause:hover, .pause:active { border-color: #efe9df; }
    .wall {
      flex: 1; min-height: 420px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; overflow: hidden;
      mask-image: linear-gradient(transparent, #000 12%, #000 85%, transparent);
      -webkit-mask-image: linear-gradient(transparent, #000 12%, #000 85%, transparent);
    }
    .col { overflow: hidden; }
    .belt { display: flex; flex-direction: column; gap: 14px; animation: belt var(--dur) linear infinite; }
    .c1 .belt { animation-direction: reverse; }
    /* :active = a finger resting on the wall holds it still so a quote can be read */
    .wall:hover .belt, .wall:focus-within .belt, .wall:active .belt, .wall.paused .belt { animation-play-state: paused; }
    .card {
      margin: 0; padding: 18px; border-radius: 16px;
      background: linear-gradient(160deg, hsl(var(--h) 22% 16%), hsl(var(--h) 14% 12%));
      border: 1px solid hsl(var(--h) 20% 22%);
      transition: border-color .3s, transform .3s;
    }
    @media (hover: hover) { .card:hover { border-color: hsl(var(--h) 55% 55%); transform: translateY(-2px); } }
    .metric { font-size: 30px; font-weight: 800; letter-spacing: -0.04em; color: hsl(var(--h) 75% 70%); line-height: 1; margin-bottom: 8px; }
    .stars { font-size: 13px; color: #f2b84b; letter-spacing: 2px; }
    .stars .off { color: #3b362f; }
    blockquote { margin: 8px 0 14px; font-size: 15px; line-height: 1.5; color: #e4ddd1; }
    figcaption { display: flex; gap: 10px; align-items: center; }
    .av { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 12.5px; background: hsl(var(--h) 60% 70%); color: hsl(var(--h) 50% 14%); flex-shrink: 0; }
    figcaption strong { display: block; font-size: 14px; }
    figcaption small { display: block; font-size: 12.5px; color: #a39b8d; }
    @keyframes belt { to { transform: translateY(calc(-50% - 7px)); } }
    @container (max-width: 760px) { .wall { grid-template-columns: repeat(2, 1fr); } .c2 { display: none; } }
    @container (max-width: 480px) {
      .wall { grid-template-columns: 1fr; }
      .c1 { display: none; }
      .card { padding: 16px; }
      blockquote { font-size: 14.5px; }
    }
  `,
})
export class TestimonialMasonryWall {
  protected readonly paused = signal(false);
  private readonly quotes: Quote[] = [
    { id: 'q1', name: 'Dara Okonkwo', role: 'Illustrator, Leeds', hue: 28, stars: 5, metric: '−6 hrs', text: 'I used to lose a whole weekend every January. This year my self-assessment took one evening and a pot of tea.' },
    { id: 'q2', name: 'Lucía Ferrer', role: 'UX consultant', hue: 160, stars: 5, text: 'Invoices go out, reminders chase them, and the money lands already tagged. I genuinely forgot what “admin day” felt like.' },
    { id: 'q3', name: 'Tom Ashworth', role: 'Wedding photographer', hue: 205, stars: 4, text: 'The tax pot is the killer feature. 25% of every payment moves aside before I can spend it.' },
    { id: 'q4', name: 'Mei Lin', role: 'Copywriter', hue: 330, stars: 5, metric: '£1,240', text: 'It spotted expenses I never would have claimed. That is more than the subscription costs in ten years.' },
    { id: 'q5', name: 'Kwame Asante', role: 'Product designer', hue: 45, stars: 5, text: 'Clean, fast, no jargon. My accountant asked what I had changed.' },
    { id: 'q6', name: 'Sanne de Vries', role: 'Translator, Utrecht', hue: 260, stars: 5, text: 'Multi-currency invoices with the right VAT note for each client. Finally.' },
    { id: 'q7', name: 'Ollie Price', role: 'Sound engineer', hue: 190, stars: 4, metric: '9 days', text: 'Average time to get paid dropped from five weeks to nine days once the automatic nudges were on.' },
    { id: 'q8', name: 'Priya Raman', role: 'Brand strategist', hue: 12, stars: 5, text: 'Receipts by photo, mileage by GPS, and a quarterly summary I can actually read.' },
    { id: 'q9', name: 'Jonah Weiss', role: 'Developer, Bristol', hue: 120, stars: 5, text: 'Exported a clean CSV for my mortgage broker in about thirty seconds. Calm software.' },
  ];
  protected readonly columns = computed(() => [0, 1, 2].map((c) => this.quotes.filter((_, i) => i % 3 === c)));

  constructor() {
    loadGoogleFonts('Hanken+Grotesk:wght@400;600;700;800');
  }

  protected initials(n: string): string {
    return n
      .split(' ')
      .map((p) => p[0])
      .join('');
  }
}
