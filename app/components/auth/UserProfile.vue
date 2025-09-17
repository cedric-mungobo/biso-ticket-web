<template>
  <div v-if="user" class="flex items-center space-x-3">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
        <Icon 
          :name="isGoogleUser ? 'logos:google-icon' : 'heroicons:user'" 
          class="w-5 h-5 text-primary-600" 
        />
      </div>
    </div>

    <!-- Informations utilisateur -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">
        {{ user.name }}
      </p>
      <p class="text-xs text-gray-500 truncate">
        {{ user.email }}
      </p>
    </div>

    <!-- Badge Google -->
    <div v-if="isGoogleUser" class="flex-shrink-0">
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        Google
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Composables
const { user, isGoogleUser } = useAuthState()
</script>
