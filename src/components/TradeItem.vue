<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Trade } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useTradesStore } from '@/stores/trades'
import { formatDate } from '@/utils'
import CardMini from './CardMini.vue'
import ConfirmModal from './ConfirmModal.vue'

interface Props {
  trade: Trade
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const tradesStore = useTradesStore()

const showDeleteModal = ref(false)
const isDeleting = ref(false)

const isOwner = computed(() => {
  return authStore.user?.id === props.trade.userId
})

const offeringCards = computed(() => {
  return props.trade.tradeCards.filter(tc => tc.type === 'OFFERING').map(tc => tc.card)
})

const receivingCards = computed(() => {
  return props.trade.tradeCards.filter(tc => tc.type === 'RECEIVING').map(tc => tc.card)
})

const formattedDate = computed(() => formatDate(props.trade.createdAt))

const handleDelete = async () => {
  isDeleting.value = true
  await tradesStore.deleteTrade(props.trade.id)
  isDeleting.value = false
  showDeleteModal.value = false
}
</script>

<template>
  <div class="card p-5 space-y-4">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
          {{ trade.user.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3 class="font-medium text-white">{{ trade.user.name }}</h3>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <span v-if="isOwner" class="badge badge-primary">Sua troca</span>
        <button 
          v-if="isOwner"
          @click="showDeleteModal = true"
          class="btn btn-ghost text-red-400 hover:text-red-300 p-2"
          title="Excluir troca"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-medium text-green-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          Oferecendo ({{ offeringCards.length }})
        </div>
        <div class="flex flex-wrap gap-2 p-3 bg-dark-800/50 rounded-lg min-h-[80px]">
          <CardMini 
            v-for="card in offeringCards" 
            :key="card.id" 
            :card="card"
          />
          <p v-if="offeringCards.length === 0" class="text-gray-500 text-sm">
            Nenhuma carta oferecida
          </p>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-medium text-blue-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
          </svg>
          Querendo receber ({{ receivingCards.length }})
        </div>
        <div class="flex flex-wrap gap-2 p-3 bg-dark-800/50 rounded-lg min-h-[80px]">
          <CardMini 
            v-for="card in receivingCards" 
            :key="card.id" 
            :card="card"
          />
          <p v-if="receivingCards.length === 0" class="text-gray-500 text-sm">
            Nenhuma carta solicitada
          </p>
        </div>
      </div>
    </div>

    <ConfirmModal 
      v-if="showDeleteModal"
      title="Excluir Troca"
      message="Tem certeza que deseja excluir esta solicitação de troca? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      :is-loading="isDeleting"
      danger
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
