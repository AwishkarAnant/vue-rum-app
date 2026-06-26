<template>
  <div>
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1 class="welcome-title">Good morning, Aarav 👋</h1>
        <p class="welcome-sub">Here's what's happening with your store today. Last updated: {{ now }}</p>
      </div>
      <div class="welcome-actions">
        <button class="btn btn-secondary btn-sm" @click="refreshData">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
        <button class="btn btn-primary btn-sm" @click="exportReport">📊 Export Report</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card card" @click="clickKpi(kpi)">
        <div class="kpi-header">
          <div class="kpi-icon" :style="{ background: kpi.bg, color: kpi.color }">{{ kpi.icon }}</div>
          <div class="trend" :class="kpi.change >= 0 ? 'trend-up' : 'trend-down'">
            <span>{{ kpi.change >= 0 ? '↑' : '↓' }}</span>
            {{ Math.abs(kpi.change) }}%
          </div>
        </div>
        <div class="kpi-value">{{ kpi.formatted }}</div>
        <div class="kpi-label">{{ kpi.label }}</div>
        <div class="progress-bar" style="margin-top:10px">
          <div class="progress-fill" :style="{ width: kpi.progress + '%', background: kpi.color }"></div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2 mb-6" style="margin-bottom:24px">
      <!-- Revenue Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Revenue Trend</div>
            <div class="card-subtitle">2025 vs 2024 comparison</div>
          </div>
          <select class="form-control" style="width:auto;font-size:12px" v-model="chartPeriod">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas ref="revenueChartCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Bar Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">User Growth</div>
            <div class="card-subtitle">New registrations per month</div>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas ref="userChartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity + Pie -->
    <div class="grid-2">
      <!-- Recent Activities -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Recent Activity</div>
          <button class="btn btn-ghost btn-sm" @click="loadMoreActivity">Load more</button>
        </div>
        <div class="card-body" style="padding-top:8px">
          <div v-if="activityLoading" class="loading-overlay" style="padding:24px">
            <div class="spinner"></div>
          </div>
          <div v-else>
            <div v-for="item in displayedActivities" :key="item.id" class="activity-item">
              <div class="activity-dot" :style="{ background: item.color }"></div>
              <div class="activity-content">
                <div class="activity-text">{{ item.text }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Pie -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Sales by Category</div>
          <span class="badge badge-success">Live</span>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:220px">
            <canvas ref="pieChartCanvas"></canvas>
          </div>
          <div class="pie-legend">
            <div class="legend-item" v-for="(label, i) in pieLabels" :key="label">
              <div class="legend-dot" :style="{ background: pieColors[i] }"></div>
              <span>{{ label }}</span>
              <span class="legend-pct">{{ pieValues[i] }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { kpiData, revenueChartData, userGrowthData, categoryPieData, activities } from '@/mock/dashboard'
import { useToast } from '@/composables/useToast'
import { useAppStore } from '@/stores/appStore'

Chart.register(...registerables)

const store = useAppStore()
const { toast } = useToast()

const revenueChartCanvas = ref(null)
const userChartCanvas = ref(null)
const pieChartCanvas = ref(null)
const chartPeriod = ref('monthly')
const activityLoading = ref(false)
const displayedActivities = ref(activities.slice(0, 5))
const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

const kpis = kpiData.map(k => ({ ...k, progress: Math.floor(40 + Math.random() * 50) }))

const pieLabels = categoryPieData.labels
const pieColors = categoryPieData.datasets[0].backgroundColor
const pieValues = categoryPieData.datasets[0].data

let revenueChart, userChart, pieChart

function buildCharts() {
  const isDark = store.theme === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#94a3b8' : '#64748b'

  const sharedOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { cornerRadius: 8, padding: 12 } },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
    }
  }

  if (revenueChart) revenueChart.destroy()
  revenueChart = new Chart(revenueChartCanvas.value, {
    type: 'line',
    data: revenueChartData,
    options: { ...sharedOpts, plugins: { ...sharedOpts.plugins, legend: { display: true, labels: { color: textColor, usePointStyle: true, boxWidth: 8 } } } }
  })

  if (userChart) userChart.destroy()
  userChart = new Chart(userChartCanvas.value, {
    type: 'bar',
    data: userGrowthData,
    options: sharedOpts
  })

  if (pieChart) pieChart.destroy()
  pieChart = new Chart(pieChartCanvas.value, {
    type: 'doughnut',
    data: categoryPieData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { display: false }, tooltip: { cornerRadius: 8 } }
    }
  })
}

async function refreshData() {
  activityLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  activityLoading.value = false
  toast.success('Data refreshed', 'Dashboard data is now up to date.')
}

async function loadMoreActivity() {
  activityLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  displayedActivities.value = [...activities]
  activityLoading.value = false
}

function clickKpi(kpi) {
  toast.info(`${kpi.label}`, `Current value: ${kpi.formatted} (${kpi.change >= 0 ? '+' : ''}${kpi.change}% vs last period)`)
}

async function exportReport() {
  toast.info('Generating report...', 'Your report is being prepared.')
  await new Promise(r => setTimeout(r, 1500))
  toast.success('Report ready', 'Dashboard report has been exported successfully.')
}

onMounted(() => {
  buildCharts()
})
</script>

<style scoped>
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, var(--indigo-600) 0%, var(--violet-600) 100%);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.welcome-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.welcome-sub   { font-size: 13px; color: rgba(255,255,255,0.7); }
.welcome-actions { display: flex; gap: 10px; flex-shrink: 0; }

.kpi-card {
  padding: 20px;
  cursor: pointer;
}
.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.kpi-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:20px; }
.kpi-value { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; margin-bottom: 2px; }
.kpi-label { font-size: 12px; color: var(--text-tertiary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }

.pie-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}
.legend-item { display: flex; align-items: center; gap: 6px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-pct { margin-left: auto; font-weight: 600; color: var(--text-primary); }
</style>
