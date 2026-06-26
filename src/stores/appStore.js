import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Theme
  const theme = ref(localStorage.getItem('rum-theme') || 'light')

  function setTheme(t) {
    theme.value = t
    localStorage.setItem('rum-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // Toast notifications
  const toasts = ref([])
  let toastId = 0

  function addToast({ type = 'info', title, message, duration = 4000 }) {
    const id = ++toastId
    toasts.value.push({ id, type, title, message })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  function removeToast(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  // Sidebar
  const sidebarOpen = ref(true)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  // Settings
  const settings = ref(JSON.parse(localStorage.getItem('rum-settings') || JSON.stringify({
    language: 'en',
    notifications: {
      email: true,
      push: false,
      sms: false,
      marketing: true,
      updates: true
    }
  })))

  function saveSettings(newSettings) {
    settings.value = newSettings
    localStorage.setItem('rum-settings', JSON.stringify(newSettings))
  }

  // Initialize theme on load
  document.documentElement.setAttribute('data-theme', theme.value)

  return {
    theme, setTheme, toggleTheme,
    toasts, addToast, removeToast,
    sidebarOpen, toggleSidebar,
    settings, saveSettings
  }
})
