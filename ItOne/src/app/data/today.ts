import { InjectionToken } from '@angular/core';

/** Clock used by date validation; override in tests. */
export const TODAY = new InjectionToken<() => Date>('TODAY', {
  factory: () => () => new Date(),
});
