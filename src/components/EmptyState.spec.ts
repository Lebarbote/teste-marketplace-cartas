import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  it('renderiza titulo e descricao', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nenhuma carta',
        description: 'Adicione cartas',
      },
    })
    expect(wrapper.text()).toContain('Nenhuma carta')
    expect(wrapper.text()).toContain('Adicione cartas')
  })

  it('mostra botao de acao quando passado', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Vazio',
        actionText: 'Adicionar',
      },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Adicionar')
  })

  it('emite evento ao clicar no botao', async () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Vazio',
        actionText: 'Clique',
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
  })

  it('nao mostra botao sem actionText', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Vazio',
      },
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
