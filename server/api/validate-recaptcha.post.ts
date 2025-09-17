/**
 * API route pour valider un token reCAPTCHA côté serveur
 * Exemple d'utilisation du composable useRecaptcha avec useRuntimeConfig()
 */
export default defineEventHandler(async (event) => {
  try {
    const { validateRecaptcha } = useRecaptcha()
    const body = await readBody(event)
    const { token } = body

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token reCAPTCHA requis'
      })
    }

    // Récupérer l'IP de l'utilisateur
    const userIp = getClientIP(event)

    // Valider le token reCAPTCHA
    const isValid = await validateRecaptcha(token, userIp)

    if (!isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token reCAPTCHA invalide'
      })
    }

    return {
      status: true,
      message: 'Token reCAPTCHA valide',
      data: { valid: true }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la validation reCAPTCHA'
    })
  }
})
