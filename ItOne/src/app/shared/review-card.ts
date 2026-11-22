import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Review } from '../data/reviews';
import { SERVICES } from '../data/services';
import { StarRating } from './star-rating';

@Component({
  selector: 'app-review-card',
  imports: [StarRating, DatePipe],
  host: { class: 'block h-full' },
  template: `
    <figure
      class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition motion-safe:hover:-translate-y-1 hover:shadow-md"
    >
      <div class="flex items-center justify-between gap-3">
        <app-star-rating class="h-5" [rating]="review().rating" />
        <span class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-navy-800">
          {{ serviceName() }}
        </span>
      </div>
      <blockquote class="mt-4 flex-1 text-slate-700">
        <p>“{{ review().text }}”</p>
      </blockquote>
      <figcaption class="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span
          aria-hidden="true"
          class="flex size-10 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white"
          >{{ initials() }}</span
        >
        <span class="text-sm">
          <span class="block font-semibold text-navy-900">{{ review().name }}</span>
          <span class="text-slate-600"
            >{{ review().town }} · {{ review().date | date: 'MMMM y' }}</span
          >
        </span>
      </figcaption>
    </figure>
  `,
})
export class ReviewCard {
  readonly review = input.required<Review>();
  protected readonly serviceName = computed(
    () => SERVICES.find((s) => s.id === this.review().service)?.name ?? '',
  );
  protected readonly initials = computed(() =>
    this.review()
      .name.split(/\s+/)
      .map((part) => part[0])
      .filter((c) => /[A-Za-z]/.test(c))
      .slice(0, 2)
      .join(''),
  );
}
