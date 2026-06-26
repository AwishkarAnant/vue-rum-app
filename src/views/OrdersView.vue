<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Orders</h1>
        <p class="page-subtitle">{{ filteredOrders.length }} orders · ${{ totalRevenue.toLocaleString() }} total revenue</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" @click="exportOrders">📥 Export CSV</button>
        <button class="btn btn-primary btn-sm" @click="toast.success('Order created', 'New draft order has been started.')">+ New Order</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6" style="margin-bottom:20px">
      <div class="card-body" style="padding:16px">
        <div class="filters-row">
          <div class="search-wrapper" style="flex:1;max-width:320px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="form-control" placeholder="Search orders or customers..." v-model="searchQuery" />
          </div>

          <select class="form-control" style="width:150px" v-model="statusFilter">
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s === 'All' ? 'All Statuses' : s }}</option>
          </select>

          <input type="date" class="form-control" style="width:160px" v-model="dateFrom" />
          <span style="color:var(--text-tertiary);font-size:12px">to</span>
          <input type="date" class="form-control" style="width:160px" v-model="dateTo" />

          <button class="btn btn-secondary btn-sm" @click="clearFilters">Clear</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner spinner-lg"></div>
        <span>Loading orders...</span>
      </div>

      <div v-else>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th class="sortable" @click="setSort('orderId')">
                  Order ID {{ sortIcon('orderId') }}
                </th>
                <th class="sortable" @click="setSort('date')">
                  Date {{ sortIcon('date') }}
                </th>
                <th class="sortable" @click="setSort('customer')">
                  Customer {{ sortIcon('customer') }}
                </th>
                <th>Product</th>
                <th class="sortable" @click="setSort('total')">
                  Total {{ sortIcon('total') }}
                </th>
                <th>Qty</th>
                <th class="sortable" @click="setSort('status')">
                  Status {{ sortIcon('status') }}
                </th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order.id">
                <td>
                  <code class="font-mono" style="font-size:11px;background:var(--bg-tertiary);padding:2px 8px;border-radius:4px;color:var(--accent)">
                    {{ order.orderId }}
                  </code>
                </td>
                <td style="color:var(--text-secondary)">{{ order.date }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar avatar-sm" :style="{ background: avatarColor(order.customer) }">
                      {{ order.customer[0] }}
                    </div>
                    <span style="font-weight:500;color:var(--text-primary)">{{ order.customer }}</span>
                  </div>
                </td>
                <td class="truncate" style="max-width:160px">{{ order.product }}</td>
                <td style="font-weight:600">${{ order.total.toFixed(2) }}</td>
                <td style="color:var(--text-secondary)">×{{ order.qty }}</td>
                <td>
                  <span class="badge" :class="statusClass(order.status)">{{ order.status }}</span>
                </td>
                <td style="font-size:12px;color:var(--text-tertiary)">{{ order.paymentMethod }}</td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-ghost btn-sm" @click="viewOrder(order)" title="View">👁</button>
                    <button class="btn btn-ghost btn-sm" @click="deleteOrder(order)" title="Cancel">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pagination-info">
            Showing {{ paginationStart }}-{{ paginationEnd }} of {{ filteredOrders.length }} orders
          </span>
          <div class="pagination">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage = 1">«</button>
            <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
            <button
              v-for="p in pageNumbers"
              :key="p"
              class="pagination-btn"
              :class="{ active: p === currentPage }"
              @click="currentPage = p"
            >{{ p }}</button>
            <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
            <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">»</button>
          </div>
          <select class="form-control" style="width:110px;font-size:12px" v-model="pageSize" @change="currentPage=1">
            <option :value="10">10 / page</option>
            <option :value="20">20 / page</option>
            <option :value="50">50 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Transition name="fade">
      <div v-if="viewingOrder" class="modal-overlay" @click.self="viewingOrder=null">
        <div class="modal">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ viewingOrder.orderId }}</h2>
              <span class="badge" :class="statusClass(viewingOrder.status)">{{ viewingOrder.status }}</span>
            </div>
            <button class="btn btn-ghost btn-icon" @click="viewingOrder=null">✕</button>
          </div>
          <div class="modal-body">
            <div class="order-detail-grid">
              <div class="order-detail-item">
                <span class="detail-label">Customer</span>
                <span class="detail-value">{{ viewingOrder.customer }}</span>
              </div>
              <div class="order-detail-item">
                <span class="detail-label">Date</span>
                <span class="detail-value">{{ viewingOrder.date }}</span>
              </div>
              <div class="order-detail-item">
                <span class="detail-label">Product</span>
                <span class="detail-value">{{ viewingOrder.product }}</span>
              </div>
              <div class="order-detail-item">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">{{ viewingOrder.qty }} units</span>
              </div>
              <div class="order-detail-item">
                <span class="detail-label">Unit Price</span>
                <span class="detail-value">${{ viewingOrder.unitPrice.toFixed(2) }}</span>
              </div>
              <div class="order-detail-item">
                <span class="detail-label">Total</span>
                <span class="detail-value" style="font-size:18px;font-weight:700;color:var(--accent)">${{ viewingOrder.total.toFixed(2) }}</span>
              </div>
              <div class="order-detail-item" style="grid-column:1/-1">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">{{ viewingOrder.paymentMethod }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="viewingOrder=null">Close</button>
            <button class="btn btn-primary" @click="toast.success('Invoice sent', `Invoice for ${viewingOrder.orderId} has been emailed.`); viewingOrder=null">📧 Send Invoice</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orders, orderStatuses } from '@/mock/orders'
import { useToast } from '@/composables/useToast'
import { useSimulatedApi } from '@/composables/useSimulatedApi'

const { toast } = useToast()
const { loading, simulate } = useSimulatedApi()

const allOrders = ref([])
const searchQuery = ref('')
const statusFilter = ref('All')
const dateFrom = ref('')
const dateTo = ref('')
const sortKey = ref('date')
const sortDir = ref('desc')
const currentPage = ref(1)
const pageSize = ref(10)
const viewingOrder = ref(null)

const statusOptions = orderStatuses

const filteredOrders = computed(() => {
  let list = [...allOrders.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o => o.orderId.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q))
  }
  if (statusFilter.value !== 'All') {
    list = list.filter(o => o.status === statusFilter.value)
  }
  if (dateFrom.value) list = list.filter(o => o.date >= dateFrom.value)
  if (dateTo.value)   list = list.filter(o => o.date <= dateTo.value)

  list.sort((a, b) => {
    let va = a[sortKey.value], vb = b[sortKey.value]
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase()
    if (va < vb) return sortDir.value === 'asc' ? -1 : 1
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
  return list
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize.value))
const paginationStart = computed(() => Math.min((currentPage.value - 1) * pageSize.value + 1, filteredOrders.value.length))
const paginationEnd   = computed(() => Math.min(currentPage.value * pageSize.value, filteredOrders.value.length))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredOrders.value.slice(start, start + pageSize.value)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const pages = []
  for (let i = Math.max(1, cur-2); i <= Math.min(total, cur+2); i++) pages.push(i)
  return pages
})

const totalRevenue = computed(() => filteredOrders.value.reduce((s, o) => s + o.total, 0).toFixed(0))

function setSort(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
  currentPage.value = 1
}

function sortIcon(key) {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}

function statusClass(status) {
  const map = {
    'Delivered': 'badge-success', 'Processing': 'badge-info',
    'Shipped': 'badge-default', 'Pending': 'badge-warning',
    'Cancelled': 'badge-danger', 'Refunded': 'badge-danger'
  }
  return map[status] || 'badge-default'
}

const colors = ['#4f46e5','#8b5cf6','#10b981','#f59e0b','#f43f5e','#0ea5e9','#06b6d4','#84cc16']
function avatarColor(name) { return colors[name.charCodeAt(0) % colors.length] + '22' }

function viewOrder(order) { viewingOrder.value = order }

function deleteOrder(order) {
  toast.warning('Order cancelled', `Order ${order.orderId} has been marked as cancelled.`)
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = 'All'
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

async function exportOrders() {
  toast.info('Exporting...', 'Preparing your CSV file.')
  await new Promise(r => setTimeout(r, 1200))
  toast.success('Export complete', 'orders-export.csv has been downloaded.')
}

onMounted(async () => {
  await simulate(() => { allOrders.value = orders }, 600)
})
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--border-color);
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-info { font-size: 12px; color: var(--text-tertiary); white-space: nowrap; }

.order-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.order-detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); font-weight: 600; }
.detail-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
</style>
