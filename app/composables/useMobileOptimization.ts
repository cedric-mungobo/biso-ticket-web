/**
 * Composable pour optimiser l'expérience mobile
 * Gère les problèmes courants d'inputs et de modals sur mobile
 */
export const useMobileOptimization = () => {
  /**
   * Empêche le zoom automatique sur iOS quand on focus un input
   */
  const preventZoomOnFocus = () => {
    if (process.client) {
      const inputs = document.querySelectorAll('input, textarea, select')
      
      inputs.forEach(input => {
        // Définir la taille de police à 16px pour éviter le zoom sur iOS
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
          input.style.fontSize = '16px'
          
          // Ajouter les attributs pour améliorer la compatibilité mobile
          input.setAttribute('autocomplete', 'off')
          input.setAttribute('autocorrect', 'off')
          input.setAttribute('autocapitalize', 'off')
          input.setAttribute('spellcheck', 'false')
        }
      })
    }
  }

  /**
   * Gère le comportement du clavier virtuel sur mobile
   */
  const handleVirtualKeyboard = () => {
    if (process.client) {
      let initialViewportHeight = window.innerHeight
      
      const handleResize = () => {
        const currentHeight = window.innerHeight
        const heightDifference = initialViewportHeight - currentHeight
        
        // Si la différence est significative, le clavier est probablement ouvert
        if (heightDifference > 150) {
          document.body.classList.add('keyboard-open')
          
          // Scroll vers l'input actif
          const activeElement = document.activeElement
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            setTimeout(() => {
              activeElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              })
            }, 300)
          }
        } else {
          document.body.classList.remove('keyboard-open')
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      // Cleanup
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
      })
    }
  }

  /**
   * Améliore la réactivité des touches sur mobile
   */
  const optimizeTouchEvents = () => {
    if (process.client) {
      // Ajouter des styles CSS pour améliorer les performances de touch
      const style = document.createElement('style')
      style.textContent = `
        * {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        input, textarea, select {
          -webkit-user-select: text;
          user-select: text;
        }
        
        button, [role="button"] {
          -webkit-user-select: none;
          user-select: none;
          min-height: 44px;
        }
        
        .keyboard-open {
          overflow: hidden;
        }
        
        .keyboard-open .modal-content {
          transform: translateY(-20px);
        }
      `
      document.head.appendChild(style)
    }
  }

  /**
   * Initialise toutes les optimisations mobiles
   */
  const initMobileOptimizations = () => {
    if (process.client) {
      preventZoomOnFocus()
      handleVirtualKeyboard()
      optimizeTouchEvents()
    }
  }

  /**
   * Scroll vers un élément spécifique (utile pour les modals)
   */
  const scrollToElement = (selector: string, options: ScrollIntoViewOptions = {}) => {
    if (process.client) {
      const element = document.querySelector(selector)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          ...options
        })
      }
    }
  }

  /**
   * Détecte si l'appareil est mobile
   */
  const isMobile = computed(() => {
    if (process.client) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             window.innerWidth <= 768
    }
    return false
  })

  /**
   * Détecte si l'appareil est iOS
   */
  const isIOS = computed(() => {
    if (process.client) {
      return /iPad|iPhone|iPod/.test(navigator.userAgent)
    }
    return false
  })

  return {
    preventZoomOnFocus,
    handleVirtualKeyboard,
    optimizeTouchEvents,
    initMobileOptimizations,
    scrollToElement,
    isMobile,
    isIOS
  }
}
