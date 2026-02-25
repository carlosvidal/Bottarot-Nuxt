<template>
  <div class="admin-container">
    <!-- Login -->
    <div v-if="!isAuthenticated" class="login-box">
      <h1>Admin Panel</h1>
      <form @submit.prevent="login">
        <input
          v-model="password"
          type="password"
          placeholder="Admin password"
          class="password-input"
        />
        <button type="submit" class="login-btn">Enter</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>

    <!-- Dashboard -->
    <div v-else class="dashboard">
      <header class="admin-header">
        <h1>Free Tarot Fun Admin</h1>
        <button @click="logout" class="logout-btn">Logout</button>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid" v-if="stats">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.activeSubscriptions }}</div>
          <div class="stat-label">Active Subscriptions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${{ stats.totalRevenue?.toFixed(2) }}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalMessages }}</div>
          <div class="stat-label">Messages</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          Users
        </button>
        <button
          :class="{ active: activeTab === 'subscriptions' }"
          @click="activeTab = 'subscriptions'"
        >
          Subscriptions
        </button>
        <button
          :class="{ active: activeTab === 'payments' }"
          @click="activeTab = 'payments'"
        >
          Payments
        </button>
      </div>

      <!-- Users Table -->
      <div v-if="activeTab === 'users'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Registered</th>
              <th>Last Login</th>
              <th>Plan</th>
              <th>Chats</th>
              <th>Provider</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.email }}</td>
              <td>{{ user.name }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>{{ formatDate(user.last_sign_in) }}</td>
              <td>
                <span :class="['status', user.is_premium ? 'active' : 'inactive']">
                  {{ user.is_premium ? 'Premium' : 'Free' }}
                </span>
              </td>
              <td>{{ user.chat_count }}</td>
              <td class="provider">{{ user.provider }}</td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="7" class="empty">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Subscriptions Table -->
      <div v-if="activeTab === 'subscriptions'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sub in subscriptions" :key="sub.id">
              <td>{{ sub.user_email }}</td>
              <td>{{ sub.plan_name || 'N/A' }}</td>
              <td>
                <span :class="['status', sub.is_active ? 'active' : 'inactive']">
                  {{ sub.is_active ? 'Active' : 'Expired' }}
                </span>
              </td>
              <td>{{ formatDate(sub.subscription_start_date) }}</td>
              <td>{{ formatDate(sub.subscription_end_date) }}</td>
            </tr>
            <tr v-if="subscriptions.length === 0">
              <td colspan="5" class="empty">No subscriptions found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payments Table -->
      <div v-if="activeTab === 'payments'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>PayPal ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.user_email }}</td>
              <td>{{ payment.plan_name || 'N/A' }}</td>
              <td>${{ payment.amount }}</td>
              <td>
                <span :class="['status', payment.status]">
                  {{ payment.status }}
                </span>
              </td>
              <td>{{ formatDate(payment.created_at) }}</td>
              <td class="paypal-id">{{ payment.paypal_order_id || '-' }}</td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="6" class="empty">No payments found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

const password = ref('')
const isAuthenticated = ref(false)
const error = ref('')
const activeTab = ref('users')

const stats = ref(null)
const users = ref([])
const subscriptions = ref([])
const payments = ref([])

onMounted(() => {
  const savedPassword = sessionStorage.getItem('adminPassword')
  if (savedPassword) {
    password.value = savedPassword
    loadData()
  }
})

async function login() {
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { 'x-admin-password': password.value }
    })

    if (res.ok) {
      sessionStorage.setItem('adminPassword', password.value)
      isAuthenticated.value = true
      loadData()
    } else {
      error.value = 'Incorrect password'
    }
  } catch (e) {
    error.value = 'Connection error'
  }
}

function logout() {
  sessionStorage.removeItem('adminPassword')
  isAuthenticated.value = false
  password.value = ''
}

async function loadData() {
  const headers = { 'x-admin-password': password.value }

  try {
    const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers })
    if (statsRes.ok) {
      stats.value = await statsRes.json()
      isAuthenticated.value = true
    }

    const usersRes = await fetch(`${API_URL}/api/admin/users`, { headers })
    if (usersRes.ok) {
      const data = await usersRes.json()
      users.value = data.users || []
    }

    const subsRes = await fetch(`${API_URL}/api/admin/subscriptions`, { headers })
    if (subsRes.ok) {
      const data = await subsRes.json()
      subscriptions.value = data.subscriptions || []
    }

    const payRes = await fetch(`${API_URL}/api/admin/payments`, { headers })
    if (payRes.ok) {
      const data = await payRes.json()
      payments.value = data.payments || []
    }
  } catch (e) {
    console.error('Error loading admin data:', e)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 20px;
  font-family: var(--font-ui);
}

/* Login */
.login-box {
  max-width: 300px;
  margin: 100px auto;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 20px;
  color: var(--color-accent-text);
}

.password-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: var(--btn-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.login-btn:hover {
  background: var(--btn-primary-hover);
}

.error {
  color: var(--color-error);
  margin-top: 10px;
}

/* Dashboard */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  color: var(--color-accent-text);
}

.logout-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--color-accent-text);
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 5px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background: var(--bg-secondary);
  border: none;
  color: var(--text-tertiary);
  border-radius: 6px;
  cursor: pointer;
}

.tabs button.active {
  background: var(--btn-primary);
  color: var(--color-white);
}

/* Table */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-primary);
}

th {
  background: var(--bg-elevated, var(--bg-tertiary));
  color: var(--color-accent-text);
  font-weight: 600;
}

tr:hover {
  background: var(--bg-overlay-light, rgba(255, 255, 255, 0.03));
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.active, .status.completed {
  background: var(--color-success);
  color: var(--color-black);
}

.status.inactive, .status.pending {
  background: var(--color-error);
  color: var(--color-white);
}

.status.failed {
  background: var(--text-secondary);
  color: var(--color-white);
}

.paypal-id {
  font-family: monospace;
  font-size: 11px;
  color: var(--text-tertiary);
}

.provider {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: capitalize;
}

.empty {
  text-align: center;
  color: var(--text-tertiary);
  padding: 40px;
}
</style>
