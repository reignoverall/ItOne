import { Component, computed, input, Signal } from '@angular/core';

/** The slice of a Signal Forms field state this component reads. */
export interface ErrorState {
  touched: Signal<boolean>;
  invalid: Signal<boolean>;
  errors: Signal<readonly { message?: string }[]>;
}

/** Shows the first error of a touched, invalid field. Link it with aria-describedby. */
@Component({
  selector: 'app-field-error',
  host: { '[attr.id]': 'id()', class: 'block' },
  template: `
    @if (message(); as msg) {
      <p class="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
        <svg aria-hidden="true" viewBox="0 0 20 20" class="size-4 shrink-0 fill-current">
          <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 5h2v6H9zm0 8h2v2H9z" />
        </svg>
        {{ msg }}
      </p>
    }
  `,
})
export class FieldError {
  readonly state = input.required<ErrorState>();
  readonly id = input.required<string>();
  readonly message = computed(() => {
    const s = this.state();
    return s.touched() && s.invalid() ? (s.errors()[0]?.message ?? 'Please check this field.') : '';
  });
}
