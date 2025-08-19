import { AbstractControl } from '@angular/forms';

export function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = control.value;

  if (email && !emailPattern.test(email)) {
    return { 'invalidEmail': true };
  }

  return null;
}