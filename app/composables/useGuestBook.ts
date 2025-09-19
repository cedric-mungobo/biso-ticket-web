import type { ComputedRef, Ref } from 'vue'

interface UseGuestBookOptions {
  slug: ComputedRef<string | undefined>
  eventId: ComputedRef<number | undefined>
  token: ComputedRef<string | undefined>
}

export const useGuestBook = ({ slug, eventId, token }: UseGuestBookOptions) => {
  const { $myFetch } = useNuxtApp()

  const guestBookContent = ref<string>('')
  const submittingMessage = ref<boolean>(false)
  const canSubmitMessage = computed<boolean>(
    () => guestBookContent.value.trim().length > 0 && guestBookContent.value.length <= 2000
  )

  // État de l'invitation
  const invitation = ref<any>(null)
  const invitationLoading = ref<boolean>(false)
  const invitationError = ref<string>('')

  // Messages des invités
  const guestMessages = ref<any[]>([])
  const guestMessagesLoading = ref<boolean>(false)
  const guestMessagesError = ref<string>('')

  // État de confirmation
  const confirming = ref<boolean>(false)
  const isConfirmed = computed<boolean>(() => invitation.value?.status === 'confirmed')

  // Charger les détails de l'invitation
  const load = async (): Promise<void> => {
    if (!token.value) return
    
    invitationLoading.value = true
    invitationError.value = ''
    
    try {
      const res = await $myFetch<any>(`/public/invitations/${token.value}`)
      const data = res?.data || res
      invitation.value = data?.invitation || data
    } catch (e: any) {
      invitationError.value = e?.message || 'Erreur lors du chargement de l\'invitation'
      console.error('Erreur lors du chargement de l\'invitation:', e)
    } finally {
      invitationLoading.value = false
    }
  }

  // Confirmer la présence
  const confirm = async (): Promise<void> => {
    if (!token.value) return
    
    confirming.value = true
    
    try {
      await $myFetch(`/public/invitations/${token.value}/confirm`, {
        method: 'POST'
      })
      
      // Mettre à jour le statut local
      if (invitation.value) {
        invitation.value.status = 'confirmed'
        invitation.value.confirmedAt = new Date().toISOString()
      }
      
      useToast().add({ 
        title: 'Confirmation enregistrée', 
        description: 'Votre présence a été confirmée avec succès.', 
        color: 'success' 
      })
    } catch (e: any) {
      useToast().add({ 
        title: 'Erreur', 
        description: String(e?.message || "Impossible de confirmer votre présence."), 
        color: 'error' 
      })
    } finally {
      confirming.value = false
    }
  }

  // Charger les messages des invités
  const loadGuestMessages = async (): Promise<void> => {
    if (!slug.value) {
      console.warn('Slug d\'événement non disponible, chargement des messages désactivé')
      guestMessages.value = []
      return
    }
    
    guestMessagesLoading.value = true
    guestMessagesError.value = ''
    
    try {
      const res = await $myFetch<any>(`/public/events/${slug.value}/messages?per_page=15`)
      const data = res?.data || res
      guestMessages.value = data?.messages || []
    } catch (e: any) {
      // Si l'événement n'existe pas (404), initialiser avec un tableau vide
      if (e?.status === 404) {
        console.warn('Événement non trouvé, initialisation avec tableau vide')
        guestMessages.value = []
        guestMessagesError.value = ''
      } else {
        console.warn('Erreur lors du chargement des messages:', e)
        guestMessages.value = []
        guestMessagesError.value = e?.message || 'Erreur lors du chargement des messages'
      }
    } finally {
      guestMessagesLoading.value = false
    }
  }

  const submitGuestBookMessage = async (): Promise<void> => {
    if (!canSubmitMessage.value) return
    try {
      submittingMessage.value = true
      if (!token.value) throw new Error('Token manquant')
      await $myFetch(`/public/invitations/messages`, {
        method: 'POST',
        body: { token: token.value, content: guestBookContent.value.trim() }
      })
      useAppToast().showSuccess('Merci', 'Votre message a été enregistré.')
      guestBookContent.value = ''
      // Recharger les messages après envoi
      await loadGuestMessages()
    } catch (e: any) {
      useAppToast().showError('Erreur', String(e?.message || "Impossible d'envoyer."))
    } finally {
      submittingMessage.value = false
    }
  }

  return {
    // state
    guestBookContent,
    submittingMessage,
    canSubmitMessage,
    invitation,
    invitationLoading,
    invitationError,
    confirming,
    isConfirmed,
    guestMessages,
    guestMessagesLoading,
    guestMessagesError,
    // actions
    load,
    confirm,
    submitGuestBookMessage,
    loadGuestMessages,
  }
}


