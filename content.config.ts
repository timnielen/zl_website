import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      source: '**.md',
      // Specify the type of content in this collection
      type: 'page'
    })
  }
})