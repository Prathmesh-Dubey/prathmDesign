import { DestroyRef, ElementRef, Signal, afterNextRender, effect, inject } from '@angular/core';
import { prefersReducedMotion } from '../../shared/visibility';

/**
 * Shared touch affordances for every hero demo. Put it first in `styles`:
 * `styles: [HERO_TOUCH_CSS, '...']`. Kills the double-tap zoom delay and the
 * grey tap flash, gives burgers a 44px hit area and adds a pressed state.
 */
export const HERO_TOUCH_CSS = `
  :host { -webkit-tap-highlight-color: transparent; }
  a, button, input { touch-action: manipulation; }
  .burger { min-width: 44px; min-height: 44px; }
  .burger:active, .btn:active, .cta-sm:active { scale: .97; }
  .sheet a { min-height: 44px; display: flex; align-items: center; }
  .sheet a:active { opacity: .7; }
`;

/** Prevents placeholder `href="#"` links inside a demo from jumping the page. */
export function preventHashLinks(e: Event): void {
  const a = (e.target as HTMLElement | null)?.closest?.('a');
  if (a && a.getAttribute('href') === '#') e.preventDefault();
}

/**
 * requestAnimationFrame loop that only runs while `visible()` is true and the
 * user has not asked for reduced motion. Must be called in an injection context.
 */
export function rafLoop(visible: Signal<boolean>, frame: (t: number, dt: number) => void, allowReduced = false): void {
  const destroyRef = inject(DestroyRef);
  const reduced = prefersReducedMotion() && !allowReduced;
  let raf = 0;
  let last = 0;
  let running = false;
  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(64, last ? now - last : 16);
    last = now;
    frame(now, dt);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || reduced) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  effect(() => (visible() ? start() : stop()));
  destroyRef.onDestroy(stop);
}

export interface CanvasState {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  w: number;
  h: number;
  dpr: number;
}

export interface CanvasStageOptions {
  canvas: Signal<ElementRef<HTMLCanvasElement> | undefined>;
  visible: Signal<boolean>;
  /** Called on first layout and every resize (CSS px sizes). */
  resize?: (s: CanvasState) => void;
  /** Draws one frame. `t` is a timestamp in ms, `dt` the frame delta in ms. */
  draw: (s: CanvasState, t: number, dt: number) => void;
  maxDpr?: number;
}

/**
 * DPR-aware canvas with ResizeObserver sizing, a visibility-gated rAF loop,
 * reduced-motion support (draws a single still frame) and cleanup on destroy.
 * Must be called in an injection context. Returns `redraw()` for still mode.
 */
export function canvasStage(opts: CanvasStageOptions): { redraw: () => void; reduced: boolean } {
  const destroyRef = inject(DestroyRef);
  const reduced = prefersReducedMotion();
  let state: CanvasState | null = null;
  let raf = 0;
  let last = 0;
  let running = false;
  let destroyed = false;

  const tick = (now: number) => {
    if (!running || !state) return;
    const dt = Math.min(64, last ? now - last : 16);
    last = now;
    opts.draw(state, now, dt);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || reduced || !state || destroyed) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const redraw = () => {
    if (state && !running) opts.draw(state, performance.now(), 16);
  };

  afterNextRender(() => {
    const el = opts.canvas()?.nativeElement;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 2);
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = { ctx, canvas: el, w, h, dpr };
      opts.resize?.(state);
      if (running) return;
      opts.draw(state, performance.now(), 16);
      if (opts.visible()) start();
    });
    ro.observe(el);
    destroyRef.onDestroy(() => ro.disconnect());
  });

  effect(() => (opts.visible() ? start() : stop()));
  destroyRef.onDestroy(() => {
    destroyed = true;
    stop();
  });
  return { redraw, reduced };
}
