<template>
  <section
    class=" py-16 md:py-20"
    aria-labelledby="hero-heading"
  >
    <div class="container mx-auto px-4 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
      <!-- Left Column -->
      <div class="flex flex-1 flex-col gap-6 lg:gap-8">
        <!-- Section Title -->
        <div class="flex flex-col gap-6">
          <!-- Main Heading -->
          <h1 id="hero-heading" class="text-4xl md:text-6xl font-bold text-balance">
            Achetez vos billets pour vos événements préférés          </h1>
          <!-- Description -->
          <p class="text-muted-foreground text-base lg:text-lg">
            La plateforme qui vous permet de vendre et acheter des billets en ligne
            pour tous vos événements avec paiement mobile money
          </p>
        </div>

        <!-- Feature List -->
        <div class="flex flex-col gap-2 md:gap-3">
          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <Check class="text-primary h-5 w-5" />
            </div>
            <span class="text-foreground text-base leading-6 font-medium">
              Paiement mobile money sécurisé
            </span>
          </div>

          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <Check class="text-primary h-5 w-5" />
            </div>
            <span class="text-foreground text-base leading-6 font-medium">
              Gestion complète des événements
            </span>
          </div>

          <div class="flex items-start gap-3">
            <div class="pt-0.5">
              <Check class="text-primary h-5 w-5" />
            </div>
            <span class="text-foreground text-base leading-6 font-medium">
              Invitations digitales personnalisées
            </span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col gap-3 sm:flex-row">
          <Button class=" text-white">Commencer gratuitement</Button>
          <Button variant="ghost">
            Voir les événements
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-full flex-1">
        <AspectRatio :ratio="1">
          <NuxtImg
            src="/assets/images/hero.jpg"
            alt="Hero visual"
            class="h-full w-full rounded-xl object-cover"
            loading="eager"
            width="600"
            height="600"
          />
        </AspectRatio>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, ArrowRight } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import AspectRatio from '~/components/ui/AspectRatio.vue'
import Tagline from '~/components/pro-blocks/landing-page/Tagline.vue'
</script>
