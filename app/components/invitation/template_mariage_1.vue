<template>
 
    <div class="min-h-screen  overflow-hidden">
      
      <!-- Hero Section avec parallaxe simple -->
    <section class="header-image" style="height: 80dvh;">
      <!-- Image de fond avec parallaxe simple -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
        :style="{
          backgroundImage: `url('${(event || invitation?.event)?.imageUrl || ''}')`,
          transform: `translateY(${scrollY * 0.5}px)`
        }"
      />
      
      <!-- Overlay fort pour la visibilité -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <!-- Contenu principal positionné en bas -->
      <div class="absolute bottom-0 left-0 right-0 z-10 pb-2 px-4">
        <div class="text-center text-white max-w-4xl mx-auto">
          <div v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible-once="{ opacity: 1, y: 0 }"
            :delay="200"
            :duration="1000">
            <!-- Titre principal -->
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight drop-shadow-2xl">
              {{ (event || invitation?.event)?.title || 'Invitation' }}
            </h1>
            
            <!-- Date et lieu -->
            <div class="text-lg sm:text-xl font-light space-y-1">
              <p class="font-bold drop-shadow-2xl text-white">
                {{ (event || invitation?.event)?.startsAt ? formatDate((event || invitation?.event).startsAt) : 'Date à confirmer' }}
              </p>
              <p class="text-white/90 drop-shadow-2xl">{{ (event || invitation?.event)?.location || '' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  

    <!-- Section d'invitation avec fond d'image -->
    <section 
      class="content-section relative overflow-hidden"
      :style="{
        backgroundImage: `url('${templateBackground}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <!-- Bulles animées -->
      <div class="bubbles-container">
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>
        <div class="bubble bubble-5"></div>
        <div class="bubble bubble-6"></div>
        <div class="bubble bubble-7"></div>
        <div class="bubble bubble-8"></div>
      </div>
      <div class="invitation-content" 
     
        >
          <!-- Titre -->
          <h2    v-motion
        :initial="{ opacity: 0, x: 80 }"
        :visible-once="{ opacity: 1, x: 0 }"
        :delay="600"
        :duration="1400" class="md:text-5xl uppercase text-3xl font-serif mt-4 font-bold text-center mb-12 tracking-wide" :style="{ color: titleColor }">
            Invitation
          </h2>
          
          <!-- Texte de l'invitation -->
          <div class="text-start"    v-motion
        :initial="{ opacity: 0, x: 80 }"
        :visible-once="{ opacity: 1, x: 0 }"
        :delay="600"
        :duration="1400">
            <div class="leading-relaxed max-w-3xl mx-auto font-serif" :style="{ color: textColor, fontSize: messageFontSize - 15 + 'px' }">
              <p v-if="processedGuestMessage" class="whitespace-pre-line font-medium" v-html="processedGuestMessage">
              </p>
                <template v-else>
                <p class="text-2xl font-serif mb-6 italic" :style="{ color: accentColor }">
                  C'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.
                </p>
                <p class="text-lg mb-4 font-serif" :style="{ color: textColor }">
                  Nous serions honorés de votre présence pour célébrer notre mariage religieux le 
                  <strong class="font-semibold" :style="{ color: accentColor }">
                    {{ (event || invitation?.event)?.startsAt ? formatDate((event || invitation?.event).startsAt) : 'Date à confirmer' }}
                  </strong> 
                  à 
                  <strong class="font-semibold" :style="{ color: accentColor }">{{ (event || invitation?.event)?.location || '' }}</strong>.
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
    <GuestBook 
      :token="invitation?.token"
      :slug="(event || invitation?.event)?.slug"
      :event-id="(event || invitation?.event)?.id"
    />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Download } from 'lucide-vue-next'
import { useCanvasImage } from '~/composables/useCanvasImage'
import { formatDate, calculateDynamicFontSize } from '~/utils'
import { useInvitationVariables } from '~/composables/useInvitationVariables'

const props = defineProps<{ invitation: any; event?: any }>()

const scrollY = ref(0)

// Composable pour la génération d'image Canvas
const { isGenerating, downloadInvitationImage } = useCanvasImage()

const handleScroll = () => {
  scrollY.value = window.scrollY
}




const templateBackground = `/models/${(props.event || props.invitation?.event)?.settings?.defaultInvitationTemplate?.designKey || 'template_default'}.png`

// Variables dynamiques pour les couleurs et tailles
const textColor = '#794c44'
const titleColor = '#794c44'
const accentColor = '#794c44'
const signatureColor = '#794c44'

// Calcul de la taille de police dynamique
const guestMessage = computed(() => 
  (props.event || props.invitation?.event)?.settings?.guestMessage || 
  (props.event || props.invitation?.event)?.settings?.guest_message
)

// Utiliser le composable pour traiter les variables dynamiques
const { processMessage } = useInvitationVariables({
  event: props.event,
  invitation: props.invitation
})

// Traitement des variables dynamiques dans le message
const processedGuestMessage = computed(() => {
  if (!guestMessage.value) return ''
  
  console.log('🔍 Message original (template_mariage_1):', guestMessage.value)
  const result = processMessage(guestMessage.value)
  console.log('🔍 Message traité (template_mariage_1):', result.text)
  return result.text
})

const messageFontSize = computed(() => {
  const fontSize = calculateDynamicFontSize(processedGuestMessage.value || '')
  console.log('📏 Taille de police calculée (mariage):', fontSize, 'pour le texte:', processedGuestMessage.value?.substring(0, 50) + '...')
  return fontSize
})

const handleDownloadInvitation = async () => {
  try {
    // Nettoyer le message pour le canvas en préservant le formatage
    let cleanMessage = processedGuestMessage.value || ''
    if (cleanMessage) {
      // Remplacer les <br> par des retours à la ligne pour le canvas
      cleanMessage = cleanMessage.replace(/<br\s*\/?>/gi, '\n')
      
      // Convertir le HTML en formatage Canvas-friendly
      cleanMessage = cleanMessage
        // Gras: <strong>texte</strong> → **texte**
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        // Italique: <em>texte</em> → *texte*
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        // Souligné: <u>texte</u> → _texte_
        .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
        // Barré: <s>texte</s> → ~texte~
        .replace(/<s[^>]*>(.*?)<\/s>/gi, '~$1~')
        // Code: <code>texte</code> → `texte`
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        // Alignement à droite: <div class="text-right">texte</div> → [>texte<]
        .replace(/<div[^>]*class="[^"]*text-right[^"]*"[^>]*>(.*?)<\/div>/gi, '[>$1<]')
        // Alignement à gauche: <div class="text-left">texte</div> → [<texte<]
        .replace(/<div[^>]*class="[^"]*text-left[^"]*"[^>]*>(.*?)<\/div>/gi, '[<$1<]')
        // Centré: <div class="text-center">texte</div> → [>texte>]
        .replace(/<div[^>]*class="[^"]*text-center[^"]*"[^>]*>(.*?)<\/div>/gi, '[>$1>]')
        // Séparateur: <hr> → [---]
        .replace(/<hr[^>]*>/gi, '[---]')
        // Titres: <h1>texte</h1> → [#texte#]
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '[#$1#]')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '[##$1##]')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '[###$1###]')
        // Enlever toute autre balise HTML restante
        .replace(/<[^>]*>/g, '')
        // Nettoyer les espaces multiples
        .replace(/\n\s*\n\s*\n/g, '\n\n')
    }
    
    const invitationData = {
      guestMessage: cleanMessage || undefined,
      backgroundImage: templateBackground,
      textStartY: 180,
      textColor: textColor,
      titleColor: titleColor,
      accentColor: accentColor,
      signatureColor: signatureColor,
      messagePadding: 180,
      textAlign: 'left' as const,
      messageFontSize: messageFontSize.value
    }
    
    console.log('📤 Données envoyées au canvas (mariage):', {
      messageFontSize: invitationData.messageFontSize,
      guestMessage: invitationData.guestMessage?.substring(0, 50) + '...'
    })
    
    await downloadInvitationImage(invitationData)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
  }
}


    onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})







</script>


<style scoped>

/* Optimisation simple pour le parallaxe */
.parallax-bg {
  will-change: transform;
  transform: translateZ(0);
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

/* Section de contenu avec fond d'image */
.content-section {
  padding: 60px 25px;
  position: relative;
  z-index: 3;
  min-height: 60vh;
  display: flex;
  align-items: center;
}



</style>