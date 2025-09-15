<template>
    <div class="min-h-screen ">
      <!-- Hero Section avec parallaxe simple -->
    <section class="relative h-screen overflow-hidden">
      <!-- Image de fond avec parallaxe simple -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
        :style="{
          backgroundImage: `url('${eventImage}')`,
          transform: `translateY(${scrollY * 0.5}px)`
        }"
      />
      
      <!-- Overlay fort pour la visibilité -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <!-- Contenu principal positionné en bas -->
      <div class="absolute bottom-0 left-0 right-0 z-10 pb-16 px-4">
        <div class="text-center text-white max-w-4xl mx-auto">
          <div :class="`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`">
            <!-- Titre principal -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight drop-shadow-2xl">
              Mariage de
            </h1>
            
            <!-- Noms des mariés -->
            <div class="text-3xl sm:text-4xl lg:text-5xl font-serif font-light mb-6">
              <div class="inline-block transform hover:scale-105 transition-all duration-500">
                <span class="text-white drop-shadow-2xl font-semibold">{{ groomName }}</span>
                <span class="mx-4 text-2xl drop-shadow-2xl">&</span>
                <span class="text-white drop-shadow-2xl font-semibold">{{ brideName }}</span>
              </div>
            </div>
            
            <!-- Date et lieu -->
            <div class="text-lg sm:text-xl font-light space-y-1">
              <p class="font-bold drop-shadow-2xl text-white">{{ eventDateText }}</p>
              <p class="text-white/90 drop-shadow-2xl">{{ eventLocation }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section d'invitation simplifiée -->
    <section 
      class="py-20 px-2"
      v-motion
      :initial="{ opacity: 0, x: 80 }"
      :visible="{ opacity: 1, x: 0 }"
      :delay="600"
      :duration="1800"
      :key="`invitation-${isVisible}`"
    >
      <div class="max-w-4xl mx-auto">
        <div class="p-8 sm:p-12 border-2 rounded-2xl border-primary-100">
          <!-- Titre -->
          <h2 class="text-5xl font-serif font-bold text-center mb-12 text-gray-800 tracking-wide">
            Invitation
          </h2>
          
          <!-- Texte de l'invitation -->
          <div class="text-center">
            <div class="text-lg sm:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto font-serif">
              <p v-if="guestMessageText" class="whitespace-pre-line font-medium">{{ guestMessageText }}</p>
                <template v-else>
                <p class="text-2xl font-serif text-gray-800 mb-6 italic">
                  C'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.
                </p>
                <p class="text-lg mb-4 font-serif">
                  Nous serions honorés de votre présence pour célébrer notre mariage religieux le 
                  <strong class="text-rose-600 font-semibold">{{ eventDateText }}</strong> 
                  en l'église 
                  <strong class="text-rose-600 font-semibold">{{ churchName }}</strong> 
                  à 
                  <strong class="text-rose-600 font-semibold">{{ churchLocation }}</strong>.
                </p>
                <p class="text-lg font-serif">
                  À l'issue de la cérémonie, nous vous invitons à partager un moment de convivialité 
                  autour d'un vin d'honneur au 
                  <strong class="text-rose-600 font-semibold">{{ receptionLocation }}</strong>.
                  </p>
                </template>
            </div>
          </div>
          
          <!-- Bouton de téléchargement -->
          <div class="text-center mt-12">
            <UButton 
                  @click="handleDownloadInvitation"
              color="primary" 
              size="lg" 
              class="px-8 py-3 font-serif"
                >
              <Download class="w-5 h-5 mr-2" />
                  Télécharger l'invitation
            </UButton>
              </div>
        </div>
      </div>
    </section>


    <!-- Section livre d'or -->
    <section 
      class="py-4 px-4"
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
        <div class="border-2 border-primary-100 rounded-2xl  p-8 mb-8 hover:shadow-sm transition-all duration-500">
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

        <!-- Messages des autres invités -->
        <div 
          class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0 }"
          :delay="200"
          :duration="1200"
        >
          <h3 class="text-xl font-semibold mb-6 text-gray-800">
            Messages des invités
          </h3>
          <div v-if="guestMessages.length > 0" class="space-y-4">
            <div 
              v-for="(message, index) in guestMessages" 
              :key="message.id"
              class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-primary-300 hover:shadow-md transition-all duration-300"
            >
              <p class="text-gray-700 italic">"{{ message.content }}"</p>
              <p class="text-sm text-gray-500 mt-2">{{ message.guest_name || 'Invité anonyme' }}</p>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-8">
            <p>Aucun message pour le moment. Soyez le premier à laisser un message !</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h3 class="text-2xl font-serif font-bold">
          Organisez votre mariage avec Biso Ticket
        </h3>
        <p class="opacity-90 max-w-2xl mx-auto">
          Créez des invitations de mariage élégantes, gérez vos invités et suivez les confirmations en temps réel.
        </p>
        <div class="flex items-center justify-center gap-3">
          <UButton color="secondary" class="text-white" variant="solid" :to="'/organisateur'">Organiser mon mariage</UButton>
          <UButton color="neutral" class="text-white" variant="solid" :to="'/contact'">Nous contacter</UButton>
        </div>
        <p class="text-sm opacity-75">
          © {{ currentYear }} Biso Ticket. Tous droits réservés.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Star, Heart, Download } from 'lucide-vue-next'
import { useGuestBook } from '~/composables/useGuestBook'

const props = defineProps<{ invitation: any; event?: any }>()

const scrollY = ref(0)
const isVisible = ref(false)
const guestMessages = ref<any[]>([])

const handleScroll = () => {
  scrollY.value = window.scrollY
}

// Données dynamiques pour le mariage
const groomName = computed(() => 'Steve')
const brideName = computed(() => 'Stéphanie')
const eventDate = computed(() => 'Samedi 13 Novembre 2025')
const eventTime = computed(() => '19h30')
const eventLocation = computed(() => 'Grand Hôtel de Kinshasa')
const churchName = computed(() => 'Église Notre-Dame de la Paix')
const churchLocation = computed(() => 'Avenue de la Paix, Kinshasa')
const receptionLocation = computed(() => 'Grand Hôtel de Kinshasa')
const receptionTime = computed(() => '21h00')

const handleDownloadInvitation = () => {
  const invitationText = `
MARIAGE DE STEVE & STÉPHANIE
Invitation au Mariage Religieux

Cher(e) ${props.invitation?.guestName || 'Invité'},

C'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.

Nous serions honorés de votre présence pour célébrer notre mariage religieux le 
${eventDate.value} à ${eventTime.value} en l'église ${churchName.value} à ${churchLocation.value}.

À l'issue de la cérémonie, nous vous invitons à partager un moment de convivialité 
autour d'un vin d'honneur au ${receptionLocation.value}.

Avec toute notre affection,
Steve & Stéphanie
  `

  const blob = new Blob([invitationText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'invitation-mariage-steve-stephanie.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleDownloadImage = () => {
  const link = document.createElement('a')
  link.href = eventImage.value || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  link.download = 'mariage-steve-stephanie.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

    onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // Trigger animations on mount
  setTimeout(() => {
    isVisible.value = true
  }, 100)
      
      // Forcer le déclenchement des animations v-motion
      await nextTick()
      
      // Confirmation automatique si pas encore confirmé
      await autoConfirmPresence()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
// Computed properties pour les données de l'événement
const eventTitle = computed(() => `Mariage de ${groomName.value} & ${brideName.value}`)
const eventImage = computed(() => {
  // Priorité à l'image de l'événement, sinon image par défaut pour mariage
  const eventImg = props.event?.imageUrl || props.invitation?.event?.imageUrl
  if (eventImg) return eventImg
  
  // Image par défaut pour mariage
  return 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
})

const eventDateText = computed(() => eventDate.value)
    const guestMessageText = computed(() => {
      // Priorité à l'événement passé en props
      if (props.event?.settings?.guestMessage) {
        return props.event.settings.guestMessage
      }
      // Sinon, chercher dans l'invitation
      if (props.invitation?.event?.settings?.guestMessage) {
        return props.invitation.event.settings.guestMessage
      }
      // Fallback vers les anciennes clés
      return props.event?.settings?.guest_message || 
             props.invitation?.event?.settings?.guest_message || 
             ''
})

// Guest book (public API) via composable
const tokenRef = computed(() => props.invitation?.token)
const slugRef = computed(() => props.event?.slug || props.invitation?.event?.slug)
const eventIdRef = computed(() => props.event?.id || props.invitation?.event?.id)
const {
  guestBookContent,
  submittingMessage,
  canSubmitMessage,
  submitGuestBookMessage,
  confirming,
  confirm: confirmPresenceBase
} = useGuestBook({ token: tokenRef, slug: slugRef, eventId: eventIdRef })

    // Wrapper pour la fonction de confirmation qui met à jour les props
    const confirmPresence = async () => {
      await confirmPresenceBase()
      // Mettre à jour les données du composant parent
      if (props.invitation) {
        props.invitation.status = 'confirmed'
        props.invitation.confirmedAt = new Date().toISOString()
      }
    }

    // Confirmation automatique au montage
    const autoConfirmPresence = async () => {
      // Vérifier si pas encore confirmé
      if (!isConfirmedFromProps.value && tokenRef.value) {
        try {
          console.log('Confirmation automatique de la présence...')
          await confirmPresenceBase()
          // Mettre à jour les données du composant parent
          if (props.invitation) {
            props.invitation.status = 'confirmed'
            props.invitation.confirmedAt = new Date().toISOString()
          }
          console.log('Présence confirmée automatiquement')
        } catch (error) {
          console.warn('Erreur lors de la confirmation automatique:', error)
        }
      }
    }

// Utiliser les données déjà chargées depuis le composant parent
const invitationData = computed(() => props.invitation)
const isConfirmedFromProps = computed(() => invitationData.value?.status === 'confirmed')

const currentYear = computed(() => new Date().getFullYear())
</script>


<style scoped>
.transition-all {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimisation simple pour le parallaxe */
.parallax-bg {
  will-change: transform;
  transform: translateZ(0);
}

/* Animations personnalisées */
.animate-fade-in-right {
  animation: fadeInRight 1.2s ease-out forwards;
  opacity: 0;
  transform: translateX(50px);
}

.animate-fade-in-up {
  animation: fadeInUp 1.2s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>