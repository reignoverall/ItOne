import { Component } from '@angular/core';
import { SERVICE_AREAS, ServiceArea } from '../../data/areas';
import { COMPANY } from '../../data/company';
import { ZipChecker } from './zip-checker';

const REGION_ORDER = ['Central', 'North', 'East', 'South', 'West'];

/** Decorative map pins (percent coordinates inside the map box). */
const PINS: { town: string; x: number; y: number }[] = [
  { town: 'Pine Valley', x: 48, y: 50 },
  { town: 'Ridgeline', x: 56, y: 42 },
  { town: 'Cedar Falls', x: 44, y: 18 },
  { town: 'Maple Hollow', x: 60, y: 24 },
  { town: 'Brookstone', x: 78, y: 44 },
  { town: 'Willow Creek', x: 84, y: 60 },
  { town: 'Stonebridge', x: 46, y: 80 },
  { town: 'Aspen Grove', x: 60, y: 74 },
  { town: 'Harbor Point', x: 16, y: 52 },
];

@Component({
  imports: [ZipChecker],
  template: `
    <section class="relative isolate overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--color-sky-400)_0%,transparent_55%)] opacity-30"
      ></div>
      <div class="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p class="font-semibold text-sky-400">Service Areas</p>
          <h1 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Local techs, minutes from your door
          </h1>
          <p class="mt-5 max-w-xl text-lg text-slate-200">
            We serve {{ areas.length }} communities across the valley with same-day appointments and
            24/7 emergency response. Not on the list? Call {{ company.phoneDisplay }} — we often
            travel a little further.
          </p>
        </div>
        <app-zip-checker class="text-slate-800" />
      </div>
    </section>

    <section class="py-16 lg:py-20" aria-labelledby="regions-heading">
      <div class="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 id="regions-heading" class="text-3xl font-bold tracking-tight text-navy-900">
            Towns we serve
          </h2>
          <div class="mt-8 grid gap-6 sm:grid-cols-2">
            @for (group of regions; track group.region) {
              <section
                class="rounded-2xl border border-slate-200 p-6"
                [attr.aria-labelledby]="'region-' + group.region"
              >
                <h3
                  [id]="'region-' + group.region"
                  class="text-sm font-semibold tracking-wider text-ember-600 uppercase"
                >
                  {{ group.region }}
                </h3>
                <ul class="mt-3 space-y-3">
                  @for (area of group.areas; track area.town) {
                    <li>
                      <span class="block font-semibold text-navy-900">{{ area.town }}</span>
                      <span class="text-sm text-slate-600">ZIP {{ area.zips.join(', ') }}</span>
                    </li>
                  }
                </ul>
              </section>
            }
          </div>
        </div>

        <div
          aria-hidden="true"
          class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-frost-50 ring-1 ring-slate-200 lg:sticky lg:top-28 lg:self-start"
        >
          <svg viewBox="0 0 400 300" class="absolute inset-0 size-full" preserveAspectRatio="none">
            <path
              d="M0 210 C80 180 120 240 200 205 S320 150 400 180 V300 H0Z"
              class="fill-sky-100"
            />
            <path
              d="M0 120 C90 100 140 140 220 110 S340 70 400 95"
              class="fill-none stroke-sky-400/60"
              stroke-width="6"
              stroke-linecap="round"
            />
            <path d="M40 0 L120 70 L170 30 L240 90 L300 40 L400 100 V0Z" class="fill-navy-900/10" />
          </svg>
          @for (pin of pins; track pin.town) {
            <div
              class="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              [style.left.%]="pin.x"
              [style.top.%]="pin.y"
            >
              <span
                class="rounded-full bg-white px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap text-navy-900 shadow"
                >{{ pin.town }}</span
              >
              <span class="mt-1 size-3 rounded-full bg-ember-500 ring-4 ring-ember-500/25"></span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export default class AreasPage {
  protected readonly company = COMPANY;
  protected readonly areas = SERVICE_AREAS;
  protected readonly pins = PINS;
  protected readonly regions: { region: string; areas: ServiceArea[] }[] = REGION_ORDER.map(
    (region) => ({ region, areas: SERVICE_AREAS.filter((a) => a.region === region) }),
  );
}
