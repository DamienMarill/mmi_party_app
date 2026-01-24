/**
 * Fichier de helpers et mocks pour les tests unitaires
 */
import { of, BehaviorSubject } from 'rxjs';
import { User, GroupUser } from '../interfaces/user';

/**
 * Mock User pour les tests
 */
export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  um_email: 'test@um.fr',
  group: GroupUser.Student,
  mmii: {} as any,
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
};

/**
 * Mock ApiService
 */
export const createMockApiService = () => {
  const authStateSubject = new BehaviorSubject({
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: null,
    user: mockUser
  });

  return {
    request: jasmine.createSpy('request').and.returnValue(of([])),
    login: jasmine.createSpy('login').and.returnValue(of(void 0)),
    logout: jasmine.createSpy('logout').and.returnValue(of(void 0)),
    authState$: authStateSubject.asObservable(),
    isAuthenticated$: of(true),
    user$: of(mockUser),
    isLodded: true
  };
};

/**
 * Mock LootService
 */
export const createMockLootService = () => ({
  isLootAvailable: false,
  nextLootTime: new Date(),
  updateLootAvailability: jasmine.createSpy('updateLootAvailability'),
  apiService: createMockApiService()
});

/**
 * Mock AssetsService
 */
export const createMockAssetsService = () => ({
  getBgUrl: jasmine.createSpy('getBgUrl').and.callFake((path: string) => `mock-storage/background/${path}`),
  getCardImgUrl: jasmine.createSpy('getCardImgUrl').and.callFake((path: string) => `mock-storage/card_image/${path}`),
  getCardTemplateUrl: jasmine.createSpy('getCardTemplateUrl').and.callFake((path: string) => `mock-storage/fullart/${path}`)
});

/**
 * Mock ConfigService
 */
export const createMockConfigService = () => ({
  getApiUrl: jasmine.createSpy('getApiUrl').and.returnValue('http://localhost:8000/api')
});

/**
 * Mock ActivatedRoute
 */
export const createMockActivatedRoute = (params: any = {}, data: any = {}) => ({
  params: of(params),
  snapshot: {
    params,
    data,
    queryParams: {},
    fragment: null,
    url: [],
    outlet: 'primary',
    routeConfig: null,
    root: null,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: {
      get: (key: string) => params[key],
      has: (key: string) => key in params,
      keys: Object.keys(params),
      getAll: (key: string) => [params[key]]
    },
    queryParamMap: {
      get: () => null,
      has: () => false,
      keys: [],
      getAll: () => []
    }
  },
  data: of(data),
  queryParams: of({}),
  fragment: of(null),
  url: of([]),
  outlet: 'primary',
  routeConfig: null,
  root: null,
  parent: null,
  firstChild: null,
  children: []
});

/**
 * Mock Router
 */
export const createMockRouter = () => ({
  navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
  events: of({}),
  url: '/',
  createUrlTree: jasmine.createSpy('createUrlTree'),
  serializeUrl: jasmine.createSpy('serializeUrl'),
  parseUrl: jasmine.createSpy('parseUrl'),
  isActive: jasmine.createSpy('isActive').and.returnValue(false)
});

/**
 * Mock ConfettiService
 */
export const createMockConfettiService = () => ({
  defineStars: jasmine.createSpy('defineStars'),
  stars: jasmine.createSpy('stars'),
  cannon: jasmine.createSpy('cannon'),
  doubleCannon: jasmine.createSpy('doubleCannon'),
  fireworks: jasmine.createSpy('fireworks'),
  randomInRange: jasmine.createSpy('randomInRange').and.returnValue(0.5)
});

/**
 * Mock ClipboardService
 */
export const createMockClipboardService = () => ({
  copyToClipboard: jasmine.createSpy('copyToClipboard').and.returnValue(Promise.resolve(true))
});

/**
 * Mock CicleService
 */
export const createMockCicleService = () => ({
  circle1$: of({ color: 'bg-rarity-common', position: { x: 50, y: 50 } }),
  circle2$: of({ color: 'bg-rarity-rare', position: { x: 25, y: 75 } }),
  updateCircles: jasmine.createSpy('updateCircles')
});

/**
 * Mock ActivatedRoute with queryParamMap support
 */
export const createMockActivatedRouteWithQuery = (params: any = {}, queryParams: any = {}) => ({
  params: of(params),
  snapshot: {
    params,
    data: {},
    queryParams,
    fragment: null,
    url: [],
    outlet: 'primary',
    routeConfig: null,
    root: null,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: {
      get: (key: string) => params[key],
      has: (key: string) => key in params,
      keys: Object.keys(params),
      getAll: (key: string) => [params[key]]
    },
    queryParamMap: {
      get: (key: string) => queryParams[key] || null,
      has: (key: string) => key in queryParams,
      keys: Object.keys(queryParams),
      getAll: (key: string) => [queryParams[key]]
    }
  },
  data: of({}),
  queryParams: of(queryParams),
  fragment: of(null),
  url: of([]),
  outlet: 'primary',
  routeConfig: null,
  root: null,
  parent: null,
  firstChild: null,
  children: []
});
