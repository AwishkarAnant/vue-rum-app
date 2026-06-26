<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">{{ filteredProducts.length }} of {{ products.length }} products</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" @click="toast.info('Upload', 'File upload dialog would open here.')">📁 Import</button>
        <button class="btn btn-primary btn-sm" @click="toast.success('Coming soon', 'Add product form will be available soon.')">+ Add Product</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6" style="margin-bottom:20px">
      <div class="card-body" style="padding:16px">
        <div class="filters-row">
          <div class="search-wrapper" style="flex:1;max-width:360px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="form-control" placeholder="Search products..." v-model="searchQuery" />
          </div>

          <select class="form-control" style="width:160px" v-model="selectedCategory">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <select class="form-control" style="width:160px" v-model="sortBy">
            <option value="name">Sort: Name</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
            <option value="stock">In Stock</option>
          </select>

          <div class="view-toggle">
            <button class="btn btn-sm" :class="viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'" @click="viewMode='grid'">⊞ Grid</button>
            <button class="btn btn-sm" :class="viewMode === 'list' ? 'btn-primary' : 'btn-secondary'" @click="viewMode='list'">☰ List</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner spinner-lg"></div>
      <span>Loading products...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredProducts.length === 0" class="empty-state card">
      <div class="empty-state-icon">📦</div>
      <h3>No products found</h3>
      <p>Try adjusting your search or filter criteria.</p>
      <button class="btn btn-primary" style="margin-top:16px" @click="clearFilters">Clear filters</button>
    </div>

    <!-- Grid view -->
    <div v-else-if="viewMode === 'grid'" class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @click="openModal(product)"
      >
        <div class="product-image-wrap">
          <img :src="product.image" :alt="product.name" loading="lazy" @error="handleImgError" />
          <div class="product-badge" v-if="product.stock < 15">Low stock</div>
        </div>
        <div class="product-info">
          <div class="product-category">{{ product.category }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="flex items-center justify-between" style="margin-top:8px">
            <div class="product-price">${{ product.price.toFixed(2) }}</div>
            <div class="product-rating">⭐ {{ product.rating }}</div>
          </div>
          <div class="stock-badge" :class="product.stock < 15 ? 'low' : 'ok'">
            {{ product.stock }} in stock
          </div>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div v-else class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredProducts" :key="p.id">
              <td>
                <div class="flex items-center gap-2">
                  <img :src="p.image" :alt="p.name" style="width:36px;height:36px;border-radius:6px;object-fit:cover" loading="lazy" />
                  <span style="font-weight:500;color:var(--text-primary)">{{ p.name }}</span>
                </div>
              </td>
              <td><code class="font-mono" style="font-size:11px;background:var(--bg-tertiary);padding:2px 6px;border-radius:4px">{{ p.sku }}</code></td>
              <td><span class="badge badge-info">{{ p.category }}</span></td>
              <td style="font-weight:600;color:var(--accent)">${{ p.price.toFixed(2) }}</td>
              <td>
                <span class="badge" :class="p.stock < 15 ? 'badge-warning' : 'badge-success'">{{ p.stock }}</span>
              </td>
              <td>⭐ {{ p.rating }}</td>
              <td><button class="btn btn-secondary btn-sm" @click="openModal(p)">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->
    <Transition name="fade">
      <div v-if="selectedProduct" class="modal-overlay" @click.self="closeModal">
        <div class="modal modal-product">
          <div class="modal-header">
            <h2 class="modal-title">Product Details</h2>
            <button class="btn btn-ghost btn-icon" @click="closeModal">✕</button>
          </div>
          <div class="modal-body" style="padding:0">
            <div class="product-detail">
              <div class="product-detail-image">
                <img :src="selectedProduct.image" :alt="selectedProduct.name" />
              </div>
              <div class="product-detail-info">
                <div class="text-xs text-muted" style="margin-bottom:6px;text-transform:uppercase;letter-spacing:0.06em">{{ selectedProduct.category }}</div>
                <h3 style="font-size:20px;font-weight:700;margin-bottom:8px">{{ selectedProduct.name }}</h3>
                <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6">{{ selectedProduct.description }}</p>
                <div class="product-meta-grid">
                  <div class="product-meta-item">
                    <span class="meta-label">Price</span>
                    <span class="meta-value" style="color:var(--accent);font-size:22px;font-weight:700">${{ selectedProduct.price.toFixed(2) }}</span>
                  </div>
                  <div class="product-meta-item">
                    <span class="meta-label">SKU</span>
                    <span class="meta-value font-mono">{{ selectedProduct.sku }}</span>
                  </div>
                  <div class="product-meta-item">
                    <span class="meta-label">Stock</span>
                    <span class="meta-value">{{ selectedProduct.stock }} units</span>
                  </div>
                  <div class="product-meta-item">
                    <span class="meta-label">Rating</span>
                    <span class="meta-value">⭐ {{ selectedProduct.rating }} / 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Close</button>
            <button class="btn btn-primary" @click="addToCart">🛒 Add to Order</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { products as allProducts, categories } from '@/mock/products'
import { useToast } from '@/composables/useToast'
import { useSimulatedApi } from '@/composables/useSimulatedApi'

const { toast } = useToast()
const { loading, simulate } = useSimulatedApi()

const products = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const viewMode = ref('grid')
const selectedProduct = ref(null)

const filteredProducts = computed(() => {
  let list = [...products.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }
  if (selectedCategory.value) {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  switch (sortBy.value) {
    case 'price_asc':  list.sort((a,b) => a.price - b.price); break
    case 'price_desc': list.sort((a,b) => b.price - a.price); break
    case 'rating':     list.sort((a,b) => b.rating - a.rating); break
    case 'stock':      list.sort((a,b) => b.stock - a.stock); break
    default:           list.sort((a,b) => a.name.localeCompare(b.name))
  }
  return list
})

function openModal(product) {
  selectedProduct.value = product
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedProduct.value = null
  document.body.style.overflow = ''
}

function addToCart() {
  toast.success('Added to order', `${selectedProduct.value.name} has been added.`)
  closeModal()
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'name'
}

function handleImgError(e) {
  e.target.src = `https://picsum.photos/seed/${Math.random()}/400/400`
}

onMounted(async () => {
  await simulate(() => { products.value = allProducts }, 700)
})
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.view-toggle { display: flex; gap: 4px; }

.product-badge {
  position: absolute;
  top: 8px; left: 8px;
  background: var(--warning);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.product-rating { font-size: 12px; color: var(--text-tertiary); }

.stock-badge {
  font-size: 11px;
  margin-top: 6px;
  font-weight: 500;
}
.stock-badge.low { color: var(--warning); }
.stock-badge.ok  { color: var(--success); }

/* Product detail modal */
.modal-product { max-width: 680px; }
.product-detail { display: grid; grid-template-columns: 1fr 1fr; }
.product-detail-image { aspect-ratio:1; overflow:hidden; background:var(--bg-tertiary); }
.product-detail-image img { width:100%;height:100%;object-fit:cover; }
.product-detail-info { padding: 28px; }

.product-meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.product-meta-item { display:flex; flex-direction:column; gap:4px; }
.meta-label { font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); font-weight:600; }
.meta-value { font-size:14px; font-weight:600; color:var(--text-primary); }

@media (max-width: 580px) {
  .product-detail { grid-template-columns: 1fr; }
}
</style>
