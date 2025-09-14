<template>
  <section class="py-16 md:py-24 ">
    <div class="container mx-auto px-4 md:px-8 lg:px-16">
      <!-- Header -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="text-center mb-16"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pourquoi choisir Biso Ticket ?
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Une plateforme complète pour gérer tous vos événements avec simplicité et efficacité
        </p>
      </div>

      <!-- Features Grid -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        <!-- Feature 1 -->
        <div class="group p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Icon name="lucide:ticket" class="w-6 h-6 text-purple-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Billetterie en ligne</h3>
          <p class="text-gray-600 mb-4">
            Vendez vos billets facilement avec notre système de billetterie intégré. Gestion des stocks, prix dynamiques et paiements sécurisés.
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Paiements Mobile Money
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              QR Codes automatiques
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Gestion des stocks
            </li>
          </ul>
        </div>

        <!-- Feature 2 -->
        <div class="group p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Icon name="lucide:mail" class="w-6 h-6 text-purple-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Invitations digitales</h3>
          <p class="text-gray-600 mb-4">
            Créez des invitations personnalisées et élégantes. Envoyez-les par email ou SMS avec un design professionnel.
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Templates personnalisables
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Envoi automatique
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Suivi des confirmations
            </li>
          </ul>
        </div>

        <!-- Feature 3 -->
        <div class="group p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Icon name="lucide:smartphone" class="w-6 h-6 text-purple-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Application mobile</h3>
          <p class="text-gray-600 mb-4">
            Contrôlez l'accès à vos événements avec notre application mobile offline. Scan des QR codes même sans internet.
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Fonctionnement offline
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Scan rapide des QR codes
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:check" class="w-4 h-4 text-green-500" />
              Synchronisation automatique
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Métadonnées de la section
useHead({
  title: 'Fonctionnalités - Biso Ticket',
  meta: [
    { name: 'description', content: 'Découvrez toutes les fonctionnalités de Biso Ticket : billetterie en ligne, invitations digitales, application mobile, analytics et plus encore.' }
  ]
})
</script>
