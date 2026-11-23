import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { COMPANY } from '../../data/company';
import { SERVICES } from '../../data/services';
import { TODAY } from '../../data/today';
import { ErrorState, FieldError } from '../../shared/field-error';
import { emptyRequest, isoDate, requestSchema, ServiceRequest } from './request-form';

const NEXT_STEPS = [
  'We confirm your appointment by phone or text within 30 minutes during business hours.',
  'Your technician calls when they’re on the way, with an arrival time.',
  'You get an upfront, flat-rate quote before any work begins.',
];

const WINDOW_LABELS = {
  morning: 'morning (8am–12pm)',
  afternoon: 'afternoon (12pm–4pm)',
  evening: 'evening (4pm–7pm)',
} as const;

@Component({
  imports: [FormField, FieldError],
  template: `
    <section class="bg-navy-900 py-14 text-white lg:py-16">
      <div class="container-page">
        <p class="font-semibold text-sky-400">Request Service</p>
        <h1 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Book a technician in two minutes
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-slate-200">
          Tell us what’s going on and when works for you. Emergency? Call
          <a [href]="company.phoneHref" class="font-semibold text-white underline">{{
            company.phoneDisplay
          }}</a>
          — we answer 24/7.
        </p>
      </div>
    </section>

    <div class="container-page grid gap-10 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
      @if (submitted(); as done) {
        <section
          class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
          aria-labelledby="done-heading"
        >
          <div
            aria-hidden="true"
            class="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700"
          >
            ✓
          </div>
          <h2
            #doneHeading
            id="done-heading"
            tabindex="-1"
            class="mt-5 text-2xl font-bold text-navy-900 focus:outline-none"
          >
            Thanks, {{ done.data.name }}! Your request is in.
          </h2>
          <p class="mt-2 text-slate-600">
            Reference <span class="font-mono font-semibold text-navy-900">{{ done.ref }}</span>.
            We’ll reach you at {{ done.data.phone }} shortly.
          </p>
          @if (done.data.urgency === 'emergency') {
            <p class="mt-4 rounded-xl bg-ember-100 p-4 font-medium text-navy-900">
              For emergencies, call {{ company.phoneDisplay }} now.
            </p>
          }
          <dl class="mt-6 grid gap-4 rounded-xl bg-frost-50 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-slate-600">Service</dt>
              <dd class="font-semibold text-navy-900">{{ serviceName(done.data) }}</dd>
            </div>
            <div>
              <dt class="text-slate-600">When</dt>
              <dd class="font-semibold text-navy-900">{{ whenText(done.data) }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-slate-600">Address</dt>
              <dd class="font-semibold text-navy-900">
                {{ done.data.address }}, {{ done.data.zip }}
              </dd>
            </div>
          </dl>
          <button type="button" class="btn-primary mt-8" (click)="reset()">
            Submit another request
          </button>
        </section>
      } @else {
        <form
          #formEl
          novalidate
          class="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
          (submit)="onSubmit($event)"
        >
          <fieldset class="space-y-5">
            <legend class="text-lg font-bold text-navy-900">Your details</legend>
            <div class="grid gap-5 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="req-name" class="text-sm font-medium text-slate-700">Full name</label>
                <input
                  id="req-name"
                  autocomplete="name"
                  class="field-input"
                  [formField]="f.name"
                  [attr.aria-invalid]="bad(f.name())"
                  aria-describedby="req-name-error"
                />
                <app-field-error id="req-name-error" [state]="f.name()" />
              </div>
              <div>
                <label for="req-phone" class="text-sm font-medium text-slate-700">Phone</label>
                <input
                  id="req-phone"
                  type="tel"
                  autocomplete="tel"
                  class="field-input"
                  [formField]="f.phone"
                  [attr.aria-invalid]="bad(f.phone())"
                  aria-describedby="req-phone-error"
                />
                <app-field-error id="req-phone-error" [state]="f.phone()" />
              </div>
              <div>
                <label for="req-email" class="text-sm font-medium text-slate-700">Email</label>
                <input
                  id="req-email"
                  type="email"
                  autocomplete="email"
                  class="field-input"
                  [formField]="f.email"
                  [attr.aria-invalid]="bad(f.email())"
                  aria-describedby="req-email-error"
                />
                <app-field-error id="req-email-error" [state]="f.email()" />
              </div>
              <div>
                <label for="req-address" class="text-sm font-medium text-slate-700"
                  >Service address</label
                >
                <input
                  id="req-address"
                  autocomplete="street-address"
                  class="field-input"
                  [formField]="f.address"
                  [attr.aria-invalid]="bad(f.address())"
                  aria-describedby="req-address-error"
                />
                <app-field-error id="req-address-error" [state]="f.address()" />
              </div>
              <div>
                <label for="req-zip" class="text-sm font-medium text-slate-700">ZIP code</label>
                <input
                  id="req-zip"
                  inputmode="numeric"
                  autocomplete="postal-code"
                  class="field-input"
                  [formField]="f.zip"
                  [attr.aria-invalid]="bad(f.zip())"
                  aria-describedby="req-zip-error"
                />
                <app-field-error id="req-zip-error" [state]="f.zip()" />
              </div>
            </div>
          </fieldset>

          <fieldset class="space-y-5">
            <legend class="text-lg font-bold text-navy-900">What do you need?</legend>
            <div>
              <label for="req-service" class="text-sm font-medium text-slate-700">Service</label>
              <select
                id="req-service"
                class="field-input"
                [formField]="f.service"
                [attr.aria-invalid]="bad(f.service())"
                aria-describedby="req-service-error"
              >
                <option value="">Choose a service…</option>
                @for (service of services; track service.id) {
                  <option [value]="service.id">{{ service.name }}</option>
                }
              </select>
              <app-field-error id="req-service-error" [state]="f.service()" />
            </div>

            <fieldset>
              <legend class="text-sm font-medium text-slate-700">How urgent is it?</legend>
              <div class="mt-2 grid gap-3 sm:grid-cols-3">
                @for (option of urgencyOptions; track option.value) {
                  <label
                    class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 p-4 has-checked:border-navy-800 has-checked:bg-frost-50 has-checked:ring-1 has-checked:ring-navy-800"
                  >
                    <input
                      type="radio"
                      class="mt-1 accent-navy-800"
                      [id]="'req-urgency-' + option.value"
                      [value]="option.value"
                      [formField]="f.urgency"
                    />
                    <span>
                      <span class="block font-semibold text-navy-900">{{ option.label }}</span>
                      <span class="text-sm text-slate-600">{{ option.hint }}</span>
                    </span>
                  </label>
                }
              </div>
            </fieldset>

            @if (model().urgency === 'emergency') {
              <p class="rounded-xl bg-ember-100 p-4 text-navy-900" role="note">
                <strong>No heat, no cooling, or a safety concern?</strong> Call
                <a [href]="company.phoneHref" class="font-semibold underline">{{
                  company.phoneDisplay
                }}</a>
                for the fastest response — a technician is on call right now.
              </p>
            }

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="req-date" class="text-sm font-medium text-slate-700"
                  >Preferred date
                  @if (model().urgency === 'emergency') {
                    <span class="font-normal text-slate-600">(optional)</span>
                  }
                </label>
                <input
                  id="req-date"
                  type="date"
                  class="field-input"
                  [attr.min]="minDate"
                  [formField]="f.preferredDate"
                  [attr.aria-invalid]="bad(f.preferredDate())"
                  aria-describedby="req-date-error"
                />
                <app-field-error id="req-date-error" [state]="f.preferredDate()" />
              </div>
              <div>
                <label for="req-window" class="text-sm font-medium text-slate-700"
                  >Time window</label
                >
                <select id="req-window" class="field-input" [formField]="f.timeWindow">
                  <option value="morning">Morning (8am–12pm)</option>
                  <option value="afternoon">Afternoon (12pm–4pm)</option>
                  <option value="evening">Evening (4pm–7pm)</option>
                </select>
              </div>
            </div>

            <div>
              <label for="req-details" class="text-sm font-medium text-slate-700"
                >Describe the problem</label
              >
              <textarea
                id="req-details"
                rows="4"
                class="field-input"
                placeholder="e.g. Furnace runs but only blows cold air; started last night."
                [formField]="f.details"
                [attr.aria-invalid]="bad(f.details())"
                aria-describedby="req-details-error"
              ></textarea>
              <app-field-error id="req-details-error" [state]="f.details()" />
            </div>
          </fieldset>

          <div
            class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center"
          >
            <button type="submit" class="btn-primary text-lg" [disabled]="f().submitting()">
              Send request
            </button>
            <p class="text-sm text-slate-600">We never share your information.</p>
          </div>
        </form>
      }

      <aside class="space-y-6">
        <div class="rounded-2xl bg-navy-900 p-6 text-white">
          <h2 class="text-lg font-bold">Prefer to talk?</h2>
          <a [href]="company.phoneHref" class="mt-2 block text-2xl font-extrabold text-ember-500">{{
            company.phoneDisplay
          }}</a>
          <ul class="mt-4 space-y-1 text-sm text-slate-300">
            @for (line of company.hours; track line) {
              <li>{{ line }}</li>
            }
          </ul>
        </div>
        <div class="rounded-2xl border border-slate-200 p-6">
          <h2 class="text-lg font-bold text-navy-900">What happens next</h2>
          <ol class="mt-4 space-y-4">
            @for (step of nextSteps; track $index) {
              <li class="flex gap-3 text-sm text-slate-700">
                <span
                  aria-hidden="true"
                  class="flex size-7 shrink-0 items-center justify-center rounded-full bg-ember-100 font-bold text-ember-600"
                  >{{ $index + 1 }}</span
                >
                {{ step }}
              </li>
            }
          </ol>
        </div>
      </aside>
    </div>
  `,
})
export default class RequestPage {
  private readonly today = inject(TODAY);
  private readonly injector = inject(Injector);
  private readonly formEl = viewChild<ElementRef<HTMLFormElement>>('formEl');
  private readonly doneHeading = viewChild<ElementRef<HTMLElement>>('doneHeading');

  protected readonly company = COMPANY;
  protected readonly services = SERVICES;
  protected readonly nextSteps = NEXT_STEPS;
  protected readonly urgencyOptions = [
    { value: 'emergency', label: 'Emergency', hint: 'No heat/AC or unsafe' },
    { value: 'this-week', label: 'This week', hint: 'Needs attention soon' },
    { value: 'flexible', label: 'Flexible', hint: 'Tune-up or quote' },
  ] as const;
  protected readonly minDate = isoDate(this.today());

  protected readonly model = signal<ServiceRequest>(emptyRequest());
  protected readonly f = form(this.model, requestSchema(this.today));
  protected readonly submitted = signal<{ ref: string; data: ServiceRequest } | null>(null);

  protected bad(state: ErrorState): boolean {
    return state.touched() && state.invalid();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const ok = await submit(this.f, async () => {
      const ref = 'SA-' + String(Math.floor(100000 + Math.random() * 900000));
      this.submitted.set({ ref, data: { ...this.model() } });
      return undefined;
    });
    afterNextRender(
      () => {
        if (ok) {
          this.doneHeading()?.nativeElement.focus();
        } else {
          this.formEl()?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
        }
      },
      { injector: this.injector },
    );
  }

  protected reset(): void {
    this.model.set(emptyRequest());
    this.f().reset();
    this.submitted.set(null);
  }

  protected serviceName(data: ServiceRequest): string {
    return SERVICES.find((s) => s.id === data.service)?.name ?? '';
  }

  protected whenText(data: ServiceRequest): string {
    if (!data.preferredDate) return 'As soon as possible';
    return `${data.preferredDate}, ${WINDOW_LABELS[data.timeWindow]}`;
  }
}
