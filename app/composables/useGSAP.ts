import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { TextPlugin } from 'gsap/TextPlugin'

export const useGSAP = () => {
  // Vérifier que nous sommes côté client
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)
  }

  // Fonction utilitaire pour les animations d'entrée
  const animateIn = (
    element: string | Element | Element[],
    options: {
      duration?: number
      delay?: number
      ease?: string
      y?: number
      opacity?: number
      scale?: number
      rotation?: number
    } = {}
  ) => {
    const {
      duration = 0.8,
      delay = 0,
      ease = 'power2.out',
      y = 50,
      opacity = 0,
      scale = 1,
      rotation = 0
    } = options

    return gsap.fromTo(
      element,
      {
        y,
        opacity,
        scale,
        rotation
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration,
        delay,
        ease
      }
    )
  }

  // Fonction utilitaire pour les animations de sortie
  const animateOut = (
    element: string | Element | Element[],
    options: {
      duration?: number
      delay?: number
      ease?: string
      y?: number
      opacity?: number
      scale?: number
      rotation?: number
    } = {}
  ) => {
    const {
      duration = 0.6,
      delay = 0,
      ease = 'power2.in',
      y = -50,
      opacity = 0,
      scale = 0.8,
      rotation = 0
    } = options

    return gsap.to(element, {
      y,
      opacity,
      scale,
      rotation,
      duration,
      delay,
      ease
    })
  }

  // Fonction pour créer des animations au scroll
  const createScrollAnimation = (
    element: string | Element | Element[],
    options: {
      trigger?: string | Element
      start?: string
      end?: string
      scrub?: boolean
      markers?: boolean
      onEnter?: () => void
      onLeave?: () => void
      onEnterBack?: () => void
      onLeaveBack?: () => void
    } = {}
  ) => {
    const {
      trigger = element,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      markers = false,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack
    } = options

    // Si l'élément est un tableau, utiliser le premier élément comme trigger
    const triggerElement = Array.isArray(element) ? element[0] : element

    return ScrollTrigger.create({
      trigger: triggerElement,
      start,
      end,
      scrub,
      markers,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack
    })
  }

  // Fonction pour nettoyer les animations
  const cleanup = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  // Fonction pour créer une timeline avec des animations séquentielles
  const createTimeline = (options: {
    delay?: number
    repeat?: number
    yoyo?: boolean
  } = {}) => {
    return gsap.timeline(options)
  }

  // Fonction pour animer plusieurs éléments avec stagger
  const staggerAnimation = (
    elements: string | Element | Element[],
    options: {
      duration?: number
      delay?: number
      stagger?: number
      ease?: string
      y?: number
      opacity?: number
      scale?: number
      rotation?: number
    } = {}
  ) => {
    const {
      duration = 0.6,
      delay = 0,
      stagger = 0.1,
      ease = 'power2.out',
      y = 30,
      opacity = 0,
      scale = 1,
      rotation = 0
    } = options

    return gsap.fromTo(
      elements,
      {
        y,
        opacity,
        scale,
        rotation
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration,
        delay,
        ease,
        stagger
      }
    )
  }

  // Fonction pour vérifier si GSAP est disponible
  const isGSAPAvailable = () => {
    return typeof gsap !== 'undefined'
  }

  // Fonction pour vérifier les préférences de réduction de mouvement
  const prefersReducedMotion = () => {
    if (process.client) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  }

  // Fonction pour animer avec respect des préférences d'accessibilité
  const accessibleAnimation = (
    element: string | Element | Element[],
    animationFunction: () => any,
    fallback?: () => void
  ) => {
    if (prefersReducedMotion()) {
      // Si l'utilisateur préfère moins de mouvement, exécuter le fallback ou rien
      if (fallback) {
        fallback()
      }
      return null
    }
    
    // Sinon, exécuter l'animation normale
    return animationFunction()
  }

  return {
    gsap,
    ScrollTrigger,
    ScrollToPlugin,
    TextPlugin,
    animateIn,
    animateOut,
    createScrollAnimation,
    createTimeline,
    staggerAnimation,
    isGSAPAvailable,
    prefersReducedMotion,
    accessibleAnimation,
    cleanup
  }
}
