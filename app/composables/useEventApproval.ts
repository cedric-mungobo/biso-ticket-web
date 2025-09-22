/**
 * Composable pour gérer la logique d'approbation des événements
 */
export const useEventApproval = () => {
  /**
   * Vérifie si un événement est approuvé (peut vendre des billets)
   */
  const isEventApproved = (event: any): boolean => {
    if (!event) return false
    
    // Debug pour voir la valeur exacte d'approvedAt
    if (process.client && process.dev) {
      console.log('[DEBUG] isEventApproved - event.approvedAt:', event.approvedAt)
      console.log('[DEBUG] isEventApproved - typeof:', typeof event.approvedAt)
      console.log('[DEBUG] isEventApproved - conditions:', {
        notUndefined: event.approvedAt !== undefined,
        notNull: event.approvedAt !== null,
        notEmpty: event.approvedAt !== '',
        allConditions: event.approvedAt !== undefined && event.approvedAt !== null && event.approvedAt !== ''
      })
    }
    
    // Seul le champ approvedAt détermine l'approbation
    // Si approvedAt est présent et non vide, l'événement est approuvé
    if (event.approvedAt !== undefined && event.approvedAt !== null && event.approvedAt !== '') {
      return true
    }
    
    // Si approvedAt est explicitement null, l'événement n'est pas approuvé
    // même s'il est actif et public
    if (event.approvedAt === null) {
      return false
    }
    
    // Fallback : logique basée sur le statut et la visibilité
    // Un événement est approuvé s'il est actif et public (seulement si approvedAt n'est pas défini)
    return event.status === 'active' && event.is_public
  }

  /**
   * Obtient le label du statut de l'événement
   */
  const getEventStatusLabel = (status: string): string => {
    const statusLabels = {
      'draft': 'Brouillon',
      'active': 'Actif',
      'ended': 'Terminé',
      'cancelled': 'Annulé',
      'suspended': 'Suspendu'
    }
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  /**
   * Obtient le label du statut d'approbation
   */
  const getApprovalStatusLabel = (approvalStatus: string): string => {
    const approvalLabels = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    }
    return approvalLabels[approvalStatus as keyof typeof approvalLabels] || approvalStatus
  }

  /**
   * Obtient le titre de la bannière d'approbation
   */
  const getApprovalBannerTitle = (event: any): string => {
    if (!event) return 'Événement en attente de validation'
    
    if (event.approvalStatus === 'rejected') {
      return 'Événement rejeté'
    }
    
    if (event.approvalStatus === 'pending') {
      return 'Événement en attente de validation'
    }
    
    if (event.status === 'draft') {
      return 'Événement en brouillon'
    }
    
    if (event.status === 'suspended') {
      return 'Événement suspendu'
    }
    
    if (!event.is_public) {
      return 'Événement privé'
    }
    
    return 'Événement en attente de validation'
  }

  /**
   * Obtient le message de la bannière d'approbation
   */
  const getApprovalBannerMessage = (event: any): string => {
    if (!event) return 'Veuillez patienter pendant la validation de votre événement pour commencer à vendre les billets.'
    
    if (event.approvalStatus === 'rejected') {
      return 'Votre événement a été rejeté. Veuillez contacter le support pour plus d\'informations.'
    }
    
    if (event.approvalStatus === 'pending') {
      return 'Veuillez patienter pendant la validation de votre événement pour commencer à vendre les billets.'
    }
    
    if (event.status === 'draft') {
      return 'Votre événement est en brouillon. Finalisez-le et publiez-le pour commencer à vendre les billets.'
    }
    
    if (event.status === 'suspended') {
      return 'Votre événement a été suspendu. Contactez le support pour plus d\'informations.'
    }
    
    if (!event.is_public) {
      return 'Votre événement est privé. Rendez-le public pour commencer à vendre les billets.'
    }
    
    return 'Veuillez patienter pendant la validation de votre événement pour commencer à vendre les billets.'
  }

  /**
   * Formate la date d'approbation pour l'affichage
   */
  const formatApprovalDate = (approvedAt: string): string => {
    if (!approvedAt) return ''
    
    try {
      const date = new Date(approvedAt)
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.warn('Date d\'approbation invalide:', approvedAt)
        return ''
      }
      
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.warn('Erreur lors du formatage de la date d\'approbation:', error)
      return ''
    }
  }

  /**
   * Obtient le temps écoulé depuis l'approbation
   */
  const getApprovalTimeAgo = (approvedAt: string): string => {
    if (!approvedAt) return ''
    
    try {
      const date = new Date(approvedAt)
      
      if (isNaN(date.getTime())) {
        return ''
      }
      
      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      
      if (diffInDays > 0) {
        return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
      } else if (diffInHours > 0) {
        return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
      } else if (diffInMinutes > 0) {
        return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
      } else {
        return 'à l\'instant'
      }
    } catch (error) {
      console.warn('Erreur lors du calcul du temps écoulé:', error)
      return ''
    }
  }

  return {
    isEventApproved,
    getEventStatusLabel,
    getApprovalStatusLabel,
    getApprovalBannerTitle,
    getApprovalBannerMessage,
    formatApprovalDate,
    getApprovalTimeAgo
  }
}
