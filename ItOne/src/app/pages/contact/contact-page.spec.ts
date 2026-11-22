import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPANY } from '../../data/company';
import ContactPage from './contact-page';

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactPage] }).compileComponents();
    fixture = TestBed.createComponent(ContactPage);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  async function type(id: string, value: string) {
    const input = el.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
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

  it('links phone and email', () => {
    expect(el.querySelector(`a[href="${COMPANY.phoneHref}"]`)).toBeTruthy();
    expect(el.querySelector(`a[href="mailto:${COMPANY.email}"]`)).toBeTruthy();
  });

  it('shows all errors when submitted empty', async () => {
    await submit();
    expect(el.textContent).toContain('Please enter your name.');
    expect(el.textContent).toContain('Please enter a valid email address.');
    expect(el.textContent).toContain('Please enter a message (at least 10 characters).');
    expect(el.textContent).not.toContain('we’ll get back to you');
  });

  it('confirms a valid message and can send another', async () => {
    await type('contact-name', 'Sam');
    await type('contact-email', 'sam@example.com');
    await type('contact-message', 'Do you service heat pumps?');
    await submit();
    expect(el.textContent).toContain(
      'Thanks, Sam — we’ll get back to you within one business day.',
    );
    expect(el.querySelector('form')).toBeNull();

    Array.from(el.querySelectorAll('button'))
      .find((b) => b.textContent?.includes('Send another message'))!
      .click();
    await fixture.whenStable();
    expect((el.querySelector('#contact-name') as HTMLInputElement).value).toBe('');
  });
});
