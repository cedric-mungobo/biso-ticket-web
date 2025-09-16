<template>
  <div>
    <div class="px-2 py-16 md:px-8  lg:px-12 container mx-auto">
    <!-- En-tête de la page -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Paiement</h1>
      <p class="text-gray-600">Finalisez votre réservation en sélectionnant votre mode de paiement</p>
    </div>

    <!-- Informations de l'événement -->
    <div v-if="event" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Détails de l'événement</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-medium text-gray-900">{{ event.title }}</h3>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Date :</span> {{ formatDate(event.startsAt) }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Lieu :</span> {{ event.location }}
          </p>
        </div>
      </div>
    </div>

    <!-- Récapitulatif des tickets -->
    <div v-if="reservationSummary" class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Récapitulatif de votre commande</h2>
      
      <!-- Liste des tickets -->
      <div class="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <div
          v-for="ticketSelection in reservationSummary.selectedTickets"
          :key="ticketSelection.ticketId"
          class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
        >
          <div class="min-w-0 flex-1 pr-2">
            <span class="font-medium text-gray-900 text-sm sm:text-base block sm:inline">{{ ticketSelection.ticket.name || ticketSelection.ticket.type }}</span>
            <span class="text-gray-600 text-xs sm:text-sm ml-0 sm:ml-2 block sm:inline">x{{ ticketSelection.quantity }}</span>
          </div>
          <span class="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
            {{ formatMoney(parseFloat(ticketSelection.ticket.price as any) * ticketSelection.quantity) }} {{ ticketSelection.ticket.currency || ticketSelection.ticket.devise || reservationSummary.currency }}
          </span>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t border-gray-200 pt-3 sm:pt-4">
        <div class="flex justify-between items-center">
          <span class="text-base sm:text-lg font-semibold text-gray-900">Total à payer</span>
          <span class="text-xl sm:text-2xl font-bold text-primary-600">
            {{ formatMoney(reservationSummary.totalPrice) }} {{ reservationSummary.currency }}
          </span>
        </div>
      </div>
    </div>

    <!-- Section de paiement (conditionnelle selon le type de ticket) -->
    <div v-if="hasPaidTickets" class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Méthode de Paiement</h2>
      
      <!-- Sélection de la méthode -->
      <div class="mb-4 sm:mb-6">
        <h3 class="mb-3 sm:mb-4 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Choisissez votre méthode de paiement</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <!-- Mobile Money Option -->
          <label 
            for="payment-mobile-money" 
            class="relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="paymentMethod === 'mobile_money' 
              ? 'border-primary-500 bg-primary-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
              <input 
                id="payment-mobile-money" 
                v-model="paymentMethod"
                type="radio" 
                value="mobile_money" 
                name="payment-method" 
              class="sr-only"
            >
            <div class="flex items-center space-x-2 sm:space-x-3 w-full">
              <!-- Custom Radio Button -->
              <div class="flex-shrink-0">
                <div 
                  class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  :class="paymentMethod === 'mobile_money' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-300 bg-white'"
                >
                  <div 
                    v-if="paymentMethod === 'mobile_money'"
                    class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"
                  ></div>
                </div>
              </div>
              
              <!-- Icon and Text -->
              <div class="flex items-center space-x-2 sm:space-x-3 flex-1">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6" :class="paymentMethod === 'mobile_money' ? 'text-primary-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm sm:text-base" :class="paymentMethod === 'mobile_money' ? 'text-primary-900' : 'text-gray-900'">
                    Mobile Money
                  </div>
                  <div class="text-xs sm:text-sm" :class="paymentMethod === 'mobile_money' ? 'text-primary-600' : 'text-gray-500'">
                    Airtel, Orange, Vodacom, Africell
                  </div>
                </div>
              </div>
              
              <!-- Check Icon -->
              <div v-if="paymentMethod === 'mobile_money'" class="flex-shrink-0">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </label>

          <!-- Card Payment Option -->
          <label 
            for="payment-card" 
            class="relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="paymentMethod === 'card' 
              ? 'border-primary-500 bg-primary-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
              <input 
                id="payment-card" 
                v-model="paymentMethod"
                type="radio" 
                value="card" 
                name="payment-method" 
              class="sr-only"
            >
            <div class="flex items-center space-x-2 sm:space-x-3 w-full">
              <!-- Custom Radio Button -->
              <div class="flex-shrink-0">
                <div 
                  class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  :class="paymentMethod === 'card' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-300 bg-white'"
                >
                  <div 
                    v-if="paymentMethod === 'card'"
                    class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"
                  ></div>
                </div>
              </div>
              
              <!-- Icon and Text -->
              <div class="flex items-center space-x-2 sm:space-x-3 flex-1">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6" :class="paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm sm:text-base" :class="paymentMethod === 'card' ? 'text-primary-900' : 'text-gray-900'">
                    Carte bancaire
                  </div>
                  <div class="text-xs sm:text-sm" :class="paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-500'">
                    Visa, Mastercard
                  </div>
                </div>
              </div>
              
              <!-- Check Icon -->
              <div v-if="paymentMethod === 'card'" class="flex-shrink-0">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Sélection de la devise -->
      <div v-if="paymentMethod" class="mb-4 sm:mb-6">
        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Devise de paiement
        </label>
        <div class="flex gap-2 sm:gap-3">
          <!-- USD Option -->
          <label class="relative flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
            :class="paymentCurrency === 'USD' 
              ? 'border-primary-500 bg-primary-50 shadow-sm' 
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <input
              v-model="paymentCurrency"
              type="radio"
              value="USD"
              class="sr-only"
            />
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <!-- Custom Radio Button -->
              <div 
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                :class="paymentCurrency === 'USD' 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-gray-300 bg-white'"
              >
                <div 
                  v-if="paymentCurrency === 'USD'"
                  class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white"
                ></div>
              </div>
              <span class="font-medium text-sm sm:text-base" :class="paymentCurrency === 'USD' ? 'text-primary-900' : 'text-gray-700'">
                USD
              </span>
            </div>
          </label>

          <!-- CDF Option (only for mobile money) -->
          <label v-if="paymentMethod === 'mobile_money'" 
            class="relative flex items-center px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
            :class="paymentCurrency === 'CDF' 
              ? 'border-primary-500 bg-primary-50 shadow-sm' 
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <input
              v-model="paymentCurrency"
              type="radio"
              value="CDF"
              class="sr-only"
            />
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <!-- Custom Radio Button -->
              <div 
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                :class="paymentCurrency === 'CDF' 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-gray-300 bg-white'"
              >
                <div 
                  v-if="paymentCurrency === 'CDF'"
                  class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white"
                ></div>
              </div>
              <span class="font-medium text-sm sm:text-base" :class="paymentCurrency === 'CDF' ? 'text-primary-900' : 'text-gray-700'">
                CDF
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Sélection de l'opérateur Mobile Money -->
      <div v-if="paymentMethod === 'mobile_money'" class="mb-4 sm:mb-6">
        <label for="phoneNumber" class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
        class="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isProcessing">Traitement en cours...</span>
        <span v-else>Payer {{ formatMoney(reservationSummary?.totalPrice) }} {{ reservationSummary?.currency }}</span>
      </button>

      <!-- Bouton désactivé pendant l'attente SMS -->
      <button
        v-else
        disabled
        class="w-full bg-gray-400 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base cursor-not-allowed"
      >
        Paiement en cours...
      </button>
    </div>

    <!-- Section pour tickets gratuits -->
    <div v-else-if="reservationSummary" class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Réservation Gratuite</h2>
      <p class="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Vos tickets sont gratuits. Aucun paiement n'est requis.</p>
      
      <button
        @click="processFreeReservation"
        :disabled="isProcessing"
        class="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isProcessing">Traitement en cours...</span>
        <span v-else>Confirmer la réservation gratuite</span>
      </button>
    </div>

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

    <!-- Message d'erreur, de succès ou d'attente -->
    <div v-if="paymentError" class="mt-6 p-4 rounded-lg" :class="getMessageClass()">
      <div class="text-center">
        <div class="flex items-center justify-center mb-2">
          <svg v-if="paymentError.includes('🎉')" class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="paymentError.includes('📱')" class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold" :class="getTitleClass()">
            {{ getMessageTitle() }}
          </h3>
        </div>
        <p class="text-sm mb-3 whitespace-pre-line" :class="getMessageTextClass()">{{ paymentError }}</p>
        
      
        
        <div v-if="!paymentError.includes('🎉')" class="flex gap-2 justify-center">
          <button
            @click="retryPayment"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            🔄 Réessayer le paiement
          </button>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/api'
import Modal from '~/components/Modal.vue'

// useTickets and useUserPreferences are auto-imported by Nuxt from app/composables
// so no manual import is needed

definePageMeta({
  middleware: ['authenticated'],
})

// Récupération du slug depuis l'URL
const route = useRoute()
const slug = route.params.slug as string

// État local
const phoneNumber = ref('')
const phoneError = ref('')
const paymentError = ref('')
const isProcessing = ref(false)
const countdown = ref(60)
const isWaitingForSMS = ref(false)
const countdownInterval = ref<NodeJS.Timeout | null>(null)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const currentReservationReference = ref<string | null>(null)
const localOrderNumber = ref<string | null>(null)
const toast = useToast()

// Nouveaux refs pour la méthode de paiement
const paymentMethod = ref<'mobile_money' | 'card' | ''>('')
const paymentCurrency = ref<'USD' | 'CDF' | ''>('')

// Utilisation des composables
const { 
  reservationSummary, 
  currentEvent, 
  hasPaidTickets,
  confirmReservation,
  currentReservationId
} = useTickets()
const { 
  phoneNumber: savedPhoneNumber,
  setPhoneNumber
} = useUserPreferences()

// Auth via cookie
const authToken = useCookie('auth_token')

// Computed pour l'événement
const event = computed(() => currentEvent.value)

// Aide: devise par défaut en fonction du panier
const preferCdfForMobile = () => {
  const rs = reservationSummary.value
  if (!rs) return false
  // Si la devise calculée est CDF, ou si le total en USD serait < 1, on privilégie CDF
  const isCdf = (rs.currency || '').toUpperCase() === 'CDF'
  const isUsdUnderMin = (rs.currency || '').toUpperCase() === 'USD' && (rs.totalPrice || 0) < 1
  return isCdf || isUsdUnderMin
}

// Initialiser les valeurs depuis les préférences utilisateur
onMounted(() => {
  if (savedPhoneNumber.value) {
    phoneNumber.value = savedPhoneNumber.value
  }
  
  if (hasPaidTickets.value) {
    // Définir une devise par défaut uniquement s'il n'y a pas encore de choix
    if (!paymentCurrency.value) {
      paymentCurrency.value = preferCdfForMobile() ? 'CDF' : 'USD'
    }
  }
})

// Validation du formulaire
const canProcessPayment = computed(() => {
  if (!hasPaidTickets.value) return false
  
  if (!paymentMethod.value || !paymentCurrency.value) return false
  
  if (paymentMethod.value === 'mobile_money') {
    if (!phoneNumber.value || phoneError.value) return false
  }
  
  return !isProcessing.value && !isWaitingForSMS.value
})

// Démarrer le compteur (décompte de 60 à 0)
const startCountdown = () => {
  countdown.value = 60
  isWaitingForSMS.value = true
  
  // Compteur qui décompte de 60 à 0
  countdownInterval.value = setInterval(() => {
    countdown.value--
    
    // À 0s: considérer comme échec si aucune confirmation reçue
    if (countdown.value <= 0) {
      countdown.value = 0
      stopCountdown()
      const timeoutMsg = 'Paiement échoué: délai de confirmation dépassé. Veuillez réessayer.'
      paymentError.value = timeoutMsg
      try { toast.add({ title: 'Paiement échoué', description: timeoutMsg, color: 'error' }) } catch {}
    }
  }, 1000)
  
  // Démarrer le polling pour vérifier le statut du paiement
  startPaymentStatusPolling()
}

// Démarrer le polling pour vérifier le statut du paiement
// Utilise la nouvelle API /api/client/payments/check qui retourne un statut standardisé
const startPaymentStatusPolling = () => {
  console.log('🔄 Démarrage du polling de vérification du statut de paiement...')

  // L'API retourne maintenant directement 'paid', 'pending', ou 'failed'
  // Plus besoin de fonction intermédiaire - utilisation directe du statut

  // Fonctions helper pour gérer les différents statuts de paiement
  const handlePaymentSuccess = (statusResult: any) => {
    // ✅ Paiement réussi
    paymentError.value = ''
    const successMessage = `🎉 Paiement réussi !\n\n${statusResult.message || 'Vos billets sont maintenant disponibles.'}`
    paymentError.value = successMessage
    try { 
      toast.add({ 
        title: 'Paiement réussi', 
        description: statusResult.message || 'Vos billets sont disponibles.' 
      }) 
    } catch {}
    stopCountdown()
    // Nettoyer l'état de panier/réservation après succès
    try { (useTickets() as any).resetCheckoutState?.() } catch {}
    setTimeout(() => { navigateTo('/tickets/my-tickets') }, 2000)
  }

  const handlePaymentFailure = (statusResult: any) => {
    // ❌ Paiement échoué
    stopCountdown()
    const errMsg = `Paiement échoué: ${statusResult.message || 'Transaction non confirmée.'}`
    paymentError.value = errMsg
    try { 
      toast.add({ 
        title: 'Paiement échoué', 
        description: statusResult.message || 'Veuillez réessayer.', 
        color: 'error' 
      }) 
    } catch {}
  }

  const doCheck = async () => {
    try {
      if (process.dev) console.log('🔍 Vérification du statut de paiement...')

      // Priorité: utiliser la référence si disponible, sinon l'order_number
      // L'API /client/payments/check accepte les deux paramètres
      let statusResult: any = null
      
      if (currentReservationReference.value) {
        // Vérification par référence (priorité)
        statusResult = await checkPaymentStatusByReference(currentReservationReference.value)
        if (process.dev) console.log('📊 Vérification par référence:', statusResult)
      }
      
      // Si pas de résultat par référence, essayer par order_number
      if (!statusResult) {
        const orderNo = localOrderNumber.value || currentOrderNumber?.value
        if (orderNo) {
          statusResult = await checkPaymentStatusByOrderNumber(orderNo)
          if (process.dev) console.log('📊 Vérification par order_number:', statusResult)
        }
      }

      if (statusResult) {
        // Capturer l'orderNumber si le backend le renvoie
        const polledOrderNo = statusResult.orderNumber || statusResult.order_number
        if (polledOrderNo && !localOrderNumber.value) {
          localOrderNumber.value = String(polledOrderNo)
        }

        // ✅ L'API retourne directement le statut standardisé
        const status = String(statusResult?.status || '').toLowerCase()
        
        // Traitement direct avec switch - plus simple et plus clair
        switch (status) {
          case 'paid':
            // Paiement finalisé - rediriger vers succès
            handlePaymentSuccess(statusResult)
            return
            
          case 'failed':
            // Paiement échoué - afficher erreur
            handlePaymentFailure(statusResult)
            return
            
          case 'pending':
            // Paiement en cours - continuer à vérifier
            if (process.dev) console.log('⏳ Paiement en cours, continuation du polling...')
            break
            
          default:
            // Statut inconnu - fallback pour compatibilité avec ancien format
            if (process.dev) console.log('⚠️ Statut inconnu, fallback vers pending...')
            // Traiter comme pending par sécurité
            if (process.dev) console.log('⏳ Paiement en cours (fallback), continuation du polling...')
            break
        }
      } else {
        if (process.dev) console.log('⚠️ Aucun résultat de vérification obtenu')
      }
    } catch (error: any) {
      if (process.dev) console.error('❌ Erreur lors de la vérification du statut:', error)
      // En cas d'erreur, on continue le polling (peut être temporaire)
    }
  }

  // Laisser 3s au backend pour indexer la référence avant le premier check
  setTimeout(() => { doCheck() }, 3000)
  // Puis vérifier le statut toutes les 5 secondes
  pollingInterval.value = setInterval(() => { doCheck() }, 5000)
}

// Vérification via repository de paiement + fallback order_number
const { checkPaymentStatusByReference, checkPaymentStatusByOrderNumber } = usePayments()
const { currentOrderNumber } = useTickets()

// Arrêter le compteur
const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  countdown.value = 60
  isWaitingForSMS.value = false
}

// Validation du numéro de téléphone
const validatePhoneNumber = (phone: string) => {
  if (!phone) {
    phoneError.value = 'Le numéro de téléphone est requis'
    return false
  }
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
    setPhoneNumber(newPhone)
  } else {
    phoneError.value = ''
  }
})

// Écouter les changements de la méthode de paiement
watch(paymentMethod, (newMethod) => {
  // Ne pas écraser le choix de l'utilisateur. Poser une valeur par défaut seulement si vide.
  if (!paymentCurrency.value) {
    if (newMethod === 'card') {
      paymentCurrency.value = 'USD'
    } else if (newMethod === 'mobile_money') {
      paymentCurrency.value = preferCdfForMobile() ? 'CDF' : 'USD'
    }
  }
})

// Recalibrer la devise si le panier change
watch(reservationSummary, () => {
  // Ne définir qu'un défaut si l'utilisateur n'a pas encore choisi
  if (!paymentCurrency.value && paymentMethod.value === 'mobile_money') {
    paymentCurrency.value = preferCdfForMobile() ? 'CDF' : 'USD'
  }
})

// Traitement du paiement pour tickets payants
const processPayment = async () => {
  if (!canProcessPayment.value) return

  if (!authToken.value) {
    paymentError.value = 'Vous devez être connecté pour effectuer une réservation. Veuillez vous connecter.'
    navigateTo('/connexion')
    return
  }

  if (paymentMethod.value === 'mobile_money' && !validatePhoneNumber(phoneNumber.value)) return

  try {
    isProcessing.value = true
    paymentError.value = ''

    // Respecter strictement la devise choisie par l'utilisateur (aucune réécriture ici)

    const paymentData = {
      payment_method: paymentMethod.value as 'mobile_money' | 'card',
      payment_currency: paymentCurrency.value as 'USD' | 'CDF',
      telephone: paymentMethod.value === 'mobile_money' ? phoneNumber.value : undefined
    }

    const result = await confirmReservation(paymentData)

    if (result.success && result.data) {
      const responseData = (result.data as any)?.data || result.data
      
      // Capturer la référence de paiement
      const reference = responseData?.reference || responseData?.payment?.reference
      if (reference) {
        currentReservationReference.value = reference
      }
      
      // Capturer l'orderNumber si disponible
      const orderNumber = responseData?.orderNumber || responseData?.order_number || responseData?.payment?.orderNumber
      if (orderNumber) {
        localOrderNumber.value = String(orderNumber)
      }
      
      if (paymentMethod.value === 'mobile_money') {
        setPhoneNumber(phoneNumber.value)
        startCountdown()
      } else if (paymentMethod.value === 'card') {
        if (responseData?.payment_url) {
          window.open(responseData.payment_url, '_blank')
        }
        navigateTo('/tickets/my-tickets')
      }
    } else {
      paymentError.value = result.error || 'Erreur lors de la réservation'
    }
  } catch (error: any) {
    paymentError.value = error?.message || 'Erreur inattendue lors du paiement.'
  } finally {
    isProcessing.value = false
  }
}

// Traitement de la réservation gratuite
const processFreeReservation = async () => {
  try {
    isProcessing.value = true
    paymentError.value = ''

    const result = await confirmReservation()

    if (result.success && result.data) {
      navigateTo('/tickets/my-tickets')
    } else {
      paymentError.value = result.error || 'Erreur lors de la réservation gratuite'
    }
  } catch (error: any) {
    paymentError.value = error?.message || 'Erreur inattendue lors de la réservation gratuite.'
  } finally {
    isProcessing.value = false
  }
}

// Fonction pour réessayer le paiement
const retryPayment = () => {
  paymentError.value = ''
  if (hasPaidTickets.value) {
    processPayment()
  } else {
    processFreeReservation()
  }
}

// Fonctions utilitaires pour les messages
const getMessageClass = () => {
  if (paymentError.value.includes('🎉')) {
    return 'bg-green-50 border border-green-200'
  } else if (paymentError.value.includes('📱')) {
    return 'bg-blue-50 border border-blue-200'
  } else {
    return 'bg-red-50 border border-red-200'
  }
}

const getTitleClass = () => {
  if (paymentError.value.includes('🎉')) {
    return 'text-green-900'
  } else if (paymentError.value.includes('📱')) {
    return 'text-blue-900'
  } else {
    return 'text-red-900'
  }
}

const getMessageTitle = () => {
  if (paymentError.value.includes('🎉')) {
    return 'Paiement réussi !'
  } else if (paymentError.value.includes('📱')) {
    return 'En attente de confirmation'
  } else {
    return 'Erreur lors du paiement'
  }
}

const getMessageTextClass = () => {
  if (paymentError.value.includes('🎉')) {
    return 'text-green-700'
  } else if (paymentError.value.includes('📱')) {
    return 'text-blue-700'
  } else {
    return 'text-red-700'
  }
}

// Import des fonctions utilitaires
import { formatMoney, formatDate } from '~/utils'

// Vérification que l'utilisateur a des tickets sélectionnés
onMounted(() => {
  if (!reservationSummary.value) {
    navigateTo('/evenements')
  }
})

// Nettoyer le compteur lors de la destruction du composant
onUnmounted(() => {
  stopCountdown()
})
</script>