<template>
  <div class="min-h-screen py-12 ">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br py-16 from-purple-600 to-purple-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-6">
            Biso Ticket App
          </h1>
          <p class="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            L'application mobile officielle pour gérer vos événements et acheter vos billets en toute simplicité
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              disabled
              class="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-500 font-semibold rounded-full cursor-not-allowed opacity-75"
            >
              <Icon name="lucide:clock" class="w-5 h-5 mr-2" />
              Bientôt sur iOS
            </button>
            <button 
              disabled
              class="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-500 font-semibold rounded-full cursor-not-allowed opacity-75"
            >
              <Icon name="lucide:clock" class="w-5 h-5 mr-2" />
              Bientôt sur Android
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Coming Soon Section -->
    <div class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Application bientôt disponible
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            Nous travaillons activement sur le développement de l'application mobile Biso Ticket
          </p>
          
          <!-- Features Preview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:smartphone" class="w-8 h-8 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Interface intuitive</h3>
              <p class="text-gray-600">Design moderne et navigation fluide</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:zap" class="w-8 h-8 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Performance optimisée</h3>
              <p class="text-gray-600">Chargement rapide et expérience fluide</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="lucide:shield-check" class="w-8 h-8 text-green-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sécurité renforcée</h3>
              <p class="text-gray-600">Protection des données et transactions</p>
            </div>
          </div>
          
          <!-- Notify Me Button -->
          <div class="bg-gray-50 rounded-xl p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Soyez informé du lancement
            </h3>
            <p class="text-gray-600 mb-6">
              Recevez une notification dès que l'application sera disponible
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button 
                class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Notifier
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO pour la page app
import { useSEO } from '~/composables/useSEO'

const { setSEO } = useSEO()
setSEO({
  title: 'Biso Ticket App - Application Mobile',
  description: 'Téléchargez l\'application mobile Biso Ticket pour gérer vos événements et acheter vos billets. Paiements mobiles, QR codes, mode hors ligne et plus encore.',
  keywords: ['app mobile', 'application', 'iOS', 'Android', 'télécharger', 'mobile money', 'QR code', 'hors ligne', 'Biso Ticket'],
  type: 'website'
})
</script>
