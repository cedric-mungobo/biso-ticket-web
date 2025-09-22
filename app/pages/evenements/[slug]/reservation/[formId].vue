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
            <h3 class="text-lg font-semibold text-gray-900">Informations de réservation</h3>
          </template>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Champs du formulaire -->
            <div v-for="field in sortedFields" :key="field.id" class="space-y-2">
                  <label :for="field.name" class="block text-sm font-medium text-gray-700">
                    {{ field.label }}
                    <span v-if="field.is_required || field.required" class="text-red-500">*</span>
                  </label>
              
              <!-- Champ texte -->
              <UInput
                v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type"
                :placeholder="field.placeholder"
                :required="field.is_required || field.required"
                :error="validationErrors[field.name]?.[0]"
                class="w-full"
              />
              
              <!-- Champ nombre -->
              <UInput
                v-else-if="field.type === 'number'"
                :id="field.name"
                v-model="formData[field.name]"
                type="number"
                :placeholder="field.placeholder"
                :required="field.is_required || field.required"
                :error="validationErrors[field.name]?.[0]"
                class="w-full"
              />
              
              <!-- Zone de texte -->
              <UTextarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                :required="field.is_required || field.required"
                :error="validationErrors[field.name]?.[0]"
                class="w-full"
                :rows="4"
              />
              
              <!-- Date -->
              <UInput
                v-else-if="field.type === 'date'"
                :id="field.name"
                v-model="formData[field.name]"
                type="date"
                :required="field.is_required || field.required"
                :error="validationErrors[field.name]?.[0]"
                class="w-full"
              />
              
              <!-- Sélection -->
              <USelect
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="formData[field.name]"
                :options="field.options || []"
                :placeholder="field.placeholder"
                :required="field.is_required || field.required"
                :error="validationErrors[field.name]?.[0]"
                class="w-full"
              />
              
              <!-- Checkbox -->
              <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                <UCheckbox
                  :id="field.name"
                  v-model="formData[field.name]"
                  :required="field.is_required || field.required"
                  :error="validationErrors[field.name]?.[0]"
                />
                <label :for="field.name" class="ml-2 text-sm text-gray-700">
                  {{ field.label }}
                </label>
              </div>
              
              <!-- Radio -->
              <div v-else-if="field.type === 'radio'" class="space-y-2">
                <div v-for="option in field.options" :key="option.value" class="flex items-center">
                  <URadio
                    :id="`${field.name}-${option.value}`"
                    v-model="formData[field.name]"
                    :value="option.value"
                    :required="field.is_required || field.required"
                    :error="validationErrors[field.name]?.[0]"
                  />
                  <label :for="`${field.name}-${option.value}`" class="ml-2 text-sm text-gray-700">
                    {{ option.label }}
                  </label>
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
                required
                class="w-full"
              />
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
  layout: 'default'
  // Pas de middleware - page accessible à tous (géré dans le middleware guest global)
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
  
  console.log('Champs triés:', fields)
  return fields
})

// Vérifier si on peut soumettre
const canSubmit = computed(() => {
  if (!form.value) return false
  if (submitting.value) return false
  
  // Vérifier que tous les champs requis sont remplis
  const requiredFields = sortedFields.value.filter(field => field.is_required || field.required)
  const hasAllRequiredFields = requiredFields.every(field => {
    const value = formData.value[field.name]
    if (field.type === 'checkbox') {
      return value === true
    }
    return value && value.toString().trim() !== ''
  })
  
  // Si paiement requis ET prix défini, vérifier que la méthode est sélectionnée
  const hasPaymentRequired = form.value.requires_payment || form.value.paymentRequired
  const hasPrice = form.value.fixed_price || form.value.fixedPrice
  const hasPaymentMethod = !(hasPaymentRequired && hasPrice) || paymentMethod.value !== ''
  
  return hasAllRequiredFields && hasPaymentMethod
})

// Charger le formulaire
const loadForm = async () => {
  try {
    console.log('Chargement du formulaire:', { eventSlug, formId, isNumeric: !isNaN(Number(formId)) })
    
    // Essayer d'abord avec l'ID public via l'événement
    if (isNaN(Number(formId))) {
      // C'est probablement un UUID public
      console.log('Tentative avec UUID public via événement')
      form.value = await fetchReservationFormByEventAndPublicId(eventSlug, formId)
    } else {
      // C'est un ID numérique
      console.log('Tentative avec ID numérique')
      form.value = await fetchReservationFormById(Number(formId))
    }
    
    console.log('Formulaire chargé:', form.value)
    
    // Initialiser les données du formulaire
    initializeFormData()
  } catch (err) {
    console.error('Erreur lors du chargement du formulaire:', err)
  }
}

// Initialiser les données du formulaire
const initializeFormData = () => {
  if (!form.value?.fields) return
  
  const data: Record<string, any> = {}
  form.value.fields.forEach(field => {
    if (field.is_active || field.isActive) {
      data[field.name] = field.type === 'checkbox' ? false : ''
    }
  })
  formData.value = data
  console.log('Données du formulaire initialisées:', data)
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

// Charger le formulaire au montage
onMounted(() => {
  loadForm()
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
