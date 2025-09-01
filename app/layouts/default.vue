<template>
  <div>
    <UiHeader/>

    <div class="pt-20">
      <!-- Alerte pour les erreurs de validation API -->
      <div class="container mx-auto px-4 py-2">
        <ValidationErrorsAlert />
      </div>
      
      <!-- Bouton de test temporaire (à supprimer après test) -->
      <div v-if="isDev" class="container mx-auto px-4 py-2">
        <UButton 
          @click="testValidationErrors" 
          color="error" 
          variant="outline" 
          size="sm"
        >
          Test Erreurs Validation
        </UButton>
      </div>
      
      <slot/>
    </div>

    <UFooter>
      <AppFooter/>
    </UFooter>

    <MobileBottomNav/>
  </div>
</template>

<script lang="ts" setup>
import Announcement from '~/components/Announcement.vue';
import AppFooter from '~/components/AppFooter.vue';
import UiHeader from '~/components/UiHeader.vue';
import MobileBottomNav from '~/components/MobileBottomNav.vue';
import ValidationErrorsAlert from '~/components/ValidationErrorsAlert.vue';

// Vérifier si on est en mode développement
const isDev = process.dev

// Fonction de test pour les erreurs de validation (dev seulement)
const testValidationErrors = () => {
  const { $validationErrors } = useNuxtApp()
  const validationErrors = $validationErrors as Ref<Record<string, string[]>>
  
  // Simuler des erreurs de validation
  validationErrors.value = {
    title: ['Le titre est requis'],
    starts_at: ['La date de début est invalide'],
    image: ['L\'image est trop volumineuse']
  }
  
  console.log('Test validation errors set:', validationErrors.value)
}
</script>

<style>

</style>