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

  const submitGuestBookMessage = async (): Promise<void> => {
    if (!canSubmitMessage.value) return
    try {
      submittingMessage.value = true
      if (!token.value) throw new Error('Token manquant')
      await $myFetch(`/public/invitations/messages`, {
        method: 'POST',
        body: { token: token.value, content: guestBookContent.value.trim() }
      })
      useToast().add({ title: 'Merci', description: 'Votre message a été enregistré.', color: 'success' })
      guestBookContent.value = ''
    } catch (e: any) {
      useToast().add({ title: 'Erreur', description: String(e?.message || "Impossible d'envoyer."), color: 'error' })
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
    // actions
    load,
    confirm,
    submitGuestBookMessage,
  }
}


