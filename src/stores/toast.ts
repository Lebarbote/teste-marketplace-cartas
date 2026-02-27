import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types'
import { generateId } from '@/utils'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  const addToast = (type: ToastMessage['type'], message: string, duration: number = 5000) => {
    const id = generateId()
    const toast: ToastMessage = { id, type, message }
    
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string) => addToast('success', message)
  const error = (message: string) => addToast('error', message, 8000)
  const info = (message: string) => addToast('info', message)
  const warning = (message: string) => addToast('warning', message)

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearAll,
  }
})
