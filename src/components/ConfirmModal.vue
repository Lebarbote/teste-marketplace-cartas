<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  isLoading: false,
  danger: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('cancel')
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
      @click.self="emit('cancel')"
    >
      <div class="card max-w-md w-full animate-slide-up">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-white mb-2">{{ title }}</h2>
          <p class="text-gray-400">{{ message }}</p>
        </div>

        <div class="flex gap-3 p-4 border-t border-dark-700">
          <button 
            @click="emit('cancel')"
            class="btn btn-secondary flex-1"
            :disabled="isLoading"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="emit('confirm')"
            :class="[
              'btn flex-1',
              danger ? 'btn-danger' : 'btn-primary'
            ]"
            :disabled="isLoading"
          >
            <svg 
              v-if="isLoading" 
              class="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isLoading ? 'Processando...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
