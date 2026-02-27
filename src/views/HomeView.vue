<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTradesStore } from '@/stores/trades'
import { useAuthStore } from '@/stores/auth'
import TradeItem from '@/components/TradeItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'

const tradesStore = useTradesStore()
const authStore = useAuthStore()
const isInitialLoading = ref(true)

onMounted(async () => {
  try {
    await tradesStore.fetchTrades(1, false)
  } finally {
    isInitialLoading.value = false
  }
})

const handleLoadMore = async () => {
  await tradesStore.loadMoreTrades()
}
</script>

<template>
  <div class="space-y-8">
    <div class="text-center py-8">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
        <span class="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          Card Marketplace
        </span>
      </h1>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">
        Encontre as melhores trocas de cartas. Veja o que outros jogadores estão oferecendo e encontre a carta que você procura!
      </p>
      
      <div v-if="!authStore.isAuthenticated" class="mt-6 flex flex-wrap justify-center gap-4">
        <RouterLink to="/register" class="btn btn-primary">
          Criar Conta Grátis
        </RouterLink>
        <RouterLink to="/login" class="btn btn-secondary">
          Já tenho conta
        </RouterLink>
      </div>
      <div v-else class="mt-6">
        <RouterLink to="/create-trade" class="btn btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Criar Nova Troca
        </RouterLink>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold text-primary-400">{{ tradesStore.tradeCount }}+</div>
        <div class="text-sm text-gray-400">Trocas Ativas</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold text-secondary-400">🎴</div>
        <div class="text-sm text-gray-400">Cartas Disponíveis</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold text-green-400">🔒</div>
        <div class="text-sm text-gray-400">Trocas Seguras</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl font-bold text-yellow-400">⚡</div>
        <div class="text-sm text-gray-400">Rápido e Fácil</div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white">Solicitações de Troca</h2>
        <span class="badge badge-primary">
          {{ tradesStore.tradeCount }} ativas
        </span>
      </div>

      <div v-if="isInitialLoading" class="py-12">
        <LoadingSpinner size="lg" text="Carregando trocas..." />
      </div>

      <EmptyState 
        v-else-if="tradesStore.trades.length === 0"
        icon="trades"
        title="Nenhuma troca encontrada"
        description="Seja o primeiro a criar uma solicitação de troca!"
        :action-text="authStore.isAuthenticated ? 'Criar Troca' : 'Criar Conta'"
        :action-to="authStore.isAuthenticated ? '/create-trade' : '/register'"
      />

      <div v-else class="space-y-4">
        <TradeItem 
          v-for="trade in tradesStore.trades" 
          :key="trade.id" 
          :trade="trade"
        />

        <div v-if="tradesStore.hasMore" class="text-center pt-4">
          <button 
            @click="handleLoadMore"
            class="btn btn-secondary"
            :disabled="tradesStore.isLoading"
          >
            <svg 
              v-if="tradesStore.isLoading" 
              class="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ tradesStore.isLoading ? 'Carregando...' : 'Carregar mais' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
