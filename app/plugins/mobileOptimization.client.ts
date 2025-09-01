/**
 * Plugin pour optimiser l'expérience mobile globalement
 * S'exécute uniquement côté client
 */
export default defineNuxtPlugin(() => {
  const { initMobileOptimizations } = useMobileOptimization()
  
  // Initialiser les optimisations mobiles au démarrage de l'app
  initMobileOptimizations()
  
  // Ajouter des styles CSS globaux pour mobile
  if (process.client) {
    const style = document.createElement('style')
    style.textContent = `
      /* Optimisations globales pour mobile */
      @media (max-width: 768px) {
        /* Améliorer la réactivité des inputs */
        input, textarea, select {
          font-size: 16px !important; /* Évite le zoom sur iOS */
          -webkit-appearance: none;
          border-radius: 0;
        }
        
        /* Optimiser les boutons pour le touch */
        button, [role="button"], .ui-button {
          min-height: 44px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Améliorer l'espacement des éléments interactifs */
        .ui-input, .ui-textarea, .ui-select {
          margin-bottom: 1rem;
        }
        
        /* Optimiser les modals sur mobile */
        .ui-modal {
          padding: 1rem;
          max-height: 90vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Améliorer la scrollabilité */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Prévenir les problèmes de z-index */
        .ui-input, .ui-textarea, .ui-select {
          position: relative;
          z-index: 1;
        }
        
        /* Améliorer le focus sur mobile */
        input:focus, textarea:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(147, 58, 255, 0.2);
        }
      }
      
      /* Styles pour quand le clavier virtuel est ouvert */
      .keyboard-open {
        overflow: hidden;
      }
      
      .keyboard-open .ui-modal {
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }
      
      /* Améliorer l'accessibilité */
      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `
    document.head.appendChild(style)
  }
})
