import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ImgFallback, PRODUCT_PHOTOS, unsplash } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Spot {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
}

interface Fabric {
  id: string;
  name: string;
  chip: string;
  filter: string;
}

@Component({
  selector: 'demo-hotspot-showcase',
  imports: [ImgFallback],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.escape)': 'active.set(null)' },
  template: `
    <section class="wrap">
      <div class="scene" (click)="sceneTap($event)">
        <img [src]="img" appImgFallback="ostra-sofa" alt="Ostra three-seat sofa in a living room" [style.filter]="fabric().filter" />
        @for (s of spots; track s.id; let i = $index) {
          <button
            type="button"
            class="spot"
            [class.on]="active() === i"
            [style.left.%]="s.x"
            [style.top.%]="s.y"
            [attr.aria-label]="s.title"
            [attr.aria-expanded]="active() === i"
            (click)="toggle(i)"
          >
            <span>{{ i + 1 }}</span>
          </button>
        }
        @if (current(); as c) {
          <div class="callout" role="dialog" [attr.aria-label]="c.title"
            [style.left.%]="c.x" [style.top.%]="c.y" [class.flip-x]="c.x > 58" [class.flip-y]="c.y > 60">
            <p class="step">{{ (active() ?? 0) + 1 }} of {{ spots.length }}</p>
            <h4>{{ c.title }}</h4>
            <p>{{ c.text }}</p>
            <div class="nav">
              <button type="button" (click)="step(-1)" aria-label="Previous feature">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
              </button>
              <button type="button" (click)="step(1)" aria-label="Next feature">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" /></svg>
              </button>
              <button type="button" class="x" (click)="active.set(null)">Close</button>
            </div>
          </div>
        }
      </div>

      <aside class="panel">
        <p class="studio">Studio Ostra · Copenhagen</p>
        <h3>Ostra 3-Seat Sofa</h3>
        <p class="price">£2,450 <span>or £204/mo</span></p>
        <ol class="list">
          @for (s of spots; track s.id; let i = $index) {
            <li><button type="button" [class.on]="active() === i" (click)="toggle(i)"><b>{{ i + 1 }}</b>{{ s.title }}</button></li>
          }
        </ol>
        <p class="fab-l">Upholstery — <strong>{{ fabric().name }}</strong></p>
        <div class="fabrics">
          @for (f of fabrics; track f.id) {
            <button type="button" [style.background]="f.chip" [class.on]="fabric().id === f.id" (click)="fabricId.set(f.id)" [attr.aria-label]="f.name" [attr.aria-pressed]="fabric().id === f.id"></button>
          }
        </div>
      </aside>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; container-type: inline-size; font-family: 'Jost', sans-serif; background: #15223d; color: #eef1f7; }
    .wrap { display: grid; grid-template-columns: 1fr 300px; min-height: 600px; height: 100%; }
    .scene { position: relative; overflow: hidden; }
    .scene > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: filter .6s ease; }
    .spot {
      position: absolute; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; border: 0; cursor: pointer;
      background: rgba(255,255,255,.92); color: #15223d; font-weight: 600; font-size: 13px; display: grid; place-items: center;
      box-shadow: 0 6px 18px rgba(0,0,0,.3); transition: transform .3s cubic-bezier(.3,1.5,.5,1), background .2s, color .2s;
    }
    .spot::before { content: ''; position: absolute; inset: -8px; border-radius: 50%; border: 2px solid rgba(255,255,255,.7); animation: ping 2.2s ease-out infinite; }
    @keyframes ping { from { transform: scale(.6); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
    .spot::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; }
    @media (hover: hover) { .spot:hover { transform: scale(1.12); } }
    .spot:active { transform: scale(.94); }
    button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .spot.on { background: #f2b85b; color: #15223d; transform: scale(1.18); }
    .spot.on::before { animation: none; opacity: 0; }
    .callout {
      position: absolute; z-index: 2; width: 250px; margin: 26px 0 0 -20px; padding: 16px 16px 12px; border-radius: 14px;
      background: #fbfaf7; color: #15223d; box-shadow: 0 24px 40px -18px rgba(0,0,0,.55); animation: in .35s cubic-bezier(.2,.8,.2,1);
    }
    .callout.flip-x { margin-left: -230px; }
    .callout.flip-y { transform: translateY(calc(-100% - 52px)); animation-name: in-up; }
    @keyframes in { from { opacity: 0; transform: translateY(8px) scale(.97); } }
    @keyframes in-up { from { opacity: 0; transform: translateY(calc(-100% - 44px)) scale(.97); } }
    .step { font-size: 12px; color: #6b7590; }
    h4 { font-size: 18px; font-weight: 500; margin: 2px 0 6px; }
    .callout p:not(.step) { font-size: 13.5px; line-height: 1.5; color: #3a4560; }
    .nav { display: flex; gap: 6px; margin-top: 12px; }
    .nav button { height: 32px; min-width: 32px; border-radius: 999px; border: 1px solid #d6dae4; background: #fff; cursor: pointer; display: grid; place-items: center; }
    .nav svg { width: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .nav .x { margin-left: auto; padding: 0 12px; font-size: 13px; }
    .nav button:active { background: #eef0f5; }
    @media (pointer: coarse) { .nav button { height: 40px; min-width: 40px; } }
    .panel { padding: 28px 24px; display: flex; flex-direction: column; gap: 6px; border-left: 1px solid rgba(255,255,255,.08); }
    .studio { font-size: 13px; color: #9aa6c3; }
    h3 { font-size: 30px; font-weight: 400; line-height: 1.05; letter-spacing: -.01em; }
    .price { font-size: 18px; margin-top: 6px; }
    .price span { font-size: 13px; color: #9aa6c3; margin-left: 6px; }
    .list { list-style: none; padding: 0; margin: 18px 0; display: grid; gap: 2px; }
    .list button { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 8px; border: 0; border-radius: 10px; background: transparent; color: #d7deec; cursor: pointer; text-align: left; font-size: 15px; transition: background .2s; }
    @media (hover: hover) { .list button:hover { background: rgba(255,255,255,.06); } }
    .list button.on { background: rgba(242,184,91,.14); color: #fff; }
    .list b { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,.3); flex: none; }
    .list button.on b { background: #f2b85b; color: #15223d; border-color: #f2b85b; }
    .fab-l { margin-top: auto; font-size: 13px; color: #9aa6c3; }
    .fab-l strong { color: #fff; font-weight: 500; }
    .fabrics { display: flex; gap: 10px; margin-top: 8px; }
    .fabrics button { width: 34px; height: 34px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; box-shadow: 0 0 0 2px #15223d inset; transition: border-color .2s; }
    .fabrics button.on { border-color: #f2b85b; }
    .fabrics button { position: relative; }
    .fabrics button::after { content: ''; position: absolute; inset: -5px; border-radius: 50%; }
    .fabrics button:active { transform: scale(.92); }
    @container (max-width: 720px) {
      .wrap { grid-template-columns: 1fr; grid-template-rows: 380px auto; }
      .panel { border-left: 0; }
      .callout { width: 210px; }
      .callout.flip-x { margin-left: -190px; }
      .list { display: none; }
      .panel { padding: 20px 18px 22px; }
      h3 { font-size: 26px; }
    }
    /* Phone: the callout docks as a sheet along the bottom of the photo so it never clips. */
    @container (max-width: 480px) {
      .wrap { grid-template-rows: 360px auto; }
      .callout, .callout.flip-x, .callout.flip-y {
        left: 10px !important; right: 10px; top: auto !important; bottom: 10px; width: auto; margin: 0;
        transform: none; animation-name: in; padding: 14px 14px 10px;
      }
      h4 { font-size: 16px; }
      .callout p:not(.step) { font-size: 13px; }
    }
  `,
})
export class HotspotShowcase {
  protected readonly img = unsplash(PRODUCT_PHOTOS.sofa, 1200, 900);
  protected readonly spots: Spot[] = [
    { id: 'cushion', x: 40, y: 46, title: 'Feather-wrapped cushions', text: 'Pocket-sprung cores wrapped in recycled down; they spring back by morning.' },
    { id: 'arm', x: 17, y: 58, title: 'Low, wide arms', text: 'A 22 cm flat arm doubles as a perch for a coffee cup or a book.' },
    { id: 'frame', x: 66, y: 64, title: 'Kiln-dried oak frame', text: 'Dowelled and glued, never stapled. Guaranteed for 15 years.' },
    { id: 'legs', x: 28, y: 82, title: 'Turned walnut legs', text: 'Oiled by hand and fitted with felt glides for wooden floors.' },
  ];
  protected readonly fabrics: Fabric[] = [
    { id: 'slate', name: 'Slate bouclé', chip: '#8a8f99', filter: 'none' },
    { id: 'moss', name: 'Moss velvet', chip: '#6c7a52', filter: 'sepia(.45) hue-rotate(40deg) saturate(1.5)' },
    { id: 'rust', name: 'Rust wool', chip: '#a35a3c', filter: 'sepia(.7) hue-rotate(-25deg) saturate(1.9)' },
    { id: 'ink', name: 'Ink linen', chip: '#2f3d63', filter: 'sepia(.4) hue-rotate(180deg) saturate(1.6) brightness(.85)' },
  ];
  protected readonly active = signal<number | null>(0);
  protected readonly current = computed(() => {
    const a = this.active();
    return a === null ? null : this.spots[a];
  });
  protected readonly fabricId = signal('slate');
  protected readonly fabric = computed(() => this.fabrics.find((f) => f.id === this.fabricId()) ?? this.fabrics[0]);

  constructor() {
    loadGoogleFonts('Jost:wght@400;500;600');
  }

  toggle(i: number): void {
    this.active.set(this.active() === i ? null : i);
  }

  /** Tapping the photo (not a hotspot or the callout) dismisses the open callout. */
  sceneTap(e: Event): void {
    if ((e.target as Element).closest('button, .callout')) return;
    this.active.set(null);
  }

  step(d: number): void {
    const n = this.spots.length;
    this.active.set((((this.active() ?? 0) + d) % n + n) % n);
  }
}
