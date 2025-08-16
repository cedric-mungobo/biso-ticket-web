import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { TextPlugin } from 'gsap/TextPlugin'

// Enregistrer les plugins GSAP
if (process.client) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      gsap,
      ScrollTrigger,
      ScrollToPlugin,
      TextPlugin
    }
  }
})
