import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  private readonly BRASILIA_OFFSET = -180;

  toUTCDateString(localDate: Date): string {
    return localDate.toISOString().split('T')[0];
  }

  toUTCTimeString(localDate: Date): string {
    return localDate.toISOString().split('T')[1].split('.')[0];
  }

  localToUTC(date: Date, time: string): { date: string; time: string } {
    const [hours, minutes] = time.split(':').map(Number);
    const localDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0,
    );

    return {
      date: this.toUTCDateString(localDateTime),
      time: this.toUTCTimeString(localDateTime),
    };
  }

  createLocalDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
  }

  utcToLocal(utcDate: string, utcTime: string): Date {
    const isoString = `${utcDate}T${utcTime}Z`;
    return new Date(isoString);
  }

  utcDateToLocalDate(utcDateString: string): Date {
    const utcDate = new Date(utcDateString + 'T00:00:00Z');
    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
  }

  utcTimeToLocalTime(utcDate: string, utcTime: string): string {
    const localDate = this.utcToLocal(utcDate, this.ensureTimeSeconds(utcTime));
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatDateBR(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatUTCForDisplay(utcDate: string, utcTime: string): { date: string; time: string } {
    const localDate = this.utcToLocal(utcDate, this.ensureTimeSeconds(utcTime));
    return {
      date: this.formatDateBR(localDate),
      time: this.formatTime(localDate),
    };
  }

  isInPast(utcDate: string, utcTime: string): boolean {
    const dateTime = this.utcToLocal(utcDate, this.ensureTimeSeconds(utcTime));
    return dateTime < new Date();
  }

  isInFuture(utcDate: string, utcTime: string): boolean {
    const dateTime = this.utcToLocal(utcDate, this.ensureTimeSeconds(utcTime));
    return dateTime > new Date();
  }

  diffInHours(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  ensureTimeSeconds(time: string): string {
    if (!time) return '00:00:00';
    const parts = time.split(':');
    if (parts.length === 2) {
      return `${time}:00`;
    }
    return time;
  }

  removeSeconds(time: string): string {
    if (!time) return '';
    return time.slice(0, 5);
  }

  today(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }

  now(): Date {
    return new Date();
  }
}
