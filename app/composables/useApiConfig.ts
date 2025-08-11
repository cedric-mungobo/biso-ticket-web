export function useApiConfig() {
  const config = useRuntimeConfig()
  
  return {
    // URL de base de l'API
    baseUrl: config.public.apiBaseUrl,
    
    // Headers par défaut
    defaultHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    // Fonction pour créer les headers avec authentification
    createAuthHeaders: (token: string) => ({
      ...useApiConfig().defaultHeaders,
      'Authorization': `Bearer ${token}`
    }),
    
    // Fonction pour construire l'URL complète
    buildUrl: (endpoint: string) => `${config.public.apiBaseUrl}${endpoint}`,
    
    // Configuration pour les requêtes
    requestConfig: {
      timeout: 60000, // 60 secondes
      retry: 1
    }
  }
}
