import type { MotionVariants } from '@vueuse/motion'

/**
 * Composable pour gérer les animations @vueuse/motion
 * Fournit des presets personnalisés et des utilitaires pour les animations "visible once"
 */
export const useMotionPresets = () => {
  /**
   * Presets d'animation personnalisés pour les animations "visible once"
   */
  const motionPresets = {
    // Fade animations
    fadeVisibleOnce: {
      initial: { opacity: 0 },
      enter: { 
        opacity: 1,
        transition: {
          duration: 600,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    // Slide animations
    slideVisibleOnceBottom: {
      initial: { opacity: 0, y: 50 },
      enter: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 800,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    slideVisibleOnceTop: {
      initial: { opacity: 0, y: -50 },
      enter: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 800,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    slideVisibleOnceLeft: {
      initial: { opacity: 0, x: -50 },
      enter: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 800,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    slideVisibleOnceRight: {
      initial: { opacity: 0, x: 50 },
      enter: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 800,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    // Roll animations
    rollVisibleOnceBottom: {
      initial: { opacity: 0, y: 50, rotateX: -90 },
      enter: { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: {
          duration: 1000,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    rollVisibleOnceTop: {
      initial: { opacity: 0, y: -50, rotateX: 90 },
      enter: { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: {
          duration: 1000,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    rollVisibleOnceLeft: {
      initial: { opacity: 0, x: -50, rotateY: -90 },
      enter: { 
        opacity: 1, 
        x: 0, 
        rotateY: 0,
        transition: {
          duration: 1000,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    rollVisibleOnceRight: {
      initial: { opacity: 0, x: 50, rotateY: 90 },
      enter: { 
        opacity: 1, 
        x: 0, 
        rotateY: 0,
        transition: {
          duration: 1000,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    // Pop animation
    popVisibleOnce: {
      initial: { opacity: 0, scale: 0.8 },
      enter: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 700,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    // Stagger animations pour les listes
    staggerFadeVisibleOnce: {
      initial: { opacity: 0, y: 20 },
      enter: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 600,
          ease: 'easeOut',
          stagger: 0.1
        }
      }
    } as MotionVariants<any>,
    
    // Animation spéciale pour les cartes
    cardVisibleOnce: {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      enter: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 800,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>,
    
    // Animation pour les boutons
    buttonVisibleOnce: {
      initial: { opacity: 0, scale: 0.9 },
      enter: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 500,
          ease: 'easeOut'
        }
      }
    } as MotionVariants<any>
  }

  /**
   * Crée une animation personnalisée avec des paramètres spécifiques
   */
  const createCustomAnimation = (
    initialProps: Record<string, any>,
    enterProps: Record<string, any>,
    options: {
      duration?: number
      ease?: string
      delay?: number
      stagger?: number
    } = {}
  ): MotionVariants<any> => {
    const { duration = 600, ease = 'easeOut', delay = 0, stagger } = options
    
    return {
      initial: initialProps,
      enter: {
        ...enterProps,
        transition: {
          duration,
          ease,
          delay,
          ...(stagger && { stagger })
        }
      }
    }
  }

  /**
   * Animation de séquence pour les éléments qui apparaissent l'un après l'autre
   */
  const createSequenceAnimation = (
    elements: Array<{
      initial: Record<string, any>
      enter: Record<string, any>
      delay?: number
    }>
  ): MotionVariants<any>[] => {
    return elements.map((element, index) => ({
      initial: element.initial,
      enter: {
        ...element.enter,
        transition: {
          duration: 600,
          ease: 'easeOut',
          delay: element.delay || index * 100
        }
      }
    }))
  }

  return {
    motionPresets,
    createCustomAnimation,
    createSequenceAnimation
  }
}
