# 📱 API Biso Ticket - Documentation Complète

## 🚀 Vue d'ensemble

L'API Biso Ticket permet de gérer des événements, des tickets, des réservations et des invités. Elle est conçue pour être utilisée par des applications mobiles, des sites web et d'autres intégrations.

**Base URL :** `https://api.bisoticket.com/api/v1`

**Authentification :** Bearer Token (Laravel Sanctum)

---

## 🔐 Authentification

### Inscription d'un nouvel utilisateur
```http
POST /auth/register
```

**Corps de la requête :**
```json
{
    "name": "John Doe",
    "phone": "+243123456789",
    "email": "john@example.com",
    "password": "password123"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Compte créé avec succès",
    "data": {
        "user": {
            "id": 6,
            "name": "John Doe",
            "email": "john@example.com",
            "phone_number": "+243123456789",
            "role": "user"
        },
        "token": "1|b9NVtZl6PhG5vBwXGeZcEujHED37Zhjwn5EIEmwbe5067daf",
        "token_type": "Bearer"
    }
}
```

### Connexion utilisateur
```http
POST /auth/login
```

**Corps de la requête :**
```json
{
    "identifier": "john@example.com",
    "password": "password123"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Connexion réussie",
    "data": {
        "user": {
            "id": 6,
            "name": "John Doe",
            "email": "john@example.com",
            "phone_number": "+243123456789",
            "role": "user"
        },
        "token": "2|R0ZZ2IxRkBlX1pI3qkOb9u46nrgPlz53ZHt01Www25592be7",
        "token_type": "Bearer"
    }
}
```

### Récupération du profil utilisateur
```http
GET /auth/profile
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 6,
            "name": "John Doe",
            "email": "john@example.com",
            "phone_number": "+243123456789",
            "role": "user",
            "created_at": "2025-08-03T00:34:35.000000Z",
            "updated_at": "2025-08-03T00:34:35.000000Z"
        }
    }
}
```

### Déconnexion
```http
POST /auth/logout
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Déconnexion réussie"
}
```

---

## 📅 Découverte et Événements

### Événements mis en avant
```http
GET /discover
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "events": [
            {
                "id": 16,
                "name": "Concert Rock",
                "description": "Un concert exceptionnel",
                "date_time": "2025-12-25T20:00:00.000000Z",
                "location": "Palais des Congrès",
                "image": "events/concert.jpg",
                "image_url": "https://votre-domaine.com/events/concert.jpg",
                "category": "Concert",
                "is_featured": true,
                "share_token": null,
                "slug": "concert-rock-abc123",
                "organizer": { "id": 2, "name": "Organisateur", "email": "organisateur@example.com" },
                "tickets": [ { "id": 48, "type": "VIP", "price": "50.00", "devise": "USD", "quantity": 100 } ]
            }
        ]
    }
}
```

### Liste des événements avec filtres
```http
GET /events?page=1&per_page=10&category=Concert&min_price=10&max_price=100&date_filter=tomorrow&search=rock
```

**Paramètres de requête :**
- `page` : Numéro de page (défaut: 1)
- `per_page` : Nombre d'éléments par page (défaut: 50, max: 100)
- `category` : Catégorie d'événement
- `min_price` : Prix minimum
- `max_price` : Prix maximum
- `date_filter` : `today`, `tomorrow`, `this_week`, `all`
- `search` : Recherche dans le nom, description, lieu

**Réponse (extrait) :**
```json
{
    "success": true,
    "data": {
        "events": [
            {
                "id": 16,
                "name": "Concert Rock",
                "description": "Un concert exceptionnel",
                "date_time": "2025-12-25T20:00:00.000000Z",
                "location": "Palais des Congrès",
                "image": "events/concert.jpg",
                "image_url": "https://votre-domaine.com/events/concert.jpg",
                "category": "Concert",
                "organizer": {
                    "id": 2,
                    "name": "Organisateur",
                    "email": "organisateur@example.com"
                },
                "tickets": [ { "id": 48, "type": "VIP", "price": "50.00", "devise": "USD", "quantity": 100 } ]
            }
        ],
        "pagination": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 10,
            "total": 1,
            "from": 1,
            "to": 1
        }
    }
}
```

### Détails d'un événement
```http
GET /events/{identifier}
```

`{identifier}` peut être l'ID, le `slug` ou le `share_token` de l'événement.

**Réponse :**
```json
{
    "success": true,
    "data": {
        "event": {
            "id": 16,
            "name": "Concert Rock",
            "description": "Un concert exceptionnel",
            "date_time": "2025-12-25T20:00:00.000000Z",
            "location": "Palais des Congrès",
            "image": "events/concert.jpg",
            "image_url": "https://votre-domaine.com/events/concert.jpg",
            "category": "Concert",
            "is_featured": true,
            "share_token": "abc123",
            "slug": "concert-rock-abc123",
            "organizer": {
                "id": 2,
                "name": "Organisateur",
                "email": "organisateur@example.com"
            },
            "tickets": [
                {
                    "id": 48,
                    "type": "VIP",
                    "price": "50.00",
                    "devise": "USD",
                    "quantity": 100,
                    "end_date": "2025-12-20T23:59:59.000000Z"
                }
            ],
            "participants_count": 2,
            "created_at": "2025-08-03T00:35:48.000000Z",
            "updated_at": "2025-08-03T00:35:48.000000Z"
        }
    }
}
```

---

## 🎫 Réservations et Tickets

### Réservation de tickets (MaxiCash / Free)
```http
POST /tickets/reserve
Authorization: Bearer {token}
```

**Corps (MaxiCash PayNowSync – option sans carte) :**
```json
{
  "tickets": [ { "ticket_id": 48, "quantity": 2 } ],
  "pay_type": 0
}
```

**Corps (Airtel/Mpsa/Orange – téléphone requis) :**
```json
{
  "tickets": [ { "ticket_id": 48, "quantity": 1 } ],
  "pay_type": 2,
  "telephone": "243824707127"
}
```

**Corps (Paiement carte – lien de paiement + cData) :**
```json
{
  "tickets": [ { "ticket_id": 48, "quantity": 1 } ],
  "pay_with_card": true,
  "cData": { "cDate": "12/2023", "cNumber": "4000000000000002", "vCVV": "123" }
}
```

**Corps (Réservation gratuite) :**
```json
{
  "tickets": [ { "ticket_id": 48, "quantity": 1 } ],
  "payment_method": "free"
}
```

**Réponses typiques :**
```json
{
  "success": true,
  "message": "Paiement confirmé via MaxiCash. Vos billets sont prêts.",
  "data": {
    "participant": { "id": 667, "token": "..." },
    "redirect_to_my_tickets": true
  }
}
```

Si paiement carte (lien): `redirect = true`, `paymentUrl` dans `data`.

Champs supportés:
- `tickets[].ticket_id` (obligatoire), `tickets[].quantity` (obligatoire)
- `pay_type` (0: MaxiCash, 1: Airtel, 2: Mpsa, 3: Orange)
- `telephone` (obligatoire si `pay_type` ∈ {1,2,3})
- `pay_with_card` (bool, si vrai, envoie `cData`)
- `cData.cDate`, `cData.cNumber`, `cData.vCVV` (obligatoires si `pay_with_card=true`)
- `payment_method` = `free` (réservation gratuite)

### Vérifier le statut du paiement (MaxiCash PayNowStatus)
```http
POST /tickets/paynow/status
Authorization: Bearer {token}
```

**Corps :**
```json
{ "pay_type": 0, "payment_id": "ID_OBTENU_EN_ETAPE_1", "language": "fr" }
```
**Réponse :** statut `success|failed|pending` + données brutes API MaxiCash.

Note: pour les paiements par lien (carte), utilisez ce statut jusqu'à une réponse finale.

### Mes tickets
```http
GET /tickets/my-tickets
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "tickets_by_event": {
            "16": {
                "event": {
                    "id": 16,
                    "name": "Concert Rock",
                    "date_time": "2025-12-25T20:00:00.000000Z",
                    "location": "Palais des Congrès",
                    "image": "events/concert.jpg"
                },
                "participants": [
                    {
                        "id": 667,
                        "name": "John Doe",
                        "email": "john@example.com",
                        "phone": "+243123456789",
                        "qr_code": "MqfBS6pQcQwj1",
                        "payment_status": "completed",
                        "ticket": {
                            "id": 48,
                            "type": "VIP",
                            "price": "50.00",
                            "devise": "USD"
                        },
                        "created_at": "2025-08-03T00:37:21.000000Z"
                    }
                ]
            }
        },
        "total_tickets": 1,
        "total_events": 1
    }
}
```

### Détails d'un ticket
```http
GET /tickets/{ticketId}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "ticket": {
            "id": 667,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+243123456789",
            "qr_code": "MqfBS6pQcQwj1",
            "payment_status": "completed",
            "event": {
                "id": 16,
                "name": "Concert Rock",
                "date_time": "2025-12-25T20:00:00.000000Z",
                "location": "Palais des Congrès",
                "image": "events/concert.jpg"
            },
            "ticket": {
                "id": 48,
                "type": "VIP",
                "price": "50.00",
                "devise": "USD"
            },
            "created_at": "2025-08-03T00:37:21.000000Z"
        }
    }
}
```

---

## 🎪 Gestion des Événements

### Création d'un événement
```http
POST /events/create
Authorization: Bearer {token}
```

**Corps de la requête :**
```json
{
    "name": "Mon Événement",
    "description": "Description de l'événement",
    "date_time": "2025-12-25 20:00:00",
    "location": "Lieu de l'événement",
    "category": "Concert",
    "image": "events/image.jpg"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Événement créé avec succès",
    "data": {
        "event": {
            "id": 16,
            "name": "Mon Événement",
            "description": "Description de l'événement",
            "date_time": "2025-12-25T20:00:00.000000Z",
            "location": "Lieu de l'événement",
            "category": "Concert",
            "image": "events/image.jpg",
            "is_featured": null,
            "share_token": null,
            "slug": null,
            "created_at": "2025-08-03T00:35:48.000000Z"
        }
    }
}
```

### Mes événements
```http
GET /events/my-events
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "events": [
            {
                "id": 16,
                "name": "Mon Événement",
                "description": "Description de l'événement",
                "date_time": "2025-12-25T20:00:00.000000Z",
                "location": "Lieu de l'événement",
                "category": "Concert",
                "image": "events/image.jpg",
                "image_url": "https://votre-domaine.com/events/image.jpg",
                "is_featured": false,
                "share_token": "abc123",
                "slug": "mon-evenement-abc123",
                "created_at": "2025-08-03T00:35:48.000000Z"
            }
        ]
    }
}
```

### Suppression d'un événement
```http
DELETE /events/{eventId}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Événement supprimé avec succès",
    "data": {
        "event_id": 16
    }
}
```

**Codes d'erreur possibles :**
- `404` : Événement non trouvé
- `403` : Non autorisé (pas l'organisateur de l'événement)
- `422` : Événement ne peut pas être supprimé (réservations existantes)

---

## 📊 Audit Réservations & Paiements

### Audit global
```http
GET /tickets/audit/reservations?status=completed&method=maxicash&per_page=20
Authorization: Bearer {token}
```

### Audit par événement
```http
GET /tickets/audit/events/{eventId}?status=pending&per_page=20
Authorization: Bearer {token}
```

---

## 🔧 Configuration MaxiCash (env)
- `MAXICASH_MERCHANT_ID`
- `MAXICASH_MERCHANT_PASSWORD`
- `MAXICASH_ENV` = `test` ou `live`
- (optionnel) `MAXICASH_BASE_URL_TEST`, `MAXICASH_BASE_URL_LIVE`

### Ajout d'un ticket à un événement
```http
POST /events/{eventId}/tickets
Authorization: Bearer {token}
```

**Corps de la requête :**
```json
{
    "type": "VIP",
    "price": 50.00,
    "quantity": 100,
    "end_date": "2025-12-20 23:59:59",
    "devise": "USD"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Ticket ajouté avec succès",
    "data": {
        "ticket": {
            "id": 48,
            "type": "VIP",
            "price": "50.00",
            "quantity": 100,
            "end_date": "2025-12-20T23:59:59.000000Z",
            "devise": "USD",
            "created_at": "2025-08-03T00:35:56.000000Z"
        }
    }
}
```

### Liste des tickets d'un événement
```http
GET /events/{eventId}/tickets
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "event": {
            "id": 16,
            "name": "Mon Événement"
        },
        "tickets": [
            {
                "id": 48,
                "type": "VIP",
                "price": "50.00",
                "quantity": 100,
                "sold": 45,
                "available": 55,
                "formatted_price": "50.00 USD",
                "has_available_tickets": true,
                "end_date": "2025-12-20T23:59:59.000000Z",
                "devise": "USD",
                "bg_color": null,
                "text_color": null,
                "is_available": true,
                "created_at": "2025-08-03T00:35:56.000000Z"
            }
        ]
    }
}
```

---

## 👥 Gestion des Invités

### Ajout d'un invité
```http
POST /events/{eventId}/guests
Authorization: Bearer {token}
```

**Corps de la requête :**
```json
{
    "name": "Marie Dupont",
    "table_name": "Table VIP 1"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Invité ajouté avec succès",
    "data": {
        "guest": {
            "id": 119,
            "name": "Marie Dupont",
            "table_name": "Table VIP 1",
            "status": "pending",
            "created_at": "2025-08-03T00:43:40.000000Z"
        }
    }
}
```

### Ajout d'invités en lot
```http
POST /events/{eventId}/guests/bulk
Authorization: Bearer {token}
```

**Corps de la requête :**
```json
{
    "guests": [
        {
            "name": "Pierre Martin",
            "table_name": "Table 3"
        },
        {
            "name": "Sophie Bernard",
            "table_name": "Table 4"
        },
        {
            "name": "Lucas Petit",
            "table_name": "Table 5"
        }
    ]
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "3 invités ajoutés avec succès",
    "data": {
        "guests": [
            {
                "id": 120,
                "name": "Pierre Martin",
                "email": null,
                "phone": null,
                "status": "pending"
            },
            {
                "id": 121,
                "name": "Sophie Bernard",
                "email": null,
                "phone": null,
                "status": "pending"
            },
            {
                "id": 122,
                "name": "Lucas Petit",
                "email": null,
                "phone": null,
                "status": "pending"
            }
        ],
        "total_added": 3
    }
}
```

### Liste des invités d'un événement
```http
GET /events/{eventId}/guests
Authorization: Bearer {token}
```

**Réponse :**
```json
{
    "success": true,
    "data": {
        "event": {
            "id": 16,
            "name": "Mon Événement"
        },
        "guests": [
            {
                "id": 119,
                "name": "Marie Dupont",
                "email": null,
                "phone": null,
                "status": "pending",
                "message": null,
                "drink_preferences": null,
                "created_at": "2025-08-03T00:43:40.000000Z"
            }
        ],
        "total_guests": 1
    }
}
```

---

## 🔧 Codes d'Erreur

### Codes de statut HTTP
- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `401` : Non autorisé
- `404` : Ressource non trouvée
- `422` : Données de validation invalides
- `500` : Erreur serveur

### Format des erreurs
```json
{
    "success": false,
    "message": "Message d'erreur",
    "errors": {
        "field": ["Message de validation"]
    }
}
```

---

## 📱 Intégration Mobile

### Configuration de base
```javascript
// Configuration de l'API
const API_BASE_URL = 'https://votre-domaine.com/api/v1';
const API_TOKEN = 'votre_token_ici';

// Headers par défaut
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
};
```

### Exemple d'utilisation (JavaScript/React Native)
```javascript
// Connexion utilisateur
const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Stocker le token
            await AsyncStorage.setItem('api_token', data.data.token);
            return data.data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        throw error;
    }
};

// Récupération des événements
const getEvents = async (page = 1, filters = {}) => {
    try {
        const token = await AsyncStorage.getItem('api_token');
        const queryParams = new URLSearchParams({
            page: page,
            per_page: 10,
            ...filters
        });
        
        const response = await fetch(`${API_BASE_URL}/events?${queryParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data.events;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erreur récupération événements:', error);
        throw error;
    }
};

// Réservation de tickets
const reserveTickets = async (tickets, paymentMethod) => {
    try {
        const token = await AsyncStorage.getItem('api_token');
        
        const response = await fetch(`${API_BASE_URL}/tickets/reserve`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                tickets: tickets,
                payment_method: paymentMethod
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data.participants;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erreur réservation:', error);
        throw error;
    }
};
```

### Exemple d'utilisation (Flutter/Dart)
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class BisoTicketAPI {
  static const String baseUrl = 'https://votre-domaine.com/api/v1';
  static String? token;

  // Connexion utilisateur
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'identifier': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      
      if (data['success']) {
        token = data['data']['token'];
        return data['data']['user'];
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      print('Erreur de connexion: $e');
      rethrow;
    }
  }

  // Récupération des événements
  static Future<List<Map<String, dynamic>>> getEvents({
    int page = 1,
    Map<String, dynamic>? filters,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'per_page': '10',
      };
      
      if (filters != null) {
        queryParams.addAll(filters.map((key, value) => MapEntry(key, value.toString())));
      }

      final response = await http.get(
        Uri.parse('$baseUrl/events').replace(queryParameters: queryParams),
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);
      
      if (data['success']) {
        return List<Map<String, dynamic>>.from(data['data']['events']);
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      print('Erreur récupération événements: $e');
      rethrow;
    }
  }
}
```

---

## 🔒 Sécurité

### Authentification
- Utilisez toujours le token Bearer dans les headers
- Stockez le token de manière sécurisée (Keychain iOS, Keystore Android)
- Régénérez le token si nécessaire

### Validation des données
- Validez toujours les données côté client
- Gérez les erreurs de validation
- Affichez des messages d'erreur appropriés

### Gestion des erreurs
- Gérez les erreurs réseau
- Gérez les erreurs d'authentification (401)
- Gérez les erreurs de validation (422)

---

## 📞 Support

Pour toute question ou problème avec l'API, contactez l'équipe de développement Biso Ticket.

**Email :** support@biso-ticket.com  
**Documentation :** https://docs.biso-ticket.com  
**GitHub :** https://github.com/biso-ticket/api 