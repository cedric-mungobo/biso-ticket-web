/**
 * Composable pour gérer les toasts avec configuration standardisée
 * Position en haut de l'écran et timeout configuré
 */
export const useAppToast = () => {
  const toast = useToast()

  const showToast = (options: {
    title: string
    description?: string
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  }) => {
    return toast.add(options)
  }

  const showSuccess = (title: string, description?: string) => {
    return showToast({ title, description, color: 'success' })
  }

  const showError = (title: string, description?: string) => {
    return showToast({ title, description, color: 'error' })
  }

  const showWarning = (title: string, description?: string) => {
    return showToast({ title, description, color: 'warning' })
  }

  const showInfo = (title: string, description?: string) => {
    return showToast({ title, description, color: 'info' })
  }

  return {
    add: toast.add,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
