import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cardsService } from '@/services'
import { useToastStore } from './toast'
import { useAuthStore } from './auth'
import type { Card, ApiError } from '@/types'

export const useCardsStore = defineStore('cards', () => {
  const allCards = ref<Card[]>([])
  const myCards = ref<Card[]>([])
  const isLoading = ref(false)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const cardsCache = ref<Map<string, Card>>(new Map())

  const cardCount = computed(() => allCards.value.length)
  const myCardCount = computed(() => myCards.value.length)

  const fetchAllCards = async (page: number = 1, append: boolean = false) => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      const response = await cardsService.getAllCards(page, 20)

      if (append) {
        allCards.value = [...allCards.value, ...response.list]
      } else {
        allCards.value = response.list
      }

      response.list.forEach(card => cardsCache.value.set(card.id, card))

      currentPage.value = response.page
      hasMore.value = response.more
      return response
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao carregar cartas')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreCards = async () => {
    if (!hasMore.value || isLoading.value) return
    await fetchAllCards(currentPage.value + 1, true)
  }

  const fetchMyCards = async () => {
    const toast = useToastStore()
    isLoading.value = true

    try {
      const cards = await cardsService.getMyCards()
      myCards.value = cards
      cards.forEach(card => cardsCache.value.set(card.id, card))
      return cards
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao carregar suas cartas')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addCardsToCollection = async (cardIds: string[]) => {
    const toast = useToastStore()
    const authStore = useAuthStore()
    isLoading.value = true

    try {
      await cardsService.addCardsToUser(cardIds)
      toast.success(`${cardIds.length} carta(s) adicionada(s) à sua coleção!`)
      await Promise.all([fetchMyCards(), authStore.refreshUserData()])
      
      return true
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.message || 'Erro ao adicionar cartas')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getCardById = (id: string): Card | undefined => {
    return cardsCache.value.get(id)
  }

  const fetchCardById = async (id: string): Promise<Card | null> => {
    const cached = cardsCache.value.get(id)
    if (cached) return cached

    try {
      const card = await cardsService.getCardById(id)
      cardsCache.value.set(id, card)
      return card
    } catch {
      return null
    }
  }

  const searchCards = (query: string): Card[] => {
    const searchLower = query.toLowerCase()
    return allCards.value.filter(
      card =>
        card.name.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower)
    )
  }

  const clearCache = () => {
    allCards.value = []
    myCards.value = []
    cardsCache.value.clear()
    currentPage.value = 1
    hasMore.value = true
  }

  return {
    allCards,
    myCards,
    isLoading,
    currentPage,
    hasMore,
    cardCount,
    myCardCount,
    fetchAllCards,
    loadMoreCards,
    fetchMyCards,
    addCardsToCollection,
    getCardById,
    fetchCardById,
    searchCards,
    clearCache,
  }
})
