<template>
  <div class="space-y-4">
    <!-- Bouton d'ajout -->
    <div class="flex justify-end">
      <UButton
        @click="$emit('add-sponsor')"
        color="primary"
        size="sm"
        class="shadow-sm"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Ajouter un sponsor
      </UButton>
    </div>

    <!-- Liste des sponsors -->
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-20 w-full" />
      <USkeleton class="h-20 w-full" />
      <USkeleton class="h-20 w-2/3" />
    </div>

    <div v-else-if="sponsors.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-building-office" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p class="text-sm text-gray-500 mb-4">Aucun sponsor configuré</p>
      <UButton
        @click="$emit('add-sponsor')"
        color="primary"
        size="sm"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Ajouter votre premier sponsor
      </UButton>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="sponsor in sponsors"
        :key="sponsor.id"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <!-- Informations du sponsor -->
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <img
              v-if="sponsor.logo_url"
              :src="sponsor.logo_url"
              :alt="sponsor.name"
              class="w-12 h-12 object-contain border border-gray-200 rounded-lg"
            />
            <div
              v-else
              class="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <!-- Détails -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-sm font-medium text-gray-900 truncate">{{ sponsor.name }}</h3>
              <UBadge
                :color="sponsor.is_active ? 'success' : 'neutral'"
                variant="soft"
                size="xs"
              >
                {{ sponsor.is_active ? 'Actif' : 'Inactif' }}
              </UBadge>
            </div>
            
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span v-if="sponsor.website_url" class="flex items-center gap-1">
                <UIcon name="i-heroicons-globe-alt" class="w-3 h-3" />
                <a
                  :href="sponsor.website_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-primary-600 truncate"
                >
                  {{ sponsor.website_url }}
                </a>
              </span>
              <span v-if="sponsor.description" class="truncate">
                {{ sponsor.description }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 ml-4">
          <UButton
            @click="$emit('view-sponsor', sponsor)"
            variant="ghost"
            color="primary"
            size="xs"
            :ui="{ base: 'min-h-[36px] min-w-[36px] p-1' }"
            title="Voir"
          >
            <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          </UButton>
          
          <UButton
            @click="$emit('edit-sponsor', sponsor)"
            variant="ghost"
            color="warning"
            size="xs"
            :ui="{ base: 'min-h-[36px] min-w-[36px] p-1' }"
            title="Modifier"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </UButton>
          
          <UButton
            @click="$emit('delete-sponsor', sponsor)"
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
  </div>
</template>

<script setup lang="ts">
import type { Sponsor } from '~/types/sponsors'

interface Props {
  sponsors: Sponsor[]
  loading?: boolean
}

interface Emits {
  (e: 'add-sponsor'): void
  (e: 'view-sponsor', sponsor: Sponsor): void
  (e: 'edit-sponsor', sponsor: Sponsor): void
  (e: 'delete-sponsor', sponsor: Sponsor): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
