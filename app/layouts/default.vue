<template>
  <div>
    <UiHeader/>

    <div>
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
</script>

<style>

</style>