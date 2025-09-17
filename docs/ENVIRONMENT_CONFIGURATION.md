# Configuration de l'environnement

## Variables d'environnement requises

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Google OAuth
GOOGLE_CLIENT_ID=35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Configuration API
API_BASE_URL=https://api.bisoticket.com/api

# Configuration reCAPTCHA
RECAPTCHA_SITE_KEY=6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4
RECAPTCHA_SECRET_KEY=6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb

# Configuration du site
SITE_URL=https://bisoticket.com
```

## Configuration Google Cloud Console

### 1. Origines autorisées (Authorized JavaScript origins)
```
http://localhost:3000
http://127.0.0.1:3000
https://bisoticket.com
https://www.bisoticket.com
```

### 2. URI de redirection (Authorized redirect URIs)
```
http://localhost:3000/auth/google/callback
https://bisoticket.com/auth/google/callback
```

## Vérification

1. Redémarrez le serveur après modification du `.env`
2. Vérifiez que les variables sont bien chargées dans `nuxt.config.ts`
3. Testez la connexion Google
