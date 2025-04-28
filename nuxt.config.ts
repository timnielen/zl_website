import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css'
  ],
  ui: {
    colorMode: false
  },
  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  nitro: {
    prerender: {
      crawlLinks: true
    },
  },

  compatibilityDate: '2024-08-07',
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/content",
    "@nuxtjs/sitemap"
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        {
          name: "google-site-verification",
          content: "9B9kaUYY018Ogjp0lgrl5orU4oCHohKrdtzYdT1m0YI"
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
    SUPABASE_PRIVATE_KEY: process.env.SUPABASE_PRIVATE_KEY,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    REGISTRATION_IS_OPEN: process.env.REGISTRATION_IS_OPEN,
    YEAR: process.env.YEAR
  }
})