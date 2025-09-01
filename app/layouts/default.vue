<template>
  <div>
    <UiHeader/>

    <div class="pt-14">
      <!-- Alerte pour les erreurs de validation API -->
      <div class="container mx-auto px-4 py-2">
        <ValidationErrorsAlert />
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


</script>

<style>

</style>