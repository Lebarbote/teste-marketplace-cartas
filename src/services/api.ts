import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'
import { config } from '@/config'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Ocorreu um erro inesperado',
          statusCode: error.response?.status,
        }

        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }

        return Promise.reject(apiError)
      }
    )
  }

  async get<T>(url: string, configOpts?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, configOpts)
    return response.data
  }

  async post<T>(url: string, data?: unknown, configOpts?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, configOpts)
    return response.data
  }

  async delete<T>(url: string, configOpts?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, configOpts)
    return response.data
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }
}

export const api = new ApiService()
