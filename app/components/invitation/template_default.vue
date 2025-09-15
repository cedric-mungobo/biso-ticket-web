<template>
    <div class="min-h-screen ">
      <!-- Hero Section avec parallaxe simple -->
    <section class="header-image" style="height: 80dvh;">
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
      class="content-section"
      :key="`invitation-${isVisible}`"
    >
      <div class="invitation-content" v-motion
        :initial="{ opacity: 0, x: 80 }"
        :visible="{ opacity: 1, x: 0 }"
        :delay="600"
        :duration="1800">
          <!-- Titre -->
          <h2 class="text-5xl font-serif font-bold text-center mb-12 tracking-wide" style="color: #794c44;">
            Invitation
          </h2>
          
          <!-- Texte de l'invitation -->
          <div class="text-center">
            <div class="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-serif" style="color: #794c44;">
              <p v-if="guestMessageText" class="whitespace-pre-line font-medium">{{ guestMessageText }}</p>
                <template v-else>
                <p class="text-2xl font-serif mb-6 italic" style="color: #794c44;">
                  C'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.
                </p>
                <p class="text-lg mb-4 font-serif" style="color: #794c44;">
                  Nous serions honorés de votre présence pour célébrer notre mariage religieux le 
                  <strong class="font-semibold" style="color: #794c44;">{{ eventDateText }}</strong> 
                  en l'église 
                  <strong class="font-semibold" style="color: #794c44;">{{ churchName }}</strong> 
                  à 
                  <strong class="font-semibold" style="color: #794c44;">{{ churchLocation }}</strong>.
                </p>
                <p class="text-lg font-serif" style="color: #794c44;">
                  À l'issue de la cérémonie, nous vous invitons à partager un moment de convivialité 
                  autour d'un vin d'honneur au 
                  <strong class="font-semibold" style="color: #794c44;">{{ receptionLocation }}</strong>.
                </p>
                </template>
            </div>
          </div>
          
          <!-- Bouton de téléchargement -->
          <div class="text-center mt-12">
            <UButton 
              @click="handleDownloadInvitation" 
              :loading="isGenerating"
              :disabled="isGenerating"
              color="primary" 
              size="lg" 
              class="px-8 py-3 font-serif"
            >
              <Download class="w-5 h-5 mr-2" />
              {{ isGenerating ? 'Génération en cours...' : 'Télécharger l\'invitation' }}
            </UButton>
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
import { useCanvasImage } from '~/composables/useCanvasImage'

const props = defineProps<{ invitation: any; event?: any }>()

const scrollY = ref(0)
const isVisible = ref(false)
const guestMessages = ref<any[]>([])

// Composable pour la génération d'image Canvas
const { isGenerating, downloadInvitationImage } = useCanvasImage()

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

// Propriétés pour l'affichage
const eventImage = computed(() => {
  // Priorité à l'image de l'événement, sinon image par défaut pour mariage
  const eventImg = props.event?.imageUrl || props.invitation?.event?.imageUrl
  if (eventImg) return eventImg
  
  // Image par défaut pour mariage
  return 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
})

const eventDateText = computed(() => eventDate.value)

const templateBackgroundImage = computed(() => {
  const templateKey = props.invitation?.invitationTemplate?.designKey
  if (templateKey) {
    return `/models/${templateKey}.png`
  }
  return '/models/template_default.png'
})


// Calculer la taille de police dynamique selon la longueur du texte
const calculateDynamicFontSize = (text: string) => {
  if (!text) return 32
  
  const textLength = text.length
  const maxLength = 500 // Longueur maximale pour la plus petite police
  
  // Taille de base
  let baseSize = 32
  
  // Réduire la taille si le texte est long
  if (textLength > 200) {
    baseSize = 28
  }
  if (textLength > 400) {
    baseSize = 24
  }
  if (textLength > 600) {
    baseSize = 20
  }
  if (textLength > 800) {
    baseSize = 18
  }
  if (textLength > 1000) {
    baseSize = 16
  }
  
  return baseSize
}

// Test de l'image de fond
const testBackgroundImage = async () => {
  const img = new Image()
  img.onload = () => {
    console.log('✅ Image de fond chargée:', templateBackgroundImage.value)
  }
  img.onerror = () => {
    console.log('❌ Image de fond non trouvée:', templateBackgroundImage.value)
  }
  img.src = templateBackgroundImage.value
}

const handleDownloadInvitation = async () => {
  try {
    // Tester l'image de fond d'abord
    await testBackgroundImage()
    
    const invitationData = {
      guestMessage: guestMessageText.value || undefined,
      backgroundImage: templateBackgroundImage.value,
      textStartY: 200,
      textColor: '#794c44', // Couleur du message principal
      titleColor: '#794c44', // Couleur du titre
      accentColor: '#794c44', // Couleur d'accent
      signatureColor: '#794c44', // Couleur de la signature (gris)
      messagePadding: 200, // Padding horizontal de 200px de chaque côté
      textAlign: 'left' as const, // Alignement du texte à gauche
      messageFontSize: calculateDynamicFontSize(guestMessageText.value || '') // Taille dynamique selon la longueur
    }
    
    await downloadInvitationImage(invitationData)
  } catch (error) {
    // Fallback vers le téléchargement texte
    const invitationText = `
MARIAGE DE ${groomName.value.toUpperCase()} & ${brideName.value.toUpperCase()}
Invitation au Mariage Religieux

Cher(e) ${props.invitation?.guestName || 'Invité'},

C'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.

Nous serions honorés de votre présence pour célébrer notre mariage religieux le 
${eventDate.value} à ${eventTime.value} en l'église ${churchName.value} à ${churchLocation.value}.

À l'issue de la cérémonie, nous vous invitons à partager un moment de convivialité 
autour d'un vin d'honneur au ${receptionLocation.value}.

Avec toute notre affection,
${groomName.value} & ${brideName.value}
    `

    const blob = new Blob([invitationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invitation-mariage-${groomName.value.toLowerCase()}-${brideName.value.toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
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

// Computed properties pour les données de l'événement
const eventTitle = computed(() => `Mariage de ${groomName.value} & ${brideName.value}`)
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

/* Section de l'image d'en-tête (couple) */
.header-image {
  background-size: cover;
  background-position: center 30%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
  padding-bottom: 20px;
}

/* Section de contenu blanche et la vague */
.content-section {
  background-color: #fff;
  padding: 20px 25px;
  position: relative;
  z-index: 3;
  padding-top: 30px;
  margin-top: -30px;
}

/* La VAGUE/PAPIER DÉCHIRÉ */
.content-section::before {
  content: '';
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  height: 70px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C200,80 400,0 600,40 S800,80 1000,40 V100 H0 Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 2;
  pointer-events: none;
}

.invitation-content h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-style: italic;
  color: #794c44;
}

.invitation-content p {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  color: #794c44;
}

</style>