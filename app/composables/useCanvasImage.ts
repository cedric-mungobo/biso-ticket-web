import { ref } from 'vue'

export const useCanvasImage = () => {
  const isGenerating = ref(false)

  const generateInvitationImage = async (invitationData: {
    guestMessage?: string
    backgroundImage?: string
    textStartY?: number
    textColor?: string
    titleColor?: string
    accentColor?: string
    signatureColor?: string
    messagePadding?: number
    textAlign?: 'left' | 'center' | 'right'
    messageFontSize?: number
  }) => {
    if (!process.client) {
      throw new Error('Canvas ne peut être utilisé que côté client')
    }

    isGenerating.value = true

    try {
      // Créer un canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Impossible de créer le contexte Canvas')
      }

      // Dimensions du canvas
      const width = 1000
      const height = 1200
      canvas.width = width
      canvas.height = height

      // Fond blanc par défaut d'abord
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Charger l'image de fond si fournie
      if (invitationData.backgroundImage) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise((resolve) => {
          img.onload = () => {
            if (process.dev) console.log('🎨 Dessin de l\'image de fond sur le canvas')
            // Dessiner l'image de fond par-dessus le fond blanc
            ctx.drawImage(img, 0, 0, width, height)
            // Forcer le redraw
            ctx.save()
            ctx.restore()
            resolve(true)
          }
          img.onerror = () => {
            if (process.dev) console.log('❌ Erreur chargement image principale, utilisation du fallback')
            // Fallback vers template_default.png
            const fallbackImg = new Image()
            fallbackImg.crossOrigin = 'anonymous'
            fallbackImg.onload = () => {
              if (process.dev) console.log('🎨 Dessin de l\'image de fallback sur le canvas')
              ctx.drawImage(fallbackImg, 0, 0, width, height)
              ctx.save()
              ctx.restore()
              resolve(true)
            }
            fallbackImg.onerror = () => {
              if (process.dev) console.log('❌ Erreur chargement fallback, garde le fond blanc')
              resolve(true)
            }
            fallbackImg.src = '/models/template_default.png'
          }
          img.src = invitationData.backgroundImage!
        })
      }

      // Configuration des polices
      const primaryFont = 'Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
      const serifFont = 'Georgia, Times New Roman, serif'
      const scriptFont = 'Brush Script MT, cursive'

      // Couleurs élégantes avec possibilité de personnalisation
      const primaryColor = invitationData.textColor || '#2d3748' // gray-700
      const accentColor = invitationData.accentColor || '#d4af37' // gold
      const titleColor = invitationData.titleColor || '#2d3748' // gray-700
      const secondaryColor = '#8b5a3c' // brown
      const lightGray = '#718096' // gray-500
      const veryLightGray = '#e2e8f0' // gray-200
      

      // Fonction pour dessiner du texte avec wrap et gestion des retours à la ligne
      const drawText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, fontFamily: string, color: string, align: 'left' | 'center' | 'right' = 'center') => {
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = align
        ctx.textBaseline = 'top'
        
        if (process.dev) console.log('🎨 Dessin du texte avec couleur:', color)

        // Traiter le formatage personnalisé
        const processedText = processCanvasFormatting(text)
        if (process.dev) console.log('🎨 Texte original:', text)
        if (process.dev) console.log('🎨 Texte traité:', processedText)
        
        // Diviser le texte en lignes (retours à la ligne)
        const lines = processedText.split('\n')
        if (process.dev) console.log('🎨 Lignes à traiter:', lines.length, lines)
        let lineY = y

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex]
          if (process.dev) console.log(`🎨 Traitement ligne ${lineIndex + 1}/${lines.length}:`, line)
          
          if (!line || line.trim() === '') {
            // Ligne vide - ajouter un espacement
            lineY += fontSize * 0.8
            continue
          }

          // Traitement spécial pour la première ligne non-vide (titre automatique)
          if (lineIndex === 0 || (lineIndex === 1 && !lines[0]?.trim())) {
            if (process.dev) console.log('🎨 Première ligne détectée comme titre:', line)
            
            // Détecter le niveau du titre et nettoyer le texte
            let cleanTitle = line
            let titleLevel = 1
            let titleSize = fontSize * 1.5
            
            // Détecter le niveau du titre
            if (line.match(/^\[###/)) {
              titleLevel = 3
              titleSize = fontSize * 1.1
              cleanTitle = cleanTitle.replace(/^\[###\s*(.*?)\s*###\]$/, '$1')
            } else if (line.match(/^\[##/)) {
              titleLevel = 2
              titleSize = fontSize * 1.2
              cleanTitle = cleanTitle.replace(/^\[##\s*(.*?)\s*##\]$/, '$1')
            } else if (line.match(/^\[#/)) {
              titleLevel = 1
              titleSize = fontSize * 1.5
              cleanTitle = cleanTitle.replace(/^\[#\s*(.*?)\s*#\]$/, '$1')
            }
            
            // Enlever les espaces en début et fin
            cleanTitle = cleanTitle.trim()
            
            if (process.dev) console.log(`🎨 Titre niveau ${titleLevel} nettoyé:`, cleanTitle, `(taille: ${titleSize})`)
            
            // Dessiner le titre avec la taille appropriée
            ctx.font = `bold ${titleSize}px ${fontFamily}`
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            const titleX = width / 2
            
            // Appliquer les majuscules seulement pour le niveau 1
            const displayText = titleLevel === 1 ? cleanTitle.toUpperCase() : cleanTitle
            ctx.fillText(displayText, titleX, lineY)
            
            // Espacement selon le niveau
            const spacing = titleLevel === 1 ? fontSize * 2 : fontSize * 1.6
            lineY += spacing
            
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }

          // Vérifier si la ligne est un titre
          const titleMatch = line.match(/^\[#(.*?)#\]$/)
          const subtitleMatch = line.match(/^\[##(.*?)##\]$/)
          const subsubtitleMatch = line.match(/^\[###(.*?)###\]$/)
          
          if (titleMatch) {
            const content = titleMatch[1] || ''
            if (process.dev) console.log('🎨 Titre principal détecté:', content)
            
            // Dessiner le titre en plus grand et en gras
            ctx.font = `bold ${fontSize * 1.5}px ${fontFamily}`
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            const titleX = width / 2
            ctx.fillText(content.toUpperCase(), titleX, lineY)
            lineY += fontSize * 2 // Plus d'espace après le titre
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }
          
          if (subtitleMatch) {
            const content = subtitleMatch[1] || ''
            if (process.dev) console.log('🎨 Sous-titre détecté:', content)
            
            // Dessiner le sous-titre en plus grand
            ctx.font = `bold ${fontSize * 1.2}px ${fontFamily}`
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            const subtitleX = width / 2
            ctx.fillText(content, subtitleX, lineY)
            lineY += fontSize * 1.8
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }
          
          if (subsubtitleMatch) {
            const content = subsubtitleMatch[1] || ''
            if (process.dev) console.log('🎨 Sous-sous-titre détecté:', content)
            
            // Dessiner le sous-sous-titre en légèrement plus grand
            ctx.font = `bold ${fontSize * 1.1}px ${fontFamily}`
            ctx.fillStyle = color
            ctx.textAlign = 'center'
            const subsubtitleX = width / 2
            ctx.fillText(content, subsubtitleX, lineY)
            lineY += fontSize * 1.6
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }

          // Vérifier si la ligne a un alignement spécial
          const rightAlignMatch = line.match(/^\[>(.*?)<\]$/)
          const leftAlignMatch = line.match(/^\[<(.*?)<\]$/)
          const centerAlignMatch = line.match(/^\[>(.*?)>\]$/)
          
          if (rightAlignMatch) {
            const content = rightAlignMatch[1]
            if (process.dev) console.log('🎨 Alignement à droite détecté:', content)
            
            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`
            const textMetrics = ctx.measureText(content || '')
            const availableWidth = width - 2 * (invitationData.messagePadding || 120)
            
            if (textMetrics.width > availableWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || '').split(' ')
              let currentLine = ''
              
              for (let i = 0; i < words.length; i++) {
                const word = words[i]
                if (!word) continue
                
                const testLine = currentLine + (currentLine ? ' ' : '') + word
                const testMetrics = ctx.measureText(testLine)
                
                if (testMetrics.width <= availableWidth) {
                  currentLine = testLine
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = 'right'
                    const lineX = width - (invitationData.messagePadding || 120)
                    drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                    lineY += fontSize * 1.4
                  }
                  currentLine = word
                }
              }
              
              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = 'right'
                const lineX = width - (invitationData.messagePadding || 120)
                drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                lineY += fontSize * 1.4
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = 'right'
              const lineX = width - (invitationData.messagePadding || 120)
              
              if (process.dev) console.log('🎨 Position de dessin (droite):', { lineX, lineY })
              drawFormattedText(ctx, content || '', lineX, lineY, fontSize, fontFamily, color)
              lineY += fontSize * 1.4
            }
            
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }
          
          if (leftAlignMatch) {
            const content = leftAlignMatch[1]
            if (process.dev) console.log('🎨 Alignement à gauche détecté:', content)
            
            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`
            const textMetrics = ctx.measureText(content || '')
            const availableWidth = width - 2 * (invitationData.messagePadding || 120)
            
            if (textMetrics.width > availableWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || '').split(' ')
              let currentLine = ''
              
              for (let i = 0; i < words.length; i++) {
                const word = words[i]
                if (!word) continue
                
                const testLine = currentLine + (currentLine ? ' ' : '') + word
                const testMetrics = ctx.measureText(testLine)
                
                if (testMetrics.width <= availableWidth) {
                  currentLine = testLine
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = 'left'
                    const lineX = invitationData.messagePadding || 120
                    drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                    lineY += fontSize * 1.4
                  }
                  currentLine = word
                }
              }
              
              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = 'left'
                const lineX = invitationData.messagePadding || 120
                drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                lineY += fontSize * 1.4
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = 'left'
              const lineX = invitationData.messagePadding || 120
              
              if (process.dev) console.log('🎨 Position de dessin (gauche):', { lineX, lineY })
              drawFormattedText(ctx, content || '', lineX, lineY, fontSize, fontFamily, color)
              lineY += fontSize * 1.4
            }
            
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }
          
          if (centerAlignMatch) {
            const content = centerAlignMatch[1]
            if (process.dev) console.log('🎨 Alignement centré détecté:', content)
            
            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`
            const textMetrics = ctx.measureText(content || '')
            const availableWidth = width - 2 * (invitationData.messagePadding || 120)
            
            if (textMetrics.width > availableWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || '').split(' ')
              let currentLine = ''
              
              for (let i = 0; i < words.length; i++) {
                const word = words[i]
                if (!word) continue
                
                const testLine = currentLine + (currentLine ? ' ' : '') + word
                const testMetrics = ctx.measureText(testLine)
                
                if (testMetrics.width <= availableWidth) {
                  currentLine = testLine
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = 'center'
                    const lineX = width / 2
                    drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                    lineY += fontSize * 1.4
                  }
                  currentLine = word
                }
              }
              
              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = 'center'
                const lineX = width / 2
                drawFormattedText(ctx, currentLine, lineX, lineY, fontSize, fontFamily, color)
                lineY += fontSize * 1.4
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = 'center'
              const lineX = width / 2
              
              if (process.dev) console.log('🎨 Position de dessin (centré):', { lineX, lineY })
              drawFormattedText(ctx, content || '', lineX, lineY, fontSize, fontFamily, color)
              lineY += fontSize * 1.4
            }
            
            ctx.textAlign = align // Restaurer l'alignement par défaut
            continue
          }

          // Mesurer la ligne complète
          ctx.font = `${fontSize}px ${fontFamily}`
          const lineMetrics = ctx.measureText(line)
          
          if (lineMetrics.width <= maxWidth) {
            // La ligne tient dans la largeur maximale
            if (process.dev) console.log('🎨 Ligne complète dessinée:', line)
            drawFormattedText(ctx, line, x, lineY, fontSize, fontFamily, color)
            lineY += fontSize * 1.4
          } else {
            // La ligne est trop longue, la diviser en mots
            if (process.dev) console.log('🎨 Ligne trop longue, division en cours:', line)
            const words = line.split(' ')
            let currentLine = ''
            
            for (let i = 0; i < words.length; i++) {
              const word = words[i]
              if (!word) continue
              
              const testLine = currentLine + (currentLine ? ' ' : '') + word
              const testMetrics = ctx.measureText(testLine)
              
              if (testMetrics.width <= maxWidth) {
                currentLine = testLine
              } else {
                // Dessiner la ligne actuelle si elle n'est pas vide
                if (currentLine) {
                  if (process.dev) console.log('🎨 Ligne partielle dessinée:', currentLine)
                  drawFormattedText(ctx, currentLine, x, lineY, fontSize, fontFamily, color)
                  lineY += fontSize * 1.4
                }
                currentLine = word
              }
            }
            
            // Dessiner la dernière ligne
            if (currentLine) {
              if (process.dev) console.log('🎨 Dernière ligne dessinée:', currentLine)
              drawFormattedText(ctx, currentLine, x, lineY, fontSize, fontFamily, color)
              lineY += fontSize * 1.4
            }
          }
        }

        if (process.dev) console.log('🎨 Fin du traitement du texte. Dernière position Y:', lineY)
        return lineY
      }

      // Fonction pour traiter le formatage Canvas
      const processCanvasFormatting = (text: string): string => {
        return text
          // Supprimer le formatage pour l'instant
          .replace(/\*\*(.*?)\*\*/g, '$1') // **gras** → gras
          .replace(/\*(.*?)\*/g, '$1')     // *italique* → italique
          .replace(/_(.*?)_/g, '$1')       // _souligné_ → souligné
          .replace(/~(.*?)~/g, '$1')       // ~barré~ → barré
          .replace(/`(.*?)`/g, '$1')       // `code` → code
          // NE PAS toucher aux alignements: [>texte<], [<texte<], [>texte>] - les garder intacts
          // Séparateur: [---] → ligne vide
          .replace(/\[---\]/g, '\n\n')
          // Ne pas traiter les titres ici, ils seront gérés dans drawText
      }
      
      // Fonction pour dessiner du texte avec formatage
      const drawFormattedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, fontFamily: string, color: string) => {
        // Pour l'instant, dessiner le texte normal sans formatage
        // Le formatage sera géré plus tard
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = color
        ctx.fillText(text, x, y)
      }

      // Fonction pour dessiner du texte centré
      const drawCenteredText = (text: string, y: number, fontSize: number, fontFamily: string, color: string, maxWidth?: number) => {
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        if (process.dev) console.log('🎨 Dessin du texte centré avec couleur:', color)

        if (maxWidth) {
          return drawText(text, width / 2, y, maxWidth, fontSize, fontFamily, color, 'center')
        } else {
          ctx.fillText(text, width / 2, y)
          return y + fontSize * 1.2
        }
      }

      // Ne pas dessiner de fond dégradé si on a une image de fond
      if (!invitationData.backgroundImage) {
        // Dessiner un fond dégradé subtil seulement si pas d'image
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, '#fefefe')
        gradient.addColorStop(1, '#f8f9fa')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      // Pas d'éléments décoratifs pour laisser l'image de fond visible

      // Titre principal élégant
      let currentY = invitationData.textStartY || 120
      
      // Titre principal
      currentY = drawCenteredText('INVITATION', currentY, 42, serifFont, titleColor)
      
      currentY += 60

      // Message personnalisé uniquement
      if (invitationData.guestMessage && invitationData.guestMessage.trim()) {
        // Calculer le padding horizontal du message (par défaut 120px de chaque côté)
        const messagePaddingX = invitationData.messagePadding || 120
        const messageWidth = width - (messagePaddingX * 2)
        
        // Calculer la position X selon l'alignement
        const textAlign = invitationData.textAlign || 'center'
        let textX = width / 2
        if (textAlign === 'left') {
          textX = messagePaddingX
        } else if (textAlign === 'right') {
          textX = width - messagePaddingX
        }
        
        // Utiliser la fonction drawText améliorée pour gérer les retours à la ligne
        const fontSize = invitationData.messageFontSize || 20
        if (process.dev) console.log('🎨 Taille de police du message:', fontSize)
        currentY = drawText(invitationData.guestMessage, textX, currentY, messageWidth, fontSize, primaryFont, primaryColor, textAlign)
      }

      currentY += 80

      // Signature élégante (couleur différente du texte principal)
      const signatureColor = invitationData.signatureColor || invitationData.accentColor || '#d4af37'
      currentY = drawCenteredText('Powered by bisoticket.com', currentY, 18, primaryFont, signatureColor)

      // Ajouter des ombres subtiles pour plus d'élégance
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2

      // Test : afficher le canvas sur la page pour debug
      const canvasElement = canvas as HTMLCanvasElement
      canvasElement.style.position = 'fixed'
      canvasElement.style.top = '10px'
      canvasElement.style.right = '10px'
      canvasElement.style.zIndex = '9999'
      canvasElement.style.border = '2px solid red'
      canvasElement.style.maxWidth = '200px'
      canvasElement.style.maxHeight = '240px'
      document.body.appendChild(canvasElement)
      
      // Supprimer le canvas après 5 secondes
      setTimeout(() => {
        if (document.body.contains(canvasElement)) {
          document.body.removeChild(canvasElement)
        }
      }, 5000)

      // Convertir en blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Erreur lors de la conversion Canvas en Blob'))
          }
        }, 'image/png', 1.0)
      })

    } catch (error) {
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  const downloadInvitationImage = async (invitationData: {
    guestMessage?: string
    backgroundImage?: string
    textStartY?: number
    textColor?: string
    titleColor?: string
    accentColor?: string
    signatureColor?: string
    messagePadding?: number
    textAlign?: 'left' | 'center' | 'right'
    messageFontSize?: number
  }) => {
    try {
      const blob = await generateInvitationImage(invitationData)
      
      // Créer le lien de téléchargement
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invitation-${Date.now()}.png`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      throw error
    }
  }

  return {
    isGenerating,
    generateInvitationImage,
    downloadInvitationImage
  }
}
