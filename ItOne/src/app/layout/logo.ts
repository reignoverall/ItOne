import { Component, input } from '@angular/core';

/** Wordmark: mountain peak with a warm/cool split, plus the company name. */
@Component({
  selector: 'app-logo',
  host: { class: 'inline-flex items-center gap-2.5' },
  template: `
    <svg aria-hidden="true" viewBox="0 0 40 40" class="size-9 shrink-0">
      <rect width="40" height="40" rx="10" class="fill-navy-900" />
      <path d="M6 30 L17 12 L22 20 L25 16 L34 30 Z" class="fill-sky-400" />
      <path d="M17 12 L22 20 L19 24 L13 18.5 Z" class="fill-white" />
      <path d="M6 30 L13 18.5 L19 24 L14 30 Z" class="fill-ember-500" />
    </svg>
    <span
      class="flex flex-col leading-none"
      [class.text-white]="inverted()"
      [class.text-navy-900]="!inverted()"
    >
      <span class="text-lg font-extrabold tracking-tight">Summit Air</span>
      <span
        class="text-[0.65rem] font-semibold tracking-[0.18em] uppercase"
        [class.text-slate-300]="inverted()"
        [class.text-slate-600]="!inverted()"
        >Heating &amp; Cooling</span
      >
    </span>
  `,
})
export class Logo {
  readonly inverted = input(false);
}
