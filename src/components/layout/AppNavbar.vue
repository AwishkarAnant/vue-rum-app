<template>
  <header class="navbar">
    <div class="navbar-left">
      <button class="btn btn-ghost btn-icon" @click="store.toggleSidebar" title="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div class="breadcrumb">
        <span class="breadcrumb-home">Home</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ currentTitle }}</span>
      </div>
    </div>

    <div class="navbar-right">
      <!-- Search -->
      <div class="navbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          class="navbar-search-input"
          placeholder="Quick search..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Theme toggle -->
      <button class="btn btn-ghost btn-icon" @click="store.toggleTheme" :title="store.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        <span>{{ store.theme === 'dark' ? '☀️' : '🌙' }}</span>
      </button>

      <!-- Notifications -->
      <button class="btn btn-ghost btn-icon notification-btn" @click="toggleNotifications" title="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="notification-dot"></span>
      </button>

      <!-- Notification dropdown -->
      <div class="notification-dropdown" v-if="showNotifications" @click.stop>
        <div class="notification-header">
          <span class="font-600">Notifications</span>
          <button class="btn btn-ghost btn-sm" @click="markAllRead">Mark all read</button>
        </div>
        <div class="notification-list">
          <div class="notification-item" v-for="n in notifications" :key="n.id" :class="{ unread: n.unread }">
            <div class="notification-icon">{{ n.icon }}</div>
            <div class="notification-content">
              <div class="notification-text">{{ n.text }}</div>
              <div class="notification-time">{{ n.time }}</div>
            </div>
          </div>
        </div>
        <div class="notification-footer">
          <RouterLink to="/reports" @click="showNotifications=false" class="btn btn-ghost btn-sm w-full justify-center">View all activity</RouterLink>
        </div>
      </div>

      <!-- User Avatar -->
      <RouterLink to="/profile" class="navbar-avatar">
        <div class="avatar" style="background:var(--indigo-600);color:#fff;font-size:13px">AP</div>
        <div class="navbar-user-info">
          <span class="navbar-user-name">Aarav Patel</span>
          <span class="navbar-user-role">Senior Admin</span>
        </div>
      </RouterLink>
    </div>

    <!-- Overlay to close dropdown -->
    <div v-if="showNotifications" class="dropdown-overlay" @click="showNotifications=false"></div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const route = useRoute()
const searchQuery = ref('')
const showNotifications = ref(false)

const currentTitle = computed(() => route.meta?.title || 'Dashboard')

const notifications = ref([
  { id: 1, icon: '🛒', text: 'New order #ORD-10001 from Aarav Patel', time: '2 min ago', unread: true },
  { id: 2, icon: '📦', text: '"Standing Desk Electric" stock is low (8)', time: '30 min ago', unread: true },
  { id: 3, icon: '⭐', text: 'New 5-star review on Headphones', time: '1 hr ago', unread: true },
  { id: 4, icon: '💳', text: 'Refund processed for #ORD-10026', time: '3 hr ago', unread: false },
  { id: 5, icon: '👤', text: 'New user Sofia Chen registered', time: '5 hr ago', unread: false },
])

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAllRead() {
  notifications.value.forEach(n => n.unread = false)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    // Simulate search
    searchQuery.value = ''
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--navbar-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  transition: left 0.3s ease;
  gap: 16px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.breadcrumb-home { color: var(--text-tertiary); }
.breadcrumb-sep  { color: var(--text-tertiary); }
.breadcrumb-current { color: var(--text-primary); font-weight: 500; }

.navbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  position: relative;
}

.navbar-search {
  position: relative;
  display: flex;
  align-items: center;
}
.navbar-search .search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-tertiary);
  pointer-events: none;
}
.navbar-search-input {
  padding: 7px 12px 7px 32px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--text-primary);
  width: 200px;
  outline: none;
  transition: var(--transition);
}
.navbar-search-input:focus {
  border-color: var(--accent);
  width: 240px;
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}
.navbar-search-input::placeholder { color: var(--text-tertiary); }

.notification-btn { position: relative; }
.notification-dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 7px; height: 7px;
  background: var(--danger);
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 80px;
  width: 340px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--card-shadow-lg);
  z-index: 300;
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}

.notification-list { max-height: 300px; overflow-y: auto; }

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s;
}
.notification-item:last-child { border-bottom: none; }
.notification-item:hover { background: var(--bg-tertiary); }
.notification-item.unread { background: var(--accent-light); }

.notification-icon { font-size: 18px; flex-shrink: 0; }
.notification-text { font-size: 13px; color: var(--text-primary); margin-bottom: 3px; }
.notification-time { font-size: 11px; color: var(--text-tertiary); }

.notification-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--border-color);
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.navbar-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  margin-left: 4px;
}
.navbar-avatar:hover { background: var(--bg-tertiary); }

.navbar-user-info { display: flex; flex-direction: column; }
.navbar-user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.navbar-user-role { font-size: 11px; color: var(--text-tertiary); }

@media (max-width: 768px) {
  .navbar-search { display: none; }
  .navbar-user-info { display: none; }
}
</style>
