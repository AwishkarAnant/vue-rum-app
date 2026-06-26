<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">User Profile</h1>
        <p class="page-subtitle">Manage your personal information and account settings</p>
      </div>
    </div>

    <div class="grid-2" style="align-items:start">
      <!-- Left: Profile Card -->
      <div>
        <div class="card profile-card">
          <div class="profile-hero">
            <div class="profile-avatar-wrap">
              <div class="avatar avatar-xl profile-avatar">{{ initials }}</div>
              <button class="avatar-edit-btn" @click="handleAvatarClick" title="Change photo">📷</button>
            </div>
            <h2 class="profile-name">{{ form.firstName }} {{ form.lastName }}</h2>
            <p class="profile-role">{{ user.role }} · {{ user.department }}</p>
            <span class="badge badge-success" style="margin-top:8px">Active</span>
          </div>

          <div class="profile-stats">
            <div class="stat-item" v-for="(val, key) in user.stats" :key="key">
              <div class="stat-value">{{ val.toLocaleString() }}</div>
              <div class="stat-label">{{ statLabels[key] }}</div>
            </div>
          </div>

          <div class="card-body" style="border-top:1px solid var(--border-color)">
            <div class="info-list">
              <div class="info-item">
                <span class="info-icon">📧</span>
                <span class="info-text">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">📱</span>
                <span class="info-text">{{ user.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">📍</span>
                <span class="info-text">{{ user.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">🕐</span>
                <span class="info-text">{{ user.timezone }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">🗓</span>
                <span class="info-text">Joined {{ formatDate(user.joinDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <div class="card" style="margin-top:20px">
          <div class="card-header">
            <div class="card-title">Upload Documents</div>
          </div>
          <div class="card-body">
            <div
              class="upload-zone"
              :class="{ 'drag-over': isDragOver }"
              @dragover.prevent="isDragOver=true"
              @dragleave="isDragOver=false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <div class="upload-zone-icon">📂</div>
              <p><span class="upload-cta">Click to upload</span> or drag and drop</p>
              <p style="font-size:12px;color:var(--text-tertiary);margin-top:4px">PDF, PNG, JPG up to 10MB</p>
              <input ref="fileInput" type="file" style="display:none" multiple @change="handleFileSelect" />
            </div>

            <div v-if="uploadedFiles.length > 0" style="margin-top:12px">
              <div v-for="file in uploadedFiles" :key="file.name" class="uploaded-file">
                <span>📄 {{ file.name }}</span>
                <span style="font-size:11px;color:var(--text-tertiary)">{{ formatSize(file.size) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Edit Form -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Edit Profile</div>
            <div class="card-subtitle">Update your personal information</div>
          </div>
          <span v-if="isDirty" class="badge badge-warning">Unsaved changes</span>
        </div>
        <div class="card-body">
          <div class="grid-2" style="gap:16px;margin-bottom:0">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input class="form-control" v-model="form.firstName" @input="isDirty=true" placeholder="First name" />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input class="form-control" v-model="form.lastName" @input="isDirty=true" placeholder="Last name" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-control" v-model="form.email" @input="isDirty=true" placeholder="email@example.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-control" v-model="form.phone" @input="isDirty=true" placeholder="+1 (555) 000-0000" />
          </div>

          <div class="grid-2" style="gap:16px;margin-bottom:0">
            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-control" v-model="form.department" @change="isDirty=true">
                <option v-for="d in departments" :key="d">{{ d }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <input class="form-control" v-model="form.role" @input="isDirty=true" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Company</label>
            <input class="form-control" v-model="form.company" @input="isDirty=true" />
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input class="form-control" v-model="form.location" @input="isDirty=true" placeholder="City, Country" />
          </div>

          <div class="form-group">
            <label class="form-label">Bio</label>
            <textarea class="form-control" v-model="form.bio" @input="isDirty=true" rows="3" placeholder="Tell us about yourself..." style="resize:vertical"></textarea>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="resetForm" :disabled="!isDirty">Discard changes</button>
            <button class="btn btn-primary" @click="saveProfile" :disabled="saving || !isDirty">
              <span v-if="saving" class="spinner" style="width:14px;height:14px"></span>
              {{ saving ? 'Saving...' : 'Save profile' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { userProfile } from '@/mock/user'
import { useToast } from '@/composables/useToast'

const { toast } = useToast()

const user = ref({ ...userProfile })
const form = ref({
  firstName: user.value.firstName,
  lastName: user.value.lastName,
  email: user.value.email,
  phone: user.value.phone,
  department: user.value.department,
  role: user.value.role,
  company: user.value.company,
  location: user.value.location,
  bio: user.value.bio,
})
const isDirty = ref(false)
const saving = ref(false)
const isDragOver = ref(false)
const uploadedFiles = ref([])
const fileInput = ref(null)

const initials = computed(() => `${form.value.firstName[0]}${form.value.lastName[0]}`)

const departments = ['Operations', 'Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Product', 'Legal']

const statLabels = { ordersManaged: 'Orders', productsListed: 'Products', reportsGenerated: 'Reports', teamMembers: 'Team' }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

async function saveProfile() {
  if (!form.value.firstName || !form.value.lastName || !form.value.email) {
    toast.error('Validation error', 'Please fill in all required fields.')
    return
  }
  saving.value = true
  await new Promise(r => setTimeout(r, 1200))
  Object.assign(user.value, form.value)
  saving.value = false
  isDirty.value = false
  toast.success('Profile updated', 'Your profile has been saved successfully.')
}

function resetForm() {
  Object.keys(form.value).forEach(k => { form.value[k] = user.value[k] })
  isDirty.value = false
}

function handleAvatarClick() {
  toast.info('Coming soon', 'Photo upload will be available in the next release.')
}

function triggerFileInput() { fileInput.value?.click() }

function handleFileSelect(e) {
  const files = Array.from(e.target.files)
  uploadedFiles.value.push(...files)
  toast.success('Files added', `${files.length} file(s) ready to upload.`)
}

function handleDrop(e) {
  isDragOver.value = false
  const files = Array.from(e.dataTransfer.files)
  uploadedFiles.value.push(...files)
  toast.success('Files dropped', `${files.length} file(s) added.`)
}
</script>

<style scoped>
.profile-card { overflow: hidden; }
.profile-hero {
  padding: 32px 24px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--accent-light) 0%, var(--bg-secondary) 100%);
  border-bottom: 1px solid var(--border-color);
}

.profile-avatar-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.profile-avatar {
  background: var(--indigo-600);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
}

.avatar-edit-btn {
  position: absolute;
  bottom: -2px; right: -2px;
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
  background: var(--bg-tertiary);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.profile-role { font-size: 13px; color: var(--text-tertiary); }

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  padding: 16px 12px;
  text-align: center;
  border-right: 1px solid var(--border-color);
}
.stat-item:last-child { border-right: none; }
.stat-value { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-top: 2px; }

.info-list { display: flex; flex-direction: column; gap: 12px; }
.info-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); }
.info-icon { font-size: 16px; flex-shrink: 0; }

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  margin-bottom: 6px;
  font-size: 13px;
}
</style>
