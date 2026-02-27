export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://cards-marketplace-api.onrender.com',
    timeout: 30000,
  },
  pagination: {
    defaultPageSize: 20,
  },
  storage: {
    tokenKey: 'token',
    userKey: 'user',
  },
} as const

export type Config = typeof config
