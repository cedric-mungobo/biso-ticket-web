/**
 * Composable pour gérer les états de loading de manière centralisée
 */
export const useLoading = () => {
  // État global de loading
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const loadingError = ref<string | null>(null)

  /**
   * Démarre le loading avec un message optionnel
   */
  const startLoading = (message?: string) => {
    isLoading.value = true
    loadingMessage.value = message || ''
    loadingError.value = null
  }

  /**
   * Arrête le loading
   */
  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  /**
   * Arrête le loading avec une erreur
   */
  const stopLoadingWithError = (error: string) => {
    isLoading.value = false
    loadingMessage.value = ''
    loadingError.value = error
  }

  /**
   * Exécute une fonction asynchrone avec gestion automatique du loading
   */
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message)
      const result = await asyncFn()
      stopLoading()
      return result
    } catch (error: any) {
      const errorMessage = error?.message || 'Une erreur est survenue'
      stopLoadingWithError(errorMessage)
      throw error
    }
  }

  /**
   * Protection contre les envois multiples
   */
  const preventMultipleSubmissions = (fn: Function) => {
    return async (...args: any[]) => {
      if (isLoading.value) {
        console.warn('Action déjà en cours, ignorée')
        return
      }
      return await fn(...args)
    }
  }

  return {
    // État
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    loadingError: readonly(loadingError),
    
    // Actions
    startLoading,
    stopLoading,
    stopLoadingWithError,
    withLoading,
    preventMultipleSubmissions
  }
}
