import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICE_AREAS } from '../../data/areas';
import { COMPANY } from '../../data/company';
import { filterReviews, ratingSummary, REVIEWS } from '../../data/reviews';
import { SERVICES } from '../../data/services';
import { ReviewCard } from '../../shared/review-card';
import { ServiceIcon } from '../../shared/service-icon';
import { StarRating } from '../../shared/star-rating';

const CHECK =
  '<svg aria-hidden="true" viewBox="0 0 20 20" class="size-5 shrink-0 fill-sky-400"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5.6L5.7 9.1l1.4-1.4L9 9.6l3.9-3.9 1.4 1.4z"/></svg>';

const WHY_US = [
  {
    title: 'Upfront pricing',
    text: 'You approve a flat-rate quote before any work starts. No overtime surprises.',
  },
  {
    title: 'Same-day service',
    text: 'Call before noon and we’ll be there today — evenings and weekends included.',
  },
  {
    title: 'Certified technicians',
    text: 'NATE-certified, background-checked techs who treat your home like their own.',
  },
  {
    title: '100% satisfaction guarantee',
    text: 'If you’re not happy, we’ll make it right — or your service call is free.',
  },
];

@Component({
  imports: [RouterLink, ReviewCard, ServiceIcon, StarRating],
  template: `
    <!-- Hero -->
    <section
      class="relative isolate overflow-hidden bg-navy-900 text-white"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-ember-500)_0%,transparent_45%),radial-gradient(ellipse_at_bottom_left,var(--color-sky-400)_0%,transparent_50%)] opacity-35"
      ></div>
      <div class="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-sky-100 ring-1 ring-white/20"
          >
            <span class="relative flex size-2.5" aria-hidden="true">
              <span
                class="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping"
              ></span>
              <span class="relative inline-flex size-2.5 rounded-full bg-emerald-400"></span>
            </span>
            Technicians available today
          </p>
          <h1
            id="hero-heading"
            class="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Fast, honest heating &amp; cooling for Pine Valley and beyond
          </h1>
          <p class="mt-6 max-w-xl text-lg text-slate-200">
            {{ company.tagline }} Repairs, new systems and maintenance from a local team that shows
            up on time and quotes before it works.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a routerLink="/request" class="btn-primary text-lg">Request service</a>
            <a [href]="company.phoneHref" class="btn-secondary text-lg text-white">
              Call {{ company.phoneDisplay }}
            </a>
          </div>
          <ul class="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-200 sm:grid-cols-4">
            <li class="flex items-center gap-2">${CHECK} Licensed &amp; insured</li>
            <li class="flex items-center gap-2">${CHECK} 24/7 emergency</li>
            <li class="flex items-center gap-2">
              ${CHECK} {{ company.yearsInBusiness }} years in business
            </li>
            <li class="flex items-center gap-2">
              ${CHECK} {{ summary.average.toFixed(1) }}-star average
            </li>
          </ul>
        </div>

        <!-- Decorative thermostat card -->
        <div aria-hidden="true" class="relative mx-auto w-full max-w-sm">
          <div
            class="rounded-[2rem] bg-white/10 p-6 shadow-2xl ring-1 ring-white/20 backdrop-blur motion-safe:animate-[float_6s_ease-in-out_infinite]"
          >
            <div class="flex items-center justify-between text-sm text-slate-200">
              <span>Living room</span><span>Cooling</span>
            </div>
            <div class="my-8 flex justify-center">
              <div
                class="flex size-44 flex-col items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-navy-700 shadow-inner ring-8 ring-white/10"
              >
                <span class="text-6xl font-extralight">72°</span>
                <span class="text-xs tracking-widest text-sky-100 uppercase">Set to 72</span>
              </div>
            </div>
            <div class="rounded-2xl bg-white p-4 text-navy-900 shadow-lg">
              <p class="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Service update
              </p>
              <p class="mt-1 font-semibold">Technician en route · 18 min</p>
              <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div class="h-full w-2/3 rounded-full bg-ember-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="bg-frost-50 py-20" aria-labelledby="services-heading">
      <div class="container-page">
        <div class="max-w-2xl">
          <p class="font-semibold text-ember-600">What we do</p>
          <h2
            id="services-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl"
          >
            Everything your home’s comfort needs
          </h2>
        </div>
        <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (service of services; track service.id) {
            <li
              data-testid="service-card"
              class="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg motion-safe:hover:-translate-y-1"
            >
              <app-service-icon
                class="size-12 rounded-xl bg-navy-900 p-2.5 text-sky-400 transition group-hover:bg-ember-500 group-hover:text-navy-900"
                [path]="service.icon"
              />
              <h3 class="mt-5 text-lg font-semibold text-navy-900">{{ service.name }}</h3>
              <p class="mt-2 text-slate-600">{{ service.summary }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- Why us -->
    <section class="py-20" aria-labelledby="why-heading">
      <div class="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p class="font-semibold text-ember-600">Why Summit Air</p>
          <h2
            id="why-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl"
          >
            The HVAC company your neighbors recommend
          </h2>
          <p class="mt-4 text-lg text-slate-600">
            For {{ company.yearsInBusiness }} years we’ve kept families comfortable with straight
            answers, fair prices and work we stand behind.
          </p>
        </div>
        <dl class="grid gap-6 sm:grid-cols-2">
          @for (point of whyUs; track point.title) {
            <div class="rounded-2xl border border-slate-200 p-6">
              <dt class="flex items-center gap-3 font-semibold text-navy-900">
                <span
                  aria-hidden="true"
                  class="flex size-8 items-center justify-center rounded-full bg-ember-100 text-ember-600"
                  >✓</span
                >
                {{ point.title }}
              </dt>
              <dd class="mt-2 text-slate-600">{{ point.text }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>

    <!-- Reviews preview -->
    <section class="bg-frost-50 py-20" aria-labelledby="reviews-heading">
      <div class="container-page">
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p class="font-semibold text-ember-600">Reviews</p>
            <h2
              id="reviews-heading"
              class="mt-2 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl"
            >
              Rated {{ summary.average.toFixed(1) }} by {{ summary.count }} local homeowners
            </h2>
            <app-star-rating class="mt-3 h-6" [rating]="summary.average" />
          </div>
          <a
            routerLink="/reviews"
            class="font-semibold text-navy-800 underline-offset-4 hover:underline"
          >
            Read all reviews <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul class="mt-10 grid gap-6 md:grid-cols-3">
          @for (review of featuredReviews; track review.id) {
            <li><app-review-card [review]="review" /></li>
          }
        </ul>
      </div>
    </section>

    <!-- Areas preview -->
    <section class="py-20" aria-labelledby="areas-heading">
      <div class="container-page text-center">
        <p class="font-semibold text-ember-600">Service areas</p>
        <h2
          id="areas-heading"
          class="mt-2 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl"
        >
          Proudly serving the whole valley
        </h2>
        <ul class="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          @for (area of areas; track area.town) {
            <li class="rounded-full bg-sky-100 px-4 py-2 font-medium text-navy-800">
              {{ area.town }}
            </li>
          }
        </ul>
        <a
          routerLink="/areas"
          class="mt-8 inline-block font-semibold text-navy-800 underline-offset-4 hover:underline"
        >
          Check your ZIP code <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <!-- CTA band -->
    <section class="bg-ember-500" aria-labelledby="cta-heading">
      <div
        class="container-page flex flex-col items-center justify-between gap-6 py-14 text-center lg:flex-row lg:text-left"
      >
        <div>
          <h2 id="cta-heading" class="text-3xl font-bold tracking-tight text-navy-950">
            Too hot? Too cold? Let’s fix that today.
          </h2>
          <p class="mt-2 text-lg text-navy-900">Book online in two minutes or call us any time.</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            routerLink="/request"
            class="inline-flex items-center justify-center rounded-full bg-navy-900 px-6 py-3 font-semibold text-white transition hover:bg-navy-700 focus-visible:outline-navy-950"
            >Request service</a
          >
          <a
            [href]="company.phoneHref"
            class="btn-secondary text-navy-950 hover:bg-navy-900/10 focus-visible:outline-navy-950"
          >
            {{ company.phoneDisplay }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export default class HomePage {
  protected readonly company = COMPANY;
  protected readonly services = SERVICES;
  protected readonly areas = SERVICE_AREAS;
  protected readonly whyUs = WHY_US;
  protected readonly summary = ratingSummary(REVIEWS);
  protected readonly featuredReviews = filterReviews(REVIEWS, 'all')
    .filter((r) => r.rating === 5)
    .slice(0, 3);
}
