# Mobile App Workflow - Biso Ticket

## Overview

Ce document décrit le workflow simplifié de l'application mobile Biso Ticket en 5 étapes principales.

## Architecture Technique

### Stack Recommandé
- **Framework**: Flutter (Dart)
- **State Management**: Provider ou Riverpod
- **Navigation**: AutoRoute/GoRouter
- **Storage**: Hive + Flutter Secure Storage
- **Networking**: Dio + Retrofit
- **UI Components**: Material 3 ou Flutter UI

### Structure du Projet
```
lib/
├── core/                  # Services partagés
│   ├── api/              # API client
│   ├── storage/          # Local storage
│   ├── auth/             # Authentication
│   └── utils/            # Utilitaires
├── features/             # Fonctionnalités
│   ├── auth/             # Étape 1: Authentification
│   ├── events/           # Étape 2: Liste événements
│   ├── event_detail/     # Étape 3: Détail événement
│   ├── payment/          # Étape 4: Paiement
│   └── tickets/          # Étape 5: Mes tickets
├── shared/               # Widgets partagés
└── main.dart
```

---

## Étape 1: Authentification

### Flow
```
Lancement App
    ↓
Vérification Token
    ↓
Token valide ? → Oui → Tableau de bord
    ↓ Non
Page de Connexion
    ↓
Google Sign-In / Email/Mot de passe
    ↓
API Auth → Token JWT + User
    ↓
Stockage Sécurisé
    ↓
Tableau de bord
```

### Écrans
- **Onboarding** (première utilisation)
- **Login** (connexion Google + email)
- **Register** (inscription email)
- **Forgot Password** (récupération mot de passe)

### API Endpoints
```dart
// Authentification
POST /auth/login
POST /auth/register
POST /auth/google
POST /auth/logout
POST /auth/refresh
GET /auth/profile
```

### Code Example
```dart
// lib/features/auth/auth_service.dart
class AuthService {
  final Dio _dio;
  final FlutterSecureStorage _storage;

  Future<AuthResult> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignInService.signIn();
      final response = await _dio.post('/auth/google', 
        data: {'token': googleUser?.idToken});
      
      await _storage.write(key: 'access_token', value: response.data['access_token']);
      return AuthResult.success(response.data['user']);
    } catch (e) {
      return AuthResult.error(e.toString());
    }
  }

  Future<bool> isAuthenticated() async {
    final token = await _storage.read(key: 'access_token');
    return token != null;
  }
}
```

---

## Étape 2: Liste des Événements Publics

### Flow
```
Tableau de bord
    ↓
Fetch Événements Publics
    ↓
Affichage Grid/Liste
    ↓
Pull-to-refresh / Pagination
    ↓
Filtres (Catégorie, Date, Prix, Localisation)
    ↓
Navigation vers Détail
```

### Écrans
- **Home** (liste événements en vedette)
- **Events List** (liste complète avec filtres)
- **Search** (recherche avancée)
- **Categories** (navigation par catégorie)

### API Endpoints
```dart
// Événements
GET /events/public?page=1&limit=20
GET /events/search?q=concert&category=music
GET /events/categories
GET /events/{id}/preview
```

### Features
- **Pagination infinie** (scroll infini)
- **Pull-to-refresh**
- **Filtres multiples**:
  - Catégorie (concert, théâtre, sport, etc.)
  - Plage de prix
  - Dates (aujourd'hui, cette semaine, ce mois)
  - Localisation (GPS + manuelle)
- **Recherche** en temps réel
- **Favoris** (cœurs pour sauvegarder)

### Code Example
```dart
// lib/features/events/events_service.dart
class EventsService {
  Future<List<Event>> getPublicEvents({int page = 1, Map<String, dynamic>? filters}) async {
    try {
      final response = await _dio.get('/events/public',
        queryParameters: {...filters, 'page': page});
      
      return (response.data['data'] as List)
          .map((json) => Event.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to load events');
    }
  }
}
```

---

## Étape 3: Détail Événement et Sélection Tickets

### Flow
```
Liste Événements
    ↓
Tap sur Événement
    ↓
Page Détail Événement
    ↓
Information complète
    ↓
Sélection Type de Ticket
    ↓
Quantité
    ↓
Validation
    ↓
Page Paiement
```

### Écrans
- **Event Detail** (informations complètes)
- **Ticket Selection** (choix types + quantités)
- **Seat Selection** (si numéroté)
- **Order Summary** (récapitulatif)

### API Endpoints
```dart
// Détails et tickets
GET /events/{id}/full
GET /events/{id}/ticket-types
POST /events/{id}/check-availability
GET /events/{id}/seats (si numéroté)
```

### Features
- **Informations complètes**:
  - Image HD de l'événement
  - Date, heure, lieu (avec carte)
  - Description complète
  - Artistes/participants
  - Règlements
- **Système de tickets**:
  - Types de tickets (VIP, Standard, Étudiant, etc.)
  - Prix dynamiques
  - Disponibilité en temps réel
  - Limits d'achat
- **Récapitulatif de commande**:
  - Détail des tickets sélectionnés
  - Sous-total + frais
  - Timer de réservation (15 min)

### Code Example
```dart
// lib/features/event_detail/event_detail_screen.dart
class EventDetailScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            flexibleSpace: Image.network(event.imageUrl, fit: BoxFit.cover),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              EventHeader(event: event),
              EventDescription(event: event),
              EventLocation(event: event),
              TicketTypesSection(eventId: event.id),
            ]),
          ),
        ],
      ),
    );
  }
}
```

---

## Étape 4: Paiement Mobile Money

### Flow
```
Sélection Tickets
    ↓
Page Paiement
    ↓
Choix Méthode de Paiement
    ↓
Formulaire Paiement
    ↓
Confirmation
    ↓
Traitement Backend
    ↓
SMS Confirmation
    ↓
Page Succès + Tickets
```

### Écrans
- **Payment Method** (sélection moyen de paiement)
- **Payment Form** (formulaire selon méthode)
- **Payment Processing** (écran de traitement)
- **Payment Success** (confirmation avec tickets)

### API Endpoints
```dart
// Paiement
POST /orders/create
POST /payments/mobile-money/initiate
GET /payments/{id}/status
POST /payments/{id}/confirm
```

### Méthodes de Paiement Supportées
- **Mobile Money**:
  - Orange Money (RDC/Côte d'Ivoire/Sénégal)
  - Airtel Money (RDC/Zambie/Nigeria)
  - M-Pesa (Kenya/Tanzanie)
- **Cartes** (Visa, Mastercard)
- **Wallet Interne** (credits Biso)

### Features
- **Sécurité**:
  - Tokenisation des cartes
  - 3D Secure
  - Validation OTP
- **Experience Utilisateur**:
  - Paiement en 1-tap (méthodes sauvegardées)
  - Instructions étape par étape
  - Timer de paiement (10 min)
  - Notifications temps réel

### Code Example
```dart
// lib/features/payment/payment_service.dart
class PaymentService {
  Future<PaymentResult> initiateMobileMoneyPayment({
    required String phoneNumber,
    required String operator, // orange, airtel, m-pesa
    required double amount,
    required String orderId,
  }) async {
    try {
      final response = await _dio.post('/payments/mobile-money/initiate',
        data: {
          'phone_number': phoneNumber,
          'operator': operator,
          'amount': amount,
          'order_id': orderId,
        });
      
      return PaymentResult.success(
        paymentId: response.data['payment_id'],
        instructions: response.data['instructions'],
      );
    } on DioException catch (e) {
      return PaymentResult.error(e.response?.data['message'] ?? 'Payment failed');
    }
  }
}
```

---

## Étape 5: Liste des Tickets

### Flow
```
Paiement Succès
    ↓
Génération Tickets
    ↓
Stockage Local
    ↓
Page "Mes Tickets"
    ↓
Liste par État
    ↓
Détail Ticket (QR Code)
    ↓
Validation Scan
```

### Écrans
- **My Tickets** (liste principale)
- **Ticket Detail** (détail avec QR code)
- **Past Tickets** (historique)
- **Ticket Transfer** (transfert tickets)

### API Endpoints
```dart
// Tickets
GET /tickets/my-tickets
GET /tickets/{id}/details
GET /tickets/{id}/qr-code
POST /tickets/{id}/validate (pour organisateurs)
POST /tickets/{id}/transfer
```

### Features
- **Gestion des tickets**:
  - Liste par statut (à venir, utilisés, expirés)
  - Tri par date/événement
  - Recherche rapide
- **Tickets numériques**:
  - QR codes hors ligne
  - Design personnalisé par événement
  - Informations complètes
  - Partage facile
- **Validation**:
  - Scan QR code (mode offline)
  - Notification de validation
  - Historique de validation

### Code Example
```dart
// lib/features/tickets/tickets_service.dart
class TicketsService {
  Future<List<Ticket>> getMyTickets({TicketStatus? status}) async {
    try {
      final response = await _dio.get('/tickets/my-tickets',
        queryParameters: {'status': status?.name});
      
      return (response.data['tickets'] as List)
          .map((json) => Ticket.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to load tickets');
    }
  }

  Future<String> generateQRCode(String ticketId) async {
    final response = await _dio.get('/tickets/$ticketId/qr-code');
    return response.data['qr_code_data'];
  }
}
```

---

## Navigation Flow Global

### Route Structure
```dart
// lib/router/app_router.dart
@AdaptiveAutoRoute(
  pages: [
    // Auth
    AutoRoute(page: LoginScreen, initial: true),
    AutoRoute(page: RegisterScreen),
    
    // Main App
    AutoRoute(page: HomeScreen, guards: [AuthGuard]),
    AutoRoute(page: EventsListScreen),
    AutoRoute(page: EventDetailScreen),
    AutoRoute(page: PaymentScreen),
    AutoRoute(page: TicketsListScreen),
    AutoRoute(page: TicketDetailScreen),
  ],
)
```

### State Management
```dart
// lib/core/providers/app_state_provider.dart
class AppStateProvider extends ChangeNotifier {
  // Auth state
  User? _user;
  bool _isAuthenticated = false;
  
  // Navigation state
  int _currentIndex = 0;
  
  // Cart state
  Map<int, TicketSelection> _selectedTickets = {};
  
  // Payment state
  PaymentResult? _lastPayment;
  
  // Methods
  Future<void> authenticateUser(User user) async {
    _user = user;
    _isAuthenticated = true;
    await _storage.write(key: 'user', value: jsonEncode(user.toJson()));
    notifyListeners();
  }
  
  void selectTicket(int ticketTypeId, int quantity) {
    _selectedTickets[ticketTypeId] = TicketSelection(ticketTypeId, quantity);
    notifyListeners();
  }
}
```

---

## Performance & Optimisations

### Optimisations
- **Lazy Loading**: Charger les données au fur et à mesure
- **Image Caching**: Cache local des images d'événements
- **Offline Support**: Mode hors ligne pour les tickets
- **Background Sync**: Synchronisation en arrière-plan
- **Memory Management**: Nettoyage des ressources non utilisées

---

## Checklist de Développement

### Phase 1: Foundation
- [ ] Setup projet Flutter
- [ ] Configuration navigation
- [ ] Authentification base
- [ ] API client setup
- [ ] Tests unitaires core

### Phase 2: Features
- [ ] Login Google implémenté
- [ ] Liste événements fonctionnelle
- [ ] Détail événement complet
- [ ] Sélection tickets working
- [ ] Intégration paiement mobile

### Phase 3: Polish
- [ ] UI/UX refinements
- [ ] Animations et transitions
- [ ] Tests end-to-end
- [ ] Performance optimisations
- [ ] Documentation complète

### Phase 4: Launch
- [ ] Testing final
- [ ] Store submission
- [ ] Monitoring setup
- [ ] User support ready
- [ ] Marketing materials

Ce workflow fournit une base solide pour développer l'application mobile Biso Ticket avec une expérience utilisateur fluide et sécurisée.
