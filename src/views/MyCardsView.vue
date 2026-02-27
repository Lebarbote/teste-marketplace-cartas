<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCardsStore } from '@/stores/cards'
import type { Card } from '@/types'
import CardItem from '@/components/CardItem.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import SearchInput from '@/components/SearchInput.vue'
import CardModal from '@/components/CardModal.vue'

const cardsStore = useCardsStore()
const isInitialLoading = ref(true)
const showAddCardsModal = ref(false)
const selectedCards = ref<Set<string>>(new Set())
const searchQuery = ref('')
const allCardsSearchQuery = ref('')
const selectedCardDetail = ref<Card | null>(null)

const filteredMyCards = computed(() => {
  if (!searchQuery.value) return cardsStore.myCards
  const query = searchQuery.value.toLowerCase()
  return cardsStore.myCards.filter(
    card => 
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
})

const filteredAllCards = computed(() => {
  if (!allCardsSearchQuery.value) return cardsStore.allCards
  const query = allCardsSearchQuery.value.toLowerCase()
  return cardsStore.allCards.filter(
    card => 
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  try {
    await cardsStore.fetchMyCards()
  } finally {
    isInitialLoading.value = false
  }
})

const openAddCardsModal = async () => {
  showAddCardsModal.value = true
  selectedCards.value.clear()
  if (cardsStore.allCards.length === 0) {
    await cardsStore.fetchAllCards(1, false)
  }
}

const toggleCardSelection = (card: Card) => {
  if (selectedCards.value.has(card.id)) {
    selectedCards.value.delete(card.id)
  } else {
    selectedCards.value.add(card.id)
  }
}

const handleAddCards = async () => {
  if (selectedCards.value.size === 0) return
  
  const success = await cardsStore.addCardsToCollection(Array.from(selectedCards.value))
  if (success) {
    showAddCardsModal.value = false
    selectedCards.value.clear()
  }
}

const closeModal = () => {
  showAddCardsModal.value = false
  selectedCards.value.clear()
  allCardsSearchQuery.value = ''
}

const showCardDetail = (card: Card) => {
  selectedCardDetail.value = card
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Minhas Cartas</h1>
        <p class="text-gray-400 mt-1">Gerencie sua coleção de cartas</p>
      </div>
      <button @click="openAddCardsModal" class="btn btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Adicionar Cartas
      </button>
    </div>

    <div class="max-w-md">
      <SearchInput 
        v-model="searchQuery" 
        placeholder="Buscar na minha coleção..."
      />
    </div>

    <div v-if="isInitialLoading" class="py-12">
      <LoadingSpinner size="lg" text="Carregando suas cartas..." />
    </div>

    <EmptyState 
      v-else-if="cardsStore.myCards.length === 0"
      icon="cards"
      title="Nenhuma carta encontrada"
      description="Adicione cartas à sua coleção para começar a trocar com outros jogadores."
      action-text="Adicionar Cartas"
      @action="openAddCardsModal"
    />

    <EmptyState 
      v-else-if="filteredMyCards.length === 0"
      icon="search"
      title="Nenhum resultado"
      description="Tente buscar por outro termo."
    />

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <CardItem 
        v-for="card in filteredMyCards" 
        :key="card.id" 
        :card="card"
        size="md"
        show-description
        @click="showCardDetail"
      />
    </div>

    <CardModal 
      v-if="selectedCardDetail"
      :card="selectedCardDetail"
      @close="selectedCardDetail = null"
    />

    <Teleport to="body">
      <div 
        v-if="showAddCardsModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        @click.self="closeModal"
      >
        <div class="card max-w-4xl w-full max-h-[90vh] flex flex-col animate-slide-up">
          <div class="flex items-center justify-between p-4 border-b border-dark-700">
            <div>
              <h2 class="text-lg font-semibold text-white">Adicionar Cartas</h2>
              <p class="text-sm text-gray-400">
                {{ selectedCards.size }} carta(s) selecionada(s)
              </p>
            </div>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 border-b border-dark-700">
            <SearchInput 
              v-model="allCardsSearchQuery" 
              placeholder="Buscar cartas disponíveis..."
            />
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="cardsStore.isLoading && cardsStore.allCards.length === 0" class="py-12">
              <LoadingSpinner size="lg" text="Carregando cartas..." />
            </div>

            <div v-else-if="filteredAllCards.length === 0" class="py-12 text-center text-gray-400">
              Nenhuma carta encontrada.
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <CardItem 
                v-for="card in filteredAllCards" 
                :key="card.id" 
                :card="card"
                size="sm"
                selectable
                :selected="selectedCards.has(card.id)"
                @select="toggleCardSelection"
              />
            </div>

            <div v-if="cardsStore.hasMore" class="text-center pt-4">
              <button 
                @click="cardsStore.loadMoreCards()"
                class="btn btn-secondary"
                :disabled="cardsStore.isLoading"
              >
                {{ cardsStore.isLoading ? 'Carregando...' : 'Carregar mais' }}
              </button>
            </div>
          </div>

          <div class="flex gap-3 p-4 border-t border-dark-700">
            <button 
              @click="closeModal"
              class="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              @click="handleAddCards"
              class="btn btn-primary flex-1"
              :disabled="selectedCards.size === 0 || cardsStore.isLoading"
            >
              <svg 
                v-if="cardsStore.isLoading" 
                class="animate-spin h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adicionar {{ selectedCards.size }} carta(s)
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
