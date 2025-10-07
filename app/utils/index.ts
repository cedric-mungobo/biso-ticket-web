export const { format: formatNumber } = Intl.NumberFormat('en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1
  })

/**
 * Formate un montant avec des espaces comme séparateurs de milliers
 * @param amount - Le montant à formater
 * @returns Le montant formaté (ex: 1000 -> "1 000")
 */
export const formatMoney = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0'
  return Math.round(amount).toLocaleString('fr-FR')
}

/**
 * Formate une date en français avec jour, mois, année et heure
 * @param dateString - La date à formater (string ou Date)
 * @returns La date formatée (ex: "lundi 1 janvier 2025 à 18:00")
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Calcule la taille de police dynamique selon la longueur du texte
 * @param text - Le texte à analyser
 * @returns La taille de police recommandée
 */
export const calculateDynamicFontSize = (text: string): number => {
  if (!text) return 32
  
  const textLength = text.length
  let baseSize = 40
  
  if (textLength > 200) baseSize = 36
  if (textLength > 400) baseSize = 32
  if (textLength > 600) baseSize = 28
  if (textLength > 800) baseSize = 24
  if (textLength > 1000) baseSize = 18
  
  return baseSize
}



  