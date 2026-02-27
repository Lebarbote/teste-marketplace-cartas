import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tradesService } from '@/services'
import { useToastStore } from './toast'
import { useAuthStore } from './auth'
import type { Trade, CreateTradeCard, ApiError } from '@/types'

export const useTradesStore = defineStore('trades', () => {
  const trades = ref<Trade[]>([])
  const isLoading = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)

  const tradeCount = computed(() => trades.value.length)

  const myTrades = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    return trades.value.filter(trade => trade.userId === authStore.user?.id)
  })

  const fetchTrades = async (page: number = 1, append: boolean = false) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      const response = await tradesService.getAllTrades(page, 10)

      if (append) {
        trades.value = [...trades.value, ...response.list]
      } else {
        trades.value = response.list
      }

      currentPage.value = response.page
      hasMore.value = response.more
      return response
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao carregar solicitações de troca')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreTrades = async () => {
    if (!hasMore.value || isLoading.value) return
    await fetchTrades(currentPage.value + 1, true)
  }

  const createTrade = async (cards: CreateTradeCard[]) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      const response = await tradesService.createTrade(cards)
      toast.success('Solicitação de troca criada com sucesso!')
      await fetchTrades(1, false)
      
      return response.tradeId
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao criar solicitação de troca')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTrade = async (tradeId: string) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      await tradesService.deleteTrade(tradeId)
      toast.success('Solicitação de troca removida!')
      trades.value = trades.value.filter(t => t.id !== tradeId)
      
      return true
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao remover solicitação de troca')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getTradeById = (id: string): Trade | undefined => {
    return trades.value.find(t => t.id === id)
  }

  const clearTrades = () => {
    trades.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  return {
    trades,
    isLoading,
    currentPage,
    hasMore,
    tradeCount,
    myTrades,
    fetchTrades,
    loadMoreTrades,
    createTrade,
    deleteTrade,
    getTradeById,
    clearTrades,
  }
})
