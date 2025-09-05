<template>
  <div>
    <component :is="currentTemplate" :invitation="invitation" :event="event" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({ layout: false, ssr: false })

import TemplateDefault from '~/components/invitation/TemplateDefault.vue'
import TemplateMariage1 from '~/components/invitation/TemplateMariage1.vue'

const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const { $myFetch } = useNuxtApp()
const toast = useToast()

const templateKey = ref('default')
const invitation = ref<any>(null)
const event = ref<any>(null)

const load = async () => {
  try {
    const res = await $myFetch<any>(`/public/invitations/${token.value}`)
    const data = res?.data || res
    invitation.value = data?.invitation || data
    event.value = invitation.value?.event || data?.event || null
    templateKey.value = (invitation.value?.invitationTemplate?.designKey || invitation.value?.invitation_template?.design_key || 'template_default' || 'default').toLowerCase()
  } catch (_e) {
    toast.add({ title: 'Introuvable', description: 'Invitation introuvable.', color: 'error' })
  }
}

onMounted(load)

const currentTemplate = computed(() => {
  const key = String(templateKey.value || '').toLowerCase()
  if (key === 'template_default' || key === 'default') return TemplateDefault
  if (key === 'template_mariage_1' || key === 'mariage_1' || key === 'template_mariage1') return TemplateMariage1
  return TemplateDefault
})
</script>


