import { SchemaPath, validate } from '@angular/forms/signals';

/** Rejects values that are only whitespace (`required` treats '   ' as filled). */
export function notBlank(path: SchemaPath<string>, message: string): void {
  validate(path, ({ value }) => (value() && !value().trim() ? { kind: 'blank', message } : null));
}
