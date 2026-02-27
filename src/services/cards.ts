import { api } from './api'
import type { Card, PaginatedResponse } from '@/types'

export const cardsService = {
  async getAllCards(page: number = 1, rpp: number = 20): Promise<PaginatedResponse<Card>> {
    return api.get<PaginatedResponse<Card>>('/cards', {
      params: { page, rpp },
    })
  },

  async getCardById(id: string): Promise<Card> {
    return api.get<Card>(`/cards/${id}`)
  },

  async getMyCards(): Promise<Card[]> {
    return api.get<Card[]>('/me/cards')
  },

  async addCardsToUser(cardIds: string[]): Promise<void> {
    return api.post('/me/cards', { cardIds })
  },
}
