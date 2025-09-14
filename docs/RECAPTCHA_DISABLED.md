# reCAPTCHA Temporairement Désactivé

## Statut
Le reCAPTCHA a été temporairement désactivé sur la page d'inscription pour résoudre les problèmes de validation.

## Modifications apportées

### 1. Page d'inscription (`app/pages/inscription.vue`)

#### Composant reCAPTCHA commenté
```vue
<!-- reCAPTCHA - TEMPORAIREMENT DÉSACTIVÉ -->
<!-- 
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Vérification de sécurité
  </label>
  <Recaptcha 
    :site-key="recaptchaSiteKey"
    theme="light"
    size="normal"
    @verify="onCaptchaVerify"
    @expired="onCaptchaExpired"
    @error="onCaptchaError"
  />
</div>
-->
```

#### Validation du formulaire simplifiée
```typescript
// reCAPTCHA temporairement désactivé - validation simplifiée
const isFormValid = computed(() => !!(form.name && form.telephone && form.email && form.password))
```

#### Vérification reCAPTCHA commentée
```typescript
// reCAPTCHA temporairement désactivé
// if (!recaptchaToken.value) {
//   return toast.add({ 
//     title: 'Vérification requise', 
//     description: 'Veuillez compléter la vérification de sécurité.', 
//     color: 'error' 
//   })
// }
```

#### Envoi des données sans token reCAPTCHA
```typescript
await register({
  name: form.name.trim(),
  email: form.email.trim(),
  telephone: form.telephone.trim(),
  password: form.password
  // recaptcha_token: recaptchaToken.value // Temporairement désactivé
})
```

## Pour réactiver le reCAPTCHA

### Étape 1 : Décommenter le composant reCAPTCHA
Dans le template, remplacez :
```vue
<!-- reCAPTCHA - TEMPORAIREMENT DÉSACTIVÉ -->
<!-- 
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Vérification de sécurité
  </label>
  <Recaptcha 
    :site-key="recaptchaSiteKey"
    theme="light"
    size="normal"
    @verify="onCaptchaVerify"
    @expired="onCaptchaExpired"
    @error="onCaptchaError"
  />
</div>
-->
```

Par :
```vue
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Vérification de sécurité
  </label>
  <Recaptcha 
    :site-key="recaptchaSiteKey"
    theme="light"
    size="normal"
    @verify="onCaptchaVerify"
    @expired="onCaptchaExpired"
    @error="onCaptchaError"
  />
</div>
```

### Étape 2 : Restaurer la validation complète
Remplacez :
```typescript
// reCAPTCHA temporairement désactivé - validation simplifiée
const isFormValid = computed(() => !!(form.name && form.telephone && form.email && form.password))
```

Par :
```typescript
const isFormValid = computed(() => !!(form.name && form.telephone && form.email && form.password && recaptchaToken.value))
```

### Étape 3 : Décommenter la vérification reCAPTCHA
Remplacez :
```typescript
// reCAPTCHA temporairement désactivé
// if (!recaptchaToken.value) {
//   return toast.add({ 
//     title: 'Vérification requise', 
//     description: 'Veuillez compléter la vérification de sécurité.', 
//     color: 'error' 
//   })
// }
```

Par :
```typescript
if (!recaptchaToken.value) {
  return toast.add({ 
    title: 'Vérification requise', 
    description: 'Veuillez compléter la vérification de sécurité.', 
    color: 'error' 
  })
}
```

### Étape 4 : Ajouter le token reCAPTCHA dans l'envoi
Remplacez :
```typescript
await register({
  name: form.name.trim(),
  email: form.email.trim(),
  telephone: form.telephone.trim(),
  password: form.password
  // recaptcha_token: recaptchaToken.value // Temporairement désactivé
})
```

Par :
```typescript
await register({
  name: form.name.trim(),
  email: form.email.trim(),
  telephone: form.telephone.trim(),
  password: form.password,
  recaptcha_token: recaptchaToken.value
})
```

### Étape 5 : Restaurer la réinitialisation du token
Remplacez :
```typescript
// reCAPTCHA temporairement désactivé - pas de réinitialisation nécessaire
// recaptchaToken.value = ''
```

Par :
```typescript
// Réinitialiser le reCAPTCHA en cas d'erreur
recaptchaToken.value = ''
```

## Configuration reCAPTCHA

Les clés reCAPTCHA restent configurées dans `nuxt.config.ts` :
- `recaptchaSiteKey` (public) : `6LfnSMkrAAAAAEuOzQY-COgBmEk-oUtxaiSTgTm4`
- `recaptchaSecretKey` (privé) : `6LfnSMkrAAAAAGlONNhD7Ec3pBPoTGuwbHo2SXgb`

## Sécurité

⚠️ **Important** : Sans reCAPTCHA, l'application est plus vulnérable aux attaques de spam et aux inscriptions automatisées. Il est recommandé de :

1. Réactiver le reCAPTCHA dès que possible
2. Surveiller les inscriptions suspectes
3. Implémenter d'autres mesures de protection (rate limiting, validation côté serveur, etc.)

## Date de désactivation
${new Date().toLocaleDateString('fr-FR')} - Désactivé temporairement pour résoudre les problèmes de validation
