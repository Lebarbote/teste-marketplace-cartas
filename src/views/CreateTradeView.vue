<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCardsStore } from '@/stores/cards'
import { useTradesStore } from '@/stores/trades'
import { useToastStore } from '@/stores/toast'
import type { Card, CreateTradeCard } from '@/types'
import CardItem from '@/components/CardItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import SearchInput from '@/components/SearchInput.vue'

const router = useRouter()
const cardsStore = useCardsStore()
const tradesStore = useTradesStore()
const toast = useToastStore()

const isInitialLoading = ref(true)
const step = ref<'offering' | 'receiving'>('offering')
const offeringCards = ref<Set<string>>(new Set())
const receivingCards = ref<Set<string>>(new Set())
const myCardsSearch = ref('')
const allCardsSearch = ref('')

const filteredMyCards = computed(() => {
  if (!myCardsSearch.value) return cardsStore.myCards
  const query = myCardsSearch.value.toLowerCase()
  return cardsStore.myCards.filter(
    card =>
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
})

const filteredAllCards = computed(() => {
  if (!allCardsSearch.value) return cardsStore.allCards
  const query = allCardsSearch.value.toLowerCase()
  return cardsStore.allCards.filter(
    card =>
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
})

const selectedOfferingCards = computed(() => {
  return cardsStore.myCards.filter(card => offeringCards.value.has(card.id))
})

const selectedReceivingCards = computed(() => {
  return cardsStore.allCards.filter(card => receivingCards.value.has(card.id))
})

const canProceed = computed(() => {
  if (step.value === 'offering') {
    return offeringCards.value.size > 0
  }
  return receivingCards.value.size > 0
})

const canSubmit = computed(() => {
  return offeringCards.value.size > 0 && receivingCards.value.size > 0
})

onMounted(async () => {
  try {
    await Promise.all([
      cardsStore.fetchMyCards(),
      cardsStore.fetchAllCards(1, false)
    ])
  } finally {
    isInitialLoading.value = false
  }
})

const toggleOfferingCard = (card: Card) => {
  if (offeringCards.value.has(card.id)) {
    offeringCards.value.delete(card.id)
  } else {
    offeringCards.value.add(card.id)
  }
}

const toggleReceivingCard = (card: Card) => {
  if (receivingCards.value.has(card.id)) {
    receivingCards.value.delete(card.id)
  } else {
    if (offeringCards.value.has(card.id)) {
      toast.error('Esta carta já está na lista de ofertas')
      return
    }
    receivingCards.value.add(card.id)
  }
}

const goToNextStep = () => {
  if (step.value === 'offering' && offeringCards.value.size > 0) {
    step.value = 'receiving'
  }
}

const goToPreviousStep = () => {
  if (step.value === 'receiving') {
    step.value = 'offering'
  }
}

const removeOfferingCard = (cardId: string) => {
  offeringCards.value.delete(cardId)
}

const removeReceivingCard = (cardId: string) => {
  receivingCards.value.delete(cardId)
}

const handleSubmit = async () => {
  if (!canSubmit.value) {
    toast.error('Selecione pelo menos uma carta para oferecer e uma para receber')
    return
  }

  const duplicates = Array.from(offeringCards.value).filter(id => receivingCards.value.has(id))
  if (duplicates.length > 0) {
    toast.error('Uma carta não pode estar em ambas as listas')
    return
  }

  const cards: CreateTradeCard[] = [
    ...Array.from(offeringCards.value).map(cardId => ({
      cardId,
      type: 'OFFERING' as const
    })),
    ...Array.from(receivingCards.value).map(cardId => ({
      cardId,
      type: 'RECEIVING' as const
    }))
  ]

  const tradeId = await tradesStore.createTrade(cards)
  if (tradeId) {
    router.push('/')
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <button 
        @click="router.back()"
        class="btn btn-ghost p-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-white">Criar Troca</h1>
        <p class="text-gray-400 mt-1">Selecione as cartas que deseja trocar</p>
      </div>
    </div>

    <div v-if="isInitialLoading" class="py-12">
      <LoadingSpinner size="lg" text="Carregando cartas..." />
    </div>

    <EmptyState 
      v-else-if="cardsStore.myCards.length === 0"
      icon="cards"
      title="Você não tem cartas"
      description="Adicione cartas à sua coleção antes de criar uma troca."
      action-text="Adicionar Cartas"
      action-to="/my-cards"
    />

    <template v-else>
      <div class="flex items-center justify-center gap-4">
        <div 
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            step === 'offering' 
              ? 'bg-primary-500/20 text-primary-400' 
              : offeringCards.size > 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-dark-800 text-gray-400'
          ]"
        >
          <div class="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-bold">
            {{ offeringCards.size > 0 ? '✓' : '1' }}
          </div>
          <span class="font-medium">Oferecendo</span>
          <span class="text-sm opacity-70">({{ offeringCards.size }})</span>
        </div>

        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>

        <div 
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            step === 'receiving' 
              ? 'bg-primary-500/20 text-primary-400' 
              : receivingCards.size > 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-dark-800 text-gray-400'
          ]"
        >
          <div class="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-bold">
            {{ receivingCards.size > 0 ? '✓' : '2' }}
          </div>
          <span class="font-medium">Recebendo</span>
          <span class="text-sm opacity-70">({{ receivingCards.size }})</span>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-green-400 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Oferecendo
            </h3>
            <span class="badge badge-success">{{ selectedOfferingCards.length }}</span>
          </div>
          <div v-if="selectedOfferingCards.length === 0" class="text-gray-500 text-sm">
            Nenhuma carta selecionada
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <div 
              v-for="card in selectedOfferingCards" 
              :key="card.id"
              class="relative group"
            >
              <img 
                :src="card.imageUrl" 
                :alt="card.name"
                class="w-12 h-16 rounded object-cover border border-dark-600"
                :title="card.name"
              />
              <button 
                @click="removeOfferingCard(card.id)"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-blue-400 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
              Querendo Receber
            </h3>
            <span class="badge badge-primary">{{ selectedReceivingCards.length }}</span>
          </div>
          <div v-if="selectedReceivingCards.length === 0" class="text-gray-500 text-sm">
            Nenhuma carta selecionada
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <div 
              v-for="card in selectedReceivingCards" 
              :key="card.id"
              class="relative group"
            >
              <img 
                :src="card.imageUrl" 
                :alt="card.name"
                class="w-12 h-16 rounded object-cover border border-dark-600"
                :title="card.name"
              />
              <button 
                @click="removeReceivingCard(card.id)"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div v-if="step === 'offering'" class="p-4 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">
              Selecione as cartas que deseja oferecer
            </h2>
          </div>

          <SearchInput 
            v-model="myCardsSearch" 
            placeholder="Buscar nas suas cartas..."
          />

          <div v-if="filteredMyCards.length === 0" class="py-8 text-center text-gray-400">
            Nenhuma carta encontrada.
          </div>

          <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            <CardItem 
              v-for="card in filteredMyCards" 
              :key="card.id" 
              :card="card"
              size="sm"
              selectable
              :selected="offeringCards.has(card.id)"
              @select="toggleOfferingCard"
            />
          </div>
        </div>

        <div v-else class="p-4 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">
              Selecione as cartas que deseja receber
            </h2>
          </div>

          <SearchInput 
            v-model="allCardsSearch" 
            placeholder="Buscar cartas no marketplace..."
          />

          <div v-if="filteredAllCards.length === 0" class="py-8 text-center text-gray-400">
            Nenhuma carta encontrada.
          </div>

          <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            <CardItem 
              v-for="card in filteredAllCards" 
              :key="card.id" 
              :card="card"
              size="sm"
              selectable
              :selected="receivingCards.has(card.id)"
              @select="toggleReceivingCard"
            />
          </div>

          <div v-if="cardsStore.hasMore" class="text-center pt-4">
            <button 
              @click="cardsStore.loadMoreCards()"
              class="btn btn-secondary"
              :disabled="cardsStore.isLoading"
            >
              {{ cardsStore.isLoading ? 'Carregando...' : 'Carregar mais cartas' }}
            </button>
          </div>
        </div>

        <div class="flex gap-3 p-4 border-t border-dark-700">
          <button 
            v-if="step === 'receiving'"
            @click="goToPreviousStep"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <div class="flex-1" />

          <button 
            v-if="step === 'offering'"
            @click="goToNextStep"
            class="btn btn-primary"
            :disabled="!canProceed"
          >
            Próximo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            v-else
            @click="handleSubmit"
            class="btn btn-primary"
            :disabled="!canSubmit || tradesStore.isLoading"
          >
            <svg 
              v-if="tradesStore.isLoading" 
              class="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ tradesStore.isLoading ? 'Criando...' : 'Criar Troca' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
