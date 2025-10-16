<template>
    <div v-if="invitation" class="rsvp-status-section py-8 px-4">
        <!-- Bouton d'action pour annuler si présence confirmée -->
        <div
            v-if="invitation.status === 'confirmed'"
            class="text-center space-y-4"
        >
            <p class="text-gray-600 mb-4">
                Merci pour votre confirmation ! Si vous ne pouvez finalement pas
                être présent :
            </p>

            <div class="flex justify-center">
                <!-- Bouton "Je ne serais pas disponible" -->
                <UButton
                    @click="cancelPresence"
                    :loading="isUpdating"
                    :disabled="isUpdating"
                    color="error"
                    size="lg"
                    class="px-6"
                >
                    <XCircle class="w-5 h-5 mr-2" />
                    {{
                        isUpdating
                            ? "En cours..."
                            : "Je ne serais pas disponible"
                    }}
                </UButton>
            </div>
        </div>

        <!-- Bouton d'action pour réactiver si annulé -->
        <div
            v-else-if="invitation.status === 'cancelled'"
            class="text-center space-y-4"
        >
            <p class="text-gray-600 mb-4">
                Vous avez indiqué ne pas être disponible. Si vous changez d'avis
                :
            </p>

            <div class="flex justify-center">
                <!-- Bouton "Je serai présent" -->
                <UButton
                    @click="confirmPresence"
                    :loading="isUpdating"
                    :disabled="isUpdating"
                    color="success"
                    size="lg"
                    variant="solid"
                    class="px-6 py-3 font-semibold flex items-center justify-center"
                >
                    <CheckCircle class="w-5 h-5 mr-2" />
                    {{ isUpdating ? "En cours..." : "Je serai présent(e)" }}
                </UButton>
            </div>
        </div>

        <!-- Message si en attente (pendant l'auto-confirmation) -->
        <div v-else-if="isUpdating" class="text-center">
            <div
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border-yellow-200"
            >
                <Clock class="w-4 h-4 mr-2" />
                Confirmation en cours...
            </div>
        </div>

        <!-- Message et boutons si l'auto-confirmation a échoué -->
        <div
            v-else-if="hasAutoConfirmError && invitation.status === 'pending'"
            class="text-center space-y-4"
        >
            <p class="text-gray-600 mb-4">
                Veuillez confirmer votre présence à cet événement :
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <!-- Bouton "Je serai présent" -->
                <UButton
                    @click="confirmPresence"
                    :loading="isUpdating"
                    :disabled="isUpdating"
                    color="success"
                    size="lg"
                    variant="solid"
                    class="px-6 py-3 font-semibold flex items-center justify-center"
                >
                    <CheckCircle class="w-5 h-5 mr-2" />
                    {{ isUpdating ? "En cours..." : "Je serai présent(e)" }}
                </UButton>

                <!-- Bouton "Je ne serais pas disponible" -->
                <UButton
                    @click="cancelPresence"
                    :loading="isUpdating"
                    :disabled="isUpdating"
                    color="error"
                    size="lg"
                    variant="outline"
                    class="px-6"
                >
                    <XCircle class="w-5 h-5 mr-2" />
                    {{
                        isUpdating
                            ? "En cours..."
                            : "Je ne serais pas disponible"
                    }}
                </UButton>
            </div>
        </div>

        <!-- Message par défaut si statut inconnu -->
        <div v-else class="text-center">
            <div
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border-gray-200"
            >
                <Clock class="w-4 h-4 mr-2" />
                Préparation de votre réponse...
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CheckCircle, XCircle, Clock, Check, X } from "lucide-vue-next";
import { useInvitations } from "~/composables/useInvitations";

const props = defineProps<{
    invitation: any;
    eventId?: number;
}>();

const { updateInvitation, confirmInvitation, cancelInvitation } =
    useInvitations();
const toast = useToast();
const appToast = useAppToast();

const isUpdating = ref(false);
const hasAutoConfirmed = ref(false);
const hasAutoConfirmError = ref(false);

// Computed properties pour le statut
const currentStatusMessage = computed(() => {
    switch (props.invitation?.status) {
        case "pending":
            return "En attente de réponse";
        case "sent":
            return "Invitation envoyée";
        case "viewed":
            return "Invitation vue";
        case "confirmed":
            return "Présence confirmée";
        case "cancelled":
            return "Absence confirmée";
        default:
            return null;
    }
});

const statusBadgeClass = computed(() => {
    switch (props.invitation?.status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "sent":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "viewed":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "confirmed":
            return "bg-green-100 text-green-800 border-green-200";
        case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
});

const statusIcon = computed(() => {
    switch (props.invitation?.status) {
        case "pending":
            return Clock;
        case "sent":
            return Clock;
        case "confirmed":
            return Check;
        case "cancelled":
            return X;
        default:
            return Clock;
    }
});

// Auto-confirmation au montage du composant
onMounted(async () => {
    // Logger le statut actuel pour debug
    console.log("🔍 RSVP Status - Statut actuel:", {
        status: props.invitation?.status,
        isFirstVisit: props.invitation._isFirstVisit,
        hasAutoConfirmed: hasAutoConfirmed.value,
        invitationId: props.invitation?.id,
    });

    // Auto-confirmer si :
    // 1. Le statut est 'pending' ou 'viewed'
    // 2. Ça n'a pas déjà été fait
    // 3. Soit c'est la première visite (_isFirstVisit), soit on tente l'auto-confirmation après 2 secondes
    if (
        (props.invitation?.status === "pending" ||
            props.invitation?.status === "viewed") &&
        !hasAutoConfirmed.value
    ) {
        console.log("✅ Conditions d'auto-confirmation remplies");

        // Si c'est la première visite, auto-confirmer immédiatement
        if (props.invitation._isFirstVisit) {
            console.log(
                "🎉 Première visite détectée, auto-confirmation immédiate",
            );
            await autoConfirmPresence();
        } else {
            // Sinon, attendre un peu pour montrer l'interface puis auto-confirmer
            console.log(
                "⏰ Pas première visite, planification auto-confirmation après délai",
            );
            const timer = setTimeout(async () => {
                console.log("⏰ Auto-confirmation après délai");
                await autoConfirmPresence();
            }, 2000);

            // Nettoyer le timer si le composant est démonté
            onUnmounted(() => {
                clearTimeout(timer);
            });
        }
    } else {
        console.log("❌ Conditions d'auto-confirmation non remplies:", {
            status: props.invitation?.status,
            hasAutoConfirmed: hasAutoConfirmed.value,
            isFirstVisit: props.invitation._isFirstVisit,
        });
    }
});

// Fonction pour confirmer automatiquement la présence
const autoConfirmPresence = async () => {
    if (!props.invitation?.token || hasAutoConfirmed.value) return;

    hasAutoConfirmed.value = true;
    isUpdating.value = true;
    hasAutoConfirmError.value = false;

    try {
        // Utiliser l'endpoint public de confirmation
        const updatedInvitation = await confirmInvitation(
            props.invitation.token,
        );

        // Mettre à jour les données locales
        Object.assign(props.invitation, updatedInvitation);

        appToast.showSuccess(
            "Bienvenue ! Votre présence a été automatiquement confirmée.",
        );
    } catch (error: any) {
        console.error("Erreur lors de l'auto-confirmation:", error);
        hasAutoConfirmError.value = true;

        // Afficher une toast pour informer l'utilisateur qu'il peut confirmer manuellement
        appToast.showInfo("Veuillez confirmer votre présence manuellement.");

        if (process.dev) {
            console.error("Détail de l'erreur:", error);
        }
    } finally {
        isUpdating.value = false;
    }
};

// Fonctions pour mettre à jour le statut manuellement
const confirmPresence = async () => {
    if (!props.invitation?.token) return;

    isUpdating.value = true;
    try {
        // Utiliser l'endpoint public de confirmation
        const updatedInvitation = await confirmInvitation(
            props.invitation.token,
        );

        // Mettre à jour les données locales
        Object.assign(props.invitation, updatedInvitation);

        appToast.showSuccess("Votre présence a bien été confirmée !");
    } catch (error: any) {
        console.error("Erreur lors de la confirmation:", error);
        appToast.showError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        isUpdating.value = false;
    }
};

const cancelPresence = async () => {
    if (!props.invitation?.token) return;

    isUpdating.value = true;
    try {
        // Utiliser l'endpoint public d'annulation
        const updatedInvitation = await cancelInvitation(
            props.invitation.token,
        );

        // Mettre à jour les données locales
        Object.assign(props.invitation, updatedInvitation);

        appToast.showSuccess("Votre absence a bien été enregistrée.");
    } catch (error: any) {
        console.error("Erreur lors de l'annulation:", error);
        appToast.showError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        isUpdating.value = false;
    }
};
</script>

<style scoped>
.rsvp-status-section {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin: 2rem 0;
}

@media (max-width: 640px) {
    .rsvp-status-section {
        margin: 1rem 0;
        padding: 1.5rem 1rem;
    }
}
</style>
