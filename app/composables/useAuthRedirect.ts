/**
 * Composable pour gérer les redirections après authentification
 */
export const useAuthRedirect = () => {
  const router = useRouter()
  const route = useRoute()

  /**
   * Redirige vers l'URL de destination après authentification
   */
  const redirectAfterAuth = async (defaultPath: string = '/') => {
    const redirectUrl = route.query.redirect as string
    
    if (redirectUrl && redirectUrl !== '/connexion' && redirectUrl !== '/inscription') {
      // Décoder l'URL de redirection
      const decodedUrl = decodeURIComponent(redirectUrl)
      await router.push(decodedUrl)
    } else {
      await router.push(defaultPath)
    }
  }

  /**
   * Redirige vers la page de connexion avec une URL de retour
   */
  const redirectToLogin = (returnUrl?: string) => {
    const query = returnUrl ? { redirect: encodeURIComponent(returnUrl) } : {}
    return navigateTo('/connexion', { query })
  }

  /**
   * Redirige vers la page d'inscription avec une URL de retour
   */
  const redirectToRegister = (returnUrl?: string) => {
    const query = returnUrl ? { redirect: encodeURIComponent(returnUrl) } : {}
    return navigateTo('/inscription', { query })
  }

  return {
    redirectAfterAuth,
    redirectToLogin,
    redirectToRegister
  }
}
