<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Overlay de chargement -->
    <LoadingOverlay 
      :show="isLoading"
      title="Chargement de l'invitation"
      description="Préparation de votre invitation personnalisée..."
      :size="48"
      color="primary"
    />

    <!-- État d'erreur -->
    <div v-if="hasError && !isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Invitation introuvable</h2>
        <p class="text-gray-600 mb-6">Cette invitation n'existe pas ou a expiré.</p>
        <UButton @click="retry" variant="outline" color="primary">
          Réessayer
        </UButton>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="!isLoading && !hasError && currentTemplate">
      <component :is="currentTemplate" :invitation="invitation" :event="event" />
    </div>
    
    <!-- État de chargement du template -->
    <div v-else-if="!isLoading && !hasError && !currentTemplate" class="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingOverlay 
        :show="true"
        title="Chargement du template"
        description="Préparation de l'affichage..."
        :size="48"
        color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSEO } from '~/composables/useSEO'

definePageMeta({ 
  layout: false, 
  ssr: false
})

const route = useRoute()
const token = computed(() => String(route.params.token || ''))

// SEO pour la page d'invitation (dynamique selon l'événement)
const { setSEO } = useSEO()

const { $myFetch } = useNuxtApp()
const toast = useToast()

// État réactif
const templateKey = ref('template_default')
const invitation = ref<any>(null)
const event = ref<any>(null)
const isLoading = ref(true)
const hasError = ref(false)

// Fonction pour charger dynamiquement un template basé sur le design_key
const loadTemplateComponent = async (designKey: string) => {
  console.log('Chargement dynamique du template:', designKey)
  
  try {
    // Charger directement le composant avec le design_key + extension .vue
    const component = await import(`~/components/invitation/${designKey}.vue`)
    console.log(`Composant ${designKey}.vue chargé avec succès`)
    return component.default || component
  } catch (error) {
    console.warn(`Composant ${designKey} non trouvé, utilisation du template par défaut`)
    // Fallback vers le template par défaut
    const fallback = await import('~/components/invitation/template_default.vue')
    return fallback.default || fallback
  }
}

// Charger les données de l'invitation
const load = async () => {
  // Vérifier que nous sommes côté client
  if (process.server) return
  
  // Vérifier que le token existe
  if (!token.value) {
    hasError.value = true
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  hasError.value = false
  
  try {
    const res = await $myFetch<any>(`/public/invitations/${token.value}`)
    const data = res?.data || res
    invitation.value = data?.invitation || data
    event.value = invitation.value?.event || data?.event || null
    
    // Vérifier que l'invitation existe
    if (!invitation.value) {
      throw new Error('Invitation introuvable')
    }
    
    // Récupérer le design_key du template d'invitation
    const designKey = invitation.value?.invitationTemplate?.designKey || 
                     invitation.value?.invitation_template?.design_key || 
                     'template_default'
    
    templateKey.value = designKey
    console.log('Template key détecté:', templateKey.value)
    
    // Charger le template approprié
    await loadTemplate()
    
    // Configurer le SEO dynamique pour l'invitation
    if (invitation.value && event.value) {
      setSEO({
        title: `Invitation - ${event.value.title}`,
        description: `Vous êtes invité(e) à ${event.value.title} le ${formatEventDate(event.value.startsAt)} à ${event.value.location}. Confirmez votre présence.`,
        image: event.value.imageUrl || '/images/event-default.jpg',
        type: 'article',
        noindex: true, // Invitations privées
        keywords: [
          'invitation',
          'événement',
          event.value.title,
          event.value.location,
          'confirmation',
          'RSVP'
        ]
      })
    }
  } catch (error: any) {
    console.error('Erreur lors du chargement de l\'invitation:', error)
    hasError.value = true
    toast.add({ 
      title: 'Erreur', 
      description: error?.message || 'Impossible de charger l\'invitation. Veuillez réessayer.', 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}

// Fonction de retry
const retry = () => {
  hasError.value = false
  load()
}

// Template actuel chargé dynamiquement
const currentTemplate = ref<any>(null)

// Charger le template approprié
const loadTemplate = async () => {
  if (!templateKey.value || !invitation.value) return
  
  const key = String(templateKey.value).toLowerCase()
  console.log('Chargement du template pour key:', key)
  
  try {
        const component = await loadTemplateComponent(key)
        currentTemplate.value = markRaw(component)
    console.log('Template chargé avec succès:', key)
  } catch (error) {
    console.error('Erreur lors du chargement du template:', error)
    // Fallback vers le template par défaut
    const fallback = await import('~/components/invitation/template_default.vue')
    currentTemplate.value = markRaw(fallback.default || fallback)
  }
}

// Fonction de formatage de date pour le SEO
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Date à définir'
  }
}

// Charger les données au montage
onMounted(load)
</script>


