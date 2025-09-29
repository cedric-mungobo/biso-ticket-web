<template>
  <div class="space-y-4">
    <!-- En-tête avec bouton d'ajout -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Configuration des boissons
      </h3>
      <UButton
        @click="$emit('add-drink')"
        color="primary"
        size="sm"
        :disabled="loading"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Ajouter des boissons
      </UButton>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-16 w-full" />
      <USkeleton class="h-16 w-full" />
      <USkeleton class="h-16 w-2/3" />
    </div>

    <!-- Message si aucune boisson -->
    <div v-else-if="!drinks || drinks.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-wine" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h4 class="text-sm font-medium text-gray-900 mb-1">Aucune boisson configurée</h4>
      <p class="text-sm text-gray-500 mb-4">
        Ajoutez des boissons pour permettre aux invités de faire leur choix
      </p>
      <UButton
        @click="$emit('add-drink')"
        color="primary"
        size="sm"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Commencer la configuration
      </UButton>
    </div>

    <!-- Liste des boissons -->
    <div v-else class="space-y-3">
      <div
        v-for="drink in drinks"
        :key="drink.id || drink.name"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
      >
        <!-- Informations de la boisson -->
        <div class="flex items-center gap-3">
          <div
            :class="`p-2 rounded-lg bg-${DRINK_CATEGORIES[drink.category].color}-50`"
          >
            <UIcon
              :name="DRINK_CATEGORIES[drink.category].icon"
              :class="`w-5 h-5 text-${DRINK_CATEGORIES[drink.category].color}-600`"
            />
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-900">{{ drink.name }}</p>
            <p class="text-xs text-gray-500">
              {{ DRINK_CATEGORIES[drink.category].label }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <UButton
            @click="$emit('edit-drink', drink)"
            variant="ghost"
            color="primary"
            size="xs"
            :ui="{ base: 'min-h-[36px] min-w-[36px] p-1' }"
            title="Modifier"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </UButton>
          
          <UButton
            @click="$emit('delete-drink', drink)"
            variant="ghost"
            color="error"
            size="xs"
            :ui="{ base: 'min-h-[36px] min-w-[36px] p-1' }"
            title="Supprimer"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="drinks && drinks.length > 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(config, category) in DRINK_CATEGORIES"
          :key="category"
          class="text-center"
        >
          <div class="text-2xl font-bold text-gray-900">
            {{ getDrinksByCategory(category as DrinkCategory).length }}
          </div>
          <div class="text-xs text-gray-500">{{ config.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Drink, DrinkCategory } from '~/types/drinks'
import { DRINK_CATEGORIES } from '~/types/drinks'

interface Props {
  drinks: Drink[]
  loading?: boolean
}

interface Emits {
  (e: 'add-drink'): void
  (e: 'edit-drink', drink: Drink): void
  (e: 'delete-drink', drink: Drink): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Compter les boissons par catégorie
const getDrinksByCategory = (category: DrinkCategory): Drink[] => {
  return props.drinks.filter(drink => drink.category === category)
}
</script>
