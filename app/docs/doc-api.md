## API Frontend Guide

# Biso Ticket SaaS 

## 1. Objectif du produit

Créer une plateforme SaaS permettant aux organisateurs d'événements de :

* Gérer les invitations électroniques.
* Gérer la billetterie (gratuit et payant).
* Contrôler l'accès aux événements sur site via application mobile offline et site client.
* Vendre et gérer les billets en ligne  via FlexPay.
* Suivre les ventes, statistiques et commissions.

---

Base URL: `http://api.bisoticket.com/api	`

### Headers
- **Content-Type**: `application/json`
- **Accept**: `application/json` (recommandé pour éviter le HTML)
- **Authorization**: `Bearer {token}` (pour les routes protégées)

### Format des réponses
- Succès:
```json
{ "status": true, "message": "...", "data": { } }
```
- Pagination:
```json
{ "status": true, "message": "...", "data": { "items": [ ... ], "meta": { "currentPage": 1, "lastPage": 5, "perPage": 15, "total": 73 } } }
```
- Erreur:
```json
{ "status": false, "message": "...", "errors": { } }
```

---

## Auth

- POST `/api/register`
  - body: `{ "name": string, "email": string, "telephone"?: string, "password": string }`
  - 201: `{ status, message, data: { user: { id,name,email,telephone }, token } }`

- POST `/api/login`
  - body: `{ "identifier": string /* email ou telephone */, "password": string }`
  - 200: `{ status, message, data: { user, token } }`

- POST `/api/logout` (auth)
  - 200: `{ status, message }`

---

## Profil (auth)

- GET `/api/profile` → `{ status, message, data: User }`
- PUT/PATCH `/api/profile` → body: `{ name?, email?, telephone?, password? }` → `User`
- PUT `/api/profile/password` → body: `{ password: string }` → `{ revokedTokens: number }`

---

## Client (public)

- GET `/api/flexpay/approve|cancel|decline`
  - 200: `{ status, message, data: { reference, orderNumber } }`

### Parcours client (public + auth)

- Public
  - GET `/api/public/events?per_page=15&q=` → liste d'événements publics actifs
  - GET `/api/public/events/{slug}` → détail d'événement (par slug ou id)
  - GET `/api/public/events/{slug}/tickets?per_page=15` → billets disponibles

- Auth (client)
  - POST `/api/client/events/{event}/orders` → créer commande (pending)
    - body: `{ items: [{ ticket_id, quantity }, ...] }`
  - GET `/api/client/events/{event}/orders/{order}` → voir commande (client propriétaire)
  - POST `/api/client/events/{event}/orders/{order}/payments` → initier paiement (FlexPay/cash)
    - body: `{ method, currency, phone_number?, channel? (webapi|mobile_app|pos), metadata? }`
    - notes:
      - `status`/`reference`/`amount` sont générés côté serveur.
      - `phone_number` format E.164 local FlexPay: 243XXXXXXXXX.
      - `channel` est la source (ex: `webapi`), `payment_provider` le prestataire (ex: `flexpay`).

  - POST `/api/client/events/{event}/orders/purchase-and-pay` → créer et payer en une requête
    - body:
```json
{
  "items": [ { "ticket_id": 123, "quantity": 1 } ],
  "payment": {
    "method": "mobile_money",
    "currency": "CDF",
    "phone_number": "243826785727",
    "channel": "webapi"
  }
}
```
    - 201: `{ status, message, data: { order: {...}, payment: {...} } }`
    - en cas de succès FlexPay, `data.payment.metadata.flexpay` contient `{ code, message, orderNumber }`.

Exemple cURL (une requête):
```bash
curl -X POST 'http://bisoticket-backend.test/api/client/events/{EVENT_ID}/orders/purchase-and-pay' \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "items":[{"ticket_id": {TICKET_ID}, "quantity": 1}],
    "payment":{
      "method":"mobile_money",
      "currency":"CDF",
      "phone_number":"243826785727",
      "channel":"webapi",
      "payment_provider":"flexpay"
    }
  }'
```

Notes FlexPay:
- Montant minimal configurable via env: `FLEXPAY_MIN_AMOUNT_CDF` (défaut 1000), `FLEXPAY_MIN_AMOUNT_USD` (défaut 1). L’API bloque en dessous.
- Le serveur génère `reference`/`amount` et calcule le total depuis les items (conversion devise si nécessaire).
- Le push STK/USSD peut prendre 30–90s selon l’opérateur. Les métadonnées incluent `metadata.flexpay.orderNumber`.

### Vérifier le statut d’un paiement (client)
- GET `/api/client/payments/check?reference=...` ou `/api/client/payments/check?order_number=...`
  - 200: `{ status, message, data: { code, message, status: 'paid'|'failed'|null, orderNumber, reference } }`
  - Notes: appelle FlexPay `check`, et si succès (`status=paid`), met à jour `payments.status=paid` et `orders.status=paid`.

### Mes tickets (client)
- GET `/api/client/tickets?per_page=15`
  - Auth Sanctum requis
  - Retourne tous les items des commandes payées de l’utilisateur courant
  - 200:
```json
{
  "status": true,
  "message": "Tickets payés",
  "data": {
    "data": [
      {
        "id": 123,
        "event": {
          "id": 5,
          "title": "Concert Biso",
          "startsAt": "2025-02-01T18:00:00Z",
          "endsAt": "2025-02-01T22:00:00Z",
          "imageUrl": "https://.../storage/events/5.jpg"
        },
        "ticket": {
          "id": 9,
          "name": "VIP",
          "price": 50,
          "currency": "USD"
        },
        "quantity": 1,
        "qrCode": "QRCODE_BASE64_OU_TEXTE",
        "createdAt": "2025-02-01T18:05:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

Exemple cURL:
```bash
curl -s 'http://bisoticket-backend.test/api/client/tickets?per_page=20' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {TOKEN}'
```

Notes:
- Les items listés sont uniquement ceux dont la commande est payée.
- Le champ `qrCode` est présent côté item lorsque l’`order.status` est `paid`.

---

## Organisateur (auth)

### Événements
Disponibilité: back office (organisateur) uniquement. Non disponible via les endpoints publics/clients.
- GET `/api/events?per_page=15` → pagination `Event`
- POST `/api/events` (JSON ou multipart pour `image`)
  - body: `{ title, location?, starts_at, ends_at?, status?, is_public?, settings? }`
  - 201: `Event`
- GET `/api/events/{id}` → `Event`
- PUT/PATCH `/api/events/{id}` → `Event`
- DELETE `/api/events/{id}` → `{ status, message }`

Event (resource)
```json
{
  "id": 1,
  "title": "...",
  "slug": "...",
  "location": "...",
  "description": "...",
  "startsAt": "2025-01-01T10:00:00Z",
  "endsAt": null,
  "imageUrl": "https://...",
  "status": "draft|active|ended|cancelled|suspended",
  "isPublic": true,
  "organizerId": 3,
   "settings": {
    "scanEnabled": true,
    "categories": [],
    "priorities": [],
    "featured": false,
    "tags": [],
    "defaultInvitationTemplateId": 5,
    "defaultInvitationTemplate": { "id": 5, "title": "Classique", "designKey": "classic_v1", "previewImageUrl": "https://...", "isDefault": true }
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

Définir le template d’invitation par défaut d’un événement
- Lors de la création (POST /api/events), vous pouvez inclure `settings.default_invitation_template_id`.
- Pour modifier un événement existant (PUT/PATCH), envoyez uniquement ce champ dans `settings`.

Exemple (PUT /api/events/{id})
```bash
curl -X PUT http://api.bisoticket.com/api	/events/123 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "default_invitation_template_id": 5
    }
  }'
```

Comportement
- Si une invitation est créée sans `invitation_template_id`, l’API appliquera automatiquement le template défini par `settings.default_invitation_template_id` de l’événement.

Champs création/mise à jour (événement)
- title (string, required)
- location (string, nullable)
- starts_at (datetime, required)
- ends_at (datetime, nullable, ≥ starts_at)
- image (file, image, ≤ 5MB) via multipart form-data
- status (enum: draft|active|ended|cancelled|suspended)
- is_public (bool)
- settings (objet):
  - settings.scan_enabled (bool)
  - settings.categories (array de string)
  - settings.tags (array de string)
  - settings.default_invitation_template_id (number|null)
  - (Restriction) `settings.featured` et `settings.priorities` ne sont pas acceptés via API (ni création, ni mise à jour).

Exemple JSON (POST /api/events)
```json
{
  "title": "Concert Biso",
  "location": "Kinshasa",
  "starts_at": "2025-02-01T18:00:00Z",
  "ends_at": "2025-02-01T22:00:00Z",
  "status": "active",
  "is_public": true,
  "settings": {
    "scan_enabled": true,
    "categories": ["music", "live"],
    "tags": ["biso", "launch", "2025"],
    "default_invitation_template_id": 5
  }
}
```

Important
- Côté frontend, envoyez toujours l'image via le champ fichier `image` (multipart). N'envoyez pas `image_url`.
- Le champ `imageUrl` dans la réponse est généré par le backend après upload et stockage.

Exemple multipart (POST /api/events, upload image)
```bash
curl -X POST http://api.bisoticket.com/api	/events \
  -H "Authorization: Bearer TOKEN" \
  -F "title=Concert Biso" \
  -F "location=Kinshasa" \
  -F "starts_at=2025-02-01T18:00:00Z" \
  -F "ends_at=2025-02-01T22:00:00Z" \
  -F "status=active" \
  -F "is_public=1" \
  -F "image=@/path/cover.jpg" \
  -F "settings[scan_enabled]=1" \
  -F "settings[categories][]=music" \
  -F "settings[categories][]=live" \
  -F "settings[priorities][]=VIP" \
  -F "settings[priorities][]=Regular" \
  -F "settings[featured]=0" \
  -F "settings[tags][]=biso" \
  -F "settings[tags][]=launch" \
  -F "settings[tags][]=2025"
```

Exemple multipart (PATCH /api/events/{id}, remplacer uniquement l'image)
```bash
curl -X PATCH http://api.bisoticket.com/api	/events/{id} \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@/path/new-cover.jpg"
```

Exemple multipart (PATCH /api/events/{id}, image + champs)
```bash
curl -X PATCH http://api.bisoticket.com/api	/events/{id} \
  -H "Authorization: Bearer TOKEN" \
  -F "title=Concert Biso (updated)" \
  -F "status=active" \
  -F "image=@/path/new-cover.jpg" \
  -F "settings[tags][]=biso" \
  -F "settings[tags][]=updated"
```

Notes
- Les clés de `settings` sont en snake_case dans la requête et renvoyées en camelCase dans la réponse (`scan_enabled` → `scanEnabled`, etc.).
- Pour lister publiquement un événement: `is_public=true` et `status=active`.

### Billets
- GET `/api/events/{event}/tickets?per_page=15` → pagination `Ticket`
- POST `/api/events/{event}/tickets` → 201 `Ticket`
- GET `/api/tickets/{ticket}` → `Ticket` (shallow)
- PUT/PATCH `/api/tickets/{ticket}` → `Ticket` (shallow)
- DELETE `/api/tickets/{ticket}` → `{ status, message }` (shallow)

Ticket (resource)
```json
{
  "id": 1,
  "eventId": 1,
  "name": "VIP",
  "price": 50,
  "currency": "USD",
  "quantity": 200,
  "commissionRate": 10,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Payload (création)
```json
{
  "name": "VIP",
  "price": 50,
  "currency": "USD",
  "quantity": 200
}
```

Exemple cURL (création)
```bash
curl -X POST 'http://api.bisoticket.com/api/\
events/{event}/tickets' \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "VIP",
    "price": 50,
    "currency": "USD",
    "quantity": 200
  }'
```

Payload (mise à jour)
```json
{
  "name": "VIP Updated",
  "price": 60,
  "currency": "CDF",
  "quantity": 180
}
```

Exemple cURL (mise à jour, shallow)
```bash
curl -X PUT 'http://api.bisoticket.com/api/tickets/{ticket}' \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "VIP Updated",
    "price": 60,
    "currency": "CDF",
    "quantity": 180
  }'
```

Règles métier (tickets)
- `commissionRate` et `qrCode` ne sont pas modifiables via l'API (création/édition). Toute tentative est ignorée.
- Tentative de changement de `currency` lorsqu'il existe déjà des réservations pour le billet (commandes ou ventes offline) → erreur 422 avec un message de validation.
- Champs d’update autorisés: `name`, `price`, `currency` (`USD|CDF|null`), `quantity`.

Exemple d’erreur 422 (changement de devise avec réservations)
```json
{
  "status": false,
  "message": "Erreur de validation",
  "errors": {
    "currency": [
      "Impossible de changer la devise: des réservations existent déjà pour ce billet."
    ]
  }
}
```

### Invitations
- GET `/api/events/{event}/invitations?per_page=15` → pagination `Invitation`
- POST `/api/events/{event}/invitations` → 201 `Invitation`
- GET `/api/events/{event}/invitations/{invitation}` → `Invitation`
- PUT/PATCH `/api/events/{event}/invitations/{invitation}` → `Invitation`
- DELETE `/api/events/{event}/invitations/{invitation}` → `{ status, message }`

Note: si `invitation_template_id` n’est pas fourni lors de la création, l’API applique automatiquement `settings.default_invitation_template_id` de l’événement.

Invitation (resource)
```json
{
  "id": 1,
  "eventId": 1,
  "invitationTemplateId": 2,
  "guestName": "John",
  "guestEmail": "john@example.com",
  "guestPhone": "+243...",
  "guestTableName": "Table A",
  "token": "...",
  "status": "pending|sent|confirmed|cancelled",
  "sentAt": null,
  "viewedAt": null,
  "confirmedAt": null,
  "metadata": {},
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Templates d’invitation (lecture seule côté API)
- GET `/api/invitation-templates?per_page=15` → pagination `InvitationTemplate`
- GET `/api/invitation-templates/{id}` → `InvitationTemplate`

Note: la création, la mise à jour et la suppression des templates se font uniquement via le back-office (routes web `/admin/templates`). Aucune route API n’expose le CRUD.

InvitationTemplate (resource)
```json
{
  "id": 5,
  "organizerId": 1,
  "title": "Classique",
  "designKey": "classic_v1",
  "previewImageUrl": "https://.../storage/templates/classic.png",
  "isDefault": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Upload image de prévisualisation
- Champ fichier: `preview_image` (multipart/form-data)
- Champs texte: `title`, `design_key`, `is_default`
- Le backend stocke le fichier dans le disque `public` et renvoie `previewImageUrl`.

Notes
- Les endpoints ci-dessus sont protégés (admin). Le back-office utilise des routes web `/admin/templates` pour gérer les templates, mais l’API reste disponible pour intégrations programmatiques.

### Crédits d'invitation (auth)
- POST `/api/credits/purchase-and-pay` → 201 `{ reference, amount, currency, orderNumber, provider }`
  - body: `{ credits: number>=1, currency?: "USD|CDF", phone: string }`
- GET `/api/credits/balance` → `{ balance: number, unitPriceUsd: number }`
- GET `/api/credits/price` → `{ unitPriceUsd: number }`
- GET `/api/credits/ledger?per_page=15` → `{ items: [{ id, delta, balance_after, reason, meta, created_at }], meta }`
- GET `/api/credits/purchases?per_page=15` → `{ items: [{ id, credits, unit_price_usd, amount_usd, currency, amount_currency, status, reference, paid_at }], meta }`

Notes
- Les références d’achats de crédits sont préfixées `CRD-...`.
- Le webhook FlexPay crédite automatiquement le solde utilisateur quand `code === '0'` et la `reference` correspond à un achat en attente.

### Commandes
- GET `/api/events/{event}/orders?per_page=15` → pagination `Order`
- POST `/api/events/{event}/orders` → 201 `Order`
- GET `/api/events/{event}/orders/{order}` → `Order` (avec `items`)
- DELETE `/api/events/{event}/orders/{order}` → `{ status, message }`

Order (resource)
```json
{
  "id": 10,
  "eventId": 1,
  "customerId": 5,
  "totalAmount": 150,
  "status": "pending|paid|cancelled",
  "items": [ { "id": 1, "ticketId": 3, "quantity": 2, "unitPrice": 50 /*, "qrCode": "..." si paid */ } ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

Note: quand la commande est `paid`, chaque item peut inclure `qrCode`.

### Paiements
- GET `/api/events/{event}/orders/{order}/payments?per_page=15` → pagination `Payment`
- POST `/api/events/{event}/orders/{order}/payments` → 201 `Payment`

Payment (resource)
```json
{
  "id": 1,
  "orderId": 10,
  "method": "flexpay|cash|...",
  "status": "pending|confirmed|failed",
  "reference": "REF-...",
  "amount": 150,
  "currency": "CDF",
  "paidAt": null,
  "metadata": {},
  "transactions": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Commissions
- GET `/api/commissions?per_page=15` → pagination `Commission`

### Scans
- GET `/api/events/{event}/scans?per_page=15` → pagination `Scan`
- POST `/api/events/{event}/scans` → 201 `Scan`
- POST `/api/events/{event}/scans/qr` → 201 `Scan` (par QR)

### Sessions POS & ventes offline
- GET `/api/pos-sessions?per_page=15` → pagination `PosSession`
- POST `/api/pos-sessions` → 201 `PosSession` (ouvrir)
- PUT `/api/pos-sessions/{pos_session}` → `PosSession` (fermer)

- GET `/api/pos-sessions/{pos_session}/offline-sales?synced=0|1&per_page=15` → pagination `OfflineSale`
- POST `/api/pos-sessions/{pos_session}/offline-sales` → 201 `OfflineSale`
- PUT `/api/pos-sessions/{pos_session}/offline-sales/{offline_sale}` → `OfflineSale` (marquer sync)
- POST `/api/pos-sessions/{pos_session}/offline-sales/sync` → `{ status, message, data: { synced_ids: number[] } }`

### Payouts (retraits)
- GET `/api/payouts?per_page=15` → pagination
- GET `/api/payouts/balance` → `{ available: number, limits: { min, max, daily_requests, daily_amount } }`
- POST `/api/payouts` (limité par `throttle:6,1`)
  - body: `{ amount: number>=0.01, currency?: "CDF|USD" }`
  - 201: `{ ...payout }`

### Divers
- GET `/api/health` → `{ status: "ok" }`

### Presets (administration)
- GET `/api/presets/event-categories` → `{ status, data: { categories: string[] } }`
- POST `/api/presets/event-categories` (auth)
  - body: `{ categories: string[] }`
  - 200: `{ status, message, data: { categories } }`

Notes
- Toutes les routes (hors health et FlexPay) nécessitent Sanctum.
- Paramètre `per_page` gère la pagination (par défaut 15).
- Les identifiants `{event}`, `{order}`, etc. sont des IDs numériques.


