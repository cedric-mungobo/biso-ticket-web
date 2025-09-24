/**
 * Composable pour la génération de canvas avec des fonctions modulaires
 * Permet d'ajouter facilement des images, textes, blocs, etc.
 */

export interface CanvasConfig {
  width: number
  height: number
  scale?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export interface TextOptions {
  x: number
  y: number
  text: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: number
}

export interface ImageOptions {
  x: number
  y: number
  width: number
  height: number
  maintainAspectRatio?: boolean
  fit?: 'cover' | 'contain' | 'fill'
  borderRadius?: number
}

export interface BlockOptions {
  x: number
  y: number
  width: number
  height: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  padding?: number
}

export interface QRCodeOptions {
  x: number
  y: number
  size: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export const useCanvas = () => {
  /**
   * Crée un nouveau canvas avec la configuration donnée
   */
  const createCanvas = (config: CanvasConfig): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
    const scale = config.scale || 1
    const canvasWidth = config.width * scale
    const canvasHeight = config.height * scale
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas')
    }
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    // Améliorer la qualité du canvas
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Fond
    if (config.backgroundColor) {
      ctx.fillStyle = config.backgroundColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
    
    // Bordure
    if (config.borderColor && config.borderWidth) {
      ctx.strokeStyle = config.borderColor
      ctx.lineWidth = (config.borderWidth || 1) * scale
      ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
    }
    
    return { canvas, ctx }
  }

  /**
   * Ajoute du texte au canvas
   */
  const addText = (ctx: CanvasRenderingContext2D, options: TextOptions, scale: number = 1): void => {
    const {
      x, y, text, fontSize = 14, fontFamily = 'Arial', fontWeight = 'normal',
      color = '#000000', textAlign = 'left', maxWidth
    } = options
    
    ctx.save()
    
    // Configuration de la police
    ctx.font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = textAlign
    
    // Dessiner le texte
    if (maxWidth) {
      // Texte avec largeur maximale (wrapping)
      const words = text.split(' ')
      let line = ''
      let lineY = y * scale
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > maxWidth * scale && i > 0) {
          ctx.fillText(line, x * scale, lineY)
          line = words[i] + ' '
          lineY += fontSize * scale * 1.2 // Espacement entre les lignes
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, x * scale, lineY)
    } else {
      ctx.fillText(text, x * scale, y * scale)
    }
    
    ctx.restore()
  }

  /**
   * Ajoute un bloc (rectangle) au canvas
   */
  const addBlock = (ctx: CanvasRenderingContext2D, options: BlockOptions, scale: number = 1): void => {
    const {
      x, y, width, height, backgroundColor, borderColor, borderWidth = 0,
      borderRadius = 0, padding = 0
    } = options
    
    ctx.save()
    
    const scaledX = x * scale
    const scaledY = y * scale
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    const scaledPadding = padding * scale
    const scaledBorderRadius = borderRadius * scale
    
    // Dessiner le bloc avec coins arrondis si nécessaire
    if (scaledBorderRadius > 0) {
      ctx.beginPath()
      ctx.roundRect(
        scaledX + scaledPadding,
        scaledY + scaledPadding,
        scaledWidth - (scaledPadding * 2),
        scaledHeight - (scaledPadding * 2),
        scaledBorderRadius
      )
    } else {
      ctx.rect(
        scaledX + scaledPadding,
        scaledY + scaledPadding,
        scaledWidth - (scaledPadding * 2),
        scaledHeight - (scaledPadding * 2)
      )
    }
    
    // Remplir le bloc
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor
      ctx.fill()
    }
    
    // Dessiner la bordure
    if (borderColor && borderWidth > 0) {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth * scale
      ctx.stroke()
    }
    
    ctx.restore()
  }

  /**
   * Ajoute une image au canvas
   */
  const addImage = async (
    ctx: CanvasRenderingContext2D,
    imageUrl: string,
    options: ImageOptions,
    scale: number = 1
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!imageUrl || imageUrl.trim().length === 0) {
        console.warn('⚠️ [CANVAS] URL d\'image vide')
        resolve(false)
        return
      }
      
      // Nettoyer l'URL
      let cleanUrl = imageUrl.trim()
      cleanUrl = cleanUrl.replace(/\/+/g, '/')
      
      if (cleanUrl.startsWith('http:/') && !cleanUrl.startsWith('http://')) {
        cleanUrl = cleanUrl.replace('http:/', 'http://')
      }
      if (cleanUrl.startsWith('https:/') && !cleanUrl.startsWith('https://')) {
        cleanUrl = cleanUrl.replace('https:/', 'https://')
      }
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          const {
            x, y, width, height, maintainAspectRatio = true,
            fit = 'contain', borderRadius = 0
          } = options
          
          const scaledX = x * scale
          const scaledY = y * scale
          const scaledWidth = width * scale
          const scaledHeight = height * scale
          const scaledBorderRadius = borderRadius * scale
          
          ctx.save()
          
          // Créer un chemin de découpage si border radius
          if (scaledBorderRadius > 0) {
            ctx.beginPath()
            ctx.roundRect(scaledX, scaledY, scaledWidth, scaledHeight, scaledBorderRadius)
            ctx.clip()
          }
          
          // Calculer les dimensions de dessin
          let drawX = scaledX
          let drawY = scaledY
          let drawWidth = scaledWidth
          let drawHeight = scaledHeight
          
          if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height
            const targetAspectRatio = scaledWidth / scaledHeight
            
            if (fit === 'cover') {
              // Couvrir toute la zone (peut couper l'image)
              if (aspectRatio > targetAspectRatio) {
                drawHeight = scaledHeight
                drawWidth = scaledHeight * aspectRatio
                drawX = scaledX + (scaledWidth - drawWidth) / 2
              } else {
                drawWidth = scaledWidth
                drawHeight = scaledWidth / aspectRatio
                drawY = scaledY + (scaledHeight - drawHeight) / 2
              }
            } else {
              // Contenir dans la zone (ajuste la taille)
              if (aspectRatio > targetAspectRatio) {
                drawWidth = scaledWidth
                drawHeight = scaledWidth / aspectRatio
                drawY = scaledY + (scaledHeight - drawHeight) / 2
              } else {
                drawHeight = scaledHeight
                drawWidth = scaledHeight * aspectRatio
                drawX = scaledX + (scaledWidth - drawWidth) / 2
              }
            }
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
          ctx.restore()
          
          console.log('✅ [CANVAS] Image ajoutée avec succès')
          resolve(true)
        } catch (error) {
          console.error('❌ [CANVAS] Erreur lors du dessin de l\'image:', error)
          resolve(false)
        }
      }
      
      img.onerror = (error) => {
        console.error('❌ [CANVAS] Impossible de charger l\'image:', error)
        resolve(false)
      }
      
      img.src = cleanUrl
    })
  }

  /**
   * Ajoute un QR code au canvas
   */
  const addQRCode = async (
    ctx: CanvasRenderingContext2D,
    qrData: string,
    options: QRCodeOptions,
    scale: number = 1
  ): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        const { x, y, size, backgroundColor = '#ffffff', borderColor = '#d1d5db', borderWidth = 1 } = options
        
        const scaledX = x * scale
        const scaledY = y * scale
        const scaledSize = size * scale
        const scaledBorderWidth = borderWidth * scale
        
        // Fond du QR code
        ctx.save()
        ctx.fillStyle = backgroundColor
        ctx.fillRect(scaledX - scaledBorderWidth, scaledY - scaledBorderWidth, scaledSize + (scaledBorderWidth * 2), scaledSize + (scaledBorderWidth * 2))
        
        // Bordure du QR code
        if (borderColor && borderWidth > 0) {
          ctx.strokeStyle = borderColor
          ctx.lineWidth = scaledBorderWidth
          ctx.strokeRect(scaledX - scaledBorderWidth, scaledY - scaledBorderWidth, scaledSize + (scaledBorderWidth * 2), scaledSize + (scaledBorderWidth * 2))
        }
        
        // Générer le QR code
        const { $qrCodeStyling } = useNuxtApp()
        
        if ($qrCodeStyling) {
          const qrCodeStyling = $qrCodeStyling({
            width: scaledSize,
            height: scaledSize,
            type: 'svg',
            data: qrData,
            dotsOptions: {
              color: '#000000',
              type: 'rounded',
            },
            backgroundOptions: {
              color: '#ffffff',
            },
          })

          const svg = await qrCodeStyling.getRawData('svg')
          
          if (svg) {
            let svgString: string
            if (typeof svg === 'string') {
              svgString = svg
            } else if (svg instanceof Blob) {
              svgString = await svg.text()
            } else {
              svgString = svg.toString('utf8')
            }

            const qrImg = new Image()
            await new Promise<void>((resolveImg, rejectImg) => {
              const timeout = setTimeout(() => {
                rejectImg(new Error('Timeout loading QR code'))
              }, 5000)
              
              qrImg.onload = () => {
                clearTimeout(timeout)
                ctx.drawImage(qrImg, scaledX, scaledY, scaledSize, scaledSize)
                ctx.restore()
                console.log('✅ [CANVAS] QR code ajouté avec succès')
                resolve(true)
              }
              qrImg.onerror = () => {
                clearTimeout(timeout)
                console.warn('❌ [CANVAS] Impossible de générer le QR code')
                ctx.restore()
                resolve(false)
              }
              qrImg.src = `data:image/svg+xml;base64,${btoa(svgString)}`
            })
          } else {
            ctx.restore()
            resolve(false)
          }
        } else {
          // Fallback: texte simple
          ctx.fillStyle = '#666'
          ctx.font = `${12 * scale}px Arial`
          ctx.textAlign = 'center'
          ctx.fillText('QR Code', scaledX + scaledSize / 2, scaledY + scaledSize / 2)
          ctx.fillText('(À scanner)', scaledX + scaledSize / 2, scaledY + scaledSize / 2 + 15 * scale)
          ctx.restore()
          resolve(true)
        }
      } catch (error) {
        console.error('❌ [CANVAS] Erreur lors de la génération du QR code:', error)
        resolve(false)
      }
    })
  }

  /**
   * Ajoute un placeholder d'image
   */
  const addImagePlaceholder = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number = 1,
    text: string = 'Image non disponible'
  ): void => {
    const scaledX = x * scale
    const scaledY = y * scale
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    
    ctx.save()
    
    // Fond gris clair
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
    
    // Bordure pointillée
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2 * scale
    ctx.setLineDash([5 * scale, 5 * scale])
    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
    ctx.setLineDash([])
    
    // Icône d'image centrée
    ctx.fillStyle = '#9ca3af'
    ctx.font = `${32 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('🖼️', scaledX + scaledWidth / 2, scaledY + scaledHeight / 2 - 10 * scale)
    
    // Texte
    ctx.fillStyle = '#6b7280'
    ctx.font = `bold ${12 * scale}px Arial`
    ctx.fillText(text, scaledX + scaledWidth / 2, scaledY + scaledHeight / 2 + 15 * scale)
    
    // Texte explicatif
    ctx.fillStyle = '#9ca3af'
    ctx.font = `${10 * scale}px Arial`
    ctx.fillText('(non disponible)', scaledX + scaledWidth / 2, scaledY + scaledHeight / 2 + 30 * scale)
    
    ctx.restore()
  }

  /**
   * Exporte le canvas en image
   */
  const exportCanvas = (canvas: HTMLCanvasElement, filename: string = 'canvas.png'): boolean => {
    try {
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch (error) {
      console.error('❌ [CANVAS] Erreur lors de l\'export:', error)
      return false
    }
  }

  /**
   * Vérifie si une URL d'image est valide
   */
  const isValidImageUrl = (imageUrl: string | null | undefined): boolean => {
    if (!imageUrl || imageUrl.trim().length === 0) {
      return false
    }
    
    try {
      new URL(imageUrl.trim())
      return true
    } catch {
      return false
    }
  }

  return {
    createCanvas,
    addText,
    addBlock,
    addImage,
    addQRCode,
    addImagePlaceholder,
    exportCanvas,
    isValidImageUrl
  }
}
