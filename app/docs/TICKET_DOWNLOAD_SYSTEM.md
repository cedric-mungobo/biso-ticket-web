# Système de téléchargement de billets

## Vue d'ensemble

Le système de téléchargement de billets permet aux utilisateurs de récupérer et télécharger leurs billets de réservation à partir de leur ID public, même après avoir fermé le modal de confirmation.

## Architecture

### 1. Pages

#### `/billet/[publicId]` - Page de téléchargement de billet
- **Fichier** : `app/pages/billet/[publicId].vue`
- **Fonction** : Affiche et permet le téléchargement d'un billet spécifique
- **Paramètres** : `publicId` (string) - ID public de la réservation

#### `/billet` - Page d'accueil des billets
- **Fichier** : `app/pages/billet/index.vue`
- **Fonction** : Interface de recherche de billets par référence
- **Fonctionnalités** :
  - Formulaire de recherche par ID public
  - Instructions d'aide
  - Redirection vers la page de billet

### 2. Composables

#### `useTicketDownload` - Gestion des billets
- **Fichier** : `app/composables/useTicketDownload.ts`
- **Fonctions** :
  - `fetchReservationByPublicId(publicId)` : Récupère une réservation par ID public
  - `isValidPublicId(publicId)` : Valide le format d'un ID public
  - `formatDate(dateString)` : Formate les dates
  - `loading` : État de chargement
  - `error` : Gestion des erreurs

### 3. Composants

#### `TicketDownloadLink` - Lien vers un billet
- **Fichier** : `app/components/TicketDownloadLink.vue`
- **Props** :
  - `publicId` : ID public de la réservation
  - `label` : Texte du bouton
  - `color`, `variant`, `size` : Style du bouton
  - `icon` : Icône à afficher
- **Fonction** : Génère un lien vers la page de téléchargement

## Utilisation

### 1. Accès direct à un billet
```
https://bisoticket.com/billet/ABC123XYZ
```

### 2. Recherche de billet
```
https://bisoticket.com/billet?id=ABC123XYZ
```

### 3. Intégration dans d'autres composants
```vue
<template>
  <TicketDownloadLink
    :public-id="reservation.publicId"
    label="Voir mon billet"
    color="primary"
    size="lg"
  />
</template>
```

## API Endpoints

### GET `/public/reservations/{publicId}`
Récupère une réservation par son ID public.

**Réponse attendue :**
```json
{
  "status": true,
  "message": "Réservation trouvée",
  "data": {
    "id": 123,
    "publicId": "ABC123XYZ",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+243123456789",
    "status": "confirmed",
    "qrCode": "QR_CODE_DATA",
    "event": {
      "id": 5,
      "title": "Concert Biso",
      "imageUrl": "https://...",
      "startsAt": "2025-02-01T18:00:00Z",
      "location": "Kinshasa"
    },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

## Fonctionnalités

### 1. Affichage du billet
- Informations de l'événement (titre, image, date, lieu)
- Informations du participant (nom, email, téléphone)
- Statut de la réservation
- QR Code pour validation
- Référence de la réservation

### 2. Téléchargement
- Génération d'un billet PDF/PNG haute résolution
- Intégration de l'image de l'événement
- QR Code intégré
- Design professionnel avec branding Biso Ticket

### 3. Gestion des erreurs
- Validation de l'ID public
- Messages d'erreur utilisateur-friendly
- Gestion des cas d'erreur (404, 500, etc.)
- Fallback pour les images manquantes

### 4. SEO et accessibilité
- Métadonnées optimisées
- Structure sémantique
- Responsive design
- Support mobile

## Sécurité

### 1. Validation des données
- Validation du format de l'ID public
- Sanitisation des entrées utilisateur
- Gestion sécurisée des erreurs

### 2. Accès aux données
- Endpoint public (pas d'authentification requise)
- Validation côté serveur de l'existence de la réservation
- Pas d'exposition de données sensibles

## Intégration avec le système existant

### 1. Page de réservation
- Ajout d'un bouton "Lien permanent du billet" dans le modal de confirmation
- Utilisation du composant `TicketDownloadLink`

### 2. Emails de confirmation
- Inclusion du lien vers la page de billet
- Format : `https://bisoticket.com/billet/{publicId}`

### 3. Système de QR Code
- Réutilisation du composant `QRCode` existant
- Intégration avec le système de génération de canvas

## Tests

### 1. Tests unitaires
- Validation des fonctions du composable
- Test des composants
- Test des utilitaires

### 2. Tests d'intégration
- Test du flux complet de téléchargement
- Test des cas d'erreur
- Test de la responsivité

### 3. Tests de performance
- Optimisation du chargement des images
- Cache des données de réservation
- Compression des billets générés

## Maintenance

### 1. Monitoring
- Suivi des erreurs 404 (IDs invalides)
- Monitoring des performances de génération
- Logs des téléchargements

### 2. Évolutions futures
- Support de différents formats de billet
- Personnalisation du design
- Intégration avec des systèmes de validation
- Notifications push pour les mises à jour de statut
