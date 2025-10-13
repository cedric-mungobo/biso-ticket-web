# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Biso Ticket** is a comprehensive event management and ticketing platform built with Nuxt 4, designed for the African market (RDC/Congo) with mobile money payment integration. The platform allows organizers to create events, sell tickets, manage invitations, and handle payments through mobile money services (Orange Money, Airtel Money, M-Pesa).

## Common Development Commands

```bash
# Development
npm run dev                # Start development server on http://localhost:3000
npm run build              # Build for production
npm run preview            # Preview production build locally
npm run generate           # Generate static site
npm run deploy             # Deploy using custom script

# Dependencies
npm install                # Install dependencies
npm run postinstall        # Prepare Nuxt (runs automatically after install)
```

## Architecture Overview

### Technology Stack
- **Framework**: Nuxt 4 (Vue 3, TypeScript) - SSR disabled (`ssr: false`) for client-side rendering
- **Styling**: Tailwind CSS 4.1 with Nuxt UI v4 components
- **Authentication**: nuxt-auth-utils + vue3-google-signin for Google OAuth
- **Payments**: Mobile money integration (Orange, Airtel, M-Pesa)
- **Images**: @nuxt/image with optimization
- **QR Codes**: nuxt-qrcode + qr-code-styling
- **Animations**: @vueuse/motion

### Directory Structure
```
/app/
├── components/           # Vue components (PascalCase naming)
├── composables/         # Business logic (useXxx pattern)
├── pages/              # File-based routing
├── layouts/            # Layout templates
├── middleware/         # Route protection
├── plugins/            # Nuxt plugins
├── types/              # TypeScript definitions
├── assets/             # Static assets & CSS
└── docs/               # Project documentation

/server/api/            # Server API endpoints
```

### Authentication System
- **Google OAuth** via vue3-google-signin
- **Token-based** authentication with localStorage
- **Protected routes** using middleware:
  - `authenticated.ts` - Protects organizer/user areas
  - `guest.ts` - Protects auth pages from authenticated users
  - `google-auth.ts` - Handles Google auth flow
  - `public-reservation.ts` - Manages public reservation access

### Core Composables Architecture
The application uses a composable-first pattern with 30+ specialized composables:

**Core Business Logic:**
- `useEvents.ts` - Event CRUD operations
- `useTickets.ts` - Ticket management
- `useOrders.ts` - Order processing
- `usePayments.ts` - Payment handling
- `useReservations.ts` - Reservation management
- `useInvitations.ts` - Invitation management
- `useScans.ts` - QR code scanning
- `useCredits.ts` - Credit system

**Authentication & State:**
- `useAuth.ts` - Main authentication logic
- `useAuthState.ts` - Authentication state management
- `useGoogleAuth.ts` - Google OAuth handling

**UI/UX:**
- `useToast.ts` - Notification system
- `useLoading.ts` - Loading state management
- `useSEO.ts` - SEO optimization
- `useMobileOptimization.ts` - Mobile-specific features

### API Integration
- **Base URL**: `https://api.bisoticket.com/api`
- **Custom fetch plugin** with automatic token injection
- **Error handling**: Auto-redirect on 401 errors
- **Type safety**: Full TypeScript integration via `/app/types/api.d.ts`

### Key Features Architecture
1. **Event Management**: Creation, approval system, categories, public/private events
2. **Ticket System**: Multiple ticket types, dynamic pricing, QR generation, real-time availability
3. **Payment Processing**: Mobile money integration, credit system, commission tracking
4. **Invitation System**: Digital templates, guest management, RSVP tracking, drink preferences
5. **Organizer Dashboard**: Analytics, sales tracking, guest management, financial reporting

## Development Patterns

### Code Style (from .cursor/rules/)
- **Composition API** with `<script setup>` syntax
- **TypeScript** throughout (prefer interfaces over types)
- **Functional programming** patterns, avoid classes
- **Composable pattern** for shared logic
- **PascalCase** component naming
- **Docker: use** composables, named exports

### Data Fetching Patterns
- `useFetch` for SSR-optimized data fetching (when SSR enabled)
- `$fetch` for client-side requests in event handlers
- `useAsyncData` for complex data operations (multiple API calls, custom caching)
- Set `server: false` to fetch data client-side only
- Set `lazy: true` to defer non-critical data fetching

### Route Configuration
- **SSR disabled globally** but selectively enabled per route via `routeRules`
- **Client-side rendering** for private pages (`/organisateur/**`, `/profile`, `/tickets/**`, `/application/**`)
- **SSR with prerendering** for public pages (`/`, `/evenements/**`)
- **Client-side only** for reservation pages (`/evenements/**/reservation/**`)

### UI Components
- **Nuxt UI v4** as foundation (110+ components available)
- **Mobile-first** responsive design
- **Custom CSS variables** for theming in `~/assets/index.css`
- **Component organization**: Global → Feature → Authentication → Organizer components

## Configuration

### Environment Variables
```typescript
// Runtime config (server-only)
apiSecret: ''
recaptchaSecretKey: '6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb'
googleClientSecret: process.env.GOOGLE_CLIENT_SECRET

// Public config (client + server)
apiBaseUrl: 'https://api.bisoticket.com/api'
recaptchaSiteKey: '6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4'
googleClientId: "35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com"
siteUrl: 'https://bisoticket.com'
```

### Key Modules Configuration
- **@nuxt/image**: Quality 80, formats [webp, avif, jpeg]
- **@nuxt/ui**: Custom color scheme, transitions enabled
- **@vueuse/motion**: Animation support
- **@nuxtjs/sitemap**: SEO optimization

## Testing & Quality

### Code Quality Standards
- **TypeScript strict mode** throughout
- **ESLint + Prettier** for code formatting
- **Vue 3 Composition API** patterns
- **Accessibility** considerations in UI components

### Performance Optimizations
- **Route-based SSR** configuration
- **Image optimization** with lazy loading
- **Component caching** strategies
- **Mobile-first** responsive approach

## Documentation

Comprehensive documentation available in `/app/docs/`:
- **ORGANIZER_SPACE.md** - Complete organizer workflow documentation
- **Component documentation** for major features
- **API integration guides**
- **Technical implementation details**

## Deployment

- **Static generation** for public pages
- **CDN deployment** ready
- **Custom deployment script**: `./scripts/deploy.sh`
- **Environment-specific** configurations via runtime config