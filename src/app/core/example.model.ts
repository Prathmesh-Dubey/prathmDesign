import { Type } from '@angular/core';

/** One live design pattern shown in the catalogue. */
export interface DesignExample {
  /** Unique kebab-case id, also used as the page anchor. */
  id: string;
  title: string;
  /** Pattern family — drives the filter chips (e.g. "Carousel Cards"). */
  type: string;
  /** One plain sentence on what the pattern is good for. */
  description: string;
  /** A complete, paste-ready prompt that rebuilds this design. */
  prompt: string;
  tags: string[];
  /** Standalone component rendered live inside the stage. */
  component: Type<unknown>;
  /** Minimum stage height in px. Default 440. */
  stageHeight?: number;
  /** Stage backdrop behind the demo. Default 'light'. */
  stageTone?: 'light' | 'dark' | 'none';
}

export type CategoryKey = 'cards' | 'products' | 'gallery' | 'typography' | 'heroes';

export interface CategoryMeta {
  key: CategoryKey;
  title: string;
  path: string;
  /** Short code prefix for catalogue numbers, e.g. "CA". */
  code: string;
  swatch: string;
  swatchInk: string;
  blurb: string;
  families: string[];
}
