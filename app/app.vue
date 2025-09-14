<template>
  <!-- Background fixe -->
  <div class="fixed inset-0 bg-white dark:bg-gray-950">
    <div class="absolute inset-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="pixel-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" class="fill-blue-500/20 dark:fill-blue-400/10" />
          <rect x="8" y="4" width="1" height="1" class="fill-blue-500/30 dark:fill-blue-400/15" />
          <rect x="16" y="8" width="1" height="1" class="fill-blue-500/20 dark:fill-blue-400/10" />
          <rect x="4" y="12" width="1" height="1" class="fill-blue-500/30 dark:fill-blue-400/15" />
          <rect x="12" y="16" width="1" height="1" class="fill-blue-500/20 dark:fill-blue-400/10" />
          
          <rect x="4" y="0" width="1" height="1" class="fill-purple-500/20 dark:fill-purple-400/10" />
          <rect x="12" y="4" width="1" height="1" class="fill-purple-500/30 dark:fill-purple-400/15" />
          <rect x="0" y="8" width="1" height="1" class="fill-purple-500/20 dark:fill-purple-400/10" />
          <rect x="8" y="12" width="1" height="1" class="fill-purple-500/30 dark:fill-purple-400/15" />
          <rect x="16" y="16" width="1" height="1" class="fill-purple-500/20 dark:fill-purple-400/10" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#pixel-pattern)" />
      </svg>
    </div>
    <div class="absolute inset-0 bg-gradient-to-b from-white via-white/0 to-white dark:from-gray-950 dark:via-gray-950/0 dark:to-gray-950" />
  </div>

  
  <!-- Contenu scrollable -->
  <div class="relative z-10 min-h-screen">
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script setup>
// Background pattern défini directement dans le template
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
