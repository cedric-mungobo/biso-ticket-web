<template>
  <div class="w-full">
    <!-- Container principal avec hauteur fixe et scroll -->
    <div 
      class="relative min-h-screen bg-center bg-no-repeat transition-transform duration-100"
      :style="containerStyle"
    >
      <!-- Contenu de l'invitation avec boutons -->
        <div class="flex flex-col items-center justify-between min-h-screen p-6 sm:p-8">
        <!-- Texte en haut -->
        <div class="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl space-y-2 pt-16">
          <component
            v-for="(line, index) in formattedText"
            :key="index"
            :is="line.tag"
            :class="line.class"
            :style="line.style"
          >
            {{ line.content }}
          </component>
        </div>

        <!-- Bouton d'action en bas -->
        <div class="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl pb-8">
          <div class="flex justify-center items-center">
            <button
              class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 border border-amber-700 flex items-center justify-center gap-2 transition-all duration-300 bg-transparent text-amber-700 hover:bg-amber-700 hover:text-white"
              @click="handleDownloadInvitation"
            >
              <Download class="w-5 h-5" />
              Télécharger l'invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Download } from 'lucide-vue-next'

interface Props {
  invitation: any
  event?: any
  scrollY?: number
  backgroundImage?: string
  isClient?: boolean
  backgroundSize?: 'contain' | 'cover' | 'auto' | '100% 100%' | '100% auto'
}

const props = withDefaults(defineProps<Props>(), {
  scrollY: 0,
  backgroundImage: '',
  isClient: false,
  backgroundSize: '100% auto'
})

const emit = defineEmits<{
  downloadInvitation: []
}>()

// Style du container avec hauteur fixe et scroll
const containerStyle = computed(() => {
  const style: any = {
    transform: props.isClient ? `translateY(${props.scrollY * 0.5}px)` : 'none'
  }
  
  // Ajouter l'image de fond si elle est fournie
  if (props.backgroundImage) {
    style.backgroundImage = props.backgroundImage
    style.backgroundSize = '100% 100%'
    style.backgroundPosition = 'center center'
    style.backgroundRepeat = 'no-repeat'
    console.log('Image de fond utilisée (props):', props.backgroundImage)
  } else {
    // Fallback : utiliser l'image de l'événement ou une image par défaut
    const eventImage = props.event?.imageUrl || props.invitation?.event?.imageUrl
    if (eventImage) {
      style.backgroundImage = `url(${eventImage})`
      style.backgroundSize = '100% 100%'
      style.backgroundPosition = 'center center'
      style.backgroundRepeat = 'no-repeat'
      console.log('Image de fond utilisée (événement):', eventImage)
    } else {
      // Image par défaut basée sur le design_key
      const designKey = props.invitation?.invitationTemplate?.designKey || 
                       props.invitation?.invitation_template?.design_key || 
                       'template_mariage_1'
      style.backgroundImage = `url(/models/${designKey}.png)`
      style.backgroundSize = '100% 100%'
      style.backgroundPosition = 'center center'
      style.backgroundRepeat = 'no-repeat'
      console.log('Image de fond utilisée (défaut):', `/models/${designKey}.png`)
    }
  }
  
  return style
})

// Texte de l'invitation formaté
const invitationText = computed(() => {
  // Utiliser le message personnalisé s'il existe, sinon le texte par défaut
  const customMessage = props.event?.settings?.guestMessage || 
                       props.event?.settings?.guest_message || 
                       props.invitation?.event?.settings?.guestMessage || 
                       props.invitation?.event?.settings?.guest_message

  if (customMessage) {
    return customMessage
  }

  // Texte par défaut basé sur le design
  const designKey = props.invitation?.invitationTemplate?.designKey || 
                   props.invitation?.invitation_template?.design_key || 
                   'template_mariage_1'

  if (designKey === 'template_mariage_1') {
    return `SOIRÉE ÉLÉGANCE

Une invitation personnelle

Cher(e) ${props.invitation?.guestName || props.invitation?.guest_name || '[Nom de l\'Invité]'},

C'est avec un immense plaisir que nous vous invitons à notre Soirée Élégance, un événement exceptionnel qui se déroulera le ${formatEventDate(props.event?.startsAt || props.invitation?.event?.startsAt)} au prestigieux ${props.event?.location || props.invitation?.event?.location || 'Château de Versailles'}.

Votre présence illuminerait cette soirée magique où se mêleront gastronomie raffinée, spectacles artistiques et moments de convivialité dans un cadre somptueux.

Horaires: ${formatEventTime(props.event?.startsAt || props.invitation?.event?.startsAt, props.event?.endsAt || props.invitation?.event?.endsAt)}
Lieu: ${props.event?.location || props.invitation?.event?.location || 'Château de Versailles'}
Tenue: Soirée exigée

Confirmation souhaitée avant le ${formatConfirmationDate(props.event?.startsAt || props.invitation?.event?.startsAt)}

Avec nos sentiments les plus chaleureux,
L'équipe ${props.event?.title || props.invitation?.event?.title || 'Soirée Élégance'}`
  }

  // Texte par défaut générique
  return `Invitation personnelle

Cher(e) ${props.invitation?.guestName || props.invitation?.guest_name || '[Nom de l\'Invité]'},

C'est avec un immense plaisir que nous vous invitons à ${props.event?.title || props.invitation?.event?.title || 'notre événement'}.

Détails de l'événement:
- Date: ${formatEventDate(props.event?.startsAt || props.invitation?.event?.startsAt)}
- Heure: ${formatEventTime(props.event?.startsAt || props.invitation?.event?.startsAt, props.event?.endsAt || props.invitation?.event?.endsAt)}
- Lieu: ${props.event?.location || props.invitation?.event?.location || 'À confirmer'}

Nous espérons vous voir parmi nous!

Cordialement,
L'équipe organisatrice`
})

// Formatage du texte pour l'affichage
const formattedText = computed(() => {
  const lines = invitationText.value.split('\n').filter((line: string) => line.trim() !== '')
  
  return lines.map((line: string) => {
    const trimmedLine = line.trim()
    
    // Titre principal
    if (trimmedLine.includes('SOIRÉE ÉLÉGANCE') || trimmedLine.includes('Invitation personnelle')) {
      return {
        tag: 'h1',
        content: trimmedLine,
        class: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 sm:mb-6 text-center tracking-widest font-serif drop-shadow-lg',
        style: { textShadow: '2px 2px 4px rgba(255,255,255,0.8)' }
      }
    }
    
    // Sous-titre
    if (trimmedLine.includes('Une invitation personnelle')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-lg sm:text-xl md:text-2xl text-amber-800 mb-8 sm:mb-12 text-center italic font-light drop-shadow-md',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }
      }
    }
    
    // Salutation
    if (trimmedLine.startsWith('Cher(e)')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-base sm:text-lg text-amber-900 mb-6 sm:mb-8 font-medium drop-shadow-sm',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
      }
    }
    
    // Informations pratiques
    if (trimmedLine.includes('Horaires:') || trimmedLine.includes('Lieu:') || trimmedLine.includes('Tenue:')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-base sm:text-lg text-amber-900 mb-2 sm:mb-3 font-semibold drop-shadow-sm',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
      }
    }
    
    // Confirmation
    if (trimmedLine.includes('Confirmation souhaitée')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-base sm:text-lg text-amber-800 mb-6 sm:mb-8 font-medium italic text-center drop-shadow-sm',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
      }
    }
    
    // Signature
    if (trimmedLine.includes("L'équipe") || trimmedLine.includes('Cordialement')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-base sm:text-lg text-amber-900 text-right font-semibold mt-4 sm:mt-6 drop-shadow-sm',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
      }
    }
    
    // Texte de politesse
    if (trimmedLine.includes('Avec nos sentiments') || trimmedLine.includes('Nous espérons')) {
      return {
        tag: 'p',
        content: trimmedLine,
        class: 'text-sm sm:text-base text-amber-800 text-right italic mb-2 drop-shadow-sm',
        style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
      }
    }
    
    // Paragraphe standard
    return {
      tag: 'p',
      content: trimmedLine,
      class: 'text-base sm:text-lg text-amber-900 mb-4 sm:mb-6 leading-relaxed drop-shadow-sm',
      style: { textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }
    }
  })
})

// Gestionnaires d'événements

const handleDownloadInvitation = () => {
  const blob = new Blob([invitationText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invitation-${props.event?.title || props.invitation?.event?.title || 'evenement'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  emit('downloadInvitation')
}

// Fonctions utilitaires pour le formatage des dates
const formatEventDate = (dateString: string) => {
  if (!dateString) return 'Date à confirmer'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date)
}

const formatEventTime = (startDate: string, endDate?: string) => {
  if (!startDate) return 'Heure à confirmer'
  const start = new Date(startDate)
  const startTime = new Intl.DateTimeFormat('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(start)
  
  if (!endDate) return startTime
  
  const end = new Date(endDate)
  const endTime = new Intl.DateTimeFormat('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(end)
  
  return `${startTime} à ${endTime}`
}

const formatConfirmationDate = (dateString: string) => {
  if (!dateString) return 'la date limite'
  const date = new Date(dateString)
  // Soustraire 2 semaines pour la date de confirmation
  date.setDate(date.getDate() - 14)
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric', 
    month: 'long' 
  }).format(date)
}
</script>

<style scoped>
/* Scrollbar personnalisée pour le container */
.h-\[90dvh\]::-webkit-scrollbar {
  width: 6px;
}

.h-\[90dvh\]::-webkit-scrollbar-track {
  background: transparent;
}

.h-\[90dvh\]::-webkit-scrollbar-thumb {
  background-color: rgba(146, 64, 14, 0.3);
  border-radius: 3px;
}

.h-\[90dvh\]::-webkit-scrollbar-thumb:hover {
  background-color: rgba(146, 64, 14, 0.5);
}
</style>
