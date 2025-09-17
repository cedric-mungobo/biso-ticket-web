import { ref, computed } from 'vue'

export interface InvitationTemplate {
  id: string
  title: string
  category: 'mariage' | 'entreprise' | 'anniversaire' | 'generique'
  message: string
}

export interface EventData {
  date?: string
  time?: string
  location?: string
  guestName?: string
  eventTitle?: string
  organizerName?: string
  years?: number
}

export const useInvitationTemplates = () => {
  const selectedTemplate = ref<string>('mariage-religieux')
  
  const templates: InvitationTemplate[] = [
    // MARIAGES
    {
      id: 'mariage-religieux',
      title: 'Mariage Religieux',
      category: 'mariage',
      message: `C\'est avec une immense joie que nous vous annonçons notre union sacrée devant Dieu.

Nous serions honorés de votre présence pour célébrer notre mariage religieux le [DATE] à [TIME] à [LOCATION].

Votre présence à nos côtés en ce jour si spécial nous comblerait de bonheur.

Avec tout notre amour,
[ORGANIZER_NAME]`
    },
    {
      id: 'mariage-civil',
      title: 'Mariage Civil',
      category: 'mariage',
      message: `Nous avons le plaisir de vous inviter à célébrer notre union civile.

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour partager ce moment de bonheur avec nous.

Votre présence nous fera le plus grand plaisir.

Avec affection,
[ORGANIZER_NAME]`
    },
    {
      id: 'mariage-intime',
      title: 'Mariage Intime',
      category: 'mariage',
      message: `Dans l\'intimité de nos cœurs, nous avons choisi de nous dire "oui".

Nous aimerions partager ce moment précieux avec vous le [DATE] à [TIME] à [LOCATION].

Votre présence discrète et bienveillante nous accompagnera dans cette nouvelle étape de notre vie.

Avec tendresse,
[ORGANIZER_NAME]`
    },

    // ÉVÉNEMENTS D'ENTREPRISE
    {
      id: 'soiree-entreprise',
      title: 'Soirée Entreprise',
      category: 'entreprise',
      message: `Nous avons le plaisir de vous convier à notre soirée d\'entreprise.

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour une soirée de networking et de célébration de nos succès.

Au programme : cocktail, dîner, et animations surprises.

Nous comptons sur votre présence !

[ORGANIZER_NAME]`
    },
    {
      id: 'lancement-produit',
      title: 'Lancement de Produit',
      category: 'entreprise',
      message: `Nous sommes fiers de vous inviter au lancement de notre nouveau produit.

Découvrez en avant-première nos dernières innovations le [DATE] à [TIME] à [LOCATION].

Cocktail de bienvenue, présentation du produit, et échanges avec notre équipe.

Votre présence nous honore.

[ORGANIZER_NAME]`
    },
    {
      id: 'formation-entreprise',
      title: 'Formation Entreprise',
      category: 'entreprise',
      message: `Nous vous invitons à participer à notre session de formation professionnelle.

Programme : [EVENT_TITLE]
Date : [DATE] à [TIME]
Lieu : [LOCATION]

Cette formation vous permettra d'acquérir de nouvelles compétences et de développer votre expertise.

Inscription obligatoire.

[ORGANIZER_NAME]`
    },

    // ANNIVERSAIRES
    {
      id: 'anniversaire-naissance',
      title: 'Anniversaire de Naissance',
      category: 'anniversaire',
      message: `C\'est avec joie que nous vous invitons à célébrer mon anniversaire !

Rejoignez-moi le [DATE] à [TIME] à [LOCATION] pour une soirée festive et conviviale.

Au programme : musique, danse, et bonne humeur garantie !

Votre présence fera de cette fête un moment inoubliable.

[ORGANIZER_NAME]`
    },
    {
      id: 'anniversaire-mariage',
      title: 'Anniversaire de Mariage',
      category: 'anniversaire',
      message: `Nous célébrons [YEARS] années de bonheur ensemble !

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour fêter cet anniversaire de mariage.

Partagez avec nous ce moment de joie et de gratitude.

Votre présence nous comblera de bonheur.

[ORGANIZER_NAME]`
    },
    {
      id: 'anniversaire-entreprise',
      title: 'Anniversaire d\'Entreprise',
      category: 'anniversaire',
      message: `Nous fêtons [YEARS] années d\'existence et de succès !

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour célébrer cet anniversaire exceptionnel.

Au programme : rétrospective, remerciements, et festivités.

Merci de faire partie de notre histoire !

[ORGANIZER_NAME]`
    },


    // GÉNÉRIQUE
    {
      id: 'evenement-generique',
      title: 'Événement Générique',
      category: 'generique',
      message: `Nous avons le plaisir de vous inviter à notre événement.

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour partager ce moment spécial avec nous.

Votre présence nous fera le plus grand plaisir.

Avec plaisir,
[ORGANIZER_NAME]`
    }
  ]

  const currentTemplate = computed(() => 
    templates.find(t => t.id === selectedTemplate.value) || templates[0]
  )

  const templatesByCategory = computed(() => {
    const grouped: Record<string, InvitationTemplate[]> = {}
    templates.forEach(template => {
      if (!grouped[template.category]) {
        grouped[template.category] = []
      }
      grouped[template.category]!.push(template)
    })
    return grouped
  })

  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id)
  }

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(t => t.category === category)
  }

  const formatTemplateMessage = (template: InvitationTemplate, eventData: EventData) => {
    let message = template.message
    
    // Remplacer les placeholders avec des valeurs par défaut
    message = message.replace(/\[DATE\]/g, eventData.date || '[DATE]')
    message = message.replace(/\[TIME\]/g, eventData.time || '[TIME]')
    message = message.replace(/\[LOCATION\]/g, eventData.location || '[LOCATION]')
    message = message.replace(/\[GUEST_NAME\]/g, eventData.guestName || '[GUEST_NAME]')
    message = message.replace(/\[EVENT_TITLE\]/g, eventData.eventTitle || '[EVENT_TITLE]')
    message = message.replace(/\[ORGANIZER_NAME\]/g, eventData.organizerName || '[ORGANIZER_NAME]')
    message = message.replace(/\[YEARS\]/g, eventData.years?.toString() || '[YEARS]')
    
    return message
  }

  // Fonction pour convertir le markdown en HTML simple
  const markdownToHtml = (text: string): string => {
    return text
      // Titres
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-1">$1</h3>')
      // Gras
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Italique
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Retours à la ligne
      .replace(/\n/g, '<br>')
  }

  return {
    templates,
    selectedTemplate,
    currentTemplate,
    templatesByCategory,
    getTemplateById,
    getTemplatesByCategory,
    formatTemplateMessage,
    markdownToHtml
  }
}
