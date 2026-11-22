import { Component, computed, input, signal } from '@angular/core';
import { filterReviews, ratingSummary, Review, REVIEWS, Stars } from '../../data/reviews';
import { ServiceId, SERVICES } from '../../data/services';
import { ReviewCard } from '../../shared/review-card';
import { StarRating } from '../../shared/star-rating';

const STAR_ROWS: Stars[] = [5, 4, 3, 2, 1];

@Component({
  imports: [ReviewCard, StarRating],
  template: `
    <section class="bg-frost-50 py-16 lg:py-20">
      <div class="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p class="font-semibold text-ember-600">Reviews</p>
          <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
            Customer Reviews
          </h1>
          <p class="mt-4 max-w-xl text-lg text-slate-600">
            Real talk from homeowners across the valley about repairs, installs and those
            middle-of-the-night emergencies.
          </p>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div class="flex items-center gap-5">
            <p class="text-6xl font-extrabold text-navy-900">{{ summary().average.toFixed(1) }}</p>
            <div>
              <app-star-rating class="h-6" [rating]="summary().average" />
              <p class="mt-1 text-sm text-slate-600">Based on {{ summary().count }} reviews</p>
            </div>
          </div>
          <dl class="mt-6 space-y-2">
            @for (stars of starRows; track stars) {
              <div class="flex items-center gap-3 text-sm">
                <dt class="w-14 shrink-0 text-slate-700">
                  {{ stars }} star{{ stars === 1 ? '' : 's' }}
                </dt>
                <dd class="flex flex-1 items-center gap-3">
                  <span
                    aria-hidden="true"
                    class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"
                  >
                    <span
                      class="block h-full rounded-full bg-ember-500"
                      [style.width.%]="percent(stars)"
                    ></span>
                  </span>
                  <span class="w-6 text-right font-medium text-slate-700">{{
                    summary().byStars[stars]
                  }}</span>
                </dd>
              </div>
            }
          </dl>
        </div>
      </div>
    </section>

    <section class="py-14" aria-labelledby="list-heading">
      <div class="container-page">
        <h2 id="list-heading" class="sr-only">Review list</h2>
        <div role="group" aria-label="Filter reviews by service" class="flex flex-wrap gap-2">
          @for (option of filterOptions; track option.id) {
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium ring-1 transition"
              [class]="
                filter() === option.id
                  ? 'bg-navy-900 text-white ring-navy-900'
                  : 'bg-white text-slate-700 ring-slate-300 hover:ring-navy-700'
              "
              [attr.aria-pressed]="filter() === option.id"
              (click)="filter.set(option.id)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        <p class="mt-6 text-sm text-slate-600" aria-live="polite">
          Showing {{ visible().length }} review{{ visible().length === 1 ? '' : 's' }}
        </p>

        @if (visible().length) {
          <ul class="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (review of visible(); track review.id) {
              <li><app-review-card [review]="review" /></li>
            }
          </ul>
        } @else {
          <p
            class="mt-4 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600"
          >
            No reviews for this service yet.
          </p>
        }
      </div>
    </section>
  `,
})
export default class ReviewsPage {
  readonly reviews = input<Review[]>(REVIEWS);

  protected readonly starRows = STAR_ROWS;
  protected readonly filterOptions: { id: ServiceId | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    ...SERVICES.map((s) => ({ id: s.id, label: s.name })),
  ];
  protected readonly filter = signal<ServiceId | 'all'>('all');
  protected readonly summary = computed(() => ratingSummary(this.reviews()));
  protected readonly visible = computed(() => filterReviews(this.reviews(), this.filter()));

  protected percent(stars: Stars): number {
    const { count, byStars } = this.summary();
    return count ? (byStars[stars] / count) * 100 : 0;
  }
}
