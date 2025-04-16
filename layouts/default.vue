<template>
  <div class="relative h-full min-h-svh">
    <AppHeader />
    <div class=" pb-24">
      <!-- <main class="max-w-7xl mx-auto md:rounded-md py-5 p-2"> -->
      <main class="">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>