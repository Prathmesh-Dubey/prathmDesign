import { DestroyRef, ElementRef, Signal, afterNextRender, inject, signal } from '@angular/core';

/**
 * Returns a signal that is true while the host element is on screen.
 * Use it to pause autoplay timers / requestAnimationFrame loops when off-screen.
 * Must be called in an injection context (field initializer or constructor).
 */
export function hostVisible(threshold = 0.05): Signal<boolean> {
  const el = inject(ElementRef).nativeElement as HTMLElement;
  const visible = signal(false);
  const destroyRef = inject(DestroyRef);
  afterNextRender(() => {
    const io = new IntersectionObserver(([entry]) => visible.set(entry.isIntersecting), { threshold });
    io.observe(el);
    destroyRef.onDestroy(() => io.disconnect());
  });
  return visible.asReadonly();
}

/** True when the user asked the OS to reduce motion. */
export const prefersReducedMotion = (): boolean =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
