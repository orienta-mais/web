import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value == null) return { requiredTrim: true };

  if (typeof value === 'string' && value.trim().length === 0) {
    return { requiredTrim: true };
  }

  return null;
}
