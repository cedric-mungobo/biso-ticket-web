# 🎫 Guide API de Réservation Simplifiée

## 📋 **Endpoint Principal**
```
POST /api/v1/tickets/simple/reserve
```

## 🔐 **Authentification**
- **Token Bearer** requis dans le header
- Utilisateur doit être connecté

## 📝 **Structure de la Requête**

### **Champs Obligatoires (Toujours)**
```json
{
  "tickets": [
    {
      "ticket_id": 1,
      "quantity": 2
    }
  ]
}
```

### **Champs Optionnels (Selon le Type de Ticket)**
```json
{
  "telephone": "243826785727",         // REQUIS pour mobile_money
  "payment_method": "mobile_money",    // mobile_money OU card (requis si payant)
  "payment_currency": "USD"            // USD OU CDF (requis si payant)
}
```

## 🎯 **Règles de Validation**

### **✅ Tickets Gratuits (0 CDF)**
- **Aucun champ de paiement requis**
- **Téléphone optionnel**
- Réservation immédiate

### **💰 Tickets Payants (> 0 CDF)**
- **`payment_method` OBLIGATOIRE** : `mobile_money` ou `card`
- **`payment_currency` OBLIGATOIRE** : 
  - `USD` ou `CDF` pour `mobile_money`
  - `USD` uniquement pour `card`
- **`telephone` OBLIGATOIRE** : Seulement si `payment_method = "mobile_money"`

## 📱 **Exemples d'Utilisation**

### **1. Réservation Gratuite**
```json
POST /api/v1/tickets/simple/reserve
{
  "tickets": [
    {"ticket_id": 2, "quantity": 1}
  ]
}
```

### **2. Réservation Payante - Mobile Money USD**
```json
POST /api/v1/tickets/simple/reserve
{
  "tickets": [
    {"ticket_id": 4, "quantity": 1}
  ],
      "telephone": "243826785727",
    "payment_method": "mobile_money",
    "payment_currency": "USD" /// or CDF
}
```

### **3. Réservation Payante - Carte USD**
```json
POST /api/v1/tickets/simple/reserve
{
  "tickets": [
    {"ticket_id": 4, "quantity": 1}
  ],
  "payment_method": "card",
  "payment_currency": "USD"
}
```

## 🔄 **Réponses de l'API par Type de Réservation**

### **✅ Succès - Réservation Gratuite**
```json
{
  "success": true,
  "message": "Réservation gratuite confirmée",
  "data": {
    "reservation_id": "RES_123456",
    "participants": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "243826785727",
        "ticket_type": "GRATUIT",
        "qr_code": "qr_code_123.png",
        "status": "confirmed"
      }
    ],
    "total_amount": 0,
    "currency": "CDF",
    "payment_method": "free",
    "payment_status": "completed",
    "event": {
      "id": 1,
      "name": "Concert Test FlexPay",
      "date": "2024-12-31",
      "location": "Kinshasa"
    },
    "tickets": [
      {
        "ticket_id": 2,
        "type": "GRATUIT",
        "quantity": 1,
        "price": 0,
        "currency": "CDF"
      }
    ],
    "created_at": "2024-08-27T00:00:00.000000Z"
  }
}
```

### **✅ Succès - Réservation Mobile Money**
```json
{
  "success": true,
  "message": "Redirection vers le paiement mobile money",
  "data": {
    "payment_type": "mobile_money",
    "payment_url": null,
    "business_reference": "MM_123456",
    "amount": 25500,
    "currency": "USD",
    "phone": "243826785727",
    "payment_status": "pending",
    "flexpay_response": {
      "code": "0",
      "message": "Transaction initiée avec succès",
      "orderNumber": "FlexPay_123456",
      "transaction": {
        "channel": "airtel_money",
        "status": "pending"
      }
    },
    "event": {
      "id": 1,
      "name": "Concert Test FlexPay",
      "date": "2024-12-31",
      "location": "Kinshasa"
    },
    "tickets": [
      {
        "ticket_id": 4,
        "type": "VIP USD",
        "quantity": 1,
        "price": 25.50,
        "currency": "USD"
      }
    ],
    "participants": [
      {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "243826785727",
        "ticket_type": "VIP USD",
        "qr_code": "qr_code_124.png",
        "status": "pending_payment"
      }
    ],
    "created_at": "2024-08-27T00:00:00.000000Z"
  }
}
```

### **✅ Succès - Réservation par Carte**
```json
{
  "success": true,
  "message": "Redirection vers le paiement par carte",
  "data": {
    "payment_type": "card",
    "payment_url": "https://cardpayment.flexpay.cd/v2/pay/...",
    "business_reference": "MM_123457",
    "amount": 25.50,
    "currency": "USD",
    "payment_status": "pending",
    "flexpay_response": {
      "code": "0",
      "message": "Redirection en cours",
      "orderNumber": "LeR4frf045091721",
      "url": "https://cardpayment.flexpay.cd/v2/pay/..."
    },
    "event": {
      "id": 1,
      "name": "Concert Test FlexPay",
      "date": "2024-12-31",
      "location": "Kinshasa"
    },
    "tickets": [
      {
        "ticket_id": 4,
        "type": "VIP USD",
        "quantity": 1,
        "price": 25.50,
        "currency": "USD"
      }
    ],
    "participants": [
      {
        "id": 3,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": null,
        "ticket_type": "VIP USD",
        "qr_code": "qr_code_125.png",
        "status": "pending_payment"
      }
    ],
    "created_at": "2024-08-27T00:00:00.000000Z"
  }
}
```

### **❌ Erreur - Champs Manquants**
```json
{
  "success": false,
  "message": "Devise de paiement requise pour les tickets payants. Devises supportées: USD, CDF",
  "error_code": "PAYMENT_CURRENCY_REQUIRED",
  "details": {
    "missing_field": "payment_currency",
    "required_for": "paid_tickets",
    "supported_currencies": ["USD", "CDF"]
  }
}
```

## 📊 **Codes de Statut et Messages d'Erreur**

### **🟢 Codes de Succès (200)**
| Code | Message | Description |
|------|---------|-------------|
| `RESERVATION_FREE_CONFIRMED` | Réservation gratuite confirmée | Ticket gratuit réservé immédiatement |
| `MOBILE_PAYMENT_INITIATED` | Paiement mobile money initié | Transaction FlexPay en cours |
| `CARD_PAYMENT_REDIRECT` | Redirection vers le paiement par carte | URL de paiement générée |

### **🔴 Codes d'Erreur (400/422)**
| Code | Message | Description |
|------|---------|-------------|
| `VALIDATION_ERROR` | Données de réservation invalides | Erreur de validation des champs |
| `PAYMENT_METHOD_REQUIRED` | Méthode de paiement requise | `payment_method` manquant pour tickets payants |
| `PAYMENT_CURRENCY_REQUIRED` | Devise de paiement requise | `payment_currency` manquant pour tickets payants |
| `PHONE_REQUIRED_MOBILE` | Téléphone requis pour mobile money | `telephone` manquant pour mobile money |
| `CARD_USD_ONLY` | Carte uniquement en USD | Tentative de paiement par carte en CDF |
| `INVALID_PAYMENT_METHOD` | Méthode de paiement invalide | Valeur non supportée |
| `INVALID_CURRENCY` | Devise de paiement invalide | Valeur non supportée |
| `INVALID_PHONE_FORMAT` | Format de téléphone invalide | Format 243XXXXXXXXX requis |

## 🚨 **Messages d'Erreur Courants**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Méthode de paiement requise` | Ticket payant sans méthode | Ajouter `payment_method` |
| `Devise de paiement requise` | Ticket payant sans devise | Ajouter `payment_currency` |
| `Numéro de téléphone requis` | Mobile money sans téléphone | Ajouter `telephone` |
| `Format de téléphone invalide` | Format incorrect | Utiliser `243XXXXXXXXX` |
| `Méthode de paiement invalide` | Valeur incorrecte | Utiliser `mobile_money` ou `card` |
| `Devise de paiement invalide` | Valeur incorrecte | Utiliser `USD` ou `CDF` |
| `Le paiement par carte est uniquement supporté en USD` | Carte avec devise CDF | Utiliser `USD` pour les cartes |

## 💡 **Bonnes Pratiques Front-End**

### **1. Validation Intelligente**
```javascript
// Vérifier si des tickets sont payants
const hasPaidTickets = tickets.some(ticket => ticket.price > 0);

if (hasPaidTickets) {
  // Afficher les champs payment_method et payment_currency
  showPaymentFields();
  
  // Afficher le téléphone seulement pour mobile money
  showPhoneField();
} else {
  // Masquer tous les champs de paiement
  hidePaymentFields();
  hidePhoneField();
}

// Gérer la restriction devise pour les cartes
const handlePaymentMethodChange = (method) => {
  if (method === 'card') {
    // Forcer USD pour les cartes
    setPaymentCurrency('USD');
    // Désactiver le sélecteur de devise
    disableCurrencySelector();
  } else {
    // Réactiver le sélecteur de devise pour mobile money
    enableCurrencySelector();
  }
};
```

### **2. Gestion des États**
```javascript
const [formData, setFormData] = useState({
  tickets: [],
  telephone: '',
  payment_method: '',
  payment_currency: ''
});

// Mettre à jour dynamiquement selon le type de ticket
useEffect(() => {
  const hasPaidTickets = formData.tickets.some(t => t.price > 0);
  if (!hasPaidTickets) {
    setFormData(prev => ({
      ...prev,
      payment_method: '',
      payment_currency: '',
      telephone: ''
    }));
  }
}, [formData.tickets]);

// Gérer l'affichage du téléphone selon la méthode de paiement
useEffect(() => {
  if (formData.payment_method === 'mobile_money') {
    showPhoneField();
  } else {
    hidePhoneField();
    setFormData(prev => ({ ...prev, telephone: '' }));
  }
}, [formData.payment_method]);
```

### **3. Messages d'Erreur Contextuels**
```javascript
const getErrorMessage = (error) => {
  if (error.includes('Méthode de paiement requise')) {
    return 'Veuillez sélectionner une méthode de paiement';
  }
  if (error.includes('Devise de paiement requise')) {
    return 'Veuillez sélectionner une devise de paiement';
  }
  if (error.includes('Numéro de téléphone requis')) {
    return 'Veuillez saisir votre numéro de téléphone pour le paiement mobile money';
  }
  if (error.includes('Format de téléphone invalide')) {
    return 'Format de téléphone incorrect. Utilisez le format: 243XXXXXXXXX';
  }
  return error;
};
```

## 🔗 **Endpoints Complémentaires**

### **Vérifier la Disponibilité**
```
GET /api/v1/tickets/simple/check-availability?ticket_id=1&quantity=2
```

### **Informations du Ticket**
```
GET /api/v1/tickets/simple/info/{ticketId}
```

### **Statut du Paiement**
```
GET /api/v1/tickets/check-flexpay-status/{businessReference}
```

## 💳 **Paiement par Carte FlexPay**

### **Méthodes Supportées**
- **Visa** : Cartes Visa internationales
- **MasterCard** : Cartes MasterCard internationales

### **⚠️ Restriction Importante**
- **Devise unique** : Le paiement par carte est **uniquement supporté en USD**
- **Mobile money** : Supporte USD et CDF

### **Processus de Paiement**
1. **Génération de l'URL** : FlexPay génère une URL sécurisée
2. **Redirection** : L'utilisateur est redirigé vers la page de paiement
3. **Paiement** : L'utilisateur saisit ses informations de carte
4. **Confirmation** : Le statut est confirmé automatiquement



## 📱 **Support Mobile Money**

### **Numéros de Test FlexPay**
- **Airtel Money** : `243826785727`
- **M-Pesa** : `243826785727`
- **Orange Money** : `243826785727`

### **Montants de Test**
- **CDF** : Minimum 100 CDF
- **USD** : Minimum 0.10 USD

## 🎨 **Interface Utilisateur Recommandée**

### **1. Sélection des Tickets**
- Liste des tickets disponibles
- Prix affiché en devise du ticket
- Sélecteur de quantité

### **2. Champs de Paiement (Conditionnels)**
- **Méthode** : Boutons radio `mobile_money` / `card`
- **Devise** : Boutons radio `USD` / `CDF`
- Affichage conditionnel selon le type de ticket

### **3. Validation en Temps Réel**
- Vérification des champs requis
- Messages d'erreur contextuels
- Bouton de soumission activé/désactivé

---

## 🧪 **Tests d'Intégration**

### **📱 Test Mobile Money**
```bash
# Test de réservation mobile money
curl -X POST /api/v1/tickets/simple/reserve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tickets": [{"ticket_id": 4, "quantity": 1}],
    "telephone": "243826785727",
    "payment_method": "mobile_money",
    "payment_currency": "USD"
  }'
```

### **💳 Test Paiement par Carte**
```bash
# Test de réservation par carte
curl -X POST /api/v1/tickets/simple/reserve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tickets": [{"ticket_id": 4, "quantity": 1}],
    "payment_method": "card",
    "payment_currency": "USD"
  }'
```

### **🎫 Test Réservation Gratuite**
```bash
# Test de réservation gratuite
curl -X POST /api/v1/tickets/simple/reserve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "tickets": [{"ticket_id": 2, "quantity": 1}]
  }'
```

## ℹ️ **Note Technique**

> **💡 Le back-end gère automatiquement tous les callbacks FlexPay.**
> 
> - Les notifications de paiement sont traitées en arrière-plan
> - Le statut des réservations est mis à jour automatiquement
> - Aucune action supplémentaire n'est requise côté front-end

## 🚀 **Prêt à Implémenter !**

Cette API simplifiée permet de gérer facilement les réservations avec une validation intelligente et une expérience utilisateur optimale.

**Questions ?** Consultez les logs du serveur pour plus de détails sur le traitement.
