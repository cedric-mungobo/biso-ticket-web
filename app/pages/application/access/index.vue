<template>
  <div class="min-h-screen  py-12">
    <div class="bg-gradient-to-br py-16 from-purple-600 to-purple-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-6">
            Biso Ticket Access App
          </h1>
          <p class="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            L'application mobile de contrôle d'accès pour valider les billets et gérer l'entrée aux événements
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              disabled
              class="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-500 font-semibold rounded-full cursor-not-allowed opacity-75"
            >
              <Icon name="lucide:clock" class="w-5 h-5 mr-2" />
              Bientôt sur iOS
            </button>
            <a 
              href="/assets/app/Biso-Ticket-Acces.apk" 
              download="Biso-Ticket-Access.apk"
              class="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              <Icon name="lucide:download" class="w-5 h-5 mr-2" />
              Télécharger Android APK
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- App Info Section -->
    <div class=" border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Application Android disponible
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            Téléchargez l'APK et commencez à scanner les tickets dès maintenant
          </p>
        </div>

        <!-- App Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <Icon name="lucide:smartphone" class="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Version</h3>
            <p class="text-gray-600">1.0.0+1</p>
          </div>
          
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <Icon name="lucide:hard-drive" class="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Taille</h3>
            <p class="text-gray-600">31.1 MB</p>
          </div>
          
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <Icon name="lucide:shield-check" class="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Android</h3>
            <p class="text-gray-600">5.0+</p>
          </div>
          
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <Icon name="lucide:globe" class="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Langue</h3>
            <p class="text-gray-600">Français</p>
          </div>
        </div>

        <!-- Features Preview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:scan" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Scanner QR Code</h3>
            <p class="text-gray-600">Scan instantané des tickets avec validation en temps réel</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:offline" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Mode Hors Ligne</h3>
            <p class="text-gray-600">Fonctionne même sans connexion internet</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:bar-chart" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Statistiques</h3>
            <p class="text-gray-600">Suivi en temps réel des scans et validations</p>
          </div>
        </div>

        <!-- Download Button -->
        <div class="text-center">
          <a 
            href="/assets/app/Biso-Ticket-Acces.apk" 
            download="Biso-Ticket-Access.apk"
            class="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-lg"
          >
            <Icon name="lucide:download" class="w-6 h-6 mr-3" />
            Télécharger l'APK (31.1 MB)
          </a>
          <p class="text-sm text-gray-500 mt-4">
            Compatible Android 5.0+ • Installation depuis sources inconnues requise
          </p>
          
        </div>
      </div>
    </div>

    <!-- User Guide Section -->
    <div class=" border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            📱 Guide Utilisateur
          </h2>
          <p class="text-xl text-gray-600">
            Apprenez à utiliser Biso Ticket Access en quelques étapes
          </p>
        </div>

        <!-- Installation Steps -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-gray-900 mb-8 text-center">🚀 Installation et Configuration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Télécharger l'APK</h4>
              <p class="text-gray-600 mb-4">Téléchargez le fichier APK depuis cette page</p>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Autoriser l'installation depuis sources inconnues</li>
                <li>• Installer l'application</li>
                <li>• Lancer l'app</li>
              </ul>
            </div>

            <!-- Step 2 -->
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Configuration</h4>
              <p class="text-gray-600 mb-4">Configurez l'application avec vos informations</p>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Event ID : Identifiant de l'événement</li>
                <li>• Scan Secret : Clé fournie par l'organisateur</li>
                <li>• Appuyer sur "Configurer"</li>
              </ul>
            </div>

            <!-- Step 3 -->
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Scanner</h4>
              <p class="text-gray-600 mb-4">Commencez à scanner les tickets</p>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Appuyer sur "SCANNER UN TICKET"</li>
                <li>• Placer le QR code dans le cadre</li>
                <li>• Vérifier le résultat</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Scan Results -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-gray-900 mb-8 text-center"> Types de réponses</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Success -->
            <div class="bg-green-50 border border-green-200 p-6 rounded-xl">
              <div class="flex items-center mb-3">
                <Icon name="lucide:check-circle" class="w-6 h-6 text-green-600 mr-2" />
                <h4 class="text-lg font-semibold text-green-800">Scan Réussi</h4>
              </div>
              <p class="text-green-700 text-sm mb-2">✅ Scan accepté</p>
              <p class="text-green-600 text-xs">Le ticket est valide et accepté. Le visiteur peut entrer.</p>
            </div>

            <!-- Warning -->
            <div class="bg-orange-50 border border-orange-200 p-6 rounded-xl">
              <div class="flex items-center mb-3">
                <Icon name="lucide:alert-triangle" class="w-6 h-6 text-orange-600 mr-2" />
                <h4 class="text-lg font-semibold text-orange-800">Avertissement</h4>
              </div>
              <p class="text-orange-700 text-sm mb-2">⚠️ Ticket déjà scanné</p>
              <p class="text-orange-600 text-xs">Le ticket a déjà été utilisé. Vérifiez l'identité du visiteur.</p>
            </div>

            <!-- Error -->
            <div class="bg-red-50 border border-red-200 p-6 rounded-xl">
              <div class="flex items-center mb-3">
                <Icon name="lucide:x-circle" class="w-6 h-6 text-red-600 mr-2" />
                <h4 class="text-lg font-semibold text-red-800">Erreur</h4>
              </div>
              <p class="text-red-700 text-sm mb-2">❌ Ticket invalide</p>
              <p class="text-red-600 text-xs">Le ticket n'est pas valide ou problème technique.</p>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-gray-900 mb-8 text-center"> Fonctionnalités</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center mb-4">
                <Icon name="lucide:offline" class="w-8 h-8 text-blue-600 mr-3" />
                <h4 class="text-lg font-semibold text-gray-900">Mode Hors Ligne</h4>
              </div>
              <p class="text-gray-600 text-sm">Les scans sont stockés localement et synchronisés automatiquement dès le retour de la connexion.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center mb-4">
                <Icon name="lucide:bar-chart" class="w-8 h-8 text-green-600 mr-3" />
                <h4 class="text-lg font-semibold text-gray-900">Statistiques</h4>
              </div>
              <p class="text-gray-600 text-sm">Suivi en temps réel des scans, tickets synchronisés et scans en attente.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center mb-4">
                <Icon name="lucide:flashlight" class="w-8 h-8 text-yellow-600 mr-3" />
                <h4 class="text-lg font-semibold text-gray-900">Torche</h4>
              </div>
              <p class="text-gray-600 text-sm">Activez la torche pour scanner dans des conditions de faible éclairage.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="flex items-center mb-4">
                <Icon name="lucide:shield-check" class="w-8 h-8 text-purple-600 mr-3" />
                <h4 class="text-lg font-semibold text-gray-900">Sécurité</h4>
              </div>
              <p class="text-gray-600 text-sm">Détection automatique des billets dupliqués, expirés ou déjà utilisés.</p>
            </div>
          </div>
        </div>

        <!-- Troubleshooting -->
        <div class=" p-8 rounded-xl shadow-lg">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center"> Dépannage</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">❌ "Application non configurée"</h4>
              <p class="text-gray-600 text-sm">Appuyez sur l'icône ⚙️ et configurez l'application</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">❌ "Secret expiré ou invalide"</h4>
              <p class="text-gray-600 text-sm">Contactez l'organisateur pour obtenir un nouveau secret</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">❌ "Aucun ticket synchronisé"</h4>
              <p class="text-gray-600 text-sm">Vérifiez la connexion internet et resynchronisez</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">❌ "Erreur de scan"</h4>
              <p class="text-gray-600 text-sm">Vérifiez que le QR code est visible et la connexion internet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <!-- Download Section -->
    <div class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p class="text-xl text-gray-300 mb-8">
            Téléchargez Biso Ticket Access et gérez l'entrée à vos événements
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/assets/app/Biso-Ticket-Acces.apk" 
              download="Biso-Ticket-Access.apk"
              class="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <Icon name="lucide:download" class="w-6 h-6 mr-3" />
              Télécharger l'APK
            </a>
            <NuxtLink 
              to="/contact" 
              class="inline-flex items-center px-8 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
            >
              <Icon name="lucide:help-circle" class="w-6 h-6 mr-3" />
              Besoin d'aide ?
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO pour la page access
import { useSEO } from '~/composables/useSEO'

const { setSEO } = useSEO()
setSEO({
  title: 'Biso Ticket Access App - Contrôle d\'accès',
  description: 'Application de contrôle d\'accès pour valider les billets et gérer l\'entrée aux événements. Scanner QR code, validation instantanée, mode hors ligne.',
  keywords: ['contrôle accès', 'validation billets', 'QR code', 'scanner', 'hors ligne', 'événement', 'sécurité', 'Biso Ticket Access'],
  type: 'website'
})
</script>
