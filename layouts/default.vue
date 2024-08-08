<template>
    <div class="relative h-full min-h-svh">
      <AppHeader />
      <div class=" pb-24">
      <main class="max-w-7xl lg:mx-auto  md:rounded-md py-5 p-2">
        <slot />
      </main>
      </div>
      <AppFooter />
    </div>
  </template>