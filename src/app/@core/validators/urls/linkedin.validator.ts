import { AbstractControl, ValidationErrors } from '@angular/forms';

export function linkedinValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();

  if (!value) return null;

  const regex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;

  if (!regex.test(value)) {
    return { linkedinValidator: true };
  }

  return null;
}
