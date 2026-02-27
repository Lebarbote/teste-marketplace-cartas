<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: 'cards' | 'trades' | 'search' | 'error'
  actionText?: string
  actionTo?: string
}

defineProps<Props>()
const emit = defineEmits<{
  action: []
}>()

const icons = {
  cards: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  trades: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  error: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
      <svg 
        class="w-8 h-8 text-gray-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          :d="icons[icon || 'cards']" 
        />
      </svg>
    </div>
    
    <h3 class="text-lg font-medium text-white mb-1">{{ title }}</h3>
    <p v-if="description" class="text-gray-400 text-sm max-w-sm">{{ description }}</p>
    
    <RouterLink 
      v-if="actionText && actionTo"
      :to="actionTo"
      class="btn btn-primary mt-4"
    >
      {{ actionText }}
    </RouterLink>
    
    <button 
      v-else-if="actionText"
      @click="emit('action')"
      class="btn btn-primary mt-4"
    >
      {{ actionText }}
    </button>
  </div>
</template>
