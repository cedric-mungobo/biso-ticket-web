<template>
  <section class="bg-secondary border-b pb-16 lg:pb-24">
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center gap-8 md:gap-12">
        <div class="flex flex-col items-center text-center gap-4 max-w-xl">
          <Tagline variant="ghost">Trusted by 10K+ remote teams</Tagline>
        </div>

        <div class="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_12.5%,black_87.5%,transparent_100%)]">
          <div class="animate-infinite-scroll flex w-max items-center">
            <div
              v-for="(logoItem, index) in [...logosData, ...logosData]"
              :key="`logo-wrapper-${logoItem.id}-${index}`"
              class="w-48 flex-shrink-0 place-items-center"
            >
              <PlaceholderLogo class="w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PlaceholderLogo from '~/components/pro-blocks/placeholder-logo/PlaceholderLogo.vue'
import Tagline from '~/components/pro-blocks/landing-page/Tagline.vue'

const logosData = [
  { id: 1, component: PlaceholderLogo },
  { id: 2, component: PlaceholderLogo },
  { id: 3, component: PlaceholderLogo },
  { id: 4, component: PlaceholderLogo },
  { id: 5, component: PlaceholderLogo },
  { id: 6, component: PlaceholderLogo },
  { id: 7, component: PlaceholderLogo },
  { id: 8, component: PlaceholderLogo },
]
</script>

<style scoped>
@keyframes infinite-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50%));
  }
}

.animate-infinite-scroll {
  animation: infinite-scroll 20s linear infinite;
  will-change: transform;
}
</style>
