<template>
  <div class="w-full mx-auto max-w-5xl overflow-hidden relative">
    <!-- Gradient gauche -->
    <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
    
    <!-- Container du marquee -->
    <div 
      class="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5"
      :style="{ 
        animationPlayState: stopScroll ? 'paused' : 'running'
      }"
    >
      <!-- Dupliquer les messages pour l'effet de boucle -->
      <div 
        v-for="(message, index) in [...messages, ...messages]" 
        :key="`${message.id}-${index}`"
        class="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 cursor-pointer"
        @click="handleMessageClick(message)"
      >
        <div class="flex gap-2">
          <!-- Avatar avec image ou initiales -->
          <img 
            v-if="message.authorImage" 
            class="size-11 rounded-full" 
            :src="message.authorImage" 
            :alt="message.authorName || 'Invité'"
          >
          <div 
            v-else
            class="size-11 rounded-full bg-primary-200 flex items-center justify-center"
          >
            <span class="text-primary-600 font-semibold text-sm">
              {{ message.authorName?.charAt(0)?.toUpperCase() || 'A' }}
            </span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1">
              <p class="font-semibold text-gray-900">{{ message.authorName || 'Invité anonyme' }}</p>
              <svg class="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#8B5CF6" />
              </svg>
            </div>
            <span class="text-xs text-gray-500">Invité</span>
          </div>
        </div>
        <p class="text-sm py-4 text-gray-800">{{ message.content }}</p>
        <div class="flex items-center justify-end text-gray-500 text-xs">
          <p>{{ formatDate(message.createdAt) }}</p>
        </div>
      </div>
    </div>
    
    <!-- Gradient droite -->
    <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: number
  content: string
  authorName: string
  authorImage?: string
  createdAt: string
}

interface MarqueeMessagesProps {
  messages: Message[]
  speed?: number
  pauseOnHover?: boolean
}

interface MarqueeMessagesEmits {
  (e: 'message-click', message: Message): void
}

const props = withDefaults(defineProps<MarqueeMessagesProps>(), {
  speed: 3000,
  pauseOnHover: true
})

const emit = defineEmits<MarqueeMessagesEmits>()

// État pour contrôler la pause
const stopScroll = ref(false)

/**
 * Définit l'état de pause du scroll
 */
const setStopScroll = (value: boolean): void => {
  if (props.pauseOnHover) {
    stopScroll.value = value
  }
}

/**
 * Gère le clic sur un message
 */
const handleMessageClick = (message: Message): void => {
  emit('message-click', message)
}

/**
 * Formate la date de création
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
@keyframes marqueeScroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-inner {
  animation: marqueeScroll 25s linear infinite;
}
</style>
