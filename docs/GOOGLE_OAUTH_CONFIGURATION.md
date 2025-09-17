# Configuration Google OAuth - Guide de résolution des erreurs

## 🚨 Erreur actuelle
- **Erreur 401 : invalid_client**
- **"no registered origin"**

## 🔧 Solution étape par étape

### 1. Configuration dans Google Cloud Console

1. **Accédez à [Google Cloud Console](https://console.cloud.google.com/)**
2. **Sélectionnez votre projet** (Client ID: `35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu`)
3. **Naviguez vers "APIs & Services" > "Credentials"**
4. **Cliquez sur votre OAuth 2.0 Client ID**

### 2. Configurer les origines autorisées

Dans la section **"Authorized JavaScript origins"**, ajoutez :

```
http://localhost:3000
http://127.0.0.1:3000
https://bisoticket.com
https://www.bisoticket.com
```

### 3. Configurer les URI de redirection

Dans la section **"Authorized redirect URIs"**, ajoutez :

```
http://localhost:3000/auth/google/callback
https://bisoticket.com/auth/google/callback
```

### 4. Vérifier les APIs activées

Assurez-vous que ces APIs sont activées :
- Google+ API (ou Google People API)
- Google Identity API

### 5. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Google OAuth
GOOGLE_CLIENT_ID=35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
```

### 6. Vérification de la configuration

Après modification, attendez 5-10 minutes pour la propagation des changements.

## 🧪 Test de la configuration

1. Redémarrez le serveur de développement
2. Ouvrez les outils de développement du navigateur
3. Vérifiez qu'il n'y a plus d'erreurs dans la console
4. Testez la connexion Google

## 📝 Notes importantes

- Les modifications dans Google Cloud Console peuvent prendre quelques minutes à se propager
- Assurez-vous que le Client ID correspond exactement à celui de la console
- Vérifiez que l'application OAuth est bien activée
- En cas d'erreur persistante, créez un nouveau Client ID

## 🔍 Debug

Pour déboguer, ajoutez ces logs dans le composant :

```javascript
console.log('Client ID:', config.public.googleClientId)
console.log('Current origin:', window.location.origin)
console.log('Google API loaded:', !!window.google)
```
