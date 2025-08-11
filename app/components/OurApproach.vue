<template>
  <section class="max-w-7xl px-2 xl:px-0 py-10 lg:pt-20 mx-auto">
    <!-- Titre de la section -->
    <div class="max-w-3xl mb-10 lg:mb-14">
      <h2 class="text-white font-semibold text-2xl md:text-4xl md:leading-tight">
        {{ title }}
      </h2>
      <p class="mt-1 text-secondary-200">
        {{ description }}
      </p>
    </div>

    <!-- Grille principale -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
      <!-- Image -->
      <div class="aspect-w-16 aspect-h-9 lg:aspect-none">
        <img 
          class="w-full object-cover rounded-xl" 
          :src="imageSrc" 
          :alt="imageAlt"
        >
      </div>

      <!-- Timeline des étapes -->
      <div>
        <!-- En-tête de la timeline -->
        <div class="mb-4">
          <h3 class="text-secondary-200 text-xs font-medium uppercase">
            {{ timelineTitle }}
          </h3>
        </div>

        <!-- Étapes de la timeline -->
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex gap-x-5 ms-1"
        >
          <!-- Icône avec ligne de connexion -->
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-secondary-200">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-secondary-200 text-secondary-200 font-semibold text-xs uppercase rounded-full">
                {{ index + 1 }}
              </span>
            </div>
          </div>

          <!-- Contenu de l'étape -->
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm lg:text-base text-neutral-400">
              <span class="text-white">{{ step.title }}:</span>
              {{ step.description }}
            </p>
          </div>
        </div>

        <!-- Bouton d'action -->
        <a 
          v-if="ctaButton"
          :href="ctaButton.href"
          class="group inline-flex items-center gap-x-2 py-2 px-3 bg-secondary-200 font-medium text-sm text-neutral-800 rounded-full focus:outline-hidden hover:bg-[#e6d900] transition-colors"
        >
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
          {{ ctaButton.text }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Interface pour définir la structure d'une étape
interface Step {
  title: string
  description: string
}

// Interface pour le bouton d'action
interface CTAButton {
  text: string
  href: string
}

// Props du composant avec valeurs par défaut
interface Props {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  timelineTitle?: string
  steps?: Step[]
  ctaButton?: CTAButton
}

// Définition des props avec valeurs par défaut
const props = withDefaults(defineProps<Props>(), {
    title: 'Organiser votre événement avec Biso Ticket',
    description: 'Organisez votre événement à Kinshasa avec Biso Ticket, la plateforme de billetterie en ligne qui vous permet de créer, gérer et vendre vos billets facilement. Vos participants peuvent payer par mobile money (Orange Money, M-Pesa, Airtel Money).',
    imageSrc: 'https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=480&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Features Image',
    timelineTitle: 'Étapes',
  steps: () => [
          {
        title: 'Créer votre événement',
        description: 'Créez votre événement en ajoutant toutes les informations nécessaires : nom, description, date, lieu et image.'
      },
      {
        title: 'Configurer vos billets',
        description: 'Définissez les types de billets, les prix et les quantités disponibles pour votre événement.'
      },
      {
        title: 'Partager et vendre',
        description: 'Partagez le lien de votre événement. Vos participants peuvent acheter leurs billets en ligne via mobile money (Orange Money, M-Pesa, Airtel Money).'
      },
      {
        title: 'Suivre vos performances',
        description: 'Surveillez en temps réel les ventes de billets et le succès de votre événement.'
      }
  ],
  ctaButton: () => ({
    text: 'Commencer à organiser',
    href: '/organisateur'
  })
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>
