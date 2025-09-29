<template>
  <div class="drink-selection-container">
    <!-- Titre de la section -->
    <div class="text-center mb-8">
      <h3 class="text-2xl font-serif font-bold mb-2" :style="{ color: titleColor }">
        Vos préférences de boissons
      </h3>
      <p class="text-sm opacity-80" :style="{ color: textColor }">
        Sélectionnez vos boissons préférées pour nous aider à mieux vous accueillir
      </p>
    </div>

    <!-- Liste des boissons disponibles -->
    <div v-if="availableDrinks.length > 0" class="space-y-4">
      <div
        v-for="drink in availableDrinks"
        :key="drink.name"
        class="drink-item"
        :class="{ 'selected': isSelected(drink.name) }"
        @click="toggleDrink(drink.name)"
      >
        <div class="flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer"
             :class="isSelected(drink.name) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'">
          
          <!-- Icône et nom de la boisson -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 :class="isSelected(drink.name) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'">
              <UIcon :name="getDrinkIcon(drink.category)" class="w-5 h-5" />
            </div>
            
            <div>
              <p class="font-medium" :style="{ color: isSelected(drink.name) ? titleColor : textColor }">
                {{ drink.name }}
              </p>
              <p class="text-xs opacity-70" :style="{ color: textColor }">
                {{ getDrinkCategoryLabel(drink.category) }}
              </p>
            </div>
          </div>

          <!-- Indicateur de sélection -->
          <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
               :class="isSelected(drink.name) ? 'border-primary-500 bg-primary-500' : 'border-gray-300'">
            <UIcon v-if="isSelected(drink.name)" name="i-heroicons-check" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <!-- Message d'information -->
      <div class="text-center mt-6">
        <p class="text-sm opacity-70" :style="{ color: textColor }">
          {{ selectedDrinks.length }} boisson{{ selectedDrinks.length > 1 ? 's' : '' }} sélectionnée{{ selectedDrinks.length > 1 ? 's' : '' }}
          <span v-if="selectedDrinks.length > 0"> • Maximum 5</span>
        </p>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-center gap-4 mt-8">
        <UButton
          v-if="hasChanges"
          @click="resetSelection"
          variant="outline"
          size="md"
          class="px-6"
        >
          Annuler
        </UButton>
        
        <UButton
          @click="saveChoices"
          :loading="saving"
          :disabled="selectedDrinks.length === 0"
          color="primary"
          size="md"
          class="px-8"
        >
          <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
          {{ saving ? 'Sauvegarde...' : 'Confirmer mes choix' }}
        </UButton>
      </div>
    </div>

    <!-- Message si aucune boisson disponible -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-beaker" class="w-16 h-16 mx-auto mb-4 opacity-50" :style="{ color: textColor }" />
      <p class="text-lg font-medium mb-2" :style="{ color: textColor }">
        Aucune boisson configurée
      </p>
      <p class="text-sm opacity-70" :style="{ color: textColor }">
        Les boissons seront bientôt disponibles
      </p>
    </div>

    <!-- Message de succès -->
    <div v-if="showSuccess" class="fixed top-4 right-4 z-50">
      <UAlert
        color="success"
        variant="soft"
        title="Choix sauvegardés"
        description="Vos préférences de boissons ont été enregistrées"
        @close="showSuccess = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Drink } from '~/types/drinks'
import { DRINK_CATEGORIES } from '~/types/drinks'

interface Props {
  invitationId: number
  availableDrinks: Drink[]
  titleColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleColor: '#794c44',
  textColor: '#794c44'
})

const { fetchInvitationDrinkChoices, saveInvitationDrinkChoices, validateDrinkChoices } = useInvitationDrinks()
const toast = useToast()

// État local
const selectedDrinks = ref<string[]>([])
const originalSelection = ref<string[]>([])
const saving = ref(false)
const showSuccess = ref(false)

// Charger les choix existants
onMounted(async () => {
  try {
    const choices = await fetchInvitationDrinkChoices(props.invitationId)
    selectedDrinks.value = choices.map(c => c.name)
    originalSelection.value = [...selectedDrinks.value]
  } catch (error) {
    console.error('Erreur lors du chargement des choix:', error)
  }
})

// Vérifier si une boisson est sélectionnée
const isSelected = (drinkName: string): boolean => {
  return selectedDrinks.value.includes(drinkName)
}

// Basculer la sélection d'une boisson
const toggleDrink = (drinkName: string) => {
  const index = selectedDrinks.value.indexOf(drinkName)
  
  if (index > -1) {
    // Désélectionner
    selectedDrinks.value.splice(index, 1)
  } else {
    // Sélectionner (max 5)
    if (selectedDrinks.value.length < 5) {
      selectedDrinks.value.push(drinkName)
    } else {
      toast.add({
        title: 'Limite atteinte',
        description: 'Vous ne pouvez sélectionner que 5 boissons maximum',
        color: 'warning'
      })
    }
  }
}

// Obtenir l'icône d'une catégorie de boisson
const getDrinkIcon = (category: string): string => {
  return DRINK_CATEGORIES[category as keyof typeof DRINK_CATEGORIES]?.icon || 'i-heroicons-question-mark-circle'
}

// Obtenir le label d'une catégorie de boisson
const getDrinkCategoryLabel = (category: string): string => {
  return DRINK_CATEGORIES[category as keyof typeof DRINK_CATEGORIES]?.label || 'Autre'
}

// Vérifier s'il y a des changements
const hasChanges = computed(() => {
  if (selectedDrinks.value.length !== originalSelection.value.length) return true
  
  return !selectedDrinks.value.every(drink => originalSelection.value.includes(drink))
})

// Réinitialiser la sélection
const resetSelection = () => {
  selectedDrinks.value = [...originalSelection.value]
}

// Sauvegarder les choix
const saveChoices = async () => {
  try {
    // Validation
    const errors = validateDrinkChoices(selectedDrinks.value.map(name => ({ name })))
    if (errors.length > 0) {
      toast.add({
        title: 'Erreur de validation',
        description: errors[0],
        color: 'error'
      })
      return
    }

    saving.value = true
    
    // Sauvegarder
    await saveInvitationDrinkChoices(props.invitationId, selectedDrinks.value.map(name => ({ name })))
    
    // Mettre à jour l'état
    originalSelection.value = [...selectedDrinks.value]
    
    // Afficher le succès
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.message || 'Impossible de sauvegarder vos choix',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
.drink-selection-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.drink-item {
  transition: all 0.2s ease;
}

.drink-item:hover {
  transform: translateY(-1px);
}

.drink-item.selected {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .drink-selection-container {
    padding: 1rem;
  }
}
</style>
