import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: any;

  login(credentials: any) {
    if (
      credentials.email === 'admin@gmail.com' &&
      credentials.password === 'admin@123'
    ) {
      localStorage.setItem('isLogged', 'valid');
      return true;
    }

    return false;
  }

  getAccessToken(): any {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }

    return this.accessToken;
  }

  forgot(email: String) {
    let myPromise = new Promise(function (myResolve, myReject) {
      myResolve(true);
      myReject(false);
    });
    return myPromise;
  }

  removeToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('Logvalid');
  }

  isLoggedin() {
    return localStorage.getItem('Logvalid') === 'yes';
  }
}
