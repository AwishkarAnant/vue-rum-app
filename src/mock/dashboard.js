export const kpiData = [
  {
    id: 'users',
    label: 'Total Users',
    value: 48291,
    formatted: '48,291',
    change: +12.4,
    icon: '👥',
    color: 'var(--indigo-500)',
    bg: 'var(--indigo-50)'
  },
  {
    id: 'revenue',
    label: 'Revenue (MTD)',
    value: 284750,
    formatted: '$284,750',
    change: +8.7,
    icon: '💰',
    color: 'var(--emerald-500)',
    bg: 'var(--success-light)'
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: 3842,
    formatted: '3,842',
    change: -2.1,
    icon: '🛒',
    color: 'var(--amber-500)',
    bg: 'var(--warning-light)'
  },
  {
    id: 'performance',
    label: 'Performance Score',
    value: 94,
    formatted: '94 / 100',
    change: +3.5,
    icon: '⚡',
    color: 'var(--violet-500)',
    bg: '#f5f3ff'
  }
]

export const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue 2025',
      data: [42000, 51000, 48000, 63000, 71000, 59000, 84000, 93000, 88000, 97000, 105000, 112000],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79,70,229,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#4f46e5'
    },
    {
      label: 'Revenue 2024',
      data: [35000, 43000, 41000, 55000, 62000, 50000, 72000, 79000, 76000, 85000, 91000, 98000],
      borderColor: '#a78bfa',
      backgroundColor: 'rgba(167,139,250,0.05)',
      fill: true,
      tension: 0.4,
      borderDash: [5, 4],
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#a78bfa'
    }
  ]
}

export const userGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'New Users',
      data: [1200, 1540, 1390, 1820, 2100, 1970, 2440, 2810, 2660, 3090, 3450, 4200],
      backgroundColor: 'rgba(79,70,229,0.8)',
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}

export const categoryPieData = {
  labels: ['Electronics', 'Peripherals', 'Furniture', 'Storage', 'Accessories', 'Cooling', 'Lighting'],
  datasets: [{
    data: [35, 25, 15, 10, 8, 5, 2],
    backgroundColor: ['#4f46e5','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e','#64748b'],
    borderWidth: 0,
    hoverOffset: 6
  }]
}

export const activities = [
  { id: 1, text: 'New order #ORD-10001 placed by Aarav Patel',       time: '2 min ago',  color: 'var(--accent)',   type: 'order' },
  { id: 2, text: 'Product "Pro Wireless Headphones" updated',         time: '15 min ago', color: 'var(--info)',     type: 'product' },
  { id: 3, text: 'User Sofia Chen registered a new account',          time: '1 hr ago',   color: 'var(--success)', type: 'user' },
  { id: 4, text: 'Order #ORD-10002 shipped via FedEx',                time: '3 hr ago',   color: 'var(--warning)', type: 'shipping' },
  { id: 5, text: 'Report "Q2 Revenue Summary" exported as PDF',       time: '5 hr ago',   color: 'var(--violet-500)', type: 'report' },
  { id: 6, text: 'Refund processed for order #ORD-10026',             time: '8 hr ago',   color: 'var(--danger)',  type: 'refund' },
  { id: 7, text: 'New review: 5★ for "Mechanical Keyboard RGB"',      time: '1 day ago',  color: 'var(--amber-500)', type: 'review' },
  { id: 8, text: 'Inventory alert: "Standing Desk Electric" low (8)', time: '1 day ago',  color: 'var(--danger)',  type: 'alert' },
]
