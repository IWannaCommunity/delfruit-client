import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpResponse
} from '@angular/common/http';
import { UserService } from './service/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './model/user';
import { UserDataService } from './service/user-data.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  user: User;
  us: UserDataService;

  constructor(private inj: Injector) {
  }

  intercept(
      request: HttpRequest<any>, 
      next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.us) {
      this.us = this.inj.get(UserDataService);
      this.us.userChange.subscribe(user => this.user = user);
    }

    if (!request.url) return next.handle(request);
    if (this.user && this.user.token && request.url.indexOf('speedrun') === -1) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`
        }
      });
    }
    return next.handle(request).pipe( tap(res => {
      if (res instanceof HttpResponse) {
        const newToken = res.headers.get('token');
        if (newToken) {
          this.us.updateToken(newToken);
        }
      }
      return res;
    },
    (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status !== 401) {
       return;
      }
      if (this.user) this.us.deauthLogout();
    }
  }));
  }
}