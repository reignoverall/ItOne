import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { NAV_LINKS, SiteHeader } from './site-header';

@Component({ template: '' })
class Blank {}

describe('SiteHeader', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([{ path: '**', component: Blank }])],
    }).compileComponents();
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  function toggle(el: HTMLElement): HTMLButtonElement {
    return el.querySelector('button[aria-controls="mobile-nav"]') as HTMLButtonElement;
  }

  it('renders all five nav links', async () => {
    const { el } = await render();
    const desktopLinks = Array.from(el.querySelectorAll('nav[aria-label="Main"] a'));
    expect(desktopLinks.map((a) => a.textContent?.trim())).toEqual(NAV_LINKS.map((l) => l.label));
  });

  it('call button links to phone', async () => {
    const { el } = await render();
    expect(el.querySelector('a[href="tel:+15550102468"]')).toBeTruthy();
  });

  it('menu toggle sets aria-expanded', async () => {
    const { fixture, el } = await render();
    expect(toggle(el).getAttribute('aria-expanded')).toBe('false');
    toggle(el).click();
    await fixture.whenStable();
    expect(toggle(el).getAttribute('aria-expanded')).toBe('true');
  });

  it('closes menu after navigating', async () => {
    const { fixture, el } = await render();
    toggle(el).click();
    await fixture.whenStable();
    const link = el.querySelector('#mobile-nav a') as HTMLAnchorElement;
    link.click();
    await fixture.whenStable();
    expect(toggle(el).getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu on Escape', async () => {
    const { fixture, el } = await render();
    toggle(el).click();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle(el).getAttribute('aria-expanded')).toBe('false');
  });
});
