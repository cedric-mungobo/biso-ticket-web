<template>

<div class="container mx-auto px-1 sm:px-0 lg:px-8">
    <div class="space-y-6">
      <!-- Ligne 1 : Card 1 et Card 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Billeterie en ligne -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white min-h-[500px] flex flex-col">
          <div class="flex-1">
            <p class="text-sm font-medium opacity-90 mb-2">Service Premium</p>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Billeterie en ligne
            </h2>
            <p class="text-lg opacity-90 leading-relaxed">
             Biso Ticket une plateforme ultra-sécurisée qui vous permet de faire de la vente de billets en ligne avec paiement mobile money, cartes bancaires et transfert d'argent. Gestion des stocks en temps réel, réservations instantanées et notifications automatiques pour vos participants.
            </p>
          </div>
          
          <!-- Image en bas -->
          <div class="mt-6 flex-1 relative">
            <img 
              src="/assets/images/ticket.jpg" 
              alt="Billeterie en ligne" 
              class="w-full aspect-video h-full object-cover rounded-xl"
            />
          </div>
          
          <!-- Icône de sécurité -->
          <div class="absolute top-8 right-8 z-20">
            <div class="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div class="absolute bottom-8 left-8 z-20">
            <button class="border border-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium hover:bg-white/10 transition-colors">
              Découvrir
            </button>
          </div>
        </div>

        <!-- Bracelets personnalisés et billets papier -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white min-h-[500px] flex flex-col">
          <div class="flex-1">
            <p class="text-sm font-medium opacity-90 mb-2">Solutions Physiques</p>
            <h2 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Bracelets & Billets Papier
            </h2>
            <div class="space-y-4">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 class="font-semibold text-lg mb-2">Bracelets d'accès</h3>
                <p class="text-sm opacity-90">
                  Personnalisés et élégants avec QR code intégré, design personnalisable aux couleurs de votre événement. Parfaits pour festivals, concerts et événements d'entreprise.
                </p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 class="font-semibold text-lg mb-2">Billets papier</h3>
                <p class="text-sm opacity-90">
                  De haute qualité avec design personnalisé, hologrammes de sécurité et QR codes uniques. Impression sur différents supports pour tous types d'événements.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Image en bas -->
          <div class="mt-6 flex-1 relative">
            <img 
              src="/assets/images/bracelet.jpeg" 
              alt="Bracelets et billets" 
              class="w-full aspect-video h-full object-cover rounded-xl"
            />
          </div>
          
          <!-- Icônes des services -->
          <div class="absolute top-8 right-8 z-20 flex space-x-2">
            <div class="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div class="absolute bottom-8 left-8 z-20">
            <button class="border border-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium hover:bg-white/10 transition-colors">
              Commander
            </button>
          </div>
        </div>
      </div>

      <!-- Ligne 2 : CTA Section -->
      <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 md:p-12">
        <div class="max-w-2xl">
          <h3 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Prêt à<br>organiser votre<br>
            <span class="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              événement ?
            </span>
          </h3>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            Rejoignez des milliers d'organisateurs qui font confiance à Biso Ticket pour leurs événements.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="bg-white text-orange-600 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors">
              Commencer maintenant
            </button>
            <button class="border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white/10 transition-colors">
              Voir la démo
            </button>
          </div>
        </div>
      </div>

      <!-- Ligne 3 : Invitation électronique -->
      <div class="bg-gradient-to-r rounded-2xl from-green-900 to-green-950">
        <section class="">
          <!-- Layout principal -->
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[600px]">
            <!-- Image/Video -->
            <div class="lg:w-1/2 rounded-xl overflow-hidden">
              <video 
                class="w-full h-full object-cover rounded-xl"
                autoplay 
                muted 
                loop 
                playsinline
              >
                <source src="/assets/videos/invitation-demo.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>

            <!-- Contenu texte -->
            <div class="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
              <!-- Titre de la section -->
              <div class="max-w-3xl mb-4 lg:mb-6">
                <h2 class="text-white font-semibold text-2xl md:text-4xl md:leading-tight">
                  Invitations électroniques
                </h2>
                <p class="mt-1 text-secondary-200">
                  Invitations 2.0 digitales élégantes et personnalisées pour vos événements privés,Mariage, soirées d'entreprise et célébrations.
                </p>
              </div>

              <!-- Timeline des étapes -->
              <div class="mb-4">
                <h3 class="text-secondary-200 text-xs font-medium uppercase">
                  Fonctionnalités
                </h3>
              </div>

              <!-- Étapes de la timeline -->
              <div class="space-y-4">
                <div class="flex gap-x-5 ms-1">
                  <!-- Icône avec ligne de connexion -->
                  <div class="relative">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                        1
                      </span>
                    </div>
                  </div>
                  <!-- Contenu de l'étape -->
                  <div class="grow pt-0.5">
                    <p class="text-sm lg:text-base text-neutral-400">
                      <span class="text-white">Templates modernes:</span>
                      Design élégant et personnalisable aux couleurs de votre événement
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <!-- Icône avec ligne de connexion -->
                  <div class="relative">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                        2
                      </span>
                    </div>
                  </div>
                  <!-- Contenu de l'étape -->
                  <div class="grow pt-0.5">
                    <p class="text-sm lg:text-base text-neutral-400">
                      <span class="text-white">Animations interactives:</span>
                      Expérience utilisateur engageante et moderne
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <!-- Icône avec ligne de connexion -->
                  <div class="relative">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                        3
                      </span>
                    </div>
                  </div>
                  <!-- Contenu de l'étape -->
                  <div class="grow pt-0.5">
                    <p class="text-sm lg:text-base text-neutral-400">
                      <span class="text-white">RSVP intégré:</span>
                      Gestion des confirmations et partage sur réseaux sociaux
                    </p>
                  </div>
                </div>
              </div>

              <!-- Bouton d'action -->
              <div class="mt-8">
                <button class="group inline-flex items-center gap-x-2 py-2 px-3 bg-secondary-200 font-medium text-sm text-neutral-800 rounded-full focus:outline-hidden hover:bg-secondary-300 transition-colors">
                  <svg 
                    class="shrink-0 size-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    <path class="opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:delay-100 transition" d="M14.05 2a9 9 0 0 1 8 7.94"></path>
                    <path class="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition" d="M14.05 6A5 5 0 0 1 18 10"></path>
                  </svg>
                  Créer une invitation
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Service {
  id: string
  badge: {
    text: string
    color: string
    bgColor: string
    borderColor: string
  }
  title: string
  description: string
  icon: string
  gradient: {
    from: string
    to: string
  }
  iconColor: string
  tag: string
  cta: string
}


const sliderPosition = ref(75)
const isDragging = ref(false)

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const slider = (event.target as HTMLElement).parentElement
  if (!slider) return
  
  const rect = slider.getBoundingClientRect()
  const newPosition = ((event.clientX - rect.left) / rect.width) * 100
  sliderPosition.value = Math.max(0, Math.min(100, newPosition))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Valeurs clés de Biso Ticket
const coreValues = ['Sécurité', 'Rapidité', 'Efficacité', 'Simplicité']

// Liste des services
const services: Service[] = [
  {
    id: 'online-ticketing',
    badge: {
      text: 'Billeterie',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    title: 'Billeterie en ligne',
    description: 'Plateforme de vente de billets en ligne ultra-sécurisée avec paiement mobile money, cartes bancaires et transfert d\'argent. Gestion des stocks en temps réel, réservations instantanées et notifications automatiques pour vos participants.',
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    gradient: { from: 'from-blue-100', to: 'to-blue-200' },
    iconColor: 'text-blue-600',
    tag: 'Vente en ligne',
    cta: 'Commencer'
  },
  {
    id: 'wristband-tickets',
    badge: {
      text: 'Bracelet',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    title: 'Billet bracelet',
    description: 'Bracelets d\'accès personnalisés et élégants avec QR code intégré, design personnalisable aux couleurs de votre événement. Parfaits pour festivals, concerts et événements d\'entreprise. Suivi des entrées en temps réel et statistiques détaillées.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: { from: 'from-green-100', to: 'to-green-200' },
    iconColor: 'text-green-600',
    tag: 'Accès sécurisé',
    cta: 'Commander'
  },
  {
    id: 'paper-tickets',
    badge: {
      text: 'Papier',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    title: 'Billet papier',
    description: 'Billets papier imprimés de haute qualité avec design personnalisé, hologrammes de sécurité et QR codes uniques. Impression sur différents supports (papier couché, carton, etc.) pour tous types d\'événements traditionnels et professionnels.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    gradient: { from: 'from-orange-100', to: 'to-orange-200' },
    iconColor: 'text-orange-600',
    tag: 'Impression HD',
    cta: 'Imprimer'
  },
  {
    id: 'digital-invitations',
    badge: {
      text: 'Digital',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    title: 'Invitation électronique',
    description: 'Invitations digitales élégantes et personnalisées pour vos événements privés, soirées d\'entreprise et célébrations. Templates modernes, animations interactives, RSVP intégré et partage facile sur les réseaux sociaux.',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    gradient: { from: 'from-purple-100', to: 'to-purple-200' },
    iconColor: 'text-purple-600',
    tag: 'Design personnalisé',
    cta: 'Créer'
  },
  {
    id: 'event-management',
    badge: {
      text: 'Gestion',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    title: 'Gestion d\'événements',
    description: 'Plateforme complète et intuitive pour gérer tous les aspects de vos événements : planning, budgets, équipes, fournisseurs, marketing et analytics. Tableaux de bord en temps réel et outils de collaboration pour une organisation parfaite.',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    gradient: { from: 'from-red-100', to: 'to-red-200' },
    iconColor: 'text-red-600',
    tag: 'Plateforme complète',
    cta: 'Découvrir'
  },
  {
    id: 'customer-support',
    badge: {
      text: 'Support',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    title: 'Support client',
    description: 'Assistance 24/7 par une équipe d\'experts dédiée à votre réussite. Support multilingue, formation personnalisée, documentation complète et accompagnement sur mesure pour maximiser l\'impact de vos événements et optimiser votre ROI.',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z',
    gradient: { from: 'from-teal-100', to: 'to-teal-200' },
    iconColor: 'text-teal-600',
    tag: '24/7',
    cta: 'Contacter'
  }
]
</script>

<style>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>

