<template>
  <!-- Background fixe -->
  <div class="fixed inset-0 bg-white dark:bg-gray-950">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_70%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_70%)]" />
    <div 
      class="absolute inset-0 opacity-[0.3] dark:opacity-[0.15] backdrop-blur-[100px]"
      :style="{ backgroundImage: noiseBg }"
    />
    <div class="absolute inset-0 backdrop-blur-[100px]" />
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
const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
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
