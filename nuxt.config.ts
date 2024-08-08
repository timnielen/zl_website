export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-08-07',
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/content"],

  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&display=swap' }]
    }
  }
})