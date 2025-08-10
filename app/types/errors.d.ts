// Types pour la gestion centralisée des erreurs

export interface ApiError {
  status: number
  message: string
  code: string
  details?: Record<string, any>
  timestamp?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ErrorResponse {
  success: false
  error: ApiError
  validation_errors?: ValidationError[]
}

// Codes d'erreur standardisés
export enum ErrorCode {
  // Erreurs d'authentification
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  ACCOUNT_LOCKED = 'AUTH_004',
  TOO_MANY_ATTEMPTS = 'AUTH_005',
  
  // Erreurs de validation
  VALIDATION_ERROR = 'VAL_001',
  REQUIRED_FIELD = 'VAL_002',
  INVALID_FORMAT = 'VAL_003',
  PASSWORD_MISMATCH = 'VAL_004',
  PASSWORD_TOO_WEAK = 'VAL_005',
  
  // Erreurs de ressources
  RESOURCE_NOT_FOUND = 'RES_001',
  RESOURCE_ALREADY_EXISTS = 'RES_002',
  ACCESS_DENIED = 'RES_003',
  
  // Erreurs serveur
  SERVER_ERROR = 'SRV_001',
  DATABASE_ERROR = 'SRV_002',
  EXTERNAL_SERVICE_ERROR = 'SRV_003',
  
  // Erreurs réseau
  NETWORK_ERROR = 'NET_001',
  TIMEOUT_ERROR = 'NET_002',
  
  // Erreurs inconnues
  UNKNOWN_ERROR = 'UNK_001'
}

// Messages d'erreur localisés
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: 'Email/téléphone ou mot de passe incorrect',
  [ErrorCode.TOKEN_EXPIRED]: 'Votre session a expiré. Veuillez vous reconnecter',
  [ErrorCode.TOKEN_INVALID]: 'Session invalide. Veuillez vous reconnecter',
  [ErrorCode.ACCOUNT_LOCKED]: 'Votre compte a été verrouillé. Contactez le support',
  [ErrorCode.TOO_MANY_ATTEMPTS]: 'Trop de tentatives. Réessayez dans quelques minutes',
  
  [ErrorCode.VALIDATION_ERROR]: 'Données invalides',
  [ErrorCode.REQUIRED_FIELD]: 'Ce champ est requis',
  [ErrorCode.INVALID_FORMAT]: 'Format invalide',
  [ErrorCode.PASSWORD_MISMATCH]: 'Les mots de passe ne correspondent pas',
  [ErrorCode.PASSWORD_TOO_WEAK]: 'Le mot de passe est trop faible',
  
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Ressource introuvable',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Cette ressource existe déjà',
  [ErrorCode.ACCESS_DENIED]: 'Accès refusé',
  
  [ErrorCode.SERVER_ERROR]: 'Erreur serveur. Veuillez réessayer plus tard',
  [ErrorCode.DATABASE_ERROR]: 'Erreur de base de données',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Erreur de service externe',
  
  [ErrorCode.NETWORK_ERROR]: 'Erreur de connexion. Vérifiez votre connexion internet',
  [ErrorCode.TIMEOUT_ERROR]: 'Délai d\'attente dépassé. Veuillez réessayer',
  
  [ErrorCode.UNKNOWN_ERROR]: 'Erreur inattendue. Veuillez réessayer'
}

// Catégories d'erreurs pour le traitement
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  RESOURCE = 'resource',
  SERVER = 'server',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

// Fonction utilitaire pour catégoriser les erreurs
export function categorizeError(code: ErrorCode): ErrorCategory {
  if (code.startsWith('AUTH_')) return ErrorCategory.AUTHENTICATION
  if (code.startsWith('VAL_')) return ErrorCategory.VALIDATION
  if (code.startsWith('RES_')) return ErrorCategory.RESOURCE
  if (code.startsWith('SRV_')) return ErrorCategory.SERVER
  if (code.startsWith('NET_')) return ErrorCategory.NETWORK
  return ErrorCategory.UNKNOWN
}
