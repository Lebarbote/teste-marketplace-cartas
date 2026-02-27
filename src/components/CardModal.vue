<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Card } from '@/types'

interface Props {
  card: Card
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      @click.self="emit('close')"
    >
      <div class="card max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up">
        <div class="flex items-center justify-between p-4 border-b border-dark-700">
          <h2 class="text-lg font-semibold text-white">{{ card.name }}</h2>
          <button 
            @click="emit('close')"
            class="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 overflow-y-auto">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0 mx-auto md:mx-0">
              <img 
                :src="card.imageUrl" 
                :alt="card.name"
                class="w-48 h-auto rounded-lg shadow-lg"
              />
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Descrição</h3>
                <p class="text-gray-200 text-sm whitespace-pre-line">
                  {{ card.description || 'Sem descrição disponível.' }}
                </p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-400 mb-1">Registrada em</h3>
                <p class="text-gray-200 text-sm">
                  {{ new Date(card.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-dark-700">
          <button 
            @click="emit('close')"
            class="btn btn-secondary w-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
