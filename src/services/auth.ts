import { api } from './api'
import type { User, LoginResponse, RegisterResponse } from '@/types'

export const authService = {
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    return api.post<RegisterResponse>('/register', { name, email, password })
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', { email, password })
    api.setToken(response.token)
    return response
  },

  async getMe(): Promise<User> {
    return api.get<User>('/me')
  },

  logout() {
    api.setToken(null)
    localStorage.removeItem('user')
  },
}
