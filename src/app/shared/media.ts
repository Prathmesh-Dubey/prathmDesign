import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { PHOTO_POOL, PRODUCT_IMAGES } from './image-manifest';

/*
 * All photos are served locally from /public/images (no external image links).
 * Each photo is stored in a set of aspect-ratio "buckets"; a request for w × h
 * resolves to the closest bucket, so layouts keep the shape they asked for.
 */

const BUCKETS: Record<string, number> = {
  r9x16: 9 / 16, r2x3: 2 / 3, r4x5: 4 / 5, r1x1: 1, r5x4: 5 / 4, r4x3: 4 / 3, r3x2: 3 / 2, r16x9: 16 / 9, r12x5: 12 / 5,
};

const nearest = (ratio: number, names: string[]): string =>
  names.reduce((best, k) =>
    Math.abs(Math.log(BUCKETS[k] / ratio)) < Math.abs(Math.log(BUCKETS[best] / ratio)) ? k : best, names[0]);

const ALL_BUCKETS = Object.keys(BUCKETS);

/** FNV-1a — stable seed → pool index. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic local scene photo for a seed, cropped to the nearest shape of w × h. */
export const photo = (seed: string, w = 800, h = 600): string => {
  const id = PHOTO_POOL[hash(seed) % PHOTO_POOL.length];
  return `images/photos/p${id}-${nearest(w / h, ALL_BUCKETS)}.webp`;
};

/** Local copy of an Unsplash photo by id (see PRODUCT_PHOTOS). Without h, the original shape is used. */
export const unsplash = (id: string, w = 800, h?: number): string => {
  const entry = PRODUCT_IMAGES[id];
  if (!entry) return photo(id, w, h ?? w);
  if (!h) return `images/products/${entry.file}-natural.webp`;
  const ratio = w / h;
  const options = entry.buckets.length ? entry.buckets : [];
  const best = options.length ? nearest(ratio, options) : null;
  // Prefer the original when it is a closer fit than any stored crop.
  const naturalErr = Math.abs(Math.log(entry.ratio / ratio));
  if (!best || naturalErr <= Math.abs(Math.log(BUCKETS[best] / ratio))) return `images/products/${entry.file}-natural.webp`;
  return `images/products/${entry.file}-${best}.webp`;
};

/** Curated product photography (Unsplash ids, stored locally). */
export const PRODUCT_PHOTOS = {
  watchWhite: 'photo-1523275335684-37898b6baf30',
  watchDark: 'photo-1546868871-7041f2a55e12',
  watchClassic: 'photo-1524805444758-089113d48a6d',
  headphones: 'photo-1505740420928-5e560c06d30e',
  headphonesAlt: 'photo-1583394838336-acd977736f90',
  // Volt trainer shifted to red when it was downloaded (the original red-sneaker photo was retired).
  sneakerRed: 'photo-1606107557195-0e29a4b5b4aa?hue=280&sat=100&con=20&exp=-15',
  sneakerPair: 'photo-1491553895911-0055eca6402d',
  sneakerWhite: 'photo-1600185365483-26d7a4cc7519',
  shoes: 'photo-1560343090-f0409e92791a',
  camera: 'photo-1526170375885-4d8ecf77b99f',
  sunglasses: 'photo-1572635196237-14b3f281503f',
  perfume: 'photo-1585386959984-a4155224a1ad',
  perfumeBottle: 'photo-1541643600914-78b084683601',
  perfumeAlt: 'photo-1594035910387-fea47794261f',
  skincare: 'photo-1556228578-8c89e6adf883',
  serum: 'photo-1620916566398-39f1143ab7be',
  chair: 'photo-1586023492125-27b2c045efd7',
  sofa: 'photo-1555041469-a586c61ea9bc',
  stool: 'photo-1503602642458-232111445657',
  laptop: 'photo-1517336714731-489689fd1ca8',
  phone: 'photo-1511707171634-5f897ff02aa9',
  speaker: 'photo-1608043152269-423dbba4e7e1',
} as const;

/**
 * Swaps a broken image for a local scene photo of the same shape.
 * Usage: <img [src]="url" appImgFallback="seed-name" />
 */
@Directive({ selector: 'img[appImgFallback]' })
export class ImgFallback {
  readonly appImgFallback = input<string>('fallback');
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private failed = false;

  @HostListener('error')
  onError(): void {
    if (this.failed) return;
    this.failed = true;
    const img = this.el.nativeElement;
    const w = img.width || img.naturalWidth || 800;
    const h = img.height || img.naturalHeight || 800;
    img.src = photo(this.appImgFallback() || 'fallback', w, h);
  }
}
