<template>
  <div>
    <!-- <Announcement/> -->
    <AppHeader/>

    <div class=" min-h-[100dvh]">

      <slot/>

    </div>
    <AppFooter/>
    <MobileBottomNav/>
  </div>
</template>

<script lang="ts" setup>
import Announcement from '~/components/Announcement.vue';
import AppFooter from '~/components/AppFooter.vue';
import AppHeader from '~/components/appHedaer.vue';
import MobileBottomNav from '~/components/MobileBottomNav.vue';
</script>

<style>

</style>