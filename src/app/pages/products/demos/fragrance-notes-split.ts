import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Tier {
  id: 'top' | 'heart' | 'base';
  label: string;
  when: string;
  notes: string[];
  copy: string;
}

@Component({
  selector: 'demo-fragrance-notes-split',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="split">
      <div class="visual">
        <img [src]="img" appImgFallback="noir-vetiver" alt="Noir Vetiver Eau de Parfum bottle" />
        <p class="cap">Composed by Inès Varga, Grasse</p>
      </div>
      <div class="content">
        <p class="house">Maison Varga</p>
        <h3>Noir Vetiver</h3>
        <p class="kind">Eau de Parfum · Woody aromatic</p>

        <div class="pyramid-wrap">
          <div class="pyramid" role="tablist" aria-label="Fragrance notes">
            @for (t of tiers; track t.id; let i = $index) {
              <button
                type="button"
                role="tab"
                class="tier"
                [class]="'tier t' + i"
                [class.on]="tier() === t.id"
                [attr.aria-selected]="tier() === t.id"
                [attr.aria-controls]="'notes-panel'"
                (click)="tier.set(t.id)"
                (keydown)="key($event, i)"
                [attr.tabindex]="tier() === t.id ? 0 : -1"
              >
                {{ t.label }}
              </button>
            }
          </div>
          <div class="notes" id="notes-panel" role="tabpanel">
            <p class="when">{{ current().when }}</p>
            <ul>
              @for (n of current().notes; track n) {
                <li>{{ n }}</li>
              }
            </ul>
            <p class="desc">{{ current().copy }}</p>
          </div>
        </div>

        <div class="buy">
          <div class="sizes" role="radiogroup" aria-label="Bottle size">
            @for (s of sizes; track s.ml) {
              <button type="button" role="radio" [attr.aria-checked]="size() === s.ml" [class.on]="size() === s.ml" (click)="size.set(s.ml)">
                <span>{{ s.ml }} ml</span><small>€{{ s.price }}</small>
              </button>
            }
          </div>
          <button type="button" class="cta" (click)="added.set(true)">
            {{ added() ? 'Added to bag' : 'Add to bag — €' + price() }}
          </button>
          <p class="note">Complimentary 2 ml sample of Ambre Sel with every order.</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; }
    .split { display: grid; grid-template-columns: 1fr 1.1fr; min-height: 620px; height: 100%; background: #dde3d6; color: #232b1d; font-family: 'Geist', sans-serif; }
    .visual { position: relative; overflow: hidden; background: #2d3526; }
    .visual img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; animation: drift 18s ease-in-out infinite alternate; }
    @keyframes drift { to { transform: scale(1.08) translateY(-2%); } }
    .cap { position: absolute; left: 18px; bottom: 16px; font-size: 12px; color: #fff; background: rgba(20,24,16,.45); backdrop-filter: blur(6px); padding: 5px 10px; border-radius: 999px; }
    .content { padding: clamp(24px, 4.5cqw, 52px); display: flex; flex-direction: column; gap: 6px; }
    .house { font-size: 13px; color: #5d6a51; }
    h3 { font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: clamp(40px, 6.4cqw, 68px); letter-spacing: -.02em; line-height: .95; }
    .kind { font-size: 14px; color: #5d6a51; }
    .pyramid-wrap { display: grid; grid-template-columns: minmax(150px, 210px) 1fr; gap: 22px; align-items: center; margin: 22px 0 18px; }
    .pyramid { display: grid; gap: 4px; }
    .tier {
      height: 52px; border: 0; cursor: pointer; background: #c8d0bf; color: #232b1d; font-family: 'Bodoni Moda', serif; font-size: 15px; font-style: italic;
      transition: background .35s, color .35s, transform .35s cubic-bezier(.2,.8,.2,1);
    }
    .t0 { clip-path: polygon(36% 0, 64% 0, 76% 100%, 24% 100%); }
    .t1 { clip-path: polygon(22% 0, 78% 0, 90% 100%, 10% 100%); }
    .t2 { clip-path: polygon(8% 0, 92% 0, 100% 100%, 0 100%); }
    @media (hover: hover) { .tier:hover { background: #b6c0ab; } }
    .tier:active { transform: scale(.97); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tier.on { background: #232b1d; color: #e9eee3; }
    .tier:focus-visible { outline: none; background: #3f4a35; color: #fff; }
    .notes { min-height: 150px; }
    .when { font-size: 12px; color: #5d6a51; }
    .notes ul { list-style: none; padding: 0; margin: 6px 0 8px; display: flex; flex-wrap: wrap; gap: 6px; }
    .notes li { font-size: 13px; padding: 5px 11px; border: 1px solid #a9b59c; border-radius: 999px; animation: pop .4s cubic-bezier(.2,.8,.2,1) both; }
    .notes li:nth-child(2) { animation-delay: .05s; } .notes li:nth-child(3) { animation-delay: .1s; }
    @keyframes pop { from { opacity: 0; transform: translateY(6px); } }
    .desc { font-size: 13.5px; line-height: 1.55; color: #3d4734; max-width: 38ch; }
    .buy { margin-top: auto; display: grid; gap: 10px; }
    .sizes { display: flex; gap: 8px; }
    .sizes button { flex: 1; display: flex; justify-content: space-between; align-items: baseline; padding: 12px 14px; border: 1px solid #a9b59c; background: transparent; cursor: pointer; font-size: 14px; transition: .25s; }
    .sizes button small { color: #5d6a51; font-size: 12.5px; }
    .sizes button.on { border-color: #232b1d; box-shadow: inset 0 0 0 1px #232b1d; background: #e7ece1; }
    .cta { height: 52px; border: 0; background: #232b1d; color: #e9eee3; cursor: pointer; font-size: 15px; letter-spacing: .02em; transition: background .25s; }
    @media (hover: hover) { .cta:hover { background: #3a4630; } }
    .cta:active, .sizes button:active { opacity: .85; }
    .note { font-size: 12px; color: #5d6a51; }
    @container (max-width: 700px) {
      .split { grid-template-columns: 1fr; grid-template-rows: 240px auto; }
      .pyramid-wrap { grid-template-columns: 1fr; gap: 14px; margin: 16px 0 14px; }
      .pyramid { width: min(280px, 100%); justify-self: center; }
      .notes { min-height: 0; }
    }
    @container (max-width: 380px) { .content { padding: 22px 18px 24px; } .sizes button { padding: 12px 10px; } }
  `,
})
export class FragranceNotesSplit {
  protected readonly img = unsplash(PRODUCT_PHOTOS.perfume, 900, 1200);
  protected readonly tiers: Tier[] = [
    { id: 'top', label: 'Top', when: 'First 15 minutes', notes: ['Bergamot', 'Pink pepper', 'Cardamom'], copy: 'A bright, peppery opening — citrus peel crushed between the fingers.' },
    { id: 'heart', label: 'Heart', when: 'Two to four hours', notes: ['Haitian vetiver', 'Orris', 'Clary sage'], copy: 'Smoky vetiver softened by powdery iris; the signature of the scent.' },
    { id: 'base', label: 'Base', when: 'Into the evening', notes: ['Oud accord', 'Ambergris', 'Cedarwood'], copy: 'A warm, mineral trail of resin and salt that lingers on wool.' },
  ];
  protected readonly sizes = [
    { ml: 50, price: 145 },
    { ml: 100, price: 210 },
  ];
  protected readonly tier = signal<Tier['id']>('heart');
  protected readonly current = computed(() => this.tiers.find((t) => t.id === this.tier()) ?? this.tiers[0]);
  protected readonly size = signal(50);
  protected readonly price = computed(() => this.sizes.find((s) => s.ml === this.size())?.price ?? 145);
  protected readonly added = signal(false);

  constructor() {
    loadGoogleFonts('Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700');
  }

  key(e: KeyboardEvent, i: number): void {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + this.tiers.length) % this.tiers.length;
    this.tier.set(this.tiers[next].id);
    const btns = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll('button');
    btns?.[next]?.focus();
  }
}
