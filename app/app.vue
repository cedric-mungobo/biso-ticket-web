<template>
  <!-- Background fixe -->
  <div class="fixed inset-0 bg-white dark:bg-gray-950">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.15)_0%,rgba(148,163,184,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.15)_0%,rgba(15,23,42,0)_70%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0)_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0)_60%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_60%)]" />
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
