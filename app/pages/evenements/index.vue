<template>
  <main class="px-4 py-10">
    <div class="mx-auto container">
      <h1 class="text-3xl font-bold mb-6">Événements</h1>

      <p class="text-sm text-neutral-600 mb-6">Retrouvez tous les  événements disponibles sur Biso Ticket.</p>

      <div class="mb-6 flex items-center gap-2">
        <UInput
          v-model="searchTerm"
          class="flex-1"
          placeholder="Rechercher un événement..."
          @keydown.enter="applySearch"
        />
        <UButton color="primary" @click="applySearch">Rechercher</UButton>
      </div>

      <div v-if="loading" class="text-center py-12 text-neutral-600">
        Chargement des événements...
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="() => refresh()" class="bg-red-600 text-white px-4 py-2 rounded-md">Réessayer</button>
        </div>
      </div>

      <div v-else>
        <div v-if="eventsList.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <EventCard
            v-for="event in eventsList"
            :key="event.id"
            :categories="event.settings?.categories || []"
            :title="event.title"
            :image="event.imageUrl"
            :date="event.startsAt"
            :description="event.description || ''"
            :location="event.location"
            :eventId="event.slug || event.id"
            class="rounded-xl shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
        <div v-else class="text-center py-12 text-neutral-600">
          Aucun événement ne correspond à vos critères de recherche.
        </div>
      </div>

      <div v-if="pagination" class="mt-8">
        <Pagination :pagination="pagination" @page-change="changePage" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, watch, type ComponentPublicInstance } from 'vue'
import { useEvents } from '../../composables/useEvents'

// Repository (pas de state interne)
const { fetchPublicEvents, formatDate } = useEvents()

// Filtres et pagination locaux
type DateFilter = 'today' | 'tomorrow' | 'this_week' | 'all'
const currentFilters = ref<{ per_page?: number; page?: number; q?: string; category?: string; date_filter?: DateFilter }>({
  per_page: 12,
  page: 1,
  q: '',
  date_filter: 'all'
})

const { data, pending: loading, error, refresh } = await useAsyncData('public:events', () =>
  fetchPublicEvents({
    per_page: currentFilters.value.per_page,
    page: currentFilters.value.page,
    q: currentFilters.value.q,
    category: currentFilters.value.category,
    date_filter: currentFilters.value.date_filter
  })
, { server: false, watch: [() => currentFilters.value] })

const eventsList = computed(() => Array.isArray(data.value?.items) ? data.value!.items : [])
const pagination = computed(() => data.value?.meta)

if (process.client) {
  watch(data, (val) => {
    console.log('[Page] events data', val)
  }, { immediate: true })
}

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
    refresh()
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
  currentFilters.value = {
    ...currentFilters.value,
    page: 1,
    q: term?.trim() || ''
  }
}

// Barre de recherche locale
const searchTerm = ref('')
const applySearch = () => handleSearch(searchTerm.value)

// Initialiser et synchroniser le terme de recherche depuis les filtres
watch(
  () => currentFilters.value.q,
  (q) => { searchTerm.value = q || '' },
  { immediate: true }
)

// (Filtres avancés retirés)

// Pagination
const changePage = (page: number) => {
  currentFilters.value = { ...currentFilters.value, page }
}
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