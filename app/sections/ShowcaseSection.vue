<template>
  <section class="py-16 md:py-24 ">
    <div class="relative mx-auto max-w-5xl px-4">
      <!-- Background Effect -->
      <div class="absolute -z-50 size-[400px] -top-10 -left-20 aspect-square rounded-full bg-purple-500/10 blur-3xl"></div>
      
      <!-- Description -->
      <p 
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200"
        class="text-gray-800 text-lg text-left max-w-3xl"
      >
        Organisez votre événement à Kinshasa avec Biso Ticket, la plateforme de billetterie en ligne qui vous permet de créer, gérer et vendre vos billets facilement. Vos participants peuvent payer par mobile money (Orange Money, M-Pesa, Airtel Money).
      </p>
      
      <!-- Content Grid -->
      <div 
     
        class="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10"
      >
        <!-- Main Image -->
        <div class="md:col-span-2"    v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="200"
        :duration="1200">
          <img 
            alt="Interface Biso Ticket - Dashboard organisateur" 
            src="/assets/images/hero.jpg"
            class="w-full h-auto rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
        
        <!-- Side Content -->
        <div class="md:col-span-1"    v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0 }"
        :delay="220"
        :duration="1500">
          <img 
            alt="Application mobile Biso Ticket" 
            src="/assets/images/ticket.jpg"
            class="w-full h-auto rounded-xl shadow-md hover:-translate-y-0.5 transition duration-300"
            loading="lazy"
          />
          
          <h3 class="text-[24px]/7.5 text-gray-800 font-medium mt-6">
            Une plateforme complète pour maximiser vos revenus
          </h3>
          <p class="text-gray-600 mt-2">
            Biso Ticket vous permet de créer des événements exceptionnels et de générer plus de revenus grâce à une gestion optimisée.
          </p>
          
          <NuxtLink 
            to="/organisateur" 
            class="group flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 transition"
          >
            Découvrir la plateforme
            <Icon 
              name="lucide:arrow-up-right" 
              class="w-5 h-5 group-hover:translate-x-0.5 transition duration-300" 
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Section showcase - pas de métadonnées SEO nécessaires
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>
