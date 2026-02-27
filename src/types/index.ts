export interface User {
  id: string
  name: string
  email: string
  cards?: Card[]
}

export interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

export interface TradeCard {
  id: string
  cardId: string
  tradeId: string
  type: 'OFFERING' | 'RECEIVING'
  card: Card
}

export interface Trade {
  id: string
  userId: string
  createdAt: string
  user: {
    name: string
  }
  tradeCards: TradeCard[]
}

export interface PaginatedResponse<T> {
  list: T[]
  rpp: number
  page: number
  more: boolean
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterResponse {
  userId: string
}

export interface CreateTradeResponse {
  tradeId: string
}

export interface CreateTradeCard {
  cardId: string
  type: 'OFFERING' | 'RECEIVING'
}

export interface ApiError {
  message: string
  statusCode?: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}
