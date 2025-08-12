<template>
  <article class="rounded-xl border bg-white transition-all hover:shadow-lg border-primary-400 hover:border-primary-300 group">
    <div class="p-4">
    

      <!-- Titre du service -->
      <h3 class="text-[15px] leading-5 md:text-base font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-200">
        {{ service.title }}
      </h3>
 <!-- Description du service -->
 <p class="text-sm text-gray-600 mt-3 mb-4">
        {{ service.description }}
      </p>
      <!-- Image/icône du service -->
      <div class="rounded-lg overflow-hidden aspect-video w-full group-hover:scale-[1.02] transition-transform duration-300">
        <div :class="`h-full w-full bg-gradient-to-br ${service.gradient.from} ${service.gradient.to} flex items-center justify-center`">
          <svg class="w-16 h-16" :class="service.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon"></path>
          </svg>
        </div>
      </div>

     

      <!-- Actions -->
      <div class="flex mt-2 justify-between items-center">
        <span class="text-sm text-gray-500">{{ service.tag }}</span>
        <NuxtLink 
          to="/organisateur"
          class="text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline transition-all duration-200"
        >
          {{ service.cta }} →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Service {
  id: string
  badge: {
    text: string
    color: string
    bgColor: string
    borderColor: string
  }
  title: string
  description: string
  icon: string
  gradient: {
    from: string
    to: string
  }
  iconColor: string
  tag: string
  cta: string
}

interface Props {
  service: Service
}

defineProps<Props>()
</script>
