<template>
  <footer class="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-12 px-4">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <h3 class="text-2xl font-serif font-bold">
        {{ title }}
      </h3>
      <p class="opacity-90 max-w-2xl mx-auto">
        {{ description }}
      </p>
      <div class="flex items-center justify-center gap-3">
        <UButton 
          v-for="button in buttons" 
          :key="button.text"
          :color="button.color" 
          :variant="button.variant"
          :to="button.to"
          :href="button.href"
          :target="button.target"
          class="text-white"
        >
          {{ button.text }}
        </UButton>
      </div>
      <p class="text-sm opacity-75">
        © {{ currentYear }} {{ companyName }}. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Button {
  text: string
  color?: 'primary' | 'secondary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
  variant?: 'link' | 'outline' | 'solid' | 'soft' | 'subtle' | 'ghost'
  to?: string
  href?: string
  target?: string
}

interface Props {
  title?: string
  description?: string
  buttons?: Button[]
  companyName?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Organisez votre mariage avec Biso Ticket',
  description: 'Créez des invitations de mariage élégantes, gérez vos invités et suivez les confirmations en temps réel.',
  buttons: () => [
    {
      text: 'Organiser mon mariage',
      color: 'secondary',
      variant: 'solid',
      to: '/organisateur'
    },
    {
      text: 'Nous contacter',
      color: 'neutral',
      variant: 'solid',
      to: '/contact'
    }
  ],
  companyName: 'Biso Ticket'
})

const currentYear = computed(() => new Date().getFullYear())
</script>
