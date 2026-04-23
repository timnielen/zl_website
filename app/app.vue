<template>
  <NuxtLayout>
  <UApp :toaster="{position: 'top-center'}" :locale="de" >
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>


<script setup lang="ts">
import { de } from '@nuxt/ui/locale'
</script>