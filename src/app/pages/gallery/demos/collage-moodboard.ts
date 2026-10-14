import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { photo } from '../../../shared/media';
import { loadGoogleFonts } from '../../../shared/fonts';

type Kind = 'photo' | 'note' | 'swatch' | 'label' | 'fabric';
type Pos = [number, number, number, number]; // x%, y%, width%, rotation deg

interface Piece {
  id: number;
  kind: Kind;
  text?: string;
  hex?: string;
  src?: string;
  ratio?: number;
  tape?: 'top' | 'corner' | 'none';
  a: Pos;
  b: Pos;
  t: Pos; // tall/narrow board
}

const PIECES: Piece[] = [
  { id: 0, kind: 'photo', src: photo('ss26-coast-0', 600, 760), ratio: 0.8, tape: 'top', a: [3, 6, 24, -3], b: [56, 5, 22, 3], t: [4, 3, 52, -3] },
  { id: 1, kind: 'photo', src: photo('ss26-coast-1', 700, 480), ratio: 1.45, tape: 'corner', a: [30, 4, 30, 2], b: [4, 8, 34, -2], t: [44, 20, 54, 4] },
  { id: 2, kind: 'note', text: 'less beige!! think\nsalt, rope, rust', a: [63, 3, 16, 5], b: [40, 4, 15, -6], t: [60, 2, 36, 6] },
  { id: 3, kind: 'swatch', text: 'Harbour Navy', hex: '#1f3550', a: [82, 6, 13, -4], b: [80, 40, 13, 5], t: [6, 40, 28, -5] },
  { id: 4, kind: 'swatch', text: 'Buoy Orange', hex: '#e8562a', a: [84, 34, 12, 6], b: [83, 66, 12, -3], t: [34, 42, 26, 4] },
  { id: 5, kind: 'photo', src: photo('ss26-coast-2', 600, 600), ratio: 1, tape: 'top', a: [62, 30, 20, -2], b: [26, 46, 20, 4], t: [58, 46, 38, -3] },
  { id: 6, kind: 'fabric', text: 'Waxed cotton, 280gsm', a: [32, 52, 18, -5], b: [61, 50, 18, 6], t: [8, 56, 40, 5] },
  { id: 7, kind: 'label', text: 'SS26 — COASTAL UTILITY\nmoodboard v3 · Ana Lisboa', a: [4, 70, 26, 1], b: [4, 72, 30, -1], t: [4, 84, 60, 1] },
  { id: 8, kind: 'photo', src: photo('ss26-coast-3', 760, 520), ratio: 1.46, tape: 'corner', a: [50, 60, 24, 3], b: [40, 22, 18, 2], t: [46, 70, 48, -4] },
  { id: 9, kind: 'note', text: 'pockets on\nEVERYTHING', a: [77, 62, 15, -6], b: [8, 44, 14, 7], t: [62, 88, 32, -5] },
];

@Component({
  selector: 'demo-collage-moodboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="board" [class.tall]="tall()">
      @for (p of pieces; track p.id) {
        @let pos = posOf(p);
        <div class="pc" [class]="'pc ' + p.kind" [class.lift]="lifted() === p.id" tabindex="0" (click)="lift(p.id)"
          [style.left.%]="pos[0]" [style.top.%]="pos[1]" [style.width.%]="pos[2]" [style.--r.deg]="pos[3]"
          [attr.aria-label]="label(p)">
          @switch (p.kind) {
            @case ('photo') {
              @if (p.tape !== 'none') { <span [class]="'tape ' + p.tape" aria-hidden="true"></span> }
              <img [src]="p.src" [alt]="'Moodboard reference photograph ' + (p.id + 1) + ', SS26 Coastal Utility'" [style.aspect-ratio]="p.ratio" />
            }
            @case ('note') { <p class="hand">{{ p.text }}</p> }
            @case ('swatch') {
              <span class="chip" [style.background]="p.hex"></span>
              <span class="sw-name">{{ p.text }}</span><span class="sw-hex">{{ p.hex }}</span>
            }
            @case ('fabric') { <span class="weave" aria-hidden="true"></span><span class="pin" aria-hidden="true"></span><p class="typed">{{ p.text }}</p> }
            @case ('label') { <p class="typed">{{ p.text }}</p> }
          }
        </div>
      }
    </div>
    @if (!tall()) {
      <button type="button" class="re" (click)="alt.set(!alt())">Rearrange board</button>
    }
  `,
  styles: `
    :host { display: block; position: relative; container-type: inline-size; min-height: 100%; padding: clamp(10px, 2cqw, 20px);
      background: #b9c0bd radial-gradient(rgba(0,0,0,.08) 1px, transparent 1.5px) 0 0 / 16px 16px; }
    .board { position: relative; aspect-ratio: 16 / 9.6; width: min(100%, 960px); margin: 0 auto; }
    .board.tall { aspect-ratio: 3 / 5; }
    .pc { position: absolute; transform: rotate(var(--r)); outline: none; cursor: default;
      transition: left .8s cubic-bezier(.65,0,.25,1), top .8s cubic-bezier(.65,0,.25,1), width .8s cubic-bezier(.65,0,.25,1), transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
    .pc { -webkit-tap-highlight-color: transparent; }
    .pc:hover, .pc:focus-visible, .pc.lift { transform: rotate(calc(var(--r) * .5)) translateY(-4px) scale(1.03); z-index: 5; }
    .pc.lift { transform: rotate(0deg) translateY(-6px) scale(1.08); box-shadow: 0 24px 34px -16px rgba(0,0,0,.6); }
    @media (hover: none) { .pc:hover:not(.lift) { transform: rotate(var(--r)); z-index: auto; } }
    .pc:focus-visible { box-shadow: 0 0 0 3px #e8562a; }
    .photo { background: #fff; padding: 6px; box-shadow: 0 10px 22px -12px rgba(0,0,0,.5); }
    .photo img { width: 100%; object-fit: cover; filter: saturate(.85) contrast(1.05); }
    .tape { position: absolute; z-index: 2; width: 38%; height: 18px; background: rgba(240,226,180,.72); box-shadow: 0 1px 2px rgba(0,0,0,.12);
      clip-path: polygon(0 10%, 4% 0, 8% 12%, 12% 0, 100% 0, 96% 88%, 100% 100%, 0 100%, 3% 50%); }
    .tape.top { left: 31%; top: -9px; transform: rotate(-3deg); }
    .tape.corner { right: -14px; top: 4px; width: 30%; transform: rotate(38deg); background: rgba(160,205,220,.7); }
    .note { background: #ffe873; padding: 12% 10%; box-shadow: 0 12px 18px -12px rgba(0,0,0,.45); aspect-ratio: 1; display: grid; place-items: center; }
    .hand { font-family: 'Reenie Beanie', cursive; font-size: clamp(16px, 2.6cqw, 28px); line-height: .95; white-space: pre-line; color: #2a2a2a; text-align: center; }
    .swatch { background: #fff; padding: 6px 6px 8px; box-shadow: 0 8px 16px -10px rgba(0,0,0,.45); display: grid; gap: 2px; }
    .chip { display: block; aspect-ratio: 1 / .8; }
    .sw-name { font-family: var(--font-body); font-size: clamp(9px, 1.1cqw, 12px); font-weight: 700; color: #1c1c1c; margin-top: 4px; }
    .sw-hex { font-family: var(--font-mono); font-size: clamp(8px, 1cqw, 10.5px); color: #666; }
    .fabric { aspect-ratio: 1.2; box-shadow: 0 10px 18px -12px rgba(0,0,0,.5); overflow: visible; }
    .weave { position: absolute; inset: 0; background:
      repeating-linear-gradient(45deg, #6f7d5a 0 2px, #7f8e69 2px 4px), #6f7d5a; clip-path: polygon(0 3%, 6% 0, 14% 4%, 24% 0, 36% 3%, 48% 0, 62% 4%, 74% 0, 86% 3%, 100% 0, 98% 100%, 88% 96%, 74% 100%, 60% 97%, 46% 100%, 32% 96%, 18% 100%, 4% 97%); }
    .pin { position: absolute; left: 50%; top: 6px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #ff8b6b, #b8321a); box-shadow: 0 2px 3px rgba(0,0,0,.4); }
    .fabric .typed { position: absolute; left: 6%; bottom: -14px; background: #f7f7f2; padding: 3px 7px; font-size: clamp(9px, 1.1cqw, 12px); box-shadow: 0 2px 4px rgba(0,0,0,.2); white-space: nowrap; }
    .label { background: #f7f7f2; padding: 10px 14px; box-shadow: 0 8px 16px -10px rgba(0,0,0,.4); }
    .typed { font-family: 'Special Elite', monospace; font-size: clamp(10px, 1.5cqw, 15px); color: #222; white-space: pre-line; line-height: 1.35; }
    .re { position: absolute; right: 16px; bottom: 16px; z-index: 10; font-family: 'Special Elite', monospace; font-size: 13px; background: #1f3550; color: #fff;
      border: 0; padding: 9px 14px; min-height: 40px; cursor: pointer; box-shadow: 3px 3px 0 #e8562a; transition: transform .2s, box-shadow .2s;
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .re:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #e8562a; }
    .re:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #e8562a; }
  `,
})
export class CollageMoodboard {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly pieces = PIECES;
  protected readonly alt = signal(false);
  /** tapped piece, lifted to the front (touch stand-in for the hover lift) */
  protected readonly lifted = signal<number | null>(null);
  private readonly width = signal(1000);
  protected readonly tall = computed(() => this.width() < 600);

  constructor() {
    loadGoogleFonts('Reenie+Beanie', 'Special+Elite');
    afterNextRender(() => {
      const ro = new ResizeObserver(([e]) => this.width.set(e.contentRect.width));
      ro.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  lift(id: number): void {
    this.lifted.update((cur) => (cur === id ? null : id));
  }

  posOf(p: Piece): Pos {
    return this.tall() ? p.t : this.alt() ? p.b : p.a;
  }

  label(p: Piece): string {
    switch (p.kind) {
      case 'photo': return 'Reference photograph';
      case 'note': return 'Sticky note: ' + (p.text ?? '').replace('\n', ' ');
      case 'swatch': return 'Colour swatch ' + p.text + ' ' + p.hex;
      case 'fabric': return 'Fabric swatch: ' + p.text;
      default: return (p.text ?? '').replace('\n', ' ');
    }
  }
}
