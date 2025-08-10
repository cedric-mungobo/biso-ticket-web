<template>
  <div>
    <AppHeader/>
    <slot/>
    <AppFooter/>
    <Announcement/>
  </div>
</template>

<script lang="ts" setup>
import Announcement from '~/components/Announcement.vue';
import AppFooter from '~/components/AppFooter.vue';
import AppHeader from '~/components/appHedaer.vue';
</script>

<style>

</style>