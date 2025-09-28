import { ref, computed } from 'vue'
import { useInvitationVariables } from './useInvitationVariables'

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
  guestTableName?: string
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
      message: `[#Bonjour [**GUEST_NAME**]#]

C'est avec une [*immense joie*] que nous vous annonçons notre union sacrée devant Dieu.

Nous serions honorés de votre présence pour célébrer notre mariage religieux le [**DATE**] à [**TIME**] à [**LOCATION**].

[>Votre présence à nos côtés en ce jour si spécial nous comblerait de bonheur.<]

[---]

[>Avec tout notre amour,<]`
    },
    {
      id: 'mariage-civil',
      title: 'Mariage Civil',
      category: 'mariage',
      message: `[#Cher(e) [**GUEST_NAME**]#]

Nous avons le [*plaisir*] de vous inviter à célébrer notre union civile.

Rejoignez-nous le [**DATE**] à [**TIME**] à [**LOCATION**] pour partager ce moment de bonheur avec nous.

[>Votre présence nous fera le plus grand plaisir.<]

[>Avec affection,<]`
    },
    {
      id: 'mariage-intime',
      title: 'Mariage Intime',
      category: 'mariage',
      message: `Bonjour [**GUEST_NAME**],

Dans l'[*intimité*] de nos cœurs, nous avons choisi de nous dire "oui".

Nous aimerions partager ce [*moment précieux*] avec vous le [**DATE**] à [**TIME**] à [**LOCATION**].

[>Votre présence discrète et bienveillante nous accompagnera dans cette nouvelle étape de notre vie.<]

[>Avec tendresse,<]`
    },

    // ÉVÉNEMENTS D'ENTREPRISE
    {
      id: 'soiree-entreprise',
      title: 'Soirée Entreprise',
      category: 'entreprise',
      message: `Bonjour [**GUEST_NAME**],

Nous avons le plaisir de vous convier à notre [*soirée d'entreprise*].

Rejoignez-nous le [**DATE**] à [**TIME**] à [**LOCATION**] pour une soirée de [blue:networking] et de célébration de nos succès.

[>Au programme : cocktail, dîner, et animations surprises.<]

[!Nous comptons sur votre présence !]

[>Cordialement,<]`
    },
    {
      id: 'lancement-produit',
      title: 'Lancement de Produit',
      category: 'entreprise',
      message: `Nous sommes fiers de vous inviter au lancement de notre nouveau produit.

Découvrez en avant-première nos dernières innovations le [DATE] à [TIME] à [LOCATION].

Cocktail de bienvenue, présentation du produit, et échanges avec notre équipe.

Votre présence nous honore.

[]`
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

[]`
    },

    // ANNIVERSAIRES
    {
      id: 'anniversaire-naissance',
      title: 'Anniversaire de Naissance',
      category: 'anniversaire',
      message: `Bonjour [**GUEST_NAME**],

C'est avec [*joie*] que nous vous invitons à célébrer mon anniversaire !

Rejoignez-moi le [**DATE**] à [**TIME**] à [**LOCATION**] pour une soirée [purple:festive] et conviviale.

[>Au programme : musique, danse, et bonne humeur garantie !<]

[!Votre présence fera de cette fête un moment inoubliable !]

[>Avec amitié,<]`
    },
    {
      id: 'anniversaire-mariage',
      title: 'Anniversaire de Mariage',
      category: 'anniversaire',
      message: `Cher(e) [**GUEST_NAME**],

Nous célébrons [**YEARS**] années de [red:bonheur] ensemble !

Rejoignez-nous le [**DATE**] à [**TIME**] à [**LOCATION**] pour fêter cet [*anniversaire de mariage*].

[>Partagez avec nous ce moment de joie et de gratitude.<]

[!Votre présence nous comblera de bonheur !]

[>Avec tout notre amour,<]`
    },
    {
      id: 'anniversaire-entreprise',
      title: 'Anniversaire d\'Entreprise',
      category: 'anniversaire',
      message: `Nous fêtons [YEARS] années d\'existence et de succès !

Rejoignez-nous le [DATE] à [TIME] à [LOCATION] pour célébrer cet anniversaire exceptionnel.

Au programme : rétrospective, remerciements, et festivités.

Merci de faire partie de notre histoire !

[]`
    },


    // GÉNÉRIQUE
    {
      id: 'evenement-generique',
      title: 'Événement Générique',
      category: 'generique',
      message: `Bonjour [**GUEST_NAME**],

Nous avons le plaisir de vous inviter à notre [*événement*].

Rejoignez-nous le [**DATE**] à [**TIME**] à [**LOCATION**] pour partager ce [blue:moment spécial] avec nous.

[>Votre présence nous fera le plus grand plaisir.<]

[>Avec plaisir,<]`
    },

    // NOUVEAUX MODÈLES AVEC FORMATAGE AVANCÉ
    {
      id: 'mariage-luxe',
      title: 'Mariage de Luxe',
      category: 'mariage',
      message: `Cher(e) [**GUEST_NAME**],

C'est avec [*une immense fierté*] que nous vous convions à notre [purple:cérémonie de mariage] d'exception.

[>**Dress Code :** Tenue de soirée élégante<]
[>**Date :** [**DATE**] à [**TIME**]<]
[>**Lieu :** [**LOCATION**]<]

[---]

[>Cocktail de bienvenue, dîner gastronomique, et soirée dansante jusqu'au bout de la nuit.<]

[!Votre présence fera de cette journée un moment inoubliable !]

[>Avec tout notre amour et notre reconnaissance,<]`
    },
    {
      id: 'conference-professionnelle',
      title: 'Conférence Professionnelle',
      category: 'entreprise',
      message: `Bonjour [**GUEST_NAME**],

Nous avons l'honneur de vous inviter à notre [*conférence professionnelle*] de haut niveau.

[>**Thème :** [EVENT_TITLE]<]
[>**Date :** [**DATE**] à [**TIME**]<]
[>**Lieu :** [**LOCATION**]<]

[###Programme de la journée :###]

[>• 9h00 - Accueil et café<]
[>• 9h30 - Conférences plénières<]
[>• 12h00 - Déjeuner de networking<]
[>• 14h00 - Ateliers pratiques<]
[>• 17h00 - Cocktail de clôture<]

[!Inscription obligatoire avant le [DATE] !]

[>Cordialement,<]`
    },
    {
      id: 'fete-enfants',
      title: 'Fête d\'Enfants',
      category: 'anniversaire',
      message: `Bonjour [**GUEST_NAME**],

[**EVENT_TITLE**] fête son anniversaire et vous êtes invité(e) !

[>**Date :** [**DATE**] à [**TIME**]<]
[>**Lieu :** [**LOCATION**]<]

[###Au programme :###]

[>🎪 Animations et jeux<]
[>🍰 Gâteau d'anniversaire<]
[>🎁 Distribution de cadeaux<]
[>🎵 Musique et danse<]

[!Venez nombreux pour une fête [purple:mémorable] !]

[>Avec joie,<]`
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
    // Créer un objet de données simulé pour le composable
    const mockData = {
      event: {
        startsAt: eventData.date ? `${eventData.date} ${eventData.time || '18:00'}` : undefined,
        location: eventData.location,
        title: eventData.eventTitle,
        organizer: { name: eventData.organizerName }
      },
      invitation: {
        guestName: eventData.guestName,
        guestTableName: eventData.guestTableName
      }
    }
    
    const { processMessage } = useInvitationVariables(mockData)
    const result = processMessage(template.message)
    
    return result.text
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
