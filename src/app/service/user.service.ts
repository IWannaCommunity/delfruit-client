import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../model/user';
import { Observable ,  of, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { tap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { UserDataService } from './user-data.service';
import { environment } from '../../environments/environment';

const Environment = environment;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const TOKEN_CHECK_INTERVAL_MS = 1000*60; //1 minute
const TOKEN_REFRESH_THRESHOLD_S = 60*60*12; //12 hours

@Injectable()
export class UserService {

  tokenWatchdog;

  public get userChange() {
    return this.userDataService.userChange;
  }

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private recaptchaV3Service: ReCaptchaV3Service,
    private userDataService: UserDataService
  ) { 
    //Grab the user every minute, to confirm it's still valid
    //If invalid, it will log them out automatically
    //If the token is about to expire, then it will be refreshed
    this.checkStatus();
    this.tokenWatchdog = setInterval(()=>this.checkStatus(),TOKEN_CHECK_INTERVAL_MS);
    this.userChange.next(this.getUser());
  }

  checkStatus() {
    const user = this.getUser();
    if (!user) return;
    const token = jwt_decode(user.token);

    const exp = token.exp;
    const now = new Date().getTime()/1000;
    const rem = exp-now;

    //console.log(`user time remaining: ${rem}`)

    if (rem <= TOKEN_REFRESH_THRESHOLD_S) {
      console.log("refreshing token")
      this.refresh().subscribe();
    } else if (rem <= 0) {
      console.log('user exipred %s <= %s',token.exp,new Date().getTime());
      this.deauthLogout();
      return null;
    }
  }

  deauthLogout() {
    this.userDataService.deauthLogout();
    this.snackBar.open("Logged out due to inactivity, please log in again.",null,{
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  login(username: string, password: string): Observable<User> {
    return this.recaptchaV3Service.execute('login').pipe(switchMap((rcptoken) => {
      return this.http.post<User>(`${Environment.apiUrl}/auth/login`,{
        username,password,rcptoken
      }).pipe(tap(user => this.setUser(user)));
    }));
  }

  refresh() {
    return this.http.post<User>(`${Environment.apiUrl}/auth/refresh`,{})
    .pipe(tap(user => this.setUser(user)));
  }

  register(username: string, password: string, email: string): Observable<User> {
    return this.recaptchaV3Service.execute('register').pipe(switchMap((rcptoken) => {
        return this.http.post<User>(`${Environment.apiUrl}/users`,{
        username,password,email,rcptoken
      }).pipe(tap(user => this.setUser(user)));
    }));
  }

  setUser(user: any) {
    return this.userDataService.setUser(user);
  }

  logout(): Observable<any> {
    return this.userDataService.logout();
  }

  private getUser(): User {
    return this.userDataService.getUser();
  }

  updateToken(token: string) {
    this.userDataService.updateToken(token);
  }

  requestReset(username: string, email: string): Observable<any> {
    return this.recaptchaV3Service.execute('requestPwReset').pipe(switchMap((rcptoken) => {
      return this.http.post<User>(`${Environment.apiUrl}/auth/request-reset`,{
        username,email,rcptoken
      }).pipe(tap(user => this.setUser(user)));
    }));
  }

  resetPassword(username: string, token: string, password: string): Observable<any> {
    return this.recaptchaV3Service.execute('resetPW').pipe(switchMap((rcptoken) => {
      return this.http.post<User>(`${Environment.apiUrl}/auth/reset`,{
        username,password,token,rcptoken
      }).pipe(tap(user => this.setUser(user)));
    }));
  }

  getBadges(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${Environment.apiUrl}/users/${id}/badges`);
  }

  updateUser(user: User): Observable<any> {
    return this.http.patch<any>(`${Environment.apiUrl}/users/${user.id}`,user);
  }
}
