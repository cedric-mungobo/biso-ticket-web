# 🎪 Espace Organisateur - Documentation Complète

## 📋 Vue d'ensemble

L'espace organisateur de Biso Ticket permet aux organisateurs d'événements de gérer complètement leurs événements, de créer des tickets, d'ajouter des invités et de suivre leurs performances.

## 🔐 Sécurité et Authentification

### Protection des pages
**Toutes les pages de l'espace organisateur sont protégées par le middleware d'authentification `authenticated`.**

| Page | Route | Statut de protection |
|------|-------|---------------------|
| Tableau de bord | `/organisateur` | ✅ Protégée |
| Créer un événement | `/organisateur/create-event` | ✅ Protégée |
| Mes événements | `/organisateur/` | ✅ Protégée |
| Statistiques | `/organisateur/statistics` | ✅ Protégée |
| Gestion d'événement | `/organisateur/events/[id]` | ✅ Protégée |

### Fonctionnement du middleware
- **Vérification automatique** : L'authentification est vérifiée à chaque accès
- **Redirection intelligente** : Les utilisateurs non connectés sont redirigés vers `/connexion`
- **Sauvegarde de destination** : L'URL demandée est sauvegardée pour rediriger après connexion
- **Gestion des sessions** : Protection contre les tokens expirés et sessions invalides

### Configuration
Chaque page utilise la même configuration de sécurité :
```typescript
definePageMeta({
  middleware: 'authenticated'
})
```

## 🚀 Fonctionnalités principales

### 1. Tableau de bord (`/organisateur`)
- Vue d'ensemble de l'espace organisateur
- Accès rapide aux principales fonctionnalités
- Navigation vers toutes les sections

### 2. Création d'événements (`/organisateur/create-event`)
- Formulaire complet de création d'événement
- Champs obligatoires : nom, description, date/heure, lieu, catégorie
- Champs optionnels : image
- Validation des données côté client
- Redirection automatique après création

### 3. Gestion des événements (`/organisateur/`)
- Liste de tous les événements créés
- Statuts visuels (À venir, Aujourd'hui, Terminé)
- Informations détaillées : tickets, participants, lieu
- Actions rapides : gérer, voir l'événement public
- État vide avec appel à l'action

### 4. Gestion d'un événement spécifique (`/organisateur/events/[id]`)
- **Onglet Tickets** : Ajout, visualisation et gestion des tickets
- **Onglet Invités** : Ajout et gestion de la liste d'invités
- **Onglet Statistiques** : Métriques de performance de l'événement

### 5. Statistiques (`/organisateur/statistics`)
- Métriques globales : total événements, tickets vendus, CA, participants
- Sélecteur d'événement pour statistiques détaillées
- Graphiques de vente par événement
- Analyse des méthodes de paiement

## 🔧 Architecture technique

### Composables utilisés

#### `useOrganizerEvents`
Gère toutes les opérations liées aux événements de l'organisateur :

```typescript
// Récupération des événements
const { fetchMyEvents, events, loading, error } = useOrganizerEvents()

// Création d'événement
const { createEvent } = useOrganizerEvents()

// Gestion des tickets
const { addTicket, fetchEventTickets } = useOrganizerEvents()

// Gestion des invités
const { addGuest, fetchEventGuests } = useOrganizerEvents()

// Statistiques
const { fetchEventStats } = useOrganizerEvents()
```

#### `useAuth`
Gère l'authentification et les sessions utilisateur :

```typescript
const { user, isAuthenticated, logout } = useAuth()
```

### Structure des données

#### Événement
```typescript
interface Event {
  id: number
  name: string
  description: string
  date_time: string
  location: string
  image: string
  image_url: string
  category: string
  is_featured: number
  share_token?: string
  slug?: string
  organizer: Organizer
  tickets: Ticket[]
  participants_count?: number
}
```

#### Ticket
```typescript
interface Ticket {
  id: number
  type: string
  price: string
  quantity: number
  sold?: number
  available?: number
  devise: string
  end_date?: string
}
```

#### Invité
```typescript
interface Guest {
  id: number
  name: string
  table_name?: string
  email?: string
  phone?: string
  status: 'pending' | 'confirmed' | 'cancelled'
}
```

## 📱 Interface utilisateur

### Design System
- **Couleurs** : Utilise les variables CSS `primary-*`, `secondary-*`
- **Composants** : Cartes, boutons, formulaires cohérents
- **Responsive** : Adaptation mobile et desktop
- **Accessibilité** : Labels, focus states, contrastes appropriés

### Composants réutilisables
- `OrganizerNavigation` : Navigation principale avec onglets
- Formulaires avec validation et gestion d'erreurs
- Cartes d'événements avec actions
- Modales pour l'ajout de tickets/invités

## 📊 Intégration API

### Endpoints utilisés
- `POST /events/create` : Création d'événement
- `GET /events/my-events` : Liste des événements
- `GET /events/{id}` : Détails d'un événement
- `POST /events/{id}/tickets` : Ajout de ticket
- `GET /events/{id}/tickets` : Liste des tickets
- `POST /events/{id}/guests` : Ajout d'invité
- `GET /events/{id}/guests` : Liste des invités
- `GET /tickets/audit/events/{id}` : Statistiques d'événement

### Gestion des erreurs
- Interception des erreurs réseau
- Affichage des messages d'erreur utilisateur
- Boutons de retry pour les opérations échouées

## 🚀 Utilisation

### 1. Accès à l'espace organisateur
1. Se connecter avec un compte organisateur
2. Naviguer vers `/organisateur`
3. Utiliser la navigation pour accéder aux différentes sections

### 2. Créer un événement
1. Cliquer sur "Créer un événement"
2. Remplir le formulaire avec les informations requises
3. Valider la création
4. Être redirigé vers la page de gestion de l'événement

### 3. Gérer un événement
1. Aller dans "Mes événements"
2. Cliquer sur "Gérer" pour l'événement souhaité
3. Utiliser les onglets pour naviguer entre les fonctionnalités
4. Ajouter des tickets et des invités selon les besoins

### 4. Consulter les statistiques
1. Aller dans "Statistiques"
2. Voir les métriques globales
3. Sélectionner un événement pour des détails
4. Analyser les performances

## 🔧 Configuration et personnalisation

### Variables CSS personnalisables
```css
:root {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --secondary-600: #9333ea;
}
```

### Adaptation des catégories d'événements
Modifier le composant `create-event.vue` pour ajouter/supprimer des catégories :

```vue
<option value="Concert">Concert</option>
<option value="Conférence">Conférence</option>
<option value="Exposition">Exposition</option>
<!-- Ajouter d'autres catégories ici -->
```

## 📈 Améliorations futures

### Fonctionnalités prévues
- [ ] Édition d'événements existants
- [ ] Suppression d'événements
- [ ] Import/export de listes d'invités
- [ ] Notifications en temps réel
- [ ] Rapports PDF/Excel
- [ ] Intégration avec des outils de marketing

### Optimisations techniques
- [ ] Mise en cache des données
- [ ] Pagination pour les grandes listes
- [ ] Recherche et filtres avancés
- [ ] Mode hors ligne
- [ ] Tests automatisés complets

## 🐛 Dépannage

### Problèmes courants

#### Erreur d'authentification
- Vérifier que l'utilisateur est connecté
- Vérifier la validité du token
- Rediriger vers la page de connexion

#### Échec de création d'événement
- Vérifier la validation des données
- Vérifier la connexion à l'API
- Consulter les logs de la console

#### Données non chargées
- Vérifier la connexion réseau
- Vérifier les permissions utilisateur
- Utiliser le bouton "Réessayer"

### Logs et débogage
- Console du navigateur pour les erreurs JavaScript
- Network tab pour les appels API
- Vue DevTools pour l'état des composants

## 📞 Support

Pour toute question ou problème avec l'espace organisateur :

1. Consulter cette documentation
2. Vérifier les logs de la console
3. Contacter l'équipe de développement
4. Ouvrir une issue sur le repository

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Biso Ticket
