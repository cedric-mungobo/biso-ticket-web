<template>
  <div class="">

   
      <InvitationHeader
      :image="invitation.event.imageUrl"
      :title="invitation.event.title"
      :subtitle="invitation.event.startsAt"
      :scroll-y="scrollY"
      overlay-type="dark"
      title-size="xl"
      text-align="center"
    />
    <InvitationBody
      :invitation="invitation"
      :event="event"
      :scroll-y="scrollY"
      :background-image="backgroundImage"
      :is-client="isClient"
        :background-size="'100% 100%'"
      @download-invitation="handleDownloadInvitation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ invitation: any; event?: any }>()

// Image de fond dynamique basée sur le design_key
const backgroundImage = computed(() => {
  const designKey = props.invitation?.invitationTemplate?.designKey || 
                   props.invitation?.invitation_template?.design_key || 
                   'template_mariage_1'
  return `url(/models/${designKey}.png)`
})

const scrollY = ref(0)
const isClient = ref(false)

const handleScroll = () => {
  if (isClient.value) {
    scrollY.value = window.scrollY
  }
}

const handleDownloadInvitation = () => {
  // Logique de téléchargement d'invitation
  console.log('Téléchargement d\'invitation')
}

onMounted(() => {
  isClient.value = true
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (isClient.value) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>