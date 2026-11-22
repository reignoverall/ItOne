import { ServiceId } from './services';

export type Stars = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: number;
  name: string;
  town: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  rating: Stars;
  service: ServiceId;
  text: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  byStars: Record<Stars, number>;
}

/** Sample reviews written for the demo — not real customers. */
export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Dana R.',
    town: 'Pine Valley',
    date: '2026-11-08',
    rating: 5,
    service: 'emergency',
    text: 'Our furnace died at 11pm with single-digit temps outside. A tech was here within the hour and had us warm again before midnight. Can’t thank them enough.',
  },
  {
    id: 2,
    name: 'Marcus T.',
    town: 'Cedar Falls',
    date: '2026-10-21',
    rating: 5,
    service: 'installation',
    text: 'They walked us through three system options with honest pricing, no pressure. Install crew was clean, on time and our energy bill dropped noticeably.',
  },
  {
    id: 3,
    name: 'Priya S.',
    town: 'Ridgeline',
    date: '2026-09-30',
    rating: 5,
    service: 'maintenance',
    text: 'The maintenance plan is worth it. They remind me before each tune-up and I got bumped to the front of the line when the AC acted up in July.',
  },
  {
    id: 4,
    name: 'Tom & Elise W.',
    town: 'Willow Creek',
    date: '2026-08-14',
    rating: 4,
    service: 'ac-repair',
    text: 'AC fixed same day. Technician explained what failed and why. Arrival window was a bit later than quoted, but they called ahead to let us know.',
  },
  {
    id: 5,
    name: 'Grace L.',
    town: 'Maple Hollow',
    date: '2026-07-29',
    rating: 5,
    service: 'ac-repair',
    text: 'Middle of a heatwave and they still fit us in that afternoon. Fair price, friendly tech, and he put on shoe covers without being asked.',
  },
  {
    id: 6,
    name: 'Kevin O.',
    town: 'Brookstone',
    date: '2026-06-12',
    rating: 5,
    service: 'air-quality',
    text: 'Our daughter has allergies and the whole-home filter they recommended has made a real difference. They didn’t upsell anything we didn’t need.',
  },
  {
    id: 7,
    name: 'Sofia M.',
    town: 'Stonebridge',
    date: '2026-03-03',
    rating: 5,
    service: 'heating',
    text: 'Heat pump wasn’t keeping up. Turned out to be a refrigerant leak another company missed twice. Fixed properly the first time.',
  },
  {
    id: 8,
    name: 'Ben H.',
    town: 'Aspen Grove',
    date: '2026-02-17',
    rating: 3,
    service: 'heating',
    text: 'Repair itself was solid, but I had to reschedule once because a part was back-ordered. Office staff were apologetic and gave a discount.',
  },
  {
    id: 9,
    name: 'Alicia P.',
    town: 'Harbor Point',
    date: '2026-01-25',
    rating: 5,
    service: 'emergency',
    text: 'Pipes were at risk when our boiler quit on a Sunday. Real person answered the phone, tech arrived fast, problem solved. Lifesavers.',
  },
  {
    id: 10,
    name: 'Ray C.',
    town: 'Pine Valley',
    date: '2025-12-09',
    rating: 5,
    service: 'installation',
    text: 'Replaced a 25-year-old furnace. Quote matched the final bill to the dollar and they handled the rebate paperwork for us.',
  },
  {
    id: 11,
    name: 'Hannah J.',
    town: 'Ridgeline',
    date: '2025-11-18',
    rating: 4,
    service: 'maintenance',
    text: 'Thorough fall tune-up and a clear checklist of what they inspected. Would love evening appointment slots, but otherwise great.',
  },
  {
    id: 12,
    name: 'Luis G.',
    town: 'Cedar Falls',
    date: '2025-10-02',
    rating: 5,
    service: 'air-quality',
    text: 'Duct cleaning plus a humidifier install. House feels less dusty and the dry winter air is finally manageable.',
  },
];

export function ratingSummary(reviews: Review[]): RatingSummary {
  const byStars: Record<Stars, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  for (const review of reviews) {
    byStars[review.rating]++;
    total += review.rating;
  }
  const average = reviews.length ? Math.round((total / reviews.length) * 10) / 10 : 0;
  return { average, count: reviews.length, byStars };
}

export function filterReviews(reviews: Review[], service: ServiceId | 'all'): Review[] {
  return reviews
    .filter((r) => service === 'all' || r.service === service)
    .sort((a, b) => b.date.localeCompare(a.date));
}
