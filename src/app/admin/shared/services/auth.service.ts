import { environment } from './../../../../environments/environment';
import { User, FbAuthResponse } from './../../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO: Изучить работу этого Subject
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) {

  }

  get token(): string {
    const expDate: Date = new Date(localStorage.getItem('fb-token-exp'));

    if (new Date() > expDate) {
      this.logout();
      return null;
    }

    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        // TODO: bind
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL': {
        this.error$.next('Неверный email');
        break;
      }
      case 'INVALID_PASSWORD': {
        this.error$.next('Неверный пароль');
        break;
      }
      case 'EMAIL_NOT_FOUND': {
        this.error$.next('Email не найден');
        break;
      }
    }

    return throwError(message);
  }

  private setToken(response: FbAuthResponse | null) {
    if (!response) {
      ['fb-token', 'fb-token-exp'].forEach(item => localStorage.removeItem(item));
      return;
    }

    const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000);
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expDate.toString());
  }
}
