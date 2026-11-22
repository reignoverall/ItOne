import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  host: {
    role: 'img',
    class: 'inline-flex gap-0.5',
    '[attr.aria-label]': 'label()',
  },
  template: `
    @for (filled of stars(); track $index) {
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        class="size-full"
        [class.fill-ember-500]="filled"
        [class.fill-slate-300]="!filled"
      >
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
      </svg>
    }
  `,
})
export class StarRating {
  readonly rating = input.required<number>();
  protected readonly stars = computed(() =>
    [1, 2, 3, 4, 5].map((n) => n <= Math.round(this.rating())),
  );
  protected readonly label = computed(() => `${this.rating()} out of 5 stars`);
}
