<template>
  <div class="relative w-full">
    <button
      @click="toggleShareMenu"
      class="bg-primary-600 text-white px-6 py-3 w-full rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
      </svg>
      Partager
    </button>

    <!-- Menu de partage -->
    <div
      v-if="showShareMenu"
      class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-10"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-medium text-gray-900">Partager cet événement</h4>
        <button
          @click="toggleShareMenu"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Options de partage -->
      <div class="space-y-3">
        <!-- Lien direct -->
        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <span class="text-sm text-gray-600">Lien direct</span>
          <button
            @click="copyLink"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {{ linkCopied ? 'Copié !' : 'Copier' }}
          </button>
        </div>

        <!-- Réseaux sociaux -->
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="shareOnFacebook"
            class="flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>

          <button
            @click="shareOnTwitter"
            class="flex items-center justify-center gap-2 p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>

          <button
            @click="shareOnWhatsApp"
            class="flex items-center justify-center gap-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp
          </button>

          <button
            @click="shareOnLinkedIn"
            class="flex items-center justify-center gap-2 p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
        </div>

        <!-- Email -->
        <button
          @click="shareByEmail"
          class="w-full flex items-center justify-center gap-2 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Partager par email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  eventTitle: string
  eventUrl: string
  eventDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  eventDescription: ''
})

const showShareMenu = ref(false)
const linkCopied = ref(false)

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.eventUrl)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.eventUrl)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnTwitter = () => {
  const text = `Découvrez cet événement : ${props.eventTitle}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(props.eventUrl)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = () => {
  const text = `Découvrez cet événement : ${props.eventTitle} ${props.eventUrl}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.eventUrl)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareByEmail = () => {
  const subject = `Événement : ${props.eventTitle}`
  const body = `Bonjour,\n\nJe vous invite à découvrir cet événement :\n\n${props.eventTitle}\n\n${props.eventDescription}\n\nPlus d'informations : ${props.eventUrl}\n\nCordialement`
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = url
}

// Fermer le menu si on clique à l'extérieur
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showShareMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
