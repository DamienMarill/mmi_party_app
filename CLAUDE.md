# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MMI Party App - Angular 19 collectible card game application with character customization, loot boxes, trading, and combat systems. French-language UI.

## Commands

```bash
# Development
npm start                 # Dev server → http://localhost:4200

# Build
npm run build            # Production build → dist/mmi_party_app/
npm run watch            # Development watch mode

# Testing
npm test                 # Karma + Jasmine tests
ng test --include=**/path/to/file.spec.ts  # Single test file
```

## Architecture

### Module Structure
```
src/app/
├── pages/
│   ├── login/           # Public routes (login, register, password reset)
│   ├── content/         # Authenticated routes (home, collection, loot, trade, fight)
│   └── admin/           # Admin tools (card generation)
└── shared/
    ├── services/        # ApiService, ConfigService, LootService
    ├── guards/          # authGuard, publicOnlyGuard, lootAvailableGuard
    ├── interfaces/      # TypeScript interfaces (User, CardInstance, etc.)
    ├── directives/      # Custom directives
    └── layout/          # Reusable components (navbar, mmii, cards, etc.)
```

### Core Services

**ApiService** (`shared/services/api.service.ts`):
- Central HTTP client with automatic token management
- Token refresh on 401 with request retry
- Form error integration: `request(method, endpoint, data?, form?)`
- Observables: `authState$`, `isAuthenticated$`, `user$`

**ConfigService**: Wraps environment configuration for API URLs

**LootService**: Manages loot availability state and timing

### Route Protection
- `authGuard`: Requires authentication → redirects to `/login`
- `publicOnlyGuard`: Requires no auth → redirects to `/home`
- `lootAvailableGuard`: Checks API for feature availability

### Authentication Flow
1. Token stored in localStorage (`auth_token`)
2. App init triggers refresh token attempt
3. Requests include Bearer token via ApiService
4. 401 → automatic refresh → retry original request

## Tech Stack

- **Framework**: Angular 19.1 (NgModules, not standalone)
- **Styling**: Tailwind CSS 3.4 + DaisyUI 4.12 (watercolor theme)
- **Icons**: FontAwesome (angular-fontawesome)
- **HTTP**: RxJS observables via @angular/common/http
- **Forms**: Reactive Forms
- **Custom**: marill-ui-core component library

## Environment Configuration

```typescript
// Development: src/environments/environment.development.ts
back: 'http://localhost:8000'
api: 'http://localhost:8000/api'

// Production: src/environments/environment.ts
back: 'https://back.mmiparty.fr'
api: 'https://back.mmiparty.fr/api'
```

## Conventions

- **Components**: `app-` prefix selectors, kebab-case files
- **Services**: `providedIn: 'root'`, suffix `.service.ts`
- **Interfaces**: `shared/interfaces/`, descriptive names
- **SCSS**: Colocated with components
- **Locale**: fr-FR

## Custom Theme Colors

Defined in `tailwind.config.js`:
- Rarity: `common`, `uncommon`, `rare`, `epic`
- Stats: `dev`, `ux_ui`, `graphisme`, `audiovisuel`, `trois_d`, `communication`
