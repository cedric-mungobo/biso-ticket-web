<template>
  <main class="px-2 py-8 md:px-8 pt-24 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <!-- Titre avec animation d'entrée -->
      <Transition
        name="fade-slide-down"
        appear
        @enter="onTitleEnter"
        @leave="onTitleLeave"
      >
        <h1 
          ref="pageTitle"
          class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6"
        >
          Découvrez les événements à venir
        </h1>
      </Transition>

      <!-- Filtres avec animation -->
      <Transition
        name="fade-slide-up"
        appear
        @enter="onFiltersEnter"
        @leave="onFiltersLeave"
      >
        <div ref="filtersContainer">
          <EventFilters 
            :pagination="pagination"
            :current-filters="currentFilters"
            @search="handleSearch"
            @date-filter-change="handleDateFilterChange"
            @reset="handleReset"
          />
        </div>
      </Transition>

      <!-- États conditionnels avec animations -->
      <div v-if="loading" ref="loadingContainer">
        <Transition name="fade-scale" mode="out-in">
          <div class="text-center py-12">
            <div class="inline-flex items-center gap-2">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span class="text-gray-600">Chargement des événements...</span>
            </div>
          </div>
        </Transition>
      </div>

      <div v-else-if="error" ref="errorContainer">
        <Transition name="fade-slide-up" mode="out-in">
          <div class="text-center py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
              <p class="text-red-600 mb-4">{{ error }}</p>
              <button 
                @click="() => fetchEvents()"
                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <div v-else-if="events.length > 0" ref="eventsGrid">
        <Transition
          name="fade-slide-up"
          mode="out-in"
          @enter="onEventsGridEnter"
          @leave="onEventsGridLeave"
        >
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            <TransitionGroup
              name="event-card"
              tag="div"
              class="contents"
              @enter="onEventCardEnter"
              @leave="onEventCardLeave"
            >
              <EventCard
                v-for="(event, index) in events"
                :key="event.id"
                :ref="el => setEventCardRef(el, index)"
                :category="event.category"
                :title="event.name"
                :image="event.image_url || event.image"
                :date="event.date_time"
                :description="event.description"
                :location="event.location"
                :eventId="event.slug || event.id"
                class="event-card-item"
              />
            </TransitionGroup>
          </div>
        </Transition>
      </div>

      <div v-else ref="noEventsContainer">
        <Transition
          name="fade-slide-up"
          mode="out-in"
          @enter="onNoEventsEnter"
          @leave="onNoEventsLeave"
        >
          <div class="text-center py-12">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Aucun événement trouvé</h3>
              <p class="text-gray-600">Aucun événement ne correspond à vos critères de recherche.</p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Pagination avec animation -->
      <Transition
        name="fade-slide-up"
        appear
        @enter="onPaginationEnter"
        @leave="onPaginationLeave"
      >
        <div v-if="pagination" ref="paginationContainer">
          <Pagination 
            :pagination="pagination" 
            @page-change="changePage" 
          />
        </div>
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue'
import type { EventFilters } from '../../types/events'
import { useEvents } from '../../composables/useEvents'

// Utilisation du composable useEvents
const { 
  events, 
  loading, 
  error, 
  pagination,
  currentFilters,
  fetchEvents, 
  changePage,
  changePerPage,
  filterByDate,
  searchEvents,
  resetFilters,
  formatDate 
} = useEvents()

// Références pour les animations
const pageTitle = ref<HTMLElement>()
const filtersContainer = ref<HTMLElement>()
const loadingContainer = ref<HTMLElement>()
const errorContainer = ref<HTMLElement>()
const eventsGrid = ref<HTMLElement>()
const noEventsContainer = ref<HTMLElement>()
const paginationContainer = ref<HTMLElement>()
const eventCardRefs = ref<HTMLElement[]>([])

// Composable GSAP
const { 
  animateIn, 
  staggerAnimation, 
  createScrollAnimation, 
  accessibleAnimation,
  prefersReducedMotion 
} = useGSAP()

// État local pour les filtres
const selectedPerPage = ref(12)

// Fonction pour définir les références des cartes d'événements
const setEventCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && 'tagName' in el) {
    eventCardRefs.value[index] = el as HTMLElement
  }
}

// Animation d'entrée du titre
const onTitleEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.8,
      delay: 0.3,
      y: 40,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie du titre
const onTitleLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.2,
      y: -20,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée des filtres
const onFiltersEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.5,
      delay: 0.6,
      y: 30,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie des filtres
const onFiltersLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.0,
      y: -15,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée de la grille d'événements
const onEventsGridEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.3,
      delay: 0.4,
      y: 20,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie de la grille d'événements
const onEventsGridLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      y: -10,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée des cartes d'événements
const onEventCardEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  // Animation séquentielle des cartes
  setTimeout(() => {
    const validCards = eventCardRefs.value.filter(ref => ref)
    if (validCards.length > 0) {
      accessibleAnimation(
        validCards,
        () => staggerAnimation(validCards, {
          duration: 1.4,
          delay: 0.8,
          stagger: 0.25,
          y: 30,
          scale: 0.95,
          ease: 'power2.out'
        })
      )
    }
  }, 200)
}

// Animation de sortie des cartes d'événements
const onEventCardLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      scale: 0.9,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée du conteneur de chargement
const onLoadingEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.0,
      scale: 0.9,
      ease: 'back.out(1.7)'
    })
  )
}

// Animation d'entrée du conteneur d'erreur
const onErrorEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.2,
      y: 20,
      ease: 'power2.out'
    })
  )
}

// Animation d'entrée du conteneur "aucun événement"
const onNoEventsEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.2,
      y: 20,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie du conteneur "aucun événement"
const onNoEventsLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      y: -10,
      ease: 'power2.in'
    })
  )
}

// Animation d'entrée de la pagination
const onPaginationEnter = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 1.4,
      delay: 1.0,
      y: 25,
      ease: 'power2.out'
    })
  )
}

// Animation de sortie de la pagination
const onPaginationLeave = (el: Element) => {
  if (prefersReducedMotion()) return
  
  accessibleAnimation(
    el,
    () => animateIn(el, {
      duration: 0.8,
      y: -15,
      ease: 'power2.in'
    })
  )
}

// Récupération des événements au montage du composant
onMounted(() => {
  nextTick(() => {
    fetchEvents()
    
    // Configuration des animations au scroll
    if (pageTitle.value) {
      createScrollAnimation(pageTitle.value, {
        start: 'top 90%',
        end: 'bottom 10%'
      })
    }
    
    if (filtersContainer.value) {
      createScrollAnimation(filtersContainer.value, {
        start: 'top 85%',
        end: 'bottom 15%'
      })
    }
  })
})

// Gestion de la recherche
const handleSearch = (term: string) => {
  if (term.trim()) {
    searchEvents(term.trim())
  } else {
    // Si la recherche est vide, on récupère tous les événements
    fetchEvents({ ...currentFilters.value, search: undefined })
  }
}

// Gestion du changement de filtre de date
const handleDateFilterChange = (filter: EventFilters['date_filter']) => {
  filterByDate(filter)
}

// Gestion de la réinitialisation
const handleReset = () => {
  resetFilters()
}

// Gestion du changement du nombre d'éléments par page
const handlePerPageChange = () => {
  changePerPage(parseInt(selectedPerPage.value.toString()))
}

// Synchroniser les filtres locaux avec les filtres du composable
watch(currentFilters, (newFilters) => {
  selectedPerPage.value = newFilters.per_page || 12
}, { immediate: true })
</script>

<style scoped>
/* Transitions natives Vue.js */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 1.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}

.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 1.0s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Transitions pour les cartes d'événements */
.event-card-enter-active,
.event-card-leave-active {
  transition: all 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.event-card-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.event-card-move {
  transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimisations de performance */
* {
  will-change: transform, opacity;
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-down-enter-active,
  .fade-slide-down-leave-active,
  .fade-slide-up-enter-active,
  .fade-slide-up-leave-active,
  .fade-scale-enter-active,
  .fade-scale-leave-active,
  .event-card-enter-active,
  .event-card-leave-active,
  .event-card-move {
    transition: none;
  }
  
  .fade-slide-down-enter-from,
  .fade-slide-down-leave-to,
  .fade-slide-up-enter-from,
  .fade-slide-up-leave-to,
  .fade-scale-enter-from,
  .fade-scale-leave-to,
  .event-card-enter-from,
  .event-card-leave-to {
    transform: none;
    opacity: 1;
  }
}

/* Styles pour les cartes d'événements */
.event-card-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>