<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your application preferences</p>
      </div>
      <button class="btn btn-primary" @click="saveAll" :disabled="saving">
        <span v-if="saving" class="spinner" style="width:14px;height:14px"></span>
        {{ saving ? 'Saving...' : 'Save all changes' }}
      </button>
    </div>

    <div style="display:flex;flex-direction:column;gap:20px">
      <!-- Appearance -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🎨 Appearance</div>
            <div class="card-subtitle">Customize how the app looks and feels</div>
          </div>
        </div>
        <div class="card-body">
          <div class="settings-section">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Theme</div>
                <div class="settings-desc">Choose between light and dark mode</div>
              </div>
              <div class="theme-switcher">
                <button
                  class="theme-option"
                  :class="{ active: store.theme === 'light' }"
                  @click="store.setTheme('light')"
                >
                  <span class="theme-icon">☀️</span>
                  <span>Light</span>
                </button>
                <button
                  class="theme-option"
                  :class="{ active: store.theme === 'dark' }"
                  @click="store.setTheme('dark')"
                >
                  <span class="theme-icon">🌙</span>
                  <span>Dark</span>
                </button>
                <button
                  class="theme-option"
                  :class="{ active: store.theme === 'system' }"
                  @click="store.setTheme('system')"
                >
                  <span class="theme-icon">💻</span>
                  <span>System</span>
                </button>
              </div>
            </div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Accent Color</div>
                <div class="settings-desc">Primary brand color used across the UI</div>
              </div>
              <div class="color-swatches">
                <button
                  v-for="color in accentColors"
                  :key="color.name"
                  class="color-swatch"
                  :style="{ background: color.value }"
                  :class="{ active: selectedAccent === color.name }"
                  @click="selectedAccent = color.name"
                  :title="color.name"
                ></button>
              </div>
            </div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Compact Mode</div>
                <div class="settings-desc">Reduce spacing for denser information display</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="localSettings.compactMode" />
                <div class="toggle-track"></div>
                <div class="toggle-thumb"></div>
              </label>
            </div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Animations</div>
                <div class="settings-desc">Enable smooth transitions and animations</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="localSettings.animations" />
                <div class="toggle-track"></div>
                <div class="toggle-thumb"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔔 Notifications</div>
            <div class="card-subtitle">Control how and when you receive alerts</div>
          </div>
        </div>
        <div class="card-body">
          <div class="settings-section">
            <div class="settings-row" v-for="(label, key) in notifLabels" :key="key">
              <div class="settings-info">
                <div class="settings-label">{{ label.title }}</div>
                <div class="settings-desc">{{ label.desc }}</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="localSettings.notifications[key]" />
                <div class="toggle-track"></div>
                <div class="toggle-thumb"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Language & Region -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🌍 Language &amp; Region</div>
            <div class="card-subtitle">Set your language, timezone, and date format preferences</div>
          </div>
        </div>
        <div class="card-body">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Language</label>
              <select class="form-control" v-model="localSettings.language">
                <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Timezone</label>
              <select class="form-control" v-model="localSettings.timezone">
                <option v-for="tz in timezones" :key="tz">{{ tz }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date Format</label>
              <select class="form-control" v-model="localSettings.dateFormat">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Currency</label>
              <select class="form-control" v-model="localSettings.currency">
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🔒 Security</div>
        </div>
        <div class="card-body">
          <div class="settings-section">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Two-Factor Authentication</div>
                <div class="settings-desc">Add an extra layer of security to your account</div>
              </div>
              <button class="btn btn-secondary btn-sm" @click="toast.info('2FA Setup', 'Two-factor authentication setup will be available soon.')">Configure</button>
            </div>
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Active Sessions</div>
                <div class="settings-desc">3 active sessions across your devices</div>
              </div>
              <button class="btn btn-danger btn-sm" @click="toast.warning('Sessions revoked', 'All other sessions have been signed out.')">Sign out all</button>
            </div>
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Change Password</div>
                <div class="settings-desc">Last changed 45 days ago</div>
              </div>
              <button class="btn btn-secondary btn-sm" @click="toast.info('Password change', 'Check your email for a reset link.')">Change</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Data & Privacy -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗂 Data &amp; Privacy</div>
        </div>
        <div class="card-body">
          <div class="settings-section">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Analytics &amp; Telemetry</div>
                <div class="settings-desc">Help improve the app by sharing usage data</div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="localSettings.analytics" />
                <div class="toggle-track"></div>
                <div class="toggle-thumb"></div>
              </label>
            </div>
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label">Export My Data</div>
                <div class="settings-desc">Download a copy of all your data in JSON format</div>
              </div>
              <button class="btn btn-secondary btn-sm" @click="exportData">📥 Export</button>
            </div>
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label danger-text">Delete Account</div>
                <div class="settings-desc">Permanently remove your account and all data</div>
              </div>
              <button class="btn btn-danger btn-sm" @click="toast.error('Action blocked', 'Account deletion is disabled in the test environment.')">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useToast } from '@/composables/useToast'
import { languages } from '@/mock/user'

const store = useAppStore()
const { toast } = useToast()
const saving = ref(false)
const selectedAccent = ref('Indigo')

const localSettings = ref({
  ...JSON.parse(JSON.stringify(store.settings)),
  compactMode: false,
  animations: true,
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  currency: 'INR',
  analytics: true,
})

const accentColors = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose',   value: '#f43f5e' },
  { name: 'Emerald',value: '#10b981' },
  { name: 'Sky',    value: '#0ea5e9' },
  { name: 'Amber',  value: '#f59e0b' },
]

const notifLabels = {
  email: { title: 'Email Notifications', desc: 'Receive order and activity summaries via email' },
  push:  { title: 'Push Notifications', desc: 'Browser and desktop push alerts' },
  sms:   { title: 'SMS Alerts', desc: 'Critical alerts via SMS to your phone' },
  marketing: { title: 'Marketing Emails', desc: 'Product updates, tips, and promotions' },
  updates:   { title: 'System Updates', desc: 'Maintenance windows and feature announcements' },
}

const timezones = [
  'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'
]

async function saveAll() {
  saving.value = true
  await new Promise(r => setTimeout(r, 900))
  store.saveSettings({
    language: localSettings.value.language,
    notifications: localSettings.value.notifications,
  })
  saving.value = false
  toast.success('Settings saved', 'All preferences have been updated successfully.')
}

async function exportData() {
  toast.info('Preparing export...', 'Your data is being packaged.')
  await new Promise(r => setTimeout(r, 1400))
  toast.success('Data exported', 'user-data-export.json has been downloaded.')
}
</script>

<style scoped>
.settings-section { display: flex; flex-direction: column; gap: 0; }

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}
.settings-row:last-child { border-bottom: none; padding-bottom: 0; }
.settings-row:first-child { padding-top: 0; }

.settings-info { flex: 1; min-width: 0; }
.settings-label { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; }
.settings-desc  { font-size: 12px; color: var(--text-tertiary); }
.danger-text { color: var(--danger) !important; }

.theme-switcher { display: flex; gap: 8px; }
.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
  font-family: var(--font-sans);
}
.theme-option:hover { border-color: var(--accent); color: var(--accent); }
.theme-option.active { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }
.theme-icon { font-size: 18px; }

.color-swatches { display: flex; gap: 8px; }
.color-swatch {
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: var(--transition);
  outline: none;
}
.color-swatch:hover  { transform: scale(1.15); }
.color-swatch.active { border-color: white; box-shadow: 0 0 0 2px var(--text-secondary); }
</style>
