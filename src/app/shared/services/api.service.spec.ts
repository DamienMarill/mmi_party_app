import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { AuthToken } from '../interfaces/auth-token';
import { User, GroupUser } from '../interfaces/user';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  const mockApiUrl = 'http://localhost:8000/api';

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    um_email: 'test@um.fr',
    group: GroupUser.Student,
    mmii: {} as any,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  };

  const mockAuthToken: AuthToken = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    token_type: 'Bearer',
    expires_in: 3600,
    user: mockUser
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getApiUrl']);
    configServiceSpy.getApiUrl.and.returnValue(mockApiUrl);

    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        ApiService,
        { provide: Router, useValue: routerSpy },
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('création', () => {
    it('devrait être créé', () => {
      expect(service).toBeTruthy();
    });

    it('devrait initialiser avec un état auth vide', (done) => {
      service.authState$.subscribe(state => {
        expect(state.token).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.user).toBeNull();
        done();
      });
    });

    it('devrait avoir isLodded à true sans token stocké', () => {
      expect(service.isLodded).toBeTrue();
    });
  });

  describe('isAuthenticated$', () => {
    it('devrait retourner false quand pas de token', (done) => {
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBeFalse();
        done();
      });
    });
  });

  describe('request()', () => {
    it('devrait faire une requête GET', (done) => {
      const testData = { data: 'test' };

      service.request<any>('GET', '/test').subscribe(response => {
        expect(response).toEqual(testData);
        done();
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(testData);
    });

    it('devrait faire une requête POST avec des données', (done) => {
      const postData = { name: 'test' };
      const responseData = { success: true };

      service.request<any>('POST', '/test', postData).subscribe(response => {
        expect(response).toEqual(responseData);
        done();
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(postData);
      req.flush(responseData);
    });

    it('devrait faire une requête PUT', (done) => {
      const putData = { name: 'updated' };
      const responseData = { success: true };

      service.request<any>('PUT', '/test', putData).subscribe(response => {
        expect(response).toEqual(responseData);
        done();
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      expect(req.request.method).toBe('PUT');
      req.flush(responseData);
    });

    it('devrait faire une requête DELETE avec query params', (done) => {
      const params = { id: '123' };
      const responseData = { deleted: true };

      service.request<any>('DELETE', '/test', params).subscribe(response => {
        expect(response).toEqual(responseData);
        done();
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test?id=123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(responseData);
    });

    it('devrait ajouter query params pour les requêtes GET', (done) => {
      const params = { page: 1, limit: 10 };

      service.request<any>('GET', '/items', params).subscribe(() => done());

      const req = httpMock.expectOne(`${mockApiUrl}/items?page=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('devrait passer skipAuth pour éviter le header Authorization', (done) => {
      service.request<any>('GET', '/public', undefined, undefined, { skipAuth: true })
        .subscribe(() => done());

      const req = httpMock.expectOne(`${mockApiUrl}/public`);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('gestion des erreurs de formulaire', () => {
    it('devrait marquer le formulaire comme pending puis enabled après succès', fakeAsync(() => {
      const form = new FormGroup({
        name: new FormControl('')
      });

      service.request<any>('POST', '/test', {}, form).subscribe();

      expect(form.pending).toBeTrue();

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      req.flush({ message: 'Succès!' });
      tick();

      expect(form.enabled).toBeTrue();
    }));

    it('devrait définir une alerte de succès quand la réponse contient un message', fakeAsync(() => {
      const form = new FormGroup({
        name: new FormControl('')
      });

      service.request<any>('POST', '/test', {}, form).subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      req.flush({ message: 'Opération réussie!' });
      tick();

      expect(form.errors).toEqual({
        serverError: {
          status: 'success',
          message: 'Opération réussie!'
        }
      });
    }));

    it('devrait définir les erreurs de validation sur les contrôles du formulaire', fakeAsync(() => {
      const form = new FormGroup({
        email: new FormControl(''),
        password: new FormControl('')
      });

      service.request<any>('POST', '/test', {}, form).subscribe({
        error: () => {}
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      req.flush({
        message: 'Erreur de validation',
        errors: {
          email: ['Email invalide'],
          password: 'Mot de passe requis'
        }
      }, { status: 422, statusText: 'Unprocessable Entity' });
      tick();

      expect(form.get('email')?.errors).toEqual({ serverError: 'Email invalide' });
      expect(form.get('password')?.errors).toEqual({ serverError: 'Mot de passe requis' });
    }));

    it('devrait gérer les erreurs de formulaire imbriqué', fakeAsync(() => {
      const form = new FormGroup({
        user: new FormGroup({
          profile: new FormGroup({
            name: new FormControl('')
          })
        })
      });

      service.request<any>('POST', '/test', {}, form).subscribe({
        error: () => {}
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      req.flush({
        message: 'Erreur de validation',
        errors: {
          'user.profile.name': ['Le nom est requis']
        }
      }, { status: 422, statusText: 'Unprocessable Entity' });
      tick();

      expect(form.get('user.profile.name')?.errors).toEqual({ serverError: 'Le nom est requis' });
    }));

    it('devrait gérer les erreurs sous forme de string simple', fakeAsync(() => {
      const form = new FormGroup({
        name: new FormControl('')
      });

      service.request<any>('POST', '/test', {}, form).subscribe({
        error: () => {}
      });

      const req = httpMock.expectOne(`${mockApiUrl}/test`);
      req.flush('Erreur serveur', { status: 500, statusText: 'Internal Server Error' });
      tick();

      expect(form.errors?.['serverError']?.message).toBe('Erreur serveur');
    }));
  });

  describe('login()', () => {
    it('devrait se connecter et mettre à jour l\'état auth', fakeAsync(() => {
      const credentials = { email: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe();

      // Login request
      const loginReq = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      expect(loginReq.request.method).toBe('POST');
      expect(loginReq.request.body).toEqual(credentials);
      loginReq.flush(mockAuthToken);
      tick();

      // Me request
      const meReq = httpMock.expectOne(`${mockApiUrl}/me`);
      expect(meReq.request.method).toBe('GET');
      expect(meReq.request.headers.get('Authorization')).toBe('Bearer test-access-token');
      meReq.flush(mockUser);
      tick();

      service.authState$.subscribe(state => {
        expect(state.token).toBe('test-access-token');
        expect(state.refreshToken).toBe('test-refresh-token');
        expect(state.user).toEqual(mockUser);
      });
    }));

    it('devrait stocker le refresh token dans localStorage', fakeAsync(() => {
      const credentials = { email: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe();

      const loginReq = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      loginReq.flush(mockAuthToken);
      tick();

      const meReq = httpMock.expectOne(`${mockApiUrl}/me`);
      meReq.flush(mockUser);
      tick();

      const stored = JSON.parse(localStorage.getItem('auth_token') || '{}');
      expect(stored.refresh_token).toBe('test-refresh-token');
    }));
  });

  describe('logout()', () => {
    beforeEach(fakeAsync(() => {
      // Login first
      service.login({ email: 'test@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne(`${mockApiUrl}/auth/login`).flush(mockAuthToken);
      tick();
      httpMock.expectOne(`${mockApiUrl}/me`).flush(mockUser);
      tick();
    }));

    it('devrait se déconnecter et réinitialiser l\'état', fakeAsync(() => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
      tick();

      service.authState$.subscribe(state => {
        expect(state.token).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.user).toBeNull();
      });
    }));

    it('devrait supprimer le token du localStorage', fakeAsync(() => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/auth/logout`);
      req.flush({});
      tick();

      expect(localStorage.getItem('auth_token')).toBeNull();
    }));

    it('devrait naviguer vers /login', fakeAsync(() => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/auth/logout`);
      req.flush({});
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('gestion des erreurs 401', () => {
    beforeEach(fakeAsync(() => {
      // Setup initial auth state
      service.login({ email: 'test@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne(`${mockApiUrl}/auth/login`).flush(mockAuthToken);
      tick();
      httpMock.expectOne(`${mockApiUrl}/me`).flush(mockUser);
      tick();
    }));

    it('devrait tenter un refresh token sur erreur 401', fakeAsync(() => {
      service.request<any>('GET', '/protected').subscribe({
        error: () => {}
      });

      // First request fails with 401
      const protectedReq = httpMock.expectOne(`${mockApiUrl}/protected`);
      protectedReq.flush({}, { status: 401, statusText: 'Unauthorized' });
      tick();

      // Refresh token request
      const refreshReq = httpMock.expectOne(`${mockApiUrl}/auth/refresh`);
      expect(refreshReq.request.method).toBe('POST');
      expect(refreshReq.request.body).toEqual({ refresh_token: 'test-refresh-token' });
    }));
  });

  describe('user$', () => {
    it('devrait retourner null quand pas connecté', (done) => {
      service.user$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });

    it('devrait retourner l\'utilisateur après connexion', fakeAsync(() => {
      service.login({ email: 'test@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne(`${mockApiUrl}/auth/login`).flush(mockAuthToken);
      tick();
      httpMock.expectOne(`${mockApiUrl}/me`).flush(mockUser);
      tick();

      service.user$.subscribe(user => {
        expect(user).toEqual(mockUser);
      });
    }));
  });

  describe('initialisation avec token stocké', () => {
    it('devrait tenter de refresh le token si présent dans localStorage', () => {
      localStorage.setItem('auth_token', JSON.stringify({ refresh_token: 'stored-refresh-token' }));

      // Create a new instance to trigger initializeAuth
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          ApiService,
          { provide: Router, useValue: routerSpy },
          { provide: ConfigService, useValue: configServiceSpy }
        ]
      });

      const newService = TestBed.inject(ApiService);
      const newHttpMock = TestBed.inject(HttpTestingController);

      const refreshReq = newHttpMock.expectOne(`${mockApiUrl}/auth/refresh`);
      expect(refreshReq.request.body).toEqual({ refresh_token: 'stored-refresh-token' });

      refreshReq.flush(mockAuthToken);

      newHttpMock.expectOne(`${mockApiUrl}/me`).flush(mockUser);

      newHttpMock.verify();
    });
  });
});
