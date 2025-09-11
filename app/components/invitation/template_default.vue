<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Parallax -->
    <section class="relative h-screen overflow-hidden"
      :style="{
        transform: `scale(${heroScale}) rotate(${heroRotate}deg)`
      }"
    >
      <!-- Background Image with Parallax Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-indigo-200/30"
        :style="{
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundImage: `url('${eventImage }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      />

      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/40" />

      <!-- Hero Content (animation & texte inspirés de HeroAnimated.vue) -->
      <div class="relative z-10 h-full flex items-center">
        <article class="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div :class="`transition-all duration-700 text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl leading-[100%] pt-24 sm:pt-36 font-semibold tracking-tight">
              {{ eventTitle }}
            </h1>
            <p v-if="eventDateText || eventLocation" class="text-lg sm:text-xl opacity-90 mt-4">
              <span v-if="eventDateText">{{ eventDateText }}</span>
              <span v-if="eventDateText && eventLocation"> • </span>
              <span v-if="eventLocation">{{ eventLocation }}</span>
            </p>
          
          </div>
        </article>
      </div>
    </section>

    <!-- Personal Invitation Card -->
    <section class="py-20 px-1"
      :style="{
        transform: `scale(${cardScale}) rotate(${cardRotate}deg)`,
        backgroundImage: `url('${eventImage }')`
      }"
    >
      <div class="max-w-4xl mx-auto">
        <div :class="`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`">
          <div class=" border border-primary-500 rounded-xl">
            <div class="md:p-12 p-4 text-center">

              <div class="text-lg md:text-xl leading-relaxed space-y-6 text-gray-600">
                <p v-if="guestMessageText" class="whitespace-pre-line">{{ guestMessageText }}</p>
                <template v-else>
                  <p>
                    C'est avec un immense plaisir que nous vous invitons à
                    <strong class="text-gray-900">{{ eventTitle }}</strong>.
                  </p>
                </template>

               
              </div>
             

            
            </div>

            
          </div>
          <div class="mt-4 pt-1 border-t border-purple-200/20 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  @click="handleDownloadInvitation"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download class="w-5 h-5" />
                  Télécharger l'invitation
                </button>
                <button
                  @click="handleDownloadImage"
                  class="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 text-lg rounded-lg bg-transparent transition-colors flex items-center justify-center gap-2"
                >
                  <Download class="w-5 h-5" />
                  Télécharger l'image de design
                </button>
              </div>
        </div>
      </div>
    </section>

    <!-- Invitation Body avec hauteur fixe et scroll -->
    <div class="h-[90dvh]">
      <InvitationBody
        :invitation="invitation"
        :event="event"
        :scroll-y="scrollY"
        :background-image="`url('${eventImage}')`"
        :is-client="true"
        :background-size="'100% 100%'"
        @download-invitation="handleDownloadInvitation"
      />
    </div>

    <div class="max-w-4xl mx-auto mt-2 px-4 md:px-0">
                <label class="block text-sm text-gray-700 mb-1">Laissez-nous un message (livre d'or)</label>
                <textarea
                  v-model="guestBookContent"
                  rows="4"
                  maxlength="2000"
                  placeholder="Votre message pour l'organisateur (≤ 2000 caractères)"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
                <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{{ guestBookContent.length }}/2000</span>
                  <UButton size="xs" color="primary" :disabled="!canSubmitMessage || submittingMessage" :loading="submittingMessage" @click="submitGuestBookMessage">Envoyer</UButton>
                </div>
              </div>

    <!-- Program Section -->
    <section class="py-20 px-4 bg-gray-100/30">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16">Programme de la Soirée</h2>

        <div class="space-y-8">
          <div class="flex items-start gap-6">
            <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
              19h
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Cocktail de Bienvenue</h3>
              <p class="text-gray-600">Accueil des invités avec champagne et amuse-bouches raffinés</p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
              20h
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Dîner Gastronomique</h3>
              <p class="text-gray-600">Menu 5 services préparé par un chef étoilé</p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
              22h
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Spectacle & Divertissement</h3>
              <p class="text-gray-600">Performance artistique exclusive et musique live</p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
              00h
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Soirée Dansante</h3>
              <p class="text-gray-600">DJ set et piste de danse jusqu'au petit matin</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Guest book random message -->
    <section class="py-16 px-4 bg-gray-100/30">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Livre d'or</h2>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div v-if="randomMessageLoading" class="space-y-2">
            <div class="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div class="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
          </div>
          <p v-else-if="randomMessageContent" class="text-gray-800 whitespace-pre-line">“{{ randomMessageContent }}”</p>
          <p v-else class="text-gray-500">Aucun message pour l'instant.</p>
          <div class="text-right mt-4">
            <UButton size="xs" variant="ghost" @click="loadRandomMessage">Voir un autre message</UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-primary-900 text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h3 class="text-2xl font-bold">Organisez votre événement avec Biso Ticket</h3>
        <p class="opacity-90 max-w-2xl mx-auto">
          Créez des invitations élégantes, partagez-les en un clic et suivez les confirmations en temps réel.
        </p>
        <div class="flex items-center justify-center gap-3">
          <UButton color="primary" :to="'/organisateur/create-event'">Organiser mon événement</UButton>
          <UButton variant="outline" color="neutral" :to="'/contact'">Nous contacter</UButton>
        </div>
        <p class="text-sm opacity-75">© {{ currentYear }} Biso Ticket. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Star, Heart, Download } from 'lucide-vue-next'

const props = defineProps<{ invitation: any; event?: any }>()

const scrollY = ref(0)
const isVisible = ref(false)
const handleScroll = () => {
  scrollY.value = window.scrollY
}

const handleDownloadInvitation = () => {
  const invitationText = `
SOIRÉE ÉLÉGANCE
Une invitation personnelle

Cher(e) [Nom de l'Invité],

C'est avec un immense plaisir que nous vous invitons à notre Soirée Élégance, 
un événement exceptionnel qui se déroulera le Samedi 15 Mars 2025 
au prestigieux Château de Versailles.

Votre présence illuminerait cette soirée magique où se mêleront gastronomie raffinée, 
spectacles artistiques et moments de convivialité dans un cadre somptueux.

Horaires: 19h00 à 02h00
Lieu: Château de Versailles
Tenue: Soirée exigée

Confirmation souhaitée avant le 1er Mars 2025

Avec nos sentiments les plus chaleureux,
L'équipe Soirée Élégance
  `

  const blob = new Blob([invitationText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'invitation-soiree-elegance.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleDownloadImage = () => {
  const link = document.createElement('a')
  link.href = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  link.download = 'elegant-event-venue-design.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleCancelInvitation = () => {
  if (confirm("Êtes-vous sûr de vouloir annuler votre invitation ?")) {
    alert("Votre invitation a été annulée. Nous espérons vous revoir bientôt !")
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadRandomMessage()
  // Trigger animations on mount
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const guestName = computed(() => props.invitation?.guestName || props.invitation?.guest_name || 'Invité')
const guestTableName = computed(() => props.invitation?.guestTableName || props.invitation?.guest_table_name || '')
const statusRaw = computed(() => String(props.invitation?.status || 'pending').toLowerCase())
const statusText = computed(() => {
  if (statusRaw.value === 'confirmed') return 'Confirmé'
  if (statusRaw.value === 'sent') return 'Envoyé'
  if (statusRaw.value === 'cancelled') return 'Annulé'
  return 'En attente'
})
const statusClass = computed(() => {
  if (statusRaw.value === 'confirmed') return 'bg-primary-50 text-primary-700 border border-primary-100'
  if (statusRaw.value === 'sent') return 'bg-amber-50 text-amber-700 border border-amber-100'
  if (statusRaw.value === 'cancelled') return 'bg-rose-50 text-rose-700 border border-rose-100'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
})
const dotClass = computed(() => {
  if (statusRaw.value === 'confirmed') return 'bg-primary-500'
  if (statusRaw.value === 'sent') return 'bg-amber-500'
  if (statusRaw.value === 'cancelled') return 'bg-rose-500'
  return 'bg-gray-400'
})

const eventTitle = computed(() => props.event?.title || props.invitation?.event?.title || 'Évènement')
const eventLocation = computed(() => props.event?.location || props.invitation?.event?.location || '')
const eventImage = computed(() => {
  // Priorité à l'image de l'événement, sinon image du modèle
  const eventImg = props.event?.imageUrl || props.invitation?.event?.imageUrl
  if (eventImg) return eventImg
  
  // Image du modèle basée sur le design_key
  const designKey = props.invitation?.invitationTemplate?.designKey || 
                   props.invitation?.invitation_template?.design_key || 
                   'template_default'
  return `/models/${designKey}.png`
})
const guestMessageText = computed(() => props.event?.settings?.guestMessage || props.event?.settings?.guest_message || props.invitation?.event?.settings?.guestMessage || props.invitation?.event?.settings?.guest_message || '')
const eventStartsAt = computed(() => props.event?.startsAt || props.invitation?.event?.startsAt)
const eventEndsAt = computed(() => props.event?.endsAt || props.invitation?.event?.endsAt)
const eventDateText = computed(() => {
  const start = eventStartsAt.value ? new Date(eventStartsAt.value) : null
  const end = eventEndsAt.value ? new Date(eventEndsAt.value) : null
  if (!start) return ''
  const opts: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'short' }
  const startText = new Intl.DateTimeFormat(undefined, opts).format(start)
  const endText = end ? new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(end) : ''
  return end ? `${startText} – ${endText}` : startText
})

const timeRange = computed(() => {
  const start = eventStartsAt.value ? new Date(eventStartsAt.value) : null
  const end = eventEndsAt.value ? new Date(eventEndsAt.value) : null
  if (!start || !end) return ''
  const startText = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(start)
  const endText = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(end)
  return `${startText} à ${endText}`
})

const copyLink = async () => {
  const url = location.href
  try {
    await navigator.clipboard.writeText(url)
    useToast().add({ title: 'Copié', description: 'Lien copié dans le presse‑papiers.', color: 'success' })
  } catch {
    useToast().add({ title: 'Erreur', description: 'Impossible de copier.', color: 'error' })
  }
}

const shareLink = async () => {
  const url = location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: eventTitle.value, url })
    } catch {}
  } else {
    await copyLink()
  }
}

const scrollProgress = computed(() => {
  if (process.server) return 0
  const windowHeight = window.innerHeight
  const containerHeight = windowHeight * 2
  const maxScroll = Math.max(containerHeight - windowHeight, 1)
  return Math.min(Math.max(scrollY.value / maxScroll, 0), 1)
})
const heroScale = computed(() => 1 - (scrollProgress.value * 0.2))
const heroRotate = computed(() => scrollProgress.value * -5)
const cardScale = computed(() => {
  const progress = Math.min(scrollProgress.value / 0.8, 1)
  return 0.8 + (progress * 0.2)
})
const cardRotate = computed(() => {
  const progress = Math.min(scrollProgress.value / 0.8, 1)
  return 5 - (progress * 5)
})

// Guest book (public API) via composable
const slugRef = computed(() => props.event?.slug || props.invitation?.event?.slug)
const eventIdRef = computed(() => props.event?.id || props.invitation?.event?.id)
const tokenRef = computed(() => props.invitation?.token)
const {
  randomMessageContent,
  randomMessageLoading,
  guestBookContent,
  submittingMessage,
  canSubmitMessage,
  loadRandomMessage,
  submitGuestBookMessage
} = useGuestBook({ slug: slugRef, eventId: eventIdRef, token: tokenRef })

const currentYear = computed(() => new Date().getFullYear())
</script>


<style scoped>
.transition-all {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>