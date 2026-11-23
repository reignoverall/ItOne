import { filterReviews, ratingSummary, Review, REVIEWS } from './reviews';
import { SERVICES } from './services';

const fixtures: Review[] = [
  {
    id: 1,
    name: 'A',
    town: 'Ridgeline',
    date: '2026-01-10',
    rating: 5,
    service: 'heating',
    text: 'x',
  },
  {
    id: 2,
    name: 'B',
    town: 'Ridgeline',
    date: '2026-03-02',
    rating: 4,
    service: 'ac-repair',
    text: 'x',
  },
  {
    id: 3,
    name: 'C',
    town: 'Ridgeline',
    date: '2026-02-15',
    rating: 5,
    service: 'heating',
    text: 'x',
  },
];

describe('ratingSummary', () => {
  it('computes average, count and star breakdown', () => {
    expect(ratingSummary(fixtures)).toEqual({
      average: 4.7,
      count: 3,
      byStars: { 5: 2, 4: 1, 3: 0, 2: 0, 1: 0 },
    });
  });

  it('handles no reviews', () => {
    expect(ratingSummary([])).toEqual({
      average: 0,
      count: 0,
      byStars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });
  });
});

describe('filterReviews', () => {
  it('returns only the chosen service, newest first', () => {
    expect(filterReviews(fixtures, 'heating').map((r) => r.id)).toEqual([3, 1]);
  });

  it('returns all reviews newest first for "all"', () => {
    expect(filterReviews(fixtures, 'all').map((r) => r.id)).toEqual([2, 3, 1]);
  });
});

describe('REVIEWS sample data', () => {
  it('covers every service', () => {
    for (const service of SERVICES) {
      expect(REVIEWS.some((r) => r.service === service.id)).toBe(true);
    }
  });
});
