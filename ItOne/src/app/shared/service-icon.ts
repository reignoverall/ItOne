import { Component, input } from '@angular/core';

@Component({
  selector: 'app-service-icon',
  host: { class: 'inline-block' },
  template: `
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      class="size-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
})
export class ServiceIcon {
  readonly path = input.required<string>();
}
