import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {EventEmitter, inject, Injectable} from '@angular/core';
import moment from 'moment';
import {Router} from '@angular/router';
import {ConfigService} from './config.service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import {AuthState, AuthToken} from '../interfaces/auth-token';
import {User} from '../interfaces/user';
import {catchError, map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private configService = inject(ConfigService);
  public isLodded = false;

  private authStateSubject = new BehaviorSubject<AuthState>({
    token: null,
    refreshToken: null,
    expiresAt: null,
    user: null
  });

  public readonly authState$ = this.authStateSubject.asObservable();
  public readonly isAuthenticated$ = this.authState$.pipe(
    map(state => !!state.token)
  );
  public readonly user$ = this.authState$.pipe(
    map(state => state.user)
  );

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const storedAuth = localStorage.getItem('auth_token');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      this.refreshToken(auth.refresh_token).subscribe(
        () => {
          this.isLodded = true
        },
        error => {
          this.isLodded = true;
          console.error('Error refreshing token', error)
        }
      );
    }else{
      this.isLodded = true;
    }
  }

  private updateAuthState(token: AuthToken, user?: User): void {
    const expiresAt = moment().add(token.expires_in, 'seconds').format();

    this.authStateSubject.next({
      token: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt,
      user: user ?? this.authStateSubject.value.user
    });

    localStorage.setItem('auth_token', JSON.stringify({
      refresh_token: token.refresh_token
    }));
  }

  public request<T>(
    method: string,
    endpoint: string,
    data?: any,
    form?: FormGroup,
    options: { skipAuth?: boolean } = {}
  ): Observable<T> {
    const url = this.configService.getApiUrl() + endpoint;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-All-Languages': 'true'
    });
    if (!options.skipAuth && this.authStateSubject.value.token) {
      headers = headers.set('Authorization', `Bearer ${this.authStateSubject.value.token}`);
    }

    if (form) {
      form.markAsPending();
    }

    let request: Observable<T>;
    switch (method.toLowerCase()) {
      case 'post':
        request = this.http.post<T>(url, data, { headers });
        break;
      case 'put':
        request = this.http.put<T>(url, data, { headers });
        break;
      case 'delete':
        request = this.http.delete<T>(url + this.buildQueryParams(data), { headers });
        break;
      default:
        request = this.http.get<T>(url + this.buildQueryParams(data), { headers });
    }

    return request.pipe(
      tap((response: T) => {
        if (form) {
          form.enable();
          if (this.hasMessage(response)) {
            this.setFormAlert(form, response.message, 'success');
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Http Error : ', error);

        if (form) {
          form.enable();

          if (error.error?.message) {
            this.setFormAlert(form, error.error.message, 'error');

            if (error.error.errors) {
              Object.entries(error.error.errors).forEach(([key, value]: [string, any]) => {
                const keys = key.split('.');
                let control: any = form;

                for (const k of keys) {
                  control = control.get(k);
                  if (!control) break;
                }

                if (control) {
                  if (typeof value === 'string') {
                    control.setErrors({ serverError: value });
                  } else if (Array.isArray(value)) {
                    control.setErrors({ serverError: value[0] });
                  }
                }
              });
            }
          } else if (error.error && typeof error.error === 'string') {
            this.setFormAlert(form, error.error, 'error');
          } else {
            this.setFormAlert(form, error.message, 'error');
          }
        }

        if (error.status === 401 && !endpoint.includes('/auth/refresh')) {
          return this.refreshToken(this.authStateSubject.value.refreshToken!).pipe(
            switchMap(() => throwError(() => error))
          );
        }

        return throwError(() => error);
      })
    );
  }

  private hasMessage(response: any): response is { message: string } {
    return response && typeof response.message === 'string';
  }

  private setFormAlert(form: FormGroup, message: string, status: 'success' | 'error' | 'warning' | 'info' = 'success') {
    form.setErrors({
      serverError: {
        status: status,
        message: message
      }
    });
  }

  private refreshToken(refreshToken: string): Observable<void> {
    return this.request<AuthToken>(
      'post',
      '/auth/refresh',
      { refresh_token: refreshToken },
      undefined,
      { skipAuth: true }
    ).pipe(
      tap(token => this.updateAuthState(token)),
      switchMap(() => this.fetchUserProfile().pipe(
        switchMap(() => this.router.navigate(['/home']))
      )),
      map(() => void 0)
    );
  }

  public login(credentials: { email: string; password: string }, form?: FormGroup): Observable<void> {
    return this.request<AuthToken>(
      'post',
      '/auth/login',
      credentials,
      form,
      { skipAuth: true }
    ).pipe(
      tap(token => this.updateAuthState(token)),
      // On attend que le state soit mis à jour

      switchMap(() => {
        // On crée la requête /me après que le token soit disponible
        return this.request<User>(
          'get',
          '/me',
          undefined,
          undefined,
          { skipAuth: false }
        );
      }),
      tap(user => {
        const currentState = this.authStateSubject.value;
        this.authStateSubject.next({ ...currentState, user });
      }),
      map(() => void 0)
    );
  }


  public logout(): Observable<void> {
    return this.request<void>('post', '/auth/logout').pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        this.authStateSubject.next({
          token: null,
          refreshToken: null,
          expiresAt: null,
          user: null
        });
        this.router.navigate(['/login']);
      })
    );
  }

  private fetchUserProfile(): Observable<void> {
    return this.request<User>('get', '/me').pipe(
      tap(user => {
        const currentState = this.authStateSubject.value;
        this.authStateSubject.next({ ...currentState, user });
      }),
      map(() => void 0)
    );
  }

  private buildQueryParams(params?: any): string {
    if (!params) return '';
    return '?' + Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
