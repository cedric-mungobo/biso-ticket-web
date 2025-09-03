<template>
  <UForm :state="form" @submit.prevent="onSubmit" class="space-y-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="ticket-type" class="block text-sm font-medium text-gray-700 mb-1">Type du ticket</label>
        <UInput id="ticket-type" class="w-full" v-model="form.type" placeholder="Ex: VIP" required />
      </div>
      <div>
        <label for="ticket-price" class="block text-sm font-medium text-gray-700 mb-1">Prix</label>
        <UInput id="ticket-price" class="w-full" v-model.number="form.price" type="number" min="0" step="0.01" required />
      </div>
      <div>
        <label for="ticket-quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
        <UInput id="ticket-quantity" class="w-full" v-model.number="form.quantity" type="number" min="1" required />
      </div>
      <div class="relative z-[70]">
        <label for="ticket-devise" class="block text-sm font-medium text-gray-700 mb-1">Devise</label>
        <select
          id="ticket-devise"
          v-model="form.devise"
          class="w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
        >
          <option value="USD">USD</option>
          <option value="CDF">CDF</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-2">
      <UButton variant="ghost" color="neutral" @click="$emit('cancel')">Annuler</UButton>
      <UButton type="submit" :loading="submitting" color="primary">{{ submitLabel }}</UButton>
    </div>
  </UForm> 
</template>

<script setup lang="ts">
// @ts-nocheck
const props = defineProps<{
  modelValue?: any
  submitting?: boolean
  submitLabel?: string
}>()
const emit = defineEmits(['update:modelValue','submit','cancel'])

const form = reactive({
  type: props.modelValue?.type || '',
  price: props.modelValue?.price || 0,
  quantity: props.modelValue?.quantity || 1,
  devise: props.modelValue?.devise || 'USD'
})

watch(form, (v) => emit('update:modelValue', v), { deep: true })

const onSubmit = () => emit('submit', { ...form })
</script>
