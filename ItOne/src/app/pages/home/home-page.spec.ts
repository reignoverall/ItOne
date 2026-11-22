import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ratingSummary, REVIEWS } from '../../data/reviews';
import { SERVICES } from '../../data/services';
import HomePage from './home-page';

describe('HomePage', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('has exactly one h1', async () => {
    expect((await render()).querySelectorAll('h1').length).toBe(1);
  });

  it('lists all six services', async () => {
    const el = await render();
    const names = Array.from(el.querySelectorAll('[data-testid="service-card"] h3')).map((h) =>
      h.textContent?.trim(),
    );
    expect(names).toEqual(SERVICES.map((s) => s.name));
  });

  it('previews three reviews', async () => {
    expect((await render()).querySelectorAll('app-review-card').length).toBe(3);
  });

  it('links to request, reviews and areas pages', async () => {
    const el = await render();
    for (const href of ['/request', '/reviews', '/areas']) {
      expect(el.querySelector(`a[href="${href}"]`), href).toBeTruthy();
    }
  });

  it('shows the average rating badge', async () => {
    const el = await render();
    expect(el.textContent).toContain(`${ratingSummary(REVIEWS).average.toFixed(1)}-star average`);
  });
});
