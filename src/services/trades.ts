import { api } from './api'
import type { Trade, PaginatedResponse, CreateTradeCard, CreateTradeResponse } from '@/types'

export const tradesService = {
  async getAllTrades(page: number = 1, rpp: number = 10): Promise<PaginatedResponse<Trade>> {
    return api.get<PaginatedResponse<Trade>>('/trades', {
      params: { page, rpp },
    })
  },

  async createTrade(cards: CreateTradeCard[]): Promise<CreateTradeResponse> {
    return api.post<CreateTradeResponse>('/trades', { cards })
  },

  async deleteTrade(tradeId: string): Promise<void> {
    return api.delete(`/trades/${tradeId}`)
  },
}
