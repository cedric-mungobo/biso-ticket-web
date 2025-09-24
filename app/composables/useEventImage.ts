/**
 * Composable pour gérer l'affichage des images d'événements
 * Gère les problèmes CORS et fournit des solutions de fallback
 */

export interface EventImageOptions {
  scale?: number
  width?: number
  height?: number
  x?: number
  y?: number
  onSuccess?: (img: HTMLImageElement) => void
  onError?: (error: any) => void
}

export const useEventImage = () => {
  /**
   * Charge et dessine une image d'événement sur un canvas
   * @param ctx - Contexte du canvas
   * @param imageUrl - URL de l'image
   * @param options - Options de configuration
   * @returns Promise qui se résout quand l'image est chargée ou qu'un fallback est appliqué
   */
  const drawEventImageOnCanvas = async (
    ctx: CanvasRenderingContext2D, 
    imageUrl: string, 
    options: EventImageOptions = {}
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      console.log('🖼️ [EVENT-IMAGE] Chargement de l\'image:', imageUrl)
      
      if (!imageUrl || imageUrl.trim().length === 0) {
        console.warn('⚠️ [EVENT-IMAGE] URL d\'image vide ou invalide')
        resolve()
        return
      }
      
      // Nettoyer l'URL en supprimant les doubles slashes
      let finalUrl = imageUrl.trim()
      
      // Corriger les doubles slashes dans l'URL
      finalUrl = finalUrl.replace(/\/+/g, '/')
      
      // Si l'URL commence par http:// ou https://, corriger le protocole
      if (finalUrl.startsWith('http:/') && !finalUrl.startsWith('http://')) {
        finalUrl = finalUrl.replace('http:/', 'http://')
      }
      if (finalUrl.startsWith('https:/') && !finalUrl.startsWith('https://')) {
        finalUrl = finalUrl.replace('https:/', 'https://')
      }
      
      console.log('🔧 [EVENT-IMAGE] URL nettoyée:', finalUrl)
      
      const drawImageOnCanvas = (img: HTMLImageElement) => {
        try {
          console.log('🎨 [EVENT-IMAGE] Début du dessin de l\'image sur le canvas')
          console.log('📏 [EVENT-IMAGE] Dimensions de l\'image:', { width: img.width, height: img.height })
          console.log('🔗 [EVENT-IMAGE] Source de l\'image:', img.src)
          
          // Utiliser les options ou les valeurs par défaut
          const scale = options.scale || 1
          const imageWidth = options.width || (400 - 40) * scale
          const imageHeight = options.height || 100 * scale
          const imageX = options.x || 20 * scale
          const imageY = options.y || 90 * scale
          
          console.log('📐 [EVENT-IMAGE] Zone de dessin:', { imageX, imageY, imageWidth, imageHeight })
          
          // Dessiner l'image en gardant les proportions
          const aspectRatio = img.width / img.height
          let drawWidth = imageWidth
          let drawHeight = imageHeight
          let drawX = imageX
          let drawY = imageY
          
          if (aspectRatio > imageWidth / imageHeight) {
            // L'image est plus large que l'espace disponible
            drawHeight = imageWidth / aspectRatio
            drawY = imageY + (imageHeight - drawHeight) / 2
            console.log('📐 [EVENT-IMAGE] Image plus large - ajustement hauteur:', { drawHeight, drawY })
          } else {
            // L'image est plus haute que l'espace disponible
            drawWidth = imageHeight * aspectRatio
            drawX = imageX + (imageWidth - drawWidth) / 2
            console.log('📐 [EVENT-IMAGE] Image plus haute - ajustement largeur:', { drawWidth, drawX })
          }
          
          console.log('🎨 [EVENT-IMAGE] Coordonnées finales de dessin:', { drawX, drawY, drawWidth, drawHeight })
          console.log('🎨 [EVENT-IMAGE] Appel de ctx.drawImage...')
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
          
          console.log('✅ [EVENT-IMAGE] Image de l\'événement dessinée avec succès sur le canvas!')
          
          // Appeler le callback de succès si fourni
          if (options.onSuccess) {
            options.onSuccess(img)
          }
          
          resolve()
        } catch (error: any) {
          console.error('❌ [EVENT-IMAGE] Erreur lors du dessin de l\'image:', error)
          console.error('🔍 [EVENT-IMAGE] Stack trace:', error?.stack)
          resolve()
        }
      }
      
      try {
        console.log('🖼️ [EVENT-IMAGE] Création de l\'élément Image...')
        const img = new Image()
        
        // Configurer CORS avant de définir la source
        img.crossOrigin = 'anonymous'
        
        console.log('🖼️ [EVENT-IMAGE] Configuration des événements...')
        img.onload = () => {
          console.log('✅ [EVENT-IMAGE] Image chargée avec succès!')
          console.log('📏 [EVENT-IMAGE] Dimensions:', { width: img.width, height: img.height })
          console.log('🔗 [EVENT-IMAGE] Source finale:', img.src)
          console.log('🎨 [EVENT-IMAGE] Appel de drawImageOnCanvas...')
          drawImageOnCanvas(img)
        }
        
        img.onerror = (error) => {
          console.error('❌ [EVENT-IMAGE] Impossible de charger l\'image!')
          console.error('🔍 [EVENT-IMAGE] Erreur détaillée:', error)
          console.error('🔗 [EVENT-IMAGE] URL qui a échoué:', finalUrl)
          
          // Appeler le callback d'erreur si fourni
          if (options.onError) {
            options.onError(error)
          }
          
          resolve()
        }
        
        console.log('🖼️ [EVENT-IMAGE] Attribution de l\'URL à l\'image...')
        console.log('🔗 [EVENT-IMAGE] URL finale:', finalUrl)
        img.src = finalUrl
        console.log('🖼️ [EVENT-IMAGE] Image.src assigné, attente des événements...')
        
      } catch (error: any) {
        console.error('❌ [EVENT-IMAGE] Erreur dans le try/catch:', error)
        console.error('🔍 [EVENT-IMAGE] Type d\'erreur:', typeof error)
        
        if (options.onError) {
          options.onError(error)
        }
        
        resolve()
      }
    })
  }

  /**
   * Dessine un placeholder d'image sur un canvas
   * @param ctx - Contexte du canvas
   * @param x - Position X
   * @param y - Position Y
   * @param width - Largeur
   * @param height - Hauteur
   * @param scale - Facteur d'échelle
   */
  const drawImagePlaceholder = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    scale: number = 1
  ) => {
    console.log('🎨 [EVENT-IMAGE] Dessin du placeholder aux coordonnées:', { x, y, width, height, scale })
    
    // Fond gris clair
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(x, y, width, height)
    console.log('✅ [EVENT-IMAGE] Fond gris dessiné')
    
    // Bordure pointillée
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2 * scale
    ctx.setLineDash([5 * scale, 5 * scale])
    ctx.strokeRect(x, y, width, height)
    ctx.setLineDash([])
    console.log('✅ [EVENT-IMAGE] Bordure pointillée dessinée')
    
    // Icône d'image centrée
    ctx.fillStyle = '#9ca3af'
    ctx.font = `${32 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('🖼️', x + width / 2, y + height / 2 - 10 * scale)
    console.log('✅ [EVENT-IMAGE] Icône dessinée')
    
    // Texte "Image de l'événement"
    ctx.fillStyle = '#6b7280'
    ctx.font = `bold ${12 * scale}px Arial`
    ctx.fillText('Image de l\'événement', x + width / 2, y + height / 2 + 15 * scale)
    console.log('✅ [EVENT-IMAGE] Texte principal dessiné')
    
    // Texte explicatif
    ctx.fillStyle = '#9ca3af'
    ctx.font = `${10 * scale}px Arial`
    ctx.fillText('(non disponible)', x + width / 2, y + height / 2 + 30 * scale)
    console.log('✅ [EVENT-IMAGE] Texte explicatif dessiné')
    
    console.log('🎨 [EVENT-IMAGE] Placeholder complètement dessiné')
  }

  /**
   * Vérifie si une URL d'image est valide
   * @param imageUrl - URL à vérifier
   * @returns true si l'URL est valide
   */
  const isValidImageUrl = (imageUrl: string | null | undefined): boolean => {
    if (!imageUrl || imageUrl.trim().length === 0) {
      return false
    }
    
    // Vérifier si c'est une URL valide
    try {
      new URL(imageUrl.trim())
      return true
    } catch {
      return false
    }
  }

  /**
   * Nettoie une URL d'image en supprimant les doubles slashes
   * @param imageUrl - URL à nettoyer
   * @returns URL nettoyée
   */
  const cleanImageUrl = (imageUrl: string): string => {
    let cleanUrl = imageUrl.trim()
    
    // Corriger les doubles slashes dans l'URL
    cleanUrl = cleanUrl.replace(/\/+/g, '/')
    
    // Si l'URL commence par http:// ou https://, corriger le protocole
    if (cleanUrl.startsWith('http:/') && !cleanUrl.startsWith('http://')) {
      cleanUrl = cleanUrl.replace('http:/', 'http://')
    }
    if (cleanUrl.startsWith('https:/') && !cleanUrl.startsWith('https://')) {
      cleanUrl = cleanUrl.replace('https:/', 'https://')
    }
    
    return cleanUrl
  }

  return {
    drawEventImageOnCanvas,
    drawImagePlaceholder,
    isValidImageUrl,
    cleanImageUrl
  }
}
