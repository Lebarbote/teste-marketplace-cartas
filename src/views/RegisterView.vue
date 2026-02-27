<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const validateName = () => {
  touched.name = true
  if (!form.name) {
    errors.name = 'Nome é obrigatório'
  } else if (form.name.length < 2) {
    errors.name = 'Nome deve ter no mínimo 2 caracteres'
  } else {
    errors.name = ''
  }
}

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
  
  if (touched.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  touched.confirmPassword = true
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Senhas não coincidem'
  } else {
    errors.confirmPassword = ''
  }
}

const isFormValid = () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {
  if (!isFormValid()) return

  const success = await authStore.register(form.name, form.email, form.password)
  if (success) {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center py-8">
    <div class="card max-w-md w-full p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white mb-2">Criar Conta</h1>
        <p class="text-gray-400">Junte-se à comunidade de colecionadores</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Nome
          </label>
          <input 
            id="name"
            v-model="form.name"
            type="text"
            :class="['input', { 'input-error': errors.name && touched.name }]"
            placeholder="Seu nome"
            @blur="validateName"
            @input="validateName"
          />
          <p v-if="errors.name && touched.name" class="mt-1 text-sm text-red-400">
            {{ errors.name }}
          </p>
        </div>

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

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Senha
          </label>
          <div class="relative">
            <input 
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :class="['input pr-10', { 'input-error': errors.confirmPassword && touched.confirmPassword }]"
              placeholder="••••••••"
              @blur="validateConfirmPassword"
              @input="validateConfirmPassword"
            />
            <button 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword && touched.confirmPassword" class="mt-1 text-sm text-red-400">
            {{ errors.confirmPassword }}
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
          {{ authStore.isLoading ? 'Criando conta...' : 'Criar Conta' }}
        </button>
      </form>

      <p class="mt-6 text-center text-gray-400">
        Já tem uma conta? 
        <RouterLink to="/login" class="link">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>
