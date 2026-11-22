import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { COMPANY } from '../data/company';
import { Logo } from './logo';

export const NAV_LINKS: { path: string; label: string }[] = [
  { path: '/', label: 'Home' },
  { path: '/request', label: 'Request Service' },
  { path: '/areas', label: 'Service Areas' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/contact', label: 'Contact' },
];

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, Logo],
  host: {
    class: 'sticky top-0 z-40 block border-b border-slate-200/80 bg-white/90 backdrop-blur',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
  template: `
    <div class="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
      <a routerLink="/" class="rounded-md" (click)="menuOpen.set(false)">
        <app-logo />
        <span class="sr-only">{{ company.name }} home</span>
      </a>

      <nav aria-label="Main" class="hidden lg:block">
        <ul class="flex items-center gap-1">
          @for (link of links; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-frost-50 text-navy-900"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                ariaCurrentWhenActive="page"
                class="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-frost-50 hover:text-navy-900"
                >{{ link.label }}</a
              >
            </li>
          }
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <a [href]="company.phoneHref" class="btn-primary px-4! py-2! text-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4 fill-current">
            <path
              d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
            />
          </svg>
          <span
            >Call now<span class="sr-only">: {{ company.phoneDisplay }}</span></span
          >
        </a>
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-frost-50 lg:hidden"
          aria-controls="mobile-nav"
          [attr.aria-expanded]="menuOpen()"
          (click)="menuOpen.update((open) => !open)"
        >
          <span class="sr-only">{{ menuOpen() ? 'Close menu' : 'Open menu' }}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="size-6 stroke-current"
            fill="none"
            stroke-width="2"
          >
            @if (menuOpen()) {
              <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            } @else {
              <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
            }
          </svg>
        </button>
      </div>
    </div>

    <nav
      id="mobile-nav"
      aria-label="Mobile"
      class="border-t border-slate-200 bg-white lg:hidden"
      [hidden]="!menuOpen()"
    >
      <ul class="container-page flex flex-col gap-1 py-3">
        @for (link of links; track link.path) {
          <li>
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-frost-50 text-navy-900"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              ariaCurrentWhenActive="page"
              class="block rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-frost-50"
              (click)="menuOpen.set(false)"
              >{{ link.label }}</a
            >
          </li>
        }
      </ul>
    </nav>
  `,
})
export class SiteHeader {
  protected readonly company = COMPANY;
  protected readonly links = NAV_LINKS;
  protected readonly menuOpen = signal(false);
}
