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
                :alt="form.event.title"
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
      <div class="space-y-4">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-gray-700 mb-2">{{ confirmationMessage }}</p>
          <p v-if="reservationId" class="text-sm text-gray-600">
            Votre référence de réservation est : <span class="font-medium text-primary-600">{{ reservationId }}</span>
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <UButton 
            color="primary" 
            variant="solid" 
            block
            @click="showConfirmationModal = false"
            class="order-2 sm:order-1"
          >
            Fermer
          </UButton>
          <UButton 
            color="neutral" 
            variant="outline" 
            block
            @click="goToEvent"
            class="order-1 sm:order-2"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            Retour à l'événement
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

const toast = useToast()

// SEO
const { setEventSEO } = useSEO()

// Métadonnées SEO spécifiques à la page de réservation
const seoTitle = computed(() => {
  if (!form.value) return 'Réservation - Biso Ticket'
  // Priorité au titre du formulaire
  if (form.value.title) {
    return `${form.value.title} | Biso Ticket`
  }
  // Fallback sur le titre de l'événement
  if (form.value.event?.title) {
    return `Réservation - ${form.value.event.title} | Biso Ticket`
  }
  return 'Formulaire de réservation | Biso Ticket'
})

const seoDescription = computed(() => {
  if (!form.value) return 'Réservez votre place pour cet événement via Biso Ticket'
  // Priorité à la description du formulaire
  if (form.value.description) {
    return form.value.description
  }
  // Fallback sur le titre du formulaire ou de l'événement
  const eventTitle = form.value.event?.title || form.value.title || 'cet événement'
  return `Réservez votre place pour ${eventTitle} via Biso Ticket`
})

// Définir les métadonnées SEO
useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { name: 'robots', content: 'index, follow' }
  ]
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: computed(() => form.value?.event?.image_url || form.value?.event?.image || '/images/event-default.jpg'),
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: computed(() => form.value?.event?.image_url || form.value?.event?.image || '/images/event-default.jpg')
})

// État local
const form = ref<ReservationForm | null>(null)
const formData = ref<Record<string, any>>({})
const validationErrors = ref<Record<string, string[]>>({})
const submitting = ref(false)
const showConfirmationModal = ref(false)
const confirmationMessage = ref('')
const reservationId = ref<number | null>(null)

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
    
    // Définir le SEO si l'événement existe
    if (form.value?.event) {
      setEventSEO(form.value.event)
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
    const reservationData: {
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
      reservationData.payment_method = paymentMethod.value
    }
    
    // Soumettre la réservation
    const result = await submitReservationAPI(reservationData)
    
    // Afficher la confirmation
    reservationId.value = result.id
    confirmationMessage.value = result.message
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
}
</style>
