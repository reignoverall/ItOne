import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { COMPANY } from '../../data/company';
import { ErrorState, FieldError } from '../../shared/field-error';
import { notBlank } from '../../shared/validators';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

const emptyMessage = (): ContactMessage => ({ name: '', email: '', message: '' });

@Component({
  imports: [FormField, FieldError],
  template: `
    <section class="bg-navy-900 py-14 text-white lg:py-16">
      <div class="container-page">
        <p class="font-semibold text-sky-400">Contact</p>
        <h1 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Contact Us</h1>
        <p class="mt-4 max-w-2xl text-lg text-slate-200">
          Questions about a quote, a maintenance plan or your last visit? We’re happy to help.
        </p>
      </div>
    </section>

    <div class="container-page grid gap-10 py-12 lg:grid-cols-[22rem_1fr] lg:py-16">
      <ul class="grid gap-4 self-start sm:grid-cols-2 lg:grid-cols-1">
        <li class="rounded-2xl bg-frost-50 p-6">
          <h2 class="text-sm font-semibold tracking-wider text-ember-600 uppercase">Call</h2>
          <a
            [href]="company.phoneHref"
            class="mt-1 block text-xl font-bold text-navy-900 hover:underline"
            >{{ company.phoneDisplay }}</a
          >
          <p class="mt-1 text-sm text-slate-600">Answered 24/7 for emergencies</p>
        </li>
        <li class="rounded-2xl bg-frost-50 p-6">
          <h2 class="text-sm font-semibold tracking-wider text-ember-600 uppercase">Email</h2>
          <a
            [href]="'mailto:' + company.email"
            class="mt-1 block font-bold break-all text-navy-900 hover:underline"
            >{{ company.email }}</a
          >
        </li>
        <li class="rounded-2xl bg-frost-50 p-6">
          <h2 class="text-sm font-semibold tracking-wider text-ember-600 uppercase">Visit</h2>
          <p class="mt-1 font-bold text-navy-900">{{ company.address }}</p>
        </li>
        <li class="rounded-2xl bg-frost-50 p-6">
          <h2 class="text-sm font-semibold tracking-wider text-ember-600 uppercase">Hours</h2>
          <ul class="mt-1 space-y-1 text-navy-900">
            @for (line of company.hours; track line) {
              <li>{{ line }}</li>
            }
          </ul>
        </li>
      </ul>

      @if (sent(); as done) {
        <section
          class="self-start rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
          aria-labelledby="sent-heading"
        >
          <h2
            #sentHeading
            id="sent-heading"
            tabindex="-1"
            class="text-2xl font-bold text-navy-900 focus:outline-none"
          >
            Message sent
          </h2>
          <p class="mt-2 text-slate-600">
            Thanks, {{ done.name }} — we’ll get back to you within one business day.
          </p>
          <button type="button" class="btn-primary mt-6" (click)="reset()">
            Send another message
          </button>
        </section>
      } @else {
        <form
          #formEl
          novalidate
          class="space-y-5 self-start rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
          (submit)="onSubmit($event)"
        >
          <h2 class="text-xl font-bold text-navy-900">Send us a message</h2>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="contact-name" class="text-sm font-medium text-slate-700">Name</label>
              <input
                id="contact-name"
                autocomplete="name"
                class="field-input"
                [formField]="f.name"
                [attr.aria-invalid]="bad(f.name())"
                aria-describedby="contact-name-error"
              />
              <app-field-error id="contact-name-error" [state]="f.name()" />
            </div>
            <div>
              <label for="contact-email" class="text-sm font-medium text-slate-700">Email</label>
              <input
                id="contact-email"
                type="email"
                autocomplete="email"
                class="field-input"
                [formField]="f.email"
                [attr.aria-invalid]="bad(f.email())"
                aria-describedby="contact-email-error"
              />
              <app-field-error id="contact-email-error" [state]="f.email()" />
            </div>
          </div>
          <div>
            <label for="contact-message" class="text-sm font-medium text-slate-700">Message</label>
            <textarea
              id="contact-message"
              rows="6"
              class="field-input"
              [formField]="f.message"
              [attr.aria-invalid]="bad(f.message())"
              aria-describedby="contact-message-error"
            ></textarea>
            <app-field-error id="contact-message-error" [state]="f.message()" />
          </div>
          <button type="submit" class="btn-primary" [disabled]="f().submitting()">
            Send message
          </button>
        </form>
      }
    </div>
  `,
})
export default class ContactPage {
  private readonly injector = inject(Injector);
  private readonly formEl = viewChild<ElementRef<HTMLFormElement>>('formEl');
  private readonly sentHeading = viewChild<ElementRef<HTMLElement>>('sentHeading');

  protected readonly company = COMPANY;
  protected readonly model = signal<ContactMessage>(emptyMessage());
  protected readonly f = form(this.model, (p) => {
    required(p.name, { message: 'Please enter your name.' });
    notBlank(p.name, 'Please enter your name.');
    required(p.email, { message: 'Please enter a valid email address.' });
    email(p.email, { message: 'Please enter a valid email address.' });
    required(p.message, { message: 'Please enter a message (at least 10 characters).' });
    notBlank(p.message, 'Please enter a message (at least 10 characters).');
    minLength(p.message, 10, { message: 'Please enter a message (at least 10 characters).' });
  });
  protected readonly sent = signal<{ name: string } | null>(null);

  protected bad(state: ErrorState): boolean {
    return state.touched() && state.invalid();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const ok = await submit(this.f, async () => {
      this.sent.set({ name: this.model().name.trim() });
      return undefined;
    });
    afterNextRender(
      () => {
        if (ok) {
          this.sentHeading()?.nativeElement.focus();
        } else {
          this.formEl()?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
        }
      },
      { injector: this.injector },
    );
  }

  protected reset(): void {
    this.model.set(emptyMessage());
    this.f().reset();
    this.sent.set(null);
  }
}
