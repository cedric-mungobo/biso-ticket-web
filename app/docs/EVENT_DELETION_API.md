# 🗑️ API de Suppression d'Événement

## 📋 Vue d'ensemble

L'API de suppression d'événement permet aux organisateurs de supprimer définitivement leurs événements. Cette opération est irréversible et nécessite une confirmation.

---

## 🔗 Endpoint

```http
DELETE /api/v1/events/{eventId}
```

**URL de base :** `https://api.bisoticket.com/api/v1`

**Paramètres :**
- `{eventId}` : ID numérique de l'événement à supprimer

---

## 🔐 Authentification

**Type :** Bearer Token (Laravel Sanctum)

**Header requis :**
```http
Authorization: Bearer {token}
Accept: application/json
```

---

## 📤 Corps de la requête

Aucun corps de requête requis.

---

## 📥 Réponse

### Succès (200 OK)

```json
{
    "success": true,
    "message": "Événement supprimé avec succès",
    "data": {
        "event_id": 16
    }
}
```

### Erreurs possibles

#### 404 Not Found
```json
{
    "success": false,
    "message": "Événement non trouvé",
    "errors": {
        "event": ["L'événement avec l'ID spécifié n'existe pas"]
    }
}
```

#### 403 Forbidden
```json
{
    "success": false,
    "message": "Non autorisé",
    "errors": {
        "permission": ["Vous n'êtes pas autorisé à supprimer cet événement"]
    }
}
```

#### 422 Unprocessable Entity
```json
{
    "success": false,
    "message": "Événement ne peut pas être supprimé",
    "errors": {
        "event": ["Impossible de supprimer un événement avec des réservations existantes"]
    }
}
```

#### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Erreur serveur interne",
    "errors": {
        "server": ["Une erreur inattendue s'est produite"]
    }
}
```

---

## ⚠️ Règles de suppression

### ✅ Conditions autorisées
- L'utilisateur doit être l'organisateur de l'événement
- L'événement ne doit pas avoir de réservations actives
- L'événement ne doit pas être en cours ou terminé

### ❌ Conditions bloquantes
- Événement avec des réservations existantes
- Événement en cours ou terminé
- Utilisateur non autorisé
- Événement inexistant

---

## 🔄 Logique de suppression

1. **Vérification des permissions** : L'utilisateur doit être l'organisateur
2. **Vérification des réservations** : Aucune réservation active
3. **Suppression des ressources associées** :
   - Tickets de l'événement
   - Invités/participants
   - Images et fichiers
   - Statistiques et métadonnées
4. **Suppression de l'événement** : Suppression définitive de la base de données

---

## 📱 Exemples d'utilisation

### JavaScript/TypeScript

```typescript
const deleteEvent = async (eventId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/v1/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Événement supprimé:', data.data.event_id);
      return true;
    } else {
      console.error('Erreur:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return false;
  }
};

// Utilisation
const success = await deleteEvent(16);
if (success) {
  // Mettre à jour l'interface utilisateur
  refreshEventsList();
}
```

### React Native

```javascript
import { Alert } from 'react-native';

const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      Alert.alert('Succès', 'Événement supprimé avec succès');
      return true;
    } else {
      Alert.alert('Erreur', data.message);
      return false;
    }
  } catch (error) {
    Alert.alert('Erreur', 'Erreur réseau lors de la suppression');
    return false;
  }
};
```

### Flutter/Dart

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class EventService {
  static Future<bool> deleteEvent(int eventId, String token) async {
    try {
      final response = await http.delete(
        Uri.parse('$API_BASE_URL/events/$eventId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      final data = jsonDecode(response.body);
      
      if (data['success']) {
        print('Événement supprimé: ${data['data']['event_id']}');
        return true;
      } else {
        print('Erreur: ${data['message']}');
        return false;
      }
    } catch (e) {
      print('Erreur réseau: $e');
      return false;
    }
  }
}
```

---

## 🧪 Tests

### Tests unitaires

```php
// Test de suppression réussie
public function test_can_delete_event()
{
    $user = User::factory()->create();
    $event = Event::factory()->create(['organizer_id' => $user->id]);
    
    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/events/{$event->id}");
    
    $response->assertStatus(200)
        ->assertJson(['success' => true]);
    
    $this->assertDatabaseMissing('events', ['id' => $event->id]);
}

// Test de permission refusée
public function test_cannot_delete_other_user_event()
{
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $event = Event::factory()->create(['organizer_id' => $user1->id]);
    
    $response = $this->actingAs($user2)
        ->deleteJson("/api/v1/events/{$event->id}");
    
    $response->assertStatus(403);
}
```

---

## 🔒 Sécurité

### Mesures de sécurité
- **Authentification requise** : Seuls les utilisateurs connectés peuvent supprimer
- **Vérification des permissions** : Seul l'organisateur peut supprimer son événement
- **Validation des données** : Vérification de l'existence et de l'état de l'événement
- **Logs d'audit** : Toutes les suppressions sont enregistrées

### Bonnes pratiques
- **Confirmation côté client** : Demander confirmation avant suppression
- **Gestion des erreurs** : Afficher des messages d'erreur appropriés
- **Mise à jour de l'UI** : Rafraîchir la liste après suppression
- **Feedback utilisateur** : Informer du succès ou de l'échec

---

## 📊 Monitoring

### Métriques à surveiller
- **Taux de succès** : Pourcentage de suppressions réussies
- **Temps de réponse** : Latence de l'opération de suppression
- **Erreurs** : Types et fréquences des erreurs
- **Utilisation** : Nombre de suppressions par jour/semaine

### Logs d'audit
```json
{
    "timestamp": "2025-01-20T10:30:00Z",
    "action": "event_deleted",
    "user_id": 123,
    "event_id": 16,
    "event_name": "Concert Rock",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
}
```

---

## 🔗 Liens utiles

- [Documentation API principale](../api-doc.md)
- [Gestion des événements](./EVENT_MANAGEMENT.md)
- [Authentification](./AUTHENTICATION.md)
- [Codes d'erreur](./ERROR_CODES.md)

---

## 📞 Support

Pour toute question concernant l'API de suppression d'événement :

**Email :** support@biso-ticket.com  
**Documentation :** https://docs.biso-ticket.com  
**GitHub :** https://github.com/biso-ticket/api
