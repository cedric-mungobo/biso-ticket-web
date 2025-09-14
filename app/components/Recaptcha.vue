<template>
  <div class="recaptcha-container">
    <div ref="recaptchaElement" class="recaptcha-widget"></div>
    <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  siteKey: string
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  tabindex?: number
}

interface Emits {
  (e: 'verify', token: string): void
  (e: 'expired'): void
  (e: 'error'): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  size: 'normal',
  tabindex: 0
})

const emit = defineEmits<Emits>()

const recaptchaElement = ref<HTMLDivElement>()
const widgetId = ref<number | null>(null)
const error = ref('')

// Charger le script reCAPTCHA
const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=fr`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.grecaptcha) {
        resolve()
      } else {
        reject(new Error('reCAPTCHA script failed to load'))
      }
    }
    
    script.onerror = () => {
      reject(new Error('Failed to load reCAPTCHA script'))
    }
    
    document.head.appendChild(script)
  })
}

// Initialiser reCAPTCHA
const initRecaptcha = async () => {
  try {
    await loadRecaptchaScript()
    
    if (!recaptchaElement.value) return
    
    widgetId.value = window.grecaptcha.render(recaptchaElement.value, {
      sitekey: props.siteKey,
      theme: props.theme,
      size: props.size,
      tabindex: props.tabindex,
      callback: (token: string) => {
        error.value = ''
        emit('verify', token)
      },
      'expired-callback': () => {
        emit('expired')
      },
      'error-callback': () => {
        error.value = 'Erreur lors de la vérification reCAPTCHA'
        emit('error')
      }
    })
  } catch (err) {
    error.value = 'Impossible de charger reCAPTCHA'
    console.error('reCAPTCHA error:', err)
  }
}

// Réinitialiser le widget
const reset = () => {
  if (widgetId.value !== null && window.grecaptcha) {
    window.grecaptcha.reset(widgetId.value)
  }
}

// Obtenir la réponse
const getResponse = (): string => {
  if (widgetId.value !== null && window.grecaptcha) {
    return window.grecaptcha.getResponse(widgetId.value)
  }
  return ''
}

// Exposer les méthodes
defineExpose({
  reset,
  getResponse
})

onMounted(() => {
  initRecaptcha()
})

onUnmounted(() => {
  if (widgetId.value !== null && window.grecaptcha) {
    window.grecaptcha.reset(widgetId.value)
  }
})

// Recharger si la clé change
watch(() => props.siteKey, () => {
  if (recaptchaElement.value) {
    initRecaptcha()
  }
})
</script>

<style scoped>
.recaptcha-container {
  display: flex;
  justify-content: center;
}

.recaptcha-widget {
  transform: scale(0.9);
}

/* Ajustement pour mobile */
@media (max-width: 640px) {
  .recaptcha-widget {
    transform: scale(0.75);
  }
}
</style>
