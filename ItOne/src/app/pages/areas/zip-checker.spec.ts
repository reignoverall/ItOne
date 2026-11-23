import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ZipChecker } from './zip-checker';

describe('ZipChecker', () => {
  async function check(zip: string) {
    await TestBed.configureTestingModule({
      imports: [ZipChecker],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ZipChecker);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = zip;
    input.dispatchEvent(new Event('input'));
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    return el.querySelector('[aria-live="polite"]') as HTMLElement;
  }

  it('confirms a served ZIP by town name', async () => {
    const result = await check('80512');
    expect(result.textContent).toContain('Good news — we serve Ridgeline!');
    expect(result.querySelector('a[href="/request"]')).toBeTruthy();
  });

  it('explains when a ZIP is outside the area', async () => {
    expect((await check('99999')).textContent).toContain(
      'We don’t currently serve that ZIP, but call us — we may still be able to help.',
    );
  });

  it('asks for a 5-digit ZIP when input is malformed', async () => {
    expect((await check('8051')).textContent).toContain('Please enter a 5-digit ZIP code.');
  });
});
