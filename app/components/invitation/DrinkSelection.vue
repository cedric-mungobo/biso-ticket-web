<template>
    <div class="max-w-md mx-auto px-4 py-6 sm:px-6">
        <!-- Titre de la section -->
        <div class="text-center mb-4">
            <h3 class="text-lg font-serif mb-2" :style="{ color: titleColor }">
                Boissons
            </h3>
            <div class="space-y-1">
                <p class="text-xs opacity-70" :style="{ color: textColor }">
                    Choisissez vos boissons (max 5)
                </p>
            </div>
        </div>

        <!-- Grille de checkboxes -->
        <div v-if="availableDrinks.length > 0" class="space-y-4">
            <!-- Grille 2 colonnes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label
                    v-for="drink in availableDrinks"
                    :key="drink.name"
                    class="flex items-center gap-2 p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-px"
                    :class="[
                        isSelected(drink.name)
                            ? 'shadow-sm -translate-y-px border-opacity-100'
                            : 'hover:shadow-xs border-opacity-30',
                    ]"
                    :style="{
                        borderColor: titleColor,
                        backgroundColor: isSelected(drink.name)
                            ? titleColor + '10'
                            : 'transparent',
                    }"
                >
                    <input
                        :checked="isSelected(drink.name)"
                        @change="toggleDrink(drink.name)"
                        type="checkbox"
                        class="rounded border"
                        :style="{ borderColor: titleColor, color: titleColor }"
                        :disabled="
                            !isSelected(drink.name) &&
                            selectedDrinks.length >= 5
                        "
                    />
                    <div class="flex-1">
                        <p
                            class="text-sm font-medium leading-tight"
                            :style="{
                                color: isSelected(drink.name)
                                    ? titleColor
                                    : textColor,
                            }"
                        >
                            {{ drink.name }}
                        </p>
                        <p
                            class="text-xs opacity-60 leading-tight mt-0.5"
                            :style="{ color: textColor }"
                        >
                            {{ getDrinkCategoryLabel(drink.category) }}
                        </p>
                    </div>
                </label>
            </div>

            <!-- Régime alimentaire simplifié -->
            <p class="text-xs leading-relaxed opacity-60">
                Cochez si vous avez un régime sans sel
            </p>
            <div
                class="mt-6 p-3 border-l-2"
                :style="{ borderLeftColor: titleColor + '30' }"
            >
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        v-model="hasSaltFreeDiet"
                        type="checkbox"
                        class="rounded border"
                        :style="{ borderColor: titleColor, color: titleColor }"
                    />
                    <span
                        class="text-sm font-medium"
                        :style="{ color: textColor }"
                    >
                        Régime sans sel
                    </span>
                </label>
            </div>

            <!-- Message d'information -->
            <div class="text-center mt-4">
                <p class="text-xs opacity-60" :style="{ color: textColor }">
                    {{ selectedDrinks.length }} boisson{{
                        selectedDrinks.length > 1 ? "s" : ""
                    }}
                    sélectionnée{{ selectedDrinks.length > 1 ? "s" : "" }}
                </p>
            </div>

            <!-- Boutons d'action simplifiés -->
            <div class="flex gap-2 mt-6">
                <UButton
                    v-if="hasChanges"
                    @click="resetSelection"
                    variant="outline"
                    size="sm"
                    class="flex-1"
                >
                    Annuler
                </UButton>

                <UButton
                    @click="saveChoices"
                    :loading="saving"
                    :disabled="selectedDrinks.length === 0"
                    color="primary"
                    size="sm"
                    class="flex-1"
                >
                    {{ saving ? "Sauvegarde..." : "Confirmer mon choix" }}
                </UButton>
            </div>
        </div>

        <!-- Message si aucune boisson disponible -->
        <div v-else class="text-center py-8">
            <p class="text-sm opacity-60" :style="{ color: textColor }">
                Aucune boisson disponible
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Drink } from "~/types/drinks";
import { DRINK_CATEGORIES } from "~/types/drinks";

interface Props {
    invitationId: number;
    availableDrinks: Drink[];
    titleColor?: string;
    textColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
    titleColor: "#794c44",
    textColor: "#794c44",
});

const { invitationId, availableDrinks, titleColor, textColor } = toRefs(props);

const {
    fetchInvitationDrinkChoices,
    saveInvitationDrinkChoices,
    validateDrinkChoices,
} = useInvitationDrinks();

// État local
const selectedDrinks = ref<string[]>([]);
const originalSelection = ref<string[]>([]);
const hasSaltFreeDiet = ref(false);
const originalSaltFreeDiet = ref(false);
const saving = ref(false);

// Charger les choix existants
onMounted(async () => {
    try {
        const choices = await fetchInvitationDrinkChoices(invitationId.value);
        selectedDrinks.value = choices.map((c) => c.name);
        originalSelection.value = [...selectedDrinks.value];
        hasSaltFreeDiet.value = false;
        originalSaltFreeDiet.value = false;
    } catch (error) {
        // Valeurs par défaut en cas d'erreur
        selectedDrinks.value = [];
        originalSelection.value = [];
        hasSaltFreeDiet.value = false;
        originalSaltFreeDiet.value = false;
    }
});

// Vérifier si une boisson est sélectionnée
const isSelected = (drinkName: string): boolean => {
    return selectedDrinks.value.includes(drinkName);
};

// Basculer la sélection d'une boisson
const toggleDrink = (drinkName: string) => {
    const index = selectedDrinks.value.indexOf(drinkName);

    if (index > -1) {
        // Désélectionner
        selectedDrinks.value.splice(index, 1);
    } else {
        // Sélectionner (max 5)
        if (selectedDrinks.value.length < 5) {
            selectedDrinks.value.push(drinkName);
        }
    }
};

// Obtenir le label d'une catégorie de boisson
const getDrinkCategoryLabel = (category: string): string => {
    return (
        DRINK_CATEGORIES[category as keyof typeof DRINK_CATEGORIES]?.label ||
        "Autre"
    );
};

// Vérifier s'il y a des changements
const hasChanges = computed(() => {
    return (
        selectedDrinks.value.length !== originalSelection.value.length ||
        !selectedDrinks.value.every((drink) =>
            originalSelection.value.includes(drink),
        ) ||
        hasSaltFreeDiet.value !== originalSaltFreeDiet.value
    );
});

// Réinitialiser la sélection
const resetSelection = () => {
    selectedDrinks.value = [...originalSelection.value];
    hasSaltFreeDiet.value = originalSaltFreeDiet.value;
};

// Sauvegarder les choix
const saveChoices = async () => {
    try {
        // Validation
        const errors = validateDrinkChoices(
            selectedDrinks.value.map((name) => ({ name })),
        );
        if (errors.length > 0) {
            useToast().add({
                title: "Erreur",
                description: errors[0],
                color: "error",
            });
            return;
        }

        saving.value = true;

        // Sauvegarder les boissons et le régime
        await saveInvitationDrinkChoices(
            invitationId.value,
            selectedDrinks.value.map((name) => ({ name })),
            hasSaltFreeDiet.value,
        );

        // Mettre à jour l'état
        originalSelection.value = [...selectedDrinks.value];
        originalSaltFreeDiet.value = hasSaltFreeDiet.value;

        // Afficher le succès
        useAppToast().showSuccess("Succès", "Vos choix ont été enregistrés");
    } catch (error: any) {
        useAppToast().showError(
            "Erreur",
            error.message || "Impossible de sauvegarder",
        );
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped>
.drink-selection-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
}

/* Grille responsive */
.grid {
    display: grid;
    gap: 0.75rem;
}

.grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
}

/* Style des checkboxes */
.drink-checkbox {
    transition: all 0.2s ease;
}

.drink-checkbox:hover {
    transform: translateY(-1px);
}

/* Responsive pour mobile */
@media (max-width: 480px) {
    .drink-selection-container {
        padding: 1rem 0.75rem;
    }

    .grid-cols-2 {
        grid-template-columns: 1fr; /* 1 colonne sur très petits écrans */
        gap: 0.5rem;
    }

    .drink-checkbox {
        padding: 0.75rem !important;
    }
}

@media (min-width: 481px) and (max-width: 640px) {
    .grid-cols-2 {
        gap: 0.6rem;
    }

    .drink-checkbox {
        padding: 0.875rem !important;
    }
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

/* Responsive pour mobile */
@media (max-width: 640px) {
    .drink-selection-container {
        padding: 1rem 0.75rem; /* Réduction du padding */
    }

    /* Réduire les paddings des cartes sur mobile */
    .drink-item .p-4 {
        padding: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Réduire les tailles des icônes sur mobile */
    .drink-item .w-10 {
        width: 2rem !important; /* 32px au lieu de 40px */
    }

    .drink-item .h-10 {
        height: 2rem !important; /* 32px au lieu de 40px */
    }

    .drink-item .w-5 {
        width: 1rem !important; /* 16px au lieu de 20px */
    }

    .drink-item .h-5 {
        height: 1rem !important; /* 16px au lieu de 20px */
    }

    /* Réduire le cercle de sélection */
    .drink-item .w-6 {
        width: 1.25rem !important; /* 20px au lieu de 24px */
    }

    .drink-item .h-6 {
        height: 1.25rem !important; /* 20px au lieu de 24px */
    }

    .drink-item .w-4 {
        width: 0.875rem !important; /* 14px au lieu de 16px */
    }

    .drink-item .h-4 {
        height: 0.875rem !important; /* 14px au lieu de 16px */
    }

    /* Réduire l'espacement entre les éléments */
    .drink-item .gap-3 {
        gap: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Réduire la taille du texte */
    .drink-item .text-xs {
        font-size: 0.625rem !important; /* 10px au lieu de 12px */
    }

    /* Réduire les marges entre les cartes */
    .space-y-4 > * + * {
        margin-top: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Optimiser la section régime alimentaire */
    .mt-8 {
        margin-top: 1.5rem !important; /* 24px au lieu de 32px */
    }

    .p-4 {
        padding: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Adapter le checkbox */
    .w-5 {
        width: 1.125rem !important; /* 18px au lieu de 20px */
    }

    .h-5 {
        height: 1.125rem !important; /* 18px au lieu de 20px */
    }

    .gap-3 {
        gap: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Optimiser le texte sur mobile */
    .text-base {
        font-size: 0.875rem !important; /* 14px au lieu de 16px */
    }

    .ml-8 {
        margin-left: 2rem !important; /* 32px au lieu de 36px - ajusté pour le checkbox plus petit */
    }

    /* Optimiser les boutons */
    .px-6 {
        padding-left: 1rem !important; /* 16px au lieu de 24px */
        padding-right: 1rem !important;
    }

    .px-8 {
        padding-left: 1.25rem !important; /* 20px au lieu de 32px */
        padding-right: 1.25rem !important;
    }

    .gap-4 {
        gap: 0.75rem !important; /* 12px au lieu de 16px */
    }

    /* Réduire les marges des sections */
    .mb-8 {
        margin-bottom: 1.5rem !important; /* 24px au lieu de 32px */
    }

    .mt-6 {
        margin-top: 1.25rem !important; /* 20px au lieu de 24px */
    }

    .mt-8 {
        margin-top: 1.5rem !important; /* 24px au lieu de 32px */
    }
}
</style>
