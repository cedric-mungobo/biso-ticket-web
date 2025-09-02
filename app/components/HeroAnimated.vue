<template>
    <main ref="container" class="relative h-[200vh]">
      <!-- Section 1 - Light Hero Section -->
      <section
        ref="section1"
        :style="{
          transform: `scale(${section1Scale}) rotate(${section1Rotate}deg)`,
        }"
        class=""
      >
       
     <Hero />
      </section>
  
      <!-- Section 2 - Dark Image Section -->
      <section
        ref="section2"
        :style="{
          transform: `scale(${section2Scale}) rotate(${section2Rotate}deg)`,
        }"
        class="relative h-[90dvh] bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white"
      >
        <!-- Grid Pattern Overlay -->
        <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <article class="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl leading-[100%] py-8 pt-36 sm:py-10 font-semibold tracking-tight">
            Découvrez nos événements <br /> exceptionnels
          </h1> 
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <NuxtImg
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop"
              alt="Concert en plein air"
              class="object-cover w-full rounded-md h-48 sm:h-64 lg:h-80"
              loading="lazy"
            />
            <NuxtImg
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop"
              alt="Festival de musique"
              class="object-cover w-full rounded-md h-32 sm:h-48 lg:h-64"
              loading="lazy"
            />
            <NuxtImg
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop"
              alt="Événement corporate"
              class="object-cover w-full rounded-md h-48 sm:h-64 lg:h-80"
              loading="lazy"
            />
            <NuxtImg
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&auto=format&fit=crop"
              alt="Mariage élégant"
              class="object-cover w-full rounded-md h-32 sm:h-48 lg:h-64"
              loading="lazy"
            />
          </div>
          
          <!-- Description -->
          <div class="mt-8 sm:mt-12 text-center">
            <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Concerts, festivals, mariages, événements corporate... 
              Biso Ticket vous accompagne dans l'organisation de tous vos événements avec des solutions de billetterie modernes et sécurisées.
            </p>
          </div>
        </article>
      </section>
  
    
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  
  const container = ref(null)
  const section1 = ref(null)
  const section2 = ref(null)
  const scrollY = ref(0)
  
  // Calculate scroll progress
  const scrollProgress = computed(() => {
    if (!container.value) return 0
    const containerHeight = container.value.offsetHeight
    const windowHeight = window.innerHeight
    const maxScroll = containerHeight - windowHeight
    return Math.min(Math.max(scrollY.value / maxScroll, 0), 1)
  })
  
  // Transform values for Section 1
  const section1Scale = computed(() => {
    return 1 - (scrollProgress.value * 0.2) // Scale from 1 to 0.8
  })
  
  const section1Rotate = computed(() => {
    return scrollProgress.value * -5 // Rotate from 0 to -5 degrees
  })
  
  // Transform values for Section 2
  const section2Scale = computed(() => {
    const progress = Math.min(scrollProgress.value / 0.8, 1) // Normalise sur 0-0.8
    return 0.8 + (progress * 0.2) // Scale from 0.8 to 1 sur les 80% premiers
  })
  
  const section2Rotate = computed(() => {
    const progress = Math.min(scrollProgress.value / 0.8, 1) // Normalise sur 0-0.8
    return 5 - (progress * 5) // Rotate from 5 to 0 degrees sur les 80% premiers
  })
  
  const handleScroll = () => {
    scrollY.value = window.scrollY
  }
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  </script>
  
  <style scoped>
  /* Smooth transitions for transforms */
  section {
    transition: transform 0.1s ease-out;
  }
  </style>