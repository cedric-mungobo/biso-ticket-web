<template>
  <section 
    class="py-4 px-2 relative z-10 bg-white"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{ opacity: 1, y: 0 }"
    :delay="200"
    :duration="1200"
  >
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
        Livre d'Or
      </h2>
      
      <!-- Formulaire de message -->
      <div class="border-2 border-primary-100 rounded-2xl p-8 mb-8 hover:shadow-sm transition-all duration-500">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">
          Laissez un message 
        </h3>
        <p class="text-gray-600 mb-6">
          Partagez vos vœux et vos félicitations 
        </p>
        <textarea
          v-model="guestBookContent"
          rows="4"
          maxlength="2000"
          placeholder="Votre message pour les mariés (≤ 2000 caractères)"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-500 text-gray-700 transition-all duration-300"
        />
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-gray-500">{{ guestBookContent.length }}/2000</span>
          <UButton 
            :disabled="!canSubmitMessage || submittingMessage" 
            :loading="submittingMessage" 
            @click="submitGuestBookMessage"
            color="primary"
          >
            {{ submittingMessage ? 'Envoi en cours...' : 'Envoyer le message' }}
          </UButton>
        </div>
      </div>

      <!-- Messages des invités -->
      <div 
        class="rounded-2xl p-0"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
      >
        <h3 class="text-xl font-semibold mb-6 text-gray-800 text-center">
          Messages des invités
        </h3>
        <div v-if="guestMessages.length > 0" class="space-y-4">
          <!-- Première rangée -->
          <MarqueeCards 
            :messages="guestMessages"
            :speed="4000"
            @message-click="handleMessageClick"
          />
          <!-- Deuxième rangée (sens inverse) -->
          <div class="w-full mx-auto max-w-5xl overflow-hidden relative">
            <div class="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
            <div class="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-5 pb-10">
              <div 
                v-for="(message, index) in [...guestMessages, ...guestMessages]" 
                :key="`reverse-${message.id}-${index}`"
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
            <div class="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          <p>Aucun message pour le moment.</p>
          <p class="text-sm mt-2">Soyez le premier à laisser un message !</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils'
import { useGuestBook } from '~/composables/useGuestBook'

interface Props {
  token?: string
  slug?: string
  eventId?: number
}

const props = defineProps<Props>()

// Guest book (public API) via composable
const tokenRef = computed(() => props.token)
const slugRef = computed(() => props.slug)
const eventIdRef = computed(() => props.eventId)

const {
  guestBookContent,
  submittingMessage,
  canSubmitMessage,
  submitGuestBookMessage,
  guestMessages,
  loadGuestMessages
} = useGuestBook({ token: tokenRef, slug: slugRef, eventId: eventIdRef })

// Gestion du clic sur un message
const handleMessageClick = (message: any) => {
  console.log('Message cliqué:', message)
  // Ici vous pouvez ajouter une logique pour afficher le message complet ou autre action
}

// Charger les messages au montage
onMounted(async () => {
  await loadGuestMessages()
})
</script>

<style scoped>
/* Styles pour le marquee des messages */
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

.marquee-reverse {
  animation-direction: reverse;
}
</style>
