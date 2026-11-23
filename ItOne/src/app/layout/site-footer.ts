import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY } from '../data/company';
import { Logo } from './logo';
import { NAV_LINKS } from './site-header';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, Logo],
  template: `
    <footer class="bg-navy-950 text-slate-300">
      <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-4">
          <app-logo [inverted]="true" />
          <p class="text-sm">{{ company.tagline }}</p>
        </div>
        <div>
          <h2 class="text-sm font-semibold tracking-wider text-white uppercase">Contact</h2>
          <ul class="mt-4 space-y-2 text-sm">
            <li>
              <a class="hover:text-white" [href]="company.phoneHref">{{ company.phoneDisplay }}</a>
            </li>
            <li>
              <a class="hover:text-white" [href]="'mailto:' + company.email">{{ company.email }}</a>
            </li>
            <li>{{ company.address }}</li>
          </ul>
        </div>
        <div>
          <h2 class="text-sm font-semibold tracking-wider text-white uppercase">Hours</h2>
          <ul class="mt-4 space-y-2 text-sm">
            @for (line of company.hours; track line) {
              <li>{{ line }}</li>
            }
          </ul>
        </div>
        <nav aria-label="Footer">
          <h2 class="text-sm font-semibold tracking-wider text-white uppercase">Explore</h2>
          <ul class="mt-4 space-y-2 text-sm">
            @for (link of links; track link.path) {
              <li>
                <a class="hover:text-white" [routerLink]="link.path">{{ link.label }}</a>
              </li>
            }
          </ul>
        </nav>
      </div>
      <div class="border-t border-white/10">
        <div
          class="container-page flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:justify-between"
        >
          <p>© {{ year }} {{ company.name }}. Licensed &amp; insured.</p>
          <p>Demo site — company, reviews and details are sample content.</p>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly company = COMPANY;
  protected readonly links = NAV_LINKS;
  protected readonly year = 2026;
}
