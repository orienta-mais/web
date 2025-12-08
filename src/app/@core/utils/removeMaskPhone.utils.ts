export function removeMaskPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
