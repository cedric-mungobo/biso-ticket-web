<template>
  <Modal v-model="showModal" title="Formulaires de réservation" class="modal-mobile-optimized">
    <div class="modal-content-mobile">
      <!-- Bouton Ajouter un formulaire -->
      <div class="mb-4 flex justify-end">
        <UButton 
          @click="openCreateForm"
          variant="solid"
          color="primary"
          size="sm"
          class="shadow-sm"
        >
          <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          Ajouter un formulaire
        </UButton>
      </div>

      <div v-if="loading" class="space-y-3">
        <USkeleton class="h-20 w-full" />
        <USkeleton class="h-20 w-full" />
        <USkeleton class="h-20 w-2/3" />
      </div>
      
      <div v-else-if="error" class="text-center py-6">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p class="text-sm text-red-600 mb-2">{{ error }}</p>
        <UButton 
          @click="refreshForms"
          variant="outline"
          color="error"
          size="sm"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
          Réessayer
        </UButton>
      </div>
      
      <div v-else-if="!forms || forms.length === 0" class="text-center py-6">
        <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-500">Aucun formulaire de réservation configuré.</p>
        <UButton 
          @click="openCreateForm"
          variant="solid"
          color="primary"
          size="sm"
          class="mt-4"
        >
          <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          Créer votre premier formulaire
        </UButton>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="form in forms" :key="form.id" class="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200">
          <!-- En-tête du formulaire -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ form.title }}</h3>
              <p v-if="form.description" class="text-xs text-gray-600 line-clamp-2">{{ form.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UBadge 
                :color="(form.is_active || form.isActive) ? 'success' : 'neutral'" 
                variant="soft" 
                class="text-xs"
              >
                {{ (form.is_active || form.isActive) ? 'Actif' : 'Inactif' }}
              </UBadge>
              <UBadge 
                v-if="form.requires_payment || form.paymentRequired" 
                color="warning" 
                variant="soft" 
                class="text-xs"
              >
                Paiement requis
              </UBadge>
            </div>
          </div>

          <!-- Informations du formulaire -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div v-if="form.fixed_price || form.fixedPrice" class="text-xs">
              <span class="text-gray-500">Prix fixe:</span>
              <span class="font-medium text-gray-900 ml-1">{{ form.fixed_price || form.fixedPrice }} USD</span>
            </div>
            <div v-if="form.max_reservations || form.maxReservations" class="text-xs">
              <span class="text-gray-500">Max réservations:</span>
              <span class="font-medium text-gray-900 ml-1">{{ form.max_reservations || form.maxReservations }}</span>
            </div>
            <div v-if="form.reservation_starts_at || form.reservationStartsAt" class="text-xs">
              <span class="text-gray-500">Début:</span>
              <span class="font-medium text-gray-900 ml-1">{{ formatReservationDate((form.reservation_starts_at || form.reservationStartsAt) ?? null) }}</span>
            </div>
            <div v-if="form.reservation_ends_at || form.reservationEndsAt" class="text-xs">
              <span class="text-gray-500">Fin:</span>
              <span class="font-medium text-gray-900 ml-1">{{ formatReservationDate((form.reservation_ends_at || form.reservationEndsAt) ?? null) }}</span>
            </div>
          </div>

          <!-- Champs du formulaire -->
          <div v-if="form.fields && form.fields.length > 0" class="mb-3">
            <p class="text-xs text-gray-500 mb-2">Champs ({{ form.fields.length }}):</p>
            <div class="flex flex-wrap gap-1">
              <UBadge 
                v-for="field in form.fields.slice(0, 3)" 
                :key="field.id"
                variant="outline" 
                size="xs"
                class="text-xs"
              >
                {{ field.label }}
              </UBadge>
              <UBadge 
                v-if="form.fields.length > 3"
                variant="outline" 
                size="xs"
                class="text-xs"
              >
                +{{ form.fields.length - 3 }} autres
              </UBadge>
            </div>
          </div>

              <!-- Actions du formulaire -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                <div class="flex items-center gap-1">
                  <UButton 
                    size="xs" 
                    variant="ghost" 
                    color="primary" 
                    @click="openViewForm(form)"
                    class="min-h-[32px] min-w-[32px]"
                    :ui="{ base: 'touch-manipulation' }"
                    title="Voir les réservations"
                  >
                    <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                  </UButton>
                  <UButton 
                    size="xs" 
                    variant="ghost" 
                    color="info" 
                    @click="copyPublicLink(form)"
                    class="min-h-[32px] min-w-[32px]"
                    :ui="{ base: 'touch-manipulation' }"
                    title="Copier le lien public"
                  >
                    <UIcon name="i-heroicons-link" class="w-4 h-4" />
                  </UButton>
                  <UButton 
                    size="xs" 
                    variant="ghost" 
                    color="warning" 
                    @click="openEditForm(form)"
                    class="min-h-[32px] min-w-[32px]"
                    :ui="{ base: 'touch-manipulation' }"
                    title="Modifier le formulaire"
                  >
                    <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                  </UButton>
                  <UButton 
                    size="xs" 
                    variant="ghost" 
                    color="error" 
                    @click="openDeleteForm(form)"
                    class="min-h-[32px] min-w-[32px]"
                    :ui="{ base: 'touch-manipulation' }"
                    title="Supprimer le formulaire"
                  >
                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                  </UButton>
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatReservationDate((form.created_at || form.createdAt) ?? null) }}
                </div>
              </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
// Import explicite du composable
import { useReservationForms } from '~/composables/useReservationForms'
import Modal from '~/components/Modal.vue'

interface ReservationForm {
  id: number
  event_id?: number
  eventId?: number
  title: string
  description?: string
  is_active?: boolean
  isActive?: boolean
  requires_payment?: boolean
  paymentRequired?: boolean
  fixed_price?: string
  fixedPrice?: string
  max_reservations?: number
  maxReservations?: number
  reservation_starts_at?: string
  reservationStartsAt?: string
  reservation_ends_at?: string
  reservationEndsAt?: string
  public_id?: string
  publicId?: string
  settings: any
  fields: any[]
  event: {
    id: number
    title: string
    slug: string
    status: string
  }
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

interface Props {
  eventId: number
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'create-form'): void
  (e: 'view-form', form: ReservationForm): void
  (e: 'edit-form', form: ReservationForm): void
  (e: 'delete-form', form: ReservationForm): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Import du composable
const { fetchReservationForms, formatReservationDate, loading, error } = useReservationForms()

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const forms = ref<ReservationForm[]>([])

// Charger les formulaires de réservation
const loadForms = async () => {
  try {
    const response = await fetchReservationForms({ 
      event_id: props.eventId, 
      per_page: 50 
    })
    forms.value = response.data
    
    // Debug: afficher les données des formulaires
    console.log('Formulaires chargés:', forms.value)
    forms.value.forEach((form, index) => {
      console.log(`Formulaire ${index + 1}:`, {
        id: form.id,
        title: form.title,
        event: form.event,
        public_id: form.public_id || form.publicId
      })
    })
  } catch (err) {
    console.error('Erreur lors du chargement des formulaires de réservation:', err)
    forms.value = []
  }
}

// Rafraîchir les formulaires
const refreshForms = async () => {
  await loadForms()
}

// Fonctions pour les actions
const openCreateForm = () => {
  emit('create-form')
}

const openViewForm = (form: ReservationForm) => {
  // Rediriger vers la page des réservations du formulaire
  const eventId = props.eventId
  const formId = form.id
  navigateTo(`/organisateur/events/${eventId}/reservations/${formId}`)
}

const openEditForm = (form: ReservationForm) => {
  emit('edit-form', form)
}

const openDeleteForm = (form: ReservationForm) => {
  emit('delete-form', form)
}

const copyPublicLink = async (form: ReservationForm) => {
  try {
    // Récupérer le slug de l'événement depuis l'API
    let eventSlug = form.event?.slug
    
    if (!eventSlug) {
      // Si le slug n'est pas disponible, récupérer l'événement depuis l'API
      try {
        const { $myFetch } = useNuxtApp()
        const eventResponse = await $myFetch(`/events/${props.eventId}`) as any
        eventSlug = eventResponse?.data?.slug || eventResponse?.slug
      } catch (apiErr) {
        console.warn('Impossible de récupérer le slug de l\'événement:', apiErr)
      }
    }
    
    // Utiliser le slug récupéré ou un fallback
    const finalEventSlug = eventSlug || 'event'
    const formId = form.public_id || form.publicId || form.id
    const publicUrl = `${window.location.origin}/evenements/${finalEventSlug}/reservation/${formId}`
    
    console.log('Lien public généré:', publicUrl)
    
    // Copier dans le presse-papiers
    await navigator.clipboard.writeText(publicUrl)
    
    // Afficher une notification de succès
    const toast = useToast()
    toast.add({
      title: 'Lien copié',
      description: `Le lien public a été copié: ${publicUrl}`,
      color: 'success'
    })
  } catch (err) {
    console.error('Erreur lors de la copie du lien:', err)
    const toast = useToast()
    toast.add({
      title: 'Erreur',
      description: 'Impossible de copier le lien. Veuillez réessayer.',
      color: 'error'
    })
  }
}

// Charger les formulaires quand le modal s'ouvre
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadForms()
  }
})

// Charger les formulaires au montage du composant
onMounted(() => {
  if (props.show) {
    loadForms()
  }
})
</script>

<style scoped>
/* Optimisations pour mobile */
@media (max-width: 640px) {
  .modal-mobile-optimized :deep(.ui-modal) {
    margin: 0.25rem;
    max-width: calc(100vw - 0.5rem);
    max-height: calc(100vh - 0.5rem);
    width: calc(100vw - 0.5rem);
    height: calc(100vh - 0.5rem);
    display: flex;
    flex-direction: column;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-header) {
    flex-shrink: 0;
    padding: 1rem 1rem 0.5rem 1rem;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-body) {
    flex: 1;
    overflow: hidden;
    padding: 0.5rem 1rem;
  }
  
  .modal-mobile-optimized :deep(.ui-modal .ui-modal-footer) {
    flex-shrink: 0;
    padding: 0.5rem 1rem 1rem 1rem;
  }
  
  .modal-content-mobile {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: 0.25rem;
  }
  
  .modal-content-mobile::-webkit-scrollbar {
    width: 4px;
  }
  
  .modal-content-mobile::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .modal-content-mobile::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  
  .modal-content-mobile::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
