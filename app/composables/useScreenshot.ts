import { ref } from 'vue'

// Import dynamique de html2canvas pour éviter les problèmes SSR
let html2canvas: any = null

if (process.client) {
  import('html2canvas').then(module => {
    html2canvas = module.default
  })
}

export const useScreenshot = () => {
  const isCapturing = ref(false)

  const captureElement = async (elementId: string, options?: {
    filename?: string
    quality?: number
    backgroundColor?: string
    scale?: number
  }) => {
    // Vérifier que nous sommes côté client
    if (!process.client) {
      throw new Error('html2canvas ne peut être utilisé que côté client')
    }

    // Attendre que html2canvas soit chargé
    if (!html2canvas) {
      console.log('⏳ Chargement de html2canvas...')
      await new Promise(resolve => {
        const checkHtml2canvas = () => {
          if (html2canvas) {
            resolve(true)
          } else {
            setTimeout(checkHtml2canvas, 100)
          }
        }
        checkHtml2canvas()
      })
    }

    console.log('🔍 Recherche de l\'élément:', elementId)
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('❌ Élément non trouvé:', elementId)
      throw new Error(`Élément avec l'ID "${elementId}" non trouvé`)
    }

    console.log('✅ Élément trouvé:', element)
    isCapturing.value = true

    try {
      console.log('📸 Début de la capture...')
      
      // Attendre que l'élément soit complètement rendu
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(element, {
        backgroundColor: options?.backgroundColor || '#ffffff',
        scale: options?.scale || 3, // Qualité plus élevée
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        // Configuration optimisée pour la qualité
        foreignObjectRendering: false,
        removeContainer: true,
        // Améliorer la qualité du texte
        letterRendering: true,
        // Ignorer les éléments problématiques
        ignoreElements: (el: any) => {
          // Ignorer les éléments avec des styles problématiques
          const style = window.getComputedStyle(el)
          return style.display === 'none' || 
                 style.visibility === 'hidden' ||
                 el.offsetWidth === 0 ||
                 el.offsetHeight === 0
        },
        // Configuration simplifiée pour éviter les erreurs
        // Pas de onclone pour éviter les problèmes avec clonedDoc.head
      })

      console.log('✅ Canvas créé:', canvas)

      // Convertir en blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            console.log('✅ Blob créé:', blob.size, 'bytes')
            resolve(blob)
          } else {
            console.error('❌ Erreur lors de la création du blob')
            reject(new Error('Erreur lors de la création du blob'))
          }
        }, 'image/png', options?.quality || 1)
      })
    } catch (error) {
      console.error('❌ Erreur lors de la capture:', error)
      throw error
    } finally {
      isCapturing.value = false
    }
  }

  const downloadScreenshot = async (elementId: string, options?: {
    filename?: string
    quality?: number
    backgroundColor?: string
    scale?: number
  }) => {
    try {
      console.log('🚀 Début du téléchargement de l\'élément:', elementId)
      const blob = await captureElement(elementId, options)
      
      console.log('📥 Création du lien de téléchargement...')
      // Créer le lien de téléchargement
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = options?.filename || 'invitation.png'
      
      console.log('💾 Téléchargement du fichier:', link.download)
      // Déclencher le téléchargement
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url)
      
      console.log('✅ Téléchargement terminé avec succès')
      return true
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error)
      throw error
    }
  }

  return {
    isCapturing,
    captureElement,
    downloadScreenshot
  }
}
