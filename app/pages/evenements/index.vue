<template>
  <main class="px-4 py-8 md:px-8  mt-20 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
        Découvrez les événements à venir
      </h1>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <EventCard
          v-for="idea in ideas"
          :key="idea.id"
          :category="idea.category"
          :title="idea.title"
          :image="idea.preview.kind === 'image' ? idea.preview.src : undefined"
          :date="idea.date"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Category = 'Image' | 'Code' | 'Rédaction'

type Idea = {
  id: string
  category: Category
  title: string
  date: string
  preview: {
    kind: 'image'
    src: string
    alt: string
  } | {
    kind: 'gradient'
    variant: string
  }
}

const ideas = ref<Idea[]>([
  {
    id: '1',
    category: 'Image',
    title: 'Une l\'horizon de ville au crépuscule',
    date: '2024-01-15',
    preview: {
      kind: 'image',
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1280&auto=format&fit=crop',
      alt: 'Ligne d\'horizon de ville au crépuscule',
    },
  },
  {
    id: '2',
    category: 'Code',
    title: "Une carte d'anniversaire au format numérique qui fait exploser des confettis",
    date: '2024-01-20',
    preview: { kind: 'gradient', variant: 'party' },
  },
  {
    id: '3',
    category: 'Rédaction',
    title: 'Une entrée de journal à propos de la façon dont vous vous voyez dans 10 ans',
    date: '2024-01-25',
    preview: { kind: 'gradient', variant: 'lines' },
  },
  {
    id: '4',
    category: 'Code',
    title: 'Un jeu de mémoire amusant',
    date: '2024-02-01',
    preview: { kind: 'gradient', variant: 'memory-grid' },
  },
  {
    id: '5',
    category: 'Image',
    title: 'Un repas sain et délicieux à base de pâtes',
    date: '2024-02-05',
    preview: {
      kind: 'image',
      src: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1280&auto=format&fit=crop',
      alt: 'Plat de pâtes sain et délicieux',
    },
  },
  {
    id: '6',
    category: 'Rédaction',
    title: 'Une critique d\'une série de livres que vous avez découverte récemment',
    date: '2024-02-10',
    preview: { kind: 'gradient', variant: 'lines' },
  },
  {
    id: '7',
    category: 'Image',
    title: 'Un joli bureau',
    date: '2024-02-15',
    preview: {
      kind: 'image',
      src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1280&auto=format&fit=crop',
      alt: 'Joli bureau pastel et minimaliste',
    },
  },
  {
    id: '8',
    category: 'Code',
    title: 'Un jeu interactif de fiches mémo',
    date: '2024-02-20',
    preview: { kind: 'gradient', variant: 'app-ui' },
  },
  {
    id: '9',
    category: 'Rédaction',
    title: "Une analyse de l'évolution des préférences alimentaires des consommateurs",
    date: '2024-02-25',
    preview: { kind: 'gradient', variant: 'lines' },
  },
  {
    id: '10',
    category: 'Rédaction',
    title: 'Un poème sur les sons d\'une ville à l\'aube',
    date: '2024-03-01',
    preview: { kind: 'gradient', variant: 'lines' },
  },
  {
    id: '11',
    category: 'Code',
    title: 'Un menu interactif pour mon restaurant',
    date: '2024-03-05',
    preview: { kind: 'gradient', variant: 'lines' },
  },
  {
    id: '12',
    category: 'Image',
    title: 'Une ascension du Mont Everest',
    date: '2024-03-10',
    preview: {
      kind: 'image',
      src: 'https://images.unsplash.com/photo-1508261303786-0e3b9a5d2d5b?q=80&w=1280&auto=format&fit=crop',
      alt: 'Paysage de montagne au lever du soleil',
    },
  },
])
</script>