import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('budget_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('budget_token')
      localStorage.removeItem('budget_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login:    (data) => api.post('/auth/login', data).then((r) => r.data),
  changePassword: (data) => api.put('/auth/change-password', data),
  saveSession(res) {
    localStorage.setItem('budget_token', res.token)
    localStorage.setItem('budget_user', JSON.stringify({ fullName: res.fullName, email: res.email }))
  },
  clearSession() {
    localStorage.removeItem('budget_token')
    localStorage.removeItem('budget_user')
  },
  getUser() {
    const raw = localStorage.getItem('budget_user')
    return raw ? JSON.parse(raw) : null
  },
  isAuthenticated: () => !!localStorage.getItem('budget_token'),
}

export const categoryService = {
  getAll:    ()         => api.get('/categories').then((r) => r.data),
  getByType: (type)     => api.get('/categories', { params: { type } }).then((r) => r.data),
  create:    (data)     => api.post('/categories', data).then((r) => r.data),
  update:    (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  delete:    (id)       => api.delete(`/categories/${id}`),
}

export const transactionService = {
  getAll:     (params)      => api.get('/transactions', { params }).then((r) => r.data),
  create:     (data)        => api.post('/transactions', data).then((r) => r.data),
  update:     (id, data)    => api.put(`/transactions/${id}`, data).then((r) => r.data),
  delete:     (id)          => api.delete(`/transactions/${id}`),
  getSummary: (month, year) => api.get('/transactions/summary', { params: { month, year } }).then((r) => r.data),
}

export const budgetService = {
  getAll:    (month, year) => api.get('/budgets', { params: { month, year } }).then((r) => r.data),
  create:    (data)        => api.post('/budgets', data).then((r) => r.data),
  update:    (id, data)    => api.put(`/budgets/${id}`, data).then((r) => r.data),
  delete:    (id)          => api.delete(`/budgets/${id}`),
  getStatus: (month, year) => api.get('/budgets/status', { params: { month, year } }).then((r) => r.data),
}

export default api
