import { ref, computed } from 'vue'
import { ErrorMessages, ErrorCategory, ErrorCode } from '~/types/errors'
import type { ApiError, ValidationError } from '~/types/errors'

export interface ErrorState {
  hasError: boolean
  error: ApiError | null
  validationErrors: ValidationError[]
  isNetworkError: boolean
  isServerError: boolean
  isAuthError: boolean
}

export interface ErrorHandlerOptions {
  showToast?: boolean
  logToConsole?: boolean
  redirectOnAuthError?: boolean
}

// État global des erreurs
const errorState = ref<ErrorState>({
  hasError: false,
  error: null,
  validationErrors: [],
  isNetworkError: false,
  isServerError: false,
  isAuthError: false
})

// Computed properties pour faciliter l'accès
const hasError = computed(() => errorState.value.hasError)
const currentError = computed(() => errorState.value.error)
const validationErrors = computed(() => errorState.value.validationErrors)
const isNetworkError = computed(() => errorState.value.isNetworkError)
const isServerError = computed(() => errorState.value.isServerError)
const isAuthError = computed(() => errorState.value.isAuthError)

// Fonction principale de gestion des erreurs
const handleError = (
  error: any, 
  options: ErrorHandlerOptions = {}
): { code: string; message: string; category: ErrorCategory } => {
  const {
    showToast = true,
    logToConsole = true,
    redirectOnAuthError = true
  } = options

  // Log de l'erreur si demandé
  if (logToConsole) {
    console.error('Erreur gérée par useErrorHandler:', error)
  }

  // Analyse de l'erreur
  const errorInfo = analyzeError(error)
  
  // Mise à jour de l'état global
  updateErrorState(errorInfo)
  
  // Actions automatiques selon le type d'erreur
  handleAutomaticActions(errorInfo, { redirectOnAuthError })
  
  // Affichage du toast si demandé
  if (showToast) {
    showErrorToast(errorInfo.message)
  }
  
  return errorInfo
}

// Analyse de l'erreur pour déterminer son type et code
const analyzeError = (error: any): { code: string; message: string; category: ErrorCategory } => {
  // Erreur réseau
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: ErrorMessages[ErrorCode.NETWORK_ERROR],
      category: ErrorCategory.NETWORK
    }
  }
  
  // Erreur de timeout
  if (error.name === 'AbortError') {
    return {
      code: ErrorCode.TIMEOUT_ERROR,
      message: ErrorMessages[ErrorCode.TIMEOUT_ERROR],
      category: ErrorCategory.NETWORK
    }
  }
  
  // Erreur API avec status
  if (error.status) {
    return analyzeApiError(error)
  }
  
  // Erreur de validation
  if (error.data?.errors) {
    return {
      code: ErrorCode.VALIDATION_ERROR,
      message: ErrorMessages[ErrorCode.VALIDATION_ERROR],
      category: ErrorCategory.VALIDATION
    }
  }
  
  // Erreur inconnue
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: ErrorMessages[ErrorCode.UNKNOWN_ERROR],
    category: ErrorCategory.UNKNOWN
  }
}

// Analyse des erreurs API selon le status HTTP
const analyzeApiError = (error: any): { code: string; message: string; category: ErrorCategory } => {
  const status = error.status
  
  switch (status) {
    case 400:
      return {
        code: 'VAL_001',
        message: error.data?.message || ErrorMessages.VAL_001,
        category: ErrorCategory.VALIDATION
      }
      
    case 401:
      return {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: ErrorMessages[ErrorCode.INVALID_CREDENTIALS],
        category: ErrorCategory.AUTHENTICATION
      }
      
    case 403:
      return {
        code: ErrorCode.ACCESS_DENIED,
        message: ErrorMessages[ErrorCode.ACCESS_DENIED],
        category: ErrorCategory.RESOURCE
      }
      
    case 404:
      return {
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: ErrorMessages[ErrorCode.RESOURCE_NOT_FOUND],
        category: ErrorCategory.RESOURCE
      }
      
    case 409:
      return {
        code: ErrorCode.RESOURCE_ALREADY_EXISTS,
        message: error.data?.message || ErrorMessages[ErrorCode.RESOURCE_ALREADY_EXISTS],
        category: ErrorCategory.RESOURCE
      }
      
    case 422:
      return {
        code: ErrorCode.VALIDATION_ERROR,
        message: ErrorMessages[ErrorCode.VALIDATION_ERROR],
        category: ErrorCategory.VALIDATION
      }
      
    case 429:
      return {
        code: ErrorCode.TOO_MANY_ATTEMPTS,
        message: ErrorMessages[ErrorCode.TOO_MANY_ATTEMPTS],
        category: ErrorCategory.AUTHENTICATION
      }
      
    case 500:
    case 502:
    case 503:
      return {
        code: ErrorCode.SERVER_ERROR,
        message: ErrorMessages[ErrorCode.SERVER_ERROR],
        category: ErrorCategory.SERVER
      }
      
    default:
      if (status >= 500) {
        return {
          code: ErrorCode.SERVER_ERROR,
          message: ErrorMessages[ErrorCode.SERVER_ERROR],
          category: ErrorCategory.SERVER
        }
      }
      
      return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error.data?.message || ErrorMessages[ErrorCode.UNKNOWN_ERROR],
        category: ErrorCategory.UNKNOWN
      }
  }
}

// Mise à jour de l'état global des erreurs
const updateErrorState = (errorInfo: { code: string; message: string; category: ErrorCategory }) => {
  errorState.value = {
    hasError: true,
    error: {
      status: 0, // Sera mis à jour si disponible
      message: errorInfo.message,
      code: errorInfo.code,
      timestamp: new Date().toISOString()
    },
    validationErrors: [],
    isNetworkError: errorInfo.category === ErrorCategory.NETWORK,
    isServerError: errorInfo.category === ErrorCategory.SERVER,
    isAuthError: errorInfo.category === ErrorCategory.AUTHENTICATION
  }
}

// Actions automatiques selon le type d'erreur
const handleAutomaticActions = (
  errorInfo: { code: string; message: string; category: ErrorCategory },
  options: { redirectOnAuthError: boolean }
) => {
  const { redirectOnAuthError } = options
  
  // Redirection automatique pour les erreurs d'authentification
  if (redirectOnAuthError && errorInfo.category === ErrorCategory.AUTHENTICATION) {
    if ([ErrorCode.TOKEN_EXPIRED, ErrorCode.TOKEN_INVALID].includes(errorInfo.code as ErrorCode)) {
      // Token expiré ou invalide -> redirection vers login
      navigateTo('/login')
    }
  }
  
  // Nettoyage automatique pour les erreurs d'authentification
  if (errorInfo.category === ErrorCategory.AUTHENTICATION) {
    const { clearAuth } = useAuth()
    clearAuth()
  }
}

// Affichage du toast d'erreur
const showErrorToast = (message: string) => {
  // Ici vous pouvez intégrer votre système de toast
  // Pour l'instant, on utilise console.log
  console.log('Toast d\'erreur:', message)
  
  // Exemple avec un toast personnalisé
  // useToast().show({ type: 'error', message })
}

// Gestion des erreurs de validation
const handleValidationErrors = (errors: Record<string, string[]>): ValidationError[] => {
  const validationErrors: ValidationError[] = []
  
  Object.entries(errors).forEach(([field, messages]) => {
    if (messages && messages.length > 0) {
      validationErrors.push({
        field,
        message: messages[0],
        code: ErrorCode.VALIDATION_ERROR
      })
    }
  })
  
  errorState.value.validationErrors = validationErrors
  return validationErrors
}

// Nettoyage des erreurs
const clearErrors = () => {
  errorState.value = {
    hasError: false,
    error: null,
    validationErrors: [],
    isNetworkError: false,
    isServerError: false,
    isAuthError: false
  }
}

// Récupération des erreurs de validation pour un champ spécifique
const getFieldError = (fieldName: string): string => {
  const fieldError = errorState.value.validationErrors.find(
    error => error.field === fieldName
  )
  return fieldError?.message || ''
}

// Vérification si un champ a des erreurs
const hasFieldError = (fieldName: string): boolean => {
  return errorState.value.validationErrors.some(
    error => error.field === fieldName
  )
}

export const useErrorHandler = () => {
  return {
    // État
    hasError,
    currentError,
    validationErrors,
    isNetworkError,
    isServerError,
    isAuthError,
    
    // Actions
    handleError,
    handleValidationErrors,
    clearErrors,
    getFieldError,
    hasFieldError
  }
}
