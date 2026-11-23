import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findAreaByZip, ZipLookup } from '../../data/areas';

@Component({
  selector: 'app-zip-checker',
  imports: [RouterLink],
  host: { class: 'block' },
  template: `
    <form
      class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8"
      (submit)="check($event)"
      novalidate
    >
      <h2 class="text-xl font-bold text-navy-900">Do we serve you?</h2>
      <label for="zip" class="mt-4 block text-sm font-medium text-slate-700">
        Enter your ZIP code
      </label>
      <div class="mt-1 flex flex-col gap-3 sm:flex-row">
        <input
          id="zip"
          name="zip"
          type="text"
          inputmode="numeric"
          autocomplete="postal-code"
          maxlength="10"
          placeholder="e.g. 80512"
          class="field-input mt-0! flex-1"
          [value]="zip()"
          (input)="zip.set($any($event.target).value)"
        />
        <button type="submit" class="btn-primary">Check</button>
      </div>
      <div aria-live="polite" class="mt-4 min-h-6">
        @switch (result()?.status) {
          @case ('served') {
            <p class="flex flex-wrap items-center gap-x-2 font-medium text-emerald-800">
              Good news — we serve {{ servedTown() }}!
              <a routerLink="/request" class="font-semibold text-navy-800 underline"
                >Request service</a
              >
            </p>
          }
          @case ('not-served') {
            <p class="text-slate-700">
              We don’t currently serve that ZIP, but call us — we may still be able to help.
            </p>
          }
          @case ('invalid') {
            <p class="text-red-700">Please enter a 5-digit ZIP code.</p>
          }
        }
      </div>
    </form>
  `,
})
export class ZipChecker {
  protected readonly zip = signal('');
  protected readonly result = signal<ZipLookup | null>(null);

  protected check(event: Event): void {
    event.preventDefault();
    this.result.set(findAreaByZip(this.zip()));
  }

  protected servedTown(): string {
    const r = this.result();
    return r?.status === 'served' ? r.area.town : '';
  }
}
