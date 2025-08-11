<template>
  <div class="font-display bg-primary-50 relative min-h-screen">
    <!-- Gradient mesh background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-primary-100/30 to-secondary-100/20"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.08),transparent_40%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,113,108,0.06),transparent_40%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,197,253,0.04),transparent_60%)]"></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>