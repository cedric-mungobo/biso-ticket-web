# Roadmap Technique Détaillée - Biso Ticket SaaS

## Vue d'ensemble

Ce document détaille la roadmap technique pour chaque phase, incluant les composables, composants et pages à développer, ainsi que l'architecture technique spécifique.

---

## 🚀 **PHASE 1 : Client User - Roadmap Technique**

### **Semaines 1-2 : Système d'authentification et structure de base**

#### **Composables à créer**
```typescript
// app/composables/useAuth.ts
export const useAuth = () => {
  const { post, get, put } = useCustomFetch()
  
  const register = async (userData: RegisterData) => {
    return await post<AuthResponse>('/register', userData)
  }
  
  const login = async (credentials: LoginData) => {
    return await post<AuthResponse>('/login', credentials)
  }
  
  const logout = async () => {
    return await post('/logout')
  }
  
  const getProfile = async () => {
    return await get<ProfileResponse>('/profile')
  }
  
  const updateProfile = async (profileData: ProfileUpdateData) => {
    return await put<ProfileResponse>('/profile', profileData)
  }
  
  const changePassword = async (passwordData: PasswordChangeData) => {
    return await put<PasswordChangeResponse>('/profile/password', passwordData)
  }
  
  return { register, login, logout, getProfile, updateProfile, changePassword }
}
```

#### **Composables à créer**
```typescript
// app/composables/usePublicEvents.ts
export const usePublicEvents = () => {
  const { get } = useCustomFetch()
  
  const getPublicEvents = async (params?: EventFilters) => {
    return await get<EventsResponse>('/public/events', params)
  }
  
  const getEventBySlug = async (slug: string) => {
    return await get<EventResponse>(`/public/events/${slug}`)
  }
  
  const getEventTickets = async (slug: string, params?: TicketFilters) => {
    return await get<TicketsResponse>(`/public/events/${slug}/tickets`, params)
  }
  
  return { getPublicEvents, getEventBySlug, getEventTickets }
}
```

#### **Composants à créer**
- `app/components/auth/LoginForm.vue` - Formulaire de connexion
- `app/components/auth/RegisterForm.vue` - Formulaire d'inscription
- `app/components/auth/ProfileForm.vue` - Formulaire de profil
- `app/components/auth/PasswordChangeForm.vue` - Changement de mot de passe
- `app/components/auth/AuthGuard.vue` - Protection des routes
- `app/components/EventCard.vue` - Carte d'événement
- `app/components/EventList.vue` - Liste des événements avec pagination
- `app/components/EventFilters.vue` - Filtres de recherche
- `app/components/EventDetail.vue` - Détail d'un événement
- `app/components/TicketSelector.vue` - Sélecteur de tickets

#### **Pages à créer/modifier**
- `app/pages/connexion.vue` - Page de connexion
- `app/pages/inscription.vue` - Page d'inscription
- `app/pages/profile.vue` - Page de profil utilisateur
- `app/pages/index.vue` - Page d'accueil avec événements
- `app/pages/evenements/index.vue` - Liste des événements
- `app/pages/evenements/[slug]/index.vue` - Détail événement

### **Semaines 3-4 : Événements publics et gestion des tickets**

#### **Composables à créer**
```typescript
// app/composables/usePublicEvents.ts
export const usePublicEvents = () => {
  const { get } = useCustomFetch()
  
  const getPublicEvents = async (params?: EventFilters) => {
    return await get<EventsResponse>('/public/events', params)
  }
  
  const getEventBySlug = async (slug: string) => {
    return await get<EventResponse>(`/public/events/${slug}`)
  }
  
  const getEventTickets = async (slug: string, params?: TicketFilters) => {
    return await get<TicketsResponse>(`/public/events/${slug}/tickets`, params)
  }
  
  return { getPublicEvents, getEventBySlug, getEventTickets }
}
```

#### **Composables à créer**
```typescript
// app/composables/useReservation.ts
export const useReservation = () => {
  const { post, get } = useCustomFetch()
  
  const createOrder = async (eventId: string, tickets: TicketSelection[]) => {
    return await post<OrderResponse>(`/client/events/${eventId}/orders`, {
      items: tickets.map(t => ({ ticket_id: t.ticketId, quantity: t.quantity }))
    })
  }
  
  const getOrder = async (eventId: string, orderId: string) => {
    return await get<OrderResponse>(`/client/events/${eventId}/orders/${orderId}`)
  }
  
  return { createOrder, getOrder }
}
```

#### **Composants à créer**
- `app/components/ReservationForm.vue` - Formulaire de réservation
- `app/components/OrderSummary.vue` - Récapitulatif de commande
- `app/components/TicketCounter.vue` - Compteur de tickets
- `app/components/PriceCalculator.vue` - Calculateur de prix

#### **Pages à créer**
- `app/pages/evenements/[slug]/reservation.vue` - Page de réservation

### **Semaines 5-6 : Système de réservation, paiement et tests**

#### **Composables à créer**
```typescript
// app/composables/usePayment.ts
export const usePayment = () => {
  const { post } = useCustomFetch()
  
  const initiatePayment = async (eventId: string, orderId: string, paymentData: PaymentData) => {
    return await post<PaymentResponse>(`/client/events/${eventId}/orders/${orderId}/payments`, paymentData)
  }
  
  const checkPaymentStatus = async (reference: string) => {
    return await get<PaymentStatusResponse>(`/payments/status/${reference}`)
  }
  
  return { initiatePayment, checkPaymentStatus }
}
```

#### **Composants à créer**
- `app/components/PaymentForm.vue` - Formulaire de paiement
- `app/components/PaymentMethods.vue` - Sélection méthode de paiement
- `app/components/PaymentStatus.vue` - Statut du paiement
- `app/components/FlexPayIntegration.vue` - Intégration FlexPay

#### **Pages à créer**
- `app/pages/evenements/[slug]/paiement.vue` - Page de paiement (déjà existante, à adapter)
- `app/pages/confirmation/[orderId].vue` - Page de confirmation

---

## 🏢 **PHASE 2 : Gestion des événements - Roadmap Technique**

### **Semaines 7-8 : CRUD événements et billets**

#### **Composables à créer**
```typescript
// app/composables/useEventManagement.ts
export const useEventManagement = () => {
  const { get, post, put, delete: del } = useCustomFetch()
  
  const getEvents = async (params?: EventFilters) => {
    return await get<EventsResponse>('/events', params)
  }
  
  const createEvent = async (eventData: FormData) => {
    return await post<EventResponse>('/events', eventData)
  }
  
  const updateEvent = async (id: string, eventData: FormData) => {
    return await put<EventResponse>(`/events/${id}`, eventData)
  }
  
  const deleteEvent = async (id: string) => {
    return await del(`/events/${id}`)
  }
  
  return { getEvents, createEvent, updateEvent, deleteEvent }
}
```

```typescript
// app/composables/useTicketManagement.ts
export const useTicketManagement = () => {
  const { get, post, put, delete: del } = useCustomFetch()
  
  const getEventTickets = async (eventId: string) => {
    return await get<TicketsResponse>(`/events/${eventId}/tickets`)
  }
  
  const createTicket = async (eventId: string, ticketData: TicketData) => {
    return await post<TicketResponse>(`/events/${eventId}/tickets`, ticketData)
  }
  
  const updateTicket = async (eventId: string, ticketId: string, ticketData: TicketData) => {
    return await put<TicketResponse>(`/events/${eventId}/tickets/${ticketId}`, ticketData)
  }
  
  const deleteTicket = async (eventId: string, ticketId: string) => {
    return await del(`/events/${eventId}/tickets/${ticketId}`)
  }
  
  return { getEventTickets, createTicket, updateTicket, deleteTicket }
}
```

#### **Composants à créer**
- `app/components/EventForm.vue` - Formulaire de création/édition d'événement
- `app/components/EventImageUpload.vue` - Upload d'images d'événement
- `app/components/EventSettings.vue` - Configuration des paramètres
- `app/components/TicketForm.vue` - Formulaire de création/édition de ticket
- `app/components/TicketPricing.vue` - Gestion des prix et devises

#### **Pages à créer**
- `app/pages/organisateur/events/index.vue` - Liste des événements organisateur
- `app/pages/organisateur/events/create.vue` - Création d'événement
- `app/pages/organisateur/events/[id]/edit.vue` - Édition d'événement
- `app/pages/organisateur/events/[id]/tickets.vue` - Gestion des tickets

### **Semaines 9-10 : Configuration et gestion des commandes**

#### **Composables à créer**
```typescript
// app/composables/useOrderManagement.ts
export const useOrderManagement = () => {
  const { get, put } = useCustomFetch()
  
  const getEventOrders = async (eventId: string, params?: OrderFilters) => {
    return await get<OrdersResponse>(`/events/${eventId}/orders`, params)
  }
  
  const getOrderDetails = async (eventId: string, orderId: string) => {
    return await get<OrderResponse>(`/events/${eventId}/orders/${orderId}`)
  }
  
  const updateOrderStatus = async (eventId: string, orderId: string, status: OrderStatus) => {
    return await put<OrderResponse>(`/events/${eventId}/orders/${orderId}`, { status })
  }
  
  return { getEventOrders, getOrderDetails, updateOrderStatus }
}
```

#### **Composants à créer**
- `app/components/OrdersDashboard.vue` - Tableau de bord des commandes
- `app/components/OrderList.vue` - Liste des commandes
- `app/components/OrderDetails.vue` - Détails d'une commande
- `app/components/OrderStatusManager.vue` - Gestion des statuts
- `app/components/OrdersExport.vue` - Export des données

#### **Pages à créer**
- `app/pages/organisateur/events/[id]/orders.vue` - Gestion des commandes
- `app/pages/organisateur/events/[id]/analytics.vue` - Analytics des ventes

### **Semaines 11-12 : Système de scan et POS**

#### **Composables à créer**
```typescript
// app/composables/useScanSystem.ts
export const useScanSystem = () => {
  const { post, get } = useCustomFetch()
  
  const scanTicket = async (eventId: string, qrCode: string) => {
    return await post<ScanResponse>(`/events/${eventId}/scans`, { qr_code: qrCode })
  }
  
  const getScanHistory = async (eventId: string, params?: ScanFilters) => {
    return await get<ScansResponse>(`/events/${eventId}/scans`, params)
  }
  
  return { scanTicket, getScanHistory }
}
```

```typescript
// app/composables/usePOSSystem.ts
export const usePOSSystem = () => {
  const { post, put, get } = useCustomFetch()
  
  const openPOSSession = async () => {
    return await post<POSSessionResponse>('/pos-sessions')
  }
  
  const closePOSSession = async (sessionId: string) => {
    return await put<POSSessionResponse>(`/pos-sessions/${sessionId}`)
  }
  
  const createOfflineSale = async (sessionId: string, saleData: OfflineSaleData) => {
    return await post<OfflineSaleResponse>(`/pos-sessions/${sessionId}/offline-sales`, saleData)
  }
  
  return { openPOSSession, closePOSSession, createOfflineSale }
}
```

#### **Composants à créer**
- `app/components/QRScanner.vue` - Scanner QR code
- `app/components/ScanHistory.vue` - Historique des scans
- `app/components/POSSession.vue` - Gestion de session POS
- `app/components/OfflineSaleForm.vue` - Formulaire de vente offline
- `app/components/ScanAnalytics.vue` - Analytics des scans

#### **Pages à créer**
- `app/pages/organisateur/events/[id]/scan.vue` - Interface de scan
- `app/pages/organisateur/pos/index.vue` - Gestion POS

---

## ⚙️ **PHASE 3 : Configuration avancée - Roadmap Technique**

### **Semaines 13-14 : Système d'invitations**

#### **Composables à créer**
```typescript
// app/composables/useInvitationSystem.ts
export const useInvitationSystem = () => {
  const { get, post, put, delete: del } = useCustomFetch()
  
  const getEventInvitations = async (eventId: string, params?: InvitationFilters) => {
    return await get<InvitationsResponse>(`/events/${eventId}/invitations`, params)
  }
  
  const createInvitation = async (eventId: string, invitationData: InvitationData) => {
    return await post<InvitationResponse>(`/events/${eventId}/invitations`, invitationData)
  }
  
  const updateInvitation = async (eventId: string, invitationId: string, invitationData: InvitationData) => {
    return await put<InvitationResponse>(`/events/${eventId}/invitations/${invitationId}`, invitationData)
  }
  
  const deleteInvitation = async (eventId: string, invitationId: string) => {
    return await del(`/events/${eventId}/invitations/${invitationId}`)
  }
  
  return { getEventInvitations, createInvitation, updateInvitation, deleteInvitation }
}
```

```typescript
// app/composables/useInvitationTemplates.ts
export const useInvitationTemplates = () => {
  const { get } = useCustomFetch()
  
  const getTemplates = async (params?: TemplateFilters) => {
    return await get<TemplatesResponse>('/invitation-templates', params)
  }
  
  const getTemplateById = async (templateId: string) => {
    return await get<TemplateResponse>(`/invitation-templates/${templateId}`)
  }
  
  return { getTemplates, getTemplateById }
}
```

#### **Composants à créer**
- `app/components/InvitationForm.vue` - Formulaire d'invitation
- `app/components/InvitationList.vue` - Liste des invitations
- `app/components/InvitationTemplate.vue` - Aperçu de template
- `app/components/InvitationSender.vue` - Envoi d'invitations
- `app/components/RSVPManager.vue` - Gestion des RSVP

#### **Pages à créer**
- `app/pages/organisateur/events/[id]/invitations.vue` - Gestion des invitations
- `app/pages/organisateur/events/[id]/invitations/create.vue` - Création d'invitation

### **Semaines 15-16 : Gestion des crédits**

#### **Composables à créer**
```typescript
// app/composables/useCreditSystem.ts
export const useCreditSystem = () => {
  const { get, post } = useCustomFetch()
  
  const getCreditBalance = async () => {
    return await get<CreditBalanceResponse>('/credits/balance')
  }
  
  const getCreditPrice = async () => {
    return await get<CreditPriceResponse>('/credits/price')
  }
  
  const purchaseCredits = async (creditData: CreditPurchaseData) => {
    return await post<CreditPurchaseResponse>('/credits/purchase-and-pay', creditData)
  }
  
  const getCreditHistory = async (params?: CreditFilters) => {
    return await get<CreditsHistoryResponse>('/credits/ledger', params)
  }
  
  return { getCreditBalance, getCreditPrice, purchaseCredits, getCreditHistory }
}
```

#### **Composants à créer**
- `app/components/CreditBalance.vue` - Affichage du solde
- `app/components/CreditPurchase.vue` - Achat de crédits
- `app/components/CreditHistory.vue` - Historique des transactions
- `app/components/CreditPricing.vue` - Tarification des crédits

#### **Pages à créer**
- `app/pages/credits/index.vue` - Gestion des crédits
- `app/pages/credits/purchase.vue` - Achat de crédits
- `app/pages/credits/history.vue` - Historique des crédits

### **Semaines 17-18 : Administration et finalisation**

#### **Composables à créer**
```typescript
// app/composables/useAdminSystem.ts
export const useAdminSystem = () => {
  const { get, post } = useCustomFetch()
  
  const getEventCategories = async () => {
    return await get<CategoriesResponse>('/presets/event-categories')
  }
  
  const updateEventCategories = async (categories: string[]) => {
    return await post<CategoriesResponse>('/presets/event-categories', { categories })
  }
  
  const getSystemHealth = async () => {
    return await get<HealthResponse>('/health')
  }
  
  return { getEventCategories, updateEventCategories, getSystemHealth }
}
```

#### **Composants à créer**
- `app/components/AdminDashboard.vue` - Tableau de bord admin
- `app/components/CategoryManager.vue` - Gestion des catégories
- `app/components/SystemHealth.vue` - Santé du système
- `app/components/UserManagement.vue` - Gestion des utilisateurs
- `app/components/AuditLog.vue` - Logs d'audit

#### **Pages à créer**
- `app/pages/admin/index.vue` - Dashboard admin
- `app/pages/admin/categories.vue` - Gestion des catégories
- `app/pages/admin/users.vue` - Gestion des utilisateurs
- `app/pages/admin/system.vue` - Configuration système

---

## 🏗️ **Architecture Technique Globale**

### **Structure des composables**
```
app/composables/
├── useCustomFetch.ts          # Base pour tous les appels API
├── useAuth.ts                 # Phase 1 - Authentification (PRIORITÉ 1)
├── usePublicEvents.ts         # Phase 1 - Événements publics
├── useReservation.ts          # Phase 1 - Réservations
├── usePayment.ts              # Phase 1 - Paiements
├── useEventManagement.ts      # Phase 2 - Gestion événements
├── useTicketManagement.ts     # Phase 2 - Gestion tickets
├── useOrderManagement.ts      # Phase 2 - Gestion commandes
├── useScanSystem.ts           # Phase 2 - Système de scan
├── usePOSSystem.ts            # Phase 2 - Système POS
├── useInvitationSystem.ts     # Phase 3 - Système invitations
├── useInvitationTemplates.ts  # Phase 3 - Templates invitations
├── useCreditSystem.ts         # Phase 3 - Système crédits
└── useAdminSystem.ts          # Phase 3 - Administration
```

### **Structure des composants**
```
app/components/
├── auth/                      # Phase 1 - Composants authentification (PRIORITÉ 1)
├── events/                    # Phase 1 - Composants événements
├── tickets/                   # Phase 1 - Composants tickets
├── reservation/               # Phase 1 - Composants réservation
├── payment/                   # Phase 1 - Composants paiement
├── management/                # Phase 2 - Composants gestion
├── scan/                      # Phase 2 - Composants scan
├── invitations/               # Phase 3 - Composants invitations
├── credits/                   # Phase 3 - Composants crédits
└── admin/                     # Phase 3 - Composants administration
```

### **Structure des pages**
```
app/pages/
├── index.vue                  # Accueil
├── connexion.vue              # Phase 1 - Connexion (PRIORITÉ 1)
├── inscription.vue            # Phase 1 - Inscription (PRIORITÉ 1)
├── profile.vue                # Phase 1 - Profil utilisateur (PRIORITÉ 1)
├── evenements/                # Phase 1 - Événements publics
├── reservation/               # Phase 1 - Réservations
├── confirmation/              # Phase 1 - Confirmations
├── organisateur/              # Phase 2 - Espace organisateur
├── credits/                   # Phase 3 - Gestion crédits
└── admin/                     # Phase 3 - Administration
```

---

## 🔧 **Dépendances et Intégrations**

### **Phase 1**
- **Authentification** : Sanctum avec cookies, gestion des tokens
- **Sécurité** : Middleware d'authentification, validation des formulaires
- **FlexPay** : Intégration pour les paiements
- **Upload d'images** : Pour les événements et profils utilisateurs

### **Phase 2**
- QR code generation pour les billets
- Système de scan mobile
- Gestion des fichiers multipart

### **Phase 3**
- Système d'email/SMS pour invitations
- Webhooks FlexPay pour crédits
- Système de templates d'invitation

---

## 📊 **Métriques et Monitoring**

### **Phase 1**
- Temps de chargement des pages
- Taux de conversion réservation
- Taux de succès paiement

### **Phase 2**
- Temps de création d'événement
- Performance du système de scan
- Utilisation des fonctionnalités POS

### **Phase 3**
- Taux d'ouverture des invitations
- Utilisation du système de crédits
- Performance du système admin

---

## 🎯 **Conclusion**

Cette roadmap technique détaillée fournit un plan d'action clair pour chaque phase, avec des composables, composants et pages spécifiques à développer. L'approche modulaire permet un développement progressif et une maintenance facilitée.

Chaque phase construit sur la précédente, créant une plateforme robuste et évolutive qui respecte les bonnes pratiques de développement et l'architecture existante.
