<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/types'

interface Props {
  card: Card
  selectable?: boolean
  selected?: boolean
  showDescription?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
  showDescription: false,
  size: 'md',
})

const emit = defineEmits<{
  select: [card: Card]
  click: [card: Card]
}>()

const imageLoaded = ref(false)
const imageError = ref(false)

const sizeClasses = {
  sm: 'w-24 h-32',
  md: 'w-40 h-56',
  lg: 'w-56 h-80',
}

const handleClick = () => {
  if (props.selectable) {
    emit('select', props.card)
  } else {
    emit('click', props.card)
  }
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = true
}
</script>

<template>
  <div 
    :class="[
      'card card-hover cursor-pointer relative group',
      { 'ring-2 ring-primary-500': selected }
    ]"
    @click="handleClick"
  >
    <div 
      v-if="selectable"
      :class="[
        'absolute top-2 right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
        selected 
          ? 'bg-primary-500 border-primary-500' 
          : 'bg-dark-800/80 border-dark-500 group-hover:border-primary-400'
      ]"
    >
      <svg 
        v-if="selected" 
        class="w-4 h-4 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <div :class="['relative overflow-hidden', sizeClasses[size]]">
      <div 
        v-if="!imageLoaded" 
        class="absolute inset-0 bg-dark-800 animate-pulse"
      >
        <div class="absolute inset-0 shimmer" />
      </div>

      <div 
        v-if="imageError" 
        class="absolute inset-0 bg-dark-800 flex items-center justify-center"
      >
        <svg class="w-12 h-12 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <img 
        :src="card.imageUrl" 
        :alt="card.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        :class="{ 'opacity-0': !imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
        loading="lazy"
      />
    </div>

    <div class="p-3">
      <h3 class="text-sm font-medium text-white truncate" :title="card.name">
        {{ card.name }}
      </h3>
      
      <p 
        v-if="showDescription" 
        class="mt-1 text-xs text-gray-400 line-clamp-2"
        :title="card.description"
      >
        {{ card.description }}
      </p>
    </div>
  </div>
</template>
