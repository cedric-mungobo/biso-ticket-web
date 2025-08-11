<template>
  <div>
    <!-- <Announcement/> -->
    <AppHeader/>
    <slot/>
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