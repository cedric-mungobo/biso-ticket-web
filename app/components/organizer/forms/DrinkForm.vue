<template>
  <div class="space-y-4">
    <!-- Formulaire pour ajouter une boisson -->
    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Ajouter une boisson</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nom de la boisson -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nom de la boisson *
          </label>
          <UInput
            v-model="newDrink.name"
            placeholder="Ex: Vin rouge, Jus d'orange..."
            :error="drinkErrors.name"
            @input="clearError('name')"
          />
          <p v-if="drinkErrors.name" class="mt-1 text-sm text-red-600">
            {{ drinkErrors.name }}
          </p>
        </div>

        <!-- Catégorie de la boisson -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            v-model="newDrink.category"
            @change="clearError('category')"
            class="rounded-lg border border-gray-300 px-3 py-2 w-full text-sm focus:border-primary-500 focus:ring-primary-500"
            :class="{ 'border-red-500': drinkErrors.category }"
          >
            <option value="" disabled>Sélectionner une catégorie</option>
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <p v-if="drinkErrors.category" class="mt-1 text-sm text-red-600">
            {{ drinkErrors.category }}
          </p>
        </div>
      </div>

      <!-- Bouton d'ajout -->
      <div class="mt-4 flex justify-end">
        <UButton
          @click="addDrink"
          :loading="adding"
          :disabled="!isFormValid"
          color="primary"
          size="sm"
        >
          <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          Ajouter
        </UButton>
      </div>
    </div>

    <!-- Liste des boissons ajoutées -->
    <div v-if="drinks.length > 0" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-900">Boissons configurées ({{ drinks.length }})</h3>
      
      <div class="space-y-2">
        <div
          v-for="(drink, index) in drinks"
          :key="index"
          class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="DRINK_CATEGORIES[drink.category].icon"
              :class="`w-5 h-5 text-${DRINK_CATEGORIES[drink.category].color}-500`"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">{{ drink.name }}</p>
              <p class="text-xs text-gray-500">
                {{ DRINK_CATEGORIES[drink.category].label }}
              </p>
            </div>
          </div>
          
          <UButton
            @click="removeDrink(index)"
            variant="ghost"
            color="error"
            size="xs"
            :ui="{ base: 'min-h-[32px] min-w-[32px] p-1' }"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Message si aucune boisson -->
    <div v-else class="text-center py-6 text-gray-500">
      <UIcon name="i-heroicons-wine" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p class="text-sm">Aucune boisson configurée</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Drink, DrinkFormData, DrinkCategory } from '~/types/drinks'
import { DRINK_CATEGORIES } from '~/types/drinks'

interface Props {
  modelValue: DrinkFormData[]
  submitting?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: DrinkFormData[]): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false
})

const emit = defineEmits<Emits>()

// Données réactives
const drinks = ref<DrinkFormData[]>([])
const newDrink = ref<DrinkFormData>({
  name: '',
  category: 'other'
})
const adding = ref(false)
const drinkErrors = ref<Record<string, string>>({})

// Options pour le select des catégories
const categoryOptions = computed(() => 
  Object.entries(DRINK_CATEGORIES).map(([value, config]) => ({
    label: config.label,
    value: value as DrinkCategory
  }))
)

// Validation du formulaire
const isFormValid = computed(() => {
  return newDrink.value.name.trim().length > 0 && newDrink.value.category
})

// Synchroniser avec le modelValue
watch(() => props.modelValue, (newValue) => {
  drinks.value = [...newValue]
}, { immediate: true })

// Émettre les changements
watch(drinks, (newDrinks) => {
  emit('update:modelValue', [...newDrinks])
}, { deep: true })

// Ajouter une boisson
const addDrink = async () => {
  // Validation
  const errors: Record<string, string> = {}
  
  if (!newDrink.value.name.trim()) {
    errors.name = 'Le nom de la boisson est requis'
  }
  
  if (!newDrink.value.category) {
    errors.category = 'La catégorie est requise'
  }
  
  if (Object.keys(errors).length > 0) {
    drinkErrors.value = errors
    return
  }

  // Vérifier si la boisson existe déjà
  const exists = drinks.value.some(d => 
    d.name.toLowerCase() === newDrink.value.name.toLowerCase()
  )
  
  if (exists) {
    drinkErrors.value = { name: 'Cette boisson existe déjà' }
    return
  }

  try {
    adding.value = true
    
    // Ajouter la boisson à la liste
    drinks.value.push({ ...newDrink.value })
    
    // Réinitialiser le formulaire
    newDrink.value = {
      name: '',
      category: 'other'
    }
    
    drinkErrors.value = {}
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la boisson:', error)
  } finally {
    adding.value = false
  }
}

// Supprimer une boisson
const removeDrink = (index: number) => {
  drinks.value.splice(index, 1)
}

// Effacer les erreurs
const clearError = (field: string) => {
  if (drinkErrors.value[field]) {
    delete drinkErrors.value[field]
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  drinks.value = []
  newDrink.value = {
    name: '',
    category: 'other'
  }
  drinkErrors.value = {}
}

// Exposer les méthodes pour le parent
defineExpose({
  resetForm
})
</script>
