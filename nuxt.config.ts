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
      ]
    }
  },
  
  // Configuration runtime pour les variables d'environnement
  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    apiSecret: '',
    recaptchaSecretKey: '6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb', // Remplacez par votre clé secrète
    
    // Variables publiques (côté client et serveur)
    public: {
      apiBaseUrl: 'https://api.bisoticket.com/api',
      recaptchaSiteKey: '6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4', // Remplacez par votre clé site
      siteUrl: 'https://bisoticket.com'
    }
  },

  // Configuration SEO et performances
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
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
  sitemap: {
    hostname: 'https://bisoticket.com',
    gzip: true,
    routes: async () => {
      // Routes statiques
      const staticRoutes = [
        '/',
        '/evenements',
        '/connexion',
        '/inscription',
        '/contact'
      ]
      
      // Récupération des événements depuis l'API
      try {
        const { $myFetch } = useNuxtApp()
        const eventsResponse = await $myFetch('/public/events', {
          method: 'GET',
          params: { per_page: 1000, status: 'active' }
        })
        
        const eventRoutes = eventsResponse?.data?.items?.map((event: any) => 
          `/evenements/${event.slug}`
        ) || []
        
        return [...staticRoutes, ...eventRoutes]
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error)
        return staticRoutes
      }
    }
  }
})