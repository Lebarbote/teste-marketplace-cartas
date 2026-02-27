<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.name || '')

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false
  router.push('/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <RouterLink 
          to="/" 
          class="flex items-center gap-3 text-white font-bold text-xl hover:text-primary-400 transition-colors"
          @click="closeMobileMenu"
        >
          <svg class="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6" />
                <stop offset="100%" style="stop-color:#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="10" y="5" width="50" height="70" rx="5" fill="url(#logoGrad)" transform="rotate(-10, 50, 50)"/>
            <rect x="25" y="15" width="50" height="70" rx="5" fill="url(#logoGrad)" transform="rotate(5, 50, 50)"/>
            <rect x="40" y="25" width="50" height="70" rx="5" fill="url(#logoGrad)" transform="rotate(15, 50, 50)"/>
          </svg>
          <span class="hidden sm:inline">Card Marketplace</span>
        </RouterLink>

        <div class="hidden md:flex items-center gap-6">
          <RouterLink 
            to="/" 
            class="text-gray-300 hover:text-white transition-colors"
            active-class="text-primary-400"
          >
            Marketplace
          </RouterLink>
          
          <template v-if="isAuthenticated">
            <RouterLink 
              to="/my-cards" 
              class="text-gray-300 hover:text-white transition-colors"
              active-class="text-primary-400"
            >
              Minhas Cartas
            </RouterLink>
            <RouterLink 
              to="/my-trades" 
              class="text-gray-300 hover:text-white transition-colors"
              active-class="text-primary-400"
            >
              Minhas Trocas
            </RouterLink>
            <RouterLink 
              to="/create-trade" 
              class="btn btn-primary"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nova Troca
            </RouterLink>
            
            <div class="flex items-center gap-3 ml-4 pl-4 border-l border-dark-600">
              <span class="text-gray-400">{{ userName }}</span>
              <button 
                @click="handleLogout" 
                class="text-gray-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>
          
          <template v-else>
            <RouterLink 
              to="/login" 
              class="text-gray-300 hover:text-white transition-colors"
            >
              Entrar
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="btn btn-primary"
            >
              Criar Conta
            </RouterLink>
          </template>
        </div>

        <button 
          @click="toggleMobileMenu" 
          class="md:hidden text-gray-300 hover:text-white p-2"
        >
          <svg 
            v-if="!isMobileMenuOpen" 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg 
            v-else 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden py-4 space-y-3 border-t border-dark-700"
      >
        <RouterLink 
          to="/" 
          class="block py-2 text-gray-300 hover:text-white transition-colors"
          @click="closeMobileMenu"
        >
          Marketplace
        </RouterLink>
        
        <template v-if="isAuthenticated">
          <RouterLink 
            to="/my-cards" 
            class="block py-2 text-gray-300 hover:text-white transition-colors"
            @click="closeMobileMenu"
          >
            Minhas Cartas
          </RouterLink>
          <RouterLink 
            to="/my-trades" 
            class="block py-2 text-gray-300 hover:text-white transition-colors"
            @click="closeMobileMenu"
          >
            Minhas Trocas
          </RouterLink>
          <RouterLink 
            to="/create-trade" 
            class="block py-2 text-primary-400 hover:text-primary-300 transition-colors"
            @click="closeMobileMenu"
          >
            + Nova Troca
          </RouterLink>
          
          <div class="pt-3 mt-3 border-t border-dark-700 flex items-center justify-between">
            <span class="text-gray-400">{{ userName }}</span>
            <button 
              @click="handleLogout" 
              class="text-red-400 hover:text-red-300 transition-colors"
            >
              Sair
            </button>
          </div>
        </template>
        
        <template v-else>
          <RouterLink 
            to="/login" 
            class="block py-2 text-gray-300 hover:text-white transition-colors"
            @click="closeMobileMenu"
          >
            Entrar
          </RouterLink>
          <RouterLink 
            to="/register" 
            class="block py-2 text-primary-400 hover:text-primary-300 transition-colors"
            @click="closeMobileMenu"
          >
            Criar Conta
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
