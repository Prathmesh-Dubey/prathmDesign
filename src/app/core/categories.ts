import { CategoryKey, CategoryMeta } from './example.model';

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'cards',
    title: 'Cards',
    path: 'cards',
    code: 'CA',
    swatch: '#3B3FE4',
    swatchInk: '#FFFFFF',
    blurb: 'Containers for a single idea — stacked, flipped, tilted, swiped and scrolled.',
    families: [
      'Carousel', 'Grid', 'Stacked', 'Swipe', 'Masonry', 'Bento', 'Flip', 'Expandable',
      'Horizontal scroll', 'Timeline', 'Hover-reveal', '3D tilt', 'Coverflow', 'Scroll-stack', 'Image overlay',
    ],
  },
  {
    key: 'products',
    title: 'Products',
    path: 'products',
    code: 'PR',
    swatch: '#0E7C6B',
    swatchInk: '#FFFFFF',
    blurb: 'Ways to put something on sale, from a single hero object to a full filterable catalogue.',
    families: ['Premium cards', 'Luxury showcase', 'Horizontal list', 'Carousel', 'Full catalogue'],
  },
  {
    key: 'gallery',
    title: 'Gallery',
    path: 'gallery',
    code: 'GA',
    swatch: '#B4235A',
    swatchInk: '#FFFFFF',
    blurb: 'Image layouts that decide how photographs are paced, cropped and opened.',
    families: [
      'Grid', 'Masonry', 'Carousel', 'Justified', 'Asymmetric', 'Lightbox', 'Thumbnail + main',
      'Horizontal scroll', 'Hover overlay', 'Filterable', 'Bento', 'Before / after', 'Collage',
      'Full-width slideshow', '3D coverflow', 'Infinite scroll',
    ],
  },
  {
    key: 'typography',
    title: 'Type & Blogs',
    path: 'typography',
    code: 'TY',
    swatch: '#9A6B00',
    swatchInk: '#FFFFFF',
    blurb: 'Font pairings set inside real blog layouts, so you judge type the way readers meet it.',
    families: ['Editorial', 'Magazine', 'Minimal', 'Tech', 'Personal', 'Newsletter', 'Long-read', 'Lifestyle'],
  },
  {
    key: 'heroes',
    title: 'Heroes',
    path: 'heroes',
    code: 'HE',
    swatch: '#6D28D9',
    swatchInk: '#FFFFFF',
    blurb: 'First screens — liquid, fluid, jumbotron, split, kinetic — built to be seen before scrolling.',
    families: ['Liquid', 'Fluid', 'Jumbotron', 'Split', 'Gradient mesh', 'Kinetic type', 'Glass', 'Interactive'],
  },
];

export const categoryByKey = (key: CategoryKey): CategoryMeta =>
  CATEGORIES.find((c) => c.key === key)!;
