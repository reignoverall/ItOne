import { TestBed } from '@angular/core/testing';
import { REVIEWS } from '../../data/reviews';
import ReviewsPage from './reviews-page';

describe('ReviewsPage', () => {
  async function render(reviews = REVIEWS) {
    await TestBed.configureTestingModule({ imports: [ReviewsPage] }).compileComponents();
    const fixture = TestBed.createComponent(ReviewsPage);
    fixture.componentRef.setInput('reviews', reviews);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  function filterButton(el: HTMLElement, label: string): HTMLButtonElement {
    return Array.from(el.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')).find(
      (b) => b.textContent?.trim() === label,
    )!;
  }

  it('shows every review initially', async () => {
    const { el } = await render();
    expect(el.querySelectorAll('app-review-card').length).toBe(REVIEWS.length);
  });

  it('filters by service', async () => {
    const { fixture, el } = await render();
    filterButton(el, 'Heating & Furnace').click();
    await fixture.whenStable();
    const expected = REVIEWS.filter((r) => r.service === 'heating').length;
    expect(el.querySelectorAll('app-review-card').length).toBe(expected);
    expect(filterButton(el, 'Heating & Furnace').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton(el, 'All').getAttribute('aria-pressed')).toBe('false');
  });

  it('shows an empty state when no reviews match', async () => {
    const { fixture, el } = await render(REVIEWS.filter((r) => r.service !== 'maintenance'));
    filterButton(el, 'Maintenance Plans').click();
    await fixture.whenStable();
    expect(el.querySelectorAll('app-review-card').length).toBe(0);
    expect(el.textContent).toContain('No reviews for this service yet.');
  });
});
