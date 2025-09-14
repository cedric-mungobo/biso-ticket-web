/**
 * Composable pour la validation reCAPTCHA côté serveur
 * Utilise useRuntimeConfig() pour accéder aux clés de configuration
 */

interface RecaptchaResponse {
  success: boolean
  score?: number
  'error-codes'?: string[]
}

export const useRecaptcha = () => {
  const { recaptchaSecretKey } = useRuntimeConfig()

  /**
   * Valide un token reCAPTCHA côté serveur
   * @param token - Le token reCAPTCHA à valider
   * @param userIp - L'adresse IP de l'utilisateur (optionnel)
   * @returns Promise<boolean> - true si le token est valide
   */
  const validateRecaptcha = async (token: string, userIp?: string): Promise<boolean> => {
    if (!token || !recaptchaSecretKey) {
      return false
    }

    try {
      const response = await $fetch<RecaptchaResponse>('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
          secret: recaptchaSecretKey,
          response: token,
          ...(userIp && { remoteip: userIp })
        })
      })

      return response.success === true
    } catch (error) {
      console.error('Erreur lors de la validation reCAPTCHA:', error)
      return false
    }
  }

  /**
   * Valide un token reCAPTCHA avec score (pour reCAPTCHA v3)
   * @param token - Le token reCAPTCHA à valider
   * @param minScore - Score minimum requis (défaut: 0.5)
   * @param userIp - L'adresse IP de l'utilisateur (optionnel)
   * @returns Promise<{ valid: boolean, score?: number }>
   */
  const validateRecaptchaWithScore = async (
    token: string, 
    minScore: number = 0.5, 
    userIp?: string
  ): Promise<{ valid: boolean, score?: number }> => {
    if (!token || !recaptchaSecretKey) {
      return { valid: false }
    }

    try {
      const response = await $fetch<RecaptchaResponse>('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
          secret: recaptchaSecretKey,
          response: token,
          ...(userIp && { remoteip: userIp })
        })
      })

      const isValid = response.success === true
      const score = response.score || 0

      return {
        valid: isValid && score >= minScore,
        score
      }
    } catch (error) {
      console.error('Erreur lors de la validation reCAPTCHA avec score:', error)
      return { valid: false }
    }
  }

  return {
    validateRecaptcha,
    validateRecaptchaWithScore
  }
}
