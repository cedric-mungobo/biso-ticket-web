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

    <!-- Section de paiement (conditionnelle selon le type de ticket) -->
    <div v-if="hasPaidTickets" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Méthode de Paiement</h2>
      
      <!-- Sélection de la méthode -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Choisissez votre méthode de paiement
        </label>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input
              v-model="paymentMethod"
              type="radio"
              value="mobile_money"
              class="mr-2"
            />
            Mobile Money
          </label>
          <label class="flex items-center">
            <input
              v-model="paymentMethod"
              type="radio"
              value="card"
              class="mr-2"
            />
            Carte bancaire
          </label>
        </div>
      </div>

      <!-- Sélection de la devise -->
      <div v-if="paymentMethod" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Devise de paiement
        </label>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input
              v-model="paymentCurrency"
              type="radio"
              value="USD"
              class="mr-2"
            />
            USD
          </label>
          <label v-if="paymentMethod === 'mobile_money'" class="flex items-center">
            <input
              v-model="paymentCurrency"
              type="radio"
              value="CDF"
              class="mr-2"
            />
            CDF
          </label>
        </div>
      </div>

      <!-- Sélection de l'opérateur Mobile Money -->
      <div v-if="paymentMethod === 'mobile_money'" class="mb-6">
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
    </div>

    <!-- Section pour tickets gratuits -->
    <div v-else-if="reservationSummary" class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Réservation Gratuite</h2>
      <p class="text-gray-600 mb-4">Vos tickets sont gratuits. Aucun paiement n'est requis.</p>
      
      <button
        @click="processFreeReservation"
        :disabled="isProcessing"
        class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        
        <!-- Détails techniques pour le débogage -->
        <details class="text-left bg-red-100 p-3 rounded border border-red-300 mb-3">
          <summary class="cursor-pointer text-red-800 font-medium text-sm">
            🔍 Voir les détails techniques
          </summary>
          <div class="mt-2 text-xs text-red-700 font-mono bg-red-50 p-2 rounded border">
            <p><strong>URL API:</strong> /tickets/simple/reserve</p>
            <p><strong>Méthode:</strong> POST</p>
            <p><strong>Timestamp:</strong> {{ new Date().toISOString() }}</p>
            <p><strong>Erreur:</strong> {{ paymentError }}</p>
          </div>
        </details>
        
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
import { useCustomFetch } from '~/composables/useCustomFetch'
import Modal from '~/components/Modal.vue'

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
const { isAuthenticated, user, token } = useAuth()

// Computed pour l'événement
const event = computed(() => currentEvent.value)

// Initialiser les valeurs depuis les préférences utilisateur
onMounted(() => {
  if (savedPhoneNumber.value) {
    phoneNumber.value = savedPhoneNumber.value
  }
  
  // Initialiser la devise par défaut
  if (hasPaidTickets.value) {
    paymentCurrency.value = 'USD'
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
    
    // Arrêter le compteur quand il atteint 0
    if (countdown.value <= 0) {
      stopCountdown()
      paymentError.value = 'Temps d\'attente écoulé. Veuillez réessayer votre paiement.'
    }
  }, 1000)
  
  // Démarrer le polling pour vérifier le statut du paiement
  startPaymentStatusPolling()
}

// Démarrer le polling pour vérifier le statut du paiement
const startPaymentStatusPolling = () => {
  console.log('🔄 Démarrage du polling de vérification du statut de paiement...')
  
  // Vérifier le statut toutes les 5 secondes
  pollingInterval.value = setInterval(async () => {
    try {
      console.log('🔍 Vérification du statut de paiement...')
      
      // Utiliser la référence de réservation pour vérifier le statut
      const statusResult = await checkPaymentStatusByReference()
      
      if (statusResult) {
        console.log('📊 Résultat de la vérification:', statusResult)
        
        // Vérifier le statut selon la logique de l'API
        if ('status' in statusResult) {
          const status = statusResult.status
          console.log('📊 Statut du paiement:', status)
          
          if (status === 'success' || status === 'completed') {
            // ✅ Paiement réussi
            console.log('✅ Paiement réussi !')
            console.log('📝 Détails:', {
              reference: statusResult.reference,
              status: statusResult.status,
              method: statusResult.method,
              amount: statusResult.amount,
              currency: statusResult.currency,
              participant: statusResult.participant_name,
              message: statusResult.message,
              action: statusResult.action,
              push_notification: statusResult.push_notification,
              last_flexpay_check: statusResult.last_flexpay_check,
              status_updated: statusResult.status_updated
            })
            
            // Afficher un message de succès
            paymentError.value = '' // Effacer les erreurs
            
            // Afficher un message de succès temporaire
            const successMessage = `🎉 Paiement réussi !\n\n${statusResult.message}\n\n${statusResult.action}\n\nRedirection dans 2 secondes...`
            paymentError.value = successMessage
            
            // Arrêter le polling et rediriger
            stopCountdown()
            
            // Afficher un message de succès avant la redirection
            setTimeout(() => {
              navigateTo('/tickets/my-tickets')
            }, 2000)
            
            return
            
          } else if (status === 'pending') {
            // ⏳ Paiement en cours de traitement
            console.log('⏳ Paiement en cours de traitement...')
            console.log('📝 Message:', statusResult.message)
            console.log('💡 Action:', statusResult.action)
            console.log('🔔 Push notification:', statusResult.push_notification)
            console.log('📊 Status updated:', statusResult.status_updated)
            console.log('⏰ Dernière vérification FlexPay:', statusResult.last_flexpay_check)
            
            // Afficher un message d'attente avec push notification si applicable
            if (statusResult.push_notification) {
              const pendingMessage = `📱 ${statusResult.message}\n\n${statusResult.action}\n\n⏳ En attente de confirmation sur votre téléphone...`
              paymentError.value = pendingMessage
            }
            
            // Continuer le polling
            // Pas besoin d'arrêter, c'est normal
            
          } else if (status === 'failed') {
            // ❌ Paiement échoué
            console.log('❌ Paiement échoué')
            console.log('📝 Message d\'erreur:', statusResult.message)
            console.log('💡 Action suggérée:', statusResult.action)
            console.log('🔔 Push notification:', statusResult.push_notification)
            
            // Arrêter le polling et afficher l'erreur
            stopCountdown()
            paymentError.value = `Paiement échoué: ${statusResult.message}\n\nAction: ${statusResult.action}`
            return
            
          } else {
            // 🔍 Statut inconnu
            console.log('❓ Statut inconnu:', status)
            console.log('📝 Message:', statusResult.message)
            console.log('🔔 Push notification:', statusResult.push_notification)
            
            // Continuer le polling pour voir l'évolution
          }
          
        } else {
          // Erreur de type PaymentStatusError
          console.log('❌ Erreur de vérification:', statusResult.message)
          if ('error' in statusResult) {
            console.log('📝 Code d\'erreur:', statusResult.error)
          }
          
          // Arrêter le polling et afficher l'erreur
          stopCountdown()
          paymentError.value = `Erreur de vérification: ${statusResult.message}`
          return
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la vérification du statut:', error)
      
      // Afficher clairement l'erreur
      if (error.message) {
        console.log('📝 Message d\'erreur du backend:', error.message)
        
        // Si c'est une erreur 404 (paiement non trouvé), continuer le polling
        if (error.message.includes('404') || error.message.includes('non trouvé')) {
          console.log('⏳ Paiement pas encore traité, continuation du polling...')
        } else {
          // Autre erreur, afficher et arrêter
          console.log('🚨 Erreur critique, arrêt du polling')
          stopCountdown()
          paymentError.value = `Erreur de vérification: ${error.message}`
          return
        }
      }
      
      // Continuer le polling même en cas d'erreur non critique
    }
  }, 5000) // Vérifier toutes les 5 secondes
}

// Fonction pour vérifier le statut du paiement par référence
const checkPaymentStatusByReference = async () => {
  try {
    // Utiliser la référence de réservation depuis le résultat de l'API
    // La référence est dans data.data.reference selon votre message
    const reference = currentReservationReference.value
    
    if (!reference) {
      console.log('⚠️ Aucune référence de réservation disponible')
      return null
    }
    
    console.log('🔍 Vérification du statut pour la référence:', reference)
    
    // Utiliser customFetch pour vérifier le statut
    const { get } = useCustomFetch()
    const response = await get<any>(`/tickets/payments/check?reference=${reference}`)
    
    return response
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut:', error)
    return null
  }
}

// Arrêter le compteur
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

// Écouter les changements de la méthode de paiement
watch(paymentMethod, (newMethod) => {
  if (newMethod === 'card') {
    // Forcer USD pour les cartes
    paymentCurrency.value = 'USD'
  }
})

// Traitement du paiement pour tickets payants
const processPayment = async () => {
  if (!canProcessPayment.value) return

  // Vérifier l'authentification
  if (!isAuthenticated.value || !token.value) {
    paymentError.value = 'Vous devez être connecté pour effectuer une réservation. Veuillez vous connecter.'
    navigateTo('/connexion')
    return
  }

  // Validation finale
  if (paymentMethod.value === 'mobile_money' && !validatePhoneNumber(phoneNumber.value)) return

  try {
    isProcessing.value = true
    paymentError.value = ''

    // Préparer les données de paiement
    const paymentData = {
      payment_method: paymentMethod.value as 'mobile_money' | 'card',
      payment_currency: paymentCurrency.value as 'USD' | 'CDF',
      telephone: paymentMethod.value === 'mobile_money' ? phoneNumber.value : undefined
    }

    console.log('Traitement du paiement:', paymentData)

    // Utiliser le composable useTickets avec la nouvelle API
    const result = await confirmReservation(paymentData)

    if (result.success && result.data) {
      console.log('✅ Réservation réussie:', result.data)
      
      // Stocker la référence de réservation pour le polling
      // La référence est dans data.data.reference selon votre message
      const reference = (result.data as any)?.data?.reference || (result.data as any)?.reference
      if (reference) {
        currentReservationReference.value = reference
        console.log('📝 Référence de réservation stockée:', currentReservationReference.value)
      }
      
      // Sauvegarder les préférences utilisateur
      if (paymentMethod.value === 'mobile_money') {
        setPhoneNumber(phoneNumber.value)
        
        // Démarrer le countdown pour mobile money
        startCountdown()
      } else if (paymentMethod.value === 'card') {
        // Redirection vers l'URL de paiement par carte
        if (result.data.data?.payment_url) {
          window.open(result.data.data.payment_url, '_blank')
        }
        // Redirection vers mes billets
        navigateTo('/tickets/my-tickets')
      }
    } else {
      paymentError.value = result.error || 'Erreur lors de la réservation'
    }
  } catch (error: any) {
    console.error('❌ Erreur lors du traitement du paiement:', error)
    
    // Gestion détaillée des erreurs
    if (error.message) {
      // Erreur avec message spécifique
      if (error.message.includes('404')) {
        paymentError.value = 'Erreur 404: Endpoint API non trouvé. Veuillez contacter le support.'
      } else if (error.message.includes('500')) {
        paymentError.value = 'Erreur 500: Problème serveur. Veuillez réessayer plus tard.'
      } else if (error.message.includes('422')) {
        paymentError.value = 'Erreur 422: Données invalides. Veuillez vérifier vos informations.'
      } else if (error.message.includes('401')) {
        paymentError.value = 'Erreur 401: Session expirée. Veuillez vous reconnecter.'
        navigateTo('/connexion')
        return
      } else if (error.message.includes('Validation échouée')) {
        paymentError.value = `Erreur de validation: ${error.message}`
      } else {
        // Afficher le message d'erreur technique
        paymentError.value = `Erreur technique: ${error.message}`
      }
    } else if (error.status) {
      // Erreur HTTP avec statut
      paymentError.value = `Erreur HTTP ${error.status}: ${error.statusText || 'Erreur inconnue'}`
    } else {
      // Erreur générique
      paymentError.value = 'Erreur inattendue lors du traitement du paiement. Veuillez réessayer.'
    }
  } finally {
    isProcessing.value = false
  }
}

// Traitement de la réservation gratuite
const processFreeReservation = async () => {
  try {
    isProcessing.value = true
    paymentError.value = ''

    console.log('Traitement de la réservation gratuite')

    // Utiliser le composable useTickets avec la nouvelle API (sans données de paiement)
    const result = await confirmReservation({
      payment_method: 'mobile_money', // Valeur par défaut pour tickets gratuits
      payment_currency: 'USD' // Valeur par défaut pour tickets gratuits
    })

    if (result.success && result.data) {
      console.log('✅ Réservation gratuite réussie:', result.data)
      
      // Redirection immédiate pour tickets gratuits
      navigateTo('/tickets/my-tickets')
    } else {
      paymentError.value = result.error || 'Erreur lors de la réservation gratuite'
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de la réservation gratuite:', error)
    
    // Gestion détaillée des erreurs
    if (error.message) {
      if (error.message.includes('404')) {
        paymentError.value = 'Erreur 404: Endpoint API non trouvé. Veuillez contacter le support.'
      } else if (error.message.includes('500')) {
        paymentError.value = 'Erreur 500: Problème serveur. Veuillez réessayer plus tard.'
      } else if (error.message.includes('422')) {
        paymentError.value = 'Erreur 422: Données invalides. Veuillez vérifier vos informations.'
      } else if (error.message.includes('401')) {
        paymentError.value = 'Erreur 401: Session expirée. Veuillez vous reconnecter.'
        navigateTo('/connexion')
        return
      } else if (error.message.includes('Validation échouée')) {
        paymentError.value = `Erreur de validation: ${error.message}`
      } else {
        paymentError.value = `Erreur technique: ${error.message}`
      }
    } else if (error.status) {
      paymentError.value = `Erreur HTTP ${error.status}: ${error.statusText || 'Erreur inconnue'}`
    } else {
      paymentError.value = 'Erreur inattendue lors de la réservation gratuite. Veuillez réessayer.'
    }
  } finally {
    isProcessing.value = false
  }
}

// Fonction pour réessayer le paiement
const retryPayment = () => {
  // Effacer l'erreur précédente
  paymentError.value = ''
  
  // Relancer le processus de paiement
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