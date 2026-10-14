import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.page'), title: 'Swatchbook — live UI patterns with prompts' },
  { path: 'cards', loadComponent: () => import('./pages/cards/cards.page'), title: 'Cards — Swatchbook' },
  { path: 'products', loadComponent: () => import('./pages/products/products.page'), title: 'Products — Swatchbook' },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.page'), title: 'Gallery — Swatchbook' },
  { path: 'typography', loadComponent: () => import('./pages/typography/typography.page'), title: 'Type & Blogs — Swatchbook' },
  { path: 'heroes', loadComponent: () => import('./pages/heroes/heroes.page'), title: 'Heroes — Swatchbook' },
  { path: '**', redirectTo: '' },
];
