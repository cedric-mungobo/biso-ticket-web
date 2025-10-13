import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    prerender: {
      routes: [        '/',
        '/connexion',
        '/contact',
        '/evenements',
        '/evenements/evenement-de-test',
        '/evenements/expobeton-rdc-10-edition',
        '/evenements/journee-magique-a-aqua-splash',
        '/evenements/karaoke-jazz',
        '/evenements/lancement-officiel-de-biso-ticket',
        '/evenements/le-futur-de-leducation',
        '/evenements/magie-denfance',
        '/evenements/mariage-de-steven-et-safi',
        '/inscription'],
    },
    // Configuration pour production et hébergement mutualisé
    experimental: {
      wasm: true,
    },
    // Headers pour corriger les MIME types
    routeRules: {
      "/_nuxt/**": {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
      "**/*.{js,mjs}": {
        headers: {
          "Content-Type": "application/javascript",
        },
      },
      "**/*.css": {
        headers: {
          "Content-Type": "text/css",
        },
      },
    },
  },

  // Règles de route pour optimiser le rendu - Configuration hybride SPA/Static
  routeRules: {
    // Pages statiques importantes (pré-générées)
    "/": {
      ssr: false,
      prerender: true,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Frame-Options": "DENY",
      },
    },
    "/evenements": {
      ssr: false,
      prerender: true,
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    },
    "/contact": {
      ssr: false,
      prerender: true,
      headers: {
        "Cache-Control": "public, max-age=7200",
      },
    },

    // Pages d'événements (hybride)
    "/evenements/**": {
      ssr: false,
      // Permettre l'indexation par Google
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "index, follow",
      },
    },

    // Pages de réservation (SPA pur pour les interactions)
    "/evenements/**/reservation/**": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache",
        "X-Robots-Tag": "noindex",
      },
    },

    // Pages d'authentification (pas d'indexation)
    "/connexion": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    "/inscription": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },

    // Pages privées (SPA pur)
    "/organisateur/**": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex",
      },
    },
    "/profile": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex",
      },
    },
    "/tickets/**": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex",
      },
    },
    "/application/**": {
      ssr: false,
      headers: {
        "X-Robots-Tag": "noindex",
      },
    },
  },

  css: ["~/assets/index.css"],
  plugins: ["~/plugins/preline.client.ts"],
  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "nuxt-qrcode",
    "nuxt-pdfmake",
    "@vueuse/motion/nuxt",
    "@nuxtjs/sitemap",
  ],
  ui: {
    colorMode: false,
    // Aligne Nuxt UI sur les palettes définies dans app/assets/index.css
    theme: {
      colors: [
        "primary",
        "secondary",
        "neutral",
        "info",
        "success",
        "warning",
        "error",
      ],
      defaultVariants: {
        color: "primary",
        size: "md",
      },
      transitions: true,
    },
  },

  // Configuration des alias de chemins
  alias: {
    "~": fileURLToPath(new URL("./app", import.meta.url)),
    "@": fileURLToPath(new URL("./app", import.meta.url)),
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    // Configuration pour éviter les erreurs d'hydratation
    keepalive: true,
    head: {
      title: "Passez au digital pour vos événements avec Biso Ticket",
      titleTemplate: "%s - Biso Ticket",
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",

      htmlAttrs: {
        lang: "fr",
      },
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
        },
        // SEO de base
        {
          name: "description",
          content:
            "Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales. Recevez les paiements mobile money, achetez les billets en ligne via mobile money, configuration en 3 minutes.",
        },
        {
          name: "keywords",
          content:
            "événements digitaux, billets en ligne, invitations digitales, mobile money, paiement mobile, gestion événement, vente billets, réservation événement, Kinshasa, RDC, Congo, organisateur événement, ticket en ligne, Orange Money, Airtel Money, M-Pesa",
        },
        { name: "author", content: "Biso Ticket" },
        { name: "robots", content: "index, follow" },

        // Open Graph
        {
          property: "og:title",
          content: "Passez au digital pour vos événements avec Biso Ticket",
        },
        {
          property: "og:description",
          content:
            "Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales. Recevez les paiements mobile money, achetez les billets en ligne via mobile money, configuration en 3 minutes.",
        },
        {
          property: "og:image",
          content: "https://bisoticket.com/images/hero.jpg",
        },
        { property: "og:url", content: "https://bisoticket.com" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Biso Ticket" },
        { property: "og:locale", content: "fr_FR" },

        // Twitter Cards
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@bisoticket" },
        { name: "twitter:creator", content: "@bisoticket" },
        {
          name: "twitter:title",
          content: "Passez au digital pour vos événements avec Biso Ticket",
        },
        {
          name: "twitter:description",
          content:
            "Tout ce dont vous avez besoin pour gérer un événement : vendre vos billets en ligne et envoyer des invitations digitales. Recevez les paiements mobile money, achetez les billets en ligne via mobile money, configuration en 3 minutes.",
        },
        {
          name: "twitter:image",
          content: "https://bisoticket.com/images/hero.jpg",
        },

        // Métadonnées techniques
        { name: "format-detection", content: "telephone=no" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "theme-color", content: "#3b82f6" },
        { name: "msapplication-TileColor", content: "#3b82f6" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true,
        },
      ],
    },
  },

  // Configuration runtime pour les variables d'environnement
  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    apiSecret: "",
    recaptchaSecretKey: "6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb", // Remplacez par votre clé secrète
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

    // Variables publiques (côté client et serveur)
    public: {
      apiBaseUrl: "https://api.bisoticket.com/api",
      recaptchaSiteKey: "6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4", // Remplacez par votre clé site
      googleClientId:
        "35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com",
      siteUrl: "https://bisoticket.com",
      site: {
        url: "https://bisoticket.com",
      },
    },
  },

  // Configuration des images pour le SEO
  // Configuration des images pour le SEO

  image: {
    quality: 80,
    format: ["webp", "avif", "jpeg"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
});
