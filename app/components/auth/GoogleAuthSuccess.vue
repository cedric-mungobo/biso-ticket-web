<template>
  <div class="bg-green-50 border border-green-200 rounded-md p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-800">
          Connexion réussie !
        </h3>
        <div class="mt-2 text-sm text-green-700">
          <p>
            Bienvenue {{ user?.name }} ! Vous êtes maintenant connecté avec votre compte Google.
          </p>
        </div>
        <div class="mt-3">
          <div class="text-xs text-green-600">
            <p>
              <strong>Prochaine étape :</strong> Vous allez être redirigé vers votre tableau de bord.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Composables
const { user } = useAuthState()
</script>
