<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-content">
      <AppNavbar />
      <main class="page-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <Suspense>
              <component :is="Component" />
              <template #fallback>
                <div class="loading-overlay" style="height:60vh">
                  <div class="spinner spinner-lg"></div>
                  <span>Loading page...</span>
                </div>
              </template>
            </Suspense>
          </Transition>
        </RouterView>
      </main>
      <footer class="app-footer">
        <div class="footer-content">
          <span>© 2025 Vue RUM Test Application. Built for RUM validation &amp; performance testing.</span>
          <div class="footer-links">
            <span>v1.0.0</span>
            <span>•</span>
            <span>{{ pageLoadTime }}ms load</span>
            <span>•</span>
            <span :class="store.theme === 'dark' ? 'text-accent' : 'text-muted'">{{ store.theme }} mode</span>
          </div>
        </div>
      </footer>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const pageLoadTime = ref(0)

onMounted(() => {
  pageLoadTime.value = Math.round(performance.now())
})
</script>

<style scoped>
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 14px 32px;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  flex-wrap: wrap;
}
.footer-links {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
