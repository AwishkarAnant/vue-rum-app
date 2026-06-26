<template>
  <aside class="sidebar" :class="{ collapsed: !store.sidebarOpen }">
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
          <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
          <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
          <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      <div class="brand-text" v-show="store.sidebarOpen">
        <span class="brand-name">RUM Admin</span>
        <span class="brand-version">v1.0.0</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section-label" v-show="store.sidebarOpen">Main Menu</div>

      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
        :title="!store.sidebarOpen ? item.label : undefined"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label" v-show="store.sidebarOpen">{{ item.label }}</span>
        <span v-if="item.badge && store.sidebarOpen" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>

      <div class="nav-divider"></div>
      <div class="nav-section-label" v-show="store.sidebarOpen">Account</div>

      <RouterLink to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
        <span class="nav-icon">👤</span>
        <span class="nav-label" v-show="store.sidebarOpen">Profile</span>
      </RouterLink>
      <RouterLink to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
        <span class="nav-icon">⚙️</span>
        <span class="nav-label" v-show="store.sidebarOpen">Settings</span>
      </RouterLink>
    </nav>

    <!-- Sidebar footer -->
    <div class="sidebar-footer" v-show="store.sidebarOpen">
      <div class="sidebar-user">
        <div class="avatar avatar-sm" style="background:var(--indigo-600);color:#fff;flex-shrink:0">AP</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">Aarav Patel</div>
          <div class="sidebar-user-role">Senior Admin</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'
import { RouterLink, useRoute } from 'vue-router'

const store = useAppStore()
const $route = useRoute()

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { name: 'Products',  path: '/products',  icon: '📦', label: 'Products', badge: '24' },
  { name: 'Orders',    path: '/orders',    icon: '🛒', label: 'Orders',   badge: '5' },
  { name: 'Reports',   path: '/reports',   icon: '📈', label: 'Reports' },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}

.sidebar.collapsed { width: 64px; }

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.brand-icon {
  width: 36px; height: 36px;
  background: var(--accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.brand-name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}
.brand-version {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.3);
  padding: 4px 8px 8px;
  white-space: nowrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: var(--radius-md);
  color: var(--text-sidebar);
  text-decoration: none;
  margin-bottom: 2px;
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-sidebar-hover);
  color: #fff;
  text-decoration: none;
}

.nav-item.active {
  background: var(--bg-sidebar-active);
  color: #fff;
  font-weight: 500;
}

.nav-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
.nav-label { font-size: 13px; font-weight: 500; flex: 1; }

.nav-badge {
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  font-size: 10px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: var(--radius-full);
}

.nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 12px 6px;
}

.sidebar-footer {
  padding: 14px 14px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.sidebar-user-role {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .sidebar { transform: translateX(-100%); }
}
</style>
