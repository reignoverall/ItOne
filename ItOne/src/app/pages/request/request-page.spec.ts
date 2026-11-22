import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TODAY } from '../../data/today';
import RequestPage from './request-page';

describe('RequestPage', () => {
  let fixture: ComponentFixture<RequestPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPage],
      providers: [
        provideRouter([]),
        { provide: TODAY, useValue: () => new Date('2026-11-21T12:00:00') },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RequestPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  async function type(id: string, value: string) {
    const input = el.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  async function choose(id: string) {
    const radio = el.querySelector(`#${id}`) as HTMLInputElement;
    radio.click();
    await fixture.whenStable();
  }

  async function submit() {
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true }),
    );
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r));
    await fixture.whenStable();
  }

  async function fillValid() {
    await type('req-name', 'Jordan');
    await type('req-phone', '555-010-2468');
    await type('req-email', 'jordan@example.com');
    await type('req-address', '12 Elm St');
    await type('req-zip', '80512');
    await type('req-service', 'heating');
    await type('req-date', '2026-11-24');
    await type('req-details', 'Furnace blows cold air.');
  }

  it('shows errors and no confirmation when submitted empty', async () => {
    await submit();
    expect(el.textContent).toContain('Please enter your name.');
    expect(el.textContent).toContain('Please choose a service.');
    expect(el.textContent).not.toContain('Your request is in');
  });

  it('accepts a formatted 10-digit phone', async () => {
    await type('req-phone', '555-010-2468');
    expect(el.textContent).not.toContain('Please enter a 10-digit phone number.');
  });

  it('rejects a short phone', async () => {
    await type('req-phone', '555-0102');
    expect(el.textContent).toContain('Please enter a 10-digit phone number.');
  });

  it('rejects a preferred date in the past', async () => {
    await type('req-date', '2026-11-20');
    expect(el.textContent).toContain('Please choose today or a later date.');
  });

  it('allows today as the preferred date', async () => {
    await type('req-date', '2026-11-21');
    expect(el.textContent).not.toContain('Please choose today or a later date.');
    expect(el.textContent).not.toContain('Please pick a preferred date.');
  });

  it('does not require a date for emergencies', async () => {
    await choose('req-urgency-emergency');
    await submit();
    expect(el.textContent).not.toContain('Please pick a preferred date.');
  });

  it('requires a date when not an emergency', async () => {
    await submit();
    expect(el.textContent).toContain('Please pick a preferred date.');
  });

  it('confirms a valid request and can start over', async () => {
    await fillValid();
    await submit();
    expect(el.textContent).toContain('Thanks, Jordan! Your request is in.');
    expect(el.textContent).toMatch(/SA-\d{6}/);
    expect(el.querySelector('form')).toBeNull();

    const again = Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Submit another request'),
    )!;
    again.click();
    await fixture.whenStable();
    expect(el.querySelector('form')).toBeTruthy();
    expect((el.querySelector('#req-name') as HTMLInputElement).value).toBe('');
  });
});
