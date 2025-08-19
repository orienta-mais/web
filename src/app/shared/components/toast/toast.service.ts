import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  show(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';

    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: backgroundColor,
    }).showToast();
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }
}