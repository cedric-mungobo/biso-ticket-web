<template>
  <div>
    <div>
      <div class=" py-16">
        <div class="max-w-5xl mx-auto px-4">
          <!-- En-tête du profil -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-neutral-900">Mon Profil</h1>
            <p class="text-neutral-600 mt-2">Gérez vos informations personnelles et vos événements</p>
            
          
          </div>
  
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Section gauche : Informations du profil -->
            <div class="w-full md:w-1/3">
              <div class="bg-white rounded-xl shadow-sm p-6">
                <!-- Avatar -->
                <div class="flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4">
                  <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <!-- Nom de l'utilisateur -->
                <h3 class="text-xl font-semibold text-neutral-900 text-center mb-2">
                  <span v-if="loading" class="inline-block w-32 h-6 bg-gray-200 rounded animate-pulse"></span>
                  <span v-else-if="userData?.name">{{ userData.name }}</span>
                </h3>
                
                <!-- Statut -->
                <div class="text-center">
                  <span v-if="loading" class="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse"></span>
                  <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Section droite : Détails du profil -->
            <div class="w-full md:w-2/3">
              <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold text-neutral-900 mb-6">Informations personnelles</h2>
                
                <!-- État de chargement -->
                <div v-if="loading" class="space-y-4">
                  <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div class="flex-1">
                      <div class="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div class="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Informations chargées -->
                <div v-else class="space-y-4">
                  <div v-if="userData?.name" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Nom complet:</span>
                      <span class="text-neutral-600 ml-2">{{ userData.name }}</span>
                    </div>
                  </div>
                  
                  <div v-if="userData?.email" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Email:</span>
                      <span class="text-neutral-600 ml-2">{{ userData.email }}</span>
                    </div>
                  </div>
                  
                  <div v-if="userData?.telephone || userData?.phone_number" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Téléphone:</span>
                      <span class="text-neutral-600 ml-2">{{ userData.telephone || userData.phone_number }}</span>
                    </div>
                  </div>
                  
                  <div v-if="userData?.role" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span class="font-medium text-neutral-700">Rôle:</span>
                      <span class="text-neutral-600 ml-2">{{ userData?.role }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Boutons de modification -->
                <div class="mt-6 space-y-3">
                  <button 
                    @click="showEditModal = true"
                    class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier le profil
                  </button>
                  
                  <button 
                    @click="showPasswordModal = true"
                    class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Modifier le mot de passe
                  </button>
                  
                  <button 
                    @click="handleLogout"
                    :disabled="isLoggingOut"
                    class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="!isLoggingOut" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ isLoggingOut ? 'Déconnexion...' : 'Se déconnecter' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition du profil -->
    <Modal
      v-model="showEditModal"
      title="Modifier le profil"
    >
      <div class="space-y-4">
        <!-- Nom -->
        <div>
          <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">
            Nom complet <span class="text-red-500">*</span>
          </label>
          <UInput
            id="edit-name"
            v-model="editForm.name"
            placeholder="Votre nom complet"
            :error="editErrors.name"
            class="w-full"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <UInput
            id="edit-email"
            v-model="editForm.email"
            type="email"
            placeholder="votre@email.com"
            :error="editErrors.email"
            class="w-full"
          />
        </div>

        <!-- Téléphone -->
        <div>
          <label for="edit-telephone" class="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <UInput
            id="edit-telephone"
            v-model="editForm.telephone"
            type="tel"
            placeholder="0826785727 ou +243826785727"
            :error="editErrors.telephone"
            class="w-full"
          />
          <p class="text-xs text-gray-500 mt-1">
            Format E.164 international: +243XXXXXXXXX (ex: +243826785727)
          </p>
        </div>

        <!-- Message d'erreur général -->
        <UAlert
          v-if="editErrors.general"
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          :title="editErrors.general"
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            @click="showEditModal = false"
          >
            Annuler
          </UButton>
          <UButton
            @click="handleUpdateProfile"
            :loading="isUpdating"
            color="primary"
          >
            Sauvegarder
          </UButton>
        </div>
      </template>
    </Modal>

    <!-- Modal de modification du mot de passe -->
    <Modal
      v-model="showPasswordModal"
      title="Modifier le mot de passe"
    >
      <div class="space-y-4">
        <!-- Mot de passe actuel -->
        <div>
          <label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe actuel <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <UInput
              id="current-password"
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Votre mot de passe actuel"
              :error="passwordErrors.currentPassword"
              class="w-full pr-10"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-if="showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Nouveau mot de passe -->
        <div>
          <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <UInput
              id="new-password"
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Votre nouveau mot de passe"
              :error="passwordErrors.newPassword"
              class="w-full pr-10"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-if="showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirmation du nouveau mot de passe -->
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le nouveau mot de passe <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <UInput
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirmez votre nouveau mot de passe"
              :error="passwordErrors.confirmPassword"
              class="w-full pr-10"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Message d'erreur général -->
        <UAlert
          v-if="passwordErrors.general"
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          :title="passwordErrors.general"
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            @click="showPasswordModal = false"
          >
            Annuler
          </UButton>
          <UButton
            @click="handleUpdatePassword"
            :loading="isUpdatingPassword"
            color="primary"
          >
            Modifier le mot de passe
          </UButton>
        </div>
      </template>
    </Modal>
    </div>

</template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useSEO } from '~/composables/useSEO'

  definePageMeta({
    middleware: 'authenticated'
  })

  // SEO pour la page profil (privée - noindex)
  const { setSEO } = useSEO()
  setSEO({
    title: 'Mon Profil - Biso Ticket',
    description: 'Gérez vos informations personnelles et vos événements sur Biso Ticket.',
    noindex: true,
    type: 'website'
  })
  
  // Composables
  const { getProfile, updateProfile, changePassword, logout } = useAuth()
  const toast = useToast()
  const router = useRouter()
  
  // Chargement du profil via useAsyncData (repository pattern)
  const { data: userData, pending: loading, error, refresh } = await useAsyncData('auth:profile', () => getProfile(), { server: false })
  
  // État des modals
  const showEditModal = ref(false)
  const showPasswordModal = ref(false)
  const isUpdating = ref(false)
  const isUpdatingPassword = ref(false)
  const isLoggingOut = ref(false)
  
  // Formulaire d'édition du profil
  const editForm = ref({
    name: '',
    email: '',
    telephone: ''
  })
  
  // Formulaire de modification du mot de passe
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // États pour afficher/masquer les mots de passe
  const showCurrentPassword = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)
  
  // Erreurs des formulaires
  const editErrors = ref<Record<string, string>>({})
  const passwordErrors = ref<Record<string, string>>({})
  
  // Initialiser le formulaire avec les données utilisateur
  watch(userData, (newUserData) => {
    if (newUserData) {
      editForm.value = {
        name: newUserData.name || '',
        email: newUserData.email || '',
        telephone: newUserData.telephone || newUserData.phone_number || ''
      }
    }
  }, { immediate: true })
  
  // Fonction pour formater le numéro de téléphone au format E.164 international
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return ''
    
    // Supprimer tous les espaces, tirets et caractères spéciaux
    let cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
    
    // Format E.164 international: +243XXXXXXXXX (+243 + 9 chiffres)
    // Si le numéro commence par 243, ajouter le + pour le format international
    if (cleaned.startsWith('243')) {
      if (cleaned.length === 12) {
        return '+' + cleaned
      }
    }
    
    // Si le numéro commence par 0, remplacer par +243 (format local vers international)
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+243' + cleaned.substring(1)
    }
    
    // Si le numéro a 9 chiffres, ajouter +243
    if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
      return '+243' + cleaned
    }
    
    // Si le numéro commence déjà par +, le garder tel quel
    if (phone.startsWith('+')) {
      return phone.replace(/[\s\-\(\)]/g, '')
    }
    
    return cleaned
  }

  // Gestion de la mise à jour du profil
  const handleUpdateProfile = async () => {
    try {
      isUpdating.value = true
      editErrors.value = {}
      
      // Validation côté client
      if (!editForm.value.name?.trim()) {
        editErrors.value.name = 'Le nom est requis'
        return
      }
      
      if (!editForm.value.email?.trim()) {
        editErrors.value.email = 'L\'email est requis'
        return
      }
      
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editForm.value.email)) {
        editErrors.value.email = 'Format d\'email invalide'
        return
      }
      
      // Formater le téléphone si fourni
      let formattedTelephone = undefined
      if (editForm.value.telephone?.trim()) {
        formattedTelephone = formatPhoneNumber(editForm.value.telephone.trim())
        
        // Validation du format E.164 international (+243XXXXXXXXX)
        const phoneRegex = /^\+243\d{9}$/
        if (!phoneRegex.test(formattedTelephone)) {
          editErrors.value.telephone = 'Format de téléphone invalide. Format requis: +243XXXXXXXXX (+243 + 9 chiffres)'
          return
        }
      }
      
      const updateData = {
        name: editForm.value.name.trim(),
        email: editForm.value.email.trim(),
        telephone: formattedTelephone
      }
      
      await updateProfile(updateData)
      
      useAppToast().showSuccess('Succès', 'Profil mis à jour avec succès')
      
      showEditModal.value = false
      await refresh() // Rafraîchir les données du profil
      
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      
      // Toast d'erreur
      useAppToast().showError('Erreur', error?.message || 'Une erreur est survenue lors de la mise à jour du profil')
      
      // Gestion des erreurs de validation
      if (error?.data?.errors) {
        editErrors.value = error.data.errors
      } else {
        editErrors.value.general = error?.message || 'Une erreur est survenue lors de la mise à jour'
      }
    } finally {
      isUpdating.value = false
    }
  }
  
  // Gestion de la mise à jour du mot de passe
  const handleUpdatePassword = async () => {
    try {
      isUpdatingPassword.value = true
      passwordErrors.value = {}
      
      // Validation côté client
      if (!passwordForm.value.currentPassword) {
        passwordErrors.value.currentPassword = 'Le mot de passe actuel est requis'
        return
      }
      
      if (!passwordForm.value.newPassword) {
        passwordErrors.value.newPassword = 'Le nouveau mot de passe est requis'
        return
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        passwordErrors.value.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = 'Les mots de passe ne correspondent pas'
        return
      }
      
      // Envoi à l'API selon la documentation : PUT /api/profile/password
      // L'API semble exiger le mot de passe actuel pour validation
      const passwordData = {
        current_password: passwordForm.value.currentPassword,
        password: passwordForm.value.newPassword,
        password_confirmation: passwordForm.value.confirmPassword
      }
      
      const response = await changePassword(passwordData)
      
      // Toast de succès
      useAppToast().showSuccess('Succès', 'Mot de passe modifié avec succès')
      
      // Réinitialiser le formulaire
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      
      // Fermer le modal
      showPasswordModal.value = false
      
    } catch (error: any) {
      console.error('Erreur lors de la modification du mot de passe:', error)
      
      // Toast d'erreur
      useAppToast().showError('Erreur', error?.message || 'Une erreur est survenue lors de la modification du mot de passe')
      
      // Gestion des erreurs de validation
      if (error?.data?.errors) {
        passwordErrors.value = error.data.errors
      } else {
        passwordErrors.value.general = error?.message || 'Une erreur est survenue lors de la modification du mot de passe'
      }
    } finally {
      isUpdatingPassword.value = false
    }
  }
  
  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      isLoggingOut.value = true
      
      await logout()
      
      useAppToast().showSuccess('Déconnexion réussie', 'Vous avez été déconnecté avec succès')
      
      // Rediriger vers la page d'accueil
      await router.push('/')
      
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error)
      
      useAppToast().showError('Erreur de déconnexion', error?.message || 'Une erreur est survenue lors de la déconnexion')
    } finally {
      isLoggingOut.value = false
    }
  }
</script>