<template>
    <OrganizerNavigation>
        <!-- Loading Overlay pour les actions importantes -->
        <LoadingOverlay
            :show="templateSubmitting || importSubmitting || buySubmitting"
            :title="
                templateSubmitting
                    ? 'Sélection du template...'
                    : importSubmitting
                      ? 'Importation des invitations...'
                      : 'Achat de crédits...'
            "
            :description="
                templateSubmitting
                    ? 'Application du template sélectionné...'
                    : importSubmitting
                      ? 'Traitement de vos invitations...'
                      : 'Finalisation de votre achat...'
            "
            variant="branded"
            :size="56"
        />

        <div class="container mx-auto px-2 sm:px-6 lg:px-8">
            <div class="mb-6">
                <NuxtLink
                    :to="backUrl"
                    class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3"
                >
                    <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Retour à l'évènement
                </NuxtLink>

                <div class="">
                    <div
                        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                    >
                        <div
                            v-for="card in actionCards"
                            :key="card.id"
                            class="w-full border rounded-2xl border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                            @click="card.action"
                        >
                            <div class="p-2">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="flex items-center justify-center h-12 w-12 rounded-lg"
                                        :class="`${card.bgColor} group-hover:${card.hoverBgColor} transition-colors flex-shrink-0`"
                                    >
                                        <UIcon
                                            :name="card.icon"
                                            class="w-6 h-6"
                                            :class="card.iconColor"
                                        />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3
                                            class="text-sm font-medium text-gray-900 mb-1"
                                        >
                                            {{ card.title }}
                                        </h3>
                                        <p class="text-xs text-gray-500">
                                            {{ card.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h1 class="text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
                List d'invitatées
            </h1>
            <div
                class="rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4"
            >
                <div v-if="pending" class="space-y-2">
                    <USkeleton class="h-6 w-1/2" />
                    <USkeleton class="h-10 w-full" />
                </div>
                <div v-else>
                    <!-- Filtres - Mobile: vertical, Desktop: horizontal -->
                    <div class="space-y-3 sm:space-y-0">
                        <!-- Filtres de statut et boisson -->
                        <div class="flex flex-row items-center gap-2 flex-wrap">
                            <div class="flex items-center gap-2 min-w-0">
                                <label
                                    for="status"
                                    class="text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                                    >Statut</label
                                >
                                <select
                                    id="status"
                                    v-model="statusFilter"
                                    class="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm focus:border-primary-500 focus:ring-primary-500 w-24 sm:w-auto min-w-0"
                                >
                                    <option value="all">Tous</option>
                                    <option value="pending">En attente</option>
                                    <option value="sent">Envoyé</option>
                                    <option value="viewed">Consulté</option>
                                    <option value="confirmed">Confirmé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-2 min-w-0">
                                <label
                                    for="drink"
                                    class="text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                                >
                                    Boisson
                                    <span
                                        v-if="drinks.length > 0"
                                        class="text-gray-500"
                                        >({{ drinks.length }})</span
                                    >
                                </label>
                                <select
                                    id="drink"
                                    v-model="drinkFilter"
                                    class="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm focus:border-primary-500 focus:ring-primary-500 w-32 sm:w-auto min-w-0"
                                    :disabled="drinks.length === 0"
                                >
                                    <option value="all">Toutes</option>
                                    <option
                                        v-if="drinks.length === 0"
                                        value="all"
                                        disabled
                                    >
                                        Aucune boisson configurée
                                    </option>
                                    <option
                                        v-for="drink in drinks"
                                        :key="drink.id || drink.name"
                                        :value="drink.name"
                                    >
                                        {{ drink.name }}
                                    </option>
                                </select>
                            </div>
                            <!-- Barre de recherche - visible uniquement sur desktop -->
                            <div
                                class="hidden sm:flex items-center gap-2 flex-1 min-w-0"
                            >
                                <label
                                    for="search"
                                    class="text-sm text-gray-700 whitespace-nowrap"
                                    >Recherche</label
                                >
                                <input
                                    id="search"
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Nom, email..."
                                    class="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:ring-primary-500 flex-1 min-w-0"
                                />
                            </div>
                        </div>

                        <!-- Barre de recherche - visible uniquement sur mobile -->
                        <div class="sm:hidden">
                            <div class="flex items-center gap-2">
                                <label
                                    for="search-mobile"
                                    class="text-xs text-gray-700 whitespace-nowrap"
                                    >Recherche</label
                                >
                                <input
                                    id="search-mobile"
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Nom, email..."
                                    class="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-primary-500 focus:ring-primary-500 flex-1 min-w-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="filtered.length === 0"
                        class="text-sm text-gray-500"
                    >
                        Aucun invité.
                    </div>
                    <div v-else class="overflow-auto">
                        <table class="min-w-full text-sm">
                            <thead>
                                <tr class="text-left text-gray-600 border-b">
                                    <th class="py-2 pr-4">Nom</th>

                                    <th class="py-2 md:pr-4 pr-1">Table</th>
                                    <th class="py-2 md:pr-4 pr-1">Statut</th>
                                    <th class="py-2 md:pr-4 pr-1">Régime</th>
                                    <th class="py-2 md:pr-4 pr-1">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="inv in filtered"
                                    :key="inv.id"
                                    class="border-b last:border-0"
                                    :class="
                                        isConfirmed(inv.status)
                                            ? 'text-primary-600'
                                            : ''
                                    "
                                >
                                    <td class="py-2 pr-4">
                                        {{ inv.guestName || "—" }}
                                    </td>

                                    <td class="py-2 md:pr-4 pr-1">
                                        {{ inv.guestTableName || "—" }}
                                    </td>
                                    <td class="py-2 md:pr-4 pr-1">
                                        <!-- Mobile: point coloré -->
                                        <div
                                            class="sm:hidden flex items-center"
                                        >
                                            <div
                                                class="w-3 h-3 rounded-full mr-2"
                                                :class="{
                                                    'bg-amber-500':
                                                        inv.status ===
                                                        'pending',
                                                    'bg-blue-500':
                                                        inv.status === 'sent',
                                                    'bg-purple-500':
                                                        inv.status === 'viewed',
                                                    'bg-green-500':
                                                        inv.status ===
                                                        'confirmed',
                                                    'bg-red-500':
                                                        inv.status ===
                                                        'cancelled',
                                                    'bg-gray-400': !inv.status,
                                                }"
                                            ></div>
                                        </div>
                                        <!-- Desktop: texte complet -->
                                        <div
                                            class="hidden sm:block capitalize"
                                            :class="{
                                                'text-primary-600 font-medium':
                                                    isConfirmed(inv.status),
                                            }"
                                        >
                                            {{ statusLabel(inv.status) }}
                                        </div>
                                    </td>
                                    <td class="py-2 md:pr-4 pr-1">
                                        <!-- Régime sans sel -->
                                        <div
                                            v-if="inv.hasSaltFreeDiet"
                                            class="flex items-center"
                                        >
                                            <span
                                                class="text-amber-600 text-xs font-medium"
                                            >
                                                🧂 Sans sel
                                            </span>
                                        </div>
                                        <div
                                            v-else
                                            class="text-gray-400 text-xs"
                                        >
                                            —
                                        </div>
                                    </td>
                                    <td class="py-2 md:pr-4 pr-1">
                                        <div class="flex items-center gap-1">
                                            <!-- Mobile: native icon buttons -->
                                            <div
                                                class="sm:hidden flex items-center"
                                            >
                                                <button
                                                    type="button"
                                                    class="p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    aria-label="Voir"
                                                    @click="openView(inv)"
                                                >
                                                    <svg
                                                        class="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="p-0.5 text-amber-600 hover:text-amber-700 focus:outline-none"
                                                    aria-label="Modifier"
                                                    @click="openEditGuest(inv)"
                                                >
                                                    <svg
                                                        class="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="p-0.5 text-red-600 hover:text-red-700 focus:outline-none"
                                                    aria-label="Supprimer"
                                                    @click="
                                                        openDeleteGuest(inv)
                                                    "
                                                >
                                                    <svg
                                                        class="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                                <UDropdownMenu
                                                    :items="shareItems(inv)"
                                                    :content="{
                                                        align: 'end',
                                                        side: 'bottom',
                                                        sideOffset: 8,
                                                    }"
                                                    :ui="{ content: 'w-48' }"
                                                >
                                                    <button
                                                        type="button"
                                                        class="flex items-center gap-0.5 px-1 py-0.5 text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-50"
                                                        aria-label="Envoyer"
                                                        :disabled="
                                                            sendingIds.has(
                                                                inv.id,
                                                            )
                                                        "
                                                    >
                                                        <svg
                                                            v-if="
                                                                !sendingIds.has(
                                                                    inv.id,
                                                                )
                                                            "
                                                            class="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                            />
                                                        </svg>
                                                        <svg
                                                            v-else
                                                            class="w-3 h-3 animate-spin"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                class="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                stroke-width="4"
                                                            ></circle>
                                                            <path
                                                                class="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        <span
                                                            class="text-[10px] leading-none"
                                                            >Envoyer</span
                                                        >
                                                    </button>
                                                </UDropdownMenu>
                                            </div>

                                            <!-- Desktop: buttons with tooltips -->
                                            <div
                                                class="hidden sm:flex items-center gap-1"
                                            >
                                                <UTooltip text="Voir">
                                                    <UButton
                                                        size="xs"
                                                        variant="ghost"
                                                        color="neutral"
                                                        aria-label="Voir"
                                                        @click="openView(inv)"
                                                    >
                                                        <UIcon
                                                            name="i-heroicons-eye"
                                                            class="w-4 h-4"
                                                        />
                                                    </UButton>
                                                </UTooltip>
                                                <UTooltip text="Modifier">
                                                    <UButton
                                                        size="xs"
                                                        variant="ghost"
                                                        color="warning"
                                                        aria-label="Modifier"
                                                        @click="
                                                            openEditGuest(inv)
                                                        "
                                                    >
                                                        <UIcon
                                                            name="i-heroicons-pencil"
                                                            class="w-4 h-4"
                                                        />
                                                    </UButton>
                                                </UTooltip>
                                                <UTooltip text="Supprimer">
                                                    <UButton
                                                        size="xs"
                                                        variant="ghost"
                                                        color="red"
                                                        aria-label="Supprimer"
                                                        @click="
                                                            openDeleteGuest(inv)
                                                        "
                                                    >
                                                        <UIcon
                                                            name="i-heroicons-trash"
                                                            class="w-4 h-4"
                                                        />
                                                    </UButton>
                                                </UTooltip>
                                                <UDropdownMenu
                                                    :items="shareItems(inv)"
                                                    :content="{
                                                        align: 'end',
                                                        side: 'bottom',
                                                        sideOffset: 8,
                                                    }"
                                                    :ui="{ content: 'w-56' }"
                                                >
                                                    <UButton
                                                        size="xs"
                                                        variant="ghost"
                                                        color="primary"
                                                        :loading="
                                                            sendingIds.has(
                                                                inv.id,
                                                            )
                                                        "
                                                        aria-label="Envoyer"
                                                    >
                                                        <UIcon
                                                            name="i-heroicons-paper-airplane"
                                                            class="w-4 h-4 mr-1"
                                                        />
                                                        Envoyer
                                                        <UIcon
                                                            name="i-heroicons-chevron-down-20-solid"
                                                            class="w-4 h-4 ml-1"
                                                        />
                                                    </UButton>
                                                </UDropdownMenu>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between pt-2">
                        <div class="text-xs text-gray-600">
                            Page {{ currentPage }} / {{ totalPages }}
                        </div>
                        <div class="flex items-center gap-2">
                            <UButton
                                size="xs"
                                variant="ghost"
                                :disabled="currentPage <= 1 || pending"
                                @click="prevPage"
                                >Précédent</UButton
                            >
                            <UButton
                                size="xs"
                                variant="ghost"
                                :disabled="currentPage >= totalPages || pending"
                                @click="nextPage"
                                >Suivant</UButton
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modals -->
            <Modal v-model="showTemplate" title="Choisir un template">
                <div class="space-y-2">
                    <div v-if="templatesPending" class="space-y-2">
                        <USkeleton class="h-6 w-1/2" />
                        <USkeleton class="h-32 w-full" />
                    </div>
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                            v-for="t in templates"
                            :key="t.id"
                            class="border rounded-lg p-3 transition-all duration-200"
                            :class="{
                                'border-primary-500 bg-primary-50 shadow-md':
                                    selectedTemplateId === t.id,
                                'border-gray-200 hover:border-gray-300':
                                    selectedTemplateId !== t.id,
                            }"
                        >
                            <div
                                class="aspect-video w-full overflow-hidden rounded-lg bg-gray-100"
                            >
                                <img
                                    :src="t.previewImageUrl"
                                    :alt="t.title"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div class="mt-2 font-medium text-gray-900">
                                {{ t.title }}
                            </div>
                            <div class="text-xs text-gray-600">
                                {{ t.designKey }}
                            </div>
                            <div class="mt-2 text-right">
                                <UButton
                                    size="xs"
                                    color="primary"
                                    :loading="templateSubmitting"
                                    @click="selectTemplate(t.id)"
                                >
                                    Sélectionner
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showTemplate = false"
                        >Fermer</UButton
                    >
                </template>
            </Modal>

            <Modal
                size="xl"
                v-model="showMessage"
                title="Message invité (évènement)"
            >
                <div class="space-y-4">
                    <!-- Sélecteur de modèles -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Modèles prédéfinis</label
                        >
                        <InvitationTemplateSelector
                            v-model="guestMessage"
                            :event-data="{
                                date: currentEvent?.startsAt
                                    ? formatDate(currentEvent.startsAt)
                                    : undefined,
                                location: currentEvent?.location,
                                years: 5, // Exemple pour anniversaire
                            }"
                            @template-selected="onTemplateSelected"
                        />
                    </div>

                    <!-- Séparateur -->
                    <div class="border-t border-gray-200 pt-4">
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Ou personnaliser votre message</label
                        >
                        <textarea
                            v-model="guestMessage"
                            rows="8"
                            placeholder="Message destiné aux invités (affiché sur l'invitation)"
                            class="rounded-lg border border-gray-300 px-3 py-2 w-full"
                        />

                        <!-- Aperçu du message formaté -->
                        <div v-if="guestMessage" class="mt-4">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                                >Aperçu du message formaté</label
                            >
                            <div
                                class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]"
                            >
                                <div
                                    v-html="processedGuestMessage"
                                    class="prose prose-sm max-w-none"
                                ></div>
                            </div>
                        </div>

                        <!-- Variables disponibles -->
                        <InvitationVariablesHelp />
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showMessage = false"
                        >Fermer</UButton
                    >
                    <UButton color="primary" @click="saveGuestMessage"
                        >Enregistrer</UButton
                    >
                </template>
            </Modal>

            <!-- View invitation modal -->
            <Modal v-model="showView" title="Détails de l'invitation">
                <div v-if="currentView" class="space-y-2 text-sm">
                    <div>
                        <span class="text-gray-600">Nom:</span>
                        <span class="font-medium">{{
                            currentView.guestName || "—"
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Email:</span>
                        <span class="font-medium">{{
                            currentView.guestEmail || "—"
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Téléphone:</span>
                        <span class="font-medium">{{
                            currentView.guestPhone || "—"
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Table:</span>
                        <span class="font-medium">{{
                            currentView.guestTableName || "—"
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Boissons:</span>
                        <span class="font-medium">{{
                            currentView.drinkChoice?.length
                                ? currentView.drinkChoice
                                      .map((drink) =>
                                          typeof drink === "string"
                                              ? drink
                                              : drink.name ||
                                                drink.title ||
                                                "Boisson inconnue",
                                      )
                                      .join(", ")
                                : "Aucune"
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Régime:</span>
                        <span class="font-medium">
                            <span
                                v-if="currentView.hasSaltFreeDiet"
                                class="text-amber-600"
                            >
                                🧂 Sans sel
                            </span>
                            <span v-else class="text-gray-500"> Standard </span>
                        </span>
                    </div>
                    <div>
                        <span class="text-gray-600">Statut:</span>
                        <span class="font-medium capitalize">{{
                            statusLabel(currentView.status)
                        }}</span>
                    </div>
                    <div v-if="currentView.token">
                        <span class="text-gray-600">Token:</span>
                        <span class="font-mono break-all">{{
                            currentView.token
                        }}</span>
                    </div>
                    <div v-if="currentView.sentAt">
                        <span class="text-gray-600">Envoyé le:</span>
                        <span>{{ currentView.sentAt }}</span>
                    </div>
                    <div v-if="currentView.confirmedAt">
                        <span class="text-gray-600">Confirmé le:</span>
                        <span>{{ currentView.confirmedAt }}</span>
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showView = false"
                        >Fermer</UButton
                    >
                </template>
            </Modal>

            <Modal v-model="showAddGuest" title="Ajouter un invité">
                <div class="space-y-3">
                    <input
                        v-model="newGuest.name"
                        placeholder="Nom"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="newGuest.email"
                        placeholder="Email"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="newGuest.phone"
                        placeholder="Téléphone"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="newGuest.table"
                        placeholder="Table"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <div class="flex items-center space-x-2">
                        <input
                            id="new-guest-salt-free"
                            v-model="newGuest.hasSaltFreeDiet"
                            type="checkbox"
                            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                            for="new-guest-salt-free"
                            class="text-sm text-gray-700"
                        >
                            Régime sans sel 🧂
                        </label>
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showAddGuest = false"
                        >Annuler</UButton
                    >
                    <UButton color="primary" @click="addGuest">Ajouter</UButton>
                </template>
            </Modal>

            <!-- Modal d'édition d'invité -->
            <Modal v-model="showEditGuest" title="Modifier l'invité">
                <div class="space-y-3">
                    <input
                        v-model="editGuest.name"
                        placeholder="Nom"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="editGuest.email"
                        placeholder="Email"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="editGuest.phone"
                        placeholder="Téléphone"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <input
                        v-model="editGuest.table"
                        placeholder="Table"
                        class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                    />
                    <div class="flex items-center space-x-2">
                        <input
                            id="edit-guest-salt-free"
                            v-model="editGuest.hasSaltFreeDiet"
                            type="checkbox"
                            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                            for="edit-guest-salt-free"
                            class="text-sm text-gray-700"
                        >
                            Régime sans sel 🧂
                        </label>
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showEditGuest = false"
                        >Annuler</UButton
                    >
                    <UButton
                        color="primary"
                        :loading="editSubmitting"
                        @click="updateGuest"
                        >Modifier</UButton
                    >
                </template>
            </Modal>

            <!-- Modal de suppression d'invité -->
            <Modal v-model="showDeleteGuest" title="Supprimer l'invité">
                <div class="text-center py-4">
                    <UIcon
                        name="i-heroicons-exclamation-triangle"
                        class="w-12 h-12 text-red-500 mx-auto mb-4"
                    />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                        Confirmer la suppression
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">
                        Êtes-vous sûr de vouloir supprimer l'invité
                        <strong>{{
                            deleteGuest?.guestName || "cet invité"
                        }}</strong>
                        ?
                    </p>
                    <p class="text-xs text-gray-500">
                        Cette action est irréversible.
                    </p>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showDeleteGuest = false"
                        >Annuler</UButton
                    >
                    <UButton
                        color="red"
                        :loading="deleteSubmitting"
                        @click="confirmDeleteGuest"
                    >
                        Supprimer
                    </UButton>
                </template>
            </Modal>

            <Modal v-model="showImport" title="Importer des invités (CSV)">
                <div class="space-y-3">
                    <label for="csvFile" class="block text-sm text-gray-700"
                        >Fichier CSV</label
                    >
                    <input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        @change="onImportFile"
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <div class="text-xs text-red-600">
                        Format attendu:
                        <code
                            >name,table_name,phone,email,has_salt_free_diet</code
                        >
                        (séparateur "," ou ";"). Seul <strong>name</strong> est
                        requis.
                        <br />
                        <code>has_salt_free_diet</code>:
                        <strong>true/false</strong> (optionnel, par défaut:
                        false)
                    </div>
                    <div
                        v-if="parsedBatch.length"
                        class="text-xs text-gray-700"
                    >
                        Lignes détectées: {{ parsedBatch.length }}
                    </div>
                    <div>
                        <UButton
                            size="xs"
                            color="primary"
                            class="px-4 py-1"
                            variant="outline"
                            @click="downloadSampleCsv"
                            >Télécharger exemple CSV</UButton
                        >
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showImport = false"
                        >Fermer</UButton
                    >
                    <UButton
                        color="primary"
                        :loading="importSubmitting"
                        :disabled="!parsedBatch.length || importSubmitting"
                        @click="importParsedBatch"
                        >Importer</UButton
                    >
                </template>
            </Modal>

            <!-- Acheter des crédits -->
            <Modal
                v-model="showBuyCredits"
                title="Acheter des crédits d'invitation"
            >
                <div class="space-y-3">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-sm text-gray-700 mb-1"
                                >Crédits</label
                            >
                            <input
                                v-model.number="buy.credits"
                                type="number"
                                min="1"
                                class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                            />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-1"
                                >Devise</label
                            >
                            <select
                                v-model="buy.currency"
                                class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                            >
                                <option value="CDF">CDF</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <div class>
                            <label class="block text-sm text-gray-700 mb-1"
                                >Téléphone (E.164)</label
                            >
                            <input
                                v-model="buy.phone"
                                type="tel"
                                placeholder="2438XXXXXXXX"
                                class="rounded-lg border border-gray-300 px-3 py-1 w-full"
                            />
                        </div>
                    </div>

                    <!-- Prix -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                            class="rounded-lg border border-gray-200 p-3 bg-gray-50"
                        >
                            <div class="text-xs text-gray-500">
                                Prix unitaire (USD)
                            </div>
                            <div class="text-lg font-semibold text-gray-900">
                                <template v-if="pricePending"
                                    ><USkeleton class="h-6 w-24"
                                /></template>
                                <template v-else>{{ unitPriceUsd }}</template>
                            </div>
                        </div>
                        <div
                            class="rounded-lg border border-gray-200 p-3 bg-gray-50"
                        >
                            <div class="text-xs text-gray-500">Total (USD)</div>
                            <div class="text-lg font-semibold text-gray-900">
                                <template v-if="pricePending"
                                    ><USkeleton class="h-6 w-28"
                                /></template>
                                <template v-else>{{ totalUsd }}</template>
                            </div>
                            <div
                                v-if="buy.currency === 'CDF'"
                                class="mt-1 text-xs text-gray-500"
                            >
                                Le montant en CDF sera calculé lors du paiement.
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="paymentNoticeActive"
                        class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
                    >
                        Une notification de paiement a été envoyée au
                        {{ buy.phone }}. Veuillez confirmer.
                        <div class="mt-1 text-xs text-amber-700">
                            Expiration dans {{ countdown }}s…
                        </div>
                    </div>
                </div>
                <template #footer>
                    <UButton
                        variant="ghost"
                        :disabled="buySubmitting"
                        @click="closeBuyCredits"
                        >Fermer</UButton
                    >
                    <UButton
                        color="primary"
                        :loading="buySubmitting"
                        :disabled="paymentNoticeActive"
                        @click="submitBuyCredits"
                        >Payer</UButton
                    >
                </template>
            </Modal>

            <!-- Modal de gestion des boissons -->
            <Modal
                v-model="showDrinksList"
                title="Configuration des boissons"
                class="modal-mobile-optimized"
            >
                <div class="modal-content-mobile">
                    <DrinkList
                        :drinks="drinks"
                        :loading="drinksLoading"
                        @add-drink="openAddDrink"
                        @edit-drink="openEditDrink"
                        @delete-drink="openDeleteDrink"
                    />
                </div>
            </Modal>

            <!-- Modal d'ajout/édition de boissons -->
            <Modal
                v-model="showDrinkForm"
                :title="
                    currentDrink
                        ? 'Modifier la boisson'
                        : 'Ajouter des boissons'
                "
                class="modal-mobile-optimized"
            >
                <div class="modal-content-mobile">
                    <!-- Formulaire simple pour l'édition d'une seule boisson -->
                    <div v-if="currentDrink" class="space-y-4">
                        <div
                            class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                            <h3 class="text-sm font-medium text-gray-900 mb-3">
                                Modifier la boisson
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Nom de la boisson -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Nom de la boisson *
                                    </label>
                                    <UInput
                                        v-model="currentDrink.name"
                                        placeholder="Ex: Vin rouge, Jus d'orange..."
                                    />
                                </div>

                                <!-- Catégorie de la boisson -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Catégorie *
                                    </label>
                                    <select
                                        v-model="currentDrink.category"
                                        class="rounded-lg border border-gray-300 px-3 py-2 w-full text-sm focus:border-primary-500 focus:ring-primary-500"
                                    >
                                        <option value="alcohol">Alcool</option>
                                        <option value="non_alcohol">
                                            Non alcoolisé
                                        </option>
                                        <option value="soft_drink">
                                            Boisson gazeuse
                                        </option>
                                        <option value="hot_drink">
                                            Boisson chaude
                                        </option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire complet pour l'ajout de boissons -->
                    <DrinkForm
                        v-else
                        v-model="drinkForm"
                        :submitting="drinksSubmitting"
                        @submit="handleAddDrinks(drinkForm)"
                        @cancel="showDrinkForm = false"
                    />
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showDrinkForm = false"
                        >Annuler</UButton
                    >
                    <UButton
                        color="primary"
                        :loading="drinksSubmitting"
                        @click="
                            currentDrink
                                ? handleUpdateDrink(currentDrink)
                                : handleAddDrinks(drinkForm)
                        "
                    >
                        {{ currentDrink ? "Mettre à jour" : "Ajouter" }}
                    </UButton>
                </template>
            </Modal>

            <!-- Modal de suppression des boissons -->
            <Modal
                v-model="showDrinkDelete"
                title="Supprimer la boisson"
                class="modal-mobile-optimized"
            >
                <div class="modal-content-mobile">
                    <div class="text-center py-4">
                        <UIcon
                            name="i-heroicons-exclamation-triangle"
                            class="w-12 h-12 text-red-500 mx-auto mb-4"
                        />
                        <h3 class="text-lg font-medium text-gray-900 mb-2">
                            Confirmer la suppression
                        </h3>
                        <p class="text-sm text-gray-600 mb-4">
                            Êtes-vous sûr de vouloir supprimer toutes les
                            boissons configurées pour cet événement ?
                        </p>
                        <p class="text-xs text-gray-500">
                            Cette action est irréversible.
                        </p>
                    </div>
                </div>
                <template #footer>
                    <UButton variant="ghost" @click="showDrinkDelete = false"
                        >Annuler</UButton
                    >
                    <UButton
                        color="red"
                        :loading="drinksSubmitting"
                        @click="handleDeleteDrink"
                    >
                        Supprimer la boisson
                    </UButton>
                </template>
            </Modal>
        </div>
    </OrganizerNavigation>
</template>

<script setup lang="ts">
// @ts-nocheck
import DrinkList from "~/components/organizer/DrinkList.vue";
import DrinkForm from "~/components/organizer/forms/DrinkForm.vue";

definePageMeta({ middleware: "authenticated", ssr: false });

const route = useRoute();
const eventId = Number(route.params.id);
const backUrl = computed(() => `/organisateur/events/${eventId}`);

const {
    fetchEventInvitations,
    fetchInvitationTemplates,
    createInvitation,
    createInvitationsBatch,
    shareInvitation,
    updateInvitation,
    deleteInvitation,
} = useInvitations();
const { fetchEventWithState, currentEvent } = useOrganizerEvents();
const {
    fetchEventDrinks,
    addEventDrinks,
    updateEventDrinks,
    deleteEventDrinks,
} = useDrinks();

// Fonction utilitaire pour extraire les messages d'erreur API
const getApiErrorMessage = (err: any): string => {
    const response = err?.response;
    const data = response?._data || response?.data;
    if (data?.message) return String(data.message);
    if (data?.errors) {
        if (Array.isArray(data.errors)) return data.errors.join(", ");
        const values = Object.values(data.errors as Record<string, any>);
        const flat = ([] as any[]).concat(...(values as any));
        if (flat.length) return String(flat[0]);
    }
    return String(err?.message || "Erreur inattendue");
};
const toast = useToast();

// Configuration des cartes d'actions
const actionCards = computed(() => [
    {
        id: "add-guest",
        title: "Ajouter invité",
        description: "Inviter une personne",
        icon: "i-heroicons-user-plus",
        bgColor: "bg-primary-100",
        hoverBgColor: "bg-primary-200",
        iconColor: "text-primary-600",
        action: () => (showAddGuest.value = true),
    },
    {
        id: "import-list",
        title: "Importer liste",
        description: "Import CSV/Excel",
        icon: "i-heroicons-arrow-up-tray",
        bgColor: "bg-neutral-100",
        hoverBgColor: "bg-neutral-200",
        iconColor: "text-neutral-600",
        action: () => (showImport.value = true),
    },
    {
        id: "template",
        title: "Modèle",
        description: "Personnaliser design",
        icon: "i-heroicons-swatch",
        bgColor: "bg-warning-100",
        hoverBgColor: "bg-warning-200",
        iconColor: "text-warning-600",
        action: () => (showTemplate.value = true),
    },
    {
        id: "message",
        title: "Message",
        description: "Config. message",
        icon: "i-heroicons-cog-6-tooth",
        bgColor: "bg-secondary-100",
        hoverBgColor: "bg-secondary-200",
        iconColor: "text-secondary-600",
        action: () => (showMessage.value = true),
    },
    {
        id: "drinks",
        title: "Boissons",
        description: "Gérer les boissons",
        icon: "i-heroicons-wine",
        bgColor: "bg-info-100",
        hoverBgColor: "bg-info-200",
        iconColor: "text-info-600",
        action: () => (showDrinksList.value = true),
    },
    {
        id: "credits",
        title: "Crédits",
        description: `${credits.value?.balance ?? 0} disponibles`,
        icon: "i-heroicons-credit-card",
        bgColor: "bg-success-100",
        hoverBgColor: "bg-success-200",
        iconColor: "text-success-600",
        action: openBuyCredits,
    },
]);

// Récupérer les informations de l'événement
const event = computed(() => currentEvent.value);

const statusFilter = ref<
    "all" | "pending" | "sent" | "viewed" | "confirmed" | "cancelled"
>("all");
const searchQuery = ref("");
const drinkFilter = ref<string>("all");
const { pending, data, refresh } = await useAsyncData<{
    items: any[];
    meta: any;
}>(
    `organizer-event-${eventId}-invitations`,
    () =>
        fetchEventInvitations(eventId, {
            per_page: perPage.value,
            page: currentPage.value,
        }),
    { server: false, default: () => ({ items: [], meta: null }) },
);
const invitations = computed<any[]>(() =>
    Array.isArray((data.value as any)?.items) ? (data.value as any).items : [],
);
const perPage = ref(10);
const currentPage = ref(1);
const totalPages = computed(() =>
    Math.max(1, Number((data.value as any)?.meta?.lastPage || 1)),
);
watch([perPage, currentPage], () => {
    refresh();
});
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
onMounted(async () => {
    await fetchEventWithState(eventId);
    refresh();
});
const totalCount = computed(() => invitations.value.length);
const pendingCount = computed(
    () =>
        invitations.value.filter(
            (i) => String(i.status || "").toLowerCase() === "pending",
        ).length,
);
const sentCount = computed(
    () =>
        invitations.value.filter(
            (i) => String(i.status || "").toLowerCase() === "sent",
        ).length,
);
const confirmedCount = computed(
    () =>
        invitations.value.filter(
            (i) => String(i.status || "").toLowerCase() === "confirmed",
        ).length,
);
const filtered = computed<any[]>(() => {
    const list = Array.isArray(invitations.value) ? invitations.value : [];
    const status = (statusFilter.value || "all").toLowerCase();
    const byStatus =
        status === "all"
            ? list
            : list.filter(
                  (i: any) => String(i.status || "").toLowerCase() === status,
              );

    // Filtre par boisson (pour l'instant, on filtre par nom d'invité qui contient le nom de la boisson)
    const drink = drinkFilter.value;
    const byDrink =
        drink === "all"
            ? byStatus
            : byStatus.filter((i: any) => {
                  // Pour l'instant, on simule le filtre en cherchant dans le nom de l'invité
                  // Plus tard, on pourra ajouter un champ drinkPreference aux invitations
                  const guestName = String(i.guestName || "").toLowerCase();
                  const drinkName = String(drink || "").toLowerCase();
                  return (
                      guestName.includes(drinkName) ||
                      drinkName.includes(guestName)
                  );
              });

    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return byDrink;
    return byDrink.filter((i: any) => {
        const hay = [
            i.guestName,
            i.guestEmail,
            i.guestPhone,
            i.guestTableName,
            i.token,
        ]
            .map((v: any) => String(v || "").toLowerCase())
            .join(" ");
        return hay.includes(q);
    });
});

const sendingIds = reactive(new Set<number>());
const showView = ref(false);
const currentView = ref<any | null>(null);
const openView = (inv: any) => {
    currentView.value = inv;
    showView.value = true;
};

import type { DropdownMenuItem } from "@nuxt/ui";
import LoadingOverlay from "~/components/LoadingOverlay.vue";
const shareItems = (inv?: any): DropdownMenuItem[] => [
    {
        label: "Partager le lien",
        icon: "i-heroicons-link",
        kbds: ["meta", "l"],
        onSelect: async () => {
            try {
                const url = `${location.origin}/invitation/${inv?.token || inv?.id}`;
                await navigator.clipboard.writeText(url);
                useAppToast().showSuccess(
                    "Lien copié",
                    "Le lien a été copié dans le presse-papiers.",
                );
            } catch (_) {
                useAppToast().showWarning(
                    "Impossible de copier",
                    "Copiez manuellement le lien.",
                );
            }
        },
    },
    {
        label: "Envoyer par WhatsApp",
        icon: "i-simple-icons-whatsapp",
        kbds: ["meta", "w"],
        onSelect: () => {
            const url = `${location.origin}/invitation/${inv?.token || inv?.id}`;
            const eventName = currentEvent.value?.name || "événement";
            const message = `Bonjour,\n\n Vous êtes specialement invité(e)  à l'événement "${eventName}" !\n\nCliquez sur le lien ci-dessous pour voir votre invitation :\n${url}`;
            const text = encodeURIComponent(message);
            const wa = `https://wa.me/?text=${text}`;
            window.open(wa, "_blank");
        },
    },
    {
        label: "Envoyer via système (email/sms)",
        icon: "i-heroicons-paper-airplane",
        kbds: ["meta", "s"],
        onSelect: () => onShare(inv),
    },
];

// Shortcuts are defined by the dropdown component when open, we keep logic in onSelect of items
const onShare = async (inv: any) => {
    try {
        sendingIds.add(inv.id);
        await shareInvitation(eventId, inv.id);
        useAppToast().showSuccess(
            "Invitation envoyée",
            `Partage effectué pour ${inv.guestName || "invité"}.`,
        );
        await refresh();
        await refreshCredits();
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de l'envoi de l'invitation:", e);
    } finally {
        sendingIds.delete(inv.id);
    }
};

const statusLabel = (s?: string) => {
    const k = String(s || "pending").toLowerCase();
    if (k === "pending") return "en attente";
    if (k === "sent") return "envoyé";
    if (k === "viewed") return "consulté";
    if (k === "confirmed") return "confirmé";
    if (k === "cancelled") return "annulé";
    return k;
};

const isConfirmed = (s?: string) =>
    String(s || "").toLowerCase() === "confirmed";

// Templates
const showTemplate = ref(false);
const templateSubmitting = ref(false);
const { pending: templatesPending, data: templatesData } = await useAsyncData<{
    items: any[];
    meta: any;
}>(`invitations-templates`, () => fetchInvitationTemplates({ per_page: 50 }), {
    server: false,
    default: () => ({ items: [], meta: null }),
});
const templates = computed<any[]>(() =>
    Array.isArray((templatesData.value as any)?.items)
        ? (templatesData.value as any).items
        : [],
);

// Template actuellement sélectionné
const selectedTemplateId = computed(() => {
    return (
        currentEvent.value?.settings?.defaultInvitationTemplateId ||
        currentEvent.value?.settings?.default_invitation_template_id ||
        null
    );
});

// Fonction pour sélectionner un template
const { updateEvent } = useOrganizerEvents();
const selectTemplate = async (templateId: number) => {
    try {
        templateSubmitting.value = true;
        await updateEvent(eventId, {
            settings: {
                default_invitation_template_id: templateId,
            },
        });

        // Recharger les données de l'événement pour mettre à jour le template sélectionné
        await fetchEventWithState(eventId);

        useAppToast().showSuccess(
            "Template sélectionné",
            "Le template d'invitation par défaut a été mis à jour.",
        );
        showTemplate.value = false;
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de la sélection du template:", e);
    } finally {
        templateSubmitting.value = false;
    }
};

// Credits
const { fetchCreditBalance } = useCredits();
const {
    pending: creditsPending,
    data: creditsData,
    refresh: refreshCredits,
} = await useAsyncData(`invitations-credits`, () => fetchCreditBalance(), {
    server: false,
});
const credits = computed(() => creditsData.value || { balance: 0 });

// Prix crédits
const { fetchCreditPrice } = useCredits();
const { pending: pricePending, data: priceData } = await useAsyncData(
    `invitations-credit-price`,
    async () => {
        if (process.dev) {
            console.log("[CREDITS] Chargement du prix unitaire...");
        }
        try {
            const result = await fetchCreditPrice();
            if (process.dev) {
                console.log("[CREDITS] Prix unitaire chargé:", result);
            }
            return result;
        } catch (error) {
            if (process.dev) {
                console.error(
                    "[CREDITS] Erreur lors du chargement du prix:",
                    error,
                );
            }
            throw error;
        }
    },
    { server: false },
);

// Variables pour les boissons (déclarées avant utilisation)
const drinks = ref<any[]>([]);

// Chargement des boissons
const { pending: drinksPending, refresh: refreshDrinks } = await useAsyncData(
    `organizer-event-drinks-${eventId}`,
    async () => {
        try {
            const list = await fetchEventDrinks(eventId);
            drinks.value = list;
            return list;
        } catch (error) {
            console.error("Erreur lors du chargement des boissons:", error);
            drinks.value = [];
            return [];
        }
    },
);
const drinksLoading = computed(() => drinksPending.value);
const unitPriceUsd = computed(() => {
    // Gestion de la structure API standard { success, message, data: { unitPriceUsd } }
    const unitPrice =
        priceData.value?.data?.unitPriceUsd ??
        priceData.value?.unitPriceUsd ??
        0;
    const price = unitPrice.toFixed(2);
    if (process.dev) {
        console.log("[CREDITS] Prix unitaire calculé:", {
            rawPrice: unitPrice,
            formattedPrice: price,
            priceData: priceData.value,
            extractedFromData: priceData.value?.data?.unitPriceUsd,
            directAccess: priceData.value?.unitPriceUsd,
        });
    }
    return price;
});
const totalUsd = computed(() => {
    // Gestion de la structure API standard { success, message, data: { unitPriceUsd } }
    const unitPrice = Number(
        priceData.value?.data?.unitPriceUsd ??
            priceData.value?.unitPriceUsd ??
            0,
    );
    const credits = Math.max(0, Number(buy?.credits || 0));
    const total = (unitPrice * credits).toFixed(2);

    if (process.dev) {
        console.log("[CREDITS] Total calculé:", {
            unitPrice,
            credits,
            total,
            buyCredits: buy?.credits,
            currency: buy?.currency,
            priceData: priceData.value,
            extractedFromData: priceData.value?.data?.unitPriceUsd,
            directAccess: priceData.value?.unitPriceUsd,
        });
    }

    return total;
});

// Message config (local UI state)
const showMessage = ref(false);
const guestMessage = ref<string>("");
const guestMessageHtml = ref<string>(""); // Version HTML stockée
const { $myFetch } = useNuxtApp();

// Composable pour les conversions
const { htmlToSimpleText, simpleTextToHtml, processMessage } =
    useInvitationVariables({
        event: currentEvent.value,
        invitation: {
            guestName: "Nom de l'invité",
            guestTableName: "Table A",
            event: currentEvent.value,
        },
    });

// Traitement du message avec les variables
const processedGuestMessage = computed(() => {
    if (!guestMessageHtml.value) return "";

    const result = processMessage(guestMessageHtml.value);
    return result.text;
});
onMounted(async () => {
    try {
        const res = await $myFetch<any>(`/events/${eventId}`);
        const ev = res?.data || res;
        const settings = ev?.settings || {};

        // Charger le HTML stocké
        const htmlMessage =
            settings?.guestMessage || settings?.guest_message || "";
        guestMessageHtml.value = htmlMessage;

        // Convertir en texte simple pour l'édition
        guestMessage.value = htmlToSimpleText(htmlMessage);
    } catch (_) {}
});
const saveGuestMessage = async () => {
    try {
        // Convertir le texte simple en HTML avant de sauvegarder
        const htmlMessage = simpleTextToHtml(guestMessage.value);
        guestMessageHtml.value = htmlMessage;

        await $myFetch<any>(`/events/${eventId}`, {
            method: "PUT",
            body: { settings: { guest_message: htmlMessage } },
        });

        // Recharger les données de l'événement pour mettre à jour le message
        await fetchEventWithState(eventId);

        useAppToast().showSuccess(
            "Message enregistré",
            "Le message invité a été mis à jour.",
        );
        showMessage.value = false;
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de l'enregistrement du message:", e);
    }
};

// Gestion des modèles de texte
const onTemplateSelected = (template: any, message: string) => {
    // Convertir le message du template en texte simple pour l'édition
    guestMessage.value = htmlToSimpleText(message);
    useAppToast().showSuccess(
        "Modèle appliqué",
        `Le modèle "${template.title}" a été appliqué.`,
    );
};

// Acheter crédits
const showBuyCredits = ref(false);
const buySubmitting = ref(false);
const paymentNoticeActive = ref(false);
const countdown = ref(60);
let countdownTimer: any = null;
const buy = reactive({ credits: 10, currency: "CDF", phone: "" });
const { purchaseAndPayCredits } = useCredits();
const openBuyCredits = () => {
    showBuyCredits.value = true;
};
const closeBuyCredits = () => {
    showBuyCredits.value = false;
    paymentNoticeActive.value = false;
    clearInterval(countdownTimer);
    countdown.value = 60;
};
const startCountdown = () => {
    paymentNoticeActive.value = true;
    countdown.value = 60;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        if (countdown.value > 0) countdown.value--;
        else clearInterval(countdownTimer);
    }, 1000);
};
const submitBuyCredits = async () => {
    if (process.dev) {
        console.log("[CREDITS] Tentative d'achat de crédits:", {
            buyData: buy,
            unitPrice: priceData.value?.unitPriceUsd,
            totalCalculated: totalUsd.value,
        });
    }

    if (!buy.phone || !/^\d{12}$/.test(buy.phone)) {
        if (process.dev) {
            console.warn(
                "[CREDITS] Validation échouée - Téléphone invalide:",
                buy.phone,
            );
        }
        useAppToast().showWarning(
            "Téléphone invalide",
            "Format attendu: 243XXXXXXXXX",
        );
        return;
    }
    if (!buy.credits || buy.credits < 1) {
        if (process.dev) {
            console.warn(
                "[CREDITS] Validation échouée - Crédits invalides:",
                buy.credits,
            );
        }
        useAppToast().showWarning(
            "Crédits invalides",
            "Saisissez un nombre de crédits ≥ 1.",
        );
        return;
    }
    try {
        buySubmitting.value = true;

        const purchaseData = {
            credits: buy.credits as any,
            currency: buy.currency as any,
            phone: buy.phone,
        };

        if (process.dev) {
            console.log("[CREDITS] Envoi de la requête d'achat:", purchaseData);
        }

        const result = await purchaseAndPayCredits(purchaseData);

        if (process.dev) {
            console.log("[CREDITS] Réponse de l'achat:", result);
        }

        useAppToast().showSuccess(
            "Paiement initié",
            "Une notification de paiement a été envoyée. Veuillez confirmer.",
        );
        startCountdown();
    } catch (e: any) {
        if (process.dev) {
            console.error(
                "[CREDITS] Erreur lors de l'initiation du paiement:",
                e,
            );
        }
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de l'initiation du paiement:", e);
    } finally {
        buySubmitting.value = false;
    }
};

// Add guest modal
const showAddGuest = ref(false);
const newGuest = reactive({
    name: "",
    email: "",
    phone: "",
    table: "",
    hasSaltFreeDiet: false,
});
const addSubmitting = ref(false);

// Edit guest modal
const showEditGuest = ref(false);
const editGuest = reactive({
    id: null,
    name: "",
    email: "",
    phone: "",
    table: "",
    hasSaltFreeDiet: false,
});
const editSubmitting = ref(false);

// Delete guest modal
const showDeleteGuest = ref(false);
const deleteGuest = ref(null);
const deleteSubmitting = ref(false);
const addGuest = async () => {
    if (!newGuest.name?.trim()) {
        useAppToast().showWarning(
            "Nom requis",
            "Veuillez saisir le nom de l'invité.",
        );
        return;
    }
    try {
        addSubmitting.value = true;
        await createInvitation(eventId, {
            guestName: newGuest.name.trim(),
            guestEmail: newGuest.email?.trim() || undefined,
            guestPhone: newGuest.phone?.trim() || undefined,
            guestTableName: newGuest.table?.trim() || undefined,
            hasSaltFreeDiet: newGuest.hasSaltFreeDiet,
        });
        useAppToast().showSuccess(
            "Invité ajouté",
            "L'invité a été ajouté avec succès.",
        );
        showAddGuest.value = false;
        newGuest.name = "";
        newGuest.email = "";
        newGuest.phone = "";
        newGuest.table = "";
        newGuest.hasSaltFreeDiet = false;
        await refresh();
        await refreshCredits();
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de l'ajout de l'invité:", e);
    } finally {
        addSubmitting.value = false;
    }
};

// Fonctions pour l'édition d'invité
const openEditGuest = (inv: any) => {
    editGuest.id = inv.id;
    editGuest.name = inv.guestName || "";
    editGuest.email = inv.guestEmail || "";
    editGuest.phone = inv.guestPhone || "";
    editGuest.table = inv.guestTableName || "";
    editGuest.hasSaltFreeDiet = inv.hasSaltFreeDiet || false;
    showEditGuest.value = true;
};

const updateGuest = async () => {
    if (!editGuest.name?.trim()) {
        useAppToast().showWarning(
            "Nom requis",
            "Veuillez saisir le nom de l'invité.",
        );
        return;
    }
    try {
        editSubmitting.value = true;
        await updateInvitation(eventId, editGuest.id, {
            guestName: editGuest.name.trim(),
            guestEmail: editGuest.email?.trim() || undefined,
            guestPhone: editGuest.phone?.trim() || undefined,
            guestTableName: editGuest.table?.trim() || undefined,
            hasSaltFreeDiet: editGuest.hasSaltFreeDiet,
        });
        useAppToast().showSuccess(
            "Invité modifié",
            "L'invité a été modifié avec succès.",
        );
        showEditGuest.value = false;
        await refresh();
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de la modification de l'invité:", e);
    } finally {
        editSubmitting.value = false;
    }
};

// Fonctions pour la suppression d'invité
const openDeleteGuest = (inv: any) => {
    deleteGuest.value = inv;
    showDeleteGuest.value = true;
};

const confirmDeleteGuest = async () => {
    if (!deleteGuest.value?.id) return;

    try {
        deleteSubmitting.value = true;
        await deleteInvitation(eventId, deleteGuest.value.id);
        useAppToast().showSuccess(
            "Invité supprimé",
            "L'invité a été supprimé avec succès.",
        );
        showDeleteGuest.value = false;
        deleteGuest.value = null;
        await refresh();
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de la suppression de l'invité:", e);
    } finally {
        deleteSubmitting.value = false;
    }
};

// Import modal
const showImport = ref(false);

// Variables pour les boissons
const showDrinksList = ref(false);
const showDrinkForm = ref(false);
const showDrinkDelete = ref(false);
const drinkForm = ref<any[]>([]);
const currentDrink = ref<any>(null);
const drinksSubmitting = ref(false);
const onImportFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const text = String(reader.result || "");
            // Normaliser les retours à la ligne
            const rows = text
                .replace(/\r\n/g, "\n")
                .replace(/\r/g, "\n")
                .split("\n")
                .map((r) => r.trim())
                .filter(Boolean);
            if (rows.length === 0) throw new Error("Fichier vide");

            // Détecter le séparateur ("," vs ";")
            const headerLine = rows[0];
            const commaCount = (headerLine.match(/,/g) || []).length;
            const semicolonCount = (headerLine.match(/;/g) || []).length;
            const delim = semicolonCount > commaCount ? ";" : ",";

            // Parser simple respectant les guillemets
            const parseCSVLine = (line: string): string[] => {
                const out: string[] = [];
                let cur = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"') {
                        if (inQuotes && line[i + 1] === '"') {
                            cur += '"';
                            i++;
                            continue;
                        }
                        inQuotes = !inQuotes;
                        continue;
                    }
                    if (ch === delim && !inQuotes) {
                        out.push(cur.trim());
                        cur = "";
                        continue;
                    }
                    cur += ch;
                }
                out.push(cur.trim());
                return out.map((v) => v.replace(/^\uFEFF/, ""));
            };

            const headersRaw = parseCSVLine(headerLine).map((h) =>
                h.trim().toLowerCase(),
            );
            const hasHeader = headersRaw.some((h) =>
                [
                    "name",
                    "nom",
                    "email",
                    "e-mail",
                    "phone",
                    "telephone",
                    "téléphone",
                    "tel",
                    "table_name",
                    "table",
                ].includes(h),
            );

            const headerIdx: Record<string, number> = {};
            if (hasHeader)
                headersRaw.forEach((h, idx) => {
                    headerIdx[h] = idx;
                });
            const dataLines = hasHeader ? rows.slice(1) : rows;

            const getBy = (names: string[], parts: string[]): string => {
                for (const n of names) {
                    const idx = headerIdx[n];
                    if (idx !== undefined) return (parts[idx] || "").trim();
                }
                return "";
            };

            const batch = dataLines
                .map((line) => {
                    const parts = parseCSVLine(line);
                    const name = hasHeader
                        ? getBy(["name", "nom"], parts)
                        : parts[0] || "";
                    const tableName = hasHeader
                        ? getBy(["table_name", "table"], parts)
                        : parts[1] || "";
                    const phone = hasHeader
                        ? getBy(
                              ["phone", "telephone", "téléphone", "tel"],
                              parts,
                          )
                        : parts[2] || "";
                    const email = hasHeader
                        ? getBy(["email", "e-mail"], parts)
                        : parts[3] || "";
                    const hasSaltFreeDiet = hasHeader
                        ? getBy(
                              [
                                  "has_salt_free_diet",
                                  "salt_free_diet",
                                  "regime",
                                  "diet",
                              ],
                              parts,
                          )
                        : parts[4] || "";
                    return {
                        guestName: name,
                        guestEmail: email || undefined,
                        guestPhone: phone || undefined,
                        guestTableName: tableName || undefined,
                        hasSaltFreeDiet:
                            hasSaltFreeDiet?.toLowerCase() === "true" ||
                            hasSaltFreeDiet?.toLowerCase() === "1" ||
                            false,
                    };
                })
                .filter((i) => i.guestName);
            parsedBatch.splice(0, parsedBatch.length, ...batch);
            if (parsedBatch.length === 0) {
                useAppToast().showWarning(
                    "Fichier vide",
                    "Aucune ligne valide détectée.",
                );
            } else {
                useAppToast().showSuccess(
                    "Fichier analysé",
                    `${parsedBatch.length} lignes détectées. Cliquez Importer.`,
                );
            }
        } catch (_e) {
            const e: any = _e;
            useAppToast().showError(
                "Erreur import",
                e?.message || "Impossible de traiter le CSV.",
            );
        }
    };
    reader.readAsText(file);
};

const importSubmitting = ref(false);
const parsedBatch = reactive<
    Array<{
        guestName: string;
        guestEmail?: string;
        guestPhone?: string;
        guestTableName?: string;
    }>
>([]);
const importParsedBatch = async () => {
    if (!parsedBatch.length) return;
    try {
        importSubmitting.value = true;
        if (process.dev) {
            const payload = {
                invitations: parsedBatch.map((i) => ({
                    guest_name: i.guestName,
                    guest_email: i.guestEmail,
                    guest_phone: i.guestPhone,
                    guest_table_name: i.guestTableName,
                    has_salt_free_diet: i.hasSaltFreeDiet,
                })),
            };
            // eslint-disable-next-line no-console
            console.log(
                "[Invitations] Payload batch → POST /events/" +
                    eventId +
                    "/invitations",
                payload,
            );
        }
        await createInvitationsBatch(eventId, parsedBatch as any);
        useAppToast().showSuccess(
            "Import réussi",
            `${parsedBatch.length} invités importés.`,
        );
        parsedBatch.splice(0, parsedBatch.length);
        showImport.value = false;
        await refresh();
        await refreshCredits();
    } catch (e: any) {
        // L'erreur est déjà gérée par le plugin customFetch
        console.error("Erreur lors de l'import des invités:", e);
    } finally {
        importSubmitting.value = false;
    }
};

const downloadSampleCsv = () => {
    const rows = [
        ["name", "table_name", "phone", "email", "has_salt_free_diet"],
        ["Alice", "Table A", "243812345678", "alice@example.com", "true"],
        ["Bob", "", "", "", "false"],
    ];
    const csv = rows
        .map((r) =>
            r.map((v) => `"${String(v).replace(/\"/g, '""')}"`).join(","),
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invitations-example.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Fonctions pour les boissons
const openAddDrink = () => {
    // Initialiser avec les boissons existantes ou tableau vide
    drinkForm.value = drinks.value ? [...drinks.value] : [];
    currentDrink.value = null;
    showDrinkForm.value = true;
};

const openEditDrink = (drink: any) => {
    // Stocker les valeurs originales et une copie modifiable
    currentDrink.value = {
        name: drink.name,
        category: drink.category,
        originalName: drink.name,
        originalCategory: drink.category,
    };
    showDrinkForm.value = true;
};

const openDeleteDrink = (drink: any) => {
    currentDrink.value = drink;
    showDrinkDelete.value = true;
};

const handleAddDrinks = async (drinksData: any[]) => {
    try {
        drinksSubmitting.value = true;
        await addEventDrinks(eventId, drinksData);
        showDrinkForm.value = false;
        await refreshDrinks();
        useAppToast().showSuccess(
            "Boissons ajoutées",
            "Les boissons ont été ajoutées avec succès.",
        );
    } catch (e: any) {
        useAppToast().showError(
            "Erreur lors de l'ajout",
            getApiErrorMessage(e),
        );
    } finally {
        drinksSubmitting.value = false;
    }
};

const handleUpdateDrink = async (updatedDrink: any) => {
    try {
        drinksSubmitting.value = true;

        // Créer la nouvelle liste de boissons en remplaçant celle modifiée
        const currentDrinks = drinks.value || [];
        const updatedDrinks = currentDrinks.map((drink: any) => {
            // Trouver la boisson à remplacer (basé sur l'original avant modification)
            if (
                currentDrink.value &&
                drink.name === currentDrink.value.originalName &&
                drink.category === currentDrink.value.originalCategory
            ) {
                return {
                    name: updatedDrink.name,
                    category: updatedDrink.category,
                };
            }
            return drink;
        });

        await updateEventDrinks(eventId, updatedDrinks);
        showDrinkForm.value = false;
        currentDrink.value = null;
        await refreshDrinks();
        useAppToast().showSuccess(
            "Boisson mise à jour",
            "La boisson a été modifiée avec succès.",
        );
    } catch (e: any) {
        useAppToast().showError(
            "Erreur lors de la mise à jour",
            getApiErrorMessage(e),
        );
    } finally {
        drinksSubmitting.value = false;
    }
};

const handleUpdateDrinks = async (drinksData: any[]) => {
    try {
        drinksSubmitting.value = true;
        await updateEventDrinks(eventId, drinksData);
        showDrinkForm.value = false;
        await refreshDrinks();
        useAppToast().showSuccess(
            "Boissons mises à jour",
            "Les boissons ont été modifiées avec succès.",
        );
    } catch (e: any) {
        useAppToast().showError(
            "Erreur lors de la mise à jour",
            getApiErrorMessage(e),
        );
    } finally {
        drinksSubmitting.value = false;
    }
};

const handleDeleteDrink = async () => {
    try {
        drinksSubmitting.value = true;

        // Créer la nouvelle liste de boissons en supprimant celle sélectionnée
        const currentDrinks = drinks.value || [];
        const updatedDrinks = currentDrinks.filter((drink: any) => {
            // Filtrer la boisson à supprimer
            if (
                currentDrink.value &&
                drink.name === currentDrink.value.name &&
                drink.category === currentDrink.value.category
            ) {
                return false; // Supprimer cette boisson
            }
            return true; // Garder les autres
        });

        // Mettre à jour avec la liste sans la boisson supprimée
        await updateEventDrinks(eventId, updatedDrinks);
        showDrinkDelete.value = false;
        currentDrink.value = null;
        await refreshDrinks();
        useAppToast().showSuccess(
            "Boisson supprimée",
            "La boisson a été supprimée avec succès.",
        );
    } catch (e: any) {
        useAppToast().showError(
            "Erreur lors de la suppression",
            getApiErrorMessage(e),
        );
    } finally {
        drinksSubmitting.value = false;
    }
};

const handleDeleteAllDrinks = async () => {
    try {
        drinksSubmitting.value = true;
        await deleteEventDrinks(eventId);
        showDrinkDelete.value = false;
        await refreshDrinks();
        useAppToast().showSuccess(
            "Boissons supprimées",
            "Toutes les boissons ont été supprimées.",
        );
    } catch (e: any) {
        useAppToast().showError(
            "Erreur lors de la suppression",
            getApiErrorMessage(e),
        );
    } finally {
        drinksSubmitting.value = false;
    }
};
</script>
