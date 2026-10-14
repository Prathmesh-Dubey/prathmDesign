import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

interface Finish {
  id: string;
  name: string;
  bg: string;
  ink: string;
  sheen: string;
}

@Component({
  selector: 'demo-credit-card-flip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <div class="scene">
        <button
          type="button"
          class="card"
          [class.flipped]="flipped()"
          [class.frozen]="frozen()"
          [class.tilting]="touchTilt()"
          [style.--bg]="finish().bg"
          [style.--ink]="finish().ink"
          [style.--sheen]="finish().sheen"
          [style.--rx.deg]="rx()"
          [style.--ry.deg]="ry()"
          (click)="flip()"
          (pointerdown)="press($event)"
          (pointermove)="tilt($event)"
          (pointerup)="settle($event)"
          (pointercancel)="settle($event)"
          (pointerleave)="settle($event)"
          [attr.aria-pressed]="flipped()"
          [attr.aria-label]="flipped() ? 'Card back showing security code. Activate to show front.' : 'Kestrel card ending 4821. Activate to show the back.'"
        >
          <span class="face front" aria-hidden="true">
            <span class="brand">kestrel</span>
            <span class="chip"></span>
            <svg class="nfc" viewBox="0 0 24 24"><path d="M8 7a7 7 0 010 10M12 4.5a11 11 0 010 15M16 2a15 15 0 010 20" /></svg>
            <span class="num">•••• •••• •••• 4821</span>
            <span class="foot">
              <span><small>Card holder</small>Imogen Clarke</span>
              <span><small>Valid thru</small>09/29</span>
              <span class="net"><i></i><i></i></span>
            </span>
            @if (frozen()) {
              <span class="frost">Frozen</span>
            }
          </span>
          <span class="face back" aria-hidden="true">
            <span class="stripe"></span>
            <span class="sig">
              <span class="sig-line">I. Clarke</span>
              <span class="cvv">{{ showCvv() ? '318' : '•••' }}</span>
            </span>
            <span class="fine">Issued by Kestrel Bank Ltd. If found, please return to any branch or call +44 20 7946 0321.</span>
          </span>
        </button>
      </div>

      <div class="panel">
        <h3>Your card</h3>
        <p class="hint">Tap or click the card (or press Enter) to flip it. Drag across it to tilt.</p>
        <div class="group" role="radiogroup" aria-label="Card finish">
          @for (f of finishes; track f.id) {
            <button type="button" role="radio" [attr.aria-checked]="finish().id === f.id" [class.on]="finish().id === f.id" (click)="finishId.set(f.id)">
              <span class="sw" [style.background]="f.bg"></span>{{ f.name }}
            </button>
          }
        </div>
        <div class="toggles">
          <label class="tg">
            <input type="checkbox" [checked]="showCvv()" (change)="showCvv.set(!showCvv()); flipped.set(true)" />
            <span class="track"><span></span></span>
            Reveal security code
          </label>
          <label class="tg">
            <input type="checkbox" [checked]="frozen()" (change)="frozen.set(!frozen())" />
            <span class="track"><span></span></span>
            Freeze card
          </label>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block; min-height: 100%; background: linear-gradient(180deg, #e9ecf1, #dfe3ea);
      color: #161b26; font-family: 'Sora', 'Geist', sans-serif; container-type: inline-size;
    }
    .layout { display: grid; grid-template-columns: 1.3fr 1fr; align-items: center; gap: 28px; min-height: 100%; padding: clamp(24px, 5cqi, 52px); }
    .scene { perspective: 1200px; display: grid; place-items: center; }
    .card {
      position: relative; width: min(380px, 100%); aspect-ratio: 1.586; border: 0; padding: 0; background: none; cursor: pointer;
      transform-style: preserve-3d; transform: rotateX(var(--rx)) rotateY(calc(var(--ry) + 0deg));
      transition: transform .7s cubic-bezier(.3,.7,.2,1); border-radius: 18px; color: var(--ink);
      touch-action: pan-y; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none;
    }
    .card.tilting { transition: transform .12s ease-out; }
    .card.flipped { transform: rotateX(var(--rx)) rotateY(calc(180deg + var(--ry))); }
    .card:focus-visible { outline: 3px solid #3b5bdb; outline-offset: 6px; }
    .face {
      position: absolute; inset: 0; border-radius: 18px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden;
      background: var(--sheen), var(--bg); box-shadow: 0 30px 50px -28px rgba(22,27,38,.65), inset 0 1px 0 rgba(255,255,255,.25);
      text-align: left; display: block;
    }
    .front { padding: 22px 24px; }
    .back { transform: rotateY(180deg); }
    .brand { position: absolute; top: 20px; left: 24px; font-weight: 700; font-size: 20px; letter-spacing: -0.04em; }
    .chip { position: absolute; top: 34%; left: 24px; width: 44px; height: 34px; border-radius: 7px; background: linear-gradient(135deg, #e9d7a1, #b89a52 60%, #e7d29a); box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
    .chip::before { content: ''; position: absolute; inset: 9px 0; border-top: 1px solid rgba(0,0,0,.2); border-bottom: 1px solid rgba(0,0,0,.2); }
    .nfc { position: absolute; top: 36%; left: 80px; width: 22px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; opacity: .7; }
    .num { position: absolute; left: 24px; bottom: 30%; font-family: 'Geist Mono', monospace; font-size: clamp(14px, 2.6cqi, 19px); letter-spacing: .08em; }
    .foot { position: absolute; left: 24px; right: 24px; bottom: 18px; display: flex; gap: 22px; align-items: end; font-size: 13px; font-weight: 600; }
    .foot small { display: block; font-size: 9px; font-weight: 400; opacity: .65; margin-bottom: 2px; }
    .net { margin-left: auto; display: flex; }
    .net i { width: 26px; height: 26px; border-radius: 50%; background: #eb5a3c; }
    .net i + i { background: #f7a531; margin-left: -10px; mix-blend-mode: multiply; opacity: .9; }
    .frost { position: absolute; inset: 0; display: grid; place-items: center; backdrop-filter: blur(4px) saturate(.4); background: rgba(210,225,240,.35); font-weight: 700; font-size: 18px; color: #12304f; letter-spacing: .02em; animation: frost .4s ease; }
    .stripe { position: absolute; left: 0; right: 0; top: 22px; height: 44px; background: #11141a; }
    .sig { position: absolute; left: 24px; right: 24px; top: 88px; height: 40px; display: flex; align-items: center; justify-content: space-between; background: repeating-linear-gradient(-45deg, #f5f3ee 0 6px, #ebe8e0 6px 12px); border-radius: 4px; padding: 0 12px; color: #161b26; }
    .sig-line { font-family: 'Caveat', cursive; font-size: 20px; }
    .cvv { font-family: 'Geist Mono', monospace; font-size: 15px; background: #fff; padding: 3px 8px; border-radius: 4px; }
    .fine { position: absolute; left: 24px; right: 24px; bottom: 18px; font-size: 9.5px; line-height: 1.4; opacity: .7; }

    .panel h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; }
    .hint { font-size: 13.5px; color: #5b6475; margin-top: 4px; }
    .group { display: grid; gap: 6px; margin-top: 18px; }
    .group button { display: flex; align-items: center; gap: 10px; min-height: 44px; border: 1px solid #c9cfda; background: rgba(255,255,255,.55); padding: 9px 12px; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; text-align: left; transition: border-color .2s, background .2s; touch-action: manipulation; -webkit-tap-highlight-color: transparent; color: inherit; }
    .group button:hover, .group button:active { border-color: #161b26; }
    .group button.on { border-color: #161b26; background: #fff; box-shadow: 0 6px 16px -10px rgba(22,27,38,.5); }
    .sw { width: 28px; height: 18px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.1); }
    .toggles { display: grid; gap: 10px; margin-top: 18px; }
    .tg { display: flex; align-items: center; gap: 10px; min-height: 40px; font-size: 14px; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .tg input { position: absolute; opacity: 0; width: 1px; height: 1px; }
    .track { width: 38px; height: 22px; border-radius: 99px; background: #c4cad6; padding: 2px; transition: background .2s; flex-shrink: 0; }
    .track span { display: block; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.3,.8,.3,1); box-shadow: 0 1px 3px rgba(0,0,0,.2); }
    .tg input:checked + .track { background: #161b26; }
    .tg input:checked + .track span { transform: translateX(16px); }
    .tg input:focus-visible + .track { outline: 2px solid #3b5bdb; outline-offset: 2px; }
    @keyframes frost { from { opacity: 0; } }
    @container (max-width: 640px) { .layout { grid-template-columns: 1fr; gap: 22px; } }
    @container (max-width: 400px) {
      .layout { padding: 22px 16px; }
      .front { padding: 16px 18px; }
      .brand { top: 14px; left: 18px; font-size: 18px; }
      .chip { left: 18px; width: 38px; height: 29px; }
      .nfc { left: 66px; }
      .num { left: 18px; font-size: 15px; letter-spacing: .05em; }
      .foot { left: 18px; right: 18px; bottom: 13px; gap: 14px; font-size: 12px; }
      .net i { width: 22px; height: 22px; }
      .stripe { top: 16px; height: 36px; }
      .sig { left: 18px; right: 18px; top: 66px; height: 34px; }
      .fine { left: 18px; right: 18px; bottom: 12px; font-size: 8.5px; }
    }
  `,
})
export class CreditCardFlip {
  protected readonly finishes: Finish[] = [
    { id: 'obsidian', name: 'Obsidian metal', bg: 'linear-gradient(135deg, #2b2f38, #0d0f13 60%, #23262d)', ink: '#eceff4', sheen: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.12) 45%, transparent 60%)' },
    { id: 'glacier', name: 'Glacier', bg: 'linear-gradient(135deg, #cfe3ee, #9fc3d8 55%, #e3eef4)', ink: '#12304f', sheen: 'radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,.55), transparent 50%)' },
    { id: 'ember', name: 'Ember', bg: 'linear-gradient(135deg, #f0743e, #b8321f 60%, #7a1d14)', ink: '#fff4ec', sheen: 'radial-gradient(90% 70% at 100% 0%, rgba(255,214,150,.45), transparent 55%)' },
  ];
  protected readonly finishId = signal('obsidian');
  protected readonly finish = computed(() => this.finishes.find((f) => f.id === this.finishId())!);
  protected readonly flipped = signal(false);
  protected readonly showCvv = signal(false);
  protected readonly frozen = signal(false);
  protected readonly rx = signal(0);
  protected readonly ry = signal(0);

  constructor() {
    loadGoogleFonts('Sora:wght@400;500;600;700', 'Caveat:wght@500');
  }

  /** True while a finger/pen is tilting the card (shorter transition so it tracks the finger). */
  protected readonly touchTilt = signal(false);
  private start: { x: number; y: number } | null = null;
  private dragged = false;

  protected press(e: PointerEvent): void {
    if (e.pointerType === 'mouse') return;
    this.start = { x: e.clientX, y: e.clientY };
    this.dragged = false;
  }

  protected tilt(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') {
      if (!this.start) return;
      if (!this.dragged && Math.hypot(e.clientX - this.start.x, e.clientY - this.start.y) < 8) return;
      this.dragged = true;
      this.touchTilt.set(true);
    }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    this.rx.set((0.5 - (e.clientY - r.top) / r.height) * 10);
  }

  protected settle(e: PointerEvent): void {
    // mouse: only leaving resets the tilt; touch/pen: lifting (or cancel) does, leave fires after that anyway
    if ((e.pointerType === 'mouse') !== (e.type === 'pointerleave')) return;
    this.start = null;
    this.touchTilt.set(false);
    this.rx.set(0);
    this.ry.set(0);
  }

  /** A tap flips; a finger drag that tilted the card does not. */
  protected flip(): void {
    if (this.dragged) {
      this.dragged = false;
      return;
    }
    this.flipped.set(!this.flipped());
  }
}
