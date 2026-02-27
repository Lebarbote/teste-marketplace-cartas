import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renderiza sem texto por padrao', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('renderiza com texto quando passado', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { text: 'Carregando...' },
    })
    expect(wrapper.text()).toContain('Carregando...')
  })

  it('aplica tamanho correto', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: 'lg' },
    })
    expect(wrapper.find('svg').classes()).toContain('w-12')
  })
})
