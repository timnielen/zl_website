<template>
  <div class="h-full flex flex-col min-h-svh">
    <AppHeader />
      <!-- <main class="max-w-7xl mx-auto md:rounded-md py-5 p-2"> -->
      <main class="">
        <slot />
      </main>
    <AppFooter />
  </div>
</template>