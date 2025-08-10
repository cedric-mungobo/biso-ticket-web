// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/index.css'],
  plugins: ['~/plugins/preline.client.ts'],
  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils'
  ],
  
  // Configuration Tailwind CSS avec couleurs personnalisées
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              '50': '#f5f0ff',
              '100': '#ede4ff',
              '200': '#dccdff',
              '300': '#c5a5ff',
              '400': '#aa72ff',
              '500': '#933aff',
              '600': '#8b12ff',
              '700': '#7f01ff',
              '800': '#6a00d6',
              '900': '#5802b0',
              '950': '#350078',
            },
            secondary: {
              '50': '#fcf4ff',
              '100': '#f8e9fe',
              '200': '#f1d2fc',
              '300': '#e9aff8',
              '400': '#dd7ff3',
              '500': '#c439e5',
              '600': '#b02ecb',
              '700': '#9522a9',
              '800': '#7b1e8a',
              '900': '#671e71',
              '950': '#43074b',
            },
          },
        },
      },
    },
  },
  
  app: {
    head: {
      title: 'Biso Ticket', // default fallback title

      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  }
})