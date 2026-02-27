<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Toast from '@/components/Toast.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div class="min-h-screen bg-dark-950">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>
