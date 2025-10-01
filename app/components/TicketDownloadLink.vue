<template>
  <UButton
    :to="ticketUrl"
    :color="color"
    :variant="variant"
    :size="size"
    :class="buttonClass"
    :loading="loading"
    :disabled="!publicId"
  >
    <UIcon :name="icon" class="w-4 h-4 mr-2" />
    {{ label }}
  </UButton>
</template>

<script lang="ts" setup>
interface Props {
  publicId?: string
  label?: string
  color?: 'primary' | 'secondary' | 'neutral' | 'error' | 'success' | 'warning' | 'info'
  variant?: 'solid' | 'outline' | 'soft' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  buttonClass?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Voir le billet',
  color: 'primary',
  variant: 'solid',
  size: 'sm',
  icon: 'i-heroicons-ticket',
  loading: false
})

const ticketUrl = computed(() => {
  if (!props.publicId) return '#'
  return `/billet/${props.publicId}`
})
</script>
