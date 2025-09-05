import type { ComputedRef, Ref } from 'vue'

interface UseGuestBookOptions {
  slug: ComputedRef<string | undefined>
  eventId: ComputedRef<number | undefined>
  token: ComputedRef<string | undefined>
}

export const useGuestBook = ({ slug, eventId, token }: UseGuestBookOptions) => {
  const { $myFetch } = useNuxtApp()
  const randomMessageContent = ref<string>('')
  const randomMessageLoading = ref<boolean>(false)

  const guestBookContent = ref<string>('')
  const submittingMessage = ref<boolean>(false)
  const canSubmitMessage = computed<boolean>(
    () => guestBookContent.value.trim().length > 0 && guestBookContent.value.length <= 2000
  )

  const loadRandomMessage = async (): Promise<void> => {
    randomMessageLoading.value = true
    try {
      if (slug.value) {
        const res = await $myFetch<any>(`/public/events/${encodeURIComponent(slug.value)}/messages/random`)
        const data = res?.data || res
        const msg = data?.message || data?.data?.message
        randomMessageContent.value = msg?.content || ''
        return
      }
    } catch (e: any) {
      if (e?.response?.status !== 404) return
    } finally {
      randomMessageLoading.value = false
    }

    // Fallback avec ID
    try {
      if (eventId.value) {
        const res2 = await $myFetch<any>(`/public/events/${eventId.value}/messages/random`)
        const data2 = res2?.data || res2
        const msg2 = data2?.message || data2?.data?.message
        randomMessageContent.value = msg2?.content || ''
      }
    } catch {
      // ignore
    } finally {
      randomMessageLoading.value = false
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
      await loadRandomMessage()
    } catch (e: any) {
      useToast().add({ title: 'Erreur', description: String(e?.message || "Impossible d'envoyer."), color: 'error' })
    } finally {
      submittingMessage.value = false
    }
  }

  return {
    // state
    randomMessageContent,
    randomMessageLoading,
    guestBookContent,
    submittingMessage,
    canSubmitMessage,
    // actions
    loadRandomMessage,
    submitGuestBookMessage,
  }
}


