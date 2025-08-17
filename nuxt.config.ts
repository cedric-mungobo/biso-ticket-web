import { fileURLToPath } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/index.css'],
  plugins: ['~/plugins/preline.client.ts'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
 
  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-auth-utils',
    'nuxt-qrcode'
  ],
  
  // Configuration des alias de chemins
  alias: {
    '~': fileURLToPath(new URL('./app', import.meta.url)),
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },

  

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Biso Ticket', // default fallback title

      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    
    // Variables publiques (côté client et serveur)
    public: {
      apiBaseUrl: 'https://api.bisoticket.com/api/v1'
    }
  }
})