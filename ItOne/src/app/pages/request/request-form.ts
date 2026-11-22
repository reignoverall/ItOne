import {
  email,
  minLength,
  pattern,
  required,
  SchemaPathTree,
  validate,
} from '@angular/forms/signals';
import { ServiceId } from '../../data/services';

export type Urgency = 'emergency' | 'this-week' | 'flexible';
export type TimeWindow = 'morning' | 'afternoon' | 'evening';

export interface ServiceRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  zip: string;
  service: ServiceId | '';
  urgency: Urgency;
  preferredDate: string;
  timeWindow: TimeWindow;
  details: string;
}

export function emptyRequest(): ServiceRequest {
  return {
    name: '',
    phone: '',
    email: '',
    address: '',
    zip: '',
    service: '',
    urgency: 'this-week',
    preferredDate: '',
    timeWindow: 'morning',
    details: '',
  };
}

/** Local calendar date as yyyy-mm-dd (matches <input type="date"> values). */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function requestSchema(today: () => Date) {
  return (p: SchemaPathTree<ServiceRequest>) => {
    required(p.name, { message: 'Please enter your name.' });
    required(p.phone, { message: 'Please enter a 10-digit phone number.' });
    pattern(p.phone, /^\D*(\d\D*){10}$/, { message: 'Please enter a 10-digit phone number.' });
    required(p.email, { message: 'Please enter a valid email address.' });
    email(p.email, { message: 'Please enter a valid email address.' });
    required(p.address, { message: 'Please enter the service address.' });
    required(p.zip, { message: 'Please enter a 5-digit ZIP code.' });
    pattern(p.zip, /^\d{5}$/, { message: 'Please enter a 5-digit ZIP code.' });
    required(p.service, { message: 'Please choose a service.' });
    required(p.preferredDate, {
      message: 'Please pick a preferred date.',
      when: ({ valueOf }) => valueOf(p.urgency) !== 'emergency',
    });
    validate(p.preferredDate, ({ value }) =>
      value() && value() < isoDate(today())
        ? { kind: 'past-date', message: 'Please choose today or a later date.' }
        : null,
    );
    required(p.details, { message: 'Please describe the problem (at least 10 characters).' });
    minLength(p.details, 10, { message: 'Please describe the problem (at least 10 characters).' });
  };
}
