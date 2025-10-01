<template>
  <div class="min-h-screen py-14 md:py-16">
    <!-- En-tête -->
  

    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">

        <!-- Loading -->
        <LoadingOverlay
        :show="loading"
        title="Chargement du formulaire..."
        description="Veuillez patienter ..."
        color="primary"
        :size="48"
        />
        
        <!-- Erreur -->
        <div v-if="error" class="text-center py-12">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p class="text-gray-500 mb-4">{{ error }}</p>
            <UButton 
            @click="loadForm"
            variant="outline"
            color="error"
            >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
            Réessayer
        </UButton>
    </div>
  

      <!-- Formulaire non disponible -->
      <div v-else-if="form && !isFormAvailable(form)" class="text-center py-12">
        <UIcon name="i-heroicons-clock" class="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Formulaire non disponible</h3>
        <p class="text-gray-500">
          Ce formulaire de réservation n'est pas actuellement disponible.
          <span v-if="form.reservation_starts_at && new Date(form.reservation_starts_at) > new Date()">
            Les réservations commenceront le {{ formatReservationDate(form.reservation_starts_at) }}.
          </span>
          <span v-else-if="form.reservation_ends_at && new Date(form.reservation_ends_at) < new Date()">
            Les réservations se sont terminées le {{ formatReservationDate(form.reservation_ends_at) }}.
          </span>
        </p>

        
      </div>

      <!-- Formulaire de réservation -->
      <div v-else-if="form" class="space-y-8">
        <!-- Informations de l'événement (seulement si l'événement existe) -->
        <UCard v-if="form.event">
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="form.event?.image_url || form.event?.image" class="md:w-1/3">
              <img
                :src="form.event.image_url || form.event.image"
                :alt="form.event.title || 'Événement'"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ form.event?.title }}</h2>
              <div class="space-y-2 text-sm text-gray-600">
                <div v-if="form.fixed_price || form.fixedPrice" class="flex items-center">
                  <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 mr-2" />
                  <span class="font-medium">{{ form.fixed_price || form.fixedPrice }} USD</span>
                </div>
                <div v-if="form.max_reservations || form.maxReservations" class="flex items-center">
                  <UIcon name="i-heroicons-users" class="w-4 h-4 mr-2" />
                  <span>{{ form.max_reservations || form.maxReservations }} places disponibles</span>
                </div>
                <div v-if="form.reservation_starts_at || form.reservationStartsAt" class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
                  <span>Début: {{ formatReservationDate((form.reservation_starts_at || form.reservationStartsAt) ?? null) }}</span>
                </div>
                <div v-if="form.reservation_ends_at || form.reservationEndsAt" class="flex items-center">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-2" />
                  <span>Fin: {{ formatReservationDate((form.reservation_ends_at || form.reservationEndsAt) ?? null) }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>


        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900"> {{ form?.title || 'Formulaire de réservation' }}</h3>
            <p v-if="form?.description" class="text-gray-600">{{ form.description }}</p>
          </template>
          
        </UCard>
        

        <!-- Formulaire de réservation -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Informations  du participant</h3>
          </template> 

          <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
            <!-- Champs du formulaire -->
            <div v-for="field in sortedFields" :key="field.id" class="space-y-2">
                  <label :for="field.name" class="block text-sm font-medium text-gray-700">
                    {{ field.label }}
                    <span v-if="field.is_required || field.required" class="text-red-500">*</span>
                  </label>
              
              <!-- Champ texte -->
              <UInput
                v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'phone'"
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type === 'phone' ? 'tel' : field.type"
                :placeholder="field.placeholder"
                :error="validationErrors[field.name]?.[0]"
                @blur="validateField(field.name)"
                @input="validateField(field.name)"
                formnovalidate
                class="w-full"
              />
              
              <!-- Champ nombre -->
              <UInput
                v-else-if="field.type === 'number'"
                :id="field.name"
                v-model="formData[field.name]"
                type="number"
                :placeholder="field.placeholder"
                :error="validationErrors[field.name]?.[0]"
                @blur="validateField(field.name)"
                @input="validateField(field.name)"
                formnovalidate
                class="w-full"
              />
              
              <!-- Zone de texte -->
              <UTextarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                :error="validationErrors[field.name]?.[0]"
                @blur="validateField(field.name)"
                @input="validateField(field.name)"
                formnovalidate
                class="w-full"
                :rows="4"
              />
              
              <!-- Date -->
              <UInput
                v-else-if="field.type === 'date'"
                :id="field.name"
                v-model="formData[field.name]"
                type="date"
                :error="validationErrors[field.name]?.[0]"
                @blur="validateField(field.name)"
                @change="validateField(field.name)"
                formnovalidate
                class="w-full"
              />
              
              <!-- Sélection -->
              <div v-else-if="field.type === 'select'" class="space-y-2">
                <!-- Texte d'aide pour les sélections -->
                <div class="text-xs text-gray-500">
                  <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
                  <span v-if="field.is_required || field.required">
                    Sélectionnez une option
                  </span>
                  <span v-else>
                    Optionnel - sélectionnez une option
                  </span>
                </div>
                
                <USelect
                  :id="field.name"
                  v-model="formData[field.name]"
                  :options="field.options || []"
                  :placeholder="field.placeholder"
                  :error="validationErrors[field.name]?.[0]"
                  @change="validateField(field.name)"
                  formnovalidate
                  class="w-full"
                />
              </div>
              
              <!-- Checkbox (multiple options) -->
              <div v-else-if="field.type === 'checkbox'" class="space-y-2">
                <!-- Texte d'aide pour les checkboxes -->
                <div class="text-xs text-gray-500 mb-2">
                  <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
                  <span v-if="field.is_required || field.required">
                    Sélectionnez au moins une option
                  </span>
                  <span v-else>
                    Optionnel - sélectionnez une ou plusieurs options
                  </span>
                </div>
                
                <div v-for="option in field.options" :key="option.value" class="flex items-center">
                  <input
                    :id="`${field.name}-${option.value}`"
                    type="checkbox"
                    :checked="formData[field.name]?.includes(option.value) || false"
                    @change="(e) => toggleCheckbox(field.name, option.value, (e.target as HTMLInputElement).checked)"
                    formnovalidate
                    class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label :for="`${field.name}-${option.value}`" class="ml-2 text-sm text-gray-700">
                    {{ option.label }}
                  </label>
                </div>
                <!-- Affichage des erreurs pour les checkboxes -->
                <div v-if="validationErrors[field.name]?.[0]" class="text-sm text-red-600 mt-1">
                  {{ validationErrors[field.name]?.[0] }}
                </div>
              </div>
              
              <!-- Radio -->
              <div v-else-if="field.type === 'radio'" class="space-y-2">
                <!-- Texte d'aide pour les radios -->
                <div class="text-xs text-gray-500 mb-2">
                  <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
                  <span v-if="field.is_required || field.required">
                    Sélectionnez une option
                  </span>
                  <span v-else>
                    Optionnel - sélectionnez une option
                  </span>
                </div>
                
                <div v-for="option in field.options" :key="option.value" class="flex items-center">
                  <input
                    :id="`${field.name}-${option.value}`"
                    type="radio"
                    :name="field.name"
                    :value="option.value"
                    :checked="formData[field.name] === option.value"
                    @change="(e) => selectRadio(field.name, (e.target as HTMLInputElement).value)"
                    formnovalidate
                    class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2"
                  />
                  <label :for="`${field.name}-${option.value}`" class="ml-2 text-sm text-gray-700">
                    {{ option.label }}
                  </label>
                </div>
                <!-- Affichage des erreurs pour les radios -->
                <div v-if="validationErrors[field.name]?.[0]" class="text-sm text-red-600 mt-1">
                  {{ validationErrors[field.name]?.[0] }}
                </div>
              </div>
              
              <!-- Texte d'aide -->
              <p v-if="field.help_text || field.helpText" class="text-xs text-gray-500">
                {{ field.help_text || field.helpText }}
              </p>
            </div>

            <!-- Méthode de paiement (si requis ET prix défini) -->
            <div v-if="(form.requires_payment || form.paymentRequired) && (form.fixed_price || form.fixedPrice)" class="space-y-4 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900">Méthode de paiement</h4>
              <USelect
                v-model="paymentMethod"
                :options="paymentMethods"
                placeholder="Sélectionnez une méthode de paiement"
                class="w-full"
              />
            </div>

            <!-- Résumé des erreurs de validation -->
            <div v-if="Object.keys(validationErrors).length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div class="flex items-start">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 class="text-sm font-medium text-red-800 mb-2">Veuillez corriger les erreurs suivantes :</h4>
                  <ul class="text-sm text-red-700 space-y-1">
                    <li v-for="(errors, fieldName) in validationErrors" :key="fieldName">
                      <span v-for="error in errors" :key="error" class="block">• {{ error }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Bouton de soumission -->
            <div class="flex justify-end pt-6 border-t border-gray-200">
              
              <UButton
                type="submit"
                :loading="submitting"
                :disabled="!canSubmit"
                size="lg"
                class="w-full text-center"
              >
                <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
                {{ (form.requires_payment || form.paymentRequired) && (form.fixed_price || form.fixedPrice) ? 'Réserver et payer' : 'Réserver' }}
              </UButton>
            </div>
          </form>
        </UCard>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <Modal 
      v-model="showConfirmationModal" 
      title="Réservation confirmée !"
      :show-close-button="true"
    >
      <div class="space-y-4 md:space-y-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 mb-3 md:mb-4">
            <UIcon name="i-heroicons-check" class="h-5 w-5 md:h-6 md:w-6 text-green-600" />
          </div>
          <p class="text-gray-700 mb-2 text-sm md:text-base">{{ confirmationMessage }}</p>
          <p v-if="reservationId" class="text-xs md:text-sm text-gray-600">
            Référence : <span class="font-medium text-primary-600">{{ reservationId }}</span>
          </p>
        </div>

        <!-- QR Code et informations de l'événement -->
        <div v-if="qrCodeData && reservationData" class="bg-gray-50 rounded-lg p-3 md:p-4">
          <div class="text-center mb-3 md:mb-4">
            <h4 class="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">Votre billet</h4>
            <p class="text-xs md:text-sm text-gray-600 line-clamp-2">{{ reservationData.event?.title }}</p>
            <p class="text-xs text-gray-500">{{ reservationData.fullName }}</p>
          </div>
          
          <!-- QR Code -->
          <div class="flex justify-center mb-3 md:mb-4">
            <div class="bg-white p-2 md:p-4 rounded-lg shadow-sm border-2 border-gray-200">
              <QRCode 
                :data="qrCodeData" 
                :size="160"
                class="mx-auto"
              />
            </div>
          </div>
          
          <!-- Informations additionnelles -->
          <div class="text-center text-xs text-gray-500 space-y-1">
            <p>Présentez ce QR code à l'entrée</p>
            <p>Réf: {{ reservationData.publicId }}</p>
          </div>
        </div>
        
        <div class="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
          <UButton 
            v-if="qrCodeData"
            color="primary" 
            variant="solid" 
            block
            @click="downloadTicket"
            class="order-1"
            size="sm"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
            Télécharger le billet
          </UButton>
          
          <!-- Lien vers la page de téléchargement -->
          <TicketDownloadLink
            v-if="reservationData?.publicId"
            :public-id="reservationData.publicId"
            label="Lien permanent du billet"
            color="secondary"
            variant="outline"
            icon="i-heroicons-link"
            button-class="order-2 w-full"
            size="sm"
          />
          
          <UButton 
            color="neutral" 
            variant="ghost" 
            block
            @click="showConfirmationModal = false"
            class="order-3"
            size="sm"
          >
            Fermer
          </UButton>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import type { ReservationForm, ReservationFormField } from '~/types/reservation'
import Modal from '~/components/Modal.vue'

definePageMeta({ 
  layout: 'default',
  middleware: 'public-reservation'
})

const route = useRoute()
const router = useRouter()
const eventSlug = route.params.slug as string
const formId = route.params.formId as string

const { 
  fetchReservationFormByEventAndPublicId,
  fetchReservationFormById,
  submitReservation: submitReservationAPI,
  isFormAvailable,
  formatReservationDate,
  validateFormData,
  loading,
  error
} = usePublicReservations()

const { 
  createCanvas,
  addText,
  addBlock,
  addImage,
  addQRCode,
  addImagePlaceholder,
  exportCanvas,
  isValidImageUrl
} = useCanvas()

const toast = useToast()

// SEO optimisé avec useHead pour le mode SPA
const { setSEO } = useSEO()

// Métadonnées réactives pour le mode SPA
const pageTitle = ref('Formulaire de réservation - Biso Ticket')
const pageDescription = ref('Réservez votre place pour cet événement via Biso Ticket')
const pageImage = ref('https://bisoticket.com/images/event-default.jpg')

// Utilisation de useHead pour le mode SPA
useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: pageImage },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Biso Ticket' },
    { property: 'og:url', content: `https://bisoticket.com/evenements/${eventSlug}/reservation/${formId}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage },
    { name: 'twitter:site', content: '@bisoticket' },
    { name: 'twitter:creator', content: '@bisoticket' }
  ]
})

// État local
const form = ref<ReservationForm | null>(null)
const formData = ref<Record<string, any>>({})
const validationErrors = ref<Record<string, string[]>>({})
const submitting = ref(false)
const showConfirmationModal = ref(false)
const confirmationMessage = ref('')
const reservationId = ref<number | null>(null)
const reservationData = ref<any>(null)
const qrCodeData = ref<string | null>(null)

// Paiement
const paymentMethod = ref('')
const paymentMethods = [
  { label: 'Carte bancaire', value: 'card' },
  { label: 'Mobile Money', value: 'mobile_money' },
  { label: 'Espèces', value: 'cash' }
]

// Champs triés par ordre
const sortedFields = computed(() => {
  if (!form.value?.fields) return []
  const fields = [...form.value.fields]
    .filter(field => field.is_active || field.isActive)
    .sort((a, b) => (a.sort_order || a.sortOrder || 0) - (b.sort_order || b.sortOrder || 0))
  
  return fields
})

// Vérifier si on peut soumettre (simplifié - on permet toujours la soumission)
const canSubmit = computed(() => {
  return form.value && !submitting.value
})

// Charger le formulaire
const loadForm = async () => {
  try {
    
    // Essayer d'abord avec l'ID public via l'événement
    if (isNaN(Number(formId))) {
      // C'est probablement un UUID public
      form.value = await fetchReservationFormByEventAndPublicId(eventSlug, formId)
    } else {
      // C'est un ID numérique
      form.value = await fetchReservationFormById(Number(formId))
    }
    
    
    // Initialiser les données du formulaire
    initializeFormData()
    
    // Mettre à jour les métadonnées avec les données de l'événement
    if (form.value) {
      const eventTitle = form.value.event?.title || 'Événement'
      const eventImage = form.value.event?.image_url || form.value.event?.image || '/images/event-default.jpg'
      
      // Mettre à jour les métadonnées réactives (useSeoMeta se mettra à jour automatiquement)
      pageTitle.value = `${form.value.title || 'Formulaire de réservation'} - ${eventTitle} - Biso Ticket`
      pageDescription.value = form.value.description || `Réservez votre place pour ${eventTitle} via Biso Ticket`
      pageImage.value = eventImage.startsWith('http') ? eventImage : `https://bisoticket.com${eventImage}`
    }
  } catch (err) {
    console.error('Erreur lors du chargement du formulaire:', err)
  }
}

// Initialiser les données du formulaire
const initializeFormData = () => {
  if (!form.value?.fields) return
  
  const data: Record<string, any> = {}
  form.value.fields.forEach(field => {
    const isActive = field.is_active || field.isActive
    if (isActive) {
      if (field.type === 'checkbox') {
        // Pour les checkboxes multiples, initialiser comme un tableau vide
        data[field.name] = []
      } else {
        data[field.name] = ''
      }
    }
  })
  formData.value = data
}

// Soumettre la réservation
const handleSubmit = async () => {
  if (!form.value || !canSubmit.value) return
  
  try {
    submitting.value = true
    validationErrors.value = {}
    
    // Valider les données
    const validation = validateFormData(formData.value, sortedFields.value)
    if (!validation.isValid) {
      validationErrors.value = validation.errors
      return
    }
    
    // Préparer les données de réservation
    const reservationPayload: {
      reservation_form_id: number
      data: Record<string, any>
      payment_method?: string
    } = {
      reservation_form_id: form.value.id,
      data: formData.value
    }
    
    // Ajouter payment_method seulement si paiement requis ET prix défini
    const hasPaymentRequired = form.value.requires_payment || form.value.paymentRequired
    const hasPrice = form.value.fixed_price || form.value.fixedPrice
    if (hasPaymentRequired && hasPrice && paymentMethod.value) {
      reservationPayload.payment_method = paymentMethod.value
    }
    
    // Soumettre la réservation
    const result = await submitReservationAPI(reservationPayload)
    
    // Log de la réponse complète pour debug
    console.log('🔍 [DEBUG] Réponse complète de submitReservationAPI:', result)
    console.log('🔍 [DEBUG] Type de result:', typeof result)
    console.log('🔍 [DEBUG] Clés de result:', Object.keys(result || {}))
    
    // Afficher la confirmation
    reservationId.value = result.id
    confirmationMessage.value = result.message
    reservationData.value = result.data
    qrCodeData.value = result.data?.qrCode || null
    
    // Debug des données de réservation
    console.log('🔍 [DEBUG] Données complètes de réservation:', result.data)
    console.log('🔍 [DEBUG] Événement dans les données:', result.data?.event)
    console.log('🔍 [DEBUG] Image de l\'événement:', (result.data?.event as any)?.imageUrl)
    
    showConfirmationModal.value = true
    
    // Réinitialiser le formulaire
    initializeFormData()
    paymentMethod.value = ''
    
  } catch (err: any) {
    console.error('Erreur lors de la soumission:', err)
    
    // Message utilisateur-friendly (jamais d'erreur technique)
    let errorMessage = 'Impossible de soumettre la réservation. Veuillez réessayer.'
    
    // Gestion des erreurs spécifiques sans exposer les détails techniques
    if (err?.response?.status === 404) {
      errorMessage = 'Le formulaire de réservation n\'est plus disponible.'
    } else if (err?.response?.status === 422) {
      errorMessage = 'Veuillez vérifier les informations saisies.'
    } else if (err?.response?.status >= 500) {
      errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
    }
    
    toast.add({
      title: 'Erreur',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

// Aller à l'événement
const goToEvent = () => {
  navigateTo(`/evenements/${eventSlug}`)
}


// Télécharger le billet avec QR code
const downloadTicket = async () => {
  if (!qrCodeData.value || !reservationData.value) return
  
  try {
    // Configuration du canvas
    const scale = 2
    const width = 400
    const height = 650
    
    // Créer le canvas
    const { canvas, ctx } = createCanvas({
      width,
      height,
      scale,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 2
    })
    
    // En-tête
    addBlock(ctx, {
      x: 0,
      y: 0,
      width: width,
      height: 80,
      backgroundColor: '#8b12ff'
    }, scale)
    
    // Titre de l'événement
    addText(ctx, {
      x: width / 2,
      y: 40,
      text: reservationData.value.event?.title || 'Événement',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center'
    }, scale)
    
    // Zone de l'image en carré (centrée)
    const imageSize = 120 // Taille carrée
    const imageOptions = {
      x: 20, // Centrer horizontalement
      y: 90,
      width: imageSize,
      height: imageSize,
      borderRadius: 15
    }
    
    // Fond de l'image
    addBlock(ctx, {
      ...imageOptions,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 2
    }, scale)
    
    // Essayer d'ajouter l'image de l'événement
    const eventImageUrl = reservationData.value?.event?.imageUrl
    let imageLoaded = false
    
    if (isValidImageUrl(eventImageUrl)) {
      console.log('🖼️ [MAIN] Tentative de chargement de l\'image réelle:', eventImageUrl)
      imageLoaded = await addImage(ctx, eventImageUrl!, {
        ...imageOptions,
        maintainAspectRatio: true,
        fit: 'cover' // Utiliser cover pour remplir complètement le carré
      }, scale)
    }
    
    // Si l'image n'a pas pu être chargée, afficher le placeholder
    if (!imageLoaded) {
      console.log('🖼️ [MAIN] Affichage du placeholder')
      addImagePlaceholder(ctx, imageOptions.x, imageOptions.y, imageOptions.width, imageOptions.height, scale, 'Image de l\'événement')
    }
    
    // Informations du participant (ajustées pour l'image carrée)
    addText(ctx, {
      x: 20,
      y: 230, // Ajusté pour laisser de l'espace après l'image carrée (90 + 120 + 20)
      text: 'Billet de réservation',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 250,
      text: `Nom: ${reservationData.value.fullName}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 270,
      text: `Email: ${reservationData.value.email}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 290,
      text: `Téléphone: ${reservationData.value.phone}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    addText(ctx, {
      x: 20,
      y: 310,
      text: `Référence: ${reservationData.value.publicId}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    // Date de création
    const date = new Date(reservationData.value.createdAt).toLocaleDateString('fr-FR')
    addText(ctx, {
      x: 20,
      y: 330, // Plus d'espace après la référence (310 + 30)
      text: `Créé le: ${date}`,
      fontSize: 14,
      color: '#1f2937'
    }, scale)
    
    // QR Code
    const qrOptions = {
      x: (width - 200) / 2,
      y: 360,
      size: 200,
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db',
      borderWidth: 1
    }
    
    await addQRCode(ctx, qrCodeData.value, qrOptions, scale)
    
    // Instructions
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 20,
      text: 'Présentez ce billet à l\'entrée',
      fontSize: 12,
      color: '#6b7280',
      textAlign: 'center'
    }, scale)
    
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 35,
      text: 'de l\'événement',
      fontSize: 12,
      color: '#6b7280',
      textAlign: 'center'
    }, scale)
    
    // Pied de page
    addText(ctx, {
      x: width / 2,
      y: qrOptions.y + qrOptions.size + 60,
      text: 'Généré par Biso Ticket',
      fontSize: 10,
      color: '#9ca3af',
      textAlign: 'center'
    }, scale)
    
    // Attendre un peu pour s'assurer que tout est dessiné
    setTimeout(() => {
      try {
        console.log('💾 [DOWNLOAD] Tentative d\'export du canvas...')
        const success = exportCanvas(canvas, `billet-${reservationData.value.publicId}.png`)
        
        if (success) {
          console.log('✅ [DOWNLOAD] Canvas exporté avec succès')
          toast.add({
            title: 'Billet téléchargé',
            description: 'Votre billet a été téléchargé avec succès',
            color: 'success'
          })
          } else {
          throw new Error('Échec de l\'export du canvas')
        }
      } catch (exportError: any) {
        console.error('❌ [DOWNLOAD] Erreur lors de l\'export du canvas:', exportError)
        
        toast.add({
          title: 'Erreur',
          description: 'Impossible de télécharger le billet',
          color: 'error'
        })
      }
    }, 500)
    
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de télécharger le billet',
      color: 'error'
    })
  }
}



// Gérer les checkboxes multiples
const toggleCheckbox = (fieldName: string, optionValue: string, checked: boolean) => {
  // S'assurer que le champ est initialisé comme un tableau
  if (!Array.isArray(formData.value[fieldName])) {
    formData.value[fieldName] = []
  }
  
  // Créer une nouvelle référence pour déclencher la réactivité
  const currentValues = [...formData.value[fieldName]]
  
  if (checked) {
    // Ajouter la valeur si elle n'est pas déjà présente
    if (!currentValues.includes(optionValue)) {
      currentValues.push(optionValue)
    }
  } else {
    // Retirer la valeur
    const index = currentValues.indexOf(optionValue)
    if (index > -1) {
      currentValues.splice(index, 1)
    }
  }
  
  // Mettre à jour la valeur réactive
  formData.value[fieldName] = currentValues
  
  
  // Validation en temps réel après la mise à jour de la valeur
  nextTick(() => {
    validateField(fieldName)
  })
}

// Gérer les radios (sélection unique)
const selectRadio = (fieldName: string, value: string) => {
  formData.value[fieldName] = value
  
  
  // Validation en temps réel après la mise à jour de la valeur
  nextTick(() => {
    validateField(fieldName)
  })
}

// Validation en temps réel d'un champ
const validateField = (fieldName: string) => {
  if (!form.value?.fields) return
  
  const field = form.value.fields.find(f => f.name === fieldName)
  if (!field) return
  
  const value = formData.value[fieldName]
  const fieldErrors: string[] = []
  
  
  // Vérifier si le champ est requis
  const isRequired = field.is_required || field.required
  if (isRequired) {
    if (field.type === 'checkbox') {
      // Pour les checkboxes multiples, vérifier qu'au moins une option est sélectionnée
      // S'assurer que la valeur est un tableau et qu'il contient au moins un élément
      const isEmpty = !Array.isArray(value) || value.length === 0
      if (isEmpty) {
        fieldErrors.push(`${field.label} est requis (sélectionnez au moins une option)`)
      }
    } else {
      // Pour les autres types, vérifier que la valeur n'est pas vide
      if (!value || value.toString().trim() === '') {
        fieldErrors.push(`${field.label} est requis`)
      }
    }
  }
  
  // Vérifier les règles de validation seulement si la valeur existe
  if (value && field.validation_rules) {
    const rules = field.validation_rules
    
    if (field.type === 'checkbox') {
      // Validation pour les checkboxes multiples
      if (Array.isArray(value)) {
        // Validation des règles min/max seulement si des options sont sélectionnées
        if (value.length > 0) {
          if (rules.min && value.length < rules.min) {
            fieldErrors.push(`${field.label} doit contenir au moins ${rules.min} option(s)`)
          }
          if (rules.max && value.length > rules.max) {
            fieldErrors.push(`${field.label} ne peut pas dépasser ${rules.max} option(s)`)
          }
        }
      }
    } else if (field.type === 'number') {
      // Validation pour les champs numériques
      const numValue = Number(value)
      if (isNaN(numValue)) {
        fieldErrors.push(`${field.label} doit être un nombre valide`)
      } else {
        if (rules.min !== undefined && numValue < rules.min) {
          fieldErrors.push(`${field.label} doit être au moins ${rules.min}`)
        }
        if (rules.max !== undefined && numValue > rules.max) {
          fieldErrors.push(`${field.label} ne peut pas dépasser ${rules.max}`)
        }
        if (rules.step !== undefined && (numValue - (rules.min || 0)) % rules.step !== 0) {
          fieldErrors.push(`${field.label} doit être un multiple de ${rules.step}`)
        }
      }
    } else if (field.type === 'date') {
      // Validation pour les champs de date
      const dateValue = new Date(value)
      if (isNaN(dateValue.getTime())) {
        fieldErrors.push(`${field.label} doit être une date valide`)
      } else {
        if (rules.min && dateValue < new Date(rules.min)) {
          fieldErrors.push(`${field.label} ne peut pas être antérieur au ${new Date(rules.min).toLocaleDateString('fr-FR')}`)
        }
        if (rules.max && dateValue > new Date(rules.max)) {
          fieldErrors.push(`${field.label} ne peut pas être postérieur au ${new Date(rules.max).toLocaleDateString('fr-FR')}`)
        }
      }
    } else {
      // Validation pour les champs texte
      const stringValue = value.toString()
      if (rules.min && stringValue.length < rules.min) {
        fieldErrors.push(`${field.label} doit contenir au moins ${rules.min} caractères`)
      }
      if (rules.max && stringValue.length > rules.max) {
        fieldErrors.push(`${field.label} ne peut pas dépasser ${rules.max} caractères`)
      }
      if (rules.pattern && !new RegExp(rules.pattern).test(stringValue)) {
        fieldErrors.push(`${field.label} n'est pas au bon format`)
      }
    }
  }
  
  // Validation spécifique par type
  if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
    fieldErrors.push(`${field.label} doit être une adresse email valide`)
  }
  
  if (value && (field.type === 'tel' || field.type === 'phone') && !/^[\+]?[0-9\s\-\(\)]+$/.test(value.toString())) {
    fieldErrors.push(`${field.label} doit être un numéro de téléphone valide`)
  }
  
  
  // Mettre à jour les erreurs
  if (fieldErrors.length > 0) {
    validationErrors.value[fieldName] = fieldErrors
  } else {
    // Supprimer les erreurs si la validation passe
    delete validationErrors.value[fieldName]
  }
}

// Charger le formulaire au montage
onMounted(async () => {
  try {
    await loadForm()
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
    // Ne pas rediriger automatiquement, laisser l'utilisateur voir l'erreur
  }
})
</script>

<style scoped>
/* Optimisations pour mobile */
@media (max-width: 640px) {
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  /* Optimisations spécifiques pour le modal de confirmation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Réduire les espacements dans le modal sur mobile */
  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }
  
  /* Boutons plus compacts sur mobile */
  .order-1, .order-2 {
    min-height: 2.5rem;
  }
}

/* Styles pour le QR code plus compact */
@media (max-width: 640px) {
  .bg-white {
    padding: 0.5rem;
  }
}
</style>
