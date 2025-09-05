<template>
  <div class="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-950 dark:to-gray-900">
    <div class="relative h-64 md:h-96 w-full overflow-hidden">
      <div class="absolute inset-0" :style="{ backgroundImage: `url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }" />
      <div class="absolute inset-0 bg-rose-500/20 mix-blend-multiply" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
      <div class="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">{{ eventTitle }}</h1>
          <p v-if="eventDateText" class="mt-2 text-base md:text-lg opacity-90">{{ eventDateText }}</p>
          <p v-if="eventLocation" class="mt-1 text-sm md:text-base opacity-80">{{ eventLocation }}</p>
        </div>
      </div>
    </div>

    <div class="px-3 md:px-6 py-8 md:py-12">
      <div class="max-w-3xl mx-auto bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl border border-rose-100 dark:border-gray-800 shadow-xl">
        <div class="p-6 md:p-10 text-center">
          <div class="text-rose-600 font-semibold tracking-wide">Invitation</div>
          <h2 class="text-3xl md:text-4xl font-bold mt-2">Cher(e) {{ guestName }}</h2>
          <p class="mt-4 text-gray-600 dark:text-gray-300">
            Nous avons l'immense joie de vous inviter à célébrer cet événement spécial avec nous.
          </p>

          <div class="mt-6 grid grid-cols-1 gap-4 text-left text-gray-700 dark:text-gray-200">
            <div v-if="eventDateText" class="flex items-center gap-3">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-rose-600" />
              <span>{{ eventDateText }}</span>
            </div>
            <div v-if="eventLocation" class="flex items-center gap-3">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-rose-600" />
              <span>{{ eventLocation }}</span>
            </div>
            <div v-if="guestTableName" class="flex items-center gap-3">
              <UIcon name="i-heroicons-rectangle-stack" class="w-5 h-5 text-rose-600" />
              <span>Table: {{ guestTableName }}</span>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <UButton color="primary" @click="shareLink">Partager</UButton>
            <UButton variant="outline" color="neutral" @click="copyLink">Copier le lien</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
const props = defineProps<{ invitation: any; event?: any }>()

const guestName = computed(() => props.invitation?.guestName || props.invitation?.guest_name || 'Invité')
const guestTableName = computed(() => props.invitation?.guestTableName || props.invitation?.guest_table_name || '')
const eventTitle = computed(() => props.event?.title || props.invitation?.event?.title || 'Évènement')
const eventLocation = computed(() => props.event?.location || props.invitation?.event?.location || '')
const eventImage = computed(() => props.event?.imageUrl || props.invitation?.event?.imageUrl || '')
const heroImage = computed(() => eventImage.value || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=2000&q=80')

const eventStartsAt = computed(() => props.event?.startsAt || props.invitation?.event?.startsAt)
const eventEndsAt = computed(() => props.event?.endsAt || props.invitation?.event?.endsAt)
const eventDateText = computed(() => {
  const start = eventStartsAt.value ? new Date(eventStartsAt.value) : null
  const end = eventEndsAt.value ? new Date(eventEndsAt.value) : null
  if (!start) return ''
  const opts: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'short' }
  const startText = new Intl.DateTimeFormat(undefined, opts).format(start)
  const endText = end ? new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(end) : ''
  return end ? `${startText} – ${endText}` : startText
})

const copyLink = async () => {
  const url = location.href
  try {
    await navigator.clipboard.writeText(url)
    useToast().add({ title: 'Copié', description: 'Lien copié dans le presse‑papiers.', color: 'success' })
  } catch {
    useToast().add({ title: 'Erreur', description: 'Impossible de copier.', color: 'error' })
  }
}

const shareLink = async () => {
  const url = location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: eventTitle.value, url })
    } catch {}
  } else {
    await copyLink()
  }
}
</script>


