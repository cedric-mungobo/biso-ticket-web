import { ref, computed } from 'vue'

export interface UserPreferences {
  preferredPaymentMethod: 'mobile_money' | 'card' | 'bank_transfer'
  preferredMobileMoneyOperator: '1' | '2' | '3' | null // 1: Airtel, 2: Mpsa, 3: Orange
  phoneNumber: string
  email: string
  language: 'fr' | 'en'
  theme: 'light' | 'dark'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export function useUserPreferences() {
  // Cookies pour les préférences utilisateur
  const preferencesCookie = useCookie('biso-user-preferences', {
    default: () => ({
      preferredPaymentMethod: 'mobile_money',
      preferredMobileMoneyOperator: null,
      phoneNumber: '',
      email: '',
      language: 'fr',
      theme: 'light',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    } as UserPreferences),
    maxAge: 60 * 60 * 24 * 365, // 1 an
    secure: true,
    sameSite: 'strict'
  })

  // État local synchronisé avec les cookies
  const preferences = ref<UserPreferences>(preferencesCookie.value)

  // Synchronisation automatique avec les cookies
  watch(preferences, (newValue) => {
    preferencesCookie.value = newValue
  }, { deep: true })

  // Getters
  const preferredPaymentMethod = computed(() => preferences.value.preferredPaymentMethod)
  const preferredMobileMoneyOperator = computed(() => preferences.value.preferredMobileMoneyOperator)
  const phoneNumber = computed(() => preferences.value.phoneNumber)
  const email = computed(() => preferences.value.email)
  const language = computed(() => preferences.value.language)
  const theme = computed(() => preferences.value.theme)
  const notifications = computed(() => preferences.value.notifications)

  // Actions
  const setPreferredPaymentMethod = (method: UserPreferences['preferredPaymentMethod']) => {
    preferences.value.preferredPaymentMethod = method
  }

  const setPreferredMobileMoneyOperator = (operator: UserPreferences['preferredMobileMoneyOperator']) => {
    preferences.value.preferredMobileMoneyOperator = operator
  }

  const setPhoneNumber = (phone: string) => {
    preferences.value.phoneNumber = phone
  }

  const setEmail = (email: string) => {
    preferences.value.email = email
  }

  const setLanguage = (lang: UserPreferences['language']) => {
    preferences.value.language = lang
  }

  const setTheme = (newTheme: UserPreferences['theme']) => {
    preferences.value.theme = newTheme
  }

  const updateNotificationSettings = (settings: Partial<UserPreferences['notifications']>) => {
    preferences.value.notifications = { ...preferences.value.notifications, ...settings }
  }

  const resetPreferences = () => {
    preferences.value = {
      preferredPaymentMethod: 'mobile_money',
      preferredMobileMoneyOperator: null,
      phoneNumber: '',
      email: '',
      language: 'fr',
      theme: 'light',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  }

  // Fonction pour récupérer les préférences depuis les cookies
  const restoreFromCookies = () => {
    if (preferencesCookie.value) {
      preferences.value = { ...preferencesCookie.value }
    }
  }



  return {
    // État
    preferences: readonly(preferences),
    
    // Getters
    preferredPaymentMethod,
    preferredMobileMoneyOperator,
    phoneNumber,
    email,
    language,
    theme,
    notifications,
    
    // Actions
    setPreferredPaymentMethod,
    setPreferredMobileMoneyOperator,
    setPhoneNumber,
    setEmail,
    setLanguage,
    setTheme,
    updateNotificationSettings,
    resetPreferences,
    restoreFromCookies
  }
}
