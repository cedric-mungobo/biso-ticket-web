# Configuration reCAPTCHA

## 📋 Étapes pour configurer reCAPTCHA

### 1. Obtenir les clés reCAPTCHA

1. Allez sur [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "+" pour créer un nouveau site
4. Remplissez le formulaire :
   - **Label** : `Biso Ticket Web`
   - **Type reCAPTCHA** : `reCAPTCHA v2` → `"Je ne suis pas un robot" Checkbox`
   - **Domaines** : 
     - `localhost` (pour le développement)
     - `bisoticket.com` (pour la production)
     - `www.bisoticket.com` (si applicable)
   - **Acceptez** les conditions d'utilisation
5. Cliquez sur "Soumettre"

### 2. Récupérer les clés

Après création, vous obtiendrez :
- **Clé du site** (Site Key) : `6LfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Clé secrète** (Secret Key) : `6LfXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 3. Configurer dans nuxt.config.ts

Remplacez les valeurs par défaut dans `nuxt.config.ts` :

```typescript
runtimeConfig: {
  // Variables privées (côté serveur uniquement)
  apiSecret: '',
  recaptchaSecretKey: 'VOTRE_CLE_SECRETE_ICI',
  
  // Variables publiques (côté client et serveur)
  public: {
    apiBaseUrl: 'https://api.bisoticket.com/api',
    recaptchaSiteKey: 'VOTRE_CLE_SITE_ICI'
  }
}
```

### 4. Configuration côté serveur (Backend)

#### Utilisation avec useRuntimeConfig() dans Nuxt

Le composable `useRecaptcha` est fourni pour valider les tokens côté serveur :

```typescript
// Dans un composable ou une page
import { useRecaptcha } from '~/composables/useRecaptcha'

export default defineEventHandler(async (event) => {
  const { validateRecaptcha } = useRecaptcha()
  
  const body = await readBody(event)
  const { recaptcha_token } = body
  
  // Valider le token reCAPTCHA
  const isValid = await validateRecaptcha(recaptcha_token)
  
  if (!isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token reCAPTCHA invalide'
    })
  }
  
  // Continuer avec l'inscription...
})
```

#### Exemple avec validation de score (reCAPTCHA v3)

```typescript
const { validateRecaptchaWithScore } = useRecaptcha()

const { valid, score } = await validateRecaptchaWithScore(
  recaptcha_token, 
  0.7, // Score minimum requis
  getClientIP(event) // IP de l'utilisateur
)

if (!valid) {
  throw createError({
    statusCode: 400,
    statusMessage: `Score reCAPTCHA insuffisant: ${score}`
  })
}
```

#### Exemple en PHP/Laravel (Backend externe)

```php
public function validateRecaptcha($token, $secretKey)
{
    $response = Http::post('https://www.google.com/recaptcha/api/siteverify', [
        'secret' => $secretKey,
        'response' => $token,
        'remoteip' => request()->ip()
    ]);
    
    $data = $response->json();
    return $data['success'] === true;
}
```

### 5. Test de fonctionnement

1. Démarrez votre application : `npm run dev`
2. Allez sur la page d'inscription
3. Vérifiez que le widget reCAPTCHA s'affiche
4. Testez l'inscription avec un formulaire valide

## 🔒 Sécurité

- **Ne jamais** exposer la clé secrète côté client
- **Toujours** valider le token côté serveur
- **Utiliser HTTPS** en production
- **Limiter** les domaines autorisés dans la console reCAPTCHA

## 🐛 Dépannage

### Le widget ne s'affiche pas
- Vérifiez que la clé site est correcte
- Vérifiez que le domaine est autorisé
- Consultez la console du navigateur pour les erreurs

### Erreur "Invalid site key"
- Vérifiez que la clé site correspond à celle de la console reCAPTCHA
- Vérifiez que le domaine correspond

### Erreur de validation côté serveur
- Vérifiez que la clé secrète est correcte
- Vérifiez que l'URL de vérification est accessible
- Vérifiez que le token est bien transmis

## 📱 Support mobile

Le composant reCAPTCHA s'adapte automatiquement aux écrans mobiles avec un redimensionnement approprié.
