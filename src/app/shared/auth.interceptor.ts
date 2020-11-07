import { AuthService } from './../admin/shared/services/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = {};

    if (this.auth.isAuthenticated()) {
      params = {
        ...params,
        auth: this.auth.token
      };
    }

    const clonedRequest = request.clone({
      setParams: params,
    });

    return next.handle(clonedRequest)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.logout();
            this.router.navigate(['/admin', 'login'], {
              queryParams: {
                authFailed: true,
              }
            })
          }
          return throwError(error);
        }),
      )
  }
}
