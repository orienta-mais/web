import { AbstractControl } from '@angular/forms';

export function safeUrlValidator(control: AbstractControl) {
  const url = control.value;

  if (!url) return null;

  const allowedProtocols = ['https:', 'http:'];
  try {
    const parsed = new URL(url);
    if (!allowedProtocols.includes(parsed.protocol)) return { invalidUrl: true };
  } catch {
    return { invalidUrl: true };
  }

  return null;
}
