import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';
import { photo } from '../../../shared/media';

interface Pick { name: string; where: string; price: string; img: string; }

@Component({
  selector: 'demo-life-righteous-lato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="wrap">
        <header class="site">
          <span class="logo">Thrift<span>&amp;</span>Tell</span>
          <nav aria-label="Categories"><a href="#" (click)="$event.preventDefault()">Finds</a><a href="#" (click)="$event.preventDefault()">Restore</a><a href="#" (click)="$event.preventDefault()">Rooms</a></nav>
        </header>

        <p class="cat">Restore · Project 23</p>
        <h1>A £35 sideboard, two weekends and a lot of sandpaper</h1>
        <p class="dek">I found this 1970s teak sideboard at a house clearance in Leeds. Here’s exactly how it went from sticky to stunning — and what I’d do differently.</p>
        <p class="by">Posted by Dee Achterberg · 6 Oct 2026 · 6 min read</p>

        <figure class="ba">
          <div class="frame" [style.--x]="x()" [class.drag]="dragging()"
               (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event, false)" (pointercancel)="up($event, true)">
            <img class="before" [src]="img" alt="Sideboard image, before restoration" width="1100" height="640" />
            <img class="after" [src]="img" alt="Sideboard image, after restoration" width="1100" height="640" />
            <span class="lab l" aria-hidden="true">Before</span>
            <span class="lab r" aria-hidden="true">After</span>
            <span class="handle" aria-hidden="true"><span></span></span>
            <input #range type="range" min="0" max="100" [value]="x()" (input)="x.set(num($event))" aria-label="Compare before and after" [attr.aria-valuetext]="(100 - x()) + '% after shown'" />
          </div>
          <figcaption>Drag across the photo, tap a spot, or use the arrow keys to compare.</figcaption>
        </figure>

        <div class="body">
          <p>The finish was a mix of old wax and something that might once have been varnish. Two coats of a citrus stripper lifted most of it; the rest came off with 120-grit and a cork block. Teak veneer is thin, so I never went coarser than that.</p>
          <p>For the finish I used three thin coats of Danish oil, rubbed back with 0000 wire wool between each. The new brass pulls cost more than the sideboard did. No regrets.</p>
        </div>

        <section class="shop" aria-label="Shop the look">
          <h2>Get the look</h2>
          <ul>
            @for (p of picks; track p.name) {
              <li><img [src]="p.img" [alt]="'Product image for ' + p.name" width="300" height="300" loading="lazy" /><b>{{ p.name }}</b><span>{{ p.where }}</span><em>{{ p.price }}</em></li>
            }
          </ul>
        </section>

        <footer class="key" aria-label="Type specimen">
          <span class="kr">Righteous</span><span>Retro display · 400 only · 24–60 px</span>
          <span class="kl">Lato</span><span>300 / 400 / 700 / 900 · body 17 / 28 px</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 700px; background: #fbe7e1; color: #3b2416; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; }
    .wrap { max-width: 900px; margin: 0 auto; padding: clamp(16px, 4cqi, 36px) clamp(16px, 4cqi, 36px) 36px; }
    .site { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 16px; background: #00808a; color: #fbe7e1; border-radius: 999px; }
    .logo { font: 400 22px/1 'Righteous', sans-serif; letter-spacing: .01em; }
    .logo span { color: #e8b923; margin: 0 2px; }
    nav { display: flex; gap: 16px; font: 700 13px/1 'Lato', sans-serif; }
    nav a { text-decoration: none; }
    nav a:hover { color: #e8b923; }
    .cat { font: 900 12.5px/1 'Lato', sans-serif; color: #00808a; margin-top: 30px; }
    h1 { font-family: 'Righteous', sans-serif; font-weight: 400; font-size: clamp(30px, 5.8cqi, 58px); line-height: 1.02; margin-top: 12px; text-wrap: balance; max-width: 20ch; }
    .dek { font: 300 clamp(17px, 2.2cqi, 20px)/1.55 'Lato', sans-serif; margin-top: 14px; max-width: 54ch; }
    .by { font: 400 13px/1 'Lato', sans-serif; color: #8a6450; margin-top: 12px; }
    .ba { margin: 24px 0 0; }
    /* pan-y: horizontal finger drags move the divider, vertical drags keep scrolling the post. */
    .frame { --x: 50; position: relative; aspect-ratio: 11 / 6.4; border-radius: 18px; overflow: hidden; border: 4px solid #3b2416; box-shadow: 8px 8px 0 #e8b923; touch-action: pan-y; cursor: ew-resize; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; }
    .frame img { pointer-events: none; -webkit-user-drag: none; }
    .frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .before { filter: grayscale(.85) sepia(.35) contrast(.8) brightness(.92); }
    .after { clip-path: inset(0 0 0 calc(var(--x) * 1%)); }
    .lab { position: absolute; top: 12px; font: 400 14px/1 'Righteous', sans-serif; background: #3b2416; color: #fbe7e1; padding: 6px 10px; border-radius: 999px; }
    .lab.l { left: 12px; } .lab.r { right: 12px; background: #e8b923; color: #3b2416; }
    .handle { position: absolute; top: 0; bottom: 0; left: calc(var(--x) * 1%); width: 3px; margin-left: -1.5px; background: #fbe7e1; pointer-events: none; }
    .handle span { position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: #e8b923; border: 3px solid #3b2416; transition: transform .15s; }
    .drag .handle span { transform: scale(1.12); }
    .handle span::before, .handle span::after { content: ''; position: absolute; top: 50%; margin-top: -5px; border: 5px solid transparent; }
    .handle span::before { left: 4px; border-right-color: #3b2416; }
    .handle span::after { right: 4px; border-left-color: #3b2416; }
    /* The range input stays for keyboard + screen readers; pointer input is handled on the frame. */
    .frame input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; pointer-events: none; }
    .frame:has(input:focus-visible) { outline: 3px solid #00808a; outline-offset: 4px; }
    figcaption { font: 400 13px/1.4 'Lato', sans-serif; color: #8a6450; margin-top: 14px; }
    .body { margin-top: 20px; font: 400 17px/1.66 'Lato', sans-serif; max-width: 64ch; }
    .body p + p { margin-top: 1em; }
    .shop { margin-top: 30px; padding: 20px; background: #fff; border-radius: 18px; border: 3px solid #3b2416; }
    h2 { font: 400 26px/1 'Righteous', sans-serif; color: #00808a; }
    .shop ul { list-style: none; padding: 0; margin: 14px 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .shop li { display: grid; gap: 3px; font: 400 13px/1.3 'Lato', sans-serif; }
    .shop img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; margin-bottom: 6px; }
    .shop b { font-weight: 700; font-size: 14.5px; }
    .shop span { color: #8a6450; }
    .shop em { font: 400 17px/1 'Righteous', sans-serif; font-style: normal; color: #3b2416; margin-top: 3px; }
    .key { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; align-items: baseline; margin-top: 24px; font: 400 12.5px/1.4 'Lato', sans-serif; color: #8a6450; }
    .kr { font: 400 22px/1 'Righteous', sans-serif; color: #00808a; }
    .kl { font: 900 17px/1 'Lato', sans-serif; color: #3b2416; }
    @container (max-width: 520px) { nav { display: none; } }
  `,
})
export class LifeRighteousLato {
  protected readonly img = photo('thrift-sideboard', 1100, 640);
  protected readonly x = signal(50);
  protected readonly picks: Pick[] = [
    { name: 'Danish oil, 500 ml', where: 'Hardware store', price: '£11', img: photo('thrift-oil', 300, 300) },
    { name: 'Brass cup pulls ×6', where: 'Etsy, Sheffield maker', price: '£42', img: photo('thrift-pulls', 300, 300) },
    { name: 'Cork sanding block', where: 'Any DIY shop', price: '£4', img: photo('thrift-cork', 300, 300) },
    { name: 'Mustard table lamp', where: 'Charity shop find', price: '£8', img: photo('thrift-lamp', 300, 300) },
  ];

  constructor() {
    loadGoogleFonts('Righteous', 'Lato:wght@300;400;700;900');
  }

  num(e: Event): number {
    return +(e.target as HTMLInputElement).value;
  }

  protected readonly dragging = signal(false);
  private readonly range = viewChild.required<ElementRef<HTMLInputElement>>('range');
  private start: { id: number; x: number; y: number; mouse: boolean } | null = null;

  down(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const mouse = e.pointerType === 'mouse';
    this.start = { id: e.pointerId, x: e.clientX, y: e.clientY, mouse };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.range().nativeElement.focus({ preventScroll: true });
    if (mouse) { e.preventDefault(); this.dragging.set(true); this.setFrom(e); }
  }

  move(e: PointerEvent): void {
    const s = this.start;
    if (!s || s.id !== e.pointerId) return;
    if (!this.dragging()) {
      // Touch: only start once the finger clearly moves sideways, so vertical scrolls aren't hijacked.
      const dx = Math.abs(e.clientX - s.x);
      if (dx < 8 || dx < Math.abs(e.clientY - s.y)) return;
      this.dragging.set(true);
    }
    this.setFrom(e);
  }

  up(e: PointerEvent, cancelled: boolean): void {
    const s = this.start;
    if (s && s.id === e.pointerId && !cancelled && !this.dragging()) this.setFrom(e); // tap → jump there
    this.start = null;
    this.dragging.set(false);
  }

  private setFrom(e: PointerEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const v = ((e.clientX - r.left) / r.width) * 100;
    this.x.set(Math.round(Math.min(100, Math.max(0, v))));
  }
}
