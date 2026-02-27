import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'
import { useToastStore } from './toast'
import type { User, ApiError } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
        refreshUserData()
      } catch {
        logout()
      }
    }
  }

  const refreshUserData = async () => {
    try {
      const userData = await authService.getMe()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.statusCode === 401) {
        logout()
      }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      await authService.register(name, email, password)
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      return true
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao criar conta')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      const response = await authService.login(email, password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
      toast.success(`Bem-vindo, ${response.user.name}!`)
      return true
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Email ou senha incorretos')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    initializeAuth,
    refreshUserData,
    register,
    login,
    logout,
  }
})
