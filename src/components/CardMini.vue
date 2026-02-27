<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/types'
import CardModal from './CardModal.vue'

interface Props {
  card: Card
}

defineProps<Props>()

const showModal = ref(false)
</script>

<template>
  <div 
    class="relative group cursor-pointer"
    @click="showModal = true"
  >
    <div class="w-12 h-16 rounded overflow-hidden border border-dark-600 hover:border-primary-500 transition-colors">
      <img 
        :src="card.imageUrl" 
        :alt="card.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      {{ card.name }}
    </div>

    <CardModal 
      v-if="showModal"
      :card="card"
      @close="showModal = false"
    />
  </div>
</template>
