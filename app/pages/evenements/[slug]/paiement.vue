<template>
  <div class="px-4 py-8 md:px-8 pt-20 lg:px-12 max-w-5xl mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Paiement</h1>
      <p class="text-gray-600">Finalisez votre réservation en sélectionnant votre mode de paiement</p>
    </div>

    <!-- Informations de l'événement -->
    <div v-if="event" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Détails de l'événement</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-medium text-gray-900">{{ event.name }}</h3>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Date :</span> {{ formatDate(event.date_time) }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Lieu :</span> {{ event.location }}
          </p>
        </div>
      </div>
    </div>

    <!-- Récapitulatif des tickets -->
    <div v-if="reservationSummary" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Récapitulatif de votre commande</h2>
      
      <!-- Liste des tickets -->
      <div class="space-y-3 mb-4">
        <div
          v-for="ticketSelection in reservationSummary.selectedTickets"
          :key="ticketSelection.ticketId"
          class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
        >
          <div>
            <span class="font-medium text-gray-900">{{ ticketSelection.ticket.type }}</span>
            <span class="text-gray-600 text-sm ml-2">x{{ ticketSelection.quantity }}</span>
          </div>
          <span class="font-semibold text-gray-900">
            {{ (parseFloat(ticketSelection.ticket.price) * ticketSelection.quantity).toFixed(2) }} {{ ticketSelection.ticket.devise }}
          </span>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t border-gray-200 pt-4">
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-900">Total à payer</span>
          <span class="text-2xl font-bold text-primary-600">
            {{ reservationSummary.totalPrice.toFixed(2) }} {{ reservationSummary.currency }}
          </span>
        </div>
      </div>
    </div>

    <!-- Section de paiement Mobile Money -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Paiement par Mobile Money</h2>
      
      <!-- Sélection de l'opérateur -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Sélectionnez votre opérateur Mobile Money
        </label>
        <div class="flex flex-col md:flex-row gap-4">
          <label
            v-for="operator in mobileMoneyOperators"
            :key="operator.id"
            class="flex-1 flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors min-w-0"
            :class="{ 'border-primary-500 bg-primary-50': selectedOperator === operator.id }"
          >
            <input
              v-model="selectedOperator"
              type="radio"
              name="mobileMoneyOperator"
              :value="operator.id"
              class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <div class="ml-3 flex items-center">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                :class="operator.bgColor"
              >
                <span class="text-white font-bold text-sm">{{ operator.initial }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-900">{{ operator.name }}</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Numéro de téléphone -->
      <div class="mb-6">
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <input
          id="phoneNumber"
          v-model="phoneNumber"
          type="tel"
          placeholder="Ex: +243 123 456 789"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-500': phoneError }"
        />
        <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
      </div>

      <!-- Bouton de paiement -->
      <button
        v-if="!isWaitingForSMS"
        @click="processPayment"
        :disabled="!canProcessPayment"
        class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isProcessing">Traitement en cours...</span>
        <span v-else>Payer {{ reservationSummary?.totalPrice.toFixed(2) }} {{ reservationSummary?.currency }}</span>
      </button>

      <!-- Bouton désactivé pendant l'attente SMS -->
      <button
        v-else
        disabled
        class="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed"
      >
        Paiement en cours...
      </button>

      <!-- Message de succès -->
      <div v-if="isWaitingForSMS" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-green-900 mb-2">
            ✅ Réservation effectuée avec succès !
          </h3>
          <p class="text-green-700 text-sm">
            Votre réservation a été enregistrée. Un SMS de confirmation a été envoyé au numéro <strong>{{ phoneNumber }}</strong>.
            <br>Veuillez confirmer le paiement en répondant au SMS.
          </p>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="paymentError" class="mt-3 text-center">
        <p class="text-sm text-red-600 mb-3">{{ paymentError }}</p>
        <button
          @click="retryPayment"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Réessayer le paiement
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de countdown pour le paiement -->
  <Modal v-model="isWaitingForSMS" :show-close-button="false" :close-on-backdrop="false">
    <template #header>
      <h3 class="text-xl font-semibold text-gray-900">
        Confirmation de paiement
      </h3>
    </template>
    
    <div class="text-center">
      <!-- Icône de chargement -->
      <div class="mb-6">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      </div>
      
      <!-- Message -->
      <p class="text-gray-600 mb-6">
        Une notification de confirmation de paiement a été envoyée sur ce numéro <strong>{{ phoneNumber }}</strong>.
        <br>Veuillez confirmer sur votre téléphone.
      </p>
      
      <!-- Compteur -->
      <div class="flex items-center justify-center space-x-2 mb-6">
        <span class="text-sm text-blue-600">Temps restant :</span>
        <div class="flex items-center space-x-1">
          <span class="text-2xl font-bold" :class="countdown <= 10 ? 'text-red-600' : 'text-blue-800'">
            {{ Math.floor(countdown / 60) }}
          </span>
          <span class="text-blue-600">:</span>
          <span class="text-2xl font-bold" :class="countdown <= 10 ? 'text-red-600' : 'text-blue-800'">
            {{ (countdown % 60).toString().padStart(2, '0') }}
          </span>
        </div>
      </div>
      
      <!-- Avertissement temps restant -->
      <div v-if="countdown <= 10" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 text-center">
          ⚠️ Il ne reste que {{ countdown }} seconde{{ countdown > 1 ? 's' : '' }} !
        </p>
      </div>
      
      <!-- Instructions -->
      <div class="text-sm text-blue-600 space-y-2 mb-6">
        <p>• Vérifiez votre téléphone</p>
        <p>• Confirmez le paiement</p>
        <p>• Attendez la validation automatique</p>
      </div>
      
      <!-- Message informatif -->
      <div class="text-xs text-gray-500 mb-4">
        <p>💡 Le statut sera vérifié automatiquement</p>
        <p>Vous serez redirigé dès confirmation</p>
      </div>
    </div>
    
    <template #footer>
      <button
        @click="stopCountdown"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
      >
        Fermer
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { Event } from '~/types/events'
import { useTickets } from '~/composables/useTickets'
import { useUserPreferences } from '~/composables/useUserPreferences'
import { useAuth } from '~/composables/useAuth'
import { useApiConfig } from '~/composables/useApiConfig'
import Modal from '~/components/Modal.vue'

// Interface pour la réponse de l'API de réservation
interface ReservationAPIResponse {
  success: boolean
  message: string
  data: {
    participant: {
      id: number
      token: string
    }
    redirect_to_my_tickets: boolean
  }
}

// Récupération du slug depuis l'URL
const route = useRoute()
const slug = route.params.slug as string

// État local
const selectedOperator = ref('')
const phoneNumber = ref('')
const phoneError = ref('')
const paymentError = ref('')
const isProcessing = ref(false)
const countdown = ref(60)
const isWaitingForSMS = ref(false)
const countdownInterval = ref<NodeJS.Timeout | null>(null)
const pollingInterval = ref<NodeJS.Timeout | null>(null)

// Tableau des opérateurs Mobile Money (IDs selon l'API)
const mobileMoneyOperators = ref([
  {
    id: '1',
    name: 'Airtel Money',
    initial: 'A',
    bgColor: 'bg-red-600'
  },
  {
    id: '2',
    name: 'M-Pesa',
    initial: 'M',
    bgColor: 'bg-green-600'
  },
  {
    id: '3',
    name: 'Orange Money',
    initial: 'O',
    bgColor: 'bg-orange-500'
  }
])

// Utilisation des composables
const { reservationSummary, currentEvent } = useTickets()
const { 
  preferredMobileMoneyOperator, 
  phoneNumber: savedPhoneNumber,
  setPreferredMobileMoneyOperator,
  setPhoneNumber
} = useUserPreferences()
const { isAuthenticated, user, token } = useAuth()

// Computed pour l'événement
const event = computed(() => currentEvent.value)

// Initialiser les valeurs depuis les préférences utilisateur
onMounted(() => {
  if (preferredMobileMoneyOperator.value) {
    selectedOperator.value = preferredMobileMoneyOperator.value
  }
  if (savedPhoneNumber.value) {
    phoneNumber.value = savedPhoneNumber.value
  }
})

// Validation du formulaire
const canProcessPayment = computed(() => {
  return selectedOperator.value && 
         phoneNumber.value && 
         !phoneError.value && 
         reservationSummary.value &&
         !isProcessing.value &&
         !isWaitingForSMS.value
})

// Démarrer le compteur (décompte de 60 à 0)
const startCountdown = () => {
  countdown.value = 60
  isWaitingForSMS.value = true
  
  // Compteur qui décompte de 60 à 0
  countdownInterval.value = setInterval(() => {
    countdown.value--
    
    // Arrêter le compteur quand il atteint 0
    if (countdown.value <= 0) {
      stopCountdown()
      paymentError.value = 'Temps d\'attente écoulé. Veuillez réessayer votre paiement.'
    }
  }, 1000)
  
  // Démarrer la vérification périodique du statut (toutes les 10 secondes)
  startStatusPolling()
}

// Démarrer la vérification périodique du statut
const startStatusPolling = () => {
  // DÉSACTIVER le polling automatique pour l'instant
  // Il sera activé plus tard quand on aura l'endpoint réel
  console.log('Polling automatique désactivé - en attente de l\'endpoint réel')
  
  /*
  pollingInterval.value = setInterval(async () => {
    try {
      // Vérifier le statut du paiement
      await checkPaymentStatus()
    } catch (error) {
      console.error('Erreur lors de la vérification périodique:', error)
    }
  }, 10000) // Vérifier toutes les 10 secondes
  */
}

// Arrêter le compteur et le polling
const stopCountdown = () => {
  // Arrêter le compteur
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  
  // Arrêter le polling
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  
  // Réinitialiser le compteur à 60
  countdown.value = 60
  isWaitingForSMS.value = false
}

// Vérifier le statut du paiement
const checkPaymentStatus = async () => {
  try {
    console.log('Vérification du statut du paiement...')
    
    // DÉSACTIVÉ - Cette fonction ne fait plus de redirection automatique
    // Elle sera utilisée plus tard quand on aura l'endpoint réel de vérification
    console.log('Vérification du statut désactivée - en attente de l\'endpoint réel')
    
    /*
    // Pour l'instant, on simule une vérification
    // En production, utilisez l'API réelle
    if (Math.random() > 0.5) {
      // Paiement confirmé - ARRÊTER le compteur et rediriger vers mes billets
      stopCountdown()
      navigateTo('/tickets/my-tickets')
    } else {
      // Paiement toujours en attente - CONTINUER le compteur
      console.log('Paiement toujours en attente, continuation du countdown...')
    }
    */
    
  } catch (error: any) {
    console.error('Erreur lors de la vérification du statut:', error)
    
    // Gestion des erreurs avec messages clairs
    if (error.status === 401) {
      paymentError.value = 'Votre session a expiré. Veuillez vous reconnecter.'
      stopCountdown()
      navigateTo('/connexion')
    } else if (error.status === 404) {
      paymentError.value = 'Réservation non trouvée. Veuillez vérifier votre réservation.'
    } else if (error.message) {
      paymentError.value = `Erreur de vérification: ${error.message}`
    } else {
      paymentError.value = 'Erreur lors de la vérification du statut. Le compteur continue.'
    }
    
    // En cas d'erreur, continuer le compteur
    // L'utilisateur peut réessayer
  }
}



// Validation du numéro de téléphone
const validatePhoneNumber = (phone: string) => {
  if (!phone) {
    phoneError.value = 'Le numéro de téléphone est requis'
    return false
  }
  // Format: +243XXXXXXXXX ou 243XXXXXXXXX
  const phoneRegex = /^(\+243|243)?[0-9]{9}$/
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    phoneError.value = 'Veuillez entrer un numéro de téléphone congolais valide'
    return false
  }
  phoneError.value = ''
  return true
}

// Écouter les changements du numéro de téléphone
watch(phoneNumber, (newPhone) => {
  if (newPhone) {
    validatePhoneNumber(newPhone)
    // Sauvegarder dans les préférences
    setPhoneNumber(newPhone)
  } else {
    phoneError.value = ''
  }
})

// Écouter les changements de l'opérateur sélectionné
watch(selectedOperator, (newOperator) => {
  if (newOperator) {
    // Sauvegarder dans les préférences
    setPreferredMobileMoneyOperator(newOperator as '1' | '2' | '3')
  }
})

// Traitement du paiement
const processPayment = async () => {
  if (!canProcessPayment.value) return

  // Vérifier l'authentification
  if (!isAuthenticated.value || !token.value) {
    paymentError.value = 'Vous devez être connecté pour effectuer une réservation. Veuillez vous connecter.'
    navigateTo('/connexion')
    return
  }

  // Validation finale
  if (!validatePhoneNumber(phoneNumber.value)) return

  // DÉMARRER IMMÉDIATEMENT le modal et le countdown
  startCountdown()
  
  // Sauvegarder les préférences utilisateur
  setPreferredMobileMoneyOperator(selectedOperator.value as '1' | '2' | '3')
  setPhoneNumber(phoneNumber.value)

  // Envoyer la requête API en arrière-plan
  sendReservationRequest()
}

// Fonction pour réessayer le paiement
const retryPayment = () => {
  // Effacer l'erreur précédente
  paymentError.value = ''
  
  // Relancer le processus de paiement
  processPayment()
}

// Fonction séparée pour envoyer la requête API
const sendReservationRequest = async () => {
  try {
    if (!reservationSummary.value) {
      throw new Error('Aucun ticket sélectionné')
    }

    // Créer la requête de réservation
    const reservationRequest = {
      tickets: reservationSummary.value.selectedTickets.map(ticket => ({
        ticket_id: ticket.ticketId,
        quantity: ticket.quantity
      })),
      pay_type: parseInt(selectedOperator.value),
      telephone: phoneNumber.value.replace(/\s/g, ''), // Supprimer les espaces
      pay_with_card: false
    }

    console.log('Réservation en cours:', reservationRequest)

    // Effectuer la réservation via l'API avec $fetch
    const { baseUrl, createAuthHeaders } = useApiConfig()
    
    if (!token.value) {
      throw new Error('Token d\'authentification manquant')
    }
    
    const response = await $fetch<ReservationAPIResponse>('/tickets/reserve', {
      method: 'POST',
      baseURL: baseUrl,
      body: reservationRequest,
      headers: createAuthHeaders(token.value)
    })

    console.log('Réponse API reçue:', response)
    
    // Vérifier que l'API a vraiment répondu avec succès
    if (response && response.success === true && response.data) {
      console.log('✅ Réservation réussie confirmée par l\'API avec données:', response.data)
      stopCountdown()
      navigateTo('/tickets/my-tickets')
    } else {
      // L'API n'a pas confirmé le succès ou données manquantes
      console.log('❌ API n\'a pas confirmé le succès ou données manquantes:', response)
      throw new Error(response?.message || 'L\'API n\'a pas confirmé le succès de la réservation ou données manquantes')
    }

  } catch (error: any) {
    console.error('Erreur lors de la réservation:', error)
    
    // ÉCHEC : Arrêter le countdown et afficher l'erreur
    stopCountdown()
    
    // Gestion des erreurs avec messages clairs pour l'utilisateur
    if (error.status === 401) {
      paymentError.value = 'Votre session a expiré. Veuillez vous reconnecter et réessayer.'
      navigateTo('/connexion')
    } else if (error.status === 422) {
      paymentError.value = 'Les données de réservation sont invalides. Veuillez vérifier vos informations.'
    } else if (error.status === 429) {
      paymentError.value = 'Trop de tentatives. Veuillez attendre quelques minutes avant de réessayer.'
    } else if (error.status === 500) {
      // Erreur 500 - probablement paiement annulé ou échoué
      // Vérifier si c'est un paiement annulé (vous avez reçu la notification)
      if (phoneNumber.value) {
        paymentError.value = `Votre paiement a été annulé ou a échoué sur le numéro ${phoneNumber.value}. Veuillez réessayer.`
      } else {
        paymentError.value = 'Votre paiement a été annulé ou a échoué. Veuillez réessayer.'
      }
    } else if (error.status === 503) {
      paymentError.value = 'Service temporairement indisponible. Veuillez réessayer plus tard.'
    } else if (error.message) {
      // Si l'API retourne un message d'erreur spécifique
      paymentError.value = `Votre paiement a échoué: ${error.message}`
    } else {
      // Message générique
      paymentError.value = 'Votre paiement a échoué. Veuillez vérifier vos informations et réessayer.'
    }
  }
}

// Formatage de la date
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Vérification que l'utilisateur a des tickets sélectionnés
onMounted(() => {
  if (!reservationSummary.value) {
    // Redirection vers la page des événements si aucun ticket n'est sélectionné
    navigateTo('/evenements')
  }
})

// Nettoyer le compteur lors de la destruction du composant
onUnmounted(() => {
  stopCountdown()
})
</script>