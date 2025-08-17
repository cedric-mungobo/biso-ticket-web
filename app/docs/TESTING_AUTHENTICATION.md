# 🧪 Guide de Test - Authentification Espace Organisateur

## 📋 Objectif

Ce document décrit les tests à effectuer pour vérifier que toutes les pages de l'espace organisateur sont correctement protégées par le middleware d'authentification.

## ✅ Checklist de Protection

### Pages à tester
- [ ] `/organisateur` - Tableau de bord
- [ ] `/organisateur/create-event` - Créer un événement
- [ ] `/organisateur/my-events` - Mes événements
- [ ] `/organisateur/statistics` - Statistiques
- [ ] `/organisateur/events/[id]` - Gestion d'événement

### Tests de sécurité
- [ ] Accès sans authentification → Redirection
- [ ] Accès avec authentification → Autorisation
- [ ] Token expiré → Redirection automatique
- [ ] Session invalide → Nettoyage et redirection

## 🔍 Tests Manuels

### 1. Test de Protection de Base

#### Prérequis
- Être déconnecté de l'application
- Avoir un navigateur propre (pas de cookies de session)

#### Étapes
1. **Accéder directement** à une page protégée (ex: `/organisateur`)
2. **Vérifier la redirection** vers `/connexion`
3. **Vérifier l'URL de redirection** dans les paramètres de l'URL
4. **Se connecter** avec un compte valide
5. **Vérifier la redirection** vers la page demandée initialement

#### Résultat attendu
```
URL initiale: /organisateur
Redirection: /connexion?redirect=%2Forganisateur
Après connexion: /organisateur
```

### 2. Test de Navigation Entre Pages

#### Prérequis
- Être connecté avec un compte organisateur

#### Étapes
1. **Accéder** au tableau de bord `/organisateur`
2. **Naviguer** vers "Créer un événement"
3. **Naviguer** vers "Mes événements"
4. **Naviguer** vers "Statistiques"
5. **Créer un événement** et accéder à sa gestion

#### Résultat attendu
- Aucune redirection vers la page de connexion
- Navigation fluide entre toutes les pages
- Persistance de l'authentification

### 3. Test de Session Expirée

#### Prérequis
- Être connecté avec un compte organisateur
- Avoir accès à la console du navigateur

#### Étapes
1. **Ouvrir la console** du navigateur
2. **Supprimer le token** d'authentification :
   ```javascript
   localStorage.removeItem('auth_token')
   ```
3. **Essayer d'accéder** à une page protégée
4. **Vérifier la redirection** vers `/connexion`

#### Résultat attendu
- Redirection automatique vers la page de connexion
- Message d'erreur approprié (optionnel)

### 4. Test de Déconnexion

#### Prérequis
- Être connecté avec un compte organisateur

#### Étapes
1. **Cliquer sur "Déconnexion"** dans la navigation
2. **Vérifier la redirection** vers `/connexion`
3. **Essayer d'accéder** à une page protégée
4. **Vérifier la redirection** vers `/connexion`

#### Résultat attendu
- Déconnexion réussie
- Redirection vers la page de connexion
- Impossible d'accéder aux pages protégées

## 🧪 Tests Automatisés

### Configuration des tests

```typescript
// tests/auth.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

describe('Authentification - Espace Organisateur', () => {
  beforeEach(() => {
    // Configuration des tests
  })

  it('should redirect unauthenticated users to login', async () => {
    // Test de redirection
  })

  it('should allow authenticated users to access protected pages', async () => {
    // Test d'accès autorisé
  })

  it('should handle expired tokens correctly', async () => {
    // Test de gestion des tokens expirés
  })
})
```

### Tests unitaires recommandés

- [ ] **Middleware `authenticated`** : Vérification de la logique de redirection
- [ ] **Composable `useAuth`** : Test des états d'authentification
- [ ] **Navigation** : Test des redirections et protections
- [ ] **Gestion des erreurs** : Test des cas d'erreur d'authentification

## 🚨 Cas d'Erreur à Tester

### 1. Erreurs réseau
- **Scénario** : Perte de connexion internet
- **Comportement attendu** : Gestion gracieuse de l'erreur
- **Action** : Afficher un message d'erreur approprié

### 2. Token invalide
- **Scénario** : Token corrompu ou malformé
- **Comportement attendu** : Redirection vers la connexion
- **Action** : Nettoyage de la session

### 3. Session expirée
- **Scénario** : Token expiré côté serveur
- **Comportement attendu** : Redirection automatique
- **Action** : Déconnexion et redirection

### 4. Permissions insuffisantes
- **Scénario** : Utilisateur sans rôle organisateur
- **Comportement attendu** : Accès refusé
- **Action** : Redirection vers une page d'erreur appropriée

## 📊 Validation des Résultats

### Critères de succès

#### ✅ Protection des pages
- [ ] Aucun accès direct sans authentification
- [ ] Redirection systématique vers `/connexion`
- [ ] Sauvegarde correcte de l'URL de destination

#### ✅ Gestion des sessions
- [ ] Persistance de l'authentification pendant la navigation
- [ ] Déconnexion propre et sécurisée
- [ ] Gestion des tokens expirés

#### ✅ Expérience utilisateur
- [ ] Redirections fluides et transparentes
- [ ] Messages d'erreur appropriés
- [ ] Pas de boucles de redirection

### Métriques à surveiller

- **Temps de redirection** : < 500ms
- **Taux de succès** : 100% des redirections réussies
- **Erreurs d'authentification** : 0% d'erreurs non gérées
- **Performance** : Pas d'impact sur le chargement des pages

## 🔧 Outils de Test

### Navigateurs recommandés
- [ ] **Chrome** : DevTools avancés
- [ ] **Firefox** : Outils de développement
- [ ] **Safari** : Web Inspector
- [ ] **Edge** : DevTools

### Extensions utiles
- [ ] **Vue DevTools** : Inspection des composants Vue
- [ ] **Redux DevTools** : Suivi de l'état (si applicable)
- [ ] **Network Panel** : Surveillance des appels API

### Tests de charge
- [ ] **Multiple onglets** : Ouverture simultanée de pages protégées
- [ ] **Navigation rapide** : Changement rapide entre pages
- [ ] **Connexions multiples** : Plusieurs sessions simultanées

## 📝 Rapport de Test

### Template de rapport

```markdown
# Rapport de Test - Authentification Espace Organisateur

**Date** : [DATE]
**Testeur** : [NOM]
**Version** : [VERSION]

## Résumé
- Pages testées : [X]/5
- Tests réussis : [X]/[Y]
- Erreurs trouvées : [X]

## Détails des tests
### Page 1: /organisateur
- [ ] Test de protection : ✅/❌
- [ ] Test de redirection : ✅/❌
- [ ] Test de reconnexion : ✅/❌

### Page 2: /organisateur/create-event
- [ ] Test de protection : ✅/❌
- [ ] Test de redirection : ✅/❌
- [ ] Test de reconnexion : ✅/❌

## Erreurs trouvées
1. [Description de l'erreur]
2. [Description de l'erreur]

## Recommandations
- [Recommandation 1]
- [Recommandation 2]

## Statut final
- [ ] Tests réussis
- [ ] Tests partiellement réussis
- [ ] Tests échoués
```

## 🚀 Améliorations Continues

### Tests à ajouter
- [ ] **Tests de performance** : Mesure des temps de réponse
- [ ] **Tests de sécurité** : Vérification des vulnérabilités
- [ ] **Tests d'accessibilité** : Vérification de l'accessibilité
- [ ] **Tests de compatibilité** : Vérification multi-navigateurs

### Automatisation
- [ ] **CI/CD** : Intégration des tests dans le pipeline
- [ ] **Tests E2E** : Tests de bout en bout automatisés
- [ ] **Monitoring** : Surveillance continue de l'authentification

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe Biso Ticket
