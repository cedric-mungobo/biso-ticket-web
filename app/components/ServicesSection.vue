<template>

<div class="min-h-screen bg-gray-50 p-2 ">
    <div class="container mx-auto space-y-6">
      <!-- Top Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Extended RAW Support Card -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 p-8 text-white min-h-[500px]">
          <div class="relative z-10">
            <p class="text-sm font-medium opacity-90 mb-2">What's New</p>
            <h2 class="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Extended RAW<br>Support
            </h2>
          </div>
          
          <!-- Camera Model Pills -->
          <div class="absolute inset-0 z-20">
            <div class="absolute top-24 right-8 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Sony 7CR
            </div>
            <div class="absolute top-32 left-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Olympus E-M1 Mark III
            </div>
            <div class="absolute top-40 right-16 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Nikon Z 8
            </div>
            <div class="absolute top-48 left-8 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Nikon Z9
            </div>
            <div class="absolute top-56 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Nikon Z6 III
            </div>
            <div class="absolute top-64 left-16 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Fujifilm X-T50
            </div>
            <div class="absolute top-72 right-12 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Fujifilm A20
            </div>
            <div class="absolute top-80 left-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Fujifilm X-A20
            </div>
            <div class="absolute top-88 right-8 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              GoPro HERO10 Black
            </div>
            <div class="absolute bottom-24 right-16 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              Sony A700
            </div>
          </div>
          
          <!-- Background Image -->
          <div class="absolute inset-0 z-0">
                <img 
                src="/assets/images/hero.jpg" 
              alt="Desert landscape" 
              class="w-full h-full object-cover opacity-60"
            />
          </div>
          
          <!-- Learn More Button -->
          <div class="absolute bottom-8 left-8 z-20">
            <button class="border border-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium hover:bg-white/10 transition-colors">
              Learn more
            </button>
          </div>
        </div>

        <!-- Photo Grid Section -->
        <div class="relative overflow-hidden rounded-3xl bg-gray-900 p-8 min-h-[500px]">
          <div class="grid grid-cols-3 gap-2 h-full">
            <div class="space-y-2">
              <img src="/assets/images/hero.jpg" alt="Portrait" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Desert" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Portrait" class="w-full h-24 object-cover rounded-lg" />
            </div>
            <div class="space-y-2">
              <img src="/assets/images/hero.jpg" alt="Joshua Tree" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Nature" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Portrait" class="w-full h-24 object-cover rounded-lg" />
            </div>
            <div class="space-y-2">
              <img src="/assets/images/hero.jpg" alt="Silhouette" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Abstract" class="w-full h-24 object-cover rounded-lg" />
              <img src="/assets/images/hero.jpg" alt="Bridge" class="w-full h-24 object-cover rounded-lg" />
            </div>
          </div>
          
          <!-- Overlay Text -->
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 class="text-white text-3xl md:text-4xl font-bold text-center leading-tight">
              Batch edit your<br>photos in seconds.
            </h3>
          </div>
        </div>
      </div>

      <!-- Color Adjustments Section -->
      <div class="bg-white rounded-3xl p-8 md:p-12">
        <div class="max-w-2xl">
          <h3 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Powerful,<br>nondestructive<br>
            <span class="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              color adjustments.
            </span>
          </h3>
          
          <!-- Color Slider -->
          <div class="relative">
            <div class="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 mb-4"></div>
            <div class="h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 ml-auto w-32"></div>
            <div 
              class="absolute top-0 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-200 cursor-pointer transform -translate-y-1.5"
              :style="{ left: sliderPosition + '%' }"
              @mousedown="startDrag"
            ></div>
          </div>
        </div>
      </div>

      <!-- Magic Removal Section -->
      <div class="relative overflow-hidden rounded-3xl bg-gray-900 p-8 md:p-12 min-h-[400px]">
        <div class="relative z-10 max-w-xl">
          <h3 class="text-4xl md:text-5xl font-bold text-white leading-tight">
            Make objects<br>disappear like<br>
            <span class="text-yellow-400 italic">magic.</span>
          </h3>
        </div>
        
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
          <img 
            src="/assets/images/hero.jpg" 
            alt="Underwater boat view" 
            class="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>
    </div>
  </div>
  <section class=" px-2 sm:px-0 lg:px-8 py-12 lg:py-24 mx-auto">
    <!-- En-tête de section -->
    <div class="mb-6 sm:mb-10 max-w-3xl text-center mx-auto">
      <h2 class="font-medium text-black text-3xl sm:text-4xl dark:text-white mb-4">
        Nos Services
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        <span class="font-semibold text-primary-600">Biso Ticket</span> - La solution complète et innovante pour le succès de vos événements
      </p>
      
      <!-- Valeurs clés -->
      <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span 
          v-for="value in coreValues" 
          :key="value"
          class="flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ value }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
      Découvrez notre écosystème complet de solutions de billetterie et d'invitations électroniques. 
      De la vente en ligne sécurisée à la gestion d'événements, nous vous accompagnons à chaque étape 
      pour créer des expériences mémorables et réussies.
    </p>

    <!-- Grille des services -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
      />
    </div>

    <!-- Call-to-action -->
    <div class="mt-12 text-center">
      <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
        Prêt à transformer vos événements ? Rejoignez des milliers d'organisateurs qui font confiance à Biso Ticket
      </p>
      <NuxtLink 
        to="/organisateur"
        class="relative inline-block font-medium md:text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white"
      >
        Commencer à organiser votre événement
      </NuxtLink>
      <p class="text-sm text-gray-500 mt-4">
        ✓ Essai gratuit • ✓ Support 24/7 • ✓ Mise en place en 24h
      </p>
    </div>
  </section>
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

