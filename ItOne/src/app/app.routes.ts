import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Summit Air | Home', loadComponent: () => import('./pages/home/home-page') },
  {
    path: 'request',
    title: 'Summit Air | Request Service',
    loadComponent: () => import('./pages/request/request-page'),
  },
  {
    path: 'areas',
    title: 'Summit Air | Service Areas',
    loadComponent: () => import('./pages/areas/areas-page'),
  },
  {
    path: 'reviews',
    title: 'Summit Air | Reviews',
    loadComponent: () => import('./pages/reviews/reviews-page'),
  },
  {
    path: 'contact',
    title: 'Summit Air | Contact',
    loadComponent: () => import('./pages/contact/contact-page'),
  },
  { path: '**', redirectTo: '' },
];
