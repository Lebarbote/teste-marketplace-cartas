import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeDate, pluralize, generateId } from '@/utils'

describe('formatDate', () => {
  it('formata data corretamente', () => {
    const date = '2026-02-27T14:30:00.000Z'
    const formatted = formatDate(date)
    expect(formatted).toContain('27')
    expect(formatted).toContain('fev')
    expect(formatted).toContain('2026')
  })
})

describe('formatRelativeDate', () => {
  it('retorna "agora" para datas recentes', () => {
    const now = new Date().toISOString()
    expect(formatRelativeDate(now)).toBe('agora')
  })
})

describe('pluralize', () => {
  it('retorna singular para 1', () => {
    expect(pluralize(1, 'carta', 'cartas')).toBe('carta')
  })

  it('retorna plural para mais de 1', () => {
    expect(pluralize(5, 'carta', 'cartas')).toBe('cartas')
  })

  it('retorna plural para 0', () => {
    expect(pluralize(0, 'carta', 'cartas')).toBe('cartas')
  })
})

describe('generateId', () => {
  it('gera id unico', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('gera string nao vazia', () => {
    const id = generateId()
    expect(id.length).toBeGreaterThan(0)
  })
})
