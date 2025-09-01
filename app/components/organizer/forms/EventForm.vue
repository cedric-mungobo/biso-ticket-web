<template>
  <UForm :state="form" @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label for="event-title" class="block text-sm font-medium text-gray-700 mb-1">Titre de l'événement</label>
      <UInput id="event-title" v-model="form.title" placeholder="Titre de l'événement" required />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="event-location" class="block text-sm font-medium text-gray-700 mb-1">Lieu de l'événement</label>
        <UInput id="event-location" v-model="form.location" />
      </div>
      <div>
        <label for="event-starts-at" class="block text-sm font-medium text-gray-700 mb-1">Date et heure de début</label>
        <UInput id="event-starts-at" v-model="form.starts_at" type="datetime-local" required />
      </div>
    </div>

    <div>
      <label for="event-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
      <UInput id="event-tags" v-model="tagsInput" placeholder="ex: music, live" />
    </div>

    <div class="flex items-center gap-3">
      <div class="flex-1 z-[70]">
        <label for="event-status" class="block text-sm font-medium text-gray-700 mb-1">Statut de l'événement</label>
        <select
          id="event-status"
          v-model="form.status"
          class="w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
        >
          <option value="draft">Brouillon</option>
          <option value="active">Actif</option>
          <option value="ended">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>
      <div>
        <label for="event-public" class="block text-sm font-medium text-gray-700 mb-1">Événement public</label>
        <UToggle id="event-public" v-model="form.is_public" />
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <UButton variant="ghost" color="neutral" @click="$emit('cancel')">Annuler</UButton>
      <UButton type="submit" :loading="submitting" color="primary">Enregistrer</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
// @ts-nocheck
const props = defineProps<{
  modelValue?: any
  submitting?: boolean
}>()
const emit = defineEmits(['update:modelValue','submit','cancel'])

const form = reactive({
  title: props.modelValue?.title || props.modelValue?.name || '',
  location: props.modelValue?.location || '',
  starts_at: props.modelValue?.starts_at || (props.modelValue?.date_time ? new Date(props.modelValue.date_time).toISOString().slice(0,16) : ''),
  status: props.modelValue?.status || 'draft',
  is_public: props.modelValue?.is_public ?? true,
  settings: {
    tags: props.modelValue?.settings?.tags || []
  }
})

const tagsInput = ref((form.settings.tags || []).join(', '))
watch(tagsInput, (v) => {
  form.settings.tags = v.split(',').map(s => s.trim()).filter(Boolean)
})

watch(form, (v) => emit('update:modelValue', v), { deep: true })

const onSubmit = () => emit('submit', { ...form })
</script>
