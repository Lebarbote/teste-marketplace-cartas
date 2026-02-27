<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const touched = reactive({
  email: false,
  password: false,
})

const showPassword = ref(false)

const validateEmail = () => {
  touched.email = true
  if (!form.email) {
    errors.email = 'Email é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  touched.password = true
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres'
  } else {
    errors.password = ''
  }
}

const isFormValid = () => {
  validateEmail()
  validatePassword()
  return !errors.email && !errors.password
}

const handleSubmit = async () => {
  if (!isFormValid()) return

  const success = await authStore.login(form.email, form.password)
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="card max-w-md w-full p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
        <p class="text-gray-400">Entre para continuar trocando cartas</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input 
            id="email"
            v-model="form.email"
            type="email"
            :class="['input', { 'input-error': errors.email && touched.email }]"
            placeholder="seu@email.com"
            @blur="validateEmail"
            @input="validateEmail"
          />
          <p v-if="errors.email && touched.email" class="mt-1 text-sm text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <div class="relative">
            <input 
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :class="['input pr-10', { 'input-error': errors.password && touched.password }]"
              placeholder="••••••••"
              @blur="validatePassword"
              @input="validatePassword"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password && touched.password" class="mt-1 text-sm text-red-400">
            {{ errors.password }}
          </p>
        </div>

        <button 
          type="submit"
          class="btn btn-primary w-full"
          :disabled="authStore.isLoading"
        >
          <svg 
            v-if="authStore.isLoading" 
            class="animate-spin h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ authStore.isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-gray-400">
        Não tem uma conta? 
        <RouterLink to="/register" class="link">Criar conta</RouterLink>
      </p>
    </div>
  </div>
</template>
