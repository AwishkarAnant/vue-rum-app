<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports &amp; Analytics</h1>
        <p class="page-subtitle">Comprehensive business insights and performance metrics</p>
      </div>
      <div class="flex gap-2">
        <select class="form-control" style="width:140px;font-size:13px" v-model="reportPeriod">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">This year</option>
        </select>
        <button class="btn btn-secondary btn-sm" @click="refreshAll">🔄 Refresh</button>
        <button class="btn btn-primary btn-sm" @click="exportReport" :disabled="exporting">
          <span v-if="exporting" class="spinner" style="width:12px;height:12px"></span>
          {{ exporting ? 'Exporting...' : '📥 Export PDF' }}
        </button>
      </div>
    </div>

    <!-- Summary KPIs -->
    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card card" v-for="m in summaryMetrics" :key="m.label">
        <div class="kpi-header">
          <div class="kpi-icon" :style="{ background: m.bg, color: m.color }">{{ m.icon }}</div>
          <div class="trend" :class="m.change >= 0 ? 'trend-up' : 'trend-down'">
            {{ m.change >= 0 ? '↑' : '↓' }}{{ Math.abs(m.change) }}%
          </div>
        </div>
        <div class="kpi-value">{{ m.value }}</div>
        <div class="kpi-label">{{ m.label }}</div>
      </div>
    </div>

    <!-- Top row charts -->
    <div class="grid-2 mb-6" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Revenue Breakdown</div>
          <span class="badge badge-success">Updated live</span>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas ref="revenueCanvas"></canvas>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Order Volume</div>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas ref="ordersCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="card mb-6" style="margin-bottom:24px">
      <div class="card-header">
        <div>
          <div class="card-title">Top Performing Products</div>
          <div class="card-subtitle">By revenue this period</div>
        </div>
        <input type="text" class="form-control" style="width:220px;font-size:13px" v-model="productSearch" placeholder="Filter products..." />
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Revenue</th>
              <th>Growth</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prod, idx) in filteredTopProducts" :key="prod.name">
              <td><span class="rank-badge" :class="['gold','silver','bronze'][idx]">{{ idx + 1 }}</span></td>
              <td style="font-weight:500;color:var(--text-primary)">{{ prod.name }}</td>
              <td><span class="badge badge-info">{{ prod.category }}</span></td>
              <td>{{ prod.units.toLocaleString() }}</td>
              <td style="font-weight:600">${{ prod.revenue.toLocaleString() }}</td>
              <td>
                <span class="trend" :class="prod.growth >= 0 ? 'trend-up' : 'trend-down'">
                  {{ prod.growth >= 0 ? '↑' : '↓' }}{{ Math.abs(prod.growth) }}%
                </span>
              </td>
              <td>
                <div class="share-bar-wrap">
                  <div class="progress-bar" style="width:80px">
                    <div class="progress-fill" :style="{ width: prod.share + '%', background: 'var(--accent)' }"></div>
                  </div>
                  <span style="font-size:11px;color:var(--text-tertiary)">{{ prod.share }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Infinite scroll list (large DOM) -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Transaction Log</div>
          <div class="card-subtitle">Live feed — {{ visibleTransactions.length }} of {{ allTransactions.length }} records</div>
        </div>
        <span class="badge badge-info">Infinite scroll</span>
      </div>
      <div class="card-body" style="padding:0">
        <div class="transaction-list" ref="scrollContainer" @scroll.passive="handleScroll">
          <div v-for="txn in visibleTransactions" :key="txn.id" class="txn-row">
            <div class="txn-type" :class="txn.type">{{ txn.type === 'credit' ? '↑' : '↓' }}</div>
            <div class="txn-detail">
              <span class="txn-title">{{ txn.title }}</span>
              <span class="txn-id font-mono">{{ txn.ref }}</span>
            </div>
            <div class="txn-meta">
              <span class="txn-amount" :class="txn.type">{{ txn.type === 'credit' ? '+' : '-' }}${{ txn.amount.toFixed(2) }}</span>
              <span class="txn-date">{{ txn.date }}</span>
            </div>
          </div>
          <div class="infinite-scroll-sentinel">
            <span v-if="loadingMore" class="spinner"></span>
            <span v-else-if="visibleTransactions.length >= allTransactions.length">All records loaded ✓</span>
            <span v-else>Scroll to load more...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useToast } from '@/composables/useToast'
import { useAppStore } from '@/stores/appStore'

Chart.register(...registerables)

const { toast } = useToast()
const store = useAppStore()

const reportPeriod = ref('30d')
const exporting = ref(false)
const productSearch = ref('')
const revenueCanvas = ref(null)
const ordersCanvas = ref(null)
const scrollContainer = ref(null)
const loadingMore = ref(false)

const summaryMetrics = [
  { label: 'Total Revenue', value: '$284,750', change: 8.7, icon: '💰', color: 'var(--emerald-500)', bg: 'var(--success-light)' },
  { label: 'Conversion Rate', value: '3.84%', change: 1.2, icon: '📈', color: 'var(--accent)', bg: 'var(--accent-light)' },
  { label: 'Avg Order Value', value: '$74.12', change: -2.3, icon: '🛒', color: 'var(--amber-500)', bg: 'var(--warning-light)' },
  { label: 'Return Rate', value: '2.1%', change: -0.4, icon: '🔄', color: 'var(--violet-500)', bg: '#f5f3ff' },
]

const topProducts = [
  { name: 'Standing Desk Electric', category: 'Furniture',   units: 94,  revenue: 79806, growth: 22.4, share: 28 },
  { name: 'Ultra-Wide Monitor 34"', category: 'Electronics', units: 87,  revenue: 60899, growth: 14.1, share: 21 },
  { name: 'Ergonomic Office Chair', category: 'Furniture',   units: 112, revenue: 51408, growth: -3.2, share: 18 },
  { name: 'Pro Wireless Headphones',category: 'Electronics', units: 143, revenue: 42899, growth: 31.7, share: 15 },
  { name: 'Webcam 4K Ultra HD',     category: 'Electronics', units: 165, revenue: 32999, growth: 8.9,  share: 11 },
  { name: 'Noise Cancelling Buds',  category: 'Electronics', units: 182, revenue: 32759, growth: 19.5, share: 11 },
  { name: 'Mechanical Keyboard RGB',category: 'Peripherals', units: 178, revenue: 26699, growth: 5.3,  share: 9  },
]

const filteredTopProducts = computed(() => {
  if (!productSearch.value) return topProducts
  const q = productSearch.value.toLowerCase()
  return topProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
})

// Generate 200 transactions
function generateTransactions(count = 200) {
  const titles = [
    'Order payment received', 'Refund processed', 'Subscription fee',
    'Shipping charge', 'Tax adjustment', 'Loyalty reward', 'Product sale',
    'Gateway fee', 'Currency conversion', 'Promotional discount'
  ]
  const txns = []
  for (let i = 1; i <= count; i++) {
    const isCredit = Math.random() > 0.3
    const d = new Date(2025, 4, 28)
    d.setDate(d.getDate() - Math.floor(i * 0.4))
    txns.push({
      id: i,
      type: isCredit ? 'credit' : 'debit',
      title: titles[i % titles.length],
      ref: `TXN-${String(10000 + i).padStart(5, '0')}`,
      amount: parseFloat((10 + Math.random() * 490).toFixed(2)),
      date: d.toISOString().split('T')[0]
    })
  }
  return txns
}

const allTransactions = generateTransactions(200)
const visibleTransactions = ref(allTransactions.slice(0, 30))

async function handleScroll() {
  const el = scrollContainer.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80
  if (nearBottom && !loadingMore.value && visibleTransactions.value.length < allTransactions.length) {
    loadingMore.value = true
    await new Promise(r => setTimeout(r, 500))
    const cur = visibleTransactions.value.length
    visibleTransactions.value = allTransactions.slice(0, cur + 30)
    loadingMore.value = false
  }
}

let revenueChart, ordersChart

function buildCharts() {
  const isDark = store.theme === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#94a3b8' : '#64748b'

  if (revenueChart) revenueChart.destroy()
  revenueChart = new Chart(revenueCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        { label: 'Product Sales', data: [28000,36000,32000,44000,51000,42000,61000,70000,65000,74000,82000,90000], backgroundColor: 'rgba(79,70,229,0.8)', borderRadius: 5, borderSkipped: false },
        { label: 'Services', data: [8000,9000,10000,11000,12000,11000,14000,15000,16000,17000,17000,18000],       backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 5, borderSkipped: false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: textColor, usePointStyle: true, boxWidth: 8 } } },
      scales: {
        x: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
      }
    }
  })

  if (ordersChart) ordersChart.destroy()
  ordersChart = new Chart(ordersCanvas.value, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        { label: 'Orders',   data: [210,270,248,320,385,310,440,510,480,560,610,680], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981' },
        { label: 'Returns',  data: [12,18,14,22,25,20,28,30,27,31,34,36],              borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.05)',  fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#f43f5e' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: textColor, usePointStyle: true, boxWidth: 8 } } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
      }
    }
  })
}

async function exportReport() {
  exporting.value = true
  toast.info('Generating PDF...', 'Building your analytics report.')
  await new Promise(r => setTimeout(r, 2000))
  exporting.value = false
  toast.success('Report exported', 'analytics-report-2025.pdf has been downloaded.')
}

async function refreshAll() {
  toast.info('Refreshing...', 'Fetching the latest data.')
  await new Promise(r => setTimeout(r, 800))
  buildCharts()
  toast.success('Charts updated', 'All metrics are now current.')
}

onMounted(() => { buildCharts() })
onUnmounted(() => { revenueChart?.destroy(); ordersChart?.destroy() })
</script>

<style scoped>
.rank-badge {
  display: inline-flex;
  width: 22px; height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}
.rank-badge.gold   { background: #fef3c7; color: #92400e; }
.rank-badge.silver { background: #f1f5f9; color: #475569; }
.rank-badge.bronze { background: #fdf2e9; color: #78350f; }

.share-bar-wrap { display: flex; align-items: center; gap: 8px; }

.kpi-card { padding: 20px; }
.kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.kpi-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:20px; }
.kpi-value { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; margin-bottom: 2px; }
.kpi-label { font-size: 12px; color: var(--text-tertiary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }

.transaction-list {
  height: 480px;
  overflow-y: auto;
}

.txn-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s;
}
.txn-row:hover { background: var(--bg-tertiary); }

.txn-type {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.txn-type.credit { background: var(--success-light); color: var(--success); }
.txn-type.debit  { background: var(--danger-light);  color: var(--danger); }

.txn-detail { flex: 1; min-width: 0; }
.txn-title { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); }
.txn-id    { display: block; font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }

.txn-meta { text-align: right; flex-shrink: 0; }
.txn-amount { display: block; font-size: 13px; font-weight: 600; }
.txn-amount.credit { color: var(--success); }
.txn-amount.debit  { color: var(--danger); }
.txn-date { display: block; font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
</style>
