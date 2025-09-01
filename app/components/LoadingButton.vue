<template>
  <UButton
    :disabled="loading || disabled"
    :loading="loading"
    :color="color"
    :variant="variant"
    :size="size"
    :class="buttonClass"
    @click="handleClick"
  >
    <template v-if="loading && loadingText">
      <LoadingSpinner 
        :size="16" 
        :color="spinnerColor" 
        :text="loadingText"
        class="mr-2"
      />
    </template>
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
  color?: 'primary' | 'secondary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loadingText?: string
  spinnerColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'white'
  buttonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  color: 'primary',
  variant: 'solid',
  size: 'md',
  loadingText: '',
  spinnerColor: 'white',
  buttonClass: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>
