import { fileURLToPath } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/index.css'],
  plugins: [
    '~/plugins/preline.client.ts',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
 
  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-auth-utils',
    'nuxt-qrcode',
    'nuxt-pdfmake',
    '@vueuse/motion/nuxt',
    '@nuxtjs/sitemap'
  ],
  ui: {
    colorMode: false,
    // Aligne Nuxt UI sur les palettes définies dans app/assets/index.css
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'],
      defaultVariants: {
        color: 'primary',
        size: 'md'
      },
      transitions: true
    }
  },

  
  // Configuration des alias de chemins
  alias: {
    '~': fileURLToPath(new URL('./app', import.meta.url)),
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },

  

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    // Configuration pour éviter les erreurs d'hydratation
    keepalive: true,
    head: {
      title: 'Biso Ticket - Plateforme de billetterie et gestion d\'événements',
      titleTemplate: '%s - Biso Ticket',
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        { 
          name: 'viewport', 
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap', rel: 'stylesheet' }
      ],
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ]
    }
  },
  
  // Configuration runtime pour les variables d'environnement
  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    apiSecret: '',
    recaptchaSecretKey: '6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb', // Remplacez par votre clé secrète
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    
    // Variables publiques (côté client et serveur)
    public: {
      apiBaseUrl: 'https://api.bisoticket.com/api',
      recaptchaSiteKey: '6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4', // Remplacez par votre clé site
      googleClientId:  "35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com",
      siteUrl: 'https://bisoticket.com',
      site: {
        url: 'https://bisoticket.com'
      }
    }
  },

  // Configuration pour hébergement mutualisé (fichiers statiques)
  nitro: {
    prerender: {
      routes: [
        '/sitemap.xml',
        // Routes statiques principales
        '/',
        '/evenements',
        '/connexion',
        '/inscription',
        '/contact',
        '/conditions',
        '/confidentialite',
        '/blog',
        '/organisateur',
        '/profile',
        '/tickets/my-tickets',
        '/check-in'
      ],
      ignore: ['/app']
    },
    // Configuration pour éviter les erreurs de build
    experimental: {
      wasm: false
    }
  },
  
  routeRules: {
    // Pages statiques - pré-générées au build time
    '/': { prerender: true },
    '/evenements': { prerender: true },
    '/connexion': { prerender: true },
    '/inscription': { prerender: true },
    '/contact': { prerender: true },
    '/conditions': { prerender: true },
    '/confidentialite': { prerender: true },
    '/blog': { prerender: true },
    '/organisateur': { prerender: true },
    '/profile': { prerender: true },
    '/tickets/my-tickets': { prerender: true },
    '/check-in': { prerender: true },
    
    // Pages dynamiques - rendues côté client uniquement (SPA)
    '/evenements/**': { ssr: false },
    '/invitation/**': { ssr: false },
    '/blog/**': { ssr: false },
    '/organisateur/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/reservation/**': { ssr: false },
    
    // Routes spécifiques pour les formulaires de réservation
    '/evenements/*/reservation/*': { ssr: false, prerender: false },
    
    // Headers de sécurité pour Google OAuth
    '/**': {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none'
      }
    }
  },

  // Configuration des images pour le SEO
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    }
  },

  // Configuration du sitemap
  ...({
    sitemap: {
      hostname: 'https://bisoticket.com',
      gzip: true,
      routes: [
        '/',
        '/evenements',
        '/connexion',
        '/inscription',
        '/contact'
      ]
    }
  } as any)
})