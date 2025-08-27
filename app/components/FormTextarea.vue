<template>
  <div class="form-field">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="[
        'w-full px-3 py-2 border rounded-md shadow-sm transition-colors resize-none',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
        'hover:border-gray-400'
      ]"
      v-bind="$attrs"
    ></textarea>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    
    <p v-else-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </p>
    
    <div v-if="showCharacterCount" class="mt-1 text-right text-xs text-gray-500">
      {{ (modelValue as string).length }}{{ maxLength ? ` / ${maxLength}` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  id?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  rows?: number
  maxLength?: string | number
  showCharacterCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  rows: 4,
  showCharacterCount: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.form-field {
  @apply w-full;
}
</style>
