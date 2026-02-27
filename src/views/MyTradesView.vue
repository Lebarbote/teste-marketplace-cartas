<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTradesStore } from '@/stores/trades'
import { useAuthStore } from '@/stores/auth'
import TradeItem from '@/components/TradeItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'

const tradesStore = useTradesStore()
const authStore = useAuthStore()
const isInitialLoading = ref(true)

const myTrades = computed(() => {
  if (!authStore.user) return []
  return tradesStore.trades.filter(trade => trade.userId === authStore.user?.id)
})

onMounted(async () => {
  try {
    await tradesStore.fetchTrades(1, false)
  } finally {
    isInitialLoading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Minhas Trocas</h1>
        <p class="text-gray-400 mt-1">Gerencie suas solicitações de troca</p>
      </div>
      <RouterLink to="/create-trade" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nova Troca
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 gap-4 max-w-md">
      <div class="card p-4">
        <div class="text-2xl font-bold text-primary-400">{{ myTrades.length }}</div>
        <div class="text-sm text-gray-400">Trocas Criadas</div>
      </div>
      <div class="card p-4">
        <div class="text-2xl font-bold text-green-400">{{ tradesStore.tradeCount }}</div>
        <div class="text-sm text-gray-400">Total no Marketplace</div>
      </div>
    </div>

    <div v-if="isInitialLoading" class="py-12">
      <LoadingSpinner size="lg" text="Carregando suas trocas..." />
    </div>

    <EmptyState 
      v-else-if="myTrades.length === 0"
      icon="trades"
      title="Nenhuma troca encontrada"
      description="Crie sua primeira solicitação de troca para começar a negociar com outros jogadores."
      action-text="Criar Troca"
      action-to="/create-trade"
    />

    <div v-else class="space-y-4">
      <TradeItem 
        v-for="trade in myTrades" 
        :key="trade.id" 
        :trade="trade"
      />
    </div>
  </div>
</template>
