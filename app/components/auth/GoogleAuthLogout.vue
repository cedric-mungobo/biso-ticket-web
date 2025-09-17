<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-yellow-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-yellow-800">
          Déconnexion Google
        </h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p>
            Vous êtes connecté avec Google. Voulez-vous vous déconnecter de votre compte Google ?
          </p>
        </div>
        <div class="mt-4">
          <div class="-mx-2 -my-1.5 flex">
            <button
              @click="$emit('logout')"
              class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
            >
              Se déconnecter
            </button>
            <button
              @click="$emit('cancel')"
              class="ml-3 bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{
  logout: []
  cancel: []
}>()
</script>