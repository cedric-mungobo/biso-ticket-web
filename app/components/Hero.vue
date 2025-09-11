<template>
  <div>
    <main>
      <section class="overflow-hidden flex flex-col justify-center items-center max-sm:py-16 md:min-h-[90dvh]">
         <!-- Hero Section -->
    <div class="relative">
      <!-- Announcement Banner -->
                    <div class="flex justify-center">
        <Transition
          name="fade-slide-down"
          appear
        >
          <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Biso Ticket plateforme de billetterie</span>
              <NuxtLink 
                to="/evenements" 
                class="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
            Découvrir
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
              </NuxtLink>
        </div>
        </Transition>
      </div>

      <!-- Main Hero Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-left sm:text-center py-8 sm:py-10">
            <!-- Titre principal avec animation de frappe -->
        <Transition
          name="fade-slide-up"
          appear
        >
          <h1 class="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8  leading-relaxed">
            <Transition
              name="word-stagger"
              appear
            >
              <span class="inline-block bg-primary-900 text-white px-3 py-1 rounded-lg transform rotate-[-5deg] shadow-sm border border-primary-200">Organisez,</span>
            </Transition>
            <Transition
              name="word-stagger"
              appear
              :style="{ '--delay': '0.2s' }"
            >
              <span class="inline-block ml-2">vendez,</span>
            </Transition>
            <Transition
              name="word-stagger"
              appear
              :style="{ '--delay': '0.4s' }"
            >
              <span class="inline-block ml-2">contrôlez</span>
            </Transition>
        </h1>
        </Transition>
        
            <!-- Sous-titre avec animation de révélation -->
        <Transition
          name="fade-slide-up"
          appear
          :style="{ '--delay': '0.3s' }"
        >
          <p class="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            <Transition
              name="fade-slide-up"
              appear
              :style="{ '--delay': '0.5s' }"
            >
              <span class="inline-block">Biso Ticket simplifie vos événements.</span>
            </Transition>
              <br class="hidden sm:block">
            <Transition
              name="fade-slide-up"
              appear
              :style="{ '--delay': '0.7s' }"
            >
              <span class="inline-block">Créez vos billets, recevez les paiements mobile money,</span>
            </Transition>
              <br class="hidden sm:block">
            <Transition
              name="fade-slide-up"
              appear
              :style="{ '--delay': '0.9s' }"
            >
              <span class="inline-block">envoyez des invitations électroniques, et gérez l'accès avec des QR codes anti-fraude.</span>
            </Transition>
              <br class="hidden sm:block">
            <Transition
              name="fade-slide-up"
              appear
              :style="{ '--delay': '1.1s' }"
            >
              <span class="inline-block">Concert, Festival, Mariages, soirées privées ou événements pro — tout est là.</span>
            </Transition>
            </p>
        </Transition>

                        <!-- CTA Buttons avec animation stagger -->
        <Transition
          name="fade-slide-up"
          appear
          :style="{ '--delay': '0.6s' }"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3 sm:gap-4">
            <Transition
              name="button-bounce"
              appear
              :style="{ '--delay': '0.8s' }"
            >
              <NuxtLink 
                to="/organisateur/create-event" 
                class="hero-button w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
              >
            Organiser un événement
              </NuxtLink>
            </Transition>
            <Transition
              name="button-bounce"
              appear
              :style="{ '--delay': '1.0s' }"
            >
              <NuxtLink 
                to="/evenements" 
                class="hero-button w-full border rounded-md sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-primary-700 hover:text-primary-900 transition-all duration-300 transform hover:scale-105"
              >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Voir les événements
              </NuxtLink>
            </Transition>
        </div>
        </Transition>
      </div>
    </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  enableAnimations?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableAnimations: true
})
</script>

<style scoped>
/* Animation fade-slide-down */
.fade-slide-down-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--delay, 0s));
}

.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Animation fade-slide-up */
.fade-slide-up-enter-active {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--delay, 0s));
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
}

.fade-slide-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animation word-stagger pour les mots du titre */
.word-stagger-enter-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-delay: calc(var(--delay, 0s));
}

.word-stagger-enter-from {
  opacity: 0;
  transform: translateY(30px) rotateX(90deg);
}

.word-stagger-enter-to {
  opacity: 1;
  transform: translateY(0) rotateX(0deg);
}

/* Animation button-bounce pour les boutons */
.button-bounce-enter-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-delay: calc(var(--delay, 0s));
}

.button-bounce-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.button-bounce-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animation des phrases du sous-titre */
.fade-slide-up .fade-slide-up-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--delay, 0s));
}

.fade-slide-up .fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-up .fade-slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}


/* Désactiver les animations si l'utilisateur préfère moins de mouvement */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-down-enter-active,
  .fade-slide-up-enter-active,
  .word-stagger-enter-active,
  .button-bounce-enter-active {
    transition: none;
  }
  
  .fade-slide-down-enter-from,
  .fade-slide-up-enter-from,
  .word-stagger-enter-from,
  .button-bounce-enter-from {
    opacity: 1;
    transform: none;
  }
}
</style>