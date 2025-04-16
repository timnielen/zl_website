import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      source: 'pages/**/*.md',
      type: 'page'
    }),
    main: defineCollection({
      source: 'main/*.md',
      type: 'page'
    }),
    QAndA: defineCollection({
      source: 'main/QAndA/*.json',
      type: 'data',
      schema: z.object({
        label: z.string(),
        icon: z.string(),
        content: z.string()
      })
    }),
    carousel: defineCollection({
      source: 'main/carousel/*.json',
      type: 'data',
      schema: z.object({
        images: z.string().array()
      })
    }),
  }
})