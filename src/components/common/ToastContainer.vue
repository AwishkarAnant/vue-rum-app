<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-slide" tag="div" style="display:contents">
        <div
          v-for="toast in store.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <div style="flex:1;min-width:0">
            <div class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click="store.removeToast(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'
const store = useAppStore()
const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
</script>

<style scoped>
.toast-slide-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-slide-leave-active { transition: all 0.25s ease; }
.toast-slide-enter-from  { opacity:0; transform: translateX(30px); }
.toast-slide-leave-to    { opacity:0; transform: translateX(30px); }
</style>
