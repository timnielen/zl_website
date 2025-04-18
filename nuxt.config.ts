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

  compatibilityDate: '2024-08-07',
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/content"],

  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&display=swap' }]
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