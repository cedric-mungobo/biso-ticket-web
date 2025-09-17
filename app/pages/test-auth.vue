<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Test du flux d'authentification</h1>
        <p class="text-gray-600 mt-2">Vérification du pattern localStorage + redirection</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Test d'authentification -->
        <AuthTest />
        
        <!-- Instructions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Instructions de test</h2>
          <div class="space-y-4 text-sm">
            <div>
              <h3 class="font-semibold text-green-600">1. Test de déconnexion :</h3>
              <p>Cliquez sur "Test Déconnexion" pour vérifier que le localStorage est nettoyé.</p>
            </div>
            
            <div>
              <h3 class="font-semibold text-blue-600">2. Vérification localStorage :</h3>
              <p>Cliquez sur "Vérifier localStorage" pour voir le contenu actuel.</p>
            </div>
            
            <div>
              <h3 class="font-semibold text-purple-600">3. Simulation callback Google :</h3>
              <p>Cliquez sur "Simuler callback Google" puis rechargez la page pour voir l'effet.</p>
            </div>
            
            <div>
              <h3 class="font-semibold text-orange-600">4. Test URL callback :</h3>
              <p>Testez l'URL : <code class="bg-gray-100 px-2 py-1 rounded">/auth/google/callback?token=test_token&user={"id":1,"name":"Test"}</code></p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Code d'exemple -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Code d'exemple (pattern Next.js)</h2>
        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre><code>// pages/auth/success.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthSuccess = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, user } = router.query;
    
    if (token && user) {
      try {
        // Stocker le token et les données utilisateur
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', user);
        
        // Rediriger vers la page d'accueil
        router.push('/dashboard');
      } catch (error) {
        console.error('Erreur lors du traitement de l\'authentification:', error);
        router.push('/login?error=auth_failed');
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return &lt;div&gt;Authentification en cours...&lt;/div&gt;;
  }

  return &lt;div&gt;Erreur d'authentification&lt;/div&gt;;
};

export default AuthSuccess;</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Meta de la page
definePageMeta({
  layout: 'default'
})

// SEO
useHead({
  title: 'Test d\'authentification - Biso Ticket',
  meta: [
    { name: 'description', content: 'Page de test pour vérifier le flux d\'authentification' }
  ]
})
</script>
