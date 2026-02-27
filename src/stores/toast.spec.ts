import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '@/stores/toast'

describe('Toast Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adiciona toast de sucesso', () => {
    const store = useToastStore()
    store.success('Operacao realizada')
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[0].message).toBe('Operacao realizada')
  })

  it('adiciona toast de erro', () => {
    const store = useToastStore()
    store.error('Algo deu errado')
    expect(store.toasts[0].type).toBe('error')
  })

  it('remove toast por id', () => {
    const store = useToastStore()
    const id = store.success('Teste')
    expect(store.toasts).toHaveLength(1)
    store.removeToast(id)
    expect(store.toasts).toHaveLength(0)
  })

  it('limpa todos os toasts', () => {
    const store = useToastStore()
    store.success('Um')
    store.error('Dois')
    store.info('Tres')
    expect(store.toasts).toHaveLength(3)
    store.clearAll()
    expect(store.toasts).toHaveLength(0)
  })
})
