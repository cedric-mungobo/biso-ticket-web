<template>
  <div class="min-h-screen">
    <!-- Reading Progress Bar -->
    <div 
      v-if="!isLoading && !error"
      class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
    >
      <div 
        class="h-full bg-purple-600 transition-all duration-300"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement de l'article...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="lucide:alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Oups !</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/blog" 
          class="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Retour au blog
        </NuxtLink>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else>
      <!-- Article Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <!-- Category Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" :class="getCategoryClass(article?.category || '')">
            {{ article?.category }}
          </div>
          
          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {{ article?.title }}
          </h1>
          
          <!-- Meta Info -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 mb-8">
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              <span>{{ formatDate(article?.publishedAt || '') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:clock" class="w-4 h-4" />
              <span>{{ article?.readTime }} min de lecture</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="lucide:eye" class="w-4 h-4" />
              <span>{{ article?.views }} vues</span>
            </div>
          </div>
          
          <!-- Excerpt -->
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ article?.excerpt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Article Image -->
    <div v-if="article?.image" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <img 
        :src="article.image" 
        :alt="article.title"
        class="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
      />
    </div>

    <!-- Article Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="prose prose-lg max-w-none">
        <div v-html="article?.content"></div>
      </div>
      
      <!-- Table of Contents (if article has headings) -->
      <div v-if="hasHeadings" class="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Table des matières</h3>
        <nav class="space-y-2">
          <a 
            v-for="heading in headings" 
            :key="heading.id"
            :href="`#${heading.id}`"
            class="block text-sm text-gray-600 hover:text-purple-600 transition-colors"
            :class="`ml-${(heading.level - 1) * 4}`"
          >
            {{ heading.text }}
          </a>
        </nav>
      </div>
    </div>

    <!-- Author Section -->
    <div v-if="article?.author" class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center gap-6">
          <img 
            :src="article.author.avatar" 
            :alt="article.author.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ article.author.name }}</h3>
            <p class="text-gray-600">{{ article.author.bio }}</p>
            <div class="flex gap-4 mt-2">
              <a v-if="article.author.twitter" :href="article.author.twitter" class="text-blue-600 hover:text-blue-700">
                <Icon name="lucide:twitter" class="w-5 h-5" />
              </a>
              <a v-if="article.author.linkedin" :href="article.author.linkedin" class="text-blue-600 hover:text-blue-700">
                <Icon name="lucide:linkedin" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Articles -->
    <div v-if="relatedArticles.length > 0" class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          Articles similaires
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="relatedArticle in relatedArticles" 
            :key="relatedArticle.slug"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="h-48 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div class="p-6">
              <div class="text-sm text-purple-600 font-medium mb-2">{{ relatedArticle.category }}</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                <NuxtLink :to="`/blog/${relatedArticle.slug}`" class="hover:text-purple-600 transition">
                  {{ relatedArticle.title }}
                </NuxtLink>
              </h3>
              <p class="text-gray-600 mb-4">{{ relatedArticle.excerpt }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{{ formatDate(relatedArticle.publishedAt) }}</span>
                <span>{{ relatedArticle.readTime }} min</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Social Sharing -->
    <div class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Partager cet article</h3>
          <div class="flex justify-center gap-4">
            <a 
              :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(route.fullPath)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Icon name="lucide:twitter" class="w-4 h-4" />
              Twitter
            </a>
            <a 
              :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(route.fullPath)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Icon name="lucide:facebook" class="w-4 h-4" />
              Facebook
            </a>
            <button 
              @click="copyToClipboard"
              class="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <Icon name="lucide:copy" class="w-4 h-4" />
              Copier le lien
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="bg-purple-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 class="text-3xl font-bold mb-4">
          Prêt à créer votre événement ?
        </h2>
        <p class="text-xl text-purple-100 mb-8">
          Mettez en pratique ces conseils avec Biso Ticket
        </p>
        <NuxtLink 
          to="/organisateur" 
          class="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
        >
          Créer mon événement
        </NuxtLink>
      </div>
    </div>
    </div>
    
    <!-- Back to Top Button -->
    <button 
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-50"
      aria-label="Retour en haut"
    >
      <Icon name="lucide:arrow-up" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSEO } from '~/composables/useSEO'

// Récupération du slug depuis la route
const route = useRoute()
const slug = route.params.slug as string
const router = useRouter()

// Interface pour l'article
interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  publishedAt: string
  readTime: number
  views: number
  image?: string
  author?: {
    name: string
    bio: string
    avatar: string
    twitter?: string
    linkedin?: string
  }
}

// Données simulées (à remplacer par un appel API)
const article = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Table des matières
const headings = ref<Array<{ id: string; text: string; level: number }>>([])
const hasHeadings = computed(() => headings.value.length > 0)

// Back to top functionality
const showBackToTop = ref(false)

// Reading progress
const readingProgress = ref(0)

// Fonction pour faire défiler vers le haut
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Écouter le scroll pour afficher/masquer le bouton et calculer la progression
onMounted(() => {
  const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300
    
    // Calculer la progression de lecture
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight - windowHeight
    const scrolled = window.scrollY
    readingProgress.value = Math.min((scrolled / documentHeight) * 100, 100)
  }
  
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

// Simulation de chargement des données
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Données simulées basées sur le slug
    const mockArticles: Record<string, Article> = {
    'comment-organiser-evenement-reussi': {
      slug: 'comment-organiser-evenement-reussi',
      title: 'Comment organiser un événement réussi : Guide complet',
      excerpt: 'Découvrez les étapes clés pour organiser un événement qui marquera les esprits et atteindra vos objectifs.',
      content: `
        <h2>Introduction</h2>
        <p>Organiser un événement réussi nécessite une planification minutieuse et une attention aux détails. Dans ce guide complet, nous vous accompagnons à travers toutes les étapes essentielles.</p>
        
        <h2>1. Définir vos objectifs</h2>
        <p>Avant de commencer, il est crucial de définir clairement vos objectifs. Que souhaitez-vous accomplir avec cet événement ?</p>
        <ul>
          <li>Augmenter la notoriété de votre marque</li>
          <li>Générer des leads qualifiés</li>
          <li>Fidéliser vos clients existants</li>
          <li>Lancer un nouveau produit</li>
        </ul>
        
        <h2>2. Planifier le budget</h2>
        <p>Un budget bien défini est la base de toute organisation réussie. N'oubliez pas d'inclure :</p>
        <ul>
          <li>Location de salle</li>
          <li>Catering</li>
          <li>Équipement technique</li>
          <li>Communication et marketing</li>
          <li>Personnel</li>
        </ul>
        
        <h2>3. Choisir le bon lieu</h2>
        <p>Le choix du lieu peut faire ou défaire votre événement. Considérez :</p>
        <ul>
          <li>La capacité d'accueil</li>
          <li>L'accessibilité</li>
          <li>Les équipements disponibles</li>
          <li>L'ambiance et l'image</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Avec une planification rigoureuse et l'utilisation des bons outils comme Biso Ticket, vous êtes sur la bonne voie pour organiser un événement mémorable.</p>
      `,
      category: 'Conseils',
      publishedAt: '2024-01-15',
      readTime: 8,
      views: 1250,
      image: 'https://images.unsplash.com/photo-1511578314322-379f7b7b4c4b?w=800&auto=format&fit=crop&q=60',
      author: {
        name: 'Marie Dubois',
        bio: 'Experte en organisation d\'événements avec 10 ans d\'expérience',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop&q=60',
        twitter: 'https://twitter.com/mariedubois',
        linkedin: 'https://linkedin.com/in/mariedubois'
      }
    },
    'nouveautes-biso-ticket': {
      slug: 'nouveautes-biso-ticket',
      title: 'Nouveautés Biso Ticket : Les dernières fonctionnalités',
      excerpt: 'Découvrez les dernières améliorations et fonctionnalités ajoutées à la plateforme Biso Ticket.',
      content: `
        <h2>Nouvelles fonctionnalités</h2>
        <p>Nous sommes ravis de vous présenter les dernières améliorations de Biso Ticket qui rendent la gestion d'événements encore plus simple et efficace.</p>
        
        <h2>1. Interface utilisateur améliorée</h2>
        <p>Notre nouvelle interface offre une expérience utilisateur plus intuitive et moderne.</p>
        
        <h2>2. Paiements mobiles étendus</h2>
        <p>Support de nouveaux opérateurs de mobile money pour une couverture maximale.</p>
        
        <h2>3. Statistiques avancées</h2>
        <p>Nouveaux tableaux de bord avec des métriques détaillées pour suivre vos performances.</p>
      `,
      category: 'Actualités',
      publishedAt: '2024-01-10',
      readTime: 5,
      views: 890,
      author: {
        name: 'Équipe Biso Ticket',
        bio: 'L\'équipe de développement de Biso Ticket',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
      }
    }
  }
  
  article.value = mockArticles[slug] || null
  
  if (!article.value) {
    error.value = 'Article non trouvé'
    return
  }
  
  // Articles similaires
  relatedArticles.value = Object.values(mockArticles)
    .filter(a => a.slug !== slug)
    .slice(0, 3)
    
  // Générer la table des matières
  generateTableOfContents()
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'article'
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
})

// Fonction pour générer la table des matières
const generateTableOfContents = () => {
  if (!article.value?.content) return
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = article.value.content
  
  const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.value = Array.from(headingElements).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }
  })
}

// Fonction pour obtenir la classe CSS de la catégorie
const getCategoryClass = (category: string) => {
  const classes = {
    'Conseils': 'bg-purple-100 text-purple-800',
    'Actualités': 'bg-blue-100 text-blue-800',
    'Guide': 'bg-green-100 text-green-800'
  }
  return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Fonction de formatage de date
const formatDate = (dateString: string) => {
  if (!dateString) return 'Date non disponible'
  
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Erreur de formatage de date:', error)
    return 'Date invalide'
  }
}

// SEO dynamique basé sur l'article
watch(article, (newArticle) => {
  if (newArticle) {
    const { setSEO } = useSEO()
    setSEO({
      title: `${newArticle.title} - Blog Biso Ticket`,
      description: newArticle.excerpt,
      keywords: ['blog', 'conseils événement', 'organisation événement', newArticle.category.toLowerCase(), 'Biso Ticket'],
      image: newArticle.image,
      type: 'article'
    })
  }
}, { immediate: true })

// Fonction de copie dans le presse-papiers
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // Vous pourriez ajouter une notification toast ici
    console.log('Lien copié dans le presse-papiers')
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold text-gray-900 mt-6 mb-3;
}

.prose p {
  @apply text-gray-700 leading-relaxed mb-4;
}

.prose ul {
  @apply list-disc list-inside text-gray-700 mb-4;
}

.prose li {
  @apply mb-2;
}
</style>
