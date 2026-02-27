<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'error':
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const getColors = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    case 'error':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    default:
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toastStore.toasts" 
          :key="toast.id"
          :class="[
            'flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-slide-up',
            getColors(toast.type)
          ]"
        >
          <svg 
            class="w-5 h-5 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="getIcon(toast.type)" 
            />
          </svg>
          
          <p class="flex-1 text-sm">{{ toast.message }}</p>
          
          <button 
            @click="toastStore.removeToast(toast.id)"
            class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
