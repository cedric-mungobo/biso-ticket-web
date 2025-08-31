<template>
  <div class="font-display bg-secondary-50 relative min-h-[100dvh] w-full">
    <!-- Gradient mesh background -->
    <div class="absolute inset-0 bg-gradint-to-br from-secondary-50 via-secondary-100/30 to-secondary-200/20"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.08),transparent_40%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,113,108,0.06),transparent_40%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.04),transparent_60%)]"></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <UApp>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </div>
    
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
