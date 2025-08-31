import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private email: string | null = null;
  private password: string | null = null;

  setRegisterUser(email: string, password: string) {
    this.password = password;
    this.email = email;
  }

  getEmail(): string | null {
    return this.email;
  }

  getPassword(): string | null {
    return this.password;
  }

  clear(): void {
    this.email = null;
    this.password = null;
  }
}
