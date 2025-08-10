<template>
  <div>
    <!-- ========== HEADER ========== -->
    <header class="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-[26px] before:bg-neutral-800/30 before:backdrop-blur-md">
      <nav class="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 ps-5 pe-2 md:py-0 mx-2 lg:mx-auto">
        <!-- Logo -->
        <div class="flex items-center">
          <a class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="/" aria-label="Biso Ticket">
            <span class="text-white font-bold text-2xl">Biso Ticket</span>
          </a>
        </div>
        <!-- End Logo -->

        <!-- Navigation Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" href="/">
            Accueil
          </a>
          <a class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" href="/evenements">
            Événements
          </a>
          <a class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" href="/organisateur">
            Organisateur
          </a>
          <a class="pe-3 ps-px sm:px-3 md:py-4 text-sm text-white hover:text-neutral-300 focus:outline-hidden focus:text-neutral-300" href="/contact">
            Contact
          </a>
        </div>
        <!-- End Navigation Menu -->

        <!-- Button Group -->
        <div class="md:order-3 flex items-center gap-x-2">
          <div class="md:ps-3">
            <a class="group inline-flex items-center gap-x-2 py-2 px-2 bg-[#ff0] font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden" href="/connexion">
              Connexion
            </a>
          </div>
          <div class="md:ps-3">
            <a class="group inline-flex items-center gap-x-2 py-2 px-2 bg-white font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden hover:bg-neutral-100" href="/inscription">
              Inscription
            </a>
          </div>
        </div>
        <!-- End Button Group -->

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            type="button" 
            class="hs-collapse-toggle size-9 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white disabled:opacity-50 disabled:pointer-events-none"
            @click="toggleMobileMenu"
            aria-label="Toggle mobile menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <!-- End Mobile Menu Button -->
      </nav>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-neutral-800/90 backdrop-blur-md rounded-b-[26px] mx-2">
        <div class="px-6 py-4 space-y-3">
          <a class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" href="/" @click="closeMobileMenu">
            Accueil
          </a>
          <a class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" href="/evenements" @click="closeMobileMenu">
            Événements
          </a>
          <a class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" href="/organisateur" @click="closeMobileMenu">
            Organisateur
          </a>
          <a class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" href="/contact" @click="closeMobileMenu">
            Contact
          </a>
          <div class="pt-4 space-y-3 border-t border-neutral-700">
            <a class="block text-white hover:text-neutral-300 px-3 py-2 text-sm font-medium transition-colors duration-200" href="/connexion" @click="closeMobileMenu">
              Connexion
            </a>
            <a class="block bg-[#ff0] text-neutral-800 px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 hover:bg-yellow-200" href="/inscription" @click="closeMobileMenu">
              Inscription
            </a>
          </div>
        </div>
      </div>
      <!-- End Mobile Menu -->
    </header>
    <!-- ========== END HEADER ========== -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>